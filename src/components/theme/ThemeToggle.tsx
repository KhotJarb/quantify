'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';

/* ─────────────────────────────────────────────────────────────
   Quantify — ThemeToggle

   The page theme switch is instant (handled by next-themes
   disableTransitionOnChange + CSS custom properties).

   Only the toggle widget itself animates — via Framer Motion,
   which is isolated from CSS and never touches page repaints.
──────────────────────────────────────────────────────────────── */

const DURATION = 0.22;
const EASE: [number, number, number, number] = [0.4, 0, 0.2, 1];
const tween = { duration: DURATION, ease: EASE };

const SunIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="4" />
    <line x1="12" y1="2"  x2="12" y2="4"  />
    <line x1="12" y1="20" x2="12" y2="22" />
    <line x1="4.22"  y1="4.22"   x2="5.64"  y2="5.64"  />
    <line x1="18.36" y1="18.36"  x2="19.78" y2="19.78" />
    <line x1="2"  y1="12" x2="4"  y2="12" />
    <line x1="20" y1="12" x2="22" y2="12" />
    <line x1="4.22"  y1="19.78"  x2="5.64"  y2="18.36" />
    <line x1="18.36" y1="5.64"   x2="19.78" y2="4.22"  />
  </svg>
);

const MoonIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const iconVariants: Variants = {
  initial: { opacity: 0, scale: 0.5 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: DURATION * 0.8, ease: EASE },
  },
  exit: {
    opacity: 0,
    scale: 0.5,
    transition: { duration: DURATION * 0.5, ease: EASE },
  },
};

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

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
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="theme-toggle"
    >
      <motion.span
        className="theme-toggle__track"
        animate={{ backgroundColor: isDark ? '#2c2920' : '#e8e4df' }}
        transition={tween}
      >
        <motion.span
          className="theme-toggle__thumb"
          animate={{
            x: isDark ? 22 : 0,
            backgroundColor: isDark ? '#b8a88e' : '#8b7355',
          }}
          transition={tween}
        >
          <AnimatePresence mode="sync" initial={false}>
            <motion.span
              key={isDark ? 'moon' : 'sun'}
              className="theme-toggle__icon"
              variants={iconVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {isDark ? <MoonIcon /> : <SunIcon />}
            </motion.span>
          </AnimatePresence>
        </motion.span>
      </motion.span>

      <span className="sr-only">
        {isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      </span>
    </button>
  );
}
