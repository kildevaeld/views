import {BaseObject} from './object';
import {IModel, ICollection} from './types';
import {utils} from './utils';

var setOptions = {add: true, remove: true, merge: true};
var addOptions = {add: true, remove: false};

export interface CollectionOptions {}

export interface Silenceable {
  silent?:boolean
}

export interface CollectionSetOptions extends Silenceable {
  at?:number
  sort?:boolean
  add?:boolean
  merge?:boolean
  remove?:boolean
  parse?:boolean
}

export interface CollectionRemoveOptions extends Silenceable {
  index?: number
}

export interface CollectionSortOptions extends Silenceable {
  
}

export interface CollectionResetOptions extends Silenceable {
  previousModels?: IModel[]
}

export class Collection<U extends IModel> extends BaseObject implements ICollection {
  public get length () {
		return this._models.length
	}
	public Model: new (attr:Object, options?:any) => U
  private _models:U[]
  //private _byId:any = {}
  
  //length: number = 0
  options: CollectionOptions
  
  get models (): U[] {
    return this._models;
  }

  constructor (models?:U[], options:CollectionOptions={}) {
    
    this.options = options;
    //this._byId = {};
    if (models) {
      this.add(models);
    }
		super();
  }

  add (models:U|U[], options:CollectionSetOptions={}) {
    this.set(models, utils.extend({merge:false}, options, addOptions));
  }

  set (items:U|U[], options: CollectionSetOptions={}) {
    options = utils.extend({}, setOptions, options);
    if (options.parse) items = this.parse(items, options);
    
		var singular = !Array.isArray(items);
    let models: U[] = <U[]>(singular ? (items ? [items] : []) : (<U[]>items).slice())
    
		var i, l, id, model: U, attrs, existing: U, sort;
    var at = options.at;
    //var targetModel = this.model;
    var sortable = this.comparator && (at == null) && options.sort !== false;
    var sortAttr = typeof this.comparator === 'string' ? this.comparator : null;
    var toAdd = [], toRemove = [], modelMap = {};
    var add = options.add, merge = options.merge, remove = options.remove;
    var order = !sortable && add && remove ? [] : null;

    // Turn bare objects into model references, and prevent invalid models
    // from being added.
    for (i = 0, l = (<U[]>models).length; i < l; i++) {
      model = models[i]
      /*if (attrs instanceof Model) {
        id = model = attrs;
      } else {
        id = 
      }*/
			id = model.uid
			
      // If a duplicate is found, prevent it from being added and
      // optionally merge it into the existing model.
      if (existing = this.get(id)) {
        if (remove) modelMap[existing.uid] = true;
        if (merge) {
          attrs = model.toJSON()
          //if (options.parse) attrs = existing.parse(attrs, options);
          existing.set(attrs, options);
          if (sortable && !sort && existing.hasChanged(sortAttr)) sort = true;
        }
        models[i] = existing;

      // If this is a new, valid model, push it to the `toAdd` list.
      } else if (add) {
        models[i] = model//this._prepareModel(attrs, options);
        if (!model) continue;
        toAdd.push(model);
        this._addReference(model, options);
      }

      // Do not add multiple models with the same `id`.
     /* model = existing || model;
      if (order && (model.isNew() || !modelMap[model.id])) order.push(model);
      modelMap[model.nid] = true;*/
    }

    // Remove nonexistent models if appropriate.
    if (remove) {
      for (i = 0, l = this.length; i < l; ++i) {
        if (!modelMap[(model = this.models[i]).uid]) toRemove.push(model);
      }
      if (toRemove.length) this.remove(toRemove, options);
    }

    // See if sorting is needed, update `length` and splice in new models.
    if (toAdd.length || (order && order.length)) {
      if (sortable) sort = true;
      this.length += toAdd.length;
      if (at != null) {
        for (i = 0, l = toAdd.length; i < l; i++) {
          this.models.splice(at + i, 0, toAdd[i]);
        }
      } else {
        if (order) this.models.length = 0;
        var orderedModels = order || toAdd;
        for (i = 0, l = orderedModels.length; i < l; i++) {
          this.models.push(orderedModels[i]);
        }
      }
    }

    // Silently sort the collection if appropriate.
    if (sort) this.sort({silent: true});

    // Unless silenced, it's time to fire all appropriate add/sort events.
    if (!options.silent) {
      for (i = 0, l = toAdd.length; i < l; i++) {
        (model = toAdd[i]).trigger('add', model, this, options);
      }
      if (sort || (order && order.length)) this.trigger('sort', this, options);
    }

    // Return the added (or merged) model (or models).
    return singular ? models[0] : models;
  }

