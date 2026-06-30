import { readFileSync } from 'fs';

const src = readFileSync('src/data/healthFitnessNew.ts', 'utf8');

let allOk = true;
const fail = (msg) => { console.error('FAIL:', msg); allOk = false; };
const pass = (msg) => console.log('PASS:', msg);

// Check 1: Exact header
const expectedHeader = `import type { CalculatorSchema } from '@/types/calculator';\nexport const healthFitnessNew: CalculatorSchema[] = [`;
src.startsWith(expectedHeader) ? pass('Exact header present') : fail('Header mismatch');

// Check 2: Count calculators by slug
const slugs = src.match(/slug: '[^']+'/g) || [];
slugs.length === 8 ? pass(`Calculator count: ${slugs.length}`) : fail(`Expected 8 calculators, got ${slugs.length}`);
slugs.forEach(s => console.log('  ', s));

// Check 3: Closes correctly
src.trimEnd().endsWith('];') ? pass('File closes with ];') : fail('File does not close with ];');

// Check 4: No JS-only constructs
/Math\./.test(src) ? fail('Found Math.* (not allowed in formula parser)') : pass('No Math.* references');
/=> *\{/.test(src) ? fail('Found arrow functions') : pass('No arrow function expressions');

// Check 5: Formula expression + dependencies pairing
const formulaBlocks = src.match(/expression:[\s\S]*?dependencies:/g) || [];
console.log(`INFO: Formula-dependency pairs found: ${formulaBlocks.length}`);

// Check 6: All outputs have formulaRef
const outputRefs = src.match(/formulaRef:/g) || [];
console.log(`INFO: Output formulaRefs: ${outputRefs.length}`);

// Check 7: No suffix/prefix on input fields (only allowed on outputs)
// Split at first 'outputs:' to get the inputs/formulas section only
const inputsSection = src.split('outputs:')[0];
/\bsuffix:|\bprefix:/.test(inputsSection) ? fail('Found suffix/prefix before outputs section') : pass('No suffix/prefix on input fields');

// Check 8: All 8 expected slugs present
const expectedSlugs = [
  'pregnancy-due-date',
  'ovulation-calculator',
  'one-rep-max',
  'bac-calculator',
  'pace-calculator',
  'child-height-predictor',
  'egfr-calculator',
  'calorie-deficit-calculator',
];
for (const slug of expectedSlugs) {
  src.includes(`slug: '${slug}'`) ? pass(`Slug present: ${slug}`) : fail(`Missing slug: ${slug}`);
}

// Check 9: All guides have all 4 required fields
const guideFields = ['whatIsIt', 'howToUse', 'exampleScenario', 'proTip'];
for (const field of guideFields) {
  const count = (src.match(new RegExp(field + ':', 'g')) || []).length;
  count === 8 ? pass(`guide.${field} present in all 8 calculators`) : fail(`guide.${field} count: ${count} (expected 8)`);
}

// Check 10: metadata version present
const versionCount = (src.match(/version: '1\.0\.0'/g) || []).length;
versionCount === 8 ? pass(`metadata.version present in all 8`) : fail(`metadata.version count: ${versionCount}`);

console.log('\n' + (allOk ? '=== ALL CHECKS PASSED ===' : '=== SOME CHECKS FAILED ==='));
process.exit(allOk ? 0 : 1);
