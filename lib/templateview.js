var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var views = require('./view');
var TemplateView = (function (_super) {
    __extends(TemplateView, _super);
    function TemplateView(options) {
        _super.call(this, options);
        if (options && options.template) {
            this.template = options.template;
        }
    }
    TemplateView.prototype.getTemplateData = function () {
        return {};
    };
    TemplateView.prototype.render = function (options) {
        this.triggerMethod('before:render');
        this.undelegateEvents();
        var template;
        if (typeof this.template == 'function') {
            template = this.template.call(this, this.getTemplateData());
        }
        else if (typeof this.template == 'string') {
            template = this.template;
        }
        if (template) {
            this.el.innerHTML = template;
        }
        this.delegateEvents();
        this.triggerMethod('render');
        return this;
    };
    return TemplateView;
})(views.View);
exports.TemplateView = TemplateView;
