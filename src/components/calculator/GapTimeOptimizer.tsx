'use client';

import { useState, useCallback, useMemo } from 'react';

/* ─── Types ─────────────────────────────────────────────────── */

type Priority = 'high' | 'medium' | 'low';
type TaskType = 'focus' | 'admin' | 'creative' | 'exercise' | 'break' | 'learning';
type EnergyLevel = 'high' | 'medium' | 'low';

interface Activity {
  id: string;
  name: string;
  duration: number;
  priority: Priority;
  type: TaskType;
  energy: EnergyLevel;
  isFixed: boolean;
  fixedHour: number;
  fixedMinute: number;
}

interface ScheduleBlock {
  activityId: string | null;
  name: string;
  type: TaskType | 'auto-break';
  startMin: number;
  endMin: number;
  priority: Priority | 'none';
  isFixed: boolean;
}

interface OptimizationStats {
  score: number;
  productiveMinutes: number;
  breakMinutes: number;
  gapsFilled: number;
  contextSwitches: number;
}

/* ─── Constants ─────────────────────────────────────────────── */

const TASK_TYPES: { id: TaskType; label: string; icon: string; color: string }[] = [
  { id: 'focus', label: 'Focus', icon: '🧠', color: '#8b7355' },
  { id: 'admin', label: 'Admin', icon: '📋', color: '#5c7a8a' },
  { id: 'creative', label: 'Creative', icon: '🎨', color: '#9b6b9e' },
  { id: 'exercise', label: 'Exercise', icon: '🏃', color: '#5a8a6a' },
  { id: 'break', label: 'Break', icon: '☕', color: '#c4944a' },
  { id: 'learning', label: 'Learning', icon: '📚', color: '#6a8ab5' },
];

const PRIORITY_COLORS: Record<Priority, string> = {
  high: '#c4944a',
  medium: '#5c7a8a',
  low: '#948b7d',
};

const DURATION_PRESETS = [15, 30, 45, 60, 90, 120];

const ENERGY_LABELS: Record<EnergyLevel, string> = {
  high: 'High',
  medium: 'Med',
  low: 'Low',
};

/* ─── Helpers ───────────────────────────────────────────────── */

