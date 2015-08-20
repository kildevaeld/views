var utils_1 = require('./utils');
function attributes(attrs) {
    return function (target) {
        utils_1.utils.extend(target.prototype, attrs);
    };
}
exports.attributes = attributes;
function events(events) {
    return function (target) {
        target.prototype.events = events;
    };
}
exports.events = events;
