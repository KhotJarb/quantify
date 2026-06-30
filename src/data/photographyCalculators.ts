// ---------------------------------------------------------------------------
// Quantify — Photography, Video & Audio Calculators
// ---------------------------------------------------------------------------
// 10 calculators covering camera optics, video production, and audio/music.
// ---------------------------------------------------------------------------

import type { CalculatorSchema } from '@/types/calculator';

export const photographyCalculators: CalculatorSchema[] = [
  // =========================================================================
  // 1. Depth of Field Calculator
  // =========================================================================
  {
    id: 'depth-of-field',
    slug: 'depth-of-field',
    title: 'Depth of Field Calculator',
    description:
      'Calculate the depth of field, near/far focus limits, and hyperfocal distance for any lens, aperture, and sensor combination.',
    icon: '📷',
    category: 'photography',
    subcategory: 'camera',
    tags: ['depth of field', 'dof', 'bokeh', 'aperture', 'focal length', 'hyperfocal', 'circle of confusion', 'sensor'],
    inputs: [
      {
        id: 'focalLength',
        label: 'Focal Length (mm)',
        type: 'number',
        defaultValue: 50,
        min: 10,
        max: 800,
        step: 1,
        placeholder: 'e.g. 50',
        helpText: 'Lens focal length in millimetres',
        required: true,
      },
      {
        id: 'aperture',
        label: 'Aperture (f-stop)',
        type: 'number',
        defaultValue: 2.8,
        min: 0.7,
        max: 64,
        step: 0.1,
        placeholder: 'e.g. 2.8',
        helpText: 'f-number (e.g. 2.8 for f/2.8)',
        required: true,
      },
      {
        id: 'focusDistance',
        label: 'Focus Distance',
        type: 'number',
        defaultValue: 3,
        min: 0.1,
        step: 0.1,
        placeholder: 'e.g. 3',
        units: [
          { label: 'm',  value: '1' },
          { label: 'ft', value: '0.3048' },
        ],
        required: true,
      },
      {
        id: 'sensorSize',
        label: 'Sensor Size (Circle of Confusion)',
        type: 'select',
        options: [
          { label: 'Full Frame (CoC 0.029 mm)',        value: '0.029' },
          { label: 'APS-C (CoC 0.019 mm)',             value: '0.019' },
          { label: 'Micro Four Thirds (CoC 0.015 mm)', value: '0.015' },
          { label: '1-inch (CoC 0.011 mm)',            value: '0.011' },
        ],
        defaultValue: '0.029',
        required: true,
      },
    ],
    formulas: [
      { id: 'fMeter',        expression: 'focalLength / 1000',                                                                                              dependencies: ['focalLength'] },
      { id: 'cMeter',        expression: 'sensorSize / 1000',                                                                                               dependencies: ['sensorSize'] },
      { id: 'hyperfocalDist',expression: 'pow(fMeter, 2) / (aperture * cMeter)',                                                                             dependencies: ['fMeter', 'aperture', 'cMeter'] },
      { id: 'nearLimit',     expression: '(focusDistance * (hyperfocalDist - fMeter)) / (hyperfocalDist + focusDistance - 2 * fMeter)',                      dependencies: ['focusDistance', 'hyperfocalDist', 'fMeter'] },
      { id: 'farNumerator',  expression: 'focusDistance * (hyperfocalDist - fMeter)',                                                                         dependencies: ['focusDistance', 'hyperfocalDist', 'fMeter'] },
      { id: 'farDenominator',expression: 'hyperfocalDist - focusDistance',                                                                                   dependencies: ['hyperfocalDist', 'focusDistance'] },
      { id: 'farLimit',      expression: 'farDenominator <= 0 ? 9999 : farNumerator / farDenominator',                                                       dependencies: ['farDenominator', 'farNumerator'] },
      { id: 'dof',           expression: 'farLimit >= 9999 ? 9999 : farLimit - nearLimit',                                                                   dependencies: ['farLimit', 'nearLimit'] },
    ],
    outputs: [
      { id: 'out-dof',           label: 'Depth of Field',    formulaRef: 'dof',           format: 'number', precision: 2, suffix: ' m', highlight: true },
      { id: 'out-nearLimit',     label: 'Near Limit',        formulaRef: 'nearLimit',      format: 'number', precision: 2, suffix: ' m' },
      { id: 'out-farLimit',      label: 'Far Limit',         formulaRef: 'farLimit',       format: 'number', precision: 2, suffix: ' m' },
      { id: 'out-hyperfocalDist',label: 'Hyperfocal Distance',formulaRef: 'hyperfocalDist',format: 'number', precision: 1, suffix: ' m' },
    ],
    guide: {
      whatIsIt:
        'Depth of field (DoF) is the range of distance in a scene that appears acceptably sharp in a photograph. It depends on lens focal length, aperture (f-number), focus distance, and sensor size. A wide aperture (e.g. f/1.4) creates shallow DoF for portraits; a narrow aperture (e.g. f/16) creates deep DoF for landscapes.',
      howToUse:
        'Enter your focal length (mm), aperture (f-number), and focus distance. Select your camera sensor size — this determines the circle of confusion (CoC), a threshold of acceptable sharpness. The calculator returns the near and far limits of sharp focus, total depth of field, and the hyperfocal distance. A far limit of 9999 means infinity.',
      exampleScenario:
        'A photographer uses a 50 mm lens at f/2.8 on a full-frame camera, focused at 3 m. Near limit ≈ 2.67 m, far limit ≈ 3.42 m — a DoF of about 0.75 m. Stopping down to f/8 extends DoF to roughly 2.2 m for the same focus distance.',
      proTip:
        'The hyperfocal distance is the closest focus point at which infinity remains acceptably sharp. Setting focus to the hyperfocal distance maximises depth of field — everything from half the hyperfocal distance to infinity will appear sharp. Landscape photographers routinely use this technique.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 2. Field of View Calculator
  // =========================================================================
  {
    id: 'field-of-view',
    slug: 'field-of-view',
    title: 'Field of View Calculator',
    description:
      'Calculate the horizontal, vertical, and diagonal angular field of view for any lens and sensor size combination.',
    icon: '🔭',
    category: 'photography',
    subcategory: 'camera',
    tags: ['field of view', 'fov', 'angle of view', 'focal length', 'sensor', 'lens', 'coverage'],
    inputs: [
      {
        id: 'focalLength',
        label: 'Focal Length (mm)',
        type: 'number',
        defaultValue: 50,
        min: 1,
        max: 2000,
        step: 1,
        placeholder: 'e.g. 50',
        required: true,
      },
      {
        id: 'sensorWidth',
        label: 'Sensor Width (mm)',
        type: 'number',
        defaultValue: 36,
        min: 1,
        max: 200,
        step: 0.1,
        placeholder: 'e.g. 36',
        helpText: 'Full Frame = 36 mm, APS-C ≈ 23.5 mm, Micro Four Thirds ≈ 17.3 mm',
        required: true,
      },
      {
        id: 'sensorHeight',
        label: 'Sensor Height (mm)',
        type: 'number',
        defaultValue: 24,
        min: 1,
        max: 150,
        step: 0.1,
        placeholder: 'e.g. 24',
        helpText: 'Full Frame = 24 mm, APS-C ≈ 15.6 mm, Micro Four Thirds ≈ 13 mm',
        required: true,
      },
    ],
    formulas: [
      // FoV = 2 * atan(d / (2f)); atan approximated by Taylor series: atan(x) ≈ x - x³/3 + x⁵/5
      { id: 'r_h',       expression: 'sensorWidth / (2 * focalLength)',                                       dependencies: ['sensorWidth', 'focalLength'] },
      { id: 'r_v',       expression: 'sensorHeight / (2 * focalLength)',                                      dependencies: ['sensorHeight', 'focalLength'] },
      { id: 'diagSensor',expression: 'sqrt(pow(sensorWidth, 2) + pow(sensorHeight, 2))',                       dependencies: ['sensorWidth', 'sensorHeight'] },
      { id: 'r_d',       expression: 'diagSensor / (2 * focalLength)',                                        dependencies: ['diagSensor', 'focalLength'] },
      { id: 'hFoV',      expression: '2 * 57.29578 * (r_h - pow(r_h, 3) / 3 + pow(r_h, 5) / 5)',            dependencies: ['r_h'] },
      { id: 'vFoV',      expression: '2 * 57.29578 * (r_v - pow(r_v, 3) / 3 + pow(r_v, 5) / 5)',            dependencies: ['r_v'] },
      { id: 'dFoV',      expression: '2 * 57.29578 * (r_d - pow(r_d, 3) / 3 + pow(r_d, 5) / 5)',            dependencies: ['r_d'] },
    ],
    outputs: [
      { id: 'out-hFoV', label: 'Horizontal FoV', formulaRef: 'hFoV', format: 'number', precision: 1, suffix: '°', highlight: true },
      { id: 'out-vFoV', label: 'Vertical FoV',   formulaRef: 'vFoV', format: 'number', precision: 1, suffix: '°' },
      { id: 'out-dFoV', label: 'Diagonal FoV',   formulaRef: 'dFoV', format: 'number', precision: 1, suffix: '°' },
    ],
    guide: {
      whatIsIt:
        'Field of view (FoV) — sometimes called angle of view — is the angular extent of the scene captured by a lens and sensor combination, expressed in degrees. A wide-angle lens (e.g. 24 mm on full frame) captures roughly 84° horizontally, while a telephoto (200 mm) captures only about 10°.',
      howToUse:
        'Enter the focal length of your lens and the physical dimensions of your sensor. The calculator returns horizontal, vertical, and diagonal angles. Use the diagonal FoV to match lens coverage against projection or display specifications.',
      exampleScenario:
        'A 50 mm lens on a full-frame sensor (36 × 24 mm) gives ≈ 39.6° horizontal FoV — close to human natural vision. The same lens on an APS-C body (23.5 × 15.6 mm) yields ≈ 26.5° H-FoV, equivalent to a ~75 mm full-frame lens.',
      proTip:
        'Manufacturers quote diagonal FoV for marketing because it produces the largest number. When comparing security cameras, drones, or projectors, always compare the same axis (horizontal or vertical) to avoid misleading comparisons.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 3. Hyperfocal Distance Calculator
  // =========================================================================
  {
    id: 'hyperfocal-distance',
    slug: 'hyperfocal-distance',
    title: 'Hyperfocal Distance Calculator',
    description:
      'Find the hyperfocal distance for maximum depth of field — the closest focus point where infinity remains acceptably sharp.',
    icon: '🎯',
    category: 'photography',
    subcategory: 'camera',
    tags: ['hyperfocal', 'depth of field', 'landscape', 'sharpness', 'focus', 'infinity', 'aperture'],
    inputs: [
      {
        id: 'focalLength',
        label: 'Focal Length (mm)',
        type: 'number',
        defaultValue: 35,
        min: 1,
        max: 1000,
        step: 1,
        placeholder: 'e.g. 35',
        required: true,
      },
      {
        id: 'aperture',
        label: 'Aperture (f-stop)',
        type: 'number',
        defaultValue: 8,
        min: 1,
        max: 64,
        step: 0.5,
        placeholder: 'e.g. 8',
        required: true,
      },
      {
        id: 'sensorSize',
        label: 'Sensor Size',
        type: 'select',
        options: [
          { label: 'Full Frame (CoC 0.029 mm)',        value: '0.029' },
          { label: 'APS-C (CoC 0.019 mm)',             value: '0.019' },
          { label: 'Micro Four Thirds (CoC 0.015 mm)', value: '0.015' },
          { label: '1-inch (CoC 0.011 mm)',            value: '0.011' },
        ],
        defaultValue: '0.029',
        required: true,
      },
    ],
    formulas: [
      { id: 'fM',          expression: 'focalLength / 1000',                             dependencies: ['focalLength'] },
      { id: 'cM',          expression: 'sensorSize / 1000',                              dependencies: ['sensorSize'] },
      // H = f² / (N × c) + f  (ISO 11146)
      { id: 'hyperfocal',  expression: '(pow(fM, 2) / (aperture * cM)) + fM',            dependencies: ['fM', 'aperture', 'cM'] },
      { id: 'nearFocus',   expression: 'hyperfocal / 2',                                  dependencies: ['hyperfocal'] },
      { id: 'hyperfocalFt',expression: 'hyperfocal * 3.28084',                            dependencies: ['hyperfocal'] },
    ],
    outputs: [
      { id: 'out-hyperfocal',  label: 'Hyperfocal Distance',    formulaRef: 'hyperfocal',   format: 'number', precision: 2, suffix: ' m',  highlight: true },
      { id: 'out-nearFocus',   label: 'Near Depth (H/2)',       formulaRef: 'nearFocus',    format: 'number', precision: 2, suffix: ' m' },
      { id: 'out-hyperfocalFt',label: 'Hyperfocal Distance',    formulaRef: 'hyperfocalFt', format: 'number', precision: 1, suffix: ' ft' },
    ],
    guide: {
      whatIsIt:
        'The hyperfocal distance is the closest focusing distance at which objects at infinity are rendered acceptably sharp, given a specific lens, aperture, and acceptable circle of confusion. Focusing at this distance maximises the depth of field — everything from half the hyperfocal distance to infinity appears sharp.',
      howToUse:
        'Enter your lens focal length, chosen aperture, and select your sensor format. The calculator shows the hyperfocal distance in both metres and feet. Set your lens focus ring to that distance to achieve maximum depth of field.',
      exampleScenario:
        'A 35 mm lens at f/8 on a full-frame camera has a hyperfocal distance of ≈ 5.3 m. Focused there, sharpness extends from 2.65 m to infinity — ideal for street and landscape photography where you want everything sharp without re-focusing.',
      proTip:
        'Many prime lenses have distance scales on the barrel — use them to set hyperfocal distance without a phone. Smaller sensors (APS-C, MFT) have smaller CoC values, so their hyperfocal distances are shorter, meaning more depth of field at any given focal length and aperture — a notable advantage for landscape photographers.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 4. Time-lapse Calculator
  // =========================================================================
  {
    id: 'timelapse-calculator',
    slug: 'timelapse-calculator',
    title: 'Time-lapse Calculator',
    description:
      'Calculate the total number of frames, final video duration, and speed-up factor for a time-lapse shoot.',
    icon: '⏱️',
    category: 'photography',
    subcategory: 'video',
    tags: ['timelapse', 'time-lapse', 'interval', 'fps', 'frames', 'video', 'speed-up', 'interval shooting'],
    inputs: [
      {
        id: 'shootingDuration',
        label: 'Shooting Duration (hours)',
        type: 'number',
        defaultValue: 1,
        min: 0.01,
        step: 0.25,
        placeholder: 'e.g. 1',
        helpText: 'Total real-world time of the time-lapse shoot',
        required: true,
      },
      {
        id: 'interval',
        label: 'Interval Between Shots (seconds)',
        type: 'number',
        defaultValue: 5,
        min: 1,
        step: 1,
        placeholder: 'e.g. 5',
        helpText: 'How many seconds between each captured frame',
        required: true,
      },
      {
        id: 'playbackFps',
        label: 'Playback Frame Rate',
        type: 'select',
        options: [
          { label: '24 fps (cinematic)', value: '24' },
          { label: '25 fps (PAL)',       value: '25' },
          { label: '30 fps (NTSC)',      value: '30' },
          { label: '60 fps (smooth)',    value: '60' },
        ],
        defaultValue: '24',
        required: true,
      },
    ],
    formulas: [
      { id: 'totalShots',   expression: '(shootingDuration * 3600) / interval',  dependencies: ['shootingDuration', 'interval'] },
      { id: 'videoLength',  expression: 'totalShots / playbackFps',              dependencies: ['totalShots', 'playbackFps'] },
      { id: 'speedupFactor',expression: 'interval * playbackFps',                dependencies: ['interval', 'playbackFps'] },
    ],
    outputs: [
      { id: 'out-totalShots',   label: 'Total Frames / Shots', formulaRef: 'totalShots',    format: 'number', precision: 0,             highlight: true },
      { id: 'out-videoLength',  label: 'Video Duration',       formulaRef: 'videoLength',   format: 'number', precision: 1, suffix: ' seconds' },
      { id: 'out-speedupFactor',label: 'Speed-up Factor',      formulaRef: 'speedupFactor', format: 'number', precision: 0, suffix: '×' },
    ],
    guide: {
      whatIsIt:
        'A time-lapse compresses long real-world events into short video clips by capturing frames at extended intervals and playing them back at normal frame rates. The speed-up factor tells you how many times faster the final video appears compared to real time.',
      howToUse:
        'Enter the total shooting duration in hours and the interval between shots in seconds. Choose your target playback frame rate. The calculator shows how many shots you will take, how long the final video will be, and the speed-up factor.',
      exampleScenario:
        'Shooting a 1-hour sunset at 5-second intervals at 24 fps: 720 frames total, producing a 30-second video at 120× real speed. Changing the interval to 10 seconds doubles the speed-up to 240× but halves the frame count to 360.',
      proTip:
        'For smooth motion, aim for at least 200–300 frames total. For flicker-free results in changing light, shoot in Manual mode and use deflicker software in post. A shorter interval requires more storage and battery but allows more flexibility in final playback speed.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 5. Video Storage Calculator
  // =========================================================================
  {
    id: 'video-storage',
    slug: 'video-storage',
    title: 'Video Storage Calculator',
    description:
      'Estimate the total storage required for video footage from bitrate, duration, and number of clips.',
    icon: '💾',
    category: 'photography',
    subcategory: 'video',
    tags: ['video storage', 'bitrate', 'file size', 'sd card', 'hard drive', '4k', 'raw video', 'codec'],
    inputs: [
      {
        id: 'bitrate',
        label: 'Bitrate (Mbps)',
        type: 'number',
        defaultValue: 100,
        min: 1,
        step: 1,
        placeholder: 'e.g. 100',
        helpText: '4K RAW ≈ 800 Mbps · 4K H.265 ≈ 50 Mbps · 1080p H.264 ≈ 25 Mbps',
        required: true,
      },
      {
        id: 'duration',
        label: 'Clip / Session Duration',
        type: 'number',
        defaultValue: 60,
        min: 1,
        step: 1,
        placeholder: 'e.g. 60',
        units: [
          { label: 'minutes', value: '60'   },
          { label: 'hours',   value: '3600' },
          { label: 'seconds', value: '1'    },
        ],
        required: true,
      },
      {
        id: 'numClips',
        label: 'Number of Clips / Files',
        type: 'number',
        defaultValue: 1,
        min: 1,
        step: 1,
        placeholder: 'e.g. 1',
        helpText: 'Multiply for multiple clips of the same duration',
        required: true,
      },
    ],
    formulas: [
      // duration already in seconds via unit conversion
      { id: 'durationSec', expression: 'duration',                                  dependencies: ['duration'] },
      // Size (MB) = bitrate (Mbps) × duration (s) × clips / 8
      { id: 'totalSizeMB', expression: '(bitrate * durationSec * numClips) / 8',    dependencies: ['bitrate', 'durationSec', 'numClips'] },
      { id: 'totalSizeGB', expression: 'totalSizeMB / 1024',                         dependencies: ['totalSizeMB'] },
      { id: 'totalSizeTB', expression: 'totalSizeGB / 1024',                         dependencies: ['totalSizeGB'] },
    ],
    outputs: [
      { id: 'out-totalSizeGB', label: 'Storage Required', formulaRef: 'totalSizeGB', format: 'number', precision: 2, suffix: ' GB', highlight: true },
      { id: 'out-totalSizeMB', label: 'In Megabytes',     formulaRef: 'totalSizeMB', format: 'number', precision: 0, suffix: ' MB' },
      { id: 'out-totalSizeTB', label: 'In Terabytes',     formulaRef: 'totalSizeTB', format: 'number', precision: 4, suffix: ' TB' },
    ],
    guide: {
      whatIsIt:
        'Video file size is determined by bitrate (data rate) and duration. The formula is: Size (MB) = Bitrate (Mbps) × Duration (seconds) ÷ 8. Higher bitrates produce better quality but require more storage and faster media cards.',
      howToUse:
        'Enter the camera or codec bitrate in Mbps, the recording duration (choose seconds/minutes/hours from the unit selector), and the number of clips. The result updates in GB, MB, and TB simultaneously.',
      exampleScenario:
        'Recording 60 minutes of 4K footage at 100 Mbps: 100 × 3600 / 8 = 45,000 MB = 43.9 GB. A full-day wedding shoot of 8 hours at the same bitrate requires roughly 352 GB — plan at least two 512 GB CFexpress cards or a portable SSD.',
      proTip:
        'Card write speed must exceed your bitrate. A 100 Mbps stream needs a card rated at least 12.5 MB/s — but real-world overhead means 30 MB/s or faster cards are safer. For RAW video at 800+ Mbps, only CFexpress Type B or high-speed SSDs are viable. Always carry 1.5× your estimated storage as a buffer.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 6. Rule of 500 — Astrophotography Shutter Speed
  // =========================================================================
  {
    id: 'rule-of-500',
    slug: 'rule-of-500',
    title: 'Rule of 500 — Star Trail Calculator',
    description:
      'Calculate the maximum shutter speed to avoid star trailing in astrophotography using the Rule of 500, 600, and 300.',
    icon: '⭐',
    category: 'photography',
    subcategory: 'camera',
    tags: ['astrophotography', 'stars', 'milky way', 'rule of 500', 'shutter speed', 'star trail', 'night sky', 'crop factor'],
    inputs: [
      {
        id: 'focalLength',
        label: 'Focal Length (mm)',
        type: 'number',
        defaultValue: 24,
        min: 1,
        max: 2000,
        step: 1,
        placeholder: 'e.g. 24',
        helpText: 'Native focal length of the lens (not equivalent)',
        required: true,
      },
      {
        id: 'cropFactor',
        label: 'Camera Sensor / Crop Factor',
        type: 'select',
        options: [
          { label: 'Full Frame (1×)',            value: '1'   },
          { label: 'APS-C Canon (1.6×)',         value: '1.6' },
          { label: 'APS-C Nikon / Sony (1.5×)', value: '1.5' },
          { label: 'Micro Four Thirds (2×)',     value: '2'   },
          { label: 'Medium Format (0.7×)',       value: '0.7' },
        ],
        defaultValue: '1',
        required: true,
      },
    ],
    formulas: [
      { id: 'effectiveFocal', expression: 'focalLength * cropFactor', dependencies: ['focalLength', 'cropFactor'] },
      { id: 'rule500',        expression: '500 / effectiveFocal',      dependencies: ['effectiveFocal'] },
      { id: 'rule600',        expression: '600 / effectiveFocal',      dependencies: ['effectiveFocal'] },
      { id: 'rule300',        expression: '300 / effectiveFocal',      dependencies: ['effectiveFocal'] },
    ],
    outputs: [
      { id: 'out-rule500', label: 'Rule of 500 (Standard)',     formulaRef: 'rule500', format: 'number', precision: 2, suffix: ' sec', highlight: true },
      { id: 'out-rule600', label: 'Rule of 600 (Permissive)',   formulaRef: 'rule600', format: 'number', precision: 2, suffix: ' sec' },
      { id: 'out-rule300', label: 'Rule of 300 (Sharp Stars)',  formulaRef: 'rule300', format: 'number', precision: 2, suffix: ' sec' },
    ],
    guide: {
      whatIsIt:
        'Stars appear to trail across the sensor due to Earth\'s rotation. The Rule of 500 is a quick rule of thumb: divide 500 by your effective (equivalent) focal length to get the maximum shutter speed in seconds before stars become visible trails at normal print/screen sizes. The Rule of 300 is more conservative for high-megapixel cameras; Rule of 600 is more permissive.',
      howToUse:
        'Enter the physical focal length of your lens and select your sensor crop factor. The three rule results appear simultaneously. Use the strictest (Rule of 300) for sensors above 24 MP, the standard (Rule of 500) for typical use, and Rule of 600 only for very short focal lengths or low-resolution sensors.',
      exampleScenario:
        'A 24 mm lens on a full-frame camera: Rule of 500 gives 20.8 s, Rule of 300 gives 12.5 s. The same lens on an APS-C body (1.5×): effective FL = 36 mm, so Rule of 500 = 13.9 s. Wide lenses always allow longer exposures because the apparent angular motion of stars covers fewer pixels.',
      proTip:
        'For truly pinpoint stars on modern high-resolution sensors (45 MP+), astrophotographers use the NPF rule: (35 × aperture + 30 × pixel pitch) / focal length. Alternatively, use a star tracker to allow 2–5 minute exposures for superior deep-sky images without any trailing at all.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 7. BPM to Milliseconds (Delay / Reverb Timing)
  // =========================================================================
  {
    id: 'bpm-to-ms',
    slug: 'bpm-to-ms',
    title: 'BPM to Milliseconds Converter',
    description:
      'Convert beats per minute (BPM) to delay and reverb timing values in milliseconds for all common note subdivisions.',
    icon: '🎵',
    category: 'photography',
    subcategory: 'audio',
    tags: ['bpm', 'tempo', 'delay', 'reverb', 'milliseconds', 'music production', 'daw', 'sync', 'rhythm'],
    inputs: [
      {
        id: 'bpm',
        label: 'Tempo (BPM)',
        type: 'number',
        defaultValue: 120,
        min: 20,
        max: 300,
        step: 1,
        placeholder: 'e.g. 120',
        helpText: 'Beats per minute (BPM) of your song or project',
        required: true,
      },
    ],
    formulas: [
      // 1 beat (quarter note) = 60,000 ms / BPM
      { id: 'quarterNote',   expression: '60000 / bpm',             dependencies: ['bpm'] },
      { id: 'wholeNote',     expression: '(60000 / bpm) * 4',       dependencies: ['bpm'] },
      { id: 'halfNote',      expression: '(60000 / bpm) * 2',       dependencies: ['bpm'] },
      { id: 'eighthNote',    expression: '(60000 / bpm) / 2',       dependencies: ['bpm'] },
      { id: 'sixteenthNote', expression: '(60000 / bpm) / 4',       dependencies: ['bpm'] },
      { id: 'tripletEighth', expression: '(60000 / bpm) * 2 / 3',   dependencies: ['bpm'] },
      { id: 'dottedQuarter', expression: '(60000 / bpm) * 1.5',     dependencies: ['bpm'] },
    ],
    outputs: [
      { id: 'out-quarterNote',   label: 'Quarter Note (1 Beat)', formulaRef: 'quarterNote',   format: 'number', precision: 1,  suffix: ' ms', highlight: true },
      { id: 'out-halfNote',      label: 'Half Note',             formulaRef: 'halfNote',      format: 'number', precision: 1,  suffix: ' ms' },
      { id: 'out-wholeNote',     label: 'Whole Note',            formulaRef: 'wholeNote',     format: 'number', precision: 1,  suffix: ' ms' },
      { id: 'out-eighthNote',    label: '8th Note',              formulaRef: 'eighthNote',    format: 'number', precision: 1,  suffix: ' ms' },
      { id: 'out-sixteenthNote', label: '16th Note',             formulaRef: 'sixteenthNote', format: 'number', precision: 2,  suffix: ' ms' },
      { id: 'out-tripletEighth', label: 'Triplet 8th Note',      formulaRef: 'tripletEighth', format: 'number', precision: 1,  suffix: ' ms' },
      { id: 'out-dottedQuarter', label: 'Dotted Quarter Note',   formulaRef: 'dottedQuarter', format: 'number', precision: 1,  suffix: ' ms' },
    ],
    guide: {
      whatIsIt:
        'Tempo-synced delays and reverbs lock rhythmic effects to the project BPM, making them feel musical rather than arbitrary. The formula is: note duration (ms) = (60,000 / BPM) × note value factor. A quarter note factor is 1, half note is 2, eighth note is 0.5, and so on.',
      howToUse:
        'Enter the BPM of your project. The calculator returns delay times for all common note subdivisions. Enter these values into your delay plugin\'s time parameter (in ms) to sync it rhythmically to the tempo. For stereo delays, set the left channel to one note value and the right to another (e.g. quarter + dotted eighth).',
      exampleScenario:
        'At 120 BPM: quarter note = 500 ms, eighth note = 250 ms, dotted quarter = 750 ms. A dotted-eighth delay (375 ms) panned in stereo against a quarter-note delay (500 ms) creates the classic "U2 The Edge" slapback effect that sits rhythmically in the groove.',
      proTip:
        'Use triplet values for a syncopated, swinging feel. Reverb pre-delay set to 1/16th note (62.5 ms at 120 BPM) keeps the attack of a vocal dry and present before the reverb blooms — one of the most common professional mixing tricks. Most modern DAWs can sync delay plugins automatically via tempo host sync, but manual ms entry is essential for hardware units.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 8. Musical Key Transposition / Frequency Calculator
  // =========================================================================
  {
    id: 'key-transposition',
    slug: 'key-transposition',
    title: 'Musical Key Transposition Calculator',
    description:
      'Calculate the transposed frequency when shifting a note by any number of semitones, using equal temperament tuning.',
    icon: '🎹',
    category: 'photography',
    subcategory: 'audio',
    tags: ['transposition', 'frequency', 'semitone', 'pitch', 'equal temperament', 'capo', 'music theory', 'hertz'],
    inputs: [
      {
        id: 'originalFreq',
        label: 'Reference Frequency (Hz)',
        type: 'number',
        defaultValue: 440,
        min: 20,
        max: 20000,
        step: 0.01,
        placeholder: 'e.g. 440',
        helpText: 'A4 = 440 Hz · Middle C (C4) = 261.63 Hz · Concert Bb = 466.16 Hz',
        required: true,
      },
      {
        id: 'semitones',
        label: 'Semitones to Transpose',
        type: 'number',
        defaultValue: 5,
        min: -24,
        max: 24,
        step: 1,
        placeholder: 'e.g. 5',
        helpText: 'Positive = up · Negative = down · 12 semitones = 1 octave · Perfect 5th = 7',
        required: true,
      },
    ],
    formulas: [
      // Equal temperament: f_new = f_ref × 2^(n/12)
      { id: 'newFreq',      expression: 'originalFreq * pow(2, semitones / 12)',               dependencies: ['originalFreq', 'semitones'] },
      { id: 'ratioPercent', expression: '(newFreq / originalFreq - 1) * 100',                  dependencies: ['newFreq', 'originalFreq'] },
      { id: 'octaves',      expression: 'semitones / 12',                                       dependencies: ['semitones'] },
    ],
    outputs: [
      { id: 'out-newFreq',      label: 'Transposed Frequency', formulaRef: 'newFreq',      format: 'number', precision: 2, suffix: ' Hz', highlight: true },
      { id: 'out-ratioPercent', label: 'Frequency Change',     formulaRef: 'ratioPercent', format: 'number', precision: 1, suffix: '%' },
      { id: 'out-octaves',      label: 'Octaves Shifted',      formulaRef: 'octaves',      format: 'number', precision: 2 },
    ],
    guide: {
      whatIsIt:
        'In equal temperament (the standard Western tuning system), the octave is divided into 12 equal semitones. Each semitone multiplies frequency by the 12th root of 2 (≈ 1.05946). Transposing by n semitones multiplies the original frequency by 2^(n/12). This is how pitch-shifting plugins, capos, and DAW transpose functions work internally.',
      howToUse:
        'Enter the original frequency of your reference note and the number of semitones to transpose. Positive semitones raise the pitch; negative semitones lower it. The calculator returns the new frequency, the percentage change, and how many octaves the shift represents.',
      exampleScenario:
        'Concert A (440 Hz) transposed up 7 semitones (a perfect fifth) gives 659.26 Hz — concert E5. Transposing up 12 semitones doubles the frequency to 880 Hz (A5). A guitarist placing a capo on fret 5 effectively transposes every note up 5 semitones.',
      proTip:
        'Pitch-shifting vocals more than ±2–3 semitones begins to sound artificial with most algorithms. For dramatic transpositions, consider re-harmonisation rather than simple pitch shift. Transposing a sample by exactly 7 semitones (perfect fifth) creates powerful parallel harmonies widely used in EDM and hip-hop production.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 9. Sound Pressure Level (SPL) Distance Calculator
  // =========================================================================
  {
    id: 'spl-distance',
    slug: 'spl-distance',
    title: 'Sound Pressure Level (SPL) Distance Calculator',
    description:
      'Calculate SPL at any distance using the inverse square law — every doubling of distance reduces SPL by 6 dB.',
    icon: '🔊',
    category: 'photography',
    subcategory: 'audio',
    tags: ['spl', 'sound pressure level', 'decibels', 'db', 'inverse square law', 'acoustic', 'distance', 'noise'],
    inputs: [
      {
        id: 'splRef',
        label: 'Reference SPL (dB)',
        type: 'number',
        defaultValue: 94,
        min: 0,
        max: 200,
        step: 0.1,
        placeholder: 'e.g. 94',
        helpText: 'Measured SPL at the reference distance. 94 dB is a typical calibration level.',
        required: true,
      },
      {
        id: 'refDist',
        label: 'Reference Distance',
        type: 'number',
        defaultValue: 1,
        min: 0.1,
        step: 0.1,
        placeholder: 'e.g. 1',
        units: [
          { label: 'm',  value: '1'      },
          { label: 'ft', value: '0.3048' },
        ],
        required: true,
      },
      {
        id: 'targetDist',
        label: 'Target Distance',
        type: 'number',
        defaultValue: 10,
        min: 0.1,
        step: 0.1,
        placeholder: 'e.g. 10',
        units: [
          { label: 'm',  value: '1'      },
          { label: 'ft', value: '0.3048' },
        ],
        required: true,
      },
    ],
    formulas: [
      // Inverse square law: SPL2 = SPL1 - 20 × log10(d2/d1)
      // log() in this parser is base-10
      { id: 'splAtTarget', expression: 'splRef - 20 * log(targetDist / refDist)',            dependencies: ['splRef', 'targetDist', 'refDist'] },
      { id: 'reduction',   expression: 'splRef - splAtTarget',                               dependencies: ['splRef', 'splAtTarget'] },
      // Distance doublings = log2(d2/d1) = log10(d2/d1) / log10(2)
      { id: 'doublings',   expression: 'log(targetDist / refDist) / log(2)',                 dependencies: ['targetDist', 'refDist'] },
    ],
    outputs: [
      { id: 'out-splAtTarget', label: 'SPL at Target Distance', formulaRef: 'splAtTarget', format: 'number', precision: 1, suffix: ' dB', highlight: true },
      { id: 'out-reduction',   label: 'SPL Reduction',          formulaRef: 'reduction',   format: 'number', precision: 1, suffix: ' dB' },
      { id: 'out-doublings',   label: 'Distance Doublings',     formulaRef: 'doublings',   format: 'number', precision: 2 },
    ],
    guide: {
      whatIsIt:
        'The inverse square law states that in a free field (no reflections), sound intensity decreases with the square of distance. This translates to a -6 dB reduction for every doubling of distance. The formula is: SPL₂ = SPL₁ − 20 × log₁₀(d₂ / d₁). This applies outdoors or in anechoic environments; real rooms with reflections reduce the attenuation rate.',
      howToUse:
        'Enter the known SPL at a reference distance (e.g. measured 1 m from a speaker), then enter the target distance. The result shows the predicted SPL at that distance. Both distances use the same unit selector — ensure they match.',
      exampleScenario:
        'A PA speaker measures 110 dB at 1 m. At 10 m: SPL = 110 − 20 × log₁₀(10) = 90 dB. At 100 m: 70 dB — quiet conversation level. Concert front-of-house positions typically see 90–100 dB from high-power rigs.',
      proTip:
        'NIOSH safe exposure limits: 85 dB for 8 hours, 91 dB for 2 hours, 100 dB for 15 minutes, 112 dB for under 1 minute. A concert venue hitting 110 dB at FOH means crew near sub speakers may experience 116+ dB — always wear hearing protection on stage.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 10. Subwoofer Box Volume Calculator
  // =========================================================================
  {
    id: 'subwoofer-box',
    slug: 'subwoofer-box',
    title: 'Subwoofer Box Volume Calculator',
    description:
      'Calculate net internal volume of a subwoofer enclosure after accounting for wood thickness and driver displacement.',
    icon: '📦',
    category: 'photography',
    subcategory: 'audio',
    tags: ['subwoofer', 'enclosure', 'box volume', 'ported', 'sealed', 'MDF', 'speaker box', 'bass'],
    inputs: [
      {
        id: 'boxW',
        label: 'External Width (inches)',
        type: 'number',
        defaultValue: 18,
        min: 1,
        step: 0.25,
        placeholder: 'e.g. 18',
        required: true,
      },
      {
        id: 'boxH',
        label: 'External Height (inches)',
        type: 'number',
        defaultValue: 14,
        min: 1,
        step: 0.25,
        placeholder: 'e.g. 14',
        required: true,
      },
      {
        id: 'boxD',
        label: 'External Depth (inches)',
        type: 'number',
        defaultValue: 12,
        min: 1,
        step: 0.25,
        placeholder: 'e.g. 12',
        required: true,
      },
      {
        id: 'woodThickness',
        label: 'Wood Thickness (inches)',
        type: 'number',
        defaultValue: 0.75,
        min: 0.25,
        max: 2,
        step: 0.0625,
        placeholder: 'e.g. 0.75',
        helpText: 'MDF thickness. 3/4" MDF = 0.75 in. 18 mm MDF ≈ 0.71 in.',
        required: true,
      },
      {
        id: 'numDrivers',
        label: 'Number of Drivers',
        type: 'number',
        defaultValue: 1,
        min: 1,
        max: 4,
        step: 1,
        placeholder: 'e.g. 1',
        required: true,
      },
      {
        id: 'driverDisplacement',
        label: 'Driver Displacement per Driver (in³)',
        type: 'number',
        defaultValue: 100,
        min: 1,
        step: 1,
        placeholder: 'e.g. 100',
        helpText: 'From spec sheet. Typical 12" sub ≈ 100 in³, 15" sub ≈ 150 in³.',
        required: true,
      },
    ],
    formulas: [
      { id: 'grossCuIn', expression: 'boxW * boxH * boxD',                                                         dependencies: ['boxW', 'boxH', 'boxD'] },
      { id: 'innerW',    expression: 'boxW - 2 * woodThickness',                                                    dependencies: ['boxW', 'woodThickness'] },
      { id: 'innerH',    expression: 'boxH - 2 * woodThickness',                                                    dependencies: ['boxH', 'woodThickness'] },
      { id: 'innerD',    expression: 'boxD - 2 * woodThickness',                                                    dependencies: ['boxD', 'woodThickness'] },
      { id: 'netCuIn',   expression: '(innerW * innerH * innerD) - (numDrivers * driverDisplacement)',              dependencies: ['innerW', 'innerH', 'innerD', 'numDrivers', 'driverDisplacement'] },
      { id: 'netCuFt',   expression: 'netCuIn / 1728',                                                              dependencies: ['netCuIn'] },
      { id: 'netLiters', expression: 'netCuIn * 0.016387',                                                          dependencies: ['netCuIn'] },
    ],
    outputs: [
      { id: 'out-netLiters', label: 'Net Internal Volume',    formulaRef: 'netLiters', format: 'number', precision: 2, suffix: ' L',   highlight: true },
      { id: 'out-netCuFt',   label: 'Volume (cubic feet)',    formulaRef: 'netCuFt',   format: 'number', precision: 3, suffix: ' ft³' },
      { id: 'out-netCuIn',   label: 'Volume (cubic inches)', formulaRef: 'netCuIn',   format: 'number', precision: 1, suffix: ' in³' },
    ],
    guide: {
      whatIsIt:
        'A subwoofer enclosure\'s net internal volume is the actual air space the driver "sees" — external dimensions minus the volume consumed by the wood panels and the driver basket/magnet assembly. Manufacturers specify optimal enclosure volume (sealed or ported) in their datasheet, and deviating by more than 10–15% noticeably changes frequency response and bass output.',
      howToUse:
        'Enter the external box dimensions, wood thickness (typically 3/4" MDF), the number of drivers, and each driver\'s displacement from the spec sheet. The net volume in litres, cubic feet, and cubic inches is calculated instantly. Compare with the manufacturer\'s recommended enclosure volume.',
      exampleScenario:
        'An 18×14×12 inch external box built with 3/4" MDF has inner dimensions of 16.5×12.5×10.5 in = 2165.6 in³. Subtract one 12" driver at 100 in³ displacement → 2065.6 in³ = 33.8 L = 1.20 ft³. A typical 12" woofer wants 1.0–1.5 ft³ sealed.',
      proTip:
        'Enclosure type guidance: if the driver\'s Qts < 0.4, it is optimised for vented (ported) designs; Qts > 0.7 suits sealed boxes; 0.4–0.7 works in either. Sealed enclosures sound tighter and more accurate; ported designs extend low-frequency output by 3–6 dB but require precise port tuning. Always use 3/4" MDF and brace the interior panels to prevent resonance colouring the sound.',
    },
    metadata: { version: '1.0.0' },
  },
];
