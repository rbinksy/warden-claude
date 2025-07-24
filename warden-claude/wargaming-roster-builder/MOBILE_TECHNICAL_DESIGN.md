# Wargaming Roster Builder - Mobile-First Technical Design Document

## Executive Summary

The Wargaming Roster Builder mobile application is designed as a native mobile-first solution using Expo and React Native with functional programming patterns. This architecture prioritizes the mobile wargaming experience, providing tournament players with offline-capable army building, real-time tournament integration, and intuitive touch-based interactions optimized for competitive gaming scenarios.

**Key Mobile-First Decisions:**
- **Expo SDK 50+** for rapid development and over-the-air updates
- **Functional Programming** approach for maintainable, testable code
- **Offline-First Architecture** for reliable tournament usage
- **Native Mobile UI/UX** optimized for gaming on mobile devices
- **Performance-First** design for smooth 60fps interactions

## Table of Contents

1. [Mobile-First Architecture Overview](#mobile-first-architecture-overview)
2. [Technology Stack](#technology-stack)
3. [Functional Programming Patterns](#functional-programming-patterns)
4. [Project Structure](#project-structure)
5. [Mobile Navigation Architecture](#mobile-navigation-architecture)
6. [Offline-First Data Architecture](#offline-first-data-architecture)
7. [Functional State Management](#functional-state-management)
8. [Mobile UI Component System](#mobile-ui-component-system)
9. [Native Mobile Features](#native-mobile-features)
10. [Performance Optimization](#performance-optimization)
11. [Testing Strategy](#testing-strategy)
12. [Deployment & Distribution](#deployment--distribution)
13. [Security & Privacy](#security--privacy)
14. [Development Guidelines](#development-guidelines)

## Mobile-First Architecture Overview

### Core Mobile Use Cases

The mobile application is designed around these primary wargaming scenarios:

```
Tournament Player Journey
├── Pre-Tournament
│   ├── Army Building (offline capable)
│   ├── List Validation & Export
│   └── Tournament Registration
├── During Tournament
│   ├── Quick Army Reference (offline)
│   ├── Opponent List Sharing
│   ├── Real-time Scoring
│   └── Bracket/Pairing Updates
└── Post-Tournament
    ├── Army Performance Analysis
    ├── Meta Updates & Insights
    └── Community Sharing
```

### Functional Architecture Principles

```typescript
// Pure Functions for Business Logic
const armyLogic = {
  calculatePoints: (units: Unit[]) => 
    units.reduce((total, unit) => total + unit.points * unit.count, 0),
  
  validateArmy: (army: Army, rules: GameRules) => 
    pipe(army, checkPointsLimit(rules), checkForceOrg(rules), checkRestrictions(rules)),
  
  optimizeForMeta: (army: Army, metaData: MetaData) => 
    suggestOptimizations(army, metaData)
};

// Functional Components with Hooks
const ArmyBuilder = () => {
  const { army, addUnit, removeUnit } = useArmyBuilder();
  const { isValid, errors } = useArmyValidation(army);
  
  return (
    <SafeAreaView>
      <ArmyHeader army={army} />
      <UnitList units={army.units} onUnitPress={handleUnitPress} />
      <AddUnitButton onPress={handleAddUnit} />
    </SafeAreaView>
  );
};
```

### Mobile-First Design Patterns

```
┌─────────────────────────────────────────────────────────────┐
│                    Native Mobile Layer                      │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────────┐ │
│  │   Camera    │ │    Push     │ │      Biometrics         │ │
│  │ Integration │ │Notifications│ │    Authentication       │ │
│  └─────────────┘ └─────────────┘ └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                 React Native UI Layer                       │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────────┐ │
│  │ Touch-First │ │  Native     │ │     Gesture-Based       │ │
│  │ Components  │ │ Navigation  │ │      Interactions       │ │
│  └─────────────┘ └─────────────┘ └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────┐
│               Functional State Management                   │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────────┐ │
│  │   Zustand   │ │React Query  │ │    Custom Hooks         │ │
│  │  (Global)   │ │(Server State)│ │   (Component State)     │ │
│  └─────────────┘ └─────────────┘ └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────┐
│                 Offline-First Data Layer                   │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────────┐ │
│  │   SQLite    │ │ AsyncStorage│ │     Background Sync     │ │
│  │  (Complex)  │ │  (Simple)   │ │      & Caching          │ │
│  └─────────────┘ └─────────────┘ └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Core Mobile Framework
- **Expo SDK 50+** - Managed React Native workflow
- **React Native 0.73+** - Cross-platform native mobile development
- **TypeScript 5.2+** - Type safety and developer experience
- **Expo Router** - File-based routing (similar to Next.js)

### Functional Programming Libraries
- **Ramda** - Functional utility library for data transformations
- **Immer** - Immutable state updates with mutable syntax
- **Zod** - Runtime type validation and parsing
- **date-fns** - Functional date manipulation

### State Management (Functional Approach)
- **Zustand 4.4+** - Lightweight functional state management
- **@tanstack/react-query** - Server state management with caching
- **React Hook Form** - Performant forms with validation
- **React Context** - Component-level state sharing

### Mobile UI & Styling
- **NativeWind 4.0+** - Tailwind CSS for React Native
- **React Native Reanimated 3** - High-performance animations
- **React Native Gesture Handler** - Native gesture recognition
- **Expo Vector Icons** - Comprehensive icon library
- **React Native Safe Area Context** - Safe area handling

### Native Mobile Features
- **Expo Camera** - Camera integration for scanning
- **Expo Notifications** - Push notifications
- **Expo SecureStore** - Encrypted storage for sensitive data
- **Expo Sharing** - Native sharing capabilities
- **Expo Updates** - Over-the-air updates
- **Expo Dev Client** - Custom development builds

### Data & Storage
- **Expo SQLite** - Local relational database
- **@react-native-async-storage/async-storage** - Simple key-value storage
- **React Native MMKV** - High-performance key-value storage
- **fast-xml-parser** - BattleScribe XML parsing

### Development & Testing
- **Expo CLI** - Development tooling
- **EAS Build** - Cloud build service
- **EAS Submit** - App store submission
- **Jest** - Unit testing framework
- **@testing-library/react-native** - Component testing
- **Detox** - E2E testing for React Native

## Functional Programming Patterns

### Pure Function Services

Instead of classes, we use functional modules with pure functions:

```typescript
// services/armyCalculations.ts
import { pipe } from 'ramda';
import type { Army, Unit, ValidationResult } from '../types';

export const calculateArmyPoints = (army: Army): number =>
  army.units.reduce((total, unit) => total + (unit.points * unit.count), 0);

export const calculatePowerLevel = (army: Army): number =>
  army.units.reduce((total, unit) => total + (unit.powerLevel * unit.count), 0);

export const validateArmyComposition = (army: Army, rules: GameRules): ValidationResult => {
  const validations = [
    validatePointsLimit(rules.pointsLimit),
    validateForceOrganization(rules.forceOrg),
    validateUnitRestrictions(rules.restrictions),
    validateWargearLegality(rules.wargear)
  ];

  return pipe(
    army,
    ...validations,
    combineValidationResults
  );
};

// Curried functions for composition
const validatePointsLimit = (limit: number) => (army: Army): ValidationResult => ({
  isValid: calculateArmyPoints(army) <= limit,
  errors: calculateArmyPoints(army) > limit ? [`Army exceeds ${limit} points`] : []
});

const validateForceOrganization = (forceOrg: ForceOrgChart) => (army: Army): ValidationResult => {
  const unitsByRole = groupUnitsByBattlefieldRole(army.units);
  const violations = checkForceOrgViolations(unitsByRole, forceOrg);
  
  return {
    isValid: violations.length === 0,
    errors: violations
  };
};
```

### Hook-Based State Management

Custom hooks for component state logic:

```typescript
// hooks/useArmyBuilder.ts
import { useCallback, useMemo } from 'react';
import { useImmer } from 'use-immer';
import type { Army, Unit } from '../types';

export const useArmyBuilder = (initialArmy: Army) => {
  const [army, updateArmy] = useImmer(initialArmy);

  const addUnit = useCallback((unit: Unit) => {
    updateArmy(draft => {
      const existingUnit = draft.units.find(u => u.id === unit.id);
      if (existingUnit) {
        existingUnit.count += 1;
      } else {
        draft.units.push({ ...unit, count: 1 });
      }
    });
  }, [updateArmy]);

  const removeUnit = useCallback((unitId: string) => {
    updateArmy(draft => {
      const unitIndex = draft.units.findIndex(u => u.id === unitId);
      if (unitIndex !== -1) {
        if (draft.units[unitIndex].count > 1) {
          draft.units[unitIndex].count -= 1;
        } else {
          draft.units.splice(unitIndex, 1);
        }
      }
    });
  }, [updateArmy]);

  const updateUnitCount = useCallback((unitId: string, count: number) => {
    updateArmy(draft => {
      const unit = draft.units.find(u => u.id === unitId);
      if (unit) {
        unit.count = Math.max(0, count);
        if (unit.count === 0) {
          draft.units = draft.units.filter(u => u.id !== unitId);
        }
      }
    });
  }, [updateArmy]);

  const totalPoints = useMemo(() => calculateArmyPoints(army), [army]);
  const isValid = useMemo(() => validateArmyComposition(army).isValid, [army]);

  return {
    army,
    addUnit,
    removeUnit,
    updateUnitCount,
    totalPoints,
    isValid
  };
};
```

### Functional Component Patterns

Components as pure functions with hooks:

```typescript
// components/UnitCard.tsx
import React, { memo, useCallback } from 'react';
import { Pressable, View, Text } from 'react-native';
import type { Unit } from '../types';

interface UnitCardProps {
  unit: Unit;
  onPress: (unit: Unit) => void;
  onAddToArmy: (unit: Unit) => void;
}

export const UnitCard = memo<UnitCardProps>(({ unit, onPress, onAddToArmy }) => {
  const handlePress = useCallback(() => {
    onPress(unit);
  }, [unit, onPress]);

  const handleAddToArmy = useCallback(() => {
    onAddToArmy(unit);
  }, [unit, onAddToArmy]);

  return (
    <Pressable 
      onPress={handlePress}
      className="bg-white rounded-lg p-4 mb-3 shadow-sm border border-gray-200"
    >
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-900">{unit.name}</Text>
          <Text className="text-sm text-gray-600">{unit.faction}</Text>
          <Text className="text-lg font-bold text-blue-600">{unit.points} pts</Text>
        </View>
        
        <Pressable 
          onPress={handleAddToArmy}
          className="bg-blue-500 px-4 py-2 rounded-md"
        >
          <Text className="text-white font-medium">Add</Text>
        </Pressable>
      </View>
      
      <View className="mt-2">
        <Text className="text-xs text-gray-500" numberOfLines={2}>
          {unit.abilities.join(', ')}
        </Text>
      </View>
    </Pressable>
  );
});
```

## Project Structure

### Expo Router File-Based Structure

```
src/
├── app/                          # Expo Router pages
│   ├── (tabs)/                   # Tab navigation group
│   │   ├── armies/
│   │   │   ├── index.tsx         # Army list screen
│   │   │   ├── [id].tsx          # Army details screen
│   │   │   └── builder.tsx       # Army builder screen
│   │   ├── units/
│   │   │   ├── index.tsx         # Unit browser screen
│   │   │   └── [id].tsx          # Unit details modal
│   │   ├── tournaments/
│   │   │   ├── index.tsx         # Tournament list
│   │   │   ├── [id].tsx          # Tournament details
│   │   │   └── register.tsx      # Tournament registration
│   │   └── profile.tsx           # Profile/settings screen
│   ├── auth/                     # Authentication screens
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── _layout.tsx               # Root layout
│   └── +not-found.tsx            # 404 screen
├── components/                   # Reusable UI components
│   ├── ui/                       # Base UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── Modal.tsx
│   ├── army/                     # Army-specific components
│   │   ├── ArmyHeader.tsx
│   │   ├── UnitCard.tsx
│   │   ├── ArmyValidation.tsx
│   │   └── ArmyExport.tsx
│   ├── tournament/               # Tournament components
│   │   ├── TournamentCard.tsx
│   │   ├── BracketView.tsx
│   │   └── ScoreEntry.tsx
│   └── navigation/               # Navigation components
│       ├── TabBar.tsx
│       └── Header.tsx
├── hooks/                        # Custom hooks
│   ├── useArmyBuilder.ts
│   ├── useOfflineSync.ts
│   ├── useTournament.ts
│   └── useCamera.ts
├── services/                     # Business logic (functional)
│   ├── armyCalculations.ts       # Pure calculation functions
│   ├── armyValidation.ts         # Validation logic
│   ├── dataSync.ts               # Offline sync logic
│   ├── xmlParser.ts              # BattleScribe parsing
│   └── searchEngine.ts           # Search and filtering
├── stores/                       # Global state management
│   ├── armyStore.ts              # Army building state
│   ├── tournamentStore.ts        # Tournament state
│   ├── userStore.ts              # User preferences
│   └── offlineStore.ts           # Offline sync state
├── utils/                        # Utility functions
│   ├── formatters.ts             # Data formatting functions
│   ├── validators.ts             # Input validation
│   ├── constants.ts              # App constants
│   └── permissions.ts            # Permission helpers
├── types/                        # TypeScript definitions
│   ├── army.ts                   # Army-related types
│   ├── tournament.ts             # Tournament types
│   ├── user.ts                   # User types
│   └── api.ts                    # API response types
├── lib/                          # Third-party configurations
│   ├── database.ts               # SQLite setup
│   ├── notifications.ts          # Push notification setup
│   ├── storage.ts                # Storage configuration
│   └── camera.ts                 # Camera configuration
└── assets/                       # Static assets
    ├── images/
    ├── fonts/
    └── icons/
```

## Mobile Navigation Architecture

### Expo Router Navigation Structure

```typescript
// app/_layout.tsx - Root Layout
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen 
          name="units/[id]" 
          options={{ 
            presentation: 'modal',
            title: 'Unit Details'
          }} 
        />
      </Stack>
    </SafeAreaProvider>
  );
}

// app/(tabs)/_layout.tsx - Tab Navigation
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#1f2937',
          borderTopColor: '#374151',
        },
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#9ca3af',
      }}
    >
      <Tabs.Screen
        name="armies"
        options={{
          title: 'Armies',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="shield-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="units"
        options={{
          title: 'Units',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tournaments"
        options={{
          title: 'Tournaments',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="trophy-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
```

### Gesture-Based Navigation Patterns

```typescript
// components/SwipeableArmyCard.tsx
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import Animated, { 
  useAnimatedGestureHandler, 
  useAnimatedStyle, 
  useSharedValue,
  runOnJS,
  withSpring 
} from 'react-native-reanimated';

interface SwipeableArmyCardProps {
  army: Army;
  onDelete: (armyId: string) => void;
  onEdit: (armyId: string) => void;
}

export const SwipeableArmyCard = ({ army, onDelete, onEdit }: SwipeableArmyCardProps) => {
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);

  const gestureHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
    onStart: () => {
      // Optional: Provide haptic feedback
    },
    onActive: (event) => {
      translateX.value = event.translationX;
      opacity.value = 1 - Math.abs(event.translationX) / 200;
    },
    onEnd: (event) => {
      const shouldDelete = event.translationX < -100;
      const shouldEdit = event.translationX > 100;

      if (shouldDelete) {
        translateX.value = withSpring(-300);
        opacity.value = withSpring(0, undefined, () => {
          runOnJS(onDelete)(army.id);
        });
      } else if (shouldEdit) {
        translateX.value = withSpring(0);
        opacity.value = withSpring(1);
        runOnJS(onEdit)(army.id);
      } else {
        translateX.value = withSpring(0);
        opacity.value = withSpring(1);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value,
  }));

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={animatedStyle} className="bg-white rounded-lg mb-3">
        {/* Army card content */}
      </Animated.View>
    </PanGestureHandler>
  );
};
```

## Offline-First Data Architecture

### SQLite Database Schema

```typescript
// lib/database.ts
import * as SQLite from 'expo-sqlite';
import type { Army, Unit, Tournament } from '../types';

const db = SQLite.openDatabase('wargaming.db');

export const initializeDatabase = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      // Armies table
      tx.executeSql(`
        CREATE TABLE IF NOT EXISTS armies (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          game_system_id TEXT NOT NULL,
          points_limit INTEGER NOT NULL,
          total_points INTEGER NOT NULL,
          data TEXT NOT NULL,
          is_synced INTEGER DEFAULT 0,
          last_modified INTEGER NOT NULL,
          created_at INTEGER NOT NULL
        );
      `);

      // Units table for search optimization
      tx.executeSql(`
        CREATE TABLE IF NOT EXISTS units (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          faction TEXT NOT NULL,
          points INTEGER NOT NULL,
          data TEXT NOT NULL,
          search_text TEXT NOT NULL,
          last_updated INTEGER NOT NULL
        );
      `);

      // Tournaments table
      tx.executeSql(`
        CREATE TABLE IF NOT EXISTS tournaments (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          date TEXT NOT NULL,
          location TEXT,
          data TEXT NOT NULL,
          is_registered INTEGER DEFAULT 0,
          last_synced INTEGER DEFAULT 0
        );
      `);

      // Sync queue for offline changes
      tx.executeSql(`
        CREATE TABLE IF NOT EXISTS sync_queue (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          table_name TEXT NOT NULL,
          record_id TEXT NOT NULL,
          action TEXT NOT NULL,
          data TEXT,
          created_at INTEGER NOT NULL
        );
      `);
    }, reject, resolve);
  });
};

// Functional database operations
export const armyDatabase = {
  save: async (army: Army): Promise<void> => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `INSERT OR REPLACE INTO armies 
           (id, name, game_system_id, points_limit, total_points, data, last_modified, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            army.id,
            army.name,
            army.gameSystemId,
            army.pointsLimit,
            army.totalPoints,
            JSON.stringify(army),
            Date.now(),
            army.createdAt
          ],
          () => resolve(),
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  },

  getAll: async (): Promise<Army[]> => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM armies ORDER BY last_modified DESC',
          [],
          (_, { rows }) => {
            const armies = rows._array.map(row => JSON.parse(row.data) as Army);
            resolve(armies);
          },
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  },

  getById: async (id: string): Promise<Army | null> => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM armies WHERE id = ?',
          [id],
          (_, { rows }) => {
            if (rows.length > 0) {
              resolve(JSON.parse(rows._array[0].data) as Army);
            } else {
              resolve(null);
            }
          },
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  },

  delete: async (id: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'DELETE FROM armies WHERE id = ?',
          [id],
          () => resolve(),
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  }
};
```

### Offline Sync Strategy

```typescript
// services/dataSync.ts
import NetInfo from '@react-native-community/netinfo';
import { armyDatabase } from '../lib/database';
import type { Army, SyncOperation } from '../types';

export const syncService = {
  // Queue operations for offline sync
  queueOperation: async (operation: SyncOperation): Promise<void> => {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `INSERT INTO sync_queue (table_name, record_id, action, data, created_at)
           VALUES (?, ?, ?, ?, ?)`,
          [
            operation.tableName,
            operation.recordId,
            operation.action,
            JSON.stringify(operation.data),
            Date.now()
          ],
          () => resolve(),
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  },

  // Process sync queue when online
  processSyncQueue: async (): Promise<void> => {
    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) return;

    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM sync_queue ORDER BY created_at ASC',
          [],
          async (_, { rows }) => {
            const operations = rows._array as SyncOperation[];
            
            for (const operation of operations) {
              try {
                await processSyncOperation(operation);
                
                // Remove from queue after successful sync
                tx.executeSql(
                  'DELETE FROM sync_queue WHERE id = ?',
                  [operation.id]
                );
              } catch (error) {
                console.error('Sync operation failed:', error);
                // Keep in queue for retry
              }
            }
            resolve();
          },
          (_, error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  }
};

const processSyncOperation = async (operation: SyncOperation): Promise<void> => {
  switch (operation.action) {
    case 'CREATE':
      await syncCreateOperation(operation);
      break;
    case 'UPDATE':
      await syncUpdateOperation(operation);
      break;
    case 'DELETE':
      await syncDeleteOperation(operation);
      break;
  }
};
```

## Functional State Management

### Zustand Stores with Functional Patterns

```typescript
// stores/armyStore.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { armyDatabase } from '../lib/database';
import type { Army, Unit } from '../types';

interface ArmyState {
  armies: Army[];
  currentArmy: Army | null;
  isLoading: boolean;
  error: string | null;
}

interface ArmyActions {
  loadArmies: () => Promise<void>;
  createArmy: (name: string, gameSystemId: string, pointsLimit: number) => Promise<void>;
  selectArmy: (armyId: string) => Promise<void>;
  updateArmy: (updates: Partial<Army>) => Promise<void>;
  deleteArmy: (armyId: string) => Promise<void>;
  addUnitToArmy: (unit: Unit) => Promise<void>;
  removeUnitFromArmy: (unitId: string) => Promise<void>;
  clearError: () => void;
}

export const useArmyStore = create<ArmyState & ArmyActions>()(
  devtools(
    persist(
      immer((set, get) => ({
        // Initial state
        armies: [],
        currentArmy: null,
        isLoading: false,
        error: null,

        // Actions (all functional, no classes)
        loadArmies: async () => {
          set(state => {
            state.isLoading = true;
            state.error = null;
          });

          try {
            const armies = await armyDatabase.getAll();
            set(state => {
              state.armies = armies;
              state.isLoading = false;
            });
          } catch (error) {
            set(state => {
              state.error = error instanceof Error ? error.message : 'Failed to load armies';
              state.isLoading = false;
            });
          }
        },

        createArmy: async (name: string, gameSystemId: string, pointsLimit: number) => {
          const newArmy: Army = {
            id: `army_${Date.now()}`,
            name,
            gameSystemId,
            pointsLimit,
            totalPoints: 0,
            units: [],
            createdAt: Date.now(),
            updatedAt: Date.now()
          };

          try {
            await armyDatabase.save(newArmy);
            set(state => {
              state.armies.unshift(newArmy);
              state.currentArmy = newArmy;
            });
          } catch (error) {
            set(state => {
              state.error = error instanceof Error ? error.message : 'Failed to create army';
            });
          }
        },

        selectArmy: async (armyId: string) => {
          try {
            const army = await armyDatabase.getById(armyId);
            set(state => {
              state.currentArmy = army;
            });
          } catch (error) {
            set(state => {
              state.error = error instanceof Error ? error.message : 'Failed to load army';
            });
          }
        },

        updateArmy: async (updates: Partial<Army>) => {
          const { currentArmy } = get();
          if (!currentArmy) return;

          const updatedArmy = {
            ...currentArmy,
            ...updates,
            updatedAt: Date.now()
          };

          try {
            await armyDatabase.save(updatedArmy);
            set(state => {
              state.currentArmy = updatedArmy;
              const index = state.armies.findIndex(a => a.id === updatedArmy.id);
              if (index !== -1) {
                state.armies[index] = updatedArmy;
              }
            });
          } catch (error) {
            set(state => {
              state.error = error instanceof Error ? error.message : 'Failed to update army';
            });
          }
        },

        addUnitToArmy: async (unit: Unit) => {
          const { currentArmy } = get();
          if (!currentArmy) return;

          const existingUnitIndex = currentArmy.units.findIndex(u => u.id === unit.id);
          let updatedUnits: Unit[];

          if (existingUnitIndex !== -1) {
            updatedUnits = currentArmy.units.map((u, index) =>
              index === existingUnitIndex ? { ...u, count: u.count + 1 } : u
            );
          } else {
            updatedUnits = [...currentArmy.units, { ...unit, count: 1 }];
          }

          const totalPoints = updatedUnits.reduce((sum, u) => sum + (u.points * u.count), 0);

          await get().updateArmy({
            units: updatedUnits,
            totalPoints
          });
        },

        deleteArmy: async (armyId: string) => {
          try {
            await armyDatabase.delete(armyId);
            set(state => {
              state.armies = state.armies.filter(a => a.id !== armyId);
              if (state.currentArmy?.id === armyId) {
                state.currentArmy = null;
              }
            });
          } catch (error) {
            set(state => {
              state.error = error instanceof Error ? error.message : 'Failed to delete army';
            });
          }
        },

        clearError: () => {
          set(state => {
            state.error = null;
          });
        }
      })),
      {
        name: 'army-store',
        // Only persist non-sensitive data
        partialize: (state) => ({
          armies: state.armies.map(army => ({ id: army.id, name: army.name }))
        })
      }
    )
  )
);
```

## Mobile UI Component System

### Touch-Optimized Components

```typescript
// components/ui/TouchableCard.tsx
import React, { memo, useCallback } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  interpolate
} from 'react-native-reanimated';
import { Haptics } from 'expo-haptics';

interface TouchableCardProps {
  onPress?: () => void;
  onLongPress?: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export const TouchableCard = memo<TouchableCardProps>(({ 
  onPress, 
  onLongPress, 
  children, 
  className = '',
  disabled = false 
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    if (disabled) return;
    
    scale.value = withSpring(0.95);
    opacity.value = withSpring(0.8);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [disabled]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1);
    opacity.value = withSpring(1);
  }, []);

  const handleLongPress = useCallback(() => {
    if (disabled || !onLongPress) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onLongPress();
  }, [disabled, onLongPress]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onLongPress={handleLongPress}
      disabled={disabled}
    >
      <Animated.View 
        style={animatedStyle}
        className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
});
```

### Form Components with Validation

```typescript
// components/ui/FormInput.tsx
import React, { memo, useCallback } from 'react';
import { View, Text, TextInput } from 'react-native';
import { Controller, Control, FieldError } from 'react-hook-form';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

interface FormInputProps {
  name: string;
  control: Control<any>;
  label: string;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric' | 'email-address';
  secureTextEntry?: boolean;
  multiline?: boolean;
  rules?: object;
}

export const FormInput = memo<FormInputProps>(({
  name,
  control,
  label,
  placeholder,
  keyboardType = 'default',
  secureTextEntry = false,
  multiline = false,
  rules = {}
}) => {
  const renderInput = useCallback(({ field: { onChange, value }, fieldState: { error } }: any) => (
    <View className="mb-4">
      <Text className="text-sm font-medium text-gray-700 mb-2">{label}</Text>
      
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        className={`
          border rounded-lg px-4 py-3 text-base
          ${error ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'}
          ${multiline ? 'min-h-[100px]' : 'h-12'}
        `}
        style={{
          textAlignVertical: multiline ? 'top' : 'center'
        }}
      />
      
      {error && (
        <Animated.View entering={FadeIn} exiting={FadeOut}>
          <Text className="text-red-500 text-sm mt-1">{error.message}</Text>
        </Animated.View>
      )}
    </View>
  ), [label, placeholder, keyboardType, secureTextEntry, multiline]);

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={renderInput}
    />
  );
});
```

## Native Mobile Features

### Camera Integration for Army List Scanning

```typescript
// hooks/useCamera.ts
import { useState, useCallback } from 'react';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

export const useCamera = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const requestPermission = useCallback(async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
    return status === 'granted';
  }, []);

  const takePicture = useCallback(async (): Promise<string | null> => {
    const hasPermission = await requestPermission();
    if (!hasPermission) {
      Alert.alert('Permission denied', 'Camera permission is required to scan army lists');
      return null;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        return result.assets[0].uri;
      }
      
      return null;
    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert('Error', 'Failed to take picture');
      return null;
    }
  }, [requestPermission]);

  const pickFromLibrary = useCallback(async (): Promise<string | null> => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        return result.assets[0].uri;
      }
      
      return null;
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
      return null;
    }
  }, []);

  return {
    hasPermission,
    requestPermission,
    takePicture,
    pickFromLibrary
  };
};

// services/ocrService.ts
import { GoogleVision } from '@google-cloud/vision';

export const extractTextFromImage = async (imageUri: string): Promise<string> => {
  try {
    // Note: This would require a backend service in production
    // For demo purposes, we'll simulate OCR
    
    const response = await fetch('/api/ocr', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUri })
    });

    const { text } = await response.json();
    return text;
  } catch (error) {
    console.error('OCR extraction failed:', error);
    throw new Error('Failed to extract text from image');
  }
};

export const parseArmyListFromText = (text: string): Partial<Army> => {
  // Simple regex patterns for common army list formats
  const nameMatch = text.match(/Army[\s:]+(.+?)(?:\n|Points)/i);
  const pointsMatch = text.match(/(\d+)\s*points?/i);
  
  // More sophisticated parsing would go here
  const units = extractUnitsFromText(text);
  
  return {
    name: nameMatch?.[1]?.trim() || 'Scanned Army',
    totalPoints: pointsMatch ? parseInt(pointsMatch[1]) : 0,
    units
  };
};
```

### Push Notifications for Tournaments

```typescript
// lib/notifications.ts
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification handling
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const notificationService = {
  requestPermissions: async (): Promise<boolean> => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return false;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('tournament-updates', {
        name: 'Tournament Updates',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#3b82f6',
      });
    }

    return true;
  },

  scheduleLocalNotification: async (
    title: string,
    body: string,
    trigger: Notifications.NotificationTriggerInput
  ): Promise<string> => {
    return await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: 'default',
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger,
    });
  },

  scheduleTournamentReminder: async (tournamentName: string, startTime: Date): Promise<void> => {
    const oneDayBefore = new Date(startTime.getTime() - 24 * 60 * 60 * 1000);
    const oneHourBefore = new Date(startTime.getTime() - 60 * 60 * 1000);

    await notificationService.scheduleLocalNotification(
      'Tournament Tomorrow',
      `${tournamentName} starts tomorrow at ${startTime.toLocaleTimeString()}`,
      { date: oneDayBefore }
    );

    await notificationService.scheduleLocalNotification(
      'Tournament Starting Soon',
      `${tournamentName} starts in 1 hour!`,
      { date: oneHourBefore }
    );
  },

  cancelAllNotifications: async (): Promise<void> => {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }
};
```

## Performance Optimization

### Memory Management for Large Datasets

```typescript
// hooks/useVirtualizedList.ts
import { useMemo, useCallback, useState } from 'react';
import { Dimensions } from 'react-native';

interface VirtualizedListConfig {
  itemHeight: number;
  overscan?: number;
  getItemKey: (item: any, index: number) => string;
}

export const useVirtualizedList = <T>(
  items: T[],
  config: VirtualizedListConfig
) => {
  const [scrollOffset, setScrollOffset] = useState(0);
  const screenHeight = Dimensions.get('window').height;
  
  const { visibleItems, totalHeight } = useMemo(() => {
    const { itemHeight, overscan = 5 } = config;
    const containerHeight = screenHeight;
    
    const startIndex = Math.max(0, Math.floor(scrollOffset / itemHeight) - overscan);
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollOffset + containerHeight) / itemHeight) + overscan
    );
    
    const visibleItems = items.slice(startIndex, endIndex + 1).map((item, index) => ({
      item,
      index: startIndex + index,
      key: config.getItemKey(item, startIndex + index)
    }));
    
    return {
      visibleItems,
      totalHeight: items.length * itemHeight
    };
  }, [items, scrollOffset, screenHeight, config]);

  const onScroll = useCallback((event: any) => {
    setScrollOffset(event.nativeEvent.contentOffset.y);
  }, []);

  return {
    visibleItems,
    totalHeight,
    onScroll
  };
};
```

### Image Optimization and Caching

```typescript
// components/ui/OptimizedImage.tsx
import React, { memo, useState, useCallback } from 'react';
import { View, Image, ActivityIndicator } from 'react-native';
import { Image as ExpoImage } from 'expo-image';

interface OptimizedImageProps {
  source: { uri: string } | number;
  style?: any;
  placeholder?: string;
  className?: string;
}

export const OptimizedImage = memo<OptimizedImageProps>(({
  source,
  style,
  placeholder,
  className = ''
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoadStart = useCallback(() => {
    setIsLoading(true);
    setHasError(false);
  }, []);

  const handleLoadEnd = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
  }, []);

  return (
    <View className={`relative ${className}`} style={style}>
      <ExpoImage
        source={source}
        style={style}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        onError={handleError}
        placeholder={placeholder}
        contentFit="cover"
        transition={200}
        cachePolicy="memory-disk"
      />
      
      {isLoading && (
        <View className="absolute inset-0 items-center justify-center bg-gray-100">
          <ActivityIndicator size="small" color="#3b82f6" />
        </View>
      )}
      
      {hasError && (
        <View className="absolute inset-0 items-center justify-center bg-gray-200">
          <Text className="text-gray-500 text-xs">Failed to load</Text>
        </View>
      )}
    </View>
  );
});
```

### Battery and Performance Monitoring

```typescript
// hooks/usePerformanceMonitoring.ts
import { useCallback, useRef } from 'react';
import { InteractionManager } from 'react-native';

export const usePerformanceMonitoring = () => {
  const performanceMarks = useRef<Map<string, number>>(new Map());

  const startMark = useCallback((markName: string) => {
    performanceMarks.current.set(markName, Date.now());
  }, []);

  const endMark = useCallback((markName: string): number => {
    const startTime = performanceMarks.current.get(markName);
    if (!startTime) {
      console.warn(`Performance mark "${markName}" not found`);
      return 0;
    }

    const duration = Date.now() - startTime;
    performanceMarks.current.delete(markName);
    
    // Log performance metrics in development
    if (__DEV__) {
      console.log(`Performance: ${markName} took ${duration}ms`);
    }
    
    return duration;
  }, []);

  const measureAsync = useCallback(async <T>(
    markName: string,
    asyncOperation: () => Promise<T>
  ): Promise<T> => {
    startMark(markName);
    
    return new Promise((resolve, reject) => {
      InteractionManager.runAfterInteractions(async () => {
        try {
          const result = await asyncOperation();
          endMark(markName);
          resolve(result);
        } catch (error) {
          endMark(markName);
          reject(error);
        }
      });
    });
  }, [startMark, endMark]);

  return {
    startMark,
    endMark,
    measureAsync
  };
};
```

## Testing Strategy

### React Native Testing Library Setup

```typescript
// __tests__/setup.ts
import 'react-native-gesture-handler/jestSetup';

// Mock React Native modules
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

jest.mock('expo-sqlite', () => ({
  openDatabase: jest.fn(() => ({
    transaction: jest.fn(),
    executeSql: jest.fn(),
  })),
}));

jest.mock('expo-notifications', () => ({
  requestPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  scheduleNotificationAsync: jest.fn(() => Promise.resolve('notification-id')),
}));

// Mock Expo modules
jest.mock('expo-camera', () => ({
  Camera: {
    requestCameraPermissionsAsync: jest.fn(() => 
      Promise.resolve({ status: 'granted' })
    ),
  },
}));
```

### Component Testing Patterns

```typescript
// __tests__/components/UnitCard.test.tsx
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { UnitCard } from '../../src/components/UnitCard';
import type { Unit } from '../../src/types';

const mockUnit: Unit = {
  id: '1',
  name: 'Space Marine Intercessor',
  faction: 'Adeptus Astartes',
  points: 20,
  abilities: ['Bolter Drill', 'And They Shall Know No Fear'],
  keywords: ['Infantry', 'Primaris'],
  count: 1
};

describe('UnitCard', () => {
  const mockOnPress = jest.fn();
  const mockOnAddToArmy = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders unit information correctly', () => {
    const { getByText } = render(
      <UnitCard 
        unit={mockUnit} 
        onPress={mockOnPress}
        onAddToArmy={mockOnAddToArmy}
      />
    );

    expect(getByText('Space Marine Intercessor')).toBeTruthy();
    expect(getByText('Adeptus Astartes')).toBeTruthy();
    expect(getByText('20 pts')).toBeTruthy();
  });

  it('calls onPress when card is pressed', async () => {
    const { getByTestId } = render(
      <UnitCard 
        unit={mockUnit} 
        onPress={mockOnPress}
        onAddToArmy={mockOnAddToArmy}
      />
    );

    fireEvent.press(getByTestId('unit-card'));
    
    await waitFor(() => {
      expect(mockOnPress).toHaveBeenCalledWith(mockUnit);
    });
  });

  it('calls onAddToArmy when add button is pressed', async () => {
    const { getByText } = render(
      <UnitCard 
        unit={mockUnit} 
        onPress={mockOnPress}
        onAddToArmy={mockOnAddToArmy}
      />
    );

    fireEvent.press(getByText('Add'));
    
    await waitFor(() => {
      expect(mockOnAddToArmy).toHaveBeenCalledWith(mockUnit);
    });
  });
});
```

### E2E Testing with Detox

```typescript
// e2e/armyBuilder.e2e.ts
import { device, expect, element, by } from 'detox';

describe('Army Builder Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should create a new army', async () => {
    // Navigate to armies tab
    await element(by.text('Armies')).tap();
    
    // Tap create army button
    await element(by.id('create-army-button')).tap();
    
    // Fill in army details
    await element(by.id('army-name-input')).typeText('Test Army');
    await element(by.id('points-limit-input')).typeText('2000');
    
    // Save army
    await element(by.text('Create')).tap();
    
    // Verify army was created
    await expect(element(by.text('Test Army'))).toBeVisible();
  });

  it('should add units to army', async () => {
    // Navigate to units tab
    await element(by.text('Units')).tap();
    
    // Search for a unit
    await element(by.id('search-input')).typeText('Intercessor');
    
    // Add unit to army
    await element(by.id('add-unit-button')).atIndex(0).tap();
    
    // Navigate back to armies
    await element(by.text('Armies')).tap();
    
    // Verify unit was added
    await element(by.text('Test Army')).tap();
    await expect(element(by.text('Intercessor'))).toBeVisible();
  });
});
```

## Deployment & Distribution

### Expo Application Services (EAS) Configuration

```json
// eas.json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "resourceClass": "m-medium"
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": true,
        "resourceClass": "m-medium"
      },
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "ios": {
        "resourceClass": "m-medium"
      },
      "android": {
        "buildType": "aab"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@example.com",
        "ascAppId": "1234567890",
        "appleTeamId": "ABCD123456"
      },
      "android": {
        "serviceAccountKeyPath": "../path/to/api-key.json",
        "track": "production"
      }
    }
  },
  "update": {
    "production": {
      "channel": "production"
    },
    "preview": {
      "channel": "preview"
    }
  }
}
```

### App Configuration

```typescript
// app.config.ts
import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Wargaming Roster Builder',
  slug: 'wargaming-roster-builder',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#1f2937'
  },
  assetBundlePatterns: [
    '**/*'
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.wargaming.rosterbuilder',
    buildNumber: '1',
    infoPlist: {
      NSCameraUsageDescription: 'This app uses camera to scan army lists',
      NSPhotoLibraryUsageDescription: 'This app accesses photo library to import army list images'
    }
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#1f2937'
    },
    package: 'com.wargaming.rosterbuilder',
    versionCode: 1,
    permissions: [
      'CAMERA',
      'READ_EXTERNAL_STORAGE',
      'WRITE_EXTERNAL_STORAGE',
      'RECEIVE_BOOT_COMPLETED',
      'VIBRATE'
    ]
  },
  web: {
    favicon: './assets/favicon.png',
    bundler: 'metro'
  },
  plugins: [
    'expo-router',
    'expo-camera',
    'expo-notifications',
    [
      'expo-build-properties',
      {
        android: {
          compileSdkVersion: 34,
          targetSdkVersion: 34,
          buildToolsVersion: '34.0.0'
        },
        ios: {
          deploymentTarget: '13.0'
        }
      }
    ]
  ],
  extra: {
    router: {
      origin: false
    },
    eas: {
      projectId: 'your-project-id'
    }
  },
  updates: {
    url: 'https://u.expo.dev/your-project-id'
  },
  runtimeVersion: {
    policy: 'sdkVersion'
  }
});
```

## Security & Privacy

### Secure Data Storage

```typescript
// lib/secureStorage.ts
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';

export const secureStorage = {
  // Store sensitive data with encryption
  setSecureItem: async (key: string, value: string): Promise<void> => {
    try {
      await SecureStore.setItemAsync(key, value, {
        requireAuthentication: true,
        keychainService: 'wargaming-roster-builder',
        touchID: true,
        showModal: true,
        kSecAccessControl: 'kSecAccessControlBiometryCurrentSet',
      });
    } catch (error) {
      console.error('Failed to store secure item:', error);
      throw error;
    }
  },

  // Retrieve sensitive data
  getSecureItem: async (key: string): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync(key, {
        requireAuthentication: true,
        keychainService: 'wargaming-roster-builder',
        touchID: true,
        showModal: true,
      });
    } catch (error) {
      console.error('Failed to retrieve secure item:', error);
      return null;
    }
  },

  // Generate secure random IDs
  generateSecureId: async (): Promise<string> => {
    const randomBytes = await Crypto.getRandomBytesAsync(16);
    return Array.from(randomBytes, byte => byte.toString(16).padStart(2, '0')).join('');
  },

  // Hash sensitive data
  hashData: async (data: string): Promise<string> => {
    return await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      data,
      { encoding: Crypto.CryptoEncoding.HEX }
    );
  }
};
```

### Privacy-First Data Handling

```typescript
// services/privacyService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export const privacyService = {
  // Anonymize user data for analytics
  anonymizeUserData: (userData: any) => {
    const { email, name, ...anonymizedData } = userData;
    return {
      ...anonymizedData,
      userId: hashData(email), // Hashed identifier
      hashedEmail: hashData(email)
    };
  },

  // Clear all user data on logout
  clearAllUserData: async (): Promise<void> => {
    try {
      // Clear AsyncStorage
      await AsyncStorage.clear();
      
      // Clear SecureStore items
      const secureKeys = ['auth-token', 'refresh-token', 'user-credentials'];
      await Promise.all(
        secureKeys.map(key => SecureStore.deleteItemAsync(key))
      );
      
      // Clear SQLite database
      await clearDatabase();
      
    } catch (error) {
      console.error('Failed to clear user data:', error);
      throw error;
    }
  },

  // Export user data (GDPR compliance)
  exportUserData: async (): Promise<object> => {
    try {
      const armies = await armyDatabase.getAll();
      const tournaments = await tournamentDatabase.getAll();
      const preferences = await AsyncStorage.getItem('user-preferences');
      
      return {
        armies,
        tournaments,
        preferences: preferences ? JSON.parse(preferences) : null,
        exportDate: new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to export user data:', error);
      throw error;
    }
  }
};
```

## Development Guidelines

### Functional Code Style Guidelines

```typescript
// ❌ Avoid: Class-based patterns
class ArmyService {
  calculatePoints(army: Army): number {
    return army.units.reduce((total, unit) => total + unit.points, 0);
  }
}

// ✅ Prefer: Functional modules
export const armyService = {
  calculatePoints: (army: Army): number =>
    army.units.reduce((total, unit) => total + unit.points, 0),
  
  validateArmy: (army: Army, rules: GameRules): ValidationResult =>
    pipe(army, checkPointsLimit(rules), checkForceOrg(rules)),
  
  optimizeForMeta: (army: Army, meta: MetaData): Army =>
    applyOptimizations(army, generateOptimizations(army, meta))
};

// ❌ Avoid: Imperative state mutations
const addUnitToArmy = (army: Army, unit: Unit) => {
  army.units.push(unit);
  army.totalPoints += unit.points;
  return army;
};

// ✅ Prefer: Immutable updates with Immer
const addUnitToArmy = (army: Army, unit: Unit): Army =>
  produce(army, draft => {
    draft.units.push(unit);
    draft.totalPoints += unit.points;
  });

// ❌ Avoid: Complex useEffect chains
useEffect(() => {
  if (armyId) {
    loadArmy(armyId).then(army => {
      setArmy(army);
      if (army.units.length > 0) {
        validateArmy(army).then(validation => {
          setValidation(validation);
        });
      }
    });
  }
}, [armyId]);

// ✅ Prefer: Custom hooks with clear separation
const useArmyData = (armyId: string) => {
  const { data: army } = useQuery(['army', armyId], () => loadArmy(armyId));
  const { data: validation } = useQuery(
    ['validation', armyId], 
    () => validateArmy(army),
    { enabled: !!army && army.units.length > 0 }
  );
  
  return { army, validation };
};
```

### Mobile-Specific Best Practices

```typescript
// Performance: Use React.memo for expensive components
export const ExpensiveUnitList = memo<UnitListProps>(({ units, onUnitPress }) => {
  // Memoize expensive calculations
  const sortedUnits = useMemo(() => 
    units.sort((a, b) => a.name.localeCompare(b.name)),
    [units]
  );
  
  // Optimize callbacks
  const handleUnitPress = useCallback((unit: Unit) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onUnitPress(unit);
  }, [onUnitPress]);
  
  return (
    <FlatList
      data={sortedUnits}
      keyExtractor={unit => unit.id}
      renderItem={({ item }) => (
        <UnitCard unit={item} onPress={handleUnitPress} />
      )}
      getItemLayout={(data, index) => ({
        length: UNIT_CARD_HEIGHT,
        offset: UNIT_CARD_HEIGHT * index,
        index,
      })}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      windowSize={10}
    />
  );
});

// Accessibility: Always include accessibility props
export const AccessibleButton = ({ onPress, children, ...props }) => (
  <Pressable
    onPress={onPress}
    accessible={true}
    accessibilityRole="button"
    accessibilityHint="Double tap to activate"
    {...props}
  >
    {children}
  </Pressable>
);

// Touch Targets: Ensure minimum 44x44 touch targets
export const TouchTarget = styled(Pressable)`
  min-height: 44px;
  min-width: 44px;
  justify-content: center;
  align-items: center;
`;
```

---

## Conclusion

This mobile-first technical design transforms the Wargaming Roster Builder into a powerful native mobile application optimized for tournament play and competitive gaming. The functional programming approach ensures maintainable, testable code while the Expo framework provides rapid development and deployment capabilities.

**Key Technical Advantages:**
- **Offline-First Architecture**: Essential for tournament environments with poor connectivity
- **Functional Programming**: More maintainable and testable than class-based approaches  
- **Native Mobile Features**: Camera scanning, push notifications, and touch-optimized UI
- **Performance-First**: Optimized for 60fps interactions and battery efficiency
- **Developer Experience**: Expo's tooling enables rapid iteration and over-the-air updates

**Strategic Benefits:**
- **Mobile-Native Experience**: Designed specifically for mobile gaming scenarios
- **Tournament-Ready**: Offline capabilities and real-time sync for competitive play
- **Scalable Architecture**: Functional patterns support rapid feature development
- **Market Advantage**: Superior mobile experience vs. web-based competitors like BattleScribe

This architecture provides the foundation for building the definitive mobile wargaming tool that tournament players will prefer over existing alternatives.