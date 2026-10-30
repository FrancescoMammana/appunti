/* Registrazione del Service Worker unico e aggiornamenti controllati. */
(function () {
  'use strict';
  if (!('serviceWorker' in navigator)) return;
  var script = document.currentScript;
  var workerUrl = script && script.getAttribute('data-sw-src');
  if (!workerUrl) return;
  var reloadScheduled = false;
  var currentRegistration = null;

  function showUpdate() {
    var element = document.getElementById('pwa-update');
    if (element && currentRegistration && currentRegistration.waiting) element.hidden = false;
  }

  function hideUpdate() {
    var element = document.getElementById('pwa-update');
    if (element) element.hidden = true;
  }

  function setupButtons() {
    var action = document.getElementById('pwa-update-action');
    var dismiss = document.getElementById('pwa-update-dismiss');
    if (action) action.addEventListener('click', function () {
      if (currentRegistration && currentRegistration.waiting) {
        currentRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
      }
    });
    if (dismiss) dismiss.addEventListener('click', hideUpdate);
  }

  navigator.serviceWorker.addEventListener('controllerchange', function () {
    if (reloadScheduled) return;
    reloadScheduled = true;
    window.location.reload();
  });

  function watch(registration) {
    currentRegistration = registration;
    if (registration.waiting && navigator.serviceWorker.controller) showUpdate();
    registration.addEventListener('updatefound', function () {
      var worker = registration.installing;
      if (!worker) return;
      worker.addEventListener('statechange', function () {
        if (worker.state === 'installed' && navigator.serviceWorker.controller) showUpdate();
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupButtons();
    navigator.serviceWorker.register(workerUrl, { scope: workerUrl.replace(/sw\.js(?:\?.*)?$/, '') })
      .then(function (reg) {
        watch(reg);
        if (navigator.onLine) reg.update().catch(function () {});
        document.addEventListener('visibilitychange', function () {
          if (!document.hidden && navigator.onLine) reg.update().catch(function () {});
        });
      })
      .catch(function (error) { console.warn('Appunti PWA: registrazione non riuscita', error); });
  });
})();
