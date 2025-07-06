import React, { useEffect, useState } from 'react';
import api from '../api';
import { GiftBundle } from '../types';
import BudgetSlider from './BudgetSlider';

const GiftBundleGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [lastPrompt, setLastPrompt] = useState('');
  const [budget, setBudget] = useState(100);
  const [bundles, setBundles] = useState<GiftBundle[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBundles = async (p: string) => {
    setLoading(true);
    try {
      console.log('Fetching gift bundles for prompt:', p, 'budget', budget);
      const res = await api.post<{ bundles: GiftBundle[] }>('/api/gift-bundles', {
        prompt: p,
        budget,
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

  // Re-fetch bundles when budget changes after initial search
  useEffect(() => {
    if (!lastPrompt) return;
    const t = setTimeout(() => {
      fetchBundles(lastPrompt);
    }, 300);
    return () => clearTimeout(t);
  }, [budget]);

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetchBundles(prompt);
          setLastPrompt(prompt);
        }}
        className="space-y-4"
      >
        <div>
          <label className="block mb-1 font-medium text-gray-900 dark:text-white">
            Enter your gift request
          </label>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., gift for sister's birthday"
            className="border border-gray-300 dark:border-gray-600 rounded-md p-2 w-full bg-white dark:bg-gray-800"
          />
        </div>

        <BudgetSlider min={25} max={500} value={budget} onChange={setBudget} />

        <button
          type="submit"
          disabled={loading}
          className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md font-medium transition-all disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Find Gifts'}
        </button>
      </form>

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
