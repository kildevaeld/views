/*import {EventEmitter} from './events'
import BaseObject from './object';
import {html, utils} from './utils'*/

/// <reference path="./object.ts"/>
/// <reference path="./utils"/>

const paddedLt = /^\s*</;
const unbubblebles = 'focus blur change'.split(' ');

//const utils = views.utils

module views {
  export interface BaseViewOptions {
    el?: HTMLElement
    id?: string
    attributes?: {[key:string]:any}
    className?:string
    tagName?:string
    events?: {[key:string]:Function|string}
  }

  let viewOptions = ['el', 'id', 'attributes', 'className', 'tagName', 'events'];

  export class BaseView<T extends HTMLElement> extends views.BaseObject {
    tagName: string
    className: string

    id: string
    private _cid: string
    get cid(): string  {
      return this._cid
    }
    options: BaseViewOptions
    el: T
    events: any //{[key:string]:Function|string}
    attributes: {[key:string]:any}
    triggers: any
    private _domEvents: any[]

    constructor (options: BaseViewOptions = {}) {

      super()

      this._cid = utils.uniqueId('view')
      this.options = options;

      utils.extend(this, utils.pick(options, viewOptions))

      this._domEvents = []

      if (this.el == null) {
        this._ensureElement()
      } else {
        this.delegateEvents()
      }

      this.initialize()
    }

    initialize () {

    }

    // Event Delegation
    delegateEvents (events?: any): any {

      if (!(events || (events = utils.result(this, 'events')))) return this;
      this.undelegateEvents();

      let dels = []
      for (let key in events) {
        let method = events[key];
        if (typeof method !== 'function') method = this[events[key]];

        let match = key.match(/^(\S+)\s*(.*)$/);

        // Set delegates immediately and defer event on this.el
        let boundFn = utils.bind(method, this);
        if (match[2]) {
          this.delegate(match[1], match[2], boundFn);
        } else {
          dels.push([match[1], boundFn]);
        }
      }

      dels.forEach( d => { this.delegate(d[0],d[1]) });

      return this;
    }

    undelegateEvents () {
      if (this.el) {
        for (var i = 0, len = this._domEvents.length; i < len; i++) {
          var item = this._domEvents[i];
          html.removeEventListener(this.el, item.eventName, item.handler);
        }
        this._domEvents.length = 0;
      }
      return this;
    }

    delegate (eventName:string, selector?:string|Function, listener?: Function) {
      if (typeof selector === 'function') {
        listener = <Function>selector;
        selector = null;
      }

      let root = this.el;
      let handler = selector ? function (e) {
        let node = e.target || e.srcElement;

        // Already handled
        if (e.delegateTarget) return;

        for (; node && node != root; node = node.parentNode) {
          if (html.matches(node, selector)) {

            e.delegateTarget = node;
            listener(e);
          }
        }
      } : function (e) {
        if (e.delegateTarget) return;
        listener(e);
      };
      /*jshint bitwise: false*/
      let useCap = !!~unbubblebles.indexOf(eventName);

      html.addEventListener(this.el, eventName, handler, useCap);
      this._domEvents.push({eventName: eventName, handler: handler, listener: listener, selector: selector});
      return handler;
    }

    undelegate (eventName:string, selector?:string|Function, listener?:Function) {
      if (typeof selector === 'function') {
        listener = <Function>selector;
        selector = null;
      }

      if (this.el) {
        var handlers = this._domEvents.slice();
        for (var i = 0, len = handlers.length; i < len; i++) {
          var item = handlers[i];

          var match = item.eventName === eventName &&
              (listener ? item.listener === listener : true) &&
              (selector ? item.selector === selector : true);

          if (!match) continue;

          html.removeEventListener(this.el, item.eventName, item.handler);
          this._domEvents.splice(utils.indexOf(handlers, item), 1);
        }
      }
      return this;
    }

    render (options:any): any {
      return this
    }

    appendTo(elm:HTMLElement): any {
      elm.appendChild(this.el)
      return this
    }

    append (elm: HTMLElement, toSelector?:string): any {
      if (toSelector != null) {
        let ret = this.$(toSelector)
        if (ret.length) {
          ret[0].appendChild(elm)
        }
      } else {
        this.el.appendChild(elm)
      }
      return this
    }

    $ (selector: string): NodeList {
      return this.el.querySelectorAll(selector)
    }

    setElement (elm: T) {
      this.undelegateEvents()
      this._setElement(elm)
      this.delegateEvents()
    }

    remove () {
      this._removeElement();
      return this;
    }

    private _createElement (tagName: string): T {
      return <T>document.createElement(tagName)
    }

    private _ensureElement () {
      if (!this.el) {
          var attrs = utils.extend({}, utils.result(this, 'attributes'));
          if (this.id) attrs.id = utils.result(this, 'id');
          if (this.className) attrs['class'] = utils.result(this, 'className');
          this.setElement(this._createElement(utils.result(this, 'tagName')||'div'));
          this._setAttributes(attrs);
        } else {
          this.setElement(utils.result(this, 'el'));
        }
    }

    private _removeElement () {
      this.undelegateEvents();
      if (this.el.parentNode) this.el.parentNode.removeChild(this.el);
    }

    private _setElement (element: T|string) {
      if (typeof element === 'string') {
        if (paddedLt.test(element)) {
          let el = document.createElement('div');
          el.innerHTML = element;
          this.el = <T>el.firstElementChild
        } else {
          this.el = <T>document.querySelector(element);
        }
      } else {
        this.el = element;
      }
    }

    private _setAttributes (attrs) {
      for (var attr in attrs) {
        attr in this.el ? this.el[attr] = attrs[attr] : this.el.setAttribute(attr, attrs[attr]);
      }
    }

  }
}
