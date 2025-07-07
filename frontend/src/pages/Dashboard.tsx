import React from 'react';
import PantryDashboard from '../components/PantryDashboard';
import SmartSuggestions, { PantryItem } from '../components/SmartSuggestions';
import ReorderTimeline from '../components/ReorderTimeline';

const mockPantry: PantryItem[] = [
  { id: '1', name: 'Milk' },
  { id: '2', name: 'Coffee' },
];

const Dashboard: React.FC = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6 lg:p-8">
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary-800 dark:text-primary-200">
            SmartPantry Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your pantry inventory and reorders
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-accent-100 text-accent-800 dark:bg-accent-900 dark:text-accent-200">
            Active
          </span>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors">
            Add Item
          </button>
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pantry Dashboard - Full width on mobile, 2/3 on desktop */}
        <div className="lg:col-span-2">
          <PantryDashboard />
        </div>

        {/* Smart Suggestions - Full width on mobile, 1/3 on desktop */}
        <div className="lg:col-span-1">
          <SmartSuggestions currentItems={mockPantry} />
        </div>

        {/* Reorder Timeline - Full width */}
        <div className="col-span-full">
          <ReorderTimeline />
        </div>
      </div>

      {/* Stats Footer */}
      <footer className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="border-r border-gray-200 dark:border-gray-700 pr-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Items</p>
            <p className="text-2xl font-bold text-primary-700 dark:text-primary-400">24</p>
          </div>
          <div className="border-r border-gray-200 dark:border-gray-700 pr-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Need Reorder</p>
            <p className="text-2xl font-bold text-accent-600 dark:text-accent-400">5</p>
          </div>
          <div className="border-r border-gray-200 dark:border-gray-700 pr-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">This Month</p>
            <p className="text-2xl font-bold text-primary-700 dark:text-primary-400">12</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Suggestions</p>
            <p className="text-2xl font-bold text-primary-700 dark:text-primary-400">8</p>
          </div>
        </div>
      </footer>
    </div>
  </div>
);

export default Dashboard;