'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  X,
  Copy,
  Check,
  Code2,
  Sparkles,
  Monitor,
  Moon,
  Sun,
  AlertCircle,
  Sliders,
} from 'lucide-react';
import type { CalculatorSchema } from '@/types/calculator';
import { trackEvent } from '@/lib/telemetry';

interface EmbedModalProps {
  schema: CalculatorSchema;
  isOpen: boolean;
  onClose: () => void;
}

const USE_CASES = [
  'Finance / Mortgage / Advisory',
  'Solar / Construction / Trades',
  'SaaS / Agency ROI Widget',
  'Health / Coaching / Clinical',
  'Other Website Embed',
];

export default function EmbedModal({ schema, isOpen, onClose }: EmbedModalProps) {
  const [embedTheme, setEmbedTheme] = useState<'auto' | 'light' | 'dark'>('auto');
  const [copiedCode, setCopiedCode] = useState(false);
  const [email, setEmail] = useState('');
  const [useCase, setUseCase] = useState(USE_CASES[0]);
  const [company, setCompany] = useState(''); // Honeypot
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    closeRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const origin =
    typeof window !== 'undefined'
      ? window.location.origin
      : 'https://quantify-ashen.vercel.app';

  const embedUrl = `${origin}/calculator/${schema.slug}?embed=1${
    embedTheme !== 'auto' ? `&theme=${embedTheme}` : ''
  }`;

  const snippet = `<iframe\n  src="${embedUrl}"\n  title="${schema.title} — Quantify"\n  width="100%"\n  height="680"\n  style="border:1px solid #e2ddd6;border-radius:14px;"\n  loading="lazy"\n></iframe>`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopiedCode(true);
      trackEvent('embed_copy', { slug: schema.slug, theme: embedTheme });
      setTimeout(() => setCopiedCode(false), 1800);
    } catch {}
  };

  const handleJoinStudio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || submitting) return;

    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/studio-waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          slug: schema.slug,
          title: schema.title,
          useCase,
          company,
        }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) {
        setErrorMsg(json.error || 'Please check your email address and try again.');
        return;
      }
      trackEvent('studio_waitlist_submit', { slug: schema.slug, useCase });
      setSubmitted(true);
      setEmail('');
    } catch {
      setErrorMsg('Network error. Please try again in a moment.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="embed-modal-title"
      onClick={onClose}
    >
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header__title-wrap">
            <Code2 size={18} strokeWidth={1.75} aria-hidden="true" />
            <div>
              <h2 id="embed-modal-title" className="modal-title">
                Embed {schema.title}
              </h2>
              <p className="modal-subtitle">
                Drop this Decimal.js-verified interactive instrument onto your website.
              </p>
            </div>
          </div>
          <button
            ref={closeRef}
            type="button"
            className="icon-btn"
            onClick={onClose}
            aria-label="Close embed dialog"
          >
            <X size={18} strokeWidth={1.75} />
          </button>
        </div>

        <div className="modal-body">
          <div className="embed-controls">
            <span className="embed-controls__label">Widget appearance</span>
            <div className="seg-control" role="radiogroup" aria-label="Embed theme">
              <button
                type="button"
                className={`seg-control__btn ${embedTheme === 'auto' ? 'seg-control__btn--active' : ''}`}
                onClick={() => setEmbedTheme('auto')}
              >
                <Monitor size={13} strokeWidth={1.75} aria-hidden="true" />
                <span>Auto</span>
              </button>
              <button
                type="button"
                className={`seg-control__btn ${embedTheme === 'light' ? 'seg-control__btn--active' : ''}`}
                onClick={() => setEmbedTheme('light')}
              >
                <Sun size={13} strokeWidth={1.75} aria-hidden="true" />
                <span>Light</span>
              </button>
              <button
                type="button"
                className={`seg-control__btn ${embedTheme === 'dark' ? 'seg-control__btn--active' : ''}`}
                onClick={() => setEmbedTheme('dark')}
              >
                <Moon size={13} strokeWidth={1.75} aria-hidden="true" />
                <span>Dark</span>
              </button>
            </div>
          </div>

          <div className="code-frame">
            <div className="code-frame__head">
              <span>HTML Embed Snippet</span>
              <div className="st-code-actions">
                <Link
                  href={`/studio?slug=${schema.slug}`}
                  className="btn btn--ghost btn--sm"
                  onClick={onClose}
                >
                  <Sliders size={14} strokeWidth={1.75} aria-hidden="true" />
                  <span>Customize in Studio</span>
                </Link>
                <button
                  type="button"
                  className="btn btn--ghost btn--sm"
                  onClick={handleCopy}
                >
                  {copiedCode ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copiedCode ? 'Copied' : 'Copy HTML'}</span>
                </button>
              </div>
            </div>
            <pre className="code-frame__pre">
              <code>{snippet}</code>
            </pre>
          </div>

          <div className="studio-cta-box">
            <div className="studio-cta-box__head">
              <Sparkles size={15} strokeWidth={1.75} aria-hidden="true" />
              <span>Quantify Studio Pro — Early Access</span>
            </div>
            <p className="studio-cta-box__desc">
              Customize accent colors, titles, and CTA buttons free in Studio today. Need attribution removal, gated lead capture, or CRM webhooks? Join the Pro list below.
            </p>
            {submitted ? (
              <div className="studio-cta-box__done" role="status">
                <Check size={15} strokeWidth={2} aria-hidden="true" />
                <span>You&apos;re on the Studio list for {schema.title}. We&apos;ll reach out as access opens.</span>
              </div>
            ) : (
              <form className="studio-cta-box__form-stack" onSubmit={handleJoinStudio}>
                {/* Honeypot anti-spam field */}
                <input
                  type="text"
                  name="company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  className="sr-only"
                  aria-hidden="true"
                />

                <select
                  className="studio-cta-box__select"
                  value={useCase}
                  onChange={(e) => setUseCase(e.target.value)}
                  aria-label="Primary use case"
                >
                  {USE_CASES.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>

                <div className="studio-cta-box__form">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    aria-label="Work email for Quantify Studio early access"
                    className="studio-cta-box__input"
                    disabled={submitting}
                  />
                  <button
                    type="submit"
                    className="btn btn--primary"
                    disabled={submitting}
                  >
                    {submitting ? 'Sending…' : 'Request Access'}
                  </button>
                </div>

                {errorMsg && (
                  <div className="studio-cta-box__err" role="alert">
                    <AlertCircle size={14} aria-hidden="true" />
                    <span>{errorMsg}</span>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
