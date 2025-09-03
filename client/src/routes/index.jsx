// src/routes/index.jsx
import { Routes, Route } from 'react-router-dom';
import { WelcomePage } from '../components/WelcomePage.jsx';
import { AuthRoutes } from './AuthRoutes.jsx';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/auth/*" element={<AuthRoutes />} />
    </Routes>
  );
}