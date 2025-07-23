export interface Roster {
  id: string;
  name: string;
  gameSystemId: string;
  gameSystemName: string;
  pointsLimit: number;
  totalPoints: number;
  forces: Force[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Force {
  id: string;
  name: string;
  catalogueId: string;
  catalogueName: string;
  selections: Selection[];
  categories: RosterCategory[];
}

export interface Selection {
  id: string;
  name: string;
  entryId: string;
  entryGroupId?: string;
  customName?: string;
  type: 'unit' | 'model' | 'upgrade';
  number: number;
  costs: { name: string; value: number }[];
  selections: Selection[];
  profiles: Profile[];
  rules: Rule[];
  categories: RosterCategory[];
}

export interface RosterCategory {
  id: string;
  name: string;
  entryId: string;
  primary: boolean;
}

export interface Profile {
  id: string;
  name: string;
  typeName: string;
  characteristics: { name: string; value: string }[];
}

export interface Rule {
  id: string;
  name: string;
  description: string;
}