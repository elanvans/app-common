"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uid = void 0;
const uuid_1 = require("uuid");
const nanoid_1 = require("nanoid");
const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const nanoid = (0, nanoid_1.customAlphabet)(alphabet);
exports.uid = {
    uuid4: () => (0, uuid_1.v4)(),
    nanoId: (options) => {
        return ((options === null || options === void 0 ? void 0 : options.prefix) || '') + nanoid((options === null || options === void 0 ? void 0 : options.size) || 25);
    }
};
