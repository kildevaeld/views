"use strict";
const debug = require('debug')('views:view');
const baseview_1 = require('./baseview');
const orange_1 = require('orange');
class View extends baseview_1.BaseView {
    /**
     * DataView
     * @param {DataViewOptions} options
     * @extends TemplateView
     */
    constructor(options = {}) {
        super(options);
        orange_1.extend(this, orange_1.pick(options, ['model', 'collection', 'template']));
    }
    get model() { return this._model; }
    set model(model) {
        this.setModel(model);
    }
    get collection() { return this._collection; }
    set collection(collection) {
        this.setCollection(collection);
    }
    setModel(model) {
        if (this._model === model)
            return this;
        this.triggerMethod('before:model', this._model, model);
        if (this.model) {
            debug('stop listening on model uid: %s', this.model.uid);
            this.stopListening(this._model);
        }
        debug('%s set model uid: %s', this, model.uid);
        this._model = model;
        this.triggerMethod('model', model);
        return this;
    }
    setCollection(collection) {
        if (this._collection === collection)
            return this;
        this.triggerMethod('before:collection', this._collection, collection);
        if (this._collection) {
            debug('%s stop listening on collection', this);
            this.stopListening(this._collection);
        }
        this._collection = collection;
        this.triggerMethod('collection', collection);
        return this;
    }
    getTemplateData() {
        return this.model ?
            typeof this.model.toJSON === 'function' ?
                this.model.toJSON() : this.model : {};
    }
    render(options = {}) {
        debug('%s render', this);
        if (!options.silent)
            this.triggerMethod('before:render');
        this.undelegateEvents();
        this.renderTemplate(this.getTemplateData());
        this.delegateEvents();
        if (!options.silent)
            this.triggerMethod('render');
        return this;
    }
    delegateEvents(events) {
        events = events || orange_1.result(this, 'events');
        let { c, e, m } = this._filterEvents(events);
        super.delegateEvents(e);
        this._delegateDataEvents(m, c);
        return this;
    }
    undelegateEvents() {
        this._undelegateDataEvents();
        super.undelegateEvents();
        return this;
    }
    renderTemplate(data) {
        let template = this.getOption('template');
        if (typeof template === 'function') {
            debug('%s render template function', this);
            template = template.call(this, data);
        }
        if (template && typeof template === 'string') {
            debug('%s attach template: %s', this, template);
            this.attachTemplate(template);
        }
    }
    attachTemplate(template) {
        //this.undelegateEvents();
        this.el.innerHTML = template;
        //this.delegateEvents();
    }
    _delegateDataEvents(model, collection) {
        this._dataEvents = {};
        let fn = (item, ev) => {
            if (!this[item])
                return {};
            let out = {}, k, f;
            for (k in ev) {
                f = orange_1.bind(ev[k], this);
                this[item].on(k, f);
                out[item + ":" + k] = f;
            }
            return out;
        };
        orange_1.extend(this._dataEvents, fn('model', model), fn('collection', collection));
    }
    _undelegateDataEvents() {
        if (!this._dataEvents)
            return;
        let k, v;
        for (k in this._dataEvents) {
            v = this._dataEvents[k];
            let [item, ev] = k.split(':');
            if (!this[item])
                continue;
            this[item].off(ev, v);
        }
        delete this._dataEvents;
    }
    _filterEvents(obj) {
        /*jshint -W030 */
        let c = {}, m = {}, e = {}, k, v;
        for (k in obj) {
            let [ev, t] = k.split(' ');
            ev = ev.trim(), t = t ? t.trim() : "", v = obj[k];
            if (t === 'collection') {
                c[ev] = v;
            }
            else if (t === 'model') {
                m[ev] = v;
            }
            else {
                e[k] = v;
            }
        }
        return { c: c, m: m, e: e };
    }
}
exports.View = View;
