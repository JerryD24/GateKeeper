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

  var selected = null;
  var agreed = agree.classList.contains('agree-box--checked');

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
        updateBook();
        return;
      }

      slots.forEach(function (s) {
        s.querySelector('.slot__box').classList.remove('slot__box--checked');
      });
      clearCapacity();

      box.classList.add('slot__box--checked');
      selected = slot;

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

  updateBook();
})();
