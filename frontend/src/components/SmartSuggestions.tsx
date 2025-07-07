import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export interface PantryItem {
  id: string;
  name: string;
  category?: string;
}

interface Props {
  currentItems: PantryItem[];
}

const SmartSuggestions: React.FC<Props> = ({ currentItems }) => {
  const [pantry, setPantry] = useState<PantryItem[]>(currentItems);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Generate suggestion list based on pantry items
  const generateSuggestions = (items: PantryItem[]): string[] => {
    const names = items.map((i) => i.name.toLowerCase());
    const set = new Set<string>();

    if (names.includes('milk')) set.add('Cereal');
    if (names.includes('rice')) set.add('Lentils');
    if (names.includes('toilet paper')) set.add('Hand Wash');
    if (names.includes('coffee')) {
      set.add('Sugar');
      set.add('Creamer');
    }
    if (names.includes('eggs')) {
      set.add('Bread');
      set.add('Butter');
    }
    if (names.includes('pasta')) set.add('Pasta Sauce');
    if (names.includes('chicken')) set.add('Seasoning');

    // Remove any that already exist in the pantry
    items.forEach((it) => set.delete(it.name));

    return Array.from(set);
  };

  useEffect(() => {
    setPantry(currentItems);
  }, [currentItems]);

  useEffect(() => {
    setSuggestions(generateSuggestions(pantry));
  }, [pantry]);

  const handleAdd = (name: string) => {
    if (pantry.some((it) => it.name === name)) return;
    setPantry((prev) => [...prev, { id: Math.random().toString(36), name }]);
    toast.success(`Added ${name} to pantry`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-primary-800 dark:text-primary-200">
          Smart Suggestions
        </h3>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
          {suggestions.length} items
        </span>
      </div>

      {suggestions.length === 0 ? (
        <div className="text-center py-6">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            No suggestions right now. Add more items to your pantry to get recommendations.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion}
              className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <div className="flex items-center">
                <svg
                  className="h-5 w-5 text-accent-500 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="font-medium text-gray-900 dark:text-white">
                  {suggestion}
                </span>
              </div>
              <button
                onClick={() => handleAdd(suggestion)}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
              >
                Add
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SmartSuggestions;