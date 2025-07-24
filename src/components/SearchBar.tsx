import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { useGameStore } from '@/stores/gameStore';

export const SearchBar: React.FC = () => {
  const {
    searchQuery,
    searchFilters,
    setSearchQuery,
    setSearchFilters,
    clearSearch,
    gameSystemData,
    searchService,
  } = useGameStore();

  const [showFilters, setShowFilters] = React.useState(false);

  const availableFactions = searchService?.getAvailableFactions() || [];
  const availableCategories = searchService?.getAvailableCategories() || [];
  const pointsRange = searchService?.getPointsRange() || { min: 0, max: 1000 };

  const handlePointsMinChange = (value: string) => {
    const pointsMin = value ? parseInt(value) : undefined;
    setSearchFilters({ ...searchFilters, pointsMin });
  };

  const handlePointsMaxChange = (value: string) => {
    const pointsMax = value ? parseInt(value) : undefined;
    setSearchFilters({ ...searchFilters, pointsMax });
  };

  const hasActiveFilters = Object.keys(searchFilters).some(key => 
    searchFilters[key as keyof typeof searchFilters] !== undefined
  );

  return (
    <div className="bg-white shadow rounded-lg p-4 mb-6">
      {/* Main Search Bar */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search units, abilities, weapons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md border transition-colors ${
            showFilters || hasActiveFilters
              ? 'bg-primary-50 border-primary-200 text-primary-700'
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Filter className="w-4 h-4" />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {Object.values(searchFilters).filter(v => v !== undefined).length}
            </span>
          )}
        </button>

        {(searchQuery || hasActiveFilters) && (
          <button
            onClick={clearSearch}
            className="flex items-center space-x-2 px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="border-t pt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Faction Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Faction
              </label>
              <select
                value={searchFilters.faction || ''}
                onChange={(e) => setSearchFilters({ 
                  ...searchFilters, 
                  faction: e.target.value || undefined 
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">All Factions</option>
                {availableFactions.map(faction => (
                  <option key={faction} value={faction}>
                    {faction}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={searchFilters.category || ''}
                onChange={(e) => setSearchFilters({ 
                  ...searchFilters, 
                  category: e.target.value || undefined 
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {availableCategories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Points Min */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Points
              </label>
              <input
                type="number"
                min={pointsRange.min}
                max={pointsRange.max}
                value={searchFilters.pointsMin || ''}
                onChange={(e) => handlePointsMinChange(e.target.value)}
                placeholder={`${pointsRange.min}`}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Points Max */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Points
              </label>
              <input
                type="number"
                min={pointsRange.min}
                max={pointsRange.max}
                value={searchFilters.pointsMax || ''}
                onChange={(e) => handlePointsMaxChange(e.target.value)}
                placeholder={`${pointsRange.max}`}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 pt-2 border-t">
              <span className="text-sm text-gray-600">Active filters:</span>
              {searchFilters.faction && (
                <span className="inline-flex items-center space-x-1 bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded">
                  <span>Faction: {searchFilters.faction}</span>
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-primary-600" 
                    onClick={() => setSearchFilters({ ...searchFilters, faction: undefined })}
                  />
                </span>
              )}
              {searchFilters.category && (
                <span className="inline-flex items-center space-x-1 bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded">
                  <span>Category: {searchFilters.category}</span>
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-primary-600" 
                    onClick={() => setSearchFilters({ ...searchFilters, category: undefined })}
                  />
                </span>
              )}
              {(searchFilters.pointsMin !== undefined || searchFilters.pointsMax !== undefined) && (
                <span className="inline-flex items-center space-x-1 bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded">
                  <span>
                    Points: {searchFilters.pointsMin || pointsRange.min}-{searchFilters.pointsMax || pointsRange.max}
                  </span>
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-primary-600" 
                    onClick={() => setSearchFilters({ 
                      ...searchFilters, 
                      pointsMin: undefined, 
                      pointsMax: undefined 
                    })}
                  />
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};