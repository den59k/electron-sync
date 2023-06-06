"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncRenderer = exports.setActionWrapper = void 0;
const objects = new Map();
const onSyncEvent = (e, arr) => {
    for (let [baseKey, command, ...args] of arr) {
        const item = objects.get(baseKey[0]);
        if (!item)
            return;
        let obj = item;
        const key = baseKey[baseKey.length - 1];
        for (let i = 1; i < baseKey.length - 1; i++) {
            if (obj instanceof Map) {
                obj = obj.get(baseKey[i]);
                continue;
            }
            obj = obj[baseKey[i]];
        }
        if (command === "_set") {
            obj[key] = args[0];
        }
        if (['push', 'unshift', 'pop', 'shift', 'splice', 'set', 'add', 'delete', 'clear'].includes(command)) {
            // console.log(obj, key, command, args)
            if (obj instanceof Map) {
                obj.get(key)[command](...args);
            }
            else {
                obj[key][command](...args);
            }
        }
    }
};
const _window = window;
let _onSyncEvent = onSyncEvent;
_window.electron.on('sync', _onSyncEvent);
const setActionWrapper = (wrapper) => {
    _window.electron.off('sync', _onSyncEvent);
    _onSyncEvent = wrapper(onSyncEvent);
    _window.electron.on('sync', _onSyncEvent);
};
exports.setActionWrapper = setActionWrapper;
const syncRenderer = (channel, callback) => {
    const item = objects.get(channel);
    if (item)
        return item;
    const _obj = _window.electron.sync(channel);
    const obj = callback ? callback(_obj) : _obj;
    objects.set(channel, obj);
    return obj;
};
exports.syncRenderer = syncRenderer;
