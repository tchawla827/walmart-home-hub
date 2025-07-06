import React, { useState } from 'react';
import { GiftBundle, GiftItem, Product } from '../types';

interface Props {
  bundle: GiftBundle;
  availableItems: Product[];
  onUpdate: (updatedBundle: GiftBundle) => void;
}

const BundleCustomizer: React.FC<Props> = ({ bundle, availableItems, onUpdate }) => {
  const [currentBundle, setCurrentBundle] = useState<GiftBundle>(() => ({
    ...bundle,
    items: [...bundle.items],
  }));

  const calculateTotal = (items: GiftItem[]) =>
    items.reduce((sum, item) => sum + item.price, 0);

  const handleRemove = (index: number) => {
    const newItems = currentBundle.items.filter((_, i) => i !== index);
    const updated = {
      ...currentBundle,
      items: newItems,
      totalPrice: calculateTotal(newItems),
    };
    setCurrentBundle(updated);
    console.log(updated);
    onUpdate(updated);
  };

  const handleSwap = (index: number, productId: number) => {
    const product = availableItems.find((p) => p.id === productId);
    if (!product) return;
    const newItem: GiftItem = {
      id: product.id,
      name: product.title ?? product.name ?? '',
      price: product.price,
      imageUrl: product.thumbnail,
      description: product.description,
    };
    const newItems = currentBundle.items.map((item, i) =>
      i === index ? newItem : item
    );
    const updated = {
      ...currentBundle,
      items: newItems,
      totalPrice: calculateTotal(newItems),
    };
    setCurrentBundle(updated);
    console.log(updated);
    onUpdate(updated);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-primary-600 dark:text-primary-400">
        {currentBundle.title}
      </h2>

      {currentBundle.items.length === 0 ? (
        <p className="text-center text-gray-500">Bundle is empty</p>
      ) : (
        <ul className="space-y-4">
          {currentBundle.items.map((item, idx) => (
            <li
              key={idx}
              className="flex items-center gap-4 border border-gray-200 dark:border-gray-700 rounded-lg p-3"
            >
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white">
                  {item.name}
                </p>
                <p className="text-sm text-primary-600 dark:text-primary-400">
                  ${item.price.toFixed(2)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleRemove(idx)}
                  className="text-red-500 hover:text-red-600 text-sm"
                >
                  Remove
                </button>
                <select
                  onChange={(e) => handleSwap(idx, Number(e.target.value))}
                  defaultValue=""
                  className="border border-gray-300 dark:border-gray-600 rounded-md p-1 text-sm bg-white dark:bg-gray-800"
                >
                  <option value="" disabled>
                    Swap
                  </option>
                  {availableItems
                    .filter((p) => p.id !== item.id)
                    .map((prod) => (
                      <option key={prod.id} value={prod.id}>
                        {prod.title ?? prod.name}
                      </option>
                    ))}
                </select>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
        <p className="font-medium text-gray-900 dark:text-white">
          {currentBundle.items.length} items
        </p>
        <p className="font-bold text-primary-600 dark:text-primary-400">
          Total: ${currentBundle.totalPrice.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default BundleCustomizer;
