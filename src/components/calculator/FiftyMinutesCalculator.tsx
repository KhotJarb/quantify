'use client';

import { useState, useCallback, useMemo } from 'react';

/* ──────────────────────────────────────────────────────────
   Types
   ────────────────────────────────────────────────────────── */

interface Phase {
  id: string;
  name: string;
  duration: number;
  color: string;
  icon: string;
  whatToDo: string;
  whyItMatters: string;
  proTip: string;
}

interface TaskPreset {
  id: string;
  label: string;
  icon: string;
  description: string;
  phases: Phase[];
}

type Intensity = 'light' | 'moderate' | 'intense';

/* ──────────────────────────────────────────────────────────
   Constants
   ────────────────────────────────────────────────────────── */

const PHASE_COLORS = ['#8b7355', '#5a8a6a', '#5c7a8a', '#9b6b9e', '#c4944a', '#6a8ab5'];

const PRESETS: TaskPreset[] = [
  {
    id: 'study', label: 'Study', icon: '📚',
    description: 'Optimized for learning and retention',
    phases: [
      { id: 's1', name: 'Prepare & Outline', duration: 5, color: '#8b7355', icon: '📋',
        whatToDo: 'Set your study goal. Gather materials. Write 3 key questions you want to answer.',
        whyItMatters: 'Priming activates prior knowledge and creates mental hooks for new information (schema theory).',
        proTip: 'Write your questions by hand — handwriting activates deeper cognitive processing.' },
      { id: 's2', name: 'Deep Reading', duration: 20, color: '#5a8a6a', icon: '🎯',
        whatToDo: 'Read actively. Highlight sparingly (max 10%). Take margin notes. Connect to prior knowledge.',
        whyItMatters: 'Active recall during reading strengthens memory consolidation 3× more than passive re-reading.',
        proTip: 'Use the Feynman technique: after each section, explain it in your own words.' },
      { id: 's3', name: 'Self-Test', duration: 5, color: '#5c7a8a', icon: '🔍',
        whatToDo: 'Close the book. Answer your 3 questions from memory. Note gaps.',
        whyItMatters: 'Retrieval practice (testing effect) is the #1 evidence-based study method — Roediger & Karpicke, 2006.',
        proTip: 'Struggling to recall is a GOOD sign — it means you\'re strengthening the memory trace.' },
      { id: 's4', name: 'Practice & Apply', duration: 15, color: '#9b6b9e', icon: '🛠️',
        whatToDo: 'Solve practice problems. Create flashcards. Teach the concept to an imaginary student.',
        whyItMatters: 'Application bridges the gap between knowing and understanding (Bloom\'s taxonomy levels 3-4).',
        proTip: 'Interleave topics instead of blocking — it feels harder but produces 43% better retention.' },
      { id: 's5', name: 'Spaced Recall', duration: 5, color: '#c4944a', icon: '🪞',
        whatToDo: 'Write a 3-sentence summary from memory. Schedule your next review session.',
        whyItMatters: 'The spacing effect shows reviewing at increasing intervals cements long-term memory.',
        proTip: 'Schedule reviews at 1 day, 3 days, 7 days, 21 days for optimal retention.' },
    ],
  },
  {
    id: 'code', label: 'Code', icon: '💻',
    description: 'Structured for shipping quality software',
    phases: [
      { id: 'c1', name: 'Plan & Understand', duration: 3, color: '#8b7355', icon: '📋',
        whatToDo: 'Read the ticket/task fully. Identify inputs, outputs, edge cases. Sketch your approach on paper.',
        whyItMatters: 'Planning before coding reduces total development time by 25% — measurable across studies.',
        proTip: 'Write pseudocode or draw a flowchart. The 3 minutes invested here saves 15 minutes of debugging.' },
      { id: 'c2', name: 'Implement', duration: 22, color: '#5a8a6a', icon: '⌨️',
        whatToDo: 'Code the solution. Focus on making it work first, not perfect. No notifications, no browsing.',
        whyItMatters: 'Flow state requires 15-23 minutes of uninterrupted focus to achieve — every interruption costs 23 min to recover.',
        proTip: 'Write the test first (TDD) if possible. It forces clear thinking about the expected behavior.' },
      { id: 'c3', name: 'Test & Debug', duration: 5, color: '#5c7a8a', icon: '🧪',
        whatToDo: 'Run your tests. Try edge cases. Read error messages carefully. Fix the most critical bugs.',
        whyItMatters: 'Immediate testing catches bugs while context is fresh — fixing a bug now costs 10× less than finding it later.',
        proTip: 'Test with unusual inputs: empty strings, zero, negative numbers, maximum values, null.' },
      { id: 'c4', name: 'Refactor & Harden', duration: 15, color: '#9b6b9e', icon: '✨',
        whatToDo: 'Clean up naming. Extract functions. Handle edge cases. Add error boundaries. Review your own diff.',
        whyItMatters: 'Code is read 10× more than it is written. Clean code reduces future maintenance costs exponentially.',
        proTip: 'Apply the Boy Scout Rule: leave the codebase cleaner than you found it.' },
      { id: 'c5', name: 'Document & Commit', duration: 5, color: '#c4944a', icon: '📝',
        whatToDo: 'Write a clear commit message. Update docs/comments. Note any follow-up work needed.',
        whyItMatters: 'Good commit messages are a love letter to your future self. They enable faster code archaeology.',
        proTip: 'Use conventional commits format: feat(scope): description. Link to the ticket/issue.' },
    ],
  },
  {
    id: 'create', label: 'Create', icon: '🎨',
    description: 'Designed for creative and design work',
    phases: [
      { id: 'cr1', name: 'Inspiration', duration: 5, color: '#8b7355', icon: '💡',
        whatToDo: 'Browse references. Create a mood board. Define the emotion or message you want to convey.',
        whyItMatters: 'Incubation theory: exposing your brain to diverse stimuli before creating produces more original outputs.',
        proTip: 'Look at work outside your discipline — architecture, nature, music — for unexpected connections.' },
      { id: 'cr2', name: 'Create Freely', duration: 20, color: '#5a8a6a', icon: '🖌️',
        whatToDo: 'Produce without judging. Quantity over quality. Follow your instinct. Fill the canvas.',
        whyItMatters: 'The inner critic kills creativity. Divergent thinking requires a judgment-free zone (Guilford, 1967).',
        proTip: 'Set a mini-challenge: "Create 5 variations in 20 minutes." Constraints breed creativity.' },
      { id: 'cr3', name: 'Step Back', duration: 5, color: '#5c7a8a', icon: '👁️',
        whatToDo: 'Stop creating. View your work from a distance. Identify what works and what doesn\'t.',
        whyItMatters: 'Psychological distance improves evaluation accuracy. Artists literally step back from the easel for this reason.',
        proTip: 'Squint at your work, flip it upside down, or view it in grayscale to see composition clearly.' },
      { id: 'cr4', name: 'Refine', duration: 15, color: '#9b6b9e', icon: '🔧',
        whatToDo: 'Take your best ideas and polish them. Add detail. Improve consistency. Remove distractions.',
        whyItMatters: 'Convergent thinking (selecting and improving) is a different skill than divergent thinking — both are essential.',
        proTip: 'Apply the "10% rule": remove 10% of elements. Less is usually more.' },
      { id: 'cr5', name: 'Evaluate & Export', duration: 5, color: '#c4944a', icon: '📦',
        whatToDo: 'Save your final version. Export in needed formats. Write 3 things you learned.',
        whyItMatters: 'Reflective practice (Schön, 1983) is how professionals improve. Each session should teach you something.',
        proTip: 'Keep a "swipe file" of techniques that worked — your future self will thank you.' },
    ],
  },
  {
    id: 'workout', label: 'Workout', icon: '🏃',
    description: 'Structured for effective physical training',
    phases: [
      { id: 'w1', name: 'Dynamic Warmup', duration: 5, color: '#8b7355', icon: '🔥',
        whatToDo: 'Joint circles, leg swings, arm circles, light cardio. Increase heart rate gradually.',
        whyItMatters: 'Warming up increases blood flow by 300%, reduces injury risk by 50%, and improves performance.',
        proTip: 'Match your warmup to your workout — if you\'re squatting, do bodyweight squats and hip circles.' },
      { id: 'w2', name: 'Main Training', duration: 20, color: '#5a8a6a', icon: '💪',
        whatToDo: 'Perform your primary exercises. Focus on form. Progressive overload.',
        whyItMatters: 'The SAID principle: your body adapts specifically to the demands imposed. Consistency is key.',
        proTip: 'Rest 60-90s between sets for hypertrophy, 2-3 min for strength. Track your weights.' },
      { id: 'w3', name: 'Accessory Work', duration: 10, color: '#5c7a8a', icon: '🎯',
        whatToDo: 'Supporting exercises: core work, isolation movements, mobility drills, balance training.',
        whyItMatters: 'Accessories prevent muscle imbalances and reduce overuse injury risk by 40%.',
        proTip: 'Superset accessories to save time — pair opposing muscle groups (biceps + triceps).' },
      { id: 'w4', name: 'Cool Down', duration: 10, color: '#9b6b9e', icon: '🧘',
        whatToDo: 'Static stretching. Hold each stretch 30 seconds. Focus on worked muscle groups.',
        whyItMatters: 'Cool-down reduces DOMS (delayed onset muscle soreness) and accelerates recovery.',
        proTip: 'Foam roll tight areas for 60 seconds each. Breathe deeply — it activates parasympathetic recovery.' },
      { id: 'w5', name: 'Log & Hydrate', duration: 5, color: '#c4944a', icon: '📊',
        whatToDo: 'Record your exercises, sets, reps, weights. Drink 16-24 oz water. Note how you felt.',
        whyItMatters: 'Tracking enables progressive overload — the fundamental driver of fitness adaptation.',
        proTip: 'Rate your session 1-10 for energy and 1-10 for effort. Patterns emerge over weeks.' },
    ],
  },
  {
    id: 'write', label: 'Write', icon: '📝',
    description: 'Optimized for producing written content',
    phases: [
      { id: 'wr1', name: 'Outline', duration: 5, color: '#8b7355', icon: '🗺️',
        whatToDo: 'Write your thesis in one sentence. List 3-5 key points. Decide on structure and audience.',
        whyItMatters: 'An outline reduces total writing time by 30% and dramatically improves coherence.',
        proTip: 'Start with your conclusion — knowing your destination makes the journey faster.' },
      { id: 'wr2', name: 'Free Draft', duration: 20, color: '#5a8a6a', icon: '✍️',
        whatToDo: 'Write continuously without editing. Don\'t backspace. Don\'t reread. Just produce words.',
        whyItMatters: 'Separating drafting from editing uses different brain systems. Mixing them causes writer\'s block.',
        proTip: 'If stuck, write "I\'m stuck because..." and keep going. The block dissolves within 30 seconds.' },
      { id: 'wr3', name: 'Read Aloud', duration: 5, color: '#5c7a8a', icon: '🗣️',
        whatToDo: 'Read your draft out loud. Mark awkward sentences. Note where you stumble.',
        whyItMatters: 'Reading aloud activates auditory processing, catching 60% more errors than silent reading.',
        proTip: 'Record yourself and play it back. You\'ll hear problems you missed while speaking.' },
      { id: 'wr4', name: 'Edit & Tighten', duration: 15, color: '#9b6b9e', icon: '✂️',
        whatToDo: 'Cut unnecessary words. Strengthen verbs. Vary sentence length. Fix grammar.',
        whyItMatters: 'Hemingway: "The first draft of anything is garbage." Editing is where good writing happens.',
        proTip: 'Apply the 50% rule: try to say the same thing in half the words. Clarity comes from compression.' },
      { id: 'wr5', name: 'Final Proofread', duration: 5, color: '#c4944a', icon: '✅',
        whatToDo: 'Read backwards sentence by sentence (catches typos). Check formatting. Verify facts.',
        whyItMatters: 'Your brain auto-corrects errors when reading forward. Backward reading defeats this.',
        proTip: 'Read in a different font or print it out. Novel visual presentation reveals hidden errors.' },
    ],
  },
  {
    id: 'meeting-prep', label: 'Meeting Prep', icon: '🤝',
    description: 'Prepare to lead or contribute effectively',
    phases: [
      { id: 'm1', name: 'Context Review', duration: 5, color: '#8b7355', icon: '📖',
        whatToDo: 'Re-read the agenda, past meeting notes, and relevant emails. Identify your role.',
        whyItMatters: 'Context loading prevents the "cold start" problem — walking into a meeting unprepared wastes everyone\'s time.',
        proTip: 'Check who else is attending. Anticipate their perspectives and concerns.' },
      { id: 'm2', name: 'Research & Data', duration: 15, color: '#5a8a6a', icon: '📊',
        whatToDo: 'Gather data, metrics, examples. Build your argument with evidence. Prepare visualizations.',
        whyItMatters: 'Data-backed arguments are 4× more persuasive than opinion-based ones in corporate settings.',
        proTip: 'Prepare one "killer stat" that summarizes your key point. People remember one number, not five.' },
      { id: 'm3', name: 'Draft Talking Points', duration: 10, color: '#5c7a8a', icon: '🎤',
        whatToDo: 'Write 3-5 bullet points. Each should be one clear sentence. Prioritize by importance.',
        whyItMatters: 'Structured communication is perceived as 50% more competent than free-form speaking.',
        proTip: 'Use the STAR format for each point: Situation → Task → Action → Result.' },
      { id: 'm4', name: 'Anticipate Q&A', duration: 15, color: '#9b6b9e', icon: '❓',
        whatToDo: 'List 5 questions others might ask. Prepare concise answers. Identify potential objections.',
        whyItMatters: 'The "pre-mortem" technique reduces surprise by 80% and increases confidence by 3×.',
        proTip: 'Prepare a "parking lot" answer: "Great question. Let me follow up with data on that by EOD."' },
      { id: 'm5', name: 'Mental Rehearsal', duration: 5, color: '#c4944a', icon: '🧠',
        whatToDo: 'Close your eyes. Visualize the meeting going well. Practice your opening line out loud.',
        whyItMatters: 'Mental rehearsal activates the same neural pathways as actual performance (sports psychology).',
        proTip: 'Take 5 deep breaths. Box breathing (4-4-4-4) reduces cortisol by 23% within 2 minutes.' },
    ],
  },
];

