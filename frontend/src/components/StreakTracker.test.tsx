import React from 'react';
import { render, screen } from '@testing-library/react';
import StreakTracker, { PantryItem } from './StreakTracker';

describe('StreakTracker', () => {
  it('displays correct streak length', () => {
    jest.spyOn(Date, 'now').mockReturnValue(new Date('2024-01-10').getTime());
    const items: PantryItem[] = [
      { name: 'Milk', quantity: 2, dailyConsumptionRate: 1, lastDepletedDate: '2024-01-05' },
      { name: 'Eggs', quantity: 5, dailyConsumptionRate: 1, lastDepletedDate: '2024-01-03' }
    ];
    render(<StreakTracker pantryItems={items} />);
    expect(screen.getByText('5')).toBeInTheDocument();
    (Date.now as jest.Mock).mockRestore();
  });
});
