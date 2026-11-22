<div align="center">

<br />

![Quantify Logo](docs/logo.png)

<br />

# Quantify

### Precision instruments for high-stakes decisions.

<br />

![Version](https://img.shields.io/badge/version-v2.1.0-8b6336?style=flat-square&labelColor=171512)
![Next.js](https://img.shields.io/badge/Next.js-16.2-8b6336?style=flat-square&labelColor=171512&logo=nextdotjs&logoColor=ffffff)
![React](https://img.shields.io/badge/React-19-8b6336?style=flat-square&labelColor=171512&logo=react&logoColor=ffffff)
![TypeScript](https://img.shields.io/badge/TypeScript-5-8b6336?style=flat-square&labelColor=171512&logo=typescript&logoColor=ffffff)
![PWA](https://img.shields.io/badge/PWA-ready-8b6336?style=flat-square&labelColor=171512)
![License](https://img.shields.io/badge/license-MIT-8b6336?style=flat-square&labelColor=171512)

<br />

[![Launch App](https://img.shields.io/badge/%E2%86%92%20Launch%20Workbench-Try%20Quantify%20Free-8b6336?style=for-the-badge&labelColor=171512)](https://quantify-ashen.vercel.app/)

<br />

</div>

---

## Overview

Quantify is a deterministic, arbitrary-precision decision and calculation workbench built on **Decimal.js** and a sandboxed recursive-descent AST evaluator. Every calculator is defined as a declarative `CalculatorSchema`—powering 656 verified instruments organized into **5 Flagship Suites** (*Wealth & Finance*, *Health & Clinical*, *Engineering & Energy*, *Science, Math & Tech*, *Business & Operations*) plus an extended *Explore Library*.

---

## What's New in v2.1

- **Quantify Workbooks (`/workbooks`):** Chain multiple calculators into live multi-step `decimal.js` models where Step N inputs stay bound to upstream outputs (`×1`, `×12`, `÷12`), complete with 4 pre-built flagship templates, local persistence, PDF brief printing, and shareable model URLs.
- **Quantify Embed Studio (`/studio`):** Self-serve visual customizer for any of 640+ formula-driven calculators—configure custom titles, brand accent hex colors, light/dark/auto themes, projection/compare/math toggles, and optional `https://` CTA buttons with live Desktop/Mobile preview and 1-line serverless `<iframe>` snippets.
- **Local-First Saved Scenarios & JSON Portability:** Save named Scenario A or A/B snapshots inside any calculator, reload or open them in one click from the Saved Library, and export/import portable JSON backups.
- **Methodology & Shared-Link Polish (`/methodology`):** Dedicated engineering & privacy specification, Loom-style shared-scenario welcome banners, and a minimal colophon footer across the entire workbench.

## Core Platform (v2.0)

- **Warm Precision Instrument UI (`design.md`):** Locked OKLCH design system across Light (Warm Alabaster Paper) and Dark (Deep Obsidian Walnut) modes, paired with self-hosted `Fraunces`, `IBM Plex Sans`, and `IBM Plex Mono` (`tabular-nums`).
- **Multi-Device Split-Pane Workbench:** Collapsible desktop Precision Rail + sticky live output column; thumb-first mobile bottom dock + sticky live readout bar while typing.
- **Live Scenario Compare (`A vs. B`):** Duplicate any calculator into two live scenarios with exact `decimal.js` absolute & percentage delta readouts.
- **Interactive Projection & Sensitivity Curves:** Pure zero-bloat SVG curves plotting Scenario A and Scenario B divergence over time horizons or any selectable parameter axis with pointer/touch crosshair scrubbing.
- **Auditable "Show the Math" Trace:** Inspect every AST formula step and live computed intermediate value—zero black boxes, zero floating-point drift.
- **1-Click Decision Brief (Print / PDF):** Export a clean, paper-optimized brief containing parameters, A/B deltas, projection curve, and formula audit.
- **`⌘K` Command Palette + Quick Math:** Instant fuzzy search across all 656 instruments plus an inline `decimal.js` expression evaluator.
- **Embeddable Mode & Dynamic OG Cards:** Embed any instrument via `?embed=1&theme=light|dark`, with custom `1200×630` OpenGraph cards, per-route SEO metadata, JSON-LD, and full `sitemap.xml` indexation.

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | Next.js 16 (App Router) | Server Components, SSG/ISR, `generateMetadata`, `ImageResponse` OG cards, `sitemap.ts` |
| **UI Runtime** | React 19 + TypeScript 5 | Concurrent rendering, `useSyncExternalStore`, end-to-end type safety |
| **Styling** | Vanilla CSS + OKLCH Tokens | Mobile-first responsive system (`design.md`), zero framework overhead |
| **Iconography** | `lucide-react` | Single unified 1.75px stroke icon canon |
| **Arithmetic** | `decimal.js` + `mathjs` | Sandboxed AST evaluation with zero floating-point drift + lazy-loaded CAS |
| **Search** | `fuse.js` | Instant client fuzzy search via edge-cached `/api/catalog` |
| **Theming** | `next-themes` | Flash-free Light / Dark switching |

---

## Getting Started

**Prerequisites:** Node.js ≥ 18.17 and npm ≥ 9.

```bash
git clone https://github.com/KhotJarb/quantify.git
cd quantify
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables (Optional — For Studio Capture & Telemetry)

See [`.env.example`](.env.example). Configure in Vercel Project Settings:

- `NEXT_PUBLIC_SITE_URL` — Canonical URL (`https://quantify-ashen.vercel.app`)
- `STUDIO_WEBHOOK_URL` — Discord, Slack, Make, Zapier, or JSON webhook for instant Studio waitlist alerts
- `RESEND_API_KEY` + `STUDIO_NOTIFY_EMAIL` — Optional direct email alerts via Resend
- `TELEMETRY_WEBHOOK_URL` — Optional forwarding for privacy-safe feature telemetry

---

## Architecture

```text
quantify/
├── design.md                         # Locked Warm Precision Instrument design contract
├── src/
│   ├── app/
│   │   ├── api/                      # Static catalog, Studio waitlist & telemetry routes
│   │   ├── calculator/[slug]/        # Server Component route + dynamic OG image
│   │   ├── opengraph-image.tsx       # Root social share card
│   │   ├── sitemap.ts / robots.ts    # Full 656-URL SEO indexation
│   │   └── globals.css               # OKLCH tokens, multi-device layout & print brief CSS
│   ├── components/
│   │   ├── calculator/               # Split-pane workbench, ScenarioChart, EmbedModal, bespoke tools
│   │   ├── dashboard/                # Curated WorkbenchHome with 5 Flagship Suites
│   │   └── layout/                   # Shared AppShell, CommandPalette (⌘K)
│   ├── context/                      # PreferencesContext (currency, favorites, recents)
│   ├── data/                         # 62 server-side calculator schema modules (656 tools)
│   ├── engine/formulaParser.ts       # Sandboxed Decimal.js recursive-descent AST engine
│   └── lib/                          # Client-safe suite taxonomy, server catalog & telemetry
```

---

## License

Released under the [MIT License](LICENSE).
