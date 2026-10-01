/* ==========================================================================
   required-cgpa.js — Required CGPA / SGPA predictor
   required SGPA = (Target × (Done + Left) − Current × Done) / Left
   ========================================================================== */

var MAX_GP = 10; // top of the grade-point scale

/** Pure maths. */
function computeRequired(current, done, left, target) {
  var total = done + left;
  var need = (target * total - current * done) / left;
  return {
    need: need,
    maxCgpa: (current * done + MAX_GP * left) / total, // if you score a perfect SGPA from now on
    status: need > MAX_GP + 1e-9 ? 'unreachable' : (need <= 0 ? 'secured' : 'ok')
  };
}

/** CGPA you would end with for a given average SGPA in the remaining credits. */
function projectedCgpa(current, done, left, sgpa) {
  return (current * done + sgpa * left) / (done + left);
}

function runRequired(e) {
  if (e) e.preventDefault();
  var out = document.getElementById('result');
  var current = Calc.num('current');
  var done = Calc.num('done');
  var left = Calc.num('left');
  var target = Calc.num('target');

  if (isNaN(current) || current < 0 || current > 10) return Calc.showError(out, 'Current CGPA must be between 0 and 10.');
  if (isNaN(done) || done <= 0) return Calc.showError(out, 'Enter the credits you have completed (greater than 0).');
  if (isNaN(left) || left <= 0) return Calc.showError(out, 'Enter the remaining credits (greater than 0).');
  if (isNaN(target) || target <= 0 || target > 10) return Calc.showError(out, 'Target CGPA must be between 0 and 10.');

  var r = computeRequired(current, done, left, target);
  var message, value, label = 'Required SGPA';

  if (r.status === 'unreachable') {
    value = '—';
    message = 'This target is not reachable. Even a perfect ' + MAX_GP + ' SGPA in all remaining credits gives a CGPA of <strong>' + Calc.fmt(r.maxCgpa) + '</strong>.';
  } else if (r.status === 'secured') {
    value = '0.00';
    label = 'Target already secured';
    message = 'Your current CGPA already keeps you at or above ' + Calc.fmt(target) + ', whatever you score in the remaining credits.';
  } else {
    var need = Calc.ceilTo(r.need, 2);
    value = Calc.fmt(need);
    message = 'You need approximately <strong>' + Calc.fmt(need) + ' SGPA</strong> across your remaining ' + left + ' credits to finish with a CGPA of ' + Calc.fmt(target) + '.';
  }

  // What-if table for common SGPA values
  var rows = [10, 9, 8, 7, 6].map(function (s) {
    return '<tr class="border-b border-[var(--line)]"><td class="px-3 py-2">' + s.toFixed(1) + '</td><td class="px-3 py-2">' + Calc.fmt(projectedCgpa(current, done, left, s)) + '</td></tr>';
  }).join('');
  var table = '<p class="label mt-5 mb-2">If you average…</p>' +
    '<table class="w-full text-sm border border-[var(--line)]"><thead><tr class="border-b border-[var(--line)] text-xs uppercase tracking-wider text-[var(--muted)]">' +
    '<th class="px-3 py-2 text-left font-normal">SGPA in remaining credits</th><th class="px-3 py-2 text-left font-normal">Final CGPA</th></tr></thead><tbody>' + rows + '</tbody></table>';

  Calc.showResult(out, {
    label: label, value: value, message: message,
    details: [['Highest possible CGPA', Calc.fmt(r.maxCgpa)], ['Total credits', done + left]],
    extra: table,
    note: 'Assumes the same SGPA scale (0–10) and credit-weighted CGPA as your university.'
  });
}

document.getElementById('requiredForm').addEventListener('submit', runRequired);

// Pre-fill when arriving from the SGPA → CGPA tool
['cgpa:current', 'credits:done'].forEach(function (pair) {
  var p = pair.split(':'), v = Calc.query(p[0]);
  if (v && !isNaN(Number(v))) document.getElementById(p[1]).value = v;
});

if (typeof module !== 'undefined') module.exports = { computeRequired: computeRequired, projectedCgpa: projectedCgpa };
