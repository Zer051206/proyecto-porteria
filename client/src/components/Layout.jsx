/**
 * @file Layout.jsx
 * @module Components
 * @description Componente de layout persistente para las rutas privadas.
 * Proporciona una estructura visual consistente con una cabecera que incluye
 * el nombre del usuario y el botón para cerrar sesión.
 * @requires react
 * @requires react-router-dom
 * @requires ../stores/authStore.js
 */
import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

const Header = ({ user, onLogout }) => (
  <header className="w-full max-w-5xl py-4 flex justify-between items-center border-b border-gray-200 mb-8">
    <div className="text-left font-semibold">
      <h2 className="text-gray-800 text-xl">
        Bienvenido,{" "}
        <span className="font-bold text-blue-600">
          {user?.nombre || "Usuario"}
        </span>
      </h2>
      <p className="text-gray-500 text-sm">Rol: {user?.rol}</p>
    </div>
    <button
      onClick={onLogout}
      className="bg-error hover:bg-error-hover text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
    >
      <FontAwesomeIcon icon={faSignOutAlt} />
      <span className="hidden sm:inline">Cerrar Sesión</span>
    </button>
  </header>
);

export default function Layout() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    navigate("/"); // Redirige a la página de bienvenida tras cerrar sesión
  };

  return (
    <div className="w-full min-h-screen bg-background flex flex-col items-center px-4">
      <Header user={user} onLogout={handleLogout} />
      <div className="w-full max-w-5xl">
        {/* El componente <Outlet> renderiza aquí la ruta hija actual (ej. Dashboard, VisitEntryForm, etc.) */}
        <Outlet />
      </div>
    </div>
  );
}
