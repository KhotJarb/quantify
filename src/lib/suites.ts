// ============================================================================
// Quantify — Curated Suites, Currency Config & Lightweight Catalog Types
// ============================================================================
// Client-safe module: NEVER imports src/data/calculators.ts so client bundles
// stay lean and never pull 2.7 MB of calculator formulas and guides.
// ============================================================================

export type SuiteId =
  | 'wealth'
  | 'health'
  | 'engineering'
  | 'science'
  | 'business'
  | 'explore';

export interface SuiteDefinition {
  id: SuiteId;
  label: string;
  shortLabel: string;
  tagline: string;
  description: string;
  tier: 'flagship' | 'explore';
  categoryIds: string[];
  featuredSlugs: string[];
}

export interface CalculatorSummary {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  categoryLabel: string;
  subcategory?: string;
  suiteId: SuiteId;
  tags: string[];
  isCustom: boolean;
  isFeatured: boolean;
  inputCount: number;
  outputCount: number;
}

export interface CategorySummary {
  id: string;
  label: string;
  suiteId: SuiteId;
  count: number;
  subcategories: { id: string; label: string; count: number }[];
}

export interface CurrencyConfig {
  code: string;
  symbol: string;
  label: string;
}

export interface SavedScenario {
  id: string;
  name: string;
  slug: string;
  title: string;
  category: string;
  valuesA: Record<string, string>;
  unitsA: Record<string, string>;
  compareMode: boolean;
  valuesB?: Record<string, string>;
  unitsB?: Record<string, string>;
  primaryLabel: string;
  primaryValue: string;
  primaryValueB?: string;
  currencyCode: string;
  createdAt: string;
}

export interface EmbedCustomization {
  title?: string;
  accent?: string;
  theme?: 'auto' | 'light' | 'dark';
  showChart?: boolean;
  showMath?: boolean;
  showCompare?: boolean;
  ctaLabel?: string;
  ctaUrl?: string;
}

export const CURRENCIES: CurrencyConfig[] = [
  { code: 'USD', symbol: '$', label: 'USD ($)' },
  { code: 'EUR', symbol: '€', label: 'EUR (€)' },
  { code: 'GBP', symbol: '£', label: 'GBP (£)' },
  { code: 'THB', symbol: '฿', label: 'THB (฿)' },
  { code: 'JPY', symbol: '¥', label: 'JPY (¥)' },
  { code: 'SGD', symbol: 'S$', label: 'SGD (S$)' },
  { code: 'AUD', symbol: 'A$', label: 'AUD (A$)' },
  { code: 'CAD', symbol: 'C$', label: 'CAD (C$)' },
  { code: 'INR', symbol: '₹', label: 'INR (₹)' },
];

export const CUSTOM_CALCULATOR_SLUGS = new Set<string>([
  'base-calculator',
  'scientific-calculator',
  'gap-time-optimizer',
  'fifty-minutes-calculator',
  'progressive-overload',
  'advanced-calculator',
  'ldl-cholesterol-calculator',
]);

export const FEATURED_INSTRUMENT_SLUGS: string[] = [
  'ldl-cholesterol-calculator',
  'compound-interest',
  'loan-emi',
  'progressive-overload',
  'advanced-calculator',
  'fire-number-calculator',
  'solar-payback',
  'roi-calculator',
];

export const SUITES: SuiteDefinition[] = [
  {
    id: 'wealth',
    label: 'Wealth & Finance',
    shortLabel: 'Wealth',
    tagline: 'Mortgages, FIRE, investments, taxes & crypto',
    description:
      'High-precision financial modeling with arbitrary-precision decimal arithmetic—compare mortgage terms, retirement horizons, bond yields, and compounding scenarios.',
    tier: 'flagship',
    categoryIds: ['finance', 'crypto'],
    featuredSlugs: [
      'compound-interest',
      'loan-emi',
      'fire-number-calculator',
      'rent-vs-buy-calculator',
    ],
  },
  {
    id: 'health',
    label: 'Health & Clinical',
    shortLabel: 'Health',
    tagline: 'Biomarkers, clinical dosing, nutrition & strength',
    description:
      'Evidence-based clinical panels, lipid risk stratification (Friedewald + Sampson 2020), progressive overload programming, and metabolic baselines.',
    tier: 'flagship',
    categoryIds: ['health', 'medical'],
    featuredSlugs: [
      'ldl-cholesterol-calculator',
      'progressive-overload',
      'bmi-calculator',
    ],
  },
  {
    id: 'engineering',
    label: 'Engineering & Energy',
    shortLabel: 'Engineering',
    tagline: 'Electrical, structural, construction & solar ROI',
    description:
      'Field-ready engineering formulas covering circuits, mechanical loads, construction takeoff quantities, HVAC sizing, and solar payback periods.',
    tier: 'flagship',
    categoryIds: ['engineering', 'construction', 'energy'],
    featuredSlugs: ['solar-payback', 'ohms-law', 'battery-bank'],
  },
  {
    id: 'science',
    label: 'Science, Math & Tech',
    shortLabel: 'Science & Tech',
    tagline: 'Symbolic CAS, physics, statistics & cloud sizing',
    description:
      'Exact algebraic simplification, statistical inference, laboratory dilutions, and cloud/DevOps capacity calculators without floating-point drift.',
    tier: 'flagship',
    categoryIds: ['science', 'tech', 'math'],
    featuredSlugs: [
      'advanced-calculator',
      'cloud-cost-estimator',
      'pythagorean-theorem',
    ],
  },
  {
    id: 'business',
    label: 'Business & Operations',
    shortLabel: 'Business',
    tagline: 'Pricing margins, ROI, payroll & supply chain',
    description:
      'Operational unit economics, IRR/NPV investment appraisal, payroll allocation, freight volume, and hospitality yield estimators.',
    tier: 'flagship',
    categoryIds: ['business', 'hr', 'logistics', 'hospitality'],
    featuredSlugs: ['roi-calculator', 'irr-npv-calculator', 'apr-calculator'],
  },
  {
    id: 'explore',
    label: 'Explore Library',
    shortLabel: 'Explore',
    tagline: 'Aviation, photography, culinary, productivity & more',
    description:
      'Extended specialized tools spanning aviation, automotive, photography optics, culinary scaling, sports math, education, legal, and everyday utilities.',
    tier: 'explore',
    categoryIds: [
      'everyday',
      'aviation',
      'automotive',
      'photography',
      'sports',
      'culinary',
      'gaming',
      'special',
      'textile',
      'publishing',
      'education',
      'agriculture',
      'general',
      'legal',
      'conversion',
    ],
    featuredSlugs: [
      'base-calculator',
      'gap-time-optimizer',
      'fifty-minutes-calculator',
    ],
  },
];

export const FLAGSHIP_SUITES = SUITES.filter((s) => s.tier === 'flagship');

const CATEGORY_TO_SUITE = new Map<string, SuiteId>();
for (const suite of SUITES) {
  for (const catId of suite.categoryIds) {
    CATEGORY_TO_SUITE.set(catId, suite.id);
  }
}

export function getSuiteForCategory(categoryId: string): SuiteId {
  return CATEGORY_TO_SUITE.get(categoryId) ?? 'explore';
}

export function getSuiteById(suiteId: string | null | undefined): SuiteDefinition | undefined {
  if (!suiteId) return undefined;
  return SUITES.find((s) => s.id === suiteId);
}
