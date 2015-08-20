
var ElementProto: any = (typeof Element !== 'undefined' && Element.prototype) || {};

var matchesSelector = ElementProto.matches ||
    ElementProto.webkitMatchesSelector ||
    ElementProto.mozMatchesSelector ||
    ElementProto.msMatchesSelector ||
    ElementProto.oMatchesSelector || function(selector) {
        var nodeList = (this.parentNode || document).querySelectorAll(selector) || [];
        return !!~utils.indexOf(nodeList, this);
    }

var elementAddEventListener = ElementProto.addEventListener || function(eventName, listener) {
    return this.attachEvent('on' + eventName, listener);
}
var elementRemoveEventListener = ElementProto.removeEventListener || function(eventName, listener) {
    return this.detachEvent('on' + eventName, listener);
}

export function extend (protoProps:Object, staticProps?:Object): any {
  var parent = this;
  var child;

  // The constructor function for the new subclass is either defined by you
  // (the "constructor" property in your `extend` definition), or defaulted
  // by us to simply call the parent's constructor.
  if (protoProps && utils.has(protoProps, 'constructor')) {
    child = protoProps.constructor;
  } else {
    child = function(){ return parent.apply(this, arguments); };
  }

  // Add static properties to the constructor function, if supplied.
  utils.extend(child, parent, staticProps);

  // Set the prototype chain to inherit from `parent`, without calling
  // `parent`'s constructor function.
  var Surrogate = function(){ this.constructor = child; };
  Surrogate.prototype = parent.prototype;
  child.prototype = new Surrogate;

  // Add prototype properties (instance properties) to the subclass,
  // if supplied.
  if (protoProps) utils.extend(child.prototype, protoProps);

  // Set a convenience property in case the parent's prototype is needed
  // later.
  child.__super__ = parent.prototype;

  return child;
}


export module html {
  export function matches(elm, selector): boolean {
      return matchesSelector.call(elm, selector)
  }

  export function addEventListener(elm: Element, eventName: string, listener, useCap:boolean=false) {
    elementAddEventListener.call(elm, eventName, listener, useCap)
  }

  export function removeEventListener(elm: Element, eventName: string, listener) {
    elementRemoveEventListener.call(elm, eventName, listener)
  }

  export function addClass(elm: HTMLElement, className:string) {
    if (elm.classList)
      elm.classList.add(className)
    else {
      elm.className = elm.className.split(' ').concat(className.split(' ')).join(' ')
    }
  }
  export function removeClass(elm: HTMLElement, className:string) {
    if (elm.classList)
      elm.classList.remove(className)
    else {
      elm.className = elm.className.split(' ').concat(className.split(' ')).join(' ')
    }
  }
  
  export function selectionStart(elm: HTMLInputElement): number {
    if ('selectionStart' in elm) {
      // Standard-compliant browsers
      return elm.selectionStart;
    } else if ((<any>document).selection) {
      // IE
      elm.focus();
      var sel = (<any>document).selection.createRange();
      var selLen = (<any>document).selection.createRange().text.length;
      sel.moveStart('character', -elm.value.length);
      return sel.text.length - selLen;
    }
  }
}

const nativeBind = Function.prototype.bind
const noop = function () {}
let idCounter = 0



/** @module utils */
export module utils {


  export function camelcase(input) {
	   return input.toLowerCase().replace(/-(.)/g, function(match, group1) {
		    return group1.toUpperCase();
	   });
  };

  /** Generate an unique id with an optional prefix
   * @param {string} prefix
   * @return {string}
   */
  export function uniqueId (prefix=''): string {
    return prefix + (++idCounter)
  }

  export function isObject (obj:any): boolean {
    return obj === Object(obj);
  }

  export function extend (obj: Object, ...args:Object[]): any {
    if (!utils.isObject(obj)) return obj
    let o, k
    for (o of args) {
      if (!utils.isObject(o)) continue
      for (k in o) {
        if (utils.has(o,k)) obj[k] = o[k]
      }
    }
    return obj
  }

  export function pick (obj: Object, props: string[]) : any {
    let out = {}, prop
    for (prop of props) {
      if (utils.has(obj, prop)) out[prop] = obj[prop]
    }
    return out
  }

  export function has (obj, prop): boolean {
    return Object.prototype.hasOwnProperty.call(obj, prop)
  }

  export function indexOf(array, item): number {
      for (var i = 0, len = array.length; i < len; i++) if (array[i] === item) return i;
      return -1;
  }
  export function result(obj:any, prop:string, ctx?: any, args?: any[]): any {
    let ret = obj[prop]
    return (typeof ret === 'function') ? utils.call(ret,ctx,args||[]) : ret

  }

  export function values<T> (obj:Object): T[] {
  	let output = []

  	for (let k in obj) if (utils.has(obj, k)) {
  		output.push(obj[k])
  	}
  	return output
  }

  export function find<T>(array:T[], callback:(item: T, index?:number) => boolean, ctx?:any): T {
  	let i, v
  	for (i=0;i<array.length;i++) {
  		v = array[i]
  		if (callback.call(ctx,v)) return v
  	}
  	return null
  }

  export function proxy (from, to, fns) {
		if (!Array.isArray(fns)) fns = [fns];
		fns.forEach(function(fn) {
			if (typeof to[fn] === 'function') {
				from[fn] =  utils.bind(to[fn],to);
			}
		});
	}

