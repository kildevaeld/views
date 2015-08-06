import { IEventEmitter } from './events';
import { IView } from './baseview';
export interface IModel extends IEventEmitter {
    get(key: string, value: any): any;
    set(key: string): any;
    toJSON(): any;
}
export interface ICollection extends IEventEmitter {
    length: number;
    forEach(fn: (item: any) => any): any;
}
export interface IDataView extends IView {
    model: IModel;
}
