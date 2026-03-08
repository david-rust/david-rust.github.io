# Kentucky Cancer Registry --- Website Redesign

Redesign of the Kentucky Cancer Registry (KCR) website, built using a
structured AI-assisted workflow and a custom design system.

This project modernizes the visual language, layout consistency,
accessibility, and maintainability of the KCR public website while
preserving institutional credibility and research-grade clarity.

------------------------------------------------------------------------

## Overview

The redesign focuses on:

-   A restrained, academic visual identity
-   Strong typography hierarchy
-   Strict color discipline (single accent system)
-   Consistent page anatomy
-   Reusable layout and component patterns
-   Performance-first static architecture
-   Clean, readable, accessible markup

The site is built as a lightweight static HTML/CSS system with a shared
design foundation.

------------------------------------------------------------------------

## AI-Assisted Development Approach

This project is intentionally AI-assisted.

Instead of manually designing and coding each page from scratch, I use a
structured prompt-driven workflow to generate, refine, and extend
components while maintaining strict design constraints.

Whenever new work is needed, I begin with the same foundational prompt
shown below.

This ensures:

-   Typography consistency
-   Color discipline
-   Layout stability
-   Motion consistency
-   Component predictability

AI operates inside guardrails defined by the design system.

The result is a cohesive system that feels intentionally designed while
significantly accelerating development time.

------------------------------------------------------------------------

## Copyable AI Base Prompt

The following prompt is used as the starting context whenever additional
pages or sections are built.\
Team members can copy this directly when continuing development.

```````markdown
# Kentucky Cancer Registry — Design System

## Fonts

Two fonts from Google Fonts. Add this to every page's `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap" rel="stylesheet">
```

| Variable | Font | Usage |
|---|---|---|
| `--serif` | DM Serif Display | All headings, card titles, footer wordmark |
| `--sans` | DM Sans | Everything else — body, nav, labels, buttons |

**Rules:**
- DM Serif Display is always `font-weight: 400`. Use `font-style: italic` for emphasis moments (e.g. the hero headline).
- DM Sans body copy is always `font-weight: 300`.

---

## Color Palette

Paste these CSS variables into every page's `:root`:

```css
:root {
  /* Dark / Ink */
  --ink:       #0e1419;   /* darkest — topbar, footer bg */
  --ink-2:     #1b2530;   /* dark panels */
  --ink-3:     #243040;   /* slightly lighter dark panel */

  /* Mid tones */
  --steel:     #3d5166;   /* body text on light backgrounds */
  --mist:      #8da3b8;   /* subdued text, indent nav links */
  --fog:       #c4d0dc;   /* borders on hover states */

  /* Paper / Page */
  --paper:     #f2ede6;   /* main page background — warm off-white */
  --paper-2:   #e8e2d9;   /* input backgrounds, subtle panels */
  --paper-3:   #ddd6cb;   /* borders, dividers on light bg */

  /* Accent */
  --amber:     #c87a2f;   /* PRIMARY ACCENT — all highlights, active states */
  --amber-lt:  #e09040;   /* amber hover state */
  --amber-dim: #8a5420;   /* amber used on dark backgrounds */

  --white:     #ffffff;

  /* Typography */
  --serif: 'DM Serif Display', Georgia, serif;
  --sans:  'DM Sans', system-ui, sans-serif;

  /* Misc */
  --r: 6px;               /* standard border-radius */
}
```

**Golden rule:** Amber (`--amber`) is the **only** accent color. Do not introduce purples, blues, greens, or any other accent.

---

## Typography Scale

| Element | Size | Weight | Font | Color | Notes |
|---|---|---|---|---|---|
| Hero `h1` | `clamp(44px, 5.5vw, 76px)` | 400 | Serif | `--white` | `line-height: 0.95`, `letter-spacing: -0.02em` |
| Section `h2` | `26–36px` | 400 | Serif | `--ink` | `letter-spacing: -0.02em` |
| Card `h3` | `18–20px` | 400 | Serif | `--ink` | `letter-spacing: -0.01em` |
| Eyebrow label | `10.5px` | 600 | Sans | `--amber` | Uppercase, `letter-spacing: 0.22em` |
| Body copy | `16px` | 300 | Sans | `--steel` | `line-height: 1.8` |
| Nav links | `12.5px` | 600 | Sans | `--steel` | Uppercase, `letter-spacing: 0.07em` |
| Small labels | `10–12px` | 600 | Sans | varies | Uppercase, `letter-spacing: 0.1–0.25em` |
| Footer links | `13px` | 400 | Sans | `rgba(255,255,255,0.35)` | |

---

## Page Anatomy

Every page follows this structure, top to bottom:

```
┌─────────────────────────────────────┐
│  1. TOPBAR         (--ink, 36px)    │
├─────────────────────────────────────┤
│  2. MASTHEAD/HERO  (--ink)          │
├─────────────────────────────────────┤
│  3. NAV            (--paper, 48px)  │  ← sticky, top: 0
├─────────────────────────────────────┤
│  4. PARTNER RIBBON (--ink-2, 64px)  │
├─────────────────────────────────────┤
│  5. PAGE BODY      (--paper)        │
│     └── 2-column grid               │
│         ├── Main content (1fr)      │
│         └── Sidebar (340px)         │
├─────────────────────────────────────┤
│  6. FOOTER         (--ink)          │
│     ├── 4-column upper              │
│     └── Single-row lower            │
└─────────────────────────────────────┘
```

---

## Layout & Spacing

```css
/* Max content width — wrap all sections in this */
.inner {
  max-width: 1320px;
  margin: 0 auto;
  padding: 0 40px;
}

