'use client';

import { useState, useMemo } from 'react';

// ─── Color system ─────────────────────────────────────────────────────────────
const C = {
  optimal:    '#10b981',
  nearOpt:    '#84cc16',
  borderline: '#f59e0b',
  high:       '#f97316',
  veryHigh:   '#ef4444',
  text:       '#f1efe9',
  muted:      '#9b9891',
  faint:      '#6b6865',
  accent:     '#60a5fa',
  card:       'rgba(255,255,255,0.04)',
  cardBorder: 'rgba(255,255,255,0.08)',
  inputBg:    'rgba(255,255,255,0.06)',
  inputBorder:'rgba(255,255,255,0.12)',
};

type Units = 'mgdl' | 'mmol';
type Sex   = 'male' | 'female';
type RiskCtx = '100' | '70' | '55';

// ─── Risk tiers ───────────────────────────────────────────────────────────────
interface RiskTier { level:number; label:string; range:string; color:string; bg:string; border:string; advice:string; }
const RISK_TIERS: RiskTier[] = [
  { level:0, label:'Optimal',            range:'< 100 mg/dL',  color:C.optimal,    bg:'rgba(16,185,129,0.10)', border:'rgba(16,185,129,0.25)',  advice:'Excellent — your LDL is in the ideal range. A heart-healthy diet and regular activity will keep it there.' },
  { level:1, label:'Near / Above Optimal',range:'100–129 mg/dL',color:C.nearOpt,   bg:'rgba(132,204,22,0.10)', border:'rgba(132,204,22,0.25)',  advice:'Good for most people without risk factors. Continue healthy habits; annual monitoring is recommended.' },
  { level:2, label:'Borderline High',    range:'130–159 mg/dL', color:C.borderline, bg:'rgba(245,158,11,0.10)', border:'rgba(245,158,11,0.25)',  advice:'Lifestyle changes are recommended: reduce saturated fat, increase soluble fibre, exercise 150+ min/week.' },
  { level:3, label:'High',               range:'160–189 mg/dL', color:C.high,       bg:'rgba(249,115,22,0.10)', border:'rgba(249,115,22,0.25)',  advice:'Consult your doctor for a full cardiovascular risk assessment and a personalised management plan.' },
  { level:4, label:'Very High',          range:'≥ 190 mg/dL',   color:C.veryHigh,   bg:'rgba(239,68,68,0.10)',  border:'rgba(239,68,68,0.25)',   advice:'Medical evaluation is important — levels this high may indicate familial hypercholesterolaemia or other treatable conditions.' },
];
function getRiskTier(ldl: number): RiskTier {
  if (ldl < 100) return RISK_TIERS[0];
  if (ldl < 130) return RISK_TIERS[1];
  if (ldl < 160) return RISK_TIERS[2];
  if (ldl < 190) return RISK_TIERS[3];
  return RISK_TIERS[4];
}
function statusColor(v: number, lo: number, hi: number): string {
  return v < lo ? C.optimal : v < hi ? C.borderline : C.veryHigh;
}

// ─── Calculation engine ───────────────────────────────────────────────────────
function computeLipids(tc: number, hdl: number, tg: number) {
  const nonHDL     = tc - hdl;
  const vldl       = tg / 5;
  const friedewald = tc - hdl - vldl;
  const sampson    = (tc / 0.948) - (hdl / 0.971)
                   - ((tg / 8.56) + (tg * nonHDL / (2140 - tg * 0.16)))
                   - 9.44;
  const useSampson  = tg >= 150 || friedewald < 70;
  const ldlBest     = useSampson ? sampson : friedewald;
  const delta       = Math.abs(sampson - friedewald);
  const tcHdl       = hdl > 0 ? tc / hdl : 0;
  const ldlHdl      = hdl > 0 ? ldlBest / hdl : 0;
  const tgHdl       = hdl > 0 ? tg / hdl : 0;
  const nonHdlHdl   = hdl > 0 ? nonHDL / hdl : 0;
  const tg_mmol_aip = tg / 88.57;
  const hdl_mmol_aip= hdl / 38.67;
  const aip = hdl_mmol_aip > 0 && tg_mmol_aip > 0
    ? Math.log10(tg_mmol_aip / hdl_mmol_aip) : 0;
  return { tc, hdl, tg, nonHDL, vldl, friedewald, sampson, ldlBest, useSampson, delta,
           tcHdl, ldlHdl, tgHdl, nonHdlHdl, aip, friedewaldValid: tg < 400 };
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function NInput({ id, label, value, onChange, unit, hint, placeholder }: {
  id:string; label:string; value:string; onChange:(v:string)=>void;
  unit?:string; hint?:string; placeholder?:string;
}) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
      <label htmlFor={id} style={{ fontSize:11, fontWeight:700, color:C.muted, letterSpacing:'0.08em', textTransform:'uppercase' }}>
        {label}
      </label>
      <div style={{ position:'relative' }}>
        <input
          id={id} type="number" inputMode="decimal"
          value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder ?? '0'} min={0}
          style={{
            width:'100%', boxSizing:'border-box',
            padding: unit ? '11px 60px 11px 14px' : '11px 14px',
            background:C.inputBg, border:`1px solid ${C.inputBorder}`,
            borderRadius:10, color:C.text, fontSize:15, fontWeight:500,
            outline:'none', fontFamily:'inherit', transition:'border 0.2s, box-shadow 0.2s',
          }}
          onFocus={e => { e.target.style.borderColor='rgba(96,165,250,0.45)'; e.target.style.boxShadow='0 0 0 3px rgba(96,165,250,0.08)'; }}
          onBlur={e  => { e.target.style.borderColor=C.inputBorder; e.target.style.boxShadow='none'; }}
        />
        {unit && (
          <span style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)',
            fontSize:11, color:C.muted, fontWeight:700, pointerEvents:'none' }}>{unit}</span>
        )}
      </div>
      {hint && <span style={{ fontSize:11, color:C.faint }}>{hint}</span>}
    </div>
  );
}

