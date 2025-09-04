import React from 'react';
import { Link } from 'react-router-dom';
import { useRegisterForm } from '../../hooks/useRegisterForm.js';

export default function RegisterForm() {
  const { 
    name, 
    email, 
    password, 
    lastName, 
    handleRegister, 
    handleClickName, 
    handleClickEmail, 
    handleClickLastName, 
    handleClickPassword
  } = useRegisterForm();

  return (
    <div className="flex flex-col justify-center items-center h-full w-full">
      <form className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-sm" onSubmit={handleRegister}>
        <h2 className="text-2xl font-bold mb-5 text-center text-blue-900">Registro</h2>

        <fieldset className="p-4 rounded-md mb-3 border border-gray-200">
          <legend className="px-2 text-md font-semibold text-blue-900">Información personal</legend>
          <div className="space-y-4">
            <label className="block">
              <span className="text-gray-700 text-sm">Nombre:</span>
              <input 
                name="nombre"
                type="text" 
                value={name} 
                onChange={handleClickName} 
                className="mt-1 block w-full rounded-md border-2 border-gray-400 bg-gray-50 shadow-lg focus:border-blue-700 focus:ring-2 focus:ring-blue-300 transition-all duration-200 ease-in-out hover:border-blue-500"
                autoComplete="off"
                required
              />
            </label>
            <label className="block">
              <span className="text-gray-700 text-sm">Apellido:</span>
              <input 
                name="apellido"
                type="text" 
                value={lastName} 
                onChange={handleClickLastName} 
                className="mt-1 block w-full rounded-md border-2 border-gray-400 bg-gray-50 shadow-lg focus:border-blue-700 focus:ring-2 focus:ring-blue-300 transition-all duration-200 ease-in-out hover:border-blue-500"
                autoComplete="off"
                required
              />
            </label>
          </div>
        </fieldset>

        <fieldset className="p-4 rounded-md mb-3 border border-gray-200">
          <legend className="px-2 text-md font-semibold text-blue-900">Datos de la cuenta</legend>
          <div className="space-y-4">
            <label className="block">
              <span className="text-gray-700 text-sm">Correo electrónico:</span>
              <input 
                name="correo"
                type="email" 
                value={email} 
                onChange={handleClickEmail} 
                className="mt-1 block w-full rounded-md border-2 border-gray-400 bg-gray-50 shadow-lg focus:border-blue-700 focus:ring-2 focus:ring-blue-300 transition-all duration-200 ease-in-out hover:border-blue-500"
                autoComplete="off"
                required
              />
            </label>
            <label className="block">
              <span className="text-gray-700 text-sm">Contraseña:</span>
              <input 
                name="password"
                type="password" 
                value={password} 
                onChange={handleClickPassword} 
                className="mt-1 block w-full rounded-md border-2 border-gray-400 bg-gray-50 shadow-lg focus:border-blue-700 focus:ring-2 focus:ring-blue-300 transition-all duration-200 ease-in-out hover:border-blue-500"
                autoComplete="off"
                required
              />
            </label>
          </div>
        </fieldset>

        <button
          type="submit"
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
        >
          Registrarse
        </button>

        <div className="mt-4 text-center text-sm">
          <span className="text-gray-600">¿Ya tienes una cuenta?</span>{' '}
          <Link to="/auth/login" className="text-blue-600 hover:underline">Inicia sesión</Link>
        </div>
      </form>
    </div>
  );
}