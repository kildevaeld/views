var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var object_1 = require('./object');
var utils_1 = require('./utils');
var model_1 = require('./model');
var setOptions = { add: true, remove: true, merge: true };
var addOptions = { add: true, remove: false };
var Collection = (function (_super) {
    __extends(Collection, _super);
    function Collection(models, options) {
        if (options === void 0) { options = {}; }
        this.options = options;
        if (this.options.model) {
            this.Model = this.options.model;
        }
        //this._byId = {};
        if (models) {
            this.add(models);
        }
        _super.call(this);
    }
    Object.defineProperty(Collection.prototype, "length", {
        /**
         * The length of the collection
         * @property {Number} length
         */
        get: function () {
            return this.models.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Collection.prototype, "Model", {
        get: function () {
            if (!this._model) {
                this._model = model_1.Model;
            }
            return this._model;
        },
        set: function (con) {
            this._model = con;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Collection.prototype, "models", {
        get: function () {
            return this._models || (this._models = []);
        },
        enumerable: true,
        configurable: true
    });
    Collection.prototype.add = function (models, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        if (!Array.isArray(models)) {
            if (!(models instanceof this.Model)) {
                models = this.create(models, { add: false });
            }
        }
        else {
            models = models.map(function (item) {
                return (item instanceof _this.Model) ? item : _this.create(item, { add: false });
            });
        }
        this.set(models, utils_1.utils.extend({ merge: false }, options, addOptions));
    };
    Collection.prototype.set = function (items, options) {
        if (options === void 0) { options = {}; }
        options = utils_1.utils.extend({}, setOptions, options);
        if (options.parse)
            items = this.parse(items, options);
        var singular = !Array.isArray(items);
        var models = (singular ? (items ? [items] : []) : items.slice());
        var i, l, id, model, attrs, existing, sort;
        var at = options.at;
        //var targetModel = this.model;
        var sortable = this.comparator && (at == null) && options.sort !== false;
        var sortAttr = typeof this.comparator === 'string' ? this.comparator : null;
        var toAdd = [], toRemove = [], modelMap = {};
        var add = options.add, merge = options.merge, remove = options.remove;
        var order = !sortable && add && remove ? [] : null;
        // Turn bare objects into model references, and prevent invalid models
        // from being added.
        for (i = 0, l = models.length; i < l; i++) {
            model = models[i];
            id = model.get(model.idAttribute) || model.uid;
            // If a duplicate is found, prevent it from being added and
            // optionally merge it into the existing model.
            if (existing = this.get(id)) {
                if (remove)
                    modelMap[existing.uid] = true;
                if (merge) {
                    attrs = model.toJSON();
                    //if (options.parse) attrs = existing.parse(attrs, options);
                    existing.set(attrs, options);
                    if (sortable && !sort && existing.hasChanged(sortAttr))
                        sort = true;
                }
                models[i] = existing;
            }
            else if (add) {
                models[i] = model; //this._prepareModel(attrs, options);
                if (!model)
                    continue;
                toAdd.push(model);
                this._addReference(model, options);
            }
            // Do not add multiple models with the same `id`.
            model = existing || model;
            if (order && !modelMap[model.id])
                order.push(model);
            modelMap[model.uid] = true;
        }
        // Remove nonexistent models if appropriate.
        if (remove) {
            for (i = 0, l = this.length; i < l; ++i) {
                if (!modelMap[(model = this.models[i]).uid])
                    toRemove.push(model);
            }
            if (toRemove.length)
                this.remove(toRemove, options);
        }
        // See if sorting is needed, update `length` and splice in new models.
        if (toAdd.length || (order && order.length)) {
            if (sortable)
                sort = true;
            this.length += toAdd.length;
            if (at != null) {
                for (i = 0, l = toAdd.length; i < l; i++) {
                    this.models.splice(at + i, 0, toAdd[i]);
                }
            }
            else {
                if (order)
                    this.models.length = 0;
                var orderedModels = order || toAdd;
                for (i = 0, l = orderedModels.length; i < l; i++) {
                    this.models.push(orderedModels[i]);
                }
            }
        }
        // Silently sort the collection if appropriate.
        if (sort)
            this.sort({ silent: true });
        // Unless silenced, it's time to fire all appropriate add/sort events.
        if (!options.silent) {
            for (i = 0, l = toAdd.length; i < l; i++) {
                (model = toAdd[i]).trigger('add', model, this, options);
            }
            if (sort || (order && order.length))
                this.trigger('sort', this, options);
        }
        // Return the added (or merged) model (or models).
        return singular ? models[0] : models;
    };
    Collection.prototype.remove = function (models, options) {
        if (options === void 0) { options = {}; }
        var singular = !Array.isArray(models);
        models = (singular ? [models] : models.slice());
        var i, l, index, model;
        for (i = 0, l = models.length; i < l; i++) {
            model = models[i] = this.get(models[i]);
            if (!model)
                continue;
            index = this.indexOf(model);
            this.models.splice(index, 1);
            if (!options.silent) {
                options.index = index;
                model.trigger('remove', model, this, options);
            }
            this._removeReference(model, options);
        }
        return singular ? models[0] : models;
    };
    Collection.prototype.get = function (id) {
        return this.find(id);
    };
    // Get the model at the given index.
    Collection.prototype.at = function (index) {
        return this.models[index];
    };
    Collection.prototype.clone = function (options) {
        options = options || this.options;
        return new this.constructor(this.models, options);
    };
    Collection.prototype.sort = function (options) {
        if (options === void 0) { options = {}; }
        if (!this.comparator)
            throw new Error('Cannot sort a set without a comparator');
        // Run sort based on type of `comparator`.
        if (typeof this.comparator === 'string' || this.comparator.length === 1) {
            this._models = this.sortBy(this.comparator, this);
        }
        else {
            this.models.sort(this.comparator.bind(this));
        }
        if (!options.silent)
            this.trigger('sort', this, options);
        return this;
    };
    Collection.prototype.sortBy = function (key, context) {
        return utils_1.utils.sortBy(this._models, key, context);
    };
    Collection.prototype.push = function (model, options) {
        if (options === void 0) { options = {}; }
        return this.add(model, utils_1.utils.extend({ at: this.length }, options));
    };
    Collection.prototype.reset = function (models, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        this.forEach(function (model) {
            _this._removeReference(model, options);
        });
        options.previousModels = this.models;
        this._reset();
        models = this.add(models, options);
        if (!options.silent)
            this.trigger('reset', this, options);
        return models;
    };
    Collection.prototype.create = function (values, options) {
        if (options === void 0) { options = { add: true }; }
        var model = new this.Model(values, options);
        if (options.add)
            this.add(model);
        return model;
    };
    Collection.prototype.parse = function (models, options) {
        if (options === void 0) { options = {}; }
        return models;
    };
    Collection.prototype.find = function (nidOrFn) {
        var model;
        if (typeof nidOrFn === 'function') {
            model = utils_1.utils.find(this.models, nidOrFn);
        }
        else {
            model = utils_1.utils.find(this.models, function (model) {
                return model.id == nidOrFn || model.uid == nidOrFn;
            });
        }
        return model;
    };
    Collection.prototype.forEach = function (iterator, ctx) {
        for (var i = 0, l = this.models.length; i < l; i++) {
            iterator.call(ctx || this, this.models[i], i);
        }
        return this;
    };
    Collection.prototype.indexOf = function (model) {
        return this.models.indexOf(model);
    };
    Collection.prototype.toJSON = function () {
        return this.models.map(function (m) { return m.toJSON(); });
    };
    Collection.prototype.comparator = function () { };
    Collection.prototype._removeReference = function (model, options) {
        if (this === model.collection)
            delete model.collection;
        this.stopListening(model);
    };
    Collection.prototype._addReference = function (model, options) {
        if (!model.collection)
            model.collection = this;
        this.listenTo(model, 'all', this._onModelEvent);
    };
    Collection.prototype._reset = function () {
        this._models = [];
    };
    Collection.prototype._onModelEvent = function (event, model, collection, options) {
        if ((event === 'add' || event === 'remove') && collection !== this)
            return;
        if (event === 'destroy')
            this.remove(model, options);
        utils_1.utils.call(this.trigger, this, utils_1.utils.slice(arguments));
    };
    return Collection;
})(object_1.BaseObject);
exports.Collection = Collection;
