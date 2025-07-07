import React, { useMemo } from 'react';

export interface PantryItem {
  name: string;
  quantity: number;
  dailyConsumptionRate: number;
  lastDepletedDate?: string;
}

interface Props {
  pantryItems: PantryItem[];
}

const StreakTracker: React.FC<Props> = ({ pantryItems }) => {
  const streakDays = useMemo(() => {
    let latest: Date | null = null;
    pantryItems.forEach((item) => {
      if (item.quantity <= 0 && !item.lastDepletedDate) {
        latest = new Date();
        return;
      }
      if (item.lastDepletedDate) {
        const date = new Date(item.lastDepletedDate);
        if (!latest || date > latest) {
          latest = date;
        }
      }
    });

    if (!latest) return 0;
    const diff = Date.now() - latest.getTime();
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  }, [pantryItems]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col items-center">
      <span className="text-2xl font-semibold text-primary-600">{streakDays}</span>
      <span className="text-sm text-gray-500">Day Streak</span>
    </div>
  );
};

export default StreakTracker;
