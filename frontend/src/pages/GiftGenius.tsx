import React, { useState } from "react";
import { Link } from "react-router-dom";
import { GiftBundle, GiftSuggestions, mockGiftGenius } from "../mockGiftGenius";
import { Product } from "../mockProducts";
import { toast } from "react-toastify";
import { useCart, ProductWithQty } from "../context/CartContext";

interface ChatEntry {
  prompt: string;
  bundles: GiftBundle[];
  items: Product[];
}

const GiftGenius: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [history, setHistory] = useState<ChatEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const { addToCart } = useCart();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    setLoading(true);
    try {
      const result: GiftSuggestions = await mockGiftGenius(prompt);
      setHistory((prev) => [
        ...prev,
        {
          prompt,
          bundles: result.bundles,
          items: result.items,
        },
      ]);
      setPrompt("");
      toast.success("Found some great gift ideas!");
    } catch (error) {
      toast.error("Could not fetch gift suggestions");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAll = (bundle: GiftBundle) => {
    bundle.items.forEach((item) => {
      const prod: ProductWithQty = {
        id: item.id,
        title: item.title,
        price: item.price,
        description: item.description,
        category: item.category,
        thumbnail: item.image,
        images: [item.image],
        quantity: 1,
      } as any;
      addToCart(prod);
    });
    toast.success(`Added "${bundle.title}" bundle to cart!`);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 flex flex-col min-h-[calc(100vh-4rem)]">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
          Gift Genius
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Tell us about the occasion and we'll find the perfect gift
        </p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 mb-6">
        {history.length === 0 && !loading && (
          <div className="bg-gray-100 dark:bg-gray-700 p-8 rounded-lg text-center">
            <div className="text-5xl mb-4">🎁</div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              No searches yet
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Try searching for something like "gifts for dad under $50" or
              "birthday present for sister"
            </p>
          </div>
        )}

        {history.map((entry, idx) => (
          <div key={idx} className="space-y-4">
            <div className="bg-primary-100 dark:bg-gray-700 p-4 rounded-lg max-w-[80%] self-start">
              <p className="text-primary-800 dark:text-white">{entry.prompt}</p>
            </div>

            <div className="space-y-4">
              {entry.items.map((item) => (
                <Link
                  key={item.id}
                  to={`/product/${item.id}`}
                  className="flex items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-700"
                >
                  <div className="w-16 h-16 bg-white p-1 rounded border border-gray-200">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white hover:text-primary-500 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-1">
                      {item.description}
                    </p>
                    <p className="text-primary-600 dark:text-primary-400 font-bold mt-1">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>
                </Link>
              ))}

              {entry.bundles.map((bundle) => (
                <div
                  key={bundle.title}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all overflow-hidden border border-gray-100 dark:border-gray-700"
                >
                  <div className="p-4 bg-primary-50 dark:bg-gray-700">
                    <h3 className="font-semibold text-lg text-primary-600 dark:text-primary-400">
                      {bundle.title}
                    </h3>
                  </div>

                  <div className="p-4">
                    <ul className="space-y-3 mb-4">
                      {bundle.items.map((item) => (
                        <li key={item.id} className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white p-1 rounded border border-gray-200">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <Link
                            to={`/product/${item.id}`}
                            className="flex-1 text-sm hover:text-primary-500 transition-colors"
                          >
                            {item.title}
                          </Link>
                          <span className="text-primary-600 dark:text-primary-400 font-bold text-sm">
                            ${item.price.toFixed(2)}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                      <div>
                        <p className="font-bold text-lg text-primary-600 dark:text-primary-400">
                          Bundle Total: ${bundle.totalPrice.toFixed(2)}
                        </p>
                        <p className="text-sm text-green-600 dark:text-green-400">
                          {`Save ${bundle.discountPercent}% (`}
                          {`$${(
                            bundle.items.reduce(
                              (sum, item) => sum + item.price,
                              0,
                            ) - bundle.totalPrice
                          ).toFixed(2)}`}
                          {")"}
                        </p>
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto">
                        <Link
                          to="/bundle"
                          state={{ bundle }}
                          className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-4 py-2 rounded-md text-sm font-medium transition-all text-center flex-1"
                        >
                          View Details
                        </Link>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleAddAll(bundle);
                          }}
                          className="bg-accent-400 hover:bg-accent-500 text-gray-900 px-4 py-2 rounded-md text-sm font-medium transition-all hover:scale-[1.02] flex-1"
                        >
                          Add All
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-center items-center p-8">
            <div className="animate-pulse flex flex-col items-center">
              <div className="w-16 h-16 bg-primary-100 dark:bg-gray-700 rounded-full mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300">
                Finding perfect gifts...
              </p>
            </div>
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="sticky bottom-0 bg-white dark:bg-gray-900 pt-4 pb-2"
      >
        <div className="relative">
          <textarea
            className="w-full border border-gray-300 dark:border-gray-600 p-3 pr-16 rounded-lg resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Gift for my sister's graduation under $50"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="absolute right-2 bottom-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-1 rounded-md font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Searching...
              </span>
            ) : (
              "Search"
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
          Gift Genius will help you find the perfect present for any occasion
        </p>
      </form>
    </div>
  );
};

export default GiftGenius;
