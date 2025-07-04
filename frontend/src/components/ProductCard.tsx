import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import AddToCartButton from './AddToCartButton';

interface Props {
  product: Product;
}

const ProductCard: React.FC<Props> = ({ product }) => {

  return (
    <Link
      to={`/product/${product.id}`}
      className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden flex flex-col bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
    >
      <img
        src={product.thumbnail}
        alt={product.title}
        className="w-full h-48 object-contain bg-white p-4"
      />
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold mb-2 text-gray-900 dark:text-white line-clamp-2">
          {product.title}
        </h3>
        <p className="text-sm text-gray-500 mb-1">{product.category}</p>
        <p className="text-primary-600 dark:text-primary-400 font-bold text-lg mb-2">
          ${product.price.toFixed(2)}
        </p>
        <AddToCartButton product={product} />
      </div>
    </Link>
  );
};

export default ProductCard;