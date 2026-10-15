/*
 * Service worker：网络优先（network-first）。
 * 在线时每个请求都绕过 HTTP 缓存去取最新文件，成功后顺手存一份；只有断网时才用缓存。
 * 所以内容更新后刷新一次就能看到，不会卡在旧版本。浏览器只在 https 或 localhost 下启用它。
 * 发布新内容时同步修改 CACHE（和 index.html 里的 ?v=），激活时会删掉旧版本的离线缓存。
 */
const CACHE = 'eai-study-20261015a';

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      const html = await (await fetch('index.html', { cache: 'no-store' })).text();
      const urls = new Set(['./', 'index.html', 'manifest.webmanifest']);
      for (const m of html.matchAll(/(?:src|href)="([^"#:]+)"/g)) urls.add(m[1]);
      const contentFiles = [...urls].filter((u) => u.startsWith('content/'));
      for (const u of contentFiles) {
        try {
          const text = await (await fetch(u, { cache: 'no-store' })).text();
          for (const m of text.matchAll(/assets\/[\w./-]+\.(?:png|jpg|txt)/g)) urls.add(m[0]);
        } catch (e) { /* 单个文件失败不影响安装 */ }
      }
      await Promise.all([...urls].map((u) => cache.add(new Request(u, { cache: 'no-store' })).catch(() => null)));
      await self.skipWaiting();
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
      await self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  event.respondWith(
    (async () => {
      try {
        const res = await fetch(req, { cache: 'no-store' });
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      } catch (err) {
        const cached = await caches.match(req, { ignoreSearch: true });
        if (cached) return cached;
        if (req.mode === 'navigate') return caches.match('index.html');
        throw err;
      }
    })()
  );
});
