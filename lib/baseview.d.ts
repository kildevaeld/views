import { BaseObject } from './object';
import { IEventEmitter } from 'eventsjs';
export declare type EventsMap = {
    [key: string]: Function | string;
};
export declare type StringMap = {
    [key: string]: string;
};
export interface Destroyable {
    destroy(): any;
    isDestroyed: boolean;
}
export interface IView extends IEventEmitter, Destroyable {
    el: HTMLElement;
    render(options?: any): this;
    remove(): any;
}
export declare type UIMap = {
    [key: string]: HTMLElement;
};
export interface BaseViewOptions {
    el?: HTMLElement;
    id?: string;
    attributes?: StringMap;
    className?: string;
    tagName?: string;
    events?: EventsMap;
    triggers?: StringMap;
    ui?: {
        [key: string]: string;
    } | Function;
}
export declare abstract class BaseView<T extends HTMLElement> extends BaseObject implements IView {
    static find(selector: string, context: HTMLElement): NodeList;
    tagName: string;
    className: string;
    id: string;
    private _cid;
    cid: string;
    el: T;
    events: EventsMap;
    attributes: StringMap;
    ui: UIMap;
    triggers: {
        [key: string]: string;
    };
    private _ui;
    protected _options: BaseViewOptions;
    private _domEvents;
    /**
     * BaseView
     * @param {BaseViewOptions} options
     * @extends BaseObject
     */
    constructor(options?: BaseViewOptions);
    /**
     * Delegate events
     * @param {EventsMap} events
     */
    delegateEvents(events?: EventsMap): any;
    /**
     * Undelegate events
     */
    undelegateEvents(): this;
    delegate(eventName: string, selector?: string | Function, listener?: Function): (e: any) => void;
    undelegate(eventName: string, selector?: string | Function, listener?: Function): this;
    render(options: any): any;
    /**
     * Append the view to a HTMLElement
     * @param {HTMLElement|string} elm A html element or a selector string
     * @return {this} for chaining
     */
    appendTo(elm: HTMLElement | string): any;
    /**
     * Append a element the view
     * @param {HTMLElement} elm
     * @param {String} toSelector
     * @return {this} for chaining
     */
    append(elm: HTMLElement, toSelector?: string): any;
    /**
     * Convience for view.el.querySelectorAll()
     * @param {string|HTMLElement} selector
     */
    $(selector: string | HTMLElement): NodeList | HTMLElement;
    setElement(elm: T, trigger?: boolean): void;
    remove(): this;
    destroy(): any;
    /**
     * Bind ui elements
     * @private
     */
    private _bindUIElements();
    /**
     * Unbind ui elements
     * @private
     */
    private _unbindUIElements();
    /**
     * Configure triggers
     * @return {Object} events object
     * @private
     */
    private _configureTriggers();
    /**
     * builder trigger function
     * @param  {Object|String} triggerDef Trigger definition
     * @return {Function}
     * @private
     */
    private _buildViewTrigger(triggerDef);
    private _createElement(tagName);
    private _ensureElement();
    private _removeElement();
    private _setElement(element);
    private _setAttributes(attrs);
    toString(): string;
}
