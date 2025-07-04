import React from 'react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface Props {
  product: Product;
}

const AddToCartButton: React.FC<Props> = ({ product }) => {
  const { cartItems, addToCart, updateQuantity, removeFromCart } = useCart();
  const existing = cartItems.find((item) => item.id === product.id);
  const qty = existing ? existing.quantity : 0;

  const increment = (e: React.MouseEvent) => {
    e.preventDefault();
    if (existing) {
      updateQuantity(product.id, existing.quantity + 1);
    } else {
      addToCart(product);
    }
  };

  const decrement = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!existing) return;
    if (existing.quantity === 1) {
      removeFromCart(product.id);
    } else {
      updateQuantity(product.id, existing.quantity - 1);
    }
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
  };

  if (!existing) {
    return (
      <button
        onClick={handleAdd}
        className="mt-auto bg-accent-400 hover:bg-accent-500 text-gray-900 px-4 py-2 rounded-md font-medium transition-all hover:scale-[1.02] active:scale-95"
      >
        Add to Cart
      </button>
    );
  }

  return (
    <div className="mt-auto flex items-center space-x-2">
      <button
        onClick={decrement}
        className="bg-gray-200 hover:bg-gray-300 text-gray-900 px-3 py-2 rounded-md"
      >
        -
      </button>
      <span className="min-w-[2ch] text-center">{qty}</span>
      <button
        onClick={increment}
        className="bg-gray-200 hover:bg-gray-300 text-gray-900 px-3 py-2 rounded-md"
      >
        +
      </button>
    </div>
  );
};

export default AddToCartButton;
