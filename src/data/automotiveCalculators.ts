// ---------------------------------------------------------------------------
// Quantify — Automotive & Transport Calculators
// ---------------------------------------------------------------------------
// 9 calculators covering vehicle specs, fuel, shipping logistics, and travel.
// ---------------------------------------------------------------------------

import type { CalculatorSchema } from '@/types/calculator';

export const automotiveCalculators: CalculatorSchema[] = [
  // =========================================================================
  // 1. Tire Size Calculator
  // =========================================================================
  {
    id: 'tire-size-calculator',
    slug: 'tire-size-calculator',
    title: 'Tire Size Calculator',
    description:
      'Decode any tire size code (e.g. 225/45R18) to get overall diameter, sidewall height, rolling circumference, and revolutions per mile.',
    icon: '🛞',
    category: 'automotive',
    subcategory: 'vehicle',
    tags: ['tire', 'wheel', 'diameter', 'circumference', 'speedometer', 'plus sizing'],
    inputs: [
      {
        id: 'width',
        label: 'Section Width (mm)',
        type: 'number',
        defaultValue: 225,
        min: 100,
        max: 400,
        step: 5,
        placeholder: 'e.g. 225',
        helpText: 'The three-digit number at the start of the tire code, e.g. 225 in 225/45R18',
        required: true,
      },
      {
        id: 'aspectRatio',
        label: 'Aspect Ratio (%)',
        type: 'number',
        defaultValue: 45,
        min: 20,
        max: 90,
        step: 5,
        placeholder: 'e.g. 45',
        helpText: 'The two-digit percentage after the slash, e.g. 45 in 225/45R18',
        required: true,
      },
      {
        id: 'rimDiameter',
        label: 'Rim Diameter (inches)',
        type: 'number',
        defaultValue: 18,
        min: 10,
        max: 30,
        step: 1,
        placeholder: 'e.g. 18',
        helpText: 'The number after the R, e.g. 18 in 225/45R18',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'sidewallMm',
        expression: 'width * aspectRatio / 100',
        dependencies: ['width', 'aspectRatio'],
      },
      {
        id: 'totalDiameterMm',
        expression: 'rimDiameter * 25.4 + 2 * sidewallMm',
        dependencies: ['rimDiameter', 'sidewallMm'],
      },
      {
        id: 'totalDiameterIn',
        expression: 'totalDiameterMm / 25.4',
        dependencies: ['totalDiameterMm'],
      },
      {
        id: 'circumferenceMm',
        expression: 'PI * totalDiameterMm',
        dependencies: ['totalDiameterMm'],
      },
      {
        id: 'circumferenceIn',
        expression: 'circumferenceMm / 25.4',
        dependencies: ['circumferenceMm'],
      },
      {
        id: 'revPerMile',
        expression: 'round(63360 / circumferenceIn)',
        dependencies: ['circumferenceIn'],
      },
      {
        id: 'revPerKm',
        expression: 'round(1000000 / circumferenceMm)',
        dependencies: ['circumferenceMm'],
      },
    ],
    outputs: [
      {
        id: 'out-totalDiameterIn',
        label: 'Overall Diameter',
        formulaRef: 'totalDiameterIn',
        format: 'number',
        precision: 2,
        suffix: '"',
        highlight: true,
      },
      {
        id: 'out-sidewallMm',
        label: 'Sidewall Height',
        formulaRef: 'sidewallMm',
        format: 'number',
        precision: 1,
        suffix: ' mm',
      },
      {
        id: 'out-circumferenceIn',
        label: 'Rolling Circumference',
        formulaRef: 'circumferenceIn',
        format: 'number',
        precision: 2,
        suffix: '"',
      },
      {
        id: 'out-revPerMile',
        label: 'Revolutions per Mile',
        formulaRef: 'revPerMile',
        format: 'number',
        precision: 0,
        suffix: ' rev/mile',
      },
    ],
    guide: {
      whatIsIt:
        'Tire size codes like 225/45R18 encode three measurements: section width in mm, aspect ratio (sidewall height as % of width), and rim diameter in inches. This calculator decodes those values into real-world dimensions so you can compare fitments, check speedometer accuracy, and plan plus-sizing upgrades.',
      howToUse:
        'Read the three numbers from your tire sidewall and enter each into the corresponding field. The results update instantly. To compare two tire sizes, note the overall diameter — sizes within ~3% of each other are generally considered speedometer-safe.',
      exampleScenario:
        'A stock tire of 225/45R18 has a 101.25 mm sidewall, giving an overall diameter of 25.9 inches and 804 rev/mile. Upgrading to 235/40R18 yields a 94 mm sidewall and 25.4 inches — roughly 2% smaller, causing a speedometer to read ~2% high.',
      proTip:
        'When plus-sizing (larger rim, lower profile), keep overall diameter within ±3% of stock to avoid ABS/traction-control calibration errors and clearance issues. Many enthusiasts go +1" rim with −10 aspect ratio points to maintain nearly identical rolling diameter.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 2. Horsepower to kW Converter
  // =========================================================================
  {
    id: 'horsepower-converter',
    slug: 'horsepower-converter',
    title: 'Horsepower to kW Converter',
    description:
      'Convert power ratings between mechanical HP, kilowatts, metric PS, and BTU/hr instantly.',
    icon: '⚡',
    category: 'automotive',
    subcategory: 'vehicle',
    tags: ['horsepower', 'hp', 'kw', 'kilowatt', 'ps', 'power', 'engine', 'conversion'],
    inputs: [
      {
        id: 'value',
        label: 'Power Value',
        type: 'number',
        defaultValue: 300,
        min: 0,
        step: 1,
        placeholder: 'e.g. 300',
        required: true,
      },
      {
        id: 'fromUnit',
        label: 'From Unit',
        type: 'select',
        options: [
          { label: 'HP (mechanical)', value: '1' },
          { label: 'kW', value: '0.7457' },
          { label: 'PS (metric HP)', value: '0.9863' },
          { label: 'BTU/hr', value: '0.000293' },
        ],
        defaultValue: '1',
        required: true,
      },
    ],
    formulas: [
      // fromUnit stores HP→kW factor so: kW = value × factor
      {
        id: 'kW',
        expression: 'value * fromUnit',
        dependencies: ['value', 'fromUnit'],
      },
      {
        id: 'hp',
        expression: 'kW / 0.7457',
        dependencies: ['kW'],
      },
      {
        id: 'ps',
        expression: 'kW / 0.9863',
        dependencies: ['kW'],
      },
      {
        id: 'btuHr',
        expression: 'kW / 0.000293',
        dependencies: ['kW'],
      },
    ],
    outputs: [
      {
        id: 'out-kW',
        label: 'Kilowatts',
        formulaRef: 'kW',
        format: 'number',
        precision: 2,
        suffix: ' kW',
        highlight: true,
      },
      {
        id: 'out-hp',
        label: 'Mechanical HP',
        formulaRef: 'hp',
        format: 'number',
        precision: 1,
        suffix: ' HP',
      },
      {
        id: 'out-ps',
        label: 'Metric PS',
        formulaRef: 'ps',
        format: 'number',
        precision: 1,
        suffix: ' PS',
      },
      {
        id: 'out-btuHr',
        label: 'BTU/hr',
        formulaRef: 'btuHr',
        format: 'number',
        precision: 0,
        suffix: ' BTU/hr',
      },
    ],
    guide: {
      whatIsIt:
        'Horsepower is a unit of power originally defined by James Watt. Today, three common variants exist: mechanical HP (used in the US, ≈745.7 W), metric PS or "Pferdestärke" (Germany and much of Europe, ≈735.5 W), and electrical HP (exactly 746 W). kW is the SI standard used worldwide in regulations and EV ratings.',
      howToUse:
        'Enter the power figure and choose its source unit from the dropdown. All four equivalent values are displayed simultaneously. Note that kW is the baseline — all conversions go through it.',
      exampleScenario:
        'A European sports car advertised as 400 PS is 294 kW, which equals 394 mechanical HP — about 1.5% less than PS, a common marketing nuance that confuses buyers comparing European and American specs.',
      proTip:
        'Torque (lb-ft) and RPM relate to HP via the formula HP = Torque × RPM ÷ 5,252. So a 400 lb-ft engine at 4,000 RPM produces ≈304 HP regardless of displacement. Understanding this lets you interpret dyno sheets rather than relying on peak figures alone.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 3. 0-60 mph Calculator
  // =========================================================================
  {
    id: 'zero-to-sixty',
    slug: 'zero-to-sixty',
    title: '0–60 mph Calculator',
    description:
      'Estimate 0-60 mph acceleration time from mass and engine force, or verify a known time with derived performance metrics.',
    icon: '🏎️',
    category: 'automotive',
    subcategory: 'vehicle',
    tags: ['0-60', 'acceleration', 'quarter mile', 'performance', 'g-force', 'speed'],
    inputs: [
      {
        id: 'mass',
        label: 'Vehicle Mass',
        type: 'number',
        defaultValue: 1500,
        min: 200,
        step: 10,
        placeholder: 'e.g. 1500',
        units: [
          { label: 'kg', value: 'kg' },
          { label: 'lb', value: 'lb', conversionFactor: '0.453592' },
        ],
        required: true,
      },
      {
        id: 'force',
        label: 'Net Force (N)',
        type: 'number',
        defaultValue: 3000,
        min: 0,
        step: 100,
        placeholder: 'e.g. 3000',
        helpText: 'Engine force minus drag — approximation',
        required: true,
      },
      {
        id: 'time060',
        label: 'Known 0-60 Time (seconds, 0 = calculate)',
        type: 'number',
        defaultValue: 0,
        min: 0,
        max: 30,
        step: 0.1,
        placeholder: '0 to auto-calculate',
        helpText: 'Enter a known time to use it directly; leave 0 to compute from mass and force',
      },
    ],
    formulas: [
      {
        id: 'acceleration',
        expression: 'force / mass',
        dependencies: ['force', 'mass'],
      },
      // 60 mph = 26.8224 m/s
      {
        id: 'calcTime060',
        expression: '26.8224 / acceleration',
        dependencies: ['acceleration'],
      },
      {
        id: 'time',
        expression: 'time060 > 0 ? time060 : calcTime060',
        dependencies: ['time060', 'calcTime060'],
      },
      {
        id: 'peakG',
        expression: 'acceleration / 9.81',
        dependencies: ['acceleration'],
      },
      // Elapsed Time equation: ET = 5.825 × t^0.526 (Hale's empirical formula)
      {
        id: 'quarterMileTime',
        expression: 'round(5.825 * pow(time, 0.526) * 100) / 100',
        dependencies: ['time'],
      },
    ],
    outputs: [
      {
        id: 'out-time',
        label: '0–60 mph Time',
        formulaRef: 'time',
        format: 'number',
        precision: 2,
        suffix: ' seconds',
        highlight: true,
      },
      {
        id: 'out-acceleration',
        label: 'Acceleration',
        formulaRef: 'acceleration',
        format: 'number',
        precision: 2,
        suffix: ' m/s²',
      },
      {
        id: 'out-peakG',
        label: 'Peak G-Force',
        formulaRef: 'peakG',
        format: 'number',
        precision: 3,
        suffix: ' g',
      },
      {
        id: 'out-quarterMileTime',
        label: 'Est. ¼ Mile Time',
        formulaRef: 'quarterMileTime',
        format: 'number',
        precision: 2,
        suffix: ' seconds',
      },
    ],
    guide: {
      whatIsIt:
        "The 0-60 mph test is the most widely cited benchmark for automotive acceleration. It measures how quickly a vehicle can accelerate from a standstill to 60 miles per hour. Using Newton's second law (F = ma), this calculator derives time from net force and vehicle mass, or uses a known measured time.",
      howToUse:
        "Enter vehicle mass (kg or lb) and estimated net force in Newtons (engine thrust minus aerodynamic drag at moderate speed). Leave 'Known 0-60 Time' at 0 to compute automatically. Enter a real test time to generate the derived metrics from that value instead. The quarter-mile estimate uses Hale's empirical formula.",
      exampleScenario:
        'A 1,500 kg car with 3,000 N of net driving force accelerates at 2.0 m/s², reaching 60 mph (26.82 m/s) in about 13.4 seconds. A performance version at 6,000 N cuts that to 6.7 seconds — confirming that doubling thrust halves the time.',
      proTip:
        'Real-world 0-60 times are reduced by launch control, traction, and gear ratios. Weight reduction is extremely effective: shedding 100 kg from a 1,500 kg car (6.7% lighter) improves every acceleration figure by the same 6.7%. Rolling resistance and aerodynamic drag are significant above 40 mph, so net force is lower at speed than at launch.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 4. Engine Displacement Calculator
  // =========================================================================
  {
    id: 'engine-displacement',
    slug: 'engine-displacement',
    title: 'Engine Displacement Calculator',
    description:
      'Calculate total engine displacement in liters, cubic centimeters, and cubic inches from bore, stroke, and cylinder count.',
    icon: '🔧',
    category: 'automotive',
    subcategory: 'vehicle',
    tags: ['engine', 'displacement', 'bore', 'stroke', 'cubic inch', 'cc', 'liters', 'cylinders'],
    inputs: [
      {
        id: 'bore',
        label: 'Bore (mm)',
        type: 'number',
        defaultValue: 86,
        min: 20,
        max: 200,
        step: 0.1,
        placeholder: 'e.g. 86',
        helpText: 'Inner diameter of the cylinder',
        required: true,
      },
      {
        id: 'stroke',
        label: 'Stroke (mm)',
        type: 'number',
        defaultValue: 86,
        min: 20,
        max: 200,
        step: 0.1,
        placeholder: 'e.g. 86',
        helpText: 'Distance the piston travels from BDC to TDC',
        required: true,
      },
      {
        id: 'cylinders',
        label: 'Number of Cylinders',
        type: 'select',
        options: [
          { label: '1', value: '1' },
          { label: '2', value: '2' },
          { label: '3', value: '3' },
          { label: '4', value: '4' },
          { label: '5', value: '5' },
          { label: '6', value: '6' },
          { label: '8', value: '8' },
          { label: '10', value: '10' },
          { label: '12', value: '12' },
          { label: '16', value: '16' },
        ],
        defaultValue: '4',
        required: true,
      },
    ],
    formulas: [
      // Convert mm → m for SI calculation, then express result in cm³
      {
        id: 'boreM',
        expression: 'bore / 1000',
        dependencies: ['bore'],
      },
      {
        id: 'strokeM',
        expression: 'stroke / 1000',
        dependencies: ['stroke'],
      },
      // Volume per cylinder in cm³: (π/4) × bore_m² × stroke_m × 1,000,000
      {
        id: 'displacementPerCyl',
        expression: 'PI / 4 * pow(boreM, 2) * strokeM * 1000000',
        dependencies: ['boreM', 'strokeM'],
      },
      {
        id: 'totalCC',
        expression: 'displacementPerCyl * cylinders',
        dependencies: ['displacementPerCyl', 'cylinders'],
      },
      {
        id: 'totalLiters',
        expression: 'totalCC / 1000',
        dependencies: ['totalCC'],
      },
      // 1 liter = 61.0237 in³
      {
        id: 'totalCID',
        expression: 'totalLiters * 61.024',
        dependencies: ['totalLiters'],
      },
    ],
    outputs: [
      {
        id: 'out-totalLiters',
        label: 'Total Displacement',
        formulaRef: 'totalLiters',
        format: 'number',
        precision: 3,
        suffix: ' L',
        highlight: true,
      },
      {
        id: 'out-totalCC',
        label: 'Cubic Centimeters',
        formulaRef: 'totalCC',
        format: 'number',
        precision: 0,
        suffix: ' cc',
      },
      {
        id: 'out-totalCID',
        label: 'Cubic Inch Displacement',
        formulaRef: 'totalCID',
        format: 'number',
        precision: 1,
        suffix: ' in³',
      },
    ],
    guide: {
      whatIsIt:
        "Engine displacement is the total swept volume of all cylinders — the combined space the pistons move through in one complete cycle. It's the single most common way to describe engine size and is calculated using the formula: V = (π/4) × bore² × stroke × cylinders.",
      howToUse:
        "Enter the cylinder bore diameter and piston stroke length (both in mm), then select the cylinder count. Displacement appears in liters, cc, and cubic inches simultaneously. Note that a 'square' engine has equal bore and stroke.",
      exampleScenario:
        'A 2.0L inline-four with 86 mm bore and 86 mm stroke (square engine, 4 cylinders): each cylinder displaces 499.6 cc, totaling 1,998.5 cc ≈ 2.0 L (122 in³). Increasing stroke to 90 mm gives 2,094 cc — a common path to more torque without widening the block.',
      proTip:
        'Specific output (hp/liter) is a better performance indicator than displacement alone — a highly tuned 2.0L can make 300+ hp while a lazy 5.0L may only make 250. Supercharging effectively multiplies displacement: a 2.0L engine with 14.7 psi boost (1 atm) breathes like a 4.0L naturally aspirated engine.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 5. Gas Mileage Calculator
  // =========================================================================
  {
    id: 'gas-mileage-calculator',
    slug: 'gas-mileage-calculator',
    title: 'Gas Mileage Calculator',
    description:
      "Calculate fuel economy (MPG and L/100km) and running fuel costs from a trip's distance and fuel consumed.",
    icon: '⛽',
    category: 'automotive',
    subcategory: 'fuel',
    tags: ['mpg', 'fuel economy', 'gas', 'l/100km', 'cost per mile', 'fuel efficiency', 'mileage'],
    inputs: [
      {
        id: 'miles',
        label: 'Distance Driven',
        type: 'number',
        defaultValue: 300,
        min: 0,
        step: 1,
        placeholder: 'e.g. 300',
        units: [
          { label: 'miles', value: 'miles' },
          { label: 'km', value: 'km', conversionFactor: '0.621371' },
        ],
        required: true,
      },
      {
        id: 'gallons',
        label: 'Fuel Used',
        type: 'number',
        defaultValue: 10,
        min: 0,
        step: 0.1,
        placeholder: 'e.g. 10',
        units: [
          { label: 'gallons', value: 'gal' },
          { label: 'liters', value: 'L', conversionFactor: '0.264172' },
        ],
        required: true,
      },
      {
        id: 'fuelPrice',
        label: 'Fuel Price (per gallon)',
        type: 'number',
        defaultValue: 3.50,
        min: 0,
        step: 0.01,
        placeholder: 'e.g. 3.50',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'mpg',
        expression: 'miles / gallons',
        dependencies: ['miles', 'gallons'],
      },
      // L/100km: 235.215 is the conversion constant (235.215 / MPG = L/100km)
      {
        id: 'l100km',
        expression: '235.215 / mpg',
        dependencies: ['mpg'],
      },
      {
        id: 'costPerMile',
        expression: 'fuelPrice / mpg',
        dependencies: ['fuelPrice', 'mpg'],
      },
      {
        id: 'costPer100miles',
        expression: 'costPerMile * 100',
        dependencies: ['costPerMile'],
      },
    ],
    outputs: [
      {
        id: 'out-mpg',
        label: 'Fuel Economy',
        formulaRef: 'mpg',
        format: 'number',
        precision: 1,
        suffix: ' MPG',
        highlight: true,
      },
      {
        id: 'out-l100km',
        label: 'Fuel Consumption',
        formulaRef: 'l100km',
        format: 'number',
        precision: 1,
        suffix: ' L/100km',
      },
      {
        id: 'out-costPerMile',
        label: 'Cost per Mile',
        formulaRef: 'costPerMile',
        format: 'currency',
      },
      {
        id: 'out-costPer100miles',
        label: 'Cost per 100 Miles',
        formulaRef: 'costPer100miles',
        format: 'currency',
      },
    ],
    guide: {
      whatIsIt:
        'Fuel economy measures how efficiently a vehicle converts fuel into distance traveled. MPG (miles per gallon) is used in the US, while L/100km is the standard in Canada, Europe, and Australia. Lower L/100km is better; higher MPG is better.',
      howToUse:
        "Fill up your tank, reset your trip odometer, drive normally, fill up again and record the distance and fuel used. Enter those values here along with the current fuel price to see your real-world economy — which is typically 10-20% lower than EPA-sticker estimates.",
      exampleScenario:
        "Driving 300 miles and using 10 gallons gives 30 MPG (7.8 L/100km). At $3.50/gallon, fuel costs $0.117/mile, or $11.67 per 100 miles. Over 15,000 miles per year, that's $1,750 in fuel annually.",
      proTip:
        'The biggest hypermiling gains come from: (1) maintaining steady highway speed — wind resistance scales with speed squared, so 70 mph costs ~30% more than 60 mph; (2) avoiding jackrabbit starts; (3) proper tire inflation (+5% MPG per 10 psi under-inflation corrected). On long trips, draft behind large trucks at safe following distance to reduce aero drag by up to 20%.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 6. Dimensional Weight Calculator
  // =========================================================================
  {
    id: 'dimensional-weight-calculator',
    slug: 'dimensional-weight-calculator',
    title: 'Dimensional Weight Calculator',
    description:
      'Calculate DIM weight for FedEx, UPS, DHL, and USPS shipments and determine the billable weight for accurate shipping quotes.',
    icon: '📦',
    category: 'automotive',
    subcategory: 'shipping',
    tags: ['dim weight', 'dimensional weight', 'shipping', 'fedex', 'ups', 'dhl', 'freight', 'logistics'],
    inputs: [
      {
        id: 'length',
        label: 'Length (cm)',
        type: 'number',
        defaultValue: 30,
        min: 1,
        step: 0.5,
        placeholder: 'e.g. 30',
        required: true,
      },
      {
        id: 'width',
        label: 'Width (cm)',
        type: 'number',
        defaultValue: 20,
        min: 1,
        step: 0.5,
        placeholder: 'e.g. 20',
        required: true,
      },
      {
        id: 'height',
        label: 'Height (cm)',
        type: 'number',
        defaultValue: 15,
        min: 1,
        step: 0.5,
        placeholder: 'e.g. 15',
        required: true,
      },
      {
        id: 'actualWeight',
        label: 'Actual Weight (kg)',
        type: 'number',
        defaultValue: 5,
        min: 0,
        step: 0.1,
        placeholder: 'e.g. 5',
        required: true,
      },
      {
        id: 'carrier',
        label: 'Carrier / DIM Factor',
        type: 'select',
        options: [
          { label: 'FedEx / UPS / DHL (cm, factor 5000)', value: '5000' },
          { label: 'USPS Priority Mail (factor 166)', value: '166' },
          { label: 'International Air (factor 6000)', value: '6000' },
        ],
        defaultValue: '5000',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'volumeCm',
        expression: 'length * width * height',
        dependencies: ['length', 'width', 'height'],
      },
      // DIM weight (kg) = Volume (cm³) / DIM factor
      {
        id: 'dimWeight',
        expression: 'volumeCm / carrier',
        dependencies: ['volumeCm', 'carrier'],
      },
      {
        id: 'billableWeight',
        expression: 'max(dimWeight, actualWeight)',
        dependencies: ['dimWeight', 'actualWeight'],
      },
    ],
    outputs: [
      {
        id: 'out-dimWeight',
        label: 'Dimensional Weight',
        formulaRef: 'dimWeight',
        format: 'number',
        precision: 2,
        suffix: ' kg',
        highlight: true,
      },
      {
        id: 'out-billableWeight',
        label: 'Billable Weight',
        formulaRef: 'billableWeight',
        format: 'number',
        precision: 2,
        suffix: ' kg',
        highlight: true,
      },
      {
        id: 'out-volumeCm',
        label: 'Package Volume',
        formulaRef: 'volumeCm',
        format: 'number',
        precision: 0,
        suffix: ' cm³',
      },
    ],
    guide: {
      whatIsIt:
        "Dimensional (DIM) weight is a pricing technique used by carriers that charges based on the space a package occupies relative to its actual weight. The carrier bills whichever is greater: actual weight or DIM weight. DIM weight = Length × Width × Height ÷ DIM factor.",
      howToUse:
        "Measure your package's outer dimensions in cm and enter the actual weight in kg. Select the carrier to apply the correct DIM factor. If DIM weight exceeds actual weight, you're paying for space — consider tighter packaging.",
      exampleScenario:
        "A 30×20×15 cm box (9,000 cm³) weighing 5 kg shipped via FedEx: DIM weight = 9,000/5,000 = 1.8 kg. Since actual weight (5 kg) > DIM weight, you pay for 5 kg. But a 50×50×50 cm box (125,000 cm³) weighing 2 kg has DIM weight = 25 kg — you'd be billed for 25 kg despite the light contents.",
      proTip:
        "To minimize DIM charges: (1) use the smallest box that safely fits your product — each cm³ saved directly reduces DIM weight; (2) for heavy, dense items, DIM weight rarely applies; (3) for light, bulky items like pillows or electronics, USPS Priority flat-rate boxes bypass DIM pricing entirely and can be a substantial saving.",
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 7. Freight Class Calculator
  // =========================================================================
  {
    id: 'freight-class-calculator',
    slug: 'freight-class-calculator',
    title: 'Freight Class Calculator',
    description:
      'Determine the NMFC freight class of an LTL shipment from its weight and dimensions for accurate carrier rate quotes.',
    icon: '🚛',
    category: 'automotive',
    subcategory: 'shipping',
    tags: ['freight class', 'NMFC', 'LTL', 'density', 'shipping', 'less than truckload', 'logistics'],
    inputs: [
      {
        id: 'weight',
        label: 'Shipment Weight (lbs)',
        type: 'number',
        defaultValue: 100,
        min: 1,
        step: 1,
        placeholder: 'e.g. 100',
        required: true,
      },
      {
        id: 'length',
        label: 'Length (inches)',
        type: 'number',
        defaultValue: 48,
        min: 1,
        step: 0.5,
        placeholder: 'e.g. 48',
        required: true,
      },
      {
        id: 'width',
        label: 'Width (inches)',
        type: 'number',
        defaultValue: 40,
        min: 1,
        step: 0.5,
        placeholder: 'e.g. 40',
        required: true,
      },
      {
        id: 'height',
        label: 'Height (inches)',
        type: 'number',
        defaultValue: 28,
        min: 1,
        step: 0.5,
        placeholder: 'e.g. 28',
        required: true,
      },
    ],
    formulas: [
      // 1728 cubic inches per cubic foot
      {
        id: 'volumeCuFt',
        expression: 'length * width * height / 1728',
        dependencies: ['length', 'width', 'height'],
      },
      {
        id: 'density',
        expression: 'weight / volumeCuFt',
        dependencies: ['weight', 'volumeCuFt'],
      },
      // NMFC density-to-class table (18 classes: 50–500)
      {
        id: 'freightClass',
        expression: 'density >= 50 ? 50 : (density >= 35 ? 55 : (density >= 30 ? 60 : (density >= 22.5 ? 65 : (density >= 15 ? 70 : (density >= 13.5 ? 77.5 : (density >= 12 ? 85 : (density >= 10 ? 92.5 : (density >= 8 ? 100 : (density >= 6 ? 110 : (density >= 4 ? 125 : (density >= 2 ? 150 : (density >= 1 ? 175 : 400)))))))))))))',
        dependencies: ['density'],
      },
    ],
    outputs: [
      {
        id: 'out-density',
        label: 'Shipment Density',
        formulaRef: 'density',
        format: 'number',
        precision: 2,
        suffix: ' lbs/ft³',
        highlight: true,
      },
      {
        id: 'out-freightClass',
        label: 'NMFC Freight Class',
        formulaRef: 'freightClass',
        format: 'number',
        precision: 0,
        highlight: true,
      },
      {
        id: 'out-volumeCuFt',
        label: 'Volume',
        formulaRef: 'volumeCuFt',
        format: 'number',
        precision: 2,
        suffix: ' ft³',
      },
    ],
    guide: {
      whatIsIt:
        'The National Motor Freight Classification (NMFC) system assigns one of 18 freight classes (50 to 500) to every LTL shipment. Class is primarily determined by density (lbs per cubic foot) but also considers stowability, handling difficulty, and liability. Lower class numbers = denser freight = lower shipping rates.',
      howToUse:
        "Enter the total weight in pounds and the outer dimensions of the shipment's shipping footprint (or pallet dimensions including overhang). The calculator computes density and maps it to the standard NMFC class table. Use this class when requesting LTL rate quotes from carriers like FedEx Freight, XPO, or Old Dominion.",
      exampleScenario:
        "A 100-lb shipment on a 48×40×28-inch pallet occupies 30.86 ft³, giving a density of 3.24 lbs/ft³ — Class 125. Repalletizing to 48×40×20 inches (22.22 ft³) raises density to 4.5 lbs/ft³ — Class 125 still, but closer to the Class 100 threshold at 8 lbs/ft³, which can cut rates by 20-30%.",
      proTip:
        'Freight class is a major cost driver in LTL. Strategies to lower your class: (1) compress product packaging to reduce cube; (2) combine multiple lighter shipments into one dense pallet (consolidation); (3) add weight (ballast) to dense-sensitive items only when freight rate savings exceed material cost. Also, always verify NMFC item numbers for your specific commodity — some have mandated classes regardless of density.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 8. Flight Time Calculator
  // =========================================================================
  {
    id: 'flight-time-calculator',
    slug: 'flight-time-calculator',
    title: 'Flight Time Calculator',
    description:
      'Estimate total travel time for any flight from route distance and cruise speed, including ground time for boarding and taxi.',
    icon: '✈️',
    category: 'automotive',
    subcategory: 'travel-calc',
    tags: ['flight time', 'travel', 'aviation', 'cruise speed', 'block time', 'distance', 'hours'],
    inputs: [
      {
        id: 'distanceKm',
        label: 'Flight Distance',
        type: 'number',
        defaultValue: 5550,
        min: 1,
        step: 10,
        placeholder: 'e.g. 5550',
        units: [
          { label: 'km', value: 'km' },
          { label: 'miles', value: 'mi', conversionFactor: '1.60934' },
        ],
        required: true,
      },
      {
        id: 'cruiseSpeedKmh',
        label: 'Cruise Speed (km/h)',
        type: 'number',
        defaultValue: 900,
        min: 100,
        max: 1200,
        step: 10,
        placeholder: 'e.g. 900',
        helpText: 'Commercial jet: 850–950 km/h',
        required: true,
      },
      {
        id: 'taxiAndBoardingMin',
        label: 'Ground Time (minutes)',
        type: 'number',
        defaultValue: 30,
        min: 0,
        max: 120,
        step: 5,
        placeholder: 'e.g. 30',
        helpText: 'Taxi, boarding, and landing rollout time added to flight time',
      },
    ],
    formulas: [
      {
        id: 'flightHours',
        expression: 'distanceKm / cruiseSpeedKmh',
        dependencies: ['distanceKm', 'cruiseSpeedKmh'],
      },
      {
        id: 'totalHours',
        expression: 'flightHours + taxiAndBoardingMin / 60',
        dependencies: ['flightHours', 'taxiAndBoardingMin'],
      },
      {
        id: 'hours',
        expression: 'floor(totalHours)',
        dependencies: ['totalHours'],
      },
      {
        id: 'minutes',
        expression: 'round((totalHours - hours) * 60)',
        dependencies: ['totalHours', 'hours'],
      },
    ],
    outputs: [
      {
        id: 'out-hours',
        label: 'Hours',
        formulaRef: 'hours',
        format: 'number',
        precision: 0,
        suffix: ' h',
        highlight: true,
      },
      {
        id: 'out-minutes',
        label: 'Minutes',
        formulaRef: 'minutes',
        format: 'number',
        precision: 0,
        suffix: ' m',
        highlight: true,
      },
      {
        id: 'out-flightHours',
        label: 'Pure Flight Time',
        formulaRef: 'flightHours',
        format: 'number',
        precision: 2,
        suffix: ' h',
      },
      {
        id: 'out-distanceKm',
        label: 'Distance',
        formulaRef: 'distanceKm',
        format: 'number',
        precision: 0,
        suffix: ' km',
      },
    ],
    guide: {
      whatIsIt:
        'Flight time depends on route distance and cruise speed. "Block time" (what airlines publish) includes ground time from pushback to gate arrival. This calculator estimates that total by adding taxi and boarding time to the pure airborne portion.',
      howToUse:
        "Enter the great-circle distance between airports (found on flight search engines or mapping tools), the cruise speed (900 km/h is a safe default for narrowbody jets; 920–950 for widebodies), and ground time. The result appears in hours and minutes.",
      exampleScenario:
        'New York (JFK) to London (LHR) is approximately 5,540 km. At 900 km/h cruise with 30 minutes of ground time: flight time = 6.16 h, total block time ≈ 6 h 40 m. Airlines typically schedule this westbound leg at ~7 h to account for headwinds (jet stream), and ~6.5 h eastbound with a tailwind boost.',
      proTip:
        'Winds at cruise altitude (30,000–40,000 ft) can add or subtract 50–150 km/h from effective speed. Westbound transatlantic flights take 60–90 minutes longer than eastbound for this reason. For precision, use a flight-aware tracker or airline schedule — this calculator gives a wind-neutral baseline. Great-circle distance (the true shortest path on a sphere) is shorter than what a flat map suggests for long-haul routes.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 9. Stopping Distance Calculator
  // =========================================================================
  {
    id: 'stopping-distance-calculator',
    slug: 'stopping-distance-calculator',
    title: 'Stopping Distance Calculator',
    description:
      'Calculate total stopping distance (reaction + braking) for any vehicle speed and road surface condition.',
    icon: '🛑',
    category: 'automotive',
    subcategory: 'vehicle',
    tags: ['stopping distance', 'braking', 'road safety', 'reaction time', 'friction', 'ice', 'wet road', 'ABS'],
    inputs: [
      {
        id: 'speed',
        label: 'Vehicle Speed',
        type: 'number',
        defaultValue: 60,
        min: 0,
        max: 200,
        step: 1,
        placeholder: 'e.g. 60',
        units: [
          { label: 'mph', value: 'mph' },
          { label: 'km/h', value: 'kmh', conversionFactor: '0.621371' },
        ],
        required: true,
      },
      {
        id: 'reactionTime',
        label: 'Reaction Time',
        type: 'select',
        options: [
          { label: '0.75 s (Alert driver)', value: '0.75' },
          { label: '1.0 s (Normal driver)', value: '1.0' },
          { label: '1.5 s (Fatigued driver)', value: '1.5' },
          { label: '2.0 s (Distracted driver)', value: '2.0' },
        ],
        defaultValue: '1.0',
        required: true,
      },
      {
        id: 'roadCondition',
        label: 'Road Condition',
        type: 'select',
        options: [
          { label: 'Dry asphalt (μ = 0.8)', value: '0.8' },
          { label: 'Wet road (μ = 0.6)', value: '0.6' },
          { label: 'Snow / slush (μ = 0.3)', value: '0.3' },
          { label: 'Black ice (μ = 0.1)', value: '0.1' },
        ],
        defaultValue: '0.8',
        required: true,
      },
    ],
    formulas: [
      // Convert mph → m/s: 1 mph = 0.44704 m/s
      {
        id: 'speedMs',
        expression: 'speed * 0.44704',
        dependencies: ['speed'],
      },
      // Reaction distance = speed (m/s) × reaction time (s)
      {
        id: 'reactionDist',
        expression: 'speedMs * reactionTime',
        dependencies: ['speedMs', 'reactionTime'],
      },
      // Braking distance = v² / (2 × g × μ)
      {
        id: 'brakingDist',
        expression: 'pow(speedMs, 2) / (2 * 9.81 * roadCondition)',
        dependencies: ['speedMs', 'roadCondition'],
      },
      {
        id: 'totalDist',
        expression: 'reactionDist + brakingDist',
        dependencies: ['reactionDist', 'brakingDist'],
      },
      {
        id: 'totalFt',
        expression: 'totalDist * 3.28084',
        dependencies: ['totalDist'],
      },
    ],
    outputs: [
      {
        id: 'out-totalDist',
        label: 'Total Stopping Distance',
        formulaRef: 'totalDist',
        format: 'number',
        precision: 1,
        suffix: ' m',
        highlight: true,
      },
      {
        id: 'out-totalFt',
        label: 'Total Stopping Distance',
        formulaRef: 'totalFt',
        format: 'number',
        precision: 0,
        suffix: ' ft',
      },
      {
        id: 'out-reactionDist',
        label: 'Reaction Distance',
        formulaRef: 'reactionDist',
        format: 'number',
        precision: 1,
        suffix: ' m',
      },
      {
        id: 'out-brakingDist',
        label: 'Braking Distance',
        formulaRef: 'brakingDist',
        format: 'number',
        precision: 1,
        suffix: ' m',
      },
    ],
    guide: {
      whatIsIt:
        "Total stopping distance has two phases: (1) Reaction distance — the distance traveled while your brain perceives danger and your foot moves to the brake pedal; (2) Braking distance — the distance traveled while the brakes bring the vehicle to a halt. It's calculated from physics: braking distance = v² ÷ (2 × g × μ), where μ is the coefficient of friction between tire and road.",
      howToUse:
        'Select your current speed, an honest estimate of your reaction time (1.0 s is standard for most drivers), and current road conditions. The total stopping distance is broken into reaction and braking components. Use this to evaluate safe following distances in different conditions.',
      exampleScenario:
        'At 60 mph (26.8 m/s), a normal driver (1.0 s reaction) on dry road stops in: 26.8 m reaction + 45.9 m braking = 72.7 m (239 ft). On ice (μ=0.1), braking distance becomes 366 m — over 8× longer. At 30 mph, braking distance is only one-quarter of the 60 mph figure, illustrating why speed limits near schools and intersections are critical.',
      proTip:
        "Braking distance scales with the square of speed — doubling your speed quadruples the braking distance. The 2-second rule (maintain a gap equal to 2 seconds of travel time) is a minimum for dry roads; extend to 4 seconds in rain and 10+ seconds on ice. ABS doesn't shorten stopping distance significantly on dry pavement but prevents wheel lock-up on slick surfaces, preserving steering control — so you can steer around an obstacle while braking hard.",
    },
    metadata: { version: '1.0.0' },
  },
];
