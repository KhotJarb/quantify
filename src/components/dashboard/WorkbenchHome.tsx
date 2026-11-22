'use client';

import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Fuse from 'fuse.js';
import {
  Search,
  Star,
  Clock,
  SlidersHorizontal,
  ArrowRight,
  X,
  GitCompareArrows,
  Sigma,
  Code2,
  Bookmark,
  Download,
  Upload,
  Trash2,
  Workflow,
  ExternalLink,
} from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import CalculatorCard from '@/components/calculator/CalculatorCard';
import { SuiteIcon, CategoryIcon } from '@/components/ui/SuiteIcon';
import { usePreferences } from '@/context/PreferencesContext';
import {
  FLAGSHIP_SUITES,
  SUITES,
  FEATURED_INSTRUMENT_SLUGS,
  getSuiteById,
  getSuiteForCategory,
  type SuiteId,
  type CalculatorSummary,
  type CategorySummary,
  type SavedScenario,
} from '@/lib/suites';

function buildScenarioHref(s: SavedScenario): string {
  const params = new URLSearchParams();
  params.set('a', JSON.stringify({ v: s.valuesA, u: s.unitsA }));
  if (s.compareMode && s.valuesB) {
    params.set('b', JSON.stringify({ v: s.valuesB, u: s.unitsB ?? {} }));
  }
  return `/calculator/${s.slug}?${params.toString()}`;
}

function formatSavedDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}

const PAGE_SIZE = 24;

interface WorkbenchHomeProps {
  initialCatalog: CalculatorSummary[];
  initialCategories: CategorySummary[];
}

