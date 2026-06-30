// ---------------------------------------------------------------------------
// Quantify — Math & Statistics Calculators
// ---------------------------------------------------------------------------
// 14 calculators covering algebra, number theory, statistics, geometry,
// trigonometry, probability, and percentage analysis.
// ---------------------------------------------------------------------------

import type { CalculatorSchema } from '@/types/calculator';

export const mathStatisticsCalculators: CalculatorSchema[] = [
  // =========================================================================
  // 1. Fraction Calculator
  // =========================================================================
  {
    id: 'fraction-calculator',
    slug: 'fraction-calculator',
    title: 'Fraction Calculator',
    description:
      'Perform arithmetic on two fractions — add, subtract, multiply, or divide. Results shown in simplified form.',
    icon: '½',
    category: 'math',
    subcategory: 'algebra',
    tags: ['fraction', 'add fractions', 'divide fractions', 'numerator', 'denominator'],
    inputs: [
      {
        id: 'num1',
        label: 'Numerator (A)',
        type: 'number',
        defaultValue: 1,
        required: true,
      },
      {
        id: 'den1',
        label: 'Denominator (A)',
        type: 'number',
        defaultValue: 2,
        helpText: 'Cannot be zero',
        required: true,
      },
      {
        id: 'operation',
        label: 'Operation',
        type: 'select',
        options: [
          { label: 'Add (+)', value: '0' },
          { label: 'Subtract (−)', value: '1' },
          { label: 'Multiply (×)', value: '2' },
          { label: 'Divide (÷)', value: '3' },
        ],
        defaultValue: '0',
        required: true,
      },
      {
        id: 'num2',
        label: 'Numerator (B)',
        type: 'number',
        defaultValue: 1,
        required: true,
      },
      {
        id: 'den2',
        label: 'Denominator (B)',
        type: 'number',
        defaultValue: 3,
        required: true,
      },
    ],
    formulas: [
      // Cross-multiply numerators for addition/subtraction
      { id: 'addNum', expression: 'num1 * den2 + num2 * den1', dependencies: ['num1', 'den2', 'num2', 'den1'] },
      { id: 'subNum', expression: 'num1 * den2 - num2 * den1', dependencies: ['num1', 'den2', 'num2', 'den1'] },
      { id: 'mulNum', expression: 'num1 * num2',               dependencies: ['num1', 'num2'] },
      { id: 'divNum', expression: 'num1 * den2',               dependencies: ['num1', 'den2'] },
      // Denominators
      { id: 'addDen', expression: 'den1 * den2', dependencies: ['den1', 'den2'] },
      { id: 'mulDen', expression: 'den1 * den2', dependencies: ['den1', 'den2'] },
      { id: 'divDen', expression: 'den1 * num2', dependencies: ['den1', 'num2'] },
      // Select result based on operation
      {
        id: 'resultNum',
        expression:
          'operation == 0 ? addNum : (operation == 1 ? subNum : (operation == 2 ? mulNum : divNum))',
        dependencies: ['operation', 'addNum', 'subNum', 'mulNum', 'divNum'],
      },
      {
        id: 'resultDen',
        expression:
          'operation == 0 ? addDen : (operation == 1 ? addDen : (operation == 2 ? mulDen : divDen))',
        dependencies: ['operation', 'addDen', 'mulDen', 'divDen'],
      },
      // Decimal equivalent
      { id: 'decimal', expression: 'resultNum / resultDen', dependencies: ['resultNum', 'resultDen'] },
    ],
    outputs: [
      { id: 'numOut',     label: 'Result Numerator',   formulaRef: 'resultNum', format: 'number', precision: 0, highlight: true },
      { id: 'denOut',     label: 'Result Denominator', formulaRef: 'resultDen', format: 'number', precision: 0 },
      { id: 'decimalOut', label: 'Decimal Value',       formulaRef: 'decimal',   format: 'number', precision: 6 },
    ],
    guide: {
      whatIsIt:
        'A fraction represents a part of a whole — the numerator (top) divided by the denominator (bottom). This calculator performs the four basic arithmetic operations between two fractions and shows the unsimplified result plus its decimal equivalent.',
      howToUse:
        'Enter the numerator and denominator for fraction A, select your operation, then enter the numerator and denominator for fraction B. The result numerator and denominator appear immediately. To simplify, divide both numbers by their Greatest Common Factor (GCF).',
      exampleScenario:
        'Adding ½ + ⅓: Enter num1=1, den1=2, operation=Add, num2=1, den2=3. The calculator cross-multiplies to give numerator = 1×3 + 1×2 = 5 and denominator = 2×3 = 6, so the result is 5/6 ≈ 0.833333.',
      proTip:
        'The Least Common Denominator (LCD) method gives a simplified result directly: find the LCM of both denominators, scale each numerator accordingly, then add or subtract. After computing, always divide the result fraction by the GCF of its numerator and denominator to get the fully simplified form.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 2. Quadratic Equation Solver
  // =========================================================================
  {
    id: 'quadratic-solver',
    slug: 'quadratic-solver',
    title: 'Quadratic Equation Solver',
    description:
      'Solve ax² + bx + c = 0. Returns both real roots using the quadratic formula. Enter 0 for missing terms.',
    icon: '⬜',
    category: 'math',
    subcategory: 'algebra',
    tags: ['quadratic', 'equation', 'roots', 'discriminant', 'ax2+bx+c'],
    inputs: [
      {
        id: 'a',
        label: 'Coefficient a',
        type: 'number',
        defaultValue: 1,
        helpText: 'Coefficient of x²',
        required: true,
      },
      {
        id: 'b',
        label: 'Coefficient b',
        type: 'number',
        defaultValue: -5,
        helpText: 'Coefficient of x',
        required: true,
      },
      {
        id: 'c',
        label: 'Constant c',
        type: 'number',
        defaultValue: 6,
        helpText: 'Constant term',
        required: true,
      },
    ],
    formulas: [
      // Δ = b² − 4ac
      { id: 'discriminant', expression: 'b * b - 4 * a * c', dependencies: ['a', 'b', 'c'] },
      // x₁ = (−b + √|Δ|) / 2a  (real part when Δ<0)
      {
        id: 'root1',
        expression: 'discriminant >= 0 ? (-b + sqrt(abs(discriminant))) / (2 * a) : -b / (2 * a)',
        dependencies: ['discriminant', 'a', 'b'],
      },
      // x₂ = (−b − √|Δ|) / 2a  (±imaginary part magnitude when Δ<0)
      {
        id: 'root2',
        expression: 'discriminant >= 0 ? (-b - sqrt(abs(discriminant))) / (2 * a) : sqrt(abs(discriminant)) / (2 * a)',
        dependencies: ['discriminant', 'a', 'b'],
      },
      // Vertex x-coordinate = −b / 2a
      { id: 'vertex', expression: '-b / (2 * a)', dependencies: ['a', 'b'] },
    ],
    outputs: [
      { id: 'discOut',   label: 'Discriminant (Δ)',              formulaRef: 'discriminant', format: 'number', precision: 4 },
      { id: 'root1Out',  label: 'Root x₁ (or Real Part)',        formulaRef: 'root1',        format: 'number', precision: 4, highlight: true },
      { id: 'root2Out',  label: 'Root x₂ (or ±Imaginary Part)', formulaRef: 'root2',        format: 'number', precision: 4, highlight: true },
      { id: 'vertexOut', label: 'Vertex x-coordinate',           formulaRef: 'vertex',       format: 'number', precision: 4 },
    ],
    guide: {
      whatIsIt:
        'A quadratic equation is any polynomial of the form ax² + bx + c = 0. The quadratic formula x = (−b ± √(b²−4ac)) / 2a always yields the solutions. The discriminant Δ = b²−4ac determines the nature of the roots: if Δ > 0 there are two distinct real roots, Δ = 0 gives one repeated root, and Δ < 0 means the roots are complex (imaginary).',
      howToUse:
        'Enter coefficients a, b, and c from your equation. If a term is missing (e.g., no x term), enter 0 for b. The calculator returns the discriminant, both roots, and the vertex x-coordinate. When Δ < 0, Root x₁ shows the real part and Root x₂ shows the magnitude of the imaginary part (±imaginary).',
      exampleScenario:
        'For x² − 5x + 6 = 0 (a=1, b=−5, c=6): Δ = 25 − 24 = 1 > 0. Root x₁ = (5 + 1)/2 = 3, Root x₂ = (5 − 1)/2 = 2. The parabola crosses the x-axis at x=2 and x=3.',
      proTip:
        'The vertex form of a quadratic is a(x − h)² + k, where h = −b/2a (the vertex x shown here) and k = c − b²/4a. This form makes it easy to see the minimum/maximum of the parabola. Quadratics appear in projectile motion, economics (profit maximisation), and optics.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 3. Standard Deviation Calculator
  // =========================================================================
  {
    id: 'standard-deviation',
    slug: 'standard-deviation',
    title: 'Standard Deviation Calculator',
    description:
      'Calculate mean, variance, and standard deviation for up to 5 values. Supports both population and sample standard deviation.',
    icon: '📊',
    category: 'math',
    subcategory: 'statistics',
    tags: ['standard deviation', 'variance', 'mean', 'statistics', 'data', 'sample'],
    inputs: [
      { id: 'v1', label: 'Value 1', type: 'number', defaultValue: 10, required: true },
      { id: 'v2', label: 'Value 2', type: 'number', defaultValue: 20, required: true },
      { id: 'v3', label: 'Value 3', type: 'number', defaultValue: 30, required: true },
      { id: 'v4', label: 'Value 4', type: 'number', defaultValue: 40, required: true },
      { id: 'v5', label: 'Value 5', type: 'number', defaultValue: 50, required: true },
      {
        id: 'n',
        label: 'Number of Values',
        type: 'select',
        options: [
          { label: '2', value: '2' },
          { label: '3', value: '3' },
          { label: '4', value: '4' },
          { label: '5', value: '5' },
        ],
        defaultValue: '5',
        required: true,
      },
    ],
    formulas: [
      { id: 'sum',  expression: 'v1 + v2 + v3 + v4 + v5', dependencies: ['v1', 'v2', 'v3', 'v4', 'v5'] },
      { id: 'mean', expression: 'sum / n',                 dependencies: ['sum', 'n'] },
      // Squared deviations
      { id: 'sq1', expression: 'pow(v1 - mean, 2)', dependencies: ['v1', 'mean'] },
      { id: 'sq2', expression: 'pow(v2 - mean, 2)', dependencies: ['v2', 'mean'] },
      { id: 'sq3', expression: 'pow(v3 - mean, 2)', dependencies: ['v3', 'mean'] },
      { id: 'sq4', expression: 'pow(v4 - mean, 2)', dependencies: ['v4', 'mean'] },
      { id: 'sq5', expression: 'pow(v5 - mean, 2)', dependencies: ['v5', 'mean'] },
      { id: 'sumSq', expression: 'sq1 + sq2 + sq3 + sq4 + sq5', dependencies: ['sq1', 'sq2', 'sq3', 'sq4', 'sq5'] },
      // Population: divide by N
      { id: 'populationVariance', expression: 'sumSq / n',       dependencies: ['sumSq', 'n'] },
      // Sample: divide by N−1 (Bessel's correction)
      { id: 'sampleVariance',     expression: 'sumSq / (n - 1)', dependencies: ['sumSq', 'n'] },
      { id: 'populationSD', expression: 'sqrt(populationVariance)', dependencies: ['populationVariance'] },
      { id: 'sampleSD',     expression: 'sqrt(sampleVariance)',     dependencies: ['sampleVariance'] },
    ],
    outputs: [
      { id: 'meanOut',    label: 'Mean (Average)',           formulaRef: 'mean',               format: 'number', precision: 4, highlight: true },
      { id: 'popSDOut',   label: 'Population Std Dev (σ)',   formulaRef: 'populationSD',       format: 'number', precision: 4, highlight: true },
      { id: 'sampSDOut',  label: 'Sample Std Dev (s)',       formulaRef: 'sampleSD',           format: 'number', precision: 4 },
      { id: 'popVarOut',  label: 'Population Variance (σ²)', formulaRef: 'populationVariance', format: 'number', precision: 4 },
      { id: 'sampVarOut', label: 'Sample Variance (s²)',     formulaRef: 'sampleVariance',     format: 'number', precision: 4 },
    ],
    guide: {
      whatIsIt:
        'Standard deviation measures how spread out data values are from the mean. A low standard deviation means values cluster tightly around the mean; a high one means they are widely dispersed. Population SD (σ) is used when you have every member of a group; Sample SD (s) is used when your data is a sample drawn from a larger population — it applies Bessel\'s correction (dividing by n−1) to reduce bias.',
      howToUse:
        'Enter up to 5 data values, then select how many values you are using from the dropdown (this controls which values contribute to the mean). The calculator computes the mean, both variants of variance, and both variants of standard deviation.',
      exampleScenario:
        'Test scores: 10, 20, 30, 40, 50 (n=5). Mean = 30. Squared deviations: 400, 100, 0, 100, 400. Sum of squares = 1000. Population variance = 200, σ = 14.14. Sample variance = 250, s = 15.81.',
      proTip:
        'Use the Empirical Rule (68-95-99.7 Rule) with normally distributed data: ~68% of values fall within ±1σ, ~95% within ±2σ, and ~99.7% within ±3σ. This rule is used extensively in quality control (Six Sigma) and exam grading (bell curves).',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 4. Z-Score Calculator
  // =========================================================================
  {
    id: 'z-score-calculator',
    slug: 'z-score-calculator',
    title: 'Z-Score Calculator',
    description:
      'Calculate the z-score (standard score) for a data point, and estimate its approximate percentile in a normal distribution.',
    icon: '🎯',
    category: 'math',
    subcategory: 'statistics',
    tags: ['z-score', 'standard score', 'normal distribution', 'percentile', 'statistics'],
    inputs: [
      {
        id: 'x',
        label: 'Data Point (x)',
        type: 'number',
        defaultValue: 75,
        placeholder: 'e.g. 75',
        required: true,
      },
      {
        id: 'mu',
        label: 'Population Mean (μ)',
        type: 'number',
        defaultValue: 70,
        placeholder: 'e.g. 70',
        required: true,
      },
      {
        id: 'sigma',
        label: 'Std Deviation (σ)',
        type: 'number',
        defaultValue: 10,
        min: 0.0001,
        placeholder: 'e.g. 10',
        required: true,
      },
    ],
    formulas: [
      // z = (x − μ) / σ
      { id: 'zScore', expression: '(x - mu) / sigma', dependencies: ['x', 'mu', 'sigma'] },
      { id: 'zAbs',   expression: 'abs(zScore)',       dependencies: ['zScore'] },
      // Piecewise CDF approximation using lookup breakpoints
      {
        id: 'percentileApprox',
        expression:
          'zScore > 3.5 ? 99.98 : (zScore > 3 ? 99.87 : (zScore > 2.5 ? 99.38 : (zScore > 2 ? 97.72 : (zScore > 1.5 ? 93.32 : (zScore > 1 ? 84.13 : (zScore > 0.5 ? 69.15 : (zScore > 0 ? 50 + zScore * 19.15 : (zScore > -0.5 ? 50 + zScore * 19.15 : (zScore > -1 ? 15.87 : (zScore > -1.5 ? 6.68 : (zScore > -2 ? 2.28 : 0.13)))))))))))',
        dependencies: ['zScore'],
      },
    ],
    outputs: [
      { id: 'zOut',       label: 'Z-Score',            formulaRef: 'zScore',           format: 'number', precision: 4, highlight: true },
      { id: 'percentOut', label: 'Approx. Percentile', formulaRef: 'percentileApprox', format: 'number', precision: 2, suffix: '%' },
    ],
    guide: {
      whatIsIt:
        'A z-score (or standard score) tells you how many standard deviations a particular value is from the population mean. z = (x − μ) / σ. A z-score of 0 means the value is exactly the mean; z = +1 means one standard deviation above the mean; z = −2 means two below.',
      howToUse:
        'Enter the data point x, the population mean μ, and the standard deviation σ. The z-score is calculated instantly. The percentile estimate uses a piecewise approximation of the standard normal CDF (Φ), telling you approximately what proportion of the population falls below your data point.',
      exampleScenario:
        'A student scores 75 on a test where the class mean is 70 and σ = 10. z = (75 − 70) / 10 = 0.5. This places the student at approximately the 69th percentile — they scored higher than about 69% of the class.',
      proTip:
        'Z-scores are used in finance to detect outliers (e.g., Altman Z-Score for bankruptcy prediction), in manufacturing for quality control, and in academic testing to normalise scores across different exam versions. For precise percentiles, use a standard normal table (z-table) or the NORM.S.DIST function in Excel.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 5. Margin of Error Calculator
  // =========================================================================
  {
    id: 'margin-of-error',
    slug: 'margin-of-error',
    title: 'Margin of Error Calculator',
    description:
      'Calculate the margin of error for a survey or poll given sample size, population proportion, and confidence level.',
    icon: '±',
    category: 'math',
    subcategory: 'statistics',
    tags: ['margin of error', 'confidence interval', 'sample size', 'polling', 'statistics'],
    inputs: [
      {
        id: 'sampleSize',
        label: 'Sample Size (n)',
        type: 'number',
        min: 1,
        defaultValue: 1000,
        placeholder: 'e.g. 1000',
        required: true,
      },
      {
        id: 'proportion',
        label: 'Population Proportion (%)',
        type: 'range',
        min: 1,
        max: 99,
        step: 1,
        defaultValue: 50,
        helpText: '50% gives maximum MOE (conservative)',
      },
      {
        id: 'confidence',
        label: 'Confidence Level',
        type: 'select',
        options: [
          { label: '90% (z=1.645)', value: '1.645' },
          { label: '95% (z=1.96)',  value: '1.96'  },
          { label: '99% (z=2.576)', value: '2.576' },
        ],
        defaultValue: '1.96',
        required: true,
      },
    ],
    formulas: [
      // Convert % to proportion
      { id: 'p',      expression: 'proportion / 100',                                   dependencies: ['proportion'] },
      // MOE = z * sqrt(p(1−p)/n) expressed as a percentage
      { id: 'moe',    expression: 'confidence * sqrt(p * (1 - p) / sampleSize) * 100', dependencies: ['confidence', 'p', 'sampleSize'] },
      { id: 'ciLow',  expression: 'proportion - moe',                                   dependencies: ['proportion', 'moe'] },
      { id: 'ciHigh', expression: 'proportion + moe',                                   dependencies: ['proportion', 'moe'] },
    ],
    outputs: [
      { id: 'moeOut',    label: 'Margin of Error',          formulaRef: 'moe',    format: 'number', precision: 2, suffix: '%', highlight: true },
      { id: 'ciLowOut',  label: 'Confidence Interval Low',  formulaRef: 'ciLow',  format: 'number', precision: 2, suffix: '%' },
      { id: 'ciHighOut', label: 'Confidence Interval High', formulaRef: 'ciHigh', format: 'number', precision: 2, suffix: '%' },
    ],
    guide: {
      whatIsIt:
        'The margin of error (MOE) quantifies the uncertainty in a survey or poll result. It tells you how much the measured proportion could differ from the true population proportion at a given confidence level. For example, a poll showing 52% ± 3% means the true value is likely between 49% and 55% with the chosen confidence.',
      howToUse:
        'Enter your sample size, set the estimated proportion using the slider (use 50% if unknown — it produces the most conservative, widest margin), and select a confidence level. The MOE and confidence interval bounds are displayed instantly.',
      exampleScenario:
        'A national poll of 1,000 people asks about candidate preference. Using p=50%, z=1.96 (95% confidence): MOE = 1.96 × √(0.5 × 0.5 / 1000) = 1.96 × 0.01581 ≈ 3.1%. So if 52% support candidate A, the 95% CI is 48.9% to 55.1%.',
      proTip:
        'To halve the margin of error, you need to quadruple the sample size — it grows with √n. At 50% proportion the MOE is maximised (worst case). Using a known proportion closer to 0% or 100% yields a tighter margin. Most national polls use n ≈ 1,000, giving MOE ≈ ±3% at 95% confidence.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 6. LCM / GCF Calculator
  // =========================================================================
  {
    id: 'lcm-gcf-calculator',
    slug: 'lcm-gcf-calculator',
    title: 'LCM & GCF Calculator',
    description:
      'Find the Least Common Multiple (LCM) and Greatest Common Factor (GCF/GCD) of two integers using the Euclidean algorithm.',
    icon: '🔢',
    category: 'math',
    subcategory: 'number-theory',
    tags: ['lcm', 'gcf', 'gcd', 'least common multiple', 'greatest common factor', 'number theory'],
    inputs: [
      {
        id: 'a',
        label: 'First Number (A)',
        type: 'number',
        defaultValue: 12,
        min: 1,
        step: 1,
        required: true,
      },
      {
        id: 'b',
        label: 'Second Number (B)',
        type: 'number',
        defaultValue: 18,
        min: 1,
        step: 1,
        required: true,
      },
    ],
    formulas: [
      // Product of the two numbers
      { id: 'product', expression: 'a * b', dependencies: ['a', 'b'] },
      // Two-step Euclidean remainder chain: r1 = a mod b, r2 = b mod r1
      { id: 'r1',  expression: 'a - floor(a / b) * b',                         dependencies: ['a', 'b'] },
      { id: 'r2',  expression: 'r1 > 0 ? b - floor(b / r1) * r1 : b',          dependencies: ['b', 'r1'] },
      // GCF: if r1=0 then b; if r2=0 then r1; else min(r1,r2)
      { id: 'gcf', expression: 'r1 == 0 ? b : (r2 == 0 ? r1 : min(r1, r2))',   dependencies: ['r1', 'r2', 'b'] },
      // LCM = (a × b) / GCF
      { id: 'lcm', expression: 'gcf > 0 ? product / gcf : product',             dependencies: ['product', 'gcf'] },
    ],
    outputs: [
      { id: 'gcfOut', label: 'Greatest Common Factor (GCF)', formulaRef: 'gcf', format: 'number', precision: 0, highlight: true },
      { id: 'lcmOut', label: 'Least Common Multiple (LCM)',  formulaRef: 'lcm', format: 'number', precision: 0, highlight: true },
    ],
    guide: {
      whatIsIt:
        'The Greatest Common Factor (GCF), also called the Greatest Common Divisor (GCD), is the largest integer that divides both numbers without a remainder. The Least Common Multiple (LCM) is the smallest positive integer divisible by both numbers. They are related by: LCM(a,b) = (a × b) / GCF(a,b).',
      howToUse:
        'Enter two positive integers. The calculator applies two steps of the Euclidean algorithm (successive remainders) to find the GCF, then derives the LCM from the product relationship. For best results, enter integers between 1 and 10,000.',
      exampleScenario:
        'GCF(12, 18): 18 = 1×12 + 6, then 12 = 2×6 + 0 → GCF = 6. LCM = (12 × 18) / 6 = 36. This means the smallest grid that fits both a 12-unit and 18-unit ruler without gaps is 36 units.',
      proTip:
        'GCF is essential for simplifying fractions (divide numerator and denominator by GCF). LCM is used to find the Lowest Common Denominator (LCD) when adding fractions. In music, LCM determines when two rhythmic patterns align — e.g., a pattern repeating every 3 beats and one every 4 beats sync every 12 beats.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 7. Logarithm Calculator
  // =========================================================================
  {
    id: 'logarithm-calculator',
    slug: 'logarithm-calculator',
    title: 'Logarithm Calculator',
    description:
      'Calculate logarithms in any base — common log (base 10), natural log (base e), binary log (base 2), or any custom base using the change-of-base formula.',
    icon: '㏒',
    category: 'math',
    subcategory: 'algebra',
    tags: ['logarithm', 'log', 'natural log', 'ln', 'log base', 'exponent'],
    inputs: [
      {
        id: 'value',
        label: 'Input Value (x)',
        type: 'number',
        defaultValue: 100,
        min: 0.0001,
        placeholder: 'e.g. 100',
        required: true,
      },
      {
        id: 'base',
        label: 'Logarithm Base',
        type: 'select',
        options: [
          { label: 'Base 10 (common log)', value: '10'      },
          { label: 'Base e (natural log)', value: '2.71828' },
          { label: 'Base 2 (binary log)',  value: '2'       },
          { label: 'Custom',              value: '0'       },
        ],
        defaultValue: '10',
        required: true,
      },
      {
        id: 'customBase',
        label: 'Custom Base',
        type: 'number',
        defaultValue: 3,
        min: 1.0001,
        helpText: 'Used when "Custom" is selected above',
      },
    ],
    formulas: [
      // Resolve effective base (0 signals custom)
      { id: 'effectiveBase', expression: 'base == 0 ? customBase : base', dependencies: ['base', 'customBase'] },
      // Pre-compute all common logs (change-of-base: logₙ(x) = ln(x)/ln(n))
      { id: 'log10val',  expression: 'log(value)',                          dependencies: ['value'] },
      { id: 'lnVal',     expression: 'ln(value)',                           dependencies: ['value'] },
      { id: 'logBase2',  expression: 'ln(value) / ln(2)',                   dependencies: ['value'] },
      { id: 'logCustom', expression: 'ln(value) / ln(effectiveBase)',        dependencies: ['value', 'effectiveBase'] },
      // Select result based on effective base (2.71828 ≈ e)
      {
        id: 'result',
        expression:
          'effectiveBase == 10 ? log10val : (effectiveBase < 2.71829 && effectiveBase > 2.71827 ? lnVal : (effectiveBase == 2 ? logBase2 : logCustom))',
        dependencies: ['effectiveBase', 'log10val', 'lnVal', 'logBase2', 'logCustom'],
      },
    ],
    outputs: [
      { id: 'resultOut', label: 'Logarithm Result', formulaRef: 'result',    format: 'number', precision: 6, highlight: true },
      { id: 'log10Out',  label: 'log₁₀(x)',         formulaRef: 'log10val',  format: 'number', precision: 6 },
      { id: 'lnOut',     label: 'ln(x)',             formulaRef: 'lnVal',    format: 'number', precision: 6 },
      { id: 'log2Out',   label: 'log₂(x)',           formulaRef: 'logBase2', format: 'number', precision: 6 },
    ],
    guide: {
      whatIsIt:
        'A logarithm answers the question: "To what power must the base be raised to get x?" If bⁿ = x, then logᵦ(x) = n. The three most common bases are 10 (common log, used in pH and decibels), e ≈ 2.71828 (natural log, used in calculus and growth models), and 2 (binary log, used in computer science and information theory).',
      howToUse:
        'Enter a positive value for x and select the desired base. Choose "Custom" and fill in the Custom Base field to compute any arbitrary base using the change-of-base formula. All four reference logs (base 10, e, 2, and custom) are shown simultaneously.',
      exampleScenario:
        'log₁₀(100) = 2 because 10² = 100. ln(e³) ≈ 3. log₂(1024) = 10 because 2¹⁰ = 1024 (one kilobyte). For pH: pH = −log₁₀[H⁺], so [H⁺] = 10⁻⁷ gives pH = 7 (neutral).',
      proTip:
        'Key logarithm laws: log(ab) = log(a) + log(b); log(a/b) = log(a) − log(b); log(aⁿ) = n·log(a). Change-of-base formula: logᵦ(x) = ln(x)/ln(b). Logarithms appear in the Richter scale (earthquakes), decibel scale (sound), compound interest formulas, and entropy calculations in information theory.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 8. Trigonometry Calculator
  // =========================================================================
  {
    id: 'trigonometry-calculator',
    slug: 'trigonometry-calculator',
    title: 'Trigonometry Calculator',
    description:
      'Calculate all six trigonometric functions (sin, cos, tan, csc, sec, cot) for any angle in degrees or radians.',
    icon: '📐',
    category: 'math',
    subcategory: 'trigonometry',
    tags: ['trigonometry', 'sin', 'cos', 'tan', 'sine', 'cosine', 'tangent', 'angle'],
    inputs: [
      {
        id: 'angle',
        label: 'Angle',
        type: 'number',
        defaultValue: 45,
        placeholder: 'e.g. 45',
        required: true,
      },
      {
        id: 'unit',
        label: 'Angle Unit',
        type: 'select',
        options: [
          { label: 'Degrees', value: '0' },
          { label: 'Radians', value: '1' },
        ],
        defaultValue: '0',
        required: true,
      },
    ],
    formulas: [
      // Convert input to degrees for the parser's sin/cos/tan (which take degrees)
      // and to radians for display
      { id: 'deg',    expression: 'unit == 0 ? angle : angle * 180 / PI', dependencies: ['angle', 'unit'] },
      { id: 'rad',    expression: 'unit == 0 ? angle * PI / 180 : angle', dependencies: ['angle', 'unit'] },
      // All six trig functions — parser sin/cos/tan accept degrees
      { id: 'sinVal', expression: 'sin(deg)',                                              dependencies: ['deg'] },
      { id: 'cosVal', expression: 'cos(deg)',                                              dependencies: ['deg'] },
      { id: 'tanVal', expression: 'tan(deg)',                                              dependencies: ['deg'] },
      { id: 'cscVal', expression: 'abs(sinVal) > 0.0001 ? 1 / sinVal : 9999',            dependencies: ['sinVal'] },
      { id: 'secVal', expression: 'abs(cosVal) > 0.0001 ? 1 / cosVal : 9999',            dependencies: ['cosVal'] },
      { id: 'cotVal', expression: 'abs(tanVal) > 0.0001 ? 1 / tanVal : 9999',            dependencies: ['tanVal'] },
    ],
    outputs: [
      { id: 'sinOut', label: 'sin(θ)',     formulaRef: 'sinVal', format: 'number', precision: 6, highlight: true },
      { id: 'cosOut', label: 'cos(θ)',     formulaRef: 'cosVal', format: 'number', precision: 6, highlight: true },
      { id: 'tanOut', label: 'tan(θ)',     formulaRef: 'tanVal', format: 'number', precision: 6, highlight: true },
      { id: 'cscOut', label: 'csc(θ)',     formulaRef: 'cscVal', format: 'number', precision: 6 },
      { id: 'secOut', label: 'sec(θ)',     formulaRef: 'secVal', format: 'number', precision: 6 },
      { id: 'cotOut', label: 'cot(θ)',     formulaRef: 'cotVal', format: 'number', precision: 6 },
      { id: 'radOut', label: 'In Radians', formulaRef: 'rad',    format: 'number', precision: 6 },
    ],
    guide: {
      whatIsIt:
        'Trigonometry studies the relationships between angles and sides of triangles. The three primary functions are sine (sin), cosine (cos), and tangent (tan). The three reciprocal functions — cosecant (csc = 1/sin), secant (sec = 1/cos), and cotangent (cot = 1/tan) — complete the six standard trig functions.',
      howToUse:
        'Enter an angle and choose whether it is in degrees or radians. All six trig values are computed simultaneously. Note: values marked 9999 indicate the function is undefined at that angle (e.g., tan(90°) = undefined).',
      exampleScenario:
        'At θ = 45°: sin(45°) = cos(45°) = √2/2 ≈ 0.7071, tan(45°) = 1. This is the famous 45-45-90 triangle where both legs are equal. A ramp rising 1 meter over 1 meter of horizontal run makes a 45° angle.',
      proTip:
        'SOHCAHTOA: Sin = Opposite/Hypotenuse, Cos = Adjacent/Hypotenuse, Tan = Opposite/Adjacent. The unit circle (radius 1) gives sin and cos directly as y and x coordinates. Key values: 0°(0,1), 30°(½,√3/2), 45°(√2/2,√2/2), 60°(√3/2,½), 90°(1,0). Trig functions appear in wave physics, electrical engineering (AC circuits), and navigation.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 9. Random Number Generator (distribution statistics)
  // =========================================================================
  {
    id: 'random-number-generator',
    slug: 'random-number-generator',
    title: 'Random Number Generator',
    description:
      'Generate a random number within a specified range. Shows range width, expected value, and distribution properties of the uniform distribution.',
    icon: '🎲',
    category: 'math',
    subcategory: 'random',
    tags: ['random', 'random number', 'dice', 'lottery', 'generator'],
    inputs: [
      {
        id: 'minVal',
        label: 'Minimum Value',
        type: 'number',
        defaultValue: 1,
        required: true,
      },
      {
        id: 'maxVal',
        label: 'Maximum Value',
        type: 'number',
        defaultValue: 100,
        required: true,
      },
      {
        id: 'integerOnly',
        label: 'Type',
        type: 'select',
        options: [
          { label: 'Integer only',       value: '1' },
          { label: 'Decimal (2 places)', value: '0' },
        ],
        defaultValue: '1',
        required: true,
      },
    ],
    formulas: [
      // Range width
      { id: 'range',         expression: 'maxVal - minVal',       dependencies: ['maxVal', 'minVal'] },
      // Expected value of a uniform distribution = (min + max) / 2
      { id: 'expectedValue', expression: '(minVal + maxVal) / 2', dependencies: ['minVal', 'maxVal'] },
      // Standard deviation of uniform distribution = (max − min) / sqrt(12)
      { id: 'uniformSD',     expression: 'range / sqrt(12)',      dependencies: ['range'] },
      // Total outcomes count (for integer mode)
      { id: 'outcomes',      expression: 'integerOnly == 1 ? floor(range) + 1 : range', dependencies: ['integerOnly', 'range'] },
    ],
    outputs: [
      { id: 'rangeOut',    label: 'Total Range Width',        formulaRef: 'range',         format: 'number', precision: 0 },
      { id: 'expectedOut', label: 'Expected Value (Mean)',    formulaRef: 'expectedValue', format: 'number', precision: 2, highlight: true },
      { id: 'sdOut',       label: 'Std Dev of Distribution', formulaRef: 'uniformSD',     format: 'number', precision: 4 },
      { id: 'outcomesOut', label: 'Total Possible Outcomes', formulaRef: 'outcomes',      format: 'number', precision: 0 },
    ],
    guide: {
      whatIsIt:
        'A random number generator produces values from a uniform distribution — every outcome in the range is equally likely. This calculator shows the statistical properties of your specified range: the expected value (mean), standard deviation, and total number of possible outcomes.',
      howToUse:
        'Set minimum and maximum values and choose integer or decimal mode. The outputs describe the theoretical properties of the uniform distribution over your range. For generating an actual random number, click the refresh/randomise button in the UI (client-side feature) — the formula engine shows distribution statistics.',
      exampleScenario:
        'Rolling a standard six-sided die: min=1, max=6, integer mode. Range=5, expected value=3.5, SD≈1.708, 6 possible outcomes. Each face has a 1/6 ≈ 16.67% probability.',
      proTip:
        'Pseudo-random number generators (PRNGs) used in computers are deterministic — they use a seed value. For cryptographic security, use a hardware RNG or a cryptographically secure PRNG (CSPRNG). When using random numbers for simulations (Monte Carlo methods), larger sample sizes produce more accurate estimates of real-world probabilities.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 10. Area Calculator
  // =========================================================================
  {
    id: 'area-calculator',
    slug: 'area-calculator',
    title: 'Area Calculator',
    description:
      'Calculate the area of common 2D shapes — rectangle, circle, triangle, trapezoid, ellipse, and parallelogram.',
    icon: '📏',
    category: 'math',
    subcategory: 'geometry',
    tags: ['area', 'circle', 'rectangle', 'triangle', 'geometry', 'square', 'trapezoid'],
    inputs: [
      {
        id: 'shape',
        label: 'Shape',
        type: 'select',
        options: [
          { label: 'Rectangle',     value: '0' },
          { label: 'Circle',        value: '1' },
          { label: 'Triangle',      value: '2' },
          { label: 'Trapezoid',     value: '3' },
          { label: 'Ellipse',       value: '4' },
          { label: 'Parallelogram', value: '5' },
        ],
        defaultValue: '0',
        required: true,
      },
      {
        id: 'dim1',
        label: 'Dimension 1 (length / radius / base / semi-axis a)',
        type: 'number',
        defaultValue: 10,
        helpText:
          'Rectangle: Length | Circle: Radius | Triangle: Base | Trapezoid: Base 1 | Ellipse: Semi-axis a | Parallelogram: Base',
        required: true,
      },
      {
        id: 'dim2',
        label: 'Dimension 2 (width / height / semi-axis b)',
        type: 'number',
        defaultValue: 5,
        helpText:
          'Rectangle: Width | Triangle: Height | Trapezoid: Base 2 | Ellipse: Semi-axis b | Parallelogram: Height',
        required: true,
      },
      {
        id: 'dim3',
        label: 'Dimension 3 (Trapezoid Height only)',
        type: 'number',
        defaultValue: 4,
        helpText: 'Only used for Trapezoid (the perpendicular height between the two bases)',
      },
    ],
    formulas: [
      { id: 'rectArea',    expression: 'dim1 * dim2',              dependencies: ['dim1', 'dim2'] },
      { id: 'circArea',    expression: 'PI * pow(dim1, 2)',          dependencies: ['dim1'] },
      { id: 'triArea',     expression: '0.5 * dim1 * dim2',          dependencies: ['dim1', 'dim2'] },
      { id: 'trapArea',    expression: '0.5 * (dim1 + dim2) * dim3', dependencies: ['dim1', 'dim2', 'dim3'] },
      { id: 'ellipseArea', expression: 'PI * dim1 * dim2',           dependencies: ['dim1', 'dim2'] },
      { id: 'paraArea',    expression: 'dim1 * dim2',               dependencies: ['dim1', 'dim2'] },
      {
        id: 'area',
        expression:
          'shape == 0 ? rectArea : (shape == 1 ? circArea : (shape == 2 ? triArea : (shape == 3 ? trapArea : (shape == 4 ? ellipseArea : paraArea))))',
        dependencies: ['shape', 'rectArea', 'circArea', 'triArea', 'trapArea', 'ellipseArea', 'paraArea'],
      },
    ],
    outputs: [
      { id: 'areaOut', label: 'Area', formulaRef: 'area', format: 'number', precision: 4, suffix: ' sq units', highlight: true },
    ],
    guide: {
      whatIsIt:
        'Area is the amount of 2D space enclosed by a shape, measured in square units. Formulas: Rectangle = l × w; Circle = πr²; Triangle = ½ × base × height; Trapezoid = ½ × (b₁ + b₂) × h; Ellipse = π × a × b; Parallelogram = base × height.',
      howToUse:
        'Select your shape, then fill in the required dimensions. Dimension 1 and 2 serve double duty depending on the shape (see help text for each field). Dimension 3 is only used for the Trapezoid (the perpendicular height). Results are in square units — if you measured in metres, the area is in m².',
      exampleScenario:
        'Flooring a rectangular room: 5 m × 4 m = 20 m². Painting a circular feature wall with radius 1.5 m: π × 1.5² ≈ 7.07 m². A triangular garden bed with base 3 m and height 2 m: ½ × 3 × 2 = 3 m².',
      proTip:
        'Always square your units. If dimensions are in centimetres, the area is in cm² (divide by 10,000 for m²). For irregular shapes, break them into simpler components and sum the areas. Heron\'s formula can compute triangle area from three side lengths when the height is unknown.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 11. Volume Calculator
  // =========================================================================
  {
    id: 'volume-calculator',
    slug: 'volume-calculator',
    title: 'Volume Calculator',
    description:
      'Calculate the volume of common 3D shapes — cube, rectangular prism, sphere, cylinder, cone, and pyramid.',
    icon: '📦',
    category: 'math',
    subcategory: 'geometry',
    tags: ['volume', 'cube', 'sphere', 'cylinder', 'cone', 'geometry', '3d'],
    inputs: [
      {
        id: 'shape',
        label: 'Shape',
        type: 'select',
        options: [
          { label: 'Cube',              value: '0' },
          { label: 'Rectangular Prism', value: '1' },
          { label: 'Sphere',            value: '2' },
          { label: 'Cylinder',          value: '3' },
          { label: 'Cone',              value: '4' },
          { label: 'Pyramid',           value: '5' },
        ],
        defaultValue: '1',
        required: true,
      },
      {
        id: 'd1',
        label: 'Dimension 1 (side / length / radius)',
        type: 'number',
        defaultValue: 10,
        helpText:
          'Cube: side length | Prism: length | Sphere: radius | Cylinder/Cone: base radius | Pyramid: base length',
        required: true,
      },
      {
        id: 'd2',
        label: 'Dimension 2 (width — N/A for cube/sphere)',
        type: 'number',
        defaultValue: 5,
        helpText: 'Rectangular Prism: width | Pyramid: base width',
      },
      {
        id: 'd3',
        label: 'Dimension 3 (height — N/A for cube/sphere)',
        type: 'number',
        defaultValue: 8,
        helpText:
          'Rectangular Prism: height | Cylinder: height | Cone: height | Pyramid: height',
      },
    ],
    formulas: [
      { id: 'cubeV',    expression: 'pow(d1, 3)',                     dependencies: ['d1'] },
      { id: 'rectV',    expression: 'd1 * d2 * d3',                   dependencies: ['d1', 'd2', 'd3'] },
      { id: 'sphereV',  expression: '(4 / 3) * PI * pow(d1, 3)',      dependencies: ['d1'] },
      { id: 'cylV',     expression: 'PI * pow(d1, 2) * d3',           dependencies: ['d1', 'd3'] },
      { id: 'coneV',    expression: '(1 / 3) * PI * pow(d1, 2) * d3', dependencies: ['d1', 'd3'] },
      { id: 'pyramidV', expression: '(1 / 3) * d1 * d2 * d3',         dependencies: ['d1', 'd2', 'd3'] },
      {
        id: 'volume',
        expression:
          'shape == 0 ? cubeV : (shape == 1 ? rectV : (shape == 2 ? sphereV : (shape == 3 ? cylV : (shape == 4 ? coneV : pyramidV))))',
        dependencies: ['shape', 'cubeV', 'rectV', 'sphereV', 'cylV', 'coneV', 'pyramidV'],
      },
    ],
    outputs: [
      { id: 'volumeOut', label: 'Volume', formulaRef: 'volume', format: 'number', precision: 4, suffix: ' cubic units', highlight: true },
    ],
    guide: {
      whatIsIt:
        'Volume is the amount of 3D space occupied by a solid, measured in cubic units. Formulas: Cube = s³; Rectangular Prism = l × w × h; Sphere = (4/3)πr³; Cylinder = πr²h; Cone = (1/3)πr²h; Pyramid = (1/3) × base area × h.',
      howToUse:
        'Select a 3D shape, then enter the required dimensions. Dimension 1 is always the primary measurement (side, radius, or length). Dimension 2 and 3 apply only to shapes that require width and height. For Cube and Sphere, only Dimension 1 is used.',
      exampleScenario:
        'A shipping box (rectangular prism) 40 cm × 30 cm × 20 cm = 24,000 cm³ = 24 litres. A basketball with radius 12 cm: (4/3)π × 12³ ≈ 7,238 cm³. An ice cream cone (cone) with radius 3 cm and height 10 cm: (1/3)π × 9 × 10 ≈ 94.2 cm³.',
      proTip:
        'Archimedes discovered that the volume of a sphere equals exactly two-thirds the volume of its circumscribed cylinder (same radius and height = 2r). For packing and shipping, the cone volume is exactly one-third of its enclosing cylinder — hence why "fill it one-third full" advice works for cone-shaped vessels. 1 litre = 1,000 cm³ = 0.001 m³.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 12. Surface Area Calculator
  // =========================================================================
  {
    id: 'surface-area-calculator',
    slug: 'surface-area-calculator',
    title: 'Surface Area Calculator',
    description:
      'Calculate the total surface area of common 3D shapes — cube, rectangular prism, sphere, cylinder, and cone.',
    icon: '🔷',
    category: 'math',
    subcategory: 'geometry',
    tags: ['surface area', 'cube', 'sphere', 'cylinder', 'cone', 'geometry'],
    inputs: [
      {
        id: 'shape',
        label: 'Shape',
        type: 'select',
        options: [
          { label: 'Cube',              value: '0' },
          { label: 'Rectangular Prism', value: '1' },
          { label: 'Sphere',            value: '2' },
          { label: 'Cylinder',          value: '3' },
          { label: 'Cone',              value: '4' },
        ],
        defaultValue: '1',
        required: true,
      },
      {
        id: 'd1',
        label: 'Dimension 1 (side / length / radius)',
        type: 'number',
        defaultValue: 10,
        helpText: 'Cube: side | Prism: length | Sphere: radius | Cylinder/Cone: base radius',
        required: true,
      },
      {
        id: 'd2',
        label: 'Dimension 2 (width — N/A for cube/sphere)',
        type: 'number',
        defaultValue: 5,
        helpText: 'Rectangular Prism: width only',
      },
      {
        id: 'd3',
        label: 'Dimension 3 (height — N/A for cube/sphere)',
        type: 'number',
        defaultValue: 8,
        helpText: 'Rectangular Prism: height | Cylinder: height | Cone: height',
      },
    ],
    formulas: [
      // Cube: 6s²
      { id: 'cubeSA',     expression: '6 * pow(d1, 2)',                      dependencies: ['d1'] },
      // Rectangular prism: 2(lw + wh + lh)
      { id: 'rectSA',     expression: '2 * (d1 * d2 + d2 * d3 + d1 * d3)',  dependencies: ['d1', 'd2', 'd3'] },
      // Sphere: 4πr²
      { id: 'sphereSA',   expression: '4 * PI * pow(d1, 2)',                  dependencies: ['d1'] },
      // Cylinder (total): 2πr(r + h)
      { id: 'cylSA',      expression: '2 * PI * d1 * (d1 + d3)',             dependencies: ['d1', 'd3'] },
      // Cone slant height: l = √(r² + h²)
      { id: 'slantHeight',expression: 'sqrt(pow(d1, 2) + pow(d3, 2))',       dependencies: ['d1', 'd3'] },
      // Cone (total): πr(r + l)
      { id: 'coneSA',     expression: 'PI * d1 * (d1 + slantHeight)',         dependencies: ['d1', 'slantHeight'] },
      {
        id: 'sa',
        expression:
          'shape == 0 ? cubeSA : (shape == 1 ? rectSA : (shape == 2 ? sphereSA : (shape == 3 ? cylSA : coneSA)))',
        dependencies: ['shape', 'cubeSA', 'rectSA', 'sphereSA', 'cylSA', 'coneSA'],
      },
    ],
    outputs: [
      { id: 'saOut', label: 'Surface Area', formulaRef: 'sa', format: 'number', precision: 4, suffix: ' sq units', highlight: true },
    ],
    guide: {
      whatIsIt:
        'Surface area is the total area of all faces (or curved surfaces) of a 3D shape, measured in square units. Formulas: Cube = 6s²; Rectangular Prism = 2(lw + wh + lh); Sphere = 4πr²; Cylinder = 2πr(r + h); Cone = πr(r + l) where l = √(r² + h²) is the slant height.',
      howToUse:
        'Select the 3D shape, enter Dimension 1 (always the primary measurement — side or radius), and fill in Dimension 2 (width) and Dimension 3 (height) where applicable. Only the dimensions needed for the chosen shape affect the result.',
      exampleScenario:
        'Wrapping a gift box (rectangular prism) 30 cm × 20 cm × 10 cm: SA = 2(30×20 + 20×10 + 30×10) = 2(600+200+300) = 2,200 cm². Painting a sphere with radius 5 cm: 4π×25 ≈ 314.16 cm².',
      proTip:
        'Distinguish between Total Surface Area (TSA = all faces) and Lateral Surface Area (LSA = sides only, excluding bases). Cylinder LSA = 2πrh; Cone LSA = πrl. LSA matters when calculating paint for walls (excluding floor/ceiling) or labels on cans. For the cone, the slant height l = √(r² + h²) is crucial — it is the distance along the sloped face, not the vertical height.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 13. Probability Calculator
  // =========================================================================
  {
    id: 'probability-calculator',
    slug: 'probability-calculator',
    title: 'Probability Calculator',
    description:
      'Calculate basic event probability, complementary probability, odds, and the approximate probability of exactly k successes in n binomial trials.',
    icon: '🎯',
    category: 'math',
    subcategory: 'random',
    tags: ['probability', 'binomial', 'bayes', 'chance', 'statistics', 'likelihood'],
    inputs: [
      {
        id: 'successEvents',
        label: 'Favorable Outcomes',
        type: 'number',
        defaultValue: 3,
        min: 0,
        required: true,
      },
      {
        id: 'totalEvents',
        label: 'Total Outcomes',
        type: 'number',
        defaultValue: 10,
        min: 1,
        required: true,
      },
      {
        id: 'trials',
        label: 'Number of Trials (for Binomial)',
        type: 'number',
        defaultValue: 10,
        min: 1,
        helpText: 'For binomial: how many times you repeat the experiment',
        required: true,
      },
      {
        id: 'successes',
        label: 'Target Successes (for Binomial)',
        type: 'number',
        defaultValue: 3,
        min: 0,
        required: true,
      },
    ],
    formulas: [
      // Basic probability p = favorable / total
      { id: 'prob',       expression: 'successEvents / totalEvents',                               dependencies: ['successEvents', 'totalEvents'] },
      { id: 'complement', expression: '1 - prob',                                                  dependencies: ['prob'] },
      { id: 'probPct',    expression: 'prob * 100',                                                dependencies: ['prob'] },
      // Odds against = (total - favorable) / favorable
      { id: 'odds',       expression: 'successEvents > 0 ? (totalEvents - successEvents) / successEvents : 9999', dependencies: ['successEvents', 'totalEvents'] },
      // Binomial sequence probability: p^k × (1−p)^(n−k)
      // Note: full binomial includes C(n,k) coefficient; multiply output by C(n,k) for exact P(X=k)
      { id: 'binomCoeff', expression: 'pow(prob, successes) * pow(1 - prob, trials - successes)',  dependencies: ['prob', 'successes', 'trials'] },
    ],
    outputs: [
      { id: 'probOut',   label: 'Probability',                          formulaRef: 'probPct',    format: 'number', precision: 2, suffix: '%', highlight: true },
      { id: 'compOut',   label: 'Complementary (NOT event)',            formulaRef: 'complement', format: 'number', precision: 4 },
      { id: 'oddsOut',   label: 'Odds Against (X : 1)',                 formulaRef: 'odds',       format: 'number', precision: 2 },
      { id: 'binomOut',  label: 'P(k successes in sequence, n trials)', formulaRef: 'binomCoeff', format: 'number', precision: 6 },
    ],
    guide: {
      whatIsIt:
        'Probability measures the likelihood of an event occurring, expressed between 0 (impossible) and 1 (certain). Basic probability = favorable outcomes ÷ total outcomes. The complement rule states P(not A) = 1 − P(A). Binomial probability models repeated independent trials where each trial has the same probability of success.',
      howToUse:
        'Enter the number of favorable outcomes and total equally-likely outcomes for basic probability. For binomial analysis, set the number of trials (n) and target successes (k). Note: the Binomial output shows pᵏ × (1−p)^(n−k), which is the probability of one specific ordered sequence — multiply by C(n,k) for the full binomial probability.',
      exampleScenario:
        'Rolling a 6-sided die, probability of rolling a 3: favorable=1, total=6 → P=16.67%. Odds against = 5:1. In 10 rolls, what is the ordered probability of exactly 3 sixes: (1/6)³ × (5/6)⁷ ≈ 0.000558. Multiply by C(10,3)=120 to get the true binomial probability ≈ 0.0155 (1.55%).',
      proTip:
        'The complement rule is often the fastest path: instead of calculating the probability of getting at least one success in n trials, calculate 1 − P(zero successes) = 1 − (1−p)ⁿ. For example, the probability of rolling at least one six in 4 rolls = 1 − (5/6)⁴ ≈ 51.8%. Bayes\' theorem lets you update probabilities as new evidence arrives: P(A|B) = P(B|A)·P(A) / P(B).',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 14. Percentage Difference Calculator
  // =========================================================================
  {
    id: 'percentage-difference',
    slug: 'percentage-difference',
    title: 'Percentage Difference Calculator',
    description:
      'Calculate the percentage difference between two values, percentage change, and relative error.',
    icon: '🔢',
    category: 'math',
    subcategory: 'statistics',
    tags: ['percentage difference', 'percent change', 'growth rate', 'comparison'],
    inputs: [
      {
        id: 'value1',
        label: 'Value 1 (Reference)',
        type: 'number',
        defaultValue: 100,
        placeholder: 'e.g. 100',
        required: true,
      },
      {
        id: 'value2',
        label: 'Value 2 (New)',
        type: 'number',
        defaultValue: 125,
        placeholder: 'e.g. 125',
        required: true,
      },
    ],
    formulas: [
      // Absolute difference (directional)
      { id: 'diff',      expression: 'value2 - value1',                       dependencies: ['value1', 'value2'] },
      // Percentage change: (new − old) / |old| × 100 — directional (can be negative)
      { id: 'pctChange', expression: '(value2 - value1) / abs(value1) * 100', dependencies: ['value1', 'value2'] },
      // Average of the two values (denominator for symmetric percentage difference)
      { id: 'avgVal',    expression: '(value1 + value2) / 2',                 dependencies: ['value1', 'value2'] },
      // Symmetric percentage difference: |v1 − v2| / avg × 100 — always positive
      { id: 'pctDiff',   expression: 'abs(value1 - value2) / avgVal * 100',   dependencies: ['value1', 'value2', 'avgVal'] },
    ],
    outputs: [
      { id: 'diffOut',      label: 'Absolute Difference',               formulaRef: 'diff',      format: 'number', precision: 2, highlight: true },
      { id: 'pctChangeOut', label: 'Percentage Change',                 formulaRef: 'pctChange', format: 'number', precision: 2, suffix: '%', highlight: true },
      { id: 'pctDiffOut',   label: 'Percentage Difference (symmetric)', formulaRef: 'pctDiff',   format: 'number', precision: 2, suffix: '%' },
    ],
    guide: {
      whatIsIt:
        'Percentage Change measures how much a value changed relative to a reference (old) value: ((new − old) / |old|) × 100. It is directional — positive means an increase, negative a decrease. Percentage Difference is symmetric — it compares two values without designating either as the reference by using their average as the denominator: |v₁ − v₂| / ((v₁+v₂)/2) × 100.',
      howToUse:
        'Enter Value 1 as the reference (baseline, old value) and Value 2 as the new or comparison value. Percentage Change uses Value 1 as the denominator; Percentage Difference uses the average of both. The Absolute Difference is simply Value 2 − Value 1 (negative if Value 2 is smaller).',
      exampleScenario:
        'A stock price rose from $100 to $125. Absolute diff = +$25. Percentage Change = (125−100)/100 × 100 = +25% (a 25% gain from the reference). Percentage Difference = |100−125|/((100+125)/2) × 100 = 25/112.5 × 100 ≈ 22.22% (neither value is "primary").',
      proTip:
        'Use Percentage Change in finance and business (e.g., revenue growth YoY, price change) where Value 1 is clearly the baseline. Use Percentage Difference in science and experimental contexts where neither value is the "true" reference (e.g., comparing two measurements of the same quantity). For relative error, use |measured − true| / |true| × 100 — this is percentage change where "true" plays the role of Value 1.',
    },
    metadata: { version: '1.0.0' },
  },
];
