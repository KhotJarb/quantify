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
    case 'sqrt':  return args[0]?.sqrt() ?? new Decimal(NaN);
    case 'abs':   return args[0]?.abs() ?? new Decimal(NaN);
    case 'ceil':  return args[0]?.ceil() ?? new Decimal(NaN);
    case 'floor': return args[0]?.floor() ?? new Decimal(NaN);
    case 'round': return args[0]?.round() ?? new Decimal(NaN);
    case 'exp':   return args[0]?.exp() ?? new Decimal(NaN);
    case 'ln':    return args[0]?.ln() ?? new Decimal(NaN);
    case 'log':   return args[0] ? args[0].ln().div(new Decimal(10).ln()) : new Decimal(NaN); // log base 10

    // Trig — convert degrees to radians before calling Math.*
    case 'sin': return args[0] ? new Decimal(Math.sin(args[0].times(DEG_TO_RAD).toNumber())) : new Decimal(NaN);
    case 'cos': return args[0] ? new Decimal(Math.cos(args[0].times(DEG_TO_RAD).toNumber())) : new Decimal(NaN);
    case 'tan': return args[0] ? new Decimal(Math.tan(args[0].times(DEG_TO_RAD).toNumber())) : new Decimal(NaN);

    // Multi-argument functions
    case 'min': return args.length > 0 ? Decimal.min(...args) : new Decimal(NaN);
    case 'max': return args.length > 0 ? Decimal.max(...args) : new Decimal(NaN);
    case 'pow': return args.length >= 2 ? args[0].pow(args[1]) : new Decimal(NaN);

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
