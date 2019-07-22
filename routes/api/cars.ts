import * as express from 'express';
import {ApiHelper} from "../../helpers/ApiHelper";
import {check, param} from 'express-validator';
import {CustomError} from "../../error/CustomError";
import {CarController} from "../../constrollers/CarController";
import Car, {CarInterface, CarSchemaInterface} from "../../models/Car";
import {CarControllerHelper} from "../../helpers/CarControllerHelper";
import {DriverController} from "../../constrollers/DriverController";
import {Document, Types} from "mongoose";
import {DriverSchemaInterface} from "../../models/Driver";


const router = express.Router();

router.get('/', async (req, res) => {

    ApiHelper.requestWrapper(req, res, async () => {

        const cars = await CarController.getAllCars();

        const carsResponse = CarController.getCarsResponseStructure(cars);

        return { success: true, drivers: carsResponse };

    })
});

router.get('/:plate', [
    // check plate parameter if is empty
    param('plate').not().isEmpty()
], async (req, res) => {

    ApiHelper.requestWrapper(req, res, async () => {

        const params = {
            platesNo: req.params.plate as string
        };

        const car = await CarController.getCarByPlatesNo(params.platesNo);

        if (car === null) {
            throw new CustomError('plate','Car does not exist');
        }

        return { success: true, car: CarController.getCarResponseStructure(car)};

    });

});

router.post('/',[
    // check fields
    check('plates_no').not().isEmpty(),
    check('type').not().isEmpty(),
    check('model').not().isEmpty(),
    check('color').not().isEmpty(),
    check('manufacture_date').not().isEmpty(),

], async (req, res) => {

    ApiHelper.requestWrapper(req, res, async () => {

        const params: CarInterface = {
            color: req.body.color as string,
            model: req.body.model.toUpperCase() as string,
            manufactureDate: req.body.manufacture_date as string,
            platesNo: req.body.plates_no as string,
            type: req.body.type as string,
        };

        CarControllerHelper.checkManufactureDate(params.manufactureDate);

        const car = await CarController.getCarByPlatesNo(params.platesNo);

        if (car !== null) {
            // check if new plate number exists
            throw new CustomError('plates_no','Plates number already exists');
        }

        const newCar = await CarController.createCar(params.platesNo, params.model, params.color, params.manufactureDate, params.type);

        return {success: true, car: CarController.getCarResponseStructure(newCar)};
    });
});

router.put('/:plate', [
    // check plate parameter if is empty
    param('plate').not().isEmpty()
], async (req, res) => {

    ApiHelper.requestWrapper(req, res, async () => {

        const car = await CarController.getCarByPlatesNo(req.params.plate);

        if (car === null) {
            throw new CustomError('plate','Car does not exist');
        }

        const params = {
            previousPlatesNo: req.params.plate,
            newColor: (req.body.color && req.body.color !== '') ? req.body.color as string : car.color,
            newModel: (req.body.model && req.body.model !== '') ? req.body.model as string : car.model,
            newManufactureDate: (req.body.manufacture_date && req.body.manufacture_date !== '') ? req.body.manufacture_date as string : car.manufactureDate,
            newPlatesNo: (req.body.plates_no && req.body.plates_no !== '') ? req.body.plates_no as string : car.platesNo,
            newType: (req.body.type && req.body.type !== '') ? req.body.type as string : car.platesNo,
        };

        if (params.newPlatesNo !== car.platesNo) {
            // check if new plate number exists
            if (await CarController.getCarByPlatesNo(params.newPlatesNo)) {
                throw new CustomError('plates_no','Plates number already exists');
            }
        }

        await CarController.updateCar(params.previousPlatesNo, new Car( { platesNo: params.newPlatesNo, model: params.newModel, color: params.newColor, manufactureDate: params.newManufactureDate, type: params.newType }));

        return {success: true};
    });
});

router.delete('/:plate', [
    // check license parameter if is empty
    param('plate').not().isEmpty()
], async (req, res) => {

    ApiHelper.requestWrapper(req, res, async () => {

        const params = {
            platesNo: req.params.plate as string
        };

        const car = await CarController.getCarByPlatesNo(params.platesNo);

        if (car === null) {
            throw new CustomError('plate','Car does not exist');
        }

        await CarController.deleteCar(car);

        return {success: true};
    });
});

// assign a driver to a car
router.put('/:plate/driver/:license',[
    // check parameters
    param('plate').not().isEmpty(),
    param('license').not().isEmpty()
], async (req, res) => {

    ApiHelper.requestWrapper(req, res, async () => {

        const car = await CarController.getCarByPlatesNo(req.params.plate);

        if (car === null) {
            throw new CustomError('plate','Car does not exist');
        }

        const driver = await DriverController.getDriverByLicenseNo(req.params.license);

        if (driver === null) {
            throw new CustomError('license','Driver does not exist');
        }

        if (car.driver) {
            if (car.driver.equals(driver._id)) {
                throw new CustomError('plate','Car is already be assigned to the same driver');
            } else {
                throw new CustomError('plate','Car is already be assigned to a driver');
            }
        }

        if (driver.car) {
            throw new CustomError('license','Driver is already be assigned to a car');
        }

        await CarController.assignDriverToCar(car, driver);

        return {success: true};
    });
});

//remove a driver from a car
router.delete('/:plate/driver/:license',[
    // check parameters
    param('plate').not().isEmpty(),
    param('license').not().isEmpty()
], async (req, res) => {

    ApiHelper.requestWrapper(req, res, async () => {

        const car = await CarController.getCarByPlatesNo(req.params.plate);

        if (car === null) {
            throw new CustomError('plate','Car does not exist');
        }

        const driver = await DriverController.getDriverByLicenseNo(req.params.license);

        if (driver === null) {
            throw new CustomError('license','Driver does not exist');
        }

        if (!car.driver) {
            throw new CustomError('plate','Car does not have a driver');
        }

        if (!driver.car) {
            throw new CustomError('license','Driver is not assigned to a car');
        }

        if (!car.driver.equals(driver._id)) {
            throw new CustomError('plate','Car - driver combination does not match');
        }

        await CarController.removeDriverFromCar(car, driver);

        return {success: true};
    });
});

// Export the router
export default router;
