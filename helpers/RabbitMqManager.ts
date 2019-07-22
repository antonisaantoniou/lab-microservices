import config from "../config";
import {Logger} from "./LoggerManager";
import {Channel, Connection, Options, Replies} from "amqplib";
import * as amqplib from "amqplib";

export default class RabbitMqManager {

    private static instance: RabbitMqManager;
    private conn: Connection;
    private channel: Channel;
    private queue: Replies.AssertQueue;

    private constructor() {

    }

    public static getInstance() {
        if (!RabbitMqManager.instance) {
            RabbitMqManager.instance = new RabbitMqManager();
        }
        return RabbitMqManager.instance;
    }

    public async init(): Promise<void> {

        try {
            this.conn = await amqplib.connect(config.rabbitMq.url);
            this.channel = await this.conn.createChannel();
            this.queue = await this.channel.assertQueue(config.rabbitMq.carQueueName);
            Logger.info('Server connected with Rabbit Mq');
        } catch (e) {
            Logger.error('Server couldn\'t connect with Rabbit Mq');
            process.exit(-1);
        }

    }

    public getChannel(): Channel {
        return this.channel;
    }

    public getQueue(): Replies.AssertQueue {
        return this.queue;
    }

    public async closeConnection(): Promise<void> {
        await this.conn.close();
    }
}