
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-100 pt-12 pb-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h2 className="text-xl font-bold mb-4 text-primary">
              Fair<span className="text-secondary">Kart</span>
            </h2>
            <p className="text-gray-600 mb-4">
              A fairness-aware e-commerce platform that balances accuracy, diversity, and fairness in product recommendations.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Shop</h3>
            <ul className="space-y-2">
              <li><Link to="/home" className="text-gray-600 hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/wishlist" className="text-gray-600 hover:text-primary transition-colors">Wishlist</Link></li>
              <li><Link to="/cart" className="text-gray-600 hover:text-primary transition-colors">Cart</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">FAQs</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">Shipping & Returns</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">About</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">Our Story</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary transition-colors">Terms & Conditions</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} FairKart. All rights reserved.</p>
          <p className="mt-1">
            Powered by AI-driven fair recommendation systems.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
