import * as base from './baseview';
export declare function normalizeUIKeys(obj: any, uimap: {
    [key: string]: string;
}): any;
export declare type UIMap = {
    [key: string]: HTMLElement;
};
export interface ViewOptions extends base.BaseViewOptions {
    ui?: {
        [key: string]: string;
    } | Function;
}
export declare class View<T extends HTMLElement> extends base.BaseView<T> {
    ui: UIMap;
    triggers: {
        [key: string]: string;
    };
    private _ui;
    private _options;
    delegateEvents(events?: any): View<T>;
    /**
     * View
     * @param {ViewOptions} options
     * @extends BaseView
     */
    constructor(options?: ViewOptions);
    undelegateEvents(): any;
    bindUIElements(): void;
    unbindUIElements(): void;
    /**
     * Configure triggers
     * @return {Object} events object
     * @private
     */
    _configureTriggers(): {};
    /**
     * builder trigger function
     * @param  {Object|String} triggerDef Trigger definition
     * @return {Function}
     * @private
     */
    _buildViewTrigger(triggerDef: any): (e: any) => void;
}
