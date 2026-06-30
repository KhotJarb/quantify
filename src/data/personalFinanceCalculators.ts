// ---------------------------------------------------------------------------
// Quantify — Personal Finance Calculators (17 calculators)
// ---------------------------------------------------------------------------

import type { CalculatorSchema } from '@/types/calculator';

export const personalFinanceCalculators: CalculatorSchema[] = [
  // =========================================================================
  // 1. Asset Allocation Calculator
  // =========================================================================
  {
    id: 'asset-allocation',
    slug: 'asset-allocation',
    title: 'Asset Allocation Calculator',
    description:
      'Determine the ideal mix of stocks and bonds in your portfolio based on age and risk tolerance.',
    icon: '📊',
    category: 'finance',
    subcategory: 'personal',
    tags: ['asset allocation', 'portfolio', 'stocks', 'bonds', 'risk'],
    inputs: [
      {
        id: 'totalPortfolio',
        label: 'Total Portfolio Value ($)',
        type: 'number',
        min: 0,
        defaultValue: 100000,
        placeholder: 'e.g. 500000',
        required: true,
      },
      {
        id: 'age',
        label: 'Your Age',
        type: 'number',
        min: 18,
        max: 100,
        step: 1,
        defaultValue: 35,
        placeholder: 'e.g. 35',
        required: true,
      },
      {
        id: 'riskTolerance',
        label: 'Risk Tolerance',
        type: 'select',
        options: [
          { label: 'Conservative', value: '0' },
          { label: 'Moderate', value: '1' },
          { label: 'Aggressive', value: '2' },
        ],
        defaultValue: '1',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'stockPercent',
        expression:
          'riskTolerance == 0 ? max(100 - age - 10, 20) : (riskTolerance == 1 ? max(100 - age, 30) : max(110 - age, 40))',
        dependencies: ['riskTolerance', 'age'],
      },
      {
        id: 'bondPercent',
        expression: '100 - stockPercent',
        dependencies: ['stockPercent'],
      },
      {
        id: 'stockAmount',
        expression: 'totalPortfolio * stockPercent / 100',
        dependencies: ['totalPortfolio', 'stockPercent'],
      },
      {
        id: 'bondAmount',
        expression: 'totalPortfolio * bondPercent / 100',
        dependencies: ['totalPortfolio', 'bondPercent'],
      },
    ],
    outputs: [
      {
        id: 'stock-percent',
        label: 'Stock Allocation',
        formulaRef: 'stockPercent',
        format: 'percentage',
        precision: 0,
        highlight: true,
      },
      {
        id: 'bond-percent',
        label: 'Bond Allocation',
        formulaRef: 'bondPercent',
        format: 'percentage',
        precision: 0,
      },
      {
        id: 'stock-amount',
        label: 'Amount in Stocks',
        formulaRef: 'stockAmount',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'bond-amount',
        label: 'Amount in Bonds',
        formulaRef: 'bondAmount',
        format: 'currency',
        precision: 2,
      },
    ],
    guide: {
      whatIsIt:
        'Asset allocation is the strategy of dividing your investment portfolio among different asset categories — primarily stocks (equities) and bonds (fixed income). The classic rule of thumb subtracts your age from 100 (or 110 for aggressive investors) to determine the percentage to hold in stocks.',
      howToUse:
        'Enter your total portfolio value and current age. Select your risk tolerance — Conservative shifts more toward bonds, Moderate follows the standard "100 minus age" rule, and Aggressive uses "110 minus age" for greater equity exposure. The calculator shows the recommended percentage split and dollar amounts.',
      exampleScenario:
        'A 40-year-old moderate investor with a $200,000 portfolio would get a 60% stock / 40% bond split — $120,000 in stocks and $80,000 in bonds. If they chose aggressive, it would shift to 70/30.',
      proTip:
        'These are starting guidelines, not gospel. Consider adding alternative assets (REITs, commodities) for diversification. Rebalance at least annually or when allocations drift more than 5% from targets.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 2. College Savings Calculator
  // =========================================================================
  {
    id: 'college-savings',
    slug: 'college-savings',
    title: 'College Savings Calculator',
    description:
      'Project your 529 or college savings growth and determine how much more you need to save each month to reach your goal.',
    icon: '🎓',
    category: 'finance',
    subcategory: 'savings',
    tags: ['college', 'savings', '529', 'education', 'tuition'],
    inputs: [
      {
        id: 'currentSavings',
        label: 'Current Savings ($)',
        type: 'number',
        min: 0,
        defaultValue: 10000,
        placeholder: 'e.g. 25000',
        required: true,
      },
      {
        id: 'monthlySavings',
        label: 'Monthly Contribution ($)',
        type: 'number',
        min: 0,
        defaultValue: 500,
        placeholder: 'e.g. 500',
        required: true,
      },
      {
        id: 'annualReturn',
        label: 'Expected Annual Return (%)',
        type: 'number',
        min: 0,
        max: 30,
        step: 0.1,
        defaultValue: 7,
        placeholder: 'e.g. 7',
        required: true,
      },
      {
        id: 'yearsUntilCollege',
        label: 'Years Until College',
        type: 'number',
        min: 1,
        max: 25,
        step: 1,
        defaultValue: 10,
        placeholder: 'e.g. 10',
        required: true,
      },
      {
        id: 'estimatedCost',
        label: 'Estimated Total College Cost ($)',
        type: 'number',
        min: 0,
        defaultValue: 120000,
        placeholder: 'e.g. 120000',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'monthlyRate',
        expression: 'annualReturn / 100 / 12',
        dependencies: ['annualReturn'],
      },
      {
        id: 'totalMonths',
        expression: 'yearsUntilCollege * 12',
        dependencies: ['yearsUntilCollege'],
      },
      {
        id: 'futureValue',
        expression: 'fv(monthlyRate, totalMonths, monthlySavings * -1, currentSavings * -1)',
        dependencies: ['monthlyRate', 'totalMonths', 'monthlySavings', 'currentSavings'],
      },
      {
        id: 'shortfall',
        expression: 'estimatedCost - futureValue',
        dependencies: ['estimatedCost', 'futureValue'],
      },
      {
        id: 'requiredMonthly',
        expression: 'abs(pmt(monthlyRate, totalMonths, currentSavings * -1, estimatedCost))',
        dependencies: ['monthlyRate', 'totalMonths', 'currentSavings', 'estimatedCost'],
      },
      {
        id: 'additionalNeeded',
        expression: 'requiredMonthly > monthlySavings ? requiredMonthly - monthlySavings : 0',
        dependencies: ['requiredMonthly', 'monthlySavings'],
      },
    ],
    outputs: [
      {
        id: 'projected-savings',
        label: 'Projected Savings at College',
        formulaRef: 'futureValue',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
      {
        id: 'shortfall-value',
        label: 'Shortfall (if positive)',
        formulaRef: 'shortfall',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'required-monthly',
        label: 'Total Monthly Needed',
        formulaRef: 'requiredMonthly',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'additional-needed',
        label: 'Additional Monthly Savings Needed',
        formulaRef: 'additionalNeeded',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
    ],
    guide: {
      whatIsIt:
        'The College Savings Calculator projects whether your current savings and monthly contributions will cover expected college costs. It uses compound growth to show your future balance and calculates how much extra you need to save each month to close any gap.',
      howToUse:
        'Enter your current college savings balance and monthly contribution amount. Set your expected annual investment return (6-8% is typical for diversified portfolios). Enter the number of years until your child starts college and the total estimated cost. The calculator shows projected savings, any shortfall, and additional monthly savings required.',
      exampleScenario:
        'You have $10,000 saved and contribute $500/month at a 7% annual return with 10 years to go. Your projected savings will be approximately $104,000. If college costs $120,000, you have a $16,000 shortfall and need roughly $94 more per month.',
      proTip:
        'Use a 529 plan for tax-advantaged college savings. College costs typically inflate at 5-7% annually — use the future cost, not today\'s tuition. Front-loading contributions early maximizes compounding.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 3. Mutual Fund Fee Calculator
  // =========================================================================
  {
    id: 'mutual-fund-fee',
    slug: 'mutual-fund-fee',
    title: 'Mutual Fund Fee Calculator',
    description:
      'See how expense ratios eat into your investment returns over time and quantify the true cost of fund fees.',
    icon: '💸',
    category: 'finance',
    subcategory: 'personal',
    tags: ['mutual fund', 'expense ratio', 'fees', 'investment', 'cost'],
    inputs: [
      {
        id: 'investmentAmount',
        label: 'Investment Amount ($)',
        type: 'number',
        min: 0,
        defaultValue: 100000,
        placeholder: 'e.g. 100000',
        required: true,
      },
      {
        id: 'annualReturn',
        label: 'Annual Return Before Fees (%)',
        type: 'number',
        min: 0,
        max: 50,
        step: 0.1,
        defaultValue: 8,
        placeholder: 'e.g. 8',
        required: true,
      },
      {
        id: 'expenseRatio',
        label: 'Expense Ratio (%)',
        type: 'number',
        min: 0,
        max: 5,
        step: 0.01,
        defaultValue: 1,
        placeholder: 'e.g. 0.75',
        required: true,
      },
      {
        id: 'years',
        label: 'Investment Period (years)',
        type: 'number',
        min: 1,
        max: 50,
        step: 1,
        defaultValue: 20,
        placeholder: 'e.g. 20',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'withoutFees',
        expression: 'investmentAmount * pow(1 + annualReturn / 100, years)',
        dependencies: ['investmentAmount', 'annualReturn', 'years'],
      },
      {
        id: 'withFees',
        expression: 'investmentAmount * pow(1 + (annualReturn - expenseRatio) / 100, years)',
        dependencies: ['investmentAmount', 'annualReturn', 'expenseRatio', 'years'],
      },
      {
        id: 'feeCost',
        expression: 'withoutFees - withFees',
        dependencies: ['withoutFees', 'withFees'],
      },
      {
        id: 'feePct',
        expression: 'feeCost / withoutFees * 100',
        dependencies: ['feeCost', 'withoutFees'],
      },
    ],
    outputs: [
      {
        id: 'value-without-fees',
        label: 'Value Without Fees',
        formulaRef: 'withoutFees',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'value-with-fees',
        label: 'Value With Fees',
        formulaRef: 'withFees',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'total-fee-cost',
        label: 'Total Cost of Fees',
        formulaRef: 'feeCost',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
      {
        id: 'fee-percentage',
        label: 'Fees as % of Growth',
        formulaRef: 'feePct',
        format: 'percentage',
        precision: 2,
      },
    ],
    guide: {
      whatIsIt:
        'The Mutual Fund Fee Calculator shows the long-term impact of expense ratios on your investments. Even a seemingly small difference of 0.5% in fees can cost tens of thousands of dollars over decades due to the compounding drag effect.',
      howToUse:
        'Enter your investment amount, the expected annual return before fees, the fund\'s expense ratio, and how long you plan to invest. The calculator compares your ending balance with and without fees to reveal the total dollar cost of those fees.',
      exampleScenario:
        'Investing $100,000 at 8% annual return over 20 years grows to $466,096 without fees. With a 1% expense ratio (net 7% return), it only grows to $386,968 — the fee costs you $79,128, or about 17% of your potential gains.',
      proTip:
        'Index funds typically have expense ratios of 0.03-0.20%, while actively managed funds charge 0.50-1.50%. Over 30+ years, switching from a 1% fee fund to a 0.05% index fund can save you more than a year\'s salary.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 4. Tax Equivalent Yield
  // =========================================================================
  {
    id: 'tax-equivalent-yield',
    slug: 'tax-equivalent-yield',
    title: 'Tax Equivalent Yield',
    description:
      'Compare the yield of a tax-free municipal bond to a taxable bond on an apples-to-apples basis.',
    icon: '🏛️',
    category: 'finance',
    subcategory: 'taxes',
    tags: ['tax equivalent', 'yield', 'municipal bond', 'muni', 'tax-free'],
    inputs: [
      {
        id: 'taxFreeYield',
        label: 'Tax-Free Yield (%)',
        type: 'number',
        min: 0,
        max: 20,
        step: 0.01,
        defaultValue: 3.5,
        placeholder: 'e.g. 3.5',
        required: true,
      },
      {
        id: 'marginalTaxRate',
        label: 'Marginal Tax Rate (%)',
        type: 'number',
        min: 0,
        max: 60,
        step: 0.1,
        defaultValue: 32,
        placeholder: 'e.g. 32',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'taxEquivYield',
        expression: 'taxFreeYield / (1 - marginalTaxRate / 100)',
        dependencies: ['taxFreeYield', 'marginalTaxRate'],
      },
      {
        id: 'taxSavings',
        expression: 'taxEquivYield - taxFreeYield',
        dependencies: ['taxEquivYield', 'taxFreeYield'],
      },
    ],
    outputs: [
      {
        id: 'tax-equiv-yield',
        label: 'Tax-Equivalent Yield',
        formulaRef: 'taxEquivYield',
        format: 'percentage',
        precision: 2,
        highlight: true,
      },
      {
        id: 'tax-savings-yield',
        label: 'Yield Advantage',
        formulaRef: 'taxSavings',
        format: 'percentage',
        precision: 2,
      },
    ],
    guide: {
      whatIsIt:
        'Tax Equivalent Yield (TEY) converts the yield of a tax-exempt municipal bond into the yield a taxable bond would need to offer to produce the same after-tax income. The formula is: TEY = Tax-Free Yield ÷ (1 − Marginal Tax Rate).',
      howToUse:
        'Enter the yield of the tax-free bond and your marginal federal tax rate. The calculator shows what a taxable bond would need to yield to match the after-tax return of the muni bond. A higher tax bracket makes munis comparatively more attractive.',
      exampleScenario:
        'A 3.5% municipal bond yield for someone in the 32% tax bracket has a tax-equivalent yield of 5.15%. This means a taxable bond would need to yield at least 5.15% to deliver the same after-tax return.',
      proTip:
        'If your state also exempts in-state muni bond interest, add your state tax rate to get the combined marginal rate for an even higher TEY. High-income earners in the 35-37% brackets benefit most from muni bonds.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 5. Hourly to Salary Calculator
  // =========================================================================
  {
    id: 'hourly-to-salary',
    slug: 'hourly-to-salary',
    title: 'Hourly to Salary Calculator',
    description:
      'Convert an hourly wage to an annual salary and see your weekly, biweekly, and monthly pay.',
    icon: '⏰',
    category: 'finance',
    subcategory: 'personal',
    tags: ['hourly', 'salary', 'wage', 'income', 'paycheck'],
    inputs: [
      {
        id: 'hourlyRate',
        label: 'Hourly Rate ($)',
        type: 'number',
        min: 0,
        step: 0.25,
        defaultValue: 25,
        placeholder: 'e.g. 25',
        required: true,
      },
      {
        id: 'hoursPerWeek',
        label: 'Hours Per Week',
        type: 'number',
        min: 1,
        max: 168,
        step: 1,
        defaultValue: 40,
        placeholder: 'e.g. 40',
        required: true,
      },
      {
        id: 'weeksPerYear',
        label: 'Weeks Per Year',
        type: 'number',
        min: 1,
        max: 52,
        step: 1,
        defaultValue: 52,
        placeholder: 'e.g. 52',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'annualSalary',
        expression: 'hourlyRate * hoursPerWeek * weeksPerYear',
        dependencies: ['hourlyRate', 'hoursPerWeek', 'weeksPerYear'],
      },
      {
        id: 'monthlySalary',
        expression: 'annualSalary / 12',
        dependencies: ['annualSalary'],
      },
      {
        id: 'biweekly',
        expression: 'annualSalary / 26',
        dependencies: ['annualSalary'],
      },
      {
        id: 'weeklyPay',
        expression: 'hourlyRate * hoursPerWeek',
        dependencies: ['hourlyRate', 'hoursPerWeek'],
      },
    ],
    outputs: [
      {
        id: 'annual-salary',
        label: 'Annual Salary',
        formulaRef: 'annualSalary',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
      {
        id: 'monthly-salary',
        label: 'Monthly Pay',
        formulaRef: 'monthlySalary',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'biweekly-pay',
        label: 'Biweekly Pay',
        formulaRef: 'biweekly',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'weekly-pay',
        label: 'Weekly Pay',
        formulaRef: 'weeklyPay',
        format: 'currency',
        precision: 2,
      },
    ],
    guide: {
      whatIsIt:
        'The Hourly to Salary Calculator converts an hourly wage into its equivalent annual salary and breaks it down into monthly, biweekly, and weekly pay periods. This is helpful when comparing job offers that quote compensation differently.',
      howToUse:
        'Enter your hourly rate and adjust the hours per week and weeks per year if they differ from the standard 40 hours / 52 weeks. Reduce weeks per year to account for unpaid vacation time.',
      exampleScenario:
        'At $25/hour working 40 hours/week for 52 weeks, your annual salary is $52,000. Monthly pay is $4,333, biweekly is $2,000, and weekly is $1,000.',
      proTip:
        'To quickly estimate annual salary from hourly rate, double the hourly rate and add three zeros. For example, $25/hr ≈ $50,000. This shortcut assumes 2,000 work hours per year.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 6. Salary Increase Calculator
  // =========================================================================
  {
    id: 'salary-increase',
    slug: 'salary-increase',
    title: 'Salary Increase Calculator',
    description:
      'Project how your salary grows over time with annual percentage raises using compound growth.',
    icon: '📈',
    category: 'finance',
    subcategory: 'personal',
    tags: ['salary', 'raise', 'increase', 'income', 'growth'],
    inputs: [
      {
        id: 'currentSalary',
        label: 'Current Annual Salary ($)',
        type: 'number',
        min: 0,
        defaultValue: 60000,
        placeholder: 'e.g. 60000',
        required: true,
      },
      {
        id: 'raisePercentage',
        label: 'Annual Raise (%)',
        type: 'number',
        min: 0,
        max: 50,
        step: 0.1,
        defaultValue: 3,
        placeholder: 'e.g. 3',
        required: true,
      },
      {
        id: 'years',
        label: 'Number of Years',
        type: 'number',
        min: 1,
        max: 50,
        step: 1,
        defaultValue: 5,
        placeholder: 'e.g. 5',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'newSalary',
        expression: 'currentSalary * pow(1 + raisePercentage / 100, years)',
        dependencies: ['currentSalary', 'raisePercentage', 'years'],
      },
      {
        id: 'totalIncrease',
        expression: 'newSalary - currentSalary',
        dependencies: ['newSalary', 'currentSalary'],
      },
      {
        id: 'monthlyIncrease',
        expression: '(newSalary - currentSalary) / 12',
        dependencies: ['newSalary', 'currentSalary'],
      },
    ],
    outputs: [
      {
        id: 'new-salary',
        label: 'Salary After Raises',
        formulaRef: 'newSalary',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
      {
        id: 'total-increase',
        label: 'Total Increase',
        formulaRef: 'totalIncrease',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'monthly-increase',
        label: 'Monthly Increase',
        formulaRef: 'monthlyIncrease',
        format: 'currency',
        precision: 2,
      },
    ],
    guide: {
      whatIsIt:
        'The Salary Increase Calculator projects your future salary after receiving consistent annual percentage raises. It uses compound growth — each raise builds on the previous year\'s salary, not your original salary.',
      howToUse:
        'Enter your current annual salary, the expected annual raise percentage, and how many years to project. The calculator shows your new salary after all raises, the total dollar increase, and the monthly difference.',
      exampleScenario:
        'A $60,000 salary with 3% annual raises over 5 years grows to $69,556. That\'s a $9,556 total increase or about $796/month more than your starting pay.',
      proTip:
        'The average US raise is around 3-4%. If your raises consistently fall below inflation (typically 2-3%), your real purchasing power is declining. Use this calculator to negotiate by showing the compound effect of even a 1% higher raise.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 7. Paycheck Tax Calculator (US — Single Filer, 2024)
  // =========================================================================
  {
    id: 'paycheck-tax-us',
    slug: 'paycheck-tax-us',
    title: 'Paycheck Tax Calculator (US)',
    description:
      'Estimate your US federal income tax, FICA, and state tax to see your take-home pay. Uses 2024 single-filer brackets.',
    icon: '🧾',
    category: 'finance',
    subcategory: 'taxes',
    tags: ['paycheck', 'tax', 'federal', 'FICA', 'take-home', 'net pay', 'withholding'],
    inputs: [
      {
        id: 'grossAnnualSalary',
        label: 'Gross Annual Salary ($)',
        type: 'number',
        min: 0,
        defaultValue: 85000,
        placeholder: 'e.g. 85000',
        required: true,
      },
      {
        id: 'filingStatus',
        label: 'Filing Status',
        type: 'select',
        options: [
          { label: 'Single', value: '0' },
          { label: 'Married Filing Jointly', value: '1' },
        ],
        defaultValue: '0',
        required: true,
        helpText: 'Tax brackets use single-filer rates. Married option adjusts standard deduction only.',
      },
      {
        id: 'stateTaxRate',
        label: 'State Income Tax Rate (%)',
        type: 'number',
        min: 0,
        max: 15,
        step: 0.1,
        defaultValue: 5,
        placeholder: 'e.g. 5',
        required: true,
      },
      {
        id: 'preTax401k',
        label: 'Pre-Tax 401(k) Contribution (annual $)',
        type: 'number',
        min: 0,
        defaultValue: 0,
        placeholder: 'e.g. 6000',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'taxableIncome',
        expression: 'grossAnnualSalary - preTax401k - (filingStatus == 0 ? 14600 : 29200)',
        dependencies: ['grossAnnualSalary', 'preTax401k', 'filingStatus'],
      },
      {
        id: 'federalTax',
        expression:
          'taxableIncome <= 11600 ? taxableIncome * 0.10 : (taxableIncome <= 47150 ? 1160 + (taxableIncome - 11600) * 0.12 : (taxableIncome <= 100525 ? 5426 + (taxableIncome - 47150) * 0.22 : (taxableIncome <= 191950 ? 17168.50 + (taxableIncome - 100525) * 0.24 : (taxableIncome <= 243725 ? 39110.50 + (taxableIncome - 191950) * 0.32 : (taxableIncome <= 609350 ? 55678.50 + (taxableIncome - 243725) * 0.35 : 183647.25 + (taxableIncome - 609350) * 0.37)))))',
        dependencies: ['taxableIncome'],
      },
      {
        id: 'ficaTax',
        expression: 'min(grossAnnualSalary, 168600) * 0.0765 + max(grossAnnualSalary - 168600, 0) * 0.0145',
        dependencies: ['grossAnnualSalary'],
      },
      {
        id: 'stateTax',
        expression: 'taxableIncome * stateTaxRate / 100',
        dependencies: ['taxableIncome', 'stateTaxRate'],
      },
      {
        id: 'totalTax',
        expression: 'max(federalTax, 0) + ficaTax + stateTax',
        dependencies: ['federalTax', 'ficaTax', 'stateTax'],
      },
      {
        id: 'netAnnual',
        expression: 'grossAnnualSalary - totalTax - preTax401k',
        dependencies: ['grossAnnualSalary', 'totalTax', 'preTax401k'],
      },
      {
        id: 'netMonthly',
        expression: 'netAnnual / 12',
        dependencies: ['netAnnual'],
      },
      {
        id: 'netBiweekly',
        expression: 'netAnnual / 26',
        dependencies: ['netAnnual'],
      },
      {
        id: 'effectiveRate',
        expression: 'totalTax / grossAnnualSalary * 100',
        dependencies: ['totalTax', 'grossAnnualSalary'],
      },
    ],
    outputs: [
      {
        id: 'net-annual',
        label: 'Net Annual Pay',
        formulaRef: 'netAnnual',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
      {
        id: 'net-monthly',
        label: 'Net Monthly Pay',
        formulaRef: 'netMonthly',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
      {
        id: 'net-biweekly',
        label: 'Net Biweekly Pay',
        formulaRef: 'netBiweekly',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'federal-tax',
        label: 'Federal Income Tax',
        formulaRef: 'federalTax',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'fica-tax',
        label: 'FICA Tax (SS + Medicare)',
        formulaRef: 'ficaTax',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'state-tax',
        label: 'State Income Tax',
        formulaRef: 'stateTax',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'total-tax',
        label: 'Total Tax',
        formulaRef: 'totalTax',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'effective-rate',
        label: 'Effective Tax Rate',
        formulaRef: 'effectiveRate',
        format: 'percentage',
        precision: 2,
      },
    ],
    guide: {
      whatIsIt:
        'The Paycheck Tax Calculator estimates your US take-home pay after federal income tax (2024 brackets), FICA (Social Security + Medicare), and state income tax. It uses the single-filer tax brackets; selecting "Married" adjusts the standard deduction but applies the same bracket structure as a simplified estimate.',
      howToUse:
        'Enter your gross annual salary, choose your filing status, set your state income tax rate (use 0% for states with no income tax like TX, FL, WA), and enter any pre-tax 401(k) contributions. The calculator deducts the standard deduction and 401(k) before computing federal tax.',
      exampleScenario:
        'An $85,000 salary (single, 5% state tax, no 401k) has $70,400 taxable income after the $14,600 standard deduction. Federal tax is ~$8,535, FICA is ~$6,503, and state tax is ~$3,520 — leaving about $66,442 net annual or ~$5,537/month take-home.',
      proTip:
        'Maximizing your 401(k) contribution reduces taxable income, which can drop you into a lower bracket. The 2024 employee limit is $23,000 ($30,500 if 50+). Every dollar contributed saves you money at your marginal rate.',
    },
    metadata: { version: '1.0.0', lastUpdated: '2024-01' },
  },

  // =========================================================================
  // 8. Net Distribution Calculator
  // =========================================================================
  {
    id: 'net-distribution',
    slug: 'net-distribution',
    title: 'Net Distribution Calculator',
    description:
      'Calculate the net amount you receive from a retirement or investment account distribution after tax withholdings and early withdrawal penalties.',
    icon: '🏧',
    category: 'finance',
    subcategory: 'personal',
    tags: ['distribution', 'withdrawal', 'retirement', 'penalty', 'IRA', '401k'],
    inputs: [
      {
        id: 'grossDistribution',
        label: 'Gross Distribution ($)',
        type: 'number',
        min: 0,
        defaultValue: 50000,
        placeholder: 'e.g. 50000',
        required: true,
      },
      {
        id: 'federalWithholding',
        label: 'Federal Withholding (%)',
        type: 'number',
        min: 0,
        max: 100,
        step: 1,
        defaultValue: 20,
        placeholder: 'e.g. 20',
        required: true,
      },
      {
        id: 'stateWithholding',
        label: 'State Withholding (%)',
        type: 'number',
        min: 0,
        max: 100,
        step: 0.1,
        defaultValue: 5,
        placeholder: 'e.g. 5',
        required: true,
      },
      {
        id: 'earlyPenalty',
        label: 'Early Withdrawal (under 59½)',
        type: 'checkbox',
        defaultValue: false,
        helpText: 'Adds a 10% early withdrawal penalty if checked.',
      },
    ],
    formulas: [
      {
        id: 'fedTax',
        expression: 'grossDistribution * federalWithholding / 100',
        dependencies: ['grossDistribution', 'federalWithholding'],
      },
      {
        id: 'stateTax',
        expression: 'grossDistribution * stateWithholding / 100',
        dependencies: ['grossDistribution', 'stateWithholding'],
      },
      {
        id: 'penalty',
        expression: 'earlyPenalty * grossDistribution * 0.10',
        dependencies: ['earlyPenalty', 'grossDistribution'],
      },
      {
        id: 'netDistribution',
        expression: 'grossDistribution - fedTax - stateTax - penalty',
        dependencies: ['grossDistribution', 'fedTax', 'stateTax', 'penalty'],
      },
    ],
    outputs: [
      {
        id: 'net-distribution-value',
        label: 'Net Distribution',
        formulaRef: 'netDistribution',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
      {
        id: 'federal-tax-withheld',
        label: 'Federal Tax Withheld',
        formulaRef: 'fedTax',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'state-tax-withheld',
        label: 'State Tax Withheld',
        formulaRef: 'stateTax',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'early-penalty',
        label: 'Early Withdrawal Penalty',
        formulaRef: 'penalty',
        format: 'currency',
        precision: 2,
      },
    ],
    guide: {
      whatIsIt:
        'The Net Distribution Calculator shows what you actually receive after taking a distribution from a tax-deferred retirement account (IRA, 401k). It accounts for mandatory federal withholding, state withholding, and the 10% early withdrawal penalty for distributions taken before age 59½.',
      howToUse:
        'Enter the gross distribution amount, the federal withholding percentage (typically 20% for lump-sum 401k distributions), your state\'s withholding rate, and check the early penalty box if you are under 59½.',
      exampleScenario:
        'A $50,000 early distribution with 20% federal and 5% state withholding costs $10,000 in federal tax, $2,500 in state tax, plus a $5,000 early penalty — leaving only $32,500 in your pocket (35% gone).',
      proTip:
        'Before taking an early distribution, consider a 401(k) loan, Roth IRA contribution withdrawal (penalty-free), or the Rule of 55 (penalty-free 401k access after leaving a job at 55+). The 10% penalty is on top of regular income tax.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 9. Net Worth Calculator
  // =========================================================================
  {
    id: 'net-worth-calculator',
    slug: 'net-worth-calculator',
    title: 'Net Worth Calculator',
    description:
      'Calculate your total net worth by tallying assets and subtracting liabilities for a clear financial picture.',
    icon: '💰',
    category: 'finance',
    subcategory: 'personal',
    tags: ['net worth', 'assets', 'liabilities', 'debt', 'wealth'],
    inputs: [
      {
        id: 'cash',
        label: 'Cash & Bank Accounts ($)',
        type: 'number',
        min: 0,
        defaultValue: 15000,
        placeholder: 'e.g. 15000',
        required: true,
        group: 'Assets',
      },
      {
        id: 'investments',
        label: 'Investments & Retirement ($)',
        type: 'number',
        min: 0,
        defaultValue: 50000,
        placeholder: 'e.g. 50000',
        required: true,
        group: 'Assets',
      },
      {
        id: 'realEstate',
        label: 'Real Estate Value ($)',
        type: 'number',
        min: 0,
        defaultValue: 250000,
        placeholder: 'e.g. 250000',
        required: true,
        group: 'Assets',
      },
      {
        id: 'vehicles',
        label: 'Vehicles ($)',
        type: 'number',
        min: 0,
        defaultValue: 20000,
        placeholder: 'e.g. 20000',
        required: true,
        group: 'Assets',
      },
      {
        id: 'otherAssets',
        label: 'Other Assets ($)',
        type: 'number',
        min: 0,
        defaultValue: 5000,
        placeholder: 'e.g. 5000',
        required: true,
        group: 'Assets',
      },
      {
        id: 'mortgage',
        label: 'Mortgage Balance ($)',
        type: 'number',
        min: 0,
        defaultValue: 180000,
        placeholder: 'e.g. 180000',
        required: true,
        group: 'Liabilities',
      },
      {
        id: 'carLoans',
        label: 'Car Loans ($)',
        type: 'number',
        min: 0,
        defaultValue: 12000,
        placeholder: 'e.g. 12000',
        required: true,
        group: 'Liabilities',
      },
      {
        id: 'studentLoans',
        label: 'Student Loans ($)',
        type: 'number',
        min: 0,
        defaultValue: 25000,
        placeholder: 'e.g. 25000',
        required: true,
        group: 'Liabilities',
      },
      {
        id: 'creditCardDebt',
        label: 'Credit Card Debt ($)',
        type: 'number',
        min: 0,
        defaultValue: 3000,
        placeholder: 'e.g. 3000',
        required: true,
        group: 'Liabilities',
      },
      {
        id: 'otherLiabilities',
        label: 'Other Liabilities ($)',
        type: 'number',
        min: 0,
        defaultValue: 0,
        placeholder: 'e.g. 0',
        required: true,
        group: 'Liabilities',
      },
    ],
    formulas: [
      {
        id: 'totalAssets',
        expression: 'cash + investments + realEstate + vehicles + otherAssets',
        dependencies: ['cash', 'investments', 'realEstate', 'vehicles', 'otherAssets'],
      },
      {
        id: 'totalLiabilities',
        expression: 'mortgage + carLoans + studentLoans + creditCardDebt + otherLiabilities',
        dependencies: ['mortgage', 'carLoans', 'studentLoans', 'creditCardDebt', 'otherLiabilities'],
      },
      {
        id: 'netWorth',
        expression: 'totalAssets - totalLiabilities',
        dependencies: ['totalAssets', 'totalLiabilities'],
      },
      {
        id: 'debtToAsset',
        expression: 'totalLiabilities / totalAssets * 100',
        dependencies: ['totalLiabilities', 'totalAssets'],
      },
    ],
    outputs: [
      {
        id: 'net-worth-value',
        label: 'Net Worth',
        formulaRef: 'netWorth',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
      {
        id: 'total-assets',
        label: 'Total Assets',
        formulaRef: 'totalAssets',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'total-liabilities',
        label: 'Total Liabilities',
        formulaRef: 'totalLiabilities',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'debt-to-asset',
        label: 'Debt-to-Asset Ratio',
        formulaRef: 'debtToAsset',
        format: 'percentage',
        precision: 1,
      },
    ],
    guide: {
      whatIsIt:
        'Net worth is the single most important number in personal finance. It equals everything you own (assets) minus everything you owe (liabilities). Tracking net worth over time is the best way to measure financial progress.',
      howToUse:
        'Enter the current market value of your assets across all categories, then enter the outstanding balances on all debts. The calculator totals each side and computes your net worth and debt-to-asset ratio.',
      exampleScenario:
        'With $340,000 in total assets (home, savings, car) and $220,000 in liabilities (mortgage, loans, credit cards), your net worth is $120,000 with a 64.7% debt-to-asset ratio.',
      proTip:
        'Track your net worth monthly or quarterly. A debt-to-asset ratio below 50% is healthy. Focus on paying off high-interest debt first while building investments — your net worth will accelerate once the debt drag is eliminated.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 10. Cap Rate Calculator
  // =========================================================================
  {
    id: 'cap-rate-calculator',
    slug: 'cap-rate-calculator',
    title: 'Cap Rate Calculator',
    description:
      'Calculate the capitalization rate and gross rent multiplier for a rental property investment.',
    icon: '🏘️',
    category: 'finance',
    subcategory: 'personal',
    tags: ['cap rate', 'real estate', 'rental', 'NOI', 'investment property', 'GRM'],
    inputs: [
      {
        id: 'propertyValue',
        label: 'Property Value / Purchase Price ($)',
        type: 'number',
        min: 0,
        defaultValue: 300000,
        placeholder: 'e.g. 300000',
        required: true,
      },
      {
        id: 'annualRentalIncome',
        label: 'Annual Rental Income ($)',
        type: 'number',
        min: 0,
        defaultValue: 30000,
        placeholder: 'e.g. 30000',
        required: true,
      },
      {
        id: 'annualExpenses',
        label: 'Annual Operating Expenses ($)',
        type: 'number',
        min: 0,
        defaultValue: 8000,
        placeholder: 'e.g. 8000',
        required: true,
        helpText: 'Include property tax, insurance, maintenance, management, vacancies.',
      },
    ],
    formulas: [
      {
        id: 'noi',
        expression: 'annualRentalIncome - annualExpenses',
        dependencies: ['annualRentalIncome', 'annualExpenses'],
      },
      {
        id: 'capRate',
        expression: 'noi / propertyValue * 100',
        dependencies: ['noi', 'propertyValue'],
      },
      {
        id: 'grm',
        expression: 'propertyValue / annualRentalIncome',
        dependencies: ['propertyValue', 'annualRentalIncome'],
      },
    ],
    outputs: [
      {
        id: 'cap-rate-value',
        label: 'Cap Rate',
        formulaRef: 'capRate',
        format: 'percentage',
        precision: 2,
        highlight: true,
      },
      {
        id: 'noi-value',
        label: 'Net Operating Income (NOI)',
        formulaRef: 'noi',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'grm-value',
        label: 'Gross Rent Multiplier (GRM)',
        formulaRef: 'grm',
        format: 'number',
        precision: 1,
      },
    ],
    guide: {
      whatIsIt:
        'The Capitalization Rate (cap rate) measures the return on a real estate investment by dividing Net Operating Income (NOI) by the property value. It lets you compare investment properties regardless of size. The Gross Rent Multiplier (GRM) is a simpler ratio of price to gross rent.',
      howToUse:
        'Enter the property value or purchase price, the total annual rental income, and all annual operating expenses (taxes, insurance, maintenance, management fees, vacancy reserves). Do not include mortgage payments — cap rate is calculated before financing.',
      exampleScenario:
        'A $300,000 property earning $30,000/year in rent with $8,000 in expenses has an NOI of $22,000, a cap rate of 7.33%, and a GRM of 10.0. A higher cap rate means a potentially better return.',
      proTip:
        'Cap rates of 5-10% are typical. Lower cap rates often indicate lower risk or higher-appreciation markets. Always verify that expenses include realistic vacancy (5-10%), maintenance (1% of property value), and property management (8-10% of rent).',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 11. Investment Income Calculator
  // =========================================================================
  {
    id: 'investment-income',
    slug: 'investment-income',
    title: 'Investment Income Calculator',
    description:
      'Calculate the annual and monthly income from a portfolio using a fixed withdrawal rate, and estimate how long your money will last.',
    icon: '💵',
    category: 'finance',
    subcategory: 'savings',
    tags: ['investment income', 'withdrawal', 'passive income', 'retirement income', 'drawdown'],
    inputs: [
      {
        id: 'principal',
        label: 'Portfolio Value ($)',
        type: 'number',
        min: 0,
        defaultValue: 500000,
        placeholder: 'e.g. 500000',
        required: true,
      },
      {
        id: 'annualReturn',
        label: 'Expected Annual Return (%)',
        type: 'number',
        min: 0,
        max: 30,
        step: 0.1,
        defaultValue: 7,
        placeholder: 'e.g. 7',
        required: true,
      },
      {
        id: 'withdrawalRate',
        label: 'Annual Withdrawal Rate (%)',
        type: 'number',
        min: 0,
        max: 20,
        step: 0.1,
        defaultValue: 4,
        placeholder: 'e.g. 4',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'annualIncome',
        expression: 'principal * withdrawalRate / 100',
        dependencies: ['principal', 'withdrawalRate'],
      },
      {
        id: 'monthlyIncome',
        expression: 'annualIncome / 12',
        dependencies: ['annualIncome'],
      },
      {
        id: 'growth',
        expression: 'principal * annualReturn / 100',
        dependencies: ['principal', 'annualReturn'],
      },
      {
        id: 'netChange',
        expression: 'growth - annualIncome',
        dependencies: ['growth', 'annualIncome'],
      },
      {
        id: 'yearsToDepletion',
        expression: 'annualIncome > growth ? principal / (annualIncome - growth) : 999',
        dependencies: ['annualIncome', 'growth', 'principal'],
      },
    ],
    outputs: [
      {
        id: 'annual-income',
        label: 'Annual Income',
        formulaRef: 'annualIncome',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
      {
        id: 'monthly-income',
        label: 'Monthly Income',
        formulaRef: 'monthlyIncome',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
      {
        id: 'annual-growth',
        label: 'Annual Portfolio Growth',
        formulaRef: 'growth',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'net-change',
        label: 'Net Annual Change',
        formulaRef: 'netChange',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'years-to-depletion',
        label: 'Estimated Years to Depletion',
        formulaRef: 'yearsToDepletion',
        format: 'number',
        precision: 1,
        suffix: ' years',
      },
    ],
    guide: {
      whatIsIt:
        'The Investment Income Calculator shows how much income a portfolio generates at a given withdrawal rate. If withdrawals exceed growth, it estimates how many years before the portfolio is depleted. The famous "4% rule" suggests withdrawing 4% annually for a ~30-year retirement.',
      howToUse:
        'Enter your total portfolio value, expected annual return, and your desired annual withdrawal percentage. The calculator shows annual/monthly income, portfolio growth, and whether your withdrawals are sustainable.',
      exampleScenario:
        'A $500,000 portfolio earning 7% with a 4% withdrawal rate generates $20,000/year ($1,667/month). Growth is $35,000/year, so the portfolio actually increases by $15,000/year — it is sustainable indefinitely at these rates.',
      proTip:
        'If "Years to Depletion" shows 999, your portfolio grows faster than you withdraw — it will never run out. Consider adjusting withdrawal rate to 3.5% for extra safety margin during market downturns.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 12. US HSA Calculator
  // =========================================================================
  {
    id: 'hsa-calculator',
    slug: 'hsa-calculator',
    title: 'US HSA Calculator',
    description:
      'Project the future value of your Health Savings Account (HSA) and calculate the tax savings from contributions.',
    icon: '🏥',
    category: 'finance',
    subcategory: 'savings',
    tags: ['HSA', 'health savings', 'tax savings', 'healthcare', 'HDHP'],
    inputs: [
      {
        id: 'annualContribution',
        label: 'Your Annual Contribution ($)',
        type: 'number',
        min: 0,
        max: 8300,
        defaultValue: 4150,
        placeholder: 'e.g. 4150',
        required: true,
        helpText: '2024 limits: $4,150 self-only / $8,300 family.',
      },
      {
        id: 'employerContribution',
        label: 'Employer Annual Contribution ($)',
        type: 'number',
        min: 0,
        defaultValue: 500,
        placeholder: 'e.g. 500',
        required: true,
      },
      {
        id: 'currentBalance',
        label: 'Current HSA Balance ($)',
        type: 'number',
        min: 0,
        defaultValue: 5000,
        placeholder: 'e.g. 5000',
        required: true,
      },
      {
        id: 'annualReturn',
        label: 'Expected Annual Return (%)',
        type: 'number',
        min: 0,
        max: 20,
        step: 0.1,
        defaultValue: 6,
        placeholder: 'e.g. 6',
        required: true,
      },
      {
        id: 'years',
        label: 'Years to Grow',
        type: 'number',
        min: 1,
        max: 40,
        step: 1,
        defaultValue: 20,
        placeholder: 'e.g. 20',
        required: true,
      },
      {
        id: 'marginalTaxRate',
        label: 'Marginal Tax Rate (%)',
        type: 'number',
        min: 0,
        max: 50,
        step: 0.1,
        defaultValue: 24,
        placeholder: 'e.g. 24',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'totalAnnual',
        expression: 'annualContribution + employerContribution',
        dependencies: ['annualContribution', 'employerContribution'],
      },
      {
        id: 'monthlyRate',
        expression: 'annualReturn / 100 / 12',
        dependencies: ['annualReturn'],
      },
      {
        id: 'totalMonths',
        expression: 'years * 12',
        dependencies: ['years'],
      },
      {
        id: 'monthlyContrib',
        expression: 'totalAnnual / 12',
        dependencies: ['totalAnnual'],
      },
      {
        id: 'futureValue',
        expression: 'fv(monthlyRate, totalMonths, monthlyContrib * -1, currentBalance * -1)',
        dependencies: ['monthlyRate', 'totalMonths', 'monthlyContrib', 'currentBalance'],
      },
      {
        id: 'taxSavings',
        expression: 'annualContribution * marginalTaxRate / 100 * years',
        dependencies: ['annualContribution', 'marginalTaxRate', 'years'],
      },
    ],
    outputs: [
      {
        id: 'hsa-future-value',
        label: 'Projected HSA Balance',
        formulaRef: 'futureValue',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
      {
        id: 'total-annual-contribution',
        label: 'Total Annual Contribution (You + Employer)',
        formulaRef: 'totalAnnual',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'total-tax-savings',
        label: 'Total Tax Savings Over Period',
        formulaRef: 'taxSavings',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
    ],
    guide: {
      whatIsIt:
        'A Health Savings Account (HSA) is a triple-tax-advantaged account: contributions are pre-tax, growth is tax-free, and qualified medical withdrawals are tax-free. This calculator projects your HSA balance over time and tallies the income tax savings from your contributions.',
      howToUse:
        'Enter your annual contribution, any employer match, current balance, expected return, investment horizon, and your marginal tax rate. The 2024 contribution limits are $4,150 for self-only and $8,300 for family coverage (add $1,000 catch-up if 55+).',
      exampleScenario:
        'Contributing $4,150/year with a $500 employer match, starting with $5,000 at 6% return for 20 years grows to approximately $106,000. At a 24% tax rate, you save $19,920 in income taxes over the period.',
      proTip:
        'The ultimate HSA strategy: contribute the max, invest it all in index funds, pay medical expenses out-of-pocket, keep receipts, and reimburse yourself decades later for tax-free withdrawals. After 65, HSA funds can be used for any purpose (taxed like a traditional IRA).',
    },
    metadata: { version: '1.0.0', lastUpdated: '2024-01' },
  },

  // =========================================================================
  // 13. Certificate of Deposit (CD) Calculator
  // =========================================================================
  {
    id: 'cd-calculator',
    slug: 'cd-calculator',
    title: 'Certificate of Deposit (CD) Calculator',
    description:
      'Calculate the maturity value, interest earned, and APY of a certificate of deposit based on term and compounding frequency.',
    icon: '📜',
    category: 'finance',
    subcategory: 'savings',
    tags: ['CD', 'certificate of deposit', 'interest', 'APY', 'savings', 'fixed income'],
    inputs: [
      {
        id: 'depositAmount',
        label: 'Deposit Amount ($)',
        type: 'number',
        min: 0,
        defaultValue: 10000,
        placeholder: 'e.g. 10000',
        required: true,
      },
      {
        id: 'annualRate',
        label: 'Annual Interest Rate (%)',
        type: 'number',
        min: 0,
        max: 20,
        step: 0.01,
        defaultValue: 5,
        placeholder: 'e.g. 5',
        required: true,
      },
      {
        id: 'termMonths',
        label: 'Term Length',
        type: 'select',
        options: [
          { label: '3 Months', value: '3' },
          { label: '6 Months', value: '6' },
          { label: '12 Months (1 Year)', value: '12' },
          { label: '24 Months (2 Years)', value: '24' },
          { label: '36 Months (3 Years)', value: '36' },
          { label: '60 Months (5 Years)', value: '60' },
        ],
        defaultValue: '12',
        required: true,
      },
      {
        id: 'compounding',
        label: 'Compounding Frequency',
        type: 'select',
        options: [
          { label: 'Daily', value: '365' },
          { label: 'Monthly', value: '12' },
          { label: 'Quarterly', value: '4' },
        ],
        defaultValue: '365',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'r',
        expression: 'annualRate / 100 / compounding',
        dependencies: ['annualRate', 'compounding'],
      },
      {
        id: 'n',
        expression: 'compounding * termMonths / 12',
        dependencies: ['compounding', 'termMonths'],
      },
      {
        id: 'maturityValue',
        expression: 'depositAmount * pow(1 + r, n)',
        dependencies: ['depositAmount', 'r', 'n'],
      },
      {
        id: 'interestEarned',
        expression: 'maturityValue - depositAmount',
        dependencies: ['maturityValue', 'depositAmount'],
      },
      {
        id: 'apy',
        expression: '(pow(1 + annualRate / 100 / compounding, compounding) - 1) * 100',
        dependencies: ['annualRate', 'compounding'],
      },
    ],
    outputs: [
      {
        id: 'maturity-value',
        label: 'Maturity Value',
        formulaRef: 'maturityValue',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
      {
        id: 'interest-earned',
        label: 'Interest Earned',
        formulaRef: 'interestEarned',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'apy-value',
        label: 'Annual Percentage Yield (APY)',
        formulaRef: 'apy',
        format: 'percentage',
        precision: 3,
      },
    ],
    guide: {
      whatIsIt:
        'A Certificate of Deposit (CD) is a time deposit offered by banks with a fixed interest rate and maturity date. This calculator computes the maturity value, total interest earned, and the APY (Annual Percentage Yield) which accounts for compounding frequency.',
      howToUse:
        'Enter the deposit amount, the advertised annual interest rate, choose a term length, and select the compounding frequency (daily compounding is most common). The calculator shows what you receive at maturity and the effective APY.',
      exampleScenario:
        'A $10,000 CD at 5% annual rate for 12 months with daily compounding yields $10,512.67 at maturity — earning $512.67 in interest. The APY is 5.127%, slightly higher than the stated 5% rate due to daily compounding.',
      proTip:
        'Build a CD ladder: spread deposits across 1, 2, 3, 4, and 5-year CDs. As each matures, reinvest into a 5-year CD to capture higher long-term rates while maintaining annual liquidity. Compare APY (not APR) when shopping for CDs.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 14. Recurring Deposit (RD) Calculator
  // =========================================================================
  {
    id: 'rd-calculator',
    slug: 'rd-calculator',
    title: 'Recurring Deposit (RD) Calculator',
    description:
      'Calculate the maturity value and interest earned on a recurring deposit with regular monthly installments.',
    icon: '🔄',
    category: 'finance',
    subcategory: 'savings',
    tags: ['recurring deposit', 'RD', 'savings', 'monthly deposit', 'interest'],
    inputs: [
      {
        id: 'monthlyDeposit',
        label: 'Monthly Deposit ($)',
        type: 'number',
        min: 0,
        defaultValue: 500,
        placeholder: 'e.g. 500',
        required: true,
      },
      {
        id: 'annualRate',
        label: 'Annual Interest Rate (%)',
        type: 'number',
        min: 0,
        max: 20,
        step: 0.01,
        defaultValue: 6,
        placeholder: 'e.g. 6',
        required: true,
      },
      {
        id: 'termMonths',
        label: 'Term (months)',
        type: 'number',
        min: 1,
        max: 120,
        step: 1,
        defaultValue: 24,
        placeholder: 'e.g. 24',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'maturityValue',
        expression: 'annuity_fv(monthlyDeposit, annualRate / 100 / 12, termMonths)',
        dependencies: ['monthlyDeposit', 'annualRate', 'termMonths'],
      },
      {
        id: 'totalDeposited',
        expression: 'monthlyDeposit * termMonths',
        dependencies: ['monthlyDeposit', 'termMonths'],
      },
      {
        id: 'interestEarned',
        expression: 'maturityValue - totalDeposited',
        dependencies: ['maturityValue', 'totalDeposited'],
      },
    ],
    outputs: [
      {
        id: 'maturity-value',
        label: 'Maturity Value',
        formulaRef: 'maturityValue',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
      {
        id: 'total-deposited',
        label: 'Total Amount Deposited',
        formulaRef: 'totalDeposited',
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
        'A Recurring Deposit (RD) is a savings product where you deposit a fixed amount every month for a predetermined period and earn interest on the accumulated balance. It is similar to a systematic savings plan or annuity.',
      howToUse:
        'Enter the amount you plan to deposit each month, the annual interest rate offered, and the term in months. The calculator uses the annuity future value formula to project the maturity amount and total interest earned.',
      exampleScenario:
        'Depositing $500/month at 6% annual interest for 24 months results in approximately $12,722 at maturity. Total deposited is $12,000, so interest earned is about $722.',
      proTip:
        'Compare RD rates across banks — online banks often offer 0.5-1% higher rates. Consider a SIP (Systematic Investment Plan) in index funds for potentially higher long-term returns if you can tolerate market volatility.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 15. Savings Goal Calculator
  // =========================================================================
  {
    id: 'savings-goal',
    slug: 'savings-goal',
    title: 'Savings Goal Calculator',
    description:
      'Determine how much you need to save each month to reach a specific financial goal by a target date.',
    icon: '🎯',
    category: 'finance',
    subcategory: 'savings',
    tags: ['savings goal', 'target', 'monthly savings', 'planning', 'future value'],
    inputs: [
      {
        id: 'goalAmount',
        label: 'Savings Goal ($)',
        type: 'number',
        min: 0,
        defaultValue: 50000,
        placeholder: 'e.g. 50000',
        required: true,
      },
      {
        id: 'currentSavings',
        label: 'Current Savings ($)',
        type: 'number',
        min: 0,
        defaultValue: 5000,
        placeholder: 'e.g. 5000',
        required: true,
      },
      {
        id: 'annualReturn',
        label: 'Expected Annual Return (%)',
        type: 'number',
        min: 0,
        max: 20,
        step: 0.1,
        defaultValue: 5,
        placeholder: 'e.g. 5',
        required: true,
      },
      {
        id: 'timeframeYears',
        label: 'Timeframe (years)',
        type: 'number',
        min: 1,
        max: 50,
        step: 1,
        defaultValue: 5,
        placeholder: 'e.g. 5',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'monthlyRate',
        expression: 'annualReturn / 100 / 12',
        dependencies: ['annualReturn'],
      },
      {
        id: 'totalMonths',
        expression: 'timeframeYears * 12',
        dependencies: ['timeframeYears'],
      },
      {
        id: 'monthlySavingsNeeded',
        expression: 'abs(pmt(monthlyRate, totalMonths, currentSavings * -1, goalAmount))',
        dependencies: ['monthlyRate', 'totalMonths', 'currentSavings', 'goalAmount'],
      },
      {
        id: 'totalContributed',
        expression: 'monthlySavingsNeeded * totalMonths + currentSavings',
        dependencies: ['monthlySavingsNeeded', 'totalMonths', 'currentSavings'],
      },
      {
        id: 'interestEarned',
        expression: 'goalAmount - totalContributed',
        dependencies: ['goalAmount', 'totalContributed'],
      },
    ],
    outputs: [
      {
        id: 'monthly-savings-needed',
        label: 'Monthly Savings Needed',
        formulaRef: 'monthlySavingsNeeded',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
      {
        id: 'total-contributed',
        label: 'Total Contributions (including initial)',
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
        'The Savings Goal Calculator works backward from a target amount to tell you how much to save each month. It factors in your current savings, expected investment returns, and time horizon to compute the required monthly contribution.',
      howToUse:
        'Enter your target savings goal, what you have saved so far, the expected annual return on your savings or investments, and how many years you have. The calculator uses the PMT function to determine the monthly amount needed.',
      exampleScenario:
        'To reach $50,000 in 5 years with $5,000 already saved at 5% annual return, you need to save about $695/month. Of the $50,000 goal, you contribute about $46,700 total and earn roughly $3,300 in interest.',
      proTip:
        'Automate your savings transfers on payday — you can\'t spend what you never see. Even small increases in monthly savings have a big impact over time. If the required amount seems too high, extend the timeframe or boost your return with index investing.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 16. US Interest Rates Reference
  // =========================================================================
  {
    id: 'us-interest-rates',
    slug: 'us-interest-rates',
    title: 'US Interest Rates Reference',
    description:
      'Quick reference tool for key US interest rates (as of June 2025). Select a rate and see the monthly payment for a given loan amount.',
    icon: '🇺🇸',
    category: 'finance',
    subcategory: 'savings',
    tags: ['interest rates', 'federal funds', 'mortgage rate', 'treasury', 'prime rate', 'SOFR', 'CD rate'],
    inputs: [
      {
        id: 'loanAmount',
        label: 'Loan Amount ($)',
        type: 'number',
        min: 0,
        defaultValue: 300000,
        placeholder: 'e.g. 300000',
        required: true,
      },
      {
        id: 'rateType',
        label: 'Reference Rate',
        type: 'select',
        options: [
          { label: 'Federal Funds Rate (5.33%)', value: '5.33' },
          { label: '30-Year Fixed Mortgage (6.85%)', value: '6.85' },
          { label: '15-Year Fixed Mortgage (6.10%)', value: '6.10' },
          { label: '10-Year Treasury (4.25%)', value: '4.25' },
          { label: 'Prime Rate (8.50%)', value: '8.50' },
          { label: '1-Year CD (4.75%)', value: '4.75' },
          { label: 'SOFR (5.31%)', value: '5.31' },
        ],
        defaultValue: '6.85',
        required: true,
        helpText: 'Rates as of June 2025 — check current rates for accuracy.',
      },
    ],
    formulas: [
      {
        id: 'monthlyRate',
        expression: 'rateType / 100 / 12',
        dependencies: ['rateType'],
      },
      {
        id: 'monthlyPayment',
        expression: 'abs(pmt(monthlyRate, 360, loanAmount))',
        dependencies: ['monthlyRate', 'loanAmount'],
      },
      {
        id: 'annualInterest',
        expression: 'loanAmount * rateType / 100',
        dependencies: ['loanAmount', 'rateType'],
      },
    ],
    outputs: [
      {
        id: 'selected-rate',
        label: 'Selected Annual Rate',
        formulaRef: 'rateType',
        format: 'percentage',
        precision: 2,
        highlight: true,
      },
      {
        id: 'monthly-payment',
        label: 'Monthly Payment (30-yr amortization)',
        formulaRef: 'monthlyPayment',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
      {
        id: 'annual-interest',
        label: 'First-Year Interest Cost',
        formulaRef: 'annualInterest',
        format: 'currency',
        precision: 2,
      },
    ],
    guide: {
      whatIsIt:
        'This is a quick-reference tool showing key US benchmark interest rates as of June 2025. Select a rate to see the estimated monthly payment on a 30-year amortization and the first-year interest cost. Rates change frequently — always verify with current sources.',
      howToUse:
        'Enter a loan amount, then select the reference rate you want to explore. The calculator shows the monthly payment assuming a standard 30-year amortization schedule, plus the simple first-year interest cost at that rate.',
      exampleScenario:
        'A $300,000 mortgage at the 30-year fixed rate of 6.85% results in a monthly payment of approximately $1,966. The first-year interest cost would be about $20,550.',
      proTip:
        'The federal funds rate influences all other rates. When the Fed lowers rates, mortgage and savings rates follow (with a lag). The spread between the 10-year Treasury and mortgage rates is typically 1.5-2.5%. Monitor the yield curve (2yr vs 10yr Treasury) for economic signals.',
    },
    metadata: { version: '1.0.0', lastUpdated: '2025-06' },
  },

  // =========================================================================
  // 17. Income Tax Calculator (US — 2024 Single Filer)
  // =========================================================================
  {
    id: 'income-tax-us',
    slug: 'income-tax-us',
    title: 'Income Tax Calculator (US)',
    description:
      'Estimate your 2024 US federal income tax using the progressive tax bracket system for single filers.',
    icon: '🗽',
    category: 'finance',
    subcategory: 'taxes',
    tags: ['income tax', 'federal tax', 'tax brackets', '2024', 'single filer', 'marginal rate'],
    inputs: [
      {
        id: 'grossIncome',
        label: 'Gross Annual Income ($)',
        type: 'number',
        min: 0,
        defaultValue: 75000,
        placeholder: 'e.g. 75000',
        required: true,
      },
      {
        id: 'deductions',
        label: 'Total Deductions ($)',
        type: 'number',
        min: 0,
        defaultValue: 14600,
        placeholder: 'e.g. 14600',
        required: true,
        helpText: '2024 standard deduction for single filers is $14,600.',
      },
      {
        id: 'filingStatus',
        label: 'Filing Status',
        type: 'select',
        options: [
          { label: 'Single', value: '0' },
        ],
        defaultValue: '0',
        required: true,
        helpText: 'Currently supports single filer brackets only.',
      },
    ],
    formulas: [
      {
        id: 'taxableIncome',
        expression: 'max(grossIncome - deductions, 0)',
        dependencies: ['grossIncome', 'deductions'],
      },
      {
        id: 'federalTax',
        expression:
          'taxableIncome <= 11600 ? taxableIncome * 0.10 : (taxableIncome <= 47150 ? 1160 + (taxableIncome - 11600) * 0.12 : (taxableIncome <= 100525 ? 5426 + (taxableIncome - 47150) * 0.22 : (taxableIncome <= 191950 ? 17168.50 + (taxableIncome - 100525) * 0.24 : (taxableIncome <= 243725 ? 39110.50 + (taxableIncome - 191950) * 0.32 : (taxableIncome <= 609350 ? 55678.50 + (taxableIncome - 243725) * 0.35 : 183647.25 + (taxableIncome - 609350) * 0.37)))))',
        dependencies: ['taxableIncome'],
      },
      {
        id: 'effectiveRate',
        expression: 'federalTax / grossIncome * 100',
        dependencies: ['federalTax', 'grossIncome'],
      },
      {
        id: 'marginalRate',
        expression:
          'taxableIncome <= 11600 ? 10 : (taxableIncome <= 47150 ? 12 : (taxableIncome <= 100525 ? 22 : (taxableIncome <= 191950 ? 24 : (taxableIncome <= 243725 ? 32 : (taxableIncome <= 609350 ? 35 : 37)))))',
        dependencies: ['taxableIncome'],
      },
      {
        id: 'afterTax',
        expression: 'grossIncome - federalTax',
        dependencies: ['grossIncome', 'federalTax'],
      },
      {
        id: 'monthlyAfterTax',
        expression: 'afterTax / 12',
        dependencies: ['afterTax'],
      },
    ],
    outputs: [
      {
        id: 'federal-tax',
        label: 'Federal Income Tax',
        formulaRef: 'federalTax',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
      {
        id: 'effective-rate',
        label: 'Effective Tax Rate',
        formulaRef: 'effectiveRate',
        format: 'percentage',
        precision: 2,
      },
      {
        id: 'marginal-rate',
        label: 'Marginal Tax Bracket',
        formulaRef: 'marginalRate',
        format: 'percentage',
        precision: 0,
      },
      {
        id: 'taxable-income',
        label: 'Taxable Income',
        formulaRef: 'taxableIncome',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'after-tax-income',
        label: 'After-Tax Income',
        formulaRef: 'afterTax',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'monthly-after-tax',
        label: 'Monthly After-Tax Income',
        formulaRef: 'monthlyAfterTax',
        format: 'currency',
        precision: 2,
      },
    ],
    guide: {
      whatIsIt:
        'The US Income Tax Calculator estimates your 2024 federal income tax using the progressive bracket system for single filers. It shows your effective rate (what you actually pay as a percentage of gross income) vs. your marginal rate (the bracket your last dollar falls into).',
      howToUse:
        'Enter your total gross income and deductions. The default deduction of $14,600 is the 2024 standard deduction for single filers. If you itemize and your itemized deductions exceed the standard, enter that higher amount instead. The calculator computes taxable income and applies each bracket progressively.',
      exampleScenario:
        'With $75,000 gross income and the $14,600 standard deduction, taxable income is $60,400. Federal tax is approximately $8,342. The effective rate is about 11.1% and the marginal bracket is 22%. After-tax income is $66,658 or $5,555/month.',
      proTip:
        'Your marginal rate is not what you pay on all income — only on the last dollars. A 22% marginal bracket does not mean 22% of your income goes to taxes. Maximize pre-tax deductions (401k, HSA, traditional IRA) to shift income out of your highest bracket.',
    },
    metadata: { version: '1.0.0', lastUpdated: '2024-01' },
  },
];
