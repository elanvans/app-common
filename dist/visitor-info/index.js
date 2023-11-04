"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useVisitorInfo = void 0;
const ua_parser_js_1 = require("ua-parser-js");
const regexes = {
    ipv4: /^(?:(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.){3}(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/,
    ipv6: /^((?=.*::)(?!.*::.+::)(::)?([\dA-F]{1,4}:(:|\b)|){5}|([\dA-F]{1,4}:){6})((([\dA-F]{1,4}((?!\3)::|:\b|$))|(?!\2\3)){2}|(((2[0-4]|1\d|[1-9])?\d|25[0-5])\.?\b){4})$/i,
};
function isExist(value) {
    return value != null;
}
function isIp(value) {
    return ((isExist(value) && regexes.ipv4.test(value)) || regexes.ipv6.test(value));
}
function isObject(value) {
    return Object(value) === value;
}
function isString(value) {
    return Object.prototype.toString.call(value) === '[object String]';
}
function getClientIpFromXForwardedFor(value) {
    if (!isExist(value)) {
        return null;
    }
    if (!isString(value)) {
        return null;
    }
    const forwardedIps = value.split(',').map((e) => {
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
function getClientIp(req) {
    try {
        // Server is probably behind a proxy.
        if (req.headers) {
            // Standard headers used by Amazon EC2, Heroku, and others.
            if (req.headers['x-client-ip'] && isIp(req.headers['x-client-ip'])) {
                return req.headers['x-client-ip'];
            }
            // Load-balancers (AWS ELB) or proxies.
            const xForwardedFor = getClientIpFromXForwardedFor(req.headers['x-forwarded-for']);
            if (isIp(xForwardedFor)) {
                return xForwardedFor;
            }
            // Cloudflare.
            // CF-Connecting-IP - applied to every request to the origin.
            if (req.headers['cf-connecting-ip'] && isIp(req.headers['cf-connecting-ip'])) {
                return req.headers['cf-connecting-ip'];
            }
            // DigitalOcean.
            // DO-Connecting-IP - applied to app platform servers behind a proxy.
            if (req.headers['do-connecting-ip'] && isIp(req.headers['do-connecting-ip'])) {
                return req.headers['do-connecting-ip'];
            }
            // Fastly and Firebase hosting header (When forwared to cloud function)
            if (req.headers['fastly-client-ip'] && isIp(req.headers['fastly-client-ip'])) {
                return req.headers['fastly-client-ip'];
            }
            // Akamai and Cloudflare: True-Client-IP.
            if (req.headers['true-client-ip'] && isIp(req.headers['true-client-ip'])) {
                return req.headers['true-client-ip'];
            }
            // Default nginx proxy/fcgi; alternative to x-forwarded-for, used by some proxies.
            if (req.headers['x-real-ip'] && isIp(req.headers['x-real-ip'])) {
                return req.headers['x-real-ip'];
            }
            // (Rackspace LB and Riverbed's Stingray)
            if (req.headers['x-cluster-client-ip'] && isIp(req.headers['x-cluster-client-ip'])) {
                return req.headers['x-cluster-client-ip'];
            }
            // Google Cloud App Engine
            if (req.headers['x-appengine-user-ip'] && isIp(req.headers['x-appengine-user-ip'])) {
                return req.headers['x-appengine-user-ip'];
            }
            if (req.headers['x-forwarded'] && isIp(req.headers['x-forwarded'])) {
                return req.headers['x-forwarded'];
            }
            if (req.headers['forwarded-for'] && isIp(req.headers['forwarded-for'])) {
                return req.headers['forwarded-for'];
            }
        }
        if (isExist(req.socket) && isIp(req.socket.remoteAddress)) {
            return req.socket.remoteAddress;
        }
        // Cloudflare fallback
        if (req.headers) {
            if (req.headers['Cf-Pseudo-IPv4'] && isIp(req.headers['Cf-Pseudo-IPv4'])) {
                return req.headers['Cf-Pseudo-IPv4'];
            }
        }
        return null;
    }
    catch (e) {
        return null;
    }
}
function parseVisitorInfo(req, header) {
    let info = null;
    try {
        if (req.headers) {
            if (header && req.headers[header] && isExist(req.headers[header]) && isString(req.headers[header])) {
                info = req.headers[header];
            }
        }
    }
    catch (e) {
        info = null;
    }
    return info;
}
function getVisitorLocation(req) {
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
    };
}
function getUserAgent(req) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    try {
        const reqUa = (req.headers['x-user-agent'] || req.headers['user-agent']);
        const ua = (0, ua_parser_js_1.UAParser)(reqUa);
        let browserName = null;
        let deviceName = null;
        let deviceOS = null;
        if ((_a = ua.browser) === null || _a === void 0 ? void 0 : _a.name)
            browserName = ua.browser.name;
        if (((_b = ua.browser) === null || _b === void 0 ? void 0 : _b.version) && browserName)
            browserName += ' ' + ((_c = ua.browser) === null || _c === void 0 ? void 0 : _c.version);
        if ((_d = ua.os) === null || _d === void 0 ? void 0 : _d.name)
            deviceOS = (_e = ua.os) === null || _e === void 0 ? void 0 : _e.name;
        if (((_f = ua.os) === null || _f === void 0 ? void 0 : _f.version) && deviceOS)
            deviceOS += ' ' + ((_g = ua.os) === null || _g === void 0 ? void 0 : _g.version);
        if ((_h = ua.device) === null || _h === void 0 ? void 0 : _h.vendor)
            deviceName = (_j = ua.device) === null || _j === void 0 ? void 0 : _j.vendor;
        if ((_k = ua.device) === null || _k === void 0 ? void 0 : _k.type)
            deviceName ? deviceName += ' ' + ua.device.type : ua.device.type;
        if (((_l = ua.device) === null || _l === void 0 ? void 0 : _l.model) && deviceName)
            deviceName += ' (' + ua.device.model + ')';
        return {
            ua: ua.ua,
            browser: browserName,
            device: deviceName,
            os: deviceOS,
        };
    }
    catch (e) {
        return {
            ua: null,
            browser: null,
            device: null,
            os: null,
        };
    }
}
const useVisitorInfo = (req, res, next) => {
    const clientIp = getClientIp(req);
    const location = getVisitorLocation(req);
    const uAgent = getUserAgent(req);
    req['session'] = {
        visitor: {
            ip: clientIp,
            location: location,
            userAgent: uAgent
        }
    };
    next();
};
exports.useVisitorInfo = useVisitorInfo;
