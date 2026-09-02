/* Offline shell for the sleep apps. Navigations race the network against a
   short timeout so a slow connection paints from cache instead of hanging;
   the network response still refreshes the cache in the background, so a
   deploy is picked up on the next load. App data never touches this cache —
   it lives in localStorage. */
const CACHE = 'sleep-site-v2';
const CORE = ['./', './index.html', './original/', './original/index.html'];
const NAV_TIMEOUT_MS = 2500;

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => Promise.allSettled(CORE.map(u => c.add(u))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function navFallback(url) {
  return caches.match(url.pathname.includes('/original') ? './original/index.html' : './index.html');
}

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;

  const network = fetch(e.request).then(r => {
    if (r.ok) {
      const copy = r.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
    }
    return r;
  });

  if (e.request.mode === 'navigate') {
    e.respondWith((async () => {
      const timer = new Promise(res => setTimeout(() => res(null), NAV_TIMEOUT_MS));
      const first = await Promise.race([network.catch(() => null), timer]);
      if (first) return first;
      const cached = (await caches.match(e.request)) || (await navFallback(url));
      if (cached) return cached;
      const late = await network.catch(() => null);
      return late || Response.error();
    })());
    return;
  }

  e.respondWith(network.catch(() =>
    caches.match(e.request).then(m => m || Response.error())
  ));
});
