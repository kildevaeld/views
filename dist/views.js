(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define(factory);
	else if(typeof exports === 'object')
		exports["views"] = factory();
	else
		root["views"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(1));
	__export(__webpack_require__(6));
	__export(__webpack_require__(5));
	__export(__webpack_require__(4));
	__export(__webpack_require__(3));
	__export(__webpack_require__(2));
	__export(__webpack_require__(7));
	__export(__webpack_require__(8));
	__export(__webpack_require__(9));
	__export(__webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./extensions/data-view\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())));
	__export(__webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./extensions/collection-view\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())));


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    __.prototype = b.prototype;
	    d.prototype = new __();
	};
	var base = __webpack_require__(2);
	var utils_1 = __webpack_require__(5);
	var kUIRegExp = /@ui.([a-zA-Z_\-\$#]+)/i;
	function normalizeUIKeys(obj) {
	    /*jshint -W030 */
	    var o = {}, k, v, ms, sel, ui;
	    for (k in obj) {
	        v = obj[k];
	        if ((ms = kUIRegExp.exec(k)) !== null) {
	            ui = ms[1], sel = this._ui[ui];
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
	        _super.call(this, options);
	        this.ui = {};
	    }
	    View.prototype.delegateEvents = function (events) {
	        this.bindUIElements();
	        events = events || this.events;
	        events = normalizeUIKeys.call(this, events);
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
	    return View;
	})(base.BaseView);
	exports.View = View;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    __.prototype = b.prototype;
	    d.prototype = new __();
	};
	var object_1 = __webpack_require__(3);
	var utils_1 = __webpack_require__(5);
	var paddedLt = /^\s*</;
	var unbubblebles = 'focus blur change'.split(' ');
	var viewOptions = ['el', 'id', 'attributes', 'className', 'tagName', 'events'];
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
	        this._cid = utils_1.utils.uniqueId('view');
	        utils_1.utils.extend(this, utils_1.utils.pick(options, viewOptions));
	        this._domEvents = [];
	        if (this.el == null) {
	            this._ensureElement();
	        }
	        else {
	            this.delegateEvents();
	        }
	        this.initialize();
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
	    BaseView.prototype.initialize = function () {
	    };
	    /**
	     * Delegate events
	     * @param {EventsMap} events
	     */
	    BaseView.prototype.delegateEvents = function (events) {
	        var _this = this;
	        if (!(events || (events = utils_1.utils.result(this, 'events'))))
	            return this;
	        this.undelegateEvents();
	        var dels = [];
	        for (var key in events) {
	            var method = events[key];
	            if (typeof method !== 'function')
	                method = this[method];
	            var match = key.match(/^(\S+)\s*(.*)$/);
	            // Set delegates immediately and defer event on this.el
	            var boundFn = utils_1.utils.bind(method, this);
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
	        if (this.el) {
	            for (var i = 0, len = this._domEvents.length; i < len; i++) {
	                var item = this._domEvents[i];
	                utils_1.html.removeEventListener(this.el, item.eventName, item.handler);
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
	                if (utils_1.html.matches(node, selector)) {
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
	        var useCap = !!~unbubblebles.indexOf(eventName);
	        utils_1.html.addEventListener(this.el, eventName, handler, useCap);
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
	                utils_1.html.removeEventListener(this.el, item.eventName, item.handler);
	                this._domEvents.splice(utils_1.utils.indexOf(handlers, item), 1);
	            }
	        }
	        return this;
	    };
	    BaseView.prototype.render = function (options) {
	        return this;
	    };
	    BaseView.prototype.appendTo = function (elm) {
	        elm.appendChild(this.el);
	        return this;
	    };
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
	    BaseView.prototype.$ = function (selector) {
	        if (selector instanceof HTMLElement) {
	            return selector;
	        }
	        else {
	            return BaseView.find(selector, this.el);
	        }
	    };
	    BaseView.prototype.setElement = function (elm) {
	        this.undelegateEvents();
	        this._setElement(elm);
	        this.delegateEvents();
	    };
	    BaseView.prototype.remove = function () {
	        this._removeElement();
	        return this;
	    };
	    BaseView.prototype._createElement = function (tagName) {
	        return document.createElement(tagName);
	    };
	    BaseView.prototype._ensureElement = function () {
	        if (!this.el) {
	            var attrs = utils_1.utils.extend({}, utils_1.utils.result(this, 'attributes'));
	            if (this.id)
	                attrs.id = utils_1.utils.result(this, 'id');
	            if (this.className)
	                attrs['class'] = utils_1.utils.result(this, 'className');
	            this.setElement(this._createElement(utils_1.utils.result(this, 'tagName') || 'div'));
	            this._setAttributes(attrs);
	        }
	        else {
	            this.setElement(utils_1.utils.result(this, 'el'));
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
	    return BaseView;
	})(object_1.BaseObject);
	exports.BaseView = BaseView;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    __.prototype = b.prototype;
	    d.prototype = new __();
	};
	var events_1 = __webpack_require__(4);
	var utils_1 = __webpack_require__(5);
	/** Base object */
	var BaseObject = (function (_super) {
	    __extends(BaseObject, _super);
	    /**
	     * Object
	     * @extends EventEmitter
	     */
	    function BaseObject() {
	        _super.call(this);
	        this._isDestroyed = false;
	    }
	    Object.defineProperty(BaseObject.prototype, "isDestroyed", {
	        /**
	         * Whether the object is "destroyed" or not
	         * @type boolean
	         */
	        get: function () {
	            return this._isDestroyed;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    BaseObject.prototype.destroy = function () {
	        if (this.isDestroyed)
	            return this;
	        this.triggerMethod('before:destroy');
	        this.stopListening();
	        this.off();
	        this._isDestroyed = true;
	        this.triggerMethod('destroy');
	        if (typeof Object.freeze) {
	            Object.freeze(this);
	        }
	        return this;
	    };
	    BaseObject.prototype.triggerMethod = function (eventName) {
	        var args = [];
	        for (var _i = 1; _i < arguments.length; _i++) {
	            args[_i - 1] = arguments[_i];
	        }
	        utils_1.utils.triggerMethodOn(this, eventName, args);
	        return this;
	    };
	    BaseObject.prototype.getOption = function (prop) {
	        var args = [];
	        for (var _i = 1; _i < arguments.length; _i++) {
	            args[_i - 1] = arguments[_i];
	        }
	        if (this.options) {
	            args.push(this.options);
	        }
	        args.push(this);
	        return utils_1.utils.getOption(prop, args);
	    };
	    BaseObject.extend = utils_1.extend;
	    return BaseObject;
	})(events_1.EventEmitter);
	exports.BaseObject = BaseObject;


/***/ },
/* 4 */
/***/ function(module, exports) {

	var idCounter = 0;
	function getID() {
	    return "" + (++idCounter);
	}
	var EventEmitter = (function () {
	    function EventEmitter() {
	        this._listeners = {};
	        this._listeningTo = {};
	    }
	    Object.defineProperty(EventEmitter.prototype, "listeners", {
	        get: function () {
	            return this._listeners;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    EventEmitter.prototype.on = function (event, fn, ctx, once) {
	        if (once === void 0) { once = false; }
	        var events = this._listeners[event] || (this._listeners[event] = []);
	        events.push({
	            name: event,
	            once: once,
	            handler: fn,
	            ctx: ctx || this
	        });
	        return this;
	    };
	    EventEmitter.prototype.once = function (event, fn) {
	        return this.on(event, fn, true);
	    };
	    EventEmitter.prototype.off = function (eventName, fn) {
	        if (eventName == null) {
	            this._listeners = {};
	        }
	        else if (this._listeners[eventName]) {
	            var events = this._listeners[eventName];
	            if (fn == null) {
	                this._listeners[eventName] = [];
	            }
	            else {
	                for (var i = 0; i < events.length; i++) {
	                    var event_1 = events[i];
	                    if (events[i].handler == fn) {
	                        this._listeners[eventName].splice(i, 1);
	                    }
	                }
	            }
	        }
	    };
	    EventEmitter.prototype.trigger = function (eventName) {
	        var args = [];
	        for (var _i = 1; _i < arguments.length; _i++) {
	            args[_i - 1] = arguments[_i];
	        }
	        var events = (this._listeners[eventName] || []).concat(this._listeners["all"] || []);
	        for (var i = 0; i < events.length; i++) {
	            var event_2 = events[i];
	            var a = args;
	            if (event_2.name == 'all') {
	                a = [eventName].concat(args);
	            }
	            event_2.handler.apply(event_2.ctx, a);
	            if (event_2.once === true) {
	                var index = this._listeners[event_2.name].indexOf(event_2);
	                this._listeners[event_2.name].splice(index, 1);
	            }
	        }
	        return this;
	    };
	    EventEmitter.prototype.listenTo = function (obj, event, fn, ctx, once) {
	        if (once === void 0) { once = false; }
	        var listeningTo = this._listeningTo || (this._listeningTo = {});
	        var id = obj.listenId || (obj.listenId = getID());
	        listeningTo[id] = obj;
	        var meth = once ? 'once' : 'on';
	        obj[meth](event, fn, this);
	        return this;
	    };
	    EventEmitter.prototype.listenToOnce = function (obj, event, fn, ctx) {
	        return this.listenTo(obj, event, fn, ctx, true);
	    };
	    EventEmitter.prototype.stopListening = function (obj, event, callback) {
	        var listeningTo = this._listeningTo || {};
	        var remove = !event && !callback;
	        if (obj)
	            listeningTo[obj.listenId] = obj;
	        for (var id in listeningTo) {
	            obj = listeningTo[id];
	            obj.off(event, callback, this);
	            if (remove || !Object.keys(obj.listeners).length)
	                delete this._listeningTo[id];
	        }
	        return this;
	    };
	    return EventEmitter;
	})();
	exports.EventEmitter = EventEmitter;


/***/ },
/* 5 */
/***/ function(module, exports) {

	var ElementProto = (typeof Element !== 'undefined' && Element.prototype) || {};
	var matchesSelector = ElementProto.matches ||
	    ElementProto.webkitMatchesSelector ||
	    ElementProto.mozMatchesSelector ||
	    ElementProto.msMatchesSelector ||
	    ElementProto.oMatchesSelector || function (selector) {
	    var nodeList = (this.parentNode || document).querySelectorAll(selector) || [];
	    return !!~utils.indexOf(nodeList, this);
	};
	var elementAddEventListener = ElementProto.addEventListener || function (eventName, listener) {
	    return this.attachEvent('on' + eventName, listener);
	};
	var elementRemoveEventListener = ElementProto.removeEventListener || function (eventName, listener) {
	    return this.detachEvent('on' + eventName, listener);
	};
	function extend(protoProps, staticProps) {
	    var parent = this;
	    var child;
	    // The constructor function for the new subclass is either defined by you
	    // (the "constructor" property in your `extend` definition), or defaulted
	    // by us to simply call the parent's constructor.
	    if (protoProps && utils.has(protoProps, 'constructor')) {
	        child = protoProps.constructor;
	    }
	    else {
	        child = function () { return parent.apply(this, arguments); };
	    }
	    // Add static properties to the constructor function, if supplied.
	    utils.extend(child, parent, staticProps);
	    // Set the prototype chain to inherit from `parent`, without calling
	    // `parent`'s constructor function.
	    var Surrogate = function () { this.constructor = child; };
	    Surrogate.prototype = parent.prototype;
	    child.prototype = new Surrogate;
	    // Add prototype properties (instance properties) to the subclass,
	    // if supplied.
	    if (protoProps)
	        utils.extend(child.prototype, protoProps);
	    // Set a convenience property in case the parent's prototype is needed
	    // later.
	    child.__super__ = parent.prototype;
	    return child;
	}
	exports.extend = extend;
	var html;
	(function (html) {
	    function matches(elm, selector) {
	        return matchesSelector.call(elm, selector);
	    }
	    html.matches = matches;
	    function addEventListener(elm, eventName, listener, useCap) {
	        if (useCap === void 0) { useCap = false; }
	        elementAddEventListener.call(elm, eventName, listener, useCap);
	    }
	    html.addEventListener = addEventListener;
	    function removeEventListener(elm, eventName, listener) {
	        elementRemoveEventListener.call(elm, eventName, listener);
	    }
	    html.removeEventListener = removeEventListener;
	    function addClass(elm, className) {
	        elm.classList.add(className);
	    }
	    html.addClass = addClass;
	    function removeClass(elm, className) {
	        elm.classList.remove(className);
	    }
	    html.removeClass = removeClass;
	})(html = exports.html || (exports.html = {}));
	var nativeBind = Function.prototype.bind;
	var noop = function () { };
	var idCounter = 0;
	/** @module utils */
	var utils;
	(function (utils) {
	    /** Generate an unique id with an optional prefix
	     * @param {string} prefix
	     * @return {string}
	     */
	    function uniqueId(prefix) {
	        if (prefix === void 0) { prefix = ''; }
	        return prefix + (++idCounter);
	    }
	    utils.uniqueId = uniqueId;
	    function isObject(obj) {
	        return obj === Object(obj);
	    }
	    utils.isObject = isObject;
	    function extend(obj) {
	        var args = [];
	        for (var _i = 1; _i < arguments.length; _i++) {
	            args[_i - 1] = arguments[_i];
	        }
	        if (!utils.isObject(obj))
	            return obj;
	        var o, k;
	        for (var _a = 0; _a < args.length; _a++) {
	            o = args[_a];
	            if (!utils.isObject(o))
	                continue;
	            for (k in o) {
	                if (utils.has(o, k))
	                    obj[k] = o[k];
	            }
	        }
	        return obj;
	    }
	    utils.extend = extend;
	    function pick(obj, props) {
	        var out = {}, prop;
	        for (var _i = 0; _i < props.length; _i++) {
	            prop = props[_i];
	            if (utils.has(obj, prop))
	                out[prop] = obj[prop];
	        }
	        return out;
	    }
	    utils.pick = pick;
	    function has(obj, prop) {
	        return Object.prototype.hasOwnProperty.call(obj, prop);
	    }
	    utils.has = has;
	    function indexOf(array, item) {
	        for (var i = 0, len = array.length; i < len; i++)
	            if (array[i] === item)
	                return i;
	        return -1;
	    }
	    utils.indexOf = indexOf;
	    function result(obj, prop, ctx, args) {
	        var ret = obj[prop];
	        return (typeof ret === 'function') ? utils.call(ret, ctx, args || []) : ret;
	    }
	    utils.result = result;
	    function values(obj) {
	        var output = [];
	        for (var k in obj)
	            if (utils.has(obj, k)) {
	                output.push(obj[k]);
	            }
	        return output;
	    }
	    utils.values = values;
	    function find(array, callback, ctx) {
	        var i, v;
	        for (i = 0; i < array.length; i++) {
	            v = array[i];
	            if (callback.call(ctx, v))
	                return v;
	        }
	        return null;
	    }
	    utils.find = find;
	    function proxy(from, to, fns) {
	        if (!Array.isArray(fns))
	            fns = [fns];
	        fns.forEach(function (fn) {
	            if (typeof to[fn] === 'function') {
	                from[fn] = utils.bind(to[fn], to);
	            }
	        });
	    }
	    utils.proxy = proxy;
	    function bind(method, context) {
	        var args = [];
	        for (var _i = 2; _i < arguments.length; _i++) {
	            args[_i - 2] = arguments[_i];
	        }
	        if (typeof method !== 'function')
	            throw new Error('method not at function');
	        if (nativeBind != null)
	            return nativeBind.call.apply(nativeBind, [method, context].concat(args));
	        args = args || [];
	        var fnoop = function () { };
	        var fBound = function () {
	            var ctx = this instanceof fnoop ? this : context;
	            return utils.call(method, ctx, args.concat(utils.slice(arguments)));
	        };
	        fnoop.prototype = this.prototype;
	        fBound.prototype = new fnoop();
	        return fBound;
	    }
	    utils.bind = bind;
	    function call(fn, ctx, args) {
	        switch (args.length) {
	            case 0:
	                return fn.call(ctx);
	            case 1:
	                return fn.call(ctx, args[0]);
	            case 2:
	                return fn.call(ctx, args[0], args[1]);
	            case 3:
	                return fn.call(ctx, args[0], args[1], args[2]);
	            case 4:
	                return fn.call(ctx, args[0], args[1], args[2], args[3]);
	            case 5:
	                return fn.call(ctx, args[0], args[1], args[2], args[3], args[4]);
	            default:
	                return fn.apply(ctx, args);
	        }
	    }
	    utils.call = call;
	    function slice(array) {
	        return Array.prototype.slice.call(array);
	    }
	    utils.slice = slice;
	    function equal(a, b) {
	        return eq(a, b, [], []);
	    }
	    utils.equal = equal;
	    function triggerMethodOn(obj, eventName, args) {
	        var ev = "on" + eventName;
	        if (obj[ev] && typeof obj[ev] === 'function') {
	            utils.call(obj[ev], obj, args);
	        }
	        if (typeof obj.trigger === 'function') {
	            utils.call(obj.trigger, obj, args);
	        }
	    }
	    utils.triggerMethodOn = triggerMethodOn;
	    function getOption(option, objs) {
	        for (var _i = 0; _i < objs.length; _i++) {
	            var o = objs[_i];
	            if (isObject(o) && has(o, option))
	                return o[option];
	        }
	        return null;
	    }
	    utils.getOption = getOption;
	    function deepFreeze(obj) {
	        if (!isObject(obj))
	            return;
	    }
	    utils.deepFreeze = deepFreeze;
	})(utils = exports.utils || (exports.utils = {}));
	function eq(a, b, aStack, bStack) {
	    // Identical objects are equal. `0 === -0`, but they aren't identical.
	    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
	    if (a === b)
	        return a !== 0 || 1 / a == 1 / b;
	    // A strict comparison is necessary because `null == undefined`.
	    if (a == null || b == null)
	        return a === b;
	    // Unwrap any wrapped objects.
	    //if (a instanceof _) a = a._wrapped;
	    //if (b instanceof _) b = b._wrapped;
	    // Compare `[[Class]]` names.
	    var className = toString.call(a);
	    if (className != toString.call(b))
	        return false;
	    switch (className) {
	        // Strings, numbers, dates, and booleans are compared by value.
	        case '[object String]':
	            // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
	            // equivalent to `new String("5")`.
	            return a == String(b);
	        case '[object Number]':
	            // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
	            // other numeric values.
	            return a !== +a ? b !== +b : (a === 0 ? 1 / a === 1 / b : a === +b);
	        case '[object Date]':
	        case '[object Boolean]':
	            // Coerce dates and booleans to numeric primitive values. Dates are compared by their
	            // millisecond representations. Note that invalid dates with millisecond representations
	            // of `NaN` are not equivalent.
	            return +a == +b;
	        // RegExps are compared by their source patterns and flags.
	        case '[object RegExp]':
	            return a.source == b.source &&
	                a.global == b.global &&
	                a.multiline == b.multiline &&
	                a.ignoreCase == b.ignoreCase;
	    }
	    if (typeof a != 'object' || typeof b != 'object')
	        return false;
	    // Assume equality for cyclic structures. The algorithm for detecting cyclic
	    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
	    var length = aStack.length;
	    while (length--) {
	        // Linear search. Performance is inversely proportional to the number of
	        // unique nested structures.
	        if (aStack[length] == a)
	            return bStack[length] == b;
	    }
	    // Objects with different constructors are not equivalent, but `Object`s
	    // from different frames are.
	    var aCtor = a.constructor, bCtor = b.constructor;
	    if (aCtor !== bCtor && !(typeof aCtor === 'function' && (aCtor instanceof aCtor) &&
	        typeof bCtor === 'function' && (bCtor instanceof bCtor))) {
	        return false;
	    }
	    // Add the first object to the stack of traversed objects.
	    aStack.push(a);
	    bStack.push(b);
	    var size = 0, result = true;
	    // Recursively compare objects and arrays.
	    if (className === '[object Array]') {
	        // Compare array lengths to determine if a deep comparison is necessary.
	        size = a.length;
	        result = size === b.length;
	        if (result) {
	            // Deep compare the contents, ignoring non-numeric properties.
	            while (size--) {
	                if (!(result = eq(a[size], b[size], aStack, bStack)))
	                    break;
	            }
	        }
	    }
	    else {
	        // Deep compare objects.
	        for (var key in a) {
	            if (utils.has(a, key)) {
	                // Count the expected number of properties.
	                size++;
	                // Deep compare each member.
	                if (!(result = utils.has(b, key) && eq(a[key], b[key], aStack, bStack)))
	                    break;
	            }
	        }
	        // Ensure that both objects contain the same number of properties.
	        if (result) {
	            for (key in b) {
	                if (utils.has(b, key) && !(size--))
	                    break;
	            }
	            result = !size;
	        }
	    }
	    // Remove the first object from the stack of traversed objects.
	    aStack.pop();
	    bStack.pop();
	    return result;
	}
	;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    __.prototype = b.prototype;
	    d.prototype = new __();
	};
	var views = __webpack_require__(1);
	var TemplateView = (function (_super) {
	    __extends(TemplateView, _super);
	    /** TemplateView
	     * @param {TemplateViewOptions} options
	     * @extends View
	     */
	    function TemplateView(options) {
	        _super.call(this, options);
	        if (options && options.template) {
	            this.template = options.template;
	        }
	    }
	    TemplateView.prototype.getTemplateData = function () {
	        return {};
	    };
	    TemplateView.prototype.render = function (options) {
	        this.triggerMethod('before:render');
	        this.undelegateEvents();
	        var template;
	        if (typeof this.template == 'function') {
	            template = this.template.call(this, this.getTemplateData());
	        }
	        else if (typeof this.template == 'string') {
	            template = this.template;
	        }
	        if (template) {
	            this.el.innerHTML = template;
	        }
	        this.delegateEvents();
	        this.triggerMethod('render');
	        return this;
	    };
	    return TemplateView;
	})(views.View);
	exports.TemplateView = TemplateView;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/* global BaseClass */
	/* jshint latedef:nofunc */
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    __.prototype = b.prototype;
	    d.prototype = new __();
	};
	var object_1 = __webpack_require__(3);
	var utils_1 = __webpack_require__(5);
	/** Region  */
	var Region = (function (_super) {
	    __extends(Region, _super);
	    /**
	     * Regions manage a view
	     * @param {Object} options
	     * @param {HTMLElement} options.el  A Html element
	     * @constructor Region
	     * @extends BaseObject
	     * @inheritdoc
	     */
	    function Region(options) {
	        _super.call(this);
	        this.options = options;
	        this._el = this.getOption('el');
	    }
	    Object.defineProperty(Region.prototype, "view", {
	        get: function () {
	            return this._view;
	        },
	        set: function (view) {
	            this.show(view);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    /**
	     * Build region from a definition
	     * @param {Object|String|Region} def The description of the region
	     * @return {Region}
	     */
	    Region.buildRegion = function (def) {
	        if (def instanceof Region) {
	            return def;
	        }
	        else if (typeof def === 'string') {
	            return buildBySelector(def, Region);
	        }
	        else {
	            return buildByObject(def);
	        }
	    };
	    /**
	   * Show a view in the region.
	   * This will destroy or remove any existing views.
	   * @param  {View} view    The view to Show
	   * @return {Region}       this for chaining.
	   */
	    Region.prototype.show = function (view, options) {
	        var diff = view !== this._view;
	        if (diff) {
	            // Remove any containing views
	            this.empty();
	            // If the view is destroyed be others
	            view.once('destroy', this.empty, this);
	            view.once('render', function () {
	                utils_1.utils.triggerMethodOn(view, 'show');
	            });
	            view.render();
	            utils_1.utils.triggerMethodOn(view, 'before:show');
	            this._attachHtml(view);
	            this._view = view;
	        }
	        return this;
	    };
	    /**
	     * Destroy the region, this will remove any views, but not the containing element
	     * @return {Region} this for chaining
	     */
	    Region.prototype.destroy = function () {
	        this.empty();
	        _super.prototype.destroy.call(this);
	    };
	    /**
	     * Empty the region. This will destroy any existing view.
	     * @return {Region} this for chaining;
	     */
	    Region.prototype.empty = function () {
	        if (!this._view)
	            return;
	        var view = this._view;
	        view.off('destroy', this.empty, this);
	        this.trigger('before:empty', view);
	        this._destroyView();
	        this.trigger('empty', view);
	        delete this._view;
	        return this;
	    };
	    /**
	     * Attach the view element to the regions element
	     * @param {View} view
	     * @private
	     *
	     */
	    Region.prototype._attachHtml = function (view) {
	        this._el.innerHTML = '';
	        this._el.appendChild(view.el);
	    };
	    Region.prototype._destroyView = function () {
	        var view = this._view;
	        if ((view.destroy && typeof view.destroy === 'function') && !view.isDestroyed) {
	            view.destroy();
	        }
	        else if (view.remove && typeof view.remove === 'function') {
	            view.remove();
	        }
	    };
	    return Region;
	})(object_1.BaseObject);
	exports.Region = Region;
	function buildByObject(object) {
	    if (object === void 0) { object = {}; }
	    if (!object.selector)
	        throw new Error('No selector specified: ' + object);
	    return buildBySelector(object.selector, object.regionClass || Region);
	}
	function buildBySelector(selector, Klass) {
	    if (Klass === void 0) { Klass = Region; }
	    var el = document.querySelector(selector);
	    if (el)
	        throw new Error('selector must exist in the dom');
	    return new Klass({
	        el: el
	    });
	}


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/* global BaseClass, __has */
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    __.prototype = b.prototype;
	    d.prototype = new __();
	};
	var object_1 = __webpack_require__(3);
	var region_1 = __webpack_require__(7);
	var utils_1 = __webpack_require__(5);
	var proxyties = [
	    'addRegions',
	    'addRegion',
	    'removeRegion',
	    'removeRegions',
	];
	var RegionManager = (function (_super) {
	    __extends(RegionManager, _super);
	    /** Region manager
	     * @extends BaseObject
	     */
	    function RegionManager() {
	        _super.call(this);
	        this._regions = {};
	    }
	    Object.defineProperty(RegionManager.prototype, "regions", {
	        /**
	         * Regions
	         * @type {string:Region}
	         */
	        get: function () {
	            return this._regions;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    /**
	      * Add one or more regions to the region manager
	      * @param {Object} regions
	      */
	    RegionManager.prototype.addRegions = function (regions) {
	        var def, out = {}, keys = Object.keys(regions);
	        keys.forEach(function (k) {
	            def = regions[k];
	            out[k] = this.addRegion(k, def);
	        }, this);
	        return out;
	    };
	    /**
	     * Add a region to the RegionManager
	     * @param {String} name   The name of the regions
	     * @param {String|Object|Region|HTMLElement} def The region to associate with the name and the RegionManager
	     */
	    RegionManager.prototype.addRegion = function (name, def) {
	        var region = region_1.Region.buildRegion(def);
	        this._setRegion(name, region);
	        return region;
	    };
	    /**
	     * Remove one or more regions from the manager
	     * @param {...name} name A array of region names
	     */
	    RegionManager.prototype.removeRegion = function (names) {
	        //let names = utils.slice(arguments)
	        names.forEach(function (name) {
	            if (utils_1.utils.has(this.regions, name)) {
	                var region = this.regions[name];
	                region.destroy();
	                this._unsetRegion(name);
	            }
	        }, this);
	    };
	    /**
	     * Destroy the regionmanager
	     */
	    RegionManager.prototype.destroy = function () {
	        this.removeRegions();
	        _super.prototype.destroy.call(this);
	    };
	    /**
	     * Remove all regions from the manager
	     */
	    RegionManager.prototype.removeRegions = function () {
	        this.removeRegion.apply(this, Object.keys(this._regions));
	    };
	    /**
	     * @private
	     */
	    RegionManager.prototype._setRegion = function (name, region) {
	        this._regions[name] = region;
	    };
	    /**
	     * @private
	     */
	    RegionManager.prototype._unsetRegion = function (name) {
	        delete this._regions[name];
	    };
	    return RegionManager;
	})(object_1.BaseObject);
	exports.RegionManager = RegionManager;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    __.prototype = b.prototype;
	    d.prototype = new __();
	};
	/*global View, RegionManager, Region*/
	var templateview_1 = __webpack_require__(6);
	var region_manager_1 = __webpack_require__(8);
	var utils_1 = __webpack_require__(5);
	var region_1 = __webpack_require__(7);
	var LayoutView = (function (_super) {
	    __extends(LayoutView, _super);
	    /**
	     * LayoutView
	     * @param {Object} options options
	     * @constructor LayoutView
	     * @extends TemplateView
	     */
	    function LayoutView(options) {
	        //this.options = options || {};
	        var regions = this.getOption('regions');
	        // Set region manager
	        this._regionManager = new region_manager_1.RegionManager();
	        utils_1.utils.proxy(this, this._regionManager, ['removeRegion', 'removeRegions']);
	        //this.options = options || {};
	        this.listenTo(this, 'render', function () {
	            this.addRegions(regions);
	        });
	        _super.call(this, options);
	    }
	    Object.defineProperty(LayoutView.prototype, "regions", {
	        get: function () {
	            return this._regionManager.regions;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    LayoutView.prototype.addRegion = function (name, def) {
	        if (typeof def === 'string') {
	            var elm = this.$(def);
	            if (!elm)
	                throw new Error('element must exists in dom');
	            def = new region_1.Region({
	                el: elm[0]
	            });
	        }
	        this._regionManager.addRegion(name, def);
	    };
	    LayoutView.prototype.addRegions = function (regions) {
	        for (var k in regions) {
	            this.addRegion(k, regions[k]);
	        }
	    };
	    LayoutView.prototype.destroy = function () {
	        _super.prototype.destroy.call(this);
	        this._regionManager.destroy();
	    };
	    return LayoutView;
	})(templateview_1.TemplateView);


/***/ }
/******/ ])
});
;