import React, { useState } from 'react';
import { toast } from 'react-toastify';

export interface PantryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  dailyConsumptionRate: number;
  reorderBufferDays: number;
  lastDepletedDate: string;
}

export interface ReorderLog {
  id: string;
  itemId: string;
  itemName: string;
  status: 'confirmed' | 'skipped' | 'delayed';
  timestamp: string;
}

const initialItems: PantryItem[] = [
  {
    id: '1',
    name: 'Milk',
    quantity: 1000,
    unit: 'ml',
    dailyConsumptionRate: 250,
    reorderBufferDays: 2,
    lastDepletedDate: '2025-07-01',
  },
  {
    id: '2',
    name: 'Rice',
    quantity: 3000,
    unit: 'g',
    dailyConsumptionRate: 200,
    reorderBufferDays: 3,
    lastDepletedDate: '2025-06-28',
  },
];

const SUGGESTIONS = ['Pasta', 'Cereal', 'Flour'];

const getDaysRemaining = (item: PantryItem) =>
  Math.floor(item.quantity / item.dailyConsumptionRate);

const getBadgeColor = (days: number) => {
  if (days <= 0) return 'bg-red-600';
  if (days <= 2) return 'bg-yellow-500';
  return 'bg-green-600';
};

const StreakTracker: React.FC<{ pantryItems: PantryItem[] }> = ({ pantryItems }) => {
  const days = Math.min(
    ...pantryItems.map((i) =>
      Math.floor(
        (Date.now() - new Date(i.lastDepletedDate).getTime()) / 86400000
      )
    )
  );
  return (
    <div className="bg-primary-50 dark:bg-gray-700 p-4 rounded-lg text-center">
      <h2 className="font-medium text-gray-900 dark:text-white mb-1">
        Replenishment Streak
      </h2>
      <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
        {days} days
      </p>
    </div>
  );
};

interface InventoryProps {
  items: PantryItem[];
  onAction: (item: PantryItem, action: 'confirmed' | 'skipped' | 'delayed') => void;
}

const InventoryTable: React.FC<InventoryProps> = ({ items, onAction }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead className="bg-gray-50 dark:bg-gray-700">
        <tr>
          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Item
          </th>
          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Quantity
          </th>
          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Days Left
          </th>
          <th className="px-4 py-2" />
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
        {items.map((item) => {
          const days = getDaysRemaining(item);
          return (
            <tr key={item.id} className="text-sm text-gray-900 dark:text-white">
              <td className="px-4 py-2 whitespace-nowrap">{item.name}</td>
              <td className="px-4 py-2 whitespace-nowrap">
                {item.quantity} {item.unit}
              </td>
              <td className="px-4 py-2 whitespace-nowrap">
                <span
                  className={`px-2 py-1 rounded text-white text-xs font-medium ${getBadgeColor(
                    days
                  )}`}
                >
                  {days}d
                </span>
              </td>
              <td className="px-4 py-2 whitespace-nowrap">
                {days <= item.reorderBufferDays && (
                  <div className="space-x-1">
                    <button
                      onClick={() => onAction(item, 'confirmed')}
                      className="bg-primary-500 hover:bg-primary-600 text-white px-2 py-1 rounded"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => onAction(item, 'skipped')}
                      className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-900 dark:text-white px-2 py-1 rounded"
                    >
                      Skip
                    </button>
                    <button
                      onClick={() => onAction(item, 'delayed')}
                      className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-2 py-1 rounded"
                    >
                      Delay
                    </button>
                  </div>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

interface SuggestProps {
  currentItems: PantryItem[];
  onAdd: (name: string) => void;
}

const SmartSuggestions: React.FC<SuggestProps> = ({ currentItems, onAdd }) => {
  const available = SUGGESTIONS.filter(
    (s) => !currentItems.some((i) => i.name === s)
  );
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
        Smart Suggestions
      </h3>
      {available.length === 0 && (
        <p className="text-sm text-gray-500">No suggestions</p>
      )}
      <ul className="space-y-2">
        {available.map((name) => (
          <li key={name} className="flex items-center justify-between">
            <span>{name}</span>
            <button
              onClick={() => onAdd(name)}
              className="text-sm bg-primary-500 hover:bg-primary-600 text-white px-2 py-1 rounded"
            >
              Add
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const ReorderTimeline: React.FC<{ reorderLogs: ReorderLog[] }> = ({ reorderLogs }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Reorder Timeline</h3>
    {reorderLogs.length === 0 ? (
      <p className="text-sm text-gray-500">No activity yet</p>
    ) : (
      <ul className="space-y-2 text-sm">
        {reorderLogs.map((log) => (
          <li key={log.id} className="flex justify-between">
            <span>
              {log.itemName} {log.status}
            </span>
            <span className="text-gray-500">
              {new Date(log.timestamp).toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    )}
  </div>
);

const SmartPantryDashboard: React.FC = () => {
  const [pantryItems, setPantryItems] = useState<PantryItem[]>(initialItems);
  const [reorderLogs, setReorderLogs] = useState<ReorderLog[]>([]);

  const handleAction = (
    item: PantryItem,
    action: 'confirmed' | 'skipped' | 'delayed'
  ) => {
    const log: ReorderLog = {
      id: Date.now().toString(),
      itemId: item.id,
      itemName: item.name,
      status: action,
      timestamp: new Date().toISOString(),
    };
    setReorderLogs((prev) => [log, ...prev]);

    if (action === 'confirmed') {
      setPantryItems((prev) =>
        prev.map((p) =>
          p.id === item.id ? { ...p, quantity: 1000 } : p
        )
      );
      toast.success(`${item.name} reordered`);
    } else if (action === 'skipped') {
      toast.info(`Skipped reorder for ${item.name}`);
    } else {
      toast.info(`Delayed reorder for ${item.name}`);
    }
  };

  const handleAddSuggestion = (name: string) => {
    const newItem: PantryItem = {
      id: Date.now().toString(),
      name,
      quantity: 500,
      unit: 'g',
      dailyConsumptionRate: 50,
      reorderBufferDays: 2,
      lastDepletedDate: new Date().toISOString().split('T')[0],
    };
    setPantryItems((prev) => [...prev, newItem]);
    toast.success(`${name} added to pantry`);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <StreakTracker pantryItems={pantryItems} />
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <InventoryTable items={pantryItems} onAction={handleAction} />
        </div>
        <div className="space-y-6">
          <SmartSuggestions currentItems={pantryItems} onAdd={handleAddSuggestion} />
          <ReorderTimeline reorderLogs={reorderLogs} />
        </div>
      </div>
    </div>
  );
};

export default SmartPantryDashboard;
