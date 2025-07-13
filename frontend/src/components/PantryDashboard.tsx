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
    quantity: 1000,
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
    quantity: 500,
    unit: 'g',
    dailyConsumptionRate: 50,
    reorderBufferDays: 3,
  },
];

interface ReorderLog {
  itemId: string;
  itemName: string;
  status: 'confirmed' | 'skipped' | 'delayed';
  timestamp: number;
}

const PantryDashboard: React.FC = () => {
  const [items, setItems] = useState(mockItems);
  const [reorderLogs, setReorderLogs] = useState<ReorderLog[]>([]);
  const [handled, setHandled] = useState<Record<string, boolean>>({});

  const getDaysRemaining = (item: PantryItem) =>
    Math.floor(item.quantity / item.dailyConsumptionRate);

  const handleAction = (
    item: PantryItem,
    status: 'confirmed' | 'skipped' | 'delayed'
  ) => {
    const messageMap = {
      confirmed: `Reorder confirmed for ${item.name}`,
      skipped: `Skipped reorder for ${item.name}`,
      delayed: `Delayed reorder for ${item.name}`,
    } as const;

    if (status === 'confirmed') {
      setItems((prev) =>
        prev.map((it) =>
          it.id === item.id ? { ...it, quantity: INITIAL_STOCK } : it
        )
      );
    }

    setReorderLogs((prev) => [
      ...prev,
      { itemId: item.id, itemName: item.name, status, timestamp: Date.now() },
    ]);

    setHandled((prev) => ({ ...prev, [item.id]: true }));

    const toastFn =
      status === 'confirmed'
        ? toast.success
        : status === 'skipped'
        ? toast.info
        : toast.warning;
    toastFn(messageMap[status]);
  };

  const getBadgeColor = (days: number) => {
    if (days <= 0) return 'bg-red-600 text-white';
    if (days < 5) return 'bg-accent-400 text-gray-900';
    return 'bg-green-600 text-white';
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-primary-700 dark:text-primary-400 mb-6">
        Pantry Inventory
      </h1>
      
      <div className="space-y-4">
        {items.map((item) => {
          const days = getDaysRemaining(item);
          const needsReorder = days <= item.reorderBufferDays;
          
          return (
            <div
              key={item.id}
              className={`border rounded-lg p-4 shadow-sm transition-all ${
                needsReorder 
                  ? 'border-accent-400 bg-accent-50 dark:bg-gray-800'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-primary-800 dark:text-primary-200">
                      {item.name}
                    </h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {item.quantity} {item.unit} remaining
                    </span>
                  </div>
                  
                  <div className="mt-2 flex items-center gap-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(days)}`}
                    >
                      {days > 0 ? `${days}d remaining` : 'Out of stock'}
                    </span>
                    
                    {needsReorder && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                        Reorder Soon
                      </span>
                    )}
                  </div>
                </div>

                {needsReorder && !handled[item.id] ? (
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleAction(item, 'confirmed')}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                    >
                      Confirm Reorder
                    </button>
                    <button
                      onClick={() => handleAction(item, 'skipped')}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 transition-colors"
                    >
                      Skip
                    </button>
                    <button
                      onClick={() => handleAction(item, 'delayed')}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-gray-900 bg-accent-400 hover:bg-accent-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-500 transition-colors"
                    >
                      Remind Later
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleAction(item, 'confirmed')}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                  >
                    Reorder Now
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PantryDashboard;