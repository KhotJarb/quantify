'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Decimal from 'decimal.js';

// Configure Decimal.js for high precision
Decimal.set({ precision: 20, rounding: Decimal.ROUND_HALF_UP });

type Operation = '+' | '-' | '×' | '÷' | null;

export default function StandardCalculator() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [operation, setOperation] = useState<Operation>(null);
  const [shouldResetDisplay, setShouldResetDisplay] = useState(false);
  const [history, setHistory] = useState<string>('');
  const [memory, setMemory] = useState<Decimal>(new Decimal(0));
  const [hasMemory, setHasMemory] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Format number for display (remove trailing zeros but keep precision)
  const formatDisplay = (value: string): string => {
    if (value === 'Error' || value === 'Infinity' || value === '-Infinity') return 'Error';
    try {
      const d = new Decimal(value);
      const str = d.toFixed();
      // If it's a very long number, use scientific notation
      if (str.replace('-', '').replace('.', '').length > 14) {
        return d.toPrecision(10).replace(/\.?0+$/, '');
      }
      return str;
    } catch {
      return value;
    }
  };

  const inputDigit = useCallback((digit: string) => {
    if (shouldResetDisplay) {
      setDisplay(digit);
      setShouldResetDisplay(false);
    } else {
      // Limit display length
      if (display.replace(/[-.]/g, '').length >= 15) return;
      setDisplay(display === '0' && digit !== '.' ? digit : display + digit);
    }
  }, [display, shouldResetDisplay]);

  const inputDecimal = useCallback(() => {
    if (shouldResetDisplay) {
      setDisplay('0.');
      setShouldResetDisplay(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  }, [display, shouldResetDisplay]);

  const performCalculation = useCallback((): string => {
    if (previousValue === null || operation === null) return display;
    try {
      const prev = new Decimal(previousValue);
      const curr = new Decimal(display);
      let result: Decimal;
      switch (operation) {
        case '+': result = prev.plus(curr); break;
        case '-': result = prev.minus(curr); break;
        case '×': result = prev.times(curr); break;
        case '÷':
          if (curr.isZero()) return 'Error';
          result = prev.dividedBy(curr);
          break;
        default: return display;
      }
      return formatDisplay(result.toString());
    } catch {
      return 'Error';
    }
  }, [previousValue, operation, display]);

  const handleOperation = useCallback((op: Operation) => {
    if (previousValue !== null && operation && !shouldResetDisplay) {
      // Chain operations
      const result = performCalculation();
      setDisplay(result);
      setPreviousValue(result === 'Error' ? null : result);
      setHistory(result === 'Error' ? '' : `${result} ${op}`);
    } else {
      setPreviousValue(display);
      setHistory(`${display} ${op}`);
    }
    setOperation(op);
    setShouldResetDisplay(true);
  }, [display, previousValue, operation, shouldResetDisplay, performCalculation]);

  const handleEquals = useCallback(() => {
    if (previousValue === null || operation === null) return;
    const result = performCalculation();
    setHistory(`${previousValue} ${operation} ${display} =`);
    setDisplay(result);
    setPreviousValue(null);
    setOperation(null);
    setShouldResetDisplay(true);
  }, [previousValue, operation, display, performCalculation]);

  const handleClear = useCallback(() => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setShouldResetDisplay(false);
    setHistory('');
  }, []);

  const handleClearEntry = useCallback(() => {
    setDisplay('0');
    setShouldResetDisplay(false);
  }, []);

  const handleBackspace = useCallback(() => {
    if (shouldResetDisplay) return;
    if (display.length === 1 || (display.length === 2 && display.startsWith('-'))) {
      setDisplay('0');
    } else {
      setDisplay(display.slice(0, -1));
    }
  }, [display, shouldResetDisplay]);

  const handlePercent = useCallback(() => {
    try {
      const d = new Decimal(display);
      if (previousValue !== null && (operation === '+' || operation === '-')) {
        // Percentage of the previous value
        const result = new Decimal(previousValue).times(d).dividedBy(100);
        setDisplay(formatDisplay(result.toString()));
      } else {
        setDisplay(formatDisplay(d.dividedBy(100).toString()));
      }
      setShouldResetDisplay(true);
    } catch {
      setDisplay('Error');
    }
  }, [display, previousValue, operation]);

  const handleNegate = useCallback(() => {
    if (display === '0' || display === 'Error') return;
    try {
      const d = new Decimal(display);
      setDisplay(formatDisplay(d.negated().toString()));
    } catch {
      /* ignore */
    }
  }, [display]);

  const handleSquareRoot = useCallback(() => {
    try {
      const d = new Decimal(display);
      if (d.isNegative()) { setDisplay('Error'); return; }
      setDisplay(formatDisplay(d.sqrt().toString()));
      setShouldResetDisplay(true);
    } catch {
      setDisplay('Error');
    }
  }, [display]);

  // Memory functions
  const handleMemoryClear = useCallback(() => { setMemory(new Decimal(0)); setHasMemory(false); }, []);
  const handleMemoryRecall = useCallback(() => {
    if (hasMemory) { setDisplay(formatDisplay(memory.toString())); setShouldResetDisplay(true); }
  }, [memory, hasMemory]);
  const handleMemoryAdd = useCallback(() => {
    try { setMemory(memory.plus(new Decimal(display))); setHasMemory(true); } catch { /* ignore */ }
  }, [display, memory]);
  const handleMemorySubtract = useCallback(() => {
    try { setMemory(memory.minus(new Decimal(display))); setHasMemory(true); } catch { /* ignore */ }
  }, [display, memory]);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') { e.preventDefault(); inputDigit(e.key); }
      else if (e.key === '.') { e.preventDefault(); inputDecimal(); }
      else if (e.key === '+') { e.preventDefault(); handleOperation('+'); }
      else if (e.key === '-') { e.preventDefault(); handleOperation('-'); }
      else if (e.key === '*') { e.preventDefault(); handleOperation('×'); }
      else if (e.key === '/') { e.preventDefault(); handleOperation('÷'); }
      else if (e.key === 'Enter' || e.key === '=') { e.preventDefault(); handleEquals(); }
      else if (e.key === 'Escape') { e.preventDefault(); handleClear(); }
      else if (e.key === 'Backspace') { e.preventDefault(); handleBackspace(); }
      else if (e.key === '%') { e.preventDefault(); handlePercent(); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inputDigit, inputDecimal, handleOperation, handleEquals, handleClear, handleBackspace, handlePercent]);

  // Auto-size display text
  const getDisplayFontSize = () => {
    const len = display.length;
    if (len <= 8) return '2.75rem';
    if (len <= 12) return '2rem';
    if (len <= 16) return '1.5rem';
    return '1.2rem';
  };

  return (
    <div className="std-calc" ref={containerRef}>
      {/* Display */}
      <div className="std-calc__display">
        <div className="std-calc__history">{history || '\u00A0'}</div>
        <div className="std-calc__value" style={{ fontSize: getDisplayFontSize() }}>
          {display}
        </div>
        {hasMemory && <div className="std-calc__memory-indicator">M</div>}
      </div>

      {/* Memory row */}
      <div className="std-calc__row std-calc__row--memory">
        <button className="std-calc__btn std-calc__btn--memory" onClick={handleMemoryClear} title="Memory Clear">MC</button>
        <button className="std-calc__btn std-calc__btn--memory" onClick={handleMemoryRecall} title="Memory Recall">MR</button>
        <button className="std-calc__btn std-calc__btn--memory" onClick={handleMemoryAdd} title="Memory Add">M+</button>
        <button className="std-calc__btn std-calc__btn--memory" onClick={handleMemorySubtract} title="Memory Subtract">M−</button>
      </div>

      {/* Button grid */}
      <div className="std-calc__grid">
        {/* Row 1 */}
        <button className="std-calc__btn std-calc__btn--func" onClick={handlePercent}>%</button>
        <button className="std-calc__btn std-calc__btn--func" onClick={handleClearEntry}>CE</button>
        <button className="std-calc__btn std-calc__btn--func" onClick={handleClear}>C</button>
        <button className="std-calc__btn std-calc__btn--func" onClick={handleBackspace}>⌫</button>

        {/* Row 2 */}
        <button className="std-calc__btn std-calc__btn--func" onClick={handleSquareRoot}>√</button>
        <button className="std-calc__btn std-calc__btn--num" onClick={() => inputDigit('7')}>7</button>
        <button className="std-calc__btn std-calc__btn--num" onClick={() => inputDigit('8')}>8</button>
        <button className="std-calc__btn std-calc__btn--num" onClick={() => inputDigit('9')}>9</button>

        {/* Row 3 */}
        <button className="std-calc__btn std-calc__btn--op" onClick={() => handleOperation('÷')}>÷</button>
        <button className="std-calc__btn std-calc__btn--num" onClick={() => inputDigit('4')}>4</button>
        <button className="std-calc__btn std-calc__btn--num" onClick={() => inputDigit('5')}>5</button>
        <button className="std-calc__btn std-calc__btn--num" onClick={() => inputDigit('6')}>6</button>

        {/* Row 4 */}
        <button className="std-calc__btn std-calc__btn--op" onClick={() => handleOperation('×')}>×</button>
        <button className="std-calc__btn std-calc__btn--num" onClick={() => inputDigit('1')}>1</button>
        <button className="std-calc__btn std-calc__btn--num" onClick={() => inputDigit('2')}>2</button>
        <button className="std-calc__btn std-calc__btn--num" onClick={() => inputDigit('3')}>3</button>

        {/* Row 5 */}
        <button className="std-calc__btn std-calc__btn--op" onClick={() => handleOperation('-')}>−</button>
        <button className="std-calc__btn std-calc__btn--num" onClick={handleNegate}>±</button>
        <button className="std-calc__btn std-calc__btn--num" onClick={() => inputDigit('0')}>0</button>
        <button className="std-calc__btn std-calc__btn--num" onClick={inputDecimal}>.</button>

        {/* Row 6 */}
        <button className="std-calc__btn std-calc__btn--op" onClick={() => handleOperation('+')}>+</button>
        <button className="std-calc__btn std-calc__btn--equals" onClick={handleEquals}>=</button>
      </div>
    </div>
  );
}
