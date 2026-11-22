'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Fuse from 'fuse.js';
import {
  Search,
  X,
  ArrowRight,
  Star,
  Clock,
  Sparkles,
  Copy,
  Check,
  Calculator,
} from 'lucide-react';
import { usePreferences } from '@/context/PreferencesContext';
import { evaluateExpression } from '@/engine/formulaParser';
import { CategoryIcon } from '@/components/ui/SuiteIcon';
import { FEATURED_INSTRUMENT_SLUGS, type CalculatorSummary } from '@/lib/suites';

/** Returns a formatted Decimal.js result if the query looks like a valid math expression. */
function tryQuickMath(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed || trimmed.length < 2) return null;
  // Require at least one digit and an operator or function parenthesis
  const looksLikeMath =
    /[0-9]/.test(trimmed) &&
    (/[+\-*/%^()]/.test(trimmed) || /\b(sqrt|sin|cos|tan|log|ln|abs|pow|pmt|fv|pv)\s*\(/i.test(trimmed));
  if (!looksLikeMath) return null;
  // Don't hijack queries with plain English words that aren't functions/constants
  if (/[a-zA-Z]{4,}\s+[a-zA-Z]{3,}/.test(trimmed)) return null;

  const val = evaluateExpression(trimmed, {});
  if (!val || !val.isFinite() || val.isNaN()) return null;

  const fixed = val.toDecimalPlaces(8).toFixed();
  const [intPart, decPart] = fixed.split('.');
  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  if (!decPart) return formattedInt;
  const trimmedDec = decPart.replace(/0+$/, '');
  return trimmedDec ? `${formattedInt}.${trimmedDec}` : formattedInt;
}

