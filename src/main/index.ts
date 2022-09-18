import { ipcMain, webContents } from "electron"
import { toJS } from "./to-js"
import { syncGet } from "./utils"

export type BaseKey = (string | number)[]
export { proxyMethods } from './proxy-methods'

const objects = new Map<string, object>()
const subs = new Map<number, Set<string>>()

ipcMain.on("sync", (e, channel: string) => {
  const set = subs.get(e.sender.id) || new Set()
  set.add(channel)
  subs.set(e.sender.id, set)
  e.returnValue = toJS(objects.get(channel)) || null
})

let flagNextTick = false
let toSend: [ BaseKey, string, ...any ][] = []
export const send = (baseKey: BaseKey, command: string, ...args: any) => {
  toSend.push([ baseKey, command, ...args.map((item: any) => toJS(item)) ])
  if (!flagNextTick) {
    process.nextTick(sendOnNextTick)
    flagNextTick = true
  }
}

const sendOnNextTick = () => {
  for (let [ id, set ] of subs) {
    const webContent = webContents.fromId(id)
    if (!webContent || webContent.isDestroyed()) {
      subs.delete(id) 
      continue
    }
    const arr = toSend.filter(i => set.has(i[0][0] as string))
    if (arr.length === 0) continue
    webContent.send('sync', arr)
  }

  flagNextTick = false
  toSend = []
}

export const syncMain = <T extends object>(obj: T, baseKey: BaseKey): T => {
  if (typeof obj !== "object") return obj
  if (!obj) return obj

  for (let prop in obj) {
    if (!obj[prop] || typeof obj[prop] !== "object") continue
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