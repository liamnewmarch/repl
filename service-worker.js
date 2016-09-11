const cacheVersion = 'repl-v1';

self.addEventListener('install', event => {
  event.waitUntil(caches.open(cacheVersion).then(cache => {
    return cache.addAll([
      '.',
      'app.css',
      'app.js'
    ]);
  }));
});

self.addEventListener('fetch', event => {
  event.respondWith(caches.match(event.request).then(response => {
    return response || fetch(event.request);
  }));
});
