import type { IpcRendererEvent } from "electron";
import type { bridge } from '../preload'

const objects = new Map<string, object>();

type SyncWrapper = (callback: (e: IpcRendererEvent, arr: SyncArgs) => void) => (e: IpcRendererEvent, arr: SyncArgs) => void
type SyncArgs = [ string[], string, ...any ][]

const onSyncEvent = (e: IpcRendererEvent, arr: SyncArgs) => {
  console.log(arr)
  for (let [ baseKey, command, ...args ] of arr) {
    const item = objects.get(baseKey[0])
    if (!item) continue
    
    let obj: any = item
    const key = baseKey[baseKey.length-1]

    for (let i = 1; i < baseKey.length-1; i++) {
      if (obj instanceof Map) {
        obj = obj.get(baseKey[i])
        continue
      }
      obj = obj[baseKey[i]]
    }
    if (command === "_set") {
      obj[key] = args[0]
    }

    if ([ 'push', 'unshift', 'pop', 'shift', 'splice', 'set', 'add', 'delete', 'clear' ].includes(command)) {
      // console.log(obj, key, command, args)
      if (obj instanceof Map) {
        obj.get(key)[command](...args)
      } else {
        obj[key][command](...args)
      }
    }
  }
}

const _window = window as unknown as (Window & { electron: typeof bridge })

let syncEventDispose = _window.electron.addListener('sync', onSyncEvent)

export const setActionWrapper = (wrapper: SyncWrapper) => {
  syncEventDispose()
  syncEventDispose = _window.electron.addListener('sync', wrapper(onSyncEvent))
}

type IOverload = {
  <T extends object>(channel: string): T;
  <T extends object,V extends object>(channel: string, callback: (obj: T) => V): V;
}

export const syncRenderer: IOverload = (channel: string, callback?: (obj: any) => any) => {
  const item = objects.get(channel)
  if (item) return item as any

  const _obj = _window.electron.sync(channel)
  const obj = callback? callback(_obj): _obj
  objects.set(channel, obj)

  return obj
}

