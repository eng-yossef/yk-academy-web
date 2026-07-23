const CACHE_NAME = "yk-academy-v1";
const STATIC_CACHE = "yk-academy-static-v1";
const DYNAMIC_CACHE = "yk-academy-dynamic-v1";

const STATIC_ASSETS = [
  "/",
  "/courses",
  "/about",
  "/blog",
  "/contact",
  "/pricing",
  "/faq",
  "/manifest.json",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== "GET") return;

  if (url.pathname.startsWith("/api/")) {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE));
    return;
  }

  if (
    request.destination === "image" ||
    request.destination === "font" ||
    request.destination === "script" ||
    request.destination === "style"
  ) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  if (STATIC_ASSETS.some((path) => url.pathname === path)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE));
});

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response("Offline", { status: 503, statusText: "Offline" });
  }
}

async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    return new Response("Offline", { status: 503, statusText: "Offline" });
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cached = await caches.match(request);
  const networkPromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        caches.open(cacheName).then((c) => c.put(request, response.clone()));
      }
      return response;
    })
    .catch(() => cached);

  return cached || networkPromise;
}
