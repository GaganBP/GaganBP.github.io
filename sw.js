
const CACHE_NAME = 'portfolio-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js'
];

// Cache images and external resources separately with different strategies
const ASSETS_CACHE = 'assets-v1';
const EXTERNAL_CACHE = 'external-v1';

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  // Different strategies for different types of requests
  if (event.request.destination === 'image') {
    event.respondWith(
      caches.open(ASSETS_CACHE).then(cache => {
        return cache.match(event.request).then(response => {
          if (response) {
            // Return cached image, update in background
            fetch(event.request).then(fetchResponse => {
              cache.put(event.request, fetchResponse.clone());
            });
            return response;
          }
          return fetch(event.request).then(fetchResponse => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        });
      })
    );
  } else if (event.request.url.includes('googleapis.com') || event.request.url.includes('cdnjs.cloudflare.com')) {
    event.respondWith(
      caches.open(EXTERNAL_CACHE).then(cache => {
        return cache.match(event.request).then(response => {
          const fetchPromise = fetch(event.request).then(fetchResponse => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
          return response || fetchPromise;
        });
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
    );
  }
});
