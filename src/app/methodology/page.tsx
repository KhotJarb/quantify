import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Sigma,
  ShieldCheck,
  HardDrive,
  Scale,
  ArrowRight,
  Workflow,
  Sliders,
} from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import { getCatalogSummaries } from '@/lib/catalog';

export const metadata: Metadata = {
  title: 'Methodology & Trust — Decimal.js Engine & Privacy',
  description:
    'How Quantify evaluates formulas with a sandboxed Decimal.js AST parser, stores scenarios locally without tracking cookies, and defines domain verification boundaries.',
  openGraph: {
    title: 'Quantify Methodology, Precision & Privacy',
    description:
      'Transparent engineering documentation for Quantify’s arbitrary-precision calculation engine and local-first architecture.',
    type: 'website',
  },
};

export default function MethodologyPage() {
  const totalTools = getCatalogSummaries().length;

  return (
    <AppShell
      breadcrumbs={[
        { label: 'Workbench', href: '/' },
        { label: 'Methodology' },
      ]}
    >
      <article className="meth-wrap">
        <header className="meth-head">
          <div className="meth-eyebrow">Engineering &amp; Trust Specification</div>
          <h1 className="meth-title">
            Deterministic math, auditable formulas, and local-first privacy.
          </h1>
          <p className="meth-lead">
            Quantify is engineered as a precision instrument workbench across {totalTools} calculators. Every output is computed client-side with arbitrary-precision decimal arithmetic and an inspectable step-by-step formula trace.
          </p>
        </header>

        <div className="meth-grid">
          <section className="meth-card">
            <div className="meth-card__head">
              <span className="meth-card__icon">
                <Sigma size={18} strokeWidth={1.75} aria-hidden="true" />
              </span>
              <h2 className="meth-card__title">1. Sandboxed Decimal.js AST Engine</h2>
            </div>
            <p className="meth-card__body">
              Standard JavaScript arithmetic uses IEEE-754 binary floating-point numbers, where simple fractions like <code>0.1 + 0.2</code> produce rounding drift that compounds across 30-year amortization schedules and multi-step models.
            </p>
            <p className="meth-card__body">
              Quantify parses every schema expression through a custom recursive-descent tokenizer and Abstract Syntax Tree evaluator backed by <code>decimal.js</code>—with zero use of <code>eval()</code> or dynamic code execution. Click <strong>Show the Math</strong> on any instrument to inspect every intermediate variable and equation in real time.
            </p>
          </section>

          <section className="meth-card">
            <div className="meth-card__head">
              <span className="meth-card__icon">
                <HardDrive size={18} strokeWidth={1.75} aria-hidden="true" />
              </span>
              <h2 className="meth-card__title">2. Local-First, Zero-Cookie Persistence</h2>
            </div>
            <p className="meth-card__body">
              Your financial figures, clinical metrics, saved scenario snapshots, and chained workbooks stay on your device inside browser <code>localStorage</code>. You can export or import saved scenarios as portable JSON at any time from the Saved Library.
            </p>
            <p className="meth-card__body">
              Quantify runs without third-party advertising cookies or cross-site tracking pixels. When you share a scenario or workbook URL, only the parameters you explicitly choose to share are encoded transparently in the link query string.
            </p>
          </section>

          <section className="meth-card">
            <div className="meth-card__head">
              <span className="meth-card__icon">
                <Scale size={18} strokeWidth={1.75} aria-hidden="true" />
              </span>
              <h2 className="meth-card__title">3. Verification Boundaries &amp; Domain Scope</h2>
            </div>
            <p className="meth-card__body">
              Deterministic execution guarantees that each result matches the exact equation shown in the formula audit for the inputs entered. It does not replace domain-licensed judgment or jurisdiction-specific rules.
            </p>
            <ul className="meth-list">
              <li>
                <strong>Health &amp; Clinical:</strong> Reference models (including Friedewald and Sampson 2020 lipid formulas) are provided for educational and exploratory analysis only, not medical diagnosis or dosing orders.
              </li>
              <li>
                <strong>Wealth &amp; Tax:</strong> Projections assume constant rates unless modeled otherwise and exclude local statutory fees, tax-bracket changes, or advisory suitability reviews.
              </li>
              <li>
                <strong>Engineering &amp; Legal:</strong> Construction, electrical, solar, and legal calculations serve as preliminary planning estimates and must be stamped or confirmed by a licensed professional prior to execution.
              </li>
            </ul>
          </section>

          <section className="meth-card">
            <div className="meth-card__head">
              <span className="meth-card__icon">
                <ShieldCheck size={18} strokeWidth={1.75} aria-hidden="true" />
              </span>
              <h2 className="meth-card__title">4. Embeddable Security Model</h2>
            </div>
            <p className="meth-card__body">
              Widgets configured in Quantify Studio run inside isolated <code>&lt;iframe&gt;</code> containers via pure URL parameters—no third-party script injection into the host page DOM, no external database lookups required to render, and strict validation on custom colors (6-digit hex) and optional call-to-action links (<code>https://</code> only).
            </p>
          </section>
        </div>

        <section className="meth-cta-row" aria-label="Explore Quantify tools">
          <Link href="/" className="btn btn--primary">
            <span>Open Workbench</span>
            <ArrowRight size={15} strokeWidth={1.75} aria-hidden="true" />
          </Link>
          <Link href="/workbooks" className="btn btn--secondary">
            <Workflow size={15} strokeWidth={1.75} aria-hidden="true" />
            <span>Explore Workbooks</span>
          </Link>
          <Link href="/studio" className="btn btn--secondary">
            <Sliders size={15} strokeWidth={1.75} aria-hidden="true" />
            <span>Open Embed Studio</span>
          </Link>
        </section>
      </article>
    </AppShell>
  );
}
