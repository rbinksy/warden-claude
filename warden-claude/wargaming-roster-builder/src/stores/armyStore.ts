// Army store using Zustand with functional patterns (no Ramda/currying)

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { Army, ArmyUnit, SearchableUnit } from '../types/army';
import { validateArmy, calculateArmyPoints } from '../services/armyCalculations';

interface ArmyState {
  armies: Army[];
  currentArmy: Army | null;
  isLoading: boolean;
  error: string | null;
}

interface ArmyActions {
  // Army management
  loadArmies: () => Promise<void>;
  createArmy: (name: string, gameSystemId: string, gameSystemName: string, pointsLimit: number) => Promise<void>;
  selectArmy: (armyId: string) => Promise<void>;
  updateArmy: (updates: Partial<Army>) => Promise<void>;
  deleteArmy: (armyId: string) => Promise<void>;
  duplicateArmy: (armyId: string, newName: string) => Promise<void>;
  
  // Unit management
  addUnitToArmy: (unit: SearchableUnit) => Promise<void>;
  removeUnitFromArmy: (unitId: string) => Promise<void>;
  updateUnitCount: (unitId: string, count: number) => Promise<void>;
  updateUnitCustomizations: (unitId: string, customizations: any[]) => Promise<void>;
  
  // Validation and calculations
  validateCurrentArmy: () => void;
  recalculatePoints: () => void;
  
  // Error handling
  clearError: () => void;
  setError: (error: string) => void;
}

type ArmyStore = ArmyState & ArmyActions;

