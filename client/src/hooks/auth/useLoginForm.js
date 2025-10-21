/**
 * @file useLoginForm.js
 * @module Hooks/Auth
 * @description Hook que encapsula la lógica del formulario de inicio de sesión, integrándose con Formik, Yup y el authStore.
 * @requires formik
 * @requires yup
 * @requires react-router-dom
 * @requires ../../config/axios.js
 * @requires ../../stores/authStore.js
 */
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import api from "../../config/axios.js";
import { useAuthStore } from "../../stores/authStore.js";

/**
 * @const {Yup.ObjectSchema} validationSchema
 * @description Define el esquema de validación para los campos del formulario de login.
 */
const validationSchema = Yup.object({
  correo: Yup.string()
    .email("El formato del correo no es válido.")
    .required("El correo es obligatorio."),
  password: Yup.string()
    .min(6, "La contraseña debe tener al menos 6 caracteres.")
    .required("La contraseña es obligatoria."),
});

/**
 * @function useLoginForm
 * @description Proporciona la lógica y el estado para el LoginForm.
 * @returns {object} La instancia de Formik.
 */
export const useLoginForm = () => {
  const navigate = useNavigate();
  // Obtenemos la acción 'login' de nuestro store global.
  const loginAction = useAuthStore((state) => state.login);

  const formik = useFormik({
    initialValues: {
      correo: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values, { setFieldError, setSubmitting }) => {
      try {
        const response = await api.post("/auth/login", values);

        // Al tener éxito, llamamos a la acción del store para actualizar el estado global
        // y guardar los tokens en localStorage.
        loginAction(
          response.data.user,
          response.data.accessToken,
          response.data.refreshToken
        );

        // Una vez actualizado el estado, navegamos al dashboard.
        navigate("/dashboard");
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Ha ocurrido un error inesperado.";
        setFieldError("apiError", errorMessage);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return formik;
};
