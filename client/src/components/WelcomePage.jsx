import React from 'react';
import { Link } from 'react-router-dom';

export function WelcomePage() {
  return (
    <div className="flex flex-col items-center gap-10 p-4 w-full">
      
      {/* Contenedor del logo y el texto */}
      <div className="flex flex-col items-center mb-10">
        <div className="w-24 h-24 mb-8 bg-white rounded-full flex items-center justify-center shadow-lg">
          <span className="text-gray-400">Logo App</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-800 mb-4">
          Bienvenido de nuevo
        </h1>
        
        <p className="text-lg sm:text-xl text-gray-500 max-w-lg">
          Gestión de visitas y paquetes.
        </p>
      </div>

      {/* Contenedor de los "cajones" de navegación */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-2 sm:gap-12 w-full">
        {/* Cajón de Iniciar Sesión */}
        <Link 
          to="/auth/login" 
          className="flex flex-col items-center justify-center p-8 w-44 h-44 bg-white rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300"
        >
          <div className="text-blue-600 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
          </div>
          <span className="text-lg font-semibold text-gray-800">Iniciar Sesión</span>
        </Link>

        {/* Cajón de Registrarse */}
        <Link 
          to="/auth/register" 
          className="flex flex-col items-center justify-center p-8 w-44 h-44 bg-white rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300"
        >
          <div className="text-green-600 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.5h3m-3 0v3m-3-3v3m-3-3v3" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12a7.5 7.5 0 0 1-7.5 7.5m15-6a7.5 7.5 0 0 1-7.5-7.5" />
            </svg>
          </div>
          <span className="text-lg font-semibold text-gray-800">Registrarse</span>
        </Link>
      </div>
    </div>
  );
}