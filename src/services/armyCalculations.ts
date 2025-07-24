// Army calculation functions using native JavaScript methods (no Ramda/currying)

import type { Army, ArmyUnit, ValidationResult, ValidationError, ValidationWarning } from '../types/army';

/**
 * Calculate total points for an army
 */
export const calculateArmyPoints = (army: Army): number => {
  return army.units.reduce((total, unit) => total + (unit.points * unit.count), 0);
};

/**
 * Calculate power level for an army
 */
export const calculatePowerLevel = (army: Army): number => {
  return army.units.reduce((total, unit) => {
    const powerLevel = unit.profiles[0]?.characteristics.PL 
      ? parseInt(unit.profiles[0].characteristics.PL) 
      : 0;
    return total + (powerLevel * unit.count);
  }, 0);
};

/**
 * Calculate total model count
 */
export const calculateModelCount = (army: Army): number => {
  return army.units.reduce((total, unit) => {
    const modelsPerUnit = unit.profiles[0]?.characteristics.Models 
      ? parseInt(unit.profiles[0].characteristics.Models) 
      : 1;
    return total + (modelsPerUnit * unit.count);
  }, 0);
};

/**
 * Group units by category
 */
export const groupUnitsByCategory = (units: ArmyUnit[]): Record<string, ArmyUnit[]> => {
  return units.reduce((groups, unit) => {
    unit.categories.forEach(category => {
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(unit);
    });
    return groups;
  }, {} as Record<string, ArmyUnit[]>);
};

/**
 * Group units by faction
 */
export const groupUnitsByFaction = (units: ArmyUnit[]): Record<string, ArmyUnit[]> => {
  return units.reduce((groups, unit) => {
    if (!groups[unit.faction]) {
      groups[unit.faction] = [];
    }
    groups[unit.faction].push(unit);
    return groups;
  }, {} as Record<string, ArmyUnit[]>);
};

/**
 * Find the most expensive unit in the army
 */
export const findMostExpensiveUnit = (army: Army): ArmyUnit | null => {
  if (army.units.length === 0) return null;
  
  return army.units.reduce((mostExpensive, unit) => {
    const unitTotalCost = unit.points * unit.count;
    const currentMostExpensiveCost = mostExpensive.points * mostExpensive.count;
    return unitTotalCost > currentMostExpensiveCost ? unit : mostExpensive;
  });
};

/**
 * Calculate average points per unit
 */
export const calculateAveragePointsPerUnit = (army: Army): number => {
  if (army.units.length === 0) return 0;
  
  const totalPoints = calculateArmyPoints(army);
  const totalUnits = army.units.reduce((total, unit) => total + unit.count, 0);
  
  return totalUnits > 0 ? totalPoints / totalUnits : 0;
};

/**
 * Get keyword frequency analysis
 */
export const analyzeKeywordFrequency = (army: Army): Record<string, number> => {
  const keywordCounts: Record<string, number> = {};
  
  army.units.forEach(unit => {
    unit.keywords.forEach(keyword => {
      keywordCounts[keyword] = (keywordCounts[keyword] || 0) + unit.count;
    });
  });
  
  return keywordCounts;
};

/**
 * Check if army exceeds points limit
 */
export const checkPointsLimit = (army: Army): ValidationError[] => {
  const errors: ValidationError[] = [];
  const totalPoints = calculateArmyPoints(army);
  
  if (totalPoints > army.pointsLimit) {
    errors.push({
      id: 'points-over-limit',
      type: 'points-limit',
      message: `Army exceeds points limit by ${totalPoints - army.pointsLimit} points`,
    });
  }
  
  return errors;
};

/**
 * Check basic force organization requirements
 */
export const checkForceOrganization = (army: Army): ValidationError[] => {
  const errors: ValidationError[] = [];
  const unitsByCategory = groupUnitsByCategory(army.units);
  
  // Basic force org rules (simplified)
  const troopsCount = unitsByCategory['Troops']?.length || 0;
  const hqCount = unitsByCategory['HQ']?.length || 0;
  
  if (hqCount === 0 && army.units.length > 0) {
    errors.push({
      id: 'missing-hq',
      type: 'force-organization',
      message: 'Army requires at least one HQ unit',
    });
  }
  
  if (troopsCount === 0 && army.units.length > 3) {
    errors.push({
      id: 'missing-troops',
      type: 'force-organization',
      message: 'Army requires at least one Troops unit for armies over 3 units',
    });
  }
  
  return errors;
};

