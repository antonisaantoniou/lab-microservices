import config from '../config'
import {CarStatusRabbitMqInterface} from "../types/general";

export class CarStatusHelper {

    public static speedPenalties = config.speedPenalties;

    public static calculatePenalty(speedInKm: number): number {

        let totalPenaltyPoints = 0;

        for ( const speedPenalty of this.speedPenalties) {

            if (speedPenalty.speed > speedInKm) {
                continue;
            }

            const speedDiff = speedInKm - speedPenalty.speed;

            totalPenaltyPoints += speedDiff * speedPenalty.penaltyPoints;
            speedInKm -= speedDiff

        }

        return totalPenaltyPoints;

    }

    public static checkCarStatusMsg(msg: string): void {

        const jsonMsg = JSON.parse(msg) as CarStatusRabbitMqInterface;

        let hasProperStructure = true;

        if (!jsonMsg.car_plate_no || jsonMsg.car_plate_no === '') {
            hasProperStructure = false;
        }

        if (!jsonMsg.driver_license_no || jsonMsg.driver_license_no === '') {
            hasProperStructure = false;
        }

        if (!jsonMsg.speed) {
            hasProperStructure = false;
        }

        if (!jsonMsg.coordinates || !jsonMsg.coordinates.latitude || !jsonMsg.coordinates.longitude) {
            hasProperStructure = false;
        }

        if (!hasProperStructure) {
            throw new Error('Rabbit mq msg does not have the proper structure');
        }

    }

}