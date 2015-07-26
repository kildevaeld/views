declare var ElementProto: any;
declare var matchesSelector: any;
declare var elementAddEventListener: any;
declare var elementRemoveEventListener: any;
declare module views {
    function extend(protoProps: any, staticProps: any): any;
    module html {
        function matches(elm: any, selector: any): boolean;
        function addEventListener(elm: Element, eventName: string, listener: any, useCap?: boolean): void;
        function removeEventListener(elm: Element, eventName: string, listener: any): void;
        function addClass(elm: HTMLElement, className: string): void;
        function removeClass(elm: HTMLElement, className: string): void;
    }
    module utils {
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
    }
}
declare module events {
    interface EventHandler {
        (...args: any[]): any;
    }
    interface IEventEmitter {
        listenId: string;
        on(event: string, fn: EventHandler, ctx?: any): any;
        once(event: string, fn: EventHandler, ctx?: any): any;
        off(event: string, fn?: EventHandler, ctx?: any): any;
        trigger(event: string, ...args: any[]): any;
    }
    class EventEmitter implements IEventEmitter {
        listenId: string;
        private _events;
        private _listeningTo;
        on(event: string, fn: EventHandler, ctx?: any, once?: boolean): any;
        once(event: string, fn: EventHandler): any;
        off(eventName?: string, fn?: EventHandler): any;
        trigger(eventName: string, ...args: any[]): any;
        listenTo(obj: IEventEmitter, event: string, fn: EventHandler, ctx?: any, once?: boolean): any;
        listenToOnce(obj: IEventEmitter, event: string, fn: EventHandler, ctx?: any): any;
        stopListening(obj?: IEventEmitter, event?: string, callback?: EventHandler): EventEmitter;
    }
}
declare module views {
    class BaseObject extends events.EventEmitter {
        static extend: typeof extend;
        private _isDestroyed;
        isDestroyed: boolean;
        destroy(): any;
        triggerMethod(eventName: string, ...args: string[]): any;
        getOption(prop: string, ...args: Object[]): any;
    }
}
declare const paddedLt: RegExp;
declare const unbubblebles: string[];
declare module views {
    interface BaseViewOptions {
        el?: HTMLElement;
        id?: string;
        attributes?: {
            [key: string]: any;
        };
        className?: string;
        tagName?: string;
        events?: {
            [key: string]: Function | string;
        };
    }
    class BaseView<T extends HTMLElement> extends views.BaseObject {
        tagName: string;
        className: string;
        id: string;
        private _cid;
        cid: string;
        options: BaseViewOptions;
        el: T;
        events: any;
        attributes: {
            [key: string]: any;
        };
        triggers: any;
        private _domEvents;
        constructor(options?: BaseViewOptions);
        initialize(): void;
        delegateEvents(events?: any): any;
        undelegateEvents(): BaseView<T>;
        delegate(eventName: string, selector?: string | Function, listener?: Function): (e: any) => void;
        undelegate(eventName: string, selector?: string | Function, listener?: Function): BaseView<T>;
        render(options: any): any;
        appendTo(elm: HTMLElement): any;
        append(elm: HTMLElement, toSelector?: string): any;
        $(selector: string): NodeList;
        setElement(elm: T): void;
        remove(): BaseView<T>;
        private _createElement(tagName);
        private _ensureElement();
        private _removeElement();
        private _setElement(element);
        private _setAttributes(attrs);
    }
}
declare const kUIRegExp: RegExp;
declare function normalizeUIKeys(obj: any): any;
declare module views {
    type UIMap = {
        [key: string]: string | HTMLElement;
    };
    interface ViewOptions extends views.BaseViewOptions {
        ui?: {
            [key: string]: string;
        } | Function;
    }
    class View<T extends HTMLElement> extends views.BaseView<T> {
        ui: UIMap;
        options: ViewOptions;
        private _ui;
        delegateEvents(events?: any): View<T>;
        undelegateEvents(): any;
        bindUIElements(): void;
        unbindUIElements(): void;
    }
}
declare module views {
    interface TemplateFunction {
        (locals: Object): string;
    }
    interface TemplateViewOptions extends views.ViewOptions {
        template?: string | TemplateFunction;
    }
    class TemplateView<T extends HTMLElement> extends views.View<T> {
        template: string | TemplateFunction;
        constructor(options?: TemplateViewOptions);
        getTemplateData(): any;
        render(options: any): any;
    }
}
