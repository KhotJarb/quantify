import type { CalculatorSchema } from '@/types/calculator';

export const lifestyleCalculators: CalculatorSchema[] = [
  // ─── 1. Exact Age Calculator ────────────────────────────────────────
  {
    id: 'exact-age-calculator',
    slug: 'exact-age-calculator',
    title: 'Exact Age Calculator',
    description: 'Calculate your exact age in years, months, and days from your birth date to today.',
    icon: '🎂',
    category: 'everyday',
    subcategory: 'time',
    tags: ['age', 'birthday', 'years', 'months', 'days'],
    inputs: [
      {
        id: 'birthYear',
        label: 'Birth Year',
        type: 'number',
        defaultValue: 1990,
        placeholder: 'e.g. 1990',
      },
      {
        id: 'birthMonth',
        label: 'Birth Month',
        type: 'select',
        defaultValue: '1',
        options: [
          { label: 'January', value: '1' },
          { label: 'February', value: '2' },
          { label: 'March', value: '3' },
          { label: 'April', value: '4' },
          { label: 'May', value: '5' },
          { label: 'June', value: '6' },
          { label: 'July', value: '7' },
          { label: 'August', value: '8' },
          { label: 'September', value: '9' },
          { label: 'October', value: '10' },
          { label: 'November', value: '11' },
          { label: 'December', value: '12' },
        ],
      },
      {
        id: 'birthDay',
        label: 'Birth Day',
        type: 'number',
        defaultValue: 1,
        min: 1,
        max: 31,
        step: 1,
      },
      {
        id: 'currentYear',
        label: 'Current Year',
        type: 'number',
        defaultValue: 2025,
        placeholder: 'e.g. 2025',
      },
      {
        id: 'currentMonth',
        label: 'Current Month',
        type: 'select',
        defaultValue: '6',
        options: [
          { label: 'January', value: '1' },
          { label: 'February', value: '2' },
          { label: 'March', value: '3' },
          { label: 'April', value: '4' },
          { label: 'May', value: '5' },
          { label: 'June', value: '6' },
          { label: 'July', value: '7' },
          { label: 'August', value: '8' },
          { label: 'September', value: '9' },
          { label: 'October', value: '10' },
          { label: 'November', value: '11' },
          { label: 'December', value: '12' },
        ],
      },
      {
        id: 'currentDay',
        label: 'Current Day',
        type: 'number',
        defaultValue: 30,
        min: 1,
        max: 31,
        step: 1,
      },
    ],
    formulas: [
      {
        id: 'totalDaysApprox',
        expression: 'abs((currentYear - birthYear) * 365 + (currentMonth - birthMonth) * 30 + (currentDay - birthDay))',
        dependencies: ['currentYear', 'birthYear', 'currentMonth', 'birthMonth', 'currentDay', 'birthDay'],
      },
      {
        id: 'ageYears',
        expression: 'floor(totalDaysApprox / 365)',
        dependencies: ['totalDaysApprox'],
      },
      {
        id: 'ageMonths',
        expression: 'floor((totalDaysApprox - ageYears * 365) / 30)',
        dependencies: ['totalDaysApprox', 'ageYears'],
      },
      {
        id: 'ageDays',
        expression: 'totalDaysApprox - ageYears * 365 - ageMonths * 30',
        dependencies: ['totalDaysApprox', 'ageYears', 'ageMonths'],
      },
    ],
    outputs: [
      {
        id: 'ageYearsOut',
        label: 'Age in Years',
        formulaRef: 'ageYears',
        precision: 0,
        suffix: ' years',
        highlight: true,
      },
      {
        id: 'ageMonthsOut',
        label: 'Remaining Months',
        formulaRef: 'ageMonths',
        precision: 0,
        suffix: ' months',
      },
      {
        id: 'ageDaysOut',
        label: 'Remaining Days',
        formulaRef: 'ageDays',
        precision: 0,
        suffix: ' days',
      },
      {
        id: 'totalDaysOut',
        label: 'Total Days (approx)',
        formulaRef: 'totalDaysApprox',
        precision: 0,
        suffix: ' days',
      },
    ],
    guide: {
      whatIsIt:
        'The Exact Age Calculator computes how old you are in years, months, and days by comparing your birth date to a target date. It uses a simplified 365-day year and 30-day month model to produce a close approximation without requiring a full calendar library.',
      howToUse:
        "Enter your birth year, month, and day in the first three fields. Then enter today's year, month, and day (or any target date) in the last three fields. The calculator instantly shows your approximate age broken down into years, months, and days, plus the grand total in days.",
      exampleScenario:
        'Someone born on March 15, 1990 wants to know their age on June 30, 2025. The calculator produces approximately 35 years, 3 months, and 15 days — giving a quick, readable breakdown without needing any app or calendar lookup.',
      proTip:
        "Use milestone birthdays (30, 40, 50) as goal-setting checkpoints. If you're approaching a milestone, enter that future birthday as the \"current date\" to count down exactly how many days remain. For truly precise age (accounting for leap years and variable month lengths), a dedicated calendar API will give the exact count.",
    },
    metadata: { version: '1.0.0' },
  },

  // ─── 2. Days Between Dates ──────────────────────────────────────────
  {
    id: 'days-between-dates',
    slug: 'days-between-dates',
    title: 'Days Between Dates',
    description: 'Calculate the number of days, weeks, and months between any two dates.',
    icon: '📅',
    category: 'everyday',
    subcategory: 'time',
    tags: ['days', 'dates', 'duration', 'calendar', 'countdown'],
    inputs: [
      {
        id: 'year1',
        label: 'Start Year',
        type: 'number',
        defaultValue: 2024,
        placeholder: 'e.g. 2024',
      },
      {
        id: 'month1',
        label: 'Start Month',
        type: 'select',
        defaultValue: '1',
        options: [
          { label: 'January', value: '1' },
          { label: 'February', value: '2' },
          { label: 'March', value: '3' },
          { label: 'April', value: '4' },
          { label: 'May', value: '5' },
          { label: 'June', value: '6' },
          { label: 'July', value: '7' },
          { label: 'August', value: '8' },
          { label: 'September', value: '9' },
          { label: 'October', value: '10' },
          { label: 'November', value: '11' },
          { label: 'December', value: '12' },
        ],
      },
      {
        id: 'day1',
        label: 'Start Day',
        type: 'number',
        defaultValue: 1,
        min: 1,
        max: 31,
        step: 1,
      },
      {
        id: 'year2',
        label: 'End Year',
        type: 'number',
        defaultValue: 2025,
        placeholder: 'e.g. 2025',
      },
      {
        id: 'month2',
        label: 'End Month',
        type: 'select',
        defaultValue: '12',
        options: [
          { label: 'January', value: '1' },
          { label: 'February', value: '2' },
          { label: 'March', value: '3' },
          { label: 'April', value: '4' },
          { label: 'May', value: '5' },
          { label: 'June', value: '6' },
          { label: 'July', value: '7' },
          { label: 'August', value: '8' },
          { label: 'September', value: '9' },
          { label: 'October', value: '10' },
          { label: 'November', value: '11' },
          { label: 'December', value: '12' },
        ],
      },
      {
        id: 'day2',
        label: 'End Day',
        type: 'number',
        defaultValue: 31,
        min: 1,
        max: 31,
        step: 1,
      },
    ],
    formulas: [
      {
        id: 'total1',
        expression: 'year1 * 365 + month1 * 30 + day1',
        dependencies: ['year1', 'month1', 'day1'],
      },
      {
        id: 'total2',
        expression: 'year2 * 365 + month2 * 30 + day2',
        dependencies: ['year2', 'month2', 'day2'],
      },
      {
        id: 'daysDiff',
        expression: 'abs(total2 - total1)',
        dependencies: ['total1', 'total2'],
      },
      {
        id: 'weeksDiff',
        expression: 'floor(daysDiff / 7)',
        dependencies: ['daysDiff'],
      },
      {
        id: 'monthsDiff',
        expression: 'floor(daysDiff / 30)',
        dependencies: ['daysDiff'],
      },
    ],
    outputs: [
      {
        id: 'daysDiffOut',
        label: 'Days Between Dates',
        formulaRef: 'daysDiff',
        precision: 0,
        suffix: ' days',
        highlight: true,
      },
      {
        id: 'weeksDiffOut',
        label: 'Weeks',
        formulaRef: 'weeksDiff',
        precision: 0,
        suffix: ' weeks',
      },
      {
        id: 'monthsDiffOut',
        label: 'Months (approx)',
        formulaRef: 'monthsDiff',
        precision: 0,
        suffix: ' months',
      },
    ],
    guide: {
      whatIsIt:
        'The Days Between Dates calculator tells you how many days, weeks, and months separate any two dates. It uses a simplified model (30-day months, 365-day years) that is accurate to within a few days for most planning purposes.',
      howToUse:
        'Enter the start date (year, month, day) in the first three fields and the end date in the last three fields. The calculator returns the absolute difference in days, weeks, and approximate months. Order does not matter — the result is always positive.',
      exampleScenario:
        'Planning a wedding on October 12, 2025 and today is January 1, 2024? The calculator shows roughly 647 days (about 92 weeks or 21 months) to plan. Use it to set milestone reminders: venue at 18 months, invitations at 3 months, etc.',
      proTip:
        "For projects spanning leap years, add 1 day to account for the extra Feb 29. For countdown timers to events, enter today's date as the start date and the event date as the end. Most corporate deadlines are counted in business days — divide the result by 7 and multiply by 5 for a rough business-day estimate.",
    },
    metadata: { version: '1.0.0' },
  },

  // ─── 3. Split Bill Calculator ────────────────────────────────────────
  {
    id: 'split-bill-calculator',
    slug: 'split-bill-calculator',
    title: 'Split Bill Calculator',
    description: 'Split a restaurant bill evenly among any number of people, with optional tip.',
    icon: '🧾',
    category: 'everyday',
    subcategory: 'shopping',
    tags: ['split bill', 'tip', 'dutch pay', 'restaurant', 'divide'],
    inputs: [
      {
        id: 'totalBill',
        label: 'Total Bill',
        type: 'number',
        defaultValue: 120,
        placeholder: 'e.g. 120',
        helpText: 'Enter the pre-tip bill total.',
      },
      {
        id: 'tipPercent',
        label: 'Tip (%)',
        type: 'range',
        defaultValue: 15,
        min: 0,
        max: 50,
        step: 1,
        helpText: 'Slide to adjust tip percentage.',
      },
      {
        id: 'numPeople',
        label: 'Number of People',
        type: 'number',
        defaultValue: 4,
        min: 1,
        max: 50,
        step: 1,
      },
    ],
    formulas: [
      {
        id: 'tipAmount',
        expression: 'totalBill * tipPercent / 100',
        dependencies: ['totalBill', 'tipPercent'],
      },
      {
        id: 'totalWithTip',
        expression: 'totalBill + tipAmount',
        dependencies: ['totalBill', 'tipAmount'],
      },
      {
        id: 'perPerson',
        expression: 'totalWithTip / numPeople',
        dependencies: ['totalWithTip', 'numPeople'],
      },
      {
        id: 'roundedPerPerson',
        expression: 'ceil(perPerson * 100) / 100',
        dependencies: ['perPerson'],
      },
    ],
    outputs: [
      {
        id: 'perPersonOut',
        label: 'Each Person Pays',
        formulaRef: 'perPerson',
        format: 'currency',
        highlight: true,
      },
      {
        id: 'tipAmountOut',
        label: 'Tip Amount',
        formulaRef: 'tipAmount',
        format: 'currency',
      },
      {
        id: 'totalWithTipOut',
        label: 'Total with Tip',
        formulaRef: 'totalWithTip',
        format: 'currency',
      },
    ],
    guide: {
      whatIsIt:
        "The Split Bill Calculator divides a restaurant or group bill evenly among any number of diners, automatically computing the tip and adding it to each person's share. It removes the awkward mental math at the table and ensures everyone pays their fair share.",
      howToUse:
        'Enter the total pre-tip bill amount, drag the tip slider to your desired percentage (15%, 18%, and 20% are the most common in the US), and enter the number of people splitting the bill. The calculator instantly shows the tip, the full total, and each person\'s share.',
      exampleScenario:
        "A group of 4 friends has a $120 dinner. With an 18% tip ($21.60), the total is $141.60, so each person pays $35.40. The calculator confirms this in seconds — no phone calculator fumbling required.",
      proTip:
        'In the US, tipping norms are: 15% for adequate service, 18% for good service, 20% for excellent service, and 25%+ for outstanding. Some restaurants automatically add a "service charge" for large parties (usually 6+) — always check your bill before adding a second tip. The convention of rounding up to the nearest dollar keeps cash transactions simple and leaves a slightly larger tip.',
    },
    metadata: { version: '1.0.0' },
  },

  // ─── 4. Cooking Measurement Converter ───────────────────────────────
  {
    id: 'cooking-converter',
    slug: 'cooking-converter',
    title: 'Cooking Measurement Converter',
    description: 'Convert between US cooking measurements and metric volume units.',
    icon: '🥣',
    category: 'everyday',
    subcategory: 'cooking',
    tags: ['cooking', 'cups', 'tablespoons', 'teaspoons', 'ml', 'measurement'],
    inputs: [
      {
        id: 'amount',
        label: 'Amount',
        type: 'number',
        defaultValue: 1,
        step: 0.25,
        placeholder: 'e.g. 2',
        helpText: 'Enter the quantity you want to convert.',
      },
      {
        id: 'fromUnit',
        label: 'From Unit',
        type: 'select',
        defaultValue: '48',
        options: [
          { label: 'Teaspoon (tsp)', value: '1' },
          { label: 'Tablespoon (tbsp)', value: '3' },
          { label: 'Fluid Ounce (fl oz)', value: '6' },
          { label: 'Cup', value: '48' },
          { label: 'Pint', value: '96' },
          { label: 'Quart', value: '192' },
          { label: 'Gallon', value: '768' },
          { label: 'Milliliter (mL)', value: '0.2029' },
          { label: 'Liter (L)', value: '202.9' },
        ],
        helpText: 'All units are converted via teaspoons as the base unit.',
      },
      {
        id: 'toUnit',
        label: 'To Unit',
        type: 'select',
        defaultValue: '0.2029',
        options: [
          { label: 'Teaspoon (tsp)', value: '1' },
          { label: 'Tablespoon (tbsp)', value: '3' },
          { label: 'Fluid Ounce (fl oz)', value: '6' },
          { label: 'Cup', value: '48' },
          { label: 'Pint', value: '96' },
          { label: 'Quart', value: '192' },
          { label: 'Gallon', value: '768' },
          { label: 'Milliliter (mL)', value: '0.2029' },
          { label: 'Liter (L)', value: '202.9' },
        ],
      },
    ],
    formulas: [
      {
        id: 'result',
        expression: 'amount * fromUnit / toUnit',
        dependencies: ['amount', 'fromUnit', 'toUnit'],
      },
    ],
    outputs: [
      {
        id: 'resultOut',
        label: 'Converted Amount',
        formulaRef: 'result',
        precision: 3,
        highlight: true,
      },
    ],
    guide: {
      whatIsIt:
        'The Cooking Measurement Converter lets you switch between US customary volume units (teaspoons, tablespoons, cups, pints, quarts, gallons) and metric units (milliliters, liters) instantly. It uses teaspoons as the internal base unit — 1 tbsp = 3 tsp, 1 cup = 48 tsp, 1 mL ≈ 0.2029 tsp.',
      howToUse:
        "Enter the amount, select the unit you're converting from, then select the target unit. The converted value appears immediately. For fractions like 1/4 cup, enter 0.25.",
      exampleScenario:
        'A European recipe calls for 250 mL of milk, but your measuring cups are in US units. Select "Milliliter" as From, "Cup" as To, enter 250 — the calculator shows approximately 1.057 cups (just over 1 cup).',
      proTip:
        'There is an important distinction between dry and liquid measuring cups: liquid cups measure volume (what this calculator does), while dry cups are meant to be leveled off for ingredients like flour. For baking precision, especially with flour, consider using weight (grams) rather than volume — 1 cup of all-purpose flour can range from 120 g to 150 g depending on how it is scooped.',
    },
    metadata: { version: '1.0.0' },
  },

  // ─── 5. Bra Size Calculator ──────────────────────────────────────────
  {
    id: 'bra-size-calculator',
    slug: 'bra-size-calculator',
    title: 'Bra Size Calculator',
    description: 'Calculate your bra band size and cup size from underbust and bust measurements.',
    icon: '👙',
    category: 'everyday',
    subcategory: 'lifestyle',
    tags: ['bra size', 'band size', 'cup size', 'measurements', 'fitting'],
    inputs: [
      {
        id: 'bandMeasurement',
        label: 'Underbust (inches)',
        type: 'number',
        defaultValue: 32,
        placeholder: 'e.g. 32',
        helpText: 'Measure snugly around your ribcage, just below the bust.',
      },
      {
        id: 'bustMeasurement',
        label: 'Bust (inches)',
        type: 'number',
        defaultValue: 36,
        placeholder: 'e.g. 36',
        helpText: 'Measure loosely around the fullest part of your bust.',
      },
    ],
    formulas: [
      {
        id: 'bandSize',
        expression: 'bandMeasurement <= 29 ? 28 : (bandMeasurement <= 31 ? 30 : (bandMeasurement <= 33 ? 32 : (bandMeasurement <= 35 ? 34 : (bandMeasurement <= 37 ? 36 : (bandMeasurement <= 39 ? 38 : (bandMeasurement <= 41 ? 40 : 42))))))',
        dependencies: ['bandMeasurement'],
      },
      {
        id: 'cupDiff',
        expression: 'bustMeasurement - bandSize',
        dependencies: ['bustMeasurement', 'bandSize'],
      },
      {
        id: 'cupNumeric',
        expression: 'max(0, cupDiff)',
        dependencies: ['cupDiff'],
      },
    ],
    outputs: [
      {
        id: 'bandSizeOut',
        label: 'Band Size',
        formulaRef: 'bandSize',
        precision: 0,
        highlight: true,
      },
      {
        id: 'cupNumericOut',
        label: 'Cup Difference (inches)',
        formulaRef: 'cupNumeric',
        precision: 0,
        suffix: '" cup diff',
      },
    ],
    guide: {
      whatIsIt:
        'The Bra Size Calculator estimates your US band size and cup size from two body measurements: underbust circumference (for the band) and fullest bust circumference (for the cup). Band sizes are even numbers (28–42+); cup sizes are lettered (A=1", B=2", C=3", D=4", DD/E=5", DDD/F=6").',
      howToUse:
        'Measure your underbust (just below the breasts, snug but not tight) and your bust (around the fullest part of the chest, keeping the tape horizontal). Enter both measurements in inches. The calculator outputs your band size and the inch difference to map to your cup letter.',
      exampleScenario:
        'Underbust = 32", Bust = 36". Band size rounds to 32. Difference = 36 – 32 = 4 inches maps to Cup D. Final size: 32D.',
      proTip:
        'Sister sizing lets you go up or down a band size while maintaining the same cup volume: a 32D equals a 34C and a 30DD. If a bra fits the cups but the band is uncomfortable, try a sister size. For the most accurate result, always get professionally fitted at a lingerie store — measurements can vary by brand and bra style.',
    },
    metadata: { version: '1.0.0' },
  },

  // ─── 6. Ring Size Converter ──────────────────────────────────────────
  {
    id: 'ring-size-converter',
    slug: 'ring-size-converter',
    title: 'Ring Size Converter',
    description: 'Convert ring size between US, EU, UK and inner circumference in millimeters.',
    icon: '💍',
    category: 'everyday',
    subcategory: 'lifestyle',
    tags: ['ring size', 'jewelry', 'circumference', 'US ring', 'EU ring'],
    inputs: [
      {
        id: 'circumferenceMm',
        label: 'Inner Circumference (mm)',
        type: 'number',
        defaultValue: 57,
        min: 40,
        max: 80,
        step: 0.5,
        helpText: 'Wrap a thin strip of paper around your finger, mark where it overlaps, and measure in mm.',
      },
    ],
    formulas: [
      {
        id: 'diameterMm',
        expression: 'circumferenceMm / PI',
        dependencies: ['circumferenceMm'],
      },
      {
        id: 'usSize',
        expression: '(circumferenceMm - 36.5) / 2.5555',
        dependencies: ['circumferenceMm'],
      },
      {
        id: 'euSize',
        expression: 'circumferenceMm - 40',
        dependencies: ['circumferenceMm'],
      },
      {
        id: 'ukNumeric',
        expression: 'usSize * 2',
        dependencies: ['usSize'],
      },
    ],
    outputs: [
      {
        id: 'usSizeOut',
        label: 'US Ring Size',
        formulaRef: 'usSize',
        precision: 1,
        highlight: true,
      },
      {
        id: 'euSizeOut',
        label: 'EU Ring Size',
        formulaRef: 'euSize',
        precision: 0,
        highlight: true,
      },
      {
        id: 'diameterOut',
        label: 'Inner Diameter',
        formulaRef: 'diameterMm',
        precision: 2,
        suffix: ' mm',
      },
      {
        id: 'ukNumericOut',
        label: 'UK Approx. Numeric',
        formulaRef: 'ukNumeric',
        precision: 1,
      },
    ],
    guide: {
      whatIsIt:
        "The Ring Size Converter translates a finger's inner circumference (measured in millimeters) into the major international ring-size systems: US (numerical, half sizes), EU (ISO 8653 standard, circumference minus 40), UK (alphabetical — this calculator shows a numeric proxy), and inner diameter in mm.",
      howToUse:
        "Cut a thin strip of paper about 10 cm long. Wrap it around the base of your finger, mark where the paper overlaps, and measure that length with a ruler in millimeters. Enter the millimeter value into the calculator.",
      exampleScenario:
        'Inner circumference measured as 57 mm: US size approximately 8, EU size = 17, inner diameter approximately 18.15 mm. This is one of the most common ring sizes sold.',
      proTip:
        "Fingers swell throughout the day — they are smallest in the morning and largest in the evening after activity. Measure in the evening for the most comfortable everyday fit. For a ring that will be worn all the time, measure when your hands are warm (not cold). Different metals have different comfort profiles: wider bands feel tighter, so size up half a size for bands wider than 6 mm.",
    },
    metadata: { version: '1.0.0' },
  },

  // ─── 7. Shoe Size Converter ──────────────────────────────────────────
  {
    id: 'shoe-size-converter',
    slug: 'shoe-size-converter',
    title: 'Shoe Size Converter',
    description: 'Convert shoe sizes between US Men, US Women, UK, EU, and foot length in cm.',
    icon: '👟',
    category: 'everyday',
    subcategory: 'lifestyle',
    tags: ['shoe size', 'footwear', 'US shoes', 'EU shoes', 'UK shoes', 'cm foot'],
    inputs: [
      {
        id: 'sizeValue',
        label: 'Size Value',
        type: 'number',
        defaultValue: 9,
        min: 1,
        max: 18,
        step: 0.5,
        helpText: 'Enter your known shoe size number.',
      },
      {
        id: 'fromSystem',
        label: 'Size System',
        type: 'select',
        defaultValue: '0',
        options: [
          { label: 'US Men', value: '0' },
          { label: 'US Women', value: '1' },
          { label: 'UK', value: '2' },
          { label: 'EU', value: '3' },
          { label: 'CM (foot length)', value: '4' },
        ],
      },
    ],
    formulas: [
      {
        id: 'usMen',
        expression: 'fromSystem == 0 ? sizeValue : (fromSystem == 1 ? sizeValue - 1.5 : (fromSystem == 2 ? sizeValue + 0.5 : (fromSystem == 3 ? (sizeValue - 33) / 1.26667 : sizeValue / 0.8467 - 0.5)))',
        dependencies: ['fromSystem', 'sizeValue'],
      },
      {
        id: 'eu',
        expression: 'usMen * 1.26667 + 33.33',
        dependencies: ['usMen'],
      },
      {
        id: 'uk',
        expression: 'usMen - 0.5',
        dependencies: ['usMen'],
      },
      {
        id: 'cmLength',
        expression: 'usMen * 0.8467 + 21.1',
        dependencies: ['usMen'],
      },
    ],
    outputs: [
      {
        id: 'usMenOut',
        label: 'US Men',
        formulaRef: 'usMen',
        precision: 1,
        highlight: true,
      },
      {
        id: 'euOut',
        label: 'EU',
        formulaRef: 'eu',
        precision: 0,
      },
      {
        id: 'ukOut',
        label: 'UK',
        formulaRef: 'uk',
        precision: 1,
      },
      {
        id: 'cmLengthOut',
        label: 'Foot Length',
        formulaRef: 'cmLength',
        precision: 1,
        suffix: ' cm',
      },
    ],
    guide: {
      whatIsIt:
        "The Shoe Size Converter translates between the four most common shoe-size systems worldwide: US Men, US Women, UK, and EU (Paris Point), plus foot length in centimeters. US Women's sizes run 1.5 sizes larger than US Men's; UK sizes run 0.5 below US Men's; EU sizes use the Paris Point system (2/3 cm per size).",
      howToUse:
        "Select the size system you already know (e.g., US Men), enter your size, and the calculator outputs the equivalent sizes in all other systems simultaneously.",
      exampleScenario:
        "A US Men's size 10 converts to: EU 46, UK 9.5, and approximately 27.6 cm foot length. If you're shopping from a Japanese or Korean site, look up their country-specific chart separately as those also vary.",
      proTip:
        "Width fittings matter too: US standard widths are B (narrow), D (standard men's), E (wide), and EE (extra wide). For the most accurate fit when buying online, trace your foot on paper and measure the length from heel to longest toe. Shop for shoes in the afternoon when your feet are at their largest after walking. Running shoes typically fit best half to one full size larger than dress shoes.",
    },
    metadata: { version: '1.0.0' },
  },

  // ─── 8. Carbon Footprint Calculator ─────────────────────────────────
  {
    id: 'carbon-footprint-calculator',
    slug: 'carbon-footprint-calculator',
    title: 'Carbon Footprint Calculator',
    description: 'Estimate your annual carbon footprint from driving, electricity, flights, and diet, with offset recommendations.',
    icon: '🌱',
    category: 'everyday',
    subcategory: 'environmental',
    tags: ['carbon footprint', 'co2', 'emissions', 'climate', 'sustainability', 'environment'],
    inputs: [
      {
        id: 'carMiles',
        label: 'Car Miles per Year',
        type: 'number',
        defaultValue: 12000,
        helpText: 'Average US driver: 12,000–15,000 miles/year.',
      },
      {
        id: 'mpg',
        label: 'Fuel Economy (MPG)',
        type: 'number',
        defaultValue: 28,
        min: 1,
        helpText: 'Average new car: ~28 MPG. Check your dashboard or fueleconomy.gov.',
      },
      {
        id: 'electricityKwh',
        label: 'Monthly Electricity (kWh)',
        type: 'number',
        defaultValue: 900,
        helpText: 'US avg: ~900 kWh/month. Check your utility bill.',
      },
      {
        id: 'flights',
        label: 'Flights per Year',
        type: 'select',
        defaultValue: '1.5',
        options: [
          { label: 'None (0)', value: '0' },
          { label: '1–2 short flights', value: '1.5' },
          { label: '3–5 flights', value: '4' },
          { label: '6–10 flights', value: '8' },
          { label: '11+ flights', value: '15' },
        ],
      },
      {
        id: 'diet',
        label: 'Diet Type',
        type: 'select',
        defaultValue: '2500',
        options: [
          { label: 'Vegan', value: '1500' },
          { label: 'Vegetarian', value: '1700' },
          { label: 'Average Omnivore', value: '2500' },
          { label: 'Heavy Meat Eater', value: '3300' },
        ],
        helpText: 'Annual diet-related CO2e in kg.',
      },
    ],
    formulas: [
      {
        id: 'carKg',
        expression: 'carMiles / mpg * 8.887',
        dependencies: ['carMiles', 'mpg'],
      },
      {
        id: 'electricKg',
        expression: 'electricityKwh * 12 * 0.386',
        dependencies: ['electricityKwh'],
      },
      {
        id: 'flightKg',
        expression: 'flights * 1100',
        dependencies: ['flights'],
      },
      {
        id: 'dietKg',
        expression: 'diet * 1',
        dependencies: ['diet'],
      },
      {
        id: 'totalKg',
        expression: 'carKg + electricKg + flightKg + dietKg',
        dependencies: ['carKg', 'electricKg', 'flightKg', 'dietKg'],
      },
      {
        id: 'totalTons',
        expression: 'totalKg / 1000',
        dependencies: ['totalKg'],
      },
      {
        id: 'treesNeeded',
        expression: 'ceil(totalKg / 21)',
        dependencies: ['totalKg'],
      },
    ],
    outputs: [
      {
        id: 'totalTonsOut',
        label: 'Annual Carbon Footprint',
        formulaRef: 'totalTons',
        precision: 2,
        suffix: ' tons CO2e/yr',
        highlight: true,
      },
      {
        id: 'treesNeededOut',
        label: 'Trees to Offset (annual)',
        formulaRef: 'treesNeeded',
        precision: 0,
      },
      {
        id: 'carKgOut',
        label: 'Driving Emissions',
        formulaRef: 'carKg',
        precision: 0,
        suffix: ' kg',
      },
      {
        id: 'electricKgOut',
        label: 'Electricity Emissions',
        formulaRef: 'electricKg',
        precision: 0,
        suffix: ' kg',
      },
    ],
    guide: {
      whatIsIt:
        'The Carbon Footprint Calculator estimates how many metric tons of CO2-equivalent greenhouse gases you emit each year from your four biggest personal sources: driving a car, home electricity use, air travel, and diet. It also tells you roughly how many trees would need to be planted to offset that output annually (each mature tree absorbs about 21 kg CO2/year).',
      howToUse:
        'Enter your annual car mileage and fuel economy. Enter your monthly electricity usage (from your utility bill). Select your approximate flight frequency and diet type. The calculator outputs your total footprint in metric tons CO2e per year, broken down by source, plus a tree-offset estimate.',
      exampleScenario:
        'Someone drives 12,000 miles/year at 28 MPG, uses 900 kWh/month of electricity, takes 1–2 flights, and eats an average omnivore diet. Result: roughly 12–14 metric tons CO2e/year — well above the global average of 4.8 tons but near the US average of approximately 16 tons.',
      proTip:
        'Focus on reduction before offset. The highest-impact personal actions are: (1) going car-free or switching to an EV, (2) shifting to renewable electricity, (3) reducing flights (especially long-haul), and (4) reducing red meat consumption. The Paris Agreement calls for per-capita emissions below 2 tons by 2050. Carbon offsets (tree planting, renewable energy credits) are useful supplements but should not replace behavioral change.',
    },
    metadata: { version: '1.0.0' },
  },

  // ─── 9. Pet Age Calculator ───────────────────────────────────────────
  {
    id: 'pet-age-calculator',
    slug: 'pet-age-calculator',
    title: 'Pet Age Calculator',
    description: "Convert your dog or cat's age to the human equivalent using breed-size adjusted formulas.",
    icon: '🐾',
    category: 'everyday',
    subcategory: 'pets',
    tags: ['dog age', 'cat age', 'pet age', 'human years', 'animal age'],
    inputs: [
      {
        id: 'petAge',
        label: 'Pet Age (years)',
        type: 'number',
        defaultValue: 3,
        min: 0,
        max: 25,
        step: 0.5,
      },
      {
        id: 'petType',
        label: 'Pet Type & Size',
        type: 'select',
        defaultValue: '0',
        options: [
          { label: 'Dog — Small (< 20 lb)', value: '0' },
          { label: 'Dog — Medium (20–50 lb)', value: '1' },
          { label: 'Dog — Large (50 lb+)', value: '2' },
          { label: 'Cat', value: '3' },
        ],
        helpText: 'Larger dogs age faster than smaller dogs.',
      },
    ],
    formulas: [
      {
        id: 'smallDog',
        expression: 'petAge <= 1 ? 15 : (petAge <= 2 ? 24 : 24 + petAge * 4)',
        dependencies: ['petAge'],
      },
      {
        id: 'medDog',
        expression: 'petAge <= 1 ? 15 : (petAge <= 2 ? 24 : 24 + petAge * 5)',
        dependencies: ['petAge'],
      },
      {
        id: 'largeDog',
        expression: 'petAge <= 1 ? 15 : (petAge <= 2 ? 24 : 24 + petAge * 6)',
        dependencies: ['petAge'],
      },
      {
        id: 'catYears',
        expression: 'petAge <= 1 ? 15 : (petAge <= 2 ? 24 : 24 + petAge * 4)',
        dependencies: ['petAge'],
      },
      {
        id: 'humanYears',
        expression: 'petType == 0 ? smallDog : (petType == 1 ? medDog : (petType == 2 ? largeDog : catYears))',
        dependencies: ['petType', 'smallDog', 'medDog', 'largeDog', 'catYears'],
      },
    ],
    outputs: [
      {
        id: 'humanYearsOut',
        label: 'Human Age Equivalent',
        formulaRef: 'humanYears',
        precision: 0,
        suffix: ' human years',
        highlight: true,
      },
    ],
    guide: {
      whatIsIt:
        "The Pet Age Calculator converts your pet's actual age into an approximate human-equivalent age. The classic 'multiply by 7' rule is inaccurate — pets age very rapidly in their first two years and then slow down. This calculator uses a more realistic model: the first year equals approximately 15 human years, year two adds about 9 more, and subsequent years add 4–6 per year depending on dog size (larger breeds age faster).",
      howToUse:
        "Enter your pet's age in years (decimals supported, e.g., 1.5 for 18 months). Select the pet type and size category. The result shows the approximate human-equivalent age.",
      exampleScenario:
        'A 3-year-old medium-sized dog (25 lb Golden mix): 24 + 3 × 5 = 39 human years — in their prime, equivalent to a late-30s adult. A 10-year-old large dog: 24 + 10 × 6 = 84 human years — a senior citizen who needs more frequent vet check-ups.',
      proTip:
        'Large and giant breeds (Great Danes, St. Bernards) have shorter lifespans than small breeds — a 7-year-old Great Dane is already elderly. Annual vet visits are recommended for adult pets; twice-yearly for seniors (dogs 7+, cats 10+). A 2019 UC San Diego study suggests using the formula: human age = 16 × ln(dog age) + 31, which aligns even better with biological aging markers.',
    },
    metadata: { version: '1.0.0' },
  },

  // ─── 10. Electricity Cost Calculator ────────────────────────────────
  {
    id: 'electricity-cost-calculator',
    slug: 'electricity-cost-calculator',
    title: 'Electricity Cost Calculator',
    description: 'Calculate monthly and annual electricity cost for any device or appliance from wattage and usage hours.',
    icon: '⚡',
    category: 'everyday',
    subcategory: 'utility',
    tags: ['electricity', 'kWh', 'power', 'energy cost', 'electric bill'],
    inputs: [
      {
        id: 'watts',
        label: 'Device Power (Watts)',
        type: 'number',
        defaultValue: 100,
        helpText: 'Check the label on the device or its manual. A typical LED bulb is 10 W; a fridge is 150 W.',
      },
      {
        id: 'hoursPerDay',
        label: 'Hours Used per Day',
        type: 'number',
        defaultValue: 8,
        min: 0,
        max: 24,
        step: 0.5,
      },
      {
        id: 'daysPerMonth',
        label: 'Days per Month',
        type: 'number',
        defaultValue: 30,
        min: 1,
        max: 31,
      },
      {
        id: 'ratePerKwh',
        label: 'Rate ($/kWh)',
        type: 'number',
        defaultValue: 0.13,
        step: 0.01,
        helpText: 'US average: ~$0.16/kWh. Check your utility bill for your exact rate.',
      },
    ],
    formulas: [
      {
        id: 'kwhPerDay',
        expression: 'watts / 1000 * hoursPerDay',
        dependencies: ['watts', 'hoursPerDay'],
      },
      {
        id: 'kwhPerMonth',
        expression: 'kwhPerDay * daysPerMonth',
        dependencies: ['kwhPerDay', 'daysPerMonth'],
      },
      {
        id: 'monthlyCost',
        expression: 'kwhPerMonth * ratePerKwh',
        dependencies: ['kwhPerMonth', 'ratePerKwh'],
      },
      {
        id: 'annualCost',
        expression: 'monthlyCost * 12',
        dependencies: ['monthlyCost'],
      },
    ],
    outputs: [
      {
        id: 'monthlyCostOut',
        label: 'Monthly Cost',
        formulaRef: 'monthlyCost',
        format: 'currency',
        highlight: true,
      },
      {
        id: 'annualCostOut',
        label: 'Annual Cost',
        formulaRef: 'annualCost',
        format: 'currency',
      },
      {
        id: 'kwhPerMonthOut',
        label: 'Usage per Month',
        formulaRef: 'kwhPerMonth',
        precision: 2,
        suffix: ' kWh/month',
      },
      {
        id: 'kwhPerDayOut',
        label: 'Usage per Day',
        formulaRef: 'kwhPerDay',
        precision: 3,
        suffix: ' kWh/day',
      },
    ],
    guide: {
      whatIsIt:
        'The Electricity Cost Calculator computes the monthly and annual cost to run any electrical device based on its power rating (watts), daily usage, days used per month, and your local electricity rate ($/kWh). It helps you identify energy hogs and prioritize efficiency upgrades.',
      howToUse:
        "Find the wattage on the device label or in its manual. Enter how many hours per day you typically use it and how many days per month. Enter your electricity rate from your utility bill (or use the US average of $0.13–$0.16/kWh). The calculator shows daily kWh, monthly kWh, and monthly and annual costs.",
      exampleScenario:
        'A 1500 W space heater used 6 hours/day for 30 days at $0.15/kWh costs: 1500/1000 × 6 × 30 × $0.15 = $40.50/month or $486/year. Compared to turning it down or using it 4 hours instead of 6 (saving $13.50/month), the payoff of a programmable thermostat is immediate.',
      proTip:
        'Standby or "vampire" power is real — TVs, gaming consoles, and phone chargers consume 0.5–5 W even when off. A household can have 20–40 such devices, adding $50–100/year. Use a smart power strip or unplug devices when not in use. The biggest energy users in a typical home are: HVAC system (46%), water heater (14%), washer/dryer (13%), refrigerator (4%), and lighting (4%).',
    },
    metadata: { version: '1.0.0' },
  },

  // ─── 11. Reading Time Calculator ────────────────────────────────────
  {
    id: 'reading-time-calculator',
    slug: 'reading-time-calculator',
    title: 'Reading Time Calculator',
    description: 'Estimate how long it will take to read any text based on word count and reading speed.',
    icon: '📚',
    category: 'everyday',
    subcategory: 'utility',
    tags: ['reading time', 'words per minute', 'wpm', 'book', 'article'],
    inputs: [
      {
        id: 'wordCount',
        label: 'Word Count',
        type: 'number',
        defaultValue: 2000,
        min: 1,
        placeholder: 'e.g. 2000',
        helpText: "Use your word processor's word count tool.",
      },
      {
        id: 'readingSpeed',
        label: 'Reading Speed',
        type: 'select',
        defaultValue: '238',
        options: [
          { label: 'Slow (150 wpm)', value: '150' },
          { label: 'Average (238 wpm)', value: '238' },
          { label: 'Fast (400 wpm)', value: '400' },
          { label: 'Speed Read (700 wpm)', value: '700' },
        ],
        helpText: 'Average adult reads 238 wpm; trained speed readers reach 700+ wpm.',
      },
    ],
    formulas: [
      {
        id: 'totalMinutes',
        expression: 'wordCount / readingSpeed',
        dependencies: ['wordCount', 'readingSpeed'],
      },
      {
        id: 'hours',
        expression: 'floor(totalMinutes / 60)',
        dependencies: ['totalMinutes'],
      },
      {
        id: 'remainMinutes',
        expression: 'floor(totalMinutes - hours * 60)',
        dependencies: ['totalMinutes', 'hours'],
      },
      {
        id: 'totalSeconds',
        expression: 'totalMinutes * 60',
        dependencies: ['totalMinutes'],
      },
    ],
    outputs: [
      {
        id: 'totalMinutesOut',
        label: 'Reading Time',
        formulaRef: 'totalMinutes',
        precision: 1,
        suffix: ' minutes',
        highlight: true,
      },
      {
        id: 'hoursOut',
        label: 'Hours',
        formulaRef: 'hours',
        precision: 0,
        suffix: ' hours',
      },
      {
        id: 'remainMinutesOut',
        label: 'Remaining Minutes',
        formulaRef: 'remainMinutes',
        precision: 0,
        suffix: ' min remainder',
      },
    ],
    guide: {
      whatIsIt:
        'The Reading Time Calculator estimates how long it will take to read a piece of text given its word count and your reading speed in words per minute (wpm). It is useful for scheduling reading sessions, estimating podcast or audiobook durations, and planning blog or article content for your audience.',
      howToUse:
        "Enter the total word count of the text (use your word processor's built-in word count tool). Then select your reading speed — or the speed of your intended audience. The result is the estimated reading time in total minutes, broken into hours and minutes.",
      exampleScenario:
        'A typical long-read article is about 5,000 words. At the average 238 wpm pace, it takes about 21 minutes. If you are a fast reader at 400 wpm, you will finish in about 12.5 minutes. A full novel at 80,000 words takes the average reader about 5.6 hours.',
      proTip:
        'Content creators often display estimated reading times on blog posts. Research shows readers are more likely to start an article if the time commitment is stated upfront. Aim for 5–7 minute reads (around 1,200–1,700 words) for peak engagement on digital platforms. The Spritz speed-reading technique (displaying one word at a time at the optimal recognition point) claims to double reading speeds without comprehension loss — useful for reviewing material you already partially know.',
    },
    metadata: { version: '1.0.0' },
  },

  // ─── 12. YouTube Playlist Length ────────────────────────────────────
  {
    id: 'youtube-playlist-length',
    slug: 'youtube-playlist-length',
    title: 'YouTube Playlist Length',
    description: 'Calculate the total runtime of a YouTube playlist at any playback speed.',
    icon: '▶️',
    category: 'everyday',
    subcategory: 'utility',
    tags: ['youtube', 'playlist', 'video length', 'playback speed', 'binge'],
    inputs: [
      {
        id: 'numVideos',
        label: 'Number of Videos',
        type: 'number',
        defaultValue: 20,
        min: 1,
        step: 1,
      },
      {
        id: 'avgMinutes',
        label: 'Average Length (minutes)',
        type: 'number',
        defaultValue: 10,
        min: 0,
        step: 1,
        helpText: 'Enter the average video length in minutes.',
      },
      {
        id: 'avgSeconds',
        label: 'Average Seconds',
        type: 'number',
        defaultValue: 0,
        min: 0,
        max: 59,
        step: 1,
        helpText: "Add seconds if the average isn't a whole number of minutes.",
      },
      {
        id: 'speed',
        label: 'Playback Speed',
        type: 'select',
        defaultValue: '1',
        options: [
          { label: '0.75x', value: '0.75' },
          { label: 'Normal (1x)', value: '1' },
          { label: '1.25x', value: '1.25' },
          { label: '1.5x', value: '1.5' },
          { label: '1.75x', value: '1.75' },
          { label: '2x', value: '2' },
        ],
      },
    ],
    formulas: [
      {
        id: 'totalRawSec',
        expression: 'numVideos * (avgMinutes * 60 + avgSeconds)',
        dependencies: ['numVideos', 'avgMinutes', 'avgSeconds'],
      },
      {
        id: 'adjustedSec',
        expression: 'totalRawSec / speed',
        dependencies: ['totalRawSec', 'speed'],
      },
      {
        id: 'totalMinutes',
        expression: 'adjustedSec / 60',
        dependencies: ['adjustedSec'],
      },
      {
        id: 'hours',
        expression: 'floor(totalMinutes / 60)',
        dependencies: ['totalMinutes'],
      },
      {
        id: 'remMin',
        expression: 'floor(totalMinutes - hours * 60)',
        dependencies: ['totalMinutes', 'hours'],
      },
    ],
    outputs: [
      {
        id: 'hoursOut',
        label: 'Hours',
        formulaRef: 'hours',
        precision: 0,
        suffix: 'h',
        highlight: true,
      },
      {
        id: 'remMinOut',
        label: 'Minutes',
        formulaRef: 'remMin',
        precision: 0,
        suffix: 'm',
        highlight: true,
      },
      {
        id: 'totalMinutesOut',
        label: 'Total Minutes',
        formulaRef: 'totalMinutes',
        precision: 1,
        suffix: ' total min',
      },
    ],
    guide: {
      whatIsIt:
        'The YouTube Playlist Length Calculator estimates how long it will take to watch an entire playlist at a given playback speed. YouTube supports speeds from 0.25x to 2x; this calculator covers the most commonly used speeds (0.75x–2x).',
      howToUse:
        'Enter the total number of videos in the playlist, the average video length in minutes and seconds, and your intended playback speed. The calculator shows the adjusted total runtime in hours and minutes.',
      exampleScenario:
        'A coding tutorial playlist has 30 videos averaging 15 minutes each = 7.5 hours at 1x speed. At 1.5x playback speed, that becomes only 5 hours — saving 2.5 hours while still covering all the content.',
      proTip:
        'Watching at 1.5x speed saves 33% of your time; 2x saves 50%. Studies suggest comprehension stays near 100% up to about 1.5x for most learners, but drops noticeably beyond 2x. For dense technical or language-learning content, stick to 1x or 1.25x. Plan marathon binge sessions by factoring in breaks: schedule a 10-minute break for every hour of content to maintain focus and retention.',
    },
    metadata: { version: '1.0.0' },
  },

  // ─── 13. Zodiac Sign Calculator ──────────────────────────────────────
  {
    id: 'zodiac-sign-calculator',
    slug: 'zodiac-sign-calculator',
    title: 'Zodiac Sign Calculator',
    description: 'Find your Western zodiac sign based on your birth month and day.',
    icon: '✨',
    category: 'everyday',
    subcategory: 'lifestyle',
    tags: ['zodiac', 'astrology', 'star sign', 'horoscope', 'birthday'],
    inputs: [
      {
        id: 'month',
        label: 'Birth Month',
        type: 'select',
        defaultValue: '6',
        options: [
          { label: 'January', value: '1' },
          { label: 'February', value: '2' },
          { label: 'March', value: '3' },
          { label: 'April', value: '4' },
          { label: 'May', value: '5' },
          { label: 'June', value: '6' },
          { label: 'July', value: '7' },
          { label: 'August', value: '8' },
          { label: 'September', value: '9' },
          { label: 'October', value: '10' },
          { label: 'November', value: '11' },
          { label: 'December', value: '12' },
        ],
      },
      {
        id: 'day',
        label: 'Birth Day',
        type: 'number',
        defaultValue: 15,
        min: 1,
        max: 31,
        step: 1,
      },
    ],
    formulas: [
      {
        id: 'signNum',
        expression: 'month == 1 ? (day < 20 ? 10 : 11) : (month == 2 ? (day < 19 ? 11 : 12) : (month == 3 ? (day < 21 ? 12 : 1) : (month == 4 ? (day < 20 ? 1 : 2) : (month == 5 ? (day < 21 ? 2 : 3) : (month == 6 ? (day < 21 ? 3 : 4) : (month == 7 ? (day < 23 ? 4 : 5) : (month == 8 ? (day < 23 ? 5 : 6) : (month == 9 ? (day < 23 ? 6 : 7) : (month == 10 ? (day < 23 ? 7 : 8) : (month == 11 ? (day < 22 ? 8 : 9) : 9))))))))))',
        dependencies: ['month', 'day'],
      },
    ],
    outputs: [
      {
        id: 'signNumOut',
        label: 'Zodiac Code (1=Aries, 2=Taurus, 3=Gemini, 4=Cancer, 5=Leo, 6=Virgo, 7=Libra, 8=Scorpio, 9=Sagittarius, 10=Capricorn, 11=Aquarius, 12=Pisces)',
        formulaRef: 'signNum',
        precision: 0,
        highlight: true,
      },
    ],
    guide: {
      whatIsIt:
        'The Zodiac Sign Calculator determines your Western (tropical) sun sign based on your birth month and day. The 12 signs each span roughly 30 days of the year: Aries (Mar 21–Apr 19), Taurus (Apr 20–May 20), Gemini (May 21–Jun 20), Cancer (Jun 21–Jul 22), Leo (Jul 23–Aug 22), Virgo (Aug 23–Sep 22), Libra (Sep 23–Oct 22), Scorpio (Oct 23–Nov 21), Sagittarius (Nov 22–Dec 21), Capricorn (Dec 22–Jan 19), Aquarius (Jan 20–Feb 18), Pisces (Feb 19–Mar 20).',
      howToUse:
        'Select your birth month and enter your birth day. The calculator returns a numeric code (1–12) mapping to your zodiac sign. Use the label to read off your sign name.',
      exampleScenario:
        'Born June 15: Month = June (6), Day = 15. Since 15 < 21, the sign code is 3 = Gemini. Born July 25: Month = July (7), Day = 25. Since 25 is 23 or above, the sign code is 5 = Leo.',
      proTip:
        'The four zodiac elements group signs by personality archetype: Fire (Aries, Leo, Sagittarius) — bold and energetic; Earth (Taurus, Virgo, Capricorn) — practical and grounded; Air (Gemini, Libra, Aquarius) — intellectual and communicative; Water (Cancer, Scorpio, Pisces) — emotional and intuitive. This calculator is for entertainment purposes only — there is no scientific evidence linking birth date to personality or destiny.',
    },
    metadata: { version: '1.0.0' },
  },

  // ─── 14. Leap Year Calculator ────────────────────────────────────────
  {
    id: 'leap-year-calculator',
    slug: 'leap-year-calculator',
    title: 'Leap Year Calculator',
    description: 'Determine if any year is a leap year using the Gregorian calendar rule.',
    icon: '📆',
    category: 'everyday',
    subcategory: 'time',
    tags: ['leap year', 'calendar', 'february 29', 'gregorian', 'year'],
    inputs: [
      {
        id: 'year',
        label: 'Year',
        type: 'number',
        defaultValue: 2024,
        min: 1,
        max: 9999,
        step: 1,
        placeholder: 'e.g. 2024',
      },
    ],
    formulas: [
      {
        id: 'div4',
        expression: 'year - floor(year / 4) * 4',
        dependencies: ['year'],
      },
      {
        id: 'div100',
        expression: 'year - floor(year / 100) * 100',
        dependencies: ['year'],
      },
      {
        id: 'div400',
        expression: 'year - floor(year / 400) * 400',
        dependencies: ['year'],
      },
      {
        id: 'isLeap',
        expression: 'div400 == 0 ? 1 : (div100 == 0 ? 0 : (div4 == 0 ? 1 : 0))',
        dependencies: ['div400', 'div100', 'div4'],
      },
      {
        id: 'daysInYear',
        expression: 'isLeap == 1 ? 366 : 365',
        dependencies: ['isLeap'],
      },
      {
        id: 'nextLeapYears',
        expression: '4 - div4',
        dependencies: ['div4'],
      },
    ],
    outputs: [
      {
        id: 'isLeapOut',
        label: 'Is Leap Year? (1 = Yes, 0 = No)',
        formulaRef: 'isLeap',
        precision: 0,
        highlight: true,
      },
      {
        id: 'daysInYearOut',
        label: 'Days in Year',
        formulaRef: 'daysInYear',
        precision: 0,
        suffix: ' days',
      },
      {
        id: 'nextLeapYearsOut',
        label: 'Years Until Next Leap Year (approx)',
        formulaRef: 'nextLeapYears',
        precision: 0,
        suffix: ' years to next (approx)',
      },
    ],
    guide: {
      whatIsIt:
        "The Leap Year Calculator checks whether any given year is a leap year under the Gregorian calendar system. A leap year has 366 days — February gains an extra day (Feb 29) to keep the calendar aligned with Earth's orbital period of 365.2422 days.",
      howToUse:
        'Enter any year from 1 to 9999 and the calculator instantly tells you if it is a leap year (1 = Yes, 0 = No), how many days are in that year, and approximately how many years remain until the next leap year.',
      exampleScenario:
        '2000 is a leap year (divisible by 400). 1900 is NOT a leap year (divisible by 100 but NOT by 400). 2024 IS a leap year (divisible by 4 and not by 100). 2100 will NOT be a leap year.',
      proTip:
        "The Gregorian rule: a year is a leap year if it is divisible by 4 — EXCEPT for century years (divisible by 100), which must ALSO be divisible by 400. This subtle rule was missing from the Julian calendar (which treated every 4th year as a leap year), causing a drift of about 1 day every 128 years. By 1582, the Julian calendar was 10 days ahead of the solar year, prompting Pope Gregory XIII's calendar reform. If you were born on February 29, your actual birthday only comes around every 4 years — legally you typically celebrate on Feb 28 or Mar 1 in non-leap years.",
    },
    metadata: { version: '1.0.0' },
  },

  // ─── 15. Road Trip Fuel Cost ─────────────────────────────────────────
  {
    id: 'road-trip-calculator',
    slug: 'road-trip-calculator',
    title: 'Road Trip Fuel Cost',
    description: 'Calculate the total fuel cost for a road trip, cost per person, and gallons needed.',
    icon: '🚗',
    category: 'everyday',
    subcategory: 'travel',
    tags: ['road trip', 'fuel cost', 'gas', 'travel', 'mileage'],
    inputs: [
      {
        id: 'distance',
        label: 'Trip Distance (miles)',
        type: 'number',
        defaultValue: 500,
        min: 1,
        placeholder: 'e.g. 500',
        helpText: 'One-way distance. Use Google Maps for accurate mileage.',
      },
      {
        id: 'mpg',
        label: 'Fuel Economy (MPG)',
        type: 'number',
        defaultValue: 30,
        min: 1,
        helpText: "Check fueleconomy.gov or your car's dashboard display.",
      },
      {
        id: 'fuelPrice',
        label: 'Gas Price per Gallon ($)',
        type: 'number',
        defaultValue: 3.50,
        step: 0.01,
        helpText: 'Check GasBuddy.com for current prices along your route.',
      },
      {
        id: 'passengers',
        label: 'Number of Passengers',
        type: 'number',
        defaultValue: 2,
        min: 1,
        max: 20,
        step: 1,
        helpText: 'Include the driver.',
      },
    ],
    formulas: [
      {
        id: 'gallonsNeeded',
        expression: 'distance / mpg',
        dependencies: ['distance', 'mpg'],
      },
      {
        id: 'totalFuelCost',
        expression: 'gallonsNeeded * fuelPrice',
        dependencies: ['gallonsNeeded', 'fuelPrice'],
      },
      {
        id: 'costPerPerson',
        expression: 'totalFuelCost / passengers',
        dependencies: ['totalFuelCost', 'passengers'],
      },
      {
        id: 'returnTrip',
        expression: 'totalFuelCost * 2',
        dependencies: ['totalFuelCost'],
      },
    ],
    outputs: [
      {
        id: 'totalFuelCostOut',
        label: 'One-Way Fuel Cost',
        formulaRef: 'totalFuelCost',
        format: 'currency',
        highlight: true,
      },
      {
        id: 'costPerPersonOut',
        label: 'Cost per Person (one-way)',
        formulaRef: 'costPerPerson',
        format: 'currency',
      },
      {
        id: 'gallonsNeededOut',
        label: 'Gallons Needed',
        formulaRef: 'gallonsNeeded',
        precision: 2,
        suffix: ' gallons',
      },
      {
        id: 'returnTripOut',
        label: 'Round Trip Cost',
        formulaRef: 'returnTrip',
        format: 'currency',
      },
    ],
    guide: {
      whatIsIt:
        "The Road Trip Fuel Cost Calculator estimates how much you will spend on gas for a road trip. Enter the one-way distance, your car's fuel economy, current gas prices, and the number of people sharing the trip — it returns one-way cost, round-trip cost, gallons needed, and per-person share.",
      howToUse:
        "Look up your route distance on Google Maps. Find your car's MPG rating on fueleconomy.gov or your dashboard fuel economy display. Check current gas prices on GasBuddy or at local stations along your route. Enter all values and the calculator does the rest.",
      exampleScenario:
        'A 500-mile road trip in a 30 MPG car at $3.50/gallon with 2 passengers: 500/30 approximately 16.7 gallons × $3.50 = $58.33 one-way. Each person pays $29.17 one-way, or $116.67 for the full round trip between both people.',
      proTip:
        'Your real-world MPG will differ from the EPA estimate. Highway driving at 65 mph is most efficient; mpg drops significantly above 75 mph due to aerodynamic drag (roughly 3–5% less per 5 mph over 50 mph). Properly inflated tires improve efficiency by 0.5–3%. Carpooling is the single biggest per-person savings: 4 passengers in a 30 MPG car produces the same per-person CO2 as a 120 MPG vehicle. For EVs, replace MPG with miles-per-kWh and fuel cost with your electricity rate.',
    },
    metadata: { version: '1.0.0' },
  },

  // ─── 16. Time Zone Converter ─────────────────────────────────────────
  {
    id: 'timezone-converter',
    slug: 'timezone-converter',
    title: 'Time Zone Converter',
    description: 'Convert a local time to another time zone by entering UTC offsets.',
    icon: '🌍',
    category: 'everyday',
    subcategory: 'time',
    tags: ['time zone', 'utc', 'convert time', 'world clock', 'international'],
    inputs: [
      {
        id: 'localHour',
        label: 'Your Local Hour (0–23)',
        type: 'number',
        defaultValue: 9,
        min: 0,
        max: 23,
        step: 1,
        helpText: 'Use 24-hour format (0 = midnight, 13 = 1 PM).',
      },
      {
        id: 'localMinute',
        label: 'Minutes',
        type: 'number',
        defaultValue: 0,
        min: 0,
        max: 59,
        step: 1,
      },
      {
        id: 'fromOffset',
        label: 'Your Time Zone (UTC offset)',
        type: 'select',
        defaultValue: '-5',
        options: [
          { label: 'UTC-12', value: '-12' },
          { label: 'UTC-11', value: '-11' },
          { label: 'UTC-10 (Hawaii)', value: '-10' },
          { label: 'UTC-9 (Alaska)', value: '-9' },
          { label: 'UTC-8 (PST)', value: '-8' },
          { label: 'UTC-7 (MST)', value: '-7' },
          { label: 'UTC-6 (CST)', value: '-6' },
          { label: 'UTC-5 (EST)', value: '-5' },
          { label: 'UTC-4 (AST)', value: '-4' },
          { label: 'UTC-3', value: '-3' },
          { label: 'UTC+0 (UTC/GMT)', value: '0' },
          { label: 'UTC+1 (CET)', value: '1' },
          { label: 'UTC+2 (EET)', value: '2' },
          { label: 'UTC+3 (Moscow)', value: '3' },
          { label: 'UTC+5:30 (IST)', value: '5.5' },
          { label: 'UTC+7 (Bangkok)', value: '7' },
          { label: 'UTC+8 (CST/AWST)', value: '8' },
          { label: 'UTC+9 (JST)', value: '9' },
          { label: 'UTC+10 (AEST)', value: '10' },
          { label: 'UTC+12 (NZST)', value: '12' },
        ],
      },
      {
        id: 'toOffset',
        label: 'Target Time Zone (UTC offset)',
        type: 'select',
        defaultValue: '0',
        options: [
          { label: 'UTC-12', value: '-12' },
          { label: 'UTC-11', value: '-11' },
          { label: 'UTC-10 (Hawaii)', value: '-10' },
          { label: 'UTC-9 (Alaska)', value: '-9' },
          { label: 'UTC-8 (PST)', value: '-8' },
          { label: 'UTC-7 (MST)', value: '-7' },
          { label: 'UTC-6 (CST)', value: '-6' },
          { label: 'UTC-5 (EST)', value: '-5' },
          { label: 'UTC-4 (AST)', value: '-4' },
          { label: 'UTC-3', value: '-3' },
          { label: 'UTC+0 (UTC/GMT)', value: '0' },
          { label: 'UTC+1 (CET)', value: '1' },
          { label: 'UTC+2 (EET)', value: '2' },
          { label: 'UTC+3 (Moscow)', value: '3' },
          { label: 'UTC+5:30 (IST)', value: '5.5' },
          { label: 'UTC+7 (Bangkok)', value: '7' },
          { label: 'UTC+8 (CST/AWST)', value: '8' },
          { label: 'UTC+9 (JST)', value: '9' },
          { label: 'UTC+10 (AEST)', value: '10' },
          { label: 'UTC+12 (NZST)', value: '12' },
        ],
      },
    ],
    formulas: [
      {
        id: 'diff',
        expression: 'toOffset - fromOffset',
        dependencies: ['toOffset', 'fromOffset'],
      },
      {
        id: 'rawHour',
        expression: 'localHour + diff',
        dependencies: ['localHour', 'diff'],
      },
      {
        id: 'normalHour',
        expression: 'rawHour < 0 ? rawHour + 24 : (rawHour >= 24 ? rawHour - 24 : rawHour)',
        dependencies: ['rawHour'],
      },
      {
        id: 'dayOffset',
        expression: 'rawHour < 0 ? -1 : (rawHour >= 24 ? 1 : 0)',
        dependencies: ['rawHour'],
      },
    ],
    outputs: [
      {
        id: 'normalHourOut',
        label: 'Target Time (hour)',
        formulaRef: 'normalHour',
        precision: 0,
        suffix: ':00',
        highlight: true,
      },
      {
        id: 'diffOut',
        label: 'Hours Offset',
        formulaRef: 'diff',
        precision: 1,
        suffix: ' hours offset',
      },
      {
        id: 'dayOffsetOut',
        label: 'Day Difference (-1=yesterday, 0=same day, 1=tomorrow)',
        formulaRef: 'dayOffset',
        precision: 0,
      },
    ],
    guide: {
      whatIsIt:
        'The Time Zone Converter translates a local time to another time zone using UTC (Coordinated Universal Time) offsets. UTC is the international standard from which all world time zones are calculated — e.g., New York (EST) is UTC-5, London (GMT) is UTC+0, Tokyo (JST) is UTC+9.',
      howToUse:
        'Enter your local hour in 24-hour format (e.g., 9 for 9 AM, 14 for 2 PM). Select your current time zone from the "From" dropdown and the target time zone from the "To" dropdown. The calculator shows the equivalent hour in the target zone, the offset difference, and whether the target is on the same day, yesterday, or tomorrow.',
      exampleScenario:
        'Scheduling a call: you are in New York (EST, UTC-5) at 9:00 AM and need to find the time for a colleague in Tokyo (JST, UTC+9). Offset diff = 9 - (-5) = +14 hours. 9 + 14 = 23, meaning 11 PM same day in Tokyo.',
      proTip:
        'This calculator uses fixed UTC offsets and does not account for Daylight Saving Time (DST). During DST (typically March–November in the US), add 1 hour to US time zones (e.g., EST -5 becomes EDT -4). For recurring international meetings, use a world clock tool like timeanddate.com or schedule via Google Calendar (which handles DST automatically). Choosing a meeting time anchored to UTC (e.g., "15:00 UTC") is unambiguous for all participants worldwide.',
    },
    metadata: { version: '1.0.0' },
  },
];
