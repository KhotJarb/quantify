'use client';

import { useState, useCallback, useMemo } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import SearchBar from '@/components/layout/SearchBar';
import CalculatorCard from '@/components/calculator/CalculatorCard';
import ThemeToggle from '@/components/theme/ThemeToggle';
import { categories, calculators } from '@/data/calculators';
import type { CalculatorSchema } from '@/types/calculator';

export default function DashboardPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<CalculatorSchema[] | null>(null);
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /* --- Filtering logic --- */
  const filteredCalculators = useMemo(() => {
    let items = searchResults ?? calculators;

    // Category filter
    if (activeCategory) {
      items = items.filter((c) => c.category === activeCategory);
    }

    // Subcategory filter
    if (activeSubcategory) {
      items = items.filter((c) => c.subcategory === activeSubcategory);
    }

    // Tag filter
    if (activeTags.length > 0) {
      items = items.filter((c) =>
        activeTags.every((tag) => c.tags.includes(tag))
      );
    }

    return items;
  }, [searchResults, activeCategory, activeSubcategory, activeTags]);

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

  const handleClearTags = useCallback(() => {
    setActiveTags([]);
  }, []);

  /* --- Active category label --- */
  const activeCategoryLabel = activeCategory
    ? categories.find((c) => c.id === activeCategory)?.label ?? 'All'
    : 'All';

  const activeSubcategoryLabel = activeSubcategory
    ? categories
        .find((c) => c.id === activeCategory)
        ?.subcategories.find((s) => s.id === activeSubcategory)?.label
    : null;

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <Sidebar
        categories={categories}
        activeCategory={activeCategory}
        activeSubcategory={activeSubcategory}
        onCategorySelect={handleCategorySelect}
        onSubcategorySelect={handleSubcategorySelect}
      />

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="sidebar-overlay sidebar-overlay--visible"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="app-main">
        {/* Header */}
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

        {/* Content */}
        <div className="app-content">
          {/* Dashboard header */}
          <div className="dashboard-header">
            <h1 className="dashboard-header__title">
              {activeSubcategoryLabel
                ? `${activeCategoryLabel} › ${activeSubcategoryLabel}`
                : activeCategoryLabel === 'All'
                ? 'All Calculators'
                : activeCategoryLabel}
            </h1>
            <p className="dashboard-header__subtitle">
              {activeCategory
                ? `Browsing ${activeCategoryLabel.toLowerCase()} tools`
                : 'Browse our complete collection of precision calculators'}
            </p>
            <div className="dashboard-stats">
              <div className="dashboard-stat">
                <span className="dashboard-stat__value">{filteredCalculators.length}</span>
                <span>{filteredCalculators.length === 1 ? 'calculator' : 'calculators'}</span>
              </div>
              <div className="dashboard-stat">
                <span className="dashboard-stat__value">{categories.length}</span>
                <span>categories</span>
              </div>
            </div>
          </div>

          {/* Calculator grid */}
          {filteredCalculators.length > 0 ? (
            <div className="calc-grid stagger-children">
              {filteredCalculators.map((calc, index) => (
                <CalculatorCard
                  key={calc.id}
                  calculator={calc}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state__icon">🔍</div>
              <h3 className="empty-state__title">No calculators found</h3>
              <p className="empty-state__desc">
                Try adjusting your search or filters to find what you&apos;re looking for.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
