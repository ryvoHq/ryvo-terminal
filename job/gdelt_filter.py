"""GDELT-Schlagzeilen-Filter – AUTOMATISCH ERZEUGT, nicht von Hand ändern.

Quelle: Repo trading-bot-suche, deep/sammler/nachrichten.py (+ trader/nachrichten.py, labor/nachrichten/wache.py),
gebaut mit `python3 -m deep.teilen.schlagzeilen_filter`. Dieselben Regeln wie der Mac-Sammler: Werbung/Glücksspiel/Artikel-Fabriken
weg, CoinDesk/Cointelegraph/Decrypt gesperrt, Sprache aus dem Titel, Coins nur bei eindeutigem Krypto-Bezug. Nur Standardbibliothek.
"""
from __future__ import annotations

import html
import re
import time
from calendar import timegm
from email.utils import mktime_tz, parsedate_tz
from urllib.parse import urlparse, urlsplit


TAG = 86400
SCHLAGZEILE_TAGE = 7
GESPERRT = ('coindesk.com', 'cointelegraph.com', 'decrypt.co')
NAMEN = {'AAVE': 'Aave', 'ADA': 'Cardano', 'ALGO': 'Algorand', 'APT': 'Aptos', 'ARB': 'Arbitrum', 'ASTER': 'Aster', 'ATOM': 'Cosmos', 'AVAX': 'Avalanche', 'BCH': 'Bitcoin Cash', 'BNB': 'BNB', 'BOME': 'Book of Meme', 'BONK': 'Bonk', 'BTC': 'Bitcoin', 'CC': 'Canton Network', 'DOGE': 'Dogecoin', 'DOT': 'Polkadot', 'ENA': 'Ethena', 'ETH': 'Ethereum', 'FET': 'Fetch.ai', 'FIL': 'Filecoin', 'GRASS': 'Grass', 'HBAR': 'Hedera', 'HYPE': 'Hyperliquid', 'ICP': 'Internet Computer', 'INJ': 'Injective', 'JUP': 'Jupiter', 'LINK': 'Chainlink', 'LTC': 'Litecoin', 'MON': 'Monad', 'MORPHO': 'Morpho', 'NEAR': 'NEAR Protocol', 'NIGHT': 'Midnight', 'OKB': 'OKB', 'ONDO': 'Ondo Finance', 'OP': 'Optimism', 'PENGU': 'Pudgy Penguins', 'PEPE': 'Pepe', 'PUMP': 'Pump.fun', 'RAY': 'Raydium', 'RENDER': 'Render', 'SOL': 'Solana', 'STRK': 'Starknet', 'STX': 'Stacks', 'SUI': 'Sui', 'TAO': 'Bittensor', 'TIA': 'Celestia', 'TRUMP': 'Official Trump', 'TRX': 'Tron', 'UNI': 'Uniswap', 'VIRTUAL': 'Virtuals Protocol', 'WLD': 'Worldcoin', 'XLM': 'Stellar', 'XPL': 'Plasma', 'XRP': 'XRP', 'ZEC': 'Zcash', 'ZRO': 'LayerZero'}
ALIAS = {'ETH': ('Ether',)}
NICHT_KUERZEL = {'AI', 'AND', 'API', 'BTC', 'CEO', 'ETF', 'ETFS', 'EU', 'EUR', 'FOR', 'IN', 'LIST', 'NEW', 'OF', 'OKX', 'ON', 'PAIR', 'PAIRS', 'SEC', 'SPOT', 'THE', 'TO', 'UK', 'US', 'USD', 'USDC', 'USDT', 'WILL'}
GAL_SUCHE = re.compile('\\b(bitcoin|btc|ethereum|ether|crypto\\w*|cryptocurrenc\\w*|krypto\\w*|stablecoins?|solana|xrp|ripple|dogecoin|tether|usdc|blockchains?|altcoins?|memecoins?|defi|web3|binance|coinbase|spot\\s+etfs?)\\b', re.I)
FABRIK_HOST = ('dailypolitical.com', 'tickerreport.com', 'themarketsdaily.com', 'etfdailynews.com', 'thelincolnianonline.com', 'modernreaders.com', 'americanbankingnews.com', 'wkrb13.com', 'thecerbatgem.com', 'theenterpriseleader.com', 'zolmax.com', 'dispatchtribunal.com', 'com-unik.info', 'transcriptdaily.com', 'marketbeat.com', 'thestockobserver.com', 'tickerdaily.com', 'rivertonroll.com', 'thewellesleysnews.com', 'baseballnewssource.com', 'stocknewstimes.com', 'financial-market-news.com')
_EN = {'a', 'after', 'amid', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'could', 'for', 'from', 'has', 'her', 'his', 'how', 'in', 'into', 'is', 'its', 'may', 'new', 'of', 'on', 'over', 'says', 'than', 'the', 'this', 'to', 'was', 'what', 'why', 'will', 'with'}
_NICHT_EN = {'achter', 'auch', 'auf', 'avec', 'bedrijf', 'bij', 'bir', 'boekt', 'che', 'com', 'como', 'dankzij', 'dans', 'das', 'del', 'della', 'der', 'des', 'deze', 'di', 'die', 'dit', 'door', 'dopo', 'een', 'ein', 'eine', 'el', 'em', 'est', 'hebben', 'heeft', 'het', 'icin', 'il', 'ile', 'ist', 'jetzt', 'kan', 'koers', 'la', 'las', 'le', 'les', 'los', 'maar', 'meer', 'mit', 'naar', 'nao', 'nel', 'nicht', 'niet', 'nog', 'och', 'ook', 'para', 'per', 'por', 'pour', 'que', 'sich', 'sobre', 'som', 'sono', 'sous', 'sur', 'tegen', 'tras', 'una', 'und', 'une', 'unter', 'van', 'voor', 'werd', 'wie', 'winst', 'wird', 'wordt', 'zal', 'zijn'}
_DE = {'anleger', 'auch', 'auf', 'aus', 'bei', 'bitcoin-kurs', 'börse', 'das', 'dem', 'den', 'der', 'des', 'die', 'droht', 'ein', 'eine', 'einen', 'fällt', 'für', 'gegen', 'im', 'ist', 'jetzt', 'kurs', 'kurse', 'milliarden', 'millionen', 'mit', 'nach', 'neue', 'neuer', 'neues', 'nicht', 'noch', 'oder', 'schon', 'sich', 'sinkt', 'steigt', 'und', 'vom', 'von', 'wegen', 'wie', 'wird', 'zum', 'zur', 'über'}
_DE_BUCHST = {'Ä', 'Ö', 'Ü', 'ß', 'ä', 'ö', 'ü'}
KRYPTO = re.compile('\\b(crypto\\w*|krypto\\w*|binance|coinbase|bybit|meme-?coins?|digital[- ]assets?|stablecoins?|bitcoin|ether(eum)?|blockchain|tokens?|tokeni[sz]\\w*|DLT|virtual assets?|MiCA|DeFi|web3|NFTs?|digital euro|CBDC)\\b', re.I)
WERBUNG = re.compile('\\b(?:casinos?|kasinos?|cas[ií]nos?|cassinos?|spielbank\\w*|spielhalle\\w*|gambl(?:e|es|ed|er|ers|ing)|i-?gaming|gl[üu]cksspiel\\w*|sportsbooks?|bookmakers?|bookies?|buchmacher\\w*|wettanbieter\\w*|sportwetten|wettb[üu]ro\\w*|betting|bettors?|online[\\s-]+slots?|slots?[\\s-]+(?:games?|sites?|machines?|online|bonus\\w*)|slot[\\s-]+machines?|spielautomat\\w*|tragamonedas|tragaperras|machines?\\s+[àa]\\s+sous|poker|roulette|blackjack|baccarat|jackpots?|lotter(?:y|ies)|lotto|apuestas?|casas?\\s+de\\s+apuestas|paris\\s+sportifs|scommess[ae]|apostas?|weddenschap\\w*|gokken|bet365|1xbet|betway|betfair|betmgm|draftkings|fanduel|roobet|cloudbet|bitstarz|bc\\.game|stake\\.(?:com|us)|rollbit|free\\s*spins?|freispiele|giros\\s+gratis|tours\\s+gratuits|giri\\s+gratis|rodadas\\s+gr[áa]tis|no[\\s-]deposit|(?:deposit|welcome|sign[\\s-]?up|signup|reload|casino)\\s+bonus(?:es)?|(?:bonus|promo(?:tional)?|coupon|referral|voucher)\\s+codes?|bonuscodes?|gutscheincodes?|c[óo]digos?\\s+promocionale?s?|codes?\\s+promo|codice\\s+promo\\w*|sponsored|advertorial|paid\\s+(?:post|content|partnership|promotion)|werbung|publicidad|publireportage|pre-?sales?|\\d{3,4}x|\\d{2}x\\s+(?:gains?|potential|returns?)|to\\s+buy\\s+(?:now|today|this\\s+week)|(?:best|top)\\s+(?:\\w+\\s+){0,3}(?:to\\s+buy|presales?)|giveaways?|kaufen\\s+f[üu]r\\s+anf[äa]nger|schritt[\\s-]+f[üu]r[\\s-]+schritt|anleitung|ratgeber|so\\s+kaufen\\s+sie|jetzt\\s+kaufen|kaufen\\s+oder\\s+nicht)\\b', re.I)
WERBUNG_HOST = ('casino', 'gambl', 'poker', 'sportsbook', 'betting', 'bookmaker', 'slots', 'lotto', 'lottery', 'freespin', 'bonus')
WERBUNG_PFAD = re.compile('/(?:sponsored|partner-content|paid-content|advertorial|promoted|casino\\w*|gambling|betting|sportsbook)(?:/|-|$)', re.I)
KONTEXT = re.compile('\\b(crypto\\w*|cryptocurrenc\\w*|krypto\\w*|tokens?|tokeni[sz]\\w*|blockchains?|bitcoin|btc|ethereum|altcoins?|memecoins?|meme\\s*coins?|stablecoins?|defi|web3|nfts?|staking|stakers?|airdrops?|mainnet|testnet|layer[- ]?[12]|l[12]s?|on-?chain|dex|dapps?|satoshis?|binance|coinbase|okx|bybit|dao|smart\\s+contracts?|digital\\s+assets?|virtual\\s+assets?|hodl\\w*)\\b', re.I)
KONTEXT_HOST = ('crypto', 'krypto', 'bitcoin', 'blockchain', 'coin', 'defi', 'token')
ZUSATZ = '(?:token|tokens|coin|network|protocol|blockchain|chain|mainnet|testnet|price|prices|ecosystem|foundation|labs|dao|etfs?|staking|wallet|holders|whales|developers|devs|l1|l2|layer[- ]?[12]|dex|airdrop|treasury|futures)'
MEHRDEUTIG = {'STX': (('Stacks',), 'kontext', 'englisch „stacks (up)“ = abschneiden/Stapel – Casino-Werbung 11.11.2026 (M5)', '\\bstacks?\\s+up\\b|\\bstacks\\s+of\\b|\\bstacks\\s+(?:against|vs\\.?)\\b'), 'NEAR': (('NEAR',), 'zusatz', 'englisch „near“ = nahe/fast (Sport: „near title“, Kurse: „near record“); nur NEAR in Großbuchstaben', '\\bnear[\\s-]+(?:term|record|high|low|miss|future|east)\\b'), 'ONDO': (('Ondo', 'ONDO'), 'kontext', 'Ondo State (Bundesstaat in Nigeria, viele Nachrichten)', '\\bOndo\\s+(?:State|governor|Assembly|Gov\\b)'), 'SUI': (('Sui', 'SUI'), 'kontext', 'lateinisch „sui generis“, chinesischer Familienname, Sui-Dynastie', '\\bsui\\s+(?:generis|juris|dynasty)\\b'), 'LINK': (('Chainlink',), 'kontext', 'englisch „chainlink fence“ (Maschendrahtzaun)', '\\bchain-?link\\s+fenc'), 'PEPE': (('Pepe', 'PEPE'), 'kontext', 'Vorname (Fußballer Pepe, Pepe Reina), Comicfigur', None), 'AVAX': (('Avalanche',), 'kontext', 'Lawine, „avalanche of …“, Eishockey Colorado Avalanche', '\\bavalanche\\s+of\\b|\\bColorado\\s+Avalanche\\b|\\bavalanche\\s+(?:warning|danger|risk|victims?|kill\\w*|season)\\b'), 'ATOM': (('Cosmos',), 'kontext', 'Weltall, Magazin, Fußballklub New York Cosmos', '\\bNew\\s+York\\s+Cosmos\\b|\\bCosmos\\s+(?:magazine|club)\\b'), 'ASTER': (('Aster',), 'kontext', 'Blume, Aster DM Healthcare (Indien)', '\\bAster\\s+DM\\b'), 'BNB': (('BNB',), 'kontext', 'englisch B&B/BnB = Bed and Breakfast', '\\bbed\\s+and\\s+breakfast\\b'), 'BONK': (('Bonk', 'BONK'), 'kontext', 'englischer Slang („bonk“ = Schlag)', None), 'JUP': (('Jupiter',), 'kontext', 'Planet, Stadt Jupiter (Florida)', "\\bJupiter,?\\s+(?:Florida|Fla\\.?|FL)\\b|\\bJupiter['’]s\\s+moons?\\b|\\bplanet\\s+Jupiter\\b"), 'MON': (('Monad',), 'kontext', 'Begriff aus Philosophie/Programmierung', None), 'MORPHO': (('Morpho',), 'kontext', 'Schmetterlingsgattung', None), 'INJ': (('Injective',), 'kontext', 'Mathematik („injective function“)', None), 'TIA': (('Celestia',), 'kontext', 'Vorname, Figur (My Little Pony)', None), 'TRX': (('Tron', 'TRON'), 'kontext', 'Disney-Filme „Tron“, „Tron: Ares“', '\\bTron:?\\s+(?:Ares|Legacy|Uprising)\\b'), 'ETH': (('Ether',), 'kontext', 'Chemie (Diethylether, Narkose)', '\\bether\\s+(?:anesthesia|solvent|extract)\\b|\\bdiethyl'), 'GRASS': (('Grass',), 'zusatz', 'Gras/Rasen', None), 'NIGHT': (('Midnight',), 'zusatz', 'Mitternacht („midnight deadline“)', None), 'OP': (('Optimism',), 'zusatz', 'Optimismus – in Markt-Titeln sehr häufig', None), 'XLM': (('Stellar',), 'zusatz', 'englisch „stellar“ = hervorragend („stellar results“)', None), 'RENDER': (('Render',), 'zusatz', 'englisch „render“ = machen/darstellen', None), 'XPL': (('Plasma',), 'zusatz', 'Blutplasma, Plasmaphysik', None), 'ICP': (('Internet Computer',), 'zusatz', 'allgemeiner Begriff', None), 'TRUMP': (('Official Trump',), 'zusatz', '„official Trump …“ in Politik-Titeln', None)}
MEINUNG = re.compile("\\b(?:price\\s+predictions?|predictions?|forecasts?|prognosen?|kursprognose\\w*|kursziele?|preisprognose\\w*|(?:could|will|may|set\\s+to|poised\\s+to)\\s+(?:soar|surge|explode|skyrocket|rally|crash|plunge|tank|hit|reach|double|triple|10x)|(?:should|can)\\s+you\\s+buy|buy\\s+right\\s+now|(?:best|top)\\s+(?:\\w+\\s+){0,3}(?:to\\s+buy|buy|investments?)|motley\\s+fool|millionaires?|\\d+\\s+(?:best|top)\\b|(?:best|top)\\s+(?:[\\w()-]+\\s+){0,5}(?:in|for)\\s+20\\d\\d|passive\\s+income|methods?\\s+compared|here[\\'’]s\\s+(?:why|what)|elliott\\s+wave|technical\\s+analysis|price\\s+analysis|chart\\s+analysis|analysts?\\s+(?:say|predict|expect|warn)|return\\s+estimate|crash\\s+risk|bull(?:ish)?\\s+case|bear(?:ish)?\\s+case|outlook|opinion|commentary|kommentar|meinung|einschätzung|sollten\\s+anleger|lohnt\\s+sich)\\b", re.I)
_MONATE_KURZ = {'jan': 1, 'feb': 2, 'mar': 3, 'apr': 4, 'may': 5, 'jun': 6, 'jul': 7, 'aug': 8, 'sep': 9, 'oct': 10, 'nov': 11, 'dec': 12}
_MONATE_DE = {'januar': 1, 'februar': 2, 'märz': 3, 'april': 4, 'mai': 5, 'juni': 6, 'juli': 7, 'august': 8, 'september': 9, 'oktober': 10, 'november': 11, 'dezember': 12}
_KUERZEL = re.compile('\\$([A-Z][A-Z0-9]{1,9})\\b|\\(([A-Z][A-Z0-9]{1,9})\\)')


