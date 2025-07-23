import { GameSystemData } from '@/types/battlescribe';
import { battleScribeParser } from './xmlParser';

export class DataService {
  private gameSystemData: GameSystemData | null = null;
  private initialized = false;

  async loadGameSystemData(dataPath: string): Promise<GameSystemData> {
    try {
      // In a real app, you'd fetch these from a server or file system
      // For now, we'll simulate loading the WH40K 10e data
      const gameSystemXml = await this.loadFile(`${dataPath}/Warhammer 40,000.gst`);
      
      const catalogueFiles = [
        'Imperium - Space Marines.cat',
        'Necrons.cat',
        'Orks.cat',
        // Add more catalogue files as needed
      ];
      
      const catalogueXmls: string[] = [];
      for (const filename of catalogueFiles) {
        try {
          const xml = await this.loadFile(`${dataPath}/${filename}`);
          catalogueXmls.push(xml);
        } catch (error) {
          console.warn(`Failed to load catalogue: ${filename}`, error);
        }
      }

      this.gameSystemData = await battleScribeParser.parseGameSystemData(
        gameSystemXml,
        catalogueXmls
      );
      
      this.initialized = true;
      return this.gameSystemData;
    } catch (error) {
      console.error('Failed to load game system data:', error);
      throw new Error('Failed to load game system data');
    }
  }

  private async loadFile(filePath: string): Promise<string> {
    // In a real application, this would fetch from the server
    // For the demo, we'll simulate file loading or use the existing data
    try {
      const response = await fetch(filePath);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.text();
    } catch (error) {
      // Fallback for development - return mock data
      console.warn(`Failed to fetch ${filePath}, using mock data`);
      return this.getMockGameSystemData();
    }
  }

