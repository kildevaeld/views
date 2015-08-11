export interface EventHandler {
    (...args: any[]): any;
}
export interface Events {
    name: string;
    once: boolean;
    handler: EventHandler;
    ctx: any;
}
export interface IEventEmitter {
    listeners: {
        [key: string]: Events[];
    };
    listenId: string;
    on(event: string, fn: EventHandler, ctx?: any): any;
    once(event: string, fn: EventHandler, ctx?: any): any;
    off(event: string, fn?: EventHandler, ctx?: any): any;
    trigger(event: string, ...args: any[]): any;
}
export declare class EventEmitter implements IEventEmitter {
    static debugCallback: (className: string, name: string, event: string, args: any[]) => void;
    listenId: string;
    private _listeners;
    private _listeningTo;
    listeners: {
        [key: string]: Events[];
    };
    on(event: string, fn: EventHandler, ctx?: any, once?: boolean): any;
    once(event: string, fn: EventHandler, ctx?: any): any;
    off(eventName?: string, fn?: EventHandler): any;
    trigger(eventName: string, ...args: any[]): any;
    listenTo(obj: IEventEmitter, event: string, fn: EventHandler, ctx?: any, once?: boolean): any;
    listenToOnce(obj: IEventEmitter, event: string, fn: EventHandler, ctx?: any): any;
    stopListening(obj?: IEventEmitter, event?: string, callback?: EventHandler): EventEmitter;
}
