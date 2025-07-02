import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../mockProducts';

interface Props {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<Props> = ({ product, onAddToCart }) => {
  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onAddToCart(product);
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden flex flex-col bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
    >
      <img
        src={product.image}
        alt={product.title}
        className="w-full h-48 object-contain bg-white p-4"
      />
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold mb-2 text-gray-900 dark:text-white line-clamp-2">
          {product.title}
        </h3>
        <p className="text-primary-600 dark:text-primary-400 font-bold text-lg mb-2">
          ${product.price.toFixed(2)}
        </p>
        {product.rating && (
          <div className="flex items-center mb-3">
            <div className="flex text-accent-400">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'stroke-current'}`}
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-gray-600 dark:text-gray-400 text-sm ml-1">
              {product.rating}
            </span>
          </div>
        )}
        <button
          onClick={handleAddToCart}
          className="mt-auto bg-accent-400 hover:bg-accent-500 text-gray-900 px-4 py-2 rounded-md font-medium transition-all hover:scale-[1.02] active:scale-95"
        >
          Add to Cart
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;