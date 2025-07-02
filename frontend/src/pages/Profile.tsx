import React, { useState } from 'react';

export interface UserSettings {
  autoReorder: boolean;
  reorderBuffer: number;
  includePicks: boolean;
  budget: number;
}

const Profile: React.FC = () => {
  // Mock user data; replace with real session data when available
  const user = {
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
  };

  const [autoReorder, setAutoReorder] = useState<boolean>(false);
  const [reorderBuffer, setReorderBuffer] = useState<number>(3);

  const [includePicks, setIncludePicks] = useState<boolean>(true);
  const [budget, setBudget] = useState<number>(100);

  const handleSavePantry = () => {
    const settings = {
      autoReorder,
      reorderBuffer,
    };
    console.log('SmartPantry Settings', settings);
  };

  const handleSaveGift = () => {
    const settings = {
      includePicks,
      budget,
    };
    console.log('GiftGenius Settings', settings);
  };

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <div className="bg-white shadow rounded p-6 flex items-center space-x-4">
        <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-bold">
          {initials}
        </div>
        <div>
          <p className="text-lg font-semibold">{user.name}</p>
          <p className="text-gray-600">{user.email}</p>
        </div>
      </div>

      <div className="bg-white shadow rounded p-6 space-y-4">
        <h2 className="text-xl font-bold">SmartPantry Preferences</h2>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={autoReorder}
            onChange={(e) => setAutoReorder(e.target.checked)}
            className="h-4 w-4"
          />
          <span>Enable Auto-Reorder</span>
        </label>
        <div>
          <label className="block mb-1" htmlFor="buffer">
            Reorder Buffer (days before running out)
          </label>
          <input
            id="buffer"
            type="number"
            min={1}
            className="border p-2 rounded w-24"
            value={reorderBuffer}
            onChange={(e) => setReorderBuffer(parseInt(e.target.value))}
          />
        </div>
        <button
          onClick={handleSavePantry}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save SmartPantry Settings
        </button>
      </div>

      <div className="bg-white shadow rounded p-6 space-y-4">
        <h2 className="text-xl font-bold">GiftGenius Preferences</h2>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={includePicks}
            onChange={(e) => setIncludePicks(e.target.checked)}
            className="h-4 w-4"
          />
          <span>Include Walmart Picks</span>
        </label>
        <div>
          <label className="block mb-1" htmlFor="budget">
            Default Budget: ${budget}
          </label>
          <input
            id="budget"
            type="range"
            min={20}
            max={200}
            step={5}
            value={budget}
            onChange={(e) => setBudget(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
        <button
          onClick={handleSaveGift}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Gift Preferences
        </button>
      </div>
    </div>
  );
};

export default Profile;
