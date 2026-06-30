// ============================================================================
// Quantify — Formula Parser & Evaluator
// ============================================================================
// A complete recursive-descent parser that tokenizes mathematical expressions,
// builds an AST with correct operator precedence, and evaluates every node
// using Decimal.js for arbitrary-precision arithmetic.
//
// NO use of eval() or Function() — this is a safe, sandboxed evaluator.
// ============================================================================

import Decimal from 'decimal.js';
import type { FormulaStep } from '../types/calculator';

// ---------------------------------------------------------------------------
// AST Node Types
// ---------------------------------------------------------------------------

type ASTNode =
  | { type: 'number'; value: string }
  | { type: 'variable'; name: string }
  | { type: 'binary'; op: string; left: ASTNode; right: ASTNode }
  | { type: 'unary'; op: string; operand: ASTNode }
  | { type: 'function'; name: string; args: ASTNode[] }
  | { type: 'ternary'; condition: ASTNode; consequent: ASTNode; alternate: ASTNode };

// ---------------------------------------------------------------------------
// Token Types
// ---------------------------------------------------------------------------

interface Token {
  type: 'number' | 'identifier' | 'operator' | 'paren' | 'comma' | 'question' | 'colon';
  value: string;
}

// ---------------------------------------------------------------------------
// Constants — available as bare identifiers inside expressions
// ---------------------------------------------------------------------------

const CONSTANTS: Record<string, Decimal> = {
  PI: new Decimal(Math.PI),
  E: new Decimal(Math.E),
};

// Degree-to-radian conversion factor: π / 180
const DEG_TO_RAD = new Decimal(Math.PI).div(180);

// ---------------------------------------------------------------------------
// Tokenizer
// ---------------------------------------------------------------------------

/** Break an expression string into a flat array of tokens. */
function tokenize(expr: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < expr.length) {
    const ch = expr[i];

    // Skip whitespace
    if (/\s/.test(ch)) {
      i++;
      continue;
    }

    // Numbers: 3  3.14  .5  0.001  1e10  2.5E-3
    if (/[0-9.]/.test(ch)) {
      let num = '';
      // Integer / decimal part
      while (i < expr.length && /[0-9.]/.test(expr[i])) {
        num += expr[i++];
      }
      // Optional scientific notation (e.g. 1e10, 2.5E-3)
      if (i < expr.length && /[eE]/.test(expr[i])) {
        num += expr[i++];
        if (i < expr.length && /[+\-]/.test(expr[i])) {
          num += expr[i++];
        }
        while (i < expr.length && /[0-9]/.test(expr[i])) {
          num += expr[i++];
        }
      }
      tokens.push({ type: 'number', value: num });
      continue;
    }

    // Identifiers (variable names / function names / constants)
    if (/[a-zA-Z_]/.test(ch)) {
      let id = '';
      while (i < expr.length && /[a-zA-Z0-9_]/.test(expr[i])) {
        id += expr[i++];
      }
      tokens.push({ type: 'identifier', value: id });
      continue;
    }

    // Multi-character operators: >= <= == !=
    if (i + 1 < expr.length) {
      const two = expr[i] + expr[i + 1];
      if (two === '>=' || two === '<=' || two === '==' || two === '!=') {
        tokens.push({ type: 'operator', value: two });
        i += 2;
        continue;
      }
    }

    // Single-character operators
    if ('+-*/%^><'.includes(ch)) {
      tokens.push({ type: 'operator', value: ch });
      i++;
      continue;
    }

    // Parentheses
    if (ch === '(' || ch === ')') {
      tokens.push({ type: 'paren', value: ch });
      i++;
      continue;
    }

    // Comma (function argument separator)
    if (ch === ',') {
      tokens.push({ type: 'comma', value: ',' });
      i++;
      continue;
    }

    // Ternary operator pieces
    if (ch === '?') {
      tokens.push({ type: 'question', value: '?' });
      i++;
      continue;
    }
    if (ch === ':') {
      tokens.push({ type: 'colon', value: ':' });
      i++;
      continue;
    }

    // Unknown character — skip it silently
    i++;
  }

  return tokens;
}

