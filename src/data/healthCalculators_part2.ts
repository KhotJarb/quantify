import type { CalculatorSchema } from '@/types/calculator';

export const healthCalculatorsPart2: CalculatorSchema[] = [
  // ── 12. Daily Water Intake ───────────────────────────────────────────
  {
    id: 'daily-water-intake',
    slug: 'daily-water-intake',
    title: 'Daily Hydration Requirement',
    description:
      'Estimate daily water intake based on body weight, physical activity, and climate conditions. Based on EFSA (European Food Safety Authority, 2010) recommendations of ~35 mL/kg/day.',
    icon: '🚰',
    category: 'health',
    subcategory: 'nutrition',
    tags: ['water', 'hydration', 'fluid intake', 'efsa', 'daily water'],
    inputs: [
      {
        id: 'weight',
        label: 'Weight',
        type: 'number',
        placeholder: 'e.g. 75',
        units: [
          { label: 'kg', value: 'kg' },
          { label: 'lb', value: 'lb', conversionFactor: '0.453592' },
        ],
      },
      {
        id: 'activityAdj',
        label: 'Activity Level',
        type: 'select',
        options: [
          { label: 'Sedentary', value: '0' },
          { label: 'Moderate Exercise', value: '500' },
          { label: 'Intense Exercise', value: '1000' },
        ],
        defaultValue: '0',
      },
      {
        id: 'climateAdj',
        label: 'Climate',
        type: 'select',
        options: [
          { label: 'Temperate', value: '0' },
          { label: 'Hot / Humid', value: '500' },
        ],
        defaultValue: '0',
      },
    ],
    formulas: [
      { id: 'baseMl', expression: 'weight * 35', dependencies: ['weight'] },
      {
        id: 'totalMl',
        expression: 'baseMl + activityAdj + climateAdj',
        dependencies: ['baseMl', 'activityAdj', 'climateAdj'],
      },
      { id: 'totalLiters', expression: 'totalMl / 1000', dependencies: ['totalMl'] },
      { id: 'cups', expression: 'totalMl / 240', dependencies: ['totalMl'] },
    ],
    outputs: [
      {
        id: 'litersResult',
        label: 'Daily Water Intake',
        formulaRef: 'totalLiters',
        precision: 1,
        suffix: ' L',
        highlight: true,
      },
      {
        id: 'mlResult',
        label: 'In Milliliters',
        formulaRef: 'totalMl',
        precision: 0,
        suffix: ' mL',
      },
      {
        id: 'cupsResult',
        label: 'Approximate Cups',
        formulaRef: 'cups',
        precision: 0,
        suffix: ' cups',
      },
    ],
    guide: {
      whatIsIt: 'Estimates your daily water needs using the EFSA (European Food Safety Authority, 2010) baseline of 35 mL per kilogram of body weight, then adjusts for physical activity and climate. Adequate hydration supports thermoregulation, nutrient transport, and cognitive function.',
      howToUse: 'Enter your body weight, select your typical activity level, and choose your climate. The calculator adds fixed mL bonuses for exercise (500 mL moderate, 1000 mL intense) and hot/humid conditions (500 mL) on top of the 35 mL/kg baseline.',
      exampleScenario: 'A 75 kg person doing moderate exercise in a temperate climate: baseline = 75 × 35 = 2625 mL, plus 500 mL for activity = 3125 mL (≈ 3.1 L or about 13 cups). In hot weather, add another 500 mL for a total of 3625 mL.',
      proTip: 'These are starting estimates — actual needs vary with sweat rate, altitude, and dietary water content. A practical check is urine color: pale straw indicates good hydration, while dark yellow suggests you need more fluids.',
    },
    metadata: { version: '1.0.0' },
  },

  // ── 13. Protein Requirement ──────────────────────────────────────────
  {
    id: 'protein-requirement',
    slug: 'protein-requirement',
    title: 'Daily Protein Requirement',
    description:
      'Calculate optimal daily protein intake based on body weight and activity level, per ISSN position stand (Jäger et al., JISSN, 2017) and WHO/FAO guidelines.',
    icon: '🥩',
    category: 'health',
    subcategory: 'nutrition',
    tags: ['protein', 'daily protein', 'issn', 'muscle', 'nutrition', 'requirement'],
    inputs: [
      {
        id: 'weight',
        label: 'Weight',
        type: 'number',
        placeholder: 'e.g. 75',
        units: [
          { label: 'kg', value: 'kg' },
          { label: 'lb', value: 'lb', conversionFactor: '0.453592' },
        ],
      },
      {
        id: 'proteinFactor',
        label: 'Activity / Goal',
        type: 'select',
        options: [
          { label: 'Sedentary Adult (RDA: 0.8 g/kg)', value: '0.8' },
          { label: 'Recreational Exercise (1.0 g/kg)', value: '1.0' },
          { label: 'Endurance Athlete (1.2–1.4 g/kg)', value: '1.4' },
          { label: 'Strength / Power (1.6 g/kg)', value: '1.6' },
          { label: 'Bodybuilding / Muscle Gain (2.0 g/kg)', value: '2.0' },
          { label: 'Weight Loss + Resistance Training (2.2 g/kg)', value: '2.2' },
        ],
        defaultValue: '0.8',
      },
    ],
    formulas: [
      {
        id: 'dailyProtein',
        expression: 'weight * proteinFactor',
        dependencies: ['weight', 'proteinFactor'],
      },
      {
        id: 'proteinCalories',
        expression: 'dailyProtein * 4',
        dependencies: ['dailyProtein'],
      },
      { id: 'perMeal3', expression: 'dailyProtein / 3', dependencies: ['dailyProtein'] },
      { id: 'perMeal4', expression: 'dailyProtein / 4', dependencies: ['dailyProtein'] },
    ],
    outputs: [
      {
        id: 'dailyResult',
        label: 'Daily Protein',
        formulaRef: 'dailyProtein',
        precision: 0,
        suffix: ' g',
        highlight: true,
      },
      {
        id: 'caloriesResult',
        label: 'Protein Calories',
        formulaRef: 'proteinCalories',
        precision: 0,
        suffix: ' kcal',
      },
      {
        id: 'perMeal3Result',
        label: 'Per Meal (3 meals)',
        formulaRef: 'perMeal3',
        precision: 0,
        suffix: ' g',
      },
      {
        id: 'perMeal4Result',
        label: 'Per Meal (4 meals)',
        formulaRef: 'perMeal4',
        precision: 0,
        suffix: ' g',
      },
    ],
    guide: {
      whatIsIt: 'Calculates your optimal daily protein intake based on body weight and activity level, following the ISSN position stand (Jäger et al., 2017) and WHO/FAO guidelines. Protein needs range from the RDA of 0.8 g/kg for sedentary adults up to 2.2 g/kg for athletes in a caloric deficit preserving lean mass.',
      howToUse: 'Enter your body weight and select the activity level or goal that best describes you. The calculator multiplies weight by the corresponding protein factor and also shows calories from protein (4 kcal/g) and per-meal targets for 3- or 4-meal plans.',
      exampleScenario: 'An 80 kg strength athlete selecting 1.6 g/kg needs 80 × 1.6 = 128 g protein/day (512 kcal from protein). Split across 4 meals, that is 32 g per meal — roughly a chicken breast or 4 eggs plus Greek yogurt per sitting.',
      proTip: 'Distribute protein evenly across meals (0.4 g/kg per meal) to maximize muscle protein synthesis. The leucine threshold of ~2.5 g per meal is key — whey protein, eggs, and meat easily hit this; plant sources may need combining.',
    },
    metadata: { version: '1.0.0' },
  },

  // ── 14. Creatine Monohydrate Dosing ──────────────────────────────────
  {
    id: 'creatine-dosing',
    slug: 'creatine-dosing',
    title: 'Creatine Monohydrate Dosing',
    description:
      'Calculate evidence-based creatine loading and maintenance doses based on body weight, per the ISSN position stand (Kreider et al., JISSN, 2017).',
    icon: '💊',
    category: 'health',
    subcategory: 'supplementation',
    tags: ['creatine', 'supplement', 'dosing', 'loading', 'maintenance', 'issn'],
    inputs: [
      {
        id: 'weight',
        label: 'Body Weight',
        type: 'number',
        placeholder: 'e.g. 80',
        units: [
          { label: 'kg', value: 'kg' },
          { label: 'lb', value: 'lb', conversionFactor: '0.453592' },
        ],
      },
    ],
    formulas: [
      { id: 'loadingDaily', expression: 'weight * 0.3', dependencies: ['weight'] },
      {
        id: 'loadingPerDose',
        expression: 'loadingDaily / 4',
        dependencies: ['loadingDaily'],
      },
      {
        id: 'maintenanceCalc',
        expression: 'weight * 0.03',
        dependencies: ['weight'],
      },
      {
        id: 'maintenance',
        expression: 'max(maintenanceCalc, 3)',
        dependencies: ['maintenanceCalc'],
      },
    ],
    outputs: [
      {
        id: 'loadingResult',
        label: 'Loading Phase (daily)',
        formulaRef: 'loadingDaily',
        precision: 1,
        suffix: ' g',
        highlight: true,
      },
      {
        id: 'loadingDoseResult',
        label: 'Per Dose (4x/day for 5-7 days)',
        formulaRef: 'loadingPerDose',
        precision: 1,
        suffix: ' g',
      },
      {
        id: 'maintenanceResult',
        label: 'Maintenance Phase (daily)',
        formulaRef: 'maintenance',
        precision: 1,
        suffix: ' g',
        highlight: true,
      },
    ],
    guide: {
      whatIsIt: 'Computes evidence-based creatine monohydrate loading and maintenance doses using the ISSN protocol (Kreider et al., 2017). Loading at 0.3 g/kg/day for 5–7 days rapidly saturates muscle creatine stores, followed by a 3–5 g/day maintenance dose to sustain elevated levels.',
      howToUse: 'Enter your body weight. The calculator provides your total daily loading dose (0.3 g/kg), suggests splitting it into 4 equal doses across the day, and calculates the ongoing maintenance dose (0.03 g/kg, minimum 3 g).',
      exampleScenario: 'An 80 kg individual: loading = 80 × 0.3 = 24 g/day, taken as 6 g four times daily for 5–7 days. Maintenance = max(80 × 0.03, 3) = 3 g/day thereafter. Full saturation is typically achieved by day 5.',
      proTip: 'You can skip the loading phase and take 3–5 g/day from the start — stores will fully saturate in about 3–4 weeks instead. Take creatine with a carbohydrate-containing meal to enhance uptake via insulin-mediated transport.',
    },
    metadata: { version: '1.0.0' },
  },

  // ── 15. Caffeine Safe Daily Limit ────────────────────────────────────
  {
    id: 'caffeine-limit',
    slug: 'caffeine-limit',
    title: 'Caffeine Safe Daily Limit',
    description:
      'Determine the safe daily caffeine limit based on body weight, per EFSA (2015) guidelines: ≤6 mg/kg/day for habitual consumption, ≤400 mg/day general cap, ≤200 mg single dose.',
    icon: '☕',
    category: 'health',
    subcategory: 'supplementation',
    tags: ['caffeine', 'coffee', 'safe limit', 'efsa', 'stimulant'],
    inputs: [
      {
        id: 'weight',
        label: 'Body Weight',
        type: 'number',
        placeholder: 'e.g. 70',
        units: [
          { label: 'kg', value: 'kg' },
          { label: 'lb', value: 'lb', conversionFactor: '0.453592' },
        ],
      },
    ],
    formulas: [
      { id: 'weightBased', expression: 'weight * 6', dependencies: ['weight'] },
      {
        id: 'dailyLimit',
        expression: 'min(weightBased, 400)',
        dependencies: ['weightBased'],
      },
      { id: 'singleDoseCalc', expression: 'weight * 3', dependencies: ['weight'] },
      {
        id: 'singleDose',
        expression: 'min(singleDoseCalc, 200)',
        dependencies: ['singleDoseCalc'],
      },
      {
        id: 'cupsEstimate',
        expression: 'dailyLimit / 95',
        dependencies: ['dailyLimit'],
      },
    ],
    outputs: [
      {
        id: 'dailyResult',
        label: 'Max Daily Caffeine',
        formulaRef: 'dailyLimit',
        precision: 0,
        suffix: ' mg',
        highlight: true,
      },
      {
        id: 'singleResult',
        label: 'Max Single Dose',
        formulaRef: 'singleDose',
        precision: 0,
        suffix: ' mg',
      },
      {
        id: 'cupsResult',
        label: '≈ Cups of Coffee (95 mg each)',
        formulaRef: 'cupsEstimate',
        precision: 1,
        suffix: ' cups',
      },
    ],
    guide: {
      whatIsIt: 'Determines your safe daily caffeine limit based on EFSA (2015) guidelines: a maximum of 6 mg/kg/day for habitual consumption (capped at 400 mg/day for healthy adults) and a single-dose ceiling of 200 mg to avoid acute adverse effects like jitteriness and tachycardia.',
      howToUse: 'Enter your body weight. The calculator computes your weight-based daily limit (6 mg/kg, capped at 400 mg), your safe single-dose maximum (3 mg/kg, capped at 200 mg), and an approximate number of standard coffee cups (~95 mg caffeine each).',
      exampleScenario: 'A 70 kg adult: weight-based limit = 70 × 6 = 420 mg, capped at 400 mg/day (≈ 4.2 cups of coffee). Single dose max = min(70 × 3, 200) = 200 mg. So up to ~4 cups spread across the day, with no more than ~2 cups at once.',
      proTip: 'Caffeine has a half-life of 5–6 hours — avoid it within 8 hours of bedtime for optimal sleep quality. Pregnant women should limit intake to 200 mg/day per EFSA guidance. Tolerance develops with habitual use, but the cardiovascular ceiling remains the same.',
    },
    metadata: { version: '1.0.0' },
  },

  // ── 16. Maximum Heart Rate (Tanaka) ──────────────────────────────────
  {
    id: 'max-heart-rate',
    slug: 'max-heart-rate',
    title: 'Maximum Heart Rate',
    description:
      'Estimate age-predicted maximum heart rate using the Tanaka formula (JACC, 2001) — more accurate than the traditional 220−age method across all ages.',
    icon: '❤️',
    category: 'health',
    subcategory: 'exercise',
    tags: ['heart rate', 'max hr', 'tanaka', 'cardio', 'exercise'],
    inputs: [
      {
        id: 'age',
        label: 'Age',
        type: 'number',
        placeholder: 'e.g. 30',
        min: 10,
        max: 100,
      },
    ],
    formulas: [
      { id: 'tanaka', expression: '208 - 0.7 * age', dependencies: ['age'] },
      { id: 'traditional', expression: '220 - age', dependencies: ['age'] },
      { id: 'zone2Low', expression: 'round(tanaka * 0.6)', dependencies: ['tanaka'] },
      { id: 'zone2High', expression: 'round(tanaka * 0.7)', dependencies: ['tanaka'] },
      { id: 'zone3Low', expression: 'round(tanaka * 0.7)', dependencies: ['tanaka'] },
      { id: 'zone3High', expression: 'round(tanaka * 0.8)', dependencies: ['tanaka'] },
    ],
    outputs: [
      {
        id: 'tanakaResult',
        label: 'HRmax (Tanaka)',
        formulaRef: 'tanaka',
        precision: 0,
        suffix: ' bpm',
        highlight: true,
      },
      {
        id: 'traditionalResult',
        label: 'HRmax (220 − age)',
        formulaRef: 'traditional',
        precision: 0,
        suffix: ' bpm',
      },
      {
        id: 'zone2Result',
        label: 'Zone 2 (Fat Burn, 60-70%)',
        formulaRef: 'zone2Low',
        precision: 0,
        prefix: '',
        suffix: ' bpm',
      },
      {
        id: 'zone3Result',
        label: 'Zone 3 (Aerobic, 70-80%)',
        formulaRef: 'zone3Low',
        precision: 0,
        suffix: ' bpm',
      },
    ],
    guide: {
      whatIsIt: 'Estimates your age-predicted maximum heart rate using the Tanaka formula (208 − 0.7 × age) from a meta-analysis published in JACC (2001). This formula is more accurate than the traditional 220 − age across all age groups, especially in older adults.',
      howToUse: 'Enter your age. The calculator outputs your HRmax via both the Tanaka and traditional formulas, plus Zone 2 (60–70% HRmax, fat burning) and Zone 3 (70–80% HRmax, aerobic conditioning) heart rate ranges.',
      exampleScenario: 'A 40-year-old: Tanaka HRmax = 208 − 0.7 × 40 = 180 bpm (vs. traditional 220 − 40 = 180 bpm). Zone 2 = 108–126 bpm, Zone 3 = 126–144 bpm. At age 60, the formulas diverge more: Tanaka gives 166 bpm vs. traditional 160 bpm.',
      proTip: 'Population formulas have a standard deviation of ±10 bpm. For precise training zones, consider a graded exercise test or a field-based max HR test. Beta-blockers and other medications can significantly lower actual HRmax.',
    },
    metadata: { version: '1.0.0' },
  },

  // ── 17. Target Heart Rate (Karvonen) ─────────────────────────────────
  {
    id: 'target-heart-rate',
    slug: 'target-heart-rate',
    title: 'Target Heart Rate (Karvonen)',
    description:
      'Calculate target training heart rate using the Karvonen Heart Rate Reserve method (Ann Med Exp Biol Fenn, 1957), the gold standard for exercise prescription.',
    icon: '🏃',
    category: 'health',
    subcategory: 'exercise',
    tags: ['karvonen', 'target heart rate', 'hrr', 'exercise', 'training zone'],
    inputs: [
      {
        id: 'age',
        label: 'Age',
        type: 'number',
        placeholder: 'e.g. 30',
        min: 10,
        max: 100,
      },
      {
        id: 'restingHR',
        label: 'Resting Heart Rate',
        type: 'number',
        placeholder: 'e.g. 65',
        min: 30,
        max: 120,
        helpText: 'Measure first thing in the morning',
      },
      {
        id: 'intensity',
        label: 'Target Intensity',
        type: 'range',
        min: 50,
        max: 100,
        step: 1,
        defaultValue: 70,
        helpText: 'Typical fat burn: 60-70%, aerobic: 70-80%',
      },
    ],
    formulas: [
      { id: 'hrMax', expression: '208 - 0.7 * age', dependencies: ['age'] },
      {
        id: 'hrr',
        expression: 'hrMax - restingHR',
        dependencies: ['hrMax', 'restingHR'],
      },
      {
        id: 'thr',
        expression: 'round(hrr * intensity / 100 + restingHR)',
        dependencies: ['hrr', 'intensity', 'restingHR'],
      },
    ],
    outputs: [
      {
        id: 'hrMaxResult',
        label: 'Estimated HRmax',
        formulaRef: 'hrMax',
        precision: 0,
        suffix: ' bpm',
      },
      {
        id: 'hrrResult',
        label: 'Heart Rate Reserve',
        formulaRef: 'hrr',
        precision: 0,
        suffix: ' bpm',
      },
      {
        id: 'thrResult',
        label: 'Target Heart Rate',
        formulaRef: 'thr',
        precision: 0,
        suffix: ' bpm',
        highlight: true,
      },
    ],
    guide: {
      whatIsIt: 'Calculates your target training heart rate using the Karvonen Heart Rate Reserve (HRR) method, the gold standard for exercise prescription. Unlike simple percentage-of-HRmax methods, Karvonen accounts for your resting heart rate, giving a more individualized and accurate training intensity.',
      howToUse: 'Enter your age, resting heart rate (measured first thing in the morning), and desired training intensity percentage. The calculator derives HRmax (Tanaka formula), subtracts resting HR to get HRR, then applies your intensity percentage.',
      exampleScenario: 'A 30-year-old with a resting HR of 60 bpm at 70% intensity: HRmax = 208 − 0.7 × 30 = 187 bpm, HRR = 187 − 60 = 127 bpm, THR = 127 × 0.70 + 60 = 149 bpm. This accounts for their fitness level — a fitter person with lower resting HR gets a higher target.',
      proTip: 'Measure resting HR over 3–5 mornings and average the values for accuracy. As your cardiovascular fitness improves, your resting HR drops, automatically shifting your Karvonen training zones upward — recalculate every 4–6 weeks.',
    },
    metadata: { version: '1.0.0' },
  },

  // ── 18. VO2 Max (Cooper 12-Minute Run) ───────────────────────────────
  {
    id: 'vo2-max-cooper',
    slug: 'vo2-max-cooper',
    title: 'VO2 Max (Cooper Test)',
    description:
      'Estimate maximal oxygen uptake from the Cooper 12-minute run test (JAMA, 1968). Run as far as possible in 12 minutes and enter the distance.',
    icon: '🫁',
    category: 'health',
    subcategory: 'exercise',
    tags: ['vo2 max', 'cooper test', 'cardio fitness', 'aerobic capacity', 'running'],
    inputs: [
      {
        id: 'distance',
        label: 'Distance Covered in 12 min',
        type: 'number',
        placeholder: 'e.g. 2400',
        helpText: 'Total distance run in meters',
        units: [
          { label: 'm', value: 'm' },
          { label: 'km', value: 'km', conversionFactor: '1000' },
          { label: 'mi', value: 'mi', conversionFactor: '1609.344' },
        ],
      },
    ],
    formulas: [
      {
        id: 'vo2max',
        expression: '(distance - 504.9) / 44.73',
        dependencies: ['distance'],
      },
    ],
    outputs: [
      {
        id: 'vo2maxResult',
        label: 'Estimated VO₂ Max',
        formulaRef: 'vo2max',
        precision: 1,
        suffix: ' mL/kg/min',
        highlight: true,
      },
    ],
    guide: {
      whatIsIt: 'Estimates your maximal oxygen uptake (VO₂ max) from the Cooper 12-minute run test, first published in JAMA (1968). VO₂ max is the single best measure of cardiorespiratory fitness and a strong predictor of all-cause mortality.',
      howToUse: 'Run as far as you can in exactly 12 minutes on a flat surface, then enter the total distance covered. The calculator applies the Cooper formula: VO₂ max = (distance in meters − 504.9) / 44.73.',
      exampleScenario: 'A runner covering 2400 m in 12 minutes: VO₂ max = (2400 − 504.9) / 44.73 ≈ 42.4 mL/kg/min. This places an average 30-year-old male in the "fair" fitness category. Elite runners typically exceed 3000 m (≈ 55.8 mL/kg/min).',
      proTip: 'Warm up for 5–10 minutes before testing, and run on a measured track for accuracy. Retest under similar conditions (weather, time of day, surface) to track progress. VO₂ max improves 15–20% with structured endurance training over 8–12 weeks.',
    },
    metadata: { version: '1.0.0' },
  },

  // ── 19. Mean Arterial Pressure (MAP) ─────────────────────────────────
  {
    id: 'mean-arterial-pressure',
    slug: 'mean-arterial-pressure',
    title: 'Mean Arterial Pressure (MAP)',
    description:
      'Calculate mean arterial pressure from systolic and diastolic blood pressure readings. MAP approximates perfusion pressure to vital organs. Normal range: 70–105 mmHg.',
    icon: '🩺',
    category: 'health',
    subcategory: 'cardiovascular',
    tags: ['map', 'blood pressure', 'arterial pressure', 'hemodynamics', 'perfusion'],
    inputs: [
      {
        id: 'systolic',
        label: 'Systolic BP',
        type: 'number',
        placeholder: 'e.g. 120',
        min: 60,
        max: 300,
        helpText: 'Top number (mmHg)',
      },
      {
        id: 'diastolic',
        label: 'Diastolic BP',
        type: 'number',
        placeholder: 'e.g. 80',
        min: 30,
        max: 200,
        helpText: 'Bottom number (mmHg)',
      },
    ],
    formulas: [
      {
        id: 'map',
        expression: 'diastolic + (systolic - diastolic) / 3',
        dependencies: ['systolic', 'diastolic'],
      },
      {
        id: 'pulseP',
        expression: 'systolic - diastolic',
        dependencies: ['systolic', 'diastolic'],
      },
    ],
    outputs: [
      {
        id: 'mapResult',
        label: 'Mean Arterial Pressure',
        formulaRef: 'map',
        precision: 1,
        suffix: ' mmHg',
        highlight: true,
      },
      {
        id: 'pulsePResult',
        label: 'Pulse Pressure',
        formulaRef: 'pulseP',
        precision: 0,
        suffix: ' mmHg',
      },
    ],
    guide: {
      whatIsIt: 'Calculates Mean Arterial Pressure using the standard formula: MAP = DBP + ⅓(SBP − DBP). MAP represents the average arterial pressure during a single cardiac cycle and is the primary determinant of organ perfusion. Normal MAP is 70–105 mmHg; below 60 mmHg risks end-organ ischemia.',
      howToUse: 'Enter your systolic (top number) and diastolic (bottom number) blood pressure readings in mmHg. The calculator outputs MAP and pulse pressure (SBP − DBP).',
      exampleScenario: 'A reading of 120/80 mmHg: MAP = 80 + (120 − 80)/3 = 93.3 mmHg (normal). Pulse pressure = 40 mmHg (normal is 30–50). A MAP of 65 mmHg in a critically ill patient would signal inadequate perfusion requiring intervention.',
      proTip: 'MAP is more clinically meaningful than systolic or diastolic BP alone for assessing organ perfusion. In ICU settings, vasopressors are titrated to maintain MAP ≥ 65 mmHg. A widened pulse pressure (> 60 mmHg) may indicate aortic regurgitation or arterial stiffness.',
    },
    metadata: { version: '1.0.0' },
  },

  // ── 20. Corrected QT Interval (Bazett) ──────────────────────────────
  {
    id: 'corrected-qt-interval',
    slug: 'corrected-qt-interval',
    title: 'Corrected QT Interval (QTc)',
    description:
      'Calculate the rate-corrected QT interval using Bazett\'s formula (Heart, 1920). Used in cardiology to screen for long QT syndrome. Normal QTc: < 450 ms (male), < 460 ms (female).',
    icon: '🫀',
    category: 'health',
    subcategory: 'cardiovascular',
    tags: ['qtc', 'bazett', 'ecg', 'ekg', 'long qt', 'cardiology', 'arrhythmia'],
    inputs: [
      {
        id: 'qt',
        label: 'QT Interval',
        type: 'number',
        placeholder: 'e.g. 400',
        helpText: 'Measured QT interval in milliseconds',
      },
      {
        id: 'heartRate',
        label: 'Heart Rate',
        type: 'number',
        placeholder: 'e.g. 72',
        min: 30,
        max: 200,
        helpText: 'Resting heart rate in bpm',
      },
    ],
    formulas: [
      {
        id: 'rrInterval',
        expression: '60 / heartRate',
        dependencies: ['heartRate'],
      },
      {
        id: 'qtc',
        expression: 'qt / sqrt(rrInterval)',
        dependencies: ['qt', 'rrInterval'],
      },
    ],
    outputs: [
      {
        id: 'qtcResult',
        label: 'Corrected QT (QTc)',
        formulaRef: 'qtc',
        precision: 0,
        suffix: ' ms',
        highlight: true,
      },
      {
        id: 'rrResult',
        label: 'RR Interval',
        formulaRef: 'rrInterval',
        precision: 3,
        suffix: ' sec',
      },
    ],
    guide: {
      whatIsIt: 'Calculates the rate-corrected QT interval using Bazett\'s formula: QTc = QT / √(RR interval). Published in Heart (1920), this correction normalizes the QT interval for heart rate, enabling screening for long QT syndrome — a condition predisposing to potentially fatal arrhythmias (Torsades de Pointes).',
      howToUse: 'Enter the measured QT interval (in milliseconds from the ECG) and the resting heart rate (in bpm). The calculator converts heart rate to the RR interval in seconds (60/HR) and applies Bazett\'s correction.',
      exampleScenario: 'QT = 400 ms at a heart rate of 75 bpm: RR = 60/75 = 0.800 sec, QTc = 400 / √0.800 = 447 ms. For a male patient, this is borderline (normal < 450 ms). At a heart rate of 60 bpm, the same QT gives QTc = 400 ms (normal).',
      proTip: 'Bazett\'s formula overcorrects at high heart rates (> 100 bpm) and undercorrects at low rates (< 60 bpm). For tachycardic patients, consider Fridericia\'s correction (QT / ∛RR). Always review QTc in context of QT-prolonging medications (antiarrhythmics, certain antibiotics, antipsychotics).',
    },
    metadata: { version: '1.0.0' },
  },

  // ── 21. Creatinine Clearance (Cockcroft-Gault) ──────────────────────
  {
    id: 'creatinine-clearance',
    slug: 'creatinine-clearance',
    title: 'Creatinine Clearance (Cockcroft-Gault)',
    description:
      'Estimate creatinine clearance using the Cockcroft-Gault equation (Nephron, 1976), the standard for renal function assessment and drug dose adjustment.',
    icon: '🧪',
    category: 'health',
    subcategory: 'clinical',
    tags: [
      'creatinine clearance',
      'cockcroft gault',
      'renal function',
      'gfr',
      'kidney',
      'nephrology',
    ],
    inputs: [
      {
        id: 'age',
        label: 'Age',
        type: 'number',
        placeholder: 'e.g. 55',
        min: 18,
        max: 120,
      },
      {
        id: 'weight',
        label: 'Weight',
        type: 'number',
        placeholder: 'e.g. 70',
        units: [
          { label: 'kg', value: 'kg' },
          { label: 'lb', value: 'lb', conversionFactor: '0.453592' },
        ],
      },
      {
        id: 'creatinine',
        label: 'Serum Creatinine',
        type: 'number',
        placeholder: 'e.g. 1.1',
        step: 0.01,
        helpText: 'In mg/dL',
      },
      {
        id: 'sex',
        label: 'Biological Sex',
        type: 'select',
        options: [
          { label: 'Male', value: '0' },
          { label: 'Female', value: '1' },
        ],
        defaultValue: '0',
      },
    ],
    formulas: [
      {
        id: 'baseCrcl',
        expression: '((140 - age) * weight) / (72 * creatinine)',
        dependencies: ['age', 'weight', 'creatinine'],
      },
      {
        id: 'crcl',
        expression: 'sex == 0 ? baseCrcl : baseCrcl * 0.85',
        dependencies: ['baseCrcl', 'sex'],
      },
    ],
    outputs: [
      {
        id: 'crclResult',
        label: 'Creatinine Clearance',
        formulaRef: 'crcl',
        precision: 1,
        suffix: ' mL/min',
        highlight: true,
      },
    ],
    guide: {
      whatIsIt: 'Estimates creatinine clearance (CrCl) using the Cockcroft-Gault equation (Nephron, 1976), the most widely used formula for renal function assessment and drug dose adjustment. CrCl approximates glomerular filtration rate and is the basis for most pharmacokinetic dosing guidelines.',
      howToUse: 'Enter age, body weight, serum creatinine level (mg/dL), and biological sex. The formula is: CrCl = [(140 − age) × weight] / (72 × serum creatinine), multiplied by 0.85 for females due to lower average muscle mass.',
      exampleScenario: 'A 55-year-old male, 70 kg, serum creatinine 1.2 mg/dL: CrCl = (140 − 55) × 70 / (72 × 1.2) = 68.9 mL/min, indicating mildly reduced function (normal > 90). Many drugs like vancomycin, enoxaparin, and DOACs require dose reduction below 50 mL/min.',
      proTip: 'Use actual body weight for most patients, but for obese patients (BMI > 30), consider adjusted body weight to avoid overestimation. Cockcroft-Gault is not validated for unstable renal function — in acute kidney injury, trending serum creatinine is more informative than a single CrCl estimate.',
    },
    metadata: { version: '1.0.0' },
  },

  // ── 22. Anion Gap ────────────────────────────────────────────────────
  {
    id: 'anion-gap',
    slug: 'anion-gap',
    title: 'Anion Gap',
    description:
      'Calculate the serum anion gap from basic metabolic panel values. Used to differentiate causes of metabolic acidosis. Normal range: 8–12 mEq/L (without K⁺ correction).',
    icon: '⚗️',
    category: 'health',
    subcategory: 'clinical',
    tags: [
      'anion gap',
      'metabolic acidosis',
      'electrolytes',
      'sodium',
      'chloride',
      'bicarbonate',
    ],
    inputs: [
      {
        id: 'sodium',
        label: 'Sodium (Na⁺)',
        type: 'number',
        placeholder: 'e.g. 140',
        helpText: 'mEq/L',
      },
      {
        id: 'chloride',
        label: 'Chloride (Cl⁻)',
        type: 'number',
        placeholder: 'e.g. 102',
        helpText: 'mEq/L',
      },
      {
        id: 'bicarbonate',
        label: 'Bicarbonate (HCO₃⁻)',
        type: 'number',
        placeholder: 'e.g. 24',
        helpText: 'mEq/L',
      },
    ],
    formulas: [
      {
        id: 'anionGap',
        expression: 'sodium - (chloride + bicarbonate)',
        dependencies: ['sodium', 'chloride', 'bicarbonate'],
      },
    ],
    outputs: [
      {
        id: 'agResult',
        label: 'Anion Gap',
        formulaRef: 'anionGap',
        precision: 1,
        suffix: ' mEq/L',
        highlight: true,
      },
    ],
    guide: {
      whatIsIt: 'Calculates the serum anion gap from basic metabolic panel values using the formula: AG = Na⁺ − (Cl⁻ + HCO₃⁻). The anion gap quantifies unmeasured anions in blood and is the primary tool for classifying metabolic acidosis. Normal range is 8–12 mEq/L (without potassium).',
      howToUse: 'Enter sodium (Na⁺), chloride (Cl⁻), and bicarbonate (HCO₃⁻) values from your basic metabolic panel, all in mEq/L. The calculator subtracts the sum of measured anions from sodium to reveal the gap occupied by unmeasured anions.',
      exampleScenario: 'Na⁺ = 140, Cl⁻ = 102, HCO₃⁻ = 24: AG = 140 − (102 + 24) = 14 mEq/L (slightly elevated). In diabetic ketoacidosis, you might see Na⁺ = 138, Cl⁻ = 98, HCO₃⁻ = 12: AG = 28 mEq/L — a markedly elevated gap indicating accumulation of ketoacids.',
      proTip: 'Remember MUDPILES for elevated anion gap causes: Methanol, Uremia, Diabetic ketoacidosis, Propylene glycol, Isoniazid/Iron, Lactic acidosis, Ethylene glycol, Salicylates. Always correct for albumin: for every 1 g/dL drop in albumin below 4, add 2.5 to the expected anion gap.',
    },
    metadata: { version: '1.0.0' },
  },
];
