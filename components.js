/* ABUS Overseas — Component Loader
 * Loads header.html and footer.html into each page.
 * Usage: <script src="components.js"></script>
 * Place <div id="site-header"></div> and <div id="site-footer"></div> in each page.
 */
(function() {
  // Detect current page for active nav highlighting
  const path = window.location.pathname.split('/').pop() || 'index.html';
  const isIndex = path === 'index.html' || path === '';
  const isServices = path === 'services.html';
  const isDestinations = path === 'destinations.html';

  function loadComponent(id, file, callback) {
    const el = document.getElementById(id);
    if (!el) return;
    fetch(file)
      .then(r => r.text())
      .then(html => {
        el.innerHTML = html;
        if (callback) callback();
      })
      .catch(err => console.warn('Component load failed:', file, err));
  }

  function initHeader() {
    // Set active nav link
    const links = document.querySelectorAll('#main-nav .nav-links a');
    links.forEach(a => {
      a.classList.remove('active');
      const page = a.getAttribute('data-page');
      if (isServices && page === 'services') a.classList.add('active');
      else if (isDestinations && page === 'destinations') a.classList.add('active');
      else if (isIndex && page === 'home' && a.getAttribute('href') === 'index.html') a.classList.add('active');
    });

    // Nav scroll shadow
    const nav = document.getElementById('main-nav');
    if (nav) {
      window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 30);
      }, { passive: true });
    }

    // Mobile menu toggle (define globally)
    window.toggleMenu = function() {
      const menu = document.getElementById('mobile-menu');
      const hb = document.getElementById('hamburger');
      if (!menu || !hb) return;
      const isOpen = menu.classList.toggle('open');
      hb.classList.toggle('active', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    // Close menu on outside click
    document.addEventListener('click', function(e) {
      const menu = document.getElementById('mobile-menu');
      const hb = document.getElementById('hamburger');
      if (menu && menu.classList.contains('open')) {
        if (!menu.contains(e.target) && !hb.contains(e.target)) {
          menu.classList.remove('open');
          hb.classList.remove('active');
          document.body.style.overflow = '';
        }
      }
    });
  }

  // Load when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    loadComponent('site-header', 'header.html', initHeader);
    loadComponent('site-footer', 'footer.html');
  }
})();
