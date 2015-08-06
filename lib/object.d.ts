import { EventEmitter } from './events';
import { extend } from './utils';
/** Base object */
export declare class BaseObject extends EventEmitter {
    static extend: typeof extend;
    private _isDestroyed;
    /**
     * Object
     * @extends EventEmitter
     */
    constructor();
    /**
     * Whether the object is "destroyed" or not
     * @type boolean
     */
    isDestroyed: boolean;
    destroy(): any;
    triggerMethod(eventName: string, ...args: any[]): any;
    getOption(prop: string, ...args: Object[]): any;
}
