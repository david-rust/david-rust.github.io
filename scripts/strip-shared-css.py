#!/usr/bin/env python3
"""Strip shared CSS (now in theme.css) from all real KCR site pages."""

import re, os, sys

BASE = '/work'

# Selectors whose rules are now covered by theme.css and should be removed
REMOVE_SELECTORS = {
    '*,*::before,*::after', '*, *::before, *::after',
    'html', ':root', 'body', 'a', 'img',
    '.eyebrow',
    '.topbar', '.topbar-inner', '.topbar-left', '.topbar-sep',
    '.topbar-right', '.topbar-right a', '.topbar-right a:hover',
    '.topbar a', '.topbar a:hover', '.topbar-links',
    'nav', '.nav-inner', '.nav-link', '.nav-link:hover', '.nav-link.active',
    '.nav-logo', '.nav-logo span', '.nav-spacer', '.nav-search-form',
    '.nav-search-form input', '.nav-search-form input:focus',
    '.nav-search-form button', '.nav-search-form button:hover',
    '.ribbon', '.ribbon-inner', '.ribbon-label', '.ribbon-divider',
    '.ribbon-logos', '.ribbon-logos a', '.ribbon-logos a:hover', '.ribbon-logos img',
    '.ribbon-partners', '.ribbon-partner', '.ribbon-partner:hover',
    '.page-wrap',
    '.section-heading', '.section-header', '.section-link', '.section-link:hover',
    '.side-card', '.side-card-head', '.side-card-head-text', '.side-card-head-text span',
    '.side-card-head span', '.side-card-body', '.side-nav',
    '.side-nav-link', '.side-nav-link:hover', '.side-nav-link.active',
    '.side-nav-link .ico', '.side-nav-link:hover .ico',
    '.side-nav-link.indent', '.side-nav-link.indent:hover', '.side-nav-sep',
    '.dark-card', '.dark-card::before', '.dark-card .eyebrow',
    '.dark-card h3', '.dark-card p',
    '.btn-primary', '.btn-primary:hover', '.btn-ghost', '.btn-ghost:hover',
    'footer', '.footer-upper', '.footer-wordmark', '.footer-wordmark span',
    '.footer-desc', '.footer-col-title', '.footer-links',
    '.footer-link', '.footer-link:hover', '.footer-lower',
    '.footer-lower a', '.footer-lower a:hover',
    '.rise', '.rise-1', '.rise-2', '.rise-3', '.rise-4', '.rise-5',
    '@keyframes riseIn',
}

# Selectors inside @media blocks that theme.css already handles
REMOVE_RESPONSIVE = {'.page-wrap', '.footer-upper'}

FILES = [
    'index.html', 'about.html', 'about/index.html',
    'contact.html', 'contact/index.html',
    'research.html', 'research/index.html',
    'statutes.html', 'statutes/index.html',
    'reports-childhood-cancer.html',
    'reports/index.html', 'resources/index.html',
    'software/index.html', 'manuals/index.html',
    'training/index.html', 'support/index.html',
    'staff/index.html',
    'staff/chaney.html', 'staff/chaney/index.html',
    'staff/clay.html', 'staff/clay/index.html',
    'staff/david.html', 'staff/david/index.html',
    'staff/ericd.html', 'staff/ericd/index.html',
    'staff/evan/index.html',
    'staff/isaac.html', 'staff/isaac/index.html',
    'staff/jjacob.html', 'staff/jjacob/index.html',
    'staff/roger.html', 'staff/roger/index.html',
    'staff/sgrimes.html', 'staff/sgrimes/index.html',
    'staff/york.html', 'staff/york/index.html',
    'intheabstract/index.html',
]


def norm(s):
    return re.sub(r'\s+', ' ', s).strip()


def parse_blocks(css):
    """Parse CSS into list of dicts with keys: selector, inner, raw."""
    blocks = []
    i = 0
    n = len(css)

    while i < n:
        # Skip whitespace
        while i < n and css[i].isspace():
            i += 1
        if i >= n:
            break

        # Skip comments
        if css[i:i+2] == '/*':
            end = css.find('*/', i + 2)
            if end == -1:
                break
            i = end + 2
            continue

        # Find opening brace for this rule
        brace = css.find('{', i)
        if brace == -1:
            break

        selector = css[i:brace].strip()

        # Find matching closing brace (depth-aware)
        depth = 0
        j = brace
        while j < n:
            if css[j] == '{':
                depth += 1
            elif css[j] == '}':
                depth -= 1
                if depth == 0:
                    break
            j += 1

        inner = css[brace + 1:j]
        raw = css[i:j + 1]
        blocks.append({'selector': selector, 'inner': inner, 'raw': raw})
        i = j + 1

    return blocks


def strip_media_inner(inner):
    """Remove shared responsive rules from inside an @media block."""
    blocks = parse_blocks(inner)
    kept = [b['raw'] for b in blocks if norm(b['selector']) not in REMOVE_RESPONSIVE]
    return '\n  '.join(kept)


def strip_css(css_content):
    """Remove all shared rules from a <style> block's content."""
    blocks = parse_blocks(css_content)
    kept = []

    for b in blocks:
        sel = norm(b['selector'])

        if sel in REMOVE_SELECTORS:
            continue  # shared — drop it

        if sel.startswith('@keyframes riseIn'):
            continue  # shared animation — drop it

        if sel.startswith('@media'):
            new_inner = strip_media_inner(b['inner'])
            if new_inner.strip():
                kept.append(f'{b["selector"]} {{{new_inner}\n}}')
        else:
            kept.append(b['raw'])

    return '\n'.join(kept)


def process_file(path):
    with open(path, encoding='utf-8') as f:
        html = f.read()

    # 1. Inject theme.css link after the Google Fonts stylesheet link
    if '/css/theme.css' not in html:
        html = re.sub(
            r'(<link[^>]+googleapis\.com/css[^>]+>)',
            r'\1\n  <link rel="stylesheet" href="/css/theme.css">',
            html, count=1
        )

    # 2. Strip shared CSS from every <style> block
    def repl(m):
        stripped = strip_css(m.group(1))
        if stripped.strip():
            return f'<style>{stripped}\n</style>'
        return ''  # drop empty style tag

    html = re.sub(r'<style>(.*?)</style>', repl, html, flags=re.DOTALL)

    with open(path, 'w', encoding='utf-8') as f:
        f.write(html)

    print(f'  ✓ {os.path.relpath(path, BASE)}')


ok = 0
fail = 0
for fname in FILES:
    fpath = os.path.join(BASE, fname)
    if not os.path.exists(fpath):
        print(f'  - {fname}: not found', file=sys.stderr)
        continue
    try:
        process_file(fpath)
        ok += 1
    except Exception as e:
        print(f'  ✗ {fname}: {e}', file=sys.stderr)
        fail += 1

print(f'\nDone — {ok} updated, {fail} errors.')
