import { BaseObject } from './object';
import { html, utils } from './utils';
const paddedLt = /^\s*</;
const unbubblebles = 'focus blur change'.split(' ');
let viewOptions = ['el', 'id', 'attributes', 'className', 'tagName', 'events'];
export class BaseView extends BaseObject {
    constructor(options = {}) {
        super();
        this._cid = utils.uniqueId('view');
        utils.extend(this, utils.pick(options, viewOptions));
        this._domEvents = [];
        if (this.el == null) {
            this._ensureElement();
        }
        else {
            this.delegateEvents();
        }
        this.initialize();
    }
    static find(selector, context) {
        return context.querySelectorAll(selector);
    }
    get cid() {
        return this._cid;
    }
    initialize() {
    }
    // Event Delegation
    delegateEvents(events) {
        if (!(events || (events = utils.result(this, 'events'))))
            return this;
        this.undelegateEvents();
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
    undelegateEvents() {
        if (this.el) {
            for (var i = 0, len = this._domEvents.length; i < len; i++) {
                var item = this._domEvents[i];
                html.removeEventListener(this.el, item.eventName, item.handler);
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
                if (html.matches(node, selector)) {
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
        let useCap = !!~unbubblebles.indexOf(eventName);
        html.addEventListener(this.el, eventName, handler, useCap);
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
                html.removeEventListener(this.el, item.eventName, item.handler);
                this._domEvents.splice(utils.indexOf(handlers, item), 1);
            }
        }
        return this;
    }
    render(options) {
        return this;
    }
    appendTo(elm) {
        elm.appendChild(this.el);
        return this;
    }
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
    $(selector) {
        if (selector instanceof HTMLElement) {
            return selector;
        }
        else {
            return BaseView.find(selector, this.el);
        }
    }
    setElement(elm) {
        this.undelegateEvents();
        this._setElement(elm);
        this.delegateEvents();
    }
    remove() {
        this._removeElement();
        return this;
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
            this.setElement(this._createElement(utils.result(this, 'tagName') || 'div'));
            this._setAttributes(attrs);
        }
        else {
            this.setElement(utils.result(this, 'el'));
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
}
