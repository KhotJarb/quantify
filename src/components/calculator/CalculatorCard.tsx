'use client';

import Link from 'next/link';
import { Star, ArrowUpRight } from 'lucide-react';
import { CategoryIcon } from '@/components/ui/SuiteIcon';
import type { CalculatorSummary } from '@/lib/suites';

interface CalculatorCardProps {
  calculator: CalculatorSummary;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  variant?: 'default' | 'featured';
}

export default function CalculatorCard({
  calculator,
  isFavorite = false,
  onToggleFavorite,
  variant = 'default',
}: CalculatorCardProps) {
  return (
    <article className={`inst-card ${variant === 'featured' ? 'inst-card--featured' : ''}`}>
      <Link href={`/calculator/${calculator.slug}`} className="inst-card__link">
        <div className="inst-card__top">
          <span className="inst-card__icon">
            <CategoryIcon categoryId={calculator.category} size={17} />
          </span>
          <span className="inst-card__cat">{calculator.categoryLabel}</span>
          {calculator.isCustom && (
            <span className="inst-card__badge">Studio</span>
          )}
        </div>

        <h3 className="inst-card__title">{calculator.title}</h3>
        <p className="inst-card__desc">{calculator.description}</p>

        <div className="inst-card__foot">
          <div className="inst-card__tags">
            {calculator.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="inst-card__tag">
                {tag}
              </span>
            ))}
          </div>
          <span className="inst-card__go" aria-hidden="true">
            <ArrowUpRight size={15} strokeWidth={1.75} />
          </span>
        </div>
      </Link>

      {onToggleFavorite && (
        <button
          type="button"
          className={`inst-card__pin ${isFavorite ? 'inst-card__pin--active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleFavorite(calculator.id);
          }}
          aria-pressed={isFavorite}
          aria-label={isFavorite ? `Remove ${calculator.title} from saved` : `Save ${calculator.title}`}
          title={isFavorite ? 'Remove from saved' : 'Save instrument'}
        >
          <Star
            size={14}
            strokeWidth={1.85}
            fill={isFavorite ? 'currentColor' : 'none'}
            aria-hidden="true"
          />
        </button>
      )}
    </article>
  );
}