def gesperrt(url, quelle=''):
    """True, wenn Adresse oder Medium zu einer gesperrten Quelle gehört (auch Unterseiten wie www. oder amp.)."""
    for name in (urlparse(str(url or '')).hostname or '', str(quelle or '').lower()):
        name = name.lower().rstrip('.')
        if any(name == g or name.endswith('.' + g) for g in GESPERRT):
            return True
    return False

def _wort(w):
    return r'(?<![\w.$])' + re.escape(w) + r'(?![\w])'

_MEHRDEUTIG = {sym: ([(re.compile(_wort(w)), re.compile(_wort(w) + r"(?:['’]s?)?\s+" + ZUSATZ + r'\b', re.I)) for w in woerter], stufe,
                     re.compile(aus, re.I) if aus else None)
               for sym, (woerter, stufe, _grund, aus) in MEHRDEUTIG.items()}
_MEHRDEUTIGE_WOERTER = {w for woerter, _s, _g, _a in MEHRDEUTIG.values() for w in woerter}
_EINDEUTIG = [(sym, re.compile(_wort(w), re.I)) for sym, name in NAMEN.items() if sym != 'BTC'
              for w in (name,) + ALIAS.get(sym, ()) if w not in _MEHRDEUTIGE_WOERTER]

def _host(url, medium=''):
    h = (urlsplit(str(url or '')).hostname or '').lower()
    return h + ' ' + str(medium or '').lower()

