/* ==========================================================================
   site.js - Shared site chrome
   Responsive navbar, tools dropdown, mobile menu, footer, related tools
   ========================================================================== */
(function () {
  'use strict';

  var ENGINEERING_URL = 'https://anurag24-26.github.io/anurag24codes/';

  var TOOLS = [
    { id: 'home', href: 'index.html', name: 'CPI Calculator',
      short: 'Calculate your CPI from subject credits and grades.' },
    { id: 'attendance', href: 'attendance.html', name: 'Attendance Calculator',
      short: 'Check attendance % and how many classes you can miss.' },
    { id: 'sgpa-cgpa', href: 'sgpa-cgpa.html', name: 'SGPA to CGPA',
      short: 'Combine semester SGPAs into a single CGPA.' },
    { id: 'cgpa-percentage', href: 'cgpa-percentage.html', name: 'CGPA Percentage',
      short: 'Convert CGPA to percentage with university formulas.' },
    { id: 'required-cgpa', href: 'required-cgpa.html', name: 'Required CGPA',
      short: 'Find the SGPA you need to reach a target CGPA.' },
    { id: 'grade-calculator', href: 'grade-calculator.html', name: 'Grade Calculator',
      short: 'Weighted marks to final percentage and grade.' }
  ];

  var PAGE = document.body.getAttribute('data-page') || '';
  var isTool = TOOLS.some(function (t) { return t.id === PAGE && t.id !== 'home'; });
  var isGuides = PAGE === 'guides' || PAGE === 'faq';

  var ICON_CAP =
    '<svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" ' +
    'stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M12 4 2 9l10 5 10-5-10-5Z"/><path d="M6 11.5V16c0 1.4 2.7 3 6 3s6-1.6 6-3v-4.5"/>' +
    '<path d="M22 9v5"/></svg>';
  var ICON_CHEV =
    '<svg class="nav-chev" width="13" height="13" viewBox="0 0 24 24" fill="none" ' +
    'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ' +
    'aria-hidden="true"><path d="m7 10 5 5 5-5"/></svg>';
  var ICON_OUT =
    '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
    'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M7 17 17 7M8 7h9v9"/></svg>';
  var ICON_UP =
    '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
    'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M12 19V5M5 12l7-7 7 7"/></svg>';

  function cur(active) { return active ? ' is-current" aria-current="page' : ''; }

  /* ---------- Navbar ---------- */
  function buildNav() {
    var menuItems = TOOLS.map(function (t) {
      return '<a href="' + t.href + '" class="' + (t.id === PAGE ? 'is-current' : '') + '">' +
        '<span class="nav-dd-name">' + t.name + '</span>' +
        '<span class="nav-dd-desc">' + t.short + '</span></a>';
    }).join('');

       var MINI = {
      'home': 'CPI Calculator', 'attendance': 'Attendance',
      'sgpa-cgpa': 'SGPA → CGPA', 'cgpa-percentage': 'CGPA → %',
      'required-cgpa': 'Required CGPA', 'grade-calculator': 'Grades'
    };
    var panelTools = TOOLS.map(function (t) {
      return '<a href="' + t.href + '" class="nav-chip' + (t.id === PAGE ? ' is-current' : '') + '">' +
        (MINI[t.id] || t.name) + '</a>';
    }).join('');

    return '' +
      '<div class="nav" id="nav">' +
        '<div class="nav-inner">' +
          '<a href="index.html" class="nav-brand" aria-label="Student Hub home">' +
            '<span class="nav-mark">' + ICON_CAP + '</span>Student Hub' +
          '</a>' +

          '<nav class="nav-desktop" aria-label="Main navigation">' +
            '<a href="index.html" class="nav-item' + cur(PAGE === 'home') + '">Home</a>' +
            '<div class="nav-dd">' +
              '<button type="button" id="toolsToggle" class="nav-item' + (isTool ? ' is-current' : '') + '" ' +
                'aria-expanded="false" aria-controls="toolsMenu" aria-haspopup="true">Tools ' + ICON_CHEV + '</button>' +
              '<div id="toolsMenu" class="nav-dd-menu">' + menuItems + '</div>' +
            '</div>' +
            '<a href="guides.html" class="nav-item' + (isGuides ? ' is-current' : '') + '">Guides</a>' +
            '<a href="about.html" class="nav-item' + cur(PAGE === 'about') + '">About</a>' +
            '<a href="contact.html" class="nav-item' + cur(PAGE === 'contact') + '">Contact</a>' +
            '<a href="' + ENGINEERING_URL + '" class="nav-pill" target="_blank" rel="noopener noreferrer">' +
              'Engineering ' + ICON_OUT + '</a>' +
          '</nav>' +

          '<button type="button" id="navToggle" class="nav-burger" aria-label="Open menu" ' +
            'aria-expanded="false" aria-controls="navPanel">' +
            '<span></span><span></span><span></span></button>' +
        '</div>' +

              '<div id="navPanel" class="nav-panel">' +
          '<nav class="nav-panel-inner" aria-label="Mobile navigation">' +
            '<p class="nav-panel-label">Tools</p>' +
            '<div class="nav-grid">' + panelTools + '</div>' +
            '<p class="nav-panel-label">Explore</p>' +
            '<div class="nav-grid nav-grid-3">' +
              '<a href="guides.html" class="nav-chip' + (isGuides ? ' is-current' : '') + '">Guides</a>' +
              '<a href="about.html" class="nav-chip' + (PAGE === 'about' ? ' is-current' : '') + '">About</a>' +
              '<a href="contact.html" class="nav-chip' + (PAGE === 'contact' ? ' is-current' : '') + '">Contact</a>' +
            '</div>' +
            '<a href="' + ENGINEERING_URL + '" class="nav-panel-cta" target="_blank" rel="noopener noreferrer">' +
              'Engineering Resources ' + ICON_OUT + '</a>' +
          '</nav>' +
        '</div>' +
      '</div>';
  }

  /* ---------- Navbar behaviour ---------- */
  function wireNav() {
    var nav = document.getElementById('nav');
    var toggle = document.getElementById('toolsToggle');
    var menu = document.getElementById('toolsMenu');
    var burger = document.getElementById('navToggle');
    if (!nav) return;

    function setMenu(open) {
      if (!menu || !toggle) return;
      menu.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    }
    function setPanel(open) {
      nav.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }

    if (toggle && menu) {
      toggle.addEventListener('click', function (e) {
        e.stopPropagation();
        setMenu(!menu.classList.contains('is-open'));
      });
    }
    if (burger) {
      burger.addEventListener('click', function (e) {
        e.stopPropagation();
        setPanel(!nav.classList.contains('is-open'));
      });
    }

    document.addEventListener('click', function (e) {
      if (menu && !menu.contains(e.target) && !toggle.contains(e.target)) setMenu(false);
      if (!nav.contains(e.target)) setPanel(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      if (menu && menu.classList.contains('is-open')) { setMenu(false); toggle.focus(); }
      if (nav.classList.contains('is-open')) { setPanel(false); burger.focus(); }
    });

    nav.querySelectorAll('.nav-panel a').forEach(function (a) {
      a.addEventListener('click', function () { setPanel(false); });
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 860) setPanel(false);
    });

    function onScroll() { nav.classList.toggle('is-scrolled', window.scrollY > 8); }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Footer ---------- */
  function buildFooter() {
    var toolLinks = TOOLS.map(function (t) {
      return '<li><a href="' + t.href + '">' + t.name + '</a></li>';
    }).join('');

    return '' +
      '<div class="ft">' +
        '<div class="ft-grid">' +
          '<div>' +
            '<a href="index.html" class="ft-brand"><span class="nav-mark">' + ICON_CAP + '</span>Student Hub</a>' +
            '<p class="ft-blurb">Free, fast calculators for college students. Everything runs in your browser, so your marks are never uploaded.</p>' +
          '</div>' +
          '<div>' +
            '<h3 class="ft-title">Tools</h3>' +
            '<ul class="ft-list">' + toolLinks + '</ul>' +
          '</div>' +
          '<div>' +
            '<h3 class="ft-title">Explore</h3>' +
            '<ul class="ft-list">' +
              '<li><a href="guides.html">Guides</a></li>' +
              '<li><a href="faq.html">FAQ</a></li>' +
              '<li><a href="about.html">About</a></li>' +
              '<li><a href="contact.html">Contact</a></li>' +
              '<li><a href="' + ENGINEERING_URL + '" target="_blank" rel="noopener noreferrer">Engineering Resources ↗</a></li>' +
            '</ul>' +
          '</div>' +
        '</div>' +
        '<div class="ft-bottom">' +
          '<p style="margin:0">© ' + new Date().getFullYear() +
            ' CPI Calculator · Built by Anurag Tripathi · Made with <span class="ft-heart" aria-label="love">♥</span> for college students</p>' +
          '<button type="button" id="toTop" class="ft-top" aria-label="Back to top">' + ICON_UP + ' Back to top</button>' +
        '</div>' +
      '</div>';
  }

  /* ---------- Related tools ---------- */
  function buildRelated() {
    var others = TOOLS.filter(function (t) { return t.id !== PAGE; });
    return '' +
      '<h2 class="text-xs uppercase tracking-wider text-[var(--muted)] mb-2">More student tools</h2>' +
      '<div>' +
        others.map(function (t) {
          return '<a href="' + t.href + '" class="row-link text-sm">' +
            '<span>' + t.name + '</span>' +
            '<span class="text-[var(--muted)]" aria-hidden="true">→</span></a>';
        }).join('') +
      '</div>' +
      '<a href="' + ENGINEERING_URL + '" class="row-link text-sm" target="_blank" rel="noopener noreferrer">' +
        '<span>Engineering Resources</span>' +
        '<span class="text-[var(--muted)]" aria-hidden="true">↗</span></a>';
  }

  /* ---------- Mount ---------- */
  var header = document.getElementById('site-header');
  if (header) {
    header.innerHTML = buildNav();
    wireNav();
  }

  var footer = document.getElementById('site-footer');
  if (footer) {
    footer.innerHTML = buildFooter();
    var top = document.getElementById('toTop');
    if (top) top.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  var related = document.getElementById('related-tools');
  if (related) related.innerHTML = buildRelated();
})();