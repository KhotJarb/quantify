// ---------------------------------------------------------------------------
// Quantify — General Calculators
// ---------------------------------------------------------------------------
// 13 general-purpose calculators covering basic arithmetic, finance,
// conversions, everyday utilities, and health metrics.
// ---------------------------------------------------------------------------

import type { CalculatorSchema } from '@/types/calculator';

export const generalCalculators: CalculatorSchema[] = [
  // =========================================================================
  // 1. Base Calculator — simple 4-function calculator
  // =========================================================================
  {
    id: 'base-calculator',
    slug: 'base-calculator',
    title: 'Calculator',
    description:
      'A standard calculator with a familiar button layout — add, subtract, multiply, divide, memory, and more.',
    icon: '🖩',
    category: 'general',
    subcategory: 'basic',
    tags: ['basic', 'arithmetic', 'add', 'subtract', 'multiply', 'divide'],
    inputs: [
      {
        id: 'a',
        label: 'First Number',
        type: 'number',
        defaultValue: 0,
        placeholder: 'e.g. 42',
        required: true,
      },
      {
        id: 'op',
        label: 'Operation',
        type: 'select',
        options: [
          { label: 'Add (+)', value: '0' },
          { label: 'Subtract (−)', value: '1' },
          { label: 'Multiply (×)', value: '2' },
          { label: 'Divide (÷)', value: '3' },
        ],
        defaultValue: '0',
        required: true,
      },
      {
        id: 'b',
        label: 'Second Number',
        type: 'number',
        defaultValue: 0,
        placeholder: 'e.g. 7',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'result',
        expression:
          'op == 0 ? a + b : (op == 1 ? a - b : (op == 2 ? a * b : a / b))',
        dependencies: ['a', 'b', 'op'],
      },
    ],
    outputs: [
      {
        id: 'result-value',
        label: 'Result',
        formulaRef: 'result',
        format: 'number',
        precision: 6,
        highlight: true,
      },
    ],
    guide: {
      whatIsIt:
        'A straightforward four-function calculator that performs addition, subtraction, multiplication, or division on two numbers.',
      howToUse:
        'Enter the first number, choose an operation from the dropdown, enter the second number, and the result appears instantly.',
      exampleScenario:
        'You need to split a $156 dinner bill among 4 friends. Enter 156 as the first number, select Divide (÷), enter 4, and you get $39 per person.',
      proTip:
        'Division by zero will produce an error. If you need more advanced operations like exponents or roots, try our scientific calculator.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 2. TVM Calculator — Time Value of Money
  // =========================================================================
  {
    id: 'tvm-calculator',
    slug: 'tvm-calculator',
    title: 'Time Value of Money (TVM)',
    description:
      'Solve for any one of the five TVM variables: Present Value, Future Value, Payment, Number of Periods, or Interest Rate.',
    icon: '⏳',
    category: 'finance',
    subcategory: 'investments',
    tags: ['tvm', 'time-value', 'present-value', 'future-value', 'finance', 'annuity'],
    inputs: [
      {
        id: 'solveFor',
        label: 'Solve For',
        type: 'select',
        options: [
          { label: 'Present Value (PV)', value: '0' },
          { label: 'Future Value (FV)', value: '1' },
          { label: 'Payment (PMT)', value: '2' },
          { label: 'Number of Years (N)', value: '3' },
          { label: 'Interest Rate', value: '4' },
        ],
        defaultValue: '1',
        required: true,
      },
      {
        id: 'presentValue',
        label: 'Present Value ($)',
        type: 'number',
        defaultValue: 10000,
        placeholder: 'e.g. 10000',
        helpText: 'The current lump-sum amount. Leave 0 when solving for PV.',
      },
      {
        id: 'futureValue',
        label: 'Future Value ($)',
        type: 'number',
        defaultValue: 0,
        placeholder: 'e.g. 50000',
        helpText: 'The desired future amount. Leave 0 when solving for FV.',
      },
      {
        id: 'payment',
        label: 'Periodic Payment ($)',
        type: 'number',
        defaultValue: 0,
        placeholder: 'e.g. 200',
        helpText: 'Regular contribution each period. Leave 0 when solving for PMT.',
      },
      {
        id: 'interestRate',
        label: 'Annual Interest Rate (%)',
        type: 'number',
        min: 0,
        max: 100,
        step: 0.01,
        defaultValue: 7,
        placeholder: 'e.g. 7',
        helpText: 'Annual nominal rate. Leave 0 when solving for Rate.',
      },
      {
        id: 'periodsPerYear',
        label: 'Compounding / Payment Frequency',
        type: 'select',
        options: [
          { label: 'Monthly', value: '12' },
          { label: 'Quarterly', value: '4' },
          { label: 'Semi-Annually', value: '2' },
          { label: 'Annually', value: '1' },
        ],
        defaultValue: '12',
        required: true,
      },
      {
        id: 'numberOfYears',
        label: 'Number of Years',
        type: 'number',
        min: 0,
        step: 1,
        defaultValue: 10,
        placeholder: 'e.g. 10',
        helpText: 'Leave 0 when solving for N.',
      },
    ],
    formulas: [
      {
        id: 'periodicRate',
        expression: 'interestRate / 100 / periodsPerYear',
        dependencies: ['interestRate', 'periodsPerYear'],
      },
      {
        id: 'totalPeriods',
        expression: 'numberOfYears * periodsPerYear',
        dependencies: ['numberOfYears', 'periodsPerYear'],
      },
      {
        id: 'solvedValue',
        expression:
          'solveFor == 0 ? pv(periodicRate, totalPeriods, payment, futureValue) : (solveFor == 1 ? fv(periodicRate, totalPeriods, payment, presentValue) : (solveFor == 2 ? pmt(periodicRate, totalPeriods, presentValue, futureValue) : (solveFor == 3 ? nper(periodicRate, payment, presentValue, futureValue) / periodsPerYear : rate(totalPeriods, payment, presentValue, futureValue) * periodsPerYear * 100)))',
        dependencies: [
          'solveFor',
          'periodicRate',
          'totalPeriods',
          'payment',
          'futureValue',
          'presentValue',
          'periodsPerYear',
          'numberOfYears',
          'interestRate',
        ],
      },
    ],
    outputs: [
      {
        id: 'solved-result',
        label: 'Solved Value',
        formulaRef: 'solvedValue',
        format: 'number',
        precision: 4,
        highlight: true,
      },
    ],
    guide: {
      whatIsIt:
        'The Time Value of Money calculator lets you solve for any one of the five core financial variables — Present Value, Future Value, Payment, Number of Periods, or Interest Rate — given the other four. It is the foundation of all discounted-cash-flow analysis.',
      howToUse:
        '1. Select which variable you want to solve for from the dropdown. 2. Fill in the remaining four variables (set the one you\'re solving for to 0). 3. Choose your compounding frequency. 4. The result appears instantly.',
      exampleScenario:
        'You want to know how much $10,000 invested today at 7% annual interest compounded monthly will be worth in 10 years. Select "Future Value", enter PV = 10000, Rate = 7%, Periods = Monthly, Years = 10. The answer is approximately $20,096.61.',
      proTip:
        'Cash outflows are negative, inflows are positive. When solving for Rate, the answer is displayed as an annual percentage. For loan calculations, enter the loan amount as PV and set FV to 0.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 3. Currency Converter (hardcoded reference rates — June 2025)
  // =========================================================================
  {
    id: 'currency-converter',
    slug: 'currency-converter',
    title: 'Currency Converter',
    description:
      'Convert between 12 major world currencies using hardcoded reference rates.',
    icon: '💱',
    category: 'conversion',
    subcategory: 'currency',
    tags: ['currency', 'exchange', 'forex', 'convert', 'usd', 'eur', 'gbp'],
    inputs: [
      {
        id: 'amount',
        label: 'Amount',
        type: 'number',
        min: 0,
        step: 0.01,
        defaultValue: 100,
        placeholder: 'e.g. 1000',
        required: true,
      },
      {
        id: 'fromCurrency',
        label: 'From Currency',
        type: 'select',
        options: [
          { label: 'USD — US Dollar', value: '1' },
          { label: 'EUR — Euro', value: '0.92' },
          { label: 'GBP — British Pound', value: '0.79' },
          { label: 'JPY — Japanese Yen', value: '157.5' },
          { label: 'CAD — Canadian Dollar', value: '1.37' },
          { label: 'AUD — Australian Dollar', value: '1.53' },
          { label: 'CHF — Swiss Franc', value: '0.89' },
          { label: 'CNY — Chinese Yuan', value: '7.27' },
          { label: 'INR — Indian Rupee', value: '83.5' },
          { label: 'BRL — Brazilian Real', value: '5.05' },
          { label: 'MXN — Mexican Peso', value: '17.2' },
          { label: 'KRW — South Korean Won', value: '1380' },
        ],
        defaultValue: '1',
        required: true,
      },
      {
        id: 'toCurrency',
        label: 'To Currency',
        type: 'select',
        options: [
          { label: 'USD — US Dollar', value: '1' },
          { label: 'EUR — Euro', value: '0.92' },
          { label: 'GBP — British Pound', value: '0.79' },
          { label: 'JPY — Japanese Yen', value: '157.5' },
          { label: 'CAD — Canadian Dollar', value: '1.37' },
          { label: 'AUD — Australian Dollar', value: '1.53' },
          { label: 'CHF — Swiss Franc', value: '0.89' },
          { label: 'CNY — Chinese Yuan', value: '7.27' },
          { label: 'INR — Indian Rupee', value: '83.5' },
          { label: 'BRL — Brazilian Real', value: '5.05' },
          { label: 'MXN — Mexican Peso', value: '17.2' },
          { label: 'KRW — South Korean Won', value: '1380' },
        ],
        defaultValue: '0.92',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'convertedAmount',
        expression: 'amount * toCurrency / fromCurrency',
        dependencies: ['amount', 'fromCurrency', 'toCurrency'],
      },
      {
        id: 'exchangeRate',
        expression: 'toCurrency / fromCurrency',
        dependencies: ['fromCurrency', 'toCurrency'],
      },
    ],
    outputs: [
      {
        id: 'converted-value',
        label: 'Converted Amount',
        formulaRef: 'convertedAmount',
        format: 'number',
        precision: 2,
        highlight: true,
      },
      {
        id: 'rate-display',
        label: 'Exchange Rate',
        formulaRef: 'exchangeRate',
        format: 'number',
        precision: 6,
      },
    ],
    guide: {
      whatIsIt:
        'A quick currency converter that uses hardcoded mid-market reference rates (last updated June 2025) to convert between 12 major world currencies. This is intended for rough estimates only.',
      howToUse:
        'Enter the amount you want to convert, select the source currency, select the target currency, and the converted amount is displayed instantly.',
      exampleScenario:
        'You have 100 USD and want to know the equivalent in Euros. Enter 100, select USD as the source and EUR as the target. At the reference rate of 0.92, you get 92.00 EUR.',
      proTip:
        'These rates are static snapshots and do NOT reflect live market prices. For real-time conversions, always check a live forex feed. Rates can fluctuate significantly within a single day.',
    },
    metadata: { version: '1.0.0', lastUpdated: '2025-06-15' },
  },

  // =========================================================================
  // 4. Compound Interest Calculator (Enhanced)
  // =========================================================================
  {
    id: 'compound-interest-enhanced',
    slug: 'compound-interest-enhanced',
    title: 'Compound Interest (Enhanced)',
    description:
      'Calculate compound interest with optional recurring monthly contributions, flexible compounding frequencies, and a full breakdown of interest earned.',
    icon: '📈',
    category: 'finance',
    subcategory: 'investments',
    tags: [
      'compound',
      'interest',
      'investment',
      'savings',
      'contribution',
      'growth',
    ],
    inputs: [
      {
        id: 'principal',
        label: 'Initial Principal ($)',
        type: 'number',
        min: 0,
        defaultValue: 10000,
        placeholder: 'e.g. 10000',
        required: true,
      },
      {
        id: 'monthlyContribution',
        label: 'Monthly Contribution ($)',
        type: 'number',
        min: 0,
        defaultValue: 200,
        placeholder: 'e.g. 200',
      },
      {
        id: 'annualRate',
        label: 'Annual Interest Rate (%)',
        type: 'number',
        min: 0,
        max: 100,
        step: 0.01,
        defaultValue: 7,
        placeholder: 'e.g. 7',
        required: true,
      },
      {
        id: 'compoundingFrequency',
        label: 'Compounding Frequency',
        type: 'select',
        options: [
          { label: 'Daily (365)', value: '365' },
          { label: 'Monthly (12)', value: '12' },
          { label: 'Quarterly (4)', value: '4' },
          { label: 'Annually (1)', value: '1' },
        ],
        defaultValue: '12',
        required: true,
      },
      {
        id: 'years',
        label: 'Investment Period (years)',
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
        id: 'r',
        expression: 'annualRate / 100 / compoundingFrequency',
        dependencies: ['annualRate', 'compoundingFrequency'],
      },
      {
        id: 'n',
        expression: 'compoundingFrequency * years',
        dependencies: ['compoundingFrequency', 'years'],
      },
      {
        id: 'compoundedPrincipal',
        expression: 'principal * pow(1 + r, n)',
        dependencies: ['principal', 'r', 'n'],
      },
      {
        id: 'futureContributions',
        expression:
          'monthlyContribution * 12 / compoundingFrequency * ((pow(1 + r, n) - 1) / r)',
        dependencies: ['monthlyContribution', 'compoundingFrequency', 'r', 'n'],
      },
      {
        id: 'totalFV',
        expression: 'compoundedPrincipal + futureContributions',
        dependencies: ['compoundedPrincipal', 'futureContributions'],
      },
      {
        id: 'totalContributed',
        expression: 'principal + monthlyContribution * 12 * years',
        dependencies: ['principal', 'monthlyContribution', 'years'],
      },
      {
        id: 'interestEarned',
        expression: 'totalFV - totalContributed',
        dependencies: ['totalFV', 'totalContributed'],
      },
    ],
    outputs: [
      {
        id: 'future-value',
        label: 'Future Value',
        formulaRef: 'totalFV',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
      {
        id: 'total-contributed',
        label: 'Total Contributed',
        formulaRef: 'totalContributed',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'interest-earned',
        label: 'Interest Earned',
        formulaRef: 'interestEarned',
        format: 'currency',
        precision: 2,
      },
    ],
    guide: {
      whatIsIt:
        'An enhanced compound interest calculator that factors in recurring monthly contributions alongside an initial principal. It shows how your money grows over time through the power of compounding.',
      howToUse:
        '1. Enter your starting principal. 2. Optionally add a monthly contribution amount. 3. Set your expected annual interest rate. 4. Choose how often interest compounds (daily, monthly, quarterly, or annually). 5. Enter the number of years. The calculator shows the future value, total contributions, and total interest earned.',
      exampleScenario:
        'You invest $10,000 today and add $200 per month at 7% annual interest compounded monthly for 10 years. Your future value is approximately $48,032 — of which $34,000 was contributed and $14,032 is interest.',
      proTip:
        'The difference between monthly and annual compounding grows dramatically over long time horizons. At 7% over 30 years, monthly compounding earns roughly 5% more total interest than annual compounding on the same principal.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 5. Tip Calculator
  // =========================================================================
  {
    id: 'tip-calculator',
    slug: 'tip-calculator',
    title: 'Tip Calculator',
    description:
      'Quickly figure out how much to tip and split the total bill between people.',
    icon: '🧾',
    category: 'everyday',
    subcategory: 'shopping',
    tags: ['tip', 'restaurant', 'bill', 'gratuity', 'split'],
    inputs: [
      {
        id: 'billAmount',
        label: 'Bill Amount ($)',
        type: 'number',
        min: 0,
        step: 0.01,
        defaultValue: 50,
        placeholder: 'e.g. 85.00',
        required: true,
      },
      {
        id: 'tipPercentage',
        label: 'Tip Percentage (%)',
        type: 'range',
        min: 0,
        max: 50,
        step: 1,
        defaultValue: 18,
      },
      {
        id: 'numberOfPeople',
        label: 'Number of People',
        type: 'number',
        min: 1,
        step: 1,
        defaultValue: 1,
        placeholder: 'e.g. 4',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'tipAmount',
        expression: 'billAmount * tipPercentage / 100',
        dependencies: ['billAmount', 'tipPercentage'],
      },
      {
        id: 'totalBill',
        expression: 'billAmount + tipAmount',
        dependencies: ['billAmount', 'tipAmount'],
      },
      {
        id: 'perPerson',
        expression: 'totalBill / numberOfPeople',
        dependencies: ['totalBill', 'numberOfPeople'],
      },
    ],
    outputs: [
      {
        id: 'tip-amount',
        label: 'Tip Amount',
        formulaRef: 'tipAmount',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'total-bill',
        label: 'Total Bill',
        formulaRef: 'totalBill',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
      {
        id: 'per-person',
        label: 'Per Person',
        formulaRef: 'perPerson',
        format: 'currency',
        precision: 2,
      },
    ],
    guide: {
      whatIsIt:
        'A tip calculator that computes the tip amount, total bill, and per-person share when splitting among a group.',
      howToUse:
        'Enter the pre-tip bill amount, slide the tip percentage to your desired level, and optionally set the number of people splitting the bill. Results update in real time.',
      exampleScenario:
        'Your dinner bill is $85. You want to leave an 18% tip and split among 3 friends. The tip is $15.30, total is $100.30, and each person owes $33.43.',
      proTip:
        'In the US, 15–20% is standard for sit-down restaurants. For exceptional service, consider 20–25%. Some restaurants add an automatic gratuity for large parties — check your bill first!',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 6. Percentage Calculator
  // =========================================================================
  {
    id: 'percentage-calculator',
    slug: 'percentage-calculator',
    title: 'Percentage Calculator',
    description:
      'Calculate what X% of Y is, and find what percentage Y is of X.',
    icon: '%',
    category: 'general',
    subcategory: 'percentage',
    tags: ['percentage', 'percent', 'ratio', 'fraction', 'proportion'],
    inputs: [
      {
        id: 'value',
        label: 'Value (Y)',
        type: 'number',
        defaultValue: 200,
        placeholder: 'e.g. 200',
        required: true,
      },
      {
        id: 'percentage',
        label: 'Percentage (X%)',
        type: 'number',
        min: 0,
        step: 0.01,
        defaultValue: 15,
        placeholder: 'e.g. 15',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'result',
        expression: 'value * percentage / 100',
        dependencies: ['value', 'percentage'],
      },
      {
        id: 'reversePercent',
        expression: 'value / percentage * 100',
        dependencies: ['value', 'percentage'],
      },
    ],
    outputs: [
      {
        id: 'percent-of-value',
        label: 'X% of Y',
        formulaRef: 'result',
        format: 'number',
        precision: 4,
        highlight: true,
      },
      {
        id: 'reverse-percent',
        label: 'Y is what % of X',
        formulaRef: 'reversePercent',
        format: 'percentage',
        precision: 2,
      },
    ],
    guide: {
      whatIsIt:
        'A dual-purpose percentage calculator. It tells you what X% of a value Y equals, and conversely what percentage Y represents relative to X.',
      howToUse:
        'Enter the value (Y) and the percentage (X). The first output shows X% of Y (e.g., 15% of 200 = 30). The second output shows Y as a percentage of X (e.g., 200 / 15 × 100 ≈ 1333.33%).',
      exampleScenario:
        'A jacket is $200 and the store is running a 15% off sale. Enter 200 as the value and 15 as the percentage. The discount is $30, so you pay $170.',
      proTip:
        'To find "A is what percent of B", simply compute (A / B) × 100. This calculator gives you the reverse by using (Y / X) × 100.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 7. Unit Converter — Length
  // =========================================================================
  {
    id: 'unit-converter-length',
    slug: 'unit-converter-length',
    title: 'Length Unit Converter',
    description:
      'Convert between common length units: meters, kilometers, miles, yards, feet, inches, and more.',
    icon: '📏',
    category: 'conversion',
    subcategory: 'length',
    tags: ['length', 'distance', 'convert', 'meters', 'miles', 'feet', 'inches'],
    inputs: [
      {
        id: 'value',
        label: 'Value',
        type: 'number',
        min: 0,
        step: 0.001,
        defaultValue: 1,
        placeholder: 'e.g. 5',
        required: true,
      },
      {
        id: 'fromUnit',
        label: 'From Unit',
        type: 'select',
        options: [
          { label: 'Meters (m)', value: '1' },
          { label: 'Kilometers (km)', value: '1000' },
          { label: 'Centimeters (cm)', value: '0.01' },
          { label: 'Millimeters (mm)', value: '0.001' },
          { label: 'Miles (mi)', value: '1609.344' },
          { label: 'Yards (yd)', value: '0.9144' },
          { label: 'Feet (ft)', value: '0.3048' },
          { label: 'Inches (in)', value: '0.0254' },
        ],
        defaultValue: '1',
        required: true,
      },
      {
        id: 'toUnit',
        label: 'To Unit',
        type: 'select',
        options: [
          { label: 'Meters (m)', value: '1' },
          { label: 'Kilometers (km)', value: '1000' },
          { label: 'Centimeters (cm)', value: '0.01' },
          { label: 'Millimeters (mm)', value: '0.001' },
          { label: 'Miles (mi)', value: '1609.344' },
          { label: 'Yards (yd)', value: '0.9144' },
          { label: 'Feet (ft)', value: '0.3048' },
          { label: 'Inches (in)', value: '0.0254' },
        ],
        defaultValue: '0.3048',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'result',
        expression: 'value * fromUnit / toUnit',
        dependencies: ['value', 'fromUnit', 'toUnit'],
      },
    ],
    outputs: [
      {
        id: 'converted-value',
        label: 'Converted Value',
        formulaRef: 'result',
        format: 'number',
        precision: 6,
        highlight: true,
      },
    ],
    guide: {
      whatIsIt:
        'A length unit converter that supports 8 common units. It converts the input value from one unit to another using meter as the base unit.',
      howToUse:
        'Enter the numeric value, select the source unit (From), and select the target unit (To). The converted result updates instantly.',
      exampleScenario:
        'You need to know how many feet are in 1 kilometer. Enter 1, select Kilometers, and select Feet. The result is approximately 3,280.84 feet.',
      proTip:
        'The conversion is exact for metric-to-metric conversions. The mile is defined as exactly 1,609.344 meters, and 1 inch is exactly 25.4 mm, so all conversions here are precise.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 8. Date Duration Calculator (approximate)
  // =========================================================================
  {
    id: 'date-duration-calculator',
    slug: 'date-duration-calculator',
    title: 'Date Duration Calculator',
    description:
      'Estimate the number of days and weeks between two dates using a simplified calendar model.',
    icon: '📅',
    category: 'general',
    subcategory: 'date-time',
    tags: ['date', 'duration', 'days', 'weeks', 'between', 'difference'],
    inputs: [
      {
        id: 'startYear',
        label: 'Start Year',
        type: 'number',
        min: 1,
        step: 1,
        defaultValue: 2025,
        placeholder: 'e.g. 2025',
        required: true,
      },
      {
        id: 'startMonth',
        label: 'Start Month (1–12)',
        type: 'number',
        min: 1,
        max: 12,
        step: 1,
        defaultValue: 1,
        placeholder: 'e.g. 1',
        required: true,
      },
      {
        id: 'startDay',
        label: 'Start Day (1–31)',
        type: 'number',
        min: 1,
        max: 31,
        step: 1,
        defaultValue: 1,
        placeholder: 'e.g. 1',
        required: true,
      },
      {
        id: 'endYear',
        label: 'End Year',
        type: 'number',
        min: 1,
        step: 1,
        defaultValue: 2025,
        placeholder: 'e.g. 2025',
        required: true,
      },
      {
        id: 'endMonth',
        label: 'End Month (1–12)',
        type: 'number',
        min: 1,
        max: 12,
        step: 1,
        defaultValue: 12,
        placeholder: 'e.g. 12',
        required: true,
      },
      {
        id: 'endDay',
        label: 'End Day (1–31)',
        type: 'number',
        min: 1,
        max: 31,
        step: 1,
        defaultValue: 31,
        placeholder: 'e.g. 31',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'totalStartDays',
        expression: 'startYear * 365 + startMonth * 30 + startDay',
        dependencies: ['startYear', 'startMonth', 'startDay'],
      },
      {
        id: 'totalEndDays',
        expression: 'endYear * 365 + endMonth * 30 + endDay',
        dependencies: ['endYear', 'endMonth', 'endDay'],
      },
      {
        id: 'daysDiff',
        expression: 'abs(totalEndDays - totalStartDays)',
        dependencies: ['totalEndDays', 'totalStartDays'],
      },
      {
        id: 'weeksDiff',
        expression: 'floor(daysDiff / 7)',
        dependencies: ['daysDiff'],
      },
    ],
    outputs: [
      {
        id: 'days-difference',
        label: 'Approximate Days',
        formulaRef: 'daysDiff',
        format: 'number',
        precision: 0,
        highlight: true,
        suffix: ' days',
      },
      {
        id: 'weeks-difference',
        label: 'Approximate Weeks',
        formulaRef: 'weeksDiff',
        format: 'number',
        precision: 0,
        suffix: ' weeks',
      },
    ],
    guide: {
      whatIsIt:
        'A simplified date duration calculator that estimates the number of days and weeks between two dates. It uses a flat 365-day year and 30-day month model for quick approximations.',
      howToUse:
        'Enter the start date (year, month, day) and end date (year, month, day). The calculator displays the approximate number of days and complete weeks between the two dates.',
      exampleScenario:
        'You want to estimate the duration from January 1, 2025 to December 31, 2025. Enter start = 2025/1/1, end = 2025/12/31. The approximate result is 360 days (51 weeks).',
      proTip:
        'This uses a simplified calendar model (30-day months, 365-day years) and does NOT account for leap years or varying month lengths. For precise date math, use a dedicated calendar tool or date library.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 9. Fuel Cost Calculator
  // =========================================================================
  {
    id: 'fuel-cost-calculator',
    slug: 'fuel-cost-calculator',
    title: 'Fuel Cost Calculator',
    description:
      'Estimate the fuel consumption and total fuel cost for a trip based on distance, fuel efficiency, and fuel price.',
    icon: '⛽',
    category: 'everyday',
    subcategory: 'travel',
    tags: ['fuel', 'gas', 'petrol', 'cost', 'travel', 'mileage', 'trip'],
    inputs: [
      {
        id: 'distance',
        label: 'Trip Distance (km)',
        type: 'number',
        min: 0,
        step: 1,
        defaultValue: 500,
        placeholder: 'e.g. 500',
        required: true,
      },
      {
        id: 'consumption',
        label: 'Fuel Consumption (L / 100 km)',
        type: 'number',
        min: 0,
        step: 0.1,
        defaultValue: 8,
        placeholder: 'e.g. 8',
        required: true,
        helpText: 'Your vehicle\'s rated fuel consumption in liters per 100 km.',
      },
      {
        id: 'pricePerLiter',
        label: 'Fuel Price ($ per liter)',
        type: 'number',
        min: 0,
        step: 0.01,
        defaultValue: 1.5,
        placeholder: 'e.g. 1.50',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'fuelUsed',
        expression: 'distance * consumption / 100',
        dependencies: ['distance', 'consumption'],
      },
      {
        id: 'totalCost',
        expression: 'fuelUsed * pricePerLiter',
        dependencies: ['fuelUsed', 'pricePerLiter'],
      },
      {
        id: 'costPerKm',
        expression: 'totalCost / distance',
        dependencies: ['totalCost', 'distance'],
      },
    ],
    outputs: [
      {
        id: 'fuel-used',
        label: 'Fuel Needed',
        formulaRef: 'fuelUsed',
        format: 'number',
        precision: 2,
        suffix: ' L',
      },
      {
        id: 'total-cost',
        label: 'Total Fuel Cost',
        formulaRef: 'totalCost',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
      {
        id: 'cost-per-km',
        label: 'Cost per km',
        formulaRef: 'costPerKm',
        format: 'currency',
        precision: 4,
      },
    ],
    guide: {
      whatIsIt:
        'A fuel cost estimator that calculates how much fuel you will use on a trip and the total cost, based on your vehicle\'s fuel consumption rating and local fuel prices.',
      howToUse:
        'Enter the total trip distance in kilometers, your vehicle\'s fuel consumption in liters per 100 km (usually found in the owner\'s manual or on the fuel-efficiency sticker), and the price per liter at your local pump.',
      exampleScenario:
        'A 500 km road trip with a car that uses 8 L/100 km and fuel at $1.50/L: you will need 40 liters of fuel costing $60.00 total, or $0.12 per kilometer.',
      proTip:
        'Real-world fuel consumption is typically 10–20% higher than the manufacturer\'s rated figure, especially in city driving or with heavy loads. Add a buffer to your estimate for highway driving with A/C on.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 10. EV Range & Cost Calculator
  // =========================================================================
  {
    id: 'ev-calculator',
    slug: 'ev-calculator',
    title: 'EV Range & Cost Calculator',
    description:
      'Estimate an electric vehicle\'s driving range and calculate the charging cost for a given trip distance.',
    icon: '🔋',
    category: 'everyday',
    subcategory: 'automotive',
    tags: ['ev', 'electric', 'vehicle', 'range', 'charging', 'cost', 'kwh'],
    inputs: [
      {
        id: 'batteryCapacity',
        label: 'Battery Capacity (kWh)',
        type: 'number',
        min: 0,
        step: 0.1,
        defaultValue: 75,
        placeholder: 'e.g. 75',
        required: true,
        helpText: 'Total usable battery capacity in kilowatt-hours.',
      },
      {
        id: 'efficiency',
        label: 'Energy Efficiency (Wh/km)',
        type: 'number',
        min: 1,
        step: 1,
        defaultValue: 150,
        placeholder: 'e.g. 150',
        required: true,
        helpText: 'Average energy consumption in watt-hours per kilometer.',
      },
      {
        id: 'electricityRate',
        label: 'Electricity Rate ($/kWh)',
        type: 'number',
        min: 0,
        step: 0.01,
        defaultValue: 0.12,
        placeholder: 'e.g. 0.12',
        required: true,
      },
      {
        id: 'distance',
        label: 'Trip Distance (km)',
        type: 'number',
        min: 0,
        step: 1,
        defaultValue: 300,
        placeholder: 'e.g. 300',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'range',
        expression: 'batteryCapacity * 1000 / efficiency',
        dependencies: ['batteryCapacity', 'efficiency'],
      },
      {
        id: 'energyNeeded',
        expression: 'distance * efficiency / 1000',
        dependencies: ['distance', 'efficiency'],
      },
      {
        id: 'chargeCost',
        expression: 'energyNeeded * electricityRate',
        dependencies: ['energyNeeded', 'electricityRate'],
      },
      {
        id: 'costPerKm',
        expression: 'chargeCost / distance',
        dependencies: ['chargeCost', 'distance'],
      },
    ],
    outputs: [
      {
        id: 'estimated-range',
        label: 'Estimated Range',
        formulaRef: 'range',
        format: 'number',
        precision: 1,
        suffix: ' km',
        highlight: true,
      },
      {
        id: 'energy-needed',
        label: 'Energy Needed',
        formulaRef: 'energyNeeded',
        format: 'number',
        precision: 2,
        suffix: ' kWh',
      },
      {
        id: 'charge-cost',
        label: 'Charging Cost',
        formulaRef: 'chargeCost',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'cost-per-km',
        label: 'Cost per km',
        formulaRef: 'costPerKm',
        format: 'currency',
        precision: 4,
      },
    ],
    guide: {
      whatIsIt:
        'An electric vehicle calculator that estimates your EV\'s driving range on a full charge and the electricity cost for any given trip distance.',
      howToUse:
        '1. Enter your EV\'s usable battery capacity in kWh (check the manufacturer specs). 2. Enter the energy efficiency in Wh/km (typically 130–200 for modern EVs). 3. Enter your local electricity rate in dollars per kWh. 4. Enter the trip distance. The calculator outputs estimated range, energy needed, and total charging cost.',
      exampleScenario:
        'A 75 kWh EV with 150 Wh/km efficiency has an estimated range of 500 km. A 300 km trip uses 45 kWh of energy, costing $5.40 at $0.12/kWh — roughly $0.018 per km.',
      proTip:
        'Real-world EV range is heavily affected by speed, temperature, cabin heating/cooling, and terrain. Highway driving at high speeds can reduce range by 20–30%. In cold weather, expect 10–40% range loss.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 11. Unit Price Compare Calculator
  // =========================================================================
  {
    id: 'unit-price-compare',
    slug: 'unit-price-compare',
    title: 'Unit Price Comparison',
    description:
      'Compare the unit price of two products to find the better deal.',
    icon: '🏷️',
    category: 'everyday',
    subcategory: 'shopping',
    tags: ['unit-price', 'compare', 'shopping', 'deal', 'value', 'savings'],
    inputs: [
      {
        id: 'priceA',
        label: 'Product A — Price ($)',
        type: 'number',
        min: 0,
        step: 0.01,
        defaultValue: 3.99,
        placeholder: 'e.g. 3.99',
        required: true,
        group: 'Product A',
      },
      {
        id: 'quantityA',
        label: 'Product A — Quantity',
        type: 'number',
        min: 0.001,
        step: 0.01,
        defaultValue: 500,
        placeholder: 'e.g. 500g',
        required: true,
        helpText: 'Weight, volume, or count — use the same unit for both products.',
        group: 'Product A',
      },
      {
        id: 'priceB',
        label: 'Product B — Price ($)',
        type: 'number',
        min: 0,
        step: 0.01,
        defaultValue: 6.49,
        placeholder: 'e.g. 6.49',
        required: true,
        group: 'Product B',
      },
      {
        id: 'quantityB',
        label: 'Product B — Quantity',
        type: 'number',
        min: 0.001,
        step: 0.01,
        defaultValue: 1000,
        placeholder: 'e.g. 1000g',
        required: true,
        helpText: 'Must be the same unit as Product A.',
        group: 'Product B',
      },
    ],
    formulas: [
      {
        id: 'unitPriceA',
        expression: 'priceA / quantityA',
        dependencies: ['priceA', 'quantityA'],
      },
      {
        id: 'unitPriceB',
        expression: 'priceB / quantityB',
        dependencies: ['priceB', 'quantityB'],
      },
      {
        id: 'savings',
        expression: 'abs(unitPriceA - unitPriceB)',
        dependencies: ['unitPriceA', 'unitPriceB'],
      },
      {
        id: 'betterDeal',
        expression: 'unitPriceA < unitPriceB ? 1 : 2',
        dependencies: ['unitPriceA', 'unitPriceB'],
      },
    ],
    outputs: [
      {
        id: 'unit-price-a',
        label: 'Unit Price A',
        formulaRef: 'unitPriceA',
        format: 'currency',
        precision: 4,
        prefix: '$',
        suffix: ' / unit',
      },
      {
        id: 'unit-price-b',
        label: 'Unit Price B',
        formulaRef: 'unitPriceB',
        format: 'currency',
        precision: 4,
        prefix: '$',
        suffix: ' / unit',
      },
      {
        id: 'savings-amount',
        label: 'Savings per Unit',
        formulaRef: 'savings',
        format: 'currency',
        precision: 4,
      },
      {
        id: 'better-deal',
        label: 'Better Deal (1 = A, 2 = B)',
        formulaRef: 'betterDeal',
        format: 'number',
        precision: 0,
        highlight: true,
      },
    ],
    guide: {
      whatIsIt:
        'A unit price comparison tool that helps you determine which of two products offers better value for money by computing and comparing their per-unit prices.',
      howToUse:
        'Enter the price and quantity for Product A and Product B. Make sure both quantities use the same unit (e.g., grams, ounces, liters). The calculator shows each product\'s unit price, the savings per unit, and which product is the better deal.',
      exampleScenario:
        'A 500g box of cereal costs $3.99 ($0.00798/g) and a 1000g box costs $6.49 ($0.00649/g). Product B is the better deal, saving you $0.00149 per gram.',
      proTip:
        'Bigger isn\'t always cheaper! Some stores inflate the price of bulk items. Always compare unit prices rather than total prices. Also consider whether you can realistically use the larger quantity before it expires.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 12. BMI Calculator (Enhanced)
  // =========================================================================
  {
    id: 'bmi-calculator-enhanced',
    slug: 'bmi-calculator-enhanced',
    title: 'BMI Calculator (Enhanced)',
    description:
      'Calculate Body Mass Index, BMI Prime, and Ponderal Index with support for metric and imperial units.',
    icon: '⚖️',
    category: 'health',
    subcategory: 'body-metrics',
    tags: ['bmi', 'body', 'mass', 'index', 'weight', 'health', 'ponderal'],
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
        ],
      },
      {
        id: 'age',
        label: 'Age (years)',
        type: 'number',
        min: 2,
        max: 120,
        step: 1,
        defaultValue: 30,
        placeholder: 'e.g. 30',
        helpText: 'Age is displayed for reference; standard BMI does not vary by age in adults.',
      },
      {
        id: 'sex',
        label: 'Sex',
        type: 'select',
        options: [
          { label: 'Male', value: '0' },
          { label: 'Female', value: '1' },
        ],
        defaultValue: '0',
        helpText: 'Sex is displayed for reference; standard BMI uses the same formula for both.',
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
      {
        id: 'bmiPrime',
        expression: 'bmi / 25',
        dependencies: ['bmi'],
      },
      {
        id: 'ponderalIndex',
        expression: 'weight / pow(heightM, 3)',
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
        suffix: ' kg/m²',
        highlight: true,
      },
      {
        id: 'bmi-prime-value',
        label: 'BMI Prime',
        formulaRef: 'bmiPrime',
        format: 'number',
        precision: 2,
      },
      {
        id: 'ponderal-index-value',
        label: 'Ponderal Index',
        formulaRef: 'ponderalIndex',
        format: 'number',
        precision: 1,
        suffix: ' kg/m³',
      },
    ],
    guide: {
      whatIsIt:
        'An enhanced BMI calculator that computes three body composition indices: standard BMI (weight ÷ height²), BMI Prime (ratio of your BMI to the upper-normal limit of 25), and the Ponderal Index (weight ÷ height³), which better accounts for very tall or very short individuals.',
      howToUse:
        '1. Enter your weight (toggle between kg and lb). 2. Enter your height (toggle between cm and inches). 3. Optionally enter your age and sex for reference. 4. The calculator outputs BMI, BMI Prime, and Ponderal Index.',
      exampleScenario:
        'A 70 kg person who is 175 cm tall has a BMI of 22.9 (normal weight), a BMI Prime of 0.92 (under the 25 threshold), and a Ponderal Index of 13.1 kg/m³.',
      proTip:
        'BMI does not distinguish between muscle and fat mass. Athletes with high muscle mass may show an "overweight" BMI while having low body fat. For a more complete picture, consider body fat percentage or waist-to-hip ratio measurements.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 13. Tax / VAT / GST Calculator
  // =========================================================================
  {
    id: 'tax-vat-gst-calculator',
    slug: 'tax-vat-gst-calculator',
    title: 'Tax / VAT / GST Calculator',
    description:
      'Add tax to a net amount or extract the tax component from a gross amount. Works with any tax rate (sales tax, VAT, GST, etc.).',
    icon: '🧾',
    category: 'finance',
    subcategory: 'taxes',
    tags: ['tax', 'vat', 'gst', 'sales-tax', 'inclusive', 'exclusive'],
    inputs: [
      {
        id: 'amount',
        label: 'Amount ($)',
        type: 'number',
        min: 0,
        step: 0.01,
        defaultValue: 100,
        placeholder: 'e.g. 100',
        required: true,
        helpText: 'Net amount (before tax) when adding tax, or gross amount (including tax) when extracting tax.',
      },
      {
        id: 'taxRate',
        label: 'Tax Rate (%)',
        type: 'number',
        min: 0,
        max: 100,
        step: 0.01,
        defaultValue: 10,
        placeholder: 'e.g. 10',
        required: true,
      },
      {
        id: 'calculationMode',
        label: 'Calculation Mode',
        type: 'select',
        options: [
          { label: 'Add Tax (amount is pre-tax)', value: '0' },
          { label: 'Extract Tax (amount includes tax)', value: '1' },
        ],
        defaultValue: '0',
        required: true,
      },
    ],
    formulas: [
      // Add-tax path
      {
        id: 'taxAdded',
        expression: 'amount * taxRate / 100',
        dependencies: ['amount', 'taxRate'],
      },
      {
        id: 'totalWithTax',
        expression: 'amount + taxAdded',
        dependencies: ['amount', 'taxAdded'],
      },
      // Extract-tax path
      {
        id: 'preTaxAmount',
        expression: 'amount / (1 + taxRate / 100)',
        dependencies: ['amount', 'taxRate'],
      },
      {
        id: 'extractedTax',
        expression: 'amount - preTaxAmount',
        dependencies: ['amount', 'preTaxAmount'],
      },
      // Mode-aware outputs
      {
        id: 'displayTax',
        expression: 'calculationMode == 0 ? taxAdded : extractedTax',
        dependencies: ['calculationMode', 'taxAdded', 'extractedTax'],
      },
      {
        id: 'displayTotal',
        expression: 'calculationMode == 0 ? totalWithTax : amount',
        dependencies: ['calculationMode', 'totalWithTax', 'amount'],
      },
      {
        id: 'displayPreTax',
        expression: 'calculationMode == 0 ? amount : preTaxAmount',
        dependencies: ['calculationMode', 'amount', 'preTaxAmount'],
      },
    ],
    outputs: [
      {
        id: 'pre-tax-amount',
        label: 'Pre-Tax Amount',
        formulaRef: 'displayPreTax',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'tax-amount',
        label: 'Tax Amount',
        formulaRef: 'displayTax',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
      {
        id: 'total-with-tax',
        label: 'Total (incl. Tax)',
        formulaRef: 'displayTotal',
        format: 'currency',
        precision: 2,
      },
    ],
    guide: {
      whatIsIt:
        'A versatile tax calculator that works in two modes: "Add Tax" calculates the tax on a pre-tax (net) amount and shows the gross total; "Extract Tax" takes a tax-inclusive (gross) amount and breaks it down into the pre-tax price and the tax component. It works with any tax system — sales tax, VAT, GST, HST, etc.',
      howToUse:
        '1. Enter the amount. 2. Enter the applicable tax rate as a percentage. 3. Select the calculation mode: "Add Tax" if the amount is before tax, or "Extract Tax" if the amount already includes tax. The calculator shows the pre-tax amount, tax amount, and total.',
      exampleScenario:
        'A freelancer invoices $100 and needs to add 10% VAT. In "Add Tax" mode with amount = 100 and rate = 10%, the tax is $10.00 and the total is $110.00. Conversely, if a receipt shows $110 including tax, switching to "Extract Tax" reveals $100 pre-tax and $10 tax.',
      proTip:
        'When extracting tax from a gross amount, the formula is: tax = amount − amount ÷ (1 + rate/100). A common mistake is to simply multiply the gross amount by the rate — that gives an incorrect, inflated tax figure.',
    },
    metadata: { version: '1.0.0' },
  },
];
