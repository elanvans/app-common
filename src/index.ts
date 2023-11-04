import moduleAlias from 'module-alias';

if (process.env.NODE_ENV === "production") {
    moduleAlias.addAliases({
        "@": `${__dirname}`
    })
}

import {
    IRequest, IResponse, INanoIdOption,
    ILogger, ILoggerOption, ISession, IVisitor,
    IVisitorLocation, IVisitorUserAgent
} from '@/type';

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
    IVisitorLocation, IVisitorUserAgent
};
export {app} from '@/app'
export {logger, useLogger, useMorganLogger} from '@/logger';
export {uid} from '@/uid';
export {useRequestId} from '@/requestId';
export {useVisitorInfo} from '@/visitor-info';

console.log('asdasdsadas asdsad asdsad')

