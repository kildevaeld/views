"use strict";
const kUIRegExp = /@ui.([a-zA-Z_\-\$#]+)/i;
function normalizeUIKeys(obj, uimap) {
    /*jshint -W030 */
    let o = {}, k, v, ms, sel, ui;
    for (k in obj) {
        v = obj[k];
        if ((ms = kUIRegExp.exec(k)) !== null) {
            ui = ms[1], sel = uimap[ui];
            if (sel != null) {
                k = k.replace(ms[0], sel);
            }
        }
        o[k] = v;
    }
    return o;
}
exports.normalizeUIKeys = normalizeUIKeys;