export const useArmyStore = create<ArmyStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        // Initial state
        armies: [],
        currentArmy: null,
        isLoading: false,
        error: null,

        // Army management actions
        loadArmies: async () => {
          set(state => {
            state.isLoading = true;
            state.error = null;
          });

          try {
            // In a real app, this would load from database/API
            // For now, we'll use the persisted state
            const persistedArmies = get().armies;
            
            set(state => {
              state.armies = persistedArmies;
              state.isLoading = false;
            });
          } catch (error) {
            set(state => {
              state.error = error instanceof Error ? error.message : 'Failed to load armies';
              state.isLoading = false;
            });
          }
        },

        createArmy: async (name: string, gameSystemId: string, gameSystemName: string, pointsLimit: number) => {
          const newArmy: Army = {
            id: `army_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name,
            gameSystemId,
            gameSystemName,
            pointsLimit,
            totalPoints: 0,
            units: [],
            forces: [{
              id: `force_${Date.now()}`,
              name: 'Main Force',
              catalogueId: gameSystemId,
              catalogueName: gameSystemName,
              selections: [],
              categories: []
            }],
            validationErrors: [],
            isValid: true,
            createdAt: Date.now(),
            updatedAt: Date.now()
          };

          set(state => {
            state.armies.unshift(newArmy);
            state.currentArmy = newArmy;
            state.error = null;
          });
        },

        selectArmy: async (armyId: string) => {
          const army = get().armies.find(a => a.id === armyId);
          
          if (army) {
            set(state => {
              state.currentArmy = army;
              state.error = null;
            });
          } else {
            set(state => {
              state.error = `Army with ID ${armyId} not found`;
            });
          }
        },

        updateArmy: async (updates: Partial<Army>) => {
          const { currentArmy } = get();
          if (!currentArmy) {
            set(state => {
              state.error = 'No army selected for update';
            });
            return;
          }

          set(state => {
            const armyIndex = state.armies.findIndex(a => a.id === currentArmy.id);
            if (armyIndex !== -1) {
              const updatedArmy = {
                ...currentArmy,
                ...updates,
                updatedAt: Date.now()
              };
              
              state.armies[armyIndex] = updatedArmy;
              state.currentArmy = updatedArmy;
              state.error = null;
            }
          });
        },

        deleteArmy: async (armyId: string) => {
          set(state => {
            state.armies = state.armies.filter(a => a.id !== armyId);
            
            if (state.currentArmy?.id === armyId) {
              state.currentArmy = null;
            }
            
            state.error = null;
          });
        },

        duplicateArmy: async (armyId: string, newName: string) => {
          const originalArmy = get().armies.find(a => a.id === armyId);
          
          if (!originalArmy) {
            set(state => {
              state.error = `Army with ID ${armyId} not found`;
            });
            return;
          }

          const duplicatedArmy: Army = {
            ...originalArmy,
            id: `army_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name: newName,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            forces: originalArmy.forces.map(force => ({
              ...force,
              id: `force_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              selections: force.selections.map(selection => ({
                ...selection,
                id: `selection_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
              }))
            }))
          };

          set(state => {
            state.armies.unshift(duplicatedArmy);
            state.error = null;
          });
        },

        // Unit management actions
        addUnitToArmy: async (unit: SearchableUnit) => {
          const { currentArmy } = get();
          if (!currentArmy) {
            set(state => {
              state.error = 'No army selected';
            });
            return;
          }

          // Check if unit already exists
          const existingUnitIndex = currentArmy.units.findIndex(u => u.unitId === unit.id);
          
          set(state => {
            if (!state.currentArmy) return;

            if (existingUnitIndex !== -1) {
              // Increment count of existing unit
              state.currentArmy.units[existingUnitIndex].count += 1;
              state.currentArmy.units[existingUnitIndex].totalPoints = 
                state.currentArmy.units[existingUnitIndex].points * 
                state.currentArmy.units[existingUnitIndex].count;
            } else {
              // Add new unit
              const newArmyUnit: ArmyUnit = {
                id: `armyunit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                unitId: unit.id,
                name: unit.name,
                faction: unit.faction,
                count: 1,
                points: unit.points,
                totalPoints: unit.points,
                categories: unit.categories,
                profiles: [{
                  id: `profile_${unit.id}`,
                  name: unit.name,
                  profileType: 'Unit',
                  characteristics: unit.characteristics
                }],
                abilities: unit.abilities.map(ability => ({
                  id: `ability_${Math.random().toString(36).substr(2, 9)}`,
                  name: ability,
                  description: ability,
                  type: 'ability' as const
                })),
                weapons: unit.weapons.map(weapon => ({
                  id: `weapon_${Math.random().toString(36).substr(2, 9)}`,
                  name: weapon.name,
                  profiles: weapon.profiles,
                  abilities: [],
                  type: weapon.type
                })),
                keywords: unit.keywords,
                customizations: []
              };

              state.currentArmy.units.push(newArmyUnit);
            }

            // Recalculate total points
            state.currentArmy.totalPoints = calculateArmyPoints(state.currentArmy);
            
            // Update validation
            const validation = validateArmy(state.currentArmy);
            state.currentArmy.isValid = validation.isValid;
            state.currentArmy.validationErrors = validation.errors.map(e => e.message);
            
            state.currentArmy.updatedAt = Date.now();
            
            // Update the army in the armies array
            const armyIndex = state.armies.findIndex(a => a.id === state.currentArmy!.id);
            if (armyIndex !== -1) {
              state.armies[armyIndex] = state.currentArmy;
            }
            
            state.error = null;
          });
        },

        removeUnitFromArmy: async (unitId: string) => {
          const { currentArmy } = get();
          if (!currentArmy) {
            set(state => {
              state.error = 'No army selected';
            });
            return;
          }

          set(state => {
            if (!state.currentArmy) return;

            const unitIndex = state.currentArmy.units.findIndex(u => u.id === unitId);
            if (unitIndex !== -1) {
              const unit = state.currentArmy.units[unitIndex];
              
              if (unit.count > 1) {
                // Decrease count
                unit.count -= 1;
                unit.totalPoints = unit.points * unit.count;
              } else {
                // Remove unit entirely
                state.currentArmy.units.splice(unitIndex, 1);
              }

              // Recalculate total points
              state.currentArmy.totalPoints = calculateArmyPoints(state.currentArmy);
              
              // Update validation
              const validation = validateArmy(state.currentArmy);
              state.currentArmy.isValid = validation.isValid;
              state.currentArmy.validationErrors = validation.errors.map(e => e.message);
              
              state.currentArmy.updatedAt = Date.now();
              
              // Update the army in the armies array
              const armyIndex = state.armies.findIndex(a => a.id === state.currentArmy!.id);
              if (armyIndex !== -1) {
                state.armies[armyIndex] = state.currentArmy;
              }
            }
            
            state.error = null;
          });
        },

        updateUnitCount: async (unitId: string, count: number) => {
          const { currentArmy } = get();
          if (!currentArmy) {
            set(state => {
              state.error = 'No army selected';
            });
            return;
          }

          if (count < 0) {
            set(state => {
              state.error = 'Unit count cannot be negative';
            });
            return;
          }

          set(state => {
            if (!state.currentArmy) return;

            const unitIndex = state.currentArmy.units.findIndex(u => u.id === unitId);
            if (unitIndex !== -1) {
              if (count === 0) {
                // Remove unit
                state.currentArmy.units.splice(unitIndex, 1);
              } else {
                // Update count
                const unit = state.currentArmy.units[unitIndex];
                unit.count = count;
                unit.totalPoints = unit.points * count;
              }

              // Recalculate total points
              state.currentArmy.totalPoints = calculateArmyPoints(state.currentArmy);
              
              // Update validation
              const validation = validateArmy(state.currentArmy);
              state.currentArmy.isValid = validation.isValid;
              state.currentArmy.validationErrors = validation.errors.map(e => e.message);
              
              state.currentArmy.updatedAt = Date.now();
              
              // Update the army in the armies array
              const armyIndex = state.armies.findIndex(a => a.id === state.currentArmy!.id);
              if (armyIndex !== -1) {
                state.armies[armyIndex] = state.currentArmy;
              }
            }
            
            state.error = null;
          });
        },

        updateUnitCustomizations: async (unitId: string, customizations: any[]) => {
          const { currentArmy } = get();
          if (!currentArmy) {
            set(state => {
              state.error = 'No army selected';
            });
            return;
          }

          set(state => {
            if (!state.currentArmy) return;

            const unitIndex = state.currentArmy.units.findIndex(u => u.id === unitId);
            if (unitIndex !== -1) {
              state.currentArmy.units[unitIndex].customizations = customizations;
              state.currentArmy.updatedAt = Date.now();
              
              // Update the army in the armies array
              const armyIndex = state.armies.findIndex(a => a.id === state.currentArmy!.id);
              if (armyIndex !== -1) {
                state.armies[armyIndex] = state.currentArmy;
              }
            }
            
            state.error = null;
          });
        },

        // Validation and calculation actions
        validateCurrentArmy: () => {
          const { currentArmy } = get();
          if (!currentArmy) return;

          set(state => {
            if (!state.currentArmy) return;

            const validation = validateArmy(state.currentArmy);
            state.currentArmy.isValid = validation.isValid;
            state.currentArmy.validationErrors = validation.errors.map(e => e.message);
            state.currentArmy.updatedAt = Date.now();
            
            // Update the army in the armies array
            const armyIndex = state.armies.findIndex(a => a.id === state.currentArmy!.id);
            if (armyIndex !== -1) {
              state.armies[armyIndex] = state.currentArmy;
            }
          });
        },

        recalculatePoints: () => {
          const { currentArmy } = get();
          if (!currentArmy) return;

          set(state => {
            if (!state.currentArmy) return;

            state.currentArmy.totalPoints = calculateArmyPoints(state.currentArmy);
            state.currentArmy.updatedAt = Date.now();
            
            // Update the army in the armies array
            const armyIndex = state.armies.findIndex(a => a.id === state.currentArmy!.id);
            if (armyIndex !== -1) {
              state.armies[armyIndex] = state.currentArmy;
            }
          });
        },

        // Error handling actions
        clearError: () => {
          set(state => {
            state.error = null;
          });
        },

        setError: (error: string) => {
          set(state => {
            state.error = error;
          });
        }
      })),
      {
        name: 'army-store',
        // Only persist armies, not UI state
        partialize: (state) => ({
          armies: state.armies,
        })
      }
    ),
    {
      name: 'army-store'
    }
  )
);