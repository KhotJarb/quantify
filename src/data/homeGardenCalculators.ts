// ---------------------------------------------------------------------------
// Quantify � Home & Garden Calculators
// ---------------------------------------------------------------------------
// 10 calculators covering fencing, decking, flooring, sod, gravel, solar,
// gutters, retaining walls, firewood, and swimming pools.
// ---------------------------------------------------------------------------

import type { CalculatorSchema } from '@/types/calculator';

export const homeGardenCalculators: CalculatorSchema[] = [
  // =========================================================================
  // 1. Fence Material Calculator
  // =========================================================================
  {
    id: 'fence-material-calculator',
    slug: 'fence-material-calculator',
    title: 'Fence Material Calculator',
    description:
      'Estimate the number of posts, rails, and pickets needed for a wood fence based on total length, post spacing, and section configuration � including a waste allowance.',
    icon: '🏡',
    category: 'construction',
    subcategory: 'landscaping',
    tags: ['fence', 'posts', 'rails', 'pickets', 'wood', 'landscaping', 'material estimate'],
    inputs: [
      {
        id: 'totalLength',
        label: 'Fence Length (m)',
        type: 'number',
        defaultValue: 30,
        min: 1,
        step: 0.5,
        placeholder: 'e.g. 30',
        required: true,
      },
      {
        id: 'postSpacing',
        label: 'Post Spacing (m)',
        type: 'number',
        defaultValue: 2.4,
        min: 0.5,
        max: 6,
        step: 0.1,
        placeholder: 'e.g. 2.4',
        required: true,
      },
      {
        id: 'railsPerSection',
        label: 'Rails per Section',
        type: 'number',
        defaultValue: 2,
        min: 1,
        max: 5,
        step: 1,
        placeholder: 'e.g. 2',
        required: true,
      },
      {
        id: 'picketsPerSection',
        label: 'Pickets per Section',
        type: 'number',
        defaultValue: 8,
        min: 1,
        step: 1,
        placeholder: 'e.g. 8',
        required: true,
      },
      {
        id: 'wasteFactor',
        label: 'Waste Factor %',
        type: 'number',
        defaultValue: 10,
        min: 0,
        max: 50,
        step: 1,
        placeholder: 'e.g. 10',
        helpText: 'Extra percentage added to account for cuts, defects, and offcuts.',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'sections',
        expression: 'ceil(totalLength / postSpacing)',
        dependencies: ['totalLength', 'postSpacing'],
      },
      {
        id: 'posts',
        expression: 'ceil(totalLength / postSpacing) + 1',
        dependencies: ['totalLength', 'postSpacing'],
      },
      {
        id: 'rails',
        expression: 'sections * railsPerSection',
        dependencies: ['sections', 'railsPerSection'],
      },
      {
        id: 'pickets',
        expression: 'sections * picketsPerSection',
        dependencies: ['sections', 'picketsPerSection'],
      },
      {
        id: 'totalPickets',
        expression: 'ceil(pickets * (1 + wasteFactor / 100))',
        dependencies: ['pickets', 'wasteFactor'],
      },
    ],
    outputs: [
      {
        id: 'out-posts',
        label: 'Posts Needed',
        formulaRef: 'posts',
        format: 'number',
        precision: 0,
      },
      {
        id: 'out-rails',
        label: 'Rails Needed',
        formulaRef: 'rails',
        format: 'number',
        precision: 0,
      },
      {
        id: 'out-totalPickets',
        label: 'Pickets Needed (incl. waste)',
        formulaRef: 'totalPickets',
        format: 'number',
        precision: 0,
        highlight: true,
      },
    ],
    guide: {
      whatIsIt:
        'A fence material calculator estimates how many structural components � posts, horizontal rails, and vertical pickets � you need to build a wood fence. It divides total fence length into sections determined by post spacing, then counts the components per section and applies a waste factor for cuts and defects.',
      howToUse:
        'Enter the total perimeter length (or run length) in meters, your desired post spacing, the number of horizontal rails per bay, and the number of pickets per bay. Add a waste percentage (10% is typical) to cover splits, bad cuts, and defective boards. The calculator returns the exact quantities to purchase.',
      exampleScenario:
        'A 30 m backyard fence with posts every 2.4 m creates 13 sections and 14 posts. With 2 rails per section (26 rails total) and 8 pickets per section (104 pickets), a 10% waste allowance rounds up to 115 pickets to buy � preventing an extra trip to the hardware store.',
      proTip:
        'When ordering pickets, always round up to the nearest bundle size sold at your supplier. Ask for 12�15% waste if the fence has many corners or angles, as miter cuts waste significantly more material than straight cuts.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 2. Decking Material Calculator
  // =========================================================================
  {
    id: 'decking-material-calculator',
    slug: 'decking-material-calculator',
    title: 'Decking Material Calculator',
    description:
      'Calculate the number of deck boards required for a timber or composite deck, accounting for board dimensions, the gap between boards, and a waste allowance.',
    icon: '🌳',
    category: 'construction',
    subcategory: 'landscaping',
    tags: ['deck', 'decking', 'boards', 'timber', 'composite', 'outdoor', 'material estimate'],
    inputs: [
      {
        id: 'deckLength',
        label: 'Deck Length (m)',
        type: 'number',
        defaultValue: 6,
        min: 0.5,
        step: 0.1,
        placeholder: 'e.g. 6',
        required: true,
      },
      {
        id: 'deckWidth',
        label: 'Deck Width (m)',
        type: 'number',
        defaultValue: 4,
        min: 0.5,
        step: 0.1,
        placeholder: 'e.g. 4',
        required: true,
      },
      {
        id: 'boardWidth',
        label: 'Board Width (m)',
        type: 'number',
        defaultValue: 0.14,
        min: 0.05,
        max: 0.4,
        step: 0.01,
        placeholder: 'e.g. 0.14',
        helpText: 'Face width of one deck board in metres (e.g. 140 mm board = 0.14 m).',
        required: true,
      },
      {
        id: 'boardLength',
        label: 'Board Length (m)',
        type: 'number',
        defaultValue: 4.8,
        min: 1,
        step: 0.1,
        placeholder: 'e.g. 4.8',
        required: true,
      },
      {
        id: 'gapMm',
        label: 'Gap Between Boards (mm)',
        type: 'number',
        defaultValue: 5,
        min: 0,
        max: 20,
        step: 0.5,
        placeholder: 'e.g. 5',
        helpText: 'Typical gap is 5�6 mm for drainage and expansion.',
        required: true,
      },
      {
        id: 'waste',
        label: 'Waste %',
        type: 'number',
        defaultValue: 10,
        min: 0,
        max: 50,
        step: 1,
        placeholder: 'e.g. 10',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'area',
        expression: 'deckLength * deckWidth',
        dependencies: ['deckLength', 'deckWidth'],
      },
      {
        id: 'effectiveBoardWidth',
        expression: 'boardWidth + gapMm / 1000',
        dependencies: ['boardWidth', 'gapMm'],
      },
      {
        id: 'boardsWide',
        expression: 'ceil(deckWidth / effectiveBoardWidth)',
        dependencies: ['deckWidth', 'effectiveBoardWidth'],
      },
      {
        id: 'boardsLong',
        expression: 'ceil(deckLength / boardLength)',
        dependencies: ['deckLength', 'boardLength'],
      },
      {
        id: 'totalBoards',
        expression: 'ceil(boardsWide * boardsLong * (1 + waste / 100))',
        dependencies: ['boardsWide', 'boardsLong', 'waste'],
      },
    ],
    outputs: [
      {
        id: 'out-area',
        label: 'Deck Area',
        formulaRef: 'area',
        format: 'number',
        precision: 1,
        suffix: ' m�',
      },
      {
        id: 'out-totalBoards',
        label: 'Boards Required',
        formulaRef: 'totalBoards',
        format: 'number',
        precision: 0,
        highlight: true,
      },
    ],
    guide: {
      whatIsIt:
        'A decking material calculator works out how many individual boards you need to cover a given deck area. It factors in the gap between boards (important for drainage and wood expansion) and a waste percentage to cover end cuts, defective timber, and diagonal layouts.',
      howToUse:
        'Enter your deck dimensions and the nominal width of each board. Add the intended gap (5 mm is standard) and your board length. The calculator divides the deck width by the effective board pitch (board width + gap) to find rows, then divides deck length by board length to find runs, multiplying for total board count.',
      exampleScenario:
        'A 6 m x 4 m deck (24 m2) using 140 mm boards with a 5 mm gap needs 27.4 boards across the width. With 4.8 m boards, 2 lengths cover the 6 m run. That is 28 x 2 = 56 base boards, plus 10% waste = 62 boards to order.',
      proTip:
        'For diagonal decking layouts, increase waste to 15�20% � cutting boards at 45 degrees produces significantly more off-cuts. Composite decking is typically sold by linear metre, so multiply board count by board length to get the linear metres to order.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 3. Laminate & Vinyl Flooring Calculator
  // =========================================================================
  {
    id: 'flooring-calculator',
    slug: 'flooring-calculator',
    title: 'Laminate & Vinyl Flooring Calculator',
    description:
      'Calculate the floor area and number of flooring boxes needed for a room, including a configurable waste allowance for cuts and border offcuts.',
    icon: '📏',
    category: 'construction',
    subcategory: 'interior',
    tags: ['flooring', 'laminate', 'vinyl', 'LVP', 'boxes', 'room', 'interior', 'material estimate'],
    inputs: [
      {
        id: 'roomLength',
        label: 'Room Length (m)',
        type: 'number',
        defaultValue: 5,
        min: 0.5,
        step: 0.1,
        placeholder: 'e.g. 5',
        required: true,
      },
      {
        id: 'roomWidth',
        label: 'Room Width (m)',
        type: 'number',
        defaultValue: 4,
        min: 0.5,
        step: 0.1,
        placeholder: 'e.g. 4',
        required: true,
      },
      {
        id: 'coveragePerBox',
        label: 'Coverage per Box (m�)',
        type: 'number',
        defaultValue: 2.1,
        min: 0.5,
        step: 0.01,
        placeholder: 'e.g. 2.1',
        helpText: 'Check the box or product listing for the coverage area per box.',
        required: true,
      },
      {
        id: 'waste',
        label: 'Waste & Cuts %',
        type: 'number',
        defaultValue: 10,
        min: 0,
        max: 50,
        step: 1,
        placeholder: 'e.g. 10',
        helpText: 'Use 10% for square rooms, 15% for diagonal or complex layouts.',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'area',
        expression: 'roomLength * roomWidth',
        dependencies: ['roomLength', 'roomWidth'],
      },
      {
        id: 'areaWithWaste',
        expression: 'area * (1 + waste / 100)',
        dependencies: ['area', 'waste'],
      },
      {
        id: 'boxesNeeded',
        expression: 'ceil(areaWithWaste / coveragePerBox)',
        dependencies: ['areaWithWaste', 'coveragePerBox'],
      },
    ],
    outputs: [
      {
        id: 'out-area',
        label: 'Floor Area',
        formulaRef: 'area',
        format: 'number',
        precision: 1,
        suffix: ' m�',
      },
      {
        id: 'out-areaWithWaste',
        label: 'Area with Waste',
        formulaRef: 'areaWithWaste',
        format: 'number',
        precision: 1,
        suffix: ' m�',
      },
      {
        id: 'out-boxesNeeded',
        label: 'Boxes Needed',
        formulaRef: 'boxesNeeded',
        format: 'number',
        precision: 0,
        highlight: true,
      },
    ],
    guide: {
      whatIsIt:
        'A flooring calculator determines how many boxes of laminate, vinyl plank (LVP), or engineered flooring you need. It multiplies the room area by a waste factor to account for end cuts, border pieces, and unusable offcuts, then divides by the coverage area stated on each box.',
      howToUse:
        'Measure your room length and width, find the coverage per box on the flooring product label, and choose a waste percentage. Standard rooms with straight layouts use 10%; rooms with angles, alcoves, or diagonal installation should use 15%. Always buy an extra box beyond the estimate for future repairs.',
      exampleScenario:
        'A 5 x 4 m room (20 m2) with 10% waste requires 22 m2 of flooring. Boxes covering 2.1 m2 each means you need ceil(22 / 2.1) = 11 boxes. If they cost $45 each, budget $495 for flooring material alone.',
      proTip:
        'Keep one sealed box in storage after installation � flooring dye lots change between production runs, and a replacement board from a different lot can look visibly different. Buy one extra box up-front rather than hunting for a match years later.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 4. Sod / Turf Calculator
  // =========================================================================
  {
    id: 'sod-turf-calculator',
    slug: 'sod-turf-calculator',
    title: 'Sod / Turf Calculator',
    description:
      'Calculate the number of sod rolls needed to turf a lawn area, including a waste factor for irregular shapes and offcuts.',
    icon: '🌿',
    category: 'construction',
    subcategory: 'landscaping',
    tags: ['sod', 'turf', 'lawn', 'grass', 'rolls', 'landscaping', 'garden'],
    inputs: [
      {
        id: 'areaLength',
        label: 'Area Length (m)',
        type: 'number',
        defaultValue: 10,
        min: 0.5,
        step: 0.5,
        placeholder: 'e.g. 10',
        required: true,
      },
      {
        id: 'areaWidth',
        label: 'Area Width (m)',
        type: 'number',
        defaultValue: 8,
        min: 0.5,
        step: 0.5,
        placeholder: 'e.g. 8',
        required: true,
      },
      {
        id: 'rollSize',
        label: 'Roll Coverage (m�)',
        type: 'number',
        defaultValue: 0.84,
        min: 0.1,
        step: 0.01,
        placeholder: 'e.g. 0.84',
        helpText: 'Standard roll = 0.84 m� (0.6 m x 1.4 m). Confirm with your supplier.',
        required: true,
      },
      {
        id: 'waste',
        label: 'Waste %',
        type: 'number',
        defaultValue: 5,
        min: 0,
        max: 30,
        step: 1,
        placeholder: 'e.g. 5',
        helpText: 'Add 5�10% for shaped areas, curves, or trimming.',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'totalArea',
        expression: 'areaLength * areaWidth',
        dependencies: ['areaLength', 'areaWidth'],
      },
      {
        id: 'areaWaste',
        expression: 'totalArea * (1 + waste / 100)',
        dependencies: ['totalArea', 'waste'],
      },
      {
        id: 'rollsNeeded',
        expression: 'ceil(areaWaste / rollSize)',
        dependencies: ['areaWaste', 'rollSize'],
      },
    ],
    outputs: [
      {
        id: 'out-totalArea',
        label: 'Total Area',
        formulaRef: 'totalArea',
        format: 'number',
        precision: 1,
        suffix: ' m�',
      },
      {
        id: 'out-rollsNeeded',
        label: 'Rolls of Sod Needed',
        formulaRef: 'rollsNeeded',
        format: 'number',
        precision: 0,
        highlight: true,
      },
    ],
    guide: {
      whatIsIt:
        'A sod calculator estimates how many rolls of turf you need to cover a lawn area. Sod rolls have a standard coverage (typically 0.84 m� per roll, being 0.6 m wide x 1.4 m long) and are laid tightly together. A waste percentage is added for trimming edges, curves, and irregularly shaped lawns.',
      howToUse:
        'Measure the length and width of the area to be turfed in metres. Confirm your supplier\'s roll size (check the product spec sheet). Add a 5% waste buffer for simple rectangular lawns, or 10% for curved, irregular, or complex-shaped areas. The result is the number of rolls to order.',
      exampleScenario:
        'A 10 x 8 m backyard lawn (80 m2) with 5% waste requires 84 m2 of sod. Using standard 0.84 m2 rolls, you need ceil(84 / 0.84) = 100 rolls. Most suppliers sell sod by the pallet (typically 56�70 rolls), so plan for 2 pallets delivered.',
      proTip:
        'Lay sod within 24�48 hours of delivery � rolls begin to heat up and yellow quickly, especially in summer. Water thoroughly immediately after laying and keep moist for the first 2 weeks. Avoid laying sod during extreme heat or frost.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 5. Gravel & Crushed Stone Calculator
  // =========================================================================
  {
    id: 'gravel-crushed-stone-calculator',
    slug: 'gravel-crushed-stone-calculator',
    title: 'Gravel & Crushed Stone Calculator',
    description:
      'Calculate the volume in cubic metres and weight in tonnes of gravel, crushed stone, sand, or river rock needed to fill a defined area to a specific depth.',
    icon: '🧱',
    category: 'construction',
    subcategory: 'concrete',
    tags: ['gravel', 'crushed stone', 'sand', 'river rock', 'volume', 'tonnes', 'landscaping', 'driveway'],
    inputs: [
      {
        id: 'length',
        label: 'Length (m)',
        type: 'number',
        defaultValue: 10,
        min: 0.1,
        step: 0.1,
        placeholder: 'e.g. 10',
        required: true,
      },
      {
        id: 'width',
        label: 'Width (m)',
        type: 'number',
        defaultValue: 5,
        min: 0.1,
        step: 0.1,
        placeholder: 'e.g. 5',
        required: true,
      },
      {
        id: 'depthCm',
        label: 'Depth (cm)',
        type: 'number',
        defaultValue: 10,
        min: 1,
        max: 100,
        step: 0.5,
        placeholder: 'e.g. 10',
        required: true,
      },
      {
        id: 'density',
        label: 'Material Type',
        type: 'select',
        options: [
          { label: 'Pea Gravel (1.6 t/m�)', value: '1.6' },
          { label: 'Crushed Stone (1.8 t/m�)', value: '1.8' },
          { label: 'Sand (1.65 t/m�)', value: '1.65' },
          { label: 'River Rock (1.7 t/m�)', value: '1.7' },
        ],
        defaultValue: '1.8',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'volumeM3',
        expression: 'length * width * depthCm / 100',
        dependencies: ['length', 'width', 'depthCm'],
      },
      {
        id: 'tonnes',
        expression: 'volumeM3 * density',
        dependencies: ['volumeM3', 'density'],
      },
    ],
    outputs: [
      {
        id: 'out-volumeM3',
        label: 'Volume',
        formulaRef: 'volumeM3',
        format: 'number',
        precision: 2,
        suffix: ' m�',
      },
      {
        id: 'out-tonnes',
        label: 'Weight Needed',
        formulaRef: 'tonnes',
        format: 'number',
        precision: 2,
        suffix: ' tonnes',
        highlight: true,
      },
    ],
    guide: {
      whatIsIt:
        'A gravel calculator computes the volume and weight of loose aggregate materials � gravel, crushed stone, sand, or river rock � needed to fill a rectangular area. Volume is straightforward (length x width x depth), but suppliers quote by the tonne, so density conversion is essential.',
      howToUse:
        'Enter the length and width of the area in metres, the required depth in centimetres, and select the material type. The density values are approximate industry averages � confirm with your supplier. The result is displayed in both cubic metres (for checking skip/delivery sizes) and tonnes (for ordering).',
      exampleScenario:
        'A 10 x 5 m driveway filled with 10 cm of crushed stone: volume = 5 m3. At 1.8 t/m3, that is 9 tonnes of crushed stone. A standard tipper truck carries 8�10 tonnes, so one load is sufficient.',
      proTip:
        'Gravel compacts roughly 15�20% after being driven on. For driveways or paths, order 15% more than the calculated volume to account for compaction and topping up. A layer of geotextile fabric beneath the gravel prevents it from sinking into soft soil over time.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 6. Solar Panel Optimal Tilt Angle
  // =========================================================================
  {
    id: 'solar-panel-tilt-angle',
    slug: 'solar-panel-tilt-angle',
    title: 'Solar Panel Optimal Tilt Angle',
    description:
      'Calculate the optimal solar panel tilt angle for year-round, winter, and summer conditions based on your geographic latitude.',
    icon: '☀',
    category: 'energy',
    subcategory: 'solar',
    tags: ['solar', 'tilt angle', 'latitude', 'photovoltaic', 'PV', 'renewable energy', 'optimization'],
    inputs: [
      {
        id: 'latitude',
        label: 'Your Latitude (degrees)',
        type: 'number',
        defaultValue: 35,
        min: -90,
        max: 90,
        step: 0.5,
        placeholder: 'e.g. 35',
        helpText: 'Positive = Northern Hemisphere, Negative = Southern Hemisphere. Find via Google Maps.',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'absLat',
        expression: 'abs(latitude)',
        dependencies: ['latitude'],
      },
      {
        id: 'tiltYear',
        expression: 'absLat',
        dependencies: ['absLat'],
      },
      {
        id: 'tiltWinter',
        expression: 'absLat + 15',
        dependencies: ['absLat'],
      },
      {
        id: 'tiltSummer',
        expression: 'max(absLat - 15, 0)',
        dependencies: ['absLat'],
      },
    ],
    outputs: [
      {
        id: 'out-tiltYear',
        label: 'Year-Round Optimal Tilt',
        formulaRef: 'tiltYear',
        format: 'number',
        precision: 0,
        suffix: '�',
        highlight: true,
      },
      {
        id: 'out-tiltWinter',
        label: 'Winter Tilt (max gain)',
        formulaRef: 'tiltWinter',
        format: 'number',
        precision: 0,
        suffix: '�',
      },
      {
        id: 'out-tiltSummer',
        label: 'Summer Tilt (max gain)',
        formulaRef: 'tiltSummer',
        format: 'number',
        precision: 0,
        suffix: '�',
      },
    ],
    guide: {
      whatIsIt:
        'Solar panels generate the most electricity when sunlight hits them at a 90-degree angle. Because the sun\'s path varies with the seasons, the optimal tilt angle changes throughout the year. The general rule of thumb: year-round tilt equals your latitude, winter tilt equals latitude + 15 degrees, and summer tilt equals latitude - 15 degrees.',
      howToUse:
        'Enter your latitude in decimal degrees (positive for Northern Hemisphere, negative for Southern). The calculator shows the recommended panel tilt angles for three scenarios. If your panels have adjustable mounts, change the angle seasonally. For fixed-mount systems, use the year-round angle.',
      exampleScenario:
        'A homeowner in Sydney, Australia (latitude -33.9 degrees) uses abs(-33.9) = 33.9 degrees. Year-round tilt: 34 degrees. For maximum winter gain (June in Australia): 34 + 15 = 49 degrees. For summer: max(34 - 15, 0) = 19 degrees. Adjusting twice a year can increase annual yield by 5�10%.',
      proTip:
        'In practice, roof pitch often dictates the actual tilt angle. A flat-mounted panel that matches your roof slope may be within a few degrees of optimal. For ground-mount systems, dual-axis trackers can increase yield by 25�40% over fixed panels, but add significant cost and maintenance overhead.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 7. Gutter Size Calculator
  // =========================================================================
  {
    id: 'gutter-size-calculator',
    slug: 'gutter-size-calculator',
    title: 'Gutter Size Calculator',
    description:
      'Calculate the peak rainwater flow rate from a roof catchment area and recommend the minimum gutter width and number of downspouts required.',
    icon: '🌧',
    category: 'construction',
    subcategory: 'roofing',
    tags: ['gutter', 'downspout', 'rainwater', 'roofing', 'drainage', 'stormwater', 'sizing'],
    inputs: [
      {
        id: 'roofArea',
        label: 'Roof Catchment Area (m�)',
        type: 'number',
        defaultValue: 150,
        min: 10,
        step: 5,
        placeholder: 'e.g. 150',
        required: true,
      },
      {
        id: 'rainfallIntensity',
        label: 'Rainfall Intensity (mm/hr)',
        type: 'number',
        defaultValue: 75,
        min: 10,
        max: 300,
        step: 5,
        placeholder: 'e.g. 75',
        helpText: 'Check local 10-year storm data. US average ~75 mm/hr; tropical areas 100�200+.',
        required: true,
      },
      {
        id: 'gutterSlope',
        label: 'Gutter Slope (mm per meter)',
        type: 'number',
        defaultValue: 3,
        min: 1,
        max: 20,
        step: 0.5,
        placeholder: 'e.g. 3',
        helpText: 'Minimum recommended slope is 2�3 mm/m to prevent standing water.',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'flowRateLps',
        expression: 'roofArea * rainfallIntensity / 3600000',
        dependencies: ['roofArea', 'rainfallIntensity'],
      },
      {
        id: 'gutterDiameterMm',
        expression: 'sqrt(flowRateLps / 0.00025) * 25.4',
        dependencies: ['flowRateLps'],
      },
      {
        id: 'downspoutsNeeded',
        expression: 'ceil(gutterDiameterMm / 100)',
        dependencies: ['gutterDiameterMm'],
      },
    ],
    outputs: [
      {
        id: 'out-flowRateLps',
        label: 'Peak Flow Rate',
        formulaRef: 'flowRateLps',
        format: 'number',
        precision: 3,
        suffix: ' L/s',
      },
      {
        id: 'out-gutterDiameterMm',
        label: 'Recommended Gutter Width',
        formulaRef: 'gutterDiameterMm',
        format: 'number',
        precision: 0,
        suffix: ' mm',
        highlight: true,
      },
      {
        id: 'out-downspoutsNeeded',
        label: 'Downspouts Needed',
        formulaRef: 'downspoutsNeeded',
        format: 'number',
        precision: 0,
      },
    ],
    guide: {
      whatIsIt:
        'A gutter sizing calculator determines what gutter width can handle the peak flow of rainwater from your roof during a design storm. It converts your catchment area and local rainfall intensity into a flow rate (litres per second), then works back to the minimum gutter cross-section needed.',
      howToUse:
        'Measure the horizontal projected area of the roof section draining into the gutter. Find your local design storm intensity (often called "10-year storm" intensity in mm/hr � available from your local council or weather authority). Enter the gutter slope (3 mm/m is typical). The result guides gutter profile width and downspout count.',
      exampleScenario:
        'A 150 m2 roof in a region with 75 mm/hr design rainfall generates 0.003125 L/s of flow. The formula suggests a gutter of approximately 281 mm � so rounding up to the nearest standard size, use a 300 mm half-round gutter with at least 3 downspouts spaced evenly.',
      proTip:
        'Always upsize gutters slightly � undersized gutters overflow in heavy rain, potentially damaging soffits and foundations. A 125 mm K-style gutter is the minimum for most suburban homes; go to 150 mm or 300 mm half-round for larger roofs. Clean gutters twice a year to maintain full flow capacity.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 8. Retaining Wall Block Calculator
  // =========================================================================
  {
    id: 'retaining-wall-block-calculator',
    slug: 'retaining-wall-block-calculator',
    title: 'Retaining Wall Block Calculator',
    description:
      'Estimate the number of retaining wall blocks needed based on wall dimensions and individual block face size, with a waste factor.',
    icon: '📏',
    category: 'construction',
    subcategory: 'concrete',
    tags: ['retaining wall', 'blocks', 'concrete', 'landscaping', 'masonry', 'garden wall'],
    inputs: [
      {
        id: 'wallLength',
        label: 'Wall Length (m)',
        type: 'number',
        defaultValue: 10,
        min: 0.5,
        step: 0.1,
        placeholder: 'e.g. 10',
        required: true,
      },
      {
        id: 'wallHeight',
        label: 'Wall Height (m)',
        type: 'number',
        defaultValue: 1.2,
        min: 0.1,
        max: 3,
        step: 0.05,
        placeholder: 'e.g. 1.2',
        required: true,
      },
      {
        id: 'blockLength',
        label: 'Block Face Length (m)',
        type: 'number',
        defaultValue: 0.45,
        min: 0.1,
        max: 1,
        step: 0.01,
        placeholder: 'e.g. 0.45',
        helpText: 'Exposed face length of a single block (most standard blocks: 0.45 m).',
        required: true,
      },
      {
        id: 'blockHeight',
        label: 'Block Face Height (m)',
        type: 'number',
        defaultValue: 0.2,
        min: 0.05,
        max: 0.5,
        step: 0.01,
        placeholder: 'e.g. 0.2',
        helpText: 'Exposed face height of a single block (most standard blocks: 0.2 m).',
        required: true,
      },
      {
        id: 'waste',
        label: 'Waste %',
        type: 'number',
        defaultValue: 5,
        min: 0,
        max: 25,
        step: 1,
        placeholder: 'e.g. 5',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'blockFaceArea',
        expression: 'blockLength * blockHeight',
        dependencies: ['blockLength', 'blockHeight'],
      },
      {
        id: 'wallFaceArea',
        expression: 'wallLength * wallHeight',
        dependencies: ['wallLength', 'wallHeight'],
      },
      {
        id: 'blocksNeeded',
        expression: 'ceil(wallFaceArea / blockFaceArea * (1 + waste / 100))',
        dependencies: ['wallFaceArea', 'blockFaceArea', 'waste'],
      },
    ],
    outputs: [
      {
        id: 'out-wallFaceArea',
        label: 'Wall Face Area',
        formulaRef: 'wallFaceArea',
        format: 'number',
        precision: 1,
        suffix: ' m�',
      },
      {
        id: 'out-blocksNeeded',
        label: 'Blocks Needed',
        formulaRef: 'blocksNeeded',
        format: 'number',
        precision: 0,
        highlight: true,
      },
    ],
    guide: {
      whatIsIt:
        'A retaining wall block calculator determines how many interlocking concrete or masonry blocks are required to build a wall of given length and height. It divides the total face area of the wall by the face area of one block, then adds a waste margin for cuts at corners and ends.',
      howToUse:
        'Measure the wall length and height. Note the face dimensions of the blocks from the manufacturer spec sheet (length and height of the exposed face � not the overall block depth). Enter a 5% waste factor for straight walls, 10%+ for walls with many corners or curves.',
      exampleScenario:
        'A 10 m long x 1.2 m high retaining wall has a face area of 12 m2. Standard 450 mm x 200 mm blocks each cover 0.09 m2. That means 12 / 0.09 = 133.3 rounded up to 134 base blocks, plus 5% waste = 141 blocks to order. A pallet of blocks typically contains 48�60 units.',
      proTip:
        'Walls over 1 m high typically require engineering and a deadman anchor (blocks buried perpendicular into the slope for stability). Check local council regulations � most jurisdictions require a permit for walls over 600 mm high. Use a drainage aggregate backfill and perforated pipe to relieve hydrostatic pressure behind the wall.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 9. Firewood Cord Calculator
  // =========================================================================
  {
    id: 'firewood-cord-calculator',
    slug: 'firewood-cord-calculator',
    title: 'Firewood Cord Calculator',
    description:
      'Calculate the volume of a firewood pile in cubic feet and convert it to full cords so you know exactly how much wood you have or need to order.',
    icon: '🌳',
    category: 'everyday',
    subcategory: 'utility',
    tags: ['firewood', 'cord', 'wood', 'heating', 'winter', 'volume', 'fuel'],
    inputs: [
      {
        id: 'pileLength',
        label: 'Pile Length (ft)',
        type: 'number',
        defaultValue: 4,
        min: 0.5,
        step: 0.5,
        placeholder: 'e.g. 4',
        required: true,
      },
      {
        id: 'pileHeight',
        label: 'Pile Height (ft)',
        type: 'number',
        defaultValue: 4,
        min: 0.5,
        step: 0.5,
        placeholder: 'e.g. 4',
        required: true,
      },
      {
        id: 'pileDepth',
        label: 'Pile Depth (ft)',
        type: 'number',
        defaultValue: 8,
        min: 0.5,
        step: 0.5,
        placeholder: 'e.g. 8',
        helpText: 'This is the log length (depth of the pile). A full cord is 4 ft deep.',
        required: true,
      },
      {
        id: 'logType',
        label: 'Cord Type',
        type: 'select',
        options: [
          { label: 'Face Cord (4x8x16in)', value: '0.33' },
          { label: 'Full Cord (4x8x4ft)', value: '1' },
        ],
        defaultValue: '1',
      },
    ],
    formulas: [
      {
        id: 'pileVolume',
        expression: 'pileLength * pileHeight * pileDepth',
        dependencies: ['pileLength', 'pileHeight', 'pileDepth'],
      },
      {
        id: 'cordVolume',
        expression: '128',
        dependencies: [],
      },
      {
        id: 'cords',
        expression: 'pileVolume / cordVolume',
        dependencies: ['pileVolume', 'cordVolume'],
      },
    ],
    outputs: [
      {
        id: 'out-pileVolume',
        label: 'Pile Volume',
        formulaRef: 'pileVolume',
        format: 'number',
        precision: 1,
        suffix: ' cu ft',
      },
      {
        id: 'out-cords',
        label: 'Full Cords',
        formulaRef: 'cords',
        format: 'number',
        precision: 2,
        highlight: true,
      },
    ],
    guide: {
      whatIsIt:
        'A cord is the standard unit for measuring firewood in the US and Canada. A full cord is a neatly stacked pile measuring 4 ft x 4 ft x 8 ft = 128 cubic feet. A face cord (rick) is only 16 inches deep instead of 4 feet, giving roughly 1/3 of a full cord � so pricing must be compared carefully.',
      howToUse:
        'Measure your firewood pile in feet � length along the ground, height, and depth (log length). The calculator converts the pile volume to full cord equivalents. Use this to verify you received the amount ordered, or to estimate how many cords you need for a heating season.',
      exampleScenario:
        'A pile 8 ft long x 4 ft high x 4 ft deep = 128 cu ft = exactly 1.00 full cord. A face cord 8 x 4 x 16 inches (1.33 ft) = 42.7 cu ft = 0.33 cords � confirming why face cords should cost about 1/3 of a full cord price.',
      proTip:
        'A cord of seasoned hardwood (oak, hickory, ash) contains roughly twice the BTU content of a cord of softwood (pine, fir). For efficient heating, source hardwood with under 20% moisture content � split and stack in a sunny, ventilated spot for at least 6�12 months before burning. Use a moisture meter to confirm readiness.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 10. Swimming Pool Volume & Fill Time
  // =========================================================================
  {
    id: 'swimming-pool-volume-calculator',
    slug: 'swimming-pool-volume-calculator',
    title: 'Swimming Pool Volume & Fill Time',
    description:
      'Calculate the volume of a sloped-bottom swimming pool in cubic metres (kilolitres) and estimate the fill time based on your water supply flow rate.',
    icon: '🏊',
    category: 'construction',
    subcategory: 'landscaping',
    tags: ['swimming pool', 'pool volume', 'fill time', 'kilolitres', 'water', 'backyard'],
    inputs: [
      {
        id: 'poolLength',
        label: 'Pool Length (m)',
        type: 'number',
        defaultValue: 10,
        min: 1,
        step: 0.5,
        placeholder: 'e.g. 10',
        required: true,
      },
      {
        id: 'poolWidth',
        label: 'Pool Width (m)',
        type: 'number',
        defaultValue: 5,
        min: 1,
        step: 0.5,
        placeholder: 'e.g. 5',
        required: true,
      },
      {
        id: 'shallowEnd',
        label: 'Shallow End Depth (m)',
        type: 'number',
        defaultValue: 1,
        min: 0.5,
        max: 3,
        step: 0.1,
        placeholder: 'e.g. 1',
        required: true,
      },
      {
        id: 'deepEnd',
        label: 'Deep End Depth (m)',
        type: 'number',
        defaultValue: 2,
        min: 0.5,
        max: 5,
        step: 0.1,
        placeholder: 'e.g. 2',
        required: true,
      },
      {
        id: 'fillRateKlph',
        label: 'Fill Rate (kL/hr)',
        type: 'number',
        defaultValue: 2,
        min: 0.1,
        step: 0.1,
        placeholder: 'e.g. 2',
        helpText: 'Typical garden hose = 1�2 kL/hr. A 25 mm supply line can do 3�5 kL/hr.',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'avgDepth',
        expression: '(shallowEnd + deepEnd) / 2',
        dependencies: ['shallowEnd', 'deepEnd'],
      },
      {
        id: 'volumeM3',
        expression: 'poolLength * poolWidth * avgDepth',
        dependencies: ['poolLength', 'poolWidth', 'avgDepth'],
      },
      {
        id: 'volumeKL',
        expression: 'volumeM3',
        dependencies: ['volumeM3'],
      },
      {
        id: 'fillTimeHrs',
        expression: 'volumeKL / fillRateKlph',
        dependencies: ['volumeKL', 'fillRateKlph'],
      },
    ],
    outputs: [
      {
        id: 'out-volumeM3',
        label: 'Pool Volume',
        formulaRef: 'volumeM3',
        format: 'number',
        precision: 1,
        suffix: ' m� (kL)',
        highlight: true,
      },
      {
        id: 'out-fillTimeHrs',
        label: 'Fill Time',
        formulaRef: 'fillTimeHrs',
        format: 'number',
        precision: 1,
        suffix: ' hours',
      },
    ],
    guide: {
      whatIsIt:
        'A swimming pool volume calculator uses the average depth method to estimate pool capacity in cubic metres (equivalently, kilolitres � 1 m3 = 1 kL). This matters for chemical dosing, water bills from council fill permits, and pump/filter sizing, which are all rated per kilolitre.',
      howToUse:
        'Enter pool length and width, then shallow and deep end depths. The calculator averages the two depths to estimate volume for a uniformly sloping bottom � the standard shape for residential pools. Enter your fill rate (check your water meter during a hose test) to get the fill time in hours.',
      exampleScenario:
        'A 10 x 5 m pool with a 1 m shallow end and 2 m deep end has an average depth of 1.5 m, giving 75 m3 (75 kL). Using a 2 kL/hr hose, filling takes 37.5 hours � about 1.5 days. At typical water rates, 75 kL costs $150�$250 depending on your local tariff.',
      proTip:
        'Pool chemical dosing (chlorine, pH adjusters) is calculated per 1,000 L (1 kL) of water. Knowing your exact volume prevents under- or over-dosing. For irregular-shaped pools (kidney, L-shape), break them into rectangular sections and sum the volumes. Pool volume also determines your pump turnover rate � aim for full circulation every 6�8 hours.',
    },
    metadata: { version: '1.0.0' },
  },
];
