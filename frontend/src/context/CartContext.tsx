import React, { createContext, useContext, useState } from 'react';
import { Product } from '../mockProducts';

export type ProductWithQty = Product & { quantity: number };

interface CartContextProps {
  cartItems: ProductWithQty[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, qty: number) => void;
  getSubtotal: () => number;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const useCart = (): CartContextProps => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cartItems, setCartItems] = useState<ProductWithQty[]>([]);

  const addToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      if (existing) {
        const updatedQty = existing.quantity + 1;
        console.log(`Updated ${product.title} quantity to ${updatedQty}`);
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: updatedQty } : item
        );
      }
      console.log(`Added ${product.title} to cart`);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCartItems((prev) => {
      const product = prev.find((p) => p.id === productId);
      if (product) {
        console.log(`Removed ${product.title} from cart`);
      }
      return prev.filter((item) => item.id !== productId);
    });
  };

  const updateQuantity = (productId: number, qty: number) => {
    setCartItems((prev) => {
      const updated = prev
        .map((item) =>
          item.id === productId ? { ...item, quantity: qty } : item
        )
        .filter((item) => item.quantity > 0);
      console.log(`Updated product ${productId} quantity to ${qty}`);
      return updated;
    });
  };

  const getSubtotal = () => {
    return cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, updateQuantity, getSubtotal }}
    >
      {children}
    </CartContext.Provider>
  );
};
