import type { Metadata } from 'next';
import { getCalculatorBySlug } from '@/lib/catalog';
import type { CalculatorSchema } from '@/types/calculator';
import WorkbookBuilder from '@/components/workbooks/WorkbookBuilder';

export const metadata: Metadata = {
  title: 'Workbooks — Chained Multi-Calculator Models',
  description:
    'Chain multiple Quantify calculators into live Decimal.js decision models. Pipe outputs from one instrument directly into the next, save locally, or share by URL.',
  openGraph: {
    title: 'Quantify Workbooks — Chained Multi-Calculator Models',
    description:
      'Build live multi-step financial, engineering, and business models where Step N inputs stay linked to upstream outputs.',
    type: 'website',
  },
};

const TEMPLATE_SLUGS = [
  'loan-emi',
  'fire-number-calculator',
  'compound-interest',
  'solar-payback',
  'roi-calculator',
] as const;

export default function WorkbooksPage() {
  const initialSchemas: Record<string, CalculatorSchema> = {};

  for (const slug of TEMPLATE_SLUGS) {
    const schema = getCalculatorBySlug(slug);
    if (schema) {
      initialSchemas[slug] = schema;
    }
  }

  return <WorkbookBuilder initialSchemas={initialSchemas} />;
}
