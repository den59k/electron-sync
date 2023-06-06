import { IpcRendererEvent } from 'electron';
declare type KeyOfType<T, V> = keyof {
    [P in keyof T as T[P] extends V ? P : never]: any;
};
export declare const proxy: <T>(channel: string, methods: (keyof { [P in keyof T as T[P] extends Function ? P : never]: any; })[], asyncMethods?: (keyof { [P_1 in keyof T as T[P_1] extends (...args: any) => Promise<any> ? P_1 : never]: any; })[], syncMethods?: (keyof { [P_2 in keyof T as T[P_2] extends (...args: any) => {} ? P_2 : never]: any; })[]) => Pick<T, keyof { [P in keyof T as T[P] extends Function ? P : never]: any; } | keyof { [P_1 in keyof T as T[P_1] extends (...args: any) => Promise<any> ? P_1 : never]: any; } | keyof { [P_2 in keyof T as T[P_2] extends (...args: any) => {} ? P_2 : never]: any; }>;
export declare const bridge: {
    addListener(channel: string, listener: (e: IpcRendererEvent, ...args: any[]) => void): () => Electron.IpcRenderer;
    listeners(channel: string): Function[];
    sync(channel: string): any;
};
export declare type electronAPI = typeof bridge;
export {};
