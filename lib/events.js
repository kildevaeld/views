var idCounter = 0;
function getID() {
    return "" + (++idCounter);
}
var EventEmitter = (function () {
    function EventEmitter() {
        this._events = {};
        this._listeningTo = {};
    }
    EventEmitter.prototype.on = function (event, fn, ctx, once) {
        if (once === void 0) { once = false; }
        var events = this._events[event] || (this._events[event] = []);
        events.push({
            name: event,
            once: once,
            handler: fn,
            ctx: ctx || this
        });
        return this;
    };
    EventEmitter.prototype.once = function (event, fn) {
        return this.on(event, fn, true);
    };
    EventEmitter.prototype.off = function (eventName, fn) {
        if (eventName == null) {
            this._events = {};
        }
        else if (this._events[eventName]) {
            var events = this._events[eventName];
            if (fn == null) {
                this._events[eventName] = [];
            }
            else {
                for (var i = 0; i < events.length; i++) {
                    var event_1 = events[i];
                    if (events[i].handler == fn) {
                        this._events[eventName].splice(i, 1);
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
        var events = (this._events[eventName] || []).concat(this._events["all"] || []);
        for (var i = 0; i < events.length; i++) {
            var event_2 = events[i];
            event_2.handler.apply(event_2.ctx, args);
            if (event_2.once === true) {
                var index = this._events[event_2.name].indexOf(event_2);
                this._events[event_2.name].splice(index, 1);
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
        var listeningTo = this._listeningTo;
        var remove = !event && !callback;
        //if (obj) (listeningTo = {})[obj.listenId] = obj;
        for (var id in listeningTo) {
            obj = listeningTo[id];
            obj.off(event, callback, this);
        }
        return this;
    };
    return EventEmitter;
})();
exports.EventEmitter = EventEmitter;
