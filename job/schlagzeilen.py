"""Schlagzeilen für die RYVO-Terminal-Beta (Zeitplan-Job, alle 15 Min.; Mios Ja 14.11.2026 14:54).

Liest die GDELT Article List (RSS, https://data.gdeltproject.org/gdeltv3/gal/feed.rss – ein GDELT-Datensatz, „unlimited and
unrestricted use“ mit Quellenangabe und Link, https://www.gdeltproject.org/about.html) und schreibt daten/schlagzeilen.json neben
die Beta: nur englische Titel zu Krypto, Zinsen/Fed, Regulierung, Inflation, Arbeitsmarkt und Öl; nur Titel, Link, Medium, Zeit,
Themen, Coins – keine Artikeltexte, keine Bilder, keine Beschreibungen. Filter wie der Mac-Sammler (gdelt_filter.py, erzeugt aus
deep/sammler/nachrichten.py): Werbung/Glücksspiel/Artikel-Fabriken weg, CoinDesk/Cointelegraph/Decrypt gesperrt, Meinung/Prognose weg.

Höflich: ein Abruf je Lauf mit If-None-Match/If-Modified-Since (304 = nichts Neues), User-Agent mit Projektname, bei 429/5xx/Netzfehler
eigener Backoff 15 Min. … 6 Std. (Retry-After zählt, wenn länger). Keine DOC-API. Nur wenn zwischen zwei Läufen ein 15-Min.-Paket
der Liste fehlt (GitHub verschiebt Zeitplan-Läufe), holt der Job genau die fehlenden Minuten-Dateien desselben Datensatzes nach
(gdeltv3/gal/JJJJMMTTHHMMSS.gal.json.gz, höchstens 2 Std. zurück, höchstens 24 Abrufe, 1 s Pause) – auch dort nur Titel, Link, Zeit.

Commit-Drossel (GitHub Pages: weiche Grenze 10 Builds je Stunde): geschrieben/committet wird nur, wenn sich der Inhalt geändert hat
UND (mindestens 3 neue Titel ODER mindestens 60 Min. seit dem letzten Stand) – und nie öfter als alle 15 Min. Was dazwischen kommt,
bleibt im Zustand (eigener Zweig, kein Pages-Build) und erscheint beim nächsten Commit. Ein Lauf ohne Änderung erzeugt genau dieselbe
Datei (stabile Sortierung, `stand` = Zeit der letzten Inhaltsänderung).

Aufruf: python3 job/schlagzeilen.py --ausgabe daten/schlagzeilen.json --zustand <zustand.json> [--rss <datei>] [--jetzt <unix>]
Ausgabe: eine Zeile „commit=true|false …“, dazu commit=… in $GITHUB_OUTPUT. Nur Python-Standardbibliothek (3.9+).
"""
from __future__ import annotations

import gzip
import json
import os
import re
import sys
import time
import urllib.error
import urllib.request
import xml.etree.ElementTree as ET
from pathlib import Path
from urllib.parse import urlsplit

sys.path.insert(0, str(Path(__file__).resolve().parent))
import gdelt_filter as F  # noqa: E402

GAL = 'https://data.gdeltproject.org/gdeltv3/gal/feed.rss'
GAL_MINUTE = 'https://data.gdeltproject.org/gdeltv3/gal/{}.gal.json.gz'
UA = 'RYVO-Terminal-Beta-Schlagzeilen/1.0 (+https://ryvohq.github.io/ryvo-terminal/; GitHub Actions, alle 15 Min.)'
QUELLE_SATZ = 'Schlagzeilen: GDELT Project, https://www.gdeltproject.org/ – nur Titel und Link'
MAX_EINTRAEGE = 80
FENSTER = 24 * 3600
GESEHEN_MERKEN = 48 * 3600
BACKOFF = (900, 6 * 3600)
NACHHOLEN_MAX_S, NACHHOLEN_MAX_ABRUFE = 2 * 3600, 24
COMMIT_NEU, COMMIT_ABSTAND, COMMIT_MIN = 3, 3600, 900
STOERUNG_MELDEN = 1800          # erst nach 30 Min. Störung steht ein Satz in `fehler` (ein einzelner 429 ist noch keine Störung)
MAX_BYTES = 8 * 1024 * 1024
THEMEN_REIHE = ('regulierung', 'krypto', 'zinsen', 'inflation', 'arbeitsmarkt', 'oel')

