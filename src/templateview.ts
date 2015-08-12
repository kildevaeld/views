
import * as views from './view'

export interface TemplateFunction {
  (locals:Object): string
}

export interface TemplateViewOptions extends views.ViewOptions {
  template?: string|TemplateFunction
}

export class TemplateView<T extends HTMLElement> extends views.View<T> {
  template: string|TemplateFunction

  /** TemplateView
   * @param {TemplateViewOptions} options
   * @extends View
   */
  constructor (options?: TemplateViewOptions) {
    
    
    if (options && options.template) {
      this.template = options.template
    }
    
    super(options)
  }

  getTemplateData (): any {
    return {}
  }

  render (options:any): any {
    
    this.triggerMethod('before:render')
    
    this.undelegateEvents()

    /*let template: string
    if ( typeof this.template == 'function') {
      template = (<TemplateFunction>this.template).call(this, this.getTemplateData())
    } else if (typeof this.template == 'string') {
      template = <string>this.template
    }*/
    
    let template = this.getOption('template');
    
    if (typeof template === 'function') {
      template = template.call(this, this.getTemplateData())
    }
    
  
    
    
    if (template && typeof template === 'string') {
      this.el.innerHTML = template;
    }

    this.delegateEvents()
    
    this.triggerMethod('render')
    
    return this
  }


}
