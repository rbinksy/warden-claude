export interface GameSystem {
  id: string;
  name: string;
  revision: number;
  battleScribeVersion: string;
  costTypes: CostType[];
  profileTypes: ProfileType[];
  categoryEntries: CategoryEntry[];
  forceEntries: ForceEntry[];
  publications: Publication[];
  sharedRules: Rule[];
  sharedProfiles: Profile[];
  selectionEntries: SelectionEntry[];
}

export interface CostType {
  id: string;
  name: string;
  defaultCostLimit: number;
  hidden: boolean;
}

export interface ProfileType {
  id: string;
  name: string;
  characteristicTypes: CharacteristicType[];
}

export interface CharacteristicType {
  id: string;
  name: string;
}

export interface Publication {
  id: string;
  name: string;
  shortName?: string;
  publisher?: string;
  publisherUrl?: string;
}

export interface CategoryEntry {
  id: string;
  name: string;
  hidden: boolean;
}

export interface ForceEntry {
  id: string;
  name: string;
  hidden: boolean;
  categoryLinks: CategoryLink[];
  constraints: Constraint[];
}

export interface Unit {
  id: string;
  name: string;
  type: 'unit' | 'model' | 'upgrade';
  hidden: boolean;
  costs: Cost[];
  profiles: Profile[];
  abilities: Ability[];
  categoryLinks: CategoryLink[];
  constraints: Constraint[];
  selectionEntryGroups: SelectionEntryGroup[];
  selectionEntries: SelectionEntry[];
  entryLinks: EntryLink[];
  infoLinks: InfoLink[];
  modifiers: Modifier[];
  rules: Rule[];
  weapons: Weapon[];
  faction: string;
}

export interface SelectionEntry {
  id: string;
  name: string;
  type: 'unit' | 'model' | 'upgrade';
  hidden: boolean;
  costs?: Cost[];
  profiles?: Profile[];
  categoryLinks?: CategoryLink[];
  constraints?: Constraint[];
  selectionEntryGroups?: SelectionEntryGroup[];
  selectionEntries?: SelectionEntry[];
  entryLinks?: EntryLink[];
  infoLinks?: InfoLink[];
  modifiers?: Modifier[];
  collective?: boolean;
  import?: boolean;
}

export interface SelectionEntryGroup {
  id: string;
  name: string;
  hidden: boolean;
  defaultSelectionEntryId?: string;
  constraints: Constraint[];
  selectionEntries: SelectionEntry[];
  entryLinks: EntryLink[];
}

export interface Cost {
  name: string;
  typeId: string;
  value: number;
}

export interface Profile {
  id: string;
  name: string;
  typeId: string;
  typeName: string;
  hidden: boolean;
  characteristics: Characteristic[];
}

export interface Characteristic {
  name: string;
  typeId: string;
  value: string;
}

export interface Ability {
  id: string;
  name: string;
  description: string;
  hidden: boolean;
}

export interface CategoryLink {
  id: string;
  name: string;
  targetId: string;
  primary: boolean;
  hidden: boolean;
}

export interface Constraint {
  id: string;
  type: 'min' | 'max';
  value: number;
  field: string;
  scope: string;
  shared: boolean;
  includeChildSelections?: boolean;
  includeChildForces?: boolean;
  childId?: string;
}

export interface EntryLink {
  id: string;
  name: string;
  targetId: string;
  type: 'selectionEntry' | 'selectionEntryGroup';
  hidden: boolean;
  collective?: boolean;
  import?: boolean;
  constraints?: Constraint[];
  costs?: Cost[];
}

export interface InfoLink {
  id: string;
  name: string;
  targetId: string;
  type: 'rule' | 'profile' | 'infoGroup';
  hidden: boolean;
}

export interface Rule {
  id: string;
  name: string;
  description: string;
  hidden: boolean;
  publicationId?: string;
  page?: string;
}

export interface Modifier {
  type: 'set' | 'increment' | 'decrement' | 'append' | 'add' | 'remove';
  field: string;
  value: string;
  conditions?: Condition[];
  conditionGroups?: ConditionGroup[];
}

export interface Condition {
  type: 'lessThan' | 'greaterThan' | 'equalTo' | 'notEqualTo' | 'atLeast' | 'atMost' | 'instanceOf' | 'notInstanceOf';
  value: number;
  field: string;
  scope: string;
  childId: string;
  shared: boolean;
  includeChildSelections?: boolean;
  includeChildForces?: boolean;
}

export interface ConditionGroup {
  type: 'and' | 'or';
  conditions: Condition[];
  conditionGroups?: ConditionGroup[];
}

export interface Weapon {
  id: string;
  name: string;
  type: 'ranged' | 'melee';
  range?: string;
  attacks: string;
  ballistic_skill?: string;
  weapon_skill?: string;
  strength: string;
  armor_penetration: string;
  damage: string;
  keywords: string[];
  abilities: string[];
}

// Search and UI types
export interface SearchableUnit {
  id: string;
  name: string;
  faction: string;
  type: string;
  categories: string[];
  points: number;
  abilities: string[];
  rules: string[];
  keywords: string[];
  characteristics: Record<string, string>;
}

export interface SearchFilters {
  faction?: string;
  category?: string;
  pointsMin?: number;
  pointsMax?: number;
  keywords?: string[];
}

export interface GameSystemData {
  system: GameSystem;
  units: Unit[];
  rules: Rule[];
  weapons: Weapon[];
  categories: CategoryEntry[];
}