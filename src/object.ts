import {EventEmitter} from './events'
import {utils, extend} from './utils';


export class BaseObject extends EventEmitter {

  static extend = extend

  private _isDestroyed: boolean

  constructor () {
    super()
    Object.defineProperty(this, '_isDestroyed', {
      enumerable: false,
      writable: true,
      configurable: false,
      value: false
    })
    
    
  }

  get isDestroyed () {
    return this._isDestroyed
  }

  destroy (): any {
    if (this.isDestroyed) return this

    this.triggerMethod('before:destroy')

    this.stopListening()
    this.off()
    this._isDestroyed = false

    this.triggerMethod('destroy')

    return this
  }

  triggerMethod (eventName: string, ...args: any[]): any {
    utils.triggerMethodOn(this, eventName, args)
    return this
  }

  getOption (prop: string, ...args: Object[]): any {
    /*let self = <any>this
    for (let o of args) {
      if (utils.has(o, prop)) return o[prop]
    }
    let options = self.options
    if (options && utils.isObject(options) && utils.has(options, prop)) {
      return options[prop]
    }
    return self[prop]*/
    if ((<any>this).options) {
      args.push((<any>this).options)
    }
   
    args.push(this)
    
    return utils.getOption(prop, args)
  }
}
