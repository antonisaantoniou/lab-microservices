import * as express from 'express';
import Driver, {DriverInterface} from "../../models/Driver";
import {DriverController} from "../../constrollers/DriverController";
import {ApiHelper} from "../../helpers/ApiHelper";
import {check, param} from 'express-validator';
import {CustomError} from "../../error/CustomError";

const router = express.Router();

router.get('/', async (req, res) => {

    ApiHelper.requestWrapper(req, res, async () => {

        const drivers = await DriverController.getAllDrivers();

        const driversResponse = DriverController.getDriversResponseStructure(drivers);

        return { success: true, drivers: driversResponse };

    })
});

router.get('/', async (req, res) => {

    ApiHelper.requestWrapper(req, res, async () => {

        const drivers = await DriverController.getAllDrivers();

        const driversResponse = DriverController.getDriversResponseStructure(drivers);

        return { success: true, drivers: driversResponse };

    })
});

router.get('/:license', [
        // check license parameter if is empty
        param('license').not().isEmpty()
    ], async (req, res) => {

        ApiHelper.requestWrapper(req, res, async () => {

            const params = {
                licenseNo: req.params.license as string
            };

            const driver = await DriverController.getDriverByLicenseNo(params.licenseNo);

            if (driver === null) {
                throw new CustomError('license','Driver does not exist');
            }

            return { success: true, driver: DriverController.getDriverResponseStructure(driver)};

        });

});

router.post('/',[
    // check last name if is not empty
    check('last_name').not().isEmpty(),
    // check last name if is not empty
    check('first_name').not().isEmpty(),
    // check license if is not empty
    check('license_no').not().isEmpty(),
    // check age if is not empty
    check('age').not().isEmpty().isNumeric(),

], async (req, res) => {

    ApiHelper.requestWrapper(req, res, async () => {

        const params: DriverInterface = {
            firstName: req.body.first_name as string,
            lastName: req.body.last_name as string,
            age: req.body.age as number,
            licenseNo: req.body.license_no as string,
        };

        const driver = await DriverController.getDriverByLicenseNo(req.body.license_no);

        if (driver !== null) {
            // check if new plate number exists
            throw new CustomError('license_no','License number already exists');
        }

        const newDriver = await DriverController.createDriver(params.firstName, params.lastName, params.licenseNo, params.age);

        return {success: true, driver: DriverController.getDriverResponseStructure(newDriver)};
    });
});

router.put('/:license',[
    // check license parameter if is empty
    param('license').not().isEmpty()
], async (req, res) => {

    ApiHelper.requestWrapper(req, res, async () => {

        const driver = await DriverController.getDriverByLicenseNo(req.params.license);

        if (driver === null) {
            throw new CustomError('license','Driver does not exist');
        }

        const params = {
            newLisence: (req.body.license_no && req.body.license_no !== '') ? req.body.license_no as string : driver.licenseNo,
            newFirstName: (req.body.first_name && req.body.first_name !== '') ? req.body.first_name as string : driver.firstName,
            newLastName: (req.body.last_name && req.body.last_name !== '') ? req.body.last_name as string : driver.lastName,
            newAge: (req.body.age && req.body.age !== '') ? req.body.age as number : driver.age,
        };

        if (params.newLisence !== driver.licenseNo) {
            // check if new plate number exists
            if (await DriverController.getDriverByLicenseNo(params.newLisence)) {
                throw new CustomError('license_no','License number already exists');
            }
        }

        await DriverController.updateDriver(driver.licenseNo, new Driver( { licenseNo: params.newLisence, firstName: params.newFirstName, lastName: params.newLastName, age: params.newAge}));

        return {success: true};
    });
});

router.delete('/:license', [
    // check license parameter if is empty
    param('license').not().isEmpty()
], async (req, res) => {

    ApiHelper.requestWrapper(req, res, async () => {

        const params = {
            licenseNo: req.params.license as string
        };

        const driver = await DriverController.getDriverByLicenseNo(params.licenseNo);

        if (driver === null) {
            throw new CustomError('license','Driver does not exist');
        }

        await DriverController.deleteDriver(driver);

        return {success: true};
    });
});

// Export the router
export default router;
