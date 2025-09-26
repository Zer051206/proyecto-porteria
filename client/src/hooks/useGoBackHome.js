/**
 * @file useGoBackHome.js
 * @module Hooks
 * @description Hook de utilidad para la navegación programática. Proporciona una función
 * para redirigir al usuario a la página de inicio o a la ruta raíz ('/').
 * @requires react-router-dom/useNavigate
 */
import { useNavigate } from "react-router-dom";

/**
 * @function useGoBackHome
 * @description Proporciona la función de navegación `goBack` que dirige a la ruta de inicio.
 *
 * @param {string} [path='/'] - La ruta de destino a la que se debe navegar.
 * El valor por defecto es la ruta raíz ('/').
 * @returns {Function} La función `goBack`, que ejecuta la navegación al `path` especificado.
 */
export const useGoBackHome = (path = "/") => {
  /**
   * @const {Function} navigate
   * @description Función de React Router para la navegación.
   */
  const navigate = useNavigate();

  /**
   * @function goBack
   * @description Navega al usuario a la ruta de inicio o la ruta especificada.
   * @returns {void}
   */
  const goBack = () => {
    navigate(path);
  };

  return goBack;
};
