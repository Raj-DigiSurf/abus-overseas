/* ═══════════════════════════════════════════════════════
   ABUS Overseas — Shared JavaScript
   main.js — loaded on every page
   ═══════════════════════════════════════════════════════ */

/* ── NAV SCROLL SHADOW ── */
(function () {
  function initNav() {
    var nav = document.getElementById('main-nav');
    if (!nav) return;
    window.addEventListener('scroll', function () {
      nav.classList.toggle('scrolled', window.scrollY > 30);
    }, { passive: true });
  }
  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', initNav)
    : initNav();
})();

/* ── MOBILE MENU ── */
window.toggleMenu = function () {
  var m  = document.getElementById('mobile-menu');
  var hb = document.getElementById('hamburger');
  if (!m || !hb) return;
  var open = m.classList.toggle('open');
  hb.classList.toggle('active', open);
  hb.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
};

document.addEventListener('click', function (e) {
  var m  = document.getElementById('mobile-menu');
  var hb = document.getElementById('hamburger');
  if (m && m.classList.contains('open') &&
      !m.contains(e.target) && hb && !hb.contains(e.target)) {
    m.classList.remove('open');
    hb.classList.remove('active');
    hb.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
});

/* ── CONTACT FORM ── */
window.handleSubmit = function (btn) {
  btn.textContent = "✅ Request Sent! We'll contact you shortly.";
  btn.style.background = '#27ae60';
  btn.disabled = true;
};

/* ── SCROLL REVEAL ── */
(function () {
  function initReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    if ('IntersectionObserver' in window) {
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('vis'); obs.unobserve(e.target); }
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
      els.forEach(function (el) { obs.observe(el); });
    } else {
      els.forEach(function (el) { el.classList.add('vis'); });
    }
    setTimeout(function () { els.forEach(function (el) { el.classList.add('vis'); }); }, 2000);
  }
  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', initReveal)
    : initReveal();
})();

/* ── TAB SCROLL-SPY (services & destinations) ── */
(function () {
  function initTabSpy() {
    var tabs = document.querySelectorAll('.tab');
    if (!tabs.length) return;
    var navH    = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 64;
    var stw     = document.querySelector('.stw');
    var tabBarH = stw ? stw.offsetHeight : 52;
    var offset  = navH + tabBarH + 16;

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function (e) {
        var target = document.querySelector(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
        }
      });
    });

    var ids      = Array.from(tabs).map(function (t) { return t.getAttribute('href').replace('#', ''); });
    var sections = ids.map(function (id) { return document.getElementById(id); }).filter(Boolean);

    function updateActiveTab() {
      var activeId = ids[0];
      var scrollY  = window.scrollY + offset + 40;
      sections.forEach(function (sec) { if (sec.offsetTop <= scrollY) activeId = sec.id; });
      tabs.forEach(function (tab) { tab.classList.toggle('active', tab.getAttribute('href') === '#' + activeId); });
      var active = document.querySelector('.tab.active');
      if (active) active.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }

    window.addEventListener('scroll', updateActiveTab, { passive: true });
    updateActiveTab();
  }
  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', initTabSpy)
    : initTabSpy();
})();

/* ── CAROUSEL (services page) ── */
(function () {
  var state = {};

  function initCarousel() {
    document.querySelectorAll('[id^="carousel-"]').forEach(function (w) {
      var sid    = w.id.replace('carousel-', '');
      var slides = w.querySelectorAll('.cslide');
      state[sid] = { cur: 0, total: slides.length };
      var sx = 0, sy = 0;
      w.addEventListener('touchstart', function (e) {
        sx = e.touches[0].clientX; sy = e.touches[0].clientY;
      }, { passive: true });
      w.addEventListener('touchend', function (e) {
        var dx = sx - e.changedTouches[0].clientX;
        var dy = Math.abs(sy - e.changedTouches[0].clientY);
        if (Math.abs(dx) > 40 && Math.abs(dx) > dy) window.move(sid, dx > 0 ? 1 : -1);
      }, { passive: true });
    });
  }

  window.goTo = function (sid, idx) {
    var s = state[sid]; if (!s) return;
    s.cur = Math.max(0, Math.min(idx, s.total - 1));
    render(sid);
  };
  window.move = function (sid, dir) {
    var s = state[sid]; if (s) window.goTo(sid, s.cur + dir);
  };

  function render(sid) {
    var s     = state[sid];
    var track = document.getElementById('track-' + sid);
    var dots  = document.getElementById('dots-'  + sid);
    var prev  = document.getElementById('prev-'  + sid);
    var next  = document.getElementById('next-'  + sid);
    if (!track || !s) return;
    track.style.transform = 'translateX(-' + (s.cur * 100) + '%)';
    if (dots) dots.querySelectorAll('.cd').forEach(function (d, i) { d.classList.toggle('ca', i === s.cur); });
    if (prev) prev.disabled = s.cur === 0;
    if (next) next.disabled = s.cur === s.total - 1;
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', initCarousel)
    : initCarousel();
})();

/* ── COUNTER ANIMATION ── */
(function () {
  function animateCounters() {
    document.querySelectorAll('.stat-big[data-target]').forEach(function (el) {
      var target   = parseInt(el.getAttribute('data-target'));
      var suffix   = el.getAttribute('data-suffix') || '';
      if (isNaN(target)) return;
      var current  = 0, steps = 60, duration = 1800;
      var inc = target / steps, interval = duration / steps;
      var timer = setInterval(function () {
        current = Math.min(current + inc, target);
        el.textContent = Math.floor(current) + suffix;
        if (current >= target) { clearInterval(timer); el.textContent = target + suffix; }
      }, interval);
    });
  }
  function init() {
    var stats = document.getElementById('stats');
    if (!stats) return;
    if ('IntersectionObserver' in window) {
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { animateCounters(); obs.unobserve(e.target); } });
      }, { threshold: 0.3 });
      obs.observe(stats);
    } else {
      animateCounters();
    }
  }
  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();
})();
