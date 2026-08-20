const CACHE_NAME = 'curso-ia-v6';
const ASSETS = [
  './',
  './index.html',
  './muro.html',
  './recursos.html',
  './examen.html',
  './cuadernos/01-pep-martorell.html',
  './cuadernos/02-javier-ideami.html',
  './cuadernos/03-compendio-tecnico.html',
  './cuadernos/04-el-universo-del-transformer.html',
  './cuadernos/05-paradigmas-y-computacion.html',
  './css/styles.css',
  './js/main.js',
  './js/exam-data.js',
  './js/exam-engine.js',
  './js/simulations.js',
  './js/simulations-advanced.js',
  './js/playground.js',
  './js/flashcards.js',
  './js/quiz.js',
  './js/search.js',
  './js/search-data.js',
  './js/search-worker.js',
  './js/highlighter.js',
  './js/ai-tutor.js',
  './js/muro.js',
  './js/tts.js',
  './js/diagrams.js',
  './js/edit-mode.js',
  './js/glossary.js',
  './js/text-zoom.js',
  './js/concept-map.js',
  './js/achievements.js',
  './js/annotations.js',
  './js/model-compare.js',
  './manifest.json'
];

// External CDN assets to cache opportunistically
const CDN_ASSETS = [
  'https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/katex.min.css',
  'https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/katex.min.js',
  'https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/contrib/auto-render.min.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        // Cache local assets (required for offline)
        return cache.addAll(ASSETS).then(() => {
          // Opportunistically cache CDN assets (don't fail install if CDN is down)
          return Promise.allSettled(
            CDN_ASSETS.map(url => cache.add(url).catch(() => {}))
          );
        });
      })
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

// Network-First para documentos HTML (evita servir versiones obsoletas)
// Stale-While-Revalidate para assets estáticos (CSS, JS, fuentes)
// Cache-First para CDN assets (KaTeX, Pyodide)
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  const isHTMLPage = event.request.mode === 'navigate' ||
    (event.request.headers.get('accept') && event.request.headers.get('accept').includes('text/html'));
  const isCDN = url.hostname.includes('cdn.jsdelivr.net') || 
    url.hostname.includes('cdn.pyodide.org') ||
    url.hostname.includes('fonts.googleapis.com') ||
    url.hostname.includes('fonts.gstatic.com');

  if (isHTMLPage) {
    // Network-First para HTML: intenta red primero, fallback a caché
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return response;
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
  } else if (isCDN) {
    // Cache-First para CDN assets (KaTeX, Pyodide, Fonts)
    event.respondWith(
      caches.match(event.request)
        .then((cached) => {
          if (cached) return cached;
          return fetch(event.request).then((response) => {
            if (response.ok) {
              const clone = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
            }
            return response;
          });
        })
    );
  } else {
    // Stale-While-Revalidate para JS/CSS/assets locales
    event.respondWith(
      caches.match(event.request)
        .then((cached) => {
          const fetchPromise = fetch(event.request)
            .then((response) => {
              const clone = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
              return response;
            })
            .catch(() => cached);
          return cached || fetchPromise;
        })
    );
  }
});
