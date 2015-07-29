
import * as views from './view'

export interface TemplateFunction {
  (locals:Object): string
}

export interface TemplateViewOptions extends views.ViewOptions {
  template?: string|TemplateFunction
}

export class TemplateView<T extends HTMLElement> extends views.View<T> {
  template: string|TemplateFunction

  constructor (options?: TemplateViewOptions) {
    super(options)
    
    if (options && options.template) {
      this.template = options.template
    }
  }

  getTemplateData (): any {
    return {}
  }

  render (options:any): any {
    //super.render(options)
    this.undelegateEvents()

    let template: string
    if ( typeof this.template == 'function') {
      template = (<TemplateFunction>this.template).call(this, this.getTemplateData())
    } else if (typeof this.template == 'string') {
      template = <string>this.template
    }

    if (template) {
      this.el.innerHTML = template;
    }

    this.delegateEvents()

    return this
  }


}
