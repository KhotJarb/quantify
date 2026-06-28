'use client';

import { useReducer, useCallback, useMemo } from 'react';
import Decimal from 'decimal.js';
import type { CalculatorSchema, CalculatorField } from '@/types/calculator';
import { evaluateFormulas } from '@/engine/formulaParser';

/* ============================================================
   State Management
   ============================================================ */

interface EngineState {
  values: Record<string, string>;
  selectedUnits: Record<string, string>;
}

type EngineAction =
  | { type: 'SET_VALUE'; fieldId: string; value: string }
  | { type: 'SET_UNIT'; fieldId: string; unit: string }
  | { type: 'RESET'; defaults: EngineState };

function engineReducer(state: EngineState, action: EngineAction): EngineState {
  switch (action.type) {
    case 'SET_VALUE':
      return { ...state, values: { ...state.values, [action.fieldId]: action.value } };
    case 'SET_UNIT':
      return { ...state, selectedUnits: { ...state.selectedUnits, [action.fieldId]: action.unit } };
    case 'RESET':
      return action.defaults;
    default:
      return state;
  }
}

function getDefaults(schema: CalculatorSchema): EngineState {
  const values: Record<string, string> = {};
  const selectedUnits: Record<string, string> = {};

  for (const field of schema.inputs) {
    if (field.defaultValue !== undefined) {
      values[field.id] = String(field.defaultValue);
    } else if (field.type === 'number' || field.type === 'range') {
      values[field.id] = '';
    } else if (field.type === 'select' && field.options?.length) {
      values[field.id] = field.options[0].value;
    } else if (field.type === 'checkbox') {
      values[field.id] = 'false';
    } else {
      values[field.id] = '';
    }

    if (field.units?.length) {
      selectedUnits[field.id] = field.units[0].value;
    }
  }

  return { values, selectedUnits };
}

/* ============================================================
   Component
   ============================================================ */

interface DynamicCalculatorEngineProps {
  schema: CalculatorSchema;
}

