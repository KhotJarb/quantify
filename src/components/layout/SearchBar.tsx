'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Fuse from 'fuse.js';
import type { CalculatorSchema } from '@/types/calculator';

interface SearchBarProps {
  calculators: CalculatorSchema[];
  onSearchResults: (results: CalculatorSchema[]) => void;
  onTagFilter: (tag: string) => void;
  activeTags: string[];
  onClearTags: () => void;
}

export default function SearchBar({
  calculators,
  onSearchResults,
  onTagFilter,
  activeTags,
  onClearTags,
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Build Fuse instance
  const fuseRef = useRef<Fuse<CalculatorSchema> | null>(null);

  useEffect(() => {
    fuseRef.current = new Fuse(calculators, {
      keys: [
        { name: 'title', weight: 0.4 },
        { name: 'description', weight: 0.2 },
        { name: 'tags', weight: 0.3 },
        { name: 'category', weight: 0.1 },
      ],
      threshold: 0.35,
      includeScore: true,
      minMatchCharLength: 2,
    });
  }, [calculators]);

  // Keyboard shortcut: Ctrl+K / Cmd+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        inputRef.current?.blur();
        setQuery('');
        onSearchResults(calculators);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [calculators, onSearchResults]);

  // Debounced search
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = useCallback(
    (searchQuery: string) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        if (!searchQuery.trim()) {
          onSearchResults(calculators);
          return;
        }

        if (fuseRef.current) {
          const results = fuseRef.current.search(searchQuery);
          onSearchResults(results.map((r) => r.item));
        }
      }, 150);
    },
    [calculators, onSearchResults]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    handleSearch(value);
  };

  // Collect popular tags
  const popularTags = Array.from(
    new Set(calculators.flatMap((c) => c.tags))
  ).slice(0, 12);

  return (
    <div className="search-container">
      <div className="search-bar">
        <span className="search-bar__icon">🔍</span>
        <input
          ref={inputRef}
          type="text"
          className="search-bar__input"
          placeholder="Search calculators..."
          value={query}
          onChange={handleInputChange}
          aria-label="Search calculators"
        />
        <div className="search-bar__shortcut">
          <kbd className="search-bar__key">⌘</kbd>
          <kbd className="search-bar__key">K</kbd>
        </div>
      </div>

      {/* Tag filters */}
      {popularTags.length > 0 && (
        <div className="search-tags">
          {activeTags.length > 0 && (
            <button className="search-tag search-tag--active" onClick={onClearTags}>
              ✕ Clear
            </button>
          )}
          {popularTags.map((tag) => (
            <button
              key={tag}
              className={`search-tag ${activeTags.includes(tag) ? 'search-tag--active' : ''}`}
              onClick={() => onTagFilter(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
