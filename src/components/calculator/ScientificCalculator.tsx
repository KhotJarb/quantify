'use client';

import { useState, useCallback, useEffect } from 'react';
import Decimal from 'decimal.js';

Decimal.set({ precision: 20, rounding: Decimal.ROUND_HALF_UP });

type AngleMode = 'DEG' | 'RAD';

interface ButtonDef {
  label: string;
  action: string;
  type: 'num' | 'op' | 'func' | 'equals' | 'mem' | 'mode';
  span?: number;
}

const BUTTONS: ButtonDef[][] = [
  [
    { label: 'DEG', action: 'toggleAngle', type: 'mode' },
    { label: 'sin', action: 'fn:sin', type: 'func' },
    { label: 'cos', action: 'fn:cos', type: 'func' },
    { label: 'tan', action: 'fn:tan', type: 'func' },
    { label: 'π', action: 'const:PI', type: 'func' },
  ],
  [
    { label: 'x²', action: 'fn:sq', type: 'func' },
    { label: '√', action: 'fn:sqrt', type: 'func' },
    { label: 'xʸ', action: 'op:^', type: 'op' },
    { label: 'log', action: 'fn:log', type: 'func' },
    { label: 'ln', action: 'fn:ln', type: 'func' },
  ],
  [
    { label: '(', action: 'paren:(', type: 'func' },
    { label: ')', action: 'paren:)', type: 'func' },
    { label: '%', action: 'fn:pct', type: 'func' },
    { label: '1/x', action: 'fn:inv', type: 'func' },
    { label: 'e', action: 'const:E', type: 'func' },
  ],
  [
    { label: 'MC', action: 'mem:clear', type: 'mem' },
    { label: 'MR', action: 'mem:recall', type: 'mem' },
    { label: 'M+', action: 'mem:add', type: 'mem' },
    { label: 'M−', action: 'mem:sub', type: 'mem' },
    { label: 'CE', action: 'clearEntry', type: 'func' },
  ],
  [
    { label: '7', action: '7', type: 'num' },
    { label: '8', action: '8', type: 'num' },
    { label: '9', action: '9', type: 'num' },
    { label: '÷', action: 'op:/', type: 'op' },
    { label: 'C', action: 'clear', type: 'func' },
  ],
  [
    { label: '4', action: '4', type: 'num' },
    { label: '5', action: '5', type: 'num' },
    { label: '6', action: '6', type: 'num' },
    { label: '×', action: 'op:*', type: 'op' },
    { label: '⌫', action: 'backspace', type: 'func' },
  ],
  [
    { label: '1', action: '1', type: 'num' },
    { label: '2', action: '2', type: 'num' },
    { label: '3', action: '3', type: 'num' },
    { label: '−', action: 'op:-', type: 'op' },
    { label: '=', action: 'equals', type: 'equals' },
  ],
  [
    { label: '±', action: 'negate', type: 'func' },
    { label: '0', action: '0', type: 'num' },
    { label: '.', action: '.', type: 'num' },
    { label: '+', action: 'op:+', type: 'op' },
    // = is in row above, spanning
  ],
];

