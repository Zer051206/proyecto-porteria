// src/components/PrivateRoute.jsx
import React, { useEffect } from 'react'; 
import useAuthStatus from '../hooks/useAuthStatus.js';
import AuthRedirect from './AuthRedirect.jsx';
import api from '../config/axios.js';
import { useNavigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuthStatus();
    const navigate = useNavigate();

    useEffect(() => {
      const interceptor = api.interceptors.response.use(
        (response) => response,
        (error) => {
          if (error.status === 401 && error.needsLogin) {
            navigate('/auth-denegado', { replace: true });
          }
          return Promise.reject(error);
        }
      );

      return () => {
        api.interceptors.response.eject(interceptor)
      }
    }, [navigate])

    if (isLoading) {
        return <div className="text-xl text-black bg-white rounded-2xl px-6 py-4">Cargando...</div>;
    }

    if (!isAuthenticated) {
      return <AuthRedirect />;
    }

    return children;
};

export default PrivateRoute;