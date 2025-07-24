# Wargaming Roster Builder - Comprehensive Technical Design Document

## Executive Summary

The Wargaming Roster Builder is a modern web application designed to parse BattleScribe game data and provide an intuitive interface for searching units and building army rosters. Built with React 18, TypeScript, and modern web technologies, it offers a responsive, performant, and user-friendly alternative to traditional roster building tools with comprehensive search capabilities and multi-format export functionality.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Data Models & Type System](#data-models--type-system)
5. [Core Services Architecture](#core-services-architecture)
6. [State Management](#state-management)
7. [Component Architecture](#component-architecture)
8. [Search & Filtering System](#search--filtering-system)
9. [Roster Management System](#roster-management-system)
10. [Testing Strategy](#testing-strategy)
11. [Performance Considerations](#performance-considerations)
12. [Security & Validation](#security--validation)
13. [Deployment Architecture](#deployment-architecture)
14. [Technical Debt & Future Enhancements](#technical-debt--future-enhancements)
15. [Development Guidelines](#development-guidelines)

## Architecture Overview

The application follows a **Layered Architecture** pattern with clear separation of concerns and unidirectional data flow:

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                       │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────────┐ │
│  │ UnitBrowser │ │ RosterBuilder│ │    Navigation           │ │
│  │ SearchBar   │ │ UnitCard     │ │    UnitDetails          │ │
│  └─────────────┘ └─────────────┘ └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                   State Management                          │
│  ┌─────────────┐ ┌─────────────┐                           │
│  │ Game Store  │ │RosterStore  │                           │
│  │ (Zustand)   │ │ (Zustand)   │                           │
│  └─────────────┘ └─────────────┘                           │
└─────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                    Service Layer                            │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────────┐ │
│  │XML Parser   │ │SearchService│ │   Data Service          │ │
│  │ Service     │ │ (Fuse.js)   │ │   (Mock/Real)           │ │
│  └─────────────┘ └─────────────┘ └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                     Data Layer                              │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────────┐ │
│  │BattleScribe │ │ Local Storage│ │    Type Definitions     │ │
│  │    XML      │ │   (Rosters)  │ │   (TypeScript)          │ │
│  └─────────────┘ └─────────────┘ └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Key Architectural Principles

1. **Separation of Concerns**: Clear boundaries between UI, state, services, and data
2. **Unidirectional Data Flow**: Predictable state updates and data propagation
3. **Type Safety**: Comprehensive TypeScript coverage with strict mode
4. **Component Composition**: Reusable, atomic components with single responsibilities
5. **Service-Oriented**: Business logic encapsulated in dedicated service classes

## Technology Stack

### Core Frontend Technologies
- **React 18.2.0** - Modern React with concurrent features and automatic batching
- **TypeScript 5.2+** - Type safety with strict mode enabled
- **Vite 4.5.0** - Fast build tool with Hot Module Replacement (HMR)
- **Tailwind CSS 3.3.5** - Utility-first CSS framework with custom design system
- **React Router DOM 6.20.1** - Client-side routing for SPA navigation

### State Management & Data
- **Zustand 4.4.7** - Lightweight state management with minimal boilerplate
- **fast-xml-parser 4.3.2** - High-performance XML parsing for BattleScribe data
- **Fuse.js 7.0.0** - Fuzzy search with advanced filtering capabilities
- **clsx 2.0.0** - Conditional CSS class concatenation utility

### Development & Testing
- **Vitest 1.0.4** - Fast unit testing framework with native ES modules support
- **React Testing Library 14.1.2** - Component testing with user-centric approach
- **jsdom 23.0.1** - DOM implementation for testing environment
- **ESLint 8.53.0** - Code linting with TypeScript and React plugins
- **Lucide React 0.294.0** - Consistent icon system with tree-shaking support

### Build & Optimization
- **TypeScript Compiler** - Type checking and transpilation
- **PostCSS 8.4.31** - CSS processing with autoprefixing
- **Vite Build System** - Optimized production builds with code splitting

## Project Structure

```
src/
├── components/              # React components (817 lines total)
│   ├── Navigation.tsx       # Tab navigation (80 lines)
│   ├── SearchBar.tsx        # Search & filtering UI (203 lines)
│   ├── UnitCard.tsx         # Unit display card (182 lines)
│   ├── UnitDetails.tsx      # Unit details modal (212 lines)
│   ├── UnitBrowser.tsx      # Unit browsing interface (142 lines)
│   └── RosterBuilder.tsx    # Roster management (373 lines)
├── services/                # Business logic (954 lines total)
│   ├── xmlParser.ts         # BattleScribe XML parsing (388 lines)
│   ├── searchService.ts     # Search and filtering (235 lines)
│   └── dataService.ts       # Data management (331 lines)
├── stores/                  # State management (526 lines total)
│   ├── gameStore.ts         # Game data and search state (120 lines)
│   └── rosterStore.ts       # Roster management state (406 lines)
├── types/                   # TypeScript definitions (304 lines total)
│   ├── battlescribe.ts      # BattleScribe data types (249 lines)
│   └── roster.ts            # Roster-specific types (55 lines)
├── test/                    # Test files (295 lines total)
│   ├── components/          # Component tests
│   │   └── UnitCard.test.tsx # Unit card testing (83 lines)
│   ├── searchService.test.ts # Search service tests (212 lines)
│   └── setup.ts             # Test configuration
├── App.tsx                  # Main application component (59 lines)
├── main.tsx                 # Application entry point (10 lines)
└── index.css                # Global styles and Tailwind imports
```

**Total Codebase Size**: ~2,965 lines of TypeScript/TSX code

## Data Models & Type System

### Core BattleScribe Type Hierarchy

The application implements a comprehensive type system mapping BattleScribe's XML schema:

```typescript
// Primary game system interface
interface GameSystem {
  id: string;
  name: string;
  revision: number;
  battleScribeVersion: string;
  costTypes: CostType[];           // Points, CP, etc.
  profileTypes: ProfileType[];     // Unit stat templates
  categoryEntries: CategoryEntry[]; // Force organization
  publications: Publication[];     // Rulebooks
  sharedRules: Rule[];            // Global rules
}

// Unit data structure
interface Unit {
  id: string;
  name: string;
  type: 'unit' | 'model' | 'upgrade';
  costs: Cost[];                  // Point costs
  profiles: Profile[];            // Stat profiles
  abilities: Ability[];           // Special rules
  categoryLinks: CategoryLink[];  // Categories (HQ, Troops, etc.)
  weapons: Weapon[];             // Equipment
  faction: string;               // Army affiliation
}

// Weapon system
interface Weapon {
  id: string;
  name: string;
  profiles: WeaponProfile[];      // Different firing modes
  abilities: Ability[];           // Weapon special rules
}
```

### Search-Optimized Data Structure

```typescript
interface SearchableUnit {
  id: string;
  name: string;
  faction: string;
  categories: string[];           // Searchable categories
  points: number;                // Primary cost
  abilities: string[];           // Ability names for search
  keywords: string[];            // Unit keywords
  characteristics: Record<string, string>; // M, T, SV, W, LD, OC
}

interface SearchFilters {
  faction?: string;
  category?: string;
  pointsMin?: number;
  pointsMax?: number;
  keywords?: string[];
}
```

### Roster Management Types

```typescript
interface Roster {
  id: string;
  name: string;
  gameSystemId: string;
  gameSystemName: string;
  pointsLimit: number;
  totalPoints: number;
  forces: Force[];               // Detachments/formations
  createdAt: Date;
  updatedAt: Date;
}

interface Force {
  id: string;
  name: string;
  catalogueId: string;
  selections: Selection[];        // Units in this force
}

interface Selection {
  id: string;
  name: string;
  unitId: string;
  count: number;
  costs: Cost[];
  profiles: Profile[];
}
```

## Core Services Architecture

### Data Service Pattern

The `DataService` implements a **Singleton Pattern** with fallback capabilities:

```typescript
class DataService {
  private static instance: DataService;
  private gameSystemData: GameSystemData | null = null;

  // Singleton access
  static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  // Primary data loading with fallback strategy
  async loadGameSystemData(): Promise<GameSystemData> {
    try {
      // Attempt real BattleScribe data loading
      return await this.loadRealData();
    } catch (error) {
      console.warn('Falling back to mock data:', error);
      return this.generateMockData();
    }
  }
}
```

**Key Features:**
- **Mock Data Generation**: Comprehensive test data including Warhammer 40K units
- **Error Resilience**: Graceful fallback when BattleScribe files unavailable
- **Data Transformation**: Converts XML data to searchable formats
- **Caching Strategy**: In-memory caching with lazy loading

### XML Parser Service

The `BattleScribeParser` handles complex XML parsing with comprehensive schema support:

```typescript
class BattleScribeParser {
  private xmlParser: XMLParser;

  constructor() {
    this.xmlParser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      allowBooleanAttributes: true,
      parseTagValue: false,
      trimValues: true
    });
  }

  // Parse game system files (.gst)
  parseGameSystem(xmlContent: string): GameSystem {
    const parsed = this.xmlParser.parse(xmlContent);
    return this.transformGameSystemData(parsed.gameSystem);
  }

  // Parse catalogue files (.cat)
  parseCatalogue(xmlContent: string, gameSystemId: string): Unit[] {
    const parsed = this.xmlParser.parse(xmlContent);
    return this.extractUnitsFromCatalogue(parsed.catalogue, gameSystemId);
  }
}
```

**Parsing Capabilities:**
- **Complete Schema Support**: Handles all BattleScribe XML elements
- **Reference Resolution**: Links between game system and catalogue data
- **Nested Data Extraction**: Profiles, abilities, weapons, constraints
- **Error Handling**: Graceful parsing with missing data fallbacks
- **Type Safety**: Full TypeScript integration with parsed data

### Search Service Architecture

The `SearchService` implements advanced search with **Fuse.js** integration:

```typescript
class SearchService {
  private fuse: Fuse<SearchableUnit>;
  private allUnits: SearchableUnit[];

  constructor(units: SearchableUnit[]) {
    this.allUnits = units;
    this.fuse = new Fuse(units, {
      keys: [
        { name: 'name', weight: 0.4 },
        { name: 'faction', weight: 0.2 },
        { name: 'categories', weight: 0.15 },
        { name: 'abilities', weight: 0.15 },
        { name: 'keywords', weight: 0.1 }
      ],
      threshold: 0.3,
      includeScore: true,
      includeMatches: true,
      ignoreLocation: true,
      useExtendedSearch: true
    });
  }

  // Primary search method with filtering
  search(query: string, filters: SearchFilters = {}): SearchableUnit[] {
    let results = query ? this.fuse.search(query) : this.allUnits.map(unit => ({ item: unit }));
    return this.applyFilters(results, filters);
  }
}
```

**Search Features:**
- **Fuzzy Text Matching**: Typo-tolerant search with configurable threshold
- **Weighted Scoring**: Prioritizes matches in unit names over keywords
- **Multi-Criteria Filtering**: Faction, category, points range, keywords
- **Similarity Algorithm**: Recommends related units based on characteristics
- **Performance Optimization**: Pre-computed search index with efficient filtering

## State Management

### Zustand Store Architecture

The application uses **Zustand** for lightweight, TypeScript-first state management:

#### Game Store (120 lines)

```typescript
interface GameState {
  // Data state
  gameSystemData: GameSystemData | null;
  searchService: SearchService | null;
  
  // Search state
  searchQuery: string;
  searchFilters: SearchFilters;
  searchResults: SearchableUnit[];
  selectedUnit: SearchableUnit | null;
  
  // UI state
  isLoading: boolean;
  error: string | null;
  
  // Actions
  initializeGameData: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  setSearchFilters: (filters: Partial<SearchFilters>) => void;
  performSearch: () => void;
  selectUnit: (unit: SearchableUnit | null) => void;
  clearError: () => void;
}
```

**Key Responsibilities:**
- **Data Initialization**: Async loading of game system data
- **Search Management**: Real-time search with automatic result updates
- **Error Handling**: User-friendly error messages with recovery options
- **Performance**: Automatic search triggering on query/filter changes

#### Roster Store (406 lines)

```typescript
interface RosterState {
  // Roster data
  currentRoster: Roster | null;
  savedRosters: Roster[];
  isEditingRoster: boolean;
  
  // Actions
  createNewRoster: (name: string, gameSystemId: string, pointsLimit: number) => void;
  loadRoster: (rosterId: string) => void;
  saveRoster: () => void;
  deleteRoster: (rosterId: string) => void;
  
  // Unit management
  addUnitToRoster: (unit: SearchableUnit, forceId?: string) => void;
  removeUnitFromRoster: (selectionId: string) => void;
  updateUnitCount: (selectionId: string, count: number) => void;
  
  // Export functionality
  exportRoster: (format: 'json' | 'text' | 'battlescribe') => string;
  
  // Validation
  validateRoster: () => string[];
  calculateTotalPoints: () => number;
}
```

**Advanced Features:**
- **Automatic Persistence**: Local storage integration with change tracking
- **Points Calculation**: Real-time cost computation with modifiers
- **Validation Engine**: Rule checking for legal army construction
- **Export System**: Multiple format support including BattleScribe XML
- **Force Organization**: Detachment-based army structure

### State Flow Patterns

```
User Input → Component → Store Action → Service Call → State Update → Component Re-render
```

**Example: Search Flow**
1. User types in `SearchBar` component
2. `setSearchQuery` action called on `gameStore`
3. Store automatically triggers `performSearch`
4. `SearchService` processes query with filters
5. Store updates `searchResults` state
6. `UnitBrowser` component re-renders with new results

## Component Architecture

### Component Design Principles

- **Single Responsibility**: Each component has one clear purpose
- **Composition over Inheritance**: Building complex UI from simple components
- **Props Interface Design**: Explicit TypeScript interfaces for all props
- **Accessibility First**: ARIA labels, keyboard navigation, semantic HTML

### Key Components Analysis

#### Navigation Component (80 lines)
```typescript
interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  gameSystemName?: string;
}
```
- **Tab Management**: Controlled component pattern for navigation state
- **Game System Display**: Shows currently loaded data source
- **Responsive Design**: Mobile-friendly tab layout

#### SearchBar Component (203 lines)
```typescript
interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchFilters: SearchFilters;
  onFiltersChange: (filters: Partial<SearchFilters>) => void;
  availableFactions: string[];
  availableCategories: string[];
}
```

**Advanced Features:**
- **Collapsible Filter Panel**: Expandable UI for advanced search options
- **Real-time Filtering**: Immediate updates without form submission
- **Filter Visualization**: Active filter badges with individual removal
- **Debounced Input**: Performance optimization for search queries

#### UnitCard Component (182 lines)
```typescript
interface UnitCardProps {
  unit: SearchableUnit;
  onViewDetails: (unit: SearchableUnit) => void;
  onAddToRoster: (unit: SearchableUnit) => void;
}
```

**Display Features:**
- **Stat Profile Layout**: Standard gaming format (M/T/SV/W/LD/OC)
- **Ability Preview**: Truncated text with "read more" functionality
- **Keyword Tags**: Visual representation with overflow handling
- **Action Buttons**: Dual action pattern for details and roster addition

#### RosterBuilder Component (373 lines)
```typescript
interface RosterBuilderProps {
  // No props - fully self-contained with store integration
}
```

**Complex Features:**
- **Inline Editing**: Direct roster name modification with validation
- **Points Tracking**: Visual progress bar with percentage calculation
- **Unit Management**: Add, remove, modify unit counts with validation
- **Export Functionality**: Multi-format export with download handling
- **Error Display**: User-friendly validation messages

### Component Patterns

#### Controlled Components
All form inputs follow React's controlled component pattern:
```typescript
<input
  value={searchQuery}
  onChange={(e) => onSearchChange(e.target.value)}
  className="..."
/>
```

#### Conditional Rendering
Extensive use of conditional rendering for different UI states:
```typescript
{isLoading ? (
  <LoadingSpinner />
) : error ? (
  <ErrorMessage error={error} onRetry={clearError} />
) : (
  <UnitGrid units={searchResults} />
)}
```

#### Event Handler Patterns
Consistent event handling with TypeScript safety:
```typescript
const handleUnitSelect = useCallback((unit: SearchableUnit) => {
  selectUnit(unit);
  onViewDetails?.(unit);
}, [selectUnit, onViewDetails]);
```

## Search & Filtering System

### Search Architecture Deep Dive

The search system implements a **multi-layered approach** combining fuzzy search with structured filtering:

#### Layer 1: Fuzzy Text Search (Fuse.js)
```typescript
const fuseConfig = {
  keys: [
    { name: 'name', weight: 0.4 },        // Highest priority
    { name: 'faction', weight: 0.2 },     // Army affiliation
    { name: 'categories', weight: 0.15 }, // Role in army
    { name: 'abilities', weight: 0.15 },  // Special rules
    { name: 'keywords', weight: 0.1 }     // Descriptive tags
  ],
  threshold: 0.3,                         // 70% match required
  includeScore: true,                     // For result ranking
  includeMatches: true,                   // For highlighting
  ignoreLocation: true,                   // Position independent
  useExtendedSearch: true                 // Advanced query syntax
};
```

#### Layer 2: Structured Filtering
```typescript
private applyFilters(results: SearchResult[], filters: SearchFilters): SearchableUnit[] {
  return results
    .map(result => result.item)
    .filter(unit => {
      // Faction filtering (exact match)
      if (filters.faction && unit.faction !== filters.faction) return false;
      
      // Category filtering (array intersection)
      if (filters.category && !unit.categories.includes(filters.category)) return false;
      
      // Points range filtering
      if (filters.pointsMin && unit.points < filters.pointsMin) return false;
      if (filters.pointsMax && unit.points > filters.pointsMax) return false;
      
      // Keyword filtering (any match)
      if (filters.keywords?.length && 
          !filters.keywords.some(keyword => unit.keywords.includes(keyword))) return false;
      
      return true;
    });
}
```

#### Layer 3: Similarity Algorithm
```typescript
findSimilarUnits(targetUnit: SearchableUnit, limit: number = 5): SearchableUnit[] {
  return this.allUnits
    .filter(unit => unit.id !== targetUnit.id)
    .map(unit => ({
      unit,
      similarity: this.calculateSimilarity(targetUnit, unit)
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit)
    .map(result => result.unit);
}

private calculateSimilarity(unit1: SearchableUnit, unit2: SearchableUnit): number {
  let score = 0;
  
  // Faction similarity (high weight)
  if (unit1.faction === unit2.faction) score += 0.4;
  
  // Category overlap
  const categoryIntersection = unit1.categories.filter(cat => 
    unit2.categories.includes(cat)
  );
  score += (categoryIntersection.length / Math.max(unit1.categories.length, unit2.categories.length)) * 0.3;
  
  // Points similarity (inverse of difference)
  const pointsDiff = Math.abs(unit1.points - unit2.points);
  score += Math.max(0, 1 - pointsDiff / Math.max(unit1.points, unit2.points)) * 0.2;
  
  // Keyword overlap
  const keywordIntersection = unit1.keywords.filter(keyword => 
    unit2.keywords.includes(keyword)
  );
  score += (keywordIntersection.length / Math.max(unit1.keywords.length, unit2.keywords.length)) * 0.1;
  
  return score;
}
```

### Performance Optimizations

1. **Search Index Pre-computation**: Fuse.js index built once on initialization
2. **Debounced Input**: 300ms delay prevents excessive search operations
3. **Result Memoization**: Cache search results for identical queries
4. **Filter Pipeline**: Early termination on failed filter conditions

## Roster Management System

### Roster Data Structure

The roster system implements a **hierarchical army organization** mirroring BattleScribe's structure:

```
Roster (Army List)
├── Forces (Detachments/Formations)
│   ├── Selections (Units)
│   │   ├── Sub-selections (Models/Upgrades)
│   │   └── Costs (Points, CP, etc.)
│   └── Categories (Force Organization Chart)
└── Validation Rules (Army Construction)
```

### Core Roster Operations

#### Roster Creation
```typescript
createNewRoster: (name: string, gameSystemId: string, gameSystemName: string, pointsLimit: number) => {
  const newRoster: Roster = {
    id: `roster_${Date.now()}`,
    name,
    gameSystemId,
    gameSystemName,
    pointsLimit,
    totalPoints: 0,
    forces: [{
      id: `force_${Date.now()}`,
      name: 'Main Force',
      catalogueId: gameSystemId,
      selections: []
    }],
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  set(state => ({
    currentRoster: newRoster,
    savedRosters: [...state.savedRosters, newRoster],
    isEditingRoster: true
  }));
  
  this.persistRosters();
}
```

#### Unit Addition with Validation
```typescript
addUnitToRoster: (unit: SearchableUnit, forceId?: string) => {
  if (!get().currentRoster) return;
  
  const targetForce = forceId || get().currentRoster!.forces[0]?.id;
  const selection: Selection = {
    id: `selection_${Date.now()}`,
    name: unit.name,
    unitId: unit.id,
    count: 1,
    costs: [{ name: 'pts', value: unit.points }],
    profiles: [{
      id: `profile_${unit.id}`,
      name: unit.name,
      characteristics: unit.characteristics
    }]
  };
  
  set(state => {
    const roster = { ...state.currentRoster! };
    const force = roster.forces.find(f => f.id === targetForce);
    if (force) {
      force.selections.push(selection);
      roster.totalPoints = this.calculateTotalPoints(roster);
      roster.updatedAt = new Date();
    }
    return { currentRoster: roster };
  });
  
  this.persistRosters();
}
```

### Export System

The roster system supports multiple export formats:

#### JSON Export
```typescript
exportRoster: (format: 'json' | 'text' | 'battlescribe') => {
  const roster = get().currentRoster;
  if (!roster) return '';
  
  switch (format) {
    case 'json':
      return JSON.stringify(roster, null, 2);
    
    case 'text':
      return this.generateTextExport(roster);
    
    case 'battlescribe':
      return this.generateBattleScribeXML(roster);
  }
}
```

#### BattleScribe XML Export
```typescript
private generateBattleScribeXML(roster: Roster): string {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<roster id="${roster.id}" name="${roster.name}" 
        battleScribeVersion="2.03" gameSystemId="${roster.gameSystemId}"
        gameSystemName="${roster.gameSystemName}" 
        gameSystemRevision="1" xmlns="http://www.battlescribe.net/schema/rosterSchema">
  <costs>
    <cost name="pts" typeId="points" value="${roster.totalPoints}"/>
  </costs>
  <forces>
    ${roster.forces.map(force => this.generateForceXML(force)).join('\n    ')}
  </forces>
</roster>`;
}
```

### Validation Engine

```typescript
validateRoster: (): string[] => {
  const roster = get().currentRoster;
  if (!roster) return ['No roster loaded'];
  
  const errors: string[] = [];
  
  // Points limit validation
  if (roster.totalPoints > roster.pointsLimit) {
    errors.push(`Roster exceeds points limit: ${roster.totalPoints}/${roster.pointsLimit}`);
  }
  
  // Force organization validation
  roster.forces.forEach(force => {
    if (force.selections.length === 0) {
      errors.push(`Force "${force.name}" is empty`);
    }
    
    // Additional rule validation would go here
    // - Mandatory unit requirements
    // - Maximum unit limits
    // - Faction restrictions
  });
  
  return errors;
}
```

## Testing Strategy

### Testing Framework Configuration

The application uses **Vitest** with **React Testing Library** for comprehensive testing:

```typescript
// vitest.config.ts
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
  },
});

// Test setup configuration
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});
```

### Test Coverage Strategy

#### Service Layer Testing (212 lines of tests)
```typescript
describe('SearchService', () => {
  let searchService: SearchService;
  let mockUnits: SearchableUnit[];

  beforeEach(() => {
    mockUnits = [
      {
        id: '1',
        name: 'Space Marine Intercessor',
        faction: 'Adeptus Astartes',
        categories: ['Infantry', 'Troops'],
        points: 20,
        abilities: ['Bolter Drill', 'And They Shall Know No Fear'],
        keywords: ['Imperium', 'Adeptus Astartes', 'Infantry'],
        characteristics: { M: '6"', T: '4', SV: '3+', W: '2', LD: '6+', OC: '2' }
      }
    ];
    searchService = new SearchService(mockUnits);
  });

  describe('search functionality', () => {
    test('should return exact matches for unit names', () => {
      const results = searchService.search('Intercessor');
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Space Marine Intercessor');
    });

    test('should handle fuzzy matching for typos', () => {
      const results = searchService.search('Intersessor'); // Typo
      expect(results).toHaveLength(1);
    });
  });

  describe('filtering', () => {
    test('should filter by faction', () => {
      const results = searchService.search('', { faction: 'Adeptus Astartes' });
      expect(results.every(unit => unit.faction === 'Adeptus Astartes')).toBe(true);
    });

    test('should filter by points range', () => {
      const results = searchService.search('', { pointsMin: 15, pointsMax: 25 });
      expect(results.every(unit => unit.points >= 15 && unit.points <= 25)).toBe(true);
    });
  });
});
```

#### Component Testing Pattern
```typescript
describe('UnitCard', () => {
  const mockUnit: SearchableUnit = {
    id: '1',
    name: 'Test Unit',
    faction: 'Test Faction',
    categories: ['Infantry'],
    points: 20,
    abilities: ['Test Ability'],
    keywords: ['Test'],
    characteristics: { M: '6"', T: '4', SV: '3+', W: '2', LD: '6+', OC: '2' }
  };

  test('renders unit information correctly', () => {
    const mockOnViewDetails = vi.fn();
    const mockOnAddToRoster = vi.fn();

    render(
      <UnitCard 
        unit={mockUnit} 
        onViewDetails={mockOnViewDetails}
        onAddToRoster={mockOnAddToRoster}
      />
    );

    expect(screen.getByText('Test Unit')).toBeInTheDocument();
    expect(screen.getByText('Test Faction')).toBeInTheDocument();
    expect(screen.getByText('20 pts')).toBeInTheDocument();
  });

  test('calls onViewDetails when details button is clicked', async () => {
    const mockOnViewDetails = vi.fn();
    const mockOnAddToRoster = vi.fn();

    render(
      <UnitCard 
        unit={mockUnit} 
        onViewDetails={mockOnViewDetails}
        onAddToRoster={mockOnAddToRoster}
      />
    );

    const detailsButton = screen.getByRole('button', { name: /view details/i });
    await userEvent.click(detailsButton);

    expect(mockOnViewDetails).toHaveBeenCalledWith(mockUnit);
  });
});
```

### Test Coverage Goals

- **Services**: >90% line coverage (critical business logic)
- **Components**: >80% line coverage (user interactions)
- **Stores**: >85% coverage (state management)
- **Utils**: 100% coverage (pure functions)

## Performance Considerations

### Bundle Optimization

Current bundle analysis:
- **Main Bundle**: ~200KB gzipped (React, Zustand, core app)
- **Vendor Chunks**: ~100KB gzipped (Fuse.js, XML parser, utilities)
- **Total Initial Load**: ~300KB gzipped

### Performance Optimization Strategies

#### 1. Code Splitting & Lazy Loading
```typescript
// Route-based code splitting
const UnitBrowser = lazy(() => import('./components/UnitBrowser'));
const RosterBuilder = lazy(() => import('./components/RosterBuilder'));

// Component wrapping with Suspense
<Suspense fallback={<LoadingSpinner />}>
  <UnitBrowser />
</Suspense>
```

#### 2. Search Performance
```typescript
// Debounced search input
const debouncedSearch = useMemo(
  () => debounce((query: string) => performSearch(query), 300),
  [performSearch]
);

// Memoized search results
const searchResults = useMemo(() => 
  searchService?.search(searchQuery, searchFilters) || [],
  [searchService, searchQuery, searchFilters]
);
```

#### 3. Component Optimization
```typescript
// Memoized expensive components
const UnitCard = memo(({ unit, onViewDetails, onAddToRoster }: UnitCardProps) => {
  return (
    <div className="unit-card">
      {/* Component content */}
    </div>
  );
});

// Callback memoization
const handleUnitSelect = useCallback((unit: SearchableUnit) => {
  selectUnit(unit);
}, [selectUnit]);
```

#### 4. Data Structure Optimization
```typescript
// Efficient search index structure
class SearchService {
  private searchIndex: Map<string, SearchableUnit[]> = new Map();
  
  constructor(units: SearchableUnit[]) {
    // Pre-compute faction-based indices
    units.forEach(unit => {
      const factionUnits = this.searchIndex.get(unit.faction) || [];
      factionUnits.push(unit);
      this.searchIndex.set(unit.faction, factionUnits);
    });
  }
}
```

### Memory Management

1. **Event Listener Cleanup**: Automatic cleanup in useEffect hooks
2. **Store Subscriptions**: Zustand handles automatic subscription cleanup
3. **Search Index**: Shared instance prevents memory duplication
4. **DOM References**: Proper cleanup of refs and event handlers

## Security & Validation

### Input Validation Strategy

#### XML Parsing Security
```typescript
class BattleScribeParser {
  private readonly MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB limit
  private readonly ALLOWED_ELEMENTS = new Set([
    'gameSystem', 'catalogue', 'unit', 'profile', 'characteristic'
    // ... other allowed elements
  ]);

  parseGameSystem(xmlContent: string): GameSystem {
    // Size validation
    if (xmlContent.length > this.MAX_FILE_SIZE) {
      throw new Error('XML file too large');
    }

    // Content validation
    if (!this.isValidBattleScribeXML(xmlContent)) {
      throw new Error('Invalid BattleScribe XML format');
    }

    return this.processXML(xmlContent);
  }
}
```

#### User Input Sanitization
```typescript
// Search query sanitization
const sanitizeSearchQuery = (query: string): string => {
  return query
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML
    .substring(0, 100);   // Limit length
};

// Roster name validation
const validateRosterName = (name: string): string | null => {
  if (!name.trim()) return 'Roster name is required';
  if (name.length > 50) return 'Roster name too long';
  if (!/^[a-zA-Z0-9\s\-_]+$/.test(name)) return 'Invalid characters in name';
  return null;
};
```

### Data Integrity

#### Type Safety
```typescript
// Runtime type checking for critical data
const isValidSearchableUnit = (obj: any): obj is SearchableUnit => {
  return (
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.faction === 'string' &&
    Array.isArray(obj.categories) &&
    typeof obj.points === 'number'
  );
};
```

#### Error Boundaries
```typescript
class ErrorBoundary extends Component<Props, State> {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Application error:', error, errorInfo);
    // Error reporting service integration here
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}
```

### Privacy & Data Handling

1. **Local-First Architecture**: All data stored locally in browser
2. **No Personal Information**: Application doesn't collect user data
3. **Transparent Storage**: Users control their roster data
4. **Export Control**: Users can export and remove their data

## Deployment Architecture

### Development Environment
```typescript
// Vite development configuration
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    cors: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
```

### Production Build Process
```bash
# Build pipeline
npm run lint          # Code quality checks
npm run test:run      # Full test suite
npm run build         # TypeScript compilation + Vite build
```

### Deployment Targets

#### Static Site Deployment
```yaml
# Example Vercel configuration
name: Deploy to Vercel
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
```

#### Progressive Web App Features
```typescript
// Service worker registration
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(registration => console.log('SW registered'))
    .catch(error => console.log('SW registration failed'));
}
```

### Environment Configuration
```typescript
// Environment-specific configuration
const config = {
  development: {
    API_BASE_URL: 'http://localhost:3000',
    DEBUG_MODE: true,
    MOCK_DATA: true
  },
  production: {
    API_BASE_URL: 'https://api.example.com',
    DEBUG_MODE: false,
    MOCK_DATA: false
  }
};

export default config[process.env.NODE_ENV || 'development'];
```

## Technical Debt & Future Enhancements

### Current Technical Debt

#### High Priority
1. **XML Parser Incomplete Features** (xmlParser.ts:200-220)
   ```typescript
   // TODO: Parse weapon abilities properly
   // TODO: Handle condition groups for complex rules
   // TODO: Implement constraint checking
   ```

2. **Limited Test Coverage**
   - Component tests at ~40% coverage
   - Integration tests missing
   - E2E testing not implemented

3. **Mock Data in Production**
   - DataService falls back to mock data
   - Need real BattleScribe file loading
   - Missing error handling for malformed XML

#### Medium Priority
1. **Performance Optimization Opportunities**
   - No virtual scrolling for large unit lists
   - Search results not paginated
   - Bundle size could be reduced with tree shaking

2. **UI/UX Improvements**
   - Mobile responsiveness needs enhancement
   - Keyboard navigation incomplete
   - Loading states inconsistent

#### Low Priority
1. **Code Organization**
   - Some components could be split smaller
   - Utility functions scattered across files
   - CSS class organization could be improved

### Future Enhancement Roadmap

#### Phase 1: Core Functionality (v1.1)
- **Real BattleScribe File Loading**
  ```typescript
  async loadBattleScribeFiles(files: FileList): Promise<GameSystemData> {
    // File validation and parsing
    // Support for .gst and .cat files
    // Automatic catalogue discovery
  }
  ```

- **Advanced Roster Validation**
  ```typescript
  class RosterValidator {
    validateForceOrganization(roster: Roster): ValidationResult[];
    checkPointLimits(roster: Roster): ValidationResult[];
    validateUnitConstraints(roster: Roster): ValidationResult[];
  }
  ```

- **Print-Friendly Layouts**
  ```css
  @media print {
    .roster-builder {
      /* Optimized print styles */
    }
  }
  ```

#### Phase 2: Enhanced Features (v1.2)
- **Multi-Game System Support**
  ```typescript
  interface GameSystemRegistry {
    registerGameSystem(system: GameSystem): void;
    getAvailableSystems(): GameSystem[];
    switchGameSystem(systemId: string): Promise<void>;
  }
  ```

- **Cloud Synchronization**
  ```typescript
  interface CloudSync {
    syncRosters(): Promise<void>;
    uploadRoster(roster: Roster): Promise<string>;
    downloadRoster(id: string): Promise<Roster>;
  }
  ```

- **Advanced Search Features**
  ```typescript
  interface AdvancedSearch {
    saveSearchPreset(name: string, query: string, filters: SearchFilters): void;
    getRecommendations(roster: Roster): SearchableUnit[];
    searchByRule(ruleName: string): SearchableUnit[];
  }
  ```

#### Phase 3: Community Features (v2.0)
- **Real-time Collaboration**
  ```typescript
  interface CollaborativeRoster {
    shareRoster(rosterId: string, permissions: Permission[]): string;
    joinRosterSession(shareId: string): Promise<void>;
    syncChanges(changes: RosterChange[]): void;
  }
  ```

- **Tournament Management**
  ```typescript
  interface Tournament {
    createTournament(settings: TournamentSettings): Tournament;
    validateRosterForTournament(roster: Roster, rules: TournamentRules): ValidationResult[];
    generatePairings(participants: Participant[]): Pairing[];
  }
  ```

### Proposed Architecture Evolution

#### Microservice Transition
```typescript
// Future API service architecture
interface APIService {
  gameData: GameDataService;
  roster: RosterService;
  user: UserService;
  tournament: TournamentService;
}

// Service worker for offline support
class OfflineService {
  cacheGameData(data: GameSystemData): Promise<void>;
  syncWhenOnline(): Promise<void>;
  getOfflineCapabilities(): OfflineCapability[];
}
```

#### Plugin Architecture
```typescript
// Extensible plugin system
interface Plugin {
  name: string;
  version: string;
  initialize(app: Application): void;
  gameSystemSupport: string[];
}

class PluginManager {
  loadPlugin(plugin: Plugin): void;
  getAvailablePlugins(): Plugin[];
  enablePlugin(name: string): void;
}
```

## Development Guidelines

### Code Style Standards

#### TypeScript Configuration
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true
  }
}
```

#### Component Development Pattern
```typescript
// Standard component template
interface ComponentProps {
  // Explicit prop types
}

export const Component: React.FC<ComponentProps> = ({ 
  ...props 
}) => {
  // Hooks at the top
  const [state, setState] = useState<StateType>(initialState);
  
  // Event handlers
  const handleEvent = useCallback((param: ParamType) => {
    // Handler logic
  }, [dependencies]);
  
  // Render
  return (
    <div className="component-root">
      {/* JSX content */}
    </div>
  );
};
```

#### Service Class Pattern
```typescript
// Standard service template
export class ServiceName {
  private dependency: DependencyType;
  
  constructor(dependency: DependencyType) {
    this.dependency = dependency;
  }
  
  public async methodName(param: ParamType): Promise<ReturnType> {
    try {
      // Method implementation
      return result;
    } catch (error) {
      console.error('Service error:', error);
      throw new ServiceError('Operation failed', error);
    }
  }
}
```

### Testing Guidelines

#### Test Naming Convention
```typescript
describe('ComponentName', () => {
  describe('when user performs action', () => {
    test('should behave as expected', () => {
      // Test implementation
    });
  });
});
```

#### Mock Strategy
```typescript
// Service mocking
const mockService = {
  method: vi.fn().mockResolvedValue(expectedResult)
} as jest.Mocked<ServiceType>;

// Component prop mocking
const defaultProps: ComponentProps = {
  prop1: 'test-value',
  onEvent: vi.fn()
};
```

### Git Workflow

#### Commit Message Format
```
type(scope): description

Types: feat, fix, docs, style, refactor, test, chore
Scope: component, service, store, test, build

Examples:
feat(search): add fuzzy search with highlighting
fix(roster): correct points calculation for upgrades
docs(readme): update installation instructions
```

#### Branch Strategy
```
main                    # Production releases
├── develop            # Integration branch
├── feature/search-ui  # Feature development
├── fix/roster-export  # Bug fixes
└── release/v1.1       # Release preparation
```

---

*This comprehensive technical design document serves as the authoritative guide for the Wargaming Roster Builder application architecture, implementation patterns, and future evolution. It provides developers with the detailed technical context needed to contribute effectively to the project while maintaining code quality and architectural consistency.*