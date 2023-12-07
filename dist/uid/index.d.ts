import { INanoIdOption } from '../type';
export declare const uid: {
    uuid4: () => string;
    ulId: () => string;
    nanoId: (options?: INanoIdOption) => string;
};
