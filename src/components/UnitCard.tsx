import React from 'react';
import { SearchableUnit } from '@/types/battlescribe';
import { Shield, Swords, Plus, Eye } from 'lucide-react';
import { useGameStore } from '@/stores/gameStore';
import { useRosterStore } from '@/stores/rosterStore';

interface UnitCardProps {
  unit: SearchableUnit;
  onViewDetails?: (unit: SearchableUnit) => void;
}

export const UnitCard: React.FC<UnitCardProps> = ({ unit, onViewDetails }) => {
  const { selectUnit } = useGameStore();
  const { addUnitToRoster, currentRoster } = useRosterStore();

  const handleAddToRoster = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentRoster) {
      addUnitToRoster(unit);
    }
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectUnit(unit);
    onViewDetails?.(unit);
  };

  const handleCardClick = () => {
    selectUnit(unit);
    onViewDetails?.(unit);
  };

  // Extract key characteristics for display
  const movement = unit.characteristics.M || '-';
  const toughness = unit.characteristics.T || '-';
  const save = unit.characteristics.SV || '-';
  const wounds = unit.characteristics.W || '-';
  const leadership = unit.characteristics.LD || '-';
  const oc = unit.characteristics.OC || '-';

  const primaryCategory = unit.categories.find(cat => 
    ['Battleline', 'Infantry', 'Vehicle', 'Monster', 'Character'].includes(cat)
  ) || unit.categories[0];

  return (
    <div 
      className="bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
      onClick={handleCardClick}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-900 mb-1">
              {unit.name}
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                {unit.faction}
              </span>
              {primaryCategory && (
                <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                  {primaryCategory}
                </span>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-gray-900">
              {unit.points} <span className="text-sm text-gray-500">pts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Unit Profile */}
      <div className="p-4">
        <div className="grid grid-cols-6 gap-2 text-center text-sm mb-4">
          <div>
            <div className="text-xs text-gray-500 uppercase font-medium">M</div>
            <div className="font-semibold">{movement}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 uppercase font-medium">T</div>
            <div className="font-semibold">{toughness}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 uppercase font-medium">SV</div>
            <div className="font-semibold">{save}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 uppercase font-medium">W</div>
            <div className="font-semibold">{wounds}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 uppercase font-medium">LD</div>
            <div className="font-semibold">{leadership}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 uppercase font-medium">OC</div>
            <div className="font-semibold">{oc}</div>
          </div>
        </div>

        {/* Abilities Preview */}
        {unit.abilities.length > 0 && (
          <div className="mb-4">
            <div className="text-xs text-gray-500 uppercase font-medium mb-1">
              Abilities
            </div>
            <div className="text-sm text-gray-700 line-clamp-2">
              {unit.abilities[0].substring(0, 120)}
              {unit.abilities[0].length > 120 && '...'}
            </div>
          </div>
        )}

        {/* Keywords */}
        {unit.keywords.length > 0 && (
          <div className="mb-4">
            <div className="text-xs text-gray-500 uppercase font-medium mb-1">
              Keywords
            </div>
            <div className="flex flex-wrap gap-1">
              {unit.keywords.slice(0, 4).map((keyword, index) => (
                <span 
                  key={index}
                  className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                >
                  {keyword}
                </span>
              ))}
              {unit.keywords.length > 4 && (
                <span className="text-xs text-gray-500">
                  +{unit.keywords.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Categories */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {unit.categories.slice(1).map((category, index) => (
              <span 
                key={index}
                className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded"
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 pb-4 pt-0">
        <div className="flex space-x-2">
          <button
            onClick={handleViewDetails}
            className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm"
          >
            <Eye className="w-4 h-4" />
            <span>Details</span>
          </button>
          
          {currentRoster && (
            <button
              onClick={handleAddToRoster}
              className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add to Roster</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};