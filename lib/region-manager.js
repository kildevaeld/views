/* global BaseClass, __has */
"use strict";
const object_1 = require('./object');
const region_1 = require('./region');
const utils = require('orange');
class RegionManager extends object_1.BaseObject {
    /** Region manager
     * @extends BaseObject
     */
    constructor() {
        super();
        this._regions = {};
    }
    /**
     * Regions
     * @type {string:Region}
     */
    get regions() {
        return this._regions;
    }
    /**
      * Add one or more regions to the region manager
      * @param {Object} regions
      */
    addRegions(regions) {
        let def, out = {}, keys = Object.keys(regions);
        keys.forEach(function (k) {
            def = regions[k];
            out[k] = this.addRegion(k, def);
        }, this);
        return out;
    }
    /**
     * Add a region to the RegionManager
     * @param {String} name   The name of the regions
     * @param {String|Object|Region|HTMLElement} def The region to associate with the name and the RegionManager
     */
    addRegion(name, def) {
        let region = region_1.Region.buildRegion(def);
        this._setRegion(name, region);
        return region;
    }
    /**
     * Remove one or more regions from the manager
     * @param {...name} name A array of region names
     */
    removeRegion(names) {
        if (typeof names === 'string') {
            names = [names];
        }
        names.forEach(function (name) {
            if (utils.has(this.regions, name)) {
                let region = this.regions[name];
                region.destroy();
                this._unsetRegion(name);
            }
        }, this);
    }
    /**
     * Destroy the regionmanager
     */
    destroy() {
        this.removeRegions();
        super.destroy();
    }
    /**
     * Remove all regions from the manager
     */
    removeRegions() {
        utils.callFunc(this.removeRegion, this, Object.keys(this._regions));
    }
    /**
     * @private
     */
    _setRegion(name, region) {
        if (this._regions[name]) {
            this._regions[name].destroy();
        }
        this._regions[name] = region;
    }
    /**
     * @private
     */
    _unsetRegion(name) {
        delete this._regions[name];
    }
}
exports.RegionManager = RegionManager;
