// ! client/src/axiosClient.js

import axios from "axios";

// * Crea una instancia de Axios con una configuración base
const axiosClient = axios.create({
  // * La URL base de la API (puerto de ejecución
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",

  // * Encabezados comunes que la API pueda necesitar
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosClient;
