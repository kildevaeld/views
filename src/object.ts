import {EventEmitter} from './events'
import {utils, extend} from './utils';

/** Base object */
export class BaseObject extends EventEmitter {

  static extend = extend

  private _isDestroyed: boolean = false
  /**
   * Object
   * @extends EventEmitter
   */
  constructor (args?:any) {
    super()

    if (typeof (<any>this).initialize === 'function') {
      utils.call((<any>this).initialize, this, utils.slice(arguments))
    }

  }

  /**
   * Whether the object is "destroyed" or not
   * @type boolean
   */
  get isDestroyed (): boolean {
    return this._isDestroyed
  }

  destroy (): any {
    if (this.isDestroyed) return this

    this.triggerMethod('before:destroy')

    this.stopListening()
    this.off()
    this._isDestroyed = true

    this.triggerMethod('destroy')

    if (typeof Object.freeze) {
      Object.freeze(this)
    }

    return this
  }

  triggerMethod (eventName: string, ...args: any[]): any {
    utils.triggerMethodOn(this, eventName, args)
    return this
  }

  getOption (prop: string, ...args: Object[]): any {

    if ((<any>this).options) {
      args.push((<any>this).options)
    }

    if ((<any>this)._options) {
      args.push((<any>this)._options)
    }

    args.push(this)

    return utils.getOption(prop, args)
  }
}
