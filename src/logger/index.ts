import winston, {transports, format} from 'winston';
import {RequestHandler} from 'express';
import morgan from 'morgan';
import colors from 'colors';
import path from 'path';
import 'winston-daily-rotate-file';
import {ILogger, ILoggerOption} from "../type";

let reqId: string | null                                          = null;
const {combine, timestamp, printf, colorize, align, json, errors} = format;

const myFormat = printf(({level, message, reqId, httpMethod, httpStatusCode, timestamp}) => {
    let _level = `[${level.toUpperCase().padEnd(10)}] : `;
    let _msg   = message;

    if (level === 'http' && httpStatusCode && httpMethod) {
        _level = `[${(httpStatusCode.toString() + ':' + httpMethod).padEnd(10)}] : `;
    }

    if (level === 'info') {
        _msg   = colors.green(_msg);
        _level = colors.green(_level);
    }

    if (level === 'error') {
        _msg   = colors.red(_msg);
        _level = colors.red(_level);
    }

    if (level === 'http') {
        _msg = colors.grey(_msg);
        if (httpStatusCode && httpStatusCode.toString() === '200') {
            _level = colors.green(_level);
        } else {
            _level = colors.red(_level);
        }
    }

    const _msgFormatted = `${_level}${_msg}`;

    return `${colors.grey(`[${timestamp} @ ${reqId}]`)}${_msgFormatted}`;
});

const myFormatFile = printf(({level, message, reqId, httpMethod, httpStatusCode, timestamp}) => {
    let _level = `[${level.toUpperCase().padEnd(10)}] : `;
    let _msg   = message;

    if (level === 'http' && httpStatusCode && httpMethod) {
        _level = `[${(httpStatusCode.toString() + ':' + httpMethod).padEnd(10)}] : `;
    }

    const _msgFormatted = `${_level}${_msg}`;
    return `[${timestamp} @ ${reqId}]${_msgFormatted}`;
});

const _logger = winston.createLogger({
                                         level: 'silly',
                                         format: combine(timestamp({format: 'DD-MMM-YYYY hh:mm:ss A'}),
                                                         format((info) => {
                                                             const {
                                                                       reqId, timestamp, level, message, ...rest
                                                                   } = info;
                                                             return {
                                                                 reqId, timestamp, level, message, ...rest,
                                                             };
                                                         })(),
                                                         errors({stack: true}),
                                                         json({deterministic: false}),
                                                         align()
                                         ),
                                         transports: [
                                             new transports.Console({
                                                                        format: combine(myFormat),
                                                                    }),
                                             new transports.DailyRotateFile({
                                                                                format: combine(myFormatFile),
                                                                                filename: 'logs/log-%DATE%.log',
                                                                                auditFile: 'logs/audit.json',
                                                                                datePattern: 'DD-MMM-YYYY',
                                                                                zippedArchive: true,
                                                                                maxSize: '5m',
                                                                                maxFiles: '15d',
                                                                            }),
                                         ]
                                     });

const _pathResolve = (file: string = '') => {
    let _file = file;
    if (_file !== '') {
        _file = _file.replace(path.resolve() + '\\dist\\', '');
        _file = _file.replace(path.resolve() + '\\src\\', '');
    }
    return _file
}

const _msgParse = (message: any, option?: ILoggerOption) => {
    return (option?.refName || option?.file) ? `[${_pathResolve(option?.file)}@${option?.refName}] ${message}` : `${message}`;
}

export const logger: ILogger = {
    info: (message, option) => _logger.info(`${_msgParse(message, option)}`, {reqId: reqId, httpMethod: null, httpStatusCode: null}),
    error: (message, option) => _logger.error(`${_msgParse(message, option)}`, {reqId: reqId, httpMethod: null, httpStatusCode: null}),
    http: (message, option) => _logger.http(`${_msgParse(message, option)}`, {reqId: reqId, httpMethod: option?.httpMethod || null, httpStatusCode: option?.httpStatusCode || null}),
};

export const useLogger: RequestHandler = (req, res, next) => {
    reqId      = req.id;
    req.logger = logger;
    next();
}

export const useMorganLogger = morgan(
    (tokens, req, res) => {
        return JSON.stringify({
                                  url: tokens.url(req, res),
                                  method: tokens.method(req, res),
                                  responseTime: tokens['response-time'](req, res),
                                  totalTime: tokens['total-time'](req, res),
                                  status: tokens.status(req, res),
                                  httpVersion: tokens['http-version'](req, res),
                                  req: tokens.req(req, res, 'header'),
                                  contentLength: tokens.res(req, res, 'content-length')
                              });
    },
    {
        stream: {
            write(str: string) {
                const data = JSON.parse(str);
                logger.http(str.toString().substring(0, str.toString().lastIndexOf('\n')), {httpMethod: data.method, httpStatusCode: data.status});
            }
        }
    })

