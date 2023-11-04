import express from 'express';
import {useLogger, useMorganLogger, useRequestId, useVisitorInfo} from '@/index';
import helmet from 'helmet';

export const app = (name: string, port: string) => {
    const _app = express();
    _app.set('name', name);
    _app.set('port', port);

    _app.use(useRequestId);
    _app.use(express.raw());
    _app.use(useLogger);
    _app.use(useVisitorInfo);
    _app.use(useMorganLogger);
    _app.use(helmet({hidePoweredBy: true}));

    return _app;
}
