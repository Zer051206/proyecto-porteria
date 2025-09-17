// src/hooks/useAuthStatus.js
import { useState, useEffect } from 'react';
import api from '../config/axios.js'; // <-- Importa la instancia de Axios configurada

const useAuthStatus = () => {
  const [ isAuthenticated, setIsAuthenticated ] = useState(false);
  const [ isLoading, setIsLoading ] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Usa la instancia `api` para que el interceptor maneje la autenticación
        const response = await api.get('/auth/me'); 
        
        // Verifica si la respuesta indica que el usuario está autenticado
        if (response.data.authenticated) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
      } catch (error) {
        // Si hay un error (ej. 401), el interceptor ya habrá intentado refrescar el token.
        // Si el error persiste, significa que no está autenticado.
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