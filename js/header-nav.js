(() => {
  let cleanup = null;

  const init = () => {
    if (typeof cleanup === 'function') {
      cleanup();
      cleanup = null;
    }

    const header = document.querySelector('[data-site-header]') || document.querySelector('.site-header');
    if (!header) return;

    const nav = header.querySelector('[data-nav]');
    const toggle = header.querySelector('.nav-toggle');
    const overlay = header.querySelector('[data-nav-overlay]');
    const mobile = window.matchMedia('(max-width: 980px)');

    const setScrolled = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 10);
    };

    const closeMenu = (returnFocus = false) => {
      if (!nav || !toggle || !overlay) return;
      document.body.classList.remove('nav-open');
      nav.classList.remove('is-open');
      overlay.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Открыть меню');
      nav.inert = mobile.matches;
      if (returnFocus) toggle.focus();
    };

    const openMenu = () => {
      if (!nav || !toggle || !overlay) return;
      if (!mobile.matches) return;
      nav.inert = false;
      document.body.classList.add('nav-open');
      nav.classList.add('is-open');
      overlay.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Закрыть меню');
      const firstLink = nav.querySelector('a, button');
      if (firstLink) firstLink.focus();
    };

    const listeners = [];
    const on = (el, event, handler, opts) => {
      el.addEventListener(event, handler, opts);
      listeners.push(() => el.removeEventListener(event, handler, opts));
    };

    const onScroll = () => setScrolled();
    on(window, 'scroll', onScroll, { passive: true });

    if (toggle && nav && overlay) {
      header.classList.add('nav-ready');
      closeMenu();
      const onToggleClick = () => {
        const isOpen = nav.classList.contains('is-open');
        if (isOpen) closeMenu(true);
        else openMenu();
      };

      const onOverlayClick = () => closeMenu(true);
      const onNavClick = (event) => {
        const target = event.target;
        if (target && target.tagName === 'A') closeMenu(false);
      };

      const onKeyDown = (event) => {
        if (!nav.classList.contains('is-open')) return;
        if (event.key === 'Escape') closeMenu(true);
        if (event.key === 'Tab') {
          const links = Array.from(nav.querySelectorAll('a[href], button:not([disabled])'));
          const first = links[0];
          const last = links[links.length - 1];
          if (!first) return;
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }
      };

      on(toggle, 'click', onToggleClick);
      on(overlay, 'click', onOverlayClick);
      on(nav, 'click', onNavClick);
      on(document, 'keydown', onKeyDown);
      on(mobile, 'change', () => {
        const focusInNav = nav.contains(document.activeElement);
        closeMenu(mobile.matches && focusInNav);
      });
    }

    setScrolled();

    cleanup = () => {
      closeMenu(false);
      header.classList.remove('nav-ready');
      if (nav) nav.inert = false;
      listeners.forEach((off) => off());
    };
  };

  window.initSiteHeader = init;
  document.addEventListener('DOMContentLoaded', init);
})();
