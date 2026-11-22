'use client';

import {
  useState,
  useReducer,
  useMemo,
  useEffect,
  useCallback,
  useSyncExternalStore,
} from 'react';
import Link from 'next/link';
import Decimal from 'decimal.js';
import Fuse from 'fuse.js';
import {
  Workflow,
  Plus,
  Link2,
  Unlink,
  ArrowDown,
  ArrowUp,
  Trash2,
  Share2,
  Check,
  BookmarkPlus,
  FileText,
  ExternalLink,
  Search,
  X,
  FolderOpen,
  RotateCcw,
} from 'lucide-react';
import AppShell from '@/components/layout/AppShell';
import { CategoryIcon } from '@/components/ui/SuiteIcon';
import { usePreferences } from '@/context/PreferencesContext';
import { evaluateFormulas } from '@/engine/formulaParser';
import { trackEvent } from '@/lib/telemetry';
import type { CalculatorField, CalculatorSchema, OutputField } from '@/types/calculator';

/* ============================================================
   Types & Constants
   ============================================================ */

export type BindingScale = '1' | '12' | '1/12';

export interface InputBinding {
  fromStepId: string;
  outputFormulaRef: string;
  scale: BindingScale;
}

export interface WorkbookStep {
  id: string;
  slug: string;
  title: string;
  values: Record<string, string>;
  selectedUnits: Record<string, string>;
  bindings: Record<string, InputBinding>;
}

export interface SavedWorkbook {
  id: string;
  name: string;
  steps: WorkbookStep[];
  updatedAt: string;
}

interface WorkbookTemplate {
  id: string;
  name: string;
  summary: string;
  buildSteps: (schemas: Record<string, CalculatorSchema>) => WorkbookStep[];
}

const WORKBOOKS_KEY = 'quantify-workbooks-v2';

const SCALE_LABELS: Record<BindingScale, string> = {
  '1': '×1 (Exact)',
  '12': '×12 (Annualize)',
  '1/12': '÷12 (Monthly)',
};

const SCALE_SHORT: Record<BindingScale, string> = {
  '1': '×1',
  '12': '×12',
  '1/12': '÷12',
};

function createId(prefix: string): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
  }
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

