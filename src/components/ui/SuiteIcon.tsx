'use client';

import {
  Landmark,
  HeartPulse,
  Compass,
  Atom,
  Briefcase,
  Layers,
  Calculator,
  Coins,
  Stethoscope,
  HardHat,
  Zap,
  Cpu,
  Sigma,
  TrendingUp,
  Users,
  Package,
  Utensils,
  Plane,
  Car,
  Camera,
  Trophy,
  Gamepad2,
  Sparkles,
  Scissors,
  BookOpen,
  GraduationCap,
  Sprout,
  Scale,
  ArrowLeftRight,
  Home,
  type LucideProps,
} from 'lucide-react';
import type { SuiteId } from '@/lib/suites';

interface SuiteIconProps extends LucideProps {
  suiteId: SuiteId;
}

export function SuiteIcon({ suiteId, size = 18, strokeWidth = 1.75, ...rest }: SuiteIconProps) {
  const props = { size, strokeWidth, 'aria-hidden': true as const, ...rest };
  switch (suiteId) {
    case 'wealth':
      return <Landmark {...props} />;
    case 'health':
      return <HeartPulse {...props} />;
    case 'engineering':
      return <Compass {...props} />;
    case 'science':
      return <Atom {...props} />;
    case 'business':
      return <Briefcase {...props} />;
    case 'explore':
    default:
      return <Layers {...props} />;
  }
}

interface CategoryIconProps extends LucideProps {
  categoryId: string;
}

export function CategoryIcon({
  categoryId,
  size = 16,
  strokeWidth = 1.75,
  ...rest
}: CategoryIconProps) {
  const props = { size, strokeWidth, 'aria-hidden': true as const, ...rest };
  switch (categoryId) {
    case 'finance':
      return <Landmark {...props} />;
    case 'crypto':
      return <Coins {...props} />;
    case 'health':
      return <HeartPulse {...props} />;
    case 'medical':
      return <Stethoscope {...props} />;
    case 'engineering':
      return <Compass {...props} />;
    case 'construction':
      return <HardHat {...props} />;
    case 'energy':
      return <Zap {...props} />;
    case 'science':
      return <Atom {...props} />;
    case 'tech':
      return <Cpu {...props} />;
    case 'math':
      return <Sigma {...props} />;
    case 'business':
      return <TrendingUp {...props} />;
    case 'hr':
      return <Users {...props} />;
    case 'logistics':
      return <Package {...props} />;
    case 'hospitality':
    case 'culinary':
      return <Utensils {...props} />;
    case 'aviation':
      return <Plane {...props} />;
    case 'automotive':
      return <Car {...props} />;
    case 'photography':
      return <Camera {...props} />;
    case 'sports':
      return <Trophy {...props} />;
    case 'gaming':
      return <Gamepad2 {...props} />;
    case 'special':
      return <Sparkles {...props} />;
    case 'textile':
      return <Scissors {...props} />;
    case 'publishing':
      return <BookOpen {...props} />;
    case 'education':
      return <GraduationCap {...props} />;
    case 'agriculture':
      return <Sprout {...props} />;
    case 'legal':
      return <Scale {...props} />;
    case 'conversion':
      return <ArrowLeftRight {...props} />;
    case 'everyday':
      return <Home {...props} />;
    case 'general':
    default:
      return <Calculator {...props} />;
  }
}
