export declare function extend(protoProps: any, staticProps: any): any;
export declare module html {
    function matches(elm: any, selector: any): boolean;
    function addEventListener(elm: Element, eventName: string, listener: any, useCap?: boolean): void;
    function removeEventListener(elm: Element, eventName: string, listener: any): void;
    function addClass(elm: HTMLElement, className: string): void;
    function removeClass(elm: HTMLElement, className: string): void;
}
export declare module utils {
    function uniqueId(prefix?: string): string;
    function isObject(obj: any): boolean;
    function extend(obj: Object, ...args: Object[]): any;
    function pick(obj: Object, props: string[]): any;
    function has(obj: any, prop: any): boolean;
    function indexOf(array: any, item: any): number;
    function result(obj: any, prop: string, ctx?: any, args?: any[]): any;
    function values<T>(obj: Object): T[];
    function find<T>(array: T[], callback: (item: T, index?: number) => boolean, ctx?: any): T;
    function bind(method: Function, context: any, ...args: any[]): Function;
    function call(fn: Function, ctx: any, args: any[]): any;
    function slice(array: any): any;
    function equal(a: any, b: any): boolean;
    function triggerMethodOn(obj: any, eventName: string, args: any[]): void;
    function getOption(option: string, objs: any[]): any;
    function deepFreeze(obj: any): void;
}
