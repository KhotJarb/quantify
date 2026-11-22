import type { CalculatorSchema } from '@/types/calculator';

// ═══════════════════════════════════════════════════════════════════════════
// Investment & Portfolio Calculators (12 calculators)
// ═══════════════════════════════════════════════════════════════════════════
// Covers missing core investment modeling workflows:
//  1. Dollar-Cost Averaging (DCA) Calculator
//  2. Present Value (PV) Calculator
//  3. CAGR Calculator (Compound Annual Growth Rate)
//  4. Future Value (FV) Calculator
//  5. Portfolio Rebalancing Calculator
//  6. DRIP Calculator (Dividend Reinvestment Plan)
//  7. Passive Income Calculator
//  8. Rental Property ROI & Cash-on-Cash Calculator
//  9. Sharpe Ratio Calculator
// 10. Lump Sum vs. DCA Comparison Calculator
// 11. Investment Goal & Monthly Savings Calculator
// 12. Stock Position Sizing & Risk Calculator
// ═══════════════════════════════════════════════════════════════════════════

export const investmentCalculators: CalculatorSchema[] = [
  // 1. Dollar-Cost Averaging (DCA) Calculator
  {
    id: 'dca-calculator',
    slug: 'dca-calculator',
    title: 'Dollar-Cost Averaging (DCA) Calculator',
    description:
      'Project how regular recurring investments compound over time across weekly, bi-weekly, monthly, or custom contribution schedules.',
    icon: '📈',
    category: 'finance',
    subcategory: 'investments',
    tags: [
      'dca',
      'dollar cost averaging',
      'recurring investment',
      'etf',
      'index fund',
      'sip',
      'portfolio growth',
    ],
    inputs: [
      {
        id: 'initialInvestment',
        label: 'Starting Lump Sum ($)',
        type: 'number',
        min: 0,
        defaultValue: 1000,
        placeholder: 'e.g. 1000',
      },
      {
        id: 'contributionAmount',
        label: 'Recurring Contribution ($)',
        type: 'number',
        min: 0,
        defaultValue: 500,
        placeholder: 'e.g. 500',
        required: true,
      },
      {
        id: 'frequency',
        label: 'Contribution Frequency',
        type: 'select',
        options: [
          { label: 'Weekly (52 / yr)', value: '52' },
          { label: 'Bi-Weekly (26 / yr)', value: '26' },
          { label: 'Monthly (12 / yr)', value: '12' },
          { label: 'Quarterly (4 / yr)', value: '4' },
          { label: 'Annually (1 / yr)', value: '1' },
        ],
        allowCustom: true,
        min: 1,
        max: 365,
        step: 1,
        customLabel: 'Custom contributions per year',
        customPlaceholder: 'e.g. 24',
        defaultValue: '12',
        required: true,
      },
      {
        id: 'annualReturn',
        label: 'Expected Annual Return (%)',
        type: 'number',
        min: -50,
        max: 100,
        step: 0.1,
        defaultValue: 8,
        placeholder: 'e.g. 8',
        required: true,
      },
      {
        id: 'years',
        label: 'Investment Duration',
        type: 'number',
        min: 0,
        defaultValue: 10,
        placeholder: 'e.g. 10',
        required: true,
        units: [
          { label: 'Years', value: 'years', conversionFactor: '1' },
          { label: 'Months', value: 'months', conversionFactor: '0.08333333333333333333' },
        ],
      },
    ],
    formulas: [
      {
        id: 'freq',
        expression: 'frequency > 0 ? frequency : 12',
        dependencies: ['frequency'],
      },
      {
        id: 'r',
        expression: 'annualReturn / 100 / freq',
        dependencies: ['annualReturn', 'freq'],
      },
      {
        id: 'n',
        expression: 'freq * years',
        dependencies: ['freq', 'years'],
      },
      {
        id: 'fvInitial',
        expression: 'initialInvestment * pow(1 + r, n)',
        dependencies: ['initialInvestment', 'r', 'n'],
      },
      {
        id: 'fvContributions',
        expression:
          'r != 0 ? contributionAmount * ((pow(1 + r, n) - 1) / r) : contributionAmount * n',
        dependencies: ['contributionAmount', 'r', 'n'],
      },
      {
        id: 'endingValue',
        expression: 'fvInitial + fvContributions',
        dependencies: ['fvInitial', 'fvContributions'],
      },
      {
        id: 'totalInvested',
        expression: 'initialInvestment + contributionAmount * n',
        dependencies: ['initialInvestment', 'contributionAmount', 'n'],
      },
      {
        id: 'totalGain',
        expression: 'endingValue - totalInvested',
        dependencies: ['endingValue', 'totalInvested'],
      },
      {
        id: 'totalReturnPct',
        expression: 'totalInvested > 0 ? (totalGain / totalInvested) * 100 : 0',
        dependencies: ['totalGain', 'totalInvested'],
      },
    ],
    outputs: [
      {
        id: 'out-ending-value',
        label: 'Ending Portfolio Value',
        formulaRef: 'endingValue',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
      {
        id: 'out-total-invested',
        label: 'Total Invested',
        formulaRef: 'totalInvested',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'out-total-gain',
        label: 'Total Investment Gain',
        formulaRef: 'totalGain',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'out-return-pct',
        label: 'Total Return',
        formulaRef: 'totalReturnPct',
        format: 'percentage',
        precision: 2,
      },
    ],
    guide: {
      whatIsIt:
        'Dollar-Cost Averaging (DCA) is the practice of investing a fixed amount on a regular schedule regardless of market price. It builds disciplined investing habits and reduces timing anxiety.',
      howToUse:
        'Enter an optional starting lump sum, your recurring contribution amount, how often you invest (or choose Custom…), expected annual return, and time horizon in Years or Months.',
      exampleScenario:
        'Starting with $1,000 and investing $500 monthly for 10 years at an 8% annual return produces roughly $93,693 from $61,000 invested—a $32,693 gain.',
      proTip:
        'Use Compare A / B to see how increasing your contribution by $100/month or extending your horizon by 5 years affects your final balance.',
    },
    metadata: { version: '1.0.0' },
  },

  // 2. Present Value (PV) Calculator
  {
    id: 'present-value-calculator',
    slug: 'present-value-calculator',
    title: 'Present Value (PV) Calculator',
    description:
      'Discount a future lump sum and optional periodic cash flows back to today’s value using a target discount rate.',
    icon: '🕰️',
    category: 'finance',
    subcategory: 'investments',
    tags: [
      'present value',
      'pv',
      'tvm',
      'time value of money',
      'discount rate',
      'dcf',
      'valuation',
    ],
    inputs: [
      {
        id: 'futureValue',
        label: 'Future Lump Sum ($)',
        type: 'number',
        min: 0,
        defaultValue: 50000,
        placeholder: 'e.g. 50000',
        required: true,
      },
      {
        id: 'periodicPayment',
        label: 'Periodic Cash Flow ($ / period)',
        type: 'number',
        min: 0,
        defaultValue: 0,
        placeholder: 'e.g. 0',
        helpText: 'Optional recurring payment received at the end of each compounding period.',
      },
      {
        id: 'discountRate',
        label: 'Annual Discount Rate (%)',
        type: 'number',
        min: 0,
        max: 100,
        step: 0.1,
        defaultValue: 6,
        placeholder: 'e.g. 6',
        required: true,
      },
      {
        id: 'compoundingFrequency',
        label: 'Compounding Frequency',
        type: 'select',
        options: [
          { label: 'Annually (1)', value: '1' },
          { label: 'Semi-Annually (2)', value: '2' },
          { label: 'Quarterly (4)', value: '4' },
          { label: 'Monthly (12)', value: '12' },
          { label: 'Daily (365)', value: '365' },
        ],
        allowCustom: true,
        min: 1,
        max: 10000,
        step: 1,
        customLabel: 'Custom periods per year',
        customPlaceholder: 'e.g. 360',
        defaultValue: '1',
        required: true,
      },
      {
        id: 'years',
        label: 'Time Horizon',
        type: 'number',
        min: 0,
        defaultValue: 10,
        placeholder: 'e.g. 10',
        required: true,
        units: [
          { label: 'Years', value: 'years', conversionFactor: '1' },
          { label: 'Months', value: 'months', conversionFactor: '0.08333333333333333333' },
        ],
      },
    ],
    formulas: [
      {
        id: 'freq',
        expression: 'compoundingFrequency > 0 ? compoundingFrequency : 1',
        dependencies: ['compoundingFrequency'],
      },
      {
        id: 'r',
        expression: 'discountRate / 100 / freq',
        dependencies: ['discountRate', 'freq'],
      },
      {
        id: 'n',
        expression: 'freq * years',
        dependencies: ['freq', 'years'],
      },
      {
        id: 'pvLumpSum',
        expression: 'futureValue / pow(1 + r, n)',
        dependencies: ['futureValue', 'r', 'n'],
      },
      {
        id: 'pvPayments',
        expression:
          'r != 0 ? periodicPayment * ((1 - pow(1 + r, -n)) / r) : periodicPayment * n',
        dependencies: ['periodicPayment', 'r', 'n'],
      },
      {
        id: 'totalPV',
        expression: 'pvLumpSum + pvPayments',
        dependencies: ['pvLumpSum', 'pvPayments'],
      },
      {
        id: 'totalFutureCash',
        expression: 'futureValue + periodicPayment * n',
        dependencies: ['futureValue', 'periodicPayment', 'n'],
      },
      {
        id: 'totalDiscount',
        expression: 'totalFutureCash - totalPV',
        dependencies: ['totalFutureCash', 'totalPV'],
      },
    ],
    outputs: [
      {
        id: 'out-total-pv',
        label: 'Total Present Value',
        formulaRef: 'totalPV',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
      {
        id: 'out-pv-lump',
        label: 'PV of Future Lump Sum',
        formulaRef: 'pvLumpSum',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'out-pv-pmt',
        label: 'PV of Periodic Cash Flows',
        formulaRef: 'pvPayments',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'out-discount',
        label: 'Total Discount Implied',
        formulaRef: 'totalDiscount',
        format: 'currency',
        precision: 2,
      },
    ],
    guide: {
      whatIsIt:
        'Present Value (PV) determines what a future sum of money or stream of cash flows is worth today given a specific discount rate (opportunity cost or required rate of return).',
      howToUse:
        'Enter the future lump sum (and any optional periodic cash flows), choose your discount rate and compounding schedule, and set the time period in Years or Months.',
      exampleScenario:
        'Receiving $50,000 in 10 years discounted at 6% annually is worth $27,919.74 today—meaning investing $27,919.74 at 6% would grow to $50,000 over the same 10 years.',
      proTip:
        'Higher discount rates sharply reduce the present value of distant cash flows. Compare two discount rates (e.g. 5% vs. 9%) in A / B mode to test valuation sensitivity.',
    },
    metadata: { version: '1.0.0' },
  },

  // 3. CAGR Calculator (Compound Annual Growth Rate)
  {
    id: 'cagr-calculator',
    slug: 'cagr-calculator',
    title: 'CAGR Calculator',
    description:
      'Calculate the Compound Annual Growth Rate (CAGR), total return, growth multiple, and implied doubling time between two values.',
    icon: '📊',
    category: 'finance',
    subcategory: 'investments',
    tags: [
      'cagr',
      'compound annual growth rate',
      'annualized return',
      'growth rate',
      'investment return',
      'doubling time',
    ],
    inputs: [
      {
        id: 'beginningValue',
        label: 'Beginning Value ($)',
        type: 'number',
        min: 0.01,
        defaultValue: 10000,
        placeholder: 'e.g. 10000',
        required: true,
      },
      {
        id: 'endingValue',
        label: 'Ending Value ($)',
        type: 'number',
        min: 0.01,
        defaultValue: 25000,
        placeholder: 'e.g. 25000',
        required: true,
      },
      {
        id: 'years',
        label: 'Time Period',
        type: 'number',
        min: 0.01,
        defaultValue: 5,
        placeholder: 'e.g. 5',
        required: true,
        units: [
          { label: 'Years', value: 'years', conversionFactor: '1' },
          { label: 'Months', value: 'months', conversionFactor: '0.08333333333333333333' },
        ],
      },
    ],
    formulas: [
      {
        id: 'safeYears',
        expression: 'years > 0 ? years : 1',
        dependencies: ['years'],
      },
      {
        id: 'multiple',
        expression: 'beginningValue > 0 ? endingValue / beginningValue : 0',
        dependencies: ['beginningValue', 'endingValue'],
      },
      {
        id: 'cagrDec',
        expression: 'multiple > 0 ? pow(multiple, 1 / safeYears) - 1 : 0',
        dependencies: ['multiple', 'safeYears'],
      },
      {
        id: 'cagrPct',
        expression: 'cagrDec * 100',
        dependencies: ['cagrDec'],
      },
      {
        id: 'totalGain',
        expression: 'endingValue - beginningValue',
        dependencies: ['endingValue', 'beginningValue'],
      },
      {
        id: 'totalGrowthPct',
        expression: 'beginningValue > 0 ? (totalGain / beginningValue) * 100 : 0',
        dependencies: ['totalGain', 'beginningValue'],
      },
      {
        id: 'doublingYears',
        expression: 'cagrDec > 0 ? ln(2) / ln(1 + cagrDec) : 0',
        dependencies: ['cagrDec'],
      },
    ],
    outputs: [
      {
        id: 'out-cagr',
        label: 'CAGR (Annualized)',
        formulaRef: 'cagrPct',
        format: 'percentage',
        precision: 2,
        highlight: true,
      },
      {
        id: 'out-gain',
        label: 'Total Absolute Gain',
        formulaRef: 'totalGain',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'out-growth-pct',
        label: 'Total Cumulative Growth',
        formulaRef: 'totalGrowthPct',
        format: 'percentage',
        precision: 2,
      },
      {
        id: 'out-multiple',
        label: 'Growth Multiple',
        formulaRef: 'multiple',
        format: 'number',
        precision: 2,
        suffix: '×',
      },
      {
        id: 'out-doubling',
        label: 'Implied Doubling Time',
        formulaRef: 'doublingYears',
        format: 'number',
        precision: 1,
        suffix: ' yrs',
      },
    ],
    guide: {
      whatIsIt:
        'Compound Annual Growth Rate (CAGR) is the constant annual rate at which an investment, revenue metric, or portfolio would have grown from its starting balance to its ending balance.',
      howToUse:
        'Enter the starting value, ending value, and holding duration (in Years or Months). Quantify computes exact geometric CAGR along with total gain, multiple, and doubling time.',
      exampleScenario:
        'An investment growing from $10,000 to $25,000 over 5 years achieves a 20.11% CAGR (a 2.50× multiple and an implied doubling time of 3.8 years).',
      proTip:
        'CAGR smooths out volatility, making it ideal for comparing investments across different time spans—though it does not show interim drawdowns.',
    },
    metadata: { version: '1.0.0' },
  },

  // 4. Future Value (FV) Calculator
  {
    id: 'future-value-calculator',
    slug: 'future-value-calculator',
    title: 'Future Value (FV) Calculator',
    description:
      'Calculate Time Value of Money (TVM) Future Value from a starting balance and periodic deposits—supporting both ordinary annuities and annuities due.',
    icon: '🚀',
    category: 'finance',
    subcategory: 'investments',
    tags: [
      'future value',
      'fv',
      'tvm',
      'time value of money',
      'annuity due',
      'ordinary annuity',
      'savings projection',
    ],
    inputs: [
      {
        id: 'presentValue',
        label: 'Starting Present Value ($)',
        type: 'number',
        min: 0,
        defaultValue: 10000,
        placeholder: 'e.g. 10000',
        required: true,
      },
      {
        id: 'periodicPayment',
        label: 'Periodic Deposit ($ / period)',
        type: 'number',
        min: 0,
        defaultValue: 300,
        placeholder: 'e.g. 300',
      },
      {
        id: 'annualRate',
        label: 'Annual Interest Rate (%)',
        type: 'number',
        min: 0,
        max: 100,
        step: 0.05,
        defaultValue: 7,
        placeholder: 'e.g. 7',
        required: true,
      },
      {
        id: 'compoundingFrequency',
        label: 'Periods per Year',
        type: 'select',
        options: [
          { label: 'Monthly (12)', value: '12' },
          { label: 'Quarterly (4)', value: '4' },
          { label: 'Semi-Annually (2)', value: '2' },
          { label: 'Annually (1)', value: '1' },
          { label: 'Weekly (52)', value: '52' },
        ],
        allowCustom: true,
        min: 1,
        max: 10000,
        step: 1,
        customLabel: 'Custom periods per year',
        customPlaceholder: 'e.g. 26',
        defaultValue: '12',
        required: true,
      },
      {
        id: 'paymentTiming',
        label: 'Deposit Timing',
        type: 'select',
        options: [
          { label: 'End of Period (Ordinary Annuity)', value: '0' },
          { label: 'Beginning of Period (Annuity Due)', value: '1' },
        ],
        defaultValue: '0',
        required: true,
      },
      {
        id: 'years',
        label: 'Time Period',
        type: 'number',
        min: 0,
        defaultValue: 10,
        placeholder: 'e.g. 10',
        required: true,
        units: [
          { label: 'Years', value: 'years', conversionFactor: '1' },
          { label: 'Months', value: 'months', conversionFactor: '0.08333333333333333333' },
        ],
      },
    ],
    formulas: [
      {
        id: 'freq',
        expression: 'compoundingFrequency > 0 ? compoundingFrequency : 12',
        dependencies: ['compoundingFrequency'],
      },
      {
        id: 'r',
        expression: 'annualRate / 100 / freq',
        dependencies: ['annualRate', 'freq'],
      },
      {
        id: 'n',
        expression: 'freq * years',
        dependencies: ['freq', 'years'],
      },
      {
        id: 'dueFactor',
        expression: 'paymentTiming == 1 ? 1 + r : 1',
        dependencies: ['paymentTiming', 'r'],
      },
      {
        id: 'fvPV',
        expression: 'presentValue * pow(1 + r, n)',
        dependencies: ['presentValue', 'r', 'n'],
      },
      {
        id: 'fvPMT',
        expression:
          'r != 0 ? periodicPayment * ((pow(1 + r, n) - 1) / r) * dueFactor : periodicPayment * n',
        dependencies: ['periodicPayment', 'r', 'n', 'dueFactor'],
      },
      {
        id: 'futureValue',
        expression: 'fvPV + fvPMT',
        dependencies: ['fvPV', 'fvPMT'],
      },
      {
        id: 'totalDeposited',
        expression: 'presentValue + periodicPayment * n',
        dependencies: ['presentValue', 'periodicPayment', 'n'],
      },
      {
        id: 'totalInterest',
        expression: 'futureValue - totalDeposited',
        dependencies: ['futureValue', 'totalDeposited'],
      },
    ],
    outputs: [
      {
        id: 'out-fv',
        label: 'Future Value (FV)',
        formulaRef: 'futureValue',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
      {
        id: 'out-deposited',
        label: 'Total Principal & Deposits',
        formulaRef: 'totalDeposited',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'out-interest',
        label: 'Total Interest Earned',
        formulaRef: 'totalInterest',
        format: 'currency',
        precision: 2,
      },
    ],
    guide: {
      whatIsIt:
        'Future Value (FV) projects how much a starting balance plus recurring deposits will be worth at a future date under a given rate of return and deposit timing.',
      howToUse:
        'Enter your Present Value, deposit per period, annual rate, periods per year, whether deposits happen at the beginning or end of each period, and duration in Years or Months.',
      exampleScenario:
        '$10,000 plus $300 deposited at the end of every month at 7% for 10 years grows to $72,022.05. Shifting deposits to the beginning of each month (Annuity Due) adds an extra compounding period on every deposit.',
      proTip:
        'Because Annuity Due deposits start compounding immediately on Day 1 of each period, they always produce a slightly higher Future Value than end-of-period deposits.',
    },
    metadata: { version: '1.0.0' },
  },

  // 5. Portfolio Rebalancing Calculator
  {
    id: 'portfolio-rebalancing-calculator',
    slug: 'portfolio-rebalancing-calculator',
    title: 'Portfolio Rebalancing Calculator',
    description:
      'Compute exact buy and sell dollar amounts across Equities, Bonds, and Cash/Alternatives—with optional new cash to rebalance without triggering unnecessary sales.',
    icon: '⚖️',
    category: 'finance',
    subcategory: 'investments',
    tags: [
      'portfolio rebalancing',
      'rebalance',
      'asset allocation',
      'equities',
      'bonds',
      'portfolio management',
      'drift',
    ],
    inputs: [
      {
        id: 'equitiesValue',
        label: 'Current Equities / Stocks ($)',
        type: 'number',
        min: 0,
        defaultValue: 68000,
        placeholder: 'e.g. 68000',
        required: true,
      },
      {
        id: 'bondsValue',
        label: 'Current Bonds / Fixed Income ($)',
        type: 'number',
        min: 0,
        defaultValue: 22000,
        placeholder: 'e.g. 22000',
        required: true,
      },
      {
        id: 'cashValue',
        label: 'Current Cash / Alternatives ($)',
        type: 'number',
        min: 0,
        defaultValue: 10000,
        placeholder: 'e.g. 10000',
        required: true,
      },
      {
        id: 'newCash',
        label: 'New Cash Contribution ($)',
        type: 'number',
        min: 0,
        defaultValue: 5000,
        placeholder: 'e.g. 5000',
        helpText: 'Optional new cash added during rebalancing to direct toward underweight sleeves.',
      },
      {
        id: 'targetEquitiesPct',
        label: 'Target Equities (%)',
        type: 'number',
        min: 0,
        max: 100,
        step: 1,
        defaultValue: 60,
        required: true,
      },
      {
        id: 'targetBondsPct',
        label: 'Target Bonds (%)',
        type: 'number',
        min: 0,
        max: 100,
        step: 1,
        defaultValue: 30,
        required: true,
      },
      {
        id: 'targetCashPct',
        label: 'Target Cash / Alternatives (%)',
        type: 'number',
        min: 0,
        max: 100,
        step: 1,
        defaultValue: 10,
        required: true,
      },
    ],
    formulas: [
      {
        id: 'targetSumPct',
        expression: 'targetEquitiesPct + targetBondsPct + targetCashPct',
        dependencies: ['targetEquitiesPct', 'targetBondsPct', 'targetCashPct'],
      },
      {
        id: 'norm',
        expression: 'targetSumPct > 0 ? targetSumPct : 100',
        dependencies: ['targetSumPct'],
      },
      {
        id: 'totalAfterCash',
        expression: 'equitiesValue + bondsValue + cashValue + newCash',
        dependencies: ['equitiesValue', 'bondsValue', 'cashValue', 'newCash'],
      },
      {
        id: 'targetEquitiesVal',
        expression: 'totalAfterCash * (targetEquitiesPct / norm)',
        dependencies: ['totalAfterCash', 'targetEquitiesPct', 'norm'],
      },
      {
        id: 'targetBondsVal',
        expression: 'totalAfterCash * (targetBondsPct / norm)',
        dependencies: ['totalAfterCash', 'targetBondsPct', 'norm'],
      },
      {
        id: 'targetCashVal',
        expression: 'totalAfterCash * (targetCashPct / norm)',
        dependencies: ['totalAfterCash', 'targetCashPct', 'norm'],
      },
      {
        id: 'equitiesTrade',
        expression: 'targetEquitiesVal - equitiesValue',
        dependencies: ['targetEquitiesVal', 'equitiesValue'],
      },
      {
        id: 'bondsTrade',
        expression: 'targetBondsVal - bondsValue',
        dependencies: ['targetBondsVal', 'bondsValue'],
      },
      {
        id: 'cashTrade',
        expression: 'targetCashVal - cashValue',
        dependencies: ['targetCashVal', 'cashValue'],
      },
    ],
    outputs: [
      {
        id: 'out-total',
        label: 'Total Portfolio (After Cash)',
        formulaRef: 'totalAfterCash',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
      {
        id: 'out-eq-trade',
        label: 'Equities: Buy (+) / Sell (−)',
        formulaRef: 'equitiesTrade',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'out-bond-trade',
        label: 'Bonds: Buy (+) / Sell (−)',
        formulaRef: 'bondsTrade',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'out-cash-trade',
        label: 'Cash / Alt: Buy (+) / Sell (−)',
        formulaRef: 'cashTrade',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'out-target-sum',
        label: 'Target Weights Sum',
        formulaRef: 'targetSumPct',
        format: 'percentage',
        precision: 1,
      },
    ],
    guide: {
      whatIsIt:
        'Portfolio rebalancing brings drifted asset weights back in line with your target risk profile. Positive trade values indicate amounts to buy; negative values indicate amounts to trim.',
      howToUse:
        'Enter current market values for Equities, Bonds, and Cash/Alternatives, any new cash you are contributing, and your target allocation percentages (ideally summing to 100%).',
      exampleScenario:
        'A $100,000 portfolio that drifted to $68k Equities / $22k Bonds / $10k Cash with $5,000 of new cash and a 60/30/10 target requires selling $5,000 Equities, buying $9,500 Bonds, and adding $500 to Cash.',
      proTip:
        'In taxable brokerage accounts, directing new contributions and dividends into underweight sleeves reduces capital gains tax compared to selling appreciated winners.',
    },
    metadata: { version: '1.0.0' },
  },

  // 6. DRIP Calculator (Dividend Reinvestment Plan)
  {
    id: 'drip-calculator',
    slug: 'drip-calculator',
    title: 'DRIP Calculator (Dividend Reinvestment)',
    description:
      'Compare ending portfolio value with dividends automatically reinvested (DRIP) versus taken as cash, factoring in dividend tax, dividend growth, and share appreciation.',
    icon: '💧',
    category: 'finance',
    subcategory: 'dividends',
    tags: [
      'drip',
      'dividend reinvestment',
      'dividend growth',
      'yield on cost',
      'income investing',
      'compounding dividends',
    ],
    inputs: [
      {
        id: 'initialInvestment',
        label: 'Initial Investment ($)',
        type: 'number',
        min: 0,
        defaultValue: 25000,
        placeholder: 'e.g. 25000',
        required: true,
      },
      {
        id: 'annualContribution',
        label: 'Annual Contribution ($ / yr)',
        type: 'number',
        min: 0,
        defaultValue: 3000,
        placeholder: 'e.g. 3000',
      },
      {
        id: 'dividendYield',
        label: 'Starting Dividend Yield (%)',
        type: 'number',
        min: 0,
        max: 25,
        step: 0.1,
        defaultValue: 4,
        required: true,
      },
      {
        id: 'dividendGrowth',
        label: 'Annual Dividend Growth (%)',
        type: 'number',
        min: 0,
        max: 25,
        step: 0.1,
        defaultValue: 5,
      },
      {
        id: 'shareAppreciation',
        label: 'Annual Share Price Growth (%)',
        type: 'number',
        min: -10,
        max: 30,
        step: 0.1,
        defaultValue: 4,
      },
      {
        id: 'dividendTaxRate',
        label: 'Dividend Tax Rate (%)',
        type: 'number',
        min: 0,
        max: 50,
        step: 1,
        defaultValue: 15,
        helpText: 'Set to 0% for tax-advantaged accounts (Roth IRA, ISA, etc.).',
      },
      {
        id: 'years',
        label: 'Holding Period',
        type: 'number',
        min: 1,
        defaultValue: 15,
        required: true,
        units: [
          { label: 'Years', value: 'years', conversionFactor: '1' },
          { label: 'Months', value: 'months', conversionFactor: '0.08333333333333333333' },
        ],
      },
    ],
    formulas: [
      {
        id: 'netYield',
        expression: '(dividendYield / 100) * (1 - dividendTaxRate / 100)',
        dependencies: ['dividendYield', 'dividendTaxRate'],
      },
      {
        id: 'g',
        expression: 'shareAppreciation / 100',
        dependencies: ['shareAppreciation'],
      },
      {
        id: 'rDrip',
        expression: '(1 + g) * (1 + netYield) - 1',
        dependencies: ['g', 'netYield'],
      },
      {
        id: 'fvDrip',
        expression:
          'rDrip != 0 ? initialInvestment * pow(1 + rDrip, years) + annualContribution * ((pow(1 + rDrip, years) - 1) / rDrip) : initialInvestment + annualContribution * years',
        dependencies: ['initialInvestment', 'annualContribution', 'rDrip', 'years'],
      },
      {
        id: 'fvNoDripEquity',
        expression:
          'g != 0 ? initialInvestment * pow(1 + g, years) + annualContribution * ((pow(1 + g, years) - 1) / g) : initialInvestment + annualContribution * years',
        dependencies: ['initialInvestment', 'annualContribution', 'g', 'years'],
      },
      {
        id: 'cashDivsNoDrip',
        expression: '((initialInvestment + fvNoDripEquity) / 2) * netYield * years',
        dependencies: ['initialInvestment', 'fvNoDripEquity', 'netYield', 'years'],
      },
      {
        id: 'fvNoDripTotal',
        expression: 'fvNoDripEquity + cashDivsNoDrip',
        dependencies: ['fvNoDripEquity', 'cashDivsNoDrip'],
      },
      {
        id: 'dripAdvantage',
        expression: 'fvDrip - fvNoDripTotal',
        dependencies: ['fvDrip', 'fvNoDripTotal'],
      },
      {
        id: 'yieldRatio',
        expression: 'pow((1 + dividendGrowth / 100) / max(0.01, 1 + g), min(years, 30))',
        dependencies: ['dividendGrowth', 'g', 'years'],
      },
      {
        id: 'projectedAnnualDiv',
        expression: 'fvDrip * (dividendYield / 100) * yieldRatio',
        dependencies: ['fvDrip', 'dividendYield', 'yieldRatio'],
      },
      {
        id: 'totalContributed',
        expression: 'initialInvestment + annualContribution * years',
        dependencies: ['initialInvestment', 'annualContribution', 'years'],
      },
      {
        id: 'yieldOnCostPct',
        expression: 'totalContributed > 0 ? (projectedAnnualDiv / totalContributed) * 100 : 0',
        dependencies: ['projectedAnnualDiv', 'totalContributed'],
      },
    ],
    outputs: [
      {
        id: 'out-fv-drip',
        label: 'Ending Value (With DRIP)',
        formulaRef: 'fvDrip',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
      {
        id: 'out-fv-nodrip',
        label: 'Ending Value (Cash Dividends)',
        formulaRef: 'fvNoDripTotal',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'out-advantage',
        label: 'DRIP Reinvestment Advantage',
        formulaRef: 'dripAdvantage',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'out-annual-div',
        label: 'Projected Annual Dividends',
        formulaRef: 'projectedAnnualDiv',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'out-yoc',
        label: 'Yield on Cost (Pre-Tax)',
        formulaRef: 'yieldOnCostPct',
        format: 'percentage',
        precision: 2,
      },
    ],
    guide: {
      whatIsIt:
        'A Dividend Reinvestment Plan (DRIP) automatically uses cash dividends to purchase additional shares, creating a compounding flywheel where new shares generate their own future dividends.',
      howToUse:
        'Enter your starting investment, annual additions, starting yield, dividend and share price growth rates, dividend tax rate (0% in tax-sheltered accounts), and holding horizon.',
      exampleScenario:
        '$25,000 plus $3,000/year at a 4% starting yield, 4% price growth, and 15% dividend tax over 15 years compounds meaningfully faster with DRIP enabled than taking cash payouts.',
      proTip:
        'Even in a DRIP, dividends in a taxable account are typically taxed in the year paid—compare 0% tax (tax-advantaged) vs. 15% tax side by side using A / B Compare.',
    },
    metadata: { version: '1.0.0' },
  },

  // 7. Passive Income Calculator
  {
    id: 'passive-income-calculator',
    slug: 'passive-income-calculator',
    title: 'Passive Income Calculator',
    description:
      'Determine the exact portfolio size required to fund a target monthly passive income after taxes, and track how much capital you still need.',
    icon: '🌴',
    category: 'finance',
    subcategory: 'fire',
    tags: [
      'passive income',
      'financial freedom',
      'dividend income',
      'monthly income',
      'portfolio yield',
      'fire',
    ],
    inputs: [
      {
        id: 'targetMonthlyIncome',
        label: 'Target Monthly Net Income ($)',
        type: 'number',
        min: 0,
        defaultValue: 4000,
        placeholder: 'e.g. 4000',
        required: true,
      },
      {
        id: 'portfolioYield',
        label: 'Expected Annual Yield / Withdrawal (%)',
        type: 'number',
        min: 0.1,
        max: 25,
        step: 0.1,
        defaultValue: 4.5,
        required: true,
      },
      {
        id: 'taxRate',
        label: 'Effective Tax Rate on Income (%)',
        type: 'number',
        min: 0,
        max: 60,
        step: 1,
        defaultValue: 15,
      },
      {
        id: 'currentPortfolio',
        label: 'Current Invested Portfolio ($)',
        type: 'number',
        min: 0,
        defaultValue: 150000,
        placeholder: 'e.g. 150000',
      },
    ],
    formulas: [
      {
        id: 'afterTaxFactor',
        expression: 'max(0.01, 1 - taxRate / 100)',
        dependencies: ['taxRate'],
      },
      {
        id: 'requiredGrossAnnual',
        expression: '(targetMonthlyIncome * 12) / afterTaxFactor',
        dependencies: ['targetMonthlyIncome', 'afterTaxFactor'],
      },
      {
        id: 'requiredPortfolio',
        expression: 'portfolioYield > 0 ? requiredGrossAnnual / (portfolioYield / 100) : 0',
        dependencies: ['requiredGrossAnnual', 'portfolioYield'],
      },
      {
        id: 'currentMonthlyNet',
        expression: '(currentPortfolio * (portfolioYield / 100) * afterTaxFactor) / 12',
        dependencies: ['currentPortfolio', 'portfolioYield', 'afterTaxFactor'],
      },
      {
        id: 'monthlyGap',
        expression: 'max(0, targetMonthlyIncome - currentMonthlyNet)',
        dependencies: ['targetMonthlyIncome', 'currentMonthlyNet'],
      },
      {
        id: 'capitalNeeded',
        expression: 'max(0, requiredPortfolio - currentPortfolio)',
        dependencies: ['requiredPortfolio', 'currentPortfolio'],
      },
      {
        id: 'progressPct',
        expression:
          'requiredPortfolio > 0 ? min(100, (currentPortfolio / requiredPortfolio) * 100) : 0',
        dependencies: ['currentPortfolio', 'requiredPortfolio'],
      },
    ],
    outputs: [
      {
        id: 'out-required-portfolio',
        label: 'Required Portfolio Size',
        formulaRef: 'requiredPortfolio',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
      {
        id: 'out-current-monthly',
        label: 'Current Monthly Net Income',
        formulaRef: 'currentMonthlyNet',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'out-monthly-gap',
        label: 'Monthly Income Gap',
        formulaRef: 'monthlyGap',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'out-capital-needed',
        label: 'Additional Capital Needed',
        formulaRef: 'capitalNeeded',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'out-progress',
        label: 'Goal Progress',
        formulaRef: 'progressPct',
        format: 'percentage',
        precision: 1,
      },
    ],
    guide: {
      whatIsIt:
        'Calculates the invested capital required to generate a specific after-tax monthly income stream from dividends, bond interest, REITs, or a sustainable portfolio withdrawal rate.',
      howToUse:
        'Enter your desired monthly take-home income, your portfolio’s expected yield or withdrawal rate, your estimated tax rate on that income, and your current invested balance.',
      exampleScenario:
        'Generating $4,000/month net at a 4.5% yield and 15% effective tax rate requires $56,471/year pre-tax—a target portfolio of $1,254,901.96.',
      proTip:
        'Be cautious of chasing unusually high yields (> 7–8%), which can signal elevated risk or return-of-capital erosion. Pair this with the Investment Goal Calculator in Workbooks to find your required monthly savings.',
    },
    metadata: { version: '1.0.0' },
  },

  // 8. Rental Property ROI & Cash-on-Cash Calculator
  {
    id: 'rental-property-roi',
    slug: 'rental-property-roi',
    title: 'Rental Property ROI & Cash-on-Cash Calculator',
    description:
      'Analyze leveraged rental real estate returns: Cash-on-Cash ROI, monthly & annual net cash flow, Cap Rate, mortgage payment, and total cash invested.',
    icon: '🏘️',
    category: 'finance',
    subcategory: 'real-estate',
    tags: [
      'rental property',
      'cash on cash',
      'real estate roi',
      'cap rate',
      'cash flow',
      'landlord',
      'noi',
      'investment property',
    ],
    inputs: [
      {
        id: 'purchasePrice',
        label: 'Property Purchase Price ($)',
        type: 'number',
        min: 1000,
        defaultValue: 350000,
        required: true,
      },
      {
        id: 'downPaymentPct',
        label: 'Down Payment (%)',
        type: 'number',
        min: 0,
        max: 100,
        step: 1,
        defaultValue: 20,
        required: true,
      },
      {
        id: 'closingAndRehab',
        label: 'Closing & Initial Rehab Costs ($)',
        type: 'number',
        min: 0,
        defaultValue: 12000,
      },
      {
        id: 'mortgageRate',
        label: 'Mortgage Interest Rate (%)',
        type: 'number',
        min: 0,
        max: 25,
        step: 0.05,
        defaultValue: 6.5,
      },
      {
        id: 'loanTermYears',
        label: 'Loan Term (years)',
        type: 'number',
        min: 1,
        max: 40,
        step: 1,
        defaultValue: 30,
      },
      {
        id: 'monthlyRent',
        label: 'Gross Monthly Rent ($)',
        type: 'number',
        min: 0,
        defaultValue: 2800,
        required: true,
      },
      {
        id: 'vacancyRatePct',
        label: 'Vacancy Allowance (%)',
        type: 'number',
        min: 0,
        max: 50,
        step: 0.5,
        defaultValue: 5,
      },
      {
        id: 'monthlyOperatingExpenses',
        label: 'Monthly Operating Expenses ($)',
        type: 'number',
        min: 0,
        defaultValue: 650,
        helpText: 'Property taxes, insurance, HOA, maintenance reserve, and property management.',
      },
    ],
    formulas: [
      {
        id: 'downPayment',
        expression: 'purchasePrice * (downPaymentPct / 100)',
        dependencies: ['purchasePrice', 'downPaymentPct'],
      },
      {
        id: 'totalCashInvested',
        expression: 'downPayment + closingAndRehab',
        dependencies: ['downPayment', 'closingAndRehab'],
      },
      {
        id: 'loanAmount',
        expression: 'max(0, purchasePrice - downPayment)',
        dependencies: ['purchasePrice', 'downPayment'],
      },
      {
        id: 'mRate',
        expression: 'mortgageRate / 100 / 12',
        dependencies: ['mortgageRate'],
      },
      {
        id: 'nMonths',
        expression: 'loanTermYears * 12',
        dependencies: ['loanTermYears'],
      },
      {
        id: 'monthlyMortgage',
        expression:
          'loanAmount > 0 ? (nMonths > 0 ? (mRate > 0 ? loanAmount * (mRate * pow(1 + mRate, nMonths)) / (pow(1 + mRate, nMonths) - 1) : loanAmount / nMonths) : 0) : 0',
        dependencies: ['loanAmount', 'nMonths', 'mRate'],
      },
      {
        id: 'effectiveAnnualRent',
        expression: 'monthlyRent * 12 * (1 - vacancyRatePct / 100)',
        dependencies: ['monthlyRent', 'vacancyRatePct'],
      },
      {
        id: 'annualNOI',
        expression: 'effectiveAnnualRent - monthlyOperatingExpenses * 12',
        dependencies: ['effectiveAnnualRent', 'monthlyOperatingExpenses'],
      },
      {
        id: 'annualCashFlow',
        expression: 'annualNOI - monthlyMortgage * 12',
        dependencies: ['annualNOI', 'monthlyMortgage'],
      },
      {
        id: 'monthlyCashFlow',
        expression: 'annualCashFlow / 12',
        dependencies: ['annualCashFlow'],
      },
      {
        id: 'cashOnCashPct',
        expression: 'totalCashInvested > 0 ? (annualCashFlow / totalCashInvested) * 100 : 0',
        dependencies: ['annualCashFlow', 'totalCashInvested'],
      },
      {
        id: 'capRatePct',
        expression: 'purchasePrice > 0 ? (annualNOI / purchasePrice) * 100 : 0',
        dependencies: ['annualNOI', 'purchasePrice'],
      },
    ],
    outputs: [
      {
        id: 'out-coc',
        label: 'Cash-on-Cash Return',
        formulaRef: 'cashOnCashPct',
        format: 'percentage',
        precision: 2,
        highlight: true,
      },
      {
        id: 'out-monthly-cf',
        label: 'Monthly Net Cash Flow',
        formulaRef: 'monthlyCashFlow',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'out-annual-cf',
        label: 'Annual Net Cash Flow',
        formulaRef: 'annualCashFlow',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'out-cap-rate',
        label: 'Cap Rate (Unlevered)',
        formulaRef: 'capRatePct',
        format: 'percentage',
        precision: 2,
      },
      {
        id: 'out-mortgage',
        label: 'Monthly Mortgage (P&I)',
        formulaRef: 'monthlyMortgage',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'out-cash-in',
        label: 'Total Cash Invested',
        formulaRef: 'totalCashInvested',
        format: 'currency',
        precision: 2,
      },
    ],
    guide: {
      whatIsIt:
        'Evaluates a leveraged rental property by comparing annual net cash flow after mortgage debt service against your actual out-of-pocket cash invested (down payment + closing + rehab).',
      howToUse:
        'Enter purchase price, down payment, upfront closing/rehab costs, loan rate and term, gross monthly rent, vacancy allowance, and recurring monthly operating expenses.',
      exampleScenario:
        'A $350,000 property with 20% down ($70k) plus $12k closing costs ($82k total cash), $2,800/mo rent (5% vacancy), $650/mo operating expenses, and a 6.5% 30-year mortgage generates a 6.89% Cap Rate and positive monthly cash flow.',
      proTip:
        'Cash-on-Cash Return measures cash yield only—it does not include principal paydown, property appreciation, or depreciation tax benefits, which further affect total equity IRR.',
    },
    metadata: { version: '1.0.0' },
  },

  // 9. Sharpe Ratio Calculator
  {
    id: 'sharpe-ratio-calculator',
    slug: 'sharpe-ratio-calculator',
    title: 'Sharpe Ratio Calculator',
    description:
      'Measure risk-adjusted investment performance by comparing excess return above the risk-free rate per unit of portfolio volatility.',
    icon: '📐',
    category: 'finance',
    subcategory: 'investments',
    tags: [
      'sharpe ratio',
      'risk adjusted return',
      'volatility',
      'standard deviation',
      'risk free rate',
      'portfolio analytics',
    ],
    inputs: [
      {
        id: 'portfolioReturn',
        label: 'Expected / Annualized Return (%)',
        type: 'number',
        min: -100,
        max: 200,
        step: 0.1,
        defaultValue: 11.5,
        required: true,
      },
      {
        id: 'riskFreeRate',
        label: 'Risk-Free Rate (%)',
        type: 'number',
        min: 0,
        max: 30,
        step: 0.1,
        defaultValue: 4.2,
        helpText: 'Typically the yield on 3-month or 10-year government Treasury bills.',
        required: true,
      },
      {
        id: 'portfolioVolatility',
        label: 'Portfolio Standard Deviation / Volatility (%)',
        type: 'number',
        min: 0.01,
        max: 200,
        step: 0.1,
        defaultValue: 14,
        required: true,
      },
    ],
    formulas: [
      {
        id: 'excessReturn',
        expression: 'portfolioReturn - riskFreeRate',
        dependencies: ['portfolioReturn', 'riskFreeRate'],
      },
      {
        id: 'sharpeRatio',
        expression: 'portfolioVolatility > 0 ? excessReturn / portfolioVolatility : 0',
        dependencies: ['excessReturn', 'portfolioVolatility'],
      },
      {
        id: 'returnToRisk',
        expression: 'portfolioVolatility > 0 ? portfolioReturn / portfolioVolatility : 0',
        dependencies: ['portfolioReturn', 'portfolioVolatility'],
      },
    ],
    outputs: [
      {
        id: 'out-sharpe',
        label: 'Sharpe Ratio',
        formulaRef: 'sharpeRatio',
        format: 'number',
        precision: 2,
        highlight: true,
      },
      {
        id: 'out-excess',
        label: 'Excess Return (vs. Risk-Free)',
        formulaRef: 'excessReturn',
        format: 'percentage',
        precision: 2,
      },
      {
        id: 'out-rtr',
        label: 'Raw Return-to-Risk Ratio',
        formulaRef: 'returnToRisk',
        format: 'number',
        precision: 2,
      },
    ],
    guide: {
      whatIsIt:
        'Developed by Nobel laureate William F. Sharpe, the Sharpe Ratio evaluates whether a portfolio’s returns come from smart asset allocation or simply taking on excessive volatility.',
      howToUse:
        'Enter the portfolio’s annualized return, the prevailing risk-free Treasury yield, and the portfolio’s annualized standard deviation (volatility).',
      exampleScenario:
        'A portfolio returning 11.5% with 14% volatility against a 4.2% risk-free rate yields an excess return of 7.3% and a Sharpe Ratio of 0.52.',
      proTip:
        'As a general rule of thumb, a Sharpe Ratio above 1.0 is considered good, above 2.0 very strong, and below 0 means the portfolio underperformed risk-free Treasury bills.',
    },
    metadata: { version: '1.0.0' },
  },

  // 10. Lump Sum vs. DCA Comparison Calculator
  {
    id: 'lump-sum-vs-dca',
    slug: 'lump-sum-vs-dca',
    title: 'Lump Sum vs. DCA Comparison Calculator',
    description:
      'Compare investing a windfall immediately as a lump sum versus phasing it in over N months while earning cash yield on uninvested funds.',
    icon: '⚡',
    category: 'finance',
    subcategory: 'investments',
    tags: [
      'lump sum vs dca',
      'windfall',
      'dollar cost averaging',
      'opportunity cost',
      'cash drag',
      'investment strategy',
    ],
    inputs: [
      {
        id: 'windfallAmount',
        label: 'Total Amount to Invest ($)',
        type: 'number',
        min: 1,
        defaultValue: 60000,
        required: true,
      },
      {
        id: 'dcaMonths',
        label: 'DCA Phase-In Window (months)',
        type: 'number',
        min: 2,
        max: 120,
        step: 1,
        defaultValue: 12,
        required: true,
      },
      {
        id: 'marketAnnualReturn',
        label: 'Expected Market Return (%)',
        type: 'number',
        min: -30,
        max: 50,
        step: 0.1,
        defaultValue: 8,
        required: true,
      },
      {
        id: 'cashYieldAnnual',
        label: 'Yield on Uninvested Cash (%)',
        type: 'number',
        min: 0,
        max: 20,
        step: 0.1,
        defaultValue: 4,
        helpText: 'Money-market or high-yield savings interest earned while phasing in.',
      },
      {
        id: 'totalHorizonYears',
        label: 'Total Evaluation Horizon (years)',
        type: 'number',
        min: 1,
        max: 50,
        step: 1,
        defaultValue: 10,
        required: true,
      },
    ],
    formulas: [
      {
        id: 'rMkt',
        expression: 'marketAnnualReturn / 100 / 12',
        dependencies: ['marketAnnualReturn'],
      },
      {
        id: 'rCash',
        expression: 'cashYieldAnnual / 100 / 12',
        dependencies: ['cashYieldAnnual'],
      },
      {
        id: 'totalMonths',
        expression: 'totalHorizonYears * 12',
        dependencies: ['totalHorizonYears'],
      },
      {
        id: 'phaseMonths',
        expression: 'min(max(1, dcaMonths), max(1, totalMonths))',
        dependencies: ['dcaMonths', 'totalMonths'],
      },
      {
        id: 'remMonths',
        expression: 'max(0, totalMonths - phaseMonths)',
        dependencies: ['totalMonths', 'phaseMonths'],
      },
      {
        id: 'lumpSumFV',
        expression: 'windfallAmount * pow(1 + rMkt, totalMonths)',
        dependencies: ['windfallAmount', 'rMkt', 'totalMonths'],
      },
      {
        id: 'slice',
        expression: 'windfallAmount / phaseMonths',
        dependencies: ['windfallAmount', 'phaseMonths'],
      },
      {
        id: 'dcaEndPhase',
        expression:
          'rMkt != 0 ? slice * ((pow(1 + rMkt, phaseMonths) - 1) / rMkt) : windfallAmount',
        dependencies: ['slice', 'rMkt', 'phaseMonths', 'windfallAmount'],
      },
      {
        id: 'cashInterest',
        expression: 'windfallAmount * ((phaseMonths - 1) / 2) * rCash',
        dependencies: ['windfallAmount', 'phaseMonths', 'rCash'],
      },
      {
        id: 'dcaFV',
        expression: '(dcaEndPhase + cashInterest) * pow(1 + rMkt, remMonths)',
        dependencies: ['dcaEndPhase', 'cashInterest', 'rMkt', 'remMonths'],
      },
      {
        id: 'lumpSumAdvantage',
        expression: 'lumpSumFV - dcaFV',
        dependencies: ['lumpSumFV', 'dcaFV'],
      },
      {
        id: 'advantagePct',
        expression: 'dcaFV > 0 ? (lumpSumAdvantage / dcaFV) * 100 : 0',
        dependencies: ['lumpSumAdvantage', 'dcaFV'],
      },
    ],
    outputs: [
      {
        id: 'out-lump-fv',
        label: 'Lump Sum Ending Value',
        formulaRef: 'lumpSumFV',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
      {
        id: 'out-dca-fv',
        label: 'Phased DCA Ending Value',
        formulaRef: 'dcaFV',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'out-adv',
        label: 'Lump Sum Advantage',
        formulaRef: 'lumpSumAdvantage',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'out-adv-pct',
        label: 'Relative Difference',
        formulaRef: 'advantagePct',
        format: 'percentage',
        precision: 2,
      },
    ],
    guide: {
      whatIsIt:
        'Quantifies the expected cash-drag cost of phasing a lump sum into the market gradually versus investing it all on Day 1, accounting for interest earned on idle cash during the phase-in period.',
      howToUse:
        'Enter your windfall amount, how many months you would spread DCA across, expected market return, cash/money-market yield, and total holding horizon.',
      exampleScenario:
        'Investing $60,000 today at 8% for 10 years grows to $133,178 versus $130,305 when phased over 12 months with 4% cash yield—showing the exact expected cost of waiting for behavioral peace of mind.',
      proTip:
        'In rising markets, lump-sum investing wins mathematically ~68% of historical periods because capital spends more time invested; DCA primarily acts as regret insurance against an immediate downturn.',
    },
    metadata: { version: '1.0.0' },
  },

  // 11. Investment Goal & Monthly Savings Calculator
  {
    id: 'investment-goal-calculator',
    slug: 'investment-goal-calculator',
    title: 'Investment Goal Calculator',
    description:
      'Reverse-calculate the exact monthly investment required to reach a target wealth goal given your current savings, return rate, and deadline.',
    icon: '🎯',
    category: 'finance',
    subcategory: 'investments',
    tags: [
      'investment goal',
      'savings goal',
      'required monthly investment',
      'millionaire calculator',
      'wealth target',
      'financial planning',
    ],
    inputs: [
      {
        id: 'targetGoal',
        label: 'Target Portfolio Goal ($)',
        type: 'number',
        min: 1,
        defaultValue: 500000,
        required: true,
      },
      {
        id: 'currentSavings',
        label: 'Current Invested Savings ($)',
        type: 'number',
        min: 0,
        defaultValue: 25000,
      },
      {
        id: 'annualReturn',
        label: 'Expected Annual Return (%)',
        type: 'number',
        min: 0,
        max: 50,
        step: 0.1,
        defaultValue: 7.5,
        required: true,
      },
      {
        id: 'years',
        label: 'Time to Goal',
        type: 'number',
        min: 0.1,
        defaultValue: 15,
        required: true,
        units: [
          { label: 'Years', value: 'years', conversionFactor: '1' },
          { label: 'Months', value: 'months', conversionFactor: '0.08333333333333333333' },
        ],
      },
    ],
    formulas: [
      {
        id: 'r',
        expression: 'annualReturn / 100 / 12',
        dependencies: ['annualReturn'],
      },
      {
        id: 'n',
        expression: 'years * 12',
        dependencies: ['years'],
      },
      {
        id: 'fvCurrent',
        expression: 'currentSavings * pow(1 + r, n)',
        dependencies: ['currentSavings', 'r', 'n'],
      },
      {
        id: 'remainingToFund',
        expression: 'max(0, targetGoal - fvCurrent)',
        dependencies: ['targetGoal', 'fvCurrent'],
      },
      {
        id: 'requiredMonthly',
        expression:
          'n > 0 ? (r > 0 ? remainingToFund * r / (pow(1 + r, n) - 1) : remainingToFund / n) : 0',
        dependencies: ['remainingToFund', 'r', 'n'],
      },
      {
        id: 'totalNewContributions',
        expression: 'requiredMonthly * n',
        dependencies: ['requiredMonthly', 'n'],
      },
    ],
    outputs: [
      {
        id: 'out-req-monthly',
        label: 'Required Monthly Investment',
        formulaRef: 'requiredMonthly',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
      {
        id: 'out-fv-current',
        label: 'Future Value of Current Savings',
        formulaRef: 'fvCurrent',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'out-remaining',
        label: 'Remaining Goal to Fund',
        formulaRef: 'remainingToFund',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'out-total-new',
        label: 'Total New Contributions',
        formulaRef: 'totalNewContributions',
        format: 'currency',
        precision: 2,
      },
    ],
    guide: {
      whatIsIt:
        'Solves the inverse compounding problem: starting from your desired financial milestone, it works backward to compute the exact monthly contribution required to get there on schedule.',
      howToUse:
        'Enter your target goal, how much you already have invested, your realistic annual return rate, and your deadline in Years or Months.',
      exampleScenario:
        'To reach $500,000 in 15 years starting with $25,000 at 7.5% annual return, your current savings grow to $76,777 and you need to invest $1,278.41 per month.',
      proTip:
        'If your current savings already grow past your target goal on their own, Required Monthly Investment drops to $0—the exact definition of reaching Coast FIRE.',
    },
    metadata: { version: '1.0.0' },
  },

  // 12. Stock Position Sizing & Risk Calculator
  {
    id: 'position-sizing-calculator',
    slug: 'position-sizing-calculator',
    title: 'Stock Position Sizing & Risk Calculator',
    description:
      'Size equity or ETF positions based on account equity, maximum risk per trade, entry price, stop-loss level, and profit target.',
    icon: '🛡️',
    category: 'finance',
    subcategory: 'stocks',
    tags: [
      'position sizing',
      'risk management',
      'stop loss',
      'risk reward',
      'stock trading',
      'share count',
      'portfolio risk',
    ],
    inputs: [
      {
        id: 'accountSize',
        label: 'Total Portfolio / Account Size ($)',
        type: 'number',
        min: 1,
        defaultValue: 50000,
        required: true,
      },
      {
        id: 'riskPerTradePct',
        label: 'Max Risk per Position (%)',
        type: 'number',
        min: 0.05,
        max: 100,
        step: 0.25,
        defaultValue: 1.5,
        helpText: 'Disciplined risk models typically cap single-position risk at 0.5%–2% of equity.',
        required: true,
      },
      {
        id: 'entryPrice',
        label: 'Entry Price ($ / share)',
        type: 'number',
        min: 0.01,
        step: 0.01,
        defaultValue: 120,
        required: true,
      },
      {
        id: 'stopLossPrice',
        label: 'Stop-Loss Price ($ / share)',
        type: 'number',
        min: 0,
        step: 0.01,
        defaultValue: 112,
        required: true,
      },
      {
        id: 'targetPrice',
        label: 'Target Exit Price ($ / share)',
        type: 'number',
        min: 0,
        step: 0.01,
        defaultValue: 144,
      },
    ],
    formulas: [
      {
        id: 'maxDollarRisk',
        expression: 'accountSize * (riskPerTradePct / 100)',
        dependencies: ['accountSize', 'riskPerTradePct'],
      },
      {
        id: 'riskPerShare',
        expression: 'abs(entryPrice - stopLossPrice)',
        dependencies: ['entryPrice', 'stopLossPrice'],
      },
      {
        id: 'recommendedShares',
        expression: 'riskPerShare > 0 ? floor(maxDollarRisk / riskPerShare) : 0',
        dependencies: ['maxDollarRisk', 'riskPerShare'],
      },
      {
        id: 'positionValue',
        expression: 'recommendedShares * entryPrice',
        dependencies: ['recommendedShares', 'entryPrice'],
      },
      {
        id: 'portfolioAllocationPct',
        expression: 'accountSize > 0 ? (positionValue / accountSize) * 100 : 0',
        dependencies: ['positionValue', 'accountSize'],
      },
      {
        id: 'rewardPerShare',
        expression: 'abs(targetPrice - entryPrice)',
        dependencies: ['targetPrice', 'entryPrice'],
      },
      {
        id: 'riskRewardRatio',
        expression: 'riskPerShare > 0 ? rewardPerShare / riskPerShare : 0',
        dependencies: ['rewardPerShare', 'riskPerShare'],
      },
      {
        id: 'potentialProfit',
        expression: 'recommendedShares * rewardPerShare',
        dependencies: ['recommendedShares', 'rewardPerShare'],
      },
    ],
    outputs: [
      {
        id: 'out-pos-val',
        label: 'Recommended Position Size',
        formulaRef: 'positionValue',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
      {
        id: 'out-shares',
        label: 'Recommended Share Count',
        formulaRef: 'recommendedShares',
        format: 'number',
        precision: 0,
        suffix: ' shares',
      },
      {
        id: 'out-max-risk',
        label: 'Max Dollar Risk',
        formulaRef: 'maxDollarRisk',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'out-alloc',
        label: 'Portfolio Allocation',
        formulaRef: 'portfolioAllocationPct',
        format: 'percentage',
        precision: 1,
      },
      {
        id: 'out-rr',
        label: 'Risk / Reward Ratio',
        formulaRef: 'riskRewardRatio',
        format: 'number',
        precision: 2,
        prefix: '1 : ',
      },
      {
        id: 'out-profit',
        label: 'Potential Target Profit',
        formulaRef: 'potentialProfit',
        format: 'currency',
        precision: 2,
      },
    ],
    guide: {
      whatIsIt:
        'Calculates how many shares to buy so that if price hits your stop-loss, your loss stays strictly within your predefined percentage of account equity.',
      howToUse:
        'Enter your total account size, maximum percentage you are willing to risk on this idea, planned entry price, stop-loss level, and optional profit target.',
      exampleScenario:
        'On a $50,000 account risking 1.5% ($750 max risk) with a $120 entry and $112 stop ($8 risk/share), you buy 93 shares ($11,160 position, 22.3% allocation). At a $144 target, Reward/Risk is 1 : 3.00 ($2,232 profit).',
      proTip:
        'Always verify Portfolio Allocation alongside dollar risk—very tight stops can produce oversized positions that expose you to overnight gap risk beyond your stop price.',
    },
    metadata: { version: '1.0.0' },
  },
];
