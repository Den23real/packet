(() => {
  document.documentElement.classList.remove('no-js');
  document.documentElement.classList.add('js');

  const includes = document.querySelectorAll('[data-include]');
  if (!includes.length) return;

  const normalizeHref = (href) => {
    if (!href) return '';
    const clean = href.split('#')[0].split('?')[0];
    if (!clean || clean === '/') return 'index.html';
    const file = clean.split('/').pop();
    return file || 'index.html';
  };

  const getCurrentPage = () => {
    const path = window.location.pathname;
    const file = path.split('/').pop() || 'index.html';
    return normalizeHref(file);
  };

  const setActiveNav = () => {
    const current = getCurrentPage();
    document.querySelectorAll('.nav-link').forEach((link) => {
      const href = normalizeHref(link.getAttribute('href'));
      if (!href) return;
      const isActive = href === current;
      link.classList.toggle('is-active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  const loadInclude = async (el) => {
    const url = el.getAttribute('data-include');
    if (!url) return;
    try {
      const res = await fetch(url, { cache: 'no-cache' });
      if (!res.ok) throw new Error(`Failed to load ${url}`);
      const html = await res.text();
      el.innerHTML = html;
    } catch (err) {
      console.warn(`[partials] ${err.message}`);
    }
  };

  const init = async () => {
    await Promise.all(Array.from(includes, loadInclude));
    setActiveNav();
    if (typeof window.initSiteHeader === 'function') {
      window.initSiteHeader();
    }
  };

  init();
})();
