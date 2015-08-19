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
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
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
	__export(__webpack_require__(6));
	__export(__webpack_require__(8));
	__export(__webpack_require__(4));
	__export(__webpack_require__(3));
	__export(__webpack_require__(2));
	__export(__webpack_require__(7));
	__export(__webpack_require__(5));
	__export(__webpack_require__(1));
	__export(__webpack_require__(9));
	__export(__webpack_require__(10));
	__export(__webpack_require__(11));
	__export(__webpack_require__(12));
	__export(__webpack_require__(13));
	__export(__webpack_require__(14));


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* global BaseClass, __has */
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    __.prototype = b.prototype;
	    d.prototype = new __();
	};
	var object_1 = __webpack_require__(2);
	var region_1 = __webpack_require__(5);
	var utils_1 = __webpack_require__(4);
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
	        if (typeof names === 'string') {
	            names = [names];
	        }
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
	        utils_1.utils.call(this.removeRegion, this, Object.keys(this._regions));
	    };
	    /**
	     * @private
	     */
	    RegionManager.prototype._setRegion = function (name, region) {
	        if (this._regions[name]) {
	            this._regions[name].destroy();
	        }
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
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    __.prototype = b.prototype;
	    d.prototype = new __();
	};
	var events_1 = __webpack_require__(3);
	var utils_1 = __webpack_require__(4);
	/** Base object */
	var BaseObject = (function (_super) {
	    __extends(BaseObject, _super);
	    /**
	     * Object
	     * @extends EventEmitter
	     */
	    function BaseObject(args) {
	        _super.call(this);
	        this._isDestroyed = false;
	        if (typeof this.initialize === 'function') {
	            utils_1.utils.call(this.initialize, this, utils_1.utils.slice(arguments));
	        }
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
	        if (this._options) {
	            args.push(this._options);
	        }
	        args.push(this);
	        return utils_1.utils.getOption(prop, args);
	    };
	    BaseObject.extend = utils_1.extend;
	    return BaseObject;
	})(events_1.EventEmitter);
	exports.BaseObject = BaseObject;


