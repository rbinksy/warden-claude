import { create } from 'zustand';
import { Roster, Force, Selection } from '@/types/roster';
import { SearchableUnit } from '@/types/battlescribe';

interface RosterState {
  // Current roster
  currentRoster: Roster | null;
  savedRosters: Roster[];

  // UI State
  isEditingRoster: boolean;
  selectedForce: string | null;

  // Actions
  createNewRoster: (name: string, gameSystemId: string, gameSystemName: string, pointsLimit: number) => void;
  loadRoster: (rosterId: string) => void;
  saveRoster: () => void;
  deleteRoster: (rosterId: string) => void;
  
  updateRosterName: (name: string) => void;
  updatePointsLimit: (limit: number) => void;
  
  addUnitToRoster: (unit: SearchableUnit, forceId?: string) => void;
  removeUnitFromRoster: (selectionId: string) => void;
  updateUnitCount: (selectionId: string, count: number) => void;
  
  createForce: (name: string, catalogueId: string, catalogueName: string) => void;
  deleteForce: (forceId: string) => void;
  selectForce: (forceId: string | null) => void;
  
  calculateTotalPoints: () => number;
  validateRoster: () => { isValid: boolean; errors: string[] };
  
  exportRoster: (format: 'json' | 'text' | 'battlescribe') => string;
}