def werbung(titel, url='', medium=''):
    """Grund (Text), wenn die Schlagzeile Glücksspiel, Werbung, Lockangebot oder Artikel-Fabrik ist – sonst None."""
    m = WERBUNG.search(str(titel or ''))
    if m:
        return 'Titel: ' + m.group(0).lower()
    host = _host(url, medium)
    for f in FABRIK_HOST:
        if f in host:
            return 'Medium: Artikel-Fabrik ' + f
    for w in WERBUNG_HOST:
        if w in host:
            return 'Medium: ' + w
    if re.search(r'(?:^|[.\-\s])bets?(?:[.\-]|$)', host):
        return 'Medium: bet'
    if WERBUNG_PFAD.search(urlsplit(str(url or '')).path or ''):
        return 'Adresse: Werbe-/Glücksspiel-Rubrik'
    return None

def meinung(titel):
    """True, wenn der Titel eine Frage, Prognose, Chart-Analyse oder ein Ratgeber ist (Meinung, keine Nachricht)."""
    t = str(titel or '')
    kern = re.split(r'\s+[|–—]\s+|\s+-\s+(?=[A-Z][\w.]*(?:\s+[A-Z][\w.]*){0,3}$)', t)[0]   # „… | The Motley Fool“, „… - Medium“
    return kern.rstrip().endswith('?') or bool(MEINUNG.search(t))

