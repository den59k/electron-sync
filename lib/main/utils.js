"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.arrayMethods = exports.mapMethods = exports.syncGet = void 0;
const _1 = require(".");
const to_js_1 = require("./to-js");
const syncGet = (target, prop, baseKey) => {
    if (prop === Symbol.iterator || prop === Symbol.asyncIterator) {
        return target[prop].bind(target);
    }
    if (target instanceof Map || target instanceof Set) {
        return (0, exports.mapMethods)(target, prop, baseKey);
    }
    if (Array.isArray(target)) {
        return (0, exports.arrayMethods)(target, prop, baseKey);
    }
};
exports.syncGet = syncGet;
const mapMethods = (target, prop, baseKey) => {
    if (["get", "has", "values", "keys", "entries"].includes(prop)) {
        return (...args) => target[prop](...args);
    }
    return proxyMethods(["set", "add", "delete", "clear"], target, prop, baseKey);
};
exports.mapMethods = mapMethods;
const arrayMethods = (target, prop, baseKey) => {
    return proxyMethods(["push", "unshift", "shift", "pop", "splice"], target, prop, baseKey);
};
exports.arrayMethods = arrayMethods;
const mapArgs = (args, target, command, baseKey) => {
    if (command === "set") {
        return [args[0], (0, _1.syncMain)(args[1], [...baseKey, args[0]])];
    }
    if (command === "push" || command === "unshift" || command === "splice") {
        let len = 0;
        if (command === "push")
            len = target.length;
        if (command === "splice")
            len = args[0] - 2; // Здесь минус 2, потому что мы пропускаем первые два аргумента
        if (command === "splice") {
            for (let i = args[0] + args[1]; i < target.length; i++) {
                target[i] = (0, _1.syncMain)((0, to_js_1.toJS)(target[i]), [...baseKey, i - args[1] + (args.length - 2)]);
            }
        }
        return args.map((arg, index) => (0, _1.syncMain)(arg, [...baseKey, len + index]));
    }
    return args;
};
const proxyMethods = (commands, target, prop, baseKey) => {
    if (commands.includes(prop)) {
        return (...args) => {
            (0, _1.send)(baseKey, prop, ...args);
            args = mapArgs(args, target, prop, baseKey);
            target[prop](...args);
        };
    }
    return undefined;
};
