// ---------------------------------------------------------------------------
// Quantify — Agriculture & Farming Calculators
// ---------------------------------------------------------------------------
// 10 calculators covering crop yields, irrigation, livestock, and
// greenhouse management.
// ---------------------------------------------------------------------------

import type { CalculatorSchema } from '@/types/calculator';

export const agricultureCalculators: CalculatorSchema[] = [
  // =========================================================================
  // 21. Crop Yield Calculator
  // =========================================================================
  {
    id: 'crop-yield',
    slug: 'crop-yield',
    title: 'Crop Yield Calculator',
    description:
      'Calculate crop yield per hectare, acre, and square metre from total production and area harvested.',
    icon: '🌾',
    category: 'agriculture',
    subcategory: 'crops',
    tags: ['crop yield', 'harvest', 'tonnes per hectare', 'production', 'farming', 'agronomy'],
    inputs: [
      {
        id: 'totalProduction',
        label: 'Total Production',
        type: 'number',
        defaultValue: 5000,
        min: 0,
        step: 1,
        placeholder: 'e.g. 5000',
        units: [
          { label: 'kg',   value: '1'        },
          { label: 'tons', value: '1000'     },
          { label: 'lbs',  value: '0.453592' },
        ],
        required: true,
      },
      {
        id: 'area',
        label: 'Harvested Area',
        type: 'number',
        defaultValue: 1,
        min: 0.0001,
        step: 0.1,
        placeholder: 'e.g. 1',
        units: [
          { label: 'hectares',  value: '1'      },
          { label: 'acres',     value: '0.404686' },
          { label: 'sq meters', value: '0.0001' },
        ],
        required: true,
      },
    ],
    formulas: [
      // totalProduction and area are already in kg and hectares via unit conversion
      { id: 'yieldPerHa',   expression: 'totalProduction / area',           dependencies: ['totalProduction', 'area'] },
      { id: 'yieldPerAcre', expression: 'yieldPerHa * 0.404686',            dependencies: ['yieldPerHa'] },
      { id: 'yieldPerSqM',  expression: 'yieldPerHa / 10000',               dependencies: ['yieldPerHa'] },
    ],
    outputs: [
      { id: 'out-yieldPerHa',   label: 'Yield per Hectare', formulaRef: 'yieldPerHa',   format: 'number', precision: 1, suffix: ' kg/ha',   highlight: true },
      { id: 'out-yieldPerAcre', label: 'Yield per Acre',    formulaRef: 'yieldPerAcre', format: 'number', precision: 1, suffix: ' kg/acre' },
      { id: 'out-yieldPerSqM',  label: 'Yield per m²',      formulaRef: 'yieldPerSqM',  format: 'number', precision: 3, suffix: ' kg/m²' },
    ],
    guide: {
      whatIsIt:
        'Crop yield is the amount of agricultural product produced per unit of land area, typically expressed in kg/hectare or tonnes/hectare. It is the primary measure of agricultural productivity and is used to benchmark performance against regional averages, plan storage, and calculate income.',
      howToUse:
        'Enter the total weight of the harvested crop and select the weight unit. Enter the harvested area and select the area unit. The calculator converts everything to SI base units and returns yield in kg per hectare, per acre, and per square metre.',
      exampleScenario:
        'Harvesting 5,000 kg from 1 hectare gives 5,000 kg/ha — close to the world average wheat yield. Converting to acres: 5,000 × 0.4047 ≈ 2,024 kg/acre. Top wheat-producing regions achieve 7,000–10,000 kg/ha with modern varieties and intensive management.',
      proTip:
        'Compare your yield against the FAO national average for your crop and region. Yield gaps of 20–40% are common on smallholder farms and can often be closed through better fertilisation, variety selection, and timely planting. Track yield year-over-year across fields to identify which agronomic practices drive the biggest improvements.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 22. Seed Rate Calculator
  // =========================================================================
  {
    id: 'seed-rate',
    slug: 'seed-rate',
    title: 'Seed Rate Calculator',
    description:
      'Calculate the total seeds required and seed weight for a planting area, adjusted for germination rate and thousand grain weight (TGW).',
    icon: '🌱',
    category: 'agriculture',
    subcategory: 'crops',
    tags: ['seed rate', 'seeding', 'thousand grain weight', 'tgw', 'germination', 'planting', 'seeds per m2'],
    inputs: [
      {
        id: 'area',
        label: 'Planting Area',
        type: 'number',
        defaultValue: 1,
        min: 0.0001,
        step: 0.1,
        placeholder: 'e.g. 1',
        units: [
          { label: 'hectares', value: '10000'   },
          { label: 'acres',    value: '4046.86' },
          { label: 'sq meters',value: '1'       },
        ],
        required: true,
      },
      {
        id: 'seedRatePerSqM',
        label: 'Target Plant Density (seeds/m²)',
        type: 'number',
        defaultValue: 250,
        min: 1,
        step: 1,
        placeholder: 'e.g. 250',
        helpText: 'Wheat ≈ 250–400 · Corn ≈ 8 · Rice ≈ 100 · Sunflower ≈ 5',
        required: true,
      },
      {
        id: 'germRatePercent',
        label: 'Germination Rate (%)',
        type: 'number',
        defaultValue: 85,
        min: 1,
        max: 100,
        step: 1,
        placeholder: 'e.g. 85',
        helpText: 'Germination rate from seed supplier label. Typical: 80–95%.',
        required: true,
      },
      {
        id: 'tgw',
        label: 'Thousand Grain Weight (g)',
        type: 'number',
        defaultValue: 45,
        min: 0.1,
        step: 0.5,
        placeholder: 'e.g. 45',
        helpText: 'TGW from seed supplier. Wheat ≈ 40–50 g · Corn ≈ 300 g · Rice ≈ 25 g.',
        required: true,
      },
    ],
    formulas: [
      // Adjust for germination: sow more to achieve target stand
      { id: 'adjustedSeedRate', expression: 'seedRatePerSqM / (germRatePercent / 100)',      dependencies: ['seedRatePerSqM', 'germRatePercent'] },
      // area is in square metres via unit conversion
      { id: 'totalSeeds',       expression: 'area * adjustedSeedRate',                       dependencies: ['area', 'adjustedSeedRate'] },
      // Weight in kg: (seeds / 1000) × TGW(g) / 1000
      { id: 'seedWeightKg',     expression: '(totalSeeds / 1000) * tgw / 1000',              dependencies: ['totalSeeds', 'tgw'] },
      { id: 'seedWeightLbs',    expression: 'seedWeightKg * 2.20462',                        dependencies: ['seedWeightKg'] },
    ],
    outputs: [
      { id: 'out-totalSeeds',    label: 'Total Seeds Required', formulaRef: 'totalSeeds',    format: 'number', precision: 0,             highlight: true },
      { id: 'out-seedWeightKg',  label: 'Seed Weight',          formulaRef: 'seedWeightKg',  format: 'number', precision: 2, suffix: ' kg' },
      { id: 'out-seedWeightLbs', label: 'Seed Weight',          formulaRef: 'seedWeightLbs', format: 'number', precision: 2, suffix: ' lbs' },
    ],
    guide: {
      whatIsIt:
        'The seed rate calculator determines how many seeds to purchase and how much they will weigh, accounting for less-than-perfect germination. The adjusted seed rate = target density ÷ germination rate. Weight = (total seeds / 1,000) × TGW (g) / 1,000.',
      howToUse:
        'Select the planting area and unit (hectares, acres, or m²). Enter your target plant density in seeds per m², the seed germination rate from the label, and the thousand grain weight (TGW) from the seed specification. The calculator returns total seeds needed and weight in both kg and lbs.',
      exampleScenario:
        'Planting 1 hectare of wheat at 300 seeds/m² with 85% germination and TGW of 45 g: Adjusted rate = 300/0.85 = 353 seeds/m². Total = 353 × 10,000 = 3,529,412 seeds. Weight = (3,529,412/1000) × 45/1000 = 158.8 kg ≈ 350 lbs of seed.',
      proTip:
        'Higher TGW seeds generally produce more vigorous seedlings. Some agronomists recommend a 5–10% additional buffer beyond the germination adjustment to account for soil conditions, pest pressure, and seedbed preparation quality. Store seed in cool, dry conditions — germination rates decline 2–5% per year in poor storage.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 23. NPK Fertilizer Rate Calculator
  // =========================================================================
  {
    id: 'npk-fertilizer',
    slug: 'npk-fertilizer',
    title: 'NPK Fertilizer Rate Calculator',
    description:
      'Calculate the quantity of fertilizer product needed to deliver a target nitrogen (N), phosphorus (P₂O₅), and potassium (K₂O) rate.',
    icon: '🧪',
    category: 'agriculture',
    subcategory: 'crops',
    tags: ['npk', 'fertilizer', 'nitrogen', 'phosphorus', 'potassium', 'nutrient management', 'soil'],
    inputs: [
      {
        id: 'nRequired',
        label: 'N Required (kg/ha)',
        type: 'number',
        defaultValue: 120,
        min: 0,
        step: 1,
        placeholder: 'e.g. 120',
        helpText: 'Nitrogen requirement in kg per hectare (from soil test or crop guideline)',
        required: true,
      },
      {
        id: 'pRequired',
        label: 'P₂O₅ Required (kg/ha)',
        type: 'number',
        defaultValue: 60,
        min: 0,
        step: 1,
        placeholder: 'e.g. 60',
        required: true,
      },
      {
        id: 'kRequired',
        label: 'K₂O Required (kg/ha)',
        type: 'number',
        defaultValue: 80,
        min: 0,
        step: 1,
        placeholder: 'e.g. 80',
        required: true,
      },
      {
        id: 'nPercent',
        label: 'Fertilizer N Content (%)',
        type: 'number',
        defaultValue: 46,
        min: 0,
        max: 100,
        step: 0.5,
        placeholder: 'e.g. 46',
        helpText: 'Urea = 46% N · Ammonium Nitrate = 34% · Ammonium Sulfate = 21%',
        required: true,
      },
      {
        id: 'pPercent',
        label: 'Fertilizer P₂O₅ Content (%)',
        type: 'number',
        defaultValue: 0,
        min: 0,
        max: 100,
        step: 0.5,
        placeholder: 'e.g. 0',
        helpText: 'Triple Superphosphate = 46% · DAP = 46% P₂O₅ (also 18% N)',
        required: true,
      },
      {
        id: 'kPercent',
        label: 'Fertilizer K₂O Content (%)',
        type: 'number',
        defaultValue: 0,
        min: 0,
        max: 100,
        step: 0.5,
        placeholder: 'e.g. 0',
        helpText: 'Muriate of Potash (KCl) = 60% K₂O · Sulfate of Potash = 50%',
        required: true,
      },
      {
        id: 'area',
        label: 'Field Area',
        type: 'number',
        defaultValue: 1,
        min: 0.01,
        step: 0.1,
        placeholder: 'e.g. 1',
        units: [
          { label: 'hectares', value: '1'        },
          { label: 'acres',    value: '0.404686' },
        ],
        required: true,
      },
    ],
    formulas: [
      // Product rate per ha = nutrient needed / (nutrient% / 100)
      // Guard against division by zero when percent = 0
      { id: 'nProduct', expression: 'nPercent > 0 ? (nRequired / (nPercent / 100)) : 0',  dependencies: ['nRequired', 'nPercent'] },
      { id: 'pProduct', expression: 'pPercent > 0 ? (pRequired / (pPercent / 100)) : 0',  dependencies: ['pRequired', 'pPercent'] },
      { id: 'kProduct', expression: 'kPercent > 0 ? (kRequired / (kPercent / 100)) : 0',  dependencies: ['kRequired', 'kPercent'] },
      // Total for field
      { id: 'nTotal',   expression: 'nProduct * area',                                     dependencies: ['nProduct', 'area'] },
      { id: 'pTotal',   expression: 'pProduct * area',                                     dependencies: ['pProduct', 'area'] },
      { id: 'kTotal',   expression: 'kProduct * area',                                     dependencies: ['kProduct', 'area'] },
    ],
    outputs: [
      { id: 'out-nTotal',   label: 'N Fertilizer Needed',    formulaRef: 'nTotal',   format: 'number', precision: 1, suffix: ' kg total', highlight: true },
      { id: 'out-pTotal',   label: 'P Fertilizer Needed',    formulaRef: 'pTotal',   format: 'number', precision: 1, suffix: ' kg total' },
      { id: 'out-kTotal',   label: 'K Fertilizer Needed',    formulaRef: 'kTotal',   format: 'number', precision: 1, suffix: ' kg total' },
      { id: 'out-nProduct', label: 'N Rate per Hectare',     formulaRef: 'nProduct', format: 'number', precision: 1, suffix: ' kg/ha' },
    ],
    guide: {
      whatIsIt:
        'Fertilizer rate calculation converts nutrient requirements (in pure N, P₂O₅, or K₂O) into the weight of a specific fertilizer product. Formula: product weight = nutrient required ÷ (nutrient concentration / 100). Nutrient requirements come from soil tests and crop uptake guidelines.',
      howToUse:
        'Enter the target nutrient rates in kg/ha for N, P₂O₅, and K₂O (from soil test recommendations). Enter the nutrient content percentage of each fertilizer product you plan to use. Enter the field area. Leave a percentage at 0 if that nutrient is not in your chosen product — it will return 0 product needed.',
      exampleScenario:
        'Wheat crop needing 120 kg N/ha using Urea (46% N): product rate = 120/0.46 = 260.9 kg Urea/ha. Over 5 hectares: 1,304 kg Urea total. For 60 kg P₂O₅/ha using Triple Super (46% P₂O₅): 130.4 kg/ha = 652 kg total.',
      proTip:
        'Split nitrogen applications improve efficiency and reduce loss. Apply 1/3 at planting and 2/3 at key growth stages (tillering for wheat, V6 for corn). Inhibitor-treated ureas (NBPT) reduce ammonia volatilisation by up to 30% in warm, moist conditions. Always base nutrient applications on soil test results, not blanket recommendations.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 24. Plant Spacing & Density Calculator
  // =========================================================================
  {
    id: 'plant-spacing',
    slug: 'plant-spacing',
    title: 'Plant Spacing & Density Calculator',
    description:
      'Calculate plant density per hectare and total plant count from row spacing, in-row spacing, and field area.',
    icon: '🌿',
    category: 'agriculture',
    subcategory: 'crops',
    tags: ['plant spacing', 'plant density', 'row spacing', 'population', 'seeding', 'planting'],
    inputs: [
      {
        id: 'rowSpacing',
        label: 'Row Spacing (cm)',
        type: 'number',
        defaultValue: 75,
        min: 1,
        step: 1,
        placeholder: 'e.g. 75',
        helpText: 'Distance between rows. Corn: 75 cm · Soybean: 38–76 cm · Wheat: 15–25 cm.',
        required: true,
      },
      {
        id: 'plantSpacing',
        label: 'In-Row Plant Spacing (cm)',
        type: 'number',
        defaultValue: 20,
        min: 0.1,
        step: 0.5,
        placeholder: 'e.g. 20',
        helpText: 'Distance between plants within a row.',
        required: true,
      },
      {
        id: 'area',
        label: 'Field Area',
        type: 'number',
        defaultValue: 1,
        min: 0.0001,
        step: 0.1,
        placeholder: 'e.g. 1',
        units: [
          { label: 'hectares', value: '10000'   },
          { label: 'acres',    value: '4046.86' },
          { label: 'sq meters',value: '1'       },
        ],
        required: true,
      },
    ],
    formulas: [
      // Density (plants/m²) = 10000 cm² / (rowSpacing cm × plantSpacing cm)
      // = 1 m² / (rowSpacing/100 m × plantSpacing/100 m)
      { id: 'densityPerSqM',  expression: '10000 / (rowSpacing * plantSpacing)',       dependencies: ['rowSpacing', 'plantSpacing'] },
      { id: 'densityPerHa',   expression: 'densityPerSqM * 10000',                    dependencies: ['densityPerSqM'] },
      { id: 'densityPerAcre', expression: 'densityPerSqM * 4046.86',                  dependencies: ['densityPerSqM'] },
      // area is in square metres via unit conversion
      { id: 'totalPlants',    expression: 'densityPerSqM * area',                     dependencies: ['densityPerSqM', 'area'] },
    ],
    outputs: [
      { id: 'out-densityPerHa',   label: 'Plant Density',      formulaRef: 'densityPerHa',   format: 'number', precision: 0, suffix: ' plants/ha',   highlight: true },
      { id: 'out-totalPlants',    label: 'Total Plants',       formulaRef: 'totalPlants',    format: 'number', precision: 0 },
      { id: 'out-densityPerAcre', label: 'Plants per Acre',    formulaRef: 'densityPerAcre', format: 'number', precision: 0 },
    ],
    guide: {
      whatIsIt:
        'Plant density is the number of plants per unit area, determined by row spacing and in-row spacing. Optimal density maximises yield by balancing light interception, nutrient competition, and root space. Density (plants/m²) = 10,000 ÷ (row spacing cm × plant spacing cm).',
      howToUse:
        'Enter the row spacing and within-row plant spacing in centimetres. Select the field area and unit. The calculator returns density per hectare, per acre, and total plant count for the field.',
      exampleScenario:
        'Corn planted at 75 cm rows with 20 cm in-row spacing: density = 10,000 / (75 × 20) = 6.67 plants/m² = 66,667 plants/ha. This is within the typical corn density range of 60,000–80,000 plants/ha for most hybrids.',
      proTip:
        'Narrower row spacing often increases yield by improving light interception early in the season. Shifting from 76 cm to 38 cm rows in soybeans typically delivers 5–10% yield gain. However, narrow rows require compatible equipment. Optimal density is cultivar-specific — always consult the seed company agronomist\'s recommendation.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 25. Irrigation Water Requirement Calculator
  // =========================================================================
  {
    id: 'irrigation-water',
    slug: 'irrigation-water',
    title: 'Irrigation Water Requirement Calculator',
    description:
      'Calculate daily and weekly irrigation requirements using the FAO Penman-Monteith ET₀ method with crop coefficient (Kc).',
    icon: '💧',
    category: 'agriculture',
    subcategory: 'irrigation',
    tags: ['irrigation', 'evapotranspiration', 'et0', 'kc', 'water requirement', 'FAO', 'crop water'],
    inputs: [
      {
        id: 'et0',
        label: 'Reference ET₀ (mm/day)',
        type: 'number',
        defaultValue: 5,
        min: 0,
        max: 20,
        step: 0.1,
        placeholder: 'e.g. 5',
        helpText: 'Reference evapotranspiration from local weather station or FAO CLIMWAT data.',
        required: true,
      },
      {
        id: 'kc',
        label: 'Crop Coefficient (Kc)',
        type: 'number',
        defaultValue: 1.0,
        min: 0.1,
        max: 1.5,
        step: 0.05,
        placeholder: 'e.g. 1.0',
        helpText: 'Kc mid-season: wheat ≈ 1.15 · maize ≈ 1.20 · tomato ≈ 1.05 · cotton ≈ 1.20',
        required: true,
      },
      {
        id: 'rainfall',
        label: 'Effective Rainfall (mm/day)',
        type: 'number',
        defaultValue: 2,
        min: 0,
        step: 0.1,
        placeholder: 'e.g. 2',
        helpText: 'Average effective daily rainfall (typically 70–80% of total rainfall)',
        required: true,
      },
      {
        id: 'area',
        label: 'Irrigated Area',
        type: 'number',
        defaultValue: 1,
        min: 0.0001,
        step: 0.1,
        placeholder: 'e.g. 1',
        units: [
          { label: 'hectares', value: '10000'   },
          { label: 'acres',    value: '4046.86' },
        ],
        required: true,
      },
    ],
    formulas: [
      // Crop evapotranspiration ETc = ET0 × Kc
      { id: 'etc',       expression: 'et0 * kc',                       dependencies: ['et0', 'kc'] },
      // Net irrigation = max(0, ETc - rainfall)
      { id: 'netIrr',    expression: 'max(0, etc - rainfall)',         dependencies: ['etc', 'rainfall'] },
      // Volume: area (m²) × depth (mm) / 1000 = m³
      { id: 'dailyM3',   expression: 'netIrr * area / 1000',          dependencies: ['netIrr', 'area'] },
      { id: 'weeklyM3',  expression: 'dailyM3 * 7',                   dependencies: ['dailyM3'] },
      { id: 'dailyLiters',expression: 'dailyM3 * 1000',               dependencies: ['dailyM3'] },
    ],
    outputs: [
      { id: 'out-netIrr',    label: 'Net Irrigation Needed', formulaRef: 'netIrr',    format: 'number', precision: 2, suffix: ' mm/day',     highlight: true },
      { id: 'out-dailyM3',   label: 'Daily Water Volume',    formulaRef: 'dailyM3',   format: 'number', precision: 1, suffix: ' m³/day' },
      { id: 'out-weeklyM3',  label: 'Weekly Water Volume',   formulaRef: 'weeklyM3',  format: 'number', precision: 1, suffix: ' m³/week' },
    ],
    guide: {
      whatIsIt:
        'The FAO-56 method calculates crop water use as ETc = ET₀ × Kc, where ET₀ is reference evapotranspiration and Kc is a crop-specific coefficient. Net irrigation = max(0, ETc − effective rainfall). Volume (m³) = depth (mm) × area (m²) ÷ 1,000.',
      howToUse:
        'Enter the reference ET₀ from your local weather station or FAO database, the Kc for your crop and growth stage, effective daily rainfall, and the irrigated area. The result shows net irrigation depth in mm/day and total water volume per day and week.',
      exampleScenario:
        'Maize at mid-season in a semi-arid region: ET₀ = 7 mm/day, Kc = 1.20, effective rainfall = 2 mm/day. ETc = 8.4 mm/day. Net irrigation = 6.4 mm/day. Over 1 hectare: 64 m³/day = 448 m³/week. A drip system at 4 L/plant/hour for 8 hours delivers 32 L per plant — check against this result.',
      proTip:
        'Kc varies throughout the crop growth cycle — it starts low (establishment), peaks at mid-season, then drops (late season). Always use the stage-appropriate Kc. Soil moisture sensors (tensiometers, TDR probes) at key depths provide real-time feedback and typically reduce water use by 15–30% compared to calendar-based scheduling.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 26. Growing Degree Days (GDD) Calculator
  // =========================================================================
  {
    id: 'growing-degree-days',
    slug: 'growing-degree-days',
    title: 'Growing Degree Days (GDD) Calculator',
    description:
      'Calculate daily and cumulative growing degree days (heat units) to predict crop development, maturity, and pest timing.',
    icon: '🌡️',
    category: 'agriculture',
    subcategory: 'crops',
    tags: ['growing degree days', 'gdd', 'heat units', 'phenology', 'crop development', 'maturity', 'temperature'],
    inputs: [
      {
        id: 'tMax',
        label: 'Maximum Daily Temperature (°C)',
        type: 'number',
        defaultValue: 28,
        min: -50,
        max: 60,
        step: 0.1,
        placeholder: 'e.g. 28',
        required: true,
      },
      {
        id: 'tMin',
        label: 'Minimum Daily Temperature (°C)',
        type: 'number',
        defaultValue: 14,
        min: -50,
        max: 60,
        step: 0.1,
        placeholder: 'e.g. 14',
        required: true,
      },
      {
        id: 'tBase',
        label: 'Base Temperature (°C)',
        type: 'select',
        options: [
          { label: 'Corn / Maize (10°C)',    value: '10'   },
          { label: 'Wheat / Barley (0°C)',   value: '0'    },
          { label: 'Cotton (15.5°C)',        value: '15.5' },
          { label: 'Rice (10°C)',            value: '10'   },
          { label: 'Soybean (10°C)',         value: '10'   },
          { label: 'Custom / Default (5°C)', value: '5'    },
        ],
        defaultValue: '10',
        required: true,
      },
      {
        id: 'numDays',
        label: 'Days to Accumulate',
        type: 'number',
        defaultValue: 1,
        min: 1,
        max: 365,
        step: 1,
        placeholder: 'e.g. 1',
        helpText: 'Multiply daily GDD by this number of days (assumes constant daily temperatures)',
        required: true,
      },
    ],
    formulas: [
      // GDD = max(0, (Tmax + Tmin)/2 - Tbase)
      { id: 'tmean',    expression: '(tMax + tMin) / 2',          dependencies: ['tMax', 'tMin'] },
      { id: 'dailyGdd', expression: 'max(0, tmean - tBase)',      dependencies: ['tmean', 'tBase'] },
      { id: 'periodGdd',expression: 'dailyGdd * numDays',         dependencies: ['dailyGdd', 'numDays'] },
    ],
    outputs: [
      { id: 'out-dailyGdd',  label: 'GDD Today',          formulaRef: 'dailyGdd',  format: 'number', precision: 1, suffix: ' GDD', highlight: true },
      { id: 'out-periodGdd', label: 'GDD for Period',     formulaRef: 'periodGdd', format: 'number', precision: 1, suffix: ' GDD' },
    ],
    guide: {
      whatIsIt:
        'Growing Degree Days (GDD) quantify the heat energy available for crop development above a base temperature (below which no growth occurs). GDD = max(0, (Tmax + Tmin)/2 − Tbase). Accumulated GDD predicts flowering, maturity dates, and pest emergence timing far more accurately than calendar days.',
      howToUse:
        'Enter the maximum and minimum temperature for the day (or average daily temperatures). Select the appropriate base temperature for your crop. Enter the number of days to estimate accumulated GDD (assuming constant daily averages for a forecast period).',
      exampleScenario:
        'Corn planted on May 1. Daily average: Tmax = 28°C, Tmin = 14°C. Tmean = 21°C. GDD/day = 21 − 10 = 11 GDD. Over 90 days: ≈ 990 GDD. Corn silking typically occurs at 860 GDD; maturity at 2,700 GDD — so full-season corn requires about 245 days at this temperature pattern.',
      proTip:
        'Corn hybrids are sold by relative maturity (RM) which approximates the GDD required: a 100-day hybrid needs ≈ 2,500 GDD. In cold regions, choose shorter-season hybrids or switch to spring wheat (faster to mature at lower GDD accumulation). GDD models for pest prediction (aphids, corn earworm, codling moth) allow targeted spray timing that reduces applications by 30–50%.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 27. Animal Gestation Period Calculator
  // =========================================================================
  {
    id: 'animal-gestation',
    slug: 'animal-gestation',
    title: 'Animal Gestation Period Calculator',
    description:
      'Estimate the expected birth date for common livestock and companion animals from the breeding date and species gestation period.',
    icon: '🐄',
    category: 'agriculture',
    subcategory: 'livestock',
    tags: ['gestation', 'livestock', 'breeding', 'calving', 'farrowing', 'lambing', 'cattle', 'pig', 'sheep'],
    inputs: [
      {
        id: 'breedingDay',
        label: 'Breeding Day of Month',
        type: 'number',
        defaultValue: 1,
        min: 1,
        max: 31,
        step: 1,
        placeholder: 'e.g. 1',
        required: true,
      },
      {
        id: 'breedingMonth',
        label: 'Breeding Month',
        type: 'select',
        options: [
          { label: 'January',   value: '0'   },
          { label: 'February',  value: '31'  },
          { label: 'March',     value: '59'  },
          { label: 'April',     value: '90'  },
          { label: 'May',       value: '120' },
          { label: 'June',      value: '151' },
          { label: 'July',      value: '181' },
          { label: 'August',    value: '212' },
          { label: 'September', value: '243' },
          { label: 'October',   value: '273' },
          { label: 'November',  value: '304' },
          { label: 'December',  value: '334' },
        ],
        defaultValue: '0',
        required: true,
      },
      {
        id: 'species',
        label: 'Species',
        type: 'select',
        options: [
          { label: 'Cattle / Cow (283 days)',  value: '283' },
          { label: 'Horse / Mare (340 days)',  value: '340' },
          { label: 'Pig / Sow (114 days)',     value: '114' },
          { label: 'Sheep / Ewe (147 days)',   value: '147' },
          { label: 'Goat / Doe (150 days)',    value: '150' },
          { label: 'Dog (63 days)',            value: '63'  },
          { label: 'Cat (65 days)',            value: '65'  },
          { label: 'Rabbit (31 days)',         value: '31'  },
        ],
        defaultValue: '283',
        required: true,
      },
    ],
    formulas: [
      // Approximate day of year for breeding date
      { id: 'dayOfYear',     expression: 'breedingDay + breedingMonth',                                      dependencies: ['breedingDay', 'breedingMonth'] },
      { id: 'birthDayOfYear',expression: 'dayOfYear + species',                                              dependencies: ['dayOfYear', 'species'] },
      // Wrap around year boundary
      { id: 'birthDayNorm',  expression: 'birthDayOfYear > 365 ? birthDayOfYear - 365 : birthDayOfYear',    dependencies: ['birthDayOfYear'] },
      { id: 'gestationDays', expression: 'species',                                                          dependencies: ['species'] },
      { id: 'gestationWeeks',expression: 'species / 7',                                                      dependencies: ['species'] },
    ],
    outputs: [
      { id: 'out-gestationDays',  label: 'Gestation Period',                 formulaRef: 'gestationDays',  format: 'number', precision: 0, suffix: ' days',  highlight: true },
      { id: 'out-gestationWeeks', label: 'Gestation in Weeks',              formulaRef: 'gestationWeeks', format: 'number', precision: 1, suffix: ' weeks' },
      { id: 'out-birthDayOfYear', label: 'Approx. Day of Year for Birth',   formulaRef: 'birthDayOfYear', format: 'number', precision: 0 },
    ],
    guide: {
      whatIsIt:
        'Gestation period is the time from conception (breeding) to birth. Knowing this allows livestock producers to prepare birthing facilities, adjust nutritional programmes in late gestation, and ensure appropriate monitoring around the expected birth date. Values are average — individual animals may vary by ±2 weeks.',
      howToUse:
        'Select the day and month of breeding, then choose the species. The calculator returns the gestation period in days and weeks, and the approximate day of year when birth is expected. Add the day of year result to your calendar for monitoring.',
      exampleScenario:
        'A cow bred on January 15 (day 15): gestation = 283 days. Expected calving ≈ day 298 of the year ≈ October 25. Mark October 20–30 in the farm calendar for close monitoring. Begin transitioning to pre-calving mineral supplements at day 250 (≈ September 7).',
      proTip:
        'Late-gestation nutritional management is critical for colostrum quality and calf health. Increase energy density for cows in the last 3 weeks before calving. For pigs, farrowing rate is maximised when sows are moved to farrowing crates 3–5 days before the expected farrowing date. Keep breeding records digitally to cross-reference with production data.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 28. Feed Conversion Ratio (FCR) Calculator
  // =========================================================================
  {
    id: 'feed-conversion-ratio',
    slug: 'feed-conversion-ratio',
    title: 'Feed Conversion Ratio (FCR) Calculator',
    description:
      'Calculate feed conversion ratio (FCR), feed cost per kg of live weight gained, and feed efficiency for any livestock species.',
    icon: '🐖',
    category: 'agriculture',
    subcategory: 'livestock',
    tags: ['fcr', 'feed conversion', 'feed efficiency', 'livestock', 'poultry', 'swine', 'cattle', 'aquaculture'],
    inputs: [
      {
        id: 'feedConsumed',
        label: 'Feed Consumed',
        type: 'number',
        defaultValue: 100,
        min: 0.01,
        step: 1,
        placeholder: 'e.g. 100',
        units: [
          { label: 'kg',  value: '1'        },
          { label: 'lbs', value: '0.453592' },
        ],
        helpText: 'Total feed consumed over the measurement period.',
        required: true,
      },
      {
        id: 'weightGained',
        label: 'Live Weight Gained',
        type: 'number',
        defaultValue: 25,
        min: 0.01,
        step: 0.5,
        placeholder: 'e.g. 25',
        units: [
          { label: 'kg',  value: '1'        },
          { label: 'lbs', value: '0.453592' },
        ],
        helpText: 'Total live weight gained over the same period.',
        required: true,
      },
      {
        id: 'feedCostPerKg',
        label: 'Feed Cost (USD per kg)',
        type: 'number',
        defaultValue: 0.40,
        min: 0,
        step: 0.01,
        placeholder: 'e.g. 0.40',
        helpText: 'Cost of feed per kilogram. Poultry feed ≈ $0.30–0.50 · Pig feed ≈ $0.25–0.40',
        required: true,
      },
    ],
    formulas: [
      // FCR = feed consumed / weight gained (both in kg via unit conversion)
      { id: 'fcr',              expression: 'feedConsumed / weightGained',        dependencies: ['feedConsumed', 'weightGained'] },
      // Feed cost per kg of gain
      { id: 'feedCostPerKgGain',expression: 'fcr * feedCostPerKg',               dependencies: ['fcr', 'feedCostPerKg'] },
      // Feed efficiency = 1/FCR × 100%
      { id: 'efficiency',       expression: '(1 / fcr) * 100',                    dependencies: ['fcr'] },
    ],
    outputs: [
      { id: 'out-fcr',              label: 'Feed Conversion Ratio',    formulaRef: 'fcr',              format: 'number',   precision: 2,             highlight: true },
      { id: 'out-feedCostPerKgGain',label: 'Feed Cost per kg Gained', formulaRef: 'feedCostPerKgGain',format: 'currency', precision: 2 },
      { id: 'out-efficiency',       label: 'Feed Efficiency',          formulaRef: 'efficiency',       format: 'number',   precision: 1, suffix: '%' },
    ],
    guide: {
      whatIsIt:
        'Feed Conversion Ratio (FCR) measures how efficiently an animal converts feed into body mass. FCR = feed consumed ÷ weight gained. Lower FCR = more efficient. Feed cost per kg of gain = FCR × feed price per kg. Improving FCR by 0.1 can save hundreds of dollars per tonne of production.',
      howToUse:
        'Enter the total feed consumed and live weight gained over the same period (both using the same unit). Enter the feed cost per kg. The calculator returns FCR, feed cost per kg of gain, and feed efficiency percentage.',
      exampleScenario:
        '100 kg feed → 25 kg weight gain: FCR = 4.0. At $0.40/kg feed: feed cost per kg of gain = $1.60. This is in the range for growing cattle (FCR 4–6). Broiler chickens at FCR 1.7 with $0.40/kg feed cost only $0.68 per kg gain — explaining poultry\'s economic dominance in protein production.',
      proTip:
        'Species benchmarks: Broiler chickens FCR ≈ 1.7–1.9 · Pigs ≈ 2.5–3.0 · Beef cattle ≈ 6–8 · Tilapia ≈ 1.5–1.8 · Salmon ≈ 1.1–1.3. Factors improving FCR: feed quality and amino acid balance, correct feeding frequency, minimal heat/cold stress, disease prevention, and genetic selection. Track FCR at the batch/pen level to identify underperforming groups early.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 29. Greenhouse Volume & Ventilation Calculator
  // =========================================================================
  {
    id: 'greenhouse-ventilation',
    slug: 'greenhouse-ventilation',
    title: 'Greenhouse Volume & Ventilation Calculator',
    description:
      'Calculate greenhouse air volume and the fan capacity required to achieve target air changes per hour for temperature and humidity control.',
    icon: '🏡',
    category: 'agriculture',
    subcategory: 'irrigation',
    tags: ['greenhouse', 'ventilation', 'air changes', 'fan capacity', 'temperature', 'humidity', 'volume'],
    inputs: [
      {
        id: 'length',
        label: 'Greenhouse Length (m)',
        type: 'number',
        defaultValue: 30,
        min: 1,
        step: 0.5,
        placeholder: 'e.g. 30',
        required: true,
      },
      {
        id: 'width',
        label: 'Greenhouse Width (m)',
        type: 'number',
        defaultValue: 8,
        min: 1,
        step: 0.5,
        placeholder: 'e.g. 8',
        required: true,
      },
      {
        id: 'ridgeHeight',
        label: 'Ridge (Peak) Height (m)',
        type: 'number',
        defaultValue: 4,
        min: 1,
        max: 20,
        step: 0.1,
        placeholder: 'e.g. 4',
        helpText: 'Height at the highest point of the roof',
        required: true,
      },
      {
        id: 'sidewallHeight',
        label: 'Sidewall (Gutter) Height (m)',
        type: 'number',
        defaultValue: 2.5,
        min: 0.5,
        max: 15,
        step: 0.1,
        placeholder: 'e.g. 2.5',
        helpText: 'Height at the eave/gutter where the roof meets the wall',
        required: true,
      },
      {
        id: 'airChanges',
        label: 'Air Changes per Hour (ACH)',
        type: 'number',
        defaultValue: 60,
        min: 1,
        max: 200,
        step: 5,
        placeholder: 'e.g. 60',
        helpText: '60 ACH typical for summer cooling · 20 ACH for winter ventilation · 1–2 ACH for night minimum',
        required: true,
      },
    ],
    formulas: [
      // Approximate volume: use average of ridge and sidewall heights × L × W
      { id: 'avgHeight',    expression: '(ridgeHeight + sidewallHeight) / 2',    dependencies: ['ridgeHeight', 'sidewallHeight'] },
      { id: 'volume',       expression: 'length * width * avgHeight',            dependencies: ['length', 'width', 'avgHeight'] },
      // Fan capacity (m³/min) = volume × ACH / 60 minutes
      { id: 'ventRequired', expression: 'volume * airChanges / 60',             dependencies: ['volume', 'airChanges'] },
      { id: 'ventM3PerHour',expression: 'volume * airChanges',                  dependencies: ['volume', 'airChanges'] },
    ],
    outputs: [
      { id: 'out-volume',       label: 'Greenhouse Volume',     formulaRef: 'volume',       format: 'number', precision: 1, suffix: ' m³',    highlight: true },
      { id: 'out-ventRequired', label: 'Fan Capacity Needed',   formulaRef: 'ventRequired', format: 'number', precision: 1, suffix: ' m³/min' },
      { id: 'out-ventM3PerHour',label: 'Ventilation Rate',      formulaRef: 'ventM3PerHour',format: 'number', precision: 0, suffix: ' m³/hr' },
    ],
    guide: {
      whatIsIt:
        'Greenhouse ventilation is sized in air changes per hour (ACH): how many times the entire greenhouse air volume is replaced per hour. For summer cooling, 60 ACH is a common design standard. Fan capacity (m³/min) = volume × ACH / 60. Volume is approximated as length × width × average height.',
      howToUse:
        'Enter the greenhouse dimensions and the target air changes per hour. The calculator returns the greenhouse air volume and the minimum fan capacity in m³/min and m³/hr. Select fans with a combined capacity meeting or exceeding the ventRequired output.',
      exampleScenario:
        'A 30 × 8 m greenhouse with 4 m ridge and 2.5 m sidewall (average height 3.25 m): Volume = 780 m³. At 60 ACH: fan capacity needed = 780 m³/min — split across two 390 m³/min fans. Most commercial greenhouse fans are rated 500–5,000 m³/min.',
      proTip:
        'Locate exhaust fans on the leeward wall and passive inlets on the windward wall to use prevailing winds. In hot climates, evaporative cooling pads combined with fans (fan-and-pad systems) can reduce air temperature by 6–10°C. Control fans with thermostat staging: stage 1 activates at 25°C, stage 2 at 28°C, emergency full ventilation at 30°C.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 30. Soil Moisture Percentage Calculator
  // =========================================================================
  {
    id: 'soil-moisture',
    slug: 'soil-moisture',
    title: 'Soil Moisture Percentage Calculator',
    description:
      'Calculate gravimetric and volumetric soil water content from wet/dry weight and bulk density measurements.',
    icon: '🌍',
    category: 'agriculture',
    subcategory: 'irrigation',
    tags: ['soil moisture', 'gravimetric', 'volumetric', 'water content', 'bulk density', 'field capacity', 'wilting point'],
    inputs: [
      {
        id: 'wetWeight',
        label: 'Wet Soil Sample Weight (g)',
        type: 'number',
        defaultValue: 150,
        min: 0.01,
        step: 0.5,
        placeholder: 'e.g. 150',
        helpText: 'Weight of soil sample before oven-drying',
        required: true,
      },
      {
        id: 'dryWeight',
        label: 'Dry Soil Sample Weight (g)',
        type: 'number',
        defaultValue: 120,
        min: 0.01,
        step: 0.5,
        placeholder: 'e.g. 120',
        helpText: 'Weight after oven-drying at 105°C for 24 hours',
        required: true,
      },
      {
        id: 'soilBulkDensity',
        label: 'Bulk Density (g/cm³)',
        type: 'number',
        defaultValue: 1.3,
        min: 0.1,
        max: 2.0,
        step: 0.05,
        placeholder: 'e.g. 1.3',
        helpText: 'Typical: sandy soil ≈ 1.5 · loam ≈ 1.3 · clay ≈ 1.1 · organic/peat ≈ 0.5',
        required: true,
      },
    ],
    formulas: [
      // Gravimetric water content (g water / g dry soil × 100)
      { id: 'gravimetric', expression: '(wetWeight - dryWeight) / dryWeight * 100',                   dependencies: ['wetWeight', 'dryWeight'] },
      // Volumetric = gravimetric × bulk density (m³ water / m³ soil × 100)
      { id: 'volumetric',  expression: 'gravimetric * soilBulkDensity / 100 * 100',                   dependencies: ['gravimetric', 'soilBulkDensity'] },
      // Water per m³ of soil in litres = volumetric% × 10
      { id: 'waterPerM3',  expression: 'volumetric * 10',                                              dependencies: ['volumetric'] },
    ],
    outputs: [
      { id: 'out-gravimetric', label: 'Gravimetric Water Content', formulaRef: 'gravimetric', format: 'number', precision: 2, suffix: '%',         highlight: true },
      { id: 'out-volumetric',  label: 'Volumetric Water Content',  formulaRef: 'volumetric',  format: 'number', precision: 2, suffix: '%' },
      { id: 'out-waterPerM3',  label: 'Water per m³ of Soil',      formulaRef: 'waterPerM3',  format: 'number', precision: 1, suffix: ' liters/m³' },
    ],
    guide: {
      whatIsIt:
        'Soil moisture content is measured gravimetrically by comparing the wet and oven-dry weight of a sample. Gravimetric water content (g water / g dry soil) × 100%. Volumetric water content (m³ water / m³ soil) = gravimetric × bulk density. Volumetric content is needed for irrigation scheduling because it relates to the volume of water available per unit of soil volume.',
      howToUse:
        'Collect a soil sample, weigh it before drying (wet weight), dry at 105°C for 24 hours in an oven, then weigh again (dry weight). Enter both weights and the approximate bulk density for your soil type. The calculator returns both moisture metrics and the water volume held per cubic metre of soil.',
      exampleScenario:
        'Wet weight 150 g, dry weight 120 g: gravimetric = (150−120)/120 × 100 = 25%. For loam soil (BD = 1.3 g/cm³): volumetric = 25 × 1.3 = 32.5%. This is within the typical field capacity range (30–40%). Water held = 325 liters/m³ of soil.',
      proTip:
        'Field capacity (FC) is typically 30–40% volumetric, permanent wilting point (PWP) 10–15%. The plant-available water = FC − PWP. Irrigate when soil reaches 50% depletion of available water for most crops, or 35% for stress-sensitive crops like vegetables. Microwave drying (2–3 min at medium power) can approximate oven-dry weights in the field as a rapid check method.',
    },
    metadata: { version: '1.0.0' },
  },
];
