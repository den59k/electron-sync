import { BaseKey } from ".";
export declare const syncGet: (target: any, prop: string | symbol, baseKey: BaseKey) => any;
export declare const mapMethods: (target: any, prop: string, baseKey: BaseKey) => (...args: any) => any;
export declare const arrayMethod: (target: any, prop: string, baseKey: BaseKey) => (...args: any[]) => void;
