// ---------------------------------------------------------------------------
// Quantify — Logistics & Supply Chain Calculators
// ---------------------------------------------------------------------------
// 9 calculators covering inventory management, freight, packaging, and
// supply chain optimisation for logistics professionals.
// ---------------------------------------------------------------------------

import type { CalculatorSchema } from '@/types/calculator';

export const logisticsCalculators: CalculatorSchema[] = [
  // =========================================================================
  // 41. Pallet Loading / Optimisation
  // =========================================================================
  {
    id: 'pallet-loading',
    slug: 'pallet-loading',
    title: 'Pallet Loading Optimiser',
    description:
      'Calculate how many boxes fit on a standard pallet by layer, the number of layers within your height limit, and the overall pallet area utilisation.',
    icon: '📦',
    category: 'logistics',
    subcategory: 'packaging',
    tags: ['pallet', 'loading', 'boxes', 'layers', 'warehouse', 'packaging', 'optimisation', 'freight'],
    inputs: [
      {
        id: 'palletLength',
        label: 'Pallet Length (cm)',
        type: 'number',
        defaultValue: 120,
        min: 1,
        step: 1,
        helpText: 'Standard EUR pallet: 120x80 cm. US GMA pallet: 121.9x101.6 cm.',
        required: true,
      },
      {
        id: 'palletWidth',
        label: 'Pallet Width (cm)',
        type: 'number',
        defaultValue: 80,
        min: 1,
        step: 1,
        helpText: 'Standard EUR pallet width is 80 cm',
        required: true,
      },
      {
        id: 'maxStackHeight',
        label: 'Maximum Stack Height (cm)',
        type: 'number',
        defaultValue: 180,
        min: 1,
        step: 1,
        helpText: 'Include pallet board height (~15 cm). Typical warehouse limit: 165-200 cm.',
        required: true,
      },
      {
        id: 'boxLength',
        label: 'Box Length (cm)',
        type: 'number',
        defaultValue: 40,
        min: 1,
        step: 1,
        helpText: 'Outer dimension of carton/box along the longer side',
        required: true,
      },
      {
        id: 'boxWidth',
        label: 'Box Width (cm)',
        type: 'number',
        defaultValue: 30,
        min: 1,
        step: 1,
        required: true,
      },
      {
        id: 'boxHeight',
        label: 'Box Height (cm)',
        type: 'number',
        defaultValue: 25,
        min: 1,
        step: 1,
        required: true,
      },
      {
        id: 'palletHeight',
        label: 'Pallet Board Height (cm)',
        type: 'number',
        defaultValue: 15,
        min: 1,
        max: 30,
        step: 1,
        helpText: 'Standard wooden pallet deck thickness is approximately 14-15 cm',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'boxesPerRow',
        expression: 'floor(palletLength / boxLength)',
        dependencies: ['palletLength', 'boxLength'],
      },
      {
        id: 'boxesPerCol',
        expression: 'floor(palletWidth / boxWidth)',
        dependencies: ['palletWidth', 'boxWidth'],
      },
      {
        id: 'boxesPerLayer',
        expression: 'boxesPerRow * boxesPerCol',
        dependencies: ['boxesPerRow', 'boxesPerCol'],
      },
      {
        id: 'availableHeight',
        expression: 'maxStackHeight - palletHeight',
        dependencies: ['maxStackHeight', 'palletHeight'],
      },
      {
        id: 'layers',
        expression: 'floor(availableHeight / boxHeight)',
        dependencies: ['availableHeight', 'boxHeight'],
      },
      {
        id: 'totalBoxes',
        expression: 'boxesPerLayer * layers',
        dependencies: ['boxesPerLayer', 'layers'],
      },
      {
        id: 'usagePercent',
        expression: '(boxesPerLayer * boxLength * boxWidth) / (palletLength * palletWidth) * 100',
        dependencies: ['boxesPerLayer', 'boxLength', 'boxWidth', 'palletLength', 'palletWidth'],
      },
    ],
    outputs: [
      {
        id: 'out-totalBoxes',
        label: 'Boxes Per Pallet',
        formulaRef: 'totalBoxes',
        format: 'number',
        precision: 0,
        highlight: true,
      },
      {
        id: 'out-boxesPerLayer',
        label: 'Boxes Per Layer',
        formulaRef: 'boxesPerLayer',
        format: 'number',
        precision: 0,
      },
      {
        id: 'out-layers',
        label: 'Number of Layers',
        formulaRef: 'layers',
        format: 'number',
        precision: 0,
      },
      {
        id: 'out-usagePercent',
        label: 'Pallet Area Utilisation',
        formulaRef: 'usagePercent',
        format: 'number',
        precision: 1,
        suffix: '%',
      },
    ],
    guide: {
      whatIsIt:
        'Pallet loading optimisation calculates how many boxes can be stacked on a pallet within a maximum height constraint. The calculator uses a simple column-row approach (no rotation or interlocking) to provide a baseline count — real-world optimisation may squeeze out additional units through pattern stacking or alternating orientations. The standard EUR pallet is 120x80 cm; the US GMA pallet is approximately 122x102 cm.',
      howToUse:
        'Enter the pallet footprint, the maximum permitted stack height (including the pallet board itself), and the outer dimensions of your carton. The calculator subtracts the pallet board height, then divides the remaining clearance by box height to determine layer count. Area utilisation shows how efficiently the pallet footprint is used.',
      exampleScenario:
        'EUR pallet (120x80 cm), max height 180 cm, pallet board 15 cm, boxes 40x30x25 cm. Boxes per row = floor(120/40) = 3. Boxes per column = floor(80/30) = 2. Per layer = 6. Available height = 165 cm. Layers = floor(165/25) = 6. Total = 36 boxes. Area utilisation = (6 x 40 x 30) / (120 x 80) x 100 = 75%.',
      proTip:
        'This calculator assumes all boxes face the same direction. In practice, interlocking patterns (rotating every other layer 90 degrees) increase stability and can occasionally fit more units. Also consider weight limits: standard EUR pallets are rated for 1,500 kg dynamic and 4,000 kg static — always check total pallet weight before shipping.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 42. Economic Order Quantity (EOQ)
  // =========================================================================
  {
    id: 'eoq-calculator',
    slug: 'eoq-calculator',
    title: 'Economic Order Quantity (EOQ)',
    description:
      'Find the optimal order quantity that minimises total inventory costs (ordering + holding) using the classic Wilson EOQ formula.',
    icon: '📈',
    category: 'logistics',
    subcategory: 'inventory',
    tags: ['eoq', 'economic order quantity', 'inventory', 'ordering cost', 'holding cost', 'wilson', 'supply chain'],
    inputs: [
      {
        id: 'annualDemand',
        label: 'Annual Demand (units)',
        type: 'number',
        defaultValue: 10000,
        min: 1,
        step: 100,
        helpText: 'Total units sold or consumed per year',
        required: true,
      },
      {
        id: 'orderingCost',
        label: 'Cost Per Order (USD)',
        type: 'number',
        defaultValue: 50,
        min: 0,
        step: 1,
        helpText: 'Admin cost, shipping, receiving, and quality inspection per order placement',
        required: true,
      },
      {
        id: 'holdingCostPercent',
        label: 'Annual Holding Cost (% of unit cost)',
        type: 'number',
        defaultValue: 25,
        min: 1,
        max: 100,
        step: 1,
        helpText: 'Storage, capital cost, insurance, obsolescence. Typically 20-30% of unit cost per year.',
        required: true,
      },
      {
        id: 'unitCost',
        label: 'Unit Cost (USD)',
        type: 'number',
        defaultValue: 10,
        min: 0,
        step: 0.01,
        helpText: 'Purchase or production cost per unit',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'holdingCostPerUnit',
        expression: 'holdingCostPercent / 100 * unitCost',
        dependencies: ['holdingCostPercent', 'unitCost'],
      },
      {
        // EOQ = sqrt(2 * D * S / H)
        id: 'eoq',
        expression: 'sqrt(2 * annualDemand * orderingCost / holdingCostPerUnit)',
        dependencies: ['annualDemand', 'orderingCost', 'holdingCostPerUnit'],
      },
      {
        id: 'ordersPerYear',
        expression: 'annualDemand / eoq',
        dependencies: ['annualDemand', 'eoq'],
      },
      {
        id: 'avgInventory',
        expression: 'eoq / 2',
        dependencies: ['eoq'],
      },
      {
        id: 'annualOrderingCost',
        expression: 'ordersPerYear * orderingCost',
        dependencies: ['ordersPerYear', 'orderingCost'],
      },
      {
        id: 'annualHoldingCost',
        expression: 'avgInventory * holdingCostPerUnit',
        dependencies: ['avgInventory', 'holdingCostPerUnit'],
      },
      {
        id: 'totalCost',
        expression: 'annualOrderingCost + annualHoldingCost',
        dependencies: ['annualOrderingCost', 'annualHoldingCost'],
      },
    ],
    outputs: [
      {
        id: 'out-eoq',
        label: 'Optimal Order Quantity',
        formulaRef: 'eoq',
        format: 'number',
        precision: 0,
        suffix: ' units',
        highlight: true,
      },
      {
        id: 'out-ordersPerYear',
        label: 'Orders Per Year',
        formulaRef: 'ordersPerYear',
        format: 'number',
        precision: 1,
      },
      {
        id: 'out-totalCost',
        label: 'Annual Total Inventory Cost',
        formulaRef: 'totalCost',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'out-avgInventory',
        label: 'Average Inventory',
        formulaRef: 'avgInventory',
        format: 'number',
        precision: 0,
        suffix: ' units',
      },
    ],
    guide: {
      whatIsIt:
        'The Economic Order Quantity (EOQ) model, developed by Ford W. Harris in 1913, finds the order size that minimises the sum of ordering costs (cost per purchase order) and holding costs (cost to store inventory). The model assumes constant demand and instantaneous replenishment — a simplification that still provides an excellent starting point for inventory policy. The formula is EOQ = sqrt(2 x D x S / H), where D = annual demand, S = cost per order, H = annual holding cost per unit.',
      howToUse:
        'Enter your annual unit demand, the cost to place one order, your annual holding cost as a percentage of unit value, and the unit cost. The calculator solves for the optimal order quantity, how many times per year to order, and the resulting total cost — which at EOQ is the mathematical minimum.',
      exampleScenario:
        'Annual demand: 10,000 units. Order cost: $50. Unit cost: $10. Holding cost: 25% = $2.50/unit/year. EOQ = sqrt(2 x 10,000 x 50 / 2.50) = sqrt(400,000) = 632 units. Orders per year = 10,000 / 632 = 15.8. Annual cost = $1,581 ordering + $1,581 holding = $3,162.',
      proTip:
        'EOQ is most sensitive to demand (D) and holding cost (H). A 4x increase in demand doubles EOQ, while a 4x increase in holding cost halves it. In practice, round EOQ to a convenient pallet or case quantity. Also consider supplier minimum order quantities and volume discount breaks — sometimes ordering slightly above EOQ to hit a price tier reduces total cost.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 43. CBM (Cubic Meter) Calculator
  // =========================================================================
  {
    id: 'cbm-calculator',
    slug: 'cbm-calculator',
    title: 'CBM (Cubic Metre) Calculator',
    description:
      'Calculate the total cubic volume of a shipment in CBM (m³) and CFT (ft³), and estimate how many 20ft or 40ft shipping containers are needed.',
    icon: '📐',
    category: 'logistics',
    subcategory: 'packaging',
    tags: ['cbm', 'cubic meter', 'cubic metre', 'cft', 'container', 'freight', 'shipping', 'volume'],
    inputs: [
      {
        id: 'length',
        label: 'Length (cm)',
        type: 'number',
        defaultValue: 60,
        min: 0.1,
        step: 0.1,
        helpText: 'Enter dimensions in centimetres. Convert: 1 inch = 2.54 cm, 1 ft = 30.48 cm.',
        required: true,
      },
      {
        id: 'width',
        label: 'Width (cm)',
        type: 'number',
        defaultValue: 40,
        min: 0.1,
        step: 0.1,
        required: true,
      },
      {
        id: 'height',
        label: 'Height (cm)',
        type: 'number',
        defaultValue: 30,
        min: 0.1,
        step: 0.1,
        required: true,
      },
      {
        id: 'quantity',
        label: 'Number of Cartons / Boxes',
        type: 'number',
        defaultValue: 100,
        min: 1,
        step: 1,
        helpText: 'Total number of identical cartons in the shipment',
        required: true,
      },
    ],
    formulas: [
      {
        // Convert cm dimensions to metres (divide by 100) then multiply
        id: 'cbmPerUnit',
        expression: '(length / 100) * (width / 100) * (height / 100)',
        dependencies: ['length', 'width', 'height'],
      },
      {
        id: 'totalCbm',
        expression: 'cbmPerUnit * quantity',
        dependencies: ['cbmPerUnit', 'quantity'],
      },
      {
        // 1 m3 = 35.3147 ft3
        id: 'totalCft',
        expression: 'totalCbm * 35.3147',
        dependencies: ['totalCbm'],
      },
      {
        // 20ft container usable volume approx 25.45 m3 (accounting for structure)
        id: 'container20ft',
        expression: 'totalCbm / 25.45',
        dependencies: ['totalCbm'],
      },
      {
        // 40ft standard container usable volume approx 56.1 m3
        id: 'container40ft',
        expression: 'totalCbm / 56.1',
        dependencies: ['totalCbm'],
      },
    ],
    outputs: [
      {
        id: 'out-totalCbm',
        label: 'Total Volume',
        formulaRef: 'totalCbm',
        format: 'number',
        precision: 3,
        suffix: ' m³',
        highlight: true,
      },
      {
        id: 'out-totalCft',
        label: 'Total Volume (CFT)',
        formulaRef: 'totalCft',
        format: 'number',
        precision: 2,
        suffix: ' ft³',
      },
      {
        id: 'out-container20ft',
        label: '20ft Containers Needed',
        formulaRef: 'container20ft',
        format: 'number',
        precision: 2,
      },
      {
        id: 'out-container40ft',
        label: '40ft Containers Needed',
        formulaRef: 'container40ft',
        format: 'number',
        precision: 2,
      },
    ],
    guide: {
      whatIsIt:
        'CBM (Cubic Metre) is the standard unit of volume measurement in international freight. It determines how much space your goods occupy in a container, truck, or air freight consignment. Freight is charged on either actual weight or volumetric (dimensional) weight — whichever is higher. For sea freight, CBM drives the cost; for air, dimensional weight often dominates. Container usable capacities: 20ft = 25.45 m3; 40ft standard = 56.1 m3; 40ft High Cube = 67.7 m3.',
      howToUse:
        'Enter the outer dimensions of one carton in centimetres and the total number of cartons. The calculator converts cm to metres automatically (divides each dimension by 100) and multiplies for CBM per unit, then multiplies by quantity. Results show total CBM, CFT equivalent, and fractional container requirements.',
      exampleScenario:
        'A shipment of 100 cartons, each 60x40x30 cm: CBM per carton = 0.6 x 0.4 x 0.3 = 0.072 m3. Total = 0.072 x 100 = 7.2 m3. That requires approximately 7.2 / 25.45 = 0.28 of a 20ft container, so the shipment would be grouped with other cargo as an LCL (Less than Container Load) shipment.',
      proTip:
        'Always measure outer carton dimensions (not inner product dimensions) and add 1-2 cm tolerance for packaging deformation under load. For volumetric weight in air freight, use: (L x W x H in cm) / 6,000 = volumetric kg per carton. If volumetric weight exceeds actual weight, you pay for volumetric.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 44. Lead Time Calculator
  // =========================================================================
  {
    id: 'lead-time',
    slug: 'lead-time',
    title: 'Supply Chain Lead Time Calculator',
    description:
      'Sum all components of your total supply chain lead time — from supplier confirmation through to customs clearance — and add a safety buffer.',
    icon: '📅',
    category: 'logistics',
    subcategory: 'inventory',
    tags: ['lead time', 'supply chain', 'delivery', 'production', 'customs', 'shipping', 'planning'],
    inputs: [
      {
        id: 'supplierDays',
        label: 'Supplier Confirmation (days)',
        type: 'number',
        defaultValue: 3,
        min: 0,
        step: 1,
        helpText: 'Time for supplier to confirm order and begin sourcing materials',
        required: true,
      },
      {
        id: 'manufacturingDays',
        label: 'Manufacturing / Production (days)',
        type: 'number',
        defaultValue: 7,
        min: 0,
        step: 1,
        helpText: 'Actual production or assembly time',
        required: true,
      },
      {
        id: 'qcDays',
        label: 'Quality Control / Inspection (days)',
        type: 'number',
        defaultValue: 1,
        min: 0,
        step: 1,
        helpText: 'Pre-shipment inspection or QC hold time',
        required: true,
      },
      {
        id: 'shippingDays',
        label: 'Shipping Transit (days)',
        type: 'number',
        defaultValue: 14,
        min: 0,
        step: 1,
        helpText: 'Sea freight: 14-30 days. Air freight: 2-5 days. Road: 1-7 days.',
        required: true,
      },
      {
        id: 'customsDays',
        label: 'Customs & Clearance (days)',
        type: 'number',
        defaultValue: 2,
        min: 0,
        step: 1,
        helpText: 'Import customs clearance, duties processing, and port handling',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'totalLeadDays',
        expression: 'supplierDays + manufacturingDays + qcDays + shippingDays + customsDays',
        dependencies: ['supplierDays', 'manufacturingDays', 'qcDays', 'shippingDays', 'customsDays'],
      },
      {
        id: 'totalLeadWeeks',
        expression: 'totalLeadDays / 7',
        dependencies: ['totalLeadDays'],
      },
      {
        id: 'bufferDays',
        expression: 'totalLeadDays * 0.2',
        dependencies: ['totalLeadDays'],
      },
      {
        id: 'safeLeadTime',
        expression: 'totalLeadDays + bufferDays',
        dependencies: ['totalLeadDays', 'bufferDays'],
      },
    ],
    outputs: [
      {
        id: 'out-totalLeadDays',
        label: 'Total Lead Time',
        formulaRef: 'totalLeadDays',
        format: 'number',
        precision: 0,
        suffix: ' days',
        highlight: true,
      },
      {
        id: 'out-totalLeadWeeks',
        label: 'Lead Time in Weeks',
        formulaRef: 'totalLeadWeeks',
        format: 'number',
        precision: 1,
        suffix: ' weeks',
      },
      {
        id: 'out-safeLeadTime',
        label: 'Safe Lead Time (+20% buffer)',
        formulaRef: 'safeLeadTime',
        format: 'number',
        precision: 0,
        suffix: ' days',
      },
    ],
    guide: {
      whatIsIt:
        'Total lead time is the end-to-end time from placing a purchase order to receiving goods in your warehouse, ready for sale or use. It encompasses supplier processing, manufacturing, quality inspection, transit, and customs clearance. Accurately knowing your lead time is essential for setting reorder points, safety stock levels, and avoiding stockouts. The 20% buffer accounts for common delays such as port congestion, customs holds, and production overruns.',
      howToUse:
        'Enter the typical number of days for each stage of your supply chain. If a stage does not apply (e.g., no customs for domestic orders), enter 0. The calculator sums all stages and computes a safe planning lead time with a 20% buffer. Use the safe lead time when setting your reorder triggers.',
      exampleScenario:
        'A buyer imports electronics from China: 3 days supplier confirmation + 7 days production + 1 day QC + 14 days sea freight + 2 days customs = 27 days total. Safe lead time = 27 x 1.2 = 32.4, rounded to 33 days. The reorder point should be placed at least 33 days before projected stockout.',
      proTip:
        'Track actual lead time for each supplier versus your estimate. Over 6-12 orders, you will identify which stage is most variable — that stage is where safety stock investment pays off most. Some buyers build a "worst-case" lead time using the 90th percentile of historical transit times rather than a flat percentage buffer.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 45. Safety Stock Calculator
  // =========================================================================
  {
    id: 'safety-stock',
    slug: 'safety-stock',
    title: 'Safety Stock Calculator',
    description:
      'Calculate the optimal safety stock buffer using the statistical formula that accounts for variability in both demand and lead time, with a selectable service level.',
    icon: '🛡️',
    category: 'logistics',
    subcategory: 'inventory',
    tags: ['safety stock', 'buffer stock', 'inventory', 'service level', 'demand variability', 'lead time', 'stockout'],
    inputs: [
      {
        id: 'avgDailyDemand',
        label: 'Average Daily Demand (units/day)',
        type: 'number',
        defaultValue: 50,
        min: 0.1,
        step: 1,
        helpText: 'Mean units sold or consumed per day',
        required: true,
      },
      {
        id: 'demandStdDev',
        label: 'Demand Std. Deviation (units/day)',
        type: 'number',
        defaultValue: 10,
        min: 0,
        step: 1,
        helpText: 'Standard deviation of daily demand — measure of demand variability',
        required: true,
      },
      {
        id: 'avgLeadDays',
        label: 'Average Lead Time (days)',
        type: 'number',
        defaultValue: 14,
        min: 1,
        step: 1,
        helpText: 'Mean supplier lead time in days',
        required: true,
      },
      {
        id: 'leadTimeStdDev',
        label: 'Lead Time Std. Deviation (days)',
        type: 'number',
        defaultValue: 2,
        min: 0,
        step: 0.5,
        helpText: 'Standard deviation of lead time — measure of supplier reliability',
        required: true,
      },
      {
        id: 'serviceLevel',
        label: 'Target Service Level',
        type: 'select',
        options: [
          { label: '90% service level (Z = 1.28)', value: '1.28' },
          { label: '95% service level (Z = 1.65)', value: '1.65' },
          { label: '99% service level (Z = 2.33)', value: '2.33' },
          { label: '99.9% service level (Z = 3.09)', value: '3.09' },
        ],
        defaultValue: '1.65',
        helpText: 'Probability of not stocking out during a replenishment cycle',
      },
    ],
    formulas: [
      {
        // Combined variance: variance_LT = L * sigma_d^2 + D_avg^2 * sigma_L^2
        id: 'varianceLT',
        expression: 'avgLeadDays * pow(demandStdDev, 2) + pow(avgDailyDemand, 2) * pow(leadTimeStdDev, 2)',
        dependencies: ['avgLeadDays', 'demandStdDev', 'avgDailyDemand', 'leadTimeStdDev'],
      },
      {
        id: 'stdDevLT',
        expression: 'sqrt(varianceLT)',
        dependencies: ['varianceLT'],
      },
      {
        // Safety Stock = Z * sigma_combined
        id: 'safetyStock',
        expression: 'serviceLevel * stdDevLT',
        dependencies: ['serviceLevel', 'stdDevLT'],
      },
      {
        // Reorder Point = D_avg * L_avg + Safety Stock
        id: 'reorderPoint',
        expression: 'avgDailyDemand * avgLeadDays + safetyStock',
        dependencies: ['avgDailyDemand', 'avgLeadDays', 'safetyStock'],
      },
    ],
    outputs: [
      {
        id: 'out-safetyStock',
        label: 'Safety Stock',
        formulaRef: 'safetyStock',
        format: 'number',
        precision: 0,
        suffix: ' units',
        highlight: true,
      },
      {
        id: 'out-reorderPoint',
        label: 'Reorder Point',
        formulaRef: 'reorderPoint',
        format: 'number',
        precision: 0,
        suffix: ' units',
      },
    ],
    guide: {
      whatIsIt:
        'Safety stock is the buffer inventory held to guard against stockouts caused by unexpected spikes in demand or supplier delays. The statistical formula accounts for variability in both demand (sigma_d) and lead time (sigma_L): Safety Stock = Z x sqrt(L x sigma_d^2 + D^2 x sigma_L^2), where Z is the service-level z-score. A 95% service level means you expect to satisfy demand from stock 95% of replenishment cycles.',
      howToUse:
        'Enter your average daily demand, the standard deviation of daily demand, the average supplier lead time, its standard deviation, and your target service level. If your lead time is perfectly reliable (same every time), set lead time std. deviation to 0. The calculator outputs safety stock units and the resulting reorder point.',
      exampleScenario:
        'Avg daily demand: 50 units (sigma: 10). Avg lead time: 14 days (sigma: 2). Service level: 95% (Z = 1.65). Variance = 14 x 100 + 2500 x 4 = 11,400. Std dev = sqrt(11,400) = 106.8 units. Safety stock = 1.65 x 106.8 = 176 units. Reorder point = 50 x 14 + 176 = 876 units.',
      proTip:
        'Calculate safety stock separately for each SKU — a one-size-fits-all approach leads to overstock on slow movers and stockouts on fast movers. High-margin, hard-to-substitute products warrant 99%+ service levels; commodity items with many substitutes can often operate at 90%. Review safety stock quarterly as demand patterns and supplier reliability change.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 46. Reorder Point Calculator
  // =========================================================================
  {
    id: 'reorder-point',
    slug: 'reorder-point',
    title: 'Reorder Point Calculator',
    description:
      'Calculate the inventory level at which you should place a new order to avoid stockouts, based on average daily demand, lead time, and a safety stock buffer.',
    icon: '🔔',
    category: 'logistics',
    subcategory: 'inventory',
    tags: ['reorder point', 'rop', 'inventory', 'stock', 'safety stock', 'lead time', 'supply chain'],
    inputs: [
      {
        id: 'avgDailyDemand',
        label: 'Average Daily Demand (units/day)',
        type: 'number',
        defaultValue: 50,
        min: 0.1,
        step: 1,
        helpText: 'Average units sold or consumed each day',
        required: true,
      },
      {
        id: 'leadTimeDays',
        label: 'Lead Time (days)',
        type: 'number',
        defaultValue: 14,
        min: 1,
        step: 1,
        helpText: 'Days from placing an order to receiving it',
        required: true,
      },
      {
        id: 'safetyStockDays',
        label: 'Safety Stock (days of demand)',
        type: 'number',
        defaultValue: 7,
        min: 0,
        step: 1,
        helpText: 'Conservative: 7-14 days of demand. Use the Safety Stock Calculator for a statistical approach.',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'safetyStockUnits',
        expression: 'avgDailyDemand * safetyStockDays',
        dependencies: ['avgDailyDemand', 'safetyStockDays'],
      },
      {
        id: 'demandDuringLT',
        expression: 'avgDailyDemand * leadTimeDays',
        dependencies: ['avgDailyDemand', 'leadTimeDays'],
      },
      {
        id: 'reorderPoint',
        expression: 'demandDuringLT + safetyStockUnits',
        dependencies: ['demandDuringLT', 'safetyStockUnits'],
      },
      {
        id: 'daysOfSupply',
        expression: 'reorderPoint / avgDailyDemand',
        dependencies: ['reorderPoint', 'avgDailyDemand'],
      },
    ],
    outputs: [
      {
        id: 'out-reorderPoint',
        label: 'Reorder Point',
        formulaRef: 'reorderPoint',
        format: 'number',
        precision: 0,
        suffix: ' units',
        highlight: true,
      },
      {
        id: 'out-safetyStockUnits',
        label: 'Safety Stock',
        formulaRef: 'safetyStockUnits',
        format: 'number',
        precision: 0,
        suffix: ' units',
      },
      {
        id: 'out-daysOfSupply',
        label: 'Days of Supply at ROP',
        formulaRef: 'daysOfSupply',
        format: 'number',
        precision: 1,
        suffix: ' days',
      },
    ],
    guide: {
      whatIsIt:
        'The Reorder Point (ROP) is the inventory level that triggers a new purchase order. When stock drops to the ROP, you order immediately so the replenishment arrives just before the safety stock is consumed. The formula is: ROP = (Average Daily Demand x Lead Time) + Safety Stock. This simple version uses days of demand as the safety stock input — for a statistically rigorous approach, use the dedicated Safety Stock Calculator.',
      howToUse:
        'Enter your average daily demand in units, your typical supplier lead time in days, and the number of days of demand you want as a safety buffer. A conservative safety stock for most products is 7-14 days; fast-moving or critical items may warrant more. The result tells you: when inventory hits this number, place your next order.',
      exampleScenario:
        'Average daily demand: 50 units. Lead time: 14 days. Safety stock: 7 days. Safety stock units = 50 x 7 = 350. Demand during lead time = 50 x 14 = 700. Reorder Point = 700 + 350 = 1,050 units. Days of supply at ROP = 1,050 / 50 = 21 days.',
      proTip:
        'Set up automated alerts in your inventory system to trigger when stock reaches the ROP. Review and update your ROP at least quarterly — demand patterns and lead times shift, and a stale ROP is as dangerous as having none. Pair ROP with EOQ for a complete inventory replenishment policy.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 48. Container Loading Space Calculator
  // =========================================================================
  {
    id: 'container-loading',
    slug: 'container-loading',
    title: 'Container Loading Space Calculator',
    description:
      'Calculate volume and weight utilisation for a shipping container, identify the limiting constraint, and see remaining capacity.',
    icon: '🚢',
    category: 'logistics',
    subcategory: 'freight',
    tags: ['container', 'loading', 'utilisation', 'volume', 'weight', 'shipping', 'freight', 'fcl'],
    inputs: [
      {
        id: 'containerType',
        label: 'Container Type (usable volume)',
        type: 'select',
        options: [
          { label: '20ft Standard (33.2 m³)', value: '33.2' },
          { label: '40ft Standard (67.6 m³)', value: '67.6' },
          { label: '40ft High Cube (76.4 m³)', value: '76.4' },
          { label: '45ft High Cube (86 m³)', value: '86' },
        ],
        defaultValue: '33.2',
        helpText: 'Usable internal volume after structural elements',
      },
      {
        id: 'cargoCbm',
        label: 'Cargo Volume (m³)',
        type: 'number',
        defaultValue: 20,
        min: 0,
        step: 0.1,
        helpText: 'Total CBM of your cargo (use the CBM calculator to find this)',
        required: true,
      },
      {
        id: 'cargoWeightTons',
        label: 'Cargo Weight (metric tons)',
        type: 'number',
        defaultValue: 10,
        min: 0,
        step: 0.1,
        helpText: 'Total weight of cargo in metric tons (1 metric ton = 1,000 kg)',
        required: true,
      },
      {
        id: 'containerMaxWeight',
        label: 'Container Max Payload',
        type: 'select',
        options: [
          { label: '20ft (28 metric tons max payload)', value: '28' },
          { label: '40ft (28 metric tons max payload)', value: '28' },
          { label: 'Custom (20 metric tons)', value: '20' },
        ],
        defaultValue: '28',
        helpText: 'Maximum cargo payload — check carrier specifications for exact limit',
      },
    ],
    formulas: [
      {
        id: 'volumeUtil',
        expression: '(cargoCbm / containerType) * 100',
        dependencies: ['cargoCbm', 'containerType'],
      },
      {
        id: 'weightUtil',
        expression: '(cargoWeightTons / containerMaxWeight) * 100',
        dependencies: ['cargoWeightTons', 'containerMaxWeight'],
      },
      {
        id: 'remainingVol',
        expression: 'containerType - cargoCbm',
        dependencies: ['containerType', 'cargoCbm'],
      },
      {
        id: 'remainingWeight',
        expression: 'containerMaxWeight - cargoWeightTons',
        dependencies: ['containerMaxWeight', 'cargoWeightTons'],
      },
      {
        // 1 if volume-limited, 2 if weight-limited
        id: 'limitingFactor',
        expression: 'volumeUtil >= weightUtil ? 1 : 2',
        dependencies: ['volumeUtil', 'weightUtil'],
      },
    ],
    outputs: [
      {
        id: 'out-volumeUtil',
        label: 'Volume Utilisation',
        formulaRef: 'volumeUtil',
        format: 'number',
        precision: 1,
        suffix: '%',
        highlight: true,
      },
      {
        id: 'out-weightUtil',
        label: 'Weight Utilisation',
        formulaRef: 'weightUtil',
        format: 'number',
        precision: 1,
        suffix: '%',
      },
      {
        id: 'out-remainingVol',
        label: 'Remaining Volume',
        formulaRef: 'remainingVol',
        format: 'number',
        precision: 2,
        suffix: ' m³',
      },
      {
        id: 'out-remainingWeight',
        label: 'Remaining Payload Capacity',
        formulaRef: 'remainingWeight',
        format: 'number',
        precision: 2,
        suffix: ' tons',
      },
    ],
    guide: {
      whatIsIt:
        'Container utilisation measures how fully you are using a shipping container by both volume and weight. FCL (Full Container Load) freight is charged per container regardless of how full it is, so maximising utilisation directly reduces cost per unit. Two constraints apply: the container volume (CBM) and the weight limit (payload). A shipment is limited by whichever constraint is hit first — a limiting factor of 1 means volume-limited, 2 means weight-limited.',
      howToUse:
        'Select the container type, enter your total cargo volume in CBM (use the CBM Calculator), and your cargo weight in metric tons. Select the container payload limit. The calculator shows utilisation percentages for both constraints and remaining capacity in each dimension.',
      exampleScenario:
        'A 20ft container (33.2 m3, 28 ton limit) loaded with 20 m3 of cargo weighing 10 tons: Volume utilisation = 20/33.2 x 100 = 60.2%. Weight utilisation = 10/28 x 100 = 35.7%. The shipment is volume-limited. There are 13.2 m3 and 18 tons of spare capacity — consider whether additional cargo from the same origin can be consolidated.',
      proTip:
        'Target 85-95% volume utilisation for FCL shipments to maximise cost efficiency. If you consistently achieve less than 70%, evaluate whether LCL (Less than Container Load) shipping might be more cost-effective. For heavy, dense goods (e.g., machinery, metals), weight limits are often hit before volume — in that case, a 20ft may need two trips while a 40ft might handle both loads at lower per-unit cost.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 49. Fuel Surcharge Calculator
  // =========================================================================
  {
    id: 'fuel-surcharge',
    slug: 'fuel-surcharge',
    title: 'Freight Fuel Surcharge Calculator',
    description:
      'Calculate the total freight cost including a carrier fuel surcharge and any additional fixed fees, and see what percentage of the total is surcharge.',
    icon: '⛽',
    category: 'logistics',
    subcategory: 'freight',
    tags: ['fuel surcharge', 'fsc', 'freight cost', 'carrier', 'logistics', 'shipping cost', 'peak season'],
    inputs: [
      {
        id: 'baseFreightCost',
        label: 'Base Freight Rate (USD)',
        type: 'number',
        defaultValue: 1000,
        min: 0,
        step: 10,
        helpText: 'The base freight rate quoted by the carrier before surcharges',
        required: true,
      },
      {
        id: 'fuelSurchargePercent',
        label: 'Fuel Surcharge Rate (%)',
        type: 'number',
        defaultValue: 18,
        min: 0,
        max: 100,
        step: 0.5,
        helpText: 'Current FSC rate from carrier. US domestic trucking avg: 10-30%. Air: 20-40%.',
        required: true,
      },
      {
        id: 'additionalSurcharges',
        label: 'Additional Fixed Surcharges (USD)',
        type: 'number',
        defaultValue: 50,
        min: 0,
        step: 5,
        helpText: 'Peak season surcharge, handling fees, security surcharges, etc.',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'fuelSurchargeAmount',
        expression: 'baseFreightCost * fuelSurchargePercent / 100',
        dependencies: ['baseFreightCost', 'fuelSurchargePercent'],
      },
      {
        id: 'totalFreightCost',
        expression: 'baseFreightCost + fuelSurchargeAmount + additionalSurcharges',
        dependencies: ['baseFreightCost', 'fuelSurchargeAmount', 'additionalSurcharges'],
      },
      {
        id: 'surchargeShare',
        expression: '(fuelSurchargeAmount / totalFreightCost) * 100',
        dependencies: ['fuelSurchargeAmount', 'totalFreightCost'],
      },
    ],
    outputs: [
      {
        id: 'out-totalFreightCost',
        label: 'Total Freight Cost',
        formulaRef: 'totalFreightCost',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
      {
        id: 'out-fuelSurchargeAmount',
        label: 'Fuel Surcharge Amount',
        formulaRef: 'fuelSurchargeAmount',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'out-surchargeShare',
        label: 'Surcharge as % of Total',
        formulaRef: 'surchargeShare',
        format: 'number',
        precision: 1,
        suffix: '%',
      },
    ],
    guide: {
      whatIsIt:
        'A Fuel Surcharge (FSC) is a variable fee added on top of the base freight rate to offset fluctuating fuel costs. Carriers update FSC rates weekly or monthly based on published fuel price indices (e.g., the US DOE diesel price for trucking, or the IATA jet fuel monitor for air freight). FSC is applied as a percentage of the base rate, so it scales with shipment size. During high-demand periods, carriers also add Peak Season Surcharges (PSS) and General Rate Increases (GRI).',
      howToUse:
        'Enter the carrier-quoted base freight rate, the current fuel surcharge percentage (check the carrier tariff — it updates regularly), and any additional fixed surcharges. The calculator shows the all-in freight cost and what fraction of the total is accounted for by fuel surcharge alone.',
      exampleScenario:
        'Base rate: $1,000. Fuel surcharge: 18% = $180. Peak season surcharge: $50. Total = $1,000 + $180 + $50 = $1,230. Fuel surcharge share of total = $180 / $1,230 = 14.6%. Budget $1,230 per shipment, not $1,000.',
      proTip:
        'Always request the full tariff breakdown from carriers, not just the base rate — FSC and accessorial charges often add 20-40% to the apparent base rate. When comparing carriers, compare all-in costs. Some shippers negotiate FSC caps in annual contracts to reduce volatility exposure. Track FSC as a separate cost line in your logistics budget for trend analysis.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 50. Total Landed Cost Calculator
  // =========================================================================
  {
    id: 'total-landed-cost',
    slug: 'total-landed-cost',
    title: 'Total Landed Cost Calculator',
    description:
      'Calculate the true cost of imported goods including product cost, freight, import duties, insurance, and handling fees — and see cost per unit.',
    icon: '🌍',
    category: 'logistics',
    subcategory: 'freight',
    tags: ['landed cost', 'import', 'duty', 'freight', 'insurance', 'customs', 'cost per unit', 'sourcing'],
    inputs: [
      {
        id: 'productCost',
        label: 'Product Cost (USD)',
        type: 'number',
        defaultValue: 5000,
        min: 0,
        step: 100,
        helpText: 'Total factory or supplier cost (ex-works price)',
        required: true,
      },
      {
        id: 'freightCost',
        label: 'Freight Cost (USD)',
        type: 'number',
        defaultValue: 800,
        min: 0,
        step: 50,
        helpText: 'Total shipping cost (sea, air, or road freight + surcharges)',
        required: true,
      },
      {
        id: 'dutyRate',
        label: 'Import Duty Rate (%)',
        type: 'number',
        defaultValue: 5,
        min: 0,
        max: 100,
        step: 0.1,
        helpText: 'Ad valorem duty rate for your product HS code. Find at your country customs website.',
        required: true,
      },
      {
        id: 'insuranceRate',
        label: 'Cargo Insurance Rate (% of CIF value)',
        type: 'number',
        defaultValue: 0.5,
        min: 0,
        max: 10,
        step: 0.1,
        helpText: 'Marine cargo insurance: typically 0.3-1% of product + freight (CIF) value',
        required: true,
      },
      {
        id: 'handlingFees',
        label: 'Handling & Clearance Fees (USD)',
        type: 'number',
        defaultValue: 150,
        min: 0,
        step: 10,
        helpText: 'Port fees, customs broker fee, drayage, warehouse handling',
        required: true,
      },
      {
        id: 'quantity',
        label: 'Number of Units',
        type: 'number',
        defaultValue: 100,
        min: 1,
        step: 1,
        helpText: 'Total units in the shipment',
        required: true,
      },
    ],
    formulas: [
      {
        // Duty is typically calculated on CIF value (product + freight)
        id: 'dutyAmount',
        expression: '(productCost + freightCost) * dutyRate / 100',
        dependencies: ['productCost', 'freightCost', 'dutyRate'],
      },
      {
        id: 'insuranceAmount',
        expression: '(productCost + freightCost) * insuranceRate / 100',
        dependencies: ['productCost', 'freightCost', 'insuranceRate'],
      },
      {
        id: 'totalLandedCost',
        expression: 'productCost + freightCost + dutyAmount + insuranceAmount + handlingFees',
        dependencies: ['productCost', 'freightCost', 'dutyAmount', 'insuranceAmount', 'handlingFees'],
      },
      {
        id: 'costPerUnit',
        expression: 'totalLandedCost / quantity',
        dependencies: ['totalLandedCost', 'quantity'],
      },
      {
        id: 'landedVsProduct',
        expression: '(totalLandedCost / productCost - 1) * 100',
        dependencies: ['totalLandedCost', 'productCost'],
      },
    ],
    outputs: [
      {
        id: 'out-costPerUnit',
        label: 'Cost Per Unit (Landed)',
        formulaRef: 'costPerUnit',
        format: 'currency',
        precision: 2,
        highlight: true,
      },
      {
        id: 'out-totalLandedCost',
        label: 'Total Landed Cost',
        formulaRef: 'totalLandedCost',
        format: 'currency',
        precision: 2,
      },
      {
        id: 'out-landedVsProduct',
        label: 'Markup vs. Product Cost Only',
        formulaRef: 'landedVsProduct',
        format: 'number',
        precision: 1,
        suffix: '%',
      },
      {
        id: 'out-dutyAmount',
        label: 'Duty Amount',
        formulaRef: 'dutyAmount',
        format: 'currency',
        precision: 2,
      },
    ],
    guide: {
      whatIsIt:
        'Total Landed Cost (TLC) is the complete cost of getting a product from the supplier to your warehouse, ready to sell or use. It includes: product cost + freight + import duties + cargo insurance + customs broker and handling fees. Many buyers compare suppliers on ex-works price alone and are surprised when landed cost is 20-40% higher. TLC is essential for accurate margin calculations, supplier comparisons across countries, and pricing decisions.',
      howToUse:
        'Enter your supplier cost (ex-works), freight cost, import duty rate for your product HS code, cargo insurance rate, handling and clearance fees, and the total number of units. The calculator computes total landed cost, cost per unit, and the percentage markup over product cost alone. Duties are calculated on the CIF value (product + freight), which is standard for most countries.',
      exampleScenario:
        'Product: $5,000. Freight: $800. Duty: 5% of $5,800 = $290. Insurance: 0.5% of $5,800 = $29. Handling: $150. Total landed = $6,269. For 100 units: $62.69 per unit — 25.4% above the $50 ex-works cost per unit. A retail price of $80 yields a margin of 21.6% on landed cost, not the 37.5% it appeared at ex-works.',
      proTip:
        'Always build TLC models before committing to a new supplier. A cheaper ex-works price from a more distant country (e.g., Bangladesh vs. China) can result in a higher TLC due to longer transit times, higher freight costs, and different duty rates. Use TLC to compare suppliers on a true apples-to-apples basis. Also factor in time cost of capital: longer transit means more working capital tied up in transit inventory.',
    },
    metadata: { version: '1.0.0' },
  },
];