export const useRosterStore = create<RosterState>((set, get) => ({
  // Initial state
  currentRoster: null,
  savedRosters: [],
  isEditingRoster: false,
  selectedForce: null,

  // Actions
  createNewRoster: (name: string, gameSystemId: string, gameSystemName: string, pointsLimit: number) => {
    const newRoster: Roster = {
      id: crypto.randomUUID(),
      name,
      gameSystemId,
      gameSystemName,
      pointsLimit,
      totalPoints: 0,
      forces: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    set({ 
      currentRoster: newRoster,
      isEditingRoster: true,
    });
  },

  loadRoster: (rosterId: string) => {
    const { savedRosters } = get();
    const roster = savedRosters.find(r => r.id === rosterId);
    if (roster) {
      set({ 
        currentRoster: { ...roster },
        isEditingRoster: true,
      });
    }
  },

  saveRoster: () => {
    const { currentRoster, savedRosters } = get();
    if (!currentRoster) return;

    const updatedRoster = {
      ...currentRoster,
      updatedAt: new Date(),
      totalPoints: get().calculateTotalPoints(),
    };

    const existingIndex = savedRosters.findIndex(r => r.id === currentRoster.id);
    let newSavedRosters;

    if (existingIndex >= 0) {
      newSavedRosters = [...savedRosters];
      newSavedRosters[existingIndex] = updatedRoster;
    } else {
      newSavedRosters = [...savedRosters, updatedRoster];
    }

    set({
      currentRoster: updatedRoster,
      savedRosters: newSavedRosters,
    });

    // In a real app, you'd also save to localStorage or send to server
    localStorage.setItem('wargaming-rosters', JSON.stringify(newSavedRosters));
  },

  deleteRoster: (rosterId: string) => {
    const { savedRosters, currentRoster } = get();
    const newSavedRosters = savedRosters.filter(r => r.id !== rosterId);
    
    set({
      savedRosters: newSavedRosters,
      currentRoster: currentRoster?.id === rosterId ? null : currentRoster,
    });

    localStorage.setItem('wargaming-rosters', JSON.stringify(newSavedRosters));
  },

  updateRosterName: (name: string) => {
    const { currentRoster } = get();
    if (!currentRoster) return;

    set({
      currentRoster: {
        ...currentRoster,
        name,
        updatedAt: new Date(),
      },
    });
  },

  updatePointsLimit: (limit: number) => {
    const { currentRoster } = get();
    if (!currentRoster) return;

    set({
      currentRoster: {
        ...currentRoster,
        pointsLimit: limit,
        updatedAt: new Date(),
      },
    });
  },

  addUnitToRoster: (unit: SearchableUnit, forceId?: string) => {
    const { currentRoster } = get();
    if (!currentRoster) return;

    // Create or find the force
    let targetForce: Force;
    let updatedForces = [...currentRoster.forces];

    if (forceId) {
      const forceIndex = updatedForces.findIndex(f => f.id === forceId);
      if (forceIndex >= 0) {
        targetForce = { ...updatedForces[forceIndex] };
        updatedForces[forceIndex] = targetForce;
      } else {
        // Force not found, create default
        targetForce = {
          id: crypto.randomUUID(),
          name: 'Primary Force',
          catalogueId: 'default-catalogue',
          catalogueName: unit.faction,
          selections: [],
          categories: [],
        };
        updatedForces.push(targetForce);
      }
    } else {
      // Use first force or create default
      if (updatedForces.length > 0) {
        targetForce = { ...updatedForces[0] };
        updatedForces[0] = targetForce;
      } else {
        targetForce = {
          id: crypto.randomUUID(),
          name: 'Primary Force',
          catalogueId: 'default-catalogue',
          catalogueName: unit.faction,
          selections: [],
          categories: [],
        };
        updatedForces.push(targetForce);
      }
    }

    // Create the selection
    const newSelection: Selection = {
      id: crypto.randomUUID(),
      name: unit.name,
      entryId: unit.id,
      type: unit.type,
      number: 1,
      costs: [{ name: 'pts', value: unit.points }],
      selections: [],
      profiles: [],
      rules: [],
      categories: unit.categories.map(cat => ({
        id: crypto.randomUUID(),
        name: cat,
        entryId: unit.id,
        primary: cat === unit.categories[0],
      })),
    };

    targetForce.selections = [...targetForce.selections, newSelection];

    set({
      currentRoster: {
        ...currentRoster,
        forces: updatedForces,
        updatedAt: new Date(),
      },
    });
  },

  removeUnitFromRoster: (selectionId: string) => {
    const { currentRoster } = get();
    if (!currentRoster) return;

    const updatedForces = currentRoster.forces.map(force => ({
      ...force,
      selections: force.selections.filter(s => s.id !== selectionId),
    }));

    set({
      currentRoster: {
        ...currentRoster,
        forces: updatedForces,
        updatedAt: new Date(),
      },
    });
  },

  updateUnitCount: (selectionId: string, count: number) => {
    const { currentRoster } = get();
    if (!currentRoster || count < 1) return;

    const updatedForces = currentRoster.forces.map(force => ({
      ...force,
      selections: force.selections.map(selection =>
        selection.id === selectionId
          ? { ...selection, number: count }
          : selection
      ),
    }));

    set({
      currentRoster: {
        ...currentRoster,
        forces: updatedForces,
        updatedAt: new Date(),
      },
    });
  },

  createForce: (name: string, catalogueId: string, catalogueName: string) => {
    const { currentRoster } = get();
    if (!currentRoster) return;

    const newForce: Force = {
      id: crypto.randomUUID(),
      name,
      catalogueId,
      catalogueName,
      selections: [],
      categories: [],
    };

    set({
      currentRoster: {
        ...currentRoster,
        forces: [...currentRoster.forces, newForce],
        updatedAt: new Date(),
      },
    });
  },

  deleteForce: (forceId: string) => {
    const { currentRoster, selectedForce } = get();
    if (!currentRoster) return;

    const updatedForces = currentRoster.forces.filter(f => f.id !== forceId);

    set({
      currentRoster: {
        ...currentRoster,
        forces: updatedForces,
        updatedAt: new Date(),
      },
      selectedForce: selectedForce === forceId ? null : selectedForce,
    });
  },

  selectForce: (forceId: string | null) => {
    set({ selectedForce: forceId });
  },

  calculateTotalPoints: () => {
    const { currentRoster } = get();
    if (!currentRoster) return 0;

    return currentRoster.forces.reduce((total, force) => {
      return total + force.selections.reduce((forceTotal, selection) => {
        const unitPoints = selection.costs.find(cost => cost.name === 'pts')?.value || 0;
        return forceTotal + (unitPoints * selection.number);
      }, 0);
    }, 0);
  },

  validateRoster: () => {
    const { currentRoster } = get();
    if (!currentRoster) {
      return { isValid: false, errors: ['No roster loaded'] };
    }

    const errors: string[] = [];

    // Check points limit
    const totalPoints = get().calculateTotalPoints();
    if (totalPoints > currentRoster.pointsLimit) {
      errors.push(`Roster exceeds points limit: ${totalPoints}/${currentRoster.pointsLimit}`);
    }

    // Check minimum units (basic validation)
    const totalUnits = currentRoster.forces.reduce(
      (total, force) => total + force.selections.length,
      0
    );
    
    if (totalUnits === 0) {
      errors.push('Roster must contain at least one unit');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  exportRoster: (format: 'json' | 'text' | 'battlescribe') => {
    const { currentRoster } = get();
    if (!currentRoster) return '';

    switch (format) {
      case 'json':
        return JSON.stringify(currentRoster, null, 2);
      
      case 'text':
        return generateTextExport(currentRoster);
      
      case 'battlescribe':
        return generateBattleScribeExport(currentRoster);
      
      default:
        return '';
    }
  },
}));

function generateTextExport(roster: Roster): string {
  let output = `${roster.name}\n`;
  output += `${roster.gameSystemName}\n`;
  output += `Points: ${roster.totalPoints}/${roster.pointsLimit}\n\n`;

  roster.forces.forEach(force => {
    output += `## ${force.name} (${force.catalogueName})\n\n`;
    
    force.selections.forEach(selection => {
      const unitPoints = selection.costs.find(cost => cost.name === 'pts')?.value || 0;
      const totalPoints = unitPoints * selection.number;
      
      output += `- ${selection.name}`;
      if (selection.number > 1) {
        output += ` x${selection.number}`;
      }
      output += ` [${totalPoints}pts]\n`;
    });
    
    output += '\n';
  });

  return output;
}

function generateBattleScribeExport(roster: Roster): string {
  // This would generate actual BattleScribe XML format
  // For now, return a simplified version
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<roster id="${roster.id}" name="${roster.name}" battleScribeVersion="2.03" gameSystemId="${roster.gameSystemId}" gameSystemName="${roster.gameSystemName}">
  <costs>
    <cost name="pts" typeId="51b2-306e-1021-d207" value="${roster.totalPoints}"/>
  </costs>
  <forces>
    ${roster.forces.map(force => `
    <force id="${force.id}" name="${force.name}" entryId="${force.catalogueId}" catalogueId="${force.catalogueId}" catalogueName="${force.catalogueName}">
      <selections>
        ${force.selections.map(selection => `
        <selection id="${selection.id}" name="${selection.name}" entryId="${selection.entryId}" number="${selection.number}" type="${selection.type}">
          <costs>
            ${selection.costs.map(cost => `<cost name="${cost.name}" value="${cost.value}"/>`).join('')}
          </costs>
        </selection>`).join('')}
      </selections>
    </force>`).join('')}
  </forces>
</roster>`;
}