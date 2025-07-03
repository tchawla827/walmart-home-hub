import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GiftBundle } from '../mockGiftGenius';
import { toast } from 'react-toastify';

const GiftBundlePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bundle = (location.state as { bundle?: GiftBundle } | undefined)?.bundle;

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

  const handleAddAllToCart = () => {
    // You'll need to implement this function or get it from context
    toast.success(`Added "${bundle.title}" bundle to cart!`);
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

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6 bg-primary-50 dark:bg-gray-700">
          <h1 className="text-2xl md:text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
            {bundle.title}
          </h1>
        </div>

        <div className="p-6">
          <div className="space-y-4 mb-6">
            {bundle.items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-all"
              >
                <Link
                  to={`/product/${item.id}`}
                  className="block sm:w-1/3 h-48 bg-white p-4"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-contain"
                  />
                </Link>
                <div className="flex-1 p-4">
                  <Link to={`/product/${item.id}`} className="block">
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1 hover:text-primary-500 transition-colors">
                      {item.title}
                    </h3>
                  </Link>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">{item.description}</p>
                  <p className="text-primary-600 dark:text-primary-400 font-bold">
                    ${item.price.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <div className="mb-4 sm:mb-0">
              <p className="text-gray-500 dark:text-gray-400">Bundle includes {bundle.items.length} items</p>
              <p className="text-xl font-bold text-primary-600 dark:text-primary-400">
                Total: ${bundle.totalPrice.toFixed(2)}
                <span className="text-sm text-green-600 dark:text-green-400 ml-2">
                  (Save ${(bundle.items.reduce((sum, item) => sum + item.price, 0) - bundle.totalPrice).toFixed(2)})
                </span>
              </p>
            </div>
            <button
              onClick={handleAddAllToCart}
              className="bg-accent-400 hover:bg-accent-500 text-gray-900 px-6 py-3 rounded-md font-medium transition-all hover:scale-[1.02] w-full sm:w-auto text-center"
            >
              Add All to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GiftBundlePage;