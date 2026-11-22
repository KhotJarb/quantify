'use client';

import { useTheme } from 'next-themes';
import { useSyncExternalStore } from 'react';
import { Sun, Moon } from 'lucide-react';

const emptySubscribe = () => () => {};

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!mounted) {
    return <div className="theme-toggle-skeleton" aria-hidden="true" />;
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={`theme-toggle ${isDark ? 'theme-toggle--dark' : ''}`}
    >
      <span className="theme-toggle__track">
        <span className="theme-toggle__thumb">
          {isDark ? (
            <Moon size={12} strokeWidth={2.2} aria-hidden="true" />
          ) : (
            <Sun size={12} strokeWidth={2.2} aria-hidden="true" />
          )}
        </span>
      </span>
      <span className="sr-only">
        {isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      </span>
    </button>
  );
}
