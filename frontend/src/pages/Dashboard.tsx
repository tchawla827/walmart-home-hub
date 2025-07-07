import React from 'react';
import PantryDashboard from '../components/PantryDashboard';

const Dashboard: React.FC = () => (
  <div className="p-4">
    <h1 className="text-2xl font-bold mb-4">SmartPantry Dashboard</h1>
    <PantryDashboard />
  </div>
);

export default Dashboard;