export default function DynamicCalculatorEngine({ schema }: DynamicCalculatorEngineProps) {
  const defaults = useMemo(() => getDefaults(schema), [schema]);
  const [state, dispatch] = useReducer(engineReducer, defaults);

  /* --- Compute outputs --- */
  const results = useMemo(() => {
    // Build the input map: apply unit conversions, then create Decimal values
    const inputMap: Record<string, Decimal> = {};

    for (const field of schema.inputs) {
      const rawValue = state.values[field.id];

      if (rawValue === '' || rawValue === undefined) {
        inputMap[field.id] = new Decimal(0);
        continue;
      }

      if (field.type === 'checkbox') {
        inputMap[field.id] = new Decimal(rawValue === 'true' ? 1 : 0);
        continue;
      }

      let numericValue: Decimal;
      try {
        numericValue = new Decimal(rawValue);
      } catch {
        numericValue = new Decimal(0);
      }

      // Apply unit conversion factor if a non-base unit is selected
      if (field.units?.length) {
        const selectedUnit = state.selectedUnits[field.id];
        const unitDef = field.units.find((u) => u.value === selectedUnit);
        if (unitDef?.conversionFactor) {
          try {
            numericValue = numericValue.mul(new Decimal(unitDef.conversionFactor));
          } catch {
            // ignore invalid conversion factor
          }
        }
      }

      inputMap[field.id] = numericValue;
    }

    // Evaluate all formulas
    try {
      return evaluateFormulas(schema.formulas, inputMap);
    } catch {
      return {};
    }
  }, [schema, state.values, state.selectedUnits]);

  /* --- Handlers --- */
  const handleValueChange = useCallback((fieldId: string, value: string) => {
    dispatch({ type: 'SET_VALUE', fieldId, value });
  }, []);

  const handleUnitChange = useCallback((fieldId: string, unit: string) => {
    dispatch({ type: 'SET_UNIT', fieldId, unit });
  }, []);

  const handleReset = useCallback(() => {
    dispatch({ type: 'RESET', defaults });
  }, [defaults]);

  /* --- Format output value --- */
  const formatOutput = (value: Decimal | undefined, output: typeof schema.outputs[0]): string => {
    if (!value || !value.isFinite()) return '—';

    const precision = output.precision ?? 2;

    let formatted: string;
    switch (output.format) {
      case 'currency':
        formatted = value.toFixed(precision).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return `$${formatted}`;
      case 'percentage':
        formatted = value.toFixed(precision);
        return `${formatted}%`;
      case 'scientific':
        formatted = value.toExponential(precision);
        return formatted;
      default:
        formatted = value.toFixed(precision).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return `${output.prefix || ''}${formatted}${output.suffix || ''}`;
    }
  };

  /* --- Render --- */
  return (
    <div className="calc-engine animate-fade-in">
      {/* Header */}
      <div className="calc-engine__header">
        <div className="calc-engine__icon">{schema.icon}</div>
        <h1 className="calc-engine__title">{schema.title}</h1>
        <p className="calc-engine__desc">{schema.description}</p>
      </div>

      {/* Input Form */}
      <div className="calc-engine__form">
        {schema.inputs.map((field) => (
          <FieldRenderer
            key={field.id}
            field={field}
            value={state.values[field.id]}
            selectedUnit={state.selectedUnits[field.id]}
            onValueChange={handleValueChange}
            onUnitChange={handleUnitChange}
          />
        ))}
      </div>

      {/* Outputs */}
      <div className="calc-outputs">
        <h2 className="calc-outputs__title">Results</h2>
        {schema.outputs.map((output) => (
          <div
            key={output.id}
            className={`calc-output ${output.highlight ? 'calc-output--highlight' : ''}`}
          >
            <span className="calc-output__label">
              {output.label}
              {output.unit ? ` (${output.unit})` : ''}
            </span>
            <span className="calc-output__value">
              {formatOutput(results[output.formulaRef], output)}
            </span>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="calc-actions">
        <button className="btn btn--secondary" onClick={handleReset}>
          ↺ Reset
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   Field Renderer — renders each input type
   ============================================================ */

interface FieldRendererProps {
  field: CalculatorField;
  value: string;
  selectedUnit?: string;
  onValueChange: (id: string, value: string) => void;
  onUnitChange: (id: string, unit: string) => void;
}

function FieldRenderer({ field, value, selectedUnit, onValueChange, onUnitChange }: FieldRendererProps) {
  switch (field.type) {
    case 'number':
      return (
        <div className="calc-field">
          <label className="calc-field__label" htmlFor={field.id}>
            {field.label}
          </label>
          {field.helpText && <span className="calc-field__help">{field.helpText}</span>}
          <div className="calc-field__input-wrapper">
            <input
              id={field.id}
              type="number"
              className="calc-field__input"
              value={value}
              placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
              min={field.min}
              max={field.max}
              step={field.step || 'any'}
              onChange={(e) => onValueChange(field.id, e.target.value)}
            />
            {field.units && field.units.length > 0 && (
              <select
                className="calc-field__unit-select"
                value={selectedUnit}
                onChange={(e) => onUnitChange(field.id, e.target.value)}
                aria-label={`Unit for ${field.label}`}
              >
                {field.units.map((unit) => (
                  <option key={unit.value} value={unit.value}>
                    {unit.label}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      );

    case 'select':
      return (
        <div className="calc-field">
          <label className="calc-field__label" htmlFor={field.id}>
            {field.label}
          </label>
          {field.helpText && <span className="calc-field__help">{field.helpText}</span>}
          <select
            id={field.id}
            className="calc-field__select"
            value={value}
            onChange={(e) => onValueChange(field.id, e.target.value)}
          >
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      );

    case 'range':
      return (
        <div className="calc-field">
          <div className="calc-field__range-wrapper">
            <div className="calc-field__range-header">
              <label className="calc-field__label" htmlFor={field.id}>
                {field.label}
              </label>
              <span className="calc-field__range-value">{value || field.min || 0}</span>
            </div>
            {field.helpText && <span className="calc-field__help">{field.helpText}</span>}
            <input
              id={field.id}
              type="range"
              className="calc-field__range"
              value={value || field.min || 0}
              min={field.min ?? 0}
              max={field.max ?? 100}
              step={field.step ?? 1}
              onChange={(e) => onValueChange(field.id, e.target.value)}
            />
          </div>
        </div>
      );

    case 'checkbox':
      return (
        <div className="calc-field">
          <label className="calc-field__checkbox-wrapper" htmlFor={field.id}>
            <input
              id={field.id}
              type="checkbox"
              className="calc-field__checkbox"
              checked={value === 'true'}
              onChange={(e) => onValueChange(field.id, String(e.target.checked))}
            />
            <span className="calc-field__checkbox-label">{field.label}</span>
          </label>
          {field.helpText && <span className="calc-field__help">{field.helpText}</span>}
        </div>
      );

    default:
      return null;
  }
}
