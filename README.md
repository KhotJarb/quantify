<div align="center">

<br />

![Quantify Logo](docs/logo.png)

<br />

# Quantify

### Precision in Everything.

<br />

![Version](https://img.shields.io/badge/version-v0.1.0-8b7355?style=flat-square&labelColor=1f1d19)
![Next.js](https://img.shields.io/badge/Next.js-16.2-8b7355?style=flat-square&labelColor=1f1d19&logo=nextdotjs&logoColor=ffffff)
![React](https://img.shields.io/badge/React-19-8b7355?style=flat-square&labelColor=1f1d19&logo=react&logoColor=ffffff)
![TypeScript](https://img.shields.io/badge/TypeScript-5-8b7355?style=flat-square&labelColor=1f1d19&logo=typescript&logoColor=ffffff)
![PWA](https://img.shields.io/badge/PWA-ready-8b7355?style=flat-square&labelColor=1f1d19)
![License](https://img.shields.io/badge/license-MIT-8b7355?style=flat-square&labelColor=1f1d19)

<br />

[![Launch App](https://img.shields.io/badge/%E2%86%92%20Launch%20the%20App-Try%20Quantify%20Free-8b7355?style=for-the-badge&labelColor=1f1d19)](https://quantify-ashen.vercel.app/)

<br />

</div>

---

<br />

## Live Demo

<br />

No installation required. The app is deployed and publicly accessible:

<br />

> **[→ Try Quantify Now](https://quantify-ashen.vercel.app/)**

<br />

For the full native experience on mobile, open the link in Safari (iOS) or Chrome (Android) and select **Add to Home Screen** — the app will launch without any browser UI.

<br />

---

<br />

## Overview

Quantify is a dynamic, schema-driven calculator engine built for precision and scale. Rather than hardcoding individual calculation interfaces, every calculator is defined as a structured data object — making it trivially simple to add, modify, or audit any mathematical tool in the collection. The result is a single, consistent rendering engine that can host hundreds of scientifically accurate calculators across finance, engineering, health, mathematics, science, and beyond, with zero duplication of UI logic.

<br />

---

<br />

## Key Features

<br />

- **Schema-Driven Engine** — Every calculator is a pure data object conforming to `CalculatorSchema`. No bespoke UI is ever written for calculation logic; one engine renders all.

- **100% Mathematical Precision** — All arithmetic is evaluated using [decimal.js](https://mikemcl.github.io/decimal.js/), eliminating floating-point rounding errors that plague standard JavaScript `Number` operations.

- **Progressive Web App** — Fully configured for "Add to Home Screen" on iOS and Android. Launches in standalone mode with a custom icon, splash screen, and no browser chrome.

- **Dark Mode** — Class-based theming via `next-themes`. Sophisticated deep-charcoal palette (not absolute black) with smooth Framer Motion transitions on the toggle widget.

- **Fuzzy Search** — Instant, client-side full-text search across the entire calculator library powered by [Fuse.js](https://fusejs.io/) with tag-based filtering.

- **Guided Results** — Every calculator ships with a structured usage guide: a plain-language explanation, step-by-step instructions, a worked example, and an expert tip.

<br />

---

<br />

## Tech Stack

<br />

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | [Next.js 16](https://nextjs.org) (App Router) | Server components, file-based routing, metadata API, `ImageResponse` icons |
| **UI Runtime** | [React 19](https://react.dev) | Component model, concurrent rendering |
| **Language** | [TypeScript 5](https://www.typescriptlang.org) | End-to-end type safety across the schema, engine, and UI |
| **Styling** | Vanilla CSS + CSS Custom Properties | Design token system; Japandi warm-neutral palette, 8px grid, no framework dependency |
| **Animation** | [Framer Motion 12](https://www.framer.com/motion/) | Theme toggle, micro-interactions; spring physics |
| **Arithmetic** | [Decimal.js 10](https://mikemcl.github.io/decimal.js/) | Arbitrary-precision decimal arithmetic for all formula evaluation |
| **Search** | [Fuse.js 7](https://fusejs.io/) | Client-side fuzzy search across calculator titles, tags, and descriptions |
| **Theming** | [next-themes](https://github.com/pacocoursey/next-themes) | Flash-free dark / light mode with OS preference detection |

<br />

---

<br />

## Getting Started

<br />

**Prerequisites:** Node.js ≥ 18.17 and npm ≥ 9.

<br />

```bash
# 1. Clone the repository
git clone https://github.com/your-username/quantify.git
cd quantify

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

<br />

Open [http://localhost:3000](http://localhost:3000) in your browser.

<br />

---

<br />

## Architecture

Quantify is built around a single contract: the `CalculatorSchema`. Any data object that satisfies this interface is automatically rendered, evaluated, and searchable — no additional code required.

<br />

```typescript
// src/types/calculator.ts

interface CalculatorSchema {
  id:          string;           // Unique identifier
  slug:        string;           // URL-safe key
  title:       string;
  description: string;
  icon:        string;           // Emoji or icon identifier
  category:    string;           // Top-level navigation group
  subcategory?: string;          // Optional secondary grouping
  tags:        string[];         // Full-text search surface

  inputs:   CalculatorField[];   // Declarative input definitions
  formulas: FormulaStep[];       // Ordered dependency graph of expressions
  outputs:  OutputField[];       // Formatted result definitions

  guide?: {
    whatIsIt:        string;     // Plain-language concept explanation
    howToUse:        string;     // Step-by-step instructions
    exampleScenario: string;     // Worked, realistic example
    proTip:          string;     // Expert insight
  };
}
```

<br />

Each `FormulaStep` contains a plain-text mathematical `expression` — referencing input IDs and prior step IDs as variables — that the engine evaluates sequentially using Decimal.js. Adding a new calculator requires only a new data object; the rendering and evaluation infrastructure is already in place.

<br />

---

<br />

## Project Structure

<br />

```
quantify/
├── src/
│   ├── app/                 # Next.js App Router — pages, layout, metadata
│   ├── components/          # Shared UI components (calculator, layout, theme)
│   ├── data/                # Calculator schema definitions (one file per category)
│   └── types/               # TypeScript interfaces (CalculatorSchema, etc.)
└── public/                  # Static assets — logo, PWA icons
```

<br />

---

<br />

## Roadmap

<br />

- [ ] User-defined variable bookmarking
- [ ] Shareable result URLs with pre-filled inputs
- [ ] PDF / CSV export of calculator outputs
- [ ] Expanded category coverage

<br />

---

<br />

## License

<br />

Released under the [MIT License](LICENSE). You are free to use, modify, and distribute this software in accordance with the terms of the license.

<br />

---

<br />

<div align="center">

<br />

Built with rigor. Designed with restraint.

<br />

**Quantify** · v0.1.0

<br />

</div>