function getSchemaDefaults(
  schema?: CalculatorSchema,
  overrides?: Record<string, string>
): { values: Record<string, string>; selectedUnits: Record<string, string> } {
  const values: Record<string, string> = {};
  const selectedUnits: Record<string, string> = {};

  if (schema) {
    for (const field of schema.inputs) {
      if (field.defaultValue !== undefined) {
        values[field.id] = String(field.defaultValue);
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
  }

  if (overrides) {
    for (const [k, v] of Object.entries(overrides)) {
      values[k] = v;
    }
  }

  return { values, selectedUnits };
}

function formatDecimalValue(
  value: Decimal | undefined,
  output: OutputField,
  currencySymbol: string
): string {
  if (!value || !value.isFinite() || value.isNaN()) return '—';

  const precision = output.precision ?? 2;
  const isNeg = value.isNegative();
  const absVal = value.abs();

  const addCommas = (numStr: string) => {
    const [intPart, decPart] = numStr.split('.');
    const withCommas = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return decPart !== undefined ? `${withCommas}.${decPart}` : withCommas;
  };

  switch (output.format) {
    case 'currency':
      return `${isNeg ? '−' : ''}${currencySymbol}${addCommas(absVal.toFixed(precision))}`;
    case 'percentage':
      return `${isNeg ? '−' : ''}${absVal.toFixed(precision)}%`;
    case 'scientific':
      return value.toExponential(precision);
    default:
      return `${isNeg ? '−' : ''}${output.prefix || ''}${addCommas(absVal.toFixed(precision))}${output.suffix || ''}`;
  }
}

/* ============================================================
   4 Flagship Pre-Built Workbook Templates
   ============================================================ */

const TEMPLATES: WorkbookTemplate[] = [
  {
    id: 'mortgage-to-fire',
    name: 'Mortgage → FIRE Readiness',
    summary: 'Pipes annualized monthly EMI into required FIRE portfolio target.',
    buildSteps: (schemas): WorkbookStep[] => {
      const s1 = schemas['loan-emi'];
      const s2 = schemas['fire-number-calculator'];
      const d1 = getSchemaDefaults(s1, {
        loanAmount: '450000',
        annualRate: '6.5',
        loanTenure: '30',
      });
      const d2 = getSchemaDefaults(s2, {
        swr: '4',
        currentPortfolio: '150000',
      });
      return [
        {
          id: 'step-1',
          slug: 'loan-emi',
          title: s1?.title ?? 'Loan EMI Calculator',
          values: d1.values,
          selectedUnits: d1.selectedUnits,
          bindings: {},
        },
        {
          id: 'step-2',
          slug: 'fire-number-calculator',
          title: s2?.title ?? 'FIRE Number Calculator',
          values: d2.values,
          selectedUnits: d2.selectedUnits,
          bindings: {
            annualExpenses: {
              fromStepId: 'step-1',
              outputFormulaRef: 'emi',
              scale: '12',
            },
          },
        },
      ];
    },
  },
  {
    id: 'growth-to-fire',
    name: 'Compound Growth → FIRE Milestone',
    summary: 'Projects portfolio compounding and feeds ending balance into FIRE progress.',
    buildSteps: (schemas): WorkbookStep[] => {
      const s1 = schemas['compound-interest'];
      const s2 = schemas['fire-number-calculator'];
      const d1 = getSchemaDefaults(s1, {
        principal: '120000',
        monthlyContribution: '500',
        annualRate: '8',
        compoundingFrequency: '12',
        years: '15',
      });
      const d2 = getSchemaDefaults(s2, {
        annualExpenses: '60000',
        swr: '4',
      });
      return [
        {
          id: 'step-1',
          slug: 'compound-interest',
          title: s1?.title ?? 'Compound Interest Calculator',
          values: d1.values,
          selectedUnits: d1.selectedUnits,
          bindings: {},
        },
        {
          id: 'step-2',
          slug: 'fire-number-calculator',
          title: s2?.title ?? 'FIRE Number Calculator',
          values: d2.values,
          selectedUnits: d2.selectedUnits,
          bindings: {
            currentPortfolio: {
              fromStepId: 'step-1',
              outputFormulaRef: 'amount',
              scale: '1',
            },
          },
        },
      ];
    },
  },
  {
    id: 'solar-to-compound',
    name: 'Solar Savings → Reinvestment',
    summary: 'Converts annual solar electricity savings into monthly contributions compounded over 20 years.',
    buildSteps: (schemas): WorkbookStep[] => {
      const s1 = schemas['solar-payback'];
      const s2 = schemas['compound-interest'];
      const d1 = getSchemaDefaults(s1);
      const d2 = getSchemaDefaults(s2, {
        principal: '0',
        annualRate: '7',
        compoundingFrequency: '12',
        years: '20',
      });
      return [
        {
          id: 'step-1',
          slug: 'solar-payback',
          title: s1?.title ?? 'Solar Payback Calculator',
          values: d1.values,
          selectedUnits: d1.selectedUnits,
          bindings: {},
        },
        {
          id: 'step-2',
          slug: 'compound-interest',
          title: s2?.title ?? 'Compound Interest Calculator',
          values: d2.values,
          selectedUnits: d2.selectedUnits,
          bindings: {
            monthlyContribution: {
              fromStepId: 'step-1',
              outputFormulaRef: 'annualSavings',
              scale: '1/12',
            },
          },
        },
      ];
    },
  },
  {
    id: 'loan-to-roi',
    name: 'Financing Cost → Required ROI',
    summary: 'Feeds total financed loan outlay directly into capital ROI return modeling.',
    buildSteps: (schemas): WorkbookStep[] => {
      const s1 = schemas['loan-emi'];
      const s2 = schemas['roi-calculator'];
      const d1 = getSchemaDefaults(s1, {
        loanAmount: '50000',
        annualRate: '7.5',
        loanTenure: '5',
      });
      const d2 = getSchemaDefaults(s2, {
        finalValue: '90000',
        investmentDuration: '5',
      });
      return [
        {
          id: 'step-1',
          slug: 'loan-emi',
          title: s1?.title ?? 'Loan EMI Calculator',
          values: d1.values,
          selectedUnits: d1.selectedUnits,
          bindings: {},
        },
        {
          id: 'step-2',
          slug: 'roi-calculator',
          title: s2?.title ?? 'ROI Calculator',
          values: d2.values,
          selectedUnits: d2.selectedUnits,
          bindings: {
            initialInvestment: {
              fromStepId: 'step-1',
              outputFormulaRef: 'totalPayment',
              scale: '1',
            },
          },
        },
      ];
    },
  },
];

/* ============================================================
   LocalStorage External Store for Saved Workbooks
   ============================================================ */

const SERVER_WORKBOOKS: SavedWorkbook[] = [];
let wbCache: SavedWorkbook[] | null = null;
const wbListeners = new Set<() => void>();

function readSavedWorkbooks(): SavedWorkbook[] {
  if (typeof window === 'undefined') return SERVER_WORKBOOKS;
  if (wbCache) return wbCache;
  try {
    const raw = localStorage.getItem(WORKBOOKS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        wbCache = parsed.filter(
          (item): item is SavedWorkbook =>
            Boolean(item && typeof item.id === 'string' && Array.isArray(item.steps))
        );
        return wbCache;
      }
    }
  } catch {
    // Ignore storage access errors
  }
  wbCache = [];
  return wbCache;
}

function writeSavedWorkbooks(next: SavedWorkbook[]) {
  wbCache = next;
  try {
    localStorage.setItem(WORKBOOKS_KEY, JSON.stringify(next));
  } catch {
    // Ignore quota errors
  }
  wbListeners.forEach((l) => l());
}

function subscribeWorkbooks(listener: () => void) {
  wbListeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === WORKBOOKS_KEY) {
      wbCache = null;
      listener();
    }
  };
  window.addEventListener('storage', onStorage);
  return () => {
    wbListeners.delete(listener);
    window.removeEventListener('storage', onStorage);
  };
}

/* ============================================================
   Workbook State Reducer (No setState in useEffect)
   ============================================================ */

interface WorkbookState {
  name: string;
  activeTemplateId: string | null;
  steps: WorkbookStep[];
  schemas: Record<string, CalculatorSchema>;
  loadedFromShare: boolean;
}

type WorkbookAction =
  | { type: 'LOAD_TEMPLATE'; template: WorkbookTemplate }
  | { type: 'LOAD_SAVED'; workbook: SavedWorkbook }
  | { type: 'HYDRATE_SHARE'; name: string; steps: WorkbookStep[] }
  | { type: 'DISMISS_SHARE_BANNER' }
  | { type: 'SET_NAME'; name: string }
  | { type: 'ADD_SCHEMA'; schema: CalculatorSchema }
  | { type: 'ADD_STEP'; schema: CalculatorSchema }
  | { type: 'REMOVE_STEP'; stepId: string }
  | { type: 'MOVE_STEP'; index: number; delta: -1 | 1 }
  | { type: 'SET_VALUE'; stepId: string; fieldId: string; value: string }
  | { type: 'SET_UNIT'; stepId: string; fieldId: string; unit: string }
  | { type: 'SET_BINDING'; stepId: string; fieldId: string; binding: InputBinding | null };

