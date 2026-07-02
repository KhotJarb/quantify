'use client';

import { useState, useMemo } from 'react';

/* ─── Types ──────────────────────────────────────────────────────────────── */
type Unit = 'kg' | 'lbs';
type Formula = 'average' | 'epley' | 'brzycki';
type Status = 'progressed' | 'close' | 'maintained' | 'regressed' | 'baseline';

/* ─── Pure math ──────────────────────────────────────────────────────────── */
function calcE1RM(weight: number, reps: number, formula: Formula): number {
  if (weight <= 0 || reps <= 0) return 0;
  if (reps === 1) return weight;
  const r = Math.min(reps, 36); // Brzycki is undefined at reps ≥ 37
  const epley = weight * (1 + r / 30);
  const brzycki = weight * 36 / (37 - r);
  if (formula === 'epley') return epley;
  if (formula === 'brzycki') return brzycki;
  return (epley + brzycki) / 2;
}

function vol(w: number, r: number, s: number): number { return w * r * s; }
function pctChange(curr: number, prev: number): number {
  return prev === 0 ? 0 : ((curr - prev) / prev) * 100;
}
function ceilTo(value: number, step: number): number {
  return Math.ceil(value / step) * step;
}
function safeN(s: string): number { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : 0; }
function fd(n: number, dp = 1): string { return isFinite(n) ? n.toFixed(dp) : '—'; }

/* ─── Config ─────────────────────────────────────────────────────────────── */
const STATUS_CFG: Record<Status, { emoji: string; label: string; color: string; bg: string; border: string }> = {
  progressed: { emoji: '💪', label: 'PROGRESSED', color: '#4a9a6a', bg: 'rgba(74,154,106,0.10)', border: 'rgba(74,154,106,0.28)' },
  close:      { emoji: '⚡', label: 'SO CLOSE',   color: '#c4944a', bg: 'rgba(196,148,74,0.10)', border: 'rgba(196,148,74,0.28)' },
  maintained: { emoji: '🔄', label: 'MAINTAINED', color: '#5c7a8a', bg: 'rgba(92,122,138,0.10)', border: 'rgba(92,122,138,0.28)' },
  regressed:  { emoji: '📉', label: 'VOLUME DIP', color: '#a05a5a', bg: 'rgba(160,90,90,0.10)',  border: 'rgba(160,90,90,0.28)' },
  baseline:   { emoji: '🏋️', label: 'SESSION LOGGED', color: '#8b7355', bg: 'rgba(139,115,85,0.10)', border: 'rgba(139,115,85,0.28)' },
};

const TIERS = [
  { min: 2.0, label: 'Elite',        color: '#c4944a', desc: 'World-class — top 1% of lifters' },
  { min: 1.5, label: 'Advanced',     color: '#4a9a6a', desc: 'Competitive-level — top 10%' },
  { min: 1.0, label: 'Intermediate', color: '#5c7a8a', desc: 'Solid training base' },
  { min: 0.5, label: 'Beginner',     color: '#9b6b9e', desc: 'Building the foundation' },
  { min: 0,   label: 'Novice',       color: '#8b7355', desc: 'Just getting started — keep going' },
];

const FORMULA_INFO: Record<Formula, { name: string; when: string }> = {
  average:  { name: 'Average (Recommended)', when: 'Best all-round accuracy' },
  epley:    { name: 'Epley Formula',         when: 'Best for sets of 2–10 reps' },
  brzycki:  { name: 'Brzycki Formula',       when: 'More conservative; underestimates at high reps' },
};

/* ─── Sub-components ─────────────────────────────────────────────────────── */
function NumInput({
  label, value, onChange, unit, placeholder, hint,
}: {
  label: string; value: string; onChange: (v: string) => void;
  unit?: string; placeholder?: string; hint?: string;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: '#8b8780', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <input
          type="number"
          inputMode="decimal"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder ?? '0'}
          min={0}
          style={{
            width: '100%', boxSizing: 'border-box',
            padding: unit ? '10px 44px 10px 14px' : '10px 14px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.10)',
            borderRadius: 10,
            color: '#e8e6e0', fontSize: 15, fontWeight: 500,
            outline: 'none', transition: 'border 0.2s',
          }}
          onFocus={e => { e.target.style.borderColor = 'rgba(90,138,106,0.55)'; }}
          onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.10)'; }}
        />
        {unit && (
          <span style={{
            position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
            fontSize: 12, color: '#8b8780', fontWeight: 600, pointerEvents: 'none',
          }}>{unit}</span>
        )}
      </div>
      {hint && <span style={{ fontSize: 11, color: '#6b6862' }}>{hint}</span>}
    </div>
  );
}

