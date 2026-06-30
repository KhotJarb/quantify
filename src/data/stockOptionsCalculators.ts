import type { CalculatorSchema } from '@/types/calculator';
export const stockOptionsCalculators: CalculatorSchema[] = [
  // â”€â”€â”€ 1. Commodities & Futures Calculator â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'commodities-futures',
    slug: 'commodities-futures',
    title: 'Commodities & Futures Calculator',
    description:
      'Determine the total contract value, margin requirement, and effective leverage for commodity futures positions.',
    icon: 'ðŸ›¢ï¸',
    category: 'finance',
    subcategory: 'stocks',
    tags: [
      'commodities',
      'futures',
      'margin',
      'leverage',
      'contract value',
      'trading',
    ],
    inputs: [
      {
        id: 'contractPrice',
        label: 'Contract Price',
        type: 'number',
        placeholder: 'e.g. 75.50',
        helpText: 'Current price per unit of the commodity',
        min: 0,
        step: 0.01,
      },
      {
        id: 'contractSize',
        label: 'Contract Size (Units)',
        type: 'number',
        placeholder: 'e.g. 1000',
        helpText: 'Number of units per futures contract (e.g. 1,000 barrels)',
        min: 1,
      },
      {
        id: 'numberOfContracts',
        label: 'Number of Contracts',
        type: 'number',
        defaultValue: 1,
        placeholder: 'e.g. 5',
        helpText: 'How many contracts you intend to trade',
        min: 1,
        step: 1,
      },
      {
        id: 'marginRequirement',
        label: 'Margin Requirement',
        type: 'number',
        placeholder: 'e.g. 10',
        helpText: 'Initial margin as a percentage of total contract value',
        min: 0,
        max: 100,
        step: 0.1,
      },
    ],
    formulas: [
      {
        id: 'totalValue',
        expression: 'contractPrice * contractSize * numberOfContracts',
        dependencies: ['contractPrice', 'contractSize', 'numberOfContracts'],
      },
      {
        id: 'marginNeeded',
        expression: 'totalValue * marginRequirement / 100',
        dependencies: ['totalValue', 'marginRequirement'],
      },
      {
        id: 'leverage',
        expression: 'totalValue / marginNeeded',
        dependencies: ['totalValue', 'marginNeeded'],
      },
    ],
    outputs: [
      {
        id: 'totalValue',
        label: 'Total Contract Value',
        formulaRef: 'totalValue',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
      {
        id: 'marginNeeded',
        label: 'Margin Required',
        formulaRef: 'marginNeeded',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'leverage',
        label: 'Effective Leverage',
        formulaRef: 'leverage',
        format: 'number',
        precision: 1,
      },
    ],
    guide: {
      whatIsIt:
        'A commodities and futures calculator helps traders understand the total notional value of a futures position, the cash required as margin collateral, and the resulting leverage. Futures contracts are standardized agreements to buy or sell a commodity at a predetermined price on a future date.',
      howToUse:
        'Enter the current price per unit, the contract size (units per contract), the number of contracts, and the margin requirement percentage set by your broker. The calculator outputs the total position value, the margin cash needed, and your effective leverage ratio.',
      exampleScenario:
        'You want to trade 2 crude oil futures at $75.50 per barrel. Each contract covers 1,000 barrels, and your broker requires 10% initial margin. Total value = $75.50 Ã— 1,000 Ã— 2 = $151,000. Margin needed = $151,000 Ã— 10% = $15,100. Leverage = 10Ã—.',
      proTip:
        'Higher leverage amplifies both gains and losses. Always ensure you have enough capital beyond the minimum margin to absorb daily mark-to-market fluctuations and avoid margin calls.',
    },
    metadata: { version: '1.0.0' },
  },
  // â”€â”€â”€ 2. Stock Return & Capital Gain Tax â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'stock-return-capital-gain',
    slug: 'stock-return-capital-gain',
    title: 'Stock Return & Capital Gain Tax',
    description:
      'Calculate total return, capital gains, applicable tax based on holding period and tax bracket, and your net gain after taxes.',
    icon: 'ðŸ“Š',
    category: 'finance',
    subcategory: 'stocks',
    tags: [
      'capital gains',
      'stock return',
      'tax',
      'short-term',
      'long-term',
      'investment return',
    ],
    inputs: [
      {
        id: 'purchasePrice',
        label: 'Purchase Price per Share',
        type: 'number',
        placeholder: 'e.g. 50',
        helpText: 'Price at which you bought each share',
        min: 0,
        step: 0.01,
      },
      {
        id: 'salePrice',
        label: 'Sale Price per Share',
        type: 'number',
        placeholder: 'e.g. 75',
        helpText: 'Price at which you sold (or plan to sell) each share',
        min: 0,
        step: 0.01,
      },
      {
        id: 'shares',
        label: 'Number of Shares',
        type: 'number',
        placeholder: 'e.g. 100',
        helpText: 'Total shares in this transaction',
        min: 1,
        step: 1,
      },
      {
        id: 'holdingPeriod',
        label: 'Holding Period',
        type: 'select',
        options: [
          { label: 'Short-Term (â‰¤ 1 year)', value: '0' },
          { label: 'Long-Term (> 1 year)', value: '1' },
        ],
        defaultValue: '1',
        helpText: 'Short-term gains are taxed as ordinary income; long-term gains receive preferential rates',
      },
      {
        id: 'taxBracket',
        label: 'Capital Gains Tax Rate',
        type: 'select',
        options: [
          { label: '0%', value: '0' },
          { label: '15%', value: '15' },
          { label: '20%', value: '20' },
        ],
        defaultValue: '15',
        helpText: 'Your applicable capital gains tax rate',
      },
    ],
    formulas: [
      {
        id: 'totalCost',
        expression: 'purchasePrice * shares',
        dependencies: ['purchasePrice', 'shares'],
      },
      {
        id: 'totalRevenue',
        expression: 'salePrice * shares',
        dependencies: ['salePrice', 'shares'],
      },
      {
        id: 'capitalGain',
        expression: 'totalRevenue - totalCost',
        dependencies: ['totalRevenue', 'totalCost'],
      },
      {
        id: 'returnPct',
        expression: 'capitalGain / totalCost * 100',
        dependencies: ['capitalGain', 'totalCost'],
      },
      {
        id: 'taxOwed',
        expression: 'capitalGain > 0 ? capitalGain * taxBracket / 100 : 0',
        dependencies: ['capitalGain', 'taxBracket'],
      },
      {
        id: 'netGain',
        expression: 'capitalGain - taxOwed',
        dependencies: ['capitalGain', 'taxOwed'],
      },
    ],
    outputs: [
      {
        id: 'capitalGain',
        label: 'Capital Gain / Loss',
        formulaRef: 'capitalGain',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
      {
        id: 'returnPct',
        label: 'Return on Investment',
        formulaRef: 'returnPct',
        format: 'percentage',
        precision: 2,
      },
      {
        id: 'taxOwed',
        label: 'Tax Owed',
        formulaRef: 'taxOwed',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'netGain',
        label: 'Net Gain After Tax',
        formulaRef: 'netGain',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
    ],
    guide: {
      whatIsIt:
        'This calculator computes your total capital gain or loss from a stock trade, estimates the tax liability based on your holding period and tax bracket, and shows the net profit after taxes. Capital gains tax rates differ for short-term (â‰¤ 1 year) and long-term (> 1 year) holdings in the U.S.',
      howToUse:
        'Enter the purchase price, sale price, and number of shares. Select whether the holding period is short-term or long-term, then choose your applicable tax rate. The calculator shows gross gain, return percentage, tax owed, and net gain.',
      exampleScenario:
        'You bought 100 shares at $50 and sold at $75 after 2 years (long-term). Capital gain = ($75 âˆ’ $50) Ã— 100 = $2,500. At the 15% long-term rate, tax = $375. Net gain = $2,125. Return = 50%.',
      proTip:
        'Consider tax-loss harvesting: selling losing positions to offset gains and reduce your tax bill. Also, holding an asset for just over a year can significantly reduce your tax rate from ordinary income rates to the preferential long-term rate.',
    },
    metadata: { version: '1.0.0' },
  },
  // â”€â”€â”€ 3. Stock Break Even & Profit â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'stock-break-even',
    slug: 'stock-break-even',
    title: 'Stock Break Even & Profit Calculator',
    description:
      'Find the break-even price per share after commissions and the sale price needed to reach a target profit.',
    icon: 'âš–ï¸',
    category: 'finance',
    subcategory: 'stocks',
    tags: [
      'break even',
      'profit target',
      'commission',
      'cost basis',
      'trading',
    ],
    inputs: [
      {
        id: 'purchasePrice',
        label: 'Purchase Price per Share',
        type: 'number',
        placeholder: 'e.g. 25.00',
        helpText: 'Price you paid per share',
        min: 0,
        step: 0.01,
      },
      {
        id: 'shares',
        label: 'Number of Shares',
        type: 'number',
        placeholder: 'e.g. 200',
        helpText: 'Total shares purchased',
        min: 1,
        step: 1,
      },
      {
        id: 'commission',
        label: 'Total Commission (Buy + Sell)',
        type: 'number',
        defaultValue: 0,
        placeholder: 'e.g. 20',
        helpText: 'Combined buy and sell commissions or fees',
        min: 0,
        step: 0.01,
      },
      {
        id: 'targetProfit',
        label: 'Target Profit',
        type: 'number',
        placeholder: 'e.g. 500',
        helpText: 'Desired profit amount in currency',
        min: 0,
        step: 0.01,
      },
    ],
    formulas: [
      {
        id: 'totalCost',
        expression: 'purchasePrice * shares + commission',
        dependencies: ['purchasePrice', 'shares', 'commission'],
      },
      {
        id: 'breakEvenPrice',
        expression: 'totalCost / shares',
        dependencies: ['totalCost', 'shares'],
      },
      {
        id: 'targetSalePrice',
        expression: '(totalCost + targetProfit) / shares',
        dependencies: ['totalCost', 'targetProfit', 'shares'],
      },
      {
        id: 'profitPerShare',
        expression: 'targetSalePrice - purchasePrice',
        dependencies: ['targetSalePrice', 'purchasePrice'],
      },
    ],
    outputs: [
      {
        id: 'totalCost',
        label: 'Total Cost Basis',
        formulaRef: 'totalCost',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'breakEvenPrice',
        label: 'Break-Even Price per Share',
        formulaRef: 'breakEvenPrice',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
      {
        id: 'targetSalePrice',
        label: 'Target Sale Price per Share',
        formulaRef: 'targetSalePrice',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
      {
        id: 'profitPerShare',
        label: 'Profit per Share Needed',
        formulaRef: 'profitPerShare',
        format: 'currency',
        precision: 2,
      },
    ],
    guide: {
      whatIsIt:
        'The stock break-even calculator determines the minimum sale price per share needed to recover your total investment including commissions, and calculates the sale price required to achieve a specific profit target.',
      howToUse:
        'Enter your purchase price, number of shares, total commissions (buy + sell combined), and your desired profit target. The calculator outputs your total cost basis, break-even price, and the sale price needed to hit your target.',
      exampleScenario:
        'You buy 200 shares at $25.00 with $20 total commissions. Total cost = $5,020. Break-even price = $5,020 / 200 = $25.10 per share. To make a $500 profit, you need to sell at ($5,020 + $500) / 200 = $27.60 per share.',
      proTip:
        'Many modern brokers offer zero-commission trading, but always account for regulatory fees, bid-ask spreads, and any per-contract options fees, which act as hidden commissions.',
    },
    metadata: { version: '1.0.0' },
  },
  // â”€â”€â”€ 4. Stock Price Average Calculator â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'stock-price-average',
    slug: 'stock-price-average',
    title: 'Stock Price Average Calculator',
    description:
      'Compute the weighted average cost per share across up to three separate purchase lots.',
    icon: 'ðŸ“‰',
    category: 'finance',
    subcategory: 'stocks',
    tags: [
      'average price',
      'cost averaging',
      'dollar cost averaging',
      'DCA',
      'weighted average',
    ],
    inputs: [
      {
        id: 'price1',
        label: 'Lot 1 â€” Price per Share',
        type: 'number',
        placeholder: 'e.g. 50',
        helpText: 'Purchase price for the first lot',
        min: 0,
        step: 0.01,
        group: 'lot1',
      },
      {
        id: 'shares1',
        label: 'Lot 1 â€” Shares',
        type: 'number',
        placeholder: 'e.g. 100',
        helpText: 'Number of shares in the first lot',
        min: 1,
        step: 1,
        group: 'lot1',
      },
      {
        id: 'price2',
        label: 'Lot 2 â€” Price per Share',
        type: 'number',
        placeholder: 'e.g. 45',
        helpText: 'Purchase price for the second lot',
        min: 0,
        step: 0.01,
        group: 'lot2',
      },
      {
        id: 'shares2',
        label: 'Lot 2 â€” Shares',
        type: 'number',
        placeholder: 'e.g. 150',
        helpText: 'Number of shares in the second lot',
        min: 1,
        step: 1,
        group: 'lot2',
      },
      {
        id: 'price3',
        label: 'Lot 3 â€” Price per Share (optional)',
        type: 'number',
        defaultValue: 0,
        placeholder: 'e.g. 40',
        helpText: 'Purchase price for the third lot; leave 0 if not used',
        min: 0,
        step: 0.01,
        group: 'lot3',
      },
      {
        id: 'shares3',
        label: 'Lot 3 â€” Shares (optional)',
        type: 'number',
        defaultValue: 0,
        placeholder: 'e.g. 200',
        helpText: 'Number of shares in the third lot; leave 0 if not used',
        min: 0,
        step: 1,
        group: 'lot3',
      },
    ],
    formulas: [
      {
        id: 'totalInvested',
        expression: 'price1 * shares1 + price2 * shares2 + price3 * shares3',
        dependencies: ['price1', 'shares1', 'price2', 'shares2', 'price3', 'shares3'],
      },
      {
        id: 'totalShares',
        expression: 'shares1 + shares2 + shares3',
        dependencies: ['shares1', 'shares2', 'shares3'],
      },
      {
        id: 'averagePrice',
        expression: 'totalInvested / totalShares',
        dependencies: ['totalInvested', 'totalShares'],
      },
    ],
    outputs: [
      {
        id: 'totalInvested',
        label: 'Total Amount Invested',
        formulaRef: 'totalInvested',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'totalShares',
        label: 'Total Shares',
        formulaRef: 'totalShares',
        format: 'number',
        precision: 0,
      },
      {
        id: 'averagePrice',
        label: 'Average Cost per Share',
        formulaRef: 'averagePrice',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
    ],
    guide: {
      whatIsIt:
        'The stock price average calculator (also known as a cost-basis calculator) computes the weighted average cost per share when you have purchased the same stock at different prices across multiple transactions. It is essential for tracking your true cost basis.',
      howToUse:
        'Enter the purchase price and number of shares for up to three lots. If you only have two purchases, leave the third lot fields at zero. The calculator computes the total investment, total shares, and weighted average price.',
      exampleScenario:
        'You bought 100 shares at $50, then 150 at $45, then 200 at $40. Total invested = $5,000 + $6,750 + $8,000 = $19,750. Total shares = 450. Average price = $19,750 / 450 â‰ˆ $43.89.',
      proTip:
        'Dollar-cost averaging (buying at regular intervals regardless of price) naturally lowers your average cost during volatile markets, since you buy more shares when prices are low and fewer when prices are high.',
    },
    metadata: { version: '1.0.0' },
  },
  // â”€â”€â”€ 5. Dividend Tax Calculator â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'dividend-tax-calculator',
    slug: 'dividend-tax-calculator',
    title: 'Dividend Tax Calculator',
    description:
      'Estimate taxes on dividend income by separating qualified and ordinary dividends at their respective tax rates.',
    icon: 'ðŸ›ï¸',
    category: 'finance',
    subcategory: 'dividends',
    tags: [
      'dividend tax',
      'qualified dividends',
      'ordinary dividends',
      'tax rate',
      'after-tax income',
    ],
    inputs: [
      {
        id: 'totalDividends',
        label: 'Total Dividend Income',
        type: 'number',
        placeholder: 'e.g. 5000',
        helpText: 'Total dividends received during the tax year',
        min: 0,
        step: 0.01,
      },
      {
        id: 'qualifiedPercent',
        label: 'Qualified Dividend Percentage',
        type: 'range',
        defaultValue: 100,
        min: 0,
        max: 100,
        step: 1,
        helpText: 'Percentage of dividends that qualify for the lower tax rate',
      },
      {
        id: 'ordinaryTaxRate',
        label: 'Ordinary Income Tax Rate',
        type: 'number',
        placeholder: 'e.g. 32',
        helpText: 'Your marginal tax rate for ordinary (non-qualified) income',
        min: 0,
        max: 100,
        step: 0.1,
      },
      {
        id: 'qualifiedTaxRate',
        label: 'Qualified Dividend Tax Rate',
        type: 'number',
        placeholder: 'e.g. 15',
        helpText: 'Tax rate applied to qualified dividends (0%, 15%, or 20%)',
        min: 0,
        max: 100,
        step: 0.1,
      },
    ],
    formulas: [
      {
        id: 'qualifiedAmount',
        expression: 'totalDividends * qualifiedPercent / 100',
        dependencies: ['totalDividends', 'qualifiedPercent'],
      },
      {
        id: 'ordinaryAmount',
        expression: 'totalDividends - qualifiedAmount',
        dependencies: ['totalDividends', 'qualifiedAmount'],
      },
      {
        id: 'qualifiedTax',
        expression: 'qualifiedAmount * qualifiedTaxRate / 100',
        dependencies: ['qualifiedAmount', 'qualifiedTaxRate'],
      },
      {
        id: 'ordinaryTax',
        expression: 'ordinaryAmount * ordinaryTaxRate / 100',
        dependencies: ['ordinaryAmount', 'ordinaryTaxRate'],
      },
      {
        id: 'totalTax',
        expression: 'qualifiedTax + ordinaryTax',
        dependencies: ['qualifiedTax', 'ordinaryTax'],
      },
      {
        id: 'afterTax',
        expression: 'totalDividends - totalTax',
        dependencies: ['totalDividends', 'totalTax'],
      },
      {
        id: 'effectiveRate',
        expression: 'totalTax / totalDividends * 100',
        dependencies: ['totalTax', 'totalDividends'],
      },
    ],
    outputs: [
      {
        id: 'qualifiedAmount',
        label: 'Qualified Dividends',
        formulaRef: 'qualifiedAmount',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'ordinaryAmount',
        label: 'Ordinary Dividends',
        formulaRef: 'ordinaryAmount',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'totalTax',
        label: 'Total Tax on Dividends',
        formulaRef: 'totalTax',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
      {
        id: 'afterTax',
        label: 'After-Tax Dividend Income',
        formulaRef: 'afterTax',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
      {
        id: 'effectiveRate',
        label: 'Effective Tax Rate',
        formulaRef: 'effectiveRate',
        format: 'percentage',
        precision: 2,
      },
    ],
    guide: {
      whatIsIt:
        'The dividend tax calculator separates your dividend income into qualified and ordinary portions, applies the appropriate tax rate to each, and shows your total tax liability and after-tax income. In the U.S., qualified dividends are taxed at the lower long-term capital gains rate, while ordinary dividends are taxed at your marginal income tax rate.',
      howToUse:
        'Enter your total dividend income for the year, the percentage that qualifies for the lower rate (shown on Form 1099-DIV), your ordinary income tax rate, and the qualified dividend tax rate. The calculator breaks down the tax on each portion.',
      exampleScenario:
        'You received $5,000 in dividends, 80% qualified. Your ordinary rate is 32% and the qualified rate is 15%. Qualified = $4,000 â†’ tax = $600. Ordinary = $1,000 â†’ tax = $320. Total tax = $920. After-tax = $4,080. Effective rate = 18.4%.',
      proTip:
        'To maximize qualified dividends, hold stocks for more than 60 days within the 121-day window around the ex-dividend date. REITs and money-market dividends are generally non-qualified and taxed at ordinary rates.',
    },
    metadata: { version: '1.0.0' },
  },
  // â”€â”€â”€ 6. Dividend Calculator â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'dividend-calculator',
    slug: 'dividend-calculator',
    title: 'Dividend Calculator',
    description:
      'Project current and future dividend income based on share count, dividend per share, and an expected dividend growth rate.',
    icon: 'ðŸ’°',
    category: 'finance',
    subcategory: 'dividends',
    tags: [
      'dividend yield',
      'dividend income',
      'dividend growth',
      'yield on cost',
      'passive income',
    ],
    inputs: [
      {
        id: 'sharePrice',
        label: 'Current Share Price',
        type: 'number',
        placeholder: 'e.g. 120',
        helpText: 'Current market price per share',
        min: 0.01,
        step: 0.01,
      },
      {
        id: 'dividendPerShare',
        label: 'Annual Dividend per Share',
        type: 'number',
        placeholder: 'e.g. 3.50',
        helpText: 'Total annual dividend per share',
        min: 0,
        step: 0.01,
      },
      {
        id: 'shares',
        label: 'Number of Shares',
        type: 'number',
        placeholder: 'e.g. 500',
        helpText: 'Total shares you own',
        min: 1,
        step: 1,
      },
      {
        id: 'dividendGrowthRate',
        label: 'Dividend Growth Rate',
        type: 'number',
        defaultValue: 5,
        placeholder: 'e.g. 5',
        helpText: 'Expected annual dividend growth rate',
        min: 0,
        max: 100,
        step: 0.1,
      },
      {
        id: 'years',
        label: 'Projection Period (Years)',
        type: 'number',
        defaultValue: 10,
        placeholder: 'e.g. 10',
        helpText: 'Number of years into the future to project',
        min: 1,
        max: 50,
        step: 1,
      },
    ],
    formulas: [
      {
        id: 'currentYield',
        expression: 'dividendPerShare / sharePrice * 100',
        dependencies: ['dividendPerShare', 'sharePrice'],
      },
      {
        id: 'annualIncome',
        expression: 'dividendPerShare * shares',
        dependencies: ['dividendPerShare', 'shares'],
      },
      {
        id: 'futureDiv',
        expression: 'dividendPerShare * pow(1 + dividendGrowthRate / 100, years)',
        dependencies: ['dividendPerShare', 'dividendGrowthRate', 'years'],
      },
      {
        id: 'futureDivIncome',
        expression: 'futureDiv * shares',
        dependencies: ['futureDiv', 'shares'],
      },
      {
        id: 'yieldOnCost',
        expression: 'futureDiv / sharePrice * 100',
        dependencies: ['futureDiv', 'sharePrice'],
      },
    ],
    outputs: [
      {
        id: 'currentYield',
        label: 'Current Dividend Yield',
        formulaRef: 'currentYield',
        format: 'percentage',
        precision: 2,
        highlight: true,
      },
      {
        id: 'annualIncome',
        label: 'Current Annual Income',
        formulaRef: 'annualIncome',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'futureDiv',
        label: 'Projected Dividend per Share',
        formulaRef: 'futureDiv',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'futureDivIncome',
        label: 'Projected Annual Income',
        formulaRef: 'futureDivIncome',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
      {
        id: 'yieldOnCost',
        label: 'Yield on Cost (Future)',
        formulaRef: 'yieldOnCost',
        format: 'percentage',
        precision: 2,
      },
    ],
    guide: {
      whatIsIt:
        'The dividend calculator projects both your current annual dividend income and your future income based on an expected dividend growth rate. It also computes yield on cost â€” the future dividend relative to your original purchase price â€” a key metric for income investors.',
      howToUse:
        'Enter the current share price, the annual dividend per share, the number of shares you own, the expected annual dividend growth rate, and the number of years to project. The calculator shows current yield, current income, and projected future income.',
      exampleScenario:
        'You own 500 shares at $120 each, paying $3.50 in annual dividends (2.92% yield). With 5% annual growth over 10 years, the future dividend per share rises to $3.50 Ã— 1.05^10 â‰ˆ $5.70, giving $2,850 annual income and a 4.75% yield on cost.',
      proTip:
        'Reinvesting dividends (DRIP) to purchase additional shares creates a compounding effect that can dramatically accelerate portfolio growth over long time horizons.',
    },
    metadata: { version: '1.0.0' },
  },
  // â”€â”€â”€ 7. Constant Growth Stock â€” Gordon Growth Model â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'gordon-growth-model',
    slug: 'gordon-growth-model',
    title: 'Gordon Growth Model (DDM)',
    description:
      'Estimate the intrinsic value of a stock using the Dividend Discount Model for a stock with dividends growing at a constant rate forever.',
    icon: 'ðŸŒ±',
    category: 'finance',
    subcategory: 'stocks',
    tags: [
      'gordon growth',
      'DDM',
      'dividend discount model',
      'intrinsic value',
      'valuation',
      'constant growth',
    ],
    inputs: [
      {
        id: 'currentDividend',
        label: 'Current Annual Dividend (Dâ‚€)',
        type: 'number',
        placeholder: 'e.g. 2.00',
        helpText: 'The most recent annual dividend paid per share',
        min: 0,
        step: 0.01,
      },
      {
        id: 'growthRate',
        label: 'Constant Growth Rate (g)',
        type: 'number',
        placeholder: 'e.g. 4',
        helpText: 'Expected perpetual annual dividend growth rate',
        min: 0,
        max: 99,
        step: 0.1,
      },
      {
        id: 'requiredReturn',
        label: 'Required Rate of Return (r)',
        type: 'number',
        placeholder: 'e.g. 10',
        helpText: 'Your minimum acceptable annual return (must exceed growth rate)',
        min: 0.1,
        max: 100,
        step: 0.1,
      },
    ],
    formulas: [
      {
        id: 'nextDividend',
        expression: 'currentDividend * (1 + growthRate / 100)',
        dependencies: ['currentDividend', 'growthRate'],
      },
      {
        id: 'intrinsicValue',
        expression: 'nextDividend / (requiredReturn / 100 - growthRate / 100)',
        dependencies: ['nextDividend', 'requiredReturn', 'growthRate'],
      },
    ],
    outputs: [
      {
        id: 'nextDividend',
        label: 'Next Year Dividend (Dâ‚)',
        formulaRef: 'nextDividend',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'intrinsicValue',
        label: 'Intrinsic Value per Share',
        formulaRef: 'intrinsicValue',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
    ],
    guide: {
      whatIsIt:
        'The Gordon Growth Model (GGM), also called the constant-growth Dividend Discount Model, values a stock as the present value of all future dividends growing at a constant rate in perpetuity. The formula is Pâ‚€ = Dâ‚ / (r âˆ’ g), where Dâ‚ is the next dividend, r is the required return, and g is the constant growth rate. It only works when r > g.',
      howToUse:
        'Enter the current dividend (Dâ‚€), the expected perpetual growth rate (g), and your required rate of return (r). Ensure r > g, or the model produces nonsensical results. The calculator outputs the next dividend and the estimated intrinsic share value.',
      exampleScenario:
        'A stock just paid a $2.00 dividend. You expect dividends to grow at 4% forever and require a 10% return. Dâ‚ = $2.00 Ã— 1.04 = $2.08. Intrinsic value = $2.08 / (0.10 âˆ’ 0.04) = $34.67.',
      proTip:
        'The GGM is highly sensitive to the growth rate assumption. A small change in g can dramatically alter the valuation. The model is best suited for mature, stable-dividend companies. It fails when g â‰¥ r, producing infinite or negative values.',
    },
    metadata: { version: '1.0.0' },
  },
  // â”€â”€â”€ 8. Non-Constant Growth Stock Valuation â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'non-constant-growth',
    slug: 'non-constant-growth',
    title: 'Non-Constant Growth Stock Valuation',
    description:
      'Value a stock with an initial high-growth phase followed by stable perpetual growth using a two-stage Dividend Discount Model.',
    icon: 'ðŸ“ˆ',
    category: 'finance',
    subcategory: 'stocks',
    tags: [
      'two-stage DDM',
      'non-constant growth',
      'high growth',
      'stock valuation',
      'terminal value',
    ],
    inputs: [
      {
        id: 'currentDividend',
        label: 'Current Dividend (Dâ‚€)',
        type: 'number',
        placeholder: 'e.g. 1.50',
        helpText: 'The most recent annual dividend per share',
        min: 0,
        step: 0.01,
      },
      {
        id: 'highGrowthRate',
        label: 'High Growth Rate (gâ‚)',
        type: 'number',
        placeholder: 'e.g. 20',
        helpText: 'Annual dividend growth rate during the initial high-growth phase',
        min: 0,
        max: 200,
        step: 0.1,
      },
      {
        id: 'highGrowthYears',
        label: 'High Growth Period (years)',
        type: 'number',
        placeholder: 'e.g. 5',
        helpText: 'Number of years the high-growth phase lasts',
        min: 1,
        max: 30,
        step: 1,
      },
      {
        id: 'stableGrowthRate',
        label: 'Stable Growth Rate (gâ‚‚)',
        type: 'number',
        placeholder: 'e.g. 3',
        helpText: 'Perpetual growth rate after the high-growth phase ends (must be < required return)',
        min: 0,
        max: 99,
        step: 0.1,
      },
      {
        id: 'requiredReturn',
        label: 'Required Rate of Return (r)',
        type: 'number',
        placeholder: 'e.g. 12',
        helpText: 'Your minimum acceptable annual return',
        min: 0.1,
        max: 100,
        step: 0.1,
      },
    ],
    formulas: [
      // PV of high-growth dividends using geometric series:
      // PV = Dâ‚€(1+gâ‚)/(r-gâ‚) Ã— [1 - ((1+gâ‚)/(1+r))^n]
      {
        id: 'pvHighGrowth',
        expression:
          'currentDividend * (1 + highGrowthRate / 100) / (requiredReturn / 100 - highGrowthRate / 100) * (1 - pow((1 + highGrowthRate / 100) / (1 + requiredReturn / 100), highGrowthYears))',
        dependencies: [
          'currentDividend',
          'highGrowthRate',
          'requiredReturn',
          'highGrowthYears',
        ],
      },
      // Terminal dividend = Dâ‚€ Ã— (1+gâ‚)^n Ã— (1+gâ‚‚)
      {
        id: 'terminalDiv',
        expression:
          'currentDividend * pow(1 + highGrowthRate / 100, highGrowthYears) * (1 + stableGrowthRate / 100)',
        dependencies: [
          'currentDividend',
          'highGrowthRate',
          'highGrowthYears',
          'stableGrowthRate',
        ],
      },
      // Terminal value at year n = terminalDiv / (r - gâ‚‚)
      {
        id: 'terminalValue',
        expression: 'terminalDiv / (requiredReturn / 100 - stableGrowthRate / 100)',
        dependencies: ['terminalDiv', 'requiredReturn', 'stableGrowthRate'],
      },
      // PV of terminal value
      {
        id: 'pvTerminal',
        expression: 'terminalValue / pow(1 + requiredReturn / 100, highGrowthYears)',
        dependencies: ['terminalValue', 'requiredReturn', 'highGrowthYears'],
      },
      {
        id: 'intrinsicValue',
        expression: 'pvHighGrowth + pvTerminal',
        dependencies: ['pvHighGrowth', 'pvTerminal'],
      },
    ],
    outputs: [
      {
        id: 'pvHighGrowth',
        label: 'PV of High-Growth Dividends',
        formulaRef: 'pvHighGrowth',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'terminalValue',
        label: 'Terminal Value (at Year n)',
        formulaRef: 'terminalValue',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'pvTerminal',
        label: 'PV of Terminal Value',
        formulaRef: 'pvTerminal',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'intrinsicValue',
        label: 'Intrinsic Value per Share',
        formulaRef: 'intrinsicValue',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
    ],
    guide: {
      whatIsIt:
        'The two-stage Dividend Discount Model values a stock experiencing an initial period of above-normal (high) growth followed by a stable, perpetual growth phase. It is ideal for growth companies expected to eventually mature. The value is the sum of the PV of dividends during the high-growth phase plus the PV of the terminal (Gordon) value.',
      howToUse:
        'Enter the current dividend, the high-growth rate and its duration in years, the long-term stable growth rate, and your required return. The required return must exceed the stable growth rate for the model to produce valid results.',
      exampleScenario:
        'A company pays $1.50 now, growing dividends at 20% for 5 years, then 3% forever. Required return is 12%. PV of high-growth dividends â‰ˆ $11.67. Terminal dividend = $1.50 Ã— 1.2âµ Ã— 1.03 â‰ˆ $3.85. Terminal value = $3.85 / 0.09 â‰ˆ $42.73. PV of terminal = $42.73 / 1.12âµ â‰ˆ $24.24. Intrinsic value â‰ˆ $35.91.',
      proTip:
        'The terminal value often dominates the total valuation (60â€“80%). This makes the stable growth rate and required return assumptions critical. Sensitivity analysis on gâ‚‚ and r is strongly recommended.',
    },
    metadata: { version: '1.0.0' },
  },
  // â”€â”€â”€ 9. CAPM Calculator â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'capm-calculator',
    slug: 'capm-calculator',
    title: 'CAPM Calculator',
    description:
      'Calculate the expected return of an asset using the Capital Asset Pricing Model based on the risk-free rate, market return, and beta.',
    icon: 'ðŸ“',
    category: 'finance',
    subcategory: 'stocks',
    tags: [
      'CAPM',
      'expected return',
      'beta',
      'risk premium',
      'market risk',
      'cost of equity',
    ],
    inputs: [
      {
        id: 'riskFreeRate',
        label: 'Risk-Free Rate (Rf)',
        type: 'number',
        placeholder: 'e.g. 4.5',
        helpText: 'Yield on risk-free assets such as 10-year U.S. Treasury bonds',
        min: 0,
        max: 100,
        step: 0.01,
      },
      {
        id: 'marketReturn',
        label: 'Expected Market Return (Rm)',
        type: 'number',
        placeholder: 'e.g. 10',
        helpText: 'Expected annual return of the overall market (e.g. S&P 500)',
        min: 0,
        max: 100,
        step: 0.01,
      },
      {
        id: 'beta',
        label: 'Beta (Î²)',
        type: 'number',
        placeholder: 'e.g. 1.2',
        helpText: 'Sensitivity of the stock to market movements (Î² = 1 means average market risk)',
        min: -5,
        max: 10,
        step: 0.01,
      },
    ],
    formulas: [
      {
        id: 'riskPremium',
        expression: 'marketReturn - riskFreeRate',
        dependencies: ['marketReturn', 'riskFreeRate'],
      },
      {
        id: 'stockPremium',
        expression: 'beta * riskPremium',
        dependencies: ['beta', 'riskPremium'],
      },
      {
        id: 'expectedReturn',
        expression: 'riskFreeRate + beta * (marketReturn - riskFreeRate)',
        dependencies: ['riskFreeRate', 'beta', 'marketReturn'],
      },
    ],
    outputs: [
      {
        id: 'expectedReturn',
        label: 'Expected Return (CAPM)',
        formulaRef: 'expectedReturn',
        format: 'percentage',
        precision: 2,
        highlight: true,
      },
      {
        id: 'riskPremium',
        label: 'Market Risk Premium',
        formulaRef: 'riskPremium',
        format: 'percentage',
        precision: 2,
      },
      {
        id: 'stockPremium',
        label: 'Stock Risk Premium (Î² Ã— MRP)',
        formulaRef: 'stockPremium',
        format: 'percentage',
        precision: 2,
      },
    ],
    guide: {
      whatIsIt:
        'The Capital Asset Pricing Model (CAPM) calculates the expected return of an investment given its systematic risk (beta). The formula is E(Ri) = Rf + Î²i Ã— (Rm âˆ’ Rf). It is the foundational model in modern portfolio theory and is commonly used to estimate the cost of equity in corporate finance.',
      howToUse:
        'Enter the risk-free rate (e.g., 10-year Treasury yield), the expected market return (historical average or forward estimate), and the stock\'s beta coefficient. The calculator outputs the expected return, the market risk premium, and the stock-specific risk premium.',
      exampleScenario:
        'With a risk-free rate of 4.5%, an expected market return of 10%, and a stock beta of 1.2: Expected return = 4.5% + 1.2 Ã— (10% âˆ’ 4.5%) = 4.5% + 6.6% = 11.1%.',
      proTip:
        'Beta is backward-looking and can change over time. Use a 5-year monthly regression against a broad index for the most stable estimate. CAPM only captures systematic (market) risk â€” it does not account for size, value, momentum, or other factor premiums.',
    },
    metadata: { version: '1.0.0' },
  },
  // â”€â”€â”€ 10. Expected Return Calculator â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'expected-return-calculator',
    slug: 'expected-return-calculator',
    title: 'Expected Return Calculator',
    description:
      'Compute the probability-weighted expected return, variance, and standard deviation across three economic scenarios (bull, base, bear).',
    icon: 'ðŸŽ¯',
    category: 'finance',
    subcategory: 'stocks',
    tags: [
      'expected return',
      'probability',
      'variance',
      'standard deviation',
      'risk',
      'scenarios',
    ],
    inputs: [
      {
        id: 'prob1',
        label: 'Bull Scenario Probability',
        type: 'number',
        placeholder: 'e.g. 30',
        helpText: 'Probability of the optimistic scenario (%); all three should sum to 100',
        min: 0,
        max: 100,
        step: 1,
        group: 'bull',
      },
      {
        id: 'return1',
        label: 'Bull Scenario Return',
        type: 'number',
        placeholder: 'e.g. 25',
        helpText: 'Expected return if the bull scenario occurs (%)',
        step: 0.1,
        group: 'bull',
      },
      {
        id: 'prob2',
        label: 'Base Scenario Probability',
        type: 'number',
        placeholder: 'e.g. 50',
        helpText: 'Probability of the base-case scenario (%)',
        min: 0,
        max: 100,
        step: 1,
        group: 'base',
      },
      {
        id: 'return2',
        label: 'Base Scenario Return',
        type: 'number',
        placeholder: 'e.g. 10',
        helpText: 'Expected return if the base scenario occurs (%)',
        step: 0.1,
        group: 'base',
      },
      {
        id: 'prob3',
        label: 'Bear Scenario Probability',
        type: 'number',
        placeholder: 'e.g. 20',
        helpText: 'Probability of the pessimistic scenario (%)',
        min: 0,
        max: 100,
        step: 1,
        group: 'bear',
      },
      {
        id: 'return3',
        label: 'Bear Scenario Return',
        type: 'number',
        placeholder: 'e.g. -15',
        helpText: 'Expected return if the bear scenario occurs (%, can be negative)',
        step: 0.1,
        group: 'bear',
      },
    ],
    formulas: [
      {
        id: 'expectedReturn',
        expression: '(prob1 * return1 + prob2 * return2 + prob3 * return3) / 100',
        dependencies: ['prob1', 'return1', 'prob2', 'return2', 'prob3', 'return3'],
      },
      {
        id: 'variance',
        expression:
          '(prob1 * pow(return1 - expectedReturn, 2) + prob2 * pow(return2 - expectedReturn, 2) + prob3 * pow(return3 - expectedReturn, 2)) / 100',
        dependencies: [
          'prob1',
          'return1',
          'prob2',
          'return2',
          'prob3',
          'return3',
          'expectedReturn',
        ],
      },
      {
        id: 'stdDev',
        expression: 'sqrt(variance)',
        dependencies: ['variance'],
      },
    ],
    outputs: [
      {
        id: 'expectedReturn',
        label: 'Expected Return',
        formulaRef: 'expectedReturn',
        format: 'percentage',
        precision: 2,
        highlight: true,
      },
      {
        id: 'variance',
        label: 'Variance',
        formulaRef: 'variance',
        format: 'number',
        precision: 4,
      },
      {
        id: 'stdDev',
        label: 'Standard Deviation (Risk)',
        formulaRef: 'stdDev',
        format: 'percentage',
        precision: 2,
        highlight: true,
      },
    ],
    guide: {
      whatIsIt:
        'The expected return calculator uses probability-weighted scenarios to estimate the mean return of an investment and measure its risk through variance and standard deviation. It is a fundamental tool in portfolio analysis and risk assessment.',
      howToUse:
        'Define three scenarios (bull, base, bear) with their probabilities and expected returns. Probabilities should ideally sum to 100%. The calculator computes the expected return, variance, and standard deviation.',
      exampleScenario:
        'Bull: 30% probability, +25% return. Base: 50% probability, +10% return. Bear: 20% probability, âˆ’15% return. Expected return = (30Ã—25 + 50Ã—10 + 20Ã—(âˆ’15)) / 100 = 9.5%. The standard deviation measures how spread out the outcomes are.',
      proTip:
        'A higher standard deviation means more uncertainty. Use the coefficient of variation (std dev / expected return) to compare the risk-per-unit-of-return across different investments.',
    },
    metadata: { version: '1.0.0' },
  },
  // â”€â”€â”€ 11. Holding Period Return â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'holding-period-return',
    slug: 'holding-period-return',
    title: 'Holding Period Return Calculator',
    description:
      'Calculate the total holding period return and annualized return for an investment including income (dividends) received.',
    icon: 'â±ï¸',
    category: 'finance',
    subcategory: 'stocks',
    tags: [
      'holding period return',
      'HPR',
      'annualized return',
      'total return',
      'investment performance',
    ],
    inputs: [
      {
        id: 'beginningValue',
        label: 'Beginning Value',
        type: 'number',
        placeholder: 'e.g. 10000',
        helpText: 'Initial investment value or purchase price',
        min: 0.01,
        step: 0.01,
      },
      {
        id: 'endingValue',
        label: 'Ending Value',
        type: 'number',
        placeholder: 'e.g. 13500',
        helpText: 'Current or sale value of the investment',
        min: 0,
        step: 0.01,
      },
      {
        id: 'income',
        label: 'Income Received (Dividends)',
        type: 'number',
        defaultValue: 0,
        placeholder: 'e.g. 500',
        helpText: 'Total dividends or other income received during the holding period',
        min: 0,
        step: 0.01,
      },
      {
        id: 'holdingPeriodYears',
        label: 'Holding Period (Years)',
        type: 'number',
        placeholder: 'e.g. 3',
        helpText: 'Number of years the investment was held',
        min: 0.01,
        max: 100,
        step: 0.01,
      },
    ],
    formulas: [
      {
        id: 'hpr',
        expression: '(endingValue - beginningValue + income) / beginningValue * 100',
        dependencies: ['endingValue', 'beginningValue', 'income'],
      },
      {
        id: 'annualizedReturn',
        expression: '(pow(1 + hpr / 100, 1 / holdingPeriodYears) - 1) * 100',
        dependencies: ['hpr', 'holdingPeriodYears'],
      },
    ],
    outputs: [
      {
        id: 'hpr',
        label: 'Holding Period Return (HPR)',
        formulaRef: 'hpr',
        format: 'percentage',
        precision: 2,
        highlight: true,
      },
      {
        id: 'annualizedReturn',
        label: 'Annualized Return',
        formulaRef: 'annualizedReturn',
        format: 'percentage',
        precision: 2,
        highlight: true,
      },
    ],
    guide: {
      whatIsIt:
        'Holding Period Return (HPR) measures the total return earned from an investment over its entire holding period, including price appreciation and income. The annualized return converts HPR into an equivalent yearly return for comparison across investments held for different durations.',
      howToUse:
        'Enter the beginning value (purchase price), ending value (sale price or current value), any income received (dividends, interest), and the holding period in years. The calculator outputs the total HPR and the annualized return.',
      exampleScenario:
        'You invested $10,000 and after 3 years the investment is worth $13,500, with $500 in dividends received. HPR = ($13,500 âˆ’ $10,000 + $500) / $10,000 = 40%. Annualized return = (1.40)^(1/3) âˆ’ 1 â‰ˆ 11.87% per year.',
      proTip:
        'The annualized return assumes returns compound evenly each year, which is rarely the case. For a more precise measure, use time-weighted return (TWR) or money-weighted return (IRR) if cash flows vary over time.',
    },
    metadata: { version: '1.0.0' },
  },
  // â”€â”€â”€ 12. WACC Calculator â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'wacc-calculator',
    slug: 'wacc-calculator',
    title: 'WACC Calculator',
    description:
      'Calculate the Weighted Average Cost of Capital considering the cost and proportion of both equity and debt financing with tax shield.',
    icon: 'ðŸ—ï¸',
    category: 'finance',
    subcategory: 'stocks',
    tags: [
      'WACC',
      'cost of capital',
      'cost of equity',
      'cost of debt',
      'capital structure',
      'tax shield',
    ],
    inputs: [
      {
        id: 'equityValue',
        label: 'Market Value of Equity',
        type: 'number',
        placeholder: 'e.g. 800000',
        helpText: 'Total market value of the company\'s equity (market cap)',
        min: 0,
        step: 1,
      },
      {
        id: 'debtValue',
        label: 'Market Value of Debt',
        type: 'number',
        placeholder: 'e.g. 200000',
        helpText: 'Total market value of the company\'s interest-bearing debt',
        min: 0,
        step: 1,
      },
      {
        id: 'costOfEquity',
        label: 'Cost of Equity (Re)',
        type: 'number',
        placeholder: 'e.g. 12',
        helpText: 'Required return on equity, often estimated via CAPM',
        min: 0,
        max: 100,
        step: 0.01,
      },
      {
        id: 'costOfDebt',
        label: 'Cost of Debt (Rd)',
        type: 'number',
        placeholder: 'e.g. 6',
        helpText: 'Average interest rate on the company\'s debt',
        min: 0,
        max: 100,
        step: 0.01,
      },
      {
        id: 'taxRate',
        label: 'Corporate Tax Rate',
        type: 'number',
        placeholder: 'e.g. 21',
        helpText: 'Marginal corporate tax rate (debt interest is tax-deductible)',
        min: 0,
        max: 100,
        step: 0.1,
      },
    ],
    formulas: [
      {
        id: 'totalCapital',
        expression: 'equityValue + debtValue',
        dependencies: ['equityValue', 'debtValue'],
      },
      {
        id: 'equityWeight',
        expression: 'equityValue / totalCapital',
        dependencies: ['equityValue', 'totalCapital'],
      },
      {
        id: 'debtWeight',
        expression: 'debtValue / totalCapital',
        dependencies: ['debtValue', 'totalCapital'],
      },
      {
        id: 'wacc',
        expression:
          'equityWeight * costOfEquity + debtWeight * costOfDebt * (1 - taxRate / 100)',
        dependencies: [
          'equityWeight',
          'costOfEquity',
          'debtWeight',
          'costOfDebt',
          'taxRate',
        ],
      },
    ],
    outputs: [
      {
        id: 'wacc',
        label: 'WACC',
        formulaRef: 'wacc',
        format: 'percentage',
        precision: 2,
        highlight: true,
      },
      {
        id: 'equityWeight',
        label: 'Equity Weight',
        formulaRef: 'equityWeight',
        format: 'percentage',
        precision: 2,
      },
      {
        id: 'debtWeight',
        label: 'Debt Weight',
        formulaRef: 'debtWeight',
        format: 'percentage',
        precision: 2,
      },
      {
        id: 'totalCapital',
        label: 'Total Capital',
        formulaRef: 'totalCapital',
        format: 'currency',
        precision: 0,
      },
    ],
    guide: {
      whatIsIt:
        'The Weighted Average Cost of Capital (WACC) represents the blended cost of all capital sources â€” equity and debt â€” weighted by their proportion in the company\'s capital structure. Debt receives a tax benefit because interest payments are tax-deductible. WACC = (E/V) Ã— Re + (D/V) Ã— Rd Ã— (1 âˆ’ T).',
      howToUse:
        'Enter the market values of equity and debt, the cost of equity (often from CAPM), the pre-tax cost of debt, and the corporate tax rate. The calculator computes the weights and the overall WACC.',
      exampleScenario:
        'Equity = $800K, Debt = $200K, Re = 12%, Rd = 6%, Tax = 21%. Total capital = $1M. Equity weight = 80%, Debt weight = 20%. WACC = 0.80 Ã— 12% + 0.20 Ã— 6% Ã— (1 âˆ’ 0.21) = 9.6% + 0.948% = 10.55%.',
      proTip:
        'WACC is the discount rate used in DCF (Discounted Cash Flow) analysis. Using an incorrect WACC can significantly over- or under-value a company. Always use market values, not book values, for the capital weights.',
    },
    metadata: { version: '1.0.0' },
  },
  // â”€â”€â”€ 13. Pivot Point Calculator â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'pivot-point-calculator',
    slug: 'pivot-point-calculator',
    title: 'Pivot Point Calculator',
    description:
      'Calculate classic pivot points and three levels of support and resistance from the prior period\'s high, low, and close.',
    icon: 'ðŸ”„',
    category: 'finance',
    subcategory: 'stocks',
    tags: [
      'pivot point',
      'support',
      'resistance',
      'technical analysis',
      'trading levels',
    ],
    inputs: [
      {
        id: 'high',
        label: 'Previous High',
        type: 'number',
        placeholder: 'e.g. 155.50',
        helpText: 'The highest price in the prior trading period',
        min: 0,
        step: 0.01,
      },
      {
        id: 'low',
        label: 'Previous Low',
        type: 'number',
        placeholder: 'e.g. 148.30',
        helpText: 'The lowest price in the prior trading period',
        min: 0,
        step: 0.01,
      },
      {
        id: 'close',
        label: 'Previous Close',
        type: 'number',
        placeholder: 'e.g. 152.00',
        helpText: 'The closing price of the prior trading period',
        min: 0,
        step: 0.01,
      },
    ],
    formulas: [
      {
        id: 'pivotPoint',
        expression: '(high + low + close) / 3',
        dependencies: ['high', 'low', 'close'],
      },
      {
        id: 'r1',
        expression: '2 * pivotPoint - low',
        dependencies: ['pivotPoint', 'low'],
      },
      {
        id: 's1',
        expression: '2 * pivotPoint - high',
        dependencies: ['pivotPoint', 'high'],
      },
      {
        id: 'r2',
        expression: 'pivotPoint + (high - low)',
        dependencies: ['pivotPoint', 'high', 'low'],
      },
      {
        id: 's2',
        expression: 'pivotPoint - (high - low)',
        dependencies: ['pivotPoint', 'high', 'low'],
      },
      {
        id: 'r3',
        expression: 'high + 2 * (pivotPoint - low)',
        dependencies: ['high', 'pivotPoint', 'low'],
      },
      {
        id: 's3',
        expression: 'low - 2 * (high - pivotPoint)',
        dependencies: ['low', 'high', 'pivotPoint'],
      },
    ],
    outputs: [
      {
        id: 'r3',
        label: 'Resistance 3 (R3)',
        formulaRef: 'r3',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'r2',
        label: 'Resistance 2 (R2)',
        formulaRef: 'r2',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'r1',
        label: 'Resistance 1 (R1)',
        formulaRef: 'r1',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'pivotPoint',
        label: 'Pivot Point (PP)',
        formulaRef: 'pivotPoint',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
      {
        id: 's1',
        label: 'Support 1 (S1)',
        formulaRef: 's1',
        format: 'currency',
        precision: 2,
      },
      {
        id: 's2',
        label: 'Support 2 (S2)',
        formulaRef: 's2',
        format: 'currency',
        precision: 2,
      },
      {
        id: 's3',
        label: 'Support 3 (S3)',
        formulaRef: 's3',
        format: 'currency',
        precision: 2,
      },
    ],
    guide: {
      whatIsIt:
        'Pivot points are technical analysis indicators that use the prior period\'s high, low, and close to calculate a central pivot level and three levels of support (S1â€“S3) and resistance (R1â€“R3). They are widely used by day traders and floor traders to identify potential reversal zones.',
      howToUse:
        'Enter the previous period\'s high, low, and close prices. The calculator computes the pivot point and all six support/resistance levels. These levels serve as potential entry, exit, and stop-loss points.',
      exampleScenario:
        'Previous high = $155.50, low = $148.30, close = $152.00. Pivot = ($155.50 + $148.30 + $152.00) / 3 = $151.93. R1 = 2 Ã— $151.93 âˆ’ $148.30 = $155.57. S1 = 2 Ã— $151.93 âˆ’ $155.50 = $148.37.',
      proTip:
        'Pivot points work best in liquid, range-bound markets. Combine them with volume analysis â€” a break through R1 or S1 on high volume is more significant. Many professional traders use weekly and monthly pivots in addition to daily ones.',
    },
    metadata: { version: '1.0.0' },
  },
  // â”€â”€â”€ 14. Fibonacci Retracement Calculator â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'fibonacci-calculator',
    slug: 'fibonacci-calculator',
    title: 'Fibonacci Retracement Calculator',
    description:
      'Calculate key Fibonacci retracement levels (23.6%, 38.2%, 50%, 61.8%, 78.6%) from a swing high and swing low.',
    icon: 'ðŸš',
    category: 'finance',
    subcategory: 'stocks',
    tags: [
      'fibonacci',
      'retracement',
      'golden ratio',
      'technical analysis',
      'support resistance',
    ],
    inputs: [
      {
        id: 'swingHigh',
        label: 'Swing High',
        type: 'number',
        placeholder: 'e.g. 180.00',
        helpText: 'The highest price in the swing move',
        min: 0,
        step: 0.01,
      },
      {
        id: 'swingLow',
        label: 'Swing Low',
        type: 'number',
        placeholder: 'e.g. 120.00',
        helpText: 'The lowest price in the swing move',
        min: 0,
        step: 0.01,
      },
    ],
    formulas: [
      {
        id: 'range',
        expression: 'swingHigh - swingLow',
        dependencies: ['swingHigh', 'swingLow'],
      },
      {
        id: 'fib236',
        expression: 'swingHigh - range * 0.236',
        dependencies: ['swingHigh', 'range'],
      },
      {
        id: 'fib382',
        expression: 'swingHigh - range * 0.382',
        dependencies: ['swingHigh', 'range'],
      },
      {
        id: 'fib500',
        expression: 'swingHigh - range * 0.5',
        dependencies: ['swingHigh', 'range'],
      },
      {
        id: 'fib618',
        expression: 'swingHigh - range * 0.618',
        dependencies: ['swingHigh', 'range'],
      },
      {
        id: 'fib786',
        expression: 'swingHigh - range * 0.786',
        dependencies: ['swingHigh', 'range'],
      },
    ],
    outputs: [
      {
        id: 'fib236',
        label: '23.6% Retracement',
        formulaRef: 'fib236',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'fib382',
        label: '38.2% Retracement',
        formulaRef: 'fib382',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'fib500',
        label: '50.0% Retracement',
        formulaRef: 'fib500',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
      {
        id: 'fib618',
        label: '61.8% Retracement (Golden Ratio)',
        formulaRef: 'fib618',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
      {
        id: 'fib786',
        label: '78.6% Retracement',
        formulaRef: 'fib786',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'range',
        label: 'Price Range',
        formulaRef: 'range',
        format: 'currency',
        precision: 2,
      },
    ],
    guide: {
      whatIsIt:
        'Fibonacci retracement is a technical analysis tool that uses horizontal lines at the key Fibonacci ratios (23.6%, 38.2%, 50%, 61.8%, and 78.6%) to identify potential support and resistance levels where a price correction might reverse. These ratios are derived from the Fibonacci sequence.',
      howToUse:
        'Identify a significant swing high and swing low on the chart. Enter these values, and the calculator computes the retracement levels. In a downtrend pullback, these levels act as potential resistance; in an uptrend pullback, they act as potential support.',
      exampleScenario:
        'Swing high = $180, swing low = $120, range = $60. The 38.2% retracement = $180 âˆ’ $60 Ã— 0.382 = $157.08. The 61.8% retracement = $180 âˆ’ $60 Ã— 0.618 = $142.92. Traders watch these levels for buying opportunities in an uptrend.',
      proTip:
        'The 61.8% level (golden ratio) and 50% level tend to be the most significant. When a Fibonacci level coincides with another form of support/resistance (moving average, pivot point, prior swing), the "confluence" makes the level much stronger.',
    },
    metadata: { version: '1.0.0' },
  },
  // â”€â”€â”€ 15. Black-Scholes Option Pricing â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'black-scholes-calculator',
    slug: 'black-scholes-calculator',
    title: 'Black-Scholes Option Pricing Calculator',
    description:
      'Price European call and put options using the Black-Scholes-Merton model with the cumulative normal distribution function.',
    icon: 'ðŸŽ²',
    category: 'finance',
    subcategory: 'options',
    tags: [
      'black-scholes',
      'option pricing',
      'call option',
      'put option',
      'volatility',
      'options',
      'derivatives',
    ],
    inputs: [
      {
        id: 'stockPrice',
        label: 'Stock Price (S)',
        type: 'number',
        placeholder: 'e.g. 100',
        helpText: 'Current price of the underlying stock',
        min: 0.01,
        step: 0.01,
      },
      {
        id: 'strikePrice',
        label: 'Strike Price (K)',
        type: 'number',
        placeholder: 'e.g. 105',
        helpText: 'Exercise price of the option',
        min: 0.01,
        step: 0.01,
      },
      {
        id: 'timeToExpiry',
        label: 'Time to Expiry (T)',
        type: 'number',
        placeholder: 'e.g. 0.5',
        helpText: 'Time until expiration in years (e.g. 6 months = 0.5)',
        min: 0.001,
        max: 30,
        step: 0.01,
      },
      {
        id: 'rfRate',
        label: 'Risk-Free Rate (r)',
        type: 'number',
        placeholder: 'e.g. 5',
        helpText: 'Annualized risk-free interest rate',
        min: 0,
        max: 100,
        step: 0.01,
      },
      {
        id: 'vol',
        label: 'Volatility (Ïƒ)',
        type: 'number',
        placeholder: 'e.g. 20',
        helpText: 'Annualized standard deviation of the stock\'s returns',
        min: 0.01,
        max: 500,
        step: 0.1,
      },
    ],
    formulas: [
      // Convert percentages to decimals
      {
        id: 'r',
        expression: 'rfRate / 100',
        dependencies: ['rfRate'],
      },
      {
        id: 'sigma',
        expression: 'vol / 100',
        dependencies: ['vol'],
      },
      // d1 = [ln(S/K) + (r + ÏƒÂ²/2)T] / (ÏƒâˆšT)
      {
        id: 'd1',
        expression:
          '(ln(stockPrice / strikePrice) + (r + sigma * sigma / 2) * timeToExpiry) / (sigma * sqrt(timeToExpiry))',
        dependencies: ['stockPrice', 'strikePrice', 'r', 'sigma', 'timeToExpiry'],
      },
      // d2 = d1 âˆ’ ÏƒâˆšT
      {
        id: 'd2',
        expression: 'd1 - sigma * sqrt(timeToExpiry)',
        dependencies: ['d1', 'sigma', 'timeToExpiry'],
      },
      // Call = SÂ·N(d1) âˆ’ KÂ·e^(âˆ’rT)Â·N(d2)
      {
        id: 'callPrice',
        expression:
          'stockPrice * cdf(d1) - strikePrice * exp(r * -1 * timeToExpiry) * cdf(d2)',
        dependencies: ['stockPrice', 'd1', 'strikePrice', 'r', 'timeToExpiry', 'd2'],
      },
      // Put = KÂ·e^(âˆ’rT)Â·N(âˆ’d2) âˆ’ SÂ·N(âˆ’d1)
      {
        id: 'putPrice',
        expression:
          'strikePrice * exp(r * -1 * timeToExpiry) * cdf(d2 * -1) - stockPrice * cdf(d1 * -1)',
        dependencies: ['strikePrice', 'r', 'timeToExpiry', 'd2', 'stockPrice', 'd1'],
      },
    ],
    outputs: [
      {
        id: 'callPrice',
        label: 'Call Option Price',
        formulaRef: 'callPrice',
        format: 'currency',
        precision: 4,
        highlight: true,
      },
      {
        id: 'putPrice',
        label: 'Put Option Price',
        formulaRef: 'putPrice',
        format: 'currency',
        precision: 4,
        highlight: true,
      },
      {
        id: 'd1',
        label: 'dâ‚',
        formulaRef: 'd1',
        format: 'number',
        precision: 6,
      },
      {
        id: 'd2',
        label: 'dâ‚‚',
        formulaRef: 'd2',
        format: 'number',
        precision: 6,
      },
    ],
    guide: {
      whatIsIt:
        'The Black-Scholes-Merton model is the foundational formula for pricing European-style options. It calculates the fair value of call and put options based on five inputs: stock price (S), strike price (K), time to expiry (T), risk-free rate (r), and volatility (Ïƒ). The model uses the cumulative standard normal distribution N(x) to estimate probabilities of finishing in-the-money.',
      howToUse:
        'Enter the current stock price, the option strike price, time to expiry in years, the risk-free interest rate (%), and the annualized volatility (%). The calculator outputs call and put prices as well as the intermediate dâ‚ and dâ‚‚ values.',
      exampleScenario:
        'S = $100, K = $105, T = 0.5 years, r = 5%, Ïƒ = 20%. r = 0.05, Ïƒ = 0.20. dâ‚ = [ln(100/105) + (0.05 + 0.02)Ã—0.5] / (0.20Ã—âˆš0.5) â‰ˆ âˆ’0.0961. dâ‚‚ = dâ‚ âˆ’ 0.1414 â‰ˆ âˆ’0.2375. Call â‰ˆ $4.21, Put â‰ˆ $6.63.',
      proTip:
        'The model assumes constant volatility and no dividends. For dividend-paying stocks, use the modified Black-Scholes (reduce S by PV of dividends). Implied volatility can be backed out by inputting the market option price and solving for Ïƒ.',
    },
    metadata: { version: '1.0.0' },
  },
];
