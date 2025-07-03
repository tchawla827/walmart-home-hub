import React, { useState } from 'react';
import { toast } from 'react-toastify';

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
    toast.success('SmartPantry preferences saved!');
  };

  const handleSaveGift = () => {
    const settings = {
      includePicks,
      budget,
    };
    console.log('GiftGenius Settings', settings);
    toast.success('Gift preferences saved!');
  };

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      {/* User Profile Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden p-6 flex items-center space-x-6">
        <div className="w-20 h-20 rounded-full bg-primary-600 text-white flex items-center justify-center text-2xl font-bold">
          {initials}
        </div>
        <div>
          <p className="text-xl font-semibold text-gray-900 dark:text-white">{user.name}</p>
          <p className="text-gray-600 dark:text-gray-300">{user.email}</p>
          <button className="mt-2 text-sm text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 transition-colors">
            Edit Profile
          </button>
        </div>
      </div>

      {/* SmartPantry Preferences */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="bg-primary-600 p-4">
          <h2 className="text-xl font-bold text-white">SmartPantry Preferences</h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Auto-Reorder</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Automatically reorder items when running low
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoReorder}
                onChange={(e) => setAutoReorder(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div>
            <label htmlFor="buffer" className="block mb-2 font-medium text-gray-900 dark:text-white">
              Reorder Buffer
              <span className="text-sm text-gray-500 dark:text-gray-400 block">
                Days before running out to reorder
              </span>
            </label>
            <input
              id="buffer"
              type="number"
              min={1}
              className="bg-gray-50 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white dark:bg-gray-700 rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-24 p-2.5"
              value={reorderBuffer}
              onChange={(e) => setReorderBuffer(parseInt(e.target.value))}
            />
          </div>

          <button
            onClick={handleSavePantry}
            className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-medium transition-all hover:scale-[1.02]"
          >
            Save SmartPantry Settings
          </button>
        </div>
      </div>

      {/* GiftGenius Preferences */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="bg-accent-400 p-4">
          <h2 className="text-xl font-bold text-gray-900">GiftGenius Preferences</h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Include Walmart Picks</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Show Walmart's recommended gifts in suggestions
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={includePicks}
                onChange={(e) => setIncludePicks(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-300 dark:peer-focus:ring-accent-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-accent-400"></div>
            </label>
          </div>

          <div>
            <label htmlFor="budget" className="block mb-2 font-medium text-gray-900 dark:text-white">
              Default Gift Budget: ${budget}
            </label>
            <input
              id="budget"
              type="range"
              min={20}
              max={200}
              step={5}
              value={budget}
              onChange={(e) => setBudget(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
            />
            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-1">
              <span>$20</span>
              <span>$200</span>
            </div>
          </div>

          <button
            onClick={handleSaveGift}
            className="bg-accent-400 hover:bg-accent-500 text-gray-900 px-6 py-3 rounded-lg font-medium transition-all hover:scale-[1.02]"
          >
            Save Gift Preferences
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;