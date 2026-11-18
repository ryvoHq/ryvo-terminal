{ const s = document.createElement("style"); s.id = "w23-stil"; s.textContent = ".w23-kopf { display: flex; align-items: center; gap: 6px; margin-left: auto; min-width: 0; }\nhtml.w23-fenster header.leiste { position: relative; }\nhtml.w23-fenster .w23-kopf { position: absolute; top: 12px; right: 14px; z-index: 5; }\n\n@media (max-width: 699px) { html.w23-fenster .w23-kopf { position: static; min-width: 0; flex: 1 1 auto; grid-column: 3 / 5; grid-row: 1; justify-self: end; } html.w23-fenster body.w17 .leiste > .kurs { display: none; } html.w23-fenster .w23-kopf .w23-zurueck { overflow: hidden; text-overflow: ellipsis; } }\n.w23-gruppe { font: inherit; font-size: 12px; color: var(--text); background: var(--feld-2); border: 1px solid var(--linie); border-left: 4px solid var(--w23-g, var(--akzent)); border-radius: var(--radius-klein, 4px); padding: 3px 6px; }\n.w23-schild, .w23-zurueck { font: inherit; font-size: 12px; color: var(--text-2); background: none; border: 1px solid var(--linie); border-radius: var(--radius-klein, 4px); padding: 3px 8px; cursor: pointer; white-space: nowrap; }\n.w23-schild { max-width: 230px; overflow: hidden; text-overflow: ellipsis; }\n.w23-schild[data-z=\"aus\"] { color: var(--verk); border-color: var(--verk); }\n.w23-zurueck:hover, .w23-schild:hover { color: var(--text-stark); border-color: var(--akzent); }\nhtml.w23-fenster #r12-zeile, html.w23-fenster #w17-neu, html.w23-fenster #w21-band, html.w23-fenster #r12-start { display: none !important; }\nhtml.w23-kachel #w17-reiter, html.w23-kachel #w17-plus, html.w23-kachel #ab-leiste { display: none !important; }\n.feld-kopf > .qs[role=\"button\"] { cursor: pointer; }\n.feld-kopf > .qs[role=\"button\"]:hover { color: var(--text-stark); text-decoration: underline dotted; text-underline-offset: 3px; }\n.w23-erkl, .w23-tafel { position: fixed; z-index: 90; background: var(--feld); color: var(--text); border: 1px solid var(--feld-rahmen, var(--linie)); border-radius: var(--radius, 6px);\n  box-shadow: 0 10px 30px rgba(0, 0, 0, .45); padding: 12px 14px; font-size: 12.5px; line-height: 1.45; }\n.w23-erkl > b { display: block; padding-right: 24px; font-size: 13px; color: var(--text-stark); }\n.w23-erkl dl { display: grid; grid-template-columns: max-content 1fr; gap: 4px 12px; margin: 8px 0; }\n.w23-erkl dt { color: var(--leise); }\n.w23-erkl dd { margin: 0; font-variant-numeric: tabular-nums; }\n.w23-erkl p { margin: 0 0 8px; }\n.w23-x { position: absolute; top: 6px; right: 8px; font: inherit; font-size: 16px; line-height: 1; color: var(--leise); background: none; border: 0; padding: 4px; cursor: pointer; }\n.w23-tafel { right: 16px; bottom: 64px; width: min(400px, calc(100vw - 32px)); }\n.w23-tafel p { margin: 0 24px 10px 0; }\n.w23-weiter { font: inherit; color: var(--grund); background: var(--akzent); border: 0; border-radius: var(--radius-klein, 4px); padding: 7px 12px; cursor: pointer; }\n.w23-bk { display: inline-flex; align-items: center; gap: 4px; font-size: 12px; color: var(--text-2); text-decoration: none; border: 1px solid var(--linie); border-radius: var(--radius-klein, 4px); padding: 3px 8px; white-space: nowrap; }\n.w23-bk:hover, .w23-bk:focus-visible { color: var(--text-stark); border-color: var(--akzent); }\n.w23-bk-kurz { align-self: center; margin-left: 8px; }\n.w23-boerse { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; margin-top: 8px; }\n.w23-bk-wahl { font: inherit; font-size: 12px; color: var(--text); background: var(--feld-2); border: 1px solid var(--linie); border-radius: var(--radius-klein, 4px); padding: 3px 4px; }\n.w23-bk-satz { flex-basis: 100%; margin: 0; font-size: 11px; }\n.dquellen-tab { width: 100%; border-collapse: collapse; font-size: 12px; font-variant-numeric: tabular-nums; }\n.dquellen-tab th { text-align: left; font-weight: 500; color: var(--leise); border-bottom: 1px solid var(--linie); padding: 4px 8px 4px 0; }\n.dquellen-tab td { border-bottom: 1px solid var(--linie); padding: 4px 8px 4px 0; vertical-align: top; }\n.dquellen-stoer td:last-child { color: var(--verk); }\n#dquellen-inhalt { overflow: auto; max-height: 100%; }\n@media (max-width: 699px), (hover: none) and (pointer: coarse) { #w23-bk-kopf { display: none; } .w23-erkl { font-size: 13px; } }"; document.head.append(s); }

