import * as createError from 'http-errors';
import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import * as logger from 'morgan';
import * as path from 'path';
import indexRouter from './routes/api/index';
import {OpaController} from "./constrollers/OpaController";
import * as url from 'url';
const app = express();

app.all(function(req, res, next) {
    res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.setHeader('Expires', '-1');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Content-Type', 'application/json');
    next();
});

app.use(async function (req, res, next) {

    // ** example of OPA usage **
    const dummyUser = req.query.user;

    if (dummyUser) {

        // remove url params and get the path for OPA
        let requestPath = url.parse(req.url).pathname.split('/');
        requestPath.splice(0, 1); // remove empty string

        if (requestPath[requestPath.length - 1] === '') {
            requestPath.pop();
        }

        const reqBody = {
            input: {
                user: dummyUser,
                path: requestPath,
                method: req.method,
            }
        };

        try {
            const allow = await OpaController.checkAccess(reqBody);

            if (!allow) {
                return res.status(403).send('Access denied ' + dummyUser);
            }

        } catch (e) {
            return res.status(503).send('Service not available right now');
        }

    }

    next();

});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.send('Endpoint does not exists');
});

export default app;
