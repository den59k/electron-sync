
const objects = new Map<string, object>();

(window as any).electron.on('sync', (e, baseKey: string[], command: string, ...args: any) => {
  const item = objects.get(baseKey[0])
  if (!item) return
  
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
})

type IOverload = {
  <T extends object>(channel: string): T;
  <T extends object,V extends object>(channel: string, callback: (obj: T) => V): V;
}

export const syncRenderer: IOverload = (channel: string, callback?: (obj: any) => any) => {
  const item = objects.get(channel)
  if (item) return item as any

  const _obj = (window as any).electron.sync(channel)
  const obj = callback? callback(_obj): _obj
  objects.set(channel, obj)

  return obj
}