/* Main page body grid */
.page-wrap {
  max-width: 1320px;
  margin: 0 auto;
  padding: 72px 40px 80px;
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 72px;
}

/* Feature card grid */
.feature-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

/* Footer upper grid */
.footer-upper {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr 1fr;
  gap: 48px;
}
```

**Spacing rhythm:** Use multiples of 8px for all padding/margin/gap values.

---

## Masthead (Homepage Only)

The masthead is a full-viewport-height two-column dark panel. The **right column contains a live D3 choropleth map** of Kentucky county-level cancer incidence rates — this is a homepage-exclusive feature and should not be replicated on other pages.

### Layout
```css
.masthead {
  background: var(--ink);
  min-height: calc(100vh - 36px);
  display: grid;
  grid-template-columns: 1fr 1fr;
  position: relative;
  overflow: hidden;
}
```

### Left Column
Contains, top to bottom: logo lockup, hero `h1` with an italic amber second line, subtitle paragraph, two CTA buttons (primary + ghost), and a 3-stat grid. Stats use DM Serif Display `34px` in white with amber accents on suffix characters (e.g. `+`).

### Right Column — Live Choropleth
The right column is itself a grid:

```css
.mast-choro-grid {
  display: grid;
  grid-template-columns: 1fr 170px;
  height: 100%;
}
```

**Map canvas** (`#mastChoroSvg`): Full-height D3 SVG. Has an absolute-positioned gradient title header overlay at top, a floating tooltip (`#mastChoroTip`), a legend (`#mastChoroLegend`), and a bottom gradient bar with map label and link to the full explorer.

**Side panel** (`.mast-panel`): Narrow dark glass panel (`background: rgba(10,16,20,0.75)`, `backdrop-filter: blur(4px)`, `border-left: 1px solid rgba(255,255,255,0.07)`). Updates on county hover, showing county name, age-adjusted rate, delta vs. KY average (red if above, green if below), and state rank out of 120.

---

## Choropleth Map (Homepage Only)

The interactive county map appears **only on the homepage** — once in the masthead right column, and once in the main page body. Both instances are driven by the same `drawChoro()` JavaScript function.

### Data
120 Kentucky counties, FIPS codes `21001`–`21239`. Age-adjusted cancer incidence rates per 100,000 (2019–2023, all sites). KY statewide average: **524.6**.

### Color Scale
8-step D3 quantile scale — light cream (low rates) to deep dark brown (high rates):
```javascript
var COLORS = ['#f5efe6','#f0d9b5','#e8b97a','#d9904a','#c87a2f','#aa5a18','#843a0a','#561e00'];
var colorScale = d3.scaleQuantile().domain(rates).range(COLORS);
```

### Dependencies
- `/js/d3.min.js`
- `/js/topojson.min.js`
- `/js/counties-10m.json` — US counties TopoJSON, filtered to FIPS starting with `21`

### Projection
```javascript
d3.geoAlbers()
  .rotate([87.5, 0])
  .center([0, 37.5])
  .parallels([36.0, 38.5])
  .fitSize([W, H], { type: 'FeatureCollection', features: kyFeatures })
```

