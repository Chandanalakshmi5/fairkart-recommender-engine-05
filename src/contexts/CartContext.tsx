
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Product } from '../types/product';
import { useAuth } from './AuthContext';

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  cartItemCount: number;
}

const CartContext = createContext<CartContextType | null>(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();
  const { currentUser } = useAuth();

  // Load cart items from localStorage when user changes
  useEffect(() => {
    if (currentUser) {
      const savedCart = localStorage.getItem(`cart_${currentUser.id}`);
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      } else {
        setCartItems([]);
      }
    } else {
      setCartItems([]);
    }
  }, [currentUser]);

  // Save cart items to localStorage
  useEffect(() => {
    if (currentUser && cartItems.length > 0) {
      localStorage.setItem(`cart_${currentUser.id}`, JSON.stringify(cartItems));
    }
  }, [cartItems, currentUser]);

  const addToCart = (product: Product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        // Update quantity if product already in cart
        const updatedItems = prevItems.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
        toast({
          title: "Added to Cart",
          description: `Increased quantity of ${product.name}`,
        });
        return updatedItems;
      } else {
        // Add new product to cart
        toast({
          title: "Added to Cart",
          description: `${product.name} has been added to your cart`,
        });
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prevItems => {
      const itemToRemove = prevItems.find(item => item.id === productId);
      if (itemToRemove) {
        toast({
          title: "Removed from Cart",
          description: `${itemToRemove.name} has been removed from your cart`,
        });
      }
      return prevItems.filter(item => item.id !== productId);
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === productId 
          ? { ...item, quantity } 
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    if (currentUser) {
      localStorage.removeItem(`cart_${currentUser.id}`);
    }
    toast({
      title: "Cart Cleared",
      description: "All items have been removed from your cart",
    });
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    cartItemCount: cartItems.reduce((count, item) => count + item.quantity, 0),
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
