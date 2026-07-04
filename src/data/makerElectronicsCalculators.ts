// ---------------------------------------------------------------------------
// Quantify � Maker & Electronics Calculators
// ---------------------------------------------------------------------------
// 10 electronics and maker calculators covering 3D printing, motor control,
// circuit design, and power electronics for hobbyists and engineers.
// ---------------------------------------------------------------------------

import type { CalculatorSchema } from '@/types/calculator';

export const makerElectronicsCalculators: CalculatorSchema[] = [
  // =========================================================================
  // 1. 3D Print Cost Calculator
  // =========================================================================
  {
    id: '3d-print-cost-calculator',
    slug: '3d-print-cost-calculator',
    title: '3D Print Cost Calculator',
    description:
      'Calculate the full cost of a 3D print including material, electricity, and markup � ideal for makers pricing prints for sale or tracking hobby expenses.',
    icon: '🖨',
    category: 'engineering',
    subcategory: 'maker',
    tags: ['3D printing', 'FDM', 'filament cost', 'print cost', 'maker', 'PLA', 'ABS', 'resin', 'pricing'],
    inputs: [
      {
        id: 'printTimeHours',
        label: 'Print Time (hours)',
        type: 'number',
        defaultValue: 4,
        min: 0.1,
        step: 0.5,
        required: true,
      },
      {
        id: 'materialGrams',
        label: 'Material Used (grams)',
        type: 'number',
        defaultValue: 80,
        min: 0.1,
        step: 1,
        required: true,
      },
      {
        id: 'materialCostPerKg',
        label: 'Filament Cost ($/kg)',
        type: 'number',
        defaultValue: 25,
        min: 0.01,
        step: 0.5,
        required: true,
      },
      {
        id: 'electricityKwh',
        label: 'Electricity Rate ($/kWh)',
        type: 'number',
        defaultValue: 0.15,
        min: 0.01,
        step: 0.01,
      },
      {
        id: 'printerWatts',
        label: 'Printer Wattage (W)',
        type: 'number',
        defaultValue: 200,
        min: 10,
        max: 2000,
        helpText: 'Average power draw. FDM printers: 100�300W. Resin printers: 50�90W.',
      },
      {
        id: 'markupPct',
        label: 'Markup %',
        type: 'number',
        defaultValue: 30,
        min: 0,
        max: 1000,
        helpText: 'Profit margin percentage to add on top of base cost.',
      },
    ],
    formulas: [
      {
        id: 'materialCost',
        expression: 'materialGrams / 1000 * materialCostPerKg',
        dependencies: ['materialGrams', 'materialCostPerKg'],
      },
      {
        id: 'electricityCost',
        expression: 'printerWatts / 1000 * printTimeHours * electricityKwh',
        dependencies: ['printerWatts', 'printTimeHours', 'electricityKwh'],
      },
      {
        id: 'baseCost',
        expression: 'materialCost + electricityCost',
        dependencies: ['materialCost', 'electricityCost'],
      },
      {
        id: 'totalWithMarkup',
        expression: 'baseCost * (1 + markupPct / 100)',
        dependencies: ['baseCost', 'markupPct'],
      },
      {
        id: 'costPerHour',
        expression: 'totalWithMarkup / printTimeHours',
        dependencies: ['totalWithMarkup', 'printTimeHours'],
      },
    ],
    outputs: [
      {
        id: 'out-materialCost',
        label: 'Material Cost',
        formulaRef: 'materialCost',
        format: 'number',
        precision: 2,
        prefix: '$',
      },
      {
        id: 'out-electricityCost',
        label: 'Electricity Cost',
        formulaRef: 'electricityCost',
        format: 'number',
        precision: 3,
        prefix: '$',
      },
      {
        id: 'out-baseCost',
        label: 'Base Cost',
        formulaRef: 'baseCost',
        format: 'number',
        precision: 2,
        prefix: '$',
      },
      {
        id: 'out-totalWithMarkup',
        label: 'Price to Charge (with markup)',
        formulaRef: 'totalWithMarkup',
        format: 'number',
        precision: 2,
        prefix: '$',
        highlight: true,
      },
    ],
    guide: {
      whatIsIt:
        'The 3D Print Cost Calculator breaks down the true cost of a print into material cost (filament consumed), electricity cost (based on printer wattage and print time), and adds a configurable markup for selling prints. It helps makers price their work fairly and track hobby expenses.',
      howToUse:
        'Enter the print time in hours, the grams of filament consumed (check your slicer estimate), the filament cost per kilogram, your local electricity rate, the average printer wattage, and your desired markup percentage. Material and electricity costs are summed to get the base cost, then markup is applied.',
      exampleScenario:
        '4-hour print, 80g of PLA at $25/kg, electricity at $0.15/kWh, 200W printer, 30% markup. Material: 80/1000 � $25 = $2.00. Electricity: 0.2 kW � 4hr � $0.15 = $0.12. Base cost: $2.12. With 30% markup: $2.12 � 1.30 = $2.76.',
      proTip:
        "Don't forget hidden costs: printer depreciation (~$0.10�0.50/hr for desktop FDM), failed prints (~5�15% waste), post-processing time (supports, sanding), and packaging. A common rule is to charge 2�3� material cost as a starting point, then adjust for print complexity and labor time.",
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 2. Stepper Motor Steps/mm Calculator
  // =========================================================================
  {
    id: 'stepper-motor-steps-mm',
    slug: 'stepper-motor-steps-mm',
    title: 'Stepper Motor Steps/mm Calculator',
    description:
      'Calculate the steps-per-mm value for 3D printer and CNC machine axes driven by belt/pulley or lead screw systems for accurate motion calibration.',
    icon: '⚙',
    category: 'engineering',
    subcategory: 'maker',
    tags: ['stepper motor', 'steps per mm', '3D printer', 'CNC', 'belt drive', 'lead screw', 'microstepping', 'Marlin', 'calibration'],
    inputs: [
      {
        id: 'stepsPerRev',
        label: 'Steps per Revolution',
        type: 'number',
        defaultValue: 200,
        min: 1,
        helpText: '200 for 1.8� motors (standard), 400 for 0.9� motors (high resolution).',
      },
      {
        id: 'microstepping',
        label: 'Microstepping',
        type: 'select',
        options: [
          { label: '1 (full step)', value: '1' },
          { label: '2 (half step)', value: '2' },
          { label: '4', value: '4' },
          { label: '8', value: '8' },
          { label: '16', value: '16' },
          { label: '32', value: '32' },
        ],
        defaultValue: '16',
        helpText: 'Set by DIP switches or firmware. Most modern 3D printer boards default to 16.',
      },
      {
        id: 'driveType',
        label: 'Drive Type',
        type: 'select',
        options: [
          { label: 'Belt & Pulley', value: 'belt' },
          { label: 'Lead Screw', value: 'screw' },
        ],
        defaultValue: 'belt',
      },
      {
        id: 'beltPitchMm',
        label: 'Belt Pitch (mm)',
        type: 'number',
        defaultValue: 2,
        min: 0.1,
        step: 0.1,
        helpText: 'GT2 = 2 mm, T5 = 5 mm, MXL = 2.032 mm.',
      },
      {
        id: 'pulleyTeeth',
        label: 'Pulley Teeth',
        type: 'number',
        defaultValue: 20,
        min: 6,
        max: 200,
        helpText: 'Number of teeth on the drive pulley. Common: 16, 20, 36 teeth.',
      },
      {
        id: 'leadScrewMm',
        label: 'Lead Screw Pitch (mm per revolution)',
        type: 'number',
        defaultValue: 8,
        min: 0.1,
        step: 0.5,
        helpText: 'T8 lead screw = 8 mm/rev, T4 = 4 mm/rev. Check lead (not pitch) for multi-start screws.',
      },
    ],
    formulas: [
      {
        id: 'beltStepsPerMm',
        expression: 'stepsPerRev * microstepping / (beltPitchMm * pulleyTeeth)',
        dependencies: ['stepsPerRev', 'microstepping', 'beltPitchMm', 'pulleyTeeth'],
      },
      {
        id: 'screwStepsPerMm',
        expression: 'stepsPerRev * microstepping / leadScrewMm',
        dependencies: ['stepsPerRev', 'microstepping', 'leadScrewMm'],
      },
    ],
    outputs: [
      {
        id: 'out-beltStepsPerMm',
        label: 'Belt Drive Steps/mm',
        formulaRef: 'beltStepsPerMm',
        format: 'number',
        precision: 2,
        suffix: ' steps/mm',
        highlight: true,
      },
      {
        id: 'out-screwStepsPerMm',
        label: 'Lead Screw Steps/mm',
        formulaRef: 'screwStepsPerMm',
        format: 'number',
        precision: 2,
        suffix: ' steps/mm',
      },
    ],
    guide: {
      whatIsIt:
        'Steps/mm is the firmware parameter (in Marlin: DEFAULT_AXIS_STEPS_PER_UNIT) that tells the motion controller how many motor steps correspond to 1 mm of physical movement. For belt drives: steps/mm = (steps/rev � microstepping) � (belt pitch � pulley teeth). For lead screws: steps/mm = (steps/rev � microstepping) � lead.',
      howToUse:
        'Select your motor resolution (steps/rev), microstepping setting, and drive type. For belt drives, enter the belt pitch and pulley tooth count. For lead screws, enter the lead (mm of linear travel per full motor revolution). Both values are computed so you can compare.',
      exampleScenario:
        'Standard Ender-3 X/Y: 200 steps/rev, 16� microstepping, GT2 belt (2mm), 20-tooth pulley. Steps/mm = 200�16/(2�20) = 3200/40 = 80 steps/mm. Z-axis: T8 lead screw (8mm lead). Steps/mm = 200�16/8 = 400 steps/mm.',
      proTip:
        'After setting steps/mm in firmware, always physically calibrate by commanding a precise movement (e.g., 100 mm) and measuring actual displacement with calipers. Adjust using: new steps/mm = current steps/mm � (commanded distance / actual distance). Belt tension and backlash affect real-world accuracy.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 3. LED Current Limiting Resistor
  // =========================================================================
  {
    id: 'led-resistor-calculator',
    slug: 'led-resistor-calculator',
    title: 'LED Current Limiting Resistor',
    description:
      'Calculate the correct current limiting resistor value for LEDs in series, given supply voltage, LED forward voltage, and desired current.',
    icon: '💡',
    category: 'engineering',
    subcategory: 'electrical',
    tags: ['LED', 'resistor', 'current limiting', 'forward voltage', "Ohm's law", 'electronics', 'circuit', 'Arduino', 'Raspberry Pi'],
    inputs: [
      {
        id: 'supplyVoltage',
        label: 'Supply Voltage (V)',
        type: 'number',
        defaultValue: 5,
        min: 0.1,
        step: 0.1,
        required: true,
      },
      {
        id: 'ledForwardVoltage',
        label: 'LED Forward Voltage Vf (V)',
        type: 'number',
        defaultValue: 2.0,
        min: 0.1,
        max: 5,
        step: 0.1,
        helpText: 'Red/Yellow/Orange � 2.0V, Blue/White/Green � 3.0�3.5V, IR � 1.2V. Check datasheet.',
      },
      {
        id: 'ledCurrentMa',
        label: 'LED Forward Current (mA)',
        type: 'number',
        defaultValue: 20,
        min: 0.1,
        max: 1000,
        step: 1,
        helpText: 'Standard LEDs: 20 mA max. High-efficiency: 10 mA. High-power: 350 mA�3 A.',
      },
      {
        id: 'numLeds',
        label: 'LEDs in Series',
        type: 'number',
        defaultValue: 1,
        min: 1,
        max: 50,
        helpText: 'For series connection, forward voltages add up. Ensure supply > total Vf.',
      },
    ],
    formulas: [
      {
        id: 'totalVf',
        expression: 'ledForwardVoltage * numLeds',
        dependencies: ['ledForwardVoltage', 'numLeds'],
      },
      {
        id: 'resistanceOhms',
        expression: '(supplyVoltage - totalVf) / (ledCurrentMa / 1000)',
        dependencies: ['supplyVoltage', 'totalVf', 'ledCurrentMa'],
      },
      {
        id: 'powerWatts',
        expression: '(supplyVoltage - totalVf) * ledCurrentMa / 1000',
        dependencies: ['supplyVoltage', 'totalVf', 'ledCurrentMa'],
      },
    ],
    outputs: [
      {
        id: 'out-resistanceOhms',
        label: 'Resistance Required',
        formulaRef: 'resistanceOhms',
        format: 'number',
        precision: 0,
        suffix: ' O',
        highlight: true,
      },
      {
        id: 'out-powerWatts',
        label: 'Power Dissipated in Resistor',
        formulaRef: 'powerWatts',
        format: 'number',
        precision: 3,
        suffix: ' W',
      },
    ],
    guide: {
      whatIsIt:
        'A current-limiting resistor protects LEDs from excess current by dropping the voltage difference between the supply and the LED forward voltage. Without it, LEDs quickly burn out. R = (Vsupply - Vf) / I. For series LEDs, total Vf = Vf � number of LEDs.',
      howToUse:
        'Enter your supply voltage, the LED forward voltage from the datasheet (or estimate: red/yellow � 2V, blue/white � 3.3V), desired current in mA, and the number of LEDs in series. Round up the calculated resistance to the nearest standard E24/E12 value.',
      exampleScenario:
        '5V supply, red LED (Vf = 2V), 20 mA, 1 LED: R = (5-2)/0.02 = 150 O. Power = (5-2) � 0.02 = 0.06 W. Use a 1/4W resistor. For 3 LEDs in series: totalVf = 6V � exceeds supply! Reduce series count or increase voltage.',
      proTip:
        'Always round up to the next standard resistor value (not down) to keep current within the LED rating. For power LEDs (>100 mA), use a constant-current driver instead of a resistor � resistor-based control wastes power and varies with temperature. Add 20�30% headroom to resistor power rating (e.g., use 1/4W for 0.06W dissipation).',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 4. Voltage Divider Calculator
  // =========================================================================
  {
    id: 'voltage-divider-calculator',
    slug: 'voltage-divider-calculator',
    title: 'Voltage Divider Calculator',
    description:
      'Calculate output voltage, current draw, and power dissipation for a two-resistor voltage divider � ideal for ADC input scaling, sensor biasing, and reference voltages.',
    icon: '⚡',
    category: 'engineering',
    subcategory: 'electrical',
    tags: ['voltage divider', 'resistor network', 'Vout', 'ADC', 'level shifter', 'circuit design', 'electronics', 'signal conditioning'],
    inputs: [
      {
        id: 'vin',
        label: 'Input Voltage Vin (V)',
        type: 'number',
        defaultValue: 12,
        min: 0.001,
        step: 0.1,
        required: true,
      },
      {
        id: 'r1',
        label: 'R1 (ohms)',
        type: 'number',
        defaultValue: 10000,
        min: 1,
        step: 100,
        required: true,
      },
      {
        id: 'r2',
        label: 'R2 (ohms)',
        type: 'number',
        defaultValue: 4700,
        min: 1,
        step: 100,
        required: true,
      },
    ],
    formulas: [
      {
        id: 'vout',
        expression: 'vin * r2 / (r1 + r2)',
        dependencies: ['vin', 'r1', 'r2'],
      },
      {
        id: 'currentMa',
        expression: 'vin / (r1 + r2) * 1000',
        dependencies: ['vin', 'r1', 'r2'],
      },
      {
        id: 'powerR1',
        expression: 'pow(vin - vout, 2) / r1',
        dependencies: ['vin', 'vout', 'r1'],
      },
      {
        id: 'powerR2',
        expression: 'pow(vout, 2) / r2',
        dependencies: ['vout', 'r2'],
      },
    ],
    outputs: [
      {
        id: 'out-vout',
        label: 'Output Voltage (Vout)',
        formulaRef: 'vout',
        format: 'number',
        precision: 4,
        suffix: ' V',
        highlight: true,
      },
      {
        id: 'out-currentMa',
        label: 'Current Through Divider',
        formulaRef: 'currentMa',
        format: 'number',
        precision: 2,
        suffix: ' mA',
      },
      {
        id: 'out-powerR1',
        label: 'Power in R1',
        formulaRef: 'powerR1',
        format: 'number',
        precision: 5,
        suffix: ' W',
      },
      {
        id: 'out-powerR2',
        label: 'Power in R2',
        formulaRef: 'powerR2',
        format: 'number',
        precision: 5,
        suffix: ' W',
      },
    ],
    guide: {
      whatIsIt:
        'A voltage divider uses two resistors in series to scale down a voltage: Vout = Vin � R2 / (R1 + R2). It is one of the most fundamental circuits in electronics, used for ADC input scaling (e.g., reading 12V with a 3.3V MCU), sensor biasing, and generating reference voltages.',
      howToUse:
        'Enter the input voltage and the two resistor values. Vout, current draw, and power dissipation in each resistor are calculated. To design for a target Vout, choose R2/R1 ratio = Vout/(Vin - Vout). Use the E24 or E96 resistor series for precision applications.',
      exampleScenario:
        'Scale 12V to 3.3V for an Arduino analog input: R2/(R1+R2) = 3.3/12 = 0.275. Choose R2 = 10kO, R1 = 27kO ? Vout = 12�10/(10+27) = 3.24V ?. Current = 12/37000 = 0.324 mA (low quiescent draw).',
      proTip:
        'A voltage divider is only accurate when the load impedance is much larger than R2 (at least 10�). If the load draws significant current, it will pull Vout down. Use a unity-gain op-amp buffer after the divider for low-impedance loads. For battery monitoring, use high-value resistors (100kO+) to minimize quiescent current drain.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 5. 555 Timer Calculator
  // =========================================================================
  {
    id: '555-timer-calculator',
    slug: '555-timer-calculator',
    title: '555 Timer Astable / Monostable Calculator',
    description:
      'Calculate frequency, period, duty cycle (astable mode), and pulse width (monostable mode) for the classic 555 timer IC based on R1, R2, and capacitor values.',
    icon: '⏱',
    category: 'engineering',
    subcategory: 'electrical',
    tags: ['555 timer', 'NE555', 'astable', 'monostable', 'oscillator', 'frequency', 'duty cycle', 'pulse width', 'electronics'],
    inputs: [
      {
        id: 'mode',
        label: 'Timer Mode',
        type: 'select',
        options: [
          { label: 'Astable (oscillator)', value: 'astable' },
          { label: 'Monostable (one-shot)', value: 'mono' },
        ],
        defaultValue: 'astable',
      },
      {
        id: 'r1Kohm',
        label: 'R1 (kO)',
        type: 'number',
        defaultValue: 10,
        min: 0.001,
        step: 0.1,
        helpText: 'In astable mode, R1 must be > 0. In monostable, only R1 is used.',
      },
      {
        id: 'r2Kohm',
        label: 'R2 (kO)',
        type: 'number',
        defaultValue: 10,
        min: 0.001,
        step: 0.1,
        helpText: 'Used only in astable mode. Increasing R2 decreases frequency and duty cycle.',
      },
      {
        id: 'cUf',
        label: 'Capacitor C (�F)',
        type: 'number',
        defaultValue: 0.1,
        min: 0.0001,
        step: 0.001,
        required: true,
      },
    ],
    formulas: [
      {
        id: 'r1',
        expression: 'r1Kohm * 1000',
        dependencies: ['r1Kohm'],
      },
      {
        id: 'r2',
        expression: 'r2Kohm * 1000',
        dependencies: ['r2Kohm'],
      },
      {
        id: 'c',
        expression: 'cUf / 1000000',
        dependencies: ['cUf'],
      },
      {
        id: 'freqAstable',
        expression: '1.44 / ((r1 + 2 * r2) * c)',
        dependencies: ['r1', 'r2', 'c'],
      },
      {
        id: 'periodAstable',
        expression: '1 / freqAstable',
        dependencies: ['freqAstable'],
      },
      {
        id: 'dutyCycle',
        expression: '(r1 + r2) / (r1 + 2 * r2) * 100',
        dependencies: ['r1', 'r2'],
      },
      {
        id: 'timeMono',
        expression: '1.1 * r1 * c',
        dependencies: ['r1', 'c'],
      },
    ],
    outputs: [
      {
        id: 'out-freqAstable',
        label: 'Frequency (Astable)',
        formulaRef: 'freqAstable',
        format: 'number',
        precision: 2,
        suffix: ' Hz',
        highlight: true,
      },
      {
        id: 'out-periodAstable',
        label: 'Period (Astable)',
        formulaRef: 'periodAstable',
        format: 'number',
        precision: 4,
        suffix: ' s',
      },
      {
        id: 'out-dutyCycle',
        label: 'Duty Cycle (Astable)',
        formulaRef: 'dutyCycle',
        format: 'number',
        precision: 1,
        suffix: '%',
      },
      {
        id: 'out-timeMono',
        label: 'Pulse Width (Monostable)',
        formulaRef: 'timeMono',
        format: 'number',
        precision: 4,
        suffix: ' s',
      },
    ],
    guide: {
      whatIsIt:
        'The 555 timer is one of the most popular ICs ever made. In astable mode it generates a continuous square wave: f = 1.44/((R1+2R2)�C), duty cycle = (R1+R2)/(R1+2R2). In monostable mode it produces a single timed pulse when triggered: t = 1.1�R1�C. Note: 50% duty cycle requires R1 << R2 or use of a bypass diode across R2.',
      howToUse:
        'Select the mode, enter R1 and R2 in kO, and capacitance in �F. For monostable, only R1 and C matter. All four outputs (frequency, period, duty cycle, and monostable pulse width) are always calculated.',
      exampleScenario:
        'LED blinker at ~1 Hz, 50% duty: R1 = 1kO, R2 = 72kO, C = 10�F. f = 1.44/((1k+144k)�10�) = 1.44/1.45 � 0.99 Hz. Duty � (1+72)/(1+144) � 50.3%. For 1-second monostable pulse: R1 = 910kO, C = 1�F ? t = 1.1�910k�1� = 1.001s.',
      proTip:
        'The 555 cannot achieve exactly 50% duty cycle in standard astable mode because the charge path includes R1+R2 and discharge path is only R2. Use a Schottky diode in parallel with R2 (cathode toward pin 7) to bypass R1 during discharge, achieving ~50%. The CMOS version (TLC555) draws less current and is better for battery-powered applications.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 6. PCB Trace Width Calculator (IPC-2221)
  // =========================================================================
  {
    id: 'pcb-trace-width-calculator',
    slug: 'pcb-trace-width-calculator',
    title: 'PCB Trace Width Calculator (IPC-2221)',
    description:
      'Calculate minimum PCB copper trace width to safely carry a specified current with a given temperature rise, per IPC-2221 standard for external and internal traces.',
    icon: '🧲',
    category: 'engineering',
    subcategory: 'electrical',
    tags: ['PCB', 'trace width', 'IPC-2221', 'copper trace', 'current carrying', 'PCB design', 'thermal', 'mils', 'power electronics'],
    inputs: [
      {
        id: 'currentAmps',
        label: 'Current (A)',
        type: 'number',
        defaultValue: 1,
        min: 0.001,
        step: 0.1,
        required: true,
      },
      {
        id: 'tempRiseC',
        label: 'Allowable Temp Rise (�C)',
        type: 'number',
        defaultValue: 10,
        min: 1,
        max: 50,
        helpText: 'Typical: 10�C for signal, 20�30�C for power traces. Lower = wider trace.',
      },
      {
        id: 'copperOz',
        label: 'Copper Weight',
        type: 'select',
        options: [
          { label: '1 oz (35 �m)', value: '1' },
          { label: '2 oz (70 �m)', value: '2' },
          { label: '0.5 oz (17.5 �m)', value: '0.5' },
        ],
        defaultValue: '1',
        helpText: 'Standard PCBs use 1 oz copper. 2 oz for high-current applications.',
      },
      {
        id: 'layer',
        label: 'Trace Layer',
        type: 'select',
        options: [
          { label: 'External trace (k = 0.048)', value: '0.048' },
          { label: 'Internal trace (k = 0.024)', value: '0.024' },
        ],
        defaultValue: '0.048',
        helpText: 'Internal traces have less heat dissipation � require wider traces for same current.',
      },
    ],
    formulas: [
      {
        id: 'crossSectionMilSq',
        expression: 'pow(currentAmps / (layer * pow(tempRiseC, 0.44)), 1 / 0.725)',
        dependencies: ['currentAmps', 'layer', 'tempRiseC'],
      },
      {
        id: 'widthMils',
        expression: 'crossSectionMilSq / (copperOz * 1.378)',
        dependencies: ['crossSectionMilSq', 'copperOz'],
      },
      {
        id: 'widthMm',
        expression: 'widthMils * 0.0254',
        dependencies: ['widthMils'],
      },
    ],
    outputs: [
      {
        id: 'out-widthMils',
        label: 'Trace Width (mils)',
        formulaRef: 'widthMils',
        format: 'number',
        precision: 1,
        suffix: ' mils',
        highlight: true,
      },
      {
        id: 'out-widthMm',
        label: 'Trace Width (mm)',
        formulaRef: 'widthMm',
        format: 'number',
        precision: 3,
        suffix: ' mm',
      },
    ],
    guide: {
      whatIsIt:
        'The IPC-2221 standard defines minimum PCB trace widths for given current carrying capacity. The formula relates current to cross-sectional area: I = k � ?T^0.44 � A^0.725, where k = 0.048 (external) or 0.024 (internal), ?T = temperature rise, A = cross-section in mils�. Width = A / (copper thickness in mils). 1 oz copper = 1.378 mils thick.',
      howToUse:
        'Enter the maximum current the trace will carry, the acceptable temperature rise above ambient, copper weight, and whether it is an external or internal trace. The minimum trace width is returned in both mils and millimeters.',
      exampleScenario:
        '1A, 10�C rise, 1oz copper, external trace: crossSection = (1/(0.048 � 10^0.44))^(1/0.725) = (1/0.138)^1.379 � 31.4 mil�. Width = 31.4/1.378 � 22.8 mils � 0.58 mm. Always add 20�30% margin ? use =0.75 mm.',
      proTip:
        'IPC-2221 is conservative and assumes a 25�C ambient in still air. For power supplies, motor drivers, and battery chargers, always add significant margin (50�100%) and consider copper pours instead of traces. Use vias to carry current between layers. Online tools like Saturn PCB Toolkit offer more refined calculations including via current capacity.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 7. Battery Run Time Calculator
  // =========================================================================
  {
    id: 'battery-run-time-calculator',
    slug: 'battery-run-time-calculator',
    title: 'Battery Run Time Calculator',
    description:
      'Estimate battery run time for portable devices by accounting for usable capacity, converter efficiency, and depth of discharge for accurate battery life planning.',
    icon: '🔋',
    category: 'engineering',
    subcategory: 'maker',
    tags: ['battery', 'run time', 'battery life', 'mAh', 'power bank', 'LiPo', 'Li-ion', 'IoT', 'portable power'],
    inputs: [
      {
        id: 'capacityMah',
        label: 'Battery Capacity (mAh)',
        type: 'number',
        defaultValue: 10000,
        min: 1,
        step: 100,
        required: true,
      },
      {
        id: 'loadCurrentMa',
        label: 'Load Current (mA)',
        type: 'number',
        defaultValue: 500,
        min: 0.001,
        step: 10,
        required: true,
      },
      {
        id: 'efficiencyPct',
        label: 'Converter Efficiency %',
        type: 'number',
        defaultValue: 85,
        min: 50,
        max: 100,
        helpText: 'Boost/buck converter efficiency. High-quality converters: 85�95%. Linear regulators: 60�80%.',
      },
      {
        id: 'dod',
        label: 'Depth of Discharge %',
        type: 'number',
        defaultValue: 80,
        min: 10,
        max: 100,
        helpText: 'Li-ion: 80% for longevity, 100% for max runtime. LiFePO4: 90�100%.',
      },
    ],
    formulas: [
      {
        id: 'usableCapacity',
        expression: 'capacityMah * dod / 100 * efficiencyPct / 100',
        dependencies: ['capacityMah', 'dod', 'efficiencyPct'],
      },
      {
        id: 'runTimeHours',
        expression: 'usableCapacity / loadCurrentMa',
        dependencies: ['usableCapacity', 'loadCurrentMa'],
      },
    ],
    outputs: [
      {
        id: 'out-usableCapacity',
        label: 'Usable Capacity',
        formulaRef: 'usableCapacity',
        format: 'number',
        precision: 0,
        suffix: ' mAh',
      },
      {
        id: 'out-runTimeHours',
        label: 'Estimated Run Time',
        formulaRef: 'runTimeHours',
        format: 'number',
        precision: 2,
        suffix: ' hours',
        highlight: true,
      },
    ],
    guide: {
      whatIsIt:
        'Battery run time depends on usable capacity (rated capacity � depth of discharge) reduced by converter inefficiency. Usable mAh = capacity � DoD% � efficiency%. Run time = usable mAh / load current. Manufacturer mAh ratings are at a slow 0.1C discharge; actual capacity decreases at higher currents and cold temperatures.',
      howToUse:
        'Enter battery capacity in mAh, average current draw of your device, the efficiency of any voltage regulator/converter between battery and load, and the depth of discharge (how far you drain the battery before recharging).',
      exampleScenario:
        '10,000 mAh power bank, 500 mA load, 85% converter efficiency, 80% DoD: usable = 10000 � 0.80 � 0.85 = 6800 mAh. Run time = 6800/500 = 13.6 hours. Many power banks have an additional 20�30% internal overhead, so real-world may be 10�11 hours.',
      proTip:
        'For sleep-mode IoT devices, calculate average current: Iavg = (Iactive � t_active + Isleep � t_sleep) / (t_active + t_sleep). A device drawing 200 mA for 10ms every 10 seconds has Iavg � 0.2 mA � dramatically increasing battery life. Temperature also matters: Li-ion loses ~20% capacity at 0�C.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 8. Wire Gauge Voltage Drop Calculator
  // =========================================================================
  {
    id: 'wire-gauge-voltage-drop',
    slug: 'wire-gauge-voltage-drop',
    title: 'Wire Gauge Voltage Drop Calculator',
    description:
      'Calculate round-trip voltage drop, drop percentage, and power loss for a given wire gauge, cable run length, and current � essential for automotive, solar, and low-voltage DC systems.',
    icon: '🧵',
    category: 'engineering',
    subcategory: 'electrical',
    tags: ['voltage drop', 'wire gauge', 'AWG', 'cable sizing', 'DC wiring', 'automotive', 'solar', 'power loss', '12V'],
    inputs: [
      {
        id: 'currentAmps',
        label: 'Current (A)',
        type: 'number',
        defaultValue: 10,
        min: 0.001,
        step: 1,
        required: true,
      },
      {
        id: 'lengthM',
        label: 'One-Way Wire Length (m)',
        type: 'number',
        defaultValue: 5,
        min: 0.01,
        step: 0.5,
        required: true,
      },
      {
        id: 'wireGauge',
        label: 'Wire Gauge',
        type: 'select',
        options: [
          { label: '14 AWG (2.62 mm�)', value: '6.56' },
          { label: '12 AWG (3.31 mm�)', value: '5.21' },
          { label: '10 AWG (5.26 mm�)', value: '3.28' },
          { label: '8 AWG (8.37 mm�)', value: '2.06' },
          { label: '6 AWG (13.3 mm�)', value: '1.30' },
          { label: '2 AWG (33.6 mm�)', value: '0.515' },
        ],
        defaultValue: '6.56',
        helpText: 'Resistance values in mO/m at 20�C. Resistance increases ~0.4% per �C.',
      },
      {
        id: 'supplyVoltage',
        label: 'Supply Voltage (V)',
        type: 'number',
        defaultValue: 12,
        min: 0.1,
        step: 0.1,
        required: true,
      },
    ],
    formulas: [
      {
        id: 'resistanceMOhmPerM',
        expression: 'wireGauge',
        dependencies: ['wireGauge'],
      },
      {
        id: 'vDropV',
        expression: '2 * lengthM * currentAmps * resistanceMOhmPerM / 1000',
        dependencies: ['lengthM', 'currentAmps', 'resistanceMOhmPerM'],
      },
      {
        id: 'vDropPct',
        expression: 'vDropV / supplyVoltage * 100',
        dependencies: ['vDropV', 'supplyVoltage'],
      },
      {
        id: 'powerLossW',
        expression: 'vDropV * currentAmps',
        dependencies: ['vDropV', 'currentAmps'],
      },
    ],
    outputs: [
      {
        id: 'out-vDropV',
        label: 'Total Voltage Drop (round trip)',
        formulaRef: 'vDropV',
        format: 'number',
        precision: 3,
        suffix: ' V drop',
        highlight: true,
      },
      {
        id: 'out-vDropPct',
        label: 'Voltage Drop %',
        formulaRef: 'vDropPct',
        format: 'number',
        precision: 2,
        suffix: '%',
      },
      {
        id: 'out-powerLossW',
        label: 'Power Loss in Wire',
        formulaRef: 'powerLossW',
        format: 'number',
        precision: 2,
        suffix: ' W',
      },
    ],
    guide: {
      whatIsIt:
        'Voltage drop in a wire depends on current, wire length, and resistance per unit length: V_drop = 2 � L � I � R_per_m. The factor of 2 accounts for the round trip (positive and negative conductors). For 12V DC systems, a drop >3% (0.36V) is considered excessive. Power lost in the wire = V_drop � I (in watts).',
      howToUse:
        'Select the wire gauge, enter the one-way cable run length, current, and supply voltage. The total round-trip voltage drop, percentage, and power loss are computed. If the drop percentage exceeds 3%, go up one or two wire gauges.',
      exampleScenario:
        '14 AWG, 5m one-way, 10A, 12V system: R = 6.56 mO/m. V_drop = 2 � 5 � 10 � 0.00656 = 0.656 V. Drop% = 0.656/12 � 100 = 5.5% � excessive! Switch to 10 AWG (3.28 mO/m): V_drop = 2 � 5 � 10 � 0.00328 = 0.328 V ? 2.7% � acceptable.',
      proTip:
        'For solar panel installations, keep voltage drop <1% for maximum harvest efficiency. Use a wire sizing calculator specific to your NEC/IEC jurisdiction for safety compliance. At high temperatures (engine bay, attics), wire resistance increases and current capacity decreases � derate accordingly. Crimp connections and fuse holders also add resistance; use high-quality tinned connectors.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 9. Capacitor Charge / Discharge Time
  // =========================================================================
  {
    id: 'capacitor-charge-time-calculator',
    slug: 'capacitor-charge-time-calculator',
    title: 'Capacitor Charge / Discharge Time',
    description:
      'Calculate RC time constant, charge time to 63% and 99%, half-life, and voltage at 1t and 2t for capacitor charging and discharging circuits.',
    icon: '🌀',
    category: 'engineering',
    subcategory: 'electrical',
    tags: ['RC circuit', 'capacitor', 'time constant', 'tau', 'charge time', 'discharge', 'filter', 'RC delay', 'electronics'],
    inputs: [
      {
        id: 'resistanceKohm',
        label: 'Resistance R (kO)',
        type: 'number',
        defaultValue: 10,
        min: 0.001,
        step: 1,
        required: true,
      },
      {
        id: 'capacitanceUf',
        label: 'Capacitance C (�F)',
        type: 'number',
        defaultValue: 100,
        min: 0.0001,
        step: 1,
        required: true,
      },
      {
        id: 'supplyVoltage',
        label: 'Supply Voltage (V)',
        type: 'number',
        defaultValue: 9,
        min: 0.001,
        step: 0.1,
      },
    ],
    formulas: [
      {
        id: 'r',
        expression: 'resistanceKohm * 1000',
        dependencies: ['resistanceKohm'],
      },
      {
        id: 'c',
        expression: 'capacitanceUf / 1000000',
        dependencies: ['capacitanceUf'],
      },
      {
        id: 'tauMs',
        expression: 'r * c * 1000',
        dependencies: ['r', 'c'],
      },
      {
        id: 'time63pctMs',
        expression: 'tauMs',
        dependencies: ['tauMs'],
      },
      {
        id: 'time99pctMs',
        expression: '5 * tauMs',
        dependencies: ['tauMs'],
      },
      {
        id: 'timeToHalfMs',
        expression: '0.693 * tauMs',
        dependencies: ['tauMs'],
      },
      {
        id: 'voltageAt1Tau',
        expression: 'supplyVoltage * (1 - exp(-1))',
        dependencies: ['supplyVoltage'],
      },
      {
        id: 'voltageAt2Tau',
        expression: 'supplyVoltage * (1 - exp(-2))',
        dependencies: ['supplyVoltage'],
      },
    ],
    outputs: [
      {
        id: 'out-tauMs',
        label: 'Time Constant (t = RC)',
        formulaRef: 'tauMs',
        format: 'number',
        precision: 2,
        suffix: ' ms',
        highlight: true,
      },
      {
        id: 'out-time63pctMs',
        label: '1t � 63% Charge',
        formulaRef: 'time63pctMs',
        format: 'number',
        precision: 2,
        suffix: ' ms',
      },
      {
        id: 'out-time99pctMs',
        label: '5t � ~99% Charge',
        formulaRef: 'time99pctMs',
        format: 'number',
        precision: 2,
        suffix: ' ms',
      },
      {
        id: 'out-voltageAt1Tau',
        label: 'Voltage at 1t',
        formulaRef: 'voltageAt1Tau',
        format: 'number',
        precision: 2,
        suffix: ' V',
      },
    ],
    guide: {
      whatIsIt:
        'An RC circuit charges exponentially: V(t) = Vsupply � (1 - e^(-t/t)), where t = R � C is the time constant. After 1t, the capacitor is at 63.2% of full charge. After 5t it is at 99.3% (considered fully charged for most purposes). The same exponential applies during discharge toward 0V.',
      howToUse:
        'Enter the resistance in kO and capacitance in �F. The time constant t, time to 63% and 99% charge, and voltages at 1t and 2t are calculated. To find t for a target charge time T at a percentage P: t = -T / ln(1-P).',
      exampleScenario:
        '10kO resistor, 100�F capacitor, 9V supply: t = 10,000 � 0.0001 = 1000 ms = 1 second. After 1s: 63.2% ? 5.69V. After 5s: 99.3% ? 8.94V (effectively full). This RC time is commonly used in simple power-on delay circuits.',
      proTip:
        'RC circuits form simple low-pass filters with cutoff frequency fc = 1/(2pRC). At fc, signal amplitude is -3 dB (70.7% of input). Use this for debouncing buttons: add 10kO + 100nF to a GPIO input to filter glitches. For precision timing, use a 555 timer or crystal oscillator � RC tolerances (�10�20%) make RC timing imprecise.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 10. Ohm's Law & Power Calculator (Enhanced)
  // =========================================================================
  {
    id: 'ohms-law-power-calculator',
    slug: 'ohms-law-power-calculator',
    title: "Ohm's Law & Power Calculator (Enhanced)",
    description:
      "Solve Ohm's Law for current, voltage, resistance, and power. Enter any two known values to calculate the rest � ideal for quick circuit analysis and component selection.",
    icon: '🔌',
    category: 'engineering',
    subcategory: 'electrical',
    tags: ["Ohm's law", 'resistance', 'voltage', 'current', 'power', 'watts', 'electronics', 'circuit analysis', 'Wh'],
    inputs: [
      {
        id: 'knownV',
        label: 'Voltage V (volts)',
        type: 'number',
        defaultValue: 12,
        min: 0,
        step: 0.1,
        required: true,
      },
      {
        id: 'knownR',
        label: 'Resistance R (ohms)',
        type: 'number',
        defaultValue: 100,
        min: 0.000001,
        step: 1,
        required: true,
      },
      {
        id: 'knownI',
        label: 'Current I (amps, 0 = calculate from V/R)',
        type: 'number',
        defaultValue: 0,
        min: 0,
        step: 0.001,
        helpText: 'Enter 0 to calculate current from V � R. Enter a value to override.',
      },
    ],
    formulas: [
      {
        id: 'current',
        expression: 'knownI > 0 ? knownI : knownV / knownR',
        dependencies: ['knownI', 'knownV', 'knownR'],
      },
      {
        id: 'voltage',
        expression: 'knownV',
        dependencies: ['knownV'],
      },
      {
        id: 'resistance',
        expression: 'knownR',
        dependencies: ['knownR'],
      },
      {
        id: 'powerW',
        expression: 'voltage * current',
        dependencies: ['voltage', 'current'],
      },
      {
        id: 'energyPerHour',
        expression: 'powerW * 3600 / 1000',
        dependencies: ['powerW'],
      },
    ],
    outputs: [
      {
        id: 'out-current',
        label: 'Current (I)',
        formulaRef: 'current',
        format: 'number',
        precision: 4,
        suffix: ' A',
        highlight: true,
      },
      {
        id: 'out-powerW',
        label: 'Power',
        formulaRef: 'powerW',
        format: 'number',
        precision: 3,
        suffix: ' W',
      },
      {
        id: 'out-energyPerHour',
        label: 'Energy per Hour',
        formulaRef: 'energyPerHour',
        format: 'number',
        precision: 3,
        suffix: ' Wh/hr',
      },
    ],
    guide: {
      whatIsIt:
        "Ohm's Law defines the relationship between voltage (V), current (I), and resistance (R): V = IR. Power P = V � I = I�R = V�/R. This enhanced calculator solves for current given voltage and resistance, or uses a manually entered current for power calculations. Energy per hour = P � 1 hour (in Wh).",
      howToUse:
        'Enter the voltage and resistance. Leave current as 0 to auto-calculate I = V/R. Or enter a known current to override (e.g., when resistance is non-linear or when analyzing a constant-current circuit). All power relationships are derived from the resulting V and I.',
      exampleScenario:
        '12V supply across a 100O resistor: I = 12/100 = 0.12 A = 120 mA. Power = 12 � 0.12 = 1.44 W. Energy per hour = 1.44 Wh. A 1/4W resistor would be inadequate here � use at least a 2W resistor with margin.',
      proTip:
        "Always choose resistors with a power rating at least 2� the calculated dissipation for reliability and temperature derating. In real circuits, Ohm's Law applies to linear resistors � semiconductors (diodes, transistors, LEDs) and reactive components (capacitors, inductors) behave differently. Use a SPICE simulator (LTspice is free) for complex circuit analysis.",
    },
    metadata: { version: '1.0.0' },
  },
];
