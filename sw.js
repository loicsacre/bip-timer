// Serves the app from the cache so it opens offline, and refreshes the cache in the background:
// a new version shows on the launch after the one that fetched it. Bump VERSION when a file is
// added or removed.
const VERSION = 'bip-timer-v1';

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
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(VERSION).then((cache) => cache.addAll(FILES)));
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
