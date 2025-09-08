// src/routes/index.jsx
import { Routes, Route } from 'react-router-dom';
import { WelcomePage } from '../components/WelcomePage.jsx';
import { AuthRoutes } from './AuthRoutes.jsx';
import VisitEntryForm from '../components/visits/VisitEntryForm.jsx'
import Dashboard from '../components/Dashboard.jsx'
import DashboardPackage from '../components/packages/DashboardPackage.jsx';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/auth/*" element={<AuthRoutes />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/visitas/entrada" element={<VisitEntryForm />} />
      <Route path="/paquetes" element={<DashboardPackage />} />
    </Routes>
  );
}