function pruneInvalidBindings(steps: WorkbookStep[]): WorkbookStep[] {
  const seenStepIds = new Set<string>();
  return steps.map((step) => {
    const cleanBindings: Record<string, InputBinding> = {};
    for (const [fieldId, b] of Object.entries(step.bindings)) {
      if (seenStepIds.has(b.fromStepId)) {
        cleanBindings[fieldId] = b;
      }
    }
    seenStepIds.add(step.id);
    return { ...step, bindings: cleanBindings };
  });
}

function workbookReducer(state: WorkbookState, action: WorkbookAction): WorkbookState {
  switch (action.type) {
    case 'LOAD_TEMPLATE':
      return {
        ...state,
        name: action.template.name,
        activeTemplateId: action.template.id,
        steps: action.template.buildSteps(state.schemas),
        loadedFromShare: false,
      };
    case 'LOAD_SAVED':
      return {
        ...state,
        name: action.workbook.name,
        activeTemplateId: null,
        steps: pruneInvalidBindings(action.workbook.steps),
        loadedFromShare: false,
      };
    case 'HYDRATE_SHARE':
      return {
        ...state,
        name: action.name,
        activeTemplateId: null,
        steps: pruneInvalidBindings(action.steps),
        loadedFromShare: true,
      };
    case 'DISMISS_SHARE_BANNER':
      return { ...state, loadedFromShare: false };
    case 'SET_NAME':
      return { ...state, name: action.name };
    case 'ADD_SCHEMA':
      return {
        ...state,
        schemas: { ...state.schemas, [action.schema.slug]: action.schema },
      };
    case 'ADD_STEP': {
      const defaults = getSchemaDefaults(action.schema);
      const newStep: WorkbookStep = {
        id: createId('step'),
        slug: action.schema.slug,
        title: action.schema.title,
        values: defaults.values,
        selectedUnits: defaults.selectedUnits,
        bindings: {},
      };
      return {
        ...state,
        activeTemplateId: null,
        schemas: { ...state.schemas, [action.schema.slug]: action.schema },
        steps: [...state.steps, newStep],
      };
    }
    case 'REMOVE_STEP': {
      const remaining = state.steps.filter((s) => s.id !== action.stepId);
      return {
        ...state,
        activeTemplateId: null,
        steps: pruneInvalidBindings(remaining),
      };
    }
    case 'MOVE_STEP': {
      const target = action.index + action.delta;
      if (target < 0 || target >= state.steps.length) return state;
      const copy = [...state.steps];
      const [moved] = copy.splice(action.index, 1);
      copy.splice(target, 0, moved);
      return {
        ...state,
        activeTemplateId: null,
        steps: pruneInvalidBindings(copy),
      };
    }
    case 'SET_VALUE':
      return {
        ...state,
        steps: state.steps.map((s) =>
          s.id === action.stepId
            ? { ...s, values: { ...s.values, [action.fieldId]: action.value } }
            : s
        ),
      };
    case 'SET_UNIT':
      return {
        ...state,
        steps: state.steps.map((s) =>
          s.id === action.stepId
            ? {
                ...s,
                selectedUnits: { ...s.selectedUnits, [action.fieldId]: action.unit },
              }
            : s
        ),
      };
    case 'SET_BINDING':
      return {
        ...state,
        steps: state.steps.map((s) => {
          if (s.id !== action.stepId) return s;
          const nextBindings = { ...s.bindings };
          if (action.binding) {
            nextBindings[action.fieldId] = action.binding;
          } else {
            delete nextBindings[action.fieldId];
          }
          return { ...s, bindings: nextBindings };
        }),
      };
    default:
      return state;
  }
}

/* ============================================================
   DAG Sequential Evaluation
   ============================================================ */

interface StepEval {
  step: WorkbookStep;
  schema?: CalculatorSchema;
  results: Record<string, Decimal>;
  resolvedBindings: Record<
    string,
    {
      value: Decimal;
      sourceStepIndex: number;
      sourceStepTitle: string;
      sourceOutputLabel: string;
      scale: BindingScale;
    }
  >;
  primaryOutput?: OutputField;
  primaryFormatted: string;
}

