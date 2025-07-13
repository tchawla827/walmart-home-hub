import React from 'react';
import { PantryItem } from '../pages/PantrySetup';

interface Props {
  item: PantryItem;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const PantryItemCard: React.FC<Props> = ({ item, onEdit, onDelete }) => {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 shadow flex justify-between items-start">
      <div>
        <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {item.category} – Daily Usage: {item.dailyUsage} {item.unit} – Duration: {item.days} {item.days === 1 ? 'day' : 'days'} – Reorder Buffer: {item.reorderBuffer}%
        </p>
      </div>
      <div className="space-x-2">
        <button onClick={() => onEdit(item.id)} className="text-primary-600 hover:underline">
          Edit
        </button>
        <button onClick={() => onDelete(item.id)} className="text-red-600 hover:underline">
          Delete
        </button>
      </div>
    </div>
  );
};

export default PantryItemCard;