def glaetten(titel):
    """GDELT setzt Leerzeichen um Satzzeichen („( NASDAQ : BTMN )“, „Ont .“, „5 %“, „Bitcoin ' s“) – zurück in normale Schreibweise."""
    t = str(titel or '')
    if re.search('Ã[\x80-\xbf]|Ã[¤¶¼Ÿ„–œ]', t):                     # doppelt kodierte Umlaute („GeldwÃ¤sche“)
        for kod in ('latin-1', 'cp1252'):
            try:
                t = t.encode(kod).decode('utf-8')
                break
            except (UnicodeEncodeError, UnicodeDecodeError):
                continue
    t = re.sub(r'([(\[])\s+', r'\1', t)
    t = re.sub(r'\s+([)\]])', r'\1', t)
    t = re.sub(r"(\w)\s+(['’])\s*(s|t|re|ve|ll|d)\b", r'\1\2\3', t)
    t = re.sub(r'(?<=\w)\s+([.,;:!?%])(?=\s|$|\))', r'\1', t)
    t = re.sub(r'([$€£])\s+(?=\d)', r'\1', t)
    return re.sub(r'\s{2,}', ' ', t).strip()

def titel_datum(titel):
    """Datumsangaben im Titel („26/10/2025“, „2025-10-26“, „Oct 26, 2025“, „26. Oktober 2025“) → Liste möglicher UTC-Zeiten (Sekunden)."""
    t, aus = str(titel or ''), []

    def dazu(j, m, d):
        try:
            aus.append(timegm((int(j), int(m), int(d), 12, 0, 0)))
        except (ValueError, OverflowError):
            pass
    for a, b, j in re.findall(r'\b(\d{1,2})[/.](\d{1,2})[/.](20\d\d)\b', t):
        if 1 <= int(b) <= 12 and 1 <= int(a) <= 31:
            dazu(j, b, a)                                            # Tag/Monat
        if 1 <= int(a) <= 12 and 1 <= int(b) <= 31:
            dazu(j, a, b)                                            # Monat/Tag (USA)
    for j, m, d in re.findall(r'\b(20\d\d)-(\d{2})-(\d{2})\b', t):
        if 1 <= int(m) <= 12 and 1 <= int(d) <= 31:
            dazu(j, m, d)
    for mo, d, j in re.findall(r'\b([A-Za-z]{3})[a-z]*\.?\s+(\d{1,2}),?\s+(20\d\d)\b', t):
        if mo.lower() in _MONATE_KURZ and 1 <= int(d) <= 31:
            dazu(j, _MONATE_KURZ[mo.lower()], d)
    for d, mo, j in re.findall(r'\b(\d{1,2})\.?\s+([A-Za-zä]+)\s+(20\d\d)\b', t):
        m = _MONATE_DE.get(mo.lower()) or _MONATE_KURZ.get(mo[:3].lower())
        if m and 1 <= int(d) <= 31:
            dazu(j, m, d)
    return aus

