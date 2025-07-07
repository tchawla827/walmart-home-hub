import React, { useEffect, useState } from 'react';

interface Profile {
  id: string;
  name?: string | null;
  email?: string | null;
  created_at?: string | null;
  auto_order_enabled?: boolean | null;
  avatar_url?: string | null;
}

interface StreakPantryItem {
  name: string;
  quantity: number;
  dailyConsumptionRate: number;
  lastDepletedDate: string;
}

const mockPantryItems: StreakPantryItem[] = [
  {
    name: 'Milk',
    quantity: 2,
    dailyConsumptionRate: 1,
    lastDepletedDate: '2025-07-05',
  },
  {
    name: 'Eggs',
    quantity: 12,
    dailyConsumptionRate: 2,
    lastDepletedDate: '2025-07-04',
  },
  {
    name: 'Rice',
    quantity: 1,
    dailyConsumptionRate: 0.5,
    lastDepletedDate: '2025-07-02',
  },
];

const calculateStreak = (items: StreakPantryItem[]): number => {
  let latest: Date | null = null;
  for (const item of items) {
    if (item.quantity <= 0 && !item.lastDepletedDate) {
      latest = new Date();
      break;
    }
    if (item.lastDepletedDate) {
      const date = new Date(item.lastDepletedDate);
      if (!latest || date > latest) {
        latest = date;
      }
    }
  }
  if (!latest) return 0;
  const diff = Date.now() - latest.getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
};

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [pantryCount, setPantryCount] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [pantryItems, setPantryItems] = useState<StreakPantryItem[]>([]);
  const [autoOrder, setAutoOrder] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setProfile({
      id: 'demo-user',
      name: 'Tavish Chawla',
      email: 'tchawla827@gmail.com',
      created_at: '2025-07-01T00:00:00Z',
      auto_order_enabled: true,
    });
    setPantryItems(mockPantryItems);
    setPantryCount(mockPantryItems.length);
    setStreak(calculateStreak(mockPantryItems));
    setAutoOrder(true);
    setLoading(false);
  }, []);

  const toggleAutoOrder = () => {
    if (!profile) return;
    const newVal = !autoOrder;
    setAutoOrder(newVal);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const displayProfile = profile || { name: 'Guest', email: '' } as Profile;

  const initials = displayProfile.name
    ? displayProfile.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : displayProfile.email?.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Profile Header Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="bg-primary-600 h-24"></div>
          <div className="px-6 pb-6 -mt-12 relative">
            <div className="flex justify-between items-end">
              <div className="flex items-end space-x-4">
                {displayProfile.avatar_url ? (
                  <img
                    src={displayProfile.avatar_url}
                    alt="Profile"
                    className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 bg-primary-700 text-white flex items-center justify-center text-3xl font-bold">
                    {initials}
                  </div>
                )}
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {displayProfile.name || displayProfile.email}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300">
                    {displayProfile.email}
                  </p>
                </div>
              </div>
              {displayProfile.created_at && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Joined {new Date(displayProfile.created_at).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 mb-3">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Pantry Items</h3>
            <p className="mt-2 text-3xl font-bold text-primary-600">{pantryCount}</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-accent-100 dark:bg-accent-900 text-accent-600 dark:text-accent-300 mb-3">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Replenishment Streak</h3>
            <p className="mt-2 text-3xl font-bold text-primary-600">{streak} days</p>
          </div>
        </div>

        {/* Auto Order Toggle */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Auto Reorder</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Automatically reorder items when running low
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoOrder}
                onChange={toggleAutoOrder}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>

        {/* Pantry Items List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Your Pantry Items</h3>
          </div>
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {pantryItems.map((item) => (
              <li key={item.name} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                      <span className="text-primary-600 dark:text-primary-300 font-medium">
                        {item.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {item.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Consumed: {item.dailyConsumptionRate}/day
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    {item.quantity} remaining
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;