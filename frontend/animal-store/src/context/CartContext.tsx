import React, { createContext, useContext, useState, useEffect} from 'react';
import { message } from 'antd';
import type { Pet } from '../types';
import type { ReactNode } from 'react';

interface CartContextType {
  cart: Pet[];
  addToCart: (pet: Pet) => void;
  removeFromCart: (petId: number) => void;
  clearCart: () => void;
  isInCart: (petId: number) => boolean;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Pet[]>(() => {
    const savedCart = localStorage.getItem('petCart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('petCart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (pet: Pet) => {
    setCart((prev) => {
      if (prev.find((p) => p.id === pet.id)) {
        message.warning(`${pet.name} is already in your cart`);
        return prev;
      }
      message.success(`${pet.name} added to cart`);
      return [...prev, pet];
    });
  };

  const removeFromCart = (petId: number) => {
    setCart((prev) => prev.filter((item) => item.id !== String(petId)));
    message.info('Item removed from cart');
  };

  const clearCart = () => {
    setCart([]);
  };

  const isInCart = (petId: number) => {
    return cart.some((item) => item.id === String(petId));
  };

  const cartTotal = cart.reduce((total, item) => total + Number(item.price), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, isInCart, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};