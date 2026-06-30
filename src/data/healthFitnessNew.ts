import type { CalculatorSchema } from '@/types/calculator';
export const healthFitnessNew: CalculatorSchema[] = [

  // ============================================================================
  // 1. Pregnancy Due Date Calculator
  //    Uses Naegele's Rule: EDD = LMP + 280 days (adjusted for cycle length)
  // ============================================================================
  {
    id: 'pregnancy-due-date',
    slug: 'pregnancy-due-date',
    title: 'Pregnancy Due Date Calculator',
    description:
      "Calculate estimated due date and current gestational age using Naegele's Rule (LMP + 280 days) or ultrasound dating.",
    icon: '🤰',
    category: 'health',
    subcategory: 'reproductive',
    tags: ['pregnancy', 'due date', 'lmp', 'naegele', 'gestational age'],
    inputs: [
      {
        id: 'lmpYear',
        label: 'LMP Year',
        type: 'number',
        placeholder: 'e.g. 2025',
        defaultValue: 2025,
        required: true,
      },
      {
        id: 'lmpMonth',
        label: 'LMP Month',
        type: 'select',
        defaultValue: '1',
        options: [
          { label: 'January',   value: '1'  },
          { label: 'February',  value: '2'  },
          { label: 'March',     value: '3'  },
          { label: 'April',     value: '4'  },
          { label: 'May',       value: '5'  },
          { label: 'June',      value: '6'  },
          { label: 'July',      value: '7'  },
          { label: 'August',    value: '8'  },
          { label: 'September', value: '9'  },
          { label: 'October',   value: '10' },
          { label: 'November',  value: '11' },
          { label: 'December',  value: '12' },
        ],
        required: true,
      },
      {
        id: 'lmpDay',
        label: 'LMP Day (1-31)',
        type: 'number',
        min: 1,
        max: 31,
        defaultValue: 1,
        required: true,
      },
      {
        id: 'cycleLength',
        label: 'Cycle Length (days)',
        type: 'number',
        min: 20,
        max: 45,
        defaultValue: 28,
        helpText: 'Typical cycle is 21-35 days; 28 is the clinical average',
        required: true,
      },
    ],
    formulas: [
      {
        // Naegele's Rule adjusted for non-28-day cycles
        id: 'gestationalDays',
        expression: '(cycleLength - 28) + 280',
        dependencies: ['cycleLength'],
      },
      {
        // Running total of days from LMP start (for reference)
        id: 'dueDateDayOfYear',
        expression: 'lmpDay + gestationalDays',
        dependencies: ['lmpDay', 'gestationalDays'],
      },
      {
        // Complete weeks of pregnancy
        id: 'weeksPregnant',
        expression: 'floor(gestationalDays / 7)',
        dependencies: ['gestationalDays'],
      },
      {
        // Extra days beyond complete weeks
        id: 'daysRemaining',
        expression: 'gestationalDays - weeksPregnant * 7',
        dependencies: ['gestationalDays', 'weeksPregnant'],
      },
      {
        // Trimester: 1 = <13w, 2 = 13-26w, 3 = 27w+
        id: 'trimester',
        expression: 'weeksPregnant < 13 ? 1 : (weeksPregnant < 27 ? 2 : 3)',
        dependencies: ['weeksPregnant'],
      },
    ],
    outputs: [
      {
        id: 'gestationalWeeks',
        label: 'Gestational Age (weeks)',
        formulaRef: 'weeksPregnant',
        precision: 0,
        suffix: ' weeks',
        highlight: true,
      },
      {
        id: 'trimesterResult',
        label: 'Current Trimester',
        formulaRef: 'trimester',
        precision: 0,
        suffix: '',
      },
      {
        id: 'gestDaysOut',
        label: 'Total Gestation Period',
        formulaRef: 'gestationalDays',
        precision: 0,
        suffix: ' days',
      },
    ],
    guide: {
      whatIsIt:
        "The Pregnancy Due Date Calculator estimates your Expected Due Date (EDD) and current gestational age using Naegele's Rule — the standard clinical method. LMP stands for Last Menstrual Period, and the rule adds 280 days (40 weeks) to that date, adjusted for your personal cycle length. Pregnancy is divided into three trimesters: First (weeks 1-12), Second (weeks 13-26), and Third (weeks 27-40).",
      howToUse:
        '1. Enter the year, month, and day of your Last Menstrual Period (LMP) — the first day of your last period.\n2. Enter your average menstrual cycle length (most women are 28 days; range 20-45 days).\n3. The calculator shows your gestational age in weeks and which trimester you are in.\n4. For the most accurate EDD, always confirm with an ultrasound — particularly a dating scan at 8-12 weeks.',
      exampleScenario:
        "LMP: January 1, 2025. Cycle: 28 days. Naegele's Rule gives EDD approximately October 8, 2025 (280 days later). At 10 weeks gestation, the calculator shows Trimester 1. If cycle were 35 days, the adjusted gestation becomes 287 days.",
      proTip:
        'Ultrasound dating in the first trimester is more accurate than LMP-based calculations, especially if your cycles are irregular. The plus/minus 2-week margin is clinically accepted. Always discuss your EDD with your midwife or OB — it can change as the pregnancy progresses.',
    },
    metadata: { version: '1.0.0' },
  },

  // ============================================================================
  // 2. Ovulation Calculator
  //    Fertile window = ovulation day -5 to +1 day
  // ============================================================================
  {
    id: 'ovulation-calculator',
    slug: 'ovulation-calculator',
    title: 'Ovulation Calculator',
    description:
      'Estimate your fertile window and ovulation day based on your last menstrual period and cycle length.',
    icon: '🌸',
    category: 'health',
    subcategory: 'reproductive',
    tags: ['ovulation', 'fertile window', 'menstrual cycle', 'conception', 'fertility'],
    inputs: [
      {
        id: 'cycleLength',
        label: 'Average Cycle Length (days)',
        type: 'number',
        min: 20,
        max: 45,
        defaultValue: 28,
        required: true,
      },
      {
        id: 'lmpDay',
        label: 'LMP Day of Month',
        type: 'number',
        min: 1,
        max: 31,
        defaultValue: 1,
        helpText: 'The calendar day your last period began (e.g. 1 = 1st of the month)',
        required: true,
      },
    ],
    formulas: [
      {
        // Ovulation typically occurs 14 days before next period
        id: 'ovulationDay',
        expression: 'lmpDay + cycleLength - 14',
        dependencies: ['lmpDay', 'cycleLength'],
      },
      {
        // Fertile window opens 5 days before ovulation (sperm viability)
        id: 'fertileStart',
        expression: 'ovulationDay - 5',
        dependencies: ['ovulationDay'],
      },
      {
        // Fertile window closes ~24h after ovulation
        id: 'fertileEnd',
        expression: 'ovulationDay + 1',
        dependencies: ['ovulationDay'],
      },
      {
        // Approximate start of next period
        id: 'nextPeriod',
        expression: 'lmpDay + cycleLength',
        dependencies: ['lmpDay', 'cycleLength'],
      },
    ],
    outputs: [
      {
        id: 'ovulationOut',
        label: 'Estimated Ovulation Day',
        formulaRef: 'ovulationDay',
        precision: 0,
        suffix: ' (day of month)',
        highlight: true,
      },
      {
        id: 'fertileStartOut',
        label: 'Fertile Window Start',
        formulaRef: 'fertileStart',
        precision: 0,
        suffix: ' (day of month)',
      },
      {
        id: 'fertileEndOut',
        label: 'Fertile Window End',
        formulaRef: 'fertileEnd',
        precision: 0,
        suffix: ' (day of month)',
      },
      {
        id: 'nextPeriodOut',
        label: 'Next Period Starts (approx)',
        formulaRef: 'nextPeriod',
        precision: 0,
        suffix: ' (day of month)',
      },
    ],
    guide: {
      whatIsIt:
        'Ovulation is the release of a mature egg from the ovary. It typically occurs 14 days before your next expected period. The fertile window — the days you can conceive — spans the 5 days before ovulation (because sperm can survive up to 5 days in the female reproductive tract) through approximately 24 hours after ovulation (the lifespan of a released egg).',
      howToUse:
        '1. Enter your average cycle length (count from day 1 of one period to day 1 of the next).\n2. Enter the calendar day of the month your last period began.\n3. The calculator shows your estimated ovulation day and fertile window for this cycle.\n4. For higher precision, track basal body temperature (BBT) or use LH ovulation predictor kits (OPKs).',
      exampleScenario:
        'LMP started on the 5th of the month, cycle is 30 days. Ovulation = 5 + 30 - 14 = day 21. Fertile window: days 16-22. Next period expected around day 35 (i.e. the 5th of the following month).',
      proTip:
        'Ovulation timing varies even in regular cycles. Stress, illness, travel, and intense exercise can shift ovulation by several days. If you are trying to conceive (or avoid pregnancy), combine calendar tracking with BBT charting and OPKs for the most reliable prediction.',
    },
    metadata: { version: '1.0.0' },
  },

  // ============================================================================
  // 3. One Rep Max (1RM) Calculator
  //    Epley, Brzycki, and Lombardi formulas averaged
  // ============================================================================
  {
    id: 'one-rep-max',
    slug: 'one-rep-max',
    title: 'One Rep Max (1RM) Calculator',
    description:
      'Estimate your one-repetition maximum using the Epley, Brzycki, and Lombardi formulas from a submaximal lift.',
    icon: '🏋️',
    category: 'health',
    subcategory: 'fitness',
    tags: ['1rm', 'one rep max', 'strength', 'lifting', 'epley', 'brzycki'],
    inputs: [
      {
        id: 'weight',
        label: 'Weight Lifted',
        type: 'number',
        placeholder: 'e.g. 100',
        units: [
          { label: 'kg', value: 'kg' },
          { label: 'lb', value: 'lb', conversionFactor: '0.453592' },
        ],
        required: true,
      },
      {
        id: 'reps',
        label: 'Reps Completed',
        type: 'number',
        min: 1,
        max: 36,
        defaultValue: 5,
        helpText: 'Between 1-36 reps; most accurate at 2-10 reps',
        required: true,
      },
    ],
    formulas: [
      {
        // Epley (1985): most widely used formula
        id: 'epley',
        expression: 'reps == 1 ? weight : weight * (1 + reps / 30)',
        dependencies: ['weight', 'reps'],
      },
      {
        // Brzycki (1993): slightly more conservative
        id: 'brzycki',
        expression: 'reps == 1 ? weight : weight * 36 / (37 - reps)',
        dependencies: ['weight', 'reps'],
      },
      {
        // Lombardi (1989): power-based formula
        id: 'lombardi',
        expression: 'weight * pow(reps, 0.10)',
        dependencies: ['weight', 'reps'],
      },
      {
        // Average of all three formulas for a balanced estimate
        id: 'average1rm',
        expression: '(epley + brzycki + lombardi) / 3',
        dependencies: ['epley', 'brzycki', 'lombardi'],
      },
      {
        id: 'pct90',
        expression: 'average1rm * 0.9',
        dependencies: ['average1rm'],
      },
      {
        id: 'pct80',
        expression: 'average1rm * 0.8',
        dependencies: ['average1rm'],
      },
      {
        id: 'pct70',
        expression: 'average1rm * 0.7',
        dependencies: ['average1rm'],
      },
    ],
    outputs: [
      {
        id: 'averageResult',
        label: 'Estimated 1RM (Average)',
        formulaRef: 'average1rm',
        precision: 1,
        highlight: true,
      },
      {
        id: 'epleyResult',
        label: 'Epley Formula',
        formulaRef: 'epley',
        precision: 1,
      },
      {
        id: 'brzyckiResult',
        label: 'Brzycki Formula',
        formulaRef: 'brzycki',
        precision: 1,
      },
      {
        id: 'lombardiResult',
        label: 'Lombardi Formula',
        formulaRef: 'lombardi',
        precision: 1,
      },
      {
        id: 'pct90Result',
        label: '90% Training Weight',
        formulaRef: 'pct90',
        precision: 1,
        suffix: ' (heavy/strength)',
      },
      {
        id: 'pct80Result',
        label: '80% Training Weight',
        formulaRef: 'pct80',
        precision: 1,
        suffix: ' (hypertrophy)',
      },
      {
        id: 'pct70Result',
        label: '70% Training Weight',
        formulaRef: 'pct70',
        precision: 1,
        suffix: ' (moderate)',
      },
    ],
    guide: {
      whatIsIt:
        'Your One-Rep Max (1RM) is the maximum weight you can lift for a single repetition with correct form. It is the gold standard for measuring absolute strength. Rather than maxing out (which carries injury risk), these formulas let you estimate your 1RM from a submaximal effort (e.g. 5 reps at 80 kg).',
      howToUse:
        '1. Select your weight unit (kg or lb).\n2. Enter the weight you lifted.\n3. Enter the number of complete reps you performed at that weight.\n4. The calculator displays estimates from three established formulas, plus an average, and useful training percentages.',
      exampleScenario:
        'Lifted 80 kg for 8 reps. Epley: 80 x (1 + 8/30) = 101.3 kg. Brzycki: 80 x 36/(37-8) = 99.3 kg. Lombardi: 80 x 8^0.10 = 91.4 kg. Average = 97.3 kg. At 80% (77.9 kg) you would target 8-12 rep sets for hypertrophy.',
      proTip:
        'The Epley formula tends to overestimate at high rep counts (>10), while Brzycki is more accurate for lower reps (3-6). For the most precise 1RM, test it directly on a day you are fresh and well-warmed-up. Always train with a spotter when attempting heavy singles.',
    },
    metadata: { version: '1.0.0' },
  },

  // ============================================================================
  // 4. Blood Alcohol Concentration (BAC) Calculator
  //    Widmark formula with metabolic elimination rate
  // ============================================================================
  {
    id: 'bac-calculator',
    slug: 'bac-calculator',
    title: 'Blood Alcohol Concentration (BAC) Calculator',
    description:
      'Estimate blood alcohol concentration using the Widmark formula. For educational purposes only — never drive if you have been drinking.',
    icon: '🍺',
    category: 'health',
    subcategory: 'clinical',
    tags: ['bac', 'blood alcohol', 'widmark', 'drinking', 'drunk driving'],
    inputs: [
      {
        id: 'drinks',
        label: 'Standard Drinks Consumed',
        type: 'number',
        min: 0,
        max: 30,
        defaultValue: 2,
        helpText: '1 standard drink = 14 g pure alcohol (12 oz beer, 5 oz wine, 1.5 oz spirits)',
        required: true,
      },
      {
        id: 'weight',
        label: 'Body Weight',
        type: 'number',
        placeholder: 'e.g. 70',
        units: [
          { label: 'kg', value: 'kg' },
          { label: 'lb', value: 'lb', conversionFactor: '0.453592' },
        ],
        required: true,
      },
      {
        id: 'sex',
        label: 'Biological Sex',
        type: 'select',
        defaultValue: '0.68',
        options: [
          { label: 'Male',   value: '0.68' },
          { label: 'Female', value: '0.55' },
        ],
        helpText: 'Widmark r-factor: male = 0.68, female = 0.55 (body water distribution)',
        required: true,
      },
      {
        id: 'hours',
        label: 'Hours Since First Drink',
        type: 'number',
        min: 0,
        max: 24,
        defaultValue: 1,
        step: 0.5,
        required: true,
      },
    ],
    formulas: [
      {
        // Total pure alcohol consumed in grams
        id: 'alcoholGrams',
        expression: 'drinks * 14',
        dependencies: ['drinks'],
      },
      {
        // Widmark formula: BAC (g/dL) = A / (W x r)
        // A = alcohol grams, W = body weight (kg), r = Widmark factor
        id: 'rawBAC',
        expression: 'alcoholGrams / (weight * sex)',
        dependencies: ['alcoholGrams', 'weight', 'sex'],
      },
      {
        // Subtract metabolic elimination: ~0.015 g/dL per hour
        id: 'bac',
        expression: 'max(0, rawBAC - 0.015 * hours)',
        dependencies: ['rawBAC', 'hours'],
      },
      {
        // Hours until BAC reaches ~0.00 g/dL
        id: 'soberHours',
        expression: 'bac / 0.015',
        dependencies: ['bac'],
      },
    ],
    outputs: [
      {
        id: 'bacResult',
        label: 'Estimated BAC',
        formulaRef: 'bac',
        precision: 3,
        suffix: ' g/dL',
        highlight: true,
      },
      {
        id: 'soberResult',
        label: 'Hours Until Sober (~0.00)',
        formulaRef: 'soberHours',
        precision: 1,
        suffix: ' hours',
      },
    ],
    guide: {
      whatIsIt:
        'Blood Alcohol Concentration (BAC) measures the mass of alcohol per decilitre of blood (g/dL). This calculator uses the Widmark Formula, developed by Erik Widmark in the 1930s and still used in forensic toxicology. The body eliminates alcohol at approximately 0.015 g/dL per hour regardless of food, coffee, or exercise.',
      howToUse:
        '1. Enter the number of standard drinks consumed (1 standard drink = 14 g pure alcohol in the US).\n2. Enter your body weight and select your biological sex (affects body water distribution).\n3. Enter how many hours have passed since your first drink.\n4. The result shows your estimated current BAC and hours remaining until sober.\n\nThis is for educational purposes only. BAC varies significantly between individuals.',
      exampleScenario:
        'A 70 kg male who consumed 3 standard drinks over 2 hours: Alcohol = 42 g. Raw BAC = 42 / (70 x 0.68) = 0.088 g/dL. After 2 hours of elimination (0.030): BAC = 0.058 g/dL — below the 0.08 US legal limit, but still impaired.',
      proTip:
        'The legal limit for driving in most US states is 0.08 g/dL. In many European countries it is 0.05 g/dL. Even at 0.02 g/dL, reaction time and judgment are measurably impaired. Food slows alcohol absorption but does NOT lower peak BAC — it only delays it. There is no safe way to speed up sobriety. Never drive after drinking.',
    },
    metadata: { version: '1.0.0' },
  },

  // ============================================================================
  // 5. Pace Calculator
  //    Calculates running pace (min/km), speed (km/h, mph)
  // ============================================================================
  {
    id: 'pace-calculator',
    slug: 'pace-calculator',
    title: 'Running Pace Calculator',
    description:
      'Calculate running pace, speed, and finish time for any distance. Supports miles and kilometers.',
    icon: '🏃',
    category: 'health',
    subcategory: 'exercise',
    tags: ['pace', 'running', 'speed', 'distance', 'time', 'marathon'],
    inputs: [
      {
        id: 'distanceVal',
        label: 'Distance',
        type: 'number',
        placeholder: 'e.g. 5',
        defaultValue: 5,
        required: true,
      },
      {
        id: 'distanceUnit',
        label: 'Distance Unit',
        type: 'select',
        defaultValue: '1',
        options: [
          { label: 'km',     value: '1'       },
          { label: 'miles',  value: '1.60934' },
          { label: 'meters', value: '0.001'   },
        ],
        required: true,
      },
      {
        id: 'hours',
        label: 'Time - Hours',
        type: 'number',
        min: 0,
        max: 23,
        defaultValue: 0,
        required: true,
      },
      {
        id: 'minutes',
        label: 'Time - Minutes',
        type: 'number',
        min: 0,
        max: 59,
        defaultValue: 25,
        required: true,
      },
      {
        id: 'seconds',
        label: 'Time - Seconds',
        type: 'number',
        min: 0,
        max: 59,
        defaultValue: 0,
        required: true,
      },
    ],
    formulas: [
      {
        // Convert distance to km using the unit multiplier
        id: 'distKm',
        expression: 'distanceVal * distanceUnit',
        dependencies: ['distanceVal', 'distanceUnit'],
      },
      {
        // Total elapsed time in seconds
        id: 'totalSeconds',
        expression: 'hours * 3600 + minutes * 60 + seconds',
        dependencies: ['hours', 'minutes', 'seconds'],
      },
      {
        // Pace in seconds per km
        id: 'paceSecPerKm',
        expression: 'totalSeconds / distKm',
        dependencies: ['totalSeconds', 'distKm'],
      },
      {
        // Whole minutes component of the pace
        id: 'paceMin',
        expression: 'floor(paceSecPerKm / 60)',
        dependencies: ['paceSecPerKm'],
      },
      {
        // Remaining seconds component of the pace
        id: 'paceSec',
        expression: 'round(paceSecPerKm - paceMin * 60)',
        dependencies: ['paceSecPerKm', 'paceMin'],
      },
      {
        // Speed in km/h
        id: 'speedKph',
        expression: 'distKm / (totalSeconds / 3600)',
        dependencies: ['distKm', 'totalSeconds'],
      },
      {
        // Speed in miles per hour
        id: 'speedMph',
        expression: 'speedKph / 1.60934',
        dependencies: ['speedKph'],
      },
    ],
    outputs: [
      {
        id: 'paceOut',
        label: 'Pace (min/km)',
        formulaRef: 'paceMin',
        precision: 0,
        suffix: ' min/km',
        highlight: true,
      },
      {
        id: 'speedKphOut',
        label: 'Speed',
        formulaRef: 'speedKph',
        precision: 2,
        suffix: ' km/h',
      },
      {
        id: 'speedMphOut',
        label: 'Speed (mph)',
        formulaRef: 'speedMph',
        precision: 2,
        suffix: ' mph',
      },
    ],
    guide: {
      whatIsIt:
        'Pace is how long it takes you to run one kilometre — expressed as minutes per km. Speed is the inverse: how many kilometres you cover in one hour. Runners typically train by pace, while cyclists often train by speed. Common race distances: 5K, 10K, Half Marathon (21.1 km / 13.1 mi), Marathon (42.2 km / 26.2 mi).',
      howToUse:
        '1. Enter the distance you ran and select the unit (km, miles, or meters).\n2. Enter your total run time split into hours, minutes, and seconds.\n3. The calculator shows your pace per km and speed in both km/h and mph.',
      exampleScenario:
        'A 5 km run completed in 25 minutes: Pace = 1500 s / 5 km = 300 s/km = 5:00 min/km. Speed = 5 km / 0.4167 h = 12.0 km/h. At this pace, a half marathon (21.1 km) would take approximately 1 hour 45 minutes 30 seconds.',
      proTip:
        'A 1% improvement in pace (e.g. from 5:00 to 4:57 min/km) saves over 2 minutes in a 5K and nearly 10 minutes in a marathon. Build aerobic base by running 80% of your miles at an easy conversational pace — breakthrough workouts should make up only 20%.',
    },
    metadata: { version: '1.0.0' },
  },

  // ============================================================================
  // 6. Child Height Predictor
  //    Mid-Parental Height (MPH) method — Tanner 1970 clinical standard
  // ============================================================================
  {
    id: 'child-height-predictor',
    slug: 'child-height-predictor',
    title: 'Child Height Predictor',
    description:
      "Predict a child's adult height using the Mid-Parental Height (MPH) method, the clinical standard for pediatric height estimation.",
    icon: '📏',
    category: 'health',
    subcategory: 'body-metrics',
    tags: ['height predictor', 'mid parental', 'child height', 'growth', 'genetics'],
    inputs: [
      {
        id: 'fatherHeight',
        label: "Father's Height",
        type: 'number',
        placeholder: 'e.g. 175',
        units: [
          { label: 'cm', value: 'cm' },
          { label: 'in', value: 'in', conversionFactor: '2.54' },
        ],
        required: true,
      },
      {
        id: 'motherHeight',
        label: "Mother's Height",
        type: 'number',
        placeholder: 'e.g. 163',
        units: [
          { label: 'cm', value: 'cm' },
          { label: 'in', value: 'in', conversionFactor: '2.54' },
        ],
        required: true,
      },
      {
        id: 'childSex',
        label: "Child's Sex",
        type: 'select',
        defaultValue: '1',
        options: [
          { label: 'Boy',  value: '1' },
          { label: 'Girl', value: '0' },
        ],
        required: true,
      },
    ],
    formulas: [
      {
        // MPH (Tanner 1970):
        //   Boy:  (fatherHeight + motherHeight + 13) / 2
        //   Girl: (fatherHeight + motherHeight - 13) / 2
        // The 13 cm correction accounts for the average sex difference in adult height
        id: 'mph',
        expression:
          'childSex == 1 ? (fatherHeight + motherHeight + 13) / 2 : (fatherHeight + motherHeight - 13) / 2',
        dependencies: ['fatherHeight', 'motherHeight', 'childSex'],
      },
      {
        // Convert predicted height to inches
        id: 'mphInches',
        expression: 'mph / 2.54',
        dependencies: ['mph'],
      },
      {
        // 95% confidence interval lower bound (+/-8.5 cm)
        id: 'rangeLow',
        expression: 'mph - 8.5',
        dependencies: ['mph'],
      },
      {
        // 95% confidence interval upper bound (+/-8.5 cm)
        id: 'rangeHigh',
        expression: 'mph + 8.5',
        dependencies: ['mph'],
      },
    ],
    outputs: [
      {
        id: 'mphCm',
        label: 'Predicted Adult Height',
        formulaRef: 'mph',
        precision: 1,
        suffix: ' cm',
        highlight: true,
      },
      {
        id: 'mphIn',
        label: 'Predicted Height (inches)',
        formulaRef: 'mphInches',
        precision: 1,
        suffix: ' in',
      },
      {
        id: 'rangeLowOut',
        label: 'Range Low (+/-8.5 cm)',
        formulaRef: 'rangeLow',
        precision: 1,
        suffix: ' cm',
      },
      {
        id: 'rangeHighOut',
        label: 'Range High (+/-8.5 cm)',
        formulaRef: 'rangeHigh',
        precision: 1,
        suffix: ' cm',
      },
    ],
    guide: {
      whatIsIt:
        "The Mid-Parental Height (MPH) method, established by James Tanner in 1970, is the clinical gold standard for estimating a child's adult height based purely on genetics. It averages both parents' heights and applies a +/-13 cm sex correction to account for the typical height difference between men and women. The 95% confidence interval is +/-8.5 cm, meaning 95% of children will fall within that range.",
      howToUse:
        "1. Enter the father's height and mother's height (both in cm or inches — select the unit).\n2. Select the child's biological sex.\n3. The predicted adult height and +/-8.5 cm confidence range are displayed.",
      exampleScenario:
        "Father: 178 cm, Mother: 165 cm, Boy. MPH = (178 + 165 + 13) / 2 = 178 cm. Range: 169.5-186.5 cm. For a girl from the same parents: (178 + 165 - 13) / 2 = 165 cm. Range: 156.5-173.5 cm.",
      proTip:
        'Genetics accounts for roughly 60-80% of height variation. Non-genetic factors — especially nutrition, sleep (growth hormone is released during deep sleep), and childhood health — can add or subtract several centimetres from the genetic potential. Children with good nutrition and adequate sleep tend to reach the upper range of their MPH estimate.',
    },
    metadata: { version: '1.0.0' },
  },

  // ============================================================================
  // 7. eGFR Calculator
  //    2021 CKD-EPI creatinine equation (race-free, current clinical standard)
  // ============================================================================
  {
    id: 'egfr-calculator',
    slug: 'egfr-calculator',
    title: 'eGFR Calculator',
    description:
      'Calculate estimated Glomerular Filtration Rate using the 2021 CKD-EPI creatinine equation (race-free version), the current clinical standard for kidney function assessment.',
    icon: '🫘',
    category: 'health',
    subcategory: 'clinical',
    tags: ['egfr', 'ckd-epi', 'kidney function', 'creatinine', 'renal', 'ckd'],
    inputs: [
      {
        id: 'creatinine',
        label: 'Serum Creatinine (mg/dL)',
        type: 'number',
        placeholder: 'e.g. 1.0',
        step: 0.01,
        min: 0.1,
        required: true,
      },
      {
        id: 'age',
        label: 'Age',
        type: 'number',
        min: 18,
        max: 100,
        placeholder: 'e.g. 50',
        required: true,
      },
      {
        id: 'sex',
        label: 'Biological Sex',
        type: 'select',
        defaultValue: '0',
        options: [
          { label: 'Male',   value: '0' },
          { label: 'Female', value: '1' },
        ],
        required: true,
      },
    ],
    formulas: [
      {
        // kappa: male = 0.9, female = 0.7
        id: 'kappa',
        expression: 'sex == 0 ? 0.9 : 0.7',
        dependencies: ['sex'],
      },
      {
        // alpha: male = -0.302, female = -0.241
        id: 'alpha',
        expression: 'sex == 0 ? -0.302 : -0.241',
        dependencies: ['sex'],
      },
      {
        // Sex multiplier: male = 1, female = 1.012
        id: 'sexFactor',
        expression: 'sex == 0 ? 1 : 1.012',
        dependencies: ['sex'],
      },
      {
        // Creatinine / kappa ratio
        id: 'crRatio',
        expression: 'creatinine / kappa',
        dependencies: ['creatinine', 'kappa'],
      },
      {
        // min(Scr/kappa, 1)^alpha — applies when crRatio < 1
        id: 'minTerm',
        expression: 'crRatio < 1 ? pow(crRatio, alpha) : 1',
        dependencies: ['crRatio', 'alpha'],
      },
      {
        // max(Scr/kappa, 1)^-1.200 — applies when crRatio > 1
        id: 'maxTerm',
        expression: 'crRatio > 1 ? pow(crRatio, -1.200) : 1',
        dependencies: ['crRatio'],
      },
      {
        // 2021 CKD-EPI: eGFR = 142 x min^alpha x max^-1.200 x 0.9938^age x sexFactor
        id: 'egfr',
        expression: '142 * minTerm * maxTerm * pow(0.9938, age) * sexFactor',
        dependencies: ['minTerm', 'maxTerm', 'age', 'sexFactor'],
      },
    ],
    outputs: [
      {
        id: 'egfrResult',
        label: 'eGFR',
        formulaRef: 'egfr',
        precision: 1,
        suffix: ' mL/min/1.73m2',
        highlight: true,
      },
    ],
    guide: {
      whatIsIt:
        'Estimated Glomerular Filtration Rate (eGFR) measures how well your kidneys filter waste from the blood, expressed as mL per minute per 1.73 m2 of body surface area. This calculator implements the 2021 CKD-EPI (Chronic Kidney Disease Epidemiology Collaboration) creatinine equation — the race-free version adopted as the clinical standard.\n\nCKD Staging by eGFR:\n- G1: >=90 (Normal)\n- G2: 60-89 (Mildly decreased)\n- G3a: 45-59 (Mild-moderate decrease)\n- G3b: 30-44 (Moderate-severe decrease)\n- G4: 15-29 (Severely decreased)\n- G5: <15 (Kidney failure)',
      howToUse:
        '1. Enter your serum creatinine in mg/dL (from a blood test — check your lab report).\n2. Enter your age.\n3. Select your biological sex.\n4. The eGFR result is displayed. Compare to the CKD staging guide in the description.',
      exampleScenario:
        'A 55-year-old male with serum creatinine of 1.2 mg/dL: crRatio = 1.2/0.9 = 1.333 (>1). minTerm = 1. maxTerm = 1.333^-1.2 = 0.737. eGFR = 142 x 1 x 0.737 x 0.9938^55 x 1 = approximately 67 mL/min/1.73m2 — CKD Stage G2.',
      proTip:
        'eGFR from creatinine alone can be influenced by muscle mass — athletes may have higher creatinine from muscle breakdown, leading to an underestimated eGFR. Cystatin C-based eGFR is more accurate in such cases. If your eGFR is below 60, consult your doctor. Referral to a nephrologist is typically recommended when eGFR is below 30 or declining rapidly.',
    },
    metadata: { version: '1.0.0' },
  },

  // ============================================================================
  // 8. Calorie Deficit Calculator
  //    7,700 kcal per kg of fat principle (3,500 kcal/lb)
  // ============================================================================
  {
    id: 'calorie-deficit-calculator',
    slug: 'calorie-deficit-calculator',
    title: 'Calorie Deficit Calculator',
    description:
      'Calculate the daily calorie deficit needed to reach your goal weight by your target date, based on the 7,700 kcal per kg of fat principle.',
    icon: '🔥',
    category: 'health',
    subcategory: 'nutrition',
    tags: ['calorie deficit', 'weight loss', 'tdee', 'calories', 'diet'],
    inputs: [
      {
        id: 'currentWeight',
        label: 'Current Weight',
        type: 'number',
        placeholder: 'e.g. 85',
        units: [
          { label: 'kg', value: 'kg' },
          { label: 'lb', value: 'lb', conversionFactor: '0.453592' },
        ],
        required: true,
      },
      {
        id: 'goalWeight',
        label: 'Goal Weight',
        type: 'number',
        placeholder: 'e.g. 75',
        units: [
          { label: 'kg', value: 'kg' },
          { label: 'lb', value: 'lb', conversionFactor: '0.453592' },
        ],
        required: true,
      },
      {
        id: 'weeks',
        label: 'Timeframe (weeks)',
        type: 'number',
        min: 1,
        max: 104,
        defaultValue: 12,
        helpText: 'Safe rate: 0.5-1 kg/week. Aggressive loss risks muscle mass.',
        required: true,
      },
      {
        id: 'tdee',
        label: 'Your TDEE (kcal/day)',
        type: 'number',
        placeholder: 'e.g. 2200',
        helpText: 'Total Daily Energy Expenditure — use the TDEE calculator to find this',
        required: true,
      },
    ],
    formulas: [
      {
        // Total weight to lose (always positive via abs)
        id: 'weightToLose',
        expression: 'abs(currentWeight - goalWeight)',
        dependencies: ['currentWeight', 'goalWeight'],
      },
      {
        // Total caloric deficit required: 7,700 kcal per kg of fat
        id: 'totalCalorieDeficit',
        expression: 'weightToLose * 7700',
        dependencies: ['weightToLose'],
      },
      {
        // Daily deficit needed to hit goal within the timeframe
        id: 'dailyDeficit',
        expression: 'totalCalorieDeficit / (weeks * 7)',
        dependencies: ['totalCalorieDeficit', 'weeks'],
      },
      {
        // Recommended daily calorie intake = TDEE - daily deficit
        id: 'dailyCalories',
        expression: 'tdee - dailyDeficit',
        dependencies: ['tdee', 'dailyDeficit'],
      },
      {
        // Average weekly fat loss rate
        id: 'weeklyLoss',
        expression: 'weightToLose / weeks',
        dependencies: ['weightToLose', 'weeks'],
      },
    ],
    outputs: [
      {
        id: 'dailyDeficitOut',
        label: 'Daily Calorie Deficit',
        formulaRef: 'dailyDeficit',
        precision: 0,
        suffix: ' kcal',
        highlight: true,
      },
      {
        id: 'dailyCaloriesOut',
        label: 'Daily Calorie Target',
        formulaRef: 'dailyCalories',
        precision: 0,
        suffix: ' kcal',
        highlight: true,
      },
      {
        id: 'weeklyLossOut',
        label: 'Expected Weekly Loss',
        formulaRef: 'weeklyLoss',
        precision: 2,
        suffix: ' kg/week',
      },
      {
        id: 'totalDeficitOut',
        label: 'Total Calorie Deficit Needed',
        formulaRef: 'totalCalorieDeficit',
        precision: 0,
        suffix: ' kcal',
      },
    ],
    guide: {
      whatIsIt:
        'The Calorie Deficit Calculator determines how many fewer calories per day you need to eat (relative to your TDEE) in order to lose a specific amount of weight within a set timeframe. It is based on the principle that 1 kg of body fat stores approximately 7,700 kcal of energy (equivalent to 3,500 kcal per pound). Your Total Daily Energy Expenditure (TDEE) is the number of calories your body burns in a day including all activity.',
      howToUse:
        '1. Enter your current weight and goal weight (both in the same unit).\n2. Enter your target timeframe in weeks.\n3. Enter your TDEE (use the TDEE/BMR calculator if you do not know it).\n4. The calculator shows your required daily deficit and your calorie intake target.\n5. If the daily deficit exceeds 1,000 kcal or the daily intake drops below ~1,200 kcal (women) / 1,500 kcal (men), extend the timeframe.',
      exampleScenario:
        'Current: 85 kg, Goal: 75 kg, 12 weeks, TDEE: 2,200 kcal. Weight to lose: 10 kg. Total deficit: 77,000 kcal. Daily deficit: 77,000 / 84 days = 917 kcal/day. Daily intake target: 2,200 - 917 = 1,283 kcal. Weekly loss: 10 / 12 = 0.83 kg/week.',
      proTip:
        'A deficit above 1,000 kcal/day or more than 1 kg/week increases the risk of muscle loss — the body breaks down lean tissue for energy when the deficit is too aggressive. Preserve muscle by keeping protein intake high (1.6-2.2 g/kg body weight) and including resistance training. Calorie needs also decrease as you lose weight, so recalculate your TDEE every 4-6 weeks.',
    },
    metadata: { version: '1.0.0' },
  },

];
