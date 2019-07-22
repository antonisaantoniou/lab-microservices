import * as mongoose from "mongoose";
import config from "../config";
import {Logger} from "./LoggerManager";
import {FeedMongoDBHelper} from "./FeedMongoDBHelper";

export default class MongooseManager {

    private static instance: MongooseManager;
    private url: string;

    private constructor() {
        this.url = config.mongoDbUrl;
    }

    public static getInstance() {
        if (!MongooseManager.instance) {
            MongooseManager.instance = new MongooseManager();
        }
        return MongooseManager.instance;
    }

    public async init(): Promise<void> {

        try {
            await mongoose.connect(config.mongoDbUrl, {
                useNewUrlParser: true,
                poolSize: 10,
                reconnectTries: 30,
            });

            Logger.info('Server connected with Mongo db');
        } catch (e) {
            Logger.error('Server couldn\'t connect with Mongo db');
            process.exit(-1);
        }

        try {
            await FeedMongoDBHelper.dbFeeder();
        } catch (e) {
            Logger.error('Something went wrong with data feeder', e);
            process.exit(-1);
        }

    }

    public async closeConnection(): Promise<void> {
        await mongoose.disconnect();
    }
}