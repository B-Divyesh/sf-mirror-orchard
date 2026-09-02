import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';

const root = new URL('../dist/', import.meta.url).pathname;

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return listFiles(path);
    // Deployment configuration is consumed by Static Web Apps and is not
    // served at runtime. Precache only assets the browser can actually fetch.
    if (entry.name === 'sw.js' || entry.name === 'staticwebapp.config.json' || entry.name.endsWith('.map')) return [];
    return [path];
  }));
  return nested.flat();
}

const files = await listFiles(root);
const hash = createHash('sha256');
for (const file of files) hash.update(await readFile(file));
const version = hash.digest('hex').slice(0, 12);
const urls = ['/', ...files.map((file) => `/${relative(root, file).split(sep).join('/')}`)].filter((value, index, all) => all.indexOf(value) === index);
const source = `const CACHE = 'mirror-orchard-${version}';
const PRECACHE = ${JSON.stringify(urls)};
self.addEventListener('install', (event) => event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(PRECACHE.map((url) => new Request(url, { cache: 'reload' })))).then(() => self.skipWaiting())));
self.addEventListener('activate', (event) => event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key.startsWith('mirror-orchard-') && key !== CACHE).map((key) => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).catch(() => caches.open(CACHE).then((cache) => cache.match('/index.html', { ignoreVary: true }))).then((response) => response || caches.open(CACHE).then((cache) => cache.match('/', { ignoreVary: true }))));
    return;
  }
  event.respondWith(caches.open(CACHE).then((cache) => cache.match(new URL(event.request.url).pathname, { ignoreSearch: true, ignoreVary: true })).then((cached) => cached || fetch(event.request).then((response) => {
    if (response.ok && new URL(event.request.url).origin === self.location.origin) caches.open(CACHE).then((cache) => cache.put(event.request, response.clone()));
    return response;
  })));
});`;
await writeFile(join(root, 'sw.js'), source);