function LDLGauge({ ldl, target }: { ldl:number; target:number }) {
  const SCALE = 260;
  const pct   = (v:number) => `${Math.min(Math.max(v / SCALE, 0), 1) * 100}%`;
  const zones = [
    { w:100/SCALE*100, color:C.optimal,    label:'Optimal' },
    { w:30/SCALE*100,  color:C.nearOpt,    label:'Near Opt.' },
    { w:30/SCALE*100,  color:C.borderline, label:'Borderline' },
    { w:30/SCALE*100,  color:C.high,       label:'High' },
    { w:(SCALE-190)/SCALE*100, color:C.veryHigh, label:'Very High' },
  ];
  const labelTier = getRiskTier(ldl);

  return (
    <div style={{ width:'100%' }}>
      {/* Zone name labels */}
      <div style={{ display:'flex', marginBottom:4 }}>
        {zones.map(z => (
          <div key={z.label} style={{ width:`${z.w}%`, overflow:'hidden', paddingRight:2 }}>
            <span style={{ fontSize:9, color:z.color, fontWeight:700, letterSpacing:'0.05em', textTransform:'uppercase', whiteSpace:'nowrap' }}>
              {z.label}
            </span>
          </div>
        ))}
      </div>

      {/* Colored bar */}
      <div style={{ position:'relative', height:18, borderRadius:9, overflow:'visible', display:'flex', marginBottom:6 }}>
        <div style={{ display:'flex', width:'100%', borderRadius:9, overflow:'hidden' }}>
          {zones.map((z, i) => (
            <div key={i} style={{ width:`${z.w}%`, background:z.color, opacity:0.22, height:'100%', flexShrink:0 }} />
          ))}
        </div>

        {/* LDL pointer */}
        {ldl > 0 && (
          <div style={{
            position:'absolute', left:pct(Math.min(ldl, SCALE - 2)),
            top:-3, bottom:-3, width:4, borderRadius:2,
            background:'white', transform:'translateX(-50%)',
            boxShadow:'0 0 8px rgba(255,255,255,0.9)', zIndex:2,
          }}>
            {/* Tooltip bubble */}
            <div style={{
              position:'absolute', bottom:'calc(100% + 6px)', left:'50%', transform:'translateX(-50%)',
              background:labelTier.color, color:'white', padding:'3px 8px', borderRadius:6,
              fontSize:11, fontWeight:700, whiteSpace:'nowrap',
              boxShadow:`0 2px 8px ${labelTier.color}66`,
            }}>
              {ldl.toFixed(1)} mg/dL
            </div>
          </div>
        )}

        {/* Target dashed marker */}
        {target > 0 && (
          <div style={{
            position:'absolute', left:pct(target),
            top:-4, bottom:-4, width:2,
            borderLeft:'2px dashed rgba(255,255,255,0.45)',
            transform:'translateX(-50%)', zIndex:1,
          }} />
        )}
      </div>

      {/* Scale labels */}
      <div style={{ display:'flex', justifyContent:'space-between', fontSize:10, color:C.faint }}>
        {[0, 100, 130, 160, 190, 260].map(v => (
          <span key={v}>{v === 260 ? '260+' : v}</span>
        ))}
      </div>

      {/* Legend */}
      <div style={{ display:'flex', gap:14, marginTop:8, flexWrap:'wrap' }}>
        <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:10, color:C.muted }}>
          <div style={{ width:3, height:14, background:'white', borderRadius:2, boxShadow:'0 0 5px rgba(255,255,255,0.8)' }} />
          Your LDL {ldl > SCALE ? `(>${SCALE})` : ''}
        </div>
        {target > 0 && (
          <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:10, color:C.muted }}>
            <div style={{ width:12, height:2, borderTop:'2px dashed rgba(255,255,255,0.45)' }} />
            Target ({`< ${target}`} mg/dL)
          </div>
        )}
      </div>
    </div>
  );
}

