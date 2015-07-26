var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var events_1 = require('./events');
var utils_1 = require('./utils');
var BaseObject = (function (_super) {
    __extends(BaseObject, _super);
    function BaseObject() {
        _super.apply(this, arguments);
        this._isDestroyed = false;
    }
    Object.defineProperty(BaseObject.prototype, "isDestroyed", {
        get: function () {
            return this._isDestroyed;
        },
        enumerable: true,
        configurable: true
    });
    BaseObject.prototype.destroy = function () {
        if (this.isDestroyed)
            return this;
        this.triggerMethod('before:destroy');
        this.stopListening();
        this.off();
        this._isDestroyed = false;
        this.triggerMethod('destroy');
        return this;
    };
    BaseObject.prototype.triggerMethod = function (eventName) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var ev = "on" + eventName;
        utils_1.utils;
        if (this[ev]) {
            utils_1.utils.call(this[ev], this, args);
        }
        utils_1.utils.call(this.trigger, this, args);
        return this;
    };
    BaseObject.prototype.getOption = function (prop) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var self = this;
        for (var _a = 0; _a < args.length; _a++) {
            var o = args[_a];
            if (utils_1.utils.has(o, prop))
                return o[prop];
        }
        var options = self.options;
        if (options && utils_1.utils.isObject(options) && utils_1.utils.has(options, prop)) {
            return options[prop];
        }
        return self[prop];
    };
    BaseObject.extend = utils_1.extend;
    return BaseObject;
})(events_1.EventEmitter);
exports.BaseObject = BaseObject;
