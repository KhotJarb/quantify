import type { CalculatorSchema } from '@/types/calculator';

// ─────────────────────────────────────────────────────────────────────────────
// LDL Cholesterol Calculator — Comprehensive Lipid Panel Analysis
// Dual formula: Friedewald (1972) + Sampson 2020 (NIH/JAMA Cardiology)
// Full atherogenic ratio suite + cardiovascular risk classification
// ─────────────────────────────────────────────────────────────────────────────
export const ldlCalculators: CalculatorSchema[] = [
  {
    id: 'ldl-cholesterol-calculator',
    slug: 'ldl-cholesterol-calculator',
    title: 'LDL Cholesterol Calculator',
    description:
      'Calculate LDL cholesterol with two validated equations (Friedewald & Sampson 2020), full atherogenic ratio analysis, VLDL, Non-HDL, Atherogenic Index of Plasma, and personalised cardiovascular risk classification.',
    icon: '🩸',
    category: 'health',
    subcategory: 'cardiovascular',
    tags: [
      'LDL',
      'cholesterol',
      'HDL',
      'triglycerides',
      'lipid panel',
      'cardiovascular',
      'VLDL',
      'non-HDL',
      'heart disease',
      'Friedewald',
      'Sampson',
      'atherogenic',
      'AIP',
      'risk',
    ],
    inputs: [
      {
        id: 'units',
        label: 'Unit System',
        type: 'select',
        options: [
          { label: 'mg/dL  (USA / Canada)', value: 'mgdl' },
          { label: 'mmol/L  (International)', value: 'mmol' },
        ],
        defaultValue: 'mgdl',
        required: true,
      },
      {
        id: 'totalCholesterol',
        label: 'Total Cholesterol',
        type: 'number',
        min: 50,
        step: 0.1,
        defaultValue: 210,
        placeholder: 'e.g. 210 mg/dL or 5.43 mmol/L',
        required: true,
      },
      {
        id: 'hdl',
        label: 'HDL Cholesterol  ("Good" cholesterol)',
        type: 'number',
        min: 1,
        step: 0.1,
        defaultValue: 55,
        placeholder: 'e.g. 55 mg/dL or 1.42 mmol/L',
        required: true,
      },
      {
        id: 'triglycerides',
        label: 'Triglycerides  (fasting preferred)',
        type: 'number',
        min: 1,
        step: 0.1,
        defaultValue: 130,
        placeholder: 'e.g. 130 mg/dL or 1.47 mmol/L',
        required: true,
      },
      {
        id: 'sex',
        label: 'Biological Sex  (affects HDL reference ranges)',
        type: 'select',
        options: [
          { label: 'Male', value: 'male' },
          { label: 'Female', value: 'female' },
        ],
        defaultValue: 'male',
        required: false,
      },
      {
        id: 'riskContext',
        label: 'Clinical Risk Category',
        type: 'select',
        options: [
          { label: 'Low / Moderate — No CVD, No Diabetes', value: '100' },
          { label: 'High Risk — Diabetes or multiple risk factors', value: '70' },
          { label: 'Very High Risk — Established CVD (heart attack, stroke, PAD)', value: '55' },
        ],
        defaultValue: '100',
        required: false,
      },
    ],

    // ── Formula chain ────────────────────────────────────────────────────────
    formulas: [

      // 1. Normalise all inputs to mg/dL
      //    Cholesterol/HDL/LDL: 1 mmol/L = 38.67 mg/dL
      //    Triglycerides:       1 mmol/L = 88.57 mg/dL
      {
        id: 'tc_mg',
        expression: "units == 'mmol' ? totalCholesterol * 38.67 : totalCholesterol",
        dependencies: ['units', 'totalCholesterol'],
      },
      {
        id: 'hdl_mg',
        expression: "units == 'mmol' ? hdl * 38.67 : hdl",
        dependencies: ['units', 'hdl'],
      },
      {
        id: 'tg_mg',
        expression: "units == 'mmol' ? triglycerides * 88.57 : triglycerides",
        dependencies: ['units', 'triglycerides'],
      },

      // 2. Core derived lipid values
      { id: 'nonHdl_mg',  expression: 'tc_mg - hdl_mg',    dependencies: ['tc_mg', 'hdl_mg'] },
      { id: 'vldl_mg',    expression: 'tg_mg / 5',         dependencies: ['tg_mg'] },

      // 3. ── Friedewald Equation (1972) ──────────────────────────────────────
      //    LDL = TC − HDL − (TG / 5)
      //    Valid range: TG < 400 mg/dL; VLDL is estimated as TG ÷ 5
      {
        id: 'ldl_friedewald',
        expression: 'tc_mg - hdl_mg - (tg_mg / 5)',
        dependencies: ['tc_mg', 'hdl_mg', 'tg_mg'],
      },

      // 4. ── Sampson 2020 Equation (NIH / JAMA Cardiology) ──────────────────
      //    LDL = (TC/0.948) − (HDL/0.971) − [(TG/8.56) + (TG×NonHDL/(2140−TG×0.16))] − 9.44
      //    More accurate when TG ≥ 150 mg/dL or LDL < 70 mg/dL
      //    Valid range: TG 25–800 mg/dL
      {
        id: 'ldl_sampson',
        expression:
          '(tc_mg / 0.948) - (hdl_mg / 0.971) - ((tg_mg / 8.56) + (tg_mg * nonHdl_mg / (2140 - tg_mg * 0.16))) - 9.44',
        dependencies: ['tc_mg', 'hdl_mg', 'tg_mg', 'nonHdl_mg'],
      },

      // 5. Formula selector: Sampson wins when TG ≥ 150 OR Friedewald LDL < 70
      //    (both conditions where Friedewald is known to underperform)
      //    Using nested ternaries to avoid unsupported || operator
      {
        id: 'useSampson',
        expression: 'tg_mg >= 150 ? 1 : ldl_friedewald < 70 ? 1 : 0',
        dependencies: ['tg_mg', 'ldl_friedewald'],
      },
      {
        id: 'ldl_best_mg',
        expression: 'useSampson == 1 ? ldl_sampson : ldl_friedewald',
        dependencies: ['useSampson', 'ldl_sampson', 'ldl_friedewald'],
      },

      // 6. mmol/L conversions for display
      { id: 'ldl_best_mmol',      expression: 'ldl_best_mg / 38.67',        dependencies: ['ldl_best_mg'] },
      { id: 'ldl_friedewald_mmol',expression: 'ldl_friedewald / 38.67',     dependencies: ['ldl_friedewald'] },
      { id: 'ldl_sampson_mmol',   expression: 'ldl_sampson / 38.67',        dependencies: ['ldl_sampson'] },
      { id: 'nonHdl_mmol',        expression: 'nonHdl_mg / 38.67',          dependencies: ['nonHdl_mg'] },
      { id: 'vldl_mmol',          expression: 'vldl_mg / 38.67',            dependencies: ['vldl_mg'] },
      { id: 'hdl_display_mmol',   expression: 'hdl_mg / 38.67',             dependencies: ['hdl_mg'] },
      { id: 'tg_display_mmol',    expression: 'tg_mg / 88.57',              dependencies: ['tg_mg'] },
      { id: 'tc_display_mmol',    expression: 'tc_mg / 38.67',              dependencies: ['tc_mg'] },

      // 7. ── Atherogenic Ratios ──────────────────────────────────────────────

      // Total Cholesterol / HDL  (Castelli Risk Index I)
      // Optimal < 3.5 | Acceptable < 5.0 | High Risk ≥ 5.0
      { id: 'tcHdlRatio', expression: 'hdl_mg > 0 ? tc_mg / hdl_mg : 0', dependencies: ['tc_mg', 'hdl_mg'] },

      // LDL / HDL  (Castelli Risk Index II)
      // Optimal < 2.5 | Moderate 2.5–3.5 | High > 3.5
      { id: 'ldlHdlRatio', expression: 'hdl_mg > 0 ? ldl_best_mg / hdl_mg : 0', dependencies: ['ldl_best_mg', 'hdl_mg'] },

      // TG / HDL  (Insulin resistance & sdLDL proxy, mg/dL values)
      // Optimal < 2.0 | Monitor 2.0–3.5 | High > 3.5
      { id: 'tgHdlRatio', expression: 'hdl_mg > 0 ? tg_mg / hdl_mg : 0', dependencies: ['tg_mg', 'hdl_mg'] },

      // Non-HDL / HDL
      // Optimal < 3.0 | Borderline 3.0–4.0 | High > 4.0
      { id: 'nonHdlHdlRatio', expression: 'hdl_mg > 0 ? nonHdl_mg / hdl_mg : 0', dependencies: ['nonHdl_mg', 'hdl_mg'] },

      // 8. ── Atherogenic Index of Plasma (AIP) ──────────────────────────────
      //    AIP = log₁₀(TG [mmol/L] / HDL [mmol/L])
      //    AIP < 0.10 = low risk | 0.10–0.24 = moderate | > 0.24 = high
      //    log₁₀(x) = ln(x) / ln(10)
      { id: 'tg_mmol_aip',  expression: 'tg_mg / 88.57',  dependencies: ['tg_mg'] },
      { id: 'hdl_mmol_aip', expression: 'hdl_mg / 38.67', dependencies: ['hdl_mg'] },
      {
        id: 'aip',
        expression:
          'hdl_mmol_aip > 0 ? tg_mmol_aip > 0 ? ln(tg_mmol_aip / hdl_mmol_aip) / ln(10) : -9.99 : -9.99',
        dependencies: ['tg_mmol_aip', 'hdl_mmol_aip'],
      },

      // 9. ── Risk Classifications ────────────────────────────────────────────

      // LDL classification 0–4 (ACC/AHA NCEP ATP III)
      {
        id: 'ldlRiskLevel',
        expression:
          'ldl_best_mg < 100 ? 0 : ldl_best_mg < 130 ? 1 : ldl_best_mg < 160 ? 2 : ldl_best_mg < 190 ? 3 : 4',
        dependencies: ['ldl_best_mg'],
      },

      // LDL personalised target from risk context (select value IS the numeric target)
      { id: 'ldlTarget', expression: 'riskContext', dependencies: ['riskContext'] },

      // Gap to target (positive = still above target)
      { id: 'ldlGap', expression: 'ldl_best_mg - ldlTarget', dependencies: ['ldl_best_mg', 'ldlTarget'] },

      // Whether LDL target is already met (1 = yes, 0 = no)
      { id: 'targetMet', expression: 'ldl_best_mg < ldlTarget ? 1 : 0', dependencies: ['ldl_best_mg', 'ldlTarget'] },

      // Triglyceride classification 0–3
      {
        id: 'tgRisk',
        expression: 'tg_mg < 150 ? 0 : tg_mg < 200 ? 1 : tg_mg < 500 ? 2 : 3',
        dependencies: ['tg_mg'],
      },

      // HDL status (sex-specific)
      // Male: < 40 = low (risk factor); < 60 = acceptable; ≥ 60 = protective
      // Female: < 50 = low; < 60 = acceptable; ≥ 60 = protective
      {
        id: 'hdlStatusMale',
        expression: 'hdl_mg < 40 ? 0 : hdl_mg < 60 ? 1 : 2',
        dependencies: ['hdl_mg'],
      },
      {
        id: 'hdlStatusFemale',
        expression: 'hdl_mg < 50 ? 0 : hdl_mg < 60 ? 1 : 2',
        dependencies: ['hdl_mg'],
      },
      {
        id: 'hdlStatus',
        expression: "sex == 'male' ? hdlStatusMale : hdlStatusFemale",
        dependencies: ['sex', 'hdlStatusMale', 'hdlStatusFemale'],
      },

      // Friedewald validity flag: 1 = fully valid, 0 = invalid (TG ≥ 400)
      { id: 'friedewaldValid', expression: 'tg_mg < 400 ? 1 : 0', dependencies: ['tg_mg'] },

      // Difference between two equations (absolute, mg/dL)
      { id: 'equationDelta', expression: 'abs(ldl_sampson - ldl_friedewald)', dependencies: ['ldl_sampson', 'ldl_friedewald'] },
    ],

    // ── Outputs ──────────────────────────────────────────────────────────────
    outputs: [
      {
        id: 'out-ldl-best-mgdl',
        label: 'LDL Cholesterol — Best Estimate',
        formulaRef: 'ldl_best_mg',
        format: 'number',
        precision: 1,
        suffix: ' mg/dL',
        highlight: true,
      },
      {
        id: 'out-ldl-best-mmol',
        label: 'LDL Cholesterol — Best Estimate',
        formulaRef: 'ldl_best_mmol',
        format: 'number',
        precision: 2,
        suffix: ' mmol/L',
      },
      {
        id: 'out-ldl-friedewald',
        label: 'LDL — Friedewald Equation (1972)',
        formulaRef: 'ldl_friedewald',
        format: 'number',
        precision: 1,
        suffix: ' mg/dL',
      },
      {
        id: 'out-ldl-sampson',
        label: 'LDL — Sampson 2020 Equation (NIH)',
        formulaRef: 'ldl_sampson',
        format: 'number',
        precision: 1,
        suffix: ' mg/dL',
      },
      {
        id: 'out-equation-delta',
        label: 'Friedewald vs Sampson Difference',
        formulaRef: 'equationDelta',
        format: 'number',
        precision: 1,
        suffix: ' mg/dL',
      },
      {
        id: 'out-nonhdl-mgdl',
        label: 'Non-HDL Cholesterol',
        formulaRef: 'nonHdl_mg',
        format: 'number',
        precision: 1,
        suffix: ' mg/dL',
      },
      {
        id: 'out-nonhdl-mmol',
        label: 'Non-HDL Cholesterol',
        formulaRef: 'nonHdl_mmol',
        format: 'number',
        precision: 2,
        suffix: ' mmol/L',
      },
      {
        id: 'out-vldl-mgdl',
        label: 'VLDL Cholesterol (estimated)',
        formulaRef: 'vldl_mg',
        format: 'number',
        precision: 1,
        suffix: ' mg/dL',
      },
      {
        id: 'out-tc-hdl-ratio',
        label: 'Total Cholesterol / HDL Ratio',
        formulaRef: 'tcHdlRatio',
        format: 'number',
        precision: 2,
      },
      {
        id: 'out-ldl-hdl-ratio',
        label: 'LDL / HDL Ratio',
        formulaRef: 'ldlHdlRatio',
        format: 'number',
        precision: 2,
      },
      {
        id: 'out-tg-hdl-ratio',
        label: 'TG / HDL Ratio  (insulin resistance proxy)',
        formulaRef: 'tgHdlRatio',
        format: 'number',
        precision: 2,
      },
      {
        id: 'out-nonhdl-hdl-ratio',
        label: 'Non-HDL / HDL Ratio',
        formulaRef: 'nonHdlHdlRatio',
        format: 'number',
        precision: 2,
      },
      {
        id: 'out-aip',
        label: 'Atherogenic Index of Plasma (AIP)',
        formulaRef: 'aip',
        format: 'number',
        precision: 3,
      },
      {
        id: 'out-ldl-risk',
        label: 'LDL Risk Level  (0 = Optimal → 4 = Very High)',
        formulaRef: 'ldlRiskLevel',
        format: 'number',
        precision: 0,
      },
      {
        id: 'out-ldl-target',
        label: 'Your Personalised LDL Target',
        formulaRef: 'ldlTarget',
        format: 'number',
        precision: 0,
        suffix: ' mg/dL',
      },
      {
        id: 'out-ldl-gap',
        label: 'LDL Above Target (negative = target already met)',
        formulaRef: 'ldlGap',
        format: 'number',
        precision: 1,
        suffix: ' mg/dL',
      },
      {
        id: 'out-tg-risk',
        label: 'Triglyceride Risk  (0 = Normal → 3 = Very High)',
        formulaRef: 'tgRisk',
        format: 'number',
        precision: 0,
      },
      {
        id: 'out-hdl-status',
        label: 'HDL Status  (0 = Low risk factor · 1 = Acceptable · 2 = Protective)',
        formulaRef: 'hdlStatus',
        format: 'number',
        precision: 0,
      },
      {
        id: 'out-friedewald-valid',
        label: 'Friedewald Equation Valid  (1 = Yes · 0 = TG too high)',
        formulaRef: 'friedewaldValid',
        format: 'number',
        precision: 0,
      },
    ],

    // ── Guide ─────────────────────────────────────────────────────────────────
    guide: {
      whatIsIt: `LDL (Low-Density Lipoprotein) cholesterol is commonly called "bad" cholesterol because it transports cholesterol particles through the bloodstream and can deposit them into arterial walls. These deposits progressively build up as plaques — a process called atherosclerosis — narrowing arteries and dramatically increasing the risk of heart attack and stroke. LDL is the primary target of cholesterol-lowering therapy worldwide.

This calculator uses two clinically validated estimation methods, automatically selecting the most accurate one for your specific lipid values:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FRIEDEWALD EQUATION (1972)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LDL = Total Cholesterol − HDL − (Triglycerides ÷ 5)

The global standard formula, used by most clinical laboratories worldwide. The division by 5 estimates VLDL cholesterol, which is not measured directly in a standard lipid panel. Highly accurate when triglycerides are below 150 mg/dL. Becomes progressively less reliable as triglycerides rise.
Valid range: TG < 400 mg/dL

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SAMPSON 2020 EQUATION (NIH / JAMA Cardiology)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LDL = (TC / 0.948) − (HDL / 0.971) − [(TG / 8.56) + (TG × NonHDL / (2140 − TG × 0.16))] − 9.44

Developed and validated by NIH researchers (Martin Hopkins et al.) and published in JAMA Cardiology (2020). Uses a variable TG-to-VLDL conversion factor rather than the fixed "divide by 5" of Friedewald, making it significantly more accurate in two critical situations: (1) when LDL is very low (< 70 mg/dL) — exactly the range targeted by modern statin therapy, and (2) when triglycerides are elevated (150–800 mg/dL). This calculator automatically applies Sampson in both of these scenarios.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WHAT THE OTHER OUTPUTS MEAN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Non-HDL Cholesterol (TC − HDL): Captures ALL atherogenic lipoproteins (LDL + VLDL + IDL). Increasingly preferred over LDL alone as a cardiovascular risk marker. Target < 130 mg/dL for most people.

• VLDL Cholesterol: Estimated as TG ÷ 5. Very Low-Density Lipoprotein carries triglycerides and is also atherogenic.

• TC / HDL Ratio (Castelli Index I): A classical cardiovascular risk predictor. < 3.5 is optimal; < 5.0 is acceptable; ≥ 5.0 is elevated risk.

• LDL / HDL Ratio: Reflects the balance between atherogenic and protective cholesterol. < 2.5 is optimal; 2.5–3.5 is moderate; > 3.5 is increased risk.

• TG / HDL Ratio: One of the best available proxies for insulin resistance and the presence of small, dense LDL particles (sdLDL), which are far more atherogenic than large, buoyant LDL particles. < 2.0 optimal; > 3.5 strongly suggests insulin resistance (in mg/dL units).

• Atherogenic Index of Plasma (AIP): AIP = log₁₀(TG mmol/L ÷ HDL mmol/L). A modern, sensitive marker of cardiovascular risk that captures metabolic syndrome better than any single cholesterol value. AIP < 0.10 = low risk; 0.10–0.24 = moderate risk; > 0.24 = high risk; > 0.33 = very high risk.`,

      howToUse: `You will need the results of a standard fasting lipid panel blood test — available from your doctor, clinic, or laboratory.

1. Select your unit system (mg/dL is standard in the USA and Canada; mmol/L is used in most other countries including the UK, Australia, and most of Asia).

2. Enter your three values: Total Cholesterol, HDL Cholesterol, and Triglycerides. For best accuracy, triglycerides should be from a fasting sample (9–12 hours without food). Non-fasting triglycerides can be 20–50 mg/dL higher than fasting values.

3. Select your biological sex — this affects the HDL reference range used (women naturally carry more HDL than men, so the threshold for "low HDL" differs).

4. Select your clinical risk category to personalise your LDL target:
   • Low/Moderate Risk (no CVD, no diabetes): Target LDL < 100 mg/dL
   • High Risk (diabetes or 10-year ASCVD risk ≥ 7.5%): Target LDL < 70 mg/dL
   • Very High Risk (established cardiovascular disease): Target LDL < 55 mg/dL

The calculator will show you both formula results, the Best Estimate, how far you are from your personal target, and a full atherogenic risk profile.

Note: A few labs measure LDL directly (direct LDL assay) rather than calculating it. This is labelled "Direct LDL" or "LDL-Direct" on your report. If you have a direct LDL measurement, you don't need this calculator — it's already your result.`,

      exampleScenario: `Meet James, a 48-year-old man with no diabetes or heart disease.
His fasting lipid panel shows:

  Total Cholesterol :  210 mg/dL
  HDL Cholesterol   :   55 mg/dL  (the "good" cholesterol)
  Triglycerides     :  130 mg/dL

Since triglycerides are below 150, the calculator applies the
Friedewald equation and returns:

  LDL = 129 mg/dL

As a cross-check, the Sampson 2020 formula gives 130.8 mg/dL —
only 1.8 mg/dL apart, confirming the result is reliable.

James has no CVD and no diabetes, so his LDL target is 100 mg/dL.
He is currently 29 mg/dL above that goal.

──────────────────────────────
FULL PROFILE AT A GLANCE
──────────────────────────────
LDL Cholesterol     129 mg/dL   Near / Above Optimal
Non-HDL             155 mg/dL   Borderline High  (aim for < 130)
TC / HDL ratio        3.82      Acceptable
LDL / HDL ratio       2.35      Near Optimal
TG / HDL ratio        2.36      Monitor — mild insulin resistance signal
AIP                   0.015     Low cardiovascular risk

What does this mean?
His LDL sits just below the Borderline High threshold of 130, so
no medication is needed yet. The slightly elevated Non-HDL and
TG/HDL numbers suggest that cutting back on refined carbohydrates
and adding regular exercise could move his entire lipid profile
into the healthy range without any prescription.`,

      proTip: `LDL RISK LEVELS  (ACC/AHA)
──────────────────────────────
  < 100 mg/dL    Optimal
  100-129 mg/dL  Near / Above Optimal
  130-159 mg/dL  Borderline High
  160-189 mg/dL  High
  190+ mg/dL     Very High
  (190+ may point to Familial Hypercholesterolaemia,
   a genetic condition — ask your doctor)

LDL TARGETS BY RISK GROUP
──────────────────────────────
  Low risk        below 116 mg/dL  (3.0 mmol/L)
  Moderate risk   below 100 mg/dL  (2.6 mmol/L)
  High risk        below 70 mg/dL  (1.8 mmol/L)
  Very high risk   below 55 mg/dL  (1.4 mmol/L)

Your Non-HDL target is always your LDL target plus 30 mg/dL.

WHEN FRIEDEWALD IS NOT RELIABLE
──────────────────────────────
The Friedewald formula becomes inaccurate when triglycerides
are 400 mg/dL or higher. The Sampson 2020 formula works up to
800 mg/dL. Above 800 mg/dL, only a direct lab measurement is
reliable. This calculator automatically switches formulas and
flags any validity concern for you.

LIFESTYLE CHANGES THAT LOWER LDL
──────────────────────────────
  Reduce saturated fat (< 7% of calories)    -8 to -10%
  Add soluble fibre (oats, beans, psyllium)  -5 to -7%
  Plant sterols or stanols (2 g per day)     -8 to -10%
  Aerobic exercise, 150 min per week         -3 to -6%
  Eliminate trans fats completely            -5 to -8%
  Lose 10 pounds (4.5 kg)                    -5 to -8%
  All of the above combined                  up to -30%

ABOUT HDL (THE "GOOD" CHOLESTEROL)
──────────────────────────────
HDL at 60 mg/dL or above is protective — it actually cancels
out one other cardiovascular risk factor. HDL below 40 mg/dL
(men) or below 50 mg/dL (women) is itself a risk factor for
heart disease, regardless of your LDL level.`,
    },
    metadata: { version: '1.0.0' },
  },

  // ── Enhanced Special Calculator ──────────────────────────────────────────
  // Custom React component: LDLCalculatorEnhanced.tsx
  // Live gauge · dual-formula comparison · full ratio suite · action plan
  {
    id: 'ldl-cholesterol-enhanced',
    slug: 'ldl-cholesterol-enhanced',
    title: 'LDL Cholesterol Calculator — Enhanced',
    description:
      'Advanced LDL analysis with live visual gauge, dual-formula comparison (Friedewald & Sampson 2020), full atherogenic ratio dashboard, AIP, personalized target tracking, and a lifestyle action plan.',
    icon: '❤️‍🩹',
    category: 'health',
    subcategory: 'cardiovascular',
    tags: [
      'LDL', 'cholesterol', 'HDL', 'triglycerides', 'lipid panel',
      'cardiovascular', 'VLDL', 'non-HDL', 'Friedewald', 'Sampson',
      'atherogenic', 'AIP', 'risk', 'enhanced', 'special',
    ],
    inputs:   [],
    formulas: [],
    outputs:  [],
    metadata: { version: '1.0.0' },
  },
];



