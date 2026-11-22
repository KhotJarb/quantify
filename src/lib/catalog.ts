// ============================================================================
// Quantify — Server-Side Catalog & Schema Index
// ============================================================================
// Imports the full 2.7 MB calculator registry ONLY on the server.
// Client pages receive compact CalculatorSummary metadata (~130 KB raw) or
// a single resolved CalculatorSchema per route.
// ============================================================================

import { calculators, categories } from '@/data/calculators';
import type { CalculatorSchema } from '@/types/calculator';
import {
  CUSTOM_CALCULATOR_SLUGS,
  FEATURED_INSTRUMENT_SLUGS,
  SUITES,
  getSuiteForCategory,
  type CalculatorSummary,
  type CategorySummary,
  type SuiteId,
} from './suites';

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
  'https://quantify-ashen.vercel.app';

export function getSiteUrl(): string {
  return SITE_URL;
}

const categoryLabelMap = new Map<string, string>(
  categories.map((c) => [c.id, c.label])
);

const slugToSchema = new Map<string, CalculatorSchema>();
for (const calc of calculators) {
  if (!slugToSchema.has(calc.slug)) {
    slugToSchema.set(calc.slug, calc);
  }
}

const featuredSlugSet = new Set(FEATURED_INSTRUMENT_SLUGS);

let _cachedSummaries: CalculatorSummary[] | null = null;
let _cachedCategories: CategorySummary[] | null = null;

export function getCatalogSummaries(): CalculatorSummary[] {
  if (_cachedSummaries) return _cachedSummaries;

  _cachedSummaries = calculators.map((c) => ({
    id: c.id,
    slug: c.slug,
    title: c.title,
    description: c.description,
    category: c.category,
    categoryLabel: categoryLabelMap.get(c.category) ?? c.category,
    subcategory: c.subcategory,
    suiteId: getSuiteForCategory(c.category),
    tags: c.tags ?? [],
    isCustom: CUSTOM_CALCULATOR_SLUGS.has(c.slug),
    isFeatured: featuredSlugSet.has(c.slug),
    inputCount: c.inputs?.length ?? 0,
    outputCount: c.outputs?.length ?? 0,
  }));

  return _cachedSummaries;
}

export function getCategorySummaries(): CategorySummary[] {
  if (_cachedCategories) return _cachedCategories;

  const catCounts = new Map<string, number>();
  const subCounts = new Map<string, number>();

  for (const c of calculators) {
    catCounts.set(c.category, (catCounts.get(c.category) ?? 0) + 1);
    if (c.subcategory) {
      const key = `${c.category}:${c.subcategory}`;
      subCounts.set(key, (subCounts.get(key) ?? 0) + 1);
    }
  }

  _cachedCategories = categories.map((cat) => ({
    id: cat.id,
    label: cat.label,
    suiteId: getSuiteForCategory(cat.id),
    count: catCounts.get(cat.id) ?? 0,
    subcategories: cat.subcategories
      .map((sub) => ({
        id: sub.id,
        label: sub.label,
        count: subCounts.get(`${cat.id}:${sub.id}`) ?? 0,
      }))
      .filter((s) => s.count > 0),
  }));

  return _cachedCategories;
}

export function getSuiteCounts(): Record<SuiteId, number> {
  const counts: Record<SuiteId, number> = {
    wealth: 0,
    health: 0,
    engineering: 0,
    science: 0,
    business: 0,
    explore: 0,
  };

  for (const item of getCatalogSummaries()) {
    counts[item.suiteId] += 1;
  }

  return counts;
}

export function getCalculatorBySlug(slug: string): CalculatorSchema | undefined {
  return slugToSchema.get(slug);
}

export function getAllCalculatorSlugs(): string[] {
  return Array.from(slugToSchema.keys());
}

export function getFlagshipPrebuildSlugs(): string[] {
  const priority = new Set<string>([
    ...FEATURED_INSTRUMENT_SLUGS,
    ...CUSTOM_CALCULATOR_SLUGS,
  ]);
  for (const suite of SUITES) {
    for (const s of suite.featuredSlugs) priority.add(s);
  }
  return Array.from(priority).filter((s) => slugToSchema.has(s));
}

export function getRelatedCalculators(
  slug: string,
  limit = 4
): CalculatorSummary[] {
  const current = slugToSchema.get(slug);
  if (!current) return [];

  const summaries = getCatalogSummaries();
  const currentSuite = getSuiteForCategory(current.category);

  const scored = summaries
    .filter((c) => c.slug !== slug)
    .map((c) => {
      let score = 0;
      if (c.category === current.category) score += 4;
      if (current.subcategory && c.subcategory === current.subcategory) score += 5;
      if (c.suiteId === currentSuite) score += 2;
      if (c.isFeatured) score += 1;
      const sharedTags = c.tags.filter((t) => current.tags?.includes(t)).length;
      score += Math.min(sharedTags, 3);
      return { item: c, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.item);

  return scored;
}
