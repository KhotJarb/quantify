// ---------------------------------------------------------------------------
// Quantify � HVAC & Fluid Dynamics Calculators
// ---------------------------------------------------------------------------
// 10 calculators covering pipe flow, friction loss, duct sizing, air changes,
// pump horsepower, chiller tonnage, expansion tanks, radiators, dew point,
// and sump pump capacity.
// ---------------------------------------------------------------------------

import type { CalculatorSchema } from '@/types/calculator';

export const hvacFluidCalculators: CalculatorSchema[] = [
  // =========================================================================
  // 1. Pipe Flow Rate & Velocity
  // =========================================================================
  {
    id: 'pipe-flow-velocity',
    slug: 'pipe-flow-velocity',
    title: 'Pipe Flow Rate & Velocity',
    description:
      'Calculate fluid velocity and Reynolds number from pipe diameter and volumetric flow rate. Determine laminar vs. turbulent flow regimes.',
    icon: '🚰',
    category: 'engineering',
    subcategory: 'fluid',
    tags: ['pipe', 'flow', 'velocity', 'reynolds', 'hydraulics', 'fluid dynamics', 'GPM', 'turbulent', 'laminar'],
    inputs: [
      {
        id: 'pipeDiamIn',
        label: 'Pipe Inner Diameter',
        type: 'number',
        defaultValue: 2,
        min: 0.1,
        max: 120,
        step: 0.1,
        placeholder: 'e.g. 2',
        helpText: 'Internal diameter of the pipe in inches.',
        required: true,
        units: [
          { label: 'inches', value: '1', conversionFactor: '1' },
          { label: 'mm', value: '0.0393701', conversionFactor: '0.0393701' },
        ],
      },
      {
        id: 'flowGPM',
        label: 'Volumetric Flow Rate (GPM)',
        type: 'number',
        defaultValue: 20,
        min: 0.01,
        max: 100000,
        step: 0.5,
        placeholder: 'e.g. 20',
        helpText: 'Flow rate in US gallons per minute.',
        required: true,
      },
      {
        id: 'kinVisc',
        label: 'Kinematic Viscosity (cSt)',
        type: 'number',
        defaultValue: 1.004,
        min: 0.1,
        max: 1000,
        step: 0.001,
        placeholder: 'e.g. 1.004',
        helpText: 'Kinematic viscosity of the fluid. Water at 20�C � 1.004 cSt.',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'diamFt',
        expression: 'pipeDiamIn / 12',
        dependencies: ['pipeDiamIn'],
      },
      {
        id: 'areaFt2',
        expression: '3.14159265 * (diamFt / 2) ^ 2',
        dependencies: ['diamFt'],
      },
      {
        id: 'flowCFS',
        expression: 'flowGPM / 448.831',
        dependencies: ['flowGPM'],
      },
      {
        id: 'velocityFPS',
        expression: 'flowCFS / areaFt2',
        dependencies: ['flowCFS', 'areaFt2'],
      },
      {
        id: 'velocityFPM',
        expression: 'velocityFPS * 60',
        dependencies: ['velocityFPS'],
      },
      {
        id: 'kinViscFt2S',
        expression: 'kinVisc * 0.000001076391',
        dependencies: ['kinVisc'],
      },
      {
        id: 'reynoldsNumber',
        expression: 'velocityFPS * diamFt / kinViscFt2S',
        dependencies: ['velocityFPS', 'diamFt', 'kinViscFt2S'],
      },
      {
        id: 'flowRegimeCode',
        expression: 'reynoldsNumber < 2300 ? 1 : (reynoldsNumber < 4000 ? 2 : 3)',
        dependencies: ['reynoldsNumber'],
      },
    ],
    outputs: [
      {
        id: 'out-velocityFPS',
        label: 'Flow Velocity',
        formulaRef: 'velocityFPS',
        format: 'number',
        precision: 2,
        suffix: ' ft/s',
        highlight: true,
      },
      {
        id: 'out-velocityFPM',
        label: 'Velocity (FPM)',
        formulaRef: 'velocityFPM',
        format: 'number',
        precision: 1,
        suffix: ' ft/min',
      },
      {
        id: 'out-reynoldsNumber',
        label: 'Reynolds Number',
        formulaRef: 'reynoldsNumber',
        format: 'number',
        precision: 0,
      },
      {
        id: 'out-flowRegimeCode',
        label: 'Flow Regime (1=Laminar, 2=Transitional, 3=Turbulent)',
        formulaRef: 'flowRegimeCode',
        format: 'number',
        precision: 0,
      },
    ],
    guide: {
      whatIsIt:
        'Pipe flow velocity and the Reynolds number are the two most fundamental parameters in fluid mechanics. Velocity tells you how fast the fluid moves through the pipe cross-section, while the Reynolds number (Re) classifies the flow as laminar (Re < 2,300), transitional (2,300�4,000), or turbulent (Re > 4,000). Turbulent flow causes higher friction losses but better heat transfer; laminar flow is smooth but can lead to poor mixing.',
      howToUse:
        'Enter the pipe inner diameter, volumetric flow rate in GPM, and the fluid\'s kinematic viscosity (water at 20�C � 1.004 cSt, glycol mixtures are higher). The calculator instantly returns velocity in ft/s, velocity in ft/min (useful for HVAC system design), and the Reynolds number with regime classification.',
      exampleScenario:
        'A 2-inch schedule 40 pipe carries 20 GPM of water at 20�C. Inner diameter is 2.067 inches. Velocity � 1.96 ft/s (117.5 ft/min) � within the ASHRAE recommended 2�4 ft/s range. Reynolds number � 108,000, confirming fully turbulent flow with good heat transfer characteristics.',
      proTip:
        'ASHRAE recommends keeping chilled water velocities between 2�4 ft/s in main distribution pipes to balance friction losses and erosion. Velocities above 8 ft/s in copper pipe can cause erosion-corrosion. For noise control in branch lines near fan coil units, target < 2 ft/s.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 2. Hazen-Williams Friction Loss
  // =========================================================================
  {
    id: 'hazen-williams-friction-loss',
    slug: 'hazen-williams-friction-loss',
    title: 'Hazen-Williams Pipe Friction Loss',
    description:
      'Calculate pressure drop (psi) in water pipes using the Hazen-Williams equation. Essential for sizing pumps and verifying fire suppression system pressure.',
    icon: '💧',
    category: 'engineering',
    subcategory: 'fluid',
    tags: ['hazen-williams', 'friction loss', 'pressure drop', 'pipe', 'psi', 'GPM', 'fire sprinkler', 'plumbing'],
    inputs: [
      {
        id: 'hwFlowGPM',
        label: 'Flow Rate (GPM)',
        type: 'number',
        defaultValue: 50,
        min: 0.1,
        max: 100000,
        step: 1,
        placeholder: 'e.g. 50',
        helpText: 'Volumetric flow rate in US gallons per minute.',
        required: true,
      },
      {
        id: 'hwDiamIn',
        label: 'Pipe Internal Diameter (inches)',
        type: 'number',
        defaultValue: 2,
        min: 0.1,
        max: 120,
        step: 0.1,
        placeholder: 'e.g. 2',
        helpText: 'Inside diameter of the pipe in inches.',
        required: true,
      },
      {
        id: 'hwLengthFt',
        label: 'Pipe Length (feet)',
        type: 'number',
        defaultValue: 100,
        min: 0.1,
        max: 100000,
        step: 1,
        placeholder: 'e.g. 100',
        helpText: 'Total pipe length including equivalent length of fittings.',
        required: true,
      },
      {
        id: 'hwC',
        label: 'Hazen-Williams C Factor',
        type: 'select',
        defaultValue: '120',
        options: [
          { label: 'New Steel (C=140)', value: '140' },
          { label: 'Copper / Brass (C=130)', value: '130' },
          { label: 'PVC / Plastic (C=150)', value: '150' },
          { label: 'Cast Iron new (C=130)', value: '130' },
          { label: 'Cast Iron old (C=100)', value: '100' },
          { label: 'Galvanized Steel (C=120)', value: '120' },
          { label: 'Concrete smooth (C=120)', value: '120' },
          { label: 'HDPE (C=150)', value: '150' },
          { label: 'Cement-lined ductile iron (C=140)', value: '140' },
        ],
        helpText: 'Material roughness coefficient. Higher C = smoother pipe = less friction.',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'frictionLossPer100',
        expression: '0.2083 * pow(100 / hwC, 1.852) * pow(hwFlowGPM, 1.852) / pow(hwDiamIn, 4.8655)',
        dependencies: ['hwC', 'hwFlowGPM', 'hwDiamIn'],
      },
      {
        id: 'frictionLossFtPer100',
        expression: 'frictionLossPer100',
        dependencies: ['frictionLossPer100'],
      },
      {
        id: 'totalFrictionFt',
        expression: 'frictionLossPer100 * hwLengthFt / 100',
        dependencies: ['frictionLossPer100', 'hwLengthFt'],
      },
      {
        id: 'totalFrictionPSI',
        expression: 'totalFrictionFt * 0.4335',
        dependencies: ['totalFrictionFt'],
      },
      {
        id: 'velocityFPS',
        expression: '0.408 * hwFlowGPM / pow(hwDiamIn, 2)',
        dependencies: ['hwFlowGPM', 'hwDiamIn'],
      },
    ],
    outputs: [
      {
        id: 'out-totalFrictionPSI',
        label: 'Total Friction Loss',
        formulaRef: 'totalFrictionPSI',
        format: 'number',
        precision: 2,
        suffix: ' psi',
        highlight: true,
      },
      {
        id: 'out-totalFrictionFt',
        label: 'Friction Loss (ft H2O)',
        formulaRef: 'totalFrictionFt',
        format: 'number',
        precision: 2,
        suffix: ' ft',
      },
      {
        id: 'out-frictionLossPer100',
        label: 'Loss per 100 ft',
        formulaRef: 'frictionLossPer100',
        format: 'number',
        precision: 3,
        suffix: ' ft/100ft',
      },
      {
        id: 'out-velocityFPS',
        label: 'Approximate Velocity',
        formulaRef: 'velocityFPS',
        format: 'number',
        precision: 2,
        suffix: ' ft/s',
      },
    ],
    guide: {
      whatIsIt:
        'The Hazen-Williams equation is the most widely used empirical formula for calculating pressure loss due to friction in water distribution and fire suppression systems. It uses a roughness coefficient "C" to characterize pipe material and age. Unlike the Darcy-Weisbach equation, it is specific to water and avoids the need for friction factor charts.',
      howToUse:
        'Enter the flow rate, pipe diameter, total pipe length (add ~10�15% for equivalent fitting lengths if unknown), and select the pipe material. The C factor is pre-set for common pipe types. Results show total pressure drop in psi and per-100-ft loss for comparison against tabulated values.',
      exampleScenario:
        'A fire sprinkler designer routes 50 GPM through 2-inch galvanized steel pipe (C=120) over 100 feet. The friction loss is approximately 1.9 psi. Adding a 40 ft equivalent length for elbows and tees gives 140 ft total ? 2.7 psi drop � critical for verifying the minimum pressure at the last sprinkler head.',
      proTip:
        'For domestic plumbing, keep friction loss below 4 ft/100ft (1.73 psi/100ft) to avoid noise and erosion. In HVAC hydronic systems, a design friction rate of 1.5�3 ft/100ft is typical. Remember the Hazen-Williams equation is only valid for turbulent flow with water � do not use it for viscous fluids or gases.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 3. HVAC Duct Sizing CFM
  // =========================================================================
  {
    id: 'hvac-duct-sizing-cfm',
    slug: 'hvac-duct-sizing-cfm',
    title: 'HVAC Duct Sizing & CFM Calculator',
    description:
      'Calculate the required airflow (CFM) for a room using area, ceiling height, and air changes per hour. Then size the supply duct diameter based on a target air velocity.',
    icon: '💨',
    category: 'construction',
    subcategory: 'hvac',
    tags: ['duct sizing', 'CFM', 'HVAC', 'airflow', 'ACH', 'air changes', 'ventilation', 'supply duct'],
    inputs: [
      {
        id: 'roomAreaFt2',
        label: 'Room Floor Area (ft�)',
        type: 'number',
        defaultValue: 400,
        min: 10,
        max: 100000,
        step: 10,
        placeholder: 'e.g. 400',
        helpText: 'Length � width of the room in square feet.',
        required: true,
      },
      {
        id: 'ceilHeightFt',
        label: 'Ceiling Height (ft)',
        type: 'number',
        defaultValue: 9,
        min: 6,
        max: 40,
        step: 0.5,
        placeholder: 'e.g. 9',
        helpText: 'Floor-to-ceiling height in feet.',
        required: true,
      },
      {
        id: 'ach',
        label: 'Air Changes per Hour (ACH)',
        type: 'select',
        defaultValue: '6',
        options: [
          { label: 'Residential bedroom (4 ACH)', value: '4' },
          { label: 'Residential living area (6 ACH)', value: '6' },
          { label: 'Office space (8 ACH)', value: '8' },
          { label: 'Restaurant / retail (12 ACH)', value: '12' },
          { label: 'Laboratory (15 ACH)', value: '15' },
          { label: 'Hospital patient room (12 ACH)', value: '12' },
          { label: 'Clean room (20 ACH)', value: '20' },
        ],
        helpText: 'Industry-standard air change rate for the room type.',
        required: true,
      },
      {
        id: 'ductVelocFPM',
        label: 'Target Duct Velocity (FPM)',
        type: 'number',
        defaultValue: 600,
        min: 100,
        max: 2500,
        step: 50,
        placeholder: 'e.g. 600',
        helpText: 'Recommended: 400�600 FPM for residential, 600�900 FPM for commercial.',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'roomVolumeFt3',
        expression: 'roomAreaFt2 * ceilHeightFt',
        dependencies: ['roomAreaFt2', 'ceilHeightFt'],
      },
      {
        id: 'cfmRequired',
        expression: 'roomVolumeFt3 * ach / 60',
        dependencies: ['roomVolumeFt3', 'ach'],
      },
      {
        id: 'ductAreaFt2',
        expression: 'cfmRequired / ductVelocFPM',
        dependencies: ['cfmRequired', 'ductVelocFPM'],
      },
      {
        id: 'ductDiamIn',
        expression: 'sqrt(ductAreaFt2 * 4 / 3.14159265) * 12',
        dependencies: ['ductAreaFt2'],
      },
      {
        id: 'ductDiamRounded',
        expression: 'ceil(ductDiamIn / 2) * 2',
        dependencies: ['ductDiamIn'],
      },
    ],
    outputs: [
      {
        id: 'out-cfmRequired',
        label: 'Required Airflow (CFM)',
        formulaRef: 'cfmRequired',
        format: 'number',
        precision: 0,
        suffix: ' CFM',
        highlight: true,
      },
      {
        id: 'out-ductDiamIn',
        label: 'Calculated Duct Diameter',
        formulaRef: 'ductDiamIn',
        format: 'number',
        precision: 1,
        suffix: ' in',
      },
      {
        id: 'out-ductDiamRounded',
        label: 'Recommended Round Duct Size',
        formulaRef: 'ductDiamRounded',
        format: 'number',
        precision: 0,
        suffix: '" diameter',
        highlight: true,
      },
      {
        id: 'out-roomVolumeFt3',
        label: 'Room Volume',
        formulaRef: 'roomVolumeFt3',
        format: 'number',
        precision: 0,
        suffix: ' ft�',
      },
    ],
    guide: {
      whatIsIt:
        'CFM (Cubic Feet per Minute) is the fundamental airflow unit in HVAC design. This calculator uses the ACH method to determine how much air a room needs, then back-calculates the duct diameter required to deliver that air at a comfortable velocity. Duct velocity directly impacts noise, energy efficiency, and comfort.',
      howToUse:
        'Enter the room floor area, ceiling height, and select the appropriate ACH rate for the space type. Then enter your target duct velocity � lower velocities are quieter. The calculator shows total CFM needed and the ideal round duct diameter, rounded up to the nearest standard 2-inch increment.',
      exampleScenario:
        'A 400 ft� office with 9 ft ceilings (3,600 ft�) at 8 ACH needs 480 CFM. At a duct velocity of 700 FPM, the duct area is 0.686 ft�, requiring a 11.2-inch duct � round up to 12-inch standard duct for the supply run.',
      proTip:
        'The equal friction method is preferred over ACH for larger systems � target 0.08�0.1 in.wg per 100 ft for main trunks. For branch ducts, reduce velocity to 400�500 FPM to prevent noise complaints at supply registers. Always add 10�15% to CFM calculated by ACH to account for duct leakage.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 4. Air Change Rate ACH
  // =========================================================================
  {
    id: 'air-change-rate-ach',
    slug: 'air-change-rate-ach',
    title: 'Air Change Rate (ACH) Calculator',
    description:
      'Calculate the actual air changes per hour (ACH) for a room given the supply airflow CFM and room dimensions. Verify ventilation adequacy against ASHRAE standards.',
    icon: '🌬',
    category: 'construction',
    subcategory: 'hvac',
    tags: ['ACH', 'air changes per hour', 'ventilation', 'CFM', 'HVAC', 'indoor air quality', 'ASHRAE'],
    inputs: [
      {
        id: 'achCFM',
        label: 'Supply Airflow (CFM)',
        type: 'number',
        defaultValue: 480,
        min: 1,
        max: 1000000,
        step: 10,
        placeholder: 'e.g. 480',
        helpText: 'Measured or design supply airflow into the room in CFM.',
        required: true,
      },
      {
        id: 'achRoomLengthFt',
        label: 'Room Length (ft)',
        type: 'number',
        defaultValue: 20,
        min: 1,
        max: 1000,
        step: 1,
        placeholder: 'e.g. 20',
        required: true,
      },
      {
        id: 'achRoomWidthFt',
        label: 'Room Width (ft)',
        type: 'number',
        defaultValue: 20,
        min: 1,
        max: 1000,
        step: 1,
        placeholder: 'e.g. 20',
        required: true,
      },
      {
        id: 'achCeilFt',
        label: 'Ceiling Height (ft)',
        type: 'number',
        defaultValue: 9,
        min: 6,
        max: 50,
        step: 0.5,
        placeholder: 'e.g. 9',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'achRoomVol',
        expression: 'achRoomLengthFt * achRoomWidthFt * achCeilFt',
        dependencies: ['achRoomLengthFt', 'achRoomWidthFt', 'achCeilFt'],
      },
      {
        id: 'achActual',
        expression: 'achCFM * 60 / achRoomVol',
        dependencies: ['achCFM', 'achRoomVol'],
      },
      {
        id: 'cfmPerSqFt',
        expression: 'achCFM / (achRoomLengthFt * achRoomWidthFt)',
        dependencies: ['achCFM', 'achRoomLengthFt', 'achRoomWidthFt'],
      },
      {
        id: 'minutesPerChange',
        expression: '60 / achActual',
        dependencies: ['achActual'],
      },
    ],
    outputs: [
      {
        id: 'out-achActual',
        label: 'Air Changes per Hour',
        formulaRef: 'achActual',
        format: 'number',
        precision: 2,
        suffix: ' ACH',
        highlight: true,
      },
      {
        id: 'out-cfmPerSqFt',
        label: 'CFM per ft�',
        formulaRef: 'cfmPerSqFt',
        format: 'number',
        precision: 3,
        suffix: ' CFM/ft�',
      },
      {
        id: 'out-minutesPerChange',
        label: 'Minutes per Air Change',
        formulaRef: 'minutesPerChange',
        format: 'number',
        precision: 1,
        suffix: ' min',
      },
      {
        id: 'out-achRoomVol',
        label: 'Room Volume',
        formulaRef: 'achRoomVol',
        format: 'number',
        precision: 0,
        suffix: ' ft�',
      },
    ],
    guide: {
      whatIsIt:
        'ACH (Air Changes per Hour) measures how many times the total air volume in a room is replaced by fresh or conditioned air every hour. It is the key metric for verifying indoor air quality, infection control, and code compliance. ASHRAE 62.1 specifies minimum ventilation rates by occupancy type.',
      howToUse:
        'Enter the measured or design supply CFM along with room dimensions. The calculator gives you actual ACH and CFM per square foot, which you can compare against ASHRAE 62.1 or building code minimums for your space type.',
      exampleScenario:
        'A 20�20 ft office with 9 ft ceilings (3,600 ft�) has 480 CFM of supply air. ACH = 480 � 60 / 3,600 = 8 ACH and CFM/ft� = 480/400 = 1.2. ASHRAE 62.1 requires ~0.06 CFM/ft� + 5 CFM/person for offices, so this space is well-ventilated for a typical occupancy.',
      proTip:
        'During infectious disease outbreaks (e.g., COVID-19), the CDC recommends =6 ACH for occupied spaces. Existing buildings typically achieve only 1�3 ACH with natural ventilation. Use portable air cleaners (HEPA) rated with a Clean Air Delivery Rate (CADR) to supplement mechanical ventilation and boost effective ACH.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 5. Pump Horsepower Calculator
  // =========================================================================
  {
    id: 'pump-horsepower',
    slug: 'pump-horsepower',
    title: 'Pump Horsepower Calculator',
    description:
      'Calculate water horsepower (WHP) and brake horsepower (BHP) for a pump given flow rate, head, specific gravity, and pump efficiency. Size motors correctly.',
    icon: '🔥',
    category: 'engineering',
    subcategory: 'fluid',
    tags: ['pump', 'horsepower', 'WHP', 'BHP', 'head', 'GPM', 'efficiency', 'motor sizing', 'centrifugal pump'],
    inputs: [
      {
        id: 'pumpGPM',
        label: 'Flow Rate (GPM)',
        type: 'number',
        defaultValue: 200,
        min: 0.1,
        max: 1000000,
        step: 1,
        placeholder: 'e.g. 200',
        helpText: 'Volumetric flow rate in US gallons per minute.',
        required: true,
      },
      {
        id: 'pumpHeadFt',
        label: 'Total Dynamic Head (ft)',
        type: 'number',
        defaultValue: 80,
        min: 0.1,
        max: 10000,
        step: 1,
        placeholder: 'e.g. 80',
        helpText: 'TDH = static head + friction head + velocity head in feet.',
        required: true,
      },
      {
        id: 'pumpSG',
        label: 'Specific Gravity of Fluid',
        type: 'number',
        defaultValue: 1.0,
        min: 0.5,
        max: 3.0,
        step: 0.01,
        placeholder: 'e.g. 1.0',
        helpText: 'Specific gravity relative to water. Water=1.0, 30% glycol�1.045.',
        required: true,
      },
      {
        id: 'pumpEff',
        label: 'Pump Efficiency (%)',
        type: 'number',
        defaultValue: 70,
        min: 10,
        max: 95,
        step: 1,
        placeholder: 'e.g. 70',
        helpText: 'Hydraulic efficiency from pump curve, typically 60�85%.',
        required: true,
      },
      {
        id: 'motorEff',
        label: 'Motor Efficiency (%)',
        type: 'number',
        defaultValue: 92,
        min: 50,
        max: 99,
        step: 1,
        placeholder: 'e.g. 92',
        helpText: 'Motor nameplate efficiency. NEMA premium motors: 91�96%.',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'whp',
        expression: 'pumpGPM * pumpHeadFt * pumpSG / 3960',
        dependencies: ['pumpGPM', 'pumpHeadFt', 'pumpSG'],
      },
      {
        id: 'bhp',
        expression: 'whp / (pumpEff / 100)',
        dependencies: ['whp', 'pumpEff'],
      },
      {
        id: 'motorInputHP',
        expression: 'bhp / (motorEff / 100)',
        dependencies: ['bhp', 'motorEff'],
      },
      {
        id: 'motorInputKW',
        expression: 'motorInputHP * 0.7457',
        dependencies: ['motorInputHP'],
      },
      {
        id: 'wireToWaterEff',
        expression: '(pumpEff / 100) * (motorEff / 100) * 100',
        dependencies: ['pumpEff', 'motorEff'],
      },
    ],
    outputs: [
      {
        id: 'out-whp',
        label: 'Water Horsepower (WHP)',
        formulaRef: 'whp',
        format: 'number',
        precision: 2,
        suffix: ' WHP',
        highlight: true,
      },
      {
        id: 'out-bhp',
        label: 'Brake Horsepower (BHP)',
        formulaRef: 'bhp',
        format: 'number',
        precision: 2,
        suffix: ' BHP',
        highlight: true,
      },
      {
        id: 'out-motorInputKW',
        label: 'Motor Input Power',
        formulaRef: 'motorInputKW',
        format: 'number',
        precision: 2,
        suffix: ' kW',
      },
      {
        id: 'out-wireToWaterEff',
        label: 'Wire-to-Water Efficiency',
        formulaRef: 'wireToWaterEff',
        format: 'number',
        precision: 1,
        suffix: ' %',
      },
    ],
    guide: {
      whatIsIt:
        'Water Horsepower (WHP) is the theoretical power required to move fluid at a given flow rate and head � it represents 100% efficient pumping. Brake Horsepower (BHP) is the actual shaft power needed, accounting for pump inefficiency. Motor input power adds motor inefficiency on top of BHP. Together, these values drive motor selection and energy budgeting.',
      howToUse:
        'Enter the design flow rate, total dynamic head (TDH), fluid specific gravity, and pump and motor efficiencies. TDH is the sum of static lift, friction losses in pipe and fittings, and velocity head. Read the pump curve at your operating point for efficiency. The calculator returns WHP, BHP, and total kW draw.',
      exampleScenario:
        'A chilled water pump moves 200 GPM against 80 ft TDH with water (SG=1.0). At 70% pump efficiency: WHP = 4.04, BHP = 5.77. With a 92% motor: motor input = 6.27 HP = 4.68 kW. Select a 7.5 HP motor for adequate service factor.',
      proTip:
        'Always add a service factor when selecting a motor � a 1.15 SF motor can handle momentary overloads. If BHP exceeds 90% of motor nameplate HP, size up. Variable frequency drives (VFDs) can save 50�60% of pump energy in variable-flow systems because power varies as the cube of speed reduction.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 6. Chiller Tonnage Calculator
  // =========================================================================
  {
    id: 'chiller-tonnage',
    slug: 'chiller-tonnage',
    title: 'Chiller Tonnage Calculator',
    description:
      'Calculate chiller cooling capacity in tons of refrigeration from chilled water flow rate and entering/leaving water temperatures.',
    icon: '❄',
    category: 'construction',
    subcategory: 'hvac',
    tags: ['chiller', 'tonnage', 'cooling', 'BTU', 'GPM', 'chilled water', 'refrigeration', 'HVAC', 'EWT', 'LWT'],
    inputs: [
      {
        id: 'chillerGPM',
        label: 'Chilled Water Flow Rate (GPM)',
        type: 'number',
        defaultValue: 120,
        min: 1,
        max: 100000,
        step: 1,
        placeholder: 'e.g. 120',
        helpText: 'Flow rate through the chiller evaporator.',
        required: true,
      },
      {
        id: 'ewtF',
        label: 'Entering Water Temperature (�F)',
        type: 'number',
        defaultValue: 54,
        min: 32,
        max: 100,
        step: 0.5,
        placeholder: 'e.g. 54',
        helpText: 'Temperature of warm water entering the chiller from the building.',
        required: true,
      },
      {
        id: 'lwtF',
        label: 'Leaving Water Temperature (�F)',
        type: 'number',
        defaultValue: 44,
        min: 32,
        max: 100,
        step: 0.5,
        placeholder: 'e.g. 44',
        helpText: 'Temperature of chilled water leaving the chiller to the building.',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'deltaT',
        expression: 'ewtF - lwtF',
        dependencies: ['ewtF', 'lwtF'],
      },
      {
        id: 'btuHr',
        expression: 'chillerGPM * 500 * deltaT',
        dependencies: ['chillerGPM', 'deltaT'],
      },
      {
        id: 'tonsCooling',
        expression: 'btuHr / 12000',
        dependencies: ['btuHr'],
      },
      {
        id: 'kW',
        expression: 'btuHr / 3412.14',
        dependencies: ['btuHr'],
      },
      {
        id: 'gpmPerTon',
        expression: 'tonsCooling > 0 ? chillerGPM / tonsCooling : 0',
        dependencies: ['chillerGPM', 'tonsCooling'],
      },
    ],
    outputs: [
      {
        id: 'out-tonsCooling',
        label: 'Chiller Capacity',
        formulaRef: 'tonsCooling',
        format: 'number',
        precision: 1,
        suffix: ' tons',
        highlight: true,
      },
      {
        id: 'out-btuHr',
        label: 'Cooling Capacity (BTU/hr)',
        formulaRef: 'btuHr',
        format: 'number',
        precision: 0,
        suffix: ' BTU/hr',
      },
      {
        id: 'out-kW',
        label: 'Cooling Capacity (kW)',
        formulaRef: 'kW',
        format: 'number',
        precision: 2,
        suffix: ' kW',
      },
      {
        id: 'out-deltaT',
        label: 'Delta-T',
        formulaRef: 'deltaT',
        format: 'number',
        precision: 1,
        suffix: ' �F',
      },
      {
        id: 'out-gpmPerTon',
        label: 'GPM per Ton',
        formulaRef: 'gpmPerTon',
        format: 'number',
        precision: 2,
        suffix: ' GPM/ton',
      },
    ],
    guide: {
      whatIsIt:
        'Chiller tonnage measures cooling capacity. One ton of refrigeration = 12,000 BTU/hr � the amount of heat needed to melt one ton of ice per day. The standard chilled water design uses a 10�F delta-T (54�F entering, 44�F leaving). This calculator uses the fundamental heat transfer formula Q = m�Cp�?T, where 500 is the combined constant for GPM and water\'s heat capacity.',
      howToUse:
        'Enter the chilled water flow rate through the chiller evaporator and the entering and leaving water temperatures. The calculator outputs cooling capacity in tons, BTU/hr, and kW, plus the GPM-per-ton ratio which helps assess chiller and distribution efficiency.',
      exampleScenario:
        'A chiller produces 120 GPM at 44�F from 54�F return (?T=10�F). Capacity = 120 � 500 � 10 = 600,000 BTU/hr = 50 tons = 175 kW. GPM/ton = 120/50 = 2.4, which is exactly the ASHRAE design standard of 2.4 GPM/ton.',
      proTip:
        'ASHRAE recommends 2.4 GPM/ton as the design standard, yielding a 10�F ?T. High-?T chilled water systems (12�16�F) use only 1.5�2.0 GPM/ton, dramatically reducing pump energy. However, high-?T requires careful coil selection to prevent stratification. A common commissioning finding is excessive GPM/ton (low ?T) indicating poor distribution control.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 7. Expansion Tank Sizing
  // =========================================================================
  {
    id: 'expansion-tank-sizing',
    slug: 'expansion-tank-sizing',
    title: 'Expansion Tank Sizing Calculator',
    description:
      'Size a diaphragm-type expansion tank for closed hydronic heating or cooling systems based on system volume, temperature range, and system pressures.',
    icon: '🧯',
    category: 'construction',
    subcategory: 'hvac',
    tags: ['expansion tank', 'hydronic', 'HVAC', 'closed system', 'pressure', 'water hammer', 'boiler', 'sizing'],
    inputs: [
      {
        id: 'sysVolGal',
        label: 'Total System Water Volume (gallons)',
        type: 'number',
        defaultValue: 200,
        min: 1,
        max: 100000,
        step: 5,
        placeholder: 'e.g. 200',
        helpText: 'Total volume of water in all pipes, coils, and equipment.',
        required: true,
      },
      {
        id: 'tempLow',
        label: 'Fill / Minimum System Temperature (�F)',
        type: 'number',
        defaultValue: 50,
        min: 32,
        max: 200,
        step: 1,
        placeholder: 'e.g. 50',
        helpText: 'Temperature when system is filled (cold fill condition).',
        required: true,
      },
      {
        id: 'tempHigh',
        label: 'Maximum Operating Temperature (�F)',
        type: 'number',
        defaultValue: 200,
        min: 50,
        max: 250,
        step: 1,
        placeholder: 'e.g. 200',
        helpText: 'Highest expected system water temperature.',
        required: true,
      },
      {
        id: 'pFill',
        label: 'Fill (Minimum) Pressure (psig)',
        type: 'number',
        defaultValue: 12,
        min: 5,
        max: 200,
        step: 1,
        placeholder: 'e.g. 12',
        helpText: 'Cold static fill pressure at the expansion tank location.',
        required: true,
      },
      {
        id: 'pMax',
        label: 'Maximum Allowable System Pressure (psig)',
        type: 'number',
        defaultValue: 30,
        min: 10,
        max: 500,
        step: 1,
        placeholder: 'e.g. 30',
        helpText: 'Pressure relief valve set pressure (typically 30 psig for residential).',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'waterExpFactor',
        expression: '(0.00041 * tempHigh - 0.0466) - (0.00041 * tempLow - 0.0466)',
        dependencies: ['tempHigh', 'tempLow'],
      },
      {
        id: 'waterExp',
        expression: 'sysVolGal * waterExpFactor',
        dependencies: ['sysVolGal', 'waterExpFactor'],
      },
      {
        id: 'pFillAbs',
        expression: 'pFill + 14.696',
        dependencies: ['pFill'],
      },
      {
        id: 'pMaxAbs',
        expression: 'pMax + 14.696',
        dependencies: ['pMax'],
      },
      {
        id: 'tankSizeGal',
        expression: 'waterExp * pMaxAbs / (pMaxAbs - pFillAbs)',
        dependencies: ['waterExp', 'pMaxAbs', 'pFillAbs'],
      },
      {
        id: 'tankSizeRounded',
        expression: 'ceil(tankSizeGal)',
        dependencies: ['tankSizeGal'],
      },
    ],
    outputs: [
      {
        id: 'out-tankSizeGal',
        label: 'Calculated Tank Size',
        formulaRef: 'tankSizeGal',
        format: 'number',
        precision: 1,
        suffix: ' gallons',
        highlight: true,
      },
      {
        id: 'out-tankSizeRounded',
        label: 'Recommended Tank Size (rounded up)',
        formulaRef: 'tankSizeRounded',
        format: 'number',
        precision: 0,
        suffix: ' gallons',
        highlight: true,
      },
      {
        id: 'out-waterExp',
        label: 'Water Volume Expansion',
        formulaRef: 'waterExp',
        format: 'number',
        precision: 2,
        suffix: ' gallons',
      },
      {
        id: 'out-waterExpFactor',
        label: 'Expansion Factor',
        formulaRef: 'waterExpFactor',
        format: 'number',
        precision: 4,
      },
    ],
    guide: {
      whatIsIt:
        'As water is heated, it expands � about 4% from 50�F to 200�F. In a closed hydronic system, this expansion must go somewhere or the pressure relief valve will open repeatedly, wasting water and causing problems. A diaphragm expansion tank accepts this extra volume during heating and releases it during cooling, keeping system pressure within bounds.',
      howToUse:
        'Enter the total system water volume (all pipes, coils, boiler, buffer tanks), the cold fill temperature and maximum operating temperature, and the fill and maximum pressures. The ASHRAE-based formula calculates minimum tank size. Always select the next available standard commercial tank size above the calculated value.',
      exampleScenario:
        'A 200-gallon hydronic heating system fills at 50�F and heats to 200�F. Fill pressure 12 psig, max 30 psig. Expansion factor � 0.0296 � 200 = 5.9 gallons of expansion. Tank size = 5.9 � 44.7/(44.7-26.7) = 14.7 gallons ? select a 15-gallon Amtrol WX-251.',
      proTip:
        'Always set the expansion tank pre-charge pressure equal to the system static fill pressure (measured cold at tank location) BEFORE connecting to the system. A waterlogged tank (failed diaphragm) causes repeated pressure relief valve discharge � the most common expansion tank failure symptom. Size tanks generously � undersized tanks require frequent valve replacement.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 8. Radiator Heat Output BTU
  // =========================================================================
  {
    id: 'radiator-heat-output-btu',
    slug: 'radiator-heat-output-btu',
    title: 'Radiator / Hydronic Coil Heat Output (BTU/hr)',
    description:
      'Calculate the heat output of a hydronic radiator or baseboard heater from water inlet/outlet temperatures, flow rate, and room temperature.',
    icon: '🌡',
    category: 'construction',
    subcategory: 'hvac',
    tags: ['radiator', 'baseboard', 'BTU', 'hydronic', 'heat output', 'delta T', 'GPM', 'heating coil'],
    inputs: [
      {
        id: 'inletTempF',
        label: 'Water Inlet Temperature (�F)',
        type: 'number',
        defaultValue: 180,
        min: 80,
        max: 250,
        step: 1,
        placeholder: 'e.g. 180',
        helpText: 'Hot water supply temperature entering the radiator.',
        required: true,
      },
      {
        id: 'outletTempF',
        label: 'Water Outlet Temperature (�F)',
        type: 'number',
        defaultValue: 160,
        min: 70,
        max: 249,
        step: 1,
        placeholder: 'e.g. 160',
        helpText: 'Cooled water return temperature leaving the radiator.',
        required: true,
      },
      {
        id: 'roomTempF',
        label: 'Room Temperature (�F)',
        type: 'number',
        defaultValue: 68,
        min: 32,
        max: 120,
        step: 1,
        placeholder: 'e.g. 68',
        helpText: 'Ambient room air temperature.',
        required: true,
      },
      {
        id: 'radGPM',
        label: 'Hot Water Flow Rate (GPM)',
        type: 'number',
        defaultValue: 1.5,
        min: 0.1,
        max: 1000,
        step: 0.1,
        placeholder: 'e.g. 1.5',
        helpText: 'Water flow rate through the radiator.',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'waterDeltaT',
        expression: 'inletTempF - outletTempF',
        dependencies: ['inletTempF', 'outletTempF'],
      },
      {
        id: 'btuHrOutput',
        expression: 'radGPM * 500 * waterDeltaT',
        dependencies: ['radGPM', 'waterDeltaT'],
      },
      {
        id: 'meanWaterTemp',
        expression: '(inletTempF + outletTempF) / 2',
        dependencies: ['inletTempF', 'outletTempF'],
      },
      {
        id: 'excessTemp',
        expression: 'meanWaterTemp - roomTempF',
        dependencies: ['meanWaterTemp', 'roomTempF'],
      },
      {
        id: 'btuHrKw',
        expression: 'btuHrOutput / 3412.14',
        dependencies: ['btuHrOutput'],
      },
    ],
    outputs: [
      {
        id: 'out-btuHrOutput',
        label: 'Heat Output',
        formulaRef: 'btuHrOutput',
        format: 'number',
        precision: 0,
        suffix: ' BTU/hr',
        highlight: true,
      },
      {
        id: 'out-btuHrKw',
        label: 'Heat Output (kW)',
        formulaRef: 'btuHrKw',
        format: 'number',
        precision: 2,
        suffix: ' kW',
      },
      {
        id: 'out-excessTemp',
        label: 'Excess Temperature (?T to Room)',
        formulaRef: 'excessTemp',
        format: 'number',
        precision: 1,
        suffix: ' �F',
      },
      {
        id: 'out-meanWaterTemp',
        label: 'Mean Water Temperature',
        formulaRef: 'meanWaterTemp',
        format: 'number',
        precision: 1,
        suffix: ' �F',
      },
    ],
    guide: {
      whatIsIt:
        'Hydronic radiators and baseboard heaters transfer heat from hot water to room air by convection and radiation. The output depends on water flow rate, water temperature drop across the unit, and the temperature difference between the mean water temperature and room air. The formula Q = GPM � 500 � ?T is the standard method per ASHRAE.',
      howToUse:
        'Enter the supply (inlet) and return (outlet) water temperatures, room temperature, and flow rate. Results show BTU/hr output and mean water temperature vs. room temperature (excess temperature), which drives the log-mean temperature difference and is used by manufacturers to rate baseboard output.',
      exampleScenario:
        'A fin-tube baseboard has 180�F supply, 160�F return, in a 68�F room, at 1.5 GPM. Output = 1.5 � 500 � 20 = 15,000 BTU/hr. Mean water temp = 170�F, excess temp = 102�F. From the manufacturer\'s table at 170�F mean temp, a 6 ft electric baseboard provides ~15,000 BTU/hr � a good match.',
      proTip:
        'Modern condensing boilers operate most efficiently with low return water temperatures (below 130�F) to allow flue gas condensation. When designing for condensing operation, size radiators larger or switch to radiant floor heating, which works well at 100�120�F supply. Traditional radiators require 160�180�F � incompatible with condensing mode.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 9. Dew Point & Relative Humidity from Dry/Wet Bulb
  // =========================================================================
  {
    id: 'dew-point-rh-calculator',
    slug: 'dew-point-rh-calculator',
    title: 'Dew Point & Relative Humidity (Dry/Wet Bulb)',
    description:
      'Calculate relative humidity and dew point from dry bulb and wet bulb temperature readings. Essential for psychrometric analysis and HVAC commissioning.',
    icon: '🌧',
    category: 'science',
    subcategory: 'physics',
    tags: ['dew point', 'relative humidity', 'psychrometrics', 'dry bulb', 'wet bulb', 'HVAC', 'weather', 'humidity'],
    inputs: [
      {
        id: 'dryBulbF',
        label: 'Dry Bulb Temperature (�F)',
        type: 'number',
        defaultValue: 75,
        min: -40,
        max: 150,
        step: 0.1,
        placeholder: 'e.g. 75',
        helpText: 'Standard air temperature measured by a thermometer shielded from radiation.',
        required: true,
      },
      {
        id: 'wetBulbF',
        label: 'Wet Bulb Temperature (�F)',
        type: 'number',
        defaultValue: 62,
        min: -40,
        max: 150,
        step: 0.1,
        placeholder: 'e.g. 62',
        helpText: 'Temperature measured by a thermometer with a wet wick � always = dry bulb.',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'dryBulbC',
        expression: '(dryBulbF - 32) * 5 / 9',
        dependencies: ['dryBulbF'],
      },
      {
        id: 'wetBulbC',
        expression: '(wetBulbF - 32) * 5 / 9',
        dependencies: ['wetBulbF'],
      },
      {
        id: 'esDry',
        expression: '6.112 * exp(17.67 * dryBulbC / (dryBulbC + 243.5))',
        dependencies: ['dryBulbC'],
      },
      {
        id: 'esWet',
        expression: '6.112 * exp(17.67 * wetBulbC / (wetBulbC + 243.5))',
        dependencies: ['wetBulbC'],
      },
      {
        id: 'actualVaporPressure',
        expression: 'esWet - 0.00066 * (1 + 0.00115 * wetBulbC) * (dryBulbC - wetBulbC) * 101.325',
        dependencies: ['esWet', 'wetBulbC', 'dryBulbC'],
      },
      {
        id: 'rhPercent',
        expression: 'min(100, max(0, actualVaporPressure / esDry * 100))',
        dependencies: ['actualVaporPressure', 'esDry'],
      },
      {
        id: 'dewPointC',
        expression: '243.5 * ln(actualVaporPressure / 6.112) / (17.67 - ln(actualVaporPressure / 6.112))',
        dependencies: ['actualVaporPressure'],
      },
      {
        id: 'dewPointF',
        expression: 'dewPointC * 9 / 5 + 32',
        dependencies: ['dewPointC'],
      },
    ],
    outputs: [
      {
        id: 'out-rhPercent',
        label: 'Relative Humidity',
        formulaRef: 'rhPercent',
        format: 'number',
        precision: 1,
        suffix: ' %RH',
        highlight: true,
      },
      {
        id: 'out-dewPointF',
        label: 'Dew Point',
        formulaRef: 'dewPointF',
        format: 'number',
        precision: 1,
        suffix: ' �F',
        highlight: true,
      },
      {
        id: 'out-dewPointC',
        label: 'Dew Point (�C)',
        formulaRef: 'dewPointC',
        format: 'number',
        precision: 1,
        suffix: ' �C',
      },
      {
        id: 'out-actualVaporPressure',
        label: 'Actual Vapor Pressure',
        formulaRef: 'actualVaporPressure',
        format: 'number',
        precision: 3,
        suffix: ' kPa',
      },
    ],
    guide: {
      whatIsIt:
        'Relative humidity (RH) expresses how much moisture air holds relative to its maximum capacity at that temperature. The dew point is the temperature at which air must be cooled (at constant pressure) for condensation to begin. These two values are the foundation of psychrometric analysis � used to design HVAC systems, predict condensation on cold surfaces, and ensure occupant comfort.',
      howToUse:
        'Use a sling psychrometer or digital hygrometer with wet/dry bulb readings. Enter both temperatures. The calculator applies the Magnus formula for saturation vapor pressure and the Sprung formula for actual vapor pressure. RH and dew point are derived from the vapor pressure ratio.',
      exampleScenario:
        'Outdoor summer conditions: 75�F dry bulb, 62�F wet bulb. Calculator gives RH � 53%, dew point � 54�F. The chilled water coil leaving air temperature of 55�F is just above the dew point, so the coil will dehumidify slightly. ASHRAE 55 comfort zone for 75�F is RH 30�60%, so this is within comfort range.',
      proTip:
        'A dew point above 60�F (15.6�C) feels "muggy" to most people. Above 70�F dew point is extremely uncomfortable. For IAQ and mold prevention, keep indoor dew point below 59�F (15�C). In HVAC commissioning, measure wet and dry bulb at coil entering and leaving air to calculate sensible heat ratio and verify latent cooling capacity.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 10. Sump Pump Capacity
  // =========================================================================
  {
    id: 'sump-pump-capacity',
    slug: 'sump-pump-capacity',
    title: 'Sump Pump Capacity Calculator',
    description:
      'Calculate the required sump pump GPM capacity based on water inflow rate, sump pit volume, and target pump runtime percentage.',
    icon: '🚰',
    category: 'construction',
    subcategory: 'hvac',
    tags: ['sump pump', 'GPM', 'basement', 'drainage', 'pump sizing', 'flooding', 'water management'],
    inputs: [
      {
        id: 'inflowGPM',
        label: 'Peak Water Inflow Rate (GPM)',
        type: 'number',
        defaultValue: 15,
        min: 0.1,
        max: 10000,
        step: 0.5,
        placeholder: 'e.g. 15',
        helpText: 'Maximum groundwater/drainage inflow rate during peak storm events.',
        required: true,
      },
      {
        id: 'pitVolGal',
        label: 'Sump Pit Volume (gallons)',
        type: 'number',
        defaultValue: 20,
        min: 1,
        max: 10000,
        step: 1,
        placeholder: 'e.g. 20',
        helpText: 'Volume of the sump pit. A typical 18" dia � 24" deep pit � 22 gallons.',
        required: true,
      },
      {
        id: 'runtimePct',
        label: 'Target Pump Runtime (%)',
        type: 'number',
        defaultValue: 50,
        min: 10,
        max: 90,
        step: 5,
        placeholder: 'e.g. 50',
        helpText: 'Percentage of time the pump runs. 50% = runs half the time, 50% off.',
        required: true,
      },
      {
        id: 'staticHeadFt',
        label: 'Static Discharge Head (ft)',
        type: 'number',
        defaultValue: 10,
        min: 1,
        max: 100,
        step: 1,
        placeholder: 'e.g. 10',
        helpText: 'Vertical height water must be pumped to the discharge point.',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'requiredPumpGPM',
        expression: 'inflowGPM / (runtimePct / 100)',
        dependencies: ['inflowGPM', 'runtimePct'],
      },
      {
        id: 'cyclesPerHour',
        expression: 'inflowGPM * 60 / pitVolGal',
        dependencies: ['inflowGPM', 'pitVolGal'],
      },
      {
        id: 'pitFillTimeSec',
        expression: 'pitVolGal / inflowGPM * 60',
        dependencies: ['pitVolGal', 'inflowGPM'],
      },
      {
        id: 'pumpRunTimeSec',
        expression: 'pitVolGal / requiredPumpGPM * 60',
        dependencies: ['pitVolGal', 'requiredPumpGPM'],
      },
      {
        id: 'horsepower',
        expression: 'requiredPumpGPM * staticHeadFt / 3960',
        dependencies: ['requiredPumpGPM', 'staticHeadFt'],
      },
    ],
    outputs: [
      {
        id: 'out-requiredPumpGPM',
        label: 'Required Pump Capacity',
        formulaRef: 'requiredPumpGPM',
        format: 'number',
        precision: 1,
        suffix: ' GPM',
        highlight: true,
      },
      {
        id: 'out-horsepower',
        label: 'Estimated Pump HP',
        formulaRef: 'horsepower',
        format: 'number',
        precision: 3,
        suffix: ' HP',
        highlight: true,
      },
      {
        id: 'out-cyclesPerHour',
        label: 'Cycles per Hour',
        formulaRef: 'cyclesPerHour',
        format: 'number',
        precision: 1,
        suffix: ' cycles/hr',
      },
      {
        id: 'out-pitFillTimeSec',
        label: 'Pit Fill Time',
        formulaRef: 'pitFillTimeSec',
        format: 'number',
        precision: 0,
        suffix: ' seconds',
      },
    ],
    guide: {
      whatIsIt:
        'A sump pump must evacuate water faster than it enters during peak storm events. This calculator determines the required pump capacity (GPM) based on the inflow rate, pit volume (which acts as a buffer), and your target duty cycle (runtime percentage). Running a pump more than 80% duty cycle continuously accelerates wear.',
      howToUse:
        'Estimate peak inflow by timing how fast the pit fills during a heavy rain, then convert to GPM. Enter the pit volume, your desired runtime percentage (50% is a common target for longevity), and the vertical discharge head. The result tells you the minimum pump GPM rating you need at that head.',
      exampleScenario:
        'A basement pit fills at 15 GPM during a heavy storm. The pit holds 20 gallons. At 50% duty cycle, the pump needs 30 GPM capacity. Cycles/hr = 15�60/20 = 45 � well within the 5�10 cycles/hr maximum for pump longevity. Select a 1/2 HP pump rated = 30 GPM at 10 ft head.',
      proTip:
        'Limit pump cycles to 5�10 per hour to prevent motor overheating and premature seal failure. If calculated cycles/hr exceed 10, increase pit volume (deeper or wider pit). For critical applications (finished basements), install a battery backup pump and a water alarm. A 1/3 HP pump handles most residential needs; upgrade to 1/2 or 3/4 HP in high-water-table areas.',
    },
    metadata: { version: '1.0.0' },
  },
];
