var idCounter = 0;
function getID() {
    return "" + (++idCounter);
}
var EventEmitter = (function () {
    function EventEmitter() {
        this._listeners = {};
        this._listeningTo = {};
    }
    Object.defineProperty(EventEmitter.prototype, "listeners", {
        get: function () {
            return this._listeners;
        },
        enumerable: true,
        configurable: true
    });
    EventEmitter.prototype.on = function (event, fn, ctx, once) {
        if (once === void 0) { once = false; }
        var events = this._listeners[event] || (this._listeners[event] = []);
        events.push({
            name: event,
            once: once,
            handler: fn,
            ctx: ctx || this
        });
        return this;
    };
    EventEmitter.prototype.once = function (event, fn, ctx) {
        return this.on(event, fn, ctx, true);
    };
    EventEmitter.prototype.off = function (eventName, fn) {
        if (eventName == null) {
            this._listeners = {};
        }
        else if (this._listeners[eventName]) {
            var events = this._listeners[eventName];
            if (fn == null) {
                this._listeners[eventName] = [];
            }
            else {
                for (var i = 0; i < events.length; i++) {
                    var event_1 = events[i];
                    if (events[i].handler == fn) {
                        this._listeners[eventName].splice(i, 1);
                    }
                }
            }
        }
    };
    EventEmitter.prototype.trigger = function (eventName) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var events = (this._listeners[eventName] || []).concat(this._listeners["all"] || []);
        if (EventEmitter.debugCallback)
            EventEmitter.debugCallback(this.constructor.name, this.name, eventName, args);
        for (var i = 0; i < events.length; i++) {
            var event_2 = events[i];
            var a = args;
            if (event_2.name == 'all') {
                a = [eventName].concat(args);
            }
            event_2.handler.apply(event_2.ctx, a);
            if (event_2.once === true) {
                var index = this._listeners[event_2.name].indexOf(event_2);
                this._listeners[event_2.name].splice(index, 1);
            }
        }
        return this;
    };
    EventEmitter.prototype.listenTo = function (obj, event, fn, ctx, once) {
        if (once === void 0) { once = false; }
        var listeningTo = this._listeningTo || (this._listeningTo = {});
        var id = obj.listenId || (obj.listenId = getID());
        listeningTo[id] = obj;
        var meth = once ? 'once' : 'on';
        obj[meth](event, fn, this);
        return this;
    };
    EventEmitter.prototype.listenToOnce = function (obj, event, fn, ctx) {
        return this.listenTo(obj, event, fn, ctx, true);
    };
    EventEmitter.prototype.stopListening = function (obj, event, callback) {
        var listeningTo = this._listeningTo || {};
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
    };
    return EventEmitter;
})();
exports.EventEmitter = EventEmitter;
