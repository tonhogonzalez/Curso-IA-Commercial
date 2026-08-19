const CACHE_NAME = 'curso-ia-v5';
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
  './js/text-zoom.js'
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

// Network-First para documentos HTML (evita servir versiones obsoletas)
// Cache-First para assets estáticos (CSS, JS)
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  const isHTMLPage = event.request.mode === 'navigate' ||
    (event.request.headers.get('accept') && event.request.headers.get('accept').includes('text/html'));

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
  } else {
    // Stale-While-Revalidate para JS/CSS/assets
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
