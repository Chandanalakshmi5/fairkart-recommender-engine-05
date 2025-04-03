
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const Checkout = () => {
  const { currentUser } = useAuth();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('India');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cartItems.length) {
      toast({
        title: "Cart is empty",
        description: "Add items to your cart before checkout",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate order processing
    setTimeout(() => {
      setIsProcessing(false);
      
      clearCart();
      toast({
        title: "Order Placed Successfully!",
        description: "Your order has been placed and will be delivered soon.",
      });
      
      navigate('/order-confirmation');
    }, 1500);
  };
  
  // Order Confirmation Component (shown after successful order)
  if (window.location.pathname === '/order-confirmation') {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md p-6">
            <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-green-100 mb-6">
              <Check size={32} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Order Confirmed!</h2>
            <p className="text-gray-600 mb-6">
              Your order has been placed successfully. You will receive a confirmation email shortly.
            </p>
            <Button asChild>
              <a href="/home">Continue Shopping</a>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md p-6">
            <h2 className="text-2xl font-bold mb-2">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-6">
              Add items to your cart before proceeding to checkout.
            </p>
            <Button asChild>
              <a href="/home">Shop Now</a>
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
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Contact Information */}
              <div className="bg-white rounded-lg border p-6">
                <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
              
              {/* Shipping Address */}
              <div className="bg-white rounded-lg border p-6">
                <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Textarea 
                      id="address" 
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input 
                        id="city" 
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input 
                        id="state" 
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input 
                        id="postalCode" 
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input 
                        id="country" 
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Payment Method */}
              <div className="bg-white rounded-lg border p-6">
                <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                <RadioGroup 
                  value={paymentMethod} 
                  onValueChange={setPaymentMethod}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2 p-3 rounded-md border">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="flex-1 cursor-pointer">Cash on Delivery</Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 rounded-md border">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex-1 cursor-pointer">Credit/Debit Card</Label>
                    <CreditCard size={20} className="text-gray-500" />
                  </div>
                </RadioGroup>
              </div>
              
              {/* Submit Button (Mobile Only) */}
              <div className="lg:hidden">
                <Button 
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : `Place Order - ₹${Math.round(getCartTotal() * 1.18).toLocaleString()}`}
                </Button>
              </div>
            </form>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border p-6 sticky top-20">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              
              <div className="max-h-64 overflow-y-auto pr-2 mb-4">
                {cartItems.map(item => (
                  <div key={item.id} className="flex py-3 border-b">
                    <div className="w-16 h-16 bg-gray-100 rounded flex-shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex justify-between">
                        <h3 className="text-sm font-medium line-clamp-1">{item.name}</h3>
                        <span className="text-sm font-medium">₹{item.price.toLocaleString()}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Qty: {item.quantity}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{getCartTotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">₹{Math.round(getCartTotal() * 0.18).toLocaleString()}</span>
                </div>
                
                <Separator className="my-4" />
                
                <div className="flex justify-between text-base font-bold">
                  <span>Total</span>
                  <span>₹{Math.round(getCartTotal() * 1.18).toLocaleString()}</span>
                </div>
              </div>
              
              {/* Desktop Submit Button */}
              <div className="hidden lg:block mt-6">
                <Button 
                  type="submit"
                  className="w-full"
                  size="lg"
                  onClick={handleSubmit}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : 'Place Order'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Checkout;
