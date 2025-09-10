import { useState, useEffect } from 'react';
import axios from 'axios';

const useAuthStatus = () => {
  const [ isAuthenticated, setIsAuthenticated ] = useState(false);
  const [ isLoading, setIsLoading ] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get('http://localhost:3000/api/status', {
          withCredentials: true,
        });
        setIsAuthenticated(true)
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }  
    } 
    checkAuth();
  }, []);

  return { isAuthenticated, isLoading };
};

export default useAuthStatus; 