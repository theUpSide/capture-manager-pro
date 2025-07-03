self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('capture-manager-cache-v1').then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/css/main.css',
        '/js/app.js',
        // add other assets
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
