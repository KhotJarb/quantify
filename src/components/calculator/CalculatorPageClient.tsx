'use client';

import { useEffect, useMemo, useSyncExternalStore } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Star, ArrowLeft } from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import DynamicCalculatorEngine from '@/components/calculator/DynamicCalculatorEngine';
import DomainDisclaimer from '@/components/calculator/DomainDisclaimer';
import DemandPulse from '@/components/calculator/DemandPulse';
import { CategoryIcon } from '@/components/ui/SuiteIcon';
import { usePreferences } from '@/context/PreferencesContext';
import {
  getSuiteById,
  getSuiteForCategory,
  type CalculatorSummary,
  type EmbedCustomization,
} from '@/lib/suites';
import type { CalculatorSchema } from '@/types/calculator';

const CustomLoading = () => (
  <div className="wb-pane" role="status" aria-busy="true">
    <p className="wb-head__desc">Loading precision instrument…</p>
  </div>
);

const StandardCalculator = dynamic(
  () => import('@/components/calculator/StandardCalculator'),
  { loading: CustomLoading }
);
const ScientificCalculator = dynamic(
  () => import('@/components/calculator/ScientificCalculator'),
  { loading: CustomLoading }
);
const GapTimeOptimizer = dynamic(
  () => import('@/components/calculator/GapTimeOptimizer'),
  { loading: CustomLoading }
);
const FiftyMinutesCalculator = dynamic(
  () => import('@/components/calculator/FiftyMinutesCalculator'),
  { loading: CustomLoading }
);
const ProgressiveOverloadCalculator = dynamic(
  () => import('@/components/calculator/ProgressiveOverloadCalculator'),
  { loading: CustomLoading }
);
const AdvancedCalculator = dynamic(
  () => import('@/components/calculator/AdvancedCalculator'),
  { loading: CustomLoading }
);
const LDLCalculatorEnhanced = dynamic(
  () => import('@/components/calculator/LDLCalculatorEnhanced'),
  { loading: CustomLoading }
);

const CUSTOM_CALCULATORS: Record<string, React.ComponentType> = {
  'base-calculator': StandardCalculator,
  'scientific-calculator': ScientificCalculator,
  'gap-time-optimizer': GapTimeOptimizer,
  'fifty-minutes-calculator': FiftyMinutesCalculator,
  'progressive-overload': ProgressiveOverloadCalculator,
  'advanced-calculator': AdvancedCalculator,
  'ldl-cholesterol-calculator': LDLCalculatorEnhanced,
};

interface CalculatorPageClientProps {
  schema: CalculatorSchema;
  categoryLabel: string;
  related: CalculatorSummary[];
}

const subscribeUrl = (cb: () => void) => {
  window.addEventListener('popstate', cb);
  return () => window.removeEventListener('popstate', cb);
};

export default function CalculatorPageClient({
  schema,
  categoryLabel,
  related,
}: CalculatorPageClientProps) {
  const { favorites, toggleFavorite, recordVisit } = usePreferences();
  const urlSearch = useSyncExternalStore(
    subscribeUrl,
    () => window.location.search,
    () => ''
  );

  const embedInfo = useMemo(() => {
    const params = new URLSearchParams(urlSearch);
    const isEmbed = params.get('embed') === '1';
    const theme = params.get('theme');
    const accentRaw = params.get('accent');
    const accent =
      accentRaw && /^[0-9a-fA-F]{6}$/.test(accentRaw.replace(/^#/, ''))
        ? `#${accentRaw.replace(/^#/, '')}`
        : undefined;
    const config: EmbedCustomization = {
      title: params.get('title') || undefined,
      accent,
      theme: theme === 'light' || theme === 'dark' ? theme : 'auto',
      showChart: params.get('chart') !== '0',
      showMath: params.get('math') !== '0',
      showCompare: params.get('compare') !== '0',
      ctaLabel: params.get('cta') || undefined,
      ctaUrl: params.get('ctaUrl') || undefined,
    };
    return { isEmbed, config };
  }, [urlSearch]);

  const embedMode = embedInfo.isEmbed;
  const suiteId = getSuiteForCategory(schema.category);
  const suite = getSuiteById(suiteId);
  const CustomComponent = CUSTOM_CALCULATORS[schema.slug];
  const isFav = favorites.has(schema.id);

  useEffect(() => {
    if (embedMode && (embedInfo.config.theme === 'light' || embedInfo.config.theme === 'dark')) {
      document.documentElement.classList.toggle('dark', embedInfo.config.theme === 'dark');
    }

    if (!embedMode) {
      recordVisit(schema.slug);
    }
  }, [schema.slug, embedMode, embedInfo.config.theme, recordVisit]);

  // Chrome-free embed mode (powers 1-line iframe widgets cleanly)
  if (embedMode) {
    return (
      <div className="embed-shell">
        {CustomComponent ? (
          <CustomComponent />
        ) : (
          <DynamicCalculatorEngine
            schema={schema}
            mode="embed"
            embedConfig={embedInfo.config}
          />
        )}
      </div>
    );
  }

  const breadcrumbs = [
    { label: 'Workbench', href: '/' },
    ...(suite ? [{ label: suite.shortLabel, href: `/?suite=${suite.id}` }] : []),
    { label: categoryLabel, href: `/?category=${schema.category}` },
    { label: schema.title },
  ];

  return (
    <AppShell activeSuite={suiteId} breadcrumbs={breadcrumbs}>
      <div className="calc-page-wrap">
        <div className="calc-page-back">
          <Link href={`/?suite=${suiteId}`} className="back-link">
            <ArrowLeft size={14} strokeWidth={1.75} aria-hidden="true" />
            <span>Back to {suite?.label ?? 'Workbench'}</span>
          </Link>

          {CustomComponent && (
            <button
              type="button"
              className={`btn btn--ghost btn--sm ${isFav ? 'btn--saved' : ''}`}
              onClick={() => toggleFavorite(schema.id)}
              aria-pressed={isFav}
            >
              <Star
                size={14}
                strokeWidth={1.75}
                fill={isFav ? 'currentColor' : 'none'}
                aria-hidden="true"
              />
              <span>{isFav ? 'Saved' : 'Save'}</span>
            </button>
          )}
        </div>

        {CustomComponent ? (
          <>
            <div className="custom-calc-frame">
              <CustomComponent />
            </div>

            <DomainDisclaimer
              category={schema.category}
              subcategory={schema.subcategory}
            />
            <DemandPulse slug={schema.slug} suiteId={suiteId} />

            {related.length > 0 && (
              <section className="related-section" aria-label="Related instruments">
                <h2 className="related-section__title">Related Instruments</h2>
                <div className="related-grid">
                  {related.map((item) => (
                    <Link
                      key={item.id}
                      href={`/calculator/${item.slug}`}
                      className="related-card"
                    >
                      <span className="related-card__icon">
                        <CategoryIcon categoryId={item.category} size={16} />
                      </span>
                      <div className="related-card__body">
                        <span className="related-card__title">{item.title}</span>
                        <span className="related-card__desc">{item.description}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </>
        ) : (
          <>
            <DynamicCalculatorEngine schema={schema} mode="page" related={related} />
            <DomainDisclaimer
              category={schema.category}
              subcategory={schema.subcategory}
            />
            <DemandPulse slug={schema.slug} suiteId={suiteId} />
          </>
        )}
      </div>
    </AppShell>
  );
}
