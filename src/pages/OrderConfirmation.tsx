
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Package, Truck, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../contexts/CartContext';

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  
  // Clear cart when reaching order confirmation
  useEffect(() => {
    clearCart();
  }, [clearCart]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="mx-auto w-20 h-20 flex items-center justify-center rounded-full bg-green-100 mb-6">
              <Check size={40} className="text-green-600" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
            <p className="text-gray-600 text-lg mb-2">
              Thank you for your purchase. Your order has been received.
            </p>
            <p className="text-primary font-medium">
              Order #FKT-{Math.floor(100000 + Math.random() * 900000)}
            </p>
          </div>
          
          <div className="bg-white rounded-lg border p-6 mb-8">
            <h2 className="text-xl font-semibold mb-6">Delivery Status</h2>
            
            <div className="relative mb-8">
              <Progress value={25} className="h-2" />
              
              <div className="flex justify-between mt-4">
                <div className="text-center flex-1">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mx-auto mb-2">
                    <Check size={20} className="text-white" />
                  </div>
                  <p className="text-sm font-medium">Order Placed</p>
                </div>
                
                <div className="text-center flex-1">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Package size={20} className="text-gray-500" />
                  </div>
                  <p className="text-sm font-medium text-gray-500">Processing</p>
                </div>
                
                <div className="text-center flex-1">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Truck size={20} className="text-gray-500" />
                  </div>
                  <p className="text-sm font-medium text-gray-500">Shipped</p>
                </div>
                
                <div className="text-center flex-1">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Check size={20} className="text-gray-500" />
                  </div>
                  <p className="text-sm font-medium text-gray-500">Delivered</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <Clock size={24} className="text-primary mr-3" />
                <div>
                  <p className="font-medium">Estimated Delivery</p>
                  <p className="text-gray-600 text-sm">
                    {new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              <div>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                  On Time
                </span>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <Button 
              onClick={() => navigate('/home')}
              className="mr-4"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default OrderConfirmation;
