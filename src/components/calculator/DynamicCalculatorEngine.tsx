'use client';

import { useState, useReducer, useCallback, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Decimal from 'decimal.js';
import {
  RotateCcw,
  Copy,
  Check,
  Share2,
  GitCompareArrows,
  Sigma,
  Code2,
  Star,
  BookOpen,
  SlidersHorizontal,
  FlaskConical,
  Lightbulb,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  AlertCircle,
  FileText,
  BookmarkPlus,
  Trash2,
  X,
  ExternalLink,
} from 'lucide-react';
import type { CalculatorSchema, CalculatorField, OutputField, UsageGuide } from '@/types/calculator';
import { evaluateFormulas } from '@/engine/formulaParser';
import { usePreferences } from '@/context/PreferencesContext';
import { CategoryIcon } from '@/components/ui/SuiteIcon';
import EmbedModal from '@/components/calculator/EmbedModal';
import ScenarioChart from '@/components/calculator/ScenarioChart';
import { trackEvent } from '@/lib/telemetry';
import type {
  CalculatorSummary,
  EmbedCustomization,
  SavedScenario,
} from '@/lib/suites';

/* ============================================================
   State & Formula Evaluation Helpers
   ============================================================ */

interface ScenarioState {
  values: Record<string, string>;
  selectedUnits: Record<string, string>;
}

interface WorkbenchState {
  a: ScenarioState;
  b: ScenarioState;
  compareMode: boolean;
  activeTab: 'A' | 'B';
  loadedFromShare: boolean;
}

type WorkbenchAction =
  | { type: 'SET_VALUE'; fieldId: string; value: string }
  | { type: 'SET_UNIT'; fieldId: string; unit: string }
  | { type: 'TOGGLE_COMPARE' }
  | { type: 'SET_TAB'; tab: 'A' | 'B' }
  | { type: 'HYDRATE_URL'; a?: ScenarioState; b?: ScenarioState; fromShare?: boolean }
  | { type: 'DISMISS_SHARE_BANNER' }
  | { type: 'LOAD_SNAPSHOT'; scenario: SavedScenario }
  | { type: 'RESET'; defaults: ScenarioState };

function workbenchReducer(state: WorkbenchState, action: WorkbenchAction): WorkbenchState {
  switch (action.type) {
    case 'SET_VALUE': {
      const target = state.compareMode && state.activeTab === 'B' ? 'b' : 'a';
      return {
        ...state,
        [target]: {
          ...state[target],
          values: { ...state[target].values, [action.fieldId]: action.value },
        },
      };
    }
    case 'SET_UNIT': {
      const target = state.compareMode && state.activeTab === 'B' ? 'b' : 'a';
      return {
        ...state,
        [target]: {
          ...state[target],
          selectedUnits: { ...state[target].selectedUnits, [action.fieldId]: action.unit },
        },
      };
    }
    case 'TOGGLE_COMPARE': {
      if (!state.compareMode) {
        return {
          ...state,
          b: {
            values: { ...state.a.values },
            selectedUnits: { ...state.a.selectedUnits },
          },
          compareMode: true,
          activeTab: 'B',
        };
      }
      return { ...state, compareMode: false, activeTab: 'A' };
    }
    case 'SET_TAB':
      return { ...state, activeTab: action.tab };
    case 'HYDRATE_URL':
      return {
        a: action.a ?? state.a,
        b: action.b ?? state.b,
        compareMode: Boolean(action.b) || state.compareMode,
        activeTab: state.activeTab,
        loadedFromShare: Boolean(action.fromShare),
      };
    case 'DISMISS_SHARE_BANNER':
      return { ...state, loadedFromShare: false };
    case 'LOAD_SNAPSHOT':
      return {
        a: {
          values: { ...action.scenario.valuesA },
          selectedUnits: { ...action.scenario.unitsA },
        },
        b: action.scenario.valuesB
          ? {
              values: { ...action.scenario.valuesB },
              selectedUnits: { ...(action.scenario.unitsB ?? {}) },
            }
          : state.b,
        compareMode: Boolean(action.scenario.compareMode && action.scenario.valuesB),
        activeTab: 'A',
        loadedFromShare: false,
      };
    case 'RESET':
      return {
        a: action.defaults,
        b: action.defaults,
        compareMode: false,
        activeTab: 'A',
        loadedFromShare: false,
      };
    default:
      return state;
  }
}

function getDefaults(schema: CalculatorSchema): ScenarioState {
  const values: Record<string, string> = {};
  const selectedUnits: Record<string, string> = {};

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

  return { values, selectedUnits };
}

function computeScenario(
  schema: CalculatorSchema,
  state: ScenarioState
): {
  results: Record<string, Decimal>;
  inputDecimals: Record<string, Decimal>;
  warnings: Record<string, string>;
} {
  const inputDecimals: Record<string, Decimal> = {};
  const warnings: Record<string, string> = {};

  for (const field of schema.inputs) {
    const rawValue = state.values[field.id];

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
      if (!numericValue.isFinite()) throw new Error('Non-finite');
    } catch {
      numericValue = new Decimal(0);
      warnings[field.id] = 'Enter a valid number';
    }

    if (!warnings[field.id] && field.type === 'number') {
      if (field.min !== undefined && numericValue.lt(field.min)) {
        warnings[field.id] = `Minimum value is ${field.min}`;
      } else if (field.max !== undefined && numericValue.gt(field.max)) {
        warnings[field.id] = `Maximum value is ${field.max}`;
      }
    }

    if (field.units?.length) {
      const selectedUnit = state.selectedUnits[field.id];
      const unitDef = field.units.find((u) => u.value === selectedUnit);
      if (unitDef?.conversionFactor) {
        try {
          numericValue = numericValue.mul(new Decimal(unitDef.conversionFactor));
        } catch {
          // Ignore malformed conversion factor
        }
      }
    }

    inputDecimals[field.id] = numericValue;
  }

  try {
    const results = evaluateFormulas(schema.formulas, inputDecimals);
    return { results, inputDecimals, warnings };
  } catch {
    return { results: {}, inputDecimals, warnings };
  }
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
    case 'currency': {
      const formatted = addCommas(absVal.toFixed(precision));
      return `${isNeg ? '−' : ''}${currencySymbol}${formatted}`;
    }
    case 'percentage': {
      return `${isNeg ? '−' : ''}${absVal.toFixed(precision)}%`;
    }
    case 'scientific': {
      return value.toExponential(precision);
    }
    default: {
      const formatted = addCommas(absVal.toFixed(precision));
      return `${isNeg ? '−' : ''}${output.prefix || ''}${formatted}${output.suffix || ''}`;
    }
  }
}

