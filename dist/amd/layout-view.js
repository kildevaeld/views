var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", './view', './region-manager', 'orange', './region'], function (require, exports, view_1, region_manager_1, orange_1, region_1) {
    "use strict";
    var LayoutView = (function (_super) {
        __extends(LayoutView, _super);
        /**
         * LayoutView
         * @param {Object} options options
         * @constructor LayoutView
         * @extends TemplateView
         */
        function LayoutView(options) {
            _super.call(this, options);
            // Set region manager
            this._regionManager = new region_manager_1.RegionManager();
            orange_1.proxy(this, this._regionManager, ['removeRegion', 'removeRegions']);
            this._regions = this.getOption('regions', options || {});
        }
        Object.defineProperty(LayoutView.prototype, "regions", {
            get: function () {
                return this._regionManager.regions;
            },
            enumerable: true,
            configurable: true
        });
        LayoutView.prototype.render = function (options) {
            this.triggerMethod('before:render');
            _super.prototype.render.call(this, { silent: true });
            this.addRegion(this._regions || {});
            this.triggerMethod('render');
            return this;
        };
        /**
         * Add one or more regions to the view
         * @param {string|RegionMap} name
         * @param {Object|string|HTMLElement} def
         */
        LayoutView.prototype.addRegion = function (name, def) {
            var regions = {};
            if (typeof name === 'string') {
                if (def == null)
                    throw new Error('add region');
                regions[name] = def;
            }
            else {
                regions = name;
            }
            for (var k in regions) {
                var region = region_1.Region.buildRegion(regions[k], this.el);
                this._regionManager.addRegion(k, region);
            }
        };
        /**
         * Delete one or more regions from the the layoutview
         * @param {string|Array<string>} name
         */
        LayoutView.prototype.removeRegion = function (name) {
            this._regionManager.removeRegion(name);
        };
        LayoutView.prototype.destroy = function () {
            _super.prototype.destroy.call(this);
            this._regionManager.destroy();
        };
        return LayoutView;
    }(view_1.View));
    exports.LayoutView = LayoutView;
});
