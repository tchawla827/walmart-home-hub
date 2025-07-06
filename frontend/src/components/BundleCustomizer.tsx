import React, { useEffect, useState, useMemo } from 'react';
import { GiftBundle, GiftItem, Product } from '../types';

interface Props {
  bundle: GiftBundle;
  availableItems: Product[];
  onUpdate: (updatedBundle: GiftBundle) => void;
}

const BundleCustomizer: React.FC<Props> = ({ bundle, availableItems: initialAvailable, onUpdate }) => {
  const [bundleItems, setBundleItems] = useState<GiftItem[]>([]);
  const [availableItems, setAvailableItems] = useState<Product[]>([]);

  // Initialize state whenever bundle or available products change
  useEffect(() => {
    setBundleItems([...bundle.items]);
    const bundleIds = new Set(bundle.items.map((i) => i.id));
    setAvailableItems(initialAvailable.filter((p) => !bundleIds.has(p.id)));
  }, [bundle, initialAvailable]);

  const calculateTotal = (items: GiftItem[]) =>
    items.reduce((sum, item) => sum + item.price, 0);

  const updateBundle = (items: GiftItem[]) => {
    const updated = {
      ...bundle,
      items,
      totalPrice: calculateTotal(items),
    };
    setBundleItems(items);
    onUpdate(updated);
  };

  const handleRemove = (index: number) => {
    const item = bundleItems[index];
    const remaining = bundleItems.filter((_, i) => i !== index);
    updateBundle(remaining);
    const product = initialAvailable.find((p) => p.id === item.id);
    if (product) {
      setAvailableItems((prev) => [...prev, product]);
    }
  };

  const handleAdd = (productId: number) => {
    const product = availableItems.find((p) => p.id === productId);
    if (!product) return;
    const newItem: GiftItem = {
      id: product.id,
      name: product.title ?? product.name ?? '',
      price: product.price,
      imageUrl: product.thumbnail,
      description: product.description,
    };
    updateBundle([...bundleItems, newItem]);
    setAvailableItems((prev) => prev.filter((p) => p.id !== productId));
  };

  const groupedAvailable = useMemo(() => {
    const groups: Record<string, Product[]> = {};
    availableItems.forEach((p) => {
      if (!groups[p.category]) groups[p.category] = [];
      groups[p.category].push(p);
    });
    return groups;
  }, [availableItems]);

  const total = calculateTotal(bundleItems);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-primary-600 dark:text-primary-400">
        {bundle.title}
      </h2>

      {bundleItems.length === 0 ? (
        <p className="text-center text-gray-500">Bundle is empty</p>
      ) : (
        <ul className="space-y-4">
          {bundleItems.map((item, idx) => (
            <li
              key={idx}
              className="flex items-center gap-4 border border-gray-200 dark:border-gray-700 rounded-lg p-3"
            >
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-white">
                  {item.name}
                </p>
                <p className="text-sm text-primary-600 dark:text-primary-400">
                  ${item.price.toFixed(2)}
                </p>
              </div>
              <button
                onClick={() => handleRemove(idx)}
                className="text-red-500 hover:text-red-600 text-sm"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
        <p className="font-medium text-gray-900 dark:text-white">
          {bundleItems.length} items
        </p>
        <p className="font-bold text-primary-600 dark:text-primary-400">
          Total: ${total.toFixed(2)}
        </p>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
          Add Items
        </h3>
        {Object.entries(groupedAvailable).length === 0 ? (
          <p className="text-sm text-gray-500">No more items available</p>
        ) : (
          <div className="space-y-4 max-h-60 overflow-y-auto">
            {Object.entries(groupedAvailable).map(([cat, items]) => (
              <div key={cat} className="space-y-2">
                <h4 className="capitalize font-medium text-gray-700 dark:text-gray-300">
                  {cat}
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {items.map((prod) => (
                    <div
                      key={prod.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-2 flex flex-col bg-white dark:bg-gray-800"
                    >
                      <div className="flex-1">
                        <p className="text-xs font-medium line-clamp-2 text-gray-900 dark:text-white">
                          {prod.title}
                        </p>
                        <p className="text-[11px] text-gray-500 mb-1 capitalize">
                          {prod.category}
                        </p>
                        <p className="text-xs font-bold text-primary-600 dark:text-primary-400">
                          ${prod.price.toFixed(2)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleAdd(prod.id)}
                        className="mt-2 text-sm bg-primary-500 hover:bg-primary-600 text-white rounded-md py-1"
                      >
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BundleCustomizer;
