const CACHE_NAME = 'curso-ia-v1';
const ASSETS = [
  './',
  './index.html',
  './muro.html',
  './recursos.html',
  './css/styles.css',
  './js/main.js',
  './js/search.js',
  './js/search-worker.js',
  './js/highlighter.js',
  './js/ai-tutor.js',
  './js/muro.js',
  './js/tts.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request).catch(() => {
          console.warn('Network request failed and no cache available');
        });
      })
  );
});
