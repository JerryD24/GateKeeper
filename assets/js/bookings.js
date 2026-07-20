/**
 * Persistent "My Bookings" store (localStorage).
 * timeslots.js calls MGBookings.add() after a slot is booked; the amenities
 * screen renders saved bookings at the top of My Bookings with Edit / Cancel.
 */
(function () {
  var KEY = 'mg_bookings';

  function read() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch (e) { return []; }
  }

  function write(list) {
    try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) { /* ignore */ }
  }

  function add(booking) {
    var list = read();
    booking.id = booking.id || String(Date.now());
    list.unshift(booking);
    write(list);
    return booking.id;
  }

  function remove(id) {
    write(read().filter(function (b) { return String(b.id) !== String(id); }));
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  var CAL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/></svg>';
  var RUP = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M9 8h6M9 12h6M10 8c3 0 3 4 0 4M9 16l4-4"/></svg>';
  var XIC = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg>';

  function render(container) {
    if (!container) return;
    var list = read();
    container.innerHTML = '';
    list.forEach(function (b) {
      var card = document.createElement('div');
      card.className = 'mb-card';
      card.innerHTML =
        '<div class="mb-card__title">' + esc(b.amenity) + '</div>' +
        '<div class="mb-card__meta"><span class="mb-pill mb-pill--confirmed">CONFIRMED</span>' +
        '<span class="mb-card__metatime">' + esc(b.bookedAt) + '</span></div>' +
        '<div class="mb-card__row">' + CAL + esc(b.date) + '&nbsp;&nbsp;' + esc(b.time) + '</div>' +
        '<div class="mb-card__row">' + RUP + 'Free</div>' +
        '<div class="mb-actions">' +
          '<span class="mb-actions__btn mb-edit">Edit</span>' +
          '<span class="mb-actions__btn mb-cancel">' + XIC + ' Cancel</span>' +
        '</div>';

      card.querySelector('.mb-cancel').addEventListener('click', function () {
        remove(b.id);
        render(container);
      });
      card.querySelector('.mb-edit').addEventListener('click', function () {
        window.location.href = '07_gym_date.html?from=04_amenities.html&amenity=' + encodeURIComponent(b.amenity);
      });

      container.appendChild(card);
    });
  }

  window.MGBookings = { add: add, remove: remove, all: read, render: render };

  document.addEventListener('DOMContentLoaded', function () {
    render(document.getElementById('myBookingsDynamic'));
  });
})();
