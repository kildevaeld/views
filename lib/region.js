"use strict";
const debug = require('debug')('views:region');
const object_1 = require('./object');
const orange_1 = require('orange');
/** Region  */
class Region extends object_1.BaseObject {
    /**
     * Regions manage a view
     * @param {Object} options
     * @param {HTMLElement} options.el  A Html element
     * @constructor Region
     * @extends BaseObject
     * @inheritdoc
     */
    constructor(options) {
        super();
        this.options = options;
        this._el = this.getOption('el');
    }
    get view() {
        return this._view;
    }
    set view(view) {
        this.show(view);
    }
    get el() {
        return this._el;
    }
    /**
     * Build region from a definition
     * @param {Object|String|Region} def The description of the region
     * @return {Region}
     */
    static buildRegion(def, context = null) {
        if (def instanceof Region) {
            return def;
        }
        else if (typeof def === 'string') {
            return buildBySelector(def, Region, context);
        }
        else {
            return buildByObject(def, context);
        }
    }
    /**
   * Show a view in the region.
   * This will destroy or remove any existing views.
   * @param  {View} view    The view to Show
   * @return {Region}       this for chaining.
   */
    show(view, options) {
        let diff = view !== this._view;
        if (diff) {
            // Remove any containing views
            this.empty();
            // If the view is destroyed be others
            view.once('destroy', this.empty, this);
            debug('%s render view %s', this, view);
            view.render();
            orange_1.triggerMethodOn(view, 'before:show');
            debug('%s attaching view: %s', this, view);
            this._attachHtml(view);
            orange_1.triggerMethodOn(view, 'show');
            this._view = view;
        }
        return this;
    }
    /**
     * Destroy the region, this will remove any views, but not the containing element
     * @return {Region} this for chaining
     */
    destroy() {
        this.empty();
        super.destroy();
    }
    /**
     * Empty the region. This will destroy any existing view.
     * @return {Region} this for chaining;
     */
    empty() {
        if (!this._view)
            return;
        let view = this._view;
        view.off('destroy', this.empty, this);
        this.trigger('before:empty', view);
        this._destroyView();
        this.trigger('empty', view);
        delete this._view;
        return this;
    }
    /**
     * Attach the view element to the regions element
     * @param {View} view
     * @private
     *
     */
    _attachHtml(view) {
        this._el.innerHTML = '';
        this._el.appendChild(view.el);
    }
    _destroyView() {
        let view = this._view;
        if ((view.destroy && typeof view.destroy === 'function') && !view.isDestroyed) {
            view.destroy();
        }
        else if (view.remove && typeof view.remove === 'function') {
            view.remove();
        }
        this._el.innerHTML = '';
    }
}
exports.Region = Region;
function buildByObject(object = {}, context) {
    if (!object.selector)
        throw new Error('No selector specified: ' + object);
    return buildBySelector(object.selector, object.regionClass || Region, context);
}
function buildBySelector(selector, Klass = Region, context) {
    context = context || document;
    var el = context.querySelector(selector);
    if (!el)
        throw new Error('selector must exist in the dom');
    return new Klass({
        el: el
    });
}
