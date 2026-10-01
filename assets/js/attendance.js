/* ==========================================================================
   attendance.js — Attendance Calculator
   ========================================================================== */

/**
 * Pure maths (no DOM) so it is easy to test.
 * @param {number} total    classes conducted so far
 * @param {number} attended classes attended so far
 * @param {number} target   required attendance, in percent (e.g. 75)
 */
function computeAttendance(total, attended, target) {
  var pct = (attended / total) * 100;
  var EPS = 1e-9;

  if (pct + EPS >= target) {
    // Largest x with attended / (total + x) >= target/100
    var canMiss = Math.max(0, Math.floor((attended * 100) / target - total + EPS));
    return { pct: pct, status: canMiss > 0 ? 'above' : 'edge', canMiss: canMiss };
  }
  if (target >= 100) return { pct: pct, status: 'impossible' };

  // Smallest y with (attended + y) / (total + y) >= target/100 (attending every class)
  var need = Math.ceil((target * total - 100 * attended) / (100 - target) - EPS);
  return { pct: pct, status: 'below', need: need };
}

function runAttendance(e) {
  if (e) e.preventDefault();
  var out = document.getElementById('result');
  var total = Calc.num('total');
  var attended = Calc.num('attended');
  var target = Calc.num('target');

  if (!Number.isInteger(total) || total <= 0) return Calc.showError(out, 'Enter the total classes conducted as a whole number greater than 0.');
  if (!Number.isInteger(attended) || attended < 0) return Calc.showError(out, 'Enter classes attended as a whole number (0 or more).');
  if (attended > total) return Calc.showError(out, 'Classes attended cannot be more than classes conducted.');
  if (isNaN(target) || target < 1 || target > 100) return Calc.showError(out, 'Target attendance must be between 1 and 100.');

  var r = computeAttendance(total, attended, target);
  var details = [
    ['Classes attended / conducted', attended + ' / ' + total],
    ['Target attendance', Calc.fmt(target, target % 1 ? 1 : 0) + '%']
  ];
  var message, note;

  if (r.status === 'above') {
    message = 'You can miss <strong>' + r.canMiss + '</strong> more class' + (r.canMiss === 1 ? '' : 'es') + ' and still maintain target attendance.';
    details.push(['Attendance after missing ' + r.canMiss, Calc.fmt((attended / (total + r.canMiss)) * 100) + '%']);
    note = 'Assumes you attend every other class that is conducted.';
  } else if (r.status === 'edge') {
    message = 'You are right at the target. Missing even one more class will bring you below it.';
    note = 'Attend all upcoming classes to stay safe.';
  } else if (r.status === 'below') {
    message = 'You need <strong>' + r.need + '</strong> more class' + (r.need === 1 ? '' : 'es') + ' to reach target.';
    details.push(['Attendance after ' + r.need + ' more', Calc.fmt(((attended + r.need) / (total + r.need)) * 100) + '%']);
    note = 'Assumes you attend every upcoming class without missing any.';
  } else {
    message = 'A 100% target cannot be recovered once a class has been missed.';
    note = 'Ask your department whether a lower threshold or condonation applies.';
  }

  Calc.showResult(out, { label: 'Current attendance', value: Calc.fmt(r.pct) + '%', message: message, details: details, note: note });
}

document.getElementById('attendanceForm').addEventListener('submit', runAttendance);

if (typeof module !== 'undefined') module.exports = { computeAttendance: computeAttendance };
