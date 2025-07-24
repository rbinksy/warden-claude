import React, { useState } from 'react';
import { useRosterStore } from '@/stores/rosterStore';
import { useGameStore } from '@/stores/gameStore';
import { Plus, Edit2, Trash2, Users, FileText, Download, Save } from 'lucide-react';
import { Selection } from '@/types/roster';

export const RosterBuilder: React.FC = () => {
  const {
    currentRoster,
    createNewRoster,
    updateRosterName,
    updatePointsLimit,
    removeUnitFromRoster,
    updateUnitCount,
    calculateTotalPoints,
    validateRoster,
    saveRoster,
    exportRoster,
  } = useRosterStore();

  const { gameSystemData } = useGameStore();

  const [showNewRosterForm, setShowNewRosterForm] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [newRosterName, setNewRosterName] = useState('');
  const [newPointsLimit, setNewPointsLimit] = useState(1000);

  const handleCreateRoster = () => {
    if (!gameSystemData || !newRosterName.trim()) return;
    
    createNewRoster(
      newRosterName.trim(),
      gameSystemData.system.id,
      gameSystemData.system.name,
      newPointsLimit
    );
    
    setShowNewRosterForm(false);
    setNewRosterName('');
    setNewPointsLimit(1000);
  };

  const handleSaveRoster = () => {
    saveRoster();
  };

  const handleExport = (format: 'json' | 'text' | 'battlescribe') => {
    const exported = exportRoster(format);
    const blob = new Blob([exported], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentRoster?.name || 'roster'}.${format === 'battlescribe' ? 'ros' : format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!currentRoster) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Roster Selected
          </h3>
          <p className="text-gray-600 mb-6">
            Create a new roster to start building your army.
          </p>
          
          {!showNewRosterForm ? (
            <button
              onClick={() => setShowNewRosterForm(true)}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Roster</span>
            </button>
          ) : (
            <div className="max-w-md mx-auto space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Roster Name
                </label>
                <input
                  type="text"
                  value={newRosterName}
                  onChange={(e) => setNewRosterName(e.target.value)}
                  placeholder="Enter roster name..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Points Limit
                </label>
                <input
                  type="number"
                  value={newPointsLimit}
                  onChange={(e) => setNewPointsLimit(parseInt(e.target.value) || 1000)}
                  min="500"
                  max="10000"
                  step="50"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleCreateRoster}
                  disabled={!newRosterName.trim()}
                  className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 disabled:bg-gray-300 transition-colors"
                >
                  Create
                </button>
                <button
                  onClick={() => setShowNewRosterForm(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const totalPoints = calculateTotalPoints();
  const validation = validateRoster();
  const pointsPercentage = (totalPoints / currentRoster.pointsLimit) * 100;

  return (
    <div className="space-y-6">
      {/* Roster Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            {editingName ? (
              <input
                type="text"
                value={currentRoster.name}
                onChange={(e) => updateRosterName(e.target.value)}
                onBlur={() => setEditingName(false)}
                onKeyPress={(e) => e.key === 'Enter' && setEditingName(false)}
                className="text-2xl font-bold text-gray-900 bg-transparent border-b-2 border-primary-500 focus:outline-none"
                autoFocus
              />
            ) : (
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  {currentRoster.name}
                </h1>
                <button
                  onClick={() => setEditingName(true)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            )}
            
            <p className="text-gray-600 mt-1">
              {currentRoster.gameSystemName}
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={handleSaveRoster}
              className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>

            <div className="relative">
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    handleExport(e.target.value as any);
                    e.target.value = '';
                  }
                }}
                className="appearance-none px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors cursor-pointer"
              >
                <option value="">Export</option>
                <option value="text">Text Format</option>
                <option value="json">JSON Format</option>
                <option value="battlescribe">BattleScribe Format</option>
              </select>
              <Download className="w-4 h-4 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500" />
            </div>
          </div>
        </div>

        {/* Points Display */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Points Used</span>
            <span className={`text-lg font-semibold ${
              totalPoints > currentRoster.pointsLimit 
                ? 'text-red-600' 
                : totalPoints === currentRoster.pointsLimit 
                ? 'text-green-600' 
                : 'text-gray-900'
            }`}>
              {totalPoints} / {currentRoster.pointsLimit}
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                pointsPercentage > 100 
                  ? 'bg-red-500' 
                  : pointsPercentage >= 90 
                  ? 'bg-yellow-500' 
                  : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(pointsPercentage, 100)}%` }}
            />
          </div>
          
          {pointsPercentage > 100 && (
            <p className="text-sm text-red-600">
              Roster exceeds points limit by {totalPoints - currentRoster.pointsLimit} points
            </p>
          )}
        </div>

        {/* Validation Errors */}
        {!validation.isValid && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <h4 className="text-sm font-medium text-red-800 mb-2">
              Roster Issues:
            </h4>
            <ul className="list-disc list-inside space-y-1">
              {validation.errors.map((error, index) => (
                <li key={index} className="text-sm text-red-700">
                  {error}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Forces */}
      {currentRoster.forces.map(force => (
        <div key={force.id} className="bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                {force.name}
              </h3>
              <span className="text-sm text-gray-600">
                {force.catalogueName}
              </span>
            </div>
          </div>

          <div className="p-4">
            {force.selections.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600">
                  No units in this force. Add units from the Unit Browser.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {force.selections.map(selection => (
                  <SelectionRow
                    key={selection.id}
                    selection={selection}
                    onRemove={() => removeUnitFromRoster(selection.id)}
                    onUpdateCount={(count: number) => updateUnitCount(selection.id, count)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Empty State */}
      {currentRoster.forces.length === 0 && (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Units Added
          </h3>
          <p className="text-gray-600">
            Start building your roster by adding units from the Unit Browser.
          </p>
        </div>
      )}
    </div>
  );
};

interface SelectionRowProps {
  selection: Selection;
  onRemove: () => void;
  onUpdateCount: (count: number) => void;
}

const SelectionRow: React.FC<SelectionRowProps> = ({ 
  selection, 
  onRemove, 
  onUpdateCount 
}) => {
  const unitPoints = selection.costs.find(cost => cost.name === 'pts')?.value || 0;
  const totalPoints = unitPoints * selection.number;

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex-1">
        <h4 className="font-medium text-gray-900">
          {selection.customName || selection.name}
        </h4>
        <div className="flex items-center space-x-4 mt-1">
          <span className="text-sm text-gray-600">
            {unitPoints} pts each
          </span>
          {selection.categories.length > 0 && (
            <div className="flex space-x-1">
              {selection.categories.map(category => (
                <span 
                  key={category.id}
                  className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                >
                  {category.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-600">Count:</label>
          <input
            type="number"
            min="1"
            max="20"
            value={selection.number}
            onChange={(e) => onUpdateCount(parseInt(e.target.value) || 1)}
            className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div className="text-right">
          <div className="font-semibold text-gray-900">
            {totalPoints} pts
          </div>
        </div>

        <button
          onClick={onRemove}
          className="p-1 text-red-400 hover:text-red-600 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};