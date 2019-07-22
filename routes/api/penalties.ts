import * as express from 'express';
import {ApiHelper} from "../../helpers/ApiHelper";
import {param} from 'express-validator';
import {CustomError} from "../../error/CustomError";
import {DriverController} from "../../constrollers/DriverController";
import {PenaltyController} from "../../constrollers/PenaltyController";


const router = express.Router();

router.get('/', async (req, res) => {

    ApiHelper.requestWrapper(req, res, async () => {

        const penalties = await PenaltyController.getAllPenalties();

        const penaltiesResponse = PenaltyController.getPenaltiesResponseStructure(penalties);

        return { success: true, penalties: penaltiesResponse.response };

    })
});

router.get('/drivers/:license', [
    // check license parameter if is empty
    param('license').not().isEmpty()
], async (req, res) => {

    ApiHelper.requestWrapper(req, res, async () => {

        const driver = await DriverController.getDriverByLicenseNo(req.params.license as string);

        if (driver === null) {
            throw new CustomError('license','Driver does not exist');
        }

        const penalties = await PenaltyController.getPenaltiesByDriverLicense(driver.licenseNo);

        const penaltiesResponse = PenaltyController.getPenaltiesResponseStructure(penalties, true);

        return { success: true, penalties: penaltiesResponse.response, total_points: penaltiesResponse.totalPoints };

    })
});

// Export the router
export default router;
