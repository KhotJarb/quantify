// ---------------------------------------------------------------------------
// Quantify — HR & Business Calculators
// ---------------------------------------------------------------------------
// 10 calculators covering workforce metrics, payroll, scheduling, and
// productivity tools for HR professionals and freelancers.
// ---------------------------------------------------------------------------

import type { CalculatorSchema } from '@/types/calculator';

export const hrBusinessCalculators: CalculatorSchema[] = [
  // =========================================================================
  // 31. Employee Turnover Rate
  // =========================================================================
  {
    id: 'employee-turnover',
    slug: 'employee-turnover',
    title: 'Employee Turnover Rate',
    description:
      "Calculate your organisation's employee turnover rate for any period and see an annualised figure alongside an estimated replacement cost.",
    icon: '👥',
    category: 'hr',
    subcategory: 'workforce',
    tags: ['turnover', 'attrition', 'retention', 'headcount', 'hr', 'workforce', 'separations'],
    inputs: [
      {
        id: 'separations',
        label: 'Number of Separations',
        type: 'number',
        defaultValue: 12,
        min: 0,
        step: 1,
        helpText: 'Number of employees who left in the period',
        required: true,
      },
      {
        id: 'beginningHeadcount',
        label: 'Beginning Headcount',
        type: 'number',
        defaultValue: 100,
        min: 1,
        step: 1,
        helpText: 'Employees at start of period',
        required: true,
      },
      {
        id: 'endingHeadcount',
        label: 'Ending Headcount',
        type: 'number',
        defaultValue: 95,
        min: 0,
        step: 1,
        helpText: 'Employees at end of period',
        required: true,
      },
      {
        id: 'period',
        label: 'Measurement Period',
        type: 'select',
        options: [
          { label: 'Monthly', value: '12' },
          { label: 'Quarterly', value: '4' },
          { label: 'Annually', value: '1' },
        ],
        defaultValue: '1',
        helpText: 'Select the period these numbers cover — used to annualise the rate',
      },
    ],
    formulas: [
      {
        id: 'avgEmployees',
        expression: '(beginningHeadcount + endingHeadcount) / 2',
        dependencies: ['beginningHeadcount', 'endingHeadcount'],
      },
      {
        id: 'turnoverRate',
        expression: '(separations / avgEmployees) * 100',
        dependencies: ['separations', 'avgEmployees'],
      },
      {
        id: 'annualizedRate',
        expression: 'turnoverRate * period',
        dependencies: ['turnoverRate', 'period'],
      },
      {
        id: 'replacementCost',
        expression: 'separations * avgEmployees * 200',
        dependencies: ['separations', 'avgEmployees'],
      },
    ],
    outputs: [
      {
        id: 'out-turnoverRate',
        label: 'Turnover Rate (Period)',
        formulaRef: 'turnoverRate',
        format: 'number',
        precision: 2,
        suffix: '%',
        highlight: true,
      },
      {
        id: 'out-annualizedRate',
        label: 'Annualised Rate',
        formulaRef: 'annualizedRate',
        format: 'number',
        precision: 2,
        suffix: '%',
      },
      {
        id: 'out-replacementCost',
        label: 'Estimated Replacement Cost',
        formulaRef: 'replacementCost',
        format: 'currency',
        precision: 0,
      },
    ],
    guide: {
      whatIsIt:
        'Employee turnover rate measures the percentage of your workforce that leaves over a given period. It is one of the most watched HR metrics because high turnover signals disengagement, poor management, or uncompetitive pay — and directly drives up recruitment and onboarding costs. The industry benchmark varies widely: retail and hospitality see 50-70% annually, while professional services average 10-15%.',
      howToUse:
        'Enter the number of separations (voluntary resignations, terminations, retirements) that occurred during the measurement period, along with your headcount at the start and end of that period. Select whether the data covers a month, quarter, or year — the calculator will project the rate to an annual equivalent for easy benchmarking.',
      exampleScenario:
        'A 100-person company starts Q1 with 100 employees and ends with 95 after 5 separations. Average headcount is 97.5, so the quarterly turnover rate is 5.13%. Selecting Quarterly annualises this to 20.5% — above the 15% professional-services benchmark and a signal to investigate retention drivers.',
      proTip:
        'Track voluntary versus involuntary turnover separately: voluntary (resignations) reflects satisfaction, while involuntary (terminations) reflects performance management. A healthy organisation typically wants low voluntary turnover and a modest, stable involuntary rate. Consider surveying departing employees within 30 days of their last day for the most candid exit feedback.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 32. FTE (Full-Time Equivalent) Calculator
  // =========================================================================
  {
    id: 'fte-calculator',
    slug: 'fte-calculator',
    title: 'FTE (Full-Time Equivalent) Calculator',
    description:
      'Convert a mix of full-time and part-time workers into a single Full-Time Equivalent headcount for budgeting, grant applications, and capacity planning.',
    icon: '📋',
    category: 'hr',
    subcategory: 'workforce',
    tags: ['fte', 'full-time equivalent', 'headcount', 'part-time', 'workforce', 'hr', 'capacity'],
    inputs: [
      {
        id: 'fullTimeCount',
        label: 'Full-Time Employees',
        type: 'number',
        defaultValue: 10,
        min: 0,
        step: 1,
        helpText: 'Number of employees working full standard hours',
        required: true,
      },
      {
        id: 'partTimeHours',
        label: 'Total Part-Time Hours per Week',
        type: 'number',
        defaultValue: 80,
        min: 0,
        step: 1,
        helpText: 'Sum of all part-time employees weekly hours combined',
        required: true,
      },
      {
        id: 'standardHours',
        label: 'Standard Full-Time Hours per Week',
        type: 'number',
        defaultValue: 40,
        min: 1,
        max: 80,
        step: 0.5,
        helpText: 'Typically 40 hrs in the US/UK; 37.5 hrs in many EU countries',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'fullTimeFte',
        expression: 'fullTimeCount',
        dependencies: ['fullTimeCount'],
      },
      {
        id: 'partTimeFte',
        expression: 'partTimeHours / standardHours',
        dependencies: ['partTimeHours', 'standardHours'],
      },
      {
        id: 'totalFte',
        expression: 'fullTimeFte + partTimeFte',
        dependencies: ['fullTimeFte', 'partTimeFte'],
      },
      {
        id: 'annualFteHours',
        expression: 'totalFte * standardHours * 52',
        dependencies: ['totalFte', 'standardHours'],
      },
    ],
    outputs: [
      {
        id: 'out-totalFte',
        label: 'Total FTE',
        formulaRef: 'totalFte',
        format: 'number',
        precision: 2,
        highlight: true,
      },
      {
        id: 'out-partTimeFte',
        label: 'Part-Time FTE',
        formulaRef: 'partTimeFte',
        format: 'number',
        precision: 2,
      },
      {
        id: 'out-annualFteHours',
        label: 'Annual FTE Hours',
        formulaRef: 'annualFteHours',
        format: 'number',
        precision: 0,
        suffix: ' hours',
      },
    ],
    guide: {
      whatIsIt:
        'A Full-Time Equivalent (FTE) normalises your workforce to a common unit based on a standard work week. One FTE equals one person working full-time for a full year. Part-time workers are fractional FTEs: a person working 20 hours in a 40-hour week is 0.5 FTE. FTE is used in payroll budgeting, government reporting, grant applications, healthcare staffing ratios, and the ACA employer mandate thresholds.',
      howToUse:
        'Enter your number of full-time staff, the combined total weekly hours of all part-time employees, and your company standard full-time week. The calculator derives part-time FTE and adds it to full-time headcount for a total FTE figure, then projects annual hours for capacity or cost modelling.',
      exampleScenario:
        'A small clinic has 10 full-time nurses (40 hrs/wk) and 4 part-time nurses who collectively work 80 hrs/week. Part-time FTE = 80 / 40 = 2.0. Total FTE = 12. Annual hours = 12 x 40 x 52 = 24,960 hours — useful for scheduling and grant applications.',
      proTip:
        'For ACA (Affordable Care Act) compliance in the US, employers with 50 or more FTEs are considered Applicable Large Employers and must offer health coverage. Part-time hours are summed per month (not per week) for the ACA calculation, so verify the exact IRS methodology for compliance reporting.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 33. Bradford Factor
  // =========================================================================
  {
    id: 'bradford-factor',
    slug: 'bradford-factor',
    title: 'Bradford Factor',
    description:
      'Calculate the Bradford Factor absenteeism score (B = S x S x D) to identify patterns of short, frequent absences that disrupt team productivity.',
    icon: '📉',
    category: 'hr',
    subcategory: 'workforce',
    tags: ['bradford', 'absenteeism', 'absence', 'hr', 'attendance', 'workforce', 'sick days'],
    inputs: [
      {
        id: 'absenceInstances',
        label: 'Number of Absence Episodes (S)',
        type: 'number',
        defaultValue: 4,
        min: 0,
        step: 1,
        helpText: 'Number of separate, distinct absence episodes in the review period',
        required: true,
      },
      {
        id: 'totalDaysAbsent',
        label: 'Total Days Absent (D)',
        type: 'number',
        defaultValue: 10,
        min: 0,
        step: 1,
        helpText: 'Total calendar days absent across all episodes in the review period',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'bradfordScore',
        expression: 'absenceInstances * absenceInstances * totalDaysAbsent',
        dependencies: ['absenceInstances', 'totalDaysAbsent'],
      },
      {
        id: 'riskLevel',
        expression: 'bradfordScore < 50 ? 1 : (bradfordScore < 200 ? 2 : (bradfordScore < 400 ? 3 : 4))',
        dependencies: ['bradfordScore'],
      },
    ],
    outputs: [
      {
        id: 'out-bradfordScore',
        label: 'Bradford Factor Score',
        formulaRef: 'bradfordScore',
        format: 'number',
        precision: 0,
        highlight: true,
      },
      {
        id: 'out-riskLevel',
        label: 'Risk Level (1=Low, 4=Critical)',
        formulaRef: 'riskLevel',
        format: 'number',
        precision: 0,
      },
    ],
    guide: {
      whatIsIt:
        'The Bradford Factor is a UK HR formula (B = S x S x D) that weights the disruptiveness of absences by squaring the number of separate episodes (S) and multiplying by total days (D). It deliberately penalises frequent short absences more than a single long one — e.g., 10 separate 1-day absences scores 100, while 1 absence of 10 days scores just 10. Thresholds: less than 50 = Low; 50-199 = Caution; 200-399 = Warning; 400 or above = Action Required. The Bradford Factor is controversial — it does not distinguish between illness and personal emergencies, and some organisations have moved away from it due to concerns about penalising employees with chronic conditions.',
      howToUse:
        'For each employee over a rolling 12-month period, count the number of distinct absence episodes and the total days absent. Enter both figures; the score and risk tier are calculated instantly. Use the score as a trigger for a supportive conversation, not as a punitive metric in isolation.',
      exampleScenario:
        'An employee had 4 separate absence episodes totalling 10 days. Bradford Score = 4 x 4 x 10 = 160, which falls in the Caution band. A manager would schedule a return-to-work interview to understand any underlying patterns and offer support before the score escalates.',
      proTip:
        'Always overlay Bradford scores with context: a score of 500 driven by a disclosed disability or serious illness should be managed under your reasonable-adjustments policy, not a disciplinary process. Many HR platforms let you exclude pre-agreed absences (e.g., medical appointments for chronic conditions) from the Bradford calculation.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 34. Meeting Cost Calculator
  // =========================================================================
  {
    id: 'meeting-cost',
    slug: 'meeting-cost',
    title: 'Meeting Cost Calculator',
    description:
      'Quantify the real salary cost of meetings based on attendee count, average pay, and duration — and project the annual spend on recurring meetings.',
    icon: '💰',
    category: 'hr',
    subcategory: 'hr-productivity',
    tags: ['meeting', 'cost', 'productivity', 'salary', 'time', 'hr', 'efficiency', 'recurring'],
    inputs: [
      {
        id: 'numAttendees',
        label: 'Number of Attendees',
        type: 'number',
        defaultValue: 8,
        min: 1,
        step: 1,
        helpText: 'Total number of people in the meeting',
        required: true,
      },
      {
        id: 'avgSalary',
        label: 'Average Annual Salary (USD)',
        type: 'number',
        defaultValue: 80000,
        min: 0,
        step: 1000,
        helpText: 'Average annual salary of attendees — used to compute hourly cost',
        required: true,
      },
      {
        id: 'durationMinutes',
        label: 'Meeting Duration (minutes)',
        type: 'number',
        defaultValue: 60,
        min: 5,
        step: 5,
        helpText: 'Meeting duration in minutes',
        required: true,
      },
      {
        id: 'meetingsPerMonth',
        label: 'Meetings Per Month',
        type: 'number',
        defaultValue: 4,
        min: 1,
        step: 1,
        helpText: 'How many times this meeting recurs per month',
        required: true,
      },
    ],
    formulas: [
      {
        // 2,080 = 52 weeks x 40 hours standard work year
        id: 'hourlyRate',
        expression: 'avgSalary / 2080',
        dependencies: ['avgSalary'],
      },
      {
        id: 'durationHours',
        expression: 'durationMinutes / 60',
        dependencies: ['durationMinutes'],
      },
      {
        id: 'perMeetingCost',
        expression: 'numAttendees * hourlyRate * durationHours',
        dependencies: ['numAttendees', 'hourlyRate', 'durationHours'],
      },
      {
        id: 'monthlyCost',
        expression: 'perMeetingCost * meetingsPerMonth',
        dependencies: ['perMeetingCost', 'meetingsPerMonth'],
      },
      {
        id: 'annualCost',
        expression: 'monthlyCost * 12',
        dependencies: ['monthlyCost'],
      },
    ],
    outputs: [
      {
        id: 'out-perMeetingCost',
        label: 'Cost Per Meeting',
        formulaRef: 'perMeetingCost',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
      {
        id: 'out-monthlyCost',
        label: 'Monthly Cost',
        formulaRef: 'monthlyCost',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'out-annualCost',
        label: 'Annual Cost',
        formulaRef: 'annualCost',
        format: 'currency',
        precision: 2,
      },
    ],
    guide: {
      whatIsIt:
        'Every meeting has a hidden price tag: the combined salary cost of everyone involved. A weekly 1-hour meeting with 8 people earning $80K each costs over $14,000 per year in salary alone — before counting preparation time or context-switching costs. This calculator makes that figure tangible so teams can decide whether a meeting is worth holding, reducing in frequency, or replacing with async communication.',
      howToUse:
        'Enter the number of attendees and their average annual salary, the meeting length in minutes, and how often the meeting recurs per month. The calculator converts annual salary to an hourly rate using a 2,080-hour work year (52 weeks x 40 hours) and computes per-meeting, monthly, and annual costs.',
      exampleScenario:
        'A weekly 1-hour status meeting with 8 people averaging $80,000/year: hourly rate = $38.46. Meeting cost = 8 x $38.46 x 1 = $307.69 per meeting. Monthly (4 meetings) = $1,230.77. Annual = $14,769.23. Cutting the meeting to 30 minutes saves nearly $7,400/year.',
      proTip:
        'Use 4 meetings per month as a weekly meeting baseline. To estimate the cost of a one-off ad-hoc meeting, set meetings per month to 1. Consider sharing the annual cost figure with your team before scheduling large meetings — visibility alone tends to reduce unnecessary attendees and shorten durations.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 35. Cost Per Hire
  // =========================================================================
  {
    id: 'cost-per-hire',
    slug: 'cost-per-hire',
    title: 'Cost Per Hire',
    description:
      'Calculate your average cost per hire using the SHRM standard formula and benchmark your result against the US industry average of $4,700.',
    icon: '🤝',
    category: 'hr',
    subcategory: 'workforce',
    tags: ['cost per hire', 'recruitment', 'hiring', 'hr', 'talent acquisition', 'shrm', 'recruiting'],
    inputs: [
      {
        id: 'internalCosts',
        label: 'Internal Recruiting Costs (USD)',
        type: 'number',
        defaultValue: 5000,
        min: 0,
        step: 100,
        helpText: 'Recruiter salary allocation, HR staff time, onboarding, training materials',
        required: true,
      },
      {
        id: 'externalCosts',
        label: 'External Recruiting Costs (USD)',
        type: 'number',
        defaultValue: 3000,
        min: 0,
        step: 100,
        helpText: 'Job boards, agency fees, background checks, assessment tools',
        required: true,
      },
      {
        id: 'numHires',
        label: 'Number of Hires',
        type: 'number',
        defaultValue: 5,
        min: 1,
        step: 1,
        helpText: 'Total hires made during the measurement period',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'totalCost',
        expression: 'internalCosts + externalCosts',
        dependencies: ['internalCosts', 'externalCosts'],
      },
      {
        id: 'cph',
        expression: 'totalCost / numHires',
        dependencies: ['totalCost', 'numHires'],
      },
      {
        id: 'industryBenchmark',
        expression: '4700',
        dependencies: [],
      },
      {
        id: 'vsIndustry',
        expression: 'cph - industryBenchmark',
        dependencies: ['cph', 'industryBenchmark'],
      },
    ],
    outputs: [
      {
        id: 'out-cph',
        label: 'Cost Per Hire',
        formulaRef: 'cph',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
      {
        id: 'out-totalCost',
        label: 'Total Hiring Cost',
        formulaRef: 'totalCost',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'out-vsIndustry',
        label: 'vs. Industry Avg ($4,700)',
        formulaRef: 'vsIndustry',
        format: 'currency',
        precision: 2,
      },
    ],
    guide: {
      whatIsIt:
        'Cost Per Hire (CPH) is a SHRM-standard metric that captures all recruiting expenditure divided by the number of new hires. It includes both internal costs (recruiter time, HR salaries, onboarding) and external costs (job boards, agency fees, assessments, background checks). The SHRM/ANSI benchmark for average CPH across all industries is approximately $4,700, though technical and executive roles can run $20,000 to $50,000+.',
      howToUse:
        'Tally all internal and external recruiting costs for a period (month, quarter, or year), enter the total spend in each category, and enter the number of hires made in that period. A negative vs. industry figure means your CPH is below the benchmark — favourable. A positive figure indicates you are spending more per hire than average.',
      exampleScenario:
        'A startup spent $5,000 on internal costs (recruiter time) and $3,000 on job boards and background checks to make 5 hires. CPH = $8,000 / 5 = $1,600 — well below the $4,700 industry average. As the company scales and begins hiring for specialised roles, this figure will rise and should be tracked quarterly.',
      proTip:
        'CPH alone does not indicate hiring quality. Pair it with Quality of Hire (performance ratings at 90 days) and Time to Fill. A very low CPH with high turnover at 6 months often means cutting corners on assessment — costing far more in the long run. SHRM recommends tracking CPH by role level: hourly, professional, and executive.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 36. Billable Hours Utilisation Rate
  // =========================================================================
  {
    id: 'billable-hours',
    slug: 'billable-hours',
    title: 'Billable Hours Utilisation Rate',
    description:
      'Track what percentage of your working hours are billed to clients, monitor non-billable time, and compare against your target utilisation rate.',
    icon: '⏰',
    category: 'hr',
    subcategory: 'payroll',
    tags: ['billable hours', 'utilisation', 'utilization', 'consulting', 'freelance', 'time tracking', 'productivity'],
    inputs: [
      {
        id: 'billableHours',
        label: 'Billable Hours',
        type: 'number',
        defaultValue: 32,
        min: 0,
        step: 0.5,
        helpText: 'Hours billed to clients in the period',
        required: true,
      },
      {
        id: 'totalHours',
        label: 'Total Hours Worked',
        type: 'number',
        defaultValue: 40,
        min: 1,
        step: 0.5,
        helpText: 'Total hours worked in the period (billable + non-billable)',
        required: true,
      },
      {
        id: 'targetRate',
        label: 'Target Utilisation Rate (%)',
        type: 'number',
        defaultValue: 80,
        min: 0,
        max: 100,
        step: 1,
        helpText: 'Your target utilisation rate (consulting firms typically target 70-85%)',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'utilizationRate',
        expression: '(billableHours / totalHours) * 100',
        dependencies: ['billableHours', 'totalHours'],
      },
      {
        id: 'nonBillableHours',
        expression: 'totalHours - billableHours',
        dependencies: ['totalHours', 'billableHours'],
      },
      {
        id: 'vsTarget',
        expression: 'utilizationRate - targetRate',
        dependencies: ['utilizationRate', 'targetRate'],
      },
      {
        id: 'revenueOpportunity',
        expression: 'nonBillableHours * 100',
        dependencies: ['nonBillableHours'],
      },
    ],
    outputs: [
      {
        id: 'out-utilizationRate',
        label: 'Utilisation Rate',
        formulaRef: 'utilizationRate',
        format: 'number',
        precision: 1,
        suffix: '%',
        highlight: true,
      },
      {
        id: 'out-nonBillableHours',
        label: 'Non-Billable Hours',
        formulaRef: 'nonBillableHours',
        format: 'number',
        precision: 1,
        suffix: ' hrs',
      },
      {
        id: 'out-vsTarget',
        label: 'vs. Target',
        formulaRef: 'vsTarget',
        format: 'number',
        precision: 1,
        suffix: '%',
      },
    ],
    guide: {
      whatIsIt:
        'Billable utilisation rate is the percentage of working hours that are directly billed to clients. It is a core KPI for consulting firms, law firms, agencies, and freelancers. A rate of 80% means 80% of hours are generating revenue; the remaining 20% are spent on business development, admin, training, and internal work. Most professional services firms target 70-85% — higher is not always better, as zero non-billable time means no investment in growth or skills.',
      howToUse:
        'Enter your billable hours and total hours worked for any period (daily, weekly, monthly). Set your personal or firm utilisation target. The calculator shows your actual rate, how many hours are non-billable, and whether you are above or below target. A positive vs. Target value is favourable.',
      exampleScenario:
        'A consultant worked 40 hours this week and billed 32 to clients. Utilisation = 80% — exactly at target. The 8 non-billable hours were split between a proposal, team meetings, and training. If the firm blended rate is $100/hour, those 8 hours represent $800 of non-revenue time that week.',
      proTip:
        'Track utilisation monthly, not just weekly, to smooth out project lull weeks. If you consistently fall below your target, audit non-billable time: admin tasks may be automatable, and internal meetings may be reduceable. If you consistently exceed 90%, you risk burnout and should explore raising rates or adding capacity.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 37. Shift Work Overtime Calculator
  // =========================================================================
  {
    id: 'shift-overtime',
    slug: 'shift-overtime',
    title: 'Shift Work Overtime Calculator',
    description:
      'Calculate weekly gross pay including overtime for hourly workers, with support for US standard 1.5x, double-time, and custom overtime multipliers.',
    icon: '🕐',
    category: 'hr',
    subcategory: 'payroll',
    tags: ['overtime', 'shift', 'payroll', 'hourly', 'pay', 'flsa', 'wages', 'time and a half'],
    inputs: [
      {
        id: 'regularHours',
        label: 'Hours Worked This Week',
        type: 'number',
        defaultValue: 45,
        min: 0,
        max: 168,
        step: 0.5,
        helpText: 'Total hours worked in the pay week, including any overtime',
        required: true,
      },
      {
        id: 'hourlyRate',
        label: 'Hourly Pay Rate (USD)',
        type: 'number',
        defaultValue: 25,
        min: 0,
        step: 0.25,
        helpText: 'Employee base hourly wage',
        required: true,
      },
      {
        id: 'otMultiplier',
        label: 'Overtime Multiplier',
        type: 'select',
        options: [
          { label: '1.5x (US Standard / FLSA)', value: '1.5' },
          { label: '2.0x (Double Time)', value: '2.0' },
          { label: '1.25x (Some Contracts)', value: '1.25' },
        ],
        defaultValue: '1.5',
        helpText: 'Select the overtime rate applicable to this employee',
      },
      {
        id: 'regularThreshold',
        label: 'Regular Hours Threshold',
        type: 'number',
        defaultValue: 40,
        min: 1,
        max: 60,
        step: 1,
        helpText: 'Hours before overtime kicks in. US federal standard is 40 hrs/week.',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'overtimeHours',
        expression: 'max(0, regularHours - regularThreshold)',
        dependencies: ['regularHours', 'regularThreshold'],
      },
      {
        id: 'standardHours',
        expression: 'min(regularHours, regularThreshold)',
        dependencies: ['regularHours', 'regularThreshold'],
      },
      {
        id: 'regularPay',
        expression: 'standardHours * hourlyRate',
        dependencies: ['standardHours', 'hourlyRate'],
      },
      {
        id: 'overtimePay',
        expression: 'overtimeHours * hourlyRate * otMultiplier',
        dependencies: ['overtimeHours', 'hourlyRate', 'otMultiplier'],
      },
      {
        id: 'totalPay',
        expression: 'regularPay + overtimePay',
        dependencies: ['regularPay', 'overtimePay'],
      },
      {
        id: 'effectiveRate',
        expression: 'totalPay / regularHours',
        dependencies: ['totalPay', 'regularHours'],
      },
    ],
    outputs: [
      {
        id: 'out-totalPay',
        label: 'Total Weekly Pay',
        formulaRef: 'totalPay',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
      {
        id: 'out-overtimePay',
        label: 'Overtime Pay',
        formulaRef: 'overtimePay',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'out-overtimeHours',
        label: 'Overtime Hours',
        formulaRef: 'overtimeHours',
        format: 'number',
        precision: 1,
        suffix: ' hrs',
      },
      {
        id: 'out-effectiveRate',
        label: 'Effective Hourly Rate',
        formulaRef: 'effectiveRate',
        format: 'currency',
        precision: 2,
      },
    ],
    guide: {
      whatIsIt:
        'Under the US Fair Labor Standards Act (FLSA), non-exempt employees must be paid at least 1.5x their regular rate for all hours worked beyond 40 in a workweek. This calculator splits total hours into regular and overtime, applies the chosen multiplier, and shows total gross pay and an effective hourly rate. Some states (CA, CO) have daily overtime rules (OT after 8 hrs/day) that this calculator does not cover — it is a weekly calculator only.',
      howToUse:
        'Enter the employee total hours worked this week, their base hourly rate, and the overtime multiplier (1.5x is FLSA standard). Adjust the regular-hours threshold if your contract or state law differs from 40 hours. The calculator splits hours automatically and computes gross pay.',
      exampleScenario:
        'An employee works 45 hours at $25/hour with a 1.5x overtime rate. Regular pay: 40 x $25 = $1,000. Overtime pay: 5 x $25 x 1.5 = $187.50. Total: $1,187.50. Effective hourly rate = $1,187.50 / 45 = $26.39.',
      proTip:
        'If your employees regularly work overtime, model the annual cost of hiring an additional part-time employee versus the overtime premium. Persistent overtime often signals understaffing and can lead to burnout — the marginal cost of a new hire may be less than sustained overtime premiums plus turnover costs.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 38. Freelance Hourly Rate Calculator
  // =========================================================================
  {
    id: 'freelance-rate',
    slug: 'freelance-rate',
    title: 'Freelance Hourly Rate Calculator',
    description:
      'Calculate the minimum hourly rate you must charge to cover your desired salary, business expenses, and taxes — plus a recommended market-rate buffer.',
    icon: '💼',
    category: 'hr',
    subcategory: 'payroll',
    tags: ['freelance', 'hourly rate', 'self-employed', 'consulting', 'rate setting', 'tax', 'income'],
    inputs: [
      {
        id: 'desiredSalary',
        label: 'Desired Annual Take-Home (USD)',
        type: 'number',
        defaultValue: 80000,
        min: 0,
        step: 1000,
        helpText: 'Your target net income after taxes and expenses',
        required: true,
      },
      {
        id: 'businessExpenses',
        label: 'Annual Business Expenses (USD)',
        type: 'number',
        defaultValue: 10000,
        min: 0,
        step: 500,
        helpText: 'Software subscriptions, equipment, insurance, office, professional development',
        required: true,
      },
      {
        id: 'taxRate',
        label: 'Combined Tax Rate (%)',
        type: 'number',
        defaultValue: 30,
        min: 0,
        max: 75,
        step: 1,
        helpText: 'Self-employment tax (~15%) + income tax bracket. US freelancers: typically 25-40%.',
        required: true,
      },
      {
        id: 'billableHoursPerWeek',
        label: 'Billable Hours per Week',
        type: 'number',
        defaultValue: 30,
        min: 1,
        max: 60,
        step: 1,
        helpText: 'Realistic billable hours — not 40. Include admin, sales, and networking time.',
        required: true,
      },
      {
        id: 'vacationWeeks',
        label: 'Vacation / Off Weeks per Year',
        type: 'number',
        defaultValue: 3,
        min: 0,
        max: 52,
        step: 1,
        helpText: 'Weeks you will not be earning (vacation, sick leave, holidays)',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'annualWorkWeeks',
        expression: '52 - vacationWeeks',
        dependencies: ['vacationWeeks'],
      },
      {
        id: 'annualBillableHours',
        expression: 'billableHoursPerWeek * annualWorkWeeks',
        dependencies: ['billableHoursPerWeek', 'annualWorkWeeks'],
      },
      {
        id: 'grossNeeded',
        expression: '(desiredSalary + businessExpenses) / (1 - taxRate / 100)',
        dependencies: ['desiredSalary', 'businessExpenses', 'taxRate'],
      },
      {
        id: 'minHourlyRate',
        expression: 'grossNeeded / annualBillableHours',
        dependencies: ['grossNeeded', 'annualBillableHours'],
      },
      {
        id: 'marketRate',
        expression: 'minHourlyRate * 1.2',
        dependencies: ['minHourlyRate'],
      },
    ],
    outputs: [
      {
        id: 'out-minHourlyRate',
        label: 'Minimum Hourly Rate',
        formulaRef: 'minHourlyRate',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
      {
        id: 'out-marketRate',
        label: 'Recommended Rate (+20% buffer)',
        formulaRef: 'marketRate',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'out-grossNeeded',
        label: 'Gross Revenue Needed',
        formulaRef: 'grossNeeded',
        format: 'currency',
        precision: 0,
      },
      {
        id: 'out-annualBillableHours',
        label: 'Annual Billable Hours',
        formulaRef: 'annualBillableHours',
        format: 'number',
        precision: 0,
        suffix: ' hrs',
      },
    ],
    guide: {
      whatIsIt:
        'Unlike a salaried employee, a freelancer must cover their own taxes, benefits, business expenses, and the inherent risk of non-billable time. This calculator works backwards from your desired take-home income to a minimum hourly rate that makes freelancing financially viable, then adds a 20% buffer to account for market positioning, project delays, and unexpected costs.',
      howToUse:
        'Enter your target annual take-home, estimated business expenses, your combined tax rate (self-employment + income tax), realistic weekly billable hours, and vacation weeks. The calculator converts net desire to required gross revenue and divides by your actual billable capacity to produce a floor rate. The recommended rate adds 20% headroom.',
      exampleScenario:
        'Target take-home: $80,000. Expenses: $10,000. Tax rate: 30%. Gross needed: ($80K + $10K) / 0.70 = $128,571. Billable hours: 30 hrs/week x (52 - 3 weeks) = 1,470 hours/year. Minimum rate: $128,571 / 1,470 = $87.46/hr. Recommended rate: $87.46 x 1.2 = $104.95/hr.',
      proTip:
        'Most new freelancers underestimate non-billable hours. If you are replacing a full-time job, assume only 50-60% of your hours will be billable in year one as you spend time on business development. Use the recommended rate (not the minimum) when quoting — clients rarely negotiate up, only down.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 39. Pomodoro / Timeboxing Planner
  // =========================================================================
  {
    id: 'pomodoro-planner',
    slug: 'pomodoro-planner',
    title: 'Pomodoro & Timeboxing Planner',
    description:
      'Plan your Pomodoro session schedule for any block of available time, customising work intervals, short breaks, long breaks, and cycle length.',
    icon: '🍅',
    category: 'hr',
    subcategory: 'hr-productivity',
    tags: ['pomodoro', 'time management', 'focus', 'productivity', 'timeboxing', 'breaks', 'deep work'],
    inputs: [
      {
        id: 'totalAvailableMinutes',
        label: 'Available Time (minutes)',
        type: 'number',
        defaultValue: 240,
        min: 10,
        step: 5,
        helpText: 'Total working time available in minutes (e.g. 240 = 4 hours)',
        required: true,
      },
      {
        id: 'workInterval',
        label: 'Focus Block Length (minutes)',
        type: 'number',
        defaultValue: 25,
        min: 5,
        max: 90,
        step: 5,
        helpText: 'Classic Pomodoro is 25 minutes; deep-work practitioners often use 50-90 minutes',
        required: true,
      },
      {
        id: 'shortBreak',
        label: 'Short Break (minutes)',
        type: 'number',
        defaultValue: 5,
        min: 1,
        max: 30,
        step: 1,
        helpText: 'Break between focus blocks within a cycle',
        required: true,
      },
      {
        id: 'longBreak',
        label: 'Long Break (minutes)',
        type: 'number',
        defaultValue: 15,
        min: 5,
        max: 60,
        step: 5,
        helpText: 'Break at the end of a full cycle',
        required: true,
      },
      {
        id: 'longBreakAfter',
        label: 'Sessions per Cycle (before long break)',
        type: 'number',
        defaultValue: 4,
        min: 2,
        max: 8,
        step: 1,
        helpText: 'Classic Pomodoro cycles every 4 sessions',
        required: true,
      },
    ],
    formulas: [
      {
        // Cycle = (work x N) + (shortBreak x (N-1)) + longBreak
        id: 'cycleLength',
        expression: 'workInterval * longBreakAfter + shortBreak * (longBreakAfter - 1) + longBreak',
        dependencies: ['workInterval', 'longBreakAfter', 'shortBreak', 'longBreak'],
      },
      {
        id: 'fullCycles',
        expression: 'floor(totalAvailableMinutes / cycleLength)',
        dependencies: ['totalAvailableMinutes', 'cycleLength'],
      },
      {
        id: 'remainingMinutes',
        expression: 'totalAvailableMinutes - fullCycles * cycleLength',
        dependencies: ['totalAvailableMinutes', 'fullCycles', 'cycleLength'],
      },
      {
        id: 'extraSessions',
        expression: 'floor(remainingMinutes / (workInterval + shortBreak))',
        dependencies: ['remainingMinutes', 'workInterval', 'shortBreak'],
      },
      {
        id: 'totalSessions',
        expression: 'fullCycles * longBreakAfter + extraSessions',
        dependencies: ['fullCycles', 'longBreakAfter', 'extraSessions'],
      },
      {
        id: 'totalFocusMinutes',
        expression: 'totalSessions * workInterval',
        dependencies: ['totalSessions', 'workInterval'],
      },
      {
        id: 'totalBreakMinutes',
        expression: 'totalAvailableMinutes - totalFocusMinutes',
        dependencies: ['totalAvailableMinutes', 'totalFocusMinutes'],
      },
    ],
    outputs: [
      {
        id: 'out-totalSessions',
        label: 'Focus Sessions',
        formulaRef: 'totalSessions',
        format: 'number',
        precision: 0,
        highlight: true,
      },
      {
        id: 'out-totalFocusMinutes',
        label: 'Total Focus Time',
        formulaRef: 'totalFocusMinutes',
        format: 'number',
        precision: 0,
        suffix: ' min',
      },
      {
        id: 'out-fullCycles',
        label: 'Complete Pomodoro Cycles',
        formulaRef: 'fullCycles',
        format: 'number',
        precision: 0,
      },
      {
        id: 'out-totalBreakMinutes',
        label: 'Total Break Time',
        formulaRef: 'totalBreakMinutes',
        format: 'number',
        precision: 0,
        suffix: ' min',
      },
    ],
    guide: {
      whatIsIt:
        'The Pomodoro Technique structures work into timed focus blocks separated by short breaks, with a longer break after every N cycles. The classic rhythm is 25 minutes work / 5 minutes break / repeat 4 times / 15-minute long break. Research on cognitive performance supports taking regular breaks to sustain attention — the specific interval is less important than the consistency of the rhythm.',
      howToUse:
        'Enter your total available working time, your preferred focus block and break durations, and how many sessions make up one cycle before a long break. The planner calculates how many complete cycles and extra sessions fit within your time, and shows total focus versus break minutes.',
      exampleScenario:
        'A 4-hour (240-minute) work block with classic 25/5/15 settings: each cycle = 25 x 4 + 5 x 3 + 15 = 130 minutes. Full cycles = floor(240 / 130) = 1 cycle. Remaining = 110 minutes. Extra sessions = floor(110 / 30) = 3. Total sessions = 4 + 3 = 7. Total focus time = 7 x 25 = 175 minutes.',
      proTip:
        'Experiment with longer focus blocks (50-90 minutes) if you do deep, flow-state work like writing or coding. Research suggests that some professionals achieve far more output with two 90-minute deep sessions than six 25-minute Pomodoros. The best interval is the one you will actually follow consistently.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 40. Productivity Loss Calculator
  // =========================================================================
  {
    id: 'productivity-loss',
    slug: 'productivity-loss',
    title: 'Productivity Loss Calculator',
    description:
      'Quantify the annual salary cost of unproductive time across your organisation, and calculate per-employee loss and daily waste.',
    icon: '📊',
    category: 'hr',
    subcategory: 'hr-productivity',
    tags: ['productivity', 'loss', 'efficiency', 'payroll', 'hr', 'cost', 'disengagement', 'waste'],
    inputs: [
      {
        id: 'numEmployees',
        label: 'Number of Employees',
        type: 'number',
        defaultValue: 50,
        min: 1,
        step: 1,
        helpText: 'Total headcount in the team or organisation',
        required: true,
      },
      {
        id: 'avgAnnualSalary',
        label: 'Average Annual Salary (USD)',
        type: 'number',
        defaultValue: 60000,
        min: 0,
        step: 1000,
        helpText: 'Average total compensation per employee',
        required: true,
      },
      {
        id: 'productivityLossPercent',
        label: 'Estimated Productivity Loss (%)',
        type: 'number',
        defaultValue: 20,
        min: 0,
        max: 100,
        step: 1,
        helpText: 'Percentage of work time spent unproductively. Research suggests 20-30% for average office workers.',
        required: true,
      },
      {
        id: 'workingDaysPerYear',
        label: 'Working Days per Year',
        type: 'number',
        defaultValue: 250,
        min: 100,
        max: 365,
        step: 1,
        helpText: 'Typical US: 250 days (52 weeks x 5 days - 10 public holidays)',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'totalPayroll',
        expression: 'numEmployees * avgAnnualSalary',
        dependencies: ['numEmployees', 'avgAnnualSalary'],
      },
      {
        id: 'annualLoss',
        expression: 'totalPayroll * productivityLossPercent / 100',
        dependencies: ['totalPayroll', 'productivityLossPercent'],
      },
      {
        id: 'dailyLoss',
        expression: 'annualLoss / workingDaysPerYear',
        dependencies: ['annualLoss', 'workingDaysPerYear'],
      },
      {
        id: 'perEmployeeAnnual',
        expression: 'avgAnnualSalary * productivityLossPercent / 100',
        dependencies: ['avgAnnualSalary', 'productivityLossPercent'],
      },
      {
        id: 'lostDaysPerEmployee',
        expression: 'workingDaysPerYear * productivityLossPercent / 100',
        dependencies: ['workingDaysPerYear', 'productivityLossPercent'],
      },
    ],
    outputs: [
      {
        id: 'out-annualLoss',
        label: 'Annual Productivity Loss',
        formulaRef: 'annualLoss',
        format: 'currency',
        precision: 0,
        highlight: true,
      },
      {
        id: 'out-dailyLoss',
        label: 'Daily Loss',
        formulaRef: 'dailyLoss',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'out-perEmployeeAnnual',
        label: 'Per Employee Annual Loss',
        formulaRef: 'perEmployeeAnnual',
        format: 'currency',
        precision: 0,
      },
      {
        id: 'out-lostDaysPerEmployee',
        label: 'Lost Days per Employee',
        formulaRef: 'lostDaysPerEmployee',
        format: 'number',
        precision: 1,
        suffix: ' days/year',
      },
    ],
    guide: {
      whatIsIt:
        'Productivity loss measures the salary cost of time employees spend on non-productive activities — social media, excessive meetings, context switching, disengagement, and unnecessary admin. Multiple studies estimate that the average office worker is productive for only 60-70% of their working day, implying a 20-30% productivity loss rate. At scale, this translates to enormous recoverable payroll spend.',
      howToUse:
        'Enter your headcount, average salary, and an estimated productivity loss percentage. If you have data from time-tracking tools, use that; otherwise, 20% is a conservative starting benchmark. The calculator shows the total annual payroll being lost to unproductive time, the daily burn rate, and the per-employee impact.',
      exampleScenario:
        'A company with 50 employees averaging $60,000/year and a 20% productivity loss rate is effectively losing $600,000 annually to unproductive time — $12,000 per year per employee, or $2,400 per month across the organisation. Even a 5% improvement in productivity would recover $150,000/year.',
      proTip:
        'Use this calculator to build a business case for productivity interventions such as async communication tools, meeting audits, or focus-time policies. A 5% productivity gain for 50 employees at $60K/year is worth $150,000 — far more than the cost of most productivity software. Pair the output with an ROI calculation when presenting to leadership.',
    },
    metadata: { version: '1.0.0' },
  },
];
