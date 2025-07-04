import React, { useState } from 'react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface Props {
  product: Product;
  quantity?: number;
  showQuantity?: boolean;
  variant?: 'default' | 'compact' | 'icon';
}

const AddToCartButton: React.FC<Props> = ({ 
  product, 
  quantity: initialQuantity = 1,
  showQuantity = true,
  variant = 'default'
}) => {
  const { cartItems, addToCart, updateQuantity, removeFromCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  
  const existingItem = cartItems.find((item) => item.id === product.id);
  const currentQuantity = existingItem ? existingItem.quantity : 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (existingItem) {
        await updateQuantity(product.id, existingItem.quantity + initialQuantity);
      } else {
        await addToCart({ ...product, quantity: initialQuantity });
      }
    } catch (error) {
      console.error('Failed to update cart', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleIncrement = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateQuantity(product.id, currentQuantity + 1);
    } catch (error) {
      console.error('Failed to increment quantity', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecrement = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (currentQuantity === 1) {
        await removeFromCart(product.id);
      } else {
        await updateQuantity(product.id, currentQuantity - 1);
      }
    } catch (error) {
      console.error('Failed to decrement quantity', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Compact variant (shows only + button when not in cart)
  if (variant === 'compact' && !existingItem) {
    return (
      <button
        onClick={handleAddToCart}
        disabled={isLoading}
        aria-label={`Add ${product.title} to cart`}
        className={`flex items-center justify-center px-3 py-2 rounded-md font-medium transition-all ${
          isLoading 
            ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed' 
            : 'bg-accent-400 hover:bg-accent-500 text-gray-900 hover:scale-[1.02] active:scale-95'
        }`}
      >
        {isLoading ? (
          <span className="loading loading-spinner loading-xs"></span>
        ) : (
          '+'
        )}
      </button>
    );
  }

  // Icon variant (cart icon only)
  if (variant === 'icon') {
    return (
      <button
        onClick={handleAddToCart}
        disabled={isLoading}
        aria-label={existingItem ? 'Update cart' : `Add ${product.title} to cart`}
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
      >
        {isLoading ? (
          <span className="loading loading-spinner loading-xs"></span>
        ) : (
          <>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
              />
            </svg>
            {currentQuantity > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {currentQuantity}
              </span>
            )}
          </>
        )}
      </button>
    );
  }

  // Default behavior - shows full button when not in cart, quantity controls when in cart
  if (!existingItem) {
    return (
      <button
        onClick={handleAddToCart}
        disabled={isLoading}
        className={`mt-auto w-full flex items-center justify-center gap-2 ${
          isLoading 
            ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed' 
            : 'bg-accent-400 hover:bg-accent-500 text-gray-900'
        } px-4 py-3 rounded-md font-medium transition-all hover:scale-[1.02] active:scale-95`}
      >
        {isLoading ? (
          <>
            <span className="loading loading-spinner loading-xs"></span>
            Adding...
          </>
        ) : (
          <>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
              />
            </svg>
            Add to Cart
          </>
        )}
      </button>
    );
  }

  return (
    <div className="mt-auto flex items-center justify-between w-full bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden">
      <button
        onClick={handleDecrement}
        disabled={isLoading}
        aria-label="Decrease quantity"
        className={`px-4 py-3 ${
          isLoading 
            ? 'text-gray-400 cursor-not-allowed' 
            : 'text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
        } transition-colors`}
      >
        {isLoading ? (
          <span className="loading loading-spinner loading-xs"></span>
        ) : (
          '-'
        )}
      </button>
      
      {showQuantity && (
        <span className="text-center font-medium min-w-[2ch]">
          {currentQuantity}
        </span>
      )}

      <button
        onClick={handleIncrement}
        disabled={isLoading}
        aria-label="Increase quantity"
        className={`px-4 py-3 ${
          isLoading 
            ? 'text-gray-400 cursor-not-allowed' 
            : 'text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
        } transition-colors`}
      >
        {isLoading ? (
          <span className="loading loading-spinner loading-xs"></span>
        ) : (
          '+'
        )}
      </button>
    </div>
  );
};

export default AddToCartButton;