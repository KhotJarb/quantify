// ============================================================================
// Quantify — Calculator Type Definitions
// ============================================================================
// These interfaces define the JSON schema that every calculator configuration
// must conform to. They are the contract between the calculator data layer
// and the rendering / evaluation engine.
// ============================================================================

// === Unit Definition ===

export interface UnitOption {
  label: string;
  value: string;
  /**
   * Multiplication factor to convert this unit to the base unit.
   * E.g., if the base unit is meters, km has factor '1000'.
   * Stored as a string so Decimal can parse it without floating-point loss.
   */
  conversionFactor?: string;
}

// === Calculator Input Field ===

export interface CalculatorField {
  id: string;
  label: string;
  type: 'number' | 'select' | 'checkbox' | 'range';
  defaultValue?: number | string | boolean;
  units?: UnitOption[];
  min?: number;
  max?: number;
  step?: number;
  options?: { label: string; value: string }[];
  placeholder?: string;
  helpText?: string;
  required?: boolean;
  /** Visual grouping key — fields with the same group are rendered together. */
  group?: string;
}

// === Formula Step ===

export interface FormulaStep {
  id: string;
  /**
   * Mathematical expression referencing input IDs and prior step IDs as
   * variables.
   *
   * Supported operators:
   *   +  -  *  /  ^  %  (parentheses for grouping)
   *
   * Supported functions:
   *   sqrt() abs() ceil() floor() log() ln() exp()
   *   sin() cos() tan() min() max() round() pow()
   *
   * Ternary conditionals:
   *   condition ? trueExpr : falseExpr
   *
   * Comparison operators:
   *   >  <  >=  <=  ==  !=
   */
  expression: string;
  /** IDs of inputs / prior steps that this expression reads. */
  dependencies: string[];
}

// === Output Field ===

export interface OutputField {
  id: string;
  label: string;
  /** References a FormulaStep.id to obtain the computed value. */
  formulaRef: string;
  format?: 'number' | 'currency' | 'percentage' | 'scientific';
  precision?: number;
  unit?: string;
  highlight?: boolean;
  prefix?: string;
  suffix?: string;
}

// === Calculator Schema (root) ===

export interface CalculatorSchema {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  subcategory?: string;
  tags: string[];
  inputs: CalculatorField[];
  formulas: FormulaStep[];
  outputs: OutputField[];
  metadata?: {
    author?: string;
    version?: string;
    lastUpdated?: string;
  };
}

// === Category Definition ===

export interface Category {
  id: string;
  label: string;
  icon: string;
  subcategories: { id: string; label: string }[];
}
