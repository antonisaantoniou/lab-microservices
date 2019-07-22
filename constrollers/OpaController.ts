import {Logger} from "../helpers/LoggerManager";
import config from "../config";
import rp = require('request-promise');


export class OpaController {

    public static async checkAccess(body: { input: {[key: string]: string | string[]}}): Promise<boolean> {

        const options = {
            method: 'POST',
            uri: config.opaUri,
            body:body,
            json: true // Automatically stringifies the body to JSON
        };

        console.log(config.opaUri);

        return rp(options).then(function (parsedBody) {
                if (!parsedBody.result.allow) {
                    Logger.warn('Access Denied ');
                    return false;
                }

                return true;

            })
            .catch(function (err) {
                throw err;
            });

    }

}