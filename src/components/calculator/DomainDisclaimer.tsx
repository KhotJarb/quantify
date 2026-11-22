'use client';

import { ShieldAlert, Info } from 'lucide-react';

interface DomainDisclaimerProps {
  category: string;
  subcategory?: string;
}

function getDisclaimer(
  category: string,
  subcategory?: string
): { tone: 'clinical' | 'advisory'; heading: string; copy: string } | null {
  if (category === 'medical' || category === 'health') {
    return {
      tone: 'clinical',
      heading: 'Clinical & Health Notice',
      copy: 'Outputs are deterministic mathematical estimates for informational and educational use only—not medical advice, diagnosis, or dosing instruction. Always verify clinical decisions with a licensed healthcare professional.',
    };
  }

  if (category === 'legal') {
    return {
      tone: 'clinical',
      heading: 'Legal Notice',
      copy: 'Calculations provide general estimates only and do not constitute legal advice. Statutory formulas, deadlines, and penalties vary by jurisdiction—consult a licensed attorney before acting.',
    };
  }

  if (category === 'finance' || category === 'crypto') {
    return {
      tone: 'advisory',
      heading: 'Financial Estimation Notice',
      copy: 'Results reflect exact mathematical formulas based solely on your entered assumptions—not personalized investment, tax, or lending advice. Real-world fees, taxes, and market volatility will differ.',
    };
  }

  if (category === 'sports' && subcategory === 'odds-betting') {
    return {
      tone: 'advisory',
      heading: 'Informational Probability Notice',
      copy: 'Odds and expected-value calculations are purely mathematical models for analytical reference and do not guarantee outcomes.',
    };
  }

  return null;
}

export default function DomainDisclaimer({
  category,
  subcategory,
}: DomainDisclaimerProps) {
  const notice = getDisclaimer(category, subcategory);
  if (!notice) return null;

  return (
    <aside
      className={`domain-notice domain-notice--${notice.tone}`}
      role="note"
      aria-label={notice.heading}
    >
      <span className="domain-notice__icon" aria-hidden="true">
        {notice.tone === 'clinical' ? (
          <ShieldAlert size={16} strokeWidth={1.75} />
        ) : (
          <Info size={16} strokeWidth={1.75} />
        )}
      </span>
      <div className="domain-notice__body">
        <strong className="domain-notice__title">{notice.heading}:</strong>{' '}
        <span>{notice.copy}</span>
      </div>
    </aside>
  );
}