(function (W) {
'use strict';
let A = null;
const D = document;
const SPR = ['de', 'en', 'es', 'fr', 'tr', 'it'];
const sp = () => (A && SPR.includes(A.sprache()) ? A.sprache() : 'en');
function T(k, ...a) {
const X = W.RYVO_W23_TEXTE || {}, s = sp(), f = (X[s] && X[s][k]) ?? (X.en && X.en[k]) ?? (X.de && X.de[k]) ?? k;
return a.length ? String(f).replace(/\{(\d)\}/g, (_, i) => (a[+i] === undefined ? '' : a[+i])) : f;
}
const el = (tag, kl, txt) => { const e = D.createElement(tag); if (kl) e.className = kl; if (txt != null) e.textContent = txt; return e; };
const roh = (e) => { e.dataset.roh = ''; e.translate = false; return e; };
const LOC = () => ({ de: 'de-DE', en: 'en-GB', es: 'es-ES', fr: 'fr-FR', tr: 'tr-TR', it: 'it-IT' })[sp()];
const zahl = (x, nk) => x.toLocaleString(LOC(), { minimumFractionDigits: nk, maximumFractionDigits: nk });
const uhr = (t) => new Date(t).toLocaleTimeString(LOC(), { hour: '2-digit', minute: '2-digit', second: '2-digit' });
const median = (a) => { if (!a.length) return null; const b = a.slice().sort((x, y) => x - y); return b[Math.floor((b.length - 1) / 2)]; };
const quantil = (a, q) => { if (!a.length) return null; const b = a.slice().sort((x, y) => x - y); return b[Math.min(b.length - 1, Math.floor(q * (b.length - 1) + 0.5))]; };
function dauer(ms) {
const s = Math.max(0, Math.round(ms / 1000));
return s < 60 ? T('eS', s) : s < 3600 ? T('eMin', Math.round(s / 60)) : s < 172800 ? T('eStd', Math.round(s / 3600)) : T('eT', Math.round(s / 86400));
}
function sek(ms) { return ms < 50 ? '< ' + zahl(0.1, 1) + ' s' : zahl(ms / 1000, ms < 10000 ? 1 : 0) + ' s'; }
const sichtbar = (s) => !!s && !s.hidden && s.offsetParent !== null;

const Q = new URLSearchParams(location.search);
const neueId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const F = {
id: /^[a-z0-9]{4,20}$/.test(Q.get('w23f') || '') ? Q.get('w23f') : 'h' + neueId(), start: Date.now(),
rolle: Q.has('w23f') ? 'fenster' : 'haupt', bereich: Q.get('w23b') === '1', gruppe: 'A',
andere: new Map(), bc: null, gesehen: [], letzt: {}, von: {}, tiefe: {}, offen: [], warte: null,
};
const GRUPPEN = ['A', 'B', 'C', 'frei'];
const GRUPPE_FARBE = { A: 'var(--gold, #d9b45a)', B: '#6aa7ff', C: '#5fcf98', frei: 'var(--leise, #8a8f98)' };
const OHNE_WS = new Set(['behoerden', 'mz', 'wanl', 'weltm', 'weltuhr', 'makro', 'n1s', 'n1l', 'news', 'meldungen', 'meintag', 'jour', 'ueben', 'lern', 'selbst',
'journal', 'analyst', 'onchain', 'rug', 'fx', 'wb', 'roh', 'gvl', 'hmap', 'dquellen', 'umfeld', 'rangliste']);
function senden(m, schwer) {
m.von = F.id; m.n = neueId();
try { if (F.bc) F.bc.postMessage(m); } catch (e) {   }
direkt(m);
if (!schwer) try { localStorage.setItem('profi.w23.bus', JSON.stringify(m)); } catch (e) {   }
}
function direkt(m, ausser) {
F.offen = F.offen.filter((w) => w && !w.closed);
for (const w of [W.opener, ...F.offen]) { if (!w || w === ausser || w.closed) continue; try { w.postMessage({ w23: m }, '*'); } catch (e) {   } }
}
function empfangen(m) {
if (!m || typeof m !== 'object' || m.von === F.id || !m.n || F.gesehen.includes(m.n)) return;
F.gesehen.push(m.n); if (F.gesehen.length > 200) F.gesehen.splice(0, 100);
const jetzt = Date.now();
if (m.t === 'hallo') { F.andere.set(m.von, { ...m, at: jetzt }); return; }
if (m.t === 'tschuess') { F.andere.delete(m.von); return; }
if (m.t === 'zu' && F.rolle === 'fenster') { W.close(); return; }
if (m.t === 'tiefe') { if (m.c === A.coin() && A.tiefeSetzen(m.wo, m.c, m.d)) F.tiefe[m.wo] = { c: m.c, at: jetzt }; return; }
if (F.gruppe === 'frei' || m.g !== F.gruppe) return;
if (m.t === 'markt' && m.c && m.c !== A.coin()) { F.von.coin = m.c; F.letzt.coin = m.c; A.wechseln(m.c); }
if (m.t === 'zeit') {
if (m.fz && m.fz !== A.fenster()) { F.letzt.fz = m.fz; A.fensterSetzen(m.fz); }
if (m.tf && m.tf !== A.tf()) { F.letzt.tf = m.tf; A.tfSetzen(m.tf); }
}
}
const lebend = () => [...F.andere.values()].filter((x) => Date.now() - x.at < 6500);
function ichLeiter() {
return lebend().every((x) => x.start > F.start || (x.start === F.start && x.von > F.id));
}
function hallo() {
senden({ t: 'hallo', rolle: F.rolle, start: F.start, g: F.gruppe, coin: A.coin(), ziel: fensterZiel(), titel: fensterTitel(), url: location.href,
b: { x: W.screenX, y: W.screenY, w: W.outerWidth, h: W.outerHeight } });
}
function fensterZiel() { return F.rolle === 'fenster' ? (A.solo() ? 'feld:' + A.solo() : 'bereich') : 'haupt'; }
function fensterTitel() { return A.solo() ? A.feldTitel(A.solo()) : A.bereichTitel(); }
function takt() {
const c = A.coin(), fz = A.fenster(), tf = A.tf();
if (c !== F.letzt.coin) { F.letzt.coin = c; if (F.von.coin !== c && F.gruppe !== 'frei') senden({ t: 'markt', g: F.gruppe, c }); F.von.coin = null; boerseAuffrischen(); }
if (fz !== F.letzt.fz || tf !== F.letzt.tf) { F.letzt.fz = fz; F.letzt.tf = tf; if (F.gruppe !== 'frei') senden({ t: 'zeit', g: F.gruppe, fz, tf }); }
}
function fensterUrl(art, ziel, gruppe) {
const u = new URL(location.href), id = neueId();
for (const k of ['einstieg', 'solo', 'w23f', 'w23g', 'w23b', 'ohnews', 'lang']) u.searchParams.delete(k);
u.searchParams.set('einstieg', '0'); u.searchParams.set('w23f', id); u.searchParams.set('w23g', gruppe || (F.gruppe === 'frei' ? 'A' : F.gruppe));
let felder;
if (art === 'feld') { u.searchParams.set('solo', '1'); u.hash = `#tab=feld&feld=${ziel}&markt=${A.coin()}`; felder = [ziel]; }
else { u.searchParams.set('w23b', '1'); u.hash = A.ziel(); felder = [...D.querySelectorAll('main.raster > section.feld')].filter(sichtbar).map((s) => A.feldId(s)).filter(Boolean); }
if (felder.length && felder.every((f) => OHNE_WS.has(f))) u.searchParams.set('ohnews', '1');
return { url: u.href, id };
}
function oeffnen(url, id, b) {
const f = ['popup'];
if (b && b.w > 200 && b.h > 150) f.push('width=' + Math.round(b.w), 'height=' + Math.round(b.h), 'left=' + Math.round(b.x), 'top=' + Math.round(b.y));
else f.push('width=980', 'height=680');
let w = null; try { w = W.open(url, 'ryvo-' + id, f.join(',')); } catch (e) {   }
if (w) F.offen.push(w);
return w;
}
function kachelFenster(feld) { const x = fensterUrl('feld', feld); const w = oeffnen(x.url, x.id); if (!w) A.melde(T('flBlockiert')); return !!w; }
function bereichFenster() { const x = fensterUrl('bereich'); const w = oeffnen(x.url, x.id); if (!w) A.melde(T('flBlockiert')); return !!w; }
function flaecheSpeichern() {
const l = lebend().filter((x) => x.rolle === 'fenster' && x.url).map((x) => ({ url: x.url, g: x.g, b: x.b, titel: x.titel, bs: x.bs || null }));
if (!l.length) { A.melde(T('flNichts')); return 0; }
A.merke('w23.flaeche', JSON.stringify({ zeit: Date.now(), haupt: { x: W.screenX, y: W.screenY, w: W.outerWidth, h: W.outerHeight }, fenster: l }));
A.melde(T('flGespeichert', l.length)); return l.length;
}
function flaecheLesen() { try { const x = JSON.parse(A.lies('w23.flaeche') || 'null'); return x && Array.isArray(x.fenster) ? x : null; } catch (e) { return null; } }
function flaecheOeffnen() {
const x = flaecheLesen(); if (!x || !x.fenster.length) { A.melde(T('flLeer')); return 0; }
const offen = new Set(lebend().map((y) => y.url));
F.warte = x.fenster.filter((f) => /^https?:|^file:/.test(f.url) && !offen.has(f.url)).map((f) => { const u = new URL(f.url, location.href); return { ...f, id: u.searchParams.get('w23f') || neueId(), url: u.href }; });
F.warteN = F.warte.length;
naechstes();
return F.warteN;
}
function naechstes() {
let n = 0;
while (F.warte && F.warte.length) {
const f = F.warte[0], w = oeffnen(f.url, f.id, f.b);
if (!w) break;
F.warte.shift(); n++;
}
flaecheTafel(n === 0 && F.warte && F.warte.length === F.warteN);
return n;
}
function flaecheTafel(blockiert) {
let t = D.getElementById('w23-tafel');
if (!F.warte || !F.warte.length) { if (t) { t.querySelector('p').textContent = T('flFertig', F.warteN || 0); setTimeout(() => t.remove(), 4000); } F.warte = null; return; }
if (!t) { t = roh(el('div', 'w23-tafel')); t.id = 'w23-tafel'; t.setAttribute('role', 'dialog'); t.append(roh(el('p')), roh(el('button', 'w23-weiter')), roh(el('button', 'w23-x', '×'))); D.body.append(t);
t.querySelector('.w23-weiter').addEventListener('click', naechstes); t.querySelector('.w23-x').addEventListener('click', () => { F.warte = null; t.remove(); }); }
t.querySelector('p').textContent = (blockiert ? T('flBlockiert') + ' ' : '') + T('flPopup');
const b = t.querySelector('.w23-weiter'); b.type = 'button'; b.textContent = T('flNaechstes', F.warteN - F.warte.length + 1, F.warteN);
b.focus();
}
function alleZu() { senden({ t: 'zu' }); for (const w of F.offen) try { w.close(); } catch (e) {   } F.offen = []; }
async function bildschirme() {
if (!W.getScreenDetails) { A.melde(T('flBildschirmeNein')); return 0; }
try { const d = await W.getScreenDetails(); F.bs = d.screens.length; A.melde(T('flBildschirmeJa', d.screens.length)); return d.screens.length; } catch (e) { A.melde(T('flBildschirmeNein')); return 0; }
}
function zurueck() {
const o = W.opener;
if (o && !o.closed) { try { o.focus(); } catch (e) {   } senden({ t: 'fokus' }); setTimeout(() => W.close(), 60); return true; }
A.melde(T('hauptFehlt')); return false;
}
function gruppeSetzen(g) {
if (!GRUPPEN.includes(g)) return;
F.gruppe = g; A.merke('w23.g.' + (F.rolle === 'haupt' ? 'haupt' : F.id), g);
const k = D.getElementById('w23-gruppe'); if (k) { k.value = g; k.style.setProperty('--w23-g', GRUPPE_FARBE[g]); }
hallo();
}
function kopfBauen() {
const h = D.querySelector('header.leiste'); if (!h || D.getElementById('w23-kopf')) return;
const k = roh(el('div', 'w23-kopf')); k.id = 'w23-kopf';
const g = roh(el('select', 'w23-gruppe')); g.id = 'w23-gruppe'; g.title = T('gruppeT'); g.setAttribute('aria-label', T('gruppe'));
for (const x of GRUPPEN) { const o = roh(el('option', '', x === 'frei' ? T('gFrei') : T('gruppe') + ' ' + T('g' + x))); o.value = x; g.append(o); }
g.addEventListener('change', () => gruppeSetzen(g.value));
const s = roh(el('button', 'w23-schild stand')); s.type = 'button'; s.id = 'w23-schild'; s.dataset.z = 'laedt';
s.addEventListener('click', () => { const sec = fensterKachel(); if (sec) erklaerung(sec, s); });
const z = roh(el('button', 'w23-zurueck', T('zurueck'))); z.type = 'button'; z.title = T('zurueckT'); z.addEventListener('click', zurueck);
k.append(g, s, z); h.append(k);
D.documentElement.classList.add('w23-fenster', F.bereich ? 'w23-bereich' : 'w23-kachel');
gruppeSetzen(F.gruppe);
}
const fensterKachel = () => (A.solo() ? A.abSec(A.solo()) : [...D.querySelectorAll('main.raster > section.feld')].find(sichtbar));
function kopfAuffrischen() {
const s = D.getElementById('w23-schild'); if (!s) return;
const sec = fensterKachel(), q = sec && sec.querySelector(':scope > .feld-kopf > .qs');
const t = q ? q.textContent : '', z = q ? q.dataset.z || '' : 'laedt';
if (s.textContent !== t) s.textContent = t; if (s.dataset.z !== z) s.dataset.z = z;
const ti = T('fensterTitel', fensterTitel() + ' · ' + A.anzeige(A.coin())); if (D.title !== ti) D.title = ti;
}

const BOERSEN = [
{ id: 'hyperliquid', n: 'Hyperliquid', url: (m) => 'https://app.hyperliquid.xyz/trade/' + m.hl, alle: true },
{ id: 'okx', n: 'OKX', url: (m) => 'https://www.okx.com/trade-spot/' + m.basis.toLowerCase() + '-usdt' },
{ id: 'bybit', n: 'Bybit', url: (m) => 'https://www.bybit.com/en/trade/spot/' + m.basis + '/USDT' },
];
function boerseWahl() { const x = A.lies('w23.boerse'); return BOERSEN.find((b) => b.id === x) || BOERSEN[0]; }
function boerseFuer(id) {
const m = A.markt(id), w = boerseWahl(), nurHl = !!m.tf, b = nurHl && !w.alle ? BOERSEN[0] : w;
if (!/^[A-Za-z0-9:]{1,30}$/.test(m.hl) || !/^[A-Z0-9]{1,20}$/.test(m.basis)) return null;
return { b, url: b.url(m), nurHl: nurHl && b !== w, markt: m.name };
}
function boerseLink(a, id) {
const x = boerseFuer(id); if (!x) { a.hidden = true; return; }
a.hidden = false; a.href = x.url; a.target = '_blank'; a.rel = 'noopener noreferrer';
const t = a.classList.contains('w23-bk-kurz') ? T('bKurz', x.b.n) : T('bOeffnen', x.b.n);
if (a.dataset.t !== t) {
a.dataset.t = t; const k = t.replace(/^\u2197\s*/, ''); a.replaceChildren();
if (k !== t) a.insertAdjacentHTML('beforeend', '<svg viewBox="0 0 10 10" width="9" height="9" aria-hidden="true" style="margin-right:4px"><path d="M2 8 8 2M3.5 2H8v4.5" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>');
a.append(k);
}
a.title = T('bMarkt', x.markt, x.b.n) + ' – ' + T('bSatz') + (x.nurHl ? ' ' + T('bNurHl') : '');
a.setAttribute('aria-label', T('bOeffnen', x.b.n) + ': ' + x.markt);
}
function boerseBauen() {
const kurs = D.querySelector('header.leiste .kurs');
if (kurs && !D.getElementById('w23-bk-kopf')) { const a = roh(el('a', 'w23-bk w23-bk-kurz')); a.id = 'w23-bk-kopf'; kurs.after(a); }
const form = D.getElementById('hd-form'), senden0 = D.getElementById('hd-senden');
if (form && senden0 && !D.getElementById('w23-bk-ticket')) {
const box = roh(el('div', 'w23-boerse')), a = roh(el('a', 'w23-bk')), s = roh(el('select', 'w23-bk-wahl')), p = roh(el('p', 'leise w23-bk-satz', T('bSatz')));
a.id = 'w23-bk-ticket'; s.id = 'w23-bk-wahl'; s.setAttribute('aria-label', T('bWahl')); s.title = T('bWahl');
for (const b of BOERSEN) { const o = roh(el('option', '', b.n)); o.value = b.id; s.append(o); }
s.value = boerseWahl().id;
s.addEventListener('change', () => { A.merke('w23.boerse', s.value); boerseAuffrischen(); });
box.append(a, s, p); senden0.after(box);
}
boerseAuffrischen();
}
function boerseAuffrischen() {
const k = D.getElementById('w23-bk-kopf'); if (k) boerseLink(k, A.coin());
const t = D.getElementById('w23-bk-ticket'); if (t) boerseLink(t, A.ticketMarkt() || A.coin());
const s = D.getElementById('w23-bk-wahl'); if (s && s.value !== boerseWahl().id) s.value = boerseWahl().id;
}

const FEST = {
fx: { q: 'qEzb', takt: 'tTaeglich', um: '16:00' }, wanl: { q: 'qAnleihen', takt: 'tMonat' }, behoerden: { q: 'qMakro', takt: 'tMonat' },
n1s: { q: 'qNews', takt: 'tMehrmals' }, n1l: { q: 'qBericht', takt: 'tZweimal' },
};
const LS = new WeakMap();
const ls = (sec) => { let x = LS.get(sec); if (!x) { x = { z: 0, iv: [], seit: 0, st: [] }; LS.set(sec, x); } return x; };
function liveNamen() { return [...D.querySelectorAll('#quellen > li.live')].map((x) => x.textContent.trim()).filter(Boolean); }
function verzWerte(namen) {
const v = A.verz(), wort = new Set(namen.map((n) => n.split(' ')[0])), l = [];
for (const [q, a] of Object.entries(v)) if (wort.has(q.split(' ')[0])) l.push(...a.slice(-600));
return l;
}
function verzMittel(namen) { const l = verzWerte(namen).slice(-50); return l.length >= 5 ? l.reduce((s, x) => s + x, 0) / l.length : null; }
function taktVon(x) {
if (x.iv.length < 3) return null;
const m = median(x.iv), lo = Math.min(...x.iv), hi = Math.max(...x.iv);
return m >= 4000 && hi <= m * 2.5 && lo >= m / 2.5 ? m : null;
}
function taktText(ms) { const s = ms / 1000; return dauer(s < 60 ? Math.round(s / 5) * 5000 || 5000 : s < 3600 ? Math.round(s / 60) * 60000 : Math.round(s / 3600) * 3600000); }
function schild(sec, x, t) {
if (!x || x.z === 'demo') return t;
const id = A.feldId(sec), s = ls(sec), jetzt = Date.now(), z = A.zeit(sec) || 0, live = !!(x.verz || x.z === 'live' || (x.z === 'verzoegert' && A.liveFeld(id)));
if (z && z !== s.z) { if (s.z) { s.iv.push(z - s.z); if (s.iv.length > 8) s.iv.shift(); } s.z = z; }
const gestoert = x.z === 'aus' || (live && x.z === 'verzoegert');
if (gestoert) { if (!s.seit) { s.seit = jetzt; s.st.push(jetzt); } return T('lGestoert', dauer(jetzt - s.seit)); }
s.seit = 0;
if (x.z === 'live') { const m = verzMittel(liveNamen()); return m == null ? T('lLiveOhne') : T('lLive', sek(m)); }
if (x.z === 'aktuell' || x.z === 'verzoegert') {
const f = FEST[id];
if (f) return f.um ? T('lStand', f.um, T(f.q) + ', ' + T(f.takt)) : T('lStandOhne', T(f.takt));
const k = taktVon(s); if (k) return T('lTakt', taktText(k));
}
return t;
}
const AB = new Map();
function abrufBuchen(h, pfad, t0, ok) {
let x = AB.get(h); if (!x) { x = { n: 0, fehl: [], letzt: 0, dauer: [], pfad: new Map(), iv: [] }; AB.set(h, x); }
const jetzt = Date.now(); x.n++;
x.dauer.push(performance.now() - t0); if (x.dauer.length > 50) x.dauer.shift();
if (ok) { x.letzt = jetzt; const v = x.pfad.get(pfad); if (v) { x.iv.push(jetzt - v); if (x.iv.length > 20) x.iv.shift(); } x.pfad.set(pfad, jetzt); if (x.pfad.size > 40) x.pfad.delete(x.pfad.keys().next().value); }
else { x.fehl.push(jetzt); if (x.fehl.length > 60) x.fehl.shift(); }
}
function abrufeMessen() {
const f0 = W.fetch; if (!f0 || f0.__w23) return;
const neu = function (u, o) {
const t0 = performance.now(), p = f0.call(this, u, o);
let h = '', pfad = '';
try { const x = new URL(String((u && u.url) || u), location.href); h = x.hostname; pfad = x.pathname; } catch (e) {   }
if (h && h !== location.hostname) p.then((r) => abrufBuchen(h, pfad, t0, r.ok), (e) => { if (!/Lizenz/.test(String(e && e.message))) abrufBuchen(h, pfad, t0, false); });
return p;
};
neu.__w23 = true; W.fetch = neu;
}
const WS_ST = new Map();
function wsBeobachten() {
const st = A.status() || {};
for (const [n, z] of Object.entries(st)) {
let x = WS_ST.get(n); if (!x) { x = { live: false, stoer: [] }; WS_ST.set(n, x); }
if (z === 'live') x.live = true; else if (x.live && z === 'aus') { x.live = false; x.stoer.push(Date.now()); if (x.stoer.length > 60) x.stoer.shift(); }
}
}
const NAMEN = { 'api.bybit.com': 'Bybit', 'api.binance.com': 'Binance', 'fapi.binance.com': 'Binance Futures', 'api.hyperliquid.xyz': 'Hyperliquid', 'stats-data.hyperliquid.xyz': 'Hyperliquid',
'data-api.ecb.europa.eu': 'EZB', 'ec.europa.eu': 'Eurostat', 'api.statistiken.bundesbank.de': 'Bundesbank', 'api.worldbank.org': 'World Bank', 'sdmx.oecd.org': 'OECD',
'home.treasury.gov': 'U.S. Treasury', 'api.fiscaldata.treasury.gov': 'FiscalData', 'api.bls.gov': 'BLS', 'markets.newyorkfed.org': 'New York Fed', 'www.federalregister.gov': 'Federal Register',
'api.alternative.me': 'alternative.me', 'publicreporting.cftc.gov': 'CFTC', 'api.dexscreener.com': 'DEX Screener', 'api.github.com': 'GitHub', 'api.gdeltproject.org': 'GDELT' };
function erklaerung(sec, anker) {
zu();
const id = A.feldId(sec), x = A.status10(sec), s = ls(sec), f = FEST[id], live = x.z === 'live' || A.liveFeld(id), namen = liveNamen(), jetzt = Date.now();
const box = roh(el('div', 'w23-erkl')); box.id = 'w23-erkl'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-label', T('pTitel', A.feldTitel(id)));
box.append(roh(el('b', '', T('pTitel', A.feldTitel(id)))));
const dl = roh(el('dl'));
const zeile = (k, v) => dl.append(roh(el('dt', '', k)), roh(el('dd', '', v)));
const qz = sec.querySelector('.mz-quelle, .quelle, .mz-fuss');
zeile(T('pQuelle'), live && namen.length ? namen.join(', ') : f ? T(f.q) : qz && qz.textContent.trim() ? qz.textContent.replace(/\s+/g, ' ').trim().slice(0, 140) : T('qSiehe'));
const k = taktVon(s);
zeile(T('pTakt'), live ? T('tLive') : f ? (f.um ? T('tTaeglichUm', f.um) : T(f.takt)) : k ? T('tAbruf', taktText(k)) : T('tAbrufUnbekannt'));
const an = live ? Math.max(0, ...namen.map((n) => A.zuletzt()[n] || 0)) : (A.zeit(sec) || 0);
zeile(T('pAnkunft'), an ? T('pVor', uhr(an), dauer(jetzt - an)) : T('pNie'));
const v = live ? verzWerte(namen) : [];
zeile(T('pVerz'), v.length >= 5 ? T('pVerzWert', sek(v.slice(-50).reduce((a, b) => a + b, 0) / Math.min(50, v.length)), sek(quantil(v, 0.5)), sek(quantil(v, 0.95)), v.length) : live ? T('pNie') : T('pVerzKeine'));
const st = s.st.filter((t) => jetzt - t < 36e5).length + (live ? namen.reduce((a, n) => a + ((WS_ST.get(n) || { stoer: [] }).stoer.filter((t) => jetzt - t < 36e5).length), 0) : 0);
zeile(T('pStoer'), String(st));
box.append(dl, roh(el('p', 'leise', T('pSo'))));
const alle = roh(el('button', 'mehr', T('pAlle'))); alle.type = 'button'; alle.addEventListener('click', () => { zu(); A.eigen('dquellen'); });
const x2 = roh(el('button', 'w23-x', '×')); x2.type = 'button'; x2.setAttribute('aria-label', T('pZu')); x2.addEventListener('click', zu);
box.append(alle, x2); D.body.append(box);
const r = anker.getBoundingClientRect(), bw = Math.min(360, innerWidth - 16);
box.style.width = bw + 'px'; box.style.left = Math.max(8, Math.min(innerWidth - bw - 8, r.right - bw)) + 'px'; box.style.top = Math.min(innerHeight - 40, r.bottom + 6) + 'px';
if (box.getBoundingClientRect().bottom > innerHeight - 8) box.style.top = Math.max(8, r.top - box.offsetHeight - 6) + 'px';
x2.focus();
setTimeout(() => D.addEventListener('pointerdown', aussen, true), 0);
}
function aussen(e) { const b = D.getElementById('w23-erkl'); if (b && !b.contains(e.target)) zu(); }
function zu() { const b = D.getElementById('w23-erkl'); if (b) b.remove(); D.removeEventListener('pointerdown', aussen, true); }
function quellenZeilen() {
const jetzt = Date.now(), z = [], verz = A.verz(), zuletzt = A.zuletzt();
for (const [n, x] of WS_ST) {
const v = Object.entries(verz).filter(([q]) => q.split(' ')[0] === n.split(' ')[0]).flatMap(([, a]) => a.slice(-600));
z.push({ q: n, art: T('kWs'), verz: v.length >= 5 ? [v.slice(-50).reduce((a, b) => a + b, 0) / Math.min(50, v.length), quantil(v, 0.5), quantil(v, 0.95)] : null,
takt: x.live || x.stoer.length || zuletzt[n] ? T('tLive') : T('kNie'), an: zuletzt[n] || 0, st: x.stoer.filter((t) => jetzt - t < 36e5).length, live: (A.status() || {})[n] === 'live' });
}
for (const [h, x] of AB) {
const k = x.iv.length >= 2 ? median(x.iv) : null;
z.push({ q: (NAMEN[h] === 'EZB' && A.sprache() !== 'de' ? 'ECB' : NAMEN[h] || h) + (NAMEN[h] ? ' · ' + h : ''), art: T('kAbruf'), antwort: median(x.dauer), takt: k ? T('tAbruf', taktText(k)) : T('tAbrufUnbekannt'), an: x.letzt, st: x.fehl.filter((t) => jetzt - t < 36e5).length, live: x.letzt > 0 });
}
return z;
}
function quellenZeigen() {
const sec = A.abSec('dquellen'), box = D.getElementById('dquellen-inhalt'); if (!sichtbar(sec) || !box) return;
const z = quellenZeilen(), jetzt = Date.now();
if (!z.length) { if (!box.querySelector('.w17-z')) { const q = roh(el('div', 'w17-z')); q.dataset.z = 'leer'; q.append(el('i'), roh(el('p', '', T('kLeer')))); box.replaceChildren(q); } return; }
const t = roh(el('table', 'dquellen-tab')), kopf = roh(el('tr'));
for (const k of ['kQuelle', 'kArt', 'kVerz', 'kTakt', 'kAnkunft', 'kStoer']) kopf.append(roh(el('th', '', T(k))));
const th = roh(el('thead')); th.append(kopf); const tb = roh(el('tbody'));
for (const r of z) {
const tr = roh(el('tr', r.st ? 'dquellen-stoer' : '')), v = r.verz ? r.verz.map(sek).join(' · ') : r.antwort != null ? '↔\uFE0E ' + Math.round(r.antwort) + ' ms' : '–';
for (const c of [r.q, r.art, v, r.takt, r.an ? T('pVor', uhr(r.an), dauer(jetzt - r.an)) : T('pNie'), String(r.st)]) tr.append(roh(el('td', '', c)));
tb.append(tr);
}
t.append(th, tb);
const l = lebend(), rolle = l.length ? (ichLeiter() ? T('kLeiter') : T('kFolger')) : T('kAllein');
const fuss = roh(el('p', 'leise mz-quelle', T('kSo') + ' · ' + T('kFuss', dauer(jetzt - F.start)) + ' ' + T('kFenster', l.length + 1, rolle)));
box.replaceChildren(t, fuss);
}
function quellenKachel() {
const sec = A.abSec('dquellen'); if (!sec || sec.dataset.w23) return; sec.dataset.w23 = '1';
const h = sec.querySelector('h2'); if (h) { h.textContent = T('kTitel'); roh(h); }
const kopf = sec.querySelector(':scope > .feld-kopf');
if (kopf && !kopf.querySelector('.was')) {
const was = roh(el('button', 'was', '?')); was.type = 'button'; was.dataset.hilfe = 'dquellen'; was.setAttribute('aria-expanded', 'false');
const hilfe = roh(el('div', 'hilfe')); hilfe.id = 'h-dquellen'; hilfe.hidden = true; for (const p of T('kHilfe').split('\n')) hilfe.append(roh(el('p', '', p)));
hilfe.append(roh(el('p', 'leise', T('kLatenz'))));
was.addEventListener('click', () => { hilfe.hidden = !hilfe.hidden; was.setAttribute('aria-expanded', String(!hilfe.hidden)); });
kopf.append(was); kopf.after(hilfe);
}
}

function start(api) {
A = api;
const g = A.lies('w23.g.' + (F.rolle === 'haupt' ? 'haupt' : F.id)) || Q.get('w23g'); F.gruppe = GRUPPEN.includes(g) ? g : 'A';
F.letzt = { coin: A.coin(), fz: A.fenster(), tf: A.tf() };
try { F.bc = 'BroadcastChannel' in W ? new BroadcastChannel('ryvo-w23') : null; if (F.bc) F.bc.onmessage = (e) => empfangen(e.data); } catch (e) { F.bc = null; }
addEventListener('storage', (e) => {
if (e.key === 'profi.w23.bus' && e.newValue) { try { empfangen(JSON.parse(e.newValue)); } catch (x) {   } }
if (e.key === 'profi.sprache' && e.newValue && e.newValue !== A.sprache()) location.reload();
});
addEventListener('message', (e) => {
const m = e.data && e.data.w23; if (!m || typeof m !== 'object' || (e.source !== W.opener && !F.offen.includes(e.source))) return;
const neu = !!m.n && !F.gesehen.includes(m.n); empfangen(m); if (neu) direkt(m, e.source);
});
addEventListener('pagehide', () => senden({ t: 'tschuess' }));
D.addEventListener('keydown', (e) => { if (e.key === 'Escape') zu(); });
D.addEventListener('click', (e) => {
const q = e.target.closest && e.target.closest('main.raster > section.feld > .feld-kopf > .qs'); if (!q) return;
e.stopPropagation(); erklaerung(q.closest('section.feld'), q);
}, true);
if (F.rolle === 'fenster') kopfBauen();
abrufeMessen(); boerseBauen(); quellenKachel();
hallo(); setInterval(hallo, 2000);
setInterval(() => { try { takt(); } catch (e) {   } }, 400);
setInterval(() => { if (D.hidden) return; wsBeobachten(); kopfAuffrischen(); quellenZeigen(); boerseAuffrischen(); for (const q of D.querySelectorAll('main.raster > section.feld > .feld-kopf > .qs:not([tabindex])')) { q.tabIndex = 0; q.setAttribute('role', 'button'); } }, 1000);
}
W.RYVO_W23 = {
start, T, schild, fassung: 'w23-1',
kachelFenster, bereichFenster, flaecheSpeichern, flaecheOeffnen, naechstes, alleZu, bildschirme, zurueck, gruppeSetzen,
tiefeVon: (wo, c) => { const x = F.tiefe[wo]; return !ichLeiter() && !!x && x.c === c && Date.now() - x.at < 9000; },
tiefeTeilen: (wo, c, d) => { if (!ichLeiter() || !d || !lebend().some((x) => x.coin === c)) return false; senden({ t: 'tiefe', wo, c, d }, true); return true; },
boerseFuer, boersen: () => BOERSEN.map((b) => ({ id: b.id, n: b.n })), quellen: quellenZeilen,
zustand: () => ({ id: F.id, rolle: F.rolle, gruppe: F.gruppe, leiter: ichLeiter(), andere: lebend().map((x) => ({ id: x.von, rolle: x.rolle, g: x.g, coin: x.coin, ziel: x.ziel })), warte: F.warte ? F.warte.length : 0 }),
};
})(window);

