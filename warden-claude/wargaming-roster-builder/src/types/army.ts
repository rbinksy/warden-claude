// Core army and unit types for the mobile wargaming app

export interface Army {
  id: string;
  name: string;
  gameSystemId: string;
  gameSystemName: string;
  pointsLimit: number;
  totalPoints: number;
  units: ArmyUnit[];
  forces: Force[];
  validationErrors?: string[];
  isValid: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface ArmyUnit {
  id: string;
  unitId: string;
  name: string;
  faction: string;
  count: number;
  points: number;
  totalPoints: number;
  categories: string[];
  profiles: UnitProfile[];
  abilities: Ability[];
  weapons: Weapon[];
  keywords: string[];
  customizations?: UnitCustomization[];
}

export interface Force {
  id: string;
  name: string;
  catalogueId: string;
  catalogueName: string;
  selections: Selection[];
  categories: CategoryEntry[];
}

export interface Selection {
  id: string;
  name: string;
  unitId: string;
  count: number;
  costs: Cost[];
  profiles: UnitProfile[];
  selections?: Selection[]; // Sub-selections (upgrades, weapons, etc.)
}

export interface UnitProfile {
  id: string;
  name: string;
  profileType: string;
  characteristics: Record<string, string>;
}

export interface Ability {
  id: string;
  name: string;
  description: string;
  type: 'rule' | 'ability' | 'special-rule';
  keywords?: string[];
}

export interface Weapon {
  id: string;
  name: string;
  profiles: WeaponProfile[];
  abilities: Ability[];
  type: 'melee' | 'ranged' | 'psychic';
}

export interface WeaponProfile {
  id: string;
  name: string;
  range: string;
  attacks: string;
  ballistic_skill?: string;
  weapon_skill?: string;
  strength: string;
  armor_penetration: string;
  damage: string;
  abilities?: string[];
  keywords?: string[];
}

export interface Cost {
  name: string;
  typeId: string;
  value: number;
}

export interface CategoryEntry {
  id: string;
  name: string;
  primary: boolean;
  selections: number;
  minimum?: number;
  maximum?: number;
}

export interface UnitCustomization {
  id: string;
  name: string;
  type: 'weapon' | 'upgrade' | 'wargear';
  cost: Cost[];
  description?: string;
}

// Search and filtering types
export interface SearchableUnit {
  id: string;
  name: string;
  faction: string;
  categories: string[];
  points: number;
  powerLevel?: number;
  abilities: string[];
  keywords: string[];
  characteristics: Record<string, string>;
  weapons: SearchableWeapon[];
}

export interface SearchableWeapon {
  name: string;
  type: 'melee' | 'ranged' | 'psychic';
  profiles: WeaponProfile[];
}

export interface SearchFilters {
  faction?: string;
  category?: string;
  pointsMin?: number;
  pointsMax?: number;
  keywords?: string[];
  abilities?: string[];
  hasWeaponType?: 'melee' | 'ranged' | 'psychic';
}

// Army validation types
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  id: string;
  type: 'points-limit' | 'force-organization' | 'unit-restriction' | 'wargear-restriction';
  message: string;
  unitId?: string;
  selectionId?: string;
}

export interface ValidationWarning {
  id: string;
  type: 'suboptimal' | 'missing-wargear' | 'meta-suggestion';
  message: string;
  unitId?: string;
  suggestion?: string;
}

// Army building state types
export interface ArmyBuilderState {
  currentArmy: Army | null;
  isDirty: boolean;
  lastSaved: number | null;
  validationResult: ValidationResult | null;
}

// Export formats
export type ExportFormat = 'json' | 'text' | 'battlescribe' | 'pdf';

export interface ExportOptions {
  format: ExportFormat;
  includePoints: boolean;
  includeAbilities: boolean;
  includeWeapons: boolean;
  compact: boolean;
}

// Army statistics
export interface ArmyStatistics {
  totalUnits: number;
  totalModels: number;
  totalPoints: number;
  averagePointsPerUnit: number;
  mostExpensiveUnit: ArmyUnit | null;
  factionBreakdown: Record<string, number>;
  categoryBreakdown: Record<string, number>;
  keywordFrequency: Record<string, number>;
}