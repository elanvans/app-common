import {RequestHandler, Response} from 'express';
import moment from 'moment';
import {IResReturnOptions} from '../type';

export const useResponseHandler: RequestHandler = (req, res, next) => {
    const _send: any = {};

    _send.ok                 = (result = null, options: IResReturnOptions) => _buildReturn(res, result, null, options = {statusCode: options?.statusCode || 200, message: options?.message || 'ok', status: options?.status || 'ok'});
    _send.badRequest         = (error = null, options: IResReturnOptions) => _buildReturn(res, null, error, options = {statusCode: options?.statusCode || 400, message: options?.message || 'badRequest', status: options?.status || 'badRequest'});
    _send.unauthorized       = (error = null, options: IResReturnOptions) => _buildReturn(res, null, error, options = {statusCode: options?.statusCode || 401, message: options?.message || 'unauthorized', status: options?.status || 'unauthorized'});
    _send.forbidden          = (error = null, options: IResReturnOptions) => _buildReturn(res, null, error, options = {statusCode: options?.statusCode || 403, message: options?.message || 'forbidden', status: options?.status || 'forbidden'});
    _send.notFound           = (error = null, options: IResReturnOptions) => _buildReturn(res, null, error, options = {statusCode: options?.statusCode || 404, message: options?.message || 'notFound', status: options?.status || 'notFound'});
    _send.internalSeverError = (error = null, options: IResReturnOptions) => _buildReturn(res, null, error, options = {statusCode: options?.statusCode || 500, message: options?.message || 'internalSeverError', status: options?.status || 'internalSeverError'});

    res.return = _send;
    next();
}

const _buildReturn = (res: Response, result: null = null, error = null, options: IResReturnOptions) => {
    const _format: any = {
        timestamp: moment().utcOffset('+5:30').format('DD-MMM-YYYY hh:mm:ss A'),
        status: null,
        message: null,
        result: null,
        error: null
    }

    const {
              message    = null,
              status     = null,
              statusCode = 200
          } = {...options};

    _format.status  = status;
    _format.message = message;
    _format.result  = result;
    _format.error   = error;

    return res.status(statusCode).json(_format);
}