function formatStepNumber(value: Decimal | undefined): string {
  if (!value || !value.isFinite() || value.isNaN()) return '—';
  const abs = value.abs();
  if (!abs.isZero() && (abs.gte('1e9') || abs.lt('1e-4'))) {
    return value.toExponential(4);
  }
  const fixed = value.toDecimalPlaces(6).toFixed();
  const [i, d] = fixed.split('.');
  const trimmedD = d ? d.replace(/0+$/, '') : '';
  return trimmedD ? `${i}.${trimmedD}` : i;
}

/* ============================================================
   Main Workbench Component
   ============================================================ */

interface DynamicCalculatorEngineProps {
  schema: CalculatorSchema;
  mode?: 'page' | 'embed';
  related?: CalculatorSummary[];
  embedConfig?: EmbedCustomization;
  initialValuesOverride?: Record<string, string>;
}

export default function DynamicCalculatorEngine({
  schema,
  mode = 'page',
  related = [],
  embedConfig,
  initialValuesOverride,
}: DynamicCalculatorEngineProps) {
  const {
    currency,
    favorites,
    toggleFavorite,
    recordVisit,
    savedScenarios,
    saveScenario,
    deleteScenario,
  } = usePreferences();

  const defaults = useMemo(() => {
    const base = getDefaults(schema);
    if (initialValuesOverride) {
      return {
        values: { ...base.values, ...initialValuesOverride },
        selectedUnits: base.selectedUnits,
      };
    }
    return base;
  }, [schema, initialValuesOverride]);

  const [wb, dispatch] = useReducer(workbenchReducer, {
    a: defaults,
    b: defaults,
    compareMode: false,
    activeTab: 'A',
    loadedFromShare: false,
  });
  const { a: stateA, b: stateB, compareMode, activeTab, loadedFromShare } = wb;

  const [showMath, setShowMath] = useState(false);
  const [embedOpen, setEmbedOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sharedCopied, setSharedCopied] = useState(false);
  const [snapshotDrawerOpen, setSnapshotDrawerOpen] = useState(false);
  const [snapshotName, setSnapshotName] = useState('');
  const [snapshotJustSaved, setSnapshotJustSaved] = useState(false);

  const isEmbed = mode === 'embed';
  const isFav = favorites.has(schema.id);
  const showChart = embedConfig?.showChart ?? true;
  const allowMath = embedConfig?.showMath ?? true;
  const allowCompare = embedConfig?.showCompare ?? true;
  const displayTitle = embedConfig?.title?.trim() || schema.title;

  const calculatorSnapshots = useMemo(
    () => savedScenarios.filter((s) => s.slug === schema.slug),
    [savedScenarios, schema.slug]
  );

  // Record visit for Recent Instruments + hydrate shared URL params cleanly on client
  useEffect(() => {
    if (!isEmbed) {
      recordVisit(schema.slug);
    }
    if (initialValuesOverride) return;
    try {
      const params = new URLSearchParams(window.location.search);
      const rawA = params.get('a') || params.get('v');
      const rawB = params.get('b');
      let hydratedA: ScenarioState | undefined;
      let hydratedB: ScenarioState | undefined;

      if (rawA) {
        const parsed = JSON.parse(rawA);
        if (parsed && typeof parsed === 'object') {
          hydratedA = {
            values: { ...defaults.values, ...(parsed.v || parsed) },
            selectedUnits: { ...defaults.selectedUnits, ...(parsed.u || {}) },
          };
        }
      }
      if (rawB) {
        const parsedB = JSON.parse(rawB);
        if (parsedB && typeof parsedB === 'object') {
          hydratedB = {
            values: { ...defaults.values, ...(parsedB.v || parsedB) },
            selectedUnits: { ...defaults.selectedUnits, ...(parsedB.u || {}) },
          };
        }
      }
      if (hydratedA || hydratedB) {
        dispatch({
          type: 'HYDRATE_URL',
          a: hydratedA,
          b: hydratedB,
          fromShare: !isEmbed,
        });
      }
    } catch {
      // Ignore malformed share URLs
    }
  }, [schema.slug, defaults, isEmbed, recordVisit, initialValuesOverride]);

  const evalA = useMemo(() => computeScenario(schema, stateA), [schema, stateA]);
  const evalB = useMemo(
    () => (compareMode ? computeScenario(schema, stateB) : null),
    [schema, stateB, compareMode]
  );

  const activeState = compareMode && activeTab === 'B' ? stateB : stateA;
  const activeWarnings =
    compareMode && activeTab === 'B' ? evalB?.warnings ?? {} : evalA.warnings;

  const handleValueChange = useCallback((fieldId: string, value: string) => {
    dispatch({ type: 'SET_VALUE', fieldId, value });
  }, []);

  const handleUnitChange = useCallback((fieldId: string, unit: string) => {
    dispatch({ type: 'SET_UNIT', fieldId, unit });
  }, []);

  const handleToggleCompare = useCallback(() => {
    trackEvent('compare_toggle', { slug: schema.slug, next: !compareMode });
    dispatch({ type: 'TOGGLE_COMPARE' });
  }, [schema.slug, compareMode]);

  const handleToggleMath = useCallback(() => {
    setShowMath((s) => {
      trackEvent('show_math_toggle', { slug: schema.slug, open: !s });
      return !s;
    });
  }, [schema.slug]);

  const handleOpenEmbed = useCallback(() => {
    trackEvent('embed_open', { slug: schema.slug });
    setEmbedOpen(true);
  }, [schema.slug]);

  const handlePrintBrief = useCallback(() => {
    trackEvent('brief_print', { slug: schema.slug, compareMode });
    window.print();
  }, [schema.slug, compareMode]);

  const handleReset = useCallback(() => {
    dispatch({ type: 'RESET', defaults });
  }, [defaults]);

  const handleCopyOutput = async (output: OutputField, val: Decimal | undefined) => {
    const text = formatDecimalValue(val, output, currency.symbol);
    if (text === '—') return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(output.id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {}
  };

  const handleShare = async () => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete('v');
      url.searchParams.set(
        'a',
        JSON.stringify({ v: stateA.values, u: stateA.selectedUnits })
      );
      if (compareMode) {
        url.searchParams.set(
          'b',
          JSON.stringify({ v: stateB.values, u: stateB.selectedUnits })
        );
      } else {
        url.searchParams.delete('b');
      }
      await navigator.clipboard.writeText(url.toString());
      trackEvent('share_copy', { slug: schema.slug, compareMode });
      setSharedCopied(true);
      setTimeout(() => setSharedCopied(false), 1800);
    } catch {}
  };

  const primaryOutput = useMemo(
    () => schema.outputs.find((o) => o.highlight) ?? schema.outputs[0],
    [schema.outputs]
  );

  // Build automatic proportional breakdown bar when multiple comparable positive outputs exist
  const visualSegments = useMemo(() => {
    const sameFormat = schema.outputs.filter((o) => {
      const val = evalA.results[o.formulaRef];
      return val && val.isFinite() && val.gt(0);
    });
    if (sameFormat.length < 2) return null;

    // Prefer currency outputs or matching format with primary
    const targetFormat = primaryOutput?.format ?? 'number';
    const matching = sameFormat.filter((o) => (o.format ?? 'number') === targetFormat);
    if (matching.length < 2) return null;

    const sorted = [...matching].sort((a, b) =>
      evalA.results[b.formulaRef].cmp(evalA.results[a.formulaRef])
    );
    const maxVal = evalA.results[sorted[0].formulaRef];
    if (maxVal.lte(0)) return null;

    return sorted.slice(0, 4).map((o, idx) => {
      const val = evalA.results[o.formulaRef];
      const pct = Math.min(100, Math.max(4, val.div(maxVal).times(100).toNumber()));
      return {
        id: o.id,
        label: o.label,
        formatted: formatDecimalValue(val, o, currency.symbol),
        pct,
        tone: idx === 0 ? 'accent' : idx === 1 ? 'info' : idx === 2 ? 'positive' : 'muted',
      };
    });
  }, [schema.outputs, evalA.results, primaryOutput, currency.symbol]);

  const primaryFormatted = primaryOutput
    ? formatDecimalValue(evalA.results[primaryOutput.formulaRef], primaryOutput, currency.symbol)
    : '—';

  const primaryFormattedB =
    compareMode && primaryOutput && evalB
      ? formatDecimalValue(evalB.results[primaryOutput.formulaRef], primaryOutput, currency.symbol)
      : undefined;

  const handleSaveSnapshot = (e: React.FormEvent) => {
    e.preventDefault();
    const label =
      snapshotName.trim() ||
      `${schema.title} (${primaryFormatted})`;

    saveScenario({
      name: label,
      slug: schema.slug,
      title: schema.title,
      category: schema.category,
      valuesA: { ...stateA.values },
      unitsA: { ...stateA.selectedUnits },
      compareMode,
      valuesB: compareMode ? { ...stateB.values } : undefined,
      unitsB: compareMode ? { ...stateB.selectedUnits } : undefined,
      primaryLabel: primaryOutput?.label ?? 'Result',
      primaryValue: primaryFormatted,
      primaryValueB: primaryFormattedB,
      currencyCode: currency.code,
    });
    trackEvent('scenario_save', { slug: schema.slug, compareMode });
    setSnapshotName('');
    setSnapshotJustSaved(true);
    setTimeout(() => setSnapshotJustSaved(false), 1800);
  };

  const validAccent =
    embedConfig?.accent && /^#[0-9a-fA-F]{6}$/.test(embedConfig.accent)
      ? embedConfig.accent
      : undefined;

  const validCtaUrl =
    embedConfig?.ctaUrl && /^https:\/\/.+/.test(embedConfig.ctaUrl.trim())
      ? embedConfig.ctaUrl.trim()
      : undefined;

  const customStyle = validAccent
    ? ({
        '--color-accent': validAccent,
        '--color-accent-hover': validAccent,
      } as React.CSSProperties)
    : undefined;

  return (
    <div className={`wb ${isEmbed ? 'wb--embed' : ''}`} style={customStyle}>
      {/* Loom-Style Shared Scenario Welcome Banner */}
      {!isEmbed && loadedFromShare && (
        <div className="share-welcome-bar" role="status">
          <div className="share-welcome-bar__text">
            <strong>Shared scenario loaded.</strong> Adjust any input to test your own numbers, compare A vs. B, or save a snapshot.
          </div>
          <div className="share-welcome-bar__actions">
            {!compareMode && (
              <button
                type="button"
                className="btn btn--primary btn--xs"
                onClick={handleToggleCompare}
              >
                <GitCompareArrows size={13} aria-hidden="true" />
                <span>Fork to A / B</span>
              </button>
            )}
            <button
              type="button"
              className="icon-btn icon-btn--xs"
              onClick={() => dispatch({ type: 'DISMISS_SHARE_BANNER' })}
              aria-label="Dismiss shared scenario banner"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Instrument Header */}
      <header className="wb-head">
        <div className="wb-head__top">
          <div className="wb-head__identity">
            <span className="wb-head__icon">
              <CategoryIcon categoryId={schema.category} size={20} />
            </span>
            <div>
              <h1 className="wb-head__title">{displayTitle}</h1>
              <p className="wb-head__desc">{schema.description}</p>
            </div>
          </div>

          {!isEmbed && (
            <div className="wb-head__actions">
              <button
                type="button"
                className={`btn btn--ghost btn--sm ${isFav ? 'btn--saved' : ''}`}
                onClick={() => toggleFavorite(schema.id)}
                aria-pressed={isFav}
                aria-label={isFav ? 'Remove from saved' : 'Pin instrument'}
              >
                <Star
                  size={15}
                  strokeWidth={1.75}
                  fill={isFav ? 'currentColor' : 'none'}
                  aria-hidden="true"
                />
                <span>{isFav ? 'Pinned' : 'Pin'}</span>
              </button>

              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={handleShare}
              >
                {sharedCopied ? <Check size={15} /> : <Share2 size={15} strokeWidth={1.75} />}
                <span>{sharedCopied ? 'Link copied' : 'Share'}</span>
              </button>

              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={handlePrintBrief}
                title="Export 1-page Decision Brief (Print / PDF)"
              >
                <FileText size={15} strokeWidth={1.75} aria-hidden="true" />
                <span>Brief / PDF</span>
              </button>

              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={handleOpenEmbed}
              >
                <Code2 size={15} strokeWidth={1.75} aria-hidden="true" />
                <span>Embed</span>
              </button>
            </div>
          )}
        </div>

        {/* Utility Mode Bar */}
        <div className="wb-toolbar">
          {allowCompare && (
            <button
              type="button"
              className={`wb-chip ${compareMode ? 'wb-chip--active' : ''}`}
              onClick={handleToggleCompare}
              aria-pressed={compareMode}
            >
              <GitCompareArrows size={14} strokeWidth={1.75} aria-hidden="true" />
              <span>{compareMode ? 'Comparing A vs. B' : 'Compare A / B'}</span>
            </button>
          )}

          {allowMath && (
            <button
              type="button"
              className={`wb-chip ${showMath ? 'wb-chip--active' : ''}`}
              onClick={handleToggleMath}
              aria-expanded={showMath}
            >
              <Sigma size={14} strokeWidth={1.75} aria-hidden="true" />
              <span>Show the Math</span>
            </button>
          )}

          {!isEmbed && (
            <button
              type="button"
              className={`wb-chip ${snapshotDrawerOpen ? 'wb-chip--active' : ''}`}
              onClick={() => setSnapshotDrawerOpen((o) => !o)}
              aria-expanded={snapshotDrawerOpen}
            >
              <BookmarkPlus size={14} strokeWidth={1.75} aria-hidden="true" />
              <span>
                {snapshotJustSaved
                  ? 'Snapshot saved'
                  : calculatorSnapshots.length > 0
                  ? `Snapshots (${calculatorSnapshots.length})`
                  : 'Save Snapshot'}
              </span>
            </button>
          )}

          <button type="button" className="wb-chip" onClick={handleReset}>
            <RotateCcw size={14} strokeWidth={1.75} aria-hidden="true" />
            <span>Reset</span>
          </button>

          <span className="wb-precision-tag">
            Decimal.js · Exact Precision
          </span>
        </div>

        {/* Local-First Saved Snapshots Drawer */}
        {!isEmbed && snapshotDrawerOpen && (
          <div className="snapshot-drawer">
            <form className="snapshot-form" onSubmit={handleSaveSnapshot}>
              <input
                type="text"
                value={snapshotName}
                onChange={(e) => setSnapshotName(e.target.value)}
                placeholder={`Name this snapshot (e.g. "${schema.title} — Option A")`}
                aria-label="Snapshot name"
                maxLength={80}
                className="snapshot-form__input"
              />
              <button type="submit" className="btn btn--primary btn--sm">
                <BookmarkPlus size={14} aria-hidden="true" />
                <span>Save Current</span>
              </button>
            </form>

            {calculatorSnapshots.length > 0 && (
              <ul className="snapshot-list">
                {calculatorSnapshots.map((snap) => (
                  <li key={snap.id} className="snapshot-item">
                    <button
                      type="button"
                      className="snapshot-item__load"
                      onClick={() => dispatch({ type: 'LOAD_SNAPSHOT', scenario: snap })}
                    >
                      <span className="snapshot-item__name">{snap.name}</span>
                      <span className="snapshot-item__val">
                        {snap.primaryValue}
                        {snap.compareMode && snap.primaryValueB
                          ? ` vs. ${snap.primaryValueB}`
                          : ''}
                      </span>
                    </button>
                    <button
                      type="button"
                      className="snapshot-item__del"
                      onClick={() => deleteScenario(snap.id)}
                      aria-label={`Delete snapshot ${snap.name}`}
                      title="Delete snapshot"
                    >
                      <Trash2 size={14} strokeWidth={1.75} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </header>

      {/* Split-Pane Instrument Workbench */}
      <div className="wb-grid">
        {/* LEFT PANE: Parameters */}
        <section className="wb-pane wb-pane--inputs" aria-label="Input parameters">
          <div className="wb-pane__head">
            <span className="wb-pane__label">Parameters</span>
            {compareMode && (
              <div className="seg-control" role="tablist" aria-label="Scenario selector">
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'A'}
                  className={`seg-control__btn ${
                    activeTab === 'A' ? 'seg-control__btn--active' : ''
                  }`}
                  onClick={() => dispatch({ type: 'SET_TAB', tab: 'A' })}
                >
                  Scenario A
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={activeTab === 'B'}
                  className={`seg-control__btn seg-control__btn--b ${
                    activeTab === 'B' ? 'seg-control__btn--active' : ''
                  }`}
                  onClick={() => dispatch({ type: 'SET_TAB', tab: 'B' })}
                >
                  Scenario B
                </button>
              </div>
            )}
          </div>

          {compareMode && (
            <div className={`wb-scenario-banner wb-scenario-banner--${activeTab.toLowerCase()}`}>
              Editing <strong>Scenario {activeTab}</strong> — adjust any parameter to inspect live deltas on the right.
            </div>
          )}

          <div className="wb-form">
            {schema.inputs.map((field) => (
              <FieldRenderer
                key={`${activeTab}-${field.id}`}
                field={field}
                value={activeState.values[field.id] ?? ''}
                selectedUnit={activeState.selectedUnits[field.id]}
                warning={activeWarnings[field.id]}
                currencySymbol={currency.symbol}
                onValueChange={handleValueChange}
                onUnitChange={handleUnitChange}
              />
            ))}
          </div>
        </section>

        {/* RIGHT PANE: Sticky Live Readout, Visual Breakdown & Formula Audit */}
        <section
          id="wb-results-pane"
          className="wb-pane wb-pane--outputs"
          aria-label="Live results"
          aria-live="polite"
        >
          <div className="wb-pane__head">
            <span className="wb-pane__label">
              {compareMode ? 'Scenario Comparison' : 'Live Readout'}
            </span>
            {primaryOutput && (
              <button
                type="button"
                className="btn btn--ghost btn--xs"
                onClick={() =>
                  handleCopyOutput(primaryOutput, evalA.results[primaryOutput.formulaRef])
                }
              >
                {copiedId === primaryOutput.id ? (
                  <Check size={13} />
                ) : (
                  <Copy size={13} strokeWidth={1.75} />
                )}
                <span>{copiedId === primaryOutput.id ? 'Copied' : 'Copy primary'}</span>
              </button>
            )}
          </div>

          {/* Standard Output Readouts OR Side-by-Side Scenario Diff */}
          {!compareMode ? (
            <div className="wb-outputs">
              {schema.outputs.map((output) => {
                const rawVal = evalA.results[output.formulaRef];
                const formatted = formatDecimalValue(rawVal, output, currency.symbol);
                const isCopied = copiedId === output.id;

                return (
                  <div
                    key={output.id}
                    className={`readout-card ${
                      output.highlight ? 'readout-card--primary' : ''
                    }`}
                  >
                    <div className="readout-card__meta">
                      <span className="readout-card__label">
                        {output.label}
                        {output.unit ? ` (${output.unit})` : ''}
                      </span>
                      <button
                        type="button"
                        className="readout-card__copy"
                        onClick={() => handleCopyOutput(output, rawVal)}
                        aria-label={`Copy ${output.label}`}
                        title="Copy value"
                      >
                        {isCopied ? <Check size={13} /> : <Copy size={13} strokeWidth={1.75} />}
                      </button>
                    </div>
                    <div className="readout-card__value">{formatted}</div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="compare-list">
              {schema.outputs.map((output) => {
                const valA = evalA.results[output.formulaRef];
                const valB = evalB?.results[output.formulaRef];
                const fmtA = formatDecimalValue(valA, output, currency.symbol);
                const fmtB = formatDecimalValue(valB, output, currency.symbol);

                let deltaEl = (
                  <span className="delta-pill delta-pill--flat">
                    <Minus size={12} aria-hidden="true" />
                    <span>No change</span>
                  </span>
                );

                if (valA?.isFinite() && valB?.isFinite()) {
                  const diff = valB.minus(valA);
                  if (!diff.isZero()) {
                    const isUp = diff.gt(0);
                    const pct = !valA.isZero()
                      ? diff.div(valA.abs()).times(100).toFixed(1)
                      : null;
                    const diffFmt = formatDecimalValue(diff.abs(), output, currency.symbol);
                    deltaEl = (
                      <span
                        className={`delta-pill ${
                          isUp ? 'delta-pill--up' : 'delta-pill--down'
                        }`}
                      >
                        {isUp ? (
                          <ArrowUpRight size={13} aria-hidden="true" />
                        ) : (
                          <ArrowDownRight size={13} aria-hidden="true" />
                        )}
                        <span>
                          {isUp ? '+' : '−'}
                          {diffFmt}
                          {pct !== null ? ` (${isUp ? '+' : ''}${pct}%)` : ''}
                        </span>
                      </span>
                    );
                  }
                }

                return (
                  <div
                    key={output.id}
                    className={`compare-card ${
                      output.highlight ? 'compare-card--primary' : ''
                    }`}
                  >
                    <div className="compare-card__head">
                      <span className="compare-card__label">
                        {output.label}
                        {output.unit ? ` (${output.unit})` : ''}
                      </span>
                      {deltaEl}
                    </div>
                    <div className="compare-card__cols">
                      <div className="compare-card__col">
                        <span className="compare-card__tag compare-card__tag--a">A</span>
                        <span className="compare-card__val">{fmtA}</span>
                      </div>
                      <div className="compare-card__col">
                        <span className="compare-card__tag compare-card__tag--b">B</span>
                        <span className="compare-card__val">{fmtB}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Interactive Projection & Sensitivity Curve (A vs. B ready) */}
          {showChart && primaryOutput && (
            <ScenarioChart
              schema={schema}
              primaryOutput={primaryOutput}
              inputDecimalsA={evalA.inputDecimals}
              inputDecimalsB={evalB?.inputDecimals ?? null}
              rawValuesA={stateA.values}
              rawValuesB={compareMode ? stateB.values : null}
              selectedUnitsA={stateA.selectedUnits}
              selectedUnitsB={compareMode ? stateB.selectedUnits : null}
              compareMode={compareMode}
              currencySymbol={currency.symbol}
            />
          )}

          {/* Auto-Visual Proportion Comparison Bars */}
          {visualSegments && !compareMode && (
            <div className="visual-panel" aria-label="Relative magnitude breakdown">
              <div className="visual-panel__title">Relative Scale</div>
              <div className="visual-bars">
                {visualSegments.map((seg) => (
                  <div key={seg.id} className="visual-bar">
                    <div className="visual-bar__row">
                      <span className="visual-bar__label">{seg.label}</span>
                      <span className="visual-bar__val">{seg.formatted}</span>
                    </div>
                    <div className="visual-bar__track">
                      <div
                        className={`visual-bar__fill visual-bar__fill--${seg.tone}`}
                        style={{ width: `${seg.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Auditable "Show the Math" AST Formula Breakdown */}
          {schema.formulas.length > 0 && (
            <div className={`audit-panel ${showMath ? '' : 'audit-panel--print-only'}`}>
              <div className="audit-panel__head">
                <Sigma size={14} strokeWidth={1.75} aria-hidden="true" />
                <span>Auditable Formula Trace ({schema.formulas.length} steps)</span>
              </div>
              <ol className="audit-steps">
                {schema.formulas.map((step, idx) => (
                  <li key={step.id} className="audit-step">
                    <span className="audit-step__num">{String(idx + 1).padStart(2, '0')}</span>
                    <div className="audit-step__body">
                      <div className="audit-step__top">
                        <code className="audit-step__var">{step.id}</code>
                        <span className="audit-step__val">
                          = {formatStepNumber(evalA.results[step.id])}
                        </span>
                      </div>
                      <code className="audit-step__expr">{step.expression}</code>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Print-only Decision Brief Input Summary & Verification Footer */}
          {!isEmbed && (
            <div className="print-brief-meta">
              <div className="print-brief-meta__title">Parameters Snapshot</div>
              <table className="print-table">
                <thead>
                  <tr>
                    <th>Parameter</th>
                    <th>Scenario A</th>
                    {compareMode && <th>Scenario B</th>}
                  </tr>
                </thead>
                <tbody>
                  {schema.inputs.map((field) => {
                    const label = field.label.replace(/\(\$\)/g, `(${currency.symbol})`);
                    const unitA = field.units?.length
                      ? ` ${stateA.selectedUnits[field.id] || field.units[0].label}`
                      : '';
                    const unitB = field.units?.length
                      ? ` ${stateB.selectedUnits[field.id] || field.units[0].label}`
                      : '';
                    return (
                      <tr key={field.id}>
                        <td>{label}</td>
                        <td>{(stateA.values[field.id] || '—') + unitA}</td>
                        {compareMode && (
                          <td>{(stateB.values[field.id] || '—') + unitB}</td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="print-brief-foot">
                <span>Quantify · Verified with Decimal.js Arbitrary-Precision Engine</span>
                <span>quantify-ashen.vercel.app/calculator/{schema.slug}</span>
              </div>
            </div>
          )}

          {isEmbed && (
            <div className="embed-footer">
              {validCtaUrl && embedConfig?.ctaLabel?.trim() && (
                <a
                  href={validCtaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--primary embed-cta-btn"
                >
                  <span>{embedConfig.ctaLabel.trim()}</span>
                  <ExternalLink size={14} aria-hidden="true" />
                </a>
              )}
              <div className="embed-attribution">
                <span>Built with</span>
                <a
                  href={`https://quantify-ashen.vercel.app/studio?slug=${schema.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Quantify Studio
                </a>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Mobile Sticky Live Result Bar (keeps primary answer visible while typing on phones) */}
      {!isEmbed && primaryOutput && (
        <div className="mobile-readout-bar" role="status" aria-live="polite">
          <div className="mobile-readout-bar__text">
            <span className="mobile-readout-bar__label">{primaryOutput.label}</span>
            <span className="mobile-readout-bar__value">{primaryFormatted}</span>
          </div>
          <div className="mobile-readout-bar__actions">
            <button
              type="button"
              className="btn btn--ghost btn--xs"
              onClick={() =>
                handleCopyOutput(primaryOutput, evalA.results[primaryOutput.formulaRef])
              }
              aria-label="Copy primary result"
            >
              {copiedId === primaryOutput.id ? <Check size={14} /> : <Copy size={14} />}
            </button>
            <a href="#wb-results-pane" className="btn btn--primary btn--xs">
              Details
            </a>
          </div>
        </div>
      )}

      {/* Structured Usage Guide */}
      {!isEmbed && schema.guide && <GuidePanel guide={schema.guide} />}

      {/* Related Instruments for Deep Discovery & SEO */}
      {!isEmbed && related.length > 0 && (
        <section className="related-section" aria-label="Related instruments">
          <h2 className="related-section__title">Related Instruments</h2>
          <div className="related-grid">
            {related.map((item) => (
              <Link
                key={item.id}
                href={`/calculator/${item.slug}`}
                className="related-card"
              >
                <span className="related-card__icon">
                  <CategoryIcon categoryId={item.category} size={16} />
                </span>
                <div className="related-card__body">
                  <span className="related-card__title">{item.title}</span>
                  <span className="related-card__desc">{item.description}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {!isEmbed && (
        <EmbedModal
          schema={schema}
          isOpen={embedOpen}
          onClose={() => setEmbedOpen(false)}
        />
      )}
    </div>
  );
}

/* ============================================================
   Field Renderer
   ============================================================ */

interface FieldRendererProps {
  field: CalculatorField;
  value: string;
  selectedUnit?: string;
  warning?: string;
  currencySymbol: string;
  onValueChange: (id: string, value: string) => void;
  onUnitChange: (id: string, unit: string) => void;
}

function FieldRenderer({
  field,
  value,
  selectedUnit,
  warning,
  currencySymbol,
  onValueChange,
  onUnitChange,
}: FieldRendererProps) {
  // Replace hardcoded ($) in label with active currency symbol
  const displayLabel = field.label.replace(/\(\$\)/g, `(${currencySymbol})`);

  switch (field.type) {
    case 'number':
      return (
        <div className="field">
          <div className="field__head">
            <label className="field__label" htmlFor={field.id}>
              {displayLabel}
            </label>
            {field.min !== undefined && field.max !== undefined && (
              <span className="field__bounds">
                {field.min}–{field.max}
              </span>
            )}
          </div>
          {field.helpText && <p className="field__help">{field.helpText}</p>}
          <div className={`field__box ${warning ? 'field__box--error' : ''}`}>
            <input
              id={field.id}
              type="number"
              inputMode="decimal"
              className="field__input"
              value={value}
              placeholder={field.placeholder || '0'}
              min={field.min}
              max={field.max}
              step={field.step || 'any'}
              aria-invalid={Boolean(warning)}
              onChange={(e) => onValueChange(field.id, e.target.value)}
            />
            {field.units && field.units.length > 0 && (
              <select
                className="field__unit"
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
          {warning && (
            <span className="field__error" role="alert">
              <AlertCircle size={13} aria-hidden="true" />
              <span>{warning}</span>
            </span>
          )}
        </div>
      );

    case 'select':
      return (
        <div className="field">
          <label className="field__label" htmlFor={field.id}>
            {displayLabel}
          </label>
          {field.helpText && <p className="field__help">{field.helpText}</p>}
          <select
            id={field.id}
            className="field__select"
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
        <div className="field">
          <div className="field__head">
            <label className="field__label" htmlFor={field.id}>
              {displayLabel}
            </label>
            <span className="field__range-readout">{value || field.min || 0}</span>
          </div>
          {field.helpText && <p className="field__help">{field.helpText}</p>}
          <input
            id={field.id}
            type="range"
            className="field__range"
            value={value || field.min || 0}
            min={field.min ?? 0}
            max={field.max ?? 100}
            step={field.step ?? 1}
            onChange={(e) => onValueChange(field.id, e.target.value)}
          />
        </div>
      );

    case 'checkbox':
      return (
        <div className="field">
          <label className="field__check-row" htmlFor={field.id}>
            <input
              id={field.id}
              type="checkbox"
              className="field__checkbox"
              checked={value === 'true'}
              onChange={(e) => onValueChange(field.id, String(e.target.checked))}
            />
            <span className="field__check-label">{displayLabel}</span>
          </label>
          {field.helpText && <p className="field__help">{field.helpText}</p>}
        </div>
      );

    default:
      return null;
  }
}

/* ============================================================
   Usage Guide Panel
   ============================================================ */

function GuidePanel({ guide }: { guide: UsageGuide }) {
  const [isOpen, setIsOpen] = useState(true);

  const sections = [
    {
      icon: <BookOpen size={15} strokeWidth={1.75} aria-hidden="true" />,
      title: 'Concept',
      content: guide.whatIsIt,
    },
    {
      icon: <SlidersHorizontal size={15} strokeWidth={1.75} aria-hidden="true" />,
      title: 'How to use',
      content: guide.howToUse,
    },
    {
      icon: <FlaskConical size={15} strokeWidth={1.75} aria-hidden="true" />,
      title: 'Worked example',
      content: guide.exampleScenario,
    },
    {
      icon: <Lightbulb size={15} strokeWidth={1.75} aria-hidden="true" />,
      title: 'Expert insight',
      content: guide.proTip,
    },
  ];

  return (
    <section className="guide-panel" aria-label="Methodology and usage guide">
      <button
        type="button"
        className="guide-panel__toggle"
        onClick={() => setIsOpen((o) => !o)}
        aria-expanded={isOpen}
      >
        <BookOpen size={16} strokeWidth={1.75} aria-hidden="true" />
        <span className="guide-panel__heading">Methodology &amp; Usage Guide</span>
        <ChevronDown
          size={16}
          strokeWidth={1.75}
          className={`guide-panel__chev ${isOpen ? 'guide-panel__chev--open' : ''}`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div className="guide-panel__grid">
          {sections.map((section) => (
            <article key={section.title} className="guide-card">
              <h3 className="guide-card__title">
                {section.icon}
                <span>{section.title}</span>
              </h3>
              <p className="guide-card__copy">{section.content}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
