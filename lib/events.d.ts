export interface EventHandler {
    (...args: any[]): any;
}
export interface IEventEmitter {
    listenId: string;
    on(event: string, fn: EventHandler, ctx?: any): any;
    once(event: string, fn: EventHandler, ctx?: any): any;
    off(event: string, fn?: EventHandler, ctx?: any): any;
    trigger(event: string, ...args: any[]): any;
}
export declare class EventEmitter implements IEventEmitter {
    listenId: string;
    private _events;
    private _listeningTo;
    on(event: string, fn: EventHandler, ctx?: any, once?: boolean): any;
    once(event: string, fn: EventHandler): any;
    off(eventName?: string, fn?: EventHandler): any;
    trigger(eventName: string, ...args: any[]): any;
    listenTo(obj: IEventEmitter, event: string, fn: EventHandler, ctx?: any, once?: boolean): any;
    listenToOnce(obj: IEventEmitter, event: string, fn: EventHandler, ctx?: any): any;
    stopListening(obj?: IEventEmitter, event?: string, callback?: EventHandler): EventEmitter;
}
