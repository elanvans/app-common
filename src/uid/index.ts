import {v4 as uuid4} from 'uuid';
import {customAlphabet} from 'nanoid';
import {INanoIdOption} from '../type';

const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const nanoid   = customAlphabet(alphabet);

export const uid = {
    uuid4: () => uuid4(),
    nanoId: (options?: INanoIdOption) => {
        return (options?.prefix || '') + nanoid(options?.size || 25);
    }
}
