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
import LoginForm, { LoginFormSkeleton } from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";

/**
 * @function AuthRoutes
 * @description Agrupa las rutas de autenticación, usando Suspense para mostrar un esqueleto de carga.
 * @returns {JSX.Element}
 */
export function AuthRoutes() {
  return (
    <Suspense fallback={<LoginFormSkeleton />}>
      <Routes>
        <Route path="register" element={<RegisterForm />} />
        <Route path="login" element={<LoginForm />} />
      </Routes>
    </Suspense>
  );
}
