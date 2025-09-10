// src/components/AuthRedirect.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';

const AuthRedirect = () => {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/auth/login');
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen w-screen p-3  text-gray-300">
            <div className="bg-gray-800 p-8 rounded-lg shadow-2xl text-center max-w-sm w-full">
                <h2 className="text-3xl font-bold mb-4 text-red-600">Acceso Denegado</h2>
                <p className="mb-6">
                    No tienes permiso para ver esta página. Por favor, inicia sesión para continuar.
                </p>
                <button
                    onClick={handleLoginClick}
                    className="
                        w-full px-4 py-2 text-sm 
                        bg-blue-600 hover:bg-blue-700 
                        text-white font-bold rounded-lg 
                        transition-colors duration-300
                    "
                >
                    Ir a Iniciar Sesión
                </button>
            </div>
        </div>
    );
};

export default AuthRedirect;