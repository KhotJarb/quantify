'use client';

import { useState, useMemo, useRef } from 'react';
import Decimal from 'decimal.js';
import { TrendingUp } from 'lucide-react';
import type { CalculatorSchema, CalculatorField, OutputField } from '@/types/calculator';
import { evaluateFormulas } from '@/engine/formulaParser';
import { trackEvent } from '@/lib/telemetry';

interface ScenarioChartProps {
  schema: CalculatorSchema;
  primaryOutput: OutputField;
  inputDecimalsA: Record<string, Decimal>;
  inputDecimalsB: Record<string, Decimal> | null;
  rawValuesA: Record<string, string>;
  rawValuesB: Record<string, string> | null;
  selectedUnitsA: Record<string, string>;
  selectedUnitsB: Record<string, string> | null;
  compareMode: boolean;
  currencySymbol: string;
}

interface SamplePoint {
  xDisplay: number;
  yA: number | null;
  yB: number | null;
  dA: Decimal | null;
  dB: Decimal | null;
}

const TIME_FIELD_RE = /(year|tenure|term|month|period|duration|horizon|time|age)/i;
const SAMPLES = 25;

function getUnitFactor(field: CalculatorField, selectedUnits: Record<string, string> | null): Decimal {
  if (!field.units?.length || !selectedUnits) return new Decimal(1);
  const selected = selectedUnits[field.id];
  const def = field.units.find((u) => u.value === selected);
  if (!def?.conversionFactor) return new Decimal(1);
  try {
    return new Decimal(def.conversionFactor);
  } catch {
    return new Decimal(1);
  }
}

function formatCompact(val: number, output: OutputField, currencySymbol: string): string {
  if (!Number.isFinite(val)) return '—';
  const sign = val < 0 ? '−' : '';
  const abs = Math.abs(val);

  let compact: string;
  if (abs >= 1_000_000_000) compact = `${(abs / 1_000_000_000).toFixed(1)}B`;
  else if (abs >= 1_000_000) compact = `${(abs / 1_000_000).toFixed(1)}M`;
  else if (abs >= 10_000) compact = `${(abs / 1_000).toFixed(1)}k`;
  else if (abs >= 100) compact = abs.toFixed(0);
  else if (abs >= 10) compact = abs.toFixed(1);
  else compact = abs.toFixed(2);

  if (output.format === 'currency') return `${sign}${currencySymbol}${compact}`;
  if (output.format === 'percentage') return `${sign}${compact}%`;
  return `${sign}${output.prefix || ''}${compact}${output.suffix || ''}`;
}

function formatFull(d: Decimal | null, output: OutputField, currencySymbol: string): string {
  if (!d || !d.isFinite() || d.isNaN()) return '—';
  const prec = output.precision ?? 2;
  const isNeg = d.isNegative();
  const abs = d.abs();
  const addCommas = (s: string) => {
    const [intP, decP] = s.split('.');
    const c = intP.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return decP !== undefined ? `${c}.${decP}` : c;
  };
  if (output.format === 'currency') {
    return `${isNeg ? '−' : ''}${currencySymbol}${addCommas(abs.toFixed(prec))}`;
  }
  if (output.format === 'percentage') {
    return `${isNeg ? '−' : ''}${abs.toFixed(prec)}%`;
  }
  if (output.format === 'scientific') return d.toExponential(prec);
  return `${isNeg ? '−' : ''}${output.prefix || ''}${addCommas(abs.toFixed(prec))}${output.suffix || ''}`;
}

function formatAxisNum(n: number): string {
  if (!Number.isFinite(n)) return '';
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 10_000) return `${(n / 1_000).toFixed(1)}k`;
  if (Number.isInteger(n)) return String(n);
  return Number(n.toFixed(2)).toString();
}

