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
