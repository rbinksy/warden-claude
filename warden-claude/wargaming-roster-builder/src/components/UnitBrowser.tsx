import React, { useState } from 'react';
import { SearchBar } from './SearchBar';
import { UnitCard } from './UnitCard';
import { UnitDetails } from './UnitDetails';
import { useGameStore } from '@/stores/gameStore';
import { SearchableUnit } from '@/types/battlescribe';
import { Loader2, AlertCircle } from 'lucide-react';

export const UnitBrowser: React.FC = () => {
  const {
    searchResults,
    selectedUnit,
    isLoading,
    error,
    searchQuery,
    searchFilters,
  } = useGameStore();

  const [selectedDetailUnit, setSelectedDetailUnit] = useState<SearchableUnit | null>(null);

  const handleViewDetails = (unit: SearchableUnit) => {
    setSelectedDetailUnit(unit);
  };

  const handleCloseDetails = () => {
    setSelectedDetailUnit(null);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading game data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Get filter summary for display
  const getFilterSummary = () => {
    const parts = [];
    if (searchQuery) parts.push(`"${searchQuery}"`);
    if (searchFilters.faction) parts.push(`Faction: ${searchFilters.faction}`);
    if (searchFilters.category) parts.push(`Category: ${searchFilters.category}`);
    if (searchFilters.pointsMin !== undefined || searchFilters.pointsMax !== undefined) {
      const min = searchFilters.pointsMin || 0;
      const max = searchFilters.pointsMax || '∞';
      parts.push(`Points: ${min}-${max}`);
    }
    return parts.join(' • ');
  };

  const filterSummary = getFilterSummary();

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <SearchBar />

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Units
          </h2>
          {filterSummary && (
            <p className="text-sm text-gray-600 mt-1">
              Showing results for: {filterSummary}
            </p>
          )}
        </div>
        
        <div className="text-sm text-gray-600">
          {searchResults.length} unit{searchResults.length !== 1 ? 's' : ''} found
        </div>
      </div>

      {/* Results Grid */}
      {searchResults.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            <svg
              className="w-16 h-16 mx-auto mb-4 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.674-2.64"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No units found
          </h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search criteria or filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {searchResults.map(unit => (
            <UnitCard
              key={unit.id}
              unit={unit}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      )}

      {/* Unit Details Modal */}
      <UnitDetails
        unit={selectedDetailUnit}
        onClose={handleCloseDetails}
      />
    </div>
  );
};