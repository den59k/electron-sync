import { BaseKey, send, syncMain } from "."

export const syncGet = (target: any, prop: string | symbol, baseKey: BaseKey) => {
  if (prop === Symbol.iterator || prop === Symbol.asyncIterator) {
    return target[prop].bind(target)
  }
  if (target instanceof Map || target instanceof Set) {
    return mapMethods(target, prop as string, baseKey)
  }
  if (Array.isArray(target)) {
    return arrayMethod(target, prop as string, baseKey)
  }
}

export const mapMethods = (target: any, prop: string, baseKey: BaseKey) => {
  if (prop === "get" || prop === "has") {
    return (...args: any) => target[prop](...args)
  }
  return proxyMethods([ "set", "add", "delete", "clear" ], target, prop, baseKey)
}

export const arrayMethod = (target: any, prop: string, baseKey: BaseKey) => {
  return proxyMethods([ "push", "unshift", "shift", "pop", "splice" ], target, prop, baseKey)
}

const mapArgs = (args: any[], target: any, command: string, baseKey: BaseKey) => {
  if (command === "set") {
    return [ args[0], syncMain(args[1], [ ...baseKey, args[0] ]) ]
  }
  if (command === "push" || command === "unshift" || command === "splice") {
    let len = 0
    if (command === "push") len = target.length
    if (command === "splice") len = args[0]-2     // Здесь минус 2, потому что мы пропускаем первые два аргумента
    return args.map((arg, index) => syncMain(arg, [ ...baseKey, len+index ]))
  }

  return args
}

const proxyMethods = (commands: string[], target: any, prop: string, baseKey: BaseKey) => {
  if (commands.includes(prop)) {
    return (...args: any[]) => {
      send(baseKey, prop, ...args)
      args = mapArgs(args, target, prop, baseKey)
      target[prop](...args)
    } 
  }
  return undefined
}

