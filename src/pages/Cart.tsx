
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../contexts/CartContext';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const navigate = useNavigate();
  
  const handleCheckout = () => {
    navigate('/checkout');
  };
  
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md p-6">
            <div className="mx-auto w-24 h-24 flex items-center justify-center rounded-full bg-gray-100 mb-6">
              <ShoppingCart size={32} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-6">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Button onClick={() => navigate('/home')}>
              Continue Shopping
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
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Your Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border overflow-hidden">
              {/* Cart Header */}
              <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b bg-gray-50">
                <div className="col-span-6">
                  <span className="font-medium">Product</span>
                </div>
                <div className="col-span-2 text-center">
                  <span className="font-medium">Price</span>
                </div>
                <div className="col-span-2 text-center">
                  <span className="font-medium">Quantity</span>
                </div>
                <div className="col-span-2 text-right">
                  <span className="font-medium">Total</span>
                </div>
              </div>
              
              {/* Cart Items */}
              <div className="divide-y">
                {cartItems.map(item => (
                  <div key={item.id} className="p-4">
                    <div className="md:grid md:grid-cols-12 md:gap-4 flex flex-col">
                      {/* Product */}
                      <div className="col-span-6 flex">
                        <div className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="ml-4">
                          <Link 
                            to={`/product/${item.id}`}
                            className="font-medium hover:text-primary transition-colors"
                          >
                            {item.name}
                          </Link>
                          <p className="text-sm text-gray-500 mt-1">
                            Battery: {item.batteryCapacity}
                          </p>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="flex items-center text-xs text-red-500 hover:text-red-700 transition-colors mt-2 md:hidden"
                          >
                            <Trash2 size={14} className="mr-1" />
                            Remove
                          </button>
                        </div>
                      </div>
                      
                      {/* Price */}
                      <div className="col-span-2 flex justify-between md:block">
                        <div className="md:hidden font-medium">Price:</div>
                        <div className="md:text-center mt-2 md:mt-0">₹{item.price.toLocaleString()}</div>
                      </div>
                      
                      {/* Quantity */}
                      <div className="col-span-2 flex justify-between md:block mt-2 md:mt-0">
                        <div className="md:hidden font-medium">Quantity:</div>
                        <div className="flex items-center md:justify-center">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center rounded border"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="mx-2 min-w-[2rem] text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center rounded border"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                      
                      {/* Total */}
                      <div className="col-span-2 flex justify-between md:block mt-2 md:mt-0">
                        <div className="md:hidden font-medium">Total:</div>
                        <div className="md:text-right font-medium">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </div>
                      </div>
                      
                      {/* Remove button for larger screens */}
                      <div className="hidden md:flex md:items-center md:justify-center mt-2">
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border p-6 sticky top-20">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              
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
              
              <Button 
                onClick={handleCheckout}
                className="w-full mt-6"
                size="lg"
              >
                Proceed to Checkout
              </Button>
              
              <div className="mt-4">
                <Link 
                  to="/home"
                  className="inline-block text-primary hover:underline text-sm"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Cart;
