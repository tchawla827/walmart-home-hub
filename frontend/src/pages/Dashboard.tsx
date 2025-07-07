import React from 'react';
import PantryDashboard from '../components/PantryDashboard';
import SmartSuggestions, { PantryItem } from '../components/SmartSuggestions';

const mockPantry: PantryItem[] = [
  { id: '1', name: 'Milk' },
  { id: '2', name: 'Coffee' },
];

const Dashboard: React.FC = () => (
  <div className="p-4 space-y-6">
    <h1 className="text-2xl font-bold">SmartPantry Dashboard</h1>
    <PantryDashboard />
    <SmartSuggestions currentItems={mockPantry} />
  </div>
);

export default Dashboard;
