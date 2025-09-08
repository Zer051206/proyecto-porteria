// src/pages/Dashboard.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faUpload, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

export default function DashboardPackage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-full sm:w-full sm:h-full text-blue-700 transition-colors duration-300">
      <h1 className="text-4xl sm:text-5xl font-bold mb-10 text-center">Gestión de Envíos</h1>
      <div className="flex space-x-8 w-screen justify-center  sm:space-x-20">
        <button
          onClick={() => navigate('/paquetes/recibir')}
          className="flex flex-col items-center justify-center w-[170px] text-xl sm:text-2xl h-[160px] ml-[20px] sm:w-48 sm:h-48 bg-blue-800 hover:bg-blue-900 text-white font-bold rounded-lg shadow-xl transform hover:scale-105 transition-transform duration-200"
        >
          <FontAwesomeIcon icon={faDownload} className="text-5xl mb-4" />
          <span className="text-lg">Recibir</span>
        </button>
        <button
          onClick={() => navigate('/paquetes/enviar')}
          className="flex flex-col items-center justify-center w-[170px] text-xl sm:text-2xl h-[160px] mr-[20px] sm:w-48 sm:h-48 bg-green-800 hover:bg-green-900 text-white font-bold rounded-lg shadow-xl transform hover:scale-105 transition-transform duration-200"
        >
          <FontAwesomeIcon icon={faUpload} className="text-5xl mb-4" />
          <span className="text-lg">Enviar</span>
        </button>
      </div>

      <button
        onClick={() => navigate('/dashboard')} // Vuelve a la página anterior
        className="mt-10 px-6 py-4 flex items-center text-xl sm:text-2xl bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md transition-colors duration-200"
      > 
        <FontAwesomeIcon icon={faArrowLeft} className="mr-2 text-xl sm:text-2xl" />
        Volver
      </button>
    </div>
  );
}