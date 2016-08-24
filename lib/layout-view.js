"use strict";
/*global View, RegionManager, Region*/
const view_1 = require('./view');
const region_manager_1 = require('./region-manager');
const orange_1 = require('orange');
const region_1 = require('./region');
class LayoutView extends view_1.View {
    /**
     * LayoutView
     * @param {Object} options options
     * @constructor LayoutView
     * @extends TemplateView
     */
    constructor(options) {
        super(options);
        // Set region manager
        this._regionManager = new region_manager_1.RegionManager();
        orange_1.proxy(this, this._regionManager, ['removeRegion', 'removeRegions']);
        this._regions = this.getOption('regions', options || {});
    }
    get regions() {
        return this._regionManager.regions;
    }
    render(options) {
        this.triggerMethod('before:render');
        super.render({ silent: true });
        this.addRegion(this._regions || {});
        this.triggerMethod('render');
        return this;
    }
    /**
     * Add one or more regions to the view
     * @param {string|RegionMap} name
     * @param {Object|string|HTMLElement} def
     */
    addRegion(name, def) {
        let regions = {};
        if (typeof name === 'string') {
            if (def == null)
                throw new Error('add region');
            regions[name] = def;
        }
        else {
            regions = name;
        }
        for (let k in regions) {
            let region = region_1.Region.buildRegion(regions[k], this.el);
            this._regionManager.addRegion(k, region);
        }
    }
    /**
     * Delete one or more regions from the the layoutview
     * @param {string|Array<string>} name
     */
    removeRegion(name) {
        this._regionManager.removeRegion(name);
    }
    destroy() {
        super.destroy();
        this._regionManager.destroy();
    }
}
exports.LayoutView = LayoutView;