def zu_alt(titel, zeit, jetzt, tage=SCHLAGZEILE_TAGE):
    """Schlagzeile älter als `tage`: Veröffentlichung oder (alle Lesarten) Datum im Titel."""
    grenze = jetzt - tage * TAG
    if zeit and zeit < grenze:
        return True
    d = titel_datum(titel)
    return bool(d) and max(d) < grenze - TAG

def sprache(titel):
    """'English', 'Deutsch' oder None (andere Sprache) – grob aus Schrift und kleinen Wörtern (Article-List-RSS hat keine Sprachangabe)."""
    t = str(titel or '')
    buchst = [c for c in t if c.isalpha()]
    if len(buchst) < 12:
        return None
    woerter = set(re.findall(r'[a-zäöüß]+', t.lower()))
    de, en = len(woerter & _DE), len(woerter & _EN)
    if all(c.isascii() or c in _DE_BUCHST for c in buchst) and de >= 1 and de > en:
        return 'Deutsch'
    if all(c.isascii() for c in buchst) and (woerter & _EN or not (woerter & _NICHT_EN)):
        return 'English'
    return None

def _grossbuchstaben(t):
    b = [c for c in t if c.isalpha()]
    return len(b) >= 12 and sum(c.isupper() for c in b) / len(b) > 0.7

