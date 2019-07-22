#!/usr/bin/env node

import app from './app';
import * as http from 'http';
import * as winston from 'winston';
import {ExpressError} from 'express';
import {Logger} from "./helpers/LoggerManager";
import MongooseManager from './helpers/MongooseManager';
import RabbitMqManager from "./helpers/RabbitMqManager";

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '3000');

app.set('port', port);

const server = http.createServer(app);

/**
 * Create HTTP server.
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
server.on('close', () => {console.log('server closed')});

async function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;

    await MongooseManager.getInstance().init();
    await RabbitMqManager.getInstance().init();

    Logger.info('Webserver started on: ', bind);
}


/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: string): number | boolean | string {
    const normPort = parseInt(val, 10);

    if (isNaN(normPort)) {
        // named pipe
        return val;
    }

    if (normPort >= 0) {
        // port number
        return normPort;
    }

    return false;
}

/**
 * Event listener for HTTP server “error” event.
 */

function onError(error: ExpressError) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            winston.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            winston.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

process.on('SIGINT', async function () {
    console.log("Caught interrupt signal");

    await MongooseManager.getInstance().closeConnection();
    await RabbitMqManager.getInstance().closeConnection();

});