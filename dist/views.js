(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("eventsjs"), require("orange"));
	else if(typeof define === 'function' && define.amd)
		define(["eventsjs", "orange"], factory);
	else if(typeof exports === 'object')
		exports["views"] = factory(require("eventsjs"), require("orange"));
	else
		root["views"] = factory(root["eventsjs"], root["orange"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_6__, __WEBPACK_EXTERNAL_MODULE_7__) {
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

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	var baseview_1 = __webpack_require__(1);
	__export(__webpack_require__(5));
	__export(__webpack_require__(1));
	__export(__webpack_require__(12));
	__export(__webpack_require__(13));
	__export(__webpack_require__(14));
	__export(__webpack_require__(15));
	__export(__webpack_require__(16));
	__export(__webpack_require__(17));
	exports.Version = '0.3.3';
	function debug(debug) {
	    if (window.localStorage) {
	        window.localStorage['debug'] = debug ? "views:*" : '';
	    }
	}
	exports.debug = debug;
	//export {Collection, ICollection,IModel,Model} from 'collection'
	function isView(a) {
	    return a instanceof baseview_1.BaseView;
	}
	exports.isView = isView;


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Debug = __webpack_require__(2);
	var debug = Debug('views:baseview');
	var object_1 = __webpack_require__(5);
	var orange_1 = __webpack_require__(7);
	var orange_dom_1 = __webpack_require__(8);
	var util_1 = __webpack_require__(11);
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


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * This is the web browser implementation of `debug()`.
	 *
	 * Expose `debug()` as the module.
	 */
	
	exports = module.exports = __webpack_require__(3);
	exports.log = log;
	exports.formatArgs = formatArgs;
	exports.save = save;
	exports.load = load;
	exports.useColors = useColors;
	exports.storage = 'undefined' != typeof chrome
	               && 'undefined' != typeof chrome.storage
	                  ? chrome.storage.local
	                  : localstorage();
	
	/**
	 * Colors.
	 */
	
	exports.colors = [
	  'lightseagreen',
	  'forestgreen',
	  'goldenrod',
	  'dodgerblue',
	  'darkorchid',
	  'crimson'
	];
	
	/**
	 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
	 * and the Firebug extension (any Firefox version) are known
	 * to support "%c" CSS customizations.
	 *
	 * TODO: add a `localStorage` variable to explicitly enable/disable colors
	 */
	
	function useColors() {
	  // is webkit? http://stackoverflow.com/a/16459606/376773
	  return ('WebkitAppearance' in document.documentElement.style) ||
	    // is firebug? http://stackoverflow.com/a/398120/376773
	    (window.console && (console.firebug || (console.exception && console.table))) ||
	    // is firefox >= v31?
	    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
	    (navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31);
	}
	
	/**
	 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
	 */
	
	exports.formatters.j = function(v) {
	  return JSON.stringify(v);
	};
	
	
	/**
	 * Colorize log arguments if enabled.
	 *
	 * @api public
	 */
	
	function formatArgs() {
	  var args = arguments;
	  var useColors = this.useColors;
	
	  args[0] = (useColors ? '%c' : '')
	    + this.namespace
	    + (useColors ? ' %c' : ' ')
	    + args[0]
	    + (useColors ? '%c ' : ' ')
	    + '+' + exports.humanize(this.diff);
	
	  if (!useColors) return args;
	
	  var c = 'color: ' + this.color;
	  args = [args[0], c, 'color: inherit'].concat(Array.prototype.slice.call(args, 1));
	
	  // the final "%c" is somewhat tricky, because there could be other
	  // arguments passed either before or after the %c, so we need to
	  // figure out the correct index to insert the CSS into
	  var index = 0;
	  var lastC = 0;
	  args[0].replace(/%[a-z%]/g, function(match) {
	    if ('%%' === match) return;
	    index++;
	    if ('%c' === match) {
	      // we only are interested in the *last* %c
	      // (the user may have provided their own)
	      lastC = index;
	    }
	  });
	
	  args.splice(lastC, 0, c);
	  return args;
	}
	
	/**
	 * Invokes `console.log()` when available.
	 * No-op when `console.log` is not a "function".
	 *
	 * @api public
	 */
	
	function log() {
	  // this hackery is required for IE8/9, where
	  // the `console.log` function doesn't have 'apply'
	  return 'object' === typeof console
	    && console.log
	    && Function.prototype.apply.call(console.log, console, arguments);
	}
	
	/**
	 * Save `namespaces`.
	 *
	 * @param {String} namespaces
	 * @api private
	 */
	
	function save(namespaces) {
	  try {
	    if (null == namespaces) {
	      exports.storage.removeItem('debug');
	    } else {
	      exports.storage.debug = namespaces;
	    }
	  } catch(e) {}
	}
	
	/**
	 * Load `namespaces`.
	 *
	 * @return {String} returns the previously persisted debug modes
	 * @api private
	 */
	
	function load() {
	  var r;
	  try {
	    r = exports.storage.debug;
	  } catch(e) {}
	  return r;
	}
	
	/**
	 * Enable namespaces listed in `localStorage.debug` initially.
	 */
	
	exports.enable(load());
	
	/**
	 * Localstorage attempts to return the localstorage.
	 *
	 * This is necessary because safari throws
	 * when a user disables cookies/localstorage
	 * and you attempt to access it.
	 *
	 * @return {LocalStorage}
	 * @api private
	 */
	
	function localstorage(){
	  try {
	    return window.localStorage;
	  } catch (e) {}
	}


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	
	/**
	 * This is the common logic for both the Node.js and web browser
	 * implementations of `debug()`.
	 *
	 * Expose `debug()` as the module.
	 */
	
	exports = module.exports = debug;
	exports.coerce = coerce;
	exports.disable = disable;
	exports.enable = enable;
	exports.enabled = enabled;
	exports.humanize = __webpack_require__(4);
	
	/**
	 * The currently active debug mode names, and names to skip.
	 */
	
	exports.names = [];
	exports.skips = [];
	
	/**
	 * Map of special "%n" handling functions, for the debug "format" argument.
	 *
	 * Valid key names are a single, lowercased letter, i.e. "n".
	 */
	
	exports.formatters = {};
	
	/**
	 * Previously assigned color.
	 */
	
	var prevColor = 0;
	
	/**
	 * Previous log timestamp.
	 */
	
	var prevTime;
	
	/**
	 * Select a color.
	 *
	 * @return {Number}
	 * @api private
	 */
	
	function selectColor() {
	  return exports.colors[prevColor++ % exports.colors.length];
	}
	
	/**
	 * Create a debugger with the given `namespace`.
	 *
	 * @param {String} namespace
	 * @return {Function}
	 * @api public
	 */
	
	function debug(namespace) {
	
	  // define the `disabled` version
	  function disabled() {
	  }
	  disabled.enabled = false;
	
	  // define the `enabled` version
	  function enabled() {
	
	    var self = enabled;
	
	    // set `diff` timestamp
	    var curr = +new Date();
	    var ms = curr - (prevTime || curr);
	    self.diff = ms;
	    self.prev = prevTime;
	    self.curr = curr;
	    prevTime = curr;
	
	    // add the `color` if not set
	    if (null == self.useColors) self.useColors = exports.useColors();
	    if (null == self.color && self.useColors) self.color = selectColor();
	
	    var args = Array.prototype.slice.call(arguments);
	
	    args[0] = exports.coerce(args[0]);
	
	    if ('string' !== typeof args[0]) {
	      // anything else let's inspect with %o
	      args = ['%o'].concat(args);
	    }
	
	    // apply any `formatters` transformations
	    var index = 0;
	    args[0] = args[0].replace(/%([a-z%])/g, function(match, format) {
	      // if we encounter an escaped % then don't increase the array index
	      if (match === '%%') return match;
	      index++;
	      var formatter = exports.formatters[format];
	      if ('function' === typeof formatter) {
	        var val = args[index];
	        match = formatter.call(self, val);
	
	        // now we need to remove `args[index]` since it's inlined in the `format`
	        args.splice(index, 1);
	        index--;
	      }
	      return match;
	    });
	
	    if ('function' === typeof exports.formatArgs) {
	      args = exports.formatArgs.apply(self, args);
	    }
	    var logFn = enabled.log || exports.log || console.log.bind(console);
	    logFn.apply(self, args);
	  }
	  enabled.enabled = true;
	
	  var fn = exports.enabled(namespace) ? enabled : disabled;
	
	  fn.namespace = namespace;
	
	  return fn;
	}
	
	/**
	 * Enables a debug mode by namespaces. This can include modes
	 * separated by a colon and wildcards.
	 *
	 * @param {String} namespaces
	 * @api public
	 */
	
	function enable(namespaces) {
	  exports.save(namespaces);
	
	  var split = (namespaces || '').split(/[\s,]+/);
	  var len = split.length;
	
	  for (var i = 0; i < len; i++) {
	    if (!split[i]) continue; // ignore empty strings
	    namespaces = split[i].replace(/\*/g, '.*?');
	    if (namespaces[0] === '-') {
	      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
	    } else {
	      exports.names.push(new RegExp('^' + namespaces + '$'));
	    }
	  }
	}
	
	/**
	 * Disable debug output.
	 *
	 * @api public
	 */
	
	function disable() {
	  exports.enable('');
	}
	
	/**
	 * Returns true if the given mode name is enabled, false otherwise.
	 *
	 * @param {String} name
	 * @return {Boolean}
	 * @api public
	 */
	
	function enabled(name) {
	  var i, len;
	  for (i = 0, len = exports.skips.length; i < len; i++) {
	    if (exports.skips[i].test(name)) {
	      return false;
	    }
	  }
	  for (i = 0, len = exports.names.length; i < len; i++) {
	    if (exports.names[i].test(name)) {
	      return true;
	    }
	  }
	  return false;
	}
	
	/**
	 * Coerce `val`.
	 *
	 * @param {Mixed} val
	 * @return {Mixed}
	 * @api private
	 */
	
	function coerce(val) {
	  if (val instanceof Error) return val.stack || val.message;
	  return val;
	}


/***/ },
/* 4 */
/***/ function(module, exports) {

	/**
	 * Helpers.
	 */
	
	var s = 1000;
	var m = s * 60;
	var h = m * 60;
	var d = h * 24;
	var y = d * 365.25;
	
	/**
	 * Parse or format the given `val`.
	 *
	 * Options:
	 *
	 *  - `long` verbose formatting [false]
	 *
	 * @param {String|Number} val
	 * @param {Object} options
	 * @return {String|Number}
	 * @api public
	 */
	
	module.exports = function(val, options){
	  options = options || {};
	  if ('string' == typeof val) return parse(val);
	  return options.long
	    ? long(val)
	    : short(val);
	};
	
	/**
	 * Parse the given `str` and return milliseconds.
	 *
	 * @param {String} str
	 * @return {Number}
	 * @api private
	 */
	
	function parse(str) {
	  str = '' + str;
	  if (str.length > 10000) return;
	  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str);
	  if (!match) return;
	  var n = parseFloat(match[1]);
	  var type = (match[2] || 'ms').toLowerCase();
	  switch (type) {
	    case 'years':
	    case 'year':
	    case 'yrs':
	    case 'yr':
	    case 'y':
	      return n * y;
	    case 'days':
	    case 'day':
	    case 'd':
	      return n * d;
	    case 'hours':
	    case 'hour':
	    case 'hrs':
	    case 'hr':
	    case 'h':
	      return n * h;
	    case 'minutes':
	    case 'minute':
	    case 'mins':
	    case 'min':
	    case 'm':
	      return n * m;
	    case 'seconds':
	    case 'second':
	    case 'secs':
	    case 'sec':
	    case 's':
	      return n * s;
	    case 'milliseconds':
	    case 'millisecond':
	    case 'msecs':
	    case 'msec':
	    case 'ms':
	      return n;
	  }
	}
	
	/**
	 * Short format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */
	
	function short(ms) {
	  if (ms >= d) return Math.round(ms / d) + 'd';
	  if (ms >= h) return Math.round(ms / h) + 'h';
	  if (ms >= m) return Math.round(ms / m) + 'm';
	  if (ms >= s) return Math.round(ms / s) + 's';
	  return ms + 'ms';
	}
	
	/**
	 * Long format for `ms`.
	 *
	 * @param {Number} ms
	 * @return {String}
	 * @api private
	 */
	
	function long(ms) {
	  return plural(ms, d, 'day')
	    || plural(ms, h, 'hour')
	    || plural(ms, m, 'minute')
	    || plural(ms, s, 'second')
	    || ms + ' ms';
	}
	
	/**
	 * Pluralization helper.
	 */
	
	function plural(ms, n, name) {
	  if (ms < n) return;
	  if (ms < n * 1.5) return Math.floor(ms / n) + ' ' + name;
	  return Math.ceil(ms / n) + ' ' + name + 's';
	}


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Debug = __webpack_require__(2);
	var debug = Debug('views:object');
	var eventsjs_1 = __webpack_require__(6);
	var orange_1 = __webpack_require__(7);
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
	        debug("%s destroy", this);
	        if (typeof Object.freeze) {
	        }
	        return this;
	    };
	    BaseObject.prototype.triggerMethod = function (eventName) {
	        var args = [];
	        for (var _i = 1; _i < arguments.length; _i++) {
	            args[_i - 1] = arguments[_i];
	        }
	        orange_1.triggerMethodOn(this, eventName, args);
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
	        return orange_1.getOption(prop, args);
	    };
	    BaseObject.extend = function (proto, stat) {
	        return orange_1.inherits(this, proto, stat);
	    };
	    return BaseObject;
	}(eventsjs_1.EventEmitter));
	exports.BaseObject = BaseObject;


