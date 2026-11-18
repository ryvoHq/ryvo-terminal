
(function (W) {
'use strict';
const SPRACHEN = ['de', 'en', 'es', 'fr', 'it', 'tr'];
const THEMEN = ['behoerden', 'regulierung', 'krypto', 'zinsen', 'inflation', 'arbeitsmarkt', 'oel'];
const ABSCHNITTE = ['lage', 'beide_seiten', 'widersprueche', 'termine', 'entscheidet'];
const TAKT_MS = 5 * 60 * 1000, PRUEF_MS = 30 * 1000;
const S_MAX_ALTER = 4 * 3600, L_MAX_ALTER = 18 * 3600;
const S_ERST = 8;
const GDELT = 'https://www.gdeltproject.org/';
const AMT_OBEN = 3;
const THEMA_KLASSE = { behoerden: 'nk-regulierung', regulierung: 'nk-regulierung', krypto: 'nk-schlagzeile', zinsen: 'nk-boerse', inflation: 'nk-boerse', arbeitsmarkt: 'nk-boerse', oel: 'nk-boerse' };

const spr = (o) => { const s = (o && o.sprache) || (document.documentElement.lang || 'de').slice(0, 2); return SPRACHEN.includes(s) ? s : 'en'; };
function T(sp, k, ...a) {
const tx = W.RYVO_N1_TEXTE || {}, v = (tx[sp] && tx[sp][k] !== undefined ? tx[sp][k] : (tx.en && tx.en[k] !== undefined ? tx.en[k] : k));
return String(v).replace(/\{(\d)\}/g, (_, i) => (a[+i] === undefined ? '' : String(a[+i])));
}
function sicherUrl(u) {
if (typeof u !== 'string' || u.length > 600 || /[\s\u0000-\u001f"'<>\x60\\]/.test(u)) return null;
try { const x = new URL(u); return x.protocol === 'https:' && !x.username && !x.password && x.hostname.includes('.') ? x.href : null; } catch (e) { return null; }
}
function alter(t, jetzt, sp) {
const s = Math.max(0, Math.floor(jetzt - t));
if (s < 90) return T(sp, 'alter.jetzt');
if (s < 3600) return T(sp, 'alter.min', Math.round(s / 60));
if (s < 86400) return T(sp, 'alter.std', Math.floor(s / 3600));
return T(sp, 'alter.tag', Math.floor(s / 86400));
}
function uhr(t, mitDatum) {
const d = new Date(t * 1000), z = (n) => String(n).padStart(2, '0');
return (mitDatum ? z(d.getUTCDate()) + '.' + z(d.getUTCMonth() + 1) + '. ' : '') + z(d.getUTCHours()) + ':' + z(d.getUTCMinutes()) + ' UTC';
}
function datum(t, genau) { return genau === false ? uhr(t, true).slice(0, 6) : uhr(t, true); }
function schlagzeilenSaeubern(d) {
if (!d || typeof d !== 'object' || !Array.isArray(d.eintraege)) return null;
const ein = [];
for (const e of d.eintraege.slice(0, 200)) {
if (!e || typeof e.titel !== 'string' || typeof e.zeit !== 'number') continue;
const url = sicherUrl(e.url); if (!url) continue;
ein.push({ titel: e.titel.slice(0, 300), url, quelle: String(e.quelle || '').slice(0, 60), zeit: e.zeit,
themen: (Array.isArray(e.themen) ? e.themen : []).filter((x) => THEMEN.includes(x)),
coins: (Array.isArray(e.coins) ? e.coins : []).filter((x) => typeof x === 'string' && /^[A-Z0-9]{2,10}$/.test(x)).slice(0, 8), sprache: e.sprache === 'de' ? 'de' : '' });
}
return { stand: typeof d.stand === 'number' ? d.stand : 0, fehler: typeof d.fehler === 'string' ? d.fehler.slice(0, 300) : null, eintraege: ein, privat: !!d.privat };
}
function ordnen(ein, thema, coin, jetzt = Date.now() / 1000) {
const f = ein.filter((e) => (!thema || e.themen.includes(thema)) && (!coin || e.coins.includes(coin)));
const neu = (a, b) => b.zeit - a.zeit || (a.url < b.url ? -1 : 1);
if (thema || coin) return f.sort(neu);
const oben = f.filter((e) => e.themen.includes('behoerden') && e.zeit >= jetzt - 86400).sort(neu).slice(0, AMT_OBEN);
return oben.concat(f.filter((e) => !oben.includes(e)).sort(neu));
}
function coinsZaehlen(ein, n = 8) {
const z = new Map(); for (const e of ein) for (const c of e.coins) z.set(c, (z.get(c) || 0) + 1);
return [...z.entries()].sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1)).slice(0, n).map((x) => x[0]);
}
function lageSprache(d, sp) {
const hat = (s) => d && d.abschnitte && d.abschnitte.every((a) => (a.zeilen || []).every((z) => z.text && typeof z.text[s] === 'string' && z.text[s]));
if (sp === 'de') return { sp: 'de', hinweis: '' };
if (hat('en')) return { sp: 'en', hinweis: sp === 'en' ? '' : 'lage.nur_en' };
return { sp: 'de', hinweis: 'lage.nur_de' };
}
const frisch = (stand, jetzt, max) => !!stand && jetzt - stand <= max;

function laden(pfad) {
if (!/^[a-z0-9_\-/]+\.json$/i.test(pfad) || /^\/\//.test(pfad)) return Promise.reject(new Error('nur eigener Ursprung'));
return fetch(pfad + '?v=' + Math.floor(Date.now() / TAKT_MS), { cache: 'no-cache', credentials: 'omit', redirect: 'error' })
.then((r) => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); });
}
const sichtbar = (el) => el.isConnected && document.visibilityState !== 'hidden' && el.getClientRects().length > 0;
function taktgeber(el, holen, zeigen, fehler) {
let zuletzt = 0, laeuft = false, aus = false;
const versuch = (zwingend) => {
if (aus || laeuft || (!zwingend && (!sichtbar(el) || Date.now() - zuletzt < TAKT_MS))) return;
laeuft = true; zuletzt = Date.now();
Promise.resolve().then(holen).then((d) => { if (!aus) zeigen(d); }, (e) => { if (!aus) fehler(e); }).then(() => { laeuft = false; });
};
const iv = setInterval(() => versuch(false), PRUEF_MS);
const sicht = () => versuch(false);
document.addEventListener('visibilitychange', sicht);
let io = null;
if (W.IntersectionObserver) { io = new IntersectionObserver((x) => { if (x.some((y) => y.isIntersecting)) versuch(false); }); io.observe(el); }
return { jetzt: () => versuch(true), pruefe: () => versuch(false), stopp: () => { aus = true; clearInterval(iv); document.removeEventListener('visibilitychange', sicht); if (io) io.disconnect(); } };
}

function E(tag, klasse, text) { const x = document.createElement(tag); x.dataset.roh = ''; if (klasse) x.className = klasse; if (text !== undefined && text !== null) x.textContent = String(text); return x; }
function link(url, text, sp) {
const u = sicherUrl(url); if (!u) return E('span', '', text);
const a = E('a', '', text); a.href = u; a.target = '_blank'; a.rel = 'noopener noreferrer'; a.title = T(sp, 'neuer.tab'); return a;
}
function knopfGruppe(label, werte, aktiv, beiWahl) {
const g = E('div', 'zoom'); g.setAttribute('role', 'group'); g.setAttribute('aria-label', label);
for (const [wert, text] of werte) {
const b = E('button', '', text); b.type = 'button'; b.setAttribute('aria-pressed', String(wert === aktiv));
if (wert === aktiv) b.className = 'an';
b.addEventListener('click', () => beiWahl(wert)); g.append(b);
}
return g;
}
function kiMarke(sp) {
const b = E('button', 'ki-marke'), h = E('p', 'ki-hilfe', T(sp, 'ki.hilfe')); b.append(E('span', '', T(sp, 'ki.marke')));
b.type = 'button'; b.title = T(sp, 'ki.hilfe'); b.setAttribute('aria-label', T(sp, 'ki.label')); b.setAttribute('aria-expanded', 'false'); h.hidden = true; h.setAttribute('role', 'note');
b.addEventListener('click', (e) => { e.stopPropagation(); h.hidden = !h.hidden; b.setAttribute('aria-expanded', String(!h.hidden)); });
return [b, h];
}
function kopf(el, titel, sp, hilfeKey, standEl, ki) {
const k = E('div', 'feld-kopf'), h = E('h2', '', titel), was = E('button', 'was', T(sp, 'was')), hilfe = E('div', 'hilfe');
was.type = 'button'; was.setAttribute('aria-expanded', 'false'); hilfe.hidden = true; hilfe.append(E('p', '', T(sp, hilfeKey)));
was.addEventListener('click', () => { hilfe.hidden = !hilfe.hidden; was.setAttribute('aria-expanded', String(!hilfe.hidden)); });
const m = ki ? kiMarke(sp) : null; if (m) h.append(' ', m[0]);
k.append(h); if (standEl) k.append(standEl); k.append(was); el.append(k, hilfe); if (m) el.append(m[1]);
}
function pflichtGdelt(sp) {
const p = E('p', 'leise stand n1-pflicht'), teile = T(sp, 'pflicht.gdelt', '\u0000').split('\u0000');
p.append(document.createTextNode(teile[0] || ''), link(GDELT, 'GDELT Project', sp), document.createTextNode(teile[1] || ''));
p.append(E('br'), document.createTextNode(T(sp, 'pflicht.amtlich')));
return p;
}

function schlagzeilen(el, o = {}) {
const sp = spr(o), jetzt = o.jetzt || (() => Date.now() / 1000), holen = o.laden || (() => laden(o.pfad || 'daten/schlagzeilen.json'));
const zustand = { d: null, thema: '', coin: '', altZeigen: false, fehler: null, alle: false };
el.replaceChildren(); el.classList.add('n1-schlagzeilen');
const stand = E('span', 'stand'); kopf(el, T(sp, 'titel.schlagzeilen') + (o.privat ? ' · ' + T(sp, 'privat') : ''), sp, 'hilfe.schlagzeilen', stand);
const filter = E('div', 'news-filter'), meldung = E('p', 'ausfall-text'), liste = E('ol', 'ereignisse news-liste n1-liste'), fuss = pflichtGdelt(sp);
meldung.setAttribute('role', 'status'); meldung.hidden = true; liste.setAttribute('aria-live', 'polite');
el.append(filter, meldung, liste, fuss);
function zeile(e, j) {
const li = E('li'), t = E('time', '', alter(e.zeit, j, sp)); t.dateTime = new Date(e.zeit * 1000).toISOString(); t.title = uhr(e.zeit, true);
const th = e.themen[0] || 'krypto', thema = E('span', 'nk ' + (THEMA_KLASSE[th] || ''), T(sp, 'thema.' + th));
const coins = E('span', 'nk', e.coins.slice(0, 3).join(' ')), div = E('div');
const a = link(e.url, e.titel, sp); if (e.sprache) a.lang = e.sprache;
div.append(a, E('small', 'leise', e.quelle + (e.sprache && sp !== e.sprache ? ' · ' + e.sprache.toUpperCase() : '')));
li.append(t, thema, coins, div); return li;
}
function zeigen() {
const d = zustand.d, j = jetzt();
const ok = d && frisch(d.stand, j, S_MAX_ALTER);
stand.textContent = d && d.stand ? T(sp, 'stand', uhr(d.stand, true)) : '';
meldung.hidden = true; meldung.title = '';
if (!d) { meldung.textContent = T(sp, 'fehlt'); meldung.hidden = false; }
else if (!ok) { meldung.textContent = T(sp, 'alt', uhr(d.stand, true)); meldung.hidden = false; }
else if (d.fehler) { meldung.textContent = T(sp, 'gestoert'); meldung.title = d.fehler; meldung.hidden = false; }
if (o.beiAusfall) try { o.beiAusfall(!ok); } catch (e) {   }
const ein = d ? d.eintraege : [];
const themen = THEMEN.filter((x) => ein.some((e) => e.themen.includes(x))), coins = coinsZaehlen(ein);
if (zustand.thema && !themen.includes(zustand.thema)) zustand.thema = '';
if (zustand.coin && !coins.includes(zustand.coin)) zustand.coin = '';
filter.replaceChildren(
knopfGruppe(T(sp, 'filter.thema'), [['', T(sp, 'thema.alle')], ...themen.map((x) => [x, T(sp, 'thema.' + x)])], zustand.thema, (w) => { zustand.thema = w; zeigen(); }),
...(coins.length ? [knopfGruppe(T(sp, 'filter.coin'), [['', T(sp, 'coin.alle')], ...coins.map((c) => [c, c])], zustand.coin, (w) => { zustand.coin = w; zeigen(); })] : []));
filter.hidden = !ein.length || (!ok && !zustand.altZeigen);
if (d && !ok && !zustand.altZeigen && ein.length) {
const b = E('button', 'mehr', T(sp, 'alt.zeigen')); b.type = 'button'; b.addEventListener('click', () => { zustand.altZeigen = true; zeigen(); });
const li = E('li', 'leise'); li.append(b); liste.replaceChildren(li); return;
}
const reihe = ordnen(ein.slice(), zustand.thema, zustand.coin, j);
const n = zustand.alle ? 80 : S_ERST, zeilen = reihe.slice(0, n).map((e) => zeile(e, j));
if (reihe.length > n && n < 80) { const b = E('button', 'mehr', T(sp, 'mehr.schlagzeilen', Math.min(80, reihe.length) - n)); b.type = 'button'; b.addEventListener('click', () => { zustand.alle = true; zeigen(); }); const li = E('li', 'leise'); li.append(b); zeilen.push(li); }
liste.replaceChildren(...(reihe.length ? zeilen : d ? [E('li', 'leise', T(sp, 'leer'))] : []));
liste.style.opacity = ok ? '' : '0.6';
}
const tg = o.laden === false ? null : taktgeber(el, holen, (roh) => { zustand.d = schlagzeilenSaeubern(roh); zeigen(); }, () => { if (!zustand.d) zeigen(); });
if (o.daten !== undefined) { zustand.d = schlagzeilenSaeubern(o.daten); zeigen(); } else if (tg) tg.pruefe();
const uhrTakt = setInterval(() => { if (zustand.d && sichtbar(el)) for (const t of liste.querySelectorAll('time')) { const z = Date.parse(t.dateTime) / 1000; if (z) t.textContent = alter(z, jetzt(), sp); } }, 60000);
return { element: el, aktualisiere(d) { zustand.d = schlagzeilenSaeubern(d); zeigen(); }, zustand: () => ({ ...zustand, n: zustand.d ? zustand.d.eintraege.length : 0 }),
entferne() { if (tg) tg.stopp(); clearInterval(uhrTakt); el.replaceChildren(); el.classList.remove('n1-schlagzeilen'); } };
}

function lageSaeubern(d) {
if (!d || typeof d !== 'object' || !Array.isArray(d.abschnitte)) return null;
const txt = (x) => (x && typeof x === 'object' ? Object.fromEntries(Object.entries(x).filter(([k, v]) => SPRACHEN.includes(k) && typeof v === 'string').map(([k, v]) => [k, v.slice(0, 800)])) : {});
const abschnitte = [];
for (const a of d.abschnitte.slice(0, 12)) {
if (!a || (!ABSCHNITTE.includes(a.id) && !d.privat)) continue;
const zeilen = [];
for (const z of (a.zeilen || []).slice(0, 20)) {
const text = txt(z && z.text); if (!text.de) continue;
zeilen.push({ text, seite: z.seite === 'dafuer' || z.seite === 'dagegen' ? z.seite : null, termin: typeof z.termin === 'number' ? z.termin : null,
schnitt: z.schnitt === 'nach' ? 'nach' : z.schnitt === 'vor' ? 'vor' : null,
quellen: (z.quellen || []).slice(0, 4).filter((q) => q && typeof q.name === 'string').map((q) => ({ name: q.name.slice(0, 80), url: sicherUrl(q.url), zeit: typeof q.zeit === 'number' ? q.zeit : null, genau: q.genau !== false })) });
}
if (zeilen.length || (d.privat && a.tabelle)) abschnitte.push({ id: String(a.id).slice(0, 30), titel: d.privat ? String(a.titel || a.id).slice(0, 120) : null, zeilen,
tabelle: d.privat && Array.isArray(a.tabelle) ? a.tabelle.slice(0, 14).map((r) => (Array.isArray(r) ? r.slice(0, 8).map((c) => String(c).slice(0, 120)) : [])) : null });
}
return { stand: typeof d.stand === 'number' ? d.stand : 0, schnitt: typeof d.recherche_schnitt === 'number' ? d.recherche_schnitt : null, titel: txt(d.titel), abschnitte, privat: !!d.privat };
}
function lageZeile(z, s, sp, mitSchnitt) {
const li = E('li', 'n1-lz'), t = E('div', '', z.text[s] || z.text.de);
li.append(t);
const q = E('small', 'leise');
z.quellen.forEach((x, i) => { if (i) q.append(document.createTextNode(' · ')); if (x.url) { const a = link(x.url, x.name, sp); a.style.color = 'inherit'; q.append(a); } else q.append(document.createTextNode(x.name)); if (x.zeit) q.append(document.createTextNode(' ' + datum(x.zeit, x.genau))); });
if (mitSchnitt && z.schnitt) q.append(document.createTextNode(' · ' + T(sp, z.schnitt === 'nach' ? 'lage.nach' : 'lage.vor')));
if (z.quellen.length || z.schnitt) li.append(q);
li.style.cssText = 'display:grid;gap:2px;padding:6px 0;border-top:1px solid var(--linie)';
return li;
}
function lagebrief(el, o = {}) {
const sp = spr(o), jetzt = o.jetzt || (() => Date.now() / 1000), holen = o.laden || (() => laden(o.pfad || 'daten/lagebrief.json'));
let d = null;
el.replaceChildren(); el.classList.add('n1-lage');
const stand = E('span', 'stand');
kopf(el, T(sp, 'titel.lage'), sp, 'hilfe.lage', stand, true);
const meldung = E('p', 'ausfall-text'), hinweis = E('p', 'leise'), privat = E('p', 'n1-privat'), inhalt = E('div', 'n1-lage-inhalt'), fuss = E('p', 'leise stand n1-pflicht');
meldung.setAttribute('role', 'status'); meldung.hidden = hinweis.hidden = privat.hidden = true;
privat.style.cssText = 'margin:6px 0;padding:6px 10px;border:1px solid var(--linie-hell);border-radius:8px;font-weight:600';
inhalt.style.cssText = 'overflow:auto;min-height:0';
el.append(fuss, privat, meldung, hinweis, inhalt);
function zeigen() {
const j = jetzt();
meldung.hidden = hinweis.hidden = true; privat.hidden = !(d && d.privat);
if (d && d.privat) privat.textContent = T(sp, 'privat') + ' – ' + T(sp, 'privat.hinweis');
fuss.textContent = T(sp, 'pflicht.lage');
if (!d || !d.abschnitte.length) { meldung.textContent = T(sp, 'lage.fehlt'); meldung.hidden = false; inhalt.replaceChildren(); stand.textContent = ''; return; }
const wahl = d.privat ? { sp: 'de', hinweis: sp === 'de' ? '' : 'lage.nur_de' } : lageSprache(d, sp);
stand.textContent = T(sp, 'stand', uhr(d.stand, true)) + (d.schnitt ? ' · ' + T(sp, 'lage.schnitt', uhr(d.schnitt, false)) : '');
if (!frisch(d.stand, j, L_MAX_ALTER)) { meldung.textContent = T(sp, 'lage.alt', uhr(d.stand, true)); meldung.hidden = false; }
if (wahl.hinweis && T(sp, wahl.hinweis)) { hinweis.textContent = T(sp, wahl.hinweis); hinweis.hidden = false; }
const teile = [];
if (d.titel[wahl.sp] || d.titel.de) teile.push(E('h3', 'n1-lt', d.titel[wahl.sp] || d.titel.de));
for (const a of d.abschnitte) {
const h = E('h3', '', a.titel || T(sp, 'abschnitt.' + a.id)), ul = E('ul', 'n1-lage-liste');
ul.style.cssText = 'list-style:none;padding:0;margin:0 0 10px';
h.style.cssText = 'margin:10px 0 2px;font-size:12px;letter-spacing:.04em;color:var(--leise)';
const reihe = a.id === 'beide_seiten' ? [...a.zeilen].sort((x, y) => (x.seite === y.seite ? 0 : x.seite === 'dafuer' ? -1 : 1)) : a.zeilen;
let seite = null;
for (const z of reihe) {
if (a.id === 'beide_seiten' && z.seite !== seite) { seite = z.seite; const s = E('li', 'leise', T(sp, seite === 'dafuer' ? 'lage.dafuer' : 'lage.dagegen')); s.style.cssText = 'font-weight:600;padding-top:4px'; ul.append(s); }
ul.append(lageZeile(z, wahl.sp, sp, !d.privat));
}
if (a.tabelle && a.tabelle.length) {
const tb = E('table', 'tabelle'), kopfZ = a.tabelle[0];
const tr0 = E('tr'); kopfZ.forEach((c) => tr0.append(E('th', '', c))); tb.append(tr0);
a.tabelle.slice(1).forEach((r) => { const tr = E('tr'); r.forEach((c) => tr.append(E('td', '', c))); tb.append(tr); });
ul.append(tb);
}
teile.push(h, ul);
}
inhalt.replaceChildren(...teile);
}
const tg = o.laden === false ? null : taktgeber(el, holen, (roh) => { d = lageSaeubern(roh); zeigen(); }, () => { if (!d) zeigen(); });
if (o.daten !== undefined) { d = lageSaeubern(o.daten); zeigen(); } else if (tg) tg.pruefe();
return { element: el, aktualisiere(x) { d = lageSaeubern(x); zeigen(); }, zustand: () => ({ d }), entferne() { if (tg) tg.stopp(); el.replaceChildren(); el.classList.remove('n1-lage'); } };
}

function startkarte(el, o = {}) {
const sp = spr(o), jetzt = o.jetzt || (() => Date.now() / 1000), holen = o.laden || (() => laden(o.pfad || 'daten/lagebrief.json'));
let d = null;
el.replaceChildren(); el.classList.add('n1-start');
const h = E('h3', '', T(sp, 'titel.start')), inhalt = E('div'), fuss = E('p', 'leise stand n1-pflicht', T(sp, 'pflicht.lage')), ki = kiMarke(sp);
h.append(' ', ki[0]);
el.append(h, ki[1], fuss, inhalt);
function zeigen() {
const j = jetzt();
if (!d || !d.abschnitte.length) { inhalt.replaceChildren(E('p', 'leise', T(sp, 'start.leer'))); return; }
const wahl = d.privat ? { sp: 'de' } : lageSprache(d, sp), teile = [];
if (!frisch(d.stand, j, L_MAX_ALTER)) teile.push(E('p', 'ausfall-text', T(sp, 'lage.alt', uhr(d.stand, true))));
const lage = d.abschnitte.find((a) => a.id === 'lage'), termine = d.abschnitte.find((a) => a.id === 'termine');
const ul = E('ul'); ul.style.cssText = 'list-style:none;padding:0;margin:0';
for (const z of (lage ? lage.zeilen : []).slice(0, 3)) ul.append(lageZeile(z, wahl.sp, sp, false));
if (termine && termine.zeilen[0]) { const z = termine.zeilen[0], li = lageZeile(z, wahl.sp, sp, false); li.prepend(E('b', '', T(sp, 'termin'))); ul.append(li); }
teile.push(ul);
if (o.oeffnen) { const b = E('button', 'mehr', T(sp, 'mehr')); b.type = 'button'; b.addEventListener('click', () => o.oeffnen()); teile.push(b); }
inhalt.replaceChildren(...teile);
}
const tg = o.laden === false ? null : taktgeber(el, holen, (roh) => { d = lageSaeubern(roh); zeigen(); }, () => { if (!d) zeigen(); });
if (o.daten !== undefined) { d = lageSaeubern(o.daten); zeigen(); } else if (tg) tg.pruefe();
return { element: el, aktualisiere(x) { d = lageSaeubern(x); zeigen(); }, entferne() { if (tg) tg.stopp(); el.replaceChildren(); el.classList.remove('n1-start'); } };
}

const ausMac = {
nachrichten(api) {
if (!api || !Array.isArray(api.meldungen)) return null;
const ein = api.meldungen.filter((m) => m && (m.kategorie === 'regulierung' || m.kategorie === 'schlagzeile')).map((m) => ({
titel: m.titel, url: m.url, quelle: m.medium || m.quelle || '', zeit: m.zeit,
themen: m.kategorie === 'regulierung' ? ['regulierung'].concat(m.krypto ? ['krypto'] : []) : ['krypto'],
coins: (m.markt ? ['BTC'] : []).concat(m.coins || []) }));
return { stand: api.zeit || 0, fehler: api.schlagzeilen && api.schlagzeilen.ok === false ? api.schlagzeilen.text : null, eintraege: ein, privat: true };
},
analyst(a) {
const an = a && a.analyse; if (!an || !Array.isArray(an.abschnitte)) return null;
return { privat: true, stand: an.geaendert || 0, titel: { de: an.titel || '' }, abschnitte: an.abschnitte.map((x) => ({ id: x.art || 'sonst', titel: x.titel,
zeilen: (x.punkte || []).map((p) => ({ text: { de: p }, quellen: [] })), tabelle: x.tabelle && x.tabelle.length ? x.tabelle : null })) };
},
};

W.RYVO_N1 = { schlagzeilen, lagebrief, startkarte, ausMac, laden,
rechne: { sicherUrl, alter, ordnen, coinsZaehlen, lageSprache, frisch, schlagzeilenSaeubern, lageSaeubern, uhr }, THEMEN, ABSCHNITTE };
})(window);

