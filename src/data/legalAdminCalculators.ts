// ---------------------------------------------------------------------------
// Quantify � Legal & Admin Calculators
// ---------------------------------------------------------------------------
// 8 calculators covering contingency fees, severance, tax, duties, and more.
// DISCLAIMER: All calculators are for informational/educational purposes only.
// Not legal advice. Consult a qualified attorney for your specific situation.
// ---------------------------------------------------------------------------

import type { CalculatorSchema } from '@/types/calculator';

export const legalAdminCalculators: CalculatorSchema[] = [
  // =========================================================================
  // 1. Contingency Fee Calculator
  // =========================================================================
  {
    id: 'contingency-fee-calculator',
    slug: 'contingency-fee-calculator',
    title: 'Legal Contingency Fee Calculator',
    description:
      'Calculate the attorney contingency fee and net settlement amount after legal fees and case expenses. For informational purposes only.',
    icon: '⚖',
    category: 'legal',
    subcategory: 'family-law',
    tags: ['contingency', 'attorney fee', 'settlement', 'legal', 'lawsuit', 'net payout'],
    inputs: [
      {
        id: 'settlementAmount',
        label: 'Settlement Amount ($)',
        type: 'number',
        defaultValue: 100000,
        min: 0,
        step: 1000,
        placeholder: 'e.g. 100000',
        helpText: 'The total settlement or award amount agreed upon.',
        required: true,
      },
      {
        id: 'contingencyPct',
        label: 'Attorney Contingency % (e.g. 33)',
        type: 'number',
        defaultValue: 33,
        min: 0,
        max: 60,
        step: 0.5,
        placeholder: 'e.g. 33',
        helpText: 'The percentage your attorney takes from the settlement. Typical range: 25%-40%.',
        required: true,
      },
      {
        id: 'caseExpenses',
        label: 'Case Expenses ($)',
        type: 'number',
        defaultValue: 5000,
        min: 0,
        step: 100,
        placeholder: 'e.g. 5000',
        helpText: 'Out-of-pocket costs such as filing fees, expert witnesses, and investigation.',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'attorneyFee',
        expression: 'settlementAmount * contingencyPct / 100',
        dependencies: ['settlementAmount', 'contingencyPct'],
      },
      {
        id: 'netToClient',
        expression: 'settlementAmount - attorneyFee - caseExpenses',
        dependencies: ['settlementAmount', 'attorneyFee', 'caseExpenses'],
      },
    ],
    outputs: [
      {
        id: 'attorneyFee',
        label: "Attorney's Fee",
        formulaRef: 'attorneyFee',
        prefix: '$',
        precision: 0,
      },
      {
        id: 'netToClient',
        label: 'Net Settlement to Client',
        formulaRef: 'netToClient',
        prefix: '$',
        precision: 0,
        highlight: true,
      },
      {
        id: 'caseExpenses',
        label: 'Case Expenses',
        formulaRef: 'caseExpenses',
        prefix: '$',
        precision: 0,
      },
    ],
    guide: {
      whatIsIt:
        'For informational/educational purposes only. Not legal advice. Consult a qualified attorney for your situation. A contingency fee arrangement means your attorney only gets paid if you win. The fee is a percentage of your settlement or award, plus any case expenses incurred.',
      howToUse:
        'Enter your expected or final settlement amount, the agreed contingency percentage (usually 33%-40%), and any case expenses your attorney will deduct. The calculator shows how much goes to your lawyer and how much you keep.',
      exampleScenario:
        'Sarah wins a personal injury case settled for $100,000. Her attorney charges 33% plus $5,000 in expenses. Attorney fee = $33,000; case expenses = $5,000; Sarah nets $62,000.',
      proTip:
        'Contingency fees are often negotiable before you sign. Some attorneys offer lower percentages for straightforward cases or charge higher rates if the case goes to trial. Always read the fee agreement carefully.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 2. Pro Rata Salary & Leave Calculator
  // =========================================================================
  {
    id: 'pro-rata-salary-calculator',
    slug: 'pro-rata-salary-calculator',
    title: 'Pro Rata Salary & Leave Calculator',
    description:
      'Calculate the proportional salary earned for a partial work period based on days worked versus total working days.',
    icon: '📅',
    category: 'hr',
    subcategory: 'payroll',
    tags: ['pro rata', 'salary', 'payroll', 'partial period', 'leave', 'hr', 'daily rate'],
    inputs: [
      {
        id: 'annualSalary',
        label: 'Full Annual Salary ($)',
        type: 'number',
        defaultValue: 60000,
        min: 0,
        step: 1000,
        placeholder: 'e.g. 60000',
        helpText: 'The full annual salary for the role.',
        required: true,
      },
      {
        id: 'daysWorked',
        label: 'Days Worked in Period',
        type: 'number',
        defaultValue: 120,
        min: 0,
        step: 1,
        placeholder: 'e.g. 120',
        helpText: 'The number of working days actually worked in the partial period.',
        required: true,
      },
      {
        id: 'totalWorkingDays',
        label: 'Total Working Days in Year',
        type: 'number',
        defaultValue: 260,
        min: 1,
        step: 1,
        placeholder: 'e.g. 260',
        helpText: 'Standard working days in a full year (typically 260 for Mon-Fri).',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'proRataSalary',
        expression: 'annualSalary * daysWorked / totalWorkingDays',
        dependencies: ['annualSalary', 'daysWorked', 'totalWorkingDays'],
      },
      {
        id: 'dailyRate',
        expression: 'annualSalary / totalWorkingDays',
        dependencies: ['annualSalary', 'totalWorkingDays'],
      },
      {
        id: 'monthlyEquivalent',
        expression: 'proRataSalary / 12 * (260 / daysWorked)',
        dependencies: ['proRataSalary', 'daysWorked'],
      },
    ],
    outputs: [
      {
        id: 'proRataSalary',
        label: 'Pro Rata Salary',
        formulaRef: 'proRataSalary',
        prefix: '$',
        precision: 2,
        highlight: true,
      },
      {
        id: 'dailyRate',
        label: 'Daily Rate',
        formulaRef: 'dailyRate',
        prefix: '$',
        precision: 2,
      },
    ],
    guide: {
      whatIsIt:
        'For informational/educational purposes only. Not legal advice. Consult a qualified attorney for your situation. Pro rata salary is the proportional pay an employee earns when they do not work a full year � for example when starting mid-year, leaving early, or working part-time.',
      howToUse:
        'Enter the full annual salary for the role, the number of working days the person actually worked, and the standard annual working days (usually 260). The calculator outputs the proportional salary owed.',
      exampleScenario:
        'An employee with a $60,000 annual salary joins on 1 May and works 120 days before year-end. Pro rata salary = $60,000 � 120/260 = $27,692. Their daily rate is $230.77.',
      proTip:
        'Different companies count working days differently (some use calendar days or 365). Agree on the method in writing before the calculation is applied to avoid payroll disputes.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 3. Severance Pay Estimator
  // =========================================================================
  {
    id: 'severance-pay-calculator',
    slug: 'severance-pay-calculator',
    title: 'Severance Pay Estimator',
    description:
      'Estimate severance pay based on weekly gross pay, years of service, and severance multiplier. For educational purposes only.',
    icon: '👤',
    category: 'legal',
    subcategory: 'employment-law',
    tags: ['severance', 'redundancy', 'employment', 'layoff', 'termination', 'pay'],
    inputs: [
      {
        id: 'weeklyGrossPay',
        label: 'Weekly Gross Pay ($)',
        type: 'number',
        defaultValue: 1200,
        min: 0,
        step: 50,
        placeholder: 'e.g. 1200',
        helpText: 'Your regular weekly gross (before-tax) pay.',
        required: true,
      },
      {
        id: 'yearsOfService',
        label: 'Years of Service',
        type: 'number',
        defaultValue: 5,
        min: 0,
        step: 0.5,
        placeholder: 'e.g. 5',
        helpText: 'Total number of years employed at the company.',
        required: true,
      },
      {
        id: 'multiplier',
        label: 'Severance Weeks per Year',
        type: 'select',
        options: [
          { label: '0.5 weeks/year (minimum)', value: '0.5' },
          { label: '1 week/year (standard)', value: '1' },
          { label: '2 weeks/year (generous)', value: '2' },
        ],
        defaultValue: '1',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'severanceWeeks',
        expression: 'yearsOfService * multiplier',
        dependencies: ['yearsOfService', 'multiplier'],
      },
      {
        id: 'severancePay',
        expression: 'weeklyGrossPay * severanceWeeks',
        dependencies: ['weeklyGrossPay', 'severanceWeeks'],
      },
    ],
    outputs: [
      {
        id: 'severanceWeeks',
        label: 'Severance Weeks',
        formulaRef: 'severanceWeeks',
        suffix: ' weeks',
        precision: 1,
      },
      {
        id: 'severancePay',
        label: 'Estimated Severance Pay',
        formulaRef: 'severancePay',
        prefix: '$',
        precision: 0,
        highlight: true,
      },
    ],
    guide: {
      whatIsIt:
        'For informational/educational purposes only. Not legal advice. Consult a qualified attorney for your situation. Severance pay is compensation offered by an employer when terminating an employee. The amount depends on your weekly pay, length of service, and company policy or local law.',
      howToUse:
        'Enter your weekly gross pay, total years of service, and choose the severance multiplier that matches your employment contract or jurisdiction. The result is an estimate only � actual entitlements vary by country and company policy.',
      exampleScenario:
        'John earns $1,200/week and has 5 years of service. With a standard 1 week/year multiplier: 5 weeks � $1,200 = $6,000 estimated severance.',
      proTip:
        'Severance is often negotiable, especially for senior employees. Review your employment contract and any applicable statutory minimum severance before agreeing to any package. Tax treatment of severance also varies � consult a tax professional.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 4. Freelance 1099 Tax Withholding Calculator
  // =========================================================================
  {
    id: 'freelance-1099-tax-calculator',
    slug: 'freelance-1099-tax-calculator',
    title: 'Freelance 1099 Tax Withholding Calculator',
    description:
      'Estimate self-employment tax, federal income tax, and quarterly estimated payments for freelancers and independent contractors.',
    icon: '🧾',
    category: 'finance',
    subcategory: 'taxes',
    tags: ['1099', 'freelance', 'self-employment tax', 'quarterly tax', 'independent contractor', 'irs'],
    inputs: [
      {
        id: 'annualNetIncome',
        label: 'Annual Net Self-Employment Income ($)',
        type: 'number',
        defaultValue: 80000,
        min: 0,
        step: 1000,
        placeholder: 'e.g. 80000',
        helpText: 'Total freelance/1099 income after business expenses for the year.',
        required: true,
      },
      {
        id: 'otherIncome',
        label: 'Other W2 Income ($)',
        type: 'number',
        defaultValue: 0,
        min: 0,
        step: 1000,
        placeholder: 'e.g. 0',
        helpText: 'Any additional W2 employment income (from a day job, for example).',
        required: false,
      },
      {
        id: 'filingStatus',
        label: 'Filing Status (approx. bracket %)',
        type: 'select',
        options: [
          { label: 'Single', value: '22' },
          { label: 'Married Filing Jointly', value: '12' },
        ],
        defaultValue: '22',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'seTaxableIncome',
        expression: 'annualNetIncome * 0.9235',
        dependencies: ['annualNetIncome'],
      },
      {
        id: 'seTax',
        expression: 'seTaxableIncome * 0.153',
        dependencies: ['seTaxableIncome'],
      },
      {
        id: 'halfSETax',
        expression: 'seTax * 0.5',
        dependencies: ['seTax'],
      },
      {
        id: 'adjustedGross',
        expression: 'annualNetIncome + otherIncome - halfSETax',
        dependencies: ['annualNetIncome', 'otherIncome', 'halfSETax'],
      },
      {
        id: 'federalTax',
        expression: 'adjustedGross * filingStatus / 100',
        dependencies: ['adjustedGross', 'filingStatus'],
      },
      {
        id: 'totalTax',
        expression: 'seTax + federalTax',
        dependencies: ['seTax', 'federalTax'],
      },
      {
        id: 'effectiveRate',
        expression: '(totalTax / (annualNetIncome + otherIncome)) * 100',
        dependencies: ['totalTax', 'annualNetIncome', 'otherIncome'],
      },
      {
        id: 'quarterlyPayment',
        expression: 'totalTax / 4',
        dependencies: ['totalTax'],
      },
    ],
    outputs: [
      {
        id: 'seTax',
        label: 'Self-Employment Tax (15.3%)',
        formulaRef: 'seTax',
        prefix: '$',
        precision: 0,
      },
      {
        id: 'federalTax',
        label: 'Est. Federal Income Tax',
        formulaRef: 'federalTax',
        prefix: '$',
        precision: 0,
      },
      {
        id: 'totalTax',
        label: 'Total Tax Due',
        formulaRef: 'totalTax',
        prefix: '$',
        precision: 0,
        highlight: true,
      },
      {
        id: 'quarterlyPayment',
        label: 'Quarterly Estimated Payment',
        formulaRef: 'quarterlyPayment',
        prefix: '$',
        precision: 0,
      },
    ],
    guide: {
      whatIsIt:
        'For informational/educational purposes only. Not legal advice. Consult a qualified attorney for your situation. As a 1099 freelancer, no employer withholds taxes for you. You must pay self-employment tax (Social Security + Medicare, 15.3%) plus estimated federal income tax quarterly to avoid IRS penalties.',
      howToUse:
        'Enter your total annual freelance net income, any additional W2 income, and your filing status. The calculator estimates your self-employment tax, approximate federal income tax, total tax liability, and how much to pay each quarter.',
      exampleScenario:
        'Maria earns $80,000 net from freelancing and files as Single. SE taxable income = $73,880; SE tax = $11,304; after the half-SE deduction, federal tax � $15,117; total tax � $26,421; quarterly payment � $6,605.',
      proTip:
        'Pay quarterly estimates by the IRS deadlines (April 15, June 15, September 15, January 15) to avoid underpayment penalties. Track all deductible business expenses � every deduction reduces your SE income and cuts both SE and income taxes.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 5. Import Duty & Customs Tax Calculator
  // =========================================================================
  {
    id: 'import-duty-customs-calculator',
    slug: 'import-duty-customs-calculator',
    title: 'Import Duty & Customs Tax Calculator',
    description:
      'Calculate import duty, VAT/GST, and total landed cost for goods being imported across international borders.',
    icon: '📦',
    category: 'legal',
    subcategory: 'trade-commerce',
    tags: ['import', 'customs', 'duty', 'VAT', 'GST', 'landed cost', 'tariff', 'trade'],
    inputs: [
      {
        id: 'declaredValue',
        label: 'Declared Value ($)',
        type: 'number',
        defaultValue: 500,
        min: 0,
        step: 10,
        placeholder: 'e.g. 500',
        helpText: 'The customs-declared value (CIF value) of your goods.',
        required: true,
      },
      {
        id: 'dutyRate',
        label: 'Duty Rate %',
        type: 'number',
        defaultValue: 5,
        min: 0,
        max: 100,
        step: 0.5,
        placeholder: 'e.g. 5',
        helpText: 'The import duty percentage applied to the CIF value. Check your country HS code tariff schedule.',
        required: true,
      },
      {
        id: 'vatRate',
        label: 'VAT/GST Rate %',
        type: 'number',
        defaultValue: 20,
        min: 0,
        max: 100,
        step: 0.5,
        placeholder: 'e.g. 20',
        helpText: 'The VAT or GST rate applied after duty (UK: 20%, Australia: 10%, Canada: 5%).',
        required: true,
      },
      {
        id: 'shippingCost',
        label: 'Shipping Cost ($)',
        type: 'number',
        defaultValue: 50,
        min: 0,
        step: 5,
        placeholder: 'e.g. 50',
        helpText: 'Freight and insurance costs added to the declared value (CIF basis).',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'cif',
        expression: 'declaredValue + shippingCost',
        dependencies: ['declaredValue', 'shippingCost'],
      },
      {
        id: 'dutyAmount',
        expression: 'cif * dutyRate / 100',
        dependencies: ['cif', 'dutyRate'],
      },
      {
        id: 'vatBase',
        expression: 'cif + dutyAmount',
        dependencies: ['cif', 'dutyAmount'],
      },
      {
        id: 'vatAmount',
        expression: 'vatBase * vatRate / 100',
        dependencies: ['vatBase', 'vatRate'],
      },
      {
        id: 'totalLandedCost',
        expression: 'declaredValue + shippingCost + dutyAmount + vatAmount',
        dependencies: ['declaredValue', 'shippingCost', 'dutyAmount', 'vatAmount'],
      },
      {
        id: 'totalTaxes',
        expression: 'dutyAmount + vatAmount',
        dependencies: ['dutyAmount', 'vatAmount'],
      },
    ],
    outputs: [
      {
        id: 'dutyAmount',
        label: 'Import Duty',
        formulaRef: 'dutyAmount',
        prefix: '$',
        precision: 2,
      },
      {
        id: 'vatAmount',
        label: 'VAT/GST',
        formulaRef: 'vatAmount',
        prefix: '$',
        precision: 2,
      },
      {
        id: 'totalTaxes',
        label: 'Total Taxes',
        formulaRef: 'totalTaxes',
        prefix: '$',
        precision: 2,
        highlight: true,
      },
      {
        id: 'totalLandedCost',
        label: 'Total Landed Cost',
        formulaRef: 'totalLandedCost',
        prefix: '$',
        precision: 2,
      },
    ],
    guide: {
      whatIsIt:
        'For informational/educational purposes only. Not legal advice. Consult a qualified attorney for your situation. The total cost of imported goods includes the purchase price, shipping, import duty, and VAT/GST. This calculator helps you estimate the total landed cost before you buy.',
      howToUse:
        "Enter the declared customs value, your shipping cost, the applicable duty rate (find this via your country's HS code tariff database), and the local VAT/GST rate. The calculator outputs each tax component and the total landed cost.",
      exampleScenario:
        'You import electronics worth $500 with $50 shipping (CIF = $550). UK duty rate 5% = $27.50 duty. VAT base = $577.50; UK VAT 20% = $115.50. Total landed cost = $693.',
      proTip:
        'Duty rates vary significantly by HS code (product category) and country of origin. Free trade agreements (e.g., EU-UK TCA, USMCA) may reduce or eliminate duty � always check the specific HS code and origin rules before importing.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 6. VAT Reverse Charge Calculator
  // =========================================================================
  {
    id: 'vat-reverse-charge-calculator',
    slug: 'vat-reverse-charge-calculator',
    title: 'VAT Reverse Charge Calculator',
    description:
      'Add VAT to a net amount or remove VAT from a gross amount. Useful for EU reverse charge VAT accounting.',
    icon: '🇪🇺',
    category: 'legal',
    subcategory: 'trade-commerce',
    tags: ['VAT', 'reverse charge', 'EU', 'tax', 'gross', 'net', 'GST', 'accounting'],
    inputs: [
      {
        id: 'netAmount',
        label: 'Net Amount (excl. VAT)',
        type: 'number',
        defaultValue: 1000,
        min: 0,
        step: 10,
        placeholder: 'e.g. 1000',
        helpText: 'Enter the net amount (excluding VAT) to add VAT, or the gross amount (including VAT) to remove it.',
        required: true,
      },
      {
        id: 'vatRate',
        label: 'VAT Rate %',
        type: 'number',
        defaultValue: 20,
        min: 0,
        max: 100,
        step: 0.5,
        placeholder: 'e.g. 20',
        helpText: 'Standard VAT/GST rate � UK: 20%, Germany: 19%, France: 20%, Australia: 10%.',
        required: true,
      },
      {
        id: 'direction',
        label: 'Direction',
        type: 'select',
        options: [
          { label: 'Add VAT (net to gross)', value: 'add' },
          { label: 'Remove VAT (gross to net)', value: 'remove' },
        ],
        defaultValue: 'add',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'vatAmountAdd',
        expression: 'netAmount * vatRate / 100',
        dependencies: ['netAmount', 'vatRate'],
      },
      {
        id: 'grossAdd',
        expression: 'netAmount + vatAmountAdd',
        dependencies: ['netAmount', 'vatAmountAdd'],
      },
      {
        id: 'netRemove',
        expression: 'netAmount / (1 + vatRate / 100)',
        dependencies: ['netAmount', 'vatRate'],
      },
      {
        id: 'vatAmountRemove',
        expression: 'netAmount - netRemove',
        dependencies: ['netAmount', 'netRemove'],
      },
    ],
    outputs: [
      {
        id: 'vatAmountAdd',
        label: 'VAT to Add',
        formulaRef: 'vatAmountAdd',
        prefix: '$',
        precision: 2,
      },
      {
        id: 'grossAdd',
        label: 'Gross (with VAT)',
        formulaRef: 'grossAdd',
        prefix: '$',
        precision: 2,
        highlight: true,
      },
      {
        id: 'netRemove',
        label: 'Net (VAT removed)',
        formulaRef: 'netRemove',
        prefix: '$',
        precision: 2,
      },
      {
        id: 'vatAmountRemove',
        label: 'VAT Removed',
        formulaRef: 'vatAmountRemove',
        prefix: '$',
        precision: 2,
      },
    ],
    guide: {
      whatIsIt:
        'For informational/educational purposes only. Not legal advice. Consult a qualified attorney for your situation. VAT (Value Added Tax) is added to goods and services in most countries. The reverse charge mechanism shifts the VAT accounting obligation from the seller to the buyer, commonly used in cross-border B2B EU transactions.',
      howToUse:
        'Enter an amount and the applicable VAT rate. If you have a net (ex-VAT) price and want the gross, use "Add VAT." If you have a gross (inc-VAT) price and want to extract the net, use "Remove VAT." Both results are shown simultaneously.',
      exampleScenario:
        'A UK consultant invoices an EU client for �1,000 net. With 20% VAT added: gross = �1,200; VAT = �200. If the client received a �1,200 gross invoice and wants to extract net: net = �1,000; VAT = �200.',
      proTip:
        'Under EU reverse charge rules, the buyer self-accounts for VAT � the seller issues a VAT-free invoice marked "Reverse Charge applies." Always verify which transactions qualify for reverse charge in your jurisdiction.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 7. Late Payment Interest Calculator
  // =========================================================================
  {
    id: 'late-payment-interest-calculator',
    slug: 'late-payment-interest-calculator',
    title: 'Late Payment Interest Calculator',
    description:
      'Calculate interest accrued on overdue invoices using a simple daily interest rate method.',
    icon: '⏰',
    category: 'finance',
    subcategory: 'personal',
    tags: ['late payment', 'interest', 'invoice', 'overdue', 'B2B', 'debt', 'penalty'],
    inputs: [
      {
        id: 'principalAmount',
        label: 'Invoice Amount ($)',
        type: 'number',
        defaultValue: 10000,
        min: 0,
        step: 100,
        placeholder: 'e.g. 10000',
        helpText: 'The original invoice or debt amount that is overdue.',
        required: true,
      },
      {
        id: 'annualRate',
        label: 'Annual Interest Rate %',
        type: 'number',
        defaultValue: 8,
        min: 0,
        max: 50,
        step: 0.25,
        placeholder: 'e.g. 8',
        helpText: 'The annual interest rate. UK statutory rate is 8% + Bank of England base rate.',
        required: true,
      },
      {
        id: 'daysLate',
        label: 'Days Overdue',
        type: 'number',
        defaultValue: 45,
        min: 0,
        step: 1,
        placeholder: 'e.g. 45',
        helpText: 'Number of calendar days the payment is overdue.',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'dailyRate',
        expression: 'annualRate / 100 / 365',
        dependencies: ['annualRate'],
      },
      {
        id: 'interestAmount',
        expression: 'principalAmount * dailyRate * daysLate',
        dependencies: ['principalAmount', 'dailyRate', 'daysLate'],
      },
      {
        id: 'totalOwed',
        expression: 'principalAmount + interestAmount',
        dependencies: ['principalAmount', 'interestAmount'],
      },
    ],
    outputs: [
      {
        id: 'interestAmount',
        label: 'Interest Accrued',
        formulaRef: 'interestAmount',
        prefix: '$',
        precision: 2,
        highlight: true,
      },
      {
        id: 'totalOwed',
        label: 'Total Amount Owed',
        formulaRef: 'totalOwed',
        prefix: '$',
        precision: 2,
      },
      {
        id: 'dailyRate',
        label: 'Daily Rate',
        formulaRef: 'dailyRate',
        suffix: '%/day',
        precision: 5,
      },
    ],
    guide: {
      whatIsIt:
        'For informational/educational purposes only. Not legal advice. Consult a qualified attorney for your situation. Late payment interest compensates creditors for delayed payments. Many jurisdictions provide statutory rates (e.g., UK Late Payment of Commercial Debts Act allows 8% over base rate).',
      howToUse:
        'Enter the original invoice amount, the applicable annual interest rate, and the number of days the payment is overdue. The calculator outputs the accrued interest and total amount owed.',
      exampleScenario:
        'An agency is owed $10,000. The client pays 45 days late. At 8% annual rate: daily rate = 0.02192%; interest = $10,000 � 0.0002192 � 45 = $98.63; total owed = $10,098.63.',
      proTip:
        'Always include a late payment clause in your contracts specifying the interest rate and when it applies. Sending a formal demand letter with the interest calculation often prompts faster payment without needing legal action.',
    },
    metadata: { version: '1.0.0' },
  },

  // =========================================================================
  // 8. Statute of Limitations Deadline Calculator
  // =========================================================================
  {
    id: 'statute-of-limitations-calculator',
    slug: 'statute-of-limitations-calculator',
    title: 'Statute of Limitations Deadline Calculator',
    description:
      'Estimate the remaining time to file a legal claim based on the applicable statute of limitations period. For educational purposes only.',
    icon: '📅',
    category: 'legal',
    subcategory: 'family-law',
    tags: ['statute of limitations', 'deadline', 'filing', 'legal claim', 'time bar', 'civil', 'lawsuit'],
    inputs: [
      {
        id: 'yearsLimit',
        label: 'Statute of Limitations Period',
        type: 'select',
        options: [
          { label: '1 year', value: '1' },
          { label: '2 years', value: '2' },
          { label: '3 years', value: '3' },
          { label: '4 years', value: '4' },
          { label: '5 years', value: '5' },
          { label: '6 years', value: '6' },
          { label: '10 years', value: '10' },
        ],
        defaultValue: '3',
        required: true,
      },
      {
        id: 'monthsElapsed',
        label: 'Months Since Incident',
        type: 'number',
        defaultValue: 8,
        min: 0,
        max: 120,
        step: 1,
        placeholder: 'e.g. 8',
        helpText: 'How many months have passed since the incident or cause of action arose.',
        required: true,
      },
    ],
    formulas: [
      {
        id: 'limitMonths',
        expression: 'yearsLimit * 12',
        dependencies: ['yearsLimit'],
      },
      {
        id: 'monthsRemaining',
        expression: 'limitMonths - monthsElapsed',
        dependencies: ['limitMonths', 'monthsElapsed'],
      },
      {
        id: 'percentUsed',
        expression: 'monthsElapsed / limitMonths * 100',
        dependencies: ['monthsElapsed', 'limitMonths'],
      },
      {
        id: 'urgency',
        expression: 'monthsRemaining <= 3 ? 3 : (monthsRemaining <= 12 ? 2 : 1)',
        dependencies: ['monthsRemaining'],
      },
    ],
    outputs: [
      {
        id: 'monthsRemaining',
        label: 'Time Left to File',
        formulaRef: 'monthsRemaining',
        suffix: ' months remaining',
        precision: 0,
        highlight: true,
      },
      {
        id: 'percentUsed',
        label: 'Time Used',
        formulaRef: 'percentUsed',
        suffix: '%',
        precision: 0,
      },
      {
        id: 'urgency',
        label: 'Urgency Level (1=Low 2=Med 3=High)',
        formulaRef: 'urgency',
        precision: 0,
      },
    ],
    guide: {
      whatIsIt:
        'For informational/educational purposes only. Not legal advice. Consult a qualified attorney for your situation. A statute of limitations is a law that sets the maximum time after an event within which legal proceedings may be initiated. Missing this deadline usually bars you from filing a claim permanently.',
      howToUse:
        'Select the statute of limitations period that applies to your type of claim and jurisdiction, then enter the number of months that have passed since the incident. The calculator shows months remaining and an urgency level.',
      exampleScenario:
        'Jane was in a car accident 8 months ago. Her state has a 3-year (36-month) statute of limitations for personal injury. She has 28 months remaining � urgency level 1 (Low). But she should still consult an attorney promptly.',
      proTip:
        'Statutes of limitations vary widely by claim type (personal injury, contract, fraud) and jurisdiction. The clock may be "tolled" (paused) if the claimant is a minor, was incapacitated, or the defendant concealed the harm. Never rely solely on this calculator � consult an attorney immediately.',
    },
    metadata: { version: '1.0.0' },
  },
];
