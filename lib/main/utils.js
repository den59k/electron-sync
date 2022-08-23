"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.arrayMethod = exports.mapMethods = exports.syncGet = void 0;
const _1 = require(".");
const syncGet = (target, prop, baseKey) => {
    if (prop === Symbol.iterator || prop === Symbol.asyncIterator) {
        return target[prop].bind(target);
    }
    if (target instanceof Map || target instanceof Set) {
        return (0, exports.mapMethods)(target, prop, baseKey);
    }
    if (Array.isArray(target)) {
        return (0, exports.arrayMethod)(target, prop, baseKey);
    }
};
exports.syncGet = syncGet;
const mapMethods = (target, prop, baseKey) => {
    if (prop === "get" || prop === "has") {
        return (...args) => target[prop](...args);
    }
    return proxyMethods(["set", "add", "delete", "clear"], target, prop, baseKey);
};
exports.mapMethods = mapMethods;
const arrayMethod = (target, prop, baseKey) => {
    return proxyMethods(["push", "unshift", "shift", "pop", "splice"], target, prop, baseKey);
};
exports.arrayMethod = arrayMethod;
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