function uid(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function formatTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${h12}:${m.toString().padStart(2, '0')} ${period}`;
}

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

function getEnergyScore(minuteOfDay: number): number {
  if (minuteOfDay >= 480 && minuteOfDay < 660) return 3;     // 8am–11am: peak
  if (minuteOfDay >= 660 && minuteOfDay < 780) return 2;     // 11am–1pm: moderate
  if (minuteOfDay >= 780 && minuteOfDay < 900) return 1;     // 1pm–3pm: post-lunch valley
  if (minuteOfDay >= 900 && minuteOfDay < 1020) return 2.5;  // 3pm–5pm: second peak
  return 1.5;
}

function energyLevelToNum(e: EnergyLevel): number {
  return e === 'high' ? 3 : e === 'medium' ? 2 : 1;
}

function priorityToNum(p: Priority): number {
  return p === 'high' ? 3 : p === 'medium' ? 2 : 1;
}

function getTypeColor(type: TaskType | 'auto-break'): string {
  if (type === 'auto-break') return '#c4944a';
  const found = TASK_TYPES.find((t) => t.id === type);
  return found ? found.color : '#948b7d';
}

function getTypeIcon(type: TaskType | 'auto-break'): string {
  if (type === 'auto-break') return '☕';
  const found = TASK_TYPES.find((t) => t.id === type);
  return found ? found.icon : '📌';
}

function blankActivity(): Activity {
  return {
    id: uid(),
    name: '',
    duration: 30,
    priority: 'medium',
    type: 'focus',
    energy: 'medium',
    isFixed: false,
    fixedHour: 9,
    fixedMinute: 0,
  };
}

/* ─── Time-window option generators ─────────────────────────── */

function startOptions(): { value: number; label: string }[] {
  const opts: { value: number; label: string }[] = [];
  for (let h = 5; h <= 12; h++) {
    opts.push({ value: h * 60, label: formatTime(h * 60) });
    if (h < 12) opts.push({ value: h * 60 + 30, label: formatTime(h * 60 + 30) });
  }
  return opts;
}

function endOptions(): { value: number; label: string }[] {
  const opts: { value: number; label: string }[] = [];
  for (let h = 12; h <= 23; h++) {
    opts.push({ value: h * 60, label: formatTime(h * 60) });
    if (h < 23) opts.push({ value: h * 60 + 30, label: formatTime(h * 60 + 30) });
  }
  return opts;
}

/* ─── Optimization ──────────────────────────────────────────── */

function optimizeSchedule(
  activities: Activity[],
  dayStartMin: number,
  dayEndMin: number,
): { schedule: ScheduleBlock[]; stats: OptimizationStats } {
  // 1. Build occupied-slot bitmap
  const occupied: boolean[] = new Array(dayEndMin - dayStartMin).fill(false);
  const blocks: ScheduleBlock[] = [];

  // helper to mark occupied
  const markOccupied = (from: number, to: number) => {
    for (let i = from - dayStartMin; i < to - dayStartMin; i++) {
      if (i >= 0 && i < occupied.length) occupied[i] = true;
    }
  };

  const isAvailable = (from: number, to: number): boolean => {
    if (from < dayStartMin || to > dayEndMin) return false;
    for (let i = from - dayStartMin; i < to - dayStartMin; i++) {
      if (i < 0 || i >= occupied.length || occupied[i]) return false;
    }
    return true;
  };

  // 2. Place fixed activities first
  const fixedActivities = activities.filter((a) => a.isFixed);
  const flexActivities = activities.filter((a) => !a.isFixed);

  for (const act of fixedActivities) {
    const start = act.fixedHour * 60 + act.fixedMinute;
    const end = start + act.duration;
    if (start >= dayStartMin && end <= dayEndMin) {
      markOccupied(start, end);
      blocks.push({
        activityId: act.id,
        name: act.name || 'Untitled',
        type: act.type,
        startMin: start,
        endMin: end,
        priority: act.priority,
        isFixed: true,
      });
    }
  }

  // 3. Sort flex activities: priority DESC, then energy DESC
  const sorted = [...flexActivities].sort((a, b) => {
    const pd = priorityToNum(b.priority) - priorityToNum(a.priority);
    if (pd !== 0) return pd;
    return energyLevelToNum(b.energy) - energyLevelToNum(a.energy);
  });

  // 4. Find gaps in timeline
  const findGaps = (): { start: number; end: number }[] => {
    const gaps: { start: number; end: number }[] = [];
    let gapStart = -1;
    for (let i = 0; i < occupied.length; i++) {
      if (!occupied[i]) {
        if (gapStart === -1) gapStart = i;
      } else {
        if (gapStart !== -1) {
          gaps.push({
            start: gapStart + dayStartMin,
            end: i + dayStartMin,
          });
          gapStart = -1;
        }
      }
    }
    if (gapStart !== -1) {
      gaps.push({
        start: gapStart + dayStartMin,
        end: dayEndMin,
      });
    }
    return gaps;
  };

  let gapsFilled = 0;

  // 5. Place each flex activity in the best-scoring gap
  for (const act of sorted) {
    const gaps = findGaps();
    let bestScore = -Infinity;
    let bestStart = -1;

    for (const gap of gaps) {
      const gapLen = gap.end - gap.start;
      if (gapLen < act.duration) continue; // doesn't fit

      // Try placing at every minute within the gap (step by 5 for perf)
      const step = Math.max(1, Math.min(5, gapLen - act.duration));
      const positions = Math.floor((gapLen - act.duration) / step) + 1;

      for (let p = 0; p < positions; p++) {
        const start = gap.start + p * step;
        const end = start + act.duration;
        if (end > gap.end) continue;
        if (!isAvailable(start, end)) continue;

        // Score this placement
        const midpoint = start + act.duration / 2;
        const energyCurve = getEnergyScore(midpoint);
        const actEnergy = energyLevelToNum(act.energy);

        // energy_match: how well activity energy matches the curve energy (0-3)
        const energyMatch = 3 - Math.abs(actEnergy - energyCurve);
        const priorityScore = priorityToNum(act.priority);
        const fitScore = gapLen === act.duration ? 3 : gapLen <= act.duration + 15 ? 2 : 1;

        const total = priorityScore * 3 + energyMatch * 2 + fitScore;

        if (total > bestScore) {
          bestScore = total;
          bestStart = start;
        }
      }
    }

    if (bestStart >= 0) {
      const end = bestStart + act.duration;
      markOccupied(bestStart, end);
      blocks.push({
        activityId: act.id,
        name: act.name || 'Untitled',
        type: act.type,
        startMin: bestStart,
        endMin: end,
        priority: act.priority,
        isFixed: false,
      });
      gapsFilled++;
    }
  }

  // 6. Sort blocks by start time
  blocks.sort((a, b) => a.startMin - b.startMin);

  // 7. Insert auto-breaks: after 50+ continuous work minutes
  const finalBlocks: ScheduleBlock[] = [];
  let contWorkMins = 0;

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const isBreak = block.type === 'break' || block.type === 'auto-break';
    const dur = block.endMin - block.startMin;

    if (isBreak) {
      finalBlocks.push(block);
      contWorkMins = 0;
      continue;
    }

    finalBlocks.push(block);
    contWorkMins += dur;

    // Check if break is needed after this block
    if (contWorkMins >= 50) {
      const breakDur = contWorkMins >= 120 ? 10 : 5;
      const breakStart = block.endMin;
      const breakEnd = breakStart + breakDur;

      // Only insert if the space is available (doesn't overlap next block)
      const nextBlockStart = i + 1 < blocks.length ? blocks[i + 1].startMin : dayEndMin;
      if (breakEnd <= nextBlockStart && breakEnd <= dayEndMin) {
        finalBlocks.push({
          activityId: null,
          name: breakDur === 10 ? 'Extended Break' : 'Quick Break',
          type: 'auto-break',
          startMin: breakStart,
          endMin: breakEnd,
          priority: 'none',
          isFixed: false,
        });
        contWorkMins = 0;
      }
    }
  }

  // 8. Calculate stats
  let productiveMinutes = 0;
  let breakMinutes = 0;
  let contextSwitches = 0;

  for (let i = 0; i < finalBlocks.length; i++) {
    const dur = finalBlocks[i].endMin - finalBlocks[i].startMin;
    if (finalBlocks[i].type === 'auto-break' || finalBlocks[i].type === 'break') {
      breakMinutes += dur;
    } else {
      productiveMinutes += dur;
    }
    if (i > 0 && finalBlocks[i].type !== finalBlocks[i - 1].type) {
      contextSwitches++;
    }
  }

  // Priority coverage: how many high/medium priority tasks were placed
  const totalPriority = activities.reduce((sum, a) => sum + priorityToNum(a.priority), 0);
  const placedPriority = finalBlocks
    .filter((b) => b.activityId !== null)
    .reduce((sum, b) => sum + (b.priority !== 'none' ? priorityToNum(b.priority as Priority) : 0), 0);
  const priorityCoverage = totalPriority > 0 ? placedPriority / totalPriority : 1;

  // Energy alignment score
  let energyAlignSum = 0;
  let energyAlignCount = 0;
  for (const block of finalBlocks) {
    if (block.activityId) {
      const act = activities.find((a) => a.id === block.activityId);
      if (act) {
        const mid = block.startMin + (block.endMin - block.startMin) / 2;
        const curveE = getEnergyScore(mid);
        const actE = energyLevelToNum(act.energy);
        energyAlignSum += Math.max(0, 3 - Math.abs(actE - curveE)) / 3;
        energyAlignCount++;
      }
    }
  }
  const energyAlignment = energyAlignCount > 0 ? energyAlignSum / energyAlignCount : 1;

  // Gap utilization: productive time vs total available
  const totalAvail = dayEndMin - dayStartMin;
  const gapUtil = totalAvail > 0 ? (productiveMinutes + breakMinutes) / totalAvail : 0;

  // Break compliance: at least 1 break per 2h of work
  const expectedBreaks = Math.floor(productiveMinutes / 120);
  const actualBreaks = finalBlocks.filter(
    (b) => b.type === 'auto-break' || b.type === 'break',
  ).length;
  const breakCompliance = expectedBreaks > 0 ? Math.min(1, actualBreaks / expectedBreaks) : 1;

  const score = Math.round(
    (priorityCoverage * 35 + energyAlignment * 30 + gapUtil * 20 + breakCompliance * 15) *
      (100 / 100),
  );

  return {
    schedule: finalBlocks,
    stats: {
      score: Math.min(100, Math.max(0, score)),
      productiveMinutes,
      breakMinutes,
      gapsFilled,
      contextSwitches,
    },
  };
}

/* ─── Styles ────────────────────────────────────────────────── */

const CSS = `
/* Container */
.gap-opt {
  max-width: 720px;
  margin: 0 auto;
  font-family: var(--font-sans);
  color: var(--text-primary);
}

.gap-opt__section {
  margin-bottom: var(--space-8);
}

.gap-opt__section-title {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-tertiary);
  margin-bottom: var(--space-4);
}

