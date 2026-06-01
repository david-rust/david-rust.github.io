// @ts-check
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

const PAGES = [
  { name: 'Homepage',          path: '/' },
  { name: 'About',             path: '/about/' },
  { name: 'Contact',           path: '/contact/' },
  { name: 'Research',          path: '/research/' },
  { name: 'Resources',         path: '/resources/' },
  { name: 'Reports',           path: '/reports/' },
  { name: 'Staff Directory',   path: '/staff/' },
  { name: 'Statutes',          path: '/statutes/' },
  { name: 'Support',           path: '/support/' },
  { name: 'Training',          path: '/training/' },
  { name: 'Manuals',           path: '/manuals/' },
  { name: 'Software',          path: '/software/' },
  { name: 'In the Abstract',   path: '/intheabstract/' },
];

// ── Smoke tests: every page loads with HTTP 200 ────────────────────────────
test.describe('Page loads', () => {
  for (const { name, path } of PAGES) {
    test(`${name} returns 200`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response.status()).toBe(200);
    });
  }
});

// ── Title tests: every page has a non-empty <title> ────────────────────────
test.describe('Page titles', () => {
  for (const { name, path } of PAGES) {
    test(`${name} has a title`, async ({ page }) => {
      await page.goto(path);
      const title = await page.title();
      expect(title.trim().length).toBeGreaterThan(0);
    });
  }
});

// ── Navigation: top nav links on homepage resolve without 404 ──────────────
test.describe('Navigation links', () => {
  test('All nav links on homepage return 200', async ({ page }) => {
    await page.goto('/');
    const links = await page.locator('nav a').all();
    for (const link of links) {
      const href = await link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('http')) continue;
      const response = await page.goto(href);
      expect(response.status(), `Nav link ${href} should return 200`).toBe(200);
    }
  });
});

// ── Homepage: key elements present ─────────────────────────────────────────
test.describe('Homepage elements', () => {
  test.beforeEach(async ({ page }) => { await page.goto('/'); });

  test('Logo / wordmark is visible', async ({ page }) => {
    await expect(page.locator('.masthead-logo-area')).toBeVisible();
  });

  test('Hero headline is visible', async ({ page }) => {
    await expect(page.locator('.masthead-title')).toBeVisible();
  });

  test('Choropleth SVG renders', async ({ page }) => {
    await page.waitForSelector('#mastChoroSvg path', { timeout: 8000 });
    const countyCount = await page.locator('#mastChoroSvg path').count();
    expect(countyCount).toBeGreaterThan(100);
  });

  test('Primary CTA button is visible', async ({ page }) => {
    await expect(page.locator('.btn-primary').first()).toBeVisible();
  });

  test('Footer is present', async ({ page }) => {
    await expect(page.locator('footer')).toBeVisible();
  });
});

// ── Accessibility: axe-core scan on every page ─────────────────────────────
test.describe('Accessibility', () => {
  for (const { name, path } of PAGES) {
    test(`${name} has no critical a11y violations`, async ({ page }) => {
      await page.goto(path);
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();
      const critical = results.violations.filter(v => v.impact === 'critical');
      if (critical.length > 0) {
        const summary = critical.map(v => `${v.id}: ${v.description}`).join('\n');
        throw new Error(`Critical a11y violations on ${name}:\n${summary}`);
      }
    });
  }
});
