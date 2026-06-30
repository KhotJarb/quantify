import type { CalculatorSchema } from '@/types/calculator';

export const healthCalculatorsPart1: CalculatorSchema[] = [
  // ─── 1. Body Surface Area (BSA) ────────────────────────────────────
  {
    id: 'body-surface-area',
    slug: 'body-surface-area',
    title: 'Body Surface Area (BSA)',
    description:
      'Estimate body surface area using the Du Bois & Du Bois formula (1916), widely used for drug dosing and clinical assessments.',
    icon: '📏',
    category: 'health',
    subcategory: 'body-metrics',
    tags: ['bsa', 'body surface area', 'du bois', 'clinical', 'dosing'],
    inputs: [
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
        id: 'height',
        label: 'Height',
        type: 'number',
        placeholder: 'e.g. 170',
        units: [
          { label: 'cm', value: 'cm' },
          { label: 'in', value: 'in', conversionFactor: '2.54' },
        ],
      },
    ],
    formulas: [
      {
        id: 'bsa',
        expression: '0.007184 * pow(weight, 0.425) * pow(height, 0.725)',
        dependencies: ['weight', 'height'],
      },
    ],
    outputs: [
      {
        id: 'bsaResult',
        label: 'Body Surface Area',
        formulaRef: 'bsa',
        precision: 4,
        suffix: ' m²',
        highlight: true,
      },
    ],
    guide: {
      whatIsIt: 'Body Surface Area (BSA) estimates the total external surface of your body in square metres using the Du Bois & Du Bois formula published in 1916. It is one of the most widely used clinical formulas for scaling drug doses — particularly chemotherapy — to an individual\'s body size.',
      howToUse: 'Enter your weight (kg or lb) and height (cm or in). The calculator applies BSA = 0.007184 × weight^0.425 × height^0.725 and returns the result in m².',
      exampleScenario: 'A 70 kg, 170 cm patient yields BSA ≈ 1.8232 m². If a chemotherapy protocol calls for 75 mg/m², the dose would be approximately 75 × 1.82 ≈ 137 mg.',
      proTip: 'Most oncology protocols cap BSA at 2.0 m² to avoid excessive toxicity. Always verify institutional BSA-capping policies before dosing chemotherapy.',
    },
    metadata: { version: '1.0.0' },
  },

  // ─── 2. Ideal Body Weight (Devine Formula) ─────────────────────────
  {
    id: 'ideal-body-weight',
    slug: 'ideal-body-weight',
    title: 'Ideal Body Weight (IBW)',
    description:
      'Calculate ideal body weight using the Devine formula (1974), the clinical standard for drug dosing and nutritional assessment.',
    icon: '🎯',
    category: 'health',
    subcategory: 'body-metrics',
    tags: ['ibw', 'ideal weight', 'devine', 'clinical', 'body weight'],
    inputs: [
      {
        id: 'height',
        label: 'Height',
        type: 'number',
        placeholder: 'e.g. 170',
        units: [
          { label: 'cm', value: 'cm' },
          { label: 'in', value: 'in', conversionFactor: '2.54' },
        ],
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
        id: 'heightIn',
        expression: 'height / 2.54',
        dependencies: ['height'],
      },
      {
        id: 'ibw',
        expression:
          'sex == 0 ? 50 + 2.3 * (heightIn - 60) : 45.5 + 2.3 * (heightIn - 60)',
        dependencies: ['heightIn', 'sex'],
      },
    ],
    outputs: [
      {
        id: 'ibwResult',
        label: 'Ideal Body Weight',
        formulaRef: 'ibw',
        precision: 1,
        suffix: ' kg',
        highlight: true,
      },
    ],
    guide: {
      whatIsIt: 'Ideal Body Weight (IBW) estimates a clinically "ideal" weight based on height and sex using the Devine formula (1974). It is the standard reference weight for tidal-volume ventilator settings, aminoglycoside dosing, and many other clinical protocols.',
      howToUse: 'Enter your height (cm or in) and select your biological sex. Males: IBW = 50 + 2.3 × (height_in − 60). Females: IBW = 45.5 + 2.3 × (height_in − 60).',
      exampleScenario: 'A male standing 5\'10" (70 in) has IBW = 50 + 2.3 × (70 − 60) = 73 kg. Lung-protective ventilation at 6–8 mL/kg IBW targets 438–584 mL tidal volume.',
      proTip: 'The Devine formula was originally designed for drug dosing, not as a health target. For patients under 5 ft (60 in), the formula produces negative adjustments — consider alternative formulas such as the Broca index.',
    },
    metadata: { version: '1.0.0' },
  },

  // ─── 3. Adjusted Body Weight ───────────────────────────────────────
  {
    id: 'adjusted-body-weight',
    slug: 'adjusted-body-weight',
    title: 'Adjusted Body Weight (ABW)',
    description:
      'Calculate adjusted body weight for obese patients, used in clinical pharmacokinetics for accurate drug dosing.',
    icon: '📊',
    category: 'health',
    subcategory: 'body-metrics',
    tags: ['abw', 'adjusted weight', 'obesity', 'pharmacokinetics', 'dosing'],
    inputs: [
      {
        id: 'weight',
        label: 'Actual Weight',
        type: 'number',
        placeholder: 'e.g. 120',
        units: [
          { label: 'kg', value: 'kg' },
          { label: 'lb', value: 'lb', conversionFactor: '0.453592' },
        ],
      },
      {
        id: 'height',
        label: 'Height',
        type: 'number',
        placeholder: 'e.g. 170',
        units: [
          { label: 'cm', value: 'cm' },
          { label: 'in', value: 'in', conversionFactor: '2.54' },
        ],
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
        id: 'heightIn',
        expression: 'height / 2.54',
        dependencies: ['height'],
      },
      {
        id: 'ibw',
        expression:
          'sex == 0 ? 50 + 2.3 * (heightIn - 60) : 45.5 + 2.3 * (heightIn - 60)',
        dependencies: ['heightIn', 'sex'],
      },
      {
        id: 'abw',
        expression: 'ibw + 0.4 * (weight - ibw)',
        dependencies: ['ibw', 'weight'],
      },
    ],
    outputs: [
      {
        id: 'ibwResult',
        label: 'Ideal Body Weight',
        formulaRef: 'ibw',
        precision: 1,
        suffix: ' kg',
      },
      {
        id: 'abwResult',
        label: 'Adjusted Body Weight',
        formulaRef: 'abw',
        precision: 1,
        suffix: ' kg',
        highlight: true,
      },
    ],
    guide: {
      whatIsIt: 'Adjusted Body Weight (ABW) corrects for excess adipose tissue in obese patients using ABW = IBW + 0.4 × (Actual Weight − IBW). It is used in clinical pharmacokinetics to determine more accurate drug doses for medications that partially distribute into fat.',
      howToUse: 'Enter your actual weight, height, and biological sex. The calculator first derives IBW via the Devine formula, then applies the 0.4 obesity adjustment factor to produce ABW.',
      exampleScenario: 'A female, 165 cm, 110 kg: IBW ≈ 57.0 kg. ABW = 57.0 + 0.4 × (110 − 57.0) = 57.0 + 21.2 = 78.2 kg. A vancomycin dose would be based on 78.2 kg rather than the full 110 kg.',
      proTip: 'The 0.4 adjustment factor is most validated for aminoglycosides and vancomycin. Other drugs (e.g., fluoroquinolones, heparin) may use different correction factors — always consult drug-specific pharmacokinetic guidelines.',
    },
    metadata: { version: '1.0.0' },
  },

  // ─── 4. Lean Body Mass (Boer Formula) ──────────────────────────────
  {
    id: 'lean-body-mass',
    slug: 'lean-body-mass',
    title: 'Lean Body Mass (LBM)',
    description:
      'Estimate lean body mass using the Boer formula (1984), separating fat-free mass from total body weight.',
    icon: '💪',
    category: 'health',
    subcategory: 'body-metrics',
    tags: ['lbm', 'lean mass', 'boer', 'fat free mass', 'body composition'],
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
        id: 'height',
        label: 'Height',
        type: 'number',
        placeholder: 'e.g. 175',
        units: [
          { label: 'cm', value: 'cm' },
          { label: 'in', value: 'in', conversionFactor: '2.54' },
        ],
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
        id: 'lbm',
        expression:
          'sex == 0 ? 0.407 * weight + 0.267 * height - 19.2 : 0.252 * weight + 0.473 * height - 48.3',
        dependencies: ['weight', 'height', 'sex'],
      },
      {
        id: 'fatMass',
        expression: 'weight - lbm',
        dependencies: ['weight', 'lbm'],
      },
      {
        id: 'lbmPct',
        expression: 'lbm / weight * 100',
        dependencies: ['lbm', 'weight'],
      },
    ],
    outputs: [
      {
        id: 'lbmResult',
        label: 'Lean Body Mass',
        formulaRef: 'lbm',
        precision: 1,
        suffix: ' kg',
        highlight: true,
      },
      {
        id: 'fatMassResult',
        label: 'Fat Mass',
        formulaRef: 'fatMass',
        precision: 1,
        suffix: ' kg',
      },
      {
        id: 'lbmPctResult',
        label: 'Lean Mass Percentage',
        formulaRef: 'lbmPct',
        precision: 1,
        suffix: '%',
      },
    ],
    guide: {
      whatIsIt: 'Lean Body Mass (LBM) estimates your fat-free mass — muscles, bones, organs, and water — using the Boer formula (1984). It separates what you weigh without fat from your total body weight, which is important for body composition analysis and anaesthesia dosing.',
      howToUse: 'Enter your weight (kg or lb), height (cm or in), and biological sex. Males: LBM = 0.407 × weight + 0.267 × height − 19.2. Females: LBM = 0.252 × weight + 0.473 × height − 48.3. The calculator also returns fat mass and lean mass percentage.',
      exampleScenario: 'A 75 kg, 175 cm male: LBM = 0.407 × 75 + 0.267 × 175 − 19.2 = 30.5 + 46.7 − 19.2 = 58.0 kg. Fat mass = 17.0 kg, lean percentage ≈ 77.3%.',
      proTip: 'The Boer formula is preferred over the James formula at higher body weights because it avoids the paradoxical decrease in LBM seen with James in obese individuals. For propofol and other lipophilic drug dosing, LBM-based calculations reduce the risk of overdose.',
    },
    metadata: { version: '1.0.0' },
  },

  // ─── 5. Body Fat Percentage (US Navy Method) ───────────────────────
  {
    id: 'body-fat-navy',
    slug: 'body-fat-navy',
    title: 'Body Fat % (US Navy Method)',
    description:
      'Estimate body fat percentage using the US Navy circumference method (Hodgdon & Beckett, 1984), validated against hydrostatic weighing.',
    icon: '📉',
    category: 'health',
    subcategory: 'body-metrics',
    tags: [
      'body fat',
      'navy method',
      'circumference',
      'body composition',
      'fat percentage',
    ],
    inputs: [
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
      {
        id: 'height',
        label: 'Height',
        type: 'number',
        placeholder: 'e.g. 175',
        helpText: 'Total standing height',
        units: [
          { label: 'cm', value: 'cm' },
          { label: 'in', value: 'in', conversionFactor: '2.54' },
        ],
      },
      {
        id: 'waist',
        label: 'Waist Circumference',
        type: 'number',
        placeholder: 'e.g. 85',
        helpText: 'Measured at navel level',
        units: [
          { label: 'cm', value: 'cm' },
          { label: 'in', value: 'in', conversionFactor: '2.54' },
        ],
      },
      {
        id: 'neck',
        label: 'Neck Circumference',
        type: 'number',
        placeholder: 'e.g. 38',
        units: [
          { label: 'cm', value: 'cm' },
          { label: 'in', value: 'in', conversionFactor: '2.54' },
        ],
      },
      {
        id: 'hip',
        label: 'Hip Circumference',
        type: 'number',
        placeholder: 'e.g. 100',
        helpText: 'Required for female calculation; enter 0 if male',
        units: [
          { label: 'cm', value: 'cm' },
          { label: 'in', value: 'in', conversionFactor: '2.54' },
        ],
      },
    ],
    formulas: [
      {
        id: 'maleResult',
        expression:
          '86.010 * log(waist - neck) - 70.041 * log(height) + 36.76',
        dependencies: ['waist', 'neck', 'height'],
      },
      {
        id: 'femaleResult',
        expression:
          '163.205 * log(waist + hip - neck) - 97.684 * log(height) - 78.387',
        dependencies: ['waist', 'hip', 'neck', 'height'],
      },
      {
        id: 'bodyFat',
        expression: 'sex == 0 ? maleResult : femaleResult',
        dependencies: ['sex', 'maleResult', 'femaleResult'],
      },
    ],
    outputs: [
      {
        id: 'bodyFatResult',
        label: 'Body Fat Percentage',
        formulaRef: 'bodyFat',
        precision: 1,
        suffix: '%',
        highlight: true,
      },
    ],
    guide: {
      whatIsIt: 'This calculator estimates body fat percentage using the US Navy circumference method developed by Hodgdon & Beckett (1984). It uses simple tape-measure readings of waist, neck, and hip circumferences and has been validated against hydrostatic (underwater) weighing.',
      howToUse: 'Select your biological sex, then enter height, waist circumference (at navel), neck circumference, and hip circumference (females only — males may enter 0 for hip). The formula uses logarithmic equations calibrated separately for each sex.',
      exampleScenario: 'A male with height 175 cm, waist 85 cm, neck 38 cm: BF% = 86.01 × log₁₀(85 − 38) − 70.04 × log₁₀(175) + 36.76 ≈ 18.6%. This falls within the "fitness" category for adult males.',
      proTip: 'Measure waist at the navel and neck at the narrowest point for consistency. Take all measurements on bare skin, not over clothing, and measure three times to average out variation. This method is most accurate for body fat ranges of 10–35%.',
    },
    metadata: { version: '1.0.0' },
  },

  // ─── 6. Body Adiposity Index (BAI) ─────────────────────────────────
  {
    id: 'body-adiposity-index',
    slug: 'body-adiposity-index',
    title: 'Body Adiposity Index (BAI)',
    description:
      'Estimate body adiposity without body weight using the Bergman formula (Obesity, 2011). Uses hip circumference and height only.',
    icon: '📐',
    category: 'health',
    subcategory: 'body-metrics',
    tags: ['bai', 'body adiposity', 'bergman', 'body fat', 'no scale'],
    inputs: [
      {
        id: 'hip',
        label: 'Hip Circumference',
        type: 'number',
        placeholder: 'e.g. 100',
        units: [
          { label: 'cm', value: 'cm' },
          { label: 'in', value: 'in', conversionFactor: '2.54' },
        ],
      },
      {
        id: 'height',
        label: 'Height',
        type: 'number',
        placeholder: 'e.g. 170',
        units: [
          { label: 'cm', value: 'cm' },
          { label: 'in', value: 'in', conversionFactor: '2.54' },
        ],
      },
    ],
    formulas: [
      {
        id: 'heightM',
        expression: 'height / 100',
        dependencies: ['height'],
      },
      {
        id: 'bai',
        expression: 'hip / pow(heightM, 1.5) - 18',
        dependencies: ['hip', 'heightM'],
      },
    ],
    outputs: [
      {
        id: 'baiResult',
        label: 'Body Adiposity Index',
        formulaRef: 'bai',
        precision: 1,
        suffix: '%',
        highlight: true,
      },
    ],
    guide: {
      whatIsIt: 'The Body Adiposity Index (BAI) estimates body fat percentage without needing a scale, using only hip circumference and height. It was developed by Bergman et al. (Obesity, 2011) as an alternative to BMI that more directly approximates adiposity.',
      howToUse: 'Enter your hip circumference (cm or in) and height (cm or in). The formula is BAI = (hip ÷ height_m^1.5) − 18, where the result directly approximates body fat percentage.',
      exampleScenario: 'A person with a hip circumference of 100 cm and height of 170 cm (1.70 m): BAI = 100 ÷ 1.70^1.5 − 18 = 100 ÷ 2.215 − 18 ≈ 27.2% body fat.',
      proTip: 'BAI was originally validated in Mexican-American and African-American populations and may be less accurate in other ethnic groups. Unlike BMI, it does not require body weight, making it useful in field settings where a scale is unavailable.',
    },
    metadata: { version: '1.0.0' },
  },

  // ─── 7. Waist-to-Hip Ratio (WHR) ──────────────────────────────────
  {
    id: 'waist-to-hip-ratio',
    slug: 'waist-to-hip-ratio',
    title: 'Waist-to-Hip Ratio (WHR)',
    description:
      'Calculate waist-to-hip ratio, a WHO-endorsed indicator of abdominal obesity and cardiovascular risk.',
    icon: '🔄',
    category: 'health',
    subcategory: 'body-metrics',
    tags: ['whr', 'waist hip', 'cardiovascular risk', 'obesity', 'who'],
    inputs: [
      {
        id: 'waist',
        label: 'Waist Circumference',
        type: 'number',
        placeholder: 'e.g. 85',
        units: [
          { label: 'cm', value: 'cm' },
          { label: 'in', value: 'in', conversionFactor: '2.54' },
        ],
      },
      {
        id: 'hip',
        label: 'Hip Circumference',
        type: 'number',
        placeholder: 'e.g. 100',
        units: [
          { label: 'cm', value: 'cm' },
          { label: 'in', value: 'in', conversionFactor: '2.54' },
        ],
      },
    ],
    formulas: [
      {
        id: 'whr',
        expression: 'waist / hip',
        dependencies: ['waist', 'hip'],
      },
    ],
    outputs: [
      {
        id: 'whrResult',
        label: 'Waist-to-Hip Ratio',
        formulaRef: 'whr',
        precision: 3,
        highlight: true,
      },
    ],
    guide: {
      whatIsIt: 'The Waist-to-Hip Ratio (WHR) is a WHO-endorsed anthropometric measure that compares waist circumference to hip circumference. It identifies abdominal (central) obesity, a key independent risk factor for cardiovascular disease, type 2 diabetes, and metabolic syndrome.',
      howToUse: 'Enter your waist circumference (at the narrowest point, typically at the navel) and hip circumference (at the widest point of the buttocks), both in the same unit. WHR = waist ÷ hip.',
      exampleScenario: 'A woman with waist 80 cm and hips 100 cm has WHR = 0.800. Since this is below the WHO high-risk threshold of 0.85 for females, her abdominal fat distribution is in the low-risk zone.',
      proTip: 'WHO defines elevated cardiovascular risk as WHR > 0.90 for males and > 0.85 for females. WHR captures visceral fat risk that BMI misses — a person with a normal BMI can still have a high WHR indicating dangerous abdominal fat distribution.',
    },
    metadata: { version: '1.0.0' },
  },

  // ─── 8. Waist-to-Height Ratio (WHtR) ──────────────────────────────
  {
    id: 'waist-to-height-ratio',
    slug: 'waist-to-height-ratio',
    title: 'Waist-to-Height Ratio (WHtR)',
    description:
      'Calculate waist-to-height ratio, a simple predictor of cardiometabolic risk. A value ≥ 0.5 indicates increased health risk (Ashwell & Hsieh, 2005).',
    icon: '📏',
    category: 'health',
    subcategory: 'body-metrics',
    tags: ['whtr', 'waist height', 'cardiometabolic', 'health risk', 'screening'],
    inputs: [
      {
        id: 'waist',
        label: 'Waist Circumference',
        type: 'number',
        placeholder: 'e.g. 85',
        units: [
          { label: 'cm', value: 'cm' },
          { label: 'in', value: 'in', conversionFactor: '2.54' },
        ],
      },
      {
        id: 'height',
        label: 'Height',
        type: 'number',
        placeholder: 'e.g. 170',
        units: [
          { label: 'cm', value: 'cm' },
          { label: 'in', value: 'in', conversionFactor: '2.54' },
        ],
      },
    ],
    formulas: [
      {
        id: 'whtr',
        expression: 'waist / height',
        dependencies: ['waist', 'height'],
      },
    ],
    outputs: [
      {
        id: 'whtrResult',
        label: 'Waist-to-Height Ratio',
        formulaRef: 'whtr',
        precision: 3,
        highlight: true,
      },
    ],
    guide: {
      whatIsIt: 'The Waist-to-Height Ratio (WHtR) is a simple cardiometabolic risk screening tool popularised by Ashwell & Hsieh (2005). It divides waist circumference by height and uses a universal boundary value of 0.5 — applicable across age, sex, and ethnicity — to flag increased health risk.',
      howToUse: 'Enter your waist circumference and height in the same unit system. WHtR = waist ÷ height. A result ≥ 0.5 signals increased cardiometabolic risk.',
      exampleScenario: 'An adult with waist 88 cm and height 175 cm: WHtR = 88 ÷ 175 = 0.503. This just exceeds the 0.5 threshold, indicating mildly increased cardiometabolic risk and a prompt to investigate further.',
      proTip: 'WHtR outperforms BMI in predicting cardiovascular outcomes in several meta-analyses. The "keep your waist to less than half your height" message works across all populations, making it one of the simplest and most inclusive screening tools available.',
    },
    metadata: { version: '1.0.0' },
  },

  // ─── 9. Total Body Water (Watson Formula) ──────────────────────────
  {
    id: 'total-body-water',
    slug: 'total-body-water',
    title: 'Total Body Water (TBW)',
    description:
      'Estimate total body water volume using the Watson formula (Am J Clin Nutr, 1980), used in fluid balance and dialysis planning.',
    icon: '💧',
    category: 'health',
    subcategory: 'body-metrics',
    tags: ['tbw', 'total body water', 'watson', 'fluid balance', 'hydration'],
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
        id: 'height',
        label: 'Height',
        type: 'number',
        placeholder: 'e.g. 175',
        units: [
          { label: 'cm', value: 'cm' },
          { label: 'in', value: 'in', conversionFactor: '2.54' },
        ],
      },
      {
        id: 'age',
        label: 'Age',
        type: 'number',
        placeholder: 'e.g. 30',
        min: 18,
        max: 100,
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
        id: 'tbw',
        expression:
          'sex == 0 ? 2.447 - 0.09156 * age + 0.1074 * height + 0.3362 * weight : -2.097 + 0.1069 * height + 0.2466 * weight',
        dependencies: ['sex', 'age', 'height', 'weight'],
      },
      {
        id: 'tbwPct',
        expression: 'tbw / weight * 100',
        dependencies: ['tbw', 'weight'],
      },
    ],
    outputs: [
      {
        id: 'tbwResult',
        label: 'Total Body Water',
        formulaRef: 'tbw',
        precision: 1,
        suffix: ' L',
        highlight: true,
      },
      {
        id: 'tbwPctResult',
        label: 'Body Water Percentage',
        formulaRef: 'tbwPct',
        precision: 1,
        suffix: '%',
      },
    ],
    guide: {
      whatIsIt: 'Total Body Water (TBW) estimates the volume of water in your body using the Watson formula (Am J Clin Nutr, 1980). Water typically accounts for 50–65% of body weight and is critical for fluid balance, renal dosing, dialysis planning, and electrolyte management.',
      howToUse: 'Enter your weight (kg or lb), height (cm or in), age, and biological sex. Males: TBW = 2.447 − 0.09156 × age + 0.1074 × height + 0.3362 × weight. Females: TBW = −2.097 + 0.1069 × height + 0.2466 × weight.',
      exampleScenario: 'A 30-year-old male, 75 kg, 175 cm: TBW = 2.447 − 0.09156 × 30 + 0.1074 × 175 + 0.3362 × 75 = 2.447 − 2.747 + 18.795 + 25.215 = 43.7 L (≈ 58.3% of body weight).',
      proTip: 'TBW is essential for calculating free-water deficit in hypernatraemia: deficit = TBW × ([Na⁺]/140 − 1). In dialysis, TBW helps set ultrafiltration targets. Remember that TBW decreases with age and higher body fat percentages.',
    },
    metadata: { version: '1.0.0' },
  },

  // ─── 10. TDEE (Harris-Benedict Revised) ────────────────────────────
  {
    id: 'tdee-harris-benedict',
    slug: 'tdee-harris-benedict',
    title: 'Total Daily Energy Expenditure (TDEE)',
    description:
      'Estimate total daily energy expenditure using the revised Harris-Benedict equation (Roza & Shizgal, Am J Clin Nutr, 1984) multiplied by an activity factor.',
    icon: '🔥',
    category: 'health',
    subcategory: 'nutrition',
    tags: [
      'tdee',
      'harris benedict',
      'energy expenditure',
      'calories',
      'bmr',
      'metabolism',
    ],
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
        id: 'height',
        label: 'Height',
        type: 'number',
        placeholder: 'e.g. 175',
        units: [
          { label: 'cm', value: 'cm' },
          { label: 'in', value: 'in', conversionFactor: '2.54' },
        ],
      },
      {
        id: 'age',
        label: 'Age',
        type: 'number',
        placeholder: 'e.g. 30',
        min: 15,
        max: 100,
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
      {
        id: 'activityLevel',
        label: 'Activity Level',
        type: 'select',
        options: [
          { label: 'Sedentary (little/no exercise)', value: '1.2' },
          { label: 'Light (1-3 days/week)', value: '1.375' },
          { label: 'Moderate (3-5 days/week)', value: '1.55' },
          { label: 'Active (6-7 days/week)', value: '1.725' },
          { label: 'Very Active (2x/day)', value: '1.9' },
        ],
        defaultValue: '1.2',
      },
    ],
    formulas: [
      {
        id: 'bmr',
        expression:
          'sex == 0 ? 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age : 447.593 + 9.247 * weight + 3.098 * height - 4.330 * age',
        dependencies: ['sex', 'weight', 'height', 'age'],
      },
      {
        id: 'tdee',
        expression: 'bmr * activityLevel',
        dependencies: ['bmr', 'activityLevel'],
      },
    ],
    outputs: [
      {
        id: 'bmrResult',
        label: 'Basal Metabolic Rate',
        formulaRef: 'bmr',
        precision: 0,
        suffix: ' kcal/day',
      },
      {
        id: 'tdeeResult',
        label: 'Total Daily Energy Expenditure',
        formulaRef: 'tdee',
        precision: 0,
        suffix: ' kcal/day',
        highlight: true,
      },
    ],
    guide: {
      whatIsIt: 'Total Daily Energy Expenditure (TDEE) estimates how many calories you burn per day by combining your Basal Metabolic Rate (BMR) from the revised Harris-Benedict equation (Roza & Shizgal, 1984) with a physical-activity multiplier. It is the foundation of any calorie-based diet plan.',
      howToUse: 'Enter your weight, height, age, biological sex, and select an activity level from sedentary (1.2×) to very active (1.9×). The calculator first computes BMR, then multiplies it by your activity factor to produce TDEE.',
      exampleScenario: 'A 30-year-old, 75 kg, 175 cm male with moderate activity (1.55×): BMR = 88.362 + 13.397 × 75 + 4.799 × 175 − 5.677 × 30 ≈ 1,763 kcal/day. TDEE = 1,763 × 1.55 ≈ 2,733 kcal/day.',
      proTip: 'To lose roughly 0.5 kg/week, subtract ~500 kcal from your TDEE. Be honest about activity level — most desk workers overestimate and should choose "Sedentary" or "Light." Recalculate every 5–10 kg of weight change, as BMR shifts with body mass.',
    },
    metadata: { version: '1.0.0' },
  },

  // ─── 11. Macronutrient Distribution ────────────────────────────────
  {
    id: 'macronutrient-calculator',
    slug: 'macronutrient-calculator',
    title: 'Macronutrient Distribution',
    description:
      'Break down your daily caloric intake into precise grams and calories of protein, carbohydrates, and fat using standard Atwater factors (4/4/9 kcal per gram).',
    icon: '🥗',
    category: 'health',
    subcategory: 'nutrition',
    tags: [
      'macros',
      'macronutrient',
      'protein',
      'carbs',
      'fat',
      'nutrition',
      'diet',
    ],
    inputs: [
      {
        id: 'calories',
        label: 'Daily Calories',
        type: 'number',
        placeholder: 'e.g. 2000',
        min: 500,
        max: 10000,
        helpText: 'Total daily caloric target',
      },
      {
        id: 'proteinPct',
        label: 'Protein %',
        type: 'range',
        min: 5,
        max: 60,
        step: 1,
        defaultValue: 30,
      },
      {
        id: 'carbPct',
        label: 'Carbohydrate %',
        type: 'range',
        min: 5,
        max: 80,
        step: 1,
        defaultValue: 40,
      },
      {
        id: 'fatPct',
        label: 'Fat %',
        type: 'range',
        min: 5,
        max: 70,
        step: 1,
        defaultValue: 30,
      },
    ],
    formulas: [
      {
        id: 'proteinCal',
        expression: 'calories * proteinPct / 100',
        dependencies: ['calories', 'proteinPct'],
      },
      {
        id: 'carbCal',
        expression: 'calories * carbPct / 100',
        dependencies: ['calories', 'carbPct'],
      },
      {
        id: 'fatCal',
        expression: 'calories * fatPct / 100',
        dependencies: ['calories', 'fatPct'],
      },
      {
        id: 'proteinG',
        expression: 'proteinCal / 4',
        dependencies: ['proteinCal'],
      },
      {
        id: 'carbG',
        expression: 'carbCal / 4',
        dependencies: ['carbCal'],
      },
      {
        id: 'fatG',
        expression: 'fatCal / 9',
        dependencies: ['fatCal'],
      },
    ],
    outputs: [
      {
        id: 'proteinGrams',
        label: 'Protein',
        formulaRef: 'proteinG',
        precision: 0,
        suffix: ' g',
        highlight: true,
      },
      {
        id: 'proteinCalories',
        label: 'Protein Calories',
        formulaRef: 'proteinCal',
        precision: 0,
        suffix: ' kcal',
      },
      {
        id: 'carbGrams',
        label: 'Carbohydrates',
        formulaRef: 'carbG',
        precision: 0,
        suffix: ' g',
        highlight: true,
      },
      {
        id: 'carbCalories',
        label: 'Carb Calories',
        formulaRef: 'carbCal',
        precision: 0,
        suffix: ' kcal',
      },
      {
        id: 'fatGrams',
        label: 'Fat',
        formulaRef: 'fatG',
        precision: 0,
        suffix: ' g',
        highlight: true,
      },
      {
        id: 'fatCalories',
        label: 'Fat Calories',
        formulaRef: 'fatCal',
        precision: 0,
        suffix: ' kcal',
      },
    ],
    guide: {
      whatIsIt: 'The Macronutrient Distribution calculator splits your daily calorie target into precise grams and calories of protein, carbohydrates, and fat using the standard Atwater energy factors: protein 4 kcal/g, carbohydrate 4 kcal/g, and fat 9 kcal/g.',
      howToUse: 'Enter your total daily calorie target, then adjust the percentage sliders for protein, carbohydrate, and fat. The calculator converts each percentage into both calories and grams. Make sure your three percentages sum to 100% for a balanced plan.',
      exampleScenario: 'On a 2,000 kcal diet with a 30/40/30 split: Protein = 600 kcal ÷ 4 = 150 g, Carbs = 800 kcal ÷ 4 = 200 g, Fat = 600 kcal ÷ 9 ≈ 67 g. This balanced ratio suits most general fitness goals.',
      proTip: 'For muscle gain, increase protein to 1.6–2.2 g/kg body weight (often 30–35% of calories). For endurance athletes, prioritise carbohydrates at 50–60%. Fat should rarely drop below 20% to maintain hormone health. Use this calculator alongside TDEE for a complete nutrition blueprint.',
    },
    metadata: { version: '1.0.0' },
  },
];
