/**
 * KCR Theme Toggle
 * Switches between the default warm/amber theme and the KCR royal-blue theme.
 * Persists preference in localStorage. Swaps the nav wordmark to the KCR logo
 * image when the blue theme is active (requires /images/kcr-logo.png).
 */
(function () {
  var KEY   = 'kcr-theme';
  var BLUE  = 'kcr-blue';

  /* ── Warm theme icon (sun) ── */
  var ICON_WARM = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';

  /* ── Blue theme icon (half-circle palette) ── */
  var ICON_BLUE = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 0 1 0 20V2z" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="10"/></svg>';

  function getTheme() {
    return localStorage.getItem(KEY) || 'default';
  }

  function applyTheme(theme) {
    if (theme === BLUE) {
      document.documentElement.setAttribute('data-theme', BLUE);
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }

  function updateLogo(theme) {
    var logo = document.querySelector('a.nav-logo');
    if (!logo) return;

    if (theme === BLUE) {
      if (!logo.dataset.orig) {
        logo.dataset.orig = logo.innerHTML;
      }
      logo.innerHTML = '<img src="/images/kcr-logo.png" alt="Kentucky Cancer Registry" style="height:34px;display:block;">';
      logo.style.display = 'flex';
      logo.style.alignItems = 'center';
    } else {
      if (logo.dataset.orig) {
        logo.innerHTML = logo.dataset.orig;
        logo.style.display = '';
        logo.style.alignItems = '';
      }
    }
  }

  function updateButton(btn, theme) {
    if (theme === BLUE) {
      btn.innerHTML = ICON_WARM;
      btn.title = 'Switch to warm theme';
    } else {
      btn.innerHTML = ICON_BLUE;
      btn.title = 'Switch to KCR blue theme';
    }
  }

  /* Apply theme immediately before paint to avoid flash */
  applyTheme(getTheme());

  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.createElement('button');
    btn.id = 'kcr-theme-btn';
    btn.setAttribute('aria-label', 'Toggle theme');
    document.body.appendChild(btn);

    var theme = getTheme();
    updateButton(btn, theme);
    updateLogo(theme);

    btn.addEventListener('click', function () {
      var next = getTheme() === BLUE ? 'default' : BLUE;
      localStorage.setItem(KEY, next);
      applyTheme(next);
      updateButton(btn, next);
      updateLogo(next);
    });
  });
}());
