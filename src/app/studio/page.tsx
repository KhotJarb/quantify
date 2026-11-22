import type { Metadata } from 'next';
import { getCalculatorBySlug } from '@/lib/catalog';
import StudioBuilder from '@/components/studio/StudioBuilder';

export const metadata: Metadata = {
  title: 'Studio — Interactive Embeddable Calculator Builder',
  description:
    'Customize any of 640+ Decimal.js calculators with your brand accent, theme, custom title, and call-to-action button, then copy a zero-backend HTML iframe snippet.',
  openGraph: {
    title: 'Quantify Studio — Interactive Embeddable Calculator Builder',
    description:
      'Design and embed custom-branded precision calculators on any website in 30 seconds.',
    type: 'website',
  },
};

export default function StudioPage() {
  const defaultSchema =
    getCalculatorBySlug('compound-interest') ?? getCalculatorBySlug('loan-emi')!;

  return <StudioBuilder initialSchema={defaultSchema} />;
}
