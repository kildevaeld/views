import {EventEmitter} from './events'
import {utils, extend} from './utils';


export class BaseObject extends EventEmitter {

  static extend = extend

  private _isDestroyed: boolean = false

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

  triggerMethod (eventName: string, ...args: string[]): any {
    let ev = "on" + eventName
    utils
    if ((<any>this)[ev]) {
      utils.call(this[ev], this, args)
    }
    utils.call(this.trigger, this, args)

    return this
  }

  getOption (prop: string, ...args: Object[]): any {
    let self = <any>this
    for (let o of args) {
      if (utils.has(o, prop)) return o[prop]
    }
    let options = self.options
    if (options && utils.isObject(options) && utils.has(options, prop)) {
      return options[prop]
    }
    return self[prop]
  }
}
