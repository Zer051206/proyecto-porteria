/**
 * @file RecibirPaqueteForm.jsx
 * @module Components/RecibirPaqueteForm
 * @description Componente de página que renderiza el formulario para registrar la recepción de un nuevo paquete.
 * Utiliza el hook personalizado usePackagesRecibir para manejar toda la lógica, estado y sumisión del formulario,
 * así como la carga inicial de tipos de paquetes y áreas.
 * @exports RecibirPaqueteForm
 * @requires react
 * @requires react-router-dom - Para la navegación.
 * @requires @fortawesome/react-fontawesome - Para íconos visuales.
 * @requires @fortawesome/free-solid-svg-icons - Íconos utilizados.
 * @requires ../../hooks/useGoBackDashboard - Hook para volver al dashboard.
 * @requires ../../hooks/packages/usePackagesRecibir - Hook de lógica del formulario.
 */
import React from "react";
import { useNavigate } from "react-router-dom";
import usePackagesRecibir from "../../hooks/packages/usePackagesRecibir.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faBroom,
  faCheckCircle,
  faExclamationTriangle,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";

/**
 * @function RecibirPaqueteForm
 * @description Componente principal para el formulario de recepción de paquetes.
 * Renderiza los campos del formulario, maneja la carga de datos inicial y muestra
 * los mensajes de error o carga.
 * @returns {JSX.Element} La interfaz del formulario de recepción.
 */