function evalExpr(expr: string): Decimal {
  // Simple recursive-descent evaluator using Decimal.js
  // Supported: +, -, *, /, ^, parentheses, numbers
  let pos = 0;
  const s = expr.replace(/\s/g, '');

  function peek() { return s[pos]; }
  function consume() { return s[pos++]; }

  function parseExpr(): Decimal { return parseAddSub(); }

  function parseAddSub(): Decimal {
    let left = parseMulDiv();
    while (pos < s.length && (peek() === '+' || peek() === '-')) {
      const op = consume();
      const right = parseMulDiv();
      left = op === '+' ? left.plus(right) : left.minus(right);
    }
    return left;
  }

  function parseMulDiv(): Decimal {
    let left = parsePow();
    while (pos < s.length && (peek() === '*' || peek() === '/')) {
      const op = consume();
      const right = parsePow();
      left = op === '*' ? left.times(right) : left.dividedBy(right);
    }
    return left;
  }

  function parsePow(): Decimal {
    let base = parseUnary();
    if (pos < s.length && peek() === '^') {
      consume();
      const exp = parsePow(); // right-associative
      base = base.pow(exp);
    }
    return base;
  }

  function parseUnary(): Decimal {
    if (peek() === '-') { consume(); return parsePrimary().negated(); }
    if (peek() === '+') { consume(); }
    return parsePrimary();
  }

  function parsePrimary(): Decimal {
    if (peek() === '(') {
      consume();
      const val = parseExpr();
      if (peek() === ')') consume();
      return val;
    }
    // Number
    let numStr = '';
    while (pos < s.length && (peek() === '.' || (peek() >= '0' && peek() <= '9') || peek() === 'e' || (peek() === '+' && numStr.includes('e')) || (peek() === '-' && numStr.includes('e')))) {
      numStr += consume();
    }
    return new Decimal(numStr || '0');
  }

  return parseExpr();
}

