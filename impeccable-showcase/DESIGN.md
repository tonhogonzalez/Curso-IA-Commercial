# DESIGN.md — Vanguard Meridian Design System
> Generated via `/impeccable document` protocol · Production Visual Foundation

## 1. Anti-Pattern Guardrails (Strict Negatives)

```yaml
BANNED_TYPOGRAPHY:
  - "Inter" (The universal AI slop font default)
  - "Roboto" (Generic mobile container default)
  - "Arial / System-UI fallback without explicit pairing"
  - "Monospace used for non-numeric decorative vibes"

BANNED_COLOR_PATTERNS:
  - "Pure Black (#000000)" -> Must use obsidian/navy-tinted darks (HSL: 222, 24%, 6%)
  - "Purple-to-Blue Gradients" -> The hallmark of uncurated AI prompts
  - "Low-contrast gray text on colored badge containers"
  - "Glow-heavy neon shadows that bleed across layout boundaries"

BANNED_LAYOUT_CONSTRUCTS:
  - "Cards inside cards inside cards" -> Flatten hierarchy using hairline borders and whitespace
  - "Uniform 48px rounded square icon blocks before every title"
  - "Endless vertical lists that could be high-information tabular matrices"
```

---

## 2. Typographic Architecture

We pair three distinct typographic families to establish immediate hierarchy and human craftsmanship:

1. **Display & Structural Headings:** `Plus Jakarta Sans` (Weights: 600, 700, 800)
   - Sharp geometric apexes with humanist open counters.
   - Letter-spacing: `-0.025em` for display sizes.
2. **Editorial Nuance & Qualitative Context:** `Newsreader` (Weights: 400, 500 Italic)
   - Used for narrative executive commentary, scenario titles, and qualitative risk notes.
   - Adds prestige and an authentic financial-press authority (FT / Economist calibre).
3. **Quantitative Metrics & Monospace Telemetry:** `JetBrains Mono` (Weights: 500, 600, tabular figures)
   - Enforced `font-variant-numeric: tabular-nums lining-nums`.
   - Never stutters when metrics fluctuate during real-time rebalancing.

---

## 3. Color Tokens & Material Physics

```css
:root {
  /* Surfaces — Tinted Obsidian Neutrals (Zero pure #000) */
  --surface-canvas:      hsl(222, 28%, 6%);     /* Base background */
  --surface-panel:       hsl(222, 24%, 8.5%);   /* Primary workspace */
  --surface-raised:      hsl(222, 20%, 11.5%);  /* Interactive rows / elevation */
  --surface-overlay:     hsl(222, 18%, 15%);    /* Popovers, menus, HUD */

  /* Hairline Dividers (Subtle precision) */
  --border-hairline:     hsla(220, 20%, 90%, 0.08);
  --border-subtle:       hsla(220, 20%, 90%, 0.14);
  --border-focus:        hsl(214, 95%, 62%);

  /* Typography Contrast (Strict APCA / WCAG AAA calibration) */
  --text-high-contrast:  hsl(215, 25%, 96%);    /* Primary titles & metrics */
  --text-medium:         hsl(217, 18%, 76%);    /* Labels & body */
  --text-subtle:         hsl(219, 14%, 54%);    /* Units, secondary footnotes */
  --text-faint:          hsl(220, 12%, 38%);    /* Grid markers, timestamps */

  /* Intentional Financial Accents (No generic neon) */
  --accent-emerald:      hsl(158, 75%, 44%);    /* Capital surplus / RORWA yield */
  --accent-emerald-tint: hsla(158, 75%, 44%, 0.12);
  --accent-amber:        hsl(38, 92%, 52%);     /* Basel watch-list / Liquidity buffer */
  --accent-amber-tint:   hsla(38, 92%, 52%, 0.12);
  --accent-crimson:      hsl(354, 84%, 58%);    /* Default probability / ECL threshold */
  --accent-crimson-tint: hsla(354, 84%, 58%, 0.12);
  --accent-cobalt:       hsl(212, 100%, 62%);   /* Primary action / Rebalancing vector */
  --accent-cobalt-tint:  hsla(212, 100%, 62%, 0.12);
}
```

---

## 4. Layout Mechanics & Spatial Cadence

* **Grid:** 12-column dynamic grid with responsive sub-panels.
* **Separation Rule:** Groupings are achieved through hairline borders (`1px solid var(--border-hairline)`) and subtle surface tonal shifts, eliminating box-in-box fatigue.
* **Data Matrix Table:** Sticky headers, monospaced tabular data with right-alignment for values and currencies, left-alignment for qualitative entity descriptors.
* **Micro-Interactions:** Fast entrance curves (`cubic-bezier(0.16, 1, 0.3, 1)` in 180ms), physical spring tactile feedback on rebalancing sliders, and full keyboard navigation.
