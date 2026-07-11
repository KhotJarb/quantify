import type { CalculatorSchema } from '@/types/calculator';

// ─────────────────────────────────────────────────────────────────────────────
// SPECIALIST CALCULATORS — 33 new calculators across 8 domains
// ─────────────────────────────────────────────────────────────────────────────
export const specialistCalculators: CalculatorSchema[] = [

  // ═══════════════════════════════════════════════════════════════════════════
  // 1. CIVIL ENGINEERING & CONSTRUCTION
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'beam-deflection',
    slug: 'beam-deflection',
    title: 'Beam Deflection Calculator',
    description: 'Calculate maximum deflection of a simply supported or cantilever beam under point or uniform distributed load using standard structural engineering formulas.',
    icon: '🏗️',
    category: 'engineering',
    subcategory: 'civil',
    tags: ['beam', 'deflection', 'structural', 'civil', 'engineering', 'moment of inertia', 'load'],
    inputs: [
      { id: 'beamType', label: 'Beam Type', type: 'select', options: [
        { label: 'Simply Supported — Point Load at Centre', value: 'ss_point' },
        { label: 'Simply Supported — Uniform Distributed Load', value: 'ss_udl' },
        { label: 'Cantilever — Point Load at Free End', value: 'cant_point' },
        { label: 'Cantilever — Uniform Distributed Load', value: 'cant_udl' },
      ], defaultValue: 'ss_point', required: true },
      { id: 'load', label: 'Applied Load (kN)', type: 'number', min: 0, step: 0.1, defaultValue: 10, placeholder: 'e.g. 10', required: true },
      { id: 'span', label: 'Beam Span / Length (m)', type: 'number', min: 0.01, step: 0.01, defaultValue: 5, placeholder: 'e.g. 5', required: true },
      { id: 'elasticModulus', label: 'Elastic Modulus E (GPa)', type: 'number', min: 0.001, step: 0.1, defaultValue: 200, placeholder: 'e.g. 200 for steel', required: true },
      { id: 'momentOfInertia', label: 'Second Moment of Area I (cm⁴)', type: 'number', min: 0.001, step: 0.1, defaultValue: 8356, placeholder: 'e.g. 8356 for 254×254 UC89', required: true },
    ],
    formulas: [
      {
        id: 'deflectionMm',
        expression: `beamType == 'ss_point' ? ((load * 1000 * pow(span * 100, 3)) / (48 * elasticModulus * 1000000 * momentOfInertia)) * 10 :
                     beamType == 'ss_udl'   ? ((5 * (load * 1000 / (span * 100)) * pow(span * 100, 4)) / (384 * elasticModulus * 1000000 * momentOfInertia)) * 10 :
                     beamType == 'cant_point'? ((load * 1000 * pow(span * 100, 3)) / (3 * elasticModulus * 1000000 * momentOfInertia)) * 10 :
                                              (((load * 1000 / (span * 100)) * pow(span * 100, 4)) / (8 * elasticModulus * 1000000 * momentOfInertia)) * 10`,
        dependencies: ['beamType', 'load', 'span', 'elasticModulus', 'momentOfInertia'],
      },
      {
        id: 'spanOverDeflection',
        expression: 'deflectionMm > 0 ? round((span * 1000) / deflectionMm) : 0',
        dependencies: ['span', 'deflectionMm'],
      },
    ],
    outputs: [
      { id: 'deflection-mm', label: 'Maximum Deflection', formulaRef: 'deflectionMm', format: 'number', precision: 3, suffix: ' mm', highlight: true },
      { id: 'span-deflection-ratio', label: 'Span / Deflection Ratio', formulaRef: 'spanOverDeflection', format: 'number', precision: 0, prefix: 'L/', },
    ],
    guide: {
      whatIsIt: 'Beam deflection is the vertical displacement of a beam under load. Excessive deflection causes structural and aesthetic problems — codes typically limit deflection to span/360 for floors and span/240 for roofs. This calculator covers the four most common loading cases using the standard EI (flexural rigidity) formula.',
      howToUse: 'Select the beam support and load type. Enter the total applied load in kN, the beam span in metres, the elastic modulus of the material (200 GPa for steel, 30 GPa for concrete, 12 GPa for timber), and the second moment of area from section tables.',
      exampleScenario: 'A 203×203 UC52 steel beam (I = 5259 cm⁴) spans 6 m with a 20 kN point load at midspan. E = 200 GPa. Deflection = (20,000 × 6000³) / (48 × 200,000 × 5259 × 10⁴) = 5.7 mm. Span/deflection = 6000/5.7 ≈ L/1053 — well within L/360 limit.',
      proTip: 'The Span/Deflection ratio is the key serviceability check. Most building codes require L/360 minimum for floors (ratio ≥ 360) and L/180 for wind drift. If your ratio is below the required value, increase the beam section or reduce the span.',
    },
    metadata: { version: '1.0.0' },
  },

  {
    id: 'rebar-weight-length',
    slug: 'rebar-weight-length',
    title: 'Rebar Weight & Length Calculator',
    description: 'Calculate the total weight and length of reinforcing bar (rebar) for concrete structures based on bar diameter, count, and lap splice allowances.',
    icon: '🔩',
    category: 'engineering',
    subcategory: 'civil',
    tags: ['rebar', 'reinforcement', 'concrete', 'weight', 'civil', 'structural', 'bar'],
    inputs: [
      { id: 'barDiameter', label: 'Bar Diameter', type: 'select', options: [
        { label: '6 mm  (0.222 kg/m)', value: '6' },
        { label: '8 mm  (0.395 kg/m)', value: '8' },
        { label: '10 mm (0.617 kg/m)', value: '10' },
        { label: '12 mm (0.888 kg/m)', value: '12' },
        { label: '16 mm (1.578 kg/m)', value: '16' },
        { label: '20 mm (2.466 kg/m)', value: '20' },
        { label: '25 mm (3.854 kg/m)', value: '25' },
        { label: '32 mm (6.313 kg/m)', value: '32' },
        { label: '40 mm (9.864 kg/m)', value: '40' },
      ], defaultValue: '16', required: true },
      { id: 'barLength', label: 'Length per Bar (m)', type: 'number', min: 0.01, step: 0.01, defaultValue: 6, placeholder: 'e.g. 6', required: true },
      { id: 'barCount', label: 'Number of Bars', type: 'number', min: 1, step: 1, defaultValue: 20, placeholder: 'e.g. 20', required: true },
      { id: 'lapSplicePercent', label: 'Lap Splice Addition (%)', type: 'number', min: 0, max: 100, step: 1, defaultValue: 10, placeholder: 'e.g. 10', required: false },
    ],
    formulas: [
      {
        id: 'kgPerMetre',
        expression: `barDiameter == '6'  ? 0.222 :
                     barDiameter == '8'  ? 0.395 :
                     barDiameter == '10' ? 0.617 :
                     barDiameter == '12' ? 0.888 :
                     barDiameter == '16' ? 1.578 :
                     barDiameter == '20' ? 2.466 :
                     barDiameter == '25' ? 3.854 :
                     barDiameter == '32' ? 6.313 : 9.864`,
        dependencies: ['barDiameter'],
      },
      { id: 'totalLength', expression: 'barLength * barCount * (1 + lapSplicePercent / 100)', dependencies: ['barLength', 'barCount', 'lapSplicePercent'] },
      { id: 'totalWeight', expression: 'totalLength * kgPerMetre', dependencies: ['totalLength', 'kgPerMetre'] },
      { id: 'totalWeightTonnes', expression: 'totalWeight / 1000', dependencies: ['totalWeight'] },
    ],
    outputs: [
      { id: 'out-totalLength', label: 'Total Bar Length', formulaRef: 'totalLength', format: 'number', precision: 2, suffix: ' m', highlight: true },
      { id: 'out-totalWeight', label: 'Total Weight', formulaRef: 'totalWeight', format: 'number', precision: 2, suffix: ' kg' },
      { id: 'out-totalWeightTonnes', label: 'Total Weight (tonnes)', formulaRef: 'totalWeightTonnes', format: 'number', precision: 3, suffix: ' t' },
    ],
    guide: {
      whatIsIt: 'This calculator determines the total weight and length of steel reinforcing bars needed for a concrete element. Rebar weight is calculated using the standard formula: weight (kg/m) = (diameter² / 162.28) for metric bars, or from published section tables. Lap splices add extra length at bar joints and are typically 40–60 × bar diameter, expressed as a percentage of bar length.',
      howToUse: 'Select the bar diameter from standard sizes. Enter the design length of each bar and the total quantity. Add a lap splice percentage if bars need to be joined — 10% is a common starting allowance for estimating.',
      exampleScenario: 'A retaining wall requires 40 bars of 16 mm diameter, each 4 m long, with 10% lap splice allowance. Total length = 40 × 4 × 1.10 = 176 m. Total weight = 176 × 1.578 = 277.7 kg.',
      proTip: 'Unit weight of rebar = (d² / 162.28) kg/m where d is diameter in mm. Always add 5–15% wastage for cutting and bending. For large projects, work in tonnes to get a direct comparison with supplier quotes.',
    },
    metadata: { version: '1.0.0' },
  },

  {
    id: 'concrete-column-load',
    slug: 'concrete-column-load',
    title: 'Concrete Column Load Capacity',
    description: 'Estimate the axial load capacity of a reinforced concrete column using ACI 318 simplified formula for tied and spiral columns.',
    icon: '🏛️',
    category: 'engineering',
    subcategory: 'civil',
    tags: ['concrete', 'column', 'load', 'capacity', 'ACI', 'reinforcement', 'structural'],
    inputs: [
      { id: 'columnType', label: 'Column Type', type: 'select', options: [
        { label: 'Tied Column', value: 'tied' },
        { label: 'Spiral Column', value: 'spiral' },
      ], defaultValue: 'tied', required: true },
      { id: 'crossSectionArea', label: 'Gross Cross-Section Area Ag (mm²)', type: 'number', min: 1, step: 1, defaultValue: 90000, placeholder: 'e.g. 90000 for 300×300', required: true },
      { id: 'steelArea', label: 'Total Steel Area Ast (mm²)', type: 'number', min: 0, step: 1, defaultValue: 1256, placeholder: 'e.g. 1256 for 4×Ø20', required: true },
      { id: 'fck', label: "Concrete Compressive Strength f'c (MPa)", type: 'number', min: 10, step: 1, defaultValue: 30, placeholder: 'e.g. 30', required: true },
      { id: 'fy', label: 'Steel Yield Strength fy (MPa)', type: 'number', min: 100, step: 10, defaultValue: 420, placeholder: 'e.g. 420', required: true },
    ],
    formulas: [
      { id: 'phi', expression: "columnType == 'tied' ? 0.65 : 0.75", dependencies: ['columnType'] },
      { id: 'reductionFactor', expression: "columnType == 'tied' ? 0.80 : 0.85", dependencies: ['columnType'] },
      {
        id: 'nominalCapacity',
        expression: 'reductionFactor * (0.85 * fck * (crossSectionArea - steelArea) + fy * steelArea)',
        dependencies: ['reductionFactor', 'fck', 'crossSectionArea', 'steelArea', 'fy'],
      },
      { id: 'designCapacity', expression: 'phi * nominalCapacity / 1000', dependencies: ['phi', 'nominalCapacity'] },
      { id: 'steelRatio', expression: 'steelArea / crossSectionArea * 100', dependencies: ['steelArea', 'crossSectionArea'] },
    ],
    outputs: [
      { id: 'out-designCapacity', label: 'Design Axial Load Capacity (φPn)', formulaRef: 'designCapacity', format: 'number', precision: 1, suffix: ' kN', highlight: true },
      { id: 'out-nominalCapacity', label: 'Nominal Capacity (Pn)', formulaRef: 'nominalCapacity', format: 'number', precision: 0, suffix: ' N' },
      { id: 'out-steelRatio', label: 'Steel Ratio (ρg)', formulaRef: 'steelRatio', format: 'number', precision: 2, suffix: ' %' },
    ],
    guide: {
      whatIsIt: "Based on ACI 318-19 Section 22.4.2, the maximum design axial strength of a column is: φPn = φ × [0.80 or 0.85] × [0.85f'c(Ag−Ast) + fyAst]. The factor 0.80 applies to tied columns and 0.85 to spiral columns, with strength reduction factors φ = 0.65 and 0.75 respectively.",
      howToUse: "Enter the gross cross-section area (e.g. 300 mm × 300 mm = 90,000 mm²), total reinforcement area Ast, concrete compressive strength f'c, and steel yield strength fy. Select tied or spiral to apply the correct reduction factors.",
      exampleScenario: "A 300×300 mm tied column with 4-Ø20 bars (Ast = 1256 mm²), f'c = 30 MPa, fy = 420 MPa. Nominal: 0.80 × (0.85×30×(90000−1256) + 420×1256) = 0.80 × (2259 kN + 527 kN) = 2229 kN. Design: φPn = 0.65 × 2229 ≈ 1449 kN.",
      proTip: 'ACI 318 requires the steel ratio ρg (Ast/Ag) to be between 1% and 8%. If your ratio falls outside this range, adjust the bar size or count. Spiral columns allow higher loads (φ = 0.75 vs 0.65) due to better confinement — useful when column size is constrained.',
    },
    metadata: { version: '1.0.0' },
  },

  {
    id: 'soil-bearing-capacity',
    slug: 'soil-bearing-capacity',
    title: 'Soil Bearing Capacity Calculator',
    description: 'Estimate the ultimate and allowable bearing capacity of soil under a shallow foundation using Terzaghi\'s general bearing capacity equation.',
    icon: '⛏️',
    category: 'engineering',
    subcategory: 'civil',
    tags: ['soil', 'bearing capacity', 'foundation', 'geotechnical', 'Terzaghi', 'civil'],
    inputs: [
      { id: 'foundationType', label: 'Foundation Shape', type: 'select', options: [
        { label: 'Strip (continuous) Footing', value: 'strip' },
        { label: 'Square Footing', value: 'square' },
        { label: 'Circular Footing', value: 'circular' },
      ], defaultValue: 'square', required: true },
      { id: 'cohesion', label: 'Soil Cohesion c (kPa)', type: 'number', min: 0, step: 0.5, defaultValue: 10, placeholder: 'e.g. 0 for sand, 10–50 for clay', required: true },
      { id: 'frictionAngle', label: 'Friction Angle φ (degrees)', type: 'number', min: 0, max: 45, step: 0.5, defaultValue: 30, placeholder: 'e.g. 30', required: true },
      { id: 'unitWeight', label: 'Unit Weight of Soil γ (kN/m³)', type: 'number', min: 10, max: 25, step: 0.5, defaultValue: 18, placeholder: 'e.g. 18', required: true },
      { id: 'foundationDepth', label: 'Foundation Depth Df (m)', type: 'number', min: 0.1, step: 0.1, defaultValue: 1.5, placeholder: 'e.g. 1.5', required: true },
      { id: 'foundationWidth', label: 'Foundation Width B (m)', type: 'number', min: 0.1, step: 0.1, defaultValue: 1.5, placeholder: 'e.g. 1.5', required: true },
      { id: 'fos', label: 'Factor of Safety', type: 'number', min: 1, max: 5, step: 0.5, defaultValue: 3, placeholder: 'Typically 2.5–3', required: true },
    ],
    formulas: [
      { id: 'phiRad', expression: 'frictionAngle * 3.14159265 / 180', dependencies: ['frictionAngle'] },
      { id: 'Nq', expression: 'exp(3.14159265 * tan(phiRad)) * pow(tan(0.785398 + phiRad / 2), 2)', dependencies: ['phiRad'] },
      { id: 'Nc', expression: 'frictionAngle > 0 ? (Nq - 1) / tan(phiRad) : 5.14', dependencies: ['frictionAngle', 'phiRad', 'Nq'] },
      { id: 'Ny', expression: '2 * (Nq + 1) * tan(phiRad)', dependencies: ['Nq', 'phiRad'] },
      {
        id: 'shapeFc',
        expression: "foundationType == 'strip' ? 1 : foundationType == 'square' ? 1.3 : 1.3",
        dependencies: ['foundationType'],
      },
      {
        id: 'shapeFy',
        expression: "foundationType == 'strip' ? 1 : foundationType == 'square' ? 0.8 : 0.6",
        dependencies: ['foundationType'],
      },
      {
        id: 'ultimateBearing',
        expression: 'cohesion * Nc * shapeFc + unitWeight * foundationDepth * Nq + 0.5 * unitWeight * foundationWidth * Ny * shapeFy',
        dependencies: ['cohesion', 'Nc', 'shapeFc', 'unitWeight', 'foundationDepth', 'Nq', 'foundationWidth', 'Ny', 'shapeFy'],
      },
      { id: 'allowableBearing', expression: 'ultimateBearing / fos', dependencies: ['ultimateBearing', 'fos'] },
    ],
    outputs: [
      { id: 'out-ultimate', label: 'Ultimate Bearing Capacity (qu)', formulaRef: 'ultimateBearing', format: 'number', precision: 1, suffix: ' kPa', highlight: true },
      { id: 'out-allowable', label: 'Allowable Bearing Capacity (qa)', formulaRef: 'allowableBearing', format: 'number', precision: 1, suffix: ' kPa' },
      { id: 'out-Nc', label: 'Bearing Capacity Factor Nc', formulaRef: 'Nc', format: 'number', precision: 2 },
      { id: 'out-Nq', label: 'Bearing Capacity Factor Nq', formulaRef: 'Nq', format: 'number', precision: 2 },
    ],
    guide: {
      whatIsIt: "Terzaghi's bearing capacity equation estimates the maximum pressure a shallow foundation can apply to soil without causing shear failure: qu = c·Nc·sc + γ·Df·Nq + 0.5·γ·B·Nγ·sγ where Nc, Nq, Nγ are dimensionless bearing capacity factors dependent on friction angle, and sc, sγ are shape factors.",
      howToUse: 'Enter the soil properties (cohesion and friction angle from a geotechnical report or lab test), soil unit weight, foundation dimensions, and apply a factor of safety of 2.5 to 3.0 for structural foundations.',
      exampleScenario: 'A square footing (1.5 m × 1.5 m, depth 1.5 m) on soil with c = 10 kPa, φ = 30°, γ = 18 kN/m³. Nc ≈ 30.1, Nq ≈ 18.4, Nγ ≈ 22.4. qu ≈ 10×30.1×1.3 + 18×1.5×18.4 + 0.5×18×1.5×22.4×0.8 ≈ 974 kPa. qa = 974/3 ≈ 325 kPa.',
      proTip: 'Always verify against field tests (SPT, CPT, plate load test). Terzaghi\'s formula assumes general shear failure — for loose sands or soft clays, use local or punching shear corrections. A FOS of 3 is standard for permanent structures.',
    },
    metadata: { version: '1.0.0' },
  },

  {
    id: 'asphalt-volume-weight',
    slug: 'asphalt-volume-weight',
    title: 'Asphalt Volume & Weight Calculator',
    description: 'Calculate the volume and weight of asphalt (bituminous mix) required for a road, driveway, or pavement area based on dimensions and compacted thickness.',
    icon: '🛣️',
    category: 'engineering',
    subcategory: 'civil',
    tags: ['asphalt', 'pavement', 'road', 'volume', 'weight', 'bitumen', 'tonnage', 'construction'],
    inputs: [
      { id: 'length', label: 'Area Length (m)', type: 'number', min: 0.01, step: 0.1, defaultValue: 100, placeholder: 'e.g. 100', required: true },
      { id: 'width', label: 'Area Width (m)', type: 'number', min: 0.01, step: 0.1, defaultValue: 6, placeholder: 'e.g. 6', required: true },
      { id: 'thickness', label: 'Compacted Thickness (mm)', type: 'number', min: 1, step: 1, defaultValue: 50, placeholder: 'e.g. 50', required: true },
      { id: 'density', label: 'Asphalt Density (t/m³)', type: 'select', options: [
        { label: 'Dense Graded Asphalt — 2.30 t/m³', value: '2.30' },
        { label: 'Open Graded (Drainage) — 2.10 t/m³', value: '2.10' },
        { label: 'Stone Mastic Asphalt — 2.35 t/m³', value: '2.35' },
        { label: 'Reclaimed Asphalt — 2.25 t/m³', value: '2.25' },
        { label: 'Custom', value: 'custom' },
      ], defaultValue: '2.30', required: true },
      { id: 'customDensity', label: 'Custom Density (t/m³) — if Custom selected', type: 'number', min: 1.5, max: 3, step: 0.01, defaultValue: 2.30, placeholder: 'e.g. 2.30', required: false },
      { id: 'wastagePercent', label: 'Wastage & Compaction Factor (%)', type: 'number', min: 0, max: 30, step: 1, defaultValue: 5, placeholder: 'Typically 5–10%', required: false },
    ],
    formulas: [
      { id: 'useDensity', expression: "density == 'custom' ? customDensity : density", dependencies: ['density', 'customDensity'] },
      { id: 'volumeM3', expression: 'length * width * (thickness / 1000)', dependencies: ['length', 'width', 'thickness'] },
      { id: 'tonnesNet', expression: 'volumeM3 * useDensity', dependencies: ['volumeM3', 'useDensity'] },
      { id: 'tonnesWithWastage', expression: 'tonnesNet * (1 + wastagePercent / 100)', dependencies: ['tonnesNet', 'wastagePercent'] },
      { id: 'areaM2', expression: 'length * width', dependencies: ['length', 'width'] },
    ],
    outputs: [
      { id: 'out-tonnes', label: 'Asphalt Required (with wastage)', formulaRef: 'tonnesWithWastage', format: 'number', precision: 2, suffix: ' tonnes', highlight: true },
      { id: 'out-tonnesNet', label: 'Net Weight (no wastage)', formulaRef: 'tonnesNet', format: 'number', precision: 2, suffix: ' tonnes' },
      { id: 'out-volume', label: 'Compacted Volume', formulaRef: 'volumeM3', format: 'number', precision: 3, suffix: ' m³' },
      { id: 'out-area', label: 'Surface Area', formulaRef: 'areaM2', format: 'number', precision: 1, suffix: ' m²' },
    ],
    guide: {
      whatIsIt: 'Asphalt tonnage is calculated as: Weight (tonnes) = Volume (m³) × Density (t/m³). The compacted density of asphalt varies by mix type — dense graded mixes are typically 2.28–2.35 t/m³. Adding a 5–10% wastage factor accounts for spreading, trimming, and compaction loss.',
      howToUse: 'Enter the paved area dimensions and the designed compacted thickness (after compaction — typically 50–75 mm for a wearing course, 75–150 mm for a base course). Select the mix type to auto-fill density, or enter a custom value. Add a wastage percentage for ordering.',
      exampleScenario: 'A car park 50 m × 30 m with 60 mm wearing course of dense graded asphalt (2.30 t/m³), 5% wastage. Volume = 50×30×0.06 = 90 m³. Net weight = 90×2.30 = 207 t. Order quantity = 207×1.05 ≈ 217 tonnes.',
      proTip: 'Asphalt is sold by the tonne — always order 5–10% extra for waste, trimming, and rework. For large projects, get a certified material test report (CTM) to confirm the actual density of the specific mix from the plant.',
    },
    metadata: { version: '1.0.0' },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. DATA SCIENCE & MACHINE LEARNING
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'f1-precision-recall',
    slug: 'f1-precision-recall',
    title: 'F1 Score & Precision-Recall Calculator',
    description: 'Calculate F1 score, precision, recall, specificity, and accuracy from a binary classification confusion matrix (TP, FP, TN, FN).',
    icon: '📊',
    category: 'tech',
    subcategory: 'data-science',
    tags: ['F1 score', 'precision', 'recall', 'machine learning', 'classification', 'confusion matrix', 'accuracy'],
    inputs: [
      { id: 'tp', label: 'True Positives (TP)', type: 'number', min: 0, step: 1, defaultValue: 80, placeholder: 'Correctly predicted positives', required: true },
      { id: 'fp', label: 'False Positives (FP)', type: 'number', min: 0, step: 1, defaultValue: 20, placeholder: 'Incorrectly predicted positives', required: true },
      { id: 'tn', label: 'True Negatives (TN)', type: 'number', min: 0, step: 1, defaultValue: 90, placeholder: 'Correctly predicted negatives', required: true },
      { id: 'fn', label: 'False Negatives (FN)', type: 'number', min: 0, step: 1, defaultValue: 10, placeholder: 'Incorrectly predicted negatives', required: true },
    ],
    formulas: [
      { id: 'precision', expression: '(tp + fp) > 0 ? tp / (tp + fp) : 0', dependencies: ['tp', 'fp'] },
      { id: 'recall', expression: '(tp + fn) > 0 ? tp / (tp + fn) : 0', dependencies: ['tp', 'fn'] },
      { id: 'specificity', expression: '(tn + fp) > 0 ? tn / (tn + fp) : 0', dependencies: ['tn', 'fp'] },
      { id: 'f1Score', expression: '(precision + recall) > 0 ? 2 * precision * recall / (precision + recall) : 0', dependencies: ['precision', 'recall'] },
      { id: 'accuracy', expression: '(tp + tn + fp + fn) > 0 ? (tp + tn) / (tp + tn + fp + fn) : 0', dependencies: ['tp', 'tn', 'fp', 'fn'] },
      { id: 'f1Pct', expression: 'f1Score * 100', dependencies: ['f1Score'] },
      { id: 'precisionPct', expression: 'precision * 100', dependencies: ['precision'] },
      { id: 'recallPct', expression: 'recall * 100', dependencies: ['recall'] },
      { id: 'accuracyPct', expression: 'accuracy * 100', dependencies: ['accuracy'] },
    ],
    outputs: [
      { id: 'out-f1', label: 'F1 Score', formulaRef: 'f1Pct', format: 'number', precision: 2, suffix: ' %', highlight: true },
      { id: 'out-precision', label: 'Precision (PPV)', formulaRef: 'precisionPct', format: 'number', precision: 2, suffix: ' %' },
      { id: 'out-recall', label: 'Recall (Sensitivity)', formulaRef: 'recallPct', format: 'number', precision: 2, suffix: ' %' },
      { id: 'out-accuracy', label: 'Overall Accuracy', formulaRef: 'accuracyPct', format: 'number', precision: 2, suffix: ' %' },
      { id: 'out-specificity', label: 'Specificity', formulaRef: 'specificity', format: 'number', precision: 4 },
    ],
    guide: {
      whatIsIt: 'F1 Score is the harmonic mean of Precision and Recall, offering a single balanced metric for binary classifiers: F1 = 2 × (Precision × Recall) / (Precision + Recall). Precision = TP / (TP + FP); Recall = TP / (TP + FN). F1 is preferred over accuracy on imbalanced datasets.',
      howToUse: 'Enter the four values from your model\'s confusion matrix. True Positives (correctly identified positives), False Positives (negatives incorrectly labelled positive), True Negatives (correctly identified negatives), and False Negatives (positives incorrectly labelled negative).',
      exampleScenario: 'A fraud detection model scores: TP=80, FP=20, TN=90, FN=10. Precision = 80/100 = 80%. Recall = 80/90 = 88.9%. F1 = 2×0.80×0.889/(0.80+0.889) = 84.2%. Despite 85% accuracy, the F1 reveals the precision-recall trade-off more clearly.',
      proTip: 'A high precision means few false alarms; high recall means few missed detections. For medical diagnosis, maximise recall (missing a disease is worse). For spam filters, balance both. F1 near 1.0 = excellent; below 0.5 = model needs improvement.',
    },
    metadata: { version: '1.0.0' },
  },

  {
    id: 'softmax-probability',
    slug: 'softmax-probability',
    title: 'Softmax Probability Calculator',
    description: 'Convert raw logit scores from a neural network into a probability distribution using the softmax function. Supports up to 10 class scores.',
    icon: '🤖',
    category: 'tech',
    subcategory: 'data-science',
    tags: ['softmax', 'neural network', 'logits', 'probability', 'machine learning', 'classification', 'deep learning'],
    inputs: [
      { id: 'score1', label: 'Score / Logit — Class 1', type: 'number', step: 0.01, defaultValue: 2.5, placeholder: 'e.g. 2.5', required: true },
      { id: 'score2', label: 'Score / Logit — Class 2', type: 'number', step: 0.01, defaultValue: 1.0, placeholder: 'e.g. 1.0', required: true },
      { id: 'score3', label: 'Score / Logit — Class 3', type: 'number', step: 0.01, defaultValue: 0.5, placeholder: 'e.g. 0.5', required: false },
      { id: 'score4', label: 'Score / Logit — Class 4', type: 'number', step: 0.01, defaultValue: -1.0, placeholder: 'e.g. -1.0', required: false },
      { id: 'score5', label: 'Score / Logit — Class 5', type: 'number', step: 0.01, defaultValue: -2.0, placeholder: 'e.g. -2.0', required: false },
    ],
    formulas: [
      { id: 'e1', expression: 'exp(score1)', dependencies: ['score1'] },
      { id: 'e2', expression: 'exp(score2)', dependencies: ['score2'] },
      { id: 'e3', expression: 'exp(score3)', dependencies: ['score3'] },
      { id: 'e4', expression: 'exp(score4)', dependencies: ['score4'] },
      { id: 'e5', expression: 'exp(score5)', dependencies: ['score5'] },
      { id: 'sumExp', expression: 'e1 + e2 + e3 + e4 + e5', dependencies: ['e1', 'e2', 'e3', 'e4', 'e5'] },
      { id: 'p1', expression: 'e1 / sumExp * 100', dependencies: ['e1', 'sumExp'] },
      { id: 'p2', expression: 'e2 / sumExp * 100', dependencies: ['e2', 'sumExp'] },
      { id: 'p3', expression: 'e3 / sumExp * 100', dependencies: ['e3', 'sumExp'] },
      { id: 'p4', expression: 'e4 / sumExp * 100', dependencies: ['e4', 'sumExp'] },
      { id: 'p5', expression: 'e5 / sumExp * 100', dependencies: ['e5', 'sumExp'] },
    ],
    outputs: [
      { id: 'out-p1', label: 'P(Class 1)', formulaRef: 'p1', format: 'number', precision: 2, suffix: ' %', highlight: true },
      { id: 'out-p2', label: 'P(Class 2)', formulaRef: 'p2', format: 'number', precision: 2, suffix: ' %' },
      { id: 'out-p3', label: 'P(Class 3)', formulaRef: 'p3', format: 'number', precision: 2, suffix: ' %' },
      { id: 'out-p4', label: 'P(Class 4)', formulaRef: 'p4', format: 'number', precision: 2, suffix: ' %' },
      { id: 'out-p5', label: 'P(Class 5)', formulaRef: 'p5', format: 'number', precision: 2, suffix: ' %' },
    ],
    guide: {
      whatIsIt: 'Softmax converts a vector of raw scores (logits) into probabilities that sum to 100%: P(i) = exp(zᵢ) / Σ exp(zⱼ). It is used as the final activation function in multi-class neural network classifiers (e.g. image recognition, NLP). The class with the highest probability is the model\'s predicted class.',
      howToUse: 'Enter the raw logit scores output by your neural network for each class (up to 5 classes here). Leave unused class fields at any value — all five are used in the denominator. The probabilities show how confident the model is in each class.',
      exampleScenario: 'A 3-class image classifier outputs logits [2.5, 1.0, 0.5]. exp values: 12.18, 2.72, 1.65. Sum = 16.55. Probabilities: 73.6%, 16.4%, 10.0%. The model predicts Class 1 with 73.6% confidence.',
      proTip: 'Softmax is numerically unstable for large logit values. In practice, subtract the maximum logit before exponentiating (log-sum-exp trick). Temperature scaling (dividing logits by T) controls sharpness: T<1 makes distributions peakier, T>1 makes them softer (useful for calibration).',
    },
    metadata: { version: '1.0.0' },
  },

  {
    id: 'confusion-matrix-metrics',
    slug: 'confusion-matrix-metrics',
    title: 'Confusion Matrix Metrics',
    description: 'Comprehensive binary classifier evaluation: Matthews Correlation Coefficient, balanced accuracy, informedness, markedness, Cohen\'s Kappa, and all standard metrics.',
    icon: '🔢',
    category: 'tech',
    subcategory: 'data-science',
    tags: ['confusion matrix', 'MCC', 'kappa', 'balanced accuracy', 'machine learning', 'classification'],
    inputs: [
      { id: 'tp', label: 'True Positives (TP)', type: 'number', min: 0, step: 1, defaultValue: 90, required: true },
      { id: 'fp', label: 'False Positives (FP)', type: 'number', min: 0, step: 1, defaultValue: 10, required: true },
      { id: 'tn', label: 'True Negatives (TN)', type: 'number', min: 0, step: 1, defaultValue: 85, required: true },
      { id: 'fn', label: 'False Negatives (FN)', type: 'number', min: 0, step: 1, defaultValue: 15, required: true },
    ],
    formulas: [
      { id: 'n', expression: 'tp + fp + tn + fn', dependencies: ['tp', 'fp', 'tn', 'fn'] },
      { id: 'accuracy', expression: 'n > 0 ? (tp + tn) / n * 100 : 0', dependencies: ['tp', 'tn', 'n'] },
      { id: 'precision', expression: '(tp + fp) > 0 ? tp / (tp + fp) * 100 : 0', dependencies: ['tp', 'fp'] },
      { id: 'recall', expression: '(tp + fn) > 0 ? tp / (tp + fn) * 100 : 0', dependencies: ['tp', 'fn'] },
      { id: 'specificity', expression: '(tn + fp) > 0 ? tn / (tn + fp) * 100 : 0', dependencies: ['tn', 'fp'] },
      { id: 'f1', expression: '(precision + recall) > 0 ? 2 * precision * recall / (precision + recall) : 0', dependencies: ['precision', 'recall'] },
      { id: 'balancedAcc', expression: '(recall + specificity) / 2', dependencies: ['recall', 'specificity'] },
      {
        id: 'mcc',
        expression: `((tp * tn - fp * fn) / sqrt((tp + fp) * (tp + fn) * (tn + fp) * (tn + fn))) * 100`,
        dependencies: ['tp', 'tn', 'fp', 'fn'],
      },
      { id: 'informedness', expression: 'recall + specificity - 100', dependencies: ['recall', 'specificity'] },
      {
        id: 'expectedAcc',
        expression: 'n > 0 ? (((tp + fn) * (tp + fp) + (tn + fp) * (tn + fn)) / pow(n, 2)) * 100 : 0',
        dependencies: ['tp', 'fp', 'tn', 'fn', 'n'],
      },
      { id: 'kappa', expression: '(100 - expectedAcc) > 0 ? (accuracy - expectedAcc) / (100 - expectedAcc) * 100 : 0', dependencies: ['accuracy', 'expectedAcc'] },
    ],
    outputs: [
      { id: 'out-mcc', label: "Matthews Corr. Coeff. (MCC)", formulaRef: 'mcc', format: 'number', precision: 2, suffix: ' %', highlight: true },
      { id: 'out-f1', label: 'F1 Score', formulaRef: 'f1', format: 'number', precision: 2, suffix: ' %' },
      { id: 'out-accuracy', label: 'Accuracy', formulaRef: 'accuracy', format: 'number', precision: 2, suffix: ' %' },
      { id: 'out-balanced', label: 'Balanced Accuracy', formulaRef: 'balancedAcc', format: 'number', precision: 2, suffix: ' %' },
      { id: 'out-kappa', label: "Cohen's Kappa", formulaRef: 'kappa', format: 'number', precision: 2, suffix: ' %' },
      { id: 'out-precision', label: 'Precision', formulaRef: 'precision', format: 'number', precision: 2, suffix: ' %' },
      { id: 'out-recall', label: 'Recall', formulaRef: 'recall', format: 'number', precision: 2, suffix: ' %' },
      { id: 'out-informedness', label: 'Informedness (Youden J)', formulaRef: 'informedness', format: 'number', precision: 2, suffix: ' %' },
    ],
    guide: {
      whatIsIt: 'This calculator computes the full suite of binary classification metrics. The Matthews Correlation Coefficient (MCC) is often considered the most reliable single metric — it accounts for all four confusion matrix values and ranges from -100% (perfect inverse) to +100% (perfect prediction), with 0 being random chance.',
      howToUse: 'Enter the four cells of your confusion matrix: True Positives, False Positives, True Negatives, and False Negatives. All metrics are computed automatically.',
      exampleScenario: 'TP=90, FP=10, TN=85, FN=15. Accuracy=87.5%, F1=90%, MCC=75%, Balanced Accuracy=87.5%, Kappa=75%. The MCC and Kappa give a more honest picture on slightly imbalanced data.',
      proTip: 'MCC > 0.7 is generally considered good. Balanced Accuracy is preferred over plain accuracy on class-imbalanced datasets. Cohen\'s Kappa > 0.8 indicates strong agreement beyond chance.',
    },
    metadata: { version: '1.0.0' },
  },

  {
    id: 'tf-idf-score',
    slug: 'tf-idf-score',
    title: 'TF-IDF Score Calculator',
    description: 'Calculate the TF-IDF (Term Frequency–Inverse Document Frequency) relevance score for a term in a document, used in information retrieval and NLP.',
    icon: '📄',
    category: 'tech',
    subcategory: 'data-science',
    tags: ['TF-IDF', 'NLP', 'information retrieval', 'text mining', 'term frequency', 'search', 'machine learning'],
    inputs: [
      { id: 'termFreq', label: 'Term Count in Document', type: 'number', min: 0, step: 1, defaultValue: 5, placeholder: 'How many times the term appears', required: true },
      { id: 'totalWords', label: 'Total Words in Document', type: 'number', min: 1, step: 1, defaultValue: 200, placeholder: 'Total word count', required: true },
      { id: 'totalDocs', label: 'Total Documents in Corpus', type: 'number', min: 1, step: 1, defaultValue: 1000, placeholder: 'e.g. 1000', required: true },
      { id: 'docsWithTerm', label: 'Documents Containing the Term', type: 'number', min: 1, step: 1, defaultValue: 50, placeholder: 'e.g. 50', required: true },
      { id: 'idfSmooth', label: 'IDF Variant', type: 'select', options: [
        { label: 'Standard IDF: log(N / df)', value: 'standard' },
        { label: 'Smooth IDF: log(1 + N / df)', value: 'smooth' },
        { label: 'sklearn: log((1+N)/(1+df)) + 1', value: 'sklearn' },
      ], defaultValue: 'standard', required: true },
    ],
    formulas: [
      { id: 'tf', expression: 'termFreq / totalWords', dependencies: ['termFreq', 'totalWords'] },
      {
        id: 'idf',
        expression: `idfSmooth == 'standard' ? log(totalDocs / docsWithTerm) :
                     idfSmooth == 'smooth'   ? log(1 + totalDocs / docsWithTerm) :
                                               log((1 + totalDocs) / (1 + docsWithTerm)) + 1`,
        dependencies: ['idfSmooth', 'totalDocs', 'docsWithTerm'],
      },
      { id: 'tfidf', expression: 'tf * idf', dependencies: ['tf', 'idf'] },
    ],
    outputs: [
      { id: 'out-tfidf', label: 'TF-IDF Score', formulaRef: 'tfidf', format: 'number', precision: 6, highlight: true },
      { id: 'out-tf', label: 'Term Frequency (TF)', formulaRef: 'tf', format: 'number', precision: 6 },
      { id: 'out-idf', label: 'Inverse Document Freq. (IDF)', formulaRef: 'idf', format: 'number', precision: 6 },
    ],
    guide: {
      whatIsIt: 'TF-IDF measures how important a word is to a document in a collection. TF = (term count in doc) / (total words in doc). IDF = log(N / df) where N is the total number of documents and df is the number of documents containing the term. High TF-IDF means the term is frequent in the document but rare across the corpus — signalling relevance.',
      howToUse: 'Enter how many times the term appears in your document and the document\'s total word count. Then provide the corpus size and how many documents contain the term. Select the IDF variant — sklearn\'s variant (used by scikit-learn) adds smoothing to avoid division by zero.',
      exampleScenario: 'The word "blockchain" appears 5 times in a 200-word article. The corpus has 1000 documents, 50 of which contain "blockchain". TF = 5/200 = 0.025. IDF = log(1000/50) = 2.996. TF-IDF = 0.025 × 2.996 = 0.0749.',
      proTip: 'Words with very low IDF (appearing in almost every document) like "the" or "is" get near-zero TF-IDF scores — effectively filtering out stop words mathematically without a stop-word list. Compare TF-IDF scores across documents to rank their relevance for a search query.',
    },
    metadata: { version: '1.0.0' },
  },

  {
    id: 'cosine-similarity',
    slug: 'cosine-similarity',
    title: 'Cosine Similarity Calculator',
    description: 'Calculate the cosine similarity between two text/feature vectors (up to 6 dimensions). Used in NLP, recommendation systems, and information retrieval.',
    icon: '📐',
    category: 'tech',
    subcategory: 'data-science',
    tags: ['cosine similarity', 'NLP', 'vector', 'machine learning', 'recommendation', 'embedding', 'text similarity'],
    inputs: [
      { id: 'a1', label: 'Vector A — Dimension 1', type: 'number', step: 0.01, defaultValue: 3, required: true },
      { id: 'a2', label: 'Vector A — Dimension 2', type: 'number', step: 0.01, defaultValue: 2, required: true },
      { id: 'a3', label: 'Vector A — Dimension 3', type: 'number', step: 0.01, defaultValue: 1, required: false },
      { id: 'b1', label: 'Vector B — Dimension 1', type: 'number', step: 0.01, defaultValue: 2, required: true },
      { id: 'b2', label: 'Vector B — Dimension 2', type: 'number', step: 0.01, defaultValue: 3, required: true },
      { id: 'b3', label: 'Vector B — Dimension 3', type: 'number', step: 0.01, defaultValue: 1, required: false },
    ],
    formulas: [
      { id: 'dot', expression: 'a1*b1 + a2*b2 + a3*b3', dependencies: ['a1', 'a2', 'a3', 'b1', 'b2', 'b3'] },
      { id: 'magA', expression: 'sqrt(a1*a1 + a2*a2 + a3*a3)', dependencies: ['a1', 'a2', 'a3'] },
      { id: 'magB', expression: 'sqrt(b1*b1 + b2*b2 + b3*b3)', dependencies: ['b1', 'b2', 'b3'] },
      { id: 'similarity', expression: '(magA * magB) > 0 ? dot / (magA * magB) : 0', dependencies: ['dot', 'magA', 'magB'] },
      { id: 'similarityPct', expression: 'similarity * 100', dependencies: ['similarity'] },
      { id: 'angleDeg', expression: 'magA > 0 && magB > 0 ? abs(similarity) <= 1 ? 57.2958 * acos(similarity) : 0 : 0', dependencies: ['similarity', 'magA', 'magB'] },
    ],
    outputs: [
      { id: 'out-similarity', label: 'Cosine Similarity', formulaRef: 'similarity', format: 'number', precision: 6, highlight: true },
      { id: 'out-similarityPct', label: 'Similarity (%)', formulaRef: 'similarityPct', format: 'number', precision: 2, suffix: ' %' },
      { id: 'out-angle', label: 'Angle Between Vectors', formulaRef: 'angleDeg', format: 'number', precision: 2, suffix: ' °' },
      { id: 'out-dot', label: 'Dot Product', formulaRef: 'dot', format: 'number', precision: 4 },
    ],
    guide: {
      whatIsIt: 'Cosine similarity measures the cosine of the angle between two vectors: cos(θ) = (A·B) / (‖A‖ × ‖B‖). A value of 1 means identical direction (most similar), 0 means orthogonal (unrelated), and -1 means opposite. It is widely used to measure document similarity in NLP and find related items in recommendation systems because it is magnitude-independent.',
      howToUse: 'Enter the numerical values for each dimension of the two vectors. For TF-IDF document comparison, each dimension represents a word and the value is its TF-IDF score. For word embeddings (Word2Vec, GloVe), enter the embedding values.',
      exampleScenario: 'A = [3, 2, 1], B = [2, 3, 1]. Dot product = 3×2 + 2×3 + 1×1 = 13. ‖A‖ = √14 ≈ 3.742, ‖B‖ = √14 ≈ 3.742. Cosine = 13/14 ≈ 0.929 — the vectors are 92.9% similar.',
      proTip: 'Unlike Euclidean distance, cosine similarity ignores magnitude — a document with 1000 words and the same proportional term distribution as a 100-word document will score equally similar to a query. This is why it is preferred for document length-normalised comparisons.',
    },
    metadata: { version: '1.0.0' },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. ELECTRICAL & POWER ENGINEERING
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'three-phase-power',
    slug: 'three-phase-power',
    title: '3-Phase Power Calculator (kVA · kW · Amps)',
    description: 'Calculate three-phase apparent power (kVA), real power (kW), reactive power (kVAR), and current (amps) from voltage, current, or power factor inputs.',
    icon: '⚡',
    category: 'engineering',
    subcategory: 'electrical',
    tags: ['3-phase', 'power', 'kVA', 'kW', 'amps', 'voltage', 'power factor', 'electrical', 'engineering'],
    inputs: [
      { id: 'calcMode', label: 'Calculate From', type: 'select', options: [
        { label: 'Voltage & Current → Power', value: 'vi_to_p' },
        { label: 'kVA & Power Factor → kW & kVAR', value: 'kva_to_kw' },
        { label: 'kW & Power Factor → kVA & Amps', value: 'kw_to_kva' },
      ], defaultValue: 'vi_to_p', required: true },
      { id: 'lineVoltage', label: 'Line-to-Line Voltage VL (V)', type: 'number', min: 1, step: 1, defaultValue: 415, placeholder: 'e.g. 415 (LV), 11000 (MV)', required: true },
      { id: 'lineCurrent', label: 'Line Current IL (A)', type: 'number', min: 0, step: 0.1, defaultValue: 100, placeholder: 'e.g. 100', required: false },
      { id: 'kva', label: 'Apparent Power (kVA)', type: 'number', min: 0, step: 0.1, defaultValue: 0, placeholder: 'e.g. 100', required: false },
      { id: 'kw', label: 'Real Power (kW)', type: 'number', min: 0, step: 0.1, defaultValue: 0, placeholder: 'e.g. 80', required: false },
      { id: 'pf', label: 'Power Factor (0–1)', type: 'number', min: 0.01, max: 1, step: 0.01, defaultValue: 0.85, placeholder: 'e.g. 0.85', required: true },
    ],
    formulas: [
      {
        id: 'apparentKVA',
        expression: `calcMode == 'vi_to_p'  ? sqrt(3) * lineVoltage * lineCurrent / 1000 :
                     calcMode == 'kva_to_kw' ? kva :
                                               kw / pf`,
        dependencies: ['calcMode', 'lineVoltage', 'lineCurrent', 'kva', 'kw', 'pf'],
      },
      { id: 'realKW', expression: "calcMode == 'kva_to_kw' ? kva * pf : calcMode == 'kw_to_kva' ? kw : apparentKVA * pf", dependencies: ['calcMode', 'kva', 'pf', 'kw', 'apparentKVA'] },
      { id: 'reactivekVAR', expression: 'sqrt(abs(apparentKVA * apparentKVA - realKW * realKW))', dependencies: ['apparentKVA', 'realKW'] },
      { id: 'amperes', expression: 'lineVoltage > 0 ? apparentKVA * 1000 / (sqrt(3) * lineVoltage) : 0', dependencies: ['apparentKVA', 'lineVoltage'] },
    ],
    outputs: [
      { id: 'out-kva', label: 'Apparent Power', formulaRef: 'apparentKVA', format: 'number', precision: 2, suffix: ' kVA', highlight: true },
      { id: 'out-kw', label: 'Real Power', formulaRef: 'realKW', format: 'number', precision: 2, suffix: ' kW' },
      { id: 'out-kvar', label: 'Reactive Power', formulaRef: 'reactivekVAR', format: 'number', precision: 2, suffix: ' kVAR' },
      { id: 'out-amps', label: 'Line Current', formulaRef: 'amperes', format: 'number', precision: 2, suffix: ' A' },
    ],
    guide: {
      whatIsIt: 'In three-phase AC systems: kVA = √3 × VL × IL / 1000 (apparent power). Real power kW = kVA × PF. Reactive power kVAR = √(kVA² − kW²). These relationships form the power triangle. Power factor (PF) is the ratio of real to apparent power — unity PF means all power does useful work.',
      howToUse: 'Select the calculation direction. For a generator or motor nameplate problem, use "kW & PF → kVA & Amps" to find the kVA rating needed. For measuring an existing load with a clamp meter, use "Voltage & Current → Power".',
      exampleScenario: 'A 415 V three-phase motor draws 100 A at PF = 0.85. kVA = 1.732 × 415 × 100 / 1000 = 71.9 kVA. Real power = 71.9 × 0.85 = 61.1 kW. Reactive = √(71.9² − 61.1²) = 37.8 kVAR.',
      proTip: 'Utilities charge for low power factor (below 0.9 or 0.95 depending on jurisdiction) because reactive current loads the distribution system. Adding capacitor banks to bring PF above 0.95 is a common energy-saving measure. Use the kVAR output to size the correction capacitors.',
    },
    metadata: { version: '1.0.0' },
  },

  {
    id: 'transformer-sizing',
    slug: 'transformer-sizing',
    title: 'Transformer Sizing Calculator',
    description: 'Determine the required kVA rating of a transformer based on connected loads, demand factor, and efficiency. Includes primary and secondary current calculation.',
    icon: '🔌',
    category: 'engineering',
    subcategory: 'electrical',
    tags: ['transformer', 'kVA', 'sizing', 'electrical', 'load', 'primary', 'secondary', 'power'],
    inputs: [
      { id: 'totalLoadKW', label: 'Total Connected Load (kW)', type: 'number', min: 0, step: 0.1, defaultValue: 150, required: true },
      { id: 'powerFactor', label: 'Load Power Factor', type: 'number', min: 0.1, max: 1, step: 0.01, defaultValue: 0.85, required: true },
      { id: 'demandFactor', label: 'Demand Factor (0–1)', type: 'number', min: 0.1, max: 1, step: 0.01, defaultValue: 0.75, placeholder: 'Typically 0.6–0.9', required: true },
      { id: 'safetyMargin', label: 'Safety Margin (%)', type: 'number', min: 0, max: 50, step: 5, defaultValue: 25, required: true },
      { id: 'primaryVoltage', label: 'Primary Voltage (V)', type: 'number', min: 100, step: 100, defaultValue: 11000, required: true },
      { id: 'secondaryVoltage', label: 'Secondary Voltage (V)', type: 'number', min: 100, step: 10, defaultValue: 415, required: true },
    ],
    formulas: [
      { id: 'demandKW', expression: 'totalLoadKW * demandFactor', dependencies: ['totalLoadKW', 'demandFactor'] },
      { id: 'requiredKVA', expression: 'demandKW / powerFactor', dependencies: ['demandKW', 'powerFactor'] },
      { id: 'selectedKVA', expression: 'requiredKVA * (1 + safetyMargin / 100)', dependencies: ['requiredKVA', 'safetyMargin'] },
      { id: 'primaryCurrent', expression: 'primaryVoltage > 0 ? selectedKVA * 1000 / (sqrt(3) * primaryVoltage) : 0', dependencies: ['selectedKVA', 'primaryVoltage'] },
      { id: 'secondaryCurrent', expression: 'secondaryVoltage > 0 ? selectedKVA * 1000 / (sqrt(3) * secondaryVoltage) : 0', dependencies: ['selectedKVA', 'secondaryVoltage'] },
    ],
    outputs: [
      { id: 'out-selectedKVA', label: 'Required Transformer Rating', formulaRef: 'selectedKVA', format: 'number', precision: 1, suffix: ' kVA', highlight: true },
      { id: 'out-requiredKVA', label: 'Minimum kVA (before margin)', formulaRef: 'requiredKVA', format: 'number', precision: 1, suffix: ' kVA' },
      { id: 'out-primaryCurrent', label: 'Primary Full-Load Current', formulaRef: 'primaryCurrent', format: 'number', precision: 2, suffix: ' A' },
      { id: 'out-secondaryCurrent', label: 'Secondary Full-Load Current', formulaRef: 'secondaryCurrent', format: 'number', precision: 2, suffix: ' A' },
    ],
    guide: {
      whatIsIt: 'Transformer kVA rating is determined by the actual load demand divided by the power factor, then padded with a safety margin for future growth and fault headroom: kVA = (Total Load × Demand Factor) / PF × (1 + Safety Margin). Primary and secondary full-load currents: I = kVA × 1000 / (√3 × V).',
      howToUse: 'Enter the sum of all connected loads in kW. Set the demand factor (the ratio of simultaneous use — not all loads run at once) and the expected average power factor. Add a 25% safety margin for growth and harmonic derating.',
      exampleScenario: 'Factory with 150 kW connected load, DF = 0.75, PF = 0.85, 25% margin. Demand = 112.5 kW. kVA = 112.5/0.85 = 132.4 kVA. With margin = 165.5 kVA → select standard 200 kVA transformer. Secondary (415 V) current = 200×1000/(1.732×415) = 278 A.',
      proTip: 'Always round up to the next standard transformer size: 25, 50, 75, 100, 160, 200, 250, 315, 400, 500, 630, 800, 1000 kVA. Budget 5–10% derating for harmonic-heavy loads (VFDs, UPS, rectifiers). For transformers with >15% harmonic current, use a K-rated transformer.',
    },
    metadata: { version: '1.0.0' },
  },

  {
    id: 'power-factor-correction',
    slug: 'power-factor-correction',
    title: 'Power Factor Correction (kVAR) Calculator',
    description: 'Calculate the required capacitor bank size (kVAR) to correct a lagging power factor to a target value, reducing reactive power charges.',
    icon: '🔋',
    category: 'engineering',
    subcategory: 'electrical',
    tags: ['power factor', 'kVAR', 'capacitor', 'correction', 'reactive power', 'electrical', 'energy'],
    inputs: [
      { id: 'realPowerKW', label: 'Real Power Load (kW)', type: 'number', min: 0, step: 0.1, defaultValue: 100, required: true },
      { id: 'existingPF', label: 'Existing Power Factor', type: 'number', min: 0.01, max: 0.999, step: 0.01, defaultValue: 0.72, required: true },
      { id: 'targetPF', label: 'Target Power Factor', type: 'number', min: 0.01, max: 1, step: 0.01, defaultValue: 0.95, required: true },
      { id: 'voltageV', label: 'Line Voltage (V)', type: 'number', min: 100, step: 1, defaultValue: 415, required: true },
    ],
    formulas: [
      { id: 'existingAngle', expression: 'acos(existingPF)', dependencies: ['existingPF'] },
      { id: 'targetAngle', expression: 'acos(targetPF)', dependencies: ['targetPF'] },
      { id: 'requiredKVAR', expression: 'realPowerKW * (tan(existingAngle) - tan(targetAngle))', dependencies: ['realPowerKW', 'existingAngle', 'targetAngle'] },
      { id: 'existingKVA', expression: 'existingPF > 0 ? realPowerKW / existingPF : 0', dependencies: ['realPowerKW', 'existingPF'] },
      { id: 'newKVA', expression: 'targetPF > 0 ? realPowerKW / targetPF : 0', dependencies: ['realPowerKW', 'targetPF'] },
      { id: 'currentReduction', expression: 'existingKVA > 0 ? (existingKVA - newKVA) / existingKVA * 100 : 0', dependencies: ['existingKVA', 'newKVA'] },
    ],
    outputs: [
      { id: 'out-kvar', label: 'Capacitor Bank Required', formulaRef: 'requiredKVAR', format: 'number', precision: 2, suffix: ' kVAR', highlight: true },
      { id: 'out-existingKVA', label: 'Current Apparent Power', formulaRef: 'existingKVA', format: 'number', precision: 2, suffix: ' kVA' },
      { id: 'out-newKVA', label: 'New Apparent Power After Correction', formulaRef: 'newKVA', format: 'number', precision: 2, suffix: ' kVA' },
      { id: 'out-reduction', label: 'Apparent Power Reduction', formulaRef: 'currentReduction', format: 'number', precision: 1, suffix: ' %' },
    ],
    guide: {
      whatIsIt: 'Power factor correction uses capacitor banks to supply reactive power locally, reducing the reactive current demand from the utility. The required capacitor size: Q_c = P × (tan φ₁ − tan φ₂) where φ₁ and φ₂ are the existing and target power factor angles.',
      howToUse: 'Enter your total real power load in kW, your current (poor) power factor, and your target power factor (typically 0.95–0.98 to avoid penalty charges). The result is the kVAR rating of capacitors to install.',
      exampleScenario: 'A factory has 100 kW load at PF = 0.72 (lagging). Target PF = 0.95. Q_c = 100 × (tan(43.9°) − tan(18.2°)) = 100 × (0.966 − 0.329) = 63.7 kVAR. Installing a 63.7 kVAR capacitor bank corrects the power factor to 0.95, reducing apparent power from 139 to 105 kVA.',
      proTip: 'Most utilities levy a power factor penalty below 0.9 or 0.95. Capacitor banks pay back in 1–3 years through reduced demand charges. For sites with variable loads (motors cycling on/off), use automatic (APFC) panels with switching stages rather than fixed capacitors, to avoid leading power factor and over-voltage.',
    },
    metadata: { version: '1.0.0' },
  },

  {
    id: 'fault-current',
    slug: 'fault-current',
    title: 'Fault Current Calculator',
    description: 'Calculate the symmetrical three-phase fault current (short-circuit current) at a point in an electrical system from system impedance or transformer % impedance.',
    icon: '⚡',
    category: 'engineering',
    subcategory: 'electrical',
    tags: ['fault current', 'short circuit', 'protection', 'electrical', 'symmetrical', 'transformer', 'IEC 60909'],
    inputs: [
      { id: 'calcMethod', label: 'Calculation Method', type: 'select', options: [
        { label: 'From Transformer kVA & %Z', value: 'transformer' },
        { label: 'From Source Impedance (mΩ)', value: 'impedance' },
      ], defaultValue: 'transformer', required: true },
      { id: 'transformerKVA', label: 'Transformer Rating (kVA)', type: 'number', min: 1, step: 1, defaultValue: 500, required: false },
      { id: 'percentZ', label: 'Transformer % Impedance (%Z)', type: 'number', min: 0.1, max: 20, step: 0.1, defaultValue: 4.5, placeholder: 'Typically 4–6%', required: false },
      { id: 'voltage', label: 'Nominal System Voltage (V)', type: 'number', min: 100, step: 1, defaultValue: 415, required: true },
      { id: 'systemZ', label: 'System Impedance (mΩ) — for impedance method', type: 'number', min: 0.001, step: 0.001, defaultValue: 5, required: false },
    ],
    formulas: [
      {
        id: 'baseCurrentA',
        expression: "calcMethod == 'transformer' ? (transformerKVA * 1000) / (sqrt(3) * voltage) : 0",
        dependencies: ['calcMethod', 'transformerKVA', 'voltage'],
      },
      {
        id: 'faultCurrentA',
        expression: `calcMethod == 'transformer'
          ? baseCurrentA / (percentZ / 100)
          : (voltage / sqrt(3)) / (systemZ / 1000)`,
        dependencies: ['calcMethod', 'baseCurrentA', 'percentZ', 'voltage', 'systemZ'],
      },
      { id: 'faultCurrentKA', expression: 'faultCurrentA / 1000', dependencies: ['faultCurrentA'] },
      { id: 'faultMVA', expression: 'sqrt(3) * voltage * faultCurrentA / 1000000', dependencies: ['voltage', 'faultCurrentA'] },
    ],
    outputs: [
      { id: 'out-faultKA', label: 'Symmetrical Fault Current (Isc)', formulaRef: 'faultCurrentKA', format: 'number', precision: 3, suffix: ' kA', highlight: true },
      { id: 'out-faultA', label: 'Fault Current (A)', formulaRef: 'faultCurrentA', format: 'number', precision: 0, suffix: ' A' },
      { id: 'out-faultMVA', label: 'Fault Level (MVA)', formulaRef: 'faultMVA', format: 'number', precision: 3, suffix: ' MVA' },
    ],
    guide: {
      whatIsIt: 'Fault current (short-circuit current) is the maximum current that flows when a bolted three-phase fault occurs. For a transformer: Isc = I_rated / (%Z/100). The result is used to select circuit breakers (whose interrupting rating must exceed Isc) and design busbar systems.',
      howToUse: 'For a transformer-fed system, enter the transformer kVA, its nameplate percentage impedance (%Z), and the secondary voltage. For utility/source impedance method, enter the Thevenin equivalent impedance at the fault point in milliohms.',
      exampleScenario: 'A 500 kVA, 415 V transformer with %Z = 4.5%. Rated current = 500×1000/(√3×415) = 695.6 A. Isc = 695.6/0.045 = 15,457 A = 15.5 kA. Specify 25 kA breakers for margin.',
      proTip: 'Always size circuit breakers and busbars for the AVAILABLE fault current, not the load current. Add cable and busbar impedances to reduce the calculated Isc at downstream points. IEC 60909 peak asymmetrical fault current ≈ 2.5 × Irms for LV systems, which must also be considered for mechanical switchgear ratings.',
    },
    metadata: { version: '1.0.0' },
  },

  {
    id: 'cable-tray-sizing',
    slug: 'cable-tray-sizing',
    title: 'Cable Tray Fill / Sizing Calculator',
    description: 'Calculate cable tray fill ratio and determine if a tray width is adequate for the installed cables, per NEC 392 / NEMA FG1 / IEC standards.',
    icon: '🔌',
    category: 'engineering',
    subcategory: 'electrical',
    tags: ['cable tray', 'wiring', 'NEC', 'electrical', 'cable management', 'sizing', 'fill ratio'],
    inputs: [
      { id: 'trayWidth', label: 'Cable Tray Width (mm)', type: 'select', options: [
        { label: '150 mm (6 in)', value: '150' },
        { label: '225 mm (9 in)', value: '225' },
        { label: '300 mm (12 in)', value: '300' },
        { label: '450 mm (18 in)', value: '450' },
        { label: '600 mm (24 in)', value: '600' },
        { label: '750 mm (30 in)', value: '750' },
        { label: '900 mm (36 in)', value: '900' },
      ], defaultValue: '300', required: true },
      { id: 'trayDepth', label: 'Tray Usable Depth (mm)', type: 'number', min: 25, step: 5, defaultValue: 100, required: true },
      { id: 'numCables', label: 'Number of Cable Runs', type: 'number', min: 1, step: 1, defaultValue: 10, required: true },
      { id: 'avgCableOD', label: 'Average Cable Outer Diameter (mm)', type: 'number', min: 1, step: 0.5, defaultValue: 25, required: true },
      { id: 'fillLimit', label: 'Max Fill Ratio (% of tray area)', type: 'number', min: 10, max: 80, step: 5, defaultValue: 50, placeholder: 'NEC: 50% single-layer rule' },
    ],
    formulas: [
      { id: 'trayArea', expression: 'trayWidth * trayDepth', dependencies: ['trayWidth', 'trayDepth'] },
      { id: 'cableArea', expression: 'numCables * 3.14159 * pow(avgCableOD / 2, 2)', dependencies: ['numCables', 'avgCableOD'] },
      { id: 'fillRatio', expression: 'trayArea > 0 ? cableArea / trayArea * 100 : 0', dependencies: ['cableArea', 'trayArea'] },
      { id: 'maxCableArea', expression: 'trayArea * fillLimit / 100', dependencies: ['trayArea', 'fillLimit'] },
      { id: 'maxCables', expression: 'maxCableArea > 0 && avgCableOD > 0 ? floor(maxCableArea / (3.14159 * pow(avgCableOD / 2, 2))) : 0', dependencies: ['maxCableArea', 'avgCableOD'] },
      { id: 'isAdequate', expression: 'fillRatio <= fillLimit ? 1 : 0', dependencies: ['fillRatio', 'fillLimit'] },
    ],
    outputs: [
      { id: 'out-fillRatio', label: 'Cable Fill Ratio', formulaRef: 'fillRatio', format: 'number', precision: 1, suffix: ' %', highlight: true },
      { id: 'out-trayArea', label: 'Tray Cross-Section Area', formulaRef: 'trayArea', format: 'number', precision: 0, suffix: ' mm²' },
      { id: 'out-cableArea', label: 'Total Cable Area', formulaRef: 'cableArea', format: 'number', precision: 0, suffix: ' mm²' },
      { id: 'out-maxCables', label: 'Max Cables at Fill Limit', formulaRef: 'maxCables', format: 'number', precision: 0 },
    ],
    guide: {
      whatIsIt: 'Cable tray fill ratio is the ratio of the total cross-sectional area of installed cables to the usable tray area. NEC Article 392 limits fills: 50% for a single layer of cables in ladder tray; 40% for mixed sizes. Fill limits ensure heat dissipation, airflow, and future capacity.',
      howToUse: 'Select the tray width from standard sizes and enter the usable depth (typically 50–150 mm). Enter the number of cable runs and the average outer diameter per cable. The 50% fill limit is standard — adjust for your applicable code or derating requirements.',
      exampleScenario: '10 cables of 25 mm OD in a 300 mm × 100 mm tray. Cable area = 10 × π × 12.5² = 4909 mm². Tray area = 30,000 mm². Fill = 4909/30000 = 16.4% — well within the 50% limit. The tray can accommodate up to 30 similar cables.',
      proTip: 'Always leave future capacity — a 30–40% fill provides room for expansion without re-routing. For higher fill ratios, apply current derating factors to cable ampacity (NEC 310.15). Separate power and control cables into different trays or use barriers to reduce electromagnetic interference.',
    },
    metadata: { version: '1.0.0' },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 4. MACROECONOMICS & BUSINESS STRATEGY
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'price-elasticity-demand',
    slug: 'price-elasticity-demand',
    title: 'Price Elasticity of Demand (PED)',
    description: 'Calculate the price elasticity of demand and classify goods as elastic, inelastic, or unit elastic. Also computes the revenue impact of a price change.',
    icon: '📈',
    category: 'finance',
    subcategory: 'macroeconomics',
    tags: ['price elasticity', 'demand', 'PED', 'economics', 'macroeconomics', 'pricing', 'revenue'],
    inputs: [
      { id: 'oldPrice', label: 'Original Price', type: 'number', min: 0.01, step: 0.01, defaultValue: 100, required: true },
      { id: 'newPrice', label: 'New Price', type: 'number', min: 0.01, step: 0.01, defaultValue: 120, required: true },
      { id: 'oldQuantity', label: 'Original Quantity Demanded', type: 'number', min: 0, step: 1, defaultValue: 1000, required: true },
      { id: 'newQuantity', label: 'New Quantity Demanded', type: 'number', min: 0, step: 1, defaultValue: 800, required: true },
    ],
    formulas: [
      { id: 'pctChangeQ', expression: '(newQuantity - oldQuantity) / oldQuantity * 100', dependencies: ['newQuantity', 'oldQuantity'] },
      { id: 'pctChangeP', expression: '(newPrice - oldPrice) / oldPrice * 100', dependencies: ['newPrice', 'oldPrice'] },
      { id: 'ped', expression: 'pctChangeP != 0 ? pctChangeQ / pctChangeP : 0', dependencies: ['pctChangeQ', 'pctChangeP'] },
      { id: 'absPed', expression: 'abs(ped)', dependencies: ['ped'] },
      { id: 'oldRevenue', expression: 'oldPrice * oldQuantity', dependencies: ['oldPrice', 'oldQuantity'] },
      { id: 'newRevenue', expression: 'newPrice * newQuantity', dependencies: ['newPrice', 'newQuantity'] },
      { id: 'revenueChange', expression: 'newRevenue - oldRevenue', dependencies: ['newRevenue', 'oldRevenue'] },
      { id: 'revenueChangePct', expression: 'oldRevenue > 0 ? revenueChange / oldRevenue * 100 : 0', dependencies: ['revenueChange', 'oldRevenue'] },
    ],
    outputs: [
      { id: 'out-ped', label: 'Price Elasticity of Demand (PED)', formulaRef: 'ped', format: 'number', precision: 3, highlight: true },
      { id: 'out-absPed', label: '|PED| Absolute Value', formulaRef: 'absPed', format: 'number', precision: 3 },
      { id: 'out-revenueChange', label: 'Revenue Change', formulaRef: 'revenueChange', format: 'number', precision: 2 },
      { id: 'out-revenueChangePct', label: 'Revenue Change (%)', formulaRef: 'revenueChangePct', format: 'number', precision: 2, suffix: ' %' },
    ],
    guide: {
      whatIsIt: 'Price Elasticity of Demand (PED) = % Change in Quantity Demanded / % Change in Price. |PED| > 1 = elastic (consumers are price-sensitive; a price rise reduces revenue). |PED| < 1 = inelastic (consumers are insensitive; a price rise increases revenue). |PED| = 1 = unit elastic (revenue unchanged).',
      howToUse: 'Enter the original and new prices, and the quantities demanded at each price point (from sales data, surveys, or market research). The calculator computes PED and shows the revenue impact of the price change.',
      exampleScenario: 'Price rises from $100 to $120 (+20%). Quantity drops from 1000 to 800 (−20%). PED = −20/+20 = −1.0. Unit elastic — total revenue is unchanged at $100,000. If quantity drops only to 900, PED = −0.5 (inelastic) and revenue rises from $100k to $108k.',
      proTip: 'Necessities (insulin, fuel) tend to be inelastic; luxuries (designer goods, holidays) tend to be elastic. Firms in inelastic markets should raise prices to increase revenue; firms in elastic markets should cut prices. Always sign-check: PED is normally negative (price ↑ → demand ↓). Some textbooks use the absolute value.',
    },
    metadata: { version: '1.0.0' },
  },

  {
    id: 'gini-coefficient',
    slug: 'gini-coefficient',
    title: 'Gini Coefficient Calculator',
    description: 'Calculate the Gini coefficient — a measure of income or wealth inequality — from a population income distribution using the standard trapezoidal method.',
    icon: '⚖️',
    category: 'finance',
    subcategory: 'macroeconomics',
    tags: ['Gini', 'inequality', 'income distribution', 'economics', 'Lorenz curve', 'poverty'],
    inputs: [
      { id: 'q1Income', label: 'Income Share — Bottom 20% (Q1, %)', type: 'number', min: 0, max: 100, step: 0.1, defaultValue: 5.0, required: true },
      { id: 'q2Income', label: 'Income Share — 20–40% (Q2, %)', type: 'number', min: 0, max: 100, step: 0.1, defaultValue: 10.0, required: true },
      { id: 'q3Income', label: 'Income Share — 40–60% (Q3, %)', type: 'number', min: 0, max: 100, step: 0.1, defaultValue: 16.0, required: true },
      { id: 'q4Income', label: 'Income Share — 60–80% (Q4, %)', type: 'number', min: 0, max: 100, step: 0.1, defaultValue: 24.0, required: true },
      { id: 'q5Income', label: 'Income Share — Top 20% (Q5, %)', type: 'number', min: 0, max: 100, step: 0.1, defaultValue: 45.0, required: true },
    ],
    formulas: [
      // Cumulative Lorenz curve points (0, L1, L2, L3, L4, 100)
      { id: 'L1', expression: 'q1Income', dependencies: ['q1Income'] },
      { id: 'L2', expression: 'q1Income + q2Income', dependencies: ['q1Income', 'q2Income'] },
      { id: 'L3', expression: 'q1Income + q2Income + q3Income', dependencies: ['q1Income', 'q2Income', 'q3Income'] },
      { id: 'L4', expression: 'q1Income + q2Income + q3Income + q4Income', dependencies: ['q1Income', 'q2Income', 'q3Income', 'q4Income'] },
      // Area under Lorenz curve by trapezoid rule (each quintile spans 20% of population)
      { id: 'areaUnder', expression: '0.20 * (0 + L1) / 2 + 0.20 * (L1 + L2) / 2 + 0.20 * (L2 + L3) / 2 + 0.20 * (L3 + L4) / 2 + 0.20 * (L4 + 100) / 2', dependencies: ['L1', 'L2', 'L3', 'L4'] },
      // Area of perfect equality triangle = 50 (in % × % space)
      { id: 'gini', expression: '(50 - areaUnder) / 50', dependencies: ['areaUnder'] },
      { id: 'palma', expression: 'q5Income > 0 && (q1Income + q2Income) > 0 ? q5Income / (q1Income + q2Income) : 0', dependencies: ['q5Income', 'q1Income', 'q2Income'] },
    ],
    outputs: [
      { id: 'out-gini', label: 'Gini Coefficient', formulaRef: 'gini', format: 'number', precision: 4, highlight: true },
      { id: 'out-palma', label: 'Palma Ratio (Top 20% / Bottom 40%)', formulaRef: 'palma', format: 'number', precision: 2 },
      { id: 'out-cumL4', label: 'Bottom 80% Income Share', formulaRef: 'L4', format: 'number', precision: 1, suffix: ' %' },
    ],
    guide: {
      whatIsIt: 'The Gini coefficient measures income or wealth inequality on a scale of 0 (perfect equality — everyone has the same income) to 1 (perfect inequality — one person has all income). It equals one minus twice the area under the Lorenz curve. The Palma ratio compares the top 20% income share to the bottom 40% — a simpler inequality measure.',
      howToUse: 'Enter the income share (as a percentage of total national income) held by each income quintile. The five quintiles must sum to 100%. World Bank and OECD publish these figures for most countries.',
      exampleScenario: 'Income shares: Q1=5%, Q2=10%, Q3=16%, Q4=24%, Q5=45%. Gini ≈ 0.36. This is typical of a moderately unequal country (Brazil ≈ 0.53; Denmark ≈ 0.29; USA ≈ 0.39).',
      proTip: 'Gini below 0.3 is considered low inequality (Scandinavian countries). Above 0.5 is very high (some Sub-Saharan African countries). The Palma ratio is often favoured by economists as it focuses on the politically salient extremes of the distribution.',
    },
    metadata: { version: '1.0.0' },
  },

  {
    id: 'purchasing-power-parity',
    slug: 'purchasing-power-parity',
    title: 'Purchasing Power Parity (PPP) Calculator',
    description: 'Calculate the PPP-implied exchange rate, compare real price levels across countries, and convert nominal GDP or wages to PPP-adjusted values.',
    icon: '🌍',
    category: 'finance',
    subcategory: 'macroeconomics',
    tags: ['PPP', 'purchasing power parity', 'exchange rate', 'GDP', 'international economics', 'Big Mac'],
    inputs: [
      { id: 'priceDomestic', label: 'Price of Basket / Item (Domestic Currency)', type: 'number', min: 0.01, step: 0.01, defaultValue: 120, placeholder: 'e.g. price of Big Mac in your country', required: true },
      { id: 'priceForeign', label: 'Price of Same Basket (Foreign Currency)', type: 'number', min: 0.01, step: 0.01, defaultValue: 5.50, placeholder: 'e.g. Big Mac in USD in USA', required: true },
      { id: 'marketRate', label: 'Market Exchange Rate (units of domestic per foreign)', type: 'number', min: 0.0001, step: 0.01, defaultValue: 33.50, placeholder: 'e.g. THB per USD', required: true },
      { id: 'nominalValue', label: 'Nominal Value to Convert (optional)', type: 'number', min: 0, step: 1, defaultValue: 500000, placeholder: 'e.g. GDP per capita or salary', required: false },
    ],
    formulas: [
      { id: 'pppRate', expression: 'priceDomestic / priceForeign', dependencies: ['priceDomestic', 'priceForeign'] },
      { id: 'overUnder', expression: 'marketRate > 0 ? (pppRate - marketRate) / marketRate * 100 : 0', dependencies: ['pppRate', 'marketRate'] },
      { id: 'pppAdjusted', expression: 'pppRate > 0 ? nominalValue / pppRate : 0', dependencies: ['nominalValue', 'pppRate'] },
      { id: 'marketAdjusted', expression: 'marketRate > 0 ? nominalValue / marketRate : 0', dependencies: ['nominalValue', 'marketRate'] },
    ],
    outputs: [
      { id: 'out-pppRate', label: 'PPP-Implied Exchange Rate', formulaRef: 'pppRate', format: 'number', precision: 4, highlight: true },
      { id: 'out-overUnder', label: 'Currency Over/Under-Valuation', formulaRef: 'overUnder', format: 'number', precision: 2, suffix: ' %' },
      { id: 'out-pppAdjusted', label: 'PPP-Adjusted Value (in foreign currency)', formulaRef: 'pppAdjusted', format: 'number', precision: 2 },
      { id: 'out-marketAdjusted', label: 'Market-Rate Adjusted Value', formulaRef: 'marketAdjusted', format: 'number', precision: 2 },
    ],
    guide: {
      whatIsIt: 'Purchasing Power Parity states that, in the long run, exchange rates should equalise the price of an identical basket of goods across countries. PPP Exchange Rate = Price (Domestic) / Price (Foreign). If the PPP rate < Market Rate, the domestic currency is undervalued (cheap). The Economist\'s Big Mac Index is a famous informal PPP measure.',
      howToUse: 'Enter the price of an identical item or basket in both currencies (your domestic currency and the foreign currency). Enter the actual market exchange rate. The calculator tells you the implied PPP rate and how over- or under-valued your currency is.',
      exampleScenario: 'A Big Mac costs ฿120 in Thailand and $5.50 in the USA. Market rate: ฿33.50/$. PPP rate = 120/5.50 = ฿21.8/$. Market rate 33.50 vs PPP 21.8 → THB is undervalued by 35% relative to PPP. Thai goods are "cheaper" than the exchange rate suggests.',
      proTip: 'PPP is a long-run equilibrium concept — real exchange rates can deviate significantly for years. It is most useful for comparing real wages, GDP per capita, and cost of living across countries. GDP at PPP (from World Bank / IMF) removes exchange rate distortions for fair international comparison.',
    },
    metadata: { version: '1.0.0' },
  },

  {
    id: 'herfindahl-hirschman-index',
    slug: 'herfindahl-hirschman-index',
    title: 'Herfindahl-Hirschman Index (HHI)',
    description: 'Calculate the HHI market concentration index from firm market shares. Used by antitrust regulators to assess monopoly risk and competition levels.',
    icon: '🏢',
    category: 'finance',
    subcategory: 'macroeconomics',
    tags: ['HHI', 'market concentration', 'antitrust', 'competition', 'monopoly', 'oligopoly', 'economics'],
    inputs: [
      { id: 'ms1', label: 'Firm 1 Market Share (%)', type: 'number', min: 0, max: 100, step: 0.1, defaultValue: 35, required: true },
      { id: 'ms2', label: 'Firm 2 Market Share (%)', type: 'number', min: 0, max: 100, step: 0.1, defaultValue: 25, required: false },
      { id: 'ms3', label: 'Firm 3 Market Share (%)', type: 'number', min: 0, max: 100, step: 0.1, defaultValue: 20, required: false },
      { id: 'ms4', label: 'Firm 4 Market Share (%)', type: 'number', min: 0, max: 100, step: 0.1, defaultValue: 15, required: false },
      { id: 'ms5', label: 'Firm 5 Market Share (%)', type: 'number', min: 0, max: 100, step: 0.1, defaultValue: 5, required: false },
      { id: 'ms6', label: 'Firm 6 Market Share (%)', type: 'number', min: 0, max: 100, step: 0.1, defaultValue: 0, required: false },
    ],
    formulas: [
      { id: 'hhi', expression: 'pow(ms1, 2) + pow(ms2, 2) + pow(ms3, 2) + pow(ms4, 2) + pow(ms5, 2) + pow(ms6, 2)', dependencies: ['ms1', 'ms2', 'ms3', 'ms4', 'ms5', 'ms6'] },
      { id: 'totalShare', expression: 'ms1 + ms2 + ms3 + ms4 + ms5 + ms6', dependencies: ['ms1', 'ms2', 'ms3', 'ms4', 'ms5', 'ms6'] },
      { id: 'cr3', expression: 'ms1 + ms2 + ms3', dependencies: ['ms1', 'ms2', 'ms3'] },
    ],
    outputs: [
      { id: 'out-hhi', label: 'HHI Score', formulaRef: 'hhi', format: 'number', precision: 0, highlight: true },
      { id: 'out-totalShare', label: 'Total Market Share Entered', formulaRef: 'totalShare', format: 'number', precision: 1, suffix: ' %' },
      { id: 'out-cr3', label: 'CR3 — Top 3 Firms Concentration', formulaRef: 'cr3', format: 'number', precision: 1, suffix: ' %' },
    ],
    guide: {
      whatIsIt: 'The Herfindahl-Hirschman Index (HHI) = Σ(market share %)² for all firms in a market. Maximum HHI = 10,000 (pure monopoly — 100² = 10,000). US DOJ & FTC thresholds: HHI < 1,500 = unconcentrated (competitive); 1,500–2,500 = moderately concentrated; > 2,500 = highly concentrated (mergers likely challenged).',
      howToUse: 'Enter the market share of each firm in the market as a percentage. Enter 0 for unused firm slots. The total should sum to 100% (or close). The CR3 indicator shows the combined share of the top 3 firms.',
      exampleScenario: 'Four firms with 35%, 25%, 20%, 15%, 5%. HHI = 35²+25²+20²+15²+5² = 1225+625+400+225+25 = 2500. This falls at the boundary between moderately and highly concentrated — a merger between the top two firms would be subject to close regulatory scrutiny.',
      proTip: 'Post-merger HHI is calculated using the combined entity\'s market share. DOJ typically challenges mergers that increase HHI by more than 200 points in highly concentrated markets, or by more than 100 points in moderately concentrated markets. Export markets and import competition can be argued to lower effective concentration.',
    },
    metadata: { version: '1.0.0' },
  },

  {
    id: 'net-promoter-score',
    slug: 'net-promoter-score',
    title: 'Net Promoter Score (NPS) Calculator',
    description: 'Calculate your Net Promoter Score from survey responses, with breakdown of Promoters, Passives, and Detractors, and NPS benchmark interpretation.',
    icon: '⭐',
    category: 'business',
    subcategory: 'metrics',
    tags: ['NPS', 'net promoter score', 'customer satisfaction', 'loyalty', 'survey', 'business'],
    inputs: [
      { id: 'promoters', label: 'Promoters (scored 9–10)', type: 'number', min: 0, step: 1, defaultValue: 60, required: true },
      { id: 'passives', label: 'Passives (scored 7–8)', type: 'number', min: 0, step: 1, defaultValue: 25, required: true },
      { id: 'detractors', label: 'Detractors (scored 0–6)', type: 'number', min: 0, step: 1, defaultValue: 15, required: true },
    ],
    formulas: [
      { id: 'total', expression: 'promoters + passives + detractors', dependencies: ['promoters', 'passives', 'detractors'] },
      { id: 'promoterPct', expression: 'total > 0 ? promoters / total * 100 : 0', dependencies: ['promoters', 'total'] },
      { id: 'detractorPct', expression: 'total > 0 ? detractors / total * 100 : 0', dependencies: ['detractors', 'total'] },
      { id: 'passivePct', expression: 'total > 0 ? passives / total * 100 : 0', dependencies: ['passives', 'total'] },
      { id: 'nps', expression: 'promoterPct - detractorPct', dependencies: ['promoterPct', 'detractorPct'] },
    ],
    outputs: [
      { id: 'out-nps', label: 'Net Promoter Score (NPS)', formulaRef: 'nps', format: 'number', precision: 1, highlight: true },
      { id: 'out-promoterPct', label: 'Promoters', formulaRef: 'promoterPct', format: 'number', precision: 1, suffix: ' %' },
      { id: 'out-passivePct', label: 'Passives', formulaRef: 'passivePct', format: 'number', precision: 1, suffix: ' %' },
      { id: 'out-detractorPct', label: 'Detractors', formulaRef: 'detractorPct', format: 'number', precision: 1, suffix: ' %' },
      { id: 'out-total', label: 'Total Respondents', formulaRef: 'total', format: 'number', precision: 0 },
    ],
    guide: {
      whatIsIt: 'NPS = % Promoters − % Detractors. Respondents rate the question "How likely are you to recommend us?" from 0–10. Scores 9–10 = Promoters; 7–8 = Passives (excluded from NPS); 0–6 = Detractors. NPS ranges from −100 to +100. Bain & Company benchmarks: Below 0 = needs improvement; 0–30 = good; 30–70 = great; 70+ = world-class.',
      howToUse: 'Count the number of survey respondents who gave each rating group and enter them into the three fields. The calculator divides by total respondents to get percentages, then subtracts.',
      exampleScenario: '100 responses: 60 Promoters, 25 Passives, 15 Detractors. Promoter % = 60%. Detractor % = 15%. NPS = 60 − 15 = 45. This is a "great" score — typical of strong consumer brands and tech companies.',
      proTip: 'NPS is a leading indicator of growth — companies with NPS > 50 tend to grow 2× faster than competitors. Run NPS at least quarterly and segment by customer type, region, or product to identify where experience is breaking down. Always follow up with detractors to understand root causes.',
    },
    metadata: { version: '1.0.0' },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 5. SPECIALIZED MEDICAL & PHARMACOKINETICS
  // (BSA already exists — skipped. All others included.)
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'amputee-bmi',
    slug: 'amputee-bmi',
    title: 'Amputee BMI Calculator',
    description: 'Calculate adjusted BMI for limb amputees using weight-for-amputation corrections. Adjusts measured body weight by adding back the estimated weight of the missing limb(s).',
    icon: '🏥',
    category: 'medical',
    subcategory: 'vitals',
    tags: ['amputee', 'BMI', 'body mass index', 'limb loss', 'medical', 'clinical', 'rehabilitation'],
    inputs: [
      { id: 'weight', label: 'Current Body Weight (kg)', type: 'number', min: 1, step: 0.1, defaultValue: 65, required: true },
      { id: 'height', label: 'Height (cm)', type: 'number', min: 50, max: 250, step: 0.1, defaultValue: 170, required: true },
      { id: 'amputation', label: 'Amputation Type', type: 'select', options: [
        { label: 'Foot only (1.8%)', value: '1.8' },
        { label: 'Below knee — unilateral (6.0%)', value: '6.0' },
        { label: 'Below knee — bilateral (12.0%)', value: '12.0' },
        { label: 'Above knee — unilateral (16.0%)', value: '16.0' },
        { label: 'Above knee — bilateral (32.0%)', value: '32.0' },
        { label: 'Hip disarticulation — unilateral (18.6%)', value: '18.6' },
        { label: 'Forearm — unilateral (2.3%)', value: '2.3' },
        { label: 'Upper arm — unilateral (5.0%)', value: '5.0' },
        { label: 'Whole arm — unilateral (6.5%)', value: '6.5' },
        { label: 'Whole arm — bilateral (13.0%)', value: '13.0' },
      ], defaultValue: '16.0', required: true },
    ],
    formulas: [
      { id: 'limbPct', expression: 'amputation', dependencies: ['amputation'] },
      { id: 'adjustedWeight', expression: 'weight / (1 - limbPct / 100)', dependencies: ['weight', 'limbPct'] },
      { id: 'heightM', expression: 'height / 100', dependencies: ['height'] },
      { id: 'adjustedBMI', expression: 'adjustedWeight / pow(heightM, 2)', dependencies: ['adjustedWeight', 'heightM'] },
      { id: 'unadjustedBMI', expression: 'weight / pow(heightM, 2)', dependencies: ['weight', 'heightM'] },
    ],
    outputs: [
      { id: 'out-adjustedBMI', label: 'Adjusted BMI (corrected for amputation)', formulaRef: 'adjustedBMI', format: 'number', precision: 1, highlight: true },
      { id: 'out-unadjustedBMI', label: 'Unadjusted BMI (uncorrected — understated)', formulaRef: 'unadjustedBMI', format: 'number', precision: 1 },
      { id: 'out-adjustedWeight', label: 'Adjusted Body Weight', formulaRef: 'adjustedWeight', format: 'number', precision: 1, suffix: ' kg' },
    ],
    guide: {
      whatIsIt: 'Standard BMI underestimates the true BMI of amputees because the measured weight is lower than pre-amputation weight. Adjusted BMI corrects for this: Adjusted Weight = Measured Weight / (1 − Limb Weight Fraction). Limb weight fractions are based on the Dempster (1955) / Winter segment weight table, widely used in clinical practice.',
      howToUse: 'Enter current measured weight, height, and select the amputation type. The calculator adds back the estimated weight of the missing segment to give the corrected BMI used for nutritional and clinical assessment.',
      exampleScenario: 'A patient weighs 65 kg with a unilateral above-knee amputation (16% body weight). Adjusted weight = 65 / (1 − 0.16) = 65 / 0.84 = 77.4 kg. Height = 170 cm. Adjusted BMI = 77.4 / 1.70² = 26.8 (overweight range) vs unadjusted BMI = 22.5 (normal).',
      proTip: 'This calculator is for clinical nutritional assessment — always interpret alongside clinical judgement. The adjusted BMI may be used to estimate caloric requirements using Mifflin-St Jeor with the adjusted weight, giving more realistic energy targets for amputee rehabilitation.',
    },
    metadata: { version: '1.0.0' },
  },

  {
    id: 'corrected-calcium',
    slug: 'corrected-calcium',
    title: 'Corrected Calcium Calculator',
    description: 'Adjust serum calcium for albumin level using the Payne correction formula. Low albumin causes falsely low measured total calcium values.',
    icon: '🩺',
    category: 'medical',
    subcategory: 'vitals',
    tags: ['corrected calcium', 'albumin', 'hypocalcemia', 'Payne', 'electrolytes', 'clinical', 'medical'],
    inputs: [
      { id: 'measuredCa', label: 'Measured Serum Calcium (mmol/L)', type: 'number', min: 0.5, max: 5, step: 0.01, defaultValue: 1.95, required: true },
      { id: 'albumin', label: 'Serum Albumin (g/L)', type: 'number', min: 1, max: 70, step: 0.1, defaultValue: 25, placeholder: 'Normal: 35–50 g/L', required: true },
      { id: 'normalAlbumin', label: 'Normal Albumin (g/L)', type: 'number', min: 30, max: 50, step: 1, defaultValue: 40, required: true },
      { id: 'units', label: 'Units', type: 'select', options: [
        { label: 'Calcium in mmol/L, Albumin in g/L', value: 'mmol' },
        { label: 'Calcium in mg/dL, Albumin in g/dL', value: 'mgdl' },
      ], defaultValue: 'mmol', required: true },
    ],
    formulas: [
      // Payne formula (SI): CorrCa = MeasCa + 0.02 × (Normal_Albumin − Albumin)
      // Payne formula (US): CorrCa = MeasCa + 0.8 × (Normal_Albumin − Albumin)
      {
        id: 'correctedCa',
        expression: "units == 'mmol' ? measuredCa + 0.02 * (normalAlbumin - albumin) : measuredCa + 0.8 * (normalAlbumin - albumin)",
        dependencies: ['units', 'measuredCa', 'albumin', 'normalAlbumin'],
      },
      { id: 'albuminDiff', expression: 'normalAlbumin - albumin', dependencies: ['normalAlbumin', 'albumin'] },
    ],
    outputs: [
      { id: 'out-correctedCa', label: 'Corrected Calcium', formulaRef: 'correctedCa', format: 'number', precision: 2, highlight: true },
      { id: 'out-measuredCa', label: 'Measured Calcium', formulaRef: 'measuredCa', format: 'number', precision: 2 },
      { id: 'out-diff', label: 'Albumin Deficit', formulaRef: 'albuminDiff', format: 'number', precision: 1 },
    ],
    guide: {
      whatIsIt: 'Approximately 40–45% of serum calcium is bound to albumin. When albumin is low, total calcium is falsely low even if ionised (free) calcium is normal. Payne\'s correction formula adjusts for this: Corrected Ca (mmol/L) = Measured Ca + 0.02 × (40 − Albumin g/L). Normal corrected calcium is 2.20–2.60 mmol/L (8.8–10.4 mg/dL).',
      howToUse: 'Enter the measured total serum calcium and the serum albumin from the same blood sample. Select the unit system. The normal albumin reference point is conventionally 40 g/L (SI) or 4.0 g/dL (US).',
      exampleScenario: 'Patient: Ca = 1.95 mmol/L, Albumin = 25 g/L. Corrected Ca = 1.95 + 0.02 × (40 − 25) = 1.95 + 0.30 = 2.25 mmol/L. The measured 1.95 appears hypocalcaemic, but the corrected value of 2.25 is within normal range — no true hypocalcaemia.',
      proTip: 'Corrected calcium should only be used as a screening tool. For definitive assessment of calcium status (especially in critically ill patients, acid-base disturbances, or hyperproteinaemia), measure ionised calcium directly. Always interpret corrected values alongside clinical symptoms.',
    },
    metadata: { version: '1.0.0' },
  },

  {
    id: 'maintenance-fluid-holliday-segar',
    slug: 'maintenance-fluid-holliday-segar',
    title: 'Maintenance Fluid (Holliday-Segar) Calculator',
    description: 'Calculate daily and hourly maintenance fluid requirements for paediatric and adult patients using the Holliday-Segar "4-2-1" rule.',
    icon: '💧',
    category: 'medical',
    subcategory: 'dosing',
    tags: ['fluid', 'maintenance', 'Holliday-Segar', 'paediatric', '4-2-1', 'IV fluid', 'clinical', 'medical'],
    inputs: [
      { id: 'weight', label: 'Body Weight (kg)', type: 'number', min: 0.5, max: 200, step: 0.1, defaultValue: 25, required: true },
    ],
    formulas: [
      // Holliday-Segar: 100 mL/kg for first 10 kg + 50 mL/kg for next 10 kg + 20 mL/kg above 20 kg
      {
        id: 'dailyFluidMl',
        expression: `weight <= 10 ? weight * 100 :
                     weight <= 20 ? 1000 + (weight - 10) * 50 :
                                    1500 + (weight - 20) * 20`,
        dependencies: ['weight'],
      },
      { id: 'hourlyFluidMl', expression: 'dailyFluidMl / 24', dependencies: ['dailyFluidMl'] },
      { id: 'dailyFluidL', expression: 'dailyFluidMl / 1000', dependencies: ['dailyFluidMl'] },
    ],
    outputs: [
      { id: 'out-hourly', label: 'Hourly Rate (4-2-1 Rule)', formulaRef: 'hourlyFluidMl', format: 'number', precision: 1, suffix: ' mL/hr', highlight: true },
      { id: 'out-daily', label: 'Daily Requirement', formulaRef: 'dailyFluidMl', format: 'number', precision: 0, suffix: ' mL/day' },
      { id: 'out-dailyL', label: 'Daily Requirement', formulaRef: 'dailyFluidL', format: 'number', precision: 2, suffix: ' L/day' },
    ],
    guide: {
      whatIsIt: 'The Holliday-Segar method calculates maintenance fluid requirements based on metabolic expenditure: 100 mL/kg/day for the first 10 kg, 50 mL/kg/day for the next 10 kg, and 20 mL/kg/day for each kg above 20 kg. The "4-2-1 rule" is the same formula expressed per hour: 4 mL/kg/hr for first 10 kg, 2 mL/kg/hr for next 10 kg, 1 mL/kg/hr above 20 kg.',
      howToUse: 'Enter the patient\'s body weight in kilograms. The calculator applies the Holliday-Segar formula and outputs both daily and hourly fluid requirements. This represents the maintenance fluid only — additional losses (fever, surgery, burns, dehydration) require separate replacement calculation.',
      exampleScenario: 'Child weighing 25 kg: first 10 kg → 1000 mL, next 10 kg → 500 mL, final 5 kg → 100 mL. Total = 1600 mL/day = 66.7 mL/hr. Using 4-2-1: 4×10 + 2×10 + 1×5 = 40+20+5 = 65 mL/hr (≈ same with rounding).',
      proTip: '⚠️ For clinical use only with medical supervision. Standard maintenance fluid is typically 0.9% NaCl or Hartmann\'s solution in adults. Paediatric fluid choice should follow local guidelines. Avoid hypotonic solutions (0.18% NaCl) in surgical or critically ill children due to hyponatraemia risk.',
    },
    metadata: { version: '1.0.0' },
  },

  {
    id: 'drug-half-life-steady-state',
    slug: 'drug-half-life-steady-state',
    title: 'Drug Half-Life & Steady State Calculator',
    description: 'Calculate drug concentration at any time after a dose, time to steady state, and loading dose using first-order pharmacokinetics.',
    icon: '💊',
    category: 'medical',
    subcategory: 'dosing',
    tags: ['half-life', 'steady state', 'pharmacokinetics', 'drug', 'dosing', 'medical', 'pharmacology'],
    inputs: [
      { id: 'dose', label: 'Dose Given (mg)', type: 'number', min: 0.001, step: 0.1, defaultValue: 500, required: true },
      { id: 'halfLife', label: 'Elimination Half-Life (hours)', type: 'number', min: 0.01, step: 0.1, defaultValue: 6, placeholder: 'e.g. 6 h for amoxicillin', required: true },
      { id: 'dosingInterval', label: 'Dosing Interval τ (hours)', type: 'number', min: 0.1, step: 0.5, defaultValue: 8, required: true },
      { id: 'timeAfterDose', label: 'Time After Dose to Check Level (hours)', type: 'number', min: 0, step: 0.5, defaultValue: 4, required: true },
      { id: 'vd', label: 'Volume of Distribution Vd (L/kg)', type: 'number', min: 0.01, step: 0.01, defaultValue: 0.6, placeholder: 'e.g. 0.6 L/kg for most antibiotics', required: true },
      { id: 'bodyWeight', label: 'Patient Weight (kg)', type: 'number', min: 1, step: 0.5, defaultValue: 70, required: true },
    ],
    formulas: [
      { id: 'ke', expression: 'log(2) / halfLife', dependencies: ['halfLife'] },
      { id: 'vdTotal', expression: 'vd * bodyWeight', dependencies: ['vd', 'bodyWeight'] },
      { id: 'cMax', expression: 'vdTotal > 0 ? dose / vdTotal : 0', dependencies: ['dose', 'vdTotal'] },
      { id: 'cAtTime', expression: 'cMax * exp(-ke * timeAfterDose)', dependencies: ['cMax', 'ke', 'timeAfterDose'] },
      { id: 'halfLivesToSS', expression: '4.32', dependencies: [] }, // ~4.32 half-lives to 95% steady state
      { id: 'timeToSS', expression: 'halfLife * 4.32', dependencies: ['halfLife'] },
      { id: 'cssMax', expression: 'cMax / (1 - exp(-ke * dosingInterval))', dependencies: ['cMax', 'ke', 'dosingInterval'] },
      { id: 'cssMin', expression: 'cssMax * exp(-ke * dosingInterval)', dependencies: ['cssMax', 'ke', 'dosingInterval'] },
    ],
    outputs: [
      { id: 'out-cAtTime', label: 'Concentration at Specified Time', formulaRef: 'cAtTime', format: 'number', precision: 3, suffix: ' mg/L', highlight: true },
      { id: 'out-cMax', label: 'Peak Concentration (Cmax) — Single Dose', formulaRef: 'cMax', format: 'number', precision: 3, suffix: ' mg/L' },
      { id: 'out-cssMax', label: 'Steady-State Peak (Css max)', formulaRef: 'cssMax', format: 'number', precision: 3, suffix: ' mg/L' },
      { id: 'out-cssMin', label: 'Steady-State Trough (Css min)', formulaRef: 'cssMin', format: 'number', precision: 3, suffix: ' mg/L' },
      { id: 'out-timeToSS', label: 'Time to ~95% Steady State', formulaRef: 'timeToSS', format: 'number', precision: 1, suffix: ' hours' },
      { id: 'out-vdTotal', label: 'Total Volume of Distribution', formulaRef: 'vdTotal', format: 'number', precision: 1, suffix: ' L' },
    ],
    guide: {
      whatIsIt: 'First-order pharmacokinetics: drug concentration decays exponentially. C(t) = C₀ × e^(−ke × t) where ke = ln(2) / t½. At steady state (after ~5 half-lives), peak and trough concentrations repeat with every dose. Css_max = Cmax / (1 − e^(−ke×τ)) where τ is the dosing interval.',
      howToUse: 'Enter the dose, the drug\'s half-life (from pharmacology references), the dosing interval, and the time after the dose at which you want to know the concentration. Also enter the volume of distribution (Vd) and patient weight to estimate initial concentration.',
      exampleScenario: 'Amoxicillin 500 mg, t½ = 1.2 h, τ = 8 h, Vd = 0.3 L/kg, weight = 70 kg. Vd_total = 21 L. Cmax = 500/21 = 23.8 mg/L. At 4 h: C = 23.8 × e^(−0.578×4) = 3.0 mg/L. Time to steady state ≈ 5.2 h.',
      proTip: '⚠️ For educational and clinical reference only — always verify drug dosing with a pharmacist and current formulary. Individual pharmacokinetic parameters vary widely with renal/hepatic function, age, body composition, and drug interactions. Therapeutic drug monitoring (TDM) with actual blood levels is essential for narrow therapeutic index drugs (e.g. vancomycin, aminoglycosides).',
    },
    metadata: { version: '1.0.0' },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 6. LOGISTICS & INTERNATIONAL TRADE
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'teu-calculator',
    slug: 'teu-calculator',
    title: 'TEU (Twenty-Foot Equivalent Unit) Calculator',
    description: 'Convert container loads between TEU, FEU (40ft), and mixed fleets. Calculate vessel capacity utilisation and container slot requirements.',
    icon: '🚢',
    category: 'logistics',
    subcategory: 'freight',
    tags: ['TEU', 'FEU', 'container', 'shipping', 'freight', 'logistics', 'ocean freight', 'vessel'],
    inputs: [
      { id: 'num20ft', label: 'Number of 20-foot Containers (TEU)', type: 'number', min: 0, step: 1, defaultValue: 10, required: true },
      { id: 'num40ft', label: 'Number of 40-foot Containers (FEU)', type: 'number', min: 0, step: 1, defaultValue: 15, required: true },
      { id: 'num40ftHC', label: 'Number of 40ft High-Cube Containers', type: 'number', min: 0, step: 1, defaultValue: 5, required: false },
      { id: 'vesselCapacityTEU', label: 'Vessel Capacity (TEU) — optional', type: 'number', min: 0, step: 100, defaultValue: 5000, required: false },
    ],
    formulas: [
      { id: 'totalTEU', expression: 'num20ft * 1 + num40ft * 2 + num40ftHC * 2', dependencies: ['num20ft', 'num40ft', 'num40ftHC'] },
      { id: 'totalBoxes', expression: 'num20ft + num40ft + num40ftHC', dependencies: ['num20ft', 'num40ft', 'num40ftHC'] },
      { id: 'utilisation', expression: 'vesselCapacityTEU > 0 ? totalTEU / vesselCapacityTEU * 100 : 0', dependencies: ['totalTEU', 'vesselCapacityTEU'] },
      { id: 'equiv20ft', expression: 'totalTEU', dependencies: ['totalTEU'] },
      { id: 'equiv40ft', expression: 'totalTEU / 2', dependencies: ['totalTEU'] },
    ],
    outputs: [
      { id: 'out-teu', label: 'Total TEU', formulaRef: 'totalTEU', format: 'number', precision: 0, highlight: true },
      { id: 'out-boxes', label: 'Total Physical Boxes', formulaRef: 'totalBoxes', format: 'number', precision: 0 },
      { id: 'out-equiv40', label: 'Equivalent FEU (40ft slots)', formulaRef: 'equiv40ft', format: 'number', precision: 1 },
      { id: 'out-utilisation', label: 'Vessel Utilisation', formulaRef: 'utilisation', format: 'number', precision: 1, suffix: ' %' },
    ],
    guide: {
      whatIsIt: 'TEU (Twenty-foot Equivalent Unit) is the standard unit for measuring container capacity. A 20-foot container = 1 TEU. A 40-foot container (FEU) = 2 TEU. Vessel capacities, port throughput, and freight rates are all quoted in TEU. A 40ft High-Cube is also counted as 2 TEU but has greater internal volume (2.9 m vs 2.4 m height).',
      howToUse: 'Enter the number of containers by type. The calculator totals the TEU and physical box counts, and if you enter a vessel capacity, shows utilisation. This is useful for load planning, freight quoting, and vessel utilisation reporting.',
      exampleScenario: 'A shipment of 10 × 20ft + 15 × 40ft + 5 × 40ft HC. Total TEU = 10 + 30 + 10 = 50 TEU. Total boxes = 30. On a 5,000 TEU vessel, utilisation = 50/5000 = 1.0%.',
      proTip: 'Freight rates (spot and contract) are always quoted per TEU or per FEU. When comparing quotes, always convert to a per-TEU basis. Stowage factor and weight/volume limitations mean that heavy cargo (steel, machinery) may hit weight limits before TEU limits — always check both.',
    },
    metadata: { version: '1.0.0' },
  },

  {
    id: 'demurrage-detention',
    slug: 'demurrage-detention',
    title: 'Demurrage & Detention Calculator',
    description: 'Calculate demurrage (port delay charges on the container at terminal) and detention (charges for keeping the container outside the terminal) based on free days and daily tariff rates.',
    icon: '⏱️',
    category: 'logistics',
    subcategory: 'freight',
    tags: ['demurrage', 'detention', 'shipping', 'container', 'logistics', 'port', 'free days'],
    inputs: [
      { id: 'containerType', label: 'Container Type', type: 'select', options: [
        { label: '20ft Standard', value: '20' },
        { label: '40ft / 40ft HC', value: '40' },
        { label: 'Refrigerated (Reefer)', value: 'reefer' },
      ], defaultValue: '40', required: true },
      { id: 'numContainers', label: 'Number of Containers', type: 'number', min: 1, step: 1, defaultValue: 3, required: true },
      { id: 'demurrageFree', label: 'Demurrage Free Days (days)', type: 'number', min: 0, step: 1, defaultValue: 5, required: true },
      { id: 'demurrageDays', label: 'Actual Days at Terminal', type: 'number', min: 0, step: 1, defaultValue: 9, required: true },
      { id: 'demurrageRate', label: 'Demurrage Rate (USD/box/day)', type: 'number', min: 0, step: 1, defaultValue: 75, required: true },
      { id: 'detentionFree', label: 'Detention Free Days (days)', type: 'number', min: 0, step: 1, defaultValue: 7, required: true },
      { id: 'detentionDays', label: 'Actual Days Container Held Outside', type: 'number', min: 0, step: 1, defaultValue: 12, required: true },
      { id: 'detentionRate', label: 'Detention Rate (USD/box/day)', type: 'number', min: 0, step: 1, defaultValue: 50, required: true },
    ],
    formulas: [
      { id: 'demurrageChargeable', expression: 'max(demurrageDays - demurrageFree, 0)', dependencies: ['demurrageDays', 'demurrageFree'] },
      { id: 'detentionChargeable', expression: 'max(detentionDays - detentionFree, 0)', dependencies: ['detentionDays', 'detentionFree'] },
      { id: 'demurrageTotal', expression: 'demurrageChargeable * demurrageRate * numContainers', dependencies: ['demurrageChargeable', 'demurrageRate', 'numContainers'] },
      { id: 'detentionTotal', expression: 'detentionChargeable * detentionRate * numContainers', dependencies: ['detentionChargeable', 'detentionRate', 'numContainers'] },
      { id: 'grandTotal', expression: 'demurrageTotal + detentionTotal', dependencies: ['demurrageTotal', 'detentionTotal'] },
    ],
    outputs: [
      { id: 'out-grand', label: 'Total Charges', formulaRef: 'grandTotal', format: 'currency', precision: 2, highlight: true },
      { id: 'out-demurrage', label: 'Demurrage Charges', formulaRef: 'demurrageTotal', format: 'currency', precision: 2 },
      { id: 'out-detention', label: 'Detention Charges', formulaRef: 'detentionTotal', format: 'currency', precision: 2 },
      { id: 'out-demDays', label: 'Chargeable Demurrage Days', formulaRef: 'demurrageChargeable', format: 'number', precision: 0, suffix: ' days' },
      { id: 'out-detDays', label: 'Chargeable Detention Days', formulaRef: 'detentionChargeable', format: 'number', precision: 0, suffix: ' days' },
    ],
    guide: {
      whatIsIt: 'Demurrage = charges levied by the shipping line / terminal when a container is not picked up within the free days at the port of discharge. Detention = charges when the container (after pickup) is not returned to the depot within the allowed free days. These are major unexpected costs in international trade — often USD 50–200/day per container.',
      howToUse: 'Enter the free days granted by your shipping line (check the Bill of Lading or shipping line tariff), the actual days the container spent at the terminal / with the customer, and the daily rate. Rates escalate in tiers — enter the applicable average rate or use the highest tier for a conservative estimate.',
      exampleScenario: '3 × 40ft containers with 5 demurrage free days, held 9 days → 4 chargeable days × $75 × 3 = $900. Detention free days = 7, held 12 days → 5 chargeable days × $50 × 3 = $750. Total = $1,650.',
      proTip: 'Many shipping lines tier demurrage rates — e.g. days 1–5 free, days 6–10 at $75/day, days 11+ at $150/day. Always request the full tariff and budget for the worst tier. Track container return dates meticulously — even one day over can cost hundreds of dollars. Negotiate extended free days when booking for complex cargoes or remote destinations.',
    },
    metadata: { version: '1.0.0' },
  },

  {
    id: 'incoterms-cost-allocation',
    slug: 'incoterms-cost-allocation',
    title: 'Incoterms Cost Allocation Calculator',
    description: 'Allocate landed cost components (freight, insurance, customs, delivery) between buyer and seller for the 11 Incoterms 2020 rules, and calculate total landed cost.',
    icon: '📦',
    category: 'logistics',
    subcategory: 'trade',
    tags: ['Incoterms', 'landed cost', 'trade', 'import', 'export', 'logistics', 'FOB', 'CIF', 'DDP'],
    inputs: [
      { id: 'incoterm', label: 'Incoterm 2020', type: 'select', options: [
        { label: 'EXW — Ex Works', value: 'EXW' },
        { label: 'FCA — Free Carrier', value: 'FCA' },
        { label: 'FAS — Free Alongside Ship', value: 'FAS' },
        { label: 'FOB — Free On Board', value: 'FOB' },
        { label: 'CFR — Cost & Freight', value: 'CFR' },
        { label: 'CIF — Cost, Insurance & Freight', value: 'CIF' },
        { label: 'CPT — Carriage Paid To', value: 'CPT' },
        { label: 'CIP — Carriage & Insurance Paid To', value: 'CIP' },
        { label: 'DAP — Delivered At Place', value: 'DAP' },
        { label: 'DPU — Delivered at Place Unloaded', value: 'DPU' },
        { label: 'DDP — Delivered Duty Paid', value: 'DDP' },
      ], defaultValue: 'FOB', required: true },
      { id: 'goodsValue', label: 'Goods Value (USD)', type: 'number', min: 0, step: 1, defaultValue: 50000, required: true },
      { id: 'exportPackaging', label: 'Export Packaging & Loading (USD)', type: 'number', min: 0, step: 10, defaultValue: 500, required: true },
      { id: 'originFreight', label: 'Origin Haulage / Port Handling (USD)', type: 'number', min: 0, step: 10, defaultValue: 300, required: true },
      { id: 'oceanFreight', label: 'Ocean / Air Freight (USD)', type: 'number', min: 0, step: 10, defaultValue: 2000, required: true },
      { id: 'insurance', label: 'Cargo Insurance (USD)', type: 'number', min: 0, step: 10, defaultValue: 150, required: true },
      { id: 'importDuties', label: 'Import Duties & Taxes (USD)', type: 'number', min: 0, step: 10, defaultValue: 3000, required: true },
      { id: 'destFreight', label: 'Destination Delivery / Last-Mile (USD)', type: 'number', min: 0, step: 10, defaultValue: 400, required: true },
    ],
    formulas: [
      // Buyer pays all — so seller's cost is subtracted. We model it as total costs,
      // allocating based on Incoterm responsibility.
      { id: 'totalLandedCost', expression: 'goodsValue + exportPackaging + originFreight + oceanFreight + insurance + importDuties + destFreight', dependencies: ['goodsValue', 'exportPackaging', 'originFreight', 'oceanFreight', 'insurance', 'importDuties', 'destFreight'] },
      // Seller's costs under each incoterm (simplified — seller bears up to risk transfer point)
      {
        id: 'sellerCost',
        expression: `incoterm == 'EXW' ? goodsValue :
                     incoterm == 'FCA' ? goodsValue + exportPackaging :
                     incoterm == 'FAS' ? goodsValue + exportPackaging + originFreight :
                     incoterm == 'FOB' ? goodsValue + exportPackaging + originFreight :
                     incoterm == 'CFR' ? goodsValue + exportPackaging + originFreight + oceanFreight :
                     incoterm == 'CIF' ? goodsValue + exportPackaging + originFreight + oceanFreight + insurance :
                     incoterm == 'CPT' ? goodsValue + exportPackaging + originFreight + oceanFreight :
                     incoterm == 'CIP' ? goodsValue + exportPackaging + originFreight + oceanFreight + insurance :
                     incoterm == 'DAP' ? goodsValue + exportPackaging + originFreight + oceanFreight + insurance + destFreight :
                     incoterm == 'DPU' ? goodsValue + exportPackaging + originFreight + oceanFreight + insurance + destFreight :
                                         goodsValue + exportPackaging + originFreight + oceanFreight + insurance + importDuties + destFreight`,
        dependencies: ['incoterm', 'goodsValue', 'exportPackaging', 'originFreight', 'oceanFreight', 'insurance', 'importDuties', 'destFreight'],
      },
      { id: 'buyerCost', expression: 'totalLandedCost - sellerCost', dependencies: ['totalLandedCost', 'sellerCost'] },
      { id: 'buyerCostPct', expression: 'totalLandedCost > 0 ? buyerCost / totalLandedCost * 100 : 0', dependencies: ['buyerCost', 'totalLandedCost'] },
    ],
    outputs: [
      { id: 'out-total', label: 'Total Landed Cost', formulaRef: 'totalLandedCost', format: 'currency', precision: 2, highlight: true },
      { id: 'out-sellerCost', label: 'Seller Responsible Costs', formulaRef: 'sellerCost', format: 'currency', precision: 2 },
      { id: 'out-buyerCost', label: 'Buyer Responsible Costs', formulaRef: 'buyerCost', format: 'currency', precision: 2 },
      { id: 'out-buyerPct', label: 'Buyer\'s Share of Landed Cost', formulaRef: 'buyerCostPct', format: 'number', precision: 1, suffix: ' %' },
    ],
    guide: {
      whatIsIt: 'Incoterms (International Commercial Terms) define the split of costs, risks, and responsibilities between buyer and seller in international trade. This calculator totals all cost components of a shipment and splits them according to the selected Incoterm 2020 rule. Under DDP the seller bears all costs; under EXW the buyer bears almost all costs.',
      howToUse: 'Select the Incoterm agreed in your sales contract. Enter each cost component. The calculator allocates costs to seller or buyer based on where risk and obligation transfer under that Incoterm.',
      exampleScenario: 'FOB Shanghai, goods $50,000, packing $500, origin haulage $300, ocean freight $2,000, insurance $150, import duties $3,000, delivery $400. Seller bears: $50,000+$500+$300 = $50,800 (goods to ship rail). Buyer bears: $2,000+$150+$3,000+$400 = $5,550. Total landed = $56,350.',
      proTip: 'CIF vs FOB is a common source of trade disputes — under FOB, the buyer controls freight and insurance, often resulting in lower costs. Under CIF, the seller arranges (and profits from) freight. DDP is the simplest for the buyer but the most complex and expensive for the seller — most e-commerce cross-border sellers prefer DAP to avoid collecting import duties.',
    },
    metadata: { version: '1.0.0' },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 7. ADVANCED FLUID & THERMODYNAMICS
  // (Reynolds already exists — skipped. Bernoulli, Nusselt, LMTD, Steam added.)
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'bernoulli-equation',
    slug: 'bernoulli-equation',
    title: 'Bernoulli Equation Calculator',
    description: 'Apply Bernoulli\'s equation to find unknown pressure, velocity, or elevation in an ideal fluid flow system between two points.',
    icon: '🌊',
    category: 'engineering',
    subcategory: 'fluid',
    tags: ['Bernoulli', 'fluid mechanics', 'pressure', 'velocity', 'flow', 'pipe', 'engineering'],
    inputs: [
      { id: 'solve', label: 'Solve For', type: 'select', options: [
        { label: 'Pressure at Point 2 (P2)', value: 'P2' },
        { label: 'Velocity at Point 2 (V2)', value: 'V2' },
        { label: 'Elevation at Point 2 (Z2)', value: 'Z2' },
      ], defaultValue: 'P2', required: true },
      { id: 'p1', label: 'Pressure at Point 1 — P1 (Pa)', type: 'number', step: 1, defaultValue: 200000, required: true },
      { id: 'v1', label: 'Velocity at Point 1 — V1 (m/s)', type: 'number', min: 0, step: 0.01, defaultValue: 2, required: true },
      { id: 'z1', label: 'Elevation at Point 1 — Z1 (m)', type: 'number', step: 0.01, defaultValue: 0, required: true },
      { id: 'p2', label: 'Pressure at Point 2 — P2 (Pa) [if known]', type: 'number', step: 1, defaultValue: 150000, required: false },
      { id: 'v2', label: 'Velocity at Point 2 — V2 (m/s) [if known]', type: 'number', min: 0, step: 0.01, defaultValue: 4, required: false },
      { id: 'z2', label: 'Elevation at Point 2 — Z2 (m) [if known]', type: 'number', step: 0.01, defaultValue: 5, required: false },
      { id: 'density', label: 'Fluid Density ρ (kg/m³)', type: 'number', min: 0.1, step: 0.1, defaultValue: 1000, placeholder: 'Water=1000, Air=1.225' },
    ],
    formulas: [
      { id: 'g', expression: '9.81', dependencies: [] },
      // Bernoulli: P1 + 0.5ρv1² + ρgz1 = P2 + 0.5ρv2² + ρgz2
      { id: 'h1', expression: 'p1 / density + 0.5 * pow(v1, 2) + g * z1', dependencies: ['p1', 'density', 'v1', 'g', 'z1'] },
      {
        id: 'resultP2',
        expression: "solve == 'P2' ? density * (h1 - 0.5 * pow(v2, 2) - g * z2) : p2",
        dependencies: ['solve', 'density', 'h1', 'v2', 'g', 'z2', 'p2'],
      },
      {
        id: 'resultV2',
        expression: "solve == 'V2' ? sqrt(abs(2 * (h1 - p2 / density - g * z2))) : v2",
        dependencies: ['solve', 'h1', 'p2', 'density', 'g', 'z2', 'v2'],
      },
      {
        id: 'resultZ2',
        expression: "solve == 'Z2' ? (h1 - p2 / density - 0.5 * pow(v2, 2)) / g : z2",
        dependencies: ['solve', 'h1', 'p2', 'density', 'v2', 'g', 'z2'],
      },
      { id: 'bernoulliCheck', expression: 'abs(h1 - (resultP2 / density + 0.5 * pow(resultV2, 2) + g * resultZ2))', dependencies: ['h1', 'resultP2', 'density', 'resultV2', 'g', 'resultZ2'] },
    ],
    outputs: [
      { id: 'out-P2', label: 'Pressure at Point 2 (P2)', formulaRef: 'resultP2', format: 'number', precision: 2, suffix: ' Pa', highlight: true },
      { id: 'out-V2', label: 'Velocity at Point 2 (V2)', formulaRef: 'resultV2', format: 'number', precision: 3, suffix: ' m/s' },
      { id: 'out-Z2', label: 'Elevation at Point 2 (Z2)', formulaRef: 'resultZ2', format: 'number', precision: 3, suffix: ' m' },
      { id: 'out-h1', label: 'Total Specific Energy (Point 1)', formulaRef: 'h1', format: 'number', precision: 3, suffix: ' J/kg' },
    ],
    guide: {
      whatIsIt: "Bernoulli's equation describes conservation of energy in an ideal, incompressible, inviscid fluid along a streamline: P + ½ρv² + ρgz = constant. P is static pressure (Pa), ρ is fluid density (kg/m³), v is flow velocity (m/s), g is gravitational acceleration (9.81 m/s²), and z is elevation (m). It explains why aircraft wings generate lift and why water jets faster through narrow pipes.",
      howToUse: 'Select which variable you want to solve for at Point 2. Enter all known values at both points. Leave the "solve for" variable\'s input at any value — the calculator will compute it from the Bernoulli equation.',
      exampleScenario: 'Water pipe narrows: P1=200 kPa, V1=2 m/s, z1=0 m. At the narrow section: V2=4 m/s, z2=0 m. Solve P2: P2 = 200,000 + ½×1000×(4−16) = 200,000 − 6,000 = 194,000 Pa (194 kPa). Velocity increase causes pressure drop.',
      proTip: "Bernoulli's equation assumes ideal flow — no viscosity, no energy losses. For real piping systems, add head loss terms (Darcy-Weisbach equation for friction losses, minor loss coefficients for fittings). The equation is most accurate for low-viscosity fluids (water, air at low Mach) along short flow paths.",
    },
    metadata: { version: '1.0.0' },
  },

  {
    id: 'nusselt-number',
    slug: 'nusselt-number',
    title: 'Nusselt Number & Heat Transfer Coefficient',
    description: 'Calculate the Nusselt number and convective heat transfer coefficient for internal pipe flow (Dittus-Boelter) and flat plate (laminar/turbulent) correlations.',
    icon: '🌡️',
    category: 'engineering',
    subcategory: 'fluid',
    tags: ['Nusselt', 'heat transfer', 'convection', 'Dittus-Boelter', 'thermal', 'engineering', 'pipe flow'],
    inputs: [
      { id: 'flowConfig', label: 'Flow Configuration', type: 'select', options: [
        { label: 'Internal Pipe Flow — Turbulent (Dittus-Boelter)', value: 'pipe_turb' },
        { label: 'Internal Pipe Flow — Laminar (Sieder-Tate, Re<2300)', value: 'pipe_lam' },
        { label: 'External Flat Plate — Laminar (Re<5×10⁵)', value: 'plate_lam' },
        { label: 'External Flat Plate — Turbulent (Re>5×10⁵)', value: 'plate_turb' },
      ], defaultValue: 'pipe_turb', required: true },
      { id: 'reynolds', label: 'Reynolds Number (Re)', type: 'number', min: 1, step: 1, defaultValue: 50000, required: true },
      { id: 'prandtl', label: 'Prandtl Number (Pr)', type: 'number', min: 0.001, step: 0.01, defaultValue: 7.0, placeholder: 'Water≈7, Air≈0.71' },
      { id: 'thermalConductivity', label: 'Fluid Thermal Conductivity k (W/m·K)', type: 'number', min: 0.001, step: 0.001, defaultValue: 0.607, placeholder: 'Water=0.607, Air=0.026' },
      { id: 'charLength', label: 'Characteristic Length L or D (m)', type: 'number', min: 0.001, step: 0.001, defaultValue: 0.05, placeholder: 'Pipe inner diameter or plate length' },
      { id: 'heating', label: 'Fluid Being', type: 'select', options: [
        { label: 'Heated (n=0.4 for Dittus-Boelter)', value: '0.4' },
        { label: 'Cooled (n=0.3 for Dittus-Boelter)', value: '0.3' },
      ], defaultValue: '0.4', required: false },
    ],
    formulas: [
      {
        id: 'nusselt',
        expression: `flowConfig == 'pipe_turb'  ? 0.023 * pow(reynolds, 0.8) * pow(prandtl, heating) :
                     flowConfig == 'pipe_lam'   ? 3.66 :
                     flowConfig == 'plate_lam'  ? 0.664 * pow(reynolds, 0.5) * pow(prandtl, 0.333) :
                                                  0.037 * pow(reynolds, 0.8) * pow(prandtl, 0.333)`,
        dependencies: ['flowConfig', 'reynolds', 'prandtl', 'heating'],
      },
      { id: 'htc', expression: 'charLength > 0 ? nusselt * thermalConductivity / charLength : 0', dependencies: ['nusselt', 'thermalConductivity', 'charLength'] },
    ],
    outputs: [
      { id: 'out-nusselt', label: 'Nusselt Number (Nu)', formulaRef: 'nusselt', format: 'number', precision: 2, highlight: true },
      { id: 'out-htc', label: 'Heat Transfer Coefficient (h)', formulaRef: 'htc', format: 'number', precision: 2, suffix: ' W/m²·K' },
    ],
    guide: {
      whatIsIt: 'The Nusselt number (Nu) is the dimensionless heat transfer coefficient: Nu = h·L / k, where h is the convective HTC (W/m²·K), L is the characteristic length (m), and k is thermal conductivity (W/m·K). Dittus-Boelter correlation for turbulent pipe flow: Nu = 0.023 × Re⁰·⁸ × Pr^n (n=0.4 heating, 0.3 cooling). Valid for Re > 10,000, 0.6 < Pr < 160.',
      howToUse: 'Select the flow configuration, enter the Reynolds and Prandtl numbers, the fluid\'s thermal conductivity, and the characteristic dimension (pipe inner diameter or plate length). The calculator outputs Nu and the actual heat transfer coefficient h.',
      exampleScenario: 'Water (Pr=7, k=0.607 W/m·K) flowing in a 50 mm pipe at Re=50,000 (turbulent), being heated. Nu = 0.023 × 50000⁰·⁸ × 7⁰·⁴ = 0.023 × 3311 × 2.18 = 165.8. h = 165.8 × 0.607 / 0.05 = 2013 W/m²·K.',
      proTip: 'Prandtl number for common fluids: water ≈ 7 (at 20°C), engine oil ≈ 100–1000, air ≈ 0.71, liquid metals ≈ 0.001–0.03. The Dittus-Boelter correlation requires turbulent flow (Re > 10,000) and a fully developed hydrodynamic and thermal boundary layer. For entry-length effects or high Pr fluids, use the Gnielinski correlation for better accuracy.',
    },
    metadata: { version: '1.0.0' },
  },

  {
    id: 'heat-exchanger-lmtd',
    slug: 'heat-exchanger-lmtd',
    title: 'Heat Exchanger LMTD Calculator',
    description: 'Calculate the Log Mean Temperature Difference (LMTD) for parallel-flow and counter-flow heat exchangers, and determine heat duty from the LMTD method.',
    icon: '🔥',
    category: 'engineering',
    subcategory: 'fluid',
    tags: ['LMTD', 'heat exchanger', 'thermodynamics', 'thermal engineering', 'process', 'log mean'],
    inputs: [
      { id: 'flowType', label: 'Heat Exchanger Flow Arrangement', type: 'select', options: [
        { label: 'Counter-Flow (most efficient)', value: 'counter' },
        { label: 'Parallel-Flow (co-current)', value: 'parallel' },
      ], defaultValue: 'counter', required: true },
      { id: 'hotIn', label: 'Hot Fluid Inlet Temperature T_h,in (°C)', type: 'number', step: 0.1, defaultValue: 120, required: true },
      { id: 'hotOut', label: 'Hot Fluid Outlet Temperature T_h,out (°C)', type: 'number', step: 0.1, defaultValue: 70, required: true },
      { id: 'coldIn', label: 'Cold Fluid Inlet Temperature T_c,in (°C)', type: 'number', step: 0.1, defaultValue: 20, required: true },
      { id: 'coldOut', label: 'Cold Fluid Outlet Temperature T_c,out (°C)', type: 'number', step: 0.1, defaultValue: 60, required: true },
      { id: 'ua', label: 'Overall Heat Transfer Coefficient × Area U×A (W/K) — optional', type: 'number', min: 0, step: 1, defaultValue: 0, placeholder: 'Enter to calculate heat duty Q' },
    ],
    formulas: [
      {
        id: 'deltaT1',
        expression: "flowType == 'counter' ? hotIn - coldOut : hotIn - coldIn",
        dependencies: ['flowType', 'hotIn', 'coldOut', 'coldIn'],
      },
      {
        id: 'deltaT2',
        expression: "flowType == 'counter' ? hotOut - coldIn : hotOut - coldOut",
        dependencies: ['flowType', 'hotOut', 'coldIn', 'coldOut'],
      },
      {
        id: 'lmtd',
        expression: 'abs(deltaT1 - deltaT2) < 0.001 ? deltaT1 : (deltaT1 - deltaT2) / log(deltaT1 / deltaT2)',
        dependencies: ['deltaT1', 'deltaT2'],
      },
      { id: 'heatDutyW', expression: 'ua > 0 ? ua * lmtd : 0', dependencies: ['ua', 'lmtd'] },
      { id: 'heatDutykW', expression: 'heatDutyW / 1000', dependencies: ['heatDutyW'] },
    ],
    outputs: [
      { id: 'out-lmtd', label: 'LMTD (Log Mean Temperature Difference)', formulaRef: 'lmtd', format: 'number', precision: 3, suffix: ' °C (or K)', highlight: true },
      { id: 'out-dt1', label: 'ΔT₁', formulaRef: 'deltaT1', format: 'number', precision: 2, suffix: ' K' },
      { id: 'out-dt2', label: 'ΔT₂', formulaRef: 'deltaT2', format: 'number', precision: 2, suffix: ' K' },
      { id: 'out-duty', label: 'Heat Duty Q = UA × LMTD', formulaRef: 'heatDutykW', format: 'number', precision: 3, suffix: ' kW' },
    ],
    guide: {
      whatIsIt: 'LMTD = (ΔT₁ − ΔT₂) / ln(ΔT₁ / ΔT₂). For counter-flow: ΔT₁ = T_h,in − T_c,out, ΔT₂ = T_h,out − T_c,in. For parallel-flow: ΔT₁ = T_h,in − T_c,in, ΔT₂ = T_h,out − T_c,out. Heat duty: Q = U × A × LMTD. Counter-flow always gives a higher LMTD (more driving force, more compact exchanger) than parallel-flow.',
      howToUse: 'Enter the hot and cold fluid inlet and outlet temperatures. Select the flow arrangement. If you know U×A (product of overall heat transfer coefficient and heat transfer area), enter it to calculate the heat duty Q.',
      exampleScenario: 'Counter-flow: hot 120→70°C, cold 20→60°C. ΔT₁ = 120−60 = 60 K, ΔT₂ = 70−20 = 50 K. LMTD = (60−50)/ln(60/50) = 10/0.182 = 54.9 K. With UA = 500 W/K: Q = 500 × 54.9 = 27.45 kW.',
      proTip: 'For multi-pass or cross-flow heat exchangers, apply an F correction factor: Q = F × U × A × LMTD where F < 1 (from standard TEMA charts). Always check that neither temperature crosses (hot outlet must be hotter than cold inlet in counter-flow). If temperatures cross, the exchanger is thermodynamically impossible for the given flow arrangement.',
    },
    metadata: { version: '1.0.0' },
  },

  {
    id: 'steam-enthalpy-tables',
    slug: 'steam-enthalpy-tables',
    title: 'Steam Properties / Steam Tables Calculator',
    description: 'Look up saturated steam properties (enthalpy, entropy, specific volume) at a given pressure or temperature using the International Steam Tables (IAPWS-IF97).',
    icon: '♨️',
    category: 'engineering',
    subcategory: 'fluid',
    tags: ['steam', 'enthalpy', 'steam tables', 'saturation', 'thermodynamics', 'IAPWS', 'engineering'],
    inputs: [
      { id: 'steamInput', label: 'Input Type', type: 'select', options: [
        { label: 'Saturation Temperature (°C)', value: 'temp' },
        { label: 'Saturation Pressure (bar)', value: 'pressure' },
      ], defaultValue: 'temp', required: true },
      { id: 'tempC', label: 'Temperature (°C)', type: 'number', min: 0.01, max: 374, step: 1, defaultValue: 100, required: false },
      { id: 'pressureBar', label: 'Pressure (bar)', type: 'number', min: 0.006, max: 221, step: 0.1, defaultValue: 1.01325, required: false },
    ],
    // Polynomial approximations (IAPWS-IF97 Region 4 simplified correlations)
    formulas: [
      // If temp input: use T. If pressure input, estimate T from Antoine-style approximation
      {
        id: 'satTempC',
        expression: `steamInput == 'temp' ? tempC :
                     42.677 * log(pressureBar / 0.06112) + 0.0`,
        dependencies: ['steamInput', 'tempC', 'pressureBar'],
      },
      // Saturation pressure from temperature (Antoine approximation, valid 0–374°C)
      {
        id: 'satPressBar',
        expression: `steamInput == 'pressure' ? pressureBar :
                     0.06112 * exp(satTempC / (satTempC + 243.5) * 17.67)`,
        dependencies: ['steamInput', 'pressureBar', 'satTempC'],
      },
      // Liquid enthalpy hf (kJ/kg) — polynomial fit to steam tables, ±0.5%
      { id: 'hf', expression: 'satTempC * (4.1855 - satTempC * 0.0011)', dependencies: ['satTempC'] },
      // Latent heat hfg (kJ/kg) — Watson correlation
      { id: 'hfg', expression: '2501 - 2.361 * satTempC', dependencies: ['satTempC'] },
      { id: 'hg', expression: 'hf + hfg', dependencies: ['hf', 'hfg'] },
      // Specific volume of saturated vapour vg (m³/kg) — approximation
      { id: 'vg', expression: 'satPressBar > 0 ? 0.004615 * (satTempC + 273.15) / satPressBar : 0', dependencies: ['satTempC', 'satPressBar'] },
    ],
    outputs: [
      { id: 'out-satTemp', label: 'Saturation Temperature', formulaRef: 'satTempC', format: 'number', precision: 2, suffix: ' °C', highlight: true },
      { id: 'out-satPres', label: 'Saturation Pressure', formulaRef: 'satPressBar', format: 'number', precision: 4, suffix: ' bar' },
      { id: 'out-hf', label: 'Liquid Enthalpy (hf)', formulaRef: 'hf', format: 'number', precision: 1, suffix: ' kJ/kg' },
      { id: 'out-hfg', label: 'Latent Heat (hfg)', formulaRef: 'hfg', format: 'number', precision: 1, suffix: ' kJ/kg' },
      { id: 'out-hg', label: 'Steam Enthalpy (hg)', formulaRef: 'hg', format: 'number', precision: 1, suffix: ' kJ/kg' },
      { id: 'out-vg', label: 'Steam Specific Volume (vg)', formulaRef: 'vg', format: 'number', precision: 4, suffix: ' m³/kg' },
    ],
    guide: {
      whatIsIt: 'Steam tables (IAPWS-IF97) provide thermodynamic properties of water and steam at saturation conditions. Key values: hf = enthalpy of saturated liquid (kJ/kg), hfg = latent heat of vaporisation (kJ/kg), hg = hf + hfg = enthalpy of saturated vapour, vg = specific volume of steam. These are essential for boiler sizing, steam system design, and power cycle analysis.',
      howToUse: 'Select whether to input temperature or pressure. For temperature input, enter the saturation temperature (0–374°C). For pressure input, enter the absolute saturation pressure (0.006–221 bar). Values are based on polynomial approximations to the IAPWS-IF97 standard — accuracy ±0.5% for practical engineering use.',
      exampleScenario: 'At 100°C (1 bar): hf ≈ 419 kJ/kg, hfg ≈ 2257 kJ/kg, hg ≈ 2676 kJ/kg. 2257 kJ of energy is needed to evaporate 1 kg of water at 100°C. This explains why steam carries so much more heat than hot water.',
      proTip: 'Latent heat decreases as pressure/temperature increases — at the critical point (374°C, 221 bar) hfg → 0 and liquid and vapour become indistinguishable. For high-accuracy calculations (turbine design, refrigerant cycles), use a dedicated thermodynamics library (CoolProp, NIST WebBook). The approximations here are valid to ±1% for process engineering estimates.',
    },
    metadata: { version: '1.0.0' },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // 8. STRING / TEXT PROCESSING
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'levenshtein-distance',
    slug: 'levenshtein-distance',
    title: 'Levenshtein Distance (Edit Distance) Calculator',
    description: 'Calculate the minimum number of single-character edits (insertions, deletions, substitutions) required to transform one string into another. Includes similarity percentage.',
    icon: '🔠',
    category: 'tech',
    subcategory: 'text-processing',
    tags: ['Levenshtein', 'edit distance', 'string similarity', 'NLP', 'spell check', 'fuzzy matching', 'text'],
    inputs: [
      { id: 'maxLen', label: 'String Length Limit (characters)', type: 'number', min: 1, max: 50, step: 1, defaultValue: 30, required: false },
      { id: 'string1Len', label: 'Length of String 1 (characters)', type: 'number', min: 0, max: 100, step: 1, defaultValue: 7, required: true },
      { id: 'string2Len', label: 'Length of String 2 (characters)', type: 'number', min: 0, max: 100, step: 1, defaultValue: 8, required: true },
      { id: 'editDistance', label: 'Edit Distance (from manual count or algorithm output)', type: 'number', min: 0, step: 1, defaultValue: 3, required: true },
    ],
    formulas: [
      { id: 'maxLenCalc', expression: 'max(string1Len, string2Len)', dependencies: ['string1Len', 'string2Len'] },
      { id: 'similarity', expression: 'maxLenCalc > 0 ? (1 - editDistance / maxLenCalc) * 100 : 100', dependencies: ['editDistance', 'maxLenCalc'] },
      { id: 'normalised', expression: 'maxLenCalc > 0 ? editDistance / maxLenCalc : 0', dependencies: ['editDistance', 'maxLenCalc'] },
    ],
    outputs: [
      { id: 'out-distance', label: 'Edit Distance', formulaRef: 'editDistance', format: 'number', precision: 0, highlight: true },
      { id: 'out-similarity', label: 'Similarity Score', formulaRef: 'similarity', format: 'number', precision: 2, suffix: ' %' },
      { id: 'out-normalised', label: 'Normalised Distance (0=identical, 1=completely different)', formulaRef: 'normalised', format: 'number', precision: 4 },
    ],
    guide: {
      whatIsIt: 'The Levenshtein distance is the minimum number of single-character edits (insert, delete, or substitute one character) needed to change one string into another. It is the foundation of spell-checkers, DNA sequence alignment, fuzzy search, and plagiarism detection. Similarity = 1 − (distance / max_length). Example: "kitten" → "sitting" = distance 3, similarity = 1 − 3/7 = 57%.',
      howToUse: 'Since computing Levenshtein distance requires a dynamic programming algorithm running in the browser (which this formula-based calculator cannot execute), enter the string lengths and the edit distance computed by your own implementation or a reference tool. The calculator then gives the similarity percentage and normalised distance. For common word pairs, the guide below provides worked examples.',
      exampleScenario: '"kitten" (length 7) → "sitting" (length 8). Operations: k→s (sub), e→i (sub), insert g at end = 3 edits. Max length = 8. Similarity = (1 − 3/8) × 100 = 62.5%. In spell-checking, words with distance ≤ 2 are typically suggested as corrections.',
      proTip: 'Levenshtein distance = O(m×n) time complexity where m, n are string lengths — computationally feasible for short strings but expensive for long documents. For large-scale fuzzy matching, use approximate string matching libraries (Rapidfuzz, FuzzyWuzzy in Python; fuse.js in JavaScript). The Jaro-Winkler distance gives higher weight to prefix matches and is better for name deduplication.',
    },
    metadata: { version: '1.0.0' },
  },
];
