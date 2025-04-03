
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  
  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md p-6">
            <div className="mx-auto w-24 h-24 flex items-center justify-center rounded-full bg-gray-100 mb-6">
              <Heart size={32} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Your Wishlist is Empty</h2>
            <p className="text-gray-600 mb-6">
              Save items you like to your wishlist and they'll show up here.
            </p>
            <Button asChild>
              <Link to="/home">Explore Products</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Your Wishlist</h1>
          <div className="text-gray-500 text-sm">
            {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map(item => (
            <div key={item.id} className="bg-white rounded-lg border overflow-hidden shadow-sm transition-shadow hover:shadow-md">
              <div className="relative p-4">
                <button 
                  onClick={() => removeFromWishlist(item.id)}
                  className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors"
                  title="Remove from wishlist"
                >
                  <Trash2 size={16} className="text-red-500" />
                </button>
                
                <Link to={`/product/${item.id}`} className="block text-center">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="h-40 mx-auto object-contain mb-4"
                  />
                </Link>
                
                <Link to={`/product/${item.id}`} className="block">
                  <h3 className="font-medium hover:text-primary transition-colors line-clamp-1">
                    {item.name}
                  </h3>
                </Link>
                
                <div className="flex justify-between items-center mt-2">
                  <div className="font-bold">₹{item.price.toLocaleString()}</div>
                  <div className="text-sm text-yellow-500">★ {item.rating.toFixed(1)}</div>
                </div>
                
                <div className="text-xs text-gray-500 mt-1 mb-3">
                  {item.batteryCapacity} • {item.ram[0]}
                </div>
                
                <Button 
                  onClick={() => addToCart(item)}
                  className="w-full mt-2 gap-2"
                >
                  <ShoppingCart size={16} />
                  Add to Cart
                </Button>
              </div>
            </div>
          ))}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Wishlist;
