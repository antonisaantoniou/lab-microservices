import {Logger} from "../helpers/LoggerManager";
import Car, {CarInterface, CarSchemaEnum, CarSchemaInterface} from "../models/Car";
import {CarResponseStructure} from "../types/car";
import {Schema} from "mongoose";
import {DriverController} from "./DriverController";
import {DriverSchemaInterface} from "../models/Driver";
import {RabbitMqController} from "./RabbitMqController";

export class CarController {

    public static async getAllCars() {
        const drivers = await Car.find({});
        return drivers;
    }

    public static async getCarByPlatesNo(platesNo: string) {

        const conditions = {};
        conditions[CarSchemaEnum.platesNo] = platesNo;

        const driver = await Car.findOne(conditions);

        return driver;
    }

    public static async createCar(platesNo: string, model: string, color: string, manufactureDate: string, type: string): Promise<CarSchemaInterface> {

        const newCar: CarSchemaInterface = new Car({
            color: color,
            model: model,
            platesNo: platesNo,
            manufactureDate: manufactureDate,
            type: type,
        });

        await newCar.save();

        Logger.info('CarController.createCar() successfully finished');

        return newCar;
    }

    public static async updateCar(previousPlatesNo: string, car: CarSchemaInterface) {

        const conditions = {
            platesNo: previousPlatesNo,
        };

        const carDoc: CarInterface = {
            platesNo: car.platesNo,
            model: car.model,
            type: car.type,
            color: car.color,
            manufactureDate: car.manufactureDate,
            driver: car.driver,
        }

        await Car.updateOne(conditions, carDoc);

        Logger.info('CarController.updateCar() successfully finished');

    }

    public static async updateCarDriver(carObjectId: Schema.Types.ObjectId, driverObjectId: Schema.Types.ObjectId | undefined ) {

        const conditions = {
            _id: carObjectId,
        };

        const carDoc = {
            driver: driverObjectId,
        };

        const car = await Car.findByIdAndUpdate(conditions, carDoc);

        Logger.info('CarController.updateCarDriver() successfully finished');

        return car;

    }

    public static async deleteCar(car: CarSchemaInterface) {

        const conditions = {
            _id: car._id
        };

        if (car.driver) {

            const driver = await DriverController.updateDriverCar(undefined, car.driver);

            await RabbitMqController.publish({
                car_plates_no: car.platesNo,
                driver_license_no: driver.licenseNo,
                status: 'STOPPED'
            });

        }

        await Car.findByIdAndDelete(conditions);

        Logger.info('CarController.deleteCar() successfully finished');

    }

    public static async assignDriverToCar(car: CarSchemaInterface, driver: DriverSchemaInterface) {

        car.driver = driver._id;
        driver.car = car._id;

        await CarController.updateCarDriver(car._id, driver._id);

        await DriverController.updateDriverCar(car._id, driver._id);

        await RabbitMqController.publish({
            car_plates_no: car.platesNo,
            driver_license_no: driver.licenseNo,
        });

        Logger.info('CarController.assignDriverToCar() successfully finished');

    }

    public static async removeDriverFromCar(car: CarSchemaInterface, driver: DriverSchemaInterface) {

        car.driver = driver._id;
        driver.car = car._id;

        await CarController.updateCarDriver(car._id, undefined);

        await DriverController.updateDriverCar(undefined, driver._id);

        await RabbitMqController.publish({
            car_plates_no: car.platesNo,
            driver_license_no: driver.licenseNo,
            status: 'STOPPED'
        });

        Logger.info('CarController.removeDriverFromCar() successfully finished');

    }

    public static getCarsResponseStructure(cars: CarSchemaInterface[]): CarResponseStructure[] {

        const response = cars.map((car) => {
            return this.getCarResponseStructure(car);
        });

        return response;

    }

    public static getCarResponseStructure(car: CarSchemaInterface): CarResponseStructure {

        return {
                color: car.color,
                model: car.model,
                plates_no: car.platesNo,
                manufacture_date: car.manufactureDate,
                type: car.type,
            };

    }

}