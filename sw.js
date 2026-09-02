/* Offline shell for the sleep apps. Network-first so a deploy is picked up
   on the next online load; cache fallback so the morning log works with no
   signal. App data never touches this cache — it lives in localStorage. */
const CACHE = 'sleep-site-v1';
const CORE = ['./', './index.html', './wake-anchor/', './wake-anchor/index.html'];

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

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  e.respondWith(
    fetch(e.request).then(r => {
      if (r.ok) {
        const copy = r.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
      }
      return r;
    }).catch(() =>
      caches.match(e.request).then(m => {
        if (m) return m;
        if (e.request.mode === 'navigate') {
          const inAnchor = url.pathname.includes('/wake-anchor');
          return caches.match(inAnchor ? './wake-anchor/index.html' : './index.html')
            .then(p => p || Response.error());
        }
        return Response.error();
      })
    )
  );
});
