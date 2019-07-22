import RabbitMqManager from "../helpers/RabbitMqManager";
import config from "../config";
import {ActiveCarRabbitMqInterface} from "../types/general";
import {Logger} from "../helpers/LoggerManager";

export class RabbitMqController {

    public static qName= config.rabbitMq.carQueueName;

    public static async publish( msg: ActiveCarRabbitMqInterface): Promise<void> {
        try {
            await RabbitMqManager.getInstance().getChannel().sendToQueue(this.qName, Buffer.from(JSON.stringify(msg)));
        } catch (e) {
            Logger.error('publish error', e);
            throw e;
        }
    }


}