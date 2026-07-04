// ---------------------------------------------------------------------------
// Quantify � Audio & Music Production Calculators
// ---------------------------------------------------------------------------
// 10 calculators covering note frequencies, room acoustics, amplifier power,
// speaker crossovers, wavelengths, tempo/pitch, loudness, subwoofer ports,
// DMX addressing, and vinyl playing time.
// ---------------------------------------------------------------------------

import type { CalculatorSchema } from '@/types/calculator';

export const audioMusicCalculators: CalculatorSchema[] = [
  // =========================================================================
  // 1. Note to Frequency Hz
  // =========================================================================
  {
    id: 'note-to-frequency',
    slug: 'note-to-frequency',
    title: 'Musical Note to Frequency Calculator',
    description:
      'Convert any musical note and octave to its frequency in Hz. Calculates wavelength, period, and supports custom A4 tuning reference for period and historical instruments.',
    icon: '🎵',
    category: 'photography',
    subcategory: 'audio',
    tags: ['note frequency', 'Hz', 'music theory', 'pitch', 'A440', 'equal temperament', 'tuning', 'wavelength'],
    inputs: [
      {
        id: 'noteName',
        label: 'Note',
        type: 'select',
        defaultValue: '0',
        options: [
          { label: 'C', value: '-9' },
          { label: 'C# / D?', value: '-8' },
          { label: 'D', value: '-7' },
          { label: 'D# / E?', value: '-6' },
          { label: 'E', value: '-5' },
          { label: 'F', value: '-4' },
          { label: 'F# / G?', value: '-3' },
          { label: 'G', value: '-2' },
          { label: 'G# / A?', value: '-1' },
          { label: 'A', value: '0' },
          { label: 'A# / B?', value: '1' },
          { label: 'B', value: '2' },
        ],
        helpText: 'Semitone offset from A (0=A, -9=C, 2=B, etc.)',
        required: true,
      },
      {
        id: 'octave',
        label: 'Octave Number',
        type: 'number',
        defaultValue: 4,
        min: 0,
        max: 9,
        step: 1,
        placeholder: 'e.g. 4',
        helpText: 'MIDI octave numbering. A4 = 440 Hz, C4 = middle C.',
        required: true,
      },
      {
        id: 'a4Tuning',
        label: 'A4 Reference Tuning (Hz)',
        type: 'number',
        defaultValue: 440,
        min: 415,
        max: 466,
        step: 0.5,
        placeholder: 'e.g. 440',
        helpText: 'Standard A4 = 440 Hz. Baroque tuning: 415 Hz. Some orchestras use 442�444 Hz.',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'semitones',
        expression: '(octave - 4) * 12 + noteName',
        dependencies: ['octave', 'noteName'],
      },
      {
        id: 'freqHz',
        expression: 'a4Tuning * pow(2, semitones / 12)',
        dependencies: ['a4Tuning', 'semitones'],
      },
      {
        id: 'wavelengthM',
        expression: '343.2 / freqHz',
        dependencies: ['freqHz'],
      },
      {
        id: 'wavelengthCm',
        expression: 'wavelengthM * 100',
        dependencies: ['wavelengthM'],
      },
      {
        id: 'periodMs',
        expression: '1000 / freqHz',
        dependencies: ['freqHz'],
      },
      {
        id: 'midiNoteNumber',
        expression: '69 + semitones',
        dependencies: ['semitones'],
      },
    ],
    outputs: [
      {
        id: 'out-freqHz',
        label: 'Frequency',
        formulaRef: 'freqHz',
        format: 'number',
        precision: 3,
        suffix: ' Hz',
        highlight: true,
      },
      {
        id: 'out-wavelengthCm',
        label: 'Wavelength (at 20�C)',
        formulaRef: 'wavelengthCm',
        format: 'number',
        precision: 2,
        suffix: ' cm',
      },
      {
        id: 'out-periodMs',
        label: 'Period',
        formulaRef: 'periodMs',
        format: 'number',
        precision: 4,
        suffix: ' ms',
      },
      {
        id: 'out-midiNoteNumber',
        label: 'MIDI Note Number',
        formulaRef: 'midiNoteNumber',
        format: 'number',
        precision: 0,
      },
    ],
    guide: {
      whatIsIt:
        'In 12-tone equal temperament, every semitone is a frequency ratio of the 12th root of 2 (�1.05946). Starting from A4=440 Hz, any note frequency is calculated as: f = 440 � 2^(n/12), where n is the number of semitones from A4. This universal formula is the foundation of all modern Western music tuning.',
      howToUse:
        'Select a note, enter the octave (A4 = octave 4), and set the A4 reference frequency. Standard is 440 Hz; orchestras in Germany and Austria often use 442 Hz; Baroque ensembles use 415 Hz (exactly one semitone below A440). The calculator returns the precise frequency, its wavelength in air at 20�C (343.2 m/s), period, and MIDI note number.',
      exampleScenario:
        'Middle C (C4) is 9 semitones below A4. Frequency = 440 � 2^(-9/12) = 261.626 Hz. Its wavelength at 20�C = 343.2/261.626 = 131.2 cm (just over 4 feet). This matters for room mode calculations � a 4-foot room dimension resonates strongly at middle C.',
      proTip:
        'The A4 = 432 Hz "432 Hz tuning" popular in some music communities has no scientific basis for healing properties but does slightly lower all frequencies. At 432 Hz, A4\'s wavelength = 343.2/432 = 79.4 cm. Use standard 440 Hz for recording with other musicians unless specifically working in an alternative tuning system.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 2. Acoustic Room Modes
  // =========================================================================
  {
    id: 'acoustic-room-modes',
    slug: 'acoustic-room-modes',
    title: 'Acoustic Room Mode Calculator',
    description:
      'Calculate the first three axial room mode resonance frequencies for length, width, and height dimensions. Essential for home studio design and bass trap placement.',
    icon: '🎤',
    category: 'photography',
    subcategory: 'audio',
    tags: ['room modes', 'acoustics', 'standing waves', 'bass', 'resonance', 'studio design', 'Schroeder frequency'],
    inputs: [
      {
        id: 'roomLengthM',
        label: 'Room Length (m)',
        type: 'number',
        defaultValue: 5.0,
        min: 0.5,
        max: 50,
        step: 0.1,
        placeholder: 'e.g. 5.0',
        helpText: 'Longest room dimension in meters.',
        required: true,
      },
      {
        id: 'roomWidthM',
        label: 'Room Width (m)',
        type: 'number',
        defaultValue: 3.5,
        min: 0.5,
        max: 50,
        step: 0.1,
        placeholder: 'e.g. 3.5',
        helpText: 'Room width in meters.',
        required: true,
      },
      {
        id: 'roomHeightM',
        label: 'Room Height (m)',
        type: 'number',
        defaultValue: 2.7,
        min: 1.5,
        max: 20,
        step: 0.05,
        placeholder: 'e.g. 2.7',
        helpText: 'Floor-to-ceiling height in meters.',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'axialL1',
        expression: '343 / (2 * roomLengthM)',
        dependencies: ['roomLengthM'],
      },
      {
        id: 'axialL2',
        expression: '343 / roomLengthM',
        dependencies: ['roomLengthM'],
      },
      {
        id: 'axialL3',
        expression: '343 * 3 / (2 * roomLengthM)',
        dependencies: ['roomLengthM'],
      },
      {
        id: 'axialW1',
        expression: '343 / (2 * roomWidthM)',
        dependencies: ['roomWidthM'],
      },
      {
        id: 'axialW2',
        expression: '343 / roomWidthM',
        dependencies: ['roomWidthM'],
      },
      {
        id: 'axialW3',
        expression: '343 * 3 / (2 * roomWidthM)',
        dependencies: ['roomWidthM'],
      },
      {
        id: 'axialH1',
        expression: '343 / (2 * roomHeightM)',
        dependencies: ['roomHeightM'],
      },
      {
        id: 'axialH2',
        expression: '343 / roomHeightM',
        dependencies: ['roomHeightM'],
      },
      {
        id: 'axialH3',
        expression: '343 * 3 / (2 * roomHeightM)',
        dependencies: ['roomHeightM'],
      },
    ],
    outputs: [
      {
        id: 'out-axialL1',
        label: 'Length Mode 1 (1st axial)',
        formulaRef: 'axialL1',
        format: 'number',
        precision: 1,
        suffix: ' Hz',
        highlight: true,
      },
      {
        id: 'out-axialL2',
        label: 'Length Mode 2',
        formulaRef: 'axialL2',
        format: 'number',
        precision: 1,
        suffix: ' Hz',
      },
      {
        id: 'out-axialL3',
        label: 'Length Mode 3',
        formulaRef: 'axialL3',
        format: 'number',
        precision: 1,
        suffix: ' Hz',
      },
      {
        id: 'out-axialW1',
        label: 'Width Mode 1 (1st axial)',
        formulaRef: 'axialW1',
        format: 'number',
        precision: 1,
        suffix: ' Hz',
        highlight: true,
      },
      {
        id: 'out-axialW2',
        label: 'Width Mode 2',
        formulaRef: 'axialW2',
        format: 'number',
        precision: 1,
        suffix: ' Hz',
      },
      {
        id: 'out-axialH1',
        label: 'Height Mode 1 (1st axial)',
        formulaRef: 'axialH1',
        format: 'number',
        precision: 1,
        suffix: ' Hz',
        highlight: true,
      },
      {
        id: 'out-axialH2',
        label: 'Height Mode 2',
        formulaRef: 'axialH2',
        format: 'number',
        precision: 1,
        suffix: ' Hz',
      },
    ],
    guide: {
      whatIsIt:
        'Axial room modes are standing waves that form between pairs of parallel walls when the room length (or width or height) equals a whole number multiple of half wavelengths. These modes cause dramatic frequency response peaks and nulls � you might hear too much or too little bass depending on where you stand. They are the primary acoustic problem in small studios and home theaters.',
      howToUse:
        'Enter your room\'s three dimensions in meters. The calculator shows the first three axial mode frequencies for each dimension. Look for modes that cluster closely together (within 5 Hz) � these "modal pile-ups" create severe problems. Ideal ratios avoid coincident modes (e.g., Sepmeyer ratios: 1:1.14:1.39 or 1:1.28:1.54).',
      exampleScenario:
        'A 5m � 3.5m � 2.7m room has: Length modes at 34.3, 68.6, 102.9 Hz; Width modes at 49.0, 98.0, 147.0 Hz; Height modes at 63.5, 127.0, 190.5 Hz. The 98�102 Hz range has two modes within 5 Hz � a modal pile-up. Place broadband bass traps (4-inch rockwool) in all four vertical corners and both floor-ceiling corners.',
      proTip:
        'The Schroeder frequency marks where individual modes become too dense to distinguish and room behaviour transitions to diffuse. Below Schroeder frequency, modes dominate. A rough estimate: Schroeder � 2000 � sqrt(RT60/V) where V is room volume and RT60 is reverberation time. For a 47 m� room with RT60=0.4s, Schroeder � 179 Hz � treat everything below this with absorption.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 3. Amp Power to SPL
  // =========================================================================
  {
    id: 'amp-power-to-spl',
    slug: 'amp-power-to-spl',
    title: 'Amplifier Power to SPL Calculator',
    description:
      'Calculate the sound pressure level (dB SPL) at any distance from an amplifier and speaker given the speaker sensitivity rating and amplifier power output.',
    icon: '🔈',
    category: 'photography',
    subcategory: 'audio',
    tags: ['SPL', 'dB', 'amplifier', 'speaker', 'sensitivity', 'loudness', 'sound pressure', 'live sound', 'PA'],
    inputs: [
      {
        id: 'sensitivity',
        label: 'Speaker Sensitivity (dB/W/m)',
        type: 'number',
        defaultValue: 98,
        min: 70,
        max: 120,
        step: 0.5,
        placeholder: 'e.g. 98',
        helpText: 'SPL at 1 meter with 1 watt input, from the speaker spec sheet.',
        required: true,
      },
      {
        id: 'ampWatts',
        label: 'Amplifier Power (Watts)',
        type: 'number',
        defaultValue: 500,
        min: 0.001,
        max: 100000,
        step: 10,
        placeholder: 'e.g. 500',
        helpText: 'RMS amplifier output power in watts.',
        required: true,
      },
      {
        id: 'distanceM',
        label: 'Listening Distance (m)',
        type: 'number',
        defaultValue: 10,
        min: 0.1,
        max: 1000,
        step: 0.5,
        placeholder: 'e.g. 10',
        helpText: 'Distance from the speaker to the measurement/listening point.',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'splAt1m',
        expression: 'sensitivity + 10 * log10(ampWatts)',
        dependencies: ['sensitivity', 'ampWatts'],
      },
      {
        id: 'distanceLoss',
        expression: '20 * log10(distanceM)',
        dependencies: ['distanceM'],
      },
      {
        id: 'splAtDistance',
        expression: 'splAt1m - distanceLoss',
        dependencies: ['splAt1m', 'distanceLoss'],
      },
      {
        id: 'peakSpl',
        expression: 'splAtDistance + 3',
        dependencies: ['splAtDistance'],
      },
      {
        id: 'doublingDistance',
        expression: 'distanceM * 2',
        dependencies: ['distanceM'],
      },
      {
        id: 'splAtDoubling',
        expression: 'splAtDistance - 6',
        dependencies: ['splAtDistance'],
      },
    ],
    outputs: [
      {
        id: 'out-splAtDistance',
        label: 'SPL at Listening Distance',
        formulaRef: 'splAtDistance',
        format: 'number',
        precision: 1,
        suffix: ' dB SPL',
        highlight: true,
      },
      {
        id: 'out-splAt1m',
        label: 'SPL at 1 Meter',
        formulaRef: 'splAt1m',
        format: 'number',
        precision: 1,
        suffix: ' dB SPL',
      },
      {
        id: 'out-peakSpl',
        label: 'Peak SPL (program material)',
        formulaRef: 'peakSpl',
        format: 'number',
        precision: 1,
        suffix: ' dB peak',
      },
      {
        id: 'out-splAtDoubling',
        label: `SPL at Double Distance (${`2x`})`,
        formulaRef: 'splAtDoubling',
        format: 'number',
        precision: 1,
        suffix: ' dB SPL',
      },
    ],
    guide: {
      whatIsIt:
        'Speaker sensitivity (dB/W/m) tells you how loud a speaker is at 1 meter with 1 watt. Each doubling of power adds 3 dB. Each doubling of distance subtracts 6 dB (inverse square law in a free field). This calculator chains these relationships to predict SPL at any distance, essential for live sound system design, DJ rigs, and PA coverage planning.',
      howToUse:
        'Enter the speaker\'s sensitivity from its data sheet, the amplifier RMS power, and your target listening distance. Results show RMS SPL at that distance, SPL at 1m for reference, and what you can expect at double the distance (useful for throw calculations in venues).',
      exampleScenario:
        'A line array element has 98 dB sensitivity. Powered by 500W: SPL at 1m = 98 + 27 = 125 dB. At 10m: 125 - 20 = 105 dB SPL � meeting the 100 dB recommendation for a concert venue audience area. At 20m it drops to 99 dB � still acceptable for the back row.',
      proTip:
        'OSHA limits continuous exposure to 90 dB for 8 hours, halving for each 5 dB increase. At 100 dB, the limit is 2 hours; at 105 dB, 1 hour. Concerts at 110 dB front-of-house should limit set lengths accordingly. In permanent installations, target 85�95 dB for speech reinforcement and 95�103 dB for music venues to avoid hearing damage and comply with local noise ordinances.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 4. Speaker Crossover Frequency
  // =========================================================================
  {
    id: 'speaker-crossover-frequency',
    slug: 'speaker-crossover-frequency',
    title: 'Speaker Crossover Frequency Calculator',
    description:
      'Calculate first-order crossover frequencies for high-pass (RC), low-pass (RL), and band-pass (LC) filter networks given speaker impedance and component values.',
    icon: '🔉',
    category: 'photography',
    subcategory: 'audio',
    tags: ['crossover', 'speaker', 'woofer', 'tweeter', 'frequency', 'capacitor', 'inductor', 'filter', 'DIY audio'],
    inputs: [
      {
        id: 'impedanceOhm',
        label: 'Speaker Impedance (O)',
        type: 'select',
        defaultValue: '8',
        options: [
          { label: '4 O', value: '4' },
          { label: '6 O', value: '6' },
          { label: '8 O (standard)', value: '8' },
          { label: '16 O', value: '16' },
        ],
        helpText: 'Nominal impedance of the driver. Use 8O for most consumer speakers.',
        required: true,
      },
      {
        id: 'capUF',
        label: 'Capacitor Value (�F)',
        type: 'number',
        defaultValue: 6.8,
        min: 0.01,
        max: 10000,
        step: 0.1,
        placeholder: 'e.g. 6.8',
        helpText: 'Capacitor in �F for the high-pass filter (tweeter).',
        required: true,
      },
      {
        id: 'inductMH',
        label: 'Inductor Value (mH)',
        type: 'number',
        defaultValue: 1.0,
        min: 0.01,
        max: 1000,
        step: 0.01,
        placeholder: 'e.g. 1.0',
        helpText: 'Inductor in mH for the low-pass filter (woofer).',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'capF',
        expression: 'capUF / 1000000',
        dependencies: ['capUF'],
      },
      {
        id: 'inductH',
        expression: 'inductMH / 1000',
        dependencies: ['inductMH'],
      },
      {
        id: 'fcHiPass',
        expression: '1000000 / (2 * 3.14159265 * impedanceOhm * capUF)',
        dependencies: ['impedanceOhm', 'capUF'],
      },
      {
        id: 'fcLoPass',
        expression: '1000 * impedanceOhm / (2 * 3.14159265 * inductMH)',
        dependencies: ['impedanceOhm', 'inductMH'],
      },
      {
        id: 'fcLC',
        expression: '1000 / (2 * 3.14159265 * sqrt(inductMH * capUF / 1000))',
        dependencies: ['inductMH', 'capUF'],
      },
    ],
    outputs: [
      {
        id: 'out-fcHiPass',
        label: 'High-Pass Crossover Freq (RC)',
        formulaRef: 'fcHiPass',
        format: 'number',
        precision: 0,
        suffix: ' Hz',
        highlight: true,
      },
      {
        id: 'out-fcLoPass',
        label: 'Low-Pass Crossover Freq (RL)',
        formulaRef: 'fcLoPass',
        format: 'number',
        precision: 0,
        suffix: ' Hz',
        highlight: true,
      },
      {
        id: 'out-fcLC',
        label: 'LC Resonance Frequency',
        formulaRef: 'fcLC',
        format: 'number',
        precision: 0,
        suffix: ' Hz',
      },
    ],
    guide: {
      whatIsIt:
        'A crossover network splits an audio signal into frequency bands and directs each to the appropriate driver (woofer, tweeter, midrange). First-order crossovers use a single capacitor (for tweeter high-pass) or single inductor (for woofer low-pass). The cutoff frequency (-3dB point) is where the RC or RL time constant equals 1/2p.',
      howToUse:
        'Enter the speaker\'s nominal impedance and your chosen component values. The calculator gives the -3dB crossover frequency for both the high-pass and low-pass sections. To design for a specific frequency, rearrange: C = 1/(2p � f � R) and L = R/(2p � f). The LC resonance frequency indicates where an LC band-pass filter would peak.',
      exampleScenario:
        'Designing a 2-way with 8O woofer and tweeter, targeting 2,500 Hz crossover. For the tweeter high-pass: C = 1/(2p � 2500 � 8) = 7.96�F ? use 8.2�F standard value ? fc = 2,440 Hz. For the woofer low-pass: L = 8/(2p � 2500) = 0.509 mH ? use 0.5mH ? fc = 2,546 Hz.',
      proTip:
        'First-order crossovers (-6dB/octave) have good phase characteristics but poor driver protection. Tweeters can be damaged by bass frequencies. For better driver protection and steeper rolloff, use second-order (L-C, -12dB/octave) or third-order (-18dB/octave) designs. High-order crossovers also allow acoustic summation adjustments to correct driver time alignment.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 5. Audio Wavelength Calculator
  // =========================================================================
  {
    id: 'audio-wavelength',
    slug: 'audio-wavelength',
    title: 'Audio Wavelength & Period Calculator',
    description:
      'Calculate the wavelength, half-wave, quarter-wave dimensions, and period for any audio frequency at a given air temperature. Critical for speaker placement and room acoustics.',
    icon: '📻',
    category: 'photography',
    subcategory: 'audio',
    tags: ['wavelength', 'frequency', 'acoustics', 'speed of sound', 'quarter wave', 'port tuning', 'room treatment'],
    inputs: [
      {
        id: 'freqHz',
        label: 'Frequency (Hz)',
        type: 'number',
        defaultValue: 1000,
        min: 1,
        max: 100000,
        step: 1,
        placeholder: 'e.g. 1000',
        helpText: 'Audio frequency to analyze in Hz.',
        required: true,
      },
      {
        id: 'airTempC',
        label: 'Air Temperature (�C)',
        type: 'number',
        defaultValue: 20,
        min: -20,
        max: 60,
        step: 0.5,
        placeholder: 'e.g. 20',
        helpText: 'Ambient air temperature affects speed of sound (�343 m/s at 20�C).',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'speedOfSound',
        expression: '331.3 + 0.606 * airTempC',
        dependencies: ['airTempC'],
      },
      {
        id: 'wavelengthM',
        expression: 'speedOfSound / freqHz',
        dependencies: ['speedOfSound', 'freqHz'],
      },
      {
        id: 'wavelengthCm',
        expression: 'wavelengthM * 100',
        dependencies: ['wavelengthM'],
      },
      {
        id: 'wavelengthFt',
        expression: 'wavelengthM * 3.28084',
        dependencies: ['wavelengthM'],
      },
      {
        id: 'halfWaveCm',
        expression: 'wavelengthCm / 2',
        dependencies: ['wavelengthCm'],
      },
      {
        id: 'quarterWaveCm',
        expression: 'wavelengthCm / 4',
        dependencies: ['wavelengthCm'],
      },
      {
        id: 'periodMs',
        expression: '1000 / freqHz',
        dependencies: ['freqHz'],
      },
    ],
    outputs: [
      {
        id: 'out-wavelengthCm',
        label: 'Wavelength',
        formulaRef: 'wavelengthCm',
        format: 'number',
        precision: 2,
        suffix: ' cm',
        highlight: true,
      },
      {
        id: 'out-wavelengthFt',
        label: 'Wavelength (ft)',
        formulaRef: 'wavelengthFt',
        format: 'number',
        precision: 3,
        suffix: ' ft',
      },
      {
        id: 'out-halfWaveCm',
        label: 'Half Wavelength',
        formulaRef: 'halfWaveCm',
        format: 'number',
        precision: 2,
        suffix: ' cm',
      },
      {
        id: 'out-quarterWaveCm',
        label: 'Quarter Wavelength',
        formulaRef: 'quarterWaveCm',
        format: 'number',
        precision: 2,
        suffix: ' cm',
      },
      {
        id: 'out-speedOfSound',
        label: 'Speed of Sound',
        formulaRef: 'speedOfSound',
        format: 'number',
        precision: 1,
        suffix: ' m/s',
      },
      {
        id: 'out-periodMs',
        label: 'Period',
        formulaRef: 'periodMs',
        format: 'number',
        precision: 4,
        suffix: ' ms',
      },
    ],
    guide: {
      whatIsIt:
        'Every sound frequency has a corresponding physical wavelength determined by the speed of sound divided by frequency (? = c/f). Speed of sound in air increases with temperature: approximately 343 m/s at 20�C. Understanding wavelengths is essential for loudspeaker directivity, room mode prediction, absorption panel thickness, and port tube design.',
      howToUse:
        'Enter the frequency you want to analyze and the ambient temperature. Results include the full wavelength, half wavelength, quarter wavelength (useful for pipe/port resonator design), and the signal period. The quarter wavelength is the minimum depth needed for an effective absorption panel at that frequency.',
      exampleScenario:
        'A home studio designer wants to treat a 125 Hz room mode. Quarter wavelength at 125 Hz = 343.2/(4 � 125) = 68.6 cm (27"). This means acoustic panels need to be at least 27cm (roughly 10.5") thick to provide meaningful absorption at 125 Hz � why most broadband bass traps are 4�12" thick rockwool with an air gap.',
      proTip:
        'Above 1 kHz, wavelengths become shorter than typical speaker driver dimensions, causing beaming (narrow directivity). A 1 kHz signal has a 34.3 cm wavelength � speakers with cones wider than ~11 cm (half wavelength) start to beam above 1 kHz. This is why tweeter/midrange crossovers are typically set in the 1.5�5 kHz range and why line arrays are used for long-throw applications.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 6. Tempo Pitch Transposition
  // =========================================================================
  {
    id: 'tempo-pitch-transposition',
    slug: 'tempo-pitch-transposition',
    title: 'Tempo-Pitch Transposition Calculator',
    description:
      'Calculate the pitch change in cents and semitones when audio is played back at a different speed or tempo (BPM). Used in DJ mixing, time-stretch analysis, and tape speed calculations.',
    icon: '🎹',
    category: 'photography',
    subcategory: 'audio',
    tags: ['tempo', 'pitch', 'BPM', 'cents', 'semitones', 'DJ', 'time stretch', 'varispeed', 'tape speed'],
    inputs: [
      {
        id: 'originalBPM',
        label: 'Original Tempo (BPM)',
        type: 'number',
        defaultValue: 120,
        min: 20,
        max: 400,
        step: 0.1,
        placeholder: 'e.g. 120',
        helpText: 'The original track tempo in beats per minute.',
        required: true,
      },
      {
        id: 'newBPM',
        label: 'New Tempo (BPM)',
        type: 'number',
        defaultValue: 128,
        min: 20,
        max: 400,
        step: 0.1,
        placeholder: 'e.g. 128',
        helpText: 'Target playback tempo. If using varispeed (no time stretch), pitch shifts proportionally.',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'speedRatio',
        expression: 'newBPM / originalBPM',
        dependencies: ['newBPM', 'originalBPM'],
      },
      {
        id: 'centsChange',
        expression: '1200 * ln(speedRatio) / ln(2)',
        dependencies: ['speedRatio'],
      },
      {
        id: 'semitonesChange',
        expression: 'centsChange / 100',
        dependencies: ['centsChange'],
      },
      {
        id: 'percentChange',
        expression: '(speedRatio - 1) * 100',
        dependencies: ['speedRatio'],
      },
      {
        id: 'bpmDiff',
        expression: 'newBPM - originalBPM',
        dependencies: ['newBPM', 'originalBPM'],
      },
    ],
    outputs: [
      {
        id: 'out-centsChange',
        label: 'Pitch Change (Cents)',
        formulaRef: 'centsChange',
        format: 'number',
        precision: 1,
        suffix: ' cents',
        highlight: true,
      },
      {
        id: 'out-semitonesChange',
        label: 'Pitch Change (Semitones)',
        formulaRef: 'semitonesChange',
        format: 'number',
        precision: 2,
        suffix: ' semitones',
        highlight: true,
      },
      {
        id: 'out-speedRatio',
        label: 'Speed Ratio',
        formulaRef: 'speedRatio',
        format: 'number',
        precision: 4,
      },
      {
        id: 'out-percentChange',
        label: 'Tempo Change (%)',
        formulaRef: 'percentChange',
        format: 'number',
        precision: 2,
        suffix: ' %',
      },
    ],
    guide: {
      whatIsIt:
        'When audio is played back at a different speed (without time-stretching), pitch changes proportionally. The relationship is logarithmic because pitch perception is logarithmic: a doubling of frequency is one octave (1200 cents). The formula cents = 1200 � log2(newBPM/oldBPM) converts speed ratios to musical pitch units, as log2(x) = ln(x)/ln(2).',
      howToUse:
        'Enter the original tempo and the new playback tempo. If using varispeed (analog tape, vinyl turntable pitch control), the pitch shifts by the amount shown. If using a DJ controller\'s key lock/master tempo feature, the tempo changes while pitch stays fixed. Use this calculator to predict pitch shift without key lock or to find the pitch correction needed.',
      exampleScenario:
        'A DJ beatmatches a 120 BPM track to a 128 BPM mix (6.67% speed increase). Without key lock, the pitch rises by 110.7 cents � just over 1 semitone. Listeners with trained ears will notice this as a key change. The DJ can use pitch correction to shift the 128 BPM version down 110.7 cents to restore the original key.',
      proTip:
        'The human pitch detection threshold is approximately 5�10 cents � below this, pitch shifts are imperceptible. Most CDJ/DJ controllers with key lock introduce artifacts above �5�8 semitones due to the limits of phase vocoder time-stretch algorithms. For cleaner pitch shifting, use the Elastique algorithm (found in Rekordbox, Serato, and Ableton Live).',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 7. LUFS Loudness Penalty Calculator
  // =========================================================================
  {
    id: 'lufs-loudness-penalty',
    slug: 'lufs-loudness-penalty',
    title: 'LUFS Streaming Loudness Penalty Calculator',
    description:
      'Calculate how much gain reduction (loudness penalty) a streaming platform will apply to your master based on its measured integrated loudness and the platform target level.',
    icon: '🎚',
    category: 'photography',
    subcategory: 'audio',
    tags: ['LUFS', 'loudness', 'streaming', 'mastering', 'Spotify', 'Apple Music', 'YouTube', 'normalization', 'gain'],
    inputs: [
      {
        id: 'measuredLUFS',
        label: 'Measured Integrated Loudness (LUFS)',
        type: 'number',
        defaultValue: -9,
        min: -40,
        max: 0,
        step: 0.1,
        placeholder: 'e.g. -9',
        helpText: 'Integrated LUFS reading from your DAW or loudness meter (e.g., Youlean, iZotope).',
        required: true,
      },
      {
        id: 'platform',
        label: 'Streaming Platform Target',
        type: 'select',
        defaultValue: '-14',
        options: [
          { label: 'Spotify � -14 LUFS', value: '-14' },
          { label: 'Apple Music � -16 LUFS', value: '-16' },
          { label: 'YouTube Music � -14 LUFS', value: '-14' },
          { label: 'Amazon Music � -14 LUFS', value: '-14' },
          { label: 'Tidal � -14 LUFS', value: '-14' },
          { label: 'SoundCloud � -8 LUFS (podcast/DJ)', value: '-8' },
          { label: 'Deezer � -15 LUFS', value: '-15' },
          { label: 'Podcast (AES/EBU R128) � -16 LUFS', value: '-16' },
          { label: 'Broadcast TV (ITU-R BS.1770) � -23 LUFS', value: '-23' },
        ],
        helpText: 'Target integrated loudness for the selected platform.',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'targetLUFS',
        expression: 'platform',
        dependencies: ['platform'],
      },
      {
        id: 'penaltyDB',
        expression: 'measuredLUFS > targetLUFS ? targetLUFS - measuredLUFS : 0',
        dependencies: ['measuredLUFS', 'targetLUFS'],
      },
      {
        id: 'headroomDB',
        expression: 'measuredLUFS < targetLUFS ? targetLUFS - measuredLUFS : 0',
        dependencies: ['measuredLUFS', 'targetLUFS'],
      },
      {
        id: 'adjustedLUFS',
        expression: 'measuredLUFS + penaltyDB',
        dependencies: ['measuredLUFS', 'penaltyDB'],
      },
      {
        id: 'diffFromTarget',
        expression: 'measuredLUFS - targetLUFS',
        dependencies: ['measuredLUFS', 'targetLUFS'],
      },
    ],
    outputs: [
      {
        id: 'out-penaltyDB',
        label: 'Loudness Penalty (gain reduction)',
        formulaRef: 'penaltyDB',
        format: 'number',
        precision: 1,
        suffix: ' dB',
        highlight: true,
      },
      {
        id: 'out-headroomDB',
        label: 'Headroom Below Target (quieter)',
        formulaRef: 'headroomDB',
        format: 'number',
        precision: 1,
        suffix: ' dB',
      },
      {
        id: 'out-adjustedLUFS',
        label: 'Playback Loudness After Normalization',
        formulaRef: 'adjustedLUFS',
        format: 'number',
        precision: 1,
        suffix: ' LUFS',
        highlight: true,
      },
      {
        id: 'out-diffFromTarget',
        label: 'Difference from Platform Target',
        formulaRef: 'diffFromTarget',
        format: 'number',
        precision: 1,
        suffix: ' LU',
      },
    ],
    guide: {
      whatIsIt:
        'Streaming platforms apply loudness normalization to level-match all tracks for consistent listening experience. LUFS (Loudness Units relative to Full Scale) is the measurement standard (ITU-R BS.1770). If your track is louder than the platform target, it gets turned down (penalized). If quieter, it plays at a lower level than competitors � no gain is added on most platforms.',
      howToUse:
        'Measure your master\'s integrated loudness using a LUFS meter in your DAW. Enter the reading and select the target platform. If a penalty is shown, your track will be turned down by that amount � all that extra loudness squashing in mastering was wasted. If headroom is shown, your track may sound quieter than other tracks on that platform.',
      exampleScenario:
        'An EDM producer masters to -9 LUFS, targeting Spotify (-14 LUFS target). Penalty = -5 dB. All the dynamic range sacrificed during mastering is wasted � the track plays back at -14 LUFS just like a master at -14 LUFS. Moral: target platform LUFS during mastering for best dynamic range and true peak headroom.',
      proTip:
        'Master to -14 LUFS integrated (-1 dBTP true peak) for Spotify/YouTube/Amazon. For Apple Music (-16 LUFS), you can afford slightly more dynamics. Monitor with Youlean Loudness Meter 2 (free) or iZotope Insight. The "loudness war" is over on streaming � louder masters sound worse, not better, because of normalization.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 8. Subwoofer Port Length
  // =========================================================================
  {
    id: 'subwoofer-port-length',
    slug: 'subwoofer-port-length',
    title: 'Subwoofer Port Length (Bass Reflex Tuning)',
    description:
      'Calculate the vent/port tube length for a bass reflex subwoofer enclosure to achieve a target tuning frequency using Helmholtz resonator principles.',
    icon: '🔊',
    category: 'photography',
    subcategory: 'audio',
    tags: ['subwoofer', 'port', 'bass reflex', 'tuning frequency', 'Helmholtz', 'ported box', 'enclosure', 'DIY speaker'],
    inputs: [
      {
        id: 'tuningFreqHz',
        label: 'Target Tuning Frequency (Hz)',
        type: 'number',
        defaultValue: 35,
        min: 15,
        max: 200,
        step: 0.5,
        placeholder: 'e.g. 35',
        helpText: 'Target box resonance frequency (Fb). Typically 80�110% of driver Fs.',
        required: true,
      },
      {
        id: 'boxVolumeLiters',
        label: 'Net Internal Box Volume (liters)',
        type: 'number',
        defaultValue: 50,
        min: 1,
        max: 5000,
        step: 0.5,
        placeholder: 'e.g. 50',
        helpText: 'Internal volume of the enclosure in liters, minus driver displacement.',
        required: true,
      },
      {
        id: 'portDiamCm',
        label: 'Port Tube Diameter (cm)',
        type: 'number',
        defaultValue: 7,
        min: 1,
        max: 50,
        step: 0.5,
        placeholder: 'e.g. 7',
        helpText: 'Internal diameter of the port tube. Larger ports reduce port noise (chuffing).',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'boxVolumeCm3',
        expression: 'boxVolumeLiters * 1000',
        dependencies: ['boxVolumeLiters'],
      },
      {
        id: 'portAreaCm2',
        expression: '3.14159265 * pow(portDiamCm / 2, 2)',
        dependencies: ['portDiamCm'],
      },
      {
        id: 'portLengthCm',
        expression: '(14800000 * portAreaCm2) / (boxVolumeCm3 * pow(tuningFreqHz, 2)) - portDiamCm * 0.732',
        dependencies: ['portAreaCm2', 'boxVolumeCm3', 'tuningFreqHz', 'portDiamCm'],
      },
      {
        id: 'portLengthIn',
        expression: 'portLengthCm / 2.54',
        dependencies: ['portLengthCm'],
      },
      {
        id: 'portVelocityApprox',
        expression: 'tuningFreqHz * portLengthCm / 100',
        dependencies: ['tuningFreqHz', 'portLengthCm'],
      },
    ],
    outputs: [
      {
        id: 'out-portLengthCm',
        label: 'Port Tube Length',
        formulaRef: 'portLengthCm',
        format: 'number',
        precision: 1,
        suffix: ' cm',
        highlight: true,
      },
      {
        id: 'out-portLengthIn',
        label: 'Port Tube Length (inches)',
        formulaRef: 'portLengthIn',
        format: 'number',
        precision: 2,
        suffix: ' in',
        highlight: true,
      },
      {
        id: 'out-portAreaCm2',
        label: 'Port Cross-Section Area',
        formulaRef: 'portAreaCm2',
        format: 'number',
        precision: 2,
        suffix: ' cm�',
      },
      {
        id: 'out-boxVolumeCm3',
        label: 'Box Volume',
        formulaRef: 'boxVolumeCm3',
        format: 'number',
        precision: 0,
        suffix: ' cm�',
      },
    ],
    guide: {
      whatIsIt:
        'A bass reflex (ported) enclosure uses a Helmholtz resonator � a cavity connected to air through a port tube � to reinforce bass output at the tuning frequency. Below the tuning frequency, the port unloads and driver excursion increases rapidly. The port length formula is derived from the Helmholtz resonator equation: Fb = (c/2p) � sqrt(A/(V � Leff)) where Leff accounts for end corrections.',
      howToUse:
        'Enter the target tuning frequency (usually set near the driver\'s Fs, from 0.8� to 1.1� Fs), the net internal volume of your enclosure, and your chosen port diameter. Results give the port tube length to cut. If the length is negative, the box is too large or tuning too high � reduce box volume or target frequency.',
      exampleScenario:
        'A 12" subwoofer (Fs=28 Hz) in a 50L box tuned to 35 Hz with a 7cm diameter port: Port length � 20.4 cm (8.0 in). This is a practical length � most ports under 10 cm are prone to chuffing noise at high power. At very high SPL, check that port air velocity stays below 15�20 m/s to avoid turbulence noise.',
      proTip:
        'Port noise (chuffing) occurs when air velocity in the port exceeds ~15 m/s at high power. To reduce this, increase the port diameter (which shortens the tube for the same tuning) or use a slot port (more area for the same box width). Always flare port ends � a 45� chamfer adds effective length and reduces turbulence. Many manufacturers use 0.732� diameter as the end correction per open end.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 9. DMX Address Calculator
  // =========================================================================
  {
    id: 'dmx-address-calculator',
    slug: 'dmx-address-calculator',
    title: 'DMX Address & Universe Calculator',
    description:
      'Calculate the first and last DMX addresses for a fixture and determine which DMX universe it falls in, given fixture number and channels per fixture.',
    icon: '💡',
    category: 'photography',
    subcategory: 'audio',
    tags: ['DMX', 'lighting', 'fixture', 'universe', 'stage lighting', 'ArtNet', 'sACN', 'show control', 'address'],
    inputs: [
      {
        id: 'fixtureNumber',
        label: 'Fixture Number',
        type: 'number',
        defaultValue: 1,
        min: 1,
        max: 10000,
        step: 1,
        placeholder: 'e.g. 1',
        helpText: 'Sequential fixture number in your rig (starting from 1).',
        required: true,
      },
      {
        id: 'channelsPerFixture',
        label: 'Channels per Fixture',
        type: 'number',
        defaultValue: 16,
        min: 1,
        max: 512,
        step: 1,
        placeholder: 'e.g. 16',
        helpText: 'Number of DMX channels this fixture uses (from the fixture spec or mode selection).',
        required: true,
      },
      {
        id: 'startAddress',
        label: 'Rig Start Address',
        type: 'number',
        defaultValue: 1,
        min: 1,
        max: 512,
        step: 1,
        placeholder: 'e.g. 1',
        helpText: 'DMX start address for fixture #1. Usually 1.',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'firstAddress',
        expression: 'startAddress + (fixtureNumber - 1) * channelsPerFixture',
        dependencies: ['startAddress', 'fixtureNumber', 'channelsPerFixture'],
      },
      {
        id: 'lastAddress',
        expression: 'firstAddress + channelsPerFixture - 1',
        dependencies: ['firstAddress', 'channelsPerFixture'],
      },
      {
        id: 'universeNumber',
        expression: 'ceil(firstAddress / 512)',
        dependencies: ['firstAddress'],
      },
      {
        id: 'addressInUniverse',
        expression: 'firstAddress - (universeNumber - 1) * 512',
        dependencies: ['firstAddress', 'universeNumber'],
      },
      {
        id: 'fixturesPerUniverse',
        expression: 'floor(512 / channelsPerFixture)',
        dependencies: ['channelsPerFixture'],
      },
    ],
    outputs: [
      {
        id: 'out-firstAddress',
        label: 'First DMX Address',
        formulaRef: 'firstAddress',
        format: 'number',
        precision: 0,
        highlight: true,
      },
      {
        id: 'out-lastAddress',
        label: 'Last DMX Address',
        formulaRef: 'lastAddress',
        format: 'number',
        precision: 0,
        highlight: true,
      },
      {
        id: 'out-universeNumber',
        label: 'DMX Universe',
        formulaRef: 'universeNumber',
        format: 'number',
        precision: 0,
        prefix: 'Universe ',
      },
      {
        id: 'out-addressInUniverse',
        label: 'Address within Universe',
        formulaRef: 'addressInUniverse',
        format: 'number',
        precision: 0,
      },
      {
        id: 'out-fixturesPerUniverse',
        label: 'Max Fixtures per Universe',
        formulaRef: 'fixturesPerUniverse',
        format: 'number',
        precision: 0,
        suffix: ' fixtures',
      },
    ],
    guide: {
      whatIsIt:
        'DMX512 is the standard protocol for controlling stage lighting and effects. Each DMX universe contains exactly 512 channels. Fixtures are addressed sequentially � each fixture occupies a block of channels equal to its channel count. When a rig grows beyond 512 channels, a second DMX universe (and a second data line or ArtNet/sACN network) is needed.',
      howToUse:
        'Enter the fixture number you want to address (starting from 1 for the first fixture), the number of DMX channels the fixture uses (check its spec sheet or mode setting), and the starting address for fixture #1. The calculator tells you the exact DMX address to set on the fixture\'s DIP switches or display.',
      exampleScenario:
        'A lighting rig has 20 moving heads each using 16 channels. Fixture 1 starts at address 1, so its addresses are 1�16. Fixture 12: first address = 1 + (12-1) � 16 = 177, last address = 192. Fixture 17 starts at 257. Fixture 32 would start at 497 � fitting exactly in universe 1 (addresses 1�512).',
      proTip:
        'Always patch fixtures in multiples that divide evenly into 512 channels to avoid universe splits. A fixture straddling two universes (e.g., starting at address 510 with 16 channels) requires special handling in most consoles. Use 16-channel fixtures for maximum 32 fixtures per universe, or 8-channel fixtures for 64 per universe. Label each fixture\'s DMX address on its hardware during patch for easy troubleshooting.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 10. Vinyl Record Playing Time
  // =========================================================================
  {
    id: 'vinyl-record-playing-time',
    slug: 'vinyl-record-playing-time',
    title: 'Vinyl Record Playing Time Estimator',
    description:
      'Estimate the playing time per side of a vinyl record based on RPM, groove dimensions, and record size. Useful for cutting engineers and record producers planning side lengths.',
    icon: '💿',
    category: 'photography',
    subcategory: 'audio',
    tags: ['vinyl', 'record', 'RPM', 'playing time', 'groove', 'lathe', 'mastering', 'LP', '45 RPM', 'side length'],
    inputs: [
      {
        id: 'rpm',
        label: 'Record Speed (RPM)',
        type: 'select',
        defaultValue: '33.333',
        options: [
          { label: '33? RPM (LP)', value: '33.333' },
          { label: '45 RPM (Single)', value: '45' },
          { label: '78 RPM (Shellac)', value: '78' },
        ],
        helpText: 'Turntable rotational speed. Standard LP = 33? RPM.',
        required: true,
      },
      {
        id: 'outerRadiusCm',
        label: 'Outer Groove Radius (cm)',
        type: 'number',
        defaultValue: 14.5,
        min: 5,
        max: 20,
        step: 0.1,
        placeholder: 'e.g. 14.5',
        helpText: 'Distance from center to first groove. Standard 12" LP: �14.5 cm.',
        required: true,
      },
      {
        id: 'innerRadiusCm',
        label: 'Inner Groove Radius (cm)',
        type: 'number',
        defaultValue: 6.0,
        min: 2,
        max: 14,
        step: 0.1,
        placeholder: 'e.g. 6.0',
        helpText: 'Distance from center to last groove. Standard LP: �6.0 cm (minimum 5.7 cm).',
        required: true,
      },
      {
        id: 'grooveSpacingUm',
        label: 'Groove Spacing (�m)',
        type: 'number',
        defaultValue: 400,
        min: 100,
        max: 1200,
        step: 10,
        placeholder: 'e.g. 400',
        helpText: 'Distance between grooves. Wider spacing = fewer grooves = louder cut. Typical: 300�500 �m.',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'grooveAreaCm2',
        expression: '3.14159265 * (pow(outerRadiusCm, 2) - pow(innerRadiusCm, 2))',
        dependencies: ['outerRadiusCm', 'innerRadiusCm'],
      },
      {
        id: 'grooveSpacingCm',
        expression: 'grooveSpacingUm / 10000',
        dependencies: ['grooveSpacingUm'],
      },
      {
        id: 'totalGrooveLengthCm',
        expression: 'grooveAreaCm2 / grooveSpacingCm',
        dependencies: ['grooveAreaCm2', 'grooveSpacingCm'],
      },
      {
        id: 'avgRadiusCm',
        expression: '(outerRadiusCm + innerRadiusCm) / 2',
        dependencies: ['outerRadiusCm', 'innerRadiusCm'],
      },
      {
        id: 'avgCircumferenceCm',
        expression: '2 * 3.14159265 * avgRadiusCm',
        dependencies: ['avgRadiusCm'],
      },
      {
        id: 'revolutionsTotal',
        expression: 'totalGrooveLengthCm / avgCircumferenceCm',
        dependencies: ['totalGrooveLengthCm', 'avgCircumferenceCm'],
      },
      {
        id: 'playingTimeMin',
        expression: 'revolutionsTotal / rpm',
        dependencies: ['revolutionsTotal', 'rpm'],
      },
      {
        id: 'playingTimeSec',
        expression: 'playingTimeMin * 60',
        dependencies: ['playingTimeMin'],
      },
    ],
    outputs: [
      {
        id: 'out-playingTimeMin',
        label: 'Playing Time per Side',
        formulaRef: 'playingTimeMin',
        format: 'number',
        precision: 1,
        suffix: ' minutes',
        highlight: true,
      },
      {
        id: 'out-playingTimeSec',
        label: 'Playing Time (seconds)',
        formulaRef: 'playingTimeSec',
        format: 'number',
        precision: 0,
        suffix: ' sec',
      },
      {
        id: 'out-revolutionsTotal',
        label: 'Total Groove Revolutions',
        formulaRef: 'revolutionsTotal',
        format: 'number',
        precision: 0,
      },
      {
        id: 'out-totalGrooveLengthCm',
        label: 'Total Groove Length',
        formulaRef: 'totalGrooveLengthCm',
        format: 'number',
        precision: 0,
        suffix: ' cm',
      },
    ],
    guide: {
      whatIsIt:
        'A vinyl record\'s playing time depends on how many grooves fit in the available area and how fast the disc rotates. The groove spacing (pitch) is set by the cutting lathe engineer � closer spacing = more playing time but less modulation space = quieter, less dynamic sound. This is the fundamental trade-off in vinyl mastering: volume vs. length.',
      howToUse:
        'Enter the record speed (RPM), the outer and inner groove radii (from the disc edge to the deadwax area), and the groove spacing in micrometers. Standard LP groove spacing ranges from 300�m (dense, long playing time) to 600�m (wide, louder cut). Results show estimated playing time per side.',
      exampleScenario:
        'A standard 12" LP at 33? RPM, outer radius 14.5 cm, inner 6.0 cm, groove spacing 400�m: groove area = p(14.5�-6�) = 547 cm�. Total groove length = 547/0.04 = 13,675 cm. Avg circumference = 2p�10.25 = 64.4 cm. Revolutions = 13,675/64.4 = 212. Time = 212/33.33 � 21.4 minutes per side � a typical LP side.',
      proTip:
        'For audiophile pressings, keep sides under 18�20 minutes and use 500�m groove spacing for maximum groove modulation and dynamic range. For dance music (12" singles), 45 RPM with large groove spacing gives the loudest, most dynamic cut. Never exceed 22�25 minutes per LP side � the inner grooves suffer from high tracking error angles and increased distortion as the stylus tracks the tighter circumferences.',
    },
    metadata: { version: '1.0.0' },
  },
];
