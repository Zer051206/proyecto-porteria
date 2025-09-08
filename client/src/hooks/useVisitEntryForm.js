// ^ src/hooks/useVisitEntryForm.js

import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import VisitSchema from '../schemas/visitSchema.js';

const useVisitEntryForm = () => {
    const navigate = useNavigate();

    // Estado para los datos de los selects
    const [areas, setAreas] = useState([]);
    const [tiposIdentificacion, setTiposIdentificacion] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorCarga, setErrorCarga] = useState(null);

    // Lógica para obtener los datos al cargar el componente
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Peticiones concurrentes para optimizar el tiempo de carga
                const [areasRes, tiposIdRes] = await Promise.all([
                    axios.get('http://localhost:3000/api/areas'),
                    axios.get('http://localhost:3000/api/tipos-identificacion')
                ]);
                
                setAreas(areasRes.data);
                setTiposIdentificacion(tiposIdRes.data);
                
            } catch (err) {
                console.error('Error al obtener las opciones del formulario:', err);
                setErrorCarga('Hubo un error al cargar las opciones. Por favor, intente recargar la página.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // Lógica de Formik y la función de envío
    const formik = useFormik({
        initialValues: {
            nombre_visitante: '',
            telefono: '',
            identificacion: '',
            id_tipo_identificacion: '',
            empresa: '',
            nombre_destinatario: '',
            id_area: '',
            observaciones: '',
            apellido: '',
            motivo: '',
        },
        validationSchema: VisitSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const response = await axios.post('http://localhost:3001/visitas/entrada', values);
                alert('✅ ¡Visita registrada con éxito!');
                navigate('/dashboard');
            } catch (error) {
                let errorMessage = '¡Ocurrió un error inesperado!';
                if (error.response) {
                    if (error.response.status === 409) {
                        errorMessage = `⚠️ ${error.response.data.message}`;
                    } else if (error.response.data.errors) {
                        const validationErrors = error.response.data.errors.map(err => err.message).join('\n');
                        errorMessage = `❌ Errores en el formulario:\n${validationErrors}`;
                    } else {
                        errorMessage = `❌ Error: ${error.response.data.message || 'No se pudo registrar la visita.'}`;
                    }
                } else if (error.request) {
                    errorMessage = '❌ No se pudo conectar con el servidor. Por favor, revise su conexión a internet.';
                }
                alert(errorMessage);
                console.error('Error de envío:', error);
            } finally {
                setSubmitting(false);
            }
        },
    });

    // Retorna todos los valores y funciones necesarios para el componente
    return {
        formik,
        areas,
        tiposIdentificacion,
        isLoading,
        errorCarga
    };
};

export default useVisitEntryForm;