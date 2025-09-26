/**
 * @file main.jsx
 * @module EntryPoint
 * @description Punto de entrada principal de la aplicación React.
 * Se encarga de importar las dependencias globales (CSS, configuración de Axios)
 * y de montar el componente raíz `<App />` en el DOM.
 * @requires react-dom/client
 */
import "./config/axios.js";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

/**
 * Monta el componente principal de la aplicación.
 * Busca el elemento raíz en el DOM con el ID 'root' y renderiza el componente App.
 */
createRoot(document.getElementById("root")).render(<App />);
