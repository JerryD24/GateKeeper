/**
 * Shared navigation + status bar helpers for MyGate clone screens.
 * Include on every screen page: <script src="../assets/js/nav.js"></script>
 */
(function () {
  // Keep the iOS status bar clock live.
  function tickClock() {
    var el = document.querySelector('.statusbar__time');
    if (!el) return;
    var now = new Date();
    var h = now.getHours();
    var m = now.getMinutes();
    var hh = ((h + 11) % 12) + 1;
    el.textContent = hh + ':' + (m < 10 ? '0' + m : m);
  }

  document.addEventListener('DOMContentLoaded', function () {
    tickClock();
    setInterval(tickClock, 10000);
  });

  /** Navigate between screens: data-nav="02_home.html" on any tappable element. */
  document.addEventListener('click', function (e) {
    var target = e.target.closest('[data-nav]');
    if (!target) return;
    var dest = target.getAttribute('data-nav');
    if (dest) window.location.href = dest;
  });
})();
