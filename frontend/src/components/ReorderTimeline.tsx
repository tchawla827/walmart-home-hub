import React, { useState } from 'react';

export interface ReorderLog {
  id: string;
  itemName: string;
  quantity: number;
  status: 'suggested' | 'confirmed' | 'skipped' | 'delayed';
  date: string; // ISO string
}

const mockReorderLogs: ReorderLog[] = [
  {
    id: '1',
    itemName: 'Milk',
    quantity: 1000,
    status: 'suggested',
    date: '2025-07-06T10:15:00Z',
  },
  {
    id: '2',
    itemName: 'Rice',
    quantity: 2000,
    status: 'confirmed',
    date: '2025-07-05T18:45:00Z',
  },
  {
    id: '3',
    itemName: 'Eggs',
    quantity: 12,
    status: 'skipped',
    date: '2025-07-04T08:30:00Z',
  },
  {
    id: '4',
    itemName: 'Coffee Beans',
    quantity: 500,
    status: 'delayed',
    date: '2025-07-03T14:20:00Z',
  },
];

const statusColors: Record<ReorderLog['status'], string> = {
  suggested: 'bg-yellow-500',
  confirmed: 'bg-green-600',
  skipped: 'bg-red-600',
  delayed: 'bg-orange-500',
};

const statusLabels: Record<ReorderLog['status'], string> = {
  suggested: 'Suggested',
  confirmed: 'Confirmed',
  skipped: 'Skipped',
  delayed: 'Delayed',
};

const filters: Array<'all' | ReorderLog['status']> = [
  'all',
  'suggested',
  'confirmed',
  'skipped',
  'delayed',
];

const ReorderTimeline: React.FC = () => {
  const [filter, setFilter] = useState<typeof filters[number]>('all');

  const logs = [...mockReorderLogs]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .filter((log) => filter === 'all' || log.status === filter);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-primary-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
            }`}
          >
            {f === 'all' ? 'All' : statusLabels[f]}
          </button>
        ))}
      </div>
      <ul className="space-y-4">
        {logs.map((log) => (
          <li key={log.id} className="relative pl-6">
            <div className="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-primary-500" />
            <div className="flex items-start justify-between bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-3">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {log.itemName}
                </p>
                <p className="text-sm text-gray-500">
                  Qty: {log.quantity} –{' '}
                  {new Date(log.date).toLocaleString(undefined, {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </p>
              </div>
              <span
                className={`text-xs font-medium text-white px-2 py-1 rounded ${statusColors[log.status]}`}
              >
                {statusLabels[log.status]}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReorderTimeline;
