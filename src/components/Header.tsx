
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Search, User, LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useState } from 'react';

interface HeaderProps {
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  onSearch?: () => void;
}

const Header = ({ searchQuery = '', setSearchQuery, onSearch }: HeaderProps) => {
  const { currentUser, logout } = useAuth();
  const { cartItemCount } = useCart();
  const [localSearch, setLocalSearch] = useState('');
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch();
    }
  };
  
  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/home" className="flex items-center">
            <h1 className="text-2xl font-bold text-primary">
              Fair<span className="text-secondary">Kart</span>
            </h1>
          </Link>
          
          {/* Search Bar */}
          {setSearchQuery && (
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <Input
                  type="text"
                  placeholder="Search by name, price, battery, RAM or storage"
                  className="w-full pr-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary"
                >
                  <Search size={20} />
                </button>
              </div>
            </form>
          )}
          
          {/* Mobile Search */}
          {!setSearchQuery && (
            <form onSubmit={(e) => {
              e.preventDefault();
              window.location.href = `/home?search=${encodeURIComponent(localSearch)}`;
            }} className="hidden md:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <Input
                  type="text"
                  placeholder="Search by name, price, battery, RAM or storage"
                  className="w-full pr-10"
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary"
                >
                  <Search size={20} />
                </button>
              </div>
            </form>
          )}
          
          {/* Navigation */}
          <nav className="flex items-center gap-4">
            <Link to="/wishlist" className="text-gray-700 hover:text-primary relative">
              <Heart size={24} />
            </Link>
            
            <Link to="/cart" className="text-gray-700 hover:text-primary relative">
              <ShoppingCart size={24} />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-secondary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
            
            <div className="relative group">
              <button className="text-gray-700 hover:text-primary">
                <User size={24} />
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="p-3 border-b border-gray-100">
                  <p className="font-medium text-sm">{currentUser?.name}</p>
                  <p className="text-xs text-gray-500">{currentUser?.email}</p>
                </div>
                <div className="p-2">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={logout}
                  >
                    <LogOut size={16} className="mr-2" /> Sign Out
                  </Button>
                </div>
              </div>
            </div>
          </nav>
        </div>
        
        {/* Mobile Search */}
        {setSearchQuery && (
          <form onSubmit={handleSearch} className="mt-3 md:hidden">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Search by name, price, battery, RAM or storage"
                className="w-full pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary"
              >
                <Search size={20} />
              </button>
            </div>
          </form>
        )}
        
        {!setSearchQuery && (
          <form onSubmit={(e) => {
            e.preventDefault();
            window.location.href = `/home?search=${encodeURIComponent(localSearch)}`;
          }} className="mt-3 md:hidden">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Search by name, price, battery, RAM or storage"
                className="w-full pr-10"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
              />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary"
              >
                <Search size={20} />
              </button>
            </div>
          </form>
        )}
      </div>
    </header>
  );
};

export default Header;
