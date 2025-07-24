import { create } from 'zustand';
import { GameSystemData, SearchableUnit, SearchFilters } from '@/types/battlescribe';
import { SearchService } from '@/services/searchService';
import { dataService } from '@/services/dataService';

interface GameState {
  // Data
  gameSystemData: GameSystemData | null;
  searchService: SearchService | null;
  isLoading: boolean;
  error: string | null;

  // Search
  searchQuery: string;
  searchFilters: SearchFilters;
  searchResults: SearchableUnit[];
  selectedUnit: SearchableUnit | null;

  // UI State
  selectedFaction: string | null;
  selectedCategory: string | null;

  // Actions
  initializeGameData: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  setSearchFilters: (filters: SearchFilters) => void;
  performSearch: () => void;
  selectUnit: (unit: SearchableUnit | null) => void;
  setSelectedFaction: (faction: string | null) => void;
  setSelectedCategory: (category: string | null) => void;
  clearSearch: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  // Initial state
  gameSystemData: null,
  searchService: null,
  isLoading: false,
  error: null,
  searchQuery: '',
  searchFilters: {},
  searchResults: [],
  selectedUnit: null,
  selectedFaction: null,
  selectedCategory: null,

  // Actions
  initializeGameData: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // For development, use mock data
      const gameSystemData = await dataService.initializeWithMockData();
      const searchService = new SearchService(gameSystemData);
      
      set({
        gameSystemData,
        searchService,
        isLoading: false,
        // Initialize search results with all units
        searchResults: searchService.searchUnits(''),
      });
    } catch (error) {
      console.error('Failed to initialize game data:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to load game data',
        isLoading: false,
      });
    }
  },

  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
    // Auto-search as user types
    get().performSearch();
  },

  setSearchFilters: (filters: SearchFilters) => {
    set({ searchFilters: filters });
    get().performSearch();
  },

  performSearch: () => {
    const { searchService, searchQuery, searchFilters } = get();
    if (!searchService) return;

    const results = searchService.searchUnits(searchQuery, searchFilters);
    set({ searchResults: results });
  },

  selectUnit: (unit: SearchableUnit | null) => {
    set({ selectedUnit: unit });
  },

  setSelectedFaction: (faction: string | null) => {
    set({ 
      selectedFaction: faction,
      searchFilters: { ...get().searchFilters, faction: faction || undefined }
    });
    get().performSearch();
  },

  setSelectedCategory: (category: string | null) => {
    set({ 
      selectedCategory: category,
      searchFilters: { ...get().searchFilters, category: category || undefined }
    });
    get().performSearch();
  },

  clearSearch: () => {
    set({
      searchQuery: '',
      searchFilters: {},
      selectedFaction: null,
      selectedCategory: null,
    });
    get().performSearch();
  },
}));