
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from "@/components/ui/use-toast";

interface User {
  id: string;
  name: string;
  email: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  setUserLocation: (latitude: number, longitude: number) => void;
  hasLocation: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user exists in localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u: any) => u.email === email);
      
      if (!user) {
        throw new Error('User not found');
      }
      
      if (user.password !== password) {
        throw new Error('Invalid password');
      }
      
      const loggedInUser = { 
        id: user.id,
        name: user.name,
        email: user.email,
        location: user.location
      };
      
      setCurrentUser(loggedInUser);
      localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${user.name}!`,
      });
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      if (users.some((u: any) => u.email === email)) {
        throw new Error('User already exists');
      }
      
      // Create new user
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password,
      };
      
      // Save to localStorage
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Log in the new user
      const loggedInUser = { 
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      };
      
      setCurrentUser(loggedInUser);
      localStorage.setItem('currentUser', JSON.stringify(loggedInUser));
      
      toast({
        title: "Signup Successful",
        description: `Welcome to FairKart, ${name}!`,
      });
    } catch (error) {
      toast({
        title: "Signup Failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
  };

  const setUserLocation = (latitude: number, longitude: number) => {
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        location: { latitude, longitude }
      };
      
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      // Also update in users array
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedUsers = users.map((u: any) => 
        u.id === currentUser.id ? {...u, location: { latitude, longitude }} : u
      );
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      toast({
        title: "Location Updated",
        description: "Your location has been successfully saved",
      });
    }
  };

  const value = {
    currentUser,
    isLoading,
    login,
    signup,
    logout,
    setUserLocation,
    hasLocation: Boolean(currentUser?.location)
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
