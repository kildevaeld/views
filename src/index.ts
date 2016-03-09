import {IView, BaseView} from './baseview';
export * from './object';
export * from './baseview';
export * from './region'
export * from './region-manager'
export * from './layout-view'
export * from './view'
export * from './collection-view'
export * from './types'
export * from './annotations'

export function debug (debug:boolean) {
    
    if (window.localStorage) {
        window.localStorage['debug'] = debug ? "views:*" : '';
    }
}
//export {Collection, ICollection,IModel,Model} from 'collection'

export function isView(a:any): a is IView {
    return a instanceof BaseView; 
}