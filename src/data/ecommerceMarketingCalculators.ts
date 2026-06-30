// ---------------------------------------------------------------------------
// Quantify — E-Commerce & Marketing Calculators
// ---------------------------------------------------------------------------
// 13 calculators covering pricing, advertising, ecommerce fees, and
// key business metrics: gross margin, break-even, CPM/CPC, CLV, churn,
// ROAS, conversion rate, depreciation, inventory turnover, and platform fees.
// ---------------------------------------------------------------------------

import type { CalculatorSchema } from '@/types/calculator';

export const ecommerceMarketingCalculators: CalculatorSchema[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // 1. Gross Margin Calculator
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'gross-margin-calculator',
    slug: 'gross-margin-calculator',
    title: 'Gross Margin Calculator',
    description:
      'Calculate gross profit, gross margin percentage, and markup from revenue and cost of goods sold (COGS).',
    icon: '📊',
    category: 'business',
    subcategory: 'pricing',
    tags: ['gross margin', 'gross profit', 'markup', 'cogs', 'pricing', 'profit margin'],
    inputs: [
      {
        id: 'revenue',
        label: 'Revenue',
        type: 'number',
        defaultValue: 10000,
        min: 0,
        step: 0.01,
        placeholder: 'e.g. 10000',
        helpText: 'Total sales revenue before any deductions.',
      },
      {
        id: 'cogs',
        label: 'Cost of Goods Sold (COGS)',
        type: 'number',
        defaultValue: 6000,
        min: 0,
        step: 0.01,
        placeholder: 'e.g. 6000',
        helpText: 'Direct costs attributable to producing the goods sold.',
      },
    ],
    formulas: [
      {
        id: 'grossProfit',
        expression: 'revenue - cogs',
        dependencies: ['revenue', 'cogs'],
      },
      {
        id: 'grossMargin',
        expression: 'grossProfit / revenue * 100',
        dependencies: ['grossProfit', 'revenue'],
      },
      {
        id: 'markup',
        expression: 'grossProfit / cogs * 100',
        dependencies: ['grossProfit', 'cogs'],
      },
    ],
    outputs: [
      {
        id: 'grossProfitOut',
        label: 'Gross Profit',
        formulaRef: 'grossProfit',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
      {
        id: 'grossMarginPct',
        label: 'Gross Margin',
        formulaRef: 'grossMargin',
        format: 'number',
        precision: 2,
        suffix: '%',
        highlight: true,
      },
      {
        id: 'markupPct',
        label: 'Markup',
        formulaRef: 'markup',
        format: 'number',
        precision: 2,
        suffix: '%',
      },
    ],
    guide: {
      whatIsIt:
        'Gross Margin is the percentage of revenue remaining after subtracting the cost of goods sold (COGS). It tells you how efficiently a business converts sales into profit before operating expenses. Markup, by contrast, is calculated on cost — not on revenue — and is always higher than the equivalent gross margin percentage.',
      howToUse:
        '1. Enter your total revenue (net sales).\n2. Enter your COGS — the direct costs of producing or purchasing the goods sold.\nThe calculator shows your gross profit in dollars, gross margin as a % of revenue, and markup as a % of cost.',
      exampleScenario:
        'A retailer sells $10,000 worth of clothing with $6,000 in COGS. Gross profit is $4,000. Gross margin = $4,000 / $10,000 = 40%. Markup = $4,000 / $6,000 = 66.7%. These are two different ways to express the same profitability.',
      proTip:
        'Gross margin benchmarks vary widely: grocery retail ~25%, fashion retail ~50%, software/SaaS 70–90%. If your margin is below your industry average, focus on raising prices, negotiating supplier costs, or shifting to higher-margin products. Never confuse margin with markup — a 50% markup only yields a 33.3% gross margin.',
    },
    metadata: { version: '1.0.0' },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. Markup Calculator
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'markup-calculator',
    slug: 'markup-calculator',
    title: 'Markup Calculator',
    description:
      'Convert a cost price into a selling price using a markup percentage, and see the resulting gross margin.',
    icon: '🏷️',
    category: 'business',
    subcategory: 'pricing',
    tags: ['markup', 'selling price', 'cost price', 'gross margin', 'pricing', 'retail'],
    inputs: [
      {
        id: 'cost',
        label: 'Cost Price',
        type: 'number',
        defaultValue: 50,
        min: 0,
        step: 0.01,
        placeholder: 'e.g. 50',
        helpText: 'The total cost to produce or purchase one unit.',
      },
      {
        id: 'markupPercent',
        label: 'Markup Percentage',
        type: 'range',
        defaultValue: 100,
        min: 0,
        max: 500,
        step: 1,
        helpText: 'How much to add on top of cost, as a percentage of cost.',
      },
    ],
    formulas: [
      {
        id: 'markupAmount',
        expression: 'cost * markupPercent / 100',
        dependencies: ['cost', 'markupPercent'],
      },
      {
        id: 'sellingPrice',
        expression: 'cost + markupAmount',
        dependencies: ['cost', 'markupAmount'],
      },
      {
        id: 'margin',
        expression: 'markupAmount / sellingPrice * 100',
        dependencies: ['markupAmount', 'sellingPrice'],
      },
    ],
    outputs: [
      {
        id: 'sellingPriceOut',
        label: 'Selling Price',
        formulaRef: 'sellingPrice',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
      {
        id: 'markupAmountOut',
        label: 'Markup Amount',
        formulaRef: 'markupAmount',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'grossMarginPct',
        label: 'Gross Margin',
        formulaRef: 'margin',
        format: 'number',
        precision: 2,
        suffix: '%',
      },
    ],
    guide: {
      whatIsIt:
        "Markup is the amount added to a product's cost to arrive at a selling price, expressed as a percentage of the cost. It is a fundamental pricing tool in retail and manufacturing. The resulting gross margin (expressed as a % of the selling price) will always be lower than the markup percentage.",
      howToUse:
        '1. Enter the cost to produce or procure one unit.\n2. Drag or type the markup percentage.\nThe calculator shows the final selling price, the dollar amount of markup, and the equivalent gross margin percentage.',
      exampleScenario:
        'A wholesaler buys a product for $50 and applies a 100% markup. The selling price becomes $100. The markup amount is $50, but the gross margin is only 50% — because $50 profit on $100 revenue equals 50%, not 100%.',
      proTip:
        'Common industry markups: electronics 10–30%, clothing 50–100%, jewelry 100–300%, restaurants 200–400% on food. Remember the formula to go from margin to markup: Markup% = Margin% / (1 - Margin%). A target 40% margin requires a 66.7% markup on cost.',
    },
    metadata: { version: '1.0.0' },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. Break-Even Point Calculator
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'break-even-calculator',
    slug: 'break-even-calculator',
    title: 'Break-Even Calculator',
    description:
      'Find the exact number of units you must sell and the revenue required to cover all fixed and variable costs.',
    icon: '⚖️',
    category: 'business',
    subcategory: 'pricing',
    tags: ['break even', 'break-even point', 'fixed costs', 'variable costs', 'contribution margin', 'units'],
    inputs: [
      {
        id: 'fixedCosts',
        label: 'Total Fixed Costs',
        type: 'number',
        defaultValue: 10000,
        min: 0,
        step: 1,
        placeholder: 'e.g. 10000',
        helpText: 'Costs that do not change with production volume (rent, salaries, insurance).',
      },
      {
        id: 'variableCostPerUnit',
        label: 'Variable Cost per Unit',
        type: 'number',
        defaultValue: 30,
        min: 0,
        step: 0.01,
        placeholder: 'e.g. 30',
        helpText: 'Costs that vary directly with each unit produced (materials, packaging, shipping).',
      },
      {
        id: 'sellingPricePerUnit',
        label: 'Selling Price per Unit',
        type: 'number',
        defaultValue: 50,
        min: 0,
        step: 0.01,
        placeholder: 'e.g. 50',
        helpText: 'The price at which you sell each unit.',
      },
    ],
    formulas: [
      {
        id: 'contributionMargin',
        expression: 'sellingPricePerUnit - variableCostPerUnit',
        dependencies: ['sellingPricePerUnit', 'variableCostPerUnit'],
      },
      {
        id: 'breakEvenUnits',
        expression: 'fixedCosts / contributionMargin',
        dependencies: ['fixedCosts', 'contributionMargin'],
      },
      {
        id: 'breakEvenRevenue',
        expression: 'breakEvenUnits * sellingPricePerUnit',
        dependencies: ['breakEvenUnits', 'sellingPricePerUnit'],
      },
    ],
    outputs: [
      {
        id: 'breakEvenUnitsOut',
        label: 'Break-Even Units',
        formulaRef: 'breakEvenUnits',
        format: 'number',
        precision: 0,
        suffix: ' units',
        highlight: true,
      },
      {
        id: 'breakEvenRevenueOut',
        label: 'Break-Even Revenue',
        formulaRef: 'breakEvenRevenue',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
      {
        id: 'contributionMarginOut',
        label: 'Contribution Margin per Unit',
        formulaRef: 'contributionMargin',
        format: 'currency',
        precision: 2,
      },
    ],
    guide: {
      whatIsIt:
        'The break-even point is the sales volume at which total revenue exactly equals total costs — producing neither profit nor loss. Every unit sold above the break-even point contributes pure profit. The contribution margin per unit (selling price minus variable cost) is the key driver: a higher contribution margin means you reach break-even faster.',
      howToUse:
        '1. Enter your total fixed costs (the same regardless of sales volume).\n2. Enter the variable cost per unit (increases with each unit sold).\n3. Enter your selling price per unit.\nThe calculator computes the contribution margin, break-even unit count, and break-even revenue.',
      exampleScenario:
        'A startup has $10,000 in monthly fixed costs. Each product costs $30 to produce and sells for $50. Contribution margin = $20 per unit. Break-even = $10,000 / $20 = 500 units/month, or $25,000 in revenue. Any sales above 500 units generate profit at $20 each.',
      proTip:
        'Calculate a "safety margin" — the percentage by which current sales exceed break-even. If you sell 700 units against a break-even of 500, your safety margin is 40%. A low safety margin signals high financial risk. Use break-even analysis when evaluating price changes, new product launches, or cost-cutting initiatives.',
    },
    metadata: { version: '1.0.0' },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 4. Payment Fee Calculator (PayPal / Stripe)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'payment-fee-calculator',
    slug: 'payment-fee-calculator',
    title: 'PayPal / Stripe Fee Calculator',
    description:
      'Calculate transaction fees for PayPal and Stripe. See the net amount you receive, or find the gross amount to charge so the customer effectively absorbs the fee.',
    icon: '💳',
    category: 'business',
    subcategory: 'ecommerce',
    tags: ['paypal fee', 'stripe fee', 'transaction fee', 'payment processing', 'ecommerce', 'net revenue'],
    inputs: [
      {
        id: 'amount',
        label: 'Transaction Amount',
        type: 'number',
        defaultValue: 100,
        min: 0.01,
        step: 0.01,
        placeholder: 'e.g. 100',
        helpText: 'The sale amount in USD.',
      },
      {
        id: 'platform',
        label: 'Payment Platform',
        type: 'select',
        defaultValue: '0',
        options: [
          { label: 'PayPal Standard', value: '0' },
          { label: 'Stripe Standard', value: '1' },
          { label: 'PayPal International+', value: '2' },
        ],
        helpText: 'Select the payment processor. Rates as of 2025 — verify with platform for updates.',
      },
      {
        id: 'pricingType',
        label: 'Fee Handling',
        type: 'select',
        defaultValue: '0',
        options: [
          { label: 'You Absorb the Fee', value: '0' },
          { label: 'Customer Pays Fee (pass-through)', value: '1' },
        ],
        helpText: 'Choose whether you absorb the fee or charge the customer enough to cover it.',
      },
    ],
    formulas: [
      { id: 'paypalRate', expression: '0.0349', dependencies: [] },
      { id: 'stripeRate', expression: '0.0290', dependencies: [] },
      { id: 'intlRate', expression: '0.0449', dependencies: [] },
      {
        id: 'rate',
        expression: 'platform == 0 ? paypalRate : (platform == 1 ? stripeRate : intlRate)',
        dependencies: ['platform', 'paypalRate', 'stripeRate', 'intlRate'],
      },
      {
        id: 'fixed',
        expression: 'platform == 1 ? 0.30 : 0.49',
        dependencies: ['platform'],
      },
      {
        id: 'feeNormal',
        expression: 'amount * rate + fixed',
        dependencies: ['amount', 'rate', 'fixed'],
      },
      {
        id: 'grossNeeded',
        expression: '(amount + fixed) / (1 - rate)',
        dependencies: ['amount', 'fixed', 'rate'],
      },
      {
        id: 'feeAbsorbed',
        expression: 'grossNeeded * rate + fixed',
        dependencies: ['grossNeeded', 'rate', 'fixed'],
      },
      {
        id: 'fee',
        expression: 'pricingType == 0 ? feeNormal : feeAbsorbed',
        dependencies: ['pricingType', 'feeNormal', 'feeAbsorbed'],
      },
      {
        id: 'netReceived',
        expression: 'pricingType == 0 ? amount - fee : amount',
        dependencies: ['pricingType', 'amount', 'fee'],
      },
      {
        id: 'effectiveRate',
        expression: 'fee / amount * 100',
        dependencies: ['fee', 'amount'],
      },
    ],
    outputs: [
      {
        id: 'feeOut',
        label: 'Transaction Fee',
        formulaRef: 'fee',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
      {
        id: 'netReceivedOut',
        label: 'Net Amount Received',
        formulaRef: 'netReceived',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
      {
        id: 'effectiveRateOut',
        label: 'Effective Fee Rate',
        formulaRef: 'effectiveRate',
        format: 'number',
        precision: 2,
        suffix: '%',
      },
    ],
    guide: {
      whatIsIt:
        "Payment processors charge a percentage fee plus a small fixed fee per transaction. PayPal Standard charges 3.49% + $0.49; Stripe charges 2.90% + $0.30; PayPal International charges 4.49% + $0.49 (rates as of 2025 — always verify on the platform's official pricing page). This calculator shows exactly how much you keep.",
      howToUse:
        '1. Enter the transaction amount.\n2. Select your payment platform.\n3. Choose whether you absorb the fee or pass it to the customer.\nThe calculator shows the fee, net payout, and effective fee rate.',
      exampleScenario:
        'You sell a $100 item via Stripe. Absorbing the fee: $2.90 + $0.30 = $3.20 fee, you keep $96.80. If you want to receive exactly $100, charge the customer $103.40 — the fee on $103.40 is $3.00 + $0.30 = $3.30, leaving you with ~$100.',
      proTip:
        "For high-volume sellers, negotiate custom rates with Stripe (usually available at >$80K/month in volume). Also consider that Stripe's lower fixed fee ($0.30 vs $0.49) makes it significantly cheaper for small-ticket items, while the difference shrinks on larger transactions.",
    },
    metadata: { version: '1.0.0', lastUpdated: '2025-01' },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 5. CPM Calculator
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'cpm-calculator',
    slug: 'cpm-calculator',
    title: 'CPM Calculator',
    description:
      'Calculate Cost Per Mille (CPM), total impressions, or ad budget — solve for any one variable given the other two.',
    icon: '📢',
    category: 'business',
    subcategory: 'advertising',
    tags: ['cpm', 'cost per mille', 'impressions', 'ad budget', 'advertising', 'media buying', 'digital marketing'],
    inputs: [
      {
        id: 'solveFor',
        label: 'Solve For',
        type: 'select',
        defaultValue: '0',
        options: [
          { label: 'CPM (cost per 1,000 impressions)', value: '0' },
          { label: 'Impressions', value: '1' },
          { label: 'Budget', value: '2' },
        ],
        helpText: 'Select which value you want to calculate.',
      },
      {
        id: 'budget',
        label: 'Ad Budget ($)',
        type: 'number',
        defaultValue: 1000,
        min: 0,
        step: 0.01,
        placeholder: 'e.g. 1000',
        helpText: 'Total advertising spend in dollars.',
      },
      {
        id: 'impressions',
        label: 'Impressions',
        type: 'number',
        defaultValue: 100000,
        min: 1,
        step: 1,
        placeholder: 'e.g. 100000',
        helpText: 'Total number of times the ad is displayed.',
      },
      {
        id: 'cpm',
        label: 'CPM ($)',
        type: 'number',
        defaultValue: 10,
        min: 0.01,
        step: 0.01,
        placeholder: 'e.g. 10',
        helpText: 'Cost per 1,000 impressions.',
      },
    ],
    formulas: [
      {
        id: 'cpmCalc',
        expression: 'budget / impressions * 1000',
        dependencies: ['budget', 'impressions'],
      },
      {
        id: 'impCalc',
        expression: 'budget / cpm * 1000',
        dependencies: ['budget', 'cpm'],
      },
      {
        id: 'budgetCalc',
        expression: 'cpm * impressions / 1000',
        dependencies: ['cpm', 'impressions'],
      },
      {
        id: 'result',
        expression: 'solveFor == 0 ? cpmCalc : (solveFor == 1 ? impCalc : budgetCalc)',
        dependencies: ['solveFor', 'cpmCalc', 'impCalc', 'budgetCalc'],
      },
    ],
    outputs: [
      {
        id: 'resultOut',
        label: 'Calculated Result',
        formulaRef: 'result',
        format: 'number',
        precision: 2,
        highlight: true,
      },
      {
        id: 'cpmOut',
        label: 'CPM',
        formulaRef: 'cpmCalc',
        format: 'number',
        precision: 2,
        prefix: '$',
        suffix: '/1,000',
      },
      {
        id: 'budgetOut',
        label: 'Budget Required',
        formulaRef: 'budgetCalc',
        format: 'currency',
        precision: 2,
      },
    ],
    guide: {
      whatIsIt:
        'CPM (Cost Per Mille, or Cost Per Thousand) is the standard pricing model for display, video, and programmatic advertising. It represents how much an advertiser pays for 1,000 ad impressions. The three variables — CPM, budget, and impressions — are interlinked: know any two and you can calculate the third.',
      howToUse:
        '1. Select which value you want to solve for.\n2. Fill in the other two known values.\nThe calculator returns the unknown variable and shows all three values for reference.',
      exampleScenario:
        'You have a $1,000 ad budget and want to reach 100,000 people. CPM = $1,000 / 100,000 x 1,000 = $10. Conversely, if you buy inventory at $10 CPM with a $1,000 budget, you will receive 100,000 impressions.',
      proTip:
        'CPM benchmarks by channel (2025): Facebook/Instagram $8–$14, YouTube $6–$18, display banners $1–$5, connected TV (CTV) $25–$50. A low CPM is meaningless without viewability data — prioritize placements with >70% measured viewability. For brand awareness, target CPM; for conversion, switch to CPC or CPA models.',
    },
    metadata: { version: '1.0.0' },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 6. CPC / CTR Calculator
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'cpc-ctr-calculator',
    slug: 'cpc-ctr-calculator',
    title: 'CPC & CTR Calculator',
    description:
      'Calculate Click-Through Rate (CTR), Cost Per Click (CPC), and effective CPM from your ad campaign data.',
    icon: '🖱️',
    category: 'business',
    subcategory: 'advertising',
    tags: ['cpc', 'ctr', 'click through rate', 'cost per click', 'cpm', 'ppc', 'google ads', 'digital marketing'],
    inputs: [
      {
        id: 'clicks',
        label: 'Total Clicks',
        type: 'number',
        defaultValue: 500,
        min: 1,
        step: 1,
        placeholder: 'e.g. 500',
        helpText: 'Number of times users clicked the ad.',
      },
      {
        id: 'impressions',
        label: 'Total Impressions',
        type: 'number',
        defaultValue: 50000,
        min: 1,
        step: 1,
        placeholder: 'e.g. 50000',
        helpText: 'Total number of times the ad was shown.',
      },
      {
        id: 'adSpend',
        label: 'Total Ad Spend ($)',
        type: 'number',
        defaultValue: 250,
        min: 0.01,
        step: 0.01,
        placeholder: 'e.g. 250',
        helpText: 'Total amount spent on this ad campaign.',
      },
    ],
    formulas: [
      {
        id: 'ctr',
        expression: 'clicks / impressions * 100',
        dependencies: ['clicks', 'impressions'],
      },
      {
        id: 'cpc',
        expression: 'adSpend / clicks',
        dependencies: ['adSpend', 'clicks'],
      },
      {
        id: 'cpmOut',
        expression: 'adSpend / impressions * 1000',
        dependencies: ['adSpend', 'impressions'],
      },
    ],
    outputs: [
      {
        id: 'ctrOut',
        label: 'Click-Through Rate (CTR)',
        formulaRef: 'ctr',
        format: 'number',
        precision: 2,
        suffix: '%',
        highlight: true,
      },
      {
        id: 'cpcOut',
        label: 'Cost Per Click (CPC)',
        formulaRef: 'cpc',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
      {
        id: 'cpmResult',
        label: 'Effective CPM',
        formulaRef: 'cpmOut',
        format: 'number',
        precision: 2,
        prefix: '$',
      },
    ],
    guide: {
      whatIsIt:
        'CTR (Click-Through Rate) measures the percentage of people who saw your ad and clicked it. CPC (Cost Per Click) is the average cost of each click. These two metrics are the core performance indicators of any pay-per-click (PPC) or display campaign.',
      howToUse:
        '1. Enter the total number of clicks your ad received.\n2. Enter the total impressions (how many times the ad was shown).\n3. Enter your total ad spend.\nThe calculator returns CTR, CPC, and effective CPM.',
      exampleScenario:
        'A Google Ads campaign generated 500 clicks from 50,000 impressions for a $250 spend. CTR = 1.0%, CPC = $0.50, CPM = $5.00. These are strong results for a display campaign (average display CTR is ~0.1%).',
      proTip:
        'CTR benchmarks: Search ads 3–5%, display ads 0.1–0.3%, Facebook 0.9%, email 2–5%. A low CTR signals poor ad relevance or targeting. Improving your ad headline, image, and audience targeting can increase CTR by 2–5x, directly reducing CPC without increasing spend. Google uses CTR as a key Quality Score factor — higher CTR often lowers your CPC through better ad rank.',
    },
    metadata: { version: '1.0.0' },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 7. Customer Lifetime Value (CLV) Calculator
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'clv-calculator',
    slug: 'clv-calculator',
    title: 'Customer Lifetime Value (CLV) Calculator',
    description:
      'Estimate the total profit a customer generates over their entire relationship with your business.',
    icon: '👥',
    category: 'business',
    subcategory: 'metrics',
    tags: ['clv', 'ltv', 'customer lifetime value', 'retention', 'cac', 'saas', 'ecommerce metrics'],
    inputs: [
      {
        id: 'avgPurchaseValue',
        label: 'Average Purchase Value ($)',
        type: 'number',
        defaultValue: 100,
        min: 0.01,
        step: 0.01,
        placeholder: 'e.g. 100',
        helpText: 'The average dollar amount per transaction.',
      },
      {
        id: 'purchaseFrequency',
        label: 'Purchase Frequency (per year)',
        type: 'number',
        defaultValue: 4,
        min: 0.01,
        step: 0.1,
        placeholder: 'e.g. 4',
        helpText: 'How many times the average customer buys per year.',
      },
      {
        id: 'customerLifespanYears',
        label: 'Customer Lifespan (years)',
        type: 'number',
        defaultValue: 3,
        min: 0.1,
        step: 0.1,
        placeholder: 'e.g. 3',
        helpText: 'How long, on average, a customer continues buying from you.',
      },
      {
        id: 'grossMarginPct',
        label: 'Gross Margin (%)',
        type: 'range',
        defaultValue: 60,
        min: 1,
        max: 100,
        step: 1,
        helpText: 'Your gross margin percentage — used to convert revenue LTV to profit CLV.',
      },
    ],
    formulas: [
      {
        id: 'annualRevenue',
        expression: 'avgPurchaseValue * purchaseFrequency',
        dependencies: ['avgPurchaseValue', 'purchaseFrequency'],
      },
      {
        id: 'ltv',
        expression: 'annualRevenue * customerLifespanYears',
        dependencies: ['annualRevenue', 'customerLifespanYears'],
      },
      {
        id: 'clv',
        expression: 'ltv * grossMarginPct / 100',
        dependencies: ['ltv', 'grossMarginPct'],
      },
    ],
    outputs: [
      {
        id: 'clvOut',
        label: 'Customer Lifetime Value (CLV)',
        formulaRef: 'clv',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
      {
        id: 'ltvOut',
        label: 'Gross Revenue LTV',
        formulaRef: 'ltv',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'annualRevenueOut',
        label: 'Annual Revenue per Customer',
        formulaRef: 'annualRevenue',
        format: 'currency',
        precision: 2,
      },
    ],
    guide: {
      whatIsIt:
        'Customer Lifetime Value (CLV) is the total profit your business can expect from a single customer account over the duration of the relationship. LTV (Lifetime Revenue Value) is the gross revenue version — CLV adjusts for your gross margin to show actual profit contribution.',
      howToUse:
        '1. Enter the average purchase value per transaction.\n2. Enter how many times the average customer buys per year.\n3. Enter the average customer lifespan in years.\n4. Set your gross margin percentage.\nThe calculator outputs CLV (profit), LTV (gross revenue), and annual revenue per customer.',
      exampleScenario:
        "An e-commerce store's average customer spends $100, buys 4 times/year, stays for 3 years, and the store operates at 60% gross margin. Annual revenue per customer = $400. LTV = $1,200. CLV = $720. If customer acquisition cost (CAC) is $100, the LTV:CAC ratio is 12:1 — excellent.",
      proTip:
        'The golden benchmark: LTV:CAC ratio should be at least 3:1 for a healthy business. A ratio below 1:1 means you are losing money on every customer. Focus on retention — increasing customer lifespan from 3 to 4 years lifts CLV by 33% with no increase in acquisition cost. Email nurture, loyalty programs, and subscription models are the highest-ROI retention tools.',
    },
    metadata: { version: '1.0.0' },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 8. Churn Rate Calculator
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'churn-rate-calculator',
    slug: 'churn-rate-calculator',
    title: 'Churn Rate Calculator',
    description:
      'Calculate monthly and annualized customer churn rates and estimate the average customer lifespan.',
    icon: '📉',
    category: 'business',
    subcategory: 'metrics',
    tags: ['churn rate', 'customer retention', 'saas', 'attrition', 'monthly churn', 'annual churn', 'subscription'],
    inputs: [
      {
        id: 'customersStart',
        label: 'Customers at Start of Period',
        type: 'number',
        defaultValue: 1000,
        min: 1,
        step: 1,
        placeholder: 'e.g. 1000',
        helpText: 'Total active customers at the beginning of the measurement period.',
      },
      {
        id: 'customersLost',
        label: 'Customers Lost in Period',
        type: 'number',
        defaultValue: 50,
        min: 0,
        step: 1,
        placeholder: 'e.g. 50',
        helpText: 'Number of customers who cancelled or churned during the period.',
      },
      {
        id: 'periodMonths',
        label: 'Period Length',
        type: 'select',
        defaultValue: '1',
        options: [
          { label: '1 Month', value: '1' },
          { label: '3 Months (Quarter)', value: '3' },
          { label: '6 Months', value: '6' },
          { label: '12 Months (Annual)', value: '12' },
        ],
        helpText: 'The time period over which the churn was measured.',
      },
    ],
    formulas: [
      {
        id: 'periodChurnRate',
        expression: 'customersLost / customersStart * 100',
        dependencies: ['customersLost', 'customersStart'],
      },
      {
        id: 'monthlyChurn',
        expression: 'periodChurnRate / periodMonths',
        dependencies: ['periodChurnRate', 'periodMonths'],
      },
      {
        id: 'annualChurn',
        expression: '100 * (1 - pow(1 - monthlyChurn / 100, 12))',
        dependencies: ['monthlyChurn'],
      },
      {
        id: 'avgCustomerLifespan',
        expression: '1 / (monthlyChurn / 100)',
        dependencies: ['monthlyChurn'],
      },
    ],
    outputs: [
      {
        id: 'monthlyChurnOut',
        label: 'Monthly Churn Rate',
        formulaRef: 'monthlyChurn',
        format: 'number',
        precision: 2,
        suffix: '%',
        highlight: true,
      },
      {
        id: 'annualChurnOut',
        label: 'Annualized Churn Rate',
        formulaRef: 'annualChurn',
        format: 'number',
        precision: 2,
        suffix: '%',
        highlight: true,
      },
      {
        id: 'avgLifespanOut',
        label: 'Avg. Customer Lifespan',
        formulaRef: 'avgCustomerLifespan',
        format: 'number',
        precision: 1,
        suffix: ' months',
      },
    ],
    guide: {
      whatIsIt:
        'Churn rate is the percentage of customers who stop doing business with you during a given period. It is the single most important metric for subscription businesses. A 5% monthly churn sounds small but compounds to ~46% annual churn — meaning nearly half your customers leave each year.',
      howToUse:
        '1. Enter the number of customers you had at the start of the period.\n2. Enter how many customers you lost during that period.\n3. Select the length of the measurement period.\nThe calculator converts any period churn to a monthly rate, annualizes it using the compound formula, and estimates average customer lifespan.',
      exampleScenario:
        'A SaaS company starts the month with 1,000 customers and loses 50. Monthly churn = 5%. Annualized = 1 - (0.95)^12 = 46%. Average customer lifespan = 1/0.05 = 20 months. To sustain 1,000 customers, you must acquire 50 new ones every single month just to stay flat.',
      proTip:
        'SaaS benchmarks: <2% monthly churn is excellent, 2–5% is acceptable, >5% is a red flag. Track revenue churn separately from customer churn — losing a $500/month customer hurts far more than losing a $10/month customer. Focus on "negative churn": expansions and upsells that offset losses. The fastest growth lever is cutting churn, not increasing acquisition.',
    },
    metadata: { version: '1.0.0' },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 9. ROAS Calculator
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'roas-calculator',
    slug: 'roas-calculator',
    title: 'ROAS Calculator',
    description:
      'Calculate Return on Ad Spend (ROAS) and distinguish it from ROI to evaluate advertising campaign profitability.',
    icon: '🎯',
    category: 'business',
    subcategory: 'advertising',
    tags: ['roas', 'return on ad spend', 'roi', 'advertising', 'google ads', 'facebook ads', 'profitability'],
    inputs: [
      {
        id: 'adRevenue',
        label: 'Revenue from Ads ($)',
        type: 'number',
        defaultValue: 10000,
        min: 0,
        step: 0.01,
        placeholder: 'e.g. 10000',
        helpText: 'Total revenue generated attributable to the ad campaign.',
      },
      {
        id: 'adSpend',
        label: 'Ad Spend ($)',
        type: 'number',
        defaultValue: 2000,
        min: 0.01,
        step: 0.01,
        placeholder: 'e.g. 2000',
        helpText: 'Total amount spent on the ad campaign.',
      },
    ],
    formulas: [
      {
        id: 'roas',
        expression: 'adRevenue / adSpend',
        dependencies: ['adRevenue', 'adSpend'],
      },
      {
        id: 'roasPct',
        expression: 'roas * 100',
        dependencies: ['roas'],
      },
      {
        id: 'profit',
        expression: 'adRevenue - adSpend',
        dependencies: ['adRevenue', 'adSpend'],
      },
      {
        id: 'roi',
        expression: 'profit / adSpend * 100',
        dependencies: ['profit', 'adSpend'],
      },
    ],
    outputs: [
      {
        id: 'roasOut',
        label: 'ROAS',
        formulaRef: 'roas',
        format: 'number',
        precision: 2,
        suffix: 'x',
        highlight: true,
      },
      {
        id: 'roiPctOut',
        label: 'ROI',
        formulaRef: 'roi',
        format: 'number',
        precision: 2,
        suffix: '%',
      },
      {
        id: 'profitOut',
        label: 'Gross Profit from Ads',
        formulaRef: 'profit',
        format: 'currency',
        precision: 2,
      },
    ],
    guide: {
      whatIsIt:
        'ROAS (Return on Ad Spend) measures how many dollars of revenue you generate for every dollar spent on advertising. A ROAS of 5x means you earn $5 for every $1 spent. ROI (Return on Investment) is different — it accounts for profit, not just revenue. ROAS ignores your COGS and operating costs; ROI does not.',
      howToUse:
        '1. Enter the total revenue directly attributable to your ad campaign.\n2. Enter your total ad spend for that campaign.\nThe calculator shows ROAS (in multiples), ROI percentage, and gross profit.',
      exampleScenario:
        'You spend $2,000 on Facebook ads and generate $10,000 in sales. ROAS = 5x ($10,000 / $2,000). Gross profit from ads = $8,000. ROI = 400%. However, if your product costs $6,000 to produce, your true profit is only $2,000, and the net ROI is 0% — meaning you just broke even.',
      proTip:
        'Your break-even ROAS = 1 / gross margin. At 40% gross margin, you need ROAS > 2.5x just to break even. Target ROAS by channel: Google Shopping 4–6x, Facebook 2–4x, branded search 8–15x. Always set target ROAS above break-even ROAS by at least 20% to account for overhead and ensure profitability.',
    },
    metadata: { version: '1.0.0' },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 10. Conversion Rate Calculator
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'conversion-rate-calculator',
    slug: 'conversion-rate-calculator',
    title: 'Conversion Rate Calculator',
    description:
      'Calculate your website or campaign conversion rate, revenue per visitor, and total revenue.',
    icon: '🔄',
    category: 'business',
    subcategory: 'metrics',
    tags: ['conversion rate', 'cvr', 'revenue per visitor', 'ecommerce', 'a/b testing', 'cro', 'funnel'],
    inputs: [
      {
        id: 'conversions',
        label: 'Total Conversions',
        type: 'number',
        defaultValue: 50,
        min: 0,
        step: 1,
        placeholder: 'e.g. 50',
        helpText: 'Number of completed goals (purchases, sign-ups, leads, etc.).',
      },
      {
        id: 'visitors',
        label: 'Total Visitors',
        type: 'number',
        defaultValue: 1000,
        min: 1,
        step: 1,
        placeholder: 'e.g. 1000',
        helpText: 'Total unique visitors or sessions during the measurement period.',
      },
      {
        id: 'avgOrderValue',
        label: 'Average Order Value ($)',
        type: 'number',
        defaultValue: 100,
        min: 0,
        step: 0.01,
        placeholder: 'e.g. 100',
        helpText: 'The average revenue per conversion.',
      },
    ],
    formulas: [
      {
        id: 'cvr',
        expression: 'conversions / visitors * 100',
        dependencies: ['conversions', 'visitors'],
      },
      {
        id: 'revenuePerVisitor',
        expression: 'conversions * avgOrderValue / visitors',
        dependencies: ['conversions', 'avgOrderValue', 'visitors'],
      },
      {
        id: 'totalRevenue',
        expression: 'conversions * avgOrderValue',
        dependencies: ['conversions', 'avgOrderValue'],
      },
    ],
    outputs: [
      {
        id: 'cvrOut',
        label: 'Conversion Rate (CVR)',
        formulaRef: 'cvr',
        format: 'number',
        precision: 2,
        suffix: '%',
        highlight: true,
      },
      {
        id: 'revenuePerVisitorOut',
        label: 'Revenue per Visitor',
        formulaRef: 'revenuePerVisitor',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'totalRevenueOut',
        label: 'Total Revenue',
        formulaRef: 'totalRevenue',
        format: 'currency',
        precision: 2,
      },
    ],
    guide: {
      whatIsIt:
        'Conversion Rate (CVR) is the percentage of visitors who complete a desired action — a purchase, sign-up, form submission, or any defined goal. Revenue per visitor (RPV) combines CVR and AOV into a single metric that captures both traffic quality and monetization efficiency.',
      howToUse:
        '1. Enter the number of completed conversions.\n2. Enter the total number of visitors.\n3. Enter the average order value.\nThe calculator shows CVR, revenue per visitor, and total revenue.',
      exampleScenario:
        'Your product page received 1,000 visitors and generated 50 purchases at $100 each. CVR = 5%, revenue per visitor = $5, total revenue = $5,000. If you can raise CVR to 6% through A/B testing, revenue grows to $6,000 — a 20% increase with zero additional traffic spend.',
      proTip:
        'Industry CVR benchmarks: e-commerce 1–4%, SaaS free trial 2–5%, lead generation 5–15%. Revenue per visitor is a more powerful metric than CVR alone — raising AOV from $100 to $120 has the same effect as raising CVR from 5% to 6%. Focus A/B testing on both dimensions: checkout friction (CVR) and cross-sell/upsell (AOV).',
    },
    metadata: { version: '1.0.0' },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 11. Depreciation Calculator
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'depreciation-calculator',
    slug: 'depreciation-calculator',
    title: 'Depreciation Calculator',
    description:
      'Calculate annual asset depreciation using Straight-Line or Double Declining Balance methods.',
    icon: '🏭',
    category: 'business',
    subcategory: 'accounting',
    tags: ['depreciation', 'straight line', 'declining balance', 'asset', 'accounting', 'book value', 'tax'],
    inputs: [
      {
        id: 'assetCost',
        label: 'Asset Cost ($)',
        type: 'number',
        defaultValue: 10000,
        min: 0,
        step: 0.01,
        placeholder: 'e.g. 10000',
        helpText: 'The original purchase price of the asset.',
      },
      {
        id: 'salvageValue',
        label: 'Salvage Value ($)',
        type: 'number',
        defaultValue: 1000,
        min: 0,
        step: 0.01,
        placeholder: 'e.g. 1000',
        helpText: 'The estimated residual value of the asset at the end of its useful life.',
      },
      {
        id: 'usefulLife',
        label: 'Useful Life (years)',
        type: 'number',
        defaultValue: 5,
        min: 1,
        max: 100,
        step: 1,
        placeholder: 'e.g. 5',
        helpText: 'The number of years over which the asset will be depreciated.',
      },
      {
        id: 'method',
        label: 'Depreciation Method',
        type: 'select',
        defaultValue: '0',
        options: [
          { label: 'Straight-Line (SL)', value: '0' },
          { label: 'Declining Balance 2x (DDB)', value: '1' },
        ],
        helpText: 'Straight-line depreciates evenly; double declining is front-loaded.',
      },
    ],
    formulas: [
      {
        id: 'totalDepreciation',
        expression: 'assetCost - salvageValue',
        dependencies: ['assetCost', 'salvageValue'],
      },
      {
        id: 'annualSL',
        expression: 'totalDepreciation / usefulLife',
        dependencies: ['totalDepreciation', 'usefulLife'],
      },
      {
        id: 'firstYearDB',
        expression: 'assetCost * 2 / usefulLife',
        dependencies: ['assetCost', 'usefulLife'],
      },
      {
        id: 'depreciationOut',
        expression: 'method == 0 ? annualSL : firstYearDB',
        dependencies: ['method', 'annualSL', 'firstYearDB'],
      },
      {
        id: 'bookValueYear1',
        expression: 'assetCost - depreciationOut',
        dependencies: ['assetCost', 'depreciationOut'],
      },
    ],
    outputs: [
      {
        id: 'depreciationOutResult',
        label: 'Annual Depreciation (Year 1)',
        formulaRef: 'depreciationOut',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
      {
        id: 'bookValueYear1Out',
        label: 'Book Value After Year 1',
        formulaRef: 'bookValueYear1',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'totalDepreciationOut',
        label: 'Total Depreciable Amount',
        formulaRef: 'totalDepreciation',
        format: 'currency',
        precision: 2,
      },
    ],
    guide: {
      whatIsIt:
        "Depreciation is the systematic allocation of an asset's cost over its useful life. Straight-Line (SL) spreads the cost evenly each year. Double Declining Balance (DDB) depreciates at twice the SL rate applied to the remaining book value — creating larger deductions in early years, which is favorable for tax purposes.",
      howToUse:
        '1. Enter the original cost of the asset.\n2. Enter the estimated salvage (residual) value at end of life.\n3. Enter the useful life in years.\n4. Select straight-line or double declining balance.\nThe calculator shows Year 1 depreciation, book value after Year 1, and the total depreciable amount.',
      exampleScenario:
        'A $10,000 machine has a $1,000 salvage value and a 5-year useful life. Straight-line: $9,000 / 5 = $1,800/year. Double Declining Balance: $10,000 x (2/5) = $4,000 in Year 1. By Year 3, DDB switches to SL to ensure the book value does not fall below salvage.',
      proTip:
        'For tax purposes, the IRS MACRS system often allows accelerated depreciation that differs from book depreciation. Section 179 lets businesses deduct up to $1.16M (2024) of qualifying equipment in Year 1. Typical useful lives: computers 5 years, vehicles 5 years, furniture 7 years, commercial buildings 39 years. Consult a tax advisor to maximize allowable deductions.',
    },
    metadata: { version: '1.0.0' },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 12. Inventory Turnover Calculator
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'inventory-turnover',
    slug: 'inventory-turnover',
    title: 'Inventory Turnover Calculator',
    description:
      'Calculate how many times inventory is sold and replaced per year, and how many days of stock you carry on average.',
    icon: '📦',
    category: 'business',
    subcategory: 'metrics',
    tags: ['inventory turnover', 'days on hand', 'cogs', 'working capital', 'supply chain', 'retail', 'operations'],
    inputs: [
      {
        id: 'cogs',
        label: 'Annual COGS ($)',
        type: 'number',
        defaultValue: 500000,
        min: 0,
        step: 1,
        placeholder: 'e.g. 500000',
        helpText: 'Annual Cost of Goods Sold — the cost of inventory sold during the year.',
      },
      {
        id: 'beginningInventory',
        label: 'Beginning Inventory ($)',
        type: 'number',
        defaultValue: 80000,
        min: 0,
        step: 1,
        placeholder: 'e.g. 80000',
        helpText: 'The value of inventory at the start of the fiscal year.',
      },
      {
        id: 'endingInventory',
        label: 'Ending Inventory ($)',
        type: 'number',
        defaultValue: 120000,
        min: 0,
        step: 1,
        placeholder: 'e.g. 120000',
        helpText: 'The value of inventory at the end of the fiscal year.',
      },
    ],
    formulas: [
      {
        id: 'avgInventory',
        expression: '(beginningInventory + endingInventory) / 2',
        dependencies: ['beginningInventory', 'endingInventory'],
      },
      {
        id: 'turnoverRatio',
        expression: 'cogs / avgInventory',
        dependencies: ['cogs', 'avgInventory'],
      },
      {
        id: 'daysOnHand',
        expression: '365 / turnoverRatio',
        dependencies: ['turnoverRatio'],
      },
    ],
    outputs: [
      {
        id: 'turnoverRatioOut',
        label: 'Inventory Turnover Ratio',
        formulaRef: 'turnoverRatio',
        format: 'number',
        precision: 2,
        suffix: 'x/year',
        highlight: true,
      },
      {
        id: 'daysOnHandOut',
        label: 'Days Inventory on Hand (DOH)',
        formulaRef: 'daysOnHand',
        format: 'number',
        precision: 1,
        suffix: ' days',
      },
      {
        id: 'avgInventoryOut',
        label: 'Average Inventory Value',
        formulaRef: 'avgInventory',
        format: 'currency',
        precision: 2,
      },
    ],
    guide: {
      whatIsIt:
        'Inventory Turnover measures how many times a business sells and replaces its inventory over a period. A ratio of 6x means you cycle through your entire stock 6 times per year. Days Inventory on Hand (DOH) is the reciprocal: at 6x turnover you carry an average of ~61 days of stock.',
      howToUse:
        '1. Enter your annual COGS (cost of goods sold, not revenue).\n2. Enter beginning and ending inventory values for the period.\nThe calculator computes average inventory, turnover ratio, and days on hand.',
      exampleScenario:
        'A retailer has $500,000 COGS, $80,000 beginning inventory, and $120,000 ending inventory. Average inventory = $100,000. Turnover = 5x. DOH = 73 days. This means the retailer has about 2.4 months of stock on hand — within the healthy range for retail.',
      proTip:
        'Benchmarks by industry: grocery 15–25x, fast fashion 4–6x, electronics 8–12x, luxury goods 1–2x. High turnover reduces carrying costs and spoilage risk but can cause stockouts. Low turnover ties up working capital. Use DOH to set reorder points and safety stock levels. The optimal ratio balances service levels against holding costs.',
    },
    metadata: { version: '1.0.0' },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 13. Platform Fee Calculator (Etsy / Shopee / Lazada / eBay)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'platform-fee-calculator',
    slug: 'platform-fee-calculator',
    title: 'Platform Fee Calculator',
    description:
      'Calculate selling fees and net payout for Etsy, Shopee, Lazada, and eBay US based on 2025 fee schedules.',
    icon: '🛒',
    category: 'business',
    subcategory: 'ecommerce',
    tags: ['etsy fee', 'shopee fee', 'lazada fee', 'ebay fee', 'platform fee', 'seller fee', 'marketplace', 'ecommerce'],
    inputs: [
      {
        id: 'salePrice',
        label: 'Sale Price ($)',
        type: 'number',
        defaultValue: 50,
        min: 0.01,
        step: 0.01,
        placeholder: 'e.g. 50',
        helpText: 'The price at which you list and sell the item.',
      },
      {
        id: 'platform',
        label: 'Platform',
        type: 'select',
        defaultValue: '0',
        options: [
          { label: 'Etsy', value: '0' },
          { label: 'Shopee', value: '1' },
          { label: 'Lazada', value: '2' },
          { label: 'eBay US', value: '3' },
        ],
        helpText: 'Select the marketplace. Fees as of 2025 — verify with platform for latest rates.',
      },
      {
        id: 'shippingCharge',
        label: 'Shipping Charged to Buyer ($)',
        type: 'number',
        defaultValue: 0,
        min: 0,
        step: 0.01,
        placeholder: 'e.g. 5.00',
        helpText: 'Etsy charges payment processing on shipping too. Leave 0 for free shipping or non-Etsy platforms.',
      },
    ],
    formulas: [
      // Etsy: $0.20 listing + 6.5% transaction + (3% + $0.25) payment processing on (sale + shipping)
      { id: 'etsyListingFee', expression: '0.20', dependencies: [] },
      {
        id: 'etsyTxFee',
        expression: 'salePrice * 0.065',
        dependencies: ['salePrice'],
      },
      {
        id: 'etsyPayFee',
        expression: '(salePrice + shippingCharge) * 0.03 + 0.25',
        dependencies: ['salePrice', 'shippingCharge'],
      },
      {
        id: 'etsy',
        expression: 'etsyListingFee + etsyTxFee + etsyPayFee',
        dependencies: ['etsyListingFee', 'etsyTxFee', 'etsyPayFee'],
      },
      // Shopee: 5% commission + 2% service fee = 7% total
      {
        id: 'shopee',
        expression: 'salePrice * 0.05 + salePrice * 0.02',
        dependencies: ['salePrice'],
      },
      // Lazada: 4% commission + 2% payment fee = 6% total
      {
        id: 'lazada',
        expression: 'salePrice * 0.04 + salePrice * 0.02',
        dependencies: ['salePrice'],
      },
      // eBay US: 13.29% final value fee + $0.30 per order
      {
        id: 'ebay',
        expression: 'salePrice * 0.1329 + 0.30',
        dependencies: ['salePrice'],
      },
      {
        id: 'totalFee',
        expression: 'platform == 0 ? etsy : (platform == 1 ? shopee : (platform == 2 ? lazada : ebay))',
        dependencies: ['platform', 'etsy', 'shopee', 'lazada', 'ebay'],
      },
      {
        id: 'netPayout',
        expression: 'salePrice - totalFee',
        dependencies: ['salePrice', 'totalFee'],
      },
      {
        id: 'effectiveRate',
        expression: 'totalFee / salePrice * 100',
        dependencies: ['totalFee', 'salePrice'],
      },
    ],
    outputs: [
      {
        id: 'totalFeeOut',
        label: 'Total Platform Fees',
        formulaRef: 'totalFee',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
      {
        id: 'netPayoutOut',
        label: 'Net Payout',
        formulaRef: 'netPayout',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
      {
        id: 'effectiveRateOut',
        label: 'Effective Fee Rate',
        formulaRef: 'effectiveRate',
        format: 'number',
        precision: 2,
        suffix: '%',
      },
    ],
    guide: {
      whatIsIt:
        'Marketplace platforms charge sellers a combination of listing fees, transaction/commission fees, and payment processing fees. Fee structures as of 2025: Etsy charges $0.20 listing + 6.5% transaction + 3% + $0.25 payment processing. Shopee charges ~7% total. Lazada charges ~6% total. eBay US charges 13.29% + $0.30 per order.',
      howToUse:
        '1. Enter the sale price of your item.\n2. Select the platform you sell on.\n3. If using Etsy, enter any shipping charge billed to the buyer (Etsy applies payment processing to shipping too).\nThe calculator shows total fees, net payout, and the effective fee rate.',
      exampleScenario:
        'You sell a $50 handmade item on Etsy with $5 shipping. Listing fee: $0.20. Transaction fee: $3.25 (6.5%). Payment processing: $1.65 (3% of $55) + $0.25. Total: $5.35. Net payout: $44.65. Effective rate: 10.7%. On eBay for the same $50: $6.95 fee, $43.05 net payout, 13.9% effective rate.',
      proTip:
        'Platform fees are just one cost — factor in packaging, shipping (if you offer free shipping), and the time cost of customer service. For high-volume sellers, Shopee and Lazada fee structures are often lower than Etsy or eBay. Multi-platform selling reduces platform dependency risk. Always check platform fee pages for updates as schedules change frequently.',
    },
    metadata: { version: '1.0.0', lastUpdated: '2025-01' },
  },
];
