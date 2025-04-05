
import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Check, Star, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
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
  const { toast } = useToast();
  
  const [selectedStorage, setSelectedStorage] = useState<string | null>(null);
  const [selectedRAM, setSelectedRAM] = useState<string | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  
  const product = getProductById(id || '');
  
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-6">
            <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
            <p className="text-gray-600 mb-4">The product you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/home')}>Return to Home</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  const inWishlist = isInWishlist(product.id);
  
  const handleAddToCart = () => {
    addToCart(product);
  };
  
  const handleBuyNow = () => {
    addToCart(product);
    setShowSuccessDialog(true);
    
    // Show toast notification
    toast({
      title: "Order Placed Successfully!",
      description: "Your order will be delivered within 4 days.",
    });
    
    // Navigate to checkout after a short delay to show the dialog
    setTimeout(() => {
      setShowSuccessDialog(false);
      navigate('/checkout');
    }, 2000);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-4">
          <nav className="flex">
            <Link to="/home" className="text-gray-500 hover:text-primary">Home</Link>
            <ChevronRight size={16} className="mx-2 text-gray-400" />
            <span className="text-gray-700">Product</span>
          </nav>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Product Image */}
          <div className="bg-white rounded-lg p-8 flex items-center justify-center border">
            <img 
              src={product.image} 
              alt={product.name}
              className="max-h-[400px] object-contain"
            />
          </div>
          
          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>
              
              <div className="flex items-center mt-2">
                <div className="flex items-center text-yellow-500 mr-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
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
                <span className="text-gray-500">({product.rating.toFixed(1)})</span>
              </div>
            </div>
            
            <div className="border-t border-b py-4">
              <div className="text-3xl font-bold text-primary">₹{product.price.toLocaleString()}</div>
              <div className="text-sm text-gray-500 mt-1">Inclusive of all taxes</div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Key Features:</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check size={18} className="text-green-500 mr-2 mt-0.5" />
                  <span>Battery Capacity: {product.batteryCapacity}</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-green-500 mr-2 mt-0.5" />
                  <span>Available Storage: {product.storage.join(', ')}</span>
                </li>
                <li className="flex items-start">
                  <Check size={18} className="text-green-500 mr-2 mt-0.5" />
                  <span>RAM Configurations: {product.ram.join(', ')}</span>
                </li>
              </ul>
            </div>
            
            {/* Configuration Options */}
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Storage:</h3>
                <div className="flex flex-wrap gap-2">
                  {product.storage.map(storage => (
                    <Button
                      key={storage}
                      variant={selectedStorage === storage ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedStorage(storage)}
                    >
                      {storage}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">RAM:</h3>
                <div className="flex flex-wrap gap-2">
                  {product.ram.map(ram => (
                    <Button
                      key={ram}
                      variant={selectedRAM === ram ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedRAM(ram)}
                    >
                      {ram}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                variant="outline"
                size="lg"
                className="flex-1 gap-2"
                onClick={() => toggleWishlist(product)}
              >
                <Heart size={20} className={inWishlist ? 'fill-red-500 text-red-500' : ''} />
                {inWishlist ? 'Added to Wishlist' : 'Add to Wishlist'}
              </Button>
              
              <Button
                onClick={handleAddToCart}
                size="lg"
                className="flex-1 gap-2"
              >
                <ShoppingCart size={20} />
                Add to Cart
              </Button>
              
              <Button
                onClick={handleBuyNow}
                variant="secondary"
                size="lg"
                className="flex-1"
              >
                Buy Now
              </Button>
            </div>
          </div>
        </div>
        
        {/* Product Description and Specs */}
        <div className="mt-8">
          <Tabs defaultValue="description">
            <TabsList className="mb-4">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="p-6 border rounded-lg">
              <p className="text-gray-700">{product.description}</p>
            </TabsContent>
            
            <TabsContent value="specifications" className="p-6 border rounded-lg">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-lg mb-2">Basic Information</h3>
                    <ul className="space-y-2">
                      <li className="flex justify-between">
                        <span className="text-gray-600">Brand</span>
                        <span className="font-medium">{product.name.split(' ')[0]}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Model</span>
                        <span className="font-medium">{product.name}</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-lg mb-2">Battery & Power</h3>
                    <ul className="space-y-2">
                      <li className="flex justify-between">
                        <span className="text-gray-600">Battery Capacity</span>
                        <span className="font-medium">{product.batteryCapacity}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Fast Charging</span>
                        <span className="font-medium">Yes</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-lg mb-2">Storage</h3>
                    <ul className="space-y-2">
                      <li className="flex justify-between">
                        <span className="text-gray-600">Internal Storage</span>
                        <span className="font-medium">{product.storage.join(', ')}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Expandable Storage</span>
                        <span className="font-medium">Yes (Up to 1TB)</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-lg mb-2">Memory</h3>
                    <ul className="space-y-2">
                      <li className="flex justify-between">
                        <span className="text-gray-600">RAM</span>
                        <span className="font-medium">{product.ram.join(', ')}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">RAM Type</span>
                        <span className="font-medium">LPDDR5</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="p-6 border rounded-lg">
              <div className="text-center py-8">
                <h3 className="text-lg font-medium mb-2">No reviews yet</h3>
                <p className="text-gray-500">Be the first to review this product</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
      
      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center flex flex-col items-center">
              <div className="bg-green-100 p-3 rounded-full mb-3">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              Order Confirmed!
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-4">
            <p className="text-gray-700 mb-2">Your order has been placed successfully!</p>
            <p className="text-gray-600">Expected delivery within 4 days.</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductDetail;
