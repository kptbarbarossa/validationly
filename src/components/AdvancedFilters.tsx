import React, { useState } from 'react';
import { Button } from './LoadingStates';

export interface FilterOptions {
  searchTerm: string;
  scoreRange: [number, number];
  categories: string[];
  dateRange: {
    start: string;
    end: string;
  };
  sortBy: 'date' | 'score' | 'category' | 'favorites';
  sortOrder: 'asc' | 'desc';
  showFavoritesOnly: boolean;
}

interface AdvancedFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  availableCategories: string[];
  className?: string;
}

export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  filters,
  onFiltersChange,
  availableCategories,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilter = (key: keyof FilterOptions, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const resetFilters = () => {
    onFiltersChange({
      searchTerm: '',
      scoreRange: [0, 100],
      categories: [],
      dateRange: { start: '', end: '' },
      sortBy: 'date',
      sortOrder: 'desc',
      showFavoritesOnly: false
    });
  };

  const hasActiveFilters = () => {
    return (
      filters.searchTerm ||
      filters.scoreRange[0] > 0 ||
      filters.scoreRange[1] < 100 ||
      filters.categories.length > 0 ||
      filters.dateRange.start ||
      filters.dateRange.end ||
      filters.showFavoritesOnly ||
      filters.sortBy !== 'date' ||
      filters.sortOrder !== 'desc'
    );
  };

  return (
    <div className={`bg-slate-800/50 border border-slate-700 rounded-xl p-4 ${className}`}>
      {/* Basic Filters Row */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search ideas..."
              value={filters.searchTerm}
              onChange={(e) => updateFilter('searchTerm', e.target.value)}
              className="w-full px-4 py-2 pl-10 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
            <svg className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Quick Sort */}
          <select
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split('-');
              updateFilter('sortBy', sortBy);
              updateFilter('sortOrder', sortOrder);
            }}
            className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="score-desc">Highest Score</option>
            <option value="score-asc">Lowest Score</option>
            <option value="category-asc">Category A-Z</option>
            <option value="favorites-desc">Favorites First</option>
          </select>

          {/* Favorites Toggle */}
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.showFavoritesOnly}
              onChange={(e) => updateFilter('showFavoritesOnly', e.target.checked)}
              className="w-4 h-4 text-indigo-600 bg-slate-700 border-slate-600 rounded focus:ring-indigo-500"
            />
            <span className="text-sm text-slate-300">Favorites only</span>
          </label>
        </div>

        {/* Advanced Toggle & Reset */}
        <div className="flex items-center space-x-2">
          {hasActiveFilters() && (
            <Button variant="ghost" size="sm" onClick={resetFilters}>
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <svg className={`w-4 h-4 mr-1 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            Advanced
          </Button>
        </div>
      </div>

      {/* Advanced Filters */}
      {isExpanded && (
        <div className="mt-6 pt-6 border-t border-slate-700 space-y-6 animate-slide-down">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Score Range */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Score Range: {filters.scoreRange[0]} - {filters.scoreRange[1]}
              </label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={filters.scoreRange[0]}
                  onChange={(e) => updateFilter('scoreRange', [parseInt(e.target.value), filters.scoreRange[1]])}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={filters.scoreRange[1]}
                  onChange={(e) => updateFilter('scoreRange', [filters.scoreRange[0], parseInt(e.target.value)])}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            </div>

            {/* Categories */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Categories ({filters.categories.length} selected)
              </label>
              <div className="max-h-32 overflow-y-auto space-y-1 bg-slate-700/50 rounded-lg p-2">
                {availableCategories.map((category) => (
                  <label key={category} className="flex items-center space-x-2 cursor-pointer hover:bg-slate-600/50 rounded px-2 py-1">
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(category)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          updateFilter('categories', [...filters.categories, category]);
                        } else {
                          updateFilter('categories', filters.categories.filter(c => c !== category));
                        }
                      }}
                      className="w-4 h-4 text-indigo-600 bg-slate-700 border-slate-600 rounded focus:ring-indigo-500"
                    />
                    <span className="text-sm text-slate-300">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Date Range
              </label>
              <div className="space-y-2">
                <input
                  type="date"
                  value={filters.dateRange.start}
                  onChange={(e) => updateFilter('dateRange', { ...filters.dateRange, start: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                />
                <input
                  type="date"
                  value={filters.dateRange.end}
                  onChange={(e) => updateFilter('dateRange', { ...filters.dateRange, end: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Quick Filter Presets */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Quick Presets
            </label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => updateFilter('scoreRange', [70, 100])}
              >
                High Score (70+)
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => updateFilter('scoreRange', [40, 69])}
              >
                Medium Score (40-69)
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => updateFilter('scoreRange', [0, 39])}
              >
                Low Score (0-39)
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const lastWeek = new Date();
                  lastWeek.setDate(lastWeek.getDate() - 7);
                  updateFilter('dateRange', {
                    start: lastWeek.toISOString().split('T')[0],
                    end: new Date().toISOString().split('T')[0]
                  });
                }}
              >
                Last Week
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  const lastMonth = new Date();
                  lastMonth.setMonth(lastMonth.getMonth() - 1);
                  updateFilter('dateRange', {
                    start: lastMonth.toISOString().split('T')[0],
                    end: new Date().toISOString().split('T')[0]
                  });
                }}
              >
                Last Month
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Summary */}
      {hasActiveFilters() && (
        <div className="mt-4 pt-4 border-t border-slate-700">
          <div className="flex flex-wrap gap-2">
            {filters.searchTerm && (
              <span className="inline-flex items-center px-2 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs">
                Search: "{filters.searchTerm}"
                <button
                  onClick={() => updateFilter('searchTerm', '')}
                  className="ml-1 hover:text-indigo-100"
                >
                  ×
                </button>
              </span>
            )}
            {(filters.scoreRange[0] > 0 || filters.scoreRange[1] < 100) && (
              <span className="inline-flex items-center px-2 py-1 bg-green-500/20 text-green-300 rounded-full text-xs">
                Score: {filters.scoreRange[0]}-{filters.scoreRange[1]}
                <button
                  onClick={() => updateFilter('scoreRange', [0, 100])}
                  className="ml-1 hover:text-green-100"
                >
                  ×
                </button>
              </span>
            )}
            {filters.categories.length > 0 && (
              <span className="inline-flex items-center px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">
                {filters.categories.length} categories
                <button
                  onClick={() => updateFilter('categories', [])}
                  className="ml-1 hover:text-purple-100"
                >
                  ×
                </button>
              </span>
            )}
            {filters.showFavoritesOnly && (
              <span className="inline-flex items-center px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-xs">
                Favorites only
                <button
                  onClick={() => updateFilter('showFavoritesOnly', false)}
                  className="ml-1 hover:text-yellow-100"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedFilters;