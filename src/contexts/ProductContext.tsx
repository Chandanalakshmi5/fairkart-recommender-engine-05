
import { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '../types/product';
import { productData } from '../data/products';
import { useAuth } from './AuthContext';

interface ProductContextType {
  products: Product[];
  searchProducts: (query: string) => Product[];
  getProductById: (id: string) => Product | undefined;
}

interface Group {
  id: string;
  items: Product[];
}

const ProductContext = createContext<ProductContextType | null>(null);

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products] = useState<Product[]>(productData);
  const { currentUser } = useAuth();

  const searchProducts = (query: string): Product[] => {
    if (!query.trim()) {
      return products;
    }
    
    const normalizedQuery = query.toLowerCase().trim();
    
    // Step 1: Filter products that match the search query
    const matchedProducts = products.filter(product => {
      const nameMatch = product.name.toLowerCase().includes(normalizedQuery);
      const batteryMatch = product.batteryCapacity.toLowerCase().includes(normalizedQuery);
      
      // Improved RAM matching - check for specific RAM sizes
      const ramMatch = product.ram.some(ram => {
        const ramValue = ram.toLowerCase();
        
        // Check for exact RAM size match
        if (ramValue === normalizedQuery) return true;
        
        // Check for RAM size with "gb" suffix
        if (normalizedQuery.includes("gb")) {
          const ramSize = normalizedQuery.replace("gb", "").trim();
          return ramValue.includes(ramSize + "gb") || ramValue.includes(ramSize + " gb");
        }
        
        return ramValue.includes(normalizedQuery);
      });
      
      // Improved storage matching
      const storageMatch = product.storage.some(storage => {
        const storageValue = storage.toLowerCase();
        
        // Check for exact storage size match
        if (storageValue === normalizedQuery) return true;
        
        // Check for storage size with "gb" suffix
        if (normalizedQuery.includes("gb")) {
          const storageSize = normalizedQuery.replace("gb", "").trim();
          return storageValue.includes(storageSize + "gb") || storageValue.includes(storageSize + " gb");
        }
        
        return storageValue.includes(normalizedQuery);
      });
      
      // Improved price matching for ranges like "below 20000"
      let priceMatch = product.price.toString().includes(normalizedQuery);
      
      // Handle price range queries
      if (normalizedQuery.includes("below") || normalizedQuery.includes("under")) {
        const priceThreshold = extractNumberFromString(normalizedQuery);
        if (priceThreshold > 0) {
          priceMatch = product.price < priceThreshold;
        }
      } else if (normalizedQuery.includes("above") || normalizedQuery.includes("over")) {
        const priceThreshold = extractNumberFromString(normalizedQuery);
        if (priceThreshold > 0) {
          priceMatch = product.price > priceThreshold;
        }
      } else if (normalizedQuery.includes("between")) {
        const numbers = extractNumbersFromString(normalizedQuery);
        if (numbers.length >= 2) {
          const [min, max] = numbers.sort((a, b) => a - b);
          priceMatch = product.price >= min && product.price <= max;
        }
      }
      
      return nameMatch || batteryMatch || ramMatch || storageMatch || priceMatch;
    });
    
    if (matchedProducts.length === 0) {
      return [];
    }
    
    // Step 2: Group similar items using a simple approach (by brand as a proxy for KNN)
    // In a real system, this would be done with actual KNN algorithm
    const brands = new Map<string, Group>();
    matchedProducts.forEach(product => {
      // Extract brand from product name (e.g., "Samsung", "iPhone", etc.)
      const brandName = product.name.split(' ')[0].toLowerCase();
      if (!brands.has(brandName)) {
        brands.set(brandName, { id: brandName, items: [] });
      }
      brands.get(brandName)?.items.push(product);
    });
    
    // Step 3: Rank items within groups (simple SVM proxy)
    // In real system, this would use actual SVM with user preferences
    const rankedProducts: Product[] = [];
    brands.forEach(group => {
      // Sort items within each group by relevance (for demo: price as proxy for relevance)
      const sortedItems = [...group.items].sort((a, b) => a.price - b.price);
      rankedProducts.push(...sortedItems);
    });
    
    // Step 4: Re-rank for fairness
    // Ensure representation across groups (brands)
    const finalRankedProducts: Product[] = [];
    const usedGroups = new Set<string>();
    const remainingProducts = [...rankedProducts];
    
    // First ensure each group has at least one representative
    brands.forEach(group => {
      if (group.items.length > 0) {
        const bestItem = group.items.reduce((best, current) => 
          current.rating > best.rating ? current : best, group.items[0]);
        
        finalRankedProducts.push(bestItem);
        usedGroups.add(group.id);
        
        // Remove this item from remainingProducts
        const index = remainingProducts.findIndex(p => p.id === bestItem.id);
        if (index !== -1) {
          remainingProducts.splice(index, 1);
        }
      }
    });
    
    // Add remaining products, but ensure diversity
    while (remainingProducts.length > 0) {
      // Find the least represented group so far
      const groupCounts = new Map<string, number>();
      brands.forEach(group => {
        groupCounts.set(group.id, 0);
      });
      
      finalRankedProducts.forEach(product => {
        const brandName = product.name.split(' ')[0].toLowerCase();
        if (groupCounts.has(brandName)) {
          groupCounts.set(brandName, (groupCounts.get(brandName) || 0) + 1);
        }
      });
      
      // Find group with minimum representation
      let minCount = Infinity;
      let targetGroup = '';
      
      groupCounts.forEach((count, group) => {
        if (count < minCount && brands.get(group)?.items.some(item => 
          remainingProducts.some(p => p.id === item.id))) {
          minCount = count;
          targetGroup = group;
        }
      });
      
      // If we found a target group, add its next best item
      if (targetGroup) {
        const groupItems = brands.get(targetGroup)?.items || [];
        const availableItems = groupItems.filter(item => 
          remainingProducts.some(p => p.id === item.id));
        
        if (availableItems.length > 0) {
          // Pick the highest rated available item
          const bestItem = availableItems.reduce((best, current) => 
            current.rating > best.rating ? current : best, availableItems[0]);
          
          finalRankedProducts.push(bestItem);
          
          // Remove from remainingProducts
          const index = remainingProducts.findIndex(p => p.id === bestItem.id);
          if (index !== -1) {
            remainingProducts.splice(index, 1);
          }
          continue;
        }
      }
      
      // Fallback: just add the next item if no group optimization was possible
      finalRankedProducts.push(remainingProducts[0]);
      remainingProducts.shift();
    }
    
    return finalRankedProducts;
  };

  // Helper function to extract a number from a string like "below 20000"
  const extractNumberFromString = (str: string): number => {
    const matches = str.match(/\d+/g);
    if (matches && matches.length > 0) {
      return parseInt(matches[0], 10);
    }
    return 0;
  };

  // Helper function to extract multiple numbers from a string like "between 10000 and 20000"
  const extractNumbersFromString = (str: string): number[] => {
    const matches = str.match(/\d+/g);
    if (matches) {
      return matches.map(match => parseInt(match, 10));
    }
    return [];
  };

  const getProductById = (id: string) => {
    return products.find(product => product.id === id);
  };

  const value = {
    products,
    searchProducts,
    getProductById,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};
