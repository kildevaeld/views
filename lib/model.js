var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var utils_1 = require('./utils');
var object_1 = require('.//object');
var Model = (function (_super) {
    __extends(Model, _super);
    function Model(attributes, options) {
        if (attributes === void 0) { attributes = {}; }
        if (options === void 0) { options = {}; }
        this._attributes = attributes;
        this.uid = utils_1.utils.uniqueId('uid');
        this._changed = {};
        this.collection = options.collection;
        _super.call(this);
    }
    Object.defineProperty(Model.prototype, "id", {
        get: function () {
            if (this.idAttribute in this._attributes)
                return this._attributes[this.idAttribute];
            return this.uid;
        },
        enumerable: true,
        configurable: true
    });
    Model.prototype.set = function (key, val, options) {
        if (options === void 0) { options = {}; }
        var attr, attrs = {}, unset, changes, silent, changing, prev, current;
        if (key == null)
            return this;
        // Handle both `"key", value` and `{key: value}` -style arguments.
        if (typeof key === 'object') {
            attrs = key;
            options = val;
        }
        else {
            attrs[key] = val;
        }
        options || (options = {});
        // Run validation.
        //if (!this._validate(attrs, options)) return false;
        // Extract attributes and options.
        unset = options.unset;
        silent = options.silent;
        changes = [];
        changing = this._changing;
        this._changing = true;
        if (!changing) {
            this._previousAttributes = utils_1.utils.extend(Object.create(null), this._attributes);
            this._changed = {};
        }
        current = this._attributes, prev = this._previousAttributes;
        // For each `set` attribute, update or delete the current value.
        for (attr in attrs) {
            val = attrs[attr];
            if (!utils_1.utils.equal(current[attr], val))
                changes.push(attr);
            if (!utils_1.utils.equal(prev[attr], val)) {
                this._changed[attr] = val;
            }
            else {
                delete this._changed[attr];
            }
            unset ? delete current[attr] : current[attr] = val;
        }
        // Trigger all relevant attribute changes.
        if (!silent) {
            if (changes.length)
                this._pending = !!options;
            for (var i = 0, l = changes.length; i < l; i++) {
                this.trigger('change:' + changes[i], this, current[changes[i]], options);
            }
        }
        // You might be wondering why there's a `while` loop here. Changes can
        // be recursively nested within `"change"` events.
        if (changing)
            return this;
        if (!silent) {
            while (this._pending) {
                options = this._pending;
                this._pending = false;
                this.trigger('change', this, options);
            }
        }
        this._pending = false;
        this._changing = false;
        return this;
    };
    Model.prototype.get = function (key) {
        return this._attributes[key];
    };
    Model.prototype.unset = function (key, options) {
        this.set(key, void 0, utils_1.utils.extend({}, options, { unset: true }));
    };
    Model.prototype.has = function (attr) {
        return this.get(attr) != null;
    };
    Model.prototype.hasChanged = function (attr) {
        if (attr == null)
            return !!Object.keys(this.changed).length;
        return utils_1.utils.has(this.changed, attr);
    };
    Model.prototype.clear = function (options) {
        var attrs = {};
        for (var key in this._attributes)
            attrs[key] = void 0;
        return this.set(attrs, utils_1.utils.extend({}, options, { unset: true }));
    };
    Object.defineProperty(Model.prototype, "changed", {
        get: function () {
            return utils_1.utils.extend({}, this._changed);
        },
        enumerable: true,
        configurable: true
    });
    // Return an object containing all the attributes that have changed, or
    // false if there are no changed attributes. Useful for determining what
    // parts of a view need to be updated and/or what attributes need to be
    // persisted to the server. Unset attributes will be set to undefined.
    // You can also pass an attributes object to diff against the model,
    // determining if there *would be* a change.
    Model.prototype.changedAttributes = function (diff) {
        if (!diff)
            return this.hasChanged() ? utils_1.utils.extend(Object.create(null), this.changed) : false;
        var val, changed = {};
        var old = this._changing ? this._previousAttributes : this._attributes;
        for (var attr in diff) {
            if (utils_1.utils.equal(old[attr], (val = diff[attr])))
                continue;
            (changed || (changed = {}))[attr] = val;
        }
        return changed;
    };
    // Get the previous value of an attribute, recorded at the time the last
    // `"change"` event was fired.
    Model.prototype.previous = function (attr) {
        if (attr == null || !this._previousAttributes)
            return null;
        return this._previousAttributes[attr];
    };
    // Get all of the attributes of the model at the time of the previous
    // `"change"` event.
    Model.prototype.previousAttributes = function () {
        return utils_1.utils.extend(Object.create(null), this._previousAttributes);
    };
    Model.prototype.toJSON = function () {
        return JSON.parse(JSON.stringify(this._attributes));
    };
    return Model;
})(object_1.BaseObject);
exports.Model = Model;
