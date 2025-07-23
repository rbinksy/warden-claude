import Fuse from 'fuse.js';
import { Unit, SearchableUnit, SearchFilters, GameSystemData } from '@/types/battlescribe';

export class SearchService {
  private unitSearchIndex: Fuse<SearchableUnit>;
  private searchableUnits: SearchableUnit[];

  constructor(gameSystemData: GameSystemData) {
    this.searchableUnits = this.createSearchableUnits(gameSystemData.units);
    this.unitSearchIndex = this.createSearchIndex();
  }

  private createSearchableUnits(units: Unit[]): SearchableUnit[] {
    return units.map(unit => {
      const pointsCost = unit.costs.find(cost => cost.name === 'pts')?.value || 0;
      const unitProfile = unit.profiles.find(p => p.typeName === 'Unit');
      const characteristics = unitProfile?.characteristics.reduce((acc, char) => {
        acc[char.name] = char.value;
        return acc;
      }, {} as Record<string, string>) || {};

      return {
        id: unit.id,
        name: unit.name,
        faction: unit.faction,
        type: unit.type,
        categories: unit.categoryLinks.map(link => link.name),
        points: pointsCost,
        abilities: unit.abilities.map(ability => ability.description),
        rules: unit.rules.map(rule => rule.description),
        keywords: this.extractKeywords(unit),
        characteristics,
      };
    });
  }

  private extractKeywords(unit: Unit): string[] {
    const keywords: string[] = [];
    
    // Extract keywords from weapon profiles
    unit.weapons.forEach(weapon => {
      keywords.push(...weapon.keywords);
    });

    // Extract keywords from category links
    unit.categoryLinks.forEach(link => {
      keywords.push(link.name);
    });

    // Remove duplicates
    return [...new Set(keywords)];
  }

  private createSearchIndex(): Fuse<SearchableUnit> {
    const options: Fuse.IFuseOptions<SearchableUnit> = {
      keys: [
        { name: 'name', weight: 0.4 },
        { name: 'faction', weight: 0.2 },
        { name: 'categories', weight: 0.15 },
        { name: 'abilities', weight: 0.1 },
        { name: 'rules', weight: 0.1 },
        { name: 'keywords', weight: 0.05 },
      ],
      threshold: 0.3,
      includeScore: true,
      includeMatches: true,
      ignoreLocation: true,
      useExtendedSearch: true,
    };

    return new Fuse(this.searchableUnits, options);
  }

  searchUnits(query: string, filters?: SearchFilters): SearchableUnit[] {
    let results = this.searchableUnits;

    // Apply text search if query provided
    if (query.trim()) {
      const searchResults = this.unitSearchIndex.search(query);
      results = searchResults.map(result => result.item);
    }

    // Apply filters
    if (filters) {
      results = this.applyFilters(results, filters);
    }

    return results;
  }

  private applyFilters(units: SearchableUnit[], filters: SearchFilters): SearchableUnit[] {
    let filteredUnits = units;

    if (filters.faction) {
      filteredUnits = filteredUnits.filter(unit => 
        unit.faction.toLowerCase().includes(filters.faction!.toLowerCase())
      );
    }

    if (filters.category) {
      filteredUnits = filteredUnits.filter(unit =>
        unit.categories.some(cat => 
          cat.toLowerCase().includes(filters.category!.toLowerCase())
        )
      );
    }

    if (filters.pointsMin !== undefined) {
      filteredUnits = filteredUnits.filter(unit => unit.points >= filters.pointsMin!);
    }

    if (filters.pointsMax !== undefined) {
      filteredUnits = filteredUnits.filter(unit => unit.points <= filters.pointsMax!);
    }

    if (filters.keywords && filters.keywords.length > 0) {
      filteredUnits = filteredUnits.filter(unit =>
        filters.keywords!.some(keyword =>
          unit.keywords.some(unitKeyword =>
            unitKeyword.toLowerCase().includes(keyword.toLowerCase())
          )
        )
      );
    }

    return filteredUnits;
  }

  getAvailableFactions(): string[] {
    const factions = [...new Set(this.searchableUnits.map(unit => unit.faction))];
    return factions.sort();
  }

  getAvailableCategories(): string[] {
    const categories = new Set<string>();
    this.searchableUnits.forEach(unit => {
      unit.categories.forEach(cat => categories.add(cat));
    });
    return [...categories].sort();
  }

  getAvailableKeywords(): string[] {
    const keywords = new Set<string>();
    this.searchableUnits.forEach(unit => {
      unit.keywords.forEach(keyword => keywords.add(keyword));
    });
    return [...keywords].sort();
  }

  getPointsRange(): { min: number; max: number } {
    const points = this.searchableUnits.map(unit => unit.points).filter(p => p > 0);
    return {
      min: Math.min(...points),
      max: Math.max(...points),
    };
  }

  getUnitById(id: string): SearchableUnit | undefined {
    return this.searchableUnits.find(unit => unit.id === id);
  }

  getUnitsByFaction(faction: string): SearchableUnit[] {
    return this.searchableUnits.filter(unit => 
      unit.faction.toLowerCase() === faction.toLowerCase()
    );
  }

  getUnitsByCategory(category: string): SearchableUnit[] {
    return this.searchableUnits.filter(unit =>
      unit.categories.some(cat => 
        cat.toLowerCase() === category.toLowerCase()
      )
    );
  }

  getSimilarUnits(unit: SearchableUnit, limit = 5): SearchableUnit[] {
    // Find units with similar characteristics, keywords, or faction
    const similar = this.searchableUnits
      .filter(u => u.id !== unit.id)
      .map(u => ({
        unit: u,
        similarity: this.calculateSimilarity(unit, u),
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit)
      .map(item => item.unit);

    return similar;
  }

  private calculateSimilarity(unit1: SearchableUnit, unit2: SearchableUnit): number {
    let score = 0;

    // Same faction bonus
    if (unit1.faction === unit2.faction) score += 0.3;

    // Shared categories
    const sharedCategories = unit1.categories.filter(cat => 
      unit2.categories.includes(cat)
    ).length;
    score += (sharedCategories / Math.max(unit1.categories.length, unit2.categories.length)) * 0.2;

    // Shared keywords
    const sharedKeywords = unit1.keywords.filter(keyword => 
      unit2.keywords.includes(keyword)
    ).length;
    score += (sharedKeywords / Math.max(unit1.keywords.length, unit2.keywords.length)) * 0.2;

    // Similar point costs
    const pointsDiff = Math.abs(unit1.points - unit2.points);
    const maxPoints = Math.max(unit1.points, unit2.points);
    if (maxPoints > 0) {
      score += (1 - pointsDiff / maxPoints) * 0.1;
    }

    // Similar characteristics (if both have them)
    const char1Keys = Object.keys(unit1.characteristics);
    const char2Keys = Object.keys(unit2.characteristics);
    const commonCharKeys = char1Keys.filter(key => char2Keys.includes(key));
    
    if (commonCharKeys.length > 0) {
      const charSimilarity = commonCharKeys.reduce((acc, key) => {
        return acc + (unit1.characteristics[key] === unit2.characteristics[key] ? 1 : 0);
      }, 0) / commonCharKeys.length;
      score += charSimilarity * 0.2;
    }

    return score;
  }

  updateData(gameSystemData: GameSystemData): void {
    this.searchableUnits = this.createSearchableUnits(gameSystemData.units);
    this.unitSearchIndex = this.createSearchIndex();
  }
}