import {carsDataFeeder} from "../feed/CarFeeder";
import Car from "../models/Car";
import Driver from "../models/Driver";
import Trip from "../models/Trip";
import {tripsDataFeeder} from "../feed/TripFeeder";
import {driversDataFeeder} from "../feed/DriverFeeder";

export class FeedMongoDBHelper {

    public static async dbFeeder() {
        await this.carsFeeder();
        await this.driversFeeder();
        await this.tripsFeeder();
    }


    private static async carsFeeder(): Promise<void> {
        const count = await Car.countDocuments({});

        if (count === 0) {
            await Car.insertMany(carsDataFeeder);
        }
    }

    private static async driversFeeder(): Promise<void> {
        const count = await Driver.countDocuments({});

        if (count === 0) {
            await Driver.insertMany(driversDataFeeder);
        }
    }

    private static async tripsFeeder(): Promise<void> {

        const count = await Trip.countDocuments({});

        if (count === 0) {
            await Trip.insertMany(tripsDataFeeder);
        }
    }

}