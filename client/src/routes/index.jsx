// src/routes/index.jsx
import { Routes, Route } from 'react-router-dom';
import { WelcomePage } from '../components/WelcomePage.jsx';
import { AuthRoutes } from './AuthRoutes.jsx';
import PrivateRoute from '../components/PrivateRoute.jsx';
import VisitEntryForm from '../components/visits/VisitEntryForm.jsx'
import Dashboard from '../components/Dashboard.jsx'
import DashboardPackage from '../components/packages/DashboardPackage.jsx';
import PackagesRecibirForm from '../components/packages/PackagesRecibirForm.jsx'; 
import PackagesEnviarForm from '../components/packages/PackagesEnviarForm.jsx';
import DashboardHistorial from '../components/historial/DashboardHistorial.jsx'
import VisitsHistorial from '../components/historial/VisitsHistorial.jsx'
import PackagesHistorial from '../components/historial/PackagesHistorial.jsx'

export function AppRoutes() {
  return (
    <Routes>
      { /* Rutas Públicas */ }
      <Route path="/" element={<WelcomePage />} />
      <Route path="/auth/*" element={<AuthRoutes />} />

      { /* Rutas Privadas */ }
      <Route 
        path="/dashboard" 
        element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
        } 
      />
      <Route 
        path="/visitas/entrada" 
        element={
        <PrivateRoute>
          <VisitEntryForm />
        </PrivateRoute>
        } 
      />
      <Route 
        path="/paquetes" 
        element={
        <PrivateRoute>
          <DashboardPackage />
        </PrivateRoute> 
        } 
      />
      <Route 
        path="/paquetes/recibir" 
        element={
          <PrivateRoute>
            <PackagesRecibirForm />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/paquetes/enviar" 
        element={
          <PrivateRoute>
            <PackagesEnviarForm />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/historial"
        element={
          <PrivateRoute>
            <DashboardHistorial />
          </PrivateRoute>
        }
      />

      <Route 
        path="/historial/visitas"
        element={
          <PrivateRoute>
            <VisitsHistorial />
          </PrivateRoute>
        }
      />
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
};