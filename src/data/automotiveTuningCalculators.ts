// ---------------------------------------------------------------------------
// Quantify � Automotive Tuning Calculators
// ---------------------------------------------------------------------------
// 10 calculators covering tire sizing, gear ratios, compression ratio,
// injector duty cycle, fuel blending, wheel offset, brake bias, spring rate,
// EV battery degradation, and turbo boost estimation.
// ---------------------------------------------------------------------------

import type { CalculatorSchema } from '@/types/calculator';

export const automotiveTuningCalculators: CalculatorSchema[] = [
  // =========================================================================
  // 1. Tire Plus-Sizing & Speedometer Error
  // =========================================================================
  {
    id: 'tire-plus-sizing-calculator',
    slug: 'tire-plus-sizing-calculator',
    title: 'Tire Plus-Sizing & Speedometer Error',
    description:
      'Compare stock and new tire sizes to calculate overall diameter change, speedometer error percentage, and whether your plus-sized fitment is within safe tolerance.',
    icon: '🛞',
    category: 'automotive',
    subcategory: 'tuning',
    tags: ['tire', 'plus sizing', 'speedometer', 'wheel', 'diameter', 'fitment', 'tuning'],
    inputs: [
      {
        id: 'stockWidth',
        label: 'Stock Tire Width (mm)',
        type: 'number',
        defaultValue: 225,
        min: 100,
        max: 400,
        step: 5,
        placeholder: 'e.g. 225',
        required: true,
      },
      {
        id: 'stockAspect',
        label: 'Stock Aspect Ratio',
        type: 'number',
        defaultValue: 45,
        min: 20,
        max: 90,
        step: 5,
        placeholder: 'e.g. 45',
        required: true,
      },
      {
        id: 'stockRim',
        label: 'Stock Rim (inches)',
        type: 'number',
        defaultValue: 17,
        min: 10,
        max: 30,
        step: 1,
        placeholder: 'e.g. 17',
        required: true,
      },
      {
        id: 'newWidth',
        label: 'New Tire Width (mm)',
        type: 'number',
        defaultValue: 235,
        min: 100,
        max: 400,
        step: 5,
        placeholder: 'e.g. 235',
        required: true,
      },
      {
        id: 'newAspect',
        label: 'New Aspect Ratio',
        type: 'number',
        defaultValue: 40,
        min: 20,
        max: 90,
        step: 5,
        placeholder: 'e.g. 40',
        required: true,
      },
      {
        id: 'newRim',
        label: 'New Rim (inches)',
        type: 'number',
        defaultValue: 18,
        min: 10,
        max: 30,
        step: 1,
        placeholder: 'e.g. 18',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'stockSidewallMm',
        expression: 'stockWidth * stockAspect / 100',
        dependencies: ['stockWidth', 'stockAspect'],
      },
      {
        id: 'stockDiameterMm',
        expression: 'stockRim * 25.4 + 2 * stockSidewallMm',
        dependencies: ['stockRim', 'stockSidewallMm'],
      },
      {
        id: 'newSidewallMm',
        expression: 'newWidth * newAspect / 100',
        dependencies: ['newWidth', 'newAspect'],
      },
      {
        id: 'newDiameterMm',
        expression: 'newRim * 25.4 + 2 * newSidewallMm',
        dependencies: ['newRim', 'newSidewallMm'],
      },
      {
        id: 'diameterDiff',
        expression: 'newDiameterMm - stockDiameterMm',
        dependencies: ['newDiameterMm', 'stockDiameterMm'],
      },
      {
        id: 'speedoError',
        expression: '(newDiameterMm - stockDiameterMm) / stockDiameterMm * 100',
        dependencies: ['newDiameterMm', 'stockDiameterMm'],
      },
    ],
    outputs: [
      {
        id: 'out-stockDiameterMm',
        label: 'Stock OD',
        formulaRef: 'stockDiameterMm',
        format: 'number',
        precision: 1,
        suffix: ' mm',
      },
      {
        id: 'out-newDiameterMm',
        label: 'New OD',
        formulaRef: 'newDiameterMm',
        format: 'number',
        precision: 1,
        suffix: ' mm',
      },
      {
        id: 'out-speedoError',
        label: 'Speedometer Error',
        formulaRef: 'speedoError',
        format: 'number',
        precision: 2,
        suffix: '%',
        highlight: true,
      },
      {
        id: 'out-diameterDiff',
        label: 'Diameter Change',
        formulaRef: 'diameterDiff',
        format: 'number',
        precision: 1,
        suffix: ' mm',
      },
    ],
    guide: {
      whatIsIt:
        'Tire plus-sizing is the practice of fitting a larger rim diameter with a lower-profile tire to maintain a similar overall diameter. This improves handling (stiffer sidewall) and aesthetics. The speedometer error calculator reveals how much your instrument reading drifts when the rolling circumference changes.',
      howToUse:
        'Enter the three-part size codes for both your stock and new tires (width in mm, aspect ratio, rim diameter in inches). The calculator computes overall diameter for each and shows the percentage difference � which directly equals your speedometer error. A positive value means your speedometer reads low (you are going faster than indicated).',
      exampleScenario:
        'Upgrading from 225/45R17 (636.1 mm OD) to 235/40R18 (648.2 mm OD) gives a +12.1 mm diameter change and +1.9% speedometer error. At an indicated 100 km/h, you are actually doing 101.9 km/h � within the �3% tolerance most OEMs consider safe for ABS and ESC.',
      proTip:
        'Keep speedometer error within �3% to avoid ABS and traction control calibration issues. Many ECUs can be recalibrated via OBD software to correct the speedo after a tire size change. Plus-sizing beyond +1 rim inch typically requires fender clearance and offset checks to prevent rubbing.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 2. Gear Ratio & RPM to Speed
  // =========================================================================
  {
    id: 'gear-ratio-speed-calculator',
    slug: 'gear-ratio-speed-calculator',
    title: 'Gear Ratio & RPM to Speed',
    description:
      'Calculate vehicle speed at a given RPM for any gear ratio and final drive combination, in both mph and km/h.',
    icon: '⚙',
    category: 'automotive',
    subcategory: 'tuning',
    tags: ['gear ratio', 'RPM', 'speed', 'final drive', 'transmission', 'tuning', 'drivetrain'],
    inputs: [
      {
        id: 'rpm',
        label: 'Engine RPM',
        type: 'number',
        defaultValue: 3000,
        min: 100,
        max: 12000,
        step: 100,
        placeholder: 'e.g. 3000',
        required: true,
      },
      {
        id: 'gearRatio',
        label: 'Gear Ratio (e.g. 3.2:1)',
        type: 'number',
        defaultValue: 3.2,
        min: 0.5,
        max: 6,
        step: 0.01,
        placeholder: 'e.g. 3.2',
        required: true,
      },
      {
        id: 'finalDrive',
        label: 'Final Drive Ratio',
        type: 'number',
        defaultValue: 3.73,
        min: 1,
        max: 8,
        step: 0.01,
        placeholder: 'e.g. 3.73',
        required: true,
      },
      {
        id: 'tireDiameterInch',
        label: 'Tire Overall Diameter (inches)',
        type: 'number',
        defaultValue: 26,
        min: 10,
        max: 40,
        step: 0.1,
        placeholder: 'e.g. 26',
        helpText: 'Overall diameter of the tire in inches � calculate using the Tire Size calculator.',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'speedMph',
        expression: 'rpm * tireDiameterInch * 3.1416 / (gearRatio * finalDrive * 336)',
        dependencies: ['rpm', 'tireDiameterInch', 'gearRatio', 'finalDrive'],
      },
      {
        id: 'speedKph',
        expression: 'speedMph * 1.60934',
        dependencies: ['speedMph'],
      },
    ],
    outputs: [
      {
        id: 'out-speedMph',
        label: 'Speed at RPM',
        formulaRef: 'speedMph',
        format: 'number',
        precision: 1,
        suffix: ' mph',
        highlight: true,
      },
      {
        id: 'out-speedKph',
        label: 'Speed (km/h)',
        formulaRef: 'speedKph',
        format: 'number',
        precision: 1,
        suffix: ' km/h',
      },
    ],
    guide: {
      whatIsIt:
        'The gear ratio and RPM to speed calculator tells you exactly how fast your vehicle is moving at a given engine speed in any gear. It accounts for the transmission gear ratio, final drive (differential) ratio, and tire diameter � the complete drivetrain multiplication chain.',
      howToUse:
        'Enter the engine RPM (e.g. peak power RPM), the transmission gear ratio (from your gearbox specification sheet), the final drive ratio (usually printed on the axle or in the service manual), and your tire\'s overall diameter in inches. Speed is computed in both mph and km/h.',
      exampleScenario:
        'A car at 3,000 RPM in 3rd gear (ratio 3.2:1) with a 3.73 final drive and 26-inch tires: speed = 3000 x 26 x 3.1416 / (3.2 x 3.73 x 336) = 57.8 mph (93 km/h). At redline 7,000 RPM, that same gear gives 134.9 mph � useful for identifying gear changes at a track.',
      proTip:
        'Shorter final drive ratios (higher numbers, e.g. 4.10 vs 3.27) improve acceleration but hurt top speed and fuel economy. Use this calculator to build a full RPM-vs-speed chart for each gear and identify where power band overlap occurs between gears � the optimal shift point is where the higher gear enters the power band.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 3. Engine Compression Ratio Calculator
  // =========================================================================
  {
    id: 'engine-compression-ratio',
    slug: 'engine-compression-ratio',
    title: 'Engine Compression Ratio Calculator',
    description:
      'Calculate an engine\'s static compression ratio from cylinder bore, stroke, clearance volume, head gasket volume, and piston dome or dish volume.',
    icon: '💥',
    category: 'automotive',
    subcategory: 'tuning',
    tags: ['compression ratio', 'engine', 'bore', 'stroke', 'TDC', 'head gasket', 'piston', 'tuning'],
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
        required: true,
      },
      {
        id: 'clearanceVolume',
        label: 'Clearance Volume (cc)',
        type: 'number',
        defaultValue: 40,
        min: 1,
        step: 0.1,
        placeholder: 'e.g. 40',
        helpText: 'Volume at TDC including combustion chamber. Measured by cc\'ing the head.',
        required: true,
      },
      {
        id: 'headGasketVolume',
        label: 'Head Gasket Volume (cc)',
        type: 'number',
        defaultValue: 8,
        min: 0,
        step: 0.1,
        placeholder: 'e.g. 8',
        helpText: 'Calculated from bore diameter and compressed gasket thickness.',
        required: true,
      },
      {
        id: 'pistonDome',
        label: 'Piston Dome/Dish (+dish/-dome, cc)',
        type: 'number',
        defaultValue: 0,
        step: 0.1,
        placeholder: 'e.g. 0',
        helpText: 'Positive value for a dish (adds volume), negative for a dome (reduces volume).',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'displacement',
        expression: '3.14159 * pow(bore / 2, 2) * stroke / 1000',
        dependencies: ['bore', 'stroke'],
      },
      {
        id: 'totalClearance',
        expression: 'clearanceVolume + headGasketVolume + pistonDome',
        dependencies: ['clearanceVolume', 'headGasketVolume', 'pistonDome'],
      },
      {
        id: 'compressionRatio',
        expression: '(displacement + totalClearance) / totalClearance',
        dependencies: ['displacement', 'totalClearance'],
      },
    ],
    outputs: [
      {
        id: 'out-displacement',
        label: 'Cylinder Displacement',
        formulaRef: 'displacement',
        format: 'number',
        precision: 1,
        suffix: ' cc',
      },
      {
        id: 'out-compressionRatio',
        label: 'Compression Ratio',
        formulaRef: 'compressionRatio',
        format: 'number',
        precision: 2,
        suffix: ':1',
        highlight: true,
      },
    ],
    guide: {
      whatIsIt:
        'Static compression ratio (CR) is the ratio of cylinder volume at bottom dead centre (BDC) to cylinder volume at top dead centre (TDC). Higher CR increases thermal efficiency and power, but demands higher-octane fuel to prevent detonation. CR = (swept volume + clearance volume) / clearance volume.',
      howToUse:
        'Enter bore and stroke in mm, then the measured combustion chamber volume (clearance volume) in cc. Add the head gasket compressed volume (calculate from bore area x gasket thickness). For piston shape: enter a positive number for a dished piston (adds clearance volume) or a negative number for a domed piston (reduces it).',
      exampleScenario:
        'An 86 mm bore x 86 mm stroke cylinder displaces 499.2 cc. With 40 cc combustion chamber, 8 cc head gasket, and flat-top piston (0 cc): total clearance = 48 cc. CR = (499.2 + 48) / 48 = 11.4:1 � appropriate for 91+ octane premium fuel in a naturally aspirated engine.',
      proTip:
        'Turbocharged and supercharged engines run lower CR (8:1�9:1) because boost pressure multiplies the effective compression ratio at full throttle. A rough rule: each 1 psi of boost is equivalent to raising CR by ~0.3 points. Use this calculator to simulate the effect of milling the head (reducing clearance volume) or changing piston type.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 4. Injector Duty Cycle Calculator
  // =========================================================================
  {
    id: 'injector-duty-cycle',
    slug: 'injector-duty-cycle',
    title: 'Injector Duty Cycle Calculator',
    description:
      'Calculate fuel injector duty cycle at target horsepower to verify injector sizing and avoid fuel starvation � critical for high-performance and forced-induction builds.',
    icon: '⚡',
    category: 'automotive',
    subcategory: 'tuning',
    tags: ['injector', 'duty cycle', 'fuel', 'horsepower', 'BSFC', 'AFR', 'tuning', 'forced induction'],
    inputs: [
      {
        id: 'hp',
        label: 'Target Horsepower (HP)',
        type: 'number',
        defaultValue: 300,
        min: 50,
        step: 10,
        placeholder: 'e.g. 300',
        required: true,
      },
      {
        id: 'numInjectors',
        label: 'Number of Injectors',
        type: 'number',
        defaultValue: 4,
        min: 1,
        max: 16,
        step: 1,
        placeholder: 'e.g. 4',
        required: true,
      },
      {
        id: 'bsfc',
        label: 'BSFC (lb/hp/hr)',
        type: 'number',
        defaultValue: 0.5,
        min: 0.3,
        max: 1,
        step: 0.01,
        placeholder: 'e.g. 0.5',
        helpText: 'Naturally aspirated: 0.45�0.55. Forced induction: 0.55�0.65. Methanol: 0.8�1.0.',
        required: true,
      },
      {
        id: 'injectorRating',
        label: 'Injector Rating (cc/min)',
        type: 'number',
        defaultValue: 550,
        min: 100,
        max: 3000,
        step: 10,
        placeholder: 'e.g. 550',
        required: true,
      },
      {
        id: 'afr',
        label: 'Target AFR',
        type: 'number',
        defaultValue: 12.5,
        min: 8,
        max: 20,
        step: 0.1,
        placeholder: 'e.g. 12.5',
        helpText: 'Air-fuel ratio. Stoichiometric gasoline = 14.7. Power AFR = 12.0�12.8.',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'fuelFlowLbHr',
        expression: 'hp * bsfc',
        dependencies: ['hp', 'bsfc'],
      },
      {
        id: 'fuelFlowCcMin',
        expression: 'fuelFlowLbHr * 6289.81 / (numInjectors * 60)',
        dependencies: ['fuelFlowLbHr', 'numInjectors'],
      },
      {
        id: 'dutyCycle',
        expression: 'fuelFlowCcMin / injectorRating * 100',
        dependencies: ['fuelFlowCcMin', 'injectorRating'],
      },
    ],
    outputs: [
      {
        id: 'out-fuelFlowLbHr',
        label: 'Total Fuel Flow',
        formulaRef: 'fuelFlowLbHr',
        format: 'number',
        precision: 2,
        suffix: ' lb/hr total',
      },
      {
        id: 'out-dutyCycle',
        label: 'Injector Duty Cycle',
        formulaRef: 'dutyCycle',
        format: 'number',
        precision: 1,
        suffix: '%',
        highlight: true,
      },
    ],
    guide: {
      whatIsIt:
        'Injector duty cycle (IDC) is the percentage of time an injector is open during each engine cycle. An IDC of 80% means the injector fires for 80% of available time. Above 80�85%, the injector cannot close fully, losing precise fuel control and risking a lean condition � a potentially engine-destroying outcome.',
      howToUse:
        'Enter your target horsepower, number of injectors, brake specific fuel consumption (BSFC � a measure of engine fuel efficiency), injector flow rate in cc/min (stamped on the injector or in the datasheet), and target AFR. The result tells you whether your current injectors can safely support the power level.',
      exampleScenario:
        'A 300 HP engine with 4 x 550 cc/min injectors at 0.5 BSFC: total fuel flow = 150 lb/hr = 6,289 cc/min total, or 1,572 cc/min per injector. Duty cycle = 1,572 / 550 = 286% � far over 100%. You actually need injectors rated at minimum 1,572 / 0.80 = ~1,965 cc/min each, or more injectors.',
      proTip:
        'Target a maximum IDC of 80% at peak power to maintain a safety margin. Always use injectors rated at least 25% above the calculated requirement. Note that injector flow ratings are at a specific fuel pressure (typically 43.5 psi / 3 bar) � increasing fuel pressure increases flow proportionally to the square root of the pressure ratio.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 5. Fuel Octane Blending (E85) Calculator
  // =========================================================================
  {
    id: 'fuel-octane-mix-calculator',
    slug: 'fuel-octane-mix-calculator',
    title: 'Fuel Octane Blending (E85) Calculator',
    description:
      'Calculate how much E85 to add to a partially filled fuel tank to achieve a target blended octane rating for performance tuning.',
    icon: '⛽',
    category: 'automotive',
    subcategory: 'tuning',
    tags: ['E85', 'octane', 'fuel blending', 'flex fuel', 'ethanol', 'pump gas', 'tuning'],
    inputs: [
      {
        id: 'tankSize',
        label: 'Tank Size (L)',
        type: 'number',
        defaultValue: 60,
        min: 10,
        max: 200,
        step: 1,
        placeholder: 'e.g. 60',
        required: true,
      },
      {
        id: 'currentFuelL',
        label: 'Fuel Already in Tank (L)',
        type: 'number',
        defaultValue: 20,
        min: 0,
        step: 0.5,
        placeholder: 'e.g. 20',
        required: true,
      },
      {
        id: 'currentOctane',
        label: 'Current Fuel Octane',
        type: 'number',
        defaultValue: 95,
        min: 80,
        max: 120,
        step: 0.5,
        placeholder: 'e.g. 95',
        required: true,
      },
      {
        id: 'targetOctane',
        label: 'Target Blended Octane',
        type: 'number',
        defaultValue: 100,
        min: 80,
        max: 120,
        step: 0.5,
        placeholder: 'e.g. 100',
        required: true,
      },
      {
        id: 'e85Octane',
        label: 'E85 Octane',
        type: 'number',
        defaultValue: 105,
        min: 95,
        max: 115,
        step: 0.5,
        placeholder: 'e.g. 105',
        helpText: 'E85 octane typically ranges 100�108 depending on blend. Check your local fuel.',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'currentVolume',
        expression: 'currentFuelL',
        dependencies: ['currentFuelL'],
      },
      {
        id: 'currentOctaneContrib',
        expression: 'currentVolume * currentOctane',
        dependencies: ['currentVolume', 'currentOctane'],
      },
      {
        id: 'e85Needed',
        expression: '(targetOctane * tankSize - currentOctaneContrib) / (e85Octane - currentOctane * (1 - currentFuelL / tankSize))',
        dependencies: ['targetOctane', 'tankSize', 'currentOctaneContrib', 'e85Octane', 'currentOctane', 'currentFuelL'],
      },
      {
        id: 'e85Capped',
        expression: 'min(e85Needed, tankSize - currentFuelL)',
        dependencies: ['e85Needed', 'tankSize', 'currentFuelL'],
      },
    ],
    outputs: [
      {
        id: 'out-e85Capped',
        label: 'E85 to Add',
        formulaRef: 'e85Capped',
        format: 'number',
        precision: 1,
        suffix: ' L',
        highlight: true,
      },
      {
        id: 'out-e85Needed',
        label: 'E85 Needed (uncapped)',
        formulaRef: 'e85Needed',
        format: 'number',
        precision: 1,
        suffix: ' L',
      },
    ],
    guide: {
      whatIsIt:
        'Octane blending allows performance tuners on flex-fuel setups to dial in a specific octane rating by mixing pump E85 with regular gasoline. Since octane blends linearly by volume, simple algebra determines how much E85 to add to an existing tank of pump gas to hit a target octane.',
      howToUse:
        'Enter your tank size, how much fuel is currently in the tank and its octane rating, your target blended octane, and the E85 octane at your station (check the pump or a fuel test kit). The result is the volume of E85 to add � capped at the remaining tank capacity.',
      exampleScenario:
        'A 60 L tank with 20 L of 95 RON pump gas, targeting 100 RON with E85 rated at 105: the formula calculates ~26.7 L of E85 to add. Adding 26.7 L to the existing 20 L leaves 13.3 L of headroom. The final blend is 46.7 L at approximately 100 RON.',
      proTip:
        'E85 octane varies significantly by season and region (ethanol content ranges 51�83%). Use a fuel ethanol content analyzer (flex fuel sensor) for precision tuning. Always verify the blend with a refractometer or inline sensor before making aggressive timing advances � incorrect octane assumption is a common cause of engine knock damage.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 6. Wheel Offset & Backspacing Calculator
  // =========================================================================
  {
    id: 'wheel-offset-backspacing',
    slug: 'wheel-offset-backspacing',
    title: 'Wheel Offset & Backspacing Calculator',
    description:
      'Convert between wheel offset (ET), backspacing, and centerline position to predict how a wheel will sit relative to the hub and fender.',
    icon: '🚗',
    category: 'automotive',
    subcategory: 'tuning',
    tags: ['wheel offset', 'ET', 'backspacing', 'wheel fitment', 'stance', 'clearance', 'tuning'],
    inputs: [
      {
        id: 'wheelWidth',
        label: 'Wheel Width (inches)',
        type: 'number',
        defaultValue: 9,
        min: 4,
        max: 20,
        step: 0.5,
        placeholder: 'e.g. 9',
        required: true,
      },
      {
        id: 'offset',
        label: 'Offset (ET/mm)',
        type: 'number',
        defaultValue: 35,
        min: -80,
        max: 80,
        step: 1,
        placeholder: 'e.g. 35',
        helpText: 'Positive ET = wheel pushed inward (toward car). Negative ET = pushed outward (poke).',
        required: true,
      },
      {
        id: 'hubFlangeMm',
        label: 'Hub Flange Thickness (mm)',
        type: 'number',
        defaultValue: 70,
        min: 10,
        max: 150,
        step: 1,
        placeholder: 'e.g. 70',
        helpText: 'Distance from the mounting face to the inside of the wheel well. Varies by vehicle.',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'wheelWidthMm',
        expression: 'wheelWidth * 25.4',
        dependencies: ['wheelWidth'],
      },
      {
        id: 'backspacing',
        expression: '(wheelWidthMm / 2 + offset + hubFlangeMm) / 25.4',
        dependencies: ['wheelWidthMm', 'offset', 'hubFlangeMm'],
      },
      {
        id: 'trackChange',
        expression: 'offset',
        dependencies: ['offset'],
      },
      {
        id: 'centerline',
        expression: 'wheelWidthMm / 2',
        dependencies: ['wheelWidthMm'],
      },
    ],
    outputs: [
      {
        id: 'out-backspacing',
        label: 'Backspacing',
        formulaRef: 'backspacing',
        format: 'number',
        precision: 2,
        suffix: ' inches',
        highlight: true,
      },
      {
        id: 'out-trackChange',
        label: 'ET/Offset',
        formulaRef: 'trackChange',
        format: 'number',
        precision: 0,
        suffix: ' mm from stock (if offset changed)',
      },
      {
        id: 'out-centerline',
        label: 'Wheel Centerline from Hub',
        formulaRef: 'centerline',
        format: 'number',
        precision: 1,
        suffix: ' mm',
      },
    ],
    guide: {
      whatIsIt:
        'Wheel offset (ET, from German "Einpresstiefe" = insertion depth) is the distance in mm from the wheel\'s mounting face to its geometric centerline. Positive ET pushes the wheel inward; negative ET pushes it outward (creating "poke" or "stance"). Backspacing is the distance from the mounting face to the inner lip, measured in inches.',
      howToUse:
        'Enter your wheel width in inches, the ET offset in mm (found stamped on the back of the wheel), and your vehicle\'s hub flange thickness. The calculator converts between ET and backspacing, and shows the wheel centerline position � essential for checking inner clearance to suspension components.',
      exampleScenario:
        'A 9-inch wide wheel with ET35 and a 70 mm hub flange: wheel width in mm = 228.6 mm, centerline = 114.3 mm. Backspacing = (114.3 + 35 + 70) / 25.4 = 8.63 inches. If going from ET35 to ET20 on the same wheel, the wheel moves 15 mm outward � check for fender clearance.',
      proTip:
        'A useful rule: each 5 mm reduction in ET moves the wheel 5 mm outward and inward simultaneously (the wheel pivots around the hub). Check both fender clearance at the outer lip AND suspension/caliper clearance at the inner barrel before ordering wheels. Many fitment databases (e.g. Fitment Industries) list safe ET ranges per vehicle.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 7. Brake Bias Calculator
  // =========================================================================
  {
    id: 'brake-bias-calculator',
    slug: 'brake-bias-calculator',
    title: 'Brake Bias Calculator',
    description:
      'Calculate the front/rear brake bias percentage from master cylinder bore sizes and caliper piston areas to optimize braking balance for performance or track use.',
    icon: '🏁',
    category: 'automotive',
    subcategory: 'tuning',
    tags: ['brake bias', 'master cylinder', 'caliper', 'braking', 'track', 'performance', 'tuning'],
    inputs: [
      {
        id: 'frontCylinderBore',
        label: 'Front Master Cylinder Bore (mm)',
        type: 'number',
        defaultValue: 25.4,
        min: 10,
        max: 50,
        step: 0.1,
        placeholder: 'e.g. 25.4',
        required: true,
      },
      {
        id: 'rearCylinderBore',
        label: 'Rear Master Cylinder Bore (mm)',
        type: 'number',
        defaultValue: 22.2,
        min: 10,
        max: 50,
        step: 0.1,
        placeholder: 'e.g. 22.2',
        required: true,
      },
      {
        id: 'frontCaliper',
        label: 'Front Caliper Piston Area (cm�)',
        type: 'number',
        defaultValue: 60,
        min: 5,
        max: 200,
        step: 0.5,
        placeholder: 'e.g. 60',
        required: true,
      },
      {
        id: 'rearCaliper',
        label: 'Rear Caliper Piston Area (cm�)',
        type: 'number',
        defaultValue: 35,
        min: 5,
        max: 200,
        step: 0.5,
        placeholder: 'e.g. 35',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'frontMCArea',
        expression: '3.14159 * pow(frontCylinderBore / 2, 2)',
        dependencies: ['frontCylinderBore'],
      },
      {
        id: 'rearMCArea',
        expression: '3.14159 * pow(rearCylinderBore / 2, 2)',
        dependencies: ['rearCylinderBore'],
      },
      {
        id: 'frontForce',
        expression: 'frontMCArea * frontCaliper',
        dependencies: ['frontMCArea', 'frontCaliper'],
      },
      {
        id: 'rearForce',
        expression: 'rearMCArea * rearCaliper',
        dependencies: ['rearMCArea', 'rearCaliper'],
      },
      {
        id: 'frontBias',
        expression: 'frontForce / (frontForce + rearForce) * 100',
        dependencies: ['frontForce', 'rearForce'],
      },
      {
        id: 'rearBias',
        expression: '100 - frontBias',
        dependencies: ['frontBias'],
      },
    ],
    outputs: [
      {
        id: 'out-frontBias',
        label: 'Front Brake Bias',
        formulaRef: 'frontBias',
        format: 'number',
        precision: 1,
        suffix: '%',
        highlight: true,
      },
      {
        id: 'out-rearBias',
        label: 'Rear Brake Bias',
        formulaRef: 'rearBias',
        format: 'number',
        precision: 1,
        suffix: '%',
      },
    ],
    guide: {
      whatIsIt:
        'Brake bias is the proportion of total braking force applied to the front versus rear axle. During hard braking, weight transfers forward, increasing front tire grip. Optimal bias matches this weight transfer � typically 60�70% front for road cars. Too much rear bias causes oversteer (rear lockup); too little causes understeer and front lockup.',
      howToUse:
        'Enter the master cylinder bore diameters (front and rear circuits in a dual-circuit system or balance bar setup) and the total caliper piston area for each axle (sum of all piston areas on that axle). The bias calculation computes hydraulic force multiplication through the entire circuit.',
      exampleScenario:
        'Front MC bore 25.4 mm (area 507 mm2) driving 60 cm2 calipers = force factor 30,420. Rear MC bore 22.2 mm (area 387 mm2) driving 35 cm2 calipers = force factor 13,548. Front bias = 30,420 / (30,420 + 13,548) = 69.2% � well-balanced for a performance road car.',
      proTip:
        'On track cars with an adjustable brake bias bar, target 58�65% front bias as a starting point and adjust based on driver feedback. A driver experiencing rear lockup should increase front bias (move bar forward). Install brake bias adjustment accessible from the cockpit so the driver can fine-tune between sessions as fuel load and tire wear change balance.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 8. Spring Rate & Wheel Rate Calculator
  // =========================================================================
  {
    id: 'spring-rate-calculator',
    slug: 'spring-rate-calculator',
    title: 'Spring Rate & Wheel Rate Calculator',
    description:
      'Calculate the effective wheel rate from spring rate, motion ratio, and installation angle � essential for suspension tuning and natural frequency calculations.',
    icon: '🌀',
    category: 'automotive',
    subcategory: 'tuning',
    tags: ['spring rate', 'wheel rate', 'motion ratio', 'suspension', 'coilover', 'corner weight', 'tuning'],
    inputs: [
      {
        id: 'springRate',
        label: 'Spring Rate (N/mm)',
        type: 'number',
        defaultValue: 200,
        min: 10,
        max: 2000,
        step: 5,
        placeholder: 'e.g. 200',
        required: true,
      },
      {
        id: 'motionRatio',
        label: 'Motion Ratio',
        type: 'number',
        defaultValue: 0.85,
        min: 0.1,
        max: 1.5,
        step: 0.01,
        placeholder: 'e.g. 0.85',
        helpText: 'Ratio of wheel travel to spring travel. Coilover at wheel = ~1.0. Double wishbone = 0.7�0.9.',
        required: true,
      },
      {
        id: 'installAngle',
        label: 'Spring Install Angle (degrees)',
        type: 'number',
        defaultValue: 10,
        min: 0,
        max: 45,
        step: 0.5,
        placeholder: 'e.g. 10',
        helpText: 'Angle from vertical. 0 degrees = perfectly vertical. Typically 5�15 degrees.',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'wheelRate',
        expression: 'springRate * pow(motionRatio, 2) * pow(cos(installAngle * 3.14159 / 180), 2)',
        dependencies: ['springRate', 'motionRatio', 'installAngle'],
      },
    ],
    outputs: [
      {
        id: 'out-wheelRate',
        label: 'Effective Wheel Rate',
        formulaRef: 'wheelRate',
        format: 'number',
        precision: 1,
        suffix: ' N/mm',
        highlight: true,
      },
    ],
    guide: {
      whatIsIt:
        'Wheel rate (also called "wheel centre rate") is the effective spring stiffness measured at the wheel contact patch � what the tire actually feels. It differs from spring rate because of the mechanical disadvantage (motion ratio) of the suspension geometry and the cosine effect of the spring installation angle.',
      howToUse:
        'Enter the spring rate (measured or from the spring manufacturer in N/mm), the motion ratio (measured by jacking the wheel and measuring spring travel vs wheel travel), and the spring installation angle from vertical. Wheel rate = Spring Rate x Motion Ratio� x cos�(angle).',
      exampleScenario:
        'A 200 N/mm spring with a motion ratio of 0.85 and 10-degree installation angle: wheel rate = 200 x 0.85� x cos�(10�) = 200 x 0.7225 x 0.9698 = 140.2 N/mm. The suspension geometry and angle together reduce the wheel rate by nearly 30% from the spring label rate.',
      proTip:
        'Use wheel rate (not spring rate) to calculate suspension natural frequency: Fn = (1/2p) � v(wheel rate / corner mass). Target 1.0�1.5 Hz for comfort, 1.5�2.5 Hz for sport, and 2.5�4.0 Hz for track use. Lower natural frequency than the body roll frequency will cause "push" understeer in fast corners.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 9. EV Battery Degradation Calculator
  // =========================================================================
  {
    id: 'ev-battery-degradation',
    slug: 'ev-battery-degradation',
    title: 'EV Battery Degradation Calculator',
    description:
      'Estimate remaining battery capacity and range reduction for an electric vehicle based on age and usage pattern.',
    icon: '⚡',
    category: 'automotive',
    subcategory: 'vehicle',
    tags: ['EV', 'electric vehicle', 'battery', 'degradation', 'range', 'capacity', 'kWh'],
    inputs: [
      {
        id: 'initialCapacity',
        label: 'Initial Battery Capacity (kWh)',
        type: 'number',
        defaultValue: 75,
        min: 10,
        max: 250,
        step: 0.5,
        placeholder: 'e.g. 75',
        required: true,
      },
      {
        id: 'ageYears',
        label: 'Vehicle Age (years)',
        type: 'number',
        defaultValue: 5,
        min: 0,
        max: 30,
        step: 0.5,
        placeholder: 'e.g. 5',
        required: true,
      },
      {
        id: 'annualDegradation',
        label: 'Degradation Rate',
        type: 'select',
        options: [
          { label: 'Optimal (1.5%/yr)', value: '1.5' },
          { label: 'Average (2.3%/yr)', value: '2.3' },
          { label: 'Heavy use (3.5%/yr)', value: '3.5' },
        ],
        defaultValue: '2.3',
        required: true,
      },
      {
        id: 'odometer',
        label: 'Odometer (km)',
        type: 'number',
        defaultValue: 80000,
        min: 0,
        step: 1000,
        placeholder: 'e.g. 80000',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'remainingCapacity',
        expression: 'initialCapacity * pow(1 - annualDegradation / 100, ageYears)',
        dependencies: ['initialCapacity', 'annualDegradation', 'ageYears'],
      },
      {
        id: 'degradedPct',
        expression: '(1 - remainingCapacity / initialCapacity) * 100',
        dependencies: ['remainingCapacity', 'initialCapacity'],
      },
      {
        id: 'rangeReduction',
        expression: '(1 - remainingCapacity / initialCapacity) * 100',
        dependencies: ['remainingCapacity', 'initialCapacity'],
      },
    ],
    outputs: [
      {
        id: 'out-remainingCapacity',
        label: 'Remaining Capacity',
        formulaRef: 'remainingCapacity',
        format: 'number',
        precision: 2,
        suffix: ' kWh',
        highlight: true,
      },
      {
        id: 'out-degradedPct',
        label: 'Capacity Lost',
        formulaRef: 'degradedPct',
        format: 'number',
        precision: 1,
        suffix: '%',
      },
      {
        id: 'out-rangeReduction',
        label: 'Range Reduction',
        formulaRef: 'rangeReduction',
        format: 'number',
        precision: 1,
        suffix: '%',
      },
    ],
    guide: {
      whatIsIt:
        'EV battery degradation is the gradual reduction in a lithium-ion battery\'s maximum charge capacity over time and charging cycles. It follows a roughly exponential decay pattern � faster in the early years, slowing as the battery ages. Capacity loss directly translates to reduced driving range.',
      howToUse:
        'Enter the vehicle\'s original EPA-rated battery capacity, its age in years, and select a degradation scenario. "Optimal" reflects ideal charging habits (20�80% SoC, moderate temperatures, slow charging). "Heavy use" reflects frequent DC fast charging, extreme temperatures, and high SoC storage.',
      exampleScenario:
        'A 5-year-old EV with a 75 kWh pack degrading at the average rate of 2.3%/yr: remaining capacity = 75 x (1 - 0.023)^5 = 75 x 0.891 = 66.8 kWh � a 10.9% loss. If the car originally offered 400 km of range, it now delivers approximately 356 km.',
      proTip:
        'The single best practice to slow EV battery degradation is to keep state of charge between 20% and 80% for daily use, only charging to 100% before long trips. Avoiding frequent DC fast charging adds years to battery life. Many manufacturers offer battery health warranties (e.g. 70% capacity at 8 years / 100,000 miles) � check yours.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 10. Turbo Boost & Power Gain Estimator
  // =========================================================================
  {
    id: 'turbo-boost-pressure-calculator',
    slug: 'turbo-boost-pressure-calculator',
    title: 'Turbo Boost & Power Gain Estimator',
    description:
      'Estimate airflow in CFM and approximate horsepower output from a turbocharged engine based on boost pressure, displacement, volumetric efficiency, and peak RPM.',
    icon: '💨',
    category: 'automotive',
    subcategory: 'tuning',
    tags: ['turbo', 'boost', 'horsepower', 'CFM', 'airflow', 'forced induction', 'supercharger', 'tuning'],
    inputs: [
      {
        id: 'engineDisplacementL',
        label: 'Engine Displacement (L)',
        type: 'number',
        defaultValue: 2,
        min: 0.5,
        max: 10,
        step: 0.1,
        placeholder: 'e.g. 2',
        required: true,
      },
      {
        id: 'boostPsi',
        label: 'Boost Pressure (psi)',
        type: 'number',
        defaultValue: 15,
        min: 0,
        max: 60,
        step: 0.5,
        placeholder: 'e.g. 15',
        required: true,
      },
      {
        id: 'volumetricEfficiency',
        label: 'Volumetric Efficiency %',
        type: 'number',
        defaultValue: 85,
        min: 50,
        max: 110,
        step: 1,
        placeholder: 'e.g. 85',
        helpText: 'Stock engines: 75�90%. Well-ported head with cam: 90�100%. Race engine: 100�110%.',
        required: true,
      },
      {
        id: 'atmosphericPsi',
        label: 'Atmospheric Pressure (psi)',
        type: 'number',
        defaultValue: 14.7,
        min: 10,
        max: 16,
        step: 0.1,
        placeholder: 'e.g. 14.7',
        helpText: 'Sea level = 14.7 psi. Reduce by ~0.5 psi per 1,000 ft (300 m) elevation.',
        required: true,
      },
      {
        id: 'rpm',
        label: 'Peak RPM',
        type: 'number',
        defaultValue: 5000,
        min: 1000,
        max: 12000,
        step: 100,
        placeholder: 'e.g. 5000',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'pressureRatio',
        expression: '(boostPsi + atmosphericPsi) / atmosphericPsi',
        dependencies: ['boostPsi', 'atmosphericPsi'],
      },
      {
        id: 'airflowCfm',
        expression: 'engineDisplacementL * 61.02 * rpm / 3456 * volumetricEfficiency / 100 * pressureRatio',
        dependencies: ['engineDisplacementL', 'rpm', 'volumetricEfficiency', 'pressureRatio'],
      },
      {
        id: 'estimatedHP',
        expression: 'airflowCfm * 6.4',
        dependencies: ['airflowCfm'],
      },
    ],
    outputs: [
      {
        id: 'out-pressureRatio',
        label: 'Pressure Ratio',
        formulaRef: 'pressureRatio',
        format: 'number',
        precision: 2,
      },
      {
        id: 'out-airflowCfm',
        label: 'Airflow',
        formulaRef: 'airflowCfm',
        format: 'number',
        precision: 0,
        suffix: ' CFM',
      },
      {
        id: 'out-estimatedHP',
        label: 'Estimated Horsepower',
        formulaRef: 'estimatedHP',
        format: 'number',
        precision: 0,
        suffix: ' HP (est.)',
        highlight: true,
      },
    ],
    guide: {
      whatIsIt:
        'Turbo boost pressure determines how much additional air a forced-induction engine ingests above atmospheric pressure. More air means more fuel can be burned, producing more power. This calculator uses airflow (CFM = cubic feet per minute) as the intermediary � a useful figure for turbo compressor map selection.',
      howToUse:
        'Enter engine displacement in litres, the target boost pressure in psi (gauge pressure, as read on a boost gauge), estimated volumetric efficiency, sea-level atmospheric pressure (14.7 psi unless at altitude), and peak power RPM. The formula computes the pressure ratio, resulting airflow, and an estimated crank horsepower.',
      exampleScenario:
        'A 2.0L engine at 5,000 RPM with 15 psi boost, 85% VE, and 14.7 psi atmosphere: pressure ratio = (15 + 14.7) / 14.7 = 2.02. Airflow = 2.0 x 61.02 x 5000 / 3456 x 0.85 x 2.02 = 303 CFM. Estimated HP = 303 x 6.4 = ~194 HP � a rough estimate for initial turbo selection.',
      proTip:
        'Use this result to locate the operating point on a turbo compressor map: plot your airflow (lb/min � multiply CFM by 0.069 for air density) against pressure ratio. The point should fall within the turbo\'s efficiency island, ideally between 70�76% efficiency. A turbo that is too small will surge; one too large will lag badly and run inefficiently.',
    },
    metadata: { version: '1.0.0' },
  },
];
