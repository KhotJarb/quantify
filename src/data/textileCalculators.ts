import type { CalculatorSchema } from '@/types/calculator';

export const textileCalculators: CalculatorSchema[] = [

  // ─── 81. Fabric Yardage for Garments ────────────────────────────────
  {
    id: 'fabric-yardage',
    slug: 'fabric-yardage',
    title: 'Fabric Yardage Calculator',
    description: 'Estimate how many yards of fabric you need for a garment based on pattern area, fabric width, seam allowance, and layout efficiency.',
    icon: '🧵',
    category: 'textile',
    subcategory: 'sewing',
    tags: ['fabric yardage', 'sewing', 'garment', 'pattern', 'seam allowance', 'fabric width'],
    inputs: [
      {
        id: 'patternArea',
        label: 'Total Pattern Piece Area (sq inches)',
        type: 'number',
        defaultValue: 2000,
        min: 100,
        helpText: 'Estimated total pattern piece area. Blouse: ~1500, Dress: ~3000, Pants: ~2500.',
      },
      {
        id: 'fabricWidth',
        label: 'Fabric Width',
        type: 'select',
        defaultValue: '44',
        options: [
          { label: '44/45 inch (112 cm)', value: '44' },
          { label: '54 inch (137 cm)', value: '54' },
          { label: '58/60 inch (150 cm)', value: '58' },
        ],
      },
      {
        id: 'seamAllowanceInches',
        label: 'Seam Allowance (inches)',
        type: 'number',
        defaultValue: 0.625,
        step: 0.125,
        min: 0,
        helpText: '5/8 inch = 0.625, 1/2 inch = 0.5.',
      },
      {
        id: 'layoutEfficiency',
        label: 'Layout Efficiency (%)',
        type: 'number',
        defaultValue: 75,
        min: 30,
        max: 100,
        helpText: 'How efficiently pieces are laid out. Typical: 70-80%.',
      },
    ],
    formulas: [
      {
        id: 'adjustedArea',
        expression: 'patternArea * (1 + seamAllowanceInches / 10)',
        dependencies: ['patternArea', 'seamAllowanceInches'],
      },
      {
        id: 'fabricAreaPerYard',
        expression: 'fabricWidth * 36',
        dependencies: ['fabricWidth'],
      },
      {
        id: 'yardage',
        expression: '(adjustedArea / fabricAreaPerYard) / (layoutEfficiency / 100)',
        dependencies: ['adjustedArea', 'fabricAreaPerYard', 'layoutEfficiency'],
      },
      {
        id: 'yardageRoundUp',
        expression: 'ceil(yardage * 8) / 8',
        dependencies: ['yardage'],
      },
      {
        id: 'meters',
        expression: 'yardageRoundUp * 0.9144',
        dependencies: ['yardageRoundUp'],
      },
    ],
    outputs: [
      {
        id: 'yardageRoundUpOut',
        label: 'Fabric Needed (rounded up to 1/8 yd)',
        formulaRef: 'yardageRoundUp',
        precision: 3,
        suffix: ' yards',
        highlight: true,
      },
      {
        id: 'metersOut',
        label: 'In Meters',
        formulaRef: 'meters',
        precision: 2,
        suffix: ' m',
      },
      {
        id: 'yardageOut',
        label: 'Exact Yardage',
        formulaRef: 'yardage',
        precision: 3,
        suffix: ' yards',
      },
    ],
    guide: {
      whatIsIt:
        'Fabric yardage calculation estimates how many linear yards of fabric you need to cut all pattern pieces. The total area of pattern pieces is divided by the fabric area per yard (width x 36 inches), then divided by layout efficiency to account for the irregular shapes that waste fabric between pieces. Seam allowance adds extra area around each piece.',
      howToUse:
        'Enter the total area of all your pattern pieces in square inches (check your pattern envelope, or estimate from piece dimensions). Select your fabric width, enter the seam allowance, and the typical layout efficiency for your pattern complexity. The result is rounded up to the nearest 1/8 yard as fabric is sold.',
      exampleScenario:
        'A dress pattern with 3,000 sq inches total area, 5/8 inch seam allowance, 44-inch fabric, 75% efficiency: adjusted area = 3,187.5, fabric per yard = 1,584, raw yardage = 2.68, rounded to 2.75 yards. Always buy an extra 1/4-1/2 yard for directional prints or matching.',
      proTip:
        "For directional fabrics (stripes, plaids, large prints), reduce layout efficiency to 60-65% as pieces must be aligned. For napped fabrics (velvet, corduroy), all pieces must face the same direction — reduce efficiency to 55-65%. Pattern envelopes list yardage requirements for standard sizes; this calculator is useful for custom sizes or when you don't have the pattern envelope.",
    },
    metadata: { version: '1.0.0' },
  },

  // ─── 82. Quilt Binding & Backing ─────────────────────────────────────
  {
    id: 'quilt-binding',
    slug: 'quilt-binding',
    title: 'Quilt Binding & Backing Calculator',
    description: 'Calculate the exact yardage needed for quilt binding strips and backing fabric based on quilt dimensions.',
    icon: '🛏️',
    category: 'textile',
    subcategory: 'sewing',
    tags: ['quilt', 'binding', 'backing', 'quilting', 'fabric', 'yardage', 'sewing'],
    inputs: [
      {
        id: 'quiltLength',
        label: 'Quilt Length (inches)',
        type: 'number',
        defaultValue: 60,
        min: 1,
        placeholder: 'e.g. 60',
      },
      {
        id: 'quiltWidth',
        label: 'Quilt Width (inches)',
        type: 'number',
        defaultValue: 50,
        min: 1,
        placeholder: 'e.g. 50',
      },
      {
        id: 'bindingWidth',
        label: 'Binding Strip Cut Width (inches)',
        type: 'number',
        defaultValue: 2.5,
        step: 0.25,
        min: 1,
        helpText: 'Cut width. 2.5 inch strips for standard double-fold binding.',
      },
      {
        id: 'backingOverhang',
        label: 'Backing Overhang (inches per side)',
        type: 'number',
        defaultValue: 4,
        min: 0,
        helpText: 'Extra inches on each side for the quilt sandwich.',
      },
    ],
    formulas: [
      {
        id: 'perimeter',
        expression: '2 * (quiltLength + quiltWidth)',
        dependencies: ['quiltLength', 'quiltWidth'],
      },
      {
        id: 'bindingNeeded',
        expression: 'perimeter + 20',
        dependencies: ['perimeter'],
      },
      {
        id: 'bindingStrips',
        expression: 'ceil(bindingNeeded / 40)',
        dependencies: ['bindingNeeded'],
      },
      {
        id: 'bindingYards',
        expression: '(bindingStrips * bindingWidth) / 36',
        dependencies: ['bindingStrips', 'bindingWidth'],
      },
      {
        id: 'backingLength',
        expression: 'quiltLength + 2 * backingOverhang',
        dependencies: ['quiltLength', 'backingOverhang'],
      },
      {
        id: 'backingWidth',
        expression: 'quiltWidth + 2 * backingOverhang',
        dependencies: ['quiltWidth', 'backingOverhang'],
      },
      {
        id: 'backingYards',
        expression: '(backingLength * backingWidth) / (36 * 44)',
        dependencies: ['backingLength', 'backingWidth'],
      },
    ],
    outputs: [
      {
        id: 'bindingYardsOut',
        label: 'Binding Fabric Needed',
        formulaRef: 'bindingYards',
        precision: 2,
        suffix: ' yards',
        highlight: true,
      },
      {
        id: 'backingYardsOut',
        label: 'Backing Fabric Needed',
        formulaRef: 'backingYards',
        precision: 2,
        suffix: ' yards',
      },
      {
        id: 'bindingStripsOut',
        label: 'Number of Strips to Cut',
        formulaRef: 'bindingStrips',
        precision: 0,
      },
      {
        id: 'bindingNeededOut',
        label: 'Total Binding Length',
        formulaRef: 'bindingNeeded',
        precision: 0,
        suffix: ' inches',
      },
    ],
    guide: {
      whatIsIt:
        'Quilt binding covers the raw edges of the quilt sandwich (top + batting + backing). The total binding length required = quilt perimeter + 20 inches extra for corners and joining. Binding strips are cut across the fabric width (~40 usable inches from a 44-inch fabric after selvedges). Backing fabric must be larger than the quilt top on all sides for the basting process.',
      howToUse:
        'Enter your finished quilt length and width in inches, the cut width of your binding strips (2.5 inches is standard for double-fold binding), and the backing overhang on each side (4 inches is typical). The calculator outputs binding yardage, number of strips, and backing yardage.',
      exampleScenario:
        'Quilt 60x50 inches: perimeter = 220 inches, binding needed = 240 inches. At 40 usable inches per strip: 6 strips needed. 6 strips x 2.5 inches / 36 = 0.42 yards binding fabric. Backing at 4-inch overhang: 68x58 inches = 0.61 yards (assuming 44-inch wide fabric with a seam).',
      proTip:
        'Always buy an extra 1/4 yard of binding fabric for safety and to account for angled joins. For backing fabric wider than 44 inches, you will need to piece together fabric strips — factor in seam allowances. Pre-wash all quilting fabrics before cutting to prevent shrinkage after the quilt is finished.',
    },
    metadata: { version: '1.0.0' },
  },

  // ─── 83. Knitting Gauge & Stitches ──────────────────────────────────
  {
    id: 'knitting-gauge',
    slug: 'knitting-gauge',
    title: 'Knitting Gauge & Stitch Calculator',
    description: 'Calculate cast-on stitches and total rows needed for any knitted piece from gauge swatch measurements.',
    icon: '🪡',
    category: 'textile',
    subcategory: 'knitting',
    tags: ['knitting', 'gauge', 'stitches', 'rows', 'cast on', 'swatch', 'yarn'],
    inputs: [
      {
        id: 'finishedWidthIn',
        label: 'Desired Finished Width (inches)',
        type: 'number',
        defaultValue: 20,
        min: 1,
        helpText: 'The desired width of the finished knitted piece.',
      },
      {
        id: 'finishedLengthIn',
        label: 'Desired Finished Length (inches)',
        type: 'number',
        defaultValue: 24,
        min: 1,
        placeholder: 'e.g. 24',
      },
      {
        id: 'stitchesPer4In',
        label: 'Stitches per 4 Inches (from swatch)',
        type: 'number',
        defaultValue: 18,
        min: 1,
        helpText: 'From your blocked gauge swatch. Measure over 4 inches.',
      },
      {
        id: 'rowsPer4In',
        label: 'Rows per 4 Inches (from swatch)',
        type: 'number',
        defaultValue: 24,
        min: 1,
        helpText: 'Row gauge from your blocked swatch.',
      },
    ],
    formulas: [
      {
        id: 'castOnStitches',
        expression: 'round(finishedWidthIn * stitchesPer4In / 4)',
        dependencies: ['finishedWidthIn', 'stitchesPer4In'],
      },
      {
        id: 'totalRows',
        expression: 'round(finishedLengthIn * rowsPer4In / 4)',
        dependencies: ['finishedLengthIn', 'rowsPer4In'],
      },
      {
        id: 'totalStitches',
        expression: 'castOnStitches * totalRows',
        dependencies: ['castOnStitches', 'totalRows'],
      },
    ],
    outputs: [
      {
        id: 'castOnStitchesOut',
        label: 'Cast On Stitches',
        formulaRef: 'castOnStitches',
        precision: 0,
        highlight: true,
      },
      {
        id: 'totalRowsOut',
        label: 'Total Rows to Knit',
        formulaRef: 'totalRows',
        precision: 0,
      },
      {
        id: 'totalStitchesOut',
        label: 'Total Stitches',
        formulaRef: 'totalStitches',
        precision: 0,
      },
    ],
    guide: {
      whatIsIt:
        'Gauge is the number of stitches and rows in a 4-inch (10 cm) square knitted in your chosen yarn and stitch pattern. It is the single most important measurement in knitting because it converts pattern dimensions into actual stitch and row counts. Cast-on stitches = (finished width / 4) x stitch gauge. Total rows = (finished length / 4) x row gauge.',
      howToUse:
        'Knit a gauge swatch at least 6 inches square in your yarn and stitch pattern. Block the swatch (wet it, pin to measurements, let dry). Measure stitches and rows over 4 inches in the center of the swatch. Enter these measurements and your desired finished dimensions.',
      exampleScenario:
        'Gauge: 18 stitches and 24 rows per 4 inches. Desired finished size: 20 inches wide, 24 inches long. Cast on = round(20 x 18 / 4) = 90 stitches. Total rows = round(24 x 24 / 4) = 144 rows.',
      proTip:
        'Always swatch in the yarn AND needles AND stitch pattern you will use for the project. Row gauge is often secondary to stitch gauge in patterns, but critical for colorwork and shaped pieces. If your gauge is off, try different needle sizes — one needle size up or down typically shifts gauge by about 1 stitch per 4 inches. Never skip swatching for fitted garments.',
    },
    metadata: { version: '1.0.0' },
  },

  // ─── 84. Yarn Yardage / Weight Conversion ────────────────────────────
  {
    id: 'yarn-yardage',
    slug: 'yarn-yardage',
    title: 'Yarn Yardage & Weight Conversion',
    description: 'Calculate how many skeins of yarn you need for a project, and convert between yards per skein and grams.',
    icon: '🧶',
    category: 'textile',
    subcategory: 'knitting',
    tags: ['yarn', 'yardage', 'skeins', 'weight', 'knitting', 'crochet', 'grams'],
    inputs: [
      {
        id: 'totalYards',
        label: 'Yards per Skein',
        type: 'number',
        defaultValue: 220,
        min: 1,
        helpText: 'Number of yards on each skein (check the label).',
      },
      {
        id: 'weightGrams',
        label: 'Grams per Skein',
        type: 'number',
        defaultValue: 100,
        min: 1,
        helpText: 'Weight of each skein in grams.',
      },
      {
        id: 'yardsNeeded',
        label: 'Total Yards Needed for Project',
        type: 'number',
        defaultValue: 440,
        min: 1,
        helpText: 'Total yardage required by your pattern.',
      },
    ],
    formulas: [
      {
        id: 'yardsPer100g',
        expression: '(totalYards / weightGrams) * 100',
        dependencies: ['totalYards', 'weightGrams'],
      },
      {
        id: 'yardsPerOz',
        expression: 'totalYards / (weightGrams / 28.3495)',
        dependencies: ['totalYards', 'weightGrams'],
      },
      {
        id: 'skeinsNeeded',
        expression: 'ceil(yardsNeeded / totalYards)',
        dependencies: ['yardsNeeded', 'totalYards'],
      },
      {
        id: 'gramsNeeded',
        expression: '(yardsNeeded / totalYards) * weightGrams',
        dependencies: ['yardsNeeded', 'totalYards', 'weightGrams'],
      },
    ],
    outputs: [
      {
        id: 'skeinsNeededOut',
        label: 'Skeins Needed',
        formulaRef: 'skeinsNeeded',
        precision: 0,
        highlight: true,
      },
      {
        id: 'gramsNeededOut',
        label: 'Grams of Yarn Needed',
        formulaRef: 'gramsNeeded',
        precision: 1,
        suffix: ' g',
      },
      {
        id: 'yardsPer100gOut',
        label: 'Yards per 100g',
        formulaRef: 'yardsPer100g',
        precision: 0,
        suffix: ' yd/100g',
      },
    ],
    guide: {
      whatIsIt:
        'Yarn yardage is the total length of yarn wound on a skein. Patterns list total yardage needed; you divide by yards per skein and round up to find how many skeins to buy. The yards-per-100g metric lets you compare yarn densities across different weights and fiber types.',
      howToUse:
        'Read the yards and grams from your yarn label. Enter the total yardage required by your pattern. The calculator tells you how many complete skeins to buy and how many grams total you need.',
      exampleScenario:
        '220 yards per skein, 100g per skein. Pattern needs 440 yards: buy 2 skeins (200g). Yards per 100g = 220 yd/100g — this is typical DK weight yarn. Worsted weight is usually 190-200 yd/100g; lace weight 800-1000+ yd/100g.',
      proTip:
        'Always buy one extra skein beyond what you calculate — dye lot differences make it impossible to perfectly match yarn purchased later. Store the spare skein and return it if unused (many yarn stores allow returns on full skeins). For color-sensitive projects, check that all skeins share the same dye lot number printed on the label.',
    },
    metadata: { version: '1.0.0' },
  },

  // ─── 85. Resin Volume for Molds ──────────────────────────────────────
  {
    id: 'resin-volume',
    slug: 'resin-volume',
    title: 'Resin Volume for Molds',
    description: 'Calculate the exact amount of epoxy resin needed for rectangular, cylindrical, or dome molds, with shrinkage and mix ratio corrections.',
    icon: '🔮',
    category: 'textile',
    subcategory: 'crafts',
    tags: ['resin', 'epoxy', 'mold', 'volume', 'crafts', 'casting', 'shrinkage'],
    inputs: [
      {
        id: 'moldShape',
        label: 'Mold Shape',
        type: 'select',
        defaultValue: '1',
        options: [
          { label: 'Rectangular / Square', value: '1' },
          { label: 'Cylinder / Round', value: '2' },
          { label: 'Dome / Hemisphere', value: '3' },
        ],
      },
      {
        id: 'dim1',
        label: 'Length or Diameter (cm)',
        type: 'number',
        defaultValue: 10,
        min: 0.1,
        step: 0.5,
        helpText: 'Length for rectangular, Diameter for cylinder/dome.',
      },
      {
        id: 'dim2',
        label: 'Width (cm) — Rectangular only',
        type: 'number',
        defaultValue: 8,
        min: 0.1,
        step: 0.5,
        helpText: 'Width for rectangular molds. Ignored for round and dome.',
      },
      {
        id: 'dim3',
        label: 'Height or Depth (cm)',
        type: 'number',
        defaultValue: 3,
        min: 0.1,
        step: 0.5,
        helpText: 'Height for rectangular/cylinder. Ignored for dome (radius = dim1/2).',
      },
      {
        id: 'shrinkagePercent',
        label: 'Shrinkage / Overpour (%)',
        type: 'number',
        defaultValue: 5,
        min: 0,
        max: 20,
        helpText: 'Epoxy resin shrinks 3-5% during cure. Add extra to compensate.',
      },
      {
        id: 'mixRatio',
        label: 'Mix Ratio (Hardener to Resin)',
        type: 'select',
        defaultValue: '1',
        options: [
          { label: '1:1 by volume (50/50)', value: '1' },
          { label: '2:1 by volume (Resin:Hardener)', value: '0.5' },
          { label: '3:1 by volume (Resin:Hardener)', value: '0.33' },
        ],
        helpText: 'Check your resin product data sheet for the correct ratio.',
      },
    ],
    formulas: [
      {
        id: 'volumeRect',
        expression: 'dim1 * dim2 * dim3',
        dependencies: ['dim1', 'dim2', 'dim3'],
      },
      {
        id: 'volumeCyl',
        expression: '3.14159265 * pow(dim1 / 2, 2) * dim3',
        dependencies: ['dim1', 'dim3'],
      },
      {
        id: 'volumeDome',
        expression: '(2 / 3) * 3.14159265 * pow(dim1 / 2, 3)',
        dependencies: ['dim1'],
      },
      {
        id: 'rawVolume',
        expression: 'moldShape == 1 ? volumeRect : (moldShape == 2 ? volumeCyl : volumeDome)',
        dependencies: ['moldShape', 'volumeRect', 'volumeCyl', 'volumeDome'],
      },
      {
        id: 'totalResinMl',
        expression: 'rawVolume * (1 + shrinkagePercent / 100)',
        dependencies: ['rawVolume', 'shrinkagePercent'],
      },
      {
        id: 'partAMl',
        expression: 'totalResinMl / (1 + mixRatio)',
        dependencies: ['totalResinMl', 'mixRatio'],
      },
      {
        id: 'partBMl',
        expression: 'totalResinMl - partAMl',
        dependencies: ['totalResinMl', 'partAMl'],
      },
    ],
    outputs: [
      {
        id: 'totalResinMlOut',
        label: 'Total Resin Needed',
        formulaRef: 'totalResinMl',
        precision: 1,
        suffix: ' mL',
        highlight: true,
      },
      {
        id: 'partAMlOut',
        label: 'Part A (Resin)',
        formulaRef: 'partAMl',
        precision: 1,
        suffix: ' mL',
      },
      {
        id: 'partBMlOut',
        label: 'Part B (Hardener)',
        formulaRef: 'partBMl',
        precision: 1,
        suffix: ' mL',
      },
    ],
    guide: {
      whatIsIt:
        'Resin casting requires measuring exact volumes of Part A (resin) and Part B (hardener) and mixing them at the ratio specified by the manufacturer. Under- or over-pouring leads to sticky uncured resin. Shrinkage during cure means you need slightly more resin than the mold volume. Volume formulas: rectangular = L x W x H; cylinder = pi x (D/2)^2 x H; hemisphere = (2/3) x pi x (D/2)^3.',
      howToUse:
        'Select your mold shape and enter dimensions in centimeters. Enter the shrinkage percentage (5% is safe for most epoxies) and your product mix ratio. The calculator outputs total resin needed and the exact Part A and Part B amounts to measure.',
      exampleScenario:
        '10 x 8 x 3 cm rectangular mold: raw volume = 240 mL. With 5% shrinkage: 252 mL total. At 1:1 mix ratio: 126 mL Part A + 126 mL Part B.',
      proTip:
        'Always measure resin by volume using graduated mixing cups — weight-based mixing only works if you know each component density. Mix slowly for at least 3-5 minutes, scraping sides and bottom. Pour slowly to minimize bubbles. A heat gun or torch passed briefly over the surface removes surface bubbles. Work in a warm room (20-25°C) for best results — cold temperatures dramatically slow cure time.',
    },
    metadata: { version: '1.0.0' },
  },

  // ─── 86. Soap Lye Calculator ─────────────────────────────────────────
  {
    id: 'soap-lye',
    slug: 'soap-lye',
    title: 'Soap Lye (Saponification) Calculator',
    description: 'Calculate the exact amount of NaOH or KOH lye needed to saponify various oils for cold-process soap making, with superfat adjustment.',
    icon: '🧼',
    category: 'textile',
    subcategory: 'crafts',
    tags: ['soap', 'lye', 'NaOH', 'KOH', 'saponification', 'cold process', 'soap making', 'superfat'],
    inputs: [
      {
        id: 'oilWeight',
        label: 'Oil Weight (grams)',
        type: 'number',
        defaultValue: 500,
        min: 1,
        placeholder: 'e.g. 500',
      },
      {
        id: 'oilType',
        label: 'Oil Type (SAP value)',
        type: 'select',
        defaultValue: '0.134',
        options: [
          { label: 'Olive Oil (SAP 0.134)', value: '0.134' },
          { label: 'Coconut Oil (SAP 0.178)', value: '0.178' },
          { label: 'Palm Oil (SAP 0.141)', value: '0.141' },
          { label: 'Castor Oil (SAP 0.128)', value: '0.128' },
          { label: 'Shea Butter (SAP 0.128)', value: '0.128' },
          { label: 'Avocado Oil (SAP 0.133)', value: '0.133' },
        ],
      },
      {
        id: 'lyeType',
        label: 'Lye Type',
        type: 'select',
        defaultValue: '1',
        options: [
          { label: 'NaOH — Bar Soap (x1.0)', value: '1' },
          { label: 'KOH — Liquid Soap (x1.4)', value: '1.4' },
        ],
      },
      {
        id: 'superfatPercent',
        label: 'Superfat (%)',
        type: 'number',
        defaultValue: 5,
        min: 0,
        max: 20,
        helpText: '5% superfat = gentle, conditioning bar. Higher = softer, oilier feel.',
      },
    ],
    formulas: [
      {
        id: 'lyeNeeded',
        expression: 'oilWeight * oilType * lyeType',
        dependencies: ['oilWeight', 'oilType', 'lyeType'],
      },
      {
        id: 'superfatFactor',
        expression: '1 - superfatPercent / 100',
        dependencies: ['superfatPercent'],
      },
      {
        id: 'lyeWithSuperfat',
        expression: 'lyeNeeded * superfatFactor',
        dependencies: ['lyeNeeded', 'superfatFactor'],
      },
      {
        id: 'waterNeeded',
        expression: 'lyeWithSuperfat * 2.5',
        dependencies: ['lyeWithSuperfat'],
      },
    ],
    outputs: [
      {
        id: 'lyeWithSuperfatOut',
        label: 'Lye (NaOH/KOH) Needed',
        formulaRef: 'lyeWithSuperfat',
        precision: 1,
        suffix: ' g',
        highlight: true,
      },
      {
        id: 'waterNeededOut',
        label: 'Distilled Water Needed',
        formulaRef: 'waterNeeded',
        precision: 1,
        suffix: ' g',
      },
    ],
    guide: {
      whatIsIt:
        'Saponification is the chemical reaction between lye (sodium hydroxide for bar soap, potassium hydroxide for liquid soap) and oils to produce soap and glycerin. The SAP value (saponification value) for each oil specifies exactly how many grams of NaOH are needed to fully react with 1 gram of that oil. Superfat leaves a percentage of unreacted oil in the finished soap for a conditioning, skin-friendly bar.',
      howToUse:
        'Select your oil, lye type, and enter the oil weight and desired superfat percentage. The calculator outputs the exact lye weight and distilled water needed. Scale your recipe by changing the oil weight — the lye amount scales proportionally.',
      exampleScenario:
        '500g olive oil, NaOH, 5% superfat: lye needed = 500 x 0.134 = 67g NaOH full saponification; with 5% superfat: 67 x 0.95 = 63.7g NaOH. Water = 63.7 x 2.5 = 159.2g distilled water.',
      proTip:
        'SAFETY FIRST: Always add lye TO water — never add water to lye (this causes violent boiling and splashing). Lye solution heats to 90°C immediately — work in a well-ventilated area, wear gloves, goggles, and long sleeves. Use a digital scale for lye — never measure by volume. Lye is caustic and will cause chemical burns. Always use distilled water (tap water minerals can affect saponification). Fresh soap needs 4-6 weeks curing time before use.',
    },
    metadata: { version: '1.0.0' },
  },

  // ─── 87. Candle Wax Calculator ───────────────────────────────────────
  {
    id: 'candle-wax',
    slug: 'candle-wax',
    title: 'Candle Wax Calculator',
    description: 'Calculate wax weight, fragrance oil, and wick length for candle making based on container volume, wax type, and fragrance load.',
    icon: '🕯️',
    category: 'textile',
    subcategory: 'crafts',
    tags: ['candle', 'wax', 'fragrance', 'wick', 'candle making', 'soy wax', 'crafts'],
    inputs: [
      {
        id: 'containerVolumeMl',
        label: 'Container Volume (mL)',
        type: 'number',
        defaultValue: 300,
        min: 10,
        helpText: '8 oz jar = approx 237 mL, 12 oz jar = approx 355 mL.',
      },
      {
        id: 'waxType',
        label: 'Wax Type (density g/mL)',
        type: 'select',
        defaultValue: '0.90',
        options: [
          { label: 'Soy Wax (0.90 g/mL)', value: '0.90' },
          { label: 'Paraffin (0.90 g/mL)', value: '0.90' },
          { label: 'Beeswax (0.96 g/mL)', value: '0.96' },
          { label: 'Coconut Wax (0.88 g/mL)', value: '0.88' },
        ],
      },
      {
        id: 'fragranceLoadPercent',
        label: 'Fragrance Load (%)',
        type: 'number',
        defaultValue: 8,
        min: 0,
        max: 12,
        step: 0.5,
        helpText: 'Soy: max 10%, Paraffin: max 12%. Above max causes seepage.',
      },
      {
        id: 'numCandles',
        label: 'Number of Candles',
        type: 'number',
        defaultValue: 1,
        min: 1,
        placeholder: 'e.g. 1',
      },
    ],
    formulas: [
      {
        id: 'fillFactor',
        expression: '0.85',
        dependencies: [],
      },
      {
        id: 'waxPerCandle',
        expression: 'containerVolumeMl * waxType * fillFactor',
        dependencies: ['containerVolumeMl', 'waxType', 'fillFactor'],
      },
      {
        id: 'fragrancePerCandle',
        expression: 'waxPerCandle * fragranceLoadPercent / 100',
        dependencies: ['waxPerCandle', 'fragranceLoadPercent'],
      },
      {
        id: 'totalWax',
        expression: 'waxPerCandle * numCandles',
        dependencies: ['waxPerCandle', 'numCandles'],
      },
      {
        id: 'totalFragrance',
        expression: 'fragrancePerCandle * numCandles',
        dependencies: ['fragrancePerCandle', 'numCandles'],
      },
      {
        id: 'wickLength',
        expression: 'ceil(containerVolumeMl / 50)',
        dependencies: ['containerVolumeMl'],
      },
    ],
    outputs: [
      {
        id: 'totalWaxOut',
        label: 'Total Wax Needed',
        formulaRef: 'totalWax',
        precision: 1,
        suffix: ' g',
        highlight: true,
      },
      {
        id: 'totalFragranceOut',
        label: 'Fragrance Oil Needed',
        formulaRef: 'totalFragrance',
        precision: 1,
        suffix: ' g',
      },
      {
        id: 'fragrancePerCandleOut',
        label: 'Fragrance per Candle',
        formulaRef: 'fragrancePerCandle',
        precision: 1,
        suffix: ' g',
      },
    ],
    guide: {
      whatIsIt:
        'Candle wax weight is calculated as: container volume x wax density x fill factor (85%, leaving headspace for a clean burn pool). Fragrance oil is added as a percentage of the wax weight — too much causes fragrance seepage or fire hazard; too little gives poor scent throw. Different wax types have different densities and fragrance load limits.',
      howToUse:
        'Enter your container volume in mL (measure with water), select your wax type, set the fragrance load percentage, and enter how many candles you are making. The calculator outputs total wax and fragrance oil weights.',
      exampleScenario:
        '300 mL container, Soy Wax, 8% fragrance, 1 candle: Wax = 300 x 0.90 x 0.85 = 229.5g. Fragrance = 229.5 x 0.08 = 18.4g. Total materials for this candle: 229.5g soy wax + 18.4g fragrance oil.',
      proTip:
        'Pour soy wax at 55-65°C (130-150°F) and add fragrance at 60°C (140°F) for best scent binding. Allow to cure 48-72 hours before burning — curing improves scent throw significantly. Wick sizing is critical: too small gives a poor burn pool; too large produces soot. Test burn every new container + wax + fragrance combination. The 85% fill factor is intentional — a full jar prevents proper air circulation during burning.',
    },
    metadata: { version: '1.0.0' },
  },

  // ─── 88. Cross Stitch Fabric Size ────────────────────────────────────
  {
    id: 'cross-stitch-size',
    slug: 'cross-stitch-size',
    title: 'Cross Stitch Fabric Size Calculator',
    description: 'Calculate the fabric dimensions needed for a cross stitch design based on stitch count, fabric count, and border allowance.',
    icon: '✂️',
    category: 'textile',
    subcategory: 'sewing',
    tags: ['cross stitch', 'embroidery', 'aida', 'fabric count', 'stitch count', 'needlework'],
    inputs: [
      {
        id: 'stitchWidth',
        label: 'Design Width (stitches)',
        type: 'number',
        defaultValue: 150,
        min: 1,
        helpText: 'Number of stitches across the widest point of the design.',
      },
      {
        id: 'stitchHeight',
        label: 'Design Height (stitches)',
        type: 'number',
        defaultValue: 200,
        min: 1,
        helpText: 'Number of stitches from top to bottom of the design.',
      },
      {
        id: 'fabricCount',
        label: 'Fabric Count (stitches per inch)',
        type: 'select',
        defaultValue: '14',
        options: [
          { label: '14-count Aida (most common)', value: '14' },
          { label: '16-count Aida', value: '16' },
          { label: '18-count Aida', value: '18' },
          { label: '28-count Evenweave (stitched over 2)', value: '14' },
          { label: '32-count Evenweave (stitched over 2)', value: '16' },
        ],
        helpText: 'Evenweave options show effective count when stitched over 2 threads.',
      },
      {
        id: 'borderInches',
        label: 'Border on Each Side (inches)',
        type: 'number',
        defaultValue: 3,
        min: 0,
        helpText: 'Extra fabric on each side for framing or finishing.',
      },
    ],
    formulas: [
      {
        id: 'designWidthIn',
        expression: 'stitchWidth / fabricCount',
        dependencies: ['stitchWidth', 'fabricCount'],
      },
      {
        id: 'designHeightIn',
        expression: 'stitchHeight / fabricCount',
        dependencies: ['stitchHeight', 'fabricCount'],
      },
      {
        id: 'totalWidthIn',
        expression: 'designWidthIn + 2 * borderInches',
        dependencies: ['designWidthIn', 'borderInches'],
      },
      {
        id: 'totalHeightIn',
        expression: 'designHeightIn + 2 * borderInches',
        dependencies: ['designHeightIn', 'borderInches'],
      },
      {
        id: 'totalWidthCm',
        expression: 'totalWidthIn * 2.54',
        dependencies: ['totalWidthIn'],
      },
      {
        id: 'totalHeightCm',
        expression: 'totalHeightIn * 2.54',
        dependencies: ['totalHeightIn'],
      },
    ],
    outputs: [
      {
        id: 'totalWidthInOut',
        label: 'Fabric Width',
        formulaRef: 'totalWidthIn',
        precision: 2,
        suffix: ' inches',
        highlight: true,
      },
      {
        id: 'totalHeightInOut',
        label: 'Fabric Height',
        formulaRef: 'totalHeightIn',
        precision: 2,
        suffix: ' inches',
      },
      {
        id: 'totalWidthCmOut',
        label: 'Width in cm',
        formulaRef: 'totalWidthCm',
        precision: 1,
        suffix: ' cm',
      },
      {
        id: 'totalHeightCmOut',
        label: 'Height in cm',
        formulaRef: 'totalHeightCm',
        precision: 1,
        suffix: ' cm',
      },
      {
        id: 'designWidthInOut',
        label: 'Design Width Only',
        formulaRef: 'designWidthIn',
        precision: 2,
        suffix: ' inches',
      },
    ],
    guide: {
      whatIsIt:
        'Cross stitch fabric size is determined by dividing the design stitch count by the fabric count (stitches per inch), then adding a border of unstitched fabric on all four sides for framing. 14-count Aida is the most popular — each square of the Aida weave holds one cross stitch. Higher count = smaller design; lower count = larger design.',
      howToUse:
        'Enter the stitch width and height from your pattern chart, select your fabric count, and set the border size in inches (3 inches is standard for framing). The calculator outputs the required fabric dimensions in both inches and centimeters.',
      exampleScenario:
        '150 stitches wide x 200 stitches tall on 14-count Aida: Design = 10.7" x 14.3". With a 3-inch border: fabric needed = 16.7" x 20.3" (42.4 x 51.5 cm). Buy the nearest standard Aida size that fits.',
      proTip:
        'Standard Aida fabric is sold in 14-count (most common), 16-count, and 18-count. For finer work, 28-count or 32-count evenweave is stitched over two threads, giving the same effective count as 14 or 16 count Aida with a smoother fabric texture. Always add at least 3 inches border for standard frames; 4-5 inches for larger pieces. Tape or zigzag the raw edges before stitching to prevent fraying.',
    },
    metadata: { version: '1.0.0' },
  },

  // ─── 89. Circle Skirt Fabric ─────────────────────────────────────────
  {
    id: 'circle-skirt',
    slug: 'circle-skirt',
    title: 'Circle Skirt Fabric Calculator',
    description: 'Calculate the waist radius and fabric square needed for full, half, or three-quarter circle skirts.',
    icon: '👗',
    category: 'textile',
    subcategory: 'sewing',
    tags: ['circle skirt', 'sewing', 'skirt', 'fabric', 'yardage', 'waist', 'radius'],
    inputs: [
      {
        id: 'waistCircumference',
        label: 'Waist Circumference (inches)',
        type: 'number',
        defaultValue: 28,
        min: 10,
        helpText: 'Your actual waist measurement or garment waist size.',
      },
      {
        id: 'skirtLength',
        label: 'Skirt Length (inches)',
        type: 'number',
        defaultValue: 24,
        min: 1,
        helpText: 'Desired finished length from waist to hem.',
      },
      {
        id: 'circleType',
        label: 'Circle Type',
        type: 'select',
        defaultValue: '1',
        options: [
          { label: 'Full Circle (360 degrees)', value: '1' },
          { label: 'Half Circle (180 degrees)', value: '0.5' },
          { label: '3/4 Circle (270 degrees)', value: '0.75' },
        ],
      },
      {
        id: 'seamAllowance',
        label: 'Seam Allowance (inches)',
        type: 'number',
        defaultValue: 0.625,
        step: 0.125,
        min: 0,
        helpText: '5/8 inch = 0.625, standard seam allowance.',
      },
    ],
    formulas: [
      {
        id: 'waistRadius',
        expression: 'waistCircumference / (2 * 3.14159265 * circleType)',
        dependencies: ['waistCircumference', 'circleType'],
      },
      {
        id: 'totalRadius',
        expression: 'waistRadius + skirtLength + seamAllowance',
        dependencies: ['waistRadius', 'skirtLength', 'seamAllowance'],
      },
      {
        id: 'fabricSquareIn',
        expression: '2 * totalRadius',
        dependencies: ['totalRadius'],
      },
      {
        id: 'fabricYards',
        expression: '(fabricSquareIn + 2) / 36',
        dependencies: ['fabricSquareIn'],
      },
      {
        id: 'fabricMeters',
        expression: 'fabricYards * 0.9144',
        dependencies: ['fabricYards'],
      },
    ],
    outputs: [
      {
        id: 'fabricYardsOut',
        label: 'Fabric Needed',
        formulaRef: 'fabricYards',
        precision: 2,
        suffix: ' yards',
        highlight: true,
      },
      {
        id: 'fabricMetersOut',
        label: 'Fabric Needed',
        formulaRef: 'fabricMeters',
        precision: 2,
        suffix: ' m',
      },
      {
        id: 'waistRadiusOut',
        label: 'Waist Radius',
        formulaRef: 'waistRadius',
        precision: 2,
        suffix: ' inches',
      },
      {
        id: 'fabricSquareInOut',
        label: 'Fabric Square Size',
        formulaRef: 'fabricSquareIn',
        precision: 1,
        suffix: ' inches',
      },
    ],
    guide: {
      whatIsIt:
        'A circle skirt is cut from a quarter (or fraction) of a fabric circle. For a full circle skirt, the waist hole radius r = waist circumference / (2 x pi). For a half circle, r = waist circumference / pi. The total radius from center = waist radius + skirt length + seam allowance. You need a fabric square with sides of 2 x total radius.',
      howToUse:
        'Enter your waist measurement, desired skirt length, circle type, and seam allowance. The calculator gives you the fabric square size needed and total yardage to buy.',
      exampleScenario:
        '28 inch waist, 24 inch length, full circle, 5/8 inch seam: waist radius = 4.46 inches. Total radius = 4.46 + 24 + 0.625 = 29.08 inches. Fabric square = 58.17 inches. Yardage needed = approximately 1.67 yards.',
      proTip:
        "Buy fabric at least 60 inches wide for full circle skirts — narrower fabric requires seaming additional pieces. For half circles, 44-inch fabric is often sufficient. The waist hole is cut as a quarter circle (for full circle) in the folded fabric's corner. Add a waistband or facing by cutting a separate piece — the waist seam alone will not hold its shape. Pre-wash fabric before cutting, as circle skirts can lose significant length on the bias grain after washing.",
    },
    metadata: { version: '1.0.0' },
  },

  // ─── 90. Curtain Pleat & Fabric ──────────────────────────────────────
  {
    id: 'curtain-fabric',
    slug: 'curtain-fabric',
    title: 'Curtain Pleat & Fabric Calculator',
    description: 'Calculate the total fabric width and yardage needed for curtains or drapes based on window size, fullness factor, and heading allowances.',
    icon: '🪟',
    category: 'textile',
    subcategory: 'sewing',
    tags: ['curtains', 'drapes', 'fabric', 'sewing', 'fullness', 'pleat', 'window treatment'],
    inputs: [
      {
        id: 'windowWidth',
        label: 'Window Width (inches)',
        type: 'number',
        defaultValue: 60,
        min: 10,
        helpText: 'Measure the rod width including returns.',
      },
      {
        id: 'windowDrop',
        label: 'Drop Length (inches)',
        type: 'number',
        defaultValue: 84,
        min: 10,
        helpText: 'Floor length: measure from rod to floor. Sill length: rod to sill.',
      },
      {
        id: 'headingInches',
        label: 'Heading Allowance (inches)',
        type: 'number',
        defaultValue: 4,
        min: 0,
        helpText: 'Fabric above the rod for header/heading. Typically 3-6 inches.',
      },
      {
        id: 'hemInches',
        label: 'Hem Allowance (inches)',
        type: 'number',
        defaultValue: 4,
        min: 0,
        helpText: 'Bottom hem allowance. Double hem = 4 inches; triple hem = 6 inches.',
      },
      {
        id: 'fullnessFactor',
        label: 'Fullness / Pleat Factor',
        type: 'select',
        defaultValue: '2.0',
        options: [
          { label: '1.5x (Minimal / Flat Panel)', value: '1.5' },
          { label: '2.0x (Standard Gather)', value: '2.0' },
          { label: '2.5x (Full / Pinch Pleat)', value: '2.5' },
          { label: '3.0x (Very Full / Luxurious)', value: '3.0' },
        ],
      },
      {
        id: 'numPanels',
        label: 'Number of Panels',
        type: 'number',
        defaultValue: 2,
        min: 1,
        placeholder: 'e.g. 2',
      },
    ],
    formulas: [
      {
        id: 'totalFabricWidth',
        expression: 'windowWidth * fullnessFactor',
        dependencies: ['windowWidth', 'fullnessFactor'],
      },
      {
        id: 'widthPerPanel',
        expression: 'totalFabricWidth / numPanels',
        dependencies: ['totalFabricWidth', 'numPanels'],
      },
      {
        id: 'fabricLength',
        expression: 'windowDrop + headingInches + hemInches',
        dependencies: ['windowDrop', 'headingInches', 'hemInches'],
      },
      {
        id: 'totalFabric',
        expression: 'totalFabricWidth * fabricLength',
        dependencies: ['totalFabricWidth', 'fabricLength'],
      },
      {
        id: 'yardage',
        expression: '(fabricLength * numPanels * widthPerPanel) / (36 * 54)',
        dependencies: ['fabricLength', 'numPanels', 'widthPerPanel'],
      },
    ],
    outputs: [
      {
        id: 'totalFabricWidthOut',
        label: 'Total Fabric Width',
        formulaRef: 'totalFabricWidth',
        precision: 1,
        suffix: ' inches',
        highlight: true,
      },
      {
        id: 'fabricLengthOut',
        label: 'Length per Panel',
        formulaRef: 'fabricLength',
        precision: 1,
        suffix: ' inches',
      },
      {
        id: 'yardageOut',
        label: 'Total Fabric Yardage',
        formulaRef: 'yardage',
        precision: 2,
        suffix: ' yards',
      },
      {
        id: 'widthPerPanelOut',
        label: 'Width per Panel',
        formulaRef: 'widthPerPanel',
        precision: 1,
        suffix: ' inches',
      },
    ],
    guide: {
      whatIsIt:
        'Curtain fabric calculation multiplies the window width by a fullness factor (how gathered or pleated the fabric will be) to get the total fabric width needed. The fabric length adds the drop (window measurement) plus heading and hem allowances. Fullness factor of 2.0x is standard — fabric hangs with moderate, attractive drape; 2.5x or 3.0x creates rich, lush pleats.',
      howToUse:
        'Measure your rod width (window width), the drop from rod to desired hem location, and enter heading and hem allowances. Select your desired fullness factor and number of panels. The calculator shows total fabric width, panel dimensions, and total yardage.',
      exampleScenario:
        '60-inch window, 84-inch drop, 4-inch heading, 4-inch hem, 2.0x fullness, 2 panels: Total fabric width = 120 inches, length per panel = 92 inches, width per panel = 60 inches. Yardage at 54-inch fabric = (92 x 2 x 60) / (36 x 54) = approximately 5.69 yards.',
      proTip:
        'For patterned fabric, add extra yardage for pattern repeat matching — typically one full pattern repeat per panel. For sheer curtains, 2.5-3x fullness gives the best effect; for blackout or heavy fabric, 1.5-2x is sufficient due to the weight. Always buy 10-15% extra fabric for cutting errors and future repairs. Pre-wash fabric before cutting to prevent shrinkage — curtains are hard to re-hem.',
    },
    metadata: { version: '1.0.0' },
  },
];
