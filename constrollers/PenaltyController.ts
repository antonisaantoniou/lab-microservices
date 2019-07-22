import Penalty, {PenaltySchemaInterface} from "../models/Penalty";
import {Logger} from "../helpers/LoggerManager";
import {PenaltyResponseStructure} from "../types/penalty";
import {TripCoordinates} from "../types/trip";

export class PenaltyController {

    public static async getAllPenalties() {
        const penalties = await Penalty.find({});
        return penalties;
    }

    public static async getPenaltiesByDriverLicense(licenseNo: string) {
        const penalties = await Penalty.find({ licenseNo: licenseNo});
        return penalties;
    }

    public static async addPenalty(carPlatesNo: string, driverLicenseNo: string, speed: number, points: number, coordinates: TripCoordinates): Promise<void> {

        const newPenalty: PenaltySchemaInterface = new Penalty({
            platesNo: carPlatesNo,
            licenseNo: driverLicenseNo,
            speed: speed,
            points: points,
            geoPoint: coordinates,
        });

        await newPenalty.save();

        Logger.info('PenaltyController.addPenalty() successfully finished');

    }

    public static getPenaltiesResponseStructure(penalties: PenaltySchemaInterface[], includeTotalPoints: boolean  = false): {response: PenaltyResponseStructure[] , totalPoints: number} {

        let totalPoints = 0;

        const response = penalties.map((penalty) => {

            if (includeTotalPoints) {
                totalPoints += penalty.points;
            }

            return this.getPenaltyResponseStructure(penalty);
        });

        return {
            response,
            totalPoints: totalPoints
        };

    }

    public static getPenaltyResponseStructure(penalty: PenaltySchemaInterface): PenaltyResponseStructure{

        return {
            plates_no: penalty.platesNo,
            license_no: penalty.licenseNo,
            speed: penalty.speed,
            points: penalty.points,
            created_at: penalty.createdAt,
            updated_at: penalty.updatedAt,
        }

    }

}