/* ─── Time Window ─────────────────────────────────────── */
.gap-opt__window {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  flex-wrap: wrap;
  padding: var(--space-5);
  background: var(--bg-card);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.gap-opt__window-field {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  flex: 1;
  min-width: 140px;
}

.gap-opt__window-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.gap-opt__window-select {
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--border-input);
  border-radius: var(--radius-sm);
  background: var(--bg-input);
  font-size: 0.875rem;
  font-family: var(--font-mono);
  color: var(--text-primary);
  cursor: pointer;
  outline: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23948b7d' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
  padding-right: var(--space-8);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

.gap-opt__window-select:focus {
  border-color: var(--border-focus);
  box-shadow: 0 0 0 3px var(--accent-primary-subtle);
}

.gap-opt__window-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-3);
  background: var(--accent-primary-subtle);
  color: var(--accent-primary);
  font-size: 0.8125rem;
  font-weight: 600;
  font-family: var(--font-mono);
  border-radius: var(--radius-full);
  white-space: nowrap;
}

/* ─── Activities ──────────────────────────────────────── */
.gap-opt__activities-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-4);
}

.gap-opt__activities-title {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.gap-opt__count-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  padding: 0 var(--space-2);
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  font-size: 0.6875rem;
  font-weight: 700;
  font-family: var(--font-mono);
  border-radius: var(--radius-full);
}

.gap-opt__add-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-2) var(--space-3);
  border: 1px dashed var(--border-primary);
  border-radius: var(--radius-sm);
  background: none;
  color: var(--accent-primary);
  font-size: 0.8125rem;
  font-weight: 600;
  font-family: var(--font-sans);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.gap-opt__add-btn:hover {
  background: var(--accent-primary-subtle);
  border-color: var(--accent-primary);
}

/* Card */
.gap-opt__card {
  position: relative;
  padding: var(--space-5);
  background: var(--bg-card);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  margin-bottom: var(--space-3);
  transition: box-shadow var(--transition-fast), border-color var(--transition-fast);
}

.gap-opt__card:hover {
  box-shadow: var(--shadow-md);
  border-color: var(--border-focus);
}

