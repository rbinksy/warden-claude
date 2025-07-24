import { formatDistanceToNow, format } from 'date-fns';

/**
 * Format points value with proper thousands separators
 */
export const formatPoints = (points: number): string => {
  return `${points.toLocaleString()} pts`;
};

/**
 * Format power level value
 */
export const formatPowerLevel = (powerLevel: number): string => {
  return `${powerLevel} PL`;
};

/**
 * Format date for display - shows relative time for recent dates, absolute for older
 */
export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
  
  // Show relative time for dates within the last 7 days
  if (diffInHours < 24 * 7) {
    return formatDistanceToNow(date, { addSuffix: true });
  }
  
  // Show absolute date for older dates
  return format(date, 'MMM d, yyyy');
};

/**
 * Format date for detailed display
 */
export const formatDateTime = (timestamp: number): string => {
  return format(new Date(timestamp), 'MMM d, yyyy \'at\' h:mm a');
};

/**
 * Format army completion percentage
 */
export const formatCompletionPercentage = (current: number, limit: number): string => {
  const percentage = (current / limit) * 100;
  return `${percentage.toFixed(1)}%`;
};

/**
 * Format unit count with proper pluralization
 */
export const formatUnitCount = (count: number): string => {
  if (count === 0) return 'No units';
  if (count === 1) return '1 unit';
  return `${count} units`;
};

/**
 * Format model count with proper pluralization
 */
export const formatModelCount = (count: number): string => {
  if (count === 0) return 'No models';
  if (count === 1) return '1 model';
  return `${count} models`;
};

/**
 * Format weapon range - handles special cases like "Melee", "Pistol 1", etc.
 */
export const formatWeaponRange = (range: string): string => {
  if (range === 'Melee' || range === '-') return 'Melee';
  if (range.includes('"')) return range;
  return `${range}"`;
};

/**
 * Format weapon attacks - handles dice notation and special cases
 */
export const formatWeaponAttacks = (attacks: string): string => {
  if (attacks === '*') return '*';
  if (attacks.toLowerCase() === 'user') return 'User';
  return attacks;
};

/**
 * Format characteristics for display (M, T, SV, W, LD, OC)
 */
export const formatCharacteristic = (name: string, value: string): string => {
  switch (name.toLowerCase()) {
    case 'm':
    case 'movement':
      return value.includes('"') ? value : `${value}"`;
    case 'sv':
    case 'save':
      return value.includes('+') ? value : `${value}+`;
    case 'ld':
    case 'leadership':
      return value.includes('+') ? value : `${value}+`;
    default:
      return value;
  }
};

/**
 * Format ability text - truncate long descriptions
 */
export const formatAbilityText = (text: string, maxLength: number = 120): string => {
  if (text.length <= maxLength) return text;
  
  // Find a good breaking point (end of sentence or word)
  const truncated = text.substring(0, maxLength);
  const lastPeriod = truncated.lastIndexOf('.');
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastPeriod > maxLength * 0.8) {
    return text.substring(0, lastPeriod + 1) + '...';
  } else if (lastSpace > maxLength * 0.8) {
    return text.substring(0, lastSpace) + '...';
  }
  
  return truncated + '...';
};

/**
 * Format faction name - handle long faction names
 */
export const formatFactionName = (faction: string, maxLength: number = 20): string => {
  if (faction.length <= maxLength) return faction;
  
  // Common abbreviations for Warhammer 40k factions
  const abbreviations: Record<string, string> = {
    'Adeptus Mechanicus': 'AdMech',
    'Adeptus Custodes': 'Custodes',
    'Adeptus Astartes': 'Space Marines',
    'Chaos Space Marines': 'CSM',
    'Death Guard': 'DG',
    'Thousand Sons': 'TS',
    'Genestealer Cults': 'GSC',
    'Imperial Knights': 'Knights',
    'Chaos Knights': 'C.Knights',
    'T\'au Empire': 'T\'au',
  };
  
  return abbreviations[faction] || faction.substring(0, maxLength - 3) + '...';
};

/**
 * Format file size for exports
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
};

/**
 * Format duration in milliseconds to human readable
 */
export const formatDuration = (ms: number): string => {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  if (ms < 3600000) return `${(ms / 60000).toFixed(1)}m`;
  return `${(ms / 3600000).toFixed(1)}h`;
};

/**
 * Format search result count
 */
export const formatSearchResults = (count: number): string => {
  if (count === 0) return 'No results';
  if (count === 1) return '1 result';
  return `${count.toLocaleString()} results`;
};

/**
 * Format tournament date range
 */
export const formatTournamentDate = (startDate: Date, endDate?: Date): string => {
  if (!endDate || startDate.toDateString() === endDate.toDateString()) {
    return format(startDate, 'MMM d, yyyy');
  }
  
  if (startDate.getMonth() === endDate.getMonth() && startDate.getFullYear() === endDate.getFullYear()) {
    return `${format(startDate, 'MMM d')}-${format(endDate, 'd, yyyy')}`;
  }
  
  return `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d, yyyy')}`;
};

/**
 * Format currency for tournament entry fees
 */
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};