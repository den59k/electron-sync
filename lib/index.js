"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toJS = exports.proxyMethods = exports.syncMain = void 0;
var main_1 = require("./main");
Object.defineProperty(exports, "syncMain", { enumerable: true, get: function () { return main_1.syncMain; } });
Object.defineProperty(exports, "proxyMethods", { enumerable: true, get: function () { return main_1.proxyMethods; } });
var to_js_1 = require("./main/to-js");
Object.defineProperty(exports, "toJS", { enumerable: true, get: function () { return to_js_1.toJS; } });
