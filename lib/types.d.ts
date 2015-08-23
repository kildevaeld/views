import { IEventEmitter } from './events';
import { IView } from './baseview';
export interface IModel extends IEventEmitter {
    collection?: ICollection;
    idAttribute?: string;
    uid: string;
    id?: string;
    get(key: string): any;
    set(key: string | Object, value?: any): any;
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
export interface Silenceable {
    silent?: boolean;
}
export interface Thenable<R> {
    then<U>(onFulfilled?: (value: R) => U | Thenable<U>, onRejected?: (error: any) => U | Thenable<U>): Thenable<U>;
    then<U>(onFulfilled?: (value: R) => U | Thenable<U>, onRejected?: (error: any) => void): Thenable<U>;
}
export interface PromiseConstructor {
    new <R>(callback: (resolve: (value?: R | Thenable<R>) => void, reject: (error?: any) => void) => void): Promise<R>;
    resolve<R>(value?: R | Thenable<R>): Promise<R>;
    reject(error: any): Promise<any>;
    all<R>(promises: (R | Thenable<R>)[]): Promise<R[]>;
    race<R>(promises: (R | Thenable<R>)[]): Promise<R>;
}
export interface Promise<R> extends Thenable<R> {
    /**
     * If you call resolve in the body of the callback passed to the constructor,
     * your promise is fulfilled with result object passed to resolve.
     * If you call reject your promise is rejected with the object passed to resolve.
     * For consistency and debugging (eg stack traces), obj should be an instanceof Error.
     * Any errors thrown in the constructor callback will be implicitly passed to reject().
     */
    constructor(callback: (resolve: (value?: R | Thenable<R>) => void, reject: (error?: any) => void) => void): any;
    /**
     * onFulfilled is called when/if "promise" resolves. onRejected is called when/if "promise" rejects.
     * Both are optional, if either/both are omitted the next onFulfilled/onRejected in the chain is called.
     * Both callbacks have a single parameter , the fulfillment value or rejection reason.
     * "then" returns a new promise equivalent to the value you return from onFulfilled/onRejected after being passed through Promise.resolve.
     * If an error is thrown in the callback, the returned promise rejects with that error.
     *
     * @param onFulfilled called when/if "promise" resolves
     * @param onRejected called when/if "promise" rejects
     */
    then<U>(onFulfilled?: (value: R) => U | Thenable<U>, onRejected?: (error: any) => U | Thenable<U>): Promise<U>;
    then<U>(onFulfilled?: (value: R) => U | Thenable<U>, onRejected?: (error: any) => void): Promise<U>;
    /**
     * Sugar for promise.then(undefined, onRejected)
     *
     * @param onRejected called when/if "promise" rejects
     */
    catch<U>(onRejected?: (error: any) => U | Thenable<U>): Promise<U>;
}
