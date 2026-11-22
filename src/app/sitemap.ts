import type { MetadataRoute } from 'next';
import { getCatalogSummaries, getSiteUrl } from '@/lib/catalog';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();
  const summaries = getCatalogSummaries();
  const now = new Date();

  const coreEntries: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/workbooks`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/studio`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/methodology`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  const calculatorEntries: MetadataRoute.Sitemap = summaries.map((calc) => ({
    url: `${baseUrl}/calculator/${calc.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: calc.isFeatured ? 0.9 : calc.suiteId === 'explore' ? 0.6 : 0.8,
  }));

  return [...coreEntries, ...calculatorEntries];
}
