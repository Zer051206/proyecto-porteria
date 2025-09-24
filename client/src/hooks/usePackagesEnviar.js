// src/hooks/usePackagesEnviar.js
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "../config/axios";
import {
  handleKeyTextDown,
  handleAddressKeyDown,
} from "../utils/inputUtilities";

const usePackagesEnviar = (navigate) => {
  const [tiposPaquetes, setTiposPaquetes] = useState([]);
  const [areas, setAreas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);
  const [error, setError] = useState(null);

  const handleClickClear = () => {
    formik.resetForm();
  };

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const [tiposRes, areasRes] = await Promise.all([
          api.get("http://localhost:3000/api/tipos-paquetes"),
          api.get("http://localhost:3000/api/areas"),
        ]);
        setTiposPaquetes(tiposRes.data);
        setAreas(areasRes.data);
      } catch (error) {
        setErrorCarga(
          "No se pudieron cargar las opciones. Intente recargar la página"
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchFormData();
  }, []);

  const validationSchema = Yup.object({
    id_tipo_paquete: Yup.number().required(
      "El tipo de paquete es obligatorio."
    ),
    nombre_remitente: Yup.string().required(
      "El nombre del remitente es obligatorio."
    ),
    id_area: Yup.number().required("El área es obligatoria."),
    guia: Yup.string().when("conGuia", {
      is: true,
      then: (schema) => schema.required("El número de guía es obligatorio."),
    }),
    empresa_transporte: Yup.string()
      .nullable()
      .max(100, "La empresa no puede exceder los 100 caracteres."),
    mensajero_nombre: Yup.string()
      .nullable()
      .max(255, "El nombre no puede exceder los 255 caracteres."),
    destino_salida: Yup.string()
      .required("El destino es obligatorio.")
      .nullable()
      .max(100, "El destino no puede exceder los 100 caracteres."),
    observaciones: Yup.string()
      .nullable()
      .max(500, "Las observaciones no pueden exceder los 500 caracteres."),
  });

  const formik = useFormik({
    initialValues: {
      id_tipo_paquete: "",
      tipo_operacion: "enviar",
      guia: "",
      nombre_remitente: "",
      id_area: "",
      destino_salida: "",
      empresa_transporte: "",
      mensajero_nombre: "",
      observaciones: "",
      conGuia: false, // Estado del checkbox
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await api.post("http://localhost:3000/paquetes/enviar", {
          ...values,
          guia: values.conGuia ? values.guia : null,
          destino_salida: values.destino_salida || null,
          empresa_transporte: values.empresa_transporte || null,
          mensajero_nombre: values.mensajero_nombre || null,
        });
        alert("✅ ¡Paquete enviado con éxito!");
        navigate("/dashboard");
      } catch (error) {
        const serverErrors = error.response?.data?.errors;
        if (serverErrors) {
          const formikErrors = {};
          serverErrors.forEach((e) => {
            if (e.path) {
              const path = e.path.split(".");
              // Mapeamos el error a la propiedad de Formik
              formikErrors[path[path.length - 1]] = e.message;
            }
          });
          // Usamos setErrors de Formik para los errores de campos específicos
          setErrors(formikErrors);
          setError(null); // Aseguramos que el error general esté vacío
        } else {
          // Si no hay errores de validación, mostramos el mensaje general del servidor
          setError(
            error.response?.data?.message || "Ha ocurrido un error inesperado."
          );
        }
      }
    },
  });

  return {
    formik,
    tiposPaquetes,
    areas,
    isLoading,
    errorCarga,
    handleClickClear,
    handleKeyTextDown,
    handleAddressKeyDown,
    error,
  };
};

export default usePackagesEnviar;
