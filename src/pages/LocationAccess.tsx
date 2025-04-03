
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const LocationAccess = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const { setUserLocation } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if geolocation is available
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
    }
  }, []);

  const handleRequestLocation = () => {
    setIsLoading(true);
    setLocationStatus('loading');
    setError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation(latitude, longitude);
        setLocationStatus('success');
        setIsLoading(false);
        
        // Navigate to home after a short delay to show success state
        setTimeout(() => {
          navigate('/home');
        }, 1000);
      },
      (error) => {
        console.error('Error getting location:', error);
        setLocationStatus('error');
        setIsLoading(false);
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setError('Location permission denied. Please enable location access to continue.');
            break;
          case error.POSITION_UNAVAILABLE:
            setError('Location information is unavailable.');
            break;
          case error.TIMEOUT:
            setError('The request to get location timed out.');
            break;
          default:
            setError('An unknown error occurred while getting location.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const skipLocationAccess = () => {
    navigate('/home');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 mb-4">
            <MapPin size={32} className="text-primary" />
          </div>
          <CardTitle className="text-2xl">Location Access</CardTitle>
          <CardDescription>
            FairKart uses your location to provide personalized recommendations and accurate delivery estimates.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-50 p-4 rounded-md flex items-start mb-4">
              <AlertCircle size={20} className="text-red-500 mr-2 mt-0.5" />
              <div className="text-red-700 text-sm">{error}</div>
            </div>
          )}
          
          <div className="text-sm text-gray-600">
            <p className="mb-2">By enabling location access:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>You'll get more accurate delivery estimates</li>
              <li>We can show nearby pickup options</li>
              <li>Our recommendation system will be able to suggest relevant items</li>
            </ul>
            <p className="mt-4">
              Your location data is stored securely and will only be used to enhance your shopping experience.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-3">
          <Button 
            onClick={handleRequestLocation} 
            className="w-full"
            disabled={isLoading}
          >
            {locationStatus === 'loading' ? 'Getting Location...' : 
             locationStatus === 'success' ? 'Location Detected ✓' : 
             'Allow Location Access'}
          </Button>
          <Button 
            variant="outline" 
            onClick={skipLocationAccess}
            className="w-full"
          >
            Skip for Now
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LocationAccess;
