// ---------------------------------------------------------------------------
// Quantify — Retirement & Social Security Calculators
// ---------------------------------------------------------------------------
// Seventeen calculators covering retirement planning, 401(k) contributions,
// IRA comparisons, Required Minimum Distributions, 72(t) SEPP, Social
// Security benefits & taxation, and annuity payouts.
// ---------------------------------------------------------------------------

import type { CalculatorSchema } from '@/types/calculator';

export const retirementCalculators: CalculatorSchema[] = [
  // =========================================================================
  // 1. Retirement Planner
  // =========================================================================
  {
    id: 'retirement-planner',
    slug: 'retirement-planner',
    title: 'Retirement Planner',
    description:
      'Comprehensive retirement planner that projects your savings, adjusts for inflation, and checks whether your nest egg can sustain your desired income.',
    icon: '🏖️',
    category: 'finance',
    subcategory: 'retirement',
    tags: ['retirement', 'planner', 'savings', 'inflation', 'income', 'future value'],
    inputs: [
      {
        id: 'currentAge',
        label: 'Current Age',
        type: 'number',
        min: 18,
        max: 100,
        step: 1,
        defaultValue: 30,
        placeholder: 'e.g. 30',
        required: true,
      },
      {
        id: 'retirementAge',
        label: 'Retirement Age',
        type: 'number',
        min: 30,
        max: 100,
        step: 1,
        defaultValue: 65,
        placeholder: 'e.g. 65',
        required: true,
      },
      {
        id: 'currentSavings',
        label: 'Current Savings ($)',
        type: 'number',
        min: 0,
        step: 1000,
        defaultValue: 50000,
        placeholder: 'e.g. 50000',
        required: true,
      },
      {
        id: 'monthlySavings',
        label: 'Monthly Savings ($)',
        type: 'number',
        min: 0,
        step: 100,
        defaultValue: 1000,
        placeholder: 'e.g. 1000',
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
        id: 'inflationRate',
        label: 'Inflation Rate (%)',
        type: 'number',
        min: 0,
        max: 20,
        step: 0.1,
        defaultValue: 3,
        placeholder: 'e.g. 3',
        required: true,
      },
      {
        id: 'desiredMonthlyIncome',
        label: 'Desired Monthly Income in Retirement ($)',
        type: 'number',
        min: 0,
        step: 100,
        defaultValue: 5000,
        placeholder: 'e.g. 5000',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'yearsToRetire',
        expression: 'retirementAge - currentAge',
        dependencies: ['retirementAge', 'currentAge'],
      },
      {
        id: 'monthsToRetire',
        expression: 'yearsToRetire * 12',
        dependencies: ['yearsToRetire'],
      },
      {
        id: 'monthlyRate',
        expression: 'annualReturn / 100 / 12',
        dependencies: ['annualReturn'],
      },
      {
        id: 'retirementFund',
        expression: 'fv(monthlyRate, monthsToRetire, monthlySavings * -1, currentSavings * -1)',
        dependencies: ['monthlyRate', 'monthsToRetire', 'monthlySavings', 'currentSavings'],
      },
      {
        id: 'realReturn',
        expression: '(1 + annualReturn / 100) / (1 + inflationRate / 100) - 1',
        dependencies: ['annualReturn', 'inflationRate'],
      },
      {
        id: 'monthlyRealReturn',
        expression: 'realReturn / 12',
        dependencies: ['realReturn'],
      },
      {
        id: 'yearsInRetirement',
        expression: '30',
        dependencies: [],
      },
      {
        id: 'monthsInRetirement',
        expression: '360',
        dependencies: [],
      },
      {
        id: 'fundNeeded',
        expression: 'annuity_pv(desiredMonthlyIncome, monthlyRealReturn, monthsInRetirement)',
        dependencies: ['desiredMonthlyIncome', 'monthlyRealReturn', 'monthsInRetirement'],
      },
      {
        id: 'surplus',
        expression: 'retirementFund - fundNeeded',
        dependencies: ['retirementFund', 'fundNeeded'],
      },
    ],
    outputs: [
      {
        id: 'years-to-retire',
        label: 'Years Until Retirement',
        formulaRef: 'yearsToRetire',
        format: 'number',
        precision: 0,
        suffix: ' years',
      },
      {
        id: 'projected-fund',
        label: 'Projected Retirement Fund',
        formulaRef: 'retirementFund',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
      {
        id: 'fund-needed',
        label: 'Fund Needed (30-year retirement)',
        formulaRef: 'fundNeeded',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'surplus-or-shortfall',
        label: 'Surplus / Shortfall',
        formulaRef: 'surplus',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
    ],
    guide: {
      whatIsIt:
        'A comprehensive retirement planning tool that projects how much your savings will grow by retirement, then checks whether that fund can sustain your desired monthly income for 30 years — all adjusted for inflation using the real rate of return.',
      howToUse:
        'Enter your current age, target retirement age, current savings, and how much you save each month. Set your expected annual return and inflation rate. Finally, specify the monthly income you want in retirement. The calculator will show whether your projected fund exceeds or falls short of the amount needed.',
      exampleScenario:
        'A 30-year-old with $50,000 saved, contributing $1,000/month at 7% return and 3% inflation, wanting $5,000/month in retirement. The planner projects the retirement fund and compares it to the inflation-adjusted cost of 30 years of withdrawals.',
      proTip:
        'A positive surplus means you are on track. If you see a shortfall, try increasing monthly savings or delaying retirement by a few years — even 2–3 extra years of compounding can make a significant difference.',
    },
    metadata: {
      version: '1.0.0',
      lastUpdated: '2024-01',
    },
  },

  // =========================================================================
  // 2. Retirement Calculator (Simple)
  // =========================================================================
  {
    id: 'retirement-calculator',
    slug: 'retirement-calculator',
    title: 'Retirement Calculator',
    description:
      'Estimate the future value of your retirement savings based on monthly contributions and expected returns.',
    icon: '💰',
    category: 'finance',
    subcategory: 'retirement',
    tags: ['retirement', 'savings', 'future value', 'compound interest', 'investment'],
    inputs: [
      {
        id: 'currentSavings',
        label: 'Current Savings ($)',
        type: 'number',
        min: 0,
        step: 1000,
        defaultValue: 25000,
        placeholder: 'e.g. 25000',
        required: true,
      },
      {
        id: 'monthlyContribution',
        label: 'Monthly Contribution ($)',
        type: 'number',
        min: 0,
        step: 50,
        defaultValue: 500,
        placeholder: 'e.g. 500',
        required: true,
      },
      {
        id: 'annualReturn',
        label: 'Annual Return (%)',
        type: 'number',
        min: 0,
        max: 30,
        step: 0.1,
        defaultValue: 7,
        placeholder: 'e.g. 7',
        required: true,
      },
      {
        id: 'yearsUntilRetirement',
        label: 'Years Until Retirement',
        type: 'number',
        min: 1,
        max: 60,
        step: 1,
        defaultValue: 30,
        placeholder: 'e.g. 30',
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
        expression: 'yearsUntilRetirement * 12',
        dependencies: ['yearsUntilRetirement'],
      },
      {
        id: 'retirementFund',
        expression: 'fv(monthlyRate, totalMonths, monthlyContribution * -1, currentSavings * -1)',
        dependencies: ['monthlyRate', 'totalMonths', 'monthlyContribution', 'currentSavings'],
      },
      {
        id: 'totalContributed',
        expression: 'currentSavings + monthlyContribution * totalMonths',
        dependencies: ['currentSavings', 'monthlyContribution', 'totalMonths'],
      },
      {
        id: 'interestEarned',
        expression: 'retirementFund - totalContributed',
        dependencies: ['retirementFund', 'totalContributed'],
      },
    ],
    outputs: [
      {
        id: 'retirement-fund',
        label: 'Projected Retirement Fund',
        formulaRef: 'retirementFund',
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
        'A simple retirement calculator that uses the future value formula to project how much your current savings plus ongoing monthly contributions will grow over time, given a fixed annual return.',
      howToUse:
        'Enter your current savings balance, how much you contribute each month, the expected annual return rate, and the number of years until retirement. The calculator shows your projected nest egg, total contributions, and total interest earned.',
      exampleScenario:
        'Starting with $25,000 and contributing $500/month at 7% annual return for 30 years yields roughly $637,000 — of which $205,000 is contributions and $432,000 is compound interest.',
      proTip:
        'The power of compounding means early contributions matter most. An extra $100/month starting 10 years earlier can be worth more than an extra $300/month later.',
    },
    metadata: {
      version: '1.0.0',
      lastUpdated: '2024-01',
    },
  },

  // =========================================================================
  // 3. Retirement Savings Analysis
  // =========================================================================
  {
    id: 'retirement-savings-analysis',
    slug: 'retirement-savings-analysis',
    title: 'Retirement Savings Analysis',
    description:
      'Analyze your retirement readiness using the safe-withdrawal-rate method to estimate sustainable annual and monthly income.',
    icon: '📊',
    category: 'finance',
    subcategory: 'retirement',
    tags: ['retirement', 'savings', 'withdrawal rate', '4% rule', 'analysis'],
    inputs: [
      {
        id: 'currentAge',
        label: 'Current Age',
        type: 'number',
        min: 18,
        max: 100,
        step: 1,
        defaultValue: 35,
        placeholder: 'e.g. 35',
        required: true,
      },
      {
        id: 'retirementAge',
        label: 'Retirement Age',
        type: 'number',
        min: 30,
        max: 100,
        step: 1,
        defaultValue: 65,
        placeholder: 'e.g. 65',
        required: true,
      },
      {
        id: 'currentSavings',
        label: 'Current Savings ($)',
        type: 'number',
        min: 0,
        step: 1000,
        defaultValue: 100000,
        placeholder: 'e.g. 100000',
        required: true,
      },
      {
        id: 'monthlyContribution',
        label: 'Monthly Contribution ($)',
        type: 'number',
        min: 0,
        step: 100,
        defaultValue: 1500,
        placeholder: 'e.g. 1500',
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
        label: 'Safe Withdrawal Rate (%)',
        type: 'number',
        min: 1,
        max: 10,
        step: 0.1,
        defaultValue: 4,
        placeholder: 'e.g. 4',
        helpText: 'The classic "4% rule" is a common starting point.',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'yearsToRetire',
        expression: 'retirementAge - currentAge',
        dependencies: ['retirementAge', 'currentAge'],
      },
      {
        id: 'monthlyRate',
        expression: 'annualReturn / 100 / 12',
        dependencies: ['annualReturn'],
      },
      {
        id: 'totalMonths',
        expression: 'yearsToRetire * 12',
        dependencies: ['yearsToRetire'],
      },
      {
        id: 'retirementFund',
        expression: 'fv(monthlyRate, totalMonths, monthlyContribution * -1, currentSavings * -1)',
        dependencies: ['monthlyRate', 'totalMonths', 'monthlyContribution', 'currentSavings'],
      },
      {
        id: 'annualWithdrawal',
        expression: 'retirementFund * withdrawalRate / 100',
        dependencies: ['retirementFund', 'withdrawalRate'],
      },
      {
        id: 'monthlyWithdrawal',
        expression: 'annualWithdrawal / 12',
        dependencies: ['annualWithdrawal'],
      },
      {
        id: 'yearsOfIncome',
        expression: 'retirementFund / annualWithdrawal',
        dependencies: ['retirementFund', 'annualWithdrawal'],
      },
    ],
    outputs: [
      {
        id: 'retirement-fund',
        label: 'Projected Retirement Fund',
        formulaRef: 'retirementFund',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
      {
        id: 'annual-withdrawal',
        label: 'Sustainable Annual Income',
        formulaRef: 'annualWithdrawal',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'monthly-withdrawal',
        label: 'Sustainable Monthly Income',
        formulaRef: 'monthlyWithdrawal',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
      {
        id: 'years-of-income',
        label: 'Years of Income (simple)',
        formulaRef: 'yearsOfIncome',
        format: 'number',
        precision: 1,
        suffix: ' years',
      },
    ],
    guide: {
      whatIsIt:
        'A retirement savings analysis tool that projects your nest egg at retirement, then applies a safe withdrawal rate (like the famous 4% rule) to estimate how much income your savings can sustainably generate each year.',
      howToUse:
        'Enter your current age, retirement age, savings, monthly contribution, expected return, and desired withdrawal rate. The calculator projects your fund at retirement and calculates the annual and monthly income it can support.',
      exampleScenario:
        'A 35-year-old with $100,000 saved, contributing $1,500/month at 7% return, targeting a 4% withdrawal rate. By 65, the projected fund is roughly $2.06M, supporting about $82,400/year or $6,867/month.',
      proTip:
        'The 4% rule was designed for a 30-year retirement. If you retire early, consider a lower withdrawal rate (3–3.5%) to reduce the risk of running out of money.',
    },
    metadata: {
      version: '1.0.0',
      lastUpdated: '2024-01',
    },
  },

  // =========================================================================
  // 4. Retirement Saving Calculator (Goal-Based)
  // =========================================================================
  {
    id: 'retirement-saving',
    slug: 'retirement-saving',
    title: 'Retirement Saving Calculator',
    description:
      'Determine how much you need to save each month to reach a specific retirement goal.',
    icon: '🎯',
    category: 'finance',
    subcategory: 'retirement',
    tags: ['retirement', 'goal', 'savings', 'monthly payment', 'target'],
    inputs: [
      {
        id: 'retirementGoal',
        label: 'Retirement Savings Goal ($)',
        type: 'number',
        min: 0,
        step: 10000,
        defaultValue: 1000000,
        placeholder: 'e.g. 1000000',
        required: true,
      },
      {
        id: 'currentSavings',
        label: 'Current Savings ($)',
        type: 'number',
        min: 0,
        step: 1000,
        defaultValue: 50000,
        placeholder: 'e.g. 50000',
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
        id: 'yearsUntilRetirement',
        label: 'Years Until Retirement',
        type: 'number',
        min: 1,
        max: 60,
        step: 1,
        defaultValue: 25,
        placeholder: 'e.g. 25',
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
        expression: 'yearsUntilRetirement * 12',
        dependencies: ['yearsUntilRetirement'],
      },
      {
        id: 'monthlySavingsNeeded',
        expression: 'abs(pmt(monthlyRate, totalMonths, currentSavings * -1, retirementGoal))',
        dependencies: ['monthlyRate', 'totalMonths', 'currentSavings', 'retirementGoal'],
      },
      {
        id: 'totalContributed',
        expression: 'monthlySavingsNeeded * totalMonths + currentSavings',
        dependencies: ['monthlySavingsNeeded', 'totalMonths', 'currentSavings'],
      },
      {
        id: 'interestEarned',
        expression: 'retirementGoal - totalContributed',
        dependencies: ['retirementGoal', 'totalContributed'],
      },
    ],
    outputs: [
      {
        id: 'monthly-savings-needed',
        label: 'Required Monthly Savings',
        formulaRef: 'monthlySavingsNeeded',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
      {
        id: 'total-contributed',
        label: 'Total You Will Contribute',
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
        'A goal-based retirement savings calculator that works backwards from your target nest egg. It tells you exactly how much to save each month to reach your retirement goal, accounting for existing savings and expected investment returns.',
      howToUse:
        'Set your retirement savings goal (e.g. $1,000,000), current savings, expected annual return, and years until retirement. The calculator computes the monthly savings required, total contributions, and how much comes from interest.',
      exampleScenario:
        'To reach $1,000,000 in 25 years starting with $50,000 at 7% return, you would need to save roughly $1,050/month. Of the $1M goal, about $365,000 comes from contributions and $635,000 from compound interest.',
      proTip:
        'If the required monthly savings feels too high, consider extending your retirement date or increasing your target return through a more growth-oriented portfolio — just be mindful of the additional risk.',
    },
    metadata: {
      version: '1.0.0',
      lastUpdated: '2024-01',
    },
  },

  // =========================================================================
  // 5. Retirement Income Calculator
  // =========================================================================
  {
    id: 'retirement-income',
    slug: 'retirement-income',
    title: 'Retirement Income Calculator',
    description:
      'Calculate sustainable inflation-adjusted monthly and annual income from your retirement savings over a specified payout period.',
    icon: '💵',
    category: 'finance',
    subcategory: 'retirement',
    tags: ['retirement', 'income', 'withdrawal', 'inflation', 'payout'],
    inputs: [
      {
        id: 'retirementSavings',
        label: 'Total Retirement Savings ($)',
        type: 'number',
        min: 0,
        step: 10000,
        defaultValue: 1000000,
        placeholder: 'e.g. 1000000',
        required: true,
      },
      {
        id: 'annualReturn',
        label: 'Annual Return in Retirement (%)',
        type: 'number',
        min: 0,
        max: 20,
        step: 0.1,
        defaultValue: 5,
        placeholder: 'e.g. 5',
        required: true,
      },
      {
        id: 'retirementYears',
        label: 'Years in Retirement',
        type: 'number',
        min: 1,
        max: 50,
        step: 1,
        defaultValue: 30,
        placeholder: 'e.g. 30',
        required: true,
      },
      {
        id: 'inflationRate',
        label: 'Inflation Rate (%)',
        type: 'number',
        min: 0,
        max: 15,
        step: 0.1,
        defaultValue: 3,
        placeholder: 'e.g. 3',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'realReturn',
        expression: '(1 + annualReturn / 100) / (1 + inflationRate / 100) - 1',
        dependencies: ['annualReturn', 'inflationRate'],
      },
      {
        id: 'monthlyRealReturn',
        expression: 'realReturn / 12',
        dependencies: ['realReturn'],
      },
      {
        id: 'totalMonths',
        expression: 'retirementYears * 12',
        dependencies: ['retirementYears'],
      },
      {
        id: 'monthlyIncome',
        expression: 'abs(pmt(monthlyRealReturn, totalMonths, retirementSavings))',
        dependencies: ['monthlyRealReturn', 'totalMonths', 'retirementSavings'],
      },
      {
        id: 'annualIncome',
        expression: 'monthlyIncome * 12',
        dependencies: ['monthlyIncome'],
      },
    ],
    outputs: [
      {
        id: 'monthly-income',
        label: 'Monthly Income (inflation-adjusted)',
        formulaRef: 'monthlyIncome',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
      {
        id: 'annual-income',
        label: 'Annual Income (inflation-adjusted)',
        formulaRef: 'annualIncome',
        format: 'currency',
        precision: 2,
      },
    ],
    guide: {
      whatIsIt:
        'A retirement income calculator that determines how much you can withdraw each month from your savings over a set number of years, using the real (inflation-adjusted) rate of return so your purchasing power stays constant.',
      howToUse:
        'Enter your total retirement savings, the return rate you expect in retirement, how many years you plan to draw income, and the expected inflation rate. The calculator computes a level monthly income that depletes your savings over the specified period while maintaining purchasing power.',
      exampleScenario:
        'With $1,000,000 saved, 5% annual return, 3% inflation, and a 30-year retirement, your inflation-adjusted monthly income would be approximately $4,300.',
      proTip:
        'The real rate of return is what actually matters. A 5% nominal return with 3% inflation gives you only about 1.94% real return — so resist the urge to use nominal returns when planning withdrawal rates.',
    },
    metadata: {
      version: '1.0.0',
      lastUpdated: '2024-01',
    },
  },

  // =========================================================================
  // 6. Retirement Income Analysis
  // =========================================================================
  {
    id: 'retirement-income-analysis',
    slug: 'retirement-income-analysis',
    title: 'Retirement Income Analysis',
    description:
      'Analyze whether your combined retirement income sources (savings, Social Security, pension) cover your monthly expenses and for how long.',
    icon: '📋',
    category: 'finance',
    subcategory: 'retirement',
    tags: ['retirement', 'income', 'social security', 'pension', 'expenses', 'gap analysis'],
    inputs: [
      {
        id: 'retirementSavings',
        label: 'Retirement Savings ($)',
        type: 'number',
        min: 0,
        step: 10000,
        defaultValue: 800000,
        placeholder: 'e.g. 800000',
        required: true,
      },
      {
        id: 'monthlyExpenses',
        label: 'Monthly Expenses ($)',
        type: 'number',
        min: 0,
        step: 100,
        defaultValue: 5000,
        placeholder: 'e.g. 5000',
        required: true,
      },
      {
        id: 'socialSecurityMonthly',
        label: 'Social Security Monthly ($)',
        type: 'number',
        min: 0,
        step: 100,
        defaultValue: 2000,
        placeholder: 'e.g. 2000',
        required: true,
      },
      {
        id: 'pensionMonthly',
        label: 'Pension Monthly ($)',
        type: 'number',
        min: 0,
        step: 100,
        defaultValue: 0,
        placeholder: 'e.g. 500',
      },
      {
        id: 'annualReturn',
        label: 'Annual Return on Savings (%)',
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
        id: 'monthlyNeed',
        expression: 'monthlyExpenses - socialSecurityMonthly - pensionMonthly',
        dependencies: ['monthlyExpenses', 'socialSecurityMonthly', 'pensionMonthly'],
      },
      {
        id: 'monthlyRate',
        expression: 'annualReturn / 100 / 12',
        dependencies: ['annualReturn'],
      },
      {
        id: 'yearsOfFunding',
        expression:
          'monthlyNeed > 0 ? abs(nper(monthlyRate, monthlyNeed * -1, retirementSavings)) / 12 : 99',
        dependencies: ['monthlyNeed', 'monthlyRate', 'retirementSavings'],
      },
      {
        id: 'incomeGap',
        expression: 'monthlyNeed > 0 ? monthlyNeed : 0',
        dependencies: ['monthlyNeed'],
      },
      {
        id: 'surplusOrDeficit',
        expression: 'socialSecurityMonthly + pensionMonthly - monthlyExpenses',
        dependencies: ['socialSecurityMonthly', 'pensionMonthly', 'monthlyExpenses'],
      },
    ],
    outputs: [
      {
        id: 'monthly-gap',
        label: 'Monthly Income Gap',
        formulaRef: 'incomeGap',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
      {
        id: 'years-funded',
        label: 'Years Savings Will Last',
        formulaRef: 'yearsOfFunding',
        format: 'number',
        precision: 1,
        suffix: ' years',
        highlight: true,
      },
      {
        id: 'surplus-deficit',
        label: 'Monthly Surplus / Deficit (before savings)',
        formulaRef: 'surplusOrDeficit',
        format: 'currency',
        precision: 2,
      },
    ],
    guide: {
      whatIsIt:
        'A retirement income analysis tool that compares your monthly expenses against all your income sources — Social Security, pension, and investment withdrawals from savings — to identify any income gap and how long your savings can cover it.',
      howToUse:
        'Enter your retirement savings, monthly expenses, Social Security benefit, pension income, and the return you expect on savings. The calculator identifies your monthly shortfall and estimates how many years your savings can bridge the gap.',
      exampleScenario:
        'With $800,000 saved, $5,000/month expenses, $2,000 Social Security, and no pension at 4% return, you need $3,000/month from savings. Your nest egg would last roughly 32 years.',
      proTip:
        'If your Social Security and pension fully cover expenses, the gap is zero and your savings essentially become a reserve fund. Consider a conservative allocation for that cushion rather than a growth portfolio.',
    },
    metadata: {
      version: '1.0.0',
      lastUpdated: '2024-01',
    },
  },

  // =========================================================================
  // 7. 401(k) Contribution Calculator
  // =========================================================================
  {
    id: '401k-contribution',
    slug: '401k-contribution',
    title: '401(k) Contribution Calculator',
    description:
      'Project your 401(k) balance at retirement based on your contribution rate, employer match, and expected returns.',
    icon: '🏢',
    category: 'finance',
    subcategory: 'retirement',
    tags: ['401k', 'contribution', 'employer match', 'retirement', 'tax savings'],
    inputs: [
      {
        id: 'annualSalary',
        label: 'Annual Salary ($)',
        type: 'number',
        min: 0,
        step: 1000,
        defaultValue: 80000,
        placeholder: 'e.g. 80000',
        required: true,
      },
      {
        id: 'contributionPercent',
        label: 'Your Contribution (%)',
        type: 'range',
        min: 1,
        max: 100,
        step: 1,
        defaultValue: 10,
        required: true,
      },
      {
        id: 'employerMatchPercent',
        label: 'Employer Match (%)',
        type: 'number',
        min: 0,
        max: 100,
        step: 1,
        defaultValue: 50,
        placeholder: 'e.g. 50',
        helpText: 'Percentage your employer matches (e.g. 50 means 50¢ per $1).',
        required: true,
      },
      {
        id: 'employerMatchLimit',
        label: 'Employer Match Limit (% of salary)',
        type: 'number',
        min: 0,
        max: 100,
        step: 1,
        defaultValue: 6,
        placeholder: 'e.g. 6',
        helpText: 'Employer matches up to this % of your salary.',
        required: true,
      },
      {
        id: 'annualReturn',
        label: 'Annual Return (%)',
        type: 'number',
        min: 0,
        max: 30,
        step: 0.1,
        defaultValue: 7,
        placeholder: 'e.g. 7',
        required: true,
      },
      {
        id: 'currentBalance',
        label: 'Current 401(k) Balance ($)',
        type: 'number',
        min: 0,
        step: 1000,
        defaultValue: 30000,
        placeholder: 'e.g. 30000',
        required: true,
      },
      {
        id: 'yearsToRetirement',
        label: 'Years to Retirement',
        type: 'number',
        min: 1,
        max: 50,
        step: 1,
        defaultValue: 25,
        placeholder: 'e.g. 25',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'annualContrib',
        expression: 'annualSalary * contributionPercent / 100',
        dependencies: ['annualSalary', 'contributionPercent'],
      },
      {
        id: 'cappedContrib',
        expression: 'min(annualContrib, 23000)',
        dependencies: ['annualContrib'],
      },
      {
        id: 'employerMatch',
        expression: 'min(annualSalary * employerMatchPercent / 100 * employerMatchLimit / 100, annualSalary * employerMatchLimit / 100)',
        dependencies: ['annualSalary', 'employerMatchPercent', 'employerMatchLimit'],
      },
      {
        id: 'monthlyTotal',
        expression: '(cappedContrib + employerMatch) / 12',
        dependencies: ['cappedContrib', 'employerMatch'],
      },
      {
        id: 'monthlyRate',
        expression: 'annualReturn / 100 / 12',
        dependencies: ['annualReturn'],
      },
      {
        id: 'totalMonths',
        expression: 'yearsToRetirement * 12',
        dependencies: ['yearsToRetirement'],
      },
      {
        id: 'futureValue',
        expression: 'fv(monthlyRate, totalMonths, monthlyTotal * -1, currentBalance * -1)',
        dependencies: ['monthlyRate', 'totalMonths', 'monthlyTotal', 'currentBalance'],
      },
      {
        id: 'taxSavings',
        expression: 'cappedContrib * 0.22',
        dependencies: ['cappedContrib'],
      },
    ],
    outputs: [
      {
        id: 'projected-balance',
        label: 'Projected 401(k) Balance',
        formulaRef: 'futureValue',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
      {
        id: 'your-annual-contrib',
        label: 'Your Annual Contribution (capped)',
        formulaRef: 'cappedContrib',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'employer-match',
        label: 'Employer Annual Match',
        formulaRef: 'employerMatch',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'tax-savings',
        label: 'Estimated Annual Tax Savings (22%)',
        formulaRef: 'taxSavings',
        format: 'currency',
        precision: 2,
      },
    ],
    guide: {
      whatIsIt:
        'A 401(k) contribution calculator that projects your account balance at retirement, factoring in your contributions (capped at the 2024 IRS limit of $23,000), employer match, and compound investment growth.',
      howToUse:
        'Enter your annual salary, contribution percentage, employer match rate and cap, current balance, expected return, and years to retirement. The calculator applies the 2024 elective deferral limit and estimates your projected balance and annual tax savings.',
      exampleScenario:
        'An employee earning $80,000, contributing 10% ($8,000/year), with a 50% employer match up to 6% of salary ($2,400 match), at 7% return with $30,000 already saved over 25 years would accumulate roughly $890,000.',
      proTip:
        'Always contribute at least enough to get the full employer match — it is an immediate 50–100% return on your money. Leaving match money on the table is the most expensive retirement mistake.',
    },
    metadata: {
      version: '1.0.0',
      lastUpdated: '2024-01',
    },
  },

  // =========================================================================
  // 8. 401(k) Save the Max
  // =========================================================================
  {
    id: '401k-save-the-max',
    slug: '401k-save-the-max',
    title: '401(k) Save the Max',
    description:
      'Find out what contribution percentage and per-paycheck amount you need to max out your 401(k) in 2024, including catch-up contributions for age 50+.',
    icon: '🚀',
    category: 'finance',
    subcategory: 'retirement',
    tags: ['401k', 'max contribution', 'catch-up', 'paycheck', 'salary'],
    inputs: [
      {
        id: 'annualSalary',
        label: 'Annual Salary ($)',
        type: 'number',
        min: 0,
        step: 1000,
        defaultValue: 100000,
        placeholder: 'e.g. 100000',
        required: true,
      },
      {
        id: 'currentContribPercent',
        label: 'Current Contribution (%)',
        type: 'number',
        min: 0,
        max: 100,
        step: 0.5,
        defaultValue: 6,
        placeholder: 'e.g. 6',
        required: true,
      },
      {
        id: 'age',
        label: 'Your Age',
        type: 'number',
        min: 18,
        max: 100,
        step: 1,
        defaultValue: 40,
        placeholder: 'e.g. 40',
        helpText: 'Age 50+ qualifies for catch-up contributions ($7,500 extra in 2024).',
        required: true,
      },
      {
        id: 'payPeriodsPerYear',
        label: 'Pay Periods Per Year',
        type: 'select',
        defaultValue: '24',
        options: [
          { label: 'Monthly (12)', value: '12' },
          { label: 'Semi-Monthly (24)', value: '24' },
          { label: 'Bi-Weekly (26)', value: '26' },
          { label: 'Weekly (52)', value: '52' },
        ],
        required: true,
      },
    ],
    formulas: [
      {
        id: 'maxContrib',
        expression: 'age >= 50 ? 30500 : 23000',
        dependencies: ['age'],
      },
      {
        id: 'currentAnnual',
        expression: 'annualSalary * currentContribPercent / 100',
        dependencies: ['annualSalary', 'currentContribPercent'],
      },
      {
        id: 'neededPercent',
        expression: 'maxContrib / annualSalary * 100',
        dependencies: ['maxContrib', 'annualSalary'],
      },
      {
        id: 'perPaycheck',
        expression: 'maxContrib / payPeriodsPerYear',
        dependencies: ['maxContrib', 'payPeriodsPerYear'],
      },
      {
        id: 'additionalPerPaycheck',
        expression: '(maxContrib - currentAnnual) / payPeriodsPerYear',
        dependencies: ['maxContrib', 'currentAnnual', 'payPeriodsPerYear'],
      },
    ],
    outputs: [
      {
        id: 'max-contribution',
        label: '2024 Max Contribution',
        formulaRef: 'maxContrib',
        format: 'currency',
        precision: 0,
        highlight: true,
      },
      {
        id: 'current-annual',
        label: 'Your Current Annual Contribution',
        formulaRef: 'currentAnnual',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'needed-percent',
        label: 'Contribution % Needed to Max Out',
        formulaRef: 'neededPercent',
        format: 'percentage',
        precision: 1,
        highlight: true,
      },
      {
        id: 'per-paycheck',
        label: 'Per-Paycheck Deduction to Max',
        formulaRef: 'perPaycheck',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'additional-per-paycheck',
        label: 'Additional Per-Paycheck Needed',
        formulaRef: 'additionalPerPaycheck',
        format: 'currency',
        precision: 2,
      },
    ],
    guide: {
      whatIsIt:
        'A tool to help you figure out exactly what it takes to max out your 401(k) contributions for 2024. It accounts for the standard $23,000 limit and the $7,500 catch-up for those 50 and older, and translates that into a per-paycheck deduction.',
      howToUse:
        'Enter your annual salary, current contribution percentage, age, and pay frequency. The calculator shows the IRS maximum, the percentage of salary you need to contribute, and the per-paycheck dollar amount — including how much more you need beyond your current rate.',
      exampleScenario:
        'Earning $100,000 at age 40, paid semi-monthly (24 periods). The max is $23,000, requiring a 23% contribution rate. Per paycheck, that is $958.33. If you currently contribute 6% ($250/paycheck), you need an additional $708.33 per paycheck.',
      proTip:
        'Some employers stop matching once you hit the IRS limit. Check if your plan has a "true-up" provision — without it, maxing out too early in the year means missing match contributions in later pay periods.',
    },
    metadata: {
      version: '1.0.0',
      lastUpdated: '2024-01',
    },
  },

  // =========================================================================
  // 9. Traditional IRA vs Roth IRA
  // =========================================================================
  {
    id: 'traditional-vs-roth-ira',
    slug: 'traditional-vs-roth-ira',
    title: 'Traditional IRA vs Roth IRA',
    description:
      'Compare after-tax retirement balances between a Traditional IRA (tax-deferred) and a Roth IRA (tax-free growth) to see which benefits you more.',
    icon: '⚖️',
    category: 'finance',
    subcategory: 'retirement',
    tags: ['IRA', 'Roth', 'Traditional', 'tax', 'comparison', 'retirement'],
    inputs: [
      {
        id: 'annualContribution',
        label: 'Annual IRA Contribution ($)',
        type: 'number',
        min: 0,
        max: 7000,
        step: 100,
        defaultValue: 7000,
        placeholder: 'e.g. 7000',
        helpText: '2024 IRA contribution limit is $7,000 ($8,000 if 50+).',
        required: true,
      },
      {
        id: 'currentTaxRate',
        label: 'Current Marginal Tax Rate (%)',
        type: 'number',
        min: 0,
        max: 50,
        step: 1,
        defaultValue: 24,
        placeholder: 'e.g. 24',
        required: true,
      },
      {
        id: 'retirementTaxRate',
        label: 'Expected Retirement Tax Rate (%)',
        type: 'number',
        min: 0,
        max: 50,
        step: 1,
        defaultValue: 22,
        placeholder: 'e.g. 22',
        required: true,
      },
      {
        id: 'annualReturn',
        label: 'Annual Return (%)',
        type: 'number',
        min: 0,
        max: 30,
        step: 0.1,
        defaultValue: 7,
        placeholder: 'e.g. 7',
        required: true,
      },
      {
        id: 'yearsToRetirement',
        label: 'Years to Retirement',
        type: 'number',
        min: 1,
        max: 50,
        step: 1,
        defaultValue: 30,
        placeholder: 'e.g. 30',
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
        expression: 'yearsToRetirement * 12',
        dependencies: ['yearsToRetirement'],
      },
      {
        id: 'monthlyContrib',
        expression: 'annualContribution / 12',
        dependencies: ['annualContribution'],
      },
      {
        id: 'taxDeductionNow',
        expression: 'annualContribution * currentTaxRate / 100',
        dependencies: ['annualContribution', 'currentTaxRate'],
      },
      {
        id: 'traditionalFV',
        expression: 'fv(monthlyRate, totalMonths, monthlyContrib * -1, 0)',
        dependencies: ['monthlyRate', 'totalMonths', 'monthlyContrib'],
      },
      {
        id: 'traditionalAfterTax',
        expression: 'traditionalFV * (1 - retirementTaxRate / 100)',
        dependencies: ['traditionalFV', 'retirementTaxRate'],
      },
      {
        id: 'rothFV',
        expression: 'fv(monthlyRate, totalMonths, monthlyContrib * -1, 0)',
        dependencies: ['monthlyRate', 'totalMonths', 'monthlyContrib'],
      },
      {
        id: 'rothAfterTax',
        expression: 'rothFV',
        dependencies: ['rothFV'],
      },
      {
        id: 'difference',
        expression: 'rothAfterTax - traditionalAfterTax',
        dependencies: ['rothAfterTax', 'traditionalAfterTax'],
      },
    ],
    outputs: [
      {
        id: 'traditional-fv',
        label: 'Traditional IRA (Pre-Tax Balance)',
        formulaRef: 'traditionalFV',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'traditional-after-tax',
        label: 'Traditional IRA (After-Tax Value)',
        formulaRef: 'traditionalAfterTax',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
      {
        id: 'roth-after-tax',
        label: 'Roth IRA (After-Tax Value)',
        formulaRef: 'rothAfterTax',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
      {
        id: 'tax-deduction-annual',
        label: 'Annual Tax Deduction (Traditional)',
        formulaRef: 'taxDeductionNow',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'roth-advantage',
        label: 'Roth Advantage / (Traditional Advantage)',
        formulaRef: 'difference',
        format: 'currency',
        precision: 2,
      },
    ],
    guide: {
      whatIsIt:
        'A side-by-side comparison of Traditional and Roth IRAs. Both grow identically before taxes; the difference lies in when you pay tax. Traditional gives a deduction now but is taxed on withdrawal. Roth has no deduction now but withdrawals are 100% tax-free.',
      howToUse:
        'Enter your annual contribution, current tax rate, expected retirement tax rate, expected return, and years to retirement. The calculator projects both accounts and shows the after-tax value of each, plus the dollar advantage of one over the other.',
      exampleScenario:
        'Contributing $7,000/year at 7% for 30 years grows to ~$829,000. At a 22% retirement tax rate, the Traditional yields ~$647,000 after tax, while the Roth yields $829,000. The Roth advantage is ~$182,000.',
      proTip:
        'If your current tax rate is higher than your expected retirement rate, Traditional wins. If you expect to be in the same or higher bracket later, Roth wins. Many people hedge by splitting contributions across both account types.',
    },
    metadata: {
      version: '1.0.0',
      lastUpdated: '2024-01',
    },
  },

  // =========================================================================
  // 10. Required Minimum Distribution (RMD)
  // =========================================================================
  {
    id: 'rmd-calculator',
    slug: 'rmd-calculator',
    title: 'Required Minimum Distribution (RMD)',
    description:
      'Calculate your Required Minimum Distribution from retirement accounts using IRS Uniform Lifetime Table approximations under SECURE Act 2.0 rules.',
    icon: '📜',
    category: 'finance',
    subcategory: 'retirement',
    tags: ['RMD', 'required minimum distribution', 'IRS', 'SECURE Act', 'withdrawal'],
    inputs: [
      {
        id: 'accountBalance',
        label: 'Account Balance as of Dec 31 ($)',
        type: 'number',
        min: 0,
        step: 10000,
        defaultValue: 500000,
        placeholder: 'e.g. 500000',
        required: true,
      },
      {
        id: 'age',
        label: 'Your Age This Year',
        type: 'number',
        min: 73,
        max: 120,
        step: 1,
        defaultValue: 75,
        placeholder: 'e.g. 75',
        helpText: 'Under SECURE Act 2.0, RMDs begin at age 73 (starting 2023).',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'lifeExpectancy',
        expression:
          'age <= 73 ? 26.5 : (age <= 75 ? 24.6 : (age <= 80 ? 20.2 : (age <= 85 ? 16.0 : (age <= 90 ? 12.2 : (age <= 95 ? 8.9 : 6.1)))))',
        dependencies: ['age'],
      },
      {
        id: 'rmd',
        expression: 'accountBalance / lifeExpectancy',
        dependencies: ['accountBalance', 'lifeExpectancy'],
      },
      {
        id: 'rmdPercent',
        expression: 'rmd / accountBalance * 100',
        dependencies: ['rmd', 'accountBalance'],
      },
    ],
    outputs: [
      {
        id: 'life-expectancy-factor',
        label: 'Distribution Period (years)',
        formulaRef: 'lifeExpectancy',
        format: 'number',
        precision: 1,
        suffix: ' years',
      },
      {
        id: 'rmd-amount',
        label: 'Required Minimum Distribution',
        formulaRef: 'rmd',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
      {
        id: 'rmd-percent',
        label: 'RMD as % of Balance',
        formulaRef: 'rmdPercent',
        format: 'percentage',
        precision: 2,
      },
    ],
    guide: {
      whatIsIt:
        'A Required Minimum Distribution calculator that estimates how much you must withdraw each year from tax-deferred retirement accounts (Traditional IRA, 401(k), etc.). Under the SECURE Act 2.0, RMDs begin at age 73 (effective 2023). The IRS uses the Uniform Lifetime Table to determine the distribution period based on your age.',
      howToUse:
        'Enter your total account balance as of December 31 of the prior year and your age for the current year. The calculator looks up an approximate distribution period and divides your balance by it to compute the minimum you must withdraw.',
      exampleScenario:
        'A 75-year-old with a $500,000 IRA balance has an approximate distribution period of 24.6 years, yielding an RMD of about $20,325 — roughly 4.07% of the account.',
      proTip:
        'Failing to take your full RMD triggers a 25% excise tax on the shortfall (reduced from 50% by SECURE Act 2.0). Set up automatic distributions to avoid accidentally missing the deadline. You can always withdraw MORE than the RMD, but never less.',
    },
    metadata: {
      version: '1.0.0',
      lastUpdated: '2024-01',
    },
  },

  // =========================================================================
  // 11. 72(t) Distribution Calculator
  // =========================================================================
  {
    id: '72t-distribution',
    slug: '72t-distribution',
    title: '72(t) Distribution Calculator',
    description:
      'Calculate Substantially Equal Periodic Payments (SEPP) under IRS Rule 72(t) to access retirement funds before age 59½ without the 10% early withdrawal penalty.',
    icon: '🔓',
    category: 'finance',
    subcategory: 'retirement',
    tags: ['72t', 'SEPP', 'early withdrawal', 'penalty-free', 'retirement'],
    inputs: [
      {
        id: 'accountBalance',
        label: 'Account Balance ($)',
        type: 'number',
        min: 0,
        step: 10000,
        defaultValue: 500000,
        placeholder: 'e.g. 500000',
        required: true,
      },
      {
        id: 'age',
        label: 'Your Age',
        type: 'number',
        min: 30,
        max: 59,
        step: 1,
        defaultValue: 50,
        placeholder: 'e.g. 50',
        helpText: '72(t) is used for early distributions before age 59½.',
        required: true,
      },
      {
        id: 'interestRate',
        label: 'Reasonable Interest Rate (%)',
        type: 'number',
        min: 0,
        max: 10,
        step: 0.1,
        defaultValue: 5,
        placeholder: 'e.g. 5',
        helpText: 'IRS allows a rate ≤ 120% of the federal mid-term rate.',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'lifeExpectancy',
        expression:
          'age <= 40 ? 43.6 : (age <= 45 ? 38.8 : (age <= 50 ? 34.2 : (age <= 55 ? 29.6 : (age <= 59 ? 25.2 : 22.0))))',
        dependencies: ['age'],
      },
      // Method 1: RMD
      {
        id: 'rmdMethod',
        expression: 'accountBalance / lifeExpectancy',
        dependencies: ['accountBalance', 'lifeExpectancy'],
      },
      // Method 2: Fixed Amortization
      {
        id: 'monthlyRate',
        expression: 'interestRate / 100 / 12',
        dependencies: ['interestRate'],
      },
      {
        id: 'totalMonths',
        expression: 'lifeExpectancy * 12',
        dependencies: ['lifeExpectancy'],
      },
      {
        id: 'amortMethod',
        expression: 'abs(pmt(monthlyRate, totalMonths, accountBalance)) * 12',
        dependencies: ['monthlyRate', 'totalMonths', 'accountBalance'],
      },
      // Method 3: Fixed Annuitization (simplified approximation)
      {
        id: 'annuitMethod',
        expression: 'accountBalance / lifeExpectancy * (1 + interestRate / 200)',
        dependencies: ['accountBalance', 'lifeExpectancy', 'interestRate'],
      },
    ],
    outputs: [
      {
        id: 'life-expectancy',
        label: 'Life Expectancy Factor',
        formulaRef: 'lifeExpectancy',
        format: 'number',
        precision: 1,
        suffix: ' years',
      },
      {
        id: 'rmd-method',
        label: 'RMD Method (annual)',
        formulaRef: 'rmdMethod',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'amortization-method',
        label: 'Fixed Amortization Method (annual)',
        formulaRef: 'amortMethod',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
      {
        id: 'annuitization-method',
        label: 'Fixed Annuitization Method (annual)',
        formulaRef: 'annuitMethod',
        format: 'currency',
        precision: 2,
      },
    ],
    guide: {
      whatIsIt:
        'A 72(t) SEPP calculator that estimates penalty-free early distributions from retirement accounts before age 59½. The IRS offers three approved methods: the RMD method (recalculated annually), Fixed Amortization, and Fixed Annuitization. Each produces a different annual distribution amount.',
      howToUse:
        'Enter your IRA or 401(k) balance, your age, and a reasonable interest rate (the IRS caps this at 120% of the federal mid-term rate). The calculator shows the annual distribution under all three methods so you can choose the one that best fits your needs.',
      exampleScenario:
        'A 50-year-old with $500,000 at 5% interest: the RMD method yields ~$14,620/year, Fixed Amortization yields ~$32,500/year, and Fixed Annuitization yields ~$14,985/year. The Amortization method typically produces the highest payments.',
      proTip:
        'Once you start 72(t) distributions, you MUST continue for 5 years or until age 59½ (whichever is longer). Modifying the payments triggers retroactive 10% penalties on ALL prior distributions. Plan carefully before committing.',
    },
    metadata: {
      version: '1.0.0',
      lastUpdated: '2024-01',
    },
  },

  // =========================================================================
  // 12. Social Security Estimator
  // =========================================================================
  {
    id: 'social-security-estimator',
    slug: 'social-security-estimator',
    title: 'Social Security Estimator',
    description:
      'Estimate your Social Security benefit using 2024 PIA bend points and age-based adjustment factors for claiming ages 62 through 70.',
    icon: '🏛️',
    category: 'finance',
    subcategory: 'social-security',
    tags: ['social security', 'PIA', 'benefit', 'claiming age', 'AIME', 'bend points'],
    inputs: [
      {
        id: 'averageAnnualEarnings',
        label: 'Average Annual Earnings ($)',
        type: 'number',
        min: 0,
        step: 1000,
        defaultValue: 70000,
        placeholder: 'e.g. 70000',
        helpText: 'Average of your highest 35 years of indexed earnings.',
        required: true,
      },
      {
        id: 'birthYear',
        label: 'Birth Year',
        type: 'number',
        min: 1940,
        max: 2000,
        step: 1,
        defaultValue: 1960,
        placeholder: 'e.g. 1960',
        required: true,
      },
      {
        id: 'claimingAge',
        label: 'Claiming Age',
        type: 'select',
        defaultValue: '67',
        options: [
          { label: '62', value: '62' },
          { label: '63', value: '63' },
          { label: '64', value: '64' },
          { label: '65', value: '65' },
          { label: '66', value: '66' },
          { label: '67 (Full Retirement Age)', value: '67' },
          { label: '68', value: '68' },
          { label: '69', value: '69' },
          { label: '70', value: '70' },
        ],
        required: true,
      },
    ],
    formulas: [
      {
        id: 'AIME',
        expression: 'averageAnnualEarnings / 12',
        dependencies: ['averageAnnualEarnings'],
      },
      // 2024 bend points: $1,174 and $7,078
      {
        id: 'PIA',
        expression:
          'min(AIME, 1174) * 0.9 + max(min(AIME - 1174, 7078 - 1174), 0) * 0.32 + max(AIME - 7078, 0) * 0.15',
        dependencies: ['AIME'],
      },
      {
        id: 'FRA',
        expression: 'birthYear >= 1960 ? 67 : 66',
        dependencies: ['birthYear'],
      },
      // Adjustment factor by claiming age (assuming FRA = 67 for simplicity)
      {
        id: 'adjustmentFactor',
        expression:
          'claimingAge == 62 ? 0.70 : (claimingAge == 63 ? 0.75 : (claimingAge == 64 ? 0.80 : (claimingAge == 65 ? 0.8667 : (claimingAge == 66 ? 0.9333 : (claimingAge == 67 ? 1.0 : (claimingAge == 68 ? 1.08 : (claimingAge == 69 ? 1.16 : 1.24)))))))',
        dependencies: ['claimingAge'],
      },
      {
        id: 'monthlyBenefit',
        expression: 'PIA * adjustmentFactor',
        dependencies: ['PIA', 'adjustmentFactor'],
      },
      {
        id: 'annualBenefit',
        expression: 'monthlyBenefit * 12',
        dependencies: ['monthlyBenefit'],
      },
    ],
    outputs: [
      {
        id: 'aime',
        label: 'Average Indexed Monthly Earnings (AIME)',
        formulaRef: 'AIME',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'pia',
        label: 'Primary Insurance Amount (PIA)',
        formulaRef: 'PIA',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'monthly-benefit',
        label: 'Estimated Monthly Benefit',
        formulaRef: 'monthlyBenefit',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
      {
        id: 'annual-benefit',
        label: 'Estimated Annual Benefit',
        formulaRef: 'annualBenefit',
        format: 'currency',
        precision: 2,
      },
    ],
    guide: {
      whatIsIt:
        'A Social Security benefit estimator that uses the 2024 PIA formula with official bend points ($1,174 and $7,078). Your benefit is calculated from your Average Indexed Monthly Earnings (AIME) using a progressive replacement formula, then adjusted for early or delayed claiming relative to Full Retirement Age.',
      howToUse:
        'Enter your average annual earnings (top 35 years), birth year, and when you plan to claim. The calculator computes your AIME, Primary Insurance Amount (PIA), and adjusted monthly benefit. For those born 1960 or later, Full Retirement Age is 67.',
      exampleScenario:
        'Earning an average of $70,000/year: AIME = $5,833. PIA ≈ $1,056 (first bend) + $1,491 (second bend) + $0 = $2,547. Claiming at 67 gives $2,547/month; at 62, it drops to ~$1,783; at 70, it rises to ~$3,158.',
      proTip:
        'Each year you delay past FRA adds 8% in delayed retirement credits — one of the best guaranteed "returns" available. But if you have health concerns or need the income, claiming earlier may make more sense. Run the break-even analysis to decide.',
    },
    metadata: {
      version: '1.0.0',
      lastUpdated: '2024-01',
    },
  },

  // =========================================================================
  // 13. Social Security Distribution
  // =========================================================================
  {
    id: 'social-security-distribution',
    slug: 'social-security-distribution',
    title: 'Social Security Distribution',
    description:
      'Calculate your total lifetime Social Security benefits based on your monthly benefit, claiming age, and life expectancy.',
    icon: '📅',
    category: 'finance',
    subcategory: 'social-security',
    tags: ['social security', 'lifetime', 'distribution', 'claiming age', 'life expectancy'],
    inputs: [
      {
        id: 'monthlyBenefit',
        label: 'Monthly Benefit ($)',
        type: 'number',
        min: 0,
        step: 100,
        defaultValue: 2500,
        placeholder: 'e.g. 2500',
        required: true,
      },
      {
        id: 'claimingAge',
        label: 'Claiming Age',
        type: 'number',
        min: 62,
        max: 70,
        step: 1,
        defaultValue: 67,
        placeholder: 'e.g. 67',
        required: true,
      },
      {
        id: 'lifeExpectancy',
        label: 'Life Expectancy',
        type: 'number',
        min: 65,
        max: 110,
        step: 1,
        defaultValue: 85,
        placeholder: 'e.g. 85',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'yearsReceiving',
        expression: 'lifeExpectancy - claimingAge',
        dependencies: ['lifeExpectancy', 'claimingAge'],
      },
      {
        id: 'totalLifetimeBenefits',
        expression: 'monthlyBenefit * 12 * yearsReceiving',
        dependencies: ['monthlyBenefit', 'yearsReceiving'],
      },
      {
        id: 'annualBenefit',
        expression: 'monthlyBenefit * 12',
        dependencies: ['monthlyBenefit'],
      },
    ],
    outputs: [
      {
        id: 'years-receiving',
        label: 'Years Receiving Benefits',
        formulaRef: 'yearsReceiving',
        format: 'number',
        precision: 0,
        suffix: ' years',
      },
      {
        id: 'annual-benefit',
        label: 'Annual Benefit',
        formulaRef: 'annualBenefit',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'total-lifetime',
        label: 'Total Lifetime Benefits',
        formulaRef: 'totalLifetimeBenefits',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
    ],
    guide: {
      whatIsIt:
        'A simple Social Security distribution calculator that multiplies your monthly benefit by the number of months you expect to collect, giving you a total lifetime benefit figure based on your claiming age and life expectancy.',
      howToUse:
        'Enter your expected monthly benefit amount, the age at which you plan to start claiming, and your estimated life expectancy. The calculator shows the number of years you will receive benefits and the total lifetime payout.',
      exampleScenario:
        'Claiming $2,500/month at age 67 with a life expectancy of 85: you receive benefits for 18 years, totaling $540,000 in lifetime benefits.',
      proTip:
        'Compare lifetime benefits at different claiming ages. A lower monthly benefit claimed earlier (e.g. 62) pays out for more years, while a higher benefit claimed later (e.g. 70) pays out for fewer years. The break-even point is typically around age 80–82.',
    },
    metadata: {
      version: '1.0.0',
      lastUpdated: '2024-01',
    },
  },

  // =========================================================================
  // 14. Social Security Analysis
  // =========================================================================
  {
    id: 'social-security-analysis',
    slug: 'social-security-analysis',
    title: 'Social Security Analysis',
    description:
      'Analyze your Social Security benefit at ages 62, 67, and 70, and see what percentage of your monthly expenses each scenario covers.',
    icon: '🔍',
    category: 'finance',
    subcategory: 'social-security',
    tags: ['social security', 'analysis', 'PIA', 'expenses', 'coverage'],
    inputs: [
      {
        id: 'averageEarnings',
        label: 'Average Annual Earnings ($)',
        type: 'number',
        min: 0,
        step: 1000,
        defaultValue: 80000,
        placeholder: 'e.g. 80000',
        helpText: 'Average of your highest 35 years of indexed earnings.',
        required: true,
      },
      {
        id: 'birthYear',
        label: 'Birth Year',
        type: 'number',
        min: 1940,
        max: 2000,
        step: 1,
        defaultValue: 1965,
        placeholder: 'e.g. 1965',
        required: true,
      },
      {
        id: 'expenses',
        label: 'Monthly Expenses in Retirement ($)',
        type: 'number',
        min: 0,
        step: 100,
        defaultValue: 5000,
        placeholder: 'e.g. 5000',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'AIME',
        expression: 'averageEarnings / 12',
        dependencies: ['averageEarnings'],
      },
      {
        id: 'PIA',
        expression:
          'min(AIME, 1174) * 0.9 + max(min(AIME - 1174, 7078 - 1174), 0) * 0.32 + max(AIME - 7078, 0) * 0.15',
        dependencies: ['AIME'],
      },
      {
        id: 'benefitAt62',
        expression: 'PIA * 0.70',
        dependencies: ['PIA'],
      },
      {
        id: 'benefitAt67',
        expression: 'PIA',
        dependencies: ['PIA'],
      },
      {
        id: 'benefitAt70',
        expression: 'PIA * 1.24',
        dependencies: ['PIA'],
      },
      {
        id: 'coverageAt62',
        expression: 'benefitAt62 / expenses * 100',
        dependencies: ['benefitAt62', 'expenses'],
      },
      {
        id: 'coverageAt67',
        expression: 'benefitAt67 / expenses * 100',
        dependencies: ['benefitAt67', 'expenses'],
      },
      {
        id: 'coverageAt70',
        expression: 'benefitAt70 / expenses * 100',
        dependencies: ['benefitAt70', 'expenses'],
      },
    ],
    outputs: [
      {
        id: 'pia',
        label: 'Primary Insurance Amount (PIA)',
        formulaRef: 'PIA',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'benefit-62',
        label: 'Monthly Benefit at 62',
        formulaRef: 'benefitAt62',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'benefit-67',
        label: 'Monthly Benefit at 67 (FRA)',
        formulaRef: 'benefitAt67',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
      {
        id: 'benefit-70',
        label: 'Monthly Benefit at 70',
        formulaRef: 'benefitAt70',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'coverage-62',
        label: 'Expense Coverage at 62',
        formulaRef: 'coverageAt62',
        format: 'percentage',
        precision: 1,
      },
      {
        id: 'coverage-67',
        label: 'Expense Coverage at 67',
        formulaRef: 'coverageAt67',
        format: 'percentage',
        precision: 1,
      },
      {
        id: 'coverage-70',
        label: 'Expense Coverage at 70',
        formulaRef: 'coverageAt70',
        format: 'percentage',
        precision: 1,
      },
    ],
    guide: {
      whatIsIt:
        'A Social Security analysis tool that calculates your PIA using 2024 bend points, then shows your estimated monthly benefit at three key claiming ages (62, 67, and 70). It also shows what percentage of your expected monthly expenses each benefit level would cover.',
      howToUse:
        'Enter your average annual earnings (top 35 years), birth year, and expected monthly expenses in retirement. The calculator displays benefits at ages 62, 67, and 70, along with expense coverage percentages to help you decide when to claim.',
      exampleScenario:
        'Average earnings of $80,000/year: AIME = $6,667, PIA ≈ $2,814. At 62: ~$1,970 (39% of $5,000 expenses). At 67: $2,814 (56%). At 70: ~$3,489 (70%). Each delay significantly increases your coverage.',
      proTip:
        'Social Security is designed to replace about 40% of pre-retirement income for average earners. If your expenses are high, you will need substantial additional savings regardless of when you claim.',
    },
    metadata: {
      version: '1.0.0',
      lastUpdated: '2024-01',
    },
  },

  // =========================================================================
  // 15. Social Security for Couples
  // =========================================================================
  {
    id: 'social-security-couple',
    slug: 'social-security-couple',
    title: 'Social Security for Couples',
    description:
      'Estimate combined Social Security benefits for a married couple based on each spouse\'s earnings and claiming age.',
    icon: '👫',
    category: 'finance',
    subcategory: 'social-security',
    tags: ['social security', 'couple', 'spousal', 'combined', 'married'],
    inputs: [
      {
        id: 'spouse1Earnings',
        label: 'Spouse 1 — Average Annual Earnings ($)',
        type: 'number',
        min: 0,
        step: 1000,
        defaultValue: 80000,
        placeholder: 'e.g. 80000',
        required: true,
        group: 'Spouse 1',
      },
      {
        id: 'spouse1ClaimAge',
        label: 'Spouse 1 — Claiming Age',
        type: 'select',
        defaultValue: '67',
        options: [
          { label: '62', value: '62' },
          { label: '63', value: '63' },
          { label: '64', value: '64' },
          { label: '65', value: '65' },
          { label: '66', value: '66' },
          { label: '67', value: '67' },
          { label: '68', value: '68' },
          { label: '69', value: '69' },
          { label: '70', value: '70' },
        ],
        required: true,
        group: 'Spouse 1',
      },
      {
        id: 'spouse2Earnings',
        label: 'Spouse 2 — Average Annual Earnings ($)',
        type: 'number',
        min: 0,
        step: 1000,
        defaultValue: 50000,
        placeholder: 'e.g. 50000',
        required: true,
        group: 'Spouse 2',
      },
      {
        id: 'spouse2ClaimAge',
        label: 'Spouse 2 — Claiming Age',
        type: 'select',
        defaultValue: '67',
        options: [
          { label: '62', value: '62' },
          { label: '63', value: '63' },
          { label: '64', value: '64' },
          { label: '65', value: '65' },
          { label: '66', value: '66' },
          { label: '67', value: '67' },
          { label: '68', value: '68' },
          { label: '69', value: '69' },
          { label: '70', value: '70' },
        ],
        required: true,
        group: 'Spouse 2',
      },
    ],
    formulas: [
      // Spouse 1 PIA
      {
        id: 'AIME1',
        expression: 'spouse1Earnings / 12',
        dependencies: ['spouse1Earnings'],
      },
      {
        id: 'PIA1',
        expression:
          'min(AIME1, 1174) * 0.9 + max(min(AIME1 - 1174, 7078 - 1174), 0) * 0.32 + max(AIME1 - 7078, 0) * 0.15',
        dependencies: ['AIME1'],
      },
      {
        id: 'adj1',
        expression:
          'spouse1ClaimAge == 62 ? 0.70 : (spouse1ClaimAge == 63 ? 0.75 : (spouse1ClaimAge == 64 ? 0.80 : (spouse1ClaimAge == 65 ? 0.8667 : (spouse1ClaimAge == 66 ? 0.9333 : (spouse1ClaimAge == 67 ? 1.0 : (spouse1ClaimAge == 68 ? 1.08 : (spouse1ClaimAge == 69 ? 1.16 : 1.24)))))))',
        dependencies: ['spouse1ClaimAge'],
      },
      {
        id: 'spouse1Benefit',
        expression: 'PIA1 * adj1',
        dependencies: ['PIA1', 'adj1'],
      },
      // Spouse 2 PIA
      {
        id: 'AIME2',
        expression: 'spouse2Earnings / 12',
        dependencies: ['spouse2Earnings'],
      },
      {
        id: 'PIA2',
        expression:
          'min(AIME2, 1174) * 0.9 + max(min(AIME2 - 1174, 7078 - 1174), 0) * 0.32 + max(AIME2 - 7078, 0) * 0.15',
        dependencies: ['AIME2'],
      },
      {
        id: 'adj2',
        expression:
          'spouse2ClaimAge == 62 ? 0.70 : (spouse2ClaimAge == 63 ? 0.75 : (spouse2ClaimAge == 64 ? 0.80 : (spouse2ClaimAge == 65 ? 0.8667 : (spouse2ClaimAge == 66 ? 0.9333 : (spouse2ClaimAge == 67 ? 1.0 : (spouse2ClaimAge == 68 ? 1.08 : (spouse2ClaimAge == 69 ? 1.16 : 1.24)))))))',
        dependencies: ['spouse2ClaimAge'],
      },
      {
        id: 'spouse2Benefit',
        expression: 'PIA2 * adj2',
        dependencies: ['PIA2', 'adj2'],
      },
      // Combined
      {
        id: 'combinedMonthly',
        expression: 'spouse1Benefit + spouse2Benefit',
        dependencies: ['spouse1Benefit', 'spouse2Benefit'],
      },
      {
        id: 'combinedAnnual',
        expression: 'combinedMonthly * 12',
        dependencies: ['combinedMonthly'],
      },
    ],
    outputs: [
      {
        id: 'spouse1-monthly',
        label: 'Spouse 1 — Monthly Benefit',
        formulaRef: 'spouse1Benefit',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'spouse2-monthly',
        label: 'Spouse 2 — Monthly Benefit',
        formulaRef: 'spouse2Benefit',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'combined-monthly',
        label: 'Combined Monthly Benefit',
        formulaRef: 'combinedMonthly',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
      {
        id: 'combined-annual',
        label: 'Combined Annual Benefit',
        formulaRef: 'combinedAnnual',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
    ],
    guide: {
      whatIsIt:
        'A Social Security calculator for married couples that computes each spouse\'s individual benefit based on their own earnings and claiming age, then combines them to show the household\'s total Social Security income.',
      howToUse:
        'Enter each spouse\'s average annual earnings and their planned claiming age (62–70). The calculator applies the 2024 PIA bend-point formula and age adjustment factors to compute individual and combined monthly benefits.',
      exampleScenario:
        'Spouse 1 earns $80,000 and claims at 67 (~$2,814/month). Spouse 2 earns $50,000 and claims at 67 (~$2,002/month). Combined household benefit is ~$4,816/month or ~$57,792/year.',
      proTip:
        'For couples, consider staggering claiming ages. Often the higher earner benefits from delaying to 70 (maximizing the survivor benefit) while the lower earner claims earlier. This strategy can maximize total household income over both lifetimes.',
    },
    metadata: {
      version: '1.0.0',
      lastUpdated: '2024-01',
    },
  },

  // =========================================================================
  // 16. Social Security Income Tax
  // =========================================================================
  {
    id: 'social-security-income-tax',
    slug: 'social-security-income-tax',
    title: 'Social Security Income Tax',
    description:
      'Determine how much of your Social Security benefits may be subject to federal income tax based on your provisional income and filing status.',
    icon: '🧾',
    category: 'finance',
    subcategory: 'social-security',
    tags: ['social security', 'tax', 'provisional income', 'taxable', 'filing status'],
    inputs: [
      {
        id: 'socialSecurityAnnual',
        label: 'Annual Social Security Benefits ($)',
        type: 'number',
        min: 0,
        step: 1000,
        defaultValue: 30000,
        placeholder: 'e.g. 30000',
        required: true,
      },
      {
        id: 'otherIncome',
        label: 'Other Annual Income ($)',
        type: 'number',
        min: 0,
        step: 1000,
        defaultValue: 40000,
        placeholder: 'e.g. 40000',
        helpText: 'Wages, pensions, investment income, etc.',
        required: true,
      },
      {
        id: 'filingStatus',
        label: 'Filing Status',
        type: 'select',
        defaultValue: '0',
        options: [
          { label: 'Single / Head of Household', value: '0' },
          { label: 'Married Filing Jointly', value: '1' },
        ],
        required: true,
      },
    ],
    formulas: [
      {
        id: 'provisionalIncome',
        expression: 'otherIncome + socialSecurityAnnual * 0.5',
        dependencies: ['otherIncome', 'socialSecurityAnnual'],
      },
      {
        id: 'threshold1',
        expression: 'filingStatus == 0 ? 25000 : 32000',
        dependencies: ['filingStatus'],
      },
      {
        id: 'threshold2',
        expression: 'filingStatus == 0 ? 34000 : 44000',
        dependencies: ['filingStatus'],
      },
      {
        id: 'taxablePercent',
        expression:
          'provisionalIncome <= threshold1 ? 0 : (provisionalIncome <= threshold2 ? 50 : 85)',
        dependencies: ['provisionalIncome', 'threshold1', 'threshold2'],
      },
      {
        id: 'taxableAmount',
        expression: 'socialSecurityAnnual * taxablePercent / 100',
        dependencies: ['socialSecurityAnnual', 'taxablePercent'],
      },
      {
        id: 'taxFreeAmount',
        expression: 'socialSecurityAnnual - taxableAmount',
        dependencies: ['socialSecurityAnnual', 'taxableAmount'],
      },
    ],
    outputs: [
      {
        id: 'provisional-income',
        label: 'Provisional Income',
        formulaRef: 'provisionalIncome',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'taxable-percent',
        label: 'Taxable Percentage',
        formulaRef: 'taxablePercent',
        format: 'percentage',
        precision: 0,
        highlight: true,
      },
      {
        id: 'taxable-amount',
        label: 'Taxable Social Security',
        formulaRef: 'taxableAmount',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
      {
        id: 'tax-free-amount',
        label: 'Tax-Free Social Security',
        formulaRef: 'taxFreeAmount',
        format: 'currency',
        precision: 2,
      },
    ],
    guide: {
      whatIsIt:
        'A calculator that estimates how much of your Social Security benefits may be taxable at the federal level. The IRS uses "provisional income" (other income + 50% of Social Security) and compares it to filing-status thresholds to determine whether 0%, 50%, or 85% of your benefits are subject to income tax.',
      howToUse:
        'Enter your total annual Social Security benefits, other annual income (pensions, wages, investments), and filing status. The calculator computes your provisional income and shows the percentage and dollar amount of benefits that are taxable.',
      exampleScenario:
        'Single filer with $30,000 Social Security and $40,000 other income: Provisional income = $40,000 + $15,000 = $55,000. This exceeds the $34,000 upper threshold, so 85% ($25,500) of benefits are taxable.',
      proTip:
        'Consider Roth conversions before claiming Social Security. Roth withdrawals do not count as provisional income, so strategically converting Traditional IRA assets to Roth in lower-income years can reduce or eliminate the taxation of your future Social Security benefits.',
    },
    metadata: {
      version: '1.0.0',
      lastUpdated: '2024-01',
    },
  },

  // =========================================================================
  // 17. Annuity Calculator
  // =========================================================================
  {
    id: 'annuity-calculator',
    slug: 'annuity-calculator',
    title: 'Annuity Calculator',
    description:
      'Calculate periodic payouts from a lump-sum annuity investment based on your chosen return rate, payout period, and payment frequency.',
    icon: '💎',
    category: 'finance',
    subcategory: 'retirement',
    tags: ['annuity', 'payout', 'lump sum', 'periodic payment', 'retirement income'],
    inputs: [
      {
        id: 'lumpSum',
        label: 'Lump Sum Investment ($)',
        type: 'number',
        min: 0,
        step: 10000,
        defaultValue: 500000,
        placeholder: 'e.g. 500000',
        required: true,
      },
      {
        id: 'annualReturn',
        label: 'Annual Return (%)',
        type: 'number',
        min: 0,
        max: 20,
        step: 0.1,
        defaultValue: 5,
        placeholder: 'e.g. 5',
        required: true,
      },
      {
        id: 'payoutYears',
        label: 'Payout Period (years)',
        type: 'number',
        min: 1,
        max: 50,
        step: 1,
        defaultValue: 20,
        placeholder: 'e.g. 20',
        required: true,
      },
      {
        id: 'paymentFrequency',
        label: 'Payment Frequency',
        type: 'select',
        defaultValue: '12',
        options: [
          { label: 'Monthly', value: '12' },
          { label: 'Quarterly', value: '4' },
          { label: 'Annually', value: '1' },
        ],
        required: true,
      },
    ],
    formulas: [
      {
        id: 'periodicRate',
        expression: 'annualReturn / 100 / paymentFrequency',
        dependencies: ['annualReturn', 'paymentFrequency'],
      },
      {
        id: 'totalPeriods',
        expression: 'payoutYears * paymentFrequency',
        dependencies: ['payoutYears', 'paymentFrequency'],
      },
      {
        id: 'periodicPayment',
        expression: 'abs(pmt(periodicRate, totalPeriods, lumpSum))',
        dependencies: ['periodicRate', 'totalPeriods', 'lumpSum'],
      },
      {
        id: 'annualPayment',
        expression: 'periodicPayment * paymentFrequency',
        dependencies: ['periodicPayment', 'paymentFrequency'],
      },
      {
        id: 'totalPayout',
        expression: 'periodicPayment * totalPeriods',
        dependencies: ['periodicPayment', 'totalPeriods'],
      },
      {
        id: 'interestEarned',
        expression: 'totalPayout - lumpSum',
        dependencies: ['totalPayout', 'lumpSum'],
      },
    ],
    outputs: [
      {
        id: 'periodic-payment',
        label: 'Payment Per Period',
        formulaRef: 'periodicPayment',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
      {
        id: 'annual-payment',
        label: 'Annual Payout',
        formulaRef: 'annualPayment',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'total-payout',
        label: 'Total Payout Over Period',
        formulaRef: 'totalPayout',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'interest-earned',
        label: 'Total Interest Earned',
        formulaRef: 'interestEarned',
        format: 'currency',
        precision: 2,
      },
    ],
    guide: {
      whatIsIt:
        'An annuity payout calculator that determines how much you will receive per period when you invest a lump sum and draw it down over a fixed number of years at a given return rate. Supports monthly, quarterly, and annual payment frequencies.',
      howToUse:
        'Enter the lump sum you plan to annuitize, the expected annual return, how many years you want payouts to last, and your preferred payment frequency. The calculator computes the per-period payment, annual income, total payout, and total interest earned over the life of the annuity.',
      exampleScenario:
        'Investing $500,000 at 5% for 20 years with monthly payments: you would receive about $3,300/month ($39,600/year). Over 20 years, the total payout would be roughly $791,000 — meaning $291,000 comes from interest earned during the payout period.',
      proTip:
        'A fixed annuity provides income certainty, but remember that inflation erodes purchasing power over time. Consider pairing a fixed annuity with a COLA (Cost of Living Adjustment) rider, or keep a portion of your portfolio in growth investments to hedge against inflation.',
    },
    metadata: {
      version: '1.0.0',
      lastUpdated: '2024-01',
    },
  },
];
