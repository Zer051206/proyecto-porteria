/**
 * @file AuthRoutes.jsx
 * @module AuthRoutes
 * @description Componente funcional que define las rutas para la sección de autenticación (registro y login).
 * Utiliza lazy loading y Suspense para la carga dinámica de componentes.
 * @requires react
 * @requires react-router-dom
 */
import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

// Carga perezosa (lazy loading) de los componentes de autenticación
const RegisterForm = lazy(() => import("../components/auth/RegisterForm.jsx"));
const LoginForm = lazy(() => import("../components/auth/LoginForm.jsx"));

/**
 * @function AuthRoutes
 * @description Componente de enrutamiento que agrupa las rutas de autenticación.
 * Envuelve las rutas en Suspense para manejar el estado de carga mientras los componentes
 * RegisterForm y LoginForm se cargan dinámicamente.
 * @returns {JSX.Element} Un elemento JSX que define las rutas anidadas.
 */
export function AuthRoutes() {
  return (
    <Suspense
      fallback={
        <div className="text-xl text-black bg-white rounded-2xl px-6 py-4">
          Cargando...
        </div>
      }
    >
      <Routes>
        {/* Ruta para el formulario de registro */}
        <Route path="register" element={<RegisterForm />} />
        {/* Ruta para el formulario de inicio de sesión */}
        <Route path="login" element={<LoginForm />} />
      </Routes>
    </Suspense>
  );
}
