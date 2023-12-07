import { INanoIdOption, ILogger, ILoggerOption, ISession, IVisitor, IVisitorLocation, IVisitorUserAgent, IResReturnOptions, IResReturn, IValidate } from './type';
declare global {
    namespace AppCommon {
        interface IRequest {
        }
        interface IResponse {
        }
        interface ISession {
        }
    }
}
export interface IRequest extends AppCommon.IRequest {
    id: string;
    session: ISession & AppCommon.ISession;
    data: any;
    logger: ILogger;
}
export interface IResponse extends AppCommon.IResponse {
    return: IResReturn;
}
declare global {
    namespace Express {
        interface Request extends IRequest {
        }
        interface Response extends IResponse {
        }
    }
}
export type { INanoIdOption, ILogger, ILoggerOption, ISession, IVisitor, IVisitorLocation, IVisitorUserAgent, IValidate, IResReturnOptions, IResReturn };
export { app } from './app';
export { logger, useLogger, useMorganLogger } from './logger';
export { uid } from './uid';
export { useRequestId } from './requestId';
export { useVisitorInfo } from './visitor-info';
export { util } from './util';
export { validate } from './validation';
