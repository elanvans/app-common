/// <reference types="node" />
import { RequestHandler } from 'express';
import 'winston-daily-rotate-file';
import { ILogger } from "../type";
export declare const logger: ILogger;
export declare const useLogger: RequestHandler;
export declare const useMorganLogger: (req: import("http").IncomingMessage, res: import("http").ServerResponse<import("http").IncomingMessage>, callback: (err?: Error | undefined) => void) => void;
