var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/*global View, RegionManager, Region*/
var templateview_1 = require('./templateview');
var region_manager_1 = require('./region-manager');
var utils_1 = require('./utils');
var region_1 = require('./region');
var LayoutView = (function (_super) {
    __extends(LayoutView, _super);
    /**
     * LayoutView
     * @param {Object} options options
     * @constructor LayoutView
     * @extends TemplateView
     */
    function LayoutView(options) {
        //this.options = options || {};
        var regions = this.getOption('regions');
        // Set region manager
        this._regionManager = new region_manager_1.RegionManager();
        utils_1.utils.proxy(this, this._regionManager, ['removeRegion', 'removeRegions']);
        //this.options = options || {};
        this.listenTo(this, 'render', function () {
            this.addRegions(regions);
        });
        _super.call(this, options);
    }
    Object.defineProperty(LayoutView.prototype, "regions", {
        get: function () {
            return this._regionManager.regions;
        },
        enumerable: true,
        configurable: true
    });
    LayoutView.prototype.addRegion = function (name, def) {
        if (typeof def === 'string') {
            var elm = this.$(def);
            if (!elm)
                throw new Error('element must exists in dom');
            def = new region_1.Region({
                el: elm[0]
            });
        }
        this._regionManager.addRegion(name, def);
    };
    LayoutView.prototype.addRegions = function (regions) {
        for (var k in regions) {
            this.addRegion(k, regions[k]);
        }
    };
    LayoutView.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        this._regionManager.destroy();
    };
    return LayoutView;
})(templateview_1.TemplateView);
