const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/index.js",
  "/styles.css",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
];

const PRECACHE = "precache-v1";
const RUNTIME = "runtime";
const cacheName = "data-cache-name";

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(PRECACHE).then(function (cache) {
      return cache.addAll(FILES_TO_CACHE);
    })
    // .then(self.skipWaiting())
  );
});

// The activate handler takes care of cleaning up old caches.
self.addEventListener("activate", function (event) {
  const currentCaches = [PRECACHE, RUNTIME];
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return cacheNames.filter(
          (cacheName) => !currentCaches.includes(cacheName)
        );
      })
      .then((cachesToDelete) => {
        return Promise.all(
          cachesToDelete.map((cacheToDelete) => {
            return caches.delete(cacheToDelete);
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", function (event) {
  if (event.request.url.includes("/api/")) {
    event.respondWith(
      caches.open(cacheName).then(function (cachedResponse) {
        // if (cachedResponse) {
        //   return cachedResponse;
        // }

        // return caches.open(RUNTIME).then((cache) => {
        return fetch(event.request)
          .then(function (response) {
            if (response.status === 200) {
              cachedResponse.put(event.request.url, response.clone());
            }
            // .then(() => {
            return response;
            // });
          })
          .catch(function () {
            return caches.match(event.request);
          })

          .catch(function (error) {
            // registration failed
            console.log("Registration failed with " + error);
          });
        // }
        // );
      })
    );
    return;
  }
  event.respondWith(
    caches.match(event.request).then(function (res) {
      if (res) {
        return res;
      }
      return requestBackend(event);
    })
  );
});
