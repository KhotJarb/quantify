// ---------------------------------------------------------------------------
// Quantify — Tech & Networking Calculators
// ---------------------------------------------------------------------------
// 12 calculators covering networking, storage, display, security, and
// developer/sysadmin tools.
// ---------------------------------------------------------------------------

import type { CalculatorSchema } from '@/types/calculator';

export const techNetworkingCalculators: CalculatorSchema[] = [
  // =========================================================================
  // 1. IP Subnet Calculator
  // =========================================================================
  {
    id: 'ip-subnet-calculator',
    slug: 'ip-subnet-calculator',
    title: 'IP Subnet Calculator',
    description:
      'Calculate usable hosts, total addresses, and network capacity from a CIDR prefix length for IPv4 subnets.',
    icon: '🌐',
    category: 'tech',
    subcategory: 'networking',
    tags: ['ip', 'subnet', 'cidr', 'networking', 'ipv4', 'mask', 'hosts'],
    inputs: [
      {
        id: 'cidrPrefix',
        label: 'CIDR Prefix Length /n',
        type: 'number',
        defaultValue: 24,
        min: 0,
        max: 32,
        step: 1,
        placeholder: 'e.g. 24',
        helpText: 'Enter a value from 0 to 32. Common values: /8 Class A, /16 Class B, /24 Class C.',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'hostBits',
        expression: '32 - cidrPrefix',
        dependencies: ['cidrPrefix'],
      },
      {
        id: 'totalHosts',
        expression: 'pow(2, hostBits)',
        dependencies: ['hostBits'],
      },
      {
        id: 'usableHosts',
        expression: 'max(0, totalHosts - 2)',
        dependencies: ['totalHosts'],
      },
      {
        id: 'subnetMaskVal',
        expression: 'pow(2, 32) - pow(2, hostBits)',
        dependencies: ['hostBits'],
      },
      {
        id: 'numNetworks',
        expression: 'pow(2, cidrPrefix)',
        dependencies: ['cidrPrefix'],
      },
    ],
    outputs: [
      {
        id: 'usableHostsOut',
        label: 'Usable Hosts per Subnet',
        formulaRef: 'usableHosts',
        format: 'number',
        precision: 0,
        highlight: true,
      },
      {
        id: 'totalHostsOut',
        label: 'Total Addresses (incl. network & broadcast)',
        formulaRef: 'totalHosts',
        format: 'number',
        precision: 0,
      },
      {
        id: 'hostBitsOut',
        label: 'Host Bits',
        formulaRef: 'hostBits',
        format: 'number',
        precision: 0,
      },
      {
        id: 'numNetworksOut',
        label: 'Number of /n Networks in IPv4 Space',
        formulaRef: 'numNetworks',
        format: 'number',
        precision: 0,
      },
      {
        id: 'subnetMaskValOut',
        label: 'Subnet Mask (as 32-bit integer)',
        formulaRef: 'subnetMaskVal',
        format: 'number',
        precision: 0,
      },
    ],
    guide: {
      whatIsIt:
        'CIDR (Classless Inter-Domain Routing) notation like /24 describes how an IPv4 address space is divided into networks and hosts. The prefix length tells you how many bits are fixed for the network portion; the remaining bits are for hosts.',
      howToUse:
        'Enter the CIDR prefix length (0–32). The calculator instantly shows you the number of usable host addresses, total addresses in the subnet, and how many such subnets exist in the full IPv4 space. For a typical /24 you get 254 usable hosts.',
      exampleScenario:
        'You are configuring a small office network. You choose /26 to give four subnets inside a /24. Entering 26 shows 62 usable hosts per subnet — enough for 50 workstations with room to grow, while reserving the network address (x.x.x.0) and broadcast address (x.x.x.63).',
      proTip:
        'Every subnet always loses 2 addresses: the network address (all host bits = 0) and the broadcast address (all host bits = 1). A /31 is a special point-to-point exception (RFC 3021) with 0 usable hosts by the standard formula but 2 in practice. A /32 represents a single host route.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 2. Bandwidth / Download Time Calculator
  // =========================================================================
  {
    id: 'download-time-calculator',
    slug: 'download-time-calculator',
    title: 'Bandwidth / Download Time',
    description:
      'Estimate how long it takes to download or transfer a file given your connection speed and file size.',
    icon: '⬇️',
    category: 'tech',
    subcategory: 'networking',
    tags: ['bandwidth', 'download', 'speed', 'transfer', 'time', 'mbps', 'file'],
    inputs: [
      {
        id: 'fileSize',
        label: 'File Size',
        type: 'number',
        defaultValue: 1000,
        min: 0,
        step: 1,
        placeholder: 'e.g. 1000',
        helpText: 'Enter the file size in the unit selected below.',
        required: true,
      },
      {
        id: 'fileSizeUnit',
        label: 'File Size Unit',
        type: 'select',
        options: [
          { label: 'MB (Megabytes)', value: '1' },
          { label: 'GB (Gigabytes)', value: '1024' },
          { label: 'TB (Terabytes)', value: '1048576' },
        ],
        defaultValue: '1024',
        required: true,
      },
      {
        id: 'bandwidth',
        label: 'Connection Speed',
        type: 'number',
        defaultValue: 100,
        min: 0,
        step: 1,
        placeholder: 'e.g. 100',
        helpText: 'Your connection speed in the unit selected below.',
        required: true,
      },
      {
        id: 'bandwidthUnit',
        label: 'Speed Unit',
        type: 'select',
        options: [
          { label: 'Mbps (Megabits per second)', value: '1' },
          { label: 'Gbps (Gigabits per second)', value: '1000' },
          { label: 'Kbps (Kilobits per second)', value: '0.001' },
        ],
        defaultValue: '1',
        required: true,
      },
    ],
    formulas: [
      {
        // fileSize (MB) x fileSizeUnit (MB multiplier) x 8 (bits per byte) = Megabits
        id: 'fileSizeMb',
        expression: 'fileSize * fileSizeUnit * 8',
        dependencies: ['fileSize', 'fileSizeUnit'],
      },
      {
        id: 'speedMbps',
        expression: 'bandwidth * bandwidthUnit',
        dependencies: ['bandwidth', 'bandwidthUnit'],
      },
      {
        id: 'seconds',
        expression: 'fileSizeMb / speedMbps',
        dependencies: ['fileSizeMb', 'speedMbps'],
      },
      {
        id: 'minutes',
        expression: 'seconds / 60',
        dependencies: ['seconds'],
      },
      {
        id: 'hours',
        expression: 'minutes / 60',
        dependencies: ['minutes'],
      },
    ],
    outputs: [
      {
        id: 'secondsOut',
        label: 'Transfer Time',
        formulaRef: 'seconds',
        format: 'number',
        precision: 1,
        suffix: ' seconds',
        highlight: true,
      },
      {
        id: 'minutesOut',
        label: 'Transfer Time',
        formulaRef: 'minutes',
        format: 'number',
        precision: 2,
        suffix: ' minutes',
      },
      {
        id: 'hoursOut',
        label: 'Transfer Time',
        formulaRef: 'hours',
        format: 'number',
        precision: 3,
        suffix: ' hours',
      },
    ],
    guide: {
      whatIsIt:
        'This calculator converts a file size and network speed into a download or upload duration. ISPs advertise speeds in Megabits per second (Mbps) while file sizes are displayed in Megabytes (MB) — that 8x factor is the single biggest source of confusion.',
      howToUse:
        'Enter your file size and select the unit (MB, GB, or TB). Then enter your connection speed and choose Mbps, Gbps, or Kbps. The calculator converts everything to Megabits and divides to give you time in seconds, minutes, and hours.',
      exampleScenario:
        'You want to download a 50 GB game on a 200 Mbps fibre connection. Set file size to 50 GB and speed to 200 Mbps. Result: ~2,000 seconds ~33 minutes — at a perfect theoretical rate. Real-world speeds are typically 60-80% of the rated value.',
      proTip:
        'Internet speeds are in bits (b, lowercase), file sizes in bytes (B, uppercase). 1 MB = 8 Mb. A 100 Mbps line delivers a maximum of 12.5 MB/s. Overhead from TCP/IP headers, encryption (VPN, HTTPS), and Wi-Fi contention typically reduce real-world throughput to 70-90% of the rated speed.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 3. RAID Calculator
  // =========================================================================
  {
    id: 'raid-calculator',
    slug: 'raid-calculator',
    title: 'RAID Storage Calculator',
    description:
      'Calculate usable storage capacity, efficiency, and fault tolerance for RAID 0, 1, 5, 6, and 10 configurations.',
    icon: '💾',
    category: 'tech',
    subcategory: 'storage',
    tags: ['raid', 'storage', 'redundancy', 'disk', 'NAS', 'server', 'fault-tolerance'],
    inputs: [
      {
        id: 'numDrives',
        label: 'Number of Drives',
        type: 'number',
        defaultValue: 4,
        min: 2,
        max: 16,
        step: 1,
        placeholder: 'e.g. 4',
        helpText: 'Total number of physical drives in the array.',
        required: true,
      },
      {
        id: 'driveSize',
        label: 'Drive Size (TB)',
        type: 'number',
        defaultValue: 4,
        min: 0,
        step: 0.5,
        placeholder: 'e.g. 4',
        helpText: 'Capacity of each individual drive in terabytes.',
        required: true,
      },
      {
        id: 'raidLevel',
        label: 'RAID Level',
        type: 'select',
        options: [
          { label: 'RAID 0 — Striping (no redundancy)', value: '0' },
          { label: 'RAID 1 — Mirroring (1 parity drive)', value: '1' },
          { label: 'RAID 5 — Striping + parity (1 parity)', value: '5' },
          { label: 'RAID 6 — Striping + dual parity (2 parity)', value: '6' },
          { label: 'RAID 10 — Mirror + stripe', value: '10' },
        ],
        defaultValue: '5',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'totalRaw',
        expression: 'numDrives * driveSize',
        dependencies: ['numDrives', 'driveSize'],
      },
      {
        id: 'raid0',
        expression: 'totalRaw',
        dependencies: ['totalRaw'],
      },
      {
        id: 'raid1',
        expression: 'driveSize',
        dependencies: ['driveSize'],
      },
      {
        id: 'raid5',
        expression: 'totalRaw - driveSize',
        dependencies: ['totalRaw', 'driveSize'],
      },
      {
        id: 'raid6',
        expression: 'totalRaw - 2 * driveSize',
        dependencies: ['totalRaw', 'driveSize'],
      },
      {
        id: 'raid10',
        expression: 'totalRaw / 2',
        dependencies: ['totalRaw'],
      },
      {
        id: 'usable',
        expression: 'raidLevel == 0 ? raid0 : (raidLevel == 1 ? raid1 : (raidLevel == 5 ? raid5 : (raidLevel == 6 ? raid6 : raid10)))',
        dependencies: ['raidLevel', 'raid0', 'raid1', 'raid5', 'raid6', 'raid10'],
      },
      {
        id: 'efficiency',
        expression: 'usable / totalRaw * 100',
        dependencies: ['usable', 'totalRaw'],
      },
      {
        id: 'faultTolerance',
        expression: 'raidLevel == 0 ? 0 : (raidLevel == 1 ? 1 : (raidLevel == 5 ? 1 : (raidLevel == 6 ? 2 : 1)))',
        dependencies: ['raidLevel'],
      },
    ],
    outputs: [
      {
        id: 'usableOut',
        label: 'Usable Storage',
        formulaRef: 'usable',
        format: 'number',
        precision: 2,
        suffix: ' TB',
        highlight: true,
      },
      {
        id: 'efficiencyOut',
        label: 'Storage Efficiency',
        formulaRef: 'efficiency',
        format: 'number',
        precision: 1,
        suffix: '%',
      },
      {
        id: 'faultToleranceOut',
        label: 'Fault Tolerance',
        formulaRef: 'faultTolerance',
        format: 'number',
        precision: 0,
        suffix: ' drive(s) can fail safely',
      },
      {
        id: 'totalRawOut',
        label: 'Total Raw Capacity',
        formulaRef: 'totalRaw',
        format: 'number',
        precision: 2,
        suffix: ' TB',
      },
    ],
    guide: {
      whatIsIt:
        'RAID (Redundant Array of Independent Disks) combines multiple physical drives into a logical volume with varying trade-offs between performance, capacity, and redundancy. The level you choose determines how much capacity is sacrificed for protection.',
      howToUse:
        'Enter the number of drives, the capacity of each drive, and choose a RAID level. The calculator shows usable storage, efficiency (usable divided by raw), and how many drives can fail before data loss occurs.',
      exampleScenario:
        'You have 4 x 4 TB drives. RAID 5 gives 12 TB usable (75% efficiency, 1 drive failure tolerated). RAID 6 gives 8 TB usable (50% efficiency, 2 drive failures tolerated). RAID 0 gives 16 TB (100% efficiency, 0 tolerance — any failure loses everything).',
      proTip:
        'RAID is NOT a backup. It protects against drive failure, not against accidental deletion, ransomware, fire, or theft. Always follow the 3-2-1 rule: 3 copies of data, on 2 different media types, with 1 offsite. RAID 10 offers the best read/write performance with redundancy but costs 50% of raw capacity.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 4. Aspect Ratio Calculator
  // =========================================================================
  {
    id: 'aspect-ratio-calculator',
    slug: 'aspect-ratio-calculator',
    title: 'Aspect Ratio Calculator',
    description:
      'Find the simplified aspect ratio, decimal ratio, and pixel diagonal for any resolution or dimension pair.',
    icon: '🖥️',
    category: 'tech',
    subcategory: 'display',
    tags: ['aspect-ratio', 'resolution', 'display', '16:9', '4:3', 'pixels', 'widescreen'],
    inputs: [
      {
        id: 'width',
        label: 'Width (px or any unit)',
        type: 'number',
        defaultValue: 1920,
        min: 1,
        step: 1,
        placeholder: 'e.g. 1920',
        required: true,
      },
      {
        id: 'height',
        label: 'Height (px or any unit)',
        type: 'number',
        defaultValue: 1080,
        min: 1,
        step: 1,
        placeholder: 'e.g. 1080',
        required: true,
      },
    ],
    formulas: [
      // Two-step approximation of GCD via Euclidean remainders
      {
        id: 'r1',
        expression: 'width - floor(width / height) * height',
        dependencies: ['width', 'height'],
      },
      {
        id: 'r2',
        expression: 'r1 > 0 ? height - floor(height / r1) * r1 : height',
        dependencies: ['r1', 'height'],
      },
      {
        id: 'gcd',
        expression: 'r1 == 0 ? height : (r2 == 0 ? r1 : min(r1, r2))',
        dependencies: ['r1', 'r2', 'height'],
      },
      {
        id: 'ratioW',
        expression: 'width / gcd',
        dependencies: ['width', 'gcd'],
      },
      {
        id: 'ratioH',
        expression: 'height / gcd',
        dependencies: ['height', 'gcd'],
      },
      {
        id: 'diagonal',
        expression: 'sqrt(pow(width, 2) + pow(height, 2))',
        dependencies: ['width', 'height'],
      },
      {
        id: 'ratio',
        expression: 'width / height',
        dependencies: ['width', 'height'],
      },
    ],
    outputs: [
      {
        id: 'ratioWOut',
        label: 'Ratio Width Part',
        formulaRef: 'ratioW',
        format: 'number',
        precision: 0,
        highlight: true,
      },
      {
        id: 'ratioHOut',
        label: 'Ratio Height Part',
        formulaRef: 'ratioH',
        format: 'number',
        precision: 0,
        highlight: true,
      },
      {
        id: 'ratioOut',
        label: 'Decimal Ratio (W/H)',
        formulaRef: 'ratio',
        format: 'number',
        precision: 4,
      },
      {
        id: 'diagonalOut',
        label: 'Pixel Diagonal',
        formulaRef: 'diagonal',
        format: 'number',
        precision: 1,
        suffix: ' px diagonal',
      },
    ],
    guide: {
      whatIsIt:
        'The aspect ratio is the proportional relationship between a display width and height expressed as W:H. A 1920x1080 display has the same 16:9 ratio as a 3840x2160 (4K) display — they just have different pixel densities.',
      howToUse:
        'Enter the width and height of your resolution or physical dimensions. The calculator uses the Euclidean algorithm to find the greatest common divisor (GCD) and reduces the ratio to its simplest form. It also shows the exact decimal ratio and pixel diagonal.',
      exampleScenario:
        'A 2560x1080 ultrawide monitor: the simplified ratio is 64:27 (a true 21:9 is approximately 21.333:9, so this is close). The decimal ratio is 2.3704 — noticeably wider than 16:9 (1.7778). Pixel diagonal = 2,775 px.',
      proTip:
        'When scaling video, multiply both ratio parts by the same integer to get equivalent resolutions. Letterboxing (black bars on top/bottom) occurs when video is wider than the screen ratio; pillarboxing (bars on sides) occurs when video is narrower. Common ratios: 4:3 (old TV/monitor), 16:9 (HD/4K standard), 21:9 (ultrawide cinema).',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 5. DPI / PPI Calculator
  // =========================================================================
  {
    id: 'dpi-ppi-calculator',
    slug: 'dpi-ppi-calculator',
    title: 'DPI / PPI Calculator',
    description:
      'Calculate the pixel density (PPI) and dot pitch of a display from its resolution and physical screen size.',
    icon: '🔍',
    category: 'tech',
    subcategory: 'display',
    tags: ['dpi', 'ppi', 'pixel-density', 'screen', 'monitor', 'retina', 'display', '4K'],
    inputs: [
      {
        id: 'resWidth',
        label: 'Resolution Width (px)',
        type: 'number',
        defaultValue: 2560,
        min: 1,
        step: 1,
        placeholder: 'e.g. 2560',
        required: true,
      },
      {
        id: 'resHeight',
        label: 'Resolution Height (px)',
        type: 'number',
        defaultValue: 1440,
        min: 1,
        step: 1,
        placeholder: 'e.g. 1440',
        required: true,
      },
      {
        id: 'screenSize',
        label: 'Screen Diagonal (inches)',
        type: 'number',
        defaultValue: 27,
        min: 0.1,
        step: 0.1,
        placeholder: 'e.g. 27',
        helpText: 'Measured corner-to-corner diagonally (the number on the box).',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'diagPx',
        expression: 'sqrt(pow(resWidth, 2) + pow(resHeight, 2))',
        dependencies: ['resWidth', 'resHeight'],
      },
      {
        id: 'ppi',
        expression: 'diagPx / screenSize',
        dependencies: ['diagPx', 'screenSize'],
      },
      {
        id: 'dotPitch',
        expression: '25.4 / ppi',
        dependencies: ['ppi'],
      },
    ],
    outputs: [
      {
        id: 'ppiOut',
        label: 'Pixel Density',
        formulaRef: 'ppi',
        format: 'number',
        precision: 1,
        suffix: ' PPI',
        highlight: true,
      },
      {
        id: 'dotPitchOut',
        label: 'Dot Pitch',
        formulaRef: 'dotPitch',
        format: 'number',
        precision: 4,
        suffix: ' mm per pixel',
      },
      {
        id: 'diagPxOut',
        label: 'Diagonal Resolution',
        formulaRef: 'diagPx',
        format: 'number',
        precision: 0,
        suffix: ' px diagonal',
      },
    ],
    guide: {
      whatIsIt:
        'PPI (Pixels Per Inch) measures the pixel density of a display — how many pixels are packed into each inch of screen area. Higher PPI means sharper images. Dot pitch is the inverse: the physical size of each pixel in millimetres.',
      howToUse:
        'Enter your screen horizontal and vertical resolution in pixels, then enter the diagonal screen size in inches (as marketed). The PPI is the diagonal pixel count divided by the diagonal inch measurement.',
      exampleScenario:
        'A 27-inch 2560x1440 (QHD) monitor: PPI = 108.8. A 27-inch 3840x2160 (4K) monitor: PPI = 163.2. Apple Retina threshold at 27 inches (typical arm length) is ~110 PPI — so 4K at 27 inches is definitively Retina, while QHD sits right at the threshold.',
      proTip:
        'Apple originally defined Retina as ~220 PPI for iPhones (~10 inches viewing distance) and ~110 PPI for large displays (~20 inches). The relevant metric is PPI x viewing distance — a 400 PPI TV watched from 10 feet is less sharp in terms of angular resolution than a 200 PPI monitor at 2 feet.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 6. Password Entropy Calculator
  // =========================================================================
  {
    id: 'password-entropy',
    slug: 'password-entropy',
    title: 'Password Entropy Calculator',
    description:
      'Estimate the cryptographic strength (entropy) of a password based on its length and character set.',
    icon: '🔐',
    category: 'tech',
    subcategory: 'security',
    tags: ['password', 'entropy', 'security', 'bits', 'strength', 'crack', 'cybersecurity'],
    inputs: [
      {
        id: 'passwordLength',
        label: 'Password Length (characters)',
        type: 'number',
        defaultValue: 12,
        min: 1,
        max: 128,
        step: 1,
        placeholder: 'e.g. 12',
        required: true,
      },
      {
        id: 'usesLower',
        label: 'Lowercase Letters (a-z)',
        type: 'select',
        options: [
          { label: 'No', value: '0' },
          { label: 'Yes', value: '1' },
        ],
        defaultValue: '1',
        helpText: 'Adds 26 characters to the pool.',
        required: true,
      },
      {
        id: 'usesUpper',
        label: 'Uppercase Letters (A-Z)',
        type: 'select',
        options: [
          { label: 'No', value: '0' },
          { label: 'Yes', value: '1' },
        ],
        defaultValue: '1',
        helpText: 'Adds 26 characters to the pool.',
        required: true,
      },
      {
        id: 'usesDigits',
        label: 'Digits (0-9)',
        type: 'select',
        options: [
          { label: 'No', value: '0' },
          { label: 'Yes', value: '1' },
        ],
        defaultValue: '1',
        helpText: 'Adds 10 characters to the pool.',
        required: true,
      },
      {
        id: 'usesSymbols',
        label: 'Symbols (!@#$... etc.)',
        type: 'select',
        options: [
          { label: 'No', value: '0' },
          { label: 'Yes', value: '1' },
        ],
        defaultValue: '1',
        helpText: 'Adds 32 commonly available symbols to the pool.',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'charsetSize',
        expression: 'usesLower * 26 + usesUpper * 26 + usesDigits * 10 + usesSymbols * 32',
        dependencies: ['usesLower', 'usesUpper', 'usesDigits', 'usesSymbols'],
      },
      {
        // Entropy H = L x log2(N) = L x ln(N) / ln(2)
        id: 'entropy',
        expression: 'passwordLength * ln(charsetSize) / ln(2)',
        dependencies: ['passwordLength', 'charsetSize'],
      },
      {
        // Crack time in seconds at 1 billion guesses per second: 2^entropy / 1e9
        id: 'crackTimeSeconds',
        expression: 'pow(2, entropy) / 1000000000',
        dependencies: ['entropy'],
      },
      {
        id: 'crackTimeYears',
        expression: 'crackTimeSeconds / 31536000',
        dependencies: ['crackTimeSeconds'],
      },
    ],
    outputs: [
      {
        id: 'entropyOut',
        label: 'Password Entropy',
        formulaRef: 'entropy',
        format: 'number',
        precision: 1,
        suffix: ' bits',
        highlight: true,
      },
      {
        id: 'crackTimeYearsOut',
        label: 'Years to Crack (1B guesses/sec)',
        formulaRef: 'crackTimeYears',
        format: 'number',
        precision: 2,
      },
      {
        id: 'charsetSizeOut',
        label: 'Character Pool Size',
        formulaRef: 'charsetSize',
        format: 'number',
        precision: 0,
      },
    ],
    guide: {
      whatIsIt:
        'Password entropy measures how unpredictable (and thus how hard to brute-force) a password is. It is calculated as H = L x log2(N), where L is the password length and N is the size of the character set. Every extra bit of entropy doubles the number of guesses needed.',
      howToUse:
        'Select which character types your password uses and enter its length. The calculator computes the full character pool size, the resulting entropy in bits, and an estimated time to crack by exhaustive brute-force at 1 billion guesses per second (a fast GPU rate).',
      exampleScenario:
        'A 12-character password using all four character types (94-char pool) gives ~78.8 bits of entropy. At 1B guesses/sec that is ~12 million years. A 6-character all-lowercase password gives ~28 bits — cracked in under a second. Length matters far more than character variety.',
      proTip:
        'NIST SP 800-63B (2017 guidelines) recommends at least 8 characters and prioritises length over complexity. A memorable passphrase of 4 random words (e.g. "correct-horse-battery-staple") provides ~50+ bits of entropy and is easier to remember than "P@ssw0rd1!". Targets: 60 bits = good, 80 bits = great, 100+ bits = excellent for high-security use.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 7. Uptime / SLA Calculator
  // =========================================================================
  {
    id: 'uptime-calculator',
    slug: 'uptime-calculator',
    title: 'Uptime / SLA Calculator',
    description:
      'Convert an uptime percentage SLA into concrete allowed downtime per day, week, month, or year.',
    icon: '📊',
    category: 'tech',
    subcategory: 'networking',
    tags: ['uptime', 'sla', 'availability', 'downtime', 'nines', 'reliability', 'devops'],
    inputs: [
      {
        id: 'uptimePct',
        label: 'Uptime SLA (%)',
        type: 'range',
        defaultValue: 99.9,
        min: 90,
        max: 99.999,
        step: 0.001,
        helpText: 'Drag or type your SLA uptime percentage. 99.9% = "three nines".',
        required: true,
      },
      {
        id: 'period',
        label: 'Time Period',
        type: 'select',
        options: [
          { label: 'Per Day (86,400 seconds)', value: '86400' },
          { label: 'Per Week (604,800 seconds)', value: '604800' },
          { label: 'Per Month (30 days)', value: '2592000' },
          { label: 'Per Year (365 days)', value: '31536000' },
        ],
        defaultValue: '31536000',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'downtimePct',
        expression: '100 - uptimePct',
        dependencies: ['uptimePct'],
      },
      {
        id: 'downtimeSeconds',
        expression: 'period * downtimePct / 100',
        dependencies: ['period', 'downtimePct'],
      },
      {
        id: 'downtimeMinutes',
        expression: 'downtimeSeconds / 60',
        dependencies: ['downtimeSeconds'],
      },
      {
        id: 'downtimeHours',
        expression: 'downtimeMinutes / 60',
        dependencies: ['downtimeMinutes'],
      },
    ],
    outputs: [
      {
        id: 'downtimeHoursOut',
        label: 'Allowed Downtime',
        formulaRef: 'downtimeHours',
        format: 'number',
        precision: 2,
        suffix: ' hours/period',
        highlight: true,
      },
      {
        id: 'downtimeMinutesOut',
        label: 'Allowed Downtime',
        formulaRef: 'downtimeMinutes',
        format: 'number',
        precision: 1,
        suffix: ' minutes/period',
      },
      {
        id: 'downtimeSecondsOut',
        label: 'Allowed Downtime',
        formulaRef: 'downtimeSeconds',
        format: 'number',
        precision: 0,
        suffix: ' seconds/period',
      },
    ],
    guide: {
      whatIsIt:
        '"Nines of availability" describes how much uptime a service guarantees. Three nines (99.9%) allows ~8.7 hours of downtime per year. Each additional nine reduces allowed downtime by roughly 90%, making each increment dramatically harder and more expensive to achieve.',
      howToUse:
        'Drag the slider to your SLA uptime percentage (or type it), then choose the time period. The calculator shows the total permitted downtime in hours, minutes, and seconds for that period.',
      exampleScenario:
        'Your cloud provider offers a 99.95% SLA per month. Selecting "Per Month" at 99.95% shows ~21.6 minutes of allowed downtime per month. If you experience 30 minutes of outage, the SLA is breached and you may be entitled to service credits.',
      proTip:
        'Nines reference table (per year): 99% = 87.6 hr | 99.9% = 8.76 hr | 99.99% = 52.6 min | 99.999% = 5.26 min | 99.9999% = 31.5 sec. Note that scheduled maintenance windows are often excluded from SLA calculations — always read the fine print. Achieving five nines typically requires active-active redundancy across multiple availability zones.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 8. Data Storage Converter
  // =========================================================================
  {
    id: 'data-storage-converter',
    slug: 'data-storage-converter',
    title: 'Data Storage Unit Converter',
    description:
      'Convert a storage value between Bytes, Kilobytes, Megabytes, Gigabytes, and Terabytes instantly.',
    icon: '📦',
    category: 'tech',
    subcategory: 'storage',
    tags: ['storage', 'bytes', 'kb', 'mb', 'gb', 'tb', 'convert', 'binary', 'data'],
    inputs: [
      {
        id: 'value',
        label: 'Value to Convert',
        type: 'number',
        defaultValue: 1,
        min: 0,
        step: 1,
        placeholder: 'e.g. 1',
        required: true,
      },
      {
        id: 'fromUnit',
        label: 'From Unit',
        type: 'select',
        options: [
          { label: 'Bytes (B)', value: '1' },
          { label: 'Kilobytes (KB = 1,024 B)', value: '1024' },
          { label: 'Megabytes (MB = 1,048,576 B)', value: '1048576' },
          { label: 'Gigabytes (GB = 1,073,741,824 B)', value: '1073741824' },
          { label: 'Terabytes (TB = 1,099,511,627,776 B)', value: '1099511627776' },
        ],
        defaultValue: '1073741824',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'bytes',
        expression: 'value * fromUnit',
        dependencies: ['value', 'fromUnit'],
      },
      {
        id: 'toKB',
        expression: 'bytes / 1024',
        dependencies: ['bytes'],
      },
      {
        id: 'toMB',
        expression: 'bytes / 1048576',
        dependencies: ['bytes'],
      },
      {
        id: 'toGB',
        expression: 'bytes / 1073741824',
        dependencies: ['bytes'],
      },
      {
        id: 'toTB',
        expression: 'bytes / 1099511627776',
        dependencies: ['bytes'],
      },
    ],
    outputs: [
      {
        id: 'toBytesOut',
        label: 'Bytes',
        formulaRef: 'bytes',
        format: 'number',
        precision: 0,
        suffix: ' B',
      },
      {
        id: 'toKBOut',
        label: 'Kilobytes',
        formulaRef: 'toKB',
        format: 'number',
        precision: 3,
        suffix: ' KB',
      },
      {
        id: 'toMBOut',
        label: 'Megabytes',
        formulaRef: 'toMB',
        format: 'number',
        precision: 6,
        suffix: ' MB',
      },
      {
        id: 'toGBOut',
        label: 'Gigabytes',
        formulaRef: 'toGB',
        format: 'number',
        precision: 9,
        suffix: ' GB',
        highlight: true,
      },
      {
        id: 'toTBOut',
        label: 'Terabytes',
        formulaRef: 'toTB',
        format: 'number',
        precision: 12,
        suffix: ' TB',
      },
    ],
    guide: {
      whatIsIt:
        'Digital storage uses powers of 2: 1 KB = 1,024 bytes, 1 MB = 1,024 KB, 1 GB = 1,024 MB, and so on. This is the "binary" (IEC) definition used by operating systems. Hard drive manufacturers use the "SI" definition (1 GB = 1,000,000,000 bytes) to make their drives appear larger.',
      howToUse:
        'Enter a numeric value and select its unit. All equivalent values in every other unit are displayed instantly. Useful for comparing cloud storage limits, RAM specifications, file sizes, and drive capacities.',
      exampleScenario:
        'You buy a "1 TB" hard drive but Windows shows 931 GB. Why? The manufacturer means 1,000,000,000,000 bytes. Windows divides by 1,073,741,824 (1024 cubed) to get GiB, which it labels as GB. Enter 1 TB in this calculator: that is 1,099,511,627,776 bytes. The drive gives you 1,000,000,000,000 bytes — about 931.32 GiB.',
      proTip:
        'The IEC standard (1999) introduced distinct units to avoid confusion: 1 kibibyte (KiB) = 1,024 bytes, 1 mebibyte (MiB) = 1,048,576 bytes, etc. Linux and macOS use binary units but label them GiB/MiB. Network speeds always use SI decimal (1 Gbps = 1,000,000,000 bits/s), never binary.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 9. CHMOD Calculator
  // =========================================================================
  {
    id: 'chmod-calculator',
    slug: 'chmod-calculator',
    title: 'CHMOD Permission Calculator',
    description:
      'Build Unix/Linux file permission octals by selecting read, write, and execute rights for owner, group, and others.',
    icon: '🔒',
    category: 'tech',
    subcategory: 'tools',
    tags: ['chmod', 'permissions', 'unix', 'linux', 'octal', 'rwx', 'security', 'file'],
    inputs: [
      {
        id: 'ownerRead',
        label: 'Owner: Read (r)',
        type: 'select',
        options: [
          { label: 'No (0)', value: '0' },
          { label: 'Yes (4)', value: '4' },
        ],
        defaultValue: '4',
        group: 'owner',
        required: true,
      },
      {
        id: 'ownerWrite',
        label: 'Owner: Write (w)',
        type: 'select',
        options: [
          { label: 'No (0)', value: '0' },
          { label: 'Yes (2)', value: '2' },
        ],
        defaultValue: '2',
        group: 'owner',
        required: true,
      },
      {
        id: 'ownerExec',
        label: 'Owner: Execute (x)',
        type: 'select',
        options: [
          { label: 'No (0)', value: '0' },
          { label: 'Yes (1)', value: '1' },
        ],
        defaultValue: '1',
        group: 'owner',
        required: true,
      },
      {
        id: 'groupRead',
        label: 'Group: Read (r)',
        type: 'select',
        options: [
          { label: 'No (0)', value: '0' },
          { label: 'Yes (4)', value: '4' },
        ],
        defaultValue: '4',
        group: 'group',
        required: true,
      },
      {
        id: 'groupWrite',
        label: 'Group: Write (w)',
        type: 'select',
        options: [
          { label: 'No (0)', value: '0' },
          { label: 'Yes (2)', value: '2' },
        ],
        defaultValue: '0',
        group: 'group',
        required: true,
      },
      {
        id: 'groupExec',
        label: 'Group: Execute (x)',
        type: 'select',
        options: [
          { label: 'No (0)', value: '0' },
          { label: 'Yes (1)', value: '1' },
        ],
        defaultValue: '0',
        group: 'group',
        required: true,
      },
      {
        id: 'otherRead',
        label: 'Others: Read (r)',
        type: 'select',
        options: [
          { label: 'No (0)', value: '0' },
          { label: 'Yes (4)', value: '4' },
        ],
        defaultValue: '4',
        group: 'other',
        required: true,
      },
      {
        id: 'otherWrite',
        label: 'Others: Write (w)',
        type: 'select',
        options: [
          { label: 'No (0)', value: '0' },
          { label: 'Yes (2)', value: '2' },
        ],
        defaultValue: '0',
        group: 'other',
        required: true,
      },
      {
        id: 'otherExec',
        label: 'Others: Execute (x)',
        type: 'select',
        options: [
          { label: 'No (0)', value: '0' },
          { label: 'Yes (1)', value: '1' },
        ],
        defaultValue: '0',
        group: 'other',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'ownerOctal',
        expression: 'ownerRead + ownerWrite + ownerExec',
        dependencies: ['ownerRead', 'ownerWrite', 'ownerExec'],
      },
      {
        id: 'groupOctal',
        expression: 'groupRead + groupWrite + groupExec',
        dependencies: ['groupRead', 'groupWrite', 'groupExec'],
      },
      {
        id: 'otherOctal',
        expression: 'otherRead + otherWrite + otherExec',
        dependencies: ['otherRead', 'otherWrite', 'otherExec'],
      },
      {
        // Combine into 3-digit octal representation as a decimal integer (e.g. 755 = 7*100 + 5*10 + 5)
        id: 'chmodValue',
        expression: 'ownerOctal * 100 + groupOctal * 10 + otherOctal',
        dependencies: ['ownerOctal', 'groupOctal', 'otherOctal'],
      },
    ],
    outputs: [
      {
        id: 'chmodValueOut',
        label: 'CHMOD Value',
        formulaRef: 'chmodValue',
        format: 'number',
        precision: 0,
        prefix: 'chmod ',
        highlight: true,
      },
      {
        id: 'ownerOctalOut',
        label: 'Owner Octal Digit',
        formulaRef: 'ownerOctal',
        format: 'number',
        precision: 0,
      },
      {
        id: 'groupOctalOut',
        label: 'Group Octal Digit',
        formulaRef: 'groupOctal',
        format: 'number',
        precision: 0,
      },
      {
        id: 'otherOctalOut',
        label: 'Other Octal Digit',
        formulaRef: 'otherOctal',
        format: 'number',
        precision: 0,
      },
    ],
    guide: {
      whatIsIt:
        'Unix/Linux file permissions control who can read, write, or execute a file. They are represented as a 3-digit octal number, one digit each for the owner, group, and all others. Each digit is the sum of: Read (4) + Write (2) + Execute (1).',
      howToUse:
        'Toggle the read, write, and execute switches for Owner, Group, and Others. The calculator sums each group values (r=4, w=2, x=1) into an octal digit, then assembles the three digits into the final chmod value you can use directly in a terminal.',
      exampleScenario:
        'A web server config file should be readable and writable by owner (rw- = 6), readable by group (r-- = 4), readable by others (r-- = 4): chmod 644. An executable script for the owner only (rwx = 7), no access for others (--- = 0): chmod 700.',
      proTip:
        'Common permission values: 755 (rwxr-xr-x) — owner full, others read+execute, typical for directories and executables. 644 (rw-r--r--) — owner read+write, others read-only, typical for config files. 777 (rwxrwxrwx) — all permissions for everyone — NEVER use on a production server; it is a major security vulnerability. Use "ls -la" in a terminal to view current permissions.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 10. Hex / Decimal / Binary Converter
  // =========================================================================
  {
    id: 'number-base-converter',
    slug: 'number-base-converter',
    title: 'Number Base Converter',
    description:
      'Decompose a decimal integer into its 8-bit binary representation and hexadecimal nibbles without leaving the browser.',
    icon: '🔢',
    category: 'tech',
    subcategory: 'tools',
    tags: ['binary', 'hex', 'decimal', 'base', 'convert', 'nibble', 'bits', 'number-system'],
    inputs: [
      {
        id: 'decimalValue',
        label: 'Decimal Value (0-255 for 8-bit)',
        type: 'number',
        defaultValue: 255,
        min: 0,
        step: 1,
        placeholder: 'e.g. 255',
        helpText: 'Enter any non-negative integer. Binary output shows 8 bits of the lowest byte.',
        required: true,
      },
      {
        id: 'byteCount',
        label: 'Byte Range',
        type: 'select',
        options: [
          { label: '1 byte  (0 - 255)', value: '1' },
          { label: '2 bytes (0 - 65,535)', value: '2' },
          { label: '4 bytes (0 - 4,294,967,295)', value: '4' },
        ],
        defaultValue: '1',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'maxVal',
        expression: 'pow(256, byteCount) - 1',
        dependencies: ['byteCount'],
      },
      {
        id: 'isValid',
        expression: 'decimalValue <= maxVal ? 1 : 0',
        dependencies: ['decimalValue', 'maxVal'],
      },
      // Hex nibbles (for the lowest byte, i.e. decimalValue mod 256)
      {
        id: 'upperNibble',
        expression: 'floor(decimalValue / 16)',
        dependencies: ['decimalValue'],
      },
      {
        id: 'lowerNibble',
        expression: 'decimalValue - upperNibble * 16',
        dependencies: ['decimalValue', 'upperNibble'],
      },
      // 8-bit binary decomposition of decimalValue (lowest 8 bits)
      {
        id: 'bit7',
        expression: 'decimalValue >= 128 ? 1 : 0',
        dependencies: ['decimalValue'],
      },
      {
        id: 'rem7',
        expression: 'decimalValue - bit7 * 128',
        dependencies: ['decimalValue', 'bit7'],
      },
      {
        id: 'bit6',
        expression: 'rem7 >= 64 ? 1 : 0',
        dependencies: ['rem7'],
      },
      {
        id: 'rem6',
        expression: 'rem7 - bit6 * 64',
        dependencies: ['rem7', 'bit6'],
      },
      {
        id: 'bit5',
        expression: 'rem6 >= 32 ? 1 : 0',
        dependencies: ['rem6'],
      },
      {
        id: 'rem5',
        expression: 'rem6 - bit5 * 32',
        dependencies: ['rem6', 'bit5'],
      },
      {
        id: 'bit4',
        expression: 'rem5 >= 16 ? 1 : 0',
        dependencies: ['rem5'],
      },
      {
        id: 'rem4',
        expression: 'rem5 - bit4 * 16',
        dependencies: ['rem5', 'bit4'],
      },
      {
        id: 'bit3',
        expression: 'rem4 >= 8 ? 1 : 0',
        dependencies: ['rem4'],
      },
      {
        id: 'rem3',
        expression: 'rem4 - bit3 * 8',
        dependencies: ['rem4', 'bit3'],
      },
      {
        id: 'bit2',
        expression: 'rem3 >= 4 ? 1 : 0',
        dependencies: ['rem3'],
      },
      {
        id: 'rem2',
        expression: 'rem3 - bit2 * 4',
        dependencies: ['rem3', 'bit2'],
      },
      {
        id: 'bit1',
        expression: 'rem2 >= 2 ? 1 : 0',
        dependencies: ['rem2'],
      },
      {
        id: 'bit0',
        expression: 'rem2 - bit1 * 2',
        dependencies: ['rem2', 'bit1'],
      },
      {
        // Assemble bits into a decimal integer where each digit position is a bit (MSB to LSB)
        id: 'binaryInt',
        expression: 'bit7 * 10000000 + bit6 * 1000000 + bit5 * 100000 + bit4 * 10000 + bit3 * 1000 + bit2 * 100 + bit1 * 10 + bit0',
        dependencies: ['bit7', 'bit6', 'bit5', 'bit4', 'bit3', 'bit2', 'bit1', 'bit0'],
      },
    ],
    outputs: [
      {
        id: 'binaryIntOut',
        label: 'Binary (8-bit representation)',
        formulaRef: 'binaryInt',
        format: 'number',
        precision: 0,
        highlight: true,
      },
      {
        id: 'upperNibbleOut',
        label: 'Hex Upper Nibble (0-15, i.e. 0-F)',
        formulaRef: 'upperNibble',
        format: 'number',
        precision: 0,
      },
      {
        id: 'lowerNibbleOut',
        label: 'Hex Lower Nibble (0-15, i.e. 0-F)',
        formulaRef: 'lowerNibble',
        format: 'number',
        precision: 0,
      },
      {
        id: 'maxValOut',
        label: 'Max Value for Selected Byte Range',
        formulaRef: 'maxVal',
        format: 'number',
        precision: 0,
      },
    ],
    guide: {
      whatIsIt:
        'Computers store all data as binary (base 2). Hexadecimal (base 16) is a compact shorthand where each hex digit represents exactly 4 binary bits (a "nibble"). Decimal 255 = binary 11111111 = hex FF. This calculator breaks down any byte-range integer into its binary bits and hex nibbles.',
      howToUse:
        'Enter a decimal integer and choose the byte range. The binary output shows all 8 bits of the lowest byte (read left to right from bit 7 to bit 0). Upper and lower nibbles give the two hex digits (0-15 each; convert to hex: 0-9 stay as-is, 10=A, 11=B ... 15=F).',
      exampleScenario:
        'Decimal 170: upper nibble = 10 (hex A), lower nibble = 10 (hex A) -> hex AA. Binary: 10101010. This is the classic 0xAA test pattern used in memory diagnostics because it alternates every bit. Decimal 255 -> upper=15(F), lower=15(F) -> hex FF -> binary 11111111.',
      proTip:
        'Memorise powers of 2 up to 128: 1, 2, 4, 8, 16, 32, 64, 128. Each bit position represents one of these values. Hex is used ubiquitously in computing: color codes (#FF5733), memory addresses (0x7FFF), IP addresses in network code, and binary file headers. Nibble-to-hex: 0=0, 1=1 ... 9=9, 10=A, 11=B, 12=C, 13=D, 14=E, 15=F.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 11. Bandwidth Usage Calculator
  // =========================================================================
  {
    id: 'bandwidth-usage-calculator',
    slug: 'bandwidth-usage-calculator',
    title: 'Bandwidth Usage Calculator',
    description:
      'Estimate total network bandwidth requirements and monthly data consumption for a group of users.',
    icon: '📡',
    category: 'tech',
    subcategory: 'networking',
    tags: ['bandwidth', 'network', 'capacity', 'planning', 'oversubscription', 'isp', 'enterprise'],
    inputs: [
      {
        id: 'users',
        label: 'Number of Users',
        type: 'number',
        defaultValue: 100,
        min: 1,
        step: 1,
        placeholder: 'e.g. 100',
        required: true,
      },
      {
        id: 'avgUsageMbpsPerUser',
        label: 'Avg Usage per User (Mbps)',
        type: 'number',
        defaultValue: 5,
        min: 0,
        step: 0.5,
        placeholder: 'e.g. 5',
        helpText: 'Typical simultaneous consumption per user during peak hours.',
        required: true,
      },
      {
        id: 'peakHours',
        label: 'Peak Hours per Day',
        type: 'range',
        defaultValue: 8,
        min: 1,
        max: 24,
        step: 1,
        helpText: 'Estimated hours per day users are actively consuming bandwidth.',
        required: true,
      },
      {
        id: 'oversubRatio',
        label: 'Oversubscription Ratio',
        type: 'select',
        options: [
          { label: '1:1 — Dedicated (no oversubscription)', value: '1' },
          { label: '2:1 — Light oversubscription', value: '2' },
          { label: '4:1 — Typical enterprise', value: '4' },
          { label: '8:1 — Typical ISP/residential', value: '8' },
        ],
        defaultValue: '4',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'totalPeakMbps',
        expression: 'users * avgUsageMbpsPerUser',
        dependencies: ['users', 'avgUsageMbpsPerUser'],
      },
      {
        id: 'requiredBandwidth',
        expression: 'totalPeakMbps / oversubRatio',
        dependencies: ['totalPeakMbps', 'oversubRatio'],
      },
      {
        // Monthly GB: users x Mbps x peakHours x 30 days / 8 (bits to bytes) / 1024 (MB to GB)
        id: 'monthlyGB',
        expression: 'users * avgUsageMbpsPerUser * peakHours * 30 / 8 / 1024',
        dependencies: ['users', 'avgUsageMbpsPerUser', 'peakHours'],
      },
    ],
    outputs: [
      {
        id: 'requiredBandwidthOut',
        label: 'Required Bandwidth (provisioned)',
        formulaRef: 'requiredBandwidth',
        format: 'number',
        precision: 1,
        suffix: ' Mbps',
        highlight: true,
      },
      {
        id: 'totalPeakMbpsOut',
        label: 'Total Peak Demand (all users simultaneous)',
        formulaRef: 'totalPeakMbps',
        format: 'number',
        precision: 1,
        suffix: ' Mbps',
      },
      {
        id: 'monthlyGBOut',
        label: 'Estimated Monthly Usage',
        formulaRef: 'monthlyGB',
        format: 'number',
        precision: 1,
        suffix: ' GB/month',
      },
    ],
    guide: {
      whatIsIt:
        'Oversubscription is the practice of selling more bandwidth capacity than is physically available, based on the statistical reality that not all users consume maximum bandwidth simultaneously. A 4:1 ratio means you provision 1 Mbps for every 4 Mbps of theoretical peak demand.',
      howToUse:
        'Enter your total user count, their average active usage per person, peak usage hours per day, and your intended oversubscription ratio. The result shows how much bandwidth you need to provision, total theoretical peak demand, and estimated monthly data volume.',
      exampleScenario:
        'A 200-person office where each employee uses ~5 Mbps on average during work hours (8 hr/day), with a 4:1 enterprise oversubscription ratio: required bandwidth = 200 x 5 / 4 = 250 Mbps. Monthly data is approximately 200 x 5 x 8 x 30 / 8 / 1024 = 29.3 TB.',
      proTip:
        'ISPs use oversubscription ratios of 20:1 to 50:1 for residential broadband — your "100 Mbps" plan is shared with neighbours. Enterprise networks typically target 4:1 to 8:1. For latency-sensitive applications (VoIP, video conferencing), consider deploying QoS (Quality of Service) policies to prioritise real-time traffic over bulk transfers regardless of oversubscription.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 12. CRON Expression Helper
  // =========================================================================
  {
    id: 'cron-helper',
    slug: 'cron-helper',
    title: 'CRON Expression Helper',
    description:
      'Select a common schedule preset and learn the corresponding CRON expression fields — minute, hour, day, month, weekday.',
    icon: '⏰',
    category: 'tech',
    subcategory: 'tools',
    tags: ['cron', 'scheduler', 'devops', 'linux', 'crontab', 'automation', 'task', 'job'],
    inputs: [
      {
        id: 'preset',
        label: 'Schedule Preset',
        type: 'select',
        options: [
          { label: 'Every minute  — * * * * *', value: '0' },
          { label: 'Every hour    — 0 * * * *', value: '1' },
          { label: 'Daily midnight — 0 0 * * *', value: '2' },
          { label: 'Weekly Sunday  — 0 0 * * 0', value: '3' },
          { label: 'Monthly 1st    — 0 0 1 * *', value: '4' },
          { label: 'Every 5 min    — */5 * * * *', value: '5' },
          { label: 'Weekdays 9am   — 0 9 * * 1-5', value: '6' },
        ],
        defaultValue: '2',
        helpText: 'CRON format: minute(0-59) hour(0-23) day(1-31) month(1-12) weekday(0-7, 0=Sun)',
        required: true,
      },
    ],
    formulas: [
      {
        // Minute field value: every-minute preset=0 min=0, every-5-min preset=5 min=5, others=0
        id: 'minuteField',
        expression: 'preset == 0 ? 0 : (preset == 5 ? 5 : 0)',
        dependencies: ['preset'],
      },
      {
        // Hour field: every-hour preset=1 outputs 1 (fires at minute 0 of every hour), weekdays-9am=9, others=0
        id: 'hourField',
        expression: 'preset == 1 ? 1 : (preset == 6 ? 9 : 0)',
        dependencies: ['preset'],
      },
      {
        // Day-of-month field: monthly 1st preset=4 uses day 1, all others use * (represented as 0 = wildcard)
        id: 'dayField',
        expression: 'preset == 4 ? 1 : 0',
        dependencies: ['preset'],
      },
      {
        // Weekday field: weekly-sunday preset=3 weekday=0, weekdays preset=6 weekday=1 (representing range 1-5), others=0
        id: 'weekdayField',
        expression: 'preset == 3 ? 0 : (preset == 6 ? 1 : 0)',
        dependencies: ['preset'],
      },
      {
        // Pass-through for preset code reference
        id: 'expression',
        expression: 'preset * 1',
        dependencies: ['preset'],
      },
    ],
    outputs: [
      {
        id: 'minuteFieldOut',
        label: 'Minute Field (0 = exact minute, 5 = every 5 min interval)',
        formulaRef: 'minuteField',
        format: 'number',
        precision: 0,
        highlight: true,
      },
      {
        id: 'hourFieldOut',
        label: 'Hour Field (0 = midnight, 9 = 9am, 1 = hourly trigger)',
        formulaRef: 'hourField',
        format: 'number',
        precision: 0,
      },
      {
        id: 'dayFieldOut',
        label: 'Day-of-Month Field (0 = wildcard *, 1 = first of month)',
        formulaRef: 'dayField',
        format: 'number',
        precision: 0,
      },
      {
        id: 'weekdayFieldOut',
        label: 'Weekday Field (0 = Sun/wildcard, 1 = Mon-Fri range)',
        formulaRef: 'weekdayField',
        format: 'number',
        precision: 0,
      },
      {
        id: 'expressionOut',
        label: 'Preset Code',
        formulaRef: 'expression',
        format: 'number',
        precision: 0,
      },
    ],
    guide: {
      whatIsIt:
        'A CRON expression is a string of 5 fields (plus an optional 6th for seconds in some implementations) that defines a recurring schedule for automated tasks. It is the universal scheduler for Unix-like systems, CI/CD pipelines, cloud functions, and databases.',
      howToUse:
        'Select a common schedule preset from the dropdown. The output fields show the numeric values for the minute and hour fields of the CRON expression, along with helper context for day and weekday fields. Use the full expressions shown in the dropdown labels directly in your crontab file or scheduler config.',
      exampleScenario:
        'You want to run a database backup every day at 2:00 AM. The CRON expression is: 0 2 * * * — minute=0, hour=2, day=* (every day), month=* (every month), weekday=* (any day). To run only on weekdays: 0 2 * * 1-5.',
      proTip:
        'CRON field order: Minute (0-59) | Hour (0-23) | Day of Month (1-31) | Month (1-12) | Day of Week (0-7, where 0 and 7 are both Sunday). Special syntax: * = every value, */5 = every 5 units, 1,3,5 = specific values, 1-5 = range. Use crontab.guru to interactively preview any CRON expression. Always test new cron jobs manually before scheduling them.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 114. Base64 Encode/Decode Size & Reference Calculator
  // =========================================================================
  {
    id: 'base64-calculator',
    slug: 'base64-calculator',
    title: 'Base64 Encoder / Size Calculator',
    description:
      'Calculate the encoded output size and overhead for Base64 encoding. Understand the math behind binary-to-text encoding used in email MIME, data URLs, and JSON.',
    icon: '🔤',
    category: 'tech',
    subcategory: 'tools',
    tags: ['base64', 'encoding', 'binary', 'text', 'MIME', 'data-url', 'overhead', 'bytes', 'ascii'],
    inputs: [
      {
        id: 'inputLengthBytes',
        label: 'Input Data Size (bytes)',
        type: 'number',
        defaultValue: 100,
        min: 1,
        step: 1,
        placeholder: 'e.g. 100',
        helpText: 'Enter the byte size of your binary data. Use file size in bytes, or count characters for ASCII text.',
        required: true,
      },
      {
        id: 'encodingType',
        label: 'Padding Style',
        type: 'select',
        options: [
          { label: 'Standard Base64 with padding (RFC 4648)', value: '1' },
          { label: 'URL-safe Base64 with padding (RFC 4648 §5)', value: '1' },
          { label: 'Base64 without padding (stripped)', value: '0' },
        ],
        defaultValue: '1',
        helpText:
          'Standard Base64 always pads output to a multiple of 4 characters using = signs. URL-safe replaces + with - and / with _.',
        required: true,
      },
    ],
    formulas: [
      {
        // Standard padded: always ceil(n/3)*4 characters
        id: 'simpleEncodedLength',
        expression: 'ceil(inputLengthBytes / 3) * 4',
        dependencies: ['inputLengthBytes'],
      },
      {
        // Without padding: only actual data chars, no = padding
        id: 'unpadded',
        expression: 'floor(inputLengthBytes * 4 / 3)',
        dependencies: ['inputLengthBytes'],
      },
      {
        id: 'encodedLength',
        expression: 'encodingType == 1 ? simpleEncodedLength : unpadded',
        dependencies: ['encodingType', 'simpleEncodedLength', 'unpadded'],
      },
      {
        id: 'overheadPercent',
        expression: '(simpleEncodedLength / inputLengthBytes - 1) * 100',
        dependencies: ['simpleEncodedLength', 'inputLengthBytes'],
      },
      {
        // MIME standard wraps Base64 at 76 characters per line
        id: 'numLines',
        expression: 'ceil(simpleEncodedLength / 76)',
        dependencies: ['simpleEncodedLength'],
      },
      {
        id: 'paddingChars',
        expression: 'simpleEncodedLength - unpadded',
        dependencies: ['simpleEncodedLength', 'unpadded'],
      },
    ],
    outputs: [
      {
        id: 'encodedLengthOut',
        label: 'Encoded Output Size',
        formulaRef: 'encodedLength',
        format: 'number',
        precision: 0,
        suffix: ' chars',
        highlight: true,
      },
      {
        id: 'overheadPercentOut',
        label: 'Size Overhead vs Raw',
        formulaRef: 'overheadPercent',
        format: 'number',
        precision: 1,
        suffix: '%',
      },
      {
        id: 'numLinesOut',
        label: 'Lines (76-char MIME wrap)',
        formulaRef: 'numLines',
        format: 'number',
        precision: 0,
      },
      {
        id: 'paddingCharsOut',
        label: 'Padding Characters (= signs)',
        formulaRef: 'paddingChars',
        format: 'number',
        precision: 0,
      },
    ],
    guide: {
      whatIsIt:
        'Base64 is a binary-to-text encoding scheme that converts arbitrary binary data into a string of 64 printable ASCII characters (A-Z, a-z, 0-9, +, /). It was designed to safely transport binary data through text-only channels like email (SMTP), HTTP headers, and JSON payloads. Every 3 bytes of input become exactly 4 ASCII characters of output — always a fixed 33% size increase.',
      howToUse:
        'Enter the byte size of your input data. The calculator shows the exact encoded output length (always a multiple of 4 for padded Base64), the size overhead percentage (always approximately 33%), and the number of 76-character lines for MIME email encoding. To toggle between padded and unpadded output, select the appropriate Padding Style. Note: actual string encoding/decoding requires JavaScript btoa()/atob() or a server-side tool — this calculator shows the sizing math.',
      exampleScenario:
        'A 1 MB (1,048,576 bytes) image embedded as Base64 in a data URL or JSON: encoded size = ceil(1,048,576 / 3) x 4 = 1,398,104 characters (approximately 1.33 MB). This 33% overhead is exactly why large images should be referenced by URL rather than inlined as Base64 in HTML, CSS, or API responses — performance will suffer noticeably beyond a few KB.',
      proTip:
        'In JavaScript: btoa(binaryString) encodes to Base64; atob(base64String) decodes. For arbitrary binary (images, PDFs): const b64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer))). URL-safe Base64 replaces + with - and / with _ so the result is safe in URLs and filenames without percent-encoding. Node.js uses Buffer.from(data).toString("base64") and Buffer.from(b64, "base64"). Avoid inlining assets larger than ~10 KB as Base64; use external URLs instead for better caching and performance.',
    },
    metadata: { version: '1.0.0' },
  },
];
