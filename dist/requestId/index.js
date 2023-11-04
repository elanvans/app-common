"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRequestId = void 0;
const uid_1 = require("@/uid");
const useRequestId = (req, res, next) => {
    const headerName = 'X-Request-Id';
    const oldValue = req.get(headerName);
    const id = oldValue === undefined ? uid_1.uid.nanoId({ prefix: 'Req-' }) : oldValue;
    res.set(headerName, id);
    req['id'] = id;
    next();
};
exports.useRequestId = useRequestId;
