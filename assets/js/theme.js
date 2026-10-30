/* Appunti - selettore tema condiviso: funziona anche su GitHub Pages, senza framework. */
(function () {
  'use strict';
  var storageKey = 'appunti-theme-v1';
  var root = document.documentElement;
  var chosen = null;
  try { chosen = localStorage.getItem(storageKey); } catch (error) {}
  var theme = chosen === 'light' ? 'light' : 'dark'; // mantieni scuro come impostazione predefinita
  root.setAttribute('data-theme', theme);

  function refresh() {
    var isLight = root.getAttribute('data-theme') === 'light';
    var buttons = document.querySelectorAll('[data-theme-toggle]');
    buttons.forEach(function (button) {
      var label = isLight ? 'Passa al tema scuro' : 'Passa al tema chiaro';
      button.setAttribute('aria-label', label);
      button.setAttribute('title', label);
      button.setAttribute('aria-pressed', String(isLight));
      var icon = button.querySelector('.theme-toggle-icon');
      var text = button.querySelector('.theme-toggle-label');
      if (icon) icon.textContent = isLight ? '☾' : '☀';
      if (text) text.textContent = isLight ? 'Tema scuro' : 'Tema chiaro';
    });
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', isLight ? '#ffffff' : '#0c1422');
  }

  function setTheme(next, persist) {
    if (next !== 'light' && next !== 'dark') return;
    root.setAttribute('data-theme', next);
    if (persist) {
      try { localStorage.setItem(storageKey, next); } catch (error) {}
    }
    refresh();
  }

  function initialize() {
    document.querySelectorAll('[data-theme-toggle]').forEach(function (button) {
      button.addEventListener('click', function () {
        var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        setTheme(next, true);
      });
    });
    refresh();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
  window.addEventListener('storage', function (event) {
    if (event.key === storageKey) setTheme(event.newValue === 'light' ? 'light' : 'dark', false);
  });
})();
