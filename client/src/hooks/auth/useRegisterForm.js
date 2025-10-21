/**
 * @file useRegisterForm.js
 * @module Hooks/Auth
 * @description Hook que encapsula la lógica del formulario de registro, integrando Formik y Yup.
 * @requires formik
 * @requires yup
 * @requires react-router-dom
 * @requires ../../config/axios.js
 * @requires react-hot-toast
 */
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import api from "../../config/axios.js";
import { toast } from "react-hot-toast";

/**
 * @const {Yup.ObjectSchema} validationSchema
 * @description Define el esquema de validación para los campos del formulario de registro.
 */
const validationSchema = Yup.object({
  nombre: Yup.string()
    .required("El nombre es obligatorio.")
    .min(2, "Debe tener al menos 2 caracteres."),
  apellido: Yup.string()
    .required("El apellido es obligatorio.")
    .min(2, "Debe tener al menos 2 caracteres."),
  correo: Yup.string()
    .email("El formato del correo no es válido.")
    .required("El correo es obligatorio."),
  password: Yup.string()
    .min(8, "La contraseña debe tener al menos 8 caracteres.")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Debe contener mayúscula, minúscula y número."
    )
    .required("La contraseña es obligatoria."),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Las contraseñas deben coincidir.")
    .required("Debes confirmar la contraseña."),
});

/**
 * @function useRegisterForm
 * @description Proporciona la lógica y el estado para el RegisterForm.
 * @returns {object} La instancia de Formik.
 */
export const useRegisterForm = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      nombre: "",
      apellido: "",
      correo: "",
      password: "",
      confirmPassword: "", // Nuevo campo añadido
    },
    validationSchema,
    onSubmit: async (values, { setFieldError, setSubmitting, resetForm }) => {
      try {
        // Excluimos 'confirmPassword' antes de enviar a la API
        const { confirmPassword, ...dataToSend } = values;
        await api.post("/auth/register", dataToSend);

        toast.success(
          "¡Usuario creado exitosamente! Ahora puedes iniciar sesión."
        );
        resetForm();
        navigate("/auth/login");
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          "Error al registrarse. Por favor, inténtalo de nuevo.";
        setFieldError("apiError", errorMessage);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return formik;
};
