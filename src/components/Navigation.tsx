import React from 'react';
import { Search, Users, FileText, Settings } from 'lucide-react';

interface NavigationProps {
  activeTab: 'browse' | 'roster';
  onTabChange: (tab: 'browse' | 'roster') => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    {
      id: 'browse' as const,
      name: 'Unit Browser',
      icon: Search,
      description: 'Search and browse units',
    },
    {
      id: 'roster' as const,
      name: 'Roster Builder',
      icon: Users,
      description: 'Build and manage your army',
    },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-900">
                Wargaming Roster Builder
              </h1>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-100 text-primary-700 border-b-2 border-primary-500'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                  title={tab.description}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            <button
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
            
            <div className="text-sm text-gray-600">
              <span className="font-medium">Game System:</span>
              <span className="ml-1">Warhammer 40,000 10th Edition</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};