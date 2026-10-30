/* Banner di installazione Appunti — Issue #2. Invito solo su smartphone e quando il browser lo consente. */
(function () {
  'use strict';

  var DISMISS_KEY = 'appunti-install-dismiss-until';
  var ONE_DAY_MS = 24 * 60 * 60 * 1000;
  var deferredPrompt = null;
  var installed = false;
  var initialized = false;
  var showTimer = null;
  var dismissedUntilMemory = 0;
  var banner = null;
  var installButton = null;

  function isSmartphone() {
    return Boolean((navigator.userAgentData && navigator.userAgentData.mobile) ||
      /Android.*Mobile|iPhone|iPod/i.test(navigator.userAgent || ''));
  }

  function isStandalone() {
    return Boolean(navigator.standalone ||
      ['standalone', 'fullscreen', 'minimal-ui'].some(function (mode) {
        return window.matchMedia && window.matchMedia('(display-mode: ' + mode + ')').matches;
      }));
  }

  function isDismissed() {
    if (dismissedUntilMemory > Date.now()) return true;
    try {
      var until = Number(localStorage.getItem(DISMISS_KEY));
      return Number.isFinite(until) && until > Date.now();
    } catch (error) { return false; }
  }

  function dismissForDay() {
    dismissedUntilMemory = Date.now() + ONE_DAY_MS;
    try { localStorage.setItem(DISMISS_KEY, String(dismissedUntilMemory)); }
    catch (error) { /* Preferenza non persistibile: il banner resta chiuso in questa visita. */ }
  }

  function updateVisible() {
    var notice = document.getElementById('pwa-update');
    return Boolean(notice && !notice.hidden);
  }

  function hide() {
    if (banner) banner.hidden = true;
  }

  function canShow() {
    return initialized && banner && deferredPrompt && !installed &&
      isSmartphone() && !isStandalone() && !isDismissed() && !updateVisible();
  }

  function showIfAllowed() {
    if (canShow()) banner.hidden = false;
  }

  function scheduleShow() {
    if (showTimer !== null) clearTimeout(showTimer);
    // Una breve pausa evita di interrompere immediatamente la lettura.
    showTimer = setTimeout(function () {
      showTimer = null;
      showIfAllowed();
    }, 1200);
  }

  /* L'evento arriva solo se il browser ritiene la PWA installabile. */
  window.addEventListener('beforeinstallprompt', function (event) {
    if (!isSmartphone() || isStandalone() || installed) return;
    event.preventDefault();
    if (isDismissed()) return; // Non mostrare neppure l'invito personalizzato.
    deferredPrompt = event;
    if (initialized) scheduleShow();
  });

  window.addEventListener('appinstalled', function () {
    installed = true;
    deferredPrompt = null;
    hide();
  });

  window.addEventListener('appunti:update-available', hide);
  window.addEventListener('appunti:update-dismissed', function () {
    if (canShow()) scheduleShow();
  });

  function init() {
    initialized = true;
    banner = document.getElementById('pwa-install');
    if (!banner) return;
    installButton = document.getElementById('pwa-install-action');
    var dismissButton = document.getElementById('pwa-install-dismiss');
    if (!installButton || !dismissButton) return;

    dismissButton.addEventListener('click', function () {
      dismissForDay();
      deferredPrompt = null; // L'evento è valido per questa pagina soltanto.
      hide();
    });

    installButton.addEventListener('click', async function () {
      if (!canShow()) { hide(); return; }
      var prompt = deferredPrompt;
      deferredPrompt = null; // Ogni BeforeInstallPromptEvent è utilizzabile una sola volta.
      hide();
      installButton.disabled = true;
      try {
        // Chiamata sincrona nel gesto dell'utente, richiesta dai browser.
        var result = await prompt.prompt();
        var choice = result && result.outcome ? result : await prompt.userChoice;
        if (choice && choice.outcome === 'accepted') {
          installed = true; // L'evento appinstalled confermerà l'installazione.
        } else {
          dismissForDay(); // Anche chi chiude il prompt ufficiale riceve 24h di pausa.
        }
      } catch (error) {
        // Il browser può rifiutare la richiesta (ad es. condizioni cambiate).
        dismissForDay();
        console.warn('Appunti PWA: installazione non avviata', error);
      } finally {
        installButton.disabled = false;
      }
    });

    if (deferredPrompt) scheduleShow();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
