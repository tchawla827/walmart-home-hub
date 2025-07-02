import React, { useState, useEffect } from 'react';

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
    if (!name || quantity <= 0) return;
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
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">SmartPantry Setup</h1>
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Item name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(parseFloat(e.target.value))}
          className="border p-2 rounded"
        />
        <select
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          className="border p-2 rounded"
        >
          {units.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Consumption rate"
          value={rate}
          onChange={(e) => setRate(parseFloat(e.target.value))}
          className="border p-2 rounded"
        />
        <select
          value={frequency}
          onChange={(e) =>
            setFrequency(e.target.value as 'daily' | 'weekly')
          }
          className="border p-2 rounded"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
        </select>
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          onClick={handleAddItem}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add to Pantry
        </button>
      </div>

      {items.length > 0 && (
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Item Name</th>
              <th className="text-left p-2">Qty Remaining</th>
              <th className="text-left p-2">Rate</th>
              <th className="text-left p-2">Unit</th>
              <th className="text-left p-2">Frequency</th>
              <th className="p-2">Remove</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="p-2">{item.name}</td>
                <td className="p-2">
                  <input
                    type="number"
                    className="border p-1 rounded w-24"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(
                        item.id,
                        'quantity',
                        parseFloat(e.target.value)
                      )
                    }
                  />
                </td>
                <td className="p-2">
                  <input
                    type="number"
                    className="border p-1 rounded w-20"
                    value={item.rate}
                    onChange={(e) =>
                      handleItemChange(
                        item.id,
                        'rate',
                        parseFloat(e.target.value)
                      )
                    }
                  />
                </td>
                <td className="p-2">
                  <select
                    value={item.unit}
                    onChange={(e) =>
                      handleItemChange(item.id, 'unit', e.target.value)
                    }
                    className="border p-1 rounded"
                  >
                    {units.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2">
                  <select
                    value={item.frequency}
                    onChange={(e) =>
                      handleItemChange(
                        item.id,
                        'frequency',
                        e.target.value as 'daily' | 'weekly'
                      )
                    }
                    className="border p-1 rounded"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </td>
                <td className="p-2 text-center">
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PantrySetup;

