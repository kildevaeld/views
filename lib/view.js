var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var base = require('./baseview');
var utils_1 = require('./utils');
var kUIRegExp = /@ui.([a-zA-Z_\-\$#]+)/i;
function normalizeUIKeys(obj, uimap) {
    /*jshint -W030 */
    var o = {}, k, v, ms, sel, ui;
    for (k in obj) {
        v = obj[k];
        if ((ms = kUIRegExp.exec(k)) !== null) {
            ui = ms[1], sel = uimap[ui];
            if (sel != null) {
                k = k.replace(ms[0], sel);
            }
        }
        o[k] = v;
    }
    return o;
}
exports.normalizeUIKeys = normalizeUIKeys;
var View = (function (_super) {
    __extends(View, _super);
    /**
     * View
     * @param {ViewOptions} options
     * @extends BaseView
     */
    function View(options) {
        this._options = options;
        _super.call(this, options);
    }
    View.prototype.delegateEvents = function (events) {
        this.bindUIElements();
        events = events || this.events;
        events = normalizeUIKeys(events, this._ui);
        var triggers = this._configureTriggers();
        events = utils_1.utils.extend({}, events, triggers);
        _super.prototype.delegateEvents.call(this, events);
        return this;
    };
    View.prototype.undelegateEvents = function () {
        this.unbindUIElements();
        _super.prototype.undelegateEvents.call(this);
        return this;
    };
    /* UI Elements */
    View.prototype.bindUIElements = function () {
        var _this = this;
        var ui = this.getOption('ui'); //this.options.ui||this.ui
        if (!ui)
            return;
        if (!this._ui) {
            this._ui = ui;
        }
        ui = utils_1.utils.result(this, '_ui');
        this.ui = {};
        Object.keys(ui).forEach(function (k) {
            var elm = _this.$(ui[k]);
            if (elm && elm.length) {
                // unwrap if it's a nodelist.
                if (elm instanceof NodeList) {
                    elm = elm[0];
                }
                _this.ui[k] = elm;
            }
        });
    };
    View.prototype.unbindUIElements = function () {
        this.ui = {};
    };
    /**
     * Configure triggers
     * @return {Object} events object
     * @private
     */
    View.prototype._configureTriggers = function () {
        /*if (!this.triggers) {
          return {};
        }*/
        var triggers = this.getOption('triggers') || {};
        if (typeof triggers === 'function') {
            triggers = triggers.call(this);
        }
        // Allow `triggers` to be configured as a function
        triggers = normalizeUIKeys(triggers, this._ui);
        // Configure the triggers, prevent default
        // action and stop propagation of DOM events
        var events = {}, val, key;
        for (key in triggers) {
            val = triggers[key];
            events[key] = this._buildViewTrigger(val);
        }
        return events;
    };
    /**
     * builder trigger function
     * @param  {Object|String} triggerDef Trigger definition
     * @return {Function}
     * @private
     */
    View.prototype._buildViewTrigger = function (triggerDef) {
        if (typeof triggerDef === 'string')
            triggerDef = { event: triggerDef };
        var options = utils_1.utils.extend({
            preventDefault: true,
            stopPropagation: true
        }, triggerDef);
        return function (e) {
            if (e) {
                if (e.preventDefault && options.preventDefault) {
                    e.preventDefault();
                }
                if (e.stopPropagation && options.stopPropagation) {
                    e.stopPropagation();
                }
            }
            this.triggerMethod(options.event, {
                view: this,
                model: this.model,
                collection: this.collection
            });
        };
    };
    return View;
})(base.BaseView);
exports.View = View;
