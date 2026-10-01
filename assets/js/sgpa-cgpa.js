/* ==========================================================================
   sgpa-cgpa.js — SGPA to CGPA converter
   CGPA = Σ(SGPA × Credits) / Σ Credits
   ========================================================================== */

var MAX_SEMESTERS = 12;
var semList = document.getElementById('semesters');

/** Pure maths. sems = [{ sgpa, credits }] */
function computeCgpa(sems) {
  var points = 0, credits = 0;
  sems.forEach(function (s) { points += s.sgpa * s.credits; credits += s.credits; });
  return { cgpa: credits ? points / credits : 0, credits: credits, points: points };
}

/** Append one semester row (optionally pre-filled). */
function addSemester(sgpa, credits) {
  if (semList.children.length >= MAX_SEMESTERS) return;
  var row = document.createElement('div');
  row.className = 'sem-row p-4 border border-[var(--line)] rounded';
  row.innerHTML =
    '<div class="flex items-center justify-between mb-3">' +
      '<span class="sem-title text-xs uppercase tracking-wider text-[var(--muted)]"></span>' +
      '<button type="button" class="remove-sem text-xs text-[var(--muted)] hover:text-white transition-colors">Remove</button>' +
    '</div>' +
    '<div class="grid grid-cols-2 gap-3">' +
      '<div><label class="' + Calc.labelCls + '">SGPA</label>' +
        '<input type="number" step="0.01" min="0" max="10" inputmode="decimal" placeholder="e.g. 8.2" class="sem-sgpa field w-full px-3 py-2 text-sm" value="' + (sgpa || '') + '"></div>' +
      '<div><label class="' + Calc.labelCls + '">Credits</label>' +
        '<input type="number" step="0.5" min="0" inputmode="decimal" placeholder="e.g. 22" class="sem-credits field w-full px-3 py-2 text-sm" value="' + (credits || '') + '"></div>' +
    '</div>';
  row.querySelector('.remove-sem').addEventListener('click', function () {
    if (semList.children.length > 1) { row.remove(); refreshSemesters(); }
  });
  semList.appendChild(row);
  refreshSemesters();
}

/** Renumber titles and toggle add / remove availability. */
function refreshSemesters() {
  var rows = semList.querySelectorAll('.sem-row');
  rows.forEach(function (row, i) {
    row.querySelector('.sem-title').textContent = 'Semester ' + (i + 1);
    row.querySelector('.remove-sem').style.visibility = rows.length > 1 ? 'visible' : 'hidden';
  });
  document.getElementById('addSem').disabled = rows.length >= MAX_SEMESTERS;
}

function runSgpaCgpa() {
  var out = document.getElementById('result');
  var sems = [];
  var rows = semList.querySelectorAll('.sem-row');

  for (var i = 0; i < rows.length; i++) {
    var sRaw = rows[i].querySelector('.sem-sgpa').value.trim();
    var cRaw = rows[i].querySelector('.sem-credits').value.trim();
    if (sRaw === '' && cRaw === '') continue; // untouched row – ignore
    var sgpa = Number(sRaw), credits = Number(cRaw);
    if (sRaw === '' || cRaw === '') return Calc.showError(out, 'Semester ' + (i + 1) + ': enter both SGPA and credits.');
    if (isNaN(sgpa) || sgpa < 0 || sgpa > 10) return Calc.showError(out, 'Semester ' + (i + 1) + ': SGPA must be between 0 and 10.');
    if (isNaN(credits) || credits <= 0) return Calc.showError(out, 'Semester ' + (i + 1) + ': credits must be greater than 0.');
    sems.push({ n: i + 1, sgpa: sgpa, credits: credits });
  }
  if (!sems.length) return Calc.showError(out, 'Enter SGPA and credits for at least one semester.');

  var r = computeCgpa(sems);
  var cgpa = Calc.fmt(r.cgpa);
  var credTxt = Number.isInteger(r.credits) ? r.credits : Calc.fmt(r.credits, 1);

  var table = '<table class="w-full text-sm mt-4 border border-[var(--line)]"><thead><tr class="border-b border-[var(--line)] text-xs uppercase tracking-wider text-[var(--muted)]">' +
    '<th class="px-3 py-2 text-left font-normal">Semester</th><th class="px-3 py-2 text-left font-normal">SGPA</th><th class="px-3 py-2 text-left font-normal">Credits</th></tr></thead><tbody>' +
    sems.map(function (s) {
      return '<tr class="border-b border-[var(--line)]"><td class="px-3 py-2">' + s.n + '</td><td class="px-3 py-2">' + Calc.fmt(s.sgpa) + '</td><td class="px-3 py-2">' + s.credits + '</td></tr>';
    }).join('') + '</tbody></table>';

  var links = '<div class="flex flex-col sm:flex-row gap-2 mt-4">' +
    '<a class="btn-outline px-4 py-2.5 text-sm text-center" href="cgpa-percentage.html?cgpa=' + cgpa + '">Convert to percentage</a>' +
    '<a class="btn-outline px-4 py-2.5 text-sm text-center" href="required-cgpa.html?cgpa=' + cgpa + '&credits=' + r.credits + '">Plan target CGPA</a></div>';

  Calc.showResult(out, {
    label: 'Your CGPA',
    value: cgpa,
    details: [['Semesters counted', sems.length], ['Total credits', credTxt]],
    extra: table + links
  });
}

document.getElementById('addSem').addEventListener('click', function () { addSemester(); });
document.getElementById('calcBtn').addEventListener('click', runSgpaCgpa);
document.getElementById('sgpaForm').addEventListener('submit', function (e) { e.preventDefault(); runSgpaCgpa(); });

// Start with two semesters, as in the spec.
addSemester(); addSemester();

if (typeof module !== 'undefined') module.exports = { computeCgpa: computeCgpa };
