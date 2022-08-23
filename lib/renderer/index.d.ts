declare type IOverload = {
    <T extends object>(channel: string): T;
    <T extends object, V extends object>(channel: string, callback: (obj: T) => V): V;
};
export declare const syncRenderer: IOverload;
export {};
