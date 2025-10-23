/**
 * @file PrivateRoute.jsx
 * @module Components
 * @description Componente de "guardia de ruta" que protege el acceso a las rutas privadas.
 * Se integra con el store global de Zustand para leer el estado de autenticación.
 * @requires react
 * @requires react-router-dom
 * @requires ../stores/authStore.js
 */
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../stores/authStore.js";

/**
 * @function PrivateRoute
 * @description Componente que envuelve las rutas privadas. Su comportamiento es:
 * 1. Muestra un indicador de carga mientras se verifica la sesión inicial.
 * 2. Si el usuario no está autenticado, lo redirige a la página de acceso denegado.
 * 3. Si el usuario está autenticado, renderiza los componentes hijos (la página protegida).
 * @param {object} props - Propiedades del componente.
 * @param {React.ReactNode} props.children - El componente a renderizar si la autenticación es exitosa.
 * @returns {JSX.Element}
 */
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth-denegado" replace />;
  }

  // Si se pasan 'children', se renderizan. De lo contrario, se usa <Outlet /> para rutas anidadas.
  return children ? children : <Outlet />;
};

export default PrivateRoute;
