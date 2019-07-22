import {SpeedPenalties} from "../types/general";

require ('custom-env').env(process.env.NODE_ENV);

const config = {
    speedPenalties: speedPenalties(),
    mongoDbUrl: process.env.MONGO_URL,
    rabbitMq: {
        url: process.env.RABBITMQ_URL,
        carQueueName: 'car-started',
        carStatusQueueName: 'car-status',
    },
    heartBeatTime: 5000, // ms
    minSpeed: 10,
    maxSpeed: 140,
    opaUri: process.env.OPA_ADDR + process.env.POLICY_PATH
};

export default config;

function speedPenalties(): SpeedPenalties[] {

    const speedWithPenaltiesArray: SpeedPenalties[] = [];

    speedWithPenaltiesArray.push({
        speed: 60,
        penaltyPoints: 1,
    });

    speedWithPenaltiesArray.push({
        speed: 80,
        penaltyPoints: 2,
    });

    speedWithPenaltiesArray.push({
        speed: 100,
        penaltyPoints: 5,
    });

    return speedWithPenaltiesArray.sort((a,b) => (b.speed > a.speed) ? 1 : ((a.speed> b.speed) ? -1 : 0));
}