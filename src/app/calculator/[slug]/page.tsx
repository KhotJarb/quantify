import type { Metadata } from 'next';
import Link from 'next/link';
import {
  getCalculatorBySlug,
  getCategorySummaries,
  getFlagshipPrebuildSlugs,
  getRelatedCalculators,
  getSiteUrl,
} from '@/lib/catalog';
import CalculatorPageClient from '@/components/calculator/CalculatorPageClient';
import AppShell from '@/components/layout/AppShell';

interface CalculatorPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getFlagshipPrebuildSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: CalculatorPageProps): Promise<Metadata> {
  const { slug } = await params;
  const schema = getCalculatorBySlug(slug);

  if (!schema) {
    return {
      title: 'Instrument Not Found',
      description: 'The requested Quantify calculator could not be found.',
    };
  }

  const siteUrl = getSiteUrl();
  const canonicalUrl = `${siteUrl}/calculator/${schema.slug}`;

  return {
    title: schema.title,
    description: schema.description,
    keywords: [...(schema.tags ?? []), schema.category, 'calculator', 'Quantify'],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${schema.title} | Quantify`,
      description: schema.description,
      url: canonicalUrl,
      type: 'website',
      siteName: 'Quantify',
    },
    twitter: {
      card: 'summary',
      title: `${schema.title} | Quantify`,
      description: schema.description,
    },
  };
}

export default async function CalculatorPage({ params }: CalculatorPageProps) {
  const { slug } = await params;
  const schema = getCalculatorBySlug(slug);

  if (!schema) {
    return (
      <AppShell breadcrumbs={[{ label: 'Workbench', href: '/' }, { label: 'Not Found' }]}>
        <div className="calc-page-wrap">
          <div className="empty-panel" role="status">
            <h1 className="empty-panel__title">Instrument not found</h1>
            <p className="empty-panel__desc">
              The calculator you requested does not exist or may have moved.
            </p>
            <Link href="/" className="btn btn--primary">
              Return to Workbench
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  const categoryMeta = getCategorySummaries().find((c) => c.id === schema.category);
  const categoryLabel = categoryMeta?.label ?? schema.category;
  const related = getRelatedCalculators(schema.slug, 4);
  const siteUrl = getSiteUrl();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: schema.title,
    description: schema.description,
    url: `${siteUrl}/calculator/${schema.slug}`,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <CalculatorPageClient
        schema={schema}
        categoryLabel={categoryLabel}
        related={related}
      />
    </>
  );
}
