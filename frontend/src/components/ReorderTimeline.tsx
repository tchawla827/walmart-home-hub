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
  suggested: 'bg-accent-400 text-gray-900',
  confirmed: 'bg-primary-500 text-white',
  skipped: 'bg-red-500 text-white',
  delayed: 'bg-orange-400 text-gray-900',
};

const statusIcons: Record<ReorderLog['status'], string> = {
  suggested: '💡',
  confirmed: '✓',
  skipped: '✕',
  delayed: '⏱',
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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h2 className="text-xl font-bold text-primary-800 dark:text-primary-200">
          Reorder History
        </h2>
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                filter === f
                  ? 'bg-primary-500 text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {f === 'all' ? 'All' : statusLabels[f]}
            </button>
          ))}
        </div>
      </div>

      {logs.length === 0 ? (
        <div className="text-center py-8">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            No reorder logs found for this filter.
          </p>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
          
          <ul className="space-y-6">
            {logs.map((log) => (
              <li key={log.id} className="relative pl-8">
                {/* Timeline dot */}
                <div className={`absolute left-4 top-2 w-3 h-3 rounded-full ${statusColors[log.status]} border-2 border-white dark:border-gray-800 z-10`}></div>
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{statusIcons[log.status]}</span>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {log.itemName}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(log.date).toLocaleString(undefined, {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })} • Qty: {log.quantity}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[log.status]}`}
                    >
                      {statusLabels[log.status]}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ReorderTimeline;