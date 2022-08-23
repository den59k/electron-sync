export declare type BaseKey = (string | number)[];
export declare const send: (baseKey: BaseKey, command: string, ...args: any) => void;
export declare const syncMain: <T extends object>(obj: T, baseKey: BaseKey) => T;
