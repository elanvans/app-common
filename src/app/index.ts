import express from 'express';
import helmet from 'helmet';
import {useRequestId} from "../requestId";
import {useLogger, useMorganLogger} from "../logger";
import {useVisitorInfo} from "../visitor-info";
import {useResponseHandler} from '../responseHandler';

export const app = (name: string, port: string) => {
    const _app = express();
    _app.set('name', name);
    _app.set('port', port);

    _app.use(useRequestId);
    _app.use(useResponseHandler);
    _app.use(express.raw());
    _app.use(useLogger);
    _app.use(useVisitorInfo);
    _app.use(useMorganLogger);
    _app.use(helmet({hidePoweredBy: true}));

    return _app;
}
