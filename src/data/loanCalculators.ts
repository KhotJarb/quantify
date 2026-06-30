// ---------------------------------------------------------------------------
// Quantify — Loan & Credit-Card Calculators
// ---------------------------------------------------------------------------
// Five calculators covering standard loans, auto loans, credit-card payoff,
// minimum-payment analysis, and loan amortisation summaries with extra
// payment scenarios.
// ---------------------------------------------------------------------------

import type { CalculatorSchema } from '@/types/calculator';

export const loanCalculators: CalculatorSchema[] = [
  // =========================================================================
  // 1. Loan Calculator
  // =========================================================================
  {
    id: 'loan-calculator',
    slug: 'loan-calculator',
    title: 'Loan Calculator',
    description:
      'Calculate your monthly payment, total amount paid, and total interest for any fixed-rate loan.',
    icon: '🏦',
    category: 'finance',
    subcategory: 'loans-mortgages',
    tags: ['loan', 'payment', 'interest', 'amortization', 'mortgage'],
    inputs: [
      {
        id: 'loanAmount',
        label: 'Loan Amount ($)',
        type: 'number',
        min: 0,
        step: 100,
        defaultValue: 250000,
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
        defaultValue: 6.5,
        placeholder: 'e.g. 6.5',
        required: true,
      },
      {
        id: 'loanTermYears',
        label: 'Loan Term (years)',
        type: 'number',
        min: 0,
        max: 50,
        step: 1,
        defaultValue: 30,
        placeholder: 'e.g. 30',
        required: true,
      },
      {
        id: 'loanTermMonths',
        label: 'Additional Months',
        type: 'number',
        min: 0,
        max: 11,
        step: 1,
        defaultValue: 0,
        placeholder: 'e.g. 6',
        helpText: 'Extra months on top of the years above (0–11).',
      },
    ],
    formulas: [
      {
        id: 'totalMonths',
        expression: 'loanTermYears * 12 + loanTermMonths',
        dependencies: ['loanTermYears', 'loanTermMonths'],
      },
      {
        id: 'monthlyRate',
        expression: 'annualRate / 100 / 12',
        dependencies: ['annualRate'],
      },
      {
        id: 'monthlyPayment',
        expression: 'pmt(monthlyRate, totalMonths, loanAmount)',
        dependencies: ['monthlyRate', 'totalMonths', 'loanAmount'],
      },
      {
        id: 'monthlyPaymentAbs',
        expression: 'abs(monthlyPayment)',
        dependencies: ['monthlyPayment'],
      },
      {
        id: 'totalPaid',
        expression: 'monthlyPaymentAbs * totalMonths',
        dependencies: ['monthlyPaymentAbs', 'totalMonths'],
      },
      {
        id: 'totalInterest',
        expression: 'totalPaid - loanAmount',
        dependencies: ['totalPaid', 'loanAmount'],
      },
    ],
    outputs: [
      {
        id: 'monthly-payment',
        label: 'Monthly Payment',
        formulaRef: 'monthlyPaymentAbs',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
      {
        id: 'total-paid',
        label: 'Total Paid',
        formulaRef: 'totalPaid',
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
      whatIsIt:
        'A loan calculator determines your fixed monthly payment for a standard amortising loan. It uses the present-value annuity formula (PMT) to split the principal and interest evenly across the life of the loan.',
      howToUse:
        'Enter the total loan amount, the annual interest rate your lender quoted, and the loan term in years (plus any extra months). The calculator instantly shows your monthly payment, the total you will pay over the life of the loan, and how much of that total is pure interest.',
      exampleScenario:
        'You borrow $250,000 at 6.5 % for 30 years. Your monthly payment is approximately $1,580. Over the full term you will pay about $569,000 — meaning roughly $319,000 is interest alone.',
      proTip:
        'Even a 0.25 % drop in rate on a 30-year mortgage can save you tens of thousands of dollars. Always compare lender offers and consider paying points upfront to buy down the rate.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 2. Auto Loan Calculator
  // =========================================================================
  {
    id: 'auto-loan-calculator',
    slug: 'auto-loan-calculator',
    title: 'Auto Loan Calculator',
    description:
      'Estimate monthly payments and total cost for a vehicle purchase including down payment and trade-in value.',
    icon: '🚗',
    category: 'finance',
    subcategory: 'loans-mortgages',
    tags: ['auto', 'car', 'vehicle', 'loan', 'payment', 'financing'],
    inputs: [
      {
        id: 'vehiclePrice',
        label: 'Vehicle Price ($)',
        type: 'number',
        min: 0,
        step: 100,
        defaultValue: 35000,
        placeholder: 'e.g. 35000',
        required: true,
      },
      {
        id: 'downPayment',
        label: 'Down Payment ($)',
        type: 'number',
        min: 0,
        step: 100,
        defaultValue: 5000,
        placeholder: 'e.g. 5000',
      },
      {
        id: 'tradeInValue',
        label: 'Trade-In Value ($)',
        type: 'number',
        min: 0,
        step: 100,
        defaultValue: 0,
        placeholder: 'e.g. 3000',
      },
      {
        id: 'annualRate',
        label: 'Annual Interest Rate (%)',
        type: 'number',
        min: 0,
        max: 100,
        step: 0.01,
        defaultValue: 5.9,
        placeholder: 'e.g. 5.9',
        required: true,
      },
      {
        id: 'loanTermMonths',
        label: 'Loan Term',
        type: 'select',
        options: [
          { label: '24 months (2 years)', value: '24' },
          { label: '36 months (3 years)', value: '36' },
          { label: '48 months (4 years)', value: '48' },
          { label: '60 months (5 years)', value: '60' },
          { label: '72 months (6 years)', value: '72' },
          { label: '84 months (7 years)', value: '84' },
        ],
        defaultValue: '60',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'loanAmount',
        expression: 'vehiclePrice - downPayment - tradeInValue',
        dependencies: ['vehiclePrice', 'downPayment', 'tradeInValue'],
      },
      {
        id: 'monthlyRate',
        expression: 'annualRate / 100 / 12',
        dependencies: ['annualRate'],
      },
      {
        id: 'monthlyPayment',
        expression: 'abs(pmt(monthlyRate, loanTermMonths, loanAmount))',
        dependencies: ['monthlyRate', 'loanTermMonths', 'loanAmount'],
      },
      {
        id: 'totalPaid',
        expression: 'monthlyPayment * loanTermMonths',
        dependencies: ['monthlyPayment', 'loanTermMonths'],
      },
      {
        id: 'totalInterest',
        expression: 'totalPaid - loanAmount',
        dependencies: ['totalPaid', 'loanAmount'],
      },
      {
        id: 'totalCost',
        expression: 'totalPaid + downPayment + tradeInValue',
        dependencies: ['totalPaid', 'downPayment', 'tradeInValue'],
      },
    ],
    outputs: [
      {
        id: 'loan-amount',
        label: 'Loan Amount',
        formulaRef: 'loanAmount',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'monthly-payment',
        label: 'Monthly Payment',
        formulaRef: 'monthlyPayment',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
      {
        id: 'total-interest',
        label: 'Total Interest',
        formulaRef: 'totalInterest',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'total-cost',
        label: 'Total Cost',
        formulaRef: 'totalCost',
        format: 'currency',
        precision: 2,
      },
    ],
    guide: {
      whatIsIt:
        'The auto loan calculator estimates your monthly car payment by factoring in the vehicle price, any down payment or trade-in credit, the interest rate, and the chosen loan term. It uses the standard PMT annuity formula used by dealerships and banks.',
      howToUse:
        'Enter the sticker or negotiated price, subtract any cash down payment and trade-in value, pick an interest rate and term length. The calculator shows the financed amount, monthly payment, total interest, and the overall cost of the vehicle.',
      exampleScenario:
        'A $35,000 car with $5,000 down, no trade-in, at 5.9 % for 60 months results in a $30,000 loan with a monthly payment of about $580 and roughly $4,800 in interest over the life of the loan.',
      proTip:
        'Shorter loan terms (36–48 months) carry higher monthly payments but dramatically reduce total interest. A 60-month loan at 5.9 % costs nearly twice the interest of a 36-month loan at the same rate.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 3. Credit Card Payoff Calculator
  // =========================================================================
  {
    id: 'credit-card-payoff',
    slug: 'credit-card-payoff',
    title: 'Credit Card Payoff Calculator',
    description:
      'Find out how long it will take to pay off your credit card balance and how much interest you will pay.',
    icon: '💳',
    category: 'finance',
    subcategory: 'credit-cards',
    tags: ['credit card', 'payoff', 'debt', 'interest', 'payment'],
    inputs: [
      {
        id: 'balance',
        label: 'Current Balance ($)',
        type: 'number',
        min: 0,
        step: 100,
        defaultValue: 5000,
        placeholder: 'e.g. 5000',
        required: true,
      },
      {
        id: 'annualRate',
        label: 'Annual Interest Rate (APR %)',
        type: 'number',
        min: 0,
        max: 100,
        step: 0.01,
        defaultValue: 22.99,
        placeholder: 'e.g. 22.99',
        required: true,
      },
      {
        id: 'monthlyPayment',
        label: 'Monthly Payment ($)',
        type: 'number',
        min: 1,
        step: 10,
        defaultValue: 200,
        placeholder: 'e.g. 200',
        required: true,
        helpText: 'The fixed amount you plan to pay each month.',
      },
    ],
    formulas: [
      {
        id: 'monthlyRate',
        expression: 'annualRate / 100 / 12',
        dependencies: ['annualRate'],
      },
      {
        id: 'monthsToPayoff',
        expression: 'nper(monthlyRate, monthlyPayment * -1, balance)',
        dependencies: ['monthlyRate', 'monthlyPayment', 'balance'],
      },
      {
        id: 'monthsToPayoffAbs',
        expression: 'abs(ceil(monthsToPayoff))',
        dependencies: ['monthsToPayoff'],
      },
      {
        id: 'yearsToPayoff',
        expression: 'floor(monthsToPayoffAbs / 12)',
        dependencies: ['monthsToPayoffAbs'],
      },
      {
        id: 'remainingMonths',
        expression: 'mod(monthsToPayoffAbs, 12)',
        dependencies: ['monthsToPayoffAbs'],
      },
      {
        id: 'totalPaid',
        expression: 'monthlyPayment * monthsToPayoffAbs',
        dependencies: ['monthlyPayment', 'monthsToPayoffAbs'],
      },
      {
        id: 'totalInterest',
        expression: 'totalPaid - balance',
        dependencies: ['totalPaid', 'balance'],
      },
    ],
    outputs: [
      {
        id: 'months-to-payoff',
        label: 'Months to Payoff',
        formulaRef: 'monthsToPayoffAbs',
        format: 'number',
        precision: 0,
        suffix: ' months',
      },
      {
        id: 'years-to-payoff',
        label: 'Years',
        formulaRef: 'yearsToPayoff',
        format: 'number',
        precision: 0,
        suffix: ' years',
      },
      {
        id: 'remaining-months',
        label: 'Remaining Months',
        formulaRef: 'remainingMonths',
        format: 'number',
        precision: 0,
        suffix: ' months',
      },
      {
        id: 'total-interest',
        label: 'Total Interest',
        formulaRef: 'totalInterest',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
    ],
    guide: {
      whatIsIt:
        'This calculator tells you exactly how many months (and years) it will take to eliminate a credit card balance when you make a fixed monthly payment. It also reveals the total interest you will pay over that period.',
      howToUse:
        'Enter your current card balance, the APR listed on your statement, and the fixed monthly payment you can commit to. The results show the payoff timeline and total interest cost.',
      exampleScenario:
        'With a $5,000 balance at 22.99 % APR and $200/month payments, you will be debt-free in about 32 months and pay roughly $1,300 in interest.',
      proTip:
        'Paying even $50 extra per month can shave months off your payoff timeline and save hundreds in interest. Consider balance-transfer cards with 0 % promotional APR to accelerate debt reduction.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 4. Credit Card Minimum Payment Calculator
  // =========================================================================
  {
    id: 'credit-card-minimum',
    slug: 'credit-card-minimum',
    title: 'Credit Card Minimum Payment',
    description:
      'See the true cost of making only the minimum payment on your credit card — how long until payoff and how much interest you will pay.',
    icon: '💸',
    category: 'finance',
    subcategory: 'credit-cards',
    tags: ['credit card', 'minimum payment', 'debt', 'interest', 'payoff'],
    inputs: [
      {
        id: 'balance',
        label: 'Current Balance ($)',
        type: 'number',
        min: 0,
        step: 100,
        defaultValue: 5000,
        placeholder: 'e.g. 5000',
        required: true,
      },
      {
        id: 'annualRate',
        label: 'Annual Interest Rate (APR %)',
        type: 'number',
        min: 0,
        max: 100,
        step: 0.01,
        defaultValue: 22.99,
        placeholder: 'e.g. 22.99',
        required: true,
      },
      {
        id: 'minimumPaymentPercent',
        label: 'Minimum Payment (%)',
        type: 'range',
        min: 1,
        max: 5,
        step: 0.5,
        defaultValue: 2,
        helpText: 'Most issuers set the minimum at 1 %–3 % of the balance (or a $25 floor).',
      },
    ],
    formulas: [
      {
        id: 'minimumPayment',
        expression: 'max(balance * minimumPaymentPercent / 100, 25)',
        dependencies: ['balance', 'minimumPaymentPercent'],
      },
      {
        id: 'monthlyRate',
        expression: 'annualRate / 100 / 12',
        dependencies: ['annualRate'],
      },
      {
        id: 'monthsToPayoff',
        expression: 'abs(ceil(nper(monthlyRate, minimumPayment * -1, balance)))',
        dependencies: ['monthlyRate', 'minimumPayment', 'balance'],
      },
      {
        id: 'totalPaid',
        expression: 'minimumPayment * monthsToPayoff',
        dependencies: ['minimumPayment', 'monthsToPayoff'],
      },
      {
        id: 'totalInterest',
        expression: 'totalPaid - balance',
        dependencies: ['totalPaid', 'balance'],
      },
    ],
    outputs: [
      {
        id: 'minimum-payment',
        label: 'Minimum Payment',
        formulaRef: 'minimumPayment',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'months-to-payoff',
        label: 'Months to Payoff',
        formulaRef: 'monthsToPayoff',
        format: 'number',
        precision: 0,
        suffix: ' months',
        highlight: true,
      },
      {
        id: 'total-paid',
        label: 'Total Paid',
        formulaRef: 'totalPaid',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'total-interest',
        label: 'Total Interest',
        formulaRef: 'totalInterest',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
    ],
    guide: {
      whatIsIt:
        'This calculator illustrates the hidden cost of making only the minimum payment on a credit card. It computes a fixed minimum payment (the greater of a percentage of the balance or $25) and shows how long full repayment takes and how much extra you pay in interest. Note: this is a simplified model — real minimum payments are recalculated each billing cycle as the balance shrinks, so actual payoff times may differ.',
      howToUse:
        'Enter your card balance and APR, then adjust the minimum-payment percentage (typically 1 %–3 %). The calculator shows the initial minimum payment amount, the approximate months to payoff, and the total interest cost.',
      exampleScenario:
        'A $5,000 balance at 22.99 % APR with a 2 % minimum payment ($100) would take roughly 9 years and cost over $8,000 in interest — meaning you pay more than double the original balance.',
      proTip:
        'Always pay more than the minimum. Even doubling the minimum payment can cut your payoff time by more than half and save thousands in interest.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 5. Loan Analysis / Amortization Summary
  // =========================================================================
  {
    id: 'loan-analysis',
    slug: 'loan-analysis',
    title: 'Loan Analysis',
    description:
      'Compare your standard loan payments against an accelerated schedule with extra monthly payments — see how much interest you save and how many months you cut off.',
    icon: '📊',
    category: 'finance',
    subcategory: 'loans-mortgages',
    tags: ['loan', 'amortization', 'extra payment', 'interest savings', 'analysis'],
    inputs: [
      {
        id: 'loanAmount',
        label: 'Loan Amount ($)',
        type: 'number',
        min: 0,
        step: 100,
        defaultValue: 250000,
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
        defaultValue: 6.5,
        placeholder: 'e.g. 6.5',
        required: true,
      },
      {
        id: 'loanTermYears',
        label: 'Loan Term (years)',
        type: 'number',
        min: 1,
        max: 50,
        step: 1,
        defaultValue: 30,
        placeholder: 'e.g. 30',
        required: true,
      },
      {
        id: 'extraMonthlyPayment',
        label: 'Extra Monthly Payment ($)',
        type: 'number',
        min: 0,
        step: 50,
        defaultValue: 0,
        placeholder: 'e.g. 200',
        helpText: 'Additional amount paid towards principal each month.',
      },
    ],
    formulas: [
      {
        id: 'monthlyRate',
        expression: 'annualRate / 100 / 12',
        dependencies: ['annualRate'],
      },
      {
        id: 'totalMonths',
        expression: 'loanTermYears * 12',
        dependencies: ['loanTermYears'],
      },
      {
        id: 'standardPayment',
        expression: 'abs(pmt(monthlyRate, totalMonths, loanAmount))',
        dependencies: ['monthlyRate', 'totalMonths', 'loanAmount'],
      },
      {
        id: 'actualPayment',
        expression: 'standardPayment + extraMonthlyPayment',
        dependencies: ['standardPayment', 'extraMonthlyPayment'],
      },
      {
        id: 'standardTotalInterest',
        expression: 'standardPayment * totalMonths - loanAmount',
        dependencies: ['standardPayment', 'totalMonths', 'loanAmount'],
      },
      {
        id: 'acceleratedMonths',
        expression: 'abs(ceil(nper(monthlyRate, actualPayment * -1, loanAmount)))',
        dependencies: ['monthlyRate', 'actualPayment', 'loanAmount'],
      },
      {
        id: 'acceleratedTotalInterest',
        expression: 'actualPayment * acceleratedMonths - loanAmount',
        dependencies: ['actualPayment', 'acceleratedMonths', 'loanAmount'],
      },
      {
        id: 'interestSaved',
        expression: 'standardTotalInterest - acceleratedTotalInterest',
        dependencies: ['standardTotalInterest', 'acceleratedTotalInterest'],
      },
      {
        id: 'monthsSaved',
        expression: 'totalMonths - acceleratedMonths',
        dependencies: ['totalMonths', 'acceleratedMonths'],
      },
    ],
    outputs: [
      {
        id: 'standard-payment',
        label: 'Standard Payment',
        formulaRef: 'standardPayment',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'accelerated-payment',
        label: 'Accelerated Payment',
        formulaRef: 'actualPayment',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'interest-saved',
        label: 'Interest Saved',
        formulaRef: 'interestSaved',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
      {
        id: 'months-saved',
        label: 'Months Saved',
        formulaRef: 'monthsSaved',
        format: 'number',
        precision: 0,
        suffix: ' months',
        highlight: true,
      },
      {
        id: 'standard-total-interest',
        label: 'Standard Total Interest',
        formulaRef: 'standardTotalInterest',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'accelerated-total-interest',
        label: 'Accelerated Total Interest',
        formulaRef: 'acceleratedTotalInterest',
        format: 'currency',
        precision: 2,
      },
    ],
    guide: {
      whatIsIt:
        'The Loan Analysis calculator compares a standard repayment schedule to an accelerated one where you add extra money to each monthly payment. It quantifies the interest savings and time reduction from paying even a little extra each month.',
      howToUse:
        'Enter the loan amount, interest rate, and original term. Then type in the extra amount you can pay each month (even $50 helps). The calculator shows both the standard and accelerated payment amounts, the interest you save, and how many months you shave off the loan.',
      exampleScenario:
        'On a $250,000 mortgage at 6.5 % for 30 years, the standard payment is about $1,580/month. Adding just $200/month extra saves roughly $100,000 in interest and pays the loan off about 8 years early.',
      proTip:
        'Direct your extra payment specifically towards principal — confirm with your lender that there are no prepayment penalties. Even one extra full payment per year (split across 12 months) can save years of interest.',
    },
    metadata: { version: '1.0.0' },
  },
];