function PathCard({
  method, icon, action, change, highlight,
}: {
  method: string; icon: string; action: string; change: string; highlight?: boolean;
}) {
  return (
    <div style={{
      background: highlight ? 'rgba(74,154,106,0.08)' : 'rgba(255,255,255,0.03)',
      border: `1px solid ${highlight ? 'rgba(74,154,106,0.28)' : 'rgba(255,255,255,0.08)'}`,
      borderRadius: 14, padding: '18px 20px',
      display: 'flex', flexDirection: 'column', gap: 8,
      flex: 1, minWidth: 180,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 22 }}>{icon}</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#8b8780', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{method}</span>
      </div>
      <div style={{ fontSize: 20, fontWeight: 700, color: highlight ? '#4a9a6a' : '#e8e6e0' }}>{action}</div>
      <div style={{ fontSize: 12, color: '#8b8780' }}>{change}</div>
    </div>
  );
}

function MetricBlock({ label, value, sub, delta, color }: {
  label: string; value: string; sub?: string; delta?: string; color?: string;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#6b6862', letterSpacing: '0.07em', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color: color ?? '#e8e6e0', lineHeight: 1.1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: '#8b8780' }}>{sub}</div>}
      {delta && (
        <div style={{
          fontSize: 12, fontWeight: 600,
          color: delta.startsWith('+') ? '#4a9a6a' : delta.startsWith('-') ? '#a05a5a' : '#8b8780',
        }}>{delta}</div>
      )}
    </div>
  );
}

