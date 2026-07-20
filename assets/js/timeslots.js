/**
 * Interactive timeslot selection.
 * Nothing is preselected. Tapping a slot selects it (single-select) and shows the
 * remaining-capacity note. "Book Now" enables only when a slot is chosen AND T&C agreed.
 */
(function () {
  var slots = Array.prototype.slice.call(document.querySelectorAll('.slot'));
  var agree = document.getElementById('agreeBox');
  var book = document.getElementById('bookNowBtn');
  if (!book || !agree) return;

  var params = new URLSearchParams(location.search);
  var amenity = params.get('amenity') || 'Gym';
  var from = params.get('from') || '06_select_amenity.html';
  var titleEl = document.getElementById('amenityTitle');
  if (titleEl) titleEl.textContent = amenity;

  // Back arrow returns to the date page for the same amenity/source.
  var backBar = document.getElementById('backBar');
  if (backBar) {
    backBar.setAttribute(
      'data-nav',
      '07_gym_date.html?from=' + encodeURIComponent(from) + '&amenity=' + encodeURIComponent(amenity)
    );
  }

  var selected = null;
  var selectedTime = null;
  var agreed = agree.classList.contains('agree-box--checked');

  var MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  function fmtDate(ds) {
    var d = new Date(ds);
    if (isNaN(d.getTime())) return ds || '';
    return d.getDate() + ' ' + MON[d.getMonth()] + ' ' + d.getFullYear();
  }

  function fmtNow() {
    var d = new Date();
    var ap = d.getHours() >= 12 ? 'PM' : 'AM';
    var hh = ((d.getHours() + 11) % 12) + 1;
    var mm = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
    return hh + ':' + mm + ' ' + ap + ' · ' + d.getDate() + ' ' + MON[d.getMonth()] + ' ' + d.getFullYear();
  }

  // "7 PM - 8 PM" -> "7-8 PM"
  function compactTime(t) {
    var parts = String(t).split(/\s*-\s*/);
    if (parts.length !== 2) return t;
    var a = parts[0].trim();
    var b = parts[1].trim();
    var am = (a.match(/(AM|PM)$/i) || [])[0];
    var bm = (b.match(/(AM|PM)$/i) || [])[0];
    if (am && bm && am.toUpperCase() === bm.toUpperCase()) {
      return a.replace(/\s*(AM|PM)$/i, '') + '-' + b;
    }
    return a + '-' + b;
  }

  function updateBook() {
    if (selected && agreed) {
      book.classList.remove('btn-disabled');
      book.classList.add('btn-yellow');
      book.setAttribute('data-nav', '10_booking_success.html');
    } else {
      book.classList.add('btn-disabled');
      book.classList.remove('btn-yellow');
      book.removeAttribute('data-nav');
    }
  }

  function clearCapacity() {
    var existing = document.querySelectorAll('.slot-capacity');
    Array.prototype.forEach.call(existing, function (n) { n.remove(); });
  }

  slots.forEach(function (slot) {
    slot.addEventListener('click', function () {
      var box = slot.querySelector('.slot__box');

      // Toggle off if tapping the already-selected slot.
      if (selected === slot) {
        box.classList.remove('slot__box--checked');
        clearCapacity();
        selected = null;
        selectedTime = null;
        updateBook();
        return;
      }

      slots.forEach(function (s) {
        s.querySelector('.slot__box').classList.remove('slot__box--checked');
      });
      clearCapacity();

      box.classList.add('slot__box--checked');
      selected = slot;
      var timeEl = slot.querySelector('.slot__time');
      selectedTime = timeEl ? timeEl.textContent.trim() : null;

      var cap = document.createElement('div');
      cap.className = 'slot-capacity';
      cap.textContent = 'Remaining booking capacity is 18';
      slot.insertAdjacentElement('afterend', cap);

      updateBook();
    });
  });

  agree.addEventListener('click', function () {
    agreed = !agreed;
    agree.classList.toggle('agree-box--checked', agreed);
    updateBook();
  });

  // Runs before nav.js navigates (target-phase vs. document bubbling).
  book.addEventListener('click', function () {
    if (!book.getAttribute('data-nav') || !selectedTime) return;
    if (window.MGBookings) {
      window.MGBookings.add({
        amenity: amenity,
        date: fmtDate(sessionStorage.getItem('gk_booking_date') || ''),
        time: compactTime(selectedTime),
        bookedAt: fmtNow(),
        status: 'CONFIRMED'
      });
    }
  });

  updateBook();
})();
