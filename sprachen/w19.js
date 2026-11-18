
(function (W) {
'use strict';
const TAG = 86400;
const zahl = (x) => (x === null || x === undefined || x === '' ? null : Number(x));
const ok = (x) => typeof x === 'number' && Number.isFinite(x);

function kerzen(roh) {
const aus = [];
for (const k of roh || []) {
const a = Array.isArray(k), t0 = zahl(a ? k[0] : k.t);
if (!ok(t0)) continue;
const t = t0 > 1e11 ? Math.floor(t0 / 1000) : t0;
if (a && k.length === 2) { const c = zahl(k[1]); aus.push({ t, o: c, h: c, l: c, c, v: 0 }); continue; }
aus.push({ t, o: zahl(a ? k[1] : k.o), h: zahl(a ? k[2] : k.h), l: zahl(a ? k[3] : k.l), c: zahl(a ? k[4] : k.c), v: zahl(a ? k[5] : k.v) || 0 });
}
return aus.sort((x, y) => x.t - y.t);
}
function tage(K, vs = 0) {
const aus = []; let g = null;
for (let i = 0; i < K.length; i++) {
const k = K[i], tag = Math.floor((k.t + vs) / TAG);
if (!g || g.tag !== tag) { g = { tag, i0: i, i1: i, n: 0, o: k.o, h: k.h, l: k.l, c: k.c, v: 0 }; aus.push(g); }
g.i1 = i; g.n++; if (k.h > g.h) g.h = k.h; if (k.l < g.l) g.l = k.l; g.c = k.c; g.v += k.v || 0;
}
return aus;
}
function arkus(h, n = 24) { return 2 / Math.PI * (Math.asin(Math.sqrt((h + 1) / n)) - Math.asin(Math.sqrt(h / n))); }
function uhr(roh, o = {}) {
const K = kerzen(roh), vs = o.versatz || 0, minN = o.minN || 22, art = o.art || 'beide';
const z = Array.from({ length: 7 }, () => new Array(24).fill(0)), n = new Array(7).fill(0), voll = tage(K, vs).filter((g) => g.n >= minN);
const std = (i) => Math.floor((((K[i].t + vs) % TAG) + TAG) % TAG / 3600);
for (const g of voll) {
let ih = g.i0, il = g.i0;
for (let i = g.i0 + 1; i <= g.i1; i++) { if (K[i].h > K[ih].h) ih = i; if (K[i].l < K[il].l) il = i; }
const wt = (((g.tag + 3) % 7) + 7) % 7; n[wt]++;
if (art !== 'tief') z[wt][std(ih)]++;
if (art !== 'hoch') z[wt][std(il)]++;
}
const je = art === 'beide' ? 2 : 1;
for (let w = 0; w < 7; w++) for (let h = 0; h < 24; h++) z[w][h] = n[w] ? z[w][h] / (je * n[w]) * 100 : null;
const e = Array.from({ length: 24 }, (_, h) => arkus(h) * 100);
return { form: 'saeulen', art: 'uhr', x: { werte: e.map((_, h) => h) }, y: { werte: [0, 1, 2, 3, 4, 5, 6] }, z, ebene: z.map(() => e.slice()), n,
tage: voll.length, von: voll.length ? voll[0].tag : null, bis: voll.length ? voll[voll.length - 1].tag : null, versatz: vs, teil: art };
}
const FENSTER = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];
function volaReihen(closes, fenster = FENSTER, ann = 365) {
const r = []; for (let i = 1; i < closes.length; i++) r.push(closes[i] > 0 && closes[i - 1] > 0 ? Math.log(closes[i] / closes[i - 1]) : 0);
return fenster.map((w) => {
const a = new Array(closes.length).fill(null);
for (let t = w; t < closes.length; t++) { let m = 0; for (let k = t - w; k < t; k++) m += r[k]; m /= w; let q = 0; for (let k = t - w; k < t; k++) q += (r[k] - m) * (r[k] - m); a[t] = Math.sqrt(q / (w - 1)) * Math.sqrt(ann); }
return a;
});
}
function auswahl(n, max) { const s = Math.max(1, Math.ceil(n / max)), aus = []; for (let i = n - 1; i >= 0; i -= s) aus.push(i); return aus.reverse(); }
function vola(roh, o = {}) {
const K = kerzen(roh), fenster = o.fenster || FENSTER, ann = o.ann || 365, R = volaReihen(K.map((k) => k.c), fenster, ann), ab = Math.max(...fenster);
const idx = auswahl(Math.max(0, K.length - ab), o.maxZeilen || 160).map((i) => i + ab);
const z = idx.map((t) => fenster.map((_, f) => (R[f][t] === null ? null : R[f][t] * 100)));
const jetzt = z.length ? z[z.length - 1] : [], pct = fenster.map((_, f) => { const x = R[f][K.length - 1]; if (x === null || x === undefined) return null; let k = 0, n = 0; for (const y of R[f]) if (y !== null) { n++; if (y <= x) k++; } return n ? k / n * 100 : null; });
return { form: 'flaeche', art: 'vola', x: { werte: fenster }, y: { werte: idx.map((t) => K[t].t) }, z, marke: { zeile: z.length - 1, werte: jetzt, pct },
n: K.length, von: K.length ? K[0].t : null, bis: K.length ? K[K.length - 1].t : null };
}
function grat(roh, o = {}) {
const K = kerzen(roh), N = o.tage || 60, breite = o.breite || 1, bins = o.bins || 72, atrN = o.atrN || 14, minN = o.minN || 22, T = tage(K), zeilen = [];
for (let j = 1; j < T.length; j++) {
const g = T[j]; if (g.n < minN || j - atrN < 1) continue;
let s = 0; for (let k = j - atrN; k < j; k++) { const t = T[k], c0 = T[k - 1].c; s += Math.max(t.h - t.l, Math.abs(t.h - c0), Math.abs(t.l - c0)); }
const atr = s / atrN; if (!(atr > 0)) continue;
const O = K[g.i0].o, lo = O - breite * atr, st = 2 * breite * atr / bins, w = new Array(bins).fill(0); let drin = 0, alle = 0;
for (let i = g.i0; i <= g.i1; i++) {
const k = K[i], v = k.v || 0; alle += v;
if (!(k.h > k.l)) { const b = Math.floor((k.c - lo) / st); if (b >= 0 && b < bins) { w[b] += v; drin += v; } continue; }
const b0 = Math.max(0, Math.floor((k.l - lo) / st)), b1 = Math.min(bins - 1, Math.floor((k.h - lo) / st));
for (let b = b0; b <= b1; b++) { const a = Math.max(k.l, lo + b * st), e = Math.min(k.h, lo + (b + 1) * st); if (e > a) { const x = v * (e - a) / (k.h - k.l); w[b] += x; drin += x; } }
}
const gl = w.map((_, b) => { let q = 0; for (let d = -2; d <= 2; d++) { const x = w[b + d]; if (x !== undefined) q += x * (3 - Math.abs(d)); } return q / 9; });
let mx = 0; for (const x of gl) if (x > mx) mx = x;
zeilen.push({ tag: g.tag, O, atr, w: gl.map((x) => (mx > 0 ? x / mx * 100 : 0)), drin: alle > 0 ? drin / alle : null, umsatz: alle });
}
const z = zeilen.slice(-N);
return { form: 'grat', art: 'grat', x: { werte: Array.from({ length: bins }, (_, b) => -breite + (b + 0.5) * 2 * breite / bins) }, y: { werte: z.map((r) => r.tag * TAG) },
z: z.map((r) => r.w), zeilen: z, breite, n: z.length, von: z.length ? z[0].tag * TAG : null, bis: z.length ? z[z.length - 1].tag * TAG : null };
}
const MON = { JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5, JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11 };
function verfall(s) { const m = /^(\d{1,2})([A-Z]{3})(\d{2})$/.exec(String(s || '')); return m && MON[m[2]] !== undefined ? Date.UTC(2000 + Number(m[3]), MON[m[2]], Number(m[1]), 8) : null; }
function zwischen(p, x) {
for (let i = 0; i < p.length - 1; i++) { const [x0, y0] = p[i], [x1, y1] = p[i + 1]; if (x >= x0 && x <= x1) return x1 === x0 ? (y0 + y1) / 2 : y0 + (y1 - y0) * (x - x0) / (x1 - x0); }
return null;
}
const SPALTEN = Array.from({ length: 25 }, (_, i) => -30 + i * 2.5);
function optionen(liste, o = {}) {
const jetzt = o.jetzt || Date.now(), sp = o.spalten || SPALTEN, roh = [];
if (liste && Array.isArray(liste.reihen)) {
for (const e of liste.reihen) if (e && e.smile && !e.kurz && e.F > 0) roh.push({ v: e.v, tage: e.tageEcht !== undefined ? e.tageEcht : e.tage, F: e.F, smile: e.smile.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]) });
} else {
const verf = new Map();
for (const x of liste || []) {
const a = Array.isArray(x), name = a ? x[0] : x.instrument_name, iv = zahl(a ? x[1] : x.mark_iv), u = zahl(a ? x[3] : x.underlying_price), t = String(name || '').split('-');
if (t.length !== 4 || (t[3] !== 'C' && t[3] !== 'P')) continue;
const v = verfall(t[1]), k = Number(t[2]); if (!v || !(k > 0) || v <= jetzt) continue;
const e = verf.get(v) || { v, opts: [], fwd: [] }; if (u > 0) e.fwd.push(u); if (iv > 0) e.opts.push([k, t[3], iv]); verf.set(v, e);
}
for (const e of [...verf.values()].sort((a, b) => a.v - b.v)) {
if (!e.fwd.length) continue;
const f = e.fwd.slice().sort((a, b) => a - b), h = f.length >> 1, F = f.length % 2 ? f[h] : (f[h - 1] + f[h]) / 2;
roh.push({ v: e.v, tage: (e.v - jetzt) / 864e5, F, smile: e.opts.filter(([k, art]) => (art === 'P' && k < F) || (art === 'C' && k >= F)).map(([k, , iv]) => [(k / F - 1) * 100, iv]).sort((a, b) => a[0] - b[0] || a[1] - b[1]) });
}
}
const reihen = [];
for (const e of roh) {
if (e.tage < (o.minTage || 0.25) || e.smile.length < (o.minPunkte || 5)) continue;
const w = sp.map((x) => zwischen(e.smile, x)); if (w.filter((x) => x !== null).length < 3) continue;
reihen.push({ v: e.v, tage: e.tage, F: e.F, w, n: e.smile.length });
}
let r = reihen.filter((x) => x.tage <= (o.maxTage || 400));
if (r.length > (o.maxVerfaelle || 14)) { const s = auswahl(r.length, o.maxVerfaelle || 14); r = s.map((i) => r[i]); }
return { form: 'flaeche', art: 'optionen', x: { werte: sp }, y: { werte: r.map((x) => x.tage) }, z: r.map((x) => x.w), reihen: r, jetzt: liste && liste.zeit ? liste.zeit : jetzt, n: r.reduce((a, x) => a + x.n, 0) };
}
const ZINS = [['1M', 'BC_1MONTH', 1 / 12], ['3M', 'BC_3MONTH', 0.25], ['6M', 'BC_6MONTH', 0.5], ['1J', 'BC_1YEAR', 1], ['2J', 'BC_2YEAR', 2], ['3J', 'BC_3YEAR', 3],
['5J', 'BC_5YEAR', 5], ['7J', 'BC_7YEAR', 7], ['10J', 'BC_10YEAR', 10], ['20J', 'BC_20YEAR', 20], ['30J', 'BC_30YEAR', 30]];
function treasuryXml(xml, reihe = {}) {
for (const b of String(xml).match(/<(?:\w+:)?properties>[\s\S]*?<\/(?:\w+:)?properties>/g) || []) {
const d = /<(?:\w+:)?NEW_DATE[^>]*>(\d{4}-\d{2}-\d{2})/.exec(b); if (!d) continue;
const p = []; for (const [lz, feld] of ZINS) { const x = new RegExp('<(?:\\w+:)?' + feld + '\\b[^>]*>(-?[0-9.]+)<').exec(b); if (x) p.push([lz, Number(x[1])]); }
if (p.length > 5) reihe[d[1]] = p;
}
return reihe;
}
function zinsen(reihe, o = {}) {
const daten = Object.keys(reihe || {}).sort(), idx = auswahl(daten.length, o.maxZeilen || 200), lz = o.laufzeiten || ZINS.map((x) => x[0]);
const z = idx.map((i) => { const m = new Map((reihe[daten[i]] || []).map((p) => [String(p[0]).replace('Y', 'J'), Number(p[1])])); return lz.map((k) => (ok(m.get(k)) ? m.get(k) : null)); });
return { form: 'flaeche', art: 'zinsen', x: { werte: lz.map((k) => (ZINS.find((q) => q[0] === k) || [0, 0, 0])[2]), namen: lz }, y: { werte: idx.map((i) => Date.parse(daten[i] + 'T00:00:00Z') / 1000) },
z, marke: { zeile: z.length - 1 }, n: daten.length, von: daten.length ? Date.parse(daten[0]) / 1000 : null, bis: daten.length ? Date.parse(daten[daten.length - 1]) / 1000 : null, nurAb: 0 };
}
function liquiditaet(roh, o = {}) {
let zl = [];
if (roh instanceof Map) { for (const [mi, v] of roh) zl.push({ t: mi * 60, mitte: v[0], karte: v[1] }); }
else for (const r of roh || []) zl.push(Array.isArray(r) ? { t: r[0], mitte: r[1], karte: r[2] } : r);
zl = zl.filter((r) => ok(r.t) && (r.karte || r.stufen)).map((r) => (r.t > 1e11 ? Object.assign({}, r, { t: Math.floor(r.t / 1000) }) : r)).sort((a, b) => a.t - b.t);
const weite = o.weite || 0.03, stufe = o.stufe || 0.001, letzt = zl.length ? zl[zl.length - 1] : null;
const mid = (r) => r.mitte || (r.stufen && r.stufen.length ? (() => { let lo = Infinity, hi = -Infinity; for (const [p] of r.stufen) { if (p < lo) lo = p; if (p > hi) hi = p; } return (lo + hi) / 2; })() : null);
const M = o.mitte || (letzt ? mid(letzt) : null); if (!M) return { form: 'flaeche', art: 'liquiditaet', x: { werte: [] }, y: { werte: [] }, z: [], n: 0 };
const bw = o.binBreite || M * stufe, a0 = o.binBreite ? Math.round(M * (1 - weite) / bw) * bw - bw / 2 : M * (1 - weite), nb = Math.round(2 * weite * M / bw), bin = (p) => Math.floor((p - a0) / bw);
const zeile = (r) => {
const w = new Array(nb).fill(0);
if (r.karte) { const n2 = r.karte.length / 2, sk = r.stufe || 0.001; for (let j = 0; j < r.karte.length; j++) { const b = bin(r.mitte * (1 + (j - n2 + 0.5) * sk)); if (b >= 0 && b < nb) w[b] += Number(r.karte[j]) || 0; } }
else for (const [p, usd] of r.stufen) { const b = bin(p); if (b >= 0 && b < nb) w[b] += usd; }
return w;
};
const max = o.maxZeilen || 72, s = Math.max(1, Math.ceil(zl.length / max)), z = [], y = [], pfad = [];
for (let e = zl.length; e > 0; e -= s) {
const teil = zl.slice(Math.max(0, e - s), e), sum = new Array(nb).fill(0); let pm = 0;
for (const r of teil) { const w = zeile(r); for (let b = 0; b < nb; b++) sum[b] += w[b]; pm += mid(r); }
const m = sum.map((x) => x / teil.length), gl = o.glatt === 0 ? m : m.map((x, b) => (b > 0 && b < nb - 1 ? (m[b - 1] + 2 * x + m[b + 1]) / 4 : x));
z.unshift(gl); y.unshift(teil[teil.length - 1].t); pfad.unshift(pm / teil.length);
}
return { form: 'flaeche', art: 'liquiditaet', x: { werte: Array.from({ length: nb }, (_, b) => a0 + (b + 0.5) * bw) }, y: { werte: y }, z, pfad, hoehe: 'wurzel', mitte: M, je: s, glatt: o.glatt !== 0,
n: zl.length, von: zl.length ? zl[0].t : null, bis: letzt ? letzt.t : null };
}
const rechne = { kerzen, tage, arkus, uhr, vola, volaReihen, grat, optionen, verfall, treasuryXml, zinsen, liquiditaet, auswahl, FENSTER, SPALTEN, ZINS };

