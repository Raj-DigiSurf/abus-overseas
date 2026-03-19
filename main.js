/* ═══════════════════════════════════════════════════════════
   ABUS Overseas — Shared JavaScript
   Loaded on every page via <script src="main.js"></script>
   ═══════════════════════════════════════════════════════════ */

// ── NAV SCROLL SHADOW ──
(function() {
  function initNav() {
    const nav = document.getElementById('main-nav');
    if (nav) {
      window.addEventListener('scroll', function() {
        nav.classList.toggle('scrolled', window.scrollY > 30);
      }, { passive: true });
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNav);
  } else {
    initNav();
  }
})();

// ── MOBILE MENU TOGGLE ──
function toggleMenu() {
  var menu = document.getElementById('mobile-menu');
  var hb   = document.getElementById('hamburger');
  if (!menu || !hb) return;
  var isOpen = menu.classList.toggle('open');
  hb.classList.toggle('active', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

// ── CLOSE MENU ON OUTSIDE CLICK ──
document.addEventListener('click', function(e) {
  var menu = document.getElementById('mobile-menu');
  var hb   = document.getElementById('hamburger');
  if (menu && menu.classList.contains('open')) {
    if (!menu.contains(e.target) && hb && !hb.contains(e.target)) {
      menu.classList.remove('open');
      hb.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
});

// ── CONTACT FORM SUBMIT ──
function handleSubmit(btn) {
  btn.textContent = '✅ Message Sent! We\'ll be in touch within 24 hours.';
  btn.style.background = '#27ae60';
  btn.disabled = true;
}

// ── SCROLL REVEAL ANIMATIONS ──
(function() {
  function initReveal() {
    var reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;
    if ('IntersectionObserver' in window) {
      var obs = new IntersectionObserver(function(entries) {
        entries.forEach(function(e) {
          if (e.isIntersecting) { e.target.classList.add('vis'); obs.unobserve(e.target); }
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
      reveals.forEach(function(el) { obs.observe(el); });
    } else {
      reveals.forEach(function(el) { el.classList.add('vis'); });
    }
    setTimeout(function() { reveals.forEach(function(el) { el.classList.add('vis'); }); }, 2000);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initReveal);
  } else {
    initReveal();
  }
})();

// ── TAB SCROLL-SPY (services & destinations pages) ──
(function() {
  function initTabSpy() {
    var tabs = document.querySelectorAll('.tab');
    if (!tabs.length) return;
    var navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
    var stw = document.querySelector('.stw');
    var tabBarH = stw ? stw.offsetHeight : 48;
    var offset = navH + tabBarH + 16;

    tabs.forEach(function(tab) {
      tab.addEventListener('click', function(e) {
        var target = document.querySelector(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
        }
      });
    });

    var sectionIds = Array.from(tabs).map(function(t) { return t.getAttribute('href').replace('#',''); });
    var sections = sectionIds.map(function(id) { return document.getElementById(id); }).filter(Boolean);

    function updateActiveTab() {
      var activeId = sectionIds[0];
      var scrollY = window.scrollY + offset + 40;
      sections.forEach(function(sec) { if (sec.offsetTop <= scrollY) activeId = sec.id; });
      tabs.forEach(function(tab) { tab.classList.toggle('active', tab.getAttribute('href') === '#' + activeId); });
      var activeTab = document.querySelector('.tab.active');
      if (activeTab) activeTab.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }

    window.addEventListener('scroll', updateActiveTab, { passive: true });
    updateActiveTab();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTabSpy);
  } else {
    initTabSpy();
  }
})();

// ── CAROUSEL (services page) ──
(function() {
  var state = {};

  function initCarousel() {
    document.querySelectorAll('[id^="carousel-"]').forEach(function(w) {
      var sid = w.id.replace('carousel-', '');
      var slides = w.querySelectorAll('.cslide');
      state[sid] = { cur: 0, total: slides.length };
      // Touch swipe
      var sx = 0, sy = 0;
      w.addEventListener('touchstart', function(e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
      w.addEventListener('touchend', function(e) {
        var dx = sx - e.changedTouches[0].clientX;
        var dy = Math.abs(sy - e.changedTouches[0].clientY);
        if (Math.abs(dx) > 40 && Math.abs(dx) > dy) window.move(w.id.replace('carousel-',''), dx > 0 ? 1 : -1);
      }, { passive: true });
    });
  }

  window.goTo = function(sid, idx) {
    var s = state[sid]; if (!s) return;
    s.cur = Math.max(0, Math.min(idx, s.total - 1));
    renderCar(sid);
  };

  window.move = function(sid, dir) {
    var s = state[sid]; if (s) window.goTo(sid, s.cur + dir);
  };

  function renderCar(sid) {
    var s = state[sid];
    var track = document.getElementById('track-' + sid);
    var dotsEl = document.getElementById('dots-' + sid);
    var prev = document.getElementById('prev-' + sid);
    var next = document.getElementById('next-' + sid);
    if (!track || !s) return;
    track.style.transform = 'translateX(-' + (s.cur * 100) + '%)';
    if (dotsEl) dotsEl.querySelectorAll('.cd').forEach(function(d, i) { d.classList.toggle('ca', i === s.cur); });
    if (prev) prev.disabled = s.cur === 0;
    if (next) next.disabled = s.cur === s.total - 1;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCarousel);
  } else {
    initCarousel();
  }
})();
