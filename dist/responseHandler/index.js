"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useResponseHandler = void 0;
const moment_1 = __importDefault(require("moment"));
const useResponseHandler = (req, res, next) => {
    const _send = {};
    _send.ok = (result = null, options) => _buildReturn(res, result, null, options = { statusCode: (options === null || options === void 0 ? void 0 : options.statusCode) || 200, message: (options === null || options === void 0 ? void 0 : options.message) || 'ok', status: (options === null || options === void 0 ? void 0 : options.status) || 'ok' });
    _send.badRequest = (error = null, options) => _buildReturn(res, null, error, options = { statusCode: (options === null || options === void 0 ? void 0 : options.statusCode) || 400, message: (options === null || options === void 0 ? void 0 : options.message) || 'badRequest', status: (options === null || options === void 0 ? void 0 : options.status) || 'badRequest' });
    _send.unauthorized = (error = null, options) => _buildReturn(res, null, error, options = { statusCode: (options === null || options === void 0 ? void 0 : options.statusCode) || 401, message: (options === null || options === void 0 ? void 0 : options.message) || 'unauthorized', status: (options === null || options === void 0 ? void 0 : options.status) || 'unauthorized' });
    _send.forbidden = (error = null, options) => _buildReturn(res, null, error, options = { statusCode: (options === null || options === void 0 ? void 0 : options.statusCode) || 403, message: (options === null || options === void 0 ? void 0 : options.message) || 'forbidden', status: (options === null || options === void 0 ? void 0 : options.status) || 'forbidden' });
    _send.notFound = (error = null, options) => _buildReturn(res, null, error, options = { statusCode: (options === null || options === void 0 ? void 0 : options.statusCode) || 404, message: (options === null || options === void 0 ? void 0 : options.message) || 'notFound', status: (options === null || options === void 0 ? void 0 : options.status) || 'notFound' });
    _send.internalSeverError = (error = null, options) => _buildReturn(res, null, error, options = { statusCode: (options === null || options === void 0 ? void 0 : options.statusCode) || 500, message: (options === null || options === void 0 ? void 0 : options.message) || 'internalSeverError', status: (options === null || options === void 0 ? void 0 : options.status) || 'internalSeverError' });
    res.return = _send;
    next();
};
exports.useResponseHandler = useResponseHandler;
const _buildReturn = (res, result = null, error = null, options) => {
    const _format = {
        timestamp: (0, moment_1.default)().utcOffset('+5:30').format('DD-MMM-YYYY hh:mm:ss A'),
        status: null,
        message: null,
        result: null,
        error: null
    };
    const { message = null, status = null, statusCode = 200 } = Object.assign({}, options);
    _format.status = status;
    _format.message = message;
    _format.result = result;
    _format.error = error;
    return res.status(statusCode).json(_format);
};
