'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import {
  CURRENCIES,
  type CalculatorSummary,
  type CategorySummary,
  type CurrencyConfig,
  type SavedScenario,
  type SuiteId,
} from '@/lib/suites';

const FAVORITES_KEY = 'quantify-favorites';
const RECENT_KEY = 'quantify-recent-v2';
const CURRENCY_KEY = 'quantify-currency-v2';
const SIDEBAR_KEY = 'quantify-sidebar-collapsed';
const SCENARIOS_KEY = 'quantify-scenarios-v2';

interface PersistedPrefs {
  currencyCode: string;
  favorites: Set<string>;
  recentSlugs: string[];
  sidebarCollapsed: boolean;
  savedScenarios: SavedScenario[];
}

const SERVER_PREFS: PersistedPrefs = {
  currencyCode: 'USD',
  favorites: new Set<string>(),
  recentSlugs: [],
  sidebarCollapsed: false,
  savedScenarios: [],
};

let clientCache: PersistedPrefs | null = null;
const listeners = new Set<() => void>();

function readClientPrefs(): PersistedPrefs {
  if (typeof window === 'undefined') return SERVER_PREFS;
  if (clientCache) return clientCache;

  let currencyCode = 'USD';
  let favorites = new Set<string>();
  let recentSlugs: string[] = [];
  let sidebarCollapsed = false;
  let savedScenarios: SavedScenario[] = [];

  try {
    const savedFavs = localStorage.getItem(FAVORITES_KEY);
    if (savedFavs) {
      const parsed = JSON.parse(savedFavs);
      if (Array.isArray(parsed)) favorites = new Set(parsed);
    }
    const savedRecent = localStorage.getItem(RECENT_KEY);
    if (savedRecent) {
      const parsed = JSON.parse(savedRecent);
      if (Array.isArray(parsed)) recentSlugs = parsed.slice(0, 8);
    }
    const savedCurrency = localStorage.getItem(CURRENCY_KEY);
    if (savedCurrency && CURRENCIES.some((c) => c.code === savedCurrency)) {
      currencyCode = savedCurrency;
    }
    sidebarCollapsed = localStorage.getItem(SIDEBAR_KEY) === 'true';

    const rawScenarios = localStorage.getItem(SCENARIOS_KEY);
    if (rawScenarios) {
      const parsed = JSON.parse(rawScenarios);
      if (Array.isArray(parsed)) {
        savedScenarios = parsed.filter(
          (item): item is SavedScenario =>
            Boolean(item && typeof item.id === 'string' && typeof item.slug === 'string')
        );
      }
    }
  } catch {
    // Ignore storage access errors
  }

  clientCache = {
    currencyCode,
    favorites,
    recentSlugs,
    sidebarCollapsed,
    savedScenarios,
  };
  return clientCache;
}

function updateClientPrefs(updater: (prev: PersistedPrefs) => PersistedPrefs) {
  const prev = readClientPrefs();
  const next = updater(prev);
  clientCache = next;
  listeners.forEach((l) => l());
}

function subscribePrefs(listener: () => void) {
  listeners.add(listener);
  const onStorage = () => {
    clientCache = null;
    listener();
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', onStorage);
  };
}

