import { ipcMain, WebContents } from "electron"
import { toJS } from "./to-js"
import { syncGet } from "./utils"

export type BaseKey = (string | number)[]

const objects = new Map<string, object>()
const subs = new Map<string, WebContents[]>()

ipcMain.on("sync", (e, channel: string) => {
  const arr = subs.get(channel) || []
  if (!arr.find(item => item.id === e.sender.id)) {
    arr.push(e.sender)
    subs.set(channel, arr)
  }

  e.returnValue = toJS(objects.get(channel)) || null
})

export const send = (baseKey: BaseKey, command: string, ...args: any) => {
  const sub = subs.get(baseKey[0] as string)
  if (!sub) return

  for (let webContent of sub) {
    if (webContent.isDestroyed()) continue
    webContent.send('sync', baseKey, command, ...args)
  }
}

export const syncMain = <T extends object>(obj: T, baseKey: BaseKey): T => {
  if (typeof obj !== "object") return obj

  for (let prop in obj) {
    if (typeof obj[prop] !== "object") continue
    obj[prop] = syncMain(obj[prop] as any, [ ...baseKey, prop ])
  }

  const proxy = new Proxy(obj, {
    get(target: any, prop: string, receiver) {
      if (typeof target[prop] === "function") {
        const resp = syncGet(target, prop, baseKey)
        if (resp) return resp
      }
      return Reflect.get(target, prop, receiver)
    },
    set(target: any, prop: string, value, receiver) {
      send([ ...baseKey, prop ], "_set", value)
      value = syncMain(value, [ ...baseKey, prop ])
      return Reflect.set(target, prop, value, receiver)
    }
  })
  
  if (baseKey.length === 1) {
    objects.set(baseKey[0] as string, proxy)
  }

  return proxy
}