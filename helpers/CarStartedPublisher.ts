import * as randomLocation from 'random-location';
import {Logger} from './LoggerManager';
import config from "../config";
import Timer = NodeJS.Timer;
import {Channel} from "amqplib";
import {CarStatusRabbitMqInterface} from "../types/general";

const P = {
    latitude: 35.179589,
    longitude: 33.391868
};

const R = 5000; // meters

export class CarStartedPublisher {

    private carPlateNo: string;
    private driverLicenseNo: string;
    private carDriverKey: string;
    private interval: Timer;
    private channel: Channel;

    constructor(carPlateNo: string, driverLicenseNo: string, channelToSendRandomData: Channel) {
        this.carPlateNo = carPlateNo;
        this.driverLicenseNo = driverLicenseNo;
        this.carDriverKey = `${carPlateNo}:${driverLicenseNo}`;
        this.channel = channelToSendRandomData;
    }

    public startHeartBeats() {

        this.interval = setInterval(() => {

            const randomPoint = randomLocation.randomCirclePoint(P, R);

            const carData: CarStatusRabbitMqInterface = {
                car_plate_no: this.carPlateNo,
                coordinates: randomPoint,
                speed: this.randomSpeed(),
                driver_license_no: this.driverLicenseNo
            };

            this.channel.sendToQueue(config.rabbitMq.carStatusQueueName, Buffer.from(JSON.stringify(carData)));

            Logger.info('Car ' + this.carPlateNo + ' Random Data ', carData);

        }, config.heartBeatTime);

    }

    public stopHeartBeats() {
        clearInterval(this.interval);
    }

    public getCarDriverMapKey() {
        return this.carDriverKey;
    }

    private randomSpeed(): number {
        return Math.round(Math.random() * (config.maxSpeed - config.minSpeed) + config.minSpeed);
    }

}