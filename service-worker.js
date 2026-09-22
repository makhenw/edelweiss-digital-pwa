/*
 * EDELWEISS DIGITAL PWA — SERVICE WORKER V3
 * Logo/icon cache refresh
 *
 * Icon berada di:
 * ./icons/
 *
 * Prinsip:
 * - Cache hanya aset same-origin milik PWA.
 * - Jangan cache Google Apps Script / GAS response.
 * - Navigasi tetap mencoba network terlebih dahulu.
 * - Icon baru diprioritaskan dari cache V3.
 */

const CACHE_NAME = "edelweiss-digital-pwa-v3";

const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.json",

  // ICON PWA
  "./icons/edelweiss-digital-icon-192.png",
  "./icons/edelweiss-digital-icon-512.png",
  "./icons/edelweiss-digital-icon-512-maskable.png"
];

function isGAS(url) {
  return /(^|\.)script\.google\.com$/i.test(url.hostname) ||
         /(^|\.)googleusercontent\.com$/i.test(url.hostname);
}

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys =>
        Promise.all(
          keys
            .filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {

  const request = event.request;

  // Hanya GET
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  /*
   * Jangan intercept / cache:
   * - Google Apps Script
   * - googleusercontent
   * - domain eksternal
   */
  if (
    isGAS(url) ||
    url.origin !== self.location.origin
  ) {
    return;
  }

  /*
   * NAVIGASI
   * Network first.
   * Jika internet gagal, gunakan cache.
   */
  if (request.mode === "navigate") {

    event.respondWith(

      fetch(request)

        .then(response => {

          if (response && response.ok) {

            const copy = response.clone();

            caches
              .open(CACHE_NAME)
              .then(cache => cache.put(request, copy));
          }

          return response;
        })

        .catch(() =>

          caches.match(request)
            .then(cached =>

              cached ||
              caches.match("./index.html")

            )
        )
    );

    return;
  }

  /*
   * STATIC ASSETS
   * Cache first.
   */
  event.respondWith(

    caches.match(request)

      .then(cached => {

        if (cached) {
          return cached;
        }

        return fetch(request)

          .then(response => {

            if (response && response.ok) {

              const copy = response.clone();

              caches
                .open(CACHE_NAME)
                .then(cache => cache.put(request, copy));
            }

            return response;
          });
      })
  );
});
