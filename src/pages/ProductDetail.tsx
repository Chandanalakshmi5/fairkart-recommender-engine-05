import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, ArrowLeft, Star, Battery, Microchip, HardDrive, ImageOff } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useProducts } from '../contexts/ProductContext';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProductById } = useProducts();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [imageError, setImageError] = useState(false);
  
  const product = getProductById(id || '');
  
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-6">
            <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
            <p className="text-gray-600 mb-6">
              The product you are looking for does not exist or has been removed.
            </p>
            <Button onClick={() => navigate('/home')}>
              Go Back to Home
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  const handleBuyNow = () => {
    addToCart(product);
    navigate('/checkout');
  };

  const handleImageError = () => {
    console.log(`Image failed to load for product detail: ${product.name}`);
    setImageError(true);
  };
  
  const inWishlist = isInWishlist(product.id);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back
        </Button>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="bg-gray-50 rounded-lg p-8 flex items-center justify-center h-[400px] md:sticky md:top-24">
            {!imageError ? (
              <img 
                src={product.image} 
                alt={product.name} 
                className="max-h-full max-w-full object-contain" 
                onError={handleImageError}
                loading="eager"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-400">
                <ImageOff size={64} />
                <span className="mt-4 text-lg">Image not available</span>
              </div>
            )}
          </div>
          
          {/* Product Info */}
          <div className="flex flex-col">
            <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
            
            <div className="flex items-center mt-2 mb-4">
              <div className="flex items-center text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={`${
                      i < Math.floor(product.rating) ? 'fill-yellow-500' : 'fill-gray-200 text-gray-200'
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-600">{product.rating.toFixed(1)} out of 5</span>
            </div>
            
            <div className="text-3xl font-bold mb-6">
              ₹{product.price.toLocaleString()}
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-4 mb-6">
              <h2 className="text-xl font-semibold">Key Features</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Battery size={20} className="text-gray-400 mr-2" />
                  <div>
                    <span className="text-sm text-gray-600">Battery</span>
                    <p className="font-medium">{product.batteryCapacity}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Microchip size={20} className="text-gray-400 mr-2" />
                  <div>
                    <span className="text-sm text-gray-600">RAM Options</span>
                    <p className="font-medium">{product.ram.join(', ')}</p>
                  </div>
                </div>
                
                <div className="flex items-center col-span-full">
                  <HardDrive size={20} className="text-gray-400 mr-2" />
                  <div>
                    <span className="text-sm text-gray-600">Storage Options</span>
                    <p className="font-medium">{product.storage.join(', ')}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-gray-700">
                {product.description}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
              <Button 
                variant="outline"
                className={`flex-1 gap-2 ${
                  inWishlist ? 'bg-red-50 text-red-600 border-red-300' : ''
                }`}
                onClick={() => toggleWishlist(product)}
              >
                <Heart size={20} className={inWishlist ? 'fill-red-500' : ''} />
                {inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </Button>
              
              <Button 
                className="flex-1 gap-2"
                onClick={() => addToCart(product)}
              >
                <ShoppingCart size={20} />
                Add to Cart
              </Button>
            </div>
            
            <Button 
              variant="secondary" 
              className="w-full mt-4"
              onClick={handleBuyNow}
            >
              Buy Now
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductDetail;
