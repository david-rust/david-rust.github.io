/**
 * KCR Theme Customizer
 * Floating panel with Primary / Secondary / Tertiary color pickers.
 * Supports "Classic" (warm amber) and "KCR Blue" base themes.
 * All settings persist in localStorage and apply before first paint.
 */
(function () {
  /* Remove no-js class immediately so JS-dependent UI isn't blocked */
  document.documentElement.classList.remove('no-js');

  var KEY_THEME  = 'kcr-theme';
  var KEY_COLORS = 'kcr-colors';
  var BLUE       = 'kcr-blue';

  /* Default accent colors for each base theme */
  var DEFAULTS = {
    'default':  { primary: '#c87a2f', secondary: '#c87a2f', tertiary: '#c87a2f' },
    'kcr-blue': { primary: '#1e4799', secondary: '#3db8d8', tertiary: '#c9a84c' }
  };

  /* ── HSL helpers for auto-generating light / dim variants ── */
  function hexToHsl(hex) {
    var r = parseInt(hex.slice(1,3),16)/255,
        g = parseInt(hex.slice(3,5),16)/255,
        b = parseInt(hex.slice(5,7),16)/255;
    var max = Math.max(r,g,b), min = Math.min(r,g,b),
        h, s, l = (max+min)/2;
    if (max === min) { h = s = 0; }
    else {
      var d = max - min;
      s = l > 0.5 ? d/(2-max-min) : d/(max+min);
      switch (max) {
        case r: h = (g-b)/d + (g<b?6:0); break;
        case g: h = (b-r)/d + 2; break;
        case b: h = (r-g)/d + 4; break;
      }
      h /= 6;
    }
    return [h*360, s*100, l*100];
  }

  function hslToHex(h, s, l) {
    h /= 360; s /= 100; l /= 100;
    var r, g, b;
    if (s === 0) { r = g = b = l; }
    else {
      function hue2rgb(p, q, t) {
        if (t<0) t+=1; if (t>1) t-=1;
        if (t<1/6) return p+(q-p)*6*t;
        if (t<1/2) return q;
        if (t<2/3) return p+(q-p)*(2/3-t)*6;
        return p;
      }
      var q = l<0.5 ? l*(1+s) : l+s-l*s, p = 2*l-q;
      r = hue2rgb(p,q,h+1/3);
      g = hue2rgb(p,q,h);
      b = hue2rgb(p,q,h-1/3);
    }
    return '#' + [r,g,b].map(function(x){
      return Math.round(x*255).toString(16).padStart(2,'0');
    }).join('');
  }

  function adjustL(hex, delta) {
    var hsl = hexToHsl(hex);
    return hslToHex(hsl[0], hsl[1], Math.max(5, Math.min(95, hsl[2]+delta)));
  }

  /* ── State helpers ── */
  function getTheme() { return localStorage.getItem(KEY_THEME) || 'default'; }

  function getSavedColors(theme) {
    try {
      var saved = JSON.parse(localStorage.getItem(KEY_COLORS) || '{}');
      return saved[theme] || DEFAULTS[theme] || DEFAULTS['default'];
    } catch(e) { return DEFAULTS[theme] || DEFAULTS['default']; }
  }

  function saveColors(theme, colors) {
    try {
      var saved = JSON.parse(localStorage.getItem(KEY_COLORS) || '{}');
      saved[theme] = colors;
      localStorage.setItem(KEY_COLORS, JSON.stringify(saved));
    } catch(e) {}
  }

  /* ── Apply theme + colors ── */
  function applyTheme(theme) {
    if (theme === BLUE) document.documentElement.setAttribute('data-theme', BLUE);
    else document.documentElement.removeAttribute('data-theme');
  }

  function applyColors(colors) {
    var el = document.documentElement;
    el.style.setProperty('--amber',      colors.primary);
    el.style.setProperty('--amber-lt',   adjustL(colors.primary,  18));
    el.style.setProperty('--amber-dim',  adjustL(colors.primary, -18));
    el.style.setProperty('--silver',     colors.secondary);
    el.style.setProperty('--silver-lt',  adjustL(colors.secondary,  18));
    el.style.setProperty('--silver-dim', adjustL(colors.secondary, -18));
    el.style.setProperty('--gold',       colors.tertiary);
    el.style.setProperty('--gold-lt',    adjustL(colors.tertiary,  18));
    el.style.setProperty('--gold-dim',   adjustL(colors.tertiary, -18));
  }

  /* Apply before first paint to avoid flash */
  var _t = getTheme();
  applyTheme(_t);
  applyColors(getSavedColors(_t));

  /* ── Logo helpers ── */
  function navLogoFilter(theme) {
    return theme === BLUE ? 'brightness(0) invert(1)' : 'brightness(0) invert(1) sepia(0.5) saturate(4) hue-rotate(2deg)';
  }

  /* Cache for KCRLogoBlack3.svg DOM */
  var _svgCache = null;
  function getMastheadSvg(callback) {
    if (_svgCache) { callback(_svgCache); return; }
    fetch('/images/KCRLogoBlack3.svg')
      .then(function(r) { return r.text(); })
      .then(function(text) {
        _svgCache = new DOMParser().parseFromString(text, 'image/svg+xml').documentElement;
        callback(_svgCache);
      })
      .catch(function() { callback(null); });
  }

  /* Build an inline SVG: CANCER REGISTRY paths → amber, everything else → white */
  function buildMastheadSvg(svgEl, accentColor, width) {
    var clone = svgEl.cloneNode(true);
    clone.setAttribute('width', width + 'px');
    clone.removeAttribute('height');
    clone.style.cssText = 'display:block;overflow:visible;position:absolute;left:-9999px;top:-9999px;';

    /* Temporarily attach to DOM so getBBox() works */
    document.body.appendChild(clone);

    clone.querySelectorAll('path').forEach(function(p) {
      /* path2 is the frontmost full-height composite shape — keep transparent
         so it doesn't paint over the letter paths behind it */
      if (p.id === 'path2') { p.style.fill = 'none'; return; }
      try {
        var bb = p.getBBox();
        /* 3D shadow/extrusion layers span full height (h > 400) — hide them
           so they don't create outlines around state, KENTUCKY, or CANCER REGISTRY */
        if (bb.height > 400) {
          p.style.fill = 'none';
        /* CANCER REGISTRY letters: y ≈ 431, height ≈ 51–54 */
        } else if (bb.y > 420 && bb.height < 100) {
          p.style.fill = accentColor;
        } else {
          p.style.fill = '#ffffff';
        }
      } catch(e) {
        p.style.fill = '#ffffff';
      }
    });

    document.body.removeChild(clone);
    clone.style.cssText = 'display:block;overflow:visible;';
    return clone;
  }

  function measureTitle() {
    var titleEl = document.querySelector('.masthead-title');
    if (!titleEl) return 280;
    var cs = getComputedStyle(titleEl);
    var probe = document.createElement('span');
    probe.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;'
      + 'font-family:' + cs.fontFamily + ';font-size:' + cs.fontSize + ';'
      + 'font-weight:' + cs.fontWeight + ';letter-spacing:' + cs.letterSpacing + ';';
    probe.textContent = 'Tracking Cancer';
    document.body.appendChild(probe);
    var w = probe.offsetWidth;
    document.body.removeChild(probe);
    return w;
  }

  function updateLogo(theme) {
    /* Nav logo — img with filter */
    var navLogo = document.querySelector('a.nav-logo');
    if (navLogo) {
      if (!navLogo.dataset.orig) navLogo.dataset.orig = navLogo.innerHTML;
      navLogo.innerHTML = '<img src="/images/KCRLogoBlack.svg" alt="Kentucky Cancer Registry" '
        + 'style="height:36px;display:block;filter:' + navLogoFilter(theme) + ';">';
      navLogo.style.display = 'flex';
      navLogo.style.alignItems = 'center';
    }

    /* Masthead logo — inline SVG with colored text paths */
    var mastLogo = document.querySelector('.masthead-logo-area');
    if (mastLogo) {
      if (!mastLogo.dataset.orig) {
        mastLogo.dataset.orig = mastLogo.innerHTML;
        mastLogo.dataset.origStyle = mastLogo.getAttribute('style') || '';
      }
      var logoWidth = measureTitle();
      var accentColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--amber').trim() || '#c87a2f';
      mastLogo.setAttribute('style', 'display:block;margin-bottom:40px;');
      getMastheadSvg(function(svgEl) {
        if (svgEl) {
          mastLogo.innerHTML = '';
          mastLogo.appendChild(buildMastheadSvg(svgEl, accentColor, logoWidth));
        } else {
          mastLogo.innerHTML = '<img src="/images/KCRLogoBlack.svg" alt="Kentucky Cancer Registry" '
            + 'style="width:' + logoWidth + 'px;height:auto;display:block;filter:brightness(0) invert(1);">';
        }
      });
    }

    /* Footer logo — subtle white watermark */
    var footerWordmark = document.querySelector('.footer-wordmark');
    if (footerWordmark && !footerWordmark.previousElementSibling?.classList.contains('footer-logo-img')) {
      var fImg = document.createElement('img');
      fImg.className = 'footer-logo-img';
      fImg.src = '/images/KCRLogoBlack.svg';
      fImg.alt = '';
      fImg.style.cssText = 'height:44px;width:auto;display:block;margin-bottom:18px;opacity:0.55;filter:brightness(0) invert(1);';
      footerWordmark.parentElement.insertBefore(fImg, footerWordmark);
    }
  }

  /* ── Build UI ── */
  document.addEventListener('DOMContentLoaded', function () {
    var theme  = getTheme();
    var colors = getSavedColors(theme);
    updateLogo(theme);

    /* ── Skip link ── */
    var skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    document.body.insertBefore(skipLink, document.body.firstChild);

    /* ── Main content landmark id ── */
    var mainEl = document.querySelector('main');
    if (mainEl && !mainEl.id) mainEl.id = 'main-content';

    /* ── ARIA: primary nav label ── */
    var primaryNav = document.querySelector('nav');
    if (primaryNav && !primaryNav.getAttribute('aria-label')) {
      primaryNav.setAttribute('aria-label', 'Primary navigation');
    }

    /* ── ARIA: sidebar nav label ── */
    var asideEl = document.querySelector('aside');
    if (asideEl) {
      var asideNav = asideEl.querySelector('.side-nav, .team-nav-section');
      if (asideNav && !asideNav.getAttribute('aria-label')) {
        asideNav.setAttribute('aria-label', 'Page sections');
        asideNav.setAttribute('role', 'navigation');
      }
    }

    /* ── Choropleth SVG accessibility ── */
    ['mastChoroSvg', 'choroSvg'].forEach(function(id) {
      var svg = document.getElementById(id);
      if (!svg) return;
      svg.setAttribute('role', 'img');
      svg.setAttribute('aria-label', 'Interactive map of Kentucky cancer incidence rates by county');
      var title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      title.textContent = 'Kentucky Cancer Incidence Rates by County';
      var desc = document.createElementNS('http://www.w3.org/2000/svg', 'desc');
      desc.textContent = 'Age-adjusted cancer incidence rates for all sites, 2019–2023, shown by county. Data from the Kentucky Cancer Registry via cancer-rates.info.';
      svg.insertBefore(desc, svg.firstChild);
      svg.insertBefore(title, svg.firstChild);
    });

    /* Floating toggle button */
    var btn = document.createElement('button');
    btn.id = 'kcr-palette-btn';
    btn.setAttribute('aria-label', 'Customize theme colors');
    btn.title = 'Customize theme colors';
    btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22C6.48 22 2 17.52 2 12S6.48 2 12 2c5.52 0 10 4.48 10 9a4 4 0 0 1-4 4h-2.7c-.4 0-.7.3-.7.7 0 .18.07.36.2.5.32.34.5.8.5 1.3 0 1.38-1.12 2.5-2.5 2.5z"/><circle cx="6.5" cy="11.5" r="1.5"/><circle cx="9.5" cy="7.5" r="1.5"/><circle cx="14.5" cy="7.5" r="1.5"/><circle cx="17.5" cy="11.5" r="1.5"/></svg>';
    document.body.appendChild(btn);

    /* Panel */
    var panel = document.createElement('div');
    panel.id = 'kcr-palette-panel';
    panel.innerHTML =
      '<div class="tcp-head">'
        + '<span class="tcp-head-title">Theme Colors</span>'
        + '<button class="tcp-close" aria-label="Close">&#x2715;</button>'
      + '</div>'
      + '<div class="tcp-mode">'
        + '<button class="tcp-preset' + (theme === 'default' ? ' active' : '') + '" data-theme="default">Classic</button>'
        + '<button class="tcp-preset' + (theme === BLUE ? ' active' : '') + '" data-theme="kcr-blue">KCR Blue</button>'
      + '</div>'
      + '<div class="tcp-colors">'
        + '<div class="tcp-row">'
          + '<label class="tcp-label" for="tcp-primary">Primary</label>'
          + '<input type="color" id="tcp-primary" value="' + colors.primary + '">'
        + '</div>'
        + '<div class="tcp-row">'
          + '<label class="tcp-label" for="tcp-secondary">Secondary</label>'
          + '<input type="color" id="tcp-secondary" value="' + colors.secondary + '">'
        + '</div>'
        + '<div class="tcp-row">'
          + '<label class="tcp-label" for="tcp-tertiary">Tertiary</label>'
          + '<input type="color" id="tcp-tertiary" value="' + colors.tertiary + '">'
        + '</div>'
      + '</div>'
      + '<button class="tcp-reset">Reset defaults</button>';
    document.body.appendChild(panel);

    /* ── Events ── */

    /* Open / close */
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      panel.classList.toggle('open');
    });
    panel.querySelector('.tcp-close').addEventListener('click', function () {
      panel.classList.remove('open');
    });
    document.addEventListener('click', function (e) {
      if (!panel.contains(e.target) && e.target !== btn) panel.classList.remove('open');
    });

    /* Base theme switcher */
    panel.querySelectorAll('.tcp-preset').forEach(function (el) {
      el.addEventListener('click', function () {
        var newTheme = this.getAttribute('data-theme');
        localStorage.setItem(KEY_THEME, newTheme);
        applyTheme(newTheme);
        panel.querySelectorAll('.tcp-preset').forEach(function (b) { b.classList.remove('active'); });
        this.classList.add('active');
        var c = getSavedColors(newTheme);
        document.getElementById('tcp-primary').value   = c.primary;
        document.getElementById('tcp-secondary').value = c.secondary;
        document.getElementById('tcp-tertiary').value  = c.tertiary;
        applyColors(c);
        updateLogo(newTheme);
      });
    });

    /* Live color pickers */
    function onColorChange() {
      var c = {
        primary:   document.getElementById('tcp-primary').value,
        secondary: document.getElementById('tcp-secondary').value,
        tertiary:  document.getElementById('tcp-tertiary').value
      };
      applyColors(c);
      saveColors(getTheme(), c);
      updateLogo(getTheme());
    }
    ['tcp-primary', 'tcp-secondary', 'tcp-tertiary'].forEach(function (id) {
      document.getElementById(id).addEventListener('input', onColorChange);
    });

    /* Reset to defaults */
    panel.querySelector('.tcp-reset').addEventListener('click', function () {
      var t = getTheme();
      var c = DEFAULTS[t] || DEFAULTS['default'];
      document.getElementById('tcp-primary').value   = c.primary;
      document.getElementById('tcp-secondary').value = c.secondary;
      document.getElementById('tcp-tertiary').value  = c.tertiary;
      applyColors(c);
      saveColors(t, c);
    });

    /* Re-measure logo on resize */
    window.addEventListener('resize', function () { updateLogo(getTheme()); });

    /* ── Team nav collapse (show first 5 + current, hide rest behind toggle) ── */
    document.querySelectorAll('.team-nav').forEach(function (nav) {
      var items = Array.prototype.slice.call(nav.querySelectorAll('.team-nav-item'));
      var SHOW = 5;
      if (items.length <= SHOW) return;

      var currentIdx = items.findIndex(function (el) { return el.classList.contains('current'); });
      var alwaysVisible = new Set();
      for (var i = 0; i < Math.min(SHOW, items.length); i++) alwaysVisible.add(i);
      if (currentIdx >= 0) alwaysVisible.add(currentIdx);

      var hidden = items.filter(function (_, i) { return !alwaysVisible.has(i); });
      hidden.forEach(function (el) { el.classList.add('team-nav-collapsed'); });

      var remaining = hidden.length;
      var toggle = document.createElement('button');
      toggle.className = 'team-nav-toggle';
      toggle.textContent = 'Show ' + remaining + ' more…';
      toggle.setAttribute('aria-expanded', 'false');
      nav.appendChild(toggle);

      var expanded = false;
      toggle.addEventListener('click', function () {
        expanded = !expanded;
        hidden.forEach(function (el) {
          el.classList.toggle('team-nav-collapsed', !expanded);
        });
        toggle.textContent = expanded ? 'Show less' : 'Show ' + remaining + ' more…';
        toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      });
    });

    /* ── Mobile hamburger menu ── */
    var navInner = document.querySelector('.nav-inner');
    if (navInner) {
      var hamburger = document.createElement('button');
      hamburger.className = 'nav-hamburger';
      hamburger.setAttribute('aria-label', 'Toggle navigation');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.innerHTML = '<svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="19" y2="6"/><line x1="3" y1="11" x2="19" y2="11"/><line x1="3" y1="16" x2="19" y2="16"/></svg>';
      navInner.appendChild(hamburger);

      var navEl = navInner.parentElement;
      hamburger.addEventListener('click', function (e) {
        e.stopPropagation();
        var open = navEl.classList.toggle('nav-open');
        hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
        hamburger.innerHTML = open
          ? '<svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="5" y1="5" x2="17" y2="17"/><line x1="17" y1="5" x2="5" y2="17"/></svg>'
          : '<svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="19" y2="6"/><line x1="3" y1="11" x2="19" y2="11"/><line x1="3" y1="16" x2="19" y2="16"/></svg>';
      });

      document.addEventListener('click', function (e) {
        if (!navEl.contains(e.target)) {
          navEl.classList.remove('nav-open');
          hamburger.setAttribute('aria-expanded', 'false');
          hamburger.innerHTML = '<svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="19" y2="6"/><line x1="3" y1="11" x2="19" y2="11"/><line x1="3" y1="16" x2="19" y2="16"/></svg>';
        }
      });

      /* ── Escape key closes nav and palette panel ── */
      document.addEventListener('keydown', function (e) {
        if (e.key !== 'Escape') return;
        if (navEl && navEl.classList.contains('nav-open')) {
          navEl.classList.remove('nav-open');
          hamburger.setAttribute('aria-expanded', 'false');
          hamburger.innerHTML = '<svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="19" y2="6"/><line x1="3" y1="11" x2="19" y2="11"/><line x1="3" y1="16" x2="19" y2="16"/></svg>';
          hamburger.focus();
        }
        var palettePanel = document.getElementById('kcr-palette-panel');
        if (palettePanel && palettePanel.classList.contains('open')) {
          palettePanel.classList.remove('open');
          var paletteBtn = document.getElementById('kcr-palette-btn');
          if (paletteBtn) paletteBtn.focus();
        }
      });
    }
  });
}());
