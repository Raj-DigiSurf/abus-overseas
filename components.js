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
    const path = window.location.pathname.split('/').pop() || 'index.html';
    const hash = window.location.hash;
    const isIndex = path === 'index.html' || path === '';
    const isServices = path === 'services.html';
    const isDestinations = path === 'destinations.html';

    // Set active nav link based on page
    function setActiveNav(activeHref) {
      document.querySelectorAll('#main-nav .nav-links a').forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === activeHref);
      });
    }

    if (isServices) setActiveNav('services.html');
    else if (isDestinations) setActiveNav('destinations.html');
    else setActiveNav('index.html');

    // On index page — highlight About/Contact when scrolled to those sections
    if (isIndex) {
      const sections = [
        { id: 'about', href: 'index.html#about' },
        { id: 'contact', href: 'index.html#contact' },
      ];
      const navLinks = document.querySelectorAll('#main-nav .nav-links a');

      function updateNavOnScroll() {
        const scrollY = window.scrollY;
        const winH = window.innerHeight;
        let active = 'index.html';
        sections.forEach(({ id, href }) => {
          const el = document.getElementById(id);
          if (el && el.getBoundingClientRect().top < winH * 0.5) active = href;
        });
        navLinks.forEach(a => {
          const href = a.getAttribute('href');
          // Home active when at top, about/contact active when scrolled to them
          if (active === 'index.html') {
            a.classList.toggle('active', href === 'index.html');
          } else {
            a.classList.toggle('active', href === active);
          }
        });
      }

      window.addEventListener('scroll', updateNavOnScroll, { passive: true });
      // Run once on load
      setTimeout(updateNavOnScroll, 100);
    }

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
