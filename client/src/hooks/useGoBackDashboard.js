/**
 * @file useGoBackDashboard.js
 * @module Hooks
 * @description Hook de utilidad para la navegación programática. Proporciona una función
 * para redirigir al usuario a la página principal del dashboard.
 * @requires react-router-dom/useNavigate
 */
import { useNavigate } from "react-router-dom";

/**
 * @function useGoBack
 * @description Proporciona la función de navegación `goBack` que dirige a la ruta del dashboard.
 *
 * @param {string} [path='/dashboard'] - La ruta de destino a la que se debe navegar.
 * El valor por defecto es la ruta del dashboard ('/dashboard').
 * @returns {Function} La función `goBack`, que ejecuta la navegación al `path` especificado.
 */
export const useGoBackDashboard = (path = "/dashboard") => {
  /**
   * @const {Function} navigate
   * @description Función de React Router para la navegación.
   */
  const navigate = useNavigate();

  /**
   * @function goBack
   * @description Navega al usuario a la ruta del dashboard o la ruta especificada.
   * @returns {void}
   */
  const goBack = () => {
    navigate(path);
  };

  return goBack;
};
