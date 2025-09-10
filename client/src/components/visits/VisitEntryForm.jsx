// src/pages/VisitEntryForm.jsx 
import React from 'react';
import useVisitEntryForm from '../../hooks/useVisitEntryForm';
import { useGoBack } from '../../hooks/useGoBackDashboard.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCheckCircle, faSignOutAlt, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

export default function VisitEntryForm() {
  const { formik, areas, tiposIdentificacion, isLoading, errorCarga } = useVisitEntryForm();
  const goBack = useGoBack();

  return (
    <div className="flex flex-col items-center min-h-screen w-full p-4">
      <button
        type="button" 
        onClick={goBack}
        className="
          absolute top-1 right-4 
          bg-red-600 hover:bg-red-700 
          text-white font-bold 
          p-4 rounded-lg 
          flex flex-col items-center justify-center 
          transition-colors duration-300
          text-sm w-16 h-16 sm:w-20 sm:h-20
        "
      >
        <FontAwesomeIcon icon={faSignOutAlt} className="text-xl sm:text-xl" />
        <span className="text-xs sm:text-sm mt-1">Volver</span>
      </button>
      <form onSubmit={formik.handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-2xl w-full max-w-2xl mt-[70px]">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-500">Registro de Visita</h2>

        {isLoading && (
          <div className="text-center text-gray-500 my-4">Cargando opciones...</div>
        )}

        {errorCarga && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 my-4" role="alert">
            <div className="flex items-center">
              <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2 text-xl" />
              <p className="font-bold">Error de Carga</p>
            </div>
            <p className="mt-1">{errorCarga}</p>
          </div>
        )}

        {!isLoading && !errorCarga && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">

            {/* Sección de Datos del Visitante */}
            <div className="col-span-1">
              <fieldset className="p-4 rounded-md border border-gray-200 h-full">
                <legend className="px-2 font-semibold text-blue-900">Información del Visitante</legend>
                <div className="space-y-4 pt-2">
                  <label className="block">
                    <span className="text-gray-700 text-sm font-medium">Nombre:</span>
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
                    <span className="text-gray-700 text-sm font-medium">Apellido:</span>
                    <input
                      type="text"
                      name="apellido"
                      value={formik.values.apellido}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="mt-1 block w-full rounded-md border-2 border-gray-400 bg-gray-50 shadow-lg"
                    />
                    {formik.touched.apellido && formik.errors.apellido && (
                      <div className="text-red-500 text-xs mt-1">{formik.errors.apellido}</div>
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
                      onBlur={formik.handleBlur}
                      className="mt-1 block w-full rounded-md border-2 border-gray-400 bg-gray-50 shadow-lg"
                    />
                    {formik.touched.empresa && formik.errors.empresa && (
                      <div className="text-red-500 text-xs mt-1">{formik.errors.empresa}</div>
                    )}
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
                      <option value="" disabled hidden>Seleccione un tipo</option>
                      {tiposIdentificacion.map(tipo => (
                        <option key={tipo.id_tipo_identificacion} value={tipo.id_tipo_identificacion}>
                          {tipo.nombre_tipo_identificacion}
                        </option>
                      ))}
                    </select>
                    {formik.touched.id_tipo_identificacion && formik.errors.id_tipo_identificacion && (
                      <div className="text-red-500 text-xs mt-1">{formik.errors.id_tipo_identificacion}</div>
                    )}
                  </label>
                  <label className="block">
                    <span className="text-gray-700 text-sm font-medium">Identificación:</span>
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
                    <span className="text-gray-700 text-sm font-medium">Área:</span>
                    <select
                      name="id_area"
                      value={formik.values.id_area}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="mt-1 block w-full rounded-md border-2 border-gray-400 bg-gray-50 shadow-lg"
                    >
                      <option value="" disabled hidden>Seleccione un área</option>
                      {areas.map(area => (
                        <option key={area.id_area} value={area.id_area}>
                          {area.nombre_area}
                        </option>
                      ))}
                    </select>
                    {formik.touched.id_area && formik.errors.id_area && (
                      <div className="text-red-500 text-xs mt-1">{formik.errors.id_area}</div>
                    )}
                  </label>
                </div>
              </fieldset>
            </div>

            {/* Sección de Motivo y Observaciones */}
            <div className="col-span-1 md:col-span-2">
              <fieldset className="p-4 rounded-md border border-gray-200">
                <legend className="px-2 font-semibold text-blue-900">Detalles Adicionales</legend>
                <div className="space-y-4 pt-2">
                  <label className="block">
                    <span className="text-gray-700 text-sm font-medium">Motivo:</span>
                    <textarea
                      name="motivo"
                      value={formik.values.motivo}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="mt-1 block w-full rounded-md border-2 border-gray-400 bg-gray-50 shadow-lg"
                      rows="3"
                    />
                    {formik.touched.motivo && formik.errors.motivo && (
                      <div className="text-red-500 text-xs mt-1">{formik.errors.motivo}</div>
                    )}
                  </label>
                  <label className="block">
                    <span className="text-gray-700 text-sm font-medium">Observaciones:</span>
                    <textarea
                      name="observaciones"
                      value={formik.values.observaciones}
                      onChange={formik.handleChange}
                      className="mt-1 block w-full rounded-md border-2 border-gray-400 bg-gray-50 shadow-lg"
                      rows="3"
                    />
                    {formik.touched.observaciones && formik.errors.observaciones && (
                      <div className="text-red-500 text-xs mt-1">{formik.errors.observaciones}</div>
                    )}
                  </label>
                </div>
              </fieldset>
            </div>
          </div>
        )}

        {/* Botones de acción */}
        <div className="mt-6 flex justify-center space-x-4 w-full">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="flex items-center bg-red-600 text-white font-bold py-2 px-4 sm:px-6 rounded-md hover:bg-red-700 sm: transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} className="mr-2 text-xl" />
            Cancelar
          </button>
          <button
            type="submit"
            className="flex items-center bg-blue-600 text-white font-bold py-2 px-4 sm:px-6 rounded-md hover:bg-blue-700 transition-colors"
            disabled={formik.isSubmitting || isLoading || !!errorCarga}
          >
            {formik.isSubmitting ? (
              'Registrando...'
            ) : (
              <>
                <FontAwesomeIcon icon={faCheckCircle} className="mr-2 text-xl" />
                Realizar Visita
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}