import { describe, it, expect, beforeEach } from 'vitest';
import { SearchService } from '@/services/searchService';
import { GameSystemData, Unit } from '@/types/battlescribe';

describe('SearchService', () => {
  let searchService: SearchService;
  let mockGameSystemData: GameSystemData;

  beforeEach(() => {
    // Create mock units for testing
    const mockUnits: Unit[] = [
      {
        id: 'intercessor-squad',
        name: 'Intercessor Squad',
        type: 'unit',
        hidden: false,
        costs: [{ name: 'pts', typeId: 'cost-type-1', value: 90 }],
        profiles: [
          {
            id: 'profile-1',
            name: 'Intercessor Squad',
            typeId: 'unit-profile',
            typeName: 'Unit',
            hidden: false,
            characteristics: [
              { name: 'M', typeId: 'char-1', value: '6"' },
              { name: 'T', typeId: 'char-2', value: '4' },
              { name: 'SV', typeId: 'char-3', value: '3+' },
            ],
          },
        ],
        abilities: [
          {
            id: 'ability-1',
            name: 'Oath of Moment',
            description: 'Select one enemy unit at the start of your Command phase.',
            hidden: false,
          },
        ],
        categoryLinks: [
          { id: 'link-1', name: 'Infantry', targetId: 'cat-1', primary: false, hidden: false },
          { id: 'link-2', name: 'Battleline', targetId: 'cat-2', primary: true, hidden: false },
        ],
        constraints: [],
        selectionEntryGroups: [],
        selectionEntries: [],
        entryLinks: [],
        infoLinks: [],
        modifiers: [],
        rules: [],
        weapons: [],
        faction: 'Adeptus Astartes',
      },
      {
        id: 'necron-warriors',
        name: 'Necron Warriors',
        type: 'unit',
        hidden: false,
        costs: [{ name: 'pts', typeId: 'cost-type-1', value: 90 }],
        profiles: [
          {
            id: 'profile-2',
            name: 'Necron Warriors',
            typeId: 'unit-profile',
            typeName: 'Unit',
            hidden: false,
            characteristics: [
              { name: 'M', typeId: 'char-1', value: '5"' },
              { name: 'T', typeId: 'char-2', value: '4' },
              { name: 'SV', typeId: 'char-3', value: '4+' },
            ],
          },
        ],
        abilities: [
          {
            id: 'ability-2',
            name: 'Reanimation Protocols',
            description: 'Roll a dice for each model that was destroyed.',
            hidden: false,
          },
        ],
        categoryLinks: [
          { id: 'link-3', name: 'Infantry', targetId: 'cat-1', primary: false, hidden: false },
          { id: 'link-4', name: 'Battleline', targetId: 'cat-2', primary: true, hidden: false },
        ],
        constraints: [],
        selectionEntryGroups: [],
        selectionEntries: [],
        entryLinks: [],
        infoLinks: [],
        modifiers: [],
        rules: [],
        weapons: [],
        faction: 'Necrons',
      },
    ];

    mockGameSystemData = {
      system: {
        id: 'test-system',
        name: 'Test System',
        revision: 1,
        battleScribeVersion: '2.03',
        costTypes: [],
        profileTypes: [],
        categoryEntries: [],
        forceEntries: [],
        publications: [],
        sharedRules: [],
        sharedProfiles: [],
        selectionEntries: [],
      },
      units: mockUnits,
      rules: [],
      weapons: [],
      categories: [],
    };

    searchService = new SearchService(mockGameSystemData);
  });

  describe('searchUnits', () => {
    it('should return all units when no query provided', () => {
      const results = searchService.searchUnits('');
      expect(results).toHaveLength(2);
    });

    it('should search by unit name', () => {
      const results = searchService.searchUnits('Intercessor');
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Intercessor Squad');
    });

    it('should search by faction', () => {
      const results = searchService.searchUnits('Necrons');
      expect(results).toHaveLength(1);
      expect(results[0].faction).toBe('Necrons');
    });

    it('should apply faction filter', () => {
      const results = searchService.searchUnits('', { faction: 'Adeptus Astartes' });
      expect(results).toHaveLength(1);
      expect(results[0].faction).toBe('Adeptus Astartes');
    });

    it('should apply category filter', () => {
      const results = searchService.searchUnits('', { category: 'Infantry' });
      expect(results).toHaveLength(2);
    });

    it('should apply points filter', () => {
      const results = searchService.searchUnits('', { pointsMin: 90, pointsMax: 90 });
      expect(results).toHaveLength(2);

      const noResults = searchService.searchUnits('', { pointsMin: 100, pointsMax: 200 });
      expect(noResults).toHaveLength(0);
    });
  });

  describe('getAvailableFactions', () => {
    it('should return unique factions', () => {
      const factions = searchService.getAvailableFactions();
      expect(factions).toEqual(['Adeptus Astartes', 'Necrons']);
    });
  });

  describe('getAvailableCategories', () => {
    it('should return unique categories', () => {
      const categories = searchService.getAvailableCategories();
      expect(categories).toEqual(['Battleline', 'Infantry']);
    });
  });

  describe('getPointsRange', () => {
    it('should return correct min and max points', () => {
      const range = searchService.getPointsRange();
      expect(range.min).toBe(90);
      expect(range.max).toBe(90);
    });
  });

  describe('getUnitById', () => {
    it('should find unit by ID', () => {
      const unit = searchService.getUnitById('intercessor-squad');
      expect(unit).toBeTruthy();
      expect(unit?.name).toBe('Intercessor Squad');
    });

    it('should return undefined for non-existent ID', () => {
      const unit = searchService.getUnitById('non-existent');
      expect(unit).toBeUndefined();
    });
  });

  describe('getUnitsByFaction', () => {
    it('should return units for specific faction', () => {
      const units = searchService.getUnitsByFaction('Necrons');
      expect(units).toHaveLength(1);
      expect(units[0].name).toBe('Necron Warriors');
    });
  });

  describe('getSimilarUnits', () => {
    it('should find similar units', () => {
      const unit = searchService.getUnitById('intercessor-squad')!;
      const similar = searchService.getSimilarUnits(unit, 5);
      
      expect(similar).toHaveLength(1);
      expect(similar[0].name).toBe('Necron Warriors');
    });
  });
});