// Sprache der Rechtsseiten: ?lang=de|en|es|fr|it|tr, sonst die im Terminal gewählte Sprache (profi.sprache), sonst Browser, sonst Englisch.
// Die deutsche Fassung ist maßgeblich; die anderen sind Lese-Hilfen. Erzeugt von deep/teilen/recht.py – nichts wird gesendet.
(function () {
  var SPRACHEN = ["de", "en", "es", "fr", "it", "tr"];
  function setzen(s, merken) {
    if (SPRACHEN.indexOf(s) < 0) s = 'en';
    var h = document.documentElement; h.lang = s; h.setAttribute('data-sprache', s);
    var e = document.querySelectorAll('[data-sprache-block], [data-l]');
    for (var i = 0; i < e.length; i++) e[i].hidden = (e[i].getAttribute('data-sprache-block') || e[i].getAttribute('data-l')) !== s;
    var k = document.querySelectorAll('.sprache button');
    for (var j = 0; j < k.length; j++) k[j].setAttribute('aria-pressed', String(k[j].getAttribute('data-sprache') === s));
    var titel = document.querySelector('meta[name="titel-' + s + '"]');
    if (titel) document.title = titel.content;
    if (merken) { try { localStorage.setItem('profi.sprache', s); } catch (x) { /* ohne Speicher */ } }
  }
  setzen(document.documentElement.getAttribute('data-sprache') || 'de', false);
  var gruppe = document.querySelector('.sprache');
  if (gruppe) gruppe.addEventListener('click', function (ev) { var b = ev.target.closest('button'); if (b) setzen(b.getAttribute('data-sprache'), true); });
})();
