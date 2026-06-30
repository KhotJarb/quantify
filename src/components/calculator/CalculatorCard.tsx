import Link from 'next/link';
import type { CalculatorSchema } from '@/types/calculator';

interface CalculatorCardProps {
  calculator: CalculatorSchema;
  index?: number;
}

export default function CalculatorCard({ calculator, index = 0 }: CalculatorCardProps) {
  return (
    <Link
      href={`/calculator/${calculator.slug}`}
      className="calc-card"
      style={{ animationDelay: `${Math.min(index * 40, 400)}ms` }}
    >
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
  );
}
