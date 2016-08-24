var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'debug', 'eventsjs', 'orange'], function (require, exports, Debug, eventsjs_1, orange_1) {
    "use strict";
    var debug = Debug('views:object');
    /** Base object */
    var BaseObject = (function (_super) {
        __extends(BaseObject, _super);
        /**
         * Object
         * @extends EventEmitter
         */
        function BaseObject(args) {
            _super.call(this);
            this._isDestroyed = false;
        }
        Object.defineProperty(BaseObject.prototype, "isDestroyed", {
            /**
             * Whether the object is "destroyed" or not
             * @type boolean
             */
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
            this._isDestroyed = true;
            this.triggerMethod('destroy');
            debug("%s destroy", this);
            if (typeof Object.freeze) {
            }
            return this;
        };
        BaseObject.prototype.triggerMethod = function (eventName) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            orange_1.triggerMethodOn(this, eventName, args);
            return this;
        };
        BaseObject.prototype.getOption = function (prop) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (this.options) {
                args.push(this.options);
            }
            if (this._options) {
                args.push(this._options);
            }
            args.push(this);
            return orange_1.getOption(prop, args);
        };
        BaseObject.extend = function (proto, stat) {
            return orange_1.inherits(this, proto, stat);
        };
        return BaseObject;
    }(eventsjs_1.EventEmitter));
    exports.BaseObject = BaseObject;
});
