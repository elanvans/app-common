"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const index_1 = require("@/index");
const helmet_1 = __importDefault(require("helmet"));
const app = (name, port) => {
    const _app = (0, express_1.default)();
    _app.set('name', name);
    _app.set('port', port);
    _app.use(index_1.useRequestId);
    _app.use(express_1.default.raw());
    _app.use(index_1.useLogger);
    _app.use(index_1.useVisitorInfo);
    _app.use(index_1.useMorganLogger);
    _app.use((0, helmet_1.default)({ hidePoweredBy: true }));
    return _app;
};
exports.app = app;
