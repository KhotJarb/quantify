# Quantify — Design System (`design.md`)

> **Aesthetic:** Warm Precision Instrument (Japandi Stone & Walnut × Braun / Dieter Rams Instrument Craft)  
> **Version:** 2.0  
> **Scope:** Authoritative visual & interaction contract for every page, calculator workbench, bespoke component, and embeddable widget.

---

## 1. Visual Philosophy

Quantify is a **deterministic mathematical instrument**, not a generic calculator directory or marketing template. Every surface should feel milled, calm, tactile, and mathematically trustworthy—like a Dieter Rams pocket instrument resting on warm Japanese paper.

**Non-negotiables:**
- **Zero pure extremes:** Never `#000000` or `#ffffff` as base surfaces. Every neutral carries warm stone/walnut chroma (`H ≈ 65°–75°`).
- **One precision accent:** Burnt brushed bronze (`--color-accent`), occupying ≤ 5% of any viewport. No purple/blue gradients, no neon halos, no glow shadows on dark mode.
- **Elevation via lightness on dark, subtle hairline borders everywhere:** On dark surfaces, elevated layers step up in lightness (~+3–4% L per level), never blurred drop shadows.
- **No italic headers:** Display and section headings are always roman (`font-style: normal`). Emphasis uses weight, bronze accent, or subtle rules.
- **No raw OS emojis in UI chrome:** All navigation, suite, status, and action icons use `lucide-react` (`strokeWidth={1.75}`).
- **Tabular numerals everywhere:** Every calculated value, delta, slider readout, stat counter, and keypad digit uses `font-variant-numeric: tabular-nums`.

---

## 2. Locked OKLCH Color Tokens

All components—including all 7 bespoke calculators—MUST consume these semantic CSS custom properties from `src/app/globals.css`. Inline hex or hardcoded dark-only surfaces are forbidden.

### Light Mode — Warm Alabaster Paper (`:root`)
| Token | Value | Role |
|---|---|---|
| `--color-paper` | `oklch(97.4% 0.008 75)` | Primary canvas background |
| `--color-surface` | `oklch(99.1% 0.004 75)` | Elevated cards, workbench panes, inputs |
| `--color-surface-2` | `oklch(94.4% 0.011 74)` | Sidebar rail, recessed tracks, secondary badges |
| `--color-surface-3` | `oklch(90.8% 0.014 72)` | Hover/active pills, subtle keycaps |
| `--color-rule` | `oklch(86.5% 0.012 72)` | Default 1px structural hairline |
| `--color-rule-strong` | `oklch(75.5% 0.015 70)` | Input borders, active dividers |
| `--color-ink` | `oklch(18.5% 0.012 65)` | Primary text (> 13:1 contrast) |
| `--color-ink-2` | `oklch(37.5% 0.012 65)` | Secondary body text (> 7.5:1 contrast) |
| `--color-ink-muted` | `oklch(50.5% 0.012 68)` | Labels, metadata, placeholders (≥ 4.6:1 contrast) |
| `--color-accent` | `oklch(48.5% 0.125 50)` | Primary precision bronze accent (> 4.8:1 on paper) |
| `--color-accent-hover` | `oklch(41.5% 0.130 50)` | Hover state for primary bronze |
| `--color-accent-soft` | `oklch(93.8% 0.026 58)` | Active pills, highlighted output background |
| `--color-accent-ink` | `oklch(98.5% 0.005 75)` | Text on solid `--color-accent` buttons |
| `--color-positive` | `oklch(46.0% 0.115 152)` | Positive delta / optimal clinical status |
| `--color-positive-soft` | `oklch(93.8% 0.025 152)` | Positive subtle tint |
| `--color-warning` | `oklch(54.0% 0.135 72)` | Borderline / caution status |
| `--color-warning-soft` | `oklch(94.8% 0.030 76)` | Warning subtle tint |
| `--color-danger` | `oklch(49.5% 0.155 26)` | High-risk / error / negative status |
| `--color-danger-soft` | `oklch(94.8% 0.026 26)` | Error subtle tint |
| `--color-info` | `oklch(47.0% 0.085 225)` | Informational / Scenario B accent |
| `--color-info-soft` | `oklch(93.8% 0.022 225)` | Scenario B / info subtle tint |

