import React from 'react';
import { GiftBundle } from '../types';

interface Props {
  bundles: GiftBundle[];
}

const GiftBundleList: React.FC<Props> = ({ bundles }) => {
  return (
    <div className="space-y-6">
      {bundles.map((bundle, idx) => (
        <div
          key={idx}
          className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
        >
          <h3 className="text-lg font-semibold text-primary-600 dark:text-primary-400 mb-3">
            {bundle.title}
          </h3>
          <ul className="space-y-2 mb-3">
            {bundle.items.map((item, itemIdx) => (
              <li key={itemIdx} className="flex items-center gap-3">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-12 h-12 object-cover rounded"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {item.name}
                  </p>
                </div>
                <span className="text-sm text-primary-600 dark:text-primary-400 font-medium">
                  ${item.price.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
          <p className="font-bold text-primary-600 dark:text-primary-400">
            Total: ${bundle.totalPrice.toFixed(2)}
          </p>
        </div>
      ))}
    </div>
  );
};

export default GiftBundleList;
