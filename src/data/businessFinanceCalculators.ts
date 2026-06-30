// ---------------------------------------------------------------------------
// Quantify — Business & Finance Calculators
// ---------------------------------------------------------------------------
// 7 calculators covering APR, ROI, Discount/Tax, IRR/NPV, Rule of 72,
// Effective Interest Rate, and US Inflation adjustments.
// ---------------------------------------------------------------------------

import type { CalculatorSchema } from '@/types/calculator';

export const businessFinanceCalculators: CalculatorSchema[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // 1. APR Calculator
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'apr-calculator',
    slug: 'apr-calculator',
    title: 'APR Calculator',
    description:
      'Calculate the Annual Percentage Rate (APR) for a loan, factoring in fees and interest to reveal the true cost of borrowing.',
    icon: '🏦',
    category: 'finance',
    subcategory: 'business',
    tags: ['apr', 'annual percentage rate', 'loan', 'fees', 'interest', 'borrowing cost'],
    inputs: [
      {
        id: 'loanAmount',
        label: 'Loan Amount',
        type: 'number',
        placeholder: 'e.g. 25000',
        min: 1,
        required: true,
        helpText: 'The principal amount you are borrowing.',
      },
      {
        id: 'totalFees',
        label: 'Total Fees',
        type: 'number',
        placeholder: 'e.g. 1000',
        min: 0,
        defaultValue: 0,
        required: true,
        helpText: 'All upfront fees (origination, closing costs, etc.).',
      },
      {
        id: 'interestRate',
        label: 'Nominal Interest Rate',
        type: 'number',
        placeholder: 'e.g. 6.5',
        min: 0.01,
        step: 0.01,
        required: true,
        helpText: 'The stated annual interest rate on the loan (%%).',
      },
      {
        id: 'loanTermYears',
        label: 'Loan Term',
        type: 'number',
        placeholder: 'e.g. 5',
        min: 1,
        max: 50,
        required: true,
        helpText: 'Duration of the loan in years.',
      },
    ],
    formulas: [
      {
        id: 'effectiveLoan',
        expression: 'loanAmount - totalFees',
        dependencies: ['loanAmount', 'totalFees'],
      },
      {
        id: 'monthlyRate',
        expression: 'interestRate / 100 / 12',
        dependencies: ['interestRate'],
      },
      {
        id: 'totalMonths',
        expression: 'loanTermYears * 12',
        dependencies: ['loanTermYears'],
      },
      {
        id: 'monthlyPayment',
        expression: 'abs(pmt(monthlyRate, totalMonths, loanAmount))',
        dependencies: ['monthlyRate', 'totalMonths', 'loanAmount'],
      },
      {
        id: 'aprMonthly',
        expression: 'rate(totalMonths, monthlyPayment * -1, effectiveLoan)',
        dependencies: ['totalMonths', 'monthlyPayment', 'effectiveLoan'],
      },
      {
        id: 'apr',
        expression: 'aprMonthly * 12 * 100',
        dependencies: ['aprMonthly'],
      },
    ],
    outputs: [
      {
        id: 'aprResult',
        label: 'Annual Percentage Rate (APR)',
        formulaRef: 'apr',
        format: 'number',
        precision: 3,
        suffix: '%',
        highlight: true,
      },
      {
        id: 'monthlyPaymentResult',
        label: 'Monthly Payment',
        formulaRef: 'monthlyPayment',
        format: 'currency',
        precision: 2,
      },
    ],
    guide: {
      whatIsIt:
        'The Annual Percentage Rate (APR) is the true annual cost of a loan expressed as a percentage. Unlike the nominal interest rate, APR includes origination fees, closing costs, and other charges — giving you a single number to compare different loan offers on equal footing.',
      howToUse:
        '1. Enter the loan principal (the amount you are borrowing).\n2. Enter the total upfront fees charged by the lender.\n3. Enter the stated (nominal) annual interest rate.\n4. Enter the loan term in years.\nThe calculator will show the effective APR and your monthly payment.',
      exampleScenario:
        'You borrow $25,000 at a 6.5% nominal rate for 5 years with $1,000 in origination fees. Your monthly payment is about $489. Because the fees reduce the amount you actually receive, the APR comes out higher than 6.5%, revealing the true cost of the loan.',
      proTip:
        'When comparing loan offers, always compare APRs rather than nominal rates. A loan with a lower nominal rate but high fees can be more expensive than one with a slightly higher rate and no fees.',
    },
    metadata: { version: '1.0.0' },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. ROI Calculator
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'roi-calculator',
    slug: 'roi-calculator',
    title: 'ROI Calculator',
    description:
      'Measure the Return on Investment (ROI) as a percentage, plus the annualized return to compare investments of different durations.',
    icon: '📈',
    category: 'finance',
    subcategory: 'business',
    tags: ['roi', 'return on investment', 'gain', 'profit', 'annualized return'],
    inputs: [
      {
        id: 'initialInvestment',
        label: 'Initial Investment',
        type: 'number',
        placeholder: 'e.g. 10000',
        min: 0.01,
        required: true,
        helpText: 'The amount originally invested.',
      },
      {
        id: 'finalValue',
        label: 'Final Value',
        type: 'number',
        placeholder: 'e.g. 15000',
        min: 0,
        required: true,
        helpText: 'The current or ending value of the investment.',
      },
      {
        id: 'investmentDuration',
        label: 'Investment Duration (years)',
        type: 'number',
        placeholder: 'e.g. 3',
        min: 0.01,
        step: 0.1,
        required: true,
        helpText: 'How long you held the investment, in years.',
      },
    ],
    formulas: [
      {
        id: 'gain',
        expression: 'finalValue - initialInvestment',
        dependencies: ['finalValue', 'initialInvestment'],
      },
      {
        id: 'roi',
        expression: 'gain / initialInvestment * 100',
        dependencies: ['gain', 'initialInvestment'],
      },
      {
        id: 'annualizedROI',
        expression: '(pow(finalValue / initialInvestment, 1 / investmentDuration) - 1) * 100',
        dependencies: ['finalValue', 'initialInvestment', 'investmentDuration'],
      },
    ],
    outputs: [
      {
        id: 'gainResult',
        label: 'Total Gain / Loss',
        formulaRef: 'gain',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'roiResult',
        label: 'Return on Investment (ROI)',
        formulaRef: 'roi',
        format: 'percentage',
        precision: 2,
        suffix: '%',
        highlight: true,
      },
      {
        id: 'annualizedROIResult',
        label: 'Annualized ROI',
        formulaRef: 'annualizedROI',
        format: 'percentage',
        precision: 2,
        suffix: '%',
        highlight: true,
      },
    ],
    guide: {
      whatIsIt:
        'Return on Investment (ROI) measures how much profit or loss an investment generated relative to its cost, expressed as a percentage. The annualized ROI further normalizes the return to a per-year basis, making it easy to compare investments held for different lengths of time.',
      howToUse:
        '1. Enter the amount you originally invested.\n2. Enter the current or final value of your investment.\n3. Enter how long you held the investment in years (decimals are fine — e.g., 2.5 for two and a half years).\nThe calculator returns the total gain, overall ROI percentage, and annualized ROI.',
      exampleScenario:
        'You invest $10,000 in a stock and sell it 3 years later for $15,000. Your total gain is $5,000, your ROI is 50%, and your annualized ROI is about 14.47% — meaning the investment grew at roughly 14.47% per year on a compound basis.',
      proTip:
        'Annualized ROI is more meaningful than total ROI for comparing investments. A 50% return over 10 years is far less impressive than 50% over 2 years. Always annualize to compare apples to apples.',
    },
    metadata: { version: '1.0.0' },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. Discount and Tax Calculator
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'discount-tax-calculator',
    slug: 'discount-tax-calculator',
    title: 'Discount & Tax Calculator',
    description:
      'Calculate the final price of an item after applying a discount and then adding sales tax.',
    icon: '🏷️',
    category: 'finance',
    subcategory: 'business',
    tags: ['discount', 'tax', 'sales tax', 'price', 'savings', 'shopping'],
    inputs: [
      {
        id: 'originalPrice',
        label: 'Original Price',
        type: 'number',
        placeholder: 'e.g. 199.99',
        min: 0,
        required: true,
        helpText: 'The listed or sticker price before any discount.',
      },
      {
        id: 'discountPercent',
        label: 'Discount',
        type: 'number',
        placeholder: 'e.g. 20',
        min: 0,
        max: 100,
        step: 0.1,
        defaultValue: 0,
        required: true,
        helpText: 'Percentage discount to apply.',
      },
      {
        id: 'taxRate',
        label: 'Tax Rate',
        type: 'number',
        placeholder: 'e.g. 8.25',
        min: 0,
        max: 100,
        step: 0.01,
        defaultValue: 0,
        required: true,
        helpText: 'Sales or value-added tax rate applied after the discount.',
      },
    ],
    formulas: [
      {
        id: 'discountAmount',
        expression: 'originalPrice * discountPercent / 100',
        dependencies: ['originalPrice', 'discountPercent'],
      },
      {
        id: 'priceAfterDiscount',
        expression: 'originalPrice - discountAmount',
        dependencies: ['originalPrice', 'discountAmount'],
      },
      {
        id: 'taxAmount',
        expression: 'priceAfterDiscount * taxRate / 100',
        dependencies: ['priceAfterDiscount', 'taxRate'],
      },
      {
        id: 'finalPrice',
        expression: 'priceAfterDiscount + taxAmount',
        dependencies: ['priceAfterDiscount', 'taxAmount'],
      },
      {
        id: 'totalSavings',
        expression: 'originalPrice * discountPercent / 100',
        dependencies: ['originalPrice', 'discountPercent'],
      },
    ],
    outputs: [
      {
        id: 'discountAmountResult',
        label: 'Discount Amount',
        formulaRef: 'discountAmount',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'priceAfterDiscountResult',
        label: 'Price After Discount',
        formulaRef: 'priceAfterDiscount',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'taxAmountResult',
        label: 'Tax Amount',
        formulaRef: 'taxAmount',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'finalPriceResult',
        label: 'Final Price',
        formulaRef: 'finalPrice',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
      {
        id: 'totalSavingsResult',
        label: 'You Save',
        formulaRef: 'totalSavings',
        format: 'currency',
        precision: 2,
      },
    ],
    guide: {
      whatIsIt:
        'This calculator determines the final out-of-pocket price of an item after applying a percentage discount and then adding sales tax. It also shows exactly how much money you save from the discount.',
      howToUse:
        '1. Enter the original sticker price of the item.\n2. Enter the discount percentage (e.g., 20 for a 20% off sale).\n3. Enter the applicable sales tax rate.\nThe calculator shows the discount amount, price after discount, tax, final price, and your total savings.',
      exampleScenario:
        'A $199.99 jacket is on sale for 25% off, and your local sales tax is 8.25%. The discount saves you $50.00, bringing the price to $149.99. Tax adds $12.37, so the final price is $162.37.',
      proTip:
        'Tax is calculated on the discounted price, not the original. This means a bigger discount saves you money on taxes too! When comparing deals, always compute the final after-tax price to see the true cost.',
    },
    metadata: { version: '1.0.0' },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 4. IRR / NPV Calculator
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'irr-npv-calculator',
    slug: 'irr-npv-calculator',
    title: 'IRR / NPV Calculator',
    description:
      'Compute the Net Present Value (NPV) and Internal Rate of Return (IRR) for a series of cash flows to evaluate investment viability.',
    icon: '💹',
    category: 'finance',
    subcategory: 'investments',
    tags: ['irr', 'npv', 'net present value', 'internal rate of return', 'cash flow', 'capital budgeting'],
    inputs: [
      {
        id: 'initialInvestment',
        label: 'Initial Investment',
        type: 'number',
        placeholder: 'e.g. 100000',
        min: 0,
        required: true,
        helpText: 'The upfront cost of the investment (enter as a positive number).',
      },
      {
        id: 'cashFlow1',
        label: 'Year 1 Cash Flow',
        type: 'number',
        placeholder: 'e.g. 25000',
        defaultValue: 0,
        required: true,
        helpText: 'Net cash flow received at the end of Year 1.',
      },
      {
        id: 'cashFlow2',
        label: 'Year 2 Cash Flow',
        type: 'number',
        placeholder: 'e.g. 30000',
        defaultValue: 0,
        required: true,
        helpText: 'Net cash flow received at the end of Year 2.',
      },
      {
        id: 'cashFlow3',
        label: 'Year 3 Cash Flow',
        type: 'number',
        placeholder: 'e.g. 35000',
        defaultValue: 0,
        required: true,
        helpText: 'Net cash flow received at the end of Year 3.',
      },
      {
        id: 'cashFlow4',
        label: 'Year 4 Cash Flow',
        type: 'number',
        placeholder: 'e.g. 30000',
        defaultValue: 0,
        required: true,
        helpText: 'Net cash flow received at the end of Year 4.',
      },
      {
        id: 'cashFlow5',
        label: 'Year 5 Cash Flow',
        type: 'number',
        placeholder: 'e.g. 25000',
        defaultValue: 0,
        required: true,
        helpText: 'Net cash flow received at the end of Year 5.',
      },
      {
        id: 'discountRate',
        label: 'Discount Rate',
        type: 'number',
        placeholder: 'e.g. 10',
        min: 0,
        step: 0.1,
        required: true,
        helpText: 'Your required rate of return or cost of capital (%%).',
      },
    ],
    formulas: [
      {
        id: 'r',
        expression: 'discountRate / 100',
        dependencies: ['discountRate'],
      },
      {
        id: 'npvResult',
        expression: 'npv(r, initialInvestment * -1, cashFlow1, cashFlow2, cashFlow3, cashFlow4, cashFlow5)',
        dependencies: ['r', 'initialInvestment', 'cashFlow1', 'cashFlow2', 'cashFlow3', 'cashFlow4', 'cashFlow5'],
      },
      {
        id: 'irrResult',
        expression: 'irr(initialInvestment * -1, cashFlow1, cashFlow2, cashFlow3, cashFlow4, cashFlow5) * 100',
        dependencies: ['initialInvestment', 'cashFlow1', 'cashFlow2', 'cashFlow3', 'cashFlow4', 'cashFlow5'],
      },
    ],
    outputs: [
      {
        id: 'npvOutput',
        label: 'Net Present Value (NPV)',
        formulaRef: 'npvResult',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
      {
        id: 'irrOutput',
        label: 'Internal Rate of Return (IRR)',
        formulaRef: 'irrResult',
        format: 'percentage',
        precision: 2,
        suffix: '%',
        highlight: true,
      },
    ],
    guide: {
      whatIsIt:
        'Net Present Value (NPV) is the difference between the present value of future cash inflows and the initial investment. If NPV is positive, the investment is expected to generate more value than it costs. The Internal Rate of Return (IRR) is the discount rate at which the NPV equals zero — it represents the break-even rate of return.',
      howToUse:
        '1. Enter the initial investment amount (as a positive number — the calculator handles the sign).\n2. Enter the expected net cash flows for each of the 5 years. Leave years with no cash flow at 0.\n3. Enter your required rate of return (discount rate) as a percentage.\nThe calculator will compute both the NPV at your discount rate and the IRR of the cash flow stream.',
      exampleScenario:
        'You invest $100,000 in a project that returns $25,000, $30,000, $35,000, $30,000, and $25,000 over 5 years. With a 10% discount rate, the NPV is about $10,780 (positive, so the investment adds value), and the IRR is approximately 15.2%, which exceeds the 10% hurdle rate.',
      proTip:
        'The NPV rule is the gold standard: accept any project with NPV > 0 at your cost of capital. The IRR is useful for quick comparison, but be careful — it can give misleading results with non-conventional cash flows (sign changes). Always verify with NPV.',
    },
    metadata: { version: '1.0.0' },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 5. Rule of 72 Calculator
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'rule-of-72',
    slug: 'rule-of-72',
    title: 'Rule of 72 Calculator',
    description:
      'Quickly estimate how many years it takes for an investment to double using the Rule of 72, along with the exact figure from the compound interest formula.',
    icon: '⏳',
    category: 'finance',
    subcategory: 'investments',
    tags: ['rule of 72', 'doubling time', 'compound interest', 'investing', 'growth'],
    inputs: [
      {
        id: 'interestRate',
        label: 'Annual Interest Rate',
        type: 'number',
        placeholder: 'e.g. 8',
        min: 0.01,
        step: 0.1,
        required: true,
        helpText: 'The expected annual rate of return (%%).',
      },
      {
        id: 'initialAmount',
        label: 'Initial Amount (optional)',
        type: 'number',
        placeholder: 'e.g. 10000',
        min: 0,
        defaultValue: 10000,
        helpText: 'Enter any amount to see its doubled value.',
      },
    ],
    formulas: [
      {
        id: 'yearsToDouble',
        expression: '72 / interestRate',
        dependencies: ['interestRate'],
      },
      {
        id: 'exactYears',
        expression: 'ln(2) / ln(1 + interestRate / 100)',
        dependencies: ['interestRate'],
      },
      {
        id: 'doubledAmount',
        expression: 'initialAmount * 2',
        dependencies: ['initialAmount'],
      },
    ],
    outputs: [
      {
        id: 'yearsToDoubleResult',
        label: 'Approx. Years to Double (Rule of 72)',
        formulaRef: 'yearsToDouble',
        format: 'number',
        precision: 1,
        suffix: ' years',
        highlight: true,
      },
      {
        id: 'exactYearsResult',
        label: 'Exact Years to Double',
        formulaRef: 'exactYears',
        format: 'number',
        precision: 2,
        suffix: ' years',
      },
      {
        id: 'doubledAmountResult',
        label: 'Doubled Amount',
        formulaRef: 'doubledAmount',
        format: 'currency',
        precision: 2,
      },
    ],
    guide: {
      whatIsIt:
        'The Rule of 72 is a mental-math shortcut: divide 72 by the annual interest rate to estimate how many years it takes for money to double. This calculator also computes the exact doubling time using the compound interest formula ln(2) / ln(1 + r).',
      howToUse:
        '1. Enter the annual interest rate or expected rate of return.\n2. Optionally enter a starting amount to see the doubled value.\nThe calculator instantly shows both the Rule of 72 approximation and the exact compound-growth answer.',
      exampleScenario:
        'At an 8% annual return, the Rule of 72 estimates doubling in 72 / 8 = 9.0 years. The exact calculation gives 9.01 years — remarkably close! If you start with $10,000, it will grow to $20,000 in about 9 years.',
      proTip:
        'The Rule of 72 is most accurate for rates between 6% and 10%. For very low or very high rates, use the exact formula instead. You can also use it in reverse: if you want to double your money in 6 years, you need a rate of about 72 / 6 = 12%.',
    },
    metadata: { version: '1.0.0' },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 6. Effective Interest Rate Calculator
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'effective-rate-calculator',
    slug: 'effective-rate-calculator',
    title: 'Effective Interest Rate Calculator',
    description:
      'Convert a nominal (stated) interest rate to an effective annual rate based on compounding frequency, and compare with continuous compounding.',
    icon: '📊',
    category: 'finance',
    subcategory: 'business',
    tags: ['effective rate', 'nominal rate', 'compounding', 'EAR', 'APY', 'continuous compounding'],
    inputs: [
      {
        id: 'nominalRate',
        label: 'Nominal Annual Rate',
        type: 'number',
        placeholder: 'e.g. 5.0',
        min: 0,
        step: 0.01,
        required: true,
        helpText: 'The stated annual interest rate before compounding adjustments (%%).',
      },
      {
        id: 'compoundingPeriods',
        label: 'Compounding Frequency',
        type: 'select',
        options: [
          { label: 'Daily (365)', value: '365' },
          { label: 'Monthly (12)', value: '12' },
          { label: 'Quarterly (4)', value: '4' },
          { label: 'Semi-Annual (2)', value: '2' },
          { label: 'Annual (1)', value: '1' },
        ],
        defaultValue: '12',
        helpText: 'How many times per year interest is compounded.',
      },
    ],
    formulas: [
      {
        id: 'effectiveRate',
        expression: '(pow(1 + nominalRate / 100 / compoundingPeriods, compoundingPeriods) - 1) * 100',
        dependencies: ['nominalRate', 'compoundingPeriods'],
      },
      {
        id: 'continuousRate',
        expression: '(exp(nominalRate / 100) - 1) * 100',
        dependencies: ['nominalRate'],
      },
    ],
    outputs: [
      {
        id: 'effectiveRateResult',
        label: 'Effective Annual Rate (EAR)',
        formulaRef: 'effectiveRate',
        format: 'percentage',
        precision: 4,
        suffix: '%',
        highlight: true,
      },
      {
        id: 'continuousRateResult',
        label: 'Continuous Compounding Rate',
        formulaRef: 'continuousRate',
        format: 'percentage',
        precision: 4,
        suffix: '%',
      },
    ],
    guide: {
      whatIsIt:
        'The Effective Annual Rate (EAR), also called Annual Percentage Yield (APY), is the actual annual rate you earn or pay once compounding is taken into account. A 12% nominal rate compounded monthly is not 12% per year — it is actually 12.68% because interest earns interest within the year.',
      howToUse:
        '1. Enter the nominal (stated) annual interest rate.\n2. Select the compounding frequency from the dropdown.\nThe calculator shows the effective annual rate for your chosen frequency and also the theoretical maximum under continuous compounding.',
      exampleScenario:
        'A savings account advertises a 5% nominal rate compounded monthly. The effective annual rate is (1 + 0.05/12)^12 − 1 ≈ 5.1162%. Under continuous compounding, it would be e^0.05 − 1 ≈ 5.1271%. The difference is small but adds up over large balances and long time horizons.',
      proTip:
        'When comparing bank accounts or loans, always compare EAR (APY) rather than nominal rates. The more frequently interest compounds, the higher the effective rate. Daily compounding is very close to continuous compounding for most practical purposes.',
    },
    metadata: { version: '1.0.0' },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 7. US Inflation Calculator
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'us-inflation-calculator',
    slug: 'us-inflation-calculator',
    title: 'US Inflation Calculator',
    description:
      'Estimate how inflation erodes purchasing power over time. See what today\'s dollars will be worth in the future and what future costs translate to in today\'s money.',
    icon: '💵',
    category: 'finance',
    subcategory: 'business',
    tags: ['inflation', 'purchasing power', 'CPI', 'future value', 'cost of living', 'real value'],
    inputs: [
      {
        id: 'amount',
        label: 'Amount',
        type: 'number',
        placeholder: 'e.g. 1000',
        min: 0,
        required: true,
        helpText: 'The dollar amount to adjust for inflation.',
      },
      {
        id: 'inflationRate',
        label: 'Annual Inflation Rate',
        type: 'number',
        placeholder: 'e.g. 3.0',
        min: 0,
        max: 100,
        step: 0.1,
        defaultValue: 3.0,
        required: true,
        helpText: 'Average annual inflation rate (%%). The US historical average is approximately 3.0%.',
      },
      {
        id: 'years',
        label: 'Number of Years',
        type: 'number',
        placeholder: 'e.g. 10',
        min: 1,
        max: 200,
        required: true,
        helpText: 'How many years into the future to project.',
      },
    ],
    formulas: [
      {
        id: 'futureValue',
        expression: 'amount * pow(1 + inflationRate / 100, years)',
        dependencies: ['amount', 'inflationRate', 'years'],
      },
      {
        id: 'equivalentToday',
        expression: 'amount / pow(1 + inflationRate / 100, years)',
        dependencies: ['amount', 'inflationRate', 'years'],
      },
      {
        id: 'purchasingPowerLoss',
        expression: 'amount - amount / pow(1 + inflationRate / 100, years)',
        dependencies: ['amount', 'inflationRate', 'years'],
      },
    ],
    outputs: [
      {
        id: 'futureValueResult',
        label: 'Future Equivalent Cost',
        formulaRef: 'futureValue',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
      {
        id: 'purchasingPowerLossResult',
        label: 'Purchasing Power Loss',
        formulaRef: 'purchasingPowerLoss',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'equivalentTodayResult',
        label: "Today's Equivalent",
        formulaRef: 'equivalentToday',
        format: 'currency',
        precision: 2,
      },
    ],
    guide: {
      whatIsIt:
        'Inflation measures how the general price level rises over time, eroding the purchasing power of money. This calculator uses the Consumer Price Index (CPI) concept: at the US historical average of roughly 3% per year, $1,000 today will need about $1,344 in 10 years to buy the same goods. Conversely, $1,000 received in 10 years will only be worth about $744 in today\'s purchasing power.',
      howToUse:
        '1. Enter the dollar amount you want to analyze.\n2. Set the expected annual inflation rate (default is the US historical average of 3.0%).\n3. Enter the number of years to project.\nThe calculator shows what that amount will cost in future dollars, how much purchasing power is lost, and the real value of future money in today\'s terms.',
      exampleScenario:
        'You have $50,000 in a savings account earning 0% real interest. At 3% annual inflation over 20 years, something that costs $50,000 today will cost about $90,306. Your $50,000 in savings will only buy $27,684 worth of today\'s goods — a purchasing power loss of $22,316.',
      proTip:
        'To maintain purchasing power, your investments must earn returns above the inflation rate. If inflation is 3% and your savings earn 2%, you are losing 1% of real purchasing power each year. Target investments with real (inflation-adjusted) positive returns for long-term wealth preservation.',
    },
    metadata: { version: '1.0.0', lastUpdated: '2025-01' },
  },
];
