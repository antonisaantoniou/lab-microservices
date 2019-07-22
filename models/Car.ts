import * as mongoose from "mongoose";
import {Schema, Document, Types} from 'mongoose';

// @ts-ignore
export interface CarSchemaInterface extends Document {
    _id?: Schema.Types.ObjectId,
    color: string,
    model: string,
    platesNo: string,
    manufactureDate: string,
    type: string,
    driver?: Schema.Types.ObjectId,
    createdAt?: string,
    updatedAt?: string,
}

export interface CarInterface {
    color: string,
    model: string,
    manufactureDate: string,
    platesNo: string,
    type: string,
    driver?: Schema.Types.ObjectId,
    createdAt?: string,
    updatedAt?: string,
}

export enum CarSchemaEnum {
    color = 'color',
    model = 'model',
    age = 'age',
    platesNo = 'platesNo',
    type = 'type',
    createdAt = 'createdAt',
    updatedAt = 'updatedAt',
}

const CarSchema: Schema = new Schema({
    color: { type: String, required: true },
    model: { type: String, required: true },
    type: { type: String, required: true },
    manufactureDate: { type: String, required: true},
    platesNo: { type: String, required: true, unique : true},
    driver: {type: Schema.Types.ObjectId, ref: 'Driver', required: false}
}, { timestamps: true });

// @ts-ignore
export default mongoose.model<CarSchemaInterface>('Car', CarSchema);

