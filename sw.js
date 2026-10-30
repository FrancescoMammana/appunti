---
layout: null
permalink: /sw.js
---
/* Appunti: Service Worker condiviso per tutte le pagine e per i nuovi articoli Jekyll. */
'use strict';
const SCOPE = {{ '/' | relative_url | jsonify }};
const VERSION = {{ site.time | date: '%Y%m%d%H%M%S' | jsonify }};
const PREFIX = 'appunti-pwa-';
const STATIC_CACHE = PREFIX + 'static-' + VERSION;
const PAGE_CACHE = PREFIX + 'pages-' + VERSION;
const OFFLINE_URL = {{ '/offline/' | relative_url | jsonify }};

/* La raccolta viene rigenerata a ogni build Jekyll, compresi i nuovi post. */
const PAGE_URLS = [
  {{ '/' | relative_url | jsonify }},
  {{ '/informazioni/' | relative_url | jsonify }},
  {{ '/serie/ai-engineering/' | relative_url | jsonify }},
  OFFLINE_URL
  {% for post in site.posts %},
  {{ post.url | relative_url | jsonify }}{% endfor %}
];
const ASSET_URLS = [
  {{ '/assets/css/theme.css' | relative_url | jsonify }},
  {{ '/assets/css/style.css' | relative_url | jsonify }},
  {{ '/assets/css/ai-coding.css' | relative_url | jsonify }},
  {{ '/assets/css/report-theme.css' | relative_url | jsonify }},
  {{ '/assets/js/theme.js' | relative_url | jsonify }},
  {{ '/assets/js/pwa.js' | relative_url | jsonify }},
  {{ '/assets/js/install-prompt.js' | relative_url | jsonify }},
  {{ '/assets/js/ai-coding.js' | relative_url | jsonify }},
  {{ '/assets/icons/favicon.svg' | relative_url | jsonify }},
  {{ '/assets/icons/favicon-light.svg' | relative_url | jsonify }},
  {{ '/assets/icons/icon-192.png' | relative_url | jsonify }},
  {{ '/assets/icons/icon-512.png' | relative_url | jsonify }},
  {{ '/assets/icons/icon-maskable.png' | relative_url | jsonify }},
  {{ '/manifest.webmanifest' | relative_url | jsonify }}
];

self.addEventListener('install', function (event) {
  event.waitUntil((async function () {
    /* Atomico: se manca una pagina o risorsa, il nuovo worker non sostituisce
       quello già funzionante. */
    const staticCache = await caches.open(STATIC_CACHE);
    await staticCache.addAll(ASSET_URLS);
    const pageCache = await caches.open(PAGE_CACHE);
    await pageCache.addAll(PAGE_URLS);
  })());
});

self.addEventListener('activate', function (event) {
  event.waitUntil((async function () {
    const keys = await caches.keys();
    await Promise.all(keys.filter(function (key) {
      return key.startsWith(PREFIX) && key !== STATIC_CACHE && key !== PAGE_CACHE;
    }).map(function (key) { return caches.delete(key); }));
    await self.clients.claim();
  })());
});

self.addEventListener('message', function (event) {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', function (event) {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || !url.pathname.startsWith(SCOPE)) return;
  if (request.mode === 'navigate') {
    /* HTML: preferisce sempre la nuova versione, con fallback alla cache offline. */
    event.respondWith((async function () {
      try {
        const response = await fetch(request);
        if (response.ok && response.type === 'basic') {
          const cache = await caches.open(PAGE_CACHE);
          await cache.put(request, response.clone());
        }
        return response;
      } catch (error) {
        const cached = await caches.match(request, { ignoreSearch: true });
        return cached || await caches.match(OFFLINE_URL) ||
          new Response('Offline', { status: 503, headers: { 'Content-Type': 'text/plain' } });
      }
    })());
    return;
  }
  /* Risorse statiche: la nuova versione viene precaricata al cambio worker. */
  event.respondWith((async function () {
    const cached = await caches.match(request, { ignoreSearch: true });
    if (cached) return cached;
    const response = await fetch(request);
    if (response.ok && response.type === 'basic') {
      const cache = await caches.open(STATIC_CACHE);
      await cache.put(request, response.clone());
    }
    return response;
  })());
});
