# Wargaming Roster Builder - Technical Design Document (Condensed)

## Executive Summary

The Wargaming Roster Builder is a modern web application designed to parse BattleScribe game data and provide an intuitive interface for searching units and building army rosters. Built with React 18, TypeScript, and Tailwind CSS, it offers a responsive and user-friendly alternative to traditional roster building tools.

**Note**: For comprehensive technical documentation, see [TECHNICAL_DESIGN_DOCUMENT.md](./TECHNICAL_DESIGN_DOCUMENT.md) which contains detailed architecture analysis, code examples, and implementation guidelines.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Technology Stack](#technology-stack)
3. [Data Models](#data-models)
4. [Core Services](#core-services)
5. [User Interface Components](#user-interface-components)
6. [State Management](#state-management)
7. [Search & Filtering System](#search--filtering-system)
8. [Roster Management](#roster-management)
9. [Testing Strategy](#testing-strategy)
10. [Performance Considerations](#performance-considerations)
11. [Future Enhancements](#future-enhancements)

## Architecture Overview

The application follows a modern React architecture with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                       │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────────┐ │
│  │ UnitBrowser │ │ RosterBuilder│ │    Navigation           │ │
│  └─────────────┘ └─────────────┘ └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                   State Management                          │
│  ┌─────────────┐ ┌─────────────┐                           │
│  │ Game Store  │ │RosterStore  │                           │
│  └─────────────┘ └─────────────┘                           │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    Service Layer                            │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────────┐ │
│  │XML Parser   │ │SearchService│ │   Data Service          │ │
│  └─────────────┘ └─────────────┘ └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     Data Layer                              │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────────┐ │
│  │BattleScribe │ │ Local Storage│ │    Type Definitions     │ │
│  │    XML      │ │   (Rosters)  │ │                         │ │
│  └─────────────┘ └─────────────┘ └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **React 18** - Modern React with concurrent features
- **TypeScript 5.2+** - Type safety and developer experience
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Zustand** - Lightweight state management
- **Lucide React** - Consistent icon system

### Development & Testing
- **Vitest** - Fast unit testing framework
- **React Testing Library** - Component testing utilities
- **ESLint** - Code linting and style enforcement
- **fast-xml-parser** - Efficient XML parsing
- **Fuse.js** - Fuzzy search capabilities

### Build & Deployment
- **TypeScript Compiler** - Type checking and transpilation
- **PostCSS** - CSS processing and autoprefixing
- **Vite Build** - Optimized production builds

## Data Models

### Core BattleScribe Types

```typescript
interface GameSystem {
  id: string;
  name: string;
  revision: number;
  battleScribeVersion: string;
  costTypes: CostType[];
  profileTypes: ProfileType[];
  categoryEntries: CategoryEntry[];
  publications: Publication[];
  sharedRules: Rule[];
}

interface Unit {
  id: string;
  name: string;
  type: 'unit' | 'model' | 'upgrade';
  costs: Cost[];
  profiles: Profile[];
  abilities: Ability[];
  categoryLinks: CategoryLink[];
  weapons: Weapon[];
  faction: string;
}
```

### Search & UI Types

```typescript
interface SearchableUnit {
  id: string;
  name: string;
  faction: string;
  categories: string[];
  points: number;
  abilities: string[];
  keywords: string[];
  characteristics: Record<string, string>;
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
  pointsLimit: number;
  totalPoints: number;
  forces: Force[];
  createdAt: Date;
  updatedAt: Date;
}
```

## Core Services

### XML Parser Service (`xmlParser.ts`)

Responsible for parsing BattleScribe XML files into TypeScript objects:

**Key Features:**
- Handles complex XML hierarchy with references
- Supports both game system (.gst) and catalogue (.cat) files
- Extracts units, weapons, rules, and abilities
- Normalizes data for consistent API

**Performance Optimizations:**
- Streaming XML parser for large files
- Lazy loading of catalogue data
- Efficient characteristic mapping

### Search Service (`searchService.ts`)

Provides advanced search and filtering capabilities:

**Key Features:**
- Fuzzy text search with Fuse.js
- Multi-faceted filtering (faction, category, points)
- Similarity-based unit recommendations
- Weighted search results

**Search Configuration:**
```typescript
const searchConfig = {
  keys: [
    { name: 'name', weight: 0.4 },
    { name: 'abilities', weight: 0.3 },
    { name: 'faction', weight: 0.2 },
    { name: 'keywords', weight: 0.1 }
  ],
  threshold: 0.3,
  includeScore: true
};
```

### Data Service (`dataService.ts`)

Manages game system data loading and caching:

**Key Features:**
- Asynchronous data loading
- Mock data for development
- Error handling and recovery
- Data transformation pipeline

## User Interface Components

### Component Hierarchy

```
App
├── Navigation
├── UnitBrowser
│   ├── SearchBar
│   ├── UnitCard (multiple)
│   └── UnitDetails (modal)
└── RosterBuilder
    ├── RosterHeader
    ├── ForceSection (multiple)
    └── SelectionRow (multiple)
```

### Key Components

#### UnitCard
- Displays unit summary information
- Shows key characteristics (M, T, SV, W, LD, OC)
- Previews abilities and keywords
- Provides actions (view details, add to roster)

#### SearchBar
- Text input with fuzzy search
- Expandable filter panel
- Active filter indicators
- Clear functionality

#### RosterBuilder
- Drag-and-drop unit management
- Real-time points calculation
- Roster validation
- Export functionality (JSON, text, BattleScribe XML)

## State Management

### Game Store (Zustand)

Manages game system data and search state:

```typescript
interface GameState {
  gameSystemData: GameSystemData | null;
  searchService: SearchService | null;
  searchQuery: string;
  searchFilters: SearchFilters;
  searchResults: SearchableUnit[];
  selectedUnit: SearchableUnit | null;
}
```

### Roster Store (Zustand)

Manages roster building and army management:

```typescript
interface RosterState {
  currentRoster: Roster | null;
  savedRosters: Roster[];
  isEditingRoster: boolean;
  // Actions for roster manipulation
}
```

## Search & Filtering System

### Search Algorithm

1. **Text Search**: Fuse.js fuzzy matching across unit names, abilities, and keywords
2. **Filter Application**: Sequential filtering by faction, category, and points
3. **Result Ranking**: Weighted scoring based on relevance
4. **Performance**: Debounced search with result caching

### Filter Categories

- **Faction**: Exact string matching
- **Category**: Multi-select with OR logic
- **Points Range**: Numeric range filtering
- **Keywords**: Tag-based filtering

## Roster Management

### Roster Structure

```
Roster
├── Forces (Detachments)
│   ├── Selections (Units)
│   │   ├── Sub-selections (Models/Upgrades)
│   │   └── Costs (Points, CP, etc.)
│   └── Categories (Force Organization)
└── Validation Rules
```

### Key Features

- **Real-time Validation**: Points limits, force organization
- **Export Formats**: JSON, plain text, BattleScribe XML
- **Local Persistence**: Browser localStorage for roster saving
- **Version Control**: Track creation and modification dates

## Testing Strategy

### Unit Tests (Vitest)

- **Services**: XML parsing, search algorithms, data transformations
- **Components**: Rendering, user interactions, prop handling
- **State Management**: Store actions and state updates
- **Utilities**: Helper functions and data validation

### Component Tests (React Testing Library)

```typescript
describe('UnitCard', () => {
  it('renders unit information correctly', () => {
    render(<UnitCard unit={mockUnit} />);
    expect(screen.getByText('Test Unit')).toBeInTheDocument();
  });
});
```

### Test Coverage Goals

- Services: >90% line coverage
- Components: >80% line coverage
- Critical paths: 100% coverage

## Performance Considerations

### Optimization Strategies

1. **Data Loading**
   - Lazy loading of catalogue files
   - Progressive data parsing
   - Service worker caching

2. **Search Performance**
   - Debounced search input (300ms)
   - Result memoization
   - Virtual scrolling for large result sets

3. **Rendering Optimization**
   - React.memo for expensive components
   - useMemo for computed values
   - useCallback for event handlers

4. **Bundle Optimization**
   - Tree shaking unused code
   - Code splitting by route
   - Dynamic imports for heavy features

### Memory Management

- Efficient data structures for large datasets
- Cleanup of event listeners and subscriptions
- Garbage collection friendly patterns

## Future Enhancements

### Phase 2 Features

1. **Advanced Roster Validation**
   - Rules engine for complex constraints
   - Force organization validation
   - Point cost calculations with modifiers

2. **Multiplayer Features**
   - Roster sharing and collaboration
   - Tournament bracket management
   - Battle tracking and statistics

3. **Enhanced Search**
   - Advanced query syntax
   - Saved search presets
   - AI-powered unit recommendations

### Phase 3 Features

1. **Mobile Application**
   - React Native port
   - Offline-first architecture
   - Camera-based unit recognition

2. **Integration Features**
   - BattleScribe file import/export
   - 3D army visualization
   - Print-friendly roster layouts

3. **Community Features**
   - User-generated content
   - Community tournaments
   - Shared tactical guides

## Deployment Architecture

### Development Environment
- Vite dev server with HMR
- Mock data services
- Comprehensive error boundaries

### Production Environment
- Static site deployment (Vercel/Netlify)
- CDN for game data files
- Progressive Web App capabilities

### CI/CD Pipeline
- Automated testing on pull requests
- Type checking and linting
- Build optimization and deployment

## Security Considerations

### Data Validation
- Input sanitization for user-generated content
- XML parsing with security controls
- Cross-site scripting (XSS) prevention

### Privacy
- Local-first data storage
- No personal information collection
- Transparent data handling policies

---

*This document represents the technical foundation of the Wargaming Roster Builder application, designed to provide a modern, efficient, and user-friendly alternative to traditional roster building tools.*