export default function RecibirPaqueteForm() {
  /** @type {Function} Función de navegación de React Router DOM. */
  const navigate = useNavigate();

  const goBack = () => navigate(-1);

  /**
   * @constant {object} formHookData
   * @description Datos y funciones obtenidos del hook personalizado `usePackagesRecibir`.
   */
  const {
    formik,
    tiposPaquetes,
    areas,
    isLoading,
    errorCarga,
    handleClickClear,
    handleKeyTextDown,
  } = usePackagesRecibir(navigate);

  return (
    <div className="flex flex-col items-center h-screen w-screen md:w-full mt-[70px] mb-[50px] p-4">
      {/* Botón de Volver al Dashboard */}
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
        className="bg-gray-800 p-6 rounded-lg shadow-xl w-full font-semibold max-w-2xl mt-[50px]"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-500">
          <FontAwesomeIcon icon={faDownload} className="mr-3" />
          Recibir Paquete
        </h2>

        {/* Indicador de Carga */}
        {isLoading && (
          <div className="text-center text-gray-500 my-4">
            Cargando opciones...
          </div>
        )}

        {/* Mensaje de Error de Carga Inicial */}
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

        {/* Campos del Formulario (se muestran solo si no hay carga ni error) */}
        {!isLoading && !errorCarga && (
          <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 p-4 rounded-md border border-gray-500 shadow-black shadow-sm">
            <legend className="px-2 font-semibold text-blue-400">
              Datos del Paquete
            </legend>

            {/* Campo Tipo de Paquete */}
            <label className="block">
              <span className="text-gray-400 text-sm font-medium">
                Tipo de Paquete:
              </span>
              <select
                name="id_tipo_paquete"
                value={formik.values.id_tipo_paquete}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="mt-1 block w-full rounded-md border-2 p-2 border-gray-600 bg-gray-50 shadow-lg"
              >
                <option value="" hidden>
                  Seleccione un tipo
                </option>
                {tiposPaquetes.map((tipo) => (
                  <option
                    key={tipo.id_tipo_paquete}
                    value={tipo.id_tipo_paquete}
                  >
                    {tipo.descripcion}
                  </option>
                ))}
              </select>
              {formik.touched.id_tipo_paquete &&
                formik.errors.id_tipo_paquete && (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.id_tipo_paquete}
                  </div>
                )}
            </label>

            {/* Campo Nombre del Destinatario */}
            <label className="block">
              <span className="text-gray-400 text-sm font-medium">
                Nombre completo del destinatario:
              </span>
              <input
                type="text"
                name="nombre_destinatario"
                placeholder="Pepito perez..."
                onKeyDown={handleKeyTextDown}
                autoComplete="off"
                value={formik.values.nombre_destinatario}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="mt-1 block w-full rounded-md border-2 p-2 placeholder:italic  border-gray-400 bg-gray-50 shadow-lg"
              />
              {formik.touched.nombre_destinatario &&
                formik.errors.nombre_destinatario && (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.nombre_destinatario}
                  </div>
                )}
            </label>

            {/* Campo Área */}
            <label className="block">
              <span className="text-gray-400 text-sm font-medium">Área:</span>
              <select
                name="id_area"
                value={formik.values.id_area}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="mt-1 block w-full rounded-md border-2 p-2 border-gray-400 bg-gray-50 shadow-lg"
              >
                <option value="" disabled hidden>
                  Seleccione un área
                </option>
                {areas.map((area) => (
                  <option key={area.id_area} value={area.id_area}>
                    {area.nombre_area}
                  </option>
                ))}
              </select>
              {formik.touched.id_area && formik.errors.id_area && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.id_area}
                </div>
              )}
            </label>

            {/* Campo Empresa de Transporte */}
            <label className="block">
              <span className="text-gray-400 text-sm font-medium">
                Empresa de Transporte (Opcional):
              </span>
              <input
                type="text"
                placeholder="En caso de ser necesario"
                name="empresa_transporte"
                autoComplete="off"
                value={formik.values.empresa_transporte}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="mt-1 block w-full rounded-md border-2 p-2 placeholder:italic  border-gray-400 bg-gray-50 shadow-lg"
              />
            </label>

            {/* Campo Nombre del Mensajero */}
            <label className="block">
              <span className="text-gray-400 text-sm font-medium">
                Nombre del Mensajero (Opcional):
              </span>
              <input
                type="text"
                placeholder="Juan esteban"
                name="mensajero_nombre"
                onKeyDown={handleKeyTextDown}
                autoComplete="off"
                value={formik.values.mensajero_nombre}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="mt-1 block w-full rounded-md border-2 p-2 placeholder:italic border-gray-400 bg-gray-50 shadow-lg"
              />
            </label>

            {/* Campo Guía (Condicional) y Checkbox */}
            <div className="justify-center w-full flex flex-col gap-4 mb-[10px]">
              {/* Input de Guía, visible solo si conGuia es true */}
              {formik.values.conGuia && (
                <div className="">
                  <label className="block">
                    <span className="text-gray-400 text-sm font-medium">
                      Número de Guía:
                    </span>
                    <input
                      type="text"
                      placeholder="Ingrese la guia del paquete"
                      name="guia"
                      autoComplete="off"
                      value={formik.values.guia}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="mt-1 block w-full rounded-md border-2 p-2 placeholder:italic  border-gray-400 bg-gray-50 shadow-lg"
                    />
                    {formik.touched.guia && formik.errors.guia && (
                      <div className="text-red-500 text-sm mt-1">
                        {formik.errors.guia}
                      </div>
                    )}
                  </label>
                </div>
              )}
              {/* Checkbox Con Guía */}
              <label className="flex items-center justify-center space-x-2">
                <input
                  type="checkbox"
                  name="conGuia"
                  checked={formik.values.conGuia}
                  onChange={formik.handleChange}
                  className="rounded text-blue-600"
                />
                <span className="text-gray-400 text-sm font-medium">
                  El paquete tiene número de guía
                </span>
              </label>
            </div>

            {/* Campo Observaciones (ocupa 2 columnas) */}
            <div className="col-span-1 md:col-span-2">
              <label className="block">
                <span className="text-gray-400 text-sm font-medium">
                  Observaciones (Opcional):
                </span>
                <textarea
                  name="observaciones"
                  placeholder="El paquete se encuentra en las mejores condiciones"
                  value={formik.values.observaciones}
                  autoComplete="off"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="mt-1 block w-full rounded-md border-2 p-2 placeholder:italic  border-gray-400 bg-gray-50 shadow-lg focus:outline-none"
                  rows="3"
                />
              </label>
            </div>
          </fieldset>
        )}

        {/* Botones de Acción */}
        <div className="mt-6 flex justify-center w-full space-x-4">
          {/* Botón Limpiar */}
          <button
            type="button"
            onClick={handleClickClear}
            className="flex items-center bg-gray-500 text-white font-bold py-2 px-4 sm:px-6 rounded-md hover:bg-gray-700 sm: transition-colors"
          >
            <FontAwesomeIcon icon={faBroom} className="mr-2 text-xl" />
            Limpiar
          </button>
          {/* Botón Registrar (Submit) */}
          <button
            type="submit"
            className="flex items-center px-6 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition-colors duration-200"
            disabled={formik.isSubmitting || isLoading || !!errorCarga}
          >
            {formik.isSubmitting ? (
              "Guardando..."
            ) : (
              <>
                <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                Registrar
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
