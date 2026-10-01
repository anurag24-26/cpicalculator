/* ==========================================================================
   cgpa-percentage.js — CGPA to Percentage converter
   General form:  Percentage = CGPA × multiplier − deduction
   ========================================================================== */

/**
 * University presets. Always confirm with your university's official notification —
 * conversion rules differ between institutions and sometimes between batches.
 */
var PRESETS = {
  gla:    { label: 'GLA University', mult: 9.5, sub: 0,   formula: 'Percentage = CGPA × 9.5' },
  aktu:   { label: 'AKTU',           mult: 10,  sub: 7.5, formula: 'Percentage = (CGPA × 10) − 7.5' },
  vtu:    { label: 'VTU',            mult: 10,  sub: 7.5, formula: 'Percentage = (CGPA − 0.75) × 10' },
  custom: { label: 'Custom',         mult: null, sub: null, formula: '' }
};

/** Pure maths. Result is clamped to the 0–100 range. */
function cgpaToPercentage(cgpa, mult, sub) {
  return Math.min(100, Math.max(0, cgpa * mult - (sub || 0)));
}

var uniSelect = document.getElementById('university');
var customBox = document.getElementById('customFields');
var formulaLine = document.getElementById('formulaLine');

/** Show/hide custom inputs and update the formula hint. */
function refreshFormula() {
  var key = uniSelect.value;
  customBox.classList.toggle('hidden', key !== 'custom');
  formulaLine.textContent = key === 'custom'
    ? 'Percentage = (CGPA × multiplier) − deduction'
    : PRESETS[key].formula;
}

function runCgpaPercentage(e) {
  if (e) e.preventDefault();
  var out = document.getElementById('result');
  var cgpa = Calc.num('cgpa');
  var key = uniSelect.value;
  var mult, sub, formula;

  if (isNaN(cgpa) || cgpa < 0 || cgpa > 10) return Calc.showError(out, 'Enter a CGPA between 0 and 10.');

  if (key === 'custom') {
    mult = Calc.num('multiplier');
    sub = Calc.num('deduction');
    if (isNaN(sub)) sub = 0;
    if (isNaN(mult) || mult <= 0) return Calc.showError(out, 'Enter a multiplier greater than 0 (for example 9.5).');
    if (sub < 0) return Calc.showError(out, 'Deduction cannot be negative.');
    formula = 'Percentage = (' + Calc.fmt(cgpa) + ' × ' + mult + ')' + (sub ? ' − ' + sub : '');
  } else {
    mult = PRESETS[key].mult; sub = PRESETS[key].sub;
    formula = PRESETS[key].formula;
  }

  var pct = cgpaToPercentage(cgpa, mult, sub);
  Calc.showResult(out, {
    label: 'Equivalent percentage',
    value: Calc.fmt(pct) + '%',
    details: [['CGPA', Calc.fmt(cgpa)], ['Formula', formula]],
    note: 'Conversion rules vary by university and batch. Use the figure from your official notification for applications.'
  });
}

uniSelect.addEventListener('change', refreshFormula);
document.getElementById('cgpaForm').addEventListener('submit', runCgpaPercentage);

// Pre-fill when arriving from the SGPA → CGPA tool (?cgpa=8.1)
var qCgpa = Calc.query('cgpa');
if (qCgpa && !isNaN(Number(qCgpa))) document.getElementById('cgpa').value = qCgpa;
refreshFormula();

if (typeof module !== 'undefined') module.exports = { cgpaToPercentage: cgpaToPercentage };
