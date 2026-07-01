'use client';

import Link from 'next/link';
import type { CalculatorSchema } from '@/types/calculator';

interface CalculatorCardProps {
  calculator: CalculatorSchema;
  index?: number;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

export default function CalculatorCard({
  calculator,
  index = 0,
  isFavorite = false,
  onToggleFavorite,
}: CalculatorCardProps) {
  return (
    <div className="calc-card-wrapper" style={{ animationDelay: `${Math.min(index * 40, 400)}ms` }}>
      <Link href={`/calculator/${calculator.slug}`} className="calc-card">
        <span className="calc-card__category">{calculator.category}</span>
        <div className="calc-card__icon">{calculator.icon}</div>
        <h3 className="calc-card__title">{calculator.title}</h3>
        <p className="calc-card__desc">{calculator.description}</p>
        <div className="calc-card__tags">
          {(calculator.tags ?? []).slice(0, 3).map((tag) => (
            <span key={tag} className="calc-card__tag">{tag}</span>
          ))}
        </div>
      </Link>

      {onToggleFavorite && (
        <button
          className={`pin-btn${isFavorite ? ' pin-btn--active' : ''}`}
          onClick={(e) => { e.preventDefault(); onToggleFavorite(calculator.id); }}
          aria-label={isFavorite ? 'Unpin calculator' : 'Pin to favorites'}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorite ? '★' : '☆'}
        </button>
      )}
    </div>
  );
}
