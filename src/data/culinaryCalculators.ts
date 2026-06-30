import type { CalculatorSchema } from '@/types/calculator';

export const culinaryCalculators: CalculatorSchema[] = [

  // ─── 71. Baker's Percentage ──────────────────────────────────────────
  {
    id: 'bakers-percentage',
    slug: 'bakers-percentage',
    title: "Baker's Percentage Calculator",
    description: "Calculate baker's percentages for bread and pastry recipes. Flour is always 100%; all other ingredients are expressed as a percentage of flour weight.",
    icon: '🍞',
    category: 'culinary',
    subcategory: 'baking',
    tags: ["baker's percentage", 'bread', 'hydration', 'dough', 'flour', 'yeast', 'baking'],
    inputs: [
      {
        id: 'flourWeight',
        label: 'Flour Weight (g)',
        type: 'number',
        defaultValue: 500,
        min: 1,
        helpText: "Total flour = 100% in baker's math.",
      },
      {
        id: 'waterWeight',
        label: 'Water Weight (g)',
        type: 'number',
        defaultValue: 375,
        min: 0,
        helpText: 'Typical bread hydration is 70-80%.',
      },
      {
        id: 'saltWeight',
        label: 'Salt Weight (g)',
        type: 'number',
        defaultValue: 10,
        min: 0,
      },
      {
        id: 'yeastWeight',
        label: 'Yeast Weight (g)',
        type: 'number',
        defaultValue: 5,
        min: 0,
        helpText: 'Active dry or instant yeast.',
      },
      {
        id: 'otherIngredients',
        label: 'Other Ingredients (g)',
        type: 'number',
        defaultValue: 0,
        min: 0,
        helpText: 'Sugar, fat, milk, eggs, etc.',
      },
    ],
    formulas: [
      {
        id: 'hydration',
        expression: '(waterWeight / flourWeight) * 100',
        dependencies: ['waterWeight', 'flourWeight'],
      },
      {
        id: 'saltPercent',
        expression: '(saltWeight / flourWeight) * 100',
        dependencies: ['saltWeight', 'flourWeight'],
      },
      {
        id: 'yeastPercent',
        expression: '(yeastWeight / flourWeight) * 100',
        dependencies: ['yeastWeight', 'flourWeight'],
      },
      {
        id: 'otherPercent',
        expression: '(otherIngredients / flourWeight) * 100',
        dependencies: ['otherIngredients', 'flourWeight'],
      },
      {
        id: 'totalDoughWeight',
        expression: 'flourWeight + waterWeight + saltWeight + yeastWeight + otherIngredients',
        dependencies: ['flourWeight', 'waterWeight', 'saltWeight', 'yeastWeight', 'otherIngredients'],
      },
      {
        id: 'totalPercent',
        expression: 'hydration + saltPercent + yeastPercent + otherPercent + 100',
        dependencies: ['hydration', 'saltPercent', 'yeastPercent', 'otherPercent'],
      },
    ],
    outputs: [
      {
        id: 'hydrationOut',
        label: 'Hydration (Water %)',
        formulaRef: 'hydration',
        precision: 1,
        suffix: '%',
        highlight: true,
      },
      {
        id: 'saltPercentOut',
        label: 'Salt %',
        formulaRef: 'saltPercent',
        precision: 2,
        suffix: '%',
      },
      {
        id: 'yeastPercentOut',
        label: 'Yeast %',
        formulaRef: 'yeastPercent',
        precision: 2,
        suffix: '%',
      },
      {
        id: 'totalDoughWeightOut',
        label: 'Total Dough Weight',
        formulaRef: 'totalDoughWeight',
        precision: 0,
        suffix: ' g',
      },
      {
        id: 'totalPercentOut',
        label: 'Total Formula %',
        formulaRef: 'totalPercent',
        precision: 1,
        suffix: '%',
      },
    ],
    guide: {
      whatIsIt:
        "Baker's percentage is a ratio system where flour always equals 100%, and every other ingredient is expressed as a percentage of the total flour weight. A recipe with 500g flour and 375g water has 75% hydration. This system makes scaling recipes up or down trivial and allows bakers to compare formulas at a glance regardless of batch size.",
      howToUse:
        "Enter the weight of each ingredient in grams. The flour weight is the reference point (100%). The calculator outputs the hydration percentage, salt %, yeast %, total dough weight, and total formula percentage. Change the flour weight to scale the whole recipe instantly.",
      exampleScenario:
        "500g flour, 375g water, 10g salt, 5g yeast: Hydration = 75%, Salt = 2%, Yeast = 1%. Total dough = 890g. This is a classic French bread formula — slightly high hydration for an open crumb structure.",
      proTip:
        "Standard bread hydration ranges: sandwich bread 60-65%, baguette 68-73%, ciabatta 80-85%, focaccia 75-85%. Salt should be 1.8-2.2% of flour for proper flavor and yeast control. Instant yeast is typically used at 0.5-1%, active dry at 1-1.5%. Keep total formula % at or above 160% for a full, balanced loaf.",
    },
    metadata: { version: '1.0.0' },
  },

  // ─── 72. Brine Concentration ─────────────────────────────────────────
  {
    id: 'brine-concentration',
    slug: 'brine-concentration',
    title: 'Brine Concentration Calculator',
    description: 'Calculate the exact amount of salt needed for any brine concentration, with corrections for salt type and density.',
    icon: '🧂',
    category: 'culinary',
    subcategory: 'baking',
    tags: ['brine', 'salt', 'fermentation', 'pickling', 'lacto-ferment', 'salinity', 'curing'],
    inputs: [
      {
        id: 'waterMl',
        label: 'Water Volume (mL)',
        type: 'number',
        defaultValue: 1000,
        min: 1,
        placeholder: 'e.g. 1000',
      },
      {
        id: 'salinityPercent',
        label: 'Target Salinity (%)',
        type: 'number',
        defaultValue: 3,
        step: 0.5,
        min: 0.1,
        helpText: 'Vegetable lacto-ferment: 2-3%, Brined chicken: 5-6%, Corned beef: 8-10%.',
      },
      {
        id: 'saltType',
        label: 'Salt Type',
        type: 'select',
        defaultValue: '1',
        options: [
          { label: 'Table Salt (1 g/mL)', value: '1' },
          { label: 'Kosher Salt Diamond Crystal (0.69 g/mL)', value: '0.69' },
          { label: 'Kosher Salt Morton (0.93 g/mL)', value: '0.93' },
          { label: 'Sea Salt (0.95 g/mL)', value: '0.95' },
        ],
      },
    ],
    formulas: [
      {
        id: 'waterGrams',
        expression: 'waterMl',
        dependencies: ['waterMl'],
      },
      {
        id: 'saltGrams',
        expression: '(waterGrams * salinityPercent) / (100 - salinityPercent)',
        dependencies: ['waterGrams', 'salinityPercent'],
      },
      {
        id: 'saltVolumeMl',
        expression: 'saltGrams / saltType',
        dependencies: ['saltGrams', 'saltType'],
      },
      {
        id: 'saltTsp',
        expression: 'saltVolumeMl / 4.92892',
        dependencies: ['saltVolumeMl'],
      },
      {
        id: 'totalBrineGrams',
        expression: 'waterGrams + saltGrams',
        dependencies: ['waterGrams', 'saltGrams'],
      },
      {
        id: 'actualSalinity',
        expression: '(saltGrams / totalBrineGrams) * 100',
        dependencies: ['saltGrams', 'totalBrineGrams'],
      },
    ],
    outputs: [
      {
        id: 'saltGramsOut',
        label: 'Salt Required',
        formulaRef: 'saltGrams',
        precision: 1,
        suffix: ' g',
        highlight: true,
      },
      {
        id: 'saltTspOut',
        label: 'Salt in Teaspoons',
        formulaRef: 'saltTsp',
        precision: 2,
        suffix: ' tsp',
      },
      {
        id: 'actualSalinityOut',
        label: 'Actual Salinity',
        formulaRef: 'actualSalinity',
        precision: 2,
        suffix: '%',
      },
      {
        id: 'totalBrineGramsOut',
        label: 'Total Brine Weight',
        formulaRef: 'totalBrineGrams',
        precision: 0,
        suffix: ' g',
      },
    ],
    guide: {
      whatIsIt:
        'Brine concentration is measured as the weight of salt divided by the total weight of brine (salt + water), expressed as a percentage. This calculator uses the standard formula: salt needed = (water weight x target%) / (100% - target%). Different salt types have different densities, so the teaspoon conversion varies significantly between table salt and Diamond Crystal kosher salt.',
      howToUse:
        'Enter the volume of water in milliliters (1 mL water = 1 g water). Enter your target salinity percentage and select your salt type. The calculator outputs the exact salt weight in grams and an approximate teaspoon measurement.',
      exampleScenario:
        '1,000 mL water, 3% salinity with table salt: you need 30.93g salt (about 5.2 tsp). The same 3% with Diamond Crystal kosher would be about 7.5 tsp due to its lower density — a common recipe mistake that can ruin ferments.',
      proTip:
        'Always weigh salt in grams for brine work — teaspoon measurements vary too much by salt type to be reliable. For lacto-fermentation, 2-3% is the sweet spot that inhibits harmful bacteria while allowing beneficial lactobacillus to thrive. Below 1.5% risks spoilage; above 5% can inhibit fermentation completely.',
    },
    metadata: { version: '1.0.0' },
  },

  // ─── 73. ABV — Alcohol By Volume ─────────────────────────────────────
  {
    id: 'abv-calculator',
    slug: 'abv-calculator',
    title: 'ABV (Alcohol By Volume) Calculator',
    description: 'Calculate the alcohol content of homebrew beer, wine, or cider from original and final gravity readings using both the simple and accurate formulas.',
    icon: '🍺',
    category: 'culinary',
    subcategory: 'brewing',
    tags: ['abv', 'alcohol', 'homebrew', 'beer', 'wine', 'gravity', 'fermentation', 'brewing'],
    inputs: [
      {
        id: 'originalGravity',
        label: 'Original Gravity (OG)',
        type: 'number',
        defaultValue: 1.060,
        step: 0.001,
        min: 1.000,
        max: 1.200,
        helpText: 'OG measured before fermentation. Water = 1.000.',
      },
      {
        id: 'finalGravity',
        label: 'Final Gravity (FG)',
        type: 'number',
        defaultValue: 1.010,
        step: 0.001,
        min: 0.990,
        max: 1.100,
        helpText: 'FG measured after fermentation is complete.',
      },
    ],
    formulas: [
      {
        id: 'abvSimple',
        expression: '(originalGravity - finalGravity) * 131.25',
        dependencies: ['originalGravity', 'finalGravity'],
      },
      {
        id: 'abvAccurate',
        expression: '76.08 * (originalGravity - finalGravity) / (1.775 - originalGravity) * finalGravity / 0.794',
        dependencies: ['originalGravity', 'finalGravity'],
      },
      {
        id: 'apparentAttenuation',
        expression: '((originalGravity - finalGravity) / (originalGravity - 1)) * 100',
        dependencies: ['originalGravity', 'finalGravity'],
      },
      {
        id: 'caloriesPer12oz',
        expression: '(6.9 * finalGravity + 4 * (0.1808 * originalGravity + 0.8192 * finalGravity - 1)) * 3.55 * finalGravity',
        dependencies: ['finalGravity', 'originalGravity'],
      },
    ],
    outputs: [
      {
        id: 'abvAccurateOut',
        label: 'ABV (Accurate)',
        formulaRef: 'abvAccurate',
        precision: 2,
        suffix: '%',
        highlight: true,
      },
      {
        id: 'abvSimpleOut',
        label: 'ABV (Simple)',
        formulaRef: 'abvSimple',
        precision: 2,
        suffix: '%',
      },
      {
        id: 'apparentAttenuationOut',
        label: 'Apparent Attenuation',
        formulaRef: 'apparentAttenuation',
        precision: 1,
        suffix: '%',
      },
      {
        id: 'caloriesPer12ozOut',
        label: 'Estimated Calories (12 oz)',
        formulaRef: 'caloriesPer12oz',
        precision: 0,
      },
    ],
    guide: {
      whatIsIt:
        "Alcohol By Volume (ABV) measures what percentage of a beverage's total volume is ethanol. In homebrewing, yeast consumes sugars and produces alcohol, lowering the liquid's specific gravity. By measuring gravity before (OG) and after (FG) fermentation and comparing the drop, you can calculate ABV. The simple formula (OG-FG) x 131.25 is accurate up to about 6% ABV; the more complex formula handles high-gravity beers and wines better.",
      howToUse:
        'Measure original gravity before adding yeast using a hydrometer or refractometer. After fermentation is complete and stable (same reading 2-3 days in a row), measure final gravity. Enter both readings — OG typically 1.040-1.100, FG typically 1.005-1.020.',
      exampleScenario:
        'OG = 1.060, FG = 1.010: Simple ABV = 6.56%, Accurate ABV = 6.63%, Apparent Attenuation = 83.3%. This is a typical American Pale Ale profile — moderate strength with good yeast health.',
      proTip:
        "Apparent attenuation of 75-85% indicates healthy fermentation for most ale yeasts. If attenuation is below 70%, fermentation may have stalled — check temperature, pitch rate, and yeast health. Refractometers need a wort-correction factor after fermentation because alcohol changes the refractive index; use the Brix-to-FG calculator for accurate post-fermentation readings.",
    },
    metadata: { version: '1.0.0' },
  },

  // ─── 74. Recipe Scaling ──────────────────────────────────────────────
  {
    id: 'recipe-scaling',
    slug: 'recipe-scaling',
    title: 'Recipe Scaling Calculator',
    description: 'Scale any recipe up or down by servings or pan size with a single factor. Supports pan area conversion for baking.',
    icon: '📏',
    category: 'culinary',
    subcategory: 'scaling',
    tags: ['recipe scaling', 'servings', 'pan size', 'cooking', 'baking', 'multiply recipe'],
    inputs: [
      {
        id: 'originalServings',
        label: 'Original Servings',
        type: 'number',
        defaultValue: 4,
        min: 1,
        placeholder: 'e.g. 4',
      },
      {
        id: 'targetServings',
        label: 'Target Servings',
        type: 'number',
        defaultValue: 12,
        min: 1,
        placeholder: 'e.g. 12',
      },
      {
        id: 'originalAmount',
        label: 'Ingredient Amount to Scale',
        type: 'number',
        defaultValue: 500,
        min: 0,
        helpText: 'Enter any ingredient amount to scale it.',
      },
      {
        id: 'usePanConversion',
        label: 'Scale by Pan Size Instead',
        type: 'checkbox',
        defaultValue: false,
        helpText: 'Enable to scale by pan area rather than servings.',
      },
      {
        id: 'originalPanArea',
        label: 'Original Pan Area (sq cm)',
        type: 'number',
        defaultValue: 900,
        min: 1,
        helpText: '9x9 inch pan = approx 730 cm2, 9x13 = approx 1548 cm2.',
      },
      {
        id: 'targetPanArea',
        label: 'Target Pan Area (sq cm)',
        type: 'number',
        defaultValue: 1548,
        min: 1,
      },
    ],
    formulas: [
      {
        id: 'scalingFactor',
        expression: 'targetServings / originalServings',
        dependencies: ['targetServings', 'originalServings'],
      },
      {
        id: 'panScalingFactor',
        expression: 'targetPanArea / originalPanArea',
        dependencies: ['targetPanArea', 'originalPanArea'],
      },
      {
        id: 'finalFactor',
        expression: 'usePanConversion == 1 ? panScalingFactor : scalingFactor',
        dependencies: ['usePanConversion', 'panScalingFactor', 'scalingFactor'],
      },
      {
        id: 'scaledAmount',
        expression: 'originalAmount * finalFactor',
        dependencies: ['originalAmount', 'finalFactor'],
      },
      {
        id: 'percentChange',
        expression: '(finalFactor - 1) * 100',
        dependencies: ['finalFactor'],
      },
    ],
    outputs: [
      {
        id: 'scaledAmountOut',
        label: 'Scaled Amount',
        formulaRef: 'scaledAmount',
        precision: 2,
        highlight: true,
      },
      {
        id: 'finalFactorOut',
        label: 'Scaling Factor',
        formulaRef: 'finalFactor',
        precision: 3,
        suffix: 'x',
      },
      {
        id: 'percentChangeOut',
        label: '% Change',
        formulaRef: 'percentChange',
        precision: 1,
        suffix: '%',
      },
    ],
    guide: {
      whatIsIt:
        'Recipe scaling multiplies all ingredient quantities by a single factor derived from the ratio of target to original servings (or pan area). The same factor applies uniformly to every ingredient, preserving the recipe balance. Pan area scaling is used when changing baking pan size while keeping the same layer depth.',
      howToUse:
        "Enter your original and target serving counts (e.g. 4 to 12 = 3x). Enter any ingredient amount to see its scaled value. Toggle on 'Scale by Pan Size' and enter original and new pan areas in square centimeters to scale for a different baking vessel instead.",
      exampleScenario:
        "A cookie recipe makes 4 dozen. Scaling to 12 dozen (3x factor): if the original calls for 500g flour, the scaled amount is 1,500g. If moving from a 9x9 pan (730 cm2) to a 9x13 pan (1548 cm2), the factor is 2.12x — useful for brownie recipes.",
      proTip:
        'Leavening agents (baking powder, baking soda) do not always scale linearly — for 3x or more, use only 2-2.5x the leavening to avoid a bitter taste. Spices and salt also scale modestly; taste and adjust. Baking times do not scale with the serving count — they scale with pan depth and oven temperature. A larger batch in the same pan thickness bakes for the same time.',
    },
    metadata: { version: '1.0.0' },
  },

  // ─── 75. Cake Pan Size Converter ─────────────────────────────────────
  {
    id: 'cake-pan-size',
    slug: 'cake-pan-size',
    title: 'Cake Pan Size Converter',
    description: 'Calculate the recipe scaling factor when switching between different cake pan sizes and shapes.',
    icon: '🎂',
    category: 'culinary',
    subcategory: 'baking',
    tags: ['cake pan', 'pan size', 'baking', 'recipe scaling', 'round pan', 'square pan', 'area'],
    inputs: [
      {
        id: 'fromShape',
        label: 'Original Pan Shape',
        type: 'select',
        defaultValue: '1',
        options: [
          { label: 'Round', value: '1' },
          { label: 'Square / Rectangle', value: '0' },
        ],
      },
      {
        id: 'fromDim1',
        label: 'Original Diameter or Length (cm/in)',
        type: 'number',
        defaultValue: 23,
        min: 1,
        helpText: 'Diameter for round pans, or Length for square/rectangle.',
      },
      {
        id: 'fromDim2',
        label: 'Original Width (cm/in) — Square/Rect only',
        type: 'number',
        defaultValue: 23,
        min: 1,
        helpText: 'Width for square/rectangle pans. Ignored for round.',
      },
      {
        id: 'toShape',
        label: 'New Pan Shape',
        type: 'select',
        defaultValue: '0',
        options: [
          { label: 'Round', value: '1' },
          { label: 'Square / Rectangle', value: '0' },
        ],
      },
      {
        id: 'toDim1',
        label: 'New Diameter or Length (cm/in)',
        type: 'number',
        defaultValue: 20,
        min: 1,
      },
      {
        id: 'toDim2',
        label: 'New Width (cm/in) — Square/Rect only',
        type: 'number',
        defaultValue: 20,
        min: 1,
      },
    ],
    formulas: [
      {
        id: 'fromArea',
        expression: 'fromShape == 1 ? 3.14159265 * pow(fromDim1 / 2, 2) : fromDim1 * fromDim2',
        dependencies: ['fromShape', 'fromDim1', 'fromDim2'],
      },
      {
        id: 'toArea',
        expression: 'toShape == 1 ? 3.14159265 * pow(toDim1 / 2, 2) : toDim1 * toDim2',
        dependencies: ['toShape', 'toDim1', 'toDim2'],
      },
      {
        id: 'scaleFactor',
        expression: 'toArea / fromArea',
        dependencies: ['toArea', 'fromArea'],
      },
      {
        id: 'fromAreaCm2',
        expression: 'fromArea',
        dependencies: ['fromArea'],
      },
      {
        id: 'toAreaCm2',
        expression: 'toArea',
        dependencies: ['toArea'],
      },
    ],
    outputs: [
      {
        id: 'scaleFactorOut',
        label: 'Recipe Scaling Factor',
        formulaRef: 'scaleFactor',
        precision: 3,
        suffix: 'x',
        highlight: true,
      },
      {
        id: 'fromAreaCm2Out',
        label: 'Original Pan Area',
        formulaRef: 'fromAreaCm2',
        precision: 1,
        suffix: ' cm2',
      },
      {
        id: 'toAreaCm2Out',
        label: 'New Pan Area',
        formulaRef: 'toAreaCm2',
        precision: 1,
        suffix: ' cm2',
      },
    ],
    guide: {
      whatIsIt:
        'When you switch cake pan sizes, the recipe quantity must change proportionally to maintain the same batter depth and therefore the same baking time and texture. The scaling factor is simply: new pan area / original pan area. For round pans, area = pi x (diameter/2)^2; for square/rectangle, area = length x width.',
      howToUse:
        'Select the shape of your original pan, enter its dimensions, then do the same for the new pan. The calculator outputs the scaling factor. Multiply every ingredient in the recipe by this factor to adjust for the new pan.',
      exampleScenario:
        'Moving from a 23 cm round pan (area = 415 cm2) to a 20x20 cm square pan (area = 400 cm2): scale factor = 0.964x. You would use slightly less batter — about 96% of the original recipe. Close enough that rounding to the nearest egg or tablespoon is acceptable.',
      proTip:
        'A 9-inch round and 8-inch square pan have nearly identical areas (about 506 cm2 each), making them interchangeable in most recipes. Always keep batter depth the same when swapping pans — a deeper batter takes longer to bake and may undercook in the center. If the new pan produces a deeper layer, reduce oven temperature by 10-15 degrees and extend baking time.',
    },
    metadata: { version: '1.0.0' },
  },

  // ─── 76. Cost Per Portion ────────────────────────────────────────────
  {
    id: 'cost-per-portion',
    slug: 'cost-per-portion',
    title: 'Cost Per Portion Calculator',
    description: 'Calculate food cost per portion, suggested menu price using food cost percentage, and gross margin for restaurant or catering pricing.',
    icon: '💰',
    category: 'culinary',
    subcategory: 'scaling',
    tags: ['food cost', 'cost per portion', 'menu price', 'restaurant', 'catering', 'profit margin', 'pricing'],
    inputs: [
      {
        id: 'totalIngredientCost',
        label: 'Total Ingredient Cost (USD)',
        type: 'number',
        defaultValue: 45,
        min: 0,
        helpText: 'Total cost of all ingredients for the full recipe.',
      },
      {
        id: 'portions',
        label: 'Number of Portions',
        type: 'number',
        defaultValue: 8,
        min: 1,
        placeholder: 'e.g. 8',
      },
      {
        id: 'targetFoodCostPercent',
        label: 'Target Food Cost %',
        type: 'number',
        defaultValue: 30,
        min: 1,
        max: 100,
        helpText: 'Restaurant food cost target. Fine dining: 25-35%, casual: 28-35%.',
      },
      {
        id: 'laborCost',
        label: 'Labor Cost for Batch (USD)',
        type: 'number',
        defaultValue: 15,
        min: 0,
        helpText: 'Cook time x hourly rate for the full batch.',
      },
      {
        id: 'overhead',
        label: 'Overhead per Batch (USD)',
        type: 'number',
        defaultValue: 5,
        min: 0,
        helpText: 'Utilities, equipment wear, packaging.',
      },
    ],
    formulas: [
      {
        id: 'ingredientPerPortion',
        expression: 'totalIngredientCost / portions',
        dependencies: ['totalIngredientCost', 'portions'],
      },
      {
        id: 'totalCostPerPortion',
        expression: '(totalIngredientCost + laborCost + overhead) / portions',
        dependencies: ['totalIngredientCost', 'laborCost', 'overhead', 'portions'],
      },
      {
        id: 'menuPriceIngredient',
        expression: 'totalIngredientCost / portions / (targetFoodCostPercent / 100)',
        dependencies: ['totalIngredientCost', 'portions', 'targetFoodCostPercent'],
      },
      {
        id: 'menuPriceFull',
        expression: 'totalCostPerPortion / (targetFoodCostPercent / 100)',
        dependencies: ['totalCostPerPortion', 'targetFoodCostPercent'],
      },
      {
        id: 'grossMargin',
        expression: '(1 - targetFoodCostPercent / 100) * 100',
        dependencies: ['targetFoodCostPercent'],
      },
    ],
    outputs: [
      {
        id: 'menuPriceFullOut',
        label: 'Suggested Menu Price',
        formulaRef: 'menuPriceFull',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
      {
        id: 'totalCostPerPortionOut',
        label: 'Full Cost per Portion',
        formulaRef: 'totalCostPerPortion',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'ingredientPerPortionOut',
        label: 'Ingredient Cost per Portion',
        formulaRef: 'ingredientPerPortion',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'grossMarginOut',
        label: 'Gross Margin %',
        formulaRef: 'grossMargin',
        precision: 1,
        suffix: '%',
      },
    ],
    guide: {
      whatIsIt:
        'The Cost Per Portion Calculator uses the food cost percentage method: menu price = food cost / food cost %. For example, if an ingredient costs $5.63/portion and your target is 30% food cost, the menu price = $5.63 / 0.30 = $18.75. Adding labor and overhead gives the true cost basis for a fully-loaded pricing model.',
      howToUse:
        'Enter total ingredient cost for the batch, number of portions it yields, your target food cost percentage, labor cost for the batch, and overhead. The calculator shows the suggested menu price and breaks down the full cost per portion.',
      exampleScenario:
        '$45 ingredients, 8 portions, 30% food cost target, $15 labor, $5 overhead: Full cost/portion = $8.13. At 30% food cost: menu price = $27.08. Gross margin = 70%.',
      proTip:
        'Industry benchmarks: food cost 28-32% for casual dining, 25-28% for fine dining, 20-25% for quick service. Labor typically adds another 25-35% of revenue. Your total prime cost (food + labor) should stay under 60-65% of revenue to remain profitable. Review costs quarterly as ingredient prices fluctuate seasonally.',
    },
    metadata: { version: '1.0.0' },
  },

  // ─── 77. Coffee Brewing Ratio ─────────────────────────────────────────
  {
    id: 'coffee-ratio',
    slug: 'coffee-ratio',
    title: 'Coffee Brewing Ratio Calculator',
    description: 'Calculate the ideal water amount for any coffee brewing method using SCA-standard ratios and your preferred strength.',
    icon: '☕',
    category: 'culinary',
    subcategory: 'brewing',
    tags: ['coffee', 'brewing ratio', 'pour over', 'french press', 'espresso', 'SCA', 'extraction'],
    inputs: [
      {
        id: 'coffeeGrams',
        label: 'Coffee (grams)',
        type: 'number',
        defaultValue: 20,
        min: 1,
        helpText: 'Ground coffee. SCA standard: 55g/L. Espresso: 18-20g per 2oz shot.',
      },
      {
        id: 'ratio',
        label: 'Coffee-to-Water Ratio',
        type: 'select',
        defaultValue: '17',
        options: [
          { label: '1:15 (Strong)', value: '15' },
          { label: '1:16 (Strong-Medium)', value: '16' },
          { label: '1:17 (Medium)', value: '17' },
          { label: '1:18 (SCA Standard)', value: '18' },
          { label: '1:15.5 (Specialty)', value: '15.5' },
        ],
      },
      {
        id: 'method',
        label: 'Brewing Method Multiplier',
        type: 'select',
        defaultValue: '1',
        options: [
          { label: 'Pour Over / Drip (x1)', value: '1' },
          { label: 'French Press (x1)', value: '1' },
          { label: 'AeroPress (x1)', value: '1' },
          { label: 'Espresso — use 1:2 ratio (x2)', value: '2' },
        ],
      },
    ],
    formulas: [
      {
        id: 'waterMl',
        expression: 'coffeeGrams * ratio * method',
        dependencies: ['coffeeGrams', 'ratio', 'method'],
      },
      {
        id: 'waterGrams',
        expression: 'waterMl',
        dependencies: ['waterMl'],
      },
      {
        id: 'extractionYield',
        expression: 'coffeeGrams / waterMl * 100',
        dependencies: ['coffeeGrams', 'waterMl'],
      },
      {
        id: 'cupsOf8oz',
        expression: 'waterMl / 240',
        dependencies: ['waterMl'],
      },
    ],
    outputs: [
      {
        id: 'waterMlOut',
        label: 'Water Needed',
        formulaRef: 'waterMl',
        precision: 0,
        suffix: ' mL',
        highlight: true,
      },
      {
        id: 'cupsOf8ozOut',
        label: 'Cups (8 oz)',
        formulaRef: 'cupsOf8oz',
        precision: 2,
      },
      {
        id: 'extractionYieldOut',
        label: 'Coffee Concentration',
        formulaRef: 'extractionYield',
        precision: 2,
        suffix: '%',
      },
    ],
    guide: {
      whatIsIt:
        "The Specialty Coffee Association (SCA) defines the ideal brewing ratio as 55g of coffee per 1 liter of water (approximately 1:18.2). The coffee-to-water ratio directly controls strength: 1:15 is strong and bold, 1:18 is the SCA 'Golden Cup' standard for balanced extraction, and 1:20 is light and delicate.",
      howToUse:
        'Enter your coffee dose in grams, select your preferred ratio, and choose your brewing method. The calculator outputs the exact water volume needed and an estimated number of 8 oz cups.',
      exampleScenario:
        '20g coffee, 1:17 ratio, pour over: 340 mL water = 1.4 cups. This is a single strong pour-over. Double the coffee (40g) for two full cups at the same ratio (680 mL).',
      proTip:
        'The ratio controls strength but not flavor quality — that is controlled by extraction. Ideal extraction yield (weight of dissolved solids / coffee weight) is 18-22%. If your coffee tastes sour, it is under-extracted (grind finer or use hotter water). If it is bitter, it is over-extracted (grind coarser or use cooler water). Water temperature should be 90-96°C (194-205°F).',
    },
    metadata: { version: '1.0.0' },
  },

  // ─── 78. Meat Roasting Time ──────────────────────────────────────────
  {
    id: 'meat-roasting',
    slug: 'meat-roasting',
    title: 'Meat Roasting Time Calculator',
    description: 'Calculate estimated oven roasting time for beef, chicken, turkey, pork, and lamb based on weight, doneness, and oven temperature.',
    icon: '🥩',
    category: 'culinary',
    subcategory: 'scaling',
    tags: ['roasting', 'meat', 'oven', 'cook time', 'beef', 'chicken', 'turkey', 'pork', 'lamb'],
    inputs: [
      {
        id: 'weightLbs',
        label: 'Raw Weight (lbs)',
        type: 'number',
        defaultValue: 5,
        min: 0.5,
        step: 0.5,
        helpText: 'Raw/uncooked weight of the meat.',
      },
      {
        id: 'meatType',
        label: 'Meat Type & Doneness',
        type: 'select',
        defaultValue: '25',
        options: [
          { label: 'Beef Roast - Rare (20 min/lb)', value: '20' },
          { label: 'Beef Roast - Medium (25 min/lb)', value: '25' },
          { label: 'Beef Roast - Well Done (30 min/lb)', value: '30' },
          { label: 'Whole Chicken (20 min/lb)', value: '20' },
          { label: 'Turkey (15 min/lb)', value: '15' },
          { label: 'Pork Loin (25 min/lb)', value: '25' },
          { label: 'Lamb Leg (20 min/lb)', value: '20' },
        ],
      },
      {
        id: 'ovenTemp',
        label: 'Oven Temperature',
        type: 'select',
        defaultValue: '1.0',
        options: [
          { label: '325°F / 165°C (Slow)', value: '1.1' },
          { label: '350°F / 175°C (Standard)', value: '1.0' },
          { label: '375°F / 190°C (Moderate)', value: '0.9' },
          { label: '400°F / 200°C (Hot)', value: '0.8' },
        ],
        helpText: 'Higher temp = shorter cook time. Factor adjusts accordingly.',
      },
      {
        id: 'restingTime',
        label: 'Resting Time (minutes)',
        type: 'number',
        defaultValue: 20,
        min: 0,
        helpText: 'Resting time after removing from oven. Essential for juicy meat.',
      },
    ],
    formulas: [
      {
        id: 'cookMinutes',
        expression: 'weightLbs * meatType * ovenTemp',
        dependencies: ['weightLbs', 'meatType', 'ovenTemp'],
      },
      {
        id: 'cookHours',
        expression: 'floor(cookMinutes / 60)',
        dependencies: ['cookMinutes'],
      },
      {
        id: 'cookMins',
        expression: 'round(cookMinutes - cookHours * 60)',
        dependencies: ['cookMinutes', 'cookHours'],
      },
      {
        id: 'totalWithRest',
        expression: 'cookMinutes + restingTime',
        dependencies: ['cookMinutes', 'restingTime'],
      },
      {
        id: 'totalHours',
        expression: 'floor(totalWithRest / 60)',
        dependencies: ['totalWithRest'],
      },
    ],
    outputs: [
      {
        id: 'cookMinutesOut',
        label: 'Cook Time',
        formulaRef: 'cookMinutes',
        precision: 0,
        suffix: ' minutes',
        highlight: true,
      },
      {
        id: 'cookHoursOut',
        label: 'Hours',
        formulaRef: 'cookHours',
        precision: 0,
      },
      {
        id: 'totalWithRestOut',
        label: 'Total Time (inc. rest)',
        formulaRef: 'totalWithRest',
        precision: 0,
        suffix: ' min',
      },
    ],
    guide: {
      whatIsIt:
        'Roasting time is estimated using minutes-per-pound guidelines that vary by meat type, desired doneness, and oven temperature. These are starting-point estimates — the only reliable way to know meat is done is with an instant-read thermometer. Safe internal temperatures: Beef rare 52°C/125°F, medium 63°C/145°F, well done 77°C/170°F; Chicken/Turkey 74°C/165°F; Pork 63°C/145°F; Lamb medium 63°C/145°F.',
      howToUse:
        'Enter the raw weight in pounds, select the meat type and doneness level, and your oven temperature. Add your preferred resting time. The calculator outputs estimated cook time in minutes and hours, plus total time including rest.',
      exampleScenario:
        '5 lb beef roast, medium doneness, 350°F: 5 x 25 x 1.0 = 125 minutes cook time (about 2 hours 5 minutes). Add 20 minutes rest = 145 minutes total. Always verify with a thermometer — oven and meat variation is significant.',
      proTip:
        "Always rest roasted meat before carving: small roasts (under 3 lb) rest 10-15 minutes, large roasts (5+ lb) rest 20-30 minutes, turkeys rest 30-45 minutes. The internal temperature rises 5-8°F during resting ('carryover cooking'), so pull meat 5-8°F below your target temperature. A probe thermometer left in the roast throughout cooking is the most reliable method.",
    },
    metadata: { version: '1.0.0' },
  },

  // ─── 79. Dilution Ratio ──────────────────────────────────────────────
  {
    id: 'dilution-ratio',
    slug: 'dilution-ratio',
    title: 'Dilution Ratio Calculator',
    description: 'Calculate concentrate and water amounts for any dilution ratio using C1V1 = C2V2. Works for cleaning products, syrups, and lab solutions.',
    icon: '🧪',
    category: 'culinary',
    subcategory: 'brewing',
    tags: ['dilution', 'ratio', 'concentrate', 'cleaning', 'syrup', 'solution', 'C1V1'],
    inputs: [
      {
        id: 'concentrateAmount',
        label: 'Concentrate Parts',
        type: 'number',
        defaultValue: 1,
        min: 0.01,
        step: 0.1,
        helpText: 'Amount of concentrate (1 in a 1:10 ratio).',
      },
      {
        id: 'totalRatio',
        label: 'Total Parts (Concentrate + Diluent)',
        type: 'number',
        defaultValue: 10,
        min: 1,
        helpText: '10 means 1:10 total = 1 part concentrate in 10 total parts (9 parts water).',
      },
      {
        id: 'targetVolumeMl',
        label: 'Target Total Volume (mL)',
        type: 'number',
        defaultValue: 1000,
        min: 1,
        helpText: 'How much finished solution you want to make.',
      },
    ],
    formulas: [
      {
        id: 'waterRatio',
        expression: 'totalRatio - concentrateAmount',
        dependencies: ['totalRatio', 'concentrateAmount'],
      },
      {
        id: 'concentratePct',
        expression: '(concentrateAmount / totalRatio) * 100',
        dependencies: ['concentrateAmount', 'totalRatio'],
      },
      {
        id: 'concentrateForTarget',
        expression: 'targetVolumeMl * concentrateAmount / totalRatio',
        dependencies: ['targetVolumeMl', 'concentrateAmount', 'totalRatio'],
      },
      {
        id: 'waterForTarget',
        expression: 'targetVolumeMl - concentrateForTarget',
        dependencies: ['targetVolumeMl', 'concentrateForTarget'],
      },
    ],
    outputs: [
      {
        id: 'concentrateForTargetOut',
        label: 'Concentrate Needed',
        formulaRef: 'concentrateForTarget',
        precision: 1,
        suffix: ' mL',
        highlight: true,
      },
      {
        id: 'waterForTargetOut',
        label: 'Water/Diluent Needed',
        formulaRef: 'waterForTarget',
        precision: 1,
        suffix: ' mL',
      },
      {
        id: 'concentratePctOut',
        label: 'Concentrate %',
        formulaRef: 'concentratePct',
        precision: 2,
        suffix: '%',
      },
    ],
    guide: {
      whatIsIt:
        'The dilution formula C1V1 = C2V2 states that the amount of solute stays constant before and after dilution. For a simple ratio (e.g. 1:10), concentrate percentage = 1/10 = 10%. To make 1,000 mL of 1:10 solution: 100 mL concentrate + 900 mL water. This applies to cleaning products, cocktail syrups, stock solutions, and food-grade concentrates.',
      howToUse:
        'Enter the concentrate ratio parts (usually 1), the total ratio parts (e.g. 10 for 1:10), and how much finished solution you need in mL. The calculator outputs exactly how much concentrate and water to measure.',
      exampleScenario:
        '1:32 all-purpose cleaner (1 part concentrate, 32 total parts): to make 1L of ready-to-use spray, mix 31.25 mL concentrate with 968.75 mL water. The concentrate is 3.125% of the final solution.',
      proTip:
        "Common dilution ratios: all-purpose cleaner 1:32, heavy-duty degreaser 1:8, coffee syrup 1:4 (with water), stock concentrate 1:6. Always add concentrate TO water, not water to concentrate — this prevents splashing with caustic solutions and ensures proper mixing. Label your diluted solutions with the date and ratio.",
    },
    metadata: { version: '1.0.0' },
  },

  // ─── 80. Yeast Substitution ──────────────────────────────────────────
  {
    id: 'yeast-substitution',
    slug: 'yeast-substitution',
    title: 'Yeast Substitution Calculator',
    description: 'Convert yeast amounts between active dry, instant/fast-rise, and fresh/cake yeast using standard baker conversion ratios.',
    icon: '🧫',
    category: 'culinary',
    subcategory: 'baking',
    tags: ['yeast', 'substitution', 'active dry', 'instant yeast', 'fresh yeast', 'baking', 'bread'],
    inputs: [
      {
        id: 'fromYeastType',
        label: 'Yeast Type in Recipe',
        type: 'select',
        defaultValue: '1',
        options: [
          { label: 'Active Dry', value: '1' },
          { label: 'Instant / Fast-rise', value: '0.75' },
          { label: 'Fresh / Cake', value: '3' },
        ],
      },
      {
        id: 'toYeastType',
        label: 'Yeast Type You Have',
        type: 'select',
        defaultValue: '0.75',
        options: [
          { label: 'Active Dry', value: '1' },
          { label: 'Instant / Fast-rise', value: '0.75' },
          { label: 'Fresh / Cake', value: '3' },
        ],
      },
      {
        id: 'amount',
        label: 'Amount in Recipe (g)',
        type: 'number',
        defaultValue: 7,
        step: 0.5,
        min: 0.1,
        helpText: '7g is approximately 1 standard sachet of active dry yeast.',
      },
    ],
    formulas: [
      {
        id: 'amountNeeded',
        expression: 'amount * toYeastType / fromYeastType',
        dependencies: ['amount', 'toYeastType', 'fromYeastType'],
      },
      {
        id: 'tspNeeded',
        expression: 'amountNeeded / 3',
        dependencies: ['amountNeeded'],
      },
    ],
    outputs: [
      {
        id: 'amountNeededOut',
        label: 'Substituted Amount',
        formulaRef: 'amountNeeded',
        precision: 2,
        suffix: ' g',
        highlight: true,
      },
      {
        id: 'tspNeededOut',
        label: 'Approx in Teaspoons',
        formulaRef: 'tspNeeded',
        precision: 2,
        suffix: ' tsp',
      },
    ],
    guide: {
      whatIsIt:
        'Yeast conversion ratios: Active Dry is the reference (1.0x). Instant yeast is more concentrated and potent — use 0.75x the amount (25% less). Fresh/Cake yeast is the least concentrated — use 3x the amount. The ratios are: Active Dry to Instant = multiply by 0.75; Active Dry to Fresh = multiply by 3; Instant to Fresh = multiply by 4.',
      howToUse:
        "Select the yeast type called for in your recipe and the type you have on hand. Enter the recipe's yeast amount in grams. The calculator outputs the equivalent amount of your substituted yeast in grams and approximate teaspoons.",
      exampleScenario:
        'Recipe calls for 7g Active Dry yeast; you have Instant: 7 x 0.75 = 5.25g Instant yeast (about 1.75 tsp). Recipe calls for 7g Active Dry; you have Fresh: 7 x 3 = 21g Fresh yeast.',
      proTip:
        'Active Dry yeast traditionally requires proofing (dissolving in warm 38-43°C water with a pinch of sugar for 5-10 minutes before adding to dough). Instant yeast can be added directly to dry ingredients — no proofing needed. Fresh yeast has the shortest shelf life (2-3 weeks refrigerated) and must be refrigerated at all times. It gives the most complex, traditional flavor and is preferred by artisan bakers. Freeze excess fresh yeast in small cubes for up to 3 months.',
    },
    metadata: { version: '1.0.0' },
  },
];
