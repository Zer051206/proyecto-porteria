/**
 * @file App.jsx
 * @module App
 * @description Componente raíz de la aplicación. Configura el enrutamiento, el proveedor de notificaciones (Toaster)
 * y ejecuta la verificación inicial de la sesión de autenticación.
 * @requires react
 * @requires react-router-dom
 * @requires react-hot-toast
 * @requires ./stores/authStore.js
 * @requires ./config/toastConfig.js
 */
import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AppRoutes } from "./routes/index.jsx";
import { useAuthStore } from "./stores/authStore.js";
import { toasterConfig } from "./config/toast.js";
import "./App.css";

/**
 * @function App
 * @description Componente funcional principal que encapsula toda la aplicación.
 * @returns {JSX.Element}
 */
function App() {
  // Obtenemos la acción para verificar el estado de la autenticación desde el store.
  const checkAuthStatus = useAuthStore((state) => state.checkAuthStatus);

  /**
   * @description useEffect que se ejecuta una sola vez al montar el componente.
   * Llama a `checkAuthStatus` para revalidar la sesión del usuario con el backend.
   */
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  return (
    <BrowserRouter>
      {/* Componente que renderizará todas las notificaciones toast en la aplicación */}
      <Toaster {...toasterConfig} />

      <main className="w-full min-h-screen flex flex-col justify-center items-center">
        <AppRoutes />
      </main>
    </BrowserRouter>
  );
}

export default App;