export default function WorkbenchHome({
  initialCatalog,
  initialCategories,
}: WorkbenchHomeProps) {
  const {
    suiteCounts,
    seedCatalog,
    favorites,
    toggleFavorite,
    recentSlugs,
    savedScenarios,
    deleteScenario,
    importScenarios,
    openCommand,
  } = usePreferences();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const catalog = initialCatalog;
  const categories = initialCategories;

  useEffect(() => {
    seedCatalog(initialCatalog, initialCategories);
  }, [initialCatalog, initialCategories, seedCatalog]);

  const [activeView, setActiveView] = useState<SuiteId | 'all' | 'favorites'>('all');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [inlineQuery, setInlineQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Sync initial view/category from URL query params (fixes deep links & breadcrumbs)
  useEffect(() => {
    const syncFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      const view = params.get('view');
      const suiteParam = params.get('suite') as SuiteId | null;
      const catParam = params.get('category');

      if (view === 'favorites') {
        setActiveView('favorites');
        setActiveCategory(null);
      } else if (catParam) {
        setActiveView(getSuiteForCategory(catParam));
        setActiveCategory(catParam);
      } else if (suiteParam && SUITES.some((s) => s.id === suiteParam)) {
        setActiveView(suiteParam);
        setActiveCategory(null);
      } else {
        setActiveView('all');
        setActiveCategory(null);
      }
      setVisibleCount(PAGE_SIZE);
    };

    syncFromUrl();
    window.addEventListener('popstate', syncFromUrl);
    return () => window.removeEventListener('popstate', syncFromUrl);
  }, []);

  const updateUrl = useCallback((nextView: SuiteId | 'all' | 'favorites', nextCat: string | null) => {
    const url = new URL(window.location.href);
    url.searchParams.delete('view');
    url.searchParams.delete('suite');
    url.searchParams.delete('category');
    if (nextView === 'favorites') {
      url.searchParams.set('view', 'favorites');
    } else if (nextCat) {
      url.searchParams.set('category', nextCat);
    } else if (nextView !== 'all') {
      url.searchParams.set('suite', nextView);
    }
    window.history.replaceState({}, '', url.toString());
  }, []);

  const handleSelectSuite = useCallback(
    (suite: SuiteId | 'all' | 'favorites') => {
      setActiveView(suite);
      setActiveCategory(null);
      setInlineQuery('');
      setVisibleCount(PAGE_SIZE);
      updateUrl(suite, null);
    },
    [updateUrl]
  );

  const handleSelectCategory = useCallback(
    (categoryId: string | null) => {
      setActiveCategory(categoryId);
      setVisibleCount(PAGE_SIZE);
      updateUrl(activeView, categoryId);
    },
    [activeView, updateUrl]
  );

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

  const featuredInstruments = useMemo(() => {
    const bySlug = new Map(catalog.map((c) => [c.slug, c]));
    return FEATURED_INSTRUMENT_SLUGS.map((slug) => bySlug.get(slug)).filter(
      (c): c is CalculatorSummary => Boolean(c)
    );
  }, [catalog]);

  const recentInstruments = useMemo(() => {
    const bySlug = new Map(catalog.map((c) => [c.slug, c]));
    return recentSlugs
      .map((slug) => bySlug.get(slug))
      .filter((c): c is CalculatorSummary => Boolean(c))
      .slice(0, 4);
  }, [catalog, recentSlugs]);

  const categoriesInSuite = useMemo(() => {
    if (activeView === 'all' || activeView === 'favorites') return [];
    return categories
      .filter((c) => c.suiteId === activeView && c.count > 0)
      .sort((a, b) => b.count - a.count);
  }, [categories, activeView]);

  const filteredCalculators = useMemo(() => {
    const q = inlineQuery.trim();
    let pool: CalculatorSummary[];

    if (q.length >= 2) {
      pool = fuse.search(q).map((r) => r.item);
    } else {
      pool = catalog;
    }

    if (activeView === 'favorites') {
      return pool.filter((c) => favorites.has(c.id));
    }

    if (activeView !== 'all') {
      pool = pool.filter((c) => c.suiteId === activeView);
    } else if (!q) {
      // On the flagship Workbench home view, prioritize the 5 Flagship Suites ahead of Explore
      pool = [...pool].sort((a, b) => {
        const aRank = (a.isFeatured ? 3 : 0) + (a.isCustom ? 2 : 0) + (a.suiteId !== 'explore' ? 1 : 0);
        const bRank = (b.isFeatured ? 3 : 0) + (b.isCustom ? 2 : 0) + (b.suiteId !== 'explore' ? 1 : 0);
        return bRank - aRank;
      });
    }

    if (activeCategory) {
      pool = pool.filter((c) => c.category === activeCategory);
    }

    return pool;
  }, [catalog, fuse, inlineQuery, activeView, activeCategory, favorites]);

  const filteredScenarios = useMemo(() => {
    const q = inlineQuery.trim().toLowerCase();
    if (!q) return savedScenarios;
    return savedScenarios.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.title.toLowerCase().includes(q) ||
        s.slug.toLowerCase().includes(q)
    );
  }, [savedScenarios, inlineQuery]);

  const handleExportScenarios = useCallback(() => {
    if (savedScenarios.length === 0) return;
    try {
      const payload = JSON.stringify(
        {
          app: 'Quantify',
          version: 2,
          exportedAt: new Date().toISOString(),
          scenarios: savedScenarios,
        },
        null,
        2
      );
      const blob = new Blob([payload], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'quantify-scenarios.json';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setImportStatus(`Exported ${savedScenarios.length} scenario${savedScenarios.length === 1 ? '' : 's'}.`);
      setTimeout(() => setImportStatus(null), 2600);
    } catch {
      setImportStatus('Unable to export file on this browser.');
    }
  }, [savedScenarios]);

  const handleImportFile = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = '';
      if (!file) return;
      try {
        const text = await file.text();
        const parsed = JSON.parse(text);
        const list = Array.isArray(parsed)
          ? parsed
          : Array.isArray(parsed?.scenarios)
          ? parsed.scenarios
          : [];
        const added = importScenarios(list as SavedScenario[]);
        setImportStatus(
          added > 0
            ? `Imported ${added} new scenario${added === 1 ? '' : 's'}.`
            : 'No new scenarios found in file.'
        );
      } catch {
        setImportStatus('Invalid JSON file. Expected a Quantify scenarios export.');
      }
      setTimeout(() => setImportStatus(null), 3200);
    },
    [importScenarios]
  );

  const activeSuiteMeta =
    activeView !== 'all' && activeView !== 'favorites'
      ? getSuiteById(activeView)
      : undefined;

  const visibleItems = filteredCalculators.slice(0, visibleCount);
  const remaining = Math.max(0, filteredCalculators.length - visibleItems.length);
  const isDefaultOverview = activeView === 'all' && !activeCategory && !inlineQuery.trim();

  return (
    <AppShell activeSuite={activeView} onSelectSuite={handleSelectSuite}>
      <div className="home-wrap">
        {/* Asymmetric Precision Instrument Masthead (Overview Mode) */}
        {isDefaultOverview ? (
          <section className="hero-slab" aria-label="Quantify Workbench">
            <div className="hero-slab__main">
              <h1 className="hero-slab__title">
                Precision instruments for high-stakes decisions.
              </h1>
              <p className="hero-slab__lead">
                Deterministic arbitrary-precision computation across wealth, clinical health, engineering, science, and operations—with side-by-side scenario diffs and auditable math.
              </p>

              <div className="hero-slab__search-row">
                <div className="inline-search">
                  <Search size={17} strokeWidth={1.75} className="inline-search__icon" aria-hidden="true" />
                  <input
                    type="text"
                    className="inline-search__input"
                    value={inlineQuery}
                    onChange={(e) => {
                      setInlineQuery(e.target.value);
                      setVisibleCount(PAGE_SIZE);
                    }}
                    placeholder={`Filter ${catalog.length} instruments by domain, formula, or metric…`}
                    aria-label="Filter instruments"
                  />
                  {inlineQuery && (
                    <button
                      type="button"
                      className="inline-search__clear"
                      onClick={() => setInlineQuery('')}
                      aria-label="Clear filter"
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={openCommand}
                >
                  <span>Quick Math</span>
                  <kbd className="btn-kbd">⌘K</kbd>
                </button>
              </div>
            </div>

            <aside className="hero-slab__spec" aria-label="Engine specifications">
              <div className="spec-row">
                <span className="spec-row__key">Verified Instruments</span>
                <span className="spec-row__val">{catalog.length}</span>
              </div>
              <div className="spec-row">
                <span className="spec-row__key">Flagship Suites</span>
                <span className="spec-row__val">{FLAGSHIP_SUITES.length}</span>
              </div>
              <div className="spec-row">
                <span className="spec-row__key">Arithmetic Core</span>
                <span className="spec-row__val spec-row__val--text">Decimal.js AST</span>
              </div>
              <div className="spec-capabilities">
                <span className="spec-cap">
                  <GitCompareArrows size={13} strokeWidth={1.75} aria-hidden="true" />
                  <span>A / B Scenarios</span>
                </span>
                <Link href="/workbooks" className="spec-cap spec-cap--link">
                  <Workflow size={13} strokeWidth={1.75} aria-hidden="true" />
                  <span>Workbooks</span>
                </Link>
                <Link href="/studio" className="spec-cap spec-cap--link">
                  <Code2 size={13} strokeWidth={1.75} aria-hidden="true" />
                  <span>Embed Studio</span>
                </Link>
                <Link href="/methodology" className="spec-cap spec-cap--link">
                  <Sigma size={13} strokeWidth={1.75} aria-hidden="true" />
                  <span>Formula Audit</span>
                </Link>
              </div>
            </aside>
          </section>
        ) : (
          <section className="suite-banner">
            <div className="suite-banner__head">
              <div className="suite-banner__title-group">
                {activeView === 'favorites' ? (
                  <span className="suite-banner__icon">
                    <Star size={20} strokeWidth={1.75} aria-hidden="true" />
                  </span>
                ) : activeSuiteMeta ? (
                  <span className="suite-banner__icon">
                    <SuiteIcon suiteId={activeSuiteMeta.id} size={20} />
                  </span>
                ) : null}
                <div>
                  <h1 className="suite-banner__title">
                    {activeView === 'favorites'
                      ? 'Saved Library'
                      : activeSuiteMeta?.label ?? 'All Instruments'}
                  </h1>
                  <p className="suite-banner__desc">
                    {activeView === 'favorites'
                      ? 'Your saved scenario snapshots and pinned calculators, stored locally on this device.'
                      : activeSuiteMeta?.description ??
                        'Complete verified index of precision calculators.'}
                  </p>
                </div>
              </div>

              <div className="suite-banner__search">
                <div className="inline-search">
                  <Search size={16} strokeWidth={1.75} className="inline-search__icon" aria-hidden="true" />
                  <input
                    type="text"
                    className="inline-search__input"
                    value={inlineQuery}
                    onChange={(e) => {
                      setInlineQuery(e.target.value);
                      setVisibleCount(PAGE_SIZE);
                    }}
                    placeholder={`Filter ${filteredCalculators.length} instruments…`}
                    aria-label="Filter current suite"
                  />
                  {inlineQuery && (
                    <button
                      type="button"
                      className="inline-search__clear"
                      onClick={() => setInlineQuery('')}
                      aria-label="Clear filter"
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {categoriesInSuite.length > 1 && (
              <div className="cat-pills" role="tablist" aria-label="Categories in suite">
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeCategory === null}
                  className={`cat-pill ${activeCategory === null ? 'cat-pill--active' : ''}`}
                  onClick={() => handleSelectCategory(null)}
                >
                  <span>All ({suiteCounts[activeView as SuiteId]})</span>
                </button>
                {categoriesInSuite.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    role="tab"
                    aria-selected={activeCategory === cat.id}
                    className={`cat-pill ${activeCategory === cat.id ? 'cat-pill--active' : ''}`}
                    onClick={() => handleSelectCategory(cat.id)}
                  >
                    <CategoryIcon categoryId={cat.id} size={13} />
                    <span>{cat.label}</span>
                    <span className="cat-pill__count">{cat.count}</span>
                  </button>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Flagship Suites Navigation Strip (visible on Overview) */}
        {isDefaultOverview && (
          <section className="suites-section" aria-label="Flagship Suites">
            <div className="section-bar">
              <h2 className="section-bar__title">Flagship Suites</h2>
              <button
                type="button"
                className="section-bar__action"
                onClick={() => handleSelectSuite('explore')}
              >
                <span>Explore Library ({suiteCounts.explore})</span>
                <ArrowRight size={14} strokeWidth={1.75} aria-hidden="true" />
              </button>
            </div>

            <div className="suite-grid">
              {FLAGSHIP_SUITES.map((suite) => (
                <button
                  key={suite.id}
                  type="button"
                  className="suite-tile"
                  onClick={() => handleSelectSuite(suite.id)}
                >
                  <div className="suite-tile__top">
                    <span className="suite-tile__icon">
                      <SuiteIcon suiteId={suite.id} size={18} />
                    </span>
                    <span className="suite-tile__count">{suiteCounts[suite.id]}</span>
                  </div>
                  <span className="suite-tile__title">{suite.label}</span>
                  <span className="suite-tile__tagline">{suite.tagline}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Recent Instruments Strip (Returning users) */}
        {isDefaultOverview && recentInstruments.length > 0 && (
          <section className="recent-section" aria-label="Recently used">
            <div className="section-bar">
              <h2 className="section-bar__title">
                <Clock size={15} strokeWidth={1.75} aria-hidden="true" />
                <span>Jump Back In</span>
              </h2>
            </div>
            <div className="recent-strip">
              {recentInstruments.map((calc) => (
                <Link
                  key={calc.id}
                  href={`/calculator/${calc.slug}`}
                  className="recent-chip"
                >
                  <CategoryIcon categoryId={calc.category} size={14} />
                  <span>{calc.title}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Featured Decision Instruments (Overview Mode) */}
        {isDefaultOverview && (
          <section className="featured-section" aria-label="Featured studio instruments">
            <div className="section-bar">
              <h2 className="section-bar__title">Featured Instruments</h2>
              <span className="section-bar__meta">Interactive · A/B Ready</span>
            </div>
            <div className="inst-grid inst-grid--featured">
              {featuredInstruments.map((calc) => (
                <CalculatorCard
                  key={calc.id}
                  calculator={calc}
                  variant="featured"
                  isFavorite={favorites.has(calc.id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          </section>
        )}

        {/* Saved Scenarios Section (Favorites / Saved Library view) */}
        {activeView === 'favorites' && (
          <section className="scenarios-section" aria-label="Saved scenario snapshots">
            <div className="section-bar">
              <h2 className="section-bar__title">
                <Bookmark size={15} strokeWidth={1.75} aria-hidden="true" />
                <span>Saved Scenarios ({filteredScenarios.length})</span>
              </h2>
              <div className="scenarios-toolbar">
                {importStatus && (
                  <span className="scenarios-status" role="status">
                    {importStatus}
                  </span>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/json,.json"
                  className="sr-only"
                  onChange={handleImportFile}
                  aria-label="Import saved scenarios JSON file"
                />
                <button
                  type="button"
                  className="btn btn--ghost btn--xs"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload size={13} strokeWidth={1.75} aria-hidden="true" />
                  <span>Import JSON</span>
                </button>
                <button
                  type="button"
                  className="btn btn--ghost btn--xs"
                  onClick={handleExportScenarios}
                  disabled={savedScenarios.length === 0}
                >
                  <Download size={13} strokeWidth={1.75} aria-hidden="true" />
                  <span>Export JSON</span>
                </button>
              </div>
            </div>

            {filteredScenarios.length > 0 ? (
              <div className="scenario-grid">
                {filteredScenarios.map((snap) => (
                  <article key={snap.id} className="scenario-card">
                    <div className="scenario-card__top">
                      <span className="scenario-card__icon">
                        <CategoryIcon categoryId={snap.category} size={15} />
                      </span>
                      <div className="scenario-card__meta">
                        <h3 className="scenario-card__name">{snap.name}</h3>
                        <span className="scenario-card__sub">
                          {snap.title} · {formatSavedDate(snap.createdAt)}
                        </span>
                      </div>
                      <button
                        type="button"
                        className="snapshot-item__del"
                        onClick={() => deleteScenario(snap.id)}
                        aria-label={`Delete scenario ${snap.name}`}
                        title="Delete scenario"
                      >
                        <Trash2 size={14} strokeWidth={1.75} />
                      </button>
                    </div>

                    <div className="scenario-card__readout">
                      <span className="scenario-card__label">{snap.primaryLabel}</span>
                      <div className="scenario-card__val-row">
                        <span className="scenario-card__val">{snap.primaryValue}</span>
                        {snap.compareMode && snap.primaryValueB && (
                          <span className="scenario-card__val-b">vs. {snap.primaryValueB}</span>
                        )}
                      </div>
                    </div>

                    <div className="scenario-card__foot">
                      {snap.compareMode ? (
                        <span className="scenario-card__badge">A / B Diff</span>
                      ) : (
                        <span className="scenario-card__badge">{snap.currencyCode}</span>
                      )}
                      <Link href={buildScenarioHref(snap)} className="btn btn--primary btn--xs">
                        <span>Open Scenario</span>
                        <ExternalLink size={12} aria-hidden="true" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="scenarios-empty">
                <p>
                  {inlineQuery.trim()
                    ? 'No saved scenarios match your filter.'
                    : 'No saved snapshots yet. Open any calculator and click “Save Snapshot” to store named A or A/B scenarios locally.'}
                </p>
              </div>
            )}
          </section>
        )}

        {/* Main Filtered Catalog Index (Windowed for 60fps mobile & desktop performance) */}
        <section className="catalog-section" aria-label="Instrument catalog">
          <div className="section-bar">
            <h2 className="section-bar__title">
              <SlidersHorizontal size={15} strokeWidth={1.75} aria-hidden="true" />
              <span>
                {inlineQuery.trim()
                  ? `Search Results`
                  : isDefaultOverview
                  ? 'Complete Precision Directory'
                  : activeCategory
                  ? categories.find((c) => c.id === activeCategory)?.label ?? 'Instruments'
                  : activeView === 'favorites'
                  ? 'Pinned Tools'
                  : `${activeSuiteMeta?.label ?? 'All'} Index`}
              </span>
            </h2>
            <span className="section-bar__meta">
              Showing {visibleItems.length} of {filteredCalculators.length}
            </span>
          </div>

          {visibleItems.length > 0 ? (
            <>
              <div className="inst-grid">
                {visibleItems.map((calc) => (
                  <CalculatorCard
                    key={calc.id}
                    calculator={calc}
                    isFavorite={favorites.has(calc.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>

              {remaining > 0 && (
                <div className="load-more-row">
                  <button
                    type="button"
                    className="btn btn--secondary"
                    onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                  >
                    <span>
                      Load {Math.min(PAGE_SIZE, remaining)} more ({remaining} remaining)
                    </span>
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="empty-panel" role="status">
              <span className="empty-panel__icon">
                {activeView === 'favorites' ? (
                  <Star size={28} strokeWidth={1.5} aria-hidden="true" />
                ) : (
                  <Search size={28} strokeWidth={1.5} aria-hidden="true" />
                )}
              </span>
              <h3 className="empty-panel__title">
                {activeView === 'favorites'
                  ? 'No saved instruments yet'
                  : 'No matching instruments'}
              </h3>
              <p className="empty-panel__desc">
                {activeView === 'favorites'
                  ? 'Tap the star icon on any calculator card or inside a workbench to pin it here.'
                  : 'Try broadening your search terms or clearing the active suite filter.'}
              </p>
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => handleSelectSuite('all')}
              >
                Return to Workbench
              </button>
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
