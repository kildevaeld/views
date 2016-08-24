"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
const baseview_1 = require('./baseview');
__export(require('./object'));
__export(require('./baseview'));
__export(require('./region'));
__export(require('./region-manager'));
__export(require('./layout-view'));
__export(require('./view'));
__export(require('./collection-view'));
__export(require('./annotations'));
exports.Version = '0.2.14';
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