/* ─── Volume Bar ──────────────────────────────────────────────────────────── */
function VolumeBar({ prev, curr, target }: { prev: number; curr: number; target: number }) {
  const max = Math.max(prev, curr, target) * 1.05;
  const prevW = max > 0 ? (prev / max) * 100 : 0;
  const currW = max > 0 ? (curr / max) * 100 : 0;
  const targW = max > 0 ? (target / max) * 100 : 0;

  const Bar = ({ width, color, label, value }: { width: number; color: string; label: string; value: string }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ width: 80, fontSize: 11, color: '#8b8780', textAlign: 'right', flexShrink: 0 }}>{label}</div>
      <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: 6, height: 10, overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${Math.min(width, 100)}%`,
          background: color, borderRadius: 6,
          transition: 'width 0.5s cubic-bezier(0.4,0,0.2,1)',
        }} />
      </div>
      <div style={{ width: 70, fontSize: 12, fontWeight: 600, color: '#e8e6e0', flexShrink: 0 }}>{value}</div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {prev > 0 && <Bar width={prevW} color="rgba(92,122,138,0.7)" label="Last session" value={fd(prev, 0)} />}
      {curr > 0 && <Bar width={currW} color="rgba(74,154,106,0.8)" label="This session" value={fd(curr, 0)} />}
      {target > 0 && <Bar width={targW} color="rgba(196,148,74,0.55)" label="Next target" value={fd(target, 0)} />}
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────────────────── */
export default function ProgressiveOverloadCalculator() {
  const [unit, setUnit] = useState<Unit>('kg');
  const [formula, setFormula] = useState<Formula>('average');
  const [exerciseName, setExerciseName] = useState('');
  const [progressTarget, setProgressTarget] = useState(5);
  const [showGuide, setShowGuide] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Last session
  const [pw, setPw] = useState('');
  const [pr, setPr] = useState('');
  const [ps, setPs] = useState('');

  // This session
  const [cw, setCw] = useState('');
  const [cr, setCr] = useState('');
  const [cs, setCs] = useState('');

  // Body weight
  const [bw, setBw] = useState('');

  const PW = safeN(pw), PR = safeN(pr), PS = safeN(ps);
  const CW = safeN(cw), CR = safeN(cr), CS = safeN(cs);
  const BW = safeN(bw);

  const hasPrev = PW > 0 && PR > 0 && PS > 0;
  const hasCurr = CW > 0 && CR > 0 && CS > 0;

  const calc = useMemo(() => {
    const prevVol = vol(PW, PR, PS);
    const currVol = vol(CW, CR, CS);
    const prevE1RM = calcE1RM(PW, PR, formula);
    const currE1RM = calcE1RM(CW, CR, formula);
    const volPct = pctChange(currVol, prevVol);
    const e1RMPct = pctChange(currE1RM, prevE1RM);

    let status: Status = 'baseline';
    if (hasCurr && hasPrev) {
      if (volPct >= progressTarget) status = 'progressed';
      else if (volPct >= progressTarget * 0.5) status = 'close';
      else if (volPct >= 0) status = 'maintained';
      else status = 'regressed';
    }

    // Next session targets (based on current session + progressTarget%)
    const targetVol = hasCurr ? currVol * (1 + progressTarget / 100) : 0;
    const inc = unit === 'kg' ? 2.5 : 5;

    const nextReps = hasCurr && CS > 0 && CW > 0 ? Math.ceil(targetVol / (CW * CS)) : 0;
    const nextWeight = hasCurr && CR > 0 && CS > 0 ? ceilTo(targetVol / (CR * CS), inc) : 0;
    const nextSets = hasCurr && CW > 0 && CR > 0 ? Math.ceil(targetVol / (CW * CR)) : 0;

    const relStr = BW > 0 && currE1RM > 0 ? currE1RM / BW : 0;
    const tier = relStr > 0 ? TIERS.find(t => relStr >= t.min) ?? TIERS[4] : null;
    const intensity = currE1RM > 0 && CW > 0 ? (CW / currE1RM) * 100 : 0;

    // Conflicting signals detection
    const volProgressed = volPct >= progressTarget;
    const strengthProgressed = e1RMPct >= 1;
    const conflicting = hasPrev && hasCurr && !volProgressed && strengthProgressed;

    return {
      prevVol, currVol, prevE1RM, currE1RM,
      volPct, e1RMPct, status,
      targetVol, nextReps, nextWeight, nextSets,
      relStr, tier, intensity,
      conflicting,
    };
  }, [PW, PR, PS, CW, CR, CS, BW, formula, progressTarget, hasPrev, hasCurr, unit]);

  const cfg = STATUS_CFG[calc.status];

  /* ── Styles ── */
  const card: React.CSSProperties = {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 18, padding: '24px 28px',
    backdropFilter: 'blur(4px)',
  };
  const sectionLabel: React.CSSProperties = {
    fontSize: 10, fontWeight: 800, color: '#5a5a5a',
    letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16,
  };

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", color: '#e8e6e0', maxWidth: 860, margin: '0 auto', padding: '0 0 3rem' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
        input[type=range] { -webkit-appearance: none; appearance: none; height: 5px; border-radius: 5px; outline: none; cursor: pointer; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 18px; height: 18px; border-radius: 50%; background: #4a9a6a; cursor: pointer; transition: transform 0.15s; }
        input[type=range]::-webkit-slider-thumb:hover { transform: scale(1.15); }
        .plo-btn-pill { display: flex; border-radius: 10px; overflow: hidden; border: 1px solid rgba(255,255,255,0.10); }
        .plo-btn-pill button { flex: 1; padding: 8px 14px; background: transparent; border: none; color: #8b8780; cursor: pointer; font-size: 13px; font-weight: 600; transition: all 0.18s; }
        .plo-btn-pill button.active { background: rgba(74,154,106,0.2); color: #4a9a6a; }
        .plo-btn-pill button:hover:not(.active) { background: rgba(255,255,255,0.05); color: #e8e6e0; }
      `}</style>

      {/* ── Hero ── */}
      <div style={{ marginBottom: 28, paddingTop: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <span style={{ fontSize: 32 }}>🏋️</span>
          <div>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#f0ede8' }}>
              Progressive Overload Calculator
            </h1>
            <p style={{ margin: '4px 0 0', fontSize: 14, color: '#8b8780' }}>
              Track Volume Load &amp; e1RM across sessions · Discover your three paths to progress
            </p>
          </div>
        </div>
      </div>

      {/* ── Unit + Exercise row ── */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div style={{ flex: 2, minWidth: 200 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: '#8b8780', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
            Exercise name (optional)
          </label>
          <input
            type="text"
            value={exerciseName}
            onChange={e => setExerciseName(e.target.value)}
            placeholder="e.g. Lat Pulldown, Squat, Bench Press…"
            style={{
              width: '100%', boxSizing: 'border-box',
              padding: '10px 14px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.10)',
              borderRadius: 10, color: '#e8e6e0', fontSize: 14,
              outline: 'none',
            }}
          />
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: '#8b8780', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
            Unit
          </label>
          <div className="plo-btn-pill" style={{ minWidth: 120 }}>
            <button className={unit === 'kg' ? 'active' : ''} onClick={() => setUnit('kg')}>kg</button>
            <button className={unit === 'lbs' ? 'active' : ''} onClick={() => setUnit('lbs')}>lbs</button>
          </div>
        </div>
      </div>

      {/* ── Session Inputs ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        {/* Last session */}
        <div style={{ ...card, opacity: hasPrev ? 1 : 0.7 }}>
          <div style={sectionLabel}>📅 Last Session</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <NumInput label={`Weight lifted (${unit})`} value={pw} onChange={setPw} unit={unit} placeholder="e.g. 50" />
            <NumInput label="Reps (per set)" value={pr} onChange={setPr} placeholder="e.g. 10" />
            <NumInput label="Sets" value={ps} onChange={setPs} placeholder="e.g. 3" />
          </div>
          {hasPrev && (
            <div style={{ marginTop: 16, padding: '10px 14px', background: 'rgba(92,122,138,0.1)', borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: '#8b8780' }}>Volume Load</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: '#5c7a8a' }}>{fd(calc.prevVol, 0)} {unit}</span>
            </div>
          )}
        </div>

        {/* This session */}
        <div style={{ ...card, border: hasCurr ? '1px solid rgba(74,154,106,0.25)' : '1px solid rgba(255,255,255,0.08)' }}>
          <div style={sectionLabel}>🏋️ This Session</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <NumInput label={`Weight lifted (${unit})`} value={cw} onChange={setCw} unit={unit} placeholder="e.g. 55" />
            <NumInput label="Reps (per set)" value={cr} onChange={setCr} placeholder="e.g. 10" />
            <NumInput label="Sets" value={cs} onChange={setCs} placeholder="e.g. 3" />
          </div>
          {hasCurr && (
            <div style={{ marginTop: 16, padding: '10px 14px', background: 'rgba(74,154,106,0.1)', borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: '#8b8780' }}>Volume Load</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: '#4a9a6a' }}>{fd(calc.currVol, 0)} {unit}</span>
            </div>
          )}
        </div>
      </div>

      {/* ── Advanced settings ── */}
      <div style={{ marginBottom: 20 }}>
        <button
          onClick={() => setShowSettings(s => !s)}
          style={{
            background: 'transparent', border: '1px solid rgba(255,255,255,0.10)',
            borderRadius: 10, padding: '8px 16px', color: '#8b8780',
            cursor: 'pointer', fontSize: 13, fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: 8,
          }}
        >
          ⚙️ Advanced settings {showSettings ? '▲' : '▼'}
        </button>
        {showSettings && (
          <div style={{ ...card, marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, flexWrap: 'wrap' }}>
            {/* Body weight */}
            <div>
              <NumInput
                label={`Body weight (${unit})`}
                value={bw} onChange={setBw} unit={unit}
                placeholder="e.g. 80"
                hint="Enables relative strength tier"
              />
            </div>
            {/* Progress target */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#8b8780', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
                Overload target: <span style={{ color: '#4a9a6a' }}>{progressTarget}%</span>
              </label>
              <input
                type="range" min={1} max={15} step={1}
                value={progressTarget}
                onChange={e => setProgressTarget(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#4a9a6a', background: 'rgba(255,255,255,0.1)' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#6b6862', marginTop: 4 }}>
                <span>1% (micro)</span><span>5% (standard)</span><span>15% (aggressive)</span>
              </div>
            </div>
            {/* 1RM formula */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#8b8780', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
                e1RM formula
              </label>
              {(['average', 'epley', 'brzycki'] as Formula[]).map(f => (
                <label key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginBottom: 8 }}>
                  <input
                    type="radio" name="formula" value={f}
                    checked={formula === f} onChange={() => setFormula(f)}
                    style={{ accentColor: '#4a9a6a' }}
                  />
                  <div>
                    <div style={{ fontSize: 13, color: '#e8e6e0', fontWeight: formula === f ? 600 : 400 }}>{FORMULA_INFO[f].name}</div>
                    <div style={{ fontSize: 11, color: '#6b6862' }}>{FORMULA_INFO[f].when}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Results ── */}
      {hasCurr && (
        <>
          {/* Status banner */}
          <div style={{
            ...card,
            background: cfg.bg, border: `1px solid ${cfg.border}`,
            marginBottom: 16,
            display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap',
          }}>
            <div style={{ fontSize: 44 }}>{cfg.emoji}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: cfg.color, letterSpacing: '0.04em' }}>{cfg.label}</div>
              {exerciseName && <div style={{ fontSize: 13, color: '#8b8780', marginTop: 2 }}>{exerciseName}</div>}
              {hasPrev && (
                <div style={{ fontSize: 14, color: '#aaa8a4', marginTop: 6 }}>
                  Volume {calc.volPct >= 0 ? 'up' : 'down'}{' '}
                  <strong style={{ color: cfg.color }}>{Math.abs(calc.volPct).toFixed(1)}%</strong>
                  {' '}vs last session
                  {calc.conflicting && (
                    <span style={{ marginLeft: 12, fontSize: 12, color: '#c4944a' }}>
                      · ⚡ Strength gained despite lower volume — likely intensity increase
                    </span>
                  )}
                </div>
              )}
            </div>
            {/* Quick stats */}
            <div style={{ display: 'flex', gap: 24 }}>
              <MetricBlock
                label="Volume Load"
                value={`${fd(calc.currVol, 0)}`}
                sub={`${unit}`}
                delta={hasPrev ? `${calc.volPct >= 0 ? '+' : ''}${fd(calc.volPct, 1)}% vs last` : undefined}
              />
              <MetricBlock
                label="Est. 1RM"
                value={`${fd(calc.currE1RM, 1)}`}
                sub={`${unit}`}
                delta={hasPrev ? `${calc.e1RMPct >= 0 ? '+' : ''}${fd(calc.e1RMPct, 1)}% vs last` : undefined}
              />
              <MetricBlock
                label="Intensity"
                value={`${fd(calc.intensity, 0)}%`}
                sub="of e1RM"
              />
            </div>
          </div>

          {/* Volume bar comparison */}
          <div style={{ ...card, marginBottom: 16 }}>
            <div style={sectionLabel}>📊 Volume Load Tracker</div>
            <VolumeBar prev={calc.prevVol} curr={calc.currVol} target={calc.targetVol} />
            <div style={{ display: 'flex', gap: 20, marginTop: 12, flexWrap: 'wrap' }}>
              {hasPrev && (
                <div style={{ fontSize: 12, color: '#6b6862' }}>
                  <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2, background: 'rgba(92,122,138,0.7)', marginRight: 6 }} />
                  Last: {fd(calc.prevVol, 0)} {unit}
                </div>
              )}
              <div style={{ fontSize: 12, color: '#6b6862' }}>
                <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2, background: 'rgba(74,154,106,0.8)', marginRight: 6 }} />
                This: {fd(calc.currVol, 0)} {unit}
              </div>
              <div style={{ fontSize: 12, color: '#6b6862' }}>
                <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2, background: 'rgba(196,148,74,0.55)', marginRight: 6 }} />
                Next target: {fd(calc.targetVol, 0)} {unit} (+{progressTarget}%)
              </div>
            </div>
          </div>

          {/* Three Paths to Overload */}
          <div style={{ ...card, marginBottom: 16 }}>
            <div style={sectionLabel}>🛤️ Three Paths to Overload Next Session</div>
            <p style={{ fontSize: 13, color: '#8b8780', marginTop: 0, marginBottom: 16 }}>
              Beat your target of <strong style={{ color: '#c4944a' }}>{fd(calc.targetVol, 0)} {unit}</strong> any way you want. Pick the path that feels right for your body today.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <PathCard
                method="Add Reps"
                icon="🔢"
                action={`${calc.nextReps} reps`}
                change={`Same ${fd(CW, 1)} ${unit} × ${CS} sets · was ${CR} reps`}
                highlight={calc.nextReps <= CR + 3}
              />
              <PathCard
                method="Add Weight"
                icon="🔼"
                action={`${fd(calc.nextWeight, 1)} ${unit}`}
                change={`Same ${CR} reps × ${CS} sets · was ${fd(CW, 1)} ${unit}`}
                highlight={false}
              />
              <PathCard
                method="Add Sets"
                icon="➕"
                action={`${calc.nextSets} sets`}
                change={`Same ${fd(CW, 1)} ${unit} × ${CR} reps · was ${CS} sets`}
                highlight={false}
              />
            </div>
            <div style={{ marginTop: 14, padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 10, fontSize: 12, color: '#8b8780' }}>
              💡 <strong style={{ color: '#e8e6e0' }}>Mix &amp; match allowed.</strong> Any combination that beats {fd(calc.targetVol, 0)} {unit} counts as progressive overload. The highlighted path is the smallest adjustment.
            </div>
          </div>

          {/* e1RM comparison (if prev exists) */}
          {hasPrev && (
            <div style={{ ...card, marginBottom: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              <div>
                <div style={sectionLabel}>⚡ Estimated 1-Rep Max</div>
                <div style={{ display: 'flex', gap: 28 }}>
                  <MetricBlock
                    label="Last session"
                    value={`${fd(calc.prevE1RM, 1)} ${unit}`}
                    sub={`${FORMULA_INFO[formula].name.split(' ')[0]}`}
                  />
                  <div style={{ fontSize: 24, color: '#4a4a4a', alignSelf: 'center' }}>→</div>
                  <MetricBlock
                    label="This session"
                    value={`${fd(calc.currE1RM, 1)} ${unit}`}
                    delta={`${calc.e1RMPct >= 0 ? '+' : ''}${fd(calc.e1RMPct, 2)}%`}
                    color={calc.e1RMPct >= 0 ? '#4a9a6a' : '#a05a5a'}
                  />
                </div>
                <div style={{ marginTop: 12, fontSize: 12, color: '#6b6862' }}>
                  e1RM is best used when you change both weight and reps between sessions — volume alone can be misleading in those cases.
                </div>
              </div>
              <div>
                <div style={sectionLabel}>🎯 Intensity Zone</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: '#e8e6e0', marginBottom: 6 }}>{fd(calc.intensity, 1)}%</div>
                <div style={{ fontSize: 12, color: '#8b8780', marginBottom: 12 }}>of your estimated 1RM</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, fontSize: 11, color: '#6b6862' }}>
                  {[
                    { zone: '90–100%', rep: '1–3 reps', focus: 'Max Strength' },
                    { zone: '75–85%',  rep: '6–10 reps', focus: 'Hypertrophy' },
                    { zone: '65–75%',  rep: '10–15 reps', focus: 'Endurance/Volume' },
                    { zone: '< 65%',   rep: '15+ reps', focus: 'Metabolic' },
                  ].map(z => (
                    <div key={z.zone} style={{
                      padding: '6px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: 8,
                      border: calc.intensity >= parseFloat(z.zone) && z.zone !== '< 65%' ? '1px solid rgba(74,154,106,0.2)' : '1px solid transparent',
                    }}>
                      <div style={{ fontWeight: 600, color: '#9b9892' }}>{z.zone}</div>
                      <div>{z.focus}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Relative strength tier */}
          {calc.tier && (
            <div style={{ ...card, marginBottom: 16 }}>
              <div style={sectionLabel}>🏅 Relative Strength</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: 11, color: '#6b6862', marginBottom: 4 }}>e1RM ÷ Body Weight</div>
                  <div style={{ fontSize: 36, fontWeight: 800, color: calc.tier.color }}>{fd(calc.relStr, 2)}×</div>
                </div>
                <div style={{
                  padding: '8px 20px', background: `${calc.tier.color}22`,
                  border: `1px solid ${calc.tier.color}44`, borderRadius: 30,
                  fontSize: 16, fontWeight: 700, color: calc.tier.color,
                }}>
                  {calc.tier.label}
                </div>
                <div style={{ fontSize: 13, color: '#8b8780', flex: 1 }}>{calc.tier.desc}</div>
              </div>
              {/* Tier progression bar */}
              <div style={{ marginTop: 16, display: 'flex', gap: 3 }}>
                {TIERS.slice().reverse().map((t, i) => (
                  <div key={t.label} style={{
                    flex: 1, height: 6, borderRadius: 4,
                    background: calc.relStr >= t.min ? t.color : 'rgba(255,255,255,0.07)',
                    transition: 'background 0.3s',
                  }} title={t.label} />
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#5a5a5a', marginTop: 4 }}>
                <span>Novice</span><span>Beginner</span><span>Intermediate</span><span>Advanced</span><span>Elite</span>
              </div>
              <div style={{ fontSize: 11, color: '#5a5a5a', marginTop: 10 }}>
                * General reference across all compound lifts. Standards vary significantly by exercise. Use as a guide, not a benchmark.
              </div>
            </div>
          )}
        </>
      )}

      {/* ── Empty state ── */}
      {!hasCurr && (
        <div style={{
          ...card,
          textAlign: 'center', padding: '40px 28px',
          border: '1px dashed rgba(255,255,255,0.10)',
          marginBottom: 16,
        }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🏋️</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: '#8b8780', marginBottom: 8 }}>
            Enter this session&apos;s data to see your results
          </div>
          <div style={{ fontSize: 13, color: '#5a5a5a' }}>
            Weight · Reps · Sets → Volume Load, e1RM, and three paths to next session
          </div>
        </div>
      )}

      {/* ── Guide ── */}
      <div style={{ ...card, marginBottom: 0 }}>
        <button
          onClick={() => setShowGuide(g => !g)}
          style={{
            width: '100%', background: 'transparent', border: 'none',
            color: '#e8e6e0', cursor: 'pointer', padding: 0,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}
        >
          <span style={{ fontSize: 15, fontWeight: 700 }}>📖 What is Progressive Overload?</span>
          <span style={{ fontSize: 13, color: '#8b8780' }}>{showGuide ? 'Hide ▲' : 'Read guide ▼'}</span>
        </button>
        {showGuide && (
          <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#c4944a', marginBottom: 8 }}>📌 What is it?</div>
              <p style={{ margin: 0, fontSize: 13, color: '#aaa8a4', lineHeight: 1.7 }}>
                Progressive overload is the foundational principle behind all strength and muscle gains. It means systematically increasing the demand placed on your body over time so your muscles continue to adapt and grow stronger. Without it, you hit a plateau — your body stops changing because it's no longer being challenged beyond what it's used to.
              </p>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#c4944a', marginBottom: 8 }}>⚙️ How to use this calculator</div>
              <ol style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: '#aaa8a4', lineHeight: 1.9 }}>
                <li>Enter your <strong style={{ color: '#e8e6e0' }}>last session</strong> data (if you have it).</li>
                <li>Enter your <strong style={{ color: '#e8e6e0' }}>current session</strong> — weight, reps, and sets.</li>
                <li>See your <strong style={{ color: '#e8e6e0' }}>Volume Load</strong> and whether you progressed.</li>
                <li>Use the <strong style={{ color: '#e8e6e0' }}>Three Paths</strong> to plan exactly what to do next session.</li>
                <li>Add your body weight to unlock the <strong style={{ color: '#e8e6e0' }}>Relative Strength</strong> tier.</li>
              </ol>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#c4944a', marginBottom: 8 }}>📐 Volume Load formula</div>
              <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: '14px 18px', fontFamily: 'monospace', fontSize: 15, color: '#4a9a6a' }}>
                Volume Load = Weight × Reps × Sets
              </div>
              <p style={{ margin: '10px 0 0', fontSize: 13, color: '#aaa8a4', lineHeight: 1.7 }}>
                Example: 50 kg × 10 reps × 3 sets = <strong style={{ color: '#e8e6e0' }}>1,500 kg</strong> of total volume. Next week, beat 1,575 kg (at +5%) any way you choose — more reps, more weight, or more sets.
              </p>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#c4944a', marginBottom: 8 }}>🧠 When to use Estimated 1RM (e1RM)</div>
              <p style={{ margin: 0, fontSize: 13, color: '#aaa8a4', lineHeight: 1.7 }}>
                If you changed <em>both</em> weight and reps between sessions — for example, you went heavier but did fewer reps — volume alone can be misleading. The e1RM tells you whether you actually got <em>stronger</em>, even if volume appears to have dropped. A rising e1RM alongside lower volume usually means you shifted to a higher-intensity training phase — both are valid paths to progress.
              </p>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#c4944a', marginBottom: 8 }}>💡 Pro tip</div>
              <div style={{ background: 'rgba(196,148,74,0.08)', border: '1px solid rgba(196,148,74,0.2)', borderRadius: 12, padding: '14px 18px', fontSize: 13, color: '#aaa8a4', lineHeight: 1.7 }}>
                Don&apos;t always chase the same path. Rotating between adding reps, weight, and sets prevents accommodation and keeps adaptation maximal. A micro-progression of just 2.5 kg every two weeks compounds to <strong style={{ color: '#e8e6e0' }}>65 kg added in a single year</strong> — small wins build empires.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
