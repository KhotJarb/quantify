// ---------------------------------------------------------------------------
// Quantify � Outdoors & Ballistics Calculators
// ---------------------------------------------------------------------------
// 10 calculators covering shooting, archery, skiing, fishing, kayaking,
// and outdoor weather calculations.
// ---------------------------------------------------------------------------

import type { CalculatorSchema } from '@/types/calculator';

export const outdoorsBallisticsCalculators: CalculatorSchema[] = [
  // =========================================================================
  // 1. Ballistic Bullet Drop Calculator
  // =========================================================================
  {
    id: 'ballistic-bullet-drop',
    slug: 'ballistic-bullet-drop',
    title: 'Ballistic Bullet Drop Calculator',
    description:
      'Estimate bullet drop in inches, time of flight, and terminal energy at a given range using simplified ballistic equations.',
    icon: '🎯',
    category: 'sports',
    subcategory: 'outdoor',
    tags: ['ballistics', 'bullet drop', 'shooting', 'long range', 'muzzle velocity', 'MOA', 'sniper'],
    inputs: [
      {
        id: 'muzzleVelocityFps',
        label: 'Muzzle Velocity (fps)',
        type: 'number',
        defaultValue: 2900,
        min: 500,
        max: 5000,
        step: 10,
        placeholder: 'e.g. 2900',
        required: true,
      },
      {
        id: 'bulletWeightGrains',
        label: 'Bullet Weight (grains)',
        type: 'number',
        defaultValue: 168,
        min: 30,
        max: 750,
        step: 1,
        placeholder: 'e.g. 168',
        required: true,
      },
      {
        id: 'rangeYards',
        label: 'Range (yards)',
        type: 'number',
        defaultValue: 500,
        min: 10,
        max: 2000,
        step: 10,
        placeholder: 'e.g. 500',
        required: true,
      },
      {
        id: 'bcG1',
        label: 'Ballistic Coefficient (G1)',
        type: 'number',
        defaultValue: 0.47,
        min: 0.1,
        max: 1.2,
        step: 0.01,
        placeholder: 'e.g. 0.47',
        helpText: 'G1 BC from bullet manufacturer. Higher = less drag.',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'timeOfFlight',
        expression: 'rangeYards * 3 / muzzleVelocityFps',
        dependencies: ['rangeYards', 'muzzleVelocityFps'],
      },
      {
        id: 'dropInches',
        expression: '0.5 * 32.174 * pow(timeOfFlight, 2) * 12',
        dependencies: ['timeOfFlight'],
      },
      {
        id: 'energyFtLbf',
        expression: 'bulletWeightGrains * pow(muzzleVelocityFps * (1 - 0.0005 * rangeYards / 100), 2) / 450437',
        dependencies: ['bulletWeightGrains', 'muzzleVelocityFps', 'rangeYards'],
      },
    ],
    outputs: [
      {
        id: 'out-dropInches',
        label: 'Estimated Bullet Drop',
        formulaRef: 'dropInches',
        format: 'number',
        precision: 1,
        suffix: ' inches',
        highlight: true,
      },
      {
        id: 'out-timeOfFlight',
        label: 'Time of Flight',
        formulaRef: 'timeOfFlight',
        format: 'number',
        precision: 3,
        suffix: ' sec',
      },
      {
        id: 'out-energyFtLbf',
        label: 'Terminal Energy',
        formulaRef: 'energyFtLbf',
        format: 'number',
        precision: 0,
        suffix: ' ft-lbf',
      },
    ],
    guide: {
      whatIsIt:
        'This calculator estimates how far a bullet drops below the line of bore at a given range. It uses simplified flat-fire ballistic equations � the bullet is treated as a projectile in a vacuum subject to gravity, with a rough velocity decay approximation. Disclaimer: results are for educational and range planning use only. Always follow all firearm safety rules and local laws.',
      howToUse:
        'Enter your load\'s muzzle velocity (from the ammunition box or a chronograph), bullet weight, the target range in yards, and the G1 ballistic coefficient (found on bullet or ammo manufacturer data sheets). The calculator returns an approximate drop, time of flight, and remaining energy at that distance.',
      exampleScenario:
        'A .308 Win load with a 168-grain BTHP at 2,680 fps and a G1 BC of 0.47 shot at 500 yards: time of flight � 0.56 s, drop � 58 inches (~4.8 feet), and terminal energy � 1,200 ft-lbf. These numbers help a shooter dial in an initial elevation correction before live-fire zero confirmation.',
      proTip:
        'This calculator uses a simplified model. For precise long-range work, use a full external ballistics solver (e.g. Applied Ballistics or JBM Ballistics) that accounts for atmospheric conditions, Coriolis, spin drift, and your specific bullet\'s drag curve. Always confirm zero on the range before any critical application.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 2. Firearm Recoil Energy Calculator
  // =========================================================================
  {
    id: 'firearm-recoil-energy',
    slug: 'firearm-recoil-energy',
    title: 'Firearm Recoil Energy Calculator',
    description:
      'Calculate free recoil energy and recoil velocity for any centerfire cartridge based on bullet weight, powder charge, muzzle velocity, and firearm weight.',
    icon: '💥',
    category: 'sports',
    subcategory: 'outdoor',
    tags: ['recoil', 'free recoil', 'shooting', 'ballistics', 'gun', 'rifle', 'cartridge', 'felt recoil'],
    inputs: [
      {
        id: 'bulletWeightGrains',
        label: 'Bullet Weight (grains)',
        type: 'number',
        defaultValue: 150,
        min: 30,
        max: 750,
        step: 1,
        placeholder: 'e.g. 150',
        required: true,
      },
      {
        id: 'muzzleVelocityFps',
        label: 'Muzzle Velocity (fps)',
        type: 'number',
        defaultValue: 2800,
        min: 500,
        max: 5000,
        step: 10,
        placeholder: 'e.g. 2800',
        required: true,
      },
      {
        id: 'powderWeightGrains',
        label: 'Powder Charge (grains)',
        type: 'number',
        defaultValue: 55,
        min: 1,
        max: 120,
        step: 0.5,
        placeholder: 'e.g. 55',
        helpText: 'Propellant charge weight from your reloading data or ammo spec sheet.',
        required: true,
      },
      {
        id: 'gunWeightLbs',
        label: 'Firearm Weight (lbs)',
        type: 'number',
        defaultValue: 8,
        min: 1,
        max: 30,
        step: 0.1,
        placeholder: 'e.g. 8',
        helpText: 'Rifle/pistol weight as fired (including scope, magazine, and ammunition).',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'bulletMassLbs',
        expression: 'bulletWeightGrains / 7000',
        dependencies: ['bulletWeightGrains'],
      },
      {
        id: 'powderMassLbs',
        expression: 'powderWeightGrains / 7000',
        dependencies: ['powderWeightGrains'],
      },
      {
        id: 'recoilVelocity',
        expression: '(bulletMassLbs * muzzleVelocityFps + powderMassLbs * 4000) / gunWeightLbs',
        dependencies: ['bulletMassLbs', 'muzzleVelocityFps', 'powderMassLbs', 'gunWeightLbs'],
      },
      {
        id: 'freeRecoilEnergy',
        expression: '0.5 * gunWeightLbs / 32.174 * pow(recoilVelocity, 2)',
        dependencies: ['gunWeightLbs', 'recoilVelocity'],
      },
    ],
    outputs: [
      {
        id: 'out-recoilVelocity',
        label: 'Recoil Velocity',
        formulaRef: 'recoilVelocity',
        format: 'number',
        precision: 2,
        suffix: ' fps',
      },
      {
        id: 'out-freeRecoilEnergy',
        label: 'Free Recoil Energy',
        formulaRef: 'freeRecoilEnergy',
        format: 'number',
        precision: 2,
        suffix: ' ft-lbf',
        highlight: true,
      },
    ],
    guide: {
      whatIsIt:
        'Free recoil energy is the kinetic energy transferred to a firearm during firing, calculated using conservation of momentum. It is the primary objective measure of how "hard" a rifle or pistol kicks. Felt recoil also depends on stock shape, muzzle brakes, and shooter technique, but free recoil energy gives a reliable baseline for comparison between loads and platforms.',
      howToUse:
        'Enter the bullet weight in grains, muzzle velocity, powder charge weight (from your reloading manual or the ammo data sheet), and the total firearm weight as fired. The calculator outputs recoil velocity and free recoil energy in ft-lbf.',
      exampleScenario:
        'A .30-06 load: 150-grain bullet at 2,910 fps with a 58-grain powder charge in an 8.5-lb rifle gives approximately 14 ft-lbf of free recoil. Compare that to a .243 Win: 90-grain at 3,100 fps with 40 grains of powder in the same rifle � only about 7 ft-lbf, roughly half the kick.',
      proTip:
        'A muzzle brake can reduce felt recoil by 30�50%. A heavier rifle always helps � adding 1 lb to an 8-lb rifle with a 14 ft-lbf load drops recoil energy by ~11%. Magnum calibers over 25 ft-lbf are considered heavy-recoiling and can induce flinch over time.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 3. Muzzle Velocity & Energy Calculator
  // =========================================================================
  {
    id: 'muzzle-energy-calculator',
    slug: 'muzzle-energy-calculator',
    title: 'Muzzle Velocity & Energy Calculator',
    description:
      'Convert bullet weight and muzzle velocity into muzzle energy in both ft-lbf and Joules for ammunition comparison and legal compliance checks.',
    icon: '🔦',
    category: 'sports',
    subcategory: 'outdoor',
    tags: ['muzzle energy', 'ft-lbf', 'joules', 'ammunition', 'ballistics', 'stopping power', 'velocity'],
    inputs: [
      {
        id: 'bulletWeightGrains',
        label: 'Bullet Weight (grains)',
        type: 'number',
        defaultValue: 230,
        min: 20,
        max: 750,
        step: 1,
        placeholder: 'e.g. 230',
        required: true,
      },
      {
        id: 'muzzleVelocityFps',
        label: 'Muzzle Velocity (fps)',
        type: 'number',
        defaultValue: 830,
        min: 200,
        max: 5000,
        step: 10,
        placeholder: 'e.g. 830',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'muzzleEnergyFtLbf',
        expression: 'bulletWeightGrains * pow(muzzleVelocityFps, 2) / 450437',
        dependencies: ['bulletWeightGrains', 'muzzleVelocityFps'],
      },
      {
        id: 'muzzleEnergyJoules',
        expression: 'muzzleEnergyFtLbf * 1.35582',
        dependencies: ['muzzleEnergyFtLbf'],
      },
    ],
    outputs: [
      {
        id: 'out-muzzleEnergyFtLbf',
        label: 'Muzzle Energy',
        formulaRef: 'muzzleEnergyFtLbf',
        format: 'number',
        precision: 0,
        suffix: ' ft-lbf',
        highlight: true,
      },
      {
        id: 'out-muzzleEnergyJoules',
        label: 'Muzzle Energy (metric)',
        formulaRef: 'muzzleEnergyJoules',
        format: 'number',
        precision: 0,
        suffix: ' Joules',
      },
    ],
    guide: {
      whatIsIt:
        'Muzzle energy is the kinetic energy of a bullet at the moment it leaves the barrel, calculated as KE = �mv�. It is the most widely used single-number comparison metric for ammunition effectiveness and is also used in many jurisdictions to define legal minimum energy for hunting specific game.',
      howToUse:
        'Enter the bullet weight in grains (from the ammunition box) and the muzzle velocity in fps (also from the box or measured with a chronograph). The calculator converts to both ft-lbf (US standard) and Joules (metric/EU standard) instantly.',
      exampleScenario:
        '9mm 124-grain FMJ at 1,150 fps produces about 364 ft-lbf (494 J). A .45 ACP 230-grain at 830 fps delivers about 352 ft-lbf (477 J) � similar energy figures but delivered differently due to the velocity/mass tradeoff.',
      proTip:
        'Many European countries require a minimum of 2,000 J (1,476 ft-lbf) for deer hunting. In the US, common minimums are 1,000�1,500 ft-lbf for deer and 2,500 ft-lbf for elk. Always verify local hunting regulations. Muzzle energy alone does not determine terminal performance � bullet construction is equally important.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 4. Scope MOA / MRAD Adjustment Calculator
  // =========================================================================
  {
    id: 'scope-moa-mrad-calculator',
    slug: 'scope-moa-mrad-calculator',
    title: 'Scope MOA / MRAD Adjustment Calculator',
    description:
      'Convert a point-of-impact error at a known range into MOA and MRAD corrections, then calculate how many scope clicks to dial.',
    icon: '🔭',
    category: 'sports',
    subcategory: 'outdoor',
    tags: ['MOA', 'MRAD', 'scope', 'clicks', 'zero', 'adjustment', 'long range', 'turret', 'shooting'],
    inputs: [
      {
        id: 'pointOfImpactInches',
        label: 'POI Error (inches)',
        type: 'number',
        defaultValue: 3,
        step: 0.25,
        placeholder: 'e.g. 3',
        helpText: 'Positive = shot high or right. Negative = shot low or left.',
        required: true,
      },
      {
        id: 'rangeYards',
        label: 'Range (yards)',
        type: 'number',
        defaultValue: 100,
        min: 10,
        max: 2000,
        step: 10,
        placeholder: 'e.g. 100',
        required: true,
      },
      {
        id: 'clickValue',
        label: 'Scope Click Value',
        type: 'select',
        options: [
          { label: '1/4 MOA per click', value: '0.25' },
          { label: '1/8 MOA per click', value: '0.125' },
          { label: '0.1 MRAD per click', value: '0.1mrad' },
          { label: '1 MRAD per click', value: '1mrad' },
        ],
        defaultValue: '0.25',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'moaError',
        expression: 'pointOfImpactInches / 1.047 * (100 / rangeYards)',
        dependencies: ['pointOfImpactInches', 'rangeYards'],
      },
      {
        id: 'mradError',
        expression: 'pointOfImpactInches * 2.908 / rangeYards * 100',
        dependencies: ['pointOfImpactInches', 'rangeYards'],
      },
      {
        id: 'clicksMOA025',
        expression: 'round(moaError / 0.25)',
        dependencies: ['moaError'],
      },
      {
        id: 'clicksMOA0125',
        expression: 'round(moaError / 0.125)',
        dependencies: ['moaError'],
      },
      {
        id: 'clicksMRAD',
        expression: 'round(mradError / 0.1)',
        dependencies: ['mradError'],
      },
    ],
    outputs: [
      {
        id: 'out-moaError',
        label: 'MOA Correction',
        formulaRef: 'moaError',
        format: 'number',
        precision: 2,
        suffix: ' MOA',
      },
      {
        id: 'out-mradError',
        label: 'MRAD Correction',
        formulaRef: 'mradError',
        format: 'number',
        precision: 3,
        suffix: ' mrad',
      },
      {
        id: 'out-clicksMOA025',
        label: 'Clicks (1/4 MOA)',
        formulaRef: 'clicksMOA025',
        format: 'number',
        precision: 0,
        highlight: true,
      },
      {
        id: 'out-clicksMRAD',
        label: 'Clicks (0.1 MRAD)',
        formulaRef: 'clicksMRAD',
        format: 'number',
        precision: 0,
      },
    ],
    guide: {
      whatIsIt:
        'MOA (Minute of Angle) equals approximately 1.047 inches at 100 yards � or roughly 1 inch per 100 yards as a rule of thumb. MRAD (milliradian) equals 3.6 inches at 100 yards or 10 cm at 100 m. Scope turrets click in fractions of these units. This calculator converts a measured point-of-impact error into the exact number of clicks needed for a correction.',
      howToUse:
        'Fire a group at your target range, measure how far the group center is from your aiming point (in inches), enter the error and range, and select your scope\'s click value. The calculator shows MOA and MRAD corrections plus the exact click count.',
      exampleScenario:
        'Your 3-shot group at 200 yards is 4 inches low and 2 inches right. Elevation: 4 inches at 200 yards = 1.91 MOA = 7.64 clicks (1/4 MOA scope) � dial 8 clicks UP. Windage: 2 inches at 200 yards = 0.96 MOA = 3.8 clicks � dial 4 clicks RIGHT.',
      proTip:
        'Always track your corrections in a data book (DOPE card) so you can repeat known holds at distance. MRAD scopes pair naturally with metric measurements: 1 mrad = 10 cm at 100 m, making mental math intuitive. For competition shooting, 1/8 MOA clicks provide finer resolution at long range.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 5. Archery Draw Weight & Arrow Speed Calculator
  // =========================================================================
  {
    id: 'archery-draw-weight-calculator',
    slug: 'archery-draw-weight-calculator',
    title: 'Archery Draw Weight & Arrow Speed',
    description:
      'Estimate arrow speed, kinetic energy, and momentum from bow draw weight, draw length, arrow weight, and bow efficiency.',
    icon: '🏹',
    category: 'sports',
    subcategory: 'outdoor',
    tags: ['archery', 'bow', 'arrow speed', 'kinetic energy', 'draw weight', 'compound bow', 'hunting archery'],
    inputs: [
      {
        id: 'drawWeight',
        label: 'Draw Weight (lbs)',
        type: 'number',
        defaultValue: 60,
        min: 10,
        max: 100,
        step: 1,
        placeholder: 'e.g. 60',
        required: true,
      },
      {
        id: 'drawLength',
        label: 'Draw Length (inches)',
        type: 'number',
        defaultValue: 28,
        min: 18,
        max: 32,
        step: 0.5,
        placeholder: 'e.g. 28',
        required: true,
      },
      {
        id: 'arrowWeightGrains',
        label: 'Arrow Weight (grains)',
        type: 'number',
        defaultValue: 350,
        min: 200,
        max: 1000,
        step: 5,
        placeholder: 'e.g. 350',
        required: true,
      },
      {
        id: 'efficiency',
        label: 'Bow Efficiency %',
        type: 'number',
        defaultValue: 82,
        min: 50,
        max: 99,
        step: 1,
        placeholder: 'e.g. 82',
        helpText: 'Compound bow: 80�85%. Recurve: 70�80%. Longbow: 65�75%.',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'arrowSpeed',
        expression: 'sqrt(drawWeight * drawLength * efficiency / 100 * 2 / arrowWeightGrains * 450437)',
        dependencies: ['drawWeight', 'drawLength', 'efficiency', 'arrowWeightGrains'],
      },
      {
        id: 'kineticEnergy',
        expression: 'arrowWeightGrains * pow(arrowSpeed, 2) / 450437',
        dependencies: ['arrowWeightGrains', 'arrowSpeed'],
      },
      {
        id: 'momentum',
        expression: 'arrowWeightGrains * arrowSpeed / 225218',
        dependencies: ['arrowWeightGrains', 'arrowSpeed'],
      },
    ],
    outputs: [
      {
        id: 'out-arrowSpeed',
        label: 'Est. Arrow Speed',
        formulaRef: 'arrowSpeed',
        format: 'number',
        precision: 0,
        suffix: ' fps',
        highlight: true,
      },
      {
        id: 'out-kineticEnergy',
        label: 'Kinetic Energy',
        formulaRef: 'kineticEnergy',
        format: 'number',
        precision: 1,
        suffix: ' ft-lbf',
      },
      {
        id: 'out-momentum',
        label: 'Arrow Momentum',
        formulaRef: 'momentum',
        format: 'number',
        precision: 4,
        suffix: ' slug-fps',
      },
    ],
    guide: {
      whatIsIt:
        'Arrow speed is the most influential factor in trajectory and penetration. This calculator uses the work-energy theorem: the energy stored in the bow limbs (draw weight � draw length � efficiency) is converted into arrow kinetic energy. From speed, kinetic energy and momentum are derived � two key metrics for assessing hunting suitability.',
      howToUse:
        'Set your bow\'s peak draw weight, your draw length, the total finished arrow weight (shaft + insert + point + nock + fletching in grains), and your bow\'s efficiency percentage. Compound bows are typically 80�85% efficient. The results are ballpark estimates � a chronograph gives exact speed.',
      exampleScenario:
        'A 70-lb compound bow at 29-inch draw, 82% efficiency, launching a 400-grain arrow: estimated speed � 272 fps, KE � 65.7 ft-lbf, momentum � 0.483 slug-fps. Deer typically require 40+ ft-lbf; elk require 65+ ft-lbf � this setup is right on the elk minimum.',
      proTip:
        'Momentum (not kinetic energy) better predicts penetration depth on heavy game because heavier arrows retain energy better through hide and bone. For deer, a minimum of 0.40 slug-fps momentum is recommended. For elk or bear, aim for 0.50+. Never sacrifice arrow spine integrity chasing maximum speed.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 6. Arrow FOC (Front of Center) Calculator
  // =========================================================================
  {
    id: 'arrow-foc-calculator',
    slug: 'arrow-foc-calculator',
    title: 'Arrow FOC (Front of Center) Calculator',
    description:
      'Calculate the Front of Center percentage of an arrow to optimize flight stability and penetration for target, 3D, or hunting archery.',
    icon: '🏹',
    category: 'sports',
    subcategory: 'outdoor',
    tags: ['archery', 'FOC', 'front of center', 'arrow balance', 'arrow tuning', 'stability', 'broadhead'],
    inputs: [
      {
        id: 'arrowLengthIn',
        label: 'Arrow Length (inches)',
        type: 'number',
        defaultValue: 28,
        min: 18,
        max: 40,
        step: 0.25,
        placeholder: 'e.g. 28',
        required: true,
      },
      {
        id: 'balancePointIn',
        label: 'Balance Point from Nock (inches)',
        type: 'number',
        defaultValue: 17,
        min: 1,
        max: 39,
        step: 0.25,
        placeholder: 'e.g. 17',
        helpText: 'Balance the arrow on a horizontal edge and measure from the nock groove to that balance point.',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'centerPoint',
        expression: 'arrowLengthIn / 2',
        dependencies: ['arrowLengthIn'],
      },
      {
        id: 'foc',
        expression: '(balancePointIn - centerPoint) / arrowLengthIn * 100',
        dependencies: ['balancePointIn', 'centerPoint', 'arrowLengthIn'],
      },
    ],
    outputs: [
      {
        id: 'out-centerPoint',
        label: 'Arrow Center Point',
        formulaRef: 'centerPoint',
        format: 'number',
        precision: 1,
        suffix: ' inches from nock',
      },
      {
        id: 'out-foc',
        label: 'FOC %',
        formulaRef: 'foc',
        format: 'number',
        precision: 1,
        suffix: '%',
        highlight: true,
      },
    ],
    guide: {
      whatIsIt:
        'Front of Center (FOC) measures how far forward of the arrow\'s midpoint the balance point lies, expressed as a percentage of total arrow length. A higher FOC makes the arrow more stable in flight but can reduce glide distance. The sweet spot depends on your shooting discipline: target/3D archery: 10�15%, hunting: 12�19%, extreme penetration: 25%+.',
      howToUse:
        'Measure your complete arrow (with point, insert, nock, and fletching in place) from the nock groove to the tip. Then balance the arrow horizontally on a thin edge or fingertip and measure from the nock groove to the balance point. Enter both measurements.',
      exampleScenario:
        'A 28-inch arrow balanced at 17 inches from the nock: center is 14 inches, FOC = (17 - 14) / 28 � 100 = 10.7%. This is on the lower end of the hunting range. To increase FOC, switch to a heavier point (125-grain vs. 100-grain) or add weight to the insert.',
      proTip:
        'Heavy broadheads significantly raise FOC. If your FOC is too high (>25%) for target shooting, your arrow may plane into the wind and reduce accuracy. Conversely, a low FOC (<8%) can cause erratic flight � the arrow "fishscales" in the air. Test different point weights in 25-grain increments to find the optimum.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 7. Ski / Snowboard Length Sizing Calculator
  // =========================================================================
  {
    id: 'ski-snowboard-length-calculator',
    slug: 'ski-snowboard-length-calculator',
    title: 'Ski / Snowboard Length Sizing Calculator',
    description:
      'Find the recommended ski or snowboard length based on your height, weight, skill level, and riding discipline.',
    icon: '⛷',
    category: 'everyday',
    subcategory: 'lifestyle',
    tags: ['ski', 'snowboard', 'sizing', 'length', 'winter sports', 'snow', 'slope', 'beginner', 'advanced'],
    inputs: [
      {
        id: 'heightCm',
        label: 'Height (cm)',
        type: 'number',
        defaultValue: 175,
        min: 100,
        max: 220,
        step: 1,
        placeholder: 'e.g. 175',
        required: true,
      },
      {
        id: 'weightKg',
        label: 'Weight (kg)',
        type: 'number',
        defaultValue: 75,
        min: 20,
        max: 200,
        step: 1,
        placeholder: 'e.g. 75',
        required: true,
      },
      {
        id: 'skillLevel',
        label: 'Skill Level',
        type: 'select',
        options: [
          { label: 'Beginner (shorter)', value: '0.88' },
          { label: 'Intermediate', value: '0.92' },
          { label: 'Advanced (longer)', value: '0.96' },
        ],
        defaultValue: '0.92',
        required: true,
      },
      {
        id: 'discipline',
        label: 'Discipline',
        type: 'select',
        options: [
          { label: 'All-Mountain Ski', value: '1' },
          { label: 'Carving Ski (-5 cm)', value: '0.97' },
          { label: 'Powder Ski (+5 cm)', value: '1.03' },
          { label: 'Snowboard', value: '0.85' },
        ],
        defaultValue: '1',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'recommendedLengthCm',
        expression: 'heightCm * skillLevel * discipline',
        dependencies: ['heightCm', 'skillLevel', 'discipline'],
      },
    ],
    outputs: [
      {
        id: 'out-recommendedLengthCm',
        label: 'Recommended Length',
        formulaRef: 'recommendedLengthCm',
        format: 'number',
        precision: 0,
        suffix: ' cm',
        highlight: true,
      },
    ],
    guide: {
      whatIsIt:
        'Ski length affects how a ski turns, floats in powder, and feels at speed. Shorter skis are easier to maneuver for beginners; longer skis are more stable at high speed and in powder. The classic rule of thumb is chin-to-nose height, which this calculator formalizes with skill-level and discipline adjustments.',
      howToUse:
        'Enter your height and weight, select your ability level, and choose your riding style. The calculator returns a recommended length in centimetres. Round to the nearest available ski length (typically in 5 cm increments) when shopping.',
      exampleScenario:
        'An intermediate skier, 175 cm tall, skiing all-mountain: 175 � 0.92 � 1.00 = 161 cm recommended. An advanced rider of the same height on powder skis: 175 � 0.96 � 1.03 � 173 cm � almost their full height, as expected for deep snow.',
      proTip:
        'Weight matters too � heavier riders at the same height should lean toward the longer end of any recommended range for better edge hold. For snowboards, width is equally important: ensure your boot does not hang over the edge more than 1.5 cm. If you rent before buying, try a length 5 cm above and below this recommendation to compare.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 8. Wind Chill Factor Calculator
  // =========================================================================
  {
    id: 'wind-chill-factor-calculator',
    slug: 'wind-chill-factor-calculator',
    title: 'Wind Chill Factor Calculator',
    description:
      'Calculate the perceived air temperature accounting for wind chill using the North American/UK standard formula, valid for temperatures =10�C and wind speeds =5 km/h.',
    icon: '🧊',
    category: 'science',
    subcategory: 'physics',
    tags: ['wind chill', 'weather', 'cold', 'temperature', 'outdoor safety', 'hypothermia', 'meteorology'],
    inputs: [
      {
        id: 'temperatureC',
        label: 'Air Temperature (�C)',
        type: 'number',
        defaultValue: 0,
        min: -60,
        max: 10,
        step: 0.5,
        placeholder: 'e.g. 0',
        required: true,
      },
      {
        id: 'windSpeedKph',
        label: 'Wind Speed (km/h)',
        type: 'number',
        defaultValue: 30,
        min: 0,
        max: 300,
        step: 1,
        placeholder: 'e.g. 30',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'windChillC',
        expression: '13.12 + 0.6215 * temperatureC - 11.37 * pow(windSpeedKph, 0.16) + 0.3965 * temperatureC * pow(windSpeedKph, 0.16)',
        dependencies: ['temperatureC', 'windSpeedKph'],
      },
      {
        id: 'windChillF',
        expression: 'windChillC * 9 / 5 + 32',
        dependencies: ['windChillC'],
      },
      {
        id: 'feelsLikeDiff',
        expression: 'windChillC - temperatureC',
        dependencies: ['windChillC', 'temperatureC'],
      },
    ],
    outputs: [
      {
        id: 'out-windChillC',
        label: 'Wind Chill Temperature',
        formulaRef: 'windChillC',
        format: 'number',
        precision: 1,
        suffix: '�C feels like',
        highlight: true,
      },
      {
        id: 'out-windChillF',
        label: 'Wind Chill (�F)',
        formulaRef: 'windChillF',
        format: 'number',
        precision: 1,
        suffix: '�F',
      },
      {
        id: 'out-feelsLikeDiff',
        label: 'Feels Colder By',
        formulaRef: 'feelsLikeDiff',
        format: 'number',
        precision: 1,
        suffix: '�C colder',
      },
    ],
    guide: {
      whatIsIt:
        'Wind chill is the perceived decrease in air temperature felt by the body on exposed skin due to the flow of air. Wind accelerates heat loss from the body\'s surface � the same temperature feels significantly colder in a breeze than in still air. This calculator uses the Environment Canada / NOAA standard formula adopted in 2001.',
      howToUse:
        'Enter the actual air temperature in �C and the wind speed in km/h. The formula is valid for temperatures at or below 10�C and wind speeds at or above 5 km/h. For warmer temperatures, the heat index (humidex) is the relevant metric instead.',
      exampleScenario:
        'Hiking in -10�C air with a 40 km/h wind: wind chill � -20�C. Exposed skin can freeze in under 30 minutes in those conditions. Dressing for the wind chill � not just the thermometer � is critical for cold-weather outdoor safety.',
      proTip:
        'Frostbite risk thresholds: at wind chill below -28�C, exposed skin can freeze in 30 minutes. Below -40�C, freezing can occur in under 10 minutes. Layer up and cover all exposed skin � neck, ears, and cheeks are the most vulnerable. Moisture-wicking base layers are essential since wet clothing accelerates heat loss by up to 25�.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 9. Fishing Reel Line Capacity Calculator
  // =========================================================================
  {
    id: 'fishing-line-capacity-calculator',
    slug: 'fishing-line-capacity-calculator',
    title: 'Fishing Reel Line Capacity Calculator',
    description:
      'Estimate how much fishing line a reel can hold when you spool a line with a different test strength than the rated specification.',
    icon: '🐟',
    category: 'sports',
    subcategory: 'outdoor',
    tags: ['fishing', 'reel', 'line capacity', 'monofilament', 'braided line', 'spool', 'angling'],
    inputs: [
      {
        id: 'reelCapacityYards',
        label: 'Reel Rated Capacity (yards)',
        type: 'number',
        defaultValue: 200,
        min: 10,
        max: 2000,
        step: 10,
        placeholder: 'e.g. 200',
        helpText: 'From the reel spec sheet or spool, for the rated line test.',
        required: true,
      },
      {
        id: 'ratedLineLbTest',
        label: 'Reel Rated for Line Test (lb)',
        type: 'number',
        defaultValue: 10,
        min: 1,
        max: 200,
        step: 1,
        placeholder: 'e.g. 10',
        helpText: 'The pound-test the reel capacity was specified at.',
        required: true,
      },
      {
        id: 'actualLineLbTest',
        label: 'Your Line Test (lb)',
        type: 'number',
        defaultValue: 15,
        min: 1,
        max: 200,
        step: 1,
        placeholder: 'e.g. 15',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'diameterRatio',
        expression: 'sqrt(actualLineLbTest / ratedLineLbTest)',
        dependencies: ['actualLineLbTest', 'ratedLineLbTest'],
      },
      {
        id: 'estimatedCapacity',
        expression: 'reelCapacityYards / pow(diameterRatio, 2)',
        dependencies: ['reelCapacityYards', 'diameterRatio'],
      },
    ],
    outputs: [
      {
        id: 'out-estimatedCapacity',
        label: 'Estimated Capacity with Your Line',
        formulaRef: 'estimatedCapacity',
        format: 'number',
        precision: 0,
        suffix: ' yards',
        highlight: true,
      },
      {
        id: 'out-diameterRatio',
        label: 'Diameter Ratio',
        formulaRef: 'diameterRatio',
        format: 'number',
        precision: 3,
      },
    ],
    guide: {
      whatIsIt:
        'Fishing line diameter scales roughly with the square root of breaking strength. If you spool a heavier line than the reel was rated for, less line fits on the spool � and vice versa. This calculator estimates capacity using the diameter-squared relationship: capacity is inversely proportional to the square of the line diameter ratio.',
      howToUse:
        'Find the reel\'s rated capacity from the spool or manufacturer spec (e.g., "200 yards of 10 lb mono"). Enter that capacity, the rated line test, and your actual line\'s test strength. The estimated yard count you can spool is displayed.',
      exampleScenario:
        'A reel rated for 200 yards of 10 lb line. You want to use 20 lb test: diameter ratio = v(20/10) = 1.414. Estimated capacity = 200 / 1.414� � 100 yards � exactly half. Conversely, 6 lb line would give approximately 333 yards on the same reel.',
      proTip:
        'Braided line has a significantly smaller diameter per pound-test than monofilament. A 20-lb braid may have the same diameter as 6-lb mono, so you can fit much more braid on the same spool. Many reels list separate capacities for mono and braid � always use the correct rated line type when calculating.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 10. Kayak Paddle Length Calculator
  // =========================================================================
  {
    id: 'kayak-paddle-length-calculator',
    slug: 'kayak-paddle-length-calculator',
    title: 'Kayak Paddle Length Calculator',
    description:
      'Find your ideal kayak paddle length based on torso height, kayak width, and preferred stroke angle for efficient paddling.',
    icon: '🛶',
    category: 'sports',
    subcategory: 'outdoor',
    tags: ['kayak', 'paddle', 'length', 'sizing', 'paddling', 'canoe', 'water sports', 'touring'],
    inputs: [
      {
        id: 'torsoHeightCm',
        label: 'Torso Height (cm)',
        type: 'number',
        defaultValue: 70,
        min: 40,
        max: 110,
        step: 1,
        placeholder: 'e.g. 70',
        helpText: 'Sit upright, measure from the seat surface to the tip of your nose.',
        required: true,
      },
      {
        id: 'kayakWidthCm',
        label: 'Kayak Width (cm)',
        type: 'number',
        defaultValue: 60,
        min: 40,
        max: 100,
        step: 1,
        placeholder: 'e.g. 60',
        helpText: 'Maximum beam (width) of the kayak at the widest point.',
        required: true,
      },
      {
        id: 'strokeStyle',
        label: 'Stroke Style',
        type: 'select',
        options: [
          { label: 'High angle (touring / performance)', value: '0' },
          { label: 'Low angle (recreational / leisure)', value: '10' },
        ],
        defaultValue: '0',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'recommendedLengthCm',
        expression: 'torsoHeightCm * 2 + kayakWidthCm * 0.5 + strokeStyle',
        dependencies: ['torsoHeightCm', 'kayakWidthCm', 'strokeStyle'],
      },
    ],
    outputs: [
      {
        id: 'out-recommendedLengthCm',
        label: 'Recommended Paddle Length',
        formulaRef: 'recommendedLengthCm',
        format: 'number',
        precision: 0,
        suffix: ' cm',
        highlight: true,
      },
    ],
    guide: {
      whatIsIt:
        'Paddle length is the primary fit dimension for kayak paddles. Too short and you\'ll hit the deck or scrape your knuckles; too long and you\'ll waste energy. The two main factors are your torso height (how high your hands are above the water) and the kayak\'s width (how far out you need to reach). Stroke style also matters: a high-angle stroke is more vertical, requiring a shorter, broader paddle, while low-angle touring uses a longer, narrower blade.',
      howToUse:
        'Sit up straight and measure from the seat (or your sitting surface) to the tip of your nose � this is your torso height. Find your kayak\'s maximum beam (width) in its spec sheet. Select your preferred stroke style. The calculator provides a recommended paddle length in centimetres.',
      exampleScenario:
        'A paddler with a 70 cm torso in a 60 cm wide sea kayak using a high-angle stroke: 70 � 2 + 60 � 0.5 + 0 = 170 cm. Switching to a recreational low-angle style adds 10 cm: 180 cm is the recommendation � matching standard touring paddle ranges.',
      proTip:
        'Paddle length increments are typically 5 cm (210, 215, 220, 225, 230 cm). If your result falls between sizes, choose shorter for high-angle efficiency and longer for low-angle comfort. Lighter paddles (carbon fibre) reduce fatigue significantly over multi-day tours � worth the investment if you paddle more than 10 hours a week.',
    },
    metadata: { version: '1.0.0' },
  },
];
