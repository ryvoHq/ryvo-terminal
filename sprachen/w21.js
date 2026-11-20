{ const s = document.createElement("style"); s.id = "w21-stil"; s.textContent = ".w21-inhalt { display: flex; flex-direction: column; gap: 8px; min-height: 0; font: 12.5px/1.45 var(--sans); }\n.w21-inhalt h3 { margin: 4px 0 2px; font: 600 12px var(--sans); color: var(--leise); text-transform: none; letter-spacing: .01em; }\n.w21-satz { margin: 0; color: var(--text-2, var(--text)); }\n.w21-fuss { margin: 0; font-size: 11.5px; }\n.w21-wahl { display: flex; flex-wrap: wrap; gap: 4px; }\n.w21 .plus { color: var(--kauf); } .w21 .minus { color: var(--verk); } .w21 .gold { color: var(--akzent); }\n.w21 .r { text-align: right; } .w21 .mono, .w21-band .mono { font-family: var(--mono); font-variant-numeric: tabular-nums; }\n.w21-tab { width: 100%; border-collapse: collapse; font: 12.5px var(--mono); font-variant-numeric: tabular-nums; }\n.w21-tab th { text-align: left; font: 600 11px var(--sans); color: var(--leise); padding: 3px 8px 3px 0; white-space: nowrap; }\n.w21-tab td { padding: 4px 8px 4px 0; border-top: 1px solid var(--linie); white-space: nowrap; }\n.w21-tab td:first-child { font-family: var(--sans); }\n.w21-link, .w21-zeile, .w21-3d, .w21-fa-knopf { font: inherit; color: inherit; }\n.w21-link { all: unset; cursor: pointer; color: var(--text); text-decoration: underline; text-decoration-color: var(--linie-hell, var(--linie)); text-underline-offset: 3px; }\n.w21-link:hover, .w21-link:focus-visible { text-decoration-color: var(--akzent); outline: none; }\n.w21-mehr { color: var(--text-2, var(--text)); font-size: 12px; }\n\n.w21-st-kopf { display: flex; align-items: baseline; gap: 8px; } .w21-st-kopf b { font: 600 15px var(--sans); }\n.w21-st { display: grid; grid-template-columns: max-content minmax(0, 1fr); gap: 5px 12px; margin: 0; }\n.w21-st dt { color: var(--leise); font-size: 12px; } .w21-st dd { margin: 0; }\n.w21-st-risiko { margin: 0; padding: 7px 9px; border-radius: 7px; background: color-mix(in srgb, var(--akzent) 9%, transparent); }\n.w21-st-links { margin: 0; font-size: 12px; } .w21-st-links a { color: var(--text-2, var(--text)); }\n\n.w21-gvl { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; }\n.w21-gvl-liste { list-style: none; margin: 0; padding: 0; counter-reset: gv; }\n.w21-zeile { all: unset; box-sizing: border-box; width: 100%; cursor: pointer; display: grid; grid-template-columns: minmax(0, 1fr) auto 8ch; gap: 8px; padding: 4px 6px; border-top: 1px solid var(--linie); }\n.w21-zeile:hover, .w21-zeile:focus-visible { background: var(--feld-2); outline: none; }\n.w21-zeile .w21-n { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-weight: 550; }\n.w21-zeile .w21-k { color: var(--leise); } .w21-zeile .w21-w { text-align: right; }\n@media (max-width: 999px) { .w21-gvl { grid-template-columns: minmax(0, 1fr); } .w21-zeile { padding-block: 10px; } }   \n\n.w21-fx-neben { display: grid; grid-template-columns: minmax(0, 1fr) minmax(180px, 240px); gap: 16px; align-items: start; }\n.w21-fx { border-collapse: separate; border-spacing: 2px; font: 12px var(--mono); font-variant-numeric: tabular-nums; width: 100%; }\n.w21-fx th { font: 600 11px var(--sans); color: var(--leise); padding: 2px 4px; } .w21-fx tbody th { text-align: left; }\n.w21-fx td { text-align: right; padding: 4px 5px; border-radius: 4px; background: var(--feld-2); }\n.w21-fx td.plus { color: var(--text); background: color-mix(in srgb, var(--kauf) calc(var(--w21-f, .1) * 100%), var(--feld-2)); }\n.w21-fx td.minus { color: var(--text); background: color-mix(in srgb, var(--verk) calc(var(--w21-f, .1) * 100%), var(--feld-2)); }\n.w21-fx td.w21-diag { color: var(--sehr-leise, var(--leise)); background: transparent; text-align: center; }\n.w21-fx-rang { margin: 0; padding: 0 0 0 1.4em; display: grid; gap: 3px; } .w21-fx-rang li { white-space: nowrap; }\n.w21-fx-rs p { margin: 0 0 6px; font-size: 11.5px; }\n@media (max-width: 999px) { .w21-fx-neben { grid-template-columns: minmax(0, 1fr); } .w21-fx-mt { overflow-x: auto; } }\n\n.w21-wb-neben { display: grid; grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr); gap: 14px; align-items: start; }\n.w21-wb-neben > .w21-wb td:last-child, .w21-wb-neben > .w21-wb td:first-child { white-space: normal; }   \n.w21-karte { display: block; width: 100%; height: 220px; border-radius: 8px; background: var(--grund, var(--feld)); }\n.w21-legende { margin: 4px 0 0; font-size: 11.5px; }\n.w21-reg th { padding-top: 8px; color: var(--text-2, var(--text)); }\n.w21-punkt { display: inline-block; width: 8px; height: 8px; border-radius: 50%; border: 1.3px solid var(--sehr-leise, var(--leise)); vertical-align: 1px; }\n.w21-punkt.offen { background: var(--akzent); border-color: var(--akzent); }\n.w21-sp { padding-top: 2px; } .w21-linie { display: block; }\n@media (max-width: 1199px) { .w21-wb-neben { grid-template-columns: minmax(0, 1fr); } }\n\n.w21-kt-kopf { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 14px; } .w21-kt-kopf b { font: 600 14px var(--sans); }\n.w21-rendite { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 1px; margin: 0; background: var(--linie); border: 1px solid var(--linie); border-radius: 7px; overflow: hidden; }\n.w21-rendite div { background: var(--feld); padding: 6px 8px; } .w21-rendite dt { font-size: 11px; color: var(--leise); } .w21-rendite dd { margin: 0; font: 600 14px var(--mono); }\n.w21-scroll { min-height: 0; overflow: auto; max-height: max(160px, calc(100vh - 480px)); }\n.w21-ri-neben { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 14px; align-items: start; }\n.w21-ri .kachel p { margin: 2px 0 0; font-size: 11.5px; } .w21-punkte { display: block; width: 100%; height: 220px; }\n@media (max-width: 999px) { .w21-ri-neben { grid-template-columns: minmax(0, 1fr); } .w21-rendite { grid-template-columns: repeat(3, minmax(0, 1fr)); } }\n\n.w21-3d { all: unset; box-sizing: border-box; cursor: pointer; display: inline-grid; place-items: center; min-width: 30px; height: 22px; margin-left: 8px; padding: 0 7px; border: 1px solid var(--linie-hell, var(--linie)); border-radius: 6px; font: 600 11px var(--sans); letter-spacing: .04em; color: var(--text-2, var(--text)); vertical-align: middle; }\n.w21-3d:hover, .w21-3d:focus-visible { border-color: var(--akzent); color: var(--text); outline: none; }\n.w21-3d[aria-pressed=\"true\"] { border-color: var(--akzent); color: var(--akzent); }\nbody.w17 .feld-kopf > .w21-3d { order: 5; margin: 0; }\n.w21-3d-box { position: relative; width: 100%; min-height: 320px; }\n\n.w21-band { flex: none; display: flex; align-items: center; height: 26px; border-top: 1px solid var(--linie); background: var(--feld); font: 12px var(--sans); color: var(--text-2, var(--text)); overflow: hidden; }\nhtml:not(.w21-band-an) .w21-band, .w21-band[hidden] { display: none; }\n.w21-band-fenster { flex: 1 1 auto; min-width: 0; overflow: hidden; -webkit-mask-image: linear-gradient(90deg, transparent, #000 28px, #000 calc(100% - 28px), transparent); mask-image: linear-gradient(90deg, transparent, #000 28px, #000 calc(100% - 28px), transparent); }\n.w21-band-spur { display: flex; width: max-content; will-change: transform; }\n.w21-band-satz { display: flex; flex: none; gap: 30px; padding-right: 30px; }\n.w21-band-t { all: unset; white-space: nowrap; cursor: default; } button.w21-band-t { cursor: pointer; }\nbutton.w21-band-t:hover b, button.w21-band-t:focus-visible b { text-decoration: underline; text-decoration-color: var(--akzent); }\n.w21-band-t b { font-weight: 600; color: var(--text); } .w21-band-t.plus .mono { color: var(--kauf); } .w21-band-t.minus .mono { color: var(--verk); } .w21-band-t.gold b, .w21-band-t.gold .mono { color: var(--akzent); }\n.w21-band-zu { all: unset; flex: none; cursor: pointer; width: 26px; height: 26px; display: grid; place-items: center; color: var(--sehr-leise, var(--leise)); font-size: 15px; }\n.w21-band-zu:hover, .w21-band-zu:focus-visible { color: var(--text); outline: none; }\n.w21-band.w21-ruhig .w21-band-fenster { overflow-x: auto; scrollbar-width: none; -webkit-mask-image: none; mask-image: none; }\n.w21-band.w21-ruhig .w21-band-satz + .w21-band-satz { display: none; }\n@media (max-width: 999px) { .w21-band { display: none !important; } }\n\n.w21-fa { margin-top: 10px; padding-top: 8px; border-top: 1px solid var(--linie); }\n.w21-fa p { margin: 2px 0 6px; }\n.w21-fa-knopf { all: unset; box-sizing: border-box; cursor: pointer; padding: 6px 12px; border: 1px solid var(--akzent); border-radius: 7px; font: 600 12.5px var(--sans); color: var(--text); }\n.w21-fa-knopf:hover, .w21-fa-knopf:focus-visible { background: color-mix(in srgb, var(--akzent) 14%, transparent); outline: none; }\n.w21-fa-knopf:disabled { opacity: .55; cursor: wait; }\n.w21-fa-aus { margin-top: 8px; }\nbutton.w21-mehr { all: unset; box-sizing: border-box; cursor: pointer; display: inline-block; margin: 6px 0 2px; padding: 5px 10px; min-height: 30px; border: 1px solid var(--linie); border-radius: 7px; font: 600 12px var(--sans); color: var(--text); }   \nbutton.w21-mehr:hover, button.w21-mehr:focus-visible { border-color: var(--akzent); }"; document.head.append(s); }

