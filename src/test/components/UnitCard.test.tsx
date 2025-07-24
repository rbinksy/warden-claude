import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { UnitCard } from '@/components/UnitCard';
import { SearchableUnit } from '@/types/battlescribe';

// Mock the stores
vi.mock('@/stores/gameStore', () => ({
  useGameStore: () => ({
    selectUnit: vi.fn(),
  }),
}));

vi.mock('@/stores/rosterStore', () => ({
  useRosterStore: () => ({
    addUnitToRoster: vi.fn(),
    currentRoster: {
      id: 'test-roster',
      name: 'Test Roster',
      gameSystemId: 'test-system',
      gameSystemName: 'Test System',
      pointsLimit: 1000,
      totalPoints: 0,
      forces: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  }),
}));

describe('UnitCard', () => {
  const mockUnit: SearchableUnit = {
    id: 'test-unit',
    name: 'Test Unit',
    faction: 'Test Faction',
    type: 'unit',
    categories: ['Infantry', 'Battleline'],
    points: 100,
    abilities: ['Test ability description'],
    rules: ['Test rule description'],
    keywords: ['INFANTRY', 'BATTLELINE'],
    characteristics: {
      M: '6"',
      T: '4',
      SV: '3+',
      W: '2',
      LD: '6+',
      OC: '2',
    },
  };

  it('renders unit information correctly', () => {
    render(<UnitCard unit={mockUnit} />);

    expect(screen.getByText('Test Unit')).toBeInTheDocument();
    expect(screen.getByText('Test Faction')).toBeInTheDocument();
    expect(screen.getByText('Infantry')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('pts')).toBeInTheDocument();
  });

  it('displays unit characteristics', () => {
    render(<UnitCard unit={mockUnit} />);

    expect(screen.getByText('6"')).toBeInTheDocument(); // Movement
    expect(screen.getByText('4')).toBeInTheDocument(); // Toughness
    expect(screen.getByText('3+')).toBeInTheDocument(); // Save
    expect(screen.getAllByText('2')).toHaveLength(2); // Wounds and OC both show "2"
    expect(screen.getByText('6+')).toBeInTheDocument(); // Leadership
  });

  it('shows ability preview', () => {
    render(<UnitCard unit={mockUnit} />);

    expect(screen.getByText(/Test ability description/)).toBeInTheDocument();
  });

  it('displays keywords', () => {
    render(<UnitCard unit={mockUnit} />);

    expect(screen.getByText('INFANTRY')).toBeInTheDocument();
    expect(screen.getByText('BATTLELINE')).toBeInTheDocument();
  });

  it('shows categories', () => {
    render(<UnitCard unit={mockUnit} />);

    expect(screen.getByText('Battleline')).toBeInTheDocument();
  });

  it('calls onViewDetails when Details button is clicked', () => {
    const mockOnViewDetails = vi.fn();
    render(<UnitCard unit={mockUnit} onViewDetails={mockOnViewDetails} />);

    fireEvent.click(screen.getByText('Details'));
    expect(mockOnViewDetails).toHaveBeenCalledWith(mockUnit);
  });

  it('shows Add to Roster button when roster exists', () => {
    render(<UnitCard unit={mockUnit} />);

    expect(screen.getByText('Add to Roster')).toBeInTheDocument();
  });

  it('handles long ability text with truncation', () => {
    const unitWithLongAbility: SearchableUnit = {
      ...mockUnit,
      abilities: ['This is a very long ability description that should be truncated after a certain number of characters to prevent the card from becoming too tall and unwieldy for the user interface layout.'],
    };

    render(<UnitCard unit={unitWithLongAbility} />);

    const abilityText = screen.getByText(/This is a very long ability description/);
    expect(abilityText).toBeInTheDocument();
  });

  it('handles units with many keywords', () => {
    const unitWithManyKeywords: SearchableUnit = {
      ...mockUnit,
      keywords: ['INFANTRY', 'BATTLELINE', 'CORE', 'IMPERIUM', 'ADEPTUS ASTARTES', 'TACTICUS'],
    };

    render(<UnitCard unit={unitWithManyKeywords} />);

    // Should show first 4 keywords
    expect(screen.getByText('INFANTRY')).toBeInTheDocument();
    expect(screen.getByText('BATTLELINE')).toBeInTheDocument();
    expect(screen.getByText('CORE')).toBeInTheDocument();
    expect(screen.getByText('IMPERIUM')).toBeInTheDocument();

    // Should show "+X more" indicator
    expect(screen.getByText('+2 more')).toBeInTheDocument();
  });
});