"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const express_validator_1 = require("express-validator");
const util_1 = require("../util");
const validateRequest = (validations) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        yield Promise.all(validations.map(validation => validation.run(req)));
        const errors = (0, express_validator_1.validationResult)(req);
        if (errors.isEmpty()) {
            req.data = (0, express_validator_1.matchedData)(req) || req.body;
            return next();
        }
        const errorFormatter = ({ location, msg, param, value, nestedErrors }) => msg;
        const result = (0, express_validator_1.validationResult)(req).formatWith(errorFormatter);
        const finalResult = expandNestedObjIfHaving(result.mapped(), '.');
        res.return.badRequest(finalResult, { message: 'Invalid Request' });
    });
};
function expandNestedObjIfHaving(target, keySeparator) {
    const result = {};
    for (const key in target) {
        if (target.hasOwnProperty(key)) {
            const nestedKeys = key.split(keySeparator);
            const leaf = nestedKeys[nestedKeys.length - 1];
            const branch = nestedKeys.slice(0, nestedKeys.length - 1);
            let currentTarget = result;
            for (let i = 0; i < branch.length; i += 1) {
                const subKey = nestedKeys[i];
                if (currentTarget[subKey] === undefined) {
                    currentTarget[subKey] = {};
                }
                currentTarget = currentTarget[subKey];
            }
            currentTarget[leaf] = target[key];
        }
    }
    return result;
}
const validateExistGivenVal = (value, checkFn, errMsg = 'Value already exists', ...additionalValue) => __awaiter(void 0, void 0, void 0, function* () {
    let isError = false;
    if (!checkFn)
        return true;
    try {
        const exist = (additionalValue && additionalValue.length > 0) ? yield checkFn(value, additionalValue) : yield checkFn(value);
        if (exist)
            isError = true;
    }
    catch (e) {
        isError = true;
    }
    if (isError) {
        throw new Error(errMsg);
    }
    return true;
});
const validateExistEnumVal = (value, enums, errMsg = 'Invalid value') => __awaiter(void 0, void 0, void 0, function* () {
    if (!enums)
        return true;
    if (value.includes(',')) {
        for (const item of value.split(',')) {
            if (!Object.values(enums).includes(item)) {
                throw new Error(errMsg);
            }
        }
    }
    else {
        if (!Object.values(enums).includes(value)) {
            throw new Error(errMsg);
        }
    }
    return true;
});
const validateUrl = (field, errMsg = 'Invalid Url', option = { checkDns: false, isOptional: false }) => {
    return (0, express_validator_1.body)(field).trim()
        .isURL({
        protocols: ['http', 'https'],
        require_protocol: true,
        require_valid_protocol: true,
        require_tld: true,
        require_host: true
    }).withMessage(errMsg)
        .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
        if (option.checkDns) {
            const verify = yield util_1.util.dns.isValidUrlDns(value);
            if (!verify)
                throw new Error('URL is not valid');
        }
    }))
        .optional((option.isOptional ? { values: 'null' } : false));
};
exports.validate = {
    init: validateRequest,
    existGivenVal: validateExistGivenVal,
    existEnumVal: validateExistEnumVal,
    url: validateUrl
};
