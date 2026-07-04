'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import {
  evaluate as mjsEval,
  parse as mjsParse,
  simplify as mjsSimplify,
  derivative as mjsDerivative,
  isResultSet,
  format as mjsFormat,
  type MathNode,
} from 'mathjs';

// ─── Types ────────────────────────────────────────────────────────────────────
type KeyboardMode = 'basic' | 'functions' | 'trig' | 'calculus';
type AngleMode = 'deg' | 'rad';

interface MathStep {
  from: string;
  to: string;
  bullets: string[];
  ruleTitle: string;
  expanded: boolean;
  isError?: boolean;
  working?: string;
}

interface SolveResult {
  display: string;       // what to show as the "answer"
  isSymbolic: boolean;   // true if result still has variables
  isNumeric: boolean;    // true if result is a plain number
  exact?: string;        // exact numeric form (e.g., "1/2", "√2")
  decimal?: string;      // decimal approximation
  steps: MathStep[];
  isError: boolean;
  errorMessage?: string;
}

interface HistoryEntry { expr: string; result: string; }

// ─── Number Utilities ─────────────────────────────────────────────────────────
function fmt(n: number, places = 8): string {
  if (isNaN(n)) return 'NaN';
  if (!isFinite(n)) return n > 0 ? '+∞' : '-∞';
  if (Number.isInteger(n)) return String(n);
  return parseFloat(n.toFixed(places)).toString();
}

function tryExact(n: number): string {
  if (isNaN(n) || !isFinite(n)) return fmt(n);
  if (Number.isInteger(n)) return String(n);
  for (let d = 2; d <= 120; d++) {
    const num = Math.round(n * d);
    if (Math.abs(num / d - n) < 1e-9) return `${num}/${d}`;
  }
  const sq = n * n;
  const sqR = Math.round(sq);
  if (Math.abs(sq - sqR) < 1e-7 && sqR > 1 && sqR < 100000 && !Number.isInteger(n)) return `√${sqR}`;
  return fmt(n, 6);
}

