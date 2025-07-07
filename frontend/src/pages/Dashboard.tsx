import React from 'react';
import PantryDashboard from '../components/PantryDashboard';
import ReorderTimeline from '../components/ReorderTimeline';

const Dashboard: React.FC = () => (
  <div className="p-4">
    <h1 className="text-2xl font-bold mb-4">SmartPantry Dashboard</h1>
    <PantryDashboard />
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-2">Reorder Timeline</h2>
      <ReorderTimeline />
    </div>
  </div>
);

export default Dashboard;
