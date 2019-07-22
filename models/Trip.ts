import * as mongoose from "mongoose";
import {Document, Schema} from 'mongoose';
import {TripCoordinates} from "../types/trip";

export interface TripSchemaInterface extends Document {
    tripId: number;
    startingPoint: TripCoordinates;
    finishingPoint: TripCoordinates;
    distance: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface TripInterface {
    tripId: number;
    startingPoint: TripCoordinates;
    finishingPoint: TripCoordinates;
    distance: number;
    createdAt?: string;
    updatedAt?: string;
}

export enum TripSchemaEnum {
    tripId = 'tripId',
    startingPoint = 'startingPoint',
    finishingPoint = 'finishingPoint',
    distance = 'distance',
    createdAt = 'createdAt',
    updatedAt = 'updatedAt',
}

const TripSchema: Schema = new Schema({
    startingPoint: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    finishingPoint: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    tripId: { type: Number, required: true, unique : true},
    distance: { type: Number, required: true}
}, { timestamps: true });

export default mongoose.model<TripSchemaInterface>('Trip', TripSchema);