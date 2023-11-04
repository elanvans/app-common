import express, {RequestHandler} from 'express';
import {UAParser} from 'ua-parser-js';
import {IVisitorLocation, IVisitorUserAgent} from "../type";

const regexes = {
    ipv4: /^(?:(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.){3}(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/,
    ipv6: /^((?=.*::)(?!.*::.+::)(::)?([\dA-F]{1,4}:(:|\b)|){5}|([\dA-F]{1,4}:){6})((([\dA-F]{1,4}((?!\3)::|:\b|$))|(?!\2\3)){2}|(((2[0-4]|1\d|[1-9])?\d|25[0-5])\.?\b){4})$/i,
};

function isExist(value: any) {
    return value != null;
}

function isIp(value: any) {
    return (
        (isExist(value) && regexes.ipv4.test(value)) || regexes.ipv6.test(value)
    );
}

function isObject(value: any) {
    return Object(value) === value;
}

function isString(value: any) {
    return Object.prototype.toString.call(value) === '[object String]';
}

function getClientIpFromXForwardedFor(value: any) {
    if (!isExist(value)) {
        return null;
    }

    if (!isString(value)) {
        return null
    }

    const forwardedIps = value.split(',').map((e: string) => {
        const ip = e.trim();
        if (ip.includes(':')) {
            const splitArr = ip.split(':');
            // make sure we only use this if it's ipv4 (ip:port)
            if (splitArr.length === 2) {
                return splitArr[0];
            }
        }
        return ip;
    });

    for (let i = 0; i < forwardedIps.length; i++) {
        if (isIp(forwardedIps[i])) {
            return forwardedIps[i];
        }
    }

    return null;
}

function getClientIp(req: express.Request): string | null {
    try {
        // Server is probably behind a proxy.
        if (req.headers) {
            // Standard headers used by Amazon EC2, Heroku, and others.
            if (req.headers['x-client-ip'] && isIp(req.headers['x-client-ip'])) {
                return req.headers['x-client-ip'] as string;
            }

            // Load-balancers (AWS ELB) or proxies.
            const xForwardedFor = getClientIpFromXForwardedFor(
                req.headers['x-forwarded-for'],
            );

            if (isIp(xForwardedFor)) {
                return xForwardedFor;
            }

            // Cloudflare.
            // CF-Connecting-IP - applied to every request to the origin.
            if (req.headers['cf-connecting-ip'] && isIp(req.headers['cf-connecting-ip'])) {
                return req.headers['cf-connecting-ip'] as string;
            }

            // DigitalOcean.
            // DO-Connecting-IP - applied to app platform servers behind a proxy.
            if (req.headers['do-connecting-ip'] && isIp(req.headers['do-connecting-ip'])) {
                return req.headers['do-connecting-ip'] as string;
            }

            // Fastly and Firebase hosting header (When forwared to cloud function)
            if (req.headers['fastly-client-ip'] && isIp(req.headers['fastly-client-ip'])) {
                return req.headers['fastly-client-ip'] as string;
            }

            // Akamai and Cloudflare: True-Client-IP.
            if (req.headers['true-client-ip'] && isIp(req.headers['true-client-ip'])) {
                return req.headers['true-client-ip'] as string;
            }

            // Default nginx proxy/fcgi; alternative to x-forwarded-for, used by some proxies.
            if (req.headers['x-real-ip'] && isIp(req.headers['x-real-ip'])) {
                return req.headers['x-real-ip'] as string;
            }

            // (Rackspace LB and Riverbed's Stingray)
            if (req.headers['x-cluster-client-ip'] && isIp(req.headers['x-cluster-client-ip'])) {
                return req.headers['x-cluster-client-ip'] as string;
            }

            // Google Cloud App Engine
            if (req.headers['x-appengine-user-ip'] && isIp(req.headers['x-appengine-user-ip'])) {
                return req.headers['x-appengine-user-ip'] as string;
            }

            if (req.headers['x-forwarded'] && isIp(req.headers['x-forwarded'])) {
                return req.headers['x-forwarded'] as string;
            }

            if (req.headers['forwarded-for'] && isIp(req.headers['forwarded-for'])) {
                return req.headers['forwarded-for'] as string;
            }
        }

        if (isExist(req.socket) && isIp(req.socket.remoteAddress)) {
            return req.socket.remoteAddress as string;
        }

        // Cloudflare fallback
        if (req.headers) {
            if (req.headers['Cf-Pseudo-IPv4'] && isIp(req.headers['Cf-Pseudo-IPv4'])) {
                return req.headers['Cf-Pseudo-IPv4'] as string;
            }
        }

        return null;
    } catch (e) {
        return null;
    }
}

function parseVisitorInfo(req: express.Request, header: string) {
    let info: string | null = null;
    try {
        if (req.headers) {
            if (header && req.headers[header] && isExist(req.headers[header]) && isString(req.headers[header])) {
                info = req.headers[header] as string;
            }
        }
    } catch (e) {
        info = null;
    }

    return info;
}

function getVisitorLocation(req: express.Request): IVisitorLocation {
    return {
        city: parseVisitorInfo(req, 'cf-ipcity'),
        country: parseVisitorInfo(req, 'cf-ipcountry'),
        continent: parseVisitorInfo(req, 'cf-ipcontinent'),
        longitude: parseVisitorInfo(req, 'cf-iplongitude'),
        latitude: parseVisitorInfo(req, 'cf-iplatitude'),
        region: parseVisitorInfo(req, 'cf-region'),
        regionCode: parseVisitorInfo(req, 'cf-region-code'),
        metroCode: parseVisitorInfo(req, 'cf-metro-code'),
        postalCode: parseVisitorInfo(req, 'cf-postal-code'),
        timezone: parseVisitorInfo(req, 'cf-timezone')
    }
}

function getUserAgent(req: express.Request): IVisitorUserAgent {
    try {
        const reqUa: string = (req.headers['x-user-agent'] || req.headers['user-agent']) as string;
        const ua            = UAParser(reqUa);

        let browserName = null;
        let deviceName  = null;
        let deviceOS    = null;

        if (ua.browser?.name) browserName = ua.browser.name;
        if (ua.browser?.version && browserName) browserName += ' ' + ua.browser?.version;

        if (ua.os?.name) deviceOS = ua.os?.name;
        if (ua.os?.version && deviceOS) deviceOS += ' ' + ua.os?.version;

        if (ua.device?.vendor) deviceName = ua.device?.vendor;
        if (ua.device?.type) deviceName ? deviceName += ' ' + ua.device.type : ua.device.type;
        if (ua.device?.model && deviceName) deviceName += ' (' + ua.device.model + ')';

        return {
            ua: ua.ua,
            browser: browserName,
            device: deviceName,
            os: deviceOS,
        }

    } catch (e) {
        return {
            ua: null,
            browser: null,
            device: null,
            os: null,
        }
    }
}

export const useVisitorInfo: RequestHandler = (req, res, next) => {
    const clientIp = getClientIp(req);
    const location = getVisitorLocation(req);
    const uAgent   = getUserAgent(req);

    req['session'] = {
        visitor: {
            ip: clientIp,
            location: location,
            userAgent: uAgent
        }
    }

    next();
}


