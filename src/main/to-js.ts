export const toJS = (obj: any) => {
  if (typeof obj !== "object") return obj

  if (Array.isArray(obj)) {
    const copy = [ ...obj ]
    for (let i = 0; i < copy.length; i++) {
      copy[i] = toJS(copy[i])
    }
    return copy
  }
  
  if (obj instanceof Map) {
    const copy = new Map()
    for (let [ key, value ] of obj) {
      copy.set(key, toJS(value))
    }
    return copy
  }

  if (obj instanceof Set) {
    const copy = new Set()
    for (let value of obj.values()) {
      copy.add(toJS(value))
    }
    return copy
  }

  const copy = Object.assign({}, obj)
  for (let key in copy) {
    if (typeof copy[key] === "object") {
      copy[key] = toJS(copy[key])
    }
  }
  return copy
}