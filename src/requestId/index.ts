import {RequestHandler} from 'express';
import {uid} from '../uid';

export const useRequestId: RequestHandler = (req, res, next) => {
    const headerName = 'X-Request-Id';
    const oldValue   = req.get(headerName);
    const id         = oldValue === undefined ? uid.nanoId({prefix: 'Req-'}) : oldValue;
    res.set(headerName, id);
    req['id'] = id;

    next();
}