/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_6__;

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_7__;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	function __export(m) {
	    for (var p in m) {
	        if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	    }
	}
	__export(__webpack_require__(9));
	__export(__webpack_require__(10));

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	// TODO: CreateHTML
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var orange_1 = __webpack_require__(7);
	var ElementProto = typeof Element !== 'undefined' && Element.prototype || {};
	var matchesSelector = ElementProto.matches || ElementProto.webkitMatchesSelector || ElementProto.mozMatchesSelector || ElementProto.msMatchesSelector || ElementProto.oMatchesSelector || function (selector) {
	    var nodeList = (this.parentNode || document).querySelectorAll(selector) || [];
	    return !!~orange_1.indexOf(nodeList, this);
	};
	var elementAddEventListener = ElementProto.addEventListener || function (eventName, listener) {
	    return this.attachEvent('on' + eventName, listener);
	};
	var elementRemoveEventListener = ElementProto.removeEventListener || function (eventName, listener) {
	    return this.detachEvent('on' + eventName, listener);
	};
	var transitionEndEvent = function transitionEnd() {
	    var el = document.createElement('bootstrap');
	    var transEndEventNames = {
	        'WebkitTransition': 'webkitTransitionEnd',
	        'MozTransition': 'transitionend',
	        'OTransition': 'oTransitionEnd otransitionend',
	        'transition': 'transitionend'
	    };
	    for (var name in transEndEventNames) {
	        if (el.style[name] !== undefined) {
	            return transEndEventNames[name];
	        }
	    }
	    return null;
	};
	var animationEndEvent = function animationEnd() {
	    var el = document.createElement('bootstrap');
	    var transEndEventNames = {
	        'WebkitAnimation': 'webkitAnimationEnd',
	        'MozAnimation': 'animationend',
	        'OAnimation': 'oAnimationEnd oanimationend',
	        'animation': 'animationend'
	    };
	    for (var name in transEndEventNames) {
	        if (el.style[name] !== undefined) {
	            return transEndEventNames[name];
	        }
	    }
	    return null;
	};
	function matches(elm, selector) {
	    return matchesSelector.call(elm, selector);
	}
	exports.matches = matches;
	function addEventListener(elm, eventName, listener) {
	    var useCap = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];
	
	    elementAddEventListener.call(elm, eventName, listener, useCap);
	}
	exports.addEventListener = addEventListener;
	function removeEventListener(elm, eventName, listener) {
	    elementRemoveEventListener.call(elm, eventName, listener);
	}
	exports.removeEventListener = removeEventListener;
	var unbubblebles = 'focus blur change load error'.split(' ');
	var domEvents = [];
	function delegate(elm, selector, eventName, callback, ctx) {
	    var root = elm;
	    var handler = function handler(e) {
	        var node = e.target || e.srcElement;
	        // Already handled
	        if (e.delegateTarget) return;
	        for (; node && node != root; node = node.parentNode) {
	            if (matches(node, selector)) {
	                e.delegateTarget = node;
	                callback(e);
	            }
	        }
	    };
	    var useCap = !!~unbubblebles.indexOf(eventName);
	    addEventListener(elm, eventName, handler, useCap);
	    domEvents.push({ eventName: eventName, handler: handler, listener: callback, selector: selector });
	    return handler;
	}
	exports.delegate = delegate;
	function undelegate(elm, selector, eventName, callback) {
	    /*if (typeof selector === 'function') {
	        listener = <Function>selector;
	        selector = null;
	      }*/
	    var handlers = domEvents.slice();
	    for (var i = 0, len = handlers.length; i < len; i++) {
	        var item = handlers[i];
	        var match = item.eventName === eventName && (callback ? item.listener === callback : true) && (selector ? item.selector === selector : true);
	        if (!match) continue;
	        removeEventListener(elm, item.eventName, item.handler);
	        domEvents.splice(orange_1.indexOf(handlers, item), 1);
	    }
	}
	exports.undelegate = undelegate;
	function addClass(elm, className) {
	    if (elm.classList) {
	        var split = className.split(' ');
	        for (var i = 0, ii = split.length; i < ii; i++) {
	            if (elm.classList.contains(split[i].trim())) continue;
	            elm.classList.add(split[i].trim());
	        }
	    } else {
	        elm.className = orange_1.unique(elm.className.split(' ').concat(className.split(' '))).join(' ');
	    }
	}
	exports.addClass = addClass;
	function removeClass(elm, className) {
	    if (elm.classList) {
	        var split = className.split(' ');
	        for (var i = 0, ii = split.length; i < ii; i++) {
	            elm.classList.remove(split[i].trim());
	        }
	    } else {
	        var _split = elm.className.split(' '),
	            classNames = className.split(' '),
	            tmp = _split,
	            index = void 0;
	        for (var _i = 0, _ii = classNames.length; _i < _ii; _i++) {
	            index = _split.indexOf(classNames[_i]);
	            if (!!~index) _split = _split.splice(index, 1);
	        }
	    }
	}
	exports.removeClass = removeClass;
	function hasClass(elm, className) {
	    if (elm.classList) {
	        return elm.classList.contains(className);
	    }
	    var reg = new RegExp('\b' + className);
	    return reg.test(elm.className);
	}
	exports.hasClass = hasClass;
	function selectionStart(elm) {
	    if ('selectionStart' in elm) {
	        // Standard-compliant browsers
	        return elm.selectionStart;
	    } else if (document.selection) {
	        // IE
	        elm.focus();
	        var sel = document.selection.createRange();
	        var selLen = document.selection.createRange().text.length;
	        sel.moveStart('character', -elm.value.length);
	        return sel.text.length - selLen;
	    }
	}
	exports.selectionStart = selectionStart;
	var _events = {
	    animationEnd: null,
	    transitionEnd: null
	};
	function transitionEnd(elm, fn, ctx, duration) {
	    var event = _events.transitionEnd || (_events.transitionEnd = transitionEndEvent());
	    var callback = function callback(e) {
	        removeEventListener(elm, event, callback);
	        fn.call(ctx, e);
	    };
	    addEventListener(elm, event, callback);
	}
	exports.transitionEnd = transitionEnd;
	function animationEnd(elm, fn, ctx, duration) {
	    var event = _events.animationEnd || (_events.animationEnd = animationEndEvent());
	    var callback = function callback(e) {
	        removeEventListener(elm, event, callback);
	        fn.call(ctx, e);
	    };
	    addEventListener(elm, event, callback);
	}
	exports.animationEnd = animationEnd;
	exports.domReady = function () {
	    var fns = [],
	        _listener,
	        doc = document,
	        hack = doc.documentElement.doScroll,
	        domContentLoaded = 'DOMContentLoaded',
	        loaded = (hack ? /^loaded|^c/ : /^loaded|^i|^c/).test(doc.readyState);
	    if (!loaded) {
	        doc.addEventListener(domContentLoaded, _listener = function listener() {
	            doc.removeEventListener(domContentLoaded, _listener);
	            loaded = true;
	            while (_listener = fns.shift()) {
	                _listener();
	            }
	        });
	    }
	    return function (fn) {
	        loaded ? setTimeout(fn, 0) : fns.push(fn);
	    };
	}();
	function createElement(tag, attr) {
	    var elm = document.createElement(tag);
	    if (attr) {
	        for (var key in attr) {
	            elm.setAttribute(key, attr[key]);
	        }
	    }
	    return elm;
	}
	exports.createElement = createElement;
	
	var LoadedImage = function () {
	    function LoadedImage(img) {
	        _classCallCheck(this, LoadedImage);
	
	        this.img = img;
	    }
	
	    _createClass(LoadedImage, [{
	        key: 'check',
	        value: function check(fn) {
	            this.fn = fn;
	            var isComplete = this.getIsImageComplete();
	            if (isComplete) {
	                // report based on naturalWidth
	                this.confirm(this.img.naturalWidth !== 0, 'naturalWidth');
	                return;
	            }
	            this.img.addEventListener('load', this);
	            this.img.addEventListener('error', this);
	        }
	    }, {
	        key: 'confirm',
	        value: function confirm(loaded, msg, err) {
	            this.isLoaded = loaded;
	            if (this.fn) this.fn(err);
	        }
	    }, {
	        key: 'getIsImageComplete',
	        value: function getIsImageComplete() {
	            return this.img.complete && this.img.naturalWidth !== undefined && this.img.naturalWidth !== 0;
	        }
	    }, {
	        key: 'handleEvent',
	        value: function handleEvent(e) {
	            var method = 'on' + event.type;
	            if (this[method]) {
	                this[method](event);
	            }
	        }
	    }, {
	        key: 'onload',
	        value: function onload(e) {
	            this.confirm(true, 'onload');
	            this.unbindEvents();
	        }
	    }, {
	        key: 'onerror',
	        value: function onerror(e) {
	            this.confirm(false, 'onerror', new Error(e.error));
	            this.unbindEvents();
	        }
	    }, {
	        key: 'unbindEvents',
	        value: function unbindEvents() {
	            this.img.removeEventListener('load', this);
	            this.img.removeEventListener('error', this);
	            this.fn = void 0;
	        }
	    }]);
	
	    return LoadedImage;
	}();
	
	function imageLoaded(img) {
	    return new orange_1.Promise(function (resolve, reject) {
	        var i = new LoadedImage(img);
	        i.check(function (err) {
	            if (err) return reject(err);
	            resolve(i.isLoaded);
	        });
	    });
	}
	exports.imageLoaded = imageLoaded;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var orange_1 = __webpack_require__(7);
	var dom = __webpack_require__(9);
	var domEvents;
	var singleTag = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;
	function parseHTML(html) {
	    var parsed = singleTag.exec(html);
	    if (parsed) {
	        return document.createElement(parsed[0]);
	    }
	    var div = document.createElement('div');
	    div.innerHTML = html;
	    var element = div.firstChild;
	    return element;
	}
	
	var Html = function () {
	    function Html(el) {
	        _classCallCheck(this, Html);
	
	        if (!Array.isArray(el)) el = [el];
	        this._elements = el || [];
	    }
	
	    _createClass(Html, [{
	        key: 'get',
	        value: function get(n) {
	            n = n === undefined ? 0 : n;
	            return n >= this.length ? undefined : this._elements[n];
	        }
	    }, {
	        key: 'addClass',
	        value: function addClass(str) {
	            return this.forEach(function (e) {
	                dom.addClass(e, str);
	            });
	        }
	    }, {
	        key: 'removeClass',
	        value: function removeClass(str) {
	            return this.forEach(function (e) {
	                dom.removeClass(e, str);
	            });
	        }
	    }, {
	        key: 'hasClass',
	        value: function hasClass(str) {
	            return this._elements.reduce(function (p, c) {
	                return dom.hasClass(c, str);
	            }, false);
	        }
	    }, {
	        key: 'attr',
	        value: function attr(key, value) {
	            var attr = void 0;
	            if (typeof key === 'string' && value) {
	                attr = _defineProperty({}, key, value);
	            } else if (typeof key == 'string') {
	                if (this.length) return this.get(0).getAttribute(key);
	            } else if (orange_1.isObject(key)) {
	                attr = key;
	            }
	            return this.forEach(function (e) {
	                for (var k in attr) {
	                    e.setAttribute(k, attr[k]);
	                }
	            });
	        }
	    }, {
	        key: 'text',
	        value: function text(str) {
	            if (arguments.length === 0) {
	                return this.length > 0 ? this.get(0).textContent : null;
	            }
	            return this.forEach(function (e) {
	                return e.textContent = str;
	            });
	        }
	    }, {
	        key: 'html',
	        value: function html(_html) {
	            if (arguments.length === 0) {
	                return this.length > 0 ? this.get(0).innerHTML : null;
	            }
	            return this.forEach(function (e) {
	                return e.innerHTML = _html;
	            });
	        }
	    }, {
	        key: 'css',
	        value: function css(attr, value) {
	            if (arguments.length === 2) {
	                return this.forEach(function (e) {
	                    if (attr in e.style) e.style[attr] = String(value);
	                });
	            } else {
	                return this.forEach(function (e) {
	                    for (var k in attr) {
	                        if (k in e.style) e.style[k] = String(attr[k]);
	                    }
	                });
	            }
	        }
	    }, {
	        key: 'parent',
	        value: function parent() {
	            var out = [];
	            this.forEach(function (e) {
	                if (e.parentElement) {
	                    out.push(e.parentElement);
	                }
	            });
	            return new Html(out);
	        }
	    }, {
	        key: 'remove',
	        value: function remove() {
	            return this.forEach(function (e) {
	                if (e.parentElement) e.parentElement.removeChild(e);
	            });
	        }
	    }, {
	        key: 'clone',
	        value: function clone() {
	            return new Html(this.map(function (m) {
	                return m.cloneNode();
	            }));
	        }
	    }, {
	        key: 'find',
	        value: function find(str) {
	            var out = [];
	            this.forEach(function (e) {
	                out = out.concat(orange_1.slice(e.querySelectorAll(str)));
	            });
	            return new Html(out);
	        }
	    }, {
	        key: 'map',
	        value: function map(fn) {
	            var out = new Array(this.length);
	            this.forEach(function (e, i) {
	                out[i] = fn(e, i);
	            });
	            return out;
	        }
	    }, {
	        key: 'forEach',
	        value: function forEach(fn) {
	            this._elements.forEach(fn);
	            return this;
	        }
	    }, {
	        key: 'length',
	        get: function get() {
	            return this._elements.length;
	        }
	    }], [{
	        key: 'query',
	        value: function query(_query, context) {
	            if (typeof context === 'string') {
	                context = document.querySelectorAll(context);
	            }
	            var html = void 0;
	            var els = void 0;
	            if (typeof _query === 'string') {
	                if (_query.length > 0 && _query[0] === '<' && _query[_query.length - 1] === ">" && _query.length >= 3) {
	                    return new Html([parseHTML(_query)]);
	                }
	                if (context) {
	                    if (context instanceof HTMLElement) {
	                        els = orange_1.slice(context.querySelectorAll(_query));
	                    } else {
	                        html = new Html(orange_1.slice(context));
	                        return html.find(_query);
	                    }
	                } else {
	                    els = orange_1.slice(document.querySelectorAll(_query));
	                }
	            } else if (_query && _query instanceof Element) {
	                els = [_query];
	            } else if (_query && _query instanceof NodeList) {
	                els = orange_1.slice(_query);
	            }
	            return new Html(els);
	        }
	    }]);
	
	    return Html;
	}();
	
	exports.Html = Html;

