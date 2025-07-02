import React from 'react';
import { Product } from '../mockProducts';

interface Props {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<Props> = ({ product, onAddToCart }) => {
  return (
    <div className="border rounded-lg overflow-hidden flex flex-col">
      <img
        src={product.image}
        alt={product.title}
        className="w-full h-40 object-cover"
      />
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold mb-2">{product.title}</h3>
        <p className="text-gray-700 mb-2">${product.price.toFixed(2)}</p>
        {product.rating && (
          <p className="text-yellow-600 text-sm mb-2">Rating: {product.rating}</p>
        )}
        <button
          onClick={() => onAddToCart(product)}
          className="mt-auto bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