# ------------------------------------------------------------------ Themen (Makro dazu; Krypto genau wie am Mac)
_FINANZ = re.compile(r'\b(?:banks?|banking|securities|stablecoins?|exchanges?|fintech|derivatives|brokers?|crypto\w*|digital assets?|tokens?)\b', re.I)
THEMEN = {
    'regulierung': (re.compile(r'\b(?:SEC|CFTC|FINRA|FinCEN|ESMA|BaFin|MiCA)\b(?!\s+(?:regular|football|basketball|baseball|softball|'
                               r'volleyball|soccer|title|championship|tournament|game|games|play|team|teams|school|schools|coach\w*|media days))'),
                    re.compile(r'\b(?:Securities and Exchange Commission|Commodity Futures Trading Commission|GENIUS Act|CLARITY Act|'
                               r'market[- ]structure bill|stablecoin (?:bill|law|laws|rules?|regulation))\b', re.I)),
    'zinsen': (re.compile(r'\bFed\b(?!\s+[Uu]p\b)|\bFed[’\']s\b|\bFOMC\b|\bECB\b|\bBOJ\b'),
               re.compile(r'\b(?:Federal Reserve|interest[- ]rates?|rate[- ](?:cut|cuts|hike|hikes|decision|path)|(?:Treasury|bond|gilt|bund) yields?|'
                          r'\d+-year (?:Treasury |bond )?yields?|central bank\w*|Bank of England|Bank of Japan|European Central Bank)\b', re.I)),
    'inflation': (re.compile(r'\b(?:CPI|PPI|PCE)\b(?!\s*[-(]\s*[MLm])'),                    # nicht CPI(M) (Partei in Indien)
                  re.compile(r'\b(?:inflation|disinflation|deflation|consumer prices?|producer prices?)\b(?<!grade inflation)', re.I)),
    'arbeitsmarkt': (re.compile(r'\bJOLTS\b'),
                     re.compile(r'\b(?:non-?farm payrolls?|payrolls|jobs report|jobless claims|unemployment (?:rate|claims|benefits)|'
                                r'labou?r market|(?:US|U\.S\.) job openings|job growth)\b', re.I)),   # „payroll“ (Lohnbuchhaltung, Stellenanzeigen) nicht
    'oel': (re.compile(r'\bOPEC\+?|\bWTI\b'),
            re.compile(r'\boil (?:price|prices|futures|market|markets|output|supply|supplies|production|demand|exports?|imports?|inventor\w+|'
                       r'tankers?|majors?|rally|slump|shock)\b|\bcrude(?: oil)?\b(?!\s+(?:joke|humou?r|remark|remarks|language|comments?|drawings?))|'
                       r'\bBrent\b(?=\s+(?:crude|oil|futures|prices?))', re.I)),
}
# Strenger als der Mac (nie lockerer – Test: alles, was hier bleibt, ließe auch der Mac-Filter durch): Uni-Sport-Liga „SEC“,
# Titel mit typischen Wörtern anderer Sprachen (Indonesisch, Deutsch ohne Funktionswort … kamen als „English“ durch), Meinungs-Rubriken und Kauf-Ratgeber.
_SEC_SPORT = re.compile(r'\b(?:football|basketball|baseball|softball|volleyball|bowl|quarterback|coach\w*|season|seasons|playoffs?|'
                        r'tournament|Ole Miss|Alabama|Georgia|LSU|Tennessee|Auburn|Oklahoma|Texas A&M|Gamecocks|Crimson Tide)\b', re.I)
