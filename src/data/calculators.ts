// ---------------------------------------------------------------------------
// Quantify — Calculator Data (aggregated)
// ---------------------------------------------------------------------------

import type { CalculatorSchema, Category } from '@/types/calculator';
import { healthCalculatorsPart1 } from './healthCalculators_part1';
import { healthCalculatorsPart2 } from './healthCalculators_part2';
import { generalCalculators } from './generalCalculators';
import { loanCalculators } from './loanCalculators';
import { businessFinanceCalculators } from './businessFinanceCalculators';
import { bondCalculators } from './bondCalculators';
import { stockOptionsCalculators } from './stockOptionsCalculators';
import { personalFinanceCalculators } from './personalFinanceCalculators';
import { retirementCalculators } from './retirementCalculators';
// New calculator modules
import { healthFitnessNew } from './healthFitnessNew';
import { mathStatisticsCalculators } from './mathStatisticsCalculators';
import { physicsChemistryCalculators } from './physicsChemistryCalculators';
import { constructionCalculators } from './constructionCalculators';
import { techNetworkingCalculators } from './techNetworkingCalculators';
import { automotiveCalculators } from './automotiveCalculators';
import { ecommerceMarketingCalculators } from './ecommerceMarketingCalculators';
import { lifestyleCalculators } from './lifestyleCalculators';
// Batch expansion — 110 new calculators across 11 categories
import { photographyCalculators } from './photographyCalculators';
import { cryptoCalculators } from './cryptoCalculators';
import { agricultureCalculators } from './agricultureCalculators';
import { hrBusinessCalculators } from './hrBusinessCalculators';
import { logisticsCalculators } from './logisticsCalculators';
import { medicalCalculators } from './medicalCalculators';
import { gamingCalculators } from './gamingCalculators';
import { culinaryCalculators } from './culinaryCalculators';
import { textileCalculators } from './textileCalculators';
import { aviationCalculators } from './aviationCalculators';
import { energyCalculators } from './energyCalculators';

// ═══════════════════════════════════════════════════════════════════════════
// Categories
// ═══════════════════════════════════════════════════════════════════════════

