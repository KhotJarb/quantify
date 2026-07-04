// ---------------------------------------------------------------------------
// Quantify — FIRE & Deep Personal Finance Calculators
// ---------------------------------------------------------------------------
// Ten calculators covering FIRE number, Coast FIRE, safe withdrawal rate,
// rent vs buy, car lease vs buy, opportunity cost, inflation-adjusted return,
// geo-arbitrage, emergency fund, and dividend snowball.
// ---------------------------------------------------------------------------

import type { CalculatorSchema } from '@/types/calculator';

export const fireFinanceCalculators: CalculatorSchema[] = [
  // =========================================================================
  // 1. FIRE Number Calculator
  // =========================================================================
  {
    id: 'fire-number-calculator',
    slug: 'fire-number-calculator',
    title: 'FIRE Number Calculator',
    description:
      'Calculate the total investment portfolio you need to retire early and live entirely off investment returns.',
    icon: '🔥',
    category: 'finance',
    subcategory: 'fire',
    tags: ['FIRE', 'financial independence', 'retire early', 'safe withdrawal rate', 'Trinity Study', 'portfolio', 'passive income'],
    inputs: [
      {
        id: 'annualExpenses',
        label: 'Annual Expenses',
        type: 'number',
        defaultValue: 40000,
        min: 0,
        step: 1000,
        placeholder: 'e.g. 40000',
        helpText: 'Your total annual living expenses in retirement.',
        required: true,
      },
      {
        id: 'swr',
        label: 'Safe Withdrawal Rate',
        type: 'select',
        defaultValue: '4',
        options: [
          { label: '4% (Trinity Study)', value: '4' },
          { label: '3.5% (Conservative)', value: '3.5' },
          { label: '3% (Very Safe)', value: '3' },
          { label: '4.5% (Aggressive)', value: '4.5' },
        ],
        helpText: 'The percentage of your portfolio you withdraw each year. 4% has a 95%+ historical success rate over 30 years.',
      },
      {
        id: 'currentPortfolio',
        label: 'Current Portfolio Value',
        type: 'number',
        defaultValue: 100000,
        min: 0,
        step: 1000,
        placeholder: 'e.g. 100000',
        helpText: 'Total value of your investable assets today.',
      },
    ],
    formulas: [
      {
        id: 'fireNumber',
        expression: 'annualExpenses / (swr / 100)',
        dependencies: ['annualExpenses', 'swr'],
      },
      {
        id: 'progress',
        expression: 'min(currentPortfolio / fireNumber * 100, 100)',
        dependencies: ['currentPortfolio', 'fireNumber'],
      },
    ],
    outputs: [
      {
        id: 'fire-number-out',
        label: 'FIRE Number',
        formulaRef: 'fireNumber',
        prefix: '$',
        precision: 0,
        highlight: true,
      },
      {
        id: 'progress-out',
        label: 'Progress to FIRE',
        formulaRef: 'progress',
        suffix: '%',
        precision: 1,
      },
    ],
    guide: {
      whatIsIt:
        'The FIRE Number is the total investment portfolio value at which you can retire and live indefinitely off investment returns. It is calculated by dividing your annual expenses by your chosen Safe Withdrawal Rate (SWR). At a 4% SWR, you need 25x your annual expenses.',
      howToUse:
        'Enter your projected annual living expenses in retirement, choose a safe withdrawal rate, and optionally enter your current portfolio value. The calculator shows your target FIRE Number and your current progress towards it.',
      exampleScenario:
        'If you spend $40,000/year and use the 4% rule, your FIRE Number is $1,000,000. If you currently have $100,000 saved, you are 10% of the way there.',
      proTip:
        'Consider using a 3.5% SWR if you plan to retire before age 50, as your retirement could last 50+ years. The Trinity Study was based on 30-year retirements. A lower SWR dramatically increases portfolio longevity.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 2. Coast FIRE Calculator
  // =========================================================================
  {
    id: 'coast-fire-calculator',
    slug: 'coast-fire-calculator',
    title: 'Coast FIRE Calculator',
    description:
      'Find the portfolio amount you need today so it grows to your FIRE number by retirement without any more contributions.',
    icon: '🏖',
    category: 'finance',
    subcategory: 'fire',
    tags: ['Coast FIRE', 'FIRE', 'financial independence', 'compound interest', 'retirement', 'portfolio growth', 'investment'],
    inputs: [
      {
        id: 'fireNumber',
        label: 'Your FIRE Number',
        type: 'number',
        defaultValue: 1000000,
        min: 0,
        step: 10000,
        placeholder: 'e.g. 1000000',
        helpText: 'The total portfolio needed to retire (use the FIRE Number Calculator above).',
        required: true,
      },
      {
        id: 'currentPortfolio',
        label: 'Current Portfolio Value',
        type: 'number',
        defaultValue: 150000,
        min: 0,
        step: 1000,
        placeholder: 'e.g. 150000',
        required: true,
      },
      {
        id: 'annualReturn',
        label: 'Expected Annual Return (%)',
        type: 'number',
        defaultValue: 7,
        min: 0,
        max: 30,
        step: 0.5,
        placeholder: 'e.g. 7',
        helpText: 'Expected real (inflation-adjusted) annual return. 7% is a common long-term stock market estimate.',
        required: true,
      },
      {
        id: 'yearsToRetire',
        label: 'Years Until Target Retirement Age',
        type: 'number',
        defaultValue: 25,
        min: 1,
        max: 60,
        step: 1,
        placeholder: 'e.g. 25',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'coastNumber',
        expression: 'fireNumber / pow(1 + annualReturn / 100, yearsToRetire)',
        dependencies: ['fireNumber', 'annualReturn', 'yearsToRetire'],
      },
      {
        id: 'hasCoastFired',
        expression: 'currentPortfolio >= coastNumber ? 1 : 0',
        dependencies: ['currentPortfolio', 'coastNumber'],
      },
      {
        id: 'shortage',
        expression: 'max(coastNumber - currentPortfolio, 0)',
        dependencies: ['coastNumber', 'currentPortfolio'],
      },
    ],
    outputs: [
      {
        id: 'coast-number-out',
        label: 'Coast FIRE Number',
        formulaRef: 'coastNumber',
        prefix: '$',
        precision: 0,
        highlight: true,
      },
      {
        id: 'shortage-out',
        label: 'Amount Still Needed',
        formulaRef: 'shortage',
        prefix: '$',
        precision: 0,
      },
      {
        id: 'has-coast-fired-out',
        label: 'Coast FIRE Status (1=Yes, 0=No)',
        formulaRef: 'hasCoastFired',
        precision: 0,
      },
    ],
    guide: {
      whatIsIt:
        'Coast FIRE is the point where your current portfolio is large enough that — invested and left alone — it will compound to your full FIRE Number by your target retirement age. Once you reach Coast FIRE, you only need to cover living expenses; you no longer need to save for retirement.',
      howToUse:
        'Enter your target FIRE Number, your current portfolio value, the expected annual return (7% is a common long-term inflation-adjusted assumption), and the number of years until retirement. The calculator shows how much you need today to "coast" to FIRE.',
      exampleScenario:
        'To reach $1,000,000 in 25 years at 7% real returns, your Coast FIRE Number is about $184,249. If you have $150,000, you still need approximately $34,249 more before you can coast.',
      proTip:
        'Coast FIRE is a powerful milestone because it decouples your day job from retirement saving. Once coasted, you can take a lower-stress job, work part-time, or pursue passion projects — you just need to cover current expenses.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 3. Safe Withdrawal Rate Calculator
  // =========================================================================
  {
    id: 'swr-calculator',
    slug: 'swr-calculator',
    title: 'Safe Withdrawal Rate Calculator',
    description:
      'Calculate how much you can safely withdraw annually and monthly from your retirement portfolio.',
    icon: '💸',
    category: 'finance',
    subcategory: 'fire',
    tags: ['safe withdrawal rate', 'SWR', 'retirement income', 'portfolio', 'inflation', 'FIRE', 'withdrawal strategy', 'Trinity Study'],
    inputs: [
      {
        id: 'portfolio',
        label: 'Portfolio Value',
        type: 'number',
        defaultValue: 1000000,
        min: 0,
        step: 10000,
        placeholder: 'e.g. 1000000',
        required: true,
      },
      {
        id: 'swr',
        label: 'Withdrawal Rate (%)',
        type: 'number',
        defaultValue: 4,
        min: 0.1,
        max: 20,
        step: 0.1,
        placeholder: 'e.g. 4',
        helpText: 'The percentage of your portfolio you withdraw annually. Start at 4% (Trinity Study).',
        required: true,
      },
      {
        id: 'inflationRate',
        label: 'Annual Inflation Rate (%)',
        type: 'number',
        defaultValue: 3,
        min: 0,
        max: 20,
        step: 0.1,
        placeholder: 'e.g. 3',
        helpText: 'Used to calculate your real (inflation-adjusted) net return.',
      },
    ],
    formulas: [
      {
        id: 'annualWithdrawal',
        expression: 'portfolio * swr / 100',
        dependencies: ['portfolio', 'swr'],
      },
      {
        id: 'monthlyWithdrawal',
        expression: 'annualWithdrawal / 12',
        dependencies: ['annualWithdrawal'],
      },
      {
        id: 'realReturn',
        expression: '((1 + swr / 100) / (1 + inflationRate / 100) - 1) * 100',
        dependencies: ['swr', 'inflationRate'],
      },
    ],
    outputs: [
      {
        id: 'annual-withdrawal-out',
        label: 'Annual Withdrawal',
        formulaRef: 'annualWithdrawal',
        prefix: '$',
        precision: 0,
        highlight: true,
      },
      {
        id: 'monthly-withdrawal-out',
        label: 'Monthly Withdrawal',
        formulaRef: 'monthlyWithdrawal',
        prefix: '$',
        precision: 0,
      },
      {
        id: 'real-return-out',
        label: 'Real Return After Inflation',
        formulaRef: 'realReturn',
        suffix: '%',
        precision: 2,
      },
    ],
    guide: {
      whatIsIt:
        'The Safe Withdrawal Rate (SWR) Calculator determines how much income you can draw from your retirement portfolio each year without running out of money. The famous Trinity Study found that a 4% SWR has a 95%+ success rate over 30 years for a diversified stock/bond portfolio.',
      howToUse:
        'Enter your total portfolio value and your desired withdrawal rate. Add the current inflation rate to see your real (purchasing-power-adjusted) return. The outputs show your annual and monthly withdrawal amounts.',
      exampleScenario:
        'A $1,000,000 portfolio at a 4% SWR provides $40,000/year ($3,333/month) in retirement income. With 3% inflation, your real return (net of withdrawals and inflation) is approximately 0.97%.',
      proTip:
        'The 4% rule assumes a 30-year retirement. If you plan to retire at 40 and live to 90, consider a 3% or 3.5% SWR. Also consider dynamic withdrawal strategies — spending a little less in bad market years can dramatically improve portfolio survival rates.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 4. Rent vs Buy Calculator
  // =========================================================================
  {
    id: 'rent-vs-buy-calculator',
    slug: 'rent-vs-buy-calculator',
    title: 'Rent vs Buy Home Calculator',
    description:
      'Compare the total 30-year cost of buying a home versus renting to determine which option makes more financial sense.',
    icon: '🏠',
    category: 'finance',
    subcategory: 'fire',
    tags: ['rent vs buy', 'mortgage', 'home buying', 'real estate', 'down payment', 'housing cost', 'homeownership', 'financial planning'],
    inputs: [
      {
        id: 'homePrice',
        label: 'Home Price',
        type: 'number',
        defaultValue: 350000,
        min: 0,
        step: 5000,
        placeholder: 'e.g. 350000',
        required: true,
      },
      {
        id: 'downPayment',
        label: 'Down Payment',
        type: 'number',
        defaultValue: 70000,
        min: 0,
        step: 1000,
        placeholder: 'e.g. 70000',
        helpText: 'Typical down payment is 10-20% of the home price.',
        required: true,
      },
      {
        id: 'mortgageRate',
        label: 'Mortgage Rate (%)',
        type: 'number',
        defaultValue: 6.5,
        min: 0,
        max: 30,
        step: 0.05,
        placeholder: 'e.g. 6.5',
        required: true,
      },
      {
        id: 'years',
        label: 'Loan Term (years)',
        type: 'number',
        defaultValue: 30,
        min: 5,
        max: 30,
        step: 5,
        placeholder: 'e.g. 30',
        required: true,
      },
      {
        id: 'monthlyRent',
        label: 'Monthly Rent (alternative)',
        type: 'number',
        defaultValue: 1800,
        min: 0,
        step: 50,
        placeholder: 'e.g. 1800',
        helpText: 'What you would pay monthly in rent for a comparable property.',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'loanAmount',
        expression: 'homePrice - downPayment',
        dependencies: ['homePrice', 'downPayment'],
      },
      {
        id: 'monthlyRate',
        expression: 'mortgageRate / 100 / 12',
        dependencies: ['mortgageRate'],
      },
      {
        id: 'n',
        expression: 'years * 12',
        dependencies: ['years'],
      },
      {
        id: 'monthlyMortgage',
        expression: 'loanAmount * monthlyRate * pow(1 + monthlyRate, n) / (pow(1 + monthlyRate, n) - 1)',
        dependencies: ['loanAmount', 'monthlyRate', 'n'],
      },
      {
        id: 'totalMortgageCost',
        expression: 'monthlyMortgage * n + downPayment',
        dependencies: ['monthlyMortgage', 'n', 'downPayment'],
      },
      {
        id: 'totalRentCost',
        expression: 'monthlyRent * n',
        dependencies: ['monthlyRent', 'n'],
      },
      {
        id: 'difference',
        expression: 'totalRentCost - totalMortgageCost',
        dependencies: ['totalRentCost', 'totalMortgageCost'],
      },
    ],
    outputs: [
      {
        id: 'monthly-mortgage-out',
        label: 'Monthly Mortgage Payment',
        formulaRef: 'monthlyMortgage',
        prefix: '$',
        precision: 2,
        highlight: true,
      },
      {
        id: 'total-mortgage-cost-out',
        label: '30-Year Buy Total Cost',
        formulaRef: 'totalMortgageCost',
        prefix: '$',
        precision: 0,
      },
      {
        id: 'total-rent-cost-out',
        label: '30-Year Rent Total Cost',
        formulaRef: 'totalRentCost',
        prefix: '$',
        precision: 0,
      },
      {
        id: 'difference-out',
        label: 'Buy Savings vs Rent (positive = buy wins)',
        formulaRef: 'difference',
        prefix: '$',
        precision: 0,
      },
    ],
    guide: {
      whatIsIt:
        'This calculator compares the total out-of-pocket cost of buying a home (mortgage payments plus down payment) versus renting an equivalent property over the full loan term. It is a simplified analysis — it does not include property taxes, maintenance, appreciation, or investment returns on the down payment.',
      howToUse:
        'Enter the home price, your down payment, the mortgage interest rate, loan term, and what monthly rent would cost for a comparable home. The calculator shows both total costs and which option is cheaper on a pure cash-flow basis.',
      exampleScenario:
        'A $350,000 home with $70,000 down at 6.5% for 30 years costs about $1,771/month in mortgage payments. Over 30 years that is $707,560 total (including down payment). Renting at $1,800/month totals $648,000 — making renting $59,560 cheaper on pure cash outflow.',
      proTip:
        'This calculator only compares cash outflow. Buying builds equity and benefits from appreciation; renting preserves liquidity. The full rent-vs-buy decision should also consider property tax, maintenance (~1-2%/year of home value), and the investment return you could earn on the down payment if you rented instead.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 5. Car Lease vs Buy Calculator
  // =========================================================================
  {
    id: 'car-lease-vs-buy',
    slug: 'car-lease-vs-buy',
    title: 'Car Lease vs Buy Calculator',
    description:
      'Compare the true net cost of leasing versus buying a car, accounting for the resale value if purchased.',
    icon: '🚗',
    category: 'finance',
    subcategory: 'fire',
    tags: ['car lease', 'car buy', 'vehicle financing', 'auto loan', 'residual value', 'depreciation', 'monthly payment', 'true cost'],
    inputs: [
      {
        id: 'carPrice',
        label: 'Car Price (MSRP)',
        type: 'number',
        defaultValue: 35000,
        min: 0,
        step: 500,
        placeholder: 'e.g. 35000',
        required: true,
      },
      {
        id: 'downPayment',
        label: 'Down Payment / Cap Reduction',
        type: 'number',
        defaultValue: 5000,
        min: 0,
        step: 500,
        placeholder: 'e.g. 5000',
      },
      {
        id: 'loanRate',
        label: 'Loan APR (%)',
        type: 'number',
        defaultValue: 6,
        min: 0,
        max: 30,
        step: 0.1,
        placeholder: 'e.g. 6',
        required: true,
      },
      {
        id: 'loanYears',
        label: 'Loan Term (years)',
        type: 'number',
        defaultValue: 5,
        min: 1,
        max: 10,
        step: 1,
        placeholder: 'e.g. 5',
        required: true,
      },
      {
        id: 'monthlyLease',
        label: 'Monthly Lease Payment',
        type: 'number',
        defaultValue: 450,
        min: 0,
        step: 10,
        placeholder: 'e.g. 450',
        required: true,
      },
      {
        id: 'leaseYears',
        label: 'Lease Term (years)',
        type: 'number',
        defaultValue: 3,
        min: 1,
        max: 5,
        step: 1,
        placeholder: 'e.g. 3',
        required: true,
      },
      {
        id: 'residualValue',
        label: 'Estimated Resale Value (after loan term)',
        type: 'number',
        defaultValue: 20000,
        min: 0,
        step: 500,
        placeholder: 'e.g. 20000',
        helpText: 'What the car is worth when you sell it after the loan is paid off.',
      },
    ],
    formulas: [
      {
        id: 'loanAmount',
        expression: 'carPrice - downPayment',
        dependencies: ['carPrice', 'downPayment'],
      },
      {
        id: 'monthlyRate',
        expression: 'loanRate / 100 / 12',
        dependencies: ['loanRate'],
      },
      {
        id: 'n',
        expression: 'loanYears * 12',
        dependencies: ['loanYears'],
      },
      {
        id: 'monthlyLoan',
        expression: 'loanAmount * monthlyRate * pow(1 + monthlyRate, n) / (pow(1 + monthlyRate, n) - 1)',
        dependencies: ['loanAmount', 'monthlyRate', 'n'],
      },
      {
        id: 'totalLoanCost',
        expression: 'monthlyLoan * n + downPayment - residualValue',
        dependencies: ['monthlyLoan', 'n', 'downPayment', 'residualValue'],
      },
      {
        id: 'totalLeaseCost',
        expression: 'monthlyLease * leaseYears * 12 + downPayment',
        dependencies: ['monthlyLease', 'leaseYears', 'downPayment'],
      },
    ],
    outputs: [
      {
        id: 'monthly-loan-out',
        label: 'Monthly Loan Payment',
        formulaRef: 'monthlyLoan',
        prefix: '$',
        precision: 2,
      },
      {
        id: 'total-loan-cost-out',
        label: 'Net Buy Cost (after resale)',
        formulaRef: 'totalLoanCost',
        prefix: '$',
        precision: 0,
        highlight: true,
      },
      {
        id: 'total-lease-cost-out',
        label: 'Total Lease Cost',
        formulaRef: 'totalLeaseCost',
        prefix: '$',
        precision: 0,
      },
    ],
    guide: {
      whatIsIt:
        'This calculator compares the true net cost of leasing versus buying a car. For buying, it subtracts the estimated resale value from total payments to show what you actually "spent." For leasing, you return the car at the end with no asset remaining.',
      howToUse:
        'Enter the car price, down payment (or cap reduction for leases), loan APR and term (for buying), monthly lease payment and lease term, and the estimated resale value after paying off the loan. The calculator shows the net cost for each path.',
      exampleScenario:
        'A $35,000 car with $5,000 down at 6% APR over 5 years costs about $580/month. Total payments of $34,800 minus $20,000 resale value = net buy cost of $19,800. A 3-year lease at $450/month with $5,000 down = $21,200 total — making buying slightly cheaper while also ending with a vehicle you own.',
      proTip:
        'Leasing makes sense if you drive under 12,000 miles/year, want a new car every 3 years, and prefer predictable expenses. Buying wins financially if you keep the car 7+ years and drive high mileage. Never capitalise more than 20% of the car price in a lease down payment.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 6. Opportunity Cost Calculator
  // =========================================================================
  {
    id: 'opportunity-cost-calculator',
    slug: 'opportunity-cost-calculator',
    title: 'Opportunity Cost Calculator',
    description:
      'See the true cost of any purchase by calculating what it would be worth if invested instead.',
    icon: '💡',
    category: 'finance',
    subcategory: 'fire',
    tags: ['opportunity cost', 'investing', 'compound interest', 'spending', 'FIRE', 'financial independence', 'true cost', 'time value of money'],
    inputs: [
      {
        id: 'amount',
        label: 'Amount Spent',
        type: 'number',
        defaultValue: 10000,
        min: 0,
        step: 100,
        placeholder: 'e.g. 10000',
        required: true,
      },
      {
        id: 'alternativeReturn',
        label: 'Expected Annual Return if Invested (%)',
        type: 'number',
        defaultValue: 7,
        min: 0,
        max: 50,
        step: 0.5,
        placeholder: 'e.g. 7',
        helpText: 'The annual return you would expect from a low-cost index fund (historical average ~7% real).',
        required: true,
      },
      {
        id: 'years',
        label: 'Years',
        type: 'number',
        defaultValue: 20,
        min: 1,
        max: 60,
        step: 1,
        placeholder: 'e.g. 20',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'futureValue',
        expression: 'amount * pow(1 + alternativeReturn / 100, years)',
        dependencies: ['amount', 'alternativeReturn', 'years'],
      },
      {
        id: 'opportunityCost',
        expression: 'futureValue - amount',
        dependencies: ['futureValue', 'amount'],
      },
    ],
    outputs: [
      {
        id: 'future-value-out',
        label: 'Future Value if Invested',
        formulaRef: 'futureValue',
        prefix: '$',
        precision: 0,
        highlight: true,
      },
      {
        id: 'opportunity-cost-out',
        label: 'Opportunity Cost',
        formulaRef: 'opportunityCost',
        prefix: '$',
        precision: 0,
      },
    ],
    guide: {
      whatIsIt:
        'Opportunity cost is the value of what you give up when you choose to spend money instead of invest it. This calculator shows what any purchase would be worth in the future if the money had been invested instead — revealing the true long-term cost of spending.',
      howToUse:
        'Enter the amount you plan to spend (or have spent), the expected annual return of an alternative investment, and the number of years to compound. The calculator shows the future value of that money and the opportunity cost.',
      exampleScenario:
        'Spending $10,000 on a luxury vacation might feel manageable, but at a 7% annual return over 20 years, that money would have grown to approximately $38,697 — an opportunity cost of $28,697.',
      proTip:
        'This framework is powerful for large discretionary purchases. For everyday expenses, consider a monthly or annual version: $500/month in subscriptions and dining invested at 7% for 30 years equals over $600,000.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 7. Inflation-Adjusted Return Calculator
  // =========================================================================
  {
    id: 'inflation-adjusted-return',
    slug: 'inflation-adjusted-return',
    title: 'Inflation-Adjusted Return Calculator',
    description:
      'Calculate your real investment return after inflation and see how much purchasing power you actually gain.',
    icon: '📉',
    category: 'finance',
    subcategory: 'fire',
    tags: ['inflation', 'real return', 'purchasing power', 'investment', 'CPI', 'nominal return', 'FIRE', 'retirement planning'],
    inputs: [
      {
        id: 'nominalReturn',
        label: 'Nominal Annual Return (%)',
        type: 'number',
        defaultValue: 8,
        min: 0,
        max: 50,
        step: 0.5,
        placeholder: 'e.g. 8',
        helpText: 'The gross annual return before adjusting for inflation.',
        required: true,
      },
      {
        id: 'inflationRate',
        label: 'Annual Inflation Rate (%)',
        type: 'number',
        defaultValue: 3,
        min: 0,
        max: 30,
        step: 0.1,
        placeholder: 'e.g. 3',
        helpText: 'Long-run US inflation average is about 3%. Current CPI may differ.',
        required: true,
      },
      {
        id: 'years',
        label: 'Investment Period (years)',
        type: 'number',
        defaultValue: 20,
        min: 1,
        max: 60,
        step: 1,
        placeholder: 'e.g. 20',
        required: true,
      },
      {
        id: 'initialAmount',
        label: 'Initial Investment',
        type: 'number',
        defaultValue: 10000,
        min: 0,
        step: 1000,
        placeholder: 'e.g. 10000',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'realReturn',
        expression: '((1 + nominalReturn / 100) / (1 + inflationRate / 100) - 1) * 100',
        dependencies: ['nominalReturn', 'inflationRate'],
      },
      {
        id: 'realFV',
        expression: 'initialAmount * pow(1 + realReturn / 100, years)',
        dependencies: ['initialAmount', 'realReturn', 'years'],
      },
      {
        id: 'nominalFV',
        expression: 'initialAmount * pow(1 + nominalReturn / 100, years)',
        dependencies: ['initialAmount', 'nominalReturn', 'years'],
      },
      {
        id: 'purchasingPowerLoss',
        expression: 'nominalFV - realFV',
        dependencies: ['nominalFV', 'realFV'],
      },
    ],
    outputs: [
      {
        id: 'real-return-out',
        label: 'Real Annual Return',
        formulaRef: 'realReturn',
        suffix: '%',
        precision: 2,
        highlight: true,
      },
      {
        id: 'real-fv-out',
        label: 'Real Future Value (today\'s dollars)',
        formulaRef: 'realFV',
        prefix: '$',
        precision: 0,
      },
      {
        id: 'nominal-fv-out',
        label: 'Nominal Future Value',
        formulaRef: 'nominalFV',
        prefix: '$',
        precision: 0,
      },
      {
        id: 'purchasing-power-loss-out',
        label: 'Lost to Inflation',
        formulaRef: 'purchasingPowerLoss',
        prefix: '$',
        precision: 0,
      },
    ],
    guide: {
      whatIsIt:
        'This calculator converts a nominal (headline) investment return into a real (inflation-adjusted) return using the Fisher equation. It shows both the nominal and real future values of an investment and quantifies how much purchasing power inflation silently erodes.',
      howToUse:
        'Enter the nominal annual return your investment earns, the expected inflation rate, the number of years, and your starting amount. The calculator shows your real return percentage and how much your money actually grows in terms of purchasing power.',
      exampleScenario:
        'A $10,000 investment returning 8% nominally over 20 years grows to $46,610. With 3% annual inflation, the real return is about 4.85%, meaning the real future value in today\'s dollars is approximately $25,751. Inflation silently consumed over $20,000.',
      proTip:
        'Always think in real returns when planning for FIRE. A 7% nominal return in a 3% inflation environment is only about 3.9% real — meaning your portfolio\'s actual purchasing power growth is far less than the headline number suggests.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 8. Geo-Arbitrage Savings Calculator
  // =========================================================================
  {
    id: 'geo-arbitrage-savings',
    slug: 'geo-arbitrage-savings',
    title: 'Geo-Arbitrage Savings Calculator',
    description:
      'Calculate how much you save by relocating to a lower cost-of-living country or city, and what those savings could grow to if invested.',
    icon: '🌍',
    category: 'finance',
    subcategory: 'fire',
    tags: ['geo-arbitrage', 'cost of living', 'digital nomad', 'FIRE', 'relocation', 'savings', 'international', 'COL index'],
    inputs: [
      {
        id: 'currentMonthlyExpenses',
        label: 'Current Monthly Expenses',
        type: 'number',
        defaultValue: 5000,
        min: 0,
        step: 100,
        placeholder: 'e.g. 5000',
        required: true,
      },
      {
        id: 'currentCOLIndex',
        label: 'Current City COL Index',
        type: 'number',
        defaultValue: 100,
        min: 1,
        max: 300,
        step: 1,
        placeholder: 'e.g. 100',
        helpText: '100 = US average. New York ~187, Los Angeles ~163.',
        required: true,
      },
      {
        id: 'targetCOLIndex',
        label: 'Target City COL Index',
        type: 'number',
        defaultValue: 55,
        min: 1,
        max: 300,
        step: 1,
        placeholder: 'e.g. 55',
        helpText: 'Chiang Mai ~40, Lisbon ~65, Medellin ~45, Prague ~60.',
        required: true,
      },
      {
        id: 'annualReturn',
        label: 'Investment Return (%)',
        type: 'number',
        defaultValue: 7,
        min: 0,
        max: 30,
        step: 0.5,
        placeholder: 'e.g. 7',
        helpText: 'Expected annual return on invested savings.',
      },
      {
        id: 'years',
        label: 'Years Abroad',
        type: 'number',
        defaultValue: 5,
        min: 1,
        max: 40,
        step: 1,
        placeholder: 'e.g. 5',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'targetExpenses',
        expression: 'currentMonthlyExpenses * targetCOLIndex / currentCOLIndex',
        dependencies: ['currentMonthlyExpenses', 'targetCOLIndex', 'currentCOLIndex'],
      },
      {
        id: 'monthlySavings',
        expression: 'currentMonthlyExpenses - targetExpenses',
        dependencies: ['currentMonthlyExpenses', 'targetExpenses'],
      },
      {
        id: 'annualSavings',
        expression: 'monthlySavings * 12',
        dependencies: ['monthlySavings'],
      },
      {
        id: 'futureValueSavings',
        expression: 'annualSavings * ((pow(1 + annualReturn / 100, years) - 1) / (annualReturn / 100))',
        dependencies: ['annualSavings', 'annualReturn', 'years'],
      },
    ],
    outputs: [
      {
        id: 'target-expenses-out',
        label: 'Monthly Expenses in Target City',
        formulaRef: 'targetExpenses',
        prefix: '$',
        precision: 0,
      },
      {
        id: 'monthly-savings-out',
        label: 'Monthly Savings',
        formulaRef: 'monthlySavings',
        prefix: '$',
        precision: 0,
        highlight: true,
      },
      {
        id: 'future-value-savings-out',
        label: 'Invested Savings After N Years',
        formulaRef: 'futureValueSavings',
        prefix: '$',
        precision: 0,
      },
    ],
    guide: {
      whatIsIt:
        'Geo-arbitrage is the strategy of earning income in a high-wage currency while living in a lower cost-of-living country. This calculator quantifies monthly savings from relocation and projects what those savings could grow to if invested.',
      howToUse:
        'Enter your current monthly expenses, your current city\'s COL index, the target city\'s COL index (Numbeo.com is a good source), and your expected investment return. The calculator shows your new monthly expenses, monthly savings, and the future value of those savings if invested.',
      exampleScenario:
        'An American spending $5,000/month (COL 100) who moves to Lisbon (COL 65) could live for $3,250/month — saving $1,750/month. Over 5 years, those savings invested at 7% could grow to approximately $124,000.',
      proTip:
        'Even short-term geo-arbitrage (2-5 years) can dramatically accelerate your FIRE timeline. Portugal, Mexico, Thailand, and Colombia are popular destinations for English-speaking remote workers due to their combination of low cost, high quality of life, and reliable infrastructure.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 9. Emergency Fund Calculator
  // =========================================================================
  {
    id: 'emergency-fund-calculator',
    slug: 'emergency-fund-calculator',
    title: 'Emergency Fund Size Calculator',
    description:
      'Calculate the right emergency fund target based on your monthly expenses and employment situation.',
    icon: '🛡️',
    category: 'finance',
    subcategory: 'fire',
    tags: ['emergency fund', 'savings', 'financial safety net', 'liquid savings', 'job loss', 'FIRE foundation', 'personal finance'],
    inputs: [
      {
        id: 'monthlyExpenses',
        label: 'Monthly Essential Expenses',
        type: 'number',
        defaultValue: 3500,
        min: 0,
        step: 100,
        placeholder: 'e.g. 3500',
        helpText: 'Include rent/mortgage, utilities, groceries, insurance, and minimum debt payments.',
        required: true,
      },
      {
        id: 'months',
        label: 'Target Coverage',
        type: 'select',
        defaultValue: '6',
        options: [
          { label: '3 months (employed, stable)', value: '3' },
          { label: '6 months (recommended)', value: '6' },
          { label: '9 months (single income)', value: '9' },
          { label: '12 months (self-employed)', value: '12' },
        ],
        helpText: 'Most financial advisors recommend 3-6 months. Self-employed or single-income households should target 9-12 months.',
      },
      {
        id: 'currentSavings',
        label: 'Current Emergency Fund',
        type: 'number',
        defaultValue: 5000,
        min: 0,
        step: 500,
        placeholder: 'e.g. 5000',
      },
    ],
    formulas: [
      {
        id: 'target',
        expression: 'monthlyExpenses * months',
        dependencies: ['monthlyExpenses', 'months'],
      },
      {
        id: 'shortfall',
        expression: 'max(target - currentSavings, 0)',
        dependencies: ['target', 'currentSavings'],
      },
      {
        id: 'progress',
        expression: 'min(currentSavings / target * 100, 100)',
        dependencies: ['currentSavings', 'target'],
      },
    ],
    outputs: [
      {
        id: 'target-out',
        label: 'Emergency Fund Target',
        formulaRef: 'target',
        prefix: '$',
        precision: 0,
        highlight: true,
      },
      {
        id: 'shortfall-out',
        label: 'Still Needed',
        formulaRef: 'shortfall',
        prefix: '$',
        precision: 0,
      },
      {
        id: 'progress-out',
        label: 'Funded',
        formulaRef: 'progress',
        suffix: '%',
        precision: 1,
      },
    ],
    guide: {
      whatIsIt:
        'An emergency fund is liquid cash (or near-cash) set aside to cover essential living expenses in the event of job loss, medical emergency, or major unexpected expense. It is the financial foundation without which no investing or FIRE strategy can be safely pursued.',
      howToUse:
        'Enter your monthly essential expenses (not total spending — just bare necessities), choose your coverage target based on your risk profile, and enter your current emergency savings. The calculator shows your target, how much more you need, and your current funded percentage.',
      exampleScenario:
        'Monthly essential expenses of $3,500 with a 6-month target means you need $21,000. With $5,000 saved, you are 23.8% funded and still need $16,000 to reach the recommended level.',
      proTip:
        'Keep your emergency fund in a high-yield savings account (HYSA) to earn 4-5% APY while maintaining instant liquidity. Do not invest your emergency fund in stocks — a job loss often coincides with a market downturn, the worst time to sell.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 10. Dividend Snowball Calculator
  // =========================================================================
  {
    id: 'dividend-snowball-calculator',
    slug: 'dividend-snowball-calculator',
    title: 'Dividend Snowball Calculator',
    description:
      'Project the growth of your dividend income stream through reinvestment and regular contributions over time.',
    icon: '❄',
    category: 'finance',
    subcategory: 'fire',
    tags: ['dividend investing', 'dividend growth', 'DRIP', 'passive income', 'dividend snowball', 'FIRE', 'income investing', 'portfolio'],
    inputs: [
      {
        id: 'initialInvestment',
        label: 'Initial Investment',
        type: 'number',
        defaultValue: 10000,
        min: 0,
        step: 1000,
        placeholder: 'e.g. 10000',
        required: true,
      },
      {
        id: 'monthlyContribution',
        label: 'Monthly Contribution',
        type: 'number',
        defaultValue: 500,
        min: 0,
        step: 50,
        placeholder: 'e.g. 500',
        helpText: 'Additional amount you invest each month.',
      },
      {
        id: 'dividendYield',
        label: 'Dividend Yield (%)',
        type: 'number',
        defaultValue: 4,
        min: 0,
        max: 20,
        step: 0.1,
        placeholder: 'e.g. 4',
        helpText: 'Annual dividend payout as a percentage of portfolio value. REITs/ETFs: 3-6%, high-yield stocks: 5-8%.',
        required: true,
      },
      {
        id: 'dividendGrowth',
        label: 'Annual Dividend Growth Rate (%)',
        type: 'number',
        defaultValue: 6,
        min: 0,
        max: 30,
        step: 0.5,
        placeholder: 'e.g. 6',
        helpText: 'How much the dividend per share grows each year. Dividend Aristocrats average ~6% growth.',
        required: true,
      },
      {
        id: 'years',
        label: 'Years',
        type: 'number',
        defaultValue: 20,
        min: 1,
        max: 60,
        step: 1,
        placeholder: 'e.g. 20',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'annualContrib',
        expression: 'monthlyContribution * 12',
        dependencies: ['monthlyContribution'],
      },
      {
        id: 'estimatedPortfolio',
        expression: '(initialInvestment + annualContrib * years) * pow(1 + dividendGrowth / 100, years)',
        dependencies: ['initialInvestment', 'annualContrib', 'years', 'dividendGrowth'],
      },
      {
        id: 'annualDividendIncome',
        expression: 'estimatedPortfolio * dividendYield / 100',
        dependencies: ['estimatedPortfolio', 'dividendYield'],
      },
      {
        id: 'monthlyDividendIncome',
        expression: 'annualDividendIncome / 12',
        dependencies: ['annualDividendIncome'],
      },
    ],
    outputs: [
      {
        id: 'estimated-portfolio-out',
        label: 'Estimated Portfolio Value',
        formulaRef: 'estimatedPortfolio',
        prefix: '$',
        precision: 0,
      },
      {
        id: 'annual-dividend-income-out',
        label: 'Annual Dividend Income',
        formulaRef: 'annualDividendIncome',
        prefix: '$',
        precision: 0,
        highlight: true,
      },
      {
        id: 'monthly-dividend-income-out',
        label: 'Monthly Dividend Income',
        formulaRef: 'monthlyDividendIncome',
        prefix: '$',
        precision: 0,
      },
    ],
    guide: {
      whatIsIt:
        'The Dividend Snowball Calculator models how your dividend income grows as your portfolio compounds through reinvestment (DRIP) and regular contributions. Like a snowball rolling downhill, dividends buy more shares which pay more dividends — the effect accelerates over time.',
      howToUse:
        'Enter your starting portfolio, monthly contributions, current dividend yield, the expected annual rate of dividend growth, and the number of years. The calculator projects your estimated portfolio value and the annual and monthly dividend income it generates.',
      exampleScenario:
        'Starting with $10,000, contributing $500/month, at a 4% yield with 6% dividend growth over 20 years: your portfolio could grow to approximately $585,000 generating around $23,400/year ($1,950/month) in dividends.',
      proTip:
        'Focus on dividend growth rate as much as current yield. A company paying 2% with 10% annual dividend growth will out-yield a 5% static payer within 10 years. The Dividend Aristocrats (25+ years of consecutive increases) offer a proven track record of dividend growth.',
    },
    metadata: { version: '1.0.0' },
  },
];