// ---------------------------------------------------------------------------
// Parser  (recursive descent, returns an AST)
// ---------------------------------------------------------------------------

class Parser {
  private tokens: Token[];
  private pos: number;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
    this.pos = 0;
  }

  /** Peek at the current token without consuming it. */
  private peek(): Token | undefined {
    return this.tokens[this.pos];
  }

  /** Consume the current token and advance. */
  private consume(): Token {
    return this.tokens[this.pos++];
  }

  /** Expect a specific token value; throw if mismatch. */
  private expect(type: Token['type'], value?: string): Token {
    const tok = this.consume();
    if (!tok || tok.type !== type || (value !== undefined && tok.value !== value)) {
      throw new Error(`Expected ${type}${value ? ` '${value}'` : ''} but got ${tok ? `'${tok.value}'` : 'end of input'}`);
    }
    return tok;
  }

  // ---- Precedence levels (lowest → highest) ----

  /** Entry point: parse a full expression. */
  parse(): ASTNode {
    const node = this.parseTernary();
    if (this.pos < this.tokens.length) {
      throw new Error(`Unexpected token '${this.tokens[this.pos].value}' at position ${this.pos}`);
    }
    return node;
  }

  /** Ternary: condition ? consequent : alternate */
  private parseTernary(): ASTNode {
    let node = this.parseComparison();

    if (this.peek()?.type === 'question') {
      this.consume(); // eat '?'
      const consequent = this.parseTernary(); // right-associative
      this.expect('colon', ':');
      const alternate = this.parseTernary();
      node = { type: 'ternary', condition: node, consequent, alternate };
    }

    return node;
  }

  /** Comparison: > < >= <= == != */
  private parseComparison(): ASTNode {
    let node = this.parseAddition();

    while (this.peek()?.type === 'operator' && ['>', '<', '>=', '<=', '==', '!='].includes(this.peek()!.value)) {
      const op = this.consume().value;
      const right = this.parseAddition();
      node = { type: 'binary', op, left: node, right };
    }

    return node;
  }

  /** Addition / Subtraction (left-associative) */
  private parseAddition(): ASTNode {
    let node = this.parseMultiplication();

    while (this.peek()?.type === 'operator' && (this.peek()!.value === '+' || this.peek()!.value === '-')) {
      const op = this.consume().value;
      const right = this.parseMultiplication();
      node = { type: 'binary', op, left: node, right };
    }

    return node;
  }

  /** Multiplication / Division / Modulo (left-associative) */
  private parseMultiplication(): ASTNode {
    let node = this.parseExponent();

    while (this.peek()?.type === 'operator' && ('*/%'.includes(this.peek()!.value))) {
      const op = this.consume().value;
      const right = this.parseExponent();
      node = { type: 'binary', op, left: node, right };
    }

    return node;
  }

  /** Exponentiation (right-associative) */
  private parseExponent(): ASTNode {
    const base = this.parseUnary();

    if (this.peek()?.type === 'operator' && this.peek()!.value === '^') {
      this.consume(); // eat '^'
      const exponent = this.parseExponent(); // right-associative recursion
      return { type: 'binary', op: '^', left: base, right: exponent };
    }

    return base;
  }

  /** Unary minus: -expr */
  private parseUnary(): ASTNode {
    if (this.peek()?.type === 'operator' && this.peek()!.value === '-') {
      this.consume();
      const operand = this.parseUnary();
      return { type: 'unary', op: '-', operand };
    }
    // Unary plus is a no-op but we accept it
    if (this.peek()?.type === 'operator' && this.peek()!.value === '+') {
      this.consume();
      return this.parseUnary();
    }
    return this.parsePrimary();
  }

  /** Primary: number | variable | constant | function call | (expr) */
  private parsePrimary(): ASTNode {
    const tok = this.peek();

    if (!tok) {
      throw new Error('Unexpected end of expression');
    }

    // Numeric literal
    if (tok.type === 'number') {
      this.consume();
      return { type: 'number', value: tok.value };
    }

    // Identifier: could be a function call, constant, or variable
    if (tok.type === 'identifier') {
      this.consume();
      const name = tok.value;

      // Function call: name(arg1, arg2, ...)
      if (this.peek()?.type === 'paren' && this.peek()!.value === '(') {
        this.consume(); // eat '('
        const args: ASTNode[] = [];

        // Handle zero-argument functions
        if (!(this.peek()?.type === 'paren' && this.peek()!.value === ')')) {
          args.push(this.parseTernary());
          while (this.peek()?.type === 'comma') {
            this.consume(); // eat ','
            args.push(this.parseTernary());
          }
        }

        this.expect('paren', ')');
        return { type: 'function', name, args };
      }

      // Bare identifier (constant or variable)
      return { type: 'variable', name };
    }

    // Parenthesized sub-expression
    if (tok.type === 'paren' && tok.value === '(') {
      this.consume(); // eat '('
      const node = this.parseTernary();
      this.expect('paren', ')');
      return node;
    }

    throw new Error(`Unexpected token '${tok.value}'`);
  }
}

