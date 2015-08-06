import * as base from './baseview';
export declare function normalizeUIKeys(obj: any): any;
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
    private _ui;
    delegateEvents(events?: any): View<T>;
    undelegateEvents(): any;
    bindUIElements(): void;
    unbindUIElements(): void;
}
