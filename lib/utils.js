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
var transitionEndEvent = (function transitionEnd() {
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
    return null; // explicit for ie8 (  ._.)
})();
var animationEndEvent = (function animationEnd() {
    var el = document.createElement('bootstrap');
    var transEndEventNames = {
        'WebkitAnimation': 'webkitAnimationEnd',
        'MozAnimation': 'animationend',
        'OTransition': 'oAnimationEnd oanimationend',
        'animation': 'animationend'
    };
    for (var name in transEndEventNames) {
        if (el.style[name] !== undefined) {
            return transEndEventNames[name];
        }
    }
    return null; // explicit for ie8 (  ._.)
})();
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
    function selectionStart(elm) {
        if ('selectionStart' in elm) {
            // Standard-compliant browsers
            return elm.selectionStart;
        }
        else if (document.selection) {
            // IE
            elm.focus();
            var sel = document.selection.createRange();
            var selLen = document.selection.createRange().text.length;
            sel.moveStart('character', -elm.value.length);
            return sel.text.length - selLen;
        }
    }
    html.selectionStart = selectionStart;
    function transitionEnd(elm, fn, ctx, duration) {
        var callback = function (e) {
            removeEventListener(elm, transitionEndEvent, callback);
            fn.call(ctx, e);
        };
        addEventListener(elm, transitionEndEvent, callback);
    }
    html.transitionEnd = transitionEnd;
    function animationEnd(elm, fn, ctx, duration) {
        var callback = function (e) {
            removeEventListener(elm, animationEndEvent, callback);
            fn.call(ctx, e);
        };
        addEventListener(elm, animationEndEvent, callback);
    }
    html.animationEnd = animationEnd;
})(html = exports.html || (exports.html = {}));
var nativeBind = Function.prototype.bind;
var noop = function () { };
var idCounter = 0;
/** @module utils */
var utils;
(function (utils) {
    utils.Promise = window.Promise;
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
    function flatten(arr) {
        return arr.reduce(function (flat, toFlatten) {
            return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
        }, []);
    }
    utils.flatten = flatten;
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
    // Promises
    function isPromise(obj) {
        return obj && typeof obj.then === 'function';
    }
    utils.isPromise = isPromise;
    function toPromise(obj) {
        /* jshint validthis:true */
        if (!obj) {
            return obj;
        }
        if (isPromise(obj)) {
            return obj;
        }
        if ("function" == typeof obj) {
            return thunkToPromise.call(this, obj);
        }
        if (Array.isArray(obj)) {
            return arrayToPromise.call(this, obj);
        }
        if (isObject(obj)) {
            return objectToPromise.call(this, obj);
        }
        return utils.Promise.resolve(obj);
    }
    utils.toPromise = toPromise;
    /**
     * Convert a thunk to a promise.
     *
     * @param {Function}
     * @return {Promise}
     * @api private
     */
    function thunkToPromise(fn) {
        /* jshint validthis:true */
        var ctx = this;
        return new utils.Promise(function (resolve, reject) {
            fn.call(ctx, function (err, res) {
                if (err)
                    return reject(err);
                if (arguments.length > 2)
                    res = slice.call(arguments, 1);
                resolve(res);
            });
        });
    }
    utils.thunkToPromise = thunkToPromise;
    /**
     * Convert an array of "yieldables" to a promise.
     * Uses `Promise.all()` internally.
     *
     * @param {Array} obj
     * @return {Promise}
     * @api private
     */
    function arrayToPromise(obj) {
        /* jshint validthis:true */
        return utils.Promise.all(obj.map(toPromise, this));
    }
    utils.arrayToPromise = arrayToPromise;
    /**
     * Convert an object of "yieldables" to a promise.
     * Uses `Promise.all()` internally.
     *
     * @param {Object} obj
     * @return {Promise}
     * @api private
     */
    function objectToPromise(obj) {
        /* jshint validthis:true */
        var results = new obj.constructor();
        var keys = Object.keys(obj);
        var promises = [];
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var promise = toPromise.call(this, obj[key]);
            if (promise && isPromise(promise))
                defer(promise, key);
            else
                results[key] = obj[key];
        }
        return utils.Promise.all(promises).then(function () {
            return results;
        });
        function defer(promise, key) {
            // predefine the key in the result
            results[key] = undefined;
            promises.push(promise.then(function (res) {
                results[key] = res;
            }));
        }
    }
    utils.objectToPromise = objectToPromise;
    function deferred(fn, ctx) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        var ret = {};
        ret.promise = new utils.Promise(function (resolve, reject) {
            ret.resolve = resolve;
            ret.reject = reject;
            ret.done = function (err, result) { if (err)
                return reject(err);
            else
                resolve(result); };
        });
        if (typeof fn === 'function') {
            fn.apply(ctx, args.concat([ret.done]));
            return ret.promise;
        }
        return ret;
    }
    utils.deferred = deferred;
    ;
    function callback(promise, callback, ctx) {
        promise.then(function (result) {
            callback.call(ctx, null, result);
        }).catch(function (err) {
            callback.call(ctx, err);
        });
    }
    utils.callback = callback;
    function delay(timeout) {
        var defer = deferred();
        setTimeout(defer.resolve, timeout);
        return defer.promise;
    }
    utils.delay = delay;
    ;
    function eachAsync(array, iterator, context, accumulate) {
        if (accumulate === void 0) { accumulate = false; }
        /*return new Promise<void>(function(resolve, reject) {
          let i = 0, len = array.length,
            errors = [];
          function next(err, result?: any) {
            if (err && !accumulate) return reject(err);
            if (err) errors.push(err);
            if (i === len)
              return errors.length ? reject(flatten(errors)) : resolve();
    
            iterator(array[i++]).then(function(r) { next(null, r); }, next);
          }
    
          next(null);
    
        });*/
        return mapAsync(array, iterator, context, accumulate)
            .then(function () { return void 0; });
    }
    utils.eachAsync = eachAsync;
    function mapAsync(array, iterator, context, accumulate) {
        if (accumulate === void 0) { accumulate = false; }
        return new utils.Promise(function (resolve, reject) {
            var i = 0, len = array.length, errors = [], results = [];
            function next(err, result) {
                if (err && !accumulate)
                    return reject(err);
                if (err)
                    errors.push(err);
                if (i === len)
                    return errors.length ? reject(flatten(errors)) : resolve(results);
                var ret = iterator.call(context, array[i++]);
                if (isPromise(ret)) {
                    ret.then(function (r) { results.push(r); next(null, r); }, next);
                }
                else if (ret instanceof Error) {
                    next(ret);
                }
                else {
                    next(null);
                }
            }
            next(null);
        });
    }
    utils.mapAsync = mapAsync;
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