  remove (models, options: CollectionRemoveOptions={}) {
    var singular = !Array.isArray(models);
    models = singular ? [models] : models.slice();

    var i, l, index, model;
    for (i = 0, l = models.length; i < l; i++) {
      model = models[i] = this.get(models[i]);
      if (!model) continue;
      //delete this._byId[model.id];
      //delete this._byId[model.nid];
      index = this.indexOf(model);
      this.models.splice(index, 1);
      this.length--;
      if (!options.silent) {
        options.index = index;
        model.trigger('remove', model, this, options);
      }
      this._removeReference(model, options);
    }
    return singular ? models[0] : models;
  }

  get (id): U {
    
    return null
  }

  // Get the model at the given index.
  at (index) {
    return this.models[index];
  }

  clone (options?:CollectionOptions) {
    options = options||this.options
    return new (<any>this).constructor(this.models, options);
  }

  sort (options: CollectionSortOptions={}) {
    if (!this.comparator) throw new Error('Cannot sort a set without a comparator');


    // Run sort based on type of `comparator`.
    if (typeof this.comparator === 'string' || this.comparator.length === 1) {
      this._models = this.sortBy((<any>this.comparator), this);
    } else {
      this.models.sort(this.comparator.bind(this));
    }

    if (!options.silent) this.trigger('sort', this, options);
    return this;
  }

  sortBy (key: string|Function, context?: any): U[] {
    return utils.sortBy(this._models,key, context)
  }

  push (model, options={}) {
    return this.add(model, utils.extend({at:this.length}, options));
  }

  reset (models, options:CollectionResetOptions={}) {
    this.forEach((model) => {
      this._removeReference(model, options);
    });

    options.previousModels = this.models;
    this._reset();

    models = this.add(models, options);
    if (!options.silent) this.trigger('reset', this, options);

    return models;
  }

  create (values?:any, options?: any): IModel  {
    let model = new this.Model(values, options)
    this.add(model)
    return model
  }
  
  parse (models:U|U[], options: CollectionSetOptions={}): U|U[] {
    return models
  }

  find (nidOrFn) {
    let model;
    if (typeof nidOrFn === 'function') {
      model = utils.find<IModel>(this.models, nidOrFn);
    } else {
      model = utils.find<IModel>(this.models, function (model) {
        return model.uid == nidOrFn;
      });
    }

    return model;
  }

  forEach (iterator:(model:U, index?:number) => void, ctx?:any) {
    for (let i=0, l = this.models.length; i < l; i++) {
      iterator.call(ctx||this, this.models[i], i);   
    }
   
    return this;
  }
  
  indexOf (model:U): number {
    return this.models.indexOf(model)
  }

  toJSON () {
    return this.models.map(function (m) { return m.toJSON(); });
  }

  comparator () {
    
  }

  _removeReference (model:U, options?: any) {
    if (this === model.collection) delete model.collection;
    model.off('all', this._onModelEvent, this);
  }

  _addReference (model:IModel, options?:any) {
    //this._byId[model.nid] = model;
    //if (model.id != null) this._byId[model.id] = model;
    if (!model.collection) model.collection = this;
    model.on('all', this._onModelEvent, this);
  }

  /*_prepareModel (attrs, options) {
    if (attrs instanceof Model) return attrs;
    options = utils.extend({}, options);
    options.collection = this;
    var model = new (<any>this.model)(attrs, options);
    if (!model.validationError) return model;
    this.trigger('invalid', this, model.validationError, options);
    return false;
  }*/

  _reset () {
    this._models = [];
    //this._byId = Object.create(null);
  }

  _onModelEvent (event, model, collection, options) {
    if ((event === 'add' || event === 'remove') && collection !== this) return;
    if (event === 'destroy') this.remove(model, options);
    /*if (model && event === 'change:' + model.idAttribute) {
      delete this._byId[model.previous(model.idAttribute)];
      if (model.id != null) this._byId[model.id] = model;
    }*/
    this.trigger.apply(this, arguments);
  }


}
