"""Schlagzeilen für die RYVO-Terminal-Beta (Zeitplan-Job, mehrmals täglich; Mios Ja 14.11.2026 14:54; r155 Behörden + Positivliste).

r155 (Abnahme A16, B1 „Wortfilter allein reichen nicht“): Zwei Quellen.
  1. **Behörden** (amtlich, zuerst): Pressemitteilungen von Federal Reserve, SEC, CFTC, BEA und EZB als RSS – nur Titel, Link, Quelle, Zeit
     (Rechte: release/DATENRECHTE.md, Abschnitt „R13“). BLS nur, wenn eine Kontaktadresse in RYVO_KONTAKT steht (die BLS lehnt Skripte ohne
     Kontakt im User-Agent ab). Je Quelle ein Abruf je Lauf mit ETag/If-Modified-Since, eigener Backoff. In der Oberfläche: Filter „Behörden“.
  2. **GDELT** nur noch von einer Positivliste seriöser Wirtschafts- und Nachrichtenmedien (SERIOES_HOST aus deep/sammler/nachrichten.py); dazu
     Themen nur mit Kontext (Fed nicht „fed her“, SEC nicht als Sportliga, „crude“ nur mit oil/Brent/WTI), alte Artikel (Jahr in Titel/Adresse,
     älter als 3 Tage), Rubrik-/Listen-/Kursseiten und fremde Sprachen raus. Englisch; Deutsch nur von deutschen Medien der Liste.
  Bei jedem Lauf wird auch der Bestand mit den aktuellen Regeln neu geprüft – eine Filter-Änderung räumt die Datei sofort auf.

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

Aufruf: python3 job/schlagzeilen.py --ausgabe daten/schlagzeilen.json --zustand <zustand.json> [--rss <datei>] [--amtlich id=datei,…] [--jetzt <unix>]
Herzschlag (r155): Spätestens 2 Std. 30 Min. nach dem letzten Stand wird auch ohne Inhaltsänderung committet (`stand` = jetzt), damit die Datei
in der Oberfläche nie „veraltet“ (ab 4 Std.) zeigt, solange der Job läuft.

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
KONTAKT = re.sub(r'[^\w@.+:/ -]', '', os.environ.get('RYVO_KONTAKT', ''))[:80].strip()      # optional (Repo-Variable), nie geraten
UA = 'RYVO-Terminal-Beta-Schlagzeilen/1.1 (+https://ryvohq.github.io/ryvo-terminal/; GitHub Actions, mehrmals täglich' + ('; ' + KONTAKT if KONTAKT else '') + ')'
QUELLE_SATZ = 'Schlagzeilen: GDELT Project, https://www.gdeltproject.org/ – nur Titel und Link · Behörden: amtliche Pressemitteilungen (Titel und Link)'
# r155: amtliche Feeds (id, Anzeige-Name, Adresse, braucht Kontakt im User-Agent). Rechte und Prüfdatum: release/DATENRECHTE.md („R13“).
# Nicht dabei: US Treasury – home.treasury.gov bietet keinen Feed der Pressemitteilungen (rss.xml enthält nur Programm-Seiten, 15.11.2026 geprüft).
AMTLICH = (
    ('fed', 'Federal Reserve', 'https://www.federalreserve.gov/feeds/press_all.xml', 'federalreserve.gov', False),
    ('fed-reden', 'Federal Reserve', 'https://www.federalreserve.gov/feeds/speeches.xml', 'federalreserve.gov', False),
    ('sec', 'SEC', 'https://www.sec.gov/news/pressreleases.rss', 'sec.gov', False),
    ('sec-erklaerungen', 'SEC', 'https://www.sec.gov/news/statements.rss', 'sec.gov', False),
    ('cftc', 'CFTC', 'https://www.cftc.gov/RSS/RSSGP/rssgp.xml', 'cftc.gov', False),
    ('cftc-durchsetzung', 'CFTC', 'https://www.cftc.gov/RSS/RSSENF/rssenf.xml', 'cftc.gov', False),
    ('bea', 'BEA', 'https://apps.bea.gov/rss/rss.xml', 'bea.gov', False),
    ('ezb', 'EZB', 'https://www.ecb.europa.eu/rss/press.html', 'ecb.europa.eu', False),
    ('bls', 'BLS', 'https://www.bls.gov/feed/bls_latest.rss', 'bls.gov', True),
)
AMTLICH_HOST = {q: h for q, _n, _u, h, _k in AMTLICH}
AMTLICH_FENSTER = 3 * 24 * 3600     # amtliche Mitteilungen bis 3 Tage (am Wochenende veröffentlicht keine Behörde)
AMTLICH_MAX = 20
HERZSCHLAG = 9000                   # 2 Std. 30 Min.: die Oberfläche nennt die Datei ab 4 Std. „veraltet“ (main stößt alle 3 Std. an)
MAX_EINTRAEGE = 80
FENSTER = 24 * 3600
GESEHEN_MERKEN = 48 * 3600
BACKOFF = (900, 6 * 3600)
NACHHOLEN_MAX_S, NACHHOLEN_MAX_ABRUFE = 2 * 3600, 24
COMMIT_NEU, COMMIT_ABSTAND, COMMIT_MIN = 3, 3600, 900
STOERUNG_MELDEN = 1800          # erst nach 30 Min. Störung steht ein Satz in `fehler` (ein einzelner 429 ist noch keine Störung)
MAX_BYTES = 8 * 1024 * 1024
THEMEN_REIHE = ('behoerden', 'regulierung', 'krypto', 'zinsen', 'inflation', 'arbeitsmarkt', 'oel')

# ------------------------------------------------------------------ Themen (Makro dazu; Krypto genau wie am Mac)
# r155 (A16 B1): Themen nur mit Wortgrenzen UND Kontext. Groß-/Kleinschreibung zählt bei Kürzeln (SEC, Fed, FOMC, WTI …).
_FINANZ = re.compile(r'\b(?:banks?|banking|securities|stablecoins?|exchanges?|fintech|derivatives|brokers?|crypto\w*|digital assets?|tokens?)\b', re.I)
# „Fed“ nur als Notenbank: „the/ahead of/after … Fed“, „Fed's …“, „Fed“ + typisches Folgewort – nie „She Fed Her Baby“, „fed up“, „Fed-Batch“
_FED = re.compile(r"\bFed['’]s\b|\b(?i:the|ahead of|after|before|from|by|at|on|of|for|US|U\.S\.)\s+Fed\b(?!-)|"
                  r"\bFed\s+(?i:chair\w*|chief|officials?|governors?|minutes|meeting|meets|decision|rates?|cuts?|hikes?|policy|holds|held|raises|raised|"
                  r"lowers|lowered|signals?|says|said|pause\w*|watch\w*|speakers?|funds|balance|Powell|Waller|Williams|Bowman|Jefferson|Cook|Barr|"
                  r"Musalem|Goolsbee|Hammack|Logan|Kashkari|Daly|Bostic|Schmid|Miran|Hassett|Warsh|independence|nominee|pick|easing|tightening|outlook|"
                  r"path|bets?|expectations?|moves?|stance|statement|survey|report|data|president|board|seen|expected|likely|could|may|will|to)\b(?!-)")
_POWELL = re.compile(r'\bJerome Powell\b|\bPowell\b(?=.*\b(?:rates?|inflation|economy|markets?|stocks?|yields?|dollar|Treasur\w+|policy|cuts?|hikes?|'
                     r'Fed|Federal Reserve|bitcoin|crypto|jobs|labor|tariffs?|recession)\b)|\b(?:rates?|inflation|Fed|Federal Reserve|policy)\b.*\bPowell\b')
_SEC_KONTEXT = re.compile(r'\b(?:crypto\w*|bitcoin|ether(?:eum)?|ETFs?|securities|stocks?|shares|investors?|filings?|fraud|charge[sd]?|sues?|sued|'
                          r'lawsuits?|settle\w*|enforcement|fine[sd]?|penalt\w+|chair\w*|Atkins|Gensler|Peirce|commissioners?|rules?|rulings?|'
                          r'rulemaking|approv\w+|reject\w*|disclos\w+|IPOs?|exchanges?|Wall Street|broker\w*|funds?|tokens?|stablecoins?|insider|'
                          r'Ponzi|probe|investigation|subpoena\w*|regulat\w+|compliance|Nasdaq|NYSE|10-K|8-K|13F|prospectus|listings?|'
                          r'custody|staking|tokeniz\w+|market structure|whistleblower|accounting|audit\w*)\b', re.I)
_SEC_SPORT = re.compile(r'\b(?:football|basketball|baseball|softball|volleyball|soccer|bowl|quarterback|coach\w*|season|seasons|playoffs?|'
                        r'tournament|championship|game|games|skid|stuns?|upset|beats?|rout\w*|win|wins|won|loss|losses|vs\.?|ranked|'
                        r'No\.\s*\d+|Ole Miss|Alabama|Georgia|LSU|Tennessee|Auburn|Oklahoma|Texas A&M|Arkansas|Razorbacks|Hogs|Gamecocks|'
                        r'Crimson Tide|Volunteers|Bulldogs|Wildcats|Tigers|Gators|Aggies|Commodores|Rebels|Longhorns|Sooners|Kentucky|Missouri|'
                        r'Vanderbilt|Florida|Mississippi State|South Carolina|media days)\b', re.I)
_SPORT_HOST = ('sport', 'espn', '247sports', 'on3.com', 'rivals.com', 'thescore', 'si.com', 'athletic', 'yardbarker', 'saturdaydownsouth', 'secsports',
               'secnetwork', 'gamecock', 'razorback')
THEMEN = {
    'regulierung': (re.compile(r'\b(?:CFTC|FINRA|FinCEN|ESMA|BaFin|MiCA)\b'),
                    re.compile(r'\b(?:Securities and Exchange Commission|Commodity Futures Trading Commission|GENIUS Act|CLARITY Act|'
                               r'market[- ]structure bill|stablecoin (?:bill|law|laws|rules?|regulation)|Finanzaufsicht|Kryptoregulierung)\b', re.I)),
    'zinsen': (_FED, _POWELL, re.compile(r'\bFOMC\b|\bECB\b|\bEZB\b|\bBOJ\b|\bBoE\b'),
               re.compile(r'\b(?:Federal Reserve|Federal Open Market Committee|monetary policy|interest[- ]rates?|rate[- ](?:cut|cuts|hike|hikes|decision|path)|(?:Treasury|bond|gilt|bund) yields?|'
                          r'\d+-year (?:Treasury |bond )?yields?|central bank\w*|Bank of England|Bank of Japan|European Central Bank|'
                          r'Leitzins\w*|Zinsentscheid\w*|Zinssenkung\w*|Zinserhöhung\w*|Notenbank\w*|Zentralbank\w*|Bundesbank)\b', re.I)),
    'inflation': (re.compile(r'\b(?:CPI|PPI|PCE)\b(?!\s*[-(]\s*[MLm])'),                    # nicht CPI(M) (Partei in Indien)
                  re.compile(r'\b(?:inflation|disinflation|deflation|consumer prices?|producer prices?|Inflationsrate|Verbraucherpreise)\b'
                             r'(?<!grade inflation)(?!\s+Reduction\s+Act)', re.I)),
    'arbeitsmarkt': (re.compile(r'\bJOLTS\b'),
                     re.compile(r'\b(?:non-?farm payrolls?|payrolls|jobs report|jobless claims|unemployment (?:rate|claims|benefits)|'
                                r'labou?r market|(?:US|U\.S\.) job openings|job growth|Arbeitslos\w*|Arbeitsmarkt\w*)\b', re.I)),   # „payroll“ (Lohnbuchhaltung, Stellenanzeigen) nicht
    'oel': (re.compile(r'\bOPEC\+?|\bWTI\b'),
            re.compile(r'\boil (?:price|prices|futures|market|markets|output|supply|supplies|production|demand|exports?|imports?|inventor\w+|'
                       r'tankers?|majors?|rally|slump|shock)\b|\bcrude oil\b|\bBrent\b(?=\s+(?:crude|oil|futures|prices?))|\bÖlpreis\w*|\bRohöl\w*', re.I)),
}
_CRUDE = re.compile(r'\bcrude\b', re.I)
_CRUDE_KONTEXT = re.compile(r'\boil\b|\bBrent\b|\bWTI\b', re.I)
# Strenger als der Mac (nie lockerer – Test: alles, was hier bleibt, ließe auch der Mac-Filter durch): Titel mit typischen Wörtern anderer
# Sprachen (Indonesisch, Deutsch ohne Funktionswort … kamen als „English“ durch), Meinungs-Rubriken und Kauf-Ratgeber.
_MEINUNG_BETA = re.compile(r'^\s*(?:POINT|COUNTERPOINT|OPINION|EDITORIAL|COLUMN|LETTERS?|ANALYSIS|VIEWPOINT|COMMENT)\s*[:|]|'
                           r'\bbuying opportunit\w*|\b(?:stocks?|coins?|cryptos?|tokens?) to (?:buy|sell|own)\b|\bshould you (?:buy|sell)\b', re.I)
_WORT = re.compile(r'[a-zäöüß]+')
_NICHT_EN_BETA = {'dalam', 'dan', 'yang', 'untuk', 'dengan', 'perlu', 'ini', 'itu', 'dari', 'pada', 'akan', 'tidak', 'sepekan', 'harga',  # Indonesisch/Malaiisch
                  'aktie', 'aktien', 'meldung', 'eingereicht', 'kurs', 'anleger', 'börse',                                           # Deutsch, ohne Funktionswort
                  'och', 'att', 'för', 'og', 'til', 'ikke', 'wa', 'ya', 'kwa', 'na'}                                                  # Skandinavisch, Swahili
_KRYPTON = re.compile(r'\bkrypton\w*', re.I)
_CFTC_FREMD = re.compile(r'Competition and Fair Trading|\bMalawi', re.I)   # N2 (15.11.): CFTC in Malawi = Wettbewerbsbehörde, nicht die US-Aufsicht
_REGULAT = re.compile(r'\bregulat\w+\b', re.I)


def _sec_regulierung(t, host):
    """„SEC“ zählt nur mit Börsen-/Regulierungs-Kontext und nie bei Sport-Medien oder Sportwörtern (A16: „Arkansas ends 10-game home SEC skid“)."""
    if not re.search(r'\bSEC\b', t):
        return False
    h = str(host or '').lower()
    if any(w in h for w in _SPORT_HOST) or _SEC_SPORT.search(t):
        return False
    return bool(_SEC_KONTEXT.search(re.sub(r'\bSEC\b', ' ', t)))


def themen_zuordnen(titel, host=''):
    """(Themen in fester Reihenfolge, Coins mit BTC) – leer, wenn der Titel zu keinem Thema gehört."""
    t = str(titel or '')
    coins, markt = F.coins_zuordnen(t, host)
    ohne_krypton = _KRYPTON.sub(' ', t)                                     # „Krypton“ (Superman) passt sonst auf krypto\w*
    krypto = bool(F.GAL_SUCHE.search(ohne_krypton)) and bool(coins or markt or F.KRYPTO.search(ohne_krypton))    # wie am Mac: GAL_SUCHE + Krypto-Bezug
    t_reg = re.sub(r'\bCFTC\b', ' ', t) if _CFTC_FREMD.search(t + ' ' + str(host or '')) else t
    gef = {name for name, muster in THEMEN.items() if any(m.search(t_reg if name == 'regulierung' else t) for m in muster)}
    if _sec_regulierung(t, host):
        gef.add('regulierung')
    if _CRUDE.search(t) and _CRUDE_KONTEXT.search(t):                      # „crude“ nur mit oil/Brent/WTI (nicht „crude joke“, „crude bomb“)
        gef.add('oel')
    if krypto:
        gef.add('krypto')
    if _REGULAT.search(t) and (krypto or _FINANZ.search(t)):
        gef.add('regulierung')
    coins = (['BTC'] if markt else []) + list(coins)
    return [x for x in THEMEN_REIHE if x in gef], coins[:8]


def _medium(url):
    host = (urlsplit(url).hostname or '').lower()
    return host[4:] if host.startswith('www.') else host


def eintrag(titel_roh, url_roh, zeit, jetzt):
    """Roher GDELT-Artikel → Eintrag oder (None, Grund). Reihenfolge wie gal_lesen am Mac; r155: nur Medien der Positivliste, ohne
    Rubrik-/Listen-Seiten, ohne alte Artikel (3 Tage, Jahr in Titel/Adresse), Englisch – Deutsch nur von deutschen Medien der Liste."""
    titel = F.glaetten(F._text(titel_roh, 200))
    url = F._link(url_roh)
    if not url:
        return None, 'link'
    medium = _medium(url)
    spr = F.sprache(titel) if titel else None
    deutsch = spr == 'Deutsch' and F._host_passt(medium, F.DEUTSCH_HOST)
    if not titel or (spr != 'English' and not deutsch):
        return None, 'sprache'
    if F.gesperrt(url, medium):
        return None, 'gesperrt'
    if not F.serioes(url, medium):
        return None, 'medium'
    if F.werbung(titel, url, medium):
        return None, 'werbung'
    if F.listenseite(titel, url):
        return None, 'rubrik'
    if not zeit or zeit > jetzt + 600 or zeit < jetzt - FENSTER or F.zu_alt(titel, zeit, jetzt, url=url):
        return None, 'zeit'
    themen, coins = themen_zuordnen(titel, medium)
    if not themen:
        return None, 'thema'
    if F.meinung(titel) or _MEINUNG_BETA.search(titel):
        return None, 'meinung'
    if not deutsch and set(_WORT.findall(titel.lower())) & _NICHT_EN_BETA:
        return None, 'sprache'
    e = dict(titel=titel, url=url, quelle=medium[:60], zeit=int(zeit), themen=themen, coins=coins)
    if deutsch:
        e['sprache'] = 'de'
    return e, None


def amtlich_eintrag(titel_roh, url_roh, zeit, qid, name, jetzt):
    """Amtliche Pressemitteilung → Eintrag (Thema „behoerden“ zuerst, dazu die Themen aus dem Titel) oder (None, Grund).
    Nur https-Links auf den Host der Behörde, nur Titel – keine Beschreibung, kein Text."""
    titel = F.glaetten(F._text(titel_roh, 200))
    url = F._link(url_roh)
    if not titel or not url:
        return None, 'link'
    if not F._host_passt(_medium(url), (AMTLICH_HOST.get(qid, '-'),)):
        return None, 'link'
    if not zeit or zeit > jetzt + 600 or zeit < jetzt - AMTLICH_FENSTER:
        return None, 'zeit'
    # Name der Behörde zählt nicht als Thema („Federal Reserve Board issues enforcement action …“ ist keine Zins-Meldung)
    ohne_name = re.sub(r'\b(?:Federal Reserve(?: Board| System)?|Board of Governors|SEC|Securities and Exchange Commission|CFTC|Commodity Futures Trading '
                       r'Commission|European Central Bank|ECB|Bureau of Economic Analysis|BEA|Bureau of Labor Statistics|BLS)\b', ' ', titel)
    themen, coins = themen_zuordnen(ohne_name, AMTLICH_HOST.get(qid, ''))
    themen = ['behoerden'] + [x for x in themen if x != 'behoerden']
    if qid.split('-')[0] in ('sec', 'cftc') and 'regulierung' not in themen:
        themen.insert(1, 'regulierung')
    return dict(titel=titel, url=url, quelle=name, zeit=int(zeit), themen=[x for x in THEMEN_REIHE if x in themen], coins=coins), None


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
    zeilen = [json.dumps({k: e[k] for k in ('titel', 'url', 'quelle', 'zeit', 'themen', 'coins', 'sprache') if k in e}, ensure_ascii=False, separators=(',', ':'))
              for e in eintraege]
    return kopf + ',"eintraege":[\n' + ',\n'.join(zeilen) + ('\n' if zeilen else '') + ']}\n'


def _lies_json(pfad, standard):
    try:
        return json.loads(Path(pfad).read_text(encoding='utf-8'))
    except (OSError, ValueError):
        return standard


def zusammenfuehren(bestand, neu, jetzt):
    """Bestand + neue Einträge → Liste neueste zuerst (höchstens 80, GDELT nur 24 Std., Behörden 3 Tage und höchstens 20). Doppelte = gleiche
    Adresse (ohne www/amp/Query) oder gleicher Titel (ab 20 Zeichen) – der zuerst gesehene bleibt."""
    nach_url, nach_titel, liste = set(), set(), []
    for e in sorted(bestand, key=lambda e: (e['zeit'], e['url'])) + sorted(neu, key=lambda e: (e['zeit'], e['url'])):
        if e['zeit'] < jetzt - (AMTLICH_FENSTER if 'behoerden' in e['themen'] else FENSTER):
            continue
        uk, tk = F.url_schluessel(e['url']), F.titel_schluessel(e['titel'])
        if uk in nach_url or (len(tk) >= 20 and tk in nach_titel):
            continue
        nach_url.add(uk)
        if len(tk) >= 20:
            nach_titel.add(tk)
        liste.append(e)
    liste.sort(key=lambda e: (-e['zeit'], e['url']))
    amt = [e for e in liste if 'behoerden' in e['themen']][:AMTLICH_MAX]
    rest = [e for e in liste if 'behoerden' not in e['themen']][:MAX_EINTRAEGE - len(amt)]
    return sorted(amt + rest, key=lambda e: (-e['zeit'], e['url']))


def soll_committen(geaendert, neue_titel, seit_letztem_s):
    """Drossel: höchstens 4 Commits je Stunde, kleine Änderungen höchstens stündlich; r155 Herzschlag: nach 2 Std. 30 Min. auch ohne Änderung."""
    if seit_letztem_s >= HERZSCHLAG:
        return True
    if not geaendert or seit_letztem_s < COMMIT_MIN:
        return False
    return neue_titel >= COMMIT_NEU or seit_letztem_s >= COMMIT_ABSTAND


def bestand_pruefen(bestand, jetzt):
    """r155: Bestand mit den aktuellen Regeln neu prüfen (A16: die Datei vom 15.11. 08:35 enthielt noch Titel, die neue Filter schon verwarfen)."""
    aus = []
    nach_host = {h: (q, n) for q, n, _u, h, _k in reversed(AMTLICH)}
    for e in bestand:
        if 'behoerden' in e['themen']:
            q = next((nach_host[h] for h in nach_host if F._host_passt(_medium(e['url']), (h,))), None)
            neu, _g = amtlich_eintrag(e['titel'], e['url'], e['zeit'], q[0], q[1], jetzt) if q else (None, 'link')
        else:
            neu, _g = eintrag(e['titel'], e['url'], e['zeit'], jetzt)
        if neu:
            aus.append(neu)
    return aus


def amtlich_runde(z, jetzt, holen, warten, bericht, dateien=None):
    """Behörden-Feeds lesen (je Quelle ETag/If-Modified-Since, Backoff 15 Min. … 6 Std.) → neue Einträge. `dateien`: {id: Pfad} für Tests/Probelauf."""
    zs, neu = z.setdefault('amtlich', {}), []
    for i, (qid, name, url, _host, braucht_kontakt) in enumerate(AMTLICH):
        q = zs.setdefault(qid, {})
        if dateien is not None:
            if qid not in dateien:
                continue
            status, daten, k = 200, Path(dateien[qid]).read_bytes(), {}
        elif braucht_kontakt and not KONTAKT:
            bericht['amtlich'][qid] = 'aus (Kontakt fehlt)'
            continue
        elif jetzt < (q.get('naechster') or 0):
            bericht['amtlich'][qid] = 'backoff'
            continue
        else:
            if i:
                warten(1.0)
            kopf = {}
            if q.get('etag'):
                kopf['If-None-Match'] = q['etag']
            if q.get('lm'):
                kopf['If-Modified-Since'] = q['lm']
            try:
                status, daten, k = holen(url, kopf)
            except Exception as e:  # noqa: BLE001 – Netzfehler = Störung dieser Quelle, Backoff
                status, daten, k = 0, b'', {'fehler': type(e).__name__}
        _bau, roh = rss_lesen(daten) if status == 200 and daten else (None, None)
        if status == 304 or (status == 200 and roh is not None):
            q.update(fehler_n=0, naechster=0, status=status)
            if status == 200 and dateien is None:
                q.update(etag=k.get('etag'), lm=k.get('last-modified'))
            n = 0
            for titel, link, zeit in roh or []:
                e, _g = amtlich_eintrag(titel, link, zeit, qid, name, jetzt)
                if e:
                    neu.append(e)
                    n += 1
            bericht['amtlich'][qid] = f'{status}:{n}'
        else:
            n = int(q.get('fehler_n') or 0) + 1
            q.update(fehler_n=n, naechster=int(jetzt + min(BACKOFF[1], BACKOFF[0] * 2 ** (n - 1))), status=status)
            bericht['amtlich'][qid] = f'HTTP {status}' if status else (k.get('fehler') or 'Netzfehler')
    return neu


def _uhr(t):
    return time.strftime('%d.%m. %H:%M UTC', time.gmtime(t))


def lauf(ausgabe, zustand_pfad, jetzt, holen=holen_echt, warten=time.sleep, rss_datei=None, amtlich_dateien=None):
    ausgabe, zustand_pfad = Path(ausgabe), Path(zustand_pfad)
    alt = _lies_json(ausgabe, None)
    alt = alt if isinstance(alt, dict) and isinstance(alt.get('eintraege'), list) else None
    z = _lies_json(zustand_pfad, {})
    z = z if isinstance(z, dict) else {}
    bestand = bestand_pruefen([e for e in (z.get('liste') if isinstance(z.get('liste'), list) else (alt or {}).get('eintraege') or [])
                               if isinstance(e, dict) and all(k in e for k in ('titel', 'url', 'quelle', 'zeit', 'themen', 'coins'))], jetzt)
    gesehen = {k: t for k, t in (z.get('gesehen') or {}).items() if jetzt - t <= GESEHEN_MERKEN}
    bericht = dict(abruf=None, roh=0, neu=0, verworfen={}, nachgeholt=0, amtlich={})

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
    if not rss_datei or amtlich_dateien:
        neu += amtlich_runde(z, jetzt, holen, warten, bericht, amtlich_dateien)
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
    amt = dict(x.split('=', 1) for x in (arg('--amtlich') or '').split(',') if '=' in x) or None    # Probelauf: --amtlich fed=datei.xml,sec=…
    r = lauf(arg('--ausgabe'), arg('--zustand'), jetzt, rss_datei=arg('--rss'), amtlich_dateien=amt)
    zeile = (f"commit={'true' if r['commit'] else 'false'} eintraege={r['eintraege']} neu={r['neu']} roh={r['roh']} "
             f"abruf={r['abruf']} nachgeholt={r['nachgeholt']} verworfen={json.dumps(r['verworfen'], sort_keys=True)} "
             f"amtlich={json.dumps(r['amtlich'], sort_keys=True)}")
    print(zeile, flush=True)
    if os.environ.get('GITHUB_OUTPUT'):
        with open(os.environ['GITHUB_OUTPUT'], 'a', encoding='utf-8') as f:
            f.write(f"commit={'true' if r['commit'] else 'false'}\nneu={r['neu']}\neintraege={r['eintraege']}\n")
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