/***/ },
/* 3 */
/***/ function(module, exports) {

	var idCounter = 0;
	function getID() {
	    return "" + (++idCounter);
	}
	var EventEmitter = (function () {
	    function EventEmitter() {
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
	        var events = (this._listeners || (this._listeners = {}))[event] || (this._listeners[event] = []);
	        //let events = this._listeners[event]||(this._listeners[event]=[])
	        events.push({
	            name: event,
	            once: once,
	            handler: fn,
	            ctx: ctx || this
	        });
	        return this;
	    };
	    EventEmitter.prototype.once = function (event, fn, ctx) {
	        return this.on(event, fn, ctx, true);
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
	        var events = (this._listeners || (this._listeners = {}))[eventName] || (this._listeners[eventName] = []);
	        events = events.concat(this._listeners['all'] || []);
	        if (EventEmitter.debugCallback)
	            EventEmitter.debugCallback(this.constructor.name, this.name, eventName, args);
	        var event, a, len = events.length, index, i;
	        for (i = 0; i < events.length; i++) {
	            event = events[i];
	            a = args;
	            if (event.name == 'all') {
	                a = [eventName].concat(args);
	            }
	            event.handler.apply(event.ctx, a);
	            if (event.once === true) {
	                index = this._listeners[event.name].indexOf(event);
	                this._listeners[event.name].splice(index, 1);
	            }
	        }
	        return this;
	    };
	    EventEmitter.prototype.listenTo = function (obj, event, fn, ctx, once) {
	        if (once === void 0) { once = false; }
	        var listeningTo, id, meth;
	        listeningTo = this._listeningTo || (this._listeningTo = {});
	        id = obj.listenId || (obj.listenId = getID());
	        listeningTo[id] = obj;
	        meth = once ? 'once' : 'on';
	        obj[meth](event, fn, this);
	        return this;
	    };
	    EventEmitter.prototype.listenToOnce = function (obj, event, fn, ctx) {
	        return this.listenTo(obj, event, fn, ctx, true);
	    };
	    EventEmitter.prototype.stopListening = function (obj, event, callback) {
	        var listeningTo = this._listeningTo;
	        if (!listeningTo)
	            return this;
	        var remove = !event && !callback;
	        if (!callback && typeof event === 'object')
	            callback = this;
	        if (obj)
	            (listeningTo = {})[obj.listenId] = obj;
	        for (var id in listeningTo) {
	            obj = listeningTo[id];
	            obj.off(event, callback, this);
	            if (remove || !Object.keys(obj.listeners).length) {
	                delete this._listeningTo[id];
	            }
	        }
	        return this;
	    };
	    return EventEmitter;
	})();
	exports.EventEmitter = EventEmitter;


/***/ },
/* 4 */
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
	        if (elm.classList)
	            elm.classList.add(className);
	        else {
	            elm.className = elm.className.split(' ').concat(className.split(' ')).join(' ');
	        }
	    }
	    html.addClass = addClass;
	    function removeClass(elm, className) {
	        if (elm.classList)
	            elm.classList.remove(className);
	        else {
	            elm.className = elm.className.split(' ').concat(className.split(' ')).join(' ');
	        }
	    }
	    html.removeClass = removeClass;
	})(html = exports.html || (exports.html = {}));
	var nativeBind = Function.prototype.bind;
	var noop = function () { };
	var idCounter = 0;
	/** @module utils */
	var utils;
	(function (utils) {
	    function camelcase(input) {
	        return input.toLowerCase().replace(/-(.)/g, function (match, group1) {
	            return group1.toUpperCase();
	        });
	    }
	    utils.camelcase = camelcase;
	    ;
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
	        if (args === void 0) { args = []; }
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
	        var ev = camelcase("on-" + eventName.replace(':', '-'));
	        if (obj[ev] && typeof obj[ev] === 'function') {
	            utils.call(obj[ev], obj, args);
	        }
	        if (typeof obj.trigger === 'function') {
	            args = [eventName].concat(args);
	            utils.call(obj.trigger, obj, args);
	        }
	    }
	    utils.triggerMethodOn = triggerMethodOn;
	    function getOption(option, objs) {
	        for (var _i = 0; _i < objs.length; _i++) {
	            var o = objs[_i];
	            if (isObject(o) && o[option])
	                return o[option];
	        }
	        return null;
	    }
	    utils.getOption = getOption;
	    function sortBy(obj, value, context) {
	        var iterator = typeof value === 'function' ? value : function (obj) { return obj[value]; };
	        return obj
	            .map(function (value, index, list) {
	            return {
	                value: value,
	                index: index,
	                criteria: iterator.call(context, value, index, list)
	            };
	        })
	            .sort(function (left, right) {
	            var a = left.criteria;
	            var b = right.criteria;
	            if (a !== b) {
	                if (a > b || a === void 0)
	                    return 1;
	                if (a < b || b === void 0)
	                    return -1;
	            }
	            return left.index - right.index;
	        })
	            .map(function (item) {
	            return item.value;
	        });
	    }
	    utils.sortBy = sortBy;
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
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/* global BaseClass */
	/* jshint latedef:nofunc */
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    __.prototype = b.prototype;
	    d.prototype = new __();
	};
	var object_1 = __webpack_require__(2);
	var utils_1 = __webpack_require__(4);
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
	        this.options = options;
	        this._el = this.getOption('el');
	        _super.call(this);
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
	    Object.defineProperty(Region.prototype, "el", {
	        get: function () {
	            return this._el;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    /**
	     * Build region from a definition
	     * @param {Object|String|Region} def The description of the region
	     * @return {Region}
	     */
	    Region.buildRegion = function (def, context) {
	        if (context === void 0) { context = null; }
	        if (def instanceof Region) {
	            return def;
	        }
	        else if (typeof def === 'string') {
	            return buildBySelector(def, Region, context);
	        }
	        else {
	            return buildByObject(def, context);
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
	        this._el.innerHTML = '';
	    };
	    return Region;
	})(object_1.BaseObject);
	exports.Region = Region;
	function buildByObject(object, context) {
	    if (object === void 0) { object = {}; }
	    if (!object.selector)
	        throw new Error('No selector specified: ' + object);
	    return buildBySelector(object.selector, object.regionClass || Region, context);
	}
	function buildBySelector(selector, Klass, context) {
	    if (Klass === void 0) { Klass = Region; }
	    context = context || document;
	    var el = context.querySelector(selector);
	    if (!el)
	        throw new Error('selector must exist in the dom');
	    return new Klass({
	        el: el
	    });
	}


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    __.prototype = b.prototype;
	    d.prototype = new __();
	};
	var base = __webpack_require__(7);
	var utils_1 = __webpack_require__(4);
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
	        this._bindUIElements();
	        events = events || this.events;
	        events = normalizeUIKeys(events, this._ui);
	        var triggers = this._configureTriggers();
	        events = utils_1.utils.extend({}, events, triggers);
	        _super.prototype.delegateEvents.call(this, events);
	        return this;
	    };
	    View.prototype.undelegateEvents = function () {
	        this._unbindUIElements();
	        _super.prototype.undelegateEvents.call(this);
	        return this;
	    };
	    /**
	     * Bind ui elements
	     * @private
	     */
	    View.prototype._bindUIElements = function () {
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
	    /**
	     * Unbind ui elements
	     * @private
	     */
	    View.prototype._unbindUIElements = function () {
	    };
	    /**
	     * Configure triggers
	     * @return {Object} events object
	     * @private
	     */
	    View.prototype._configureTriggers = function () {
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


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    __.prototype = b.prototype;
	    d.prototype = new __();
	};
	var object_1 = __webpack_require__(2);
	var utils_1 = __webpack_require__(4);
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
	        this._cid = utils_1.utils.uniqueId('view');
	        utils_1.utils.extend(this, utils_1.utils.pick(options, viewOptions));
	        this._domEvents = [];
	        if (this.el == null) {
	            this._ensureElement();
	        }
	        else {
	        }
	        _super.call(this, options);
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
	        var useCap = !!~unbubblebles.indexOf(eventName) && selector != null;
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
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    __.prototype = b.prototype;
	    d.prototype = new __();
	};
	var views = __webpack_require__(6);
	var TemplateView = (function (_super) {
	    __extends(TemplateView, _super);
	    /** TemplateView
	     * @param {TemplateViewOptions} options
	     * @extends View
	     */
	    function TemplateView(options) {
	        if (options && options.template) {
	            this.template = options.template;
	        }
	        _super.call(this, options);
	    }
	    TemplateView.prototype.getTemplateData = function () {
	        return {};
	    };
	    TemplateView.prototype.render = function (options) {
	        if (options === void 0) { options = {}; }
	        if (!options.silent)
	            this.triggerMethod('before:render');
	        this.renderTemplate(this.getTemplateData());
	        if (!options.silent)
	            this.triggerMethod('render');
	        return this;
	    };
	    TemplateView.prototype.renderTemplate = function (data) {
	        var template = this.getOption('template');
	        if (typeof template === 'function') {
	            template = template.call(this, data);
	        }
	        if (template && typeof template === 'string') {
	            this.attachTemplate(template);
	        }
	    };
	    TemplateView.prototype.attachTemplate = function (template) {
	        this.undelegateEvents();
	        this.el.innerHTML = template;
	        this.delegateEvents();
	    };
	    return TemplateView;
	})(views.View);
	exports.TemplateView = TemplateView;


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
	var templateview_1 = __webpack_require__(8);
	var region_manager_1 = __webpack_require__(1);
	var utils_1 = __webpack_require__(4);
	var region_1 = __webpack_require__(5);
	var LayoutView = (function (_super) {
	    __extends(LayoutView, _super);
	    /**
	     * LayoutView
	     * @param {Object} options options
	     * @constructor LayoutView
	     * @extends TemplateView
	     */
	    function LayoutView(options) {
	        // Set region manager
	        this._regionManager = new region_manager_1.RegionManager();
	        utils_1.utils.proxy(this, this._regionManager, ['removeRegion', 'removeRegions']);
	        this._regions = this.getOption('regions', options || {});
	        _super.call(this, options);
	    }
	    Object.defineProperty(LayoutView.prototype, "regions", {
	        get: function () {
	            return this._regionManager.regions;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    LayoutView.prototype.render = function (options) {
	        this.triggerMethod('before:render');
	        _super.prototype.render.call(this, { silent: true });
	        this.addRegion(this._regions || {});
	        this.triggerMethod('render');
	        return this;
	    };
	    /**
	     * Add one or more regions to the view
	     * @param {string|RegionMap} name
	     * @param {Object|string|HTMLElement} def
	     */
	    LayoutView.prototype.addRegion = function (name, def) {
	        var regions = {};
	        if (typeof name === 'string') {
	            if (def == null)
	                throw new Error('add region');
	            regions[name] = def;
	        }
	        else {
	            regions = name;
	        }
	        for (var k in regions) {
	            var region = region_1.Region.buildRegion(regions[k], this.el);
	            this._regionManager.addRegion(k, region);
	        }
	    };
	    /**
	     * Delete one or more regions from the the layoutview
	     * @param {string|Array<string>} name
	     */
	    LayoutView.prototype.removeRegion = function (name) {
	        this._regionManager.removeRegion(name);
	    };
	    LayoutView.prototype.destroy = function () {
	        _super.prototype.destroy.call(this);
	        this._regionManager.destroy();
	    };
	    return LayoutView;
	})(templateview_1.TemplateView);
	exports.LayoutView = LayoutView;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    __.prototype = b.prototype;
	    d.prototype = new __();
	};
	var templateview_1 = __webpack_require__(8);
	var utils_1 = __webpack_require__(4);
	var DataView = (function (_super) {
	    __extends(DataView, _super);
	    /**
	     * DataView
	     * @param {DataViewOptions} options
	     * @extends TemplateView
	     */
	    function DataView(options) {
	        if (options === void 0) { options = {}; }
	        if (options.model) {
	            this.model = options.model;
	        }
	        if (options.collection) {
	            this.collection = options.collection;
	        }
	        _super.call(this, options);
	    }
	    Object.defineProperty(DataView.prototype, "model", {
	        get: function () { return this._model; },
	        set: function (model) {
	            this.setModel(model);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(DataView.prototype, "collection", {
	        get: function () { return this._collection; },
	        set: function (collection) {
	            this.setCollection(collection);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    DataView.prototype.setModel = function (model) {
	        if (this._model === model)
	            return;
	        this.triggerMethod('before:model', this._model, model);
	        if (this._model) {
	            this.stopListening(this._model);
	        }
	        this._model = model;
	        this.triggerMethod('model', model);
	    };
	    DataView.prototype.setCollection = function (collection) {
	        if (this._collection === collection)
	            return;
	        this.triggerMethod('before:collection', this._collection, collection);
	        if (this._collection) {
	            this.stopListening(this._collection);
	        }
	        this._collection = collection;
	        this.triggerMethod('collection', collection);
	    };
	    DataView.prototype.getTemplateData = function () {
	        return this.model ?
	            typeof this.model.toJSON === 'function' ?
	                this.model.toJSON() : this.model : {};
	    };
	    DataView.prototype.delegateEvents = function (events) {
	        events = events || this.events;
	        //events = normalizeUIKeys(events)
	        var _a = this._filterEvents(events), c = _a.c, e = _a.e, m = _a.m;
	        _super.prototype.delegateEvents.call(this, e);
	        this._delegateDataEvents(m, c);
	        return this;
	    };
	    DataView.prototype.undelegateEvents = function () {
	        this._undelegateDataEvents();
	        _super.prototype.undelegateEvents.call(this);
	        return this;
	    };
	    DataView.prototype._delegateDataEvents = function (model, collection) {
	        var _this = this;
	        this._dataEvents = {};
	        var fn = function (item, ev) {
	            if (!_this[item])
	                return {};
	            var out = {}, k, f;
	            for (k in ev) {
	                f = utils_1.utils.bind(ev[k], _this);
	                _this[item].on(k, f);
	                out[item + ":" + k] = f;
	            }
	            return out;
	        };
	        utils_1.utils.extend(this._dataEvents, fn('model', model), fn('collection', collection));
	    };
	    DataView.prototype._undelegateDataEvents = function () {
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
	    DataView.prototype._filterEvents = function (obj) {
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
	    return DataView;
	})(templateview_1.TemplateView);
	exports.DataView = DataView;


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    __.prototype = b.prototype;
	    d.prototype = new __();
	};
	var data_view_1 = __webpack_require__(10);
	var utils_1 = __webpack_require__(4);
	var events_1 = __webpack_require__(3);
	var Buffer = (function () {
	    function Buffer() {
	        this.children = [];
	        this.buffer = document.createDocumentFragment();
	    }
	    Buffer.prototype.append = function (view) {
	        this.children.push(view);
	        this.buffer.appendChild(view.el);
	    };
	    return Buffer;
	})();
	var CollectionView = (function (_super) {
	    __extends(CollectionView, _super);
	    /** CollectionView
	   * @extends DataView
	   * @param {DataViewOptions} options
	   */
	    function CollectionView(options) {
	        //this._options = options||{}
	        this.children = [];
	        this.sort = (options && options.sort != null) ? options.sort : true;
	        _super.call(this, options);
	    }
	    /**
	   * Render the collection view and alle of the children
	   * @return {CollectionView}
	   *
	   */
	    CollectionView.prototype.render = function (options) {
	        this.destroyChildren();
	        this._destroyContainer();
	        _super.prototype.render.call(this, options);
	        this._initContainer();
	        if (this.collection && this.collection.length) {
	            this.renderCollection();
	        }
	        return this;
	    };
	    /**
	     * @protected
	     */
	    CollectionView.prototype.setCollection = function (collection) {
	        _super.prototype.setCollection.call(this, collection);
	        this._delegateCollectionEvents();
	    };
	    CollectionView.prototype.renderCollection = function () {
	        this.destroyChildren();
	        if (this.collection.length != 0) {
	            this.hideEmptyView();
	            this._startBuffering();
	            this._renderCollection();
	            this._stopBuffering();
	        }
	        else {
	            this.showEmptyView();
	        }
	    };
	    /**
	   * Returns a new instance of this.childView with attached model.
	   *
	   * @param {IModel} model
	   * @protected
	   */
	    CollectionView.prototype.getChildView = function (model) {
	        var View = this.getOption('childView') || data_view_1.DataView, options = this.getOption('childViewOptions') || {};
	        return new View(utils_1.utils.extend({
	            model: model
	        }, options));
	    };
	    CollectionView.prototype.renderChildView = function (view, index) {
	        this.triggerMethod('before:render:child', view);
	        view.render();
	        this._attachHTML(view, index);
	        this.triggerMethod('render:child', view);
	    };
	    CollectionView.prototype.showEmptyView = function () {
	    };
	    CollectionView.prototype.hideEmptyView = function () {
	    };
	    CollectionView.prototype.destroyChildren = function () {
	        if (this._container) {
	            this._container.innerHTML = '';
	        }
	        if (this.children.length === 0)
	            return;
	        this.children.forEach(this.removeChildView, this);
	        this.children = [];
	    };
	    CollectionView.prototype.removeChildView = function (view) {
	        if (!view)
	            return;
	        if (typeof view.destroy === 'function') {
	            view.destroy();
	        }
	        if (typeof view.remove === 'function') {
	            view.remove();
	        }
	        this.stopListening(view);
	        //this.children.delete(view);
	        this.children.splice(this.children.indexOf(view), 1);
	        if (this.children.length === 0) {
	            this.showEmptyView();
	        }
	        this._updateIndexes(view, false);
	    };
	    /**
	   * Destroy the collection view and all of it's children
	   * @see JaffaMVC.View
	   * @return {JaffaMVC.View}
	   */
	    CollectionView.prototype.destroy = function () {
	        this.triggerMethod('before:destroy:children');
	        this.destroyChildren();
	        this.triggerMethod('destroy:children');
	        this.hideEmptyView();
	        //if (this._emptyView) this.hideEmptyView();
	        return _super.prototype.destroy.call(this);
	    };
	    CollectionView.prototype._renderCollection = function () {
	        var _this = this;
	        this.triggerMethod('before:render:collection');
	        this.collection.forEach(function (model, index) {
	            var view = _this.getChildView(model);
	            _this._appendChild(view, index);
	        });
	        this.triggerMethod('render:collection');
	    };
	    /**
	   * Append childview to the container
	   * @private
	   * @param {IDataView} view
	   * @param {Number} index
	   */
	    CollectionView.prototype._appendChild = function (view, index) {
	        this._updateIndexes(view, true, index);
	        this._proxyChildViewEvents(view);
	        this.children.push(view);
	        this.hideEmptyView();
	        this.renderChildView(view, index);
	        this.triggerMethod('add:child', view);
	    };
	    /**
	   * Attach the childview's element to the CollectionView.
	   * When in buffer mode, the view is added to a documentfragment to optimize performance
	   * @param {View} view  A view
	   * @param {Number} index The index in which to insert the view
	   * @private
	   */
	    CollectionView.prototype._attachHTML = function (view, index) {
	        if (this._buffer) {
	            this._buffer.append(view);
	        }
	        else {
	            //if (this._isShown) {
	            //  utils.triggerMethodOn(view, 'before:show');
	            //}
	            if (!this._insertBefore(view, index)) {
	                this._insertAfter(view);
	            }
	        }
	    };
	    /**
	   * Proxy event froms childview to the collectionview
	   * @param {IView} view
	   * @private
	   */
	    CollectionView.prototype._proxyChildViewEvents = function (view) {
	        var prefix = this.getOption('prefix') || 'childview';
	        this.listenTo(view, 'all', function () {
	            var args = utils_1.utils.slice(arguments);
	            args[0] = prefix + ':' + args[0];
	            args.splice(1, 0, view);
	            utils_1.utils.call(this.triggerMethod, this, args);
	        });
	    };
	    CollectionView.prototype._updateIndexes = function (view, increment, index) {
	        if (!this.sort)
	            return;
	        if (increment)
	            view._index = index;
	        this.children.forEach(function (lView) {
	            if (lView._index >= view._index) {
	                increment ? lView._index++ : lView._index--;
	            }
	        });
	    };
	    CollectionView.prototype._startBuffering = function () {
	        this._buffer = new Buffer();
	    };
	    CollectionView.prototype._stopBuffering = function () {
	        this._container.appendChild(this._buffer.buffer);
	        delete this._buffer;
	    };
	    CollectionView.prototype._initContainer = function () {
	        var container = this.getOption('childViewContainer');
	        if (container) {
	            container = this.$(container)[0];
	        }
	        else {
	            container = this.el;
	        }
	        this._container = container;
	    };
	    CollectionView.prototype._destroyContainer = function () {
	        if (this._container)
	            delete this._container;
	    };
	    /**
	     * Internal method. Check whether we need to insert the view into
	   * the correct position.
	     * @param  {IView} childView [description]
	     * @param  {number} index     [description]
	     * @return {boolean}           [description]
	     */
	    CollectionView.prototype._insertBefore = function (childView, index) {
	        var currentView;
	        var findPosition = this.sort && (index < this.children.length - 1);
	        if (findPosition) {
	            // Find the view after this one
	            currentView = utils_1.utils.find(this.children, function (view) {
	                return view._index === index + 1;
	            });
	        }
	        if (currentView) {
	            this._container.insertBefore(childView.el, currentView.el);
	            return true;
	        }
	        return false;
	    };
	    /**
	     * Internal method. Append a view to the end of the $el
	     * @private
	     */
	    CollectionView.prototype._insertAfter = function (childView) {
	        this._container.appendChild(childView.el);
	    };
	    /**
	     * Delegate collection events
	     * @private
	     */
	    CollectionView.prototype._delegateCollectionEvents = function () {
	        if (this.collection && this.collection instanceof events_1.EventEmitter) {
	            this.listenTo(this.collection, 'add', this._onCollectionAdd);
	            this.listenTo(this.collection, 'remove', this._onCollectionRemove);
	            this.listenTo(this.collection, 'reset', this.render);
	            if (this.sort)
	                this.listenTo(this.collection, 'sort', this._onCollectionSort);
	        }
	    };
	    // Event handlers
	    /**
	     * Called when a model is add to the collection
	     * @param {JaffaMVC.Model|Backbone.model} model Model
	     * @private
	     */
	    CollectionView.prototype._onCollectionAdd = function (model) {
	        var view = this.getChildView(model);
	        var index = this.collection.indexOf(model);
	        this._appendChild(view, index);
	    };
	    /**
	     * Called when a model is removed from the collection
	     * @param {JaffaMVC.Model|Backbone.model} model Model
	     * @private
	     */
	    CollectionView.prototype._onCollectionRemove = function (model) {
	        var view = utils_1.utils.find(this.children, function (view) {
	            return view.model === model;
	        });
	        this.removeChildView(view);
	    };
	    /**
	     * Called when the collection is sorted
	     * @private
	     */
	    CollectionView.prototype._onCollectionSort = function () {
	        var _this = this;
	        var orderChanged = this.collection.find(function (model, index) {
	            var view = utils_1.utils.find(_this.children, function (view) {
	                return view.model === model;
	            });
	            return !view || view._index !== index;
	        });
	        if (orderChanged)
	            this.render();
	    };
	    return CollectionView;
	})(data_view_1.DataView);
	exports.CollectionView = CollectionView;


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    __.prototype = b.prototype;
	    d.prototype = new __();
	};
	var utils_1 = __webpack_require__(4);
	var object_1 = __webpack_require__(2);
	var Model = (function (_super) {
	    __extends(Model, _super);
	    function Model(attributes, options) {
	        if (attributes === void 0) { attributes = {}; }
	        options = options || {};
	        this._attributes = attributes;
	        this.uid = utils_1.utils.uniqueId('uid');
	        this._changed = {};
	        this.collection = options.collection;
	        _super.call(this);
	    }
	    Object.defineProperty(Model.prototype, "id", {
	        get: function () {
	            if (this.idAttribute in this._attributes)
	                return this._attributes[this.idAttribute];
	            return this.uid;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Model.prototype.set = function (key, val, options) {
	        if (options === void 0) { options = {}; }
	        var attr, attrs = {}, unset, changes, silent, changing, prev, current;
	        if (key == null)
	            return this;
	        // Handle both `"key", value` and `{key: value}` -style arguments.
	        if (typeof key === 'object') {
	            attrs = key;
	            options = val;
	        }
	        else {
	            attrs[key] = val;
	        }
	        options || (options = {});
	        // Run validation.
	        //if (!this._validate(attrs, options)) return false;
	        // Extract attributes and options.
	        unset = options.unset;
	        silent = options.silent;
	        changes = [];
	        changing = this._changing;
	        this._changing = true;
	        if (!changing) {
	            this._previousAttributes = utils_1.utils.extend(Object.create(null), this._attributes);
	            this._changed = {};
	        }
	        current = this._attributes, prev = this._previousAttributes;
	        // For each `set` attribute, update or delete the current value.
	        for (attr in attrs) {
	            val = attrs[attr];
	            if (!utils_1.utils.equal(current[attr], val))
	                changes.push(attr);
	            if (!utils_1.utils.equal(prev[attr], val)) {
	                this._changed[attr] = val;
	            }
	            else {
	                delete this._changed[attr];
	            }
	            unset ? delete current[attr] : current[attr] = val;
	        }
	        // Trigger all relevant attribute changes.
	        if (!silent) {
	            if (changes.length)
	                this._pending = !!options;
	            for (var i = 0, l = changes.length; i < l; i++) {
	                this.trigger('change:' + changes[i], this, current[changes[i]], options);
	            }
	        }
	        // You might be wondering why there's a `while` loop here. Changes can
	        // be recursively nested within `"change"` events.
	        if (changing)
	            return this;
	        if (!silent) {
	            while (this._pending) {
	                options = this._pending;
	                this._pending = false;
	                this.trigger('change', this, options);
	            }
	        }
	        this._pending = false;
	        this._changing = false;
	        return this;
	    };
	    Model.prototype.get = function (key) {
	        return this._attributes[key];
	    };
	    Model.prototype.unset = function (key, options) {
	        this.set(key, void 0, utils_1.utils.extend({}, options, { unset: true }));
	    };
	    Model.prototype.has = function (attr) {
	        return this.get(attr) != null;
	    };
	    Model.prototype.hasChanged = function (attr) {
	        if (attr == null)
	            return !!Object.keys(this.changed).length;
	        return utils_1.utils.has(this.changed, attr);
	    };
	    Model.prototype.clear = function (options) {
	        var attrs = {};
	        for (var key in this._attributes)
	            attrs[key] = void 0;
	        return this.set(attrs, utils_1.utils.extend({}, options, { unset: true }));
	    };
	    Object.defineProperty(Model.prototype, "changed", {
	        get: function () {
	            return utils_1.utils.extend({}, this._changed);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    // Return an object containing all the attributes that have changed, or
	    // false if there are no changed attributes. Useful for determining what
	    // parts of a view need to be updated and/or what attributes need to be
	    // persisted to the server. Unset attributes will be set to undefined.
	    // You can also pass an attributes object to diff against the model,
	    // determining if there *would be* a change.
	    Model.prototype.changedAttributes = function (diff) {
	        if (!diff)
	            return this.hasChanged() ? utils_1.utils.extend(Object.create(null), this.changed) : false;
	        var val, changed = {};
	        var old = this._changing ? this._previousAttributes : this._attributes;
	        for (var attr in diff) {
	            if (utils_1.utils.equal(old[attr], (val = diff[attr])))
	                continue;
	            (changed || (changed = {}))[attr] = val;
	        }
	        return changed;
	    };
	    // Get the previous value of an attribute, recorded at the time the last
	    // `"change"` event was fired.
	    Model.prototype.previous = function (attr) {
	        if (attr == null || !this._previousAttributes)
	            return null;
	        return this._previousAttributes[attr];
	    };
	    // Get all of the attributes of the model at the time of the previous
	    // `"change"` event.
	    Model.prototype.previousAttributes = function () {
	        return utils_1.utils.extend(Object.create(null), this._previousAttributes);
	    };
	    Model.prototype.toJSON = function () {
	        return JSON.parse(JSON.stringify(this._attributes));
	    };
	    Model.prototype.clone = function () {
	        return new (this.constructor)(this._attributes);
	    };
	    return Model;
	})(object_1.BaseObject);
	exports.Model = Model;


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    __.prototype = b.prototype;
	    d.prototype = new __();
	};
	var object_1 = __webpack_require__(2);
	var utils_1 = __webpack_require__(4);
	var model_1 = __webpack_require__(12);
	var setOptions = { add: true, remove: true, merge: true };
	var addOptions = { add: true, remove: false };
	var Collection = (function (_super) {
	    __extends(Collection, _super);
	    function Collection(models, options) {
	        if (options === void 0) { options = {}; }
	        this.options = options;
	        if (this.options.model) {
	            this.Model = this.options.model;
	        }
	        //this._byId = {};
	        if (models) {
	            this.add(models);
	        }
	        _super.call(this);
	    }
	    Object.defineProperty(Collection.prototype, "length", {
	        /**
	         * The length of the collection
	         * @property {Number} length
	         */
	        get: function () {
	            return this.models.length;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Collection.prototype, "Model", {
	        get: function () {
	            if (!this._model) {
	                this._model = model_1.Model;
	            }
	            return this._model;
	        },
	        set: function (con) {
	            this._model = con;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Collection.prototype, "models", {
	        get: function () {
	            return this._models || (this._models = []);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Collection.prototype.add = function (models, options) {
	        var _this = this;
	        if (options === void 0) { options = {}; }
	        if (!Array.isArray(models)) {
	            if (!(models instanceof this.Model)) {
	                models = this.create(models, { add: false });
	            }
	        }
	        else {
	            models = models.map(function (item) {
	                return (item instanceof _this.Model) ? item : _this.create(item, { add: false });
	            });
	        }
	        this.set(models, utils_1.utils.extend({ merge: false }, options, addOptions));
	    };
	    Collection.prototype.set = function (items, options) {
	        if (options === void 0) { options = {}; }
	        options = utils_1.utils.extend({}, setOptions, options);
	        if (options.parse)
	            items = this.parse(items, options);
	        var singular = !Array.isArray(items);
	        var models = (singular ? (items ? [items] : []) : items.slice());
	        var i, l, id, model, attrs, existing, sort;
	        var at = options.at;
	        //var targetModel = this.model;
	        var sortable = this.comparator && (at == null) && options.sort !== false;
	        var sortAttr = typeof this.comparator === 'string' ? this.comparator : null;
	        var toAdd = [], toRemove = [], modelMap = {};
	        var add = options.add, merge = options.merge, remove = options.remove;
	        var order = !sortable && add && remove ? [] : null;
	        // Turn bare objects into model references, and prevent invalid models
	        // from being added.
	        for (i = 0, l = models.length; i < l; i++) {
	            model = models[i];
	            id = model.get(model.idAttribute) || model.uid;
	            // If a duplicate is found, prevent it from being added and
	            // optionally merge it into the existing model.
	            if (existing = this.get(id)) {
	                if (remove)
	                    modelMap[existing.uid] = true;
	                if (merge) {
	                    attrs = model.toJSON();
	                    //if (options.parse) attrs = existing.parse(attrs, options);
	                    existing.set(attrs, options);
	                    if (sortable && !sort && existing.hasChanged(sortAttr))
	                        sort = true;
	                }
	                models[i] = existing;
	            }
	            else if (add) {
	                models[i] = model; //this._prepareModel(attrs, options);
	                if (!model)
	                    continue;
	                toAdd.push(model);
	                this._addReference(model, options);
	            }
	            // Do not add multiple models with the same `id`.
	            model = existing || model;
	            if (order && !modelMap[model.id])
	                order.push(model);
	            modelMap[model.uid] = true;
	        }
	        // Remove nonexistent models if appropriate.
	        if (remove) {
	            for (i = 0, l = this.length; i < l; ++i) {
	                if (!modelMap[(model = this.models[i]).uid])
	                    toRemove.push(model);
	            }
	            if (toRemove.length)
	                this.remove(toRemove, options);
	        }
	        // See if sorting is needed, update `length` and splice in new models.
	        if (toAdd.length || (order && order.length)) {
	            if (sortable)
	                sort = true;
	            //this.length += toAdd.length;
	            if (at != null) {
	                for (i = 0, l = toAdd.length; i < l; i++) {
	                    this.models.splice(at + i, 0, toAdd[i]);
	                }
	            }
	            else {
	                if (order)
	                    this.models.length = 0;
	                var orderedModels = order || toAdd;
	                for (i = 0, l = orderedModels.length; i < l; i++) {
	                    this.models.push(orderedModels[i]);
	                }
	            }
	        }
	        // Silently sort the collection if appropriate.
	        if (sort)
	            this.sort({ silent: true });
	        // Unless silenced, it's time to fire all appropriate add/sort events.
	        if (!options.silent) {
	            for (i = 0, l = toAdd.length; i < l; i++) {
	                (model = toAdd[i]).trigger('add', model, this, options);
	            }
	            if (sort || (order && order.length))
	                this.trigger('sort', this, options);
	            if (toAdd.length || toRemove.length)
	                this.trigger('update', this, options);
	        }
	        // Return the added (or merged) model (or models).
	        return singular ? models[0] : models;
	    };
	    Collection.prototype.remove = function (models, options) {
	        if (options === void 0) { options = {}; }
	        var singular = !Array.isArray(models);
	        models = (singular ? [models] : models.slice());
	        var i, l, index, model;
	        for (i = 0, l = models.length; i < l; i++) {
	            model = models[i] = this.get(models[i]);
	            if (!model)
	                continue;
	            index = this.indexOf(model);
	            this.models.splice(index, 1);
	            if (!options.silent) {
	                options.index = index;
	                model.trigger('remove', model, this, options);
	            }
	            this._removeReference(model, options);
	        }
	        return singular ? models[0] : models;
	    };
	    Collection.prototype.get = function (id) {
	        return this.find(id);
	    };
	    // Get the model at the given index.
	    Collection.prototype.at = function (index) {
	        return this.models[index];
	    };
	    Collection.prototype.clone = function (options) {
	        options = options || this.options;
	        return new this.constructor(this.models, options);
	    };
	    Collection.prototype.sort = function (options) {
	        if (options === void 0) { options = {}; }
	        if (!this.comparator)
	            throw new Error('Cannot sort a set without a comparator');
	        // Run sort based on type of `comparator`.
	        if (typeof this.comparator === 'string' || this.comparator.length === 1) {
	            this._models = this.sortBy(this.comparator, this);
	        }
	        else {
	            this.models.sort(this.comparator.bind(this));
	        }
	        if (!options.silent)
	            this.trigger('sort', this, options);
	        return this;
	    };
	    Collection.prototype.sortBy = function (key, context) {
	        return utils_1.utils.sortBy(this._models, key, context);
	    };
	    Collection.prototype.push = function (model, options) {
	        if (options === void 0) { options = {}; }
	        return this.add(model, utils_1.utils.extend({ at: this.length }, options));
	    };
	    Collection.prototype.reset = function (models, options) {
	        var _this = this;
	        if (options === void 0) { options = {}; }
	        this.forEach(function (model) {
	            _this._removeReference(model, options);
	        });
	        options.previousModels = this.models;
	        this._reset();
	        models = this.add(models, options);
	        if (!options.silent)
	            this.trigger('reset', this, options);
	        return models;
	    };
	    Collection.prototype.create = function (values, options) {
	        if (options === void 0) { options = { add: true }; }
	        var model = new this.Model(values, options);
	        if (options.add)
	            this.add(model);
	        return model;
	    };
	    Collection.prototype.parse = function (models, options) {
	        if (options === void 0) { options = {}; }
	        return models;
	    };
	    Collection.prototype.find = function (nidOrFn) {
	        var model;
	        if (typeof nidOrFn === 'function') {
	            model = utils_1.utils.find(this.models, nidOrFn);
	        }
	        else {
	            model = utils_1.utils.find(this.models, function (model) {
	                return model.id == nidOrFn || model.uid == nidOrFn || nidOrFn === model;
	            });
	        }
	        return model;
	    };
	    Collection.prototype.forEach = function (iterator, ctx) {
	        for (var i = 0, l = this.models.length; i < l; i++) {
	            iterator.call(ctx || this, this.models[i], i);
	        }
	        return this;
	    };
	    Collection.prototype.indexOf = function (model) {
	        return this.models.indexOf(model);
	    };
	    Collection.prototype.toJSON = function () {
	        return this.models.map(function (m) { return m.toJSON(); });
	    };
	    Collection.prototype._removeReference = function (model, options) {
	        if (this === model.collection)
	            delete model.collection;
	        this.stopListening(model);
	    };
	    Collection.prototype._addReference = function (model, options) {
	        if (!model.collection)
	            model.collection = this;
	        this.listenTo(model, 'all', this._onModelEvent);
	    };
	    Collection.prototype._reset = function () {
	        this._models = [];
	    };
	    Collection.prototype._onModelEvent = function (event, model, collection, options) {
	        if ((event === 'add' || event === 'remove') && collection !== this)
	            return;
	        if (event === 'destroy')
	            this.remove(model, options);
	        utils_1.utils.call(this.trigger, this, utils_1.utils.slice(arguments));
	    };
	    return Collection;
	})(object_1.BaseObject);
	exports.Collection = Collection;


/***/ },
/* 14 */
/***/ function(module, exports) {

	


/***/ }
/******/ ])
});
;
//# sourceMappingURL=views.js.map