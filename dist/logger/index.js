"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMorganLogger = exports.useLogger = exports.logger = void 0;
const winston_1 = __importStar(require("winston"));
const morgan_1 = __importDefault(require("morgan"));
const colors_1 = __importDefault(require("colors"));
const path_1 = __importDefault(require("path"));
require("winston-daily-rotate-file");
let reqId = null;
const { combine, timestamp, printf, colorize, align, json, errors } = winston_1.format;
const myFormat = printf(({ level, message, reqId, httpMethod, httpStatusCode, timestamp }) => {
    let _level = `[${level.toUpperCase().padEnd(10)}] : `;
    let _msg = message;
    if (level === 'http' && httpStatusCode && httpMethod) {
        _level = `[${(httpStatusCode.toString() + ':' + httpMethod).padEnd(10)}] : `;
    }
    if (level === 'info') {
        _msg = colors_1.default.green(_msg);
        _level = colors_1.default.green(_level);
    }
    if (level === 'error') {
        _msg = colors_1.default.red(_msg);
        _level = colors_1.default.red(_level);
    }
    if (level === 'http') {
        _msg = colors_1.default.grey(_msg);
        if (httpStatusCode && httpStatusCode.toString() === '200') {
            _level = colors_1.default.green(_level);
        }
        else {
            _level = colors_1.default.red(_level);
        }
    }
    const _msgFormatted = `${_level}${_msg}`;
    return `${colors_1.default.grey(`[${timestamp} @ ${reqId}]`)}${_msgFormatted}`;
});
const myFormatFile = printf(({ level, message, reqId, httpMethod, httpStatusCode, timestamp }) => {
    let _level = `[${level.toUpperCase().padEnd(10)}] : `;
    let _msg = message;
    if (level === 'http' && httpStatusCode && httpMethod) {
        _level = `[${(httpStatusCode.toString() + ':' + httpMethod).padEnd(10)}] : `;
    }
    const _msgFormatted = `${_level}${_msg}`;
    return `[${timestamp} @ ${reqId}]${_msgFormatted}`;
});
const _logger = winston_1.default.createLogger({
    level: 'silly',
    format: combine(timestamp({ format: 'DD-MMM-YYYY hh:mm:ss A' }), (0, winston_1.format)((info) => {
        const { reqId, timestamp, level, message } = info, rest = __rest(info, ["reqId", "timestamp", "level", "message"]);
        return Object.assign({ reqId, timestamp, level, message }, rest);
    })(), errors({ stack: true }), json({ deterministic: false }), align()),
    transports: [
        new winston_1.transports.Console({
            format: combine(myFormat),
        }),
        new winston_1.transports.DailyRotateFile({
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
const _pathResolve = (file = '') => {
    let _file = file;
    if (_file !== '') {
        _file = _file.replace(path_1.default.resolve() + '\\dist\\', '');
        _file = _file.replace(path_1.default.resolve() + '\\src\\', '');
    }
    return _file;
};
const _msgParse = (message, option) => {
    return ((option === null || option === void 0 ? void 0 : option.refName) || (option === null || option === void 0 ? void 0 : option.file)) ? `[${_pathResolve(option === null || option === void 0 ? void 0 : option.file)}@${option === null || option === void 0 ? void 0 : option.refName}] ${message}` : `${message}`;
};
exports.logger = {
    info: (message, option) => _logger.info(`${_msgParse(message, option)}`, { reqId: reqId, httpMethod: null, httpStatusCode: null }),
    error: (message, option) => _logger.error(`${_msgParse(message, option)}`, { reqId: reqId, httpMethod: null, httpStatusCode: null }),
    http: (message, option) => _logger.http(`${_msgParse(message, option)}`, { reqId: reqId, httpMethod: (option === null || option === void 0 ? void 0 : option.httpMethod) || null, httpStatusCode: (option === null || option === void 0 ? void 0 : option.httpStatusCode) || null }),
};
const useLogger = (req, res, next) => {
    reqId = req.id;
    req.logger = exports.logger;
    next();
};
exports.useLogger = useLogger;
exports.useMorganLogger = (0, morgan_1.default)((tokens, req, res) => {
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
}, {
    stream: {
        write(str) {
            const data = JSON.parse(str);
            exports.logger.http(str.toString().substring(0, str.toString().lastIndexOf('\n')), { httpMethod: data.method, httpStatusCode: data.status });
        }
    }
});
