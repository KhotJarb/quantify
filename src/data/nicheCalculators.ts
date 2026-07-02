// ---------------------------------------------------------------------------
// Quantify â€” Niche Calculators
// ---------------------------------------------------------------------------
// 10 unique calculators spanning astronomy, radio, physics, household utility,
// lifestyle, solar geometry, pool chemistry, woodworking, water conservation,
// and generational wealth planning.
// ---------------------------------------------------------------------------

import type { CalculatorSchema } from '@/types/calculator';

export const nicheCalculators: CalculatorSchema[] = [
  // =========================================================================
  // 1. Telescope Magnification Calculator
  // =========================================================================
  {
    id: 'telescope-magnification',
    slug: 'telescope-magnification',
    title: 'Telescope Magnification Calculator',
    description:
      'Calculate telescope magnification, maximum useful power, exit pupil, and true field of view from focal lengths and aperture.',
    icon: '🔭',
    category: 'science',
    subcategory: 'astronomy',
    tags: ['telescope', 'magnification', 'eyepiece', 'aperture', 'astronomy', 'exit pupil', 'field of view', 'optics'],
    inputs: [
      {
        id: 'focalLengthTelescope',
        label: 'Telescope Focal Length',
        type: 'number',
        defaultValue: 1000,
        min: 50,
        step: 1,
        placeholder: 'e.g. 1000',
        helpText: 'Telescope focal length in mm (from specs).',
        units: [{ label: 'mm', value: 'mm' }],
        required: true,
      },
      {
        id: 'focalLengthEyepiece',
        label: 'Eyepiece Focal Length',
        type: 'number',
        defaultValue: 25,
        min: 1,
        step: 1,
        placeholder: 'e.g. 25',
        helpText: 'Eyepiece focal length in mm.',
        units: [{ label: 'mm', value: 'mm' }],
        required: true,
      },
      {
        id: 'telescopeAperture',
        label: 'Telescope Aperture (Objective Diameter)',
        type: 'number',
        defaultValue: 100,
        min: 10,
        step: 1,
        placeholder: 'e.g. 100',
        helpText: 'Objective lens or mirror diameter in mm.',
        units: [{ label: 'mm', value: 'mm' }],
        required: true,
      },
    ],
    formulas: [
      {
        id: 'magnification',
        expression: 'focalLengthTelescope / focalLengthEyepiece',
        dependencies: ['focalLengthTelescope', 'focalLengthEyepiece'],
      },
      {
        id: 'maxUsefulMagnification',
        expression: 'telescopeAperture * 2',
        dependencies: ['telescopeAperture'],
      },
      {
        id: 'exitPupil',
        expression: 'telescopeAperture / magnification',
        dependencies: ['telescopeAperture', 'magnification'],
      },
      {
        // True FOV â‰ˆ Apparent FOV (eyepiece) / magnification; assume 50Â° AFOV eyepiece
        id: 'trueFOV_approx',
        expression: '50 / magnification',
        dependencies: ['magnification'],
      },
    ],
    outputs: [
      {
        id: 'magnificationOut',
        label: 'Magnification',
        formulaRef: 'magnification',
        format: 'number',
        precision: 1,
        highlight: true,
        suffix: 'x',
      },
      {
        id: 'maxUsefulMagnificationOut',
        label: 'Max Useful Magnification',
        formulaRef: 'maxUsefulMagnification',
        format: 'number',
        precision: 0,
        suffix: 'x maximum useful',
      },
      {
        id: 'exitPupilOut',
        label: 'Exit Pupil',
        formulaRef: 'exitPupil',
        format: 'number',
        precision: 2,
        suffix: ' mm exit pupil',
      },
      {
        id: 'trueFOV_approxOut',
        label: 'True Field of View (approx. 50Â° AFOV eyepiece)',
        formulaRef: 'trueFOV_approx',
        format: 'number',
        precision: 2,
        suffix: 'Â° true field of view',
      },
    ],
    guide: {
      whatIsIt:
        'Telescope magnification is determined by dividing the telescope focal length by the eyepiece focal length. The exit pupil, maximum useful magnification, and true field of view are derived from aperture and magnification to reveal practical viewing limits.',
      howToUse:
        "Enter your telescope's focal length and aperture (both found on the telescope body or manual), then enter the eyepiece focal length (printed on the eyepiece barrel). The calculator instantly shows magnification, whether it exceeds the useful maximum, and the resulting exit pupil and field of view.",
      exampleScenario:
        'A 1000 mm focal length, 100 mm aperture refractor with a 25 mm eyepiece gives 40x magnification. Max useful power is 200x. Exit pupil is 2.5 mm â€” ideal for dark skies. True FOV is 1.25Â° (assuming 50Â° AFOV eyepiece), enough to frame open clusters like the Pleiades.',
      proTip:
        'The "rule of thumb" maximum useful magnification is 2x aperture in mm (or 50x per inch). Above that, turbulent atmosphere smears fine detail. An exit pupil above 7 mm wastes light as it exceeds the dark-adapted eye pupil. Optimal exit pupil for deep-sky observing is 3-5 mm; for planets, 0.5-1.5 mm. Try 10 mm, 25 mm, and 6 mm eyepieces to cover low, medium, and high power.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 2. Ham Radio Antenna Length Calculator
  // =========================================================================
  {
    id: 'ham-antenna-length',
    slug: 'ham-antenna-length',
    title: 'Ham Radio Antenna Length Calculator',
    description:
      'Calculate the physical length of dipole, vertical, and loop antennas for any amateur radio frequency, accounting for velocity factor.',
    icon: '📡',
    category: 'tech',
    subcategory: 'networking',
    tags: ['ham radio', 'antenna', 'dipole', 'vertical', 'wavelength', 'frequency', 'amateur radio', 'RF', 'SWR'],
    inputs: [
      {
        id: 'frequencyMHz',
        label: 'Operating Frequency',
        type: 'number',
        defaultValue: 144,
        min: 0.1,
        step: 0.1,
        placeholder: 'e.g. 144',
        helpText: 'Operating frequency in MHz.',
        units: [{ label: 'MHz', value: 'MHz' }],
        required: true,
      },
      {
        id: 'antennaType',
        label: 'Antenna Type',
        type: 'select',
        defaultValue: '0.4839',
        options: [
          { label: 'Half-wave Dipole (Î»/2)', value: '0.4839' },
          { label: 'Quarter-wave Vertical (Î»/4)', value: '0.2419' },
          { label: '5/8-wave Vertical', value: '0.5350' },
          { label: 'Full-wave Loop (Î»)', value: '0.9678' },
        ],
        helpText: 'Select the antenna configuration. The factor shown is relative to a free-space wavelength.',
        required: true,
      },
      {
        id: 'velocityFactor',
        label: 'Velocity Factor',
        type: 'number',
        defaultValue: 0.95,
        min: 0.6,
        max: 1.0,
        step: 0.01,
        placeholder: 'e.g. 0.95',
        helpText: 'Velocity factor of the wire/conductor. Bare copper wire ~0.95-0.98; coaxial cable ~0.66-0.82.',
        required: true,
      },
    ],
    formulas: [
      {
        // Speed of light = 299.792 Mm/s â†’ Î» (m) = 299.792 / f(MHz)
        id: 'speedOfLight',
        expression: '299.792',
        dependencies: [],
      },
      {
        id: 'wavelengthM',
        expression: 'speedOfLight / frequencyMHz',
        dependencies: ['speedOfLight', 'frequencyMHz'],
      },
      {
        id: 'antennaLengthM',
        expression: 'wavelengthM * antennaType * velocityFactor',
        dependencies: ['wavelengthM', 'antennaType', 'velocityFactor'],
      },
      {
        id: 'antennaLengthFt',
        expression: 'antennaLengthM * 3.28084',
        dependencies: ['antennaLengthM'],
      },
      {
        id: 'antennaLengthIn',
        expression: 'antennaLengthFt * 12',
        dependencies: ['antennaLengthFt'],
      },
    ],
    outputs: [
      {
        id: 'antennaLengthMOut',
        label: 'Antenna Length (metres)',
        formulaRef: 'antennaLengthM',
        format: 'number',
        precision: 3,
        highlight: true,
        suffix: ' m',
      },
      {
        id: 'antennaLengthFtOut',
        label: 'Antenna Length (feet)',
        formulaRef: 'antennaLengthFt',
        format: 'number',
        precision: 2,
        suffix: ' ft',
      },
      {
        id: 'antennaLengthInOut',
        label: 'Antenna Length (inches total)',
        formulaRef: 'antennaLengthIn',
        format: 'number',
        precision: 1,
        suffix: ' in total',
      },
    ],
    guide: {
      whatIsIt:
        "A resonant antenna's physical length depends on the operating frequency, the fraction of a wavelength required for the antenna type (e.g., Î»/2 for a dipole), and the velocity factor of the conductor â€” the ratio of signal propagation speed in the medium to the speed of light in free space.",
      howToUse:
        'Enter your target frequency in MHz, choose the antenna type, and adjust the velocity factor if needed. The result is the total physical length to cut. For a dipole, divide the result by 2 for each leg.',
      exampleScenario:
        'Building a 2-metre (144 MHz) half-wave dipole from bare copper wire (VF ~0.95): Î» = 299.792 / 144 â‰ˆ 2.082 m. Half-wave factor â‰ˆ 0.4839. Total length â‰ˆ 2.082 Ã— 0.4839 Ã— 0.95 â‰ˆ 0.957 m (95.7 cm), so each leg is ~47.8 cm.',
      proTip:
        'Always cut your antenna slightly long (add ~2-3%) and trim toward resonance while checking SWR with an antenna analyser. Velocity factor varies with conductor diameter and insulation; bare wire is closest to 0.95-0.98. Common HF bands: 40 m (7 MHz), 20 m (14 MHz), 10 m (28 MHz). VHF: 2 m (144 MHz), 70 cm (432 MHz).',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 3. Lightning Distance Calculator (Flash-to-Bang)
  // =========================================================================
  {
    id: 'lightning-distance',
    slug: 'lightning-distance',
    title: 'Lightning Distance Calculator (Flash-to-Bang)',
    description:
      'Determine how far away a lightning strike is by timing the gap between the flash and thunder, corrected for air temperature.',
    icon: '⚡',
    category: 'science',
    subcategory: 'physics',
    tags: ['lightning', 'thunder', 'speed of sound', 'storm', 'weather', 'safety', 'flash to bang', 'distance'],
    inputs: [
      {
        id: 'secondsBetween',
        label: 'Seconds Between Flash and Thunder',
        type: 'number',
        defaultValue: 5,
        min: 0.5,
        step: 0.5,
        placeholder: 'e.g. 5',
        helpText: 'Seconds between lightning flash and thunder clap. Count "one-one-thousand, two-one-thousand..."',
        units: [{ label: 'seconds', value: 's' }],
        required: true,
      },
      {
        id: 'temperatureC',
        label: 'Air Temperature',
        type: 'number',
        defaultValue: 20,
        min: -40,
        max: 50,
        step: 1,
        placeholder: 'e.g. 20',
        helpText: 'Air temperature affects the speed of sound (warmer air = faster sound).',
        units: [{ label: 'Â°C', value: 'C' }],
        required: true,
      },
    ],
    formulas: [
      {
        // Speed of sound (m/s) = 331.3 Ã— âˆš(1 + T/273.15)
        id: 'speedOfSoundMs',
        expression: '331.3 * sqrt(1 + temperatureC / 273.15)',
        dependencies: ['temperatureC'],
      },
      {
        id: 'distanceM',
        expression: 'speedOfSoundMs * secondsBetween',
        dependencies: ['speedOfSoundMs', 'secondsBetween'],
      },
      {
        id: 'distanceKm',
        expression: 'distanceM / 1000',
        dependencies: ['distanceM'],
      },
      {
        id: 'distanceMiles',
        expression: 'distanceKm * 0.621371',
        dependencies: ['distanceKm'],
      },
      {
        // safeZone: 0 = seek shelter (< 3 km), 1 = relatively safe (>= 3 km)
        id: 'safeZone',
        expression: 'distanceKm < 3 ? 0 : 1',
        dependencies: ['distanceKm'],
      },
    ],
    outputs: [
      {
        id: 'distanceKmOut',
        label: 'Distance to Lightning Strike',
        formulaRef: 'distanceKm',
        format: 'number',
        precision: 2,
        highlight: true,
        suffix: ' km',
      },
      {
        id: 'distanceMilesOut',
        label: 'Distance (miles)',
        formulaRef: 'distanceMiles',
        format: 'number',
        precision: 2,
        suffix: ' miles',
      },
      {
        id: 'speedOfSoundMsOut',
        label: 'Speed of Sound at Current Temperature',
        formulaRef: 'speedOfSoundMs',
        format: 'number',
        precision: 1,
        suffix: ' m/s speed of sound',
      },
      {
        id: 'safeZoneOut',
        label: 'Safety Assessment (1 = safe >3 km, 0 = seek shelter)',
        formulaRef: 'safeZone',
        format: 'number',
        precision: 0,
        suffix: ' (1=safe >3km, 0=seek shelter)',
      },
    ],
    guide: {
      whatIsIt:
        'Lightning and thunder happen simultaneously, but light travels almost instantly while sound travels at ~343 m/s. By counting the seconds between the flash and the bang, you can calculate how far away the strike occurred. Temperature significantly affects the speed of sound.',
      howToUse:
        'Start counting seconds when you see the flash and stop when you hear the thunder. Enter that count and the current air temperature. The calculator shows how far away the strike was and whether you should seek shelter.',
      exampleScenario:
        'You count 8 seconds between flash and thunder on a 25Â°C summer afternoon. Speed of sound â‰ˆ 346 m/s. Distance â‰ˆ 346 Ã— 8 = 2,768 m â‰ˆ 2.77 km. Safety output is 0 â€” seek shelter immediately!',
      proTip:
        'The classic "30-30 rule": if flash-to-bang is under 30 seconds (~10 km), head indoors. Wait 30 minutes after the last thunder before resuming outdoor activities. Lightning can strike up to 16 km (10 miles) from the visible storm â€” "bolt from the blue." Avoid tall trees, open fields, and bodies of water.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 4. Toilet Paper Hoarding Calculator
  // =========================================================================
  {
    id: 'toilet-paper-hoarding',
    slug: 'toilet-paper-hoarding',
    title: 'Toilet Paper Hoarding Calculator',
    description:
      'Calculate exactly how many rolls your household needs to survive any number of days â€” pandemic or otherwise.',
    icon: '🧻',
    category: 'everyday',
    subcategory: 'utility',
    tags: ['toilet paper', 'household', 'supplies', 'survival', 'stockpile', 'pandemic', 'utility'],
    inputs: [
      {
        id: 'numPeople',
        label: 'Number of People in Household',
        type: 'number',
        defaultValue: 4,
        min: 1,
        step: 1,
        placeholder: 'e.g. 4',
        helpText: 'Total number of people sharing the toilet paper supply.',
        required: true,
      },
      {
        id: 'rollsPerPersonPerWeek',
        label: 'Rolls per Person per Week',
        type: 'number',
        defaultValue: 1.5,
        min: 0.5,
        step: 0.5,
        placeholder: 'e.g. 1.5',
        helpText: 'Average rolls used per person each week. Typical range: 1-2 rolls/week/person.',
        required: true,
      },
      {
        id: 'daysToSurvive',
        label: 'Days to Stock For',
        type: 'number',
        defaultValue: 90,
        min: 1,
        step: 1,
        placeholder: 'e.g. 90',
        helpText: 'How many days of supply you want to maintain.',
        units: [{ label: 'days', value: 'days' }],
        required: true,
      },
    ],
    formulas: [
      {
        id: 'totalRolls',
        expression: 'ceil(numPeople * rollsPerPersonPerWeek * (daysToSurvive / 7))',
        dependencies: ['numPeople', 'rollsPerPersonPerWeek', 'daysToSurvive'],
      },
      {
        id: 'sheetsPerRoll',
        expression: '200',
        dependencies: [],
      },
      {
        id: 'totalSheets',
        expression: 'totalRolls * sheetsPerRoll',
        dependencies: ['totalRolls', 'sheetsPerRoll'],
      },
      {
        id: 'squaresPerDay',
        expression: 'totalSheets / daysToSurvive / numPeople',
        dependencies: ['totalSheets', 'daysToSurvive', 'numPeople'],
      },
    ],
    outputs: [
      {
        id: 'totalRollsOut',
        label: 'Total Rolls Needed',
        formulaRef: 'totalRolls',
        format: 'number',
        precision: 0,
        highlight: true,
        suffix: ' rolls needed',
      },
      {
        id: 'totalSheetsOut',
        label: 'Total Sheets',
        formulaRef: 'totalSheets',
        format: 'number',
        precision: 0,
        suffix: ' total sheets',
      },
      {
        id: 'squaresPerDayOut',
        label: 'Squares per Person per Day',
        formulaRef: 'squaresPerDay',
        format: 'number',
        precision: 1,
        suffix: ' squares/person/day',
      },
    ],
    guide: {
      whatIsIt:
        'A lighthearted but mathematically sound calculator for determining how many rolls of toilet paper a household needs for any given number of days â€” useful for emergency preparedness, camping trips, or just satisfying curiosity.',
      howToUse:
        'Enter the number of people in your home, your typical weekly roll consumption per person, and the number of days you want to be stocked for. The result shows exact rolls needed (rounded up), total individual sheets, and daily usage per person.',
      exampleScenario:
        'A family of 4 using 1.5 rolls/person/week wants a 90-day supply: 4 x 1.5 x (90/7) â‰ˆ 77.1, rounded up to 78 rolls. That is 15,600 total sheets, or about 200 squares per person per day â€” perfectly reasonable.',
      proTip:
        'The average American uses about 100 rolls per year (~1.9 rolls/week). Store rolls in a cool, dry place â€” toilet paper does not expire but can absorb moisture. Rotate stock FIFO (first in, first out). Fun fact: during the 2020 pandemic panic buying, studies showed demand only increased ~10%, but fear of shortages caused perception of 10x scarcity. It was never actually necessary to hoard.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 5. Ring Size & Metal Usage Calculator
  // =========================================================================
  {
    id: 'ring-resizing',
    slug: 'ring-resizing',
    title: 'Ring Size & Metal Usage Calculator (Jewelry Resizing)',
    description:
      'Calculate the circumference change when resizing a ring between US sizes and estimate the weight of metal added or removed.',
    icon: '💍',
    category: 'everyday',
    subcategory: 'lifestyle',
    tags: ['ring', 'jewelry', 'ring size', 'resizing', 'gold', 'silver', 'platinum', 'jeweler', 'metal weight'],
    inputs: [
      {
        id: 'currentSizeUS',
        label: 'Current Ring Size (US)',
        type: 'number',
        defaultValue: 7,
        min: 3,
        max: 15,
        step: 0.5,
        placeholder: 'e.g. 7',
        helpText: 'Current ring size on the US scale. Half sizes (e.g. 7.5) are accepted.',
        required: true,
      },
      {
        id: 'targetSizeUS',
        label: 'Target Ring Size (US)',
        type: 'number',
        defaultValue: 8,
        min: 3,
        max: 15,
        step: 0.5,
        placeholder: 'e.g. 8',
        helpText: 'Desired ring size after resizing.',
        required: true,
      },
      {
        id: 'ringWidthMm',
        label: 'Ring Band Width',
        type: 'number',
        defaultValue: 6,
        min: 1,
        step: 0.5,
        placeholder: 'e.g. 6',
        helpText: 'Width of the ring band in mm (measured along the finger).',
        units: [{ label: 'mm', value: 'mm' }],
        required: true,
      },
      {
        id: 'ringThicknessMm',
        label: 'Ring Band Thickness / Gauge',
        type: 'number',
        defaultValue: 1.5,
        min: 0.5,
        step: 0.1,
        placeholder: 'e.g. 1.5',
        helpText: 'Thickness of the ring shank in mm (radial depth of the metal).',
        units: [{ label: 'mm', value: 'mm' }],
        required: true,
      },
      {
        id: 'metalType',
        label: 'Metal Type (density g/cmÂ³)',
        type: 'select',
        defaultValue: '19.3',
        options: [
          { label: 'Gold (19.3 g/cmÂ³)', value: '19.3' },
          { label: 'Silver (10.49 g/cmÂ³)', value: '10.49' },
          { label: 'Platinum (21.45 g/cmÂ³)', value: '21.45' },
          { label: 'Titanium (4.51 g/cmÂ³)', value: '4.51' },
        ],
        helpText: 'Select the ring metal to estimate the weight of material added or removed.',
        required: true,
      },
    ],
    formulas: [
      {
        // US ring size â†’ inner diameter (mm): diameter = size Ã— 0.8325 + 11.84
        id: 'current_diamMm',
        expression: 'currentSizeUS * 0.8325 + 11.84',
        dependencies: ['currentSizeUS'],
      },
      {
        id: 'target_diamMm',
        expression: 'targetSizeUS * 0.8325 + 11.84',
        dependencies: ['targetSizeUS'],
      },
      {
        id: 'current_circumMm',
        expression: '3.14159 * current_diamMm',
        dependencies: ['current_diamMm'],
      },
      {
        id: 'target_circumMm',
        expression: '3.14159 * target_diamMm',
        dependencies: ['target_diamMm'],
      },
      {
        id: 'sizeDiffMm',
        expression: 'target_circumMm - current_circumMm',
        dependencies: ['target_circumMm', 'current_circumMm'],
      },
      {
        // Cross-section of the ring shank = width Ã— thickness (mmÂ²)
        id: 'crossSection',
        expression: 'ringWidthMm * ringThicknessMm',
        dependencies: ['ringWidthMm', 'ringThicknessMm'],
      },
      {
        // Volume of metal to add/remove = |circumference change| Ã— cross-section (mmÂ³)
        id: 'metalVolumeMm3',
        expression: 'abs(sizeDiffMm) * crossSection',
        dependencies: ['sizeDiffMm', 'crossSection'],
      },
      {
        // Weight (g) = volume (mmÂ³) Ã— density (g/cmÂ³) / 1000 (convert mmÂ³ to cmÂ³)
        id: 'metalWeightG',
        expression: 'metalVolumeMm3 * metalType / 1000',
        dependencies: ['metalVolumeMm3', 'metalType'],
      },
    ],
    outputs: [
      {
        id: 'sizeDiffMmOut',
        label: 'Circumference Change',
        formulaRef: 'sizeDiffMm',
        format: 'number',
        precision: 2,
        highlight: true,
        suffix: ' mm circumference change',
      },
      {
        id: 'metalWeightGOut',
        label: 'Metal Added / Removed',
        formulaRef: 'metalWeightG',
        format: 'number',
        precision: 3,
        suffix: ' g metal added/removed',
      },
      {
        id: 'current_diamMmOut',
        label: 'Current Inner Diameter',
        formulaRef: 'current_diamMm',
        format: 'number',
        precision: 2,
        suffix: ' mm current inner diameter',
      },
      {
        id: 'target_diamMmOut',
        label: 'Target Inner Diameter',
        formulaRef: 'target_diamMm',
        format: 'number',
        precision: 2,
        suffix: ' mm target inner diameter',
      },
    ],
    guide: {
      whatIsIt:
        'Ring resizing involves cutting the shank and either adding a small metal segment (sizing up) or removing metal and soldering the gap closed (sizing down). This calculator estimates the exact circumference change and the weight of precious metal involved.',
      howToUse:
        "Enter your current and target US ring sizes (use a ring sizer or measure an existing ring's inner diameter), the band width and thickness, and the metal type. The output shows how much the circumference changes and the approximate weight of metal your jeweler will work with.",
      exampleScenario:
        'Going from US size 7 to 8 in a 6 mm wide, 1.5 mm thick gold band: diameter increases from 17.17 mm to 18.00 mm. Circumference change â‰ˆ 2.61 mm. Metal volume â‰ˆ 2.61 Ã— 9 = 23.5 mmÂ³. Gold weight â‰ˆ 23.5 Ã— 19.3 / 1000 â‰ˆ 0.45 g of gold â€” just a few dollars in material cost, though jeweler labor drives the actual price.',
      proTip:
        'Most jewelers can resize Â±2-3 US sizes without compromising the ring. Beyond that, the shank geometry may distort. Rings with full eternity settings (stones all around) cannot be resized. For sizing down, the removed metal is returned by many jewelers. Always confirm with a professional ring sizer â€” fingers swell throughout the day, so measure in the evening.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 6. Sun Position & Shadow Length Calculator
  // =========================================================================
  {
    id: 'sun-shadow-length',
    slug: 'sun-shadow-length',
    title: 'Sun Position & Shadow Length Calculator',
    description:
      'Calculate the approximate solar elevation angle and the resulting shadow length for any vertical object at a given latitude, day of year, and solar hour.',
    icon: '☀️',
    category: 'science',
    subcategory: 'astronomy',
    tags: ['sun', 'shadow', 'solar elevation', 'solar position', 'latitude', 'solstice', 'sundial', 'solar panel'],
    inputs: [
      {
        id: 'objectHeightM',
        label: 'Object Height',
        type: 'number',
        defaultValue: 10,
        min: 0.1,
        step: 0.1,
        placeholder: 'e.g. 10',
        helpText: 'Height of the vertical object in metres.',
        units: [{ label: 'm', value: 'm' }],
        required: true,
      },
      {
        id: 'latitudeDeg',
        label: 'Latitude',
        type: 'number',
        defaultValue: 40,
        min: -90,
        max: 90,
        step: 0.1,
        placeholder: 'e.g. 40',
        helpText: 'Your latitude in degrees. Negative for the Southern Hemisphere.',
        units: [{ label: 'degrees', value: 'deg' }],
        required: true,
      },
      {
        id: 'dayOfYear',
        label: 'Day of Year',
        type: 'number',
        defaultValue: 172,
        min: 1,
        max: 365,
        step: 1,
        placeholder: 'e.g. 172',
        helpText: 'Day of the year (1 = Jan 1, 172 = ~Jun 21 summer solstice, 355 = ~Dec 21 winter solstice).',
        required: true,
      },
      {
        id: 'hourOfDay',
        label: 'Solar Hour',
        type: 'number',
        defaultValue: 12,
        min: 6,
        max: 18,
        step: 0.5,
        placeholder: 'e.g. 12',
        helpText: 'Solar time hour (12 = solar noon, when the sun is highest).',
        required: true,
      },
    ],
    formulas: [
      {
        // Solar declination Î´ = 23.45Â° Ã— sin((360/365 Ã— (N âˆ’ 81)) Ã— Ï€/180)
        id: 'declination',
        expression: '23.45 * sin((360 / 365 * (dayOfYear - 81)) * (3.14159 / 180))',
        dependencies: ['dayOfYear'],
      },
      {
        // Hour angle H = (solar hour âˆ’ 12) Ã— 15Â°
        id: 'hourAngle',
        expression: '(hourOfDay - 12) * 15',
        dependencies: ['hourOfDay'],
      },
      {
        // sin(altitude) = sin(lat)Â·sin(dec) + cos(lat)Â·cos(dec)Â·cos(H)
        id: 'solarAltitudeSin',
        expression:
          'sin(latitudeDeg * (3.14159 / 180)) * sin(declination * (3.14159 / 180)) + cos(latitudeDeg * (3.14159 / 180)) * cos(declination * (3.14159 / 180)) * cos(hourAngle * (3.14159 / 180))',
        dependencies: ['latitudeDeg', 'declination', 'hourAngle'],
      },
      {
        // Shadow length = height Ã— cos(elevation) / sin(elevation)
        //              = height Ã— sqrt(1 âˆ’ sinÂ²(el)) / sin(el)
        // Guard: only valid when sun is meaningfully above horizon (sin > 0.05 ~= 3Â°)
        id: 'shadowLengthM',
        expression:
          'solarAltitudeSin > 0.05 ? objectHeightM * sqrt(1 - pow(solarAltitudeSin, 2)) / solarAltitudeSin : 999',
        dependencies: ['solarAltitudeSin', 'objectHeightM'],
      },
      {
        // Approximate solar elevation display: sin(el) Ã— 90 gives a linear 0-90 mapping
        id: 'solarElevationApprox',
        expression: 'solarAltitudeSin * 90',
        dependencies: ['solarAltitudeSin'],
      },
    ],
    outputs: [
      {
        id: 'shadowLengthMOut',
        label: 'Shadow Length',
        formulaRef: 'shadowLengthM',
        format: 'number',
        precision: 2,
        highlight: true,
        suffix: ' m shadow length',
      },
      {
        id: 'solarElevationApproxOut',
        label: 'Approximate Solar Elevation',
        formulaRef: 'solarElevationApprox',
        format: 'number',
        precision: 1,
        suffix: 'Â° approximate solar elevation',
      },
    ],
    guide: {
      whatIsIt:
        "The sun's position in the sky changes with latitude, time of year (solar declination), and time of day (hour angle). Solar elevation â€” how high the sun sits above the horizon â€” directly determines the length of shadows cast by vertical objects.",
      howToUse:
        "Enter the object's height, your latitude, the day of the year, and the solar hour. The calculator uses the standard astronomical formula to compute sin(solar elevation) and derives the shadow length from trigonometry. A value of 999 m means the sun is at or below the horizon.",
      exampleScenario:
        'A 10 m flagpole at latitude 40Â°N on the summer solstice (day 172) at solar noon: solar declination â‰ˆ 23.45Â°, hour angle = 0Â°. sin(elevation) â‰ˆ sin(40Â°)Ã—sin(23.45Â°) + cos(40Â°)Ã—cos(23.45Â°) â‰ˆ 0.959. Shadow length â‰ˆ 10 Ã— sqrt(1 âˆ’ 0.959Â²) / 0.959 â‰ˆ 2.94 m.',
      proTip:
        'Solar noon is not always 12:00 clock time â€” it varies with your longitude within your time zone and the equation of time. Shadow length is shortest at solar noon and infinitely long at sunrise/sunset. This calculation is invaluable for positioning solar panels (optimize tilt), designing sundials, or planning architectural shading features.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 7. Pool Chemical Dosing Calculator
  // =========================================================================
  {
    id: 'pool-chemical-dosing',
    slug: 'pool-chemical-dosing',
    title: 'Pool Chemical Dosing Calculator',
    description:
      'Calculate how much chlorine and pH adjuster to add to your swimming pool to reach target water chemistry levels.',
    icon: '🏊',
    category: 'everyday',
    subcategory: 'utility',
    tags: ['pool', 'swimming pool', 'chlorine', 'pH', 'water chemistry', 'chemical dosing', 'calcium hypochlorite'],
    inputs: [
      {
        id: 'poolVolumeLiters',
        label: 'Pool Volume',
        type: 'number',
        defaultValue: 50000,
        min: 1000,
        step: 1000,
        placeholder: 'e.g. 50000',
        helpText: 'Pool volume in litres. Rectangular pool: L(m) Ã— W(m) Ã— Avg Depth(m) Ã— 1000.',
        units: [{ label: 'L', value: 'L' }],
        required: true,
      },
      {
        id: 'currentCl',
        label: 'Current Free Chlorine',
        type: 'number',
        defaultValue: 0.5,
        min: 0,
        step: 0.1,
        placeholder: 'e.g. 0.5',
        helpText: 'Current free chlorine level in ppm (mg/L). Measured with a test kit or strips.',
        units: [{ label: 'ppm', value: 'ppm' }],
        required: true,
      },
      {
        id: 'targetCl',
        label: 'Target Free Chlorine',
        type: 'number',
        defaultValue: 3.0,
        min: 0,
        step: 0.1,
        placeholder: 'e.g. 3.0',
        helpText: 'Target free chlorine level in ppm. Ideal range: 2-4 ppm.',
        units: [{ label: 'ppm', value: 'ppm' }],
        required: true,
      },
      {
        id: 'currentPH',
        label: 'Current pH',
        type: 'number',
        defaultValue: 7.2,
        min: 6,
        max: 9,
        step: 0.1,
        placeholder: 'e.g. 7.2',
        helpText: 'Current pH level of the pool water.',
        required: true,
      },
      {
        id: 'targetPH',
        label: 'Target pH',
        type: 'number',
        defaultValue: 7.4,
        min: 6,
        max: 9,
        step: 0.1,
        placeholder: 'e.g. 7.4',
        helpText: 'Target pH level. Ideal range: 7.2-7.6.',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'clDiff',
        expression: 'targetCl - currentCl',
        dependencies: ['targetCl', 'currentCl'],
      },
      {
        // Chlorine needed (g) for 65% calcium hypochlorite granules:
        // ppm increase Ã— pool volume (L) / 1000 Ã— purity factor (100/65)
        id: 'chlorineNeededG',
        expression: 'clDiff * poolVolumeLiters / 1000 * (100 / 65)',
        dependencies: ['clDiff', 'poolVolumeLiters'],
      },
      {
        id: 'phDiff',
        expression: 'targetPH - currentPH',
        dependencies: ['targetPH', 'currentPH'],
      },
      {
        // pH adjuster (g): ~25 g soda ash per 1000 L to raise pH by 1.0
        //                  ~25 g dry acid per 1000 L to lower pH by 1.0
        id: 'phAdjustG',
        expression: 'abs(phDiff) * poolVolumeLiters / 1000 * 25',
        dependencies: ['phDiff', 'poolVolumeLiters'],
      },
    ],
    outputs: [
      {
        id: 'chlorineNeededGOut',
        label: 'Chlorine Granules to Add (65% Ca(ClO)2)',
        formulaRef: 'chlorineNeededG',
        format: 'number',
        precision: 0,
        highlight: true,
        suffix: ' g of 65% Ca(ClO)2 to add',
      },
      {
        id: 'phAdjustGOut',
        label: 'pH Adjuster to Add',
        formulaRef: 'phAdjustG',
        format: 'number',
        precision: 0,
        suffix: ' g pH adjuster (soda ash to raise, dry acid to lower)',
      },
    ],
    guide: {
      whatIsIt:
        'Swimming pool water chemistry requires maintaining free chlorine (sanitiser) and pH within tight ranges. This calculator estimates the weight of 65% calcium hypochlorite granules to raise chlorine levels and the weight of soda ash (raise pH) or dry acid (lower pH) needed for adjustment.',
      howToUse:
        'Test your pool water with a reliable test kit, enter the current and target levels for chlorine and pH, and input your pool volume. The calculator shows grams of each chemical to add. Always re-test after 4-6 hours of circulation before adding more chemicals.',
      exampleScenario:
        'A 50,000 L pool with chlorine at 0.5 ppm needs to reach 3.0 ppm: difference = 2.5 ppm. Chlorine granules needed = 2.5 Ã— 50000 / 1000 Ã— (100/65) â‰ˆ 192 g. pH needs to move from 7.2 to 7.4: soda ash needed = 0.2 Ã— 50000 / 1000 Ã— 25 = 250 g.',
      proTip:
        'IMPORTANT: Always add chemicals to water â€” never water to chemicals â€” to avoid dangerous splashing reactions. Pre-dissolve granules in a bucket of pool water before adding. Test and adjust one parameter at a time. Ideal ranges: Free Chlorine 2-4 ppm, pH 7.2-7.6, Total Alkalinity 80-120 ppm, Calcium Hardness 200-400 ppm. High pH dramatically reduces chlorine effectiveness.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 8. Wood Movement Calculator
  // =========================================================================
  {
    id: 'wood-movement',
    slug: 'wood-movement',
    title: 'Wood Movement Calculator',
    description:
      'Estimate how much a board will expand or contract across the grain when moisture content changes, using species-specific shrinkage coefficients.',
    icon: '🌲',
    category: 'construction',
    subcategory: 'lumber',
    tags: ['wood', 'lumber', 'woodworking', 'moisture content', 'shrinkage', 'expansion', 'joinery', 'furniture'],
    inputs: [
      {
        id: 'boardWidthMm',
        label: 'Board Width (across grain)',
        type: 'number',
        defaultValue: 150,
        min: 1,
        step: 1,
        placeholder: 'e.g. 150',
        helpText: 'Board width measured perpendicular to the grain direction in mm. This is where most movement occurs.',
        units: [{ label: 'mm', value: 'mm' }],
        required: true,
      },
      {
        id: 'mcChange',
        label: 'Moisture Content Change',
        type: 'number',
        defaultValue: 8,
        min: 0.5,
        step: 0.5,
        placeholder: 'e.g. 8',
        helpText: 'Change in moisture content in percentage points. E.g. from 12% to 20% = 8 pp change.',
        units: [{ label: '% pts', value: 'pct' }],
        required: true,
      },
      {
        id: 'shrinkageCoeff',
        label: 'Shrinkage Coefficient',
        type: 'number',
        defaultValue: 0.0370,
        min: 0.010,
        max: 0.060,
        step: 0.0001,
        placeholder: 'e.g. 0.0370',
        helpText:
          'Dimensional change coefficient (tangential or radial). Oak T: 0.0369, Oak R: 0.0179 | Pine T: 0.0254, Pine R: 0.0171 | Maple T: 0.0353, R: 0.0165 | Walnut T: 0.0274, R: 0.0190 | Cherry T: 0.0240, R: 0.0133',
        required: true,
      },
    ],
    formulas: [
      {
        // Movement (mm) = width Ã— shrinkage_coefficient Ã— MC_change (%)
        id: 'movementMm',
        expression: 'boardWidthMm * shrinkageCoeff * mcChange',
        dependencies: ['boardWidthMm', 'shrinkageCoeff', 'mcChange'],
      },
      {
        id: 'movementIn',
        expression: 'movementMm / 25.4',
        dependencies: ['movementMm'],
      },
      {
        id: 'movementPct',
        expression: '(movementMm / boardWidthMm) * 100',
        dependencies: ['movementMm', 'boardWidthMm'],
      },
    ],
    outputs: [
      {
        id: 'movementMmOut',
        label: 'Movement Across Grain',
        formulaRef: 'movementMm',
        format: 'number',
        precision: 2,
        highlight: true,
        suffix: ' mm movement across grain',
      },
      {
        id: 'movementInOut',
        label: 'Movement (inches)',
        formulaRef: 'movementIn',
        format: 'number',
        precision: 4,
        suffix: '"',
      },
      {
        id: 'movementPctOut',
        label: 'Movement (% of width)',
        formulaRef: 'movementPct',
        format: 'percentage',
        precision: 2,
      },
    ],
    guide: {
      whatIsIt:
        'Wood is hygroscopic â€” it absorbs and releases moisture as humidity changes, causing it to swell and shrink across the grain. Understanding this movement is critical in joinery, furniture making, and flooring installation to prevent warping, cracking, and joint failure.',
      howToUse:
        'Enter the board width across the grain and the expected moisture content change (the difference between installation and service condition MC). Enter the shrinkage coefficient for your species and grain orientation (tangential = flat-sawn, radial = quarter-sawn). The result is the total expected movement.',
      exampleScenario:
        'A 150 mm wide flat-sawn oak tabletop installed at 12% MC in a workshop (summer) will reach 8% MC in a centrally heated home in winter. Change = 4 pp. Movement = 150 Ã— 0.0369 Ã— 4 â‰ˆ 22.1 mm â€” nearly an inch! Slots in the tabletop cleats must accommodate this movement or the top will crack.',
      proTip:
        'Tangential (flat-sawn) movement is roughly twice radial (quarter-sawn) movement, so quarter-sawn boards are dramatically more dimensionally stable. Always account for EMC (Equilibrium Moisture Content) at the installation location â€” 6-8% for heated interiors, 10-14% for unheated spaces. Leave 1/8 inch expansion gaps per foot of flooring width. Along-grain movement is ~10x less than across-grain.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 9. Toilet Flow Rate & Water Usage Calculator
  // =========================================================================
  {
    id: 'toilet-flow-rate',
    slug: 'toilet-flow-rate',
    title: 'Toilet Flow Rate & Water Usage Calculator',
    description:
      'Calculate household toilet water consumption per day and per year, and estimate annual savings versus older high-flow toilets.',
    icon: '🚽',
    category: 'everyday',
    subcategory: 'utility',
    tags: ['toilet', 'water usage', 'gallons per flush', 'water conservation', 'WaterSense', 'plumbing', 'utility'],
    inputs: [
      {
        id: 'flushesPerDay',
        label: 'Flushes per Person per Day',
        type: 'number',
        defaultValue: 5,
        min: 1,
        step: 1,
        placeholder: 'e.g. 5',
        helpText: 'Average daily flushes per person. US average is about 5-8 flushes/day.',
        required: true,
      },
      {
        id: 'gallonsPerFlush',
        label: 'Toilet Flow Rate',
        type: 'select',
        defaultValue: '1.6',
        options: [
          { label: 'Standard 3.5 GPF (pre-1994)', value: '3.5' },
          { label: 'Standard 1.6 GPF (1994+ US code)', value: '1.6' },
          { label: 'WaterSense 1.28 GPF', value: '1.28' },
          { label: 'Dual Flush Low (0.8 GPF)', value: '0.8' },
          { label: 'Dual Flush Full (1.28 GPF)', value: '1.28' },
        ],
        helpText: 'Select the toilet flush volume. Check the toilet lid or product spec for GPF rating.',
        required: true,
      },
      {
        id: 'numPeople',
        label: 'Number of People in Household',
        type: 'number',
        defaultValue: 4,
        min: 1,
        step: 1,
        placeholder: 'e.g. 4',
        helpText: 'Total number of household members.',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'gallonsPerDayPerPerson',
        expression: 'flushesPerDay * gallonsPerFlush',
        dependencies: ['flushesPerDay', 'gallonsPerFlush'],
      },
      {
        id: 'gallonsPerDayTotal',
        expression: 'gallonsPerDayPerPerson * numPeople',
        dependencies: ['gallonsPerDayPerPerson', 'numPeople'],
      },
      {
        id: 'gallonsPerYear',
        expression: 'gallonsPerDayTotal * 365',
        dependencies: ['gallonsPerDayTotal'],
      },
      {
        id: 'litersPerYear',
        expression: 'gallonsPerYear * 3.785',
        dependencies: ['gallonsPerYear'],
      },
      {
        // Savings vs. old 3.5 GPF toilets
        id: 'savingsVsOld',
        expression: '(3.5 - gallonsPerFlush) * flushesPerDay * numPeople * 365',
        dependencies: ['gallonsPerFlush', 'flushesPerDay', 'numPeople'],
      },
    ],
    outputs: [
      {
        id: 'gallonsPerDayTotalOut',
        label: 'Household Toilet Water Usage per Day',
        formulaRef: 'gallonsPerDayTotal',
        format: 'number',
        precision: 1,
        highlight: true,
        suffix: ' gallons/day (household)',
      },
      {
        id: 'gallonsPerYearOut',
        label: 'Annual Water Usage',
        formulaRef: 'gallonsPerYear',
        format: 'number',
        precision: 0,
        suffix: ' gallons/year',
      },
      {
        id: 'litersPerYearOut',
        label: 'Annual Water Usage (litres)',
        formulaRef: 'litersPerYear',
        format: 'number',
        precision: 0,
        suffix: ' liters/year',
      },
      {
        id: 'savingsVsOldOut',
        label: 'Annual Savings vs. 3.5 GPF Toilet',
        formulaRef: 'savingsVsOld',
        format: 'number',
        precision: 0,
        suffix: ' gallons/year saved vs 3.5 GPF',
      },
    ],
    guide: {
      whatIsIt:
        'Toilets account for approximately 30% of indoor residential water use. This calculator quantifies total household toilet water consumption based on flush volume and usage patterns, and shows how much water can be saved by upgrading to a more efficient model.',
      howToUse:
        "Enter the average daily flushes per person, select your toilet's GPF (gallons per flush) rating â€” found on the toilet tank lid or manufacturer specs â€” and the number of household members. Results show daily and annual consumption plus savings versus a pre-1994 toilet.",
      exampleScenario:
        'A family of 4 averaging 5 flushes/day with a 1994-era 1.6 GPF toilet uses 4 Ã— 5 Ã— 1.6 = 32 gallons/day = 11,680 gallons/year. Upgrading to a WaterSense 1.28 GPF model saves (3.5 âˆ’ 1.28) Ã— 5 Ã— 4 Ã— 365 = 16,206 gallons/year â€” enough to fill a small swimming pool.',
      proTip:
        'The US EPA WaterSense certification requires 1.28 GPF or less with equivalent performance. Many utilities offer $50-$150 rebates for qualifying replacements. Check toilets installed before 1994 â€” they used 3.5-7 GPF and are the biggest low-hanging fruit for conservation. Dual-flush models let you choose 0.8 GPF for liquids. Greywater systems can further recycle sink and shower water for flushing.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 10. Generational Wealth Calculator
  // =========================================================================
  {
    id: 'generational-wealth',
    slug: 'generational-wealth',
    title: 'Generational Wealth Calculator',
    description:
      'Project long-term wealth accumulation through compound investment returns, showing both nominal and inflation-adjusted future values for multi-generational financial planning.',
    icon: '💰',
    category: 'finance',
    subcategory: 'personal',
    tags: ['wealth', 'compound interest', 'investment', 'retirement', 'generational wealth', 'inflation', 'Rule of 72', 'financial planning'],
    inputs: [
      {
        id: 'currentWealth',
        label: 'Current Net Worth / Assets',
        type: 'number',
        defaultValue: 100000,
        min: 0,
        step: 1000,
        placeholder: 'e.g. 100000',
        helpText: 'Current total investable net worth or starting portfolio value.',
        units: [{ label: '$', value: 'USD' }],
        required: true,
      },
      {
        id: 'annualContribution',
        label: 'Annual Savings / Investment Contribution',
        type: 'number',
        defaultValue: 12000,
        min: 0,
        step: 500,
        placeholder: 'e.g. 12000',
        helpText: 'Amount added to investments each year (e.g. $1,000/month = $12,000/year).',
        units: [{ label: '$', value: 'USD' }],
        required: true,
      },
      {
        id: 'annualReturn',
        label: 'Expected Annual Return',
        type: 'number',
        defaultValue: 7,
        min: 0.1,
        max: 30,
        step: 0.1,
        placeholder: 'e.g. 7',
        helpText: 'Expected nominal annual investment return (%). S&P 500 inflation-adjusted historical average ~7%; nominal ~10%.',
        units: [{ label: '%', value: 'pct' }],
        required: true,
      },
      {
        id: 'yearsToRetire',
        label: 'Years to Grow / Transfer',
        type: 'number',
        defaultValue: 30,
        min: 1,
        max: 100,
        step: 1,
        placeholder: 'e.g. 30',
        helpText: 'Number of years until retirement or wealth transfer to the next generation.',
        units: [{ label: 'years', value: 'yr' }],
        required: true,
      },
      {
        id: 'inflationRate',
        label: 'Annual Inflation Rate',
        type: 'number',
        defaultValue: 3,
        min: 0,
        max: 20,
        step: 0.1,
        placeholder: 'e.g. 3',
        helpText: 'Expected annual inflation rate (%). US long-run average ~3%.',
        units: [{ label: '%', value: 'pct' }],
        required: true,
      },
    ],
    formulas: [
      {
        id: 'r',
        expression: 'annualReturn / 100',
        dependencies: ['annualReturn'],
      },
      {
        id: 'inf',
        expression: 'inflationRate / 100',
        dependencies: ['inflationRate'],
      },
      {
        id: 'n',
        expression: 'yearsToRetire',
        dependencies: ['yearsToRetire'],
      },
      {
        // FV growth factor = (1+r)^n
        id: 'growthFactor',
        expression: 'pow(1 + r, n)',
        dependencies: ['r', 'n'],
      },
      {
        // FV = PV Ã— (1+r)^n + C Ã— ((1+r)^n âˆ’ 1) / r
        id: 'futureValueInvestments',
        expression: 'currentWealth * growthFactor + annualContribution * (growthFactor - 1) / r',
        dependencies: ['currentWealth', 'growthFactor', 'annualContribution', 'r'],
      },
      {
        // Real return = (1+r)/(1+inf) âˆ’ 1
        id: 'realReturn',
        expression: '(1 + r) / (1 + inf) - 1',
        dependencies: ['r', 'inf'],
      },
      {
        id: 'realGrowthFactor',
        expression: 'pow(1 + realReturn, n)',
        dependencies: ['realReturn', 'n'],
      },
      {
        id: 'futureValueReal',
        expression: 'currentWealth * realGrowthFactor + annualContribution * (realGrowthFactor - 1) / realReturn',
        dependencies: ['currentWealth', 'realGrowthFactor', 'annualContribution', 'realReturn'],
      },
      {
        // Rule of 72: years to double = 72 / annual_return_%
        id: 'doublingYears',
        expression: '72 / annualReturn',
        dependencies: ['annualReturn'],
      },
    ],
    outputs: [
      {
        id: 'futureValueInvestmentsOut',
        label: 'Nominal Future Value',
        formulaRef: 'futureValueInvestments',
        format: 'currency',
        precision: 0,
        highlight: true,
        suffix: ' nominal future value',
      },
      {
        id: 'futureValueRealOut',
        label: 'Inflation-Adjusted (Real) Future Value',
        formulaRef: 'futureValueReal',
        format: 'currency',
        precision: 0,
        suffix: ' inflation-adjusted value',
      },
      {
        id: 'doublingYearsOut',
        label: 'Years to Double (Rule of 72)',
        formulaRef: 'doublingYears',
        format: 'number',
        precision: 1,
        suffix: ' years to double (Rule of 72)',
      },
    ],
    guide: {
      whatIsIt:
        'Generational wealth is built through the power of compound interest over long time horizons. This calculator projects both the nominal (face-value) and inflation-adjusted real purchasing power of your investments at the end of the growth period, illustrating how consistent contributions dramatically amplify long-term outcomes.',
      howToUse:
        'Enter your current investable net worth, annual contribution amount, expected annual return rate, the number of years until you plan to retire or transfer wealth, and the expected inflation rate. The calculator shows both the raw future value and what that money is actually worth in today\'s dollars.',
      exampleScenario:
        'Starting with $100,000, contributing $12,000/year at 7% return over 30 years: nominal FV â‰ˆ $2,018,000. At 3% inflation, the real return is (1.07/1.03) âˆ’ 1 â‰ˆ 3.88%. Real FV â‰ˆ $980,000 in today\'s dollars â€” still nearly 10x the starting capital. The Rule of 72 says this portfolio doubles every 72/7 â‰ˆ 10.3 years.',
      proTip:
        'The earlier you start, the more dramatic the compounding effect â€” a 25-year-old starting at $0 with $500/month at 7% has ~$1.2M by age 65, while a 35-year-old starting the same way has only ~$566,000. Estate planning tools like irrevocable trusts, 529 plans, and Roth IRAs can shelter compounding gains from estate taxes. The generational wealth gap is substantially driven by the gap in years of compounding, not just initial capital.',
    },
    metadata: { version: '1.0.0' },
  },
];