export default function CommandPalette() {
  const router = useRouter();
  const {
    catalog,
    catalogLoaded,
    ensureCatalogLoaded,
    favorites,
    recentSlugs,
    commandOpen,
    setCommandOpen,
  } = usePreferences();

  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [copiedMath, setCopiedMath] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const fuse = useMemo(
    () =>
      new Fuse(catalog, {
        keys: [
          { name: 'title', weight: 0.45 },
          { name: 'tags', weight: 0.3 },
          { name: 'categoryLabel', weight: 0.15 },
          { name: 'description', weight: 0.1 },
        ],
        threshold: 0.32,
        minMatchCharLength: 2,
      }),
    [catalog]
  );

  const quickMathResult = useMemo(() => tryQuickMath(query), [query]);

  const items = useMemo<{ label: string; list: CalculatorSummary[] }>(() => {
    const q = query.trim();
    if (q) {
      const hits = fuse.search(q).slice(0, 14).map((r) => r.item);
      return { label: `Matches (${hits.length})`, list: hits };
    }

    const bySlug = new Map(catalog.map((c) => [c.slug, c]));
    const recents = recentSlugs
      .map((s) => bySlug.get(s))
      .filter((c): c is CalculatorSummary => Boolean(c));

    if (recents.length > 0) {
      const recentSet = new Set(recents.map((r) => r.slug));
      const extras = FEATURED_INSTRUMENT_SLUGS.filter((s) => !recentSet.has(s))
        .map((s) => bySlug.get(s))
        .filter((c): c is CalculatorSummary => Boolean(c))
        .slice(0, 6);
      return { label: 'Recent & Flagship Instruments', list: [...recents.slice(0, 4), ...extras] };
    }

    const featured = FEATURED_INSTRUMENT_SLUGS.map((s) => bySlug.get(s)).filter(
      (c): c is CalculatorSummary => Boolean(c)
    );
    return { label: 'Flagship Instruments', list: featured };
  }, [query, fuse, catalog, recentSlugs]);

  const close = useCallback(() => {
    setCommandOpen(false);
    setQuery('');
    setActiveIndex(0);
    setCopiedMath(false);
  }, [setCommandOpen]);

  const navigateTo = useCallback(
    (slug: string) => {
      close();
      router.push(`/calculator/${slug}`);
    },
    [close, router]
  );

  useEffect(() => {
    if (commandOpen) {
      if (!catalogLoaded) {
        void ensureCatalogLoaded();
      }
      // Focus next frame so dialog renders smoothly without scroll jump
      requestAnimationFrame(() => inputRef.current?.focus({ preventScroll: true }));
    }
  }, [commandOpen, catalogLoaded, ensureCatalogLoaded]);

  // Keep active row visible on arrow navigation
  useEffect(() => {
    const activeEl = listRef.current?.querySelector<HTMLElement>('[data-active="true"]');
    activeEl?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (items.list.length ? (prev + 1) % items.list.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) =>
        items.list.length ? (prev - 1 + items.list.length) % items.list.length : 0
      );
    } else if (e.key === 'Enter') {
      if (items.list[activeIndex]) {
        e.preventDefault();
        navigateTo(items.list[activeIndex].slug);
      }
    }
  };

  const handleCopyMath = async () => {
    if (!quickMathResult) return;
    try {
      await navigator.clipboard.writeText(quickMathResult.replace(/,/g, ''));
      setCopiedMath(true);
      setTimeout(() => setCopiedMath(false), 1600);
    } catch {}
  };

  if (!commandOpen) return null;

  return (
    <div
      className="cmd-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Search calculators and quick math"
      onClick={close}
    >
      <div
        className="cmd-dialog"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <div className="cmd-input-row">
          <Search size={18} strokeWidth={1.75} className="cmd-input-icon" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            className="cmd-input"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            placeholder="Search 656 instruments or type math (e.g. 250000 * 0.065 / 12)…"
            aria-label="Search calculators or evaluate expression"
          />
          {query && (
            <button
              type="button"
              className="cmd-clear-btn"
              onClick={() => {
                setQuery('');
                setActiveIndex(0);
              }}
              aria-label="Clear search"
            >
              <X size={15} strokeWidth={1.75} />
            </button>
          )}
          <button
            type="button"
            className="cmd-esc-btn"
            onClick={close}
            aria-label="Close search"
          >
            Esc
          </button>
        </div>

        {/* Instant Decimal.js Quick-Math Evaluator */}
        {quickMathResult && (
          <div className="cmd-math-card" role="status" aria-live="polite">
            <div className="cmd-math-card__meta">
              <Calculator size={15} strokeWidth={1.75} aria-hidden="true" />
              <span>Exact Decimal.js Evaluation</span>
            </div>
            <div className="cmd-math-card__row">
              <span className="cmd-math-card__expr">{query.trim()} =</span>
              <span className="cmd-math-card__val">{quickMathResult}</span>
              <button
                type="button"
                className="cmd-math-card__copy"
                onClick={handleCopyMath}
                aria-label="Copy evaluated result"
              >
                {copiedMath ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedMath ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        )}

        <div className="cmd-results" ref={listRef}>
          <div className="cmd-section-label">{items.label}</div>

          {items.list.length > 0 ? (
            <ul className="cmd-list" role="listbox">
              {items.list.map((calc, idx) => {
                const isActive = idx === activeIndex;
                const isFav = favorites.has(calc.id);
                const isRecent = !query.trim() && recentSlugs.includes(calc.slug);

                return (
                  <li key={calc.id} role="option" aria-selected={isActive}>
                    <button
                      type="button"
                      data-active={isActive ? 'true' : undefined}
                      className={`cmd-item ${isActive ? 'cmd-item--active' : ''}`}
                      onMouseEnter={() => setActiveIndex(idx)}
                      onClick={() => navigateTo(calc.slug)}
                    >
                      <span className="cmd-item__icon">
                        <CategoryIcon categoryId={calc.category} size={16} />
                      </span>
                      <span className="cmd-item__body">
                        <span className="cmd-item__title">
                          {calc.title}
                          {calc.isCustom && (
                            <span className="cmd-item__pill">Studio</span>
                          )}
                        </span>
                        <span className="cmd-item__meta">
                          {calc.categoryLabel} · {calc.description}
                        </span>
                      </span>
                      <span className="cmd-item__right">
                        {isFav && (
                          <Star
                            size={13}
                            strokeWidth={2}
                            className="cmd-item__star"
                            fill="currentColor"
                            aria-hidden="true"
                          />
                        )}
                        {isRecent && !isFav && (
                          <Clock size={13} strokeWidth={1.75} className="cmd-item__clock" aria-hidden="true" />
                        )}
                        {calc.isFeatured && !isFav && !isRecent && (
                          <Sparkles size={13} strokeWidth={1.75} className="cmd-item__clock" aria-hidden="true" />
                        )}
                        <ArrowRight size={14} strokeWidth={1.75} className="cmd-item__arrow" aria-hidden="true" />
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : !catalogLoaded ? (
            <div className="cmd-empty" role="status">
              <p>Loading precision index…</p>
              <span>You can already type any math expression above.</span>
            </div>
          ) : (
            <div className="cmd-empty">
              <p>No instruments matched “{query}”.</p>
              <span>Try broader keywords like “mortgage”, “lipid”, “solar”, or type a formula.</span>
            </div>
          )}
        </div>

        <div className="cmd-footer">
          <span>
            <kbd>↑</kbd> <kbd>↓</kbd> Navigate
          </span>
          <span>
            <kbd>↵</kbd> Open
          </span>
          <span>
            <kbd>Esc</kbd> Close
          </span>
        </div>
      </div>
    </div>
  );
}
