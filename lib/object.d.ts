import { EventEmitter } from './events';
import { extend } from './utils';
export declare class BaseObject extends EventEmitter {
    static extend: typeof extend;
    private _isDestroyed;
    isDestroyed: boolean;
    destroy(): any;
    triggerMethod(eventName: string, ...args: string[]): any;
    getOption(prop: string, ...args: Object[]): any;
}
