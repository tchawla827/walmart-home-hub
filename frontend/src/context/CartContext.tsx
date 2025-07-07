import React, { createContext, useContext, useState } from 'react';
import { Product, GiftItem } from '../types';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export type ProductWithQty = Product & {
  quantity: number;
  bundleItems?: GiftItem[];
};

interface CartContextProps {
  cartItems: ProductWithQty[];
  addToCart: (product: ProductWithQty) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, qty: number) => void;
  getSubtotal: () => number;
  getTotalItems: () => number;
  clearCart: () => void;
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

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    toast[type](message, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const addToCart = (product: ProductWithQty) => {
    let toastMessage = '';
    setCartItems((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      if (existing) {
        const updatedQty = existing.quantity + product.quantity;
        toastMessage = `Added ${product.quantity} more ${product.title} to cart (${updatedQty} total)`;
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: updatedQty } : item
        );
      }
      toastMessage = `Added ${product.quantity} ${product.title} to cart`;
      return [...prev, { ...product }];
    });
    showToast(toastMessage);
  };

  const removeFromCart = (productId: number) => {
    let removedProduct: ProductWithQty | undefined;
    setCartItems((prev) => {
      removedProduct = prev.find((p) => p.id === productId);
      return prev.filter((item) => item.id !== productId);
    });
    if (removedProduct) {
      showToast(`Removed ${removedProduct.title} from cart`, 'error');
    }
  };

  const updateQuantity = (productId: number, qty: number) => {
    if (qty < 1) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prev) => {
      return prev.map((item) =>
        item.id === productId ? { ...item, quantity: qty } : item
      );
    });
  };

  const getSubtotal = () => {
    return parseFloat(cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    ).toFixed(2));
  };

  const getTotalItems = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  const clearCart = () => {
    setCartItems([]);
    showToast('Cart cleared', 'error');
  };

  return (
    <CartContext.Provider
      value={{ 
        cartItems, 
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        getSubtotal,
        getTotalItems,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};