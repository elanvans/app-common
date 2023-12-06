import {
    IRequest, IResponse, INanoIdOption,
    ILogger, ILoggerOption, ISession, IVisitor,
    IVisitorLocation, IVisitorUserAgent, IResReturnOptions,
    IResReturn, IValidate
} from './type';

declare global {
    namespace Express {
        interface Request extends IRequest {
        }

        interface Response extends IResponse {
        }
    }
}

export type {
    IRequest, IResponse, INanoIdOption, ILogger, ILoggerOption, ISession, IVisitor,
    IVisitorLocation, IVisitorUserAgent, IValidate, IResReturnOptions, IResReturn
};
export {app} from './app'
export {logger, useLogger, useMorganLogger} from './logger';
export {uid} from './uid';
export {useRequestId} from './requestId';
export {useVisitorInfo} from './visitor-info';
export {util} from './util';
export {validate} from './validation';


