// ---------------------------------------------------------------------------
// Quantify � Advanced Clinical Calculators
// ---------------------------------------------------------------------------
// 10 advanced clinical reference calculators for medical education and
// clinical decision support reference.
//
// IMPORTANT DISCLAIMER: All calculators in this file are for educational and
// clinical reference only. Not a substitute for professional medical judgment.
// Always verify with current clinical guidelines and consult qualified
// healthcare providers.
// ---------------------------------------------------------------------------

import type { CalculatorSchema } from '@/types/calculator';

export const advancedClinicalCalculators: CalculatorSchema[] = [
  // =========================================================================
  // 1. IV Drip Rate Calculator
  // =========================================================================
  {
    id: 'iv-drip-rate-calculator',
    slug: 'iv-drip-rate-calculator',
    title: 'IV Drip Rate Calculator',
    description:
      'Calculate IV infusion rate in mL/hr and gravity drip rate in drops per minute (gtt/min) based on volume, time, and giving set drop factor.',
    icon: '💉',
    category: 'medical',
    subcategory: 'dosing',
    tags: ['iv drip', 'infusion rate', 'gtt/min', 'mL/hr', 'nursing', 'fluid therapy', 'giving set', 'iv therapy', 'drop factor'],
    inputs: [
      {
        id: 'volumeML',
        label: 'Volume to Infuse (mL)',
        type: 'number',
        defaultValue: 1000,
        min: 1,
        step: 50,
        required: true,
      },
      {
        id: 'timeHours',
        label: 'Infusion Time (hours)',
        type: 'number',
        defaultValue: 8,
        min: 0.1,
        step: 0.5,
        required: true,
      },
      {
        id: 'dropFactor',
        label: 'Drop Factor (gtt/mL)',
        type: 'select',
        options: [
          { label: '15 gtt/mL (standard)', value: '15' },
          { label: '20 gtt/mL (pediatric)', value: '20' },
          { label: '60 gtt/mL (microdrip)', value: '60' },
          { label: '10 gtt/mL', value: '10' },
        ],
        defaultValue: '15',
        helpText: 'Check the giving set packaging for the exact drop factor.',
      },
    ],
    formulas: [
      {
        id: 'mlPerHour',
        expression: 'volumeML / timeHours',
        dependencies: ['volumeML', 'timeHours'],
      },
      {
        id: 'mlPerMin',
        expression: 'mlPerHour / 60',
        dependencies: ['mlPerHour'],
      },
      {
        id: 'gttsPerMin',
        expression: 'mlPerMin * dropFactor',
        dependencies: ['mlPerMin', 'dropFactor'],
      },
    ],
    outputs: [
      {
        id: 'out-mlPerHour',
        label: 'Infusion Rate',
        formulaRef: 'mlPerHour',
        format: 'number',
        precision: 1,
        suffix: ' mL/hr',
        highlight: true,
      },
      {
        id: 'out-gttsPerMin',
        label: 'Drip Rate',
        formulaRef: 'gttsPerMin',
        format: 'number',
        precision: 0,
        suffix: ' gtts/min',
      },
      {
        id: 'out-mlPerMin',
        label: 'Flow Rate',
        formulaRef: 'mlPerMin',
        format: 'number',
        precision: 3,
        suffix: ' mL/min',
      },
    ],
    guide: {
      whatIsIt:
        'For educational and clinical reference only. Not a substitute for professional medical judgment. Always verify with current clinical guidelines and consult qualified healthcare providers. The IV Drip Rate Calculator determines the gravity infusion drip rate in drops per minute (gtt/min) and flow rate in mL/hr. Gravity infusions require manual counting of drops; the rate depends on the giving set drop factor stamped on the packaging (10, 15, 20, or 60 gtt/mL).',
      howToUse:
        'Enter the total volume to infuse (mL), the prescribed infusion time in hours, and select the drop factor from your giving set packaging. The calculator outputs the flow rate in mL/hr and the drops per minute to count using a watch.',
      exampleScenario:
        '1000 mL Normal Saline over 8 hours using a 15 gtt/mL giving set: mL/hr = 1000/8 = 125 mL/hr. mL/min = 125/60 = 2.083 mL/min. Drip rate = 2.083 � 15 = 31 gtt/min.',
      proTip:
        'For critical medications or accurate pediatric dosing always use an infusion pump rather than gravity drip. Gravity drip rates can vary �10% due to patient position, cannula tip position, and fluid viscosity. Use microdrip (60 gtt/mL) sets for volumes < 50 mL/hr for easier drop counting.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 2. Anion Gap Calculator
  // =========================================================================
  {
    id: 'anion-gap-calculator',
    slug: 'anion-gap-calculator',
    title: 'Anion Gap Calculator',
    description:
      'Calculate serum anion gap and albumin-corrected anion gap for metabolic acidosis workup, with delta-delta ratio for mixed disturbances.',
    icon: '🩸',
    category: 'medical',
    subcategory: 'vitals',
    tags: ['anion gap', 'metabolic acidosis', 'electrolytes', 'MUDPILES', 'albumin correction', 'delta ratio', 'ABG', 'acid-base'],
    inputs: [
      {
        id: 'sodium',
        label: 'Sodium [Na+] (mEq/L)',
        type: 'number',
        defaultValue: 140,
        min: 100,
        max: 180,
        required: true,
      },
      {
        id: 'chloride',
        label: 'Chloride [Cl-] (mEq/L)',
        type: 'number',
        defaultValue: 104,
        min: 60,
        max: 140,
        required: true,
      },
      {
        id: 'bicarbonate',
        label: 'Bicarbonate [HCO3-] (mEq/L)',
        type: 'number',
        defaultValue: 24,
        min: 1,
        max: 50,
        required: true,
      },
      {
        id: 'albumin',
        label: 'Albumin (g/dL)',
        type: 'number',
        defaultValue: 4,
        min: 0.1,
        max: 6,
        step: 0.1,
        helpText: 'Used for albumin-corrected AG. Normal = 4 g/dL.',
      },
    ],
    formulas: [
      {
        id: 'ag',
        expression: 'sodium - chloride - bicarbonate',
        dependencies: ['sodium', 'chloride', 'bicarbonate'],
      },
      {
        id: 'correctedAG',
        expression: 'ag + 2.5 * (4 - albumin)',
        dependencies: ['ag', 'albumin'],
      },
      {
        id: 'deltaRatio',
        expression: '(ag - 12) / (24 - bicarbonate)',
        dependencies: ['ag', 'bicarbonate'],
      },
    ],
    outputs: [
      {
        id: 'out-ag',
        label: 'Anion Gap',
        formulaRef: 'ag',
        format: 'number',
        precision: 1,
        suffix: ' mEq/L',
        highlight: true,
      },
      {
        id: 'out-correctedAG',
        label: 'Albumin-Corrected AG',
        formulaRef: 'correctedAG',
        format: 'number',
        precision: 1,
        suffix: ' mEq/L',
      },
      {
        id: 'out-deltaRatio',
        label: 'Delta-Delta Ratio',
        formulaRef: 'deltaRatio',
        format: 'number',
        precision: 2,
      },
    ],
    guide: {
      whatIsIt:
        'For educational and clinical reference only. Not a substitute for professional medical judgment. Always verify with current clinical guidelines and consult qualified healthcare providers. The anion gap (AG) reflects unmeasured anions in plasma: AG = Na+ - (Cl- + HCO3-). Normal range is 8�12 mEq/L. An elevated AG indicates accumulation of organic acids. The albumin-corrected AG adjusts for hypoalbuminemia (add 2.5 mEq/L per 1 g/dL drop in albumin below 4). Causes of elevated AG acidosis: MUDPILES � Methanol, Uremia, DKA, Propylene glycol, Isoniazid/Iron, Lactic acidosis, Ethylene glycol, Salicylates.',
      howToUse:
        'Enter the serum sodium, chloride, and bicarbonate values from the basic metabolic panel. Enter the serum albumin (default 4 g/dL). The calculator computes raw AG, albumin-corrected AG, and the delta-delta ratio to screen for mixed acid-base disorders.',
      exampleScenario:
        'Na 140, Cl 100, HCO3 15, Albumin 2.5 g/dL. Raw AG = 140 - 100 - 15 = 25 mEq/L (elevated). Corrected AG = 25 + 2.5�(4-2.5) = 25 + 3.75 = 28.75 mEq/L. Delta ratio = (25-12)/(24-15) = 13/9 = 1.44 (suggests pure AG acidosis with no concurrent metabolic alkalosis).',
      proTip:
        'Always use the albumin-corrected AG in critically ill patients � hypoalbuminemia can mask a true high-AG acidosis. A delta ratio <0.4 suggests normal-AG acidosis co-existing; >2 suggests metabolic alkalosis or chronic respiratory acidosis co-existing. Interpret the AG in the context of the full clinical picture and ABG.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 3. CHA2DS2-VASc Score
  // =========================================================================
  {
    id: 'chads2vasc-score',
    slug: 'chads2vasc-score',
    title: 'CHA2DS2-VASc Score (Atrial Fibrillation)',
    description:
      'Calculate the CHA2DS2-VASc stroke risk score for patients with non-valvular atrial fibrillation to guide anticoagulation therapy decisions.',
    icon: '❤',
    category: 'medical',
    subcategory: 'vitals',
    tags: ['CHA2DS2-VASc', 'atrial fibrillation', 'stroke risk', 'anticoagulation', 'AF', 'cardiology', 'thromboembolism'],
    inputs: [
      {
        id: 'chf',
        label: 'Congestive Heart Failure (1pt)',
        type: 'checkbox',
        defaultValue: false,
      },
      {
        id: 'hypertension',
        label: 'Hypertension (1pt)',
        type: 'checkbox',
        defaultValue: false,
      },
      {
        id: 'age75plus',
        label: 'Age =75 years (2pts)',
        type: 'checkbox',
        defaultValue: false,
      },
      {
        id: 'diabetes',
        label: 'Diabetes Mellitus (1pt)',
        type: 'checkbox',
        defaultValue: false,
      },
      {
        id: 'strokeTia',
        label: 'Prior Stroke/TIA (2pts)',
        type: 'checkbox',
        defaultValue: false,
      },
      {
        id: 'vascularDisease',
        label: 'Vascular Disease (1pt)',
        type: 'checkbox',
        defaultValue: false,
      },
      {
        id: 'age65to74',
        label: 'Age 65-74 years (1pt)',
        type: 'checkbox',
        defaultValue: false,
      },
      {
        id: 'femaleSex',
        label: 'Female Sex (1pt)',
        type: 'checkbox',
        defaultValue: false,
      },
    ],
    formulas: [
      {
        id: 'score',
        expression:
          '(chf ? 1 : 0) + (hypertension ? 1 : 0) + (age75plus ? 2 : 0) + (diabetes ? 1 : 0) + (strokeTia ? 2 : 0) + (vascularDisease ? 1 : 0) + (age65to74 ? 1 : 0) + (femaleSex ? 1 : 0)',
        dependencies: ['chf', 'hypertension', 'age75plus', 'diabetes', 'strokeTia', 'vascularDisease', 'age65to74', 'femaleSex'],
      },
      {
        id: 'annualStrokeRisk',
        expression:
          'score == 0 ? 0 : (score == 1 ? 1.3 : (score == 2 ? 2.2 : (score == 3 ? 3.2 : (score == 4 ? 4 : (score == 5 ? 6.7 : (score == 6 ? 9.8 : (score == 7 ? 9.6 : (score == 8 ? 12.5 : 15.2))))))))',
        dependencies: ['score'],
      },
    ],
    outputs: [
      {
        id: 'out-score',
        label: 'CHA2DS2-VASc Score',
        formulaRef: 'score',
        format: 'number',
        precision: 0,
        highlight: true,
      },
      {
        id: 'out-annualStrokeRisk',
        label: 'Estimated Annual Stroke Risk',
        formulaRef: 'annualStrokeRisk',
        format: 'number',
        precision: 1,
        suffix: '%/year',
      },
    ],
    guide: {
      whatIsIt:
        'For educational and clinical reference only. Not a substitute for professional medical judgment. Always verify with current clinical guidelines and consult qualified healthcare providers. The CHA2DS2-VASc score quantifies annual ischemic stroke risk in patients with non-valvular atrial fibrillation. Points are assigned for: Congestive heart failure (1), Hypertension (1), Age =75 (2), Diabetes (1), Stroke/TIA history (2), Vascular disease (1), Age 65�74 (1), Female sex (1). Maximum score = 9.',
      howToUse:
        'Check each risk factor that applies to the patient. The score and estimated annual stroke risk are computed automatically. Use the result alongside current ESC/AHA guidelines to guide anticoagulation decisions.',
      exampleScenario:
        'A 72-year-old female with hypertension and diabetes: Female (1) + Hypertension (1) + Diabetes (1) = Score 3. Estimated annual stroke risk � 3.2%/year. Guidelines suggest oral anticoagulation is indicated.',
      proTip:
        'Score 0 in males: no therapy needed. Score 1 in males: consider anticoagulation. Score =2 in males or =3 in females: anticoagulation recommended (NOAC preferred over warfarin). Always assess bleeding risk (HAS-BLED) before initiating therapy.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 4. eGFR Calculator (MDRD Formula)
  // =========================================================================
  {
    id: 'egfr-mdrd-calculator',
    slug: 'egfr-mdrd-calculator',
    title: 'eGFR Calculator (MDRD Formula)',
    description:
      'Estimate glomerular filtration rate using the 4-variable MDRD equation for chronic kidney disease staging based on serum creatinine, age, gender, and race.',
    icon: '🧪',
    category: 'medical',
    subcategory: 'vitals',
    tags: ['eGFR', 'MDRD', 'kidney function', 'creatinine', 'CKD staging', 'renal', 'GFR', 'nephrology'],
    inputs: [
      {
        id: 'creatinine',
        label: 'Serum Creatinine (mg/dL)',
        type: 'number',
        defaultValue: 1.0,
        min: 0.1,
        step: 0.01,
        required: true,
      },
      {
        id: 'age',
        label: 'Age (years)',
        type: 'number',
        defaultValue: 55,
        min: 18,
        max: 110,
        required: true,
      },
      {
        id: 'gender',
        label: 'Sex',
        type: 'select',
        options: [
          { label: 'Male', value: '1' },
          { label: 'Female', value: '0.742' },
        ],
        defaultValue: '1',
      },
      {
        id: 'race',
        label: 'Race',
        type: 'select',
        options: [
          { label: 'Non-Black', value: '1' },
          { label: 'Black/African American', value: '1.212' },
        ],
        defaultValue: '1',
        helpText: 'The race correction factor is from the original MDRD study cohort.',
      },
    ],
    formulas: [
      {
        id: 'egfr',
        expression: '175 * pow(creatinine, -1.154) * pow(age, -0.203) * gender * race',
        dependencies: ['creatinine', 'age', 'gender', 'race'],
      },
    ],
    outputs: [
      {
        id: 'out-egfr',
        label: 'eGFR (MDRD)',
        formulaRef: 'egfr',
        format: 'number',
        precision: 1,
        suffix: ' mL/min/1.73m�',
        highlight: true,
      },
    ],
    guide: {
      whatIsIt:
        'For educational and clinical reference only. Not a substitute for professional medical judgment. Always verify with current clinical guidelines and consult qualified healthcare providers. The MDRD (Modification of Diet in Renal Disease) formula estimates glomerular filtration rate (GFR) from serum creatinine. CKD stages: G1 =90 (normal), G2 60�89 (mildly decreased), G3a 45�59, G3b 30�44, G4 15�29, G5 <15 (kidney failure). Note: MDRD may underestimate GFR at higher levels; CKD-EPI is preferred for eGFR >60.',
      howToUse:
        'Enter the most recent serum creatinine in mg/dL, patient age, biological sex, and race. The MDRD eGFR is calculated automatically. Use IDMS-traceable creatinine assays for accurate results.',
      exampleScenario:
        'A 65-year-old non-Black male with creatinine 1.5 mg/dL: eGFR = 175 � 1.5^(-1.154) � 65^(-0.203) � 1 � 1 � 46 mL/min/1.73m� ? CKD Stage G3a.',
      proTip:
        'MDRD is validated for creatinine-stable CKD patients. Do not use in AKI, pregnancy, extremes of muscle mass (bodybuilders, amputees), or malnutrition. For drug dosing (e.g., renally-cleared antibiotics, DOACs, metformin), use absolute GFR = eGFR � BSA/1.73.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 5. MELD Score Calculator
  // =========================================================================
  {
    id: 'meld-score-calculator',
    slug: 'meld-score-calculator',
    title: 'MELD Score Calculator',
    description:
      'Calculate the Model for End-Stage Liver Disease (MELD) score for liver transplant priority and 90-day mortality prediction in cirrhotic patients.',
    icon: '📋',
    category: 'medical',
    subcategory: 'vitals',
    tags: ['MELD', 'liver disease', 'cirrhosis', 'transplant', 'hepatology', 'bilirubin', 'INR', 'creatinine'],
    inputs: [
      {
        id: 'bilirubin',
        label: 'Total Bilirubin (mg/dL)',
        type: 'number',
        defaultValue: 1.2,
        min: 0.1,
        step: 0.1,
        required: true,
      },
      {
        id: 'inr',
        label: 'INR',
        type: 'number',
        defaultValue: 1.1,
        min: 1,
        step: 0.01,
        required: true,
      },
      {
        id: 'creatinine',
        label: 'Serum Creatinine (mg/dL)',
        type: 'number',
        defaultValue: 1.0,
        min: 0.1,
        step: 0.01,
        helpText: 'Values >4.0 mg/dL are capped at 4.0 per UNOS policy.',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'bilTerm',
        expression: 'ln(max(bilirubin, 1)) * 3.78',
        dependencies: ['bilirubin'],
      },
      {
        id: 'inrTerm',
        expression: 'ln(max(inr, 1)) * 11.2',
        dependencies: ['inr'],
      },
      {
        id: 'crTerm',
        expression: 'ln(min(max(creatinine, 1), 4)) * 9.57',
        dependencies: ['creatinine'],
      },
      {
        id: 'meld',
        expression: 'round(bilTerm + inrTerm + crTerm + 6.43)',
        dependencies: ['bilTerm', 'inrTerm', 'crTerm'],
      },
      {
        id: 'mortalityRisk',
        expression: 'meld >= 40 ? 100 : (meld >= 30 ? 52.6 : (meld >= 20 ? 19.6 : (meld >= 10 ? 6 : 1.9)))',
        dependencies: ['meld'],
      },
    ],
    outputs: [
      {
        id: 'out-meld',
        label: 'MELD Score',
        formulaRef: 'meld',
        format: 'number',
        precision: 0,
        highlight: true,
      },
      {
        id: 'out-mortalityRisk',
        label: '90-Day Mortality (approx)',
        formulaRef: 'mortalityRisk',
        format: 'number',
        precision: 1,
        suffix: '%',
      },
    ],
    guide: {
      whatIsIt:
        'For educational and clinical reference only. Not a substitute for professional medical judgment. Always verify with current clinical guidelines and consult qualified healthcare providers. The MELD score (Model for End-Stage Liver Disease) is used by UNOS to prioritize liver transplant candidates. It is calculated from serum bilirubin, INR, and creatinine. Scores range from 6 to 40; higher scores indicate more severe disease and higher mortality risk.',
      howToUse:
        'Enter total bilirubin (mg/dL), INR, and serum creatinine (mg/dL). Values below 1.0 are floored to 1.0; creatinine is capped at 4.0 per UNOS policy. The calculator returns the rounded MELD score and approximate 90-day mortality.',
      exampleScenario:
        'Bilirubin 3.0, INR 1.8, Creatinine 1.5: bilTerm = ln(3)�3.78 = 4.15, inrTerm = ln(1.8)�11.2 = 6.60, crTerm = ln(1.5)�9.57 = 3.86. MELD = round(4.15+6.60+3.86+6.43) = 21. Approximate 90-day mortality � 19.6%.',
      proTip:
        'MELD-Na (which incorporates serum sodium) is now the primary UNOS allocation tool. MELD scores are recalculated every 1�3 months depending on score range. Patients with hepatocellular carcinoma may receive MELD exception points. Always obtain current values � even 24-hour-old labs can affect transplant priority.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 6. Wells' DVT Criteria Score
  // =========================================================================
  {
    id: 'wells-dvt-score',
    slug: 'wells-dvt-score',
    title: "Wells' DVT Criteria Score",
    description:
      "Calculate Wells' clinical prediction score for deep vein thrombosis (DVT) probability to guide imaging and D-dimer testing strategy.",
    icon: '🩹',
    category: 'medical',
    subcategory: 'vitals',
    tags: ['Wells score', 'DVT', 'deep vein thrombosis', 'venous thromboembolism', 'VTE', 'D-dimer', 'ultrasound', 'pre-test probability'],
    inputs: [
      {
        id: 'activeCancer',
        label: 'Active Cancer (1pt)',
        type: 'checkbox',
        defaultValue: false,
      },
      {
        id: 'paralysis',
        label: 'Paralysis/Paresis/Immobilization of legs (1pt)',
        type: 'checkbox',
        defaultValue: false,
      },
      {
        id: 'bedridden',
        label: 'Bedridden >3 days or Surgery <12 weeks (1pt)',
        type: 'checkbox',
        defaultValue: false,
      },
      {
        id: 'tenderVein',
        label: 'Tenderness along Deep Vein (1pt)',
        type: 'checkbox',
        defaultValue: false,
      },
      {
        id: 'swollenLeg',
        label: 'Entire Leg Swollen (1pt)',
        type: 'checkbox',
        defaultValue: false,
      },
      {
        id: 'calfSwelling',
        label: 'Calf Swelling >3cm compared to asymptomatic side (1pt)',
        type: 'checkbox',
        defaultValue: false,
      },
      {
        id: 'pittingEdema',
        label: 'Pitting Edema (1pt)',
        type: 'checkbox',
        defaultValue: false,
      },
      {
        id: 'collateralVeins',
        label: 'Collateral Superficial Veins (1pt)',
        type: 'checkbox',
        defaultValue: false,
      },
      {
        id: 'previousDVT',
        label: 'Previous DVT (1pt)',
        type: 'checkbox',
        defaultValue: false,
      },
      {
        id: 'alternativeDx',
        label: 'Alternative Dx as Likely as DVT (-2pts)',
        type: 'checkbox',
        defaultValue: false,
      },
    ],
    formulas: [
      {
        id: 'score',
        expression:
          '(activeCancer ? 1 : 0) + (paralysis ? 1 : 0) + (bedridden ? 1 : 0) + (tenderVein ? 1 : 0) + (swollenLeg ? 1 : 0) + (calfSwelling ? 1 : 0) + (pittingEdema ? 1 : 0) + (collateralVeins ? 1 : 0) + (previousDVT ? 1 : 0) - (alternativeDx ? 2 : 0)',
        dependencies: ['activeCancer', 'paralysis', 'bedridden', 'tenderVein', 'swollenLeg', 'calfSwelling', 'pittingEdema', 'collateralVeins', 'previousDVT', 'alternativeDx'],
      },
      {
        id: 'riskCategory',
        expression: 'score >= 3 ? 3 : (score >= 1 ? 2 : 1)',
        dependencies: ['score'],
      },
    ],
    outputs: [
      {
        id: 'out-score',
        label: "Wells' Score",
        formulaRef: 'score',
        format: 'number',
        precision: 0,
        highlight: true,
      },
      {
        id: 'out-riskCategory',
        label: 'DVT Risk (1=Low, 2=Moderate, 3=High)',
        formulaRef: 'riskCategory',
        format: 'number',
        precision: 0,
      },
    ],
    guide: {
      whatIsIt:
        "For educational and clinical reference only. Not a substitute for professional medical judgment. Always verify with current clinical guidelines and consult qualified healthcare providers. The Wells' DVT score is a validated clinical prediction rule for estimating the pre-test probability of deep vein thrombosis. It combines 9 positive criteria and 1 negative criterion. Score =0: Low probability (~5% DVT prevalence). Score 1�2: Moderate (~17%). Score =3: High (~53%).",
      howToUse:
        'Check all clinical criteria present in the patient. The score and risk category (Low/Moderate/High) are computed. Use alongside D-dimer testing: low probability + negative D-dimer effectively rules out DVT without imaging in most guidelines.',
      exampleScenario:
        'A patient with entire leg swelling (1), pitting edema (1), and previous DVT (1) but an alternative diagnosis is equally likely (-2): Score = 3-2 = 1 ? Moderate probability. Proceed with D-dimer and/or compression ultrasound.',
      proTip:
        "Wells' score has been validated in outpatient and ED settings. In high-probability patients, skip D-dimer and proceed directly to compression ultrasound. The YEARS algorithm and PEGeD trial have modified DVT/PE diagnostic pathways � ensure you apply the protocol relevant to your institution.",
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 7. QTc Interval Calculator
  // =========================================================================
  {
    id: 'qtc-interval-calculator',
    slug: 'qtc-interval-calculator',
    title: 'QTc Interval Calculator (Bazett & Fridericia)',
    description:
      'Correct the QT interval for heart rate using both Bazett and Fridericia formulas to assess risk of drug-induced QT prolongation and Torsades de Pointes.',
    icon: '💓',
    category: 'medical',
    subcategory: 'vitals',
    tags: ['QTc', 'QT interval', 'Bazett', 'Fridericia', 'ECG', 'Torsades de Pointes', 'TdP', 'drug-induced', 'arrhythmia'],
    inputs: [
      {
        id: 'qtMs',
        label: 'Measured QT Interval (ms)',
        type: 'number',
        defaultValue: 400,
        min: 200,
        max: 700,
        required: true,
      },
      {
        id: 'rrMs',
        label: 'RR Interval (ms)',
        type: 'number',
        defaultValue: 800,
        min: 300,
        max: 2000,
        helpText: 'Calculate as 60,000 � Heart Rate (bpm). e.g. HR 75 bpm = RR 800 ms.',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'rrSec',
        expression: 'rrMs / 1000',
        dependencies: ['rrMs'],
      },
      {
        id: 'qtSec',
        expression: 'qtMs / 1000',
        dependencies: ['qtMs'],
      },
      {
        id: 'qtcBazett',
        expression: 'qtSec / sqrt(rrSec) * 1000',
        dependencies: ['qtSec', 'rrSec'],
      },
      {
        id: 'qtcFridericia',
        expression: 'qtSec / pow(rrSec, 0.333) * 1000',
        dependencies: ['qtSec', 'rrSec'],
      },
    ],
    outputs: [
      {
        id: 'out-qtcBazett',
        label: 'QTc (Bazett)',
        formulaRef: 'qtcBazett',
        format: 'number',
        precision: 0,
        suffix: ' ms',
        highlight: true,
      },
      {
        id: 'out-qtcFridericia',
        label: 'QTc (Fridericia)',
        formulaRef: 'qtcFridericia',
        format: 'number',
        precision: 0,
        suffix: ' ms',
      },
    ],
    guide: {
      whatIsIt:
        'For educational and clinical reference only. Not a substitute for professional medical judgment. Always verify with current clinical guidelines and consult qualified healthcare providers. QTc is the heart-rate-corrected QT interval. The Bazett formula (QTc = QT/vRR) is most widely used but overestimates at high heart rates. Fridericia (QTc = QT/?RR) is more accurate across heart rates. Normal QTc: <440 ms (men), <450 ms (women). QTc >500 ms is associated with high risk of Torsades de Pointes (TdP).',
      howToUse:
        'Measure the QT interval from the start of the QRS to the end of the T-wave in ms (use lead II or V5). Calculate the RR interval as 60,000 � heart rate (bpm). Enter both values to get QTc by both formulas.',
      exampleScenario:
        'QT = 420 ms, HR = 60 bpm ? RR = 1000 ms. Bazett: 420/v1 = 420 ms (normal). HR = 100 bpm ? RR = 600 ms. Bazett: 420/v0.6 = 542 ms (high risk � same QT but tachycardic patient has much higher corrected QT).',
      proTip:
        'Many common drugs prolong QTc: antipsychotics (haloperidol, quetiapine), antibiotics (azithromycin, fluoroquinolones), antifungals (fluconazole), antiemetics (ondansetron), and methadone. Check CredibleMeds (www.crediblemeds.org) for comprehensive QT risk classifications. Always assess electrolytes (K+, Mg�+) as hypokalemia and hypomagnesemia potentiate QT prolongation.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 8. Morphine Milligram Equivalent (MME) Calculator
  // =========================================================================
  {
    id: 'mme-calculator',
    slug: 'mme-calculator',
    title: 'Morphine Milligram Equivalent (MME) Calculator',
    description:
      'Convert opioid doses to morphine milligram equivalents (MME/day) to assess total opioid burden and apply CDC prescribing guideline thresholds.',
    icon: '💊',
    category: 'medical',
    subcategory: 'dosing',
    tags: ['MME', 'opioid conversion', 'morphine equivalent', 'opioid safety', 'CDC guidelines', 'pain management', 'equianalgesic'],
    inputs: [
      {
        id: 'opioid',
        label: 'Opioid',
        type: 'select',
        options: [
          { label: 'Morphine (1.0)', value: '1' },
          { label: 'Oxycodone (1.5)', value: '1.5' },
          { label: 'Hydrocodone (1.0)', value: '1' },
          { label: 'Codeine (0.15)', value: '0.15' },
          { label: 'Tramadol (0.1)', value: '0.1' },
          { label: 'Fentanyl patch �g/hr (�2.4)', value: '2.4' },
          { label: 'Hydromorphone (4.0)', value: '4' },
          { label: 'Buprenorphine (30)', value: '30' },
        ],
        defaultValue: '1',
        helpText: 'Conversion factors per CDC 2022 guidelines. Fentanyl: enter �g/hr patch dose.',
      },
      {
        id: 'dailyDoseMg',
        label: 'Daily Dose (mg or mcg/hr for fentanyl)',
        type: 'number',
        defaultValue: 30,
        min: 0,
        step: 1,
        required: true,
      },
      {
        id: 'doses',
        label: 'Doses per Day',
        type: 'number',
        defaultValue: 3,
        min: 1,
        max: 24,
        helpText: 'Number of doses administered per day. Use 1 for extended-release or once-daily formulations.',
      },
    ],
    formulas: [
      {
        id: 'totalDailyMg',
        expression: 'dailyDoseMg * doses',
        dependencies: ['dailyDoseMg', 'doses'],
      },
      {
        id: 'mmeConversionFactor',
        expression: 'opioid',
        dependencies: ['opioid'],
      },
      {
        id: 'totalMME',
        expression: 'totalDailyMg * mmeConversionFactor',
        dependencies: ['totalDailyMg', 'mmeConversionFactor'],
      },
      {
        id: 'riskFlag',
        expression: 'totalMME >= 90 ? 2 : (totalMME >= 50 ? 1 : 0)',
        dependencies: ['totalMME'],
      },
    ],
    outputs: [
      {
        id: 'out-totalDailyMg',
        label: 'Total Daily Dose',
        formulaRef: 'totalDailyMg',
        format: 'number',
        precision: 1,
        suffix: ' mg/day',
      },
      {
        id: 'out-totalMME',
        label: 'Total Daily MME',
        formulaRef: 'totalMME',
        format: 'number',
        precision: 1,
        suffix: ' MME/day',
        highlight: true,
      },
      {
        id: 'out-riskFlag',
        label: 'CDC Risk Flag (0=Normal, 1=Caution =50, 2=High =90)',
        formulaRef: 'riskFlag',
        format: 'number',
        precision: 0,
      },
    ],
    guide: {
      whatIsIt:
        'For educational and clinical reference only. Not a substitute for professional medical judgment. Always verify with current clinical guidelines and consult qualified healthcare providers. Morphine Milligram Equivalents (MME) standardize opioid doses to a common unit for assessing total opioid burden. The 2022 CDC Clinical Practice Guideline recommends caution at =50 MME/day and careful evaluation at =90 MME/day due to overdose risk. MME factors vary by source; always verify against current institutional and national guidelines.',
      howToUse:
        'Select the opioid, enter the per-dose amount (mg for oral/parenteral, �g/hr for fentanyl patches), and the number of doses per day. For extended-release formulations (once daily), set doses per day to 1. The total daily MME and CDC risk tier are displayed.',
      exampleScenario:
        'Oxycodone IR 10 mg three times daily: totalDailyMg = 10�3 = 30 mg/day. MME = 30�1.5 = 45 MME/day (below 50 threshold). If increased to 15 mg TID: 45 mg � 1.5 = 67.5 MME/day ? Caution tier.',
      proTip:
        'Buprenorphine MME conversion is controversial; the 30� factor is approximate and may not reflect equianalgesic equivalence. Methadone has a complex, non-linear conversion that is NOT included here � always consult a pain or palliative care specialist. Do not use this calculator to make opioid rotation decisions without clinical expertise.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 9. Parkland Formula (Burn Fluid Resuscitation)
  // =========================================================================
  {
    id: 'parkland-formula-calculator',
    slug: 'parkland-formula-calculator',
    title: 'Parkland Formula (Burn Fluid Resuscitation)',
    description:
      "Calculate 24-hour Lactated Ringer's fluid resuscitation volumes for burn patients using the Parkland formula, with hourly infusion rates for first 8 and next 16 hours.",
    icon: '🔥',
    category: 'medical',
    subcategory: 'dosing',
    tags: ['Parkland formula', 'burn resuscitation', 'fluid therapy', 'TBSA', 'rule of nines', 'burns', 'critical care', 'trauma'],
    inputs: [
      {
        id: 'bodyWeightKg',
        label: 'Patient Weight (kg)',
        type: 'number',
        defaultValue: 70,
        min: 1,
        max: 300,
        required: true,
      },
      {
        id: 'tBSAPercent',
        label: 'Total Burn Surface Area (%)',
        type: 'number',
        defaultValue: 20,
        min: 0,
        max: 100,
        helpText: 'Use Rule of Nines to estimate: head 9%, each arm 9%, each leg 18%, anterior trunk 18%, posterior trunk 18%.',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'totalFluidML',
        expression: '4 * bodyWeightKg * tBSAPercent',
        dependencies: ['bodyWeightKg', 'tBSAPercent'],
      },
      {
        id: 'first8HrML',
        expression: 'totalFluidML / 2',
        dependencies: ['totalFluidML'],
      },
      {
        id: 'hourlyRate8Hr',
        expression: 'first8HrML / 8',
        dependencies: ['first8HrML'],
      },
      {
        id: 'next16HrML',
        expression: 'totalFluidML / 2',
        dependencies: ['totalFluidML'],
      },
      {
        id: 'hourlyRate16Hr',
        expression: 'next16HrML / 16',
        dependencies: ['next16HrML'],
      },
    ],
    outputs: [
      {
        id: 'out-totalFluidML',
        label: "Total 24-hr Fluid (Lactated Ringer's)",
        formulaRef: 'totalFluidML',
        format: 'number',
        precision: 0,
        suffix: ' mL',
        highlight: true,
      },
      {
        id: 'out-hourlyRate8Hr',
        label: 'Infusion Rate � First 8 Hours',
        formulaRef: 'hourlyRate8Hr',
        format: 'number',
        precision: 0,
        suffix: ' mL/hr',
      },
      {
        id: 'out-hourlyRate16Hr',
        label: 'Infusion Rate � Next 16 Hours',
        formulaRef: 'hourlyRate16Hr',
        format: 'number',
        precision: 0,
        suffix: ' mL/hr',
      },
    ],
    guide: {
      whatIsIt:
        "For educational and clinical reference only. Not a substitute for professional medical judgment. Always verify with current clinical guidelines and consult qualified healthcare providers. The Parkland formula estimates 24-hour IV fluid requirements for major burn resuscitation: Total fluid (mL) = 4 � weight (kg) � TBSA (%). Half is given in the first 8 hours from the time of burn (NOT hospital arrival), and the remaining half over the next 16 hours, using Lactated Ringer's solution. Include only 2nd and 3rd degree burns in TBSA estimation.",
      howToUse:
        'Enter patient weight in kg and TBSA percentage (use Rule of Nines or Lund-Browder chart). The calculator provides total fluid volume, hourly rate for the first 8 hours (from burn time), and hourly rate for the subsequent 16 hours. Adjust rates based on urine output (target 0.5�1 mL/kg/hr in adults, 1 mL/kg/hr in children).',
      exampleScenario:
        '70 kg adult with 30% TBSA burns: Total = 4�70�30 = 8400 mL. First 8 hrs: 4200 mL ? 525 mL/hr. Next 16 hrs: 4200 mL ? 263 mL/hr. If burn occurred 2 hours ago, you have 6 hours to give the first half � adjust rate to 4200/6 = 700 mL/hr.',
      proTip:
        "The Parkland formula is a starting point � not a rigid prescription. Over-resuscitation ('fluid creep') causes abdominal compartment syndrome and pulmonary edema. Use urine output as the primary endpoint; consider albumin supplementation after 12�24 hours if large volumes are required. The Modified Brooke formula (2 mL/kg/% TBSA) is an alternative used by some burn centers.",
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 10. Child-Pugh Score
  // =========================================================================
  {
    id: 'child-pugh-score',
    slug: 'child-pugh-score',
    title: 'Child-Pugh Score (Liver Cirrhosis)',
    description:
      'Classify liver disease severity in cirrhotic patients using the Child-Pugh score (A/B/C) based on bilirubin, albumin, INR, ascites, and hepatic encephalopathy.',
    icon: '📊',
    category: 'medical',
    subcategory: 'vitals',
    tags: ['Child-Pugh', 'cirrhosis', 'liver disease', 'hepatology', 'surgical risk', 'liver function', 'portal hypertension'],
    inputs: [
      {
        id: 'bilirubinClass',
        label: 'Total Bilirubin',
        type: 'select',
        options: [
          { label: '<2 mg/dL (1pt)', value: '1' },
          { label: '2�3 mg/dL (2pts)', value: '2' },
          { label: '>3 mg/dL (3pts)', value: '3' },
        ],
        defaultValue: '1',
      },
      {
        id: 'albuminClass',
        label: 'Serum Albumin',
        type: 'select',
        options: [
          { label: '>3.5 g/dL (1pt)', value: '1' },
          { label: '2.8�3.5 g/dL (2pts)', value: '2' },
          { label: '<2.8 g/dL (3pts)', value: '3' },
        ],
        defaultValue: '1',
      },
      {
        id: 'inrClass',
        label: 'INR / Prothrombin Time',
        type: 'select',
        options: [
          { label: '<1.7 (1pt)', value: '1' },
          { label: '1.7�2.3 (2pts)', value: '2' },
          { label: '>2.3 (3pts)', value: '3' },
        ],
        defaultValue: '1',
      },
      {
        id: 'ascitesClass',
        label: 'Ascites',
        type: 'select',
        options: [
          { label: 'None (1pt)', value: '1' },
          { label: 'Mild (2pts)', value: '2' },
          { label: 'Moderate�Severe (3pts)', value: '3' },
        ],
        defaultValue: '1',
      },
      {
        id: 'encephalopathyClass',
        label: 'Hepatic Encephalopathy',
        type: 'select',
        options: [
          { label: 'None (1pt)', value: '1' },
          { label: 'Grade I�II (2pts)', value: '2' },
          { label: 'Grade III�IV (3pts)', value: '3' },
        ],
        defaultValue: '1',
      },
    ],
    formulas: [
      {
        id: 'score',
        expression: 'bilirubinClass + albuminClass + inrClass + ascitesClass + encephalopathyClass',
        dependencies: ['bilirubinClass', 'albuminClass', 'inrClass', 'ascitesClass', 'encephalopathyClass'],
      },
      {
        id: 'classA',
        expression: 'score <= 6 ? 1 : 0',
        dependencies: ['score'],
      },
      {
        id: 'classB',
        expression: 'score >= 7 && score <= 9 ? 1 : 0',
        dependencies: ['score'],
      },
      {
        id: 'classC',
        expression: 'score >= 10 ? 1 : 0',
        dependencies: ['score'],
      },
    ],
    outputs: [
      {
        id: 'out-score',
        label: 'Child-Pugh Score',
        formulaRef: 'score',
        format: 'number',
        precision: 0,
        highlight: true,
      },
      {
        id: 'out-classA',
        label: 'Class A (5�6pts, well-compensated)',
        formulaRef: 'classA',
        format: 'number',
        precision: 0,
      },
      {
        id: 'out-classB',
        label: 'Class B (7�9pts, significant compromise)',
        formulaRef: 'classB',
        format: 'number',
        precision: 0,
      },
      {
        id: 'out-classC',
        label: 'Class C (=10pts, decompensated)',
        formulaRef: 'classC',
        format: 'number',
        precision: 0,
      },
    ],
    guide: {
      whatIsIt:
        'For educational and clinical reference only. Not a substitute for professional medical judgment. Always verify with current clinical guidelines and consult qualified healthcare providers. The Child-Pugh score quantifies liver disease severity in cirrhosis using five clinical parameters: bilirubin, albumin, INR/PT, ascites, and hepatic encephalopathy. Each is scored 1�3 (total 5�15). Class A (5�6): ~85% 1-year survival. Class B (7�9): ~60% 1-year survival. Class C (10�15): ~35% 1-year survival. Widely used for surgical risk stratification and guiding treatment intensity.',
      howToUse:
        'Select the appropriate tier for each of the five parameters based on current laboratory values and clinical findings. The total score and Child-Pugh class (A/B/C) are calculated automatically.',
      exampleScenario:
        'Bilirubin 3.5 mg/dL (3pts) + Albumin 3.0 g/dL (2pts) + INR 2.0 (2pts) + Mild ascites (2pts) + No encephalopathy (1pt) = Score 10 ? Class C. This patient has high surgical mortality risk and should be referred for transplant evaluation.',
      proTip:
        'The MELD score has largely replaced Child-Pugh for transplant prioritization, but Child-Pugh remains valuable for surgical risk stratification: Class A patients tolerate surgery relatively well; Class B requires careful optimization; Class C patients have very high perioperative mortality and elective surgery should be deferred. Always consider TIPS procedure, nutritional status, and infection control before any surgical intervention.',
    },
    metadata: { version: '1.0.0' },
  },
];