.gap-opt__card-delete {
  position: absolute;
  top: var(--space-3);
  right: var(--space-3);
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: var(--radius-sm);
  background: none;
  color: var(--text-muted);
  font-size: 1.125rem;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.gap-opt__card-delete:hover {
  background: var(--accent-danger-subtle);
  color: var(--accent-danger);
}

.gap-opt__card-row {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex-wrap: wrap;
  margin-bottom: var(--space-3);
}

.gap-opt__card-row:last-child {
  margin-bottom: 0;
}

.gap-opt__card-label {
  font-size: 0.6875rem;
  font-weight: 600;
  color: var(--text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  min-width: 52px;
  flex-shrink: 0;
}

.gap-opt__name-input {
  flex: 1;
  min-width: 160px;
  padding: var(--space-2) var(--space-3);
  border: 1px solid transparent;
  border-bottom: 1px solid var(--border-input);
  border-radius: 0;
  background: none;
  font-size: 0.9375rem;
  font-weight: 500;
  font-family: var(--font-sans);
  color: var(--text-primary);
  outline: none;
  transition: border-color var(--transition-fast);
}

.gap-opt__name-input::placeholder {
  color: var(--text-muted);
}

.gap-opt__name-input:focus {
  border-bottom-color: var(--accent-primary);
}

/* Duration */
.gap-opt__dur-input {
  width: 64px;
  padding: var(--space-1) var(--space-2);
  border: 1px solid var(--border-input);
  border-radius: var(--radius-sm);
  background: var(--bg-input);
  font-size: 0.875rem;
  font-family: var(--font-mono);
  color: var(--text-primary);
  outline: none;
  text-align: center;
  transition: border-color var(--transition-fast);
}

.gap-opt__dur-input:focus {
  border-color: var(--border-focus);
  box-shadow: 0 0 0 2px var(--accent-primary-subtle);
}

.gap-opt__dur-unit {
  font-size: 0.75rem;
  color: var(--text-tertiary);
  margin-left: -6px;
}

.gap-opt__dur-presets {
  display: flex;
  gap: 2px;
}

.gap-opt__dur-preset {
  padding: 2px 7px;
  border: 1px solid var(--border-secondary);
  border-radius: var(--radius-sm);
  background: none;
  font-size: 0.6875rem;
  font-family: var(--font-mono);
  color: var(--text-tertiary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.gap-opt__dur-preset:hover,
.gap-opt__dur-preset--active {
  background: var(--accent-primary-subtle);
  border-color: var(--accent-primary);
  color: var(--accent-primary);
}

/* Radio-style buttons */
.gap-opt__radio-group {
  display: flex;
  gap: 2px;
}

.gap-opt__radio-btn {
  padding: var(--space-1) var(--space-3);
  border: 1px solid var(--border-secondary);
  border-radius: var(--radius-sm);
  background: none;
  font-size: 0.75rem;
  font-weight: 500;
  font-family: var(--font-sans);
  color: var(--text-tertiary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.gap-opt__radio-btn:hover {
  border-color: var(--border-primary);
  color: var(--text-secondary);
}

.gap-opt__radio-btn--active {
  font-weight: 600;
  border-width: 1.5px;
}

/* Type buttons */
.gap-opt__type-group {
  display: flex;
  gap: var(--space-1);
  flex-wrap: wrap;
}

.gap-opt__type-btn {
  display: flex;
  align-items: center;
  gap: 3px;
  padding: 3px 8px;
  border: 1px solid var(--border-secondary);
  border-radius: var(--radius-sm);
  background: none;
  font-size: 0.6875rem;
  cursor: pointer;
  transition: all var(--transition-fast);
  color: var(--text-tertiary);
}

.gap-opt__type-btn:hover {
  border-color: var(--border-primary);
}

.gap-opt__type-btn--active {
  font-weight: 600;
  border-width: 1.5px;
}

.gap-opt__type-icon {
  font-size: 0.8125rem;
}

/* Fixed toggle */
.gap-opt__fixed-toggle {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.gap-opt__checkbox {
  width: 16px;
  height: 16px;
  accent-color: var(--accent-primary);
  cursor: pointer;
}

.gap-opt__fixed-label {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  cursor: pointer;
  user-select: none;
}

.gap-opt__fixed-time {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  margin-left: var(--space-2);
}

.gap-opt__time-select {
  padding: 2px 6px;
  border: 1px solid var(--border-input);
  border-radius: var(--radius-sm);
  background: var(--bg-input);
  font-size: 0.8125rem;
  font-family: var(--font-mono);
  color: var(--text-primary);
  cursor: pointer;
  outline: none;
}

.gap-opt__time-colon {
  font-weight: 700;
  color: var(--text-tertiary);
}

/* ─── Action button ───────────────────────────────────── */
.gap-opt__action {
  margin-bottom: var(--space-8);
}

.gap-opt__optimize-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  width: 100%;
  padding: var(--space-4) var(--space-6);
  border: none;
  border-radius: var(--radius-lg);
  background: var(--accent-primary);
  color: var(--text-inverse);
  font-size: 1rem;
  font-weight: 700;
  font-family: var(--font-sans);
  letter-spacing: -0.01em;
  cursor: pointer;
  transition: all var(--transition-base);
  box-shadow: var(--shadow-md);
}

.gap-opt__optimize-btn:hover:not(:disabled) {
  background: var(--accent-primary-hover);
  box-shadow: var(--shadow-lg);
  transform: translateY(-1px);
}

.gap-opt__optimize-btn:active:not(:disabled) {
  transform: translateY(0);
}

.gap-opt__optimize-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

@keyframes gap-opt-pulse {
  0%, 100% { box-shadow: var(--shadow-md); }
  50% { box-shadow: 0 0 0 6px var(--accent-primary-subtle), var(--shadow-lg); }
}

.gap-opt__optimize-btn:hover:not(:disabled) {
  animation: gap-opt-pulse 1.5s ease-in-out infinite;
}

/* ─── Stats ───────────────────────────────────────────── */
.gap-opt__stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-3);
  margin-bottom: var(--space-6);
}

@media (max-width: 560px) {
  .gap-opt__stats {
    grid-template-columns: repeat(2, 1fr);
  }
}

.gap-opt__stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--space-4);
  background: var(--bg-card);
  border: 1px solid var(--border-primary);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-xs);
}

.gap-opt__stat-value {
  font-size: 1.5rem;
  font-weight: 800;
  font-family: var(--font-mono);
  line-height: 1.1;
  margin-bottom: var(--space-1);
}

.gap-opt__stat-label {
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-tertiary);
  text-align: center;
}

/* ─── Timeline ────────────────────────────────────────── */
.gap-opt__timeline {
  margin-bottom: var(--space-6);
}

.gap-opt__timeline-bar {
  display: flex;
  height: 48px;
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 1px solid var(--border-primary);
  background: var(--bg-secondary);
  box-shadow: var(--shadow-sm);
}

.gap-opt__timeline-block {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: default;
  transition: opacity var(--transition-fast);
  border-right: 1px solid rgba(255,255,255,0.2);
}

.gap-opt__timeline-block:last-child {
  border-right: none;
}

.gap-opt__timeline-block:hover {
  opacity: 0.85;
}

.gap-opt__timeline-block-label {
  font-size: 0.625rem;
  font-weight: 600;
  color: white;
  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 4px;
}

