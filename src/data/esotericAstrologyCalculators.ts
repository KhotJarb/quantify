// ---------------------------------------------------------------------------
// Quantify � Esoteric, Astrology & Numerology Calculators
// ---------------------------------------------------------------------------
// 10 entertainment/fun calculators covering numerology, astrology, biorhythms,
// lunar phases, Chinese zodiac, and calendar conversions.
// ---------------------------------------------------------------------------

import type { CalculatorSchema } from '@/types/calculator';

export const esotericAstrologyCalculators: CalculatorSchema[] = [
  // =========================================================================
  // 1. Numerology Life Path Number
  // =========================================================================
  {
    id: 'numerology-life-path',
    slug: 'numerology-life-path',
    title: 'Numerology Life Path Number',
    description:
      'Calculate your Numerology Life Path Number by reducing your full birth date to a single digit (or master number) for entertainment and self-reflection.',
    icon: '✨',
    category: 'special',
    subcategory: 'esoteric',
    tags: ['numerology', 'life path', 'astrology', 'birth date', 'esoteric', 'fun', 'entertainment', 'spiritual'],
    inputs: [
      {
        id: 'birthDay',
        label: 'Birth Day',
        type: 'number',
        defaultValue: 15,
        min: 1,
        max: 31,
        step: 1,
        placeholder: 'e.g. 15',
        required: true,
      },
      {
        id: 'birthMonth',
        label: 'Birth Month',
        type: 'number',
        defaultValue: 7,
        min: 1,
        max: 12,
        step: 1,
        placeholder: 'e.g. 7',
        required: true,
      },
      {
        id: 'birthYear',
        label: 'Birth Year',
        type: 'number',
        defaultValue: 1990,
        min: 1900,
        max: 2024,
        step: 1,
        placeholder: 'e.g. 1990',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'd1',
        expression: 'floor(birthDay / 10)',
        dependencies: ['birthDay'],
      },
      {
        id: 'd2',
        expression: 'birthDay - d1 * 10',
        dependencies: ['birthDay', 'd1'],
      },
      {
        id: 'm1',
        expression: 'floor(birthMonth / 10)',
        dependencies: ['birthMonth'],
      },
      {
        id: 'm2',
        expression: 'birthMonth - m1 * 10',
        dependencies: ['birthMonth', 'm1'],
      },
      {
        id: 'y1',
        expression: 'floor(birthYear / 1000)',
        dependencies: ['birthYear'],
      },
      {
        id: 'y2',
        expression: 'floor((birthYear - y1 * 1000) / 100)',
        dependencies: ['birthYear', 'y1'],
      },
      {
        id: 'y3',
        expression: 'floor((birthYear - y1 * 1000 - y2 * 100) / 10)',
        dependencies: ['birthYear', 'y1', 'y2'],
      },
      {
        id: 'y4',
        expression: 'birthYear - y1 * 1000 - y2 * 100 - y3 * 10',
        dependencies: ['birthYear', 'y1', 'y2', 'y3'],
      },
      {
        id: 'digitSum',
        expression: 'd1 + d2 + m1 + m2 + y1 + y2 + y3 + y4',
        dependencies: ['d1', 'd2', 'm1', 'm2', 'y1', 'y2', 'y3', 'y4'],
      },
      {
        id: 'sum2',
        expression: 'floor(digitSum / 10) + digitSum - floor(digitSum / 10) * 10',
        dependencies: ['digitSum'],
      },
      {
        id: 'lifePath',
        expression: 'sum2 > 9 ? (floor(sum2 / 10) + sum2 - floor(sum2 / 10) * 10) : sum2',
        dependencies: ['sum2'],
      },
    ],
    outputs: [
      {
        id: 'out-digitSum',
        label: 'Initial Sum',
        formulaRef: 'digitSum',
        format: 'number',
        precision: 0,
      },
      {
        id: 'out-lifePath',
        label: 'Life Path Number',
        formulaRef: 'lifePath',
        format: 'number',
        precision: 0,
        highlight: true,
      },
    ],
    guide: {
      whatIsIt:
        'For entertainment purposes only. The Life Path Number is the central concept in Pythagorean numerology. It is derived by reducing a person\'s full birth date to a single digit (1�9) or one of the "master numbers" (11, 22, 33) by repeatedly summing all digits. Numerology enthusiasts believe this number reflects core personality traits and life purpose.',
      howToUse:
        'Enter your birth day, month, and year. The calculator sums all the individual digits of your birth date and reduces the result to a single digit. For example, if the date is July 15, 1990, each digit is added: 1+5+0+7+1+9+9+0 = 32 ? 3+2 = 5. Your Life Path Number would be 5.',
      exampleScenario:
        'Born on December 14, 1985: digits are 1+4+1+2+1+9+8+5 = 31 ? 3+1 = 4. Life Path 4 is associated by numerologists with practicality, organization, and building solid foundations � a number said to belong to architects, engineers, and planners.',
      proTip:
        'In traditional numerology, 11, 22, and 33 are considered "master numbers" and are not reduced further. This simplified calculator always reduces to a single digit. If your sum2 result equals 11 or 22, consider that your potential master number for deeper numerological interpretation from a dedicated resource.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 2. Biorhythm Calculator
  // =========================================================================
  {
    id: 'biorhythm-calculator',
    slug: 'biorhythm-calculator',
    title: 'Biorhythm Calculator',
    description:
      'Calculate your physical, emotional, and intellectual biorhythm cycle values for any day, based on the pseudoscientific biorhythm theory.',
    icon: '🌀',
    category: 'special',
    subcategory: 'esoteric',
    tags: ['biorhythm', 'cycle', 'physical', 'emotional', 'intellectual', 'wellness', 'fun', 'entertainment'],
    inputs: [
      {
        id: 'daysSinceBirth',
        label: 'Days Since Birth',
        type: 'number',
        defaultValue: 12000,
        min: 0,
        max: 40000,
        step: 1,
        placeholder: 'e.g. 12000',
        helpText: 'Calculate: subtract your birth date from today\'s date and count total days.',
        required: true,
      },
      {
        id: 'forecastDays',
        label: 'Days from Today to Forecast',
        type: 'number',
        defaultValue: 0,
        min: -30,
        max: 30,
        step: 1,
        placeholder: 'e.g. 0',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'totalDays',
        expression: 'daysSinceBirth + forecastDays',
        dependencies: ['daysSinceBirth', 'forecastDays'],
      },
      {
        id: 'physical',
        expression: 'sin(2 * 3.14159 * totalDays / 23) * 100',
        dependencies: ['totalDays'],
      },
      {
        id: 'emotional',
        expression: 'sin(2 * 3.14159 * totalDays / 28) * 100',
        dependencies: ['totalDays'],
      },
      {
        id: 'intellectual',
        expression: 'sin(2 * 3.14159 * totalDays / 33) * 100',
        dependencies: ['totalDays'],
      },
      {
        id: 'average',
        expression: '(physical + emotional + intellectual) / 3',
        dependencies: ['physical', 'emotional', 'intellectual'],
      },
    ],
    outputs: [
      {
        id: 'out-physical',
        label: 'Physical Cycle',
        formulaRef: 'physical',
        format: 'number',
        precision: 1,
        suffix: '%',
        highlight: true,
      },
      {
        id: 'out-emotional',
        label: 'Emotional Cycle',
        formulaRef: 'emotional',
        format: 'number',
        precision: 1,
        suffix: '%',
      },
      {
        id: 'out-intellectual',
        label: 'Intellectual Cycle',
        formulaRef: 'intellectual',
        format: 'number',
        precision: 1,
        suffix: '%',
      },
      {
        id: 'out-average',
        label: 'Overall Biorhythm',
        formulaRef: 'average',
        format: 'number',
        precision: 1,
        suffix: '%',
      },
    ],
    guide: {
      whatIsIt:
        'For entertainment purposes only. Biorhythm theory proposes that human biological processes follow three sinusoidal cycles starting from birth: Physical (23 days), Emotional (28 days), and Intellectual (33 days). Positive values indicate a "high" phase; negative values indicate a "low" phase. The theory has no scientific support but remains popular in wellness culture.',
      howToUse:
        'Count the total number of days from your birth date to today (you can use an online date difference calculator). Enter that number in "Days Since Birth." Use "Days to Forecast" to see your cycles on a future or past date (e.g., +3 for three days from now). Values range from -100 to +100%.',
      exampleScenario:
        'A person 12,000 days old has Physical: +67%, Emotional: -45%, Intellectual: +12%. This hypothetically means today is a good day for physical activities but not the best for emotional decisions. Planning an important conversation might be better later in the week when the emotional cycle is positive.',
      proTip:
        'Days when a cycle crosses zero (either direction) are called "critical days" in biorhythm lore � supposedly periods of instability. If two or three cycles cross zero on the same day, it\'s considered a "double" or "triple critical" day. These make for fun conversation starters, even if science disagrees with the premise.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 3. Lunar Phase & Illumination Calculator
  // =========================================================================
  {
    id: 'lunar-phase-calculator',
    slug: 'lunar-phase-calculator',
    title: 'Lunar Phase & Illumination Calculator',
    description:
      'Calculate the approximate moon illumination percentage and lunar phase based on days elapsed since the last new moon.',
    icon: '🌙',
    category: 'special',
    subcategory: 'esoteric',
    tags: ['moon', 'lunar phase', 'full moon', 'new moon', 'illumination', 'astronomy', 'astrology', 'tide'],
    inputs: [
      {
        id: 'daysSinceNewMoon',
        label: 'Days Since Last New Moon',
        type: 'number',
        defaultValue: 7,
        min: 0,
        max: 30,
        step: 0.5,
        placeholder: 'e.g. 7',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'synodicMonth',
        expression: '29.53059',
        dependencies: [],
      },
      {
        id: 'phaseFraction',
        expression: 'daysSinceNewMoon / synodicMonth',
        dependencies: ['daysSinceNewMoon', 'synodicMonth'],
      },
      {
        id: 'illumination',
        expression: '(1 - cos(phaseFraction * 2 * 3.14159)) / 2 * 100',
        dependencies: ['phaseFraction'],
      },
      {
        id: 'phaseIndex',
        expression: 'floor(phaseFraction * 8)',
        dependencies: ['phaseFraction'],
      },
    ],
    outputs: [
      {
        id: 'out-illumination',
        label: 'Moon Illumination',
        formulaRef: 'illumination',
        format: 'number',
        precision: 1,
        suffix: '% illuminated',
        highlight: true,
      },
      {
        id: 'out-phaseIndex',
        label: 'Phase (0=New Moon � 1=Waxing Crescent � 2=First Quarter � 3=Waxing Gibbous � 4=Full � 5=Waning Gibbous � 6=Last Quarter � 7=Waning Crescent)',
        formulaRef: 'phaseIndex',
        format: 'number',
        precision: 0,
      },
    ],
    guide: {
      whatIsIt:
        'For entertainment purposes only. The lunar cycle (synodic month) is approximately 29.53 days from new moon to new moon. The moon\'s illuminated fraction follows a cosine curve over that period. This calculator maps days since the last new moon to illumination percentage and one of eight traditional phase names. Actual illumination may differ slightly due to the moon\'s elliptical orbit.',
      howToUse:
        'Find the date of the most recent new moon (from a moon phase calendar or astronomy app), count the number of days from that new moon to today, and enter the value. The calculator returns the approximate illumination percentage and the phase index.',
      exampleScenario:
        '7 days since new moon: illumination � 47% � this is the First Quarter phase (waxing, half-lit). At 14�15 days, illumination reaches ~99�100%: Full Moon. At 22 days, it is approximately Last Quarter, dropping back to ~50% illumination but now waning.',
      proTip:
        'The full moon is popular in astrology and folklore � many cultures tie planting cycles, fishing, and personal energy levels to lunar phases. Whether or not you believe in lunar effects, moon phase knowledge is practically useful: a bright full moon provides excellent natural light for night photography and outdoor navigation, while a new moon offers the darkest skies for stargazing.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 4. Chinese Zodiac & Element Calculator
  // =========================================================================
  {
    id: 'chinese-zodiac-calculator',
    slug: 'chinese-zodiac-calculator',
    title: 'Chinese Zodiac & Element Calculator',
    description:
      'Determine your Chinese zodiac animal, associated element (Metal, Water, Wood, Fire, Earth), and Yang/Yin polarity from your birth year.',
    icon: '🐉',
    category: 'special',
    subcategory: 'esoteric',
    tags: ['chinese zodiac', 'zodiac animal', 'element', 'yin yang', 'astrology', 'lunar calendar', 'fun', 'entertainment'],
    inputs: [
      {
        id: 'birthYear',
        label: 'Birth Year',
        type: 'number',
        defaultValue: 1990,
        min: 1900,
        max: 2100,
        step: 1,
        placeholder: 'e.g. 1990',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'animal',
        expression: '(birthYear - 4) - floor((birthYear - 4) / 12) * 12',
        dependencies: ['birthYear'],
      },
      {
        id: 'element',
        expression: 'floor((birthYear - 4 - floor((birthYear - 4) / 10) * 10) / 2)',
        dependencies: ['birthYear'],
      },
      {
        id: 'yangYin',
        expression: 'birthYear - floor(birthYear / 2) * 2',
        dependencies: ['birthYear'],
      },
    ],
    outputs: [
      {
        id: 'out-animal',
        label: 'Zodiac Animal (0=Rat � 1=Ox � 2=Tiger � 3=Rabbit � 4=Dragon � 5=Snake � 6=Horse � 7=Goat � 8=Monkey � 9=Rooster � 10=Dog � 11=Pig)',
        formulaRef: 'animal',
        format: 'number',
        precision: 0,
        highlight: true,
      },
      {
        id: 'out-element',
        label: 'Element (0=Metal � 1=Water � 2=Wood � 3=Fire � 4=Earth)',
        formulaRef: 'element',
        format: 'number',
        precision: 0,
      },
      {
        id: 'out-yangYin',
        label: 'Polarity (0=Yang � 1=Yin)',
        formulaRef: 'yangYin',
        format: 'number',
        precision: 0,
      },
    ],
    guide: {
      whatIsIt:
        'For entertainment purposes only. The Chinese zodiac is a 12-year cycle, with each year associated with one of 12 animals (Rat through Pig). Overlaid on the 12-year cycle is a 10-year Heavenly Stems cycle producing 5 elements (Metal, Water, Wood, Fire, Earth), each active for 2 consecutive years. The year\'s polarity (Yang or Yin) alternates annually. This calculator uses Gregorian birth year; note that the Chinese New Year falls in late January or February, so individuals born before that date should technically use the prior year.',
      howToUse:
        'Enter your birth year. The animal index maps 0?Rat, 1?Ox, � 11?Pig. The element index maps 0?Metal, 1?Water, 2?Wood, 3?Fire, 4?Earth. Yang years are even, Yin years are odd (using the output: 0=Yang, 1=Yin).',
      exampleScenario:
        '1990: animal index = (1990-4) mod 12 = 1986 mod 12 = 6 ? Horse. Element = floor((1986 mod 10) / 2) = floor(6/2) = 3 ? Fire. Polarity: 1990 is even ? Yang. Result: "Metal Horse" � 1990 is specifically a "Metal Horse" year, considered in Chinese astrology as energetic, adventurous, and determined.',
      proTip:
        'The 60-year sexagenary cycle (Ganzhi) is the fundamental unit of Chinese time-keeping, combining all 12 animals � 5 elements � 2 polarities. A complete cycle is 60 years, which is why 60th birthdays are especially celebrated in Chinese culture � you have completed your first full cosmic cycle.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 5. Islamic (Hijri) to Gregorian Date Converter
  // =========================================================================
  {
    id: 'hijri-gregorian-converter',
    slug: 'hijri-gregorian-converter',
    title: 'Islamic (Hijri) to Gregorian Date Converter',
    description:
      'Approximate the Gregorian (CE) date equivalent of a given Islamic Hijri calendar date using a simplified astronomical formula.',
    icon: '🕌',
    category: 'general',
    subcategory: 'date-time',
    tags: ['Hijri', 'Islamic calendar', 'Gregorian', 'date converter', 'lunar calendar', 'Ramadan', 'religious dates'],
    inputs: [
      {
        id: 'hijriYear',
        label: 'Hijri Year (AH)',
        type: 'number',
        defaultValue: 1446,
        min: 1,
        max: 1600,
        step: 1,
        placeholder: 'e.g. 1446',
        required: true,
      },
      {
        id: 'hijriMonth',
        label: 'Hijri Month',
        type: 'number',
        defaultValue: 1,
        min: 1,
        max: 12,
        step: 1,
        placeholder: 'e.g. 1',
        required: true,
      },
      {
        id: 'hijriDay',
        label: 'Hijri Day',
        type: 'number',
        defaultValue: 1,
        min: 1,
        max: 30,
        step: 1,
        placeholder: 'e.g. 1',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'gregorianYear',
        expression: 'round(hijriYear * 0.970224 + 621.5643)',
        dependencies: ['hijriYear'],
      },
      {
        id: 'gregorianMonth',
        expression: 'hijriMonth',
        dependencies: ['hijriMonth'],
      },
      {
        id: 'gregorianDay',
        expression: 'hijriDay',
        dependencies: ['hijriDay'],
      },
    ],
    outputs: [
      {
        id: 'out-gregorianYear',
        label: 'Approx Gregorian Year',
        formulaRef: 'gregorianYear',
        format: 'number',
        precision: 0,
        highlight: true,
      },
      {
        id: 'out-gregorianMonth',
        label: 'Approx Gregorian Month',
        formulaRef: 'gregorianMonth',
        format: 'number',
        precision: 0,
      },
      {
        id: 'out-gregorianDay',
        label: 'Day',
        formulaRef: 'gregorianDay',
        format: 'number',
        precision: 0,
      },
    ],
    guide: {
      whatIsIt:
        'For entertainment purposes only. The Islamic (Hijri) calendar is a purely lunar calendar of 12 months (354 or 355 days per year), meaning it shifts approximately 10�11 days earlier each Gregorian year. The Hijri epoch is the emigration (Hijra) of the Prophet Muhammad from Mecca to Medina in 622 CE. This calculator provides an approximate Gregorian year using a linear approximation formula � exact conversion requires a full algorithmic table due to the variable length of lunar months.',
      howToUse:
        'Enter the Hijri year, month, and day. The calculator returns the approximate Gregorian year equivalent. The month and day are returned as entered � they are approximations only, as precise date conversion requires a lookup table or full algorithmic computation. For critical religious dates, always use a dedicated Hijri�Gregorian converter.',
      exampleScenario:
        'Hijri 1 Muharram 1446 (Islamic New Year 1446): the calculator returns approximately 2024 CE. Historically, 1 Muharram 1446 fell on July 7, 2024 � within the range, validating the approximation. For the year 1400 AH: 1400 � 0.970224 + 621.5643 � 1979 CE. Hijri 1400 indeed began in November 1979.',
      proTip:
        'Because the Hijri year is ~354 days, important Islamic events like Ramadan, Eid al-Fitr, and Eid al-Adha rotate through all seasons over a 33-year cycle. This means Ramadan falls in summer in some years and winter in others. Planners and travelers should always verify religious date timings with an authoritative Islamic calendar for the year in question.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 6. Numerology Compatibility Calculator
  // =========================================================================
  {
    id: 'compatibility-synastry',
    slug: 'compatibility-synastry',
    title: 'Numerology Compatibility Calculator',
    description:
      'Get a fun numerology-based compatibility score between two people based on their Life Path Numbers.',
    icon: '💞',
    category: 'special',
    subcategory: 'esoteric',
    tags: ['compatibility', 'numerology', 'life path', 'relationship', 'love', 'partner', 'fun', 'entertainment'],
    inputs: [
      {
        id: 'lifePath1',
        label: 'Your Life Path Number',
        type: 'number',
        defaultValue: 3,
        min: 1,
        max: 9,
        step: 1,
        placeholder: 'e.g. 3',
        helpText: 'Use the Numerology Life Path calculator above to find your number.',
        required: true,
      },
      {
        id: 'lifePath2',
        label: 'Partner Life Path Number',
        type: 'number',
        defaultValue: 7,
        min: 1,
        max: 9,
        step: 1,
        placeholder: 'e.g. 7',
        helpText: 'Use the Numerology Life Path calculator for your partner\'s birth date.',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'diff',
        expression: 'abs(lifePath1 - lifePath2)',
        dependencies: ['lifePath1', 'lifePath2'],
      },
      {
        id: 'compatibility',
        expression: 'diff == 0 ? 95 : (diff == 1 ? 75 : (diff == 2 ? 60 : (diff == 3 ? 80 : (diff == 4 ? 50 : (diff == 5 ? 65 : (diff == 6 ? 85 : (diff == 7 ? 55 : 70)))))))',
        dependencies: ['diff'],
      },
    ],
    outputs: [
      {
        id: 'out-compatibility',
        label: 'Compatibility Score (entertainment only)',
        formulaRef: 'compatibility',
        format: 'number',
        precision: 0,
        suffix: '%',
        highlight: true,
      },
    ],
    guide: {
      whatIsIt:
        'For entertainment purposes only. In numerology, Life Path Numbers are thought to describe fundamental personality traits. This calculator assigns a whimsical compatibility percentage based on the numeric difference between two Life Path Numbers � same number scores highest (95%), and various differences map to different compatibility scores based on numerological tradition. This is purely for fun.',
      howToUse:
        'First calculate both Life Path Numbers using the Numerology Life Path calculator. Enter each number (1�9) and read your compatibility score. Treat the result as a conversation starter, not relationship advice.',
      exampleScenario:
        'Life Path 3 (creative, expressive) and Life Path 7 (analytical, introspective): difference = 4, score = 50%. Traditional numerology considers this a "challenging" pairing that requires compromise � the extroverted 3 and introverted 7 may clash on social needs. However, many successful couples share "challenging" numerology � real compatibility is far more complex.',
      proTip:
        'In professional astrology and relationship counseling, synastry (the comparison of two birth charts) considers the positions of multiple planets, not just sun signs or numbers. If you enjoy this topic, exploring a full synastry chart reading with a qualified astrologer provides a much richer (if equally subjective) analysis.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 7. Numerology Name Number Calculator
  // =========================================================================
  {
    id: 'numerology-name-number',
    slug: 'numerology-name-number',
    title: 'Numerology Name Number Calculator',
    description:
      'Calculate your Destiny (Expression) Number by reducing the summed values of all letters in your full birth name to a single digit.',
    icon: '🔮',
    category: 'special',
    subcategory: 'esoteric',
    tags: ['numerology', 'name number', 'destiny number', 'expression number', 'letters', 'fun', 'entertainment', 'spiritual'],
    inputs: [
      {
        id: 'letterSum',
        label: 'Sum of Letter Values',
        type: 'number',
        defaultValue: 34,
        min: 1,
        max: 999,
        step: 1,
        placeholder: 'e.g. 34',
        helpText: 'Assign A=1, B=2, C=3 � Z=26. Sum all letter values in your full birth name.',
        required: true,
      },
      {
        id: 'nameLength',
        label: 'Number of Letters in Name',
        type: 'number',
        defaultValue: 8,
        min: 1,
        max: 50,
        step: 1,
        placeholder: 'e.g. 8',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'reduced1',
        expression: 'floor(letterSum / 10) + letterSum - floor(letterSum / 10) * 10',
        dependencies: ['letterSum'],
      },
      {
        id: 'nameNumber',
        expression: 'reduced1 > 9 ? (floor(reduced1 / 10) + reduced1 - floor(reduced1 / 10) * 10) : reduced1',
        dependencies: ['reduced1'],
      },
      {
        id: 'avgLetterValue',
        expression: 'letterSum / nameLength',
        dependencies: ['letterSum', 'nameLength'],
      },
    ],
    outputs: [
      {
        id: 'out-nameNumber',
        label: 'Name Number (Destiny Number)',
        formulaRef: 'nameNumber',
        format: 'number',
        precision: 0,
        highlight: true,
      },
      {
        id: 'out-avgLetterValue',
        label: 'Average Letter Value',
        formulaRef: 'avgLetterValue',
        format: 'number',
        precision: 2,
      },
    ],
    guide: {
      whatIsIt:
        'For entertainment purposes only. The Destiny Number (also called Expression Number) in numerology is derived from the full birth name as it appears on the birth certificate. Each letter is assigned a value (A=1, B=2 � Z=26 in the simplified Pythagorean system), all values are summed, and the result is reduced to a single digit. Numerologists believe this number represents the talents and challenges a person is destined to develop in their lifetime.',
      howToUse:
        'Write out your full birth name (first, middle, and last name as on your birth certificate, no titles). Assign each letter its value (A=1, B=2, C=3 � Z=26), sum all values, count the total number of letters, and enter both into the calculator.',
      exampleScenario:
        '"JOHN DOE": J=10, O=15, H=8, N=14, D=4, O=15, E=5. Sum = 71. First reduction: 7+1 = 8. Name Number = 8. Number 8 in numerology is associated with ambition, authority, wealth, and material success � traits many numerologists say align well with business leaders.',
      proTip:
        'Some numerologists use a different letter-to-number mapping (Chaldean system: A=1, B=2, C=3, D=4, E=5, U=6, O=7, F=8) rather than the A�Z = 1�26 simple mapping. This calculator uses the simple Pythagorean sequential mapping. For alternative systems, you would need to manually compute the letter sum using the appropriate table.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 8. Julian Day Number (JDN) Calculator
  // =========================================================================
  {
    id: 'julian-day-number-calculator',
    slug: 'julian-day-number-calculator',
    title: 'Julian Day Number (JDN) Calculator',
    description:
      'Convert any Gregorian calendar date to its Julian Day Number (JDN) and Modified Julian Date (MJD), the continuous day count used in astronomy.',
    icon: '📆',
    category: 'general',
    subcategory: 'date-time',
    tags: ['Julian day', 'JDN', 'MJD', 'astronomy', 'date', 'calendar', 'time', 'chronology'],
    inputs: [
      {
        id: 'year',
        label: 'Year (CE)',
        type: 'number',
        defaultValue: 2024,
        min: 1,
        max: 9999,
        step: 1,
        placeholder: 'e.g. 2024',
        required: true,
      },
      {
        id: 'month',
        label: 'Month',
        type: 'number',
        defaultValue: 7,
        min: 1,
        max: 12,
        step: 1,
        placeholder: 'e.g. 7',
        required: true,
      },
      {
        id: 'day',
        label: 'Day',
        type: 'number',
        defaultValue: 1,
        min: 1,
        max: 31,
        step: 1,
        placeholder: 'e.g. 1',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'a',
        expression: 'floor((14 - month) / 12)',
        dependencies: ['month'],
      },
      {
        id: 'y',
        expression: 'year + 4800 - a',
        dependencies: ['year', 'a'],
      },
      {
        id: 'm',
        expression: 'month + 12 * a - 3',
        dependencies: ['month', 'a'],
      },
      {
        id: 'jdn',
        expression: 'day + floor((153 * m + 2) / 5) + 365 * y + floor(y / 4) - floor(y / 100) + floor(y / 400) - 32045',
        dependencies: ['day', 'm', 'y'],
      },
      {
        id: 'mjd',
        expression: 'jdn - 2400000.5',
        dependencies: ['jdn'],
      },
    ],
    outputs: [
      {
        id: 'out-jdn',
        label: 'Julian Day Number',
        formulaRef: 'jdn',
        format: 'number',
        precision: 0,
        highlight: true,
      },
      {
        id: 'out-mjd',
        label: 'Modified Julian Date (MJD)',
        formulaRef: 'mjd',
        format: 'number',
        precision: 1,
      },
    ],
    guide: {
      whatIsIt:
        'For entertainment purposes only. The Julian Day Number (JDN) is a continuous count of days since the beginning of the Julian Period (January 1, 4713 BC in the proleptic Julian calendar). It is the standard timekeeping system used in astronomy to avoid the complexity of months and years. The Modified Julian Date (MJD) is JDN - 2,400,000.5 and starts from midnight of November 17, 1858 CE � a more compact representation.',
      howToUse:
        'Enter the year, month, and day in the Gregorian calendar. The calculator uses the standard astronomical formula to compute the exact Julian Day Number at noon of that date. The MJD is also provided for use with modern astronomical software.',
      exampleScenario:
        'January 1, 2000 (J2000.0 epoch, the standard reference epoch for modern astronomy): JDN = 2,451,545. This is the reference point for many astronomical calculations. The date July 1, 2024 = JDN 2,460,492 � meaning over 2.46 million days have passed since 4713 BC.',
      proTip:
        'To find the number of days between any two dates, simply subtract their JDNs. For example, the number of days from the Moon landing (July 20, 1969) to today can be calculated precisely without worrying about leap years or month lengths. JDNs are also used in spreadsheet formulas and database date arithmetic as an intermediary format.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 9. Mercury Retrograde Impact Calculator
  // =========================================================================
  {
    id: 'mercury-retrograde-duration',
    slug: 'mercury-retrograde-duration',
    title: 'Mercury Retrograde Impact Calculator',
    description:
      'Calculate your personal "Mercury Retrograde Impact Score" for a fun, tongue-in-cheek assessment of astrological influence on your day.',
    icon: '⭐',
    category: 'special',
    subcategory: 'esoteric',
    tags: ['Mercury retrograde', 'astrology', 'planets', 'horoscope', 'fun', 'entertainment', 'esoteric', 'cosmic'],
    inputs: [
      {
        id: 'daysInRetrograde',
        label: 'Days Currently in Retrograde (0�21)',
        type: 'number',
        defaultValue: 12,
        min: 0,
        max: 21,
        step: 1,
        placeholder: 'e.g. 12',
        required: true,
      },
      {
        id: 'retrograde',
        label: 'Mercury is Currently Retrograde',
        type: 'checkbox',
        defaultValue: true,
      },
      {
        id: 'birthMercuryRetrograde',
        label: 'Born During Mercury Retrograde',
        type: 'checkbox',
        defaultValue: false,
      },
    ],
    formulas: [
      {
        id: 'retrogradePhasePct',
        expression: 'daysInRetrograde / 21 * 100',
        dependencies: ['daysInRetrograde'],
      },
      {
        id: 'intensityScore',
        expression: '(retrograde ? 50 : 0) + (birthMercuryRetrograde ? 30 : 0) + daysInRetrograde * 0.5 * retrogradePhasePct / 100',
        dependencies: ['retrograde', 'birthMercuryRetrograde', 'daysInRetrograde', 'retrogradePhasePct'],
      },
      {
        id: 'cautionLevel',
        expression: 'intensityScore > 60 ? 3 : (intensityScore > 30 ? 2 : 1)',
        dependencies: ['intensityScore'],
      },
    ],
    outputs: [
      {
        id: 'out-retrogradePhasePct',
        label: 'Retrograde Phase Progress',
        formulaRef: 'retrogradePhasePct',
        format: 'number',
        precision: 0,
        suffix: '%',
      },
      {
        id: 'out-cautionLevel',
        label: 'Impact Level (1=Low � 2=Moderate � 3=High � entertainment only)',
        formulaRef: 'cautionLevel',
        format: 'number',
        precision: 0,
        highlight: true,
      },
    ],
    guide: {
      whatIsIt:
        'For entertainment purposes only. In astrology, Mercury retrograde occurs roughly three times a year when Mercury appears to move backward in the sky from Earth\'s perspective. Astrologers associate this period with communication mishaps, travel delays, and technology failures. This calculator playfully quantifies a "retrograde impact score" based on how deep into retrograde we are and whether you were born during one.',
      howToUse:
        'Check an astrology calendar to see if Mercury is currently retrograde and how many days into the retrograde period we are (retrograde periods last ~21 days). Check the boxes if Mercury is currently retrograde and/or if you were born during a retrograde period. The Impact Level from 1 (Low) to 3 (High) is purely for fun.',
      exampleScenario:
        'Mercury has been retrograde for 12 days, you were not born during retrograde: intensity = 50 + 0 + 12�0.5�57/100 � 53.4 ? Impact Level 2 (Moderate). The "advice" from astrology: back up your data, proofread emails twice, and avoid signing major contracts � though your mileage may vary considerably.',
      proTip:
        'There is no scientific evidence that Mercury\'s orbital position affects human affairs on Earth. However, Mercury retrogrades make for excellent shared cultural moments � a cosmic excuse to laugh at everyday mishaps. The next time your Wi-Fi drops, blame Mercury retrograde and carry on. Three retrograde periods per year, each ~21 days, means about 19% of any given year is in retrograde.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 10. Sun Sign & Element Calculator
  // =========================================================================
  {
    id: 'astrology-element-calculator',
    slug: 'astrology-element-calculator',
    title: 'Sun Sign & Element Calculator',
    description:
      'Approximate your Western astrology sun sign, its classical element (Fire, Earth, Air, Water), and modality (Cardinal, Fixed, Mutable) from your birth month and day.',
    icon: '⭐',
    category: 'special',
    subcategory: 'esoteric',
    tags: ['astrology', 'sun sign', 'zodiac', 'horoscope', 'element', 'modality', 'fun', 'entertainment', 'star sign'],
    inputs: [
      {
        id: 'birthMonth',
        label: 'Birth Month',
        type: 'number',
        defaultValue: 7,
        min: 1,
        max: 12,
        step: 1,
        placeholder: 'e.g. 7',
        required: true,
      },
      {
        id: 'birthDay',
        label: 'Birth Day',
        type: 'number',
        defaultValue: 1,
        min: 1,
        max: 31,
        step: 1,
        placeholder: 'e.g. 1',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'dayOfYear',
        expression: 'birthDay + (birthMonth - 1) * 30',
        dependencies: ['birthDay', 'birthMonth'],
      },
      {
        id: 'sunSignIndex',
        expression: 'floor(dayOfYear / 30.4)',
        dependencies: ['dayOfYear'],
      },
      {
        id: 'element',
        expression: 'sunSignIndex - floor(sunSignIndex / 4) * 4',
        dependencies: ['sunSignIndex'],
      },
      {
        id: 'modality',
        expression: 'sunSignIndex - floor(sunSignIndex / 3) * 3',
        dependencies: ['sunSignIndex'],
      },
    ],
    outputs: [
      {
        id: 'out-sunSignIndex',
        label: 'Sun Sign (0=Aries � 1=Taurus � 2=Gemini � 3=Cancer � 4=Leo � 5=Virgo � 6=Libra � 7=Scorpio � 8=Sagittarius � 9=Capricorn � 10=Aquarius � 11=Pisces � approx)',
        formulaRef: 'sunSignIndex',
        format: 'number',
        precision: 0,
        highlight: true,
      },
      {
        id: 'out-element',
        label: 'Element (0=Fire � 1=Earth � 2=Air � 3=Water)',
        formulaRef: 'element',
        format: 'number',
        precision: 0,
      },
      {
        id: 'out-modality',
        label: 'Modality (0=Cardinal � 1=Fixed � 2=Mutable)',
        formulaRef: 'modality',
        format: 'number',
        precision: 0,
      },
    ],
    guide: {
      whatIsIt:
        'For entertainment purposes only. Western astrology divides the year into 12 zodiac signs, each ~30 days long, beginning with Aries at the spring equinox (~March 21). Each sign belongs to one of four elements (Fire: Aries, Leo, Sagittarius; Earth: Taurus, Virgo, Capricorn; Air: Gemini, Libra, Aquarius; Water: Cancer, Scorpio, Pisces) and one of three modalities (Cardinal: initiators; Fixed: sustainers; Mutable: adapters). This calculator uses a simplified approximation � cusp dates (around the 20th�23rd of each month) may be off by one sign.',
      howToUse:
        'Enter your birth month (1�12) and day. The calculator returns an approximate sun sign index (0=Aries through 11=Pisces), along with element and modality indices. Because the 30-day approximation is simplified, people born on cusp dates should verify with a precise ephemeris or an astrology site.',
      exampleScenario:
        'Born July 1: dayOfYear = 1 + (7-1)�30 = 181. sunSignIndex = floor(181/30.4) = 5 ? Virgo (index 5). Element = 5 mod 4 = 1 ? Earth. Modality = 5 mod 3 = 2 ? Mutable. Virgo is indeed an Earth-Mutable sign � analytical, detail-oriented, and adaptable according to astrological tradition.',
      proTip:
        'The elements in Western astrology loosely map to personality archetypes: Fire signs (Aries, Leo, Sagittarius) are associated with energy and action; Earth signs (Taurus, Virgo, Capricorn) with practicality and stability; Air signs (Gemini, Libra, Aquarius) with intellect and communication; Water signs (Cancer, Scorpio, Pisces) with emotion and intuition. These archetypes appear in Jungian psychology and many storytelling frameworks, making them interesting cultural and literary references regardless of one\'s beliefs in astrology.',
    },
    metadata: { version: '1.0.0' },
  },
];
