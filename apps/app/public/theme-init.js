// FOIT prevention: apply .dark class before first paint.
// Must stay in sync with ThemeProvider.tsx (same key, same resolution logic).
(function () {
  try {
    var p = localStorage.getItem('theme-preference');
    var dark =
      p === 'dark' ||
      (p !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (dark) document.documentElement.classList.add('dark');
  } catch (e) {}
})();
