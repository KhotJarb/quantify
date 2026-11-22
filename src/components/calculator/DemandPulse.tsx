'use client';

import { useState } from 'react';
import { History, Link2, Code2, Check, Send } from 'lucide-react';
import { trackEvent } from '@/lib/telemetry';
import type { SuiteId } from '@/lib/suites';

interface DemandPulseProps {
  slug: string;
  suiteId: SuiteId;
}

const CHOICES = [
  {
    id: 'stateful_history',
    label: 'Save & track over time',
    icon: History,
  },
  {
    id: 'chained_models',
    label: 'Link multiple calculators',
    icon: Link2,
  },
  {
    id: 'embed_leads',
    label: 'Embed with lead capture',
    icon: Code2,
  },
] as const;

export default function DemandPulse({ slug, suiteId }: DemandPulseProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [noteSent, setNoteSent] = useState(false);

  const handleVote = (choiceId: string) => {
    setSelected(choiceId);
    trackEvent('demand_vote', { slug, suiteId, choice: choiceId });
  };

  const handleSendNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!note.trim()) return;
    trackEvent('demand_note', {
      slug,
      suiteId,
      choice: selected ?? 'none',
      note: note.trim().slice(0, 220),
    });
    setNote('');
    setNoteSent(true);
  };

  return (
    <section className="pulse-strip" aria-label="Product direction feedback">
      <div className="pulse-strip__head">
        <span className="pulse-strip__q">
          What capability would make this tool worth paying for?
        </span>
        <span className="pulse-strip__hint">1-click anonymous signal</span>
      </div>

      <div className="pulse-strip__options" role="group" aria-label="Feature interest">
        {CHOICES.map(({ id, label, icon: Icon }) => {
          const isPicked = selected === id;
          return (
            <button
              key={id}
              type="button"
              className={`pulse-btn ${isPicked ? 'pulse-btn--active' : ''}`}
              onClick={() => handleVote(id)}
              aria-pressed={isPicked}
            >
              {isPicked ? (
                <Check size={14} strokeWidth={2} aria-hidden="true" />
              ) : (
                <Icon size={14} strokeWidth={1.75} aria-hidden="true" />
              )}
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      {selected && !noteSent && (
        <form className="pulse-strip__note-form" onSubmit={handleSendNote}>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Optional: what decision or workflow are you solving? (or leave email for updates)"
            aria-label="Optional context on what you need"
            maxLength={220}
            className="pulse-strip__input"
          />
          <button type="submit" className="btn btn--secondary btn--sm">
            <Send size={13} strokeWidth={1.75} aria-hidden="true" />
            <span>Send</span>
          </button>
        </form>
      )}

      {noteSent && (
        <div className="pulse-strip__thanks" role="status">
          <Check size={14} strokeWidth={2} aria-hidden="true" />
          <span>Signal recorded—thank you for helping shape Quantify.</span>
        </div>
      )}
    </section>
  );
}
