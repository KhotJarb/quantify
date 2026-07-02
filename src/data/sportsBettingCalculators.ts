import { CalculatorSchema } from '@/types/calculator';

export const sportsBettingCalculators: CalculatorSchema[] = [
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // 1. Betting Odds Converter
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'betting-odds-converter',
    slug: 'betting-odds-converter',
    title: 'Betting Odds Converter',
    description:
      'Convert decimal odds to American and fractional formats, and calculate the implied probability and expected profit per $100 staked.',
    icon: '🎰',
    category: 'sports',
    subcategory: 'odds-betting',
    tags: ['betting', 'odds', 'decimal', 'american', 'fractional', 'implied probability', 'gambling'],
    inputs: [
      {
        id: 'decimalOdds',
        label: 'Decimal Odds',
        type: 'number',
        defaultValue: 2.5,
        min: 1.01,
        step: 0.01,
        placeholder: '2.50',
        helpText:
          'Decimal odds (European format). E.g. 2.50 = 5/2 = +150 American.',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'impliedProbability',
        expression: '(1 / decimalOdds) * 100',
        dependencies: ['decimalOdds'],
      },
      {
        id: 'americanOdds',
        expression:
          'decimalOdds >= 2 ? (decimalOdds - 1) * 100 : (-100) / (decimalOdds - 1)',
        dependencies: ['decimalOdds'],
      },
      {
        id: 'profit100',
        expression: '(decimalOdds - 1) * 100',
        dependencies: ['decimalOdds'],
      },
    ],
    outputs: [
      {
        id: 'impliedProbability',
        label: 'Implied Probability',
        formulaRef: 'impliedProbability',
        format: 'number',
        precision: 2,
        highlight: true,
        suffix: '%',
      },
      {
        id: 'americanOdds',
        label: 'American (Moneyline) Odds',
        formulaRef: 'americanOdds',
        format: 'number',
        precision: 0,
      },
      {
        id: 'profit100',
        label: 'Profit per $100 Staked',
        formulaRef: 'profit100',
        format: 'currency',
        precision: 2,
        prefix: '$',
        suffix: ' profit per $100 staked',
      },
    ],
    guide: {
      whatIsIt:
        'This calculator converts decimal odds (European format) into American (moneyline) odds and reveals the implied probability and expected profit. Decimal odds represent your total return per unit staked, while American odds show profit on a $100 bet (+) or the stake needed to win $100 (âˆ’). Implied probability is the bookmaker\'s estimated chance of the outcome occurring â€” and summing all outcome probabilities gives you the vig/overround, the bookmaker\'s margin.',
      howToUse:
        'Enter the decimal odds for the outcome you are analyzing. The calculator instantly shows the equivalent American moneyline odds, the implied probability baked into those odds, and the expected profit if you stake $100.',
      exampleScenario:
        'A bookmaker offers 2.50 decimal odds on a football team to win. The implied probability is 1/2.50 = 40%. The American equivalent is +150 (profit of $150 per $100 staked). If you believe the team\'s true probability of winning is 45%, there is positive expected value in this bet.',
      proTip:
        'Bookmakers build an "overround" (vig) by shading odds below true probability. Summing the implied probabilities of all outcomes will total >100% â€” the excess percentage is their margin. Always compare implied probability against your own assessed probability to identify value bets. For educational and mathematical purposes only.',
    },
    metadata: { version: '1.0.0' },
  },

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // 2. Arbitrage Betting Calculator
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'arbitrage-betting',
    slug: 'arbitrage-betting',
    title: 'Arbitrage Betting Calculator',
    description:
      'Detect two-way arbitrage opportunities across bookmakers and calculate optimal stakes to guarantee a profit regardless of outcome.',
    icon: '♟️',
    category: 'sports',
    subcategory: 'odds-betting',
    tags: ['arbitrage', 'arb', 'sure bet', 'sports betting', 'guaranteed profit', 'betting'],
    inputs: [
      {
        id: 'odds1',
        label: 'Decimal Odds â€“ Outcome 1',
        type: 'number',
        defaultValue: 2.1,
        min: 1.01,
        step: 0.01,
        placeholder: '2.10',
        helpText: 'Decimal odds for Outcome 1 (e.g. Home Win) at Bookmaker A.',
        required: true,
      },
      {
        id: 'odds2',
        label: 'Decimal Odds â€“ Outcome 2',
        type: 'number',
        defaultValue: 2.1,
        min: 1.01,
        step: 0.01,
        placeholder: '2.10',
        helpText: 'Decimal odds for Outcome 2 (e.g. Away Win) at Bookmaker B.',
        required: true,
      },
      {
        id: 'totalStake',
        label: 'Total Stake',
        type: 'number',
        defaultValue: 1000,
        min: 1,
        step: 10,
        helpText: 'Total amount you wish to distribute across both bets.',
        required: true,
        units: [{ label: 'USD', value: 'usd' }],
      },
    ],
    formulas: [
      {
        id: 'totalImplied',
        expression: '(1 / odds1) * 100 + (1 / odds2) * 100',
        dependencies: ['odds1', 'odds2'],
      },
      {
        id: 'stake1',
        expression:
          'totalStake * (1 / odds1) / ((1 / odds1) + (1 / odds2))',
        dependencies: ['totalStake', 'odds1', 'odds2'],
      },
      {
        id: 'stake2',
        expression:
          'totalStake - totalStake * (1 / odds1) / ((1 / odds1) + (1 / odds2))',
        dependencies: ['totalStake', 'odds1', 'odds2'],
      },
      {
        id: 'profit',
        expression:
          'min(totalStake * (1 / odds1) / ((1 / odds1) + (1 / odds2)) * odds1, (totalStake - totalStake * (1 / odds1) / ((1 / odds1) + (1 / odds2))) * odds2) - totalStake',
        dependencies: ['totalStake', 'odds1', 'odds2'],
      },
      {
        id: 'profitPct',
        expression:
          '(min(totalStake * (1 / odds1) / ((1 / odds1) + (1 / odds2)) * odds1, (totalStake - totalStake * (1 / odds1) / ((1 / odds1) + (1 / odds2))) * odds2) - totalStake) / totalStake * 100',
        dependencies: ['totalStake', 'odds1', 'odds2'],
      },
    ],
    outputs: [
      {
        id: 'totalImplied',
        label: 'Total Implied Probability',
        formulaRef: 'totalImplied',
        format: 'number',
        precision: 2,
        highlight: true,
        suffix: '% (below 100% = arb opportunity)',
      },
      {
        id: 'stake1',
        label: 'Stake on Outcome 1',
        formulaRef: 'stake1',
        format: 'currency',
        precision: 2,
        prefix: '$',
        suffix: ' on Outcome 1',
      },
      {
        id: 'stake2',
        label: 'Stake on Outcome 2',
        formulaRef: 'stake2',
        format: 'currency',
        precision: 2,
        prefix: '$',
        suffix: ' on Outcome 2',
      },
      {
        id: 'profit',
        label: 'Guaranteed Profit',
        formulaRef: 'profit',
        format: 'currency',
        precision: 2,
        prefix: '$',
      },
      {
        id: 'profitPct',
        label: 'Profit %',
        formulaRef: 'profitPct',
        format: 'number',
        precision: 2,
        suffix: '%',
      },
    ],
    guide: {
      whatIsIt:
        'Sports arbitrage ("arb") exploits pricing differences between bookmakers on the same event to guarantee a profit regardless of the outcome. When the sum of implied probabilities from two books falls below 100%, a risk-free profit window exists.',
      howToUse:
        'Enter the best decimal odds available for each of the two outcomes (e.g. Home Win and Away Win) from different bookmakers, then set your total stake. If the Total Implied Probability is below 100%, an arb exists and the calculator shows how much to place on each outcome to lock in profit.',
      exampleScenario:
        'Bookmaker A offers 2.10 on Team A; Bookmaker B offers 2.10 on Team B. Total implied = 47.6% + 47.6% = 95.2% â€” an arb exists. On a $1,000 total stake, place $500 on each outcome. Whichever team wins, you receive $1,050, securing a $50 guaranteed profit (5% ROI).',
      proTip:
        'True arb opportunities rarely exceed 2â€“5% profit and disappear within minutes. Act quickly â€” bookmakers adjust lines rapidly. Accounts that repeatedly exploit arbs are often limited or closed by bookmakers. The biggest practical risk is line movement after you place your first bet. This is a mathematical/educational tool only.',
    },
    metadata: { version: '1.0.0' },
  },

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // 3. Kelly Criterion Calculator
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'kelly-criterion',
    slug: 'kelly-criterion',
    title: 'Kelly Criterion Calculator',
    description:
      'Calculate the optimal fraction of your bankroll to stake on a bet using the Kelly Criterion to maximise long-run capital growth.',
    icon: '🎯',
    category: 'sports',
    subcategory: 'odds-betting',
    tags: ['kelly criterion', 'bankroll management', 'betting', 'stake sizing', 'expected value'],
    inputs: [
      {
        id: 'winProbability',
        label: 'Win Probability',
        type: 'number',
        defaultValue: 55,
        min: 1,
        max: 99,
        step: 1,
        helpText: 'Your estimated probability of winning this bet (%).',
        required: true,
        units: [{ label: '%', value: 'pct' }],
      },
      {
        id: 'decimalOdds',
        label: 'Decimal Odds',
        type: 'number',
        defaultValue: 2.0,
        min: 1.01,
        step: 0.01,
        placeholder: '2.00',
        helpText: 'Decimal odds offered by the bookmaker.',
        required: true,
      },
      {
        id: 'bankroll',
        label: 'Total Bankroll',
        type: 'number',
        defaultValue: 1000,
        min: 1,
        step: 50,
        helpText: 'Your total available betting bankroll.',
        required: true,
        units: [{ label: '$', value: 'usd' }],
      },
      {
        id: 'fractionKelly',
        label: 'Kelly Fraction',
        type: 'number',
        defaultValue: 25,
        min: 10,
        max: 100,
        step: 5,
        helpText:
          'Fraction of full Kelly to use (%). 25% = Quarter Kelly (safer, recommended for most bettors).',
        required: true,
        units: [{ label: '%', value: 'pct' }],
      },
    ],
    formulas: [
      {
        id: 'edge',
        expression: '((winProbability / 100) * decimalOdds - 1) * 100',
        dependencies: ['winProbability', 'decimalOdds'],
      },
      {
        id: 'fullKelly',
        expression:
          '(((decimalOdds - 1) * (winProbability / 100) - (1 - winProbability / 100)) / (decimalOdds - 1)) * 100',
        dependencies: ['winProbability', 'decimalOdds'],
      },
      {
        id: 'kellySafe',
        expression:
          '(((decimalOdds - 1) * (winProbability / 100) - (1 - winProbability / 100)) / (decimalOdds - 1)) * 100 * (fractionKelly / 100)',
        dependencies: ['winProbability', 'decimalOdds', 'fractionKelly'],
      },
      {
        id: 'betAmount',
        expression:
          'bankroll * ((((decimalOdds - 1) * (winProbability / 100) - (1 - winProbability / 100)) / (decimalOdds - 1)) * 100 * (fractionKelly / 100)) / 100',
        dependencies: ['bankroll', 'winProbability', 'decimalOdds', 'fractionKelly'],
      },
    ],
    outputs: [
      {
        id: 'edge',
        label: 'Betting Edge',
        formulaRef: 'edge',
        format: 'number',
        precision: 2,
        suffix: '% (positive = value bet)',
      },
      {
        id: 'fullKelly',
        label: 'Full Kelly Stake %',
        formulaRef: 'fullKelly',
        format: 'number',
        precision: 2,
        highlight: true,
        suffix: '% of bankroll',
      },
      {
        id: 'kellySafe',
        label: 'Fractional Kelly Stake %',
        formulaRef: 'kellySafe',
        format: 'number',
        precision: 2,
        suffix: '% of bankroll',
      },
      {
        id: 'betAmount',
        label: 'Recommended Stake',
        formulaRef: 'betAmount',
        format: 'currency',
        precision: 2,
        prefix: '$',
      },
    ],
    guide: {
      whatIsIt:
        'The Kelly Criterion (John L. Kelly Jr., 1956) is a mathematical formula that calculates the optimal fraction of your bankroll to wager in order to maximise the expected logarithm of wealth â€” i.e., long-run capital growth. It perfectly balances growth against the risk of ruin.',
      howToUse:
        'Enter your estimated win probability for the bet, the decimal odds on offer, your total bankroll, and the Kelly fraction you want to apply. Full Kelly (100%) maximises theoretical growth but causes extreme volatility. Quarter Kelly (25%) is far more practical for real-world use and reduces variance dramatically.',
      exampleScenario:
        'You estimate a 55% chance of winning a bet at 2.00 decimal odds (even money). Full Kelly = ((1 Ã— 0.55 âˆ’ 0.45) / 1) = 10% of bankroll. On a $1,000 bankroll, Full Kelly stake = $100. Quarter Kelly = $25 â€” much safer but still captures positive expected value since Edge = (0.55 Ã— 2.00 âˆ’ 1) Ã— 100 = +10%.',
      proTip:
        'Only use Kelly when Edge > 0%. A negative Kelly result means the bet has negative expected value â€” do not bet. Never use Full Kelly in practice; it produces catastrophic drawdowns. Half or Quarter Kelly is the professional standard. Accurate probability estimation is the hardest part: overestimating your edge leads to overbetting and accelerated ruin.',
    },
    metadata: { version: '1.0.0' },
  },

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // 4. Asian Handicap Calculator
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'asian-handicap',
    slug: 'asian-handicap',
    title: 'Asian Handicap Calculator',
    description:
      'Calculate payout and profit for Asian handicap bets, eliminating the draw and giving a virtual head-start or deficit to the favoured team.',
    icon: '⚽',
    category: 'sports',
    subcategory: 'odds-betting',
    tags: ['asian handicap', 'football', 'soccer', 'betting', 'handicap', 'spread'],
    inputs: [
      {
        id: 'stake',
        label: 'Stake',
        type: 'number',
        defaultValue: 100,
        min: 1,
        step: 10,
        required: true,
        units: [{ label: '$', value: 'usd' }],
        helpText: 'Amount you wish to stake on this bet.',
      },
      {
        id: 'handicap',
        label: 'Handicap Line',
        type: 'select',
        defaultValue: '-0.5',
        helpText:
          'The handicap applied to the team you are backing. Negative = team gives head start; Positive = team receives head start.',
        options: [
          { label: '+1', value: '1' },
          { label: '+0.75', value: '0.75' },
          { label: '+0.5', value: '0.5' },
          { label: '+0.25', value: '0.25' },
          { label: '0 (level ball)', value: '0' },
          { label: '-0.25', value: '-0.25' },
          { label: '-0.5', value: '-0.5' },
          { label: '-0.75', value: '-0.75' },
          { label: '-1', value: '-1' },
        ],
      },
      {
        id: 'odds',
        label: 'Decimal Odds',
        type: 'number',
        defaultValue: 1.9,
        min: 1.01,
        step: 0.01,
        required: true,
        helpText: 'Decimal odds offered by the bookmaker for this handicap line.',
      },
      {
        id: 'goalDifference',
        label: 'Goal Difference (Actual Result)',
        type: 'number',
        defaultValue: 0,
        min: -10,
        max: 10,
        step: 1,
        helpText:
          'Goals scored by the team you backed minus opponent goals. E.g. you backed Home; Home wins 2-1 â†’ enter +1.',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'adjustedResult',
        expression: 'goalDifference + handicap',
        dependencies: ['goalDifference', 'handicap'],
      },
      {
        id: 'payout',
        expression:
          'goalDifference + handicap > 0 ? stake * odds : (goalDifference + handicap == 0 ? stake : 0)',
        dependencies: ['goalDifference', 'handicap', 'stake', 'odds'],
      },
      {
        id: 'profit',
        expression:
          'goalDifference + handicap > 0 ? stake * (odds - 1) : (goalDifference + handicap == 0 ? 0 : -stake)',
        dependencies: ['goalDifference', 'handicap', 'stake', 'odds'],
      },
    ],
    outputs: [
      {
        id: 'payout',
        label: 'Total Payout',
        formulaRef: 'payout',
        format: 'currency',
        precision: 2,
        highlight: true,
        prefix: '$',
      },
      {
        id: 'profit',
        label: 'Net Profit / Loss',
        formulaRef: 'profit',
        format: 'currency',
        precision: 2,
        prefix: '$',
      },
    ],
    guide: {
      whatIsIt:
        'Asian handicaps originated in Asian sports betting markets and eliminate the draw as a possible outcome by giving one team a virtual goal advantage or deficit before the match starts. This is especially popular in football (soccer) where draws are common. Quarter-ball handicaps (0.25, 0.75) split your stake across two adjacent lines, providing a partial refund on a push.',
      howToUse:
        'Select the handicap line you are betting on (applied to the team you back), enter the decimal odds, your stake, and the actual goal difference after the match (from the backed team\'s perspective). The calculator shows your payout and profit or loss.',
      exampleScenario:
        'You back Team A at âˆ’0.5 Asian Handicap at odds 1.90, staking $100. Team A wins 1-0 (goal difference = +1). Adjusted result = 1 + (âˆ’0.5) = +0.5 > 0 â†’ Win. Payout = $100 Ã— 1.90 = $190. Profit = $90. If the match had ended 0-0, adjusted result = 0 + (âˆ’0.5) = âˆ’0.5 < 0 â†’ Full loss ($0 payout).',
      proTip:
        'Quarter-ball handicaps (e.g. âˆ’0.75 = half on âˆ’0.5, half on âˆ’1) act as insurance. If Team A wins by exactly 1 and you backed âˆ’0.75, you win half (the âˆ’0.5 line) and push/lose half (the âˆ’1 line) â€” far better than an outright loss. Asian handicaps typically carry tighter bookmaker margins than traditional 1X2 markets.',
    },
    metadata: { version: '1.0.0' },
  },

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // 5. Golf Handicap Calculator
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'golf-handicap',
    slug: 'golf-handicap',
    title: 'Golf Handicap Calculator',
    description:
      'Calculate your World Handicap System (WHS) handicap differential for a single round and convert it to a course handicap.',
    icon: '⛳',
    category: 'sports',
    subcategory: 'golf-fitness',
    tags: ['golf', 'handicap', 'WHS', 'course rating', 'slope rating', 'golf score'],
    inputs: [
      {
        id: 'grossScore',
        label: 'Gross Score',
        type: 'number',
        defaultValue: 85,
        min: 55,
        max: 150,
        step: 1,
        helpText:
          'Your actual total score for the round (before handicap adjustment).',
        required: true,
      },
      {
        id: 'courseRating',
        label: 'Course Rating',
        type: 'number',
        defaultValue: 72.0,
        min: 60,
        max: 80,
        step: 0.1,
        helpText:
          'The Course Rating from the scorecard â€” the expected score for a scratch (0-handicap) golfer.',
        required: true,
      },
      {
        id: 'slopeRating',
        label: 'Slope Rating',
        type: 'number',
        defaultValue: 113,
        min: 55,
        max: 155,
        step: 1,
        helpText:
          'The Slope Rating from the scorecard. Standard difficulty = 113. Higher numbers = harder for bogey golfers.',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'handicapDifferential',
        expression: '(grossScore - courseRating) * (113 / slopeRating)',
        dependencies: ['grossScore', 'courseRating', 'slopeRating'],
      },
      {
        id: 'courseHandicap',
        expression:
          'round((grossScore - courseRating) * (113 / slopeRating) * (slopeRating / 113))',
        dependencies: ['grossScore', 'courseRating', 'slopeRating'],
      },
    ],
    outputs: [
      {
        id: 'handicapDifferential',
        label: 'Handicap Differential',
        formulaRef: 'handicapDifferential',
        format: 'number',
        precision: 1,
        highlight: true,
      },
      {
        id: 'courseHandicap',
        label: 'Course Handicap (this course)',
        formulaRef: 'courseHandicap',
        format: 'number',
        precision: 0,
      },
    ],
    guide: {
      whatIsIt:
        'The World Handicap System (WHS), adopted globally in 2020, uses handicap differentials to measure a golfer\'s ability relative to course difficulty. A differential adjusts your gross score for both the Course Rating (expected scratch score) and Slope Rating (relative difficulty for a bogey golfer vs a scratch golfer). Your full Handicap Index is the average of the best 8 differentials from your most recent 20 rounds.',
      howToUse:
        'Enter your gross score for the round, the Course Rating and Slope Rating from the tee box you played (found on the scorecard). The calculator outputs the handicap differential for that round and the equivalent course handicap. Accumulate 20 rounds and average the best 8 differentials for a complete Handicap Index.',
      exampleScenario:
        'You shoot 85 on a course with a rating of 72.0 and slope of 125. Differential = (85 âˆ’ 72.0) Ã— (113/125) = 13 Ã— 0.904 = 11.7. This is added to your round history. After 20 rounds, average your best 8 differentials to obtain your Handicap Index.',
      proTip:
        'The standard Slope Rating of 113 represents average difficulty for a bogey golfer. A slope above 113 means the course is disproportionately harder for higher-handicappers relative to scratch players â€” your differential is appropriately adjusted downward (giving you fewer strokes on that course). Always use the tee ratings that match the tees you played.',
    },
    metadata: { version: '1.0.0' },
  },

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // 6. Wilks Score Calculator
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'wilks-score',
    slug: 'wilks-score',
    title: 'Wilks Score Calculator',
    description:
      'Calculate your Wilks Score to compare powerlifting totals across different body weight classes for males and females.',
    icon: '🏋️',
    category: 'sports',
    subcategory: 'golf-fitness',
    tags: ['wilks', 'powerlifting', 'strength', 'bodyweight', 'squat', 'bench', 'deadlift'],
    inputs: [
      {
        id: 'totalLifted',
        label: 'Total Lifted',
        type: 'number',
        defaultValue: 500,
        min: 1,
        step: 0.5,
        helpText: 'Total of Squat + Bench Press + Deadlift in kilograms.',
        required: true,
        units: [{ label: 'kg', value: 'kg' }],
      },
      {
        id: 'bodyweight',
        label: 'Body Weight',
        type: 'number',
        defaultValue: 80,
        min: 40,
        max: 200,
        step: 0.5,
        helpText: "Lifter's body weight in kilograms.",
        required: true,
        units: [{ label: 'kg', value: 'kg' }],
      },
      {
        id: 'sex',
        label: 'Sex',
        type: 'select',
        defaultValue: 'male',
        options: [
          { label: 'Male', value: 'male' },
          { label: 'Female', value: 'female' },
        ],
        required: true,
      },
    ],
    formulas: [
      {
        id: 'wilksScore',
        expression:
          "totalLifted * (500 / (sex == 'male' ? (-216.0475144 + 16.2606339 * bodyweight + (-0.002388645) * pow(bodyweight, 2) + (-0.00113732) * pow(bodyweight, 3) + 0.00000701863 * pow(bodyweight, 4) + (-0.00000001291) * pow(bodyweight, 5)) : (-594.31747775582 + 35.34208843 * bodyweight + (-0.53157) * pow(bodyweight, 2) + 0.0028372 * pow(bodyweight, 3) + (-0.000015082) * pow(bodyweight, 4) + 0.0000000311 * pow(bodyweight, 5))))",
        dependencies: ['totalLifted', 'sex', 'bodyweight'],
      },
    ],
    outputs: [
      {
        id: 'wilksScore',
        label: 'Wilks Score',
        formulaRef: 'wilksScore',
        format: 'number',
        precision: 2,
        highlight: true,
      },
    ],
    guide: {
      whatIsIt:
        'The Wilks Score (developed by Robert Wilks) is a coefficient used in powerlifting to compare total lifted weight across different body weight classes and between male and female lifters. It normalises the total using a polynomial coefficient derived from body weight, enabling fair cross-class comparisons.',
      howToUse:
        'Enter your competition total (Squat + Bench Press + Deadlift) in kilograms, your body weight in kilograms, and select your sex. The calculator applies the Wilks polynomial coefficients (5th-degree polynomial) to produce a single comparable score.',
      exampleScenario:
        'An 80 kg male totals 600 kg. His Wilks Score is approximately 389. A 60 kg male lifting 450 kg might score 393 â€” very close, showing the formula correctly accounts for the relative strength advantage of lighter athletes.',
      proTip:
        'A Wilks score above 300 indicates a solid competitive level. Scores above 400 are elite amateur territory and 500+ marks world-class. Since 2019, the IPF has officially switched to IPF GL Points, but Wilks remains widely used in untested federations and community lifting for its familiarity and longevity.',
    },
    metadata: { version: '1.0.0' },
  },

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // 7. DOTS Score Calculator
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'dots-score',
    slug: 'dots-score',
    title: 'DOTS Score Calculator',
    description:
      'Calculate your DOTS (Dynamic Objective Tracking of Strength) score for equitable powerlifting comparison across all weight classes.',
    icon: '🏆',
    category: 'sports',
    subcategory: 'golf-fitness',
    tags: ['dots', 'powerlifting', 'strength', 'bodyweight', 'IPF', 'squat', 'bench', 'deadlift'],
    inputs: [
      {
        id: 'totalLifted',
        label: 'Total Lifted',
        type: 'number',
        defaultValue: 500,
        min: 1,
        step: 0.5,
        helpText: 'Total of Squat + Bench Press + Deadlift in kilograms.',
        required: true,
        units: [{ label: 'kg', value: 'kg' }],
      },
      {
        id: 'bodyweight',
        label: 'Body Weight',
        type: 'number',
        defaultValue: 80,
        min: 40,
        max: 250,
        step: 0.5,
        helpText: "Lifter's body weight in kilograms.",
        required: true,
        units: [{ label: 'kg', value: 'kg' }],
      },
      {
        id: 'sex',
        label: 'Sex',
        type: 'select',
        defaultValue: 'male',
        options: [
          { label: 'Male', value: 'male' },
          { label: 'Female', value: 'female' },
        ],
        required: true,
      },
    ],
    formulas: [
      {
        id: 'dotsScore',
        expression:
          "totalLifted * (sex == 'male' ? (500 / (-307.75076 + 24.0900756 * bodyweight + (-0.1918759221) * pow(bodyweight, 2) + 0.0007391293 * pow(bodyweight, 3) + (-0.000001093) * pow(bodyweight, 4))) : (500 / (-57.96288 + 13.6175032 * bodyweight + (-0.1126655495) * pow(bodyweight, 2) + 0.0005158568 * pow(bodyweight, 3) + (-0.0000010706) * pow(bodyweight, 4))))",
        dependencies: ['totalLifted', 'sex', 'bodyweight'],
      },
    ],
    outputs: [
      {
        id: 'dotsScore',
        label: 'DOTS Score',
        formulaRef: 'dotsScore',
        format: 'number',
        precision: 2,
        highlight: true,
      },
    ],
    guide: {
      whatIsIt:
        'DOTS (Dynamic Objective Tracking of Strength) is a bodyweight-adjusted scoring system for powerlifting, developed as a more equitable alternative to Wilks. It uses updated polynomial regression on modern competition data and is designed to be fairer across extreme weight classes â€” particularly very light and very heavy lifters.',
      howToUse:
        'Enter your total (Squat + Bench Press + Deadlift in kg), body weight in kg, and sex. DOTS uses a 4th-degree polynomial denominator (vs Wilks\' 5th-degree) fitted to current competitive data. The resulting score enables fair comparison across all weight classes and between male and female lifters.',
      exampleScenario:
        'An 80 kg male with a 600 kg total scores approximately 388 DOTS. Compared to Wilks (â‰ˆ389), DOTS scores are similar in the mid-weight range but diverge at extreme body weights â€” DOTS is considered more accurate for superheavy lifters and lighter lifters who are disproportionately favoured under Wilks.',
      proTip:
        'The IPF introduced DOTS in 2019 as part of its official rankings. If you compete in IPF-affiliated federations, DOTS is the primary cross-class comparison tool. For the full picture of your competitive standing, use DOTS alongside IPF GL Points (which also includes equipment adjustments).',
    },
    metadata: { version: '1.0.0' },
  },

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // 8. VDOT Calculator
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'vdot-calculator',
    slug: 'vdot-calculator',
    title: 'VDOT Calculator (Running Fitness)',
    description:
      "Estimate your VDOT (equivalent VOâ‚‚max) from a race result using Jack Daniels' formula to gauge running fitness level.",
    icon: '🏃',
    category: 'sports',
    subcategory: 'golf-fitness',
    tags: ['vdot', 'vo2max', 'running', 'marathon', '5k', '10k', 'Jack Daniels', 'aerobic fitness'],
    inputs: [
      {
        id: 'raceDistance',
        label: 'Race Distance',
        type: 'select',
        defaultValue: '5000',
        options: [
          { label: '1500 m', value: '1500' },
          { label: '1 Mile (1609 m)', value: '1609' },
          { label: '5K', value: '5000' },
          { label: '10K', value: '10000' },
          { label: 'Half Marathon', value: '21097' },
          { label: 'Marathon', value: '42195' },
        ],
        required: true,
      },
      {
        id: 'hours',
        label: 'Hours',
        type: 'number',
        defaultValue: 0,
        min: 0,
        max: 10,
        step: 1,
        required: true,
      },
      {
        id: 'minutes',
        label: 'Minutes',
        type: 'number',
        defaultValue: 20,
        min: 0,
        max: 59,
        step: 1,
        required: true,
      },
      {
        id: 'seconds',
        label: 'Seconds',
        type: 'number',
        defaultValue: 0,
        min: 0,
        max: 59,
        step: 1,
        required: true,
      },
    ],
    formulas: [
      {
        id: 'totalSeconds',
        expression: 'hours * 3600 + minutes * 60 + seconds',
        dependencies: ['hours', 'minutes', 'seconds'],
      },
      {
        id: 'velocity',
        expression:
          '(raceDistance / (hours * 3600 + minutes * 60 + seconds)) * 60',
        dependencies: ['raceDistance', 'hours', 'minutes', 'seconds'],
      },
      {
        id: 'vdot',
        expression:
          '(-4.60 + 0.182258 * ((raceDistance / (hours * 3600 + minutes * 60 + seconds)) * 60) + 0.000104 * pow((raceDistance / (hours * 3600 + minutes * 60 + seconds)) * 60, 2)) / (0.8 + 0.1894393 * exp(-0.012778 * (hours * 3600 + minutes * 60 + seconds) / 60) + 0.2989558 * exp(-0.1932605 * (hours * 3600 + minutes * 60 + seconds) / 60))',
        dependencies: ['raceDistance', 'hours', 'minutes', 'seconds'],
      },
    ],
    outputs: [
      {
        id: 'vdot',
        label: 'VDOT (Estimated VOâ‚‚max)',
        formulaRef: 'vdot',
        format: 'number',
        precision: 1,
        highlight: true,
        unit: 'mL/kg/min',
      },
      {
        id: 'velocity',
        label: 'Race Velocity',
        formulaRef: 'velocity',
        format: 'number',
        precision: 1,
        suffix: ' m/min',
      },
    ],
    guide: {
      whatIsIt:
        "VDOT is an equivalent VOâ‚‚max value derived from race performance, developed by renowned running coach Jack Daniels. Rather than measuring VOâ‚‚max in a lab, VDOT back-calculates aerobic capacity from an actual race time â€” a performance-based proxy that accounts for running economy as well as raw aerobic capacity.",
      howToUse:
        'Select the distance of a recent all-out race effort, then enter your finishing time (hours, minutes, seconds). The calculator uses the Daniels/Gilbert performance equations to estimate VDOT. For best accuracy, use a recent result from a properly paced, maximal-effort race.',
      exampleScenario:
        'You run a 5K in 20:00 (0h 20m 0s). Velocity = 5000/1200 Ã— 60 = 250 m/min. VDOT â‰ˆ 48, placing you at a solid recreational runner level. A 18:00 5K yields VDOT â‰ˆ 57 â€” approaching competitive amateur territory.',
      proTip:
        "Use VDOT to prescribe training paces: Easy runs at ~75â€“79% of VDOT, Threshold (tempo) at ~88%, Interval at ~98â€“100%. Jack Daniels' book 'Daniels' Running Formula' contains full training pace tables indexed by VDOT. Reference levels: 30 = beginner, 50 = solid amateur, 65+ = elite/sub-elite.",
    },
    metadata: { version: '1.0.0' },
  },

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // 9. Bowling Score Calculator
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'bowling-score',
    slug: 'bowling-score',
    title: 'Bowling Score Calculator',
    description:
      'Calculate your total bowling score and per-frame average by entering the pin count (including bonuses) for each of the 10 frames.',
    icon: '🎳',
    category: 'sports',
    subcategory: 'sports-scoring',
    tags: ['bowling', 'score', 'strike', 'spare', 'frames', 'ten-pin'],
    inputs: [
      {
        id: 'f1',
        label: 'Frame 1',
        type: 'number',
        defaultValue: 0,
        min: 0,
        max: 30,
        step: 1,
        group: 'Frames 1â€“5',
        helpText:
          'Enter the frame score including bonus pins. Strike (10) + next 2 balls; Spare (10) + next 1 ball.',
      },
      {
        id: 'f2',
        label: 'Frame 2',
        type: 'number',
        defaultValue: 0,
        min: 0,
        max: 30,
        step: 1,
        group: 'Frames 1â€“5',
      },
      {
        id: 'f3',
        label: 'Frame 3',
        type: 'number',
        defaultValue: 0,
        min: 0,
        max: 30,
        step: 1,
        group: 'Frames 1â€“5',
      },
      {
        id: 'f4',
        label: 'Frame 4',
        type: 'number',
        defaultValue: 0,
        min: 0,
        max: 30,
        step: 1,
        group: 'Frames 1â€“5',
      },
      {
        id: 'f5',
        label: 'Frame 5',
        type: 'number',
        defaultValue: 0,
        min: 0,
        max: 30,
        step: 1,
        group: 'Frames 1â€“5',
      },
      {
        id: 'f6',
        label: 'Frame 6',
        type: 'number',
        defaultValue: 0,
        min: 0,
        max: 30,
        step: 1,
        group: 'Frames 6â€“10',
      },
      {
        id: 'f7',
        label: 'Frame 7',
        type: 'number',
        defaultValue: 0,
        min: 0,
        max: 30,
        step: 1,
        group: 'Frames 6â€“10',
      },
      {
        id: 'f8',
        label: 'Frame 8',
        type: 'number',
        defaultValue: 0,
        min: 0,
        max: 30,
        step: 1,
        group: 'Frames 6â€“10',
      },
      {
        id: 'f9',
        label: 'Frame 9',
        type: 'number',
        defaultValue: 0,
        min: 0,
        max: 30,
        step: 1,
        group: 'Frames 6â€“10',
      },
      {
        id: 'f10',
        label: 'Frame 10',
        type: 'number',
        defaultValue: 0,
        min: 0,
        max: 30,
        step: 1,
        group: 'Frames 6â€“10',
        helpText: '10th frame maximum is 30 (three consecutive strikes).',
      },
    ],
    formulas: [
      {
        id: 'totalScore',
        expression: 'f1 + f2 + f3 + f4 + f5 + f6 + f7 + f8 + f9 + f10',
        dependencies: ['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'f10'],
      },
      {
        id: 'avgPerFrame',
        expression: '(f1 + f2 + f3 + f4 + f5 + f6 + f7 + f8 + f9 + f10) / 10',
        dependencies: ['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'f10'],
      },
    ],
    outputs: [
      {
        id: 'totalScore',
        label: 'Total Score',
        formulaRef: 'totalScore',
        format: 'number',
        precision: 0,
        highlight: true,
      },
      {
        id: 'avgPerFrame',
        label: 'Average per Frame',
        formulaRef: 'avgPerFrame',
        format: 'number',
        precision: 1,
      },
    ],
    guide: {
      whatIsIt:
        'Ten-pin bowling uses a cumulative scoring system where strikes and spares earn bonus pins from subsequent deliveries. A strike (all 10 pins on the first ball) scores 10 + the next two balls. A spare (remaining pins on the second ball) scores 10 + the next one ball. The 10th frame allows up to three deliveries if a strike or spare is achieved.',
      howToUse:
        'Enter the complete frame score (including bonus pins already calculated) for each of the 10 frames. For example, if Frame 1 is a strike and the next two balls score 7 and 2, enter 19 for Frame 1. The calculator sums all 10 frames and computes the average per frame.',
      exampleScenario:
        'A perfect game (12 consecutive strikes): each of frames 1â€“9 scores 30 (10 + 10 + 10), and frame 10 also scores 30. Total = 300. A typical recreational bowler averaging 7 pins per frame (with some spares) would score around 140â€“160.',
      proTip:
        'Ball-by-ball automatic bonus calculation requires individual delivery inputs, which this calculator intentionally simplifies. For best results, tally each frame score from a completed physical scoresheet before entering. Average league bowlers score 140â€“170; serious amateurs score 170â€“200; professionals typically average 200+.',
    },
    metadata: { version: '1.0.0' },
  },

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // 10. Cycling Power-to-Weight Ratio
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'cycling-power-weight',
    slug: 'cycling-power-weight',
    title: 'Cycling Power-to-Weight Ratio',
    description:
      'Calculate your cycling power-to-weight ratio (W/kg) from FTP and body weight, and see where you rank among rider categories.',
    icon: '🚴',
    category: 'sports',
    subcategory: 'sports-scoring',
    tags: ['cycling', 'FTP', 'power to weight', 'W/kg', 'watts per kg', 'fitness', 'cycling training'],
    inputs: [
      {
        id: 'ftp',
        label: 'Functional Threshold Power (FTP)',
        type: 'number',
        defaultValue: 250,
        min: 50,
        max: 600,
        step: 1,
        helpText:
          'Your FTP in watts â€” the maximum power you can sustain for approximately 60 minutes.',
        required: true,
        units: [{ label: 'W', value: 'watts' }],
      },
      {
        id: 'bodyweight',
        label: 'Body Weight',
        type: 'number',
        defaultValue: 70,
        min: 30,
        max: 200,
        step: 0.5,
        helpText: "Rider body weight in kilograms.",
        required: true,
        units: [{ label: 'kg', value: 'kg' }],
      },
    ],
    formulas: [
      {
        id: 'powerToWeight',
        expression: 'ftp / bodyweight',
        dependencies: ['ftp', 'bodyweight'],
      },
      {
        id: 'ftpPerLb',
        expression: 'ftp / (bodyweight * 2.20462)',
        dependencies: ['ftp', 'bodyweight'],
      },
    ],
    outputs: [
      {
        id: 'powerToWeight',
        label: 'Power-to-Weight Ratio',
        formulaRef: 'powerToWeight',
        format: 'number',
        precision: 2,
        highlight: true,
        suffix: ' W/kg',
      },
      {
        id: 'ftpPerLb',
        label: 'FTP per Pound',
        formulaRef: 'ftpPerLb',
        format: 'number',
        precision: 3,
        suffix: ' W/lb',
      },
    ],
    guide: {
      whatIsIt:
        'Power-to-weight ratio (W/kg) is the single most important performance metric in road cycling, particularly for climbing. It divides your Functional Threshold Power (FTP) by body weight, allowing fair comparison between riders of different sizes. FTP is the highest average power you can sustain for one hour.',
      howToUse:
        "Enter your FTP in watts and body weight in kilograms. If you haven't completed a formal 60-minute FTP test, use the common field test: ride all-out for 20 minutes and multiply your average power by 0.95 to estimate FTP.",
      exampleScenario:
        'A 70 kg rider with an FTP of 280 W has a power-to-weight ratio of 4.0 W/kg â€” Category 1â€“2 amateur range. To reach 4.5 W/kg, they could raise FTP to 315 W, reduce weight to 62 kg, or ideally pursue both through structured training and nutrition.',
      proTip:
        'W/kg benchmarks (approximate): <2.0 Untrained, 2.0â€“3.2 Cat 5, 3.2â€“4.0 Cat 3â€“4, 4.0â€“5.0 Cat 1â€“2, 5.0â€“5.5 Domestic Pro, 5.5â€“6.0 Pro Tour, 6.0+ WorldTour/Elite. On flat terrain, absolute watts matter more than W/kg (aerodynamic drag dominates). On climbs, gravity dominates and W/kg is everything.',
    },
    metadata: { version: '1.0.0' },
  },
];
