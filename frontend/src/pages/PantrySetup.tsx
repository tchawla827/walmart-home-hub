import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../api';
import { Product } from '../types';
import { mockProducts } from '../mockProducts';

export interface PantryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: 'grams' | 'liters' | 'count';
  /** amount consumed per selected frequency */
  rate: number;
  frequency: 'daily' | 'weekly' | 'monthly';
}

const UNITS: PantryItem['unit'][] = ['grams', 'liters', 'count'];
const CATEGORIES = ['Dairy', 'Grains', 'Produce', 'Meat', 'Other'];
const FREQUENCIES: PantryItem['frequency'][] = ['daily', 'weekly', 'monthly'];

const generateId = () =>
  Math.random().toString(36).substring(2) + Date.now().toString(36);

const PantrySetup: React.FC = () => {
  const [items, setItems] = useState<PantryItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Dairy');
  const [quantity, setQuantity] = useState<number>(0);
  const [unit, setUnit] = useState<PantryItem['unit']>('count');
  const [rate, setRate] = useState<number>(0);
  const [frequency, setFrequency] = useState<PantryItem['frequency']>('daily');
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const resetForm = () => {
    setName('');
    setCategory('Dairy');
    setQuantity(0);
    setUnit('count');
    setRate(0);
    setFrequency('daily');
    setEditingId(null);
    setSelectedProduct(null);
  };

  const validateForm = () => name.trim() && category && quantity > 0 && rate > 0;

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fill out all fields correctly');
      return;
    }

    if (editingId) {
      setItems((prev) =>
        prev.map((it) =>
          it.id === editingId
            ? { ...it, name, category, quantity, unit, rate, frequency }
            : it
        )
      );
      console.log('Form payload (edit)', { id: editingId, name, category, quantity, unit, rate, frequency });
      toast.success('Item updated');
    } else {
      const newItem: PantryItem = { id: generateId(), name, category, quantity, unit, rate, frequency };
      console.log('Form payload (add)', newItem);
      setItems((prev) => [...prev, newItem]);
      toast.success('Item added');
    }
    resetForm();
  };
  const handleEdit = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    setName(item.name);
    setCategory(item.category);
    setQuantity(item.quantity);
    setUnit(item.unit);
    setRate(item.rate);
    setFrequency(item.frequency);
    setSelectedProduct({
      id: 0,
      title: item.name,
      category: item.category,
      thumbnail: '',
      description: '',
      price: 0,
      images: [],
    });
    setEditingId(id);
  };

  const handleDelete = (id: string) => {
    const toRemove = items.find((i) => i.id === id);
    setItems((prev) => prev.filter((i) => i.id !== id));
    if (toRemove) toast.error(`${toRemove.name} removed`);
    if (editingId === id) resetForm();
  };

  const handleSave = async () => {
    try {
      await api.post('/api/pantry/setup', { items });
      toast.success('Pantry saved');
      console.log('Submitted pantry items', items);
    } catch (err) {
      console.log('Payload to submit:', items);
      toast.info('Mock submit complete');
    }
  };

  useEffect(() => {
    if (!search) {
      setResults([]);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      console.log(`API call: /api/products/search?q=${search}`);
      try {
        const res = await api.get<Product[]>('/api/products/search', {
          params: { q: search },
        });
        console.log('Search results', res.data);
        setResults(res.data);
      } catch (err) {
        console.error('Search failed, falling back to mock', err);
        const filtered = mockProducts.filter((p) =>
          p.title.toLowerCase().startsWith(search.toLowerCase())
        );
        setResults(filtered as unknown as Product[]);
      }
      setShowResults(true);
    }, 300);
  }, [search]);

  const handleSelectProduct = (product: Product) => {
    setName(product.title || product.name || '');
    setCategory(product.category);
    setSelectedProduct(product);
    setQuantity(1);

    setRate(1);
    setFrequency('daily');

    setShowResults(false);
    setResults([]);
    setSearch('');
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400">Pantry Setup</h1>
      <form onSubmit={handleAddItem} className="grid grid-cols-1 md:grid-cols-5 gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow relative">
        <div className="md:col-span-5 relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products"
            className="w-full border border-gray-300 dark:border-gray-600 rounded p-2"
          />
          {showResults && results.length > 0 && (
            <ul className="absolute z-10 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 w-full max-h-60 overflow-y-auto mt-1 rounded shadow">
              {results.map((p) => (
                <li
                  key={p.id}
                  onClick={() => handleSelectProduct(p)}
                  className="flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  {p.thumbnail && (
                    <img src={p.thumbnail} alt={p.title} className="w-8 h-8 object-cover" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{p.title}</p>
                    <p className="text-xs text-gray-500">{p.category}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {selectedProduct ? (
          <div className="md:col-span-5 flex items-center gap-4 border border-gray-300 dark:border-gray-600 rounded p-3 bg-gray-50 dark:bg-gray-700">
            {selectedProduct.thumbnail && (
              <img
                src={selectedProduct.thumbnail}
                alt={selectedProduct.title}
                className="w-16 h-16 object-cover"
              />
            )}
            <div className="flex-grow">
              <p className="font-medium text-gray-900 dark:text-white">
                {selectedProduct.title}
              </p>
              <p className="text-sm text-gray-500">{selectedProduct.category}</p>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs text-gray-500">Qty</span>
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(q - 1, 0))}
                  className="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded-l"
                >
                  -
                </button>
                <span className="px-2 w-8 text-center bg-white dark:bg-gray-800 border-t border-b border-gray-300 dark:border-gray-600">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded-r"
                >
                  +
                </button>
              </div>
            </div>
            <div className="flex flex-col items-center ml-2">

              <span className="text-xs text-gray-500">Rate</span>
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => setRate((r) => Math.max(r - 1, 0))}

                  className="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded-l"
                >
                  -
                </button>
                <span className="px-2 w-8 text-center bg-white dark:bg-gray-800 border-t border-b border-gray-300 dark:border-gray-600">

                  {rate}
                </span>
                <button
                  type="button"
                  onClick={() => setRate((r) => r + 1)}

                  className="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded-r"
                >
                  +
                </button>
              </div>
            </div>
            <select

              value={frequency}
              onChange={(e) => setFrequency(e.target.value as PantryItem['frequency'])}
              className="border border-gray-300 dark:border-gray-600 rounded p-1 ml-2"
            >
              {FREQUENCIES.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value as PantryItem['unit'])}
              className="border border-gray-300 dark:border-gray-600 rounded p-1 ml-2"

            >
              {UNITS.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="ml-4 bg-accent-400 hover:bg-accent-500 text-gray-900 font-medium rounded p-2 transition-all"
            >
              Add
            </button>
          </div>
        ) : (
          <p className="md:col-span-5 text-gray-500">Select a product to add.</p>

        )}
      </form>
      {items.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <ul className="max-h-64 overflow-y-auto divide-y divide-gray-200 dark:divide-gray-700">
            {items.map((item) => (
              <li key={item.id} className="py-2 flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {item.quantity} {item.unit} - {item.rate}/{item.frequency} ({item.category})
                  </p>
                </div>
                <div className="space-x-2">
                  <button onClick={() => handleEdit(item.id)} className="text-primary-600 hover:underline">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:underline">
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {items.length > 0 && (
        <button onClick={handleSave} className="bg-primary-600 hover:bg-primary-700 text-white rounded px-4 py-2">
          Save
        </button>
      )}
    </div>
  );
};

export default PantrySetup;