_MEINUNG_BETA = re.compile(r'^\s*(?:POINT|COUNTERPOINT|OPINION|EDITORIAL|COLUMN|LETTERS?|ANALYSIS|VIEWPOINT|COMMENT)\s*[:|]|'
                           r'\bbuying opportunit\w*|\b(?:stocks?|coins?|cryptos?|tokens?) to (?:buy|sell|own)\b|\bshould you (?:buy|sell)\b', re.I)
_WORT = re.compile(r'[a-zäöüß]+')
_NICHT_EN_BETA = {'dalam', 'dan', 'yang', 'untuk', 'dengan', 'perlu', 'ini', 'itu', 'dari', 'pada', 'akan', 'tidak', 'sepekan', 'harga',  # Indonesisch/Malaiisch
                  'aktie', 'aktien', 'meldung', 'eingereicht', 'kurs', 'anleger', 'börse',                                           # Deutsch, ohne Funktionswort
                  'och', 'att', 'för', 'og', 'til', 'ikke', 'wa', 'ya', 'kwa', 'na'}                                                  # Skandinavisch, Swahili
_KRYPTON = re.compile(r'\bkrypton\w*', re.I)
_REGULAT = re.compile(r'\bregulat\w+\b', re.I)


def themen_zuordnen(titel, host=''):
    """(Themen in fester Reihenfolge, Coins mit BTC) – leer, wenn der Titel zu keinem Thema gehört."""
    t = str(titel or '')
    coins, markt = F.coins_zuordnen(t, host)
    ohne_krypton = _KRYPTON.sub(' ', t)                                     # „Krypton“ (Superman) passt sonst auf krypto\w*
    krypto = bool(F.GAL_SUCHE.search(ohne_krypton)) and bool(coins or markt or F.KRYPTO.search(ohne_krypton))    # wie am Mac: GAL_SUCHE + Krypto-Bezug
    gef = {name for name, muster in THEMEN.items() if any(m.search(t) for m in muster)}
    if krypto:
        gef.add('krypto')
    if _REGULAT.search(t) and (krypto or _FINANZ.search(t)):
        gef.add('regulierung')
    coins = (['BTC'] if markt else []) + list(coins)
    return [x for x in THEMEN_REIHE if x in gef], coins[:8]


def eintrag(titel_roh, url_roh, zeit, jetzt):
    """Roher Artikel → Eintrag oder (None, Grund). Dieselbe Reihenfolge wie gal_lesen am Mac, nur Englisch, ohne Meinung."""
    titel = F.glaetten(F._text(titel_roh, 200))
    if not titel or F.sprache(titel) != 'English':
        return None, 'sprache'
    url = F._link(url_roh)
    if not url:
        return None, 'link'
    host = (urlsplit(url).hostname or '').lower()
    medium = host[4:] if host.startswith('www.') else host
    if F.gesperrt(url, medium):
        return None, 'gesperrt'
    if F.werbung(titel, url, medium):
        return None, 'werbung'
    if not zeit or zeit > jetzt + 600 or zeit < jetzt - FENSTER or F.zu_alt(titel, zeit, jetzt):
        return None, 'zeit'
    themen, coins = themen_zuordnen(titel, medium)
    if not themen:
        return None, 'thema'
    if F.meinung(titel) or _MEINUNG_BETA.search(titel):
        return None, 'meinung'
    if set(_WORT.findall(titel.lower())) & _NICHT_EN_BETA:
        return None, 'sprache'
    if themen == ['regulierung'] and _SEC_SPORT.search(titel):
        return None, 'thema'
    return dict(titel=titel, url=url, quelle=medium[:60], zeit=int(zeit), themen=themen, coins=coins), None


