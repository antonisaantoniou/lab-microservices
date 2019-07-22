import * as mongoose from "mongoose";
import { Schema, Document } from 'mongoose';
import {TripCoordinates} from "../types/trip";

export interface PenaltySchemaInterface extends Document {
    platesNo: string,
    licenseNo: string,
    points: number,
    speed: number,
    geoPoint: TripCoordinates,
    createdAt?: string,
    updatedAt?: string,
}

export interface PenaltyInterface {
    platesNo: string,
    licenseNo: string,
    points: number,
    speed: number,
    geoPoint: TripCoordinates,
    createdAt?: string,
    updatedAt?: string,
}

export enum PenaltySchemaEnum {
    licenseNo = 'licenseNo',
    platesNo = 'platesNo',
    points = 'points',
    geoPoint = 'geoPoint',
    speed = 'speed',
    createdAt = 'createdAt',
    updatedAt = 'updatedAt',
}

const PenaltySchema: Schema = new Schema({
    licenseNo: { type: String, required: true, index: true},
    platesNo: { type: String, required: true, index: true},
    points: { type: Number, required: true},
    speed: { type: Number, required: true},
    geoPoint: {
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
}, { timestamps: true });

export default mongoose.model<PenaltySchemaInterface>('Penalty', PenaltySchema);