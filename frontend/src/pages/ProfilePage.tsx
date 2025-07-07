import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';

interface Profile {
  id: string;
  name?: string | null;
  email?: string | null;
  created_at?: string | null;
  auto_order_enabled?: boolean | null;
  avatar_url?: string | null;
}

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [pantryCount, setPantryCount] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [autoOrder, setAutoOrder] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const { session, user, loading: authLoading } = useAuth();

  useEffect(() => {
    const loadProfile = async () => {
      if (authLoading) return;
      if (!session || !user) {
        setLoading(false);
        return;
      }
      try {
        // Fetch user profile info
        const { data, error } = await supabase
          .from('users')
          .select('id, name, email, created_at, auto_order_enabled, avatar_url')
          .eq('id', user.id)
          .single();
        if (error) throw error;
        setProfile(data);
        setAutoOrder(!!data?.auto_order_enabled);

        // Pantry size
        const { count } = await supabase
          .from('pantry_items')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);
        if (typeof count === 'number') setPantryCount(count);

        // Replenishment streak
        const { data: streakData } = await supabase
          .from('streaks')
          .select('count')
          .eq('user_id', user.id)
          .eq('streak_type', 'replenishment')
          .single();
        if (streakData?.count) setStreak(streakData.count);
      } catch (err) {
        console.error('Failed to load profile', err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [session, user, authLoading]);

  const toggleAutoOrder = async () => {
    if (!profile) return;
    const newVal = !autoOrder;
    setAutoOrder(newVal);
    const { error } = await supabase
      .from('users')
      .update({ auto_order_enabled: newVal })
      .eq('id', profile.id);
    if (error) {
      console.error('Failed to update auto-order', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <svg className="animate-spin h-8 w-8 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      </div>
    );
  }

  const displayProfile =
    profile || ({ name: 'Guest', email: '' } as Profile);

  const initials = displayProfile.name
    ? displayProfile.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : displayProfile.email?.charAt(0).toUpperCase();

  return (
    <div className="max-w-xl mx-auto p-4 space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex items-center space-x-6">
        {displayProfile.avatar_url ? (
          <img
            src={displayProfile.avatar_url}
            alt="avatar"
            className="w-20 h-20 rounded-full object-cover"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-primary-600 text-white flex items-center justify-center text-2xl font-bold">
            {initials}
          </div>
        )}
        <div>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
            {displayProfile.name || displayProfile.email}
          </p>
          <p className="text-gray-600 dark:text-gray-300">{displayProfile.email}</p>
          {displayProfile.created_at && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Joined {new Date(displayProfile.created_at).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 flex flex-col items-center">
          <span className="text-2xl font-semibold text-primary-600">{pantryCount}</span>
          <span className="text-sm text-gray-500">Pantry Items</span>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 flex flex-col items-center">
          <span className="text-2xl font-semibold text-primary-600">{streak}</span>
          <span className="text-sm text-gray-500">Replenishment Streak</span>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 flex items-center justify-between">
        <span className="font-medium text-gray-900 dark:text-white">Auto Order</span>
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
  );
};

export default ProfilePage;
