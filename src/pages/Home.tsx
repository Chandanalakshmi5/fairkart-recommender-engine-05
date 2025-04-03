
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../contexts/ProductContext';

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const { products, searchProducts } = useProducts();
  const [filteredProducts, setFilteredProducts] = useState(products);

  // Handle initial search from URL
  useEffect(() => {
    const searchParam = searchParams.get('search');
    if (searchParam) {
      setSearchQuery(searchParam);
      const results = searchProducts(searchParam);
      setFilteredProducts(results);
    }
  }, [searchParams]);

  const handleSearch = () => {
    const results = searchProducts(searchQuery);
    setFilteredProducts(results);
    
    // Update URL with search query
    if (searchQuery) {
      setSearchParams({ search: searchQuery });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        onSearch={handleSearch}
      />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <section className="mb-12">
          <div className="bg-gradient-to-r from-blue-700 to-blue-500 rounded-lg p-8 text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Welcome to FairKart</h1>
            <p className="text-lg md:text-xl mb-6 max-w-2xl">
              Discover our fairness-aware recommendation system that ensures diverse and unbiased product recommendations for all users.
            </p>
          </div>
        </section>
        
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">
              {searchQuery 
                ? `Search Results for "${searchQuery}"`
                : "Featured Smartphones"}
            </h2>
          </div>
          
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-600 mb-2">No products found</h3>
              <p className="text-gray-500">
                Try different search terms or browse our featured products
              </p>
            </div>
          ) : (
            <div className="product-grid">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;
