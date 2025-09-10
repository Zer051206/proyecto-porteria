// src/hooks/useLoginForm.js
import { useState } from 'react';
import axiosClient from '../axiosClient';
import { useNavigate } from 'react-router-dom';

export const useLoginForm = () => {
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ error, setError ] = useState(null);
  const [ isLoading, setIsLoading ] = useState(false);
  const navigate = useNavigate();
  
  const handleEmailChange = (e) => setEmail(e.target.value);

  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    seError(null);

    try{
      await axiosClient.post('http://localhost:3000/auth/login', {
        email,
        password
      }, { withCredentials: true });

      navigate('/dashboard');

    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Error al iniciar sesión. Por favor, verifica tus credenciales.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    password,
    handleLogin,
    handleEmailChange,
    handlePasswordChange,
    error,
    isLoading
  };
};