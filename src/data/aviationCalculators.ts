// ---------------------------------------------------------------------------
// Quantify — Aviation & Marine Calculators
// ---------------------------------------------------------------------------
// 10 calculators covering crosswind, density altitude, TAS, top of descent,
// hull speed, propeller slip, anchor rode, fuel weight, wind triangle, and
// nautical mile conversions.
// ---------------------------------------------------------------------------

import type { CalculatorSchema } from '@/types/calculator';

export const aviationCalculators: CalculatorSchema[] = [
  // =========================================================================
  // 1. Crosswind Component Calculator
  // =========================================================================
  {
    id: 'crosswind-component',
    slug: 'crosswind-component',
    title: 'Crosswind Component Calculator',
    description:
      'Calculate the crosswind and headwind components from wind speed and direction relative to the runway heading.',
    icon: '💨',
    category: 'aviation',
    subcategory: 'flight',
    tags: ['crosswind', 'headwind', 'tailwind', 'aviation', 'runway', 'wind', 'landing'],
    inputs: [
      {
        id: 'windSpeed',
        label: 'Wind Speed',
        type: 'number',
        defaultValue: 20,
        helpText: 'knots',
      },
      {
        id: 'windDirection',
        label: 'Wind Direction',
        type: 'number',
        defaultValue: 270,
        min: 0,
        max: 360,
        helpText: 'degrees FROM',
      },
      {
        id: 'runwayHeading',
        label: 'Runway Heading',
        type: 'number',
        defaultValue: 240,
        min: 0,
        max: 360,
        helpText: 'degrees',
      },
    ],
    formulas: [
      {
        id: 'angleDeg',
        expression: 'abs(windDirection - runwayHeading)',
        dependencies: ['windDirection', 'runwayHeading'],
      },
      {
        id: 'normalizedAngle',
        expression: 'angleDeg > 180 ? 360 - angleDeg : angleDeg',
        dependencies: ['angleDeg'],
      },
      {
        id: 'angleRad',
        expression: 'normalizedAngle * 3.14159265 / 180',
        dependencies: ['normalizedAngle'],
      },
      {
        id: 'crosswind',
        expression: 'windSpeed * abs(sin(angleRad))',
        dependencies: ['windSpeed', 'angleRad'],
      },
      {
        id: 'headwindRaw',
        expression: 'windSpeed * cos(angleRad)',
        dependencies: ['windSpeed', 'angleRad'],
      },
      {
        id: 'headwind',
        expression: 'headwindRaw >= 0 ? headwindRaw : 0',
        dependencies: ['headwindRaw'],
      },
      {
        id: 'tailwind',
        expression: 'headwindRaw < 0 ? abs(headwindRaw) : 0',
        dependencies: ['headwindRaw'],
      },
    ],
    outputs: [
      {
        id: 'crosswindOut',
        label: 'Crosswind Component',
        formulaRef: 'crosswind',
        precision: 1,
        suffix: ' kts',
        highlight: true,
      },
      {
        id: 'headwindOut',
        label: 'Headwind',
        formulaRef: 'headwind',
        precision: 1,
        suffix: ' kts',
      },
      {
        id: 'tailwindOut',
        label: 'Tailwind',
        formulaRef: 'tailwind',
        precision: 1,
        suffix: ' kts',
      },
    ],
    guide: {
      whatIsIt:
        'The crosswind component is the portion of wind that blows perpendicular to the runway centreline. Every aircraft has a demonstrated maximum crosswind limit (usually 10-20 kts for GA aircraft). The headwind component is the portion of wind along the runway axis that reduces groundspeed on landing, shortening the rollout distance.',
      howToUse:
        '1. Enter the reported wind speed in knots.\n2. Enter the wind direction as a magnetic bearing (from which the wind is blowing, e.g. 270 = westerly wind).\n3. Enter the runway heading in degrees (e.g. Runway 24 = 240).\n4. Read the crosswind and headwind/tailwind components from the outputs.',
      exampleScenario:
        'Wind is reported as 270 at 20 kts. You are landing on Runway 24 (heading 240). The angle between wind and runway is 30. Crosswind = 20 x sin(30) = 10 kts. Headwind = 20 x cos(30) = 17.3 kts. The crosswind is well within typical GA limits.',
      proTip:
        'The 60/40 rule provides a quick mental estimate: at a 30 degree wind angle, crosswind is approximately 50%; at 45 degrees, approximately 70%; at 60 degrees, approximately 85%. Always check your aircraft Pilot Operating Handbook (POH) for the demonstrated crosswind limit.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 2. Density Altitude Calculator
  // =========================================================================
  {
    id: 'density-altitude',
    slug: 'density-altitude',
    title: 'Density Altitude Calculator',
    description:
      'Calculate density altitude from field elevation, altimeter setting (QNH), and outside air temperature. Essential for performance calculations.',
    icon: '🌡️',
    category: 'aviation',
    subcategory: 'flight',
    tags: ['density altitude', 'pressure altitude', 'ISA', 'aviation', 'performance', 'QNH'],
    inputs: [
      {
        id: 'fieldElevationFt',
        label: 'Field Elevation',
        type: 'number',
        defaultValue: 1000,
        helpText: 'feet',
      },
      {
        id: 'qnh',
        label: 'Altimeter Setting (QNH)',
        type: 'number',
        defaultValue: 1013,
        min: 900,
        max: 1050,
        helpText: 'hPa',
      },
      {
        id: 'oatCelsius',
        label: 'Outside Air Temperature (OAT)',
        type: 'number',
        defaultValue: 30,
        helpText: 'degrees C',
      },
    ],
    formulas: [
      // Pressure Altitude = Field Elevation + 30 x (1013 - QNH)
      {
        id: 'pressureAlt',
        expression: 'fieldElevationFt + 30 * (1013 - qnh)',
        dependencies: ['fieldElevationFt', 'qnh'],
      },
      // ISA Temperature at pressure altitude: 15 - 2 C per 1000 ft
      {
        id: 'isaTemp',
        expression: '15 - 2 * (pressureAlt / 1000)',
        dependencies: ['pressureAlt'],
      },
      // Density Altitude = Pressure Altitude + 120 x (OAT - ISA Temp)
      {
        id: 'densityAlt',
        expression: 'pressureAlt + 120 * (oatCelsius - isaTemp)',
        dependencies: ['pressureAlt', 'oatCelsius', 'isaTemp'],
      },
      {
        id: 'daAbovePA',
        expression: 'densityAlt - pressureAlt',
        dependencies: ['densityAlt', 'pressureAlt'],
      },
    ],
    outputs: [
      {
        id: 'densityAltOut',
        label: 'Density Altitude',
        formulaRef: 'densityAlt',
        precision: 0,
        suffix: ' ft',
        highlight: true,
      },
      {
        id: 'pressureAltOut',
        label: 'Pressure Altitude',
        formulaRef: 'pressureAlt',
        precision: 0,
        suffix: ' ft',
      },
      {
        id: 'isaTempOut',
        label: 'ISA Temp at PA',
        formulaRef: 'isaTemp',
        precision: 1,
        suffix: ' C',
      },
    ],
    guide: {
      whatIsIt:
        'Density altitude is the altitude in the International Standard Atmosphere (ISA) that corresponds to the actual air density at your location. High density altitude means thinner air, which reduces engine power, propeller/rotor efficiency, and aerodynamic lift. Hot, high, and humid conditions create high density altitude and are the most dangerous for aircraft performance.',
      howToUse:
        '1. Enter your airport field elevation in feet.\n2. Enter the current QNH (altimeter setting) in hPa (standard = 1013 hPa).\n3. Enter the outside air temperature in degrees C.\n4. The calculator shows density altitude, pressure altitude, and the ISA standard temperature at that pressure altitude.',
      exampleScenario:
        'Departing a mountain airport at 5,500 ft on a hot day (OAT = 35 C) with QNH = 1005 hPa. Pressure altitude = 5,500 + 30 x (1013 - 1005) = 5,740 ft. ISA temp at 5,740 ft = 3.5 C. Density altitude = 5,740 + 120 x (35 - 3.5) = 9,520 ft. Your aircraft performs as if it were at 9,520 ft on a standard day.',
      proTip:
        'As a rule of thumb, density altitude increases approximately 120 ft for every 1 C above ISA. At density altitudes above 8,000 ft, most normally-aspirated piston engines lose 3-4% power per 1,000 ft, and takeoff roll can double compared to sea-level performance.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 3. True Airspeed (TAS) Calculator
  // =========================================================================
  {
    id: 'true-airspeed',
    slug: 'true-airspeed',
    title: 'True Airspeed (TAS) Calculator',
    description:
      'Convert Calibrated Airspeed (CAS) to True Airspeed (TAS) and Mach number using altitude and outside air temperature.',
    icon: '✈️',
    category: 'aviation',
    subcategory: 'flight',
    tags: ['true airspeed', 'TAS', 'CAS', 'mach', 'aviation', 'airspeed', 'IAS'],
    inputs: [
      {
        id: 'cas',
        label: 'Calibrated Airspeed (CAS)',
        type: 'number',
        defaultValue: 120,
        min: 30,
        max: 500,
        helpText: 'knots',
      },
      {
        id: 'altitudeFt',
        label: 'Pressure Altitude',
        type: 'number',
        defaultValue: 8000,
        min: 0,
        max: 51000,
        helpText: 'feet',
      },
      {
        id: 'oatCelsius',
        label: 'Outside Air Temperature (OAT)',
        type: 'number',
        defaultValue: 5,
        helpText: 'degrees C',
      },
    ],
    formulas: [
      // Pressure ratio using standard atmosphere lapse rate
      {
        id: 'pressureRatio',
        expression: 'pow(1 - 6.8755856 * 0.000001 * altitudeFt, 5.2559)',
        dependencies: ['altitudeFt'],
      },
      // Density ratio = pressure ratio / temperature ratio
      {
        id: 'densityRatio',
        expression: 'pressureRatio / ((oatCelsius + 273.15) / 288.15)',
        dependencies: ['pressureRatio', 'oatCelsius'],
      },
      // TAS = CAS / sqrt(density ratio)
      {
        id: 'tas',
        expression: 'cas / sqrt(densityRatio)',
        dependencies: ['cas', 'densityRatio'],
      },
      // Mach = TAS / speed_of_sound; a = 38.967854 x sqrt(T_Kelvin) in knots
      {
        id: 'machNumber',
        expression: 'tas / (38.967854 * sqrt(oatCelsius + 273.15))',
        dependencies: ['tas', 'oatCelsius'],
      },
    ],
    outputs: [
      {
        id: 'tasOut',
        label: 'True Airspeed',
        formulaRef: 'tas',
        precision: 1,
        suffix: ' kts',
        highlight: true,
      },
      {
        id: 'machOut',
        label: 'Mach Number',
        formulaRef: 'machNumber',
        precision: 4,
        suffix: ' M',
      },
    ],
    guide: {
      whatIsIt:
        'True Airspeed (TAS) is the actual speed of the aircraft through the air mass. At altitude, air is less dense, so the same indicated/calibrated airspeed corresponds to a higher true airspeed. TAS is used for navigation to calculate groundspeed and estimated time en route, and for fuel consumption planning.',
      howToUse:
        '1. Enter your Calibrated Airspeed (CAS) in knots.\n2. Enter your pressure altitude in feet.\n3. Enter the Outside Air Temperature (OAT) in degrees C at your cruise altitude.\n4. The calculator returns TAS in knots and your Mach number.',
      exampleScenario:
        'A Cessna 172 cruises at CAS 110 kts at 8,000 ft with OAT of 5 C. The density ratio at that altitude is approximately 0.786. TAS = 110 / sqrt(0.786) = 124 kts, about 13% faster than indicated airspeed. At this speed the Mach number is approximately M 0.19.',
      proTip:
        'A simple rule of thumb: TAS increases by roughly 2% per 1,000 ft of altitude above sea level. So at 10,000 ft, expect TAS = CAS x 1.20. For high-altitude jets, TAS can be 50-80% higher than CAS.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 4. Top of Descent (TOD) Calculator
  // =========================================================================
  {
    id: 'top-of-descent',
    slug: 'top-of-descent',
    title: 'Top of Descent (TOD) Calculator',
    description:
      'Calculate the ideal Top of Descent point, required descent rate, and time to descend for a given altitude drop and groundspeed.',
    icon: '📉',
    category: 'aviation',
    subcategory: 'flight',
    tags: ['top of descent', 'TOD', 'descent', 'VNAV', 'aviation', 'IFR', 'approach'],
    inputs: [
      {
        id: 'currentAltFt',
        label: 'Current Altitude',
        type: 'number',
        defaultValue: 15000,
        helpText: 'feet',
      },
      {
        id: 'targetAltFt',
        label: 'Target Altitude',
        type: 'number',
        defaultValue: 3000,
        helpText: 'feet',
      },
      {
        id: 'groundspeedKts',
        label: 'Groundspeed',
        type: 'number',
        defaultValue: 180,
        helpText: 'knots',
      },
      {
        id: 'descentAngle',
        label: 'Descent Angle',
        type: 'select',
        options: [
          { label: '2.5 degrees', value: '2.5' },
          { label: '3 degrees (Standard)', value: '3' },
          { label: '3.5 degrees', value: '3.5' },
          { label: '4 degrees', value: '4' },
        ],
        defaultValue: '3',
      },
    ],
    formulas: [
      {
        id: 'altToDrop',
        expression: 'currentAltFt - targetAltFt',
        dependencies: ['currentAltFt', 'targetAltFt'],
      },
      {
        id: 'angleRad',
        expression: 'descentAngle * 3.14159265 / 180',
        dependencies: ['descentAngle'],
      },
      // Horizontal distance in NM = altitude / (tan(angle) x ft-per-NM)
      {
        id: 'todNm',
        expression: 'altToDrop / (tan(angleRad) * 6076)',
        dependencies: ['altToDrop', 'angleRad'],
      },
      // Descent rate (fpm) = groundspeed (kts) x tan(angle) x 6076 / 60
      {
        id: 'descentRate',
        expression: 'groundspeedKts / 60 * tan(angleRad) * 6076',
        dependencies: ['groundspeedKts', 'angleRad'],
      },
      {
        id: 'timeToDescend',
        expression: 'altToDrop / descentRate',
        dependencies: ['altToDrop', 'descentRate'],
      },
    ],
    outputs: [
      {
        id: 'todNmOut',
        label: 'Start Descent Distance',
        formulaRef: 'todNm',
        precision: 1,
        suffix: ' NM',
        highlight: true,
      },
      {
        id: 'descentRateOut',
        label: 'Required Descent Rate',
        formulaRef: 'descentRate',
        precision: 0,
        suffix: ' fpm',
      },
      {
        id: 'timeToDescendOut',
        label: 'Time to Descend',
        formulaRef: 'timeToDescend',
        precision: 1,
        suffix: ' min',
      },
    ],
    guide: {
      whatIsIt:
        'The Top of Descent (TOD) point is where you begin your descent to arrive at a lower altitude at the correct distance from your destination. In commercial aviation, a 3 degree descent path is standard and aligns with most ILS glideslopes. Starting descent too late results in a steep uncomfortable descent; too early wastes fuel.',
      howToUse:
        '1. Enter your current cruise altitude in feet.\n2. Enter your target altitude in feet.\n3. Enter your current groundspeed in knots.\n4. Select the desired descent angle (3 degrees is standard for most approaches).\n5. The calculator shows how far from your destination to begin descending and the required vertical speed.',
      exampleScenario:
        'Cruising at FL150 (15,000 ft), targeting 3,000 ft, groundspeed 180 kts at 3 degrees. Altitude to drop = 12,000 ft. TOD distance = 12,000 / (tan(3) x 6,076) = 37.8 NM. Required descent rate = 950 fpm. Begin descending roughly 38 NM before your destination.',
      proTip:
        'The classic 3-degree rule of thumb: multiply the altitude to lose (in thousands of feet) by 3 to get the NM distance to start descent. Losing 12,000 ft means start 36 NM out. For vertical speed: multiply groundspeed by 5 to get approximate fpm at 3 degrees. At 180 kts: 180 x 5 = 900 fpm.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 5. Hull Speed Calculator
  // =========================================================================
  {
    id: 'hull-speed',
    slug: 'hull-speed',
    title: 'Hull Speed Calculator',
    description:
      'Calculate the theoretical hull speed of a displacement vessel based on waterline length using the 1.34 constant.',
    icon: '⛵',
    category: 'aviation',
    subcategory: 'marine',
    tags: ['hull speed', 'boat', 'sailing', 'displacement', 'waterline', 'marine', 'knots'],
    inputs: [
      {
        id: 'waterlineLengthFt',
        label: 'Waterline Length (LWL)',
        type: 'number',
        defaultValue: 35,
        min: 5,
        helpText: 'feet',
      },
      {
        id: 'displacement',
        label: 'Displacement',
        type: 'number',
        defaultValue: 15000,
        helpText: 'lbs',
      },
    ],
    formulas: [
      // Hull speed (knots) = 1.34 x sqrt(LWL in feet)
      {
        id: 'hullSpeedKts',
        expression: '1.34 * sqrt(waterlineLengthFt)',
        dependencies: ['waterlineLengthFt'],
      },
      {
        id: 'hullSpeedMph',
        expression: 'hullSpeedKts * 1.15078',
        dependencies: ['hullSpeedKts'],
      },
      {
        id: 'hullSpeedKph',
        expression: 'hullSpeedKts * 1.852',
        dependencies: ['hullSpeedKts'],
      },
    ],
    outputs: [
      {
        id: 'hullSpeedKtsOut',
        label: 'Hull Speed',
        formulaRef: 'hullSpeedKts',
        precision: 2,
        suffix: ' knots',
        highlight: true,
      },
      {
        id: 'hullSpeedMphOut',
        label: 'Hull Speed',
        formulaRef: 'hullSpeedMph',
        precision: 2,
        suffix: ' mph',
      },
      {
        id: 'hullSpeedKphOut',
        label: 'Hull Speed',
        formulaRef: 'hullSpeedKph',
        precision: 2,
        suffix: ' km/h',
      },
    ],
    guide: {
      whatIsIt:
        'Hull speed is the theoretical maximum speed of a displacement vessel. The formula is: Hull Speed (kts) = 1.34 x sqrt(LWL in feet), where LWL is the waterline length. Beyond this speed, the boat must climb its own bow wave, requiring exponentially more power. This formula comes from the relationship between wave speed and wavelength in water.',
      howToUse:
        '1. Enter the waterline length (LWL) of your vessel in feet. This is the length measured at the waterline, not the overall length.\n2. Enter the displacement in pounds.\n3. The result shows hull speed in knots, mph, and km/h.',
      exampleScenario:
        'A classic sloop with a 35-ft waterline. Hull speed = 1.34 x sqrt(35) = 1.34 x 5.916 = 7.93 knots. This is a typical cruising speed for a well-found 40-ft sailing yacht. Pushing beyond 8 kts requires significantly more engine power and fuel.',
      proTip:
        'The 1.34 constant applies to hulls in salt water. In fresh water, use 1.32. Modern light-displacement and semi-planing hulls can exceed hull speed, as can narrow hulls (canoes, kayaks) and multi-hulls (catamarans). A speed-to-length ratio (V / sqrt(LWL)) above 1.34 indicates the hull is operating in semi-planing or planing mode.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 6. Boat Propeller Slip Calculator
  // =========================================================================
  {
    id: 'propeller-slip',
    slug: 'propeller-slip',
    title: 'Boat Propeller Slip Calculator',
    description:
      'Calculate propeller slip percentage — the difference between theoretical and actual boat speed. Useful for diagnosing prop sizing and engine loading.',
    icon: '🚤',
    category: 'aviation',
    subcategory: 'marine',
    tags: ['propeller', 'slip', 'boat', 'RPM', 'pitch', 'marine', 'outboard', 'inboard'],
    inputs: [
      {
        id: 'propPitch',
        label: 'Propeller Pitch',
        type: 'number',
        defaultValue: 21,
        helpText: 'inches',
      },
      {
        id: 'rpm',
        label: 'Engine RPM (WOT)',
        type: 'number',
        defaultValue: 4000,
        helpText: 'Wide-open throttle RPM',
      },
      {
        id: 'actualSpeedKts',
        label: 'Actual Boat Speed',
        type: 'number',
        defaultValue: 22,
        helpText: 'knots',
      },
    ],
    formulas: [
      // Theoretical speed (kts) = RPM x pitch(in) / 720.25
      {
        id: 'theoreticalKts',
        expression: 'rpm * propPitch / 720.25',
        dependencies: ['rpm', 'propPitch'],
      },
      // Slip (%) = (theoretical - actual) / theoretical x 100
      {
        id: 'slipPercent',
        expression: '((theoreticalKts - actualSpeedKts) / theoreticalKts) * 100',
        dependencies: ['theoreticalKts', 'actualSpeedKts'],
      },
      {
        id: 'theoreticalMph',
        expression: 'theoreticalKts * 1.15078',
        dependencies: ['theoreticalKts'],
      },
    ],
    outputs: [
      {
        id: 'slipPercentOut',
        label: 'Propeller Slip',
        formulaRef: 'slipPercent',
        precision: 1,
        suffix: '%',
        highlight: true,
      },
      {
        id: 'theoreticalKtsOut',
        label: 'Theoretical Speed',
        formulaRef: 'theoreticalKts',
        precision: 1,
        suffix: ' kts',
      },
      {
        id: 'theoreticalMphOut',
        label: 'Theoretical Speed',
        formulaRef: 'theoreticalMph',
        precision: 1,
        suffix: ' mph',
      },
    ],
    guide: {
      whatIsIt:
        'Propeller slip is the percentage difference between the theoretical distance a propeller should travel through the water (based on pitch and RPM) versus the actual distance it travels. A perfectly rigid non-compressible fluid would yield 0% slip, but real props always slip. Typical slip is 5-15% for well-matched installations.',
      howToUse:
        '1. Enter the propeller pitch in inches (stamped on the prop hub or in your engine specs).\n2. Enter the wide-open throttle (WOT) RPM from a sea trial.\n3. Enter the actual GPS boat speed in knots at WOT.\n4. The result shows slip percentage and theoretical speed.',
      exampleScenario:
        'A 21-pitch prop at 4,000 RPM gives theoretical speed = 4000 x 21 / 720.25 = 116.6 kts theoretical. With an actual speed of 22 kts, slip = (116.6 - 22) / 116.6 x 100 = 81%. This example shows the formula in action — real boats in mph would use the mph conversion factor in the divisor for their specific application.',
      proTip:
        'Most outboard manufacturers recommend 5-7% slip for performance boats and 10-15% for heavy cruisers. If slip is too high (over 20%), try increasing prop pitch by 2 inches. Each 2 inches of pitch reduces WOT RPM by approximately 400 RPM and increases theoretical speed.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 7. Anchor Rode Length Calculator
  // =========================================================================
  {
    id: 'anchor-rode',
    slug: 'anchor-rode',
    title: 'Anchor Rode Length Calculator',
    description:
      'Calculate the recommended anchor rode (scope) for safe holding based on water depth, freeboard, and sea conditions.',
    icon: '⚓',
    category: 'aviation',
    subcategory: 'marine',
    tags: ['anchor', 'rode', 'scope', 'marine', 'anchoring', 'sailing', 'boating'],
    inputs: [
      {
        id: 'waterDepthFt',
        label: 'Water Depth',
        type: 'number',
        defaultValue: 15,
        min: 1,
        helpText: 'feet at anchor drop point',
      },
      {
        id: 'freeboardFt',
        label: 'Freeboard (bow height)',
        type: 'number',
        defaultValue: 4,
        helpText: 'feet above water to bow roller',
      },
      {
        id: 'conditions',
        label: 'Conditions / Scope Ratio',
        type: 'select',
        options: [
          { label: 'Fair Weather (5:1)', value: '5' },
          { label: 'Normal (7:1)', value: '7' },
          { label: 'Storm (10:1)', value: '10' },
        ],
        defaultValue: '7',
      },
    ],
    formulas: [
      {
        id: 'totalDepth',
        expression: 'waterDepthFt + freeboardFt',
        dependencies: ['waterDepthFt', 'freeboardFt'],
      },
      {
        id: 'minRode',
        expression: 'totalDepth * conditions',
        dependencies: ['totalDepth', 'conditions'],
      },
      {
        id: 'minRodeFair',
        expression: 'totalDepth * 5',
        dependencies: ['totalDepth'],
      },
      {
        id: 'minRodeStorm',
        expression: 'totalDepth * 10',
        dependencies: ['totalDepth'],
      },
    ],
    outputs: [
      {
        id: 'minRodeOut',
        label: 'Recommended Rode',
        formulaRef: 'minRode',
        precision: 0,
        suffix: ' ft',
        highlight: true,
      },
      {
        id: 'minRodeFairOut',
        label: 'Fair Weather (5:1)',
        formulaRef: 'minRodeFair',
        precision: 0,
        suffix: ' ft',
      },
      {
        id: 'minRodeStormOut',
        label: 'Storm (10:1)',
        formulaRef: 'minRodeStorm',
        precision: 0,
        suffix: ' ft',
      },
    ],
    guide: {
      whatIsIt:
        'Anchor scope is the ratio of anchor rode (chain + rope) paid out to the total vertical distance from bow roller to seabed. A higher scope keeps the anchor chain more horizontal, which improves holding dramatically. Scope 5:1 is acceptable in calm weather; 7:1 is the cruising standard; 10:1 or more in heavy weather.',
      howToUse:
        '1. Enter the water depth at your anchoring spot in feet.\n2. Enter your bow freeboard (height of your bow roller above the waterline) in feet.\n3. Select your conditions to get the recommended scope.\n4. The calculator shows how much rode to deploy for each scenario.',
      exampleScenario:
        'Anchoring in 15 ft of water with a 4 ft freeboard. Total depth = 19 ft. At normal scope (7:1): 19 x 7 = 133 ft of rode. At storm scope (10:1): 190 ft. Always allow extra chain to pay out if conditions deteriorate overnight.',
      proTip:
        'All-chain rode requires less scope than rope because the chain weight creates a catenary curve that absorbs shock loads. With all-chain, 4:1 scope in calm weather is often sufficient. Rope-and-chain combinations need closer to 7:1. Add a snubber to reduce shock loading on the windlass in any conditions.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 8. Aviation Fuel Weight Calculator
  // =========================================================================
  {
    id: 'aviation-fuel-weight',
    slug: 'aviation-fuel-weight',
    title: 'Aviation Fuel Weight Calculator',
    description:
      'Convert aviation fuel volume to weight in pounds and kilograms for Avgas, Jet-A, JP-8, and Mogas.',
    icon: '⛽',
    category: 'aviation',
    subcategory: 'flight',
    tags: ['fuel', 'weight', 'avgas', 'jet-a', 'aviation', 'weight and balance', 'pounds', 'gallons'],
    inputs: [
      {
        id: 'fuelType',
        label: 'Fuel Type',
        type: 'select',
        options: [
          { label: 'Avgas 100LL (6.02 lbs/gal)', value: '6.02' },
          { label: 'Jet-A (6.80 lbs/gal)', value: '6.80' },
          { label: 'JP-8 Military (6.70 lbs/gal)', value: '6.70' },
          { label: 'Mogas (6.15 lbs/gal)', value: '6.15' },
        ],
        defaultValue: '6.02',
      },
      {
        id: 'quantity',
        label: 'Fuel Quantity',
        type: 'number',
        defaultValue: 50,
        helpText: 'US Gallons',
      },
    ],
    formulas: [
      // Weight (lbs) = quantity (gal) x density (lbs/gal)
      {
        id: 'weightLbs',
        expression: 'quantity * fuelType',
        dependencies: ['quantity', 'fuelType'],
      },
      {
        id: 'weightKg',
        expression: 'weightLbs * 0.453592',
        dependencies: ['weightLbs'],
      },
      // Convert US gallons to liters (1 US gal = 3.78541 L)
      {
        id: 'litersVol',
        expression: 'quantity / 0.264172',
        dependencies: ['quantity'],
      },
    ],
    outputs: [
      {
        id: 'weightLbsOut',
        label: 'Fuel Weight',
        formulaRef: 'weightLbs',
        precision: 1,
        suffix: ' lbs',
        highlight: true,
      },
      {
        id: 'weightKgOut',
        label: 'Fuel Weight',
        formulaRef: 'weightKg',
        precision: 1,
        suffix: ' kg',
      },
      {
        id: 'litersVolOut',
        label: 'Volume',
        formulaRef: 'litersVol',
        precision: 1,
        suffix: ' L',
      },
    ],
    guide: {
      whatIsIt:
        'Aviation fuel density varies by fuel type and temperature. Using volume alone is insufficient for weight-and-balance calculations — you must convert gallons to pounds. The standard densities used in aviation are: Avgas 100LL = 6.02 lbs/gal (6 lbs/gal is the common approximation), Jet-A = 6.80 lbs/gal, JP-8 = 6.70 lbs/gal, Mogas = 6.15 lbs/gal.',
      howToUse:
        '1. Select your fuel type from the dropdown.\n2. Enter the fuel quantity in US gallons.\n3. The calculator shows weight in pounds, kilograms, and equivalent liters.',
      exampleScenario:
        'A Cessna 172 has 53 gallons of Avgas 100LL. Weight = 53 x 6.02 = 319 lbs (145 kg). This is critical for weight-and-balance. Adding 319 lbs of fuel at the wing station affects both total weight and centre-of-gravity position.',
      proTip:
        'Fuel density changes with temperature: cold fuel is denser, warm fuel is lighter. In very cold climates, Avgas density can be up to 6.10 lbs/gal; in hot climates, as low as 5.93 lbs/gal. For precise weight-and-balance, always check the actual density from fuelling records.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 9. Wind Triangle Calculator
  // =========================================================================
  {
    id: 'wind-triangle',
    slug: 'wind-triangle',
    title: 'Wind Triangle Calculator',
    description:
      'Calculate groundspeed using the wind triangle — accounting for TAS, wind direction, and wind speed to find your actual groundspeed.',
    icon: '🧭',
    category: 'aviation',
    subcategory: 'navigation',
    tags: ['wind triangle', 'groundspeed', 'navigation', 'aviation', 'ETE', 'heading', 'WCA'],
    inputs: [
      {
        id: 'trueCourse',
        label: 'True Course',
        type: 'number',
        defaultValue: 90,
        min: 0,
        max: 360,
        helpText: 'degrees',
      },
      {
        id: 'tas',
        label: 'True Airspeed (TAS)',
        type: 'number',
        defaultValue: 120,
        helpText: 'knots',
      },
      {
        id: 'windDirection',
        label: 'Wind Direction',
        type: 'number',
        defaultValue: 270,
        min: 0,
        max: 360,
        helpText: 'degrees FROM',
      },
      {
        id: 'windSpeed',
        label: 'Wind Speed',
        type: 'number',
        defaultValue: 20,
        helpText: 'knots',
      },
    ],
    formulas: [
      // Angle between wind vector and course in radians (wind correction angle basis)
      {
        id: 'wcaRad',
        expression: '(windDirection - trueCourse + 180) * 3.14159265 / 180',
        dependencies: ['windDirection', 'trueCourse'],
      },
      // Groundspeed via law of cosines on wind triangle
      {
        id: 'groundspeed',
        expression: 'sqrt(pow(tas, 2) + pow(windSpeed, 2) - 2 * tas * windSpeed * cos(wcaRad))',
        dependencies: ['tas', 'windSpeed', 'wcaRad'],
      },
      // Headwind/tailwind component along course (positive = headwind, negative = tailwind)
      {
        id: 'headwindComponent',
        expression: 'windSpeed * cos(wcaRad)',
        dependencies: ['windSpeed', 'wcaRad'],
      },
      // ETE in minutes for 100 NM at calculated groundspeed
      {
        id: 'eteAt100nm',
        expression: '100 / groundspeed * 60',
        dependencies: ['groundspeed'],
      },
    ],
    outputs: [
      {
        id: 'groundspeedOut',
        label: 'Groundspeed',
        formulaRef: 'groundspeed',
        precision: 1,
        suffix: ' kts',
        highlight: true,
      },
      {
        id: 'headwindComponentOut',
        label: 'Headwind / Tailwind',
        formulaRef: 'headwindComponent',
        precision: 1,
        suffix: ' kts',
      },
      {
        id: 'eteAt100nmOut',
        label: 'ETE for 100 NM',
        formulaRef: 'eteAt100nm',
        precision: 1,
        suffix: ' min',
      },
    ],
    guide: {
      whatIsIt:
        'The wind triangle is a vector diagram that relates true course, true airspeed (TAS), wind direction/speed, and groundspeed. By resolving these vectors, pilots can compute their actual groundspeed for fuel and ETE calculations. A positive headwind component reduces groundspeed; a tailwind increases it.',
      howToUse:
        '1. Enter your desired True Course in degrees.\n2. Enter your aircraft True Airspeed in knots.\n3. Enter the forecast wind direction (the direction FROM which the wind blows) in degrees.\n4. Enter the wind speed in knots.\n5. Read off groundspeed and ETE per 100 NM.',
      exampleScenario:
        'Flying true course 090 (eastbound) at TAS 120 kts. Wind from 270 at 20 kts (direct tailwind). Groundspeed = sqrt(120^2 + 20^2 - 2 x 120 x 20 x cos(180)) = sqrt(14400 + 400 + 4800) = sqrt(19600) = 140 kts. ETE for 100 NM = 100/140 x 60 = 43 minutes.',
      proTip:
        'A direct headwind or tailwind gives the pure wind component. Any crosswind angle reduces the effective groundspeed change but adds a wind correction angle. The maximum headwind effect occurs at 0/180 degrees; the maximum crosswind effect occurs at 90 degrees. Use the 1-in-60 rule: 1 degree of heading error results in 1 NM off track for every 60 NM flown.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 10. Nautical Miles Converter
  // =========================================================================
  {
    id: 'nautical-miles',
    slug: 'nautical-miles',
    title: 'Nautical Miles Converter',
    description:
      'Convert between nautical miles, statute miles, and kilometers. Also calculates travel time at a given speed.',
    icon: '🗺️',
    category: 'aviation',
    subcategory: 'navigation',
    tags: ['nautical miles', 'NM', 'kilometers', 'statute miles', 'distance', 'navigation', 'ETE'],
    inputs: [
      {
        id: 'distance',
        label: 'Distance',
        type: 'number',
        defaultValue: 100,
      },
      {
        id: 'fromUnit',
        label: 'From Unit',
        type: 'select',
        options: [
          { label: 'Nautical Miles (NM)', value: '1' },
          { label: 'Statute Miles (mi)', value: '0.868976' },
          { label: 'Kilometers (km)', value: '0.539957' },
        ],
        defaultValue: '1',
      },
      {
        id: 'speed',
        label: 'Speed',
        type: 'number',
        defaultValue: 120,
        helpText: 'Used to calculate travel time (knots)',
      },
    ],
    formulas: [
      // Convert input distance to nautical miles
      {
        id: 'nm',
        expression: 'distance * fromUnit',
        dependencies: ['distance', 'fromUnit'],
      },
      // 1 NM = 1.15078 statute miles
      {
        id: 'statuteMiles',
        expression: 'nm * 1.15078',
        dependencies: ['nm'],
      },
      // 1 NM = 1.852 km
      {
        id: 'kilometers',
        expression: 'nm * 1.852',
        dependencies: ['nm'],
      },
      // Travel time in minutes
      {
        id: 'travelTimeMin',
        expression: '(nm / speed) * 60',
        dependencies: ['nm', 'speed'],
      },
    ],
    outputs: [
      {
        id: 'nmOut',
        label: 'Nautical Miles',
        formulaRef: 'nm',
        precision: 2,
        suffix: ' NM',
        highlight: true,
      },
      {
        id: 'statuteMilesOut',
        label: 'Statute Miles',
        formulaRef: 'statuteMiles',
        precision: 2,
        suffix: ' mi',
      },
      {
        id: 'kilometersOut',
        label: 'Kilometers',
        formulaRef: 'kilometers',
        precision: 2,
        suffix: ' km',
      },
      {
        id: 'travelTimeMinOut',
        label: 'Travel Time',
        formulaRef: 'travelTimeMin',
        precision: 1,
        suffix: ' min',
      },
    ],
    guide: {
      whatIsIt:
        'A nautical mile (NM) is defined as exactly 1,852 metres, corresponding to one arcminute of latitude along any meridian. This makes it the natural unit for navigation — a chart latitude scale directly gives nautical miles. 1 NM = 1.15078 statute miles = 1.852 km. Knots are nautical miles per hour.',
      howToUse:
        '1. Enter the distance value.\n2. Select what unit that distance is in (NM, statute miles, or kilometers).\n3. Enter your speed in knots for the travel time calculation.\n4. All three distance equivalents and estimated travel time are shown instantly.',
      exampleScenario:
        'A flight plan shows 450 km direct distance. Select Kilometers, enter 450. Result: 450 km = 243 NM = 280 statute miles. At 120 kts groundspeed, ETE = 243/120 x 60 = 121.5 minutes (about 2 hours 1 minute).',
      proTip:
        'For quick mental conversion: NM x 1.15 = statute miles; NM x 1.85 = km. Going the other way: km divided by 1.85 = NM; statute miles divided by 1.15 = NM. Pilots use the rule that 1 degree of latitude = 60 NM, so crossing 5 degrees of latitude means roughly 300 NM flown along a meridian.',
    },
    metadata: { version: '1.0.0' },
  },
];
