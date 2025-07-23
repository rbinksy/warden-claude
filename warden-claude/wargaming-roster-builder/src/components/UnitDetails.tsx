import React from 'react';
import { SearchableUnit } from '@/types/battlescribe';
import { X, Plus, Shield, Swords, Target } from 'lucide-react';
import { useGameStore } from '@/stores/gameStore';
import { useRosterStore } from '@/stores/rosterStore';

interface UnitDetailsProps {
  unit: SearchableUnit | null;
  onClose: () => void;
}

export const UnitDetails: React.FC<UnitDetailsProps> = ({ unit, onClose }) => {
  const { searchService } = useGameStore();
  const { addUnitToRoster, currentRoster } = useRosterStore();

  if (!unit) return null;

  const handleAddToRoster = () => {
    if (currentRoster) {
      addUnitToRoster(unit);
    }
  };

  const similarUnits = searchService?.getSimilarUnits(unit, 3) || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {unit.name}
            </h2>
            <div className="flex items-center space-x-3">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {unit.faction}
              </span>
              {unit.categories.map((category, index) => (
                <span 
                  key={index}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900">
                {unit.points}
              </div>
              <div className="text-sm text-gray-500">points</div>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="p-6 space-y-6">
            {/* Unit Profile */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Unit Profile
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-6 gap-4 text-center">
                  {Object.entries(unit.characteristics).map(([key, value]) => (
                    <div key={key} className="border-r border-gray-300 last:border-r-0">
                      <div className="text-sm font-medium text-gray-500 uppercase mb-1">
                        {key}
                      </div>
                      <div className="text-xl font-bold text-gray-900">
                        {value || '-'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Abilities */}
            {unit.abilities.length > 0 && (
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Abilities
                </h3>
                <div className="space-y-3">
                  {unit.abilities.map((ability, index) => (
                    <div key={index} className="bg-blue-50 rounded-lg p-4">
                      <div className="text-sm text-blue-900">
                        {ability}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Rules */}
            {unit.rules.length > 0 && (
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Special Rules
                </h3>
                <div className="space-y-3">
                  {unit.rules.map((rule, index) => (
                    <div key={index} className="bg-yellow-50 rounded-lg p-4">
                      <div className="text-sm text-yellow-900">
                        {rule}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Keywords */}
            {unit.keywords.length > 0 && (
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Keywords
                </h3>
                <div className="flex flex-wrap gap-2">
                  {unit.keywords.map((keyword, index) => (
                    <span 
                      key={index}
                      className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Similar Units */}
            {similarUnits.length > 0 && (
              <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Similar Units
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {similarUnits.map(similarUnit => (
                    <div 
                      key={similarUnit.id}
                      className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() => {
                        // Replace current unit with similar unit
                        onClose();
                        // You would typically call a function to show details of the similar unit
                      }}
                    >
                      <div className="font-medium text-gray-900 mb-1">
                        {similarUnit.name}
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        {similarUnit.faction}
                      </div>
                      <div className="text-lg font-bold text-blue-600">
                        {similarUnit.points} pts
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Unit Type: {unit.type} • Categories: {unit.categories.join(', ')}
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
              
              {currentRoster && (
                <button
                  onClick={handleAddToRoster}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add to Roster</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};