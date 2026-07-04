import type { CalculatorSchema } from '@/types/calculator';

export const geographyGISCalculators: CalculatorSchema[] = [

  // --- 1. Haversine Distance Calculator ---------------------------------------
  {
    id: 'haversine-distance-calculator',
    slug: 'haversine-distance-calculator',
    title: 'Haversine Distance (Lat/Lon)',
    description: 'Calculate the great-circle distance between two points on Earth given their latitude and longitude using an equirectangular approximation.',
    icon: '🌍',
    category: 'science',
    subcategory: 'geography',
    tags: ['haversine', 'distance', 'latitude', 'longitude', 'great circle', 'geography', 'gis', 'coordinates'],
    inputs: [
      { id: 'lat1', label: 'Latitude 1 (degrees)', type: 'number', defaultValue: 51.5074, step: 0.0001, min: -90, max: 90, placeholder: 'e.g. 51.5074' },
      { id: 'lon1', label: 'Longitude 1 (degrees)', type: 'number', defaultValue: -0.1278, step: 0.0001, placeholder: 'e.g. -0.1278' },
      { id: 'lat2', label: 'Latitude 2 (degrees)', type: 'number', defaultValue: 48.8566, step: 0.0001, placeholder: 'e.g. 48.8566' },
      { id: 'lon2', label: 'Longitude 2 (degrees)', type: 'number', defaultValue: 2.3522, step: 0.0001, placeholder: 'e.g. 2.3522' },
    ],
    formulas: [
      { id: 'dlat', expression: '(lat2 - lat1) * 3.14159 / 180', dependencies: ['lat1', 'lat2'] },
      { id: 'dlon', expression: '(lon2 - lon1) * 3.14159 / 180', dependencies: ['lon1', 'lon2'] },
      { id: 'mlat', expression: '(lat1 + lat2) / 2 * 3.14159 / 180', dependencies: ['lat1', 'lat2'] },
      { id: 'distKm', expression: 'sqrt(pow(dlat * 6371, 2) + pow(dlon * 6371 * cos(mlat), 2))', dependencies: ['dlat', 'dlon', 'mlat'] },
      { id: 'distMiles', expression: 'distKm * 0.621371', dependencies: ['distKm'] },
    ],
    outputs: [
      { id: 'distKmOut', label: 'Distance', formulaRef: 'distKm', precision: 2, suffix: ' km', highlight: true },
      { id: 'distMilesOut', label: 'Distance (miles)', formulaRef: 'distMiles', precision: 2, suffix: ' miles' },
    ],
    guide: {
      whatIsIt: 'The Haversine Distance Calculator computes the straight-line (great-circle) distance between two geographic points using their latitude and longitude. This equirectangular approximation is accurate to within ~0.5% for distances under 1,000 km and is ideal for quick GIS calculations, geocaching, and geographic analysis.',
      howToUse: 'Enter the latitude and longitude for your two locations in decimal degrees (negative for South/West). London is at 51.5074 N, -0.1278 W; Paris is at 48.8566 N, 2.3522 E. The calculator instantly returns distance in kilometres and miles.',
      exampleScenario: 'London (51.5074, -0.1278) to Paris (48.8566, 2.3522): the equirectangular result gives approximately 341 km (212 miles). The true haversine result is ~341 km, so the approximation is excellent for mid-latitude calculations.',
      proTip: 'The equirectangular formula is highly accurate within the same continent. For antipodal points (e.g. across hemispheres), error increases. Remember: 1 degree of latitude is approximately 111 km; 1 degree of longitude varies with cos(latitude).',
    },
    metadata: { version: '1.0.0' },
  },

  // --- 2. Horizon Distance Calculator -----------------------------------------
  {
    id: 'horizon-distance-calculator',
    slug: 'horizon-distance-calculator',
    title: 'Line of Sight / Horizon Distance',
    description: 'Calculate how far to the horizon you can see from a given height, and the maximum line-of-sight distance to a target at elevation.',
    icon: '🌃',
    category: 'science',
    subcategory: 'geography',
    tags: ['horizon', 'line of sight', 'visibility', 'earth curvature', 'observer height', 'geography', 'navigation'],
    inputs: [
      { id: 'observerHeightM', label: 'Observer Height (m)', type: 'number', defaultValue: 2, min: 0, placeholder: 'e.g. 2', helpText: 'Height of the observer above ground or sea level in metres.' },
      { id: 'targetHeightM', label: 'Target Height (m)', type: 'number', defaultValue: 0, min: 0, placeholder: 'e.g. 0', helpText: '0 for sea-level horizon' },
      { id: 'atmosphericRefraction', label: 'Include Atmospheric Refraction (adds ~7%)', type: 'checkbox', defaultValue: false, helpText: 'Atmospheric refraction slightly extends the visual horizon under standard conditions.' },
    ],
    formulas: [
      { id: 'refractionFactor', expression: 'atmosphericRefraction ? 1.07 : 1', dependencies: ['atmosphericRefraction'] },
      { id: 'horizonKm', expression: '3.57 * sqrt(observerHeightM) * refractionFactor', dependencies: ['observerHeightM', 'refractionFactor'] },
      { id: 'targetHorizonKm', expression: '3.57 * sqrt(max(targetHeightM, 0))', dependencies: ['targetHeightM'] },
      { id: 'totalLineOfSightKm', expression: 'horizonKm + targetHorizonKm', dependencies: ['horizonKm', 'targetHorizonKm'] },
      { id: 'horizonMiles', expression: 'totalLineOfSightKm * 0.621371', dependencies: ['totalLineOfSightKm'] },
    ],
    outputs: [
      { id: 'horizonKmOut', label: 'Horizon Distance', formulaRef: 'horizonKm', precision: 2, suffix: ' km', highlight: true },
      { id: 'totalLineOfSightKmOut', label: 'Max Line of Sight (to target)', formulaRef: 'totalLineOfSightKm', precision: 2, suffix: ' km' },
      { id: 'horizonMilesOut', label: 'Horizon (miles)', formulaRef: 'horizonMiles', precision: 2, suffix: ' miles' },
    ],
    guide: {
      whatIsIt: 'The geometric horizon is the maximum distance at which a point on the ground can be seen, limited by Earth\'s curvature. The formula d = 3.57 * sqrt(h) km gives the horizon distance for an observer at height h metres. Two objects can see each other when the sum of their individual horizon distances exceeds their separation.',
      howToUse: 'Enter your observer height (e.g. standing on a cliff at 50 m) and the target height (e.g. a lighthouse at 30 m). Toggle atmospheric refraction to add ~7% for more realistic daylight conditions. The result shows your horizon alone and the combined line-of-sight distance.',
      exampleScenario: 'An observer at 10 m (ship mast) watching a lighthouse at 30 m height: Observer horizon = 11.3 km, lighthouse horizon = 19.6 km. Combined line-of-sight = 30.9 km � the lighthouse is visible from up to ~31 km away in clear conditions.',
      proTip: 'Atmospheric refraction varies significantly with temperature gradients. On hot days with a cool sea surface (thermal inversion), the effective horizon can extend 20-30% beyond the geometric calculation. For radio/microwave line-of-sight links, use a k-factor of 4/3 to model effective Earth radius under standard atmosphere.',
    },
    metadata: { version: '1.0.0' },
  },

  // --- 3. Map Scale Distance ---------------------------------------------------
  {
    id: 'map-scale-distance',
    slug: 'map-scale-distance',
    title: 'Map Scale Distance Calculator',
    description: 'Convert a measured distance on a paper or digital map to real-world distance using standard Ordnance Survey and custom map scales.',
    icon: '🗺',
    category: 'science',
    subcategory: 'geography',
    tags: ['map scale', 'distance', 'ordnance survey', 'cartography', 'geography', 'hiking', 'navigation'],
    inputs: [
      { id: 'mapDistanceCm', label: 'Map Distance (cm)', type: 'number', defaultValue: 5, step: 0.1, min: 0, placeholder: 'e.g. 5', helpText: 'Distance measured on the map with a ruler in centimetres.' },
      { id: 'mapScale', label: 'Map Scale', type: 'select', defaultValue: '50000', options: [
        { label: '1:25,000 (OS Explorer)', value: '25000' },
        { label: '1:50,000 (OS Landranger)', value: '50000' },
        { label: '1:100,000', value: '100000' },
        { label: '1:250,000', value: '250000' },
        { label: '1:500,000', value: '500000' },
        { label: 'Custom', value: 'custom' },
      ], helpText: 'Select a standard scale or choose Custom to enter your own.' },
      { id: 'customScale', label: 'Custom Scale Denominator', type: 'number', defaultValue: 50000, min: 1, placeholder: 'e.g. 50000', helpText: 'For 1:X enter X' },
    ],
    formulas: [
      { id: 'scaleUsed', expression: 'mapScale', dependencies: ['mapScale'] },
      { id: 'realDistanceCm', expression: 'mapDistanceCm * scaleUsed', dependencies: ['mapDistanceCm', 'scaleUsed'] },
      { id: 'realDistanceKm', expression: 'realDistanceCm / 100000', dependencies: ['realDistanceCm'] },
      { id: 'realDistanceMiles', expression: 'realDistanceKm * 0.621371', dependencies: ['realDistanceKm'] },
    ],
    outputs: [
      { id: 'realDistanceKmOut', label: 'Real Distance', formulaRef: 'realDistanceKm', precision: 3, suffix: ' km', highlight: true },
      { id: 'realDistanceMilesOut', label: 'Real Distance (miles)', formulaRef: 'realDistanceMiles', precision: 3, suffix: ' miles' },
    ],
    guide: {
      whatIsIt: 'A map scale ratio tells you how many real-world units correspond to one unit on the map. A 1:50,000 map means 1 cm on paper equals 50,000 cm (500 m or 0.5 km) in reality. Ordnance Survey Explorer maps (1:25,000) are ideal for walkers � 4 cm = 1 km. Landranger maps (1:50,000) show 2 cm = 1 km.',
      howToUse: 'Measure the distance between two points on your map with a ruler. Enter that measurement in centimetres, select your map scale (or enter a custom denominator), and the calculator converts it to real-world kilometres and miles.',
      exampleScenario: 'On a 1:50,000 OS Landranger map you measure 7.5 cm between a car park and a summit. Real distance = 7.5 x 50,000 cm = 375,000 cm = 3.75 km (2.33 miles). Allow for terrain � actual walking distance on undulating paths will be greater.',
      proTip: 'For hiking, always add 10-20% to straight-line map distance to account for path meanders and terrain. Use map wheels (opisometers) or digital tools to measure curved paths. Naismith\'s Rule adds 1 hour per 600 m of ascent to walking time � factor elevation change from contour lines.',
    },
    metadata: { version: '1.0.0' },
  },
  // --- 4. Topographic Slope Calculator ----------------------------------------
  {
    id: 'topographic-slope-calculator',
    slug: 'topographic-slope-calculator',
    title: 'Topographic Slope & Grade Calculator',
    description: 'Calculate slope percentage, slope angle in degrees, and grade (rise over run) from elevation change and horizontal distance.',
    icon: '⛰',
    category: 'science',
    subcategory: 'geography',
    tags: ['slope', 'grade', 'elevation', 'topography', 'incline', 'gradient', 'geography', 'hiking', 'civil engineering'],
    inputs: [
      { id: 'elevationChangeMetre', label: 'Elevation Change (m)', type: 'number', defaultValue: 100, placeholder: 'e.g. 100', helpText: 'Vertical rise or fall in metres.' },
      { id: 'horizontalDistanceM', label: 'Horizontal Distance (m)', type: 'number', defaultValue: 500, min: 1, placeholder: 'e.g. 500', helpText: 'Horizontal (plan) distance in metres, not slant distance.' },
    ],
    formulas: [
      { id: 'slopePct', expression: 'elevationChangeMetre / horizontalDistanceM * 100', dependencies: ['elevationChangeMetre', 'horizontalDistanceM'] },
      { id: 'slopeDegrees', expression: '180 / 3.14159 * abs(elevationChangeMetre / horizontalDistanceM)', dependencies: ['elevationChangeMetre', 'horizontalDistanceM'] },
      { id: 'gradeFraction', expression: 'elevationChangeMetre / horizontalDistanceM', dependencies: ['elevationChangeMetre', 'horizontalDistanceM'] },
    ],
    outputs: [
      { id: 'slopePctOut', label: 'Slope Percentage', formulaRef: 'slopePct', precision: 2, suffix: '%', highlight: true },
      { id: 'slopeDegreesOut', label: 'Slope Angle', formulaRef: 'slopeDegrees', precision: 2, suffix: '?' },
      { id: 'gradeFractionOut', label: 'Grade (rise over run)', formulaRef: 'gradeFraction', precision: 4 },
    ],
    guide: {
      whatIsIt: 'Slope is the ratio of vertical rise to horizontal run, expressed as a percentage, decimal fraction, or angle. A 20% slope means for every 100 m horizontal you rise 20 m. In geography and civil engineering, slope percentage is most commonly used; road signs typically show grade percentage.',
      howToUse: 'Enter the elevation change (read from contour lines on a topographic map ? multiply contour interval by the number of lines crossed) and the horizontal distance between those points. The calculator gives slope percentage, angle, and the fractional gradient.',
      exampleScenario: 'A hill rises 100 m over 500 m horizontal distance: slope = 20%, angle = 11.3 degrees, grade = 0.20. A road with an 8% grade rises 8 m per 100 m of horizontal travel ? the maximum for most highways in mountainous terrain.',
      proTip: 'Slopes above 30% are considered steep in hillwalking. Ski runs are graded: green < 25%, blue 25-40%, red 40-60%, black > 60%. In agriculture, slopes > 8% are prone to erosion without terracing. Landslide risk generally increases sharply above 15-20% on unstable soils.',
    },
    metadata: { version: '1.0.0' },
  },

  // --- 5. Barometric Altitude Calculator --------------------------------------
  {
    id: 'barometric-altitude-calculator',
    slug: 'barometric-altitude-calculator',
    title: 'Barometric Pressure to Altitude',
    description: 'Estimate altitude above sea level from atmospheric pressure using the International Standard Atmosphere (ISA) barometric formula.',
    icon: '🌡',
    category: 'science',
    subcategory: 'physics',
    tags: ['barometric', 'altitude', 'pressure', 'atmosphere', 'ISA', 'aviation', 'hiking', 'meteorology'],
    inputs: [
      { id: 'pressureHPa', label: 'Measured Pressure (hPa / mbar)', type: 'number', defaultValue: 1013.25, step: 0.01, min: 0, placeholder: 'e.g. 900', helpText: 'Current atmospheric pressure at your location in hectopascals.' },
      { id: 'seaLevelPressureHPa', label: 'Sea Level Pressure (hPa)', type: 'number', defaultValue: 1013.25, step: 0.01, min: 1, placeholder: 'e.g. 1013.25', helpText: 'Standard: 1013.25 hPa' },
      { id: 'temperatureC', label: 'Temperature (?C)', type: 'number', defaultValue: 15, step: 0.1, placeholder: 'e.g. 15', helpText: 'Local temperature for improved accuracy.' },
    ],
    formulas: [
      { id: 'altitudeM', expression: '44330 * (1 - pow(pressureHPa / seaLevelPressureHPa, 0.190294))', dependencies: ['pressureHPa', 'seaLevelPressureHPa'] },
      { id: 'altitudeFt', expression: 'altitudeM * 3.28084', dependencies: ['altitudeM'] },
    ],
    outputs: [
      { id: 'altitudeMOut', label: 'Altitude (ISA approx)', formulaRef: 'altitudeM', precision: 0, suffix: ' m', highlight: true },
      { id: 'altitudeFtOut', label: 'Altitude (feet)', formulaRef: 'altitudeFt', precision: 0, suffix: ' ft' },
    ],
    guide: {
      whatIsIt: 'The barometric formula uses the relationship between atmospheric pressure and altitude to estimate elevation. The ISA (International Standard Atmosphere) model assumes a standard temperature lapse rate of 6.5 degrees C per 1,000 m. Pressure at sea level is 1013.25 hPa; at 5,500 m it is roughly half that (~540 hPa).',
      howToUse: 'Enter the pressure reading from your barometer, altimeter, or weather station. Enter the current sea-level pressure (available from local weather services or aviation QNH). The result is your estimated altitude above sea level.',
      exampleScenario: 'You measure 900 hPa on a mountain hike with sea-level pressure at 1013.25 hPa: altitude is approximately 1,000 m (3,281 ft). At 800 hPa you would be at approximately 1,949 m ? consistent with a high Alpine pass.',
      proTip: 'Always calibrate your altimeter at a known elevation ? pressure changes with weather, not just altitude. A 1 hPa change equals approximately 8 m of altitude at sea level. In aviation, setting QNH (sea-level pressure) gives altitude above sea level; QFE (aerodrome pressure) gives height above the airfield.',
    },
    metadata: { version: '1.0.0' },
  },

  // --- 6. Coordinate Projection Calculator ------------------------------------
  {
    id: 'coordinate-projection-calculator',
    slug: 'coordinate-projection-calculator',
    title: 'Geocaching Coordinate Projection',
    description: 'Project a new geographic coordinate from a starting point given a bearing and distance ? ideal for geocaching, orienteering and field navigation.',
    icon: '📌',
    category: 'science',
    subcategory: 'geography',
    tags: ['coordinate projection', 'bearing', 'geocaching', 'navigation', 'orienteering', 'latitude', 'longitude', 'gis'],
    inputs: [
      { id: 'startLat', label: 'Start Latitude', type: 'number', defaultValue: 51.5074, step: 0.0001, placeholder: 'e.g. 51.5074' },
      { id: 'startLon', label: 'Start Longitude', type: 'number', defaultValue: -0.1278, step: 0.0001, placeholder: 'e.g. -0.1278' },
      { id: 'bearingDeg', label: 'Bearing (degrees, 0=N)', type: 'number', defaultValue: 90, min: 0, max: 360, step: 0.1, placeholder: 'e.g. 90', helpText: '0 degrees = North, 90 degrees = East, 180 degrees = South, 270 degrees = West.' },
      { id: 'distanceKm', label: 'Distance (km)', type: 'number', defaultValue: 1, step: 0.1, min: 0, placeholder: 'e.g. 1' },
    ],
    formulas: [
      { id: 'R', expression: '6371', dependencies: [] },
      { id: 'latRad', expression: 'startLat * 3.14159 / 180', dependencies: ['startLat'] },
      { id: 'bearRad', expression: 'bearingDeg * 3.14159 / 180', dependencies: ['bearingDeg'] },
      { id: 'd', expression: 'distanceKm / R', dependencies: ['distanceKm', 'R'] },
      { id: 'newLatRad', expression: 'latRad + d * cos(bearRad)', dependencies: ['latRad', 'd', 'bearRad'] },
      { id: 'newLonRad', expression: 'startLon * 3.14159 / 180 + d * sin(bearRad) / cos(latRad)', dependencies: ['startLon', 'd', 'bearRad', 'latRad'] },
      { id: 'newLat', expression: 'newLatRad * 180 / 3.14159', dependencies: ['newLatRad'] },
      { id: 'newLon', expression: 'newLonRad * 180 / 3.14159', dependencies: ['newLonRad'] },
    ],
    outputs: [
      { id: 'newLatOut', label: 'New Latitude', formulaRef: 'newLat', precision: 6, highlight: true },
      { id: 'newLonOut', label: 'New Longitude', formulaRef: 'newLon', precision: 6 },
    ],
    guide: {
      whatIsIt: 'Coordinate projection calculates where you end up if you travel a given distance in a specific compass direction from a known starting point. This planar approximation is accurate to within metres for distances under 50 km and is widely used in geocaching puzzle caches and orienteering.',
      howToUse: 'Enter your starting latitude and longitude in decimal degrees. Enter the bearing in degrees (0 = North, clockwise) and the distance in kilometres. The calculator outputs the projected destination coordinates ready to enter into your GPS device or geocaching app.',
      exampleScenario: 'Start at London (51.5074, -0.1278), travel 5 km due East (90 degrees): you arrive at approximately (51.5074, -0.0549). Travel 5 km North-East (45 degrees): you arrive at approximately (51.5393, -0.0596).',
      proTip: 'For geocaching, bearing is usually given in true north (not magnetic). Always add or subtract local magnetic declination if using a compass. For distances under 1 km, this planar method is accurate to within a few metres. For longer distances or higher accuracy, use the Vincenty formula which accounts for Earth\'s elliptical shape.',
    },
    metadata: { version: '1.0.0' },
  },
  // --- 7. Speed of Sound Calculator -------------------------------------------
  {
    id: 'speed-of-sound-calculator',
    slug: 'speed-of-sound-calculator',
    title: 'Speed of Sound in Various Media',
    description: 'Calculate the speed of sound in air, fresh water, sea water, steel, and concrete based on temperature.',
    icon: '📢',
    category: 'science',
    subcategory: 'physics',
    tags: ['speed of sound', 'acoustics', 'physics', 'temperature', 'medium', 'sound wave', 'mach'],
    inputs: [
      { id: 'temperatureC', label: 'Air Temperature (?C)', type: 'number', defaultValue: 20, step: 0.5, placeholder: 'e.g. 20', helpText: 'Temperature in degrees Celsius (affects air and water speeds).' },
      { id: 'medium', label: 'Medium', type: 'select', defaultValue: 'air', options: [
        { label: 'Air (dry)', value: 'air' },
        { label: 'Fresh Water', value: 'water' },
        { label: 'Sea Water', value: 'seawater' },
        { label: 'Steel', value: 'steel' },
        { label: 'Concrete', value: 'concrete' },
      ], helpText: 'Select the medium for reference. All speeds are shown.' },
    ],
    formulas: [
      { id: 'airSpeed', expression: '331.3 * sqrt(1 + temperatureC / 273.15)', dependencies: ['temperatureC'] },
      { id: 'waterSpeed', expression: '1481 + 4.5 * (temperatureC - 25)', dependencies: ['temperatureC'] },
      { id: 'seaSpeed', expression: '1500 + 4.5 * (temperatureC - 25)', dependencies: ['temperatureC'] },
      { id: 'steelSpeed', expression: '5960', dependencies: [] },
      { id: 'concreteSpeed', expression: '3100', dependencies: [] },
    ],
    outputs: [
      { id: 'airSpeedOut', label: 'Speed in Air', formulaRef: 'airSpeed', precision: 1, suffix: ' m/s (air)', highlight: true },
      { id: 'waterSpeedOut', label: 'Speed in Fresh Water', formulaRef: 'waterSpeed', precision: 0, suffix: ' m/s (fresh water)' },
      { id: 'seaSpeedOut', label: 'Speed in Sea Water', formulaRef: 'seaSpeed', precision: 0, suffix: ' m/s (sea water)' },
    ],
    guide: {
      whatIsIt: 'The speed of sound depends on the medium and temperature. In air, it follows v = 331.3 * sqrt(1 + T/273.15) m/s, giving about 343 m/s at 20 degrees C. In liquids and solids, sound travels much faster because the particles are more tightly packed ? steel transmits sound roughly 17 times faster than air.',
      howToUse: 'Enter the ambient temperature and see the speed of sound across all common media simultaneously. This is useful for calculating time-of-flight delays, designing acoustic systems, or understanding sonar and ultrasound.',
      exampleScenario: 'At 20 degrees C: air is approximately 343 m/s, fresh water approximately 1,481 m/s, sea water approximately 1,500 m/s, steel approximately 5,960 m/s. A lightning bolt 1 km away: sound arrives in 1,000 divided by 343 which is approximately 2.9 seconds.',
      proTip: 'Mach 1 is defined relative to the local speed of sound in air. At sea level and 15 degrees C, Mach 1 is approximately 340 m/s (1,224 km/h). At high altitude where air is colder (-57 degrees C at 35,000 ft), Mach 1 is approximately 295 m/s. For sonar, sea water temperature and salinity both affect sound speed significantly.',
    },
    metadata: { version: '1.0.0' },
  },

  // --- 8. UTM Zone Calculator --------------------------------------------------
  {
    id: 'utm-zone-calculator',
    slug: 'utm-zone-calculator',
    title: 'UTM Zone & Grid Reference Calculator',
    description: 'Determine the UTM (Universal Transverse Mercator) zone number, central meridian, and hemisphere for any geographic coordinate.',
    icon: '🗺',
    category: 'science',
    subcategory: 'geography',
    tags: ['UTM', 'universal transverse mercator', 'grid reference', 'zone', 'projection', 'cartography', 'gis', 'coordinates'],
    inputs: [
      { id: 'longitude', label: 'Longitude (degrees)', type: 'number', defaultValue: 0, min: -180, max: 180, step: 0.0001, placeholder: 'e.g. 0', helpText: 'Decimal degrees, negative for West.' },
      { id: 'latitude', label: 'Latitude (degrees)', type: 'number', defaultValue: 51, min: -90, max: 90, step: 0.0001, placeholder: 'e.g. 51', helpText: 'Decimal degrees, negative for South.' },
    ],
    formulas: [
      { id: 'utmZone', expression: 'floor((longitude + 180) / 6) + 1', dependencies: ['longitude'] },
      { id: 'centralMeridian', expression: '(utmZone - 1) * 6 - 180 + 3', dependencies: ['utmZone'] },
      { id: 'hemisphere', expression: 'latitude >= 0 ? 1 : 0', dependencies: ['latitude'] },
      { id: 'latBand', expression: 'floor((latitude + 80) / 8)', dependencies: ['latitude'] },
    ],
    outputs: [
      { id: 'utmZoneOut', label: 'UTM Zone Number', formulaRef: 'utmZone', precision: 0, highlight: true },
      { id: 'centralMeridianOut', label: 'Central Meridian', formulaRef: 'centralMeridian', precision: 0, suffix: '?' },
      { id: 'hemisphereOut', label: 'Hemisphere (1=North 0=South)', formulaRef: 'hemisphere', precision: 0 },
    ],
    guide: {
      whatIsIt: 'The UTM system divides Earth into 60 vertical zones of 6 degrees longitude each, numbered 1-60 eastward from 180 degrees W. Within each zone, a Transverse Mercator projection gives a flat coordinate system with minimal distortion ? ideal for accurate local mapping. Zones are further divided into latitude bands C-X (excluding I and O).',
      howToUse: 'Enter your decimal latitude and longitude coordinates. The calculator returns your UTM zone number (e.g. Zone 30N for most of the UK), the central meridian of that zone, and the hemisphere. The central meridian has a false easting of 500,000 m in UTM.',
      exampleScenario: 'London (51.5 N, 0.0): UTM Zone = 30, central meridian = -3 degrees, Northern hemisphere. New York (40.7 N, -74.0): UTM Zone = 18, central meridian = -75 degrees, Northern hemisphere. Sydney (-33.9 S, 151.2 E): UTM Zone = 56, Southern hemisphere.',
      proTip: 'UTM is excellent for distance and area calculations within a zone ? coordinates are in metres from the origin. Avoid crossing zone boundaries in calculations; use a single zone extended or switch to a geographic coordinate system. The UK National Grid (OSGB36) is based on a single Transverse Mercator projection centred on 2 degrees W.',
    },
    metadata: { version: '1.0.0' },
  },

  // --- 9. Solar Zenith Angle ---------------------------------------------------
  {
    id: 'solar-zenith-angle',
    slug: 'solar-zenith-angle',
    title: 'Solar Elevation & Day Length Calculator',
    description: 'Calculate the solar elevation angle at local noon and approximate daylight hours for any latitude and day of the year.',
    icon: '☀',
    category: 'science',
    subcategory: 'astronomy',
    tags: ['solar elevation', 'sun angle', 'daylight hours', 'day length', 'astronomy', 'latitude', 'solstice', 'equinox'],
    inputs: [
      { id: 'latitude', label: 'Latitude (degrees)', type: 'number', defaultValue: 45, min: -90, max: 90, step: 0.1, placeholder: 'e.g. 45', helpText: 'Negative for southern hemisphere.' },
      { id: 'dayOfYear', label: 'Day of Year', type: 'number', defaultValue: 172, min: 1, max: 365, step: 1, placeholder: 'e.g. 172', helpText: 'Jan 1 = 1, Jun 21 = 172, Dec 21 = 355' },
    ],
    formulas: [
      { id: 'declination', expression: '23.45 * sin((360 / 365 * (dayOfYear - 81)) * 3.14159 / 180)', dependencies: ['dayOfYear'] },
      { id: 'solarNoonElevation', expression: '90 - abs(latitude) + declination', dependencies: ['latitude', 'declination'] },
      { id: 'cosHourAngle', expression: '-tan(latitude * 3.14159 / 180) * tan(declination * 3.14159 / 180)', dependencies: ['latitude', 'declination'] },
      { id: 'hourAngle', expression: '180 / 3.14159 * abs(cosHourAngle)', dependencies: ['cosHourAngle'] },
      { id: 'dayLightHours', expression: '2 * hourAngle / 15', dependencies: ['hourAngle'] },
    ],
    outputs: [
      { id: 'declinationOut', label: 'Solar Declination', formulaRef: 'declination', precision: 2, suffix: '?' },
      { id: 'solarNoonElevationOut', label: 'Solar Elevation at Noon', formulaRef: 'solarNoonElevation', precision: 1, suffix: '?', highlight: true },
      { id: 'dayLightHoursOut', label: 'Daylight Hours (approx)', formulaRef: 'dayLightHours', precision: 2, suffix: ' hrs' },
    ],
    guide: {
      whatIsIt: 'Solar declination is the angle between the sun\'s rays and Earth\'s equatorial plane, ranging from +23.45 degrees (summer solstice, Jun 21) to -23.45 degrees (winter solstice, Dec 21). This determines the sun\'s maximum elevation at solar noon and the number of daylight hours at any latitude.',
      howToUse: 'Enter your latitude (positive = North) and the day of the year (Day 1 = January 1st). Use 172 for the summer solstice and 355 for the winter solstice. The calculator shows the solar elevation angle at local noon and approximate daylight hours.',
      exampleScenario: 'London (51.5 N) on the summer solstice (Day 172): solar elevation approximately 61.5 degrees, daylight approximately 16.7 hours. On the winter solstice (Day 355): solar elevation approximately 15 degrees, daylight approximately 7.7 hours.',
      proTip: 'Solar panel efficiency depends heavily on elevation angle ? panels at 90 degrees to the sun capture maximum power. Seasonal tilt adjustment (same angle as your latitude plus or minus 15 degrees seasonally) can boost annual yield by 10-15% vs. fixed horizontal mounting.',
    },
    metadata: { version: '1.0.0' },
  },

  // --- 10. Magnetic Declination Estimator -------------------------------------
  {
    id: 'magnetic-declination-calculator',
    slug: 'magnetic-declination-calculator',
    title: 'Magnetic Declination Estimator',
    description: 'Estimate the magnetic declination (difference between true north and magnetic north) for a given location using a simplified model.',
    icon: '🧭',
    category: 'science',
    subcategory: 'geography',
    tags: ['magnetic declination', 'compass', 'navigation', 'true north', 'magnetic north', 'geography', 'orienteering'],
    inputs: [
      { id: 'latitude', label: 'Latitude (degrees)', type: 'number', defaultValue: 51, step: 0.1, placeholder: 'e.g. 51', helpText: 'Negative for southern hemisphere.' },
      { id: 'longitude', label: 'Longitude (degrees)', type: 'number', defaultValue: -0.12, step: 0.1, placeholder: 'e.g. -0.12', helpText: 'Negative for West.' },
      { id: 'year', label: 'Year', type: 'number', defaultValue: 2024, min: 2000, max: 2030, step: 1, placeholder: 'e.g. 2024', helpText: 'Year of observation (secular variation changes declination ~0.1 degrees/year in the UK).' },
    ],
    formulas: [
      { id: 'baseDecl', expression: 'longitude * 0.4 + latitude * 0.1', dependencies: ['longitude', 'latitude'] },
      { id: 'yearAdj', expression: '(year - 2020) * 0.1', dependencies: ['year'] },
      { id: 'estimatedDecl', expression: 'baseDecl + yearAdj', dependencies: ['baseDecl', 'yearAdj'] },
    ],
    outputs: [
      { id: 'estimatedDeclOut', label: 'Estimated Magnetic Declination (approx)', formulaRef: 'estimatedDecl', precision: 1, suffix: '?', highlight: true },
    ],
    guide: {
      whatIsIt: 'Magnetic declination is the angle between geographic true north (the direction to the North Pole) and magnetic north (the direction a compass needle points). It varies by location and changes slowly over time due to shifts in Earth\'s molten core. Positive declination means magnetic north is east of true north; negative means it is west.',
      howToUse: 'Enter your latitude, longitude, and the current year. The result is a simplified estimate of local magnetic declination. For navigation-critical applications, use the NOAA World Magnetic Model (WMM) online calculator for precise values accurate to within 1 degree.',
      exampleScenario: 'London (51 N, -0.12 W) in 2024: estimated declination approximately -1.6 degrees. In practice, the UK Ordnance Survey publishes precise values ? currently around -0.5 to +1 degree depending on location. Western USA has declinations of +12 to +18 degrees East, requiring significant compass correction.',
      proTip: 'This is a simplified approximation. Use NOAA World Magnetic Model for precise values. Positive = east of true north. Always convert between magnetic and true bearings before navigating: Mag to True, add East declination. The UK declination is currently small (~1 degree) but eastern USA and western Canada have large declinations requiring significant correction for accurate compass navigation.',
    },
    metadata: { version: '1.0.0' },
  },

];
