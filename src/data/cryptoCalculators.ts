// ---------------------------------------------------------------------------
// Quantify — Cryptocurrency & DeFi Calculators
// ---------------------------------------------------------------------------
// 10 calculators covering mining, DeFi, trading, and crypto conversions.
// DISCLAIMER: All calculators are for educational purposes only.
// Nothing here constitutes financial advice.
// ---------------------------------------------------------------------------

import type { CalculatorSchema } from '@/types/calculator';

export const cryptoCalculators: CalculatorSchema[] = [
  // =========================================================================
  // 11. Crypto Mining Profitability
  // =========================================================================
  {
    id: 'crypto-mining',
    slug: 'crypto-mining',
    title: 'Crypto Mining Profitability Calculator',
    description:
      'Estimate daily and monthly mining profit from hashrate, network difficulty, electricity cost, and coin price. For educational purposes only. Not financial advice.',
    icon: '⛏️',
    category: 'crypto',
    subcategory: 'mining',
    tags: ['mining', 'profitability', 'hashrate', 'electricity', 'bitcoin', 'ethereum', 'gpu mining', 'asic'],
    inputs: [
      {
        id: 'hashrate',
        label: 'Your Hashrate',
        type: 'number',
        defaultValue: 100,
        min: 0,
        step: 1,
        placeholder: 'e.g. 100',
        helpText: 'Your hash rate in the selected unit (e.g. 100 MH/s for a typical GPU)',
        required: true,
      },
      {
        id: 'hashrateUnit',
        label: 'Hashrate Unit',
        type: 'select',
        options: [
          { label: 'KH/s',  value: '0.001'    },
          { label: 'MH/s',  value: '1'        },
          { label: 'GH/s',  value: '1000'     },
          { label: 'TH/s',  value: '1000000'  },
        ],
        defaultValue: '1',
        required: true,
      },
      {
        id: 'networkHashrate',
        label: 'Network Total Hashrate (MH/s)',
        type: 'number',
        defaultValue: 1000000,
        min: 1,
        step: 1,
        placeholder: 'e.g. 1000000',
        helpText: 'Total network hashrate in MH/s. Convert if needed: 1 EH/s = 1,000,000 TH/s = 1e12 MH/s.',
        required: true,
      },
      {
        id: 'blockReward',
        label: 'Block Reward (coins)',
        type: 'number',
        defaultValue: 3.125,
        min: 0,
        step: 0.001,
        placeholder: 'e.g. 3.125',
        helpText: 'Block reward in coins. BTC: 3.125 (post-2024 halving), ETH PoW: 2',
        required: true,
      },
      {
        id: 'blocksPerDay',
        label: 'Blocks Per Day',
        type: 'number',
        defaultValue: 144,
        min: 1,
        step: 1,
        placeholder: 'e.g. 144',
        helpText: 'BTC ≈ 144 (10 min blocks), ETH ≈ 6,500 (12 s blocks)',
        required: true,
      },
      {
        id: 'coinPrice',
        label: 'Coin Price (USD)',
        type: 'number',
        defaultValue: 60000,
        min: 0,
        step: 1,
        placeholder: 'e.g. 60000',
        helpText: 'Current market price per coin in USD. For educational purposes only.',
        required: true,
      },
      {
        id: 'powerWatts',
        label: 'Power Consumption (Watts)',
        type: 'number',
        defaultValue: 3000,
        min: 0,
        step: 10,
        placeholder: 'e.g. 3000',
        required: true,
      },
      {
        id: 'electricityRate',
        label: 'Electricity Rate (USD/kWh)',
        type: 'number',
        defaultValue: 0.10,
        min: 0,
        step: 0.01,
        placeholder: 'e.g. 0.10',
        required: true,
      },
      {
        id: 'poolFeePercent',
        label: 'Pool Fee (%)',
        type: 'number',
        defaultValue: 1,
        min: 0,
        max: 10,
        step: 0.1,
        placeholder: 'e.g. 1',
        helpText: 'Mining pool fee percentage. Typical: 1–2%.',
        required: true,
      },
    ],
    formulas: [
      // Normalise hashrate to MH/s
      { id: 'hashrateNorm',   expression: 'hashrate * hashrateUnit',                                  dependencies: ['hashrate', 'hashrateUnit'] },
      // Coins earned per day = (your hash / network hash) × block reward × blocks per day
      { id: 'dailyCoins',     expression: '(hashrateNorm / networkHashrate) * blockReward * blocksPerDay', dependencies: ['hashrateNorm', 'networkHashrate', 'blockReward', 'blocksPerDay'] },
      { id: 'dailyRevenue',   expression: 'dailyCoins * coinPrice',                                    dependencies: ['dailyCoins', 'coinPrice'] },
      { id: 'poolFeeAmount',  expression: 'dailyRevenue * poolFeePercent / 100',                       dependencies: ['dailyRevenue', 'poolFeePercent'] },
      // Electricity: kWh per day × rate
      { id: 'dailyElec',      expression: '(powerWatts / 1000) * 24 * electricityRate',               dependencies: ['powerWatts', 'electricityRate'] },
      { id: 'dailyProfit',    expression: 'dailyRevenue - poolFeeAmount - dailyElec',                  dependencies: ['dailyRevenue', 'poolFeeAmount', 'dailyElec'] },
      { id: 'monthlyProfit',  expression: 'dailyProfit * 30',                                          dependencies: ['dailyProfit'] },
      // Break-even days: assumes $1000 hardware cost — user adjusts coin price / context
      { id: 'breakEvenDays',  expression: 'dailyProfit > 0 ? 1000 / dailyProfit : 9999',              dependencies: ['dailyProfit'] },
    ],
    outputs: [
      { id: 'out-dailyProfit',   label: 'Daily Profit',            formulaRef: 'dailyProfit',   format: 'currency', precision: 2, highlight: true },
      { id: 'out-monthlyProfit', label: 'Monthly Profit',          formulaRef: 'monthlyProfit', format: 'currency', precision: 2 },
      { id: 'out-dailyRevenue',  label: 'Daily Revenue',           formulaRef: 'dailyRevenue',  format: 'currency', precision: 2 },
      { id: 'out-dailyElec',     label: 'Daily Electricity Cost',  formulaRef: 'dailyElec',     format: 'currency', precision: 2 },
    ],
    guide: {
      whatIsIt:
        'Mining profitability is the net daily income from mining after electricity and pool fees. Revenue = (your hashrate ÷ network hashrate) × block reward × blocks per day × coin price. For educational purposes only — not financial advice.',
      howToUse:
        'Enter your mining rig\'s hashrate and select the unit. Enter the network total hashrate (found on blockchain explorers), block reward, blocks per day, current coin price, power consumption, electricity rate, and pool fee. The calculator returns daily and monthly profit estimates.',
      exampleScenario:
        'A miner with 100 TH/s (normalised to 100,000,000 MH/s) on a network of 500 EH/s (5×10¹⁴ MH/s), 3.125 BTC reward, 144 blocks/day, $60,000 BTC price, 3,000 W, $0.10/kWh, 1% pool fee: daily revenue ≈ $0.32, electricity ≈ $7.20 — not profitable at this scale without much cheaper power.',
      proTip:
        'Electricity cost is the largest variable cost in mining. At $0.05/kWh vs. $0.12/kWh, profitability can swing from comfortable profit to deep loss. Industrial miners in Iceland, Kazakhstan, and Paraguay gain a significant edge purely through electricity access. Always model at least 3 price scenarios (bull, base, bear) before investing in hardware.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 12. Impermanent Loss Calculator
  // =========================================================================
  {
    id: 'impermanent-loss',
    slug: 'impermanent-loss',
    title: 'Impermanent Loss Calculator',
    description:
      'Calculate the impermanent loss of a liquidity pool position when token prices diverge from your entry. For educational purposes only. Not financial advice.',
    icon: '📉',
    category: 'crypto',
    subcategory: 'defi',
    tags: ['impermanent loss', 'AMM', 'liquidity pool', 'defi', 'uniswap', 'yield farming', 'token price'],
    inputs: [
      {
        id: 'initialPrice',
        label: 'Initial Token Price (USD)',
        type: 'number',
        defaultValue: 1000,
        min: 0.000001,
        step: 1,
        placeholder: 'e.g. 1000',
        helpText: 'Price of the volatile token when you added liquidity. Not financial advice.',
        required: true,
      },
      {
        id: 'currentPrice',
        label: 'Current Token Price (USD)',
        type: 'number',
        defaultValue: 2000,
        min: 0.000001,
        step: 1,
        placeholder: 'e.g. 2000',
        helpText: 'Current market price of the volatile token.',
        required: true,
      },
      {
        id: 'liquidityValue',
        label: 'Total Liquidity Deposited (USD)',
        type: 'number',
        defaultValue: 10000,
        min: 1,
        step: 1,
        placeholder: 'e.g. 10000',
        helpText: 'Total USD value at time of deposit (split 50/50 in a standard AMM pool).',
        required: true,
      },
    ],
    formulas: [
      // priceRatio = new / initial
      { id: 'priceRatio', expression: 'currentPrice / initialPrice',                                   dependencies: ['currentPrice', 'initialPrice'] },
      // IL formula: 2*sqrt(k)/(1+k) - 1  where k = priceRatio
      { id: 'il_factor',  expression: '(2 * sqrt(priceRatio) / (1 + priceRatio)) - 1',                 dependencies: ['priceRatio'] },
      { id: 'ilPercent',  expression: 'il_factor * 100',                                               dependencies: ['il_factor'] },
      // HODL value: started 50/50, so (initial + current) / 2 × initial deposit ratio
      { id: 'holdValue',  expression: 'liquidityValue * (1 + priceRatio) / 2',                         dependencies: ['liquidityValue', 'priceRatio'] },
      // LP position value after rebalancing
      { id: 'lpValue',    expression: 'liquidityValue * (2 * sqrt(priceRatio) / (1 + priceRatio))',    dependencies: ['liquidityValue', 'priceRatio'] },
      { id: 'ilDollar',   expression: 'holdValue - lpValue',                                           dependencies: ['holdValue', 'lpValue'] },
    ],
    outputs: [
      { id: 'out-ilPercent', label: 'Impermanent Loss',    formulaRef: 'ilPercent', format: 'number',   precision: 2, suffix: '%', highlight: true },
      { id: 'out-ilDollar',  label: 'IL in USD',           formulaRef: 'ilDollar',  format: 'currency', precision: 2 },
      { id: 'out-lpValue',   label: 'LP Position Value',   formulaRef: 'lpValue',   format: 'currency', precision: 2 },
      { id: 'out-holdValue', label: 'HODL Value',          formulaRef: 'holdValue', format: 'currency', precision: 2 },
    ],
    guide: {
      whatIsIt:
        'Impermanent loss (IL) is the difference in value between holding tokens versus providing them as liquidity in an AMM pool. When token prices change, arbitrageurs rebalance the pool, leaving LP providers with less of the appreciating asset. IL = 2√k/(1+k) − 1 where k is the price ratio. For educational purposes only — not financial advice.',
      howToUse:
        'Enter the token price when you added liquidity, the current price, and the total USD value deposited. The calculator shows the percentage impermanent loss, the dollar loss versus holding, the current LP position value, and what you would have had if you had simply held the tokens.',
      exampleScenario:
        'Adding $10,000 to ETH/USDC when ETH = $1,000. ETH doubles to $2,000 (price ratio = 2). IL = 2×√2/(1+2) − 1 ≈ −5.72%. LP value = $9,428; HODL value = $15,000 (50% ETH + 50% USDC appreciates with ETH). The LP missed out on $5,572 in gains.',
      proTip:
        'IL is "impermanent" because if prices return to your entry point, IL disappears. However, if you exit while prices are diverged, the loss becomes permanent. Strategies to mitigate IL include: concentrated liquidity positions in narrow price ranges (Uniswap v3), stable/stable pairs (near-zero IL), and ensuring trading fee income exceeds the IL rate over time.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 13. Liquidation Price Calculator
  // =========================================================================
  {
    id: 'liquidation-price',
    slug: 'liquidation-price',
    title: 'Crypto Liquidation Price Calculator',
    description:
      'Calculate the price at which a leveraged long or short position will be liquidated. For educational purposes only. Not financial advice.',
    icon: '🚨',
    category: 'crypto',
    subcategory: 'trading',
    tags: ['liquidation', 'leverage', 'margin', 'futures', 'perp', 'long', 'short', 'trading', 'risk'],
    inputs: [
      {
        id: 'entryPrice',
        label: 'Entry Price (USD)',
        type: 'number',
        defaultValue: 50000,
        min: 0.01,
        step: 1,
        placeholder: 'e.g. 50000',
        helpText: 'Price at which you opened the leveraged position. Not financial advice.',
        required: true,
      },
      {
        id: 'leverage',
        label: 'Leverage (×)',
        type: 'number',
        defaultValue: 10,
        min: 1,
        max: 125,
        step: 1,
        placeholder: 'e.g. 10',
        helpText: 'Leverage multiplier. Higher leverage = liquidation price closer to entry.',
        required: true,
      },
      {
        id: 'positionType',
        label: 'Position Type',
        type: 'select',
        options: [
          { label: 'Long (Buy)',  value: '1'  },
          { label: 'Short (Sell)',value: '-1' },
        ],
        defaultValue: '1',
        required: true,
      },
      {
        id: 'maintenanceMargin',
        label: 'Maintenance Margin (%)',
        type: 'number',
        defaultValue: 0.5,
        min: 0,
        max: 10,
        step: 0.1,
        placeholder: 'e.g. 0.5',
        helpText: 'Typically 0.5% on major exchanges. Check your exchange documentation.',
        required: true,
      },
    ],
    formulas: [
      { id: 'mmDecimal',        expression: 'maintenanceMargin / 100',                                        dependencies: ['maintenanceMargin'] },
      // Long liquidation: entry × (1 - 1/leverage + maintenance margin)
      { id: 'liqLong',          expression: 'entryPrice * (1 - 1 / leverage + mmDecimal)',                    dependencies: ['entryPrice', 'leverage', 'mmDecimal'] },
      // Short liquidation: entry × (1 + 1/leverage - maintenance margin)
      { id: 'liqShort',         expression: 'entryPrice * (1 + 1 / leverage - mmDecimal)',                    dependencies: ['entryPrice', 'leverage', 'mmDecimal'] },
      // Select based on positionType (1 = long, -1 = short)
      { id: 'liquidationPrice', expression: 'positionType == 1 ? liqLong : liqShort',                        dependencies: ['positionType', 'liqLong', 'liqShort'] },
      { id: 'distPercent',      expression: 'abs((liquidationPrice - entryPrice) / entryPrice) * 100',       dependencies: ['liquidationPrice', 'entryPrice'] },
    ],
    outputs: [
      { id: 'out-liquidationPrice', label: 'Liquidation Price',         formulaRef: 'liquidationPrice', format: 'currency', precision: 2, highlight: true },
      { id: 'out-distPercent',      label: 'Distance to Liquidation',   formulaRef: 'distPercent',      format: 'number',   precision: 2, suffix: '%' },
    ],
    guide: {
      whatIsIt:
        'On leveraged futures and perpetual swap platforms, your position is automatically closed (liquidated) when losses consume your margin. For a long: Liq = Entry × (1 − 1/leverage + maintenance margin). For a short: Liq = Entry × (1 + 1/leverage − maintenance margin). For educational purposes only — not financial advice.',
      howToUse:
        'Enter your entry price, leverage multiple, whether you are long or short, and the exchange maintenance margin rate. The liquidation price and percentage distance from entry are calculated instantly. Use this BEFORE opening a position to understand your risk.',
      exampleScenario:
        'BTC long at $50,000 with 10× leverage and 0.5% maintenance margin: Liq = $50,000 × (1 − 0.1 + 0.005) = $45,250. A 9.5% drop liquidates the position. At 20× leverage: Liq = $47,750 — only a 4.5% drop needed.',
      proTip:
        'Most professional traders use less than 5× leverage and set stop-losses well above the liquidation price. Partial liquidations cascade — as your margin ratio deteriorates, exchanges often add extra fees. Never risk more than 1–2% of your account per trade. Liquidation prices are estimates — partial fills, funding rates, and slippage affect the real level.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 14. Dollar Cost Averaging (DCA) Crypto Calculator
  // =========================================================================
  {
    id: 'crypto-dca',
    slug: 'crypto-dca',
    title: 'Crypto DCA (Dollar Cost Averaging) Calculator',
    description:
      'Calculate total coins accumulated, portfolio value, and ROI for a dollar cost averaging crypto investment strategy. For educational purposes only. Not financial advice.',
    icon: '📊',
    category: 'crypto',
    subcategory: 'trading',
    tags: ['dca', 'dollar cost averaging', 'bitcoin', 'investment', 'accumulation', 'strategy', 'roi'],
    inputs: [
      {
        id: 'investmentAmount',
        label: 'Investment Amount per Period (USD)',
        type: 'number',
        defaultValue: 100,
        min: 1,
        step: 1,
        placeholder: 'e.g. 100',
        helpText: 'Amount invested each period (weekly, monthly, etc.). Not financial advice.',
        required: true,
      },
      {
        id: 'numPeriods',
        label: 'Number of Periods',
        type: 'number',
        defaultValue: 12,
        min: 1,
        max: 120,
        step: 1,
        placeholder: 'e.g. 12',
        helpText: 'Total number of purchase periods',
        required: true,
      },
      {
        id: 'avgBuyPrice',
        label: 'Average Buy Price (USD)',
        type: 'number',
        defaultValue: 40000,
        min: 0.000001,
        step: 1,
        placeholder: 'e.g. 40000',
        helpText: 'Simple average of all entry prices across your DCA purchases.',
        required: true,
      },
      {
        id: 'currentPrice',
        label: 'Current Coin Price (USD)',
        type: 'number',
        defaultValue: 60000,
        min: 0.000001,
        step: 1,
        placeholder: 'e.g. 60000',
        helpText: 'Current market price of the coin. Not financial advice.',
        required: true,
      },
    ],
    formulas: [
      { id: 'totalInvested', expression: 'investmentAmount * numPeriods',               dependencies: ['investmentAmount', 'numPeriods'] },
      { id: 'totalCoins',    expression: 'totalInvested / avgBuyPrice',                 dependencies: ['totalInvested', 'avgBuyPrice'] },
      { id: 'currentValue',  expression: 'totalCoins * currentPrice',                   dependencies: ['totalCoins', 'currentPrice'] },
      { id: 'profitLoss',    expression: 'currentValue - totalInvested',                dependencies: ['currentValue', 'totalInvested'] },
      { id: 'roiPercent',    expression: '(profitLoss / totalInvested) * 100',          dependencies: ['profitLoss', 'totalInvested'] },
    ],
    outputs: [
      { id: 'out-totalCoins',    label: 'Total Coins Accumulated', formulaRef: 'totalCoins',    format: 'number',   precision: 6, highlight: true },
      { id: 'out-currentValue',  label: 'Current Portfolio Value', formulaRef: 'currentValue',  format: 'currency', precision: 2 },
      { id: 'out-profitLoss',    label: 'Profit / Loss',           formulaRef: 'profitLoss',    format: 'currency', precision: 2 },
      { id: 'out-roiPercent',    label: 'Return on Investment',    formulaRef: 'roiPercent',    format: 'number',   precision: 2, suffix: '%' },
      { id: 'out-totalInvested', label: 'Total Invested',          formulaRef: 'totalInvested', format: 'currency', precision: 2 },
    ],
    guide: {
      whatIsIt:
        'Dollar Cost Averaging (DCA) is the strategy of investing a fixed dollar amount at regular intervals regardless of price. Over time, you buy more coins when prices are low and fewer when prices are high, resulting in an average purchase price lower than the peak. For educational purposes only — not financial advice.',
      howToUse:
        'Enter the fixed amount you invest each period, the total number of periods, your average entry price (sum of prices / number of purchases), and the current market price. The calculator shows total coins held, current value, and your profit/loss.',
      exampleScenario:
        'Investing $100/month for 12 months (total $1,200) with an average buy price of $40,000: total BTC = 0.03 BTC. If current price is $60,000, portfolio value = $1,800. Profit = $600, ROI = 50%.',
      proTip:
        'DCA removes the emotional burden of timing the market. Studies on assets with long-term upward trends show DCA outperforms lump-sum investing in volatile markets. Set up automatic recurring purchases on an exchange to remove decision fatigue entirely. The key metric is average buy price vs. current price — not individual purchase timing.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 15. Staking Rewards Calculator
  // =========================================================================
  {
    id: 'staking-rewards',
    slug: 'staking-rewards',
    title: 'Crypto Staking Rewards Calculator',
    description:
      'Calculate effective APY, total earnings, and final value for a staking position with compound interest. For educational purposes only. Not financial advice.',
    icon: '🏦',
    category: 'crypto',
    subcategory: 'defi',
    tags: ['staking', 'apy', 'apr', 'compound interest', 'defi', 'yield', 'ethereum', 'proof of stake'],
    inputs: [
      {
        id: 'stakedAmount',
        label: 'Staked Amount (USD value)',
        type: 'number',
        defaultValue: 10000,
        min: 1,
        step: 1,
        placeholder: 'e.g. 10000',
        helpText: 'Total USD value of tokens staked. Not financial advice.',
        required: true,
      },
      {
        id: 'aprPercent',
        label: 'Annual Percentage Rate (%)',
        type: 'number',
        defaultValue: 8,
        min: 0.01,
        max: 1000,
        step: 0.1,
        placeholder: 'e.g. 8',
        helpText: 'APR from the staking protocol or validator. Ethereum staking ≈ 3–5%, DeFi can be 10–100%+.',
        required: true,
      },
      {
        id: 'compoundingFreq',
        label: 'Compounding Frequency',
        type: 'select',
        options: [
          { label: 'Daily (365×)',     value: '365' },
          { label: 'Weekly (52×)',     value: '52'  },
          { label: 'Monthly (12×)',    value: '12'  },
          { label: 'Quarterly (4×)',   value: '4'   },
          { label: 'Yearly (1×)',      value: '1'   },
        ],
        defaultValue: '365',
        required: true,
      },
      {
        id: 'stakingPeriodDays',
        label: 'Staking Period (days)',
        type: 'number',
        defaultValue: 365,
        min: 1,
        step: 1,
        placeholder: 'e.g. 365',
        required: true,
      },
    ],
    formulas: [
      { id: 'aprDecimal',   expression: 'aprPercent / 100',                                                                         dependencies: ['aprPercent'] },
      // APY = (1 + APR/n)^n - 1
      { id: 'apy',          expression: 'pow(1 + aprDecimal / compoundingFreq, compoundingFreq) - 1',                               dependencies: ['aprDecimal', 'compoundingFreq'] },
      { id: 'apyPercent',   expression: 'apy * 100',                                                                                dependencies: ['apy'] },
      { id: 'periodYears',  expression: 'stakingPeriodDays / 365',                                                                  dependencies: ['stakingPeriodDays'] },
      // Final value with compound interest over the staking period
      { id: 'finalValue',   expression: 'stakedAmount * pow(1 + aprDecimal / compoundingFreq, compoundingFreq * periodYears)',      dependencies: ['stakedAmount', 'aprDecimal', 'compoundingFreq', 'periodYears'] },
      { id: 'earnings',     expression: 'finalValue - stakedAmount',                                                                dependencies: ['finalValue', 'stakedAmount'] },
      { id: 'dailyEarnings',expression: 'earnings / stakingPeriodDays',                                                             dependencies: ['earnings', 'stakingPeriodDays'] },
    ],
    outputs: [
      { id: 'out-apyPercent',   label: 'Effective APY',     formulaRef: 'apyPercent',   format: 'number',   precision: 2, suffix: '%', highlight: true },
      { id: 'out-earnings',     label: 'Total Earnings',    formulaRef: 'earnings',     format: 'currency', precision: 2 },
      { id: 'out-finalValue',   label: 'Final Value',       formulaRef: 'finalValue',   format: 'currency', precision: 2 },
      { id: 'out-dailyEarnings',label: 'Daily Earnings',    formulaRef: 'dailyEarnings',format: 'currency', precision: 4 },
    ],
    guide: {
      whatIsIt:
        'Staking locks crypto assets in a proof-of-stake protocol to validate transactions and earn rewards. APR (Annual Percentage Rate) is the raw rate; APY (Annual Percentage Yield) accounts for compounding and is always higher. Formula: APY = (1 + APR/n)^n − 1 where n = compounding periods per year. For educational purposes only — not financial advice.',
      howToUse:
        'Enter the USD value of tokens staked, the protocol APR, how frequently rewards are compounded (or claimed and restaked), and the staking period in days. The calculator outputs effective APY, total earnings, and final portfolio value.',
      exampleScenario:
        'Staking $10,000 at 8% APR compounded daily for 365 days: APY = (1 + 0.08/365)^365 − 1 ≈ 8.33%. Earnings ≈ $833 over the year. If compounded monthly instead, APY drops slightly to ≈ 8.30% — daily compounding makes a small but real difference over time.',
      proTip:
        'Smart contract risk is the hidden variable staking calculators cannot quantify. A 20% APY on a new DeFi protocol carries far more risk than 4% on ETH mainnet staking. Always research the protocol\'s audit history, total value locked trend, and tokenomics before staking. Token price depreciation can easily outpace staking rewards.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 16. Ethereum Gas Fee Calculator
  // =========================================================================
  {
    id: 'eth-gas-fee',
    slug: 'eth-gas-fee',
    title: 'Ethereum Gas Fee Calculator',
    description:
      'Calculate the ETH and USD cost of an Ethereum transaction from gas limit and gas price. For educational purposes only. Not financial advice.',
    icon: '⛽',
    category: 'crypto',
    subcategory: 'mining',
    tags: ['gas fee', 'ethereum', 'gwei', 'eip-1559', 'transaction fee', 'smart contract', 'eth'],
    inputs: [
      {
        id: 'gasLimit',
        label: 'Gas Limit (units)',
        type: 'number',
        defaultValue: 21000,
        min: 21000,
        step: 1000,
        placeholder: 'e.g. 21000',
        helpText: 'Simple transfer = 21,000 · ERC-20 transfer ≈ 65,000 · Uniswap swap ≈ 150,000',
        required: true,
      },
      {
        id: 'gasPrice',
        label: 'Gas Price (Gwei)',
        type: 'number',
        defaultValue: 30,
        min: 1,
        step: 1,
        placeholder: 'e.g. 30',
        helpText: 'Base fee + priority tip in Gwei. Check Etherscan Gas Tracker for current levels.',
        required: true,
      },
      {
        id: 'ethPrice',
        label: 'ETH Price (USD)',
        type: 'number',
        defaultValue: 3000,
        min: 1,
        step: 1,
        placeholder: 'e.g. 3000',
        helpText: 'Current ETH price in USD. For educational purposes only.',
        required: true,
      },
    ],
    formulas: [
      // 1 Gwei = 1e-9 ETH → Fee(ETH) = gasLimit × gasPrice / 1,000,000,000
      { id: 'feeEth',  expression: 'gasLimit * gasPrice / 1000000000',    dependencies: ['gasLimit', 'gasPrice'] },
      { id: 'feeUsd',  expression: 'feeEth * ethPrice',                   dependencies: ['feeEth', 'ethPrice'] },
      { id: 'feeGwei', expression: 'gasLimit * gasPrice',                 dependencies: ['gasLimit', 'gasPrice'] },
    ],
    outputs: [
      { id: 'out-feeUsd',  label: 'Gas Fee (USD)', formulaRef: 'feeUsd',  format: 'currency', precision: 4, highlight: true },
      { id: 'out-feeEth',  label: 'Gas Fee (ETH)', formulaRef: 'feeEth',  format: 'number',   precision: 8, suffix: ' ETH' },
      { id: 'out-feeGwei', label: 'Total Gas (Gwei)',formulaRef: 'feeGwei',format: 'number',   precision: 0 },
    ],
    guide: {
      whatIsIt:
        'Ethereum gas fees are the cost to execute transactions on the network. Fee (ETH) = Gas Limit × Gas Price (Gwei) ÷ 1,000,000,000. Since EIP-1559, the fee structure has a base fee (burned) plus a priority tip (to validator). Gas Limit is set by the transaction type; Gas Price fluctuates with network demand. For educational purposes only — not financial advice.',
      howToUse:
        'Enter the gas limit for your transaction type, the current gas price in Gwei (check Etherscan Gas Tracker), and the current ETH price. The calculator shows the fee in both ETH and USD.',
      exampleScenario:
        'A simple ETH transfer (21,000 gas) at 30 Gwei with ETH at $3,000: Fee = 21,000 × 30 / 1e9 = 0.00063 ETH = $1.89. A Uniswap v3 swap (150,000 gas) at the same price: $13.50. During network congestion at 100 Gwei, the swap costs $45.',
      proTip:
        'Gas prices follow a predictable daily pattern — lowest on weekend mornings (UTC) and highest on weekday afternoons when US/EU markets overlap. Use layer-2 networks (Arbitrum, Optimism, Base, zkSync) for small transactions — the same swap costs $0.05–0.20 on L2 vs. $10–50 on mainnet. Gas tokens and transaction batching further reduce costs for power users.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 17. Satoshi to Fiat Converter
  // =========================================================================
  {
    id: 'satoshi-converter',
    slug: 'satoshi-converter',
    title: 'Satoshi to Fiat Converter',
    description:
      'Convert between Satoshis, mBTC, bits, BTC, and USD. 1 BTC = 100,000,000 satoshis. For educational purposes only. Not financial advice.',
    icon: '₿',
    category: 'crypto',
    subcategory: 'mining',
    tags: ['satoshi', 'bitcoin', 'btc', 'mbtc', 'bits', 'conversion', 'fiat', 'usd'],
    inputs: [
      {
        id: 'satoshis',
        label: 'Satoshis',
        type: 'number',
        defaultValue: 100000,
        min: 1,
        step: 1,
        placeholder: 'e.g. 100000',
        helpText: '1 BTC = 100,000,000 satoshis. The satoshi is the smallest unit of bitcoin.',
        required: true,
      },
      {
        id: 'btcPrice',
        label: 'BTC Price (USD)',
        type: 'number',
        defaultValue: 60000,
        min: 1,
        step: 1,
        placeholder: 'e.g. 60000',
        helpText: 'Current BTC price in USD. For educational purposes only.',
        required: true,
      },
    ],
    formulas: [
      { id: 'btcAmount', expression: 'satoshis / 100000000',  dependencies: ['satoshis'] },
      { id: 'usdValue',  expression: 'btcAmount * btcPrice',  dependencies: ['btcAmount', 'btcPrice'] },
      { id: 'mbtc',      expression: 'satoshis / 100000',     dependencies: ['satoshis'] },
      { id: 'bits',      expression: 'satoshis / 100',        dependencies: ['satoshis'] },
    ],
    outputs: [
      { id: 'out-usdValue',  label: 'USD Value',             formulaRef: 'usdValue',  format: 'currency', precision: 4, highlight: true },
      { id: 'out-btcAmount', label: 'BTC Amount',            formulaRef: 'btcAmount', format: 'number',   precision: 8, suffix: ' BTC' },
      { id: 'out-mbtc',      label: 'mBTC (millibitcoin)',   formulaRef: 'mbtc',      format: 'number',   precision: 5, suffix: ' mBTC' },
      { id: 'out-bits',      label: 'Bits (μBTC)',           formulaRef: 'bits',      format: 'number',   precision: 2, suffix: ' bits' },
    ],
    guide: {
      whatIsIt:
        'Bitcoin uses a hierarchical unit system. 1 BTC = 1,000 mBTC (millibitcoin) = 1,000,000 bits (microbitcoin / μBTC) = 100,000,000 satoshis. The satoshi is the smallest indivisible unit. The Lightning Network routes payments in millisatoshis (1/1000 of a satoshi) for micro-transactions. For educational purposes only — not financial advice.',
      howToUse:
        'Enter the number of satoshis and the current BTC price. The calculator converts to BTC, mBTC, bits, and USD simultaneously. Useful for understanding Lightning Network invoices, on-chain dust limits, and micro-payment amounts.',
      exampleScenario:
        '100,000 satoshis = 0.001 BTC = 1 mBTC = 1,000 bits. At $60,000/BTC, this equals $60.00. The Bitcoin dust limit is 546 satoshis (≈ $0.33 at $60k) — outputs below this are uneconomical to spend due to fees exceeding value.',
      proTip:
        'When quoting Bitcoin prices in satoshis per dollar (sats/dollar), divide 100,000,000 by the BTC price. At $60,000/BTC: 100M/60,000 ≈ 1,667 sats per dollar. During the 2017 peak ($20,000): 5,000 sats/dollar. The concept of "stacking sats" refers to accumulating satoshis through DCA, Lightning payments, and round-up purchases.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 18. Crypto Arbitrage Calculator
  // =========================================================================
  {
    id: 'crypto-arbitrage',
    slug: 'crypto-arbitrage',
    title: 'Crypto Arbitrage Calculator',
    description:
      'Calculate net profit from buying on one exchange and selling on another after accounting for trading fees and transfer costs. For educational purposes only. Not financial advice.',
    icon: '↔️',
    category: 'crypto',
    subcategory: 'trading',
    tags: ['arbitrage', 'trading', 'spread', 'profit', 'exchange', 'fees', 'market inefficiency'],
    inputs: [
      {
        id: 'buyPrice',
        label: 'Buy Price (USD)',
        type: 'number',
        defaultValue: 60000,
        min: 0.01,
        step: 1,
        placeholder: 'e.g. 60000',
        helpText: 'Price on the exchange where you buy. Not financial advice.',
        required: true,
      },
      {
        id: 'sellPrice',
        label: 'Sell Price (USD)',
        type: 'number',
        defaultValue: 60500,
        min: 0.01,
        step: 1,
        placeholder: 'e.g. 60500',
        required: true,
      },
      {
        id: 'quantity',
        label: 'Quantity (coins)',
        type: 'number',
        defaultValue: 1,
        min: 0.00001,
        step: 0.001,
        placeholder: 'e.g. 1',
        required: true,
      },
      {
        id: 'buyFeePercent',
        label: 'Buy Exchange Fee (%)',
        type: 'number',
        defaultValue: 0.1,
        min: 0,
        max: 5,
        step: 0.01,
        placeholder: 'e.g. 0.1',
        helpText: 'Typical maker/taker fee 0.05–0.1%',
        required: true,
      },
      {
        id: 'sellFeePercent',
        label: 'Sell Exchange Fee (%)',
        type: 'number',
        defaultValue: 0.1,
        min: 0,
        max: 5,
        step: 0.01,
        placeholder: 'e.g. 0.1',
        required: true,
      },
      {
        id: 'transferFee',
        label: 'Transfer / Network Fee (USD)',
        type: 'number',
        defaultValue: 5,
        min: 0,
        step: 0.5,
        placeholder: 'e.g. 5',
        helpText: 'On-chain withdrawal fee in USD equivalent',
        required: true,
      },
    ],
    formulas: [
      { id: 'totalCost',    expression: 'buyPrice * quantity * (1 + buyFeePercent / 100)',             dependencies: ['buyPrice', 'quantity', 'buyFeePercent'] },
      { id: 'totalRevenue', expression: 'sellPrice * quantity * (1 - sellFeePercent / 100)',           dependencies: ['sellPrice', 'quantity', 'sellFeePercent'] },
      { id: 'grossProfit',  expression: 'sellPrice * quantity - buyPrice * quantity',                  dependencies: ['sellPrice', 'quantity', 'buyPrice'] },
      { id: 'totalFees',    expression: 'buyPrice * quantity * buyFeePercent / 100 + sellPrice * quantity * sellFeePercent / 100 + transferFee', dependencies: ['buyPrice', 'quantity', 'buyFeePercent', 'sellPrice', 'sellFeePercent', 'transferFee'] },
      { id: 'netProfit',    expression: 'totalRevenue - totalCost - transferFee',                      dependencies: ['totalRevenue', 'totalCost', 'transferFee'] },
      { id: 'profitPercent',expression: '(netProfit / totalCost) * 100',                              dependencies: ['netProfit', 'totalCost'] },
    ],
    outputs: [
      { id: 'out-netProfit',    label: 'Net Arbitrage Profit', formulaRef: 'netProfit',    format: 'currency', precision: 2, highlight: true },
      { id: 'out-profitPercent',label: 'Profit %',             formulaRef: 'profitPercent',format: 'number',   precision: 3, suffix: '%' },
      { id: 'out-grossProfit',  label: 'Gross Profit',         formulaRef: 'grossProfit',  format: 'currency', precision: 2 },
      { id: 'out-totalFees',    label: 'Total Fees',           formulaRef: 'totalFees',    format: 'currency', precision: 2 },
    ],
    guide: {
      whatIsIt:
        'Crypto arbitrage exploits price differences for the same asset across exchanges. Net profit = sell revenue − buy cost − trading fees − transfer fees. Spreads are typically 0.1–0.5% on liquid assets; the math must show profit AFTER all fees to be viable. For educational purposes only — not financial advice.',
      howToUse:
        'Enter the buy and sell prices, quantity, individual exchange fees, and the transfer/network fee to move coins between exchanges. The calculator shows gross and net profit and profit percentage.',
      exampleScenario:
        'Buying 1 BTC at $60,000 and selling at $60,500 (0.83% spread). With 0.1% buy fee ($60), 0.1% sell fee ($60.50), and $5 transfer fee: net profit = $60,500 × 0.999 − $60,000 × 1.001 − $5 = $60,439.50 − $60,060 − $5 = $374.50.',
      proTip:
        'Execution speed is critical — by the time you transfer coins between exchanges, the spread may have closed or reversed. Successful arbitrageurs pre-fund both exchanges and trade simultaneously, or use triangular arbitrage within a single exchange to eliminate transfer delays. CEX API arbitrage bots execute in milliseconds; manual arbitrage rarely captures meaningful spreads.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 19. Position Size Calculator
  // =========================================================================
  {
    id: 'position-size',
    slug: 'position-size',
    title: 'Crypto Position Size Calculator',
    description:
      'Calculate the optimal position size in coins and USD based on account size, risk percentage, and stop-loss distance. For educational purposes only. Not financial advice.',
    icon: '⚖️',
    category: 'crypto',
    subcategory: 'trading',
    tags: ['position size', 'risk management', 'stop loss', 'trading', 'kelly criterion', 'portfolio'],
    inputs: [
      {
        id: 'accountSize',
        label: 'Account Size (USD)',
        type: 'number',
        defaultValue: 10000,
        min: 1,
        step: 100,
        placeholder: 'e.g. 10000',
        helpText: 'Total trading account value in USD. Not financial advice.',
        required: true,
      },
      {
        id: 'riskPercent',
        label: 'Risk per Trade (%)',
        type: 'number',
        defaultValue: 1,
        min: 0.1,
        max: 100,
        step: 0.1,
        placeholder: 'e.g. 1',
        helpText: 'Recommended: 1–2% per trade maximum. Professional traders rarely exceed 2%.',
        required: true,
      },
      {
        id: 'entryPrice',
        label: 'Entry Price (USD)',
        type: 'number',
        defaultValue: 50000,
        min: 0.01,
        step: 1,
        placeholder: 'e.g. 50000',
        required: true,
      },
      {
        id: 'stopLoss',
        label: 'Stop-Loss Price (USD)',
        type: 'number',
        defaultValue: 48000,
        min: 0.01,
        step: 1,
        placeholder: 'e.g. 48000',
        helpText: 'Price at which you will exit if the trade moves against you.',
        required: true,
      },
    ],
    formulas: [
      // Dollar amount to risk
      { id: 'riskAmount',      expression: 'accountSize * riskPercent / 100',         dependencies: ['accountSize', 'riskPercent'] },
      // Price distance to stop loss
      { id: 'priceDiff',       expression: 'abs(entryPrice - stopLoss)',               dependencies: ['entryPrice', 'stopLoss'] },
      // Position size in coins = risk amount / price distance
      { id: 'positionCoins',   expression: 'riskAmount / priceDiff',                  dependencies: ['riskAmount', 'priceDiff'] },
      { id: 'positionUsd',     expression: 'positionCoins * entryPrice',              dependencies: ['positionCoins', 'entryPrice'] },
      { id: 'positionPercent', expression: '(positionUsd / accountSize) * 100',       dependencies: ['positionUsd', 'accountSize'] },
      { id: 'leverageNeeded',  expression: 'positionUsd / accountSize',               dependencies: ['positionUsd', 'accountSize'] },
    ],
    outputs: [
      { id: 'out-positionCoins',   label: 'Position Size (Coins)', formulaRef: 'positionCoins',   format: 'number',   precision: 6, highlight: true },
      { id: 'out-positionUsd',     label: 'Position Size (USD)',   formulaRef: 'positionUsd',     format: 'currency', precision: 2 },
      { id: 'out-riskAmount',      label: 'Risk Amount',           formulaRef: 'riskAmount',      format: 'currency', precision: 2 },
      { id: 'out-leverageNeeded',  label: 'Leverage Needed',       formulaRef: 'leverageNeeded',  format: 'number',   precision: 2, suffix: '×' },
    ],
    guide: {
      whatIsIt:
        'Position sizing is the most important risk management tool in trading. Position Size (coins) = (Account × Risk%) ÷ |Entry Price − Stop Loss|. This ensures that if your stop-loss triggers, you lose exactly your predetermined risk percentage — no more. For educational purposes only — not financial advice.',
      howToUse:
        'Enter your account size, the maximum percentage you are willing to lose on this trade (1–2% recommended), your planned entry price, and your stop-loss level. The calculator returns the correct position size in coins, USD value, and the leverage required.',
      exampleScenario:
        'Account: $10,000. Risk: 1% ($100). Entry: $50,000 BTC. Stop-loss: $48,000 ($2,000 distance). Position = $100 / $2,000 = 0.05 BTC = $2,500 USD. Leverage = $2,500 / $10,000 = 0.25× (spot position, no leverage needed).',
      proTip:
        'If leverage needed exceeds 1× for a 1% risk trade, you may be placing your stop-loss too close to entry relative to account size. Widen your stop (then reduce position size) rather than adding leverage to meet your target. Professional traders focus on R-multiples: a 3R trade means profit target is 3× the risk amount.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 20. Risk / Reward Ratio Calculator
  // =========================================================================
  {
    id: 'risk-reward-ratio',
    slug: 'risk-reward-ratio',
    title: 'Risk / Reward Ratio Calculator',
    description:
      'Calculate the risk/reward ratio, minimum win rate to break even, and percentage risk/reward for a trade setup. For educational purposes only. Not financial advice.',
    icon: '🎯',
    category: 'crypto',
    subcategory: 'trading',
    tags: ['risk reward', 'r/r ratio', 'take profit', 'stop loss', 'win rate', 'expected value', 'trading'],
    inputs: [
      {
        id: 'entryPrice',
        label: 'Entry Price (USD)',
        type: 'number',
        defaultValue: 50000,
        min: 0.01,
        step: 1,
        placeholder: 'e.g. 50000',
        helpText: 'Price at which you enter the trade. Not financial advice.',
        required: true,
      },
      {
        id: 'stopLoss',
        label: 'Stop-Loss Price (USD)',
        type: 'number',
        defaultValue: 48500,
        min: 0.01,
        step: 1,
        placeholder: 'e.g. 48500',
        helpText: 'Your exit price if the trade goes against you.',
        required: true,
      },
      {
        id: 'takeProfit',
        label: 'Take-Profit Price (USD)',
        type: 'number',
        defaultValue: 55000,
        min: 0.01,
        step: 1,
        placeholder: 'e.g. 55000',
        helpText: 'Your target price to close the trade in profit.',
        required: true,
      },
    ],
    formulas: [
      { id: 'risk',          expression: 'abs(entryPrice - stopLoss)',                       dependencies: ['entryPrice', 'stopLoss'] },
      { id: 'reward',        expression: 'abs(takeProfit - entryPrice)',                     dependencies: ['takeProfit', 'entryPrice'] },
      { id: 'rrRatio',       expression: 'reward / risk',                                   dependencies: ['reward', 'risk'] },
      { id: 'riskPercent',   expression: '(risk / entryPrice) * 100',                       dependencies: ['risk', 'entryPrice'] },
      { id: 'rewardPercent', expression: '(reward / entryPrice) * 100',                     dependencies: ['reward', 'entryPrice'] },
      // Break-even win rate: W = 1 / (1 + RR)
      { id: 'minWinRate',    expression: '1 / (1 + rrRatio) * 100',                         dependencies: ['rrRatio'] },
    ],
    outputs: [
      { id: 'out-rrRatio',       label: 'Risk / Reward Ratio',            formulaRef: 'rrRatio',       format: 'number', precision: 2, suffix: ':1', highlight: true },
      { id: 'out-minWinRate',    label: 'Min Win Rate to Break Even',     formulaRef: 'minWinRate',    format: 'number', precision: 1, suffix: '%' },
      { id: 'out-riskPercent',   label: 'Risk %',                         formulaRef: 'riskPercent',   format: 'number', precision: 2, suffix: '%' },
      { id: 'out-rewardPercent', label: 'Reward %',                       formulaRef: 'rewardPercent', format: 'number', precision: 2, suffix: '%' },
    ],
    guide: {
      whatIsIt:
        'The risk/reward ratio (R:R) measures how much potential reward you stand to gain for each unit of risk taken. R:R = |Take Profit − Entry| ÷ |Entry − Stop Loss|. A 1:3 ratio means you risk $1 to potentially gain $3. The minimum win rate to break even = 1 ÷ (1 + R:R). For educational purposes only — not financial advice.',
      howToUse:
        'Enter your entry price, stop-loss price, and take-profit target. The calculator returns the R:R ratio, the minimum win rate you need to be profitable over many trades, and the percentage risk and reward relative to entry price.',
      exampleScenario:
        'Entry: $50,000. Stop: $48,500 (risk = $1,500, 3%). Take Profit: $55,000 (reward = $5,000, 10%). R:R = 5000/1500 = 3.33:1. Minimum win rate = 1/(1+3.33) = 23.1%. You only need to win 1 in 4 trades to break even at this ratio.',
      proTip:
        'Most professional traders target a minimum 2:1 R:R ratio (win rate needed: 33%). A high R:R ratio allows profitability even with a relatively low win rate. Combining a 2:1 R:R with a 50% win rate produces a strong expected value: (0.5 × 2) − (0.5 × 1) = +0.5R per trade. Focus on setups with clear levels, not on predicting direction with high accuracy.',
    },
    metadata: { version: '1.0.0' },
  },
];
