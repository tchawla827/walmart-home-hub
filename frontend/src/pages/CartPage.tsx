import React from 'react';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import {
  FiTrash2 as RawFiTrash2,
  FiArrowLeft as RawFiArrowLeft,
} from 'react-icons/fi';
// react-icons ships its components with a return type of ReactNode which causes
// a type error when used with React 19. Cast to a compatible component type.
const FiTrash2 = RawFiTrash2 as unknown as React.FC<{
  className?: string;
}>;
const FiArrowLeft = RawFiArrowLeft as unknown as React.FC<{
  className?: string;
}>;

const CartPage: React.FC = () => {
  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    getSubtotal,
    getTotalItems,
    clearCart
  } = useCart();

  const subtotal = getSubtotal();
  const totalItems = getTotalItems();
  const totalSavings = cartItems.reduce((sum, item) => {
    if (item.discountPercentage) {
      const original = item.price / (1 - item.discountPercentage / 100);
      return sum + (original - item.price) * item.quantity;
    }
    return sum;
  }, 0);

  const handleCheckout = () => {
    toast.success(`Order placed! Total: $${subtotal.toFixed(2)}`);
    clearCart();
  };

  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity >= 1) {
      updateQuantity(id, newQuantity);
      toast.info('Quantity updated');
    } else {
      removeFromCart(id);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <div className="bg-gray-100 dark:bg-gray-700 p-8 rounded-lg">
          <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center bg-gray-200 dark:bg-gray-600 rounded-full">
            <svg className="w-10 h-10 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-4">
            Your cart is empty
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Start shopping to add items to your cart
          </p>
          <Link 
            to="/" 
            className="inline-flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-md font-medium transition-all hover:scale-[1.02]"
          >
            <FiArrowLeft className="w-5 h-5" />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="flex items-center gap-4 mb-4 md:mb-0">
          <Link 
            to="/" 
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
          >
            <FiArrowLeft className="w-5 h-5 mr-1" />
            Continue Shopping
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Your Shopping Cart
          </h1>
        </div>
        <span className="bg-accent-400 text-gray-900 px-3 py-1 rounded-full text-sm font-medium">
          {totalItems} {totalItems === 1 ? 'item' : 'items'}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row items-center border border-gray-200 dark:border-gray-700 p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all"
            >
              <Link 
                to={`/products/${item.id}`}
                className="w-24 h-24 flex-shrink-0 mb-4 sm:mb-0 sm:mr-6"
              >
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-full object-contain"
                />
              </Link>
              
              <div className="flex-1 w-full sm:w-auto text-center sm:text-left mb-4 sm:mb-0">
                <Link 
                  to={`/products/${item.id}`}
                  className="font-semibold text-gray-900 dark:text-white hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                >
                  {item.title}
                </Link>
                {(() => {
                  const orig = item.discountPercentage
                    ? item.price / (1 - item.discountPercentage / 100)
                    : undefined;
                  return (
                    <>
                      <p className="text-primary-600 dark:text-primary-400 font-bold">
                        ${item.price.toFixed(2)}
                        {orig && (
                          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 line-through">
                            ${orig.toFixed(2)}
                          </span>
                        )}
                      </p>
                      {orig && (
                        <p className="text-sm text-green-600 dark:text-green-400">
                          You save ${(orig - item.price).toFixed(2)} ({Math.round((1 - item.price / orig) * 100)}%)
                        </p>
                      )}
                    </>
                  );
                })()}
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    className="px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="px-3 py-2 w-12 text-center border-x border-gray-300 dark:border-gray-600">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    className="px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                
                <button
                  onClick={() => {
                    removeFromCart(item.id);
                    toast.error(`${item.title} removed from cart`);
                  }}
                  className="text-red-500 hover:text-red-600 transition-colors p-2"
                  aria-label="Remove item"
                >
                  <FiTrash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-sm sticky top-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Order Summary</h3>
              <button 
                onClick={() => {
                  clearCart();
                  toast.error('Cart cleared');
                }}
                className="text-red-500 hover:text-red-600 text-sm font-medium transition-colors flex items-center gap-1"
              >
                <FiTrash2 className="w-4 h-4" />
                Clear Cart
              </button>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Subtotal ({totalItems} items)</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              
              {totalSavings > 0 && (
                <div className="flex justify-between text-green-600 dark:text-green-400">
                  <span>Savings</span>
                  <span>-${totalSavings.toFixed(2)}</span>
                </div>
              )}
              
              <div className="flex justify-between pt-3 border-t border-gray-200 dark:border-gray-600">
                <span className="font-semibold">Estimated Total</span>
                <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleCheckout}
                className="w-full bg-accent-400 hover:bg-accent-500 text-gray-900 px-6 py-3 rounded-md font-medium transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Proceed to Checkout
              </button>
              
              <Link 
                to="/" 
                className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-md font-medium text-center transition-all flex items-center justify-center gap-2"
              >
                <FiArrowLeft className="w-5 h-5" />
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;