import React from 'react';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
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

  const handleCheckout = () => {
    toast.success(`Order placed! Total: $${subtotal.toFixed(2)}`);
    clearCart();
  };

  const handleQuantityChange = (id: string, value: string) => {
    const qty = parseInt(value);
    if (qty >= 1) {
      updateQuantity(id, qty);
      toast.info('Quantity updated');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <div className="bg-gray-100 dark:bg-gray-700 p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-4">
            Your cart is empty
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Start shopping to add items to your cart
          </p>
          <Link 
            to="/" 
            className="inline-block bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-md font-medium transition-all hover:scale-[1.02]"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-primary-600 dark:text-primary-400">
          Your Shopping Cart
        </h1>
        <span className="bg-accent-400 text-gray-900 px-3 py-1 rounded-full text-sm font-medium">
          {totalItems} {totalItems === 1 ? 'item' : 'items'}
        </span>
      </div>

      <div className="space-y-4 mb-8">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex flex-col md:flex-row items-center border border-gray-200 dark:border-gray-700 p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all"
          >
            <img
              src={item.image_url}
              alt={item.name}
              className="w-24 h-24 object-contain mb-4 md:mb-0 md:mr-6"
            />
            <div className="flex-1 w-full md:w-auto text-center md:text-left mb-4 md:mb-0">
              <h2 className="font-semibold text-gray-900 dark:text-white">{item.name}</h2>
              <p className="text-primary-600 dark:text-primary-400 font-bold">
                ${item.price.toFixed(2)}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                className="border border-gray-300 dark:border-gray-600 w-16 p-2 rounded-md text-center bg-white dark:bg-gray-700"
              />
              <button
                onClick={() => {
                  removeFromCart(item.id);
                  toast.error('Item removed from cart');
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md transition-all"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Order Summary</h3>
          <button 
            onClick={() => {
              clearCart();
              toast.error('Cart cleared');
            }}
            className="text-red-500 hover:text-red-600 text-sm font-medium transition-colors"
          >
            Clear Cart
          </button>
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <span className="text-gray-600 dark:text-gray-300">Subtotal ({totalItems} items)</span>
          <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
            ${subtotal.toFixed(2)}
          </span>
        </div>

        <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
          <Link 
            to="/" 
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-md font-medium text-center transition-all"
          >
            Continue Shopping
          </Link>
          <button
            onClick={handleCheckout}
            className="bg-accent-400 hover:bg-accent-500 text-gray-900 px-6 py-3 rounded-md font-medium transition-all hover:scale-[1.02]"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;