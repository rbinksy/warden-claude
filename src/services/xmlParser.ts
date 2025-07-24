import { XMLParser } from 'fast-xml-parser';
import {
  GameSystem,
  Unit,
  SelectionEntry,
  Profile,
  Cost,
  CategoryLink,
  Constraint,
  Rule,
  InfoLink,
  EntryLink,
  Modifier,
  Weapon,
  GameSystemData
} from '@/types/battlescribe';

class BattleScribeParser {
  private parser: XMLParser;

  constructor() {
    this.parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      textNodeName: 'text',
      parseAttributeValue: true,
      trimValues: true,
      parseTrueNumberOnly: true,
    });
  }

  parseGameSystem(xmlContent: string): GameSystem {
    const parsed = this.parser.parse(xmlContent);
    const gameSystem = parsed.gameSystem;

    return {
      id: gameSystem['@_id'],
      name: gameSystem['@_name'],
      revision: gameSystem['@_revision'] || 1,
      battleScribeVersion: gameSystem['@_battleScribeVersion'] || '2.03',
      costTypes: this.parseCostTypes(gameSystem.costTypes?.costType),
      profileTypes: this.parseProfileTypes(gameSystem.profileTypes?.profileType),
      categoryEntries: this.parseCategoryEntries(gameSystem.categoryEntries?.categoryEntry),
      forceEntries: this.parseForceEntries(gameSystem.forceEntries?.forceEntry),
      publications: this.parsePublications(gameSystem.publications?.publication),
      sharedRules: this.parseRules(gameSystem.sharedRules?.rule),
      sharedProfiles: this.parseProfiles(gameSystem.sharedProfiles?.profile),
      selectionEntries: this.parseSelectionEntries(gameSystem.selectionEntries?.selectionEntry),
    };
  }

  parseCatalogue(xmlContent: string, gameSystemId: string): Unit[] {
    const parsed = this.parser.parse(xmlContent);
    const catalogue = parsed.catalogue;
    
    const units: Unit[] = [];
    const selectionEntries = catalogue.selectionEntries?.selectionEntry || [];
    const sharedSelectionEntries = catalogue.sharedSelectionEntries?.selectionEntry || [];
    
    // Parse main selection entries
    const mainEntries = Array.isArray(selectionEntries) ? selectionEntries : [selectionEntries];
    mainEntries.forEach(entry => {
      if (entry && entry['@_type'] === 'unit') {
        units.push(this.parseUnit(entry, catalogue['@_name'] || 'Unknown'));
      }
    });

    // Parse shared selection entries
    const sharedEntries = Array.isArray(sharedSelectionEntries) ? sharedSelectionEntries : [sharedSelectionEntries];
    sharedEntries.forEach(entry => {
      if (entry && entry['@_type'] === 'unit') {
        units.push(this.parseUnit(entry, catalogue['@_name'] || 'Unknown'));
      }
    });

    return units.filter(unit => unit != null);
  }

  private parseUnit(entry: any, faction: string): Unit {
    return {
      id: entry['@_id'],
      name: entry['@_name'] || 'Unknown Unit',
      type: entry['@_type'] || 'unit',
      hidden: entry['@_hidden'] === 'true',
      costs: this.parseCosts(entry.costs?.cost),
      profiles: this.parseProfiles(entry.profiles?.profile),
      abilities: this.parseAbilities(entry.profiles?.profile),
      categoryLinks: this.parseCategoryLinks(entry.categoryLinks?.categoryLink),
      constraints: this.parseConstraints(entry.constraints?.constraint),
      selectionEntryGroups: this.parseSelectionEntryGroups(entry.selectionEntryGroups?.selectionEntryGroup),
      selectionEntries: this.parseSelectionEntries(entry.selectionEntries?.selectionEntry),
      entryLinks: this.parseEntryLinks(entry.entryLinks?.entryLink),
      infoLinks: this.parseInfoLinks(entry.infoLinks?.infoLink),
      modifiers: this.parseModifiers(entry.modifiers?.modifier),
      rules: this.parseRules(entry.rules?.rule),
      weapons: this.parseWeapons(entry.profiles?.profile),
      faction,
    };
  }

  private parseCostTypes(costTypes: any) {
    if (!costTypes) return [];
    const types = Array.isArray(costTypes) ? costTypes : [costTypes];
    return types.map(type => ({
      id: type['@_id'],
      name: type['@_name'],
      defaultCostLimit: type['@_defaultCostLimit'] || -1,
      hidden: type['@_hidden'] === 'true',
    }));
  }

  private parseProfileTypes(profileTypes: any) {
    if (!profileTypes) return [];
    const types = Array.isArray(profileTypes) ? profileTypes : [profileTypes];
    return types.map(type => ({
      id: type['@_id'],
      name: type['@_name'],
      characteristicTypes: this.parseCharacteristicTypes(type.characteristicTypes?.characteristicType),
    }));
  }

  private parseCharacteristicTypes(charTypes: any) {
    if (!charTypes) return [];
    const types = Array.isArray(charTypes) ? charTypes : [charTypes];
    return types.map(type => ({
      id: type['@_id'],
      name: type['@_name'],
    }));
  }

  private parseCategoryEntries(categories: any) {
    if (!categories) return [];
    const cats = Array.isArray(categories) ? categories : [categories];
    return cats.map(cat => ({
      id: cat['@_id'],
      name: cat['@_name'],
      hidden: cat['@_hidden'] === 'true',
    }));
  }

  private parseForceEntries(forces: any) {
    if (!forces) return [];
    const forceList = Array.isArray(forces) ? forces : [forces];
    return forceList.map(force => ({
      id: force['@_id'],
      name: force['@_name'],
      hidden: force['@_hidden'] === 'true',
      categoryLinks: this.parseCategoryLinks(force.categoryLinks?.categoryLink),
      constraints: this.parseConstraints(force.constraints?.constraint),
    }));
  }

  private parsePublications(publications: any) {
    if (!publications) return [];
    const pubs = Array.isArray(publications) ? publications : [publications];
    return pubs.map(pub => ({
      id: pub['@_id'],
      name: pub['@_name'],
      shortName: pub['@_shortName'],
      publisher: pub['@_publisher'],
      publisherUrl: pub['@_publisherUrl'],
    }));
  }

  private parseCosts(costs: any): Cost[] {
    if (!costs) return [];
    const costList = Array.isArray(costs) ? costs : [costs];
    return costList.map(cost => ({
      name: cost['@_name'],
      typeId: cost['@_typeId'],
      value: cost['@_value'] || 0,
    }));
  }

  private parseProfiles(profiles: any): Profile[] {
    if (!profiles) return [];
    const profileList = Array.isArray(profiles) ? profiles : [profiles];
    return profileList
      .filter(profile => profile['@_typeName'] !== 'Abilities') // Handle abilities separately
      .map(profile => ({
        id: profile['@_id'],
        name: profile['@_name'],
        typeId: profile['@_typeId'],
        typeName: profile['@_typeName'],
        hidden: profile['@_hidden'] === 'true',
        characteristics: this.parseCharacteristics(profile.characteristics?.characteristic),
      }));
  }

  private parseAbilities(profiles: any) {
    if (!profiles) return [];
    const profileList = Array.isArray(profiles) ? profiles : [profiles];
    return profileList
      .filter(profile => profile['@_typeName'] === 'Abilities')
      .map(profile => {
        const description = profile.characteristics?.characteristic?.text || 
                          profile.characteristics?.characteristic?.['@_value'] || '';
        return {
          id: profile['@_id'],
          name: profile['@_name'],
          description: description,
          hidden: profile['@_hidden'] === 'true',
        };
      });
  }

  private parseCharacteristics(characteristics: any) {
    if (!characteristics) return [];
    const charList = Array.isArray(characteristics) ? characteristics : [characteristics];
    return charList.map(char => ({
      name: char['@_name'],
      typeId: char['@_typeId'],
      value: char.text || char['@_value'] || '',
    }));
  }

  private parseCategoryLinks(categoryLinks: any): CategoryLink[] {
    if (!categoryLinks) return [];
    const links = Array.isArray(categoryLinks) ? categoryLinks : [categoryLinks];
    return links.map(link => ({
      id: link['@_id'],
      name: link['@_name'],
      targetId: link['@_targetId'],
      primary: link['@_primary'] === 'true' || link['@_primary'] === true,
      hidden: link['@_hidden'] === 'true' || link['@_hidden'] === true,
    }));
  }

  private parseConstraints(constraints: any): Constraint[] {
    if (!constraints) return [];
    const constraintList = Array.isArray(constraints) ? constraints : [constraints];
    return constraintList.map(constraint => ({
      id: constraint['@_id'],
      type: constraint['@_type'],
      value: constraint['@_value'] || 0,
      field: constraint['@_field'],
      scope: constraint['@_scope'],
      shared: constraint['@_shared'] === 'true',
      includeChildSelections: constraint['@_includeChildSelections'] === 'true',
      includeChildForces: constraint['@_includeChildForces'] === 'true',
      childId: constraint['@_childId'],
    }));
  }

  private parseSelectionEntryGroups(groups: any) {
    if (!groups) return [];
    const groupList = Array.isArray(groups) ? groups : [groups];
    return groupList.map(group => ({
      id: group['@_id'],
      name: group['@_name'],
      hidden: group['@_hidden'] === 'true',
      defaultSelectionEntryId: group['@_defaultSelectionEntryId'],
      constraints: this.parseConstraints(group.constraints?.constraint),
      selectionEntries: this.parseSelectionEntries(group.selectionEntries?.selectionEntry),
      entryLinks: this.parseEntryLinks(group.entryLinks?.entryLink),
    }));
  }

  private parseSelectionEntries(entries: any): SelectionEntry[] {
    if (!entries) return [];
    const entryList = Array.isArray(entries) ? entries : [entries];
    return entryList.map(entry => ({
      id: entry['@_id'],
      name: entry['@_name'],
      type: entry['@_type'],
      hidden: entry['@_hidden'] === 'true',
      costs: this.parseCosts(entry.costs?.cost),
      profiles: this.parseProfiles(entry.profiles?.profile),
      categoryLinks: this.parseCategoryLinks(entry.categoryLinks?.categoryLink),
      constraints: this.parseConstraints(entry.constraints?.constraint),
      selectionEntryGroups: this.parseSelectionEntryGroups(entry.selectionEntryGroups?.selectionEntryGroup),
      entryLinks: this.parseEntryLinks(entry.entryLinks?.entryLink),
      infoLinks: this.parseInfoLinks(entry.infoLinks?.infoLink),
      modifiers: this.parseModifiers(entry.modifiers?.modifier),
      collective: entry['@_collective'] === 'true',
      import: entry['@_import'] === 'true',
    }));
  }

  private parseEntryLinks(entryLinks: any): EntryLink[] {
    if (!entryLinks) return [];
    const links = Array.isArray(entryLinks) ? entryLinks : [entryLinks];
    return links.map(link => ({
      id: link['@_id'],
      name: link['@_name'],
      targetId: link['@_targetId'],
      type: link['@_type'],
      hidden: link['@_hidden'] === 'true',
      collective: link['@_collective'] === 'true',
      import: link['@_import'] === 'true',
      constraints: this.parseConstraints(link.constraints?.constraint),
      costs: this.parseCosts(link.costs?.cost),
    }));
  }

  private parseInfoLinks(infoLinks: any): InfoLink[] {
    if (!infoLinks) return [];
    const links = Array.isArray(infoLinks) ? infoLinks : [infoLinks];
    return links.map(link => ({
      id: link['@_id'],
      name: link['@_name'],
      targetId: link['@_targetId'],
      type: link['@_type'],
      hidden: link['@_hidden'] === 'true',
    }));
  }

  private parseRules(rules: any): Rule[] {
    if (!rules) return [];
    const ruleList = Array.isArray(rules) ? rules : [rules];
    return ruleList.map(rule => ({
      id: rule['@_id'],
      name: rule['@_name'],
      description: rule.description?.text || rule.description || '',
      hidden: rule['@_hidden'] === 'true',
      publicationId: rule['@_publicationId'],
      page: rule['@_page'],
    }));
  }

  private parseModifiers(modifiers: any): Modifier[] {
    if (!modifiers) return [];
    const modList = Array.isArray(modifiers) ? modifiers : [modifiers];
    return modList.map(modifier => ({
      type: modifier['@_type'],
      field: modifier['@_field'],
      value: modifier['@_value'],
      conditions: [], // TODO: Parse conditions
      conditionGroups: [], // TODO: Parse condition groups
    }));
  }

  private parseWeapons(profiles: any): Weapon[] {
    if (!profiles) return [];
    const profileList = Array.isArray(profiles) ? profiles : [profiles];
    return profileList
      .filter(profile => profile['@_typeName'] === 'Ranged Weapons' || profile['@_typeName'] === 'Melee Weapons')
      .map(profile => {
        const chars = this.parseCharacteristics(profile.characteristics?.characteristic);
        const charMap = chars.reduce((acc, char) => {
          acc[char.name] = char.value;
          return acc;
        }, {} as Record<string, string>);

        return {
          id: profile['@_id'],
          name: profile['@_name'],
          type: profile['@_typeName'] === 'Ranged Weapons' ? 'ranged' : 'melee',
          range: charMap['Range'],
          attacks: charMap['A'] || charMap['Attacks'] || '1',
          ballistic_skill: charMap['BS'],
          weapon_skill: charMap['WS'],
          strength: charMap['S'] || charMap['Strength'] || '4',
          armor_penetration: charMap['AP'] || '0',
          damage: charMap['D'] || charMap['Damage'] || '1',
          keywords: charMap['Keywords'] ? charMap['Keywords'].split(', ') : [],
          abilities: [], // TODO: Parse weapon abilities
        };
      });
  }

  async parseGameSystemData(gameSystemXml: string, catalogueXmls: string[]): Promise<GameSystemData> {
    const gameSystem = this.parseGameSystem(gameSystemXml);
    
    let allUnits: Unit[] = [];
    let allRules: Rule[] = [...gameSystem.sharedRules];
    let allWeapons: Weapon[] = [];

    for (const catalogueXml of catalogueXmls) {
      const units = this.parseCatalogue(catalogueXml, gameSystem.id);
      allUnits = [...allUnits, ...units];
      
      // Extract rules and weapons from units
      units.forEach(unit => {
        allRules = [...allRules, ...unit.rules];
        allWeapons = [...allWeapons, ...unit.weapons];
      });
    }

    return {
      system: gameSystem,
      units: allUnits,
      rules: allRules,
      weapons: allWeapons,
      categories: gameSystem.categoryEntries,
    };
  }
}

export const battleScribeParser = new BattleScribeParser();