  export function bind(method: Function, context: any, ...args:any[]): Function   {
    if (typeof method !== 'function') throw new Error('method not at function')

    if (nativeBind != null) return nativeBind.call(method, context, ...args)

    args = args||[]

    let fnoop = function () {}

    let fBound  = function() {
         let ctx = this instanceof fnoop ? this : context
         return utils.call(method, ctx, args.concat(utils.slice(arguments)))
    }

    fnoop.prototype = this.prototype
    fBound.prototype = new fnoop()

    return fBound
  }

  export function call (fn: Function, ctx: any, args: any[] = []): any {
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
        return fn.call(ctx,args[0], args[1], args[2], args[3], args[4])
      default:
        return fn.apply(ctx, args);
    }
  }

  export function slice (array:any): any {
    return Array.prototype.slice.call(array)
  }



  export function equal (a: any, b: any): boolean {
    return eq(a, b, [], [])
  }

  export function triggerMethodOn (obj:any, eventName:string, args?: any[]) {

    let ev = camelcase("on-" + eventName.replace(':','-'))


    if (obj[ev] && typeof obj[ev] === 'function') {

      utils.call(obj[ev], obj, args)
    }

    if (typeof obj.trigger === 'function') {
        args = [eventName].concat(args)
       utils.call(obj.trigger, obj, args)
    }
  }

  export function getOption(option: string, objs:any[]): any {

    for (let o of objs) {
      if (isObject(o) && o[option]) return o[option]
    }

    return null
  }

  export function sortBy<T> (obj:T[], value:string|Function, context?:any): T[] {
    var iterator = typeof value === 'function' ? value : function(obj:any){ return obj[<string>value]; };
    return obj
      .map(function(value, index, list) {
        return {
          value: value,
          index: index,
          criteria: iterator.call(context, value, index, list)
        };
      })
      .sort(function(left, right) {
        var a = left.criteria;
        var b = right.criteria;
        if (a !== b) {
          if (a > b || a === void 0) return 1;
          if (a < b || b === void 0) return -1;
        }
        return left.index - right.index;
      })
      .map(function(item) {
        return item.value;
      });
  }

  // Promises
  export function isPromise (obj): boolean {
    return obj && typeof obj.then === 'function';
  }

  export function toPromise(obj) {
    /* jshint validthis:true */
    if (!obj) {
      return obj;
    } if (isPromise(obj)) {
      return obj;
    } if ("function" == typeof obj) {
      return thunkToPromise.call(this, obj);
    } if (Array.isArray(obj)) {
      return arrayToPromise.call(this, obj);
    } if (isObject(obj)) {
      return objectToPromise.call(this, obj);
    } return Promise.resolve(obj);
  }

  /**
   * Convert a thunk to a promise.
   *
   * @param {Function}
   * @return {Promise}
   * @api private
   */

  export function thunkToPromise(fn) {
    /* jshint validthis:true */
    var ctx = this;
    return new Promise(function (resolve, reject) {
      fn.call(ctx, function (err, res) {
        if (err) return reject(err);
        if (arguments.length > 2) res = slice.call(arguments, 1);
        resolve(res);
      });
    });
  }

  /**
   * Convert an array of "yieldables" to a promise.
   * Uses `Promise.all()` internally.
   *
   * @param {Array} obj
   * @return {Promise}
   * @api private
   */

  export function arrayToPromise(obj) {
    /* jshint validthis:true */
    return Promise.all(obj.map(toPromise, this));
  }

  /**
   * Convert an object of "yieldables" to a promise.
   * Uses `Promise.all()` internally.
   *
   * @param {Object} obj
   * @return {Promise}
   * @api private
   */

  export function objectToPromise(obj) {
    /* jshint validthis:true */
    var results = new obj.constructor();
    var keys = Object.keys(obj);
    var promises = [];
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var promise = toPromise.call(this, obj[key]);
      if (promise && isPromise(promise)) defer(promise, key);else results[key] = obj[key];
    }
    return Promise.all(promises).then(function () {
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

  export interface Deferred<T> {
    promise: Promise<T>
    resolve: (result:T) => void
    reject: (error:Error) => void
    done: (error:Error, result:T) => void
  }
  export function deferred<T>(fn?, ctx?, ...args: any[]): Deferred<T>|Promise<T> {
    let ret: any = {};
    ret.promise = new Promise(function(resolve, reject) {
      ret.resolve = resolve;
      ret.reject = reject;
      ret.done = function(err, result) { if (err) return reject(err); else resolve(result); };
    });

    if (typeof fn === 'function') {

      fn.apply(ctx, args.concat([ret.done]));
      return ret.promise;
    }
    return ret;

  };

  export function callback<T>(promise: Promise<T>, callback: (error: Error, result: T) => void, ctx?: any) {
    promise.then(function(result) {
      callback.call(ctx, null, result);
    }).catch(function(err) {
      callback.call(ctx, err);
    });
  }

  export function delay<T>(timeout): Promise<T> {
    let defer: Deferred<T> = <Deferred<T>>deferred();
    setTimeout(defer.resolve, timeout);
    return defer.promise;
  };


}


function eq (a, b, aStack, bStack): boolean {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a == 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    //if (a instanceof _) a = a._wrapped;
    //if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className != toString.call(b)) return false;
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
    if (typeof a != 'object' || typeof b != 'object') return false;
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] == a) return bStack[length] == b;
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
          if (!(result = eq(a[size], b[size], aStack, bStack))) break;
        }
      }
    } else {
      // Deep compare objects.
      for (var key in a) {
        if (utils.has(a, key)) {
          // Count the expected number of properties.
          size++;
          // Deep compare each member.
          if (!(result = utils.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
        }
      }
      // Ensure that both objects contain the same number of properties.
      if (result) {
        for (key in b) {
          if (utils.has(b, key) && !(size--)) break;
        }
        result = !size;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return result;
  };
