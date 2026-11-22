'use client';

import {
  useState,
  useReducer,
  useMemo,
  useEffect,
  useCallback,
} from 'react';
import Fuse from 'fuse.js';
import {
  Sliders,
  Monitor,
  Smartphone,
  Sun,
  Moon,
  Copy,
  Check,
  ExternalLink,
  Search,
  X,
  AlertCircle,
  Code2,
} from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import DynamicCalculatorEngine from '@/components/calculator/DynamicCalculatorEngine';
import { CategoryIcon } from '@/components/ui/SuiteIcon';
import { usePreferences } from '@/context/PreferencesContext';
import { trackEvent } from '@/lib/telemetry';
import type { EmbedCustomization } from '@/lib/suites';
import type { CalculatorSchema } from '@/types/calculator';

const QUICK_SLUGS: { slug: string; label: string }[] = [
  { slug: 'compound-interest', label: 'Compound Interest' },
  { slug: 'loan-emi', label: 'Loan EMI' },
  { slug: 'solar-payback', label: 'Solar Payback' },
  { slug: 'roi-calculator', label: 'ROI Calculator' },
  { slug: 'fire-number-calculator', label: 'FIRE Number' },
  { slug: 'bmi-calculator', label: 'BMI Calculator' },
];

const ACCENT_SWATCHES: { name: string; hex: string }[] = [
  { name: 'Bronze', hex: '#8b6336' },
  { name: 'Forest', hex: '#2e6f4f' },
  { name: 'Slate', hex: '#335c7d' },
  { name: 'Terracotta', hex: '#b04a33' },
  { name: 'Charcoal', hex: '#2d2a26' },
  { name: 'Indigo Slate', hex: '#3f4d7a' },
];

interface StudioSchemaState {
  activeSchema: CalculatorSchema;
  loading: boolean;
}

type StudioSchemaAction =
  | { type: 'LOAD_START' }
  | { type: 'LOAD_SUCCESS'; schema: CalculatorSchema }
  | { type: 'LOAD_DONE' };

function studioSchemaReducer(
  state: StudioSchemaState,
  action: StudioSchemaAction
): StudioSchemaState {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, loading: true };
    case 'LOAD_SUCCESS':
      return { activeSchema: action.schema, loading: false };
    case 'LOAD_DONE':
      return { ...state, loading: false };
    default:
      return state;
  }
}

interface StudioBuilderProps {
  initialSchema: CalculatorSchema;
}

