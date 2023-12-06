import express from 'express';
import {body, matchedData, ValidationChain, validationResult} from 'express-validator';
import {util} from '../util';
import {IValidate} from '../type';

const validateRequest = (validations: ValidationChain[]) => {
    return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        await Promise.all(validations.map(validation => validation.run(req)));
        const errors = validationResult(req);

        if (errors.isEmpty()) {
            req.data = matchedData(req) || req.body;
            return next();
        }

        const errorFormatter = ({location, msg, param, value, nestedErrors}: any) => msg;
        const result         = validationResult(req).formatWith(errorFormatter);
        const finalResult    = expandNestedObjIfHaving(result.mapped(), '.');
        res.return.badRequest(finalResult, {message: 'Invalid Request'});
    }
}

function expandNestedObjIfHaving(target: any, keySeparator: string) {
    const result = {};
    for (const key in target) {
        if (target.hasOwnProperty(key)) {
            const nestedKeys = key.split(keySeparator);

            const leaf   = nestedKeys[nestedKeys.length - 1];
            const branch = nestedKeys.slice(0, nestedKeys.length - 1);

            let currentTarget: any = result;
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

const validateExistGivenVal = async (value: string, checkFn?: Function, errMsg: string = 'Value already exists', ...additionalValue: any[]) => {
    let isError = false;

    if (!checkFn) return true;

    try {
        const exist = (additionalValue && additionalValue.length > 0) ? await checkFn(value, additionalValue) : await checkFn(value);
        if (exist) isError = true;
    } catch (e) {
        isError = true;
    }

    if (isError) {
        throw new Error(errMsg);
    }

    return true;
}

const validateExistEnumVal = async (value: string, enums?: object, errMsg: string = 'Invalid value') => {
    if (!enums) return true;

    if (value.includes(',')) {
        for (const item of value.split(',')) {
            if (!Object.values(enums).includes(item)) {
                throw new Error(errMsg);
            }
        }
    } else {
        if (!Object.values(enums).includes(value)) {
            throw new Error(errMsg);
        }
    }

    return true;
}

const validateUrl = (field: string, errMsg: string = 'Invalid Url', option: { checkDns?: boolean, isOptional?: boolean } = {checkDns: false, isOptional: false}) => {
    return body(field).trim()
                      .isURL({
                                 protocols: ['http', 'https'],
                                 require_protocol: true,
                                 require_valid_protocol: true,
                                 require_tld: true,
                                 require_host: true
                             }).withMessage(errMsg)
                      .custom(async value => {
                          if (option.checkDns) {
                              const verify = await util.dns.isValidUrlDns(value);
                              if (!verify) throw new Error('URL is not valid');
                          }
                      })
                      .optional((option.isOptional ? {values: 'null'} : false));
}

export const validate: IValidate = {
    init: validateRequest,
    existGivenVal: validateExistGivenVal,
    existEnumVal: validateExistEnumVal,
    url: validateUrl
}
