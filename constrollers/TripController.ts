import Driver, {DriverInterface, DriverSchemaEnum, DriverSchemaInterface} from "../models/Driver";
import {Logger} from "../helpers/LoggerManager";
import Trip, {TripInterface, TripSchemaEnum, TripSchemaInterface} from "../models/Trip";
import {TripResponseStructure} from "../types/trip";

export class TripController {

    public static async getAllTrips(): Promise<TripSchemaInterface[]> {
        const trips = await Trip.find({});
        return trips;
    }

    public static async getTripByTripId(tripId: number): Promise<TripSchemaInterface> {

        const conditions = {};

        conditions[TripSchemaEnum.tripId] = tripId;

        const trip = await Trip.findOne(conditions);

        return trip;
    }

    public static async createTrip( trip: TripInterface) {

        const newTrip: TripSchemaInterface = new Trip(trip);

        await newTrip.save();

        Logger.info('TripController.createTrip() successfully finished');

        return newTrip;
    }

    public static async updateTrip(previousTripId: number, trip: TripInterface): Promise<void> {

        const conditions = {
            tripId: previousTripId,
        };

        await Trip.updateOne(conditions, trip);

        Logger.info('TripController.updateTrip() successfully finished');

    }

    public static async deleteTrip(tripId: number) {

        const conditions = {
            tripId: tripId
        };

        await Trip.findOneAndDelete(conditions);

        Logger.info('TripController.deleteTrip() successfully finished');

    }

    public static getTripsResponseStructure( trips: TripSchemaInterface[]): TripResponseStructure[] {

        const response = trips.map((trip) => {
            return this.getTripResponseStructure(trip);
        });

        return response;

    }

    public static getTripResponseStructure(trip: TripSchemaInterface): TripResponseStructure {

        return {
            trip_id: trip.tripId,
            starting_point: {
                coordinates: trip.startingPoint.coordinates
            },
            finishing_point: {
                coordinates: trip.finishingPoint.coordinates
            },
            distance: trip.distance
        }

    }
}