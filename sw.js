/* GateKeeper service worker — app-shell cache, network-first for freshness. */
const CACHE = 'mygate-v7';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './assets/img/logo.png',
  './assets/css/reset.css',
  './assets/css/phone.css',
  './assets/css/mygate.css',
  './assets/css/home.css',
  './assets/css/amenities.css',
  './assets/css/gym-date.css',
  './assets/js/nav.js',
  './assets/js/pwa.js',
  './assets/js/gym.js',
  './assets/js/timeslots.js',
  './assets/js/bookings.js',
  './screens/02_home.html',
  './screens/03_quick_actions.html',
  './screens/04_amenities.html',
  './screens/05_choose_location.html',
  './screens/06_select_amenity.html',
  './screens/07_gym_date.html',
  './screens/09_gym_timeslots.html',
  './screens/10_booking_success.html',
  './screens/11_outdoor_games.html',
  './screens/12_indoor_games.html',
  './screens/13_settings.html'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  e.respondWith(
    fetch(req)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(req).then((hit) => hit || caches.match('./index.html')))
  );
});
