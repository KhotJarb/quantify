import WorkbenchHome from '@/components/dashboard/WorkbenchHome';
import {
  getCatalogSummaries,
  getCategorySummaries,
  getSiteUrl,
} from '@/lib/catalog';

export default function HomePage() {
  const catalog = getCatalogSummaries();
  const categories = getCategorySummaries();
  const siteUrl = getSiteUrl();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Quantify',
    url: siteUrl,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Web',
    description: `Deterministic, arbitrary-precision calculation workbench featuring ${catalog.length} verified instruments across wealth, clinical health, engineering, science, and operations.`,
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
      <WorkbenchHome initialCatalog={catalog} initialCategories={categories} />
    </>
  );
}
