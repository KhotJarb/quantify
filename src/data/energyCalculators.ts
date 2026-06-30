// ---------------------------------------------------------------------------
// Quantify — Energy Calculators
// ---------------------------------------------------------------------------
// 10 calculators covering solar payback, battery bank sizing, wind turbine
// power, inverter sizing, rainwater harvesting, LED savings, EV charging,
// home heat loss, water flow rate, and composting C:N ratio.
// ---------------------------------------------------------------------------

import type { CalculatorSchema } from '@/types/calculator';

export const energyCalculators: CalculatorSchema[] = [
  // =========================================================================
  // 1. Solar Panel Payback Period
  // =========================================================================
  {
    id: 'solar-payback',
    slug: 'solar-payback',
    title: 'Solar Panel Payback Period',
    description:
      'Calculate the payback period, annual savings, and 25-year ROI for a rooftop solar installation after tax credits.',
    icon: '☀️',
    category: 'energy',
    subcategory: 'solar',
    tags: ['solar', 'payback', 'ROI', 'photovoltaic', 'PV', 'energy savings', 'tax credit', 'ITC'],
    inputs: [
      {
        id: 'systemCostUsd',
        label: 'System Cost',
        type: 'number',
        defaultValue: 15000,
        helpText: 'USD before incentives',
      },
      {
        id: 'federalTaxCredit',
        label: 'Federal Tax Credit (ITC)',
        type: 'number',
        defaultValue: 30,
        helpText: 'US ITC: 30% through 2032 (percent)',
      },
      {
        id: 'stateSavings',
        label: 'State / Local Incentives',
        type: 'number',
        defaultValue: 0,
        helpText: 'USD — additional rebates or credits',
      },
      {
        id: 'systemSizeKw',
        label: 'System Size',
        type: 'number',
        defaultValue: 7,
        helpText: 'kW (DC nameplate)',
      },
      {
        id: 'peakSunHours',
        label: 'Peak Sun Hours',
        type: 'number',
        defaultValue: 5,
        step: 0.5,
        helpText: 'hours/day (use NREL PVWatts for your location)',
      },
      {
        id: 'electricityRate',
        label: 'Electricity Rate',
        type: 'number',
        defaultValue: 0.15,
        step: 0.01,
        helpText: 'USD/kWh',
      },
      {
        id: 'annualDegradation',
        label: 'Annual Panel Degradation',
        type: 'number',
        defaultValue: 0.5,
        helpText: 'percent per year (typical: 0.5%)',
      },
    ],
    formulas: [
      // Total incentives = federal ITC + state rebates
      {
        id: 'incentiveSavings',
        expression: 'systemCostUsd * federalTaxCredit / 100 + stateSavings',
        dependencies: ['systemCostUsd', 'federalTaxCredit', 'stateSavings'],
      },
      // Net cost after incentives
      {
        id: 'netCost',
        expression: 'systemCostUsd - incentiveSavings',
        dependencies: ['systemCostUsd', 'incentiveSavings'],
      },
      // Annual kWh generated = system size x sun hours x 365
      {
        id: 'annualKwh',
        expression: 'systemSizeKw * peakSunHours * 365',
        dependencies: ['systemSizeKw', 'peakSunHours'],
      },
      // Annual savings in dollars
      {
        id: 'annualSavings',
        expression: 'annualKwh * electricityRate',
        dependencies: ['annualKwh', 'electricityRate'],
      },
      // Payback period in years
      {
        id: 'paybackYears',
        expression: 'netCost / annualSavings',
        dependencies: ['netCost', 'annualSavings'],
      },
      // 25-year net savings (simplified, ignoring degradation in main formula for clarity)
      {
        id: 'lifetime25Savings',
        expression: 'annualSavings * 25 - netCost',
        dependencies: ['annualSavings', 'netCost'],
      },
      // 25-year ROI percentage
      {
        id: 'roi25Year',
        expression: '(lifetime25Savings / netCost) * 100',
        dependencies: ['lifetime25Savings', 'netCost'],
      },
    ],
    outputs: [
      {
        id: 'paybackYearsOut',
        label: 'Payback Period',
        formulaRef: 'paybackYears',
        precision: 1,
        suffix: ' years',
        highlight: true,
      },
      {
        id: 'annualSavingsOut',
        label: 'Annual Savings',
        formulaRef: 'annualSavings',
        format: 'currency',
        precision: 0,
      },
      {
        id: 'lifetime25SavingsOut',
        label: '25-Year Net Savings',
        formulaRef: 'lifetime25Savings',
        format: 'currency',
        precision: 0,
      },
      {
        id: 'roi25YearOut',
        label: '25-Year ROI',
        formulaRef: 'roi25Year',
        precision: 1,
        suffix: '%',
      },
    ],
    guide: {
      whatIsIt:
        'The solar payback period is the time it takes for your electricity savings to recover the net cost of your solar installation (after tax credits and rebates). After payback, the system generates essentially free electricity. Most residential solar systems pay back in 6-12 years and have a 25-year warranty life.',
      howToUse:
        '1. Enter the total installed system cost before incentives.\n2. Enter the federal ITC percentage (30% through 2032 for US homeowners).\n3. Add any state or local rebates in USD.\n4. Enter system size in kW and your location peak sun hours (find via NREL PVWatts).\n5. Enter your current electricity rate.\n6. Review payback period, annual savings, and long-term ROI.',
      exampleScenario:
        'A 7 kW system costs $15,000. With the 30% federal ITC: incentive = $4,500, net cost = $10,500. At 5 peak sun hours, annual generation = 7 x 5 x 365 = 12,775 kWh. At $0.15/kWh, annual savings = $1,916. Payback = $10,500 / $1,916 = 5.5 years. 25-year net savings = $1,916 x 25 - $10,500 = $37,400.',
      proTip:
        'Electricity rates have historically risen 2-3% annually. This calculator uses a flat rate, which understates long-term savings. Adding a battery (e.g., Tesla Powerwall at $10,000-$12,000) typically extends payback by 3-5 years but provides backup power and time-of-use arbitrage benefits. Always get multiple installer quotes — prices vary by 20-30%.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 2. Battery Bank Sizing Calculator
  // =========================================================================
  {
    id: 'battery-bank',
    slug: 'battery-bank',
    title: 'Battery Bank Sizing Calculator',
    description:
      'Size your off-grid or backup battery bank based on daily energy consumption, autonomy days, depth of discharge, and system voltage.',
    icon: '🔋',
    category: 'energy',
    subcategory: 'solar',
    tags: ['battery', 'off-grid', 'solar', 'kWh', 'amp-hour', 'LiFePO4', 'lead-acid', 'sizing'],
    inputs: [
      {
        id: 'dailyKwh',
        label: 'Daily Energy Consumption',
        type: 'number',
        defaultValue: 5,
        helpText: 'kWh per day',
      },
      {
        id: 'autonomyDays',
        label: 'Autonomy (Days of Storage)',
        type: 'number',
        defaultValue: 2,
        min: 0.5,
        helpText: 'Number of cloudy days to cover',
      },
      {
        id: 'depthOfDischarge',
        label: 'Depth of Discharge (DoD)',
        type: 'number',
        defaultValue: 80,
        helpText: 'percent — LiFePO4: 80-100%, Lead-acid: 50%',
      },
      {
        id: 'systemVoltage',
        label: 'System Voltage',
        type: 'select',
        options: [
          { label: '12V', value: '12' },
          { label: '24V', value: '24' },
          { label: '48V', value: '48' },
        ],
        defaultValue: '24',
      },
      {
        id: 'inverterEfficiency',
        label: 'Inverter Efficiency',
        type: 'number',
        defaultValue: 95,
        helpText: 'percent (typical: 90-97%)',
      },
    ],
    formulas: [
      // Required usable kWh = (daily load x days) / DoD / inverter efficiency
      {
        id: 'usableKwh',
        expression: '(dailyKwh * autonomyDays) / (depthOfDischarge / 100) / (inverterEfficiency / 100)',
        dependencies: ['dailyKwh', 'autonomyDays', 'depthOfDischarge', 'inverterEfficiency'],
      },
      // Required Amp-Hours = (kWh x 1000) / voltage
      {
        id: 'totalAh',
        expression: 'usableKwh * 1000 / systemVoltage',
        dependencies: ['usableKwh', 'systemVoltage'],
      },
    ],
    outputs: [
      {
        id: 'usableKwhOut',
        label: 'Battery Capacity Needed',
        formulaRef: 'usableKwh',
        precision: 2,
        suffix: ' kWh',
        highlight: true,
      },
      {
        id: 'totalAhOut',
        label: 'In Amp-Hours',
        formulaRef: 'totalAh',
        precision: 0,
        suffix: ' Ah',
      },
    ],
    guide: {
      whatIsIt:
        'Battery bank sizing determines how much battery storage capacity you need to power your loads for a specified number of days without solar input. The calculation accounts for depth of discharge (to protect battery longevity) and inverter efficiency losses. LiFePO4 batteries can be discharged to 80-100% DoD; lead-acid batteries should not exceed 50% DoD.',
      howToUse:
        '1. Enter your average daily energy consumption in kWh (check your electricity bill or add up appliance wattages x hours).\n2. Enter how many days of autonomy you want (1-3 days is typical for solar backup).\n3. Enter the depth of discharge appropriate for your battery chemistry.\n4. Select your system voltage (48V is most efficient for larger systems).\n5. Enter inverter efficiency (typically 90-97%).',
      exampleScenario:
        'Daily consumption: 5 kWh. 2 days autonomy. LiFePO4 batteries at 80% DoD. 24V system. 95% inverter efficiency. Required capacity = (5 x 2) / 0.80 / 0.95 = 13.2 kWh. In amp-hours at 24V: 13,200 / 24 = 550 Ah. You would need approximately 6 x 100 Ah batteries in a 24V configuration.',
      proTip:
        'Always oversize your battery bank by 20-25% to account for temperature derating (batteries lose capacity in cold weather) and ageing. LiFePO4 batteries are the best long-term investment: they last 2,000-6,000 cycles vs. 300-500 for lead-acid. At a 10-year horizon, LiFePO4 total cost per kWh is often lower despite higher upfront cost.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 3. Wind Turbine Power Output
  // =========================================================================
  {
    id: 'wind-turbine',
    slug: 'wind-turbine',
    title: 'Wind Turbine Power Output',
    description:
      'Calculate wind turbine power output in kW and estimated annual generation based on rotor diameter, wind speed, and power coefficient.',
    icon: '🌬️',
    category: 'energy',
    subcategory: 'power',
    tags: ['wind turbine', 'wind power', 'renewable energy', 'kW', 'Betz limit', 'rotor', 'wind speed'],
    inputs: [
      {
        id: 'rotorDiameterM',
        label: 'Rotor Diameter',
        type: 'number',
        defaultValue: 10,
        min: 0.5,
        helpText: 'meters',
      },
      {
        id: 'windSpeedMs',
        label: 'Wind Speed',
        type: 'number',
        defaultValue: 8,
        min: 0,
        helpText: 'm/s (typical sites: 5-10 m/s)',
      },
      {
        id: 'powerCoefficient',
        label: 'Power Coefficient (Cp)',
        type: 'number',
        defaultValue: 0.35,
        step: 0.01,
        min: 0.1,
        max: 0.593,
        helpText: 'Efficiency (modern turbines: 0.35-0.45)',
      },
      {
        id: 'airDensity',
        label: 'Air Density',
        type: 'number',
        defaultValue: 1.225,
        step: 0.001,
        helpText: 'kg/m3 (sea level = 1.225)',
      },
    ],
    formulas: [
      // Swept area = pi x r^2
      {
        id: 'sweptArea',
        expression: '3.14159265 * pow(rotorDiameterM / 2, 2)',
        dependencies: ['rotorDiameterM'],
      },
      // Power (W) = 0.5 x rho x A x Cp x v^3
      {
        id: 'powerWatts',
        expression: '0.5 * airDensity * sweptArea * powerCoefficient * pow(windSpeedMs, 3)',
        dependencies: ['airDensity', 'sweptArea', 'powerCoefficient', 'windSpeedMs'],
      },
      {
        id: 'powerKw',
        expression: 'powerWatts / 1000',
        dependencies: ['powerWatts'],
      },
      // Estimated annual generation assuming 35% capacity factor
      {
        id: 'annualKwh',
        expression: 'powerKw * 8760 * 0.35',
        dependencies: ['powerKw'],
      },
      // Theoretical max (Betz limit Cp = 0.593)
      {
        id: 'betzKw',
        expression: '0.5 * airDensity * sweptArea * 0.593 * pow(windSpeedMs, 3) / 1000',
        dependencies: ['airDensity', 'sweptArea', 'windSpeedMs'],
      },
    ],
    outputs: [
      {
        id: 'powerKwOut',
        label: 'Power Output',
        formulaRef: 'powerKw',
        precision: 3,
        suffix: ' kW',
        highlight: true,
      },
      {
        id: 'annualKwhOut',
        label: 'Est. Annual Generation',
        formulaRef: 'annualKwh',
        precision: 0,
        suffix: ' kWh/yr',
      },
      {
        id: 'betzKwOut',
        label: 'Theoretical Max (Betz)',
        formulaRef: 'betzKw',
        precision: 3,
        suffix: ' kW',
      },
    ],
    guide: {
      whatIsIt:
        'Wind turbine power output follows the equation P = 0.5 x rho x A x Cp x v^3, where rho is air density (kg/m3), A is the rotor swept area (m2), Cp is the power coefficient (efficiency), and v is wind speed (m/s). The Betz limit (Cp = 0.593) is the theoretical maximum efficiency — no turbine can extract more than 59.3% of the wind\'s kinetic energy.',
      howToUse:
        '1. Enter the rotor diameter in meters.\n2. Enter the design wind speed in m/s (use your site mean wind speed for annual estimates).\n3. Enter the power coefficient (Cp) — modern turbines achieve 0.35-0.45.\n4. Adjust air density for your altitude if needed (lower at altitude).\n5. Compare your Cp to the Betz limit to see how efficient your turbine is.',
      exampleScenario:
        'A small 10-meter diameter turbine with Cp = 0.35 at 8 m/s wind speed. Swept area = pi x 25 = 78.5 m2. Power = 0.5 x 1.225 x 78.5 x 0.35 x 512 = 8,640 W = 8.64 kW. At 35% capacity factor, annual generation = 8.64 x 8,760 x 0.35 = 26,500 kWh/yr.',
      proTip:
        'Wind power scales with the CUBE of wind speed — doubling wind speed increases power 8-fold. This means site selection is critical: a site with average 8 m/s wind generates 8x more power than a 4 m/s site for the same turbine. Even a 1 m/s improvement in wind speed (~12.5%) increases power by nearly 42% (1.125^3 = 1.42).',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 4. Inverter Size Calculator
  // =========================================================================
  {
    id: 'inverter-size',
    slug: 'inverter-size',
    title: 'Inverter Size Calculator',
    description:
      'Calculate the recommended inverter size for off-grid or backup power, accounting for continuous load, motor surge, and safety margins.',
    icon: '⚡',
    category: 'energy',
    subcategory: 'power',
    tags: ['inverter', 'off-grid', 'solar', 'surge', 'watts', 'power', 'sizing'],
    inputs: [
      {
        id: 'totalContinuousWatts',
        label: 'Total Continuous Load',
        type: 'number',
        defaultValue: 2000,
        helpText: 'Sum of all running appliance wattages (Watts)',
      },
      {
        id: 'largeSurgeWatts',
        label: 'Largest Motor Surge',
        type: 'number',
        defaultValue: 2000,
        helpText: 'Motor surge = 3-7x running watts (Watts)',
      },
      {
        id: 'safetyFactor',
        label: 'Safety Buffer',
        type: 'number',
        defaultValue: 25,
        helpText: 'percent overhead (25% recommended)',
      },
    ],
    formulas: [
      // Continuous capacity needed with safety buffer
      {
        id: 'continuousNeeded',
        expression: 'totalContinuousWatts * (1 + safetyFactor / 100)',
        dependencies: ['totalContinuousWatts', 'safetyFactor'],
      },
      // Peak capacity needed (continuous + surge)
      {
        id: 'peakNeeded',
        expression: 'totalContinuousWatts + largeSurgeWatts',
        dependencies: ['totalContinuousWatts', 'largeSurgeWatts'],
      },
      // Round up to nearest 500W standard inverter size
      {
        id: 'recommendedW',
        expression: 'ceil(continuousNeeded / 500) * 500',
        dependencies: ['continuousNeeded'],
      },
      {
        id: 'peakW',
        expression: 'ceil(peakNeeded / 500) * 500',
        dependencies: ['peakNeeded'],
      },
    ],
    outputs: [
      {
        id: 'recommendedWOut',
        label: 'Recommended Inverter (Continuous)',
        formulaRef: 'recommendedW',
        precision: 0,
        suffix: ' W',
        highlight: true,
      },
      {
        id: 'peakWOut',
        label: 'Peak Capacity Needed',
        formulaRef: 'peakW',
        precision: 0,
        suffix: ' W',
      },
      {
        id: 'continuousNeededOut',
        label: 'With Safety Buffer',
        formulaRef: 'continuousNeeded',
        precision: 0,
        suffix: ' W',
      },
    ],
    guide: {
      whatIsIt:
        'An inverter converts DC battery power to AC power for home appliances. Two ratings matter: continuous watt rating (constant load) and peak/surge watt rating (for motor start-up). Inductive loads like refrigerators, pumps, and air conditioners draw 3-7x their running wattage at startup — the inverter must handle this surge without shutting down.',
      howToUse:
        '1. Add up the running wattage of all appliances you plan to run simultaneously.\n2. Identify the single largest motor in your system (refrigerator, pump, HVAC) and multiply its running watts by 5-7 for the surge estimate.\n3. Enter your desired safety buffer percentage.\n4. The recommended inverter size is rounded up to the nearest standard 500W increment.',
      exampleScenario:
        'Running: refrigerator (150W), lights (100W), laptop (60W), fans (150W) = 460W continuous. Refrigerator surge = 150 x 5 = 750W. Recommended continuous with 25% buffer = 460 x 1.25 = 575W rounded to 1,000W. Peak needed = 460 + 750 = 1,210W rounded to 1,500W. Buy a 1,500W inverter with 3,000W surge rating.',
      proTip:
        'Always check both the continuous AND surge rating of an inverter. A cheap 2,000W inverter may only handle 2,000W surge for 2 seconds — insufficient for a compressor. Quality inverters list separate continuous and surge ratings. Size your inverter at 120-150% of your continuous load to improve efficiency — inverters are most efficient at 50-75% of their rated capacity.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 5. Rainwater Harvesting Volume
  // =========================================================================
  {
    id: 'rainwater-harvest',
    slug: 'rainwater-harvest',
    title: 'Rainwater Harvesting Volume',
    description:
      'Calculate annual harvestable rainwater volume from your roof based on catchment area, rainfall, runoff coefficient, and first-flush losses.',
    icon: '🌧️',
    category: 'energy',
    subcategory: 'sustainability',
    tags: ['rainwater', 'harvesting', 'water', 'sustainability', 'catchment', 'runoff', 'cistern'],
    inputs: [
      {
        id: 'roofAreaSqM',
        label: 'Roof Catchment Area',
        type: 'number',
        defaultValue: 100,
        helpText: 'm2 (horizontal projected area)',
      },
      {
        id: 'annualRainfallMm',
        label: 'Annual Rainfall',
        type: 'number',
        defaultValue: 800,
        helpText: 'mm per year (check local weather data)',
      },
      {
        id: 'runoffCoefficient',
        label: 'Roof Type / Runoff Coefficient',
        type: 'select',
        options: [
          { label: 'Metal or tile roof (0.90)', value: '0.90' },
          { label: 'Concrete (0.85)', value: '0.85' },
          { label: 'Asphalt shingle (0.75)', value: '0.75' },
          { label: 'Gravel roof (0.60)', value: '0.60' },
        ],
        defaultValue: '0.90',
      },
      {
        id: 'firstFlushLoss',
        label: 'First Flush Loss',
        type: 'number',
        defaultValue: 10,
        helpText: 'percent — diverted to remove contaminants',
      },
    ],
    formulas: [
      // Gross volume = area x rainfall / 1000 x runoff coefficient
      {
        id: 'grossM3',
        expression: 'roofAreaSqM * (annualRainfallMm / 1000) * runoffCoefficient',
        dependencies: ['roofAreaSqM', 'annualRainfallMm', 'runoffCoefficient'],
      },
      // Net volume after first-flush losses
      {
        id: 'netM3',
        expression: 'grossM3 * (1 - firstFlushLoss / 100)',
        dependencies: ['grossM3', 'firstFlushLoss'],
      },
      {
        id: 'netLiters',
        expression: 'netM3 * 1000',
        dependencies: ['netM3'],
      },
      {
        id: 'monthlyAvg',
        expression: 'netLiters / 12',
        dependencies: ['netLiters'],
      },
      {
        id: 'dailyAvg',
        expression: 'netLiters / 365',
        dependencies: ['netLiters'],
      },
    ],
    outputs: [
      {
        id: 'netLitersOut',
        label: 'Annual Harvestable Water',
        formulaRef: 'netLiters',
        precision: 0,
        suffix: ' L/year',
        highlight: true,
      },
      {
        id: 'monthlyAvgOut',
        label: 'Monthly Average',
        formulaRef: 'monthlyAvg',
        precision: 0,
        suffix: ' L/month',
      },
      {
        id: 'dailyAvgOut',
        label: 'Daily Average',
        formulaRef: 'dailyAvg',
        precision: 1,
        suffix: ' L/day',
      },
    ],
    guide: {
      whatIsIt:
        'Rainwater harvesting collects precipitation from rooftops and stores it for non-potable or potable use (with proper filtration). The harvestable volume depends on catchment area, local rainfall, roof surface type (affecting runoff), and first-flush diversion (the initial rainfall washes off pollutants and is discarded). Average household water use is 100-150 L/person/day.',
      howToUse:
        '1. Enter your roof catchment area in square meters (use the horizontal projected area, not the actual sloped area).\n2. Enter your local annual rainfall in mm (available from weather services or local water authority).\n3. Select your roof type to set the runoff coefficient.\n4. Enter the first-flush loss percentage (10% is a common default).',
      exampleScenario:
        'A 100 m2 metal roof in a region with 800 mm/year rainfall. Gross = 100 x 0.8 x 0.90 = 72 m3. With 10% first-flush loss: net = 72 x 0.9 = 64.8 m3 = 64,800 L/year. That is 5,400 L/month or 177 L/day — enough to supply water for garden irrigation and toilet flushing.',
      proTip:
        'Size your storage tank to capture the most rainfall from wet-season peaks. A rule of thumb is to size the tank for 1-2 months of supply. For potable use, add UV sterilisation and carbon filtration. Many municipalities offer rebates for rainwater tanks — check with your local water authority before installing.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 6. LED Energy Savings Calculator
  // =========================================================================
  {
    id: 'led-savings',
    slug: 'led-savings',
    title: 'LED Energy Savings Calculator',
    description:
      'Calculate annual energy and cost savings from switching to LED lighting, including CO2 reduction and payback period.',
    icon: '💡',
    category: 'energy',
    subcategory: 'power',
    tags: ['LED', 'lighting', 'energy savings', 'incandescent', 'CFL', 'electricity', 'carbon'],
    inputs: [
      {
        id: 'numBulbs',
        label: 'Number of Bulbs',
        type: 'number',
        defaultValue: 20,
        min: 1,
      },
      {
        id: 'oldWatts',
        label: 'Old Bulb Wattage',
        type: 'number',
        defaultValue: 60,
        helpText: 'Incandescent: 60W, CFL: 14W (Watts)',
      },
      {
        id: 'newWatts',
        label: 'New LED Wattage',
        type: 'number',
        defaultValue: 9,
        helpText: 'LED: 9-10W for 60W-equivalent (Watts)',
      },
      {
        id: 'hoursPerDay',
        label: 'Daily Usage',
        type: 'number',
        defaultValue: 5,
        helpText: 'hours per day per bulb',
      },
      {
        id: 'electricityRate',
        label: 'Electricity Rate',
        type: 'number',
        defaultValue: 0.15,
        helpText: 'USD/kWh',
      },
    ],
    formulas: [
      // Total watt savings across all bulbs
      {
        id: 'wattSavings',
        expression: '(oldWatts - newWatts) * numBulbs',
        dependencies: ['oldWatts', 'newWatts', 'numBulbs'],
      },
      // Annual kWh saved
      {
        id: 'annualKwhSaved',
        expression: 'wattSavings * hoursPerDay * 365 / 1000',
        dependencies: ['wattSavings', 'hoursPerDay'],
      },
      // Annual dollar savings
      {
        id: 'annualSavings',
        expression: 'annualKwhSaved * electricityRate',
        dependencies: ['annualKwhSaved', 'electricityRate'],
      },
      // CO2 avoided (US average: 0.386 kg CO2 per kWh)
      {
        id: 'co2SavedKg',
        expression: 'annualKwhSaved * 0.386',
        dependencies: ['annualKwhSaved'],
      },
      // Payback in months (assuming $8 per LED bulb)
      {
        id: 'paybackMonths',
        expression: '(numBulbs * 8) / annualSavings * 12',
        dependencies: ['numBulbs', 'annualSavings'],
      },
    ],
    outputs: [
      {
        id: 'annualSavingsOut',
        label: 'Annual Savings',
        formulaRef: 'annualSavings',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
      {
        id: 'annualKwhSavedOut',
        label: 'kWh Saved per Year',
        formulaRef: 'annualKwhSaved',
        precision: 1,
        suffix: ' kWh',
      },
      {
        id: 'co2SavedKgOut',
        label: 'CO2 Avoided',
        formulaRef: 'co2SavedKg',
        precision: 1,
        suffix: ' kg/year',
      },
      {
        id: 'paybackMonthsOut',
        label: 'LED Payback Period',
        formulaRef: 'paybackMonths',
        precision: 1,
        suffix: ' months',
      },
    ],
    guide: {
      whatIsIt:
        'LED (Light Emitting Diode) bulbs use 75-80% less energy than incandescent bulbs for the same light output. A 9W LED replaces a 60W incandescent (saving 51W per bulb). LEDs also last 15,000-25,000 hours vs. 1,000 hours for incandescents, reducing replacement frequency and waste. The CO2 factor used (0.386 kg/kWh) is the US EPA average grid emissions factor.',
      howToUse:
        '1. Enter the number of bulbs you want to replace.\n2. Enter the wattage of your old bulbs (60W incandescent is most common).\n3. Enter the wattage of the replacement LED (9-10W for a 60W equivalent).\n4. Enter average daily hours of use per bulb.\n5. Enter your electricity rate per kWh.',
      exampleScenario:
        'Replacing 20 x 60W incandescents with 9W LEDs. Watt savings = (60-9) x 20 = 1,020W = 1.02 kW. At 5 hours/day: annual savings = 1.02 x 5 x 365 = 1,862 kWh. At $0.15/kWh: savings = $279/year. CO2 avoided = 1,862 x 0.386 = 719 kg/year. With LEDs at $8 each: payback = (20 x $8) / $279 x 12 = 6.9 months.',
      proTip:
        'LEDs also save on cooling costs — incandescent bulbs convert 90% of energy to heat. In air-conditioned spaces, this heat must be removed by the AC, adding a secondary energy cost. The real savings in warm climates can be 10-15% higher than the electricity savings alone suggest.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 7. EV Charging Time Calculator
  // =========================================================================
  {
    id: 'ev-charging-time',
    slug: 'ev-charging-time',
    title: 'EV Charging Time Calculator',
    description:
      'Calculate how long it takes to charge an electric vehicle from a given state of charge to a target level, for any charging level from Level 1 to DC Fast.',
    icon: '🔌',
    category: 'energy',
    subcategory: 'sustainability',
    tags: ['EV', 'electric vehicle', 'charging', 'Level 2', 'DCFC', 'Tesla', 'kWh', 'battery'],
    inputs: [
      {
        id: 'batteryCapacityKwh',
        label: 'Battery Capacity',
        type: 'number',
        defaultValue: 75,
        helpText: 'kWh — Tesla M3: 50-82 kWh, Leaf: 40 kWh',
      },
      {
        id: 'currentSoc',
        label: 'Current State of Charge',
        type: 'number',
        defaultValue: 20,
        min: 0,
        max: 100,
        helpText: 'percent',
      },
      {
        id: 'targetSoc',
        label: 'Target State of Charge',
        type: 'number',
        defaultValue: 80,
        min: 0,
        max: 100,
        helpText: 'percent',
      },
      {
        id: 'chargingLevelKw',
        label: 'Charging Level',
        type: 'select',
        options: [
          { label: 'Level 1 - 1.4 kW (120V)', value: '1.4' },
          { label: 'Level 2 - 7.2 kW (240V home)', value: '7.2' },
          { label: 'Level 2 - 11 kW (240V fast)', value: '11' },
          { label: 'DC Fast - 50 kW', value: '50' },
          { label: 'DC Fast - 150 kW', value: '150' },
          { label: 'DC Fast - 250 kW', value: '250' },
        ],
        defaultValue: '7.2',
      },
      {
        id: 'chargeEfficiency',
        label: 'Charging Efficiency',
        type: 'number',
        defaultValue: 90,
        helpText: 'percent (Level 1/2: 85-90%, DC Fast: 90-95%)',
      },
    ],
    formulas: [
      // kWh needed = capacity x (target - current) / 100
      {
        id: 'kwhNeeded',
        expression: 'batteryCapacityKwh * (targetSoc - currentSoc) / 100',
        dependencies: ['batteryCapacityKwh', 'targetSoc', 'currentSoc'],
      },
      // Effective charging rate after efficiency losses
      {
        id: 'effectiveKw',
        expression: 'chargingLevelKw * (chargeEfficiency / 100)',
        dependencies: ['chargingLevelKw', 'chargeEfficiency'],
      },
      // Charging time in hours
      {
        id: 'hoursToCharge',
        expression: 'kwhNeeded / effectiveKw',
        dependencies: ['kwhNeeded', 'effectiveKw'],
      },
      {
        id: 'minutesToCharge',
        expression: 'hoursToCharge * 60',
        dependencies: ['hoursToCharge'],
      },
      // Estimated cost at $0.15/kWh
      {
        id: 'costToCharge',
        expression: 'kwhNeeded * 0.15',
        dependencies: ['kwhNeeded'],
      },
    ],
    outputs: [
      {
        id: 'hoursToChargeOut',
        label: 'Charging Time',
        formulaRef: 'hoursToCharge',
        precision: 2,
        suffix: ' hours',
        highlight: true,
      },
      {
        id: 'minutesToChargeOut',
        label: 'In Minutes',
        formulaRef: 'minutesToCharge',
        precision: 0,
        suffix: ' min',
      },
      {
        id: 'kwhNeededOut',
        label: 'Energy Added',
        formulaRef: 'kwhNeeded',
        precision: 2,
        suffix: ' kWh',
      },
      {
        id: 'costToChargeOut',
        label: 'Est. Cost (@$0.15/kWh)',
        formulaRef: 'costToCharge',
        format: 'currency',
        precision: 2,
      },
    ],
    guide: {
      whatIsIt:
        'EV charging time depends on the battery capacity, how much charge is needed (current to target SOC), charger power level, and onboard charger efficiency. Level 1 (120V/15A) is slowest at 1.4 kW; Level 2 home chargers run at 7-11 kW; DC Fast Chargers deliver 50-350 kW directly to the battery. Most EVs limit fast charging to 80% SOC to protect battery life.',
      howToUse:
        '1. Enter your vehicle battery capacity in kWh.\n2. Enter current state of charge (SOC) and your desired target SOC.\n3. Select your charging level from the dropdown.\n4. Enter charging efficiency (Level 2 typically 88-92%).\n5. Read off charging time and estimated electricity cost.',
      exampleScenario:
        'Tesla Model 3 Long Range (82 kWh) at 20% SOC, charging to 80% on a 7.2 kW Level 2 home charger at 90% efficiency. kWh needed = 82 x (80-20)/100 = 49.2 kWh. Effective rate = 7.2 x 0.90 = 6.48 kW. Time = 49.2/6.48 = 7.6 hours. Cost = 49.2 x $0.15 = $7.38.',
      proTip:
        'Charge to 80% for daily use to maximise battery longevity — lithium-ion degradation accelerates significantly above 80% SOC. Use a full 100% charge only before long road trips. If you have time-of-use electricity pricing, schedule overnight charging during off-peak hours (typically midnight to 6am) to cut charging costs by 30-50%.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 8. Home Heat Loss (HVAC) Calculator
  // =========================================================================
  {
    id: 'home-heat-loss',
    slug: 'home-heat-loss',
    title: 'Home Heat Loss (HVAC) Calculator',
    description:
      'Estimate residential design heat loss in BTU/hr from walls, roof, and windows using R-values and design temperatures for HVAC system sizing.',
    icon: '🏠',
    category: 'energy',
    subcategory: 'sustainability',
    tags: ['HVAC', 'heat loss', 'R-value', 'insulation', 'BTU', 'heating', 'Manual J', 'energy audit'],
    inputs: [
      {
        id: 'floorArea',
        label: 'Floor Area',
        type: 'number',
        defaultValue: 1500,
        helpText: 'sq ft',
      },
      {
        id: 'ceilingHeight',
        label: 'Ceiling Height',
        type: 'number',
        defaultValue: 9,
        helpText: 'ft',
      },
      {
        id: 'wallRValue',
        label: 'Wall R-Value',
        type: 'number',
        defaultValue: 13,
        helpText: 'R-13: 2x4 walls, R-21: 2x6, R-40: spray foam',
      },
      {
        id: 'roofRValue',
        label: 'Roof / Ceiling R-Value',
        type: 'number',
        defaultValue: 38,
        helpText: 'R-38: typical attic, R-60: high performance',
      },
      {
        id: 'windowArea',
        label: 'Total Window Area',
        type: 'number',
        defaultValue: 200,
        helpText: 'sq ft',
      },
      {
        id: 'windowRValue',
        label: 'Window R-Value',
        type: 'number',
        defaultValue: 2,
        helpText: 'Single pane R-1, double R-2, triple R-3+',
      },
      {
        id: 'outdoorTemp',
        label: 'Outdoor Design Temperature',
        type: 'number',
        defaultValue: 0,
        helpText: 'degrees F (use 99% design temp for your location)',
      },
      {
        id: 'indoorTemp',
        label: 'Indoor Set Temperature',
        type: 'number',
        defaultValue: 70,
        helpText: 'degrees F',
      },
    ],
    formulas: [
      // Temperature difference
      {
        id: 'deltaT',
        expression: 'indoorTemp - outdoorTemp',
        dependencies: ['indoorTemp', 'outdoorTemp'],
      },
      // Approximate perimeter from floor area (assuming square footprint)
      {
        id: 'perimeter',
        expression: '4 * sqrt(floorArea)',
        dependencies: ['floorArea'],
      },
      // Wall area = perimeter x height - window area
      {
        id: 'wallArea',
        expression: 'perimeter * ceilingHeight - windowArea',
        dependencies: ['perimeter', 'ceilingHeight', 'windowArea'],
      },
      // Heat loss (BTU/hr) = area / R-value x delta T
      {
        id: 'wallLoss',
        expression: '(wallArea / wallRValue) * deltaT',
        dependencies: ['wallArea', 'wallRValue', 'deltaT'],
      },
      {
        id: 'roofLoss',
        expression: '(floorArea / roofRValue) * deltaT',
        dependencies: ['floorArea', 'roofRValue', 'deltaT'],
      },
      {
        id: 'windowLoss',
        expression: '(windowArea / windowRValue) * deltaT',
        dependencies: ['windowArea', 'windowRValue', 'deltaT'],
      },
      {
        id: 'totalBtu',
        expression: 'wallLoss + roofLoss + windowLoss',
        dependencies: ['wallLoss', 'roofLoss', 'windowLoss'],
      },
      // Heating tons (1 ton = 12,000 BTU/hr)
      {
        id: 'heatingTons',
        expression: 'totalBtu / 12000',
        dependencies: ['totalBtu'],
      },
    ],
    outputs: [
      {
        id: 'totalBtuOut',
        label: 'Design Heat Loss',
        formulaRef: 'totalBtu',
        precision: 0,
        suffix: ' BTU/hr',
        highlight: true,
      },
      {
        id: 'heatingTonsOut',
        label: 'Required Heating Capacity',
        formulaRef: 'heatingTons',
        precision: 2,
        suffix: ' tons',
      },
      {
        id: 'wallLossOut',
        label: 'Wall Heat Loss',
        formulaRef: 'wallLoss',
        precision: 0,
        suffix: ' BTU/hr',
      },
      {
        id: 'roofLossOut',
        label: 'Roof Heat Loss',
        formulaRef: 'roofLoss',
        precision: 0,
        suffix: ' BTU/hr',
      },
    ],
    guide: {
      whatIsIt:
        'Design heat loss is the rate at which heat escapes a building under design (worst-case) winter conditions, measured in BTU/hr. It determines the minimum heating system capacity needed to maintain indoor comfort. The formula Q = A/R x DeltaT calculates heat flow through each building envelope component. This is a simplified Manual J approach covering walls, roof, and windows.',
      howToUse:
        '1. Enter your home floor area and ceiling height.\n2. Enter R-values for walls, roof/ceiling, and windows.\n3. Enter your outdoor design temperature (99th percentile coldest day for your location — find via ASHRAE data).\n4. Enter your target indoor temperature.\n5. The result shows total BTU/hr heat loss and equivalent tonnage for system sizing.',
      exampleScenario:
        'A 1,500 sq ft home with 9 ft ceilings, R-13 walls, R-38 roof, 200 sq ft of double-pane windows (R-2). Design temperatures: outdoor 0 F, indoor 70 F. DeltaT = 70 F. Estimated results: wall loss ~4,200 BTU/hr, roof ~2,800 BTU/hr, windows ~7,000 BTU/hr. Total ~14,000 BTU/hr = 1.2 tons. A 1.5-ton heat pump would provide adequate capacity.',
      proTip:
        'This calculator omits infiltration (air leakage), which can add 20-40% more heat loss in older homes. For a full Manual J calculation (required for permit-based HVAC in many jurisdictions), use professional HVAC software like Wrightsoft. Upgrading windows from R-2 to R-5 often reduces window heat loss by 60% and can be the single highest-impact retrofit in a cold climate.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 9. Water Flow Rate (GPM) Calculator
  // =========================================================================
  {
    id: 'water-flow-rate',
    slug: 'water-flow-rate',
    title: 'Water Flow Rate (GPM) Calculator',
    description:
      'Calculate water flow rate in GPM, L/min, and m3/hr from pipe diameter and system pressure using the Torricelli-based flow equation.',
    icon: '💧',
    category: 'energy',
    subcategory: 'sustainability',
    tags: ['flow rate', 'GPM', 'pipe', 'plumbing', 'PSI', 'liters per minute', 'hydraulics', 'water'],
    inputs: [
      {
        id: 'pipeDiameterIn',
        label: 'Pipe Inner Diameter',
        type: 'number',
        defaultValue: 1,
        step: 0.25,
        helpText: 'inches ID — common: 0.5, 0.75, 1, 1.5 inches',
      },
      {
        id: 'pressurePsi',
        label: 'System Pressure',
        type: 'number',
        defaultValue: 60,
        helpText: 'PSI (typical residential: 40-80 PSI)',
      },
    ],
    formulas: [
      // Cross-sectional area in square inches
      {
        id: 'areaIn2',
        expression: '3.14159265 * pow(pipeDiameterIn / 2, 2)',
        dependencies: ['pipeDiameterIn'],
      },
      // Velocity (ft/s) from Torricelli: v = 0.4085 x sqrt(PSI)
      {
        id: 'velocityFps',
        expression: '0.4085 * sqrt(pressurePsi)',
        dependencies: ['pressurePsi'],
      },
      // GPM = area (in2) x velocity (fps) x 0.4085 x sqrt(PSI) / 5
      // Using simplified: GPM = 0.4085 x A x sqrt(P) converted to GPM units
      {
        id: 'gpm',
        expression: 'areaIn2 * velocityFps * 0.4085 * sqrt(pressurePsi) / 5',
        dependencies: ['areaIn2', 'velocityFps', 'pressurePsi'],
      },
      // Convert to liters per minute (1 US gal = 3.78541 L)
      {
        id: 'lpm',
        expression: 'gpm * 3.78541',
        dependencies: ['gpm'],
      },
      // Convert to cubic meters per hour
      {
        id: 'm3perHour',
        expression: 'lpm * 60 / 1000',
        dependencies: ['lpm'],
      },
    ],
    outputs: [
      {
        id: 'gpmOut',
        label: 'Flow Rate',
        formulaRef: 'gpm',
        precision: 2,
        suffix: ' GPM',
        highlight: true,
      },
      {
        id: 'lpmOut',
        label: 'Flow Rate',
        formulaRef: 'lpm',
        precision: 2,
        suffix: ' L/min',
      },
      {
        id: 'm3perHourOut',
        label: 'Flow Rate',
        formulaRef: 'm3perHour',
        precision: 3,
        suffix: ' m3/hr',
      },
    ],
    guide: {
      whatIsIt:
        'Water flow rate (GPM) through a pipe depends on the pipe diameter and the pressure driving the flow. This calculator uses a simplified Torricelli-based formula that estimates flow rate from pressure and cross-sectional area. In practice, actual flow rate is also affected by pipe length, fittings, and pipe roughness (friction losses), so this gives a theoretical maximum at the outlet.',
      howToUse:
        '1. Enter the pipe inner diameter (ID) in inches. Common sizes: 0.5" (kitchen tap), 0.75" (main supply), 1" (irrigation), 1.5" (larger irrigation).\n2. Enter the static water pressure in PSI (use a pressure gauge on a hose bib; typical residential = 40-80 PSI).\n3. The calculator returns flow rate in GPM, L/min, and m3/hr.',
      exampleScenario:
        'A 1-inch irrigation pipe at 60 PSI. Pipe area = pi x 0.5^2 = 0.785 in2. Using this calculator, flow rate is approximately 4-6 GPM depending on friction losses. Typical drip irrigation emitters use 0.5-1 GPM each, so this supply line can feed 4-12 emitters simultaneously.',
      proTip:
        'This formula gives theoretical flow at the pipe exit with no friction losses. Real-world flow through long pipe runs is significantly lower — use the Hazen-Williams formula for accurate friction loss calculations in distribution systems. As a rule of thumb, keep flow velocity below 5 ft/s in supply piping to avoid noise and water hammer.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 10. Composting C:N Ratio Calculator
  // =========================================================================
  {
    id: 'cn-ratio',
    slug: 'cn-ratio',
    title: 'Composting C:N Ratio Calculator',
    description:
      'Calculate the blended carbon-to-nitrogen (C:N) ratio of a two-material compost mix to achieve the ideal decomposition range of 25:1 to 35:1.',
    icon: '🌱',
    category: 'energy',
    subcategory: 'sustainability',
    tags: ['composting', 'C:N ratio', 'carbon nitrogen', 'sustainability', 'garden', 'organic waste'],
    inputs: [
      {
        id: 'material1Weight',
        label: 'Material 1 — Weight',
        type: 'number',
        defaultValue: 10,
        helpText: 'kg (brown / carbon-rich material)',
      },
      {
        id: 'material1CN',
        label: 'Material 1 — Type (C:N ratio)',
        type: 'select',
        options: [
          { label: 'Dry leaves (50:1)', value: '50' },
          { label: 'Straw (75:1)', value: '75' },
          { label: 'Cardboard (350:1)', value: '350' },
          { label: 'Wood chips (400:1)', value: '400' },
          { label: 'Sawdust (400:1)', value: '400' },
          { label: 'Paper (170:1)', value: '170' },
        ],
        defaultValue: '50',
      },
      {
        id: 'material2Weight',
        label: 'Material 2 — Weight',
        type: 'number',
        defaultValue: 10,
        helpText: 'kg (green / nitrogen-rich material)',
      },
      {
        id: 'material2CN',
        label: 'Material 2 — Type (C:N ratio)',
        type: 'select',
        options: [
          { label: 'Grass clippings (20:1)', value: '20' },
          { label: 'Food scraps (15:1)', value: '15' },
          { label: 'Coffee grounds (20:1)', value: '20' },
          { label: 'Cow manure (20:1)', value: '20' },
          { label: 'Chicken manure (7:1)', value: '7' },
          { label: 'Fresh vegetables (12:1)', value: '12' },
        ],
        defaultValue: '20',
      },
    ],
    formulas: [
      {
        id: 'totalWeight',
        expression: 'material1Weight + material2Weight',
        dependencies: ['material1Weight', 'material2Weight'],
      },
      // Weighted average C:N ratio
      {
        id: 'weightedCN',
        expression:
          '(material1Weight * material1CN + material2Weight * material2CN) / totalWeight',
        dependencies: ['material1Weight', 'material1CN', 'material2Weight', 'material2CN', 'totalWeight'],
      },
      // 1 if in ideal 25-35:1 range, else 0
      {
        id: 'inRange',
        expression: 'weightedCN >= 25 ? (weightedCN <= 35 ? 1 : 0) : 0',
        dependencies: ['weightedCN'],
      },
    ],
    outputs: [
      {
        id: 'weightedCNOut',
        label: 'Blend C:N Ratio',
        formulaRef: 'weightedCN',
        precision: 1,
        suffix: ':1',
        highlight: true,
      },
      {
        id: 'inRangeOut',
        label: 'In Ideal Range 25-35 (1=Yes, 0=Adjust)',
        formulaRef: 'inRange',
        precision: 0,
      },
    ],
    guide: {
      whatIsIt:
        'The carbon-to-nitrogen (C:N) ratio determines how fast compost decomposes. Microorganisms that break down organic matter consume approximately 30 parts carbon for every 1 part nitrogen. The ideal composting ratio is 25:1 to 35:1. Too high (above 40:1) = slow decomposition. Too low (below 20:1) = ammonia smell and nitrogen loss. Brown materials (leaves, straw, cardboard) are carbon-rich; green materials (grass, food scraps, manure) are nitrogen-rich.',
      howToUse:
        '1. Select your carbon-rich (brown) material and enter its weight in kg.\n2. Select your nitrogen-rich (green) material and enter its weight in kg.\n3. The calculator shows the weighted C:N ratio of the blend.\n4. The in-range indicator tells you whether the blend is in the ideal 25-35:1 zone.',
      exampleScenario:
        'Mixing 10 kg of dry leaves (C:N 50:1) with 10 kg of grass clippings (C:N 20:1). Blended C:N = (10x50 + 10x20) / 20 = 700/20 = 35:1. This blend is right at the upper edge of the ideal range. The pile should decompose well, but adding a bit more green material (or nitrogen) would speed decomposition.',
      proTip:
        'When your pile is too high in carbon (slow, dry, not warming up), add nitrogen sources: fresh grass clippings, food scraps, coffee grounds, or diluted urine (C:N 1:1). When too low in carbon (slimy, smelly), add cardboard, shredded paper, or dry leaves. Aim for your pile to feel like a wrung-out sponge: moist but not dripping. Turn the pile weekly to aerate and speed decomposition.',
    },
    metadata: { version: '1.0.0' },
  },
];
