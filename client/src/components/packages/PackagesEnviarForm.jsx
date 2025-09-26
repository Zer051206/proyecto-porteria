/**
 * @file EnviarPaqueteForm.jsx
 * @module EnviarPaqueteForm
 * @description Componente de página que renderiza el formulario para registrar la salida (envío) de un paquete.
 * Utiliza el hook `usePackagesEnviar` para manejar la lógica del formulario, validaciones, carga de opciones y submission a la API.
 * @component
 * @requires react
 * @requires react-router-dom/useNavigate
 * @requires ../../hooks/useGoBackDashboard - Hook para la navegación sencilla de vuelta al dashboard.
 * @requires ../../hooks/packages/usePackagesEnviar - Lógica de estado y validación del formulario.
 * @requires @fortawesome/react-fontawesome/FontAwesomeIcon
 * @requires @fortawesome/free-solid-svg-icons/faUpload, faBroom, faCheckCircle, faExclamationTriangle, faSignOutAlt
 */
import React from "react";
import { useGoBackDashboard } from "../../hooks/useGoBackDashboard.js"; // Asumo el nombre del hook
import { useNavigate } from "react-router-dom";
import usePackageEnviarForm from "../../hooks/packages/usePackagesEnviar.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUpload,
  faBroom,
  faCheckCircle,
  faExclamationTriangle,
  faSignOutAlt, // Usado para el botón Volver/Salir
} from "@fortawesome/free-solid-svg-icons";

/**
 * @function EnviarPaqueteForm
 * @description Renderiza el formulario de envío de paquetes con todos sus campos, estados de carga y manejo de errores.
 *
 * @returns {JSX.Element} El elemento JSX que contiene el formulario de registro.
 */
