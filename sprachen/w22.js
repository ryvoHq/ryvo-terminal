
(function (W) {
'use strict';
const TAG = 86400;
const ok = (x) => typeof x === 'number' && Number.isFinite(x);
const zahl = (x) => (x === null || x === undefined || x === '' ? null : Number(x));

function kerzen(roh) {
const aus = [];
for (const k of roh || []) {
const a = Array.isArray(k), t0 = zahl(a ? k[0] : k.t), c = zahl(a ? (k.length === 2 ? k[1] : k[4]) : k.c);
if (!ok(t0) || !ok(c) || c <= 0) continue;
aus.push({ t: t0 > 1e11 ? Math.floor(t0 / 1000) : t0, c });
}
aus.sort((x, y) => x.t - y.t);
return aus.filter((k, i) => !i || k.t !== aus[i - 1].t);
}
function zufall(a) {
return function () {
a = (a + 0x6D2B79F5) | 0;
let t = Math.imul(a ^ (a >>> 15), 1 | a);
t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
}
const normal = (z) => Math.sqrt(-2 * Math.log(1 - z())) * Math.cos(2 * Math.PI * z());
function renditen(c) { const r = []; for (let i = 1; i < c.length; i++) r.push(Math.log(c[i] / c[i - 1])); return r; }
function streuung(r) { const n = r.length; if (n < 2) return null; let m = 0; for (const x of r) m += x; m /= n; let q = 0; for (const x of r) q += (x - m) * (x - m); return Math.sqrt(q / (n - 1)); }
function quantil(s, q) { const n = s.length; if (!n) return null; const p = q * (n - 1), i = Math.floor(p), f = p - i; return i + 1 < n ? s[i] + (s[i + 1] - s[i]) * f : s[i]; }

function plan(o) {
const tage = Math.max(1, o.tage | 0), sub = o.sub || Math.max(1, Math.min(24, Math.ceil(84 / tage))), n = o.pfade || 2000;
let boot = null;
if (o.boot && o.boot.length > 1) { let m = 0; for (const x of o.boot) m += x; m /= o.boot.length; boot = o.boot.map((x) => x - m); }
return { tage, sub, n, s0: o.s0, sigma: o.sigma, boot, schritte: tage * sub, log: new Float64Array(n * (tage * sub + 1)), a: zufall(o.seed >>> 0), b: zufall(((o.seed >>> 0) ^ 0x9E3779B9) >>> 0), fertig: 0 };
}
function wege(P, bis) {
const { tage, sub, sigma, boot, a, b } = P, L = P.schritte + 1, br = new Float64Array(sub + 1);
for (let p = P.fertig; p < bis; p++) {
const o = p * L; let x = 0;
for (let d = 0; d < tage; d++) {
const R = boot ? boot[Math.floor(a() * boot.length)] : -0.5 * sigma * sigma + sigma * normal(a);
if (sub > 1) {
const s = sigma / Math.sqrt(sub); br[0] = 0;
for (let k = 1; k <= sub; k++) br[k] = br[k - 1] + s * normal(b);
for (let k = 1; k < sub; k++) P.log[o + d * sub + k] = x + R * k / sub + br[k] - br[sub] * k / sub;
}
x += R; P.log[o + (d + 1) * sub] = x;
}
}
P.fertig = bis;
}
const QS = [0.05, 0.25, 0.5, 0.75, 0.95];
function baender(P, von = 0, bis = P.schritte + 1, B) {
const L = P.schritte + 1, s = new Float64Array(P.n);
B = B || QS.map(() => new Float64Array(L));
for (let k = von; k < bis; k++) {
for (let p = 0; p < P.n; p++) s[p] = P.log[p * L + k];
s.sort();
QS.forEach((q, i) => { B[i][k] = P.s0 * Math.exp(quantil(s, q)); });
}
return B;
}
function rang(P, wert) {
const L = P.schritte + 1, g = Math.log(wert / P.s0); let k = 0;
for (let p = 0; p < P.n; p++) if (P.log[p * L + L - 1] <= g) k++;
return k / P.n * 100;
}
function lage(K, tage, fenster = 30) {
const n = K.length, i0 = n - 1 - tage; if (i0 < 2) return null;
const v0 = Math.max(0, i0 - fenster), r = renditen(K.slice(v0, i0 + 1).map((k) => k.c)), sigma = streuung(r);
if (!ok(sigma) || sigma <= 0) return null;
return { i0, v0, s0: K[i0].c, sigma, r, echt: K.slice(i0).map((k) => k.c), zeit: K.slice(v0).map((k) => k.t), vor: K.slice(v0, i0 + 1).map((k) => k.c), heute: K[n - 1].c };
}
function auswerten(P, Lg, B) {
let aus = 0;
for (let d = 1; d <= P.tage; d++) { const c = Lg.echt[d], k = d * P.sub; if (c < B[0][k] || c > B[4][k]) aus++; }
return { rang: rang(P, Lg.heute), aussen: aus, tage: P.tage };
}
function faecher(roh, o = {}) {
const K = kerzen(roh), Lg = lage(K, o.tage || 30, o.fenster || 30); if (!Lg) return null;
const P = plan({ tage: o.tage || 30, pfade: o.pfade || 2000, seed: o.seed === undefined ? 22 : o.seed, s0: Lg.s0, sigma: Lg.sigma, boot: o.bootstrap ? Lg.r : null, sub: o.sub });
wege(P, P.n); const B = baender(P);
return { P, L: Lg, B, ...auswerten(P, Lg, B) };
}
function erfc(x) { const z = Math.abs(x), t = 1 / (1 + 0.5 * z), r = t * Math.exp(-z * z - 1.26551223 + t * (1.00002368 + t * (0.37409196 + t * (0.09678418 + t * (-0.18628806 + t * (0.27886807 + t * (-1.13520398 + t * (1.48851587 + t * (-0.82215223 + t * 0.17087277))))))))); return x >= 0 ? r : 2 - r; }
const nv = (x) => 0.5 * erfc(-x / Math.SQRT2);
function bs(S, K, tage, sigma, r = 0) {
const T = tage / 365;
if (!(S > 0 && K > 0)) return null;
if (!(T > 0 && sigma > 0)) return { call: Math.max(0, S - K), put: Math.max(0, K - S), d1: null, d2: null };
const v = sigma * Math.sqrt(T), d1 = (Math.log(S / K) + (r + sigma * sigma / 2) * T) / v, d2 = d1 - v, df = Math.exp(-r * T);
return { call: S * nv(d1) - K * df * nv(d2), put: K * df * nv(-d2) - S * nv(-d1), d1, d2 };
}
const FENSTER = Array.from({ length: 47 }, (_, i) => 8 + 2 * i);
function volaTage(roh, o = {}) {
const K = kerzen(roh), f = o.fenster || FENSTER, ann = Math.sqrt(o.ann || 365), r = renditen(K.map((k) => k.c)), ab = Math.max(...f);
const z = [];
for (let t = ab; t < K.length; t++) z.push(new Array(f.length));
f.forEach((w, j) => {
let s1 = 0, s2 = 0;
for (let k = 0; k < r.length; k++) {
s1 += r[k]; s2 += r[k] * r[k];
if (k >= w) { s1 -= r[k - w]; s2 -= r[k - w] * r[k - w]; }
const t = k + 1; if (t >= ab) z[t - ab][j] = Math.sqrt(Math.max(0, (s2 - s1 * s1 / w) / (w - 1))) * ann * 100;
}
});
return { x: { werte: f }, tage: K.slice(ab).map((k) => k.t), z };
}

const ORT = { de: 'de-DE', en: 'en-US', es: 'es-ES', fr: 'fr-FR', it: 'it-IT', tr: 'tr-TR' };
function sprache(o) { const s = String((o && o.sprache) || (W.document && document.documentElement.lang) || 'de').slice(0, 2).toLowerCase(); return ORT[s] ? s : 'en'; }
function tx(sp, k, ...a) {
const T = W.RYVO_W22_TEXTE || {}, s = (T[sp] && T[sp][k]) || (T.de && T.de[k]) || k;
return s.replace(/\{(\d)\}/g, (_, i) => (a[i] === undefined ? '' : a[i]));
}
const zf = (sp, x, nk = 0) => (ok(x) ? x.toLocaleString(ORT[sp], { minimumFractionDigits: nk, maximumFractionDigits: nk }) : '–');
const preis = (sp, x) => (ok(x) ? zf(sp, x, x >= 1000 ? 0 : x >= 1 ? 2 : 4) + ' $' : '–');
const pz = (sp, x, nk = 0) => (sp === 'tr' ? '%' : '') + zf(sp, x, nk) + (sp === 'en' ? '%' : sp === 'tr' ? '' : ' %');
const datum = (sp, t) => new Date(t * 1000).toLocaleDateString(ORT[sp], { day: '2-digit', month: '2-digit', year: '2-digit', timeZone: 'UTC' });

const GOLD = '#f4f4f1', LEISE = '#8b8e96', TEXT = '#ecebe6', GRAU = '200,203,210';
const MONO = '500 11px/1.2 var(--mono, ui-monospace, monospace)', SANS = 'var(--sans, system-ui, sans-serif)';
function stil(el, s) { for (const k in s) el.style[k] = s[k]; return el; }
function neu(tag, s, text) { const e = stil(document.createElement(tag), s || {}); if (text !== undefined) e.textContent = text; return e; }
function knopf(t) { const b = neu('button', { font: MONO, color: TEXT, background: 'rgba(236,235,230,0.06)', border: '1px solid rgba(236,235,230,0.14)', borderRadius: '6px', padding: '5px 8px', cursor: 'pointer', flex: 'none' }, t); b.type = 'button'; return b; }
function an(b, aktiv) { stil(b, aktiv ? { background: GOLD, color: '#17181b', borderColor: GOLD } : { background: 'rgba(236,235,230,0.06)', color: TEXT, borderColor: 'rgba(236,235,230,0.14)' }); b.setAttribute('aria-pressed', aktiv ? 'true' : 'false'); }
function rahmen(el, art, o) {
const w = neu('div', { position: 'relative', display: 'flex', flexDirection: 'column', gap: '6px', height: o.hoehe ? o.hoehe + 'px' : '100%', minHeight: '260px', color: TEXT, font: '12px/1.4 ' + SANS });
w.className = 'w22'; w.dataset.ansicht = art;
const kopf = neu('div', { display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' });
const buehne = neu('div', { position: 'relative', flex: '1 1 auto', minHeight: '200px', outline: 'none' });
const cv = neu('canvas', { position: 'absolute', inset: '0', width: '100%', height: '100%', display: 'block' });
const fuss = neu('div', { display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '11.5px', color: LEISE });
buehne.append(cv); w.append(kopf, buehne, fuss); el.append(w);
const weg = [], hoer = (z, t, f, p) => { z.addEventListener(t, f, p); weg.push(() => z.removeEventListener(t, f, p)); };
const ruhig = !!(W.matchMedia && W.matchMedia('(prefers-reduced-motion: reduce)').matches);
const ro = W.ResizeObserver ? new ResizeObserver(() => o.groesse && o.groesse()) : null; if (ro) ro.observe(buehne);
function masse() { const r = buehne.getBoundingClientRect(), d = Math.min(3, W.devicePixelRatio || 1), b = Math.max(1, Math.round(r.width * d)), h = Math.max(1, Math.round(r.height * d)); if (cv.width !== b || cv.height !== h) { cv.width = b; cv.height = h; } return { b: r.width, h: r.height, d }; }
function frei(...extra) { if (ro) ro.disconnect(); for (const f of weg) f(); weg.length = 0; for (const c of [cv, ...extra]) if (c) { c.width = 0; c.height = 0; } w.remove(); }
return { w, kopf, buehne, cv, fuss, hoer, ruhig, masse, frei };
}

function weiter(f) {
if (!W.MessageChannel) { setTimeout(f, 0); return; }
const k = new MessageChannel(); k.port1.onmessage = () => { k.port1.close(); f(); }; k.port2.postMessage(0);
}
function zeichneFaecher(el, daten, opt = {}) {
const sp = sprache(opt), o = Object.assign({ tage: 30, pfade: 2000, fenster: 30, linien: 150, bootstrap: false, seed: 22, anim: true }, opt);
let K = kerzen(daten && (daten.kerzen || daten)), Z = null, rech = null, uhr = null, raf = 0, zeig = 1, wisch = 0, maus = null;
const R = rahmen(el, 'faecher', Object.assign({}, o, { groesse: () => bild() }));
const { kopf, buehne, cv, fuss, hoer } = R, ctx = cv.getContext('2d'), dicht = document.createElement('canvas');
const titel = neu('strong', { font: '600 12px/1.2 ' + SANS, letterSpacing: '.02em', marginRight: 'auto' }, tx(sp, 'titel'));
const kn = [7, 30, 90].map((t) => { const b = knopf(tx(sp, 'tageK', t)); b.title = tx(sp, 'tageZurueck', t); hoer(b, 'click', () => setze({ tage: t })); return [t, b]; });
const schieber = neu('input', { width: '92px', accentColor: GOLD }); schieber.type = 'range'; schieber.min = '5'; schieber.setAttribute('aria-label', tx(sp, 'start'));
hoer(schieber, 'input', () => setze({ tage: Number(schieber.value) }));
const boot = neu('label', { display: 'flex', alignItems: 'center', gap: '4px', font: MONO, color: LEISE, cursor: 'pointer' }), hk = document.createElement('input'); hk.type = 'checkbox';
boot.append(hk, document.createTextNode(tx(sp, 'boot'))); hoer(hk, 'change', () => setze({ bootstrap: hk.checked }));
kopf.append(titel, ...kn.map((x) => x[1]), schieber, boot);
stil(buehne, { cursor: 'crosshair' });
const tipp = neu('div', { position: 'absolute', pointerEvents: 'none', display: 'none', font: MONO, background: 'rgba(23,24,27,0.92)', border: '1px solid rgba(236,235,230,0.14)', borderRadius: '6px', padding: '5px 7px', whiteSpace: 'nowrap', zIndex: '2' });
buehne.append(tipp);
const zeile = neu('div', { color: TEXT, fontSize: '12.5px' }), satz = neu('div', {}, tx(sp, 'satz')), schw = neu('div', { fontSize: '11px' }, tx(sp, 'schwanz')), meta = neu('div', { font: MONO, color: LEISE });
fuss.append(zeile, satz, schw, meta);

function setze(n) {
if (n.tage !== undefined) o.tage = Math.max(5, Math.min(maxTage(), Math.round(n.tage)));
if (n.bootstrap !== undefined) o.bootstrap = !!n.bootstrap;
rechne();
}
const maxTage = () => Math.max(5, Math.min(365, K.length - 3 - Math.min(o.fenster, 20)));
function rechne() {
if (raf) { cancelAnimationFrame(raf); raf = 0; }
for (const [t, b] of kn) an(b, t === o.tage);
schieber.max = String(maxTage()); schieber.value = String(o.tage); hk.checked = o.bootstrap;
const Lg = lage(K, Math.min(o.tage, maxTage()), o.fenster);
if (!Lg) { Z = null; zeile.textContent = tx(sp, 'leer'); bild(); return; }
const P = plan({ tage: Math.min(o.tage, maxTage()), pfade: o.pfade, seed: o.seed, s0: Lg.s0, sigma: Lg.sigma, boot: o.bootstrap ? Lg.r : null });
const t0 = performance.now(), B = QS.map(() => new Float64Array(P.schritte + 1)); let rein = 0, k = 0;
rech = P;
const happen = () => {
if (rech !== P) return;
const a = performance.now();
while (performance.now() - a < 10 && (P.fertig < P.n || k <= P.schritte)) {
if (P.fertig < P.n) wege(P, Math.min(P.n, P.fertig + 250));
else { baender(P, k, Math.min(P.schritte + 1, k + 12), B); k += 12; }
}
rein += performance.now() - a;
if (P.fertig < P.n || k <= P.schritte) { uhr = 1; weiter(happen); return; }
uhr = null;
Z = { P, L: Lg, B, ...auswerten(P, Lg, B), ms: performance.now() - t0, rein };
dichte(); texte(); start();
};
happen();
}
function texte() {
if (!Z) return;
zeile.textContent = tx(sp, 'heute') + ': ' + preis(sp, Z.L.heute) + ' · ' + tx(sp, 'rang', zf(sp, Z.rang, 0)) + ' · ' + tx(sp, 'aussen', Z.aussen, Z.tage);
meta.textContent = [tx(sp, 'vola', pz(sp, Z.L.sigma * Math.sqrt(365) * 100, 0), Z.L.r.length), tx(sp, o.bootstrap ? 'modellBoot' : 'modellGbm'),
tx(sp, 'rechen', zf(sp, Z.P.n), zf(sp, Z.ms, 0)), o.quelle ? tx(sp, 'quelle', o.quelle, datum(sp, Z.L.zeit[0]), datum(sp, Z.L.zeit[Z.L.zeit.length - 1])) : '', tx(sp, 'hinweis')].filter(Boolean).join(' · ');
}
function geo() {
const m = R.masse(), b = m.b, h = m.h, rr = randBreite(b), L = Z.L, P = Z.P, vor = L.i0 - L.v0, ges = vor + P.tage;
let lo = Infinity, hi = -Infinity;
for (const c of L.vor.concat(L.echt)) { lo = Math.min(lo, c); hi = Math.max(hi, c); }
for (let k = 0; k <= P.schritte; k++) { lo = Math.min(lo, Z.B[0][k]); hi = Math.max(hi, Z.B[4][k]); }
const pad = (hi - lo) * 0.12; lo -= pad; hi += pad;
const x0 = 46, x1 = b - rr, y0 = 10, y1 = h - 22;
return { m, b, h, x0, x1, y0, y1, lo, hi, vor, ges, X: (d) => x0 + (x1 - x0) * d / ges, Y: (v) => y1 - (y1 - y0) * (v - lo) / (hi - lo) };
}
function dichte() {
const P = Z.P, L = P.schritte + 1, H = 140, g = geo(), A = new Float32Array(L * H); let mx = 0;
for (let p = 0; p < P.n; p++) for (let k = 0; k < L; k++) {
const y = Math.floor((1 - (P.s0 * Math.exp(P.log[p * L + k]) - g.lo) / (g.hi - g.lo)) * H);
if (y >= 0 && y < H) { const i = y * L + k; A[i]++; }
}
for (let k = 0; k < L; k++) { let s = 0; for (let y = 0; y < H; y++) s = Math.max(s, A[y * L + k]); for (let y = 0; y < H; y++) A[y * L + k] /= s || 1; mx = 1; }
dicht.width = L; dicht.height = H; const c = dicht.getContext('2d'), im = c.createImageData(L, H);
for (let i = 0; i < L * H; i++) { const v = Math.sqrt(A[i] / mx); im.data[i * 4] = 200; im.data[i * 4 + 1] = 203; im.data[i * 4 + 2] = 210; im.data[i * 4 + 3] = Math.round(v * 120); }
c.putImageData(im, 0, 0); Z.dg = { lo: g.lo, hi: g.hi };
}
function start() {
if (raf) cancelAnimationFrame(raf);
if (R.ruhig || !o.anim) { zeig = 1; wisch = 0; bild(); return; }
const t0 = performance.now();
const lauf = (t) => { const u = Math.min(1, (t - t0) / 1400); zeig = 1 - Math.pow(1 - u, 3); wisch = 0; bild(); raf = u < 1 ? requestAnimationFrame(lauf) : 0; };
raf = requestAnimationFrame(lauf);
}
function bild() {
const m = R.masse(); ctx.setTransform(m.d, 0, 0, m.d, 0, 0); ctx.clearRect(0, 0, m.b, m.h);
if (!Z) return;
const g = geo(), P = Z.P, L = Z.L, S = P.schritte, xs = g.X(g.vor), xe = g.X(g.ges), xz = xs + (xe - xs) * zeig, xw = xs + (xe - xs) * wisch;
if (!Z.dg || Math.abs(Z.dg.lo - g.lo) > 1e-9) dichte();
ctx.font = '10px ' + SANS; ctx.fillStyle = LEISE; ctx.strokeStyle = 'rgba(236,235,230,0.06)'; ctx.lineWidth = 1; ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
const st = schritt((g.hi - g.lo) / 5);
for (let v = Math.ceil(g.lo / st) * st; v <= g.hi; v += st) { const y = Math.round(g.Y(v)) + 0.5; ctx.beginPath(); ctx.moveTo(g.x0, y); ctx.lineTo(g.x1, y); ctx.stroke(); ctx.fillText(kurzPreis(v), g.x0 - 4, y); }
ctx.textAlign = 'center'; ctx.textBaseline = 'top';
for (const d of [0, g.vor, g.ges]) { const t = L.zeit[Math.min(L.zeit.length - 1, d)]; ctx.fillText(datum(sp, t), Math.max(g.x0 + 20, Math.min(g.x1 - 20, g.X(d))), g.y1 + 6); }
ctx.save(); ctx.beginPath(); ctx.rect(xw, 0, Math.max(0, xz - xw), g.h); ctx.clip();
ctx.imageSmoothingEnabled = true; ctx.drawImage(dicht, xs, g.Y(Z.dg.hi), xe - xs, g.Y(Z.dg.lo) - g.Y(Z.dg.hi));
const kx = (k) => xs + (xe - xs) * k / S;
for (const [a, b, al] of [[0, 4, 0.10], [1, 3, 0.14]]) {
ctx.beginPath(); for (let k = 0; k <= S; k++) ctx.lineTo(kx(k), g.Y(Z.B[b][k])); for (let k = S; k >= 0; k--) ctx.lineTo(kx(k), g.Y(Z.B[a][k]));
ctx.closePath(); ctx.fillStyle = `rgba(${GRAU},${al})`; ctx.fill();
}
ctx.lineWidth = 0.6; ctx.strokeStyle = `rgba(${GRAU},0.13)`; ctx.beginPath();
const Lz = S + 1, sch = Math.max(1, Math.floor(P.n / o.linien));
for (let p = 0; p < P.n; p += sch) { for (let k = 0; k <= S; k++) { const x = kx(k), y = g.Y(P.s0 * Math.exp(P.log[p * Lz + k])); if (k) ctx.lineTo(x, y); else ctx.moveTo(x, y); } }
ctx.stroke();
for (const [i, al, da] of [[0, 0.55, []], [4, 0.55, []], [2, 0.5, [4, 4]]]) { ctx.setLineDash(da); ctx.strokeStyle = `rgba(${GRAU},${al})`; ctx.lineWidth = 1; ctx.beginPath(); for (let k = 0; k <= S; k++) ctx.lineTo(kx(k), g.Y(Z.B[i][k])); ctx.stroke(); }
ctx.setLineDash([]); ctx.restore();
ctx.lineWidth = 1.4; ctx.strokeStyle = 'rgba(236,235,230,0.45)'; ctx.beginPath(); L.vor.forEach((c, d) => ctx.lineTo(g.X(d), g.Y(c))); ctx.stroke();
ctx.save(); ctx.beginPath(); ctx.rect(wisch ? xw : 0, 0, Math.max(xs + 1, xz) - (wisch ? xw : 0), g.h); ctx.clip();
ctx.lineWidth = 2; ctx.strokeStyle = GOLD; ctx.beginPath(); L.echt.forEach((c, d) => ctx.lineTo(g.X(g.vor + d), g.Y(c))); ctx.stroke(); ctx.restore();
ctx.setLineDash([3, 4]); ctx.strokeStyle = 'rgba(236,235,230,0.35)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(xs + 0.5, g.y0); ctx.lineTo(xs + 0.5, g.y1); ctx.stroke(); ctx.setLineDash([]);
ctx.fillStyle = LEISE; ctx.textAlign = 'left'; ctx.textBaseline = 'top'; ctx.fillText(tx(sp, 'start') + ' · ' + tx(sp, 'tageK', P.tage), xs + 4, g.y0);
ctx.fillStyle = TEXT; ctx.beginPath(); ctx.arc(xs, g.Y(P.s0), 3, 0, 2 * Math.PI); ctx.fill();
const al = Math.max(0, Math.min(1, (zeig - 0.9) * 10)) * (1 - Math.min(1, wisch * 4));
if (al > 0) marken(g, al);
if (maus !== null && !wisch) zeigeTipp(g);
}
function marken(g, al) {
const S = Z.P.schritte, xe = g.X(g.ges), m = [
[g.Y(Z.B[4][S]), 'P95 ' + kurzPreis(Z.B[4][S]), tx(sp, 'p95'), `rgba(${GRAU},0.9)`],
[g.Y(Z.L.heute), kurzPreis(Z.L.heute), tx(sp, 'rangK', zf(sp, Z.rang, 0)), GOLD],
[g.Y(Z.B[0][S]), 'P05 ' + kurzPreis(Z.B[0][S]), tx(sp, 'p05'), `rgba(${GRAU},0.9)`]].sort((a, b) => a[0] - b[0]);
for (let i = 1; i < m.length; i++) if (m[i][0] - m[i - 1][0] < 28) m[i][0] = m[i - 1][0] + 28;
if (m[2][0] > g.y1 + 6) { const s = m[2][0] - g.y1 - 6; for (const x of m) x[0] -= s; }
ctx.globalAlpha = al; ctx.textAlign = 'left';
for (const [y, a, b, f] of m) { ctx.fillStyle = f; ctx.font = '600 11px ' + SANS; ctx.textBaseline = 'bottom'; ctx.fillText(a, xe + 8, y + 1); ctx.font = '10px ' + SANS; ctx.fillStyle = LEISE; ctx.textBaseline = 'top'; ctx.fillText(b, xe + 8, y + 2); }
ctx.fillStyle = GOLD; ctx.beginPath(); ctx.arc(xe, g.Y(Z.L.heute), 3.5, 0, 2 * Math.PI); ctx.fill(); ctx.globalAlpha = 1;
}
function zeigeTipp(g) {
const d = Math.round((maus - g.x0) / (g.x1 - g.x0) * g.ges);
if (d < g.vor || d > g.ges) { tipp.style.display = 'none'; return; }
const k = (d - g.vor) * Z.P.sub, x = g.X(d);
ctx.strokeStyle = 'rgba(236,235,230,0.25)'; ctx.beginPath(); ctx.moveTo(x + 0.5, g.y0); ctx.lineTo(x + 0.5, g.y1); ctx.stroke();
tipp.textContent = tx(sp, 'tipp', datum(sp, Z.L.zeit[d]), preis(sp, Z.L.echt[d - g.vor]), preis(sp, Z.B[0][k]), preis(sp, Z.B[4][k]));
stil(tipp, { display: 'block', left: Math.min(g.b - 230, x + 10) + 'px', top: '8px' });
}
function randBreite(b) {
ctx.font = '10px ' + SANS; let w = 0;
for (const t of [tx(sp, 'p95'), tx(sp, 'p05'), tx(sp, 'rangK', '100'), 'P95 100.0k']) w = Math.max(w, ctx.measureText(t).width);
return Math.min(b * 0.42, w + 18);
}
const schritt = (r) => { const e = Math.pow(10, Math.floor(Math.log10(r))); return [1, 2, 2.5, 5, 10].map((f) => f * e).find((s) => s >= r) || 10 * e; };
const kurzPreis = (v) => (v >= 1e4 ? zf(sp, v / 1e3, v >= 1e5 ? 0 : 1) + (sp === 'de' ? ' Tsd.' : 'k') : zf(sp, v, v >= 100 ? 0 : 2));
hoer(buehne, 'pointermove', (e) => { if (!Z) return; const r = buehne.getBoundingClientRect(); maus = e.clientX - r.left; if (!raf) bild(); });
hoer(buehne, 'pointerleave', () => { maus = null; tipp.style.display = 'none'; if (!raf) bild(); });
hoer(buehne, 'click', (e) => { if (!Z) return; const g = geo(), r = buehne.getBoundingClientRect(), x = e.clientX - r.left; if (x < g.x0 || x > g.x1) return; setze({ tage: g.ges - Math.round((x - g.x0) / (g.x1 - g.x0) * g.ges) }); });
rechne();
return {
element: R.w, leinwand: cv,
aktualisiere(d) { K = kerzen(d && (d.kerzen || d)); rechne(); },
setze, zustand: () => ({ tage: o.tage, bootstrap: o.bootstrap, fertig: !!Z && !uhr, rang: Z && Z.rang, aussen: Z && Z.aussen, ms: Z && Z.ms, rein: Z && Z.rein, pfade: Z && Z.P.n, p05: Z && Z.B[0][Z.P.schritte], p95: Z && Z.B[4][Z.P.schritte], heute: Z && Z.L.heute }),
phase(p) {
if (raf) { cancelAnimationFrame(raf); raf = 0; }
p = ((p % 1) + 1) % 1; const e = (u) => { u = Math.max(0, Math.min(1, u)); return u * u * (3 - 2 * u); };
zeig = e(p / 0.45); wisch = e((p - 0.72) / 0.26); bild();
},
bildJetzt() { const a = performance.now(); bild(); return performance.now() - a; },
entferne() { if (raf) cancelAnimationFrame(raf); raf = 0; uhr = null; rech = null; Z = null; R.frei(dicht); },
};
}

const SKALEN = {
ryvo: (t) => { const S = [[0, 34, 36, 42], [0.3, 46, 58, 82], [0.55, 88, 104, 132], [0.8, 159, 192, 245], [1, 255, 255, 255]]; let i = 1; while (i < S.length - 1 && t > S[i][0]) i++; const a = S[i - 1], b = S[i], u = (t - a[0]) / (b[0] - a[0]); return [a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u, a[3] + (b[3] - a[3]) * u]; },
spektrum: (t) => [
255 * (0.13572138 + t * (4.6153926 + t * (-42.66032258 + t * (132.13108234 + t * (-152.94239396 + t * 59.28637943))))),
255 * (0.09140261 + t * (2.19418839 + t * (4.84296658 + t * (-14.18503333 + t * (4.27729857 + t * 2.82956604))))),
255 * (0.1066733 + t * (12.64194608 + t * (-60.58204836 + t * (110.36276771 + t * (-89.90310912 + t * 27.34824973)))))],
};
function zeichneFlaeche(el, daten, opt = {}) {
const sp = sprache(opt), o = Object.assign({ skala: 'ryvo', drehen: false, zeilen: 60, zeitraffer: 90, linien: 10, hoehe: null }, opt);
const R = rahmen(el, 'flaeche', Object.assign({}, o, { groesse: () => male() }));
const { kopf, buehne, cv, fuss, hoer } = R, ctx = cv.getContext('2d'), leg = document.createElement('canvas');
let G = null, T = null, tag = 0, spielt = false, dreht = false, raf = 0, letzt = 0, ziehen = null, cache = new Map(), N = null;
const K0 = { yaw: -0.65, pitch: 0.52, zoom: 1 }, K = Object.assign({}, K0, o.kamera || {});
const titel = neu('strong', { font: '600 12px/1.2 ' + SANS, marginRight: 'auto' }, o.titel || tx(sp, 'f.titel'));
const bR = knopf(tx(sp, 'f.ryvo')), bS = knopf(tx(sp, 'f.spektrum')), bD = knopf(tx(sp, 'f.drehen'));
hoer(bR, 'click', () => skala('ryvo')); hoer(bS, 'click', () => skala('spektrum')); hoer(bD, 'click', () => drehe(!dreht));
kopf.append(titel, neu('span', { font: MONO, color: LEISE }, tx(sp, 'f.skala')), bR, bS, bD);
stil(buehne, { cursor: 'grab', touchAction: 'none' });
const lw = neu('div', { position: 'absolute', right: '6px', top: '8px', bottom: '8px', width: '58px', display: 'flex', gap: '4px', pointerEvents: 'none' });
const lt = neu('div', { position: 'relative', flex: '1', font: '10px/1 ' + SANS, color: LEISE });
stil(leg, { width: '10px', height: '100%', borderRadius: '3px' }); lw.append(leg, lt); buehne.append(lw);
const zl = neu('div', { display: 'flex', alignItems: 'center', gap: '8px' }), bP = knopf(tx(sp, 'f.spielen')), sch = neu('input', { flex: '1', accentColor: GOLD }), dl = neu('span', { font: MONO, color: LEISE, minWidth: '84px', textAlign: 'right' });
sch.type = 'range'; sch.min = '0'; sch.step = '0.01'; sch.setAttribute('aria-label', tx(sp, 'f.tag', ''));
hoer(bP, 'click', () => spiele(!spielt)); hoer(sch, 'input', () => { spiele(false); setzeTag(Number(sch.value)); });
zl.append(bP, sch, dl);
const was = neu('div', {}, tx(sp, 'f.was')), meta = neu('div', { font: MONO }); fuss.append(was, meta); fuss.before(zl);

function lade(d) {
cache.clear(); T = null;
if (d && d.z && d.x) { G = { x: d.x.werte, z: d.z, y: d.y && d.y.werte }; }
else {
const V = volaTage(d && (d.kerzen || d)), n = V.z.length, Z = Math.min(o.zeilen, n), F = Math.max(0, Math.min(o.zeitraffer, n - Z));
if (n < 2) { G = null; male(); return; }
T = { V, Z, F, e0: n - 1 - F }; G = null;
}
let lo = Infinity, hi = -Infinity;
for (const r of T ? T.V.z.slice(T.e0 - T.Z + 1) : G.z) for (const v of r) if (ok(v)) { lo = Math.min(lo, v); hi = Math.max(hi, v); }
N = { lo, hi: hi > lo ? hi : lo + 1 };
zl.style.display = T ? 'flex' : 'none'; if (T) { sch.max = String(T.F); tag = T.F; sch.value = String(tag); }
legende(); male();
}
function gitterJetzt() {
if (!T) return G;
const f = Math.floor(tag), u = tag - f, e = T.e0 + f, z = [];
for (let i = 0; i < T.Z; i++) { const a = T.V.z[e - T.Z + 1 + i], b = T.V.z[Math.min(T.V.z.length - 1, e - T.Z + 2 + i)]; z.push(u ? a.map((v, j) => v + (b[j] - v) * u) : a); }
return { x: T.V.x.werte, z, y: T.V.tage.slice(e - T.Z + 1, e + 1) };
}
function farbe(ti, li, si) {
const k = (ti * 64 + li) * 8 + si; let s = cache.get(k);
if (!s) { const c = SKALEN[o.skala](ti / 95), f = 0.18 + li / 63 * 1.0, g = si / 7 * 70; s = 'rgb(' + c.map((v) => Math.round(Math.max(0, Math.min(255, v * f + g)))).join(',') + ')'; cache.set(k, s); }
return s;
}
let BUF = null;
function male() {
const m = R.masse(); ctx.setTransform(m.d, 0, 0, m.d, 0, 0); ctx.clearRect(0, 0, m.b, m.h);
const Gj = G ? G : T ? gitterJetzt() : null; if (!Gj || !N) return;
const z = Gj.z, ny = z.length, nx = z[0].length, nv = nx * ny, cy = Math.cos(K.yaw), sy = Math.sin(K.yaw), cp = Math.cos(K.pitch), spi = Math.sin(K.pitch), H = 0.8;
if (!BUF || BUF.n !== nv) BUF = { n: nv, P: new Float32Array(nv * 3), Lt: new Uint8Array(nv * 2), h: new Float32Array(nv), seg: new Float32Array(nv * 4 * 4), gl: new Float32Array(nv * 4) };
const { P, Lt, h: hs, seg, gl } = BUF;
const bw = m.b - 74, s = Math.min(bw / 3.1, (m.h - 30) / (3.2 * spi + H * cp + 0.2)) * K.zoom, ox = bw / 2 + 2, oy = 16 + s * (H * cp + 1.414 * spi + 0.1);
const proj = (X, Y, Zh, out, k) => { const X1 = X * cy - Y * sy, Y1 = X * sy + Y * cy, up = Zh * cp + Y1 * spi, tief = Y1 * cp - Zh * spi, f = 1 / (1 + tief * 0.16); out[k] = ox + X1 * s * f; out[k + 1] = oy - up * s * f; out[k + 2] = tief; };
const sk = H / (N.hi - N.lo);
for (let i = 0; i < ny; i++) { const r = z[i]; for (let j = 0; j < nx; j++) { const v = r[j]; hs[i * nx + j] = ok(v) ? (v - N.lo) * sk : NaN; } }
const Lx = -0.48, Ly = 0.68, Lz = 0.55, hl = Math.hypot(Lx, Ly, Lz + 1), fx = (nx - 1) / 4, fy = (ny - 1) / 4;
for (let i = 0; i < ny; i++) for (let j = 0; j < nx; j++) {
const q = i * nx + j, h = hs[q]; proj(j / (nx - 1) * 2 - 1, 1 - i / (ny - 1) * 2, h === h ? h : 0, P, q * 3);
if (h !== h) continue;
const r1 = hs[q + (j < nx - 1 ? 1 : 0)], l1 = hs[q - (j > 0 ? 1 : 0)], o1 = hs[q - (i > 0 ? nx : 0)], u1 = hs[q + (i < ny - 1 ? nx : 0)];
let nX = -((r1 === r1 ? r1 : h) - (l1 === l1 ? l1 : h)) * fx, nY = -((o1 === o1 ? o1 : h) - (u1 === u1 ? u1 : h)) * fy, nZ = 1; const l = Math.hypot(nX, nY, nZ); nX /= l; nY /= l; nZ /= l;
const n2y = nX * sy + nY * cy, cx = nX * cy - nY * sy, cyy = nZ * cp + n2y * spi, cz = nZ * spi - n2y * cp;
const sg = cz < 0 ? -1 : 1, d = Math.max(0, sg * (cx * Lx + cyy * Ly + cz * Lz)), hh = Math.max(0, sg * (cx * Lx + cyy * Ly + cz * (Lz + 1)) / hl);
Lt[q * 2] = Math.round((sg < 0 ? 0.45 : 1) * Math.min(1, d) * 63); Lt[q * 2 + 1] = Math.round(Math.pow(hh, 28) * 7);
}
const a = new Float32Array(3), b = new Float32Array(3);
ctx.fillStyle = 'rgba(236,235,230,0.025)'; ctx.strokeStyle = 'rgba(236,235,230,0.10)'; ctx.lineWidth = 1; ctx.beginPath();
for (const [X, Y] of [[-1, 1], [1, 1], [1, -1], [-1, -1]]) { proj(X, Y, 0, a, 0); ctx.lineTo(a[0], a[1]); } ctx.closePath(); ctx.fill(); ctx.stroke();
ctx.strokeStyle = 'rgba(236,235,230,0.05)'; ctx.beginPath();
for (let k = 1; k < 10; k++) { const u = k / 5 - 1; proj(u, -1, 0, a, 0); proj(u, 1, 0, b, 0); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); proj(-1, u, 0, a, 0); proj(1, u, 0, b, 0); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); }
ctx.stroke();
const ti = P[(ny - 1) * nx * 3 + 2] - P[2], tj = P[(nx - 1) * 3 + 2] - P[2], aussen = Math.abs(ti) >= Math.abs(tj);
const I = ti > 0 ? [ny - 2, -1, -1] : [0, ny - 1, 1], J = tj > 0 ? [nx - 2, -1, -1] : [0, nx - 1, 1];
const nA = aussen ? I : J, nB = aussen ? J : I, stufen = o.linien, dw = (N.hi - N.lo) / stufen, Q = [0, 0, 0, 0], V = [0, 0, 0, 0];
for (let A = nA[0]; A !== nA[1]; A += nA[2]) {
let letzteF = null, ns = 0, ng = 0;
for (let B = nB[0]; B !== nB[1]; B += nB[2]) {
const i = aussen ? A : B, j = aussen ? B : A;
Q[0] = i * nx + j; Q[1] = Q[0] + 1; Q[2] = Q[0] + nx + 1; Q[3] = Q[0] + nx;
V[0] = hs[Q[0]]; V[1] = hs[Q[1]]; V[2] = hs[Q[2]]; V[3] = hs[Q[3]];
if (V[0] !== V[0] || V[1] !== V[1] || V[2] !== V[2] || V[3] !== V[3]) continue;
const t = (V[0] + V[1] + V[2] + V[3]) / 4 / H, li = (Lt[Q[0] * 2] + Lt[Q[1] * 2] + Lt[Q[2] * 2] + Lt[Q[3] * 2]) >> 2, si = (Lt[Q[0] * 2 + 1] + Lt[Q[1] * 2 + 1] + Lt[Q[2] * 2 + 1] + Lt[Q[3] * 2 + 1]) >> 2;
const f = farbe(Math.round(Math.max(0, Math.min(1, t)) * 95), li, si);
if (f !== letzteF) { if (letzteF) ctx.fill(); ctx.fillStyle = f; ctx.beginPath(); letzteF = f; }
const mx = (P[Q[0] * 3] + P[Q[1] * 3] + P[Q[2] * 3] + P[Q[3] * 3]) / 4, my = (P[Q[0] * 3 + 1] + P[Q[1] * 3 + 1] + P[Q[2] * 3 + 1] + P[Q[3] * 3 + 1]) / 4;
for (let n = 0; n < 4; n++) { const x = P[Q[n] * 3], y = P[Q[n] * 3 + 1], dx = x - mx, dy = y - my, l = 0.5 / (Math.abs(dx) + Math.abs(dy) + 1e-6); if (n) ctx.lineTo(x + dx * l, y + dy * l); else ctx.moveTo(x + dx * l, y + dy * l); }
for (let s2 = 1; s2 < stufen; s2++) {
const w = s2 * dw * sk; let k0 = ns;
for (let e = 0; e < 4; e++) { const v1 = V[e], v2 = V[(e + 1) & 3]; if ((v1 < w) !== (v2 < w) && ns - k0 < 8) { const u = (w - v1) / (v2 - v1), k1 = Q[e] * 3, k2 = Q[(e + 1) & 3] * 3; seg[ns++] = P[k1] + (P[k2] - P[k1]) * u; seg[ns++] = P[k1 + 1] + (P[k2 + 1] - P[k1 + 1]) * u; } }
if ((ns - k0) % 4) ns -= 2;
}
if (i % 5 === 0) { gl[ng++] = P[Q[0] * 3]; gl[ng++] = P[Q[0] * 3 + 1]; gl[ng++] = P[Q[1] * 3]; gl[ng++] = P[Q[1] * 3 + 1]; }
if (j % 6 === 0) { gl[ng++] = P[Q[0] * 3]; gl[ng++] = P[Q[0] * 3 + 1]; gl[ng++] = P[Q[3] * 3]; gl[ng++] = P[Q[3] * 3 + 1]; }
}
if (letzteF) ctx.fill();
if (ns) { ctx.lineWidth = 0.7; ctx.strokeStyle = 'rgba(255,255,255,0.22)'; ctx.beginPath(); for (let k = 0; k < ns; k += 4) { ctx.moveTo(seg[k], seg[k + 1]); ctx.lineTo(seg[k + 2], seg[k + 3]); } ctx.stroke(); }
if (ng) { ctx.lineWidth = 0.5; ctx.strokeStyle = 'rgba(0,0,0,0.18)'; ctx.beginPath(); for (let k = 0; k < ng; k += 4) { ctx.moveTo(gl[k], gl[k + 1]); ctx.lineTo(gl[k + 2], gl[k + 3]); } ctx.stroke(); }
}
for (const [zeile, idx, n, li] of [[true, ti < 0 ? ny - 1 : 0, nx, 20], [false, tj < 0 ? nx - 1 : 0, ny, 13]]) {
for (let k = 0; k < n - 1; k++) {
const q1 = zeile ? idx * nx + k : k * nx + idx, q2 = zeile ? q1 + 1 : q1 + nx, h1 = hs[q1], h2 = hs[q2]; if (h1 !== h1 || h2 !== h2) continue;
ctx.fillStyle = farbe(Math.round(Math.max(0, Math.min(1, (h1 + h2) / 2 / H)) * 95), li, 0); ctx.beginPath();
ctx.moveTo(P[q1 * 3], P[q1 * 3 + 1]); ctx.lineTo(P[q2 * 3] + 0.3, P[q2 * 3 + 1]);
const X2 = zeile ? (k + 1) / (nx - 1) * 2 - 1 : idx / (nx - 1) * 2 - 1, Y2 = zeile ? 1 - idx / (ny - 1) * 2 : 1 - (k + 1) / (ny - 1) * 2, X1 = zeile ? k / (nx - 1) * 2 - 1 : X2, Y1 = zeile ? Y2 : 1 - k / (ny - 1) * 2;
proj(X2, Y2, 0, a, 0); ctx.lineTo(a[0] + 0.3, a[1]); proj(X1, Y1, 0, a, 0); ctx.lineTo(a[0], a[1]); ctx.closePath(); ctx.fill();
}
}
achsen(Gj, proj, a, ti < 0 ? -1 : 1, tj < 0 ? 1 : -1);
ctx.strokeStyle = GOLD; ctx.lineWidth = 1.6; ctx.beginPath(); for (let j = 0; j < nx; j++) { const q = (ny - 1) * nx + j; if (hs[q] === hs[q]) ctx.lineTo(P[q * 3], P[q * 3 + 1]); } ctx.stroke();
if (T) { const e = T.V.tage[T.e0 + Math.round(tag)]; dl.textContent = tx(sp, 'f.tag', datum(sp, e)); }
}
function achsen(Gj, proj, a, vy, vx) {
const ax = o.achsen || [tx(sp, 'f.x'), tx(sp, 'f.y'), tx(sp, 'f.z')], nx = Gj.x.length;
ctx.font = '10px ' + SANS; ctx.fillStyle = LEISE; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
for (let j = 0; j < nx; j += Math.max(1, Math.round(nx / 5))) { proj(j / (nx - 1) * 2 - 1, vy * 1.12, 0, a, 0); ctx.fillText(String(Gj.x[j]), a[0], a[1]); }
proj(0, vy * 1.42, 0, a, 0); ctx.fillText(ax[0], a[0], a[1]);
if (Gj.y && Gj.y.length > 1) for (const i of [0, Gj.y.length >> 1, Gj.y.length - 1]) { proj(vx * 1.16, 1 - i / (Gj.y.length - 1) * 2, 0, a, 0); ctx.fillText(o.fy ? o.fy(Gj.y[i]) : Gj.y[i] > 1e8 ? datum(sp, Gj.y[i]).slice(0, 5) : zf(sp, Gj.y[i], Gj.y[i] < 10 ? 1 : 0), a[0], a[1]); }
proj(vx * 1.46, 0.5, 0, a, 0); ctx.fillText(ax[1], a[0], a[1]);
ctx.textAlign = 'left'; ctx.textBaseline = 'top'; ctx.fillText(ax[2] + ' ↑', 8, 6);
}
function legende() {
leg.width = 1; leg.height = 128; const c = leg.getContext('2d');
for (let y = 0; y < 128; y++) { c.fillStyle = 'rgb(' + SKALEN[o.skala](1 - y / 127).map((v) => Math.round(Math.max(0, Math.min(255, v)))).join(',') + ')'; c.fillRect(0, y, 1, 1); }
lt.replaceChildren(...[0, 0.25, 0.5, 0.75, 1].map((u) => neu('span', { position: 'absolute', top: (1 - u) * 100 + '%', transform: 'translateY(-50%)', whiteSpace: 'nowrap' }, N ? (o.fz ? o.fz(N.lo + (N.hi - N.lo) * u) : pz(sp, N.lo + (N.hi - N.lo) * u, 0)) : '')));
an(bR, o.skala === 'ryvo'); an(bS, o.skala === 'spektrum');
meta.textContent = [o.quelle ? tx(sp, 'quelleK', o.quelle) : '', tx(sp, 'f.bedienung'), tx(sp, 'hinweisF')].filter(Boolean).join(' · ');
}
function skala(s) { o.skala = SKALEN[s] ? s : 'ryvo'; cache.clear(); legende(); male(); }
function setzeTag(t) { if (!T) return; tag = Math.max(0, Math.min(T.F, t)); sch.value = String(tag); male(); }
function takt(t) {
const dt = letzt ? Math.min(0.05, (t - letzt) / 1000) : 0; letzt = t;
if (spielt) { setzeTag(tag + dt * 8); if (tag >= T.F) spiele(false); }
if (dreht) K.yaw = (K.yaw + dt * 0.18) % (2 * Math.PI);
male();
raf = spielt || dreht ? requestAnimationFrame(takt) : 0; if (!raf) letzt = 0;
}
const lauf = () => { if (!raf && (spielt || dreht)) raf = requestAnimationFrame(takt); };
function spiele(an2) { if (!T || R.ruhig) an2 = false; if (an2 && tag >= T.F) tag = 0; spielt = an2; bP.textContent = tx(sp, an2 ? 'f.pause' : 'f.spielen'); lauf(); }
function drehe(an2) { dreht = an2 && !R.ruhig; an(bD, dreht); bD.textContent = tx(sp, dreht ? 'f.anhalten' : 'f.drehen'); lauf(); }
hoer(buehne, 'pointerdown', (e) => { ziehen = [e.clientX, e.clientY, K.yaw, K.pitch]; buehne.setPointerCapture && buehne.setPointerCapture(e.pointerId); buehne.style.cursor = 'grabbing'; });
hoer(buehne, 'pointermove', (e) => { if (!ziehen) return; K.yaw = ziehen[2] + (e.clientX - ziehen[0]) * 0.008; K.pitch = Math.max(0.12, Math.min(1.45, ziehen[3] + (e.clientY - ziehen[1]) * 0.006)); if (!raf) male(); });
hoer(buehne, 'pointerup', () => { ziehen = null; buehne.style.cursor = 'grab'; });
hoer(buehne, 'wheel', (e) => { e.preventDefault(); K.zoom = Math.max(0.6, Math.min(2.2, K.zoom * Math.exp(-e.deltaY * 0.001))); if (!raf) male(); }, { passive: false });
hoer(buehne, 'dblclick', () => { Object.assign(K, K0, o.kamera || {}); if (!raf) male(); });
lade(daten); drehe(!!o.drehen);
return {
element: R.w, leinwand: cv,
aktualisiere(d) { lade(d); }, skala, spiele, drehe, tag: setzeTag,
ansicht(k) { Object.assign(K, k || {}); male(); },
zustand: () => ({ yaw: K.yaw, pitch: K.pitch, zoom: K.zoom, skala: o.skala, tag, tage: T ? T.F : 0, spielt, dreht, zeilen: T ? T.Z : G ? G.z.length : 0, spalten: T ? T.V.x.werte.length : G ? G.x.length : 0 }),
bildJetzt() { const a = performance.now(); male(); return performance.now() - a; },
entferne() { if (raf) cancelAnimationFrame(raf); raf = 0; spielt = dreht = false; cache.clear(); G = T = BUF = null; R.frei(leg); },
};
}

function zeichneFormel(el, opt = {}) {
const sp = sprache(opt), o = Object.assign({ kurs: 100, basis: 100, tage: 30, sigma: 60 }, opt), weg = [];
const w = neu('div', { display: 'flex', flexDirection: 'column', gap: '10px', color: TEXT, font: '12.5px/1.5 ' + SANS }); w.className = 'w22'; w.dataset.ansicht = 'formel';
const M = { fontFamily: '"Times New Roman", "STIX Two Math", Georgia, serif', fontStyle: 'italic' };
const bruch = (a, b) => { const f = neu('span', { display: 'inline-flex', flexDirection: 'column', alignItems: 'center', verticalAlign: 'middle', margin: '0 3px', lineHeight: '1.15' }); f.append(neu('span', { padding: '0 2px' }), neu('span', { borderTop: '1px solid currentColor', padding: '0 2px' })); f.firstChild.append(...a); f.lastChild.append(...b); return f; };
const t = (s) => document.createTextNode(s), hoch = (s) => neu('sup', { fontSize: '0.7em' }, s), op = (s) => neu('span', { fontStyle: 'normal', margin: '0 6px' }, s);
const formel = neu('div', Object.assign({ fontSize: '21px', textAlign: 'center', padding: '10px 4px', overflowX: 'auto', whiteSpace: 'nowrap', color: TEXT }, M));
formel.setAttribute('role', 'math'); formel.setAttribute('aria-label', '∂V/∂t + ½ σ² S² ∂²V/∂S² + r S ∂V/∂S − r V = 0');
formel.append(bruch([t('∂V')], [t('∂t')]), op('+'), bruch([t('1')], [t('2')]), t('σ'), hoch('2'), t('S'), hoch('2'), bruch([t('∂'), hoch('2'), t('V')], [t('∂S'), hoch('2')]), op('+'), t('rS'), bruch([t('∂V')], [t('∂S')]), op('−'), t('rV'), op('='), neu('span', { fontStyle: 'normal' }, '0'));
const loes = neu('div', Object.assign({ fontSize: '15px', textAlign: 'center', color: LEISE, whiteSpace: 'nowrap', overflowX: 'auto' }, M));
loes.append(t('C = S·N(d'), neu('sub', {}, '1'), t(') − K·e'), hoch('−rT'), t('·N(d'), neu('sub', {}, '2'), t(')'));
const liste = neu('ol', { margin: '0', paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px' });
for (const k of ['b.s1', 'b.s2', 'b.s3', 'b.s4']) liste.append(neu('li', {}, tx(sp, k)));
const raster = neu('div', { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '8px' }), feld = {};
for (const [k, s] of [['kurs', 'any'], ['basis', 'any'], ['tage', '1'], ['sigma', '1']]) {
const l = neu('label', { display: 'flex', flexDirection: 'column', gap: '3px', font: MONO, color: LEISE }, tx(sp, 'b.' + k)), i = neu('input', { font: '500 13px ' + SANS, color: TEXT, background: 'rgba(236,235,230,0.05)', border: '1px solid rgba(236,235,230,0.16)', borderRadius: '6px', padding: '6px 8px' });
i.type = 'number'; i.min = '0'; i.step = s; i.value = String(o[k]); i.inputMode = 'decimal'; const f = () => rechne(); i.addEventListener('input', f); weg.push(() => i.removeEventListener('input', f));
l.append(i); raster.append(l); feld[k] = i;
}
const aus = neu('div', { display: 'flex', gap: '18px', flexWrap: 'wrap', alignItems: 'baseline' }), call = neu('strong', { color: GOLD, fontSize: '17px' }), put = neu('strong', { color: GOLD, fontSize: '17px' });
const box = (n, v) => { const d = neu('div', { display: 'flex', flexDirection: 'column' }); d.append(neu('span', { font: MONO, color: LEISE }, tx(sp, n)), v); return d; };
aus.append(box('b.call', call), box('b.put', put));
const notiz = neu('div', { fontSize: '11px', color: LEISE }, tx(sp, 'b.fair') + ' · ' + tx(sp, 'b.hinweis'));
w.append(neu('strong', { font: '600 13px/1.2 ' + SANS }, tx(sp, 'b.titel')), formel, loes, liste, raster, aus, notiz); el.append(w);
function rechne() {
const v = (k) => Number(String(feld[k].value).replace(',', '.')), r = bs(v('kurs'), v('basis'), v('tage'), v('sigma') / 100, 0);
call.textContent = r ? zf(sp, r.call, 2) : '–'; put.textContent = r ? zf(sp, r.put, 2) : '–';
return r;
}
rechne();
return { element: w, rechne, setze(n) { for (const k in n) if (feld[k]) feld[k].value = String(n[k]); return rechne(); }, entferne() { for (const f of weg) f(); weg.length = 0; w.remove(); } };
}

const rechne = { kerzen, zufall, normal, renditen, streuung, quantil, plan, wege, baender, rang, lage, auswerten, faecher, bs, nv, volaTage, FENSTER };
W.RYVO_W22 = { zeichneFaecher, zeichneFlaeche, zeichneFormel, rechne, skalen: SKALEN, fassung: 'w22-1' };
})(typeof window !== 'undefined' ? window : globalThis);

