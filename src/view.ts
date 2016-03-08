import {BaseView} from './baseview';
import {IModel, ICollection} from 'collection';
import {IDataView, Silenceable} from './types';
import {extend, bind, callFunc, result, pick} from 'utilities';
import {logger} from './debug';
const debug = logger('view');

export interface TemplateFunction {
    (locals: any): string;
}

export interface RenderOptions extends Silenceable { }

export interface ViewOptions {
    model?: IModel;
    collection?: ICollection;
    template?: string | TemplateFunction;
}

export class View<T extends HTMLElement> extends BaseView<T> implements IDataView {

    protected _model: IModel;
    private _collection: ICollection;
    private _dataEvents: any;

    public template: string | TemplateFunction;

    public get model(): IModel { return this._model; }

    public set model(model) {
        this.setModel(model);
    }

    public get collection() { return this._collection; }

    public set collection(collection) {
        this.setCollection(collection);
    }


    /**
     * DataView
     * @param {DataViewOptions} options
     * @extends TemplateView
     */
    constructor(options: ViewOptions = {}) {
        super(options);

        extend(this, pick(options, ['model', 'collection', 'template']));
        /*if (options.model) {
            this.model = options.model
        }
        if (options.collection) {
            this.collection = options.collection
        }
        
        if (options && options.template) {
            this.template = options.template
        }*/



    }

    public setModel(model: IModel) {
        if (this._model === model) return this;

        this.triggerMethod('before:model', this._model, model);

        if (this._model) {
            this.stopListening(this._model);
        }

        this._model = model;

        this.triggerMethod('model', model);

        return this;
    }

    public setCollection(collection: ICollection) {
        if (this._collection === collection) return this;

        this.triggerMethod('before:collection', this._collection, collection);

        if (this._collection) {
            this.stopListening(this._collection);
        }

        this._collection = collection;

        this.triggerMethod('collection', collection);

        return this;
    }

    public getTemplateData(): any {
        return this.model ?
            typeof this.model.toJSON === 'function' ?
                this.model.toJSON() : this.model : {};
    }

    public render(options: RenderOptions = {}): any {

        if (!options.silent)
            this.triggerMethod('before:render');

        this.renderTemplate(this.getTemplateData());

        if (!options.silent)
            this.triggerMethod('render');

        return this;
    }

    public delegateEvents(events?: any): any {
        events = events || result(this, 'events');

        let {c, e, m} = this._filterEvents(events);

        super.delegateEvents(<any>e);
        this._delegateDataEvents(m, c);

        return this;
    }

    public undelegateEvents() {
        this._undelegateDataEvents();
        super.undelegateEvents();
        return this;
    }

    protected renderTemplate(data: Object) {
        let template = this.getOption('template');

        if (typeof template === 'function') {
            debug('%s render template function', this.cid);
            template = template.call(this, data);
        }

        if (template && typeof template === 'string') {
            debug('%s attach template: %s', this.cid, template);
            this.attachTemplate(template);
        }

    }

    protected attachTemplate(template: string) {
        this.undelegateEvents();
        this.el.innerHTML = template;
        this.delegateEvents();
    }

    private _delegateDataEvents(model: any, collection: any) {
        this._dataEvents = {};
        let fn = (item, ev) => {
            if (!this[item]) return {};
            let out = {}, k, f;
            for (k in ev) {
                f = bind(ev[k], this);
                this[item].on(k, f);
                out[item + ":" + k] = f;
            }
            return out;
        };

        extend(this._dataEvents,
            fn('model', model),
            fn('collection', collection));

    }

    private _undelegateDataEvents() {
        if (!this._dataEvents) return;
        let k, v;
        for (k in this._dataEvents) {
            v = this._dataEvents[k];
            let [item, ev] = k.split(':');
            if (!this[item]) continue;

            this[item].off(ev, v);
        }
        
        delete this._dataEvents;
    }

    private _filterEvents(obj: any) {
        /*jshint -W030 */
        let c = {}, m = {}, e = {}, k, v;
        for (k in obj) {
            let [ev, t] = k.split(' ');
            ev = ev.trim(), t = t ? t.trim() : "", v = obj[k];
            if (t === 'collection') {
                c[ev] = v;
            } else if (t === 'model') {
                m[ev] = v;
            } else {
                e[k] = v;
            }
        }
        return { c, m, e };
    }
}
