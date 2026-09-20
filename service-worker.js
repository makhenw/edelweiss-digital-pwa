const CACHE_NAME = "edelweiss-pwa-v1";
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./config.js",
  "./offline.html",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;

  // Do not cache the GAS application/data layer.
  if (request.method !== "GET") return;
  if (request.url.includes("script.google.com") ||
      request.url.includes("googleusercontent.com")) {
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => {
      return cached || fetch(request).catch(() => {
        if (request.mode === "navigate") {
          return caches.match("./offline.html");
        }
        return Response.error();
      });
    })
  );
});
