import * as amqplib from "amqplib";
import config from "./config";
import {Logger} from "./helpers/LoggerManager";
import {CarStartedPublisher} from "./helpers/CarStartedPublisher";
import {Connection} from "amqplib";
import {Channel} from "amqplib";
import {ActiveCarRabbitMqInterface} from "./types/general";

const activeCarsMap = new Map();
let conn: Connection;

createCarStartedConsumer();

async function createCarStartedConsumer() {


    let channel: Channel;

    // Connection with rabbit mq - Consumer
    try {
        conn = await amqplib.connect(config.rabbitMq.url);
        channel = await conn.createChannel();
        await channel.assertQueue(config.rabbitMq.carQueueName);
        await channel.assertQueue(config.rabbitMq.carStatusQueueName);
        Logger.info('Simulation Server connected with Rabbit Mq');
    } catch (e) {
        Logger.error('Simulation Server couldn\'t connect with Rabbit Mq');
        process.exit(-1);
    }

    channel.consume(config.rabbitMq.carQueueName, function(msg) {

        if (msg !== null) {

            const jsonMsg = JSON.parse(msg.content.toString()) as ActiveCarRabbitMqInterface;

            Logger.info('Message received ' , jsonMsg);

            // checks if car is started to move
            if (!jsonMsg.status) {

                const carStarted = new CarStartedPublisher(jsonMsg.car_plates_no, jsonMsg.driver_license_no, channel);
                activeCarsMap.set(carStarted.getCarDriverMapKey(), carStarted);
                carStarted.startHeartBeats();

                Logger.info('Active Cars: ' + activeCarsMap.size);

            } else if ( jsonMsg.status && jsonMsg.status === 'STOPPED'){ // checks if the car stopped

                const mapKey = `${jsonMsg.car_plates_no}:${jsonMsg.driver_license_no}`;


                const carStartedClass = activeCarsMap.get(mapKey) as CarStartedPublisher;

                // checks in the map if the type of car-driver exists
                if (carStartedClass) {
                    carStartedClass.stopHeartBeats();
                    activeCarsMap.delete(mapKey);
                }

                if (activeCarsMap.size === 0) {
                    Logger.info('There in no any active cars');
                } else {
                    Logger.info('Active Cars: ' + activeCarsMap.size);
                }

            } else {
                Logger.warn('RabbitMq message does not have the proper structure');
                channel.nack(msg);
                return;
            }

            channel.ack(msg);
        }
    });

}

process.on('SIGINT', async function () {
    console.log("Caught interrupt signal");

    if (conn) {
        await conn.close();
    }

});