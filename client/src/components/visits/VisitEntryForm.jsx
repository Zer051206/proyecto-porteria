/**
 * @file VisitEntryForm.jsx
 * @module Components/VisitEntryForm
 * @description Componente de formulario para registrar la entrada de un visitante.
 * Gestiona el estado y la lógica de validación a través del hook `useVisitEntryForm`
 * e incluye un componente para la firma digital.
 * @component
 * @requires react
 * @requires ../../hooks/visits/useVisitEntryForm - Lógica del formulario, estado y validación.
 * @requires ../../hooks/useGoBackDashboard.js - Hook para la navegación de regreso.
 * @requires @fortawesome/react-fontawesome/FontAwesomeIcon
 * @requires @fortawesome/free-solid-svg-icons/faBroom, faCheckCircle, faExclamationTriangle, faSignOutAlt
 * @requires react-signature-canvas - Componente para la firma digital.
 */
import React from "react";
import useVisitEntryForm from "../../hooks/visits/useVisitEntryForm.js";
import { useGoBackDashboard } from "../../hooks/useGoBackDashboard.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBroom,
  faCheckCircle,
  faExclamationTriangle,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import SignatureCanvas from "react-signature-canvas";

/**
 * @function VisitEntryForm
 * @description Renderiza el formulario de registro de visitantes.
 *
 * @returns {JSX.Element} El elemento JSX que contiene el formulario de registro.
 */
