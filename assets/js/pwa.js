/**
 * PWA bootstrap — service worker registration + custom install button.
 * Safe to include on every page (root or /screens/).
 */
(function () {
  // Register the root-scoped service worker.
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      var inScreens = /\/screens\//.test(location.pathname);
      var swPath = (inScreens ? '../' : './') + 'sw.js';
      navigator.serviceWorker.register(swPath, { updateViaCache: 'none' })
        .then(function (reg) { reg.update(); })
        .catch(function () { /* offline support unavailable */ });
    });
  }

  // Custom install prompt (button with id="installBtn").
  var deferredPrompt = null;

  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferredPrompt = e;
    var btn = document.getElementById('installBtn');
    if (btn) btn.style.display = 'inline-flex';
  });

  window.addEventListener('appinstalled', function () {
    deferredPrompt = null;
    var btn = document.getElementById('installBtn');
    if (btn) btn.style.display = 'none';
  });

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('#installBtn');
    if (!btn || !deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.finally(function () {
      deferredPrompt = null;
      btn.style.display = 'none';
    });
  });
})();
