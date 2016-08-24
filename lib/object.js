"use strict";
const debug = require('debug')('views:object');
const eventsjs_1 = require('eventsjs');
const orange_1 = require('orange');
/** Base object */
class BaseObject extends eventsjs_1.EventEmitter {
    /**
     * Object
     * @extends EventEmitter
     */
    constructor(args) {
        super();
        this._isDestroyed = false;
    }
    /**
     * Whether the object is "destroyed" or not
     * @type boolean
     */
    get isDestroyed() {
        return this._isDestroyed;
    }
    destroy() {
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
    }
    triggerMethod(eventName, ...args) {
        orange_1.triggerMethodOn(this, eventName, args);
        return this;
    }
    getOption(prop, ...args) {
        if (this.options) {
            args.push(this.options);
        }
        if (this._options) {
            args.push(this._options);
        }
        args.push(this);
        return orange_1.getOption(prop, args);
    }
}
BaseObject.extend = function (proto, stat) {
    return orange_1.inherits(this, proto, stat);
};
exports.BaseObject = BaseObject;
