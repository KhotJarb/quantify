import type { CalculatorSchema } from '@/types/calculator';

export const constructionCalculators: CalculatorSchema[] = [
  // ─── 1. Concrete Volume Calculator ───────────────────────────────────────────
  {
    id: 'concrete-calculator',
    slug: 'concrete-calculator',
    title: 'Concrete Volume Calculator',
    description:
      'Calculate the volume of concrete needed for a slab in cubic yards and cubic feet, with automatic 10% waste factor and 80 lb bag count.',
    icon: '🏗️',
    category: 'construction',
    subcategory: 'concrete',
    tags: ['concrete', 'slab', 'cubic yards', 'cubic feet', 'cement', 'foundation', 'diy'],
    inputs: [
      {
        id: 'length',
        label: 'Slab Length',
        type: 'number',
        defaultValue: 10,
        min: 0.1,
        placeholder: 'e.g. 10',
        helpText: 'Length of the concrete slab in feet',
        required: true,
      },
      {
        id: 'width',
        label: 'Slab Width',
        type: 'number',
        defaultValue: 10,
        min: 0.1,
        placeholder: 'e.g. 10',
        helpText: 'Width of the concrete slab in feet',
        required: true,
      },
      {
        id: 'thickness',
        label: 'Slab Thickness',
        type: 'number',
        defaultValue: 4,
        min: 1,
        max: 24,
        placeholder: 'e.g. 4',
        helpText: 'Thickness of the slab in inches',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'cubicFeetRaw',
        expression: 'length * width * (thickness / 12)',
        dependencies: ['length', 'width', 'thickness'],
      },
      {
        id: 'cubicFeet',
        expression: 'cubicFeetRaw * 1.1',
        dependencies: ['cubicFeetRaw'],
      },
      {
        id: 'cubicYards',
        expression: 'cubicFeet / 27',
        dependencies: ['cubicFeet'],
      },
      {
        id: 'bagsNeeded',
        expression: 'ceil(cubicFeet / 0.45)',
        dependencies: ['cubicFeet'],
      },
    ],
    outputs: [
      {
        id: 'cubicYardsOut',
        label: 'Concrete Needed (incl. 10% waste)',
        formulaRef: 'cubicYards',
        format: 'number',
        precision: 2,
        suffix: ' yd³',
        highlight: true,
      },
      {
        id: 'cubicFeetOut',
        label: 'Cubic Feet',
        formulaRef: 'cubicFeet',
        format: 'number',
        precision: 2,
        suffix: ' ft³',
      },
      {
        id: 'bagsNeededOut',
        label: '80 lb Bags Required',
        formulaRef: 'bagsNeeded',
        format: 'number',
        precision: 0,
        suffix: ' bags',
      },
    ],
    guide: {
      whatIsIt:
        'The Concrete Volume Calculator estimates how much concrete you need for a rectangular slab project — driveways, patios, footings, or floors — in cubic yards, cubic feet, and 80 lb pre-mix bag counts. A 10% waste allowance is automatically included.',
      howToUse:
        '1. Enter the slab length and width in feet.\n2. Enter the slab thickness in inches (4 inches is standard for residential slabs).\n3. Review the cubic yard total — that is what you order from a ready-mix supplier.\n4. Use the bag count if you plan to mix by hand with pre-bagged concrete.',
      exampleScenario:
        'You are pouring a 12 × 20 ft patio that is 4 inches thick. Raw volume = 12 × 20 × (4/12) / 27 ≈ 2.96 yd³. With 10% waste you should order ≈ 3.26 yd³ and have about 241 bags on hand as a backup.',
      proTip:
        'Ready-mix trucks typically deliver a minimum of 1 cubic yard. For anything under 1 yd³, pre-bagged concrete is more economical. For slabs over 4 inches thick (e.g., heavy equipment areas), consider 6 inches and add rebar or wire mesh for tensile strength.',
    },
    metadata: { version: '1.0.0' },
  },

  // ─── 2. Drywall Calculator ────────────────────────────────────────────────────
  {
    id: 'drywall-calculator',
    slug: 'drywall-calculator',
    title: 'Drywall Calculator',
    description:
      'Estimate 4×8 drywall sheets, drywall screws, and joint tape needed to finish a room, accounting for doors and windows.',
    icon: '🪣',
    category: 'construction',
    subcategory: 'interior',
    tags: ['drywall', 'sheetrock', 'gypsum board', 'interior', 'walls', 'remodel', 'diy'],
    inputs: [
      {
        id: 'roomLength',
        label: 'Room Length',
        type: 'number',
        defaultValue: 12,
        min: 1,
        placeholder: 'e.g. 12',
        helpText: 'Room length in feet',
        required: true,
      },
      {
        id: 'roomWidth',
        label: 'Room Width',
        type: 'number',
        defaultValue: 10,
        min: 1,
        placeholder: 'e.g. 10',
        helpText: 'Room width in feet',
        required: true,
      },
      {
        id: 'wallHeight',
        label: 'Wall Height',
        type: 'number',
        defaultValue: 9,
        min: 6,
        max: 20,
        placeholder: 'e.g. 9',
        helpText: 'Ceiling height in feet',
        required: true,
      },
      {
        id: 'numDoors',
        label: 'Number of Doors',
        type: 'number',
        defaultValue: 2,
        min: 0,
        max: 20,
        placeholder: 'e.g. 2',
        helpText: 'Standard door ≈ 21 sq ft deducted',
      },
      {
        id: 'numWindows',
        label: 'Number of Windows',
        type: 'number',
        defaultValue: 3,
        min: 0,
        max: 30,
        placeholder: 'e.g. 3',
        helpText: 'Standard window ≈ 15 sq ft deducted',
      },
    ],
    formulas: [
      {
        id: 'wallArea',
        expression: '2 * (roomLength + roomWidth) * wallHeight - numDoors * 21 - numWindows * 15',
        dependencies: ['roomLength', 'roomWidth', 'wallHeight', 'numDoors', 'numWindows'],
      },
      {
        id: 'sheetsNeeded',
        expression: 'ceil(wallArea / 32 * 1.1)',
        dependencies: ['wallArea'],
      },
      {
        id: 'screwsNeeded',
        expression: 'sheetsNeeded * 64',
        dependencies: ['sheetsNeeded'],
      },
      {
        id: 'tapeFeet',
        expression: 'sheetsNeeded * 40',
        dependencies: ['sheetsNeeded'],
      },
    ],
    outputs: [
      {
        id: 'sheetsNeededOut',
        label: 'Drywall Sheets (4×8)',
        formulaRef: 'sheetsNeeded',
        format: 'number',
        precision: 0,
        suffix: ' sheets',
        highlight: true,
      },
      {
        id: 'wallAreaOut',
        label: 'Net Wall Area',
        formulaRef: 'wallArea',
        format: 'number',
        precision: 1,
        suffix: ' ft²',
      },
      {
        id: 'screwsNeededOut',
        label: 'Drywall Screws',
        formulaRef: 'screwsNeeded',
        format: 'number',
        precision: 0,
        suffix: ' screws',
      },
      {
        id: 'tapeFeetOut',
        label: 'Joint Tape',
        formulaRef: 'tapeFeet',
        format: 'number',
        precision: 0,
        suffix: ' ft',
      },
    ],
    guide: {
      whatIsIt:
        'The Drywall Calculator estimates how many 4×8 sheets of drywall you need to cover the walls of a rectangular room. It subtracts door and window openings and adds a 10% overage for cuts and waste. It also estimates screw and joint tape quantities.',
      howToUse:
        '1. Enter the room length, width, and wall height.\n2. Input the number of doors and windows.\n3. The calculator returns sheets (with 10% waste), screws (≈64 per sheet), and joint tape (≈40 ft per sheet).\n4. Purchase complete boxes of screws — they typically come in 1 lb boxes of roughly 350 screws.',
      exampleScenario:
        'A 14 × 12 ft bedroom with 9 ft ceilings, 2 doors, and 2 windows: wall area = 2×(14+12)×9 − 2×21 − 2×15 = 468 − 42 − 30 = 396 ft². Sheets = ceil(396/32 × 1.1) = ceil(13.6) = 14 sheets.',
      proTip:
        '½-inch drywall is standard for interior walls; use ⅝-inch (Type X) for fire-rated assemblies and garage walls adjacent to living space. Always hang drywall horizontally — it is stronger and creates fewer butt joints to tape.',
    },
    metadata: { version: '1.0.0' },
  },

  // ─── 3. Paint Calculator ─────────────────────────────────────────────────────
  {
    id: 'paint-calculator',
    slug: 'paint-calculator',
    title: 'Paint Calculator',
    description:
      'Calculate gallons of paint needed for a room based on wall area, number of doors and windows, and coat count. Assumes 350 sq ft per gallon coverage.',
    icon: '🎨',
    category: 'construction',
    subcategory: 'interior',
    tags: ['paint', 'gallons', 'room', 'interior', 'coats', 'wall area', 'diy'],
    inputs: [
      {
        id: 'roomLength',
        label: 'Room Length',
        type: 'number',
        defaultValue: 12,
        min: 1,
        placeholder: 'e.g. 12',
        helpText: 'Room length in feet',
        required: true,
      },
      {
        id: 'roomWidth',
        label: 'Room Width',
        type: 'number',
        defaultValue: 10,
        min: 1,
        placeholder: 'e.g. 10',
        helpText: 'Room width in feet',
        required: true,
      },
      {
        id: 'ceilingHeight',
        label: 'Ceiling Height',
        type: 'number',
        defaultValue: 9,
        min: 6,
        max: 20,
        placeholder: 'e.g. 9',
        helpText: 'Wall height / ceiling height in feet',
        required: true,
      },
      {
        id: 'numDoors',
        label: 'Number of Doors',
        type: 'number',
        defaultValue: 1,
        min: 0,
        max: 20,
        helpText: 'Standard door ≈ 21 sq ft deducted',
      },
      {
        id: 'numWindows',
        label: 'Number of Windows',
        type: 'number',
        defaultValue: 2,
        min: 0,
        max: 30,
        helpText: 'Standard window ≈ 15 sq ft deducted',
      },
      {
        id: 'coats',
        label: 'Number of Coats',
        type: 'select',
        defaultValue: '2',
        options: [
          { label: '1 Coat', value: '1' },
          { label: '2 Coats', value: '2' },
          { label: '3 Coats', value: '3' },
        ],
        helpText: 'Two coats recommended for best coverage',
      },
    ],
    formulas: [
      {
        id: 'netWallArea',
        expression: '2 * (roomLength + roomWidth) * ceilingHeight - numDoors * 21 - numWindows * 15',
        dependencies: ['roomLength', 'roomWidth', 'ceilingHeight', 'numDoors', 'numWindows'],
      },
      {
        id: 'paintableArea',
        expression: 'netWallArea * coats',
        dependencies: ['netWallArea', 'coats'],
      },
      {
        id: 'gallonsNeeded',
        expression: 'ceil(paintableArea / 350)',
        dependencies: ['paintableArea'],
      },
    ],
    outputs: [
      {
        id: 'gallonsNeededOut',
        label: 'Gallons of Paint Needed',
        formulaRef: 'gallonsNeeded',
        format: 'number',
        precision: 0,
        suffix: ' gal',
        highlight: true,
      },
      {
        id: 'netWallAreaOut',
        label: 'Paintable Wall Area',
        formulaRef: 'netWallArea',
        format: 'number',
        precision: 1,
        suffix: ' ft²',
      },
      {
        id: 'paintableAreaOut',
        label: 'Total Area (all coats)',
        formulaRef: 'paintableArea',
        format: 'number',
        precision: 1,
        suffix: ' ft²',
      },
    ],
    guide: {
      whatIsIt:
        'The Paint Calculator estimates the number of gallons of paint needed to cover the walls of a room. It deducts standard door and window areas from the total wall surface and multiplies by the number of coats, using the industry standard of 350 sq ft per gallon.',
      howToUse:
        '1. Measure and enter room length, width, and ceiling height.\n2. Enter the number of doors and windows.\n3. Select the number of coats (2 is standard; primer + 2 finish coats requires a separate primer calculation).\n4. The calculator rounds up to whole gallons — always buy at least one extra quart for touch-ups.',
      exampleScenario:
        'A 15 × 12 ft living room with 9 ft ceilings, 1 door, and 3 windows, painted with 2 coats: net wall area = 2×(15+12)×9 − 21 − 45 = 486 − 66 = 420 ft². Paintable area = 840 ft². Gallons = ceil(840/350) = 3 gallons.',
      proTip:
        "Dark or saturated colors often require a tinted primer to reduce the number of topcoats needed. A 5-gallon bucket is cheaper per ounce than five 1-gallon cans. Keep the leftover paint sealed and labeled — you'll need it for touch-ups within the year.",
    },
    metadata: { version: '1.0.0' },
  },

  // ─── 4. Tile Calculator ──────────────────────────────────────────────────────
  {
    id: 'tile-calculator',
    slug: 'tile-calculator',
    title: 'Tile Calculator',
    description:
      'Calculate the number of tiles and grout bags needed for a floor or wall, including a configurable waste percentage.',
    icon: '🔲',
    category: 'construction',
    subcategory: 'interior',
    tags: ['tile', 'floor', 'wall', 'grout', 'ceramic', 'porcelain', 'diy', 'remodel'],
    inputs: [
      {
        id: 'areaLength',
        label: 'Area Length',
        type: 'number',
        defaultValue: 10,
        min: 0.1,
        placeholder: 'e.g. 10',
        helpText: 'Length of the area to tile in feet',
        required: true,
      },
      {
        id: 'areaWidth',
        label: 'Area Width',
        type: 'number',
        defaultValue: 8,
        min: 0.1,
        placeholder: 'e.g. 8',
        helpText: 'Width of the area to tile in feet',
        required: true,
      },
      {
        id: 'tileSizeInch',
        label: 'Tile Size',
        type: 'select',
        defaultValue: '1',
        options: [
          { label: '12×12 in (1 ft²)', value: '1' },
          { label: '18×18 in (2.25 ft²)', value: '2.25' },
          { label: '24×24 in (4 ft²)', value: '4' },
        ],
        helpText: 'Select tile size — value is sq ft per tile',
      },
      {
        id: 'wastePercent',
        label: 'Waste Factor',
        type: 'range',
        defaultValue: 10,
        min: 5,
        max: 20,
        step: 1,
        helpText: 'Extra tiles to account for cuts and breakage (%)',
      },
    ],
    formulas: [
      {
        id: 'totalArea',
        expression: 'areaLength * areaWidth',
        dependencies: ['areaLength', 'areaWidth'],
      },
      {
        id: 'tilesNeeded',
        expression: 'ceil(totalArea / tileSizeInch * (1 + wastePercent / 100))',
        dependencies: ['totalArea', 'tileSizeInch', 'wastePercent'],
      },
      {
        id: 'groutBags',
        expression: 'ceil(totalArea / 50)',
        dependencies: ['totalArea'],
      },
    ],
    outputs: [
      {
        id: 'tilesNeededOut',
        label: 'Tiles Needed',
        formulaRef: 'tilesNeeded',
        format: 'number',
        precision: 0,
        suffix: ' tiles',
        highlight: true,
      },
      {
        id: 'totalAreaOut',
        label: 'Total Area',
        formulaRef: 'totalArea',
        format: 'number',
        precision: 2,
        suffix: ' ft²',
      },
      {
        id: 'groutBagsOut',
        label: 'Grout Bags (25 lb)',
        formulaRef: 'groutBags',
        format: 'number',
        precision: 0,
        suffix: ' bags',
      },
    ],
    guide: {
      whatIsIt:
        'The Tile Calculator tells you exactly how many tiles and bags of grout to purchase for a floor or wall project. It accounts for a user-defined waste factor to cover breakage, edge cuts, and future repairs.',
      howToUse:
        '1. Enter the length and width of the area to be tiled.\n2. Select your tile size from the dropdown.\n3. Set the waste factor — use 10% for simple rectangular layouts, 15–20% for diagonal patterns or complex rooms.\n4. The result shows the total tile count and grout bag estimate.',
      exampleScenario:
        'Tiling a 10 × 8 ft bathroom floor with 12×12 tiles at 10% waste: area = 80 ft². Tiles = ceil(80/1 × 1.10) = 88 tiles. Grout = ceil(80/50) = 2 bags.',
      proTip:
        'Always buy at least 10% extra tiles and store them — tile dye lots change, and a perfect replacement match years later can be impossible to find. Diagonal installation adds roughly 15% waste due to corner cuts.',
    },
    metadata: { version: '1.0.0' },
  },

  // ─── 5. Roof Pitch Calculator ─────────────────────────────────────────────────
  {
    id: 'roof-pitch-calculator',
    slug: 'roof-pitch-calculator',
    title: 'Roof Pitch Calculator',
    description:
      'Calculate roof pitch ratio, approximate slope angle in degrees, and rafter length from rise and run measurements.',
    icon: '🏠',
    category: 'construction',
    subcategory: 'roofing',
    tags: ['roof', 'pitch', 'rafter', 'slope', 'angle', 'rise', 'run', 'roofing', 'diy'],
    inputs: [
      {
        id: 'rise',
        label: 'Rise',
        type: 'number',
        defaultValue: 6,
        min: 0,
        max: 24,
        placeholder: 'e.g. 6',
        helpText: 'Vertical rise in inches (per 12 inches of run)',
        required: true,
      },
      {
        id: 'run',
        label: 'Run',
        type: 'number',
        defaultValue: 12,
        min: 1,
        placeholder: 'e.g. 12',
        helpText: 'Horizontal run in inches (standard = 12)',
        required: true,
      },
      {
        id: 'roofWidth',
        label: 'Roof Width (Total Span)',
        type: 'number',
        defaultValue: 24,
        min: 1,
        placeholder: 'e.g. 24',
        helpText: 'Total horizontal span of the roof in feet',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'pitchRatio',
        expression: 'rise / run * 12',
        dependencies: ['rise', 'run'],
      },
      {
        id: 'angleFactor',
        expression: 'rise / run',
        dependencies: ['rise', 'run'],
      },
      {
        // atan approximation: atan(x) ≈ x / (1 + 0.28125 * x²), result in radians → degrees
        id: 'angle',
        expression: 'angleFactor / (1 + 0.28125 * pow(angleFactor, 2)) * 180 / PI',
        dependencies: ['angleFactor'],
      },
      {
        id: 'rafterLength',
        expression: 'roofWidth / 2 * sqrt(1 + pow(rise / run, 2))',
        dependencies: ['roofWidth', 'rise', 'run'],
      },
      {
        id: 'roofMultiplier',
        expression: 'sqrt(1 + pow(rise / run, 2))',
        dependencies: ['rise', 'run'],
      },
    ],
    outputs: [
      {
        id: 'pitchRatioOut',
        label: 'Roof Pitch',
        formulaRef: 'pitchRatio',
        format: 'number',
        precision: 2,
        suffix: ':12',
        highlight: true,
      },
      {
        id: 'angleOut',
        label: 'Slope Angle (approx.)',
        formulaRef: 'angle',
        format: 'number',
        precision: 1,
        suffix: '°',
      },
      {
        id: 'rafterLengthOut',
        label: 'Rafter Length',
        formulaRef: 'rafterLength',
        format: 'number',
        precision: 2,
        suffix: ' ft',
      },
      {
        id: 'roofMultiplierOut',
        label: 'Roof Multiplier',
        formulaRef: 'roofMultiplier',
        format: 'number',
        precision: 4,
      },
    ],
    guide: {
      whatIsIt:
        'The Roof Pitch Calculator converts a rise-over-run measurement into the standard X:12 pitch notation, estimates the slope angle in degrees, and calculates the rafter length (common rafter) from the total roof span. The pitch ratio tells you how many inches the roof rises for every 12 inches it runs horizontally.',
      howToUse:
        '1. Enter the rise in inches (how much the roof rises vertically).\n2. Enter the run — typically 12 for standard pitch notation.\n3. Enter the total roof width (horizontal span) in feet.\n4. Read the pitch ratio, approximate angle, and rafter length.',
      exampleScenario:
        'A 6:12 pitch roof over a 24 ft wide house: pitch = 6:12, angle ≈ 26.6°, rafter length = 24/2 × √(1 + (6/12)²) = 12 × 1.118 ≈ 13.4 ft per rafter.',
      proTip:
        'A 4:12 pitch is the minimum for most asphalt shingles. Pitches below 2:12 require special low-slope roofing materials. The roof multiplier × total roof area gives you the actual surface area of the roof — critical for ordering shingles.',
    },
    metadata: { version: '1.0.0' },
  },

  // ─── 6. Stair Calculator ─────────────────────────────────────────────────────
  {
    id: 'stair-calculator',
    slug: 'stair-calculator',
    title: 'Stair Calculator',
    description:
      'Calculate the number of steps, actual riser height, and total horizontal run for a staircase from floor-to-floor height.',
    icon: '🪜',
    category: 'construction',
    subcategory: 'roofing',
    tags: ['stairs', 'steps', 'riser', 'tread', 'staircase', 'construction', 'building code'],
    inputs: [
      {
        id: 'totalRise',
        label: 'Total Rise',
        type: 'number',
        defaultValue: 108,
        min: 24,
        placeholder: 'e.g. 108',
        helpText: 'Total floor-to-floor height in inches (e.g. 9 ft = 108 in)',
        required: true,
      },
      {
        id: 'desiredRiserHeight',
        label: 'Desired Riser Height',
        type: 'number',
        defaultValue: 7.5,
        min: 4,
        max: 7.75,
        step: 0.25,
        placeholder: 'e.g. 7.5',
        helpText: 'Target riser height in inches (IRC: 4–7¾ in)',
        required: true,
      },
      {
        id: 'goingDepth',
        label: 'Tread Depth (Going)',
        type: 'number',
        defaultValue: 10,
        min: 9,
        max: 14,
        step: 0.5,
        placeholder: 'e.g. 10',
        helpText: 'Horizontal tread depth in inches (IRC minimum: 10 in)',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'numSteps',
        expression: 'round(totalRise / desiredRiserHeight)',
        dependencies: ['totalRise', 'desiredRiserHeight'],
      },
      {
        id: 'actualRiser',
        expression: 'totalRise / numSteps',
        dependencies: ['totalRise', 'numSteps'],
      },
      {
        id: 'totalRunInches',
        expression: 'numSteps * goingDepth',
        dependencies: ['numSteps', 'goingDepth'],
      },
      {
        id: 'totalRunFeet',
        expression: 'totalRunInches / 12',
        dependencies: ['totalRunInches'],
      },
      {
        id: 'stringerLength',
        expression: 'sqrt(pow(totalRise, 2) + pow(totalRunInches, 2)) / 12',
        dependencies: ['totalRise', 'totalRunInches'],
      },
    ],
    outputs: [
      {
        id: 'numStepsOut',
        label: 'Number of Steps',
        formulaRef: 'numSteps',
        format: 'number',
        precision: 0,
        suffix: ' steps',
        highlight: true,
      },
      {
        id: 'actualRiserOut',
        label: 'Actual Riser Height',
        formulaRef: 'actualRiser',
        format: 'number',
        precision: 3,
        suffix: ' in',
      },
      {
        id: 'totalRunFeetOut',
        label: 'Total Horizontal Run',
        formulaRef: 'totalRunFeet',
        format: 'number',
        precision: 2,
        suffix: ' ft',
      },
      {
        id: 'stringerLengthOut',
        label: 'Stringer Length',
        formulaRef: 'stringerLength',
        format: 'number',
        precision: 2,
        suffix: ' ft',
      },
    ],
    guide: {
      whatIsIt:
        'The Stair Calculator determines the optimal number of risers for a staircase, the precise actual riser height, the total horizontal footprint, and the stringer board length. Consistent riser heights are critical for safety — varying even ¼ inch can cause trips and falls.',
      howToUse:
        '1. Measure and enter the total rise (floor to finished floor) in inches.\n2. Enter your desired riser height (7 to 7½ inches is comfortable for most people).\n3. Enter the tread depth / going (minimum 10 inches per IRC).\n4. The calculator shows the optimal step count and the actual riser height that evenly divides the total rise.',
      exampleScenario:
        'A floor-to-floor height of 108 inches (9 ft) with a 7.5 in desired riser: numSteps = round(108/7.5) = 14 steps. Actual riser = 108/14 ≈ 7.71 in. Total run = 14 × 10 = 140 in = 11.67 ft.',
      proTip:
        'The "7-11 rule" is a handy comfort check: riser + tread should equal 17–18 inches (e.g. 7½ + 10 = 17½ ✓). Headroom must be at least 6 ft 8 in (IRC) measured vertically from any tread nosing to the ceiling or landing above.',
    },
    metadata: { version: '1.0.0' },
  },

  // ─── 7. Board Foot Calculator ─────────────────────────────────────────────────
  {
    id: 'board-foot-calculator',
    slug: 'board-foot-calculator',
    title: 'Board Foot Calculator',
    description:
      'Calculate lumber volume in board feet, cubic feet, and total lineal feet from thickness, width, length, and quantity.',
    icon: '🪵',
    category: 'construction',
    subcategory: 'lumber',
    tags: ['board feet', 'lumber', 'timber', 'wood', 'volume', 'sawmill', 'carpentry'],
    inputs: [
      {
        id: 'thickness',
        label: 'Thickness',
        type: 'number',
        defaultValue: 1,
        min: 0.25,
        step: 0.25,
        placeholder: 'e.g. 1',
        helpText: 'Board thickness in inches',
        required: true,
      },
      {
        id: 'width',
        label: 'Width',
        type: 'number',
        defaultValue: 6,
        min: 1,
        step: 0.5,
        placeholder: 'e.g. 6',
        helpText: 'Board width in inches',
        required: true,
      },
      {
        id: 'lengthFt',
        label: 'Length',
        type: 'number',
        defaultValue: 8,
        min: 1,
        step: 0.5,
        placeholder: 'e.g. 8',
        helpText: 'Board length in feet',
        required: true,
      },
      {
        id: 'quantity',
        label: 'Quantity',
        type: 'number',
        defaultValue: 1,
        min: 1,
        step: 1,
        placeholder: 'e.g. 1',
        helpText: 'Number of identical boards',
        required: true,
      },
    ],
    formulas: [
      {
        // Board feet = (thickness in × width in × length ft) / 12 × quantity
        id: 'boardFeet',
        expression: 'thickness * width * lengthFt / 12 * quantity',
        dependencies: ['thickness', 'width', 'lengthFt', 'quantity'],
      },
      {
        id: 'cubicFeet',
        expression: 'boardFeet / 12',
        dependencies: ['boardFeet'],
      },
      {
        id: 'linealFeet',
        expression: 'lengthFt * quantity',
        dependencies: ['lengthFt', 'quantity'],
      },
    ],
    outputs: [
      {
        id: 'boardFeetOut',
        label: 'Board Feet',
        formulaRef: 'boardFeet',
        format: 'number',
        precision: 2,
        suffix: ' BF',
        highlight: true,
      },
      {
        id: 'cubicFeetOut',
        label: 'Cubic Feet',
        formulaRef: 'cubicFeet',
        format: 'number',
        precision: 4,
        suffix: ' ft³',
      },
      {
        id: 'linealFeetOut',
        label: 'Lineal Feet',
        formulaRef: 'linealFeet',
        format: 'number',
        precision: 1,
        suffix: ' LF',
      },
    ],
    guide: {
      whatIsIt:
        'A board foot (BF) is the standard unit of volume for lumber. One board foot equals a piece that is 1 inch thick × 12 inches wide × 12 inches long (144 cubic inches). Lumber is priced per board foot at sawmills and hardwood dealers, while softwood at home centers is often sold by lineal foot.',
      howToUse:
        '1. Enter the thickness, width (both in inches), and length (in feet).\n2. Enter the quantity of identical boards.\n3. Board feet is the primary output for ordering hardwood lumber.',
      exampleScenario:
        'You need 10 pieces of 1 × 6 × 8 ft oak: BF = 1 × 6 × 8 / 12 × 10 = 40 board feet. At $5/BF you would pay $200.',
      proTip:
        'Rough-sawn lumber is sold by the stated nominal dimensions, but dressed (S4S) lumber is smaller — a nominal 2×4 is actually 1½ × 3½ inches. For pricing, always calculate board feet from the rough/nominal size, not the actual size.',
    },
    metadata: { version: '1.0.0' },
  },

  // ─── 8. Mulch / Soil Calculator ───────────────────────────────────────────────
  {
    id: 'mulch-calculator',
    slug: 'mulch-calculator',
    title: 'Mulch & Soil Calculator',
    description:
      'Calculate cubic yards and 40 lb bags of mulch or soil needed for a landscaping area at a specified depth.',
    icon: '🌱',
    category: 'construction',
    subcategory: 'lumber',
    tags: ['mulch', 'soil', 'cubic yards', 'landscaping', 'garden', 'top soil', 'diy'],
    inputs: [
      {
        id: 'areaLength',
        label: 'Area Length',
        type: 'number',
        defaultValue: 20,
        min: 0.1,
        placeholder: 'e.g. 20',
        helpText: 'Length of the area in feet',
        required: true,
      },
      {
        id: 'areaWidth',
        label: 'Area Width',
        type: 'number',
        defaultValue: 10,
        min: 0.1,
        placeholder: 'e.g. 10',
        helpText: 'Width of the area in feet',
        required: true,
      },
      {
        id: 'depth',
        label: 'Desired Depth',
        type: 'number',
        defaultValue: 3,
        min: 0.5,
        max: 12,
        step: 0.5,
        placeholder: 'e.g. 3',
        helpText: 'Depth of mulch or soil in inches',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'cubicFeet',
        expression: 'areaLength * areaWidth * (depth / 12)',
        dependencies: ['areaLength', 'areaWidth', 'depth'],
      },
      {
        id: 'cubicYards',
        expression: 'cubicFeet / 27',
        dependencies: ['cubicFeet'],
      },
      {
        // 1 bag (40 lb) ≈ 0.75 cu ft of mulch
        id: 'bags40lb',
        expression: 'ceil(cubicFeet / 0.75)',
        dependencies: ['cubicFeet'],
      },
    ],
    outputs: [
      {
        id: 'cubicYardsOut',
        label: 'Cubic Yards',
        formulaRef: 'cubicYards',
        format: 'number',
        precision: 2,
        suffix: ' yd³',
        highlight: true,
      },
      {
        id: 'cubicFeetOut',
        label: 'Cubic Feet',
        formulaRef: 'cubicFeet',
        format: 'number',
        precision: 2,
        suffix: ' ft³',
      },
      {
        id: 'bags40lbOut',
        label: '40 lb Bags Needed',
        formulaRef: 'bags40lb',
        format: 'number',
        precision: 0,
        suffix: ' bags',
      },
    ],
    guide: {
      whatIsIt:
        'The Mulch & Soil Calculator converts a rectangular area and depth into cubic yards (for bulk delivery) and 40 lb bag counts (for store pickup). It applies to wood chip mulch, bark mulch, garden soil, compost, and gravel.',
      howToUse:
        '1. Enter the length and width of the area in feet.\n2. Enter the desired depth in inches (2–3 inches is ideal for mulch; 4–6 inches for new garden beds).\n3. Order by the cubic yard if the quantity exceeds 2–3 yards — bulk is significantly cheaper.',
      exampleScenario:
        'A 20 × 10 ft flower bed needs 3 inches of mulch: cubic feet = 20 × 10 × (3/12) = 50 ft³. Cubic yards = 50/27 ≈ 1.85 yd³. Bags = ceil(50/0.75) = 67 bags (40 lb each).',
      proTip:
        "One bulk yard of mulch covers roughly 108 ft² at 3 inches deep. Bulk delivery typically starts at 1–2 yard minimums and becomes cost-effective around 3+ yards. Don't apply mulch thicker than 4 inches — deep mulch suffocates roots and creates a hiding place for pests.",
    },
    metadata: { version: '1.0.0' },
  },

  // ─── 9. Brick Calculator ──────────────────────────────────────────────────────
  {
    id: 'brick-calculator',
    slug: 'brick-calculator',
    title: 'Brick Calculator',
    description:
      'Estimate the number of bricks and mortar bags needed for a wall, with options for Standard and Modular brick sizes and a configurable waste percentage.',
    icon: '🧱',
    category: 'construction',
    subcategory: 'concrete',
    tags: ['brick', 'masonry', 'wall', 'mortar', 'blocks', 'construction', 'diy'],
    inputs: [
      {
        id: 'wallLength',
        label: 'Wall Length',
        type: 'number',
        defaultValue: 10,
        min: 0.1,
        placeholder: 'e.g. 10',
        helpText: 'Length of the wall in feet',
        required: true,
      },
      {
        id: 'wallHeight',
        label: 'Wall Height',
        type: 'number',
        defaultValue: 4,
        min: 0.1,
        placeholder: 'e.g. 4',
        helpText: 'Height of the wall in feet',
        required: true,
      },
      {
        id: 'brickType',
        label: 'Brick Type',
        type: 'select',
        defaultValue: '6.75',
        options: [
          { label: 'Standard (8×2¼×3¾ in) — 6.75 bricks/ft²', value: '6.75' },
          { label: 'Modular (7⅝×2¼×3⅝ in) — 6.17 bricks/ft²', value: '6.17' },
        ],
        helpText: 'Brick size determines bricks per square foot',
      },
      {
        id: 'wastePct',
        label: 'Waste Factor',
        type: 'range',
        defaultValue: 10,
        min: 5,
        max: 15,
        step: 1,
        helpText: 'Extra bricks for cuts and breakage (%)',
      },
    ],
    formulas: [
      {
        id: 'wallArea',
        expression: 'wallLength * wallHeight',
        dependencies: ['wallLength', 'wallHeight'],
      },
      {
        id: 'bricksNeeded',
        expression: 'ceil(wallArea * brickType * (1 + wastePct / 100))',
        dependencies: ['wallArea', 'brickType', 'wastePct'],
      },
      {
        // 1 mortar bag (60 lb) per ~37 bricks
        id: 'mortarBags',
        expression: 'ceil(bricksNeeded / 37)',
        dependencies: ['bricksNeeded'],
      },
    ],
    outputs: [
      {
        id: 'bricksNeededOut',
        label: 'Bricks Needed',
        formulaRef: 'bricksNeeded',
        format: 'number',
        precision: 0,
        suffix: ' bricks',
        highlight: true,
      },
      {
        id: 'wallAreaOut',
        label: 'Wall Area',
        formulaRef: 'wallArea',
        format: 'number',
        precision: 2,
        suffix: ' ft²',
      },
      {
        id: 'mortarBagsOut',
        label: 'Mortar Bags (60 lb)',
        formulaRef: 'mortarBags',
        format: 'number',
        precision: 0,
        suffix: ' bags',
      },
    ],
    guide: {
      whatIsIt:
        'The Brick Calculator estimates how many bricks and 60 lb mortar bags you need for a straight wall. Standard brick (8×2¼×3¾ in) lays at approximately 6.75 bricks per square foot with ⅜ in mortar joints; modular brick lays at approximately 6.17 bricks per square foot.',
      howToUse:
        '1. Enter the wall length and height in feet.\n2. Select the brick type.\n3. Set the waste factor (10% for experienced masons; 15% for first-time projects).\n4. The result includes bricks and 60 lb mortar bag quantities.',
      exampleScenario:
        'A 10 × 4 ft garden wall using standard bricks at 10% waste: area = 40 ft². Bricks = ceil(40 × 6.75 × 1.10) = ceil(297) = 297 bricks. Mortar = ceil(297/37) = 9 bags.',
      proTip:
        'Order 10% extra bricks for cuts and future repairs — brick dye lots vary and a match later may be impossible. Mortar should be mixed to a consistency that holds a thumbprint without slumping. In cold weather, keep mortar above 40°F for at least 24 hours after placement.',
    },
    metadata: { version: '1.0.0' },
  },

  // ─── 10. BTU Calculator ───────────────────────────────────────────────────────
  {
    id: 'btu-calculator',
    slug: 'btu-calculator',
    title: 'BTU Calculator',
    description:
      'Estimate heating or cooling BTU requirements for a room based on size, ceiling height, climate zone, and insulation quality.',
    icon: '❄️',
    category: 'construction',
    subcategory: 'hvac',
    tags: ['BTU', 'HVAC', 'heating', 'cooling', 'air conditioner', 'furnace', 'climate', 'tonnage'],
    inputs: [
      {
        id: 'roomLength',
        label: 'Room Length',
        type: 'number',
        defaultValue: 15,
        min: 1,
        placeholder: 'e.g. 15',
        helpText: 'Room length in feet',
        required: true,
      },
      {
        id: 'roomWidth',
        label: 'Room Width',
        type: 'number',
        defaultValue: 12,
        min: 1,
        placeholder: 'e.g. 12',
        helpText: 'Room width in feet',
        required: true,
      },
      {
        id: 'ceilingHeight',
        label: 'Ceiling Height',
        type: 'number',
        defaultValue: 8,
        min: 6,
        max: 20,
        placeholder: 'e.g. 8',
        helpText: 'Ceiling height in feet (8 ft is baseline)',
        required: true,
      },
      {
        id: 'climate',
        label: 'Climate Zone',
        type: 'select',
        defaultValue: '20',
        options: [
          { label: 'Cool / Northern (15 BTU/ft²)', value: '15' },
          { label: 'Moderate / Central (20 BTU/ft²)', value: '20' },
          { label: 'Hot / Southern (25 BTU/ft²)', value: '25' },
        ],
        helpText: 'Base BTU per sq ft for your climate',
      },
      {
        id: 'insulation',
        label: 'Insulation Quality',
        type: 'select',
        defaultValue: '1.0',
        options: [
          { label: 'Good (well-insulated, new construction)', value: '0.85' },
          { label: 'Average (standard insulation)', value: '1.0' },
          { label: 'Poor (older home, minimal insulation)', value: '1.2' },
        ],
        helpText: 'Multiplier based on how well the space is insulated',
      },
    ],
    formulas: [
      {
        id: 'sqft',
        expression: 'roomLength * roomWidth',
        dependencies: ['roomLength', 'roomWidth'],
      },
      {
        id: 'baseBTU',
        expression: 'sqft * (ceilingHeight / 8) * climate',
        dependencies: ['sqft', 'ceilingHeight', 'climate'],
      },
      {
        id: 'adjustedBTU',
        expression: 'baseBTU * insulation',
        dependencies: ['baseBTU', 'insulation'],
      },
      {
        id: 'tons',
        expression: 'adjustedBTU / 12000',
        dependencies: ['adjustedBTU'],
      },
      {
        // 1 BTU/hr = 0.000293 kW
        id: 'kilowatts',
        expression: 'adjustedBTU * 0.000293',
        dependencies: ['adjustedBTU'],
      },
    ],
    outputs: [
      {
        id: 'adjustedBTUOut',
        label: 'Required BTU/hr',
        formulaRef: 'adjustedBTU',
        format: 'number',
        precision: 0,
        suffix: ' BTU/hr',
        highlight: true,
      },
      {
        id: 'sqftOut',
        label: 'Room Area',
        formulaRef: 'sqft',
        format: 'number',
        precision: 0,
        suffix: ' ft²',
      },
      {
        id: 'tonsOut',
        label: 'Cooling Capacity',
        formulaRef: 'tons',
        format: 'number',
        precision: 2,
        suffix: ' tons',
      },
      {
        id: 'kilowattsOut',
        label: 'Equivalent Power',
        formulaRef: 'kilowatts',
        format: 'number',
        precision: 2,
        suffix: ' kW',
      },
    ],
    guide: {
      whatIsIt:
        'The BTU Calculator estimates the heating or cooling capacity — measured in British Thermal Units per hour — needed to maintain a comfortable temperature in a room. It accounts for room size, ceiling height, local climate, and insulation quality.',
      howToUse:
        '1. Enter room dimensions and ceiling height.\n2. Select your climate zone based on your geographic location.\n3. Choose the insulation quality that best matches your home.\n4. The output shows required BTU/hr, tonnage (for central AC sizing), and equivalent kilowatts.',
      exampleScenario:
        'A 15 × 12 ft bedroom (180 ft²) with 8 ft ceilings in a moderate climate with average insulation: baseBTU = 180 × 1.0 × 20 = 3,600 BTU/hr. Adjusted = 3,600 × 1.0 = 3,600 BTU/hr ≈ 0.3 tons. A standard 5,000 BTU window unit would be appropriate.',
      proTip:
        'HVAC professionals use Manual J load calculations for precise sizing. Oversized AC units cool too quickly without adequate dehumidification, leaving rooms clammy. Undersized units run continuously and wear out faster. Add 600 BTU for sunny rooms and 600 BTU per additional frequent occupant beyond two people.',
    },
    metadata: { version: '1.0.0' },
  },

  // ─── 11. Watts / Amps / Volts Calculator ──────────────────────────────────────
  {
    id: 'watts-amps-volts',
    slug: 'watts-amps-volts',
    title: 'Watts, Amps & Volts Calculator',
    description:
      "Convert between electrical power (watts), current (amps), and voltage (volts) using Ohm's Law — P = I × V.",
    icon: '⚡',
    category: 'construction',
    subcategory: 'hvac',
    tags: ['watts', 'amps', 'volts', 'electrical', 'power', 'ohm', 'circuit', 'diy'],
    inputs: [
      {
        id: 'solveFor',
        label: 'Solve For',
        type: 'select',
        defaultValue: '0',
        options: [
          { label: 'Watts (P = I × V)', value: '0' },
          { label: 'Amps (I = P ÷ V)', value: '1' },
          { label: 'Volts (V = P ÷ I)', value: '2' },
        ],
        helpText: 'Select which value you want to calculate',
      },
      {
        id: 'watts',
        label: 'Watts (Power)',
        type: 'number',
        defaultValue: 1000,
        min: 0,
        placeholder: 'e.g. 1000',
        helpText: 'Electrical power in watts',
      },
      {
        id: 'amps',
        label: 'Amps (Current)',
        type: 'number',
        defaultValue: 10,
        min: 0,
        step: 0.1,
        placeholder: 'e.g. 10',
        helpText: 'Electrical current in amperes',
      },
      {
        id: 'volts',
        label: 'Volts (Voltage)',
        type: 'number',
        defaultValue: 120,
        min: 0,
        placeholder: 'e.g. 120',
        helpText: 'Voltage in volts (US: 120 V or 240 V)',
      },
    ],
    formulas: [
      {
        id: 'wattsCalc',
        expression: 'amps * volts',
        dependencies: ['amps', 'volts'],
      },
      {
        id: 'ampsCalc',
        expression: 'watts / volts',
        dependencies: ['watts', 'volts'],
      },
      {
        id: 'voltsCalc',
        expression: 'watts / amps',
        dependencies: ['watts', 'amps'],
      },
      {
        id: 'result',
        expression: 'solveFor == 0 ? wattsCalc : (solveFor == 1 ? ampsCalc : voltsCalc)',
        dependencies: ['solveFor', 'wattsCalc', 'ampsCalc', 'voltsCalc'],
      },
      {
        id: 'displayWatts',
        expression: 'solveFor == 0 ? wattsCalc : watts',
        dependencies: ['solveFor', 'wattsCalc', 'watts'],
      },
      {
        id: 'displayAmps',
        expression: 'solveFor == 1 ? ampsCalc : amps',
        dependencies: ['solveFor', 'ampsCalc', 'amps'],
      },
      {
        id: 'displayVolts',
        expression: 'solveFor == 2 ? voltsCalc : volts',
        dependencies: ['solveFor', 'voltsCalc', 'volts'],
      },
    ],
    outputs: [
      {
        id: 'resultOut',
        label: 'Calculated Value',
        formulaRef: 'result',
        format: 'number',
        precision: 3,
        highlight: true,
      },
      {
        id: 'displayWattsOut',
        label: 'Power',
        formulaRef: 'displayWatts',
        format: 'number',
        precision: 2,
        suffix: ' W',
      },
      {
        id: 'displayAmpsOut',
        label: 'Current',
        formulaRef: 'displayAmps',
        format: 'number',
        precision: 3,
        suffix: ' A',
      },
      {
        id: 'displayVoltsOut',
        label: 'Voltage',
        formulaRef: 'displayVolts',
        format: 'number',
        precision: 2,
        suffix: ' V',
      },
    ],
    guide: {
      whatIsIt:
        "The Watts, Amps & Volts Calculator applies Ohm's Law for electrical power (P = I × V) to convert between electrical power in watts, current in amperes, and voltage in volts. This is essential for sizing circuits, choosing breakers, and understanding appliance power draw.",
      howToUse:
        '1. Select what you want to solve for (Watts, Amps, or Volts).\n2. Enter the other two known values.\n3. The "Calculated Value" shows the result; the three reference outputs show your complete electrical picture.',
      exampleScenario:
        'A 1,500 W space heater on a 120 V circuit: solving for Amps → 1500 ÷ 120 = 12.5 A. A 15 A circuit breaker (rated to 80% = 12 A continuous) would be overloaded — a 20 A circuit is required.',
      proTip:
        'NEC code requires circuits be loaded to no more than 80% of their rated capacity for continuous loads (3+ hours). A 15 A breaker should carry no more than 12 A continuously; a 20 A breaker, no more than 16 A. Always consult a licensed electrician for panel work and new circuit installation.',
    },
    metadata: { version: '1.0.0' },
  },

  // ─── 12. Wallpaper Calculator ─────────────────────────────────────────────────
  {
    id: 'wallpaper-calculator',
    slug: 'wallpaper-calculator',
    title: 'Wallpaper Calculator',
    description:
      'Calculate the number of wallpaper rolls needed for a room, accounting for roll dimensions, door and window deductions, and a 10% installation waste allowance.',
    icon: '🖼️',
    category: 'construction',
    subcategory: 'interior',
    tags: ['wallpaper', 'rolls', 'interior', 'remodel', 'room', 'wall covering', 'diy'],
    inputs: [
      {
        id: 'roomLength',
        label: 'Room Length',
        type: 'number',
        defaultValue: 12,
        min: 1,
        placeholder: 'e.g. 12',
        helpText: 'Room length in feet',
        required: true,
      },
      {
        id: 'roomWidth',
        label: 'Room Width',
        type: 'number',
        defaultValue: 10,
        min: 1,
        placeholder: 'e.g. 10',
        helpText: 'Room width in feet',
        required: true,
      },
      {
        id: 'wallHeight',
        label: 'Wall Height',
        type: 'number',
        defaultValue: 9,
        min: 6,
        max: 20,
        placeholder: 'e.g. 9',
        helpText: 'Ceiling height / wall height in feet',
        required: true,
      },
      {
        id: 'rollWidth',
        label: 'Roll Width',
        type: 'number',
        defaultValue: 21,
        min: 12,
        max: 54,
        step: 0.5,
        placeholder: 'e.g. 21',
        helpText: 'Width of a single wallpaper roll in inches',
        required: true,
      },
      {
        id: 'rollLength',
        label: 'Roll Length',
        type: 'number',
        defaultValue: 33,
        min: 10,
        max: 60,
        placeholder: 'e.g. 33',
        helpText: 'Length of a single wallpaper roll in feet',
        required: true,
      },
      {
        id: 'numDoors',
        label: 'Number of Doors',
        type: 'number',
        defaultValue: 1,
        min: 0,
        max: 20,
        helpText: 'Standard door ≈ 21 sq ft deducted',
      },
      {
        id: 'numWindows',
        label: 'Number of Windows',
        type: 'number',
        defaultValue: 2,
        min: 0,
        max: 30,
        helpText: 'Standard window ≈ 15 sq ft deducted',
      },
    ],
    formulas: [
      {
        id: 'wallArea',
        expression: '2 * (roomLength + roomWidth) * wallHeight - numDoors * 21 - numWindows * 15',
        dependencies: ['roomLength', 'roomWidth', 'wallHeight', 'numDoors', 'numWindows'],
      },
      {
        // sq ft coverage per roll = (roll width in ft) × roll length in ft
        id: 'sqftPerRoll',
        expression: 'rollLength * (rollWidth / 12)',
        dependencies: ['rollLength', 'rollWidth'],
      },
      {
        id: 'rollsNeeded',
        expression: 'ceil(wallArea / sqftPerRoll * 1.1)',
        dependencies: ['wallArea', 'sqftPerRoll'],
      },
    ],
    outputs: [
      {
        id: 'rollsNeededOut',
        label: 'Rolls Needed',
        formulaRef: 'rollsNeeded',
        format: 'number',
        precision: 0,
        suffix: ' rolls',
        highlight: true,
      },
      {
        id: 'wallAreaOut',
        label: 'Net Wall Area',
        formulaRef: 'wallArea',
        format: 'number',
        precision: 1,
        suffix: ' ft²',
      },
      {
        id: 'sqftPerRollOut',
        label: 'Coverage Per Roll',
        formulaRef: 'sqftPerRoll',
        format: 'number',
        precision: 2,
        suffix: ' ft²',
      },
    ],
    guide: {
      whatIsIt:
        "The Wallpaper Calculator determines how many rolls of wallpaper you need to cover the walls of a room, subtracting door and window openings and adding a 10% overage for seams, pattern matching, and trimming. Enter your roll's actual width and length for accurate results.",
      howToUse:
        '1. Enter room dimensions and wall height.\n2. Check the roll packaging for roll width (in inches) and length (in feet).\n3. Enter the number of doors and windows.\n4. A 10% waste factor is automatically applied.',
      exampleScenario:
        'A 12 × 10 ft room, 9 ft ceilings, 1 door, 2 windows, using rolls that are 21 in wide × 33 ft long: net wall area = 2×22×9 − 21 − 30 = 396 − 51 = 345 ft². Coverage per roll = 33 × (21/12) = 57.75 ft². Rolls = ceil(345/57.75 × 1.1) = ceil(6.57) = 7 rolls.',
      proTip:
        "Always order one extra roll from the same dye lot — different lots can have subtle color variations that become obvious on the wall. If your wallpaper has a pattern repeat, waste increases significantly (add 15–20% for patterns repeating every 18+ inches) — account for this by reducing the effective roll length in your order.",
    },
    metadata: { version: '1.0.0' },
  },
];