export default function ScientificCalculator() {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [history, setHistory] = useState('');
  const [memory, setMemory] = useState<Decimal>(new Decimal(0));
  const [hasMemory, setHasMemory] = useState(false);
  const [angleMode, setAngleMode] = useState<AngleMode>('DEG');
  const [justEvaled, setJustEvaled] = useState(false);

  const toRad = useCallback((val: Decimal) => {
    return angleMode === 'DEG' ? val.times(Decimal.acos(-1)).dividedBy(180) : val;
  }, [angleMode]);

  const formatResult = (d: Decimal): string => {
    try {
      const str = d.toSignificantDigits(14).toString();
      return str;
    } catch {
      return 'Error';
    }
  };

  const appendToDisplay = useCallback((char: string) => {
    if (justEvaled && !isNaN(Number(char))) {
      setDisplay(char);
      setExpression(char);
      setJustEvaled(false);
    } else {
      const newExpr = justEvaled ? char : (display === '0' && char !== '.' ? char : display + char);
      setDisplay(newExpr);
      setExpression(newExpr);
      setJustEvaled(false);
    }
  }, [display, justEvaled]);

  const applyFunction = useCallback((fn: string) => {
    try {
      const val = new Decimal(display === '' ? '0' : display);
      let result: Decimal;
      switch (fn) {
        case 'sin': result = new Decimal(Math.sin(toRad(val).toNumber())); break;
        case 'cos': result = new Decimal(Math.cos(toRad(val).toNumber())); break;
        case 'tan': result = new Decimal(Math.tan(toRad(val).toNumber())); break;
        case 'sqrt': result = val.sqrt(); break;
        case 'sq': result = val.pow(2); break;
        case 'log': result = Decimal.log10(val); break;
        case 'ln': result = Decimal.ln(val); break;
        case 'inv': result = new Decimal(1).dividedBy(val); break;
        case 'pct': result = val.dividedBy(100); break;
        default: return;
      }
      const formatted = formatResult(result);
      setHistory(`${fn}(${display}) =`);
      setDisplay(formatted);
      setExpression(formatted);
      setJustEvaled(true);
    } catch {
      setDisplay('Error');
      setJustEvaled(true);
    }
  }, [display, toRad]);

  const handleAction = useCallback((action: string) => {
    if (action === 'clear') {
      setDisplay('0'); setExpression(''); setHistory(''); setJustEvaled(false);
    } else if (action === 'clearEntry') {
      setDisplay('0'); setJustEvaled(false);
    } else if (action === 'backspace') {
      if (display.length <= 1) setDisplay('0');
      else setDisplay(display.slice(0, -1));
    } else if (action === 'negate') {
      if (display !== '0' && display !== 'Error') setDisplay(new Decimal(display).negated().toString());
    } else if (action === 'toggleAngle') {
      setAngleMode(m => m === 'DEG' ? 'RAD' : 'DEG');
    } else if (action.startsWith('fn:')) {
      applyFunction(action.slice(3));
    } else if (action.startsWith('const:')) {
      const c = action.slice(6);
      const val = c === 'PI' ? Decimal.acos(-1).toString() : Decimal.exp(1).toString();
      setDisplay(val); setExpression(val); setJustEvaled(true);
    } else if (action.startsWith('op:')) {
      const op = action.slice(3);
      const newExpr = (justEvaled ? display : display) + op;
      setDisplay(newExpr);
      setExpression(newExpr);
      setJustEvaled(false);
    } else if (action.startsWith('paren:')) {
      appendToDisplay(action.slice(6));
    } else if (action === 'equals') {
      try {
        const result = evalExpr(display);
        const formatted = formatResult(result);
        setHistory(`${display} =`);
        setDisplay(formatted);
        setExpression(formatted);
        setJustEvaled(true);
      } catch {
        setDisplay('Error');
        setJustEvaled(true);
      }
    } else if (action === 'mem:clear') {
      setMemory(new Decimal(0)); setHasMemory(false);
    } else if (action === 'mem:recall') {
      setDisplay(formatResult(memory)); setJustEvaled(true);
    } else if (action === 'mem:add') {
      try { setMemory(memory.plus(new Decimal(display))); setHasMemory(true); } catch {}
    } else if (action === 'mem:sub') {
      try { setMemory(memory.minus(new Decimal(display))); setHasMemory(true); } catch {}
    } else if (action === '.') {
      if (!display.split(/[+\-*/^]/).pop()!.includes('.')) appendToDisplay('.');
    } else {
      // Digit
      appendToDisplay(action);
    }
  }, [display, justEvaled, memory, applyFunction, appendToDisplay]);

  // Keyboard support
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') { e.preventDefault(); handleAction(e.key); }
      else if (e.key === '.') { e.preventDefault(); handleAction('.'); }
      else if (e.key === '+') { e.preventDefault(); handleAction('op:+'); }
      else if (e.key === '-') { e.preventDefault(); handleAction('op:-'); }
      else if (e.key === '*') { e.preventDefault(); handleAction('op:*'); }
      else if (e.key === '/') { e.preventDefault(); handleAction('op:/'); }
      else if (e.key === '^') { e.preventDefault(); handleAction('op:^'); }
      else if (e.key === 'Enter' || e.key === '=') { e.preventDefault(); handleAction('equals'); }
      else if (e.key === 'Escape') { e.preventDefault(); handleAction('clear'); }
      else if (e.key === 'Backspace') { e.preventDefault(); handleAction('backspace'); }
      else if (e.key === '(') { e.preventDefault(); handleAction('paren:('); }
      else if (e.key === ')') { e.preventDefault(); handleAction('paren:)'); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleAction]);

  const getFontSize = () => {
    const len = display.length;
    if (len <= 12) return '1.8rem';
    if (len <= 18) return '1.4rem';
    return '1.1rem';
  };

  return (
    <div className="sci-calc">
      {/* Display */}
      <div className="sci-calc__display">
        <div className="sci-calc__angle-badge">{angleMode}</div>
        {hasMemory && <div className="sci-calc__memory-badge">M</div>}
        <div className="sci-calc__history">{history || '\u00A0'}</div>
        <div className="sci-calc__value" style={{ fontSize: getFontSize() }}>{display}</div>
      </div>

      {/* Buttons */}
      <div className="sci-calc__grid">
        {BUTTONS.flat().map((btn, i) => (
          <button
            key={i}
            className={`sci-calc__btn sci-calc__btn--${btn.type}${btn.action === 'toggleAngle' ? ' sci-calc__btn--active-mode' : ''}`}
            onClick={() => handleAction(btn.action)}
            title={btn.action}
            style={btn.span ? { gridColumn: `span ${btn.span}` } : {}}
          >
            {btn.label === 'DEG' ? angleMode : btn.label}
          </button>
        ))}
      </div>
    </div>
  );
}
