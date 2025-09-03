import React from 'react';
import { Link } from 'react-router-dom';
import { useLoginForm } from '../../hooks/useLoginForm.js';

export default function LoginForm() {
  const { 
    email, 
    password,
    handleLogin, 
    handleEmailChange, 
    handlePasswordChange 
  } = useLoginForm();

  return (
    <div className="flex flex-col justify-center items-center h-full w-full">
      <form className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-sm" onSubmit={handleLogin}>
        <h2 className="text-2xl font-bold mb-5 text-center text-blue-900">Iniciar Sesión</h2>

        <fieldset className="p-4 rounded-md mb-3 border border-gray-200">
          <legend className="px-2 text-md font-semibold text-blue-900">Datos de la cuenta</legend>
          <div className="space-y-4">
            <label className="block">
              <span className="text-gray-700 text-sm">Correo electrónico:</span>
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                className="mt-1 block w-full rounded-md border-2 border-gray-400 bg-gray-50 shadow-lg focus:border-blue-700 focus:ring-2 focus:ring-blue-300 transition-all duration-200 ease-in-out hover:border-blue-500"
                autoComplete="off"
              />
            </label>
            <label className="block">
              <span className="text-gray-700 text-sm">Contraseña:</span>
              <input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                className="mt-1 block w-full rounded-md border-2 border-gray-400 bg-gray-50 shadow-lg focus:border-blue-700 focus:ring-2 focus:ring-blue-300 transition-all duration-200 ease-in-out hover:border-blue-500"
                autoComplete="off"
              />
            </label>
          </div>
        </fieldset>

        <button
          type="submit"
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
        >
          Entrar
        </button>

        <div className="mt-4 text-center text-sm">
          <span className="text-gray-600">¿No tienes una cuenta?</span>{' '}
          <Link to="/auth/register" className="text-blue-600 hover:underline">Regístrate aquí</Link>
        </div>
      </form>
    </div>
  );
}