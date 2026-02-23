(() => {
  const header = document.querySelector('.site-header');
  const nav = document.querySelector('.nav');
  if (!header || !nav) return;

  const toggleNav = () => {
    const atTop = window.scrollY <= 4;
    header.classList.toggle('is-hidden', !atTop);
  };

  toggleNav();
  window.addEventListener('scroll', toggleNav, { passive: true });
})();
