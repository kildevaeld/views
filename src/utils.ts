
var ElementProto: any = (typeof Element !== 'undefined' && Element.prototype) || {};


var matchesSelector = ElementProto.matches ||
    ElementProto.webkitMatchesSelector ||
    ElementProto.mozMatchesSelector ||
    ElementProto.msMatchesSelector ||
    ElementProto.oMatchesSelector || function(selector) {
        var nodeList = (this.parentNode || document).querySelectorAll(selector) || [];
        return !!~views.utils.indexOf(nodeList, this);
    }

var elementAddEventListener = ElementProto.addEventListener || function(eventName, listener) {
    return this.attachEvent('on' + eventName, listener);
}
var elementRemoveEventListener = ElementProto.removeEventListener || function(eventName, listener) {
    return this.detachEvent('on' + eventName, listener);
}

module views {

  export function extend (protoProps, staticProps): any {
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
      elm.classList.add(<string>className)
    }
    export function removeClass(elm: HTMLElement, className:string) {
      elm.classList.remove(className)
    }
  }

  const nativeBind = Function.prototype.bind
  const noop = function () {}
  let idCounter = 0

  export module utils {
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

    export function call (fn: Function, ctx: any, args: any[]): any {
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

    export function uniqueId (prefix=''): string {
      return prefix + (++idCounter)
    }
  }
}
