/**
 * KCR Theme Customizer
 * Floating panel with Primary / Secondary / Tertiary color pickers.
 * Supports "Classic" (warm amber) and "KCR Blue" base themes.
 * All settings persist in localStorage and apply before first paint.
 */
(function () {
  var KEY_THEME  = 'kcr-theme';
  var KEY_COLORS = 'kcr-colors';
  var BLUE       = 'kcr-blue';

  /* Default accent colors for each base theme */
  var DEFAULTS = {
    'default':  { primary: '#c87a2f', secondary: '#8da3b8', tertiary: '#c87a2f' },
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

  /* ── Logo swap ── */
  function navLogoFilter(theme) {
    return theme === BLUE ? 'brightness(0) invert(1)' : 'brightness(0) invert(1) sepia(0.5) saturate(4) hue-rotate(2deg)';
  }
  function mastheadLogoFilter() {
    return 'brightness(0) invert(1)'; /* always white — masthead is always dark */
  }

  function updateLogo(theme) {
    /* Nav logo */
    var navLogo = document.querySelector('a.nav-logo');
    if (navLogo) {
      if (!navLogo.dataset.orig) navLogo.dataset.orig = navLogo.innerHTML;
      navLogo.innerHTML = '<img src="/images/KCRLogoBlack.svg" alt="Kentucky Cancer Registry" '
        + 'style="height:36px;display:block;filter:' + navLogoFilter(theme) + ';">';
      navLogo.style.display = 'flex';
      navLogo.style.alignItems = 'center';
    }

    /* Masthead logo — width matches the "Tracking Cancer" headline */
    var mastLogo = document.querySelector('.masthead-logo-area');
    if (mastLogo) {
      if (!mastLogo.dataset.orig) {
        mastLogo.dataset.orig = mastLogo.innerHTML;
        mastLogo.dataset.origStyle = mastLogo.getAttribute('style') || '';
      }
      var titleEl = document.querySelector('.masthead-title');
      var logoWidth = 280;
      if (titleEl) {
        var cs = getComputedStyle(titleEl);
        var probe = document.createElement('span');
        probe.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;'
          + 'font-family:' + cs.fontFamily + ';font-size:' + cs.fontSize + ';'
          + 'font-weight:' + cs.fontWeight + ';letter-spacing:' + cs.letterSpacing + ';';
        probe.textContent = 'Tracking Cancer';
        document.body.appendChild(probe);
        logoWidth = probe.offsetWidth;
        document.body.removeChild(probe);
      }
      mastLogo.setAttribute('style', 'display:block;margin-bottom:40px;');
      mastLogo.innerHTML = '<img src="/images/KCRLogoBlack.svg" alt="Kentucky Cancer Registry" '
        + 'style="width:' + logoWidth + 'px;height:auto;display:block;'
        + 'filter:brightness(0) invert(1);opacity:0.92;">';
    }

    /* Footer logo — subtle white watermark */
    var footerWordmark = document.querySelector('.footer-wordmark');
    if (footerWordmark && !footerWordmark.previousElementSibling?.classList.contains('footer-logo-img')) {
      var fImg = document.createElement('img');
      fImg.className = 'footer-logo-img';
      fImg.src = '/images/KCRLogoBlack.svg';
      fImg.alt = 'Kentucky Cancer Registry';
      fImg.style.cssText = 'height:44px;width:auto;display:block;margin-bottom:18px;opacity:0.55;filter:brightness(0) invert(1);';
      footerWordmark.parentElement.insertBefore(fImg, footerWordmark);
    }
  }

  /* ── Build UI ── */
  document.addEventListener('DOMContentLoaded', function () {
    var theme  = getTheme();
    var colors = getSavedColors(theme);
    updateLogo(theme);

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
          + '<span class="tcp-label">Primary</span>'
          + '<input type="color" id="tcp-primary" value="' + colors.primary + '">'
        + '</div>'
        + '<div class="tcp-row">'
          + '<span class="tcp-label">Secondary</span>'
          + '<input type="color" id="tcp-secondary" value="' + colors.secondary + '">'
        + '</div>'
        + '<div class="tcp-row">'
          + '<span class="tcp-label">Tertiary</span>'
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
        updateLogo(newTheme);
        panel.querySelectorAll('.tcp-preset').forEach(function (b) { b.classList.remove('active'); });
        this.classList.add('active');
        var c = getSavedColors(newTheme);
        document.getElementById('tcp-primary').value   = c.primary;
        document.getElementById('tcp-secondary').value = c.secondary;
        document.getElementById('tcp-tertiary').value  = c.tertiary;
        applyColors(c);
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
  });
}());
