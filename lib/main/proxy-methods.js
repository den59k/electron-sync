"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.proxyMethods = void 0;
const electron_1 = require("electron");
const services = new Map();
electron_1.ipcMain.on("call", (e, channel, method, ...args) => {
    const service = services.get(channel);
    if (!service) {
        console.warn(`Service ${channel} not registered for method ${method}`);
        return;
    }
    service[method](...args);
});
electron_1.ipcMain.handle("callAsync", (e, channel, method, ...args) => {
    const service = services.get(channel);
    if (!service) {
        return Promise.reject(`Service ${channel} not registered for method ${method}`);
    }
    return service[method](...args);
});
electron_1.ipcMain.on("callSync", (e, channel, method, ...args) => {
    const service = services.get(channel);
    if (!service) {
        console.warn(`Service ${channel} not registered for method ${method}`);
        e.returnValue = null;
        return;
    }
    e.returnValue = service[method](...args) ?? null;
});
const proxyMethods = (service, name) => {
    services.set(name, service);
};
exports.proxyMethods = proxyMethods;
