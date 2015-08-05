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
        _super.call(this);
        Object.defineProperty(this, '_isDestroyed', {
            enumerable: false,
            writable: true,
            configurable: false,
            value: false
        });
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
        utils_1.utils.triggerMethodOn(this, eventName, args);
        return this;
    };
    BaseObject.prototype.getOption = function (prop) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        /*let self = <any>this
        for (let o of args) {
          if (utils.has(o, prop)) return o[prop]
        }
        let options = self.options
        if (options && utils.isObject(options) && utils.has(options, prop)) {
          return options[prop]
        }
        return self[prop]*/
        if (this.options) {
            args.push(this.options);
        }
        args.push(this);
        return utils_1.utils.getOption(prop, args);
    };
    BaseObject.extend = utils_1.extend;
    return BaseObject;
})(events_1.EventEmitter);
exports.BaseObject = BaseObject;
