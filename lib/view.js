var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var base = require('./baseview');
var utils_1 = require('./utils');
var kUIRegExp = /@ui.([a-zA-Z_\-\$#]+)/i;
function normalizeUIKeys(obj) {
    /*jshint -W030 */
    var o = {}, k, v, ms, sel, ui;
    for (k in obj) {
        v = obj[k];
        if ((ms = kUIRegExp.exec(k)) !== null) {
            ui = ms[1], sel = this._ui[ui];
            if (sel != null) {
                k = k.replace(ms[0], sel);
            }
        }
        o[k] = v;
    }
    return o;
}
var View = (function (_super) {
    __extends(View, _super);
    function View() {
        _super.apply(this, arguments);
        this.ui = {};
    }
    View.prototype.delegateEvents = function (events) {
        this.bindUIElements();
        events = events || this.events;
        events = normalizeUIKeys.call(this, events);
        _super.prototype.delegateEvents.call(this, events);
        return this;
    };
    /*constructor (options?: ViewOptions) {
      super(options)
    }*/
    View.prototype.undelegateEvents = function () {
        this.unbindUIElements();
        _super.prototype.undelegateEvents.call(this);
        return this;
    };
    /* UI Elements */
    View.prototype.bindUIElements = function () {
        var _this = this;
        var ui = this.options.ui || this.ui;
        if (!ui)
            return;
        if (!this._ui) {
            this._ui = ui;
        }
        ui = utils_1.utils.result(this, '_ui');
        this.ui = {};
        Object.keys(ui).forEach(function (k) {
            var elm = _this.$(ui[k]);
            if (elm && elm.length) {
                // unwrap if it's a nodelist.
                if (elm instanceof NodeList) {
                    elm = elm[0];
                }
                _this.ui[k] = elm;
            }
        });
    };
    View.prototype.unbindUIElements = function () {
        this.ui = {};
    };
    return View;
})(base.BaseView);
exports.View = View;
