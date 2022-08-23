"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bridge = exports.proxy = void 0;
const electron_1 = require("electron");
const proxy = (channel, methods, asyncMethods = [], syncMethods = []) => {
    const obj = {};
    for (let method of methods) {
        obj[method] = (...args) => electron_1.ipcRenderer.send("call", channel, method, ...args);
    }
    for (let method of asyncMethods) {
        obj[method] = (...args) => electron_1.ipcRenderer.invoke("callAsync", channel, method, ...args);
    }
    for (let method of syncMethods) {
        obj[method] = (...args) => electron_1.ipcRenderer.sendSync("callSync", channel, method, ...args);
    }
    return obj;
};
exports.proxy = proxy;
exports.bridge = {
    on: (channel, listener) => {
        electron_1.ipcRenderer.on(channel, listener);
        return () => electron_1.ipcRenderer.removeListener(channel, listener);
    },
    sync: (channel) => electron_1.ipcRenderer.sendSync('sync', channel)
};
