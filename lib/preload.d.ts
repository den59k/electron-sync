import { IpcRendererEvent } from 'electron';
export declare const proxy: <T, M extends keyof { [P in keyof T as T[P] extends Function ? P : never]: any; }, A extends keyof { [P_1 in keyof T as T[P_1] extends (...args: any) => Promise<any> ? P_1 : never]: any; }, S extends keyof { [P_2 in keyof T as T[P_2] extends (...args: any) => {} ? P_2 : never]: any; }>(channel: string, dummy: T, methods: M[], asyncMethods: A[], syncMethods: S[]) => Pick<T, M | A | S>;
declare type ListenerDisposer = () => void;
export declare const bridge: {
    addListener(channel: string, listener: (e: IpcRendererEvent, ...args: any[]) => void): ListenerDisposer;
    sync(channel: string): any;
};
export declare type electronAPI = typeof bridge;
export {};