export default function EnviarPaqueteForm() {
  /**
   * @const {Function} navigate
   * @description Hook de React Router para la navegación programática.
   */
  const navigate = useNavigate();

  /**
   * @const {Function} goBack
   * @description Función que redirige al usuario al dashboard principal.
   */
  const goBack = useGoBackDashboard(); // Usando el hook específico para dashboard

  /**
   * @const {object} formLogic
   * @description Desestructuración de todos los estados y funciones proporcionadas por el hook de lógica.
   */
  const {
    formik, // Objeto Formik con valores, errores, touched, handleChange, handleSubmit
    tiposPaquetes, // Opciones para el select Tipo de Paquete
    areas, // Opciones para el select Área
    isLoading, // Estado de carga inicial de las opciones
    errorCarga, // Error si fallan las peticiones de opciones iniciales
    handleClickClear, // Función para limpiar el formulario (nombrado como estaba en el hook original)
    handleKeyTextDown, // Utilidad para restringir texto
    handleAddressKeyDown, // Utilidad para restringir direcciones
    error, // Error general retornado por la API al fallar la submission
  } = usePackageEnviarForm(navigate);

  return (
    <div className="flex flex-col items-center h-screen w-screen md:w-full mt-[70px] mb-[50px]">
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
        className="bg-gray-800 p-6 rounded-lg shadow-xl w-full font-semibold max-w-2xl mt-[50px]"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-green-500">
          <FontAwesomeIcon icon={faUpload} className="mr-3" />
          Envío de Paquete
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
          <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 p-4 rounded-md border border-gray-500 shadow-black shadow-sm">
            <legend className="px-2 font-semibold text-green-400">
              Datos del Paquete
            </legend>

            {/* Campo: Tipo de Paquete */}
            <label className="block" htmlFor="tipo_paquete">
              <span className="text-gray-400 text-sm font-medium">
                Tipo de Paquete:
              </span>
              <select
                id="tipo_paquete"
                name="id_tipo_paquete"
                value={formik.values.id_tipo_paquete}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="mt-1 block w-full rounded-md border-2 p-2 border-gray-400 bg-gray-50 shadow-lg"
              >
                <option value="" disabled hidden>
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

            {/* Campo: Nombre del Remitente */}
            <label className="block" htmlFor="nombre_remitente">
              <span className="text-gray-400 text-sm font-medium">
                Nombre del remitente:
              </span>
              <input
                id="nombre_remitente"
                type="text"
                autoComplete="off"
                onKeyDown={handleKeyTextDown}
                placeholder="Pepito perez..."
                name="nombre_remitente"
                value={formik.values.nombre_remitente}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="mt-1 block w-full rounded-md border-2 p-2 placeholder:italic  border-gray-400 bg-gray-50 shadow-lg"
              />
              {formik.touched.nombre_remitente &&
                formik.errors.nombre_remitente && (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.nombre_remitente}
                  </div>
                )}
            </label>

            {/* Campo: Área */}
            <label className="block" htmlFor="id_area">
              <span className="text-gray-400 text-sm font-medium">Área:</span>
              <select
                id="id_area"
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

            {/* Campo: Empresa de Transporte */}
            <label className="block" htmlFor="empresa_transporte">
              <span className="text-gray-400 text-sm font-medium">
                Empresa de Transporte (Opcional):
              </span>
              <input
                id="empresa_transporte"
                type="text"
                autoComplete="off"
                name="empresa_transporte"
                value={formik.values.empresa_transporte}
                placeholder="En caso de ser necesario"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="mt-1 block w-full rounded-md border-2 p-2 placeholder:italic border-gray-400 bg-gray-50 shadow-lg"
              />
            </label>

            {/* Campo: Nombre del Mensajero */}
            <label className="block" htmlFor="mensajero_nombre">
              <span className="text-gray-400 text-sm font-medium">
                Nombre del Mensajero (Opcional):
              </span>
              <input
                id="mensajero_nombre"
                type="text"
                autoComplete="off"
                name="mensajero_nombre"
                placeholder="Juan esteban"
                onKeyDown={handleKeyTextDown}
                value={formik.values.mensajero_nombre}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="mt-1 block w-full rounded-md border-2 p-2 placeholder:italic  border-gray-400 bg-gray-50 shadow-lg"
              />
            </label>

            {/* Campo: Destino de Salida */}
            <label className="block" htmlFor="destino_salida">
              <span className="text-gray-400 text-sm font-medium">
                Destino del paquete:
              </span>
              <input
                id="destino_salida"
                type="text"
                autoComplete="off"
                onKeyDown={handleAddressKeyDown}
                placeholder="Calle 123 # 45 - 6"
                name="destino_salida"
                value={formik.values.destino_salida}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="mt-1 block w-full rounded-md border-2 p-2 placeholder:italic  border-gray-400 bg-gray-50 shadow-lg"
              />
              {formik.touched.destino_salida &&
                formik.errors.destino_salida && (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.destino_salida}
                  </div>
                )}
            </label>

            {/* Checkbox y Campo de Guía Condicional */}
            <div className="col-span-1 md:col-span-2">
              <label className="flex items-center space-x-2" htmlFor="conGuia">
                <input
                  id="conGuia"
                  type="checkbox"
                  name="conGuia"
                  checked={formik.values.conGuia}
                  onChange={formik.handleChange}
                  className="rounded text-green-600"
                />
                <span className="text-gray-400 text-sm font-medium">
                  El paquete tiene número de guía
                </span>
              </label>
              {formik.values.conGuia && (
                <div className="mt-2">
                  <label className="block" htmlFor="guia">
                    <span className="text-gray-400 text-sm font-medium">
                      Número de Guía:
                    </span>
                    <input
                      id="guia"
                      type="text"
                      name="guia"
                      placeholder="Ingrese el numero de guia del paquete"
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
            </div>

            {/* Campo: Observaciones (Colspan 2) */}
            <div className="col-span-1 md:col-span-2">
              <label className="block" htmlFor="observaciones">
                <span className="text-gray-300 text-sm font-medium">
                  Observaciones (Opcional):
                </span>
                <textarea
                  id="observaciones"
                  name="observaciones"
                  placeholder="El paquete se encuentra en las mejores condiciones."
                  autoComplete="off"
                  value={formik.values.observaciones}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="mt-1 block w-full rounded-md border-2 p-2 placeholder:italic  border-gray-400 bg-gray-50 shadow-lg"
                  rows="3"
                />
              </label>
            </div>
          </fieldset>
        )}

        {/* Mensaje de error general de la API */}
        {error && formik.submitCount > 0 && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md relative text-center mt-[30px] mb-[5px]">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Botones de acción */}
        <div className="mt-6 flex justify-center space-x-4">
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
            className="flex items-center px-6 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-green-700 transition-colors duration-200"
            // Deshabilita si está enviando, cargando opciones o si hay error de carga
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
