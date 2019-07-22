import Driver, {DriverInterface, DriverSchemaEnum, DriverSchemaInterface} from '../models/Driver';
import {Logger} from "../helpers/LoggerManager";
import {DriverResponseStructure} from "../types/driver";
import {CarController} from "./CarController";
import {Schema} from "mongoose";
import {RabbitMqController} from "./RabbitMqController";

export class DriverController {

    public static async getAllDrivers() {
        const drivers = await Driver.find({});
        return drivers;
    }

    public static async getDriverByLicenseNo(licenseNo: string) {

        const conditions = {};
        conditions[DriverSchemaEnum.licenseNo] = licenseNo;

        const driver = await Driver.findOne(conditions);

        return driver;
    }

    public static async createDriver(firstName: string, lastName: string, licenseNo: string, age: number) {

        const newDriver: DriverSchemaInterface = new Driver({
            firstName: firstName,
            lastName: lastName,
            licenseNo: licenseNo,
            age: age
        });

        await newDriver.save();

        Logger.info('DriverController.createDriver() successfully finished');

        return newDriver;
    }

    public static async updateDriver(previousLicenseNo: string, driver: DriverSchemaInterface): Promise<void> {

        const conditions = {
            licenseNo: previousLicenseNo,
        };

        const driverDoc: DriverInterface = {
            licenseNo: driver.licenseNo,
            lastName: driver.lastName,
            firstName: driver.firstName,
            age: driver.age,
            car: driver.car,
        };

        await Driver.updateOne(conditions, driverDoc);

        Logger.info('DriverController.updateDriver() successfully finished');

    }

    public static async deleteDriver(driver: DriverSchemaInterface) {

        const conditions = {
            licenseNo: driver.licenseNo
        };

        if (driver.car) {
            const car = await CarController.updateCarDriver(driver.car, undefined);

            await RabbitMqController.publish({
                car_plates_no: car.platesNo,
                driver_license_no: driver.licenseNo,
                status: 'STOPPED'
            });
        }
        await Driver.findOneAndDelete(conditions);

        Logger.info('DriverController.deleteDriver() successfully finished');

    }

    public static async updateDriverCar(carObjectId: Schema.Types.ObjectId, driverObjectId: Schema.Types.ObjectId | undefined ) {

        const conditions = {
            _id: driverObjectId,
        };

        const driverDoc = {
            car: carObjectId,
        };

        const driver = await Driver.findByIdAndUpdate(conditions, driverDoc, {new: true});

        Logger.info('DriverController.updateDriverCar() successfully finished');

        return driver;

    }

    public static getDriversResponseStructure( drivers: DriverSchemaInterface[]): DriverResponseStructure[] {

        const response = drivers.map((driver) => {
            return this.getDriverResponseStructure(driver);
        });

        return response;

    }

    public static getDriverResponseStructure(driver: DriverSchemaInterface): DriverResponseStructure {

        return {
            first_name: driver.firstName,
            last_name: driver.lastName,
            license_no: driver.licenseNo,
            age: driver.age
        }

    }

}