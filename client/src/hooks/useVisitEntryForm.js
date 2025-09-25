import { useState, useEffect, useRef } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import VisitSchema from "../schemas/visitSchema.js";
import api from "../config/axios.js";
import {
  handleKeyNumberDown,
  handleKeyTextDown,
} from "../utils/inputUtilities";

const useVisitEntryForm = () => {
  const navigate = useNavigate();
  const [areas, setAreas] = useState([]);
  const [error, setError] = useState(null);
  const [tiposIdentificacion, setTiposIdentificacion] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);

  const sigCanvas = useRef({}); // Referencia para el componente SignaturePad

  const clearSignature = () => sigCanvas.current.clear(); // Función para limpiar el lienzo

  const handleClickClear = () => {
    formik.resetForm();
    clearSignature(); // Limpia la firma al resetear el formulario
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Usando rutas relativas (Axios usa la baseURL de tu .env)
        const [areasRes, tiposIdRes] = await Promise.all([
          api.get("/api/areas"),
          api.get("/api/tipos-identificacion"),
        ]);
        setAreas(areasRes.data);
        setTiposIdentificacion(tiposIdRes.data);
      } catch (err) {
        setErrorCarga(
          "Hubo un error al cargar las opciones. Por favor, intente recargar la página."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const formik = useFormik({
    initialValues: {
      nombre_visitante: "",
      telefono: "",
      identificacion: "",
      id_tipo_identificacion: "",
      empresa: "",
      nombre_destinatario: "",
      id_area: "",
      observaciones: "",
      apellido: "",
      motivo: "",
    },

    validationSchema: VisitSchema,

    onSubmit: async (values, { setSubmitting, setErrors }) => {
      if (sigCanvas.current.isEmpty()) {
        setError(
          "La firma es obligatoria para confirmar la visita y el consentimiento de datos."
        );
        setSubmitting(false);
        return;
      }

      // Captura el dibujo como Base64 (formato PNG)
      const signatureDataUrl = sigCanvas.current
        .getTrimmedCanvas()
        .toDataURL("image/png");

      try {
        // ENVIAR DATOS (incluyendo la firma)
        await api.post("/visitas/entrada", {
          ...values,
          firma_base64: signatureDataUrl,
        });

        formik.resetForm();
        clearSignature(); // Limpia la firma al tener éxito
        alert("✅ ¡La visita se ha registrado exitósamente!");
        navigate("/dashboard");
      } catch (error) {
        const serverErrors = error.response?.data?.errors;
        if (serverErrors) {
          const formikErrors = {};
          serverErrors.forEach((e) => {
            if (e.path) {
              const path = e.path.split(".");
              formikErrors[path[path.length - 1]] = e.message;
            }
          });
          setErrors(formikErrors);
          setError(null);
        } else {
          setError(
            error.response?.data?.message || "Ha ocurrido un error inesperado."
          );
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  return {
    formik,
    areas,
    tiposIdentificacion,
    isLoading,
    errorCarga,
    handleClickClear,
    handleKeyNumberDown,
    handleKeyTextDown,
    error,
    sigCanvas, // <-- Exportamos la referencia para el componente
  };
};

export default useVisitEntryForm;