function evaluateWorkbook(
  steps: WorkbookStep[],
  schemas: Record<string, CalculatorSchema>,
  currencySymbol: string
): StepEval[] {
  const evals: StepEval[] = [];
  const resultsByStepId = new Map<
    string,
    { index: number; step: WorkbookStep; schema?: CalculatorSchema; results: Record<string, Decimal> }
  >();

  steps.forEach((step, idx) => {
    const schema = schemas[step.slug];
    if (!schema) {
      evals.push({
        step,
        schema: undefined,
        results: {},
        resolvedBindings: {},
        primaryFormatted: '…',
      });
      return;
    }

    const inputDecimals: Record<string, Decimal> = {};
    const resolvedBindings: StepEval['resolvedBindings'] = {};

    for (const field of schema.inputs) {
      const binding = step.bindings[field.id];
      if (binding) {
        const upstream = resultsByStepId.get(binding.fromStepId);
        const rawUpstream = upstream?.results[binding.outputFormulaRef];
        if (upstream && rawUpstream && rawUpstream.isFinite()) {
          let scaled = rawUpstream;
          if (binding.scale === '12') scaled = rawUpstream.times(12);
          else if (binding.scale === '1/12') scaled = rawUpstream.div(12);

          const outDef = upstream.schema?.outputs.find(
            (o) => o.formulaRef === binding.outputFormulaRef
          );
          inputDecimals[field.id] = scaled;
          resolvedBindings[field.id] = {
            value: scaled,
            sourceStepIndex: upstream.index,
            sourceStepTitle: upstream.step.title,
            sourceOutputLabel: outDef?.label ?? binding.outputFormulaRef,
            scale: binding.scale,
          };
          continue;
        }
      }

      const rawValue = step.values[field.id];
      if (rawValue === '' || rawValue === undefined) {
        inputDecimals[field.id] = new Decimal(0);
        continue;
      }
      if (field.type === 'checkbox') {
        inputDecimals[field.id] = new Decimal(rawValue === 'true' ? 1 : 0);
        continue;
      }

      let numericValue: Decimal;
      try {
        numericValue = new Decimal(rawValue);
        if (!numericValue.isFinite()) numericValue = new Decimal(0);
      } catch {
        numericValue = new Decimal(0);
      }

      if (field.units?.length) {
        const selectedUnit = step.selectedUnits[field.id] ?? field.units[0].value;
        const unitDef = field.units.find((u) => u.value === selectedUnit);
        if (unitDef?.conversionFactor) {
          try {
            numericValue = numericValue.mul(new Decimal(unitDef.conversionFactor));
          } catch {
            // Ignore malformed factor
          }
        }
      }
      inputDecimals[field.id] = numericValue;
    }

    let results: Record<string, Decimal> = {};
    try {
      results = evaluateFormulas(schema.formulas, inputDecimals);
    } catch {
      results = {};
    }

    const primaryOutput = schema.outputs.find((o) => o.highlight) ?? schema.outputs[0];
    const primaryFormatted = primaryOutput
      ? formatDecimalValue(results[primaryOutput.formulaRef], primaryOutput, currencySymbol)
      : '—';

    resultsByStepId.set(step.id, { index: idx, step, schema, results });
    evals.push({
      step,
      schema,
      results,
      resolvedBindings,
      primaryOutput,
      primaryFormatted,
    });
  });

  return evals;
}

/* ============================================================
   Main Component
   ============================================================ */

interface WorkbookBuilderProps {
  initialSchemas: Record<string, CalculatorSchema>;
}

