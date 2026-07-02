import { CalculatorSchema } from '@/types/calculator';

export const manufacturingCalculators: CalculatorSchema[] = [
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // 1. Speeds and Feeds Calculator
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'speeds-feeds',
    slug: 'speeds-feeds',
    title: 'Speeds and Feeds Calculator',
    description:
      'Calculate spindle RPM and feed rate for milling and drilling operations from cutting speed, tool diameter, flute count, and chip load.',
    icon: '⚙️',
    category: 'engineering',
    subcategory: 'manufacturing',
    tags: ['speeds feeds', 'RPM', 'feed rate', 'CNC', 'milling', 'chip load', 'machining'],
    inputs: [
      {
        id: 'cuttingSpeed',
        label: 'Cutting Speed',
        type: 'number',
        defaultValue: 300,
        min: 1,
        step: 10,
        helpText:
          'Surface cutting speed: SFM for Imperial, m/min for Metric. Refer to material cutting speed charts.',
        required: true,
      },
      {
        id: 'toolDiameter',
        label: 'Tool Diameter',
        type: 'number',
        defaultValue: 0.5,
        min: 0.001,
        step: 0.0625,
        helpText:
          'Tool diameter in inches (Imperial) or mm (Metric). Use the same unit system as selected below.',
        required: true,
      },
      {
        id: 'units',
        label: 'Unit System',
        type: 'select',
        defaultValue: 'imperial',
        options: [
          { label: 'Imperial (SFM / inches)', value: 'imperial' },
          { label: 'Metric (m/min / mm)', value: 'metric' },
        ],
        required: true,
      },
      {
        id: 'numFlutes',
        label: 'Number of Flutes',
        type: 'number',
        defaultValue: 4,
        min: 1,
        max: 8,
        step: 1,
        helpText: 'Number of cutting flutes on the end mill or drill.',
        required: true,
      },
      {
        id: 'feedPerTooth',
        label: 'Feed per Tooth (Chip Load)',
        type: 'number',
        defaultValue: 0.003,
        min: 0.0001,
        step: 0.0005,
        helpText:
          'Chip load (feed per tooth) in inches (Imperial) or mm (Metric). Consult tooling manufacturer charts.',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'rpm',
        expression:
          "units == 'imperial' ? (cuttingSpeed * 12) / (3.14159 * toolDiameter) : (cuttingSpeed * 1000) / (3.14159 * toolDiameter)",
        dependencies: ['cuttingSpeed', 'toolDiameter', 'units'],
      },
      {
        id: 'feedRate',
        expression:
          "units == 'imperial' ? ((cuttingSpeed * 12) / (3.14159 * toolDiameter)) * numFlutes * feedPerTooth : ((cuttingSpeed * 1000) / (3.14159 * toolDiameter)) * numFlutes * feedPerTooth",
        dependencies: ['cuttingSpeed', 'toolDiameter', 'units', 'numFlutes', 'feedPerTooth'],
      },
    ],
    outputs: [
      {
        id: 'rpm',
        label: 'Spindle Speed',
        formulaRef: 'rpm',
        format: 'number',
        precision: 0,
        highlight: true,
        suffix: ' RPM',
      },
      {
        id: 'feedRate',
        label: 'Feed Rate',
        formulaRef: 'feedRate',
        format: 'number',
        precision: 3,
        suffix: ' IPM or mm/min',
      },
    ],
    guide: {
      whatIsIt:
        'Speeds and feeds are the two fundamental parameters of any machining operation. Cutting speed (SFM or m/min) describes how fast the tool\'s cutting edge moves through the material. Spindle RPM converts cutting speed to rotational speed for a given tool diameter. Feed rate then converts RPM Ã— chip load Ã— flutes into the table travel speed.',
      howToUse:
        'Select your unit system, then enter the recommended cutting speed for your material/tool combination (from the tooling manufacturer\'s chart or a reference table), the tool diameter, number of flutes, and chip load. The calculator returns the spindle RPM and feed rate.',
      exampleScenario:
        'Milling 6061 aluminium with a 1/2" (0.5") 4-flute carbide end mill. Recommended cutting speed = 600 SFM, chip load = 0.003". RPM = (600 Ã— 12) / (Ï€ Ã— 0.5) â‰ˆ 4,584 RPM. Feed Rate = 4,584 Ã— 4 Ã— 0.003 â‰ˆ 55.0 IPM.',
      proTip:
        'Chip load is the most critical parameter for tool life. Too light a chip load causes rubbing and heat build-up; too heavy causes chipping. Reduce speeds/feeds by 20â€“30% when machining stainless steel or titanium. Runout from worn collets dramatically reduces effective chip load â€” inspect toolholding regularly.',
    },
    metadata: { version: '1.0.0' },
  },

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // 2. Cutting Speed Calculator
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'cutting-speed',
    slug: 'cutting-speed',
    title: 'Cutting Speed Calculator',
    description:
      'Calculate the surface cutting speed (m/min or SFM) from spindle RPM and tool diameter for turning, milling, and drilling operations.',
    icon: '🔧',
    category: 'engineering',
    subcategory: 'manufacturing',
    tags: ['cutting speed', 'SFM', 'surface speed', 'RPM', 'machining', 'turning', 'milling'],
    inputs: [
      {
        id: 'rpm',
        label: 'Spindle Speed',
        type: 'number',
        defaultValue: 1000,
        min: 1,
        step: 50,
        helpText: 'Spindle rotational speed in RPM.',
        required: true,
        units: [{ label: 'RPM', value: 'rpm' }],
      },
      {
        id: 'toolDiameter',
        label: 'Tool / Workpiece Diameter',
        type: 'number',
        defaultValue: 25,
        min: 0.1,
        step: 0.5,
        helpText:
          'Tool diameter in mm (Metric) or inches (Imperial). For turning, enter workpiece diameter.',
        required: true,
      },
      {
        id: 'units',
        label: 'Unit System',
        type: 'select',
        defaultValue: 'metric',
        options: [
          { label: 'Metric (mm â†’ m/min)', value: 'metric' },
          { label: 'Imperial (inches â†’ SFM)', value: 'imperial' },
        ],
        required: true,
      },
    ],
    formulas: [
      {
        id: 'vc',
        expression:
          "units == 'metric' ? (3.14159 * toolDiameter * rpm) / 1000 : (3.14159 * toolDiameter * rpm) / 12",
        dependencies: ['toolDiameter', 'rpm', 'units'],
      },
    ],
    outputs: [
      {
        id: 'vc',
        label: 'Surface Cutting Speed',
        formulaRef: 'vc',
        format: 'number',
        precision: 1,
        highlight: true,
        suffix: ' m/min or SFM',
      },
    ],
    guide: {
      whatIsIt:
        'Surface cutting speed (Vc) is the relative velocity between the cutting edge and the workpiece surface. It is independent of tool diameter â€” two tools of different diameters must run at different RPMs to achieve the same cutting speed. Correct cutting speed ensures optimal tool life, surface finish, and chip formation.',
      howToUse:
        'Select your unit system, enter the spindle RPM and the tool (or workpiece) diameter. For Metric, enter diameter in mm and get m/min. For Imperial, enter inches and get Surface Feet per Minute (SFM). Compare the result against the recommended cutting speed range for your material.',
      exampleScenario:
        'A lathe runs at 1,000 RPM turning a 50 mm diameter steel bar. Vc = (Ï€ Ã— 50 Ã— 1000) / 1000 = 157 m/min. For carbon steel, recommended Vc with carbide is typically 100â€“250 m/min â€” this is well within the acceptable range.',
      proTip:
        'HSS tooling typically runs at 20â€“40% of the cutting speeds recommended for carbide. As tool diameter decreases (e.g. small drills), RPM must increase significantly to maintain the same cutting speed. Many CNC controls can apply constant surface speed (CSS) automatically to compensate during turning operations.',
    },
    metadata: { version: '1.0.0' },
  },

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // 3. Tap Drill Size Calculator
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'tap-drill-size',
    slug: 'tap-drill-size',
    title: 'Tap Drill Size Calculator',
    description:
      'Calculate the correct tap drill diameter for Unified (UNC/UNF) threads at any desired thread engagement percentage.',
    icon: '🔩',
    category: 'engineering',
    subcategory: 'manufacturing',
    tags: ['tap drill', 'thread', 'TPI', 'UNC', 'UNF', 'thread engagement', 'hole size', 'machining'],
    inputs: [
      {
        id: 'threadDiameter',
        label: 'Thread Major Diameter',
        type: 'number',
        defaultValue: 0.25,
        min: 0.05,
        step: 0.0625,
        helpText:
          'Thread major (outer) diameter in inches. E.g. 1/4-20 = 0.25".',
        required: true,
        units: [{ label: 'in', value: 'in' }],
      },
      {
        id: 'threadPitch',
        label: 'Threads per Inch (TPI)',
        type: 'number',
        defaultValue: 20,
        min: 2,
        max: 80,
        step: 1,
        helpText:
          'Number of threads per inch. E.g. 1/4-20 has 20 TPI. 1/4-28 (UNF) has 28 TPI.',
        required: true,
        units: [{ label: 'TPI', value: 'tpi' }],
      },
      {
        id: 'threadEngagement',
        label: 'Thread Engagement',
        type: 'number',
        defaultValue: 75,
        min: 50,
        max: 100,
        step: 5,
        helpText:
          'Desired thread engagement percentage. 75% is standard for steel; 50â€“65% for brittle or soft materials.',
        required: true,
        units: [{ label: '%', value: 'pct' }],
      },
    ],
    formulas: [
      {
        id: 'drillSize',
        expression:
          'threadDiameter - (threadEngagement / 100) * (1.2990 / threadPitch)',
        dependencies: ['threadDiameter', 'threadPitch', 'threadEngagement'],
      },
      {
        id: 'drillSizeMM',
        expression:
          '(threadDiameter - (threadEngagement / 100) * (1.2990 / threadPitch)) * 25.4',
        dependencies: ['threadDiameter', 'threadPitch', 'threadEngagement'],
      },
    ],
    outputs: [
      {
        id: 'drillSize',
        label: 'Tap Drill Size',
        formulaRef: 'drillSize',
        format: 'number',
        precision: 4,
        highlight: true,
        suffix: '"',
      },
      {
        id: 'drillSizeMM',
        label: 'Tap Drill Size (mm)',
        formulaRef: 'drillSizeMM',
        format: 'number',
        precision: 2,
        suffix: ' mm',
      },
    ],
    guide: {
      whatIsIt:
        'The tap drill size is the hole diameter drilled before tapping threads. It must be large enough to allow tapping without breaking the tap, yet small enough to provide adequate thread engagement for the required pull-out strength. The standard 75% engagement balances tool life against thread strength.',
      howToUse:
        'Enter the thread major diameter in inches (e.g. 0.25 for 1/4"), the TPI (e.g. 20 for 1/4-20 UNC), and the desired thread engagement percentage. The calculator outputs the recommended tap drill size in both inches and millimetres. Select the nearest standard drill size from a drill index.',
      exampleScenario:
        '1/4-20 UNC thread at 75% engagement: Drill = 0.25 âˆ’ 0.75 Ã— (1.299/20) = 0.25 âˆ’ 0.04871 = 0.2013" â‰ˆ #7 drill (0.201"). The standard #7 drill at 0.201" is the textbook tap drill for 1/4-20.',
      proTip:
        'Reduce thread engagement to 50â€“65% when tapping brittle materials (cast iron, brass) or when breaking taps is a concern. A lower engagement drill is easier to tap, breaks fewer taps, and still provides adequate strength â€” threaded fasteners almost always fail in the shank before a properly engaged thread strips.',
    },
    metadata: { version: '1.0.0' },
  },

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // 4. Metal Weight Calculator
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'metal-weight',
    slug: 'metal-weight',
    title: 'Metal Weight Calculator',
    description:
      'Calculate the weight of a rectangular metal plate or bar from its dimensions and material density.',
    icon: '⚖️',
    category: 'engineering',
    subcategory: 'manufacturing',
    tags: ['metal weight', 'steel', 'aluminum', 'density', 'plate', 'bar stock', 'material weight'],
    inputs: [
      {
        id: 'length',
        label: 'Length',
        type: 'number',
        defaultValue: 1000,
        min: 0.1,
        step: 1,
        required: true,
        units: [{ label: 'mm', value: 'mm' }],
      },
      {
        id: 'width',
        label: 'Width',
        type: 'number',
        defaultValue: 100,
        min: 0.1,
        step: 1,
        required: true,
        units: [{ label: 'mm', value: 'mm' }],
      },
      {
        id: 'thickness',
        label: 'Thickness',
        type: 'number',
        defaultValue: 10,
        min: 0.1,
        step: 0.5,
        required: true,
        units: [{ label: 'mm', value: 'mm' }],
      },
      {
        id: 'density',
        label: 'Material',
        type: 'select',
        defaultValue: '7.85',
        helpText: 'Select material or enter a custom density below.',
        options: [
          { label: 'Mild Steel (7.85 g/cmÂ³)', value: '7.85' },
          { label: 'Stainless Steel 304 (8.00 g/cmÂ³)', value: '8.00' },
          { label: 'Aluminum 6061 (2.70 g/cmÂ³)', value: '2.70' },
          { label: 'Copper (8.96 g/cmÂ³)', value: '8.96' },
          { label: 'Brass (8.50 g/cmÂ³)', value: '8.50' },
          { label: 'Titanium (4.51 g/cmÂ³)', value: '4.51' },
          { label: 'Cast Iron (7.20 g/cmÂ³)', value: '7.20' },
        ],
        required: true,
      },
    ],
    formulas: [
      {
        id: 'volumeCm3',
        expression: '(length * width * thickness) / 1000',
        dependencies: ['length', 'width', 'thickness'],
      },
      {
        id: 'weightKg',
        expression: '(length * width * thickness) / 1000 * density / 1000',
        dependencies: ['length', 'width', 'thickness', 'density'],
      },
      {
        id: 'weightLbs',
        expression: '(length * width * thickness) / 1000 * density / 1000 * 2.20462',
        dependencies: ['length', 'width', 'thickness', 'density'],
      },
    ],
    outputs: [
      {
        id: 'weightKg',
        label: 'Weight',
        formulaRef: 'weightKg',
        format: 'number',
        precision: 3,
        highlight: true,
        suffix: ' kg',
      },
      {
        id: 'weightLbs',
        label: 'Weight (Imperial)',
        formulaRef: 'weightLbs',
        format: 'number',
        precision: 3,
        suffix: ' lbs',
      },
      {
        id: 'volumeCm3',
        label: 'Volume',
        formulaRef: 'volumeCm3',
        format: 'number',
        precision: 2,
        suffix: ' cmÂ³',
      },
    ],
    guide: {
      whatIsIt:
        'Metal weight is calculated from the volume of the piece multiplied by the material\'s density. For rectangular sections (plates, flat bars, square bar), this is a simple length Ã— width Ã— thickness calculation. Knowing the weight is essential for structural design, freight quoting, and material ordering.',
      howToUse:
        'Enter the length, width, and thickness of your rectangular metal piece in millimetres, then select the material. The calculator converts the volume from mmÂ³ to cmÂ³ and multiplies by the material density (g/cmÂ³) to give weight in kilograms and pounds.',
      exampleScenario:
        'A 1000 mm Ã— 100 mm Ã— 10 mm mild steel flat bar: Volume = 1,000,000 mmÂ³ = 1,000 cmÂ³. Weight = 1,000 Ã— 7.85 / 1000 = 7.85 kg (17.3 lbs). Useful when calculating loads on shelving or checking freight weight limits.',
      proTip:
        'Aluminium is approximately 1/3 the weight of steel for the same volume â€” a major factor in lightweight design. Stainless steel is slightly heavier than mild steel but is often used in thinner gauges. For non-rectangular cross-sections (rounds, tubes, angles), calculate volume separately and multiply by density.',
    },
    metadata: { version: '1.0.0' },
  },

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // 5. Sheet Metal Bending Allowance Calculator
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'sheet-metal-bending',
    slug: 'sheet-metal-bending',
    title: 'Sheet Metal Bending Allowance Calculator',
    description:
      'Calculate bend allowance, bend deduction, and neutral radius for sheet metal bending operations using the K-Factor method.',
    icon: '📐',
    category: 'engineering',
    subcategory: 'manufacturing',
    tags: ['sheet metal', 'bend allowance', 'bend deduction', 'K-factor', 'neutral axis', 'fabrication'],
    inputs: [
      {
        id: 'bendAngle',
        label: 'Bend Angle',
        type: 'number',
        defaultValue: 90,
        min: 1,
        max: 180,
        step: 1,
        required: true,
        units: [{ label: 'Â°', value: 'deg' }],
        helpText: 'The included (interior) bend angle in degrees. 90Â° = right angle bend.',
      },
      {
        id: 'thickness',
        label: 'Material Thickness',
        type: 'number',
        defaultValue: 2,
        min: 0.1,
        step: 0.1,
        required: true,
        units: [{ label: 'mm', value: 'mm' }],
      },
      {
        id: 'innerRadius',
        label: 'Inside Bend Radius',
        type: 'number',
        defaultValue: 2,
        min: 0,
        step: 0.1,
        required: true,
        units: [{ label: 'mm', value: 'mm' }],
        helpText: 'The inside radius of the bend. A good rule of thumb: use 1Ã— material thickness.',
      },
      {
        id: 'kFactor',
        label: 'K-Factor',
        type: 'number',
        defaultValue: 0.33,
        min: 0.25,
        max: 0.5,
        step: 0.01,
        helpText:
          'K-Factor defines the neutral axis position. 0.33 for soft materials, 0.42 for average steel, 0.50 for hard materials.',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'bendAngleRad',
        expression: 'bendAngle * (3.14159 / 180)',
        dependencies: ['bendAngle'],
      },
      {
        id: 'neutralRadius',
        expression: 'innerRadius + kFactor * thickness',
        dependencies: ['innerRadius', 'kFactor', 'thickness'],
      },
      {
        id: 'bendAllowance',
        expression:
          'bendAngle * (3.14159 / 180) * (innerRadius + kFactor * thickness)',
        dependencies: ['bendAngle', 'innerRadius', 'kFactor', 'thickness'],
      },
      {
        id: 'bendDeduction',
        expression:
          '2 * (innerRadius + thickness) * tan(bendAngle * (3.14159 / 360)) - bendAngle * (3.14159 / 180) * (innerRadius + kFactor * thickness)',
        dependencies: ['bendAngle', 'innerRadius', 'kFactor', 'thickness'],
      },
    ],
    outputs: [
      {
        id: 'bendAllowance',
        label: 'Bend Allowance (BA)',
        formulaRef: 'bendAllowance',
        format: 'number',
        precision: 3,
        highlight: true,
        suffix: ' mm',
      },
      {
        id: 'bendDeduction',
        label: 'Bend Deduction (BD)',
        formulaRef: 'bendDeduction',
        format: 'number',
        precision: 3,
        suffix: ' mm',
      },
      {
        id: 'neutralRadius',
        label: 'Neutral Radius',
        formulaRef: 'neutralRadius',
        format: 'number',
        precision: 3,
        suffix: ' mm',
      },
    ],
    guide: {
      whatIsIt:
        'When sheet metal is bent, the inner surface compresses and the outer surface stretches. The neutral axis is the layer that neither compresses nor stretches. Bend allowance (BA) is the arc length of material consumed by the bend along the neutral axis. Bend deduction (BD) is the shortening applied to the flat blank length to account for the bend.',
      howToUse:
        'Enter the bend angle (interior/included angle), material thickness, inside bend radius, and K-Factor. Use the Bend Allowance to calculate flat pattern length: Flat Length = Leg 1 + Leg 2 + Bend Allowance. Use Bend Deduction: Flat Length = Leg 1 + Leg 2 âˆ’ Bend Deduction (where legs are measured to the outside mold lines).',
      exampleScenario:
        'Bending 2 mm mild steel at 90Â° with a 2 mm inside radius and K-Factor 0.33. Neutral Radius = 2 + 0.33 Ã— 2 = 2.66 mm. Bend Allowance = (Ï€/2) Ã— 2.66 = 4.18 mm. For a part with two 50 mm legs, flat blank = 50 + 50 + 4.18 = 104.18 mm.',
      proTip:
        'K-Factor varies with material, tooling, and bend radius-to-thickness ratio. Tight bends (IR < 1Ã— t) require a lower K-Factor (0.28â€“0.33); air bending large radii can reach 0.42â€“0.45. Always validate your K-Factor against a test bend on the actual material and press brake tooling before cutting production blanks.',
    },
    metadata: { version: '1.0.0' },
  },

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // 6. Welding Heat Input Calculator
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'welding-heat-input',
    slug: 'welding-heat-input',
    title: 'Welding Heat Input Calculator',
    description:
      'Calculate welding heat input (kJ/mm) from voltage, current, and travel speed, corrected for process thermal efficiency.',
    icon: '🔥',
    category: 'engineering',
    subcategory: 'manufacturing',
    tags: ['welding', 'heat input', 'kJ/mm', 'SMAW', 'GMAW', 'GTAW', 'SAW', 'HAZ', 'weld procedure'],
    inputs: [
      {
        id: 'voltage',
        label: 'Arc Voltage',
        type: 'number',
        defaultValue: 24,
        min: 1,
        step: 0.5,
        required: true,
        units: [{ label: 'V', value: 'v' }],
        helpText: 'Measured arc voltage during welding.',
      },
      {
        id: 'current',
        label: 'Welding Current',
        type: 'number',
        defaultValue: 200,
        min: 1,
        step: 5,
        required: true,
        units: [{ label: 'A', value: 'a' }],
        helpText: 'Welding current (amperage) during the pass.',
      },
      {
        id: 'travelSpeed',
        label: 'Travel Speed',
        type: 'number',
        defaultValue: 400,
        min: 1,
        step: 10,
        required: true,
        units: [{ label: 'mm/min', value: 'mmpm' }],
        helpText: 'Speed at which the weld torch travels along the joint.',
      },
      {
        id: 'thermalEfficiency',
        label: 'Welding Process',
        type: 'select',
        defaultValue: '0.85',
        helpText:
          'Select welding process â€” determines thermal efficiency factor applied to heat input.',
        options: [
          { label: 'SMAW â€“ Stick (Î· = 0.80)', value: '0.80' },
          { label: 'GMAW / FCAW â€“ MIG/Flux Core (Î· = 0.85)', value: '0.85' },
          { label: 'GTAW â€“ TIG (Î· = 0.60)', value: '0.60' },
          { label: 'SAW â€“ Submerged Arc (Î· = 1.00)', value: '1.00' },
        ],
        required: true,
      },
    ],
    formulas: [
      {
        id: 'heatInput_J_mm',
        expression: '(voltage * current * 60) / travelSpeed',
        dependencies: ['voltage', 'current', 'travelSpeed'],
      },
      {
        id: 'heatInput_kJ_mm',
        expression: '(voltage * current * 60) / travelSpeed / 1000',
        dependencies: ['voltage', 'current', 'travelSpeed'],
      },
      {
        id: 'heatInput_eff',
        expression:
          '(voltage * current * 60) / travelSpeed / 1000 * thermalEfficiency',
        dependencies: ['voltage', 'current', 'travelSpeed', 'thermalEfficiency'],
      },
    ],
    outputs: [
      {
        id: 'heatInput_eff',
        label: 'Net Heat Input (with efficiency)',
        formulaRef: 'heatInput_eff',
        format: 'number',
        precision: 3,
        highlight: true,
        suffix: ' kJ/mm',
      },
      {
        id: 'heatInput_kJ_mm',
        label: 'Gross Heat Input (no efficiency)',
        formulaRef: 'heatInput_kJ_mm',
        format: 'number',
        precision: 3,
        suffix: ' kJ/mm',
      },
    ],
    guide: {
      whatIsIt:
        'Welding heat input quantifies the energy delivered per unit length of weld. It is a critical parameter in weld procedure specifications (WPS) because it controls the size and cooling rate of the heat-affected zone (HAZ). High heat input causes grain growth, distortion, and loss of toughness in the HAZ; too low causes lack of fusion and rapid quench hardening in hardenable steels.',
      howToUse:
        'Enter the arc voltage, welding current, and travel speed from your welding parameters. Select the welding process to apply the appropriate thermal efficiency factor (fraction of electrical energy that enters the weld). The net heat input reflects actual energy delivered to the weld.',
      exampleScenario:
        'GMAW at 24 V, 200 A, 400 mm/min. Gross HI = (24 Ã— 200 Ã— 60) / 400 / 1000 = 0.72 kJ/mm. Net HI = 0.72 Ã— 0.85 = 0.61 kJ/mm. Most structural codes limit heat input to 3.5â€“5 kJ/mm for high-strength steels to prevent HAZ softening.',
      proTip:
        'Preheat requirements increase with heat input and carbon equivalent of the base metal. Higher heat input on quenched and tempered (QT) steels can wipe out the tempering â€” observe the maximum interpass temperature. SAW has Î· = 1.00 because submerged arc flux captures nearly all arc energy into the joint.',
    },
    metadata: { version: '1.0.0' },
  },

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // 7. O-Ring Groove Design Calculator
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'oring-groove',
    slug: 'oring-groove',
    title: 'O-Ring Groove Design Calculator',
    description:
      'Calculate groove depth, groove width, and gland fill percentage for O-ring seal design based on cross-section diameter and desired compression.',
    icon: '🔮',
    category: 'engineering',
    subcategory: 'manufacturing',
    tags: ['O-ring', 'groove design', 'seal', 'gland fill', 'compression', 'hydraulic seal', 'pneumatic'],
    inputs: [
      {
        id: 'oringID',
        label: 'O-Ring Inner Diameter',
        type: 'number',
        defaultValue: 50,
        min: 1,
        step: 0.5,
        required: true,
        units: [{ label: 'mm', value: 'mm' }],
        helpText: 'O-ring inner diameter in mm.',
      },
      {
        id: 'oringCS',
        label: 'O-Ring Cross-Section Diameter',
        type: 'number',
        defaultValue: 3.53,
        min: 0.5,
        step: 0.01,
        required: true,
        units: [{ label: 'mm', value: 'mm' }],
        helpText:
          'O-ring cross-section (cord) diameter in mm. E.g. AS568 -214 = 3.53 mm; -210 = 2.62 mm.',
      },
      {
        id: 'compressionPct',
        label: 'Compression',
        type: 'number',
        defaultValue: 20,
        min: 10,
        max: 30,
        step: 1,
        required: true,
        units: [{ label: '%', value: 'pct' }],
        helpText:
          'Desired O-ring compression %. Static face seal: 15â€“25%. Static radial: 15â€“25%. Dynamic: 10â€“20%.',
      },
    ],
    formulas: [
      {
        id: 'grooveDepth',
        expression: 'oringCS * (1 - compressionPct / 100)',
        dependencies: ['oringCS', 'compressionPct'],
      },
      {
        id: 'grooveWidth',
        expression: 'oringCS * 1.5',
        dependencies: ['oringCS'],
      },
      {
        id: 'glandFill',
        expression:
          '(3.14159 * pow(oringCS, 2) / 4) / (oringCS * 1.5 * oringCS * (1 - compressionPct / 100)) * 100',
        dependencies: ['oringCS', 'compressionPct'],
      },
    ],
    outputs: [
      {
        id: 'grooveDepth',
        label: 'Groove Depth',
        formulaRef: 'grooveDepth',
        format: 'number',
        precision: 3,
        highlight: true,
        suffix: ' mm',
      },
      {
        id: 'grooveWidth',
        label: 'Groove Width',
        formulaRef: 'grooveWidth',
        format: 'number',
        precision: 3,
        suffix: ' mm',
      },
      {
        id: 'glandFill',
        label: 'Gland Fill',
        formulaRef: 'glandFill',
        format: 'number',
        precision: 1,
        suffix: '% (target: 60â€“85%)',
      },
    ],
    guide: {
      whatIsIt:
        'O-ring groove (gland) design determines how much the O-ring is compressed and how much space remains in the gland for O-ring volume expansion from pressure, temperature, and fluid swell. Too much compression causes premature wear; too little causes leakage. Gland fill (% of groove volume occupied by the O-ring) must stay in the 60â€“85% range to allow for thermal/pressure expansion.',
      howToUse:
        'Enter the O-ring inner diameter, cross-section diameter (from the part number or datasheet), and your desired compression percentage. The calculator outputs groove depth (controls compression), groove width (typically 1.5Ã— CS), and the gland fill percentage.',
      exampleScenario:
        'AS568 -214 O-ring (CS = 3.53 mm, ID = 50 mm) at 20% compression. Groove depth = 3.53 Ã— (1 âˆ’ 0.20) = 2.824 mm. Groove width = 3.53 Ã— 1.5 = 5.295 mm. Gland fill = (Ï€ Ã— 3.53Â² / 4) / (5.295 Ã— 2.824) Ã— 100 â‰ˆ 65.4% â€” within the acceptable 60â€“85% range.',
      proTip:
        'For dynamic applications (pistons, rods), use lower compression (10â€“15%) to reduce friction and heat. Static face seals can use up to 25% compression. Lubricate O-rings during assembly with a compatible grease to prevent installation damage. Surface finish in the groove should be Ra 0.8â€“1.6 Î¼m for dynamic applications.',
    },
    metadata: { version: '1.0.0' },
  },

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // 8. Thread Pitch Diameter Calculator
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'thread-pitch-diameter',
    slug: 'thread-pitch-diameter',
    title: 'Thread Pitch Diameter Calculator',
    description:
      'Calculate the pitch diameter and minor diameter for Unified (UN) and ACME threads from major diameter and TPI.',
    icon: '📏',
    category: 'engineering',
    subcategory: 'manufacturing',
    tags: ['thread', 'pitch diameter', 'minor diameter', 'UNC', 'UNF', 'ACME', 'thread gauging', 'TPI'],
    inputs: [
      {
        id: 'majorDiameter',
        label: 'Major Diameter',
        type: 'number',
        defaultValue: 0.5,
        min: 0.05,
        step: 0.0625,
        required: true,
        units: [{ label: 'in', value: 'in' }],
        helpText: 'Thread major (nominal outer) diameter in inches. E.g. 1/2" = 0.500".',
      },
      {
        id: 'tpi',
        label: 'Threads per Inch (TPI)',
        type: 'number',
        defaultValue: 13,
        min: 2,
        max: 80,
        step: 1,
        required: true,
        helpText:
          'Number of threads per inch. E.g. 1/2-13 UNC = 13 TPI; 1/2-20 UNF = 20 TPI.',
        units: [{ label: 'TPI', value: 'tpi' }],
      },
      {
        id: 'standard',
        label: 'Thread Standard',
        type: 'select',
        defaultValue: 'un',
        options: [
          { label: 'UN / UNC / UNF (60Â° thread form)', value: 'un' },
          { label: 'ACME (29Â° thread form)', value: 'acme' },
        ],
        required: true,
      },
    ],
    formulas: [
      {
        id: 'pitchDiameter',
        expression:
          "standard == 'acme' ? majorDiameter - 0.5 / tpi : majorDiameter - 0.6495 / tpi",
        dependencies: ['majorDiameter', 'tpi', 'standard'],
      },
      {
        id: 'pitchDiameterMM',
        expression:
          "(standard == 'acme' ? majorDiameter - 0.5 / tpi : majorDiameter - 0.6495 / tpi) * 25.4",
        dependencies: ['majorDiameter', 'tpi', 'standard'],
      },
      {
        id: 'minorDiameter',
        expression:
          "standard == 'acme' ? majorDiameter - 1.0 / tpi : majorDiameter - 1.2990 / tpi",
        dependencies: ['majorDiameter', 'tpi', 'standard'],
      },
    ],
    outputs: [
      {
        id: 'pitchDiameter',
        label: 'Pitch Diameter',
        formulaRef: 'pitchDiameter',
        format: 'number',
        precision: 4,
        highlight: true,
        suffix: '"',
      },
      {
        id: 'pitchDiameterMM',
        label: 'Pitch Diameter (mm)',
        formulaRef: 'pitchDiameterMM',
        format: 'number',
        precision: 3,
        suffix: ' mm',
      },
      {
        id: 'minorDiameter',
        label: 'Minor Diameter',
        formulaRef: 'minorDiameter',
        format: 'number',
        precision: 4,
        suffix: '"',
      },
    ],
    guide: {
      whatIsIt:
        'The pitch diameter is the theoretical diameter of an imaginary cylinder whose surface intersects the thread form where the thread width equals the space width. It is the most critical diameter for thread fit and function â€” class of fit tolerances (1A/1B through 3A/3B for UN threads) are applied to the pitch diameter. The minor diameter is the smallest diameter of the thread form (root diameter for external threads).',
      howToUse:
        'Enter the thread major diameter in inches, TPI, and select the thread standard. For UN/UNC/UNF threads, the pitch diameter formula subtracts 0.6495/TPI; for ACME threads, 0.5/TPI. Results are given in both inches and millimetres.',
      exampleScenario:
        '1/2-13 UNC thread: Major = 0.500", TPI = 13. Pitch Diameter = 0.500 âˆ’ 0.6495/13 = 0.500 âˆ’ 0.04996 = 0.4500". This matches the published value of 0.4500" for 1/2-13 UNC pitch diameter (nominal).',
      proTip:
        'Go/No-Go thread gauges measure pitch diameter acceptance. The Go gauge must enter freely; the No-Go gauge must not enter more than 2 turns. For precision threads, use a 3-wire method with a micrometer to measure pitch diameter directly â€” the wire size should equal 0.57735 Ã— pitch for best accuracy.',
    },
    metadata: { version: '1.0.0' },
  },

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // 9. Thermal Expansion Calculator
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'thermal-expansion',
    slug: 'thermal-expansion',
    title: 'Thermal Expansion Calculator',
    description:
      'Calculate linear thermal expansion of a material due to a temperature change, given its coefficient of thermal expansion.',
    icon: '🌡️',
    category: 'engineering',
    subcategory: 'manufacturing',
    tags: ['thermal expansion', 'thermal coefficient', 'engineering', 'steel', 'aluminum', 'pipe', 'bridge'],
    inputs: [
      {
        id: 'originalLength',
        label: 'Original Length',
        type: 'number',
        defaultValue: 1000,
        min: 0.1,
        step: 1,
        required: true,
        units: [{ label: 'mm', value: 'mm' }],
        helpText: 'Initial length of the component at reference temperature.',
      },
      {
        id: 'tempChange',
        label: 'Temperature Change (Î”T)',
        type: 'number',
        defaultValue: 50,
        step: 1,
        required: true,
        units: [{ label: 'Â°C', value: 'degc' }],
        helpText: 'Temperature change in Â°C. Positive = heating; negative = cooling.',
      },
      {
        id: 'material',
        label: 'Material',
        type: 'select',
        defaultValue: '11.7',
        helpText: 'Select material to use its standard thermal expansion coefficient (Î¼m/mÂ·Â°C).',
        options: [
          { label: 'Carbon Steel (11.7 Î¼m/mÂ·Â°C)', value: '11.7' },
          { label: 'Stainless Steel 304 (17.2 Î¼m/mÂ·Â°C)', value: '17.2' },
          { label: 'Aluminum (23.1 Î¼m/mÂ·Â°C)', value: '23.1' },
          { label: 'Copper (17.0 Î¼m/mÂ·Â°C)', value: '17.0' },
          { label: 'Brass (19.0 Î¼m/mÂ·Â°C)', value: '19.0' },
          { label: 'Glass (Borosilicate) (3.3 Î¼m/mÂ·Â°C)', value: '3.3' },
          { label: 'Concrete (12.0 Î¼m/mÂ·Â°C)', value: '12.0' },
          { label: 'Invar (1.2 Î¼m/mÂ·Â°C)', value: '1.2' },
        ],
        required: true,
      },
    ],
    formulas: [
      {
        id: 'deltaL',
        expression: 'originalLength * (material / 1000000) * tempChange',
        dependencies: ['originalLength', 'material', 'tempChange'],
      },
      {
        id: 'newLength',
        expression: 'originalLength + originalLength * (material / 1000000) * tempChange',
        dependencies: ['originalLength', 'material', 'tempChange'],
      },
      {
        id: 'deltaLPct',
        expression: '(originalLength * (material / 1000000) * tempChange) / originalLength * 100',
        dependencies: ['originalLength', 'material', 'tempChange'],
      },
    ],
    outputs: [
      {
        id: 'deltaL',
        label: 'Length Change (Î”L)',
        formulaRef: 'deltaL',
        format: 'number',
        precision: 4,
        highlight: true,
        suffix: ' mm',
      },
      {
        id: 'newLength',
        label: 'New Length',
        formulaRef: 'newLength',
        format: 'number',
        precision: 4,
        suffix: ' mm',
      },
      {
        id: 'deltaLPct',
        label: 'Length Change %',
        formulaRef: 'deltaLPct',
        format: 'number',
        precision: 4,
        suffix: '%',
      },
    ],
    guide: {
      whatIsIt:
        'Linear thermal expansion describes how a solid material changes in length with temperature. The formula Î”L = Lâ‚€ Ã— Î± Ã— Î”T relates the original length, thermal expansion coefficient (Î±), and temperature change to the resulting dimensional change. This is critical in mechanical design, structural engineering, and precision manufacturing.',
      howToUse:
        'Enter the original length of the component in mm, the expected temperature change in Â°C (negative for cooling), and select the material. The calculator uses the standard linear thermal expansion coefficient (in Î¼m/mÂ·Â°C = 10â»â¶ m/mÂ·Â°C) for that material.',
      exampleScenario:
        'A 1000 mm carbon steel shaft heats up by 50Â°C during operation. Î”L = 1000 Ã— (11.7 Ã— 10â»â¶) Ã— 50 = 0.585 mm. This expansion must be accommodated by tolerances or expansion joints; ignoring it in a constrained assembly would generate significant compressive stress.',
      proTip:
        'Invar (Ni-Fe alloy) has an extremely low Î± of ~1.2 Î¼m/mÂ·Â°C â€” ideal for precision instruments, laser optics mounts, and metrology equipment. Concrete and steel have nearly identical coefficients (~11â€“12 Î¼m/mÂ·Â°C), which is why steel-reinforced concrete is so effective â€” the two materials expand and contract together under temperature cycling.',
    },
    metadata: { version: '1.0.0' },
  },

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // 10. Gear Ratio Calculator
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'gear-ratio',
    slug: 'gear-ratio',
    title: 'Gear Ratio Calculator',
    description:
      'Calculate gear ratio, output shaft speed, and torque multiplication factor from driver and driven gear tooth counts and input RPM.',
    icon: '⚙️',
    category: 'engineering',
    subcategory: 'manufacturing',
    tags: ['gear ratio', 'gearbox', 'torque', 'RPM', 'speed reduction', 'mechanical advantage', 'drivetrain'],
    inputs: [
      {
        id: 'driverTeeth',
        label: 'Driver (Input) Gear Teeth',
        type: 'number',
        defaultValue: 20,
        min: 4,
        max: 500,
        step: 1,
        required: true,
        helpText: 'Number of teeth on the driving (input) gear.',
        units: [{ label: 'teeth', value: 'teeth' }],
      },
      {
        id: 'drivenTeeth',
        label: 'Driven (Output) Gear Teeth',
        type: 'number',
        defaultValue: 40,
        min: 4,
        max: 500,
        step: 1,
        required: true,
        helpText: 'Number of teeth on the driven (output) gear.',
        units: [{ label: 'teeth', value: 'teeth' }],
      },
      {
        id: 'inputRPM',
        label: 'Input Shaft Speed',
        type: 'number',
        defaultValue: 1000,
        min: 1,
        step: 10,
        required: true,
        helpText: 'Rotational speed of the input (driver) shaft in RPM.',
        units: [{ label: 'RPM', value: 'rpm' }],
      },
    ],
    formulas: [
      {
        id: 'gearRatio',
        expression: 'drivenTeeth / driverTeeth',
        dependencies: ['drivenTeeth', 'driverTeeth'],
      },
      {
        id: 'outputRPM',
        expression: 'inputRPM / (drivenTeeth / driverTeeth)',
        dependencies: ['inputRPM', 'drivenTeeth', 'driverTeeth'],
      },
      {
        id: 'torqueMultiplier',
        expression: 'drivenTeeth / driverTeeth',
        dependencies: ['drivenTeeth', 'driverTeeth'],
      },
      {
        id: 'speedReduction',
        expression: '(1 - driverTeeth / drivenTeeth) * 100',
        dependencies: ['driverTeeth', 'drivenTeeth'],
      },
    ],
    outputs: [
      {
        id: 'gearRatio',
        label: 'Gear Ratio',
        formulaRef: 'gearRatio',
        format: 'number',
        precision: 3,
        highlight: true,
        suffix: ':1',
      },
      {
        id: 'outputRPM',
        label: 'Output Shaft Speed',
        formulaRef: 'outputRPM',
        format: 'number',
        precision: 1,
        suffix: ' RPM',
      },
      {
        id: 'torqueMultiplier',
        label: 'Torque Multiplication',
        formulaRef: 'torqueMultiplier',
        format: 'number',
        precision: 3,
        suffix: 'x torque increase',
      },
      {
        id: 'speedReduction',
        label: 'Speed Reduction',
        formulaRef: 'speedReduction',
        format: 'number',
        precision: 1,
        suffix: '%',
      },
    ],
    guide: {
      whatIsIt:
        'A gear ratio describes the relationship between the number of teeth on two meshing gears. When the driven gear has more teeth than the driver, the output shaft turns slower (speed reduction) but with proportionally more torque. When the driven has fewer teeth, the output turns faster (overdrive) with less torque. Gear ratios are fundamental to transmissions, gearboxes, and all mechanical power transmission systems.',
      howToUse:
        'Enter the tooth count for the driving (input) gear and the driven (output) gear, plus the input shaft speed in RPM. The calculator computes the gear ratio, output RPM, and torque multiplication factor. For a gear train with multiple stages, multiply the individual stage ratios together.',
      exampleScenario:
        'A 20-tooth driver meshes with a 40-tooth driven gear. Gear ratio = 40/20 = 2:1 (2.000). Input 1,000 RPM â†’ Output 500 RPM. Torque is doubled. If the electric motor produces 10 NÂ·m at 1,000 RPM, the output shaft delivers 20 NÂ·m (before accounting for gear efficiency losses, typically 95â€“99% per stage).',
      proTip:
        'Compound gear trains multiply ratios. A two-stage gearbox with 3:1 on stage 1 and 4:1 on stage 2 gives 12:1 overall. For very high ratios, consider worm gears (up to 300:1 in a single stage) or planetary/epicyclic arrangements. Backlash (play between gear teeth) becomes critical for precision positioning applications â€” specify zero-backlash gears or preloaded gear pairs.',
    },
    metadata: { version: '1.0.0' },
  },
];
