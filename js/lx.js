/* ==========================================================================
   LAMILUX · WT - WINDOWS TOMORROW
   Drobná interaktivita: hlavička při scrollu, mobilní menu, odhalování
   obsahu a obsluha poptávkového formuláře (zatím bez odesílání na server).
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- hlavička ---------- */
  var hdr = document.getElementById('hdr');
  function onScroll() {
    hdr.classList.toggle('scrolled', window.scrollY > 40);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- mobilní menu ---------- */
  var btn = document.getElementById('menuBtn');
  var mmenu = document.getElementById('mmenu');
  if (btn) {
    btn.addEventListener('click', function () {
      var open = hdr.classList.toggle('menu-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    mmenu.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        hdr.classList.remove('menu-open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- odhalování při scrollu ---------- */
  var items = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('on');
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('on'); });
  }

  /* ---------- rok v patičce ---------- */
  var rok = document.getElementById('rok');
  if (rok) rok.textContent = new Date().getFullYear();

  /* ---------- poptávkový formulář ----------
     POZOR: formulář zatím nikam neodesílá. Než web půjde na doménu,
     je potřeba doplnit odesílání (např. skript na serveru nebo služba
     typu Formspree) a zkontrolovat text o zpracování údajů. Do té doby
     nabídne návštěvníkovi předvyplněný e-mail. */
  var form = document.getElementById('pform');
  var note = document.getElementById('fnote');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var jmeno = (d.get('jmeno') || '').toString().trim();
      var mail = (d.get('email') || '').toString().trim();
      if (!jmeno || !mail || mail.indexOf('@') < 0) {
        note.textContent = 'Vyplňte prosím jméno a platný e-mail.';
        return;
      }
      var telo =
        'Jméno: ' + jmeno + '\n' +
        'Telefon: ' + (d.get('telefon') || '') + '\n' +
        'E-mail: ' + mail + '\n' +
        'Zájem o: ' + (d.get('typ') || '') + '\n\n' +
        (d.get('zprava') || '');
      window.location.href =
        'mailto:info@solatube.cz?subject=' + encodeURIComponent('Poptávka LAMILUX – ' + jmeno) +
        '&body=' + encodeURIComponent(telo);
      note.textContent = 'Otevřeli jsme vám e-mail s vyplněnou poptávkou. Stačí odeslat.';
    });
  }
})();
