import { EventEmitter } from './events';
import { utils, extend } from './utils';
/** Base object */
export class BaseObject extends EventEmitter {
    /**
     * Object
     * @extends EventEmitter
     */
    constructor() {
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
        if (typeof Object.freeze) {
            Object.freeze(this);
        }
        return this;
    }
    triggerMethod(eventName, ...args) {
        utils.triggerMethodOn(this, eventName, args);
        return this;
    }
    getOption(prop, ...args) {
        if (this.options) {
            args.push(this.options);
        }
        args.push(this);
        return utils.getOption(prop, args);
    }
}
BaseObject.extend = extend;
