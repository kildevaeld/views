import * as views from './view';
export interface TemplateFunction {
    (locals: Object): string;
}
export interface TemplateViewOptions extends views.ViewOptions {
    template?: string | TemplateFunction;
}
export declare class TemplateView<T extends HTMLElement> extends views.View<T> {
    template: string | TemplateFunction;
    /** TemplateView
     * @param {TemplateViewOptions} options
     * @extends View
     */
    constructor(options?: TemplateViewOptions);
    getTemplateData(): any;
    render(options: any): any;
}
