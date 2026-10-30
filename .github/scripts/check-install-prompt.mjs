/* Test comportamentali del banner PWA. Eseguibili con Node, senza dipendenze esterne. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync('_site/assets/js/install-prompt.js', 'utf8');
const DAY = 24 * 60 * 60 * 1000;
const KEY = 'appunti-install-dismiss-until';
const uaMobile = 'Mozilla/5.0 (Linux; Android 16; Pixel 8) AppleWebKit Chrome/140 Mobile Safari/537.36';
const uaDesktop = 'Mozilla/5.0 (X11; Linux x86_64) Chrome/140 Safari/537.36';

function scenario({ now = 1_000_000, store = new Map(), ua = uaMobile, standalone = false, updateVisible = false, storageBlocked = false } = {}) {
  const windowEvents = new Map(), documentEvents = new Map();
  const timers = [], warnings = [];
  const listen = (target, name, callback) => {
    if (!target.has(name)) target.set(name, []);
    target.get(name).push(callback);
  };
  const invoke = (target, name, event) => (target.get(name) || []).map(fn => fn(event));
  const elements = {};
  for (const id of ['pwa-install', 'pwa-install-action', 'pwa-install-dismiss', 'pwa-update']) {
    elements[id] = {
      hidden: true, disabled: false, handlers: new Map(),
      addEventListener(type, callback) { this.handlers.set(type, callback); },
      click() { const listener = this.handlers.get('click'); assert.ok(listener, 'Missing click handler for ' + id); return listener(); }
    };
  }
  elements['pwa-update'].hidden = !updateVisible;
  const window = {
    matchMedia(query) { return { matches: standalone && query.includes('standalone') }; },
    addEventListener(type, callback) { listen(windowEvents, type, callback); },
    dispatchEvent(event) { invoke(windowEvents, event.type, event); }
  };
  const document = {
    readyState: 'loading',
    getElementById(id) { return elements[id] || null; },
    addEventListener(type, callback) { listen(documentEvents, type, callback); }
  };
  const storage = {
    getItem(key) {
      if (storageBlocked) throw new Error('Storage disabled');
      return store.has(key) ? store.get(key) : null;
    },
    setItem(key, value) {
      if (storageBlocked) throw new Error('Storage disabled');
      store.set(key, value);
    }
  };
  const sandbox = {
    window, document, navigator: { userAgent: ua, standalone: false },
    localStorage: storage,
    Date: { now: () => now }, Number,
    setTimeout(callback) { const timer = { callback, cancelled: false }; timers.push(timer); return timer; },
    clearTimeout(timer) { if (timer) timer.cancelled = true; },
    console: { warn(...args) { warnings.push(args); } }
  };
  vm.runInNewContext(source, sandbox, { filename: 'install-prompt.js' });
  const emit = (name, event = {}) => invoke(windowEvents, name, event);
  const beforeInstall = (outcome = 'accepted') => {
    const record = { prevented: false, calls: 0 };
    emit('beforeinstallprompt', {
      preventDefault() { record.prevented = true; },
      prompt() { record.calls++; return Promise.resolve({ outcome }); },
      userChoice: Promise.resolve({ outcome })
    });
    return record;
  };
  return {
    elements, store, warnings, beforeInstall, emit,
    boot() { invoke(documentEvents, 'DOMContentLoaded', {}); },
    runTimers() {
      while (timers.length) {
        const timer = timers.shift();
        if (!timer.cancelled) timer.callback();
      }
    },
    shown() { return !elements['pwa-install'].hidden; }
  };
}

{
  const env = scenario();
  env.boot();
  env.runTimers();
  assert.equal(env.shown(), false, 'No invite without beforeinstallprompt');
}
{
  const env = scenario({ ua: uaDesktop });
  env.boot();
  const prompt = env.beforeInstall();
  env.runTimers();
  assert.equal(prompt.prevented, false, 'Desktop browser should keep native handling');
  assert.equal(env.shown(), false, 'No banner on desktop');
}
{
  const env = scenario({ standalone: true });
  env.boot();
  const prompt = env.beforeInstall();
  env.runTimers();
  assert.equal(prompt.prevented, false, 'Standalone app must not intercept install');
  assert.equal(env.shown(), false, 'Installed app must not see install banner');
}
{
  const store = new Map();
  const env = scenario({ store });
  env.boot();
  const prompt = env.beforeInstall();
  env.runTimers();
  assert.equal(prompt.prevented, true, 'Custom banner must defer native prompt');
  assert.equal(env.shown(), true, 'Eligible mobile should see banner');
  env.elements['pwa-install-dismiss'].click();
  assert.equal(env.shown(), false, 'Non ora closes banner');
  assert.equal(Number(store.get(KEY)), 1_000_000 + DAY, 'Non ora must last exactly 24 hours');
  const early = scenario({ now: 1_000_000 + DAY - 1, store });
  early.boot();
  early.beforeInstall();
  early.runTimers();
  assert.equal(early.shown(), false, 'No banner before 24-hour expiry');
  const after = scenario({ now: 1_000_000 + DAY, store });
  after.boot();
  after.beforeInstall();
  after.runTimers();
  assert.equal(after.shown(), true, 'Eligible again after exactly 24 hours');
}
{
  const env = scenario();
  const early = env.beforeInstall();
  assert.equal(early.prevented, true, 'Listener must work before DOMContentLoaded');
  env.boot();
  env.runTimers();
  assert.equal(env.shown(), true, 'Deferred prompt should show once DOM is ready');
  await env.elements['pwa-install-action'].click();
  assert.equal(early.calls, 1, 'Install button must call browser prompt once');
  assert.equal(env.shown(), false, 'Banner closes after install');
}
{
  const store = new Map();
  const env = scenario({ store });
  env.boot();
  const prompt = env.beforeInstall('dismissed');
  env.runTimers();
  await env.elements['pwa-install-action'].click();
  assert.equal(prompt.calls, 1, 'Native prompt called on tap');
  assert.equal(Number(store.get(KEY)), 1_000_000 + DAY, 'Browser prompt dismissal pauses for 24h');
}
{
  const env = scenario();
  env.boot();
  env.beforeInstall();
  env.runTimers();
  assert.equal(env.shown(), true);
  env.emit('appinstalled');
  assert.equal(env.shown(), false, 'appinstalled hides banner');
  env.beforeInstall();
  env.runTimers();
  assert.equal(env.shown(), false, 'No reminder after installation');
}
{
  const env = scenario({ updateVisible: true });
  env.boot();
  env.beforeInstall();
  env.runTimers();
  assert.equal(env.shown(), false, 'Update notice takes priority');
  env.elements['pwa-update'].hidden = true;
  env.emit('appunti:update-dismissed');
  env.runTimers();
  assert.equal(env.shown(), true, 'Install banner returns when update is dismissed');
  env.emit('appunti:update-available');
  assert.equal(env.shown(), false, 'Update notice hides install banner');
}
{
  const env = scenario({ storageBlocked: true });
  env.boot();
  env.beforeInstall();
  env.runTimers();
  env.elements['pwa-install-dismiss'].click();
  env.beforeInstall();
  env.runTimers();
  assert.equal(env.shown(), false, 'Storage-disabled session still respects Non ora');
}
console.log('Install banner: 9 scenarios passed (mobile, desktop, standalone, 24h, install, update, storage).');