def coins_zuordnen(titel, medium='', paare=()):
    """(sortierte Coins ohne BTC, Markt-Meldung ja/nein) – nur bei eindeutigem Krypto-Bezug.
    Eindeutige Namen (Solana, Cardano …) zählen immer; mehrdeutige nach MEHRDEUTIG; Kürzel ($SOL, „(SOL)“) nur mit Krypto-Bezug
    im Titel oder Medium (sonst z. B. Aktie Emeren „(SOL)“)."""
    t = str(titel or '')
    markt = bool(re.search(r'\bBitcoin\b(?! Cash)|\bBTC(?:[-/]?(?i:usdt?))?\b', t))   # W9 r131: auch „BTCusd“, „BTC/USD“
    gefunden = {sym for sym, muster in _EINDEUTIG if muster.search(t)}
    kontext = bool(markt or gefunden or KONTEXT.search(t) or any(w in _host('', medium) for w in KONTEXT_HOST))
    bekannt = set(paare) | set(NAMEN)
    kuerzel = {a or b for a, b in _KUERZEL.findall(t)}
    kuerzel = {s for s in kuerzel if s in bekannt and s not in NICHT_KUERZEL and s != 'BTC'}
    if not _grossbuchstaben(t):
        for sym, (muster, stufe, aus) in _MEHRDEUTIG.items():
            if sym in gefunden or (aus and aus.search(t)):
                continue
            for wort, mit_zusatz in muster:
                if wort.search(t) and (sym in kuerzel or mit_zusatz.search(t) or (stufe == 'kontext' and kontext)):
                    gefunden.add(sym)
                    break
    if kontext:
        gefunden |= kuerzel
    gefunden.discard('BTC')
    return sorted(gefunden), markt

