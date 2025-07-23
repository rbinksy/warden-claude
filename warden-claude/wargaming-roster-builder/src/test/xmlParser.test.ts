import { describe, it, expect } from 'vitest';
import { battleScribeParser } from '@/services/xmlParser';

describe('BattleScribe XML Parser', () => {
  const mockGameSystemXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
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
      </characteristicTypes>
    </profileType>
  </profileTypes>
  <categoryEntries>
    <categoryEntry id="cf47-a0d7-7207-29dc" name="Infantry" hidden="false"/>
  </categoryEntries>
</gameSystem>`;

  const mockCatalogueXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<catalogue xmlns="http://www.battlescribe.net/schema/catalogueSchema" id="test-catalogue" name="Test Faction" revision="1" battleScribeVersion="2.03" library="false" gameSystemId="sys-352e-adc2-7639-d6a9" gameSystemRevision="1" type="catalogue">
  <selectionEntries>
    <selectionEntry type="unit" import="true" name="Test Unit" hidden="false" id="test-unit-1">
      <costs>
        <cost name="pts" typeId="51b2-306e-1021-d207" value="100"/>
      </costs>
      <profiles>
        <profile name="Test Unit" typeId="c547-1836-d8a-ff4f" typeName="Unit" hidden="false" id="test-profile-1">
          <characteristics>
            <characteristic name="M" typeId="e703-ecb6-5ce7-aec1">6"</characteristic>
            <characteristic name="T" typeId="d29d-cf75-fc2d-34a4">4</characteristic>
          </characteristics>
        </profile>
      </profiles>
      <categoryLinks>
        <categoryLink targetId="cf47-a0d7-7207-29dc" id="test-link-1" primary="true" name="Infantry" hidden="false"/>
      </categoryLinks>
    </selectionEntry>
  </selectionEntries>
</catalogue>`;

  describe('parseGameSystem', () => {
    it('should parse game system XML correctly', () => {
      const result = battleScribeParser.parseGameSystem(mockGameSystemXml);

      expect(result.id).toBe('sys-352e-adc2-7639-d6a9');
      expect(result.name).toBe('Warhammer 40,000 10th Edition');
      expect(result.revision).toBe(38);
      expect(result.battleScribeVersion).toBe(2.03);
      
      expect(result.costTypes).toHaveLength(1);
      expect(result.costTypes[0].name).toBe('pts');
      expect(result.costTypes[0].id).toBe('51b2-306e-1021-d207');
      
      expect(result.profileTypes).toHaveLength(1);
      expect(result.profileTypes[0].name).toBe('Unit');
      expect(result.profileTypes[0].characteristicTypes).toHaveLength(2);
      
      expect(result.categoryEntries).toHaveLength(1);
      expect(result.categoryEntries[0].name).toBe('Infantry');
    });
  });

  describe('parseCatalogue', () => {
    it('should parse catalogue XML correctly', () => {
      const result = battleScribeParser.parseCatalogue(mockCatalogueXml, 'sys-352e-adc2-7639-d6a9');

      expect(result).toHaveLength(1);
      
      const unit = result[0];
      expect(unit.id).toBe('test-unit-1');
      expect(unit.name).toBe('Test Unit');
      expect(unit.type).toBe('unit');
      expect(unit.faction).toBe('Test Faction');
      
      expect(unit.costs).toHaveLength(1);
      expect(unit.costs[0].name).toBe('pts');
      expect(unit.costs[0].value).toBe(100);
      
      expect(unit.profiles).toHaveLength(1);
      expect(unit.profiles[0].name).toBe('Test Unit');
      expect(unit.profiles[0].characteristics).toHaveLength(2);
      
      expect(unit.categoryLinks).toHaveLength(1);
      expect(unit.categoryLinks[0].name).toBe('Infantry');
      expect(unit.categoryLinks[0].primary).toBe(true);
    });
  });

  describe('parseGameSystemData', () => {
    it('should parse complete game system data', async () => {
      const result = await battleScribeParser.parseGameSystemData(
        mockGameSystemXml,
        [mockCatalogueXml]
      );

      expect(result.system.name).toBe('Warhammer 40,000 10th Edition');
      expect(result.units).toHaveLength(1);
      expect(result.units[0].name).toBe('Test Unit');
      expect(result.categories).toHaveLength(1);
      expect(result.categories[0].name).toBe('Infantry');
    });
  });
});