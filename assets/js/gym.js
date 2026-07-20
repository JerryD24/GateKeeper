/**
 * Dynamic gym date picker.
 * Renders the current month and makes ONLY today + tomorrow selectable,
 * recomputed every time the page loads. Selecting a date enables "Select Timeslot".
 */
(function () {
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  var gridEl = document.getElementById('calGrid');
  var monthEl = document.getElementById('calMonth');
  var btn = document.getElementById('selectTimeslotBtn');
  if (!gridEl || !monthEl || !btn) return;

  // Carry the chosen amenity name through the flow (?amenity=...).
  var amenity = new URLSearchParams(location.search).get('amenity') || 'Gym';
  var titleEl = document.getElementById('amenityTitle');
  if (titleEl) titleEl.textContent = amenity;

  var today = new Date();
  today.setHours(0, 0, 0, 0);
  var tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  var year = today.getFullYear();
  var month = today.getMonth();
  monthEl.textContent = MONTHS[month] + ' ' + year;

  function sameDay(a, b) {
    return a.getFullYear() === b.getFullYear()
      && a.getMonth() === b.getMonth()
      && a.getDate() === b.getDate();
  }

  // Grid starts on the Sunday on/before the 1st of the month.
  var first = new Date(year, month, 1);
  var start = new Date(year, month, 1 - first.getDay());

  var selected = null;

  function selectCell(cell, d) {
    if (selected) {
      selected.classList.remove('cal-cell--selected');
      selected.classList.add('cal-cell--avail');
    }
    cell.classList.remove('cal-cell--avail');
    cell.classList.add('cal-cell--selected');
    selected = cell;
    btn.classList.remove('btn-disabled');
    btn.classList.add('btn-yellow');
    btn.setAttribute('data-nav', '09_gym_timeslots.html?amenity=' + encodeURIComponent(amenity));
    try {
      sessionStorage.setItem('gk_booking_date', d.toDateString());
    } catch (e) { /* ignore */ }
  }

  for (var i = 0; i < 42; i++) {
    var d = new Date(start);
    d.setDate(start.getDate() + i);
    var cell = document.createElement('span');
    cell.className = 'cal-cell';
    cell.textContent = d.getDate();

    if (sameDay(d, today) || sameDay(d, tomorrow)) {
      cell.classList.add('cal-cell--avail');
      (function (c, date) {
        c.addEventListener('click', function () { selectCell(c, date); });
      })(cell, d);
    } else {
      cell.classList.add('cal-cell--muted');
    }
    gridEl.appendChild(cell);
  }
})();
