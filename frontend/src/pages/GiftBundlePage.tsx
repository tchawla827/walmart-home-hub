import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import type { GiftBundle as GeneratedGiftBundle } from '../mockGiftGenius';
import { toast } from 'react-toastify';
import { mockProducts } from '../mockProducts';
import BundleCustomizer from '../components/BundleCustomizer';
import { GiftBundle, Product } from '../types';
import { useCart, ProductWithQty } from '../context/CartContext';

const GiftBundlePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const bundle = (location.state as { bundle?: GeneratedGiftBundle } | undefined)?.bundle;

  const convertBundle = (b: GeneratedGiftBundle): GiftBundle => ({
    title: b.title,
    items: b.items.map((item) => ({
      id: item.id,
      name: item.title,
      price: item.price,
      imageUrl: (item as any).image ?? (item as any).thumbnail,
      description: item.description,
    })),
    totalPrice: b.totalPrice,
  });

  if (!bundle) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <div className="bg-gray-100 dark:bg-gray-700 p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-4">
            No Bundle Selected
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Please select a gift bundle to view details
          </p>
          <button
            onClick={() => navigate('/gift')}
            className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-md font-medium transition-all hover:scale-[1.02]"
          >
            Browse Gift Bundles
          </button>
        </div>
      </div>
    );
  }

  const [currentBundle, setCurrentBundle] = useState<GiftBundle>(convertBundle(bundle));

  const availableItems: Product[] = mockProducts.map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    price: p.price,
    category: p.category,
    thumbnail: (p as any).thumbnail ?? p.image,
    images: [(p as any).image],
  }));

  const handleUpdate = (updated: GiftBundle) => {
    setCurrentBundle(updated);
  };

  const handleAddAllToCart = () => {
    currentBundle.items.forEach((item) => {
      const prod: ProductWithQty = {
        id: item.id!,
        title: item.name,
        price: item.price,
        description: item.description,
        category: 'bundle',
        thumbnail: item.imageUrl,
        images: [item.imageUrl],
        quantity: 1,
      } as any;
      addToCart(prod);
    });
    toast.success(`Added "${currentBundle.title}" bundle to cart!`);
  };
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-primary-500 hover:text-primary-600 mb-6 transition-colors"
      >
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Bundles
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-8 p-6">
        <BundleCustomizer
          bundle={currentBundle}
          availableItems={availableItems}
          onUpdate={handleUpdate}
        />
        <div className="mt-6 text-center">
          <button
            onClick={handleAddAllToCart}
            className="bg-accent-400 hover:bg-accent-500 text-gray-900 px-6 py-3 rounded-md font-medium transition-all hover:scale-[1.02] w-full sm:w-auto text-center"
          >
            Add Bundle to Cart
          </button>
        </div>
      </div>
    </div>
  );

};

export default GiftBundlePage;