### Interaction
On `mousemove`: tooltip appears near cursor (flips left if near right edge), side panel updates with county stats. On `mouseleave`: tooltip hides. Active county: `stroke: white; stroke-width: 2px`.

### Body Map Section Layout
```css
/* In-page map uses a slightly wider side panel */
.choro-body {
  display: grid;
  grid-template-columns: 1fr 200px;
  min-height: 440px;
}
/* Side panel uses --ink background (not glass) */
.choro-panel { background: var(--ink); padding: 20px 16px; }
/* Legend overlaid bottom-left of map canvas */
.choro-legend { position: absolute; bottom: 14px; left: 14px; }
```

---

## Director Statement Block

A prominent editorial section on the homepage main column, appearing after the map section.

```css
.director-block {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 40px;
  align-items: start;
  background: white;
  border: 1px solid var(--paper-3);
  border-radius: var(--r);
  padding: 36px;
  position: relative;
  overflow: hidden;
}
/* Decorative large opening quote mark */
.director-block::before {
  content: '\201C';
  position: absolute;
  top: -10px; right: 28px;
  font-family: var(--serif);
  font-size: 140px;
  color: var(--paper-2);
  line-height: 1;
  pointer-events: none;
}
```

**Left column:** Portrait photo with `aspect-ratio: 3/4`, `object-position: center 15%`, `border-radius: 4px`. Below the photo: name in DM Serif Display `15px`, title as amber eyebrow label.

**Right column:** A disclaimer label, 2–3 body paragraphs, then a source line with link.

```css
.director-disclaimer {
  font-size: 11px; font-weight: 600;
  letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--mist);
  display: flex; align-items: center; gap: 8px;
}
.director-disclaimer::before {
  content: ''; display: inline-block;
  width: 20px; height: 1px; background: var(--fog);
}
.director-text {
  font-size: 16px; line-height: 1.85;
  color: var(--steel); font-weight: 300;
  margin-bottom: 14px;
}
.director-source {
  margin-top: 20px; padding-top: 16px;
  border-top: 1px solid var(--paper-3);
  font-size: 12px; color: var(--mist);
  display: flex; align-items: center; gap: 8px;
}
.director-source a { color: var(--amber); font-weight: 600; transition: color 0.15s; }
.director-source a:hover { color: var(--amber-lt); }
```

---

## Component Patterns

### Eyebrow + Heading Combo
Used before every major section:

```html
<div class="eyebrow">Label Text Here</div>
<h2 class="section-heading">Section Title</h2>
```

```css
.eyebrow {
  font-size: 10.5px; font-weight: 600;
  letter-spacing: 0.22em; text-transform: uppercase;
  color: var(--amber); margin-bottom: 10px;
}
.section-heading {
  font-family: var(--serif); font-size: 26px; font-weight: 400;
  color: var(--ink); letter-spacing: -0.01em;
  line-height: 1; margin-top: 6px;
}
```

---

### Section Header (with link)
```html
<div class="section-header">
  <div>
    <div class="eyebrow">Subsection Label</div>
    <h2 class="section-heading">Title Here</h2>
  </div>
  <a href="#" class="section-link">
    See All
    <svg><!-- right arrow --></svg>
  </a>
</div>
```

```css
.section-header {
  display: flex; align-items: flex-end; justify-content: space-between;
  margin-bottom: 20px; padding-bottom: 14px;
  border-bottom: 1px solid var(--paper-3);
}
.section-link {
  font-size: 12px; font-weight: 600; letter-spacing: 0.1em;
  text-transform: uppercase; color: var(--amber);
  display: flex; align-items: center; gap: 5px; transition: gap 0.15s;
}
.section-link:hover { gap: 9px; }
```

---

### Cards (light)
```css
.fcard {
  background: white; border-radius: var(--r); padding: 28px;
  border: 1px solid var(--paper-3); transition: all 0.2s;
  position: relative; overflow: hidden;
}
.fcard::after {
  content: ''; position: absolute;
  bottom: 0; left: 0; right: 0; height: 2px;
  background: var(--amber); transform: scaleX(0);
  transform-origin: left; transition: transform 0.3s ease;
}
.fcard:hover { box-shadow: 0 12px 40px rgba(14,20,25,0.10); transform: translateY(-3px); border-color: var(--fog); }
.fcard:hover::after { transform: scaleX(1); }
```

---

