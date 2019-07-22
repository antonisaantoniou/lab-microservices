import * as express from 'express';
import {Logger} from "./LoggerManager";
import { validationResult } from 'express-validator';
import {CustomError} from "../error/CustomError";

interface ApiResultObjectError {
    code: string;
    number: number;
    message: string;
}

interface ApiResultObject {
    [key: string]: any;
    error?: ApiResultObjectError;
}

export class ApiHelper {

    public static async requestWrapper(req: express.Request, res: express.Response, handler: () => Promise<ApiResultObject>) {

        // Finds the validation errors in this request and wraps them in an object with handy functions
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            Logger.error('ApiHelper.requestWrapper() Express Validation Errors', req, errors.array());
            return res.status(422).json({ error: errors.array() });
        }


        try {

            const handlerResult = await handler();

            res.send(handlerResult);

        } catch (err) {

            Logger.error('ApiHelper.requestWrapper() Error: ', req, err);

            if (err.fieldError != undefined) {
                return res.status(400).send({ field: err.fieldError, msg: err.message });
            } else {
                return res.status(500).send({ error: 'Internal Server Error' });
            }

        }
    }

}