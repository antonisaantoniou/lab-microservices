import * as winston from "winston";
import {format, Logger as wnLogger} from "winston";

class LoggerManager {
    private static instance: LoggerManager;
    private winstonLogger: wnLogger;

    private constructor() {
        winston.remove(winston.transports.Console);
        this.winstonLogger = winston.createLogger({
            level: 'info',
            format: winston.format.json(),
            defaultMeta: { service: 'user-service' },
            transports: [
                new winston.transports.Console({
                    format: format.combine(
                        format.timestamp(),
                        format.colorize(),
                        format.simple()
                    )
                }),
                //
                // - Write to all logs with level `info` and below to `combined.log`
                // - Write all logs error (and below) to `error.log`.
                new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
                new winston.transports.File({ filename: 'logs/combined.log' })
            ]
        });

    }

    public static getInstance() {
        if (!LoggerManager.instance) {
            LoggerManager.instance = new LoggerManager();
        }
        return LoggerManager.instance;
    }

    public silly(message: string, ...meta: any[]): void {
        this.winstonLogger.silly(message, meta);
    }
    public debug(message: string, ...meta: any[]): void {
        this.winstonLogger.debug(message, meta);
    }
    public info(message: string, ...meta: any[]): void {
        this.winstonLogger.info(message, meta);
    }
    public verbose(message: string, ...meta: any[]): void {
        this.winstonLogger.verbose(message, meta);
    }
    public warn(message: string, ...meta: any[]): void {
        this.winstonLogger.warn(message, meta);
    }
    public error(message: string, ...meta: any[]): void {
        this.winstonLogger.error(message, meta);
    }
}

// tslint:disable-next-line:variable-name
export const Logger = LoggerManager.getInstance();