def rss_zeit(text):
    """RFC-822- oder ISO-Zeit → (Unix-Zeit, genau). „genau“ = mit Uhrzeit, nicht nur ein Datum um Mitternacht."""
    s = str(text or '').strip()
    if not s:
        return None, False
    t = parsedate_tz(s)
    if t:
        try:
            return int(mktime_tz(t)), (t[3], t[4], t[5]) != (0, 0, 0)
        except (OverflowError, ValueError, TypeError):
            return None, False
    m = re.match(r'(\d{4})-(\d\d)-(\d\d)(?:[T ](\d\d):(\d\d)(?::(\d\d))?(?:\.\d+)?\s*(Z|[+-]\d\d:?\d\d)?)?', s)
    if not m:
        return None, False
    j, mo, d, h, mi, se, z = m.groups()
    u = timegm((int(j), int(mo), int(d), int(h or 0), int(mi or 0), int(se or 0)))
    if z and z != 'Z':
        v = 1 if z[0] == '+' else -1
        z = z[1:].replace(':', '')
        u -= v * (int(z[:2]) * 3600 + int(z[2:]) * 60)
    return u, h is not None and (h, mi, se or '00') != ('00', '00', '00')

def _text(x, laenge=240):
    s = html.unescape(re.sub(r'<[^>]+>', ' ', str(x or '')))
    return re.sub(r'\s+', ' ', s).strip()[:laenge]

def _link(url):
    u = str(url or '').strip()
    if not u.startswith('https://'):
        return None
    return re.sub(r'^(https://[^/]+)//+', r'\1/', u)[:400]

def url_schluessel(url):
    s = urlsplit(str(url or ''))
    host = (s.hostname or '').lower()
    for v in ('www.', 'amp.', 'm.'):
        if host.startswith(v):
            host = host[len(v):]
    pfad = re.sub(r'/+', '/', s.path or '').rstrip('/').lower()
    pfad = re.sub(r'/amp$|\.amp$', '', pfad)
    return host + pfad

def titel_schluessel(titel):
    t = re.sub(r'[^a-z0-9äöüß ]+', ' ', str(titel or '').lower())
    return re.sub(r'\s+', ' ', t).strip()
