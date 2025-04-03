
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Product } from '../types/product';
import { useAuth } from './AuthContext';

interface WishlistContextType {
  wishlistItems: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => void;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  const { toast } = useToast();
  const { currentUser } = useAuth();

  // Load wishlist items from localStorage when user changes
  useEffect(() => {
    if (currentUser) {
      const savedWishlist = localStorage.getItem(`wishlist_${currentUser.id}`);
      if (savedWishlist) {
        setWishlistItems(JSON.parse(savedWishlist));
      } else {
        setWishlistItems([]);
      }
    } else {
      setWishlistItems([]);
    }
  }, [currentUser]);

  // Save wishlist items to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`wishlist_${currentUser.id}`, JSON.stringify(wishlistItems));
    }
  }, [wishlistItems, currentUser]);

  const isInWishlist = (productId: string) => {
    return wishlistItems.some(item => item.id === productId);
  };

  const addToWishlist = (product: Product) => {
    if (!isInWishlist(product.id)) {
      setWishlistItems(prevItems => [...prevItems, product]);
      toast({
        title: "Added to Wishlist",
        description: `${product.name} has been added to your wishlist`,
      });
    }
  };

  const removeFromWishlist = (productId: string) => {
    setWishlistItems(prevItems => {
      const itemToRemove = prevItems.find(item => item.id === productId);
      if (itemToRemove) {
        toast({
          title: "Removed from Wishlist",
          description: `${itemToRemove.name} has been removed from your wishlist`,
        });
      }
      return prevItems.filter(item => item.id !== productId);
    });
  };

  const toggleWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const clearWishlist = () => {
    setWishlistItems([]);
    if (currentUser) {
      localStorage.removeItem(`wishlist_${currentUser.id}`);
    }
    toast({
      title: "Wishlist Cleared",
      description: "All items have been removed from your wishlist",
    });
  };

  const value = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist,
    clearWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
