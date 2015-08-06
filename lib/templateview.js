import * as views from './view';
export class TemplateView extends views.View {
    constructor(options) {
        super(options);
        if (options && options.template) {
            this.template = options.template;
        }
    }
    getTemplateData() {
        return {};
    }
    render(options) {
        this.triggerMethod('before:render');
        this.undelegateEvents();
        let template;
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
    }
}
