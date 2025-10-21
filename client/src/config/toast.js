/**
 * @file toast.js
 * @module Config
 * @description Configuración centralizada para la librería react-hot-toast.
 * Define la posición y los estilos por defecto para los diferentes tipos de notificaciones.
 */

export const toasterConfig = {
  position: "bottom-center",
  toastOptions: {
    duration: 5000,
    success: {
      style: {
        background: "#E6F4EA", // Verde claro
        color: "#1A202C", // Texto oscuro
        border: "1px solid #38A169", // Verde primario
      },
      iconTheme: {
        primary: "#38A169",
        secondary: "white",
      },
    },
    error: {
      style: {
        background: "#FFF5F5", // Rojo claro
        color: "#1A202C",
        border: "1px solid #E53E3E", // Rojo de error
      },
      iconTheme: {
        primary: "#E53E3E",
        secondary: "white",
      },
    },
  },
};
