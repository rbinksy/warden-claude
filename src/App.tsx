import React, { useEffect, useState } from 'react';
import { Navigation } from './components/Navigation';
import { UnitBrowser } from './components/UnitBrowser';
import { RosterBuilder } from './components/RosterBuilder';
import { useGameStore } from './stores/gameStore';
import { Loader2, AlertCircle } from 'lucide-react';
import './index.css';

function App() {
  const { initializeGameData, isLoading, error } = useGameStore();
  const [activeTab, setActiveTab] = useState<'browse' | 'roster'>('browse');

  useEffect(() => {
    initializeGameData();
  }, [initializeGameData]);

  // Show loading screen during initial data load
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Loading Wargaming Data
          </h2>
          <p className="text-gray-600">
            Initializing game systems and unit data...
          </p>
        </div>
      </div>
    );
  }

  // Show error screen if initialization failed
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Failed to Load Data
          </h2>
          <p className="text-gray-600 mb-6">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'browse' && <UnitBrowser />}
        {activeTab === 'roster' && <RosterBuilder />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              © 2024 Wargaming Roster Builder. Built with React, TypeScript, and Tailwind CSS.
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <a 
                href="https://github.com/BSData" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-gray-900 transition-colors"
              >
                BattleScribe Data
              </a>
              <a 
                href="https://www.battlescribe.net/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-gray-900 transition-colors"
              >
                BattleScribe App
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;