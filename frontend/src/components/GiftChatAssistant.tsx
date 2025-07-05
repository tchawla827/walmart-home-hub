import React, { useEffect, useRef, useState } from 'react';
import api from '../api';
import BudgetSlider from './BudgetSlider';
import GiftBundleList from './GiftBundleList';
import { GiftBundle } from '../types';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const GiftChatAssistant: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [bundles, setBundles] = useState<GiftBundle[]>([]);
  const [lastPrompt, setLastPrompt] = useState('');
  const [budget, setBudget] = useState(100);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, bundles]);

  const fetchBundles = async (prompt: string, currentBudget: number): Promise<GiftBundle[]> => {
    const payload: any = { prompt };
    if (currentBudget) payload.budget = currentBudget;
    console.log('Sending payload:', payload);
    try {
      const res = await api.post<{ bundles: GiftBundle[] }>('/api/giftgenius/chat', payload);
      return res.data.bundles;
    } catch (err) {
      console.error('Failed to fetch bundles', err);
      throw err;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const prompt = input.trim();
    setMessages((prev) => [...prev, { role: 'user', content: prompt }]);
    setInput('');
    setLoading(true);
    setError(null);
    try {
      const result = await fetchBundles(prompt, budget);
      setBundles(result);
      setLastPrompt(prompt);
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Here are some gift bundles:' }]);
    } catch (err) {
      setError('Failed to fetch gift bundles');
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Error fetching gift bundles.' }]);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch bundles when budget changes
  useEffect(() => {
    if (!lastPrompt) return;
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const result = await fetchBundles(lastPrompt, budget);
        setBundles(result);
      } catch (err) {
        setError('Failed to fetch gift bundles');
      } finally {
        setLoading(false);
      }
    }, 500);
    return () => clearTimeout(t);
  }, [budget]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[75%] rounded-lg p-3 text-sm whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-primary-100 text-primary-800'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-white'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && messages.length === 0 && (
          <div className="flex justify-start">
            <div className="max-w-[75%] rounded-lg p-3 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-white">
              <span className="animate-pulse">...</span>
            </div>
          </div>
        )}
        {bundles.length > 0 && (
          <div className="mt-4">
            <BudgetSlider min={25} max={500} value={budget} onChange={setBudget} />
            {loading ? (
              <p className="text-gray-500 dark:text-gray-400">Updating bundles...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <GiftBundleList bundles={bundles} />
            )}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-900">
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="e.g., gift for my sister's wedding"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GiftChatAssistant;
