
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Star, ImageOff } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Product } from '../types/product';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();
  
  const inWishlist = isInWishlist(product.id);
  
  const handleBuyNow = () => {
    addToCart(product);
    navigate('/checkout');
  };

  const handleImageError = () => {
    console.log(`Image failed to load for product: ${product.name}`);
    setImageError(true);
  };

  // Fallback image from Unsplash if the original image fails to load
  const fallbackImage = `https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=600`;
  
  return (
    <Card 
      className="overflow-hidden transition-all duration-300 hover:shadow-lg animate-fade-in"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden h-48 bg-gray-50 flex items-center justify-center">
        <Link to={`/product/${product.id}`}>
          {!imageError ? (
            <img 
              src={product.image} 
              alt={product.name} 
              className={`w-full h-full object-contain transition-transform duration-300 ${isHovered ? 'scale-110' : 'scale-100'}`}
              onError={handleImageError}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full">
              <img 
                src={fallbackImage} 
                alt={product.name} 
                className={`w-full h-full object-cover transition-transform duration-300 ${isHovered ? 'scale-110' : 'scale-100'}`}
                onError={() => {
                  // If even the fallback image fails, show the text fallback
                  console.log(`Fallback image also failed for: ${product.name}`);
                }}
                loading="lazy"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white">
                <span className="text-lg font-medium">{product.name}</span>
              </div>
            </div>
          )}
        </Link>
        
        <button 
          onClick={() => toggleWishlist(product)}
          className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
        >
          <Heart size={20} className={inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
        </button>
      </div>
      
      <CardContent className="p-4">
        <Link to={`/product/${product.id}`} className="block">
          <h3 className="font-semibold text-lg line-clamp-1 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center mt-1 mb-2">
          <div className="flex items-center text-yellow-500">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={`${
                  i < Math.floor(product.rating) ? 'fill-yellow-500' : 'fill-gray-200 text-gray-200'
                } ${
                  i === Math.floor(product.rating) && product.rating % 1 > 0
                    ? 'fill-gradient-right'
                    : ''
                }`}
              />
            ))}
          </div>
          <span className="ml-1 text-xs text-gray-500">({product.rating.toFixed(1)})</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-3">
          <div>
            <span className="font-medium">Battery:</span> {product.batteryCapacity}
          </div>
          <div>
            <span className="font-medium">RAM:</span> {product.ram.join(', ')}
          </div>
          <div className="col-span-2">
            <span className="font-medium">Storage:</span> {product.storage.join(', ')}
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-auto">
          <div className="text-lg font-bold">₹{product.price.toLocaleString()}</div>
          <Button 
            size="sm"
            onClick={() => addToCart(product)}
            className="gap-1"
          >
            <ShoppingCart size={16} />
            <span className="hidden sm:inline">Add</span>
          </Button>
        </div>
        
        <Button 
          variant="secondary" 
          className="w-full mt-2" 
          onClick={handleBuyNow}
        >
          Buy Now
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