export default function VisitEntryForm() {
  /**
   * @const {Function} goBack
   * @description Función que redirige al usuario al dashboard principal.
   */
  const goBack = useGoBackDashboard();

  /**
   * @const {object} formLogic
   * @description Desestructuración de todos los estados, utilidades y funciones
   * proporcionadas por el hook de lógica `useVisitEntryForm`.
   */
  const {
    formik, // Objeto Formik con valores, errores, touched, handleChange, handleSubmit
    areas, // Lista de áreas disponibles (para el select)
    tiposIdentificacion, // Lista de tipos de identificación (para el select)
    isLoading, // Estado de carga inicial de las opciones
    errorCarga, // Error si fallan las peticiones de opciones iniciales
    handleClickClear, // Función para limpiar el formulario y la firma
    handleKeyNumberDown, // Utilidad para restringir entradas a números
    handleKeyTextDown, // Utilidad para restringir entradas a texto
    error, // Error general retornado por la API al fallar la submission
    sigCanvas, // Referencia para el componente SignatureCanvas
  } = useVisitEntryForm();

  return (
    <div className="flex flex-col items-center min-h-screen w-full p-4">
      {/* Botón de Volver/Cerrar (ubicado en la esquina superior derecha) */}
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

      {/* Formulario Principal */}
      <form
        onSubmit={formik.handleSubmit}
        className="bg-gray-800 font-semibold text-black p-6 rounded-lg shadow-2xl w-full max-w-2xl mt-[70px]"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
          Registro de Visita
        </h2>

        {/* Mensaje de carga inicial */}
        {isLoading && (
          <div className="text-center text-gray-500 my-4">
            Cargando opciones...
          </div>
        )}

        {/* Mensaje de error de carga inicial */}
        {errorCarga && (
          <div
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 my-4"
            role="alert"
          >
            <div className="flex items-center">
              <FontAwesomeIcon
                icon={faExclamationTriangle}
                className="mr-2 text-xl"
              />
              <p className="font-bold">Error de Carga</p>
            </div>
            <p className="mt-1">{errorCarga}</p>
          </div>
        )}

        {/* Campos del formulario (solo se muestran si no hay carga ni error de carga) */}
        {!isLoading && !errorCarga && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {/* Sección de Datos del Visitante */}
            <div className="col-span-1">
              <fieldset className="p-4 rounded-md border border-gray-400 shadow-lg shadow-black h-full">
                <legend className="px-2 font-semibold text-blue-500">
                  Información del Visitante
                </legend>
                <div className="space-y-4 pt-2">
                  {/* Nombre */}
                  <label className="block">
                    <span className="text-gray-400 text-sm font-medium">
                      Nombre:
                    </span>
                    <input
                      type="text"
                      autoComplete="off"
                      placeholder="Pepito..."
                      onKeyDown={handleKeyTextDown}
                      name="nombre_visitante"
                      value={formik.values.nombre_visitante}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="mt-1 block w-full rounded-md p-1 placeholder-gray-800 placeholder:italic border-2 border-gray-400 bg-gray-50 shadow-lg"
                    />
                    {formik.touched.nombre_visitante &&
                      formik.errors.nombre_visitante && (
                        <div className="text-red-500 font-semibold text-[15px] mt-1">
                          {formik.errors.nombre_visitante}
                        </div>
                      )}
                  </label>
                  {/* Apellido */}
                  <label className="block">
                    <span className="text-gray-400 text-sm font-medium">
                      Apellido:
                    </span>
                    <input
                      type="text"
                      autoComplete="off"
                      placeholder="Perez..."
                      onKeyDown={handleKeyTextDown}
                      name="apellido"
                      value={formik.values.apellido}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="mt-1 block w-full rounded-md p-1 border-2 placeholder-gray-800 placeholder:italic border-gray-400 bg-gray-50 shadow-lg"
                    />
                    {formik.touched.apellido && formik.errors.apellido && (
                      <div className="text-red-500 font-semibold text-[15px] mt-1">
                        {formik.errors.apellido}
                      </div>
                    )}
                  </label>
                  {/* Teléfono */}
                  <label className="block">
                    <span className="text-gray-400 text-sm font-medium">
                      Teléfono:
                    </span>
                    <input
                      type="number"
                      autoComplete="off"
                      onKeyDown={handleKeyNumberDown}
                      placeholder="Número de telefono del visitante"
                      name="telefono"
                      value={formik.values.telefono}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="mt-1 block w-full rounded-md border-2 placeholder:text-sm p-1 placeholder-gray-800 placeholder:italic border-gray-400 bg-gray-50 shadow-lg"
                    />
                    {formik.touched.telefono && formik.errors.telefono && (
                      <div className="text-red-500 font-semibold text-[15px] mt-1">
                        {formik.errors.telefono}
                      </div>
                    )}
                  </label>
                  {/* Empresa (Opcional) */}
                  <label className="block">
                    <span className="text-gray-400 text-sm font-medium">
                      Empresa (Opcional):
                    </span>
                    <input
                      type="text"
                      autoComplete="off"
                      name="empresa"
                      placeholder="En caso de ser necesario"
                      value={formik.values.empresa}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="mt-1 block w-full rounded-md border-2 p-1 placeholder-gray-800 placeholder:italic border-gray-400 bg-gray-50 shadow-lg"
                    />
                    {formik.touched.empresa && formik.errors.empresa && (
                      <div className="text-red-500 font-semibold text-[15px] mt-1">
                        {formik.errors.empresa}
                      </div>
                    )}
                  </label>
                </div>
              </fieldset>
            </div>

            {/* Sección de Datos de la Visita */}
            <div className="col-span-1">
              <fieldset className="p-4 rounded-md border border-gray-400 shadow-lg shadow-black h-full">
                <legend className="px-2 font-semibold text-blue-500">
                  Datos de la Visita
                </legend>
                <div className="space-y-4 pt-2">
                  {/* Tipo de Identificación */}
                  <label className="block">
                    <span className="text-gray-400 text-sm font-medium">
                      Tipo de Identificación:
                    </span>
                    <select
                      name="id_tipo_identificacion"
                      value={formik.values.id_tipo_identificacion}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="mt-1 block w-full rounded-md border-2 p-1 border-gray-400 bg-gray-50 shadow-lg"
                    >
                      <option value="" hidden>
                        Seleccione un tipo
                      </option>
                      {tiposIdentificacion.map((tipo) => (
                        <option
                          key={tipo.id_tipo_identificacion}
                          value={tipo.id_tipo_identificacion}
                        >
                          {tipo.descripcion}
                        </option>
                      ))}
                    </select>
                    {formik.errors.id_tipo_identificacion && (
                      <div className="text-red-500 font-semibold text-[15px] mt-1">
                        {formik.errors.id_tipo_identificacion}
                      </div>
                    )}
                  </label>
                  {/* Identificación */}
                  <label className="block">
                    <span className="text-gray-400 text-sm font-medium">
                      Identificación:
                    </span>
                    <input
                      type="number"
                      autoComplete="off"
                      onKeyDown={handleKeyNumberDown}
                      placeholder="Numero del documento de identidad"
                      name="identificacion"
                      value={formik.values.identificacion}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="mt-1 block w-full rounded-md border-2 p-1 placeholder:text-sm placeholder-gray-800 placeholder:italic border-gray-400 bg-gray-50 shadow-lg"
                    />
                    {formik.touched.identificacion &&
                      formik.errors.identificacion && (
                        <div className="text-red-500 font-semibold text-[15px] mt-1">
                          {formik.errors.identificacion}
                        </div>
                      )}
                  </label>
                  {/* Destinatario */}
                  <label className="block">
                    <span className="text-gray-400 text-sm font-medium">
                      Destinatario:
                    </span>
                    <input
                      type="text"
                      autoComplete="off"
                      placeholder="Nombre del destinatario"
                      onKeyDown={handleKeyTextDown}
                      name="nombre_destinatario"
                      value={formik.values.nombre_destinatario}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="mt-1 block w-full rounded-md p-1 placeholder-gray-800 placeholder:italic border-2 border-gray-400 bg-gray-50 shadow-lg"
                    />
                    {formik.touched.nombre_destinatario &&
                      formik.errors.nombre_destinatario && (
                        <div className="text-red-500 font-semibold text-[15px] mt-1">
                          {formik.errors.nombre_destinatario}
                        </div>
                      )}
                  </label>
                  {/* Área */}
                  <label className="block">
                    <span className="text-gray-400 text-sm font-medium">
                      Área:
                    </span>
                    <select
                      name="id_area"
                      value={formik.values.id_area}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="mt-1 block w-full rounded-md p-1 border-2 border-gray-600 bg-gray-50 shadow-lg"
                    >
                      <option value="" hidden>
                        Seleccione un área
                      </option>
                      {areas.map((area) => (
                        <option key={area.id_area} value={area.id_area}>
                          {area.nombre_area}
                        </option>
                      ))}
                    </select>
                    {formik.touched.id_area && formik.errors.id_area && (
                      <div className="text-red-500 font-semibold text-[15px] mt-1">
                        {formik.errors.id_area}
                      </div>
                    )}
                  </label>
                </div>
              </fieldset>
            </div>

            {/* Sección de Motivo y Observaciones (Colspan 2) */}
            <div className="col-span-1 md:col-span-2">
              <fieldset className="p-4 rounded-md border border-gray-400 shadow-lg shadow-black">
                <legend className="px-2 font-semibold text-blue-500">
                  Detalles Adicionales
                </legend>
                <div className="space-y-4 pt-2">
                  {/* Motivo */}
                  <label className="block">
                    <span className="text-gray-400 text-sm font-medium">
                      Motivo:
                    </span>
                    <textarea
                      name="motivo"
                      autoComplete="off"
                      placeholder="Cambio de operador internet en la empresa..."
                      value={formik.values.motivo}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="mt-1 block w-full rounded-md border-2 p-[3px] placeholder:italic border-gray-400 bg-gray-50 shadow-lg"
                      rows="3"
                    />
                    {formik.touched.motivo && formik.errors.motivo && (
                      <div className="text-red-500 font-semibold text-[15px] mt-1">
                        {formik.errors.motivo}
                      </div>
                    )}
                  </label>
                  {/* Observaciones (Opcional) */}
                  <label className="block">
                    <span className="text-gray-400 text-sm font-medium">
                      Observaciones (Opcional):
                    </span>
                    <textarea
                      name="observaciones"
                      autoComplete="off"
                      placeholder="El visitante ingresa con su mochila y casco..."
                      value={formik.values.observaciones}
                      onChange={formik.handleChange}
                      className="mt-1 block w-full rounded-md border-2 p-[3px] placeholder:italic border-gray-400 bg-gray-50 shadow-lg"
                      rows="3"
                    />
                    {formik.touched.observaciones &&
                      formik.errors.observaciones && (
                        <div className="text-red-500 font-semibold text-[15px] mt-1">
                          {formik.errors.observaciones}
                        </div>
                      )}
                  </label>
                </div>
              </fieldset>
            </div>

            {/* Sección de la Firma Digital (Colspan 2) */}
            <div className="col-span-1 md:col-span-2 mt-4">
              <fieldset className="p-4 rounded-md border border-gray-400 shadow-lg shadow-black">
                <legend className="px-2 font-semibold text-blue-500">
                  Firma del Visitante (Obligatoria)
                </legend>
                <div className="mt-2 flex flex-col items-center">
                  <div className="w-full border-2 border-dashed border-gray-500 rounded-md bg-white">
                    <SignatureCanvas
                      ref={sigCanvas} // Enlazamos la referencia del hook aquí
                      penColor="black"
                      canvasProps={{
                        width: 550,
                        height: 200,
                        className: "sigCanvas w-full rounded-md",
                      }}
                      backgroundColor="rgb(249 250 251)" // Coincide con bg-gray-50
                      dotSize={2}
                      minWidth={0.5}
                      maxWidth={2.5}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Firma aquí para registrar tu visita y dar consentimiento.
                  </p>
                </div>
              </fieldset>
            </div>
          </div>
        )}

        {/* Mensaje de error general de la API */}
        {error && formik.submitCount > 0 && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative text-center mt-[30px] mb-[5px]">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Botones de acción */}
        <div className="mt-6 flex justify-center space-x-4 w-full">
          <button
            type="button"
            onClick={handleClickClear}
            className="flex items-center bg-gray-500 text-white font-bold py-2 px-4 sm:px-6 rounded-md hover:bg-gray-700 sm: transition-colors"
          >
            <FontAwesomeIcon icon={faBroom} className="mr-2 text-xl" />
            Limpiar
          </button>
          <button
            type="submit"
            className="flex items-center bg-blue-600 text-white font-bold py-2 px-4 sm:px-6 rounded-md hover:bg-blue-700 transition-colors"
            // Deshabilita si está enviando, cargando opciones o si hay error de carga
            disabled={formik.isSubmitting || isLoading || !!errorCarga}
          >
            {formik.isSubmitting ? (
              "Registrando..."
            ) : (
              <>
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="mr-2 text-xl"
                />
                Realizar Visita
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
