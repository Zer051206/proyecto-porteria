/**
 * @file index.jsx
 * @module AppRoutes
 * @description Componente principal de enrutamiento que define todas las rutas de la aplicación.
 * Utiliza el componente <PrivateRoute> para proteger las rutas que requieren autenticación.
 * @requires react-router-dom
 */
import { Routes, Route } from "react-router-dom";

// Importaciones de componentes
import { WelcomePage } from "../components/WelcomePage.jsx";
import { AuthRoutes } from "./AuthRoutes.jsx";
import PrivateRoute from "../components/PrivateRoute.jsx";
import VisitEntryForm from "../components/visits/VisitEntryForm.jsx";
import Dashboard from "../components/Dashboard.jsx";
import DashboardPackage from "../components/packages/DashboardPackage.jsx";
import PackagesRecibirForm from "../components/packages/PackagesRecibirForm.jsx";
import PackagesEnviarForm from "../components/packages/PackagesEnviarForm.jsx";
import DashboardHistorial from "../components/historial/DashboardHistorial.jsx";
import VisitsHistorial from "../components/historial/VisitsHistorial.jsx";
import PackagesHistorial from "../components/historial/PackagesHistorial.jsx";
import AuthRedirect from "../components/AuthRedirect.jsx";

/**
 * @function AppRoutes
 * @description Componente funcional que define todas las rutas públicas y privadas de la aplicación.
 * @returns {JSX.Element} El elemento JSX que contiene todas las definiciones de <Route>.
 */
export function AppRoutes() {
  return (
    <Routes>
      {/* ==================================== */}
      {/* Rutas Públicas              */}
      {/* ==================================== */}

      {/* Ruta de inicio/bienvenida */}
      <Route path="/" element={<WelcomePage />} />

      {/* Rutas de Autenticación (Login, Register) - Rutas anidadas */}
      <Route path="/auth/*" element={<AuthRoutes />} />

      {/* Ruta de redirección para errores de autenticación (ej: token de refresco fallido) */}
      <Route path="/auth-denegado" element={<AuthRedirect />} />

      {/* ==================================== */}
      {/* Rutas Privadas              */}
      {/* ==================================== */}

      {/* Dashboard principal */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

      {/* Formulario de registro de entrada de visitas */}
      <Route
        path="/visitas/entrada"
        element={
          <PrivateRoute>
            <VisitEntryForm />
          </PrivateRoute>
        }
      />

      {/* Dashboard de gestión de paquetes */}
      <Route
        path="/paquetes"
        element={
          <PrivateRoute>
            <DashboardPackage />
          </PrivateRoute>
        }
      />

      {/* Formulario para registrar la recepción de paquetes */}
      <Route
        path="/paquetes/recibir"
        element={
          <PrivateRoute>
            <PackagesRecibirForm />
          </PrivateRoute>
        }
      />

      {/* Formulario para registrar el envío/entrega de paquetes */}
      <Route
        path="/paquetes/enviar"
        element={
          <PrivateRoute>
            <PackagesEnviarForm />
          </PrivateRoute>
        }
      />

      {/* Dashboard principal de Historial */}
      <Route
        path="/historial"
        element={
          <PrivateRoute>
            <DashboardHistorial />
          </PrivateRoute>
        }
      />

      {/* Historial detallado de Visitas */}
      <Route
        path="/historial/visitas"
        element={
          <PrivateRoute>
            <VisitsHistorial />
          </PrivateRoute>
        }
      />

      {/* Historial detallado de Paquetes */}
      <Route
        path="/historial/paquetes"
        element={
          <PrivateRoute>
            <PackagesHistorial />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
