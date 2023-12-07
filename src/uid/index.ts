import {v4 as uuid4} from 'uuid';
import {customAlphabet} from 'nanoid';
import {monotonicFactory} from 'ulid';
import {INanoIdOption} from '../type';

const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const nanoid   = customAlphabet(alphabet);
const ulId     = monotonicFactory();

export const uid = {
    uuid4: () => uuid4(),
    ulId: () => ulId(),
    nanoId: (options?: INanoIdOption) => {
        return (options?.prefix || '') + nanoid(options?.size || 25);
    }
}
