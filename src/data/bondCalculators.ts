import type { CalculatorSchema } from '@/types/calculator';

export const bondCalculators: CalculatorSchema[] = [
  // ─── 1. Bond Price Calculator ────────────────────────────────────────
  {
    id: 'bond-price-calculator',
    slug: 'bond-price-calculator',
    title: 'Bond Price Calculator',
    description:
      'Calculate the theoretical price of a fixed-rate bond given its face value, coupon rate, yield to maturity, and time to maturity. Supports annual and semi-annual coupon frequencies.',
    icon: '💵',
    category: 'finance',
    subcategory: 'bonds',
    tags: [
      'bond price',
      'fixed income',
      'present value',
      'coupon bond',
      'yield to maturity',
      'premium',
      'discount',
    ],
    inputs: [
      {
        id: 'faceValue',
        label: 'Face Value (Par)',
        type: 'number',
        defaultValue: 1000,
        placeholder: 'e.g. 1000',
        helpText: 'The bond\'s par or face value paid at maturity',
        min: 1,
      },
      {
        id: 'couponRate',
        label: 'Annual Coupon Rate',
        type: 'number',
        placeholder: 'e.g. 5',
        helpText: 'Annual coupon rate as a percentage',
        min: 0,
        max: 100,
        step: 0.01,
      },
      {
        id: 'ytm',
        label: 'Yield to Maturity (YTM)',
        type: 'number',
        placeholder: 'e.g. 4',
        helpText: 'Required annual yield as a percentage',
        min: 0,
        max: 100,
        step: 0.01,
      },
      {
        id: 'yearsToMaturity',
        label: 'Years to Maturity',
        type: 'number',
        placeholder: 'e.g. 10',
        helpText: 'Number of years until the bond matures',
        min: 0.5,
        max: 100,
        step: 0.5,
      },
      {
        id: 'paymentsPerYear',
        label: 'Coupon Frequency',
        type: 'select',
        options: [
          { label: 'Annual', value: '1' },
          { label: 'Semi-Annual', value: '2' },
        ],
        defaultValue: '2',
      },
    ],
    formulas: [
      {
        id: 'periodicCouponRate',
        expression: 'couponRate / 100 / paymentsPerYear',
        dependencies: ['couponRate', 'paymentsPerYear'],
      },
      {
        id: 'periodicYTM',
        expression: 'ytm / 100 / paymentsPerYear',
        dependencies: ['ytm', 'paymentsPerYear'],
      },
      {
        id: 'totalPeriods',
        expression: 'yearsToMaturity * paymentsPerYear',
        dependencies: ['yearsToMaturity', 'paymentsPerYear'],
      },
      {
        id: 'bondPrice',
        expression: 'bond_price(faceValue, periodicCouponRate, periodicYTM, totalPeriods)',
        dependencies: ['faceValue', 'periodicCouponRate', 'periodicYTM', 'totalPeriods'],
      },
      {
        id: 'premiumDiscount',
        expression: 'bondPrice - faceValue',
        dependencies: ['bondPrice', 'faceValue'],
      },
      {
        id: 'currentYield',
        expression: 'faceValue * couponRate / 100 / bondPrice * 100',
        dependencies: ['faceValue', 'couponRate', 'bondPrice'],
      },
    ],
    outputs: [
      {
        id: 'bondPriceResult',
        label: 'Bond Price',
        formulaRef: 'bondPrice',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
      {
        id: 'premiumDiscountResult',
        label: 'Premium / Discount',
        formulaRef: 'premiumDiscount',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'currentYieldResult',
        label: 'Current Yield',
        formulaRef: 'currentYield',
        format: 'percentage',
        precision: 2,
      },
    ],
    guide: {
      whatIsIt:
        'The Bond Price Calculator determines the fair market value of a fixed-rate bond by discounting all future cash flows (coupon payments and par value at maturity) back to today using the required yield to maturity. When the coupon rate exceeds the market yield the bond trades at a premium; when it is below, the bond trades at a discount.',
      howToUse:
        'Enter the bond\'s face value (typically $1,000), the annual coupon rate, the desired yield to maturity, years remaining until maturity, and coupon frequency (annual or semi-annual). Click calculate to see the bond\'s theoretical price, the dollar premium or discount relative to par, and the current yield.',
      exampleScenario:
        'A corporate bond has a $1,000 face value, 5% annual coupon paid semi-annually, 10 years to maturity, and the market yield is 4%. The calculator prices the bond at approximately $1,081.11 — an $81.11 premium — because its coupon rate exceeds the required yield. The current yield is about 4.62%.',
      proTip:
        'Bond prices and yields move inversely. A 1% rise in market yields can reduce a 10-year bond\'s price by roughly 7-8%. Always compare the current yield with the YTM — current yield ignores capital gains or losses at maturity, so it can be misleading for bonds trading far from par.',
    },
    metadata: { version: '1.0.0' },
  },

  // ─── 2. Bond Yield to Call (YTC) Calculator ──────────────────────────
  {
    id: 'bond-ytc-calculator',
    slug: 'bond-ytc-calculator',
    title: 'Bond Yield to Call (YTC)',
    description:
      'Estimate the yield to call for a callable bond using the standard bond yield approximation formula. Assumes semi-annual coupon payments.',
    icon: '📞',
    category: 'finance',
    subcategory: 'bonds',
    tags: [
      'yield to call',
      'ytc',
      'callable bond',
      'fixed income',
      'bond yield',
      'call premium',
    ],
    inputs: [
      {
        id: 'currentPrice',
        label: 'Current Market Price',
        type: 'number',
        placeholder: 'e.g. 1050',
        helpText: 'The price you pay for the bond today',
        min: 1,
      },
      {
        id: 'faceValue',
        label: 'Face Value (Par)',
        type: 'number',
        defaultValue: 1000,
        placeholder: 'e.g. 1000',
        min: 1,
      },
      {
        id: 'couponRate',
        label: 'Annual Coupon Rate',
        type: 'number',
        placeholder: 'e.g. 6',
        helpText: 'Annual coupon rate as a percentage',
        min: 0,
        max: 100,
        step: 0.01,
      },
      {
        id: 'yearsToCall',
        label: 'Years to Call Date',
        type: 'number',
        placeholder: 'e.g. 5',
        helpText: 'Number of years until the first call date',
        min: 0.5,
        max: 100,
        step: 0.5,
      },
      {
        id: 'callPremium',
        label: 'Call Premium',
        type: 'number',
        defaultValue: 0,
        placeholder: 'e.g. 2',
        helpText: 'Premium above par paid on call, as a percentage of face value',
        min: 0,
        max: 100,
        step: 0.01,
      },
    ],
    formulas: [
      {
        id: 'callPrice',
        expression: 'faceValue * (1 + callPremium / 100)',
        dependencies: ['faceValue', 'callPremium'],
      },
      {
        id: 'periodicCoupon',
        expression: 'faceValue * couponRate / 100 / 2',
        dependencies: ['faceValue', 'couponRate'],
      },
      {
        id: 'totalPeriods',
        expression: 'yearsToCall * 2',
        dependencies: ['yearsToCall'],
      },
      {
        // Standard bond yield approximation:
        // YTC ≈ [C + (CallPrice − P) / n] / [(CallPrice + P) / 2]
        // Annualized by multiplying by 2 (semi-annual) and × 100 for percentage
        id: 'ytcApprox',
        expression:
          '(periodicCoupon + (callPrice - currentPrice) / totalPeriods) / ((callPrice + currentPrice) / 2) * 2 * 100',
        dependencies: ['periodicCoupon', 'callPrice', 'currentPrice', 'totalPeriods'],
      },
    ],
    outputs: [
      {
        id: 'ytcResult',
        label: 'Yield to Call (YTC)',
        formulaRef: 'ytcApprox',
        format: 'percentage',
        precision: 2,
        highlight: true,
      },
      {
        id: 'callPriceResult',
        label: 'Call Price',
        formulaRef: 'callPrice',
        format: 'currency',
        precision: 2,
      },
    ],
    guide: {
      whatIsIt:
        'The Yield to Call (YTC) calculator estimates the annualized return on a callable bond assuming the issuer redeems it at the earliest call date. Callable bonds give the issuer the right to repay principal before maturity, usually at a slight premium. YTC is critical for bonds trading above par because the issuer is more likely to call the bond when interest rates fall.',
      howToUse:
        'Enter the bond\'s current market price, face value, annual coupon rate, years until the first call date, and any call premium (as a percentage of face value — enter 0 if redeemed at par). The calculator uses the standard yield approximation formula assuming semi-annual coupon payments.',
      exampleScenario:
        'You buy a bond at $1,050 with a $1,000 face value, 6% annual coupon (semi-annual payments), callable in 5 years at par (0% premium). The semi-annual coupon is $30 and there are 10 periods. YTC ≈ [30 + (1000 − 1050)/10] / [(1000 + 1050)/2] × 2 × 100 ≈ 4.88%.',
      proTip:
        'Always compare YTC with yield to maturity (YTM). For premium bonds, the "yield to worst" — the lower of YTC and YTM — is the most conservative measure of return. If YTC is significantly lower than YTM, consider the likelihood of the bond being called before maturity.',
    },
    metadata: { version: '1.0.0' },
  },

  // ─── 3. Bond Yield to Maturity (YTM) Calculator ─────────────────────
  {
    id: 'bond-ytm-calculator',
    slug: 'bond-ytm-calculator',
    title: 'Bond Yield to Maturity (YTM)',
    description:
      'Approximate the yield to maturity for a fixed-rate bond using the standard yield approximation formula. Supports annual and semi-annual coupon frequencies.',
    icon: '📈',
    category: 'finance',
    subcategory: 'bonds',
    tags: [
      'yield to maturity',
      'ytm',
      'bond yield',
      'fixed income',
      'current yield',
      'bond return',
    ],
    inputs: [
      {
        id: 'currentPrice',
        label: 'Current Market Price',
        type: 'number',
        placeholder: 'e.g. 950',
        helpText: 'The price you pay for the bond today',
        min: 1,
      },
      {
        id: 'faceValue',
        label: 'Face Value (Par)',
        type: 'number',
        defaultValue: 1000,
        placeholder: 'e.g. 1000',
        min: 1,
      },
      {
        id: 'couponRate',
        label: 'Annual Coupon Rate',
        type: 'number',
        placeholder: 'e.g. 5',
        helpText: 'Annual coupon rate as a percentage',
        min: 0,
        max: 100,
        step: 0.01,
      },
      {
        id: 'yearsToMaturity',
        label: 'Years to Maturity',
        type: 'number',
        placeholder: 'e.g. 10',
        min: 0.5,
        max: 100,
        step: 0.5,
      },
      {
        id: 'paymentsPerYear',
        label: 'Coupon Frequency',
        type: 'select',
        options: [
          { label: 'Annual', value: '1' },
          { label: 'Semi-Annual', value: '2' },
        ],
        defaultValue: '2',
      },
    ],
    formulas: [
      {
        id: 'periodicCoupon',
        expression: 'faceValue * couponRate / 100 / paymentsPerYear',
        dependencies: ['faceValue', 'couponRate', 'paymentsPerYear'],
      },
      {
        id: 'totalPeriods',
        expression: 'yearsToMaturity * paymentsPerYear',
        dependencies: ['yearsToMaturity', 'paymentsPerYear'],
      },
      {
        // Standard bond yield approximation:
        // YTM ≈ [C + (F − P) / n] / [(F + P) / 2]   ×  paymentsPerYear  × 100
        id: 'ytmApprox',
        expression:
          '(periodicCoupon + (faceValue - currentPrice) / totalPeriods) / ((faceValue + currentPrice) / 2) * paymentsPerYear * 100',
        dependencies: ['periodicCoupon', 'faceValue', 'currentPrice', 'totalPeriods', 'paymentsPerYear'],
      },
      {
        id: 'currentYield',
        expression: 'faceValue * couponRate / 100 / currentPrice * 100',
        dependencies: ['faceValue', 'couponRate', 'currentPrice'],
      },
    ],
    outputs: [
      {
        id: 'ytmResult',
        label: 'Yield to Maturity (YTM)',
        formulaRef: 'ytmApprox',
        format: 'percentage',
        precision: 2,
        highlight: true,
      },
      {
        id: 'currentYieldResult',
        label: 'Current Yield',
        formulaRef: 'currentYield',
        format: 'percentage',
        precision: 2,
      },
    ],
    guide: {
      whatIsIt:
        'Yield to Maturity (YTM) is the total annualized return an investor earns if a bond is held until maturity and all coupons are reinvested at the same rate. It accounts for coupon income, capital gain or loss (the difference between purchase price and par), and the time value of money. This calculator uses the widely-accepted linear approximation formula which is accurate to within a few basis points for most bonds.',
      howToUse:
        'Enter the bond\'s current market price, face value, annual coupon rate, years remaining to maturity, and the coupon payment frequency. The calculator produces an approximate annualized YTM and the current yield for comparison.',
      exampleScenario:
        'A $1,000 par bond with a 5% coupon paid semi-annually is trading at $950 with 10 years to maturity. Periodic coupon = $25, total periods = 20. YTM ≈ [25 + (1000 − 950)/20] / [(1000 + 950)/2] × 2 × 100 ≈ 5.64%. The current yield is 5.26%, which is lower because it ignores the $50 capital gain at maturity.',
      proTip:
        'The approximation formula tends to slightly underestimate YTM for deep-discount bonds and slightly overestimate for large premiums. For critical pricing decisions, use a financial calculator or iterative solver. Compare YTM across bonds with similar credit ratings and maturities for true apples-to-apples analysis.',
    },
    metadata: { version: '1.0.0' },
  },

  // ─── 4. Bond Duration Calculator ─────────────────────────────────────
  {
    id: 'bond-duration-calculator',
    slug: 'bond-duration-calculator',
    title: 'Bond Duration Calculator',
    description:
      'Calculate Macaulay and Modified Duration for a fixed-rate bond. Duration measures interest rate sensitivity — the approximate percentage price change for a 1% change in yield.',
    icon: '⏱️',
    category: 'finance',
    subcategory: 'bonds',
    tags: [
      'macaulay duration',
      'modified duration',
      'interest rate risk',
      'fixed income',
      'bond sensitivity',
      'duration',
    ],
    inputs: [
      {
        id: 'faceValue',
        label: 'Face Value (Par)',
        type: 'number',
        defaultValue: 1000,
        placeholder: 'e.g. 1000',
        min: 1,
      },
      {
        id: 'couponRate',
        label: 'Annual Coupon Rate',
        type: 'number',
        placeholder: 'e.g. 5',
        helpText: 'Annual coupon rate as a percentage',
        min: 0,
        max: 100,
        step: 0.01,
      },
      {
        id: 'ytm',
        label: 'Yield to Maturity (YTM)',
        type: 'number',
        placeholder: 'e.g. 4',
        helpText: 'Annual yield to maturity as a percentage',
        min: 0,
        max: 100,
        step: 0.01,
      },
      {
        id: 'yearsToMaturity',
        label: 'Years to Maturity',
        type: 'number',
        placeholder: 'e.g. 10',
        min: 0.5,
        max: 100,
        step: 0.5,
      },
      {
        id: 'paymentsPerYear',
        label: 'Coupon Frequency',
        type: 'select',
        options: [
          { label: 'Annual', value: '1' },
          { label: 'Semi-Annual', value: '2' },
        ],
        defaultValue: '2',
      },
    ],
    formulas: [
      {
        id: 'periodicCouponRate',
        expression: 'couponRate / 100 / paymentsPerYear',
        dependencies: ['couponRate', 'paymentsPerYear'],
      },
      {
        id: 'periodicYTM',
        expression: 'ytm / 100 / paymentsPerYear',
        dependencies: ['ytm', 'paymentsPerYear'],
      },
      {
        id: 'totalPeriods',
        expression: 'yearsToMaturity * paymentsPerYear',
        dependencies: ['yearsToMaturity', 'paymentsPerYear'],
      },
      {
        // macaulay_dur returns duration in periods
        id: 'macaulayDur',
        expression: 'macaulay_dur(faceValue, periodicCouponRate, periodicYTM, totalPeriods)',
        dependencies: ['faceValue', 'periodicCouponRate', 'periodicYTM', 'totalPeriods'],
      },
      {
        // Convert from periods to years
        id: 'macaulayYears',
        expression: 'macaulayDur / paymentsPerYear',
        dependencies: ['macaulayDur', 'paymentsPerYear'],
      },
      {
        // Modified Duration = Macaulay Duration (years) / (1 + periodic yield)
        id: 'modifiedDur',
        expression: 'macaulayYears / (1 + periodicYTM)',
        dependencies: ['macaulayYears', 'periodicYTM'],
      },
    ],
    outputs: [
      {
        id: 'macaulayResult',
        label: 'Macaulay Duration',
        formulaRef: 'macaulayYears',
        format: 'number',
        precision: 4,
        suffix: ' years',
        highlight: true,
      },
      {
        id: 'modifiedDurResult',
        label: 'Modified Duration',
        formulaRef: 'modifiedDur',
        format: 'number',
        precision: 4,
        suffix: ' years',
        highlight: true,
      },
    ],
    guide: {
      whatIsIt:
        'Bond duration measures the weighted-average time until a bond\'s cash flows are received, expressed in years. Macaulay Duration is the pure time-weighted measure, while Modified Duration adjusts it to estimate the bond\'s price sensitivity to interest rate changes. A Modified Duration of 7 means the bond\'s price will fall approximately 7% for every 1% rise in yields.',
      howToUse:
        'Enter the bond\'s face value, annual coupon rate, yield to maturity, years to maturity, and coupon frequency. The calculator returns both Macaulay Duration (in years) and Modified Duration. Use Modified Duration to estimate price changes: ΔPrice ≈ −ModifiedDuration × Δyield × Price.',
      exampleScenario:
        'A $1,000 par bond with a 5% coupon paid semi-annually, 10 years to maturity, and a 4% YTM has a Macaulay Duration of approximately 8.18 years and a Modified Duration of about 8.02 years. If yields rise by 0.5%, the bond\'s price would drop by roughly 4.01% (8.02 × 0.5%).',
      proTip:
        'Zero-coupon bonds have the highest duration (equal to their maturity) because all cash flow arrives at the end. Higher coupons and shorter maturities reduce duration. Portfolio managers use duration matching to immunize portfolios against interest rate risk — matching asset duration to liability duration.',
    },
    metadata: { version: '1.0.0' },
  },

  // ─── 5. Bond Accrued Interest Calculator ─────────────────────────────
  {
    id: 'bond-accrued-interest',
    slug: 'bond-accrued-interest',
    title: 'Bond Accrued Interest Calculator',
    description:
      'Calculate the accrued interest and dirty price of a bond between coupon payment dates. Accrued interest represents the portion of the next coupon earned by the seller.',
    icon: '📅',
    category: 'finance',
    subcategory: 'bonds',
    tags: [
      'accrued interest',
      'dirty price',
      'clean price',
      'settlement',
      'bond trading',
      'day count',
    ],
    inputs: [
      {
        id: 'cleanPrice',
        label: 'Clean Price',
        type: 'number',
        placeholder: 'e.g. 985',
        helpText: 'The quoted market price of the bond (excludes accrued interest)',
        min: 0,
      },
      {
        id: 'faceValue',
        label: 'Face Value (Par)',
        type: 'number',
        defaultValue: 1000,
        placeholder: 'e.g. 1000',
        min: 1,
      },
      {
        id: 'couponRate',
        label: 'Annual Coupon Rate',
        type: 'number',
        placeholder: 'e.g. 6',
        helpText: 'Annual coupon rate as a percentage',
        min: 0,
        max: 100,
        step: 0.01,
      },
      {
        id: 'daysSinceLastCoupon',
        label: 'Days Since Last Coupon',
        type: 'number',
        placeholder: 'e.g. 45',
        helpText: 'Number of days elapsed since the last coupon payment date',
        min: 0,
        max: 366,
      },
      {
        id: 'daysBetweenCoupons',
        label: 'Days in Coupon Period',
        type: 'number',
        defaultValue: 180,
        placeholder: 'e.g. 180',
        helpText: 'Total days in the coupon period (180 for 30/360, ~182 for actual/actual semi-annual)',
        min: 1,
        max: 366,
      },
    ],
    formulas: [
      {
        // Semi-annual coupon: face × annual rate / 2, prorated by days elapsed
        id: 'accruedInterest',
        expression: 'faceValue * couponRate / 100 / 2 * daysSinceLastCoupon / daysBetweenCoupons',
        dependencies: ['faceValue', 'couponRate', 'daysSinceLastCoupon', 'daysBetweenCoupons'],
      },
      {
        // Dirty price = Clean price + Accrued interest (what the buyer actually pays)
        id: 'dirtyPrice',
        expression: 'cleanPrice + accruedInterest',
        dependencies: ['cleanPrice', 'accruedInterest'],
      },
    ],
    outputs: [
      {
        id: 'accruedInterestResult',
        label: 'Accrued Interest',
        formulaRef: 'accruedInterest',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
      {
        id: 'dirtyPriceResult',
        label: 'Dirty Price (Invoice Price)',
        formulaRef: 'dirtyPrice',
        format: 'currency',
        precision: 2,
      },
    ],
    guide: {
      whatIsIt:
        'When a bond is bought or sold between coupon payment dates, the buyer must compensate the seller for the interest that has accrued since the last coupon. The "clean price" is the quoted market price without accrued interest, while the "dirty price" (or invoice price) is what the buyer actually pays: clean price plus accrued interest. This calculator assumes semi-annual coupon payments.',
      howToUse:
        'Enter the bond\'s clean (quoted) price, face value, annual coupon rate, the number of days elapsed since the last coupon payment, and the total number of days in the coupon period (typically 180 for the 30/360 convention or ~182 for actual/actual). The calculator computes the accrued interest and the total dirty price.',
      exampleScenario:
        'A $1,000 par bond with a 6% annual coupon (semi-annual payments) is quoted at a clean price of $985. If 45 days have elapsed since the last coupon and the coupon period is 180 days, the accrued interest is $1,000 × 6% / 2 × (45/180) = $7.50. The dirty price is $985 + $7.50 = $992.50.',
      proTip:
        'Different markets use different day-count conventions. US Treasuries use actual/actual, US corporates use 30/360, and Eurobonds use 30/360 or actual/360. Always confirm the convention for the specific bond — using the wrong day count can cause settlement disputes.',
    },
    metadata: { version: '1.0.0' },
  },

  // ─── 6. US Treasury Bill Calculator ──────────────────────────────────
  {
    id: 'treasury-bill-calculator',
    slug: 'treasury-bill-calculator',
    title: 'US Treasury Bill Calculator',
    description:
      'Calculate the discount, bank discount yield, and bond equivalent yield for a US Treasury Bill. T-Bills are zero-coupon securities sold at a discount to face value.',
    icon: '🏛️',
    category: 'finance',
    subcategory: 'bonds',
    tags: [
      'treasury bill',
      't-bill',
      'discount yield',
      'bond equivalent yield',
      'money market',
      'zero coupon',
    ],
    inputs: [
      {
        id: 'faceValue',
        label: 'Face Value (Par)',
        type: 'number',
        defaultValue: 10000,
        placeholder: 'e.g. 10000',
        helpText: 'The par value received at maturity (typically $10,000)',
        min: 1,
      },
      {
        id: 'purchasePrice',
        label: 'Purchase Price',
        type: 'number',
        placeholder: 'e.g. 9800',
        helpText: 'The discounted price you pay for the T-Bill',
        min: 0,
      },
      {
        id: 'daysToMaturity',
        label: 'Days to Maturity',
        type: 'number',
        placeholder: 'e.g. 91',
        helpText: 'Number of days until the T-Bill matures (common: 28, 91, 182, 364)',
        min: 1,
        max: 364,
      },
    ],
    formulas: [
      {
        id: 'discount',
        expression: 'faceValue - purchasePrice',
        dependencies: ['faceValue', 'purchasePrice'],
      },
      {
        // Bank Discount Yield = (Discount / Face Value) × (360 / Days) × 100
        id: 'discountYield',
        expression: 'discount / faceValue * 360 / daysToMaturity * 100',
        dependencies: ['discount', 'faceValue', 'daysToMaturity'],
      },
      {
        // Bond Equivalent Yield = (Discount / Purchase Price) × (365 / Days) × 100
        id: 'bondEquivYield',
        expression: 'discount / purchasePrice * 365 / daysToMaturity * 100',
        dependencies: ['discount', 'purchasePrice', 'daysToMaturity'],
      },
    ],
    outputs: [
      {
        id: 'discountResult',
        label: 'Dollar Discount',
        formulaRef: 'discount',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'discountYieldResult',
        label: 'Bank Discount Yield',
        formulaRef: 'discountYield',
        format: 'percentage',
        precision: 3,
        highlight: true,
      },
      {
        id: 'bondEquivYieldResult',
        label: 'Bond Equivalent Yield (BEY)',
        formulaRef: 'bondEquivYield',
        format: 'percentage',
        precision: 3,
      },
    ],
    guide: {
      whatIsIt:
        'US Treasury Bills are short-term government securities sold at a discount to their face value and redeemed at par. They pay no coupons — your return is the difference between the purchase price and the face value. The Bank Discount Yield uses a 360-day year and the face value as the base, while the Bond Equivalent Yield uses a 365-day year and the purchase price, making it comparable to coupon-bearing bond yields.',
      howToUse:
        'Enter the T-Bill\'s face value (commonly $10,000), the price you paid, and the number of days until maturity. The calculator computes the dollar discount, the bank discount yield (the convention used by dealers), and the bond equivalent yield (used to compare against coupon bonds).',
      exampleScenario:
        'You purchase a 91-day T-Bill with a $10,000 face value for $9,800. The dollar discount is $200. Bank Discount Yield = ($200/$10,000) × (360/91) × 100 ≈ 7.912%. Bond Equivalent Yield = ($200/$9,800) × (365/91) × 100 ≈ 8.189%. The BEY is higher because it uses the actual investment (purchase price) and a 365-day year.',
      proTip:
        'The bank discount yield always understates the true return because it divides by face value (larger) rather than purchase price (your actual investment). For comparing T-Bills to other investments, always use the Bond Equivalent Yield. For T-Bills with more than 182 days to maturity, the BEY formula becomes more complex — this calculator uses the simple version valid for bills of 182 days or fewer.',
    },
    metadata: { version: '1.0.0' },
  },
];
