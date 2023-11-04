import { INanoIdOption } from '@/type';
export declare const uid: {
    uuid4: () => string;
    nanoId: (options?: INanoIdOption) => string;
};
