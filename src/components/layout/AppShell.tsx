'use client';

import { useState, useEffect, type ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Search,
  Star,
  LayoutGrid,
  Calculator,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  Compass,
  ChevronRight,
  Workflow,
  Sliders,
} from 'lucide-react';
import ThemeToggle from '@/components/theme/ThemeToggle';
import { SuiteIcon } from '@/components/ui/SuiteIcon';
import { usePreferences } from '@/context/PreferencesContext';
import { CURRENCIES, FLAGSHIP_SUITES, SUITES, type SuiteId } from '@/lib/suites';
import { lockBodyScroll } from '@/lib/scrollLock';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface AppShellProps {
  children: ReactNode;
  activeSuite?: SuiteId | 'all' | 'favorites';
  onSelectSuite?: (suite: SuiteId | 'all' | 'favorites') => void;
  breadcrumbs?: BreadcrumbItem[];
  headerActions?: ReactNode;
}

export default function AppShell({
  children,
  activeSuite,
  onSelectSuite,
  breadcrumbs,
  headerActions,
}: AppShellProps) {
  const pathname = usePathname();
  const {
    suiteCounts,
    currency,
    setCurrencyCode,
    favorites,
    savedScenarios,
    openCommand,
    sidebarCollapsed,
    setSidebarCollapsed,
  } = usePreferences();

  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (!drawerOpen) return;
    return lockBodyScroll();
  }, [drawerOpen]);

  const exploreSuite = SUITES.find((s) => s.id === 'explore')!;
  const isHome = pathname === '/';
  const isWorkbooks = pathname === '/workbooks';
  const isStudio = pathname === '/studio';
  const isQuickCalc = pathname === '/calculator/base-calculator';
  const savedTotal = favorites.size + savedScenarios.length;

  const renderNavLink = (
    key: string,
    label: string,
    href: string,
    icon: ReactNode,
    isActive: boolean,
    badge?: number,
    suiteTarget?: SuiteId | 'all' | 'favorites'
  ) => {
    const content = (
      <>
        <span className="rail-item__icon">{icon}</span>
        <span className="rail-item__label">{label}</span>
        {badge !== undefined && badge > 0 && (
          <span className="rail-item__count">{badge}</span>
        )}
      </>
    );

    if (isHome && onSelectSuite && suiteTarget) {
      return (
        <button
          key={key}
          type="button"
          className={`rail-item ${isActive ? 'rail-item--active' : ''}`}
          onClick={() => {
            onSelectSuite(suiteTarget);
            setDrawerOpen(false);
          }}
          title={label}
        >
          {content}
        </button>
      );
    }

    return (
      <Link
        key={key}
        href={href}
        className={`rail-item ${isActive ? 'rail-item--active' : ''}`}
        onClick={() => setDrawerOpen(false)}
        title={label}
      >
        {content}
      </Link>
    );
  };

  return (
    <div className="shell">
      {/* Mobile drawer backdrop */}
      {drawerOpen && (
        <div
          className="shell-backdrop"
          onClick={() => setDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Left Precision Rail (Desktop fixed / Mobile drawer) */}
      <aside
        className={`rail ${sidebarCollapsed ? 'rail--collapsed' : ''} ${
          drawerOpen ? 'rail--open' : ''
        }`}
        aria-label="Primary navigation"
      >
        <div className="rail__brand-row">
          <Link
            href="/"
            className="rail__brand"
            onClick={() => {
              if (isHome && onSelectSuite) onSelectSuite('all');
              setDrawerOpen(false);
            }}
          >
            <span className="rail__logo">
              <Image src="/logo.svg" alt="" width={28} height={28} priority />
            </span>
            <span className="rail__wordmark">Quantify</span>
          </Link>

          <button
            type="button"
            className="rail__mobile-close"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close navigation"
          >
            <X size={18} strokeWidth={1.75} />
          </button>
        </div>

        <nav className="rail__nav">
          <div className="rail__group">
            {renderNavLink(
              'workbench',
              'Workbench',
              '/',
              <LayoutGrid size={17} strokeWidth={1.75} aria-hidden="true" />,
              isHome && activeSuite === 'all',
              undefined,
              'all'
            )}
            {renderNavLink(
              'favorites',
              'Saved',
              '/?view=favorites',
              <Star size={17} strokeWidth={1.75} aria-hidden="true" />,
              isHome && activeSuite === 'favorites',
              savedTotal,
              'favorites'
            )}
            {renderNavLink(
              'workbooks',
              'Workbooks',
              '/workbooks',
              <Workflow size={17} strokeWidth={1.75} aria-hidden="true" />,
              isWorkbooks
            )}
            {renderNavLink(
              'studio',
              'Embed Studio',
              '/studio',
              <Sliders size={17} strokeWidth={1.75} aria-hidden="true" />,
              isStudio
            )}
            {renderNavLink(
              'quick-calc',
              'Precision Keypad',
              '/calculator/base-calculator',
              <Calculator size={17} strokeWidth={1.75} aria-hidden="true" />,
              isQuickCalc
            )}
          </div>

          <div className="rail__section-head">Flagship Suites</div>
          <div className="rail__group">
            {FLAGSHIP_SUITES.map((suite) =>
              renderNavLink(
                suite.id,
                suite.label,
                `/?suite=${suite.id}`,
                <SuiteIcon suiteId={suite.id} size={17} />,
                activeSuite === suite.id,
                suiteCounts[suite.id],
                suite.id
              )
            )}
          </div>

          <div className="rail__section-head">Extended Index</div>
          <div className="rail__group">
            {renderNavLink(
              exploreSuite.id,
              exploreSuite.label,
              '/?suite=explore',
              <Compass size={17} strokeWidth={1.75} aria-hidden="true" />,
              activeSuite === 'explore',
              suiteCounts.explore,
              'explore'
            )}
          </div>
        </nav>

        <div className="rail__footer">
          <button
            type="button"
            className="rail__collapse-btn"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            aria-label={sidebarCollapsed ? 'Expand navigation rail' : 'Collapse navigation rail'}
            title={sidebarCollapsed ? 'Expand rail' : 'Collapse rail'}
          >
            {sidebarCollapsed ? (
              <PanelLeftOpen size={17} strokeWidth={1.75} />
            ) : (
              <>
                <PanelLeftClose size={17} strokeWidth={1.75} />
                <span>Collapse rail</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content Stage */}
      <div className={`stage ${sidebarCollapsed ? 'stage--rail-collapsed' : ''}`}>
        <header className="topbar">
          <div className="topbar__left">
            <button
              type="button"
              className="topbar__menu-btn"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open navigation menu"
            >
              <Menu size={20} strokeWidth={1.75} />
            </button>

            <Link href="/" className="topbar__mobile-brand">
              <Image src="/logo.svg" alt="" width={24} height={24} priority />
              <span>Quantify</span>
            </Link>

            {breadcrumbs && breadcrumbs.length > 0 && (
              <nav className="crumbs" aria-label="Breadcrumb">
                {breadcrumbs.map((crumb, i) => (
                  <span key={`${crumb.label}-${i}`} className="crumbs__segment">
                    {i > 0 && (
                      <ChevronRight
                        size={13}
                        strokeWidth={1.75}
                        className="crumbs__sep"
                        aria-hidden="true"
                      />
                    )}
                    {crumb.href ? (
                      <Link href={crumb.href} className="crumbs__link">
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className="crumbs__current">{crumb.label}</span>
                    )}
                  </span>
                ))}
              </nav>
            )}
          </div>

          <div className="topbar__right">
            <button
              type="button"
              className="cmd-trigger"
              onClick={openCommand}
              aria-label="Search calculators or evaluate math (Command K)"
            >
              <Search size={15} strokeWidth={1.75} aria-hidden="true" />
              <span className="cmd-trigger__text">Search or calculate…</span>
              <span className="cmd-trigger__kbd" aria-hidden="true">
                ⌘K
              </span>
            </button>

            <label className="currency-picker" aria-label="Display currency">
              <select
                className="currency-picker__select"
                value={currency.code}
                onChange={(e) => setCurrencyCode(e.target.value)}
                aria-label="Select currency"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} {c.symbol}
                  </option>
                ))}
              </select>
            </label>

            {headerActions}
            <ThemeToggle />
          </div>
        </header>

        <main className="stage__main">{children}</main>

        <footer className="colophon" aria-label="Site colophon">
          <span className="colophon__brand">Quantify v0.2 · Decimal.js AST Engine</span>
          <nav className="colophon__links" aria-label="Footer navigation">
            <Link href="/">Workbench</Link>
            <Link href="/workbooks">Workbooks</Link>
            <Link href="/studio">Studio</Link>
            <Link href="/methodology">Methodology</Link>
          </nav>
        </footer>
      </div>

      {/* Mobile Thumb-First Bottom Navigation */}
      <nav className="mobile-dock" aria-label="Mobile navigation">
        {isHome && onSelectSuite ? (
          <button
            type="button"
            className={`mobile-dock__btn ${
              activeSuite !== 'favorites' ? 'mobile-dock__btn--active' : ''
            }`}
            onClick={() => onSelectSuite('all')}
          >
            <LayoutGrid size={19} strokeWidth={1.75} aria-hidden="true" />
            <span>Workbench</span>
          </button>
        ) : (
          <Link href="/" className="mobile-dock__btn">
            <LayoutGrid size={19} strokeWidth={1.75} aria-hidden="true" />
            <span>Workbench</span>
          </Link>
        )}

        <button type="button" className="mobile-dock__btn" onClick={openCommand}>
          <Search size={19} strokeWidth={1.75} aria-hidden="true" />
          <span>Search</span>
        </button>

        <Link
          href="/workbooks"
          className={`mobile-dock__btn ${isWorkbooks ? 'mobile-dock__btn--active' : ''}`}
        >
          <Workflow size={19} strokeWidth={1.75} aria-hidden="true" />
          <span>Workbooks</span>
        </Link>

        {isHome && onSelectSuite ? (
          <button
            type="button"
            className={`mobile-dock__btn ${
              activeSuite === 'favorites' ? 'mobile-dock__btn--active' : ''
            }`}
            onClick={() => onSelectSuite('favorites')}
          >
            <Star size={19} strokeWidth={1.75} aria-hidden="true" />
            <span>Saved{savedTotal > 0 ? ` (${savedTotal})` : ''}</span>
          </button>
        ) : (
          <Link href="/?view=favorites" className="mobile-dock__btn">
            <Star size={19} strokeWidth={1.75} aria-hidden="true" />
            <span>Saved{savedTotal > 0 ? ` (${savedTotal})` : ''}</span>
          </Link>
        )}
      </nav>
    </div>
  );
}