### Cards (dark)
```css
.dark-card { background: var(--ink-2); border-radius: var(--r); padding: 24px; }
/* Tags/eyebrows: var(--amber) */
/* Headings: rgba(255,255,255,0.85) — use DM Serif */
/* Body text: rgba(255,255,255,0.38) */
/* Links/interactive: rgba(255,255,255,0.55) → hover var(--amber-lt) */
```

---

### Buttons

```css
.btn-primary {
  display: inline-flex; align-items: center; gap: 8px;
  background: var(--amber); color: white;
  padding: 12px 24px; border-radius: 3px;
  font-family: var(--sans); font-size: 13px; font-weight: 600;
  letter-spacing: 0.05em; text-transform: uppercase;
  transition: background 0.2s, transform 0.15s;
}
.btn-primary:hover { background: var(--amber-lt); transform: translateY(-1px); }

.btn-ghost {
  display: inline-flex; align-items: center; gap: 8px;
  background: transparent; color: rgba(255,255,255,0.6);
  border: 1px solid rgba(255,255,255,0.18);
  padding: 12px 24px; border-radius: 3px;
  font-family: var(--sans); font-size: 13px; font-weight: 500;
  letter-spacing: 0.04em; transition: all 0.2s;
}
.btn-ghost:hover { border-color: rgba(255,255,255,0.4); color: white; }
```

---

### Navigation

```css
nav {
  background: var(--paper); border-bottom: 1px solid var(--paper-3);
  position: sticky; top: 0; z-index: 200;
}
.nav-link {
  display: flex; align-items: center;
  padding: 0 18px; height: 48px;
  font-family: var(--sans); font-size: 12.5px; font-weight: 600;
  letter-spacing: 0.07em; text-transform: uppercase;
  color: var(--steel); border-bottom: 2px solid transparent;
  transition: all 0.15s;
}
.nav-link:hover { color: var(--ink); }
.nav-link.active { color: var(--ink); border-bottom-color: var(--amber); }
```

---

### Sidebar Navigation Links

```css
.side-nav-link {
  display: flex; align-items: center; gap: 10px;
  padding: 9px 22px; font-size: 13.5px;
  color: var(--steel); border-left: 2px solid transparent;
  transition: all 0.15s;
}
.side-nav-link:hover { color: var(--ink); background: var(--paper); border-left-color: var(--amber); }
.side-nav-link.indent { padding-left: 40px; font-size: 13px; color: var(--mist); }
.side-nav-link.indent:hover { color: var(--steel); }
```

---

### Sidebar Card Shell

```css
.side-card {
  background: white; border-radius: var(--r);
  border: 1px solid var(--paper-3); overflow: hidden; margin-bottom: 20px;
}
.side-card-head {
  background: var(--ink); padding: 16px 22px;
  font-size: 12px; font-weight: 600; letter-spacing: 0.12em;
  text-transform: uppercase; color: rgba(255,255,255,0.7);
}
.side-card-head span { color: var(--amber); }
```

---

### Topbar

```css
.topbar {
  background: var(--ink); height: 36px;
  display: flex; align-items: center; padding: 0 40px;
  font-family: var(--sans); font-size: 11px;
  letter-spacing: 0.06em; color: rgba(255,255,255,0.3);
}
.topbar a { color: rgba(255,255,255,0.35); transition: color 0.15s; }
.topbar a:hover { color: var(--amber-lt); }
```

---

### Partner / Affiliate Ribbon

```css
.ribbon { background: var(--ink-2); }
.ribbon-inner {
  max-width: 1320px; margin: 0 auto; padding: 0 40px;
  display: flex; align-items: center; height: 64px; gap: 32px;
}
.ribbon-logos a { filter: brightness(0) invert(1); opacity: 0.22; transition: opacity 0.2s; }
.ribbon-logos a:hover { opacity: 0.55; }
.ribbon-logos img { height: 28px; max-width: 110px; object-fit: contain; }
```

---

### Footer

```css
footer { background: var(--ink); }

.footer-col-title {
  font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase;
  color: rgba(255,255,255,0.3); font-weight: 600; margin-bottom: 16px;
}
.footer-link { font-size: 13px; color: rgba(255,255,255,0.35); transition: color 0.15s; }
.footer-link:hover { color: var(--amber-lt); }

.footer-wordmark { font-family: var(--serif); font-size: 22px; color: rgba(255,255,255,0.75); font-weight: 400; }
.footer-wordmark span { color: var(--amber); }

.footer-lower {
  padding: 20px 40px; display: flex; align-items: center;
  justify-content: space-between; font-size: 11.5px;
  color: rgba(255,255,255,0.28);
  border-top: 1px solid rgba(255,255,255,0.06);
}
```

