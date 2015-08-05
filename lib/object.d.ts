import { EventEmitter } from './events';
import { extend } from './utils';
export declare class BaseObject extends EventEmitter {
    static extend: typeof extend;
    private _isDestroyed;
    constructor();
    isDestroyed: boolean;
    destroy(): any;
    triggerMethod(eventName: string, ...args: any[]): any;
    getOption(prop: string, ...args: Object[]): any;
}
