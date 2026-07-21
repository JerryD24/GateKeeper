/**
 * Multi-profile support.
 * The active profile is stored per-device in localStorage, so two people can
 * open the same app on their own phones and each pick their own profile.
 * Add more profiles by extending PROFILES below.
 */
(function () {
  var KEY = 'mg_active_profile';

  var PROFILES = {
    yogender: {
      key: 'yogender',
      name: 'yogender singh',
      initials: 'YS',
      id: '288 903',
      color: '#b3982f',
      completion: 0,
      flat: 'T7B 1904',
      address: '19th Floor, T7B 1904, Rejuve Co-Operative Housing Society Limited, Survey no: 9 to 14, near Renuka Mata mandir, Pune-411036',
      housemates: '3 members',
      dailyHelp: 'Sarika Gaikwad',
      alwaysApprove: 'Zomato, +6'
    },
    kartik: {
      key: 'kartik',
      name: 'Kartik Raina',
      initials: 'KR',
      id: '512 447',
      color: '#3f6ad8',
      completion: 60,
      flat: 'T3A 0802',
      address: '8th Floor, T3A 0802, Rejuve Co-Operative Housing Society Limited, Survey no: 9 to 14, near Renuka Mata mandir, Pune-411036',
      housemates: '2 members',
      dailyHelp: 'Meena Kumari',
      alwaysApprove: 'Swiggy, +3'
    }
  };

  var ORDER = ['yogender', 'kartik'];

  function activeKey() {
    try { return localStorage.getItem(KEY) || 'yogender'; }
    catch (e) { return 'yogender'; }
  }
  function setActive(k) {
    try { localStorage.setItem(KEY, k); } catch (e) { /* ignore */ }
  }
  function get(k) { return PROFILES[k] || PROFILES.yogender; }
  function active() { return get(activeKey()); }

  function setText(id, text) {
    var el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function renderSettings(p) {
    if (!document.getElementById('profName')) return; // not the settings page
    setText('profName', p.name);
    setText('profInitials', p.initials);
    setText('profId', p.id);
    setText('ringInner', p.completion + '%');
    setText('addrBody', p.address);
    setText('hhHousemates', p.housemates);
    setText('hhDailyHelp', p.dailyHelp);
    setText('hhAlwaysApprove', p.alwaysApprove);

    var av = document.getElementById('profAvatar');
    if (av) av.style.background = p.color;

    var ring = document.getElementById('ring');
    if (ring) {
      ring.style.background =
        'conic-gradient(#e8607a 0 ' + p.completion + '%, #f4dfe4 ' + p.completion + '% 100%)';
    }
  }

  var CHECK = '<svg class="psheet__check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>';

  function initSwitcher() {
    var sheet = document.getElementById('profileSheet');
    var backdrop = document.getElementById('profileBackdrop');
    var list = document.getElementById('profileSheetList');
    if (!sheet || !backdrop || !list) return;

    list.innerHTML = '';
    ORDER.forEach(function (k) {
      var pr = PROFILES[k];
      var isActive = k === activeKey();
      var row = document.createElement('div');
      row.className = 'psheet__item' + (isActive ? ' psheet__item--active' : '');
      row.innerHTML =
        '<span class="psheet__av" style="background:' + pr.color + '">' + pr.initials + '</span>' +
        '<span class="psheet__meta"><span class="psheet__name">' + pr.name + '</span>' +
        '<span class="psheet__id">mygate ID ' + pr.id + '</span></span>' +
        (isActive ? CHECK : '');
      row.addEventListener('click', function () {
        setActive(k);
        window.location.reload();
      });
      list.appendChild(row);
    });

    function open() { sheet.classList.add('open'); backdrop.classList.add('open'); }
    function close() { sheet.classList.remove('open'); backdrop.classList.remove('open'); }

    backdrop.addEventListener('click', close);
    var closeBtn = document.getElementById('profileSheetClose');
    if (closeBtn) closeBtn.addEventListener('click', close);
    var trigger = document.getElementById('switchProfile');
    if (trigger) trigger.addEventListener('click', open);
    var av = document.getElementById('profAvatar');
    if (av) av.addEventListener('click', open);
  }

  window.MGProfiles = {
    PROFILES: PROFILES, ORDER: ORDER,
    active: active, activeKey: activeKey, setActive: setActive, get: get
  };

  document.addEventListener('DOMContentLoaded', function () {
    var p = active();

    var av = document.querySelector('.home-avatar');
    if (av) { av.textContent = p.initials; av.style.background = p.color; }
    var flat = document.querySelector('.home-flat__no');
    if (flat && p.flat) flat.textContent = p.flat;

    renderSettings(p);
    initSwitcher();
  });
})();
