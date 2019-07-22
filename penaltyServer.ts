import * as amqplib from "amqplib";
import config from "./config";
import {Logger} from "./helpers/LoggerManager";
import {Connection} from "amqplib";
import {Channel} from "amqplib";
import {CarStatusRabbitMqInterface} from "./types/general";
import MongooseManager from "./helpers/MongooseManager";
import {CarStatusHelper} from "./helpers/CarStatusHelper";
import {PenaltyController} from "./constrollers/PenaltyController";
import {TripCoordinates} from "./types/trip";

let conn: Connection;

createCarStatusConsumer();

async function createCarStatusConsumer() {

    let channel: Channel;

    // Connection with rabbit mq - Consumer
    try {
        conn = await amqplib.connect(config.rabbitMq.url);
        channel = await conn.createChannel();
        await channel.assertQueue(config.rabbitMq.carStatusQueueName);
        Logger.info('Penalty Server connected with Rabbit Mq');
    } catch (e) {
        Logger.error('Penalty Server couldn\'t connect with Rabbit Mq');
        process.exit(-1);
    }

    // init mongoose manager
    await MongooseManager.getInstance().init();

    // create consume listener
    channel.consume(config.rabbitMq.carStatusQueueName, async function (msg) {

        if (msg !== null) {

            const jsonMsg = JSON.parse(msg.content.toString()) as CarStatusRabbitMqInterface;

            try {
                // check msg structure
                CarStatusHelper.checkCarStatusMsg(msg.content.toString());
            } catch (e) {
                Logger.warn('Car Status msg: ', e);
                channel.nack(msg);
            }

            try {
                Logger.info('Message received ' , jsonMsg);
                // calculate penalty points and then add them in db
                const penaltyPoints = CarStatusHelper.calculatePenalty(jsonMsg.speed);
                const coordinates: TripCoordinates = {
                    type: 'Point',
                    coordinates: [jsonMsg.coordinates.latitude, jsonMsg.coordinates.longitude],
                };

                if (penaltyPoints !== 0) {
                    await PenaltyController.addPenalty(jsonMsg.car_plate_no, jsonMsg.driver_license_no, jsonMsg.speed, penaltyPoints, coordinates);
                }
            } catch (e) {
                Logger.warn('Penalty add in db failed: ', e);
                channel.nack(msg);
            }


            channel.ack(msg);
        }
    });

}

process.on('SIGINT', async function () {
    console.log("Caught interrupt signal");

    await MongooseManager.getInstance().closeConnection();

    if (conn) {
        await conn.close();
    }

});