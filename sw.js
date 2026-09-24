// Serves the app from the cache so it opens offline, and refreshes the cache in the background:
// a new version shows on the launch after the one that fetched it. Bump VERSION when a file is
// added or removed.
const VERSION = 'bip-timer-v8';

const FILES = [
  './',
  'index.html',
  'manifest.webmanifest',
  'css/style.css',
  'js/app.js',
  'js/device.js',
  'js/i18n.js',
  'js/run.js',
  'js/sequence.js',
  'fonts/Archivo-Medium.ttf',
  'fonts/SairaCondensed-Bold.ttf',
  'fonts/IBMPlexMono-Medium.ttf',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/apple-touch-icon.png',
  'icons/favicon-32.png',
  'icons/icon-maskable-512.png',
  'icons/icon.svg',
];

self.addEventListener('install', (event) => {
  // Straight from the network: the HTTP cache could hand back a previous version of some files and
  // mix two releases in one cache.
  event.waitUntil(caches.open(VERSION).then((cache) => cache.addAll(FILES.map((file) => new Request(file, { cache: 'reload' })))));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== VERSION).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== location.origin) {
    return;
  }

  event.respondWith(
    caches.open(VERSION).then(async (cache) => {
      const cached = await cache.match(event.request, { ignoreSearch: true });
      const fresh = fetch(event.request)
        .then((response) => {
          if (response.ok) {
            cache.put(event.request, response.clone());
          }

          return response;
        })
        .catch(() => cached);

      if (cached) {
        event.waitUntil(fresh);

        return cached;
      }

      return fresh;
    }),
  );
});
