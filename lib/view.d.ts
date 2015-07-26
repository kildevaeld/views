import * as base from './baseview';
export declare type UIMap = {
    [key: string]: string | HTMLElement;
};
export interface ViewOptions extends base.BaseViewOptions {
    ui?: {
        [key: string]: string;
    } | Function;
}
export declare class View<T extends HTMLElement> extends base.BaseView<T> {
    ui: UIMap;
    options: ViewOptions;
    private _ui;
    delegateEvents(events?: any): View<T>;
    undelegateEvents(): any;
    bindUIElements(): void;
    unbindUIElements(): void;
}
