import { BaseObject } from './object';
export interface BaseViewOptions {
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
export declare class BaseView<T extends HTMLElement> extends BaseObject {
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
