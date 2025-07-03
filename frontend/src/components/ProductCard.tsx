import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';

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
        src={product.image_url}
        alt={product.name}
        className="w-full h-48 object-contain bg-white p-4"
      />
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold mb-2 text-gray-900 dark:text-white line-clamp-2">
          {product.name}
        </h3>
        <p className="text-primary-600 dark:text-primary-400 font-bold text-lg mb-2">
          ${product.price.toFixed(2)}
        </p>
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