.gap-opt__timeline-block--break {
  background-image: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 4px,
    rgba(255,255,255,0.15) 4px,
    rgba(255,255,255,0.15) 8px
  );
}

.gap-opt__timeline-block-lock {
  position: absolute;
  top: 2px;
  right: 3px;
  font-size: 0.5625rem;
}

.gap-opt__timeline-tooltip {
  position: absolute;
  bottom: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%);
  padding: var(--space-2) var(--space-3);
  background: var(--text-primary);
  color: var(--text-inverse);
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: var(--radius-sm);
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transition: opacity var(--transition-fast);
  z-index: 10;
  box-shadow: var(--shadow-md);
}

.gap-opt__timeline-block:hover .gap-opt__timeline-tooltip {
  opacity: 1;
}

.gap-opt__timeline-times {
  display: flex;
  justify-content: space-between;
  margin-top: var(--space-1);
  padding: 0 2px;
}

.gap-opt__timeline-time {
  font-size: 0.625rem;
  font-family: var(--font-mono);
  color: var(--text-muted);
}

/* ─── Schedule List ───────────────────────────────────── */
.gap-opt__schedule-list {
  margin-bottom: var(--space-6);
}

.gap-opt__schedule-row {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-sm);
  transition: background var(--transition-fast);
}

.gap-opt__schedule-row:nth-child(even) {
  background: var(--bg-secondary);
}

.gap-opt__schedule-row--break {
  font-style: italic;
  opacity: 0.7;
}

.gap-opt__schedule-time {
  font-size: 0.8125rem;
  font-family: var(--font-mono);
  color: var(--text-secondary);
  min-width: 80px;
  flex-shrink: 0;
}

.gap-opt__schedule-dot {
  width: 10px;
  height: 10px;
  border-radius: var(--radius-full);
  flex-shrink: 0;
}