// ---------------------------------------------------------------------------
// Evaluator  (walks the AST, returns a Decimal)
// ---------------------------------------------------------------------------

/** Evaluate an AST node given a variable context map. */
function evaluate(node: ASTNode, ctx: Record<string, Decimal>): Decimal {
  switch (node.type) {
    // --- Literal number ---
    case 'number':
      return new Decimal(node.value);

    // --- Variable / constant lookup ---
    case 'variable':
      if (node.name in CONSTANTS) return CONSTANTS[node.name];
      if (node.name in ctx) return ctx[node.name];
      return new Decimal(NaN); // unknown variable

    // --- Unary operators ---
    case 'unary': {
      const operand = evaluate(node.operand, ctx);
      if (node.op === '-') return operand.neg();
      return operand; // '+' is identity
    }

    // --- Binary operators ---
    case 'binary': {
      const left = evaluate(node.left, ctx);
      const right = evaluate(node.right, ctx);

      switch (node.op) {
        case '+': return left.plus(right);
        case '-': return left.minus(right);
        case '*': return left.times(right);
        case '/': return right.isZero() ? new Decimal(0) : left.div(right);
        case '%': return right.isZero() ? new Decimal(0) : left.mod(right);
        case '^': return left.pow(right);
        // Comparisons return 1 (true) or 0 (false)
        case '>':  return new Decimal(left.gt(right)  ? 1 : 0);
        case '<':  return new Decimal(left.lt(right)  ? 1 : 0);
        case '>=': return new Decimal(left.gte(right) ? 1 : 0);
        case '<=': return new Decimal(left.lte(right) ? 1 : 0);
        case '==': return new Decimal(left.eq(right)  ? 1 : 0);
        case '!=': return new Decimal(left.eq(right)  ? 0 : 1);
        default:   return new Decimal(NaN);
      }
    }

    // --- Ternary conditional ---
    case 'ternary': {
      const cond = evaluate(node.condition, ctx);
      // Any non-zero value is truthy
      return !cond.isZero() ? evaluate(node.consequent, ctx) : evaluate(node.alternate, ctx);
    }

    // --- Function calls ---
    case 'function': {
      const args = node.args.map((a) => evaluate(a, ctx));
      return callFunction(node.name, args);
    }

    default:
      return new Decimal(NaN);
  }
}

// ---------------------------------------------------------------------------
// Built-in function dispatch
// ---------------------------------------------------------------------------

