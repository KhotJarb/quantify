// ---------------------------------------------------------------------------
// Quantify — Education Calculators
// ---------------------------------------------------------------------------
// Ten calculators covering grade calculations, GPA, student loans, study
// planning, college admission, and reading speed estimation.
// ---------------------------------------------------------------------------

import type { CalculatorSchema } from '@/types/calculator';

export const educationCalculators: CalculatorSchema[] = [
  // =========================================================================
  // 1. Final Grade Calculator
  // =========================================================================
  {
    id: 'final-grade-calculator',
    slug: 'final-grade-calculator',
    title: 'Final Grade Calculator',
    description:
      'Calculate the score you need on your final exam to achieve your target course grade.',
    icon: '📝',
    category: 'education',
    subcategory: 'student-tools',
    tags: ['final exam', 'grade', 'target grade', 'exam score', 'GPA', 'student', 'academic', 'course grade'],
    inputs: [
      {
        id: 'currentGrade',
        label: 'Current Grade (%)',
        type: 'number',
        defaultValue: 85,
        min: 0,
        max: 100,
        step: 0.1,
        placeholder: 'e.g. 85',
        helpText: 'Your current overall grade before the final exam.',
        required: true,
      },
      {
        id: 'weight',
        label: 'Final Exam Weight (%)',
        type: 'number',
        defaultValue: 40,
        min: 0,
        max: 100,
        step: 1,
        placeholder: 'e.g. 40',
        helpText: 'Percentage of the total course grade that the final exam counts for.',
        required: true,
      },
      {
        id: 'targetGrade',
        label: 'Target Grade (%)',
        type: 'number',
        defaultValue: 90,
        min: 0,
        max: 100,
        step: 0.1,
        placeholder: 'e.g. 90',
        helpText: 'The final course grade you want to achieve.',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'neededScore',
        expression: '(targetGrade - currentGrade * (1 - weight / 100)) / (weight / 100)',
        dependencies: ['targetGrade', 'currentGrade', 'weight'],
      },
      {
        id: 'passMark',
        expression: 'neededScore <= 100 ? 1 : 0',
        dependencies: ['neededScore'],
      },
    ],
    outputs: [
      {
        id: 'needed-score',
        label: 'Required Final Exam Score',
        formulaRef: 'neededScore',
        precision: 1,
        suffix: '%',
        highlight: true,
      },
      {
        id: 'pass-mark',
        label: 'Achievable (1 = Yes, 0 = No)',
        formulaRef: 'passMark',
        precision: 0,
      },
    ],
    guide: {
      whatIsIt:
        'The Final Grade Calculator tells you the exact score you need on your final exam to finish a course with your desired grade. It accounts for the relative weight of the final versus your current standing.',
      howToUse:
        'Enter your current grade percentage (everything before the final), the weight the final carries in the course (e.g., 40%), and your target overall grade. The calculator instantly shows the minimum score you need on the exam.',
      exampleScenario:
        'You have an 85% going into finals, the exam is worth 40% of your grade, and you want a 90% overall. You need to score approximately 97.5% on the final — a very high bar but achievable with strong preparation.',
      proTip:
        'If the required score comes out above 100%, your target grade is mathematically impossible. Consider adjusting your target or focusing study energy where extra-credit opportunities exist.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 2. GPA Calculator
  // =========================================================================
  {
    id: 'gpa-calculator',
    slug: 'gpa-calculator',
    title: 'GPA Calculator',
    description:
      'Calculate your Grade Point Average from up to five courses using letter grades and credit hours.',
    icon: '🎓',
    category: 'education',
    subcategory: 'student-tools',
    tags: ['GPA', 'grade point average', 'letter grade', 'credits', 'academic', 'semester', 'cumulative GPA', 'college'],
    inputs: [
      {
        id: 'g1',
        label: 'Course 1 Grade',
        type: 'select',
        defaultValue: '4.0',
        options: [
          { label: 'A+ / 4.0', value: '4.0' },
          { label: 'A / 4.0', value: '4.0' },
          { label: 'A- / 3.7', value: '3.7' },
          { label: 'B+ / 3.3', value: '3.3' },
          { label: 'B / 3.0', value: '3.0' },
          { label: 'B- / 2.7', value: '2.7' },
          { label: 'C+ / 2.3', value: '2.3' },
          { label: 'C / 2.0', value: '2.0' },
          { label: 'D / 1.0', value: '1.0' },
          { label: 'F / 0.0', value: '0.0' },
        ],
      },
      {
        id: 'c1',
        label: 'Course 1 Credits',
        type: 'number',
        defaultValue: 3,
        min: 1,
        max: 6,
        step: 1,
        placeholder: 'e.g. 3',
      },
      {
        id: 'g2',
        label: 'Course 2 Grade',
        type: 'select',
        defaultValue: '3.7',
        options: [
          { label: 'A+ / 4.0', value: '4.0' },
          { label: 'A / 4.0', value: '4.0' },
          { label: 'A- / 3.7', value: '3.7' },
          { label: 'B+ / 3.3', value: '3.3' },
          { label: 'B / 3.0', value: '3.0' },
          { label: 'B- / 2.7', value: '2.7' },
          { label: 'C+ / 2.3', value: '2.3' },
          { label: 'C / 2.0', value: '2.0' },
          { label: 'D / 1.0', value: '1.0' },
          { label: 'F / 0.0', value: '0.0' },
        ],
      },
      {
        id: 'c2',
        label: 'Course 2 Credits',
        type: 'number',
        defaultValue: 3,
        min: 1,
        max: 6,
        step: 1,
        placeholder: 'e.g. 3',
      },
      {
        id: 'g3',
        label: 'Course 3 Grade',
        type: 'select',
        defaultValue: '3.3',
        options: [
          { label: 'A+ / 4.0', value: '4.0' },
          { label: 'A / 4.0', value: '4.0' },
          { label: 'A- / 3.7', value: '3.7' },
          { label: 'B+ / 3.3', value: '3.3' },
          { label: 'B / 3.0', value: '3.0' },
          { label: 'B- / 2.7', value: '2.7' },
          { label: 'C+ / 2.3', value: '2.3' },
          { label: 'C / 2.0', value: '2.0' },
          { label: 'D / 1.0', value: '1.0' },
          { label: 'F / 0.0', value: '0.0' },
        ],
      },
      {
        id: 'c3',
        label: 'Course 3 Credits',
        type: 'number',
        defaultValue: 4,
        min: 1,
        max: 6,
        step: 1,
        placeholder: 'e.g. 4',
      },
      {
        id: 'g4',
        label: 'Course 4 Grade',
        type: 'select',
        defaultValue: '3.0',
        options: [
          { label: 'A+ / 4.0', value: '4.0' },
          { label: 'A / 4.0', value: '4.0' },
          { label: 'A- / 3.7', value: '3.7' },
          { label: 'B+ / 3.3', value: '3.3' },
          { label: 'B / 3.0', value: '3.0' },
          { label: 'B- / 2.7', value: '2.7' },
          { label: 'C+ / 2.3', value: '2.3' },
          { label: 'C / 2.0', value: '2.0' },
          { label: 'D / 1.0', value: '1.0' },
          { label: 'F / 0.0', value: '0.0' },
        ],
      },
      {
        id: 'c4',
        label: 'Course 4 Credits',
        type: 'number',
        defaultValue: 3,
        min: 1,
        max: 6,
        step: 1,
        placeholder: 'e.g. 3',
      },
      {
        id: 'g5',
        label: 'Course 5 Grade',
        type: 'select',
        defaultValue: '2.7',
        options: [
          { label: 'A+ / 4.0', value: '4.0' },
          { label: 'A / 4.0', value: '4.0' },
          { label: 'A- / 3.7', value: '3.7' },
          { label: 'B+ / 3.3', value: '3.3' },
          { label: 'B / 3.0', value: '3.0' },
          { label: 'B- / 2.7', value: '2.7' },
          { label: 'C+ / 2.3', value: '2.3' },
          { label: 'C / 2.0', value: '2.0' },
          { label: 'D / 1.0', value: '1.0' },
          { label: 'F / 0.0', value: '0.0' },
        ],
      },
      {
        id: 'c5',
        label: 'Course 5 Credits',
        type: 'number',
        defaultValue: 2,
        min: 1,
        max: 6,
        step: 1,
        placeholder: 'e.g. 2',
      },
    ],
    formulas: [
      {
        id: 'totalPoints',
        expression: 'g1 * c1 + g2 * c2 + g3 * c3 + g4 * c4 + g5 * c5',
        dependencies: ['g1', 'c1', 'g2', 'c2', 'g3', 'c3', 'g4', 'c4', 'g5', 'c5'],
      },
      {
        id: 'totalCredits',
        expression: 'c1 + c2 + c3 + c4 + c5',
        dependencies: ['c1', 'c2', 'c3', 'c4', 'c5'],
      },
      {
        id: 'gpa',
        expression: 'totalPoints / totalCredits',
        dependencies: ['totalPoints', 'totalCredits'],
      },
    ],
    outputs: [
      {
        id: 'gpa-out',
        label: 'Semester GPA',
        formulaRef: 'gpa',
        precision: 2,
        highlight: true,
      },
      {
        id: 'total-credits-out',
        label: 'Total Credits',
        formulaRef: 'totalCredits',
        precision: 0,
      },
    ],
    guide: {
      whatIsIt:
        'The GPA Calculator computes your Grade Point Average for a semester by weighting each course grade by its credit hours. It follows the standard 4.0 scale used by most US colleges and universities.',
      howToUse:
        'Select the letter grade for each of your courses and enter the credit hours each course carries. The calculator instantly shows your weighted semester GPA and total credits attempted.',
      exampleScenario:
        'You take five courses: A- (3 cr), A- (3 cr), B+ (4 cr), B (3 cr), B- (2 cr). Your weighted GPA would be approximately 3.30 — a solid B+ average.',
      proTip:
        'Higher-credit courses (like labs or major requirements) have more influence on your GPA. A B in a 4-credit course costs you more than a B in a 2-credit elective. Prioritize accordingly.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 3. Test Grade Calculator
  // =========================================================================
  {
    id: 'test-grade-calculator',
    slug: 'test-grade-calculator',
    title: 'Test Grade Calculator',
    description:
      'Convert the number of questions answered correctly into a percentage score, with optional curve points.',
    icon: '✅',
    category: 'education',
    subcategory: 'student-tools',
    tags: ['test grade', 'percentage', 'score', 'curve', 'quiz', 'exam', 'student', 'grading'],
    inputs: [
      {
        id: 'correct',
        label: 'Questions Correct',
        type: 'number',
        defaultValue: 45,
        min: 0,
        step: 1,
        placeholder: 'e.g. 45',
        required: true,
      },
      {
        id: 'total',
        label: 'Total Questions',
        type: 'number',
        defaultValue: 50,
        min: 1,
        step: 1,
        placeholder: 'e.g. 50',
        required: true,
      },
      {
        id: 'curvePoints',
        label: 'Curve Points Added',
        type: 'number',
        defaultValue: 0,
        min: 0,
        max: 50,
        step: 0.5,
        placeholder: 'e.g. 5',
        helpText: 'Extra percentage points added by your teacher as a curve.',
      },
    ],
    formulas: [
      {
        id: 'rawPct',
        expression: 'correct / total * 100',
        dependencies: ['correct', 'total'],
      },
      {
        id: 'finalPct',
        expression: 'min(rawPct + curvePoints, 100)',
        dependencies: ['rawPct', 'curvePoints'],
      },
      {
        id: 'missed',
        expression: 'total - correct',
        dependencies: ['total', 'correct'],
      },
    ],
    outputs: [
      {
        id: 'raw-pct',
        label: 'Raw Score',
        formulaRef: 'rawPct',
        precision: 1,
        suffix: '%',
      },
      {
        id: 'final-pct',
        label: 'Final Score (with curve)',
        formulaRef: 'finalPct',
        precision: 1,
        suffix: '%',
        highlight: true,
      },
      {
        id: 'missed-out',
        label: 'Questions Missed',
        formulaRef: 'missed',
        precision: 0,
      },
    ],
    guide: {
      whatIsIt:
        'The Test Grade Calculator converts a raw number of correct answers into a percentage score, then applies any curve your instructor adds. It also tells you exactly how many questions you missed.',
      howToUse:
        'Enter the number of questions you got right, the total number on the test, and any curve percentage your teacher announced. The calculator shows your raw percentage, curved percentage, and questions missed.',
      exampleScenario:
        'You answer 45 out of 50 questions correctly for a raw score of 90%. Your teacher adds a 3-point curve, bringing your final grade to 93%. You missed 5 questions.',
      proTip:
        'When reviewing a test, focus on question types you missed most rather than individual answers. Identifying patterns (e.g., always missing inference questions) leads to targeted improvement.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 4. Student Loan Payoff Calculator
  // =========================================================================
  {
    id: 'student-loan-payoff',
    slug: 'student-loan-payoff',
    title: 'Student Loan Payoff Calculator',
    description:
      'Find out how many months it takes to pay off your student loan and the total interest you will pay.',
    icon: '💸',
    category: 'education',
    subcategory: 'student-finance',
    tags: ['student loan', 'loan payoff', 'interest', 'monthly payment', 'debt', 'FAFSA', 'college finance', 'repayment'],
    inputs: [
      {
        id: 'balance',
        label: 'Loan Balance',
        type: 'number',
        defaultValue: 25000,
        min: 0,
        step: 500,
        placeholder: 'e.g. 25000',
        helpText: 'Total outstanding principal on your student loan.',
        required: true,
      },
      {
        id: 'rate',
        label: 'Annual Interest Rate (%)',
        type: 'number',
        defaultValue: 5.5,
        min: 0,
        max: 30,
        step: 0.1,
        placeholder: 'e.g. 5.5',
        required: true,
      },
      {
        id: 'monthlyPayment',
        label: 'Monthly Payment',
        type: 'number',
        defaultValue: 300,
        min: 1,
        step: 10,
        placeholder: 'e.g. 300',
        helpText: 'The fixed amount you plan to pay each month.',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'monthlyRate',
        expression: 'rate / 100 / 12',
        dependencies: ['rate'],
      },
      {
        id: 'months',
        expression: '(-ln(1 - balance * monthlyRate / monthlyPayment)) / ln(1 + monthlyRate)',
        dependencies: ['balance', 'monthlyRate', 'monthlyPayment'],
      },
      {
        id: 'totalPaid',
        expression: 'monthlyPayment * months',
        dependencies: ['monthlyPayment', 'months'],
      },
      {
        id: 'totalInterest',
        expression: 'totalPaid - balance',
        dependencies: ['totalPaid', 'balance'],
      },
    ],
    outputs: [
      {
        id: 'months-out',
        label: 'Payoff Period (months)',
        formulaRef: 'months',
        precision: 0,
      },
      {
        id: 'total-paid-out',
        label: 'Total Amount Paid',
        formulaRef: 'totalPaid',
        prefix: '$',
        precision: 2,
        highlight: true,
      },
      {
        id: 'total-interest-out',
        label: 'Total Interest Paid',
        formulaRef: 'totalInterest',
        prefix: '$',
        precision: 2,
      },
    ],
    guide: {
      whatIsIt:
        'The Student Loan Payoff Calculator uses the loan amortisation formula to determine exactly how many months it will take to eliminate your student loan balance — and the total interest cost — given a fixed monthly payment.',
      howToUse:
        'Enter your current loan balance, the annual interest rate on your loan (check your servicer or loan documents), and the monthly payment you plan to make. Results appear instantly.',
      exampleScenario:
        'A $25,000 loan at 5.5% interest with $300/month payments will be paid off in approximately 107 months (about 9 years) with roughly $7,000 in total interest paid.',
      proTip:
        'Even paying an extra $50 per month on a $25,000 loan at 5.5% can save you over $1,000 in interest and shave more than a year off repayment. Look into income-driven repayment plans if payments feel unmanageable.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 5. Essay Word Count to Pages
  // =========================================================================
  {
    id: 'word-count-to-pages',
    slug: 'word-count-to-pages',
    title: 'Essay Word Count to Pages',
    description:
      'Estimate how many pages a given word count fills based on spacing and font size.',
    icon: '📄',
    category: 'education',
    subcategory: 'student-tools',
    tags: ['word count', 'pages', 'essay', 'academic writing', 'spacing', 'font size', 'double spaced', 'page length'],
    inputs: [
      {
        id: 'words',
        label: 'Word Count',
        type: 'number',
        defaultValue: 1000,
        min: 1,
        step: 100,
        placeholder: 'e.g. 1000',
        required: true,
      },
      {
        id: 'spacing',
        label: 'Line Spacing',
        type: 'select',
        defaultValue: '500',
        options: [
          { label: 'Double Spaced', value: '500' },
          { label: 'Single Spaced', value: '250' },
          { label: '1.5 Spaced', value: '375' },
        ],
        helpText: 'Words per page varies by spacing. Double-spaced is the academic standard.',
      },
      {
        id: 'fontSize',
        label: 'Font Size',
        type: 'select',
        defaultValue: '1',
        options: [
          { label: '12pt (standard)', value: '1' },
          { label: '11pt', value: '1.1' },
          { label: '10pt', value: '1.2' },
        ],
      },
    ],
    formulas: [
      {
        id: 'pages',
        expression: 'words / spacing * fontSize',
        dependencies: ['words', 'spacing', 'fontSize'],
      },
    ],
    outputs: [
      {
        id: 'pages-out',
        label: 'Estimated Pages',
        formulaRef: 'pages',
        precision: 1,
        suffix: ' pages',
        highlight: true,
      },
    ],
    guide: {
      whatIsIt:
        "This calculator estimates the number of pages a given word count will fill, based on your chosen line spacing and font size. It uses typical words-per-page benchmarks from standard academic formatting (Times New Roman / Arial, 1-inch margins).",
      howToUse:
        'Enter your total word count, select your line spacing (most college essays require double-spacing), and choose your font size. The result shows the approximate number of pages your essay will occupy.',
      exampleScenario:
        'A 1,000-word essay in 12pt double-spaced format fills approximately 2 pages. The same essay single-spaced would fit in about 1 page. At 11pt double-spaced it comes out to roughly 2.2 pages.',
      proTip:
        "Always check your professor's formatting requirements. If they specify '5 pages double-spaced 12pt Times New Roman,' that translates to approximately 1,250 words. Working backwards from page requirements helps you plan the essay length.",
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 6. Study Hours Planner
  // =========================================================================
  {
    id: 'study-hours-calculator',
    slug: 'study-hours-calculator',
    title: 'Study Hours Planner',
    description:
      'Calculate the recommended weekly study hours based on your credit load, difficulty, and time until exams.',
    icon: '⏱️',
    category: 'education',
    subcategory: 'study-planning',
    tags: ['study hours', 'time management', 'credit hours', 'exam prep', 'study schedule', 'academic planning', 'student productivity'],
    inputs: [
      {
        id: 'credits',
        label: 'Total Credit Hours',
        type: 'number',
        defaultValue: 15,
        min: 1,
        max: 25,
        step: 1,
        placeholder: 'e.g. 15',
        helpText: 'Total credit hours you are enrolled in this semester.',
        required: true,
      },
      {
        id: 'examWeeks',
        label: 'Weeks Until Exam',
        type: 'number',
        defaultValue: 1,
        min: 1,
        max: 20,
        step: 1,
        placeholder: 'e.g. 2',
        required: true,
      },
      {
        id: 'difficultyFactor',
        label: 'Course Difficulty',
        type: 'select',
        defaultValue: '2',
        options: [
          { label: 'Easy (1.5x)', value: '1.5' },
          { label: 'Average (2x)', value: '2' },
          { label: 'Hard (3x)', value: '3' },
        ],
        helpText: 'The Carnegie Unit recommends 2-3 hours of study per credit hour per week.',
      },
    ],
    formulas: [
      {
        id: 'weeklyStudyHours',
        expression: 'credits * difficultyFactor',
        dependencies: ['credits', 'difficultyFactor'],
      },
      {
        id: 'hoursPerDay',
        expression: 'weeklyStudyHours / 7',
        dependencies: ['weeklyStudyHours'],
      },
      {
        id: 'totalHoursNeeded',
        expression: 'weeklyStudyHours * examWeeks',
        dependencies: ['weeklyStudyHours', 'examWeeks'],
      },
    ],
    outputs: [
      {
        id: 'weekly-study-hours',
        label: 'Weekly Study Hours',
        formulaRef: 'weeklyStudyHours',
        suffix: ' hrs/week',
        precision: 1,
        highlight: true,
      },
      {
        id: 'hours-per-day',
        label: 'Daily Study Hours',
        formulaRef: 'hoursPerDay',
        suffix: ' hrs/day',
        precision: 1,
      },
      {
        id: 'total-hours-needed',
        label: 'Total Hours Until Exam',
        formulaRef: 'totalHoursNeeded',
        precision: 0,
      },
    ],
    guide: {
      whatIsIt:
        'The Study Hours Planner uses the Carnegie Unit principle — which recommends 2-3 hours of out-of-class study per credit hour per week — to estimate how many hours you should study each week and each day to be well-prepared.',
      howToUse:
        'Enter your total credit hours for the semester, select how difficult your courses are on average, and specify how many weeks you have until your exams. The planner gives you a weekly, daily, and total hour target.',
      exampleScenario:
        'A student with 15 credit hours of average-difficulty courses should plan on 30 hours of studying per week — about 4.3 hours per day. With 2 weeks until finals, they need 60 total study hours.',
      proTip:
        'Spread study sessions across multiple days rather than cramming. Research shows that spaced repetition — reviewing material at increasing intervals — is far more effective for long-term retention than marathon single-day sessions.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 7. College Admission Probability
  // =========================================================================
  {
    id: 'college-admission-probability',
    slug: 'college-admission-probability',
    title: 'College Admission Probability',
    description:
      'Estimate your college admission probability score based on GPA, SAT, extracurriculars, and essay quality.',
    icon: '🏫',
    category: 'education',
    subcategory: 'student-tools',
    tags: ['college admission', 'GPA', 'SAT', 'extracurriculars', 'essay', 'college application', 'acceptance rate', 'probability'],
    inputs: [
      {
        id: 'gpa',
        label: 'GPA (4.0 scale)',
        type: 'number',
        defaultValue: 3.5,
        min: 0,
        max: 4,
        step: 0.1,
        placeholder: 'e.g. 3.5',
        required: true,
      },
      {
        id: 'sat',
        label: 'SAT Score',
        type: 'number',
        defaultValue: 1200,
        min: 400,
        max: 1600,
        step: 10,
        placeholder: 'e.g. 1200',
        helpText: 'Combined SAT score out of 1600. Use ACT-to-SAT conversion if needed.',
        required: true,
      },
      {
        id: 'extracurriculars',
        label: 'Extracurricular Strength (1-5)',
        type: 'range',
        defaultValue: 3,
        min: 1,
        max: 5,
        step: 1,
        helpText: '1 = minimal activities, 5 = national-level leadership / awards.',
      },
      {
        id: 'essayScore',
        label: 'Essay Quality (1-5)',
        type: 'range',
        defaultValue: 3,
        min: 1,
        max: 5,
        step: 1,
        helpText: '1 = generic / weak, 5 = unique, compelling, and polished.',
      },
    ],
    formulas: [
      {
        id: 'gpaScore',
        expression: 'gpa / 4 * 40',
        dependencies: ['gpa'],
      },
      {
        id: 'satScore',
        expression: '(sat - 400) / 1200 * 35',
        dependencies: ['sat'],
      },
      {
        id: 'extraScore',
        expression: 'extracurriculars / 5 * 15',
        dependencies: ['extracurriculars'],
      },
      {
        id: 'essayScoreVal',
        expression: 'essayScore / 5 * 10',
        dependencies: ['essayScore'],
      },
      {
        id: 'totalScore',
        expression: 'gpaScore + satScore + extraScore + essayScoreVal',
        dependencies: ['gpaScore', 'satScore', 'extraScore', 'essayScoreVal'],
      },
    ],
    outputs: [
      {
        id: 'admission-score',
        label: 'Admission Probability Score',
        formulaRef: 'totalScore',
        suffix: '%',
        precision: 0,
        highlight: true,
      },
    ],
    guide: {
      whatIsIt:
        'This calculator provides a weighted probability score (0-100) that reflects how competitive your college application is. It weights GPA most heavily (40 pts), followed by SAT (35 pts), extracurriculars (15 pts), and essay quality (10 pts).',
      howToUse:
        'Enter your GPA on a 4.0 scale, your SAT score (out of 1600), and use the sliders to rate the strength of your extracurricular activities and personal essay. The result is a composite score, not a literal acceptance percentage.',
      exampleScenario:
        'A student with a 3.8 GPA, 1350 SAT, strong extracurriculars (4/5), and a good essay (4/5) would score approximately 80 out of 100 — highly competitive for many selective schools.',
      proTip:
        'GPA accounts for 40% of this score. A 4.0 GPA with a mediocre SAT outperforms a perfect SAT with a 3.0 GPA. Focus on maintaining grades first, then standardised test prep.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 8. Pomodoro Cycle Calculator
  // =========================================================================
  {
    id: 'pomodoro-cycle-calculator',
    slug: 'pomodoro-cycle-calculator',
    title: 'Pomodoro Cycle Calculator',
    description:
      'Plan your Pomodoro study sessions and breaks for any study block length.',
    icon: '🍅',
    category: 'education',
    subcategory: 'study-planning',
    tags: ['pomodoro', 'study technique', 'focus', 'time management', 'breaks', 'productivity', 'study sessions', 'deep work'],
    inputs: [
      {
        id: 'totalMinutes',
        label: 'Study Block (minutes)',
        type: 'number',
        defaultValue: 120,
        min: 10,
        max: 480,
        step: 5,
        placeholder: 'e.g. 120',
        helpText: 'Total available time for your study session in minutes.',
        required: true,
      },
      {
        id: 'pomodoroLength',
        label: 'Pomodoro Length',
        type: 'select',
        defaultValue: '25',
        options: [
          { label: '25 min (classic)', value: '25' },
          { label: '50 min (extended)', value: '50' },
          { label: '90 min (deep work)', value: '90' },
        ],
      },
      {
        id: 'shortBreak',
        label: 'Short Break (min)',
        type: 'number',
        defaultValue: 5,
        min: 1,
        max: 30,
        step: 1,
        placeholder: 'e.g. 5',
      },
      {
        id: 'longBreak',
        label: 'Long Break (min, after 4 sessions)',
        type: 'number',
        defaultValue: 15,
        min: 5,
        max: 60,
        step: 5,
        placeholder: 'e.g. 15',
      },
    ],
    formulas: [
      {
        id: 'cycleLength',
        expression: 'pomodoroLength + shortBreak',
        dependencies: ['pomodoroLength', 'shortBreak'],
      },
      {
        id: 'completeSessions',
        expression: 'floor(totalMinutes / cycleLength)',
        dependencies: ['totalMinutes', 'cycleLength'],
      },
      {
        id: 'longBreaks',
        expression: 'floor(completeSessions / 4)',
        dependencies: ['completeSessions'],
      },
      {
        id: 'actualWorkTime',
        expression: 'completeSessions * pomodoroLength',
        dependencies: ['completeSessions', 'pomodoroLength'],
      },
      {
        id: 'totalBreakTime',
        expression: 'completeSessions * shortBreak + longBreaks * (longBreak - shortBreak)',
        dependencies: ['completeSessions', 'shortBreak', 'longBreaks', 'longBreak'],
      },
    ],
    outputs: [
      {
        id: 'complete-sessions',
        label: 'Pomodoro Sessions',
        formulaRef: 'completeSessions',
        precision: 0,
        highlight: true,
      },
      {
        id: 'actual-work-time',
        label: 'Focused Work Time',
        formulaRef: 'actualWorkTime',
        suffix: ' min work',
        precision: 0,
      },
      {
        id: 'total-break-time',
        label: 'Total Break Time',
        formulaRef: 'totalBreakTime',
        suffix: ' min breaks',
        precision: 0,
      },
    ],
    guide: {
      whatIsIt:
        "The Pomodoro Cycle Calculator tells you exactly how many focused work sessions (Pomodoros) you can fit into a given time block, along with the total focused work time and break time. It is based on the Pomodoro Technique developed by Francesco Cirillo.",
      howToUse:
        'Enter your total available study time in minutes, choose your preferred Pomodoro length, and set your short and long break durations. The calculator shows how many complete sessions you can do and how your time splits between work and breaks.',
      exampleScenario:
        'With a 2-hour (120-minute) block using classic 25-minute Pomodoros and 5-minute breaks, you can fit 4 complete sessions — 100 minutes of focused work and 20 minutes of breaks.',
      proTip:
        "After every 4 Pomodoros, take a longer 15-30 minute break. This aligns with the brain's ultradian rhythm, which cycles every 90-120 minutes. Using the 90-minute Pomodoro option essentially does one full ultradian cycle per session.",
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 9. Extracurricular Hours Calculator
  // =========================================================================
  {
    id: 'extracurricular-hours-calculator',
    slug: 'extracurricular-hours-calculator',
    title: 'Extracurricular Hours Calculator',
    description:
      'Track total extracurricular time annually and over four years for college applications and time management.',
    icon: '🏅',
    category: 'education',
    subcategory: 'study-planning',
    tags: ['extracurricular', 'activities', 'college application', 'time tracking', 'hours', 'sports', 'clubs', 'leadership'],
    inputs: [
      {
        id: 'hoursPerWeek',
        label: 'Total Hours Per Week (all activities)',
        type: 'number',
        defaultValue: 8,
        min: 0,
        max: 60,
        step: 0.5,
        placeholder: 'e.g. 8',
        required: true,
      },
      {
        id: 'weeksPerSeason',
        label: 'Active Weeks Per Year',
        type: 'number',
        defaultValue: 12,
        min: 1,
        max: 52,
        step: 1,
        placeholder: 'e.g. 36',
        helpText: 'How many weeks per year you participate (e.g., 36 for a school year).',
        required: true,
      },
      {
        id: 'numActivities',
        label: 'Number of Activities',
        type: 'number',
        defaultValue: 3,
        min: 1,
        max: 20,
        step: 1,
        placeholder: 'e.g. 3',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'hoursPerActivity',
        expression: 'hoursPerWeek / numActivities',
        dependencies: ['hoursPerWeek', 'numActivities'],
      },
      {
        id: 'annualHours',
        expression: 'hoursPerWeek * weeksPerSeason',
        dependencies: ['hoursPerWeek', 'weeksPerSeason'],
      },
      {
        id: 'fourYearTotal',
        expression: 'annualHours * 4',
        dependencies: ['annualHours'],
      },
    ],
    outputs: [
      {
        id: 'hours-per-activity',
        label: 'Hours/Week per Activity',
        formulaRef: 'hoursPerActivity',
        precision: 1,
      },
      {
        id: 'annual-hours',
        label: 'Annual Hours',
        formulaRef: 'annualHours',
        precision: 0,
      },
      {
        id: 'four-year-total',
        label: '4-Year Total Hours',
        formulaRef: 'fourYearTotal',
        precision: 0,
        highlight: true,
      },
    ],
    guide: {
      whatIsIt:
        'This calculator helps students quantify their extracurricular commitment in concrete hours — useful for college applications, resumes, and time-management planning.',
      howToUse:
        'Enter your total weekly hours across all activities, how many weeks per year you are active (e.g., 36 weeks for a school year), and the number of separate activities. The calculator shows time per activity, annual commitment, and a four-year projection.',
      exampleScenario:
        'A student doing 8 hours/week across 3 activities for 36 weeks per year commits 288 hours per year and 1,152 hours over four years — averaging about 2.7 hours per activity per week.',
      proTip:
        'College admissions prefer depth over breadth. 10 hours/week in one activity shows leadership and commitment more powerfully than 1 hour spread across 10 clubs. Use this calculator to identify your primary commitment and build a narrative around it.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 10. Reading Speed to Finish Book
  // =========================================================================
  {
    id: 'reading-speed-book-time',
    slug: 'reading-speed-book-time',
    title: 'Reading Speed to Finish Book',
    description:
      'Calculate how long it will take to finish a book based on your reading speed and daily reading time.',
    icon: '📚',
    category: 'education',
    subcategory: 'study-planning',
    tags: ['reading speed', 'WPM', 'book', 'reading time', 'speed reading', 'study', 'literature', 'pages per hour'],
    inputs: [
      {
        id: 'wordCount',
        label: 'Book Word Count',
        type: 'number',
        defaultValue: 80000,
        min: 1000,
        max: 1000000,
        step: 1000,
        placeholder: 'e.g. 80000',
        helpText: 'Average novel: ~80,000 words. Short non-fiction: ~50,000 words.',
        required: true,
      },
      {
        id: 'wpm',
        label: 'Your Reading Speed (WPM)',
        type: 'number',
        defaultValue: 250,
        min: 50,
        max: 2000,
        step: 10,
        placeholder: 'e.g. 250',
        helpText: 'Average adult reads 200-300 WPM. Speed readers can reach 600+ WPM.',
        required: true,
      },
      {
        id: 'dailyMinutes',
        label: 'Daily Reading Time (min)',
        type: 'number',
        defaultValue: 30,
        min: 1,
        max: 480,
        step: 5,
        placeholder: 'e.g. 30',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'totalMinutes',
        expression: 'wordCount / wpm',
        dependencies: ['wordCount', 'wpm'],
      },
      {
        id: 'hoursTotal',
        expression: 'totalMinutes / 60',
        dependencies: ['totalMinutes'],
      },
      {
        id: 'daysToFinish',
        expression: 'ceil(totalMinutes / dailyMinutes)',
        dependencies: ['totalMinutes', 'dailyMinutes'],
      },
    ],
    outputs: [
      {
        id: 'hours-total',
        label: 'Total Reading Hours',
        formulaRef: 'hoursTotal',
        precision: 1,
        highlight: true,
      },
      {
        id: 'days-to-finish',
        label: 'Days to Finish',
        formulaRef: 'daysToFinish',
        precision: 0,
      },
      {
        id: 'total-minutes',
        label: 'Total Minutes',
        formulaRef: 'totalMinutes',
        precision: 0,
      },
    ],
    guide: {
      whatIsIt:
        'The Reading Speed to Finish Book calculator estimates how many days it will take to complete a book based on your words-per-minute reading speed and your daily reading habit.',
      howToUse:
        'Enter the word count of the book (check Goodreads or Wikipedia for most books), your estimated reading speed in words per minute (WPM), and how many minutes you read per day. The calculator shows total hours needed and days to finish.',
      exampleScenario:
        'An 80,000-word novel read at 250 WPM takes 320 minutes (5.3 hours) to read. If you read 30 minutes per day, you will finish in about 11 days. Bump daily reading to 60 minutes and you finish in under a week.',
      proTip:
        'Not sure of your WPM? Read any passage for exactly one minute and count the words. Most adults fall in the 200-300 range. Reading speed improves significantly with practice — even 10 extra WPM saves noticeable time over a long book.',
    },
    metadata: { version: '1.0.0' },
  },
];