/***/ },
/* 11 */
/***/ function(module, exports) {

	"use strict";
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


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Debug = __webpack_require__(2);
	var debug = Debug('views:region');
	var object_1 = __webpack_require__(5);
	var orange_1 = __webpack_require__(7);
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
	            debug('%s render view %s', this, view);
	            view.render();
	            orange_1.triggerMethodOn(view, 'before:show');
	            debug('%s attaching view: %s', this, view);
	            this._attachHtml(view);
	            orange_1.triggerMethodOn(view, 'show');
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
	}(object_1.BaseObject));
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
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/* global BaseClass, __has */
	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var object_1 = __webpack_require__(5);
	var region_1 = __webpack_require__(12);
	var utils = __webpack_require__(7);
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
	        if (typeof names === 'string') {
	            names = [names];
	        }
	        names.forEach(function (name) {
	            if (utils.has(this.regions, name)) {
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
	        utils.callFunc(this.removeRegion, this, Object.keys(this._regions));
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
	}(object_1.BaseObject));
	exports.RegionManager = RegionManager;


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	/*global View, RegionManager, Region*/
	var view_1 = __webpack_require__(15);
	var region_manager_1 = __webpack_require__(13);
	var orange_1 = __webpack_require__(7);
	var region_1 = __webpack_require__(12);
	var LayoutView = (function (_super) {
	    __extends(LayoutView, _super);
	    /**
	     * LayoutView
	     * @param {Object} options options
	     * @constructor LayoutView
	     * @extends TemplateView
	     */
	    function LayoutView(options) {
	        _super.call(this, options);
	        // Set region manager
	        this._regionManager = new region_manager_1.RegionManager();
	        orange_1.proxy(this, this._regionManager, ['removeRegion', 'removeRegions']);
	        this._regions = this.getOption('regions', options || {});
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
	}(view_1.View));
	exports.LayoutView = LayoutView;


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Debug = __webpack_require__(2);
	var debug = Debug('views:view');
	var baseview_1 = __webpack_require__(1);
	var orange_1 = __webpack_require__(7);
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
	        orange_1.extend(this, orange_1.pick(options, ['model', 'collection', 'template']));
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
	        if (model != null) {
	            debug('%s set model uid: %s', this, model.uid);
	        }
	        this._model = model;
	        this.triggerMethod('model', model);
	        return this;
	    };
	    View.prototype.setCollection = function (collection) {
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
	    };
	    View.prototype.getTemplateData = function () {
	        return this.model ?
	            typeof this.model.toJSON === 'function' ?
	                this.model.toJSON() : this.model : {};
	    };
	    View.prototype.render = function (options) {
	        if (options === void 0) { options = {}; }
	        debug('%s render', this);
	        if (!options.silent)
	            this.triggerMethod('before:render');
	        this.undelegateEvents();
	        this.renderTemplate(this.getTemplateData());
	        this.delegateEvents();
	        if (!options.silent)
	            this.triggerMethod('render');
	        return this;
	    };
	    View.prototype.delegateEvents = function (events) {
	        events = events || orange_1.result(this, 'events');
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
	            debug('%s render template function', this);
	            template = template.call(this, data);
	        }
	        if (template && typeof template === 'string') {
	            debug('%s attach template: %s', this, template);
	            this.attachTemplate(template);
	        }
	    };
	    View.prototype.attachTemplate = function (template) {
	        //this.undelegateEvents();
	        this.el.innerHTML = template;
	        //this.delegateEvents();
	    };
	    View.prototype._delegateDataEvents = function (model, collection) {
	        var _this = this;
	        this._dataEvents = {};
	        var fn = function (item, ev) {
	            if (!_this[item])
	                return {};
	            var out = {}, k, f;
	            for (k in ev) {
	                f = orange_1.bind(ev[k], _this);
	                _this[item].on(k, f);
	                out[item + ":" + k] = f;
	            }
	            return out;
	        };
	        orange_1.extend(this._dataEvents, fn('model', model), fn('collection', collection));
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


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var Debug = __webpack_require__(2);
	var debug = Debug('views:collectionview');
	var view_1 = __webpack_require__(15);
	var orange_1 = __webpack_require__(7);
	var eventsjs_1 = __webpack_require__(6);
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
	}());
	var CollectionView = (function (_super) {
	    __extends(CollectionView, _super);
	    /** CollectionView
	   * @extends DataView
	   * @param {DataViewOptions} options
	   */
	    function CollectionView(options) {
	        _super.call(this, options);
	        this._options = options || {};
	        this.children = [];
	        this.sort = (options && options.sort != null) ? options.sort : true;
	        if (typeof this.initialize === 'function') {
	            orange_1.callFunc(this.initialize, this, orange_1.slice(arguments));
	        }
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
	        else {
	            this.showEmptyView();
	        }
	        return this;
	    };
	    /**
	     * @protected
	     */
	    CollectionView.prototype.setCollection = function (collection) {
	        _super.prototype.setCollection.call(this, collection);
	        this._delegateCollectionEvents();
	        return this;
	    };
	    CollectionView.prototype.renderCollection = function () {
	        this.destroyChildren();
	        if (this.collection.length !== 0) {
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
	        var ViewClass = this.getOption('childView') || view_1.View, options = this.getOption('childViewOptions') || {};
	        return new ViewClass(orange_1.extend({
	            model: model
	        }, options));
	    };
	    CollectionView.prototype.renderChildView = function (view, index) {
	        this.triggerMethod('before:render:child', view);
	        debug('%s render child: %s', this, view);
	        view.render();
	        this._attachHTML(view, index);
	        this.triggerMethod('render:child', view);
	    };
	    CollectionView.prototype.showEmptyView = function () {
	        var EmptyView = this.getOption('emptyView');
	        if (EmptyView == null)
	            return;
	        var view = new EmptyView();
	        this._emptyView = view;
	        this._container.appendChild(view.render().el);
	    };
	    CollectionView.prototype.hideEmptyView = function () {
	        if (!this._emptyView)
	            return;
	        this._emptyView.destroy();
	        this._emptyView.remove();
	        this._emptyView = void 0;
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
	            debug('%s destroy child view: %s', this, view);
	            view.destroy();
	        }
	        else if (typeof view.remove === 'function') {
	            debug('%s remove child view: %s', this, view);
	            view.remove();
	        }
	        this.stopListening(view);
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
	        debug('%s append child %s at index: %s', this, view, index);
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
	            debug("%s attach to buffer: %s", this, view);
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
	            var args = orange_1.slice(arguments);
	            args[0] = prefix + ':' + args[0];
	            args.splice(1, 0, view);
	            orange_1.callFunc(this.triggerMethod, this, args);
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
	        debug("%s initializing buffer", this);
	        this._buffer = new Buffer();
	    };
	    CollectionView.prototype._stopBuffering = function () {
	        debug('%s appending buffer to container', this);
	        this._container.appendChild(this._buffer.buffer);
	        delete this._buffer;
	    };
	    CollectionView.prototype._initContainer = function () {
	        debug("%s init container", this);
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
	            currentView = orange_1.find(this.children, function (view) {
	                return view._index === index + 1;
	            });
	        }
	        if (currentView) {
	            debug('%s insert child %s before: %s', this, childView, currentView);
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
	        debug('%s insert child %s ', this, childView);
	        this._container.appendChild(childView.el);
	    };
	    /**
	     * Delegate collection events
	     * @private
	     */
	    CollectionView.prototype._delegateCollectionEvents = function () {
	        if (this.collection && eventsjs_1.isEventEmitter(this.collection)) {
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
	        debug('%s received add event from collection %s', this, this.collection);
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
	        debug('%s received remove event from collection %s', this, this.collection);
	        var view = orange_1.find(this.children, function (view) {
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
	        debug('%s received sort event from collection %s', this, this.collection);
	        var orderChanged = this.collection.find(function (model, index) {
	            var view = orange_1.find(_this.children, function (view) {
	                return view.model === model;
	            });
	            return !view || view._index !== index;
	        });
	        if (orderChanged)
	            this.render();
	    };
	    return CollectionView;
	}(view_1.View));
	exports.CollectionView = CollectionView;


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var orange_1 = __webpack_require__(7);
	function attributes(attrs) {
	    return function (target) {
	        orange_1.extend(target.prototype, attrs);
	    };
	}
	exports.attributes = attributes;
	function events(events) {
	    return function (target) {
	        target.prototype.events = events;
	    };
	}
	exports.events = events;
	function triggers(triggers) {
	    return function (target) {
	        target.prototype.triggers = triggers;
	    };
	}
	exports.triggers = triggers;


/***/ }
/******/ ])
});
;
//# sourceMappingURL=views.js.map