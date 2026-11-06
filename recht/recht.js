// Sprache der Rechtsseiten: ?lang=de|en, sonst die im Terminal gewählte Sprache (profi.sprache), sonst Browser.
// Die deutsche Fassung ist maßgeblich; die englische ist eine Lese-Hilfe.
(function () {
  function setzen(s) {
    document.documentElement.lang = s;
    var bloecke = document.querySelectorAll('[data-sprache-block]');
    for (var i = 0; i < bloecke.length; i++) bloecke[i].hidden = bloecke[i].getAttribute('data-sprache-block') !== s;
    var knoepfe = document.querySelectorAll('.sprache button');
    for (var j = 0; j < knoepfe.length; j++) knoepfe[j].setAttribute('aria-pressed', String(knoepfe[j].getAttribute('data-sprache') === s));
    var t = document.querySelectorAll('[data-de]');
    for (var k = 0; k < t.length; k++) t[k].textContent = s === 'en' ? t[k].getAttribute('data-en') : t[k].getAttribute('data-de');
    var titel = document.querySelector('meta[name="titel-' + s + '"]');
    if (titel) document.title = titel.content;
    try { localStorage.setItem('profi.sprache', s); } catch (e) { /* ohne Speicher */ }
  }
  var start = 'de';
  try {
    var q = new URLSearchParams(location.search).get('lang'), m = localStorage.getItem('profi.sprache');
    start = q === 'de' || q === 'en' ? q : m === 'de' ? 'de' : m ? 'en' : (/^de\b/i.test(navigator.language || '') ? 'de' : 'en');
  } catch (e) { /* Standard Deutsch */ }
  setzen(start);
  var gruppe = document.querySelector('.sprache');
  if (gruppe) gruppe.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) setzen(b.getAttribute('data-sprache')); });
})();