interface PreferencesContextValue {
  suiteCounts: Record<SuiteId, number>;
  catalog: CalculatorSummary[];
  categories: CategorySummary[];
  catalogLoaded: boolean;
  ensureCatalogLoaded: () => Promise<void>;
  seedCatalog: (catalog: CalculatorSummary[], categories: CategorySummary[]) => void;
  currency: CurrencyConfig;
  setCurrencyCode: (code: string) => void;
  favorites: Set<string>;
  toggleFavorite: (id: string) => void;
  recentSlugs: string[];
  recordVisit: (slug: string) => void;
  savedScenarios: SavedScenario[];
  saveScenario: (input: Omit<SavedScenario, 'id' | 'createdAt'>) => SavedScenario;
  deleteScenario: (id: string) => void;
  importScenarios: (incoming: SavedScenario[]) => number;
  commandOpen: boolean;
  setCommandOpen: (open: boolean) => void;
  openCommand: () => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

interface PreferencesProviderProps {
  suiteCounts: Record<SuiteId, number>;
  children: ReactNode;
}

let inFlightFetch: Promise<void> | null = null;

function createScenarioId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `sc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function PreferencesProvider({
  suiteCounts,
  children,
}: PreferencesProviderProps) {
  const prefs = useSyncExternalStore(
    subscribePrefs,
    readClientPrefs,
    () => SERVER_PREFS
  );
  const [catalog, setCatalog] = useState<CalculatorSummary[]>([]);
  const [categories, setCategories] = useState<CategorySummary[]>([]);
  const [commandOpen, setCommandOpen] = useState(false);

  const catalogLoaded = catalog.length > 0;

  const seedCatalog = useCallback(
    (nextCatalog: CalculatorSummary[], nextCategories: CategorySummary[]) => {
      setCatalog((prev) => (prev.length > 0 ? prev : nextCatalog));
      setCategories((prev) => (prev.length > 0 ? prev : nextCategories));
    },
    []
  );

  const ensureCatalogLoaded = useCallback(async () => {
    if (catalog.length > 0) return;
    if (!inFlightFetch) {
      inFlightFetch = fetch('/api/catalog')
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (data?.catalog) setCatalog(data.catalog);
          if (data?.categories) setCategories(data.categories);
        })
        .catch(() => {})
        .finally(() => {
          inFlightFetch = null;
        });
    }
    await inFlightFetch;
  }, [catalog.length]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const setCurrencyCode = useCallback((code: string) => {
    if (!CURRENCIES.some((c) => c.code === code)) return;
    try {
      localStorage.setItem(CURRENCY_KEY, code);
    } catch {}
    updateClientPrefs((prev) => ({ ...prev, currencyCode: code }));
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    updateClientPrefs((prev) => {
      const nextFavs = new Set(prev.favorites);
      if (nextFavs.has(id)) nextFavs.delete(id);
      else nextFavs.add(id);
      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify([...nextFavs]));
      } catch {}
      return { ...prev, favorites: nextFavs };
    });
  }, []);

  const recordVisit = useCallback((slug: string) => {
    updateClientPrefs((prev) => {
      if (prev.recentSlugs[0] === slug) return prev;
      const nextRecent = [slug, ...prev.recentSlugs.filter((s) => s !== slug)].slice(0, 8);
      try {
        localStorage.setItem(RECENT_KEY, JSON.stringify(nextRecent));
      } catch {}
      return { ...prev, recentSlugs: nextRecent };
    });
  }, []);

  const saveScenario = useCallback(
    (input: Omit<SavedScenario, 'id' | 'createdAt'>): SavedScenario => {
      const created: SavedScenario = {
        ...input,
        id: createScenarioId(),
        createdAt: new Date().toISOString(),
      };
      updateClientPrefs((prev) => {
        const nextList = [created, ...prev.savedScenarios].slice(0, 100);
        try {
          localStorage.setItem(SCENARIOS_KEY, JSON.stringify(nextList));
        } catch {}
        return { ...prev, savedScenarios: nextList };
      });
      return created;
    },
    []
  );

  const deleteScenario = useCallback((id: string) => {
    updateClientPrefs((prev) => {
      const nextList = prev.savedScenarios.filter((s) => s.id !== id);
      try {
        localStorage.setItem(SCENARIOS_KEY, JSON.stringify(nextList));
      } catch {}
      return { ...prev, savedScenarios: nextList };
    });
  }, []);

  const importScenarios = useCallback((incoming: SavedScenario[]): number => {
    const valid = incoming.filter(
      (s): s is SavedScenario =>
        Boolean(s && typeof s.slug === 'string' && typeof s.name === 'string' && s.valuesA)
    );
    if (valid.length === 0) return 0;

    let addedCount = 0;
    updateClientPrefs((prev) => {
      const existingIds = new Set(prev.savedScenarios.map((s) => s.id));
      const deduped = valid.filter((s) => !existingIds.has(s.id));
      addedCount = deduped.length;
      const nextList = [...deduped, ...prev.savedScenarios].slice(0, 100);
      try {
        localStorage.setItem(SCENARIOS_KEY, JSON.stringify(nextList));
      } catch {}
      return { ...prev, savedScenarios: nextList };
    });
    return addedCount;
  }, []);

  const setSidebarCollapsed = useCallback((collapsed: boolean) => {
    try {
      localStorage.setItem(SIDEBAR_KEY, String(collapsed));
    } catch {}
    updateClientPrefs((prev) => ({ ...prev, sidebarCollapsed: collapsed }));
  }, []);

  const openCommand = useCallback(() => {
    setCommandOpen(true);
    void ensureCatalogLoaded();
  }, [ensureCatalogLoaded]);

  const currency = useMemo(
    () => CURRENCIES.find((c) => c.code === prefs.currencyCode) ?? CURRENCIES[0],
    [prefs.currencyCode]
  );

  const value = useMemo<PreferencesContextValue>(
    () => ({
      suiteCounts,
      catalog,
      categories,
      catalogLoaded,
      ensureCatalogLoaded,
      seedCatalog,
      currency,
      setCurrencyCode,
      favorites: prefs.favorites,
      toggleFavorite,
      recentSlugs: prefs.recentSlugs,
      recordVisit,
      savedScenarios: prefs.savedScenarios,
      saveScenario,
      deleteScenario,
      importScenarios,
      commandOpen,
      setCommandOpen,
      openCommand,
      sidebarCollapsed: prefs.sidebarCollapsed,
      setSidebarCollapsed,
    }),
    [
      suiteCounts,
      catalog,
      categories,
      catalogLoaded,
      ensureCatalogLoaded,
      seedCatalog,
      currency,
      setCurrencyCode,
      prefs.favorites,
      toggleFavorite,
      prefs.recentSlugs,
      recordVisit,
      prefs.savedScenarios,
      saveScenario,
      deleteScenario,
      importScenarios,
      commandOpen,
      prefs.sidebarCollapsed,
      setSidebarCollapsed,
      openCommand,
    ]
  );

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences(): PreferencesContextValue {
  const ctx = useContext(PreferencesContext);
  if (!ctx) {
    throw new Error('usePreferences must be used within PreferencesProvider');
  }
  return ctx;
}