export default function WorkbookBuilder({ initialSchemas }: WorkbookBuilderProps) {
  const { currency, catalog, ensureCatalogLoaded } = usePreferences();
  const savedWorkbooks = useSyncExternalStore(
    subscribeWorkbooks,
    readSavedWorkbooks,
    () => SERVER_WORKBOOKS
  );

  const [state, dispatch] = useReducer(workbookReducer, initialSchemas, (schemas) => {
    const first = TEMPLATES[0];
    return {
      name: first.name,
      activeTemplateId: first.id,
      steps: first.buildSteps(schemas),
      schemas,
      loadedFromShare: false,
    };
  });

  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerQuery, setPickerQuery] = useState('');
  const [loadingSlug, setLoadingSlug] = useState<string | null>(null);
  const [editingBindKey, setEditingBindKey] = useState<string | null>(null);
  const [savedDrawerOpen, setSavedDrawerOpen] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  const fetchSchemaIfNeeded = useCallback(async (slug: string): Promise<CalculatorSchema | null> => {
    try {
      const res = await fetch(`/api/schema/${encodeURIComponent(slug)}`);
      if (!res.ok) return null;
      const schema = (await res.json()) as CalculatorSchema;
      dispatch({ type: 'ADD_SCHEMA', schema });
      return schema;
    } catch {
      return null;
    }
  }, []);

  // Hydrate shared workbook from ?wb= URL query on client mount
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const raw = params.get('wb');
      if (!raw) return;
      const parsed = JSON.parse(raw) as { name?: string; steps?: WorkbookStep[] };
      if (!parsed || !Array.isArray(parsed.steps) || parsed.steps.length === 0) return;

      const sanitizedSteps: WorkbookStep[] = parsed.steps
        .filter((s) => s && typeof s.slug === 'string' && typeof s.id === 'string')
        .slice(0, 8)
        .map((s) => ({
          id: s.id,
          slug: s.slug,
          title: typeof s.title === 'string' ? s.title : s.slug,
          values: s.values && typeof s.values === 'object' ? s.values : {},
          selectedUnits: s.selectedUnits && typeof s.selectedUnits === 'object' ? s.selectedUnits : {},
          bindings: s.bindings && typeof s.bindings === 'object' ? s.bindings : {},
        }));

      if (sanitizedSteps.length === 0) return;
      dispatch({
        type: 'HYDRATE_SHARE',
        name: typeof parsed.name === 'string' && parsed.name.trim() ? parsed.name.trim() : 'Shared Workbook',
        steps: sanitizedSteps,
      });

      const missingSlugs = Array.from(
        new Set(sanitizedSteps.map((s) => s.slug).filter((slug) => !initialSchemas[slug]))
      );
      missingSlugs.forEach((slug) => {
        void fetchSchemaIfNeeded(slug);
      });
    } catch {
      // Ignore malformed share parameter
    }
  }, [initialSchemas, fetchSchemaIfNeeded]);

  const stepEvals = useMemo(
    () => evaluateWorkbook(state.steps, state.schemas, currency.symbol),
    [state.steps, state.schemas, currency.symbol]
  );

  // Filter eligible formula-driven instruments for step picker
  const chainableCatalog = useMemo(
    () => catalog.filter((c) => !c.isCustom && c.outputCount > 0),
    [catalog]
  );

  const fuse = useMemo(
    () =>
      new Fuse(chainableCatalog, {
        keys: [
          { name: 'title', weight: 0.5 },
          { name: 'tags', weight: 0.25 },
          { name: 'categoryLabel', weight: 0.15 },
          { name: 'description', weight: 0.1 },
        ],
        threshold: 0.34,
        minMatchCharLength: 2,
      }),
    [chainableCatalog]
  );

  const pickerResults = useMemo(() => {
    const q = pickerQuery.trim();
    if (q.length >= 2) {
      return fuse.search(q).slice(0, 14).map((r) => r.item);
    }
    return chainableCatalog.filter((c) => c.isFeatured || c.suiteId === 'wealth').slice(0, 12);
  }, [pickerQuery, fuse, chainableCatalog]);

  const handleOpenPicker = () => {
    setPickerOpen((o) => !o);
    void ensureCatalogLoaded();
  };

  const handleSelectInstrumentToAdd = async (slug: string) => {
    const existing = state.schemas[slug];
    if (existing) {
      dispatch({ type: 'ADD_STEP', schema: existing });
      setPickerOpen(false);
      setPickerQuery('');
      return;
    }
    setLoadingSlug(slug);
    const loaded = await fetchSchemaIfNeeded(slug);
    setLoadingSlug(null);
    if (loaded) {
      dispatch({ type: 'ADD_STEP', schema: loaded });
      setPickerOpen(false);
      setPickerQuery('');
    }
  };

  const handleSaveWorkbook = () => {
    const trimmed = state.name.trim() || 'Untitled Workbook';
    const record: SavedWorkbook = {
      id: createId('wb'),
      name: trimmed,
      steps: state.steps,
      updatedAt: new Date().toISOString(),
    };
    writeSavedWorkbooks([record, ...savedWorkbooks].slice(0, 30));
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 1800);
  };

  const handleLoadSavedWorkbook = (wb: SavedWorkbook) => {
    dispatch({ type: 'LOAD_SAVED', workbook: wb });
    setSavedDrawerOpen(false);
    wb.steps.forEach((step) => {
      if (!state.schemas[step.slug]) {
        void fetchSchemaIfNeeded(step.slug);
      }
    });
  };

  const handleDeleteSavedWorkbook = (id: string) => {
    writeSavedWorkbooks(savedWorkbooks.filter((w) => w.id !== id));
  };

  const handleShareWorkbook = async () => {
    try {
      const payload = JSON.stringify({
        name: state.name.trim() || 'Quantify Workbook',
        steps: state.steps,
      });
      const url = new URL('/workbooks', window.location.origin);
      url.searchParams.set('wb', payload);
      await navigator.clipboard.writeText(url.toString());
      trackEvent('workbook_share', { steps: state.steps.length });
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 1800);
    } catch {
      // Ignore clipboard failure
    }
  };

  const breadcrumbs = [
    { label: 'Workbench', href: '/' },
    { label: 'Workbooks' },
  ];

  return (
    <AppShell breadcrumbs={breadcrumbs}>
      <div className="wk-wrap">
        {state.loadedFromShare && (
          <div className="share-welcome-bar" role="status">
            <div className="share-welcome-bar__text">
              <strong>Shared workbook loaded.</strong> Change any upstream input to watch downstream calculations recalculate live.
            </div>
            <button
              type="button"
              className="icon-btn icon-btn--xs"
              onClick={() => dispatch({ type: 'DISMISS_SHARE_BANNER' })}
              aria-label="Dismiss shared workbook notice"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* Header */}
        <header className="wk-head">
          <div className="wk-head__identity">
            <span className="wk-head__icon">
              <Workflow size={20} strokeWidth={1.75} aria-hidden="true" />
            </span>
            <div className="wk-head__title-box">
              <div className="wk-head__eyebrow">Chained Multi-Step Models</div>
              <input
                type="text"
                className="wk-head__name-input"
                value={state.name}
                onChange={(e) => dispatch({ type: 'SET_NAME', name: e.target.value })}
                aria-label="Workbook title"
                maxLength={80}
              />
            </div>
          </div>

          <div className="wk-head__actions">
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() => setSavedDrawerOpen((o) => !o)}
              aria-expanded={savedDrawerOpen}
            >
              <FolderOpen size={15} strokeWidth={1.75} aria-hidden="true" />
              <span>Saved ({savedWorkbooks.length})</span>
            </button>
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={handleSaveWorkbook}
            >
              {justSaved ? <Check size={15} /> : <BookmarkPlus size={15} strokeWidth={1.75} />}
              <span>{justSaved ? 'Saved' : 'Save Local'}</span>
            </button>
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() => window.print()}
            >
              <FileText size={15} strokeWidth={1.75} aria-hidden="true" />
              <span>Brief / PDF</span>
            </button>
            <button
              type="button"
              className="btn btn--primary btn--sm"
              onClick={handleShareWorkbook}
            >
              {shareCopied ? <Check size={15} /> : <Share2 size={15} strokeWidth={1.75} />}
              <span>{shareCopied ? 'Link copied' : 'Share Model'}</span>
            </button>
          </div>
        </header>

        {/* Saved Local Workbooks Drawer */}
        {savedDrawerOpen && (
          <section className="snapshot-drawer" aria-label="Saved local workbooks">
            {savedWorkbooks.length > 0 ? (
              <ul className="snapshot-list">
                {savedWorkbooks.map((wb) => (
                  <li key={wb.id} className="snapshot-item">
                    <button
                      type="button"
                      className="snapshot-item__load"
                      onClick={() => handleLoadSavedWorkbook(wb)}
                    >
                      <span className="snapshot-item__name">{wb.name}</span>
                      <span className="snapshot-item__val">
                        {wb.steps.length} step{wb.steps.length === 1 ? '' : 's'}
                      </span>
                    </button>
                    <button
                      type="button"
                      className="snapshot-item__del"
                      onClick={() => handleDeleteSavedWorkbook(wb.id)}
                      aria-label={`Delete workbook ${wb.name}`}
                    >
                      <Trash2 size={14} strokeWidth={1.75} />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="wb-head__desc">
                No locally saved workbooks yet. Customize a template or add steps, then click “Save Local”.
              </p>
            )}
          </section>
        )}

        {/* Flagship Pre-Built Templates Strip */}
        <section className="wk-templates" aria-label="Pre-built decision templates">
          <div className="wk-templates__label">Flagship Templates</div>
          <div className="wk-templates__grid">
            {TEMPLATES.map((tpl) => {
              const active = state.activeTemplateId === tpl.id;
              return (
                <button
                  key={tpl.id}
                  type="button"
                  className={`wk-tpl-card ${active ? 'wk-tpl-card--active' : ''}`}
                  onClick={() => dispatch({ type: 'LOAD_TEMPLATE', template: tpl })}
                >
                  <span className="wk-tpl-card__name">{tpl.name}</span>
                  <span className="wk-tpl-card__desc">{tpl.summary}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Live Chain Cascade Summary Strip */}
        {stepEvals.length > 0 && (
          <section className="wk-summary" aria-label="Live workbook summary">
            {stepEvals.map((ev, idx) => (
              <div key={ev.step.id} className="wk-summary__node">
                <div className="wk-summary__top">
                  <span className="wk-summary__idx">Step {String(idx + 1).padStart(2, '0')}</span>
                  <span className="wk-summary__title">{ev.step.title}</span>
                </div>
                <div className="wk-summary__val">{ev.primaryFormatted}</div>
                {ev.primaryOutput && (
                  <div className="wk-summary__sub">{ev.primaryOutput.label}</div>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Sequential Chained Steps Canvas */}
        <section className="wk-canvas" aria-label="Workbook calculation steps">
          {stepEvals.map((ev, idx) => {
            const { step, schema, results, resolvedBindings } = ev;
            const upstreamSteps = stepEvals.slice(0, idx);
            const activeBindingEntries = Object.entries(resolvedBindings);

            return (
              <div key={step.id} className="wk-step-group">
                {idx > 0 && (
                  <div className="wk-connector" aria-hidden="true">
                    <span className="wk-connector__line" />
                    <span className="wk-connector__pill">
                      <ArrowDown size={13} strokeWidth={2} />
                      <span>
                        {activeBindingEntries.length > 0
                          ? `${activeBindingEntries.length} live link${activeBindingEntries.length === 1 ? '' : 's'} piped`
                          : 'Independent step (link any input below)'}
                      </span>
                    </span>
                    <span className="wk-connector__line" />
                  </div>
                )}

                <article className="wk-step-card">
                  <div className="wk-step-card__head">
                    <div className="wk-step-card__id-group">
                      <span className="wk-step-num">{String(idx + 1).padStart(2, '0')}</span>
                      {schema && (
                        <span className="wk-step-icon">
                          <CategoryIcon categoryId={schema.category} size={16} />
                        </span>
                      )}
                      <div>
                        <h2 className="wk-step-card__title">{step.title}</h2>
                        {schema && (
                          <p className="wk-step-card__desc">{schema.description}</p>
                        )}
                      </div>
                    </div>

                    <div className="wk-step-card__controls">
                      <Link
                        href={`/calculator/${step.slug}`}
                        className="icon-btn icon-btn--xs"
                        title="Open full calculator"
                        aria-label={`Open ${step.title} full calculator`}
                      >
                        <ExternalLink size={14} strokeWidth={1.75} />
                      </Link>
                      <button
                        type="button"
                        className="icon-btn icon-btn--xs"
                        disabled={idx === 0}
                        onClick={() => dispatch({ type: 'MOVE_STEP', index: idx, delta: -1 })}
                        aria-label="Move step up"
                        title="Move up"
                      >
                        <ArrowUp size={14} strokeWidth={1.75} />
                      </button>
                      <button
                        type="button"
                        className="icon-btn icon-btn--xs"
                        disabled={idx === stepEvals.length - 1}
                        onClick={() => dispatch({ type: 'MOVE_STEP', index: idx, delta: 1 })}
                        aria-label="Move step down"
                        title="Move down"
                      >
                        <ArrowDown size={14} strokeWidth={1.75} />
                      </button>
                      {stepEvals.length > 1 && (
                        <button
                          type="button"
                          className="icon-btn icon-btn--xs"
                          onClick={() => dispatch({ type: 'REMOVE_STEP', stepId: step.id })}
                          aria-label={`Remove step ${step.title}`}
                          title="Remove step"
                        >
                          <Trash2 size={14} strokeWidth={1.75} />
                        </button>
                      )}
                    </div>
                  </div>

                  {!schema ? (
                    <div className="wk-step-loading">Loading instrument schema…</div>
                  ) : (
                    <div className="wk-step-grid">
                      {/* Step Inputs */}
                      <div className="wk-step-pane">
                        <div className="wb-pane__label">Parameters</div>
                        <div className="wk-fields">
                          {schema.inputs.map((field) => {
                            const displayLabel = field.label.replace(/\(\$\)/g, `(${currency.symbol})`);
                            const binding = step.bindings[field.id];
                            const resolved = resolvedBindings[field.id];
                            const bindKey = `${step.id}:${field.id}`;
                            const isBindMenuOpen = editingBindKey === bindKey;
                            const canBind = idx > 0 && (field.type === 'number' || field.type === 'range');

                            return (
                              <div key={field.id} className="wk-field">
                                <div className="wk-field__head">
                                  <label
                                    className="field__label"
                                    htmlFor={`wk-${step.id}-${field.id}`}
                                  >
                                    {displayLabel}
                                  </label>

                                  {canBind && (
                                    <button
                                      type="button"
                                      className={`wk-bind-btn ${binding ? 'wk-bind-btn--linked' : ''}`}
                                      onClick={() =>
                                        setEditingBindKey(isBindMenuOpen ? null : bindKey)
                                      }
                                    >
                                      <Link2 size={12} strokeWidth={2} aria-hidden="true" />
                                      <span>{binding ? 'Linked' : 'Link Output'}</span>
                                    </button>
                                  )}
                                </div>

                                {/* Bound value badge OR manual input */}
                                {resolved && binding ? (
                                  <div className="wk-linked-pill">
                                    <div className="wk-linked-pill__meta">
                                      <Link2 size={13} strokeWidth={2} aria-hidden="true" />
                                      <span>
                                        Step {String(resolved.sourceStepIndex + 1).padStart(2, '0')} ·{' '}
                                        {resolved.sourceOutputLabel}{' '}
                                        <strong>{SCALE_SHORT[resolved.scale]}</strong>
                                      </span>
                                    </div>
                                    <div className="wk-linked-pill__right">
                                      <span className="wk-linked-pill__val">
                                        {resolved.value.toDecimalPlaces(2).toString()}
                                      </span>
                                      <button
                                        type="button"
                                        className="wk-linked-pill__unlink"
                                        onClick={() => {
                                          dispatch({
                                            type: 'SET_BINDING',
                                            stepId: step.id,
                                            fieldId: field.id,
                                            binding: null,
                                          });
                                          setEditingBindKey(null);
                                        }}
                                        title="Unlink to edit manually"
                                        aria-label={`Unlink ${displayLabel}`}
                                      >
                                        <Unlink size={13} strokeWidth={1.75} />
                                      </button>
                                    </div>
                                  </div>
                                ) : field.type === 'select' ? (
                                  <WorkbookSelectField
                                    id={`wk-${step.id}-${field.id}`}
                                    field={field}
                                    value={step.values[field.id] ?? ''}
                                    onChange={(val) =>
                                      dispatch({
                                        type: 'SET_VALUE',
                                        stepId: step.id,
                                        fieldId: field.id,
                                        value: val,
                                      })
                                    }
                                  />
                                ) : field.type === 'checkbox' ? (
                                  <label className="field__check-row">
                                    <input
                                      id={`wk-${step.id}-${field.id}`}
                                      type="checkbox"
                                      className="field__checkbox"
                                      checked={step.values[field.id] === 'true'}
                                      onChange={(e) =>
                                        dispatch({
                                          type: 'SET_VALUE',
                                          stepId: step.id,
                                          fieldId: field.id,
                                          value: String(e.target.checked),
                                        })
                                      }
                                    />
                                    <span className="field__check-label">{displayLabel}</span>
                                  </label>
                                ) : (
                                  <div className="field__box">
                                    <input
                                      id={`wk-${step.id}-${field.id}`}
                                      type="number"
                                      inputMode="decimal"
                                      className="field__input"
                                      value={step.values[field.id] ?? ''}
                                      step={field.step || 'any'}
                                      onChange={(e) =>
                                        dispatch({
                                          type: 'SET_VALUE',
                                          stepId: step.id,
                                          fieldId: field.id,
                                          value: e.target.value,
                                        })
                                      }
                                    />
                                    {field.units && field.units.length > 0 && (
                                      <select
                                        className="field__unit"
                                        value={step.selectedUnits[field.id] ?? field.units[0].value}
                                        onChange={(e) =>
                                          dispatch({
                                            type: 'SET_UNIT',
                                            stepId: step.id,
                                            fieldId: field.id,
                                            unit: e.target.value,
                                          })
                                        }
                                        aria-label={`Unit for ${field.label}`}
                                      >
                                        {field.units.map((u) => (
                                          <option key={u.value} value={u.value}>
                                            {u.label}
                                          </option>
                                        ))}
                                      </select>
                                    )}
                                  </div>
                                )}

                                {/* Inline Binding Selector Popover */}
                                {isBindMenuOpen && canBind && (
                                  <div className="wk-bind-editor">
                                    <div className="wk-bind-editor__row">
                                      <select
                                        className="wk-bind-editor__select"
                                        aria-label="Choose upstream output"
                                        value={
                                          binding
                                            ? `${binding.fromStepId}::${binding.outputFormulaRef}`
                                            : ''
                                        }
                                        onChange={(e) => {
                                          const raw = e.target.value;
                                          if (!raw) {
                                            dispatch({
                                              type: 'SET_BINDING',
                                              stepId: step.id,
                                              fieldId: field.id,
                                              binding: null,
                                            });
                                            return;
                                          }
                                          const [fromStepId, outputFormulaRef] = raw.split('::');
                                          dispatch({
                                            type: 'SET_BINDING',
                                            stepId: step.id,
                                            fieldId: field.id,
                                            binding: {
                                              fromStepId,
                                              outputFormulaRef,
                                              scale: binding?.scale ?? '1',
                                            },
                                          });
                                        }}
                                      >
                                        <option value="">Manual value (unlinked)</option>
                                        {upstreamSteps.map((up, upIdx) =>
                                          up.schema?.outputs.map((out) => (
                                            <option
                                              key={`${up.step.id}::${out.formulaRef}`}
                                              value={`${up.step.id}::${out.formulaRef}`}
                                            >
                                              Step {String(upIdx + 1).padStart(2, '0')}: {up.step.title} → {out.label} (
                                              {formatDecimalValue(
                                                up.results[out.formulaRef],
                                                out,
                                                currency.symbol
                                              )}
                                              )
                                            </option>
                                          ))
                                        )}
                                      </select>

                                      {binding && (
                                        <select
                                          className="wk-bind-editor__scale"
                                          aria-label="Binding multiplier"
                                          value={binding.scale}
                                          onChange={(e) =>
                                            dispatch({
                                              type: 'SET_BINDING',
                                              stepId: step.id,
                                              fieldId: field.id,
                                              binding: {
                                                ...binding,
                                                scale: e.target.value as BindingScale,
                                              },
                                            })
                                          }
                                        >
                                          {(Object.keys(SCALE_LABELS) as BindingScale[]).map((sc) => (
                                            <option key={sc} value={sc}>
                                              {SCALE_LABELS[sc]}
                                            </option>
                                          ))}
                                        </select>
                                      )}

                                      <button
                                        type="button"
                                        className="btn btn--ghost btn--xs"
                                        onClick={() => setEditingBindKey(null)}
                                      >
                                        Done
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Step Live Outputs */}
                      <div className="wk-step-pane wk-step-pane--out">
                        <div className="wb-pane__label">Live Step Outputs</div>
                        <div className="wk-outputs">
                          {schema.outputs.map((out) => (
                            <div
                              key={out.id}
                              className={`wk-out-row ${out.highlight ? 'wk-out-row--primary' : ''}`}
                            >
                              <span className="wk-out-row__label">
                                {out.label}
                                {out.unit ? ` (${out.unit})` : ''}
                              </span>
                              <span className="wk-out-row__val">
                                {formatDecimalValue(results[out.formulaRef], out, currency.symbol)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </article>
              </div>
            );
          })}
        </section>

        {/* Add Step Controls + Inline Searchable Catalog Picker */}
        <section className="wk-add-section">
          <div className="wk-add-bar">
            <button
              type="button"
              className="btn btn--primary"
              onClick={handleOpenPicker}
            >
              <Plus size={16} strokeWidth={2} aria-hidden="true" />
              <span>Add Calculator Step</span>
            </button>
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() => dispatch({ type: 'LOAD_TEMPLATE', template: TEMPLATES[0] })}
            >
              <RotateCcw size={14} strokeWidth={1.75} aria-hidden="true" />
              <span>Reset to Default Template</span>
            </button>
          </div>

          {pickerOpen && (
            <div className="wk-picker">
              <div className="wk-picker__head">
                <div className="inline-search">
                  <Search size={16} strokeWidth={1.75} className="inline-search__icon" aria-hidden="true" />
                  <input
                    type="text"
                    className="inline-search__input"
                    value={pickerQuery}
                    onChange={(e) => setPickerQuery(e.target.value)}
                    placeholder="Search 640+ chainable instruments (e.g. mortgage, tax, solar, BMI)…"
                    aria-label="Search calculators to add as next step"
                    autoFocus
                  />
                  {pickerQuery && (
                    <button
                      type="button"
                      className="inline-search__clear"
                      onClick={() => setPickerQuery('')}
                      aria-label="Clear search"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() => setPickerOpen(false)}
                  aria-label="Close instrument picker"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="wk-picker__grid">
                {pickerResults.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="wk-picker__item"
                    disabled={loadingSlug === item.slug}
                    onClick={() => void handleSelectInstrumentToAdd(item.slug)}
                  >
                    <span className="wk-picker__icon">
                      <CategoryIcon categoryId={item.category} size={15} />
                    </span>
                    <span className="wk-picker__text">
                      <span className="wk-picker__title">{item.title}</span>
                      <span className="wk-picker__cat">{item.categoryLabel}</span>
                    </span>
                    <span className="wk-picker__add">
                      {loadingSlug === item.slug ? '…' : '+ Add'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}


const WK_CUSTOM_SENTINEL = '__custom__';

function WorkbookSelectField({
  id,
  field,
  value,
  onChange,
}: {
  id: string;
  field: CalculatorField;
  value: string;
  onChange: (value: string) => void;
}) {
  const isPreset = Boolean(field.options?.some((opt) => opt.value === value));
  const [customActive, setCustomActive] = useState(
    () => Boolean(field.allowCustom && value !== '' && !isPreset)
  );
  const showCustomInput = Boolean(field.allowCustom && (customActive || (value !== '' && !isPreset)));
  const selectValue = showCustomInput ? WK_CUSTOM_SENTINEL : value;

  return (
    <>
      <select
        id={id}
        className="field__select"
        value={selectValue}
        onChange={(e) => {
          const next = e.target.value;
          if (next === WK_CUSTOM_SENTINEL) {
            setCustomActive(true);
            return;
          }
          setCustomActive(false);
          onChange(next);
        }}
      >
        {field.options?.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
        {field.allowCustom && <option value={WK_CUSTOM_SENTINEL}>Custom…</option>}
      </select>

      {showCustomInput && (
        <div className="field__custom-wrap">
          {field.customLabel && (
            <label className="field__custom-label" htmlFor={`${id}-custom`}>
              {field.customLabel}
            </label>
          )}
          <div className="field__box">
            <input
              id={`${id}-custom`}
              type="number"
              inputMode="decimal"
              className="field__input"
              value={value}
              placeholder={field.customPlaceholder || 'Enter custom value'}
              min={field.min}
              max={field.max}
              step={field.step || 'any'}
              onChange={(e) => onChange(e.target.value)}
            />
          </div>
        </div>
      )}
    </>
  );
}
