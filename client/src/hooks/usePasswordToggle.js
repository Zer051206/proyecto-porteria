import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

export const usePasswordToggle = () => {
  const [ showPassword, setShowPassword ] = useState(false);

  const toggleVisibility = () => {
    setShowPassword(!showPassword);
  };

  const Icon = showPassword ? FaRegEyeSlash : FaRegEye;
  const inputType = showPassword ? 'text' : 'password';

  return [ inputType, Icon, toggleVisibility ];
}