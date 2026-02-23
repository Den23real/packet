(() => {
  const init = () => {
    const header = document.querySelector('[data-site-header]') || document.querySelector('.site-header');
    if (!header || header.dataset.inited === 'true') return;

    const nav = header.querySelector('[data-nav]');
    const toggle = header.querySelector('.nav-toggle');
    const overlay = header.querySelector('[data-nav-overlay]');

    header.dataset.inited = 'true';

    const setScrolled = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 10);
    };

    const openMenu = () => {
      if (!nav || !toggle || !overlay) return;
      document.body.classList.add('nav-open');
      nav.classList.add('is-open');
      overlay.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
      const firstLink = nav.querySelector('a, button');
      if (firstLink) firstLink.focus();
    };

    const closeMenu = () => {
      if (!nav || !toggle || !overlay) return;
      document.body.classList.remove('nav-open');
      nav.classList.remove('is-open');
      overlay.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.focus();
    };

    if (toggle && nav && overlay) {
      toggle.addEventListener('click', () => {
        const isOpen = nav.classList.contains('is-open');
        if (isOpen) closeMenu();
        else openMenu();
      });

      overlay.addEventListener('click', closeMenu);

      nav.addEventListener('click', (event) => {
        const target = event.target;
        if (target && target.tagName === 'A') closeMenu();
      });

      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeMenu();
      });
    }

    setScrolled();
    window.addEventListener('scroll', setScrolled, { passive: true });
  };

  window.initSiteHeader = init;
  document.addEventListener('DOMContentLoaded', init);
})();
