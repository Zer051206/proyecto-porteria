// src/hooks/useLoginForm.js
import { useState } from 'react';
import axiosClient from '../axiosClient';

export const useLoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = (e) => setEmail(e.target.value);

  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleLogin = (e) => {
    e.preventDefault()

    try{
      const response = axiosClient.post('/login', {
        email,
        password
      })
      console.log('Inicio de sesión exitosa', response.data)
    } catch {
      console.log('Error al iniciar sesión', error.response.data)
    }
  }

  return {
    email,
    password,
    handleLogin,
    handleEmailChange,
    handlePasswordChange
  };
};