---

## Borders & Dividers

| Context | Value |
|---|---|
| Cards on light bg | `1px solid var(--paper-3)` |
| Section dividers | `border-bottom: 1px solid var(--paper-3)` |
| Sidebar dividers | `border-top: 1px solid var(--paper-2)` |
| Borders on dark panels | `1px solid rgba(255,255,255,0.06–0.12)` |
| Active left border (nav) | `2px solid var(--amber)` |
| Active bottom border (nav) | `2px solid var(--amber)` |

---

## Animations

### Page Load Fade-Up

```css
@keyframes riseIn {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}
.rise   { opacity: 0; animation: riseIn 0.7s ease forwards; }
.rise-1 { animation-delay: 0.05s; }
.rise-2 { animation-delay: 0.15s; }
.rise-3 { animation-delay: 0.25s; }
.rise-4 { animation-delay: 0.35s; }
.rise-5 { animation-delay: 0.45s; }
```

### Hover Transitions
- Fast (borders, colors): `transition: all 0.15s`
- Standard: `transition: all 0.2s`
- Slow (card lifts, image fades): `transition: all 0.25–0.3s`

---

## Border Radius

| Size | Value | Used for |
|---|---|---|
| Standard | `6px` | Cards, modals |
| Small | `3–4px` | Buttons, input fields, tabs |
| Large | `8px` | Icon boxes inside cards |

---

## Responsive Breakpoint

```css
@media (max-width: 960px) {
  .masthead { grid-template-columns: 1fr; }
  .masthead-right, .masthead-rule { display: none; }
  .page-wrap { grid-template-columns: 1fr; }
  .footer-upper { grid-template-columns: 1fr 1fr; }
}
```

---

## Design Principles (for prompting)

When asking Claude to build new pages or sections, include these notes:

1. **Amber is the only accent.** No other accent colors.
2. **Headings are always DM Serif Display** — never DM Sans for titles.
3. **Body copy is weight 300**, color `--steel` on light, `rgba(255,255,255,0.38)` on dark.
4. **Paper background** (`#f2ede6`) on all light pages — never pure white as a page bg.
5. **Dark panels use `--ink-2`** (`#1b2530`) — never pure black.
6. **Cards lift on hover** — `translateY(-3px)` + shadow + amber underline reveal.
7. **All interactive elements transition at 0.15–0.2s** — nothing jarring.
8. **Stagger page load animations** with `.rise` classes — don't animate everything at once.
9. **Sections always start** with an eyebrow label in amber, then the heading below it.
10. **Max width is 1320px**, page padding is `0 40px` on sides.
11. **The choropleth map is homepage-only.** Do not add maps, D3, or TopoJSON to any other page. Inner pages use static content only.
12. **The Director Statement block** is homepage-only — a white card with `200px` photo column + text, decorative serif quote mark via `::before`.

---

## Pages Built So Far

- [x] **Homepage** (`index.html`) — masthead with live D3 choropleth, nav, ribbon, intro, in-page choropleth, director statement, feature cards, sidebar, footer
- [x] About
- [x] Research / Data Requests
- [x] Technical Resources
- [x] Reports (Childhood Cancer)
- [x] Contact
- [x] Staff Directory
- [x] Meaningful Use (Stage 2 & 3)
- [x] Statutes


```````





------------------------------------------------------------------------

## Architecture

Every page follows the same structure:

1.  Topbar\
2.  Masthead / Hero\
3.  Sticky Navigation\
4.  Partner Ribbon\
5.  Page Body (2-column grid)\
6.  Footer

Layout Standards:

-   Max width: 1320px\
-   Side padding: 40px\
-   Spacing rhythm: multiples of 8px\
-   Paper background for light pages (never pure white)\
-   Subtle hover lift on cards\
-   Predictable interaction timing

------------------------------------------------------------------------

## Pages Completed

-   Homepage
-   About
-   Research / Data Requests
-   Technical Resources
-   Reports (Childhood Cancer)
-   Contact
-   Staff Directory
-   Meaningful Use (Stage 2 & 3)

## Pages Remaining

-   Statutes

------------------------------------------------------------------------

## Maintainer

David Rust, MS\
CPDMS Team Lead\
Kentucky Cancer Registry\
University of Kentucky
