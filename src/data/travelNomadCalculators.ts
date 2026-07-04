// ---------------------------------------------------------------------------
// Quantify � Travel & Digital Nomad Calculators
// ---------------------------------------------------------------------------
// 10 calculators covering tax residency (183-day rule), cost of living
// comparison, baggage fees, hotel points, currency arbitrage, passport
// validity, fuel splitting, EU flight compensation, daily budget, and
// travel insurance coverage scoring.
// ---------------------------------------------------------------------------

import type { CalculatorSchema } from '@/types/calculator';

export const travelNomadCalculators: CalculatorSchema[] = [
  // ---------------------------------------------------------------------------
  // 1. Tax Residency Day Counter (183-Day Rule)
  // ---------------------------------------------------------------------------
  {
    id: 'tax-residency-183-days',
    slug: 'tax-residency-183-days',
    title: 'Tax Residency Day Counter (183-Day Rule)',
    description:
      'Track days spent across multiple countries to assess tax residency risk under the 183-day rule and identify potential home-country tax exposure.',
    icon: '📆',
    category: 'aviation',
    subcategory: 'travel-visa',
    tags: ['tax residency', '183-day rule', 'digital nomad', 'expat', 'tax liability', 'travel days', 'visa'],
    inputs: [
      {
        id: 'daysCountry1',
        label: 'Days in Country 1',
        type: 'number',
        defaultValue: 120,
        min: 0,
        max: 366,
        step: 1,
        placeholder: 'e.g. 120',
        helpText: 'Days physically present in your first foreign country.',
      },
      {
        id: 'daysCountry2',
        label: 'Days in Country 2',
        type: 'number',
        defaultValue: 90,
        min: 0,
        max: 366,
        step: 1,
        placeholder: 'e.g. 90',
        helpText: 'Days physically present in your second foreign country.',
      },
      {
        id: 'daysCountry3',
        label: 'Days in Country 3',
        type: 'number',
        defaultValue: 60,
        min: 0,
        max: 366,
        step: 1,
        placeholder: 'e.g. 60',
        helpText: 'Days physically present in your third foreign country.',
      },
      {
        id: 'daysHome',
        label: 'Days in Home Country',
        type: 'number',
        defaultValue: 95,
        min: 0,
        max: 366,
        step: 1,
        placeholder: 'e.g. 95',
        helpText: 'Days spent in your home country during the year.',
      },
    ],
    formulas: [
      {
        id: 'totalDays',
        expression: 'daysCountry1 + daysCountry2 + daysCountry3 + daysHome',
        dependencies: ['daysCountry1', 'daysCountry2', 'daysCountry3', 'daysHome'],
      },
      {
        id: 'c1Tax',
        expression: 'daysCountry1 >= 183 ? 1 : 0',
        dependencies: ['daysCountry1'],
      },
      {
        id: 'c2Tax',
        expression: 'daysCountry2 >= 183 ? 1 : 0',
        dependencies: ['daysCountry2'],
      },
      {
        id: 'c3Tax',
        expression: 'daysCountry3 >= 183 ? 1 : 0',
        dependencies: ['daysCountry3'],
      },
      {
        id: 'homeRisk',
        expression: 'daysHome >= 183 ? 1 : 0',
        dependencies: ['daysHome'],
      },
    ],
    outputs: [
      {
        id: 'totalDaysOut',
        label: 'Total Days Tracked',
        formulaRef: 'totalDays',
        format: 'number',
        precision: 0,
      },
      {
        id: 'daysCountry1Out',
        label: 'Days Country 1',
        formulaRef: 'daysCountry1',
        format: 'number',
        precision: 0,
      },
      {
        id: 'c1TaxOut',
        label: 'Country 1 Tax Resident? (1=Yes)',
        formulaRef: 'c1Tax',
        format: 'number',
        precision: 0,
      },
      {
        id: 'homeRiskOut',
        label: 'Home Country Tax Risk (1=Yes)',
        formulaRef: 'homeRisk',
        format: 'number',
        precision: 0,
        highlight: true,
      },
    ],
    guide: {
      whatIsIt:
        'The 183-Day Rule is a common threshold used by many countries to determine tax residency: if you spend 183 or more days in a country within a calendar year, you may be considered a tax resident there and liable for local income tax. Many countries also apply their own tiered rules, look-back periods, or tie-breaker treaty clauses.',
      howToUse:
        '1. Enter the number of days you spent (or plan to spend) in each country, including your home country.\n2. Review which countries flag as potential tax-resident status (value = 1).\n3. Pay close attention to your home country risk � staying under 183 days home is a key strategy for legal tax optimization.',
      exampleScenario:
        'A digital nomad spends 120 days in Thailand, 90 in Portugal, 60 in Mexico, and 95 at home. No single country exceeds 183 days, so no automatic tax residency is triggered in foreign countries. However, the home country may still claim residency based on other ties (domicile, family, bank accounts).',
      proTip:
        'The 183-day rule is a starting point � many countries use additional tests: habitual abode, centre of vital interests, and citizenship. The US taxes its citizens globally regardless of residency. Always consult a cross-border tax professional before making residency decisions. Territorial tax countries (Panama, Paraguay, Georgia) tax only local income and are popular among nomads.',
    },
    metadata: { version: '1.0.0' },
  },

  // ---------------------------------------------------------------------------
  // 2. Cost of Living Comparison
  // ---------------------------------------------------------------------------
  {
    id: 'cost-of-living-comparison',
    slug: 'cost-of-living-comparison',
    title: 'Cost of Living Comparison',
    description:
      'Compare your current cost of living against a target city using COL index ratios to estimate monthly expenses and potential savings as a digital nomad or expat.',
    icon: '🌍',
    category: 'aviation',
    subcategory: 'travel-visa',
    tags: ['cost of living', 'digital nomad', 'expat', 'budget', 'nomad list', 'relocation', 'monthly expenses'],
    inputs: [
      {
        id: 'currentRent',
        label: 'Current Monthly Rent ($)',
        type: 'number',
        defaultValue: 2000,
        min: 0,
        step: 10,
        placeholder: 'e.g. 2000',
        helpText: 'Your current monthly rent or housing cost.',
      },
      {
        id: 'currentFood',
        label: 'Monthly Food Budget ($)',
        type: 'number',
        defaultValue: 600,
        min: 0,
        step: 10,
        placeholder: 'e.g. 600',
        helpText: 'Monthly spending on groceries, dining, and food delivery.',
      },
      {
        id: 'currentTransport',
        label: 'Monthly Transport ($)',
        type: 'number',
        defaultValue: 300,
        min: 0,
        step: 10,
        placeholder: 'e.g. 300',
        helpText: 'Monthly spending on transport, fuel, or transit passes.',
      },
      {
        id: 'targetCOLIndex',
        label: 'Target City COL Index',
        type: 'number',
        defaultValue: 45,
        min: 1,
        max: 200,
        step: 1,
        placeholder: 'e.g. 45',
        helpText: 'NYC=100, Bangkok=35, Lisbon=55, Bali=30',
      },
      {
        id: 'currentCOLIndex',
        label: 'Your Current City COL Index',
        type: 'number',
        defaultValue: 100,
        min: 1,
        max: 200,
        step: 1,
        placeholder: 'e.g. 100',
        helpText: 'Set 100 for New York City as baseline.',
      },
    ],
    formulas: [
      {
        id: 'currentTotal',
        expression: 'currentRent + currentFood + currentTransport',
        dependencies: ['currentRent', 'currentFood', 'currentTransport'],
      },
      {
        id: 'ratio',
        expression: 'targetCOLIndex / currentCOLIndex',
        dependencies: ['targetCOLIndex', 'currentCOLIndex'],
      },
      {
        id: 'targetRent',
        expression: 'currentRent * ratio',
        dependencies: ['currentRent', 'ratio'],
      },
      {
        id: 'targetFood',
        expression: 'currentFood * ratio',
        dependencies: ['currentFood', 'ratio'],
      },
      {
        id: 'targetTransport',
        expression: 'currentTransport * ratio',
        dependencies: ['currentTransport', 'ratio'],
      },
      {
        id: 'targetTotal',
        expression: 'currentTotal * ratio',
        dependencies: ['currentTotal', 'ratio'],
      },
      {
        id: 'monthlySavings',
        expression: 'currentTotal - targetTotal',
        dependencies: ['currentTotal', 'targetTotal'],
      },
    ],
    outputs: [
      {
        id: 'targetTotalOut',
        label: 'Estimated Monthly Expenses',
        formulaRef: 'targetTotal',
        format: 'number',
        prefix: '$',
        precision: 0,
        highlight: true,
      },
      {
        id: 'monthlySavingsOut',
        label: 'Monthly Savings',
        formulaRef: 'monthlySavings',
        format: 'number',
        prefix: '$',
        precision: 0,
      },
      {
        id: 'ratioOut',
        label: 'Cost Ratio',
        formulaRef: 'ratio',
        format: 'number',
        precision: 2,
      },
    ],
    guide: {
      whatIsIt:
        'A Cost of Living (COL) index scales living expenses in a city relative to a benchmark (usually New York City = 100). Using the ratio between two cities you can estimate what your current expenses would translate to in a new location, accounting for rent, food, and transport categories.',
      howToUse:
        '1. Enter your current monthly rent, food, and transport budgets.\n2. Enter the COL index for your current city and the target city (find these on Numbeo or Nomad List).\nThe calculator scales your expenses proportionally and shows your estimated monthly savings from relocating.',
      exampleScenario:
        'A New Yorker (COL=100) spending $2,900/month total moves to Lisbon (COL=55). Ratio = 0.55. Estimated Lisbon expenses = $1,595/month. Monthly savings = $1,305 � or $15,660 per year at the same lifestyle standard.',
      proTip:
        'COL indices are averages � your actual savings depend heavily on your accommodation choices. Furnished short-term rentals can be 2x pricier than local long-term leases. Research the specific neighbourhood you plan to live in. Also factor in internet quality (check speedtest.net for country averages), healthcare costs, and visa/banking fees not captured in COL indexes.',
    },
    metadata: { version: '1.0.0' },
  },

  // ---------------------------------------------------------------------------
  // 3. Airline Baggage Fee Estimator
  // ---------------------------------------------------------------------------
  {
    id: 'airline-baggage-fee-estimator',
    slug: 'airline-baggage-fee-estimator',
    title: 'Airline Baggage Fee Estimator',
    description:
      'Calculate total airline baggage fees including overweight charges before you fly to avoid surprise costs at the airport check-in counter.',
    icon: '✈',
    category: 'aviation',
    subcategory: 'travel-visa',
    tags: ['baggage fee', 'airline', 'overweight', 'checked bag', 'travel cost', 'airport', 'carry-on'],
    inputs: [
      {
        id: 'bags',
        label: 'Number of Checked Bags',
        type: 'number',
        defaultValue: 1,
        min: 0,
        max: 10,
        step: 1,
        placeholder: 'e.g. 1',
        helpText: 'Total checked bags you plan to bring.',
      },
      {
        id: 'weightKg',
        label: 'Bag Weight (kg)',
        type: 'number',
        defaultValue: 23,
        min: 0,
        step: 0.1,
        placeholder: 'e.g. 23',
        helpText: 'Weight of your heaviest checked bag in kilograms.',
      },
      {
        id: 'overweightThreshold',
        label: 'Free Weight Allowance (kg)',
        type: 'number',
        defaultValue: 23,
        min: 0,
        step: 1,
        placeholder: 'e.g. 23',
        helpText: 'Your fare class bag weight limit (typically 23kg economy, 32kg business).',
      },
      {
        id: 'firstBagFee',
        label: '1st Bag Fee ($)',
        type: 'number',
        defaultValue: 35,
        min: 0,
        step: 1,
        placeholder: 'e.g. 35',
        helpText: 'Check your airline website � free on many routes with status.',
      },
      {
        id: 'additionalBagFee',
        label: 'Additional Bag Fee ($)',
        type: 'number',
        defaultValue: 45,
        min: 0,
        step: 1,
        placeholder: 'e.g. 45',
        helpText: 'Fee per bag for bags beyond the first.',
      },
      {
        id: 'overweightFee',
        label: 'Overweight Fee (per kg over limit)',
        type: 'number',
        defaultValue: 100,
        min: 0,
        step: 1,
        placeholder: 'e.g. 100',
        helpText: 'Fee per kilogram exceeding the weight allowance.',
      },
    ],
    formulas: [
      {
        id: 'baseFee',
        expression: 'firstBagFee + max(0, bags - 1) * additionalBagFee',
        dependencies: ['firstBagFee', 'bags', 'additionalBagFee'],
      },
      {
        id: 'overweightKg',
        expression: 'max(0, weightKg - overweightThreshold)',
        dependencies: ['weightKg', 'overweightThreshold'],
      },
      {
        id: 'overweightCharge',
        expression: 'overweightKg * overweightFee',
        dependencies: ['overweightKg', 'overweightFee'],
      },
      {
        id: 'totalFee',
        expression: 'baseFee + overweightCharge',
        dependencies: ['baseFee', 'overweightCharge'],
      },
    ],
    outputs: [
      {
        id: 'baseFeeOut',
        label: 'Bag Fees',
        formulaRef: 'baseFee',
        format: 'number',
        prefix: '$',
        precision: 0,
      },
      {
        id: 'overweightChargeOut',
        label: 'Overweight Fees',
        formulaRef: 'overweightCharge',
        format: 'number',
        prefix: '$',
        precision: 0,
      },
      {
        id: 'totalFeeOut',
        label: 'Total Baggage Fee',
        formulaRef: 'totalFee',
        format: 'number',
        prefix: '$',
        precision: 0,
        highlight: true,
      },
    ],
    guide: {
      whatIsIt:
        'Airline baggage fees have become a significant revenue source for carriers, generating over $6 billion annually in the US alone. Fees vary by airline, route, fare class, and loyalty status. Understanding the fee structure before packing lets you make informed decisions about what to bring versus ship.',
      howToUse:
        '1. Enter how many bags you plan to check and the weight of your heaviest bag.\n2. Enter the airline\'s weight allowance and fee schedule (check the airline website).\nThe calculator adds bag fees plus any overweight surcharges to show your total baggage cost.',
      exampleScenario:
        'Travelling with 2 bags, each 23kg on a $35 first-bag / $45 second-bag policy with a 23kg limit: Base fee = $80. No overweight. Total = $80. If one bag weighs 27kg with $100/kg overweight fee: extra $400. Total = $480 � a powerful incentive to repack.',
      proTip:
        'Book bags online before check-in � most airlines charge 20�50% more at the airport. Airline credit cards often include a free first checked bag ($50�$70 value per round trip). If shipping internationally, compare with FedEx/DHL International Economy � heavy items are often cheaper to ship ahead than to pay overweight fees across multiple flights.',
    },
    metadata: { version: '1.0.0' },
  },

  // ---------------------------------------------------------------------------
  // 4. Hotel Points vs Cash Value Calculator
  // ---------------------------------------------------------------------------
  {
    id: 'hotel-points-vs-cash',
    slug: 'hotel-points-vs-cash',
    title: 'Hotel Points vs Cash Value Calculator',
    description:
      'Calculate the cents-per-point (CPP) value of your hotel loyalty points, how many nights you can book, and whether redeeming points or paying cash is the smarter choice.',
    icon: '🏨',
    category: 'aviation',
    subcategory: 'travel-visa',
    tags: ['hotel points', 'loyalty program', 'cents per point', 'marriott', 'hilton', 'hyatt', 'award night', 'travel hacking'],
    inputs: [
      {
        id: 'pointsRequired',
        label: 'Points Required for Night',
        type: 'number',
        defaultValue: 25000,
        min: 1,
        step: 500,
        placeholder: 'e.g. 25000',
        helpText: 'Points needed for one award night at this property.',
      },
      {
        id: 'cashRateUSD',
        label: 'Cash Rate for Same Room ($)',
        type: 'number',
        defaultValue: 200,
        min: 0,
        step: 1,
        placeholder: 'e.g. 200',
        helpText: 'The cash price for the same room on the same date.',
      },
      {
        id: 'pointsOwned',
        label: 'Points in Your Account',
        type: 'number',
        defaultValue: 50000,
        min: 0,
        step: 1000,
        placeholder: 'e.g. 50000',
        helpText: 'Your current hotel points balance.',
      },
      {
        id: 'annualFee',
        label: 'Annual Card Fee ($)',
        type: 'number',
        defaultValue: 95,
        min: 0,
        step: 1,
        placeholder: 'e.g. 95',
        helpText: 'Annual fee of the co-branded hotel card, if applicable.',
      },
    ],
    formulas: [
      {
        id: 'cppValue',
        expression: 'cashRateUSD / pointsRequired * 100',
        dependencies: ['cashRateUSD', 'pointsRequired'],
      },
      {
        id: 'nightsAvailable',
        expression: 'floor(pointsOwned / pointsRequired)',
        dependencies: ['pointsOwned', 'pointsRequired'],
      },
      {
        id: 'totalValue',
        expression: 'nightsAvailable * cashRateUSD',
        dependencies: ['nightsAvailable', 'cashRateUSD'],
      },
      {
        id: 'netValue',
        expression: 'totalValue - annualFee',
        dependencies: ['totalValue', 'annualFee'],
      },
    ],
    outputs: [
      {
        id: 'cppValueOut',
        label: 'Cents Per Point (CPP)',
        formulaRef: 'cppValue',
        format: 'number',
        suffix: ' cpp',
        precision: 2,
        highlight: true,
      },
      {
        id: 'nightsAvailableOut',
        label: 'Nights You Can Book',
        formulaRef: 'nightsAvailable',
        format: 'number',
        precision: 0,
      },
      {
        id: 'netValueOut',
        label: 'Net Value of Points',
        formulaRef: 'netValue',
        format: 'number',
        prefix: '$',
        precision: 0,
      },
    ],
    guide: {
      whatIsIt:
        'Cents Per Point (CPP) is the standard metric for evaluating hotel loyalty redemptions. It tells you what each point is worth in real dollar terms when redeemed for a specific night. Comparing your CPP to the program\'s average point value determines whether a redemption is good or poor.',
      howToUse:
        '1. Look up the points required for your desired hotel night and the equivalent cash rate.\n2. Enter your total points balance and any annual card fee.\nThe calculator shows CPP, how many nights you can book, and the net dollar value of your points balance.',
      exampleScenario:
        'Hyatt award requiring 25,000 points for a $200/night room. CPP = $200/25,000 x 100 = 0.8 cpp � below the 1.5 cpp benchmark. With 50,000 points, you can book 2 nights ($400 value). Minus $95 card fee = $305 net value. Consider waiting for a better redemption opportunity.',
      proTip:
        'Good redemption targets: Hyatt > 1.7 cpp, Marriott > 0.8 cpp, Hilton > 0.5 cpp. Premium and resort properties often yield 2�5 cpp because cash rates are inflated but point costs are capped. Transfer hotel points to airline miles only as a last resort � the rate is almost always unfavourable. Book award nights for high-demand dates (holiday weekends, conferences) for maximum CPP.',
    },
    metadata: { version: '1.0.0' },
  },

  // ---------------------------------------------------------------------------
  // 5. Currency Arbitrage Calculator
  // ---------------------------------------------------------------------------
  {
    id: 'currency-arbitrage-calculator',
    slug: 'currency-arbitrage-calculator',
    title: 'Currency Arbitrage Calculator',
    description:
      'Calculate potential triangular currency arbitrage profit or loss across three currency pairs to identify theoretical mispricings in forex markets.',
    icon: '💱',
    category: 'conversion',
    subcategory: 'currency',
    tags: ['currency arbitrage', 'triangular arbitrage', 'forex', 'exchange rate', 'currency trading', 'usd', 'eur', 'gbp'],
    inputs: [
      {
        id: 'usdToEur',
        label: 'USD to EUR Rate',
        type: 'number',
        defaultValue: 0.92,
        min: 0.001,
        step: 0.001,
        placeholder: 'e.g. 0.92',
        helpText: 'Units of EUR per 1 USD.',
      },
      {
        id: 'eurToGbp',
        label: 'EUR to GBP Rate',
        type: 'number',
        defaultValue: 0.86,
        min: 0.001,
        step: 0.001,
        placeholder: 'e.g. 0.86',
        helpText: 'Units of GBP per 1 EUR.',
      },
      {
        id: 'gbpToUsd',
        label: 'GBP to USD Rate',
        type: 'number',
        defaultValue: 1.27,
        min: 0.001,
        step: 0.001,
        placeholder: 'e.g. 1.27',
        helpText: 'Units of USD per 1 GBP.',
      },
      {
        id: 'startUsd',
        label: 'Starting USD',
        type: 'number',
        defaultValue: 10000,
        min: 1,
        step: 100,
        placeholder: 'e.g. 10000',
        helpText: 'Starting capital in USD for the round-trip conversion.',
      },
    ],
    formulas: [
      {
        id: 'step1Eur',
        expression: 'startUsd * usdToEur',
        dependencies: ['startUsd', 'usdToEur'],
      },
      {
        id: 'step2Gbp',
        expression: 'step1Eur * eurToGbp',
        dependencies: ['step1Eur', 'eurToGbp'],
      },
      {
        id: 'step3Usd',
        expression: 'step2Gbp * gbpToUsd',
        dependencies: ['step2Gbp', 'gbpToUsd'],
      },
      {
        id: 'profit',
        expression: 'step3Usd - startUsd',
        dependencies: ['step3Usd', 'startUsd'],
      },
      {
        id: 'profitPct',
        expression: '(step3Usd - startUsd) / startUsd * 100',
        dependencies: ['step3Usd', 'startUsd'],
      },
    ],
    outputs: [
      {
        id: 'step3UsdOut',
        label: 'USD After Triangle',
        formulaRef: 'step3Usd',
        format: 'number',
        prefix: '$',
        precision: 2,
      },
      {
        id: 'profitOut',
        label: 'Arbitrage Profit/Loss',
        formulaRef: 'profit',
        format: 'number',
        prefix: '$',
        precision: 2,
        highlight: true,
      },
      {
        id: 'profitPctOut',
        label: 'Profit %',
        formulaRef: 'profitPct',
        format: 'number',
        suffix: '%',
        precision: 3,
      },
    ],
    guide: {
      whatIsIt:
        'Triangular arbitrage exploits price discrepancies between three currency pairs. By converting USD ? EUR ? GBP ? USD, a theoretical profit emerges when the rates are misaligned. In practice, electronic markets close these gaps in milliseconds, but the calculator is useful for understanding cross-rate math and spotting unfavorable travel money exchange chains.',
      howToUse:
        '1. Enter the current exchange rates for USD/EUR, EUR/GBP, and GBP/USD.\n2. Enter your starting capital.\nThe calculator traces the full triangle and shows how much USD you end with after three conversions, revealing any gain or loss.',
      exampleScenario:
        '$10,000 ? x0.92 = �9,200 ? x0.86 = �7,912 ? x1.27 = $10,048.24. Profit = $48.24 (0.48%). In reality, bid-ask spreads of 0.02�0.1% on each leg consume all profit for retail traders � but shows the math clearly.',
      proTip:
        'For travellers, this calculator reveals if you are losing money by exchanging through intermediary currencies. Always compare the direct USD?target currency rate against the multi-hop route. Airport kiosks often have 5�10% implicit spreads � use a Wise or Revolut card to get interbank rates with small flat fees instead.',
    },
    metadata: { version: '1.0.0' },
  },

  // ---------------------------------------------------------------------------
  // 6. Passport 6-Month Validity Checker
  // ---------------------------------------------------------------------------
  {
    id: 'passport-validity-checker',
    slug: 'passport-validity-checker',
    title: 'Passport 6-Month Validity Checker',
    description:
      'Check if your passport meets the minimum validity requirements for your destination based on the 6-month rule, 3-month rule, or arrival-only validity policies.',
    icon: '📄',
    category: 'aviation',
    subcategory: 'travel-visa',
    tags: ['passport validity', '6-month rule', 'schengen', 'visa', 'travel documents', 'expiry', 'border entry'],
    inputs: [
      {
        id: 'monthsUntilExpiry',
        label: 'Months Until Passport Expires',
        type: 'number',
        defaultValue: 8,
        min: 0,
        max: 120,
        step: 1,
        placeholder: 'e.g. 8',
        helpText: 'Approximate months remaining until your passport expires.',
      },
      {
        id: 'tripDurationDays',
        label: 'Trip Duration (days)',
        type: 'number',
        defaultValue: 14,
        min: 1,
        max: 365,
        step: 1,
        placeholder: 'e.g. 14',
        helpText: 'How many days your trip will last.',
      },
      {
        id: 'destinationRule',
        label: 'Destination Validity Rule',
        type: 'select',
        defaultValue: '6',
        options: [
          { label: '6-Month Rule (Schengen/most)', value: '6' },
          { label: '3-Month Rule (some)', value: '3' },
          { label: 'Valid on arrival only', value: '0' },
        ],
        helpText: 'Check IATA Travel Centre or your airline for the exact rule.',
      },
    ],
    formulas: [
      {
        id: 'daysUntilExpiry',
        expression: 'monthsUntilExpiry * 30.4',
        dependencies: ['monthsUntilExpiry'],
      },
      {
        id: 'daysNeeded',
        expression: 'tripDurationDays + destinationRule * 30',
        dependencies: ['tripDurationDays', 'destinationRule'],
      },
      {
        id: 'safetyMarginDays',
        expression: 'daysUntilExpiry - daysNeeded',
        dependencies: ['daysUntilExpiry', 'daysNeeded'],
      },
      {
        id: 'isValid',
        expression: 'safetyMarginDays >= 0 ? 1 : 0',
        dependencies: ['safetyMarginDays'],
      },
    ],
    outputs: [
      {
        id: 'daysUntilExpiryOut',
        label: 'Days Until Expiry',
        formulaRef: 'daysUntilExpiry',
        format: 'number',
        precision: 0,
        suffix: ' days',
      },
      {
        id: 'daysNeededOut',
        label: 'Minimum Days Required',
        formulaRef: 'daysNeeded',
        format: 'number',
        precision: 0,
        suffix: ' days',
      },
      {
        id: 'safetyMarginDaysOut',
        label: 'Safety Margin',
        formulaRef: 'safetyMarginDays',
        format: 'number',
        precision: 0,
        suffix: ' days',
        highlight: true,
      },
      {
        id: 'isValidOut',
        label: 'Passport Valid? (1=Yes 0=No)',
        formulaRef: 'isValid',
        format: 'number',
        precision: 0,
      },
    ],
    guide: {
      whatIsIt:
        'Many countries require your passport to be valid for 3 or 6 months beyond your intended departure date � not just valid for the trip duration. Failing this requirement can result in denied boarding by the airline or refusal of entry at the border.',
      howToUse:
        '1. Enter how many months remain until your passport expires.\n2. Enter your planned trip duration.\n3. Select the validity rule for your destination.\nThe calculator converts to days and checks if your passport has enough validity remaining.',
      exampleScenario:
        'Passport expires in 8 months (243 days). Planning a 14-day trip to Schengen (6-month rule). Days needed = 14 + 180 = 194 days. Safety margin = 243 - 194 = 49 days. Valid � but cutting it close. Renew before any subsequent Schengen trips.',
      proTip:
        'Airlines are legally responsible for returning passengers denied entry, so they enforce validity rules strictly at check-in. Renew your passport when you have less than 12 months remaining to ensure flexibility. US passport renewal currently takes 6�10 weeks (or 2�3 weeks expedited). Keep a scanned copy in cloud storage as a backup.',
    },
    metadata: { version: '1.0.0' },
  },

  // ---------------------------------------------------------------------------
  // 7. Road Trip Fuel Cost Splitter
  // ---------------------------------------------------------------------------
  {
    id: 'fuel-cost-splitter',
    slug: 'fuel-cost-splitter',
    title: 'Road Trip Fuel Cost Splitter',
    description:
      'Calculate total road trip fuel cost and split it fairly between passengers based on distance, fuel efficiency, and current fuel prices.',
    icon: '⛽',
    category: 'automotive',
    subcategory: 'travel-calc',
    tags: ['road trip', 'fuel cost', 'petrol', 'cost splitter', 'carpooling', 'travel budget', 'fuel efficiency'],
    inputs: [
      {
        id: 'distanceKm',
        label: 'Trip Distance (km)',
        type: 'number',
        defaultValue: 500,
        min: 1,
        step: 1,
        placeholder: 'e.g. 500',
        helpText: 'Total one-way or round-trip distance in kilometres.',
      },
      {
        id: 'fuelEfficiency',
        label: 'Fuel Consumption (L/100km)',
        type: 'number',
        defaultValue: 10,
        min: 0.1,
        step: 0.1,
        placeholder: 'e.g. 10',
        helpText: 'Your vehicle fuel consumption in litres per 100km.',
      },
      {
        id: 'fuelPricePerL',
        label: 'Fuel Price ($/L)',
        type: 'number',
        defaultValue: 1.8,
        min: 0,
        step: 0.01,
        placeholder: 'e.g. 1.80',
        helpText: 'Current local fuel price per litre.',
      },
      {
        id: 'passengers',
        label: 'Number of People (incl. driver)',
        type: 'number',
        defaultValue: 3,
        min: 1,
        max: 10,
        step: 1,
        placeholder: 'e.g. 3',
        helpText: 'Total number of people sharing the fuel cost.',
      },
    ],
    formulas: [
      {
        id: 'fuelNeeded',
        expression: 'distanceKm / 100 * fuelEfficiency',
        dependencies: ['distanceKm', 'fuelEfficiency'],
      },
      {
        id: 'totalCost',
        expression: 'fuelNeeded * fuelPricePerL',
        dependencies: ['fuelNeeded', 'fuelPricePerL'],
      },
      {
        id: 'perPersonCost',
        expression: 'totalCost / passengers',
        dependencies: ['totalCost', 'passengers'],
      },
    ],
    outputs: [
      {
        id: 'fuelNeededOut',
        label: 'Fuel Required',
        formulaRef: 'fuelNeeded',
        format: 'number',
        suffix: ' L',
        precision: 1,
      },
      {
        id: 'totalCostOut',
        label: 'Total Fuel Cost',
        formulaRef: 'totalCost',
        format: 'number',
        prefix: '$',
        precision: 2,
        highlight: true,
      },
      {
        id: 'perPersonCostOut',
        label: 'Cost per Person',
        formulaRef: 'perPersonCost',
        format: 'number',
        prefix: '$',
        precision: 2,
      },
    ],
    guide: {
      whatIsIt:
        'The fuel cost splitter calculates how much petrol or diesel a road trip consumes using your vehicle\'s fuel efficiency and the trip distance, then divides the cost equally among all passengers. It is the fairest baseline for carpooling cost sharing.',
      howToUse:
        '1. Enter the total trip distance in km and your vehicle\'s fuel consumption (L/100km � find in your car manual or use a fuel tracker app).\n2. Enter the current fuel price per litre and the number of people sharing the trip.\nThe calculator outputs total fuel required, total cost, and cost per person.',
      exampleScenario:
        'A 500km road trip in a car using 10L/100km at $1.80/L: Fuel needed = 50L. Total cost = $90. With 3 passengers, each pays $30. Compare this to flying or renting a car � carpooling is almost always the cheapest option for groups of 3+.',
      proTip:
        'For fairness, also split toll fees, parking, and potential wear-and-tear costs (the IRS mileage rate of $0.67/mile = ~$0.42/km covers all vehicle costs). Apps like Splitwise or TripSplit automate cost tracking. On long hauls, the fastest route is rarely the most fuel-efficient � a motorway cruise at 100 km/h uses 15�20% less fuel than stop-start city driving.',
    },
    metadata: { version: '1.0.0' },
  },

  // ---------------------------------------------------------------------------
  // 8. EU Flight Delay Compensation (EC261)
  // ---------------------------------------------------------------------------
  {
    id: 'eu-flight-delay-compensation',
    slug: 'eu-flight-delay-compensation',
    title: 'EU Flight Delay Compensation (EC261)',
    description:
      'Estimate your EU EC261/2004 compensation entitlement for delayed or cancelled flights based on flight distance, delay duration, and flight type.',
    icon: '✈',
    category: 'aviation',
    subcategory: 'travel-visa',
    tags: ['eu261', 'flight delay', 'compensation', 'airline rights', 'ec261', 'cancelled flight', 'passenger rights'],
    inputs: [
      {
        id: 'flightDistanceKm',
        label: 'Flight Distance (km)',
        type: 'number',
        defaultValue: 1500,
        min: 1,
        step: 10,
        placeholder: 'e.g. 1500',
        helpText: 'Great circle distance of the flight route in km.',
      },
      {
        id: 'delayHours',
        label: 'Delay at Destination (hours)',
        type: 'number',
        defaultValue: 4,
        min: 0,
        step: 0.5,
        placeholder: 'e.g. 4',
        helpText: 'Your actual arrival delay at the final destination.',
      },
      {
        id: 'flightType',
        label: 'Flight Type',
        type: 'select',
        defaultValue: '1',
        options: [
          { label: 'EU flight (both in EU)', value: '1' },
          { label: 'Departing EU (any carrier)', value: '1' },
          { label: 'Arriving EU (EU carrier only)', value: '0.5' },
        ],
        helpText: 'EC261 applies to EU-departing flights by any carrier, or EU-arriving flights by EU carriers.',
      },
    ],
    formulas: [
      {
        id: 'shortHaulComp',
        expression: 'flightDistanceKm <= 1500 ? 250 : 0',
        dependencies: ['flightDistanceKm'],
      },
      {
        id: 'mediumHaulComp',
        expression: 'flightDistanceKm > 1500 && flightDistanceKm <= 3500 ? 400 : 0',
        dependencies: ['flightDistanceKm'],
      },
      {
        id: 'longHaulComp',
        expression: 'flightDistanceKm > 3500 ? 600 : 0',
        dependencies: ['flightDistanceKm'],
      },
      {
        id: 'baseComp',
        expression: 'shortHaulComp + mediumHaulComp + longHaulComp',
        dependencies: ['shortHaulComp', 'mediumHaulComp', 'longHaulComp'],
      },
      {
        id: 'reducedComp',
        expression: 'delayHours >= 3 && delayHours < 4 ? baseComp * 0.5 : baseComp',
        dependencies: ['delayHours', 'baseComp'],
      },
      {
        id: 'finalComp',
        expression: 'delayHours >= 3 ? reducedComp * flightType : 0',
        dependencies: ['delayHours', 'reducedComp', 'flightType'],
      },
    ],
    outputs: [
      {
        id: 'finalCompOut',
        label: 'Compensation Entitlement',
        formulaRef: 'finalComp',
        format: 'number',
        prefix: '�',
        precision: 0,
        highlight: true,
      },
      {
        id: 'baseCompOut',
        label: 'Base Compensation',
        formulaRef: 'baseComp',
        format: 'number',
        prefix: '�',
        precision: 0,
      },
    ],
    guide: {
      whatIsIt:
        'EU Regulation EC261/2004 entitles passengers to financial compensation when flights departing from or arriving at EU airports are delayed, cancelled, or result in denied boarding � unless the cause is extraordinary circumstances (severe weather, air traffic control strikes, security incidents).',
      howToUse:
        '1. Enter the flight distance in km (use a great-circle calculator or your airline\'s booking summary).\n2. Enter your total arrival delay at the final destination.\n3. Select whether the flight departed from or arrived in the EU.\nThe calculator applies the EC261 distance brackets and delay thresholds.',
      exampleScenario:
        'A London ? Athens flight (2,390km) arriving 4 hours late on a non-EU carrier: Medium-haul = �400 base. Delay >= 4 hours = full amount. Flight type = departing EU = x1. Compensation = �400. Submit a claim directly to the airline or via a claims service like AirHelp.',
      proTip:
        'Disclaimer: this calculator is informational only. Consult EU Regulation EC261/2004 and an advisor for claims. Airlines have 14 days to respond. If rejected, escalate to your national enforcement body (CAA in the UK, Luftfahrt-Bundesamt in Germany). Claims services take 25�35% commission but handle denials and legal escalation � worthwhile for complex cases.',
    },
    metadata: { version: '1.0.0' },
  },

  // ---------------------------------------------------------------------------
  // 9. Daily Travel Budget Calculator
  // ---------------------------------------------------------------------------
  {
    id: 'travel-budget-per-day',
    slug: 'travel-budget-per-day',
    title: 'Daily Travel Budget Calculator',
    description:
      'Break down your total trip budget into a daily spending allowance after fixed costs, with suggested allocations for food, activities, and miscellaneous expenses.',
    icon: '💰',
    category: 'aviation',
    subcategory: 'travel-visa',
    tags: ['travel budget', 'daily budget', 'trip planning', 'backpacker', 'travel finance', 'vacation budget'],
    inputs: [
      {
        id: 'totalBudget',
        label: 'Total Trip Budget ($)',
        type: 'number',
        defaultValue: 3000,
        min: 0,
        step: 50,
        placeholder: 'e.g. 3000',
        helpText: 'Your total available budget for the entire trip.',
      },
      {
        id: 'tripDays',
        label: 'Trip Duration (days)',
        type: 'number',
        defaultValue: 14,
        min: 1,
        step: 1,
        placeholder: 'e.g. 14',
        helpText: 'Number of days for your trip.',
      },
      {
        id: 'flightsCost',
        label: 'Flights & Transport ($)',
        type: 'number',
        defaultValue: 800,
        min: 0,
        step: 10,
        placeholder: 'e.g. 800',
        helpText: 'Total cost of flights and major inter-city transport.',
      },
      {
        id: 'accommodation',
        label: 'Total Accommodation ($)',
        type: 'number',
        defaultValue: 600,
        min: 0,
        step: 10,
        placeholder: 'e.g. 600',
        helpText: 'Pre-booked accommodation total for the whole trip.',
      },
    ],
    formulas: [
      {
        id: 'remaining',
        expression: 'totalBudget - flightsCost - accommodation',
        dependencies: ['totalBudget', 'flightsCost', 'accommodation'],
      },
      {
        id: 'dailyBudget',
        expression: 'remaining / tripDays',
        dependencies: ['remaining', 'tripDays'],
      },
      {
        id: 'dailyFood',
        expression: 'dailyBudget * 0.35',
        dependencies: ['dailyBudget'],
      },
      {
        id: 'dailyActivities',
        expression: 'dailyBudget * 0.3',
        dependencies: ['dailyBudget'],
      },
      {
        id: 'dailyMisc',
        expression: 'dailyBudget * 0.35',
        dependencies: ['dailyBudget'],
      },
    ],
    outputs: [
      {
        id: 'dailyBudgetOut',
        label: 'Daily Spending Budget',
        formulaRef: 'dailyBudget',
        format: 'number',
        prefix: '$',
        precision: 0,
        highlight: true,
      },
      {
        id: 'dailyFoodOut',
        label: 'Food Budget/Day',
        formulaRef: 'dailyFood',
        format: 'number',
        prefix: '$',
        precision: 0,
      },
      {
        id: 'dailyActivitiesOut',
        label: 'Activities/Day',
        formulaRef: 'dailyActivities',
        format: 'number',
        prefix: '$',
        precision: 0,
      },
    ],
    guide: {
      whatIsIt:
        'Daily Travel Budget is the amount you have left to spend each day after pre-paying all major fixed costs (flights and accommodation). Breaking the remaining budget into daily allowances prevents overspending and helps you make real-time decisions at restaurants, attractions, and shops.',
      howToUse:
        '1. Enter your total trip budget.\n2. Input trip duration and pre-booked fixed costs (flights + accommodation).\nThe calculator subtracts fixed costs and divides the remainder equally across days, with suggested category splits.',
      exampleScenario:
        '$3,000 budget for 14 days. Flights $800 + accommodation $600 = $1,400 fixed. Remaining = $1,600. Daily budget = $114/day. Food allocation = $40/day, Activities = $34/day, Misc = $40/day. This maps to a comfortable mid-range trip in Southeast Asia.',
      proTip:
        'Build in a 10�15% buffer for unexpected expenses (medical, rebooking fees, last-minute experiences). Track spending daily with an app like Trail Wallet or TravelSpend. In high-COL destinations, allocate more (50%) to accommodation and transport; in budget destinations, flip the ratio and spend more on authentic local experiences.',
    },
    metadata: { version: '1.0.0' },
  },

  // ---------------------------------------------------------------------------
  // 10. Travel Insurance Coverage Level
  // ---------------------------------------------------------------------------
  {
    id: 'travel-insurance-coverage-estimator',
    slug: 'travel-insurance-coverage-estimator',
    title: 'Travel Insurance Coverage Level',
    description:
      'Score the adequacy of your travel insurance medical and cancellation coverage relative to your destination risk level and trip investment to ensure you are not underinsured.',
    icon: '🛡',
    category: 'aviation',
    subcategory: 'travel-visa',
    tags: ['travel insurance', 'medical coverage', 'trip cancellation', 'insurance adequacy', 'expat insurance', 'nomad health'],
    inputs: [
      {
        id: 'tripCost',
        label: 'Total Trip Cost ($)',
        type: 'number',
        defaultValue: 3000,
        min: 0,
        step: 50,
        placeholder: 'e.g. 3000',
        helpText: 'Total non-refundable trip investment including flights, hotels, and tours.',
      },
      {
        id: 'tripDays',
        label: 'Trip Duration (days)',
        type: 'number',
        defaultValue: 14,
        min: 1,
        step: 1,
        placeholder: 'e.g. 14',
        helpText: 'Number of days you will be travelling.',
      },
      {
        id: 'medicalCoverage',
        label: 'Medical Coverage ($)',
        type: 'number',
        defaultValue: 100000,
        min: 0,
        step: 5000,
        placeholder: 'e.g. 100000',
        helpText: 'Maximum medical expense coverage per your policy.',
      },
      {
        id: 'cancellationCoverage',
        label: 'Cancellation Coverage ($)',
        type: 'number',
        defaultValue: 5000,
        min: 0,
        step: 100,
        placeholder: 'e.g. 5000',
        helpText: 'Maximum trip cancellation reimbursement per your policy.',
      },
      {
        id: 'destination',
        label: 'Destination',
        type: 'select',
        defaultValue: '2',
        options: [
          { label: 'USA/Canada (high cost)', value: '3' },
          { label: 'Europe (medium cost)', value: '2' },
          { label: 'Southeast Asia (low cost)', value: '1' },
        ],
        helpText: 'Destination affects the minimum recommended medical coverage.',
      },
    ],
    formulas: [
      {
        id: 'adequateMedical',
        expression: 'destination * 50000',
        dependencies: ['destination'],
      },
      {
        id: 'medicalScore',
        expression: 'min(medicalCoverage / adequateMedical * 100, 100)',
        dependencies: ['medicalCoverage', 'adequateMedical'],
      },
      {
        id: 'cancellationScore',
        expression: 'min(cancellationCoverage / tripCost * 100, 100)',
        dependencies: ['cancellationCoverage', 'tripCost'],
      },
      {
        id: 'overallScore',
        expression: '(medicalScore + cancellationScore) / 2',
        dependencies: ['medicalScore', 'cancellationScore'],
      },
    ],
    outputs: [
      {
        id: 'medicalScoreOut',
        label: 'Medical Coverage Adequacy',
        formulaRef: 'medicalScore',
        format: 'number',
        suffix: '%',
        precision: 0,
      },
      {
        id: 'cancellationScoreOut',
        label: 'Cancellation Coverage',
        formulaRef: 'cancellationScore',
        format: 'number',
        suffix: '%',
        precision: 0,
      },
      {
        id: 'overallScoreOut',
        label: 'Overall Coverage Score',
        formulaRef: 'overallScore',
        format: 'number',
        suffix: '%',
        precision: 0,
        highlight: true,
      },
    ],
    guide: {
      whatIsIt:
        'Travel insurance adequacy depends heavily on your destination\'s medical cost structure and your total non-refundable trip investment. A $100,000 medical policy is generous for Southeast Asia but dangerously low for the USA, where a single helicopter evacuation can exceed $50,000.',
      howToUse:
        '1. Enter your total trip cost and trip duration.\n2. Enter your policy\'s medical and cancellation coverage limits.\n3. Select your destination\'s cost tier.\nThe calculator scores each coverage dimension and produces an overall adequacy score.',
      exampleScenario:
        'Travelling to Europe for 14 days with a $3,000 trip. Policy offers $100,000 medical (adequate Europe = $100,000 � score 100%) and $5,000 cancellation vs $3,000 trip cost (score capped at 100%). Overall score = 100%. Well covered.',
      proTip:
        'For the USA, target a minimum of $500,000 medical coverage � a 3-day hospital stay can cost $30,000�$150,000 without insurance. Always include emergency medical evacuation coverage (separate from medical expenses). "Cancel for Any Reason" (CFAR) upgrades cost 40�60% more but reimburse 75% of trip cost regardless of reason � valuable for non-refundable luxury trips.',
    },
    metadata: { version: '1.0.0' },
  },
];