export const categories: Category[] = [
  {
    id: 'general',
    label: 'General',
    icon: '🧮',
    subcategories: [
      { id: 'basic', label: 'Basic' },
      { id: 'percentage', label: 'Percentage & Ratio' },
      { id: 'date-time', label: 'Date & Time' },
    ],
  },
  {
    id: 'finance',
    label: 'Finance',
    icon: '💰',
    subcategories: [
      { id: 'loans-mortgages', label: 'Loans & Mortgages' },
      { id: 'credit-cards', label: 'Credit Cards' },
      { id: 'investments', label: 'Investments' },
      { id: 'business', label: 'Business & APR' },
      { id: 'retirement', label: 'Retirement & 401k' },
      { id: 'social-security', label: 'Social Security' },
      { id: 'bonds', label: 'Bonds' },
      { id: 'stocks', label: 'Stocks' },
      { id: 'dividends', label: 'Dividends' },
      { id: 'options', label: 'Options' },
      { id: 'savings', label: 'Savings & Deposits' },
      { id: 'personal', label: 'Personal Finance' },
      { id: 'taxes', label: 'Taxes' },
    ],
  },
  {
    id: 'health',
    label: 'Health & Fitness',
    icon: '🏥',
    subcategories: [
      { id: 'body-metrics', label: 'Body Metrics' },
      { id: 'nutrition', label: 'Nutrition' },
      { id: 'exercise', label: 'Exercise & Performance' },
      { id: 'supplementation', label: 'Supplementation' },
      { id: 'cardiovascular', label: 'Cardiovascular' },
      { id: 'clinical', label: 'Clinical' },
      { id: 'reproductive', label: 'Reproductive Health' },
      { id: 'fitness', label: 'Fitness & Training' },
    ],
  },
  {
    id: 'math',
    label: 'Math',
    icon: '📐',
    subcategories: [
      { id: 'algebra', label: 'Algebra' },
      { id: 'geometry', label: 'Geometry' },
      { id: 'statistics', label: 'Statistics' },
      { id: 'trigonometry', label: 'Trigonometry' },
      { id: 'number-theory', label: 'Number Theory' },
      { id: 'random', label: 'Random & Probability' },
    ],
  },
  {
    id: 'science',
    label: 'Science',
    icon: '🔬',
    subcategories: [
      { id: 'physics', label: 'Physics' },
      { id: 'chemistry', label: 'Chemistry' },
      { id: 'kinematics', label: 'Kinematics & Motion' },
      { id: 'thermodynamics', label: 'Thermodynamics' },
      { id: 'waves', label: 'Waves & Optics' },
      { id: 'astronomy', label: 'Astronomy' },
    ],
  },
  {
    id: 'engineering',
    label: 'Engineering',
    icon: '⚙️',
    subcategories: [
      { id: 'electrical', label: 'Electrical' },
      { id: 'mechanical', label: 'Mechanical' },
      { id: 'civil', label: 'Civil' },
      { id: 'chemical', label: 'Chemical' },
    ],
  },
  {
    id: 'construction',
    label: 'Construction & DIY',
    icon: '🏗️',
    subcategories: [
      { id: 'concrete', label: 'Concrete & Masonry' },
      { id: 'interior', label: 'Interior & Finishes' },
      { id: 'roofing', label: 'Roofing & Structure' },
      { id: 'lumber', label: 'Lumber & Materials' },
      { id: 'hvac', label: 'HVAC & Electrical' },
    ],
  },
  {
    id: 'business',
    label: 'Business & Marketing',
    icon: '📈',
    subcategories: [
      { id: 'pricing', label: 'Pricing & Margins' },
      { id: 'advertising', label: 'Advertising & ROI' },
      { id: 'ecommerce', label: 'E-commerce & Fees' },
      { id: 'metrics', label: 'Business Metrics' },
      { id: 'accounting', label: 'Accounting & Assets' },
    ],
  },
  {
    id: 'tech',
    label: 'Tech & IT',
    icon: '💻',
    subcategories: [
      { id: 'networking', label: 'Networking' },
      { id: 'storage', label: 'Storage & Data' },
      { id: 'security', label: 'Security' },
      { id: 'display', label: 'Display & Media' },
      { id: 'tools', label: 'Developer Tools' },
    ],
  },
  {
    id: 'everyday',
    label: 'Everyday',
    icon: '🏠',
    subcategories: [
      { id: 'cooking', label: 'Cooking' },
      { id: 'shopping', label: 'Shopping' },
      { id: 'travel', label: 'Travel' },
      { id: 'automotive', label: 'Automotive' },
      { id: 'time', label: 'Time & Dates' },
      { id: 'lifestyle', label: 'Lifestyle & Fashion' },
      { id: 'pets', label: 'Pets' },
      { id: 'utility', label: 'Utility' },
      { id: 'environmental', label: 'Environmental' },
    ],
  },
  {
    id: 'automotive',
    label: 'Automotive & Transport',
    icon: '🚗',
    subcategories: [
      { id: 'vehicle', label: 'Vehicle & Engine' },
      { id: 'fuel', label: 'Fuel & Efficiency' },
      { id: 'shipping', label: 'Shipping & Freight' },
      { id: 'travel-calc', label: 'Travel & Navigation' },
    ],
  },
  {
    id: 'conversion',
    label: 'Conversion',
    icon: '🔄',
    subcategories: [
      { id: 'length', label: 'Length' },
      { id: 'weight', label: 'Weight' },
      { id: 'temperature', label: 'Temperature' },
      { id: 'currency', label: 'Currency' },
    ],
  },
  {
    id: 'special',
    label: 'Special',
    icon: '✨',
    subcategories: [
      { id: 'productivity', label: 'Productivity' },
      { id: 'optimizer', label: 'Optimizers' },
    ],
  },
  {
    id: 'photography',
    label: 'Photography, Video & Audio',
    icon: '📷',
    subcategories: [
      { id: 'camera', label: 'Camera & Optics' },
      { id: 'video', label: 'Video & Time-lapse' },
      { id: 'audio', label: 'Audio & Sound' },
    ],
  },
  {
    id: 'crypto',
    label: 'Crypto & DeFi',
    icon: '🪙',
    subcategories: [
      { id: 'trading', label: 'Trading & Risk' },
      { id: 'defi', label: 'DeFi & Staking' },
      { id: 'mining', label: 'Mining & Fees' },
    ],
  },
  {
    id: 'agriculture',
    label: 'Agriculture & Farming',
    icon: '🌱',
    subcategories: [
      { id: 'crops', label: 'Crops & Planting' },
      { id: 'livestock', label: 'Livestock & Feed' },
      { id: 'irrigation', label: 'Irrigation & Soil' },
    ],
  },
  {
    id: 'hr',
    label: 'HR & Business Ops',
    icon: '🏢',
    subcategories: [
      { id: 'workforce', label: 'Workforce & Hiring' },
      { id: 'payroll', label: 'Payroll & Time' },
      { id: 'hr-productivity', label: 'Productivity' },
    ],
  },
  {
    id: 'logistics',
    label: 'Logistics & Supply Chain',
    icon: '📦',
    subcategories: [
      { id: 'inventory', label: 'Inventory & Stock' },
      { id: 'freight', label: 'Freight & Shipping' },
      { id: 'packaging', label: 'Packaging & Volume' },
    ],
  },
  {
    id: 'medical',
    label: 'Advanced Medical & Clinical',
    icon: '🩺',
    subcategories: [
      { id: 'dosing', label: 'Drug Dosing' },
      { id: 'vitals', label: 'Vitals & Scores' },
      { id: 'pediatrics', label: 'Pediatrics' },
    ],
  },
  {
    id: 'gaming',
    label: 'Gaming & Esports',
    icon: '🎮',
    subcategories: [
      { id: 'performance', label: 'Performance & Rank' },
      { id: 'streaming', label: 'Streaming & PC' },
      { id: 'rpg', label: 'RPG & Gacha' },
    ],
  },
  {
    id: 'culinary',
    label: 'Baking & Culinary',
    icon: '🍞',
    subcategories: [
      { id: 'baking', label: 'Baking & Pastry' },
      { id: 'brewing', label: 'Brewing & Drinks' },
      { id: 'scaling', label: 'Scaling & Costing' },
    ],
  },
  {
    id: 'textile',
    label: 'Textile & Crafting',
    icon: '🧵',
    subcategories: [
      { id: 'sewing', label: 'Sewing & Patterns' },
      { id: 'knitting', label: 'Knitting & Yarn' },
      { id: 'crafts', label: 'Crafts & Making' },
    ],
  },
  {
    id: 'aviation',
    label: 'Aviation & Marine',
    icon: '✈️',
    subcategories: [
      { id: 'flight', label: 'Flight Planning' },
      { id: 'marine', label: 'Marine & Boating' },
      { id: 'navigation', label: 'Navigation' },
    ],
  },
  {
    id: 'energy',
    label: 'Green Energy',
    icon: '☀️',
    subcategories: [
      { id: 'solar', label: 'Solar & Battery' },
      { id: 'power', label: 'Power & Efficiency' },
      { id: 'sustainability', label: 'Sustainability' },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// Calculator Schemas
// ═══════════════════════════════════════════════════════════════════════════

const _allCalculators: CalculatorSchema[] = [
  // -----------------------------------------------------------------------
  // 1. Compound Interest
  // -----------------------------------------------------------------------
  {
    id: 'compound-interest',
    slug: 'compound-interest',
    title: 'Compound Interest',
    description:
      'Calculate the future value of an investment with compound interest over time.',
    icon: '📈',
    category: 'finance',
    subcategory: 'investments',
    tags: ['interest', 'savings', 'investment', 'compound'],
    inputs: [
      {
        id: 'principal',
        label: 'Principal Amount ($)',
        type: 'number',
        min: 0,
        defaultValue: 1000,
        placeholder: 'e.g. 10000',
        required: true,
      },
      {
        id: 'annualRate',
        label: 'Annual Interest Rate (%)',
        type: 'number',
        min: 0,
        max: 100,
        step: 0.01,
        defaultValue: 5,
        placeholder: 'e.g. 5',
        required: true,
      },
      {
        id: 'compoundingFrequency',
        label: 'Compounding Frequency',
        type: 'select',
        options: [
          { label: 'Annually', value: '1' },
          { label: 'Semi-Annually', value: '2' },
          { label: 'Quarterly', value: '4' },
          { label: 'Monthly', value: '12' },
          { label: 'Daily', value: '365' },
        ],
        defaultValue: '12',
        required: true,
      },
      {
        id: 'years',
        label: 'Time Period (years)',
        type: 'number',
        min: 0,
        step: 1,
        defaultValue: 10,
        placeholder: 'e.g. 10',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'amount',
        expression:
          'principal * pow(1 + annualRate / 100 / compoundingFrequency, compoundingFrequency * years)',
        dependencies: ['principal', 'annualRate', 'compoundingFrequency', 'years'],
      },
      {
        id: 'interest',
        expression: 'amount - principal',
        dependencies: ['amount', 'principal'],
      },
    ],
    outputs: [
      {
        id: 'total-amount',
        label: 'Total Amount',
        formulaRef: 'amount',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
      {
        id: 'interest-earned',
        label: 'Interest Earned',
        formulaRef: 'interest',
        format: 'currency',
        precision: 2,
      },
    ],
    guide: {
      whatIsIt: 'Compound interest is interest calculated on both the initial principal and the accumulated interest from previous periods. Unlike simple interest, your money grows exponentially over time — often called "the eighth wonder of the world" by investors.',
      howToUse: 'Enter your initial deposit (principal), the annual interest rate, how often interest compounds (monthly is most common for savings accounts), and how many years you plan to invest. The calculator instantly shows your total balance and how much of it is pure interest.',
      exampleScenario: 'If you invest $10,000 at 5% annual interest compounded monthly for 10 years, your investment grows to $16,470.09 — earning $6,470.09 in interest without any additional deposits.',
      proTip: 'The more frequently interest compounds, the more you earn. Daily compounding at 5% yields an effective annual rate of 5.13%, compared to 5.09% for monthly. Over decades, this difference compounds into thousands of dollars.',
    },
    metadata: { version: '1.0.0' },
  },

  // -----------------------------------------------------------------------
  // 2. Loan EMI
  // -----------------------------------------------------------------------
  {
    id: 'loan-emi',
    slug: 'loan-emi',
    title: 'Loan EMI',
    description:
      'Calculate your Equated Monthly Instalment (EMI) for a loan or mortgage.',
    icon: '🏦',
    category: 'finance',
    subcategory: 'loans-mortgages',
    tags: ['loan', 'emi', 'mortgage', 'payment'],
    inputs: [
      {
        id: 'loanAmount',
        label: 'Loan Amount ($)',
        type: 'number',
        min: 0,
        defaultValue: 100000,
        placeholder: 'e.g. 250000',
        required: true,
      },
      {
        id: 'annualRate',
        label: 'Annual Interest Rate (%)',
        type: 'number',
        min: 0,
        max: 100,
        step: 0.01,
        defaultValue: 8,
        placeholder: 'e.g. 6.5',
        required: true,
      },
      {
        id: 'loanTenure',
        label: 'Loan Tenure (years)',
        type: 'number',
        min: 1,
        step: 1,
        defaultValue: 20,
        placeholder: 'e.g. 30',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'monthlyRate',
        expression: 'annualRate / 100 / 12',
        dependencies: ['annualRate'],
      },
      {
        id: 'months',
        expression: 'loanTenure * 12',
        dependencies: ['loanTenure'],
      },
      {
        id: 'emi',
        expression:
          'loanAmount * monthlyRate * pow(1 + monthlyRate, months) / (pow(1 + monthlyRate, months) - 1)',
        dependencies: ['loanAmount', 'monthlyRate', 'months'],
      },
      {
        id: 'totalPayment',
        expression: 'emi * months',
        dependencies: ['emi', 'months'],
      },
      {
        id: 'totalInterest',
        expression: 'totalPayment - loanAmount',
        dependencies: ['totalPayment', 'loanAmount'],
      },
    ],
    outputs: [
      {
        id: 'monthly-emi',
        label: 'Monthly EMI',
        formulaRef: 'emi',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
      {
        id: 'total-payment',
        label: 'Total Payment',
        formulaRef: 'totalPayment',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'total-interest',
        label: 'Total Interest',
        formulaRef: 'totalInterest',
        format: 'currency',
        precision: 2,
      },
    ],
    guide: {
      whatIsIt: 'An Equated Monthly Instalment (EMI) is the fixed amount you pay each month to repay a loan. It includes both principal repayment and interest, calculated using the standard annuity formula so each payment is identical throughout the loan term.',
      howToUse: 'Enter the total loan amount, the annual interest rate offered by your lender, and the loan duration in years. The calculator shows your fixed monthly payment, total amount paid over the loan life, and how much of that is interest.',
      exampleScenario: 'A $250,000 mortgage at 6.5% annual interest over 30 years results in a monthly EMI of approximately $1,580. Over 30 years, you pay around $569,000 total, meaning roughly $319,000 goes to interest.',
      proTip: 'Even a small rate reduction makes a big difference. Dropping from 7% to 6.5% on a $250,000 30-year mortgage saves over $60 per month. Always negotiate your rate and consider refinancing when rates drop.',
    },
    metadata: { version: '1.0.0' },
  },

  // -----------------------------------------------------------------------
  // 3. BMI Calculator
  // -----------------------------------------------------------------------
  {
    id: 'bmi-calculator',
    slug: 'bmi-calculator',
    title: 'BMI Calculator',
    description:
      'Calculate your Body Mass Index (BMI) to assess if your weight is healthy for your height.',
    icon: '⚖️',
    category: 'health',
    subcategory: 'body-metrics',
    tags: ['bmi', 'body', 'mass', 'index', 'weight', 'health'],
    inputs: [
      {
        id: 'weight',
        label: 'Weight',
        type: 'number',
        min: 1,
        step: 0.1,
        defaultValue: 70,
        placeholder: 'e.g. 70',
        required: true,
        units: [
          { label: 'kg', value: 'kg', conversionFactor: '1' },
          { label: 'lb', value: 'lb', conversionFactor: '0.453592' },
        ],
      },
      {
        id: 'height',
        label: 'Height',
        type: 'number',
        min: 1,
        step: 0.1,
        defaultValue: 175,
        placeholder: 'e.g. 175',
        required: true,
        units: [
          { label: 'cm', value: 'cm', conversionFactor: '1' },
          { label: 'in', value: 'in', conversionFactor: '2.54' },
          { label: 'ft', value: 'ft', conversionFactor: '30.48' },
        ],
      },
    ],
    formulas: [
      {
        id: 'heightM',
        expression: 'height / 100',
        dependencies: ['height'],
      },
      {
        id: 'bmi',
        expression: 'weight / pow(heightM, 2)',
        dependencies: ['weight', 'heightM'],
      },
    ],
    outputs: [
      {
        id: 'bmi-value',
        label: 'BMI',
        formulaRef: 'bmi',
        format: 'number',
        precision: 1,
        highlight: true,
      },
    ],
    guide: {
      whatIsIt: 'Body Mass Index (BMI) is a simple screening metric that relates your weight to your height. It is calculated as weight (kg) divided by height (m) squared. While not a direct measure of body fat, it is widely used by healthcare providers as a quick assessment tool.',
      howToUse: 'Enter your weight and height using your preferred units (the calculator converts automatically). Your BMI is categorized as: Underweight (< 18.5), Normal (18.5-24.9), Overweight (25-29.9), or Obese (>= 30).',
      exampleScenario: 'A person weighing 70 kg at 175 cm tall has a BMI of 22.9, which falls in the Normal range. If they gained 15 kg, their BMI would rise to 27.8, entering the Overweight category.',
      proTip: 'BMI does not distinguish between muscle and fat mass. Athletes with high muscle mass may have an Overweight BMI despite low body fat. Combine BMI with waist circumference or body fat percentage for a more complete picture.',
    },
    metadata: { version: '1.0.0' },
  },

  // -----------------------------------------------------------------------
  // 4. Ohm's Law
  // -----------------------------------------------------------------------
  {
    id: 'ohms-law',
    slug: 'ohms-law',
    title: "Ohm's Law",
    description:
      "Calculate resistance and power from voltage and current using Ohm's Law.",
    icon: '⚡',
    category: 'engineering',
    subcategory: 'electrical',
    tags: ['ohm', 'voltage', 'current', 'resistance', 'electrical'],
    inputs: [
      {
        id: 'voltage',
        label: 'Voltage (V)',
        type: 'number',
        min: 0,
        step: 0.01,
        defaultValue: 12,
        placeholder: 'e.g. 12',
        required: true,
      },
      {
        id: 'current',
        label: 'Current (A)',
        type: 'number',
        min: 0,
        step: 0.001,
        defaultValue: 2,
        placeholder: 'e.g. 2',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'resistance',
        expression: 'voltage / current',
        dependencies: ['voltage', 'current'],
      },
      {
        id: 'power',
        expression: 'voltage * current',
        dependencies: ['voltage', 'current'],
      },
    ],
    outputs: [
      {
        id: 'resistance-value',
        label: 'Resistance',
        formulaRef: 'resistance',
        format: 'number',
        suffix: ' Ω',
        highlight: true,
      },
      {
        id: 'power-value',
        label: 'Power',
        formulaRef: 'power',
        format: 'number',
        suffix: ' W',
      },
    ],
    guide: {
      whatIsIt: 'Ohm\'s Law is the fundamental relationship in electrical circuits: V = I x R, where V is voltage (volts), I is current (amperes), and R is resistance (ohms). Power (watts) is calculated as P = V x I.',
      howToUse: 'Enter the voltage across a component and the current flowing through it. The calculator determines the resistance and the power dissipated. This is essential for selecting correct resistors, fuses, and wire gauges.',
      exampleScenario: 'A 12V car battery powering a 2A headlight bulb: the bulb has 6 ohm resistance and dissipates 24W of power. To determine wire gauge, you need to know the current draw.',
      proTip: 'When designing circuits, always calculate power dissipation to prevent overheating. A resistor rated for 0.25W carrying 0.5W of power will overheat. Always use components rated for at least 2x the expected power.',
    },
    metadata: { version: '1.0.0' },
  },

  // -----------------------------------------------------------------------
  // 5. Pythagorean Theorem
  // -----------------------------------------------------------------------
  {
    id: 'pythagorean-theorem',
    slug: 'pythagorean-theorem',
    title: 'Pythagorean Theorem',
    description:
      'Find the hypotenuse of a right triangle given the two shorter sides.',
    icon: '📐',
    category: 'math',
    subcategory: 'geometry',
    tags: ['pythagorean', 'triangle', 'hypotenuse', 'geometry'],
    inputs: [
      {
        id: 'sideA',
        label: 'Side A',
        type: 'number',
        min: 0,
        step: 0.01,
        defaultValue: 3,
        placeholder: 'e.g. 3',
        required: true,
      },
      {
        id: 'sideB',
        label: 'Side B',
        type: 'number',
        min: 0,
        step: 0.01,
        defaultValue: 4,
        placeholder: 'e.g. 4',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'hypotenuse',
        expression: 'sqrt(pow(sideA, 2) + pow(sideB, 2))',
        dependencies: ['sideA', 'sideB'],
      },
    ],
    outputs: [
      {
        id: 'hypotenuse-value',
        label: 'Hypotenuse',
        formulaRef: 'hypotenuse',
        format: 'number',
        precision: 4,
        highlight: true,
      },
    ],
    guide: {
      whatIsIt: 'The Pythagorean Theorem states that in a right triangle, the square of the hypotenuse equals the sum of the squares of the other two sides (a squared + b squared = c squared). It is fundamental in construction, navigation, and physics.',
      howToUse: 'Enter the lengths of the two shorter sides (legs) of a right triangle. The calculator computes the hypotenuse, the longest side opposite the right angle.',
      exampleScenario: 'Building a deck? If one side is 3 meters and the other is 4 meters, the diagonal brace needs to be exactly 5 meters. The classic 3-4-5 triangle is a carpenter\'s best friend for checking if corners are square.',
      proTip: 'The theorem works in reverse too: if you know the hypotenuse and one side, the missing side is sqrt(c squared - a squared). Pythagorean triples like 3-4-5, 5-12-13, and 8-15-17 always yield whole numbers.',
    },
    metadata: { version: '1.0.0' },
  },

  // -----------------------------------------------------------------------
  // 7. Calorie Calculator (BMR — Mifflin-St Jeor)
  // -----------------------------------------------------------------------
  {
    id: 'calorie-calculator',
    slug: 'calorie-calculator',
    title: 'Calorie Calculator',
    description:
      'Estimate your Basal Metabolic Rate (BMR) and daily caloric needs using the Mifflin-St Jeor equation.',
    icon: '🔥',
    category: 'health',
    subcategory: 'nutrition',
    tags: ['calorie', 'bmr', 'metabolism', 'nutrition', 'diet'],
    inputs: [
      {
        id: 'weight',
        label: 'Weight (kg)',
        type: 'number',
        min: 1,
        step: 0.1,
        defaultValue: 70,
        placeholder: 'e.g. 70',
        required: true,
      },
      {
        id: 'height',
        label: 'Height (cm)',
        type: 'number',
        min: 1,
        step: 0.1,
        defaultValue: 175,
        placeholder: 'e.g. 175',
        required: true,
      },
      {
        id: 'age',
        label: 'Age (years)',
        type: 'number',
        min: 1,
        max: 120,
        step: 1,
        defaultValue: 25,
        placeholder: 'e.g. 25',
        required: true,
      },
      {
        id: 'activityLevel',
        label: 'Activity Level',
        type: 'select',
        options: [
          { label: 'Sedentary (little or no exercise)', value: '1.2' },
          { label: 'Lightly Active (1–3 days/week)', value: '1.375' },
          { label: 'Moderately Active (3–5 days/week)', value: '1.55' },
          { label: 'Active (6–7 days/week)', value: '1.725' },
          { label: 'Very Active (hard exercise daily)', value: '1.9' },
        ],
        defaultValue: '1.55',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'bmr',
        expression: '10 * weight + 6.25 * height - 5 * age + 5',
        dependencies: ['weight', 'height', 'age'],
      },
      {
        id: 'dailyCalories',
        expression: 'bmr * activityLevel',
        dependencies: ['bmr', 'activityLevel'],
      },
    ],
    outputs: [
      {
        id: 'bmr-value',
        label: 'BMR',
        formulaRef: 'bmr',
        format: 'number',
        suffix: ' kcal',
      },
      {
        id: 'daily-calories',
        label: 'Daily Calories',
        formulaRef: 'dailyCalories',
        format: 'number',
        suffix: ' kcal',
        highlight: true,
      },
    ],
    guide: {
      whatIsIt: 'The Mifflin-St Jeor equation estimates your Basal Metabolic Rate (BMR) — the calories your body burns at rest. Multiply by an activity factor to get your Total Daily Energy Expenditure (TDEE), the calories you actually need each day.',
      howToUse: 'Enter your weight, height, and age. Select your typical activity level honestly. The calculator shows both your base BMR and adjusted daily calorie needs for weight maintenance.',
      exampleScenario: 'A 30-year-old male weighing 75 kg at 178 cm with moderate activity: BMR is about 1,698 kcal, TDEE is about 2,632 kcal. To lose 0.5 kg per week, target around 2,130 kcal/day (a 500 kcal deficit).',
      proTip: 'The Mifflin-St Jeor equation (1990) is more accurate than the older Harris-Benedict equation. However, it assumes average body composition — highly muscular individuals may have a BMR 10-15% higher than predicted.',
    },
    metadata: { version: '1.0.0' },
  },

  // -----------------------------------------------------------------------
  // 8. Temperature Converter
  // -----------------------------------------------------------------------
  {
    id: 'temperature-converter',
    slug: 'temperature-converter',
    title: 'Temperature Converter',
    description:
      'Convert a temperature in Celsius to Fahrenheit and Kelvin instantly.',
    icon: '🌡️',
    category: 'conversion',
    subcategory: 'temperature',
    tags: ['temperature', 'celsius', 'fahrenheit', 'kelvin', 'convert'],
    inputs: [
      {
        id: 'celsius',
        label: 'Celsius (°C)',
        type: 'number',
        step: 0.1,
        defaultValue: 0,
        placeholder: 'e.g. 100',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'fahrenheit',
        expression: 'celsius * 9 / 5 + 32',
        dependencies: ['celsius'],
      },
      {
        id: 'kelvin',
        expression: 'celsius + 273.15',
        dependencies: ['celsius'],
      },
    ],
    outputs: [
      {
        id: 'fahrenheit-value',
        label: 'Fahrenheit',
        formulaRef: 'fahrenheit',
        format: 'number',
        precision: 2,
        suffix: ' °F',
      },
      {
        id: 'kelvin-value',
        label: 'Kelvin',
        formulaRef: 'kelvin',
        format: 'number',
        precision: 2,
        suffix: ' K',
      },
    ],
    guide: {
      whatIsIt: 'Temperature conversion translates between Celsius (worldwide standard), Fahrenheit (used in the US), and Kelvin (SI unit for physics where 0 K is absolute zero). The formulas are F = C x 9/5 + 32 and K = C + 273.15.',
      howToUse: 'Enter a temperature in Celsius. The calculator instantly shows the equivalent in both Fahrenheit and Kelvin. Water freezes at 0 degrees C (32 F, 273.15 K) and boils at 100 degrees C (212 F, 373.15 K).',
      exampleScenario: 'Traveling to Europe and the forecast says 22 degrees C? That converts to 71.6 degrees F, a pleasant spring day. In science, room temperature of 25 degrees C equals 298.15 K.',
      proTip: 'Quick mental conversion from C to F: double the Celsius value, subtract 10%, then add 32. Example: 30 C -> 60 -> 54 -> 86 F (actual: 86 F). For F to C: subtract 32, then divide by 1.8.',
    },
    metadata: { version: '1.0.0' },
  },
  // ═══════════════════════════════════════════════════════════════════════════
  // Health, Wellness & Biology (22 calculators)
  // ═══════════════════════════════════════════════════════════════════════════
  ...healthCalculatorsPart1,
  ...healthCalculatorsPart2,

  // ═══════════════════════════════════════════════════════════════════════════
  // General (13 calculators)
  // ═══════════════════════════════════════════════════════════════════════════
  ...generalCalculators,

  // ═══════════════════════════════════════════════════════════════════════════
  // Loans, Credit & Mortgage (5 calculators)
  // ═══════════════════════════════════════════════════════════════════════════
  ...loanCalculators,

  // ═══════════════════════════════════════════════════════════════════════════
  // Business & Finance (7 calculators)
  // ═══════════════════════════════════════════════════════════════════════════
  ...businessFinanceCalculators,

  // ═══════════════════════════════════════════════════════════════════════════
  // Bonds (6 calculators)
  // ═══════════════════════════════════════════════════════════════════════════
  ...bondCalculators,

  // ═══════════════════════════════════════════════════════════════════════════
  // Stocks & Options (15 calculators)
  // ═══════════════════════════════════════════════════════════════════════════
  ...stockOptionsCalculators,

  // ═══════════════════════════════════════════════════════════════════════════
  // Personal Finance & Savings (17 calculators)
  // ═══════════════════════════════════════════════════════════════════════════
  ...personalFinanceCalculators,

  // ═══════════════════════════════════════════════════════════════════════════
  // Retirement, 401k & Social Security (17 calculators)
  // ═══════════════════════════════════════════════════════════════════════════
  ...retirementCalculators,

  // ═══════════════════════════════════════════════════════════════════════════
  // Health & Fitness — New (8 calculators)
  // ═══════════════════════════════════════════════════════════════════════════
  ...healthFitnessNew,

  // ═══════════════════════════════════════════════════════════════════════════
  // Math & Statistics (14 calculators)
  // ═══════════════════════════════════════════════════════════════════════════
  ...mathStatisticsCalculators,

  // ═══════════════════════════════════════════════════════════════════════════
  // Physics & Chemistry (11 calculators)
  // ═══════════════════════════════════════════════════════════════════════════
  ...physicsChemistryCalculators,

  // ═══════════════════════════════════════════════════════════════════════════
  // Construction & DIY (12 calculators)
  // ═══════════════════════════════════════════════════════════════════════════
  ...constructionCalculators,

  // ═══════════════════════════════════════════════════════════════════════════
  // Tech & IT / Networking (12 calculators)
  // ═══════════════════════════════════════════════════════════════════════════
  ...techNetworkingCalculators,

  // ═══════════════════════════════════════════════════════════════════════════
  // Automotive & Transport (9 calculators)
  // ═══════════════════════════════════════════════════════════════════════════
  ...automotiveCalculators,

  // ═══════════════════════════════════════════════════════════════════════════
  // E-commerce, Marketing & Business (13 calculators)
  // ═══════════════════════════════════════════════════════════════════════════
  ...ecommerceMarketingCalculators,

  // ═══════════════════════════════════════════════════════════════════════════
  // Everyday Lifestyle & Utility (16 calculators)
  // ═══════════════════════════════════════════════════════════════════════════
  ...lifestyleCalculators,

  // ═══════════════════════════════════════════════════════════════════════════
  // Special — World-first productivity calculators
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'gap-time-optimizer',
    slug: 'gap-time-optimizer',
    title: 'Gap Time Optimizer',
    description:
      'Input all your activities for any time period and let the optimizer create your perfect schedule. Uses energy-matching, priority scoring, and break science to maximize every minute.',
    icon: '⚡',
    category: 'special',
    subcategory: 'optimizer',
    tags: [
      'schedule', 'optimizer', 'productivity', 'time management', 'planner',
      'daily planner', 'gap time', 'task scheduler', 'efficiency', 'time blocking',
    ],
    inputs: [],
    formulas: [],
    outputs: [],
    guide: {
      whatIsIt:
        'The Gap Time Optimizer is a first-of-its-kind scheduling engine. You tell it your time window, add all your tasks with priority, energy requirements, and type, then it produces a scientifically optimized schedule that maximizes your productive output while respecting your cognitive energy curve and ensuring proper breaks.',
      howToUse:
        '1. Set your available time window (e.g. 8:00 AM – 6:00 PM).\n2. Add activities — give each a name, duration, priority, type, and energy level.\n3. Mark any fixed commitments (meetings, calls) with their locked start time.\n4. Click "Optimize My Day" to generate your optimal schedule.\n5. Review the timeline, stats, and ordered schedule.',
      exampleScenario:
        'You have 10 hours from 8 AM to 6 PM. You add: a fixed 9:00 AM standup (15 min), a high-priority code sprint (90 min), RFC writing (60 min), email (20 min), a fixed lunch (60 min), design review at 2 PM (30 min), and documentation (30 min). The optimizer places the code sprint first (morning peak energy), RFC after standup, email during post-lunch dip, and injects four 5-minute breaks for sustainability. Final score: 91/100.',
      proTip:
        'Mark truly immovable items as "Fixed" — the optimizer works best when it has freedom to arrange flexible tasks around your locked commitments. The fewer fixed items, the higher your optimization score.',
    },
    metadata: { version: '1.0.0' },
  },
  {
    id: 'fifty-minutes-calculator',
    slug: 'fifty-minutes-calculator',
    title: '50 Minutes Calculator',
    description:
      'The ultimate micro-schedule builder. Choose a mission type, customize your phases, and get a science-backed plan to extract maximum value from every minute of your session.',
    icon: '🎯',
    category: 'special',
    subcategory: 'productivity',
    tags: [
      '50 minutes', 'pomodoro', 'deep work', 'focus', 'productivity',
      'time management', 'study', 'flow state', 'session planner', 'micro-schedule',
    ],
    inputs: [],
    formulas: [],
    outputs: [],
    guide: {
      whatIsIt:
        'The 50 Minutes Calculator is a precision time-block designer based on cognitive science. Research shows 50 minutes is the sweet spot for focused work — matching university lecture lengths, extended Pomodoro cycles, and ultradian rhythm sub-cycles. Select a mission type, adjust intensity, and get a phased breakdown with specific instructions for each segment.',
      howToUse:
        '1. Choose your mission type (Study, Code, Create, Workout, Write, or Meeting Prep).\n2. Set your intensity level (Light, Moderate, or Intense).\n3. Review the auto-generated phase plan visualized as a circular ring.\n4. Customize any phase — rename, resize, reorder, add, or remove.\n5. Follow the phase-by-phase instructions for maximum output.',
      exampleScenario:
        'You select "Code" at Moderate intensity. The calculator generates: 3 min Planning (read ticket, sketch approach), 22 min Implementation (deep focus coding), 5 min Testing (run tests, fix bugs), 15 min Refactoring (clean up, edge cases), 5 min Documentation (commit message, update docs). Each phase includes what to do, why it matters scientifically, and a pro tip.',
      proTip:
        'The presets are starting points — customize the phases to match your workflow. Some people thrive with longer deep-focus blocks; others need more frequent micro-transitions. The total time adjusts automatically as you resize phases.',
    },
    metadata: { version: '1.0.0' },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // Photography, Video & Audio (10 calculators)
  // ═══════════════════════════════════════════════════════════════════════════
  ...photographyCalculators,

  // ═══════════════════════════════════════════════════════════════════════════
  // Cryptocurrency & DeFi (10 calculators)
  // ═══════════════════════════════════════════════════════════════════════════
  ...cryptoCalculators,

  // ═══════════════════════════════════════════════════════════════════════════
  // Agriculture & Farming (10 calculators)
  // ═══════════════════════════════════════════════════════════════════════════
  ...agricultureCalculators,

  // ═══════════════════════════════════════════════════════════════════════════
  // HR & Business Ops (10 calculators)
  // ═══════════════════════════════════════════════════════════════════════════
  ...hrBusinessCalculators,

  // ═══════════════════════════════════════════════════════════════════════════
  // Logistics & Supply Chain (9 calculators)
  // ═══════════════════════════════════════════════════════════════════════════
  ...logisticsCalculators,

  // ═══════════════════════════════════════════════════════════════════════════
  // Advanced Medical & Clinical (10 calculators)
  // ═══════════════════════════════════════════════════════════════════════════
  ...medicalCalculators,

  // ═══════════════════════════════════════════════════════════════════════════
  // Gaming & Esports (10 calculators)
  // ═══════════════════════════════════════════════════════════════════════════
  ...gamingCalculators,

  // ═══════════════════════════════════════════════════════════════════════════
  // Culinary & Crafts (10 calculators)
  // ═══════════════════════════════════════════════════════════════════════════
  ...culinaryCalculators,

  // ═══════════════════════════════════════════════════════════════════════════
  // Textile, Crafts & Making (10 calculators)
  // ═══════════════════════════════════════════════════════════════════════════
  ...textileCalculators,

  // ═══════════════════════════════════════════════════════════════════════════
  // Aviation, Navigation & Marine (10 calculators)
  // ═══════════════════════════════════════════════════════════════════════════
  ...aviationCalculators,

  // ═══════════════════════════════════════════════════════════════════════════
  // Green Energy & Sustainability (10 calculators)
  // ═══════════════════════════════════════════════════════════════════════════
  ...energyCalculators,
];

// ---------------------------------------------------------------------------
// Deduplicate — keep first occurrence of each calculator id (safety net)
// ---------------------------------------------------------------------------
const seen = new Set<string>();
export const calculators: CalculatorSchema[] = _allCalculators.filter((c) => {
  if (seen.has(c.id)) return false;
  seen.add(c.id);
  return true;
});


