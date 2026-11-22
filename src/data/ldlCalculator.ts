import type { CalculatorSchema } from '@/types/calculator';

// ─────────────────────────────────────────────────────────────────────────────
// LDL Cholesterol Calculator — Comprehensive Lipid Panel Analysis
// Custom React component: LDLCalculatorEnhanced.tsx
// Live gauge · dual-formula (Friedewald & Sampson 2020) · full ratio suite · action plan
// ─────────────────────────────────────────────────────────────────────────────
export const ldlCalculators: CalculatorSchema[] = [
  {
    id: 'ldl-cholesterol-calculator',
    slug: 'ldl-cholesterol-calculator',
    title: 'LDL Cholesterol Calculator',
    description:
      'Analyze LDL cholesterol with a live visual gauge, dual-formula comparison (Friedewald & Sampson 2020), full atherogenic ratio dashboard, AIP, personalized target tracking, and a lifestyle action plan.',
    icon: '🩸',
    category: 'health',
    subcategory: 'cardiovascular',
    tags: [
      'LDL',
      'cholesterol',
      'HDL',
      'triglycerides',
      'lipid panel',
      'cardiovascular',
      'VLDL',
      'non-HDL',
      'heart disease',
      'Friedewald',
      'Sampson',
      'atherogenic',
      'AIP',
      'risk',
    ],
    inputs: [],
    formulas: [],
    outputs: [],
    metadata: { version: '2.0.0' },
  },
];
