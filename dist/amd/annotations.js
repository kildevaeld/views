define(["require", "exports", 'orange'], function (require, exports, orange_1) {
    "use strict";
    function attributes(attrs) {
        return function (target) {
            orange_1.extend(target.prototype, attrs);
        };
    }
    exports.attributes = attributes;
    function events(events) {
        return function (target) {
            target.prototype.events = events;
        };
    }
    exports.events = events;
    function triggers(triggers) {
        return function (target) {
            target.prototype.triggers = triggers;
        };
    }
    exports.triggers = triggers;
});