/** Dispatch a named function call with pre-evaluated Decimal arguments. */
function callFunction(name: string, args: Decimal[]): Decimal {
  switch (name) {
    // ── Basic math ──────────────────────────────────────────────────────
    case 'sqrt':  return args[0]?.sqrt() ?? new Decimal(NaN);
    case 'abs':   return args[0]?.abs() ?? new Decimal(NaN);
    case 'ceil':  return args[0]?.ceil() ?? new Decimal(NaN);
    case 'floor': return args[0]?.floor() ?? new Decimal(NaN);
    case 'round': {
      if (args.length >= 2) {
        // round(value, decimals)
        const dp = args[1].toNumber();
        return args[0].toDecimalPlaces(dp, Decimal.ROUND_HALF_UP);
      }
      return args[0]?.round() ?? new Decimal(NaN);
    }
    case 'exp':   return args[0]?.exp() ?? new Decimal(NaN);
    case 'ln':    return args[0]?.ln() ?? new Decimal(NaN);
    case 'log':   return args[0] ? args[0].ln().div(new Decimal(10).ln()) : new Decimal(NaN);
    case 'trunc': return args[0]?.trunc() ?? new Decimal(NaN);
    case 'sign':  return args[0] ? new Decimal(args[0].isPositive() ? 1 : args[0].isNegative() ? -1 : 0) : new Decimal(NaN);

    // ── Trig — convert degrees to radians ───────────────────────────────
    case 'sin': return args[0] ? new Decimal(Math.sin(args[0].times(DEG_TO_RAD).toNumber())) : new Decimal(NaN);
    case 'cos': return args[0] ? new Decimal(Math.cos(args[0].times(DEG_TO_RAD).toNumber())) : new Decimal(NaN);
    case 'tan': return args[0] ? new Decimal(Math.tan(args[0].times(DEG_TO_RAD).toNumber())) : new Decimal(NaN);

    // ── Multi-argument math ─────────────────────────────────────────────
    case 'min': return args.length > 0 ? Decimal.min(...args) : new Decimal(NaN);
    case 'max': return args.length > 0 ? Decimal.max(...args) : new Decimal(NaN);
    case 'pow': return args.length >= 2 ? args[0].pow(args[1]) : new Decimal(NaN);
    case 'mod': return args.length >= 2 && !args[1].isZero() ? args[0].mod(args[1]) : new Decimal(NaN);

    // ═══════════════════════════════════════════════════════════════════
    //  FINANCIAL FUNCTIONS
    // ═══════════════════════════════════════════════════════════════════

    // ── pmt(rate, nper, pv [, fv=0]) ────────────────────────────────────
    // Standard annuity payment. Positive = payment out.
    // PMT = rate * (PV * (1+r)^n + FV) / ((1+r)^n - 1)   (when rate ≠ 0)
    case 'pmt': {
      if (args.length < 3) return new Decimal(NaN);
      const [r, n, pv_val] = args;
      const fv_val = args[3] ?? new Decimal(0);
      if (r.isZero()) {
        // Simple division when rate is 0
        return n.isZero() ? new Decimal(NaN) : pv_val.plus(fv_val).div(n).neg();
      }
      const compounded = r.plus(1).pow(n);
      return r.times(pv_val.times(compounded).plus(fv_val))
        .div(compounded.minus(1))
        .neg();
    }

    // ── fv(rate, nper, pmt, pv) ─────────────────────────────────────────
    // Future Value of an annuity + lump sum.
    // FV = -PV*(1+r)^n - PMT*((1+r)^n - 1)/r
    case 'fv': {
      if (args.length < 4) return new Decimal(NaN);
      const [r, n, payment, pv_val] = args;
      if (r.isZero()) {
        return pv_val.plus(payment.times(n)).neg();
      }
      const compounded = r.plus(1).pow(n);
      return pv_val.times(compounded)
        .plus(payment.times(compounded.minus(1)).div(r))
        .neg();
    }

    // ── pv(rate, nper, pmt [, fv=0]) ────────────────────────────────────
    // Present Value.
    // PV = (-FV - PMT*((1+r)^n - 1)/r) / (1+r)^n
    case 'pv': {
      if (args.length < 3) return new Decimal(NaN);
      const [r, n, payment] = args;
      const fv_val = args[3] ?? new Decimal(0);
      if (r.isZero()) {
        return payment.times(n).plus(fv_val).neg();
      }
      const compounded = r.plus(1).pow(n);
      return fv_val.neg()
        .minus(payment.times(compounded.minus(1)).div(r))
        .div(compounded);
    }

    // ── nper(rate, pmt, pv [, fv=0]) ────────────────────────────────────
    // Number of periods to reach FV.
    // n = ln((-FV*r + PMT) / (PV*r + PMT)) / ln(1+r)
    case 'nper': {
      if (args.length < 3) return new Decimal(NaN);
      const [r, payment, pv_val] = args;
      const fv_val = args[3] ?? new Decimal(0);
      if (r.isZero()) {
        return payment.isZero() ? new Decimal(NaN) : pv_val.plus(fv_val).div(payment).neg();
      }
      const numerator = payment.minus(fv_val.times(r));
      const denominator = payment.plus(pv_val.times(r));
      if (numerator.isZero() || denominator.isZero()) return new Decimal(NaN);
      if (numerator.div(denominator).lte(0)) return new Decimal(NaN);
      return numerator.div(denominator).ln().div(r.plus(1).ln());
    }

    // ── rate(nper, pmt, pv [, fv=0]) ────────────────────────────────────
    // Solve for interest rate using Newton-Raphson iteration.
    case 'rate': {
      if (args.length < 3) return new Decimal(NaN);
      const nper = args[0].toNumber();
      const payment = args[1].toNumber();
      const pv_val = args[2].toNumber();
      const fv_val = args[3]?.toNumber() ?? 0;
      let guess = 0.1;
      for (let i = 0; i < 200; i++) {
        const g1 = Math.pow(1 + guess, nper);
        const fVal = pv_val * g1 + payment * (g1 - 1) / guess + fv_val;
        const fDeriv = nper * pv_val * Math.pow(1 + guess, nper - 1)
          + payment * (nper * Math.pow(1 + guess, nper - 1) * guess - (g1 - 1)) / (guess * guess);
        if (Math.abs(fDeriv) < 1e-15) break;
        const newGuess = guess - fVal / fDeriv;
        if (Math.abs(newGuess - guess) < 1e-10) {
          return new Decimal(newGuess);
        }
        guess = newGuess;
      }
      return new Decimal(guess);
    }

    // ── npv(rate, cf0, cf1, cf2, ...) ───────────────────────────────────
    // Net Present Value: NPV = Σ CFt / (1+r)^t
    case 'npv': {
      if (args.length < 2) return new Decimal(NaN);
      const r = args[0];
      let result = new Decimal(0);
      for (let t = 1; t < args.length; t++) {
        result = result.plus(args[t].div(r.plus(1).pow(t - 1)));
      }
      return result;
    }

    // ── irr(cf0, cf1, cf2, ...) ─────────────────────────────────────────
    // Internal Rate of Return using bisection method.
    case 'irr': {
      if (args.length < 2) return new Decimal(NaN);
      const cfs = args.map(a => a.toNumber());
      let lo = -0.99, hi = 10.0;
      const npvCalc = (rate: number) => {
        let sum = 0;
        for (let t = 0; t < cfs.length; t++) {
          sum += cfs[t] / Math.pow(1 + rate, t);
        }
        return sum;
      };
      for (let i = 0; i < 300; i++) {
        const mid = (lo + hi) / 2;
        const val = npvCalc(mid);
        if (Math.abs(val) < 1e-10 || (hi - lo) < 1e-12) {
          return new Decimal(mid);
        }
        if (npvCalc(lo) * val < 0) { hi = mid; } else { lo = mid; }
      }
      return new Decimal((lo + hi) / 2);
    }

    // ── cdf(x) ──────────────────────────────────────────────────────────
    // Cumulative standard normal distribution (Abramowitz & Stegun approx).
    // Used by Black-Scholes.
    case 'cdf': {
      if (!args[0]) return new Decimal(NaN);
      const x = args[0].toNumber();
      // Abramowitz & Stegun 26.2.17 approximation
      const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741;
      const a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
      const sign = x < 0 ? -1 : 1;
      const absX = Math.abs(x) / Math.sqrt(2);
      const t = 1.0 / (1.0 + p * absX);
      const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX);
      return new Decimal(0.5 * (1.0 + sign * y));
    }

    // ── bond_price(face, couponRate, ytm, periods) ──────────────────────
    // Bond price = PV of coupon annuity + PV of face value
    case 'bond_price': {
      if (args.length < 4) return new Decimal(NaN);
      const [face, couponRate, ytm, periods] = args;
      const coupon = face.times(couponRate);
      if (ytm.isZero()) return coupon.times(periods).plus(face);
      const discount = ytm.plus(1).pow(periods);
      const pvCoupons = coupon.times(new Decimal(1).minus(discount.pow(-1))).div(ytm);
      const pvFace = face.div(discount);
      return pvCoupons.plus(pvFace);
    }

    // ── macaulay_dur(face, couponRate, ytm, periods) ────────────────────
    // Macaulay Duration = Σ [t * CFt / (1+y)^t] / Price
    case 'macaulay_dur': {
      if (args.length < 4) return new Decimal(NaN);
      const [face, couponRate, ytm, periods] = args;
      const coupon = face.times(couponRate);
      const n = periods.toNumber();
      let priceSum = new Decimal(0);
      let weightedSum = new Decimal(0);
      for (let t = 1; t <= n; t++) {
        const df = ytm.plus(1).pow(t);
        const pvCF = t < n ? coupon.div(df) : coupon.plus(face).div(df);
        priceSum = priceSum.plus(pvCF);
        weightedSum = weightedSum.plus(pvCF.times(t));
      }
      return priceSum.isZero() ? new Decimal(NaN) : weightedSum.div(priceSum);
    }

    // ── annuity_fv(pmt, rate, nper) ─────────────────────────────────────
    // Future Value of an ordinary annuity: FV = PMT * ((1+r)^n - 1) / r
    case 'annuity_fv': {
      if (args.length < 3) return new Decimal(NaN);
      const [payment, r, n] = args;
      if (r.isZero()) return payment.times(n);
      return payment.times(r.plus(1).pow(n).minus(1).div(r));
    }

    // ── annuity_pv(pmt, rate, nper) ─────────────────────────────────────
    // Present Value of an ordinary annuity: PV = PMT * (1 - (1+r)^-n) / r
    case 'annuity_pv': {
      if (args.length < 3) return new Decimal(NaN);
      const [payment, r, n] = args;
      if (r.isZero()) return payment.times(n);
      return payment.times(new Decimal(1).minus(r.plus(1).pow(n.neg())).div(r));
    }

    default:
      return new Decimal(NaN); // unknown function
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Parse and evaluate a single mathematical expression.
 *
 * @param expression  The expression string, e.g. "sqrt(a^2 + b^2)"
 * @param context     A map of variable names → Decimal values
 * @returns           The computed Decimal result
 */
export function evaluateExpression(
  expression: string,
  context: Record<string, Decimal>,
): Decimal {
  try {
    const tokens = tokenize(expression);
    if (tokens.length === 0) return new Decimal(NaN);

    const parser = new Parser(tokens);
    const ast = parser.parse();

    return evaluate(ast, context);
  } catch {
    // Any parse or evaluation error → NaN
    return new Decimal(NaN);
  }
}

/**
 * Evaluate an ordered list of formula steps.
 *
 * Each step may reference:
 *  - keys from `inputs` (raw user-entered values)
 *  - IDs of *earlier* steps (computed in order)
 *
 * @param formulas  Ordered formula steps from the calculator schema
 * @param inputs    A map of input field IDs → Decimal values
 * @returns         A map of formula step IDs → computed Decimal values
 */
export function evaluateFormulas(
  formulas: FormulaStep[],
  inputs: Record<string, Decimal>,
): Record<string, Decimal> {
  // Start the context with all input values
  const context: Record<string, Decimal> = { ...inputs };
  const results: Record<string, Decimal> = {};

  for (const step of formulas) {
    const value = evaluateExpression(step.expression, context);
    // Make this result available to subsequent steps
    context[step.id] = value;
    results[step.id] = value;
  }

  return results;
}
