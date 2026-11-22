<div align="center">

<br />

<img src="docs/logo.png" alt="Quantify logo" width="84" />

# Quantify

**Free, ad-free calculators for finance, health, engineering, and everyday decisions.**

<br />

[![Open Quantify](https://img.shields.io/badge/%E2%86%92%20Open%20Quantify-Launch%20App-8b6336?style=for-the-badge&labelColor=171512)](https://quantify-ashen.vercel.app/)

<br />

`v0.2.0` &nbsp;&middot;&nbsp; No Ads &nbsp;&middot;&nbsp; No Account Required &nbsp;&middot;&nbsp; Private by Default

</div>

---

## Why Quantify

Most online calculators bury the answer under pop-ups, hide how the numbers were calculated, and make you copy-paste results between tabs whenever one decision affects another.

Quantify is built to be calm, transparent, and genuinely useful for real decisions:

- **Clear, clutter-free workspace** designed for phones, tablets, and desktops in both Light and Dark themes.
- **Exact decimal math** so long-term financial, engineering, and scientific numbers stay consistent without rounding drift.
- **No black boxes**—inspect the exact step-by-step formula behind every result whenever you want to double-check the math.
- **Private by default**—no sign-up walls, no ad banners, and no tracking cookies. Your saved work stays on your own device.

---

## What You Can Do

### Compare Options Side by Side (Scenario A vs. B)
Test two choices at the same time—like a 15-year vs. 30-year mortgage, two investment rates, or different loan terms—and immediately see the exact difference between them.

### Visualize How Results Change
Every supported calculator includes an interactive curve showing how your outcome shifts over time or across different rates. Hover or drag along the chart to inspect any point.

### See the Exact Math
Click **Show the Math** on any instrument to open a clear, step-by-step breakdown of the formula and intermediate values behind your answer.

### Chain Calculators Together with Workbooks
Stop copying numbers from one tab into another. **Workbooks** let you link calculators in sequence so the result from Step 1 automatically flows into Step 2 and updates live whenever you adjust an input—such as turning a monthly mortgage payment into a retirement target, or compounding annual solar savings over 20 years. Start with built-in templates or build your own chain.

### Embed Calculators on Your Own Website with Studio
Need a clean, interactive calculator for a blog, portfolio, or business page? **Embed Studio** lets you choose any calculator, customize the title, theme, brand accent color, and optional button, preview it on desktop and mobile, and copy a single ready-to-paste embed snippet.

### Save, Share & Print
- **Save Snapshots:** Store named scenarios locally on your device, reopen them in one click from your **Saved Library**, or export and import backups as a file.
- **Share Live Links:** Send a link pre-filled with your exact numbers so someone else can inspect or adjust them right away.
- **1-Page PDF Brief:** Print or save a clean, paper-friendly summary of your inputs, results, and formulas.
- **Instant Search & Quick Math (`⌘K` / `Ctrl+K`):** Jump to any tool or evaluate a quick calculation from anywhere in the app.
- **Multi-Currency Display:** Switch effortlessly between `USD`, `EUR`, `GBP`, `THB`, `JPY`, `SGD`, `AUD`, `CAD`, and `INR`.

---

## Included Suites

Tools are organized into five core suites plus an extended library so you can find what you need quickly:

| Suite | What It Covers |
| :--- | :--- |
| **Wealth & Finance** | Mortgages, loans, retirement & FIRE planning, compound growth, rent vs. buy, taxes, bonds, and investments |
| **Health & Clinical** | Lipid and cholesterol panels, metabolic baselines, nutrition, body metrics, and strength progression |
| **Engineering & Energy** | Electrical circuits, structural loads, construction quantities, HVAC sizing, and solar payback |
| **Science, Math & Tech** | Advanced & scientific math, statistics, physics, chemistry dilutions, and cloud capacity planning |
| **Business & Operations** | ROI, pricing and margins, payroll allocation, freight volume, and operational unit economics |
| **Explore Library** | Aviation, automotive, photography optics, culinary scaling, sports, legal, productivity, and unit conversions |

---

## Privacy & Responsible Use

- **Your data stays yours:** Saved scenarios, pinned calculators, workbooks, and display preferences are stored locally in your browser. Nothing is shared unless you explicitly create and send a shared link.
- **Planning & exploration notice:** Quantify guarantees that displayed results match the transparent formulas shown in **Show the Math**. Calculators in medical, financial, tax, legal, and engineering domains are intended for planning and education and do not replace advice from a licensed professional.

---

<details>
<summary><strong>Running Quantify Locally (Optional Self-Hosting)</strong></summary>

<br />

Requires Node.js 18.17+ and npm 9+:

```bash
git clone https://github.com/KhotJarb/quantify.git
cd quantify
npm install
cp .env.example .env.local
npm run dev
```

Available scripts:

```bash
npm run dev     # Start the local development server
npm run build   # Build for production
npm run start   # Run the production build locally
npm run lint    # Check code quality
```

Quantify runs with zero required configuration. Optional environment variables (custom canonical URL, webhook notifications, email alerts, and search engine verification) are documented in `.env.example`.

</details>

---

## License

Released under the [MIT License](LICENSE).
