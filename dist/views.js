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
	__export(__webpack_require__(2));
	__export(__webpack_require__(6));
	__export(__webpack_require__(5));
	__export(__webpack_require__(1));
	__export(__webpack_require__(4));
	__export(__webpack_require__(3));


/***/ },
/* 1 */
/***/ function(module, exports) {

	var idCounter = 0;
	function getID() {
	    return "" + (++idCounter);
	}
	var EventEmitter = (function () {
	    function EventEmitter() {
	        this._events = {};
	        this._listeningTo = {};
	    }
	    EventEmitter.prototype.on = function (event, fn, ctx, once) {
	        if (once === void 0) { once = false; }
	        var events = this._events[event] || (this._events[event] = []);
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
	            this._events = {};
	        }
	        else if (this._events[eventName]) {
	            var events = this._events[eventName];
	            if (fn == null) {
	                this._events[eventName] = [];
	            }
	            else {
	                for (var i = 0; i < events.length; i++) {
	                    var event_1 = events[i];
	                    if (events[i].handler == fn) {
	                        this._events[eventName].splice(i, 1);
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
	        var events = (this._events[eventName] || []).concat(this._events["all"] || []);
	        for (var i = 0; i < events.length; i++) {
	            var event_2 = events[i];
	            event_2.handler.apply(event_2.ctx, args);
	            if (event_2.once === true) {
	                var index = this._events[event_2.name].indexOf(event_2);
	                this._events[event_2.name].splice(index, 1);
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
	        var listeningTo = this._listeningTo;
	        var remove = !event && !callback;
	        //if (obj) (listeningTo = {})[obj.listenId] = obj;
	        for (var id in listeningTo) {
	            obj = listeningTo[id];
	            obj.off(event, callback, this);
	        }
	        return this;
	    };
	    return EventEmitter;
	})();
	exports.EventEmitter = EventEmitter;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    __.prototype = b.prototype;
	    d.prototype = new __();
	};
	var base = __webpack_require__(3);
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
	var View = (function (_super) {
	    __extends(View, _super);
	    function View() {
	        _super.apply(this, arguments);
	        this.ui = {};
	    }
	    View.prototype.delegateEvents = function (events) {
	        this.bindUIElements();
	        events = events || this.events;
	        events = normalizeUIKeys.call(this, events);
	        _super.prototype.delegateEvents.call(this, events);
	        return this;
	    };
	    /*constructor (options?: ViewOptions) {
	      super(options)
	    }*/
	    View.prototype.undelegateEvents = function () {
	        this.unbindUIElements();
	        _super.prototype.undelegateEvents.call(this);
	        return this;
	    };
	    /* UI Elements */
	    View.prototype.bindUIElements = function () {
	        var _this = this;
	        var ui = this.options.ui || this.ui;
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
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    __.prototype = b.prototype;
	    d.prototype = new __();
	};
	var object_1 = __webpack_require__(4);
	var utils_1 = __webpack_require__(5);
	var paddedLt = /^\s*</;
	var unbubblebles = 'focus blur change'.split(' ');
	var viewOptions = ['el', 'id', 'attributes', 'className', 'tagName', 'events'];
	var BaseView = (function (_super) {
	    __extends(BaseView, _super);
	    function BaseView(options) {
	        if (options === void 0) { options = {}; }
	        _super.call(this);
	        this._cid = utils_1.utils.uniqueId('view');
	        this.options = options;
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
	    Object.defineProperty(BaseView.prototype, "cid", {
	        get: function () {
	            return this._cid;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    BaseView.prototype.initialize = function () {
	    };
	    // Event Delegation
	    BaseView.prototype.delegateEvents = function (events) {
	        var _this = this;
	        if (!(events || (events = utils_1.utils.result(this, 'events'))))
	            return this;
	        this.undelegateEvents();
	        var dels = [];
	        for (var key in events) {
	            var method = events[key];
	            if (typeof method !== 'function')
	                method = this[events[key]];
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
	            if (ret.length) {
	                ret[0].appendChild(elm);
	            }
	        }
	        else {
	            this.el.appendChild(elm);
	        }
	        return this;
	    };
	    BaseView.prototype.$ = function (selector) {
	        return this.el.querySelectorAll(selector);
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
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    __.prototype = b.prototype;
	    d.prototype = new __();
	};
	var events_1 = __webpack_require__(1);
	var utils_1 = __webpack_require__(5);
	var BaseObject = (function (_super) {
	    __extends(BaseObject, _super);
	    function BaseObject() {
	        _super.apply(this, arguments);
	        this._isDestroyed = false;
	    }
	    Object.defineProperty(BaseObject.prototype, "isDestroyed", {
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
	        this._isDestroyed = false;
	        this.triggerMethod('destroy');
	        return this;
	    };
	    BaseObject.prototype.triggerMethod = function (eventName) {
	        var args = [];
	        for (var _i = 1; _i < arguments.length; _i++) {
	            args[_i - 1] = arguments[_i];
	        }
	        var ev = "on" + eventName;
	        utils_1.utils;
	        if (this[ev]) {
	            utils_1.utils.call(this[ev], this, args);
	        }
	        utils_1.utils.call(this.trigger, this, args);
	        return this;
	    };
	    BaseObject.prototype.getOption = function (prop) {
	        var args = [];
	        for (var _i = 1; _i < arguments.length; _i++) {
	            args[_i - 1] = arguments[_i];
	        }
	        var self = this;
	        for (var _a = 0; _a < args.length; _a++) {
	            var o = args[_a];
	            if (utils_1.utils.has(o, prop))
	                return o[prop];
	        }
	        var options = self.options;
	        if (options && utils_1.utils.isObject(options) && utils_1.utils.has(options, prop)) {
	            return options[prop];
	        }
	        return self[prop];
	    };
	    BaseObject.extend = utils_1.extend;
	    return BaseObject;
	})(events_1.EventEmitter);
	exports.BaseObject = BaseObject;


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
	var utils;
	(function (utils) {
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
	    function uniqueId(prefix) {
	        if (prefix === void 0) { prefix = ''; }
	        return prefix + (++idCounter);
	    }
	    utils.uniqueId = uniqueId;
	})(utils = exports.utils || (exports.utils = {}));


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    __.prototype = b.prototype;
	    d.prototype = new __();
	};
	var views = __webpack_require__(2);
	var TemplateView = (function (_super) {
	    __extends(TemplateView, _super);
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
	        //super.render(options)
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
	        return this;
	    };
	    return TemplateView;
	})(views.View);
	exports.TemplateView = TemplateView;


/***/ }
/******/ ])
});
;