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

    const setScrolled = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 10);
    };

    const closeMenu = (returnFocus = false) => {
      if (!nav || !toggle || !overlay) return;
      document.body.classList.remove('nav-open');
      nav.classList.remove('is-open');
      overlay.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      if (returnFocus) toggle.focus();
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

    const listeners = [];
    const on = (el, event, handler, opts) => {
      el.addEventListener(event, handler, opts);
      listeners.push(() => el.removeEventListener(event, handler, opts));
    };

    const onScroll = () => setScrolled();
    on(window, 'scroll', onScroll, { passive: true });

    if (toggle && nav && overlay) {
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
        if (event.key === 'Escape') closeMenu(true);
      };

      on(toggle, 'click', onToggleClick);
      on(overlay, 'click', onOverlayClick);
      on(nav, 'click', onNavClick);
      on(document, 'keydown', onKeyDown);
    }

    setScrolled();

    cleanup = () => {
      closeMenu(false);
      listeners.forEach((off) => off());
    };
  };

  window.initSiteHeader = init;
  document.addEventListener('DOMContentLoaded', init);
})();
