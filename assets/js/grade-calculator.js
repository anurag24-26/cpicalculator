/* ==========================================================================
   grade-calculator.js — weighted marks → final percentage + estimated grade
   Final % = Σ(weight × score ÷ max) ÷ Σ weight × 100   (over scored components)
   ========================================================================== */

/** Grade scales: first band whose `min` the percentage reaches wins. */
var SCALES = {
  ten: {
    label: '10-point scale',
    bands: [
      { min: 90, grade: 'O',  gp: 10 }, { min: 80, grade: 'A+', gp: 9 }, { min: 70, grade: 'A', gp: 8 },
      { min: 60, grade: 'B+', gp: 7 },  { min: 50, grade: 'B',  gp: 6 }, { min: 40, grade: 'C', gp: 5 },
      { min: 0,  grade: 'F',  gp: 0 }
    ]
  },
  letter: {
    label: 'Letter scale',
    bands: [
      { min: 90, grade: 'A' }, { min: 80, grade: 'B' }, { min: 70, grade: 'C' },
      { min: 60, grade: 'D' }, { min: 0,  grade: 'F' }
    ]
  }
};

var DEFAULT_ROWS = [['Internal', 30], ['Mid Semester', 20], ['End Semester', 50]];
var MAX_ROWS = 12;
var list = document.getElementById('components');

/** Pure maths. items = [{ weight, score, max }] (only scored components). */
function computeWeighted(items) {
  var earned = 0, weight = 0;
  items.forEach(function (i) { earned += i.weight * (i.score / i.max); weight += i.weight; });
  return { earned: earned, weight: weight, pct: weight ? (earned / weight) * 100 : 0 };
}

function gradeFor(pct, scaleKey) {
  var bands = SCALES[scaleKey].bands;
  for (var i = 0; i < bands.length; i++) if (pct + 1e-9 >= bands[i].min) return bands[i];
  return bands[bands.length - 1];
}

/** Append a component row. */
function addComponent(name, weight) {
  if (list.children.length >= MAX_ROWS) return;
  var row = document.createElement('div');
  row.className = 'comp-row p-4 border border-[var(--line)] rounded';
  row.innerHTML =
    '<div class="flex items-center justify-between mb-3">' +
      '<span class="comp-title text-xs uppercase tracking-wider text-[var(--muted)]"></span>' +
      '<button type="button" class="remove-comp text-xs text-[var(--muted)] hover:text-white transition-colors">Remove</button>' +
    '</div>' +
    '<label class="' + Calc.labelCls + '">Component name</label>' +
    '<input type="text" class="comp-name field w-full px-3 py-2 text-sm mb-3" placeholder="e.g. Quiz" value="' + Calc.esc(name || '') + '">' +
    '<div class="grid grid-cols-3 gap-3">' +
      '<div><label class="' + Calc.labelCls + '">Weight %</label><input type="number" min="0" max="100" step="any" inputmode="decimal" class="comp-weight field w-full px-3 py-2 text-sm" value="' + (weight == null ? '' : weight) + '"></div>' +
      '<div><label class="' + Calc.labelCls + '">Score</label><input type="number" min="0" step="any" inputmode="decimal" class="comp-score field w-full px-3 py-2 text-sm" placeholder="—"></div>' +
      '<div><label class="' + Calc.labelCls + '">Out of</label><input type="number" min="0" step="any" inputmode="decimal" class="comp-max field w-full px-3 py-2 text-sm" value="100"></div>' +
    '</div>';
  row.querySelector('.remove-comp').addEventListener('click', function () {
    if (list.children.length > 1) { row.remove(); refreshComponents(); }
  });
  list.appendChild(row);
  refreshComponents();
}

function refreshComponents() {
  var rows = list.querySelectorAll('.comp-row');
  rows.forEach(function (row, i) {
    row.querySelector('.comp-title').textContent = 'Component ' + (i + 1);
    row.querySelector('.remove-comp').style.visibility = rows.length > 1 ? 'visible' : 'hidden';
  });
  document.getElementById('addComp').disabled = rows.length >= MAX_ROWS;
}

function runGrade(e) {
  if (e) e.preventDefault();
  var out = document.getElementById('result');
  var scaleKey = document.getElementById('scale').value;
  var rows = list.querySelectorAll('.comp-row');
  var items = [], totalWeight = 0, pending = 0;

  for (var i = 0; i < rows.length; i++) {
    var name = rows[i].querySelector('.comp-name').value.trim() || ('Component ' + (i + 1));
    var weight = Number(rows[i].querySelector('.comp-weight').value);
    var scoreRaw = rows[i].querySelector('.comp-score').value.trim();
    var max = Number(rows[i].querySelector('.comp-max').value);

    if (!(weight > 0) || weight > 100) return Calc.showError(out, name + ': weight must be between 0 and 100.');
    totalWeight += weight;
    if (scoreRaw === '') { pending++; continue; } // not taken yet – left out of the result
    var score = Number(scoreRaw);
    if (!(max > 0)) return Calc.showError(out, name + ': "Out of" must be greater than 0.');
    if (isNaN(score) || score < 0 || score > max) return Calc.showError(out, name + ': score must be between 0 and ' + max + '.');
    items.push({ name: name, weight: weight, score: score, max: max });
  }
  if (!items.length) return Calc.showError(out, 'Enter a score for at least one component.');

  var r = computeWeighted(items);
  var g = gradeFor(r.pct, scaleKey);
  var notes = [];
  if (Math.abs(totalWeight - 100) > 0.001) notes.push('Your weights add up to ' + Calc.fmt(totalWeight, totalWeight % 1 ? 1 : 0) + '%, not 100%, so the result is scaled to the weight entered.');
  if (pending) notes.push(pending + ' component' + (pending > 1 ? 's have' : ' has') + ' no score yet and ' + (pending > 1 ? 'are' : 'is') + ' not counted — this is your standing so far.');
  notes.push('Grade bands differ between universities; treat the grade as an estimate.');

  var details = [
    ['Weighted marks', Calc.fmt(r.earned) + ' / ' + Calc.fmt(r.weight, r.weight % 1 ? 1 : 0)],
    ['Scale', SCALES[scaleKey].label]
  ];
  if (g.gp != null) details.push(['Grade points', g.gp]);

  Calc.showResult(out, {
    label: 'Final percentage',
    value: Calc.fmt(r.pct) + '%',
    message: 'Estimated grade: <strong>' + g.grade + '</strong>',
    details: details,
    note: notes.join(' ')
  });
}

document.getElementById('addComp').addEventListener('click', function () { addComponent('', null); });
document.getElementById('gradeForm').addEventListener('submit', runGrade);
DEFAULT_ROWS.forEach(function (r) { addComponent(r[0], r[1]); });

if (typeof module !== 'undefined') module.exports = { computeWeighted: computeWeighted, gradeFor: gradeFor };