.gap-opt__schedule-name {
  flex: 1;
  font-size: 0.875rem;
  color: var(--text-primary);
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.gap-opt__schedule-dur-badge {
  padding: 1px 8px;
  font-size: 0.6875rem;
  font-family: var(--font-mono);
  background: var(--bg-tertiary);
  color: var(--text-secondary);
  border-radius: var(--radius-full);
  flex-shrink: 0;
}

.gap-opt__schedule-pri-badge {
  padding: 1px 8px;
  font-size: 0.6875rem;
  font-weight: 600;
  color: white;
  border-radius: var(--radius-full);
  flex-shrink: 0;
  text-transform: capitalize;
}

.gap-opt__schedule-lock {
  font-size: 0.75rem;
  flex-shrink: 0;
}

/* ─── Guide ───────────────────────────────────────────── */
.gap-opt__guide {
  border: 1px solid var(--border-secondary);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.gap-opt__guide-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: var(--space-4) var(--space-5);
  border: none;
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 0.875rem;
  font-weight: 600;
  font-family: var(--font-sans);
  cursor: pointer;
  transition: background var(--transition-fast);
}

.gap-opt__guide-toggle:hover {
  background: var(--bg-tertiary);
}

.gap-opt__guide-chevron {
  font-size: 0.75rem;
  color: var(--text-tertiary);
  transition: transform var(--transition-fast);
}

.gap-opt__guide-chevron--open {
  transform: rotate(180deg);
}

.gap-opt__guide-body {
  max-height: 0;
  overflow: hidden;
  transition: max-height var(--transition-slow);
}

.gap-opt__guide-body--open {
  max-height: 800px;
}

.gap-opt__guide-content {
  padding: var(--space-5);
  font-size: 0.8125rem;
  line-height: 1.7;
  color: var(--text-secondary);
}

.gap-opt__guide-content h4 {
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-top: var(--space-4);
  margin-bottom: var(--space-1);
}

.gap-opt__guide-content h4:first-child {
  margin-top: 0;
}

.gap-opt__guide-content p {
  margin-bottom: var(--space-2);
  font-size: 0.8125rem;
}

.gap-opt__guide-content ul {
  margin-left: var(--space-5);
  margin-bottom: var(--space-2);
}

.gap-opt__guide-content li {
  margin-bottom: var(--space-1);
}

/* ─── Add-task at bottom ──────────────────────────────── */
.gap-opt__add-bottom {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  width: 100%;
  padding: var(--space-3);
  border: 2px dashed var(--border-secondary);
  border-radius: var(--radius-md);
  background: none;
  color: var(--text-tertiary);
  font-size: 0.8125rem;
  font-weight: 500;
  font-family: var(--font-sans);
  cursor: pointer;
  transition: all var(--transition-fast);
  margin-top: var(--space-2);
}

.gap-opt__add-bottom:hover {
  border-color: var(--accent-primary);
  color: var(--accent-primary);
  background: var(--accent-primary-subtle);
}

/* ─── Gap block in timeline ───────────────────────────── */
.gap-opt__timeline-gap {
  background: var(--bg-tertiary);
  opacity: 0.5;
}

/* ─── Responsive ──────────────────────────────────────── */
@media (max-width: 480px) {
  .gap-opt__window {
    flex-direction: column;
    align-items: stretch;
  }

  .gap-opt__card-row {
    flex-direction: column;
    align-items: flex-start;
  }

  .gap-opt__schedule-row {
    gap: var(--space-2);
    padding: var(--space-2) var(--space-3);
  }

  .gap-opt__schedule-time {
    min-width: 62px;
    font-size: 0.75rem;
  }
}
`;

/* ─── Component ─────────────────────────────────────────────── */

export default function GapTimeOptimizer() {
  const [startMin, setStartMin] = useState(8 * 60);
  const [endMin, setEndMin] = useState(18 * 60);
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: 'ex1',
      name: 'Morning Focus Work',
      duration: 60,
      priority: 'high',
      type: 'focus',
      energy: 'high',
      isFixed: false,
      fixedHour: 9,
      fixedMinute: 0,
    },
    {
      id: 'ex2',
      name: 'Team Standup',
      duration: 15,
      priority: 'high',
      type: 'admin',
      energy: 'low',
      isFixed: true,
      fixedHour: 9,
      fixedMinute: 30,
    },
  ]);
  const [schedule, setSchedule] = useState<ScheduleBlock[] | null>(null);
  const [stats, setStats] = useState<OptimizationStats | null>(null);
  const [guideOpen, setGuideOpen] = useState(false);
  const [hoveredBlock, setHoveredBlock] = useState<string | null>(null);

  const totalAvailable = useMemo(() => endMin - startMin, [startMin, endMin]);

  /* ── Activity CRUD ─────────────────────── */

  const updateActivity = useCallback(
    (id: string, patch: Partial<Activity>) => {
      setActivities((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));
    },
    [],
  );

  const addActivity = useCallback(() => {
    setActivities((prev) => [...prev, blankActivity()]);
  }, []);

  const removeActivity = useCallback((id: string) => {
    setActivities((prev) => prev.filter((a) => a.id !== id));
  }, []);

  /* ── Optimize ──────────────────────────── */

  const handleOptimize = useCallback(() => {
    const result = optimizeSchedule(activities, startMin, endMin);
    setSchedule(result.schedule);
    setStats(result.stats);
  }, [activities, startMin, endMin]);

  const canOptimize = activities.length >= 1;

  const scoreColor = (score: number): string => {
    if (score >= 80) return '#5a8a6a';
    if (score >= 60) return '#c4944a';
    return '#b85c5c';
  };

  /* ── Render ────────────────────────────── */

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="gap-opt">
        {/* ── Section 1: Time Window ──────────── */}
        <div className="gap-opt__section">
          <div className="gap-opt__section-title">Time Window</div>
          <div className="gap-opt__window">
            <div className="gap-opt__window-field">
              <span className="gap-opt__window-label">Start</span>
              <select
                className="gap-opt__window-select"
                value={startMin}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setStartMin(v);
                  if (v >= endMin) setEndMin(v + 60);
                }}
                aria-label="Day start time"
              >
                {startOptions().map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="gap-opt__window-field">
              <span className="gap-opt__window-label">End</span>
              <select
                className="gap-opt__window-select"
                value={endMin}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setEndMin(v);
                  if (v <= startMin) setStartMin(v - 60);
                }}
                aria-label="Day end time"
              >
                {endOptions().map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="gap-opt__window-badge">
              ⏱ {formatDuration(totalAvailable)} available
            </div>
          </div>
        </div>

        {/* ── Section 2: Activity List ────────── */}
        <div className="gap-opt__section">
          <div className="gap-opt__activities-header">
            <div className="gap-opt__activities-title">
              Your Activities
              <span className="gap-opt__count-badge">{activities.length}</span>
            </div>
            <button
              className="gap-opt__add-btn"
              onClick={addActivity}
              type="button"
              aria-label="Add new task"
            >
              + Add Task
            </button>
          </div>

          {activities.map((act) => (
            <div className="gap-opt__card" key={act.id}>
              {/* Delete */}
              <button
                className="gap-opt__card-delete"
                onClick={() => removeActivity(act.id)}
                type="button"
                aria-label={`Delete ${act.name || 'task'}`}
              >
                ×
              </button>

              {/* Name */}
              <div className="gap-opt__card-row">
                <span className="gap-opt__card-label">Name</span>
                <input
                  className="gap-opt__name-input"
                  type="text"
                  value={act.name}
                  onChange={(e) => updateActivity(act.id, { name: e.target.value })}
                  placeholder="Activity name…"
                  aria-label="Activity name"
                />
              </div>

              {/* Duration */}
              <div className="gap-opt__card-row">
                <span className="gap-opt__card-label">Duration</span>
                <input
                  className="gap-opt__dur-input"
                  type="number"
                  min={5}
                  max={480}
                  value={act.duration}
                  onChange={(e) =>
                    updateActivity(act.id, {
                      duration: Math.max(5, Math.min(480, Number(e.target.value) || 5)),
                    })
                  }
                  aria-label="Duration in minutes"
                />
                <span className="gap-opt__dur-unit">min</span>
                <div className="gap-opt__dur-presets">
                  {DURATION_PRESETS.map((d) => (
                    <button
                      key={d}
                      type="button"
                      className={`gap-opt__dur-preset${act.duration === d ? ' gap-opt__dur-preset--active' : ''}`}
                      onClick={() => updateActivity(act.id, { duration: d })}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Priority */}
              <div className="gap-opt__card-row">
                <span className="gap-opt__card-label">Priority</span>
                <div className="gap-opt__radio-group">
                  {(['high', 'medium', 'low'] as Priority[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      className={`gap-opt__radio-btn${act.priority === p ? ' gap-opt__radio-btn--active' : ''}`}
                      style={
                        act.priority === p
                          ? { background: PRIORITY_COLORS[p] + '18', borderColor: PRIORITY_COLORS[p], color: PRIORITY_COLORS[p] }
                          : undefined
                      }
                      onClick={() => updateActivity(act.id, { priority: p })}
                    >
                      {p === 'high' ? 'High' : p === 'medium' ? 'Med' : 'Low'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Type */}
              <div className="gap-opt__card-row">
                <span className="gap-opt__card-label">Type</span>
                <div className="gap-opt__type-group">
                  {TASK_TYPES.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      className={`gap-opt__type-btn${act.type === t.id ? ' gap-opt__type-btn--active' : ''}`}
                      style={
                        act.type === t.id
                          ? { background: t.color + '18', borderColor: t.color, color: t.color }
                          : undefined
                      }
                      onClick={() => updateActivity(act.id, { type: t.id })}
                    >
                      <span className="gap-opt__type-icon">{t.icon}</span>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Energy */}
              <div className="gap-opt__card-row">
                <span className="gap-opt__card-label">Energy</span>
                <div className="gap-opt__radio-group">
                  {(['high', 'medium', 'low'] as EnergyLevel[]).map((e) => (
                    <button
                      key={e}
                      type="button"
                      className={`gap-opt__radio-btn${act.energy === e ? ' gap-opt__radio-btn--active' : ''}`}
                      style={
                        act.energy === e
                          ? {
                              background:
                                e === 'high'
                                  ? 'rgba(90,138,106,0.1)'
                                  : e === 'medium'
                                    ? 'rgba(92,122,138,0.1)'
                                    : 'rgba(148,139,125,0.1)',
                              borderColor:
                                e === 'high' ? '#5a8a6a' : e === 'medium' ? '#5c7a8a' : '#948b7d',
                              color:
                                e === 'high' ? '#5a8a6a' : e === 'medium' ? '#5c7a8a' : '#948b7d',
                            }
                          : undefined
                      }
                      onClick={() => updateActivity(act.id, { energy: e })}
                    >
                      {ENERGY_LABELS[e]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fixed time toggle */}
              <div className="gap-opt__card-row">
                <span className="gap-opt__card-label">Fixed</span>
                <label className="gap-opt__fixed-toggle">
                  <input
                    type="checkbox"
                    className="gap-opt__checkbox"
                    checked={act.isFixed}
                    onChange={(e) => updateActivity(act.id, { isFixed: e.target.checked })}
                  />
                  <span className="gap-opt__fixed-label">Lock to specific time</span>
                </label>
                {act.isFixed && (
                  <div className="gap-opt__fixed-time">
                    <select
                      className="gap-opt__time-select"
                      value={act.fixedHour}
                      onChange={(e) =>
                        updateActivity(act.id, { fixedHour: Number(e.target.value) })
                      }
                      aria-label="Fixed hour"
                    >
                      {Array.from({ length: 24 }, (_, i) => (
                        <option key={i} value={i}>
                          {i.toString().padStart(2, '0')}
                        </option>
                      ))}
                    </select>
                    <span className="gap-opt__time-colon">:</span>
                    <select
                      className="gap-opt__time-select"
                      value={act.fixedMinute}
                      onChange={(e) =>
                        updateActivity(act.id, { fixedMinute: Number(e.target.value) })
                      }
                      aria-label="Fixed minute"
                    >
                      {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map((m) => (
                        <option key={m} value={m}>
                          {m.toString().padStart(2, '0')}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          ))}

          <button
            className="gap-opt__add-bottom"
            onClick={addActivity}
            type="button"
          >
            + Add another task
          </button>
        </div>

        {/* ── Section 3: Optimize Button ─────── */}
        <div className="gap-opt__action">
          <button
            className="gap-opt__optimize-btn"
            onClick={handleOptimize}
            disabled={!canOptimize}
            type="button"
          >
            ⚡ Optimize My Day
          </button>
        </div>

        {/* ── Section 4: Results ─────────────── */}
        {schedule && stats && (
          <div className="gap-opt__results">
            {/* 4a. Stats */}
            <div className="gap-opt__section">
              <div className="gap-opt__section-title">Optimization Results</div>
              <div className="gap-opt__stats">
                <div className="gap-opt__stat-card">
                  <div
                    className="gap-opt__stat-value"
                    style={{ color: scoreColor(stats.score) }}
                  >
                    {stats.score}
                  </div>
                  <div className="gap-opt__stat-label">Score</div>
                </div>
                <div className="gap-opt__stat-card">
                  <div
                    className="gap-opt__stat-value"
                    style={{ color: 'var(--accent-primary)' }}
                  >
                    {formatDuration(stats.productiveMinutes)}
                  </div>
                  <div className="gap-opt__stat-label">Productive</div>
                </div>
                <div className="gap-opt__stat-card">
                  <div
                    className="gap-opt__stat-value"
                    style={{ color: 'var(--accent-success)' }}
                  >
                    {stats.gapsFilled}
                  </div>
                  <div className="gap-opt__stat-label">Gaps Filled</div>
                </div>
                <div className="gap-opt__stat-card">
                  <div
                    className="gap-opt__stat-value"
                    style={{ color: 'var(--accent-info)' }}
                  >
                    {stats.contextSwitches}
                  </div>
                  <div className="gap-opt__stat-label">Context Switches</div>
                </div>
              </div>
            </div>

            {/* 4b. Visual Timeline */}
            <div className="gap-opt__section">
              <div className="gap-opt__section-title">Visual Timeline</div>
              <div className="gap-opt__timeline">
                <div className="gap-opt__timeline-bar">
                  {(() => {
                    // Build timeline segments including gaps
                    const segments: (ScheduleBlock & { isGap?: boolean })[] = [];
                    let cursor = startMin;

                    const sorted = [...schedule].sort((a, b) => a.startMin - b.startMin);

                    for (const block of sorted) {
                      // Insert gap before this block if there is one
                      if (block.startMin > cursor) {
                        segments.push({
                          activityId: null,
                          name: 'Free Time',
                          type: 'auto-break',
                          startMin: cursor,
                          endMin: block.startMin,
                          priority: 'none',
                          isFixed: false,
                          isGap: true,
                        });
                      }
                      segments.push(block);
                      cursor = Math.max(cursor, block.endMin);
                    }
                    // Trailing gap
                    if (cursor < endMin) {
                      segments.push({
                        activityId: null,
                        name: 'Free Time',
                        type: 'auto-break',
                        startMin: cursor,
                        endMin: endMin,
                        priority: 'none',
                        isFixed: false,
                        isGap: true,
                      });
                    }

                    return segments.map((seg, i) => {
                      const dur = seg.endMin - seg.startMin;
                      const pct = (dur / totalAvailable) * 100;
                      const color = seg.isGap
                        ? 'var(--bg-tertiary)'
                        : getTypeColor(seg.type);
                      const isBreak =
                        seg.type === 'auto-break' || seg.type === 'break';
                      const blockKey = `${seg.startMin}-${seg.endMin}-${i}`;

                      return (
                        <div
                          key={blockKey}
                          className={`gap-opt__timeline-block${
                            isBreak && !seg.isGap
                              ? ' gap-opt__timeline-block--break'
                              : ''
                          }${seg.isGap ? ' gap-opt__timeline-gap' : ''}`}
                          style={{
                            flex: `0 0 ${pct}%`,
                            backgroundColor: color,
                          }}
                          onMouseEnter={() => setHoveredBlock(blockKey)}
                          onMouseLeave={() => setHoveredBlock(null)}
                        >
                          {pct > 8 && (
                            <span className="gap-opt__timeline-block-label">
                              {seg.isGap
                                ? ''
                                : getTypeIcon(seg.type)}
                            </span>
                          )}
                          {seg.isFixed && (
                            <span className="gap-opt__timeline-block-lock">
                              🔒
                            </span>
                          )}
                          <div className="gap-opt__timeline-tooltip">
                            {seg.name} · {formatTime(seg.startMin)} –{' '}
                            {formatTime(seg.endMin)} · {formatDuration(dur)}
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
                <div className="gap-opt__timeline-times">
                  <span className="gap-opt__timeline-time">
                    {formatTime(startMin)}
                  </span>
                  <span className="gap-opt__timeline-time">
                    {formatTime(endMin)}
                  </span>
                </div>
              </div>
            </div>

            {/* 4c. Schedule List */}
            <div className="gap-opt__section">
              <div className="gap-opt__section-title">Detailed Schedule</div>
              <div className="gap-opt__schedule-list">
                {schedule.map((block, i) => {
                  const isBreak =
                    block.type === 'auto-break' || block.type === 'break';
                  const dur = block.endMin - block.startMin;

                  return (
                    <div
                      key={`${block.startMin}-${block.endMin}-${i}`}
                      className={`gap-opt__schedule-row${
                        isBreak ? ' gap-opt__schedule-row--break' : ''
                      }`}
                    >
                      <span className="gap-opt__schedule-time">
                        {formatTime(block.startMin)}
                      </span>
                      <span
                        className="gap-opt__schedule-dot"
                        style={{
                          backgroundColor: getTypeColor(block.type),
                        }}
                      />
                      <span className="gap-opt__schedule-name">
                        {getTypeIcon(block.type)} {block.name}
                      </span>
                      <span className="gap-opt__schedule-dur-badge">
                        {formatDuration(dur)}
                      </span>
                      {block.priority !== 'none' && (
                        <span
                          className="gap-opt__schedule-pri-badge"
                          style={{
                            backgroundColor:
                              PRIORITY_COLORS[block.priority as Priority],
                          }}
                        >
                          {block.priority}
                        </span>
                      )}
                      {block.isFixed && (
                        <span className="gap-opt__schedule-lock">🔒</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── Guide ──────────────────────────── */}
        <div className="gap-opt__section">
          <div className="gap-opt__guide">
            <button
              className="gap-opt__guide-toggle"
              onClick={() => setGuideOpen((v) => !v)}
              type="button"
              aria-expanded={guideOpen}
            >
              💡 How This Works
              <span
                className={`gap-opt__guide-chevron${guideOpen ? ' gap-opt__guide-chevron--open' : ''}`}
              >
                ▼
              </span>
            </button>
            <div
              className={`gap-opt__guide-body${guideOpen ? ' gap-opt__guide-body--open' : ''}`}
            >
              <div className="gap-opt__guide-content">
                <h4>🧠 Energy Curve Matching</h4>
                <p>
                  The optimizer maps your activities to the natural human energy curve throughout the day. High-energy tasks are placed during peak hours (8–11 AM and 3–5 PM), while low-energy tasks fill the post-lunch valley (1–3 PM). This alignment maximizes your cognitive output.
                </p>

                <h4>⚖️ Priority Weighting</h4>
                <p>
                  High-priority tasks are placed first and get the best time slots. The algorithm uses a composite score combining priority weight (×3), energy alignment (×2), and gap fit quality to find the mathematically optimal placement for each activity.
                </p>

                <h4>☕ Smart Break Insertion</h4>
                <p>
                  Based on research on focused work patterns, the optimizer automatically inserts 5-minute breaks after every 50+ minutes of continuous work, and 10-minute breaks after 2+ hours. This prevents cognitive fatigue and maintains sustained productivity.
                </p>

                <h4>🔒 Fixed vs Flexible Tasks</h4>
                <p>
                  Fixed tasks (meetings, appointments) are locked to their times first. Flexible tasks are then optimally placed around them in the remaining gaps, ensuring no overlaps and maximum utilization.
                </p>

                <h4>💡 Pro Tips</h4>
                <ul>
                  <li>Mark your most important work as &quot;Focus&quot; type with &quot;High&quot; energy to get the best morning slots.</li>
                  <li>Set recurring meetings as fixed tasks to build your flexible work around them.</li>
                  <li>Keep task durations realistic — the optimizer works best with accurate estimates.</li>
                  <li>A score above 80 means excellent energy alignment and coverage.</li>
                  <li>Fewer context switches means less mental overhead between tasks.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
