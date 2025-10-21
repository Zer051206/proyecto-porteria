/**
 * @file index.jsx
 * @module Routes
 * @description Componente principal de enrutamiento que define todas las rutas de la aplicación.
 * @requires react-router-dom
 */
import { Routes, Route } from "react-router-dom";

// Componentes de Protección y Layout
import PrivateRoute from "../components/PrivateRoute.jsx";
import Layout from "../components/Layout.jsx";

// Componentes de Página (Públicas)
import { WelcomePage } from "../components/WelcomePage.jsx";
import { AuthRoutes } from "./AuthRoutes.jsx";
import AuthRedirect from "../components/AuthRedirect.jsx";

// Componentes de Página (Privadas)
import Dashboard from "../components/Dashboard.jsx";
import VisitEntryForm from "../components/visits/VisitEntryForm.jsx";
import DashboardPackage from "../components/packages/DashboardPackage.jsx";
import PackagesRecibirForm from "../components/packages/PackagesRecibirForm.jsx";
import PackagesEnviarForm from "../components/packages/PackagesEnviarForm.jsx";
import DashboardHistorial from "../components/historial/DashboardHistorial.jsx";
import VisitsHistorial from "../components/historial/VisitsHistorial.jsx";
import PackagesHistorial from "../components/historial/PackagesHistorial.jsx";

/**
 * @function AppRoutes
 * @description Define el árbol de rutas de la aplicación utilizando un patrón de rutas anidadas.
 * @returns {JSX.Element}
 */
export function AppRoutes() {
  return (
    <Routes>
      {/* --- 1. RUTAS PÚBLICAS --- */}
      <Route path="/" element={<WelcomePage />} />
      <Route path="/auth/*" element={<AuthRoutes />} />
      <Route path="/auth-denegado" element={<AuthRedirect />} />

      {/* --- 2. GRUPO DE RUTAS PRIVADAS --- */}
      {/* Todas las rutas anidadas dentro de este <Route> estarán protegidas por <PrivateRoute> */}
      <Route element={<PrivateRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/visitas/entrada" element={<VisitEntryForm />} />
          <Route path="/paquetes" element={<DashboardPackage />} />
          <Route path="/paquetes/recibir" element={<PackagesRecibirForm />} />
          <Route path="/paquetes/enviar" element={<PackagesEnviarForm />} />
          <Route path="/historial" element={<DashboardHistorial />} />
          <Route path="/historial/visitas" element={<VisitsHistorial />} />
          <Route path="/historial/paquetes" element={<PackagesHistorial />} />
        </Route>
      </Route>
    </Routes>
  );
}
