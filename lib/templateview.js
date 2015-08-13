var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var views = require('./view');
var TemplateView = (function (_super) {
    __extends(TemplateView, _super);
    /** TemplateView
     * @param {TemplateViewOptions} options
     * @extends View
     */
    function TemplateView(options) {
        if (options && options.template) {
            this.template = options.template;
        }
        _super.call(this, options);
    }
    TemplateView.prototype.getTemplateData = function () {
        return {};
    };
    TemplateView.prototype.render = function (options) {
        this.triggerMethod('before:render');
        this.undelegateEvents();
        var template = this.getOption('template');
        if (typeof template === 'function') {
            template = template.call(this, this.getTemplateData());
        }
        if (template && typeof template === 'string') {
            this.el.innerHTML = template;
        }
        this.delegateEvents();
        this.triggerMethod('render');
        return this;
    };
    return TemplateView;
})(views.View);
exports.TemplateView = TemplateView;
