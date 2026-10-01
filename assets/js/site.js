/* ==========================================================================
   site.js — shared site chrome (navbar, tools dropdown, footer, related tools)
   --------------------------------------------------------------------------
   HOW TO ADD A NEW TOOL LATER
   1. Create the page (copy any existing tool page) and add one entry to TOOLS.
   2. Add a row to the "Student Tools" list in index.html (kept as static HTML
      so search engines can crawl it) and a <url> to sitemap.xml.
   The navbar dropdown, footer links and "More tools" block update automatically.
   ========================================================================== */
(function () {
  'use strict';

  /** Single source of truth for every calculator. `id` doubles as <body data-page>. */
  var TOOLS = [
    { id: 'home',            href: 'index.html',            name: 'CPI Calculator',        short: 'Calculate your CPI from subject credits and grades.' },
    { id: 'attendance',      href: 'attendance.html',       name: 'Attendance Calculator', short: 'Check attendance % and how many classes you can miss.' },
    { id: 'sgpa-cgpa',       href: 'sgpa-cgpa.html',        name: 'SGPA to CGPA',          short: 'Combine semester SGPAs into a single CGPA.' },
    { id: 'cgpa-percentage', href: 'cgpa-percentage.html',  name: 'CGPA Percentage',       short: 'Convert CGPA to percentage with university formulas.' },
    { id: 'required-cgpa',   href: 'required-cgpa.html',    name: 'Required CGPA',         short: 'Find the SGPA you need to reach a target CGPA.' },
    { id: 'grade-calculator',href: 'grade-calculator.html', name: 'Grade Calculator',      short: 'Weighted marks to final percentage and grade.' }
  ];

  var PAGE = document.body.getAttribute('data-page') || '';
  var isTool = TOOLS.some(function (t) { return t.id === PAGE && t.id !== 'home'; });

  function cls(active) { return 'nav-link' + (active ? ' active' : ''); }

  /* ---------- Navbar ---------- */
  function buildNav() {
    var items = TOOLS.map(function (t) {
      return '<a href="' + t.href + '"' + (t.id === PAGE ? ' class="active" aria-current="page"' : '') + '>' + t.name + '</a>';
    }).join('');

    return '' +
      '<nav class="border-b border-[var(--line)]" aria-label="Main navigation">' +
        '<div class="container mx-auto relative flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 px-6 py-5 max-w-3xl">' +
          '<a href="index.html" class="font-semibold text-base tracking-tight">Student Hub</a>' +
          '<div class="flex items-center gap-6 sm:gap-7 text-sm">' +
            '<a href="index.html" class="' + cls(PAGE === 'home') + '"' + (PAGE === 'home' ? ' aria-current="page"' : '') + '>Home</a>' +
            '<div class="sm:relative">' +
              '<button type="button" id="toolsToggle" class="' + cls(isTool) + ' flex items-center gap-1" aria-expanded="false" aria-controls="toolsMenu" aria-haspopup="true">' +
                'Tools <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M2 3.5l3 3 3-3"/></svg>' +
              '</button>' +
              '<div id="toolsMenu" class="nav-menu hidden absolute z-50 left-6 right-6 top-full mt-1 sm:left-0 sm:right-auto sm:w-60 sm:mt-3">' + items + '</div>' +
            '</div>' +
            '<a href="guides.html" class="' + cls(PAGE === 'guides' || PAGE === 'faq') + '"' + (PAGE === 'guides' ? ' aria-current="page"' : '') + '>Guides</a>' +
            '<a href="about.html" class="' + cls(PAGE === 'about') + '"' + (PAGE === 'about' ? ' aria-current="page"' : '') + '>About</a>' +
            '<a href="contact.html" class="' + cls(PAGE === 'contact') + '"' + (PAGE === 'contact' ? ' aria-current="page"' : '') + '>Contact</a>' +
          '</div>' +
        '</div>' +
      '</nav>';
  }

  /** Tools dropdown behaviour: click to toggle, Esc / outside click to close. */
  function wireDropdown() {
    var toggle = document.getElementById('toolsToggle');
    var menu = document.getElementById('toolsMenu');
    if (!toggle || !menu) return;

    function setOpen(open) {
      menu.classList.toggle('hidden', !open);
      toggle.setAttribute('aria-expanded', String(open));
    }
    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      setOpen(menu.classList.contains('hidden'));
    });
    document.addEventListener('click', function (e) {
      if (!menu.contains(e.target)) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { setOpen(false); toggle.focus(); }
    });
  }

  /* ---------- Footer ---------- */
  function buildFooter(badgeId) {
    var links = TOOLS.map(function (t) {
      return '<a href="' + t.href + '" class="nav-link">' + t.name + '</a>';
    }).concat([
      '<a href="guides.html" class="nav-link">Guides</a>',
      '<a href="faq.html" class="nav-link">FAQ</a>'
    ]).join('');

    var badge = badgeId
      ? '<img src="https://visitor-badge.laobi.icu/badge?page_id=' + badgeId + '" alt="visitor badge" class="inline-block ml-2 opacity-60"/>'
      : '';

    return '' +
      '<div class="container mx-auto max-w-3xl px-6 pt-8 pb-5 text-center">' +
        '<nav aria-label="Footer navigation" class="flex flex-wrap justify-center gap-x-5 gap-y-2 mb-6">' + links + '</nav>' +
        '<p>© 2025–' + new Date().getFullYear() + ' CPI Calculator — Built by Anurag Tripathi' + badge + '</p>' +
      '</div>';
  }

  /* ---------- "More tools" block (tool pages) ---------- */
  function buildRelated() {
    var others = TOOLS.filter(function (t) { return t.id !== PAGE; });
    return '' +
      '<h2 class="text-xs uppercase tracking-wider text-[var(--muted)] mb-2">More student tools</h2>' +
      '<div>' + others.map(function (t) {
        return '<a href="' + t.href + '" class="row-link text-sm"><span>' + t.name + '</span><span class="text-[var(--muted)]" aria-hidden="true">→</span></a>';
      }).join('') + '</div>';
  }

  /* ---------- Mount ---------- */
  var header = document.getElementById('site-header');
  if (header) { header.innerHTML = buildNav(); wireDropdown(); }

  var footer = document.getElementById('site-footer');
  if (footer) footer.innerHTML = buildFooter(footer.getAttribute('data-badge'));

  var related = document.getElementById('related-tools');
  if (related) related.innerHTML = buildRelated();
})();
