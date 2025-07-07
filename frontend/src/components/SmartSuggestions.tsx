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
    toast.success(`Added ${name} to pantry`);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 space-y-2">
      <h3 className="text-lg font-semibold mb-2">Smart Suggestions</h3>
      {suggestions.length === 0 ? (
        <p className="text-sm text-gray-500">No suggestions right now.</p>
      ) : (
        <ul className="space-y-2">
          {suggestions.map((s) => (
            <li
              key={s}
              className="flex items-center justify-between border border-gray-200 dark:border-gray-700 rounded p-2"
            >
              <span className="text-gray-900 dark:text-white">{s}</span>
              <button
                onClick={() => handleAdd(s)}
                className="bg-accent-400 hover:bg-accent-500 text-gray-900 font-medium rounded px-3 py-1 text-sm"
              >
                Add to Pantry
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SmartSuggestions;
