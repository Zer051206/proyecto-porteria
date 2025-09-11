// src/pages/Dashboard.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxesPacking, faArrowLeft, faUserClock } from '@fortawesome/free-solid-svg-icons';

export default function DashboardHistorial() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-full sm:w-full sm:h-full text-blue-700 transition-colors duration-300">
      <h1 className="text-4xl sm:text-6xl font-bold mb-10 text-center">Historial de Registros</h1>
      <div className="flex space-x-8 w-screen justify-center  sm:space-x-20">
        <button
          onClick={() => navigate('/historial/visitas')}
          className="flex flex-col items-center justify-center w-[180px] text-xl sm:text-2xl h-[145px] ml-[20px] sm:w-48 sm:h-48 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-lg shadow-lg  shadow-black transform hover:scale-105 transition-transform duration-200"
        >
          <FontAwesomeIcon icon={faUserClock} className="text-5xl mb-4" />
          <span className="text-lg">Visitas</span>
        </button>
        <button
          onClick={() => navigate('/historial/paquetes')}
          className="flex flex-col items-center justify-center w-[180px] text-xl sm:text-2xl h-[145px] mr-[20px] sm:w-48 sm:h-48 bg-green-700 hover:bg-green-800 text-white font-bold rounded-lg shadow-lg shadow-black transform hover:scale-105 transition-transform duration-200"
        >
          <FontAwesomeIcon icon={faBoxesPacking} className="text-5xl mb-4" />
          <span className="text-lg">Paquetes</span>
        </button>
      </div>

      <button
        onClick={() => navigate('/dashboard')} // Vuelve a la página anterior
        className="mt-10 px-6 py-4 flex items-center text-lg sm:text-2xl bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md transition-colors duration-200"
      > 
        <FontAwesomeIcon icon={faArrowLeft} className="mr-2 text-lg sm:text-2xl" />
        Volver
      </button>
    </div>
  );
}