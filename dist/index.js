"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useVisitorInfo = exports.useRequestId = exports.uid = exports.useMorganLogger = exports.useLogger = exports.logger = exports.app = void 0;
const module_alias_1 = __importDefault(require("module-alias"));
if (process.env.NODE_ENV === "production") {
    module_alias_1.default.addAliases({
        "@": `${__dirname}`
    });
}
var app_1 = require("@/app");
Object.defineProperty(exports, "app", { enumerable: true, get: function () { return app_1.app; } });
var logger_1 = require("@/logger");
Object.defineProperty(exports, "logger", { enumerable: true, get: function () { return logger_1.logger; } });
Object.defineProperty(exports, "useLogger", { enumerable: true, get: function () { return logger_1.useLogger; } });
Object.defineProperty(exports, "useMorganLogger", { enumerable: true, get: function () { return logger_1.useMorganLogger; } });
var uid_1 = require("@/uid");
Object.defineProperty(exports, "uid", { enumerable: true, get: function () { return uid_1.uid; } });
var requestId_1 = require("@/requestId");
Object.defineProperty(exports, "useRequestId", { enumerable: true, get: function () { return requestId_1.useRequestId; } });
var visitor_info_1 = require("@/visitor-info");
Object.defineProperty(exports, "useVisitorInfo", { enumerable: true, get: function () { return visitor_info_1.useVisitorInfo; } });
console.log('asdasdsadas asdsad asdsad');
