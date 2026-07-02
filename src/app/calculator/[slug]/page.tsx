'use client';

import { use, useMemo } from 'react';
import Link from 'next/link';
import DynamicCalculatorEngine from '@/components/calculator/DynamicCalculatorEngine';
import StandardCalculator from '@/components/calculator/StandardCalculator';
import ScientificCalculator from '@/components/calculator/ScientificCalculator';
import GapTimeOptimizer from '@/components/calculator/GapTimeOptimizer';
import FiftyMinutesCalculator from '@/components/calculator/FiftyMinutesCalculator';
import ProgressiveOverloadCalculator from '@/components/calculator/ProgressiveOverloadCalculator';
import { calculators, categories } from '@/data/calculators';

// Slugs that use a custom component instead of DynamicCalculatorEngine
const CUSTOM_CALCULATORS: Record<string, React.ComponentType> = {
  'base-calculator': StandardCalculator,
  'scientific-calculator': ScientificCalculator,
  'gap-time-optimizer': GapTimeOptimizer,
  'fifty-minutes-calculator': FiftyMinutesCalculator,
  'progressive-overload': ProgressiveOverloadCalculator,
  'progressive-overload-special': ProgressiveOverloadCalculator,
};

interface CalculatorPageProps {
  params: Promise<{ slug: string }>;
}

export default function CalculatorPage({ params }: CalculatorPageProps) {
  const { slug } = use(params);

  const schema = useMemo(
    () => calculators.find((c) => c.slug === slug),
    [slug]
  );

  if (!schema) {
    return (
      <div className="app-layout">
        <main className="app-main" style={{ marginLeft: 0 }}>
          <div className="app-content">
            <div className="empty-state">
              <div className="empty-state__icon">🚫</div>
              <h3 className="empty-state__title">Calculator not found</h3>
              <p className="empty-state__desc">
                The calculator you&apos;re looking for doesn&apos;t exist.
              </p>
              <Link href="/" className="btn btn--primary" style={{ marginTop: '1.5rem' }}>
                ← Back to Dashboard
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const categoryLabel = categories.find((c) => c.id === schema.category)?.label ?? schema.category;
  const CustomComponent = CUSTOM_CALCULATORS[slug];

  return (
    <div className="app-layout">
      <main className="app-main" style={{ marginLeft: 0 }}>
        <header className="app-header">
          <nav className="breadcrumb">
            <Link href="/" className="breadcrumb__link">
              Dashboard
            </Link>
            <span className="breadcrumb__separator">/</span>
            <Link href={`/?category=${schema.category}`} className="breadcrumb__link">
              {categoryLabel}
            </Link>
            <span className="breadcrumb__separator">/</span>
            <span className="breadcrumb__current">{schema.title}</span>
          </nav>
        </header>

        <div className="app-content">
          {CustomComponent ? <CustomComponent /> : <DynamicCalculatorEngine schema={schema} />}
        </div>
      </main>
    </div>
  );
}
