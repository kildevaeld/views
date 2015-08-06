
import * as base from './baseview'
import {utils} from './utils'

const kUIRegExp = /@ui.([a-zA-Z_\-\$#]+)/i

export function normalizeUIKeys (obj:any): any {
  /*jshint -W030 */
    let o = {}, k, v, ms, sel, ui;

    for (k in obj) {
      v = obj[k];
      if ((ms = kUIRegExp.exec(k)) !== null) {
        ui = ms[1], sel = this._ui[ui];
        if (sel != null) {
          k = k.replace(ms[0], sel);
        }
      }
      o[k] = v;
    }

    return o;
}
export type UIMap = { [key:string]: HTMLElement }

export interface ViewOptions extends base.BaseViewOptions {
  ui?: {[key:string]: string}|Function
}

export class View<T extends HTMLElement> extends base.BaseView<T> {

  ui: UIMap = {}
  
  private _ui: {[key:string]: string}

  delegateEvents (events?:any) {

    this.bindUIElements()

    events = events || this.events;
    events = normalizeUIKeys.call(this, events)

    super.delegateEvents(events)

    return this

  }

  /*constructor (options?: ViewOptions) {
    super(options)
  }*/

  undelegateEvents (): any {
    this.unbindUIElements()
    super.undelegateEvents()
    return this
  }

  /* UI Elements */
  bindUIElements() {

    let ui = this.getOption('ui') //this.options.ui||this.ui
    if (!ui) return;

    if (!this._ui) {
      this._ui = ui;
    }

    ui = utils.result(this, '_ui');

    this.ui = {};

    Object.keys(ui).forEach( (k) => {
      let elm: any = this.$(ui[k]);
      if (elm && elm.length) {
        // unwrap if it's a nodelist.
        if (elm instanceof NodeList) {
          elm = elm[0]
        }
        this.ui[k] = elm;
      }
    });

  }

  unbindUIElements () {
    this.ui = {}
  }
  
  
}

module views {



}