# ------------------------------------------------------------------ Lesen
def rss_lesen(daten):
    """RSS → (Bauzeit oder None, [(titel, url, zeit)])."""
    try:
        wurzel = ET.fromstring(daten)
    except ET.ParseError:
        return None, None
    bau, _ = F.rss_zeit(wurzel.findtext('channel/lastBuildDate'))
    roh = []
    for it in wurzel.iter('item'):
        z, _g = F.rss_zeit(it.findtext('pubDate'))
        roh.append((it.findtext('title') or '', it.findtext('link') or '', z))
    return bau, roh


def minute_lesen(daten):
    """Minuten-Datei (JSON je Zeile) → [(titel, url, zeit)] – nur diese drei Felder, Beschreibung/Bild/Autor werden nie gelesen."""
    roh = []
    if daten[:2] == b'\x1f\x8b':                                          # die Datei selbst ist gzip (kein Content-Encoding)
        try:
            daten = gzip.decompress(daten)
        except (OSError, EOFError):
            return roh
    for zeile in daten.decode('utf-8', 'replace').splitlines():
        try:
            d = json.loads(zeile)
        except ValueError:
            continue
        if isinstance(d, dict):
            z, _g = F.rss_zeit(d.get('date'))
            roh.append((str(d.get('title') or ''), str(d.get('url') or ''), z))
    return roh


def holen_echt(url, kopf, zeitlimit=40):
    """→ (Status, Bytes, Kopf klein geschrieben)."""
    req = urllib.request.Request(url, headers=dict({'User-Agent': UA, 'Accept-Encoding': 'gzip'}, **kopf))
    try:
        with urllib.request.urlopen(req, timeout=zeitlimit) as f:
            daten = f.read(MAX_BYTES + 1)[:MAX_BYTES]
            k = {a.lower(): b for a, b in f.headers.items()}
            if k.get('content-encoding') == 'gzip':
                daten = gzip.decompress(daten)
            return f.status, daten, k
    except urllib.error.HTTPError as e:
        return e.code, b'', {a.lower(): b for a, b in (e.headers or {}).items()}


def nachhol_minuten(von, bis):
    """Minuten (UTC, als JJJJMMTTHHMMSS) mit möglichen Paket-Dateien zwischen von und bis: je Viertelstunde die Minuten +1 … +3."""
    von = max(int(von), int(bis) - NACHHOLEN_MAX_S)
    aus, q = [], von - von % 900
    while q < bis and len(aus) < NACHHOLEN_MAX_ABRUFE:
        for m in (1, 2, 3):
            t = q + 60 * m
            if von < t + 60 and t < bis and len(aus) < NACHHOLEN_MAX_ABRUFE:
                aus.append(time.strftime('%Y%m%d%H%M%S', time.gmtime(t)))
        q += 900
    return aus


# ------------------------------------------------------------------ Datei
def datei_text(stand, fehler, eintraege):
    """Stabil: feste Feld-Reihenfolge, ein Eintrag je Zeile (kleine Diffs im Repo)."""
    kopf = json.dumps(dict(stand=stand, quelle_satz=QUELLE_SATZ, fehler=fehler), ensure_ascii=False, separators=(',', ':'))[:-1]
    zeilen = [json.dumps({k: e[k] for k in ('titel', 'url', 'quelle', 'zeit', 'themen', 'coins')}, ensure_ascii=False, separators=(',', ':'))
              for e in eintraege]
    return kopf + ',"eintraege":[\n' + ',\n'.join(zeilen) + ('\n' if zeilen else '') + ']}\n'


def _lies_json(pfad, standard):
    try:
        return json.loads(Path(pfad).read_text(encoding='utf-8'))
    except (OSError, ValueError):
        return standard


def zusammenfuehren(bestand, neu, jetzt):
    """Bestand + neue Einträge → Liste neueste zuerst (höchstens 80, nur 24 Std.). Doppelte = gleiche Adresse (ohne www/amp/Query)
    oder gleicher Titel (ab 20 Zeichen) – der zuerst gesehene bleibt."""
    nach_url, nach_titel, liste = set(), set(), []
    for e in sorted(bestand, key=lambda e: (e['zeit'], e['url'])) + sorted(neu, key=lambda e: (e['zeit'], e['url'])):
        if e['zeit'] < jetzt - FENSTER:
            continue
        uk, tk = F.url_schluessel(e['url']), F.titel_schluessel(e['titel'])
        if uk in nach_url or (len(tk) >= 20 and tk in nach_titel):
            continue
        nach_url.add(uk)
        if len(tk) >= 20:
            nach_titel.add(tk)
        liste.append(e)
    liste.sort(key=lambda e: (-e['zeit'], e['url']))
    return liste[:MAX_EINTRAEGE]


