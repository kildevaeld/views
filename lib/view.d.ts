import { BaseView, BaseViewOptions } from './baseview';
import { IModel, ICollection } from 'collection';
import { IDataView, Silenceable } from './types';
export interface TemplateFunction {
    (locals: any): string;
}
export interface RenderOptions extends Silenceable {
}
export interface ViewOptions extends BaseViewOptions {
    model?: IModel;
    collection?: ICollection;
    template?: string | TemplateFunction;
}
export declare class View<T extends HTMLElement> extends BaseView<T> implements IDataView {
    protected _model: IModel;
    private _collection;
    private _dataEvents;
    template: string | TemplateFunction;
    model: IModel;
    collection: ICollection;
    /**
     * DataView
     * @param {DataViewOptions} options
     * @extends TemplateView
     */
    constructor(options?: ViewOptions);
    setModel(model: IModel): this;
    setCollection(collection: ICollection): this;
    getTemplateData(): any;
    render(options?: RenderOptions): any;
    delegateEvents(events?: any): any;
    undelegateEvents(): this;
    protected renderTemplate(data: Object): void;
    protected attachTemplate(template: string): void;
    private _delegateDataEvents(model, collection);
    private _undelegateDataEvents();
    private _filterEvents(obj);
}
