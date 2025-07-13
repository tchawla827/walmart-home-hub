import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../api';
import { Product } from '../types';
import { mockProducts } from '../mockProducts';
import PantryItemCard from '../components/PantryItemCard';

const unitOptions = ['ml', 'g', 'pcs', 'pack'];

const getUnitForProduct = (product: Product | null): string => {
  if (!product) return 'pcs';
  const name = (product.title || product.name || '').toLowerCase();
  if (name.includes('milk') || name.includes('water')) return 'ml';
  if (name.includes('coffee') || name.includes('rice')) return 'g';
  if (name.includes('egg')) return 'pcs';
  return 'pcs';
};

export interface PantryItem {
  id: string;
  name: string;
  category: string;
  /** amount consumed per `days` period */
  rate: number;
  /** number of days represented by `rate` */
  days: number;
  /** percentage threshold to trigger reorder */
  reorderBuffer: number;
  unit: string;
}


const generateId = () =>
  Math.random().toString(36).substring(2) + Date.now().toString(36);

const PantrySetup: React.FC = () => {
  const [items, setItems] = useState<PantryItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Dairy');
  const [rate, setRate] = useState<number>(0);
  const [days, setDays] = useState<number>(1);
  const [reorderBuffer, setReorderBuffer] = useState<number>(25);
  const [unit, setUnit] = useState<string>('pcs');
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const resetForm = () => {
    setName('');
    setCategory('Dairy');
    setRate(0);
    setDays(1);
    setReorderBuffer(25);
    setUnit('pcs');
    setEditingId(null);
    setSelectedProduct(null);
  };

  const validateForm = () =>
    name.trim() &&
    category &&
    unit &&
    rate > 0 &&
    days > 0 &&
    reorderBuffer > 0;

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
            ? { ...it, name, category, rate, days, reorderBuffer, unit }
            : it
        )
      );
      console.log('Form payload (edit)', {
        id: editingId,
        name,
        category,
        rate,
        days,
        reorderBuffer,
        unit,
      });
      toast.success('Item updated');
    } else {
      const newItem: PantryItem = {
        id: generateId(),
        name,
        category,
        rate,
        days,
        reorderBuffer,
        unit,
      };
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
    setRate(item.rate);
    setDays(item.days);
    setReorderBuffer(item.reorderBuffer);
    setUnit(item.unit);
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
    setUnit(getUnitForProduct(product));
    setSelectedProduct(product);
    setRate(1);
    setDays(1);
    setReorderBuffer(25);

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
            <div className="flex flex-col items-center ml-2">

              <span className="text-xs text-gray-500">Daily Use</span>
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
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="ml-1 border border-gray-300 dark:border-gray-600 rounded p-1 bg-white dark:bg-gray-800 text-xs"
                >
                  {unitOptions.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex flex-col items-center ml-2">
              <span className="text-xs text-gray-500">Duration (days)</span>
              <input
                type="number"
                min={1}
                className="w-16 border border-gray-300 dark:border-gray-600 rounded p-1 bg-white dark:bg-gray-800"
                value={days}
                onChange={(e) => setDays(parseInt(e.target.value))}
              />
            </div>
            <div className="flex flex-col items-center ml-2">
              <span className="text-xs text-gray-500">Reorder Buffer (%)</span>
              <input
                type="number"
                min={1}
                max={100}
                className="w-20 border border-gray-300 dark:border-gray-600 rounded p-1 bg-white dark:bg-gray-800"
                value={reorderBuffer}
                onChange={(e) => setReorderBuffer(parseInt(e.target.value))}
              />
            </div>

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-64 overflow-y-auto">
            {items.map((item) => (
              <PantryItemCard
                key={item.id}
                item={item}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
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
