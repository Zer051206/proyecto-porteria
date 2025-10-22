/**
 * @file AuthRoutes.jsx
 * @module Routes
 * @description Componente que define las rutas para la sección de autenticación (registro y login).
 * Utiliza lazy loading y Suspense para la carga dinámica de componentes.
 * @requires react
 * @requires react-router-dom
 */
import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

// 1. Importamos los esqueletos de forma ESTÁTICA.
// Son componentes pequeños y los necesitamos de inmediato para el 'fallback'.
import { LoginFormSkeleton } from "../components/auth/LoginForm.jsx";
import { RegisterFormSkeleton } from "../components/auth/RegisterForm.jsx";

// 2. Importamos los componentes "pesados" de forma PEREZOSA (lazy).
const RegisterForm = lazy(() => import("../components/auth/RegisterForm.jsx"));
const LoginForm = lazy(() => import("../components/auth/LoginForm.jsx"));

/**
 * @function AuthRoutes
 * @description Agrupa las rutas de autenticación, usando Suspense individual
 * para mostrar el esqueleto de carga correcto para cada ruta.
 * @returns {JSX.Element}
 */
export function AuthRoutes() {
  return (
    <Routes>
      <Route
        path="register"
        element={
          <Suspense fallback={<RegisterFormSkeleton />}>
            <RegisterForm />
          </Suspense>
        }
      />
      <Route
        path="login"
        element={
          <Suspense fallback={<LoginFormSkeleton />}>
            <LoginForm />
          </Suspense>
        }
      />
    </Routes>
  );
}
