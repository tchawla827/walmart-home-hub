import React, { useState } from 'react';
import { GiftBundle, GiftSuggestions, mockGiftGenius } from '../mockGiftGenius';
import { Product } from '../mockProducts';

interface ChatEntry {
  prompt: string;
  bundles: GiftBundle[];
  items: Product[];
}

const GiftGenius: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [history, setHistory] = useState<ChatEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!prompt.trim() || loading) return;
    console.log('User prompt:', prompt);
    setLoading(true);
    try {
      const result: GiftSuggestions = await mockGiftGenius(prompt);
      console.log('LLM response:', result);
      setHistory((prev) => [...prev, { prompt, bundles: result.bundles, items: result.items }]);
      setPrompt('');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAll = (bundle: GiftBundle) => {
    console.log('Add All to Cart:', bundle);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex-1 overflow-y-auto space-y-6 mb-4">
        {history.map((entry, idx) => (
          <div key={idx} className="space-y-2">
            <div className="bg-gray-100 p-2 rounded self-start">
              {entry.prompt}
            </div>

            {entry.items.map((item, iIdx) => (
              <div key={iIdx} className="bg-green-50 p-3 rounded">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm">{item.description}</p>
                <p className="font-medium mt-1">Price: ${item.price.toFixed(2)}</p>
              </div>
            ))}

            {entry.bundles.map((bundle, bIdx) => (
              <div key={bIdx} className="bg-blue-50 p-3 rounded">
                <h3 className="font-semibold">{bundle.title}</h3>
                <ul className="list-disc pl-5 text-sm">
                  {bundle.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p className="font-medium mt-1">
                  Total: ${bundle.totalPrice.toFixed(2)}
                </p>
                <button
                  onClick={() => handleAddAll(bundle)}
                  className="mt-2 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  Add All to Cart
                </button>
              </div>
            ))}
          </div>
        ))}
        {loading && <p>Loading...</p>}
      </div>
      <div>
        <textarea
          className="w-full border p-2 rounded mb-2 resize-none"
          rows={3}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., Gift for my sister's graduation under $50"
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Find Gift Ideas
        </button>
      </div>
    </div>
  );
};

export default GiftGenius;
