// @ts-check
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

const PAGES = [
  // Section pages
  { name: 'Homepage',           path: '/' },
  { name: 'About',              path: '/about/' },
  { name: 'Contact',            path: '/contact/' },
  { name: 'Research',           path: '/research/' },
  { name: 'Resources',          path: '/resources/' },
  { name: 'Reports',            path: '/reports/' },
  { name: 'Staff Directory',    path: '/staff/' },
  { name: 'Statutes',           path: '/statutes/' },
  { name: 'Support',            path: '/support/' },
  { name: 'Training',           path: '/training/' },
  { name: 'Manuals',            path: '/manuals/' },
  { name: 'Software',           path: '/software/' },
  { name: 'In the Abstract',    path: '/intheabstract/' },
  // Executive Leadership (12)
  { name: 'Staff - Eric D',     path: '/staff/ericd/' },
  { name: 'Staff - Bin Huang',  path: '/staff/bhuang/' },
  { name: 'Staff - Isaac',      path: '/staff/isaac/' },
  { name: 'Staff - Sgrimes',    path: '/staff/sgrimes/' },
  { name: 'Staff - Jcioci',     path: '/staff/jcioci/' },
  { name: 'Staff - JMcDowell',  path: '/staff/jmcdowell/' },
  { name: 'Staff - Llong',      path: '/staff/llong/' },
  { name: 'Staff - Sdickerson', path: '/staff/sdickerson/' },
  { name: 'Staff - Flei',       path: '/staff/flei/' },
  { name: 'Staff - Sbarber',    path: '/staff/sbarber/' },
  { name: 'Staff - Pcole',      path: '/staff/pcole/' },
  { name: 'Staff - Itodorova',  path: '/staff/itodorova/' },
  // Informatics Team (12)
  { name: 'Staff - David',      path: '/staff/david/' },
  { name: 'Staff - Roger',      path: '/staff/roger/' },
  { name: 'Staff - Evan Yang',  path: '/staff/evan/' },
  { name: 'Staff - JJacob',     path: '/staff/jjacob/' },
  { name: 'Staff - York',       path: '/staff/york/' },
  { name: 'Staff - Clay',       path: '/staff/clay/' },
  { name: 'Staff - Chaney',     path: '/staff/chaney/' },
  { name: 'Staff - Membry',     path: '/staff/membry/' },
  { name: 'Staff - Jgarrett',   path: '/staff/jgarrett/' },
  { name: 'Staff - Twoods',     path: '/staff/twoods/' },
  { name: 'Staff - Asword',     path: '/staff/asword/' },
  { name: 'Staff - Brepass',    path: '/staff/brepass/' },
  // Operations Team (21)
  { name: 'Staff - Mhoskins',   path: '/staff/mhoskins/' },
  { name: 'Staff - Sladd',      path: '/staff/sladd/' },
  { name: 'Staff - Scarmack',   path: '/staff/scarmack/' },
  { name: 'Staff - Lbenning',   path: '/staff/lbenningfield/' },
  { name: 'Staff - Rdowell',    path: '/staff/rdowell/' },
  { name: 'Staff - Selkosovic', path: '/staff/selkosovic/' },
  { name: 'Staff - Nramirez',   path: '/staff/nramirez/' },
  { name: 'Staff - Rwalls',     path: '/staff/rwalls/' },
  { name: 'Staff - Dmontgom',   path: '/staff/dmontgomery/' },
  { name: 'Staff - Jdenham',    path: '/staff/jdenham/' },
  { name: 'Staff - Ddarsey',    path: '/staff/ddarsey/' },
  { name: 'Staff - Sgabehart',  path: '/staff/sgabehart/' },
  { name: 'Staff - Phaydon',    path: '/staff/phaydon/' },
  { name: 'Staff - Mjmahoney',  path: '/staff/mjmahoney/' },
  { name: 'Staff - Tsumler',    path: '/staff/tsumler/' },
  { name: 'Staff - Ahubbs',     path: '/staff/ahubbs/' },
  { name: 'Staff - Kkimbler',   path: '/staff/kkimbler/' },
  { name: 'Staff - Wdreschel',  path: '/staff/wdreschel/' },
  { name: 'Staff - Sjohnson',   path: '/staff/sjohnson/' },
  { name: 'Staff - Dwiles',     path: '/staff/dwiles/' },
  { name: 'Staff - Aelbiheary', path: '/staff/aelbiheary/' },
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
      await page.waitForTimeout(800); // allow theme-toggle.js deferred scripts to fully execute
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();
      const serious = results.violations.filter(v => ['critical', 'serious'].includes(v.impact));
      if (serious.length > 0) {
        const summary = serious.map(v => `[${v.impact}] ${v.id}: ${v.description}\n  -> ${v.nodes[0]?.html?.slice(0,120) ?? ''}`).join('\n');
        throw new Error(`WCAG violations on ${name}:\n${summary}`);
      }
    });
  }
});
