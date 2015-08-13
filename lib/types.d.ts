import { IEventEmitter } from './events';
import { IView } from './baseview';
export interface IModel extends IEventEmitter {
    collection?: ICollection;
    idAttribute?: string;
    uid: string;
    id?: string;
    get(key: string): any;
    set(key: string, value: any): any;
    toJSON?: () => any;
    hasChanged(attr?: any): boolean;
}
export interface ICollection extends IEventEmitter {
    length: number;
    indexOf: (item: IModel) => number;
    forEach(fn: (item: IModel, index?: number) => any): any;
    push(item: IModel): any;
}
export interface IDataView extends IView {
    model: IModel;
    collection: ICollection;
}
