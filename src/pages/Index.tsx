
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Index = () => {
  const { currentUser, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Wait for auth to initialize
    if (!isLoading) {
      if (currentUser) {
        // If user is logged in
        if (currentUser.location) {
          navigate('/home');
        } else {
          navigate('/location-access');
        }
      } else {
        // If not logged in
        navigate('/login');
      }
    }
  }, [currentUser, isLoading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-primary mb-4">
          Fair<span className="text-secondary">Kart</span>
        </h1>
        <p className="text-xl text-gray-600">Redirecting, please wait...</p>
      </div>
    </div>
  );
};

export default Index;