export default function ScenarioChart({
  schema,
  primaryOutput,
  inputDecimalsA,
  inputDecimalsB,
  rawValuesA,
  rawValuesB,
  selectedUnitsA,
  selectedUnitsB,
  compareMode,
  currencySymbol,
}: ScenarioChartProps) {
  const numericFields = useMemo(
    () => schema.inputs.filter((f) => f.type === 'number' || f.type === 'range'),
    [schema.inputs]
  );

  // Pick the most informative default sweep axis (time-horizon first, else primary numeric input)
  const defaultFieldId = useMemo(() => {
    const timeField = numericFields.find(
      (f) => TIME_FIELD_RE.test(f.id) || TIME_FIELD_RE.test(f.label)
    );
    if (timeField) return timeField.id;
    return numericFields[0]?.id ?? '';
  }, [numericFields]);

  const [selectedFieldId, setSelectedFieldId] = useState<string>('');
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const activeFieldId =
    selectedFieldId && numericFields.some((f) => f.id === selectedFieldId)
      ? selectedFieldId
      : defaultFieldId;

  const activeField = useMemo(
    () => numericFields.find((f) => f.id === activeFieldId),
    [numericFields, activeFieldId]
  );

  const chartData = useMemo(() => {
    if (!activeField || !primaryOutput) return null;

    const rawA = Number(rawValuesA[activeField.id]);
    const rawB = compareMode && rawValuesB ? Number(rawValuesB[activeField.id]) : NaN;
    const baseA = Number.isFinite(rawA) ? rawA : Number(activeField.defaultValue ?? 0);
    const baseB = Number.isFinite(rawB) ? rawB : baseA;

    const isTimeAxis =
      TIME_FIELD_RE.test(activeField.id) || TIME_FIELD_RE.test(activeField.label);

    let xMin: number;
    let xMax: number;

    if (isTimeAxis && Math.max(baseA, baseB) > 0) {
      xMin = activeField.min !== undefined ? Math.max(0, activeField.min) : 0;
      xMax = Math.max(baseA, baseB);
      if (xMax <= xMin) xMax = xMin + 10;
    } else {
      const center = Math.max(Math.abs(baseA), Math.abs(baseB), 1);
      const lo = Math.min(baseA, baseB);
      const hi = Math.max(baseA, baseB);
      xMin = lo > 0 ? lo * 0.5 : lo - center * 0.5;
      xMax = hi > 0 ? hi * 1.5 : hi + center * 0.5;
      if (activeField.min !== undefined) xMin = Math.max(activeField.min, xMin);
      if (activeField.max !== undefined) xMax = Math.min(activeField.max, xMax);
      if (xMax <= xMin) return null;
    }

    const factorA = getUnitFactor(activeField, selectedUnitsA);
    const factorB = getUnitFactor(activeField, selectedUnitsB);
    const points: SamplePoint[] = [];

    for (let i = 0; i < SAMPLES; i++) {
      const ratio = i / (SAMPLES - 1);
      const xDisplay = xMin + (xMax - xMin) * ratio;
      const xDec = new Decimal(xDisplay);

      // Evaluate Scenario A
      let dA: Decimal | null = null;
      let yA: number | null = null;
      try {
        const resA = evaluateFormulas(schema.formulas, {
          ...inputDecimalsA,
          [activeField.id]: xDec.mul(factorA),
        });
        const vA = resA[primaryOutput.formulaRef];
        if (vA && vA.isFinite() && !vA.isNaN()) {
          dA = vA;
          yA = vA.toNumber();
        }
      } catch {}

      // Evaluate Scenario B if comparing
      let dB: Decimal | null = null;
      let yB: number | null = null;
      if (compareMode && inputDecimalsB) {
        try {
          const resB = evaluateFormulas(schema.formulas, {
            ...inputDecimalsB,
            [activeField.id]: xDec.mul(factorB),
          });
          const vB = resB[primaryOutput.formulaRef];
          if (vB && vB.isFinite() && !vB.isNaN()) {
            dB = vB;
            yB = vB.toNumber();
          }
        } catch {}
      }

      points.push({ xDisplay, yA, yB, dA, dB });
    }

    const allY = points
      .flatMap((p) => [p.yA, p.yB])
      .filter((v): v is number => v !== null && Number.isFinite(v));

    if (allY.length < 4) return null;
    const rawMin = Math.min(...allY);
    const rawMax = Math.max(...allY);
    if (Math.abs(rawMax - rawMin) < 1e-9) return null;

    // Pad vertical domain slightly for visual breathing room
    const span = rawMax - rawMin;
    const yMin = rawMin >= 0 && rawMin - span * 0.08 < 0 ? 0 : rawMin - span * 0.08;
    const yMax = rawMax + span * 0.08;

    return {
      points,
      xMin,
      xMax,
      yMin,
      yMax,
      baseA,
      baseB,
      isTimeAxis,
    };
  }, [
    activeField,
    primaryOutput,
    rawValuesA,
    rawValuesB,
    selectedUnitsA,
    selectedUnitsB,
    compareMode,
    schema.formulas,
    inputDecimalsA,
    inputDecimalsB,
  ]);

  if (!chartData || !activeField) return null;

  // SVG Coordinate Geometry
  const W = 600;
  const H = 216;
  const padL = 62;
  const padR = 16;
  const padT = 16;
  const padB = 30;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;

  const toX = (x: number) =>
    padL + ((x - chartData.xMin) / (chartData.xMax - chartData.xMin)) * plotW;
  const toY = (y: number) =>
    padT + (1 - (y - chartData.yMin) / (chartData.yMax - chartData.yMin)) * plotH;

  const validA = chartData.points
    .map((p, idx) => ({ idx, x: toX(p.xDisplay), y: p.yA !== null ? toY(p.yA) : null }))
    .filter((p): p is { idx: number; x: number; y: number } => p.y !== null);

  const validB = compareMode
    ? chartData.points
        .map((p, idx) => ({ idx, x: toX(p.xDisplay), y: p.yB !== null ? toY(p.yB) : null }))
        .filter((p): p is { idx: number; x: number; y: number } => p.y !== null)
    : [];

  if (validA.length < 3) return null;

  const pathA = validA.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const areaA = `${pathA} L${validA[validA.length - 1].x.toFixed(1)},${(padT + plotH).toFixed(1)} L${validA[0].x.toFixed(1)},${(padT + plotH).toFixed(1)} Z`;

  const pathB =
    validB.length >= 3
      ? validB.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
      : '';

  // Divergence band polygon between A and B when both share points
  const diffPolygon =
    compareMode && validB.length === validA.length && validA.length >= 3
      ? `${validA.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')} ${[...validB]
          .reverse()
          .map((p) => `L${p.x.toFixed(1)},${p.y.toFixed(1)}`)
          .join(' ')} Z`
      : '';

  // Find nearest point to current input value for resting marker
  const currentIdx = chartData.points.reduce((bestIdx, pt, idx) => {
    const bestDist = Math.abs(chartData.points[bestIdx].xDisplay - chartData.baseA);
    const currDist = Math.abs(pt.xDisplay - chartData.baseA);
    return currDist < bestDist ? idx : bestIdx;
  }, 0);

  const inspectIdx = hoverIdx !== null ? hoverIdx : currentIdx;
  const inspected = chartData.points[inspectIdx];
  const inspectX = toX(inspected.xDisplay);

  const handlePointer = (clientX: number) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect || rect.width <= 0) return;
    const svgX = ((clientX - rect.left) / rect.width) * W;
    const clamped = Math.max(padL, Math.min(padL + plotW, svgX));
    const ratio = (clamped - padL) / plotW;
    const idx = Math.round(ratio * (chartData.points.length - 1));
    setHoverIdx(Math.max(0, Math.min(chartData.points.length - 1, idx)));
  };

  const yTicks = [0, 0.33, 0.67, 1].map((t) => {
    const val = chartData.yMin + (chartData.yMax - chartData.yMin) * t;
    return { y: toY(val), label: formatCompact(val, primaryOutput, currencySymbol) };
  });

  const cleanFieldLabel = activeField.label.replace(/\(\$\)/g, `(${currencySymbol})`);
  const xUnit = activeField.units?.length ? ` ${selectedUnitsA[activeField.id] || activeField.units[0].label}` : '';

  const diffDelta =
    compareMode && inspected.dA && inspected.dB
      ? inspected.dB.minus(inspected.dA)
      : null;

  return (
    <div className="chart-panel" aria-label={`Interactive ${primaryOutput.label} projection curve`}>
      <div className="chart-panel__head">
        <div className="chart-panel__title-wrap">
          <TrendingUp size={14} strokeWidth={1.75} aria-hidden="true" />
          <span className="chart-panel__title">
            {chartData.isTimeAxis ? 'Projection Curve' : 'Sensitivity Curve'}
          </span>
        </div>

        {numericFields.length > 1 ? (
          <label className="chart-axis-picker">
            <span className="sr-only">Plot primary result against parameter</span>
            <span className="chart-axis-picker__prefix">vs.</span>
            <select
              className="chart-axis-picker__select"
              value={activeField.id}
              onChange={(e) => {
                setSelectedFieldId(e.target.value);
                setHoverIdx(null);
                trackEvent('chart_axis_change', {
                  slug: schema.slug,
                  field: e.target.value,
                });
              }}
            >
              {numericFields.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.label.replace(/\(\$\)/g, `(${currencySymbol})`)}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <span className="chart-panel__axis-label">vs. {cleanFieldLabel}</span>
        )}
      </div>

      {/* Live Precision Crosshair Readout Strip */}
      <div className="chart-readout">
        <span className="chart-readout__x">
          {cleanFieldLabel}: <strong>{formatAxisNum(inspected.xDisplay)}{xUnit}</strong>
        </span>
        <div className="chart-readout__vals">
          <span className="chart-readout__item chart-readout__item--a">
            <span className="chart-dot chart-dot--a" aria-hidden="true" />
            <span>{compareMode ? 'A: ' : ''}{formatFull(inspected.dA, primaryOutput, currencySymbol)}</span>
          </span>
          {compareMode && inspected.dB && (
            <span className="chart-readout__item chart-readout__item--b">
              <span className="chart-dot chart-dot--b" aria-hidden="true" />
              <span>B: {formatFull(inspected.dB, primaryOutput, currencySymbol)}</span>
            </span>
          )}
          {diffDelta && !diffDelta.isZero() && (
            <span className="chart-readout__delta">
              Δ {diffDelta.gt(0) ? '+' : '−'}
              {formatFull(diffDelta.abs(), primaryOutput, currencySymbol)}
            </span>
          )}
        </div>
      </div>

      {/* Pure Responsive SVG Plot */}
      <div className="chart-svg-wrap">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="chart-svg"
          role="img"
          aria-label={`${primaryOutput.label} plotted against ${cleanFieldLabel}`}
          onPointerMove={(e) => handlePointer(e.clientX)}
          onPointerDown={(e) => handlePointer(e.clientX)}
          onPointerLeave={() => setHoverIdx(null)}
        >
          {/* Horizontal gridlines + Y labels */}
          {yTicks.map((tick, idx) => (
            <g key={idx}>
              <line
                x1={padL}
                y1={tick.y}
                x2={W - padR}
                y2={tick.y}
                className="chart-gridline"
              />
              <text
                x={padL - 8}
                y={tick.y + 3.5}
                textAnchor="end"
                className="chart-axis-text"
              >
                {tick.label}
              </text>
            </g>
          ))}

          {/* X-axis ticks (start, mid, end) */}
          {[0, 0.5, 1].map((r, i) => {
            const val = chartData.xMin + (chartData.xMax - chartData.xMin) * r;
            const xPos = toX(val);
            const anchor = i === 0 ? 'start' : i === 2 ? 'end' : 'middle';
            return (
              <text
                key={i}
                x={xPos}
                y={H - 8}
                textAnchor={anchor}
                className="chart-axis-text"
              >
                {formatAxisNum(val)}
              </text>
            );
          })}

          {/* Area under Curve A (single mode) OR Divergence Band (Compare mode) */}
          {!compareMode ? (
            <path d={areaA} className="chart-area-a" />
          ) : diffPolygon ? (
            <path d={diffPolygon} className="chart-diff-band" />
          ) : null}

          {/* Scenario A Line */}
          <path d={pathA} className="chart-line-a" />

          {/* Scenario B Line */}
          {compareMode && pathB && <path d={pathB} className="chart-line-b" />}

          {/* Vertical Scrub Crosshair */}
          <line
            x1={inspectX}
            y1={padT}
            x2={inspectX}
            y2={padT + plotH}
            className="chart-crosshair"
          />

          {/* Inspected Data Points */}
          {inspected.yA !== null && (
            <circle
              cx={inspectX}
              cy={toY(inspected.yA)}
              r={4.5}
              className="chart-point-a"
            />
          )}
          {compareMode && inspected.yB !== null && (
            <circle
              cx={inspectX}
              cy={toY(inspected.yB)}
              r={4.5}
              className="chart-point-b"
            />
          )}
        </svg>
      </div>
    </div>
  );
}
