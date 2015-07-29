export declare function extend(protoProps: any, staticProps: any): any;
export declare module html {
    function matches(elm: any, selector: any): boolean;
    function addEventListener(elm: Element, eventName: string, listener: any, useCap?: boolean): void;
    function removeEventListener(elm: Element, eventName: string, listener: any): void;
    function addClass(elm: HTMLElement, className: string): void;
    function removeClass(elm: HTMLElement, className: string): void;
}
export declare module utils {
    function isObject(obj: any): boolean;
    function extend(obj: Object, ...args: Object[]): any;
    function pick(obj: Object, props: string[]): any;
    function has(obj: any, prop: any): boolean;
    function indexOf(array: any, item: any): number;
    function result(obj: any, prop: string, ctx?: any, args?: any[]): any;
    function bind(method: Function, context: any, ...args: any[]): Function;
    function call(fn: Function, ctx: any, args: any[]): any;
    function slice(array: any): any;
    function uniqueId(prefix?: string): string;
    function equal(a: any, b: any): boolean;
}
