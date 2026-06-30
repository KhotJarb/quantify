import type { CalculatorSchema } from '@/types/calculator';

export const gamingCalculators: CalculatorSchema[] = [

  // ─── 61. Mouse Sensitivity Converter ────────────────────────────────
  {
    id: 'mouse-sensitivity',
    slug: 'mouse-sensitivity',
    title: 'Mouse Sensitivity Converter',
    description: 'Convert your mouse sensitivity between games using cm/360° as the universal unit. Keep your muscle memory when switching titles.',
    icon: '🖱️',
    category: 'gaming',
    subcategory: 'performance',
    tags: ['mouse sensitivity', 'cm360', 'DPI', 'eDPI', 'FPS', 'aim', 'converter'],
    inputs: [
      {
        id: 'fromSensitivity',
        label: 'Current In-Game Sensitivity',
        type: 'number',
        defaultValue: 0.8,
        step: 0.01,
        helpText: 'Your current in-game sensitivity value.',
      },
      {
        id: 'fromDpi',
        label: 'Current DPI',
        type: 'number',
        defaultValue: 800,
        min: 100,
        max: 25600,
        placeholder: 'e.g. 800',
      },
      {
        id: 'toDpi',
        label: 'Target DPI',
        type: 'number',
        defaultValue: 800,
        min: 100,
        max: 25600,
        placeholder: 'e.g. 800',
      },
      {
        id: 'game',
        label: 'Game Sensitivity Scale',
        type: 'select',
        defaultValue: '1',
        options: [
          { label: 'Custom (1.0x multiplier)', value: '1' },
          { label: 'CS2 / CS:GO (1.0x)', value: '1' },
          { label: 'Valorant (1.0x)', value: '1' },
          { label: 'Overwatch 2 (1.0x)', value: '1' },
          { label: 'Apex Legends (1.0x)', value: '1' },
        ],
        helpText: 'Sensitivity scale multiplier between games.',
      },
    ],
    formulas: [
      {
        id: 'cm360',
        expression: '(360 / (fromDpi * fromSensitivity * game)) * 2.54',
        dependencies: ['fromDpi', 'fromSensitivity', 'game'],
      },
      {
        id: 'toSensitivity',
        expression: '360 / (toDpi * cm360 / 2.54) / game',
        dependencies: ['toDpi', 'cm360', 'game'],
      },
      {
        id: 'edpi',
        expression: 'fromDpi * fromSensitivity',
        dependencies: ['fromDpi', 'fromSensitivity'],
      },
      {
        id: 'targetEdpi',
        expression: 'toDpi * toSensitivity',
        dependencies: ['toDpi', 'toSensitivity'],
      },
    ],
    outputs: [
      {
        id: 'cm360Out',
        label: 'cm / 360 (Universal)',
        formulaRef: 'cm360',
        precision: 2,
        suffix: ' cm',
        highlight: true,
      },
      {
        id: 'toSensitivityOut',
        label: 'New Sensitivity',
        formulaRef: 'toSensitivity',
        precision: 4,
      },
      {
        id: 'edpiOut',
        label: 'Current eDPI',
        formulaRef: 'edpi',
        precision: 0,
      },
      {
        id: 'targetEdpiOut',
        label: 'Target eDPI',
        formulaRef: 'targetEdpi',
        precision: 0,
      },
    ],
    guide: {
      whatIsIt:
        'The Mouse Sensitivity Converter uses cm/360 as a universal, hardware-independent unit of aim speed. It tells you how many centimetres you physically move your mouse to perform a full 360-degree in-game rotation. Because it factors out both DPI and in-game sensitivity, you can compare and transfer your feel between any two games or DPI settings.',
      howToUse:
        'Enter your current in-game sensitivity and DPI. Enter the target DPI (leave the same if you are only changing games). The calculator immediately shows your cm/360 and the converted sensitivity for the new setup.',
      exampleScenario:
        'You play CS2 at 800 DPI, sensitivity 0.8 — that is 14.29 cm/360. You want to match this feel in Valorant at 1600 DPI. The calculator outputs Valorant sensitivity 0.4 at 1600 DPI to achieve the same 14.29 cm/360.',
      proTip:
        'Professional FPS players typically use 20-50 cm/360. Lower values (faster) suit flick-shot styles; higher values (slower) suit tracking and pixel-accurate adjustments. eDPI (DPI x sensitivity) lets you compare players on different mice. Changing DPI without adjusting sensitivity changes your cm/360 — always convert both together.',
    },
    metadata: { version: '1.0.0' },
  },

  // ─── 62. K/D Ratio ──────────────────────────────────────────────────
  {
    id: 'kd-ratio',
    slug: 'kd-ratio',
    title: 'K/D Ratio Calculator',
    description: 'Calculate your Kill/Death ratio, KDA with assists, kill dominance rate, and survival statistics.',
    icon: '🎯',
    category: 'gaming',
    subcategory: 'performance',
    tags: ['kd ratio', 'kda', 'kills', 'deaths', 'assists', 'fps', 'performance'],
    inputs: [
      {
        id: 'kills',
        label: 'Kills',
        type: 'number',
        defaultValue: 500,
        min: 0,
        placeholder: 'e.g. 500',
      },
      {
        id: 'deaths',
        label: 'Deaths',
        type: 'number',
        defaultValue: 250,
        min: 1,
        placeholder: 'e.g. 250',
      },
      {
        id: 'assists',
        label: 'Assists',
        type: 'number',
        defaultValue: 100,
        min: 0,
        helpText: 'Optional. Some games count assists toward KDA.',
      },
      {
        id: 'assistWeight',
        label: 'Assist Weight',
        type: 'number',
        defaultValue: 0.5,
        step: 0.1,
        min: 0,
        max: 1,
        helpText: 'How much an assist counts (0 = none, 0.5 = half kill, 1 = full kill).',
      },
    ],
    formulas: [
      {
        id: 'kd',
        expression: 'kills / deaths',
        dependencies: ['kills', 'deaths'],
      },
      {
        id: 'kda',
        expression: '(kills + assists * assistWeight) / deaths',
        dependencies: ['kills', 'assists', 'assistWeight', 'deaths'],
      },
      {
        id: 'killsPerDeath',
        expression: 'kills / deaths',
        dependencies: ['kills', 'deaths'],
      },
      {
        id: 'survivalRate',
        expression: 'deaths / (kills + deaths) * 100',
        dependencies: ['deaths', 'kills'],
      },
      {
        id: 'dominanceRate',
        expression: 'kills / (kills + deaths) * 100',
        dependencies: ['kills', 'deaths'],
      },
    ],
    outputs: [
      {
        id: 'kdOut',
        label: 'K/D Ratio',
        formulaRef: 'kd',
        precision: 2,
        highlight: true,
      },
      {
        id: 'kdaOut',
        label: 'KDA (with assists)',
        formulaRef: 'kda',
        precision: 2,
      },
      {
        id: 'dominanceRateOut',
        label: 'Kill Dominance',
        formulaRef: 'dominanceRate',
        precision: 1,
        suffix: '%',
      },
    ],
    guide: {
      whatIsIt:
        'The K/D Ratio is the number of kills divided by deaths — the most fundamental performance metric in team-based shooters. A K/D above 1.0 means you eliminate more enemies than you die. The KDA adds assists weighted by how much you count them, rewarding team-oriented playstyles. Kill Dominance is the percentage of kill+death events that resulted in a kill.',
      howToUse:
        'Enter your total kills, deaths, and assists from your stat page or match history. Adjust the assist weight to match your game (Valorant: 0.5, League of Legends: 0.5, some games: 1.0). All outputs update instantly.',
      exampleScenario:
        '500 kills, 250 deaths, 100 assists at 0.5 weight: K/D = 2.00, KDA = 2.20, Kill Dominance = 66.7%. This means you kill twice as often as you die, and your assists add meaningful value on top of your raw K/D.',
      proTip:
        'K/D is a lagging indicator — it tells you what happened, not why. Pair it with headshot %, damage per round, or win rate to get a fuller picture. A 0.8 K/D player who wins 65% of matches is often more valuable than a 1.5 K/D player who wins 45%.',
    },
    metadata: { version: '1.0.0' },
  },

  // ─── 63. Win Rate Percentage ─────────────────────────────────────────
  {
    id: 'win-rate',
    slug: 'win-rate',
    title: 'Win Rate Calculator',
    description: 'Calculate your overall win rate, W/L ratio, and loss rate from competitive match records.',
    icon: '🏆',
    category: 'gaming',
    subcategory: 'performance',
    tags: ['win rate', 'win loss', 'wl ratio', 'competitive', 'ranked', 'statistics'],
    inputs: [
      {
        id: 'wins',
        label: 'Wins',
        type: 'number',
        defaultValue: 150,
        min: 0,
        placeholder: 'e.g. 150',
      },
      {
        id: 'losses',
        label: 'Losses',
        type: 'number',
        defaultValue: 100,
        min: 0,
        placeholder: 'e.g. 100',
      },
      {
        id: 'draws',
        label: 'Draws / Ties',
        type: 'number',
        defaultValue: 20,
        min: 0,
        helpText: 'Ties or draws. Enter 0 if not applicable.',
      },
    ],
    formulas: [
      {
        id: 'totalGames',
        expression: 'wins + losses + draws',
        dependencies: ['wins', 'losses', 'draws'],
      },
      {
        id: 'winRate',
        expression: '(wins / totalGames) * 100',
        dependencies: ['wins', 'totalGames'],
      },
      {
        id: 'lossRate',
        expression: '(losses / totalGames) * 100',
        dependencies: ['losses', 'totalGames'],
      },
      {
        id: 'wlRatio',
        expression: 'wins / (losses + 0.0001)',
        dependencies: ['wins', 'losses'],
      },
      {
        id: 'winsNeeded50',
        expression: 'losses - wins',
        dependencies: ['losses', 'wins'],
      },
    ],
    outputs: [
      {
        id: 'winRateOut',
        label: 'Win Rate',
        formulaRef: 'winRate',
        precision: 2,
        suffix: '%',
        highlight: true,
      },
      {
        id: 'wlRatioOut',
        label: 'W/L Ratio',
        formulaRef: 'wlRatio',
        precision: 2,
      },
      {
        id: 'lossRateOut',
        label: 'Loss Rate',
        formulaRef: 'lossRate',
        precision: 2,
        suffix: '%',
      },
      {
        id: 'totalGamesOut',
        label: 'Total Games Played',
        formulaRef: 'totalGames',
        precision: 0,
      },
    ],
    guide: {
      whatIsIt:
        'The Win Rate Calculator shows what percentage of your games you won, lost, or drew. It also computes the W/L ratio — how many wins you have per loss — a useful single number for comparing performance across seasons or accounts.',
      howToUse:
        "Enter your total wins, losses, and draws (use 0 for draws if your game does not have them). All metrics update instantly. Use your game's career stats page to find the numbers.",
      exampleScenario:
        '150 wins, 100 losses, 20 draws out of 270 total games: Win Rate = 55.56%, W/L ratio = 1.50. This means you win more than half your games and average 1.5 wins for every loss — solidly above average for most titles.',
      proTip:
        'For ranked queues, a 50% win rate is the statistical baseline (most matchmaking systems target this). To rank up you need a sustained win rate above 53-55%. Track your win rate per hero/agent/champion to find your strongest picks. Use seasonal win rates rather than all-time to track recent improvement.',
    },
    metadata: { version: '1.0.0' },
  },

  // ─── 64. Gacha Probability / Pity ────────────────────────────────────
  {
    id: 'gacha-probability',
    slug: 'gacha-probability',
    title: 'Gacha Probability & Pity Calculator',
    description: 'Calculate your probability of getting an item across N pulls, pity guarantees, expected cost, and guaranteed items.',
    icon: '🎰',
    category: 'gaming',
    subcategory: 'rpg',
    tags: ['gacha', 'pity', 'probability', 'pulls', 'genshin', 'banner', 'rate', 'gacha games'],
    inputs: [
      {
        id: 'baseRatePercent',
        label: 'Base Rate (%)',
        type: 'number',
        defaultValue: 0.6,
        step: 0.01,
        min: 0.01,
        helpText: 'Base pull rate e.g. 0.6% for 5-star in Genshin Impact.',
      },
      {
        id: 'pulls',
        label: 'Number of Pulls',
        type: 'number',
        defaultValue: 90,
        min: 1,
        helpText: 'Number of pulls/rolls you plan to do.',
      },
      {
        id: 'pityAt',
        label: 'Hard Pity (guaranteed at X pulls)',
        type: 'number',
        defaultValue: 90,
        min: 1,
        helpText: 'Hard pity: guaranteed 5-star at 90 pulls in Genshin Impact.',
      },
      {
        id: 'currentPity',
        label: 'Current Pity Counter',
        type: 'number',
        defaultValue: 0,
        min: 0,
        helpText: 'Your current pity counter (pulls since last 5-star).',
      },
      {
        id: 'pricePerPull',
        label: 'Cost per Pull (USD)',
        type: 'number',
        defaultValue: 1.6,
        step: 0.01,
        min: 0,
        helpText: 'Cost in USD per pull.',
      },
    ],
    formulas: [
      {
        id: 'baseRate',
        expression: 'baseRatePercent / 100',
        dependencies: ['baseRatePercent'],
      },
      {
        id: 'pullsUntilPity',
        expression: 'pityAt - currentPity',
        dependencies: ['pityAt', 'currentPity'],
      },
      {
        id: 'effectivePulls',
        expression: 'min(pulls, pullsUntilPity)',
        dependencies: ['pulls', 'pullsUntilPity'],
      },
      {
        id: 'probAtLeastOne',
        expression: '(1 - pow(1 - baseRate, pulls)) * 100',
        dependencies: ['baseRate', 'pulls'],
      },
      {
        id: 'expectedPullsForOne',
        expression: '1 / baseRate',
        dependencies: ['baseRate'],
      },
      {
        id: 'totalCost',
        expression: 'pulls * pricePerPull',
        dependencies: ['pulls', 'pricePerPull'],
      },
      {
        id: 'guaranteedItems',
        expression: 'floor((currentPity + pulls) / pityAt)',
        dependencies: ['currentPity', 'pulls', 'pityAt'],
      },
    ],
    outputs: [
      {
        id: 'probAtLeastOneOut',
        label: 'Probability (at least 1)',
        formulaRef: 'probAtLeastOne',
        precision: 2,
        suffix: '%',
        highlight: true,
      },
      {
        id: 'guaranteedItemsOut',
        label: 'Guaranteed Items (via pity)',
        formulaRef: 'guaranteedItems',
        precision: 0,
      },
      {
        id: 'expectedPullsForOneOut',
        label: 'Expected Pulls for 1 Item',
        formulaRef: 'expectedPullsForOne',
        precision: 1,
      },
      {
        id: 'totalCostOut',
        label: 'Estimated Cost',
        formulaRef: 'totalCost',
        format: 'currency',
        precision: 2,
      },
    ],
    guide: {
      whatIsIt:
        'The Gacha Probability Calculator uses geometric probability to tell you the chance of getting at least one featured item across N pulls. P(at least 1) = 1 - (1 - rate)^N. The pity system guarantees you receive the item at a fixed pull count regardless of random luck.',
      howToUse:
        'Enter the base rate percentage (e.g. 0.6 for Genshin), how many pulls you plan to do, where pity is guaranteed (e.g. 90), your current pity counter, and the cost per pull. The calculator shows your probability, guaranteed items, expected pulls, and total spending.',
      exampleScenario:
        'Genshin Impact: 0.6% rate, hard pity at 90, current pity at 45. Doing 45 more pulls guarantees 1 item. Probability of hitting it randomly in those 45 pulls is approximately 23.7%. Total cost at $1.60/pull: $72.',
      proTip:
        'Always pull to soft pity (74 in Genshin) if you are committed — the rate increases sharply after that point. Never pull for characters you are indifferent about: the probability math means you will spend far more than the expected value suggests when luck goes cold. Set a budget cap before you open the banner screen.',
    },
    metadata: { version: '1.0.0' },
  },

  // ─── 65. Twitch Revenue ──────────────────────────────────────────────
  {
    id: 'twitch-revenue',
    slug: 'twitch-revenue',
    title: 'Twitch Revenue Estimator',
    description: 'Estimate monthly Twitch income from subscriptions, Bits, and ad revenue based on viewer count and streaming hours.',
    icon: '💜',
    category: 'gaming',
    subcategory: 'streaming',
    tags: ['twitch', 'streaming', 'revenue', 'subs', 'bits', 'ads', 'income', 'content creator'],
    inputs: [
      {
        id: 'avgViewers',
        label: 'Avg Concurrent Viewers',
        type: 'number',
        defaultValue: 100,
        min: 1,
        helpText: 'Average concurrent viewers during streams.',
      },
      {
        id: 'subs',
        label: 'Active Subscribers',
        type: 'number',
        defaultValue: 50,
        min: 0,
        helpText: 'Total active subscribers.',
      },
      {
        id: 'subTier',
        label: 'Subscription Tier',
        type: 'select',
        defaultValue: '4.99',
        options: [
          { label: 'Tier 1 ($4.99)', value: '4.99' },
          { label: 'Tier 2 ($9.99)', value: '9.99' },
          { label: 'Tier 3 ($24.99)', value: '24.99' },
        ],
      },
      {
        id: 'subSplit',
        label: 'Sub Revenue Split',
        type: 'select',
        defaultValue: '0.5',
        options: [
          { label: '50/50 (Standard Affiliate/Partner)', value: '0.5' },
          { label: '60/40 (Partner+)', value: '0.6' },
          { label: '70/30 (Elite Partner)', value: '0.7' },
        ],
      },
      {
        id: 'bitsPerMonth',
        label: 'Bits Cheered per Month',
        type: 'number',
        defaultValue: 5000,
        min: 0,
        helpText: '100 Bits = $1.00 to the streamer.',
      },
      {
        id: 'adsPerHour',
        label: 'Ad Breaks per Hour',
        type: 'number',
        defaultValue: 2,
        min: 0,
        helpText: 'Ad breaks run per hour of stream.',
      },
      {
        id: 'hoursStreamed',
        label: 'Hours Streamed per Month',
        type: 'number',
        defaultValue: 80,
        min: 0,
      },
      {
        id: 'cpmRate',
        label: 'Ad CPM (USD per 1,000 views)',
        type: 'number',
        defaultValue: 2.5,
        step: 0.1,
        min: 0,
        helpText: 'Typical Twitch CPM: $2-$5. Varies by season and audience.',
      },
    ],
    formulas: [
      {
        id: 'subRevenue',
        expression: 'subs * subTier * subSplit',
        dependencies: ['subs', 'subTier', 'subSplit'],
      },
      {
        id: 'bitsRevenue',
        expression: 'bitsPerMonth * 0.01',
        dependencies: ['bitsPerMonth'],
      },
      {
        id: 'adRevenue',
        expression: '(avgViewers * adsPerHour * hoursStreamed * 0.333 * cpmRate) / 1000',
        dependencies: ['avgViewers', 'adsPerHour', 'hoursStreamed', 'cpmRate'],
      },
      {
        id: 'monthlyRevenue',
        expression: 'subRevenue + bitsRevenue + adRevenue',
        dependencies: ['subRevenue', 'bitsRevenue', 'adRevenue'],
      },
      {
        id: 'annualRevenue',
        expression: 'monthlyRevenue * 12',
        dependencies: ['monthlyRevenue'],
      },
    ],
    outputs: [
      {
        id: 'monthlyRevenueOut',
        label: 'Estimated Monthly Revenue',
        formulaRef: 'monthlyRevenue',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
      {
        id: 'subRevenueOut',
        label: 'Sub Revenue',
        formulaRef: 'subRevenue',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'bitsRevenueOut',
        label: 'Bits Revenue',
        formulaRef: 'bitsRevenue',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'adRevenueOut',
        label: 'Ad Revenue',
        formulaRef: 'adRevenue',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'annualRevenueOut',
        label: 'Annual Estimate',
        formulaRef: 'annualRevenue',
        format: 'currency',
        precision: 2,
      },
    ],
    guide: {
      whatIsIt:
        'The Twitch Revenue Estimator models three primary income streams: subscription revenue (subs x tier price x your revenue split), Bits cheering (100 Bits = $1.00 to you), and ad revenue (viewers x ad frequency x hours streamed x CPM). These are the most consistent income sources for most streamers.',
      howToUse:
        'Enter your average concurrent viewers, active sub count, sub tier, Twitch revenue split, monthly Bits, ad frequency, hours streamed, and CPM rate. The calculator splits out each revenue category and shows monthly and annual totals.',
      exampleScenario:
        '100 viewers, 50 Tier 1 subs, 50/50 split, 5,000 Bits/month, 2 ads/hour, 80 hours/month, $2.50 CPM: Sub revenue = $124.75, Bits = $50, Ads = $13.32. Total = approximately $188/month or $2,256/year.',
      proTip:
        'Subscriptions are your most stable income — focus on community retention first. Ad revenue scales heavily with viewer count and becomes more significant at 500+ concurrent viewers. The holiday season (Q4) typically sees CPM rates 2-3x higher than Q1. Diversify with merchandise, Patreon, and brand deals once you exceed 500 average viewers.',
    },
    metadata: { version: '1.0.0' },
  },

  // ─── 66. PC Bottleneck Estimator ─────────────────────────────────────
  {
    id: 'pc-bottleneck',
    slug: 'pc-bottleneck',
    title: 'PC Bottleneck Estimator',
    description: 'Estimate the CPU-GPU performance imbalance in your build using benchmark scores and target resolution.',
    icon: '💻',
    category: 'gaming',
    subcategory: 'streaming',
    tags: ['bottleneck', 'cpu', 'gpu', 'pc build', 'benchmark', 'performance', 'gaming pc'],
    inputs: [
      {
        id: 'cpuScore',
        label: 'CPU Benchmark Score',
        type: 'number',
        defaultValue: 12000,
        min: 1,
        helpText: 'CPU benchmark score (e.g. Cinebench R23 multicore or PassMark). Higher = faster.',
      },
      {
        id: 'gpuScore',
        label: 'GPU Benchmark Score',
        type: 'number',
        defaultValue: 15000,
        min: 1,
        helpText: 'GPU benchmark score (e.g. 3DMark or PassMark GPU). Higher = faster.',
      },
      {
        id: 'resolution',
        label: 'Target Resolution',
        type: 'select',
        defaultValue: '1.0',
        options: [
          { label: '1080p (GPU matters less)', value: '0.8' },
          { label: '1440p (balanced)', value: '1.0' },
          { label: '4K (GPU matters more)', value: '1.3' },
        ],
      },
    ],
    formulas: [
      {
        id: 'diff',
        expression: 'abs(cpuScore - gpuScore)',
        dependencies: ['cpuScore', 'gpuScore'],
      },
      {
        id: 'maxScore',
        expression: 'max(cpuScore, gpuScore)',
        dependencies: ['cpuScore', 'gpuScore'],
      },
      {
        id: 'rawBottleneck',
        expression: '(diff / maxScore) * 100',
        dependencies: ['diff', 'maxScore'],
      },
      {
        id: 'bottleneckPercent',
        expression: 'rawBottleneck * resolution',
        dependencies: ['rawBottleneck', 'resolution'],
      },
      {
        id: 'limitedBy',
        expression: 'cpuScore < gpuScore ? 1 : 2',
        dependencies: ['cpuScore', 'gpuScore'],
      },
    ],
    outputs: [
      {
        id: 'bottleneckPercentOut',
        label: 'Estimated Bottleneck',
        formulaRef: 'bottleneckPercent',
        precision: 1,
        suffix: '%',
        highlight: true,
      },
      {
        id: 'limitedByOut',
        label: 'Limited By (1=CPU, 2=GPU)',
        formulaRef: 'limitedBy',
        precision: 0,
      },
    ],
    guide: {
      whatIsIt:
        'The PC Bottleneck Estimator calculates the performance imbalance between CPU and GPU using a simple ratio of their benchmark scores. A higher percentage means greater mismatch — the faster component sits idle waiting for the slower one. Resolution is factored in because at 4K the GPU does far more work, making a slow GPU a greater limiting factor.',
      howToUse:
        'Find your CPU score from PassMark or Cinebench R23 and your GPU score from PassMark GPU or 3DMark TimeSpy. Enter both scores and select your gaming resolution. Bottleneck below 10% is considered balanced; 10-20% is mild; above 20% is significant.',
      exampleScenario:
        'CPU score 12,000, GPU score 15,000, at 1440p: raw gap is 20%, resolution-adjusted bottleneck = 20%. The GPU is faster (output: 2 = GPU limited from CPU side), meaning the CPU is the limiting component in CPU-bound games.',
      proTip:
        'Bottleneck estimation is inherently game- and workload-dependent. This uses a simplified ratio model. For accurate analysis, use real-world benchmarks and Task Manager CPU/GPU utilization during gameplay. If your CPU is pinned at 100% while GPU sits at 60-70%, you have a real CPU bottleneck. Actual in-game impact is usually 5-15% less than online tool estimates.',
    },
    metadata: { version: '1.0.0' },
  },

  // ─── 67. ELO Rating Calculator ──────────────────────────────────────
  {
    id: 'elo-rating',
    slug: 'elo-rating',
    title: 'ELO Rating Calculator',
    description: 'Calculate post-match ELO rating changes using the FIDE formula with adjustable K-factor for any competitive game.',
    icon: '📈',
    category: 'gaming',
    subcategory: 'performance',
    tags: ['elo', 'rating', 'chess', 'ranked', 'mmr', 'competitive', 'fide', 'k-factor'],
    inputs: [
      {
        id: 'playerRating',
        label: 'Your Current ELO',
        type: 'number',
        defaultValue: 1500,
        min: 0,
        helpText: 'Your current ELO rating.',
      },
      {
        id: 'opponentRating',
        label: 'Opponent ELO',
        type: 'number',
        defaultValue: 1600,
        min: 0,
        helpText: "Your opponent's ELO rating.",
      },
      {
        id: 'result',
        label: 'Match Result',
        type: 'select',
        defaultValue: '1',
        options: [
          { label: 'Win (1.0)', value: '1' },
          { label: 'Draw (0.5)', value: '0.5' },
          { label: 'Loss (0.0)', value: '0' },
        ],
      },
      {
        id: 'kFactor',
        label: 'K-Factor',
        type: 'select',
        defaultValue: '32',
        options: [
          { label: 'K=40 (New player, <30 games)', value: '40' },
          { label: 'K=20 (Standard)', value: '20' },
          { label: 'K=10 (Established, >2400 ELO)', value: '10' },
          { label: 'K=32 (FIDE default)', value: '32' },
        ],
      },
    ],
    formulas: [
      {
        id: 'expectedScore',
        expression: '1 / (1 + pow(10, (opponentRating - playerRating) / 400))',
        dependencies: ['opponentRating', 'playerRating'],
      },
      {
        id: 'ratingChange',
        expression: 'kFactor * (result - expectedScore)',
        dependencies: ['kFactor', 'result', 'expectedScore'],
      },
      {
        id: 'newRating',
        expression: 'playerRating + ratingChange',
        dependencies: ['playerRating', 'ratingChange'],
      },
      {
        id: 'winProbability',
        expression: 'expectedScore * 100',
        dependencies: ['expectedScore'],
      },
    ],
    outputs: [
      {
        id: 'newRatingOut',
        label: 'New ELO Rating',
        formulaRef: 'newRating',
        precision: 0,
        highlight: true,
      },
      {
        id: 'ratingChangeOut',
        label: 'Rating Change',
        formulaRef: 'ratingChange',
        precision: 1,
        suffix: ' points',
      },
      {
        id: 'winProbabilityOut',
        label: 'Win Probability',
        formulaRef: 'winProbability',
        precision: 1,
        suffix: '%',
      },
    ],
    guide: {
      whatIsIt:
        'The ELO system, developed by Arpad Elo for chess, quantifies player skill as a single number. Your expected score against any opponent is E = 1 / (1 + 10^((Rb-Ra)/400)). After the game, your new rating = old rating + K x (actual score - expected score). A win scores 1.0, draw 0.5, loss 0.0.',
      howToUse:
        "Enter your current ELO, your opponent's ELO, the match result, and a K-factor. The calculator shows your expected win probability, the rating change, and your new ELO. Use K=32 for most online games; K=40 for new accounts; K=10 for elite-level play.",
      exampleScenario:
        'You: 1500 ELO, Opponent: 1600 ELO, K=32, Result: Win. Expected score = 0.360, rating change = +20.5, new ELO = 1520. You gained more because you beat a stronger opponent. A loss would have cost only -11.5 points.',
      proTip:
        'The 400-point rule: at a 400-point ELO difference, the stronger player wins about 91% of the time. Most online games use modified ELO (MMR systems) with additional factors like placement matches, win streaks, and hidden MMR. K=32 is the FIDE standard for players under 2400 with more than 30 games played.',
    },
    metadata: { version: '1.0.0' },
  },

  // ─── 68. Stream Bitrate Calculator ──────────────────────────────────
  {
    id: 'stream-bitrate',
    slug: 'stream-bitrate',
    title: 'Stream Bitrate Calculator',
    description: 'Find the optimal streaming bitrate for your resolution, check if your upload speed supports it, and estimate local recording storage.',
    icon: '📡',
    category: 'gaming',
    subcategory: 'streaming',
    tags: ['stream bitrate', 'streaming', 'twitch', 'youtube', 'obs', 'upload speed', 'encoding'],
    inputs: [
      {
        id: 'resolution',
        label: 'Stream Resolution & FPS',
        type: 'select',
        defaultValue: '6000',
        options: [
          { label: '1080p60 (Recommended: 6,000 Kbps)', value: '6000' },
          { label: '1080p30 (Recommended: 4,500 Kbps)', value: '4500' },
          { label: '720p60 (Recommended: 4,500 Kbps)', value: '4500' },
          { label: '720p30 (Recommended: 3,000 Kbps)', value: '3000' },
          { label: '480p30 (Recommended: 1,500 Kbps)', value: '1500' },
        ],
        helpText: 'Recommended bitrate for this resolution/FPS combination.',
      },
      {
        id: 'uploadSpeedMbps',
        label: 'Upload Speed (Mbps)',
        type: 'number',
        defaultValue: 50,
        min: 1,
        helpText: 'Your ISP upload speed. Use 80% of max to stay stable.',
      },
      {
        id: 'encoderOverhead',
        label: 'Headroom / Overhead (%)',
        type: 'number',
        defaultValue: 20,
        min: 0,
        max: 50,
        helpText: 'Leave 20-30% headroom for other network traffic.',
      },
    ],
    formulas: [
      {
        id: 'recommendedBitrate',
        expression: 'resolution',
        dependencies: ['resolution'],
      },
      {
        id: 'maxSafeBitrate',
        expression: 'uploadSpeedMbps * 1000 * (1 - encoderOverhead / 100)',
        dependencies: ['uploadSpeedMbps', 'encoderOverhead'],
      },
      {
        id: 'canStream',
        expression: 'maxSafeBitrate >= recommendedBitrate ? 1 : 0',
        dependencies: ['maxSafeBitrate', 'recommendedBitrate'],
      },
      {
        id: 'storagePerHour',
        expression: 'recommendedBitrate * 3600 / 8 / 1024',
        dependencies: ['recommendedBitrate'],
      },
    ],
    outputs: [
      {
        id: 'recommendedBitrateOut',
        label: 'Recommended Bitrate',
        formulaRef: 'recommendedBitrate',
        precision: 0,
        suffix: ' Kbps',
        highlight: true,
      },
      {
        id: 'maxSafeBitrateOut',
        label: 'Your Max Safe Bitrate',
        formulaRef: 'maxSafeBitrate',
        precision: 0,
        suffix: ' Kbps',
      },
      {
        id: 'canStreamOut',
        label: 'Can Stream at Quality (1=Yes, 0=Upgrade needed)',
        formulaRef: 'canStream',
        precision: 0,
      },
      {
        id: 'storagePerHourOut',
        label: 'Local Recording Size',
        formulaRef: 'storagePerHour',
        precision: 2,
        suffix: ' GB/hr',
      },
    ],
    guide: {
      whatIsIt:
        'Streaming bitrate determines the quality and data size of your video stream. Higher bitrate = better visual quality but more bandwidth consumed. The recommended bitrates follow Twitch and YouTube Live guidelines. Your upload speed must comfortably exceed the stream bitrate with overhead left over for other traffic.',
      howToUse:
        'Select your target resolution and FPS, enter your internet upload speed from a speed test (speedtest.net), and set an overhead percentage (20% is a safe default). The calculator tells you if your connection can handle the stream quality and how much local disk space a recording would use per hour.',
      exampleScenario:
        '1080p60 needs 6,000 Kbps. With 50 Mbps upload and 20% overhead: max safe bitrate = 40,000 Kbps — easily enough. Local recording at 6,000 Kbps = approximately 2.6 GB per hour.',
      proTip:
        'Twitch caps bitrate at 6,000 Kbps for most streamers (8,000 Kbps for Partners in some regions). YouTube Live supports up to 51,000 Kbps. For OBS, use the x264 or NVENC encoder at 6,000 Kbps for 1080p60. Always run a network speed test immediately before streaming — ISP speeds vary by time of day.',
    },
    metadata: { version: '1.0.0' },
  },

  // ─── 69. Ping to Distance ────────────────────────────────────────────
  {
    id: 'ping-distance',
    slug: 'ping-distance',
    title: 'Ping to Server Distance',
    description: 'Estimate the physical distance to a game server from your measured ping using the speed of light in fiber optic cable.',
    icon: '🌐',
    category: 'gaming',
    subcategory: 'streaming',
    tags: ['ping', 'latency', 'server distance', 'networking', 'ms', 'fiber', 'traceroute'],
    inputs: [
      {
        id: 'pingMs',
        label: 'Ping / Latency (ms)',
        type: 'number',
        defaultValue: 50,
        min: 1,
        helpText: 'Your round-trip latency/ping to the server in milliseconds.',
      },
      {
        id: 'numHops',
        label: 'Traceroute Hops',
        type: 'number',
        defaultValue: 10,
        min: 1,
        helpText: 'Number of network hops. More hops add routing overhead.',
      },
      {
        id: 'processingOverheadMs',
        label: 'Processing Overhead (ms)',
        type: 'number',
        defaultValue: 10,
        min: 0,
        helpText: 'Server + router processing time to subtract from measured ping.',
      },
    ],
    formulas: [
      {
        id: 'networkMs',
        expression: 'max(1, pingMs - processingOverheadMs)',
        dependencies: ['pingMs', 'processingOverheadMs'],
      },
      {
        id: 'distanceKm',
        expression: '(networkMs * 0.001 * 200000 * 0.67) / 2',
        dependencies: ['networkMs'],
      },
      {
        id: 'distanceMiles',
        expression: 'distanceKm * 0.621371',
        dependencies: ['distanceKm'],
      },
      {
        id: 'rtDelay',
        expression: 'pingMs / 2',
        dependencies: ['pingMs'],
      },
    ],
    outputs: [
      {
        id: 'distanceKmOut',
        label: 'Estimated Server Distance',
        formulaRef: 'distanceKm',
        precision: 0,
        suffix: ' km',
        highlight: true,
      },
      {
        id: 'distanceMilesOut',
        label: 'Distance in Miles',
        formulaRef: 'distanceMiles',
        precision: 0,
        suffix: ' mi',
      },
      {
        id: 'rtDelayOut',
        label: 'One-way Delay',
        formulaRef: 'rtDelay',
        precision: 1,
        suffix: ' ms',
      },
    ],
    guide: {
      whatIsIt:
        'Light travels at approximately 300,000 km/s in a vacuum but only about 200,000 km/s in fiber optic cable (roughly 0.67c, due to the glass refractive index). Your round-trip ping is the time for a signal to reach the server and return. Dividing by 2 gives one-way travel time, which estimates physical distance. Processing overhead (server tick rates, router latency) reduces the true propagation component.',
      howToUse:
        'Enter your ping in milliseconds (from an in-game display or ping command), the approximate number of network hops (from traceroute), and an estimated processing overhead. The calculator outputs the estimated straight-line server distance.',
      exampleScenario:
        '50 ms ping, 10 ms processing overhead = 40 ms network propagation. One-way = 20 ms. Distance = (20 x 0.001 x 200,000 x 0.67) / 2 = approximately 1,340 km. This is a rough estimate; actual cable paths are rarely straight.',
      proTip:
        'Real network routing adds 20-50% more cable distance than the physical straight-line distance. ISPs route traffic through peering points that may be far from the geographic direct path. The lower bound of possible ping to a server X km away is (X / 100,000) x 1000 ms. Sub-10ms ping is only achievable within approximately 300 km of a server.',
    },
    metadata: { version: '1.0.0' },
  },

  // ─── 70. RPG DPS Calculator ─────────────────────────────────────────
  {
    id: 'rpg-dps',
    slug: 'rpg-dps',
    title: 'RPG DPS Calculator',
    description: 'Calculate average DPS, critical hit contribution, and buffed damage output for RPG characters and builds.',
    icon: '⚔️',
    category: 'gaming',
    subcategory: 'rpg',
    tags: ['dps', 'damage per second', 'rpg', 'critical hit', 'crit', 'build', 'attack speed', 'theorycrafting'],
    inputs: [
      {
        id: 'baseDamage',
        label: 'Base Damage per Hit',
        type: 'number',
        defaultValue: 1000,
        min: 1,
        helpText: 'Base damage per hit without critical hits.',
      },
      {
        id: 'critRatePercent',
        label: 'Critical Rate (%)',
        type: 'number',
        defaultValue: 50,
        min: 0,
        max: 100,
        step: 1,
        placeholder: 'e.g. 50',
      },
      {
        id: 'critMultiplier',
        label: 'Critical Multiplier',
        type: 'number',
        defaultValue: 2.0,
        step: 0.1,
        min: 1,
        helpText: 'Critical hit damage multiplier (2.0 = 200% = double damage).',
      },
      {
        id: 'attacksPerSecond',
        label: 'Attacks per Second',
        type: 'number',
        defaultValue: 1.5,
        step: 0.1,
        min: 0.1,
        helpText: 'Number of attacks/hits per second.',
      },
      {
        id: 'damageBonus',
        label: 'Additional Damage Bonus (%)',
        type: 'number',
        defaultValue: 0,
        min: 0,
        helpText: 'Extra % damage from buffs, gear bonuses, or elemental reactions.',
      },
    ],
    formulas: [
      {
        id: 'critRate',
        expression: 'critRatePercent / 100',
        dependencies: ['critRatePercent'],
      },
      {
        id: 'avgHitDmg',
        expression: 'baseDamage * (1 + critRate * (critMultiplier - 1))',
        dependencies: ['baseDamage', 'critRate', 'critMultiplier'],
      },
      {
        id: 'buffedDmg',
        expression: 'avgHitDmg * (1 + damageBonus / 100)',
        dependencies: ['avgHitDmg', 'damageBonus'],
      },
      {
        id: 'dps',
        expression: 'buffedDmg * attacksPerSecond',
        dependencies: ['buffedDmg', 'attacksPerSecond'],
      },
      {
        id: 'dpsWith100Crit',
        expression: 'baseDamage * critMultiplier * attacksPerSecond * (1 + damageBonus / 100)',
        dependencies: ['baseDamage', 'critMultiplier', 'attacksPerSecond', 'damageBonus'],
      },
      {
        id: 'critContribution',
        expression: '(avgHitDmg - baseDamage) / avgHitDmg * 100',
        dependencies: ['avgHitDmg', 'baseDamage'],
      },
    ],
    outputs: [
      {
        id: 'dpsOut',
        label: 'DPS',
        formulaRef: 'dps',
        precision: 1,
        highlight: true,
      },
      {
        id: 'avgHitDmgOut',
        label: 'Avg Hit Damage',
        formulaRef: 'avgHitDmg',
        precision: 1,
      },
      {
        id: 'critContributionOut',
        label: 'Crit Damage Contribution',
        formulaRef: 'critContribution',
        precision: 1,
        suffix: '%',
      },
      {
        id: 'dpsWith100CritOut',
        label: 'DPS at 100% Crit',
        formulaRef: 'dpsWith100Crit',
        precision: 1,
      },
    ],
    guide: {
      whatIsIt:
        'DPS (Damage Per Second) is the expected average damage output per second accounting for critical hit chance and multiplier. The formula uses the expected value of a random crit: avg hit damage = base x (1 + crit rate x (crit multiplier - 1)). Buffed DPS then multiplies by attack speed and bonus damage modifiers.',
      howToUse:
        'Enter your base damage per hit (from your character stats), critical rate %, critical multiplier, attacks per second, and any additional damage bonus percentage. The calculator shows your theoretical average DPS, and compares it to the theoretical maximum at 100% crit rate.',
      exampleScenario:
        'Base damage 1,000, 50% crit rate, 2.0x crit multiplier, 1.5 attacks/second, 0% bonus: avg hit = 1,500, DPS = 2,250. At 100% crit with same setup: DPS = 3,000. Current crit rate gives 75% of maximum possible DPS.',
      proTip:
        'The crit ratio rule in many games suggests keeping crit rate and crit damage balanced. For a 2.0x crit multiplier, 50% crit rate gives 75% of 100% crit DPS — very efficient. Increasing crit rate from 50% to 100% at 2.0x multiplier doubles the crit contribution. Always compare upgrades with the same DPS formula to make data-driven gear decisions.',
    },
    metadata: { version: '1.0.0' },
  },
];
