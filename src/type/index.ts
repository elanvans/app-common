import winston from 'winston';
import {ValidationChain} from 'express-validator';
import {RequestHandler} from 'express';

export interface IVisitorLocation {
    city: string | null;
    country: string | null;
    continent: string | null;
    longitude: string | null;
    latitude: string | null;
    region: string | null;
    regionCode: string | null;
    metroCode: string | null;
    postalCode: string | null;
    timezone: string | null;
}

export interface IVisitorUserAgent {
    ua: string | null;
    browser: string | null;
    device: string | null;
    os: string | null;
}

export interface IVisitor {
    ip: string | null;
    location: IVisitorLocation;
    userAgent: IVisitorUserAgent;
}

export interface ISession {
    visitor: IVisitor;
}

export interface ILoggerOption {
    refName?: string;
    file?: string;
}

export interface ILogger {
    info: (message: any, option?: ILoggerOption) => winston.Logger;
    error: (message: any, option?: ILoggerOption) => winston.Logger;
    http: (message: any, option?: ILoggerOption) => winston.Logger;
}

export interface IResReturnOptions {
    statusCode?: number,
    message?: null | string;
    status?: string;
}

export interface IResReturn {
    ok: (result?: null | string | object, options?: IResReturnOptions) => Response;
    badRequest: (error?: null | string | object, options?: IResReturnOptions) => Response;
    unauthorized: (error?: null | string | object, options?: IResReturnOptions) => Response;
    forbidden: (error?: null | string | object, options?: IResReturnOptions) => Response;
    notFound: (error?: null | string | object, options?: IResReturnOptions) => Response;
    internalSeverError: (error?: null | string | object, options?: IResReturnOptions) => Response;
}

export interface IRequest {
    id: string;
    session: ISession;
    data: any;
}

export interface IResponse {
    return: IResReturn;
}

export interface INanoIdOption {
    size?: number;
    prefix?: string;
}

export interface IValidate {
    init: (validations: ValidationChain[]) => RequestHandler;
    existGivenVal: (value: string, checkFn?: Function, errMsg?: string, ...additionalValue: any[]) => Promise<boolean>;
    existEnumVal: (value: string, checkFn?: Function, errMsg?: string) => Promise<boolean>;
    url: (field: string, errMsg?: string, option?: { checkDns?: boolean; isOptional?: boolean; }) => ValidationChain;
}