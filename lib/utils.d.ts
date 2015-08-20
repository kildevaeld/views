export declare function extend(protoProps: Object, staticProps?: Object): any;
export declare module html {
    function matches(elm: any, selector: any): boolean;
    function addEventListener(elm: Element, eventName: string, listener: any, useCap?: boolean): void;
    function removeEventListener(elm: Element, eventName: string, listener: any): void;
    function addClass(elm: HTMLElement, className: string): void;
    function removeClass(elm: HTMLElement, className: string): void;
    function selectionStart(elm: HTMLInputElement): number;
}
/** @module utils */
export declare module utils {
    function camelcase(input: any): any;
    /** Generate an unique id with an optional prefix
     * @param {string} prefix
     * @return {string}
     */
    function uniqueId(prefix?: string): string;
    function isObject(obj: any): boolean;
    function extend(obj: Object, ...args: Object[]): any;
    function pick(obj: Object, props: string[]): any;
    function has(obj: any, prop: any): boolean;
    function indexOf(array: any, item: any): number;
    function result(obj: any, prop: string, ctx?: any, args?: any[]): any;
    function values<T>(obj: Object): T[];
    function find<T>(array: T[], callback: (item: T, index?: number) => boolean, ctx?: any): T;
    function proxy(from: any, to: any, fns: any): void;
    function bind(method: Function, context: any, ...args: any[]): Function;
    function call(fn: Function, ctx: any, args?: any[]): any;
    function slice(array: any): any;
    function equal(a: any, b: any): boolean;
    function triggerMethodOn(obj: any, eventName: string, args?: any[]): void;
    function getOption(option: string, objs: any[]): any;
    function sortBy<T>(obj: T[], value: string | Function, context?: any): T[];
    function isPromise(obj: any): boolean;
    function toPromise(obj: any): any;
    /**
     * Convert a thunk to a promise.
     *
     * @param {Function}
     * @return {Promise}
     * @api private
     */
    function thunkToPromise(fn: any): Promise<{}>;
    /**
     * Convert an array of "yieldables" to a promise.
     * Uses `Promise.all()` internally.
     *
     * @param {Array} obj
     * @return {Promise}
     * @api private
     */
    function arrayToPromise(obj: any): Promise<{}[]>;
    /**
     * Convert an object of "yieldables" to a promise.
     * Uses `Promise.all()` internally.
     *
     * @param {Object} obj
     * @return {Promise}
     * @api private
     */
    function objectToPromise(obj: any): Promise<any>;
    interface Deferred<T> {
        promise: Promise<T>;
        resolve: (result: T) => void;
        reject: (error: Error) => void;
        done: (error: Error, result: T) => void;
    }
    function deferred<T>(fn?: any, ctx?: any, ...args: any[]): Deferred<T> | Promise<T>;
    function callback<T>(promise: Promise<T>, callback: (error: Error, result: T) => void, ctx?: any): void;
    function delay<T>(timeout: any): Promise<T>;
}
