import * as mongoose from "mongoose";
import { Schema, Document } from 'mongoose';

export interface DriverSchemaInterface extends Document {
    firstName: string,
    lastName: string,
    licenseNo: string,
    age: number,
    car?: Schema.Types.ObjectId,
    createdAt?: string,
    updatedAt?: string,
}

export interface DriverInterface {
    firstName: string,
    lastName: string,
    licenseNo: string,
    age: number,
    car?: Schema.Types.ObjectId,
    createdAt?: string,
    updatedAt?: string,
}

export enum DriverSchemaEnum {
    firstName = 'firstName',
    lastName = 'lastName',
    licenseNo = 'licenseNo',
    age = 'age',
    car = 'car',
    createdAt = 'createdAt',
    updatedAt = 'updatedAt',
}

const DriverSchema: Schema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    licenseNo: { type: String, required: true, unique : true},
    age: { type: Number, required: true},
    car: {type: Schema.Types.ObjectId, ref: 'Car', required: false}
}, { timestamps: true });

export default mongoose.model<DriverSchemaInterface>('Driver', DriverSchema);