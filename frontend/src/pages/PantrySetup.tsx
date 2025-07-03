import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export interface PantryItem {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  rate: number;
  frequency: 'daily' | 'weekly';
  category: string;
}

const units = ['g', 'kg', 'ml', 'L', 'items'];

const PantrySetup: React.FC = () => {
  const [items, setItems] = useState<PantryItem[]>([]);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState<number>(0);
  const [unit, setUnit] = useState('items');
  const [rate, setRate] = useState<number>(0);
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily');
  const [category, setCategory] = useState('');

  useEffect(() => {
    if (items.length) {
      console.log('Current pantry items:', items);
    }
  }, [items]);

  const handleAddItem = () => {
    if (!name || quantity <= 0) {
      toast.error('Please enter an item name and valid quantity');
      return;
    }
    const newItem: PantryItem = {
      id: Date.now(),
      name,
      quantity,
      unit,
      rate,
      frequency,
      category,
    };
    setItems((prev) => [...prev, newItem]);
    setName('');
    setQuantity(0);
    setUnit('items');
    setRate(0);
    setFrequency('daily');
    setCategory('');
    toast.success(`${name} added to pantry`);
  };

  const handleItemChange = (
    id: number,
    field: keyof PantryItem,
    value: string | number
  ) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleRemove = (id: number) => {
    const itemToRemove = items.find(item => item.id === id);
    setItems((prev) => prev.filter((item) => item.id !== id));
    toast.error(`${itemToRemove?.name} removed from pantry`);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="bg-primary-600 p-6">
          <h1 className="text-2xl font-bold text-white">SmartPantry Setup</h1>
          <p className="text-primary-100">Track and manage your household items</p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
            <input
              type="text"
              placeholder="Item name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 p-2 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <input
              type="number"
              placeholder="Quantity"
              value={quantity || ''}
              onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
              className="border border-gray-300 dark:border-gray-600 p-2 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 p-2 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {units.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Rate"
              value={rate || ''}
              onChange={(e) => setRate(parseFloat(e.target.value) || 0)}
              className="border border-gray-300 dark:border-gray-600 p-2 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <select
              value={frequency}
              onChange={(e) =>
                setFrequency(e.target.value as 'daily' | 'weekly')
              }
              className="border border-gray-300 dark:border-gray-600 p-2 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
            <button
              onClick={handleAddItem}
              className="bg-accent-400 hover:bg-accent-500 text-gray-900 px-4 py-2 rounded-md font-medium transition-all hover:scale-[1.02]"
            >
              Add Item
            </button>
          </div>

          {items.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Item</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Qty</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Rate</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Unit</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Frequency</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{item.name}</td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          className="border border-gray-300 dark:border-gray-600 p-1 rounded-md w-20 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          value={item.quantity || ''}
                          onChange={(e) =>
                            handleItemChange(
                              item.id,
                              'quantity',
                              parseFloat(e.target.value) || 0
                            )
                          }
                        />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          className="border border-gray-300 dark:border-gray-600 p-1 rounded-md w-20 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          value={item.rate || ''}
                          onChange={(e) =>
                            handleItemChange(
                              item.id,
                              'rate',
                              parseFloat(e.target.value) || 0
                            )
                          }
                        />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <select
                          value={item.unit}
                          onChange={(e) =>
                            handleItemChange(item.id, 'unit', e.target.value)
                          }
                          className="border border-gray-300 dark:border-gray-600 p-1 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          {units.map((u) => (
                            <option key={u} value={u}>
                              {u}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <select
                          value={item.frequency}
                          onChange={(e) =>
                            handleItemChange(
                              item.id,
                              'frequency',
                              e.target.value as 'daily' | 'weekly'
                            )
                          }
                          className="border border-gray-300 dark:border-gray-600 p-1 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                        </select>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">Your pantry is empty. Add some items to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PantrySetup;