function RatioBar({ label, sub, value, max, lo, hi }: {
  label:string; sub?:string; value:number; max:number; lo:number; hi:number;
}) {
  const color   = statusColor(value, lo, hi);
  const fillPct = Math.min((value / max) * 100, 100);
  const loPct   = (lo / max) * 100;
  const hiPct   = (hi / max) * 100;
  const statusLabel = value < lo ? 'Optimal' : value < hi ? 'Monitor' : 'High Risk';

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:7 }}>
        <div>
          <div style={{ fontSize:12, fontWeight:700, color:C.muted }}>{label}</div>
          {sub && <div style={{ fontSize:10, color:C.faint }}>{sub}</div>}
        </div>
        <div style={{ textAlign:'right' }}>
          <div style={{ fontSize:20, fontWeight:700, color }}>{value.toFixed(2)}</div>
          <div style={{ fontSize:10, fontWeight:700, color, letterSpacing:'0.05em' }}>{statusLabel}</div>
        </div>
      </div>
      <div style={{ position:'relative', height:8, borderRadius:4, background:'rgba(255,255,255,0.07)' }}>
        <div style={{ width:`${fillPct}%`, height:'100%', borderRadius:4,
          background:`linear-gradient(90deg, ${C.optimal}, ${color})`,
          transition:'width 0.4s cubic-bezier(0.4,0,0.2,1)' }} />
        <div style={{ position:'absolute', left:`${loPct}%`, top:0, bottom:0, width:1, background:'rgba(255,255,255,0.20)' }} />
        <div style={{ position:'absolute', left:`${hiPct}%`, top:0, bottom:0, width:1, background:'rgba(255,255,255,0.20)' }} />
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function LDLCalculatorEnhanced() {
  const [units,    setUnits]    = useState<Units>('mgdl');
  const [sex,      setSex]      = useState<Sex>('male');
  const [riskCtx,  setRiskCtx]  = useState<RiskCtx>('100');
  const [tcStr,    setTcStr]    = useState('');
  const [hdlStr,   setHdlStr]   = useState('');
  const [tgStr,    setTgStr]    = useState('');
  const [showFormulas, setShowFormulas] = useState(false);
  const [showGuide,    setShowGuide]    = useState(false);
  const [activeGuide,  setActiveGuide]  = useState<string|null>(null);

  const parsed = useMemo(() => {
    const tc  = parseFloat(tcStr);
    const hdl = parseFloat(hdlStr);
    const tg  = parseFloat(tgStr);
    if (!isFinite(tc) || !isFinite(hdl) || !isFinite(tg)) return null;
    if (tc <= 0 || hdl <= 0 || tg <= 0) return null;
    const fc = units === 'mmol' ? 38.67 : 1;
    const ft = units === 'mmol' ? 88.57 : 1;
    return computeLipids(tc * fc, hdl * fc, tg * ft);
  }, [tcStr, hdlStr, tgStr, units]);

  const target    = Number(riskCtx);
  const tier      = parsed ? getRiskTier(parsed.ldlBest) : null;
  const targetMet = parsed ? parsed.ldlBest < target : false;

  const fmt  = (v:number, dp=1) => v.toFixed(dp);
  const disp = (mgdl:number, dp=1) => units === 'mmol' ? (mgdl/38.67).toFixed(dp+1) : mgdl.toFixed(dp);
  const dispTg = (mgdl:number) => units === 'mmol' ? (mgdl/88.57).toFixed(2) : mgdl.toFixed(1);
  const ul   = units === 'mmol' ? 'mmol/L' : 'mg/dL';
  const uSfx = units === 'mmol' ? ' mmol/L' : ' mg/dL';

  const hdlStatus = useMemo(() => {
    if (!parsed) return null;
    const h = parsed.hdl;
    const lowThresh = sex === 'male' ? 40 : 50;
    if (h < lowThresh) return { label:'Low — Cardiovascular Risk Factor', color:C.veryHigh };
    if (h < 60)        return { label:'Acceptable', color:C.borderline };
    return               { label:'Protective — Cardioprotective', color:C.optimal };
  }, [parsed, sex]);

  const tgStatus = useMemo(() => {
    if (!parsed) return null;
    if (parsed.tg < 150) return { label:'Normal', color:C.optimal };
    if (parsed.tg < 200) return { label:'Mildly Elevated', color:C.nearOpt };
    if (parsed.tg < 500) return { label:'High', color:C.high };
    return                  { label:'Very High', color:C.veryHigh };
  }, [parsed]);

  const aipStatus = useMemo(() => {
    if (!parsed) return null;
    if (parsed.aip < 0.10) return { label:'Low Risk',       color:C.optimal };
    if (parsed.aip < 0.24) return { label:'Moderate Risk',  color:C.borderline };
    if (parsed.aip < 0.33) return { label:'High Risk',      color:C.high };
    return                    { label:'Very High Risk',  color:C.veryHigh };
  }, [parsed]);

  const CARD: React.CSSProperties = {
    background:C.card, border:`1px solid ${C.cardBorder}`,
    borderRadius:18, padding:'22px 24px',
  };
  const SL: React.CSSProperties = {
    fontSize:10, fontWeight:800, color:C.faint,
    letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:14,
  };

  const LIFESTYLE = [
    { label:'Reduce saturated fat (< 7% of calories)', pct:0.09, range:'−8 to −10%' },
    { label:'Soluble fibre 10–25 g/day',               pct:0.06, range:'−5 to −7%' },
    { label:'Plant sterols/stanols 2 g/day',            pct:0.09, range:'−8 to −10%' },
    { label:'Exercise 150+ min/week',                   pct:0.05, range:'−3 to −6%' },
    { label:'Eliminate trans fats completely',          pct:0.07, range:'−5 to −8%' },
    { label:'Lose 10 lb (4.5 kg)',                      pct:0.07, range:'−5 to −8%' },
  ];

  const GUIDE_SECTIONS = [
    {
      key:'what',
      title:'🩸 What is LDL Cholesterol?',
      body:`LDL (Low-Density Lipoprotein) is often called "bad cholesterol" because it deposits cholesterol into artery walls, progressively building plaques that narrow and harden vessels — a process called atherosclerosis. This is the primary driver behind heart attacks and stroke globally. LDL is the main target of cholesterol-lowering therapy in every major cardiology guideline worldwide.`,
    },
    {
      key:'formulas',
      title:'⚖️ Why Two Formulas?',
      body:`The Friedewald equation (1972) is the global clinical standard. It uses a fixed conversion factor (TG ÷ 5) to estimate VLDL, which works well when triglycerides are below 150 mg/dL. However, it systematically underestimates LDL when TG is elevated or when LDL is very low — exactly the range targeted by modern statin therapy. The Sampson 2020 equation (NIH / JAMA Cardiology) uses a variable factor derived from a large validation dataset, giving 22% better accuracy overall. This calculator automatically applies the most accurate formula for your specific values.`,
    },
    {
      key:'nonhdl',
      title:'📌 Non-HDL Cholesterol — Why It Matters',
      body:`Non-HDL cholesterol (TC − HDL) captures every atherogenic lipoprotein: LDL, VLDL, IDL, and Lp(a). Multiple large prospective studies have consistently shown Non-HDL is a stronger predictor of cardiovascular events than LDL alone. The AHA 2018 guidelines now recommend Non-HDL as a co-primary treatment target. Your Non-HDL target is always your LDL target plus 30 mg/dL (because VLDL averages ~30 mg/dL).`,
    },
    {
      key:'aip',
      title:'🔬 Atherogenic Index of Plasma (AIP)',
      body:`AIP = log₁₀(TG mmol/L ÷ HDL mmol/L). This single number captures the balance between atherogenic and anti-atherogenic lipoproteins better than any individual ratio. It reflects the proportion of small, dense LDL particles (sdLDL) — which are far more dangerous than large, buoyant LDL — and is closely linked to metabolic syndrome, insulin resistance, and visceral fat. AIP below 0.10 represents low risk; above 0.24 is high risk; above 0.33 is very high risk.`,
    },
    {
      key:'tghdl',
      title:'💉 TG/HDL — The Insulin Resistance Signal',
      body:`A TG/HDL ratio above 3.5 (in mg/dL values) is one of the best non-invasive markers of insulin resistance and elevated small dense LDL. This pattern — high TG, low HDL — typically responds dramatically to dietary change: reducing refined carbohydrates, sugar, and alcohol often drops triglycerides by 30–50% within weeks, improving both the TG/HDL ratio and LDL simultaneously. If your TG/HDL ratio is elevated, diet is almost certainly a more powerful intervention than medication alone.`,
    },
  ];

  return (
    <div style={{ fontFamily:"'Inter',-apple-system,BlinkMacSystemFont,sans-serif", color:C.text, maxWidth:900, margin:'0 auto', padding:'0 0 3rem' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance:none; margin:0; }
        input[type=number] { -moz-appearance:textfield; }
        .ldl-pill { display:flex; border-radius:10px; overflow:hidden; border:1px solid rgba(255,255,255,0.10); }
        .ldl-pill button { flex:1; padding:9px 14px; background:transparent; border:none; color:#9b9891; cursor:pointer; font-size:13px; font-weight:600; transition:all 0.18s; font-family:inherit; white-space:nowrap; }
        .ldl-pill button.lp-active { background:rgba(96,165,250,0.15); color:#60a5fa; }
        .ldl-pill button:hover:not(.lp-active) { background:rgba(255,255,255,0.06); color:#f1efe9; }
        .ldl-risk-bar { display:flex; border-radius:12px; overflow:hidden; border:1px solid rgba(255,255,255,0.10); }
        .ldl-risk-bar button { flex:1; padding:10px 12px; background:transparent; border:none; color:#9b9891; cursor:pointer; font-size:11px; font-weight:600; transition:all 0.18s; font-family:inherit; text-align:left; line-height:1.4; }
        .ldl-risk-bar button.lr-active { background:rgba(96,165,250,0.12); color:#60a5fa; border-bottom:2px solid #60a5fa; }
        .ldl-risk-bar button:hover:not(.lr-active) { background:rgba(255,255,255,0.05); color:#f1efe9; }
        .ldl-guide-btn { width:100%; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:10px; padding:12px 16px; cursor:pointer; display:flex; justify-content:space-between; align-items:center; font-family:inherit; color:#f1efe9; transition:background 0.18s; margin-bottom:4px; }
        .ldl-guide-btn:hover { background:rgba(255,255,255,0.06); }
        .ldl-guide-body { padding:14px 18px; background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.07); border-top:none; border-bottom-left-radius:10px; border-bottom-right-radius:10px; margin-bottom:4px; }
        @keyframes ldl-in { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        .ldl-in { animation:ldl-in 0.3s ease both; }
      `}</style>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <div style={{ marginBottom:28, paddingTop:8 }}>
        <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:10 }}>
          <div style={{
            width:54, height:54, borderRadius:14,
            background:'rgba(239,68,68,0.15)', border:'1px solid rgba(239,68,68,0.28)',
            display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, flexShrink:0,
          }}>🩸</div>
          <div>
            <h1 style={{ margin:0, fontSize:24, fontWeight:800, color:C.text, lineHeight:1.2 }}>
              LDL Cholesterol Calculator
            </h1>
            <p style={{ margin:'4px 0 0', fontSize:13, color:C.muted }}>
              Dual-formula engine · Full lipid panel · Atherogenic ratio suite · Personalised targets &amp; action plan
            </p>
          </div>
        </div>
      </div>

      {/* ── Inputs ───────────────────────────────────────────────────── */}
      <div style={{ ...CARD, marginBottom:16 }}>
        {/* Unit + Sex toggles */}
        <div style={{ display:'flex', gap:16, marginBottom:20, flexWrap:'wrap', alignItems:'flex-end' }}>
          <div>
            <div style={{ ...SL, marginBottom:8 }}>Unit System</div>
            <div className="ldl-pill">
              <button className={units==='mgdl'?'lp-active':''} onClick={()=>setUnits('mgdl')}>mg/dL &nbsp;(US)</button>
              <button className={units==='mmol'?'lp-active':''} onClick={()=>setUnits('mmol')}>mmol/L &nbsp;(International)</button>
            </div>
          </div>
          <div>
            <div style={{ ...SL, marginBottom:8 }}>Biological Sex</div>
            <div className="ldl-pill">
              <button className={sex==='male'?'lp-active':''} onClick={()=>setSex('male')}>Male</button>
              <button className={sex==='female'?'lp-active':''} onClick={()=>setSex('female')}>Female</button>
            </div>
          </div>
        </div>

        {/* Three lipid inputs */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:20 }}>
          <NInput id="tc"  label="Total Cholesterol"          value={tcStr}  onChange={setTcStr}
            unit={uSfx.trim()} placeholder={units==='mmol'?'e.g. 5.43':'e.g. 210'}
            hint={units==='mmol'?'Normal: < 5.2 mmol/L':'Normal: < 200 mg/dL'} />
          <NInput id="hdl" label='HDL — "Good" Cholesterol'   value={hdlStr} onChange={setHdlStr}
            unit={uSfx.trim()} placeholder={units==='mmol'?'e.g. 1.42':'e.g. 55'}
            hint={sex==='male'?'Protective: ≥ 60 mg/dL · Low: < 40':'Protective: ≥ 60 mg/dL · Low: < 50'} />
          <NInput id="tg"  label="Triglycerides (fasting)"    value={tgStr}  onChange={setTgStr}
            unit={uSfx.trim()} placeholder={units==='mmol'?'e.g. 1.47':'e.g. 130'}
            hint="9–12 hour fast for best accuracy" />
        </div>

        {/* Risk context */}
        <div>
          <div style={{ ...SL, marginBottom:8 }}>Your Clinical Risk Category &amp; LDL Target</div>
          <div className="ldl-risk-bar">
            <button className={riskCtx==='100'?'lr-active':''} onClick={()=>setRiskCtx('100')}>
              🟢 Low / Moderate Risk<br/>Target LDL &lt; 100 mg/dL · No CVD or Diabetes
            </button>
            <button className={riskCtx==='70'?'lr-active':''} onClick={()=>setRiskCtx('70')}>
              🟡 High Risk<br/>Target LDL &lt; 70 mg/dL · Diabetes or multiple risk factors
            </button>
            <button className={riskCtx==='55'?'lr-active':''} onClick={()=>setRiskCtx('55')}>
              🔴 Very High Risk<br/>Target LDL &lt; 55 mg/dL · Established CVD
            </button>
          </div>
        </div>
      </div>

      {/* ── Empty state ───────────────────────────────────────────────── */}
      {!parsed && (
        <div className="ldl-in" style={{
          ...CARD, border:'1px dashed rgba(255,255,255,0.10)',
          textAlign:'center', padding:'52px 28px', marginBottom:16,
        }}>
          <div style={{ fontSize:52, marginBottom:14 }}>🩸</div>
          <div style={{ fontSize:16, fontWeight:600, color:C.muted, marginBottom:8 }}>
            Enter your fasting lipid panel values above
          </div>
          <div style={{ fontSize:13, color:C.faint }}>
            Total Cholesterol · HDL · Triglycerides → instant LDL, atherogenic ratios, risk profile &amp; action plan
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          RESULTS
      ════════════════════════════════════════════════════════════════ */}
      {parsed && tier && (
        <>
          {/* ─ 1. LDL Hero Card ─────────────────────────────────────── */}
          <div className="ldl-in" style={{
            ...CARD, background:tier.bg, border:`1px solid ${tier.border}`, marginBottom:16,
          }}>
            {/* Value + badge row */}
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:24, flexWrap:'wrap', gap:16 }}>
              <div>
                <div style={{ fontSize:11, fontWeight:700, color:C.muted, letterSpacing:'0.10em', textTransform:'uppercase', marginBottom:4 }}>
                  LDL Cholesterol — Best Estimate
                </div>
                <div style={{ display:'flex', alignItems:'baseline', gap:10, flexWrap:'wrap' }}>
                  <span style={{ fontSize:58, fontWeight:800, color:tier.color, lineHeight:1 }}>
                    {disp(parsed.ldlBest)}
                  </span>
                  <span style={{ fontSize:18, color:C.muted, fontWeight:600 }}>{ul}</span>
                  {units==='mmol' && (
                    <span style={{ fontSize:13, color:C.faint }}>({fmt(parsed.ldlBest)} mg/dL)</span>
                  )}
                </div>
              </div>
              <div style={{
                display:'inline-flex', alignItems:'center', gap:8, padding:'10px 18px',
                background:`${tier.color}22`, border:`1px solid ${tier.color}55`, borderRadius:30,
              }}>
                <div style={{ width:10, height:10, borderRadius:'50%', background:tier.color }} />
                <span style={{ fontSize:14, fontWeight:700, color:tier.color }}>{tier.label}</span>
                <span style={{ fontSize:12, color:C.muted }}>{tier.range}</span>
              </div>
            </div>

            {/* Gauge */}
            <LDLGauge ldl={parsed.ldlBest} target={target} />

            {/* Clinical note */}
            <div style={{
              marginTop:16, padding:'12px 16px',
              background:'rgba(0,0,0,0.18)', borderRadius:10,
              fontSize:13, color:C.muted, lineHeight:1.6,
            }}>
              <strong style={{ color:C.text }}>What this means: </strong>{tier.advice}
            </div>

            {/* Formula badges */}
            <div style={{ marginTop:14, display:'flex', gap:8, flexWrap:'wrap' }}>
              <span style={{
                padding:'4px 10px', borderRadius:6, fontSize:11, fontWeight:700,
                background:parsed.useSampson?'rgba(96,165,250,0.15)':'rgba(255,255,255,0.07)',
                border:`1px solid ${parsed.useSampson?'rgba(96,165,250,0.3)':'rgba(255,255,255,0.12)'}`,
                color:parsed.useSampson?C.accent:C.muted,
              }}>
                {parsed.useSampson ? '✦ Sampson 2020 applied' : '✦ Friedewald applied'}
              </span>
              <span style={{
                padding:'4px 10px', borderRadius:6, fontSize:11, fontWeight:600,
                background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)', color:C.muted,
              }}>
                {parsed.useSampson
                  ? (parsed.tg >= 150 ? 'TG ≥ 150 mg/dL — Sampson more accurate' : 'LDL < 70 mg/dL — Sampson more accurate')
                  : 'TG < 150 · LDL ≥ 70 — Friedewald reliable'}
              </span>
              {!parsed.friedewaldValid && (
                <span style={{
                  padding:'4px 10px', borderRadius:6, fontSize:11, fontWeight:700,
                  background:'rgba(239,68,68,0.15)', border:'1px solid rgba(239,68,68,0.35)', color:C.veryHigh,
                }}>
                  ⚠ TG ≥ 400 mg/dL — Friedewald invalid
                </span>
              )}
            </div>
          </div>

          {/* ─ 2. Formula Comparison (toggleable) ───────────────────── */}
          <div style={{ ...CARD, marginBottom:16 }}>
            <button
              onClick={()=>setShowFormulas(f=>!f)}
              style={{ width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center',
                background:'transparent', border:'none', cursor:'pointer', padding:0, fontFamily:'inherit' }}
            >
              <div style={{ ...SL, marginBottom:0 }}>⚖️ Formula Comparison — Friedewald vs Sampson 2020</div>
              <span style={{ fontSize:12, color:C.muted }}>{showFormulas?'Hide ▲':'Show ▼'}</span>
            </button>

            {showFormulas && (
              <div style={{ marginTop:18, display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                {/* Friedewald */}
                <div style={{
                  padding:'18px 20px', borderRadius:14,
                  background: !parsed.useSampson ? 'rgba(16,185,129,0.07)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${!parsed.useSampson ? 'rgba(16,185,129,0.25)' : 'rgba(255,255,255,0.08)'}`,
                }}>
                  <div style={{ fontSize:10, fontWeight:800, color:C.muted, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:10 }}>
                    Friedewald (1972) {!parsed.useSampson && <span style={{ color:C.optimal }}> ◀ Active</span>}
                    {!parsed.friedewaldValid && <span style={{ color:C.veryHigh }}> ⚠ Invalid</span>}
                  </div>
                  <div style={{ fontSize:36, fontWeight:800, color:!parsed.useSampson?C.optimal:C.muted, marginBottom:10 }}>
                    {fmt(parsed.friedewald)} <span style={{ fontSize:14 }}>mg/dL</span>
                  </div>
                  <div style={{ fontFamily:'monospace', fontSize:12, color:C.faint, lineHeight:1.7 }}>
                    TC − HDL − (TG ÷ 5)<br/>
                    {fmt(parsed.tc,0)} − {fmt(parsed.hdl,0)} − {fmt(parsed.vldl)} = {fmt(parsed.friedewald)}
                  </div>
                  <div style={{ marginTop:8, fontSize:11, color:C.faint }}>
                    Valid when TG &lt; 400 mg/dL &nbsp;·&nbsp; {parsed.friedewaldValid?'✓ Valid':'✗ Out of range'}
                  </div>
                </div>

                {/* Sampson */}
                <div style={{
                  padding:'18px 20px', borderRadius:14,
                  background: parsed.useSampson ? 'rgba(16,185,129,0.07)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${parsed.useSampson ? 'rgba(16,185,129,0.25)' : 'rgba(255,255,255,0.08)'}`,
                }}>
                  <div style={{ fontSize:10, fontWeight:800, color:C.muted, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:10 }}>
                    Sampson 2020 — NIH {parsed.useSampson && <span style={{ color:C.optimal }}> ◀ Active</span>}
                  </div>
                  <div style={{ fontSize:36, fontWeight:800, color:parsed.useSampson?C.optimal:C.muted, marginBottom:10 }}>
                    {fmt(parsed.sampson)} <span style={{ fontSize:14 }}>mg/dL</span>
                  </div>
                  <div style={{ fontSize:12, color:C.faint, lineHeight:1.7 }}>
                    Variable TG/VLDL factor — more accurate at elevated TG or very low LDL.
                  </div>
                  <div style={{ marginTop:8, fontSize:11, color:C.faint }}>
                    JAMA Cardiology 2020 &nbsp;·&nbsp; Valid: TG 25–800 mg/dL
                  </div>
                </div>

                {/* Agreement */}
                <div style={{
                  gridColumn:'1 / -1', padding:'12px 16px',
                  background:'rgba(255,255,255,0.03)', borderRadius:10,
                  display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:10,
                }}>
                  <span style={{ fontSize:12, color:C.muted }}>Formula agreement</span>
                  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <div style={{ width:120, height:5, borderRadius:3, background:'rgba(255,255,255,0.10)', overflow:'hidden' }}>
                      <div style={{
                        height:'100%', transition:'width 0.4s',
                        width:`${Math.max(0, 100 - (parsed.delta / 20) * 100)}%`,
                        background: parsed.delta < 5 ? C.optimal : parsed.delta < 15 ? C.borderline : C.veryHigh,
                      }} />
                    </div>
                    <span style={{ fontSize:14, fontWeight:700, color:parsed.delta<5?C.optimal:parsed.delta<15?C.borderline:C.veryHigh }}>
                      Δ {fmt(parsed.delta)} mg/dL
                    </span>
                    <span style={{ fontSize:11, color:C.faint }}>
                      {parsed.delta < 5 ? 'Excellent agreement' : parsed.delta < 15 ? 'Good agreement' : 'Notable difference — Sampson preferred'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ─ 3. Full Lipid Panel ───────────────────────────────────── */}
          <div style={{ ...CARD, marginBottom:16 }}>
            <div style={SL}>🧪 Full Lipid Panel</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:16 }}>

              {/* Non-HDL */}
              <div style={{ padding:'16px 18px', borderRadius:12, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
                  <div>
                    <div style={{ fontSize:12, fontWeight:700, color:C.muted }}>Non-HDL Cholesterol</div>
                    <div style={{ fontSize:10, color:C.faint }}>TC − HDL · target &lt; 130 mg/dL</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontSize:24, fontWeight:800, color:statusColor(parsed.nonHDL,130,160) }}>{disp(parsed.nonHDL)}</div>
                    <div style={{ fontSize:10, color:C.faint }}>{ul}</div>
                  </div>
                </div>
                <div style={{ height:6, borderRadius:3, background:'rgba(255,255,255,0.07)', overflow:'hidden' }}>
                  <div style={{ height:'100%', borderRadius:3, transition:'width 0.4s',
                    width:`${Math.min(parsed.nonHDL/200*100,100)}%`,
                    background:statusColor(parsed.nonHDL,130,160) }} />
                </div>
                <div style={{ marginTop:6, fontSize:10, color:statusColor(parsed.nonHDL,130,160), fontWeight:700 }}>
                  {parsed.nonHDL<130?'Optimal':parsed.nonHDL<160?'Above Target':'High'}
                </div>
              </div>

              {/* VLDL */}
              <div style={{ padding:'16px 18px', borderRadius:12, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
                  <div>
                    <div style={{ fontSize:12, fontWeight:700, color:C.muted }}>VLDL Cholesterol</div>
                    <div style={{ fontSize:10, color:C.faint }}>TG ÷ 5 · normal: 5–30 mg/dL</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontSize:24, fontWeight:800, color:statusColor(parsed.vldl,30,40) }}>{disp(parsed.vldl)}</div>
                    <div style={{ fontSize:10, color:C.faint }}>{ul}</div>
                  </div>
                </div>
                <div style={{ height:6, borderRadius:3, background:'rgba(255,255,255,0.07)', overflow:'hidden' }}>
                  <div style={{ height:'100%', borderRadius:3, transition:'width 0.4s',
                    width:`${Math.min(parsed.vldl/80*100,100)}%`,
                    background:statusColor(parsed.vldl,30,40) }} />
                </div>
                <div style={{ marginTop:6, fontSize:10, color:statusColor(parsed.vldl,30,40), fontWeight:700 }}>
                  {parsed.vldl<30?'Normal':parsed.vldl<40?'Borderline':'Elevated'}
                </div>
              </div>

              {/* HDL */}
              {hdlStatus && (
                <div style={{ padding:'16px 18px', borderRadius:12,
                  background:`${hdlStatus.color}11`, border:`1px solid ${hdlStatus.color}30` }}>
                  <div style={{ fontSize:10, fontWeight:800, color:C.muted, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:8 }}>HDL — Good Cholesterol</div>
                  <div style={{ display:'flex', alignItems:'baseline', gap:8, marginBottom:4 }}>
                    <span style={{ fontSize:28, fontWeight:800, color:hdlStatus.color }}>{disp(parsed.hdl)}</span>
                    <span style={{ fontSize:12, color:C.faint }}>{ul}</span>
                  </div>
                  <div style={{ fontSize:12, fontWeight:700, color:hdlStatus.color }}>{hdlStatus.label}</div>
                  <div style={{ fontSize:10, color:C.faint, marginTop:3 }}>
                    {sex==='male'?'Low < 40 · Protective ≥ 60 (male)':'Low < 50 · Protective ≥ 60 (female)'}
                  </div>
                </div>
              )}

              {/* TG */}
              {tgStatus && (
                <div style={{ padding:'16px 18px', borderRadius:12,
                  background:`${tgStatus.color}11`, border:`1px solid ${tgStatus.color}30` }}>
                  <div style={{ fontSize:10, fontWeight:800, color:C.muted, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:8 }}>Triglycerides</div>
                  <div style={{ display:'flex', alignItems:'baseline', gap:8, marginBottom:4 }}>
                    <span style={{ fontSize:28, fontWeight:800, color:tgStatus.color }}>{dispTg(parsed.tg)}</span>
                    <span style={{ fontSize:12, color:C.faint }}>{ul}</span>
                  </div>
                  <div style={{ fontSize:12, fontWeight:700, color:tgStatus.color }}>{tgStatus.label}</div>
                  <div style={{ fontSize:10, color:C.faint, marginTop:3 }}>
                    Normal &lt; 150 · High 200–499 · Very High ≥ 500 mg/dL
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ─ 4. Atherogenic Ratios ─────────────────────────────────── */}
          <div style={{ ...CARD, marginBottom:16 }}>
            <div style={SL}>📊 Atherogenic Risk Ratios</div>
            <div style={{ display:'flex', flexDirection:'column', gap:20, marginBottom:20 }}>
              <RatioBar label="TC / HDL"        sub="Castelli Index I — overall atherogenic burden"  value={parsed.tcHdl}      max={8}  lo={3.5} hi={5.0} />
              <RatioBar label="LDL / HDL"       sub="Castelli Index II — atherogenic vs protective"   value={parsed.ldlHdl}     max={6}  lo={2.5} hi={3.5} />
              <RatioBar label="TG / HDL"        sub="Insulin resistance &amp; small dense LDL proxy"  value={parsed.tgHdl}      max={8}  lo={2.0} hi={3.5} />
              <RatioBar label="Non-HDL / HDL"   sub="All atherogenic vs protective lipoproteins"      value={parsed.nonHdlHdl}  max={6}  lo={3.0} hi={4.0} />

              {/* AIP — custom display */}
              {aipStatus && (
                <div>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:7 }}>
                    <div>
                      <div style={{ fontSize:12, fontWeight:700, color:C.muted }}>Atherogenic Index of Plasma (AIP)</div>
                      <div style={{ fontSize:10, color:C.faint }}>log₁₀(TG mmol/L ÷ HDL mmol/L) — metabolic syndrome marker</div>
                    </div>
                    <div style={{ textAlign:'right' }}>
                      <div style={{ fontSize:20, fontWeight:700, color:aipStatus.color }}>{parsed.aip.toFixed(3)}</div>
                      <div style={{ fontSize:10, fontWeight:700, color:aipStatus.color, letterSpacing:'0.05em' }}>{aipStatus.label}</div>
                    </div>
                  </div>
                  {/* AIP zone bar: scale −0.3 to 0.7 */}
                  <div style={{ position:'relative', height:8, borderRadius:4, overflow:'hidden', display:'flex' }}>
                    {([C.optimal, C.nearOpt, C.borderline, C.high, C.veryHigh] as const).map((col,i) => (
                      <div key={i} style={{ flex:i<3?33:i===3?15:22, background:col, opacity:0.3 }} />
                    ))}
                    <div style={{
                      position:'absolute',
                      left:`${Math.min(Math.max(((parsed.aip + 0.3) / 1.0) * 100, 1), 99)}%`,
                      top:0, bottom:0, width:3, borderRadius:1,
                      background:'white', transform:'translateX(-50%)',
                      boxShadow:'0 0 5px rgba(255,255,255,0.8)',
                    }} />
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:9, color:C.faint, marginTop:3 }}>
                    {['−0.3', '0.10', '0.24', '0.33', '0.70'].map(v => <span key={v}>{v}</span>)}
                  </div>
                </div>
              )}
            </div>

            {/* Reference table */}
            <div style={{ padding:'14px 16px', background:'rgba(255,255,255,0.03)', borderRadius:10 }}>
              <div style={{ ...SL, marginBottom:10 }}>Quick Reference</div>
              <div style={{ display:'grid', gridTemplateColumns:'auto 1fr 1fr 1fr', gap:'5px 14px', fontSize:11 }}>
                <div style={{ color:C.faint, fontWeight:700 }}>Ratio</div>
                <div style={{ color:C.optimal }}>Optimal</div>
                <div style={{ color:C.borderline }}>Monitor</div>
                <div style={{ color:C.veryHigh }}>High Risk</div>
                {[
                  ['TC/HDL',       '< 3.5',  '3.5–5.0', '≥ 5.0'],
                  ['LDL/HDL',      '< 2.5',  '2.5–3.5', '> 3.5'],
                  ['TG/HDL',       '< 2.0',  '2.0–3.5', '> 3.5'],
                  ['Non-HDL/HDL',  '< 3.0',  '3.0–4.0', '> 4.0'],
                  ['AIP',          '< 0.10', '0.10–0.24','> 0.24'],
                ].map(([lbl, a, b, c]) => (
                  [
                    <div key={lbl+'l'} style={{ color:C.muted, fontWeight:600 }}>{lbl}</div>,
                    <div key={lbl+'a'} style={{ color:C.faint }}>{a}</div>,
                    <div key={lbl+'b'} style={{ color:C.faint }}>{b}</div>,
                    <div key={lbl+'c'} style={{ color:C.faint }}>{c}</div>,
                  ]
                ))}
              </div>
            </div>
          </div>

          {/* ─ 5. Personal Target &amp; Action Plan ────────────────────── */}
          <div style={{
            ...CARD, marginBottom:16,
            background:targetMet?'rgba(16,185,129,0.06)':'rgba(239,68,68,0.05)',
            border:`1px solid ${targetMet?'rgba(16,185,129,0.20)':'rgba(239,68,68,0.18)'}`,
          }}>
            <div style={SL}>🎯 Personalised Target &amp; Action Plan</div>

            {/* Three-stat row */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:20 }}>
              <div style={{ padding:'14px', background:'rgba(0,0,0,0.15)', borderRadius:12 }}>
                <div style={{ fontSize:10, color:C.faint, marginBottom:4 }}>Your LDL</div>
                <div style={{ fontSize:30, fontWeight:800, color:tier.color }}>{fmt(parsed.ldlBest)}</div>
                <div style={{ fontSize:11, color:C.faint }}>mg/dL</div>
              </div>
              <div style={{ padding:'14px', background:'rgba(0,0,0,0.15)', borderRadius:12 }}>
                <div style={{ fontSize:10, color:C.faint, marginBottom:4 }}>Your Target</div>
                <div style={{ fontSize:30, fontWeight:800, color:C.text }}>{'<'} {target}</div>
                <div style={{ fontSize:11, color:C.faint }}>mg/dL</div>
              </div>
              <div style={{ padding:'14px', background:'rgba(0,0,0,0.15)', borderRadius:12 }}>
                <div style={{ fontSize:10, color:C.faint, marginBottom:4 }}>Gap to Target</div>
                <div style={{ fontSize:30, fontWeight:800, color:targetMet?C.optimal:C.veryHigh }}>
                  {targetMet ? '✓' : `+${fmt(parsed.ldlBest - target)}`}
                </div>
                <div style={{ fontSize:11, color:targetMet?C.optimal:C.veryHigh }}>
                  {targetMet ? 'Target met ✓' : 'mg/dL above target'}
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div style={{ marginBottom:16 }}>
              <div style={{ height:10, borderRadius:5, background:'rgba(255,255,255,0.08)', overflow:'hidden', position:'relative' }}>
                <div style={{
                  height:'100%', borderRadius:5, transition:'width 0.5s cubic-bezier(0.4,0,0.2,1)',
                  width:`${Math.min((parsed.ldlBest / (target * 2)) * 100, 100)}%`,
                  background: targetMet ? C.optimal : `linear-gradient(90deg, ${C.optimal}, ${tier.color})`,
                }} />
                <div style={{ position:'absolute', left:'50%', top:0, bottom:0,
                  width:2, borderLeft:'2px dashed rgba(255,255,255,0.4)' }} />
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:10, color:C.faint, marginTop:3 }}>
                <span>0</span>
                <span>Target: {'<'} {target} mg/dL</span>
                <span>{target*2} mg/dL</span>
              </div>
            </div>

            {/* Target met */}
            {targetMet && (
              <div style={{ padding:'14px 16px', background:'rgba(16,185,129,0.12)', borderRadius:10,
                fontSize:13, color:'#6ee7b7', lineHeight:1.6 }}>
                ✅ <strong>Your LDL is below your personalised target of {target} mg/dL.</strong> Continue your current healthy habits and keep up with regular monitoring — lipid panels are typically recommended every 1–5 years depending on your risk level.
              </div>
            )}

            {/* Not met — lifestyle action plan */}
            {!targetMet && (
              <div>
                <div style={{ fontSize:12, fontWeight:700, color:C.muted, marginBottom:12 }}>
                  Estimated impact of lifestyle changes on your LDL:
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:8 }}>
                  {LIFESTYLE.map(item => {
                    const reduction = parsed.ldlBest * item.pct;
                    const projected = parsed.ldlBest - reduction;
                    const meets     = projected < target;
                    return (
                      <div key={item.label} style={{
                        padding:'10px 12px', borderRadius:10,
                        background:meets?'rgba(16,185,129,0.09)':'rgba(255,255,255,0.04)',
                        border:`1px solid ${meets?'rgba(16,185,129,0.22)':'rgba(255,255,255,0.08)'}`,
                      }}>
                        <div style={{ fontSize:11, color:C.muted, marginBottom:5 }}>{item.label}</div>
                        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                          <span style={{ fontSize:12, fontWeight:700, color:meets?C.optimal:C.borderline }}>
                            {item.range} → {fmt(projected,0)} mg/dL
                          </span>
                          {meets && <span style={{ fontSize:10, color:C.optimal }}>✓ target met</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ marginTop:10, fontSize:11, color:C.faint }}>
                  * Individual responses vary. Combining multiple changes can reduce LDL by up to 30%. Consult your doctor before making significant dietary changes if you are on medication.
                </div>
              </div>
            )}
          </div>

          {/* ─ Disclaimer ────────────────────────────────────────────── */}
          <div style={{ ...CARD, marginBottom:16, background:'transparent', border:'1px solid rgba(255,255,255,0.06)', padding:'14px 18px' }}>
            <div style={{ fontSize:11, color:C.faint, lineHeight:1.7 }}>
              <strong style={{ color:C.muted }}>Clinical disclaimer:</strong> This tool is for educational and reference purposes only. LDL values are estimates calculated from your self-reported lipid values using validated equations (Friedewald 1972; Sampson et al., JAMA Cardiology 2020). Results do not constitute medical advice and should not replace consultation with a qualified healthcare professional. Treatment decisions require comprehensive clinical assessment including full history, physical examination, and appropriate laboratory evaluation.
            </div>
          </div>
        </>
      )}

      {/* ─ Collapsible Guide ─────────────────────────────────────────── */}
      <div style={CARD}>
        <button
          onClick={()=>setShowGuide(g=>!g)}
          style={{ width:'100%', background:'transparent', border:'none', cursor:'pointer', padding:0,
            display:'flex', justifyContent:'space-between', alignItems:'center', fontFamily:'inherit' }}
        >
          <span style={{ fontSize:15, fontWeight:700, color:C.text }}>📖 Understanding Your Lipid Panel</span>
          <span style={{ fontSize:13, color:C.muted }}>{showGuide?'Hide ▲':'Show guide ▼'}</span>
        </button>

        {showGuide && (
          <div style={{ marginTop:18 }}>
            {GUIDE_SECTIONS.map(sec => (
              <div key={sec.key}>
                <button
                  className="ldl-guide-btn"
                  onClick={()=>setActiveGuide(a=>a===sec.key?null:sec.key)}
                >
                  <span style={{ fontSize:13, fontWeight:600 }}>{sec.title}</span>
                  <span style={{ fontSize:12, color:C.muted, flexShrink:0 }}>{activeGuide===sec.key?'▲':'▼'}</span>
                </button>
                {activeGuide===sec.key && (
                  <div className="ldl-guide-body">
                    <p style={{ margin:0, fontSize:13, color:C.muted, lineHeight:1.75 }}>{sec.body}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
