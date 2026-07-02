import { CalculatorSchema } from '@/types/calculator';

export const publishingCalculators: CalculatorSchema[] = [
  // â”€â”€â”€ 1. Book Spine Width Calculator â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'book-spine-width',
    slug: 'book-spine-width',
    title: 'Book Spine Width Calculator',
    description:
      'Calculate the exact spine width of a book for cover design and ISBN barcode placement, based on page count and paper thickness.',
    icon: '📚',
    category: 'publishing',
    subcategory: 'print',
    tags: ['book', 'spine', 'print', 'publishing', 'cover design', 'ISBN', 'paperback', 'hardcover'],
    inputs: [
      {
        id: 'pageCount',
        label: 'Page Count',
        type: 'number',
        defaultValue: 300,
        min: 2,
        step: 1,
        helpText: 'Total number of pages in the book (not leaves). A leaf = 2 pages.',
        required: true,
      },
      {
        id: 'paperThicknessMm',
        label: 'Paper Thickness per Page',
        type: 'number',
        defaultValue: 0.0725,
        step: 0.0001,
        min: 0.001,
        units: [{ label: 'mm', value: 'mm' }],
        helpText: 'Paper thickness per page. Standard 60gsm book paper approx 0.0725 mm, 80gsm approx 0.10 mm.',
        required: true,
      },
      {
        id: 'coverBoardMm',
        label: 'Cover Board Thickness',
        type: 'number',
        defaultValue: 3,
        step: 0.5,
        min: 0,
        units: [{ label: 'mm', value: 'mm' }],
        helpText: 'Cover board thickness each side (hardcover: 2.5-3.5 mm, softcover: 0).',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'spineWidthMm',
        expression: '(pageCount * paperThicknessMm) + (coverBoardMm * 2)',
        dependencies: ['pageCount', 'paperThicknessMm', 'coverBoardMm'],
      },
      {
        id: 'spineWidthIn',
        expression: 'spineWidthMm / 25.4',
        dependencies: ['spineWidthMm'],
      },
    ],
    outputs: [
      {
        id: 'spineWidthMm',
        label: 'Spine Width (mm)',
        formulaRef: 'spineWidthMm',
        format: 'number',
        precision: 2,
        suffix: ' mm',
        highlight: true,
      },
      {
        id: 'spineWidthIn',
        label: 'Spine Width (inches)',
        formulaRef: 'spineWidthIn',
        format: 'number',
        precision: 4,
        suffix: ' in',
      },
    ],
    guide: {
      whatIsIt:
        'The spine width calculator determines how wide the binding edge of a book needs to be for cover design. An accurate spine measurement is critical for ISBN barcode placement, text legibility on the shelf, and ensuring your print-ready PDF meets printer tolerances.',
      howToUse:
        'Enter the total page count (both sides of every leaf), the paper thickness per page in millimetres (check your printer spec sheet), and the cover board thickness if the book is hardcover. For softcover / perfect-bound books, set Cover Board to 0.',
      exampleScenario:
        'A 300-page novel on 60gsm book paper (0.0725 mm/page) with a softcover: spine = 300 x 0.0725 + 0 = 21.75 mm (0.856 in). A hardcover edition on 80gsm paper (0.10 mm) with 3 mm boards: spine = 300 x 0.10 + 6 = 36 mm (1.417 in).',
      proTip:
        'Print-on-demand services such as Amazon KDP and IngramSpark have a minimum spine width (about 64-75 pages) before spine text is permitted. For saddle-stitch books, creep causes inner pages to protrude -- reduce effective page count by 4 when estimating spine width. Always add +-1 mm tolerance for offset press variation.',
    },
    metadata: { version: '1.0.0' },
  },

  // â”€â”€â”€ 2. Paper Weight Converter â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'paper-weight-converter',
    slug: 'paper-weight-converter',
    title: 'Paper Weight Converter',
    description:
      'Convert paper weight between GSM (g/m2) and US basis weight systems -- Bond, Text, and Cover -- instantly.',
    icon: '📄',
    category: 'publishing',
    subcategory: 'print',
    tags: ['paper', 'weight', 'gsm', 'bond', 'text', 'cover', 'printing', 'publishing'],
    inputs: [
      {
        id: 'weight',
        label: 'Paper Weight',
        type: 'number',
        defaultValue: 80,
        min: 1,
        step: 1,
        helpText: 'Enter the paper weight in your chosen unit.',
        required: true,
      },
      {
        id: 'fromUnit',
        label: 'From Unit',
        type: 'select',
        defaultValue: '1',
        options: [
          { label: 'gsm (g/m2)', value: '1' },
          { label: 'Bond lb (17x22 in)', value: '2.7042' },
          { label: 'Text lb (25x38 in)', value: '1.4801' },
          { label: 'Cover lb (20x26 in)', value: '2.7042' },
          { label: 'Index lb (25.5x30.5 in)', value: '1.8626' },
        ],
        required: true,
      },
    ],
    formulas: [
      {
        id: 'weightGsm',
        expression: 'weight * fromUnit',
        dependencies: ['weight', 'fromUnit'],
      },
      {
        id: 'bondLb',
        expression: 'weightGsm / 2.7042',
        dependencies: ['weightGsm'],
      },
      {
        id: 'textLb',
        expression: 'weightGsm / 1.4801',
        dependencies: ['weightGsm'],
      },
      {
        id: 'coverLb',
        expression: 'weightGsm / 2.7042',
        dependencies: ['weightGsm'],
      },
    ],
    outputs: [
      {
        id: 'weightGsm',
        label: 'Weight in GSM',
        formulaRef: 'weightGsm',
        format: 'number',
        precision: 1,
        suffix: ' gsm',
        highlight: true,
      },
      {
        id: 'bondLb',
        label: 'Bond / Writing lb',
        formulaRef: 'bondLb',
        format: 'number',
        precision: 1,
        suffix: ' lb Bond',
      },
      {
        id: 'textLb',
        label: 'Text / Book lb',
        formulaRef: 'textLb',
        format: 'number',
        precision: 1,
        suffix: ' lb Text',
      },
      {
        id: 'coverLb',
        label: 'Cover lb',
        formulaRef: 'coverLb',
        format: 'number',
        precision: 1,
        suffix: ' lb Cover',
      },
    ],
    guide: {
      whatIsIt:
        'Paper weight is expressed differently in the US (basis weight in lb) and the rest of the world (gsm). The US system is confusing because the basis depends on the paper category -- a 20 lb Bond sheet and a 50 lb Text sheet are actually the same thickness, both approximately 75 gsm.',
      howToUse:
        'Enter your paper weight and select the unit you are starting from. All four equivalent weights are displayed instantly. Use the GSM column as the universal reference when communicating with overseas printers.',
      exampleScenario:
        'Standard office copy paper is 20 lb Bond = 75 gsm. A typical novel text stock is 50-60 lb Text (74-89 gsm). A business card is usually 100-130 lb Cover (270-350 gsm). A glossy brochure cover is often 80 lb Cover (216 gsm).',
      proTip:
        'When ordering paper online, always confirm gsm alongside the lb rating. 90 lb Index paper is only 163 gsm -- much lighter than 90 lb Cover (243 gsm). If your printer specifies gsm, stick to gsm to avoid category confusion. Weights above 350 gsm are typically board, not paper.',
    },
    metadata: { version: '1.0.0' },
  },

  // â”€â”€â”€ 3. Words to Pages Calculator â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'words-to-pages',
    slug: 'words-to-pages',
    title: 'Words to Pages Calculator',
    description:
      'Estimate the printed page count of a manuscript based on word count, font size, margins, and line spacing.',
    icon: '📝',
    category: 'publishing',
    subcategory: 'print',
    tags: ['words', 'pages', 'manuscript', 'publishing', 'novel', 'typography', 'kdp', 'book'],
    inputs: [
      {
        id: 'wordCount',
        label: 'Word Count',
        type: 'number',
        defaultValue: 50000,
        min: 1,
        step: 100,
        helpText: 'Total word count of the document.',
        required: true,
      },
      {
        id: 'fontSize',
        label: 'Font Size',
        type: 'select',
        defaultValue: '275',
        options: [
          { label: '10pt', value: '400' },
          { label: '11pt', value: '350' },
          { label: '12pt', value: '275' },
          { label: '14pt', value: '200' },
        ],
        required: true,
      },
      {
        id: 'fontType',
        label: 'Font Type',
        type: 'select',
        defaultValue: '1.0',
        options: [
          { label: 'Serif (Times / Garamond)', value: '1.0' },
          { label: 'Sans-serif (Arial / Helvetica)', value: '0.95' },
          { label: 'Monospace', value: '0.85' },
        ],
        required: true,
      },
      {
        id: 'margins',
        label: 'Margins',
        type: 'select',
        defaultValue: '1.0',
        options: [
          { label: 'Standard 1 in margins', value: '1.0' },
          { label: 'Narrow 0.5 in', value: '1.25' },
          { label: 'Wide 1.5 in', value: '0.80' },
        ],
        required: true,
      },
      {
        id: 'lineSpacing',
        label: 'Line Spacing',
        type: 'select',
        defaultValue: '1.0',
        options: [
          { label: 'Single', value: '1.0' },
          { label: '1.5 lines', value: '0.67' },
          { label: 'Double', value: '0.50' },
        ],
        required: true,
      },
    ],
    formulas: [
      {
        id: 'wordsPerPage',
        expression: 'fontSize * fontType * margins * lineSpacing',
        dependencies: ['fontSize', 'fontType', 'margins', 'lineSpacing'],
      },
      {
        id: 'pages',
        expression: 'ceil(wordCount / wordsPerPage)',
        dependencies: ['wordCount', 'wordsPerPage'],
      },
    ],
    outputs: [
      {
        id: 'pages',
        label: 'Estimated Pages',
        formulaRef: 'pages',
        format: 'number',
        precision: 0,
        suffix: ' pages',
        highlight: true,
      },
      {
        id: 'wordsPerPage',
        label: 'Words per Page',
        formulaRef: 'wordsPerPage',
        format: 'number',
        precision: 0,
        suffix: ' words/page',
      },
    ],
    guide: {
      whatIsIt:
        'This calculator estimates how many printed pages a document will produce based on formatting choices. It is useful for manuscript submissions, self-publishing layout, and print cost estimation.',
      howToUse:
        'Enter your word count and select font size, type, margin width, and line spacing. The calculator outputs both the page estimate and words-per-page figure. Adjust settings to match your target layout.',
      exampleScenario:
        'A 50,000-word novel in 12pt Times New Roman, standard 1 in margins, single spaced comes to approx 182 pages. The same manuscript in 12pt double-spaced (submission format) becomes approx 364 pages.',
      proTip:
        'The publishing industry standard for estimating novel length is 250-300 words per page (12pt, single-spaced). Amazon KDP uses page count to calculate KENP royalties -- KDP page count differs from print pages. Always do a final layout in DTP software (InDesign, Affinity Publisher) for precise counts before uploading.',
    },
    metadata: { version: '1.0.0' },
  },

  // â”€â”€â”€ 4. Pixels to Print Size Calculator â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'pixels-to-print',
    slug: 'pixels-to-print',
    title: 'Pixels to Print Size Calculator',
    description:
      'Convert image pixel dimensions to physical print size at any DPI, and check whether an image is high enough resolution for quality printing.',
    icon: '🖨️',
    category: 'publishing',
    subcategory: 'print',
    tags: ['pixels', 'print', 'dpi', 'resolution', 'photo', 'image', 'size', 'cm', 'inches'],
    inputs: [
      {
        id: 'widthPx',
        label: 'Image Width',
        type: 'number',
        defaultValue: 3000,
        min: 1,
        step: 1,
        units: [{ label: 'pixels', value: 'px' }],
        helpText: 'Image width in pixels.',
        required: true,
      },
      {
        id: 'heightPx',
        label: 'Image Height',
        type: 'number',
        defaultValue: 2000,
        min: 1,
        step: 1,
        units: [{ label: 'pixels', value: 'px' }],
        helpText: 'Image height in pixels.',
        required: true,
      },
      {
        id: 'dpi',
        label: 'Print Resolution (DPI)',
        type: 'select',
        defaultValue: '300',
        options: [
          { label: '72 DPI (screen)', value: '72' },
          { label: '150 DPI (draft)', value: '150' },
          { label: '300 DPI (print quality)', value: '300' },
          { label: '600 DPI (high quality)', value: '600' },
        ],
        required: true,
      },
    ],
    formulas: [
      {
        id: 'widthInch',
        expression: 'widthPx / dpi',
        dependencies: ['widthPx', 'dpi'],
      },
      {
        id: 'heightInch',
        expression: 'heightPx / dpi',
        dependencies: ['heightPx', 'dpi'],
      },
      {
        id: 'widthCm',
        expression: 'widthInch * 2.54',
        dependencies: ['widthInch'],
      },
      {
        id: 'heightCm',
        expression: 'heightInch * 2.54',
        dependencies: ['heightInch'],
      },
      {
        id: 'megapixels',
        expression: '(widthPx * heightPx) / 1000000',
        dependencies: ['widthPx', 'heightPx'],
      },
    ],
    outputs: [
      {
        id: 'widthCm',
        label: 'Print Width',
        formulaRef: 'widthCm',
        format: 'number',
        precision: 2,
        suffix: ' cm wide',
        highlight: true,
      },
      {
        id: 'heightCm',
        label: 'Print Height',
        formulaRef: 'heightCm',
        format: 'number',
        precision: 2,
        suffix: ' cm tall',
      },
      {
        id: 'widthInch',
        label: 'Print Width (inches)',
        formulaRef: 'widthInch',
        format: 'number',
        precision: 2,
        suffix: ' in',
      },
      {
        id: 'heightInch',
        label: 'Print Height (inches)',
        formulaRef: 'heightInch',
        format: 'number',
        precision: 2,
        suffix: ' in',
      },
      {
        id: 'megapixels',
        label: 'Megapixels',
        formulaRef: 'megapixels',
        format: 'number',
        precision: 1,
        suffix: ' MP',
      },
    ],
    guide: {
      whatIsIt:
        'DPI (dots per inch) defines how many pixels are crammed into each inch of printed output. The same 3000x2000 pixel image prints at 41.7x27.8 cm at 72 DPI (blurry) or just 25.4x16.9 cm at 300 DPI (sharp photo print).',
      howToUse:
        'Enter your image pixel dimensions (found in Photoshop, Preview, or Windows Photos), then choose the target print resolution. 300 DPI is the standard for professional print; 72 DPI is for screen display only.',
      exampleScenario:
        'A 6000x4000 px photo (24 MP) at 300 DPI prints at 50.8x33.9 cm -- a large A3+ print with full detail. At 150 DPI, the same image covers 101.6x67.7 cm but will look visibly soft. Upscaling a 72 DPI web image to 300 DPI does not add real detail.',
      proTip:
        'Minimum pixels for common sizes at 300 DPI: 4x6 in = 1200x1800 px, A4 = 2480x3508 px, A3 = 3508x4961 px. For large-format posters viewed from distance, 150 DPI is usually sufficient. Never rely on screen preview -- always calculate from pixels.',
    },
    metadata: { version: '1.0.0' },
  },

  // â”€â”€â”€ 5. Image Resolution (Megapixel) Calculator â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'image-resolution-megapixel',
    slug: 'image-resolution-megapixel',
    title: 'Image Resolution (Megapixel) Calculator',
    description:
      'Calculate megapixels, aspect ratio, pixel pitch, and horizontal angle of view for any camera sensor and lens combination.',
    icon: '📷',
    category: 'publishing',
    subcategory: 'print',
    tags: ['megapixel', 'resolution', 'camera', 'sensor', 'pixel pitch', 'angle of view', 'photography'],
    inputs: [
      {
        id: 'widthPx',
        label: 'Image Width',
        type: 'number',
        defaultValue: 4000,
        min: 1,
        step: 1,
        units: [{ label: 'pixels', value: 'px' }],
        required: true,
      },
      {
        id: 'heightPx',
        label: 'Image Height',
        type: 'number',
        defaultValue: 3000,
        min: 1,
        step: 1,
        units: [{ label: 'pixels', value: 'px' }],
        required: true,
      },
      {
        id: 'sensorWidthMm',
        label: 'Sensor Width',
        type: 'number',
        defaultValue: 35.9,
        step: 0.1,
        min: 1,
        units: [{ label: 'mm', value: 'mm' }],
        helpText: 'Camera sensor width. Full frame = 35.9 mm, APS-C approx 23.5 mm, Micro 4/3 approx 17.3 mm.',
        required: true,
      },
      {
        id: 'focalLengthMm',
        label: 'Focal Length',
        type: 'number',
        defaultValue: 50,
        step: 1,
        min: 1,
        units: [{ label: 'mm', value: 'mm' }],
        helpText: 'Lens focal length in mm.',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'megapixels',
        expression: '(widthPx * heightPx) / 1000000',
        dependencies: ['widthPx', 'heightPx'],
      },
      {
        id: 'aspectRatio',
        expression: 'widthPx / heightPx',
        dependencies: ['widthPx', 'heightPx'],
      },
      {
        id: 'pixelPitch',
        expression: '(sensorWidthMm / widthPx) * 1000',
        dependencies: ['sensorWidthMm', 'widthPx'],
      },
      {
        id: 'angleOfView',
        expression: '2 * ((sensorWidthMm / (2 * focalLengthMm)) / (1 + 0.28125 * pow(sensorWidthMm / (2 * focalLengthMm), 2))) * (180 / 3.14159265)',
        dependencies: ['sensorWidthMm', 'focalLengthMm'],
      },
    ],
    outputs: [
      {
        id: 'megapixels',
        label: 'Megapixels',
        formulaRef: 'megapixels',
        format: 'number',
        precision: 2,
        suffix: ' MP',
        highlight: true,
      },
      {
        id: 'aspectRatio',
        label: 'Aspect Ratio',
        formulaRef: 'aspectRatio',
        format: 'number',
        precision: 3,
        suffix: ':1',
      },
      {
        id: 'pixelPitch',
        label: 'Pixel Pitch',
        formulaRef: 'pixelPitch',
        format: 'number',
        precision: 2,
        suffix: ' um pixel pitch',
      },
      {
        id: 'angleOfView',
        label: 'Horizontal Angle of View',
        formulaRef: 'angleOfView',
        format: 'number',
        precision: 1,
        suffix: ' deg horizontal FOV',
      },
    ],
    guide: {
      whatIsIt:
        'Megapixels determine print resolution potential; pixel pitch determines per-pixel light-gathering (low-light performance). A 24 MP APS-C sensor has smaller, noisier pixels than a 12 MP full-frame sensor because the same light is shared across smaller sites.',
      howToUse:
        'Enter your camera output resolution in pixels, the physical sensor width from the spec sheet, and the focal length. The calculator returns megapixels, aspect ratio, pixel pitch (um), and horizontal field of view in degrees.',
      exampleScenario:
        'A 24 MP full-frame camera (6000x4000 px, 35.9 mm sensor): 24 MP, 5.98 um pixel pitch, 63.4 deg FOV at 50 mm. A 24 MP APS-C (6000x4000 px, 23.5 mm sensor): same megapixels, 3.92 um pitch -- smaller pixels with more noise in dark scenes.',
      proTip:
        'Crop factor: APS-C approx 1.5x, Micro 4/3 approx 2x relative to full frame. Multiply focal length by crop factor to get full-frame equivalent FOV. Pixel pitch above 5 um is generally considered excellent for low-light photography. Beyond approx 36 MP, diffraction limits sharpness at apertures narrower than f/5.6.',
    },
    metadata: { version: '1.0.0' },
  },

  // â”€â”€â”€ 6. Golden Ratio Typography Calculator â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'golden-ratio-typography',
    slug: 'golden-ratio-typography',
    title: 'Golden Ratio Typography Calculator',
    description:
      'Generate a harmonious typographic scale -- line height, H1, H2, H3, and small text -- using the golden ratio (phi = 1.618).',
    icon: '✨',
    category: 'publishing',
    subcategory: 'typography',
    tags: ['typography', 'golden ratio', 'font size', 'line height', 'type scale', 'web design', 'layout'],
    inputs: [
      {
        id: 'bodyFontSize',
        label: 'Body Font Size',
        type: 'number',
        defaultValue: 16,
        min: 10,
        max: 32,
        step: 1,
        units: [{ label: 'px', value: 'px' }],
        helpText: 'Body text font size in pixels.',
        required: true,
      },
      {
        id: 'contentWidth',
        label: 'Content Column Width',
        type: 'number',
        defaultValue: 680,
        min: 200,
        step: 10,
        units: [{ label: 'px', value: 'px' }],
        helpText: 'Content column width in pixels.',
        required: true,
      },
      {
        id: 'lineHeightRatio',
        label: 'Line Height Ratio',
        type: 'number',
        defaultValue: 1.618,
        step: 0.001,
        min: 1.0,
        max: 3.0,
        helpText: 'Golden ratio = 1.618. Try 1.5-1.618 for body text.',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'lineHeight',
        expression: 'bodyFontSize * lineHeightRatio',
        dependencies: ['bodyFontSize', 'lineHeightRatio'],
      },
      {
        id: 'h1',
        expression: 'bodyFontSize * pow(1.618, 3)',
        dependencies: ['bodyFontSize'],
      },
      {
        id: 'h2',
        expression: 'bodyFontSize * pow(1.618, 2)',
        dependencies: ['bodyFontSize'],
      },
      {
        id: 'h3',
        expression: 'bodyFontSize * 1.618',
        dependencies: ['bodyFontSize'],
      },
      {
        id: 'small',
        expression: 'bodyFontSize / 1.618',
        dependencies: ['bodyFontSize'],
      },
      {
        id: 'idealCharsPerLine',
        expression: '(contentWidth / bodyFontSize) * 1.8',
        dependencies: ['contentWidth', 'bodyFontSize'],
      },
    ],
    outputs: [
      {
        id: 'lineHeight',
        label: 'Line Height',
        formulaRef: 'lineHeight',
        format: 'number',
        precision: 1,
        suffix: ' px line height',
        highlight: true,
      },
      {
        id: 'h1',
        label: 'H1 Size',
        formulaRef: 'h1',
        format: 'number',
        precision: 1,
        suffix: ' px H1',
      },
      {
        id: 'h2',
        label: 'H2 Size',
        formulaRef: 'h2',
        format: 'number',
        precision: 1,
        suffix: ' px H2',
      },
      {
        id: 'h3',
        label: 'H3 Size',
        formulaRef: 'h3',
        format: 'number',
        precision: 1,
        suffix: ' px H3',
      },
      {
        id: 'idealCharsPerLine',
        label: 'Ideal Characters per Line',
        formulaRef: 'idealCharsPerLine',
        format: 'number',
        precision: 0,
        suffix: ' chars/line ideal',
      },
    ],
    guide: {
      whatIsIt:
        'The golden ratio (phi approx 1.618) produces type scales that feel naturally proportional because each level is phi times larger than the one below. It has been used in print typography since the Renaissance and translates directly to web CSS font-size systems.',
      howToUse:
        'Set your body font size (16 px is the browser default), content column width, and optionally adjust the line-height ratio. The calculator outputs a complete heading scale from H3 to H1 and small/caption text, plus the ideal character count per line.',
      exampleScenario:
        'Body 16 px, 680 px column: line height = 25.9 px, H3 = 25.9 px, H2 = 41.9 px, H1 = 67.8 px, small = 9.9 px, approx 76 chars/line. At 18 px body: H1 = 76.3 px, H2 = 47.1 px -- richer hierarchy for magazine-style layouts.',
      proTip:
        'Robert Bringhurst\'s "The Elements of Typographic Style" recommends 60-75 characters per line for comfortable reading. The ideal chars/line output flags when your column is too narrow or wide. For CSS, convert px line-height to a unitless ratio (e.g. 25.9/16 = 1.618) -- browsers handle it better across zoom levels.',
    },
    metadata: { version: '1.0.0' },
  },

  // â”€â”€â”€ 7. Reading Speed (WPM) Calculator â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'reading-speed-wpm',
    slug: 'reading-speed-wpm',
    title: 'Reading Speed (WPM) Calculator',
    description:
      'Estimate reading time for any text based on word count and reading speed in words per minute.',
    icon: '📖',
    category: 'publishing',
    subcategory: 'typography',
    tags: ['reading', 'wpm', 'reading time', 'words per minute', 'content', 'blog', 'article'],
    inputs: [
      {
        id: 'wordCount',
        label: 'Word Count',
        type: 'number',
        defaultValue: 1000,
        min: 1,
        step: 50,
        helpText: 'Total words in the text.',
        required: true,
      },
      {
        id: 'customWpm',
        label: 'Reading Speed',
        type: 'number',
        defaultValue: 250,
        min: 50,
        max: 1500,
        step: 10,
        helpText: 'Your reading speed in words per minute. Average adult: 200-250 WPM.',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'readTimeMinutes',
        expression: 'wordCount / customWpm',
        dependencies: ['wordCount', 'customWpm'],
      },
      {
        id: 'readTimeSeconds',
        expression: 'readTimeMinutes * 60',
        dependencies: ['readTimeMinutes'],
      },
      {
        id: 'readTimeHours',
        expression: 'readTimeMinutes / 60',
        dependencies: ['readTimeMinutes'],
      },
    ],
    outputs: [
      {
        id: 'readTimeMinutes',
        label: 'Reading Time',
        formulaRef: 'readTimeMinutes',
        format: 'number',
        precision: 1,
        suffix: ' minutes',
        highlight: true,
      },
      {
        id: 'readTimeSeconds',
        label: 'Reading Time (seconds)',
        formulaRef: 'readTimeSeconds',
        format: 'number',
        precision: 0,
        suffix: ' seconds',
      },
      {
        id: 'readTimeHours',
        label: 'Reading Time (hours)',
        formulaRef: 'readTimeHours',
        format: 'number',
        precision: 2,
        suffix: ' hours',
      },
    ],
    guide: {
      whatIsIt:
        'Reading speed varies enormously: slow readers average 150 WPM, average adults 200-250 WPM, and proficient readers reach 350+ WPM with full comprehension. Speed readers using chunking may reach 500-700 WPM, but comprehension often drops above 400 WPM.',
      howToUse:
        'Enter your text word count and your reading speed in WPM. If you do not know your speed, use 250 WPM as a solid average. Reading time appears in minutes, seconds, and hours.',
      exampleScenario:
        'A 1,500-word blog post at 250 WPM takes 6 minutes to read. A 90,000-word novel at 250 WPM takes 6 hours. A 10,000-word academic paper at 150 WPM (careful study reading) takes approx 67 minutes.',
      proTip:
        'Medium and Substack display "X min read" badges -- they use roughly 265 WPM. For audiobooks, narrators average 150-160 WPM; multiply word count by 60/WPM for audio duration in seconds. Comprehension studies show retention drops significantly above 400 WPM even with speed-reading techniques.',
    },
    metadata: { version: '1.0.0' },
  },

  // â”€â”€â”€ 8. Speech Duration Calculator â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'speech-duration',
    slug: 'speech-duration',
    title: 'Speech Duration Calculator',
    description:
      'Estimate how long a speech or presentation will take to deliver based on word count, speaking pace, and pause allowance.',
    icon: '🎤',
    category: 'publishing',
    subcategory: 'typography',
    tags: ['speech', 'presentation', 'duration', 'wpm', 'public speaking', 'TED talk', 'podcast'],
    inputs: [
      {
        id: 'wordCount',
        label: 'Word Count',
        type: 'number',
        defaultValue: 1500,
        min: 1,
        step: 50,
        helpText: 'Total word count of the speech or presentation script.',
        required: true,
      },
      {
        id: 'speakingPace',
        label: 'Speaking Pace',
        type: 'select',
        defaultValue: '150',
        options: [
          { label: 'Slow and deliberate (100 WPM)', value: '100' },
          { label: 'Conversational (130 WPM)', value: '130' },
          { label: 'Normal presentation (150 WPM)', value: '150' },
          { label: 'Energetic (170 WPM)', value: '170' },
          { label: 'Fast (200 WPM)', value: '200' },
        ],
        required: true,
      },
      {
        id: 'pausesPct',
        label: 'Pause and Buffer Allowance',
        type: 'number',
        defaultValue: 15,
        min: 0,
        max: 50,
        step: 1,
        units: [{ label: '%', value: '%' }],
        helpText: 'Extra time for pauses, Q and A gaps, and emphasis (10-20% typical).',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'baseMinutes',
        expression: 'wordCount / speakingPace',
        dependencies: ['wordCount', 'speakingPace'],
      },
      {
        id: 'totalMinutes',
        expression: 'baseMinutes * (1 + pausesPct / 100)',
        dependencies: ['baseMinutes', 'pausesPct'],
      },
      {
        id: 'totalSeconds',
        expression: 'totalMinutes * 60',
        dependencies: ['totalMinutes'],
      },
    ],
    outputs: [
      {
        id: 'totalMinutes',
        label: 'Total Duration',
        formulaRef: 'totalMinutes',
        format: 'number',
        precision: 1,
        suffix: ' minutes',
        highlight: true,
      },
      {
        id: 'totalSeconds',
        label: 'Total Duration (seconds)',
        formulaRef: 'totalSeconds',
        format: 'number',
        precision: 0,
        suffix: ' seconds',
      },
      {
        id: 'baseMinutes',
        label: 'Base Time (no pauses)',
        formulaRef: 'baseMinutes',
        format: 'number',
        precision: 1,
        suffix: ' min without pauses',
      },
    ],
    guide: {
      whatIsIt:
        'Speaking pace varies by style and context. TED Talks are delivered at approx 150 WPM -- fast enough to maintain energy, slow enough for comprehension. Podcast hosts average 140-160 WPM in natural conversation. This calculator converts word count to delivery time with a configurable pause buffer.',
      howToUse:
        'Enter your script word count, select your speaking pace, and add a pause percentage (15% is typical for presentations with slide transitions and emphasis pauses). The output shows total time with and without the pause buffer.',
      exampleScenario:
        'A 1,500-word conference talk at 150 WPM runs exactly 10 minutes in pure speech. With 15% pause buffer = 11.5 minutes -- comfortably within a 15-minute slot. A 7,500-word keynote at 130 WPM + 20% buffer = 69.2 minutes (approx 1 hour 9 minutes).',
      proTip:
        'Industry slide rules: 1 slide per 2-3 minutes (detailed technical), 1 slide per 1 minute (fast-paced pitch). For a strict 10-minute slot at 150 WPM, allow approx 1,300 words of scripted content after reserving 15% for pauses. Record a rehearsal to calibrate your actual pace -- most speakers are faster under pressure.',
    },
    metadata: { version: '1.0.0' },
  },

  // â”€â”€â”€ 9. Screenplay Page Count Estimator â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'screenplay-page-count',
    slug: 'screenplay-page-count',
    title: 'Screenplay Page Count Estimator',
    description:
      'Estimate the formatted page count and runtime of a screenplay from raw word count, format type, and scene heading count.',
    icon: '🎬',
    category: 'publishing',
    subcategory: 'typography',
    tags: ['screenplay', 'script', 'film', 'TV', 'page count', 'runtime', 'writing', 'final draft'],
    inputs: [
      {
        id: 'wordCount',
        label: 'Word Count',
        type: 'number',
        defaultValue: 15000,
        min: 100,
        step: 100,
        helpText: 'Total word count of the screenplay from your writing software.',
        required: true,
      },
      {
        id: 'formatType',
        label: 'Format Type',
        type: 'select',
        defaultValue: '1.0',
        options: [
          { label: 'Feature film (action-heavy)', value: '1.1' },
          { label: 'Feature film (dialogue-heavy)', value: '0.9' },
          { label: 'TV Drama (1hr)', value: '1.0' },
          { label: 'TV Comedy (30min)', value: '1.0' },
          { label: 'Short film', value: '1.0' },
        ],
        required: true,
      },
      {
        id: 'sluglineCount',
        label: 'Scene Heading Count',
        type: 'number',
        defaultValue: 50,
        min: 0,
        step: 1,
        helpText: 'Number of scene headings (INT./EXT. lines). Each adds whitespace bulk.',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'basePages',
        expression: 'wordCount / 55',
        dependencies: ['wordCount'],
      },
      {
        id: 'adjustedPages',
        expression: 'ceil(basePages * formatType + sluglineCount * 0.15)',
        dependencies: ['basePages', 'formatType', 'sluglineCount'],
      },
      {
        id: 'runTimeMinutes',
        expression: 'adjustedPages',
        dependencies: ['adjustedPages'],
      },
    ],
    outputs: [
      {
        id: 'adjustedPages',
        label: 'Estimated Page Count',
        formulaRef: 'adjustedPages',
        format: 'number',
        precision: 0,
        suffix: ' pages',
        highlight: true,
      },
      {
        id: 'runTimeMinutes',
        label: 'Estimated Runtime',
        formulaRef: 'runTimeMinutes',
        format: 'number',
        precision: 0,
        suffix: ' min estimated runtime',
      },
    ],
    guide: {
      whatIsIt:
        'Screenplays use Courier 12pt in a specific format where 1 page equals approx 1 minute of screen time. The format is deliberately spacious; a feature film screenplay averages approx 55 words per formatted page (compared to 275 words in a novel page).',
      howToUse:
        'Enter your word count from Final Draft, Fade In, or any screenwriting software. Select the format type -- action-heavy scripts run longer per word than talky scripts. Add your scene heading count to account for the whitespace each INT./EXT. line introduces.',
      exampleScenario:
        'A 15,000-word action screenplay with 80 scene headings: base = 15,000/55 = 272 pages x 1.1 + 80x0.15 = 299 + 12 = 311 pages. That is too long -- industry standard is 90-120 pages -- suggesting significant trimming is needed.',
      proTip:
        'The 1-page-per-minute rule holds for live-action film but breaks down for animation (1 page approx 30 seconds due to dense action lines). Final Draft\'s Production page count is authoritative -- it auto-paginates with real Courier formatting. Use this estimator early in the writing process to gauge length before full formatting.',
    },
    metadata: { version: '1.0.0' },
  },

  // â”€â”€â”€ 10. Print Margin & Bleed Size Calculator â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    id: 'margin-bleed-size',
    slug: 'margin-bleed-size',
    title: 'Print Margin and Bleed Size Calculator',
    description:
      'Calculate bleed document dimensions, text area, and margin ratios for professional print design in any document size.',
    icon: '📐',
    category: 'publishing',
    subcategory: 'print',
    tags: ['bleed', 'margin', 'print', 'design', 'InDesign', 'Affinity', 'gutter', 'trim'],
    inputs: [
      {
        id: 'documentWidth',
        label: 'Document Width (finished)',
        type: 'number',
        defaultValue: 210,
        min: 10,
        step: 1,
        units: [{ label: 'mm', value: 'mm' }],
        helpText: 'Finished/trim document width. A4 = 210 mm, A5 = 148 mm.',
        required: true,
      },
      {
        id: 'documentHeight',
        label: 'Document Height (finished)',
        type: 'number',
        defaultValue: 297,
        min: 10,
        step: 1,
        units: [{ label: 'mm', value: 'mm' }],
        helpText: 'Finished/trim document height. A4 = 297 mm.',
        required: true,
      },
      {
        id: 'bleed',
        label: 'Bleed (each side)',
        type: 'number',
        defaultValue: 3,
        min: 0,
        max: 10,
        step: 0.5,
        units: [{ label: 'mm', value: 'mm' }],
        helpText: 'Standard bleed: 3 mm each side for commercial printing.',
        required: true,
      },
      {
        id: 'topMargin',
        label: 'Top Margin',
        type: 'number',
        defaultValue: 20,
        min: 0,
        step: 1,
        units: [{ label: 'mm', value: 'mm' }],
        required: true,
      },
      {
        id: 'bottomMargin',
        label: 'Bottom Margin',
        type: 'number',
        defaultValue: 20,
        min: 0,
        step: 1,
        units: [{ label: 'mm', value: 'mm' }],
        required: true,
      },
      {
        id: 'insideMargin',
        label: 'Inside / Gutter Margin',
        type: 'number',
        defaultValue: 25,
        min: 0,
        step: 1,
        units: [{ label: 'mm', value: 'mm' }],
        helpText: 'Inside (gutter) margin -- wider for bound documents to prevent text disappearing into the spine.',
        required: true,
      },
      {
        id: 'outsideMargin',
        label: 'Outside Margin',
        type: 'number',
        defaultValue: 15,
        min: 0,
        step: 1,
        units: [{ label: 'mm', value: 'mm' }],
        required: true,
      },
    ],
    formulas: [
      {
        id: 'bleedWidth',
        expression: 'documentWidth + (bleed * 2)',
        dependencies: ['documentWidth', 'bleed'],
      },
      {
        id: 'bleedHeight',
        expression: 'documentHeight + (bleed * 2)',
        dependencies: ['documentHeight', 'bleed'],
      },
      {
        id: 'textAreaWidth',
        expression: 'documentWidth - insideMargin - outsideMargin',
        dependencies: ['documentWidth', 'insideMargin', 'outsideMargin'],
      },
      {
        id: 'textAreaHeight',
        expression: 'documentHeight - topMargin - bottomMargin',
        dependencies: ['documentHeight', 'topMargin', 'bottomMargin'],
      },
      {
        id: 'textAreaSqMm',
        expression: 'textAreaWidth * textAreaHeight',
        dependencies: ['textAreaWidth', 'textAreaHeight'],
      },
      {
        id: 'documentSqMm',
        expression: 'documentWidth * documentHeight',
        dependencies: ['documentWidth', 'documentHeight'],
      },
      {
        id: 'textAreaPct',
        expression: '(textAreaSqMm / documentSqMm) * 100',
        dependencies: ['textAreaSqMm', 'documentSqMm'],
      },
    ],
    outputs: [
      {
        id: 'bleedWidth',
        label: 'Bleed Document Width',
        formulaRef: 'bleedWidth',
        format: 'number',
        precision: 1,
        suffix: ' mm bleed width',
        highlight: true,
      },
      {
        id: 'bleedHeight',
        label: 'Bleed Document Height',
        formulaRef: 'bleedHeight',
        format: 'number',
        precision: 1,
        suffix: ' mm bleed height',
      },
      {
        id: 'textAreaWidth',
        label: 'Text Area Width',
        formulaRef: 'textAreaWidth',
        format: 'number',
        precision: 1,
        suffix: ' mm text area width',
      },
      {
        id: 'textAreaHeight',
        label: 'Text Area Height',
        formulaRef: 'textAreaHeight',
        format: 'number',
        precision: 1,
        suffix: ' mm text area height',
      },
      {
        id: 'textAreaPct',
        label: 'Text Area Coverage',
        formulaRef: 'textAreaPct',
        format: 'percentage',
        precision: 1,
      },
    ],
    guide: {
      whatIsIt:
        'Bleed is an extension of background artwork beyond the trim edge so that when the printer cuts the paper, there is no risk of a white gap appearing at the edge. Margins define how close text and important elements are to the trim edge. The gutter (inside margin) must be wider for bound documents to compensate for pages curving into the binding.',
      howToUse:
        'Enter your finished (trim) document size, bleed amount per side, and margin values. The calculator outputs the total document size with bleed (what you set in InDesign/Affinity as your document dimensions), the live text area dimensions, and percentage of the page used for text.',
      exampleScenario:
        'An A5 book page (148x210 mm) with 3 mm bleed: set document to 154x216 mm in your DTP app. With 25 mm gutter, 15 mm outside, 20 mm top/bottom, the text area is 108x170 mm = 1836 mm2 = 59% of the page area.',
      proTip:
        'Keep all critical content at least 3-5 mm inside the trim edge -- this is the safe zone. Printer crop marks and registration marks are placed outside the bleed. For saddle-stitch booklets, creep causes innermost pages to shift outward after folding -- increase gutter margin by approx 1 mm for every 16 pages of total book thickness.',
    },
    metadata: { version: '1.0.0' },
  },
];
