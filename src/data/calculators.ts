// ---------------------------------------------------------------------------
// Quantify — Sample Calculator Data
// ---------------------------------------------------------------------------

import type { CalculatorSchema, Category } from '@/types/calculator';

// ═══════════════════════════════════════════════════════════════════════════
// Categories
// ═══════════════════════════════════════════════════════════════════════════

export const categories: Category[] = [
  {
    id: 'finance',
    name: 'Finance',
    icon: '💰',
    subcategories: [
      { id: 'loans-mortgages', name: 'Loans & Mortgages' },
      { id: 'investments', name: 'Investments' },
      { id: 'taxes', name: 'Taxes' },
      { id: 'business', name: 'Business' },
    ],
  },
  {
    id: 'engineering',
    name: 'Engineering',
    icon: '⚙️',
    subcategories: [
      { id: 'electrical', name: 'Electrical' },
      { id: 'mechanical', name: 'Mechanical' },
      { id: 'civil', name: 'Civil' },
      { id: 'chemical', name: 'Chemical' },
    ],
  },
  {
    id: 'health',
    name: 'Health & Fitness',
    icon: '🏥',
    subcategories: [
      { id: 'body-metrics', name: 'Body Metrics' },
      { id: 'nutrition', name: 'Nutrition' },
      { id: 'exercise', name: 'Exercise' },
    ],
  },
  {
    id: 'science',
    name: 'Science',
    icon: '🔬',
    subcategories: [
      { id: 'physics', name: 'Physics' },
      { id: 'chemistry', name: 'Chemistry' },
      { id: 'astronomy', name: 'Astronomy' },
    ],
  },
  {
    id: 'everyday',
    name: 'Everyday',
    icon: '🏠',
    subcategories: [
      { id: 'cooking', name: 'Cooking' },
      { id: 'shopping', name: 'Shopping' },
      { id: 'travel', name: 'Travel' },
      { id: 'time', name: 'Time' },
    ],
  },
  {
    id: 'math',
    name: 'Math',
    icon: '📐',
    subcategories: [
      { id: 'algebra', name: 'Algebra' },
      { id: 'geometry', name: 'Geometry' },
      { id: 'statistics', name: 'Statistics' },
    ],
  },
  {
    id: 'conversion',
    name: 'Conversion',
    icon: '🔄',
    subcategories: [
      { id: 'length', name: 'Length' },
      { id: 'weight', name: 'Weight' },
      { id: 'temperature', name: 'Temperature' },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// Calculator Schemas
// ═══════════════════════════════════════════════════════════════════════════

export const calculators: CalculatorSchema[] = [
  // -----------------------------------------------------------------------
  // 1. Compound Interest
  // -----------------------------------------------------------------------
  {
    id: 'compound-interest',
    slug: 'compound-interest',
    name: 'Compound Interest',
    description:
      'Calculate the future value of an investment with compound interest over time.',
    icon: '📈',
    category: 'finance',
    subcategory: 'investments',
    tags: ['interest', 'savings', 'investment', 'compound'],
    inputs: [
      {
        id: 'principal',
        label: 'Principal Amount',
        type: 'number',
        min: 0,
        defaultValue: 1000,
        prefix: '$',
        required: true,
      },
      {
        id: 'annualRate',
        label: 'Annual Interest Rate',
        type: 'number',
        min: 0,
        max: 100,
        step: 0.01,
        defaultValue: 5,
        suffix: '%',
        required: true,
      },
      {
        id: 'compoundingFrequency',
        label: 'Compounding Frequency',
        type: 'select',
        options: [
          { label: 'Annually', value: 1 },
          { label: 'Semi-Annually', value: 2 },
          { label: 'Quarterly', value: 4 },
          { label: 'Monthly', value: 12 },
          { label: 'Daily', value: 365 },
        ],
        defaultValue: 12,
        required: true,
      },
      {
        id: 'years',
        label: 'Time Period',
        type: 'number',
        min: 0,
        step: 1,
        defaultValue: 10,
        suffix: ' years',
        required: true,
      },
    ],
    formulas: [
      {
        variable: 'amount',
        expression:
          'principal * pow(1 + annualRate / 100 / compoundingFrequency, compoundingFrequency * years)',
      },
      {
        variable: 'interest',
        expression: 'amount - principal',
      },
    ],
    outputs: [
      {
        id: 'total-amount',
        label: 'Total Amount',
        formula: 'amount',
        format: { type: 'currency', highlight: true },
      },
      {
        id: 'interest-earned',
        label: 'Interest Earned',
        formula: 'interest',
        format: { type: 'currency' },
      },
    ],
    metadata: { version: '1.0.0' },
  },

  // -----------------------------------------------------------------------
  // 2. Loan EMI
  // -----------------------------------------------------------------------
  {
    id: 'loan-emi',
    slug: 'loan-emi',
    name: 'Loan EMI',
    description:
      'Calculate your Equated Monthly Instalment (EMI) for a loan or mortgage.',
    icon: '🏦',
    category: 'finance',
    subcategory: 'loans-mortgages',
    tags: ['loan', 'emi', 'mortgage', 'payment'],
    inputs: [
      {
        id: 'loanAmount',
        label: 'Loan Amount',
        type: 'number',
        min: 0,
        defaultValue: 100000,
        prefix: '$',
        required: true,
      },
      {
        id: 'annualRate',
        label: 'Annual Interest Rate',
        type: 'number',
        min: 0,
        max: 100,
        step: 0.01,
        defaultValue: 8,
        suffix: '%',
        required: true,
      },
      {
        id: 'loanTenure',
        label: 'Loan Tenure',
        type: 'number',
        min: 1,
        step: 1,
        defaultValue: 20,
        suffix: ' years',
        required: true,
      },
    ],
    formulas: [
      {
        variable: 'monthlyRate',
        expression: 'annualRate / 100 / 12',
      },
      {
        variable: 'months',
        expression: 'loanTenure * 12',
      },
      {
        variable: 'emi',
        expression:
          'loanAmount * monthlyRate * pow(1 + monthlyRate, months) / (pow(1 + monthlyRate, months) - 1)',
      },
      {
        variable: 'totalPayment',
        expression: 'emi * months',
      },
      {
        variable: 'totalInterest',
        expression: 'totalPayment - loanAmount',
      },
    ],
    outputs: [
      {
        id: 'monthly-emi',
        label: 'Monthly EMI',
        formula: 'emi',
        format: { type: 'currency', highlight: true },
      },
      {
        id: 'total-payment',
        label: 'Total Payment',
        formula: 'totalPayment',
        format: { type: 'currency' },
      },
      {
        id: 'total-interest',
        label: 'Total Interest',
        formula: 'totalInterest',
        format: { type: 'currency' },
      },
    ],
    metadata: { version: '1.0.0' },
  },

  // -----------------------------------------------------------------------
  // 3. BMI Calculator
  // -----------------------------------------------------------------------
  {
    id: 'bmi-calculator',
    slug: 'bmi-calculator',
    name: 'BMI Calculator',
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
        required: true,
        units: [
          { label: 'kg', value: 'kg', conversionFactor: 1 },
          { label: 'lb', value: 'lb', conversionFactor: 0.453592 },
        ],
      },
      {
        id: 'height',
        label: 'Height',
        type: 'number',
        min: 1,
        step: 0.1,
        defaultValue: 175,
        required: true,
        units: [
          { label: 'cm', value: 'cm', conversionFactor: 1 },
          { label: 'in', value: 'in', conversionFactor: 2.54 },
          { label: 'ft', value: 'ft', conversionFactor: 30.48 },
        ],
      },
    ],
    formulas: [
      {
        variable: 'heightM',
        expression: 'height / 100',
      },
      {
        variable: 'bmi',
        expression: 'weight / pow(heightM, 2)',
      },
    ],
    outputs: [
      {
        id: 'bmi-value',
        label: 'BMI',
        formula: 'bmi',
        format: { type: 'number', precision: 1, highlight: true },
      },
    ],
    metadata: { version: '1.0.0' },
  },

  // -----------------------------------------------------------------------
  // 4. Ohm's Law
  // -----------------------------------------------------------------------
  {
    id: 'ohms-law',
    slug: 'ohms-law',
    name: "Ohm's Law",
    description:
      "Calculate resistance and power from voltage and current using Ohm's Law.",
    icon: '⚡',
    category: 'engineering',
    subcategory: 'electrical',
    tags: ['ohm', 'voltage', 'current', 'resistance', 'electrical'],
    inputs: [
      {
        id: 'voltage',
        label: 'Voltage',
        type: 'number',
        min: 0,
        step: 0.01,
        defaultValue: 12,
        suffix: ' V',
        required: true,
      },
      {
        id: 'current',
        label: 'Current',
        type: 'number',
        min: 0,
        step: 0.001,
        defaultValue: 2,
        suffix: ' A',
        required: true,
      },
    ],
    formulas: [
      {
        variable: 'resistance',
        expression: 'voltage / current',
      },
      {
        variable: 'power',
        expression: 'voltage * current',
      },
    ],
    outputs: [
      {
        id: 'resistance-value',
        label: 'Resistance',
        formula: 'resistance',
        format: { type: 'number', suffix: ' Ω', highlight: true },
      },
      {
        id: 'power-value',
        label: 'Power',
        formula: 'power',
        format: { type: 'number', suffix: ' W' },
      },
    ],
    metadata: { version: '1.0.0' },
  },

  // -----------------------------------------------------------------------
  // 5. Tip Calculator
  // -----------------------------------------------------------------------
  {
    id: 'tip-calculator',
    slug: 'tip-calculator',
    name: 'Tip Calculator',
    description:
      'Quickly figure out how much to tip and split the bill between people.',
    icon: '🧾',
    category: 'everyday',
    subcategory: 'shopping',
    tags: ['tip', 'restaurant', 'bill', 'gratuity'],
    inputs: [
      {
        id: 'billAmount',
        label: 'Bill Amount',
        type: 'number',
        min: 0,
        step: 0.01,
        defaultValue: 50,
        prefix: '$',
        required: true,
      },
      {
        id: 'tipPercentage',
        label: 'Tip Percentage',
        type: 'range',
        min: 0,
        max: 50,
        step: 1,
        defaultValue: 15,
        suffix: '%',
      },
      {
        id: 'numberOfPeople',
        label: 'Number of People',
        type: 'number',
        min: 1,
        step: 1,
        defaultValue: 1,
        required: true,
      },
    ],
    formulas: [
      {
        variable: 'tipAmount',
        expression: 'billAmount * tipPercentage / 100',
      },
      {
        variable: 'totalAmount',
        expression: 'billAmount + tipAmount',
      },
      {
        variable: 'perPerson',
        expression: 'totalAmount / numberOfPeople',
      },
    ],
    outputs: [
      {
        id: 'tip-amount',
        label: 'Tip Amount',
        formula: 'tipAmount',
        format: { type: 'currency' },
      },
      {
        id: 'total-amount',
        label: 'Total',
        formula: 'totalAmount',
        format: { type: 'currency', highlight: true },
      },
      {
        id: 'per-person',
        label: 'Per Person',
        formula: 'perPerson',
        format: { type: 'currency' },
      },
    ],
    metadata: { version: '1.0.0' },
  },

  // -----------------------------------------------------------------------
  // 6. Pythagorean Theorem
  // -----------------------------------------------------------------------
  {
    id: 'pythagorean-theorem',
    slug: 'pythagorean-theorem',
    name: 'Pythagorean Theorem',
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
        required: true,
      },
      {
        id: 'sideB',
        label: 'Side B',
        type: 'number',
        min: 0,
        step: 0.01,
        defaultValue: 4,
        required: true,
      },
    ],
    formulas: [
      {
        variable: 'hypotenuse',
        expression: 'sqrt(pow(sideA, 2) + pow(sideB, 2))',
      },
    ],
    outputs: [
      {
        id: 'hypotenuse-value',
        label: 'Hypotenuse',
        formula: 'hypotenuse',
        format: { type: 'number', precision: 4, highlight: true },
      },
    ],
    metadata: { version: '1.0.0' },
  },

  // -----------------------------------------------------------------------
  // 7. Calorie Calculator (BMR — Mifflin-St Jeor)
  // -----------------------------------------------------------------------
  {
    id: 'calorie-calculator',
    slug: 'calorie-calculator',
    name: 'Calorie Calculator',
    description:
      'Estimate your Basal Metabolic Rate (BMR) and daily caloric needs using the Mifflin-St Jeor equation.',
    icon: '🔥',
    category: 'health',
    subcategory: 'nutrition',
    tags: ['calorie', 'bmr', 'metabolism', 'nutrition', 'diet'],
    inputs: [
      {
        id: 'weight',
        label: 'Weight',
        type: 'number',
        min: 1,
        step: 0.1,
        defaultValue: 70,
        suffix: ' kg',
        required: true,
      },
      {
        id: 'height',
        label: 'Height',
        type: 'number',
        min: 1,
        step: 0.1,
        defaultValue: 175,
        suffix: ' cm',
        required: true,
      },
      {
        id: 'age',
        label: 'Age',
        type: 'number',
        min: 1,
        max: 120,
        step: 1,
        defaultValue: 25,
        suffix: ' years',
        required: true,
      },
      {
        id: 'activityLevel',
        label: 'Activity Level',
        type: 'select',
        options: [
          { label: 'Sedentary (little or no exercise)', value: 1.2 },
          { label: 'Lightly Active (1–3 days/week)', value: 1.375 },
          { label: 'Moderately Active (3–5 days/week)', value: 1.55 },
          { label: 'Active (6–7 days/week)', value: 1.725 },
          { label: 'Very Active (hard exercise daily)', value: 1.9 },
        ],
        defaultValue: 1.55,
        required: true,
      },
    ],
    formulas: [
      {
        variable: 'bmr',
        expression: '10 * weight + 6.25 * height - 5 * age + 5',
      },
      {
        variable: 'dailyCalories',
        expression: 'bmr * activityLevel',
      },
    ],
    outputs: [
      {
        id: 'bmr-value',
        label: 'BMR',
        formula: 'bmr',
        format: { type: 'number', suffix: ' kcal' },
      },
      {
        id: 'daily-calories',
        label: 'Daily Calories',
        formula: 'dailyCalories',
        format: { type: 'number', suffix: ' kcal', highlight: true },
      },
    ],
    metadata: { version: '1.0.0' },
  },

  // -----------------------------------------------------------------------
  // 8. Temperature Converter
  // -----------------------------------------------------------------------
  {
    id: 'temperature-converter',
    slug: 'temperature-converter',
    name: 'Temperature Converter',
    description:
      'Convert a temperature in Celsius to Fahrenheit and Kelvin instantly.',
    icon: '🌡️',
    category: 'conversion',
    subcategory: 'temperature',
    tags: ['temperature', 'celsius', 'fahrenheit', 'kelvin', 'convert'],
    inputs: [
      {
        id: 'celsius',
        label: 'Celsius',
        type: 'number',
        step: 0.1,
        defaultValue: 0,
        suffix: ' °C',
        required: true,
      },
    ],
    formulas: [
      {
        variable: 'fahrenheit',
        expression: 'celsius * 9 / 5 + 32',
      },
      {
        variable: 'kelvin',
        expression: 'celsius + 273.15',
      },
    ],
    outputs: [
      {
        id: 'fahrenheit-value',
        label: 'Fahrenheit',
        formula: 'fahrenheit',
        format: { type: 'number', precision: 2, suffix: ' °F' },
      },
      {
        id: 'kelvin-value',
        label: 'Kelvin',
        formula: 'kelvin',
        format: { type: 'number', precision: 2, suffix: ' K' },
      },
    ],
    metadata: { version: '1.0.0' },
  },
];
