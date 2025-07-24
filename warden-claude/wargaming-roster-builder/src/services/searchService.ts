// Search service using native JavaScript methods (no Ramda/currying)

import Fuse from 'fuse.js';
import type { SearchableUnit, SearchFilters } from '../types/army';

export interface SearchService {
  search: (query: string, filters?: SearchFilters) => SearchableUnit[];
  searchUnits: (query: string) => SearchableUnit[];
  filterUnits: (units: SearchableUnit[], filters: SearchFilters) => SearchableUnit[];
  findSimilarUnits: (targetUnit: SearchableUnit, limit?: number) => SearchableUnit[];
  getAvailableFactions: () => string[];
  getAvailableCategories: () => string[];
  getAvailableKeywords: () => string[];
}

/**
 * Create search service with functional approach (no classes)
 */
export const createSearchService = (units: SearchableUnit[]): SearchService => {
  // Initialize Fuse.js for fuzzy search
  const fuse = new Fuse(units, {
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

  /**
   * Apply filters to units array
   */
  const filterUnits = (unitsToFilter: SearchableUnit[], filters: SearchFilters): SearchableUnit[] => {
    return unitsToFilter.filter(unit => {
      // Faction filter (exact match)
      if (filters.faction && unit.faction !== filters.faction) {
        return false;
      }

      // Category filter (unit must have at least one matching category)
      if (filters.category && !unit.categories.includes(filters.category)) {
        return false;
      }

      // Points range filter
      if (filters.pointsMin !== undefined && unit.points < filters.pointsMin) {
        return false;
      }
      if (filters.pointsMax !== undefined && unit.points > filters.pointsMax) {
        return false;
      }

      // Keywords filter (unit must have at least one matching keyword)
      if (filters.keywords && filters.keywords.length > 0) {
        const hasMatchingKeyword = filters.keywords.some(keyword =>
          unit.keywords.some(unitKeyword =>
            unitKeyword.toLowerCase().includes(keyword.toLowerCase())
          )
        );
        if (!hasMatchingKeyword) {
          return false;
        }
      }

      // Abilities filter (unit must have at least one matching ability)
      if (filters.abilities && filters.abilities.length > 0) {
        const hasMatchingAbility = filters.abilities.some(ability =>
          unit.abilities.some(unitAbility =>
            unitAbility.toLowerCase().includes(ability.toLowerCase())
          )
        );
        if (!hasMatchingAbility) {
          return false;
        }
      }

      // Weapon type filter
      if (filters.hasWeaponType) {
        const hasWeaponType = unit.weapons.some(weapon =>
          weapon.type === filters.hasWeaponType
        );
        if (!hasWeaponType) {
          return false;
        }
      }

      return true;
    });
  };

  /**
   * Perform fuzzy search on units
   */
  const searchUnits = (query: string): SearchableUnit[] => {
    if (!query.trim()) {
      return units;
    }

    const results = fuse.search(query);
    return results.map(result => result.item);
  };

  /**
   * Main search function combining fuzzy search and filtering
   */
  const search = (query: string, filters: SearchFilters = {}): SearchableUnit[] => {
    let results: SearchableUnit[];

    // Start with fuzzy search if query exists, otherwise use all units
    if (query.trim()) {
      results = searchUnits(query);
    } else {
      results = [...units];
    }

    // Apply filters
    if (Object.keys(filters).length > 0) {
      results = filterUnits(results, filters);
    }

    // Sort results by relevance (points ascending for similar relevance)
    return results.sort((a, b) => {
      // If both have the same relevance score, sort by points
      return a.points - b.points;
    });
  };

  /**
   * Calculate similarity between two units
   */
  const calculateSimilarity = (unit1: SearchableUnit, unit2: SearchableUnit): number => {
    let score = 0;

    // Faction similarity (high weight)
    if (unit1.faction === unit2.faction) {
      score += 0.4;
    }

    // Category overlap
    const categoryIntersection = unit1.categories.filter(cat =>
      unit2.categories.includes(cat)
    );
    const categoryUnion = [...new Set([...unit1.categories, ...unit2.categories])];
    const categoryScore = categoryUnion.length > 0 ? categoryIntersection.length / categoryUnion.length : 0;
    score += categoryScore * 0.3;

    // Points similarity (inverse of relative difference)
    const maxPoints = Math.max(unit1.points, unit2.points);
    const pointsDiff = Math.abs(unit1.points - unit2.points);
    const pointsScore = maxPoints > 0 ? Math.max(0, 1 - pointsDiff / maxPoints) : 0;
    score += pointsScore * 0.2;

    // Keyword overlap
    const keywordIntersection = unit1.keywords.filter(keyword =>
      unit2.keywords.some(otherKeyword =>
        otherKeyword.toLowerCase().includes(keyword.toLowerCase()) ||
        keyword.toLowerCase().includes(otherKeyword.toLowerCase())
      )
    );
    const keywordUnion = [...new Set([...unit1.keywords, ...unit2.keywords])];
    const keywordScore = keywordUnion.length > 0 ? keywordIntersection.length / keywordUnion.length : 0;
    score += keywordScore * 0.1;

    return score;
  };

  /**
   * Find similar units to a target unit
   */
  const findSimilarUnits = (targetUnit: SearchableUnit, limit: number = 5): SearchableUnit[] => {
    return units
      .filter(unit => unit.id !== targetUnit.id)
      .map(unit => ({
        unit,
        similarity: calculateSimilarity(targetUnit, unit)
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit)
      .map(result => result.unit);
  };

  /**
   * Get all available factions
   */
  const getAvailableFactions = (): string[] => {
    const factions = new Set(units.map(unit => unit.faction));
    return Array.from(factions).sort();
  };

  /**
   * Get all available categories
   */
  const getAvailableCategories = (): string[] => {
    const categories = new Set(
      units.flatMap(unit => unit.categories)
    );
    return Array.from(categories).sort();
  };

  /**
   * Get all available keywords
   */
  const getAvailableKeywords = (): string[] => {
    const keywords = new Set(
      units.flatMap(unit => unit.keywords)
    );
    return Array.from(keywords).sort();
  };

  return {
    search,
    searchUnits,
    filterUnits,
    findSimilarUnits,
    getAvailableFactions,
    getAvailableCategories,
    getAvailableKeywords,
  };
};

/**
 * Helper function to create search filters from form data
 */
export const createSearchFilters = (formData: {
  faction?: string;
  category?: string;
  pointsMin?: string;
  pointsMax?: string;
  keywords?: string;
  abilities?: string;
  hasWeaponType?: 'melee' | 'ranged' | 'psychic';
}): SearchFilters => {
  const filters: SearchFilters = {};

  if (formData.faction && formData.faction !== 'all') {
    filters.faction = formData.faction;
  }

  if (formData.category && formData.category !== 'all') {
    filters.category = formData.category;
  }

  if (formData.pointsMin) {
    const min = parseInt(formData.pointsMin, 10);
    if (!isNaN(min) && min >= 0) {
      filters.pointsMin = min;
    }
  }

  if (formData.pointsMax) {
    const max = parseInt(formData.pointsMax, 10);
    if (!isNaN(max) && max >= 0) {
      filters.pointsMax = max;
    }
  }

  if (formData.keywords) {
    filters.keywords = formData.keywords
      .split(',')
      .map(keyword => keyword.trim())
      .filter(keyword => keyword.length > 0);
  }

  if (formData.abilities) {
    filters.abilities = formData.abilities
      .split(',')
      .map(ability => ability.trim())
      .filter(ability => ability.length > 0);
  }

  if (formData.hasWeaponType) {
    filters.hasWeaponType = formData.hasWeaponType;
  }

  return filters;
};

/**
 * Helper function to count search results
 */
export const getSearchResultsCount = (
  searchService: SearchService,
  query: string,
  filters: SearchFilters
): number => {
  return searchService.search(query, filters).length;
};

/**
 * Helper function to get search suggestions based on partial query
 */
export const getSearchSuggestions = (
  units: SearchableUnit[],
  partialQuery: string,
  limit: number = 5
): string[] => {
  if (!partialQuery.trim()) return [];

  const suggestions = new Set<string>();
  const query = partialQuery.toLowerCase();

  // Add unit name suggestions
  units.forEach(unit => {
    if (unit.name.toLowerCase().includes(query)) {
      suggestions.add(unit.name);
    }

    // Add faction suggestions
    if (unit.faction.toLowerCase().includes(query)) {
      suggestions.add(unit.faction);
    }

    // Add keyword suggestions
    unit.keywords.forEach(keyword => {
      if (keyword.toLowerCase().includes(query)) {
        suggestions.add(keyword);
      }
    });

    // Add ability suggestions
    unit.abilities.forEach(ability => {
      if (ability.toLowerCase().includes(query)) {
        suggestions.add(ability);
      }
    });
  });

  return Array.from(suggestions).slice(0, limit);
};