export default function StudioBuilder({ initialSchema }: StudioBuilderProps) {
  const { catalog, ensureCatalogLoaded } = usePreferences();

  const [schemaState, dispatchSchema] = useReducer(studioSchemaReducer, {
    activeSchema: initialSchema,
    loading: false,
  });

  const activeSchema = schemaState.activeSchema;

  // Customization controls
  const [customTitle, setCustomTitle] = useState('');
  const [theme, setTheme] = useState<'auto' | 'light' | 'dark'>('auto');
  const [accent, setAccent] = useState('#8b6336');
  const [showChart, setShowChart] = useState(true);
  const [showCompare, setShowCompare] = useState(true);
  const [showMath, setShowMath] = useState(true);
  const [ctaLabel, setCtaLabel] = useState('');
  const [ctaUrl, setCtaUrl] = useState('');
  const [iframeHeight, setIframeHeight] = useState(680);
  const [previewViewport, setPreviewViewport] = useState<'desktop' | 'mobile'>('desktop');

  // Picker & copy feedback
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerQuery, setPickerQuery] = useState('');
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const loadSlug = useCallback(async (slug: string) => {
    dispatchSchema({ type: 'LOAD_START' });
    try {
      const res = await fetch(`/api/schema/${encodeURIComponent(slug)}`);
      if (!res.ok) {
        dispatchSchema({ type: 'LOAD_DONE' });
        return;
      }
      const next = (await res.json()) as CalculatorSchema;
      dispatchSchema({ type: 'LOAD_SUCCESS', schema: next });
    } catch {
      dispatchSchema({ type: 'LOAD_DONE' });
    }
  }, []);

  // Load ?slug= query param if linked from a specific calculator's Embed modal
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('slug')?.trim();
    if (slug && slug !== initialSchema.slug) {
      void loadSlug(slug);
    }
  }, [initialSchema.slug, loadSlug]);

  const embeddableCatalog = useMemo(
    () => catalog.filter((c) => !c.isCustom && c.outputCount > 0),
    [catalog]
  );

  const fuse = useMemo(
    () =>
      new Fuse(embeddableCatalog, {
        keys: [
          { name: 'title', weight: 0.5 },
          { name: 'tags', weight: 0.25 },
          { name: 'categoryLabel', weight: 0.15 },
          { name: 'description', weight: 0.1 },
        ],
        threshold: 0.34,
        minMatchCharLength: 2,
      }),
    [embeddableCatalog]
  );

  const pickerResults = useMemo(() => {
    const q = pickerQuery.trim();
    if (q.length >= 2) {
      return fuse.search(q).slice(0, 12).map((r) => r.item);
    }
    return embeddableCatalog.filter((c) => c.isFeatured).slice(0, 10);
  }, [pickerQuery, fuse, embeddableCatalog]);

  const ctaUrlInvalid =
    ctaUrl.trim().length > 0 && !/^https:\/\/.+/.test(ctaUrl.trim());

  const embedConfig = useMemo<EmbedCustomization>(
    () => ({
      title: customTitle.trim() || undefined,
      accent: /^#[0-9a-fA-F]{6}$/.test(accent) ? accent : undefined,
      theme,
      showChart,
      showMath,
      showCompare,
      ctaLabel: ctaLabel.trim() || undefined,
      ctaUrl: !ctaUrlInvalid && ctaUrl.trim() ? ctaUrl.trim() : undefined,
    }),
    [customTitle, accent, theme, showChart, showMath, showCompare, ctaLabel, ctaUrl, ctaUrlInvalid]
  );

  const embedUrl = useMemo(() => {
    const origin =
      typeof window !== 'undefined'
        ? window.location.origin
        : 'https://quantify-ashen.vercel.app';
    const url = new URL(`/calculator/${activeSchema.slug}`, origin);
    url.searchParams.set('embed', '1');
    if (theme !== 'auto') url.searchParams.set('theme', theme);
    if (accent.toLowerCase() !== '#8b6336' && /^#[0-9a-fA-F]{6}$/.test(accent)) {
      url.searchParams.set('accent', accent.slice(1));
    }
    if (customTitle.trim()) url.searchParams.set('title', customTitle.trim());
    if (!showChart) url.searchParams.set('chart', '0');
    if (!showMath) url.searchParams.set('math', '0');
    if (!showCompare) url.searchParams.set('compare', '0');
    if (ctaLabel.trim() && !ctaUrlInvalid && ctaUrl.trim()) {
      url.searchParams.set('cta', ctaLabel.trim());
      url.searchParams.set('ctaUrl', ctaUrl.trim());
    }
    return url.toString();
  }, [
    activeSchema.slug,
    theme,
    accent,
    customTitle,
    showChart,
    showMath,
    showCompare,
    ctaLabel,
    ctaUrl,
    ctaUrlInvalid,
  ]);

  const safeTitleAttr = (customTitle.trim() || activeSchema.title).replace(/"/g, '&quot;');

  const iframeSnippet = `<iframe
  src="${embedUrl}"
  title="${safeTitleAttr} — Quantify"
  width="100%"
  height="${iframeHeight}"
  style="border:1px solid #d9d3c9;border-radius:14px;"
  loading="lazy"
></iframe>`;

  const handleCopyHtml = async () => {
    try {
      await navigator.clipboard.writeText(iframeSnippet);
      trackEvent('studio_copy', {
        slug: activeSchema.slug,
        theme,
        hasCta: Boolean(embedConfig.ctaLabel && embedConfig.ctaUrl),
      });
      setCopiedHtml(true);
      setTimeout(() => setCopiedHtml(false), 1800);
    } catch {
      // Ignore clipboard error
    }
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(embedUrl);
      trackEvent('studio_copy', { slug: activeSchema.slug, mode: 'url' });
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 1800);
    } catch {
      // Ignore clipboard error
    }
  };

  const handleSelectInstrument = (slug: string) => {
    setPickerOpen(false);
    setPickerQuery('');
    setCustomTitle('');
    void loadSlug(slug);
  };

  const breadcrumbs = [
    { label: 'Workbench', href: '/' },
    { label: 'Embed Studio' },
  ];

  return (
    <AppShell breadcrumbs={breadcrumbs}>
      <div className="st-wrap">
        <header className="st-head">
          <div className="st-head__identity">
            <span className="st-head__icon">
              <Sliders size={20} strokeWidth={1.75} aria-hidden="true" />
            </span>
            <div>
              <h1 className="st-head__title">Quantify Embed Studio</h1>
              <p className="st-head__desc">
                Configure any Decimal.js instrument with your brand accent, theme, and call-to-action button, then copy a zero-backend HTML snippet.
              </p>
            </div>
          </div>
        </header>

        {/* Quick Instrument Switcher Strip */}
        <section className="st-switcher" aria-label="Select calculator to customize">
          <div className="st-quick-pills">
            {QUICK_SLUGS.map((item) => (
              <button
                key={item.slug}
                type="button"
                className={`cat-pill ${activeSchema.slug === item.slug ? 'cat-pill--active' : ''}`}
                onClick={() => handleSelectInstrument(item.slug)}
              >
                <span>{item.label}</span>
              </button>
            ))}
            <button
              type="button"
              className={`cat-pill ${pickerOpen ? 'cat-pill--active' : ''}`}
              onClick={() => {
                setPickerOpen((o) => !o);
                void ensureCatalogLoaded();
              }}
            >
              <Search size={13} strokeWidth={1.75} aria-hidden="true" />
              <span>Browse 640+ Instruments</span>
            </button>
          </div>

          {pickerOpen && (
            <div className="wk-picker">
              <div className="wk-picker__head">
                <div className="inline-search">
                  <Search size={16} strokeWidth={1.75} className="inline-search__icon" aria-hidden="true" />
                  <input
                    type="text"
                    className="inline-search__input"
                    value={pickerQuery}
                    onChange={(e) => setPickerQuery(e.target.value)}
                    placeholder="Search any calculator by domain or name…"
                    aria-label="Search calculator for studio embed"
                    autoFocus
                  />
                  {pickerQuery && (
                    <button
                      type="button"
                      className="inline-search__clear"
                      onClick={() => setPickerQuery('')}
                      aria-label="Clear search"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() => setPickerOpen(false)}
                  aria-label="Close instrument search"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="wk-picker__grid">
                {pickerResults.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="wk-picker__item"
                    onClick={() => handleSelectInstrument(item.slug)}
                  >
                    <span className="wk-picker__icon">
                      <CategoryIcon categoryId={item.category} size={15} />
                    </span>
                    <span className="wk-picker__text">
                      <span className="wk-picker__title">{item.title}</span>
                      <span className="wk-picker__cat">{item.categoryLabel}</span>
                    </span>
                    <span className="wk-picker__add">Select</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Main 2-Pane Studio Customizer + Live Preview */}
        <div className="st-grid">
          {/* LEFT: Configuration Controls */}
          <aside className="st-controls" aria-label="Widget configuration">
            <div className="st-section">
              <label className="st-label" htmlFor="st-title-input">
                Widget Title
              </label>
              <input
                id="st-title-input"
                type="text"
                className="st-input"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder={activeSchema.title}
                maxLength={80}
              />
            </div>

            <div className="st-section">
              <span className="st-label">Surface Theme</span>
              <div className="seg-control" role="radiogroup" aria-label="Widget surface theme">
                <button
                  type="button"
                  className={`seg-control__btn ${theme === 'auto' ? 'seg-control__btn--active' : ''}`}
                  onClick={() => setTheme('auto')}
                >
                  <Monitor size={13} strokeWidth={1.75} aria-hidden="true" />
                  <span>Auto</span>
                </button>
                <button
                  type="button"
                  className={`seg-control__btn ${theme === 'light' ? 'seg-control__btn--active' : ''}`}
                  onClick={() => setTheme('light')}
                >
                  <Sun size={13} strokeWidth={1.75} aria-hidden="true" />
                  <span>Light</span>
                </button>
                <button
                  type="button"
                  className={`seg-control__btn ${theme === 'dark' ? 'seg-control__btn--active' : ''}`}
                  onClick={() => setTheme('dark')}
                >
                  <Moon size={13} strokeWidth={1.75} aria-hidden="true" />
                  <span>Dark</span>
                </button>
              </div>
            </div>

            <div className="st-section">
              <div className="st-label-row">
                <span className="st-label">Brand Accent</span>
                <code className="st-hex">{accent.toUpperCase()}</code>
              </div>
              <div className="st-swatches">
                {ACCENT_SWATCHES.map((sw) => (
                  <button
                    key={sw.hex}
                    type="button"
                    className={`st-swatch ${
                      accent.toLowerCase() === sw.hex.toLowerCase() ? 'st-swatch--active' : ''
                    }`}
                    style={{ backgroundColor: sw.hex }}
                    onClick={() => setAccent(sw.hex)}
                    title={`${sw.name} (${sw.hex})`}
                    aria-label={`Select ${sw.name} accent ${sw.hex}`}
                  />
                ))}
                <label className="st-color-custom" title="Custom hex color">
                  <input
                    type="color"
                    value={accent}
                    onChange={(e) => setAccent(e.target.value)}
                    aria-label="Pick custom accent color"
                  />
                  <span>Custom</span>
                </label>
              </div>
            </div>

            <div className="st-section">
              <span className="st-label">Widget Capabilities</span>
              <div className="st-toggles">
                <label className="field__check-row">
                  <input
                    type="checkbox"
                    className="field__checkbox"
                    checked={showChart}
                    onChange={(e) => setShowChart(e.target.checked)}
                  />
                  <span className="field__check-label">Show interactive projection curve</span>
                </label>
                <label className="field__check-row">
                  <input
                    type="checkbox"
                    className="field__checkbox"
                    checked={showCompare}
                    onChange={(e) => setShowCompare(e.target.checked)}
                  />
                  <span className="field__check-label">Allow A / B scenario compare</span>
                </label>
                <label className="field__check-row">
                  <input
                    type="checkbox"
                    className="field__checkbox"
                    checked={showMath}
                    onChange={(e) => setShowMath(e.target.checked)}
                  />
                  <span className="field__check-label">Allow “Show the Math” audit trace</span>
                </label>
              </div>
            </div>

            <div className="st-section">
              <span className="st-label">Optional Call-to-Action Button</span>
              <div className="st-cta-fields">
                <input
                  type="text"
                  className="st-input"
                  value={ctaLabel}
                  onChange={(e) => setCtaLabel(e.target.value)}
                  placeholder="Button label (e.g. Book a Consultation)"
                  aria-label="Call-to-action button label"
                  maxLength={48}
                />
                <input
                  type="url"
                  className="st-input"
                  value={ctaUrl}
                  onChange={(e) => setCtaUrl(e.target.value)}
                  placeholder="https://your-site.com/contact"
                  aria-label="Call-to-action HTTPS URL"
                />
                {ctaUrlInvalid && (
                  <span className="field__error" role="alert">
                    <AlertCircle size={13} aria-hidden="true" />
                    <span>CTA link must start with https://</span>
                  </span>
                )}
              </div>
            </div>

            <div className="st-section">
              <div className="st-label-row">
                <label className="st-label" htmlFor="st-height-range">
                  Embed Height
                </label>
                <span className="field__range-readout">{iframeHeight}px</span>
              </div>
              <input
                id="st-height-range"
                type="range"
                className="field__range"
                min={520}
                max={860}
                step={20}
                value={iframeHeight}
                style={
                  {
                    '--range-pct': `${((iframeHeight - 520) / (860 - 520)) * 100}%`,
                  } as React.CSSProperties
                }
                onChange={(e) => setIframeHeight(Number(e.target.value))}
              />
            </div>

            {/* Generated HTML Code Output */}
            <div className="code-frame">
              <div className="code-frame__head">
                <span className="st-code-title">
                  <Code2 size={13} aria-hidden="true" />
                  <span>HTML Embed Snippet</span>
                </span>
                <div className="st-code-actions">
                  <button
                    type="button"
                    className="btn btn--ghost btn--xs"
                    onClick={handleCopyUrl}
                  >
                    {copiedUrl ? <Check size={13} /> : <Copy size={13} />}
                    <span>{copiedUrl ? 'Copied' : 'URL'}</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn--primary btn--xs"
                    onClick={handleCopyHtml}
                  >
                    {copiedHtml ? <Check size={13} /> : <Copy size={13} />}
                    <span>{copiedHtml ? 'Copied HTML' : 'Copy HTML'}</span>
                  </button>
                </div>
              </div>
              <pre className="code-frame__pre">
                <code>{iframeSnippet}</code>
              </pre>
            </div>
          </aside>

          {/* RIGHT: Live Interactive Widget Preview */}
          <section className="st-preview" aria-label="Live widget preview">
            <div className="st-preview__bar">
              <div className="st-preview__meta">
                <span className="wb-pane__label">Live Preview</span>
                <code className="st-preview__slug">/calculator/{activeSchema.slug}</code>
              </div>

              <div className="st-preview__controls">
                <div className="seg-control" role="radiogroup" aria-label="Preview width">
                  <button
                    type="button"
                    className={`seg-control__btn ${
                      previewViewport === 'desktop' ? 'seg-control__btn--active' : ''
                    }`}
                    onClick={() => setPreviewViewport('desktop')}
                  >
                    <Monitor size={13} strokeWidth={1.75} aria-hidden="true" />
                    <span>Desktop</span>
                  </button>
                  <button
                    type="button"
                    className={`seg-control__btn ${
                      previewViewport === 'mobile' ? 'seg-control__btn--active' : ''
                    }`}
                    onClick={() => setPreviewViewport('mobile')}
                  >
                    <Smartphone size={13} strokeWidth={1.75} aria-hidden="true" />
                    <span>Mobile</span>
                  </button>
                </div>

                <a
                  href={embedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--ghost btn--xs"
                >
                  <span>Open</span>
                  <ExternalLink size={12} aria-hidden="true" />
                </a>
              </div>
            </div>

            <div className="st-preview__canvas">
              <div
                className={`st-preview__frame ${
                  previewViewport === 'mobile' ? 'st-preview__frame--mobile' : ''
                } ${
                  theme === 'light'
                    ? 'st-preview__frame--light'
                    : theme === 'dark'
                    ? 'st-preview__frame--dark'
                    : ''
                }`}
              >
                {schemaState.loading ? (
                  <div className="wk-step-loading">Loading instrument preview…</div>
                ) : (
                  <DynamicCalculatorEngine
                    key={activeSchema.slug}
                    schema={activeSchema}
                    mode="embed"
                    embedConfig={embedConfig}
                  />
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
