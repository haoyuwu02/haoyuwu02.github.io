// Progressive enhancement only: dark/light toggle + on-scroll masthead blur.
// The site is fully correct with this file missing or blocked —
// prefers-color-scheme still drives dark mode, and the masthead still works, unscrolled.
(function () {
  document.documentElement.classList.add('js');

  var header = document.querySelector('header.masthead');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 24);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Initial data-theme (if any) is already set by the inline snippet in <head>,
  // so there is no flash of the wrong theme on load.
  var toggle = document.querySelector('.theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var root = document.documentElement;
      var current = root.getAttribute('data-theme') ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      var next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }
})();