// ─── Expression Conversion: Display ↔ mathjs ─────────────────────────────────
function toMathJS(expr: string): string {
  return expr
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/π/g, 'pi')
    .replace(/\^/g, '^')
    .replace(/√\(/g, 'sqrt(')
    .replace(/√(\d+\.?\d*)/g, 'sqrt($1)')
    .replace(/log₁₀\(/g, 'log10(')
    .replace(/log₂\(/g, 'log2(')
    .replace(/\|([^|]+)\|/g, 'abs($1)')
    // "log(" (user convention = base 10) → "log10("
    .replace(/\blog\(/g, 'log10(')
    // "ln(" → "log(" (mathjs base e)
    .replace(/\bln\(/g, 'log(')
    .trim();
}

function fromMathJS(expr: string): string {
  return expr
    // Restore log notations BEFORE replacing *
    .replace(/log10\(/g, 'log(')
    .replace(/log2\(/g, 'log₂(')
    .replace(/\blog\(/g, 'ln(')
    .replace(/sqrt\(/g, '√(')
    .replace(/\bpi\b/g, 'π')
    // Pretty-print operators
    .replace(/\s*\*\s*/g, '×')
    .replace(/\s*\/\s*/g, '÷')
    // Exponent fractions: ^ (n / m) → ^(n/m)
    .replace(/\^\s*\(([\d]+\s*\/\s*[\d]+)\)/g, '^($1)')
    .trim();
}

// ─── Implicit Multiplication Preprocessing ────────────────────────────────────
const FN_PAT = 'sin|cos|tan|cot|sec|csc|asin|acos|atan|acot|asec|acsc|sinh|cosh|tanh|coth|sech|csch|arcsinh|arccosh|arctanh|ln|log₁₀|log₂|log|exp|abs|√|sqrt';

function addImplicitMul(s: string): string {
  s = s.replace(new RegExp(`(\\d)\\s*(${FN_PAT})\\b`, 'g'), '$1×$2');
  s = s.replace(/(\d)\s*\(/g, '$1×(');
  s = s.replace(/\)\s*\(/g, ')×(');
  s = s.replace(/\)\s*(\d)/g, ')×$1');
  s = s.replace(new RegExp(`\\)\\s*(${FN_PAT})\\b`, 'g'), ')×$1');
  s = s.replace(/(\d)([a-df-hj-km-qs-uw-zA-DF-HJ-KM-QS-UW-Z])\b/g, '$1×$2');
  return s;
}

function normalize(raw: string): string {
  let s = raw
    .replace(/\*\*/g, '^')
    .replace(/√(\d+\.?\d*)\b(?!\()/g, '√($1)')
    .trim();
  return addImplicitMul(s);
}

// ─── mathjs Scope (angle-aware trig) ─────────────────────────────────────────
function buildScope(angleDeg: boolean): Record<string, unknown> {
  if (!angleDeg) return {};
  const D = Math.PI / 180;
  return {
    sin: (x: number) => Math.sin(x * D),
    cos: (x: number) => Math.cos(x * D),
    tan: (x: number) => Math.tan(x * D),
    cot: (x: number) => Math.cos(x * D) / Math.sin(x * D),
    sec: (x: number) => 1 / Math.cos(x * D),
    csc: (x: number) => 1 / Math.sin(x * D),
    asin: (x: number) => Math.asin(x) / D,
    acos: (x: number) => Math.acos(x) / D,
    atan: (x: number) => Math.atan(x) / D,
  };
}

// ─── Step Generator from mathjs AST ──────────────────────────────────────────
interface NodeEval { str: string; val: number | null; }

function nodeToDisplay(node: MathNode): string {
  return fromMathJS(node.toString({ implicit: 'show' }));
}

function evalNode(node: MathNode, scope: Record<string, unknown>): number | null {
  try {
    const r = mjsEval(node.toString(), scope);
    return typeof r === 'number' ? r : null;
  } catch { return null; }
}

function generateStepsFromNode(
  node: MathNode,
  scope: Record<string, unknown>,
  steps: MathStep[],
): NodeEval {
  const type = node.type;

  // Constant or symbol
  if (type === 'ConstantNode' || type === 'SymbolNode') {
    const str = nodeToDisplay(node);
    const val = evalNode(node, scope);
    return { str, val };
  }

  // ParenthesisNode — pass through
  if (type === 'ParenthesisNode') {
    const content = (node as any).content as MathNode;
    const inner = generateStepsFromNode(content, scope, steps);
    return inner;
  }

  // FunctionNode
  if (type === 'FunctionNode') {
    const fnNode = node as any;
    const fnName: string = fnNode.fn?.name ?? fnNode.name ?? 'f';
    const args: MathNode[] = fnNode.args ?? [];
    const argResults = args.map((a: MathNode) => generateStepsFromNode(a, scope, steps));

    const exprStr = nodeToDisplay(node);
    const val = evalNode(node, scope);

    if (val !== null) {
      const exact = tryExact(val);
      const dec = fmt(val, 6);
      const bullets = describeFn(fnName, argResults, val, exact, scope);
      steps.push({ from: exprStr, to: exact, ruleTitle: fnLabel(fnName), bullets, expanded: false, working: `${exprStr} = ${exact}` });
      return { str: exact, val };
    }
    return { str: exprStr, val: null };
  }

  // OperatorNode
  if (type === 'OperatorNode') {
    const opNode = node as any;
    const op: string = opNode.op ?? opNode.fn ?? '+';
    const args: MathNode[] = opNode.args ?? [];

    if (args.length === 1) {
      // Unary
      const child = generateStepsFromNode(args[0], scope, steps);
      if (op === '-' && child.val !== null) {
        const val = -child.val;
        return { str: fmt(val), val };
      }
      return { str: `${op}${child.str}`, val: child.val !== null ? (op === '-' ? -child.val : child.val) : null };
    }

    // Binary
    const left = generateStepsFromNode(args[0], scope, steps);
    const right = generateStepsFromNode(args[1], scope, steps);
    const exprStr = `${left.str} ${opSymbol(op)} ${right.str}`;

    if (left.val !== null && right.val !== null) {
      const val = computeOp(left.val, op, right.val);
      if (val === null) {
        // Error (e.g., division by zero)
        const errInfo = opError(op, left, right);
        steps.push({ from: exprStr, to: 'ERROR', ruleTitle: errInfo.title, bullets: errInfo.bullets, expanded: false, isError: true });
        return { str: 'ERROR', val: null };
      }
      const exact = tryExact(val);
      if (left.str !== left.val?.toString() || right.str !== right.val?.toString() || args.length > 0) {
        const bullets = opBullets(op, left, right, val, exact);
        steps.push({ from: exprStr, to: exact, ruleTitle: opName(op, left.val, right.val), bullets, expanded: false, working: `${exprStr} = ${exact}` });
      }
      return { str: exact, val };
    }

    // Symbolic — try to simplify this sub-expression
    const subExprMJS = toMathJS(exprStr);
    try {
      const simplified = mjsSimplify(subExprMJS).toString({ implicit: 'show' });
      const simplDisplay = fromMathJS(simplified);
      if (simplified !== subExprMJS && simplDisplay !== exprStr) {
        steps.push({
          from: exprStr, to: simplDisplay,
          ruleTitle: opSymbolicName(op),
          bullets: symbolicBullets(op, left.str, right.str, simplDisplay),
          expanded: false, working: `→ ${simplDisplay}`,
        });
        return { str: simplDisplay, val: null };
      }
    } catch { /* ignore */ }

    return { str: exprStr, val: null };
  }

  return { str: nodeToDisplay(node), val: evalNode(node, scope) };
}

// ─── Operator Helpers ─────────────────────────────────────────────────────────
function opSymbol(op: string): string {
  const m: Record<string, string> = { '+': '+', '-': '−', '*': '×', '/': '÷', '^': '^' };
  return m[op] ?? op;
}

function computeOp(a: number, op: string, b: number): number | null {
  if (op === '/' && b === 0) return null;
  if (op === '^' && a === 0 && b < 0) return null;
  const m: Record<string, number> = { '+': a + b, '-': a - b, '*': a * b, '/': a / b, '^': Math.pow(a, b) };
  return m[op] ?? null;
}

function opName(op: string, a?: number, b?: number): string {
  const names: Record<string, string> = { '+': 'Addition', '-': 'Subtraction', '*': 'Multiplication', '/': 'Division', '^': 'Exponentiation' };
  if (op === '^' && b === 2) return `Squaring (power of 2)`;
  if (op === '^' && b === 3) return `Cubing (power of 3)`;
  if (op === '^' && b !== undefined && b > 0 && b < 1) return 'Fractional Exponent (Root)';
  if (op === '^' && b !== undefined && b < 0) return 'Negative Exponent (Reciprocal)';
  return names[op] ?? op;
}

function opSymbolicName(op: string): string {
  const names: Record<string, string> = { '+': 'Combine Like Terms', '-': 'Simplify Difference', '*': 'Simplify Product', '/': 'Simplify Quotient', '^': 'Apply Index Law' };
  return names[op] ?? 'Algebraic Simplification';
}

function opBullets(op: string, l: NodeEval, r: NodeEval, val: number, exact: string): string[] {
  const a = l.val!, b = r.val!;
  const sym = opSymbol(op);
  const dec = fmt(val, 6);

  switch (op) {
    case '+': return [
      `Add ${l.str} and ${r.str}.`,
      `${l.str} + ${r.str} = ${exact}.`,
      exact !== dec ? `As a decimal: ≈ ${dec}.` : '',
    ].filter(Boolean);
    case '-': return [
      `Subtract ${r.str} from ${l.str}.`,
      `${l.str} − ${r.str} = ${exact}.`,
      val < 0 ? `The result is negative (subtracted a larger value from a smaller one).` : '',
    ].filter(Boolean);
    case '*': return [
      `Multiply ${l.str} by ${r.str}.`,
      `${l.str} × ${r.str} = ${exact}${exact !== dec ? ` ≈ ${dec}` : ''}.`,
    ];
    case '/': return [
      `Divide ${l.str} by ${r.str}.`,
      Number.isInteger(val)
        ? `${l.str} ÷ ${r.str} = ${val} (exact). Verify: ${r.str} × ${val} = ${a} ✓`
        : exact.includes('/') ? `${l.str} ÷ ${r.str} = ${exact} (fraction) ≈ ${dec}.` : `${l.str} ÷ ${r.str} ≈ ${dec}.`,
    ];
    case '^': {
      if (!Number.isInteger(b) || b < 0 || b > 8) return [`${l.str}^${r.str}: apply exponentiation.`, `Result: ${exact}.`];
      if (b === 0) return [`Any non-zero number to the power 0 equals 1.`, `${l.str}^0 = 1.`];
      if (b === 1) return [`Any number to the power 1 equals itself.`, `${l.str}^1 = ${l.str}.`];
      if (b === 2) return [`"Square" ${l.str}: multiply it by itself.`, `${l.str}² = ${l.str} × ${l.str} = ${exact}.`];
      if (b === 3) return [`"Cube" ${l.str}: multiply by itself three times.`, `${l.str}³ = ${l.str} × ${l.str} × ${l.str} = ${exact}.`];
      const expansion = Array.from({ length: b }, () => l.str).join(' × ');
      return [`${l.str}^${b}: multiply ${l.str} by itself ${b} times.`, `${expansion} = ${exact}.`];
    }
    default: return [`${l.str} ${sym} ${r.str} = ${exact}.`];
  }
}

function opError(op: string, l: NodeEval, r: NodeEval): { title: string; bullets: string[] } {
  if (op === '/' && r.val === 0) return { title: 'Division by Zero — Undefined', bullets: [`❌ ${l.str} ÷ 0 is undefined in mathematics.`, `There is no finite number z such that 0 × z = ${l.str}.`, `As the divisor approaches zero, the result grows without bound toward ±∞ — no single value is defined at exactly 0.`] };
  if (op === '^' && l.val === 0 && r.val !== null && r.val !== undefined && r.val < 0) return { title: '0^(negative) — Undefined', bullets: [`❌ 0^${r.str} requires 1 ÷ 0^${Math.abs(r.val)} = 1/0, which is division by zero.`] };
  return { title: 'Computation Error', bullets: [`An error occurred computing ${l.str} ${opSymbol(op)} ${r.str}.`] };
}

function symbolicBullets(op: string, lStr: string, rStr: string, result: string): string[] {
  switch (op) {
    case '+': case '-': return [`Combine the terms "${lStr}" and "${rStr}".`, `Collect like terms (terms with the same variable and exponent).`, `Result: ${result}.`];
    case '*': return [`Multiply "${lStr}" by "${rStr}".`, `Apply the product rule: multiply coefficients and add exponents for common bases.`, `Result: ${result}.`];
    case '/': return [`Divide "${lStr}" by "${rStr}".`, `Simplify the fraction by cancelling common factors.`, `Result: ${result}.`];
    case '^': return [`Apply index law to "${lStr}^${rStr}".`, `When multiplying powers of the same base: aᵐ × aⁿ = aᵐ⁺ⁿ.`, `Result: ${result}.`];
    default: return [`Simplify "${lStr} ${opSymbol(op)} ${rStr}" → ${result}.`];
  }
}

// ─── Function Helpers ─────────────────────────────────────────────────────────
function fnLabel(fn: string): string {
  const labels: Record<string, string> = {
    sin: 'Trigonometry: sin', cos: 'Trigonometry: cos', tan: 'Trigonometry: tan',
    cot: 'Trigonometry: cot', sec: 'Trigonometry: sec', csc: 'Trigonometry: csc',
    asin: 'Inverse Trig: arcsin', acos: 'Inverse Trig: arccos', atan: 'Inverse Trig: arctan',
    log: 'Natural Logarithm (ln)', log10: 'Logarithm base 10', log2: 'Logarithm base 2',
    sqrt: 'Square Root (√)', abs: 'Absolute Value (|x|)', exp: 'Exponential (eˣ)',
    sinh: 'Hyperbolic: sinh', cosh: 'Hyperbolic: cosh', tanh: 'Hyperbolic: tanh',
  };
  return labels[fn] ?? `Function: ${fn}`;
}

function describeFn(fn: string, args: NodeEval[], val: number, exact: string, scope: Record<string, unknown>): string[] {
  const a = args[0]?.val ?? NaN;
  const aStr = args[0]?.str ?? '?';
  const dec = fmt(val, 6);
  const isDeg = 'sin' in scope; // DEG mode indicator (scope overrides trig)

  switch (fn) {
    case 'sin': case 'cos': case 'tan': case 'cot': case 'sec': case 'csc': {
      const unitCircle: Record<string, string> = {
        sin: 'sin(θ) = y-coordinate on the unit circle.',
        cos: 'cos(θ) = x-coordinate on the unit circle.',
        tan: 'tan(θ) = sin(θ)/cos(θ) — slope of the radius at angle θ.',
        cot: 'cot(θ) = cos(θ)/sin(θ) = 1/tan(θ).',
        sec: 'sec(θ) = 1/cos(θ).',
        csc: 'csc(θ) = 1/sin(θ).',
      };
      const knownAngles: Record<string, Record<string, string>> = {
        sin: { '0': '0', '30': '½', '45': '√2/2', '60': '√3/2', '90': '1', '180': '0', '270': '-1' },
        cos: { '0': '1', '30': '√3/2', '45': '√2/2', '60': '½', '90': '0', '180': '-1', '270': '0' },
        tan: { '0': '0', '30': '√3/3', '45': '1', '60': '√3', '180': '0' },
      };
      const known = isDeg ? knownAngles[fn]?.[String(a)] : undefined;
      const bulls = [unitCircle[fn] ?? ''];
      if (isDeg && !isNaN(a)) bulls.push(`Angle: ${a}° = ${fmt(a * Math.PI / 180, 5)} rad.`);
      if (known) { bulls.push(`${a}° is a standard angle: ${fn}(${a}°) = ${known} (exact).`); bulls.push(`Decimal: ≈ ${dec}.`); }
      else bulls.push(`${fn}(${aStr}${isDeg ? '°' : ''}) ≈ ${dec}.`);
      return bulls;
    }
    case 'log10': return [`log₁₀(x) answers: "10 to what power gives x?"`, `log₁₀(${aStr}) ≈ ${dec}.${Math.abs(val - Math.round(val)) < 1e-9 ? ` Exactly ${Math.round(val)} because 10^${Math.round(val)} = ${aStr}.` : ''}`];
    case 'log':   return [`ln(x) answers: "e (≈2.71828) to what power gives x?"`, `ln(${aStr}) ≈ ${dec}.${Math.abs(a - Math.E) < 1e-7 ? ' Identity: ln(e) = 1.' : ''}`];
    case 'log2':  return [`log₂(x) answers: "2 to what power gives x?"`, `log₂(${aStr}) ≈ ${dec}.`];
    case 'sqrt':  {
      const perfect = Number.isInteger(val);
      const bulls = [`√x: what number squared equals x?`, perfect ? `√${aStr} = ${val} (perfect square: ${val}² = ${aStr}).` : `√${aStr} ≈ ${dec}.`];
      return bulls;
    }
    case 'abs':   return [`|x| = distance from zero (always non-negative).`, `|${aStr}| = ${exact}.`];
    case 'exp':   return [`exp(x) = eˣ where e ≈ 2.71828.`, `exp(${aStr}) = e^${aStr} ≈ ${dec}.`];
    default:      return [`${fn}(${aStr}) = ${exact}.`];
  }
}

// ─── Main Solver ──────────────────────────────────────────────────────────────
function solve(raw: string, angleDeg: boolean): SolveResult {
  const steps: MathStep[] = [];

  // Preprocess
  const preprocessed = normalize(raw);
  const mjsIn = toMathJS(preprocessed);

  // Show implicit mul step if expression changed
  if (preprocessed !== raw && preprocessed.includes('×') && !raw.includes('×')) {
    steps.push({
      from: raw, to: preprocessed, expanded: false,
      ruleTitle: 'Expand Implicit Multiplication',
      bullets: [
        `The expression uses implicit multiplication (terms written adjacent without × sign).`,
        `Mathematical convention: "4log(x)" means "4 × log(x)", "2(x+1)" means "2 × (x+1)".`,
        `Expanded form: ${preprocessed}`,
      ],
      working: preprocessed,
    });
  }

  // Opening step
  const hasComplexOps = /[×÷^]|sin|cos|tan|log|ln|√/.test(preprocessed);
  steps.push({
    from: raw, to: raw, ruleTitle: 'Given Expression', expanded: false,
    bullets: [
      `Expression: ${raw}`,
      hasComplexOps ? `Multiple operations present. Applying BODMAS/PEMDAS: Brackets → Orders (powers/roots) → Division/Multiplication → Addition/Subtraction.` : `Single-operation arithmetic expression.`,
    ],
  });

  // Parse with mathjs
  let node: MathNode;
  try {
    node = mjsParse(mjsIn);
  } catch (e) {
    const msg = String(e).replace(/^Error: /, '');
    return { display: 'Syntax Error', isSymbolic: false, isNumeric: false, steps: [...steps, { from: raw, to: 'ERROR', ruleTitle: 'Syntax Error', bullets: [`❌ Cannot parse: "${raw}"`, `Parsing error: ${msg}`, `Check for: unmatched parentheses, unsupported symbols, or typos.`], expanded: false, isError: true }], isError: true, errorMessage: 'Syntax Error' };
  }

  const scope = buildScope(angleDeg);

  // Generate steps by walking the AST
  let hasError = false;
  const finalEval = generateStepsFromNode(node, scope, steps);
  if (steps.some(s => s.isError)) hasError = true;

  if (hasError) {
    return {
      display: 'Error', isSymbolic: false, isNumeric: false, steps,
      isError: true, errorMessage: steps.find(s => s.isError)?.ruleTitle ?? 'Error',
    };
  }

  // Determine result type
  if (finalEval.val !== null && !isNaN(finalEval.val)) {
    // Pure numeric
    const exact = tryExact(finalEval.val);
    const dec = fmt(finalEval.val, 6);

    // Final step
    steps.push({
      from: finalEval.str, to: exact, ruleTitle: '✓ Final Answer', expanded: false,
      bullets: [
        `All operations have been evaluated.`,
        `Exact result: ${exact}`,
        exact !== dec ? `Decimal approximation: ≈ ${dec}` : `This is an exact result.`,
      ],
    });

    return {
      display: exact,
      exact, decimal: dec,
      isSymbolic: false, isNumeric: true, steps, isError: false,
    };
  }

  // Symbolic result — simplify with mathjs
  let simplifiedDisplay = finalEval.str;
  try {
    const simplified = mjsSimplify(mjsIn);
    const simplStr = simplified.toString({ implicit: 'show' });
    simplifiedDisplay = fromMathJS(simplStr);

    // Is the simplified form meaningfully different?
    const simplNorm = simplStr.replace(/\s/g, '');
    const origNorm = mjsIn.replace(/\s/g, '');
    if (simplNorm !== origNorm && simplifiedDisplay !== raw) {
      steps.push({
        from: preprocessed, to: simplifiedDisplay, ruleTitle: 'Algebraic Simplification (mathjs CAS)',
        expanded: false,
        bullets: [
          `mathjs CAS applied algebraic simplification rules:`,
          `  • Combine numeric coefficients`,
          `  • Apply index/power laws: aᵐ × aⁿ = aᵐ⁺ⁿ`,
          `  • Simplify fractions and like terms`,
          `Simplified result: ${simplifiedDisplay}`,
        ],
        working: `→ ${simplifiedDisplay}`,
      });
    }
  } catch { /* keep original form */ }

  steps.push({
    from: simplifiedDisplay, to: simplifiedDisplay, ruleTitle: '✓ Simplified Form', expanded: false,
    bullets: [
      `This expression contains symbolic variables — the result is an algebraic expression.`,
      `Simplified form: ${simplifiedDisplay}`,
      `To get a numeric answer, substitute specific values for the variables.`,
    ],
  });

  return {
    display: simplifiedDisplay,
    isSymbolic: true, isNumeric: false, steps, isError: false,
  };
}

// ─── Keyboards ───────────────────────────────────────────────────────────────
const KB_BASIC = [['(', ')', '%', 'π', 'e'], ['√(', '__sq__', '__pow__', '|x|', '1/x'], ['7', '8', '9', '÷', 'C'], ['4', '5', '6', '×', '⌫'], ['1', '2', '3', '-', '='], ['0', '.', '00', '+', '=']];
const KB_FUNCTIONS = [['|x|', 'f(x)', 'log(', 'nCr', '!'], ['exp(', '__sq__', 'log₂(', 'nPr', 'z'], ['e', 'e^(', 'log(', '(', ')'], ['ln(', 'log₁₀(', 'log₂(', 'ln(', '__pow__']];
const KB_TRIG = [['DEG/RAD', 'sin(', 'cos(', 'tan(', 'cot(', 'sec(', 'csc('], ['deg→rad', 'asin(', 'acos(', 'atan(', 'acot(', 'asec(', 'acsc('], ['π/2', 'sinh(', 'cosh(', 'tanh(', 'coth(', 'sech(', 'csch('], ['π', 'arcsinh(', 'arccosh(', 'arctanh(', '', '', '']];
const KB_CALCULUS = [['lim→', 'd/dx(', '∫(', 'dy/dx', 'aₙ'], ['lim→+', 'd²/dx²(', 'dⁿ/dxⁿ(', 'dx', '…'], ['lim→-', 'd/d(', '∫∫(', 'dy', ''], ['∞', '', 'Σ(', "y'", '']];

// ─── Component ────────────────────────────────────────────────────────────────
export default function AdvancedCalculator() {
  const [expression, setExpression] = useState('');
  const [solved, setSolved] = useState<SolveResult | null>(null);
  const [showSteps, setShowSteps] = useState(false);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [kbMode, setKbMode] = useState<KeyboardMode>('basic');
  const [angleMode, setAngleMode] = useState<AngleMode>('deg');
  const [showHistory, setShowHistory] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const insert = useCallback((key: string) => {
    setExpression(prev => {
      if (key === 'C') { setSolved(null); setShowSteps(false); return ''; }
      if (key === '⌫') return prev.slice(0, -1);
      if (key === '=' || key === 'DEG/RAD') return prev;
      if (key === '__sq__') return prev ? `(${prev})^2` : '^2';
      if (key === '__pow__') return prev ? `${prev}^` : '^';
      if (key === '1/x') return prev ? `1/(${prev})` : '1/';
      if (key === '|x|') return prev ? `|${prev}|` : '|';
      if (key === 'deg→rad') return prev ? `(${prev}×π÷180)` : '';
      if (key === 'f(x)') return prev + 'f(';
      if (key === 'nCr') return prev ? `C(${prev},` : 'C(';
      if (key === 'nPr') return prev ? `P(${prev},` : 'P(';
      if (key === '!') return `${prev}!`;
      return prev + key;
    });
  }, []);

  const compute = useCallback(() => {
    if (!expression.trim()) return;
    const result = solve(expression, angleMode === 'deg');
    setSolved(result);
    setShowSteps(false);
    setExpandedStep(null);
    if (!result.isError && !result.isSymbolic) {
      setHistory(h => [{ expr: expression, result: result.display }, ...h.slice(0, 49)]);
    }
  }, [expression, angleMode]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Enter') compute();
      else if (e.key === 'Escape') { setSolved(null); setExpression(''); setShowSteps(false); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [compute]);

  const openCamera = async () => {
    setCameraError(''); setShowCamera(true);
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setStream(s);
      if (videoRef.current) { videoRef.current.srcObject = s; videoRef.current.play(); }
    } catch { setCameraError('Camera access denied or unavailable.'); }
  };
  const stopCamera = () => { stream?.getTracks().forEach(t => t.stop()); setStream(null); setShowCamera(false); };
  const capturePhoto = () => { stopCamera(); alert('Photo captured! Full AI recognition coming soon.'); };

  const modeLabels: Record<KeyboardMode, string> = { basic: '+ − × ÷', functions: 'f(x)  log  ln', trig: 'sin cos tan', calculus: 'lim ∫ Σ ∞' };

  const renderKey = (key: string, ki: number) => {
    if (key === '') return <div key={ki} className="adv-key adv-key--empty" />;
    const display: Record<string, string> = { '__sq__': 'x²', '__pow__': 'xʸ', 'DEG/RAD': angleMode.toUpperCase() };
    return (
      <button key={ki}
        className={`adv-key ${key === '=' ? 'adv-key--eq' : key === 'C' ? 'adv-key--clear' : key === '⌫' ? 'adv-key--back' : key === 'DEG/RAD' ? 'adv-key--mode' : 'adv-key--default'}`}
        onClick={() => {
          if (key === 'DEG/RAD') setAngleMode(m => m === 'deg' ? 'rad' : 'deg');
          else if (key === '=') compute();
          else insert(key);
        }}>
        {display[key] ?? key}
      </button>
    );
  };

  const renderKB = () => {
    const kb = kbMode === 'basic' ? KB_BASIC : kbMode === 'functions' ? KB_FUNCTIONS : kbMode === 'trig' ? KB_TRIG : KB_CALCULUS;
    return kb.map((row, ri) => <div key={ri} className="adv-kb-row">{row.map(renderKey)}</div>);
  };

  return (
    <div className="adv-calc">
      <div className="adv-header">
        <div className="adv-header__icon">🧮</div>
        <div>
          <h1 className="adv-header__title">Advanced Calculator <span className="adv-beta-badge">Beta</span></h1>
          <p className="adv-header__sub">Scientific · Symbolic CAS (mathjs) · Step-by-Step · Photo Math</p>
        </div>
        <div className="adv-header__actions">
          <button className="adv-btn-icon" title="History" onClick={() => setShowHistory(h => !h)}>🕐</button>
          <button className="adv-btn-icon" title="Scan math" onClick={openCamera}>📷</button>
        </div>
      </div>

      <div className="adv-body">
        {/* Display */}
        <div className="adv-display">
          <textarea className="adv-display__input" value={expression}
            onChange={e => setExpression(e.target.value)}
            placeholder="Type any expression — numeric or symbolic (x, y, z)…"
            rows={2} spellCheck={false} />
          {solved && (
            <div className="adv-display__result-block">
              <div className="adv-display__result-row">
                <span className="adv-display__equals">=</span>
                <span className={`adv-display__exact ${solved.isError ? 'adv-display__exact--error' : solved.isSymbolic ? 'adv-display__exact--symbolic' : ''}`}>
                  {solved.display}
                </span>
              </div>
              {solved.isNumeric && solved.exact !== solved.decimal && (
                <div className="adv-display__decimal">
                  <span className="adv-display__approx">≈</span>
                  <span className="adv-display__dec-val">{solved.decimal}</span>
                </div>
              )}
              {solved.isSymbolic && (
                <div className="adv-symbolic-tag">📐 Algebraic result — variables preserved</div>
              )}
              {solved.isError && <div className="adv-error-banner">⚠️ {solved.errorMessage}</div>}
              <button
                className={`adv-show-steps-btn ${solved.isError ? 'adv-show-steps-btn--error' : ''}`}
                onClick={() => setShowSteps(true)}>
                {solved.isError ? '⚠️ Show Error Details →' : 'Show Solution →'}
              </button>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="adv-angle-row">
          <span className="adv-angle-label">Angle:</span>
          {(['deg', 'rad'] as AngleMode[]).map(m => (
            <button key={m} className={`adv-angle-btn ${angleMode === m ? 'active' : ''}`} onClick={() => setAngleMode(m)}>{m.toUpperCase()}</button>
          ))}
          <button className="adv-compute-btn" onClick={compute}>= Calculate</button>
        </div>

        {/* Keyboard */}
        <div className="adv-kb-tabs">
          {(['basic', 'functions', 'trig', 'calculus'] as KeyboardMode[]).map(m => (
            <button key={m} className={`adv-kb-tab ${kbMode === m ? 'active' : ''}`} onClick={() => setKbMode(m)}>{modeLabels[m]}</button>
          ))}
        </div>
        <div className="adv-keyboard">{renderKB()}</div>
        <div className="adv-kb-hint">
          <span>💡 Powered by <strong>mathjs CAS</strong> · Variables (x,y,z) stay in result · <strong>x²</strong> squares · <strong>Enter</strong> calculates</span>
        </div>

        {/* History */}
        {showHistory && (
          <div className="adv-history">
            <div className="adv-steps__header"><span>🕐 History</span><button className="adv-steps__close" onClick={() => setShowHistory(false)}>×</button></div>
            {history.length === 0 && <p className="adv-history__empty">No history yet.</p>}
            {history.map((h, i) => (
              <div key={i} className="adv-history__entry" onClick={() => { setExpression(h.expr); setSolved(null); setShowHistory(false); }}>
                <span className="adv-history__expr">{h.expr}</span>
                <span className="adv-history__eq">= {h.result}</span>
              </div>
            ))}
          </div>
        )}

        {/* Camera */}
        {showCamera && (
          <div className="adv-modal-overlay">
            <div className="adv-modal">
              <div className="adv-modal__header"><span>📷 Scan Math Problem</span><button onClick={stopCamera} className="adv-steps__close">×</button></div>
              {cameraError ? <div className="adv-modal__error">{cameraError}</div>
                : <><video ref={videoRef} className="adv-camera-video" autoPlay playsInline muted /><canvas ref={canvasRef} style={{ display: 'none' }} />
                  <div className="adv-modal__actions"><button className="adv-compute-btn" onClick={capturePhoto}>📸 Capture</button><button className="adv-btn-secondary" onClick={stopCamera}>Cancel</button></div>
                  <div className="adv-modal__note">Point camera at a handwritten or printed math problem</div></>}
            </div>
          </div>
        )}
      </div>

      {/* Steps Modal */}
      {solved && showSteps && (
        <div className="adv-steps-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowSteps(false); }}>
          <div className="adv-steps-modal">
            <div className="adv-sm-header">
              <button className="adv-sm-back" onClick={() => setShowSteps(false)}>←</button>
              <span>Solution Steps</span>
              <button className="adv-sm-close" onClick={() => setShowSteps(false)}>✕</button>
            </div>
            <div className="adv-sm-body">
              <div className="adv-sm-summary">
                <div className="adv-sm-expr">{expression}</div>
                <div className="adv-sm-arrow">↓</div>
                <div className={`adv-sm-exact ${solved.isError ? 'adv-sm-exact--error' : solved.isSymbolic ? 'adv-sm-exact--symbolic' : ''}`}>{solved.display}</div>
                {solved.isNumeric && solved.exact !== solved.decimal && <div className="adv-sm-decimal">≈ {solved.decimal}</div>}
                {solved.isSymbolic && <div className="adv-sm-sym-note">📐 Algebraic expression with variables</div>}
              </div>
              <div className="adv-sm-steps">
                {solved.steps.map((step, i) => {
                  const isOpen = expandedStep === i;
                  const isResult = i === solved.steps.length - 1;
                  return (
                    <div key={i} className={`adv-sm-step ${isOpen ? 'open' : ''} ${isResult ? 'adv-sm-step--result' : ''} ${step.isError ? 'adv-sm-step--error' : ''}`}>
                      <button className="adv-sm-step-header" onClick={() => setExpandedStep(isOpen ? null : i)}>
                        <div className="adv-sm-step-left">
                          <span className={`adv-sm-step-expr ${isOpen ? 'highlight' : ''}`}>{step.from}</span>
                          <span className="adv-sm-step-rule">{step.ruleTitle}</span>
                        </div>
                        <div className="adv-sm-step-right">
                          {step.working && !isOpen && <span className="adv-sm-step-preview">{step.working}</span>}
                          <span className="adv-sm-step-toggle">{isOpen ? '∨' : '>'}</span>
                        </div>
                      </button>
                      {isOpen && (
                        <div className="adv-sm-step-detail">
                          <div className={`adv-sm-step-bar ${step.isError ? 'adv-sm-step-bar--error' : ''}`} />
                          <div className="adv-sm-step-content">
                            <ul className="adv-sm-bullets">{step.bullets.map((b, bi) => <li key={bi}>{b}</li>)}</ul>
                            {step.from !== step.to && step.to !== 'ERROR' && (
                              <div className="adv-sm-transform">
                                <span className="adv-sm-from">{step.from}</span>
                                <span className="adv-sm-darr">↓</span>
                                <span className="adv-sm-to">{step.to}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              {solved.isNumeric && solved.exact !== solved.decimal && (
                <div className="adv-sm-alt"><span className="adv-sm-alt-label">≈</span><span className="adv-sm-alt-val">{solved.decimal}</span></div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Guide */}
      <div className="adv-guide">
        <h2>📖 How to Use the Advanced Calculator</h2>
        <div className="adv-guide__section">
          <h3>Powered by mathjs CAS</h3>
          <p>This calculator uses <strong>mathjs v15</strong> — a full Computer Algebra System (CAS). It handles symbolic algebra, simplification, trig, logarithms, and complex expressions automatically. No manual rule-building required.</p>
        </div>
        <div className="adv-guide__section">
          <h3>Symbolic Algebra (Variables)</h3>
          <p>Expressions with variables like x, y, z are simplified algebraically and the result is shown as an expression — just like other professional calculators. No need to enter values.</p>
          <ul>
            <li><code>2x + 3x</code> → <strong>5x</strong></li>
            <li><code>x^2 × x^3</code> → <strong>x^5</strong> (index law)</li>
            <li><code>13z × 12z^(1/2)</code> → <strong>156z^(3/2)</strong></li>
            <li><code>x^(1/2) × y / 13z</code> → simplified algebraic form</li>
          </ul>
        </div>
        <div className="adv-guide__section">
          <h3>Implicit Multiplication</h3>
          <p>Automatically detected and expanded: <code>4log(27)</code> → <code>4×log(27)</code>, <code>3(x+1)</code> → <code>3×(x+1)</code>, <code>13z</code> → <code>13×z</code>.</p>
        </div>
        <div className="adv-guide__section">
          <h3>Keyboard Modes</h3>
          <ul>
            <li><strong>+ − × ÷:</strong> Arithmetic, brackets, powers, roots, π, e.</li>
            <li><strong>f(x) log ln:</strong> Logarithms (log=base 10, ln=base e), exponentials, factorials.</li>
            <li><strong>sin cos tan:</strong> All 6 trig functions + inverses + hyperbolic. Toggle DEG/RAD.</li>
            <li><strong>lim ∫ Σ:</strong> Calculus notation for reference.</li>
          </ul>
        </div>
        <div className="adv-guide__section adv-guide__note">
          <strong>ℹ️ Note:</strong> <code>log(x)</code> = logarithm base 10. <code>ln(x)</code> = natural logarithm (base e). For full equation solving, integration, and advanced CAS, see Wolfram Alpha.
        </div>
      </div>
    </div>
  );
}
