'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Category } from '@/types/calculator';

interface SidebarProps {
  categories: Category[];
  activeCategory: string | null;
  activeSubcategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
  onSubcategorySelect: (categoryId: string, subcategoryId: string | null) => void;
  favoritesCount?: number;
  favoritesId?: string;
}

export default function Sidebar({
  categories,
  activeCategory,
  activeSubcategory,
  onCategorySelect,
  onSubcategorySelect,
  favoritesCount = 0,
  favoritesId = '__favorites__',
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const toggleExpand = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  const handleCategoryClick = (categoryId: string) => {
    if (activeCategory === categoryId) {
      onCategorySelect(null);
    } else {
      onCategorySelect(categoryId);
    }
    toggleExpand(categoryId);
  };

  const handleSubcategoryClick = (categoryId: string, subcategoryId: string) => {
    if (activeCategory === categoryId && activeSubcategory === subcategoryId) {
      onSubcategorySelect(categoryId, null);
    } else {
      onSubcategorySelect(categoryId, subcategoryId);
    }
  };

  return (
    <>
      <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`}>
        {/* Brand */}
        <div className="sidebar__brand">
          <div className="sidebar__brand-logo">
            <Image src="/logo.svg" alt="Quantify" width={40} height={40} priority />
          </div>
          <div className="sidebar__brand-text">
            <span className="sidebar__brand-name">Quantify</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar__nav">
          {/* Favorites */}
          <div className="sidebar__section">
            <button
              className={`sidebar__category-btn ${activeCategory === favoritesId ? 'sidebar__category-btn--active' : ''}`}
              onClick={() => onCategorySelect(favoritesId)}
              title="Favorites"
            >
              <span className="sidebar__category-icon">★</span>
              <span className="sidebar__category-label">Favorites</span>
              {favoritesCount > 0 && (
                <span className="sidebar__badge">{favoritesCount}</span>
              )}
            </button>
          </div>

          {/* All calculators button */}
          <div className="sidebar__section">
            <button
              className={`sidebar__category-btn ${activeCategory === null ? 'sidebar__category-btn--active' : ''}`}
              onClick={() => onCategorySelect(null)}
              title="All Calculators"
            >
              <span className="sidebar__category-icon">📊</span>
              <span className="sidebar__category-label">All Calculators</span>
            </button>
          </div>

          {/* Category sections */}
          {categories.map((category) => {
            const isExpanded = expandedCategories.has(category.id);
            const isActive = activeCategory === category.id;

            return (
              <div key={category.id} className="sidebar__section">
                <button
                  className={`sidebar__category-btn ${isActive ? 'sidebar__category-btn--active' : ''}`}
                  onClick={() => handleCategoryClick(category.id)}
                  title={category.label}
                >
                  <span className="sidebar__category-icon">{category.icon}</span>
                  <span className="sidebar__category-label">{category.label}</span>
                  <span
                    className={`sidebar__category-chevron ${isExpanded ? 'sidebar__category-chevron--open' : ''}`}
                  >
                    ›
                  </span>
                </button>

                {/* Subcategories */}
                <div className={`sidebar__subcategories ${isExpanded ? 'sidebar__subcategories--open' : ''}`}>
                  {category.subcategories.map((sub) => (
                    <button
                      key={sub.id}
                      className={`sidebar__subcategory-btn ${
                        isActive && activeSubcategory === sub.id
                          ? 'sidebar__subcategory-btn--active'
                          : ''
                      }`}
                      onClick={() => handleSubcategoryClick(category.id, sub.id)}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Collapse toggle */}
        <button
          className="sidebar__toggle"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? '→' : '←'}
        </button>
      </aside>
    </>
  );
}
