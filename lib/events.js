var idCounter = 0;
function getID() {
    return "" + (++idCounter);
}
export class EventEmitter {
    constructor() {
        this._listeners = {};
        this._listeningTo = {};
    }
    get listeners() {
        return this._listeners;
    }
    on(event, fn, ctx, once = false) {
        let events = this._listeners[event] || (this._listeners[event] = []);
        events.push({
            name: event,
            once: once,
            handler: fn,
            ctx: ctx || this
        });
        return this;
    }
    once(event, fn) {
        return this.on(event, fn, true);
    }
    off(eventName, fn) {
        if (eventName == null) {
            this._listeners = {};
        }
        else if (this._listeners[eventName]) {
            let events = this._listeners[eventName];
            if (fn == null) {
                this._listeners[eventName] = [];
            }
            else {
                for (let i = 0; i < events.length; i++) {
                    let event = events[i];
                    if (events[i].handler == fn) {
                        this._listeners[eventName].splice(i, 1);
                    }
                }
            }
        }
    }
    trigger(eventName, ...args) {
        let events = (this._listeners[eventName] || []).concat(this._listeners["all"] || []);
        for (let i = 0; i < events.length; i++) {
            let event = events[i];
            let a = args;
            if (event.name == 'all') {
                a = [eventName].concat(args);
            }
            event.handler.apply(event.ctx, a);
            if (event.once === true) {
                let index = this._listeners[event.name].indexOf(event);
                this._listeners[event.name].splice(index, 1);
            }
        }
        return this;
    }
    listenTo(obj, event, fn, ctx, once = false) {
        let listeningTo = this._listeningTo || (this._listeningTo = {});
        let id = obj.listenId || (obj.listenId = getID());
        listeningTo[id] = obj;
        let meth = once ? 'once' : 'on';
        obj[meth](event, fn, this);
        return this;
    }
    listenToOnce(obj, event, fn, ctx) {
        return this.listenTo(obj, event, fn, ctx, true);
    }
    stopListening(obj, event, callback) {
        let listeningTo = this._listeningTo || {};
        var remove = !event && !callback;
        if (obj)
            listeningTo[obj.listenId] = obj;
        for (var id in listeningTo) {
            obj = listeningTo[id];
            obj.off(event, callback, this);
            if (remove || !Object.keys(obj.listeners).length)
                delete this._listeningTo[id];
        }
        return this;
    }
}
