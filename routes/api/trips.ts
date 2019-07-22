import * as express from 'express';
import {ApiHelper} from "../../helpers/ApiHelper";
import {check, param} from 'express-validator';
import {CustomError} from "../../error/CustomError";
import {CarController} from "../../constrollers/CarController";
import Car, {CarInterface, CarSchemaInterface} from "../../models/Car";
import {CarControllerHelper} from "../../helpers/CarControllerHelper";
import {TripController} from "../../constrollers/TripController";
import {TripInterface} from "../../models/Trip";


const router = express.Router();

router.get('/', async (req, res) => {

    ApiHelper.requestWrapper(req, res, async () => {

        const trips = await TripController.getAllTrips();

        const tripsResponse = TripController.getTripsResponseStructure(trips);

        return { success: true, trips: tripsResponse };

    })
});

router.get('/:trip', [
    // check trip parameter if is empty
    param('trip').not().isEmpty()
], async (req, res) => {

    ApiHelper.requestWrapper(req, res, async () => {

        const params = {
            tripId: req.params.trip as number
        };

        const trip = await TripController.getTripByTripId(params.tripId);

        if (trip === null) {
            throw new CustomError('trip','Trip does not exist');
        }

        return { success: true, trip: TripController.getTripResponseStructure(trip)};

    });

});

router.post('/',[
    // check fields
    check('starting_point').isArray().not().isEmpty(),
    check('finishing_point').isArray().not().isEmpty(),
    check('distance').isNumeric(),
    check('trip_id').isNumeric(),

], async (req, res) => {

    ApiHelper.requestWrapper(req, res, async () => {

        const params: TripInterface = {
            tripId: req.body.trip_id as number,
            distance: req.body.distance as number,
            startingPoint: {
                type: 'Point',
                coordinates: req.body.starting_point as number[]
            },
            finishingPoint: {
                type: 'Point',
                coordinates: req.body.finishing_point as number[]
            }
        };

        const trip = await TripController.getTripByTripId(params.tripId);

        if (trip !== null) {
            // check if new plate number exists
            throw new CustomError('trip_id','Trip already exists');
        }

        const newTrip = await TripController.createTrip(params);

        return {success: true, trip: TripController.getTripResponseStructure(newTrip)};
    });
});

router.put('/:trip',[
    // check trip parameter if is empty
    param('trip').not().isEmpty()
], async (req, res) => {

    ApiHelper.requestWrapper(req, res, async () => {

        const trip = await TripController.getTripByTripId(req.params.trip);

        if (trip === null) {
            throw new CustomError('trip','Trip does not exist');
        }

        const params: TripInterface = {
            tripId: (req.body.trip_id && req.body.trip_id > 0) ? req.body.trip_id as number : trip.tripId,
            distance: (req.body.distance && req.body.trip_id > 0) ? req.body.distance as number : trip.distance,
            startingPoint: {
                type: 'Point',
                coordinates: (req.body.starting_point &&
                    Array.isArray(req.body.starting_point) &&
                    req.body.starting_point.length == 2) ? req.body.starting_point as number[] : trip.startingPoint.coordinates,
            },
            finishingPoint: {
                type: 'Point',
                coordinates: (req.body.finishing_point &&
                Array.isArray(req.body.finishing_point) &&
                req.body.finishing_point.length == 2) ? req.body.finishing_point as number[] : trip.finishingPoint.coordinates,
            }
        };

        if (Number(req.params.trip) !== params.tripId) {
            // check if new trip exists
            if (await TripController.getTripByTripId(params.tripId)) {
                throw new CustomError('trip_id','Trip already exists');
            }
        }

        await TripController.updateTrip(req.params.trip, params);

        return {success: true};
    });
});

router.delete('/:trip', [
    // check license parameter if is empty
    param('trip').not().isEmpty()
], async (req, res) => {

    ApiHelper.requestWrapper(req, res, async () => {

        const params = {
            tripId: req.params.trip as number
        };

        const trip = await TripController.getTripByTripId(params.tripId);

        if (trip === null) {
            throw new CustomError('trip','Trip does not exist');
        }

        await TripController.deleteTrip(params.tripId);

        return {success: true};
    });
});

// Export the router
export default router;