  private getMockGameSystemData(): string {
    // Mock game system XML for development/testing
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<gameSystem xmlns="http://www.battlescribe.net/schema/gameSystemSchema" id="sys-352e-adc2-7639-d6a9" name="Warhammer 40,000 10th Edition" revision="38" battleScribeVersion="2.03" type="gameSystem">
  <publications>
    <publication id="48fc-15aa-b307-9443" name="10th Edition Core Rules" shortName="10th Ed Core"/>
  </publications>
  <costTypes>
    <costType id="51b2-306e-1021-d207" name="pts" defaultCostLimit="-1" hidden="false"/>
  </costTypes>
  <profileTypes>
    <profileType id="c547-1836-d8a-ff4f" name="Unit">
      <characteristicTypes>
        <characteristicType id="e703-ecb6-5ce7-aec1" name="M"/>
        <characteristicType id="d29d-cf75-fc2d-34a4" name="T"/>
        <characteristicType id="450-a17e-9d5e-29da" name="SV"/>
        <characteristicType id="750a-a2ec-90d3-21fe" name="W"/>
        <characteristicType id="58d2-b879-49c7-43bc" name="LD"/>
        <characteristicType id="bef7-942a-1a23-59f8" name="OC"/>
      </characteristicTypes>
    </profileType>
  </profileTypes>
  <categoryEntries>
    <categoryEntry id="cf47-a0d7-7207-29dc" name="Infantry" hidden="false"/>
    <categoryEntry id="e338-111e-d0c6-b687" name="Battleline" hidden="false"/>
  </categoryEntries>
</gameSystem>`;
  }

  getGameSystemData(): GameSystemData | null {
    return this.gameSystemData;
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  async initializeWithMockData(): Promise<GameSystemData> {
    // Create mock data for development and testing
    this.gameSystemData = {
      system: {
        id: 'sys-352e-adc2-7639-d6a9',
        name: 'Warhammer 40,000 10th Edition',
        revision: 38,
        battleScribeVersion: '2.03',
        costTypes: [
          {
            id: '51b2-306e-1021-d207',
            name: 'pts',
            defaultCostLimit: -1,
            hidden: false,
          },
        ],
        profileTypes: [
          {
            id: 'c547-1836-d8a-ff4f',
            name: 'Unit',
            characteristicTypes: [
              { id: 'e703-ecb6-5ce7-aec1', name: 'M' },
              { id: 'd29d-cf75-fc2d-34a4', name: 'T' },
              { id: '450-a17e-9d5e-29da', name: 'SV' },
              { id: '750a-a2ec-90d3-21fe', name: 'W' },
              { id: '58d2-b879-49c7-43bc', name: 'LD' },
              { id: 'bef7-942a-1a23-59f8', name: 'OC' },
            ],
          },
        ],
        categoryEntries: [
          { id: 'cf47-a0d7-7207-29dc', name: 'Infantry', hidden: false },
          { id: 'e338-111e-d0c6-b687', name: 'Battleline', hidden: false },
          { id: '5179-8ede-45e3-49a2', name: 'Tacticus', hidden: false },
        ],
        forceEntries: [],
        publications: [
          {
            id: '48fc-15aa-b307-9443',
            name: '10th Edition Core Rules',
            shortName: '10th Ed Core',
          },
        ],
        sharedRules: [],
        sharedProfiles: [],
        selectionEntries: [],
      },
      units: this.createMockUnits(),
      rules: this.createMockRules(),
      weapons: this.createMockWeapons(),
      categories: [
        { id: 'cf47-a0d7-7207-29dc', name: 'Infantry', hidden: false },
        { id: 'e338-111e-d0c6-b687', name: 'Battleline', hidden: false },
        { id: '5179-8ede-45e3-49a2', name: 'Tacticus', hidden: false },
      ],
    };

    this.initialized = true;
    return this.gameSystemData;
  }

  private createMockUnits() {
    return [
      {
        id: 'intercessor-squad',
        name: 'Intercessor Squad',
        type: 'unit' as const,
        hidden: false,
        costs: [{ name: 'pts', typeId: '51b2-306e-1021-d207', value: 90 }],
        profiles: [
          {
            id: 'intercessor-profile',
            name: 'Intercessor Squad',
            typeId: 'c547-1836-d8a-ff4f',
            typeName: 'Unit',
            hidden: false,
            characteristics: [
              { name: 'M', typeId: 'e703-ecb6-5ce7-aec1', value: '6"' },
              { name: 'T', typeId: 'd29d-cf75-fc2d-34a4', value: '4' },
              { name: 'SV', typeId: '450-a17e-9d5e-29da', value: '3+' },
              { name: 'W', typeId: '750a-a2ec-90d3-21fe', value: '2' },
              { name: 'LD', typeId: '58d2-b879-49c7-43bc', value: '6+' },
              { name: 'OC', typeId: 'bef7-942a-1a23-59f8', value: '2' },
            ],
          },
        ],
        abilities: [
          {
            id: 'oath-of-moment',
            name: 'Oath of Moment',
            description: 'If your Army Faction is Adeptus Astartes, once per battle, in your Command phase, you can select one enemy unit.',
            hidden: false,
          },
        ],
        categoryLinks: [
          { id: '1', name: 'Infantry', targetId: 'cf47-a0d7-7207-29dc', primary: false, hidden: false },
          { id: '2', name: 'Battleline', targetId: 'e338-111e-d0c6-b687', primary: true, hidden: false },
          { id: '3', name: 'Tacticus', targetId: '5179-8ede-45e3-49a2', primary: false, hidden: false },
        ],
        constraints: [],
        selectionEntryGroups: [],
        selectionEntries: [],
        entryLinks: [],
        infoLinks: [],
        modifiers: [],
        rules: [],
        weapons: [
          {
            id: 'bolt-rifle',
            name: 'Bolt rifle',
            type: 'ranged' as const,
            range: '24"',
            attacks: '1',
            ballistic_skill: '3+',
            strength: '4',
            armor_penetration: '0',
            damage: '1',
            keywords: ['Assault'],
            abilities: [],
          },
        ],
        faction: 'Adeptus Astartes',
      },
      {
        id: 'necron-warriors',
        name: 'Necron Warriors',
        type: 'unit' as const,
        hidden: false,
        costs: [{ name: 'pts', typeId: '51b2-306e-1021-d207', value: 90 }],
        profiles: [
          {
            id: 'necron-warrior-profile',
            name: 'Necron Warriors',
            typeId: 'c547-1836-d8a-ff4f',
            typeName: 'Unit',
            hidden: false,
            characteristics: [
              { name: 'M', typeId: 'e703-ecb6-5ce7-aec1', value: '5"' },
              { name: 'T', typeId: 'd29d-cf75-fc2d-34a4', value: '4' },
              { name: 'SV', typeId: '450-a17e-9d5e-29da', value: '4+' },
              { name: 'W', typeId: '750a-a2ec-90d3-21fe', value: '1' },
              { name: 'LD', typeId: '58d2-b879-49c7-43bc', value: '7+' },
              { name: 'OC', typeId: 'bef7-942a-1a23-59f8', value: '2' },
            ],
          },
        ],
        abilities: [
          {
            id: 'their-number-is-legion',
            name: 'Their Number is Legion',
            description: 'Each time this unit\'s Reanimation Protocols activate, you can re-roll the dice to see how many wounds are regenerated.',
            hidden: false,
          },
        ],
        categoryLinks: [
          { id: '4', name: 'Infantry', targetId: 'cf47-a0d7-7207-29dc', primary: false, hidden: false },
          { id: '5', name: 'Battleline', targetId: 'e338-111e-d0c6-b687', primary: true, hidden: false },
        ],
        constraints: [],
        selectionEntryGroups: [],
        selectionEntries: [],
        entryLinks: [],
        infoLinks: [],
        modifiers: [],
        rules: [],
        weapons: [
          {
            id: 'gauss-flayer',
            name: 'Gauss flayer',
            type: 'ranged' as const,
            range: '24"',
            attacks: '1',
            ballistic_skill: '4+',
            strength: '4',
            armor_penetration: '0',
            damage: '1',
            keywords: ['Lethal Hits', 'Rapid Fire 1'],
            abilities: [],
          },
        ],
        faction: 'Necrons',
      },
    ];
  }

  private createMockRules() {
    return [
      {
        id: 'lethal-hits',
        name: 'Lethal Hits',
        description: 'Each time an attack made with this weapon scores a Critical Hit, that attack automatically wounds the target.',
        hidden: false,
      },
      {
        id: 'rapid-fire',
        name: 'Rapid Fire',
        description: 'When shooting with a Rapid Fire weapon, if the target is within half the weapon\'s range, make double the number of attacks.',
        hidden: false,
      },
    ];
  }

  private createMockWeapons() {
    return [
      {
        id: 'bolt-rifle',
        name: 'Bolt rifle',
        type: 'ranged' as const,
        range: '24"',
        attacks: '1',
        ballistic_skill: '3+',
        strength: '4',
        armor_penetration: '0',
        damage: '1',
        keywords: ['Assault'],
        abilities: [],
      },
      {
        id: 'gauss-flayer',
        name: 'Gauss flayer',
        type: 'ranged' as const,
        range: '24"',
        attacks: '1',
        ballistic_skill: '4+',
        strength: '4',
        armor_penetration: '0',
        damage: '1',
        keywords: ['Lethal Hits', 'Rapid Fire 1'],
        abilities: [],
      },
    ];
  }
}

export const dataService = new DataService();