(function (W) {
'use strict';
let A = null;
const D = document;
const SPR = ['de', 'en', 'es', 'fr', 'tr', 'it'];
const sp = () => (A && SPR.includes(A.sprache()) ? A.sprache() : 'en');
function T(k, ...a) {
const X = W.RYVO_W21_TEXTE || {}, s = sp(), f = (X[s] && X[s][k]) ?? (X.en && X.en[k]) ?? (X.de && X.de[k]) ?? k;
return a.length ? String(f).replace(/\{(\d)\}/g, (_, i) => (a[+i] === undefined ? '' : a[+i])) : f;
}
const el = (tag, kl, txt) => { const e = D.createElement(tag); if (kl) e.className = kl; if (txt != null) e.textContent = txt; return e; };
const roh = (e) => { e.dataset.roh = ''; e.translate = false; return e; };
const LOC = () => ({ de: 'de-DE', en: 'en-GB', es: 'es-ES', fr: 'fr-FR', tr: 'tr-TR', it: 'it-IT' })[sp()];
const zahl = (x, nk = 2) => (Number.isFinite(x) ? x.toLocaleString(LOC(), { minimumFractionDigits: nk, maximumFractionDigits: nk }) : '–');
const nkFuer = (p) => (!(p > 0) ? 2 : p >= 1000 ? 1 : p >= 100 ? 2 : p >= 1 ? 3 : p >= 0.01 ? 4 : 6);
const kurs = (p) => zahl(p, nkFuer(p));
const proz = (x, nk = 2) => (Number.isFinite(x) ? (x > 0 ? '+' : x < 0 ? '−' : '') + zahl(Math.abs(x), nk) + (sp() === 'en' ? '%' : ' %') : '–');
const pz = (x, nk = 2) => (Number.isFinite(x) ? zahl(x, nk) + (sp() === 'en' ? '%' : ' %') : '–');
function usdK(x) {
if (!Number.isFinite(x)) return '–';
const a = Math.abs(x), [d, e] = a >= 1e9 ? [1e9, T('mrd')] : a >= 1e6 ? [1e6, T('mio')] : a >= 1e3 ? [1e3, T('tsd')] : [1, ''];
return (sp() === 'en' ? '$' : '') + zahl(x / d, d === 1 ? 0 : a / d >= 100 ? 0 : 1) + (e ? (sp() === 'en' ? '' : ' ') + e : '') + (sp() === 'en' ? '' : ' $');
}
const datum = (ms) => new Date(ms).toLocaleDateString(LOC(), { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' });
function dauer(ms) {
const m = Math.max(0, Math.round(ms / 6e4)), t = Math.floor(m / 1440), h = Math.floor((m % 1440) / 60), mm = m % 60;
return t ? T('dauerT', t, h) : h ? T('dauerH', h, mm) : T('dauerM', mm);
}
function zustand(box, art, satz, neu) {
const z = el('div', 'w17-z'); z.dataset.z = art; z.setAttribute('role', 'status'); roh(z); z.append(el('i'), el('p', '', satz));
if (neu) { const b = el('button', '', T('erneut')); b.type = 'button'; b.addEventListener('click', (e) => { e.stopPropagation(); neu(); }); z.append(b); }
box.replaceChildren(z);
if (art === 'laedt') setTimeout(() => { if (z.isConnected && z.dataset.z === 'laedt') { z.dataset.z = 'leer'; z.querySelector('p').textContent = T('langsam'); } }, 8000);
}
function stand(id, art, text) { const s = D.getElementById(id + '-stand'); if (!s) return; s.dataset.z = art; s.textContent = text; }
const sichtbar = (id) => { const s = D.querySelector('main.raster > section.feld.' + id); return !!s && !s.hidden && s.offsetParent !== null && !D.hidden; };

const CACHE = new Map();
async function holen(url, art = 'text', opt = {}, frist = 20000) {
const r = await fetch(url, { ...opt, signal: AbortSignal.timeout ? AbortSignal.timeout(frist) : undefined });
if (!r.ok) throw new Error('HTTP ' + r.status);
return art === 'json' ? r.json() : r.text();
}
async function gemerkt(schl, ms, fn, dauerhaft) {
const j = Date.now(), c = CACHE.get(schl); if (c && j - c.t < ms) return c.p;
if (dauerhaft) { const g = A.gemerkt('w21.' + schl, ms); if (g) { CACHE.set(schl, { t: j, p: Promise.resolve(g) }); return g; } }
const p = fn().then((d) => { if (dauerhaft && d) A.merkeJson('w21.' + schl, d); return d; });
CACHE.set(schl, { t: j, p }); p.catch(() => CACHE.delete(schl));
return p;
}
const csvZeilen = (txt) => { const z = String(txt || '').replace(/^﻿/, '').trim().split(/\r?\n/), kopf = (z.shift() || '').split(','); return z.map((l) => { const s = l.split(','), o = {}; kopf.forEach((k, i) => { o[k.replace(/"/g, '').trim()] = (s[i] || '').replace(/"/g, '').trim(); }); return o; }); };
const vor = (tage) => new Date(Date.now() - tage * 864e5).toISOString().slice(0, 10);

function zufall(saat) { let a = saat >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function tsyCsv(txt) {
const aus = {};
for (const z of csvZeilen(txt)) {
const d = /^(\d\d)\/(\d\d)\/(\d{4})$/.exec(z.Date || ''); if (!d) continue; const p = [];
for (const [k, v] of Object.entries(z)) { const m = /^(\d+(?:\.\d+)?)\s*(Mo|Yr)/i.exec(k); if (!m || v === '') continue; const n = Number(m[1]), x = Number(v); if (!Number.isFinite(x) || n === 1.5 || n === 2 && /Mo/i.test(m[2]) || n === 4 && /Mo/i.test(m[2])) continue; p.push([/^y/i.test(m[2]) ? n + 'J' : n + 'M', x]); }
if (p.length > 5) aus[`${d[3]}-${d[1]}-${d[2]}`] = p;
}
return aus;
}
function ezbReihen(txt, schl) {
const r = {};
for (const z of csvZeilen(txt)) { const k = z[schl], v = Number(z.OBS_VALUE); if (!k || !z.TIME_PERIOD || !Number.isFinite(v)) continue; (r[k] || (r[k] = [])).push([z.TIME_PERIOD, v]); }
for (const k of Object.keys(r)) r[k].sort((a, b) => (a[0] < b[0] ? -1 : 1));
return r;
}
const FX_W = ['EUR', 'USD', 'JPY', 'GBP', 'CHF', 'CNY', 'AUD', 'CAD'];
function fxRechnen(reihen, tage) {
const daten = [...new Set(Object.values(reihen).flatMap((r) => r.map((x) => x[0])))].sort();
const am = (w, d) => { if (w === 'EUR') return 1; const r = reihen[w]; if (!r) return null; let v = null; for (const x of r) { if (x[0] > d) break; v = x[1]; } return v; };
const letzt = daten[daten.length - 1]; if (!letzt) return null;
const ziel = new Date(Date.parse(letzt) - tage * 864e5).toISOString().slice(0, 10), vorher = [...daten].reverse().find((d) => d <= ziel) || daten[0];
const W2 = FX_W.filter((w) => am(w, letzt) != null), m = {}, ae = {};
for (const a of W2) { m[a] = {}; ae[a] = {}; for (const b of W2) { const j = am(b, letzt) / am(a, letzt), f = am(b, vorher) / am(a, vorher); m[a][b] = a === b ? 1 : j; ae[a][b] = a === b ? 0 : (j / f - 1) * 100; } }
const rang = W2.map((a) => [a, W2.filter((b) => b !== a).reduce((s, b) => s + ae[a][b], 0) / (W2.length - 1)]).sort((x, y) => y[1] - x[1]);
return { w: W2, m, ae, rang, letzt, vorher };
}
function renditen(k) {
if (!k || k.length < 2) return {};
const c = k[k.length - 1][4], t = k[k.length - 1][0], bei = (s) => { let x = null; for (const z of k) { if (z[0] > s) break; x = z[4]; } return x; };
const r = (s) => { const v = bei(s); return v > 0 && s >= k[0][0] ? (c / v - 1) * 100 : null; };
const j0 = Date.UTC(new Date(t * 1000).getUTCFullYear(), 0, 1) / 1000 - 1;
return { w1: r(t - 7 * 86400), m1: r(t - 30 * 86400), m3: r(t - 91 * 86400), j1: r(t - 365 * 86400), ytd: r(j0) };
}
function buendeln(k, art) {
if (art === 'tag') return k.slice();
const g = new Map();
for (const x of k) { const d = new Date(x[0] * 1000), s = art === 'woche' ? Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - ((d.getUTCDay() + 6) % 7)) / 1000 : Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1) / 1000;
const a = g.get(s); if (!a) g.set(s, [s, x[1], x[2], x[3], x[4], x[5]]); else { a[2] = Math.max(a[2], x[2]); a[3] = Math.min(a[3], x[3]); a[4] = x[4]; a[5] += x[5]; } }
return [...g.values()].sort((a, b) => a[0] - b[0]);
}
function risiko(ka, kb, tage, n = 400, saat = 7) {
const mb = new Map(kb.map((x) => [x[0], x[4]])), pa = [];
for (let i = 1; i < ka.length; i++) { const t = ka[i][0], t0 = ka[i - 1][0]; if (mb.has(t) && mb.has(t0) && ka[i - 1][4] > 0 && mb.get(t0) > 0) pa.push([Math.log(mb.get(t) / mb.get(t0)), Math.log(ka[i][4] / ka[i - 1][4]), t]); }
const p = pa.slice(-tage); if (p.length < 20) return null;
const x = p.map((q) => q[0]), y = p.map((q) => q[1]), N = p.length, mx = x.reduce((a, b) => a + b, 0) / N, my = y.reduce((a, b) => a + b, 0) / N;
let sxy = 0, sxx = 0, syy = 0; for (let i = 0; i < N; i++) { sxy += (x[i] - mx) * (y[i] - my); sxx += (x[i] - mx) ** 2; syy += (y[i] - my) ** 2; }
const korr = sxx > 0 && syy > 0 ? sxy / Math.sqrt(sxx * syy) : 0, beta = sxx > 0 ? sxy / sxx : 0;
const rnd = zufall(saat), yy = y.slice(), werte = [];
for (let k = 0; k < n; k++) { for (let i = N - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [yy[i], yy[j]] = [yy[j], yy[i]]; } let s = 0; for (let i = 0; i < N; i++) s += (x[i] - mx) * (yy[i] - my); werte.push(Math.abs(s / Math.sqrt(sxx * syy))); }
werte.sort((a, b) => a - b); const band = werte[Math.min(werte.length - 1, Math.floor(0.95 * werte.length))];
const sd = Math.sqrt(syy / Math.max(1, N - 1)), vola = sd * Math.sqrt(365) * 100;
const kurse = ka.slice(-(N + 1)).map((q) => q[4]); let hoch = kurse[0], dd = 0; for (const c of kurse) { hoch = Math.max(hoch, c); dd = Math.min(dd, (c / hoch - 1) * 100); }
return { beta, korr, band, vola, dd, n: N, punkte: p, mehr: Math.abs(korr) > band };
}
const BOERSEN = [
['nyse', 'New York', 'America/New_York', [[570, 960]], -74.0, 40.7, 'am', ['SP500', 'XYZ100', 'USA500', 'USA100', 'US500', 'USTECH', 'SMALL2000']],
['b3', 'São Paulo', 'America/Sao_Paulo', [[600, 1020]], -46.6, -23.5, 'am', ['IBOV']],
['tsx', 'Toronto', 'America/Toronto', [[570, 960]], -79.4, 43.7, 'am', []],
['lse', 'London', 'Europe/London', [[480, 990]], -0.1, 51.5, 'eu', ['UK100', 'FTSE']],
['xetra', 'Frankfurt', 'Europe/Berlin', [[540, 1050]], 8.7, 50.1, 'eu', ['DE40', 'GER40', 'DAX']],
['euronext', 'Paris', 'Europe/Paris', [[540, 1050]], 2.35, 48.9, 'eu', ['FR40', 'CAC40', 'EU50', 'STOXX50']],
['six', 'Zürich', 'Europe/Zurich', [[540, 1050]], 8.5, 47.4, 'eu', []],
['jse', 'Johannesburg', 'Africa/Johannesburg', [[540, 1020]], 28.0, -26.2, 'eu', []],
['nse', 'Mumbai', 'Asia/Kolkata', [[555, 930]], 72.9, 19.1, 'as', ['NIFTY']],
['sse', 'Shanghai', 'Asia/Shanghai', [[570, 690], [780, 900]], 121.5, 31.2, 'as', ['CN50', 'CHINA50']],
['hkex', 'Hongkong', 'Asia/Hong_Kong', [[570, 720], [780, 960]], 114.2, 22.3, 'as', ['HK50', 'HSI']],
['twse', 'Taipeh', 'Asia/Taipei', [[540, 810]], 121.6, 25.0, 'as', []],
['krx', 'Seoul', 'Asia/Seoul', [[540, 930]], 127.0, 37.6, 'as', ['KR200']],
['jpx', 'Tokio', 'Asia/Tokyo', [[540, 690], [750, 930]], 139.7, 35.7, 'as', ['JP225', 'JPN225']],
['asx', 'Sydney', 'Australia/Sydney', [[600, 960]], 151.2, -33.9, 'as', ['AUS200']],
];
function ortszeit(tz, ms) {
const f = new Intl.DateTimeFormat('en-US', { timeZone: tz, weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date(ms));
const g = (t) => (f.find((x) => x.type === t) || {}).value;
return { tag: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(g('weekday')), min: Number(g('hour')) * 60 + Number(g('minute')) };
}
function boerseStatus(b, ms = Date.now()) {
const z = ortszeit(b[2], ms), werktag = (t) => t >= 1 && t <= 5, offen = werktag(z.tag) && b[3].some(([a, e]) => z.min >= a && z.min < e);
for (let m = 1; m <= 8 * 1440; m += 1) {
const q = ortszeit(b[2], ms + m * 6e4), o = werktag(q.tag) && b[3].some(([a, e]) => q.min >= a && q.min < e);
if (o !== offen) return { offen, wechsel: m * 6e4 };
if (m > 60) m += 14;
}
return { offen, wechsel: null };
}
function fruehphase(txs, mint, angebot) {
const l = txs.filter((t) => t && t.meta && !t.meta.err && t.blockTime).sort((a, b) => a.slot - b.slot || 0);
if (!l.length || !(angebot > 0)) return null;
const t0 = l[0].blockTime, slot0 = l[0].slot, zahler = (t) => { const k = (t.transaction && t.transaction.message && t.transaction.message.accountKeys) || []; const s = k.find((x) => x && (x.signer || x.signer === undefined)); return s ? (s.pubkey || s) : ''; };
const ersteller = zahler(l[0]), menge = (b) => Number((b.uiTokenAmount || {}).uiAmount) || 0, kaeufe = [];
for (const t of l) {
const vor = new Map(), nach = new Map();
for (const b of t.meta.preTokenBalances || []) if (b.mint === mint) vor.set(b.owner, (vor.get(b.owner) || 0) + menge(b));
for (const b of t.meta.postTokenBalances || []) if (b.mint === mint) nach.set(b.owner, (nach.get(b.owner) || 0) + menge(b));
const z = zahler(t);
for (const [o, v] of nach) { const d = v - (vor.get(o) || 0); if (d > 0 && o === z) kaeufe.push({ w: o, menge: d, t: t.blockTime, slot: t.slot }); }
}
const pct = (x) => x / angebot * 100, frueh = kaeufe.filter((k) => k.t - t0 <= 30 && k.w !== ersteller), fw = new Set(frueh.map((k) => k.w));
const slots = new Map(); for (const k of kaeufe) { const s = slots.get(k.slot) || { w: new Set(), m: 0 }; s.w.add(k.w); s.m += k.menge; slots.set(k.slot, s); }
let buendel = null; for (const [s, v] of slots) if (v.w.size >= 3 && (!buendel || v.m > buendel.m)) buendel = { slot: s, n: v.w.size, m: v.m, start: s === slot0 };
const dev = kaeufe.filter((k) => k.w === ersteller && k.slot === slot0).reduce((a, k) => a + k.menge, 0);
const proW = new Map(); for (const k of frueh) proW.set(k.w, (proW.get(k.w) || 0) + k.menge);
return { t0, ersteller, n: l.length, sniperPct: pct(frueh.reduce((a, k) => a + k.menge, 0)), sniperN: fw.size, buendel: buendel && { ...buendel, pct: pct(buendel.m) }, devPct: pct(dev),
grosse: [...proW.entries()].sort((a, b) => b[1] - a[1]).map((x) => x[0]) };
}
const xHandle = (u) => { const m = /(?:twitter\.com|x\.com)\/(?:#!\/)?@?([A-Za-z0-9_]{1,15})(?:[/?#]|$)/i.exec(String(u || '')); return m && !/^(i|home|search|intent|share)$/i.test(m[1]) ? m[1].toLowerCase() : null; };
const rechne = { tsyCsv, ezbReihen, fxRechnen, renditen, buendeln, risiko, boerseStatus, ortszeit, fruehphase, xHandle, zufall, BOERSEN, FX_W };

const KACHELN = ['steck', 'gvl', 'wb', 'roh', 'fx', 'wanl', 'ktab', 'risiko'];
function kachelnEinsetzen() {
const raster = D.querySelector('main.raster'); if (!raster) return false;
let neu = false;
for (const id of KACHELN) {
if (raster.querySelector(':scope > section.feld.' + id)) continue;
const s = el('section', 'feld ' + id + ' w21'); s.setAttribute('aria-labelledby', 't-' + id); s.classList.add('ab-zu');
const kopf = el('div', 'feld-kopf'), h = el('h2', '', T(id + '.titel')); h.id = 't-' + id; roh(h);
const st = el('span', 'stand qs'); st.id = id + '-stand'; roh(st);
const was = el('button', 'was', T('wasIst')); was.type = 'button'; was.dataset.hilfe = id; was.setAttribute('aria-expanded', 'false');
was.addEventListener('click', () => { const x = D.getElementById('h-' + id); if (!x) return; x.hidden = !x.hidden; was.setAttribute('aria-expanded', String(!x.hidden)); });
kopf.append(h, st, was);
const hilfe = roh(el('div', 'hilfe')); hilfe.id = 'h-' + id; hilfe.hidden = true; hilfe.dataset.hilfeDa = '';
for (const t of String(T(id + '.hilfe')).split('\n')) hilfe.append(roh(el('p', '', t)));
const inhalt = roh(el('div', 'w21-inhalt')); inhalt.id = id + '-inhalt';
s.append(kopf, hilfe, inhalt); raster.append(s); neu = true;
}
return neu;
}

function maerkte() {
const l = [];
const u = A.hlUni(); if (u && u.m) for (const [c, x] of u.m) if (x.p > 0) l.push({ id: c, name: c, lang: '', art: 'Krypto', p: x.p / (x.mult || 1), ae: x.vt > 0 ? (x.p / x.vt - 1) * 100 : null, vlm: x.vlm, oi: x.oi * x.p, hl: x.hl, mult: x.mult });
for (const [id, e] of A.tf()) if (e.preis > 0) l.push({ id, name: e.name, lang: e.lang || '', art: e.art, p: e.preis, ae: e.ae24h, vlm: e.umsatz, oi: e.oi, hl: e.hl, dex: e.dex });
return l;
}

const nameVon = (m) => (m.art !== 'Krypto' && m.lang ? A.tr(m.lang) : A.anzeige(m.id));

const ST = new Map();
function steckMeta(dex) {
const s = dex || '', c = ST.get(s); if (c && (c.m || Date.now() - c.t < 6e4) && Date.now() - c.t < 30 * 6e4) return c.m;
const e = { t: Date.now(), m: null }; ST.set(s, e);
A.hl(dex ? { type: 'meta', dex } : { type: 'meta' }).then((m) => { e.m = new Map(((m && m.universe) || []).map((u) => [String(u.name), u])); LETZT.delete('steck'); }).catch(() => {});
return null;
}
function steckZeigen() {
const box = D.getElementById('steck-inhalt'); if (!box || !sichtbar('steck')) return;
const c = A.coin(), m = maerkte().find((x) => x.id === c);
if (!m) { zustand(box, A.hlUni() ? 'leer' : 'laedt', A.hlUni() ? T('steck.fremd', A.anzeige(c)) : T('laedt')); stand('steck', A.hlUni() ? 'nv' : 'laedt', ''); return !!A.hlUni(); }
const mm = steckMeta(m.dex), u = mm ? mm.get(m.hl) : null;
const kopf = el('div', 'w21-st-kopf'); kopf.append(el('b', '', A.anzeige(c)), el('span', 'leise', T('art.' + (m.art === 'Krypto' ? 'krypto' : m.art === 'Index' ? 'index' : m.art === 'Rohstoff' ? 'roh' : m.art === 'Devisen' ? 'fx' : m.art === 'Aktie' ? 'aktie' : 'sonst'))));
const basis = T('st.c.' + c) !== 'st.c.' + c ? T('st.c.' + c) : m.art === 'Krypto' ? T('st.krypto', c) : m.art === 'Index' ? T('st.index', m.lang || m.name) : m.art === 'Rohstoff' ? T('st.roh', m.lang || m.name)
: m.art === 'Devisen' ? T('st.fx', m.lang || m.name) : m.art === 'Aktie' ? T('st.aktie', m.lang || m.name) : T('st.sonst', m.lang || m.name);
const dl = el('dl', 'w21-st'), z = (k, v) => { dl.append(el('dt', '', T(k)), el('dd', '', v)); };
const mult = m.mult > 1 ? ' (' + T('st.mult', m.mult) + ')' : '';
z('st.basis', basis);
z('st.platz', m.dex ? T('st.platzTF', m.dex) : 'Hyperliquid');
z('st.art', T('st.perp'));
if (u && u.maxLeverage) z('st.hebel', T('st.hebelW', u.maxLeverage) + (u.onlyIsolated ? ' · ' + T('st.isoliert') : ''));
z('st.funding', T('st.fundingW'));
z('st.zeiten', m.art === 'Krypto' ? T('st.zeitenK') : T('st.zeitenTF'));
if (u && Number.isFinite(+u.szDecimals)) z('st.menge', T('st.mengeW', zahl(10 ** -u.szDecimals, Math.max(0, +u.szDecimals)) + mult));
z('st.umsatz', usdK(m.vlm) + ' · ' + (m.dex ? T('st.platzTF', m.dex) : 'Hyperliquid')); z('st.oi', usdK(m.oi) + ' · ' + (m.dex ? T('st.platzTF', m.dex) : 'Hyperliquid'));
const risk = el('p', 'w21-st-risiko'); risk.append(el('b', '', T('st.risiko') + ': '), D.createTextNode(T('st.risikoW')));
const ver = el('p', 'w21-st-links'); ver.append(el('span', 'leise', T('st.verwandt') + ' '));
for (const [ziel, k] of [['derivate/futures', 'st.l.funding'], ['derivate/futures', 'st.l.liq'], ['scalper/flow', 'st.l.buch'], ['swing/kurse', 'st.l.kurse']]) { const a = el('a', '', T(k)); a.href = '#tab=' + ziel.replace('/', '&unter='); a.addEventListener('click', (e) => { e.preventDefault(); A.gehe(ziel); }); ver.append(a, D.createTextNode(' · ')); }
ver.lastChild.remove();
box.replaceChildren(kopf, dl, risk, ver);
stand('steck', 'aktuell', 'Hyperliquid');
return true;
}

const GV = { klasse: 'krypto', sig: '' };
const GV_MIN = 1e6;
function gvlZeigen() {
const box = D.getElementById('gvl-inhalt'); if (!box || !sichtbar('gvl')) return;
const alle = maerkte().filter((m) => Number.isFinite(m.ae) && m.vlm > 0);
if (!alle.length) { zustand(box, 'laedt', T('gvl.leer')); stand('gvl', 'laedt', ''); return false; }
const kl = GV.klasse, l = alle.filter((m) => (kl === 'krypto' ? m.art === 'Krypto' : kl === 'aktien' ? m.art === 'Aktie' || m.art === 'Index' : m.art === 'Rohstoff' || m.art === 'Devisen')), gross = l.filter((m) => m.vlm >= GV_MIN);
const sig = JSON.stringify([kl, sp(), gross.map((m) => [m.id, Math.round(m.ae * 100), Math.round(m.vlm / 1e5)])]); if (sig === GV.sig && box.querySelector('.w21-gvl')) return true; GV.sig = sig;
const wahl = el('div', 'ch-schalter w21-wahl'); wahl.setAttribute('role', 'group');
for (const k of ['krypto', 'aktien', 'roh']) { const b = el('button', '', T('gvl.' + k)); b.type = 'button'; b.setAttribute('aria-pressed', String(k === kl)); b.addEventListener('click', () => { GV.klasse = k; GV.sig = ''; gvlZeigen(); }); wahl.append(b); }
const gest = gross.filter((m) => m.ae > 0).length;
const breite = el('p', 'leise w21-satz', gross.length ? T('gvl.breite', gest, gross.length, pz(gross.length ? gest / gross.length * 100 : 0, 0)) : T('gvl.wenig'));
const spalte = (titel, liste, wert) => {
const d = el('div', 'w21-gvl-sp'), h = el('h3', '', titel), ol = el('ol', 'w21-gvl-liste');
for (const m of liste.slice(0, 10)) {
const li = el('li'), b = el('button', 'w21-zeile'); b.type = 'button'; b.title = T('gvl.oeffnen', nameVon(m));
b.append(el('span', 'w21-n', nameVon(m)), el('span', 'w21-k mono', kurs(m.p)), wert(m)); b.addEventListener('click', () => A.oeffne(m.id)); li.append(b); ol.append(li);
}
if (!liste.length) ol.append(el('li', 'leise', T('gvl.keine')));
d.append(h, ol); return d;
};
const ae = (m) => el('span', 'w21-w mono ' + (m.ae > 0 ? 'plus' : m.ae < 0 ? 'minus' : ''), proz(m.ae));
const g = [...gross].sort((a, b) => b.ae - a.ae), v = [...gross].sort((a, b) => a.ae - b.ae).filter((m) => m.ae < 0), mh = [...l].sort((a, b) => b.vlm - a.vlm);
const raster = el('div', 'w21-gvl');
raster.append(spalte(T('gvl.gewinner'), g.filter((m) => m.ae > 0), ae), spalte(T('gvl.verlierer'), v, ae), spalte(T('gvl.meist'), mh, (m) => el('span', 'w21-w mono', usdK(m.vlm))));
box.replaceChildren(wahl, breite, raster, el('p', 'leise w21-fuss', T('gvl.fuss', usdK(GV_MIN))));
stand('gvl', 'aktuell', T('gvl.stand'));
return A.tf().size > 0;
}

const LB = { an: true, el: null, spur: null, anim: null, breite: 0, sig: '', t: 0 };
const ruhig = () => D.documentElement.classList.contains('bewegung-aus') || (W.matchMedia && W.matchMedia('(prefers-reduced-motion: reduce)').matches);
function bandTeile() {
const t = [], l = maerkte(), nach = new Map(l.map((m) => [m.id, m]));
for (const id of (A.liste() || []).slice(0, 10)) { const m = nach.get(id); if (m) t.push({ id, text: A.anzeige(id), wert: kurs(m.p) + ' ' + proz(m.ae), kl: m.ae > 0 ? 'plus' : m.ae < 0 ? 'minus' : '' }); }
const kr = l.filter((m) => m.art === 'Krypto' && m.vlm >= 5e6 && Number.isFinite(m.ae)).sort((a, b) => Math.abs(b.ae) - Math.abs(a.ae))[0];
if (kr) t.push({ id: kr.id, text: T('band.groesste'), wert: A.anzeige(kr.id) + ' ' + proz(kr.ae), kl: 'gold' });
const tm = (A.termine() || []).filter((x) => x && x.zeit * 1000 > Date.now()).sort((a, b) => a.zeit - b.zeit)[0];
if (tm) t.push({ text: T('band.termin'), wert: (A.terminText ? A.terminText(tm) : A.tr(tm.text || tm.art || '')) + ' · ' + T('band.in', dauer(tm.zeit * 1000 - Date.now())), kl: '' });
const w = l.filter((m) => m.art === 'Index' && m.vlm > 1e6 && Number.isFinite(m.ae)).sort((a, b) => b.vlm - a.vlm)[0];
if (w) t.push({ id: w.id, text: nameVon(w), wert: proz(w.ae), kl: w.ae > 0 ? 'plus' : w.ae < 0 ? 'minus' : '' });
return t;
}
function bandBauen() {
if (LB.el) return;
const fuss = D.querySelector('footer.fuss'); if (!fuss) return;
const b = roh(el('div', 'w21-band')); b.id = 'w21-band'; b.setAttribute('role', 'region'); b.setAttribute('aria-label', T('band.name'));
const fenster = el('div', 'w21-band-fenster'), spur = el('div', 'w21-band-spur'); spur.setAttribute('aria-hidden', 'false');
fenster.append(spur);
const zu = el('button', 'w21-band-zu', '×'); zu.type = 'button'; zu.title = T('band.aus'); zu.setAttribute('aria-label', T('band.aus'));
zu.addEventListener('click', () => bandSchalten(false));
b.append(fenster, zu); fuss.before(b);
b.addEventListener('mouseenter', () => { if (LB.anim) LB.anim.pause(); });
b.addEventListener('mouseleave', () => { if (LB.anim && !ruhig()) LB.anim.play(); });
b.addEventListener('focusin', () => { if (LB.anim) LB.anim.pause(); });
b.addEventListener('focusout', () => { if (LB.anim && !ruhig()) LB.anim.play(); });
spur.addEventListener('click', (e) => { const x = e.target.closest('[data-id]'); if (x) A.oeffne(x.dataset.id); });
LB.el = b; LB.spur = spur;
}
function bandSatz(teile, kopie) {
const s = el('div', 'w21-band-satz'); if (kopie) s.setAttribute('aria-hidden', 'true');
for (const x of teile) { const e = el(x.id ? 'button' : 'span', 'w21-band-t ' + (x.kl || '')); if (x.id) { e.type = 'button'; e.dataset.id = x.id; if (kopie) e.tabIndex = -1; } e.append(el('b', '', x.text), D.createTextNode(' '), el('span', 'mono', x.wert)); s.append(e); }
return s;
}
function bandAuffrischen() {
if (!LB.an) return;
bandBauen(); if (!LB.el || LB.el.hidden) return;
const teile = bandTeile(), sig = teile.map((x) => (x.id || '') + x.text).join('|');
if (!teile.length) {
if (LB.anim) { LB.anim.cancel(); LB.anim = null; } LB.sig = '';
const t = el('span', 'leise w21-band-t', T('laedt')); t.dataset.z = 'laedt'; t.setAttribute('role', 'status'); LB.spur.replaceChildren(t); return;
}
if (sig !== LB.sig) {
LB.sig = sig; const p = LB.anim && LB.anim.effect ? (LB.anim.currentTime || 0) / (LB.anim.effect.getTiming().duration || 1) % 1 : 0;
LB.spur.replaceChildren(bandSatz(teile, false), bandSatz(teile, true));
bandLauf(p);
return;
}
for (const satz of LB.spur.children) [...satz.children].forEach((e, i) => { const x = teile[i]; if (!x) return; const w = e.querySelector('.mono'); if (w && w.textContent !== x.wert) w.textContent = x.wert; e.className = 'w21-band-t ' + (x.kl || ''); });
const br = LB.spur.firstElementChild ? LB.spur.firstElementChild.getBoundingClientRect().width : 0;
if (LB.anim && br && Math.abs(br - LB.breite) > 2) {
const d0 = LB.anim.effect.getTiming().duration, p = ((LB.anim.currentTime || 0) % d0) / d0, d1 = Math.max(8000, br / 38 * 1000);
LB.breite = br; LB.anim.effect.updateTiming({ duration: d1 }); LB.anim.currentTime = p * d1;
}
}
function bandLauf(p = 0) {
if (LB.anim) { LB.anim.cancel(); LB.anim = null; }
const s = LB.spur.firstElementChild; if (!s) return;
LB.breite = s.getBoundingClientRect().width;
if (ruhig() || !LB.spur.animate || !LB.breite) { LB.el.classList.add('w21-ruhig'); return; }
LB.el.classList.remove('w21-ruhig');
const d = Math.max(8000, LB.breite / 38 * 1000);
LB.anim = LB.spur.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-50%)' }], { duration: d, iterations: Infinity, easing: 'linear' });
LB.anim.currentTime = p * d;
if (LB.el.matches(':hover')) LB.anim.pause();
}
function bandSchalten(an) {
LB.an = an == null ? !LB.an : !!an; A.merke('w21.band', LB.an ? '' : 'aus');
if (LB.el) LB.el.hidden = !LB.an;
D.documentElement.classList.toggle('w21-band-an', LB.an);
if (LB.an) { LB.sig = ''; bandAuffrischen(); } else if (LB.anim) { LB.anim.cancel(); LB.anim = null; }
A.resize();
return LB.an;
}

const FX = { tage: 1, daten: null, fehler: false };
const fxHolen = () => gemerkt('fx', 3 * 36e5, async () => ezbReihen(await holen('https://data-api.ecb.europa.eu/service/data/EXR/D.USD+JPY+GBP+CHF+CNY+AUD+CAD.EUR.SP00.A?format=csvdata&detail=dataonly&startPeriod=' + vor(400)), 'CURRENCY'), true);
async function fxZeigen(neu) {
const box = D.getElementById('fx-inhalt'); if (!box || !sichtbar('fx')) return;
if (!FX.daten || neu) {
if (!box.querySelector('.w21-fx')) zustand(box, 'laedt', T('laedt')); stand('fx', 'laedt', '');
try { FX.daten = await fxHolen(); FX.fehler = false; } catch (e) { FX.fehler = true; zustand(box, 'fehler', T('fx.fehler'), () => fxZeigen(true)); stand('fx', 'aus', ''); return; }
}
const r = fxRechnen(FX.daten, FX.tage === 1 ? 1 : FX.tage === 7 ? 7 : 365); if (!r) { zustand(box, 'leer', T('fx.fehler')); return; }
const wahl = el('div', 'ch-schalter w21-wahl');
for (const [t, k] of [[1, 'fx.tag'], [7, 'fx.woche'], [365, 'fx.jahr']]) { const b = el('button', '', T(k)); b.type = 'button'; b.setAttribute('aria-pressed', String(FX.tage === t)); b.addEventListener('click', () => { FX.tage = t; fxZeigen(); }); wahl.append(b); }
const schmal = !!(W.matchMedia && W.matchMedia('(max-width: 699px)').matches), w = schmal && !FX.alle ? r.w.slice(0, 4) : r.w;
const tab = el('table', 'w21-fx'), kopf = el('tr'); kopf.append(el('th', 'w21-ecke', T('fx.ecke')));
for (const b of w) { const th = el('th', '', b); th.title = T('fx.n.' + b); kopf.append(th); }
tab.append(el('thead')); tab.tHead.append(kopf); const tb = el('tbody'); tab.append(tb);
const max = Math.max(0.2, ...r.w.flatMap((a) => r.w.map((b) => Math.abs(r.ae[a][b]))));
for (const a of w) {
const tr = el('tr'), th = el('th', '', a); th.title = T('fx.n.' + a); tr.append(th);
for (const b of w) {
const v = r.m[a][b], x = r.ae[a][b], td = el('td', 'mono' + (a === b ? ' w21-diag' : ''), a === b ? '1' : zahl(v, v >= 100 ? 2 : v >= 10 ? 3 : 4));
td.dataset.paar = a + b;
if (a !== b) { const s = Math.min(1, Math.abs(x) / max); td.style.setProperty('--w21-f', String(0.08 + 0.42 * s)); td.classList.add(x > 0 ? 'plus' : x < 0 ? 'minus' : 'null'); td.title = T('fx.zelle', a, zahl(v, 4), b, proz(x)); }
tr.append(td);
}
tb.append(tr);
}
const rang = el('ol', 'w21-fx-rang');
for (const [w, v] of r.rang) { const li = el('li'); li.append(el('b', '', w), el('span', 'leise', ' ' + T('fx.n.' + w)), el('span', 'mono ' + (v > 0 ? 'plus' : v < 0 ? 'minus' : ''), ' ' + proz(v))); rang.append(li); }
const live = el('p', 'leise w21-satz'); const tf = A.tf(), eu = tf.get('EUR-XYZ'), jp = tf.get('JPY-XYZ');
if (eu || jp) live.textContent = T('fx.live') + ' ' + [eu ? 'EUR/USD ' + zahl(eu.preis, 4) : '', jp ? 'USD/JPY ' + zahl(jp.preis, 2) : ''].filter(Boolean).join(' · ');
const neben = el('div', 'w21-fx-neben'), rs = el('div', 'w21-fx-rs'); rs.append(el('h3', '', T('fx.rang')), el('p', 'leise', T('fx.rangS', T(FX.tage === 1 ? 'fx.tag' : FX.tage === 7 ? 'fx.woche' : 'fx.jahr'))), rang);
const mt = el('div', 'w21-fx-mt'); mt.append(tab);
if (schmal) { const m = el('button', 'w21-mehr', T(FX.alle ? 'fx.vier' : 'fx.alle')); m.type = 'button'; m.setAttribute('aria-expanded', String(!!FX.alle)); m.addEventListener('click', () => { FX.alle = !FX.alle; fxZeigen(); }); mt.append(m); }
mt.append(el('p', 'leise', T('fx.lesen')));
neben.append(mt, rs);
box.replaceChildren(wahl, neben, live, el('p', 'leise w21-fuss', T('fx.stand', datum(Date.parse(r.letzt)), datum(Date.parse(r.vorher))) + ' · Source: ECB statistics'));
stand('fx', 'aktuell', datum(Date.parse(r.letzt)));
}

const ROH_G = [['roh.energie', ['CL', 'WTI', 'USOIL', 'BRENTOIL', 'NATGAS', 'GAS', 'TTF', 'URANIUM']], ['roh.metalle', ['GOLD', 'SILVER', 'PLATINUM', 'PALLADIUM', 'COPPER', 'ALUMINIUM']], ['roh.agrar', ['CORN', 'WHEAT', 'SOY']]];
const RV = new Map();
let rohLaeuft = false;
async function rohVerlauf(l) {
if (rohLaeuft) return; rohLaeuft = true;
try { for (const m of l) { const v = RV.get(m.id); if (v && Date.now() - v.t < 30 * 6e4) continue; try { const k = await A.kerzen(m.hl, 'D', 31); RV.set(m.id, { t: Date.now(), c: k.map((x) => x[4]) }); rohZeigen(); } catch (e) { RV.set(m.id, { t: Date.now(), c: [] }); } if (!sichtbar('roh')) break; } }
finally { rohLaeuft = false; }
}
function linie(werte, b = 84, h = 22) {
const c = el('canvas', 'w21-linie'); const d = W.devicePixelRatio || 1; c.width = b * d; c.height = h * d; c.style.width = b + 'px'; c.style.height = h + 'px'; c.setAttribute('aria-hidden', 'true');
const w = werte.filter(Number.isFinite); if (w.length < 2) return c;
const g = c.getContext('2d'), lo = Math.min(...w), hi = Math.max(...w), sp_ = hi - lo || 1; g.scale(d, d);
g.strokeStyle = w[w.length - 1] >= w[0] ? getComputedStyle(D.body).getPropertyValue('--kauf') || '#4caf7a' : getComputedStyle(D.body).getPropertyValue('--verk') || '#e05a4f'; g.lineWidth = 1.4; g.beginPath();
w.forEach((v, i) => { const x = 1 + i / (w.length - 1) * (b - 2), y = h - 2 - (v - lo) / sp_ * (h - 4); if (i) g.lineTo(x, y); else g.moveTo(x, y); }); g.stroke();
return c;
}
function rohZeigen() {
const box = D.getElementById('roh-inhalt'); if (!box || !sichtbar('roh')) return;
const nach = new Map(maerkte().filter((m) => m.art === 'Rohstoff').map((m) => [m.name, m]));
if (!nach.size) { zustand(box, A.tf().size ? 'leer' : 'laedt', A.tf().size ? T('roh.leer') : T('laedt')); stand('roh', A.tf().size ? 'nv' : 'laedt', ''); return !!A.tf().size; }
const teile = [], alle = [];
for (const [g, namen] of ROH_G) {
const l = namen.map((n) => nach.get(n)).filter(Boolean).filter((m, i, a) => a.findIndex((x) => x.lang === m.lang) === i); if (!l.length) continue;
const tab = el('table', 'w21-tab'), tb = el('tbody'); tab.append(tb);
for (const m of l) {
alle.push(m);
const tr = el('tr'), n = el('td'), b = el('button', 'w21-link', nameVon(m)); b.type = 'button'; b.addEventListener('click', () => A.oeffne(m.id)); n.append(b);
const v = RV.get(m.id), sp_ = el('td', 'w21-sp'); if (v && v.c.length > 1) sp_.append(linie(v.c)); else sp_.append(el('span', 'leise', v ? T('roh.nv') : T('laedt')));
const m30 = v && v.c.length > 1 ? (v.c[v.c.length - 1] / v.c[0] - 1) * 100 : null;
tr.append(n, el('td', 'mono r', kurs(m.p)), el('td', 'mono r ' + (m.ae > 0 ? 'plus' : m.ae < 0 ? 'minus' : ''), proz(m.ae)), sp_, el('td', 'mono r leise', m30 == null ? '' : proz(m30, 1)));
tb.append(tr);
}
teile.push(el('h3', '', T(g)), tab);
}
const kopf = el('div', 'w21-tkopf'); kopf.append(el('span', '', ''), el('span', 'r', T('roh.kurs')), el('span', 'r', T('std24')), el('span', 'r', T('roh.verlauf')));
const sprit = el('a', 'w21-mehr', T('roh.sprit')); sprit.href = '#tab=makro&unter=inflation'; sprit.addEventListener('click', (e) => { e.preventDefault(); A.gehe('makro/inflation'); });
box.replaceChildren(...teile, el('p', 'leise w21-fuss', T('roh.hinweis')), sprit);
stand('roh', 'aktuell', 'Hyperliquid');
rohVerlauf(alle);
return true;
}

const LAND = [
[[-168, 66], [-140, 70], [-95, 72], [-75, 62], [-60, 55], [-53, 47], [-66, 44], [-76, 35], [-81, 25], [-97, 26], [-105, 20], [-92, 15], [-83, 9], [-80, 8], [-87, 13], [-105, 22], [-117, 32], [-124, 41], [-124, 49], [-135, 58], [-150, 60], [-165, 60]],
[[-80, 8], [-75, 11], [-62, 11], [-50, 0], [-35, -6], [-39, -15], [-48, -26], [-58, -34], [-65, -42], [-68, -54], [-74, -50], [-73, -37], [-71, -18], [-77, -12], [-81, -5], [-78, 2]],
[[-10, 36], [-9, 43], [-2, 44], [-5, 48], [2, 51], [8, 54], [10, 57], [5, 62], [14, 68], [25, 71], [40, 68], [40, 60], [30, 55], [30, 46], [28, 41], [23, 37], [18, 40], [15, 38], [12, 44], [8, 44], [3, 43], [-2, 37]],
[[-17, 21], [-16, 12], [-8, 5], [5, 5], [9, 3], [12, -5], [13, -12], [12, -18], [17, -29], [20, -35], [28, -33], [33, -26], [40, -15], [40, -3], [51, 12], [43, 12], [38, 18], [33, 30], [20, 32], [10, 37], [-6, 36], [-10, 30]],
[[40, 68], [60, 70], [80, 73], [105, 77], [140, 73], [180, 69], [170, 60], [160, 58], [140, 52], [142, 46], [135, 43], [127, 36], [122, 40], [121, 31], [114, 22], [108, 21], [106, 10], [100, 13], [98, 8], [94, 16], [91, 22], [80, 15], [77, 8], [72, 20], [66, 25], [57, 26], [52, 30], [48, 30], [56, 25], [52, 17], [44, 13], [35, 28], [33, 36], [27, 40], [41, 41], [50, 45], [53, 40], [58, 45], [60, 55], [48, 60]],
[[114, -22], [122, -18], [130, -12], [137, -12], [142, -11], [146, -19], [153, -26], [151, -34], [146, -39], [138, -35], [131, -31], [118, -35], [115, -34]],
[[130, 31], [135, 34], [140, 36], [142, 40], [141, 45], [143, 44], [138, 38], [133, 33]],
[[-5, 50], [1, 51], [0, 53], [-3, 56], [-6, 58], [-5, 54], [-3, 52]],
];
const WB = { status: new Map(), t: 0, karte: null };
function wbZeigen() {
const box = D.getElementById('wb-inhalt'); if (!box || !sichtbar('wb')) return;
const tf = new Map(maerkte().filter((m) => m.art === 'Index').map((m) => [m.name, m]));
const zeilen = BOERSEN.map((b) => { const m = b[7].map((n) => tf.get(n)).find(Boolean) || null; return { b, m, s: boerseStatus(b) }; });
let karte = box.querySelector('.w21-karte');
if (!karte) { karte = el('canvas', 'w21-karte'); karte.setAttribute('role', 'img'); }
karte.setAttribute('aria-label', T('wb.karteL', zeilen.filter((z) => z.s.offen).map((z) => A.tr(z.b[1])).join(', ') || T('wb.keine')));
const tab = el('table', 'w21-tab w21-wb'), tb = el('tbody'); tab.append(tb);
for (const reg of ['am', 'eu', 'as']) {
const kopf = el('tr', 'w21-reg'); const th = el('th', '', T('wb.' + reg)); th.colSpan = 4; kopf.append(th); tb.append(kopf);
for (const z of zeilen.filter((x) => x.b[6] === reg)) {
const tr = el('tr'), n = el('td'); n.append(el('span', 'w21-punkt ' + (z.s.offen ? 'offen' : 'zu')), D.createTextNode(' ' + A.tr(z.b[1])));
const idx = el('td');
if (z.m) { const b = el('button', 'w21-link', nameVon(z.m)); b.type = 'button'; b.addEventListener('click', () => A.oeffne(z.m.id)); idx.append(b); } else idx.append(el('span', 'leise', '–'));
tr.append(n, idx, el('td', 'mono r ' + (z.m && z.m.ae > 0 ? 'plus' : z.m && z.m.ae < 0 ? 'minus' : ''), z.m ? proz(z.m.ae) : ''),
el('td', 'leise r', z.s.wechsel == null ? '' : T(z.s.offen ? 'wb.schliesst' : 'wb.oeffnet', dauer(z.s.wechsel))));
tb.append(tr);
}
}
const offen = zeilen.filter((z) => z.s.offen).length;
const satz = el('p', 'w21-satz', T('wb.satz', offen, zeilen.length)); satz.append(el('span', 'leise', ' ' + T('wb.feiertage')));
const neben = el('div', 'w21-wb-neben'), links = el('div', 'w21-wb-karte'); links.append(karte, el('p', 'leise w21-legende', T('wb.legende')));
neben.append(links, tab);
box.replaceChildren(satz, neben, el('p', 'leise w21-fuss', T('wb.hinweis')));
WB.karte = zeilen; requestAnimationFrame(() => wbKarte(karte, zeilen));
stand('wb', 'aktuell', new Date().toLocaleTimeString(LOC(), { hour: '2-digit', minute: '2-digit' }));
return tf.size > 0;
}
function wbKarte(c, zeilen) {
const r = c.getBoundingClientRect(); if (!r.width) return;
const d = W.devicePixelRatio || 1, B = Math.round(r.width), H = Math.round(r.width * 0.46); c.style.height = H + 'px'; c.width = B * d; c.height = H * d;
const g = c.getContext('2d'); g.scale(d, d);
const cs = getComputedStyle(D.body), farbe = (v, f) => (cs.getPropertyValue(v) || f).trim() || f;
const X = (lon) => (lon + 170) / 360 * B, Y = (lat) => (78 - lat) / 140 * H;
g.fillStyle = farbe('--feld-2', '#25262a');
for (const p of LAND) { g.beginPath(); p.forEach(([lo, la], i) => (i ? g.lineTo(X(lo), Y(la)) : g.moveTo(X(lo), Y(la)))); g.closePath(); g.fill(); }
g.strokeStyle = farbe('--linie', '#333'); g.lineWidth = 1; g.setLineDash([2, 4]); g.beginPath(); g.moveTo(0, Y(0)); g.lineTo(B, Y(0)); g.stroke(); g.setLineDash([]);
g.font = '11px ' + (farbe('--sans', 'system-ui') || 'system-ui'); g.textBaseline = 'middle';
const gold = farbe('--akzent', '#e0a64e'), leise = farbe('--sehr-leise', '#777'), text = farbe('--text', '#eee'), belegt = [];
const reihe = [...zeilen].sort((a, b) => (a.s.offen ? 1 : 0) - (b.s.offen ? 1 : 0)).map((z) => ({ z, x: X(z.b[4]), y: Y(z.b[5]), rr: 3.5 + Math.min(6, Math.abs((z.m && z.m.ae) || 0) * 2.2) }));
for (const { z, x, y, rr } of reihe) { g.beginPath(); g.arc(x, y, rr, 0, 2 * Math.PI); g.fillStyle = z.s.offen ? gold : 'transparent'; g.fill(); g.strokeStyle = z.s.offen ? gold : leise; g.lineWidth = 1.3; g.stroke(); belegt.push([x - rr - 1, y - rr - 1, x + rr + 1, y + rr + 1]); }
const frei = (q) => q[0] >= 1 && q[2] <= B - 1 && q[1] >= 0 && q[3] <= H && !belegt.some((o) => q[0] < o[2] && q[2] > o[0] && q[1] < o[3] && q[3] > o[1]);
for (const { z, x, y, rr } of [...reihe].reverse()) {
const t = z.b[1] + (z.m ? ' ' + proz(z.m.ae, 1) : ''), w = g.measureText(t).width;
const lagen = [[x + rr + 4, y], [x - rr - 4 - w, y], [x - w / 2, y - rr - 9], [x - w / 2, y + rr + 9]];
const l = lagen.map(([lx, ly]) => [lx, ly, [lx, ly - 7, lx + w, ly + 7]]).find((q) => frei(q[2])); if (!l) continue;
belegt.push(l[2]); g.fillStyle = z.s.offen ? text : leise; g.fillText(t, l[0], l[1]);
}
}

const WA = { daten: null };
const LAENDER_EU = ['DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'PT', 'GR', 'IE', 'FI'], LAENDER_OECD = ['GBR', 'JPN', 'CAN', 'AUS', 'CHE'];
let WA_LAUF = null;
function wanlHolen() {
if (WA_LAUF) return WA_LAUF;
const g = A.gemerkt('w21.wanl', 6 * 36e5); if (g) { WA.daten = g; return Promise.resolve(g); }
const j = new Date().getUTCFullYear(), aus = { us: null, aaa: null, eu: null, oecd: null }, neu = () => { WA.daten = aus; if (sichtbar('wanl')) wanlZeichnen(); };
const teile = [
Promise.allSettled([holen(tsyUrl(j)), holen(tsyUrl(j - 1))]).then(([us, us0]) => { if (us.status === 'fulfilled' || us0.status === 'fulfilled') { const r = Object.assign({}, us0.status === 'fulfilled' ? tsyCsv(us0.value) : {}, us.status === 'fulfilled' ? tsyCsv(us.value) : {}), t = Object.keys(r).sort().pop(); if (t) { aus.us = { t, k: Object.fromEntries(r[t]) }; neu(); } } }),
holen('https://data-api.ecb.europa.eu/service/data/YC/B.U2.EUR.4F.G_N_A.SV_C_YM.SR_2Y+SR_10Y?format=csvdata&detail=dataonly&startPeriod=' + vor(20)).then((x) => { const r = ezbReihen(x, 'DATA_TYPE_FM'), a = r.SR_2Y || [], b = r.SR_10Y || []; if (b.length) { aus.aaa = { t: b[b.length - 1][0], j2: a.length ? a[a.length - 1][1] : null, j10: b[b.length - 1][1] }; neu(); } }),
holen('https://data-api.ecb.europa.eu/service/data/IRS/M.' + LAENDER_EU.join('+') + '.L.L40.CI.0000.EUR.N.Z?format=csvdata&detail=dataonly&startPeriod=' + vor(200).slice(0, 7)).then((x) => { const r = ezbReihen(x, 'REF_AREA'); aus.eu = Object.fromEntries(Object.entries(r).map(([k, v]) => [k, v[v.length - 1]])); neu(); }),
holen('https://sdmx.oecd.org/public/rest/data/OECD.SDD.STES,DSD_KEI@DF_KEI,4.0/' + LAENDER_OECD.join('+') + '.M.IRLT.PA._Z._Z._Z?startPeriod=' + vor(200).slice(0, 7) + '&dimensionAtObservation=AllDimensions&format=csvfile').then((x) => { const r = {}; for (const z of csvZeilen(x)) { const v = Number(z.OBS_VALUE); if (!z.REF_AREA || !z.TIME_PERIOD || !Number.isFinite(v)) continue; if (!r[z.REF_AREA] || r[z.REF_AREA][0] < z.TIME_PERIOD) r[z.REF_AREA] = [z.TIME_PERIOD, v]; } aus.oecd = r; neu(); }),
];
WA_LAUF = Promise.allSettled(teile).then(() => { if (!aus.us && !aus.aaa && !aus.eu && !aus.oecd) throw new Error('keine Quelle'); if (aus.us && aus.aaa && aus.eu && aus.oecd) A.merkeJson('w21.wanl', aus); WA.daten = aus; return aus; }).finally(() => { WA_LAUF = null; });
return WA_LAUF;
}
const tsyUrl = (j) => `https://home.treasury.gov/resource-center/data-chart-center/interest-rates/daily-treasury-rates.csv/${j}/all?type=daily_treasury_yield_curve&field_tdr_date_value=${j}&page&_format=csv`;
async function wanlZeigen(neu) {
const box = D.getElementById('wanl-inhalt'); if (!box || !sichtbar('wanl')) return;
if (!WA.daten || neu) {
if (!box.querySelector('table')) zustand(box, 'laedt', T('laedt')); stand('wanl', 'laedt', '');
try { await wanlHolen(); } catch (e) { zustand(box, 'fehler', T('wanl.fehler'), () => wanlZeigen(true)); stand('wanl', 'aus', ''); return; }
}
return wanlZeichnen();
}
function wanlZeichnen() {
const box = D.getElementById('wanl-inhalt'); if (!box || !WA.daten) return;
const x = WA.daten, de = x.eu && x.eu.DE ? x.eu.DE[1] : null, z = [];
const monat = (s) => { const [y, m] = String(s).split('-'); return new Date(Date.UTC(+y, +m - 1, 1)).toLocaleDateString(LOC(), { month: 'short', year: 'numeric', timeZone: 'UTC' }); };
if (x.us) z.push(['USA', x.us.k['2J'], x.us.k['10J'], datum(Date.parse(x.us.t)), 'wanl.taeglich', 'U.S. Treasury']);
if (x.aaa) z.push([T('wanl.aaa'), x.aaa.j2, x.aaa.j10, datum(Date.parse(x.aaa.t)), 'wanl.taeglich', 'EZB']);
for (const k of LAENDER_EU) if (x.eu && x.eu[k]) z.push([T('land.' + k), null, x.eu[k][1], monat(x.eu[k][0]), 'wanl.monatlich', 'EZB']);
for (const k of LAENDER_OECD) if (x.oecd && x.oecd[k]) z.push([T('land.' + k), null, x.oecd[k][1], monat(x.oecd[k][0]), 'wanl.monatlich', 'OECD']);
if (!z.length) { if (!WA_LAUF) zustand(box, 'leer', T('wanl.fehler'), () => wanlZeigen(true)); return; }
const tab = el('table', 'w21-tab'), kopf = el('tr'); for (const k of ['wanl.land', 'wanl.j2', 'wanl.j10', 'wanl.abstand', 'wanl.stand']) kopf.append(el('th', k === 'wanl.land' ? '' : 'r', T(k)));
tab.append(el('thead')); tab.tHead.append(kopf); const tb = el('tbody'); tab.append(tb);
for (const [n, j2, j10, st, takt, q] of z) {
const ab = de != null && j10 != null && n !== T('land.DE') ? (j10 - de) * 100 : null;
const tr = el('tr'); tr.title = T('wanl.zeileT', T(takt), q);
tr.append(el('td', '', n), el('td', 'mono r', j2 == null ? '' : pz(j2, 2)), el('td', 'mono r', pz(j10, 2)), el('td', 'mono r', ab == null ? '' : (ab > 0 ? '+' : ab < 0 ? '−' : '') + zahl(Math.abs(ab), 0) + ' ' + T('bp')),
el('td', 'leise r', st + (takt === 'wanl.monatlich' ? ' · ' + T('wanl.mon') : '')));
tb.append(tr);
}
box.replaceChildren(el('p', 'w21-satz', T('wanl.satz')), tab, el('p', 'leise w21-fuss', T('wanl.quellen')));
stand('wanl', 'aktuell', x.us ? datum(Date.parse(x.us.t)) : '');
}

const KT = { art: 'tag', coin: '', k: null, t: 0 };
async function ktabKerzen(c) {
if (KT.coin === c && KT.k && Date.now() - KT.t < 10 * 6e4) return KT.k;
const m = maerkte().find((x) => x.id === c), k = await A.kerzen(m ? m.hl : c, 'D', 800);
KT.coin = c; KT.k = k; KT.t = Date.now(); return k;
}
async function ktabZeigen() {
const box = D.getElementById('ktab-inhalt'); if (!box || !sichtbar('ktab')) return;
const c = A.coin(); if (KT.coin !== c) zustand(box, 'laedt', T('laedt'));
let k; try { k = await ktabKerzen(c); } catch (e) { zustand(box, 'fehler', T('ktab.fehler'), () => { KT.t = 0; ktabZeigen(); }); stand('ktab', 'aus', ''); return; }
if (A.coin() !== c) return;
if (!k || k.length < 3) { zustand(box, 'leer', T('ktab.leer')); return; }
const r = renditen(k), rz = el('dl', 'w21-rendite');
for (const [s, kk] of [['w1', 'ktab.r1w'], ['m1', 'ktab.r1m'], ['m3', 'ktab.r3m'], ['j1', 'ktab.r1j'], ['ytd', 'ktab.ytd']]) { const d = el('div'); d.append(el('dt', '', T(kk)), el('dd', 'mono ' + (r[s] > 0 ? 'plus' : r[s] < 0 ? 'minus' : ''), r[s] == null ? '–' : proz(r[s], 1))); rz.append(d); }
const wahl = el('div', 'ch-schalter w21-wahl');
for (const a of ['tag', 'woche', 'monat']) { const b = el('button', '', T('ktab.' + a)); b.type = 'button'; b.setAttribute('aria-pressed', String(KT.art === a)); b.addEventListener('click', () => { KT.art = a; ktabZeigen(); }); wahl.append(b); }
const z = buendeln(k, KT.art).reverse().slice(0, 40), tab = el('table', 'w21-tab w21-kt'), kopf = el('tr');
for (const s of ['ktab.datum', 'ktab.eroeff', 'ktab.hoch', 'ktab.tief', 'ktab.schluss', 'ktab.aend', 'ktab.umsatz']) kopf.append(el('th', s === 'ktab.datum' ? '' : 'r', T(s)));
tab.append(el('thead')); tab.tHead.append(kopf); const tb = el('tbody'); tab.append(tb);
z.forEach((x, i) => { const v = z[i + 1], ae = v && v[4] > 0 ? (x[4] / v[4] - 1) * 100 : null, tr = el('tr');
tr.append(el('td', 'mono', datum(x[0] * 1000)), el('td', 'mono r', kurs(x[1])), el('td', 'mono r', kurs(x[2])), el('td', 'mono r', kurs(x[3])), el('td', 'mono r', kurs(x[4])),
el('td', 'mono r ' + (ae > 0 ? 'plus' : ae < 0 ? 'minus' : ''), ae == null ? '' : proz(ae)), el('td', 'mono r leise', usdK(x[5]))); tb.append(tr); });
const kopfz = el('div', 'w21-kt-kopf'); kopfz.append(el('b', '', A.anzeige(c)), wahl);
box.replaceChildren(kopfz, rz, el('div', 'w21-scroll'), el('p', 'leise w21-fuss', T('ktab.hinweis')));
box.querySelector('.w21-scroll').append(tab);
stand('ktab', 'aktuell', datum(k[k.length - 1][0] * 1000));
}

const RI = { gegen: 'BTC', tage: 90, t: 0 };
async function risikoZeigen() {
const box = D.getElementById('risiko-inhalt'); if (!box || !sichtbar('risiko')) return;
const c = A.coin(), l = maerkte(), m = l.find((x) => x.id === c), sp500 = l.find((x) => x.name === 'SP500' || x.name === 'USA500' || x.name === 'US500');
let gegen = RI.gegen === 'SP' && sp500 ? sp500 : l.find((x) => x.id === 'BTC');
if (gegen && m && gegen.id === m.id) gegen = RI.gegen === 'SP' ? l.find((x) => x.id === 'BTC') : sp500 || gegen;
if (!m || !gegen) { zustand(box, 'laedt', T('laedt')); return false; }
if (!box.querySelector('.w21-ri')) zustand(box, 'laedt', T('laedt'));
let ka, kb; try { [ka, kb] = await Promise.all([A.kerzen(m.hl, 'D', 400), A.kerzen(gegen.hl, 'D', 400)]); } catch (e) { zustand(box, 'fehler', T('ri.fehler'), risikoZeigen); stand('risiko', 'aus', ''); return; }
if (A.coin() !== c) return;
const r = risiko(ka, kb, RI.tage);
const wahl = el('div', 'ch-schalter w21-wahl');
for (const [g, k] of [['BTC', 'ri.btc'], ['SP', 'ri.sp']]) { const b = el('button', '', T(k)); b.type = 'button'; b.setAttribute('aria-pressed', String(RI.gegen === g)); if (g === 'SP' && !sp500) b.disabled = true; b.addEventListener('click', () => { RI.gegen = g; risikoZeigen(); }); wahl.append(b); }
const wt = el('div', 'ch-schalter w21-wahl');
for (const t of [30, 90, 365]) { const b = el('button', '', T('ri.tage', t)); b.type = 'button'; b.setAttribute('aria-pressed', String(RI.tage === t)); b.addEventListener('click', () => { RI.tage = t; risikoZeigen(); }); wt.append(b); }
const kopf = el('div', 'w21-kt-kopf'); kopf.append(el('b', '', A.anzeige(c) + ' · ' + T('ri.gegen') + ' ' + A.anzeige(gegen.id)), wahl, wt);
if (!r) { box.replaceChildren(kopf); box.append(el('p', 'leise', T('ri.wenig'))); return; }
const dl = el('dl', 'kacheln w21-ri'), kach = (t, v, s) => { const d = el('div', 'kachel'); d.append(el('dt', '', t), el('dd', 'mono', v), el('p', 'leise', s)); dl.append(d); };
kach(T('ri.beta'), zahl(r.beta, 2), T('ri.betaS', zahl(r.beta, 2), A.anzeige(gegen.id)));
kach(T('ri.korr'), zahl(r.korr, 2), T('ri.korrS'));
kach(T('ri.vola'), pz(r.vola, 0), T('ri.volaS'));
kach(T('ri.dd'), proz(r.dd, 1), T('ri.ddS', r.n));
const c2 = el('canvas', 'w21-punkte'); c2.setAttribute('role', 'img'); c2.setAttribute('aria-label', T('ri.punkte', A.anzeige(gegen.id), A.anzeige(c)));
const probe = el('p', 'w21-satz ' + (r.mehr ? '' : 'leise'), T('ri.zufall', zahl(r.band, 2)) + ' ' + T(r.mehr ? 'ri.mehr' : 'ri.nicht'));
const neben = el('div', 'w21-ri-neben'), lk = el('div'); lk.append(c2, el('p', 'leise w21-legende', T('ri.punkte', A.anzeige(gegen.id), A.anzeige(c))));
neben.append(dl, lk);
box.replaceChildren(kopf, neben, probe, el('p', 'leise w21-fuss', T('ri.hinweis')));
requestAnimationFrame(() => punkte(c2, r));
stand('risiko', 'aktuell', T('ri.tage', r.n));
}
function punkte(c, r) {
const b = c.getBoundingClientRect(); if (!b.width) return;
const d = W.devicePixelRatio || 1, B = Math.round(b.width), H = Math.round(Math.min(260, b.width * 0.62)); c.style.height = H + 'px'; c.width = B * d; c.height = H * d;
const g = c.getContext('2d'); g.scale(d, d); const cs = getComputedStyle(D.body), f = (v, x) => (cs.getPropertyValue(v) || x).trim() || x;
const xs = r.punkte.map((p) => p[0]), ys = r.punkte.map((p) => p[1]), m = Math.max(0.02, ...xs.map(Math.abs), ...ys.map(Math.abs)) * 1.08;
const X = (v) => B / 2 + v / m * (B / 2 - 8), Y = (v) => H / 2 - v / m * (H / 2 - 8);
g.strokeStyle = f('--linie', '#333'); g.lineWidth = 1; g.beginPath(); g.moveTo(0, H / 2); g.lineTo(B, H / 2); g.moveTo(B / 2, 0); g.lineTo(B / 2, H); g.stroke();
g.fillStyle = f('--text-2', '#bbb'); g.globalAlpha = 0.55; for (const p of r.punkte) { g.beginPath(); g.arc(X(p[0]), Y(p[1]), 2.2, 0, 2 * Math.PI); g.fill(); } g.globalAlpha = 1;
g.strokeStyle = f('--akzent', '#e0a64e'); g.lineWidth = 1.6; g.beginPath(); g.moveTo(X(-m), Y(-m * r.beta)); g.lineTo(X(m), Y(m * r.beta)); g.stroke();
}

const D3 = new Map();
const D3_ZIEL = {
vola: ['#w16-vola-block', '.leinwand-mz', () => { const d = A.w16(); return d && d.t ? [{ kerzen: d.t }, d.quelle + ' · ' + d.markt, d.t] : null; }],
uhr: ['#w16-uhr-block', '.leinwand-mz', () => { const d = A.w16(); return d && d.h ? [{ kerzen: d.h }, d.quelle + ' · ' + d.markt, d.h] : null; }],
grat: ['#w16-grat-block', '.leinwand-mz', () => { const d = A.w16(); return d && d.h ? [{ kerzen: d.h }, d.quelle + ' · ' + d.markt, d.h] : null; }],
optionen: ['[data-teil="ol-3db"]', '.leinwand-olab', () => { const o = A.opt(); return o && o.reihen ? [{ reihen: o.reihen, zeit: o.zeit }, (o.quellen || []).join(' + ') + ' · ' + o.coin, o] : null; }],
zinsen: ['#bh-kurve', '.leinwand-mz', () => (ZINS.reihe ? [{ reihe: ZINS.reihe }, 'U.S. Department of the Treasury', ZINS.reihe] : null)],
liquiditaet: ['main.raster > section.feld.heat', '.leinwand-heat', () => { const k = A.buch(); return k && k.size > 30 ? [k, T('d3.liq') + ' · ' + A.anzeige(A.coin()), k.size] : null; }],
};
const ZINS = { reihe: null, p: null };
function zinsReihe() {
if (ZINS.reihe) return Promise.resolve(ZINS.reihe);
if (!ZINS.p) ZINS.p = gemerkt('zins4', 6 * 36e5, async () => { const j = new Date().getUTCFullYear(), r = {}; for (const x of await Promise.allSettled([j - 3, j - 2, j - 1, j].map((y) => holen(tsyUrl(y))))) if (x.status === 'fulfilled') Object.assign(r, tsyCsv(x.value)); if (!Object.keys(r).length) throw new Error('Treasury'); return r; }, true)
.then((r) => (ZINS.reihe = r)).finally(() => { ZINS.p = null; });
return ZINS.p;
}
function d3Block(art) { const [s] = D3_ZIEL[art]; const b = D.querySelector(s); return b && b.offsetParent !== null ? b : null; }
function d3Knoepfe() {
for (const art of Object.keys(D3_ZIEL)) {
const b = d3Block(art); if (!b || b.querySelector('.w21-3d')) continue;
const k = el('button', 'w21-3d', '3D'); k.type = 'button'; k.dataset.w19 = art; k.title = T('d3.titel'); k.setAttribute('aria-label', T('d3.titel')); k.setAttribute('aria-pressed', 'false');
const ort = art === 'liquiditaet' ? b.querySelector(':scope > .feld-kopf') : b.querySelector('h3, .mz-kopf, .ol-kopf') || b.firstElementChild;
if (!ort) continue;
if (art === 'liquiditaet') { const was = ort.querySelector(':scope > .was'); if (was) ort.insertBefore(k, was); else ort.append(k); } else ort.append(k);
}
}
async function d3Umschalten(art, an) {
const z = D3_ZIEL[art]; if (!z) return false;
const offen = D3.get(art);
if (offen && an !== true) { d3Zu(art); return false; }
if (offen) return true;
for (let i = 0; i < 60 && !d3Block(art); i++) await new Promise((r) => setTimeout(r, 250));
const block = d3Block(art); if (!block) return false;
if (art === 'liquiditaet' && !z[2]()) { d3Warte(block); return false; }
const [R] = await Promise.all([A.w19(), art === 'zinsen' ? zinsReihe().catch(() => null) : null]);
let q = z[2](); for (let i = 0; i < 80 && !q; i++) { await new Promise((r) => setTimeout(r, 250)); q = z[2](); }
if (!q || D3.has(art) || !R) return false;
const alt = block.querySelector(z[1]), box = el('div', 'w21-3d-box'), h = Math.max(320, alt ? alt.clientHeight : 0); box.style.height = h + 'px';
if (alt) { alt.hidden = true; alt.after(box); } else block.append(box);
const v = R.zeichne(box, art, q[0], { sprache: sp(), quelle: q[1], bei2D: () => d3Zu(art), hoehe: h });
D3.set(art, { v, box, alt, sig: q[2], coin: A.coin() });
for (const k of D.querySelectorAll(`.w21-3d[data-w19="${art}"]`)) k.setAttribute('aria-pressed', 'true');
return true;
}
function d3Warte(block) {
const k = A.buch(), rest = Math.max(1, 31 - (k ? k.size : 0));
let h = block.querySelector(':scope > .w21-3d-warte');
if (!h) { h = el('p', 'w21-3d-warte leise'); h.setAttribute('role', 'status'); const kopf = block.querySelector(':scope > .feld-kopf'); if (kopf) kopf.after(h); else block.prepend(h); }
const t = T('d3.warte', rest); if (h.textContent !== t) h.textContent = t;
for (const x of block.querySelectorAll('.w21-3d[data-w19="liquiditaet"]')) { x.setAttribute('aria-pressed', 'false'); x.title = t; }
}
function d3Zu(art) {
const o = D3.get(art); if (!o) return;
try { o.v.entferne(); } catch (e) {   }
if (o.box.isConnected) o.box.remove(); if (o.alt) o.alt.hidden = false; D3.delete(art);
for (const k of D.querySelectorAll(`.w21-3d[data-w19="${art}"]`)) k.setAttribute('aria-pressed', 'false');
A.resize();
}
function d3Takt() {
if (D.hidden) return;
d3Knoepfe();
for (const h of D.querySelectorAll('.w21-3d-warte')) { const b = h.parentElement; if (!b || b.offsetParent === null || D3_ZIEL.liquiditaet[2]()) { for (const x of D.querySelectorAll('.w21-3d[data-w19="liquiditaet"]')) x.title = T('d3.titel'); h.remove(); } else d3Warte(b); }
for (const [art, o] of [...D3]) {
if (!o.box.isConnected || o.box.offsetParent === null || o.coin !== A.coin()) { d3Zu(art); continue; }
const q = D3_ZIEL[art][2](); if (q && q[2] !== o.sig) { o.sig = q[2]; try { o.v.aktualisiere(q[0]); } catch (e) {   } }
}
}

const RPC = 'https://solana-rpc.publicnode.com', FA = new Map();
const rpc = (liste) => holen(RPC, 'json', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(liste.map(([m, p], i) => ({ jsonrpc: '2.0', id: i, method: m, params: p }))) }, 25000)
.then((a) => { const r = []; for (const x of Array.isArray(a) ? a : [a]) r[x.id] = x.result; return r; });
async function fallenPruefen(mint) {
const alt = FA.get(mint); if (alt && Date.now() - alt.t < 10 * 6e4) return alt.p;
const p = (async () => {
const [r1, ds] = await Promise.all([rpc([['getSignaturesForAddress', [mint, { limit: 1000 }]], ['getAccountInfo', [mint, { encoding: 'jsonParsed' }]]]),
holen('https://api.dexscreener.com/tokens/v1/solana/' + mint, 'json').catch(() => null)]);
let roh = r1[0] || [];
for (let seite = 1, l = roh; seite < 5 && l.length >= 1000; seite++) { l = (await rpc([['getSignaturesForAddress', [mint, { limit: 1000, before: l[l.length - 1].signature }]]]))[0] || []; roh = roh.concat(l); if (l.length < 1000) break; }
const sigs = roh.filter((s) => !s.err), info = r1[1] && r1[1].value && r1[1].value.data && r1[1].value.data.parsed && r1[1].value.data.parsed.info;
const angebot = info ? Number(info.supply) / 10 ** (Number(info.decimals) || 0) : null, aus = { mint, zuviel: roh.length >= 5000, n: roh.length, angebot };
const paar = Array.isArray(ds) ? ds.filter((x) => x && x.baseToken && x.baseToken.address === mint).sort((a, b) => ((b.liquidity || {}).usd || 0) - ((a.liquidity || {}).usd || 0))[0] : null;
aus.symbol = paar && paar.baseToken ? paar.baseToken.symbol : ''; aus.name = paar && paar.baseToken ? paar.baseToken.name : '';
aus.x = paar && paar.info ? xHandle(((paar.info.socials || []).find((s) => /twitter|^x$/i.test(s.type || '')) || {}).url || (paar.info.socials || []).map((s) => s.url).find(xHandle)) : null;
aus.seit = paar ? paar.pairCreatedAt || null : null;
let fp = null;
if (!aus.zuviel && sigs.length && angebot > 0) {
const erste = [...sigs].sort((a, b) => a.slot - b.slot), t0 = erste[0].blockTime || 0, wahl = erste.filter((s, i) => i < 20 || (s.blockTime && s.blockTime - t0 <= 30)).slice(0, 30);
const txs = new Array(wahl.length).fill(null);
for (let i = 0; i < wahl.length; i += 4) await Promise.all(wahl.slice(i, i + 4).map((s, j) => rpc([['getTransaction', [s.signature, { encoding: 'jsonParsed', maxSupportedTransactionVersion: 0, commitment: 'confirmed' }]]]).then((r) => { txs[i + j] = r[0]; }).catch(() => {})));
fp = fruehphase(txs.map((t, i) => (t ? { ...t, slot: t.slot || wahl[i].slot } : null)), mint, angebot);
}
aus.fp = fp;
const wallets = [...new Set([fp && fp.ersteller, ...((fp && fp.grosse) || []).slice(0, 8)].filter(Boolean))];
const [r3, such] = await Promise.all([wallets.length ? rpc(wallets.map((w) => ['getSignaturesForAddress', [w, { limit: 100 }]])).catch(() => null) : null,
aus.symbol ? holen('https://api.dexscreener.com/latest/dex/search?q=' + encodeURIComponent(aus.symbol), 'json').catch(() => null) : null]);
if (r3) aus.alter = wallets.map((w, i) => { const l = (r3[i] || []).map((s) => s.blockTime).filter(Boolean); return { w, n: (r3[i] || []).length, erste: l.length ? Math.min(...l) * 1000 : null }; });
const andere = new Map();
for (const q of (such && such.pairs) || []) { const b = q.baseToken || {}; if (!b.address || b.address === mint || q.chainId !== 'solana') continue;
const gleichX = aus.x && q.info && (q.info.socials || []).some((s) => xHandle(s.url) === aus.x), gleichN = String(b.symbol || '').toLowerCase() === String(aus.symbol).toLowerCase() || (aus.name && String(b.name || '').toLowerCase() === aus.name.toLowerCase());
const a = andere.get(b.address) || { adr: b.address, sym: b.symbol, seit: q.pairCreatedAt || null, x: false, n: false }; a.x = a.x || !!gleichX; a.n = a.n || !!gleichN; if (q.pairCreatedAt && (!a.seit || q.pairCreatedAt < a.seit)) a.seit = q.pairCreatedAt; andere.set(b.address, a); }
aus.andere = [...andere.values()];
return aus;
})();
FA.set(mint, { t: Date.now(), p }); p.catch(() => FA.delete(mint));
return p;
}
function fallenKnopf() {
const box = D.getElementById('rug-ergebnis'); if (!box || !box.querySelector('.rug-kopf') || box.querySelector('.w21-fa')) return;
const mint = (D.getElementById('rug-eingabe') || {}).value || ''; if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(mint.trim())) return;
const f = roh(el('div', 'w21-fa')), h = el('h3', '', T('fa.titel')), b = el('button', 'w21-fa-knopf', T('fa.knopf')); b.type = 'button';
const aus = el('div', 'w21-fa-aus'); aus.setAttribute('aria-live', 'polite');
b.addEventListener('click', () => fallenZeigen(mint.trim(), aus, b));
f.append(h, el('p', 'leise', T('fa.was')), b, aus);
const q = box.querySelector('.rug-quellen'); if (q) box.insertBefore(f, q); else box.append(f);
}
async function fallenZeigen(mint, aus, knopf) {
knopf.disabled = true; zustand(aus, 'laedt', T('fa.laeuft'));
let r; try { r = await fallenPruefen(mint); } catch (e) { zustand(aus, 'fehler', T('fa.fehler')); knopf.disabled = false; return; }
const ul = el('ul', 'rug-gruende'), li = (art, s) => ul.append(el('li', art, s)), jetzt = Date.now(), fp = r.fp;
if (r.zuviel) li('leise', T('fa.zuviel'));
else if (!fp) li('leise', T('fa.ohne'));
if (fp) {
if (fp.sniperPct >= 1) li(fp.sniperPct >= 20 ? 'rot' : 'gelb', T('fa.sniper', pz(fp.sniperPct, 1), fp.sniperN));
if (fp.buendel) li(fp.buendel.pct >= 10 ? 'rot' : 'gelb', T(fp.buendel.start ? 'fa.buendelStart' : 'fa.buendel', fp.buendel.n, pz(fp.buendel.pct, 1)));
if (fp.devPct >= 1) li(fp.devPct >= 5 ? 'gelb' : 'leise', T('fa.dev', pz(fp.devPct, 1)));
}
if (r.alter && r.alter.length) {
const e = fp && r.alter.find((x) => x.w === fp.ersteller), jung = (x) => x.erste && x.n < 100 && jetzt - x.erste < 864e5;
if (e) { const spanne = e.erste ? jetzt - e.erste : null; if (e.n >= 100) li(spanne != null && spanne < 864e5 ? 'gelb' : 'leise', T('fa.erstellerAktiv', spanne != null ? dauer(spanne) : '–')); else if (jung(e)) li('gelb', T('fa.erstellerNeu', dauer(spanne), e.n)); else li('leise', T('fa.ersteller', e.n, spanne != null ? dauer(spanne) : '–')); }
const k = r.alter.filter((x) => !e || x.w !== e.w), j = k.filter(jung);
if (k.length) li(j.length >= Math.max(2, k.length / 2) ? 'gelb' : 'leise', T('fa.alter', j.length, k.length));
}
const kx = r.andere.filter((a) => a.x), aelter = kx.filter((a) => a.seit && r.seit && a.seit < r.seit).sort((a, b) => a.seit - b.seit)[0];
if (!r.x) li('leise', T('fa.keinX'));
else if (aelter) li('rot', T('fa.klon', aelter.sym || aelter.adr.slice(0, 6) + '…', datum(aelter.seit)));
else if (kx.length) li('gelb', T('fa.klonAndere', kx.length));
const gn = r.andere.filter((a) => a.n && !a.x).length; if (gn) li('leise', T('fa.gleicherName', gn));
if (!ul.children.length) li('gruen', T('fa.nichts'));
aus.replaceChildren(ul, el('p', 'leise w21-fuss', T('fa.fuss')));
knopf.disabled = false; knopf.textContent = T('fa.nochmal');
}

const ANZEIGE = { steck: steckZeigen, gvl: gvlZeigen, wb: wbZeigen, roh: rohZeigen, fx: fxZeigen, wanl: wanlZeigen, ktab: ktabZeigen, risiko: risikoZeigen };
const LETZT = new Map(), ABSTAND = { steck: 15e3, gvl: 15e3, wb: 60e3, roh: 30e3, fx: 6e5, wanl: 6e5, ktab: 6e4, risiko: 3e5 };
let letzterCoin = '';
function takt() {
if (D.hidden) return;
const c = A.coin(); if (c !== letzterCoin) { letzterCoin = c; LETZT.clear(); }
for (const id of KACHELN) {
if (!sichtbar(id)) { LETZT.delete(id); continue; }
if (Date.now() - (LETZT.get(id) || 0) < ABSTAND[id]) continue;
LETZT.set(id, Date.now()); try { Promise.resolve(ANZEIGE[id]()).then((ok) => { if (ok === false) LETZT.set(id, Date.now() - ABSTAND[id] + 2500); }).catch(() => {}); } catch (e) {   }
}
}
function start(api) {
if (A) return W.RYVO_W21;
A = api;
LB.an = A.lies('w21.band') !== 'aus';
kachelnEinsetzen();
D.documentElement.classList.toggle('w21-band-an', LB.an);
setInterval(takt, 1500); setTimeout(takt, 300);
setInterval(d3Takt, 2000); setTimeout(d3Takt, 800);
D.addEventListener('click', (e) => { const b = e.target.closest && e.target.closest('.w21-3d[data-w19]'); if (!b) return; e.preventDefault(); e.stopPropagation(); d3Umschalten(b.dataset.w19).catch(() => {}); }, true);
setInterval(() => { if (!D.hidden) { bandAuffrischen(); fallenKnopf(); } }, 5000); setTimeout(bandAuffrischen, 1200);
new MutationObserver(() => fallenKnopf()).observe(D.getElementById('rug-ergebnis') || D.body, { childList: true });
W.addEventListener('resize', () => { if (WB.karte) { const c = D.querySelector('.w21-karte'); if (c && c.offsetParent) wbKarte(c, WB.karte); } });
if (W.matchMedia) W.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', () => bandLauf(0));
return W.RYVO_W21;
}
W.RYVO_W21 = {
start, rechne, kacheln: KACHELN, T,
d3: d3Umschalten, d3Offen: () => [...D3.keys()], band: bandSchalten, bandAn: () => LB.an, bandAnim: () => LB.anim,
zeige: (id) => { LETZT.delete(id); const f = ANZEIGE[id]; if (f) return f(); }, fallen: fallenPruefen,
};
})(window);

