import React, { useState } from 'react';
import api from '../api';
import { GiftBundle } from '../types';
import BudgetRangeSlider from './BudgetRangeSlider';

const prompts = [
  { label: "Sister Birthday", value: "sister birthday" },
  { label: "Brother Wedding", value: "brother wedding" },
];

const GiftBundleGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState(prompts[0].value);
  const [range, setRange] = useState<[number, number]>([50, 150]);
  const [bundles, setBundles] = useState<GiftBundle[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBundles = async () => {
    setLoading(true);
    try {
      const res = await api.post<{ bundles: GiftBundle[] }>('/api/gift-bundles', {
        prompt,
        budgetRange: { min: range[0], max: range[1] },
      });
      setBundles(res.data.bundles);
    } catch (err) {
      console.error('Failed to fetch bundles', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAll = (bundle: GiftBundle) => {
    console.log('Add All to Cart', bundle);
  };

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <div>
        <label className="block mb-1 font-medium text-gray-900 dark:text-white">
          Occasion
        </label>
        <select
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="border border-gray-300 dark:border-gray-600 rounded-md p-2 w-full bg-white dark:bg-gray-800"
        >
          {prompts.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      <BudgetRangeSlider min={25} max={500} values={range} onChange={setRange} />

      <button
        onClick={fetchBundles}
        disabled={loading}
        className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md font-medium transition-all disabled:opacity-50"
      >
        {loading ? 'Generating...' : 'Generate Bundles'}
      </button>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {bundles.map((bundle, idx) => (
          <div
            key={idx}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow hover:shadow-md transition-all"
          >
            <h3 className="text-lg font-semibold text-primary-600 dark:text-primary-400 mb-2">
              {bundle.title}
            </h3>
            <ul className="space-y-1 mb-3">
              {bundle.items.map((item, i) => (
                <li key={i} className="flex justify-between text-sm">
                  <span>{item.name}</span>
                  <span className="font-medium">${item.price.toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <p className="font-bold mb-2">Total: ${bundle.totalPrice.toFixed(2)}</p>
            <button
              onClick={() => handleAddAll(bundle)}
              className="bg-accent-400 hover:bg-accent-500 text-gray-900 px-3 py-1 rounded-md"
            >
              Add All to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GiftBundleGenerator;
