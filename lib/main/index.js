"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncMain = exports.send = exports.proxyMethods = void 0;
const electron_1 = require("electron");
const to_js_1 = require("./to-js");
const utils_1 = require("./utils");
var proxy_methods_1 = require("./proxy-methods");
Object.defineProperty(exports, "proxyMethods", { enumerable: true, get: function () { return proxy_methods_1.proxyMethods; } });
const objects = new Map();
const subs = new Map();
electron_1.ipcMain.on("sync", (e, channel) => {
    const arr = subs.get(channel) || [];
    if (!arr.find(item => item.id === e.sender.id)) {
        arr.push(e.sender);
        subs.set(channel, arr);
    }
    e.returnValue = (0, to_js_1.toJS)(objects.get(channel)) || null;
});
const send = (baseKey, command, ...args) => {
    const sub = subs.get(baseKey[0]);
    if (!sub)
        return;
    for (let webContent of sub) {
        if (webContent.isDestroyed())
            continue;
        webContent.send('sync', baseKey, command, ...args);
    }
};
exports.send = send;
const syncMain = (obj, baseKey) => {
    if (typeof obj !== "object")
        return obj;
    if (!obj)
        return obj;
    for (let prop in obj) {
        if (!obj[prop] || typeof obj[prop] !== "object")
            continue;
        obj[prop] = (0, exports.syncMain)(obj[prop], [...baseKey, prop]);
    }
    const proxy = new Proxy(obj, {
        get(target, prop, receiver) {
            if (typeof target[prop] === "function") {
                const resp = (0, utils_1.syncGet)(target, prop, baseKey);
                if (resp)
                    return resp;
            }
            return Reflect.get(target, prop, receiver);
        },
        set(target, prop, value, receiver) {
            (0, exports.send)([...baseKey, prop], "_set", value);
            value = (0, exports.syncMain)(value, [...baseKey, prop]);
            return Reflect.set(target, prop, value, receiver);
        }
    });
    if (baseKey.length === 1) {
        objects.set(baseKey[0], proxy);
    }
    return proxy;
};
exports.syncMain = syncMain;