def soll_committen(geaendert, neue_titel, seit_letztem_s):
    """Drossel: höchstens 4 Commits je Stunde, kleine Änderungen höchstens stündlich."""
    if not geaendert or seit_letztem_s < COMMIT_MIN:
        return False
    return neue_titel >= COMMIT_NEU or seit_letztem_s >= COMMIT_ABSTAND


def _uhr(t):
    return time.strftime('%d.%m. %H:%M UTC', time.gmtime(t))


def lauf(ausgabe, zustand_pfad, jetzt, holen=holen_echt, warten=time.sleep, rss_datei=None):
    ausgabe, zustand_pfad = Path(ausgabe), Path(zustand_pfad)
    alt = _lies_json(ausgabe, None)
    alt = alt if isinstance(alt, dict) and isinstance(alt.get('eintraege'), list) else None
    z = _lies_json(zustand_pfad, {})
    z = z if isinstance(z, dict) else {}
    bestand = [e for e in (z.get('liste') if isinstance(z.get('liste'), list) else (alt or {}).get('eintraege') or [])
               if isinstance(e, dict) and all(k in e for k in ('titel', 'url', 'quelle', 'zeit', 'themen', 'coins'))]
    gesehen = {k: t for k, t in (z.get('gesehen') or {}).items() if jetzt - t <= GESEHEN_MERKEN}
    bericht = dict(abruf=None, roh=0, neu=0, verworfen={}, nachgeholt=0)

    roh = []
    if rss_datei:                                                            # Test/Probelauf mit Datei
        _bau, roh = rss_lesen(Path(rss_datei).read_bytes())
        roh, bericht['abruf'] = roh or [], 'datei'
    elif jetzt < (z.get('naechster') or 0):
        bericht['abruf'] = 'backoff bis ' + _uhr(z['naechster'])
    else:
        kopf = {}
        if z.get('etag'):
            kopf['If-None-Match'] = z['etag']
        if z.get('lm'):
            kopf['If-Modified-Since'] = z['lm']
        try:
            status, daten, k = holen(GAL, kopf)
        except Exception as e:  # noqa: BLE001 – Netzfehler = Störung, Backoff
            status, daten, k = 0, b'', {'fehler': type(e).__name__}
        bau, roh_rss = rss_lesen(daten) if status == 200 and daten else (None, None)
        if status == 304 or (status == 200 and roh_rss is not None):
            bericht['abruf'] = str(status)
            z.update(fehler_n=0, naechster=0, gestoert_seit=None, status=status)
            if status == 200:
                z.update(etag=k.get('etag'), lm=k.get('last-modified'))
                roh = roh_rss
                bau = bau or int(jetzt)
                bis = bau - 900                                              # die Liste deckt die letzten 15 Min. vor ihrer Bauzeit ab
                if z.get('abgedeckt_bis') and bis > z['abgedeckt_bis'] + 60:
                    for minute in nachhol_minuten(z['abgedeckt_bis'], bis):
                        warten(1.0)
                        try:
                            s2, d2, _k2 = holen(GAL_MINUTE.format(minute), {})
                        except Exception:  # noqa: BLE001
                            continue
                        if s2 == 200 and d2:
                            stueck = minute_lesen(d2)
                            roh += stueck
                            bericht['nachgeholt'] += 1
                z['abgedeckt_bis'] = max(int(z.get('abgedeckt_bis') or 0), int(bau))
        else:
            n = int(z.get('fehler_n') or 0) + 1
            warte = min(BACKOFF[1], BACKOFF[0] * 2 ** (n - 1))
            try:
                warte = max(warte, min(BACKOFF[1], int(k.get('retry-after') or 0)))
            except ValueError:
                pass
            grund = f'HTTP {status}' if status else (k.get('fehler') or 'Netzfehler')
            if status == 200:
                grund = 'Antwort ohne lesbares RSS'
            z.update(fehler_n=n, naechster=int(jetzt + warte), gestoert_seit=z.get('gestoert_seit') or int(jetzt), status=status, grund=grund)
            bericht['abruf'] = grund

    neu = []
    for titel, url, zeit in roh:
        e, grund = eintrag(titel, url, zeit, jetzt)
        if grund:
            bericht['verworfen'][grund] = bericht['verworfen'].get(grund, 0) + 1
            continue
        k = F.url_schluessel(e['url'])
        if k in gesehen and not any(F.url_schluessel(b['url']) == k for b in bestand):
            continue                                                         # war schon da und ist aus dem Fenster gefallen
        gesehen.setdefault(k, int(jetzt))
        neu.append(e)
    bericht['roh'] = len(roh)
    liste = zusammenfuehren(bestand, neu, jetzt)

    seit = z.get('gestoert_seit')
    fehler = (f"Schlagzeilen-Quelle GDELT gestört seit {_uhr(seit)} ({z.get('grund') or 'keine Antwort'}). Gezeigt werden die zuletzt "
              f"geholten Titel." if seit and jetzt - seit >= STOERUNG_MELDEN else None)
    alt_inhalt = ((alt or {}).get('eintraege'), (alt or {}).get('fehler'), (alt or {}).get('quelle_satz'))
    geaendert = alt is None or alt_inhalt != (liste, fehler, QUELLE_SATZ)
    alt_urls = {e.get('url') for e in (alt or {}).get('eintraege') or []}
    neue_titel = sum(1 for e in liste if e['url'] not in alt_urls)
    seit_letztem = jetzt - int((alt or {}).get('stand') or 0)
    commit = soll_committen(geaendert, neue_titel, seit_letztem)
    bericht['neu'] = neue_titel
    if commit:
        ausgabe.parent.mkdir(parents=True, exist_ok=True)
        tmp = ausgabe.with_suffix('.tmp')
        tmp.write_text(datei_text(int(jetzt), fehler, liste), encoding='utf-8')
        tmp.replace(ausgabe)
    z.update(liste=liste, gesehen=dict(sorted(gesehen.items())), letzter_lauf=int(jetzt))
    zustand_pfad.parent.mkdir(parents=True, exist_ok=True)
    zustand_pfad.write_text(json.dumps(z, ensure_ascii=False, sort_keys=True, separators=(',', ':')), encoding='utf-8')
    return dict(commit=commit, geaendert=geaendert, eintraege=len(liste), fehler=fehler, **bericht)


def main(argv):
    def arg(name, standard=None):
        return argv[argv.index(name) + 1] if name in argv else standard
    if '--ausgabe' not in argv or '--zustand' not in argv:
        print(__doc__)
        return 2
    jetzt = int(arg('--jetzt') or time.time())
    r = lauf(arg('--ausgabe'), arg('--zustand'), jetzt, rss_datei=arg('--rss'))
    zeile = (f"commit={'true' if r['commit'] else 'false'} eintraege={r['eintraege']} neu={r['neu']} roh={r['roh']} "
             f"abruf={r['abruf']} nachgeholt={r['nachgeholt']} verworfen={json.dumps(r['verworfen'], sort_keys=True)}")
    print(zeile, flush=True)
    if os.environ.get('GITHUB_OUTPUT'):
        with open(os.environ['GITHUB_OUTPUT'], 'a', encoding='utf-8') as f:
            f.write(f"commit={'true' if r['commit'] else 'false'}\nneu={r['neu']}\neintraege={r['eintraege']}\n")
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
