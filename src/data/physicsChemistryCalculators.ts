// ---------------------------------------------------------------------------
// Quantify — Physics & Chemistry Calculators
// ---------------------------------------------------------------------------
// 11 science calculators covering mechanics, thermodynamics, waves,
// nuclear physics, and general chemistry.
// ---------------------------------------------------------------------------

import type { CalculatorSchema } from '@/types/calculator';

export const physicsChemistryCalculators: CalculatorSchema[] = [
  // =========================================================================
  // 1. Kinematics (SUVAT) Calculator
  // =========================================================================
  {
    id: 'kinematics-calculator',
    slug: 'kinematics-calculator',
    title: 'Kinematics (SUVAT) Calculator',
    description:
      'Solve SUVAT kinematics equations for displacement, velocity, acceleration, and time from any three known values.',
    icon: '🚀',
    category: 'science',
    subcategory: 'kinematics',
    tags: ['kinematics', 'suvat', 'velocity', 'acceleration', 'displacement', 'physics'],
    inputs: [
      {
        id: 's',
        label: 'Displacement (s)',
        type: 'number',
        defaultValue: 0,
        placeholder: 'e.g. 100',
        helpText: 'Meters',
      },
      {
        id: 'u',
        label: 'Initial Velocity (u)',
        type: 'number',
        defaultValue: 0,
        placeholder: 'e.g. 0',
        helpText: 'm/s',
      },
      {
        id: 'v',
        label: 'Final Velocity (v)',
        type: 'number',
        defaultValue: 20,
        placeholder: 'e.g. 20',
        helpText: 'm/s',
      },
      {
        id: 'a',
        label: 'Acceleration (a)',
        type: 'number',
        defaultValue: 2,
        placeholder: 'e.g. 2',
        helpText: 'm/s²',
      },
      {
        id: 't',
        label: 'Time (t)',
        type: 'number',
        defaultValue: 10,
        placeholder: 'e.g. 10',
        helpText: 'Seconds',
      },
    ],
    formulas: [
      // v² = u² + 2as  →  s = (v²-u²)/(2a)
      {
        id: 'sFromUVA',
        expression: '(pow(v,2) - pow(u,2)) / (2 * a)',
        dependencies: ['v', 'u', 'a'],
      },
      // v = u + at
      {
        id: 'vFromUAT',
        expression: 'u + a * t',
        dependencies: ['u', 'a', 't'],
      },
      // s = ut + ½at²
      {
        id: 'sFromUAT',
        expression: 'u * t + 0.5 * a * pow(t,2)',
        dependencies: ['u', 'a', 't'],
      },
      // a = (v-u)/t
      {
        id: 'aFromUVT',
        expression: '(v - u) / t',
        dependencies: ['v', 'u', 't'],
      },
      // t = (v-u)/a  (guard against a=0)
      {
        id: 'tFromUVA',
        expression: 'a != 0 ? (v - u) / a : 0',
        dependencies: ['v', 'u', 'a'],
      },
    ],
    outputs: [
      {
        id: 'sOut',
        label: 'Displacement (s)',
        formulaRef: 'sFromUVA',
        precision: 3,
        suffix: ' m',
        highlight: true,
      },
      {
        id: 'vOut',
        label: 'Final Velocity (v)',
        formulaRef: 'vFromUAT',
        precision: 3,
        suffix: ' m/s',
      },
      {
        id: 'sFromUATOut',
        label: 'Displacement from u, a, t',
        formulaRef: 'sFromUAT',
        precision: 3,
        suffix: ' m',
      },
      {
        id: 'aOut',
        label: 'Acceleration (a)',
        formulaRef: 'aFromUVT',
        precision: 3,
        suffix: ' m/s²',
      },
      {
        id: 'tOut',
        label: 'Time (t)',
        formulaRef: 'tFromUVA',
        precision: 3,
        suffix: ' s',
      },
    ],
    guide: {
      whatIsIt:
        'SUVAT equations describe the motion of an object under constant (uniform) acceleration. The five variables are: s (displacement), u (initial velocity), v (final velocity), a (acceleration), and t (time). Any three known values determine the remaining two.',
      howToUse:
        'Enter the values you know into the corresponding fields. You only need three inputs to uniquely determine the rest. Each output row is computed from a different combination of inputs — choose the row that matches your known values. The five classic equations are: (1) v = u + at, (2) s = ut + ½at², (3) v² = u² + 2as, (4) s = ½(u+v)t, (5) s = vt − ½at².',
      exampleScenario:
        'A car starts from rest (u = 0) and accelerates at 2 m/s² for 10 seconds. Enter u = 0, a = 2, t = 10. The "Final Velocity" output gives v = 20 m/s, and "Displacement from u,a,t" gives s = 100 m — the car has travelled 100 metres and is now moving at 72 km/h.',
      proTip:
        'SUVAT equations apply only under constant acceleration. For variable acceleration (e.g., rocket thrust), you need calculus or numerical integration. Always check that your three known values are mutually consistent; contradictory inputs will produce physically meaningless results.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 2. Density Calculator
  // =========================================================================
  {
    id: 'density-calculator',
    slug: 'density-calculator',
    title: 'Density Calculator',
    description:
      'Calculate density, mass, or volume using ρ = m/V. Includes common material density reference values.',
    icon: '⚖️',
    category: 'science',
    subcategory: 'physics',
    tags: ['density', 'mass', 'volume', 'buoyancy', 'physics', 'material science'],
    inputs: [
      {
        id: 'solveFor',
        label: 'Solve For',
        type: 'select',
        options: [
          { label: 'Density (ρ)', value: '0' },
          { label: 'Mass (m)', value: '1' },
          { label: 'Volume (V)', value: '2' },
        ],
        defaultValue: '0',
      },
      {
        id: 'mass',
        label: 'Mass (m)',
        type: 'number',
        defaultValue: 500,
        units: [
          { label: 'kg', value: 'kg' },
          { label: 'g', value: 'g', conversionFactor: '0.001' },
          { label: 'lb', value: 'lb', conversionFactor: '0.453592' },
        ],
      },
      {
        id: 'volume',
        label: 'Volume (V)',
        type: 'number',
        defaultValue: 0.5,
        step: 0.001,
        units: [
          { label: 'm³', value: 'm3' },
          { label: 'L', value: 'L', conversionFactor: '0.001' },
          { label: 'cm³', value: 'cm3', conversionFactor: '0.000001' },
        ],
      },
      {
        id: 'density',
        label: 'Density (ρ)',
        type: 'number',
        defaultValue: 1000,
        step: 0.01,
        helpText: 'kg/m³ — water = 1000, iron = 7874, air = 1.225',
      },
    ],
    formulas: [
      {
        id: 'densityResult',
        expression: 'mass / volume',
        dependencies: ['mass', 'volume'],
      },
      {
        id: 'massResult',
        expression: 'density * volume',
        dependencies: ['density', 'volume'],
      },
      {
        id: 'volumeResult',
        expression: 'mass / density',
        dependencies: ['mass', 'density'],
      },
      {
        id: 'output',
        expression:
          'solveFor == 0 ? densityResult : (solveFor == 1 ? massResult : volumeResult)',
        dependencies: ['solveFor', 'densityResult', 'massResult', 'volumeResult'],
      },
    ],
    outputs: [
      {
        id: 'outputResult',
        label: 'Result',
        formulaRef: 'output',
        precision: 4,
        highlight: true,
      },
      {
        id: 'densOut',
        label: 'Density',
        formulaRef: 'densityResult',
        precision: 4,
        suffix: ' kg/m³',
      },
      {
        id: 'massOut',
        label: 'Mass',
        formulaRef: 'massResult',
        precision: 3,
        suffix: ' kg',
      },
      {
        id: 'volOut',
        label: 'Volume',
        formulaRef: 'volumeResult',
        precision: 6,
        suffix: ' m³',
      },
    ],
    guide: {
      whatIsIt:
        "Density (ρ) is the amount of mass packed into a unit of volume, expressed as ρ = m/V. It is a fundamental property of matter and governs whether an object floats or sinks (Archimedes' principle). Common densities: water = 1000 kg/m³, iron = 7874 kg/m³, gold = 19,300 kg/m³, air = 1.225 kg/m³, balsa wood ≈ 120 kg/m³.",
      howToUse:
        'Select the quantity you want to solve for (Density, Mass, or Volume) from the dropdown. Then enter the two known values — the calculator fills in all three results simultaneously.',
      exampleScenario:
        'You have a block of aluminium weighing 2.7 kg and occupying 0.001 m³ (1 litre). Select "Density", enter mass = 2.7 kg and volume = 0.001 m³. The density comes out to 2700 kg/m³, consistent with the known density of aluminium.',
      proTip:
        "Archimedes' principle: an object immersed in a fluid experiences an upward buoyant force equal to the weight of the fluid it displaces. If the object's average density is less than the fluid's, it floats. This is why a steel ship (average density < 1000 kg/m³ due to hollow interior) floats on water.",
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 3. Molarity Calculator
  // =========================================================================
  {
    id: 'molarity-calculator',
    slug: 'molarity-calculator',
    title: 'Molarity Calculator',
    description:
      'Calculate molarity, moles of solute, or volume of solution using M = n/V.',
    icon: '⚗️',
    category: 'science',
    subcategory: 'chemistry',
    tags: ['molarity', 'moles', 'concentration', 'solution', 'chemistry', 'mol/L'],
    inputs: [
      {
        id: 'solveFor',
        label: 'Solve For',
        type: 'select',
        options: [
          { label: 'Molarity (M)', value: '0' },
          { label: 'Moles (n)', value: '1' },
          { label: 'Volume (V)', value: '2' },
        ],
        defaultValue: '0',
      },
      {
        id: 'moles',
        label: 'Moles of Solute (n)',
        type: 'number',
        defaultValue: 0.5,
        step: 0.001,
      },
      {
        id: 'volumeL',
        label: 'Volume of Solution (V)',
        type: 'number',
        defaultValue: 1,
        step: 0.001,
        helpText: 'In liters',
      },
      {
        id: 'molarity',
        label: 'Molarity (M)',
        type: 'number',
        defaultValue: 0.5,
        step: 0.001,
        helpText: 'mol/L',
      },
    ],
    formulas: [
      {
        id: 'molarityCalc',
        expression: 'moles / volumeL',
        dependencies: ['moles', 'volumeL'],
      },
      {
        id: 'molesCalc',
        expression: 'molarity * volumeL',
        dependencies: ['molarity', 'volumeL'],
      },
      {
        id: 'volumeCalc',
        expression: 'moles / molarity',
        dependencies: ['moles', 'molarity'],
      },
      {
        id: 'result',
        expression:
          'solveFor == 0 ? molarityCalc : (solveFor == 1 ? molesCalc : volumeCalc)',
        dependencies: ['solveFor', 'molarityCalc', 'molesCalc', 'volumeCalc'],
      },
    ],
    outputs: [
      {
        id: 'resultOut',
        label: 'Result',
        formulaRef: 'result',
        precision: 4,
        highlight: true,
      },
      {
        id: 'molarityOut',
        label: 'Molarity (M)',
        formulaRef: 'molarityCalc',
        precision: 4,
        suffix: ' mol/L',
      },
      {
        id: 'molesOut',
        label: 'Moles (n)',
        formulaRef: 'molesCalc',
        precision: 4,
        suffix: ' mol',
      },
      {
        id: 'volumeOut',
        label: 'Volume (V)',
        formulaRef: 'volumeCalc',
        precision: 4,
        suffix: ' L',
      },
    ],
    guide: {
      whatIsIt:
        'Molarity (M) measures the concentration of a solute in a solution as moles of solute per litre of solution: M = n/V. It is the most widely used concentration unit in chemistry, biology, and pharmacy. Note: molarity (mol/L) differs from molality (mol/kg of solvent) — molality does not change with temperature, while molarity does.',
      howToUse:
        'Select the variable you want to solve for, then enter the other two known values. Switch between Molarity, Moles, and Volume modes freely.',
      exampleScenario:
        'You dissolve 0.5 mol of NaCl into 1 litre of water. Select "Molarity", enter moles = 0.5 and volume = 1 L. The result is 0.5 mol/L — a 0.5 M saline solution (physiological saline is ~0.154 M).',
      proTip:
        'Dilution shortcut: when diluting a solution, the moles of solute stay constant, so C₁V₁ = C₂V₂. For example, to prepare 500 mL of 0.1 M HCl from a 1 M stock: V₁ = (0.1 × 0.5) / 1 = 0.05 L = 50 mL of stock, then top up to 500 mL with distilled water.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 4. Half-Life Calculator
  // =========================================================================
  {
    id: 'half-life-calculator',
    slug: 'half-life-calculator',
    title: 'Half-Life Calculator',
    description:
      'Calculate remaining quantity, elapsed time, or number of half-lives for radioactive decay using N(t) = N₀ × (½)^(t/t½).',
    icon: '☢️',
    category: 'science',
    subcategory: 'chemistry',
    tags: ['half life', 'radioactive decay', 'nuclear', 'carbon dating', 'exponential decay'],
    inputs: [
      {
        id: 'initialAmount',
        label: 'Initial Amount (N₀)',
        type: 'number',
        defaultValue: 100,
        helpText: 'Any unit (grams, atoms, %)',
      },
      {
        id: 'halfLife',
        label: 'Half-Life Period',
        type: 'number',
        defaultValue: 5730,
        helpText: 'In same time units as elapsed time',
      },
      {
        id: 'elapsedTime',
        label: 'Elapsed Time',
        type: 'number',
        defaultValue: 11460,
      },
    ],
    formulas: [
      // Number of half-lives elapsed
      {
        id: 'numHalfLives',
        expression: 'elapsedTime / halfLife',
        dependencies: ['elapsedTime', 'halfLife'],
      },
      // N(t) = N₀ × (0.5)^n
      {
        id: 'remaining',
        expression: 'initialAmount * pow(0.5, numHalfLives)',
        dependencies: ['initialAmount', 'numHalfLives'],
      },
      {
        id: 'decayed',
        expression: 'initialAmount - remaining',
        dependencies: ['initialAmount', 'remaining'],
      },
      {
        id: 'percentRemaining',
        expression: 'remaining / initialAmount * 100',
        dependencies: ['remaining', 'initialAmount'],
      },
    ],
    outputs: [
      {
        id: 'remainingOut',
        label: 'Remaining Amount',
        formulaRef: 'remaining',
        precision: 4,
        highlight: true,
      },
      {
        id: 'percentOut',
        label: 'Percent Remaining',
        formulaRef: 'percentRemaining',
        precision: 2,
        suffix: '%',
      },
      {
        id: 'decayedOut',
        label: 'Amount Decayed',
        formulaRef: 'decayed',
        precision: 4,
      },
      {
        id: 'halvesOut',
        label: 'Number of Half-Lives',
        formulaRef: 'numHalfLives',
        precision: 2,
      },
    ],
    guide: {
      whatIsIt:
        'Radioactive decay is the spontaneous breakdown of an unstable atomic nucleus. The half-life (t½) is the time required for exactly half of a given quantity of a radioactive isotope to decay. The governing equation is N(t) = N₀ × (½)^(t/t½). After one half-life, 50% remains; after two, 25%; after ten, ~0.1%.',
      howToUse:
        'Enter the initial amount (in any unit — the result uses the same unit), the half-life period, and the elapsed time. Use the same time unit for half-life and elapsed time (e.g., both in years).',
      exampleScenario:
        'Carbon-14 has a half-life of 5,730 years. A fossil contains 25% of the original C-14. Enter initial = 100, half-life = 5730, elapsed = 11460 (two half-lives). Remaining = 25, confirming the sample is approximately 11,460 years old.',
      proTip:
        'Common isotopes and their half-lives: Carbon-14 = 5,730 yr (archaeology), Uranium-238 = 4.47 billion yr (geology), Iodine-131 = 8 days (medical imaging), Technetium-99m = 6 hours (diagnostic imaging). In medicine, isotopes with short half-lives are preferred to minimise radiation dose to the patient.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 5. Kinetic & Potential Energy Calculator
  // =========================================================================
  {
    id: 'energy-calculator',
    slug: 'energy-calculator',
    title: 'Kinetic & Potential Energy Calculator',
    description:
      'Calculate kinetic energy (KE = ½mv²) and gravitational potential energy (PE = mgh). Understand energy conservation.',
    icon: '⚡',
    category: 'science',
    subcategory: 'physics',
    tags: ['kinetic energy', 'potential energy', 'ke', 'pe', 'energy', 'joules', 'physics'],
    inputs: [
      {
        id: 'mass',
        label: 'Mass (m)',
        type: 'number',
        defaultValue: 10,
        units: [
          { label: 'kg', value: 'kg' },
          { label: 'g', value: 'g', conversionFactor: '0.001' },
          { label: 'lb', value: 'lb', conversionFactor: '0.453592' },
        ],
      },
      {
        id: 'velocity',
        label: 'Velocity (v)',
        type: 'number',
        defaultValue: 20,
        units: [
          { label: 'm/s', value: 'ms' },
          { label: 'km/h', value: 'kmh', conversionFactor: '0.27778' },
          { label: 'mph', value: 'mph', conversionFactor: '0.44704' },
        ],
      },
      {
        id: 'height',
        label: 'Height (h)',
        type: 'number',
        defaultValue: 10,
        units: [
          { label: 'm', value: 'm' },
          { label: 'ft', value: 'ft', conversionFactor: '0.3048' },
        ],
      },
      {
        id: 'gravity',
        label: 'Gravity (g)',
        type: 'select',
        options: [
          { label: 'Earth (9.81 m/s²)', value: '9.81' },
          { label: 'Moon (1.62 m/s²)', value: '1.62' },
          { label: 'Mars (3.72 m/s²)', value: '3.72' },
        ],
        defaultValue: '9.81',
      },
    ],
    formulas: [
      // KE = ½mv²
      {
        id: 'ke',
        expression: '0.5 * mass * pow(velocity, 2)',
        dependencies: ['mass', 'velocity'],
      },
      // PE = mgh
      {
        id: 'pe',
        expression: 'mass * gravity * height',
        dependencies: ['mass', 'gravity', 'height'],
      },
      {
        id: 'totalE',
        expression: 'ke + pe',
        dependencies: ['ke', 'pe'],
      },
    ],
    outputs: [
      {
        id: 'keOut',
        label: 'Kinetic Energy (KE)',
        formulaRef: 'ke',
        precision: 2,
        suffix: ' J',
        highlight: true,
      },
      {
        id: 'peOut',
        label: 'Potential Energy (PE)',
        formulaRef: 'pe',
        precision: 2,
        suffix: ' J',
        highlight: true,
      },
      {
        id: 'totalOut',
        label: 'Total Mechanical Energy',
        formulaRef: 'totalE',
        precision: 2,
        suffix: ' J',
      },
    ],
    guide: {
      whatIsIt:
        "Kinetic energy (KE = ½mv²) is the energy an object possesses due to its motion. Gravitational potential energy (PE = mgh) is stored energy due to an object's position in a gravitational field. Together, they form mechanical energy, which is conserved in the absence of friction and air resistance.",
      howToUse:
        "Enter the object's mass, velocity, and height above the reference level. Select the gravitational field strength (Earth, Moon, or Mars). KE and PE are computed independently; their sum is the total mechanical energy.",
      exampleScenario:
        'A 10 kg roller-coaster car travels at 20 m/s at a height of 10 m above the ground. KE = ½ × 10 × 20² = 2000 J. PE = 10 × 9.81 × 10 = 981 J. Total mechanical energy = 2981 J. If the car descends to ground level with no friction, all PE converts to KE, giving a final speed of √(2 × 2981 / 10) ≈ 24.4 m/s.',
      proTip:
        'The work-energy theorem states that the net work done on an object equals its change in kinetic energy (W = ΔKE). On the Moon, gravitational PE is much lower for the same height, which is why Apollo astronauts could jump so much higher despite wearing heavy suits.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 6. Ideal Gas Law Calculator
  // =========================================================================
  {
    id: 'ideal-gas-law',
    slug: 'ideal-gas-law',
    title: 'Ideal Gas Law Calculator',
    description:
      'Solve the Ideal Gas Law PV = nRT for any one unknown variable given the other three.',
    icon: '💨',
    category: 'science',
    subcategory: 'chemistry',
    tags: ['ideal gas', 'pv=nrt', 'pressure', 'volume', 'temperature', 'chemistry', 'gas law'],
    inputs: [
      {
        id: 'solveFor',
        label: 'Solve For',
        type: 'select',
        options: [
          { label: 'Pressure (P)', value: '0' },
          { label: 'Volume (V)', value: '1' },
          { label: 'Moles (n)', value: '2' },
          { label: 'Temperature (T)', value: '3' },
        ],
        defaultValue: '0',
      },
      {
        id: 'pressure',
        label: 'Pressure (P)',
        type: 'number',
        defaultValue: 101325,
        helpText: 'In Pascals (1 atm = 101325 Pa)',
      },
      {
        id: 'volume',
        label: 'Volume (V)',
        type: 'number',
        defaultValue: 0.0224,
        step: 0.0001,
        helpText: 'In cubic meters (m³)',
      },
      {
        id: 'moles',
        label: 'Amount (n)',
        type: 'number',
        defaultValue: 1,
        step: 0.001,
        helpText: 'In moles',
      },
      {
        id: 'tempK',
        label: 'Temperature (T)',
        type: 'number',
        defaultValue: 273.15,
        step: 0.01,
        helpText: 'In Kelvin (°C + 273.15)',
      },
    ],
    formulas: [
      // Universal gas constant R = 8.314 J/(mol·K)
      {
        id: 'R',
        expression: '8.314',
        dependencies: [],
      },
      // P = nRT/V
      {
        id: 'pCalc',
        expression: 'moles * R * tempK / volume',
        dependencies: ['moles', 'tempK', 'volume', 'R'],
      },
      // V = nRT/P
      {
        id: 'vCalc',
        expression: 'moles * R * tempK / pressure',
        dependencies: ['moles', 'tempK', 'pressure', 'R'],
      },
      // n = PV/(RT)
      {
        id: 'nCalc',
        expression: 'pressure * volume / (R * tempK)',
        dependencies: ['pressure', 'volume', 'tempK', 'R'],
      },
      // T = PV/(nR)
      {
        id: 'tCalc',
        expression: 'pressure * volume / (moles * R)',
        dependencies: ['pressure', 'volume', 'moles', 'R'],
      },
      {
        id: 'result',
        expression:
          'solveFor == 0 ? pCalc : (solveFor == 1 ? vCalc : (solveFor == 2 ? nCalc : tCalc))',
        dependencies: ['solveFor', 'pCalc', 'vCalc', 'nCalc', 'tCalc'],
      },
    ],
    outputs: [
      {
        id: 'resultOut',
        label: 'Result',
        formulaRef: 'result',
        precision: 4,
        highlight: true,
      },
      {
        id: 'pOut',
        label: 'Pressure (P)',
        formulaRef: 'pCalc',
        precision: 2,
        suffix: ' Pa',
      },
      {
        id: 'vOut',
        label: 'Volume (V)',
        formulaRef: 'vCalc',
        precision: 6,
        suffix: ' m³',
      },
      {
        id: 'nOut',
        label: 'Moles (n)',
        formulaRef: 'nCalc',
        precision: 4,
        suffix: ' mol',
      },
      {
        id: 'tOut',
        label: 'Temperature (T)',
        formulaRef: 'tCalc',
        precision: 2,
        suffix: ' K',
      },
    ],
    guide: {
      whatIsIt:
        'The Ideal Gas Law PV = nRT relates pressure (P), volume (V), moles (n), and absolute temperature (T) for an ideal gas. R = 8.314 J/(mol·K) is the universal gas constant. At STP (0°C, 1 atm) one mole of ideal gas occupies ~22.4 L; at SATP (25°C, 100 kPa) it occupies ~24.8 L.',
      howToUse:
        'Select the variable you want to solve for, then fill in the other three. All inputs must use SI units: Pascals, cubic metres, moles, and Kelvin. To convert: 1 atm = 101325 Pa; °C to K by adding 273.15; 1 litre = 0.001 m³.',
      exampleScenario:
        'How many moles are in a 5 L balloon at 25°C and 1 atm? Select "Moles", enter P = 101325 Pa, V = 0.005 m³, T = 298.15 K. Result: n = PV/(RT) = 101325 × 0.005 / (8.314 × 298.15) ≈ 0.204 mol.',
      proTip:
        "Real gases deviate from ideal behaviour at high pressures and low temperatures. The van der Waals equation adds correction terms for intermolecular attractions and finite molecular volume. Boyle's Law (T constant: P₁V₁ = P₂V₂), Charles's Law (P constant: V₁/T₁ = V₂/T₂), and Gay-Lussac's Law (V constant: P₁/T₁ = P₂/T₂) are all special cases of PV = nRT.",
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 7. Projectile Motion Calculator
  // =========================================================================
  {
    id: 'projectile-motion',
    slug: 'projectile-motion',
    title: 'Projectile Motion Calculator',
    description:
      'Calculate projectile motion parameters — maximum range, maximum height, time of flight, and landing velocity for any launch angle and speed.',
    icon: '🎯',
    category: 'science',
    subcategory: 'kinematics',
    tags: ['projectile', 'motion', 'range', 'trajectory', 'angle', 'physics'],
    inputs: [
      {
        id: 'v0',
        label: 'Launch Speed',
        type: 'number',
        defaultValue: 30,
        units: [
          { label: 'm/s', value: 'ms' },
          { label: 'km/h', value: 'kmh', conversionFactor: '0.27778' },
        ],
      },
      {
        id: 'angle',
        label: 'Launch Angle (degrees)',
        type: 'number',
        defaultValue: 45,
        min: 0,
        max: 90,
      },
      {
        id: 'h0',
        label: 'Initial Height',
        type: 'number',
        defaultValue: 0,
        helpText: 'Height above ground (m)',
      },
    ],
    formulas: [
      // Convert degrees to radians
      {
        id: 'rad',
        expression: 'angle * PI / 180',
        dependencies: ['angle'],
      },
      // Horizontal velocity component
      {
        id: 'vx',
        expression: 'v0 * cos(rad)',
        dependencies: ['v0', 'rad'],
      },
      // Vertical velocity component
      {
        id: 'vy',
        expression: 'v0 * sin(rad)',
        dependencies: ['v0', 'rad'],
      },
      // Maximum height: h0 + vy²/(2g)
      {
        id: 'maxHeight',
        expression: 'h0 + pow(vy, 2) / (2 * 9.81)',
        dependencies: ['h0', 'vy'],
      },
      // Time of flight via quadratic: t = (vy + sqrt(vy² + 2g·h0)) / g
      {
        id: 'timeOfFlight',
        expression: '(vy + sqrt(pow(vy, 2) + 2 * 9.81 * h0)) / 9.81',
        dependencies: ['vy', 'h0'],
      },
      // Horizontal range
      {
        id: 'range',
        expression: 'vx * timeOfFlight',
        dependencies: ['vx', 'timeOfFlight'],
      },
      // Horizontal landing component (unchanged)
      {
        id: 'vxLand',
        expression: 'vx',
        dependencies: ['vx'],
      },
      // Vertical landing component: vy - g*t
      {
        id: 'vyLand',
        expression: 'vy - 9.81 * timeOfFlight',
        dependencies: ['vy', 'timeOfFlight'],
      },
      // Landing speed magnitude
      {
        id: 'landSpeed',
        expression: 'sqrt(pow(vxLand, 2) + pow(vyLand, 2))',
        dependencies: ['vxLand', 'vyLand'],
      },
    ],
    outputs: [
      {
        id: 'rangeOut',
        label: 'Horizontal Range',
        formulaRef: 'range',
        precision: 2,
        suffix: ' m',
        highlight: true,
      },
      {
        id: 'maxHOut',
        label: 'Maximum Height',
        formulaRef: 'maxHeight',
        precision: 2,
        suffix: ' m',
      },
      {
        id: 'tofOut',
        label: 'Time of Flight',
        formulaRef: 'timeOfFlight',
        precision: 2,
        suffix: ' s',
      },
      {
        id: 'landSpeedOut',
        label: 'Landing Speed',
        formulaRef: 'landSpeed',
        precision: 2,
        suffix: ' m/s',
      },
    ],
    guide: {
      whatIsIt:
        'Projectile motion describes the curved path of an object launched with an initial velocity under constant gravitational acceleration (g = 9.81 m/s² on Earth). The horizontal and vertical components are independent: horizontal velocity stays constant (no air resistance), while vertical velocity changes due to gravity.',
      howToUse:
        'Enter the launch speed, the launch angle (0° = horizontal, 90° = straight up), and the initial height above the landing surface. Results include horizontal range, maximum height, total flight time, and speed at landing.',
      exampleScenario:
        'A ball is kicked at 30 m/s at 45° from ground level. At 45° the range is maximised on flat ground: range = v₀² × sin(2θ) / g = 900 × 1 / 9.81 ≈ 91.7 m. The calculator gives the same answer along with time of flight ≈ 4.32 s and max height ≈ 22.9 m.',
      proTip:
        '45° gives maximum range only when launched and landed at the same height. With a positive initial height, the optimal angle is less than 45°. Air resistance significantly reduces real-world range — this calculator assumes a vacuum. For long-range artillery, the Coriolis effect and atmospheric density also matter.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 8. Torque Calculator
  // =========================================================================
  {
    id: 'torque-calculator',
    slug: 'torque-calculator',
    title: 'Torque Calculator',
    description:
      'Calculate torque (τ = F × r × sin θ), angular force, and mechanical advantage in rotational systems.',
    icon: '🔧',
    category: 'science',
    subcategory: 'physics',
    tags: ['torque', 'moment', 'force', 'lever arm', 'rotational', 'physics'],
    inputs: [
      {
        id: 'force',
        label: 'Applied Force (F)',
        type: 'number',
        defaultValue: 100,
        units: [
          { label: 'N', value: 'N' },
          { label: 'kN', value: 'kN', conversionFactor: '1000' },
          { label: 'lbf', value: 'lbf', conversionFactor: '4.44822' },
        ],
      },
      {
        id: 'leverArm',
        label: 'Lever Arm Length (r)',
        type: 'number',
        defaultValue: 0.5,
        step: 0.01,
        units: [
          { label: 'm', value: 'm' },
          { label: 'cm', value: 'cm', conversionFactor: '0.01' },
          { label: 'ft', value: 'ft', conversionFactor: '0.3048' },
        ],
      },
      {
        id: 'angle',
        label: 'Angle between F and r (θ)',
        type: 'number',
        defaultValue: 90,
        min: 0,
        max: 180,
        helpText: 'Default 90° = maximum torque',
      },
    ],
    formulas: [
      {
        id: 'rad',
        expression: 'angle * PI / 180',
        dependencies: ['angle'],
      },
      // τ = F × r × sin(θ)
      {
        id: 'torque',
        expression: 'force * leverArm * sin(rad)',
        dependencies: ['force', 'leverArm', 'rad'],
      },
      // Maximum torque when θ = 90°
      {
        id: 'maxTorque',
        expression: 'force * leverArm',
        dependencies: ['force', 'leverArm'],
      },
    ],
    outputs: [
      {
        id: 'torqueOut',
        label: 'Torque (τ)',
        formulaRef: 'torque',
        precision: 3,
        suffix: ' N·m',
        highlight: true,
      },
      {
        id: 'maxTorqueOut',
        label: 'Maximum Possible Torque',
        formulaRef: 'maxTorque',
        precision: 3,
        suffix: ' N·m',
      },
    ],
    guide: {
      whatIsIt:
        'Torque (τ) is the rotational equivalent of force — it is the tendency of a force to rotate an object around an axis. Torque = Force × Lever Arm × sin(θ), where θ is the angle between the force vector and the lever arm. The SI unit is Newton-metre (N·m). In the US, torque is often quoted in pound-feet (lb-ft) — 1 lb-ft ≈ 1.356 N·m.',
      howToUse:
        'Enter the applied force, the lever arm length (distance from pivot to point of force application), and the angle between the force and the lever arm. A 90° angle produces maximum torque because sin(90°) = 1.',
      exampleScenario:
        'You tighten a bolt with a 0.5 m wrench, applying 100 N perpendicular to the handle (90°). Torque = 100 × 0.5 × sin(90°) = 50 N·m. If you apply the force at 30° instead, torque = 100 × 0.5 × sin(30°) = 25 N·m — half as effective.',
      proTip:
        'Power in a rotating system equals torque times angular velocity: P = τ × ω (where ω is in rad/s). The right-hand rule determines the direction of the torque vector: curl your fingers in the direction of rotation, and your thumb points in the direction of the torque vector. In engineering, always apply force perpendicular to the lever arm to maximise efficiency.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 9. Wavelength & Frequency Calculator
  // =========================================================================
  {
    id: 'wavelength-calculator',
    slug: 'wavelength-calculator',
    title: 'Wavelength & Frequency Calculator',
    description:
      'Calculate wavelength, frequency, or wave speed using λ = v/f. Supports electromagnetic waves, sound, and custom media.',
    icon: '〰️',
    category: 'science',
    subcategory: 'waves',
    tags: ['wavelength', 'frequency', 'speed of light', 'wave', 'electromagnetic', 'sound'],
    inputs: [
      {
        id: 'medium',
        label: 'Medium / Wave Type',
        type: 'select',
        options: [
          { label: 'Light in vacuum (c = 3×10⁸ m/s)', value: '299792458' },
          { label: 'Sound in air (343 m/s)', value: '343' },
          { label: 'Sound in water (1480 m/s)', value: '1480' },
          { label: 'Custom speed', value: '0' },
        ],
        defaultValue: '299792458',
      },
      {
        id: 'customSpeed',
        label: 'Custom Wave Speed (m/s)',
        type: 'number',
        defaultValue: 300,
        helpText: 'Used when Custom is selected',
      },
      {
        id: 'solveFor',
        label: 'Solve For',
        type: 'select',
        options: [
          { label: 'Wavelength (λ)', value: '0' },
          { label: 'Frequency (f)', value: '1' },
        ],
        defaultValue: '0',
      },
      {
        id: 'frequency',
        label: 'Frequency (f)',
        type: 'number',
        defaultValue: 440,
        helpText: 'In Hz',
        step: 0.1,
      },
      {
        id: 'wavelength',
        label: 'Wavelength (λ)',
        type: 'number',
        defaultValue: 0.78,
        step: 0.0001,
        helpText: 'In meters',
      },
    ],
    formulas: [
      // Use custom speed when medium selector = 0
      {
        id: 'speed',
        expression: 'medium == 0 ? customSpeed : medium',
        dependencies: ['medium', 'customSpeed'],
      },
      // λ = v/f
      {
        id: 'lambdaCalc',
        expression: 'speed / frequency',
        dependencies: ['speed', 'frequency'],
      },
      // f = v/λ
      {
        id: 'freqCalc',
        expression: 'speed / wavelength',
        dependencies: ['speed', 'wavelength'],
      },
      {
        id: 'result',
        expression: 'solveFor == 0 ? lambdaCalc : freqCalc',
        dependencies: ['solveFor', 'lambdaCalc', 'freqCalc'],
      },
    ],
    outputs: [
      {
        id: 'resultOut',
        label: 'Result',
        formulaRef: 'result',
        precision: 6,
        highlight: true,
      },
      {
        id: 'lambdaOut',
        label: 'Wavelength (λ)',
        formulaRef: 'lambdaCalc',
        precision: 6,
        suffix: ' m',
      },
      {
        id: 'freqOut',
        label: 'Frequency (f)',
        formulaRef: 'freqCalc',
        precision: 4,
        suffix: ' Hz',
      },
    ],
    guide: {
      whatIsIt:
        'The wave equation λ = v/f (wavelength = wave speed / frequency) relates the three fundamental properties of any periodic wave. Visible light occupies 400–700 nm; the full EM spectrum ranges from radio waves (km) to gamma rays (pm). Human hearing spans 20 Hz–20 kHz; middle A (concert pitch) is 440 Hz with λ ≈ 0.78 m in air.',
      howToUse:
        'Select the medium to auto-fill the wave speed, or choose "Custom speed" and enter your own value. Then select whether you want to solve for wavelength or frequency, and enter the known quantity.',
      exampleScenario:
        'What is the wavelength of 440 Hz (concert A) sound in air? Select "Sound in air (343 m/s)", "Solve for Wavelength", and enter frequency = 440 Hz. λ = 343 / 440 ≈ 0.7795 m (about 78 cm). In water (1480 m/s), the same note would have λ ≈ 3.36 m.',
      proTip:
        'EM spectrum reference: Radio > 1 m | Microwave 1 mm–1 m | Infrared 700 nm–1 mm | Visible 400–700 nm | UV 10–400 nm | X-ray 0.01–10 nm | Gamma < 0.01 nm. The speed of light in a medium is c/n where n is the refractive index — glass has n ≈ 1.5, so light travels at ≈ 2×10⁸ m/s through it.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 10. Specific Heat Calculator
  // =========================================================================
  {
    id: 'specific-heat-calculator',
    slug: 'specific-heat-calculator',
    title: 'Specific Heat Calculator',
    description:
      'Calculate heat energy transferred using Q = mcΔT. Find heat, mass, specific heat capacity, or temperature change.',
    icon: '🌡️',
    category: 'science',
    subcategory: 'thermodynamics',
    tags: ['specific heat', 'calorimetry', 'heat transfer', 'thermal', 'Q=mcT', 'physics'],
    inputs: [
      {
        id: 'solveFor',
        label: 'Solve For',
        type: 'select',
        options: [
          { label: 'Heat (Q)', value: '0' },
          { label: 'Mass (m)', value: '1' },
          { label: 'Specific Heat (c)', value: '2' },
          { label: 'Temp Change (ΔT)', value: '3' },
        ],
        defaultValue: '0',
      },
      {
        id: 'mass',
        label: 'Mass (m)',
        type: 'number',
        defaultValue: 1,
        units: [
          { label: 'kg', value: 'kg' },
          { label: 'g', value: 'g', conversionFactor: '0.001' },
        ],
      },
      {
        id: 'specificHeat',
        label: 'Specific Heat (c)',
        type: 'number',
        defaultValue: 4186,
        step: 1,
        helpText: 'J/(kg·K) — water: 4186, iron: 450, aluminum: 900',
      },
      {
        id: 'deltaT',
        label: 'Temperature Change (ΔT)',
        type: 'number',
        defaultValue: 20,
        helpText: 'In °C or K (same value)',
      },
      {
        id: 'heatQ',
        label: 'Heat Energy (Q)',
        type: 'number',
        defaultValue: 83720,
        helpText: 'In Joules',
      },
    ],
    formulas: [
      // Q = m × c × ΔT
      {
        id: 'qCalc',
        expression: 'mass * specificHeat * deltaT',
        dependencies: ['mass', 'specificHeat', 'deltaT'],
      },
      // m = Q / (c × ΔT)
      {
        id: 'mCalc',
        expression: 'heatQ / (specificHeat * deltaT)',
        dependencies: ['heatQ', 'specificHeat', 'deltaT'],
      },
      // c = Q / (m × ΔT)
      {
        id: 'cCalc',
        expression: 'heatQ / (mass * deltaT)',
        dependencies: ['heatQ', 'mass', 'deltaT'],
      },
      // ΔT = Q / (m × c)
      {
        id: 'dTCalc',
        expression: 'heatQ / (mass * specificHeat)',
        dependencies: ['heatQ', 'mass', 'specificHeat'],
      },
      {
        id: 'result',
        expression:
          'solveFor == 0 ? qCalc : (solveFor == 1 ? mCalc : (solveFor == 2 ? cCalc : dTCalc))',
        dependencies: ['solveFor', 'qCalc', 'mCalc', 'cCalc', 'dTCalc'],
      },
    ],
    outputs: [
      {
        id: 'resultOut',
        label: 'Result',
        formulaRef: 'result',
        precision: 4,
        highlight: true,
      },
      {
        id: 'qOut',
        label: 'Heat (Q)',
        formulaRef: 'qCalc',
        precision: 2,
        suffix: ' J',
      },
      {
        id: 'mOut',
        label: 'Mass (m)',
        formulaRef: 'mCalc',
        precision: 4,
        suffix: ' kg',
      },
      {
        id: 'cOut',
        label: 'Specific Heat (c)',
        formulaRef: 'cCalc',
        precision: 2,
        suffix: ' J/(kg·K)',
      },
      {
        id: 'dTOut',
        label: 'Temp Change (ΔT)',
        formulaRef: 'dTCalc',
        precision: 4,
        suffix: ' °C',
      },
    ],
    guide: {
      whatIsIt:
        "The specific heat equation Q = mcΔT quantifies the heat energy (Q) required to change the temperature of a mass (m) by ΔT degrees, given the material's specific heat capacity (c). Specific heat (c) is measured in J/(kg·K). Higher c means a material requires more energy to heat up — water's high c (4186) makes it excellent for thermal regulation.",
      howToUse:
        'Select what you want to solve for from the dropdown. For "Heat (Q)", enter mass, specific heat, and temperature change. For other quantities, enter heat (Q) and the other two knowns.',
      exampleScenario:
        'How much heat is needed to warm 1 kg of water by 20°C? Select "Heat (Q)", enter m = 1 kg, c = 4186 J/(kg·K), ΔT = 20°C. Q = 1 × 4186 × 20 = 83,720 J ≈ 83.7 kJ. This is roughly the energy in a 20-calorie snack (1 cal = 4.184 J).',
      proTip:
        'Specific heat reference table: Water = 4186, Sea water = 3993, Ice = 2090, Aluminium = 900, Glass = 840, Iron/Steel = 450, Copper = 385, Gold = 128, Lead = 128 J/(kg·K). Calorimetry uses Q_gained = −Q_lost to find unknown specific heats experimentally. A Calorie (food energy) = 1 kcal = 4184 J.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 11. Stoichiometry Calculator
  // =========================================================================
  {
    id: 'stoichiometry-calculator',
    slug: 'stoichiometry-calculator',
    title: 'Stoichiometry Calculator',
    description:
      'Convert between moles, grams, and number of molecules/atoms using molar mass. The foundation of stoichiometric calculations.',
    icon: '🧪',
    category: 'science',
    subcategory: 'chemistry',
    tags: ['stoichiometry', 'moles', 'grams', 'molar mass', 'chemistry', 'reaction'],
    inputs: [
      {
        id: 'molarMass',
        label: 'Molar Mass (g/mol)',
        type: 'number',
        defaultValue: 18.015,
        step: 0.001,
        placeholder: 'e.g. 18.015 for H₂O',
        helpText: 'Sum of atomic masses from periodic table',
      },
      {
        id: 'inputAmount',
        label: 'Known Quantity',
        type: 'number',
        defaultValue: 2,
        step: 0.001,
      },
      {
        id: 'inputUnit',
        label: 'Input Unit',
        type: 'select',
        options: [
          { label: 'Moles (mol)', value: '0' },
          { label: 'Grams (g)', value: '1' },
          { label: 'Molecules/Atoms (×10²³)', value: '2' },
        ],
        defaultValue: '0',
      },
    ],
    formulas: [
      // Moles passed directly when inputUnit = 0
      {
        id: 'molesFromMol',
        expression: 'inputAmount',
        dependencies: ['inputAmount'],
      },
      // Grams → moles: n = m / M
      {
        id: 'molesFromG',
        expression: 'inputAmount / molarMass',
        dependencies: ['inputAmount', 'molarMass'],
      },
      // Molecules (×10²³) → moles: divide by Avogadro scaled to ×10²³ units
      {
        id: 'molesFromMolec',
        expression: 'inputAmount / 6.022',
        dependencies: ['inputAmount'],
      },
      // Select the correct moles value based on inputUnit
      {
        id: 'molesResult',
        expression:
          'inputUnit == 0 ? molesFromMol : (inputUnit == 1 ? molesFromG : molesFromMolec)',
        dependencies: ['inputUnit', 'molesFromMol', 'molesFromG', 'molesFromMolec'],
      },
      // Grams = moles × molar mass
      {
        id: 'grams',
        expression: 'molesResult * molarMass',
        dependencies: ['molesResult', 'molarMass'],
      },
      // Molecules (×10²³) = moles × 6.022
      {
        id: 'molecules',
        expression: 'molesResult * 6.022',
        dependencies: ['molesResult'],
      },
    ],
    outputs: [
      {
        id: 'molesOut',
        label: 'Moles (mol)',
        formulaRef: 'molesResult',
        precision: 4,
        highlight: true,
      },
      {
        id: 'gramsOut',
        label: 'Mass (grams)',
        formulaRef: 'grams',
        precision: 4,
        suffix: ' g',
        highlight: true,
      },
      {
        id: 'moleculesOut',
        label: 'Molecules (×10²³)',
        formulaRef: 'molecules',
        precision: 4,
        suffix: '×10²³',
      },
    ],
    guide: {
      whatIsIt:
        "Stoichiometry is the quantitative study of reactants and products in chemical reactions. The mole is the SI unit of amount of substance — one mole contains exactly 6.022 × 10²³ particles (Avogadro's number, Nₐ). The molar mass (g/mol) numerically equals the molecular weight in atomic mass units (u). This calculator converts freely between moles, grams, and molecule counts.",
      howToUse:
        'Enter the molar mass of your substance (sum of atomic masses from the periodic table). Enter the known quantity and select its unit (moles, grams, or ×10²³ molecules). All three representations are computed simultaneously.',
      exampleScenario:
        'Water (H₂O) has a molar mass of 18.015 g/mol (2×1.008 + 15.999). Enter molar mass = 18.015, quantity = 2 mol. Result: 2 mol × 18.015 = 36.03 g of water, containing 2 × 6.022 × 10²³ ≈ 12.044 × 10²³ molecules.',
      proTip:
        'Key molar masses for reference: H₂O = 18.015, NaCl = 58.44, CO₂ = 44.01, O₂ = 32.00, H₂SO₄ = 98.08, CaCO₃ = 100.09 g/mol. In a balanced reaction like 2H₂ + O₂ → 2H₂O, the molar ratios (2:1:2) directly tell you quantities. This is the limiting reagent concept — the reactant that runs out first determines the maximum product yield.',
    },
    metadata: { version: '1.0.0' },
  },
];
