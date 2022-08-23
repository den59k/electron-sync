"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toJS = void 0;
const toJS = (obj) => {
    if (typeof obj !== "object")
        return obj;
    if (Array.isArray(obj)) {
        const copy = [...obj];
        for (let i = 0; i < copy.length; i++) {
            copy[i] = (0, exports.toJS)(copy[i]);
        }
        return copy;
    }
    if (obj instanceof Map) {
        const copy = new Map();
        for (let [key, value] of obj) {
            copy.set(key, (0, exports.toJS)(value));
        }
        return copy;
    }
    if (obj instanceof Set) {
        const copy = new Set();
        for (let value of obj.values()) {
            copy.add((0, exports.toJS)(value));
        }
        return copy;
    }
    const copy = Object.assign({}, obj);
    for (let key in copy) {
        if (typeof copy[key] === "object") {
            copy[key] = (0, exports.toJS)(copy[key]);
        }
    }
    return copy;
};
exports.toJS = toJS;
