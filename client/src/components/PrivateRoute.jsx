// src/components/PrivateRoute.jsx
import React from 'react'; 
import useAuthStatus from '../hooks/useAuthStatus.js';
import AuthRedirect from './AuthRedirect.jsx';

const PrivateRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuthStatus();

    if (isLoading) {
        return <div className="text-xl text-black bg-white rounded-2xl px-6 py-4">Cargando...</div>;
    }

    if (!isAuthenticated) {
      return <AuthRedirect />;
    }

    return children;
};

export default PrivateRoute;