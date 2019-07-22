import * as mongoose from "mongoose";
import {Schema, Document, Types} from 'mongoose';

export interface CarDriverSchemaInterface extends Document {
    _id: Types.ObjectId,
    driverId: Types.ObjectId,
    carId: Types.ObjectId,
    createdAt?: string,
    updatedAt?: string,
}

export interface CarDriverInterface {
    _id: string,
    driverId: string,
    carId: string,
    createdAt?: string,
    updatedAt?: string,
}

export enum CarDriverSchemaEnum {
    _id = '_id',
    driverId = 'driverId',
    carId = 'carId',
    createdAt = 'createdAt',
    updatedAt = 'updatedAt',
}

const CarDriverSchema: Schema = new Schema({
    _id: {type: Schema.Types.ObjectId, ref: 'Driver', required: true},
    driverId: {type: Schema.Types.ObjectId, ref: 'Driver', required: true},
    carId: {type: Schema.Types.ObjectId, ref: 'Driver', required: true},
}, { timestamps: true });

export default mongoose.model<CarDriverSchemaInterface>('CarDriver', CarDriverSchema);

