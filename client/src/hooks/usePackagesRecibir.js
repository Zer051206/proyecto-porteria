// src/hooks/useRecibirPaqueteForm.js

import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const usePackagesRecibir = (navigate) => {
  const [tiposPaquetes, setTiposPaquetes] = useState([]);
  const [areas, setAreas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const [tiposRes, areasRes] = await Promise.all([
          axios.get('http://localhost:3000/api/tipos-paquetes'),
          axios.get('http://localhost:3000/api/areas')
        ]);
        setTiposPaquetes(tiposRes.data);
        setAreas(areasRes.data);
      } catch (error) {
        console.error('Error al cargar datos del formulario:', error);
        setErrorCarga('No se pudieron cargar las opciones. intente recargar la página.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchFormData();
  }, []);

  const validationSchema = Yup.object({
    id_tipo_paquete: Yup.number().required('El tipo de paquete es obligatorio.'),
    nombre_destinatario: Yup.string().required('El nombre del destinatario es obligatorio.'),
    id_area: Yup.number().required('El área es obligatoria.'),
    guia: Yup.string().when('conGuia', {
      is: true,
      then: (schema) => schema.required('El número de guía es obligatorio.')
    }),
    empresa_transporte: Yup.string().nullable().max(100, 'La empresa no puede exceder los 100 caracteres.'),
    mensajero_nombre: Yup.string().nullable().max(255, 'El nombre no puede exceder los 255 caracteres.'),
    observaciones: Yup.string().nullable().max(500, 'Las observaciones no pueden exceder los 500 caracteres.')
  });

  const formik = useFormik({
    initialValues: {
      id_tipo_paquete: '',
      tipo_operacion: 'recibir',
      guia: '',
      nombre_residente: '',
      id_area: '',
      empresa_transporte: '',
      mensajero_nombre: '',
      observaciones: '',
      conGuia: false, 
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await axios.post('http://localhost:3000/paquetes/recibir', {
          ...values,
          // Envía null si el checkbox no está marcado
          guia: values.conGuia ? values.guia : null,
          empresa_transporte: values.empresa_transporte || null,
          mensajero_nombre: values.mensajero_nombre || null,
        });
        alert('✅ ¡Paquete recibido con éxito!');
        navigate('/dashboard');
      } catch (err) {
        alert('❌ Error al regitrar el paquete.');
      }
    }
  });

  return { formik, tiposPaquetes, areas, isLoading, errorCarga };
};

export default usePackagesRecibir;