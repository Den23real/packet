(() => {
  document.documentElement.classList.remove('no-js');
  document.documentElement.classList.add('js');

  const includes = document.querySelectorAll('[data-include]');
  if (!includes.length) return;

  const getCurrentPage = () => {
    const path = window.location.pathname;
    const file = path.split('/').pop();
    if (!file || file === '') return 'index.html';
    return file;
  };

  const setActiveNav = () => {
    const current = getCurrentPage();
    document.querySelectorAll('.nav-link').forEach((link) => {
      const href = link.getAttribute('href');
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
      setActiveNav();
      if (typeof window.initSiteHeader === 'function') {
        window.initSiteHeader();
      }
    } catch (err) {
      console.warn(`[partials] ${err.message}`);
      setActiveNav();
    }
  };

  setActiveNav();
  includes.forEach(loadInclude);
})();
