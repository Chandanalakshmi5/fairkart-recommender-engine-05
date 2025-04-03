
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { currentUser, isLoading, hasLocation } = useAuth();
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  // If we're not on the location access page and user doesn't have location
  if (!hasLocation && window.location.pathname !== '/location-access') {
    return <Navigate to="/location-access" replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