/**
 * Check for unit count restrictions
 */
export const checkUnitRestrictions = (army: Army): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  army.units.forEach(unit => {
    // Check maximum unit count (typically 3 for most units in 40k)
    if (unit.count > 3 && !unit.categories.includes('Troops') && !unit.categories.includes('Battleline')) {
      errors.push({
        id: `unit-count-${unit.id}`,
        type: 'unit-restriction',
        message: `${unit.name} exceeds maximum count of 3`,
        unitId: unit.id,
      });
    }
  });
  
  return errors;
};

/**
 * Generate army optimization suggestions
 */
export const generateOptimizationSuggestions = (army: Army): ValidationWarning[] => {
  const warnings: ValidationWarning[] = [];
  
  // Check for unspent points
  const remainingPoints = army.pointsLimit - calculateArmyPoints(army);
  if (remainingPoints > 50 && remainingPoints < army.pointsLimit * 0.1) {
    warnings.push({
      id: 'unspent-points',
      type: 'suboptimal',
      message: `${remainingPoints} points remaining - consider upgrades`,
      suggestion: 'Add wargear upgrades or additional models',
    });
  }
  
  // Check for single-model expensive units without protection
  army.units.forEach(unit => {
    if (unit.points > 200 && unit.count === 1) {
      warnings.push({
        id: `expensive-single-${unit.id}`,
        type: 'meta-suggestion',
        message: `${unit.name} is expensive and vulnerable as a single model`,
        unitId: unit.id,
        suggestion: 'Consider adding support units or defensive options',
      });
    }
  });
  
  return warnings;
};

/**
 * Validate entire army with all checks
 */
export const validateArmy = (army: Army): ValidationResult => {
  const errors: ValidationError[] = [
    ...checkPointsLimit(army),
    ...checkForceOrganization(army),
    ...checkUnitRestrictions(army),
  ];
  
  const warnings: ValidationWarning[] = [
    ...generateOptimizationSuggestions(army),
  ];
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

/**
 * Calculate completion percentage
 */
export const calculateCompletionPercentage = (army: Army): number => {
  return (calculateArmyPoints(army) / army.pointsLimit) * 100;
};

/**
 * Check if army is battle-ready (has minimum viable composition)
 */
export const isBattleReady = (army: Army): boolean => {
  const validation = validateArmy(army);
  const hasMinimumUnits = army.units.length >= 1;
  const hasPoints = calculateArmyPoints(army) > 0;
  
  return validation.isValid && hasMinimumUnits && hasPoints;
};

/**
 * Get army statistics summary
 */
export const getArmyStatistics = (army: Army) => {
  const totalUnits = army.units.reduce((total, unit) => total + unit.count, 0);
  const totalModels = calculateModelCount(army);
  const totalPoints = calculateArmyPoints(army);
  const averagePointsPerUnit = calculateAveragePointsPerUnit(army);
  const mostExpensiveUnit = findMostExpensiveUnit(army);
  const factionBreakdown = groupUnitsByFaction(army.units);
  const categoryBreakdown = groupUnitsByCategory(army.units);
  const keywordFrequency = analyzeKeywordFrequency(army);
  
  return {
    totalUnits,
    totalModels,
    totalPoints,
    averagePointsPerUnit,
    mostExpensiveUnit,
    factionBreakdown: Object.keys(factionBreakdown).reduce((acc, faction) => {
      acc[faction] = factionBreakdown[faction].reduce((sum, unit) => sum + unit.count, 0);
      return acc;
    }, {} as Record<string, number>),
    categoryBreakdown: Object.keys(categoryBreakdown).reduce((acc, category) => {
      acc[category] = categoryBreakdown[category].reduce((sum, unit) => sum + unit.count, 0);
      return acc;
    }, {} as Record<string, number>),
    keywordFrequency,
  };
};