/**
 * @file App.jsx
 * @module App
 * @description Componente raíz de la aplicación. Configura el contexto de enrutamiento (BrowserRouter)
 * y define la estructura principal de la página, donde se renderizan todas las rutas.
 * @requires react-router-dom
 */
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes/index.jsx";
import "./App.css";

/**
 * @function App
 * @description Componente funcional principal que encapsula toda la aplicación.
 * Proporciona el contexto de enrutamiento y un contenedor principal (`<main>`)
 * centrado vertical y horizontalmente.
 * @returns {JSX.Element} El elemento JSX que contiene el enrutador y el layout principal.
 */
function App() {
  return (
    <BrowserRouter>
      <main className="w-full min-h-screen flex flex-col justify-center items-center">
        {/* Renderiza todas las rutas de la aplicación */}
        <AppRoutes />
      </main>
    </BrowserRouter>
  );
}

export default App;
