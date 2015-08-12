import { BaseObject } from './object';
import { IModel, ICollection } from './types';
export interface CollectionOptions {
}
export interface Silenceable {
    silent?: boolean;
}
export interface CollectionSetOptions extends Silenceable {
    at?: number;
    sort?: boolean;
    add?: boolean;
    merge?: boolean;
    remove?: boolean;
    parse?: boolean;
}
export interface CollectionRemoveOptions extends Silenceable {
    index?: number;
}
export interface CollectionSortOptions extends Silenceable {
}
export interface CollectionResetOptions extends Silenceable {
    previousModels?: IModel[];
}
export declare class Collection<U extends IModel> extends BaseObject implements ICollection {
    length: number;
    Model: new (attr: Object, options?: any) => U;
    private _models;
    options: CollectionOptions;
    models: U[];
    constructor(models?: U[], options?: CollectionOptions);
    add(models: U | U[], options?: CollectionSetOptions): void;
    set(items: U | U[], options?: CollectionSetOptions): U | U[];
    remove(models: any, options?: CollectionRemoveOptions): any;
    get(id: any): U;
    at(index: any): U;
    clone(options?: CollectionOptions): any;
    sort(options?: CollectionSortOptions): Collection<U>;
    sortBy(key: string | Function, context?: any): U[];
    push(model: any, options?: {}): void;
    reset(models: any, options?: CollectionResetOptions): any;
    create(values?: any, options?: any): IModel;
    parse(models: U | U[], options?: CollectionSetOptions): U | U[];
    find(nidOrFn: any): any;
    forEach(iterator: (model: U, index?: number) => void, ctx?: any): Collection<U>;
    indexOf(model: U): number;
    toJSON(): any[];
    comparator(): void;
    _removeReference(model: U, options?: any): void;
    _addReference(model: IModel, options?: any): void;
    _reset(): void;
    _onModelEvent(event: any, model: any, collection: any, options: any): void;
}
