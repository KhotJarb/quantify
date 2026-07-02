'use client';

import { useState, useCallback, useMemo } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import SearchBar from '@/components/layout/SearchBar';
import CalculatorCard from '@/components/calculator/CalculatorCard';
import ThemeToggle from '@/components/theme/ThemeToggle';
import { categories, calculators } from '@/data/calculators';
import { useFavorites } from '@/hooks/useFavorites';
import type { CalculatorSchema } from '@/types/calculator';

const FAVORITES_ID = '__favorites__';

export default function DashboardPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<CalculatorSchema[] | null>(null);
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const { favorites, toggle: toggleFavorite } = useFavorites();

  const showingFavorites = activeCategory === FAVORITES_ID;

  const toggleExpand = useCallback((categoryId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      next.has(categoryId) ? next.delete(categoryId) : next.add(categoryId);
      return next;
    });
  }, []);

  /* --- Filtering logic --- */
  const filteredCalculators = useMemo(() => {
    if (showingFavorites) {
      return calculators.filter((c) => favorites.has(c.id));
    }

    let items = searchResults ?? calculators;

    if (activeCategory) {
      items = items.filter((c) => c.category === activeCategory);
    }
    if (activeSubcategory) {
      items = items.filter((c) => c.subcategory === activeSubcategory);
    }
    if (activeTags.length > 0) {
      items = items.filter((c) => activeTags.every((tag) => c.tags.includes(tag)));
    }

    return items;
  }, [searchResults, activeCategory, activeSubcategory, activeTags, favorites, showingFavorites]);

  /* --- Handlers --- */
  const handleCategorySelect = useCallback((categoryId: string | null) => {
    setActiveCategory(categoryId);
    setActiveSubcategory(null);
  }, []);

  const handleSubcategorySelect = useCallback((categoryId: string, subcategoryId: string | null) => {
    setActiveCategory(categoryId);
    setActiveSubcategory(subcategoryId);
  }, []);

  const handleSearchResults = useCallback((results: CalculatorSchema[]) => {
    setSearchResults(results);
  }, []);

  const handleTagFilter = useCallback((tag: string) => {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }, []);

  const handleClearTags = useCallback(() => setActiveTags([]), []);

  /* --- Labels --- */
  const activeCategoryLabel = showingFavorites
    ? 'Favorites'
    : activeCategory
    ? categories.find((c) => c.id === activeCategory)?.label ?? 'All'
    : 'All';

  const activeSubcategoryLabel = activeSubcategory
    ? categories
        .find((c) => c.id === activeCategory)
        ?.subcategories.find((s) => s.id === activeSubcategory)?.label
    : null;

  return (
    <div className="app-layout">
      <Sidebar
        categories={categories}
        activeCategory={activeCategory}
        activeSubcategory={activeSubcategory}
        onCategorySelect={handleCategorySelect}
        onSubcategorySelect={handleSubcategorySelect}
        favoritesCount={favorites.size}
        favoritesId={FAVORITES_ID}
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
        expandedCategories={expandedCategories}
        onToggleExpand={toggleExpand}
      />

      {mobileMenuOpen && (
        <div
          className="sidebar-overlay sidebar-overlay--visible"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <main className={`app-main${sidebarCollapsed ? ' app-main--collapsed' : ''}`}>
        <header className="app-header">
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
          <SearchBar
            calculators={calculators}
            onSearchResults={handleSearchResults}
            onTagFilter={handleTagFilter}
            activeTags={activeTags}
            onClearTags={handleClearTags}
          />
          <ThemeToggle />
        </header>

        <div className="app-content">
          <div className="dashboard-header">
            <h1 className="dashboard-header__title">
              {showingFavorites
                ? '★ Favorites'
                : activeSubcategoryLabel
                ? `${activeCategoryLabel} › ${activeSubcategoryLabel}`
                : activeCategoryLabel === 'All'
                ? 'All Calculators'
                : activeCategoryLabel}
            </h1>
            <p className="dashboard-header__subtitle">
              {showingFavorites
                ? 'Your pinned calculators'
                : activeCategory
                ? `Browsing ${activeCategoryLabel.toLowerCase()} tools`
                : 'Browse our complete collection of precision calculators'}
            </p>
            <div className="dashboard-stats">
              <div className="dashboard-stat">
                <span className="dashboard-stat__value">{filteredCalculators.length}</span>
                <span>{filteredCalculators.length === 1 ? 'calculator' : 'calculators'}</span>
              </div>
              {!showingFavorites && (
                <div className="dashboard-stat">
                  <span className="dashboard-stat__value">{categories.length}</span>
                  <span>categories</span>
                </div>
              )}
            </div>
          </div>

          {filteredCalculators.length > 0 ? (
            <div className="calc-grid stagger-children">
              {filteredCalculators.map((calc, index) => (
                <CalculatorCard
                  key={calc.id}
                  calculator={calc}
                  index={index}
                  isFavorite={favorites.has(calc.id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state__icon">
                {showingFavorites ? '★' : '🔍'}
              </div>
              <h3 className="empty-state__title">
                {showingFavorites ? 'No favorites yet' : 'No calculators found'}
              </h3>
              <p className="empty-state__desc">
                {showingFavorites
                  ? 'Pin any calculator by clicking the ☆ star in its corner.'
                  : "Try adjusting your search or filters to find what you're looking for."}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
