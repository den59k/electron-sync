import { ipcRenderer, IpcRendererEvent } from 'electron'

type KeyOfType<T, V> = keyof {
  [P in keyof T as T[P] extends V? P: never]: any
}

export const proxy = <T>(
  channel: string, 
  methods: KeyOfType<T, Function>[], 
  asyncMethods: KeyOfType<T, (...args: any) => Promise<any>>[] = [],
  syncMethods:  KeyOfType<T, (...args: any) => {}>[] = []
): Pick<T, typeof methods[number] | typeof asyncMethods[number] | typeof syncMethods[number]> => {
    
  const obj: any = {}
  for (let method of methods) {
    obj[method] = (...args: any) => ipcRenderer.send("call", channel, method, ...args)
  }
  for (let method of asyncMethods) {
    obj[method] = (...args: any) => ipcRenderer.invoke("callAsync", channel, method, ...args)
  }
  for (let method of syncMethods) {
    obj[method] = (...args: any) => ipcRenderer.sendSync("callSync", channel, method, ...args)
  }
  return obj
}

export const bridge = {
  on: (channel: string, listener: (e: IpcRendererEvent, ...args: any[]) => void) => {
    ipcRenderer.on(channel, listener)
    return () => ipcRenderer.removeListener(channel, listener)
  },
  sync: (channel: string) => ipcRenderer.sendSync('sync', channel)
}

export type electronAPI = typeof bridge