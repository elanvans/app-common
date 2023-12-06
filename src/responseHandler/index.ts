import {RequestHandler, Response} from 'express';
import moment from 'moment';
import {IResReturnOptions} from '../type';

export const useResponseHandler: RequestHandler = (req, res, next) => {
    const _send: any = {};

    _send.ok                 = (result = null, options: IResReturnOptions) => _buildReturn(res, result, null, options = {statusCode: 200, message: 'ok', status: 'ok'});
    _send.badRequest         = (error = null, options: IResReturnOptions) => _buildReturn(res, null, error, options = {statusCode: 400, message: 'badRequest', status: 'badRequest'});
    _send.unauthorized       = (error = null, options: IResReturnOptions) => _buildReturn(res, null, error, options = {statusCode: 401, message: 'unauthorized', status: 'unauthorized'});
    _send.forbidden          = (error = null, options: IResReturnOptions) => _buildReturn(res, null, error, options = {statusCode: 403, message: 'forbidden', status: 'forbidden'});
    _send.notFound           = (error = null, options: IResReturnOptions) => _buildReturn(res, null, error, options = {statusCode: 404, message: 'notFound', status: 'notFound'});
    _send.internalSeverError = (error = null, options: IResReturnOptions) => _buildReturn(res, null, error, options = {statusCode: 500, message: 'internalSeverError', status: 'internalSeverError'});

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