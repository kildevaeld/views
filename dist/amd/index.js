define(["require", "exports", './baseview', './object', './baseview', './region', './region-manager', './layout-view', './view', './collection-view', './annotations'], function (require, exports, baseview_1, object_1, baseview_2, region_1, region_manager_1, layout_view_1, view_1, collection_view_1, annotations_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    __export(object_1);
    __export(baseview_2);
    __export(region_1);
    __export(region_manager_1);
    __export(layout_view_1);
    __export(view_1);
    __export(collection_view_1);
    __export(annotations_1);
    exports.Version = '0.3.3';
    function debug(debug) {
        if (window.localStorage) {
            window.localStorage['debug'] = debug ? "views:*" : '';
        }
    }
    exports.debug = debug;
    //export {Collection, ICollection,IModel,Model} from 'collection'
    function isView(a) {
        return a instanceof baseview_1.BaseView;
    }
    exports.isView = isView;
});
