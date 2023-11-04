import winston from 'winston';

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

export interface IRequest {
    id: string;
    session: ISession;
}

export interface IResponse {
}

export interface INanoIdOption {
    size?: number;
    prefix?: string;
}