/* ==========================================================================
   calc-utils.js — tiny helpers shared by all calculators
   Exposes a single global: Calc
   ========================================================================== */
(function (global) {
  'use strict';

  var Calc = {};

  /** Read a numeric input by id. Returns NaN for empty / invalid values. */
  Calc.num = function (id) {
    var el = document.getElementById(id);
    if (!el) return NaN;
    var v = String(el.value).trim();
    return v === '' ? NaN : Number(v);
  };

  /** Fixed-decimal formatter (returns a string). */
  Calc.fmt = function (n, d) { return Number(n).toFixed(d == null ? 2 : d); };

  /** Round UP to d decimals — used where a "needed" figure must be sufficient. */
  Calc.ceilTo = function (n, d) {
    var f = Math.pow(10, d == null ? 2 : d);
    return Math.ceil(n * f - 1e-9) / f;
  };

  /** Escape user-provided text before placing it in innerHTML. */
  Calc.esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  /** Read a ?name=value query parameter (used to pass values between tools). */
  Calc.query = function (name) {
    try { return new URLSearchParams(window.location.search).get(name); }
    catch (e) { return null; }
  };

  /** Render a validation error into a result container. */
  Calc.showError = function (target, message) {
    target.innerHTML = '<div class="result-error" role="alert">' + Calc.esc(message) + '</div>';
  };

  /**
   * Render a standard result block.
   * opts: { label, value, message (trusted HTML), details: [[label, value], ...], note }
   * Callers must escape any user-provided text placed inside `message`/`details`.
   */
  Calc.showResult = function (target, opts) {
    var html = '<div class="result-box">';
    if (opts.label) html += '<p class="label">' + opts.label + '</p>';
    if (opts.value != null) html += '<p class="value mt-1">' + opts.value + '</p>';
    if (opts.message) html += '<p class="text-sm mt-3 leading-relaxed">' + opts.message + '</p>';
    if (opts.details && opts.details.length) {
      html += '<dl class="mt-4 text-sm">' + opts.details.map(function (r) {
        return '<div class="flex justify-between gap-4 py-2 border-t border-[var(--line)]">' +
               '<dt class="text-[var(--muted)]">' + r[0] + '</dt><dd class="text-right">' + r[1] + '</dd></div>';
      }).join('') + '</dl>';
    }
    if (opts.extra) html += opts.extra;
    if (opts.note) html += '<p class="text-xs text-[var(--muted)] mt-3 leading-relaxed">' + opts.note + '</p>';
    html += '</div>';
    target.innerHTML = html;
  };

  /** Tailwind classes for a form label (keeps JS-built forms consistent with the HTML ones). */
  Calc.labelCls = 'block text-xs uppercase tracking-wider text-[var(--muted)] mb-2';

  global.Calc = Calc;
})(window);
