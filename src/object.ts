declare var require: any;
import * as Debug from 'debug';
const debug = Debug('views:object');

import {EventEmitter} from 'eventsjs'
import {inherits, slice, triggerMethodOn, getOption} from 'orange';



/** Base object */
export class BaseObject extends EventEmitter {
  
  static extend = function <T>(proto:any,stat?:any): T {
    return inherits(this, proto, stat);
  }
  
  name: string;

  private _isDestroyed: boolean = false
  /**
   * Object
   * @extends EventEmitter
   */
  constructor (args?:any) {
    super();
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

    debug("%s destroy", this);
    if (typeof Object.freeze) {
      //Object.freeze(this)
    }

    return this;
  }

  triggerMethod (eventName: string, ...args: any[]): any {
    triggerMethodOn(this, eventName, args);
    return this;
  }

  getOption (prop: string, ...args: Object[]): any {

    if ((<any>this).options) {
      args.push((<any>this).options);
    }

    if ((<any>this)._options) {
      args.push((<any>this)._options);
    }

    args.push(this);

    return getOption(prop, args);
  }
}
