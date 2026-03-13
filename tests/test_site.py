#!/usr/bin/env python3
"""
KCR Website Test Suite
Verifies all pages return HTTP 200, load theme.css, and contain key structural elements.
Run against the local dev server: python3 tests/test_site.py [base_url]
Default base_url: http://localhost:8081
"""

import sys
import re
import urllib.request
import urllib.error
from urllib.parse import urljoin, urlparse

BASE_URL = sys.argv[1].rstrip('/') if len(sys.argv) > 1 else 'http://localhost:8081'

# All real site pages (fun/one-off pages excluded)
PAGES = [
    '/',
    '/about.html', '/about/',
    '/contact.html', '/contact/',
    '/research.html', '/research/',
    '/statutes.html', '/statutes/',
    '/reports-childhood-cancer.html',
    '/reports/',
    '/resources/',
    '/software/',
    '/manuals/',
    '/training/',
    '/support/',
    '/staff/',
    '/staff/chaney.html', '/staff/chaney/',
    '/staff/clay.html', '/staff/clay/',
    '/staff/david.html', '/staff/david/',
    '/staff/ericd.html', '/staff/ericd/',
    '/staff/evan/',
    '/staff/isaac.html', '/staff/isaac/',
    '/staff/jjacob.html', '/staff/jjacob/',
    '/staff/roger.html', '/staff/roger/',
    '/staff/sgrimes.html', '/staff/sgrimes/',
    '/staff/york.html', '/staff/york/',
    '/intheabstract/',
]

# Static assets that must exist
ASSETS = [
    '/css/theme.css',
]

PASS = '\033[92m✓\033[0m'
FAIL = '\033[91m✗\033[0m'
WARN = '\033[93m~\033[0m'


def fetch(url, timeout=10):
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'KCR-Test/1.0'})
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return resp.status, resp.read().decode('utf-8', errors='replace')
    except urllib.error.HTTPError as e:
        return e.code, ''
    except Exception as e:
        return 0, str(e)


def check_page(path):
    url = BASE_URL + path
    status, body = fetch(url)
    errors = []
    warnings = []

    # HTTP status
    if status != 200:
        errors.append(f'HTTP {status}')
        return False, errors, warnings

    # Must reference theme.css
    if '/css/theme.css' not in body:
        errors.append('missing /css/theme.css link')

    # Must have nav
    if '<nav' not in body:
        errors.append('missing <nav>')

    # Must have footer
    if '<footer' not in body:
        errors.append('missing <footer>')

    # Must have a page title
    if not re.search(r'<title>[^<]+</title>', body):
        errors.append('missing <title>')

    # Must have at least one heading
    if not re.search(r'<h[123]', body):
        warnings.append('no h1/h2/h3 found')

    return len(errors) == 0, errors, warnings


def check_asset(path):
    url = BASE_URL + path
    status, body = fetch(url)
    if status != 200:
        return False, f'HTTP {status}'
    if len(body) < 100:
        return False, 'suspiciously small response'
    return True, None


def extract_internal_links(body, base_path):
    """Extract href values that are internal site links."""
    links = set()
    for href in re.findall(r'href=["\']([^"\'#?]+)["\']', body):
        if href.startswith('http') or href.startswith('mailto:') or href.startswith('tel:'):
            continue
        if href.startswith('/'):
            links.add(href)
        elif not href.startswith('//'):
            # relative — resolve against base_path directory
            base_dir = base_path.rsplit('/', 1)[0] + '/'
            resolved = urljoin(base_dir, href)
            links.add(resolved)
    return links


def check_internal_links(path, body, visited):
    """Check all internal links found on a page return non-404."""
    broken = []
    links = extract_internal_links(body, path)
    for link in sorted(links):
        # Skip anchor-only, known external, or already checked
        if link in visited:
            continue
        visited.add(link)
        # Only check HTML pages and assets (skip ?query= paths)
        if re.search(r'\?', link):
            continue
        url = BASE_URL + link
        status, _ = fetch(url)
        if status == 404:
            broken.append(link)
    return broken


def run():
    print(f'KCR Site Tests — {BASE_URL}\n')
    passes = 0
    failures = 0
    total_warnings = 0

    # 1. Asset checks
    print('── Static assets ──────────────────────────────────')
    for path in ASSETS:
        ok, err = check_asset(path)
        if ok:
            print(f'  {PASS} {path}')
            passes += 1
        else:
            print(f'  {FAIL} {path}: {err}')
            failures += 1

    # 2. Page checks
    print('\n── Page checks ────────────────────────────────────')
    visited_links = set(PAGES)
    link_errors = {}

    for path in PAGES:
        ok, errors, warnings = check_page(path)
        if ok and not warnings:
            print(f'  {PASS} {path}')
            passes += 1
        elif ok:
            print(f'  {WARN} {path}  [{"; ".join(warnings)}]')
            passes += 1
            total_warnings += len(warnings)
        else:
            print(f'  {FAIL} {path}  [{"; ".join(errors)}]')
            failures += 1

    # 3. Internal link crawl (sampled from key pages)
    print('\n── Internal link crawl ────────────────────────────')
    crawl_pages = ['/', '/about/', '/research/', '/staff/', '/resources/', '/reports/']
    visited_links = set()
    all_broken = []

    for path in crawl_pages:
        url = BASE_URL + path
        status, body = fetch(url)
        if status != 200:
            continue
        broken = check_internal_links(path, body, visited_links)
        if broken:
            for b in broken:
                print(f'  {FAIL} broken link on {path}: {b}')
                all_broken.append((path, b))
                failures += 1
        else:
            print(f'  {PASS} {path} (all internal links ok)')
            passes += 1

    # Summary
    total = passes + failures
    print(f'\n{"─" * 50}')
    print(f'Results: {passes}/{total} passed', end='')
    if total_warnings:
        print(f', {total_warnings} warning(s)', end='')
    if failures:
        print(f', {failures} FAILED')
    else:
        print(' — all good!')

    sys.exit(0 if failures == 0 else 1)


if __name__ == '__main__':
    run()
