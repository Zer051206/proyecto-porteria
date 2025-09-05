import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import VisitSchema from '../../schemas/visitSchemas.js'

export default function VisitEntryForm() {
  const navigate = useNavigate();

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
    },
    validationSchema: VisitSchema,
    onSubmit: (values) => {
      console.log(values)
      // ! Lógica para enviar los datos al backend.
      alert('visita registrada con éxito');
      navigate('');
    },
  });

  return (
    <div className="flex flex-col items-center min-h-screen w-full p-4">
      <form onSubmit={formik.handleSubmit} className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-900">Registro de Visita</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          
          {/* Sección de Datos del Visitante */}
          <div className="col-span-1">
            <fieldset className="p-4 rounded-md border border-gray-200 h-full">
              <legend className="px-2 font-semibold text-blue-900">Información del Visitante</legend>
              <div className="space-y-4 pt-2">
                <label className="block">
                  <span className="text-gray-700 text-sm font-medium">Nombre completo:</span>
                  <input 
                    type="text"
                    name="nombre_visitante"
                    value={formik.values.nombre_visitante}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="mt-1 block w-full rounded-md border-2 border-gray-400 bg-gray-50 shadow-lg"
                  />
                  {formik.touched.nombre_visitante && formik.errors.nombre_visitante && (
                    <div className="text-red-500 text-xs mt-1">{formik.errors.nombre_visitante}</div>
                  )}
                </label>
                
                <label className="block">
                  <span className="text-gray-700 text-sm font-medium">Teléfono:</span>
                  <input 
                    type="tel"
                    name="telefono"
                    value={formik.values.telefono}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="mt-1 block w-full rounded-md border-2 border-gray-400 bg-gray-50 shadow-lg"
                  />
                  {formik.touched.telefono && formik.errors.telefono && (
                    <div className="text-red-500 text-xs mt-1">{formik.errors.telefono}</div>
                  )}
                </label>
                <label className="block">
                  <span className="text-gray-700 text-sm font-medium">Empresa:</span>
                  <input 
                    type="text"
                    name="empresa"
                    value={formik.values.empresa}
                    onChange={formik.handleChange}
                    className="mt-1 block w-full rounded-md border-2 border-gray-400 bg-gray-50 shadow-lg"
                  />
                </label>
              </div>
            </fieldset>
          </div>
          
          {/* Sección de Datos de la Visita */}
          <div className="col-span-1">
            <fieldset className="p-4 rounded-md border border-gray-200 h-full">
              <legend className="px-2 font-semibold text-blue-900">Datos de la Visita</legend>
              <div className="space-y-4 pt-2">
                <label className="block">
                  <span className="text-gray-700 text-sm font-medium">Tipo de Identificación:</span>
                  <select
                    name="id_tipo_identificacion"
                    value={formik.values.id_tipo_identificacion}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="mt-1 block w-full rounded-md border-2 border-gray-400 bg-gray-50 shadow-lg"
                  >
                    <option disabled hidden value="">Seleccione un tipo</option>
                    {/* Placeholder para los datos */}
                    <option value=""></option>
                  </select>
                  {formik.touched.id_tipo_identificacion && formik.errors.id_tipo_identificacion && (
                    <div className="text-red-500 text-xs mt-1">{formik.errors.id_tipo_identificacion}</div>
                  )}
                </label>
                <label className="block">
                  <span className="text-gray-700 text-sm font-medium">Número de Identificación:</span>
                  <input 
                    type="text"
                    name="identificacion"
                    value={formik.values.identificacion}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="mt-1 block w-full rounded-md border-2 border-gray-400 bg-gray-50 shadow-lg"
                  />
                  {formik.touched.identificacion && formik.errors.identificacion && (
                    <div className="text-red-500 text-xs mt-1">{formik.errors.identificacion}</div>
                  )}
                </label>
                <label className="block">
                  <span className="text-gray-700 text-sm font-medium">Destinatario:</span>
                  <input 
                    type="text"
                    name="nombre_destinatario"
                    value={formik.values.nombre_destinatario}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="mt-1 block w-full rounded-md border-2 border-gray-400 bg-gray-50 shadow-lg"
                  />
                  {formik.touched.nombre_destinatario && formik.errors.nombre_destinatario && (
                    <div className="text-red-500 text-xs mt-1">{formik.errors.nombre_destinatario}</div>
                  )}
                </label>
                <label className="block">
                  <span className="text-gray-700 text-sm font-medium">Área de destino:</span>
                  <select
                    name="id_area"
                    value={formik.values.id_area}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="mt-1 block w-full rounded-md border-2 border-gray-400 bg-gray-50 shadow-lg"
                  >
                    <option disabled hidden value="">Seleccione un área</option>
                    {/* Placeholder para los datos */}
                    <option value=""></option>
                  </select>
                  {formik.touched.id_area && formik.errors.id_area && (
                    <div className="text-red-500 text-xs mt-1">{formik.errors.id_area}</div>
                  )}
                </label>
              </div>
            </fieldset>
          </div>
          
          {/* Campo de Observaciones (se extiende en toda la fila) */}
          <div className="col-span-1 md:col-span-2">
            <fieldset className="p-4 rounded-md border border-gray-200">
              <legend className="px-2 font-semibold text-blue-900">Observaciones</legend>
              <textarea
                name="observaciones"
                value={formik.values.observaciones}
                onChange={formik.handleChange}
                className="mt-1 block w-full rounded-md border-2 border-gray-400 bg-gray-50 shadow-lg"
                rows="3"
              />
            </fieldset>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="mt-6 flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex items-center bg-red-600 text-white font-bold py-2 px-6 rounded-md hover:bg-red-700 transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} className="mr-2 text-xl" />
            Cancelar
          </button>
          <button
            type="submit"
            className="flex items-center bg-blue-600 text-white font-bold py-2 px-6 rounded-md hover:bg-blue-700 transition-colors"
          >
            <FontAwesomeIcon icon={faCheckCircle} className="mr-2 text-xl" />
            Realizar Visita
          </button>
        </div>

      </form>
    </div>
  );
}