/**
 * @file usePasswordToggle.js
 * @module Hooks/Utils
 * @description Hook personalizado para gestionar la visibilidad de la contraseña en campos de entrada.
 * Alterna el tipo de input entre 'password' y 'text' y el icono de visibilidad.
 * @requires react
 * @requires @fortawesome/react-fontawesome
 * @requires @fortawesome/free-solid-svg-icons
 */
import { useState } from "react";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

/**
 * @function usePasswordToggle
 * @description Proporciona el estado y las funciones para alternar la visibilidad de dos campos de contraseña.
 * @returns {Array} Un array que contiene los elementos para dos campos de contraseña.
 */
export const usePasswordToggle = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const toggleVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleVisibilityConfirm = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  /**
   * @const {React.Component} Icon
   * @description Componente de icono para el primer campo de contraseña.
   */
  const Icon = showPassword ? faEyeSlash : faEye;

  /**
   * @const {React.Component} IconConfirm
   * @description Componente de icono para el segundo campo de contraseña.
   */
  const IconConfirm = showConfirmPassword ? faEyeSlash : faEye;

  const inputType = showPassword ? "text" : "password";
  const inputTypeConfirm = showConfirmPassword ? "text" : "password";

  return [
    inputType,
    Icon,
    toggleVisibility,
    inputTypeConfirm,
    IconConfirm,
    toggleVisibilityConfirm,
  ];
};
