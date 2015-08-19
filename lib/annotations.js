var utils_1 = require('./utils');
function attributes(attrs) {
    return function (target) {
        utils_1.utils.extend(target.prototype, attrs);
    };
}
exports.attributes = attributes;
