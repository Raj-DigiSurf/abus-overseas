/* ═══════════════════════════════════════════════
   ABUS Overseas — Component Loader
   Loads header.html + footer.html into each page
   ═══════════════════════════════════════════════ */
(function () {

  var path = window.location.pathname.split('/').pop() || 'index.html';

  // ── Load a component into a target element ──
  function loadComponent(id, file, callback) {
    var el = document.getElementById(id);
    if (!el) return;
    fetch(file)
      .then(function(r) {
        if (!r.ok) throw new Error(file + ' returned ' + r.status);
        return r.text();
      })
      .then(function(html) {
        el.innerHTML = html;
        if (callback) callback();
      })
      .catch(function(err) {
        console.warn('Component load error:', err);
      });
  }

  // ── Set active nav link based on current page ──
  function setActiveNav() {
    var links = document.querySelectorAll('#main-nav .nav-links a[data-page]');
    links.forEach(function(a) {
      var page = a.getAttribute('data-page');
      var isActive =
        (page === 'home'         && (path === 'index.html' || path === '')) ||
        (page === 'services'     && path === 'services.html') ||
        (page === 'destinations' && path === 'destinations.html');
      a.classList.toggle('active', isActive);
    });
  }

  // ── Nav scroll shadow ──
  function initNavScroll() {
    var nav = document.getElementById('main-nav');
    if (!nav) return;
    window.addEventListener('scroll', function () {
      nav.classList.toggle('scrolled', window.scrollY > 30);
    }, { passive: true });
  }

  // ── Active nav on scroll (index page only) ──
  function initScrollSpy() {
    if (path !== 'index.html' && path !== '') return;
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('#main-nav .nav-links a');
    window.addEventListener('scroll', function () {
      var current = '';
      sections.forEach(function (sec) {
        if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
      });
      navLinks.forEach(function (a) {
        a.classList.remove('active');
        var href = a.getAttribute('href');
        if (href === '#' + current || href === 'index.html#' + current) {
          a.classList.add('active');
        }
        // Home active when at top
        if (!current && (href === 'index.html' || href === '#')) {
          a.classList.add('active');
        }
      });
    }, { passive: true });
  }

  // ── Initialise everything after header loads ──
  function initHeader() {
    setActiveNav();
    initNavScroll();
    initScrollSpy();
  }

  // ── Boot ──
  function init() {
    loadComponent('site-header', 'header.html', initHeader);
    loadComponent('site-footer', 'footer.html');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
