// RYVO Terminal Beta – Service Worker (r142, MOB04). Erzeugt von deep/teilen/bauen.py – nicht von Hand ändern.
// Hält NUR die eigenen Dateien dieser Seite für den Start ohne Netz bereit (Netz zuerst). Börsen-Antworten und alle fremden Adressen gehen
// unverändert ans Netz und werden nie gespeichert; ebenso alles außer GET und eigene Pfade, die nicht in der Liste stehen.
'use strict';
const STAND = 'ryvo-519579d173e8';
const EIGENE = ["./", "index.html", "manifest.webmanifest", "sprachen/en.js", "sprachen/es.js", "sprachen/fr.js", "sprachen/tr.js", "sprachen/it.js", "sprachen/w5.js", "sprachen/w6.js", "sprachen/w8.js", "sprachen/w9.js", "sprachen/w11.js", "sprachen/w12.js", "sprachen/w7.js", "sprachen/neu.js", "sprachen/w13.js", "sprachen/w14.js", "sprachen/dex.js", "sprachen/w15.js", "sprachen/w16.js", "schrift/Geist-Variable.woff2", "schrift/GeistMono-Variable.woff2", "symbole/180.png", "symbole/192.png", "symbole/512.png", "symbole/512-maskable.png"];
const BASIS = new URL('./', self.location.href);
const PFADE = new Set(EIGENE.map((x) => new URL(x, BASIS).pathname));
self.addEventListener('install', (e) => { e.waitUntil(caches.open(STAND).then((c) => Promise.all(EIGENE.map((x) => c.add(new URL(x, BASIS).href).catch(() => null)))).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((l) => Promise.all(l.filter((k) => k.startsWith('ryvo-') && k !== STAND).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== BASIS.origin || !PFADE.has(u.pathname)) return;   // fremd (Börsen, Behörden) oder nicht in der Liste: nicht anfassen
  e.respondWith(fetch(r).then((a) => { if (a.ok && a.type === 'basic') { const k = a.clone(); caches.open(STAND).then((c) => c.put(u.pathname, k)); } return a; })
    .catch(() => caches.open(STAND).then((c) => c.match(u.pathname).then((x) => x || c.match(new URL('./', BASIS).pathname)))));
});
