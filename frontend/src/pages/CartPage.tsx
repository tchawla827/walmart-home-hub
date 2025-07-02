import React from 'react';
import { useCart } from '../context/CartContext';

const CartPage: React.FC = () => {
  const { cartItems, updateQuantity, removeFromCart, getSubtotal } = useCart();

  const subtotal = getSubtotal();

  const handleCheckout = () => {
    console.log('Checkout initiated');
    console.log('Subtotal:', subtotal.toFixed(2));
    console.log('Items:', cartItems);
  };

  if (cartItems.length === 0) {
    return <div className="p-4">Your cart is empty.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      <div className="space-y-4">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center border p-4 rounded"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-20 h-20 object-cover mr-4"
            />
            <div className="flex-1">
              <h2 className="font-semibold">{item.title}</h2>
              <p>${item.price.toFixed(2)}</p>
            </div>
            <input
              type="number"
              min={1}
              value={item.quantity}
              onChange={(e) =>
                updateQuantity(item.id, Number(e.target.value))
              }
              className="border w-16 p-1 mr-2 rounded"
            />
            <button
              onClick={() => removeFromCart(item.id)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <div className="mt-6 text-right">
        <p className="text-lg font-semibold mb-2">
          Subtotal: ${subtotal.toFixed(2)}
        </p>
        <button
          onClick={handleCheckout}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default CartPage;