const INTENSITY_SCALES: Record<Intensity, number[]> = {
  light:    [1.6, 0.85, 1.2, 0.85, 1.2],
  moderate: [1.0, 1.0,  1.0, 1.0,  1.0],
  intense:  [0.6, 1.25, 0.6, 1.0,  0.6],
};

const MOTIVATIONAL: Record<string, string> = {
  study: 'Every 50 minutes of focused study compounds into mastery.',
  code: 'Ship small, ship often. This session moves the needle.',
  create: 'Permission to create imperfectly — refinement comes later.',
  workout: 'Consistency beats intensity. Show up and you\'ve already won.',
  write: 'The blank page is an illusion. Just start writing.',
  'meeting-prep': 'Well-prepared is half-presented. You\'ve got this.',
};

/* ──────────────────────────────────────────────────────────
   Helpers
   ────────────────────────────────────────────────────────── */

function uid(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `p-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function scalePhases(base: Phase[], intensity: Intensity): Phase[] {
  const scales = INTENSITY_SCALES[intensity];
  const targetTotal = base.reduce((s, p) => s + p.duration, 0);
  const raw = base.map((p, i) => ({
    ...p,
    id: p.id,
    duration: Math.max(1, Math.round(p.duration * (scales[i % scales.length] || 1))),
  }));
  const rawTotal = raw.reduce((s, p) => s + p.duration, 0);
  if (rawTotal !== targetTotal && raw.length > 0) {
    const diff = targetTotal - rawTotal;
    // distribute diff to the largest phase
    let maxIdx = 0;
    raw.forEach((p, i) => { if (p.duration > raw[maxIdx].duration) maxIdx = i; });
    raw[maxIdx] = { ...raw[maxIdx], duration: Math.max(1, raw[maxIdx].duration + diff) };
  }
  return raw;
}

function formatTime(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h > 0 ? `${h}:${m.toString().padStart(2, '0')}` : `${m}:00`;
}

function cumulativeStart(phases: Phase[], idx: number): number {
  let t = 0;
  for (let i = 0; i < idx; i++) t += phases[i].duration;
  return t;
}

/* ──────────────────────────────────────────────────────────
   Component
   ────────────────────────────────────────────────────────── */

export default function FiftyMinutesCalculator() {
  const [selectedPreset, setSelectedPreset] = useState<string>('study');
  const [intensity, setIntensity] = useState<Intensity>('moderate');
  const [phases, setPhases] = useState<Phase[]>(PRESETS[0].phases);
  const [expandedPhase, setExpandedPhase] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const [editingName, setEditingName] = useState<string | null>(null);
  const [hoveredArc, setHoveredArc] = useState<string | null>(null);

  const totalDuration = useMemo(() => phases.reduce((s, p) => s + p.duration, 0), [phases]);
  const currentPreset = useMemo(() => PRESETS.find(p => p.id === selectedPreset) ?? PRESETS[0], [selectedPreset]);

  /* ── Preset selection ─────────────────────────────── */
  const selectPreset = useCallback((presetId: string) => {
    const preset = PRESETS.find(p => p.id === presetId);
    if (!preset) return;
    setSelectedPreset(presetId);
    setPhases(scalePhases(preset.phases, intensity));
    setExpandedPhase(null);
    setEditingName(null);
  }, [intensity]);

  /* ── Intensity change ─────────────────────────────── */
  const changeIntensity = useCallback((i: Intensity) => {
    setIntensity(i);
    const preset = PRESETS.find(p => p.id === selectedPreset);
    if (preset) {
      setPhases(scalePhases(preset.phases, i));
    }
  }, [selectedPreset]);

  /* ── Phase mutations ──────────────────────────────── */
  const updatePhaseName = useCallback((id: string, name: string) => {
    setPhases(prev => prev.map(p => p.id === id ? { ...p, name } : p));
  }, []);

  const updatePhaseDuration = useCallback((id: string, dur: number) => {
    const clamped = Math.max(1, Math.min(99, Math.round(dur)));
    setPhases(prev => prev.map(p => p.id === id ? { ...p, duration: clamped } : p));
  }, []);

  const movePhase = useCallback((id: string, dir: -1 | 1) => {
    setPhases(prev => {
      const idx = prev.findIndex(p => p.id === id);
      if (idx < 0) return prev;
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= prev.length) return prev;
      const copy = [...prev];
      [copy[idx], copy[newIdx]] = [copy[newIdx], copy[idx]];
      return copy;
    });
  }, []);

  const removePhase = useCallback((id: string) => {
    setPhases(prev => {
      if (prev.length <= 1) return prev;
      return prev.filter(p => p.id !== id);
    });
    if (expandedPhase === id) setExpandedPhase(null);
    if (editingName === id) setEditingName(null);
  }, [expandedPhase, editingName]);

  const addPhase = useCallback(() => {
    const newPhase: Phase = {
      id: uid(),
      name: 'New Phase',
      duration: 5,
      color: PHASE_COLORS[phases.length % PHASE_COLORS.length],
      icon: '📌',
      whatToDo: 'Define what you\'ll do in this phase.',
      whyItMatters: 'Customize this to your workflow.',
      proTip: 'Make it specific and actionable.',
    };
    setPhases(prev => [...prev, newPhase]);
  }, [phases.length]);

  const resetPhases = useCallback(() => {
    const preset = PRESETS.find(p => p.id === selectedPreset);
    if (preset) {
      setPhases(scalePhases(preset.phases, intensity));
      setExpandedPhase(null);
      setEditingName(null);
    }
  }, [selectedPreset, intensity]);

  /* ── SVG Ring ─────────────────────────────────────── */
  const RING_RADIUS = 110;
  const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

  const arcs = useMemo(() => {
    if (totalDuration === 0) return [];
    let cumulative = 0;
    return phases.map(p => {
      const fraction = p.duration / totalDuration;
      const dashLength = fraction * RING_CIRCUMFERENCE;
      const gapLength = RING_CIRCUMFERENCE - dashLength;
      const offset = -(cumulative / totalDuration) * RING_CIRCUMFERENCE;
      // Midpoint angle for label placement
      const midFraction = (cumulative + p.duration / 2) / totalDuration;
      const midAngle = midFraction * 2 * Math.PI - Math.PI / 2;
      const labelR = RING_RADIUS + 1;
      const lx = 140 + Math.cos(midAngle) * labelR;
      const ly = 140 + Math.sin(midAngle) * labelR;
      cumulative += p.duration;
      return {
        phase: p,
        dasharray: `${dashLength} ${gapLength}`,
        dashoffset: offset,
        labelX: lx,
        labelY: ly,
        midAngle,
      };
    });
  }, [phases, totalDuration, RING_CIRCUMFERENCE]);

  /* ── Render ───────────────────────────────────────── */
  return (
    <div className="fifty-min">
      <style>{CSS_TEXT}</style>

      {/* ── MISSION SELECTOR ───────────────────────── */}
      <section className="fifty-min__section">
        <h3 className="fifty-min__section-title">Choose Your Mission</h3>
        <div className="fifty-min__missions">
          {PRESETS.map(p => (
            <button
              key={p.id}
              className={`fifty-min__mission-card${selectedPreset === p.id ? ' fifty-min__mission-card--active' : ''}`}
              onClick={() => selectPreset(p.id)}
              aria-pressed={selectedPreset === p.id}
              type="button"
            >
              <span className="fifty-min__mission-icon">{p.icon}</span>
              <span className="fifty-min__mission-label">{p.label}</span>
              <span className="fifty-min__mission-desc">{p.description}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ── INTENSITY SELECTOR ─────────────────────── */}
      <section className="fifty-min__section">
        <h3 className="fifty-min__section-title">Intensity</h3>
        <div className="fifty-min__intensity">
          {([
            { key: 'light' as Intensity, icon: '☀️', label: 'Light' },
            { key: 'moderate' as Intensity, icon: '⚡', label: 'Moderate' },
            { key: 'intense' as Intensity, icon: '🔥', label: 'Intense' },
          ]).map(i => (
            <button
              key={i.key}
              className={`fifty-min__intensity-btn${intensity === i.key ? ' fifty-min__intensity-btn--active' : ''}`}
              onClick={() => changeIntensity(i.key)}
              aria-pressed={intensity === i.key}
              type="button"
            >
              <span>{i.icon}</span> {i.label}
            </button>
          ))}
        </div>
      </section>

      {/* ── RING VISUALIZATION ─────────────────────── */}
      <section className="fifty-min__section fifty-min__section--center">
        <div className="fifty-min__ring-wrap">
          <svg
            className="fifty-min__ring-svg"
            viewBox="0 0 280 280"
            aria-label="Phase distribution ring"
          >
            {/* Background ring */}
            <circle
              cx="140" cy="140" r={RING_RADIUS}
              fill="none"
              stroke="var(--border-secondary)"
              strokeWidth="22"
            />
            {/* Phase arcs */}
            {arcs.map((a, idx) => (
              <circle
                key={a.phase.id}
                cx="140" cy="140" r={RING_RADIUS}
                fill="none"
                stroke={a.phase.color}
                strokeWidth={hoveredArc === a.phase.id ? 28 : 22}
                strokeDasharray={a.dasharray}
                strokeDashoffset={a.dashoffset}
                strokeLinecap="butt"
                className="fifty-min__ring-arc"
                onMouseEnter={() => setHoveredArc(a.phase.id)}
                onMouseLeave={() => setHoveredArc(null)}
                style={{ transform: 'rotate(-90deg)', transformOrigin: '140px 140px', opacity: hoveredArc && hoveredArc !== a.phase.id ? 0.45 : 1 }}
              />
            ))}
            {/* Center text */}
            <text x="140" y="130" textAnchor="middle" className="fifty-min__ring-total">
              {totalDuration}
            </text>
            <text x="140" y="150" textAnchor="middle" className="fifty-min__ring-unit">
              minutes
            </text>
            <text x="140" y="172" textAnchor="middle" className="fifty-min__ring-icon">
              {currentPreset.icon}
            </text>
          </svg>

          {/* Tooltip */}
          {hoveredArc && (() => {
            const arc = arcs.find(a => a.phase.id === hoveredArc);
            if (!arc) return null;
            return (
              <div className="fifty-min__ring-tooltip">
                <span style={{ color: arc.phase.color }}>{arc.phase.icon}</span>{' '}
                {arc.phase.name} — <strong>{arc.phase.duration} min</strong>
              </div>
            );
          })()}
        </div>
      </section>

      {/* ── PHASE LIST ─────────────────────────────── */}
      <section className="fifty-min__section">
        <h3 className="fifty-min__section-title">Your Phases</h3>
        <div className="fifty-min__phases">
          {phases.map((p, idx) => {
            const startMin = cumulativeStart(phases, idx);
            const endMin = startMin + p.duration;
            const isExpanded = expandedPhase === p.id;
            const isEditing = editingName === p.id;
            return (
              <div
                key={p.id}
                className={`fifty-min__phase-card${isExpanded ? ' fifty-min__phase-card--expanded' : ''}`}
                style={{ borderLeftColor: p.color }}
              >
                {/* ── Header row ── */}
                <div className="fifty-min__phase-header">
                  <span
                    className="fifty-min__phase-dot"
                    style={{ backgroundColor: p.color }}
                  />
                  <span className="fifty-min__phase-icon">{p.icon}</span>

                  {isEditing ? (
                    <input
                      className="fifty-min__phase-name-input"
                      value={p.name}
                      onChange={e => updatePhaseName(p.id, e.target.value)}
                      onBlur={() => setEditingName(null)}
                      onKeyDown={e => { if (e.key === 'Enter') setEditingName(null); }}
                      autoFocus
                      aria-label="Phase name"
                    />
                  ) : (
                    <button
                      className="fifty-min__phase-name"
                      onClick={() => setEditingName(p.id)}
                      title="Click to edit name"
                      type="button"
                    >
                      {p.name}
                    </button>
                  )}

                  <span className="fifty-min__phase-time-range">
                    {formatTime(startMin)} – {formatTime(endMin)}
                  </span>

                  <input
                    className="fifty-min__phase-dur"
                    type="number"
                    min={1}
                    max={99}
                    value={p.duration}
                    onChange={e => updatePhaseDuration(p.id, parseInt(e.target.value) || 1)}
                    aria-label={`${p.name} duration in minutes`}
                    title="Duration (minutes)"
                  />
                  <span className="fifty-min__phase-dur-label">min</span>

                  <div className="fifty-min__phase-actions">
                    <button
                      className="fifty-min__phase-action-btn"
                      onClick={() => movePhase(p.id, -1)}
                      disabled={idx === 0}
                      title="Move up"
                      type="button"
                      aria-label="Move phase up"
                    >▲</button>
                    <button
                      className="fifty-min__phase-action-btn"
                      onClick={() => movePhase(p.id, 1)}
                      disabled={idx === phases.length - 1}
                      title="Move down"
                      type="button"
                      aria-label="Move phase down"
                    >▼</button>
                    <button
                      className="fifty-min__phase-action-btn fifty-min__phase-action-btn--danger"
                      onClick={() => removePhase(p.id)}
                      disabled={phases.length <= 1}
                      title="Remove phase"
                      type="button"
                      aria-label="Remove phase"
                    >×</button>
                    <button
                      className="fifty-min__phase-expand-btn"
                      onClick={() => setExpandedPhase(isExpanded ? null : p.id)}
                      title={isExpanded ? 'Collapse' : 'Expand details'}
                      type="button"
                      aria-expanded={isExpanded}
                      aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
                    >
                      {isExpanded ? '▾' : '▸'}
                    </button>
                  </div>
                </div>

                {/* ── Expanded body ── */}
                {isExpanded && (
                  <div className="fifty-min__phase-body">
                    <div className="fifty-min__phase-detail">
                      <div className="fifty-min__phase-detail-label">What to do</div>
                      <div className="fifty-min__phase-detail-text">{p.whatToDo}</div>
                    </div>
                    <div className="fifty-min__phase-detail">
                      <div className="fifty-min__phase-detail-label">Why it matters</div>
                      <div className="fifty-min__phase-detail-text">{p.whyItMatters}</div>
                    </div>
                    <div className="fifty-min__phase-detail fifty-min__phase-detail--tip">
                      <div className="fifty-min__phase-detail-label">💡 Pro Tip</div>
                      <div className="fifty-min__phase-detail-text">{p.proTip}</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="fifty-min__phase-toolbar">
          <button
            className="fifty-min__add-btn"
            onClick={addPhase}
            type="button"
            aria-label="Add new phase"
          >
            + Add Phase
          </button>
          <button
            className="fifty-min__reset-btn"
            onClick={resetPhases}
            type="button"
          >
            ↺ Reset to Preset
          </button>
        </div>
      </section>

      {/* ── SUMMARY BAR ────────────────────────────── */}
      <section className="fifty-min__summary">
        <div className="fifty-min__summary-item">
          <span className="fifty-min__summary-value">{totalDuration}</span>
          <span className="fifty-min__summary-label">Total min</span>
        </div>
        <div className="fifty-min__summary-divider" />
        <div className="fifty-min__summary-item">
          <span className="fifty-min__summary-value">{phases.length}</span>
          <span className="fifty-min__summary-label">Phases</span>
        </div>
        <div className="fifty-min__summary-divider" />
        <div className="fifty-min__summary-item fifty-min__summary-item--wide">
          <span className="fifty-min__summary-value">{currentPreset.icon} {currentPreset.label}</span>
          <span className="fifty-min__summary-label">Optimized for</span>
        </div>
        <div className="fifty-min__summary-motivational">
          {MOTIVATIONAL[selectedPreset]}
        </div>
      </section>

      {/* ── GUIDE ──────────────────────────────────── */}
      <section className="fifty-min__section">
        <button
          className="fifty-min__guide-toggle"
          onClick={() => setShowGuide(g => !g)}
          type="button"
          aria-expanded={showGuide}
        >
          <span>🧬 The Science Behind 50 Minutes</span>
          <span className={`fifty-min__guide-chevron${showGuide ? ' fifty-min__guide-chevron--open' : ''}`}>▸</span>
        </button>

        {showGuide && (
          <div className="fifty-min__guide">
            <div className="fifty-min__guide-block">
              <h4>Ultradian Rhythms</h4>
              <p>Your brain naturally operates in 90-minute cycles of high and low alertness (Kleitman, 1963). A focused 50-minute session fits neatly within the peak of one cycle, maximizing cognitive throughput while leaving buffer time for transition and rest.</p>
            </div>
            <div className="fifty-min__guide-block">
              <h4>Flow State Research</h4>
              <p>Csikszentmihalyi&apos;s research shows flow state requires 15-23 minutes to enter. A 50-minute session gives you ~25-30 minutes of actual flow after ramp-up — the sweet spot before cognitive fatigue degrades performance (Yerkes-Dodson Law).</p>
            </div>
            <div className="fifty-min__guide-block">
              <h4>Extended Pomodoro</h4>
              <p>The classic Pomodoro is 25 minutes — too short for complex tasks requiring deep context loading. 50 minutes (2× Pomodoro) maintains the time-boxed discipline while allowing enough runway for meaningful deep work. Research by Demarco &amp; Lister found knowledge workers need at least 15 uninterrupted minutes to become productive.</p>
            </div>
            <div className="fifty-min__guide-block">
              <h4>Cal Newport&apos;s Deep Work</h4>
              <p>Newport argues that the ability to perform deep work is becoming simultaneously more rare and more valuable. A structured 50-minute block with clear phases trains your &quot;deep work muscle&quot; — each session makes the next one easier and more productive.</p>
            </div>
            <div className="fifty-min__guide-block">
              <h4>Phase Design Philosophy</h4>
              <p>Every preset follows the same evidence-based arc: <strong>Prepare → Focus → Review → Apply → Reflect</strong>. This mirrors the learning cycle (Kolb, 1984), the creative process (Wallas, 1926), and the engineering workflow. The bookend phases (prepare &amp; reflect) are short but essential — they convert raw activity time into deliberate practice.</p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   Embedded Styles
   ────────────────────────────────────────────────────────── */

const CSS_TEXT = `
/* ── Container ── */
.fifty-min {
  max-width: 680px;
  margin: 0 auto;
  font-family: var(--font-sans);
  color: var(--text-primary);
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

/* ── Sections ── */
.fifty-min__section {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
.fifty-min__section--center {
  align-items: center;
}
.fifty-min__section-title {
  font-size: 0.8125rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-tertiary);
}

/* ── Mission Cards ── */
.fifty-min__missions {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-3);
}
.fifty-min__mission-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-5) var(--space-3);
  background: var(--bg-card);
  border: 1.5px solid var(--border-secondary);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-base);
  font-family: var(--font-sans);
  text-align: center;
}
.fifty-min__mission-card:hover {
  border-color: var(--border-primary);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}
.fifty-min__mission-card--active {
  border-color: var(--accent-primary);
  background: var(--accent-primary-subtle);
  box-shadow: var(--shadow-sm);
}
.fifty-min__mission-card--active:hover {
  border-color: var(--accent-primary);
}
.fifty-min__mission-icon {
  font-size: 1.75rem;
  line-height: 1;
}
.fifty-min__mission-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
}
.fifty-min__mission-desc {
  font-size: 0.6875rem;
  color: var(--text-tertiary);
  line-height: 1.4;
}

/* ── Intensity ── */
.fifty-min__intensity {
  display: flex;
  gap: var(--space-2);
}
.fifty-min__intensity-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  background: var(--bg-card);
  border: 1.5px solid var(--border-secondary);
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}
.fifty-min__intensity-btn:hover {
  border-color: var(--border-primary);
  color: var(--text-primary);
}
.fifty-min__intensity-btn--active {
  background: var(--accent-primary);
  border-color: var(--accent-primary);
  color: var(--text-inverse);
  font-weight: 600;
}
.fifty-min__intensity-btn--active:hover {
  background: var(--accent-primary-hover);
  border-color: var(--accent-primary-hover);
  color: var(--text-inverse);
}

/* ── Ring ── */
.fifty-min__ring-wrap {
  position: relative;
  width: 280px;
  height: 280px;
}
.fifty-min__ring-svg {
  width: 100%;
  height: 100%;
  display: block;
}
.fifty-min__ring-arc {
  transition: stroke-width var(--transition-fast), opacity var(--transition-fast);
  cursor: pointer;
}
.fifty-min__ring-total {
  font-family: var(--font-mono);
  font-size: 2.5rem;
  font-weight: 700;
  fill: var(--text-primary);
}
.fifty-min__ring-unit {
  font-family: var(--font-sans);
  font-size: 0.75rem;
  fill: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.fifty-min__ring-icon {
  font-size: 1.25rem;
}
.fifty-min__ring-tooltip {
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--bg-card);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  padding: var(--space-2) var(--space-3);
  font-size: 0.8125rem;
  white-space: nowrap;
  box-shadow: var(--shadow-md);
  z-index: 10;
  pointer-events: none;
  color: var(--text-primary);
  animation: fifty-min-fade-in 150ms ease;
}

@keyframes fifty-min-fade-in {
  from { opacity: 0; transform: translateX(-50%) translateY(4px); }
  to   { opacity: 1; transform: translateX(-50%) translateY(0); }
}

/* ── Phase List ── */
.fifty-min__phases {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.fifty-min__phase-card {
  background: var(--bg-card);
  border: 1px solid var(--border-secondary);
  border-left: 4px solid var(--accent-primary);
  border-radius: var(--radius-md);
  transition: box-shadow var(--transition-fast), border-color var(--transition-fast);
  overflow: hidden;
}
.fifty-min__phase-card:hover {
  box-shadow: var(--shadow-sm);
}
.fifty-min__phase-card--expanded {
  box-shadow: var(--shadow-md);
  border-color: var(--border-primary);
}

/* ── Phase header ── */
.fifty-min__phase-header {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  min-height: 48px;
}
.fifty-min__phase-dot {
  width: 8px;
  height: 8px;
  border-radius: var(--radius-full);
  flex-shrink: 0;
}
.fifty-min__phase-icon {
  font-size: 1rem;
  flex-shrink: 0;
  line-height: 1;
}
.fifty-min__phase-name {
  flex: 1;
  min-width: 0;
  background: none;
  border: none;
  border-bottom: 1px dashed transparent;
  font-family: var(--font-sans);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  cursor: text;
  padding: 2px 4px;
  border-radius: 3px;
  transition: border-color var(--transition-fast), background var(--transition-fast);
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.fifty-min__phase-name:hover {
  border-bottom-color: var(--text-muted);
  background: var(--bg-secondary);
}
.fifty-min__phase-name-input {
  flex: 1;
  min-width: 0;
  font-family: var(--font-sans);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  background: var(--bg-input);
  border: 1px solid var(--border-focus);
  border-radius: 3px;
  padding: 2px 4px;
  outline: none;
  box-shadow: 0 0 0 3px var(--accent-primary-subtle);
}
.fifty-min__phase-time-range {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  color: var(--text-tertiary);
  flex-shrink: 0;
  white-space: nowrap;
}
.fifty-min__phase-dur {
  width: 44px;
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  text-align: center;
  border: 1px solid var(--border-input);
  border-radius: var(--radius-sm);
  background: var(--bg-input);
  color: var(--text-primary);
  padding: 3px 4px;
  outline: none;
  transition: border-color var(--transition-fast);
  flex-shrink: 0;
  -moz-appearance: textfield;
}
.fifty-min__phase-dur::-webkit-inner-spin-button,
.fifty-min__phase-dur::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.fifty-min__phase-dur:focus {
  border-color: var(--border-focus);
  box-shadow: 0 0 0 3px var(--accent-primary-subtle);
}
.fifty-min__phase-dur-label {
  font-size: 0.6875rem;
  color: var(--text-muted);
  flex-shrink: 0;
}

/* ── Phase actions ── */
.fifty-min__phase-actions {
  display: flex;
  align-items: center;
  gap: 2px;
  flex-shrink: 0;
  margin-left: var(--space-1);
}
.fifty-min__phase-action-btn {
  width: 26px;
  height: 26px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  color: var(--text-muted);
  font-size: 0.6875rem;
  cursor: pointer;
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
  font-family: var(--font-sans);
}
.fifty-min__phase-action-btn:hover:not(:disabled) {
  background: var(--bg-secondary);
  color: var(--text-primary);
}
.fifty-min__phase-action-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
.fifty-min__phase-action-btn--danger:hover:not(:disabled) {
  background: var(--accent-danger-subtle);
  color: var(--accent-danger);
}
.fifty-min__phase-expand-btn {
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  color: var(--text-tertiary);
  font-size: 0.75rem;
  cursor: pointer;
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
  font-family: var(--font-sans);
}
.fifty-min__phase-expand-btn:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

/* ── Phase body (expanded) ── */
.fifty-min__phase-body {
  padding: 0 var(--space-4) var(--space-4) var(--space-4);
  padding-left: calc(var(--space-4) + 8px + var(--space-2) + 1rem + var(--space-2));
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  animation: fifty-min-slide-down 250ms cubic-bezier(0.4, 0, 0.2, 1);
}
@keyframes fifty-min-slide-down {
  from { opacity: 0; max-height: 0; transform: translateY(-4px); }
  to   { opacity: 1; max-height: 400px; transform: translateY(0); }
}
.fifty-min__phase-detail {
  padding: var(--space-3);
  background: var(--bg-secondary);
  border-radius: var(--radius-sm);
}
.fifty-min__phase-detail--tip {
  background: var(--accent-warning-subtle);
}
.fifty-min__phase-detail-label {
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-tertiary);
  margin-bottom: var(--space-1);
}
.fifty-min__phase-detail-text {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

/* ── Phase toolbar ── */
.fifty-min__phase-toolbar {
  display: flex;
  gap: var(--space-3);
  margin-top: var(--space-2);
}
.fifty-min__add-btn {
  flex: 1;
  padding: var(--space-3);
  background: none;
  border: 1.5px dashed var(--border-primary);
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-tertiary);
  cursor: pointer;
  transition: all var(--transition-fast);
}
.fifty-min__add-btn:hover {
  border-color: var(--accent-primary);
  color: var(--accent-primary);
  background: var(--accent-primary-subtle);
}
.fifty-min__reset-btn {
  padding: var(--space-3) var(--space-5);
  background: none;
  border: 1px solid var(--border-secondary);
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--text-tertiary);
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
}
.fifty-min__reset-btn:hover {
  border-color: var(--border-primary);
  color: var(--text-secondary);
  background: var(--bg-secondary);
}

/* ── Summary Bar ── */
.fifty-min__summary {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-4);
  padding: var(--space-5) var(--space-6);
  background: var(--bg-card);
  border: 1px solid var(--border-secondary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}
.fifty-min__summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}
.fifty-min__summary-item--wide {
  flex: 0 0 auto;
}
.fifty-min__summary-value {
  font-family: var(--font-mono);
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-primary);
}
.fifty-min__summary-label {
  font-size: 0.6875rem;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.fifty-min__summary-divider {
  width: 1px;
  height: 28px;
  background: var(--border-primary);
  flex-shrink: 0;
}
.fifty-min__summary-motivational {
  flex: 1;
  min-width: 160px;
  font-size: 0.8125rem;
  font-style: italic;
  color: var(--text-tertiary);
  line-height: 1.5;
  text-align: right;
}

/* ── Guide ── */
.fifty-min__guide-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: var(--space-4) var(--space-5);
  background: var(--bg-card);
  border: 1px solid var(--border-secondary);
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  cursor: pointer;
  transition: all var(--transition-fast);
}
.fifty-min__guide-toggle:hover {
  border-color: var(--border-primary);
  box-shadow: var(--shadow-sm);
}
.fifty-min__guide-chevron {
  font-size: 0.75rem;
  color: var(--text-muted);
  transition: transform var(--transition-fast);
}
.fifty-min__guide-chevron--open {
  transform: rotate(90deg);
}
.fifty-min__guide {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding: var(--space-5);
  background: var(--bg-card);
  border: 1px solid var(--border-secondary);
  border-top: none;
  border-radius: 0 0 var(--radius-md) var(--radius-md);
  animation: fifty-min-slide-down 300ms ease;
}
.fifty-min__guide-block h4 {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--accent-primary);
  margin-bottom: var(--space-2);
}
.fifty-min__guide-block p {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  line-height: 1.7;
}

/* ── Responsive ── */
@media (max-width: 600px) {
  .fifty-min__missions {
    grid-template-columns: repeat(2, 1fr);
  }
  .fifty-min__ring-wrap {
    width: 220px;
    height: 220px;
  }
  .fifty-min__phase-header {
    flex-wrap: wrap;
    gap: var(--space-1);
  }
  .fifty-min__phase-name {
    min-width: 100px;
  }
  .fifty-min__phase-time-range {
    order: 10;
    width: 100%;
    padding-left: calc(8px + var(--space-2) + 1rem + var(--space-2));
    margin-top: 2px;
  }
  .fifty-min__summary {
    flex-direction: column;
    text-align: center;
  }
  .fifty-min__summary-divider {
    width: 40px;
    height: 1px;
  }
  .fifty-min__summary-motivational {
    text-align: center;
  }
  .fifty-min__intensity {
    flex-direction: column;
  }
}
`;
