/**
 * @file AuthRedirect.jsx
 * @module component/AuthRedirect.jsx
 * @description Componente que se renderiza cuando un usuario no autenticado intenta acceder a una ruta protegida.
 * @requires react
 * @requires react-router-dom
 * @requires @fortawesome/react-fontawesome
 */
import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

/**
 * @function AuthRedirect
 * @description Muestra una pantalla de "Acceso Denegado" con un diseño profesional y consistente
 * con el resto de la aplicación, y proporciona un botón para navegar a la página de login.
 * @returns {JSX.Element}
 */
const AuthRedirect = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/auth/login");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full p-4 bg-background">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-sm w-full border border-gray-200 animate-fade-in">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            className="h-6 w-6 text-red-600"
          />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-gray-800">
          Acceso Denegado
        </h2>
        <p className="mb-6 text-gray-600">
          No tienes permiso para ver esta página o tu sesión ha expirado. Por
          favor, inicia sesión para continuar.
        </p>
        <button
          onClick={handleLoginClick}
          className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors duration-300"
        >
          Ir a Iniciar Sesión
        </button>
      </div>
    </div>
  );
};

export default AuthRedirect;
