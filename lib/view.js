"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var debug = require('debug')('views:view');
var baseview_1 = require('./baseview');
var utilities_1 = require('utilities');
var View = (function (_super) {
    __extends(View, _super);
    /**
     * DataView
     * @param {DataViewOptions} options
     * @extends TemplateView
     */
    function View(options) {
        if (options === void 0) { options = {}; }
        _super.call(this, options);
        utilities_1.extend(this, utilities_1.pick(options, ['model', 'collection', 'template']));
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
    Object.defineProperty(View.prototype, "model", {
        get: function () { return this._model; },
        set: function (model) {
            this.setModel(model);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(View.prototype, "collection", {
        get: function () { return this._collection; },
        set: function (collection) {
            this.setCollection(collection);
        },
        enumerable: true,
        configurable: true
    });
    View.prototype.setModel = function (model) {
        if (this._model === model)
            return this;
        this.triggerMethod('before:model', this._model, model);
        if (this.model) {
            debug('stop listening on model uid: %s', this.model.uid);
            this.stopListening(this._model);
        }
        debug('viewId %s set model uid: %s', this.cid, model.uid);
        this._model = model;
        this.triggerMethod('model', model);
        return this;
    };
    View.prototype.setCollection = function (collection) {
        if (this._collection === collection)
            return this;
        this.triggerMethod('before:collection', this._collection, collection);
        if (this._collection) {
            debug('viewId %s: stop listening on collection uid: %s', this.cid);
            this.stopListening(this._collection);
        }
        this._collection = collection;
        this.triggerMethod('collection', collection);
        return this;
    };
    View.prototype.getTemplateData = function () {
        return this.model ?
            typeof this.model.toJSON === 'function' ?
                this.model.toJSON() : this.model : {};
    };
    View.prototype.render = function (options) {
        if (options === void 0) { options = {}; }
        if (!options.silent)
            this.triggerMethod('before:render');
        this.renderTemplate(this.getTemplateData());
        if (!options.silent)
            this.triggerMethod('render');
        return this;
    };
    View.prototype.delegateEvents = function (events) {
        events = events || utilities_1.result(this, 'events');
        var _a = this._filterEvents(events), c = _a.c, e = _a.e, m = _a.m;
        _super.prototype.delegateEvents.call(this, e);
        this._delegateDataEvents(m, c);
        return this;
    };
    View.prototype.undelegateEvents = function () {
        this._undelegateDataEvents();
        _super.prototype.undelegateEvents.call(this);
        return this;
    };
    View.prototype.renderTemplate = function (data) {
        var template = this.getOption('template');
        if (typeof template === 'function') {
            debug('%s render template function', this.cid);
            template = template.call(this, data);
        }
        if (template && typeof template === 'string') {
            debug('%s attach template: %s', this.cid, template);
            this.attachTemplate(template);
        }
    };
    View.prototype.attachTemplate = function (template) {
        this.undelegateEvents();
        this.el.innerHTML = template;
        this.delegateEvents();
    };
    View.prototype._delegateDataEvents = function (model, collection) {
        var _this = this;
        this._dataEvents = {};
        var fn = function (item, ev) {
            if (!_this[item])
                return {};
            var out = {}, k, f;
            for (k in ev) {
                f = utilities_1.bind(ev[k], _this);
                _this[item].on(k, f);
                out[item + ":" + k] = f;
            }
            return out;
        };
        utilities_1.extend(this._dataEvents, fn('model', model), fn('collection', collection));
    };
    View.prototype._undelegateDataEvents = function () {
        if (!this._dataEvents)
            return;
        var k, v;
        for (k in this._dataEvents) {
            v = this._dataEvents[k];
            var _a = k.split(':'), item = _a[0], ev = _a[1];
            if (!this[item])
                continue;
            this[item].off(ev, v);
        }
        delete this._dataEvents;
    };
    View.prototype._filterEvents = function (obj) {
        /*jshint -W030 */
        var c = {}, m = {}, e = {}, k, v;
        for (k in obj) {
            var _a = k.split(' '), ev = _a[0], t = _a[1];
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
    };
    return View;
}(baseview_1.BaseView));
exports.View = View;
