import {TemplateView} from '../templateview'
import {IModel} from '../types'
import {normalizeUIKeys} from '../view'
import {utils} from '../utils'

export class DataView<T extends HTMLElement> extends TemplateView<T> {
	
	private _model: IModel
	private _dataEvents: any
	public get model () { return this._model }
	
	public set model (model) {
		this.setModel(model)
	}
	
	public setModel (model) {
		if (this._model === model) return
    
    this.triggerMethod('before:model', this._model, model)
		
    if (this._model) {
			this.stopListening(this._model)
		}
		
		this._model = model
	  
    this.triggerMethod('model', model)
  }
  
  public getTemplateData (): any {
    return this.model ? this.model.toJSON() : {}
  }
	
	public delegateEvents (events?:any): any {
		events = events||this.events
		events = normalizeUIKeys(events)
	
		let {c,e,m} = this._filterEvents(events)
		
		super.delegateEvents(e)
		this._delegateDataEvents(m,c)	
		
		return this
	}
	
	public undelegateEvents() {
		this._undelegateDataEvents()
		super.undelegateEvents()
		return this
	}
	
	private _delegateDataEvents (model:any, collection:any) {
		
		this._dataEvents = {};
    let fn = (item, ev) => {

      if (!this[item]) return {};
      let out = {}, k, f;

      for (k in ev) {
        f = utils.bind(ev[k], this);
        this[item].on(k,f);
        out[item+":"+k] = f;
      }

      return out;
    };

    utils.extend(this._dataEvents,
      fn('model',model),
      fn('collection',collection));
		
	}
	
	private _undelegateDataEvents () {
		if (!this._dataEvents) return;
    let k, v;
    for (k in this._dataEvents) {
      v = this._dataEvents[k];
      let [item, ev] = k.split(':');
      if (!this[item]) continue;
     
      this[item].off(ev, v);
      //this.stopListening(this[item],ev, v);
    }
    delete this._dataEvents;
	}
	
	
	
	private _filterEvents (obj:any) {
    /*jshint -W030 */
    let c = {}, m = {}, e = {}, k, v;
    for (k in obj) {
      let [ev,t] = k.split(' ');
      ev = ev.trim(), t = t ? t.trim() : "", v = obj[k];
      if (t === 'collection') {
        c[ev] = v;
      } else if (t === 'model') {
        m[ev] = v;
      } else {
        e[k] = v;
      }
    }
    return {c,m,e};
  }

	
}