import React, { useState } from 'react';
import { toast } from 'react-toastify';

export interface PantryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  dailyConsumptionRate: number;
  reorderBufferDays: number;
}

const INITIAL_STOCK = 1000;

const mockItems: PantryItem[] = [
  {
    id: '1',
    name: 'Milk',
    quantity: 2000,
    unit: 'ml',
    dailyConsumptionRate: 250,
    reorderBufferDays: 2,
  },
  {
    id: '2',
    name: 'Eggs',
    quantity: 12,
    unit: 'pcs',
    dailyConsumptionRate: 2,
    reorderBufferDays: 1,
  },
  {
    id: '3',
    name: 'Coffee Beans',
    quantity: 400,
    unit: 'g',
    dailyConsumptionRate: 50,
    reorderBufferDays: 3,
  },
];

const PantryDashboard: React.FC = () => {
  const [items, setItems] = useState(mockItems);

  const getDaysRemaining = (item: PantryItem) =>
    Math.floor(item.quantity / item.dailyConsumptionRate);

  const handleReorder = (item: PantryItem) => {
    console.log(`Reorder confirmed for ${item.name}`);
    toast.success(`Reorder confirmed for ${item.name}`);
    setItems((prev) =>
      prev.map((it) =>
        it.id === item.id ? { ...it, quantity: INITIAL_STOCK } : it
      )
    );
  };

  const getBadgeColor = (days: number) => {
    if (days <= 0) return 'bg-red-600';
    if (days < 5) return 'bg-yellow-500';
    return 'bg-green-600';
  };

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const days = getDaysRemaining(item);
        return (
          <div
            key={item.id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 shadow flex flex-col md:flex-row md:items-center md:justify-between"
          >
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {item.name} ({item.unit})
              </h3>
              <p className="text-sm text-gray-500 mb-1">
                Quantity: {item.quantity} {item.unit}
              </p>
              <span
                className={`inline-block px-2 py-1 text-xs font-medium text-white rounded ${getBadgeColor(days)}`}
              >
                {days > 0 ? `${days}d remaining` : '0d remaining'}
              </span>
              {days <= item.reorderBufferDays && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400 font-medium">
                  Reorder Soon
                </p>
              )}
            </div>
            <button
              onClick={() => handleReorder(item)}
              className="mt-4 md:mt-0 bg-accent-400 hover:bg-accent-500 text-gray-900 font-medium rounded px-4 py-2 transition-all"
            >
              Reorder
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default PantryDashboard;
