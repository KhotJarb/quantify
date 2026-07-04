// ---------------------------------------------------------------------------
// Quantify � Cloud & DevOps Calculators
// ---------------------------------------------------------------------------
// 10 calculators covering cloud costs, API limits, SLA, MTBF, sharding,
// token vesting, algorithm complexity, mining, server sizing, and code review.
// ---------------------------------------------------------------------------

import type { CalculatorSchema } from '@/types/calculator';

export const cloudDevOpsCalculators: CalculatorSchema[] = [
  // =========================================================================
  // 1. Cloud Server Cost Estimator
  // =========================================================================
  {
    id: 'cloud-cost-estimator',
    slug: 'cloud-cost-estimator',
    title: 'Cloud Server Cost Estimator',
    description:
      'Estimate monthly and annual cloud infrastructure costs including compute, storage, and data transfer.',
    icon: '☁',
    category: 'tech',
    subcategory: 'cloud',
    tags: ['cloud', 'aws', 'gcp', 'azure', 'cost', 'infrastructure', 'compute', 'storage'],
    inputs: [
      {
        id: 'instances',
        label: 'Number of Instances',
        type: 'number',
        defaultValue: 5,
        min: 1,
        step: 1,
        placeholder: 'e.g. 5',
        helpText: 'Total number of virtual machine instances running.',
        required: true,
      },
      {
        id: 'hoursPerMonth',
        label: 'Hours per Month',
        type: 'number',
        defaultValue: 730,
        min: 1,
        max: 744,
        step: 1,
        placeholder: 'e.g. 730',
        helpText: 'Average hours per month each instance runs (730 = ~24/7).',
        required: true,
      },
      {
        id: 'hourlyCostPerInstance',
        label: 'Hourly Cost per Instance ($)',
        type: 'number',
        defaultValue: 0.10,
        min: 0,
        step: 0.001,
        placeholder: 'e.g. 0.10',
        helpText: 'On-demand hourly rate per instance. Check your cloud provider pricing.',
        required: true,
      },
      {
        id: 'storageGB',
        label: 'Storage (GB)',
        type: 'number',
        defaultValue: 500,
        min: 0,
        step: 10,
        placeholder: 'e.g. 500',
        helpText: 'Total persistent storage provisioned in GB (EBS, Persistent Disk, etc.).',
        required: true,
      },
      {
        id: 'storageCostPerGB',
        label: 'Storage Cost ($/GB/month)',
        type: 'number',
        defaultValue: 0.023,
        min: 0,
        step: 0.001,
        placeholder: 'e.g. 0.023',
        helpText: 'Cost per GB per month. AWS EBS gp3 ~ $0.08/GB, S3 ~ $0.023/GB.',
        required: true,
      },
      {
        id: 'dataTransferGB',
        label: 'Outbound Transfer (GB)',
        type: 'number',
        defaultValue: 100,
        min: 0,
        step: 10,
        placeholder: 'e.g. 100',
        helpText: 'Monthly outbound data transfer in GB (egress costs apply on most clouds).',
        required: true,
      },
      {
        id: 'transferCostPerGB',
        label: 'Transfer Cost ($/GB)',
        type: 'number',
        defaultValue: 0.09,
        min: 0,
        step: 0.001,
        placeholder: 'e.g. 0.09',
        helpText: 'Cost per GB of outbound data transfer. AWS/GCP ~$0.09/GB.',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'computeCost',
        expression: 'instances * hoursPerMonth * hourlyCostPerInstance',
        dependencies: ['instances', 'hoursPerMonth', 'hourlyCostPerInstance'],
      },
      {
        id: 'storageCost',
        expression: 'storageGB * storageCostPerGB',
        dependencies: ['storageGB', 'storageCostPerGB'],
      },
      {
        id: 'transferCost',
        expression: 'dataTransferGB * transferCostPerGB',
        dependencies: ['dataTransferGB', 'transferCostPerGB'],
      },
      {
        id: 'totalMonthly',
        expression: 'computeCost + storageCost + transferCost',
        dependencies: ['computeCost', 'storageCost', 'transferCost'],
      },
      {
        id: 'totalAnnual',
        expression: 'totalMonthly * 12',
        dependencies: ['totalMonthly'],
      },
    ],
    outputs: [
      {
        id: 'computeCost',
        label: 'Compute Cost/Month',
        formulaRef: 'computeCost',
        prefix: '$',
        precision: 2,
      },
      {
        id: 'storageCost',
        label: 'Storage Cost/Month',
        formulaRef: 'storageCost',
        prefix: '$',
        precision: 2,
      },
      {
        id: 'totalMonthly',
        label: 'Total Monthly Cost',
        formulaRef: 'totalMonthly',
        prefix: '$',
        precision: 2,
        highlight: true,
      },
      {
        id: 'totalAnnual',
        label: 'Annual Cost',
        formulaRef: 'totalAnnual',
        prefix: '$',
        precision: 0,
      },
    ],
    guide: {
      whatIsIt:
        'For informational/educational purposes only. Cloud infrastructure costs are made up of compute (virtual machines), storage, and data transfer fees. This calculator gives a quick estimate before using a cloud provider pricing calculator.',
      howToUse:
        'Enter the number of instances and how many hours per month they run, along with the hourly cost. Then add your storage footprint and egress data transfer. The calculator breaks down each cost component and totals them monthly and annually.',
      exampleScenario:
        '5 instances at $0.10/hr running 730 hours = $365 compute. 500 GB storage at $0.023 = $11.50. 100 GB egress at $0.09 = $9. Total monthly = $385.50, annual = $4,626.',
      proTip:
        'Reserved instances or committed-use discounts can cut compute costs by 30-60% for steady workloads. Spot/preemptible instances offer up to 80% savings for fault-tolerant batch jobs. Always check if data stays within a region to avoid egress fees.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 2. API Rate Limit & Throttling Calculator
  // =========================================================================
  {
    id: 'api-rate-limit-calculator',
    slug: 'api-rate-limit-calculator',
    title: 'API Rate Limit & Throttling Calculator',
    description:
      'Calculate API rate limits, burst capacity, daily throughput capacity, and utilization percentage for API design and capacity planning.',
    icon: '🔄',
    category: 'tech',
    subcategory: 'cloud',
    tags: ['API', 'rate limit', 'throttling', 'requests', 'throughput', 'capacity', 'backend'],
    inputs: [
      {
        id: 'ratePerMinute',
        label: 'Rate Limit (requests/minute)',
        type: 'number',
        defaultValue: 60,
        min: 1,
        step: 1,
        placeholder: 'e.g. 60',
        helpText: 'Sustained request rate limit per minute set on your API.',
        required: true,
      },
      {
        id: 'burstMultiplier',
        label: 'Burst Multiplier',
        type: 'number',
        defaultValue: 2,
        min: 1,
        step: 0.1,
        placeholder: 'e.g. 2',
        helpText: 'How many times the sustained rate clients can burst for short periods.',
        required: true,
      },
      {
        id: 'dailyRequests',
        label: 'Expected Daily Requests',
        type: 'number',
        defaultValue: 100000,
        min: 0,
        step: 1000,
        placeholder: 'e.g. 100000',
        helpText: 'Total number of API requests you expect per day.',
        required: true,
      },
      {
        id: 'responseTimeMs',
        label: 'Avg Response Time (ms)',
        type: 'number',
        defaultValue: 200,
        min: 1,
        step: 10,
        placeholder: 'e.g. 200',
        helpText: 'Average API response time in milliseconds.',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'ratePerSecond',
        expression: 'ratePerMinute / 60',
        dependencies: ['ratePerMinute'],
      },
      {
        id: 'burstCapacity',
        expression: 'ratePerSecond * burstMultiplier',
        dependencies: ['ratePerSecond', 'burstMultiplier'],
      },
      {
        id: 'maxDailyCapacity',
        expression: 'ratePerMinute * 60 * 24',
        dependencies: ['ratePerMinute'],
      },
      {
        id: 'utilizationPct',
        expression: 'dailyRequests / maxDailyCapacity * 100',
        dependencies: ['dailyRequests', 'maxDailyCapacity'],
      },
      {
        id: 'concurrentConnections',
        expression: 'ratePerSecond * responseTimeMs / 1000',
        dependencies: ['ratePerSecond', 'responseTimeMs'],
      },
    ],
    outputs: [
      {
        id: 'ratePerSecond',
        label: 'Rate per Second',
        formulaRef: 'ratePerSecond',
        suffix: ' req/s',
        precision: 2,
      },
      {
        id: 'maxDailyCapacity',
        label: 'Max Daily Capacity',
        formulaRef: 'maxDailyCapacity',
        precision: 0,
      },
      {
        id: 'utilizationPct',
        label: 'API Utilization',
        formulaRef: 'utilizationPct',
        suffix: '%',
        precision: 1,
        highlight: true,
      },
      {
        id: 'concurrentConnections',
        label: 'Concurrent Connections',
        formulaRef: 'concurrentConnections',
        precision: 1,
      },
    ],
    guide: {
      whatIsIt:
        'For informational/educational purposes only. API rate limiting controls the number of requests a client can make in a given time period. Proper rate limit design prevents abuse, ensures fair use, and protects backend services from overload.',
      howToUse:
        "Enter your sustained rate limit (requests per minute), burst multiplier, expected daily request volume, and average response time. The calculator shows your rate per second, total daily capacity, utilization, and estimated concurrent connections (using Little's Law).",
      exampleScenario:
        '60 req/min rate limit, 2x burst = 2 req/s burst. Max daily capacity = 86,400 requests. If you expect 100,000 requests/day, utilization = 115.7%. You need to increase the rate limit or optimize request patterns.',
      proTip:
        'Keep API utilization below 70-80% to handle traffic spikes gracefully. Implement exponential backoff with jitter in clients to avoid thundering herd problems when rate limits are hit. Token bucket and sliding window algorithms provide smoother rate limiting than fixed windows.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 3. SLA Downtime Credit Calculator
  // =========================================================================
  {
    id: 'sla-downtime-credit-calculator',
    slug: 'sla-downtime-credit-calculator',
    title: 'SLA Downtime Credit Calculator',
    description:
      'Calculate SLA-allowed downtime, actual downtime, excess downtime, and the estimated service credit owed.',
    icon: '📡',
    category: 'tech',
    subcategory: 'cloud',
    tags: ['SLA', 'uptime', 'downtime', 'service credit', 'cloud', 'reliability', 'availability'],
    inputs: [
      {
        id: 'slaUptimePct',
        label: 'SLA Uptime %',
        type: 'number',
        defaultValue: 99.9,
        min: 90,
        max: 100,
        step: 0.01,
        placeholder: 'e.g. 99.9',
        helpText: 'The uptime percentage guaranteed by your SLA (e.g., 99.9% = three nines).',
        required: true,
      },
      {
        id: 'periodHours',
        label: 'Billing Period (hours)',
        type: 'number',
        defaultValue: 720,
        min: 1,
        step: 1,
        placeholder: 'e.g. 720',
        helpText: 'Hours in the billing period (720 = 30-day month, 744 = 31-day month).',
        required: true,
      },
      {
        id: 'actualUptimePct',
        label: 'Actual Uptime %',
        type: 'number',
        defaultValue: 99.5,
        min: 0,
        max: 100,
        step: 0.01,
        placeholder: 'e.g. 99.5',
        helpText: 'The actual uptime you experienced during the billing period.',
        required: true,
      },
      {
        id: 'monthlyBill',
        label: 'Monthly Bill ($)',
        type: 'number',
        defaultValue: 1000,
        min: 0,
        step: 10,
        placeholder: 'e.g. 1000',
        helpText: 'Your total invoice for the billing period.',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'allowedDowntimeHr',
        expression: 'periodHours * (1 - slaUptimePct / 100)',
        dependencies: ['periodHours', 'slaUptimePct'],
      },
      {
        id: 'actualDowntimeHr',
        expression: 'periodHours * (1 - actualUptimePct / 100)',
        dependencies: ['periodHours', 'actualUptimePct'],
      },
      {
        id: 'excessDowntime',
        expression: 'max(0, actualDowntimeHr - allowedDowntimeHr)',
        dependencies: ['actualDowntimeHr', 'allowedDowntimeHr'],
      },
      {
        id: 'creditPct',
        expression: 'min(100, excessDowntime / periodHours * 1000)',
        dependencies: ['excessDowntime', 'periodHours'],
      },
      {
        id: 'creditAmount',
        expression: 'monthlyBill * creditPct / 100',
        dependencies: ['monthlyBill', 'creditPct'],
      },
    ],
    outputs: [
      {
        id: 'allowedDowntimeHr',
        label: 'SLA Allowed Downtime',
        formulaRef: 'allowedDowntimeHr',
        suffix: ' hrs',
        precision: 2,
      },
      {
        id: 'actualDowntimeHr',
        label: 'Actual Downtime',
        formulaRef: 'actualDowntimeHr',
        suffix: ' hrs',
        precision: 2,
      },
      {
        id: 'excessDowntime',
        label: 'Excess Downtime',
        formulaRef: 'excessDowntime',
        suffix: ' hrs',
        precision: 2,
      },
      {
        id: 'creditAmount',
        label: 'Estimated Credit',
        formulaRef: 'creditAmount',
        prefix: '$',
        precision: 2,
        highlight: true,
      },
    ],
    guide: {
      whatIsIt:
        'For informational/educational purposes only. Cloud providers offer SLAs guaranteeing a minimum uptime percentage. When actual uptime falls below the SLA, customers are typically entitled to service credits. This calculator estimates that credit.',
      howToUse:
        'Enter your SLA uptime percentage, billing period hours, actual uptime experienced, and monthly bill. The calculator computes allowed vs. actual downtime, excess downtime, and the credit amount based on a 10x penalty rate (i.e., 0.1% downtime = 1% credit).',
      exampleScenario:
        'SLA: 99.9% uptime over 720 hrs. Allowed downtime: 0.72 hrs. Actual uptime: 99.5% = 3.6 hrs downtime. Excess: 2.88 hrs. Credit % = 2.88/720 � 1000 = 4%. On a $1,000 bill, credit = $40.',
      proTip:
        'Always read the exact credit tiers in your SLA. AWS, Azure, and GCP have different credit percentages per tier (e.g., 25%, 50%, 100%). Some SLAs require you to proactively submit a credit request within a deadline after the incident.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 4. MTBF & System Availability Calculator
  // =========================================================================
  {
    id: 'mtbf-availability-calculator',
    slug: 'mtbf-availability-calculator',
    title: 'MTBF & System Availability Calculator',
    description:
      'Calculate Mean Time Between Failures (MTBF), system availability percentage, and expected annual downtime.',
    icon: '🛠',
    category: 'tech',
    subcategory: 'cloud',
    tags: ['MTBF', 'MTTR', 'availability', 'reliability', 'uptime', 'infrastructure', 'SRE'],
    inputs: [
      {
        id: 'totalOperatingHours',
        label: 'Total Operating Hours',
        type: 'number',
        defaultValue: 8760,
        min: 1,
        step: 100,
        placeholder: 'e.g. 8760',
        helpText: 'Total hours the system has been operational (8760 = 1 year).',
        required: true,
      },
      {
        id: 'numberOfFailures',
        label: 'Number of Failures',
        type: 'number',
        defaultValue: 3,
        min: 1,
        step: 1,
        placeholder: 'e.g. 3',
        helpText: 'Total number of failures/outages in the operating period.',
        required: true,
      },
      {
        id: 'avgRepairTimeHours',
        label: 'Avg Repair Time (MTTR, hours)',
        type: 'number',
        defaultValue: 4,
        min: 0,
        step: 0.5,
        placeholder: 'e.g. 4',
        helpText: 'Mean Time To Repair (MTTR) � average hours to restore service after each failure.',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'mtbf',
        expression: 'totalOperatingHours / numberOfFailures',
        dependencies: ['totalOperatingHours', 'numberOfFailures'],
      },
      {
        id: 'mttr',
        expression: 'avgRepairTimeHours',
        dependencies: ['avgRepairTimeHours'],
      },
      {
        id: 'availability',
        expression: 'mtbf / (mtbf + mttr) * 100',
        dependencies: ['mtbf', 'mttr'],
      },
      {
        id: 'downtimePerYear',
        expression: '8760 * (1 - availability / 100)',
        dependencies: ['availability'],
      },
    ],
    outputs: [
      {
        id: 'mtbf',
        label: 'Mean Time Between Failures',
        formulaRef: 'mtbf',
        suffix: ' hrs',
        precision: 1,
      },
      {
        id: 'availability',
        label: 'Availability',
        formulaRef: 'availability',
        suffix: '%',
        precision: 3,
        highlight: true,
      },
      {
        id: 'downtimePerYear',
        label: 'Expected Annual Downtime',
        formulaRef: 'downtimePerYear',
        suffix: ' hrs/year',
        precision: 1,
      },
    ],
    guide: {
      whatIsIt:
        'For informational/educational purposes only. MTBF (Mean Time Between Failures) measures the average time a system operates before a failure occurs. System availability is the percentage of time the system is operational, calculated from MTBF and MTTR.',
      howToUse:
        'Enter the total hours the system has operated, the number of failures during that period, and the average time to repair each failure. The calculator outputs MTBF, availability %, and expected annual downtime.',
      exampleScenario:
        'A server runs 8,760 hours/year with 3 failures and 4-hour average repair time. MTBF = 2,920 hrs. Availability = 2920 / (2920 + 4) � 100 = 99.863%. Expected annual downtime = 12 hours.',
      proTip:
        'To achieve four nines (99.99%) availability, you need MTBF/MTTR > 9,999. Redundancy (active-active clusters) improves system MTBF multiplicatively. Focus MTTR improvements on runbooks, automation, and on-call response processes.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 5. Database Shard Size Calculator
  // =========================================================================
  {
    id: 'database-shard-sizing',
    slug: 'database-shard-sizing',
    title: 'Database Shard Size Calculator',
    description:
      'Calculate the number of database shards required based on data growth projections, shard size limits, and replication factor.',
    icon: '🗃',
    category: 'tech',
    subcategory: 'cloud',
    tags: ['database', 'sharding', 'scalability', 'capacity planning', 'NoSQL', 'MongoDB', 'distributed'],
    inputs: [
      {
        id: 'totalDataGB',
        label: 'Total Data Size (GB)',
        type: 'number',
        defaultValue: 1000,
        min: 1,
        step: 50,
        placeholder: 'e.g. 1000',
        helpText: 'Current total data size in gigabytes.',
        required: true,
      },
      {
        id: 'shardSizeGB',
        label: 'Max Shard Size (GB)',
        type: 'number',
        defaultValue: 100,
        min: 1,
        step: 10,
        placeholder: 'e.g. 100',
        helpText: 'Maximum allowed data per shard. MongoDB recommends < 200 GB per shard.',
        required: true,
      },
      {
        id: 'growthRatePct',
        label: 'Annual Growth Rate %',
        type: 'number',
        defaultValue: 20,
        min: 0,
        max: 500,
        step: 1,
        placeholder: 'e.g. 20',
        helpText: 'Expected annual data growth percentage.',
        required: true,
      },
      {
        id: 'years',
        label: 'Planning Horizon (years)',
        type: 'number',
        defaultValue: 3,
        min: 1,
        max: 10,
        step: 1,
        placeholder: 'e.g. 3',
        helpText: 'Number of years to plan ahead for capacity.',
        required: true,
      },
      {
        id: 'replicationFactor',
        label: 'Replication Factor',
        type: 'number',
        defaultValue: 3,
        min: 1,
        max: 10,
        step: 1,
        placeholder: 'e.g. 3',
        helpText: 'Number of data copies for fault tolerance (MongoDB default = 3).',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'futureDataGB',
        expression: 'totalDataGB * pow(1 + growthRatePct / 100, years)',
        dependencies: ['totalDataGB', 'growthRatePct', 'years'],
      },
      {
        id: 'shardsNeeded',
        expression: 'ceil(futureDataGB / shardSizeGB)',
        dependencies: ['futureDataGB', 'shardSizeGB'],
      },
      {
        id: 'totalStorageWithReplication',
        expression: 'futureDataGB * replicationFactor',
        dependencies: ['futureDataGB', 'replicationFactor'],
      },
      {
        id: 'queriesPerShard',
        expression: '1 / shardsNeeded * 100',
        dependencies: ['shardsNeeded'],
      },
    ],
    outputs: [
      {
        id: 'futureDataGB',
        label: 'Projected Data Size',
        formulaRef: 'futureDataGB',
        suffix: ' GB',
        precision: 0,
      },
      {
        id: 'shardsNeeded',
        label: 'Shards Required',
        formulaRef: 'shardsNeeded',
        precision: 0,
        highlight: true,
      },
      {
        id: 'totalStorageWithReplication',
        label: 'Total Storage (with replication)',
        formulaRef: 'totalStorageWithReplication',
        suffix: ' GB',
        precision: 0,
      },
    ],
    guide: {
      whatIsIt:
        'For informational/educational purposes only. Database sharding horizontally partitions data across multiple nodes to scale beyond single-server limits. Planning shard count requires estimating future data size based on current size and growth rate.',
      howToUse:
        'Enter your current total data size, the maximum shard size your database supports, annual growth rate, planning horizon in years, and replication factor. The calculator projects future data size and the number of shards you will need.',
      exampleScenario:
        '1 TB current data, 20% annual growth, 3-year horizon: projected size = 1,728 GB. With 100 GB max shard size: 18 shards needed. With 3� replication: 5,184 GB total storage required.',
      proTip:
        'Choose a shard key with high cardinality and even write distribution to avoid hot shards. Plan for re-sharding by leaving 20-30% headroom per shard. Consider chunk migration overhead during peak hours when adding shards.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 6. Token Vesting Schedule Calculator
  // =========================================================================
  {
    id: 'token-vesting-schedule',
    slug: 'token-vesting-schedule',
    title: 'Token Vesting Schedule Calculator',
    description:
      'Calculate how many tokens have vested based on a cliff-and-linear vesting schedule for crypto/equity allocations.',
    icon: '🔒',
    category: 'crypto',
    subcategory: 'defi',
    tags: ['token', 'vesting', 'cliff', 'crypto', 'equity', 'DeFi', 'allocation', 'unlock'],
    inputs: [
      {
        id: 'totalTokens',
        label: 'Total Tokens Allocated',
        type: 'number',
        defaultValue: 1000000,
        min: 1,
        step: 10000,
        placeholder: 'e.g. 1000000',
        helpText: 'Total number of tokens in the vesting grant.',
        required: true,
      },
      {
        id: 'vestingMonths',
        label: 'Vesting Period (months)',
        type: 'number',
        defaultValue: 48,
        min: 1,
        step: 1,
        placeholder: 'e.g. 48',
        helpText: 'Total duration of the vesting schedule in months.',
        required: true,
      },
      {
        id: 'cliffMonths',
        label: 'Cliff Period (months)',
        type: 'number',
        defaultValue: 12,
        min: 0,
        step: 1,
        placeholder: 'e.g. 12',
        helpText: 'Months before any tokens vest. No tokens are unlocked until the cliff is reached.',
        required: true,
      },
      {
        id: 'monthsElapsed',
        label: 'Months Elapsed',
        type: 'number',
        defaultValue: 18,
        min: 0,
        step: 1,
        placeholder: 'e.g. 18',
        helpText: 'How many months have passed since the vesting start date.',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'postCliff',
        expression: 'monthsElapsed >= cliffMonths ? 1 : 0',
        dependencies: ['monthsElapsed', 'cliffMonths'],
      },
      {
        id: 'vestedFraction',
        expression: 'postCliff * min((monthsElapsed - cliffMonths) / max(vestingMonths - cliffMonths, 1), 1)',
        dependencies: ['postCliff', 'monthsElapsed', 'cliffMonths', 'vestingMonths'],
      },
      {
        id: 'vestedTokens',
        expression: 'postCliff * totalTokens * vestedFraction',
        dependencies: ['postCliff', 'totalTokens', 'vestedFraction'],
      },
      {
        id: 'unlockedPct',
        expression: 'vestedFraction * 100',
        dependencies: ['vestedFraction'],
      },
      {
        id: 'remaining',
        expression: 'totalTokens - vestedTokens',
        dependencies: ['totalTokens', 'vestedTokens'],
      },
    ],
    outputs: [
      {
        id: 'vestedTokens',
        label: 'Tokens Vested',
        formulaRef: 'vestedTokens',
        precision: 0,
        highlight: true,
      },
      {
        id: 'unlockedPct',
        label: '% Unlocked',
        formulaRef: 'unlockedPct',
        suffix: '%',
        precision: 2,
      },
      {
        id: 'remaining',
        label: 'Tokens Remaining (locked)',
        formulaRef: 'remaining',
        precision: 0,
      },
    ],
    guide: {
      whatIsIt:
        'For informational/educational purposes only. Token vesting schedules control when allocated crypto tokens or equity become accessible. A cliff period means no tokens unlock until that point; after the cliff, tokens unlock linearly over the remaining vesting period.',
      howToUse:
        'Enter the total token allocation, total vesting period, cliff duration, and how many months have elapsed since the vesting started. The calculator shows how many tokens have vested, the unlock percentage, and how many remain locked.',
      exampleScenario:
        '1,000,000 tokens, 48-month vesting, 12-month cliff. At month 18: cliff passed (yes). Post-cliff months elapsed = 6 out of 36 remaining. Vested fraction = 6/36 = 16.67%. Tokens vested = 166,700. Locked = 833,300.',
      proTip:
        'The standard "1-year cliff, 4-year vest" schedule originated in Silicon Valley startup equity. In crypto, shorter vesting periods (2 years) are common but increase sell pressure. Always check if vesting is time-based or milestone-based in your token agreement.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 7. Big O Algorithm Complexity Comparator
  // =========================================================================
  {
    id: 'big-o-comparator',
    slug: 'big-o-comparator',
    title: 'Big O Algorithm Complexity Comparator',
    description:
      'Compare operation counts for common Big O complexity classes at a given input size n.',
    icon: '📊',
    category: 'tech',
    subcategory: 'tools',
    tags: ['Big O', 'algorithm', 'complexity', 'CS', 'performance', 'data structures', 'time complexity'],
    inputs: [
      {
        id: 'n',
        label: 'Input Size (n)',
        type: 'number',
        defaultValue: 1000,
        min: 1,
        step: 100,
        placeholder: 'e.g. 1000',
        helpText: 'The size of the input to the algorithm (number of elements).',
        required: true,
      },
      {
        id: 'algorithm',
        label: 'Highlight Algorithm',
        type: 'select',
        options: [
          { label: 'O(1) - Constant', value: '1' },
          { label: 'O(log n) - Logarithmic', value: '2' },
          { label: 'O(n) - Linear', value: '3' },
          { label: 'O(n log n) - Linearithmic', value: '4' },
          { label: 'O(n�) - Quadratic', value: '5' },
        ],
        defaultValue: '3',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'o1',
        expression: '1',
        dependencies: [],
      },
      {
        id: 'ologn',
        expression: 'log(n) / log(2)',
        dependencies: ['n'],
      },
      {
        id: 'on',
        expression: 'n',
        dependencies: ['n'],
      },
      {
        id: 'onlogn',
        expression: 'n * (log(n) / log(2))',
        dependencies: ['n'],
      },
      {
        id: 'on2',
        expression: 'n * n',
        dependencies: ['n'],
      },
    ],
    outputs: [
      {
        id: 'o1',
        label: 'O(1) operations',
        formulaRef: 'o1',
        precision: 0,
      },
      {
        id: 'ologn',
        label: 'O(log n) operations',
        formulaRef: 'ologn',
        precision: 2,
      },
      {
        id: 'on',
        label: 'O(n) operations',
        formulaRef: 'on',
        precision: 0,
      },
      {
        id: 'onlogn',
        label: 'O(n log n) operations',
        formulaRef: 'onlogn',
        precision: 0,
        highlight: true,
      },
      {
        id: 'on2',
        label: 'O(n�) operations',
        formulaRef: 'on2',
        precision: 0,
      },
    ],
    guide: {
      whatIsIt:
        "For informational/educational purposes only. Big O notation describes how an algorithm's runtime or space requirements grow as the input size increases. Comparing complexity classes helps you choose the most efficient algorithm for your use case.",
      howToUse:
        'Enter an input size n (e.g., 1,000 items in an array). The calculator shows the approximate number of operations each major complexity class would require at that size, making the differences stark and intuitive.',
      exampleScenario:
        'For n = 1,000: O(1) = 1 op, O(log n) = ~10 ops, O(n) = 1,000 ops, O(n log n) = 9,966 ops, O(n�) = 1,000,000 ops. Switching from O(n�) to O(n log n) is a 100� improvement at this scale.',
      proTip:
        'Big O ignores constant factors and lower-order terms. For small n, an O(n�) algorithm with small constants may outperform an O(n log n) one. Always benchmark with realistic data. Space complexity matters as much as time complexity in memory-constrained environments.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 8. Crypto Hash Rate & Mining Time Calculator
  // =========================================================================
  {
    id: 'hash-rate-mining-calculator',
    slug: 'hash-rate-mining-calculator',
    title: 'Crypto Hash Rate & Mining Time',
    description:
      'Estimate your share of the Bitcoin network and daily BTC mined based on your hash rate and network difficulty.',
    icon: '⛏',
    category: 'crypto',
    subcategory: 'mining',
    tags: ['mining', 'hash rate', 'bitcoin', 'BTC', 'crypto', 'block reward', 'network difficulty'],
    inputs: [
      {
        id: 'hashRateTHs',
        label: 'Your Hash Rate (TH/s)',
        type: 'number',
        defaultValue: 100,
        min: 0,
        step: 1,
        placeholder: 'e.g. 100',
        helpText: 'Your total mining hash rate in TH/s (terahashes per second).',
        required: true,
      },
      {
        id: 'networkHashRateEHs',
        label: 'Network Hash Rate (EH/s)',
        type: 'number',
        defaultValue: 600,
        min: 1,
        step: 10,
        placeholder: 'e.g. 600',
        helpText: 'Current Bitcoin network total hash rate in EH/s (exahashes per second).',
        required: true,
      },
      {
        id: 'blockReward',
        label: 'Block Reward (BTC)',
        type: 'number',
        defaultValue: 3.125,
        min: 0,
        step: 0.001,
        placeholder: 'e.g. 3.125',
        helpText: 'Current block subsidy in BTC (3.125 BTC post-2024 halving).',
        required: true,
      },
      {
        id: 'blockTimeSec',
        label: 'Avg Block Time (seconds)',
        type: 'number',
        defaultValue: 600,
        min: 1,
        step: 1,
        placeholder: 'e.g. 600',
        helpText: 'Average time between blocks in seconds (Bitcoin target = 600s = 10 min).',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'hashRateEHs',
        expression: 'hashRateTHs / 1000000',
        dependencies: ['hashRateTHs'],
      },
      {
        id: 'shareOfNetwork',
        expression: 'hashRateEHs / networkHashRateEHs',
        dependencies: ['hashRateEHs', 'networkHashRateEHs'],
      },
      {
        id: 'blocksPerDay',
        expression: '86400 / blockTimeSec',
        dependencies: ['blockTimeSec'],
      },
      {
        id: 'dailyBTC',
        expression: 'shareOfNetwork * blocksPerDay * blockReward',
        dependencies: ['shareOfNetwork', 'blocksPerDay', 'blockReward'],
      },
      {
        id: 'dailyRevenue',
        expression: 'dailyBTC',
        dependencies: ['dailyBTC'],
      },
    ],
    outputs: [
      {
        id: 'shareOfNetwork',
        label: 'Network Share %',
        formulaRef: 'shareOfNetwork',
        suffix: '%',
        precision: 6,
      },
      {
        id: 'dailyBTC',
        label: 'Est. Daily BTC Mined',
        formulaRef: 'dailyBTC',
        suffix: ' BTC/day',
        precision: 8,
        highlight: true,
      },
    ],
    guide: {
      whatIsIt:
        'For informational/educational purposes only. Not financial advice. Bitcoin mining profitability depends on your hash rate relative to the total network hash rate, block rewards, and block time. This calculator estimates your statistical daily BTC earnings.',
      howToUse:
        'Enter your hash rate in TH/s, the current network hash rate in EH/s (find this on sites like blockchain.com or mempool.space), the current block reward, and average block time. The calculator shows your network share and expected daily BTC.',
      exampleScenario:
        '100 TH/s vs. 600 EH/s network = 1.67�10?7 share. Blocks per day = 144. Daily BTC = 1.67�10?7 � 144 � 3.125 = 0.0000750 BTC per day. With mining pools, you receive proportional daily payouts minus fees.',
      proTip:
        'Solo mining at small hash rates gives you a statistically negligible chance of finding a block. Join a mining pool to receive consistent small payouts proportional to your contributed hash rate. Always subtract electricity and hardware costs to determine net profitability.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 9. Server Sizing & Capacity Calculator
  // =========================================================================
  {
    id: 'server-sizing-calculator',
    slug: 'server-sizing-calculator',
    title: 'Server Sizing & Capacity Calculator',
    description:
      'Calculate recommended CPU cores and RAM for your server based on current utilization, peak multiplier, and safety buffer.',
    icon: '🖥',
    category: 'tech',
    subcategory: 'cloud',
    tags: ['server', 'sizing', 'CPU', 'RAM', 'capacity', 'DevOps', 'infrastructure', 'scaling'],
    inputs: [
      {
        id: 'cpuUsagePct',
        label: 'Target CPU Utilization %',
        type: 'number',
        defaultValue: 70,
        min: 1,
        max: 100,
        step: 1,
        placeholder: 'e.g. 70',
        helpText: 'Current average CPU utilization percentage on your existing server.',
        required: true,
      },
      {
        id: 'currentCPUCores',
        label: 'Current CPU Cores',
        type: 'number',
        defaultValue: 8,
        min: 1,
        step: 1,
        placeholder: 'e.g. 8',
        helpText: 'Number of vCPU cores on your current server.',
        required: true,
      },
      {
        id: 'memoryGB',
        label: 'Current RAM (GB)',
        type: 'number',
        defaultValue: 32,
        min: 1,
        step: 2,
        placeholder: 'e.g. 32',
        helpText: 'Current RAM in gigabytes on your server.',
        required: true,
      },
      {
        id: 'peakMultiplier',
        label: 'Peak Traffic Multiplier',
        type: 'number',
        defaultValue: 2,
        min: 1,
        step: 0.1,
        placeholder: 'e.g. 2',
        helpText: 'How many times peak traffic exceeds average (e.g., 2 = double at peak).',
        required: true,
      },
      {
        id: 'safetyBuffer',
        label: 'Safety Buffer %',
        type: 'number',
        defaultValue: 20,
        min: 0,
        max: 100,
        step: 5,
        placeholder: 'e.g. 20',
        helpText: 'Extra headroom % to add on top of the peak requirement.',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'requiredCores',
        expression: 'ceil(currentCPUCores * (100 / cpuUsagePct) * peakMultiplier * (1 + safetyBuffer / 100))',
        dependencies: ['currentCPUCores', 'cpuUsagePct', 'peakMultiplier', 'safetyBuffer'],
      },
      {
        id: 'requiredMemory',
        expression: 'ceil(memoryGB * peakMultiplier * (1 + safetyBuffer / 100))',
        dependencies: ['memoryGB', 'peakMultiplier', 'safetyBuffer'],
      },
      {
        id: 'utilizationWithPeak',
        expression: 'cpuUsagePct * peakMultiplier',
        dependencies: ['cpuUsagePct', 'peakMultiplier'],
      },
    ],
    outputs: [
      {
        id: 'requiredCores',
        label: 'Recommended CPU Cores',
        formulaRef: 'requiredCores',
        precision: 0,
        highlight: true,
      },
      {
        id: 'requiredMemory',
        label: 'Recommended RAM',
        formulaRef: 'requiredMemory',
        suffix: ' GB RAM',
        precision: 0,
      },
      {
        id: 'utilizationWithPeak',
        label: 'Peak Utilization',
        formulaRef: 'utilizationWithPeak',
        suffix: '%',
        precision: 0,
      },
    ],
    guide: {
      whatIsIt:
        'For informational/educational purposes only. Right-sizing servers prevents both under-provisioning (degraded performance) and over-provisioning (wasted cost). This calculator scales your current resources to handle peak traffic with a safety buffer.',
      howToUse:
        'Enter your current CPU utilization percentage and core count, current RAM, expected peak traffic multiplier, and desired safety buffer. The calculator recommends the CPU and RAM needed for comfortable peak operation.',
      exampleScenario:
        '8 cores at 70% avg utilization. For 2� peak with 20% buffer: required cores = ceil(8 � (100/70) � 2 � 1.2) = ceil(27.4) = 28 cores. RAM: ceil(32 � 2 � 1.2) = 77 GB (round to 80 GB).',
      proTip:
        'Use auto-scaling groups in cloud environments to dynamically adjust capacity, reducing the need for permanent over-provisioning. Monitor p95/p99 latency (not just average) to catch performance issues before users do.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 10. Code Review Time Estimator
  // =========================================================================
  {
    id: 'code-review-time-estimator',
    slug: 'code-review-time-estimator',
    title: 'Code Review Time Estimator',
    description:
      'Estimate code review time based on lines of code changed, code complexity, and number of reviewers.',
    icon: '💻',
    category: 'tech',
    subcategory: 'tools',
    tags: ['code review', 'pull request', 'PR', 'development', 'engineering', 'team', 'velocity'],
    inputs: [
      {
        id: 'linesOfCode',
        label: 'Lines of Code Changed',
        type: 'number',
        defaultValue: 500,
        min: 1,
        step: 50,
        placeholder: 'e.g. 500',
        helpText: 'Total lines of code added + removed in the pull request.',
        required: true,
      },
      {
        id: 'complexity',
        label: 'Code Complexity',
        type: 'select',
        options: [
          { label: 'Simple (CRUD/config)', value: '100' },
          { label: 'Medium (business logic)', value: '60' },
          { label: 'Complex (algorithms/architecture)', value: '30' },
        ],
        defaultValue: '60',
        required: true,
      },
      {
        id: 'reviewers',
        label: 'Number of Reviewers',
        type: 'number',
        defaultValue: 2,
        min: 1,
        max: 10,
        step: 1,
        placeholder: 'e.g. 2',
        helpText: 'Number of engineers reviewing the pull request.',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'minutesPerReviewer',
        expression: 'linesOfCode / complexity * 60',
        dependencies: ['linesOfCode', 'complexity'],
      },
      {
        id: 'totalReviewTime',
        expression: 'minutesPerReviewer',
        dependencies: ['minutesPerReviewer'],
      },
      {
        id: 'roundTrips',
        expression: '2',
        dependencies: [],
      },
      {
        id: 'totalCycleTime',
        expression: 'totalReviewTime * roundTrips * reviewers / 60',
        dependencies: ['totalReviewTime', 'roundTrips', 'reviewers'],
      },
    ],
    outputs: [
      {
        id: 'minutesPerReviewer',
        label: 'Review Time per Reviewer',
        formulaRef: 'minutesPerReviewer',
        suffix: ' min',
        precision: 0,
      },
      {
        id: 'totalCycleTime',
        label: 'Estimated Total Cycle Time',
        formulaRef: 'totalCycleTime',
        suffix: ' hrs',
        precision: 1,
        highlight: true,
      },
    ],
    guide: {
      whatIsIt:
        'For informational/educational purposes only. Code review time estimates help engineering teams plan sprints and set realistic expectations for PR turnaround. Research suggests reviewers can effectively review about 60-100 lines of medium-complexity code per hour.',
      howToUse:
        'Enter the total lines changed in the pull request, select the complexity level, and choose the number of reviewers. The calculator estimates individual reviewer time and total cycle time including two rounds of review (initial + addressing comments).',
      exampleScenario:
        'A 500-line PR of medium complexity with 2 reviewers. Per reviewer: 500/60 � 60 = 500 minutes = 8.3 hours. Total cycle time (2 rounds � 2 reviewers) = 33.3 hours = 1.4 business days.',
      proTip:
        'Keep PRs under 400 lines for faster, higher-quality reviews. Larger PRs get rubber-stamped more often. Use draft PRs for early feedback, atomic commits for context, and PR templates with description/test plan fields to reduce reviewer cognitive load.',
    },
    metadata: { version: '1.0.0' },
  },
];