### Dark Mode — Deep Obsidian Walnut (`.dark`)
| Token | Value | Role |
|---|---|---|
| `--color-paper` | `oklch(14.5% 0.009 65)` | Primary canvas background |
| `--color-surface` | `oklch(18.5% 0.010 65)` | Elevated cards, workbench panes |
| `--color-surface-2` | `oklch(22.5% 0.011 65)` | Sidebar rail, inputs, recessed tracks |
| `--color-surface-3` | `oklch(27.0% 0.012 65)` | Active/hover surface |
| `--color-rule` | `oklch(28.5% 0.012 65)` | Structural hairline |
| `--color-rule-strong` | `oklch(38.0% 0.014 65)` | Input & focus boundaries |
| `--color-ink` | `oklch(94.2% 0.008 75)` | Primary text |
| `--color-ink-2` | `oklch(76.5% 0.010 72)` | Secondary body text |
| `--color-ink-muted` | `oklch(62.5% 0.010 70)` | Metadata & labels (> 5:1 on surface) |
| `--color-accent` | `oklch(74.5% 0.115 58)` | Luminous brushed bronze |
| `--color-accent-hover` | `oklch(80.5% 0.120 58)` | Hover bronze |
| `--color-accent-soft` | `oklch(24.0% 0.032 58)` | Highlighted surface tint |
| `--color-accent-ink` | `oklch(15.5% 0.012 60)` | High-contrast ink on bronze buttons |
| `--color-positive` | `oklch(73.0% 0.120 152)` | Positive / optimal status |
| `--color-positive-soft` | `oklch(23.0% 0.035 152)` | Positive tint |
| `--color-warning` | `oklch(78.5% 0.130 76)` | Warning status |
| `--color-warning-soft` | `oklch(25.0% 0.040 74)` | Warning tint |
| `--color-danger` | `oklch(70.5% 0.150 26)` | Error / high-risk status |
| `--color-danger-soft` | `oklch(24.0% 0.045 26)` | Error tint |
| `--color-info` | `oklch(73.0% 0.095 225)` | Scenario B / informational accent |
| `--color-info-soft` | `oklch(23.5% 0.032 225)` | Scenario B / info tint |

---

## 3. Typography (2+1 Pairing via `next/font/google`)

1. **Display (`--font-display`):** `Fraunces` (optical-size variable serif, upright roman only, weights `500`, `600`, `700`) — page titles, brand wordmark, editorial headers. Tight tracking (`-0.025em`), line-height `1.12`.
2. **Body & UI (`--font-sans`):** `IBM Plex Sans` (weights `400`, `500`, `600`, `700`) — crisp engineering legibility for forms, controls, descriptions, and guides. Line-height `1.55`.
3. **Numerals & Formulas (`--font-mono`):** `IBM Plex Mono` (weights `400`, `500`, `600`) — strictly for live calculation outputs, numeric inputs, formula audit expressions, keyboard shortcuts, and counters. Always paired with `font-variant-numeric: tabular-nums`.

---

## 4. Layout, Spacing & Multi-Device Rules

- **Grid:** 4px / 8px spatial scale (`--space-1` = `0.25rem` through `--space-16` = `4rem`).
- **Root overflow:** `html, body { overflow-x: clip; }` (never `hidden`, never `100vw`).
- **Mobile-first breakpoints (`rem`-based):**
  - Base (`320px–639px`): Single-column flow, `16px` minimum input font size (prevents iOS Safari zoom), thumb-first fixed bottom navigation bar (`padding-bottom: env(safe-area-inset-bottom)`), **Sticky Live Result Dock** on calculator views so primary answers stay visible while typing.
  - Tablet (`min-width: 48rem` / `768px`): 2-column card grids, slide-over or collapsible domain rail, spacious touch targets (`≥ 44px`).
  - Desktop (`min-width: 64rem` / `1024px`): Persistent collapsible left Precision Rail (`268px` / `68px`), top utility bar (`⌘K` Command Palette + Global Currency + Theme Toggle), **2-Pane Split Workbench** on calculators (`minmax(0, 1.05fr) minmax(0, 0.95fr)` with sticky right output/chart/audit column).
  - Wide (`min-width: 90rem` / `1440px`): Max content container `1360px` centered cleanly inside main stage.
- **Clickable text never wraps:** Buttons, nav tabs, pills, and CTAs use `white-space: nowrap`.
- **Touch parity:** Every interactive affordance (pinning favorites, copying values, inspecting formula steps) is visible and tappable on `@media (hover: none)` / `@media (pointer: coarse)`.

---

## 5. Motion & Interaction States

- **Easing:** Exponential ease-out `--ease-out: cubic-bezier(0.16, 1, 0.3, 1)` only. Zero bounce/overshoot springs on UI controls.
- **No `transition: all`:** Explicitly list properties (`background-color`, `border-color`, `color`, `transform`, `opacity`).
- **Instant focus rings:** `:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }` — never animated.
- **Reduced motion:** Full `@media (prefers-reduced-motion: reduce)` respect.
- **Z-index scale (6 named levels):**
  - `--z-base: 1` · `--z-sticky: 20` · `--z-header: 30` · `--z-drawer: 40` · `--z-modal: 50` · `--z-toast: 60`
