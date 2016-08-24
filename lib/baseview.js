"use strict";
const debug = require('debug')('views:baseview');
const object_1 = require('./object');
const utils = require('orange');
const util_1 = require('./util');
const paddedLt = /^\s*</;
const unbubblebles = 'focus blur change'.split(' ');
let viewOptions = ['el', 'id', 'attributes', 'className', 'tagName', 'events', 'triggers', 'ui'];
class BaseView extends object_1.BaseObject {
    /**
     * BaseView
     * @param {BaseViewOptions} options
     * @extends BaseObject
     */
    constructor(options = {}) {
        super();
        this._cid = utils.uniqueId('view');
        utils.extend(this, utils.pick(options, viewOptions));
        this._domEvents = [];
        if (this.el == null) {
            this._ensureElement();
        }
    }
    static find(selector, context) {
        return context.querySelectorAll(selector);
    }
    get cid() {
        return this._cid;
    }
    /**
     * Delegate events
     * @param {EventsMap} events
     */
    delegateEvents(events) {
        this._bindUIElements();
        events = events || utils.result(this, 'events');
        events = util_1.normalizeUIKeys(events, this._ui);
        let triggers = this._configureTriggers();
        events = utils.extend({}, events, triggers);
        debug('%s delegate events %j', this, events);
        if (!events)
            return this;
        //if (!(events || (events = utils.result(this, 'events')))) return this;
        //this.undelegateEvents();
        let dels = [];
        for (let key in events) {
            let method = events[key];
            if (typeof method !== 'function')
                method = this[method];
            let match = key.match(/^(\S+)\s*(.*)$/);
            // Set delegates immediately and defer event on this.el
            let boundFn = utils.bind(method, this);
            if (match[2]) {
                this.delegate(match[1], match[2], boundFn);
            }
            else {
                dels.push([match[1], boundFn]);
            }
        }
        dels.forEach(d => { this.delegate(d[0], d[1]); });
        return this;
    }
    /**
     * Undelegate events
     */
    undelegateEvents() {
        this._unbindUIElements();
        debug('%s undelegate events', this);
        if (this.el) {
            for (var i = 0, len = this._domEvents.length; i < len; i++) {
                var item = this._domEvents[i];
                utils.removeEventListener(this.el, item.eventName, item.handler);
            }
            this._domEvents.length = 0;
        }
        return this;
    }
    delegate(eventName, selector, listener) {
        if (typeof selector === 'function') {
            listener = selector;
            selector = null;
        }
        let root = this.el;
        let handler = selector ? function (e) {
            let node = e.target || e.srcElement;
            // Already handled
            if (e.delegateTarget)
                return;
            for (; node && node != root; node = node.parentNode) {
                if (utils.matches(node, selector)) {
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
        let useCap = !!~unbubblebles.indexOf(eventName) && selector != null;
        debug('%s delegate event %s ', this, eventName);
        utils.addEventListener(this.el, eventName, handler, useCap);
        this._domEvents.push({ eventName: eventName, handler: handler, listener: listener, selector: selector });
        return handler;
    }
    undelegate(eventName, selector, listener) {
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
                utils.removeEventListener(this.el, item.eventName, item.handler);
                this._domEvents.splice(utils.indexOf(handlers, item), 1);
            }
        }
        return this;
    }
    render(options) {
        this.undelegateEvents();
        this.delegateEvents();
        return this;
    }
    /**
     * Append the view to a HTMLElement
     * @param {HTMLElement|string} elm A html element or a selector string
     * @return {this} for chaining
     */
    appendTo(elm) {
        if (elm instanceof HTMLElement) {
            elm.appendChild(this.el);
        }
        else {
            let el = document.querySelector(elm);
            el ? el.appendChild(this.el) : void 0;
        }
        return this;
    }
    /**
     * Append a element the view
     * @param {HTMLElement} elm
     * @param {String} toSelector
     * @return {this} for chaining
     */
    append(elm, toSelector) {
        if (toSelector != null) {
            let ret = this.$(toSelector);
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
    }
    /**
     * Convience for view.el.querySelectorAll()
     * @param {string|HTMLElement} selector
     */
    $(selector) {
        if (selector instanceof HTMLElement) {
            return selector;
        }
        else {
            return BaseView.find(selector, this.el);
        }
    }
    setElement(elm, trigger = true) {
        this.triggerMethod('before:set:element');
        if (trigger)
            this.undelegateEvents();
        this._setElement(elm);
        if (trigger)
            this.delegateEvents();
        this.triggerMethod('set:element');
    }
    remove() {
        this._removeElement();
        return this;
    }
    destroy() {
        if (this.isDestroyed)
            return;
        this.remove();
        super.destroy();
        return this;
    }
    // PRIVATES
    /**
     * Bind ui elements
     * @private
     */
    _bindUIElements() {
        let ui = this.getOption('ui'); //this.options.ui||this.ui
        if (!ui)
            return;
        if (!this._ui) {
            this._ui = ui;
        }
        ui = utils.result(this, '_ui');
        this.ui = {};
        Object.keys(ui).forEach((k) => {
            let elm = this.$(ui[k]);
            if (elm && elm.length) {
                // unwrap if it's a nodelist.
                if (elm instanceof NodeList) {
                    elm = elm[0];
                }
                debug('%s added ui element %s %s', this, k, ui[k]);
                this.ui[k] = elm;
            }
            else {
                debug('%s ui element not found ', this, k, ui[k]);
            }
        });
    }
    /**
     * Unbind ui elements
     * @private
     */
    _unbindUIElements() {
    }
    /**
     * Configure triggers
     * @return {Object} events object
     * @private
     */
    _configureTriggers() {
        let triggers = this.getOption('triggers') || {};
        if (typeof triggers === 'function') {
            triggers = triggers.call(this);
        }
        // Allow `triggers` to be configured as a function
        triggers = util_1.normalizeUIKeys(triggers, this._ui);
        // Configure the triggers, prevent default
        // action and stop propagation of DOM events
        let events = {}, val, key;
        for (key in triggers) {
            val = triggers[key];
            debug('%s added trigger %s %s', this, key, val);
            events[key] = this._buildViewTrigger(val);
        }
        return events;
    }
    /**
     * builder trigger function
     * @param  {Object|String} triggerDef Trigger definition
     * @return {Function}
     * @private
     */
    _buildViewTrigger(triggerDef) {
        if (typeof triggerDef === 'string')
            triggerDef = { event: triggerDef };
        let options = utils.extend({
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
    }
    _createElement(tagName) {
        return document.createElement(tagName);
    }
    _ensureElement() {
        if (!this.el) {
            var attrs = utils.extend({}, utils.result(this, 'attributes'));
            if (this.id)
                attrs.id = utils.result(this, 'id');
            if (this.className)
                attrs['class'] = utils.result(this, 'className');
            debug('%s created element: %s', this, utils.result(this, 'tagName') || 'div');
            this.setElement(this._createElement(utils.result(this, 'tagName') || 'div'), false);
            this._setAttributes(attrs);
        }
        else {
            this.setElement(utils.result(this, 'el'), false);
        }
    }
    _removeElement() {
        this.undelegateEvents();
        if (this.el.parentNode)
            this.el.parentNode.removeChild(this.el);
    }
    _setElement(element) {
        if (typeof element === 'string') {
            if (paddedLt.test(element)) {
                let el = document.createElement('div');
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
    }
    _setAttributes(attrs) {
        for (var attr in attrs) {
            attr in this.el ? this.el[attr] = attrs[attr] : this.el.setAttribute(attr, attrs[attr]);
        }
    }
    toString() {
        return `[${this.name || 'View'}: ${this.cid}]`;
    }
}
exports.BaseView = BaseView;