const ORT = { de: 'de-DE', en: 'en-US', es: 'es-ES', fr: 'fr-FR', it: 'it-IT', tr: 'tr-TR' };
function sprache(o) { const s = String((o && o.sprache) || (W.document && document.documentElement.lang) || 'de').slice(0, 2).toLowerCase(); return ORT[s] ? s : 'en'; }
function tx(sp, k, ...a) {
const T = W.RYVO_W19_TEXTE || {}, s = (T[sp] && T[sp][k]) || (T.en && T.en[k]) || (T.de && T.de[k]) || k;
return String(s).replace(/\{(\d)\}/g, (_, i) => (a[+i] === null || a[+i] === undefined ? '–' : String(a[+i])));
}
const zf = (sp, x, nk = 1) => (ok(x) ? x.toLocaleString(ORT[sp], { minimumFractionDigits: nk, maximumFractionDigits: nk }) : '–');
const pz = (sp, x, nk = 1) => (!ok(x) ? '–' : sp === 'tr' ? '%' + zf(sp, x, nk) : zf(sp, x, nk) + (sp === 'en' ? '%' : ' %'));
const datum = (sp, s, lang) => (ok(s) ? new Date(s * 1000).toLocaleDateString(ORT[sp], lang ? { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' } : { day: '2-digit', month: '2-digit', year: '2-digit', timeZone: 'UTC' }) : '–');
const monat = (sp, s) => new Date(s * 1000).toLocaleDateString(ORT[sp], { month: 'short', year: '2-digit', timeZone: 'UTC' });
const wtag = (sp, w) => new Date(Date.UTC(2024, 0, 1 + w)).toLocaleDateString(ORT[sp], { weekday: 'short', timeZone: 'UTC' });
function geld(sp, x) { if (!ok(x)) return '–'; const a = Math.abs(x), [d, k, nk] = a >= 1e9 ? [1e9, 'mrd', 2] : a >= 1e6 ? [1e6, 'mio', 1] : a >= 1e3 ? [1e3, 'tsd', 0] : [1, '', 0]; return zf(sp, x / d, nk) + (k ? ' ' + tx(sp, k) : '') + ' $'; }
const preis = (sp, x) => (ok(x) ? x.toLocaleString(ORT[sp], { maximumFractionDigits: x >= 1000 ? 0 : x >= 1 ? 2 : 5 }) : '–');

function zeitTicks(G) {
const y = G.y.werte, span = y.length ? y[y.length - 1] - y[0] : 0, aus = [];
const art = span > 900 * TAG ? 'jahr' : span > 150 * TAG ? 'monat' : span > 10 * TAG ? 'tag' : span > 0.5 * TAG ? 'zeit' : 'uhr';
const schritt = span > 3 * 3600 ? 3600e3 : span > 3600 ? 9e5 : 3e5;
const schl = { jahr: (d) => d.getUTCFullYear(), monat: (d) => d.getUTCFullYear() * 4 + (d.getUTCMonth() / 3 | 0), tag: (d) => Math.floor((d.getTime() / 864e5 + 3) / 7), zeit: (d) => Math.floor(d.getTime() / 432e5), uhr: (d) => Math.floor(d.getTime() / schritt) }[art];
for (let i = 1; i < y.length; i++) if (schl(new Date(y[i] * 1000)) !== schl(new Date(y[i - 1] * 1000))) aus.push(i);
return { idx: aus, art, rund: art === 'zeit' ? 432e2 : art === 'uhr' ? schritt / 1000 : 0 };
}
const zeitText = (sp, v, art) => { const d = new Date(v * 1000); return art === 'jahr' ? String(d.getUTCFullYear()) : art === 'monat' ? monat(sp, v) : d.toLocaleString(ORT[sp], art === 'uhr' ? { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' } : art === 'tag' ? { day: '2-digit', month: '2-digit', timeZone: 'UTC' } : { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }); };

const ANS = {
vola: { form: 'flaeche', zeit: true, bau: (d, o) => vola(d.kerzen || d, o),
ax: (sp, G) => [tx(sp, 'vola.x'), tx(sp, 'vola.y'), tx(sp, 'vola.z')], fx: (sp, v) => tx(sp, 'tage', v), fy: (sp, v) => monat(sp, v), fz: (sp, v) => pz(sp, v, 0),
tipp: (sp, G, i, j) => [tx(sp, 'vola.tipp', datum(sp, G.y.werte[i], 1), G.x.werte[j], pz(sp, G.z[i][j], 1))].concat(i === G.z.length - 1 && G.marke.pct[j] !== null ? [tx(sp, 'vola.pct', zf(sp, G.marke.pct[j], 0))] : []),
meta: (sp, G) => [tx(sp, 'vola.stich', G.n, datum(sp, G.von), datum(sp, G.bis))] },
uhr: { form: 'saeulen', bau: (d, o) => uhr(d.kerzen || d, o),
ax: (sp, G) => [tx(sp, G.versatz ? 'uhr.xOrt' : 'uhr.x'), tx(sp, 'uhr.y'), tx(sp, 'uhr.z.' + G.teil)], fx: (sp, v) => String(v).padStart(2, '0'), fy: (sp, v) => wtag(sp, v), fz: (sp, v) => pz(sp, v, 0),
tipp: (sp, G, i, j) => [tx(sp, 'uhr.tipp', wtag(sp, i), String(j).padStart(2, '0'), String((j + 1) % 24).padStart(2, '0'), pz(sp, G.z[i][j], 1), G.n[i]), tx(sp, 'uhr.zufall', pz(sp, G.ebene[i][j], 1))],
meta: (sp, G) => [tx(sp, 'uhr.stich', G.tage, datum(sp, G.von === null ? null : G.von * TAG), datum(sp, G.bis === null ? null : G.bis * TAG))] },
grat: { form: 'grat', zeit: true, bau: (d, o) => grat(d.kerzen || d, o),
ax: (sp, G) => [tx(sp, 'grat.x'), tx(sp, 'grat.y'), tx(sp, 'grat.z')], fx: (sp, v) => (v > 0 ? '+' : v < 0 ? '−' : '') + zf(sp, Math.abs(v), 1), fy: (sp, v) => datum(sp, v), fz: (sp, v) => pz(sp, v, 0),
tipp: (sp, G, i, j) => { const r = G.zeilen[i]; return [tx(sp, 'grat.tipp', datum(sp, G.y.werte[i], 1), preis(sp, r.O + G.x.werte[j] * r.atr), (G.x.werte[j] >= 0 ? '+' : '−') + zf(sp, Math.abs(G.x.werte[j]), 2), pz(sp, G.z[i][j], 0)), tx(sp, 'grat.tipp2', geld(sp, r.umsatz), pz(sp, r.drin * 100, 0))]; },
meta: (sp, G) => [tx(sp, 'grat.stich', G.n, datum(sp, G.von), datum(sp, G.bis), zf(sp, G.breite, 0))] },
optionen: { form: 'flaeche', bau: (d, o) => optionen(d.reihen ? d : d.optionen || d.opt || d, Object.assign({ jetzt: d.jetzt || d.zeit }, o)),
ax: (sp, G) => [tx(sp, 'opt.x'), tx(sp, 'opt.y'), tx(sp, 'opt.z')], fx: (sp, v) => (v > 0 ? '+' : v < 0 ? '−' : '') + zf(sp, Math.abs(v), 0) + (sp === 'en' ? '%' : ' %'),
fy: (sp, v) => tx(sp, 'tage', zf(sp, v, v < 10 ? 1 : 0)), fz: (sp, v) => pz(sp, v, 0),
tipp: (sp, G, i, j) => { const r = G.reihen[i]; return [tx(sp, 'opt.tipp', datum(sp, r.v / 1000, 1), zf(sp, r.tage, r.tage < 10 ? 1 : 0), preis(sp, r.F * (1 + G.x.werte[j] / 100)), (G.x.werte[j] >= 0 ? '+' : '−') + zf(sp, Math.abs(G.x.werte[j]), 1), pz(sp, G.z[i][j], 1))]; },
meta: (sp, G) => [tx(sp, 'opt.stich', G.reihen.length, G.n, datum(sp, G.jetzt / 1000, 1))] },
zinsen: { form: 'flaeche', zeit: true, bau: (d, o) => zinsen(d.reihe || (d.xml ? [].concat(d.xml).reduce((r, x) => treasuryXml(x, r), {}) : d), o),
ax: (sp, G) => [tx(sp, 'zins.x'), tx(sp, 'zins.y'), tx(sp, 'zins.z')], fx: (sp, v, j, G) => tx(sp, 'lz.' + G.x.namen[j]), fy: (sp, v) => monat(sp, v), fz: (sp, v) => pz(sp, v, 1),
tipp: (sp, G, i, j) => [tx(sp, 'zins.tipp', datum(sp, G.y.werte[i], 1), tx(sp, 'lz.' + G.x.namen[j]), pz(sp, G.z[i][j], 2))],
meta: (sp, G) => [tx(sp, 'zins.stich', G.n, datum(sp, G.von), datum(sp, G.bis))] },
liquiditaet: { form: 'flaeche', zeit: true, bau: (d, o) => liquiditaet(d.zeilen || d, o),
ax: (sp, G) => [tx(sp, 'liq.x'), tx(sp, 'liq.y'), tx(sp, 'liq.z')], fx: (sp, v) => preis(sp, v), fy: (sp, v) => new Date(v * 1000).toLocaleString(ORT[sp], { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }), fz: (sp, v) => geld(sp, v),
tipp: (sp, G, i, j) => [tx(sp, 'liq.tipp', ANS.liquiditaet.fy(sp, G.y.werte[i]), preis(sp, G.x.werte[j] - (G.x.werte[1] - G.x.werte[0]) / 2), preis(sp, G.x.werte[j] + (G.x.werte[1] - G.x.werte[0]) / 2), geld(sp, G.z[i][j])), tx(sp, 'liq.kurs', preis(sp, G.pfad[i]))],
meta: (sp, G) => [tx(sp, 'liq.stich', G.n, ANS.liquiditaet.fy(sp, G.von), ANS.liquiditaet.fy(sp, G.bis))] },
};
const ansichten = Object.keys(ANS).map((id) => ({ id, form: ANS[id].form, titel: (sp) => tx(sp || 'de', id + '.titel'), was: (sp) => tx(sp || 'de', id + '.was'), wie: (sp) => tx(sp || 'de', id + '.wie') }));

const STOPS = [[0, 0x1f, 0x20, 0x24], [0.2, 0x26, 0x32, 0x4a], [0.48, 0x3d, 0x63, 0xa8], [0.8, 0xe0, 0xa6, 0x4e], [1, 0xf8, 0xeb, 0xcf]];
function farbe(t) {
t = Math.max(0, Math.min(1, t)); let i = 1; while (i < STOPS.length - 1 && t > STOPS[i][0]) i++;
const a = STOPS[i - 1], b = STOPS[i], u = (t - a[0]) / (b[0] - a[0] || 1);
return [a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u, a[3] + (b[3] - a[3]) * u];
}
const rgb = (c, f = 1, al = 1) => `rgba(${Math.round(Math.min(255, c[0] * f))},${Math.round(Math.min(255, c[1] * f))},${Math.round(Math.min(255, c[2] * f))},${al})`;
const GOLD = '#e0a64e', LEISE = '#8b8e96', TEXT = '#ecebe6', LINIE = 'rgba(236,235,230,0.07)', LINIE2 = 'rgba(236,235,230,0.16)';

const KAM = { vola: [-0.72, 0.5], uhr: [-0.62, 0.55], grat: [-0.22, 0.62], optionen: [-0.82, 0.45], zinsen: [-0.7, 0.48], liquiditaet: [-0.62, 0.55] };
function stil(el, s) { for (const k in s) el.style[k] = s[k]; return el; }
function knopf(t, bei) { const b = stil(document.createElement('button'), { font: '500 11px/1 var(--mono, ui-monospace, monospace)', color: TEXT, background: 'rgba(236,235,230,0.06)', border: '1px solid rgba(236,235,230,0.14)', borderRadius: '6px', padding: '5px 8px', cursor: 'pointer', flex: 'none' }); b.type = 'button'; b.textContent = t; b.addEventListener('click', bei); return b; }

function zeichne(el, art, daten, opt = {}) {
if (!ANS[art]) throw new Error('W19: unbekannte Ansicht ' + art);
const sp = sprache(opt), A = ANS[art], o = Object.assign({ kopf: true, erklaerung: true, drehen: false, hoehe: null }, opt);
const ruhig = !!(W.matchMedia && W.matchMedia('(prefers-reduced-motion: reduce)').matches);
const wurzel = stil(document.createElement('div'), { position: 'relative', display: 'flex', flexDirection: 'column', gap: '6px', height: o.hoehe ? o.hoehe + 'px' : '100%', minHeight: '220px', color: TEXT, font: '12px/1.4 var(--sans, system-ui, sans-serif)' });
wurzel.className = 'w19'; wurzel.dataset.ansicht = art;
const kopf = stil(document.createElement('div'), { display: o.kopf ? 'flex' : 'none', alignItems: 'center', gap: '6px' });
const titel = stil(document.createElement('strong'), { font: '600 12px/1.2 var(--sans, system-ui, sans-serif)', letterSpacing: '.02em', marginRight: 'auto', flex: '1 1 0', minWidth: '0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' });
const buehne = stil(document.createElement('div'), { position: 'relative', flex: '1 1 auto', minHeight: '180px', touchAction: 'none', cursor: 'grab', outline: 'none' });
const cv = stil(document.createElement('canvas'), { position: 'absolute', inset: '0', width: '100%', height: '100%', display: 'block' });
const tipp = stil(document.createElement('div'), { position: 'absolute', pointerEvents: 'none', background: 'rgba(23,24,27,0.94)', border: '1px solid rgba(224,166,78,0.45)', borderRadius: '6px', padding: '6px 8px', font: '500 11px/1.45 var(--mono, ui-monospace, monospace)', color: TEXT, maxWidth: '300px', display: 'none', zIndex: '2' });
const fuss = stil(document.createElement('div'), { display: o.fuss === false ? 'none' : 'block', font: '11px/1.45 var(--sans, system-ui, sans-serif)', color: LEISE });
buehne.tabIndex = 0; buehne.setAttribute('role', 'img');
buehne.append(cv, tipp); wurzel.append(kopf, buehne, fuss); el.append(wurzel);
const ctx = cv.getContext('2d');
const STD = { yaw: (KAM[art] || KAM.vola)[0], pitch: (KAM[art] || KAM.vola)[1] };
const z = { yaw: STD.yaw, pitch: STD.pitch, zoom: 1, dreht: !!o.drehen && !ruhig, raf: 0, letzt: 0, dirty: true, W: 0, H: 0, dpr: 1, hit: null, sicht: true, tot: false };
let G = null, V = null;
const zk = knopf('', () => { if (o.bei2D) o.bei2D(); else { z.flach = !z.flach; zk.textContent = tx(sp, z.flach ? 'dreiD' : 'zweiD'); malen(); } });
const dk = knopf('', () => { z.dreht = !z.dreht && !ruhig; dk.textContent = tx(sp, z.dreht ? 'anhalten' : 'drehen'); z.letzt = 0; malen(); });
const rk = knopf(tx(sp, 'zurueck'), () => zurueck());
kopf.append(titel, zk, dk, rk);
function texte() {
titel.textContent = tx(sp, art + '.titel'); zk.textContent = tx(sp, z.flach ? 'dreiD' : 'zweiD'); dk.textContent = tx(sp, z.dreht ? 'anhalten' : 'drehen'); dk.hidden = ruhig;
buehne.setAttribute('aria-label', tx(sp, art + '.titel') + ' – ' + tx(sp, art + '.was'));
fuss.replaceChildren();
if (o.erklaerung) { const p = document.createElement('p'); stil(p, { margin: '0', color: TEXT }); p.textContent = tx(sp, art + '.was') + ' ' + tx(sp, art + '.wie'); fuss.append(p); }
const q = document.createElement('p'); stil(q, { margin: '2px 0 0' });
q.textContent = [o.quelle ? tx(sp, 'quelle', o.quelle) : null].concat(G ? A.meta(sp, G) : []).concat([tx(sp, 'bedienung'), tx(sp, 'hinweis')]).filter(Boolean).join(' · ');
fuss.append(q);
}
function zurueck() { z.yaw = STD.yaw; z.pitch = STD.pitch; z.zoom = 1; z.flach = false; texte(); malen(); }
const HZ = 0.95;
function vorbereiten() {
const ny = G.z.length, nx = ny ? G.z[0].length : 0, alle = [];
for (const r of G.z) for (const v of r) if (ok(v)) alle.push(v);
if (G.ebene) for (const r of G.ebene) for (const v of r) if (ok(v)) alle.push(v);
alle.sort((a, b) => a - b);
const lo = G.form === 'flaeche' && G.art !== 'liquiditaet' ? alle[0] || 0 : 0, hi = alle.length ? alle[Math.min(alle.length - 1, Math.floor(alle.length * (G.art === 'liquiditaet' ? 0.995 : 1)))] : 1;
const tr = G.hoehe === 'wurzel' ? (v) => Math.sqrt(Math.max(0, v - lo) / ((hi - lo) || 1)) : (v) => (v - lo) / ((hi - lo) || 1);
const hs = G.form === 'grat' ? 0.5 : 1, zh = (v) => (ok(v) ? Math.min(1.08, tr(v)) * HZ * hs : null);
const X = (j) => (nx > 1 ? -1 + 2 * j / (nx - 1) : 0), Y = (i) => (ny > 1 ? 1 - 2 * i / (ny - 1) : 0);
const ex = G.form === 'saeulen' ? 1 - 1 / nx : 1, ey = G.form === 'saeulen' ? 1 - 1 / ny : 1;
V = { nx, ny, lo, hi, zh, tr, hz: HZ * hs, X: (j) => X(j) * ex, Y: (i) => Y(i) * ey, cw: 2 / nx * 0.78 * (G.form === 'saeulen' ? 1 : 0), ch: 2 / ny * 0.78 * (G.form === 'saeulen' ? 1 : 0) };
const L = [-0.45, 0.55, 0.7], ll = Math.hypot(...L); L[0] /= ll; L[1] /= ll; L[2] /= ll;
if (G.form === 'flaeche') {
V.farben = new Array((ny - 1) * (nx - 1)); V.wz = new Float32Array(nx * ny);
for (let i = 0; i < ny; i++) for (let j = 0; j < nx; j++) { const h = zh(G.z[i][j]); V.wz[i * nx + j] = h === null ? NaN : h; }
const sx = 2 / Math.max(1, nx - 1), sy = 2 / Math.max(1, ny - 1);
for (let i = 0; i < ny - 1; i++) for (let j = 0; j < nx - 1; j++) {
const a = V.wz[i * nx + j], b = V.wz[i * nx + j + 1], c = V.wz[(i + 1) * nx + j + 1], d = V.wz[(i + 1) * nx + j];
if (!(a === a && b === b && c === c && d === d)) { V.farben[i * (nx - 1) + j] = null; continue; }
const gx = ((b - a) + (c - d)) / 2 / sx, gy = ((a - d) + (b - c)) / 2 / sy, n = [-gx, -gy, 1], nl = Math.hypot(...n);
const s = 0.62 + 0.55 * Math.max(0, (n[0] * L[0] + n[1] * L[1] + n[2] * L[2]) / nl), t = (a + b + c + d) / 4 / HZ;
V.farben[i * (nx - 1) + j] = rgb(farbe(0.12 + 0.88 * Math.pow(Math.max(0, t), 0.75)), s);
}
} else if (G.form === 'saeulen') {
V.farben = []; for (let i = 0; i < ny; i++) for (let j = 0; j < nx; j++) { const t = (zh(G.z[i][j]) || 0) / HZ, c = farbe(0.15 + 0.85 * t); V.farben.push([rgb(c, 1.12), rgb(c, 0.78), rgb(c, 0.6)]); }
} else {
V.farben = G.z.map((r, i) => r.map((v) => rgb(farbe(0.25 + 0.75 * (v || 0) / 100), 1)));
}
}
let cy = 0, sy = 0, cp = 0, spch = 0, mx = 0, my = 0, sk = 1, fit = null;
const AUG = 7;
function kamera() { cy = Math.cos(z.yaw); sy = Math.sin(z.yaw); const p = z.flach ? Math.PI / 2 - 1e-4 : z.pitch; cp = Math.cos(p); spch = Math.sin(p); }
const P = new Float32Array(3);
function proj(x, y, h) {
const xr = x * cy - y * sy, yr = x * sy + y * cy, hh = h - V.hz * 0.42, d = yr * cp - hh * spch, f = z.flach ? 1 : AUG / (AUG + d);
P[0] = mx + xr * sk * f; P[1] = my - (yr * spch + hh * cp) * sk * f; P[2] = d; return P;
}
function malen() { z.dirty = true; if (!z.raf && !z.tot) z.raf = requestAnimationFrame(bild); }
function bild(ts) {
z.raf = 0; if (z.tot) return;
if (z.dreht && z.sicht && !document.hidden) { if (z.letzt) z.yaw = (z.yaw + (ts - z.letzt) * 0.00012) % (2 * Math.PI); z.letzt = ts; z.dirty = true; }
else z.letzt = 0;
if (z.dirty) { z.dirty = false; const t0 = performance.now(); try { szene(); } catch (e) {   } z.ms = performance.now() - t0; z.bilder = (z.bilder || 0) + 1; z.summe = (z.summe || 0) + z.ms; }
if (z.dreht && z.sicht && !document.hidden) z.raf = requestAnimationFrame(bild);
}
function groesse() {
const r = buehne.getBoundingClientRect(), dpr = Math.min(2, W.devicePixelRatio || 1), w = Math.max(1, Math.round(r.width * dpr)), h = Math.max(1, Math.round(r.height * dpr));
if (w !== cv.width || h !== cv.height) { cv.width = w; cv.height = h; } z.W = w; z.H = h; z.dpr = dpr;
}
function schrift(px, gew = 500) { ctx.font = `${gew} ${Math.round(px * z.dpr * (o.textMass || 1))}px ${o.schrift || 'Geist Mono, ui-monospace, SFMono-Regular, Menlo, monospace'}`; }
function szene() {
groesse(); const { W: w, H: h, dpr } = z;
ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = o.grund || '#17181b'; ctx.fillRect(0, 0, w, h);
if (!G || !V || !V.ny || !V.nx) { schrift(12); ctx.fillStyle = LEISE; ctx.textAlign = 'center'; ctx.fillText(tx(sp, 'leer'), w / 2, h / 2); return; }
const p = z.flach ? 'f' : z.pitch.toFixed(3);
if (!fit || fit.p !== p || fit.hz !== V.hz) {
const yaw0 = z.yaw; let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity; sk = 1; mx = 0; my = 0;
for (let k = 0; k < 24; k++) { z.yaw = k * Math.PI / 12; kamera(); for (const [a, b] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) for (const hh of [0, V.hz]) { proj(a, b, hh); x0 = Math.min(x0, P[0]); x1 = Math.max(x1, P[0]); y0 = Math.min(y0, P[1]); y1 = Math.max(y1, P[1]); } }
z.yaw = yaw0; fit = { p, hz: V.hz, x0, x1, y0, y1 };
}
kamera();
const schmal = w < 430 * dpr, rl = (schmal ? 30 : 46) * dpr, rr = (G.form === 'grat' || schmal ? 30 : 70) * dpr, ro = 26 * dpr, ru = 30 * dpr, aw = Math.max(40, w - rl - rr), ah = Math.max(40, h - ro - ru);
sk = Math.min(aw / (fit.x1 - fit.x0), ah / (fit.y1 - fit.y0)) * z.zoom;
mx = rl + aw / 2 - (fit.x0 + fit.x1) / 2 * sk; my = ro + ah / 2 - (fit.y0 + fit.y1) / 2 * sk;
z.hit = []; z.etiketten = [];
raum(); if (G.form === 'flaeche') flaeche(); else if (G.form === 'saeulen') saeulen(); else grate();
achsen(); legende();
}
function raum() {
const xs = proj(1, 0, 0)[2] > proj(-1, 0, 0)[2] ? 1 : -1, ys = proj(0, 1, 0)[2] > proj(0, -1, 0)[2] ? 1 : -1; V.wand = [xs, ys];
const li = (a, b, c, d, e, f, s) => { ctx.strokeStyle = s; ctx.beginPath(); proj(a, b, c); ctx.moveTo(P[0], P[1]); proj(d, e, f); ctx.lineTo(P[0], P[1]); ctx.stroke(); };
ctx.lineWidth = Math.max(1, z.dpr * 0.8);
ctx.fillStyle = 'rgba(236,235,230,0.025)'; ctx.beginPath(); for (const [a, b] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) { proj(a, b, 0); ctx.lineTo(P[0], P[1]); } ctx.closePath(); ctx.fill();
for (let k = 0; k <= 8; k++) { const u = -1 + k / 4; li(u, -1, 0, u, 1, 0, LINIE); li(-1, u, 0, 1, u, 0, LINIE); }
if (z.flach) return;
const zt = zTicks();
for (const [v] of zt) { const hh = V.zh(v); if (hh === null) continue; li(xs, -1, hh, xs, 1, hh, LINIE); li(-1, ys, hh, 1, ys, hh, LINIE); }
li(xs, ys, 0, xs, ys, V.hz, LINIE2); li(xs, -ys, 0, xs, -ys, V.hz, LINIE); li(-xs, ys, 0, -xs, ys, V.hz, LINIE);
for (let k = 0; k <= 4; k++) { const u = -1 + k / 2; li(xs, u, 0, xs, u, V.hz, LINIE); li(u, ys, 0, u, ys, V.hz, LINIE); }
}
function zTicks() {
const span = V.hi - V.lo || 1, roh = span / 4, p = Math.pow(10, Math.floor(Math.log10(roh))), st = [1, 2, 2.5, 5, 10].map((m) => m * p).find((s) => s >= roh) || roh, aus = [];
for (let v = Math.ceil(V.lo / st) * st; v <= V.hi + 1e-9; v += st) aus.push([v]);
return aus;
}
function quad(pts, fill, stroke) { ctx.beginPath(); ctx.moveTo(pts[0], pts[1]); ctx.lineTo(pts[2], pts[3]); ctx.lineTo(pts[4], pts[5]); ctx.lineTo(pts[6], pts[7]); ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); if (stroke) { ctx.strokeStyle = stroke; ctx.stroke(); } }
function flaeche() {
const { nx, ny } = V, sx = new Float32Array(nx * ny), syy = new Float32Array(nx * ny);
for (let i = 0; i < ny; i++) for (let j = 0; j < nx; j++) { const k = i * nx + j, h = V.wz[k]; proj(V.X(j), V.Y(i), h === h ? h : 0); sx[k] = P[0]; syy[k] = P[1]; }
const nq = (nx - 1) * (ny - 1), ord = new Uint32Array(nq), tief = new Float32Array(nq);
for (let i = 0; i < ny - 1; i++) for (let j = 0; j < nx - 1; j++) { const q = i * (nx - 1) + j; ord[q] = q; tief[q] = proj((V.X(j) + V.X(j + 1)) / 2, (V.Y(i) + V.Y(i + 1)) / 2, 0)[2]; }
ord.sort((a, b) => tief[b] - tief[a]);
const fein = nq <= (o.feinBis || 1600), aus = 0.55 * z.dpr, pts = new Float32Array(8), hp = new Float32Array(nq * 8), hr = new Uint32Array(nq); let m = 0;
ctx.lineJoin = 'round'; ctx.lineWidth = fein ? Math.max(0.6, z.dpr * 0.5) : Math.max(0.5, z.dpr * 0.45);
for (let n = 0; n < nq; n++) {
const q = ord[n], f = V.farben[q]; if (!f) continue;
const i = (q / (nx - 1)) | 0, j = q - i * (nx - 1), a = i * nx + j, b = a + 1, c = a + nx + 1, d = a + nx;
pts[0] = sx[a]; pts[1] = syy[a]; pts[2] = sx[b]; pts[3] = syy[b]; pts[4] = sx[c]; pts[5] = syy[c]; pts[6] = sx[d]; pts[7] = syy[d];
if (fein) quad(pts, f, 'rgba(23,24,27,0.28)');
else {
const mx2 = (pts[0] + pts[2] + pts[4] + pts[6]) / 4, my2 = (pts[1] + pts[3] + pts[5] + pts[7]) / 4;
for (let k = 0; k < 8; k += 2) { const dx = pts[k] - mx2, dy = pts[k + 1] - my2, l = Math.hypot(dx, dy) || 1; pts[k] += dx / l * aus; pts[k + 1] += dy / l * aus; }
quad(pts, f, null);
}
hp.set(pts, m * 8); hr[m++] = q;
}
z.hit = { pts: hp, ref: hr, n: m, art: 'quad' };
ctx.lineWidth = 2 * z.dpr; ctx.strokeStyle = GOLD;
if (G.marke && G.marke.zeile !== undefined && !z.flach) { const i = G.marke.zeile; ctx.beginPath(); let an = false; for (let j = 0; j < nx; j++) { const h = V.wz[i * nx + j]; if (h !== h) { an = false; continue; } proj(V.X(j), V.Y(i), h + 0.004); if (an) ctx.lineTo(P[0], P[1]); else ctx.moveTo(P[0], P[1]); an = true; } ctx.stroke(); }
if (G.pfad) {
const x0 = G.x.werte[0], x1 = G.x.werte[nx - 1]; ctx.beginPath(); let an = false; ctx.globalAlpha = 0.95;
for (let i = 0; i < ny; i++) { const u = (G.pfad[i] - x0) / (x1 - x0); if (!(u >= 0 && u <= 1)) { an = false; continue; } proj(-1 + 2 * u, V.Y(i), 0.002); if (an) ctx.lineTo(P[0], P[1]); else ctx.moveTo(P[0], P[1]); an = true; }
ctx.lineWidth = 1.6 * z.dpr; ctx.stroke(); ctx.globalAlpha = 1;
}
}
function quader(x, y, h0, h1, f, ent) {
const hw = V.cw / 2, hd = V.ch / 2, ec = [[x - hw, y - hd], [x + hw, y - hd], [x + hw, y + hd], [x - hw, y + hd]], pts = new Float32Array(8);
const seiten = [[0, 1, 0, -1], [1, 2, 1, 0], [2, 3, 0, 1], [3, 0, -1, 0]];
for (const [a, b, nx2, ny2] of seiten) {
if (nx2 * sy + ny2 * cy >= 0 || z.flach) continue;
proj(ec[a][0], ec[a][1], h0); pts[0] = P[0]; pts[1] = P[1]; proj(ec[b][0], ec[b][1], h0); pts[2] = P[0]; pts[3] = P[1];
proj(ec[b][0], ec[b][1], h1); pts[4] = P[0]; pts[5] = P[1]; proj(ec[a][0], ec[a][1], h1); pts[6] = P[0]; pts[7] = P[1];
quad(pts, nx2 ? f[1] : f[2], 'rgba(23,24,27,0.35)'); if (ent) ent(pts);
}
for (let k = 0; k < 4; k++) { proj(ec[k][0], ec[k][1], h1); pts[k * 2] = P[0]; pts[k * 2 + 1] = P[1]; }
quad(pts, f[0], 'rgba(23,24,27,0.35)'); if (ent) ent(pts);
}
function saeulen() {
const { nx, ny } = V, zellen = [];
for (let i = 0; i < ny; i++) for (let j = 0; j < nx; j++) zellen.push([i, j, proj(V.X(j), V.Y(i), 0)[2]]);
zellen.sort((a, b) => b[2] - a[2]);
const hp = [], hr = []; ctx.lineWidth = Math.max(0.6, z.dpr * 0.6);
const ebeneF = 'rgba(236,235,230,0.16)', ebeneL = 'rgba(236,235,230,0.5)', pts = new Float32Array(8);
for (const [i, j] of zellen) {
const x = V.X(j), y = V.Y(i), h = V.zh(G.z[i][j]) || 0, e = G.ebene ? V.zh(G.ebene[i][j]) : null, f = V.farben[i * nx + j], ent = (p) => { hp.push(Float32Array.from(p)); hr.push(i * nx + j); };
const lo = e === null ? h : Math.min(h, e);
if (lo > 0.001) quader(x, y, 0, lo, f, ent);
if (e !== null && !z.flach) {
const hx = 1 / nx, hy = 1 / ny, ec = [[x - hx, y - hy], [x + hx, y - hy], [x + hx, y + hy], [x - hx, y + hy]];
for (let k = 0; k < 4; k++) { proj(ec[k][0], ec[k][1], e); pts[k * 2] = P[0]; pts[k * 2 + 1] = P[1]; }
quad(pts, ebeneF, null); ctx.strokeStyle = ebeneL; ctx.beginPath(); ctx.moveTo(pts[0], pts[1]); ctx.lineTo(pts[2], pts[3]); ctx.stroke();
}
if (h > lo + 0.001) quader(x, y, lo, h, f, ent);
}
z.hit = { liste: hp, ref: hr, art: 'poly' };
}
function grate() {
const { nx, ny } = V, reihen = []; for (let i = 0; i < ny; i++) reihen.push([i, proj(0, V.Y(i), 0)[2]]);
reihen.sort((a, b) => b[1] - a[1]);
const hp = [], hr = [], neu = ny - 1;
proj(0, 0, V.hz); const yo = P[1]; proj(0, 0, 0); const yu = P[1], verlauf = ctx.createLinearGradient(0, yu + 0.25 * (yu - yo), 0, yo);
for (let k = 0; k <= 8; k++) verlauf.addColorStop(k / 8, rgb(farbe(0.3 + 0.7 * k / 8)));
ctx.lineJoin = 'round';
for (const [i] of reihen) {
const y = V.Y(i), pts = new Float32Array(nx * 2);
for (let j = 0; j < nx; j++) { proj(V.X(j), y, V.zh(G.z[i][j]) || 0); pts[j * 2] = P[0]; pts[j * 2 + 1] = P[1]; }
proj(V.X(nx - 1), y, 0); const r0 = [P[0], P[1]]; proj(V.X(0), y, 0); const l0 = [P[0], P[1]];
ctx.beginPath(); ctx.moveTo(l0[0], l0[1]); for (let k = 0; k < pts.length; k += 2) ctx.lineTo(pts[k], pts[k + 1]); ctx.lineTo(r0[0], r0[1]); ctx.closePath();
ctx.fillStyle = 'rgba(23,24,27,0.92)'; ctx.fill();
ctx.beginPath(); ctx.moveTo(pts[0], pts[1]); for (let k = 2; k < pts.length; k += 2) ctx.lineTo(pts[k], pts[k + 1]);
ctx.globalAlpha = i === neu ? 1 : 0.45 + 0.55 * (i / Math.max(1, neu)); ctx.strokeStyle = i === neu ? GOLD : verlauf; ctx.lineWidth = (i === neu ? 2.2 : 1.2) * z.dpr; ctx.stroke(); ctx.globalAlpha = 1;
hp.push([pts, l0, r0]); hr.push(i);
}
ctx.setLineDash([4 * z.dpr, 4 * z.dpr]); ctx.strokeStyle = 'rgba(224,166,78,0.55)'; ctx.lineWidth = z.dpr; ctx.beginPath(); proj(0, -1, 0); ctx.moveTo(P[0], P[1]); proj(0, 1, 0); ctx.lineTo(P[0], P[1]); ctx.stroke(); ctx.setLineDash([]);
z.hit = { grat: hp, ref: hr, art: 'grat' };
}
function etikett(s, x, y, al, farbeT, pflicht) {
const w = ctx.measureText(s).width, h = 11 * z.dpr * (o.textMass || 1); let x0 = al === 'center' ? x - w / 2 : al === 'right' ? x - w : x;
if (pflicht) { const k = Math.max(4 * z.dpr, Math.min(z.W - w - 4 * z.dpr, x0)); x += k - x0; x0 = k; y = Math.max(h, Math.min(z.H - 4 * z.dpr, y)); }
const r = [x0 - 2 * z.dpr, y - h, x0 + w + 2 * z.dpr, y + 3 * z.dpr];
if (!pflicht && (r[0] < 0 || r[2] > z.W || r[1] < 0 || r[3] > z.H)) return false;
for (const q of z.etiketten) if (r[0] < q[2] && r[2] > q[0] && r[1] < q[3] && r[3] > q[1]) return false;
z.etiketten.push(r); ctx.fillStyle = farbeT; ctx.textAlign = al; ctx.fillText(s, x, y); return true;
}
function achsen() {
const [xs, ys] = V.wand, [nx_, ny_, nz_] = A.ax(sp, G), d = z.dpr, aus = 12 * d;
proj(0, 0, 0); const c0 = [P[0], P[1]];
const rand = (x, y, h = 0, weit = aus) => { proj(x, y, h); const vx = P[0] - c0[0], vy = P[1] - c0[1], l = Math.hypot(vx, vy) || 1; return [P[0] + vx / l * weit, P[1] + vy / l * weit + 4 * d, Math.abs(vx) / l < 0.35 ? 'center' : vx > 0 ? 'left' : 'right']; };
schrift(10); let ly = 14 * d;
const leg = (s, f) => { etikett(s, 8 * d, ly, 'left', f, true); ly += 14 * d; };
if (G.ebene && !z.flach) leg('▭ ' + tx(sp, 'zufall'), 'rgba(236,235,230,0.75)');
if (G.marke && G.marke.zeile !== undefined) leg('— ' + tx(sp, 'heute'), GOLD);
if (G.pfad) leg('— ' + tx(sp, 'kurs'), GOLD);
if (G.form === 'grat') leg('— ' + tx(sp, 'grat.neu'), GOLD);
const namen = [];
const name = (s, f) => namen.push([s, f]);
schrift(10.5, 600);
name(nx_, (t, w) => rand(t * xs, -ys, 0, w));
name(ny_, (t, w) => rand(-xs, t * ys, 0, w));
if (!z.flach) { proj(xs, -ys, V.hz); etikett(nz_, P[0], P[1] - 12 * d, 'center', TEXT, true); }
schrift(10);
if (!z.flach) {
proj(xs, -ys, 0); const rechts = P[0] >= c0[0];
for (const [v] of zTicks()) { const h = V.zh(v); if (h === null) continue; proj(xs, -ys, h); etikett(A.fz(sp, v), P[0] + (rechts ? 7 : -7) * d, P[1] + 3 * d, rechts ? 'left' : 'right', '#c9c7c0'); }
}
const kx = Math.max(1, Math.ceil(V.nx / (G.art === 'uhr' ? 12 : 8))), ky = Math.max(1, Math.ceil(V.ny / 7));
for (let j = 0; j < V.nx; j += kx) { const [x, y, al] = rand(V.X(j), -ys); etikett(A.fx(sp, G.x.werte[j], j, G), x, y, al, LEISE); }
if (A.zeit) { const t = zeitTicks(G); for (let k = t.idx.length - 1; k >= 0; k--) { const i = t.idx[k], [x, y, al] = rand(-xs, V.Y(i)); etikett(zeitText(sp, t.rund ? Math.floor(G.y.werte[i] / t.rund) * t.rund : G.y.werte[i], t.art), x, y, al, LEISE); } }
else for (let i = V.ny - 1; i >= 0; i -= ky) { const [x, y, al] = rand(-xs, V.Y(i)); etikett(A.fy(sp, G.y.werte[i], i, G), x, y, al, LEISE); }
schrift(10.5, 600);
for (const [s, f] of namen) {
let ok = false;
for (const w of [34, 46, 58]) { for (const t of [0, 0.22, -0.22, 0.4, -0.4]) { const [x, y, al] = f(t, w * d); if (etikett(s, x, y, al, TEXT)) { ok = true; break; } } if (ok) break; }
if (!ok) { const [x, y, al] = f(0, 34 * d); etikett(s, x, y, al, TEXT, true); }
}
}
function legende() {
if (G.form === 'grat' || z.W < 430 * z.dpr) return;
const d = z.dpr, x = z.W - 22 * d, y0 = z.H * 0.2, y1 = z.H * 0.72, b = 7 * d, g = ctx.createLinearGradient(0, y1, 0, y0);
for (let k = 0; k <= 10; k++) g.addColorStop(k / 10, rgb(farbe(G.form === 'saeulen' ? 0.15 + 0.85 * k / 10 : 0.12 + 0.88 * Math.pow(V.tr(V.lo + (V.hi - V.lo) * k / 10), 0.75))));
ctx.fillStyle = g; ctx.fillRect(x, y0, b, y1 - y0); ctx.strokeStyle = LINIE2; ctx.lineWidth = d; ctx.strokeRect(x, y0, b, y1 - y0);
schrift(9.5); etikett(A.fz(sp, V.hi), x + b, y0 - 6 * d, 'right', LEISE, true); etikett(A.fz(sp, V.lo), x + b, y1 + 14 * d, 'right', LEISE, true);
}
function drin(px, py, p, n) { let c = false; for (let a = 0, b = n - 1; a < n; b = a++) { const xa = p[a * 2], ya = p[a * 2 + 1], xb = p[b * 2], yb = p[b * 2 + 1]; if ((ya > py) !== (yb > py) && px < (xb - xa) * (py - ya) / (yb - ya) + xa) c = !c; } return c; }
function treffer(px, py) {
const h = z.hit; if (!h || !G) return null;
if (h.art === 'quad') {
for (let m = h.n - 1; m >= 0; m--) { const p = h.pts.subarray(m * 8, m * 8 + 8); if (!drin(px, py, p, 4)) continue;
const q = h.ref[m], i = (q / (V.nx - 1)) | 0, j = q - i * (V.nx - 1); let bk = 0, bd = Infinity; for (let k = 0; k < 4; k++) { const dd = Math.hypot(p[k * 2] - px, p[k * 2 + 1] - py); if (dd < bd) { bd = dd; bk = k; } }
return [i + (bk >= 2 ? 1 : 0), j + (bk === 1 || bk === 2 ? 1 : 0)]; }
return null; }
if (h.art === 'poly') { for (let m = h.liste.length - 1; m >= 0; m--) if (drin(px, py, h.liste[m], 4)) { const q = h.ref[m]; return [(q / V.nx) | 0, q % V.nx]; } return null; }
for (let m = h.grat.length - 1; m >= 0; m--) {
const [pts, l0, r0] = h.grat[m], poly = new Float32Array(pts.length + 4); poly.set(l0, 0); poly.set(pts, 2); poly.set(r0, pts.length + 2);
if (drin(px, py, poly, poly.length / 2)) { let bj = 0, bd = Infinity; for (let j = 0; j < pts.length / 2; j++) { const dd = Math.abs(pts[j * 2] - px); if (dd < bd) { bd = dd; bj = j; } } return [h.ref[m], bj]; }
}
return null;
}
function zeigeTipp(e) {
const r = cv.getBoundingClientRect(), px = (e.clientX - r.left) * z.dpr, py = (e.clientY - r.top) * z.dpr, t = treffer(px, py);
if (!t || !ok(G.z[t[0]][t[1]])) { tipp.style.display = 'none'; return; }
tipp.replaceChildren(...A.tipp(sp, G, t[0], t[1]).map((s, k) => { const d = document.createElement('div'); d.textContent = s; if (k) d.style.color = LEISE; return d; }));
tipp.style.display = 'block'; const lx = e.clientX - r.left, ly = e.clientY - r.top, tw = tipp.offsetWidth, th = tipp.offsetHeight;
tipp.style.left = Math.max(4, Math.min(r.width - tw - 4, lx + 14)) + 'px'; tipp.style.top = Math.max(4, ly - th - 12 < 4 ? ly + 16 : ly - th - 12) + 'px';
}
const zeiger = new Map(); let pinch = 0, gezogen = false;
const an = [];
const hoer = (ziel, ev, f, op) => { ziel.addEventListener(ev, f, op); an.push([ziel, ev, f, op]); };
const halt = () => { if (z.dreht) { z.dreht = false; dk.textContent = tx(sp, 'drehen'); } };
hoer(buehne, 'pointerdown', (e) => { zeiger.set(e.pointerId, [e.clientX, e.clientY]); gezogen = false; try { buehne.setPointerCapture(e.pointerId); } catch (x) {   } buehne.style.cursor = 'grabbing'; if (zeiger.size === 2) { const [a, b] = [...zeiger.values()]; pinch = Math.hypot(a[0] - b[0], a[1] - b[1]); } });
hoer(buehne, 'pointermove', (e) => {
const alt = zeiger.get(e.pointerId);
if (!alt) { if (e.pointerType === 'mouse') zeigeTipp(e); return; }
if (zeiger.size === 2) { zeiger.set(e.pointerId, [e.clientX, e.clientY]); const [a, b] = [...zeiger.values()], dd = Math.hypot(a[0] - b[0], a[1] - b[1]); if (pinch > 0) { z.zoom = Math.max(0.5, Math.min(3, z.zoom * dd / pinch)); malen(); } pinch = dd; return; }
const dx = e.clientX - alt[0], dy = e.clientY - alt[1]; if (Math.abs(dx) + Math.abs(dy) > 2) { gezogen = true; halt(); tipp.style.display = 'none'; }
zeiger.set(e.pointerId, [e.clientX, e.clientY]);
if (gezogen && !z.flach) { z.yaw = (z.yaw - dx * 0.008) % (2 * Math.PI); z.pitch = Math.max(0.08, Math.min(1.45, z.pitch + dy * 0.006)); malen(); }
});
const los = (e) => { zeiger.delete(e.pointerId); if (zeiger.size < 2) pinch = 0; buehne.style.cursor = 'grab'; if (!gezogen && e.pointerType !== 'mouse' && e.type === 'pointerup') zeigeTipp(e); };
hoer(buehne, 'pointerup', los); hoer(buehne, 'pointercancel', los);
hoer(buehne, 'pointerleave', () => { if (!zeiger.size) tipp.style.display = 'none'; });
hoer(buehne, 'wheel', (e) => { e.preventDefault(); halt(); z.zoom = Math.max(0.5, Math.min(3, z.zoom * Math.exp(-e.deltaY * 0.0015))); malen(); }, { passive: false });
hoer(buehne, 'dblclick', () => zurueck());
hoer(buehne, 'keydown', (e) => {
const k = e.key; let t = true;
if (k === 'ArrowLeft') z.yaw += 0.12; else if (k === 'ArrowRight') z.yaw -= 0.12; else if (k === 'ArrowUp') z.pitch = Math.min(1.45, z.pitch + 0.08); else if (k === 'ArrowDown') z.pitch = Math.max(0.08, z.pitch - 0.08);
else if (k === '+' || k === '=') z.zoom = Math.min(3, z.zoom * 1.12); else if (k === '-') z.zoom = Math.max(0.5, z.zoom / 1.12); else if (k === '0') { zurueck(); return; } else t = false;
if (t) { e.preventDefault(); halt(); malen(); }
});
const ro = W.ResizeObserver ? new ResizeObserver(() => malen()) : null; if (ro) ro.observe(buehne);
const io = W.IntersectionObserver ? new IntersectionObserver((l) => { z.sicht = l.some((x) => x.isIntersecting); if (z.sicht) malen(); }) : null; if (io) io.observe(buehne);
hoer(document, 'visibilitychange', () => { if (!document.hidden) malen(); });
function aktualisiere(d) { G = d && d.z && d.form ? d : ANS[art].bau(d || {}, o.rechnen || {}); vorbereiten(); texte(); malen(); return G; }
function entferne() {
z.tot = true; if (z.raf) cancelAnimationFrame(z.raf); z.raf = 0;
for (const [ziel, ev, f, op] of an) ziel.removeEventListener(ev, f, op); an.length = 0;
if (ro) ro.disconnect(); if (io) io.disconnect();
cv.width = 0; cv.height = 0; z.hit = null; G = null; V = null; wurzel.remove();
}
aktualisiere(daten);
return { aktualisiere, entferne, element: wurzel, leinwand: cv, zustand: () => ({ yaw: z.yaw, pitch: z.pitch, zoom: z.zoom, dreht: z.dreht, flach: !!z.flach, ms: z.ms, bilder: z.bilder || 0, mittelMs: z.bilder ? z.summe / z.bilder : null }),
ansicht: (w) => { Object.assign(z, w); if (w && w.dreht === false) dk.textContent = tx(sp, 'drehen'); malen(); }, bildJetzt: (sync) => { const t0 = performance.now(); z.dirty = true; bild(t0); if (sync) ctx.getImageData(0, 0, 1, 1); return sync ? performance.now() - t0 : z.ms; }, gitter: () => G };
}

W.RYVO_W19 = { ansichten, zeichne, rechne, fassung: 'w19-1' };
})(typeof window !== 'undefined' ? window : globalThis);

