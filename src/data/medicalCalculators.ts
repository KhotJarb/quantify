// ---------------------------------------------------------------------------
// Quantify — Medical Reference Calculators
// ---------------------------------------------------------------------------
// 10 clinical reference calculators covering dosing, vitals, and scoring
// tools for healthcare education and reference purposes.
//
// IMPORTANT DISCLAIMER: All calculators in this file are for educational and
// reference purposes only. All clinical decisions must be made by qualified
// healthcare professionals. These tools do not constitute medical advice.
// ---------------------------------------------------------------------------

import type { CalculatorSchema } from '@/types/calculator';

export const medicalCalculators: CalculatorSchema[] = [
  // =========================================================================
  // 51. Pediatric Drug Dosage (mg/kg)
  // =========================================================================
  {
    id: 'pediatric-dosage',
    slug: 'pediatric-dosage',
    title: 'Pediatric Drug Dosage Calculator (mg/kg)',
    description:
      'Calculate single-dose and total daily drug doses for paediatric patients based on weight and mg/kg prescription, with liquid volume per dose.',
    icon: '💊',
    category: 'medical',
    subcategory: 'dosing',
    tags: ['pediatric', 'dosage', 'mg/kg', 'drug dose', 'children', 'liquid medication', 'pharmacy'],
    inputs: [
      {
        id: 'weightKg',
        label: 'Child Weight (kg)',
        type: 'number',
        defaultValue: 20,
        min: 0.5,
        max: 200,
        step: 0.1,
        helpText: 'Child weight in kilograms. Use calibrated scale for accurate dosing.',
        required: true,
      },
      {
        id: 'dosePerKg',
        label: 'Prescribed Dose (mg/kg per dose)',
        type: 'number',
        defaultValue: 10,
        min: 0.01,
        step: 0.01,
        helpText: 'Dose in mg per kg body weight per individual dose — from prescriber or formulary',
        required: true,
      },
      {
        id: 'frequency',
        label: 'Dosing Frequency',
        type: 'select',
        options: [
          { label: 'Once daily (q24h)', value: '1' },
          { label: 'Twice daily (q12h)', value: '2' },
          { label: 'Three times daily (q8h)', value: '3' },
          { label: 'Four times daily (q6h)', value: '4' },
        ],
        defaultValue: '3',
        helpText: 'How many doses per day as prescribed',
      },
      {
        id: 'concentration',
        label: 'Liquid Concentration (mg/mL)',
        type: 'number',
        defaultValue: 50,
        min: 0.01,
        step: 0.01,
        helpText: 'Concentration of liquid formulation. Example: Amoxicillin 250mg/5mL = 50 mg/mL.',
        required: true,
      },
    ],
    formulas: [
      {
        // Single dose = weight x dose per kg
        id: 'singleDose',
        expression: 'weightKg * dosePerKg',
        dependencies: ['weightKg', 'dosePerKg'],
      },
      {
        // Total daily dose = single dose x frequency
        id: 'totalDailyDose',
        expression: 'weightKg * dosePerKg * frequency',
        dependencies: ['weightKg', 'dosePerKg', 'frequency'],
      },
      {
        // Volume per dose = dose (mg) / concentration (mg/mL)
        id: 'volumePerDose',
        expression: 'singleDose / concentration',
        dependencies: ['singleDose', 'concentration'],
      },
      {
        id: 'volumePerDoseMl',
        expression: 'volumePerDose',
        dependencies: ['volumePerDose'],
      },
    ],
    outputs: [
      {
        id: 'out-singleDose',
        label: 'Single Dose',
        formulaRef: 'singleDose',
        format: 'number',
        precision: 1,
        suffix: ' mg',
        highlight: true,
      },
      {
        id: 'out-totalDailyDose',
        label: 'Total Daily Dose',
        formulaRef: 'totalDailyDose',
        format: 'number',
        precision: 1,
        suffix: ' mg/day',
      },
      {
        id: 'out-volumePerDoseMl',
        label: 'Volume per Dose (liquid)',
        formulaRef: 'volumePerDoseMl',
        format: 'number',
        precision: 2,
        suffix: ' mL',
      },
    ],
    guide: {
      whatIsIt:
        'DISCLAIMER: For educational and reference purposes only. All clinical decisions must be made by qualified healthcare professionals. This calculator computes paediatric drug doses based on the mg/kg dosing method, which accounts for the wide variation in drug distribution, metabolism, and elimination across different body weights in children. The result includes single-dose amount in mg, total daily dose, and the volume to administer when using a liquid formulation.',
      howToUse:
        'Enter the child weight in kg, the prescribed dose in mg/kg per dose (from the prescriber order or formulary), the dosing frequency, and the concentration of the liquid preparation. Always verify the prescribed dose against the formulary maximum and the specific indication. Cross-check with a pharmacist before administering.',
      exampleScenario:
        'A 20 kg child prescribed amoxicillin 25 mg/kg/day in 3 divided doses (TID), using 250mg/5mL suspension (50 mg/mL). Single dose = 20 x (25/3) = 166.7 mg. Total daily dose = 20 x 25 = 500 mg. Volume per dose = 166.7 / 50 = 3.33 mL. Round to nearest 0.1 mL using an oral syringe.',
      proTip:
        'Always double-check against published maximum doses — mg/kg calculations can exceed safe limits for larger children. For neonates and premature infants, mg/kg dosing requires additional adjustment factors for organ maturity. Use this calculator as a verification tool alongside a clinical pharmacy system, never as the sole calculation source.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 52. IV Drip Rate Calculator
  // =========================================================================
  {
    id: 'iv-drip-rate',
    slug: 'iv-drip-rate',
    title: 'IV Drip Rate Calculator',
    description:
      'Calculate intravenous drip rate in drops per minute (gtt/min) and flow rate in mL/hr for gravity IV infusions with different drop factor giving sets.',
    icon: '💉',
    category: 'medical',
    subcategory: 'dosing',
    tags: ['iv drip', 'infusion rate', 'gtt/min', 'ml/hr', 'nursing', 'fluid', 'giving set', 'iv therapy'],
    inputs: [
      {
        id: 'volumeMl',
        label: 'Volume to Infuse (mL)',
        type: 'number',
        defaultValue: 1000,
        min: 1,
        step: 50,
        helpText: 'Total volume of IV fluid or medication to be infused',
        required: true,
      },
      {
        id: 'infusionHours',
        label: 'Infusion Time (hours)',
        type: 'number',
        defaultValue: 8,
        min: 0.1,
        step: 0.5,
        helpText: 'Total time over which the infusion should run',
        required: true,
      },
      {
        id: 'dropFactor',
        label: 'Drop Factor (gtt/mL)',
        type: 'select',
        options: [
          { label: '10 gtt/mL (blood/blood products giving set)', value: '10' },
          { label: '15 gtt/mL (standard macrodrip)', value: '15' },
          { label: '20 gtt/mL (standard macrodrip)', value: '20' },
          { label: '60 gtt/mL (microdrip / paediatric)', value: '60' },
        ],
        defaultValue: '20',
        helpText: 'Check the giving set packaging for the drop factor — it varies by manufacturer',
      },
    ],
    formulas: [
      {
        id: 'infusionMinutes',
        expression: 'infusionHours * 60',
        dependencies: ['infusionHours'],
      },
      {
        id: 'mlPerHour',
        expression: 'volumeMl / infusionHours',
        dependencies: ['volumeMl', 'infusionHours'],
      },
      {
        // Drip rate (gtt/min) = Volume(mL) x Drop factor / Time(min)
        id: 'dripsPerMinute',
        expression: '(volumeMl * dropFactor) / infusionMinutes',
        dependencies: ['volumeMl', 'dropFactor', 'infusionMinutes'],
      },
      {
        id: 'dripsPerMinRounded',
        expression: 'round(dripsPerMinute)',
        dependencies: ['dripsPerMinute'],
      },
    ],
    outputs: [
      {
        id: 'out-dripsPerMinRounded',
        label: 'Drip Rate',
        formulaRef: 'dripsPerMinRounded',
        format: 'number',
        precision: 0,
        suffix: ' gtt/min',
        highlight: true,
      },
      {
        id: 'out-mlPerHour',
        label: 'Flow Rate',
        formulaRef: 'mlPerHour',
        format: 'number',
        precision: 1,
        suffix: ' mL/hr',
      },
      {
        id: 'out-dripsPerMinute',
        label: 'Exact Drip Rate',
        formulaRef: 'dripsPerMinute',
        format: 'number',
        precision: 2,
        suffix: ' gtt/min',
      },
    ],
    guide: {
      whatIsIt:
        'DISCLAIMER: For educational and reference purposes only. All clinical decisions must be made by qualified healthcare professionals. The IV drip rate formula calculates how many drops per minute a gravity IV infusion must run to deliver the prescribed volume over the prescribed time. The formula is: Drip rate (gtt/min) = [Volume (mL) x Drop Factor (gtt/mL)] / Time (min). This is used for gravity sets where an infusion pump is not available. Modern IV pumps use mL/hr — always prefer electronic infusion pumps where available for precision.',
      howToUse:
        'Enter the total volume to be infused in mL, the infusion duration in hours, and the drop factor of the giving set (printed on the packaging — commonly 10, 15, 20, or 60 gtt/mL). The calculator outputs the rounded drops per minute for clinical use and the exact mL/hr flow rate.',
      exampleScenario:
        '1,000 mL of normal saline over 8 hours using a 20 gtt/mL giving set. Time = 8 x 60 = 480 minutes. Flow rate = 1,000 / 8 = 125 mL/hr. Drip rate = (1,000 x 20) / 480 = 41.67, rounded to 42 gtt/min.',
      proTip:
        'Count drops for 15 seconds and multiply by 4 to verify the drip rate at the bedside. Gravity infusion rates drift over time as the bag empties and pressure changes — recheck every 30-60 minutes. For viscous fluids (blood products, certain antibiotics), use the appropriate blood giving set (10 gtt/mL) and follow local infusion protocols.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 53. Mean Arterial Pressure (MAP)
  // =========================================================================
  {
    id: 'map-calculator',
    slug: 'map-calculator',
    title: 'Mean Arterial Pressure (MAP) Calculator',
    description:
      'Calculate Mean Arterial Pressure from systolic and diastolic blood pressure readings, with clinical range categorisation.',
    icon: '❤️',
    category: 'medical',
    subcategory: 'vitals',
    tags: ['map', 'mean arterial pressure', 'blood pressure', 'systolic', 'diastolic', 'perfusion', 'vitals'],
    inputs: [
      {
        id: 'sbp',
        label: 'Systolic Blood Pressure (mmHg)',
        type: 'number',
        defaultValue: 120,
        min: 40,
        max: 300,
        step: 1,
        helpText: 'Upper number of blood pressure reading (peak pressure during heart contraction)',
        required: true,
      },
      {
        id: 'dbp',
        label: 'Diastolic Blood Pressure (mmHg)',
        type: 'number',
        defaultValue: 80,
        min: 20,
        max: 200,
        step: 1,
        helpText: 'Lower number of blood pressure reading (pressure between heartbeats)',
        required: true,
      },
    ],
    formulas: [
      {
        // Clinical approximation: MAP = (SBP + 2 x DBP) / 3
        // Equivalent to: DBP + (1/3) x Pulse Pressure
        id: 'map',
        expression: '(sbp + 2 * dbp) / 3',
        dependencies: ['sbp', 'dbp'],
      },
      {
        id: 'pulsePressure',
        expression: 'sbp - dbp',
        dependencies: ['sbp', 'dbp'],
      },
      {
        // 1=Low (<60), 2=Low-Normal (60-69), 3=Normal (70-100), 4=High (>100)
        id: 'mapCategory',
        expression: 'map < 60 ? 1 : (map < 70 ? 2 : (map <= 100 ? 3 : 4))',
        dependencies: ['map'],
      },
    ],
    outputs: [
      {
        id: 'out-map',
        label: 'Mean Arterial Pressure',
        formulaRef: 'map',
        format: 'number',
        precision: 1,
        suffix: ' mmHg',
        highlight: true,
      },
      {
        id: 'out-pulsePressure',
        label: 'Pulse Pressure',
        formulaRef: 'pulsePressure',
        format: 'number',
        precision: 0,
        suffix: ' mmHg',
      },
      {
        id: 'out-mapCategory',
        label: 'Category (1=Low <60, 2=Low-Normal 60-69, 3=Normal 70-100, 4=High >100)',
        formulaRef: 'mapCategory',
        format: 'number',
        precision: 0,
      },
    ],
    guide: {
      whatIsIt:
        'DISCLAIMER: For educational and reference purposes only. All clinical decisions must be made by qualified healthcare professionals. Mean Arterial Pressure (MAP) is the average arterial pressure throughout one cardiac cycle. It is a better indicator of perfusion to vital organs than systolic blood pressure alone. The clinical approximation formula is MAP = (SBP + 2 x DBP) / 3, which weights diastolic pressure double because the heart spends approximately two-thirds of the cardiac cycle in diastole. Normal MAP: 70-100 mmHg. A MAP below 60 mmHg is considered critical — it indicates inadequate perfusion pressure to vital organs (brain, kidneys, heart) and is a trigger for urgent intervention in critical care.',
      howToUse:
        'Enter the systolic (top number) and diastolic (bottom number) readings from a blood pressure measurement. The calculator displays MAP, pulse pressure, and a clinical category. MAP is routinely used in intensive care, anaesthesia, and sepsis management protocols.',
      exampleScenario:
        'Blood pressure 120/80 mmHg: MAP = (120 + 2 x 80) / 3 = 280 / 3 = 93.3 mmHg — in the normal range (70-100). Pulse pressure = 120 - 80 = 40 mmHg (normal range 40-60 mmHg). A patient with BP 88/60 would have MAP = (88 + 120) / 3 = 69.3 mmHg — borderline low, warranting close monitoring.',
      proTip:
        'In sepsis management (Surviving Sepsis Campaign guidelines), MAP greater than or equal to 65 mmHg is a key resuscitation target. For patients with chronic hypertension, a MAP greater than 65 mmHg may still be insufficient for adequate organ perfusion — clinical context matters. Continuous arterial line monitoring provides beat-to-beat MAP in critical care settings.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 54. Apgar Score
  // =========================================================================
  {
    id: 'apgar-score',
    slug: 'apgar-score',
    title: 'Apgar Score Calculator',
    description:
      'Calculate the Apgar score for newborn assessment at 1, 5, and 10 minutes after birth based on five clinical criteria.',
    icon: '👶',
    category: 'medical',
    subcategory: 'pediatrics',
    tags: ['apgar', 'newborn', 'neonatal', 'birth', 'assessment', 'pediatrics', 'obstetrics'],
    inputs: [
      {
        id: 'appearance',
        label: 'Appearance (Skin Colour)',
        type: 'select',
        options: [
          { label: 'Blue or pale all over (0)', value: '0' },
          { label: 'Body pink, extremities blue (1)', value: '1' },
          { label: 'Completely pink (2)', value: '2' },
        ],
        defaultValue: '2',
        helpText: 'Assess skin colour of the body and extremities',
      },
      {
        id: 'pulse',
        label: 'Pulse (Heart Rate)',
        type: 'select',
        options: [
          { label: 'Absent — no heartbeat (0)', value: '0' },
          { label: 'Below 100 bpm (1)', value: '1' },
          { label: '100 bpm or above (2)', value: '2' },
        ],
        defaultValue: '2',
        helpText: 'Auscultate or palpate heart rate',
      },
      {
        id: 'grimace',
        label: 'Grimace (Reflex Irritability)',
        type: 'select',
        options: [
          { label: 'No response to stimulation (0)', value: '0' },
          { label: 'Grimace only (1)', value: '1' },
          { label: 'Cry, cough, or sneeze (2)', value: '2' },
        ],
        defaultValue: '2',
        helpText: 'Response to nasal catheter stimulation or flick of sole',
      },
      {
        id: 'activity',
        label: 'Activity (Muscle Tone)',
        type: 'select',
        options: [
          { label: 'Limp — no muscle tone (0)', value: '0' },
          { label: 'Some flexion of extremities (1)', value: '1' },
          { label: 'Active motion (2)', value: '2' },
        ],
        defaultValue: '2',
        helpText: 'Observe spontaneous muscle tone and movement',
      },
      {
        id: 'respiration',
        label: 'Respiration (Breathing)',
        type: 'select',
        options: [
          { label: 'Absent — no breathing (0)', value: '0' },
          { label: 'Slow or irregular breathing (1)', value: '1' },
          { label: 'Good respiratory effort and crying (2)', value: '2' },
        ],
        defaultValue: '2',
        helpText: 'Assess respiratory rate and effort',
      },
    ],
    formulas: [
      {
        id: 'apgarTotal',
        expression: 'appearance + pulse + grimace + activity + respiration',
        dependencies: ['appearance', 'pulse', 'grimace', 'activity', 'respiration'],
      },
      {
        // 1=Critical (<4), 2=Concern (4-6), 3=Normal (>=7)
        id: 'interpretation',
        expression: 'apgarTotal >= 7 ? 3 : (apgarTotal >= 4 ? 2 : 1)',
        dependencies: ['apgarTotal'],
      },
    ],
    outputs: [
      {
        id: 'out-apgarTotal',
        label: 'Apgar Score',
        formulaRef: 'apgarTotal',
        format: 'number',
        precision: 0,
        highlight: true,
      },
      {
        id: 'out-interpretation',
        label: 'Interpretation (1=Critical <4, 2=Concern 4-6, 3=Normal 7+)',
        formulaRef: 'interpretation',
        format: 'number',
        precision: 0,
      },
    ],
    guide: {
      whatIsIt:
        'DISCLAIMER: For educational and reference purposes only. All clinical decisions must be made by qualified healthcare professionals. The Apgar score, developed by Dr. Virginia Apgar in 1952, is a rapid neonatal assessment performed at 1, 5, and (if needed) 10 minutes after birth. Five criteria are assessed (Appearance, Pulse, Grimace, Activity, Respiration), each scored 0-2, for a maximum of 10. Score interpretation: 7-10 = Normal (reassuring); 4-6 = Concern (moderate depression, may need stimulation); 0-3 = Critical (severe depression, immediate resuscitation required). The 1-minute score reflects the immediate transition to extrauterine life; the 5-minute score is more prognostically significant.',
      howToUse:
        'Select the appropriate descriptor for each of the five Apgar criteria based on direct clinical observation. The score is summed automatically. Repeat assessment at 5 and 10 minutes post-delivery as needed. The score should be recorded in the birth notes.',
      exampleScenario:
        'A term infant at 1 minute: body pink but blue hands (Appearance=1), heart rate 110 bpm (Pulse=2), grimaces to suction (Grimace=1), some flexion (Activity=1), crying well (Respiration=2). Total = 7 — borderline normal, repeat at 5 minutes. At 5 minutes the score improves to 9 — reassuring.',
      proTip:
        'The Apgar score is not a reliable predictor of individual neurological outcome or long-term prognosis. A low 1-minute score is common in normal deliveries after interventions. Always combine Apgar scoring with clinical assessment and senior review. In premature infants, lower scores are expected and should be interpreted in the context of gestational age.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 55. Glasgow Coma Scale (GCS)
  // =========================================================================
  {
    id: 'glasgow-coma-scale',
    slug: 'glasgow-coma-scale',
    title: 'Glasgow Coma Scale (GCS)',
    description:
      'Calculate the Glasgow Coma Scale score from eye opening, verbal response, and motor response to assess level of consciousness.',
    icon: '🧠',
    category: 'medical',
    subcategory: 'vitals',
    tags: ['gcs', 'glasgow coma scale', 'consciousness', 'neuro', 'tbi', 'trauma', 'coma', 'emergency'],
    inputs: [
      {
        id: 'eyeOpening',
        label: 'Eye Opening (E)',
        type: 'select',
        options: [
          { label: 'Spontaneous opening (4)', value: '4' },
          { label: 'Opens to voice / verbal command (3)', value: '3' },
          { label: 'Opens to pain only (2)', value: '2' },
          { label: 'No eye opening (1)', value: '1' },
        ],
        defaultValue: '4',
        helpText: 'Best eye opening response observed',
      },
      {
        id: 'verbalResponse',
        label: 'Verbal Response (V)',
        type: 'select',
        options: [
          { label: 'Oriented and conversant (5)', value: '5' },
          { label: 'Confused but conversant (4)', value: '4' },
          { label: 'Inappropriate words (3)', value: '3' },
          { label: 'Incomprehensible sounds (2)', value: '2' },
          { label: 'No verbal response (1)', value: '1' },
        ],
        defaultValue: '5',
        helpText: 'Best verbal response observed',
      },
      {
        id: 'motorResponse',
        label: 'Motor Response (M)',
        type: 'select',
        options: [
          { label: 'Obeys commands (6)', value: '6' },
          { label: 'Localises to pain (5)', value: '5' },
          { label: 'Normal flexion / withdraws from pain (4)', value: '4' },
          { label: 'Abnormal flexion — decorticate posturing (3)', value: '3' },
          { label: 'Extension — decerebrate posturing (2)', value: '2' },
          { label: 'No motor response (1)', value: '1' },
        ],
        defaultValue: '6',
        helpText: 'Best motor response observed',
      },
    ],
    formulas: [
      {
        id: 'gcs',
        expression: 'eyeOpening + verbalResponse + motorResponse',
        dependencies: ['eyeOpening', 'verbalResponse', 'motorResponse'],
      },
      {
        // 1=Severe (<=8), 2=Moderate (9-12), 3=Mild (13-15)
        id: 'severity',
        expression: 'gcs <= 8 ? 1 : (gcs <= 12 ? 2 : 3)',
        dependencies: ['gcs'],
      },
    ],
    outputs: [
      {
        id: 'out-gcs',
        label: 'GCS Total',
        formulaRef: 'gcs',
        format: 'number',
        precision: 0,
        highlight: true,
      },
      {
        id: 'out-severity',
        label: 'TBI Severity (1=Severe 3-8, 2=Moderate 9-12, 3=Mild 13-15)',
        formulaRef: 'severity',
        format: 'number',
        precision: 0,
      },
    ],
    guide: {
      whatIsIt:
        'DISCLAIMER: For educational and reference purposes only. All clinical decisions must be made by qualified healthcare professionals. The Glasgow Coma Scale (GCS), developed by Teasdale and Jennett in 1974, is the most widely used standardised tool for assessing level of consciousness after brain injury. It scores three components: Eye opening (E, 1-4), Verbal response (V, 1-5), and Motor response (M, 1-6). Maximum score is 15 (fully conscious); minimum is 3 (deep coma or death). Report as individual components (e.g., E3V4M5 = GCS 12) and total. TBI severity classification: Mild 13-15; Moderate 9-12; Severe 3-8. A GCS of 8 or less is a traditional threshold for airway protection (intubation).',
      howToUse:
        'Assess the patient and select the best response observed in each of the three domains. Always document the individual scores (E, V, M), not just the total, as this provides richer clinical information. For intubated patients, verbal score is recorded as V = T (intubated) and the total is adjusted.',
      exampleScenario:
        'Post-trauma patient: opens eyes to voice (E=3), confused speech (V=4), localises to pain (M=5). GCS = E3V4M5 = 12. This falls in the moderate TBI range (9-12). The clinical team will monitor for deterioration — a drop to 8 or below would prompt airway intervention.',
      proTip:
        'Always use the best response observed and document time of assessment. Serial GCS measurements are more informative than a single score — a declining GCS over time is a more important clinical finding than the absolute number. In children under 5, a modified paediatric GCS scale should be used as verbal responses differ by developmental stage.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 56. Estimated Blood Volume (EBV)
  // =========================================================================
  {
    id: 'estimated-blood-volume',
    slug: 'estimated-blood-volume',
    title: 'Estimated Blood Volume (EBV)',
    description:
      'Estimate total blood volume by patient type and weight, calculate maximum allowable blood loss (30%), and identify the critical loss threshold (40%).',
    icon: '🩸',
    category: 'medical',
    subcategory: 'vitals',
    tags: ['blood volume', 'ebv', 'blood loss', 'anaesthesia', 'surgery', 'haematology', 'transfusion'],
    inputs: [
      {
        id: 'weightKg',
        label: 'Patient Weight (kg)',
        type: 'number',
        defaultValue: 70,
        min: 0.5,
        max: 300,
        step: 0.5,
        helpText: 'Patient weight in kilograms',
        required: true,
      },
      {
        id: 'patientType',
        label: 'Patient Type',
        type: 'select',
        options: [
          { label: 'Adult Male (75 mL/kg)', value: '75' },
          { label: 'Adult Female (65 mL/kg)', value: '65' },
          { label: 'Newborn (85 mL/kg)', value: '85' },
          { label: 'Infant 3-12 months (75 mL/kg)', value: '75' },
          { label: 'Child 1-12 years (70 mL/kg)', value: '70' },
        ],
        defaultValue: '75',
        helpText: 'Blood volume constant varies by age and sex',
      },
    ],
    formulas: [
      {
        id: 'ebvMl',
        expression: 'weightKg * patientType',
        dependencies: ['weightKg', 'patientType'],
      },
      {
        // MABL: maximum allowable blood loss before transfusion typically triggered
        id: 'maxBloodLoss',
        expression: 'ebvMl * 0.3',
        dependencies: ['ebvMl'],
      },
      {
        id: 'criticalLoss',
        expression: 'ebvMl * 0.4',
        dependencies: ['ebvMl'],
      },
      {
        id: 'ebvLiters',
        expression: 'ebvMl / 1000',
        dependencies: ['ebvMl'],
      },
    ],
    outputs: [
      {
        id: 'out-ebvMl',
        label: 'Estimated Blood Volume',
        formulaRef: 'ebvMl',
        format: 'number',
        precision: 0,
        suffix: ' mL',
        highlight: true,
      },
      {
        id: 'out-maxBloodLoss',
        label: 'Max Allowable Blood Loss (30%)',
        formulaRef: 'maxBloodLoss',
        format: 'number',
        precision: 0,
        suffix: ' mL',
      },
      {
        id: 'out-criticalLoss',
        label: 'Critical Loss Threshold (40%)',
        formulaRef: 'criticalLoss',
        format: 'number',
        precision: 0,
        suffix: ' mL',
      },
      {
        id: 'out-ebvLiters',
        label: 'EBV in Litres',
        formulaRef: 'ebvLiters',
        format: 'number',
        precision: 2,
        suffix: ' L',
      },
    ],
    guide: {
      whatIsIt:
        'DISCLAIMER: For educational and reference purposes only. All clinical decisions must be made by qualified healthcare professionals. Estimated Blood Volume (EBV) is a calculation used in anaesthesia and surgery to quantify the total blood volume, allowing estimation of the maximum allowable blood loss before transfusion should be considered. Standard constants: Adult male ~75 mL/kg; Adult female ~65 mL/kg (lower due to body composition); Newborn ~85 mL/kg (relatively large blood volume); Children ~70-75 mL/kg. Blood loss exceeding 30% (Class III haemorrhagic shock) typically requires transfusion; loss exceeding 40% is immediately life-threatening.',
      howToUse:
        'Enter the patient weight and select the appropriate patient type. EBV, maximum allowable blood loss (30% of EBV), and critical loss threshold (40% of EBV) are calculated. Use these values in pre-operative planning, anaesthetic induction decisions, and intraoperative management.',
      exampleScenario:
        'Adult male patient, 70 kg: EBV = 70 x 75 = 5,250 mL (5.25 L). Maximum allowable blood loss = 5,250 x 0.3 = 1,575 mL. Critical threshold = 5,250 x 0.4 = 2,100 mL. A surgeon should be notified if operative blood loss approaches 1,575 mL and cross-matched blood should be available.',
      proTip:
        'EBV is an estimate — actual blood volume varies with hydration status, body composition (adipose tissue is poorly vascularised), and disease states. In practice, the maximum allowable blood loss before transfusion also depends on the patient haematocrit, the acceptable minimum haemoglobin, and haemodynamic stability. Use this calculation alongside haemoglobin trends and clinical assessment.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 57. Pregnancy Weight Gain (IOM Guidelines)
  // =========================================================================
  {
    id: 'pregnancy-weight-gain',
    slug: 'pregnancy-weight-gain',
    title: 'Pregnancy Weight Gain Calculator (IOM Guidelines)',
    description:
      'Calculate recommended pregnancy weight gain targets based on pre-pregnancy BMI using the 2009 Institute of Medicine guidelines.',
    icon: '🤰',
    category: 'medical',
    subcategory: 'vitals',
    tags: ['pregnancy', 'weight gain', 'bmi', 'iom', 'prenatal', 'obstetrics', 'gestational weight'],
    inputs: [
      {
        id: 'prePregnancyWeight',
        label: 'Pre-Pregnancy Weight (kg)',
        type: 'number',
        defaultValue: 65,
        min: 30,
        max: 250,
        step: 0.5,
        helpText: 'Weight before pregnancy in kilograms. Convert lbs to kg: divide by 2.205.',
        required: true,
      },
      {
        id: 'height',
        label: 'Height (cm)',
        type: 'number',
        defaultValue: 165,
        min: 100,
        max: 220,
        step: 0.5,
        helpText: 'Height in centimetres. Convert inches to cm: multiply by 2.54.',
        required: true,
      },
      {
        id: 'currentWeek',
        label: 'Current Gestational Week',
        type: 'number',
        defaultValue: 20,
        min: 1,
        max: 42,
        step: 1,
        helpText: 'Current week of pregnancy (1-42)',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'heightM',
        expression: 'height / 100',
        dependencies: ['height'],
      },
      {
        // BMI = weight(kg) / height(m)^2
        id: 'bmi',
        expression: 'prePregnancyWeight / (heightM * heightM)',
        dependencies: ['prePregnancyWeight', 'heightM'],
      },
      {
        // 1=Underweight, 2=Normal, 3=Overweight, 4=Obese
        id: 'category',
        expression: 'bmi < 18.5 ? 1 : (bmi < 25 ? 2 : (bmi < 30 ? 3 : 4))',
        dependencies: ['bmi'],
      },
      {
        // IOM 2009 minimum total gain by BMI category
        id: 'minGainTotal',
        expression: 'bmi < 18.5 ? 12.5 : (bmi < 25 ? 11.5 : (bmi < 30 ? 7 : 5))',
        dependencies: ['bmi'],
      },
      {
        // IOM 2009 maximum total gain by BMI category
        id: 'maxGainTotal',
        expression: 'bmi < 18.5 ? 18 : (bmi < 25 ? 16 : (bmi < 30 ? 11.5 : 9))',
        dependencies: ['bmi'],
      },
      {
        // IOM recommended weekly gain rate (kg/week) in 2nd and 3rd trimester
        id: 'weeklyRate',
        expression: 'bmi < 18.5 ? 0.5 : (bmi < 25 ? 0.45 : (bmi < 30 ? 0.3 : 0.2))',
        dependencies: ['bmi'],
      },
      {
        // Approximate recommended cumulative gain at current week
        // First trimester ~0.5-2 kg total, then weekly rate thereafter
        id: 'recommendedGainNow',
        expression: 'weeklyRate * currentWeek',
        dependencies: ['weeklyRate', 'currentWeek'],
      },
    ],
    outputs: [
      {
        id: 'out-recommendedGainNow',
        label: 'Recommended Weight Gain by Now',
        formulaRef: 'recommendedGainNow',
        format: 'number',
        precision: 1,
        suffix: ' kg',
        highlight: true,
      },
      {
        id: 'out-minGainTotal',
        label: 'Total Min Gain (IOM)',
        formulaRef: 'minGainTotal',
        format: 'number',
        precision: 1,
        suffix: ' kg',
      },
      {
        id: 'out-maxGainTotal',
        label: 'Total Max Gain (IOM)',
        formulaRef: 'maxGainTotal',
        format: 'number',
        precision: 1,
        suffix: ' kg',
      },
      {
        id: 'out-bmi',
        label: 'Pre-Pregnancy BMI',
        formulaRef: 'bmi',
        format: 'number',
        precision: 1,
      },
    ],
    guide: {
      whatIsIt:
        'DISCLAIMER: For educational and reference purposes only. All clinical decisions must be made by qualified healthcare professionals. This calculator uses the 2009 Institute of Medicine (IOM) guidelines for gestational weight gain. Recommended ranges by pre-pregnancy BMI: Underweight (BMI <18.5): 12.5-18 kg total; Normal weight (BMI 18.5-24.9): 11.5-16 kg; Overweight (BMI 25-29.9): 7-11.5 kg; Obese (BMI >=30): 5-9 kg. These ranges are based on singleton pregnancies — twin and higher-order multiples have different recommendations.',
      howToUse:
        'Enter pre-pregnancy weight in kg, height in cm, and current gestational week. The calculator computes pre-pregnancy BMI, the IOM-recommended total gain range, and an approximate recommended cumulative gain at the current week of pregnancy (using a simplified linear model based on the weekly rate for the 2nd and 3rd trimesters).',
      exampleScenario:
        'Height: 165 cm. Pre-pregnancy weight: 65 kg. BMI = 65 / (1.65)^2 = 23.9 (normal weight). IOM range: 11.5-16 kg total. Weekly rate: 0.45 kg/week. At week 20: recommended gain = 0.45 x 20 = 9 kg. The actual IOM recommendation for the first trimester is approximately 0.5-2 kg, then ~0.45 kg/week — so 9 kg at week 20 is a reasonable approximation.',
      proTip:
        'Weight gain in pregnancy is highly individual and should be monitored by an obstetric provider at each antenatal visit. The recommended weekly rate applies mainly to the 2nd and 3rd trimesters. Nausea in the first trimester may cause initial weight loss in some women, which is normal. This calculator uses a simplified linear model — the actual IOM recommendations account for trimester-specific patterns.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 58. Creatinine Clearance — Cockcroft-Gault
  // =========================================================================
  {
    id: 'creatinine-clearance',
    slug: 'creatinine-clearance',
    title: 'Creatinine Clearance (Cockcroft-Gault)',
    description:
      'Estimate glomerular filtration rate using the Cockcroft-Gault formula to assess kidney function and guide drug dosing adjustments.',
    icon: '🧪',
    category: 'medical',
    subcategory: 'dosing',
    tags: ['creatinine clearance', 'gfr', 'kidney function', 'ckd', 'cockcroft gault', 'renal', 'drug dosing'],
    inputs: [
      {
        id: 'age',
        label: 'Patient Age (years)',
        type: 'number',
        defaultValue: 60,
        min: 1,
        max: 120,
        step: 1,
        required: true,
      },
      {
        id: 'weight',
        label: 'Patient Weight (kg)',
        type: 'number',
        defaultValue: 70,
        min: 1,
        max: 300,
        step: 0.5,
        helpText: 'Use actual body weight. For obese patients, use ideal or adjusted body weight per local protocol.',
        required: true,
      },
      {
        id: 'serumCreatinine',
        label: 'Serum Creatinine (mg/dL)',
        type: 'number',
        defaultValue: 1.2,
        min: 0.1,
        max: 30,
        step: 0.1,
        helpText: 'From recent lab results. Normal: male 0.7-1.3, female 0.6-1.1 mg/dL.',
        required: true,
      },
      {
        id: 'sex',
        label: 'Sex',
        type: 'select',
        options: [
          { label: 'Male', value: '1' },
          { label: 'Female (x 0.85 correction factor)', value: '0.85' },
        ],
        defaultValue: '1',
        helpText: 'Female sex reduces CrCl by ~15% due to lower muscle mass',
      },
    ],
    formulas: [
      {
        // Cockcroft-Gault: CrCl = ((140 - age) x weight x sex_factor) / (72 x serum_creatinine)
        id: 'crcl',
        expression: '((140 - age) * weight * sex) / (72 * serumCreatinine)',
        dependencies: ['age', 'weight', 'sex', 'serumCreatinine'],
      },
      {
        // CKD staging by GFR (approximate — formal CKD diagnosis requires persistent abnormality)
        // G1>=90, G2=60-89, G3=30-59, G4=15-29, G5<15
        id: 'ckdStage',
        expression: 'crcl >= 90 ? 1 : (crcl >= 60 ? 2 : (crcl >= 30 ? 3 : (crcl >= 15 ? 4 : 5)))',
        dependencies: ['crcl'],
      },
    ],
    outputs: [
      {
        id: 'out-crcl',
        label: 'Creatinine Clearance',
        formulaRef: 'crcl',
        format: 'number',
        precision: 1,
        suffix: ' mL/min',
        highlight: true,
      },
      {
        id: 'out-ckdStage',
        label: 'Estimated CKD Stage (1=Normal >=90, 5=Failure <15)',
        formulaRef: 'ckdStage',
        format: 'number',
        precision: 0,
      },
    ],
    guide: {
      whatIsIt:
        'DISCLAIMER: For educational and reference purposes only. All clinical decisions must be made by qualified healthcare professionals. The Cockcroft-Gault (CG) formula estimates creatinine clearance (CrCl) as a surrogate for glomerular filtration rate (GFR): CrCl = [(140 - age) x weight x sex_factor] / (72 x serum creatinine). The female correction factor of 0.85 accounts for lower average muscle mass. CrCl is used to classify CKD and to dose-adjust renally-cleared drugs (antibiotics, anticoagulants, antivirals, metformin, NSAIDs, and many others). CKD staging by GFR: G1 (normal) >=90; G2 (mildly decreased) 60-89; G3 (moderately decreased) 30-59; G4 (severely decreased) 15-29; G5 (kidney failure) <15 mL/min.',
      howToUse:
        'Enter the patient age, weight, serum creatinine from recent labs, and sex. The formula outputs estimated CrCl and an approximate CKD stage. For obese patients, use ideal body weight or adjusted body weight as per local pharmacy protocol — Cockcroft-Gault with actual body weight overestimates GFR in obesity.',
      exampleScenario:
        'A 60-year-old male, 70 kg, serum creatinine 1.2 mg/dL. CrCl = [(140-60) x 70 x 1] / [72 x 1.2] = [80 x 70] / 86.4 = 5,600 / 86.4 = 64.8 mL/min — Stage G2 (mildly decreased). Many renally-cleared drugs require dose reduction below 60 mL/min; some only below 30 mL/min.',
      proTip:
        'Cockcroft-Gault tends to overestimate CrCl in the elderly and underestimate in young, muscular individuals. The CKD-EPI equation may be more accurate for GFR estimation, but C-G remains the reference for drug dosing studies where medications were originally validated using this formula. Always check the specific drug labelling for renal dosing thresholds.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 59. Absolute Neutrophil Count (ANC)
  // =========================================================================
  {
    id: 'anc-calculator',
    slug: 'anc-calculator',
    title: 'Absolute Neutrophil Count (ANC)',
    description:
      'Calculate ANC from a CBC differential to assess infection risk and guide chemotherapy dosing decisions.',
    icon: '🔬',
    category: 'medical',
    subcategory: 'vitals',
    tags: ['anc', 'neutrophil', 'cbc', 'neutropenia', 'chemotherapy', 'infection', 'haematology', 'oncology'],
    inputs: [
      {
        id: 'wbc',
        label: 'White Blood Cell Count (x10³/μL)',
        type: 'number',
        defaultValue: 5.0,
        min: 0,
        max: 100,
        step: 0.1,
        helpText: 'Total WBC from CBC report (normal: 4.5-11.0 x10³/μL)',
        required: true,
      },
      {
        id: 'neutrophilPercent',
        label: 'Neutrophils / Segs (%)',
        type: 'number',
        defaultValue: 60,
        min: 0,
        max: 100,
        step: 1,
        helpText: 'Percentage of segmented neutrophils (polys/segs) from CBC differential',
        required: true,
      },
      {
        id: 'bandPercent',
        label: 'Bands (%)',
        type: 'number',
        defaultValue: 5,
        min: 0,
        max: 50,
        step: 1,
        helpText: 'Percentage of band neutrophils (immature). Often 0-10% in healthy adults.',
        required: true,
      },
    ],
    formulas: [
      {
        // ANC (x10^3/uL) = WBC x (segs% + bands%) / 100
        id: 'anc',
        expression: 'wbc * (neutrophilPercent + bandPercent) / 100',
        dependencies: ['wbc', 'neutrophilPercent', 'bandPercent'],
      },
      {
        id: 'ancThousands',
        expression: 'anc',
        dependencies: ['anc'],
      },
      {
        // 1=Severe neutropenia (<0.5), 2=Moderate (0.5-1.0), 3=Mild (1.0-1.5), 4=Normal (>=1.5)
        id: 'severity',
        expression: 'anc >= 1.5 ? 4 : (anc >= 1.0 ? 3 : (anc >= 0.5 ? 2 : 1))',
        dependencies: ['anc'],
      },
    ],
    outputs: [
      {
        id: 'out-anc',
        label: 'ANC',
        formulaRef: 'anc',
        format: 'number',
        precision: 2,
        suffix: ' x10³/μL',
        highlight: true,
      },
      {
        id: 'out-severity',
        label: 'Risk Level (1=Severe <0.5, 2=Moderate 0.5-1.0, 3=Mild 1.0-1.5, 4=Normal >=1.5)',
        formulaRef: 'severity',
        format: 'number',
        precision: 0,
      },
    ],
    guide: {
      whatIsIt:
        'DISCLAIMER: For educational and reference purposes only. All clinical decisions must be made by qualified healthcare professionals. The Absolute Neutrophil Count (ANC) represents the actual number of neutrophil granulocytes in the blood and is the key measure of innate immune function. ANC = WBC x (% segs + % bands) / 100. It is measured in units of x10³/μL (thousands per microlitre), equivalent to cells/mm³. Normal ANC: 1.5-8.0 x10³/μL. Neutropenia classification: Mild 1.0-1.5; Moderate 0.5-1.0; Severe <0.5 (also reported as <500 cells/μL). Febrile neutropenia (ANC <1.0 x10³/μL with fever) is a medical emergency requiring prompt evaluation and antibiotics.',
      howToUse:
        'Enter the total WBC count and the percentage of segmented neutrophils and bands from the CBC differential report. ANC, an absolute value in x10³/μL, and a severity category are calculated. The ANC is used before each cycle of chemotherapy to determine whether treatment can proceed safely.',
      exampleScenario:
        'CBC shows: WBC 5.0 x10³/μL, 60% neutrophils, 5% bands. ANC = 5.0 x (60 + 5) / 100 = 5.0 x 0.65 = 3.25 x10³/μL — normal. After chemotherapy: WBC 1.5, 30% neutrophils, 5% bands. ANC = 1.5 x 0.35 = 0.53 x10³/μL — moderate neutropenia. The oncology team may hold or delay the next cycle.',
      proTip:
        'Febrile neutropenia (ANC <1.0 and temperature >38.3°C or >38.0°C sustained) is treated as an oncologic emergency. Many cancer centres have standing protocols for empiric broad-spectrum antibiotics within 1 hour of presentation. G-CSF (filgrastim/pegfilgrastim) is used prophylactically or therapeutically to accelerate neutrophil recovery. Track ANC trends, not just single values.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 60. Child BMI (Paediatric BMI)
  // =========================================================================
  {
    id: 'child-bmi-percentile',
    slug: 'child-bmi-percentile',
    title: 'Child BMI Calculator',
    description:
      'Calculate BMI for children aged 2-20 and show an approximate weight category. Note: clinical assessment requires age/sex-specific CDC or WHO growth charts.',
    icon: '📊',
    category: 'medical',
    subcategory: 'pediatrics',
    tags: ['child bmi', 'pediatric bmi', 'growth chart', 'weight', 'height', 'obesity', 'paediatrics'],
    inputs: [
      {
        id: 'weightKg',
        label: 'Weight (kg)',
        type: 'number',
        defaultValue: 25,
        min: 1,
        max: 150,
        step: 0.5,
        helpText: 'Child weight in kilograms',
        required: true,
      },
      {
        id: 'heightCm',
        label: 'Height (cm)',
        type: 'number',
        defaultValue: 120,
        min: 50,
        max: 220,
        step: 0.5,
        helpText: 'Child height in centimetres (standing, without shoes)',
        required: true,
      },
      {
        id: 'ageYears',
        label: 'Age (years)',
        type: 'number',
        defaultValue: 8,
        min: 2,
        max: 20,
        step: 1,
        helpText: 'Child age in completed years (2-20)',
        required: true,
      },
      {
        id: 'sex',
        label: 'Sex',
        type: 'select',
        options: [
          { label: 'Boy', value: '1' },
          { label: 'Girl', value: '0' },
        ],
        defaultValue: '1',
        helpText: 'Sex is used for reference — note this calculator shows raw BMI only, not percentile',
      },
    ],
    formulas: [
      {
        id: 'heightM',
        expression: 'heightCm / 100',
        dependencies: ['heightCm'],
      },
      {
        id: 'bmi',
        expression: 'weightKg / (heightM * heightM)',
        dependencies: ['weightKg', 'heightM'],
      },
      {
        // Very approximate BMI categories for school-age children (not percentile-based)
        // 1=Underweight, 2=Normal-low, 3=Normal, 4=Overweight, 5=Obese
        id: 'bmiCategory',
        expression: 'bmi < 14 ? 1 : (bmi < 17 ? 2 : (bmi < 19 ? 3 : (bmi < 22 ? 4 : 5)))',
        dependencies: ['bmi'],
      },
    ],
    outputs: [
      {
        id: 'out-bmi',
        label: 'BMI',
        formulaRef: 'bmi',
        format: 'number',
        precision: 1,
        suffix: ' kg/m²',
        highlight: true,
      },
      {
        id: 'out-bmiCategory',
        label: 'Approximate Category (1=Underweight, 3=Healthy, 5=Obese)',
        formulaRef: 'bmiCategory',
        format: 'number',
        precision: 0,
      },
    ],
    guide: {
      whatIsIt:
        'DISCLAIMER: For educational and reference purposes only. All clinical decisions must be made by qualified healthcare professionals. BMI in children is calculated identically to adults (weight in kg divided by height in metres squared), but its interpretation is completely different. Unlike adult BMI, a child BMI value has no absolute meaning — it must be compared to age-and-sex-specific growth charts (CDC 2000 or WHO 2007 charts). Classification is by percentile: <5th = Underweight; 5th-84th = Healthy weight; 85th-94th = Overweight; >=95th = Obese. This calculator shows raw BMI only — it cannot determine percentile without reference to validated growth tables.',
      howToUse:
        'Enter weight in kg, height in cm, age in years, and sex. The calculator computes the raw BMI value and provides a very approximate categorical estimate for general reference. For clinical assessment, plot the BMI on the appropriate CDC or WHO growth chart for the child age and sex. The sex input is included for reference and future use.',
      exampleScenario:
        'An 8-year-old boy weighing 25 kg and 120 cm tall: BMI = 25 / (1.20)^2 = 17.4 kg/m². Using the CDC 2000 growth chart, a BMI of 17.4 at age 8 for boys corresponds to approximately the 75th percentile — healthy weight range. The raw BMI of 17.4 appears moderate but the percentile context is essential.',
      proTip:
        'Always use the full growth chart for clinical paediatric assessment. A child with a BMI of 17 may be at the 50th percentile (healthy) at age 10 but at the 90th percentile (overweight) at age 6. Also assess growth velocity trends over time — a child whose BMI percentile has increased by more than 10 percentile points warrants investigation even if still within the healthy range. The American Academy of Pediatrics recommends annual BMI screening from age 2.',
    },
    metadata: { version: '1.0.0' },
  },
];
