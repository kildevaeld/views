var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'debug', './object', 'orange', 'orange.dom', './util'], function (require, exports, Debug, object_1, orange_1, orange_dom_1, util_1) {
    "use strict";
    var debug = Debug('views:baseview');
    var paddedLt = /^\s*</;
    var unbubblebles = 'focus blur change'.split(' ');
    var viewOptions = ['el', 'id', 'attributes', 'className', 'tagName', 'events', 'triggers', 'ui'];
    var BaseView = (function (_super) {
        __extends(BaseView, _super);
        /**
         * BaseView
         * @param {BaseViewOptions} options
         * @extends BaseObject
         */
        function BaseView(options) {
            if (options === void 0) { options = {}; }
            _super.call(this);
            this._cid = orange_1.uniqueId('view');
            orange_1.extend(this, orange_1.pick(options, viewOptions));
            this._domEvents = [];
            if (this.el == null) {
                this._ensureElement();
            }
        }
        BaseView.find = function (selector, context) {
            return context.querySelectorAll(selector);
        };
        Object.defineProperty(BaseView.prototype, "cid", {
            get: function () {
                return this._cid;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Delegate events
         * @param {EventsMap} events
         */
        BaseView.prototype.delegateEvents = function (events) {
            var _this = this;
            this._bindUIElements();
            events = events || orange_1.result(this, 'events');
            events = util_1.normalizeUIKeys(events, this._ui);
            var triggers = this._configureTriggers();
            events = orange_1.extend({}, events, triggers);
            debug('%s delegate events %j', this, events);
            if (!events)
                return this;
            //if (!(events || (events = result(this, 'events')))) return this;
            //this.undelegateEvents();
            var dels = [];
            for (var key in events) {
                var method = events[key];
                if (typeof method !== 'function')
                    method = this[method];
                var match = key.match(/^(\S+)\s*(.*)$/);
                // Set delegates immediately and defer event on this.el
                var boundFn = orange_1.bind(method, this);
                if (match[2]) {
                    this.delegate(match[1], match[2], boundFn);
                }
                else {
                    dels.push([match[1], boundFn]);
                }
            }
            dels.forEach(function (d) { _this.delegate(d[0], d[1]); });
            return this;
        };
        /**
         * Undelegate events
         */
        BaseView.prototype.undelegateEvents = function () {
            this._unbindUIElements();
            debug('%s undelegate events', this);
            if (this.el) {
                for (var i = 0, len = this._domEvents.length; i < len; i++) {
                    var item = this._domEvents[i];
                    orange_dom_1.removeEventListener(this.el, item.eventName, item.handler);
                }
                this._domEvents.length = 0;
            }
            return this;
        };
        BaseView.prototype.delegate = function (eventName, selector, listener) {
            if (typeof selector === 'function') {
                listener = selector;
                selector = null;
            }
            var root = this.el;
            var handler = selector ? function (e) {
                var node = e.target || e.srcElement;
                // Already handled
                if (e.delegateTarget)
                    return;
                for (; node && node != root; node = node.parentNode) {
                    if (orange_dom_1.matches(node, selector)) {
                        e.delegateTarget = node;
                        listener(e);
                    }
                }
            } : function (e) {
                if (e.delegateTarget)
                    return;
                listener(e);
            };
            /*jshint bitwise: false*/
            var useCap = !!~unbubblebles.indexOf(eventName) && selector != null;
            debug('%s delegate event %s ', this, eventName);
            orange_dom_1.addEventListener(this.el, eventName, handler, useCap);
            this._domEvents.push({ eventName: eventName, handler: handler, listener: listener, selector: selector });
            return handler;
        };
        BaseView.prototype.undelegate = function (eventName, selector, listener) {
            if (typeof selector === 'function') {
                listener = selector;
                selector = null;
            }
            if (this.el) {
                var handlers = this._domEvents.slice();
                for (var i = 0, len = handlers.length; i < len; i++) {
                    var item = handlers[i];
                    var match = item.eventName === eventName &&
                        (listener ? item.listener === listener : true) &&
                        (selector ? item.selector === selector : true);
                    if (!match)
                        continue;
                    orange_dom_1.removeEventListener(this.el, item.eventName, item.handler);
                    this._domEvents.splice(orange_1.indexOf(handlers, item), 1);
                }
            }
            return this;
        };
        BaseView.prototype.render = function (options) {
            this.undelegateEvents();
            this.delegateEvents();
            return this;
        };
        /**
         * Append the view to a HTMLElement
         * @param {HTMLElement|string} elm A html element or a selector string
         * @return {this} for chaining
         */
        BaseView.prototype.appendTo = function (elm) {
            if (elm instanceof HTMLElement) {
                elm.appendChild(this.el);
            }
            else {
                var el = document.querySelector(elm);
                el ? el.appendChild(this.el) : void 0;
            }
            return this;
        };
        /**
         * Append a element the view
         * @param {HTMLElement} elm
         * @param {String} toSelector
         * @return {this} for chaining
         */
        BaseView.prototype.append = function (elm, toSelector) {
            if (toSelector != null) {
                var ret = this.$(toSelector);
                if (ret instanceof NodeList && ret.length > 0) {
                    ret[0].appendChild(elm);
                }
                else if (ret instanceof HTMLElement) {
                    ret.appendChild(elm);
                }
            }
            else {
                this.el.appendChild(elm);
            }
            return this;
        };
        /**
         * Convience for view.el.querySelectorAll()
         * @param {string|HTMLElement} selector
         */
        BaseView.prototype.$ = function (selector) {
            if (selector instanceof HTMLElement) {
                return selector;
            }
            else {
                return BaseView.find(selector, this.el);
            }
        };
        BaseView.prototype.setElement = function (elm, trigger) {
            if (trigger === void 0) { trigger = true; }
            this.triggerMethod('before:set:element');
            if (trigger)
                this.undelegateEvents();
            this._setElement(elm);
            if (trigger)
                this.delegateEvents();
            this.triggerMethod('set:element');
        };
        BaseView.prototype.remove = function () {
            this._removeElement();
            return this;
        };
        BaseView.prototype.destroy = function () {
            if (this.isDestroyed)
                return;
            this.remove();
            _super.prototype.destroy.call(this);
            return this;
        };
        // PRIVATES
        /**
         * Bind ui elements
         * @private
         */
        BaseView.prototype._bindUIElements = function () {
            var _this = this;
            var ui = this.getOption('ui'); //this.options.ui||this.ui
            if (!ui)
                return;
            if (!this._ui) {
                this._ui = ui;
            }
            ui = orange_1.result(this, '_ui');
            this.ui = {};
            Object.keys(ui).forEach(function (k) {
                var elm = _this.$(ui[k]);
                if (elm && elm.length) {
                    // unwrap if it's a nodelist.
                    if (elm instanceof NodeList) {
                        elm = elm[0];
                    }
                    debug('%s added ui element %s %s', _this, k, ui[k]);
                    _this.ui[k] = elm;
                }
                else {
                    debug('%s ui element not found ', _this, k, ui[k]);
                }
            });
        };
        /**
         * Unbind ui elements
         * @private
         */
        BaseView.prototype._unbindUIElements = function () {
        };
        /**
         * Configure triggers
         * @return {Object} events object
         * @private
         */
        BaseView.prototype._configureTriggers = function () {
            var triggers = this.getOption('triggers') || {};
            if (typeof triggers === 'function') {
                triggers = triggers.call(this);
            }
            // Allow `triggers` to be configured as a function
            triggers = util_1.normalizeUIKeys(triggers, this._ui);
            // Configure the triggers, prevent default
            // action and stop propagation of DOM events
            var events = {}, val, key;
            for (key in triggers) {
                val = triggers[key];
                debug('%s added trigger %s %s', this, key, val);
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
        BaseView.prototype._buildViewTrigger = function (triggerDef) {
            if (typeof triggerDef === 'string')
                triggerDef = { event: triggerDef };
            var options = orange_1.extend({
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
        BaseView.prototype._createElement = function (tagName) {
            return document.createElement(tagName);
        };
        BaseView.prototype._ensureElement = function () {
            if (!this.el) {
                var attrs = orange_1.extend({}, orange_1.result(this, 'attributes'));
                if (this.id)
                    attrs.id = orange_1.result(this, 'id');
                if (this.className)
                    attrs['class'] = orange_1.result(this, 'className');
                debug('%s created element: %s', this, orange_1.result(this, 'tagName') || 'div');
                this.setElement(this._createElement(orange_1.result(this, 'tagName') || 'div'), false);
                this._setAttributes(attrs);
            }
            else {
                this.setElement(orange_1.result(this, 'el'), false);
            }
        };
        BaseView.prototype._removeElement = function () {
            this.undelegateEvents();
            if (this.el.parentNode)
                this.el.parentNode.removeChild(this.el);
        };
        BaseView.prototype._setElement = function (element) {
            if (typeof element === 'string') {
                if (paddedLt.test(element)) {
                    var el = document.createElement('div');
                    el.innerHTML = element;
                    this.el = el.firstElementChild;
                }
                else {
                    this.el = document.querySelector(element);
                }
            }
            else {
                this.el = element;
            }
        };
        BaseView.prototype._setAttributes = function (attrs) {
            for (var attr in attrs) {
                attr in this.el ? this.el[attr] = attrs[attr] : this.el.setAttribute(attr, attrs[attr]);
            }
        };
        BaseView.prototype.toString = function () {
            return "[" + (this.name || 'View') + ": " + this.cid + "]";
        };
        return BaseView;
    }(object_1.BaseObject));
    exports.BaseView = BaseView;
});
