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
import usePackagesRecibir from "../../hooks/packages/usePackagesRecibir.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBroom,
  faCheckCircle,
  faExclamationTriangle,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FormikProvider } from "formik";

/**
 * @function RecibirPaqueteForm
 * @description Componente principal para el formulario de recepción de paquetes.
 * Renderiza los campos del formulario, maneja la carga de datos inicial y muestra
 * los mensajes de error o carga.
 * @returns {JSX.Element} La interfaz del formulario de recepción.
 */
export default function PackagesRecibirForm({
  onClose,
  onSuccess,
  isModal = false,
}) {
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
    error: submitError,
  } = usePackagesRecibir(onSuccess);

  const inputClasses =
    "mt-2 block w-full rounded-md font-semibold border-2 border-neutral-200 p-2 outline-none bg-background focus:border-secondary focus:ring-1 focus:ring-secondary-light transition-all";

  if (isLoading && isModal) {
    return <div className="p-8 text-center text-text-main">Cargando...</div>; // Spinner simple para modal
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 overflow-y-auto animate-fade-in">
      {/* Contenedor principal del modal */}
      <div className="bg-text rounded-lg shadow-xl w-full max-w-4xl flex flex-col my-8">
        <header className="p-4 flex justify-between items-center border-b border-gray-200 bg-primary z-10">
          <h2 className="text-2xl font-bold text-center ml-[300px] text-surface">
            Recibir Nuevo Paquete
          </h2>
          <button onClick={onClose} className="text-text-main hover:opacity-70">
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </header>
        <FormikProvider value={formik}>
          {/* Formulario Principal */}
          <form
            onSubmit={formik.handleSubmit}
            className="bg-surface p-6 shadow-xl w-full font-semibold"
          >
            {/* Mensaje de Error de Carga Inicial */}
            {errorCarga && (
              <div
                className="bg-red-100 border-l-4 border-error text-error-hover p-4 my-4"
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
              <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 p-4 rounded-md border border-neutral-200 shadow-neutral-200 shadow-sm">
                <legend className="px-2 font-semibold text-primary">
                  Datos del Paquete
                </legend>

                {/* Campo Tipo de Paquete */}
                <label className="block">
                  <span className="text-text-main text-sm font-medium">
                    Tipo de Paquete:
                  </span>
                  <select
                    name="id_tipo_paquete"
                    value={formik.values.id_tipo_paquete}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={inputClasses}
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
                  <span className="text-text-main text-sm font-medium">
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
                    className={inputClasses}
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
                  <span className="text-text-main text-sm font-medium">
                    Área:
                  </span>
                  <select
                    name="id_area"
                    value={formik.values.id_area}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={inputClasses}
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
                  <span className="text-text-main text-sm font-medium">
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
                    className={inputClasses}
                  />
                </label>

                {/* Campo Nombre del Mensajero */}
                <label className="block">
                  <span className="text-text-main text-sm font-medium">
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
                    className={inputClasses}
                  />
                </label>

                {/* Campo Guía (Condicional) y Checkbox */}
                <div className="justify-center w-full flex flex-col gap-4 mb-[10px]">
                  {/* Checkbox Con Guía */}
                  <label className="flex items-center justify-center mt-[40px] space-x-2">
                    <input
                      type="checkbox"
                      name="conGuia"
                      checked={formik.values.conGuia}
                      onChange={formik.handleChange}
                      className="rounded text-primary"
                    />
                    <span className="text-text-main text-sm font-medium">
                      El paquete tiene número de guía
                    </span>
                  </label>
                </div>
                {/* Input de Guía, visible solo si conGuia es true */}
                <div className="col-span-1 md:col-span-2">
                  {formik.values.conGuia && (
                    <div className="">
                      <label className="block">
                        <span className="text-text-main text-sm font-medium">
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
                          className={`${inputClasses} w-full`}
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

                {/* Campo Observaciones (ocupa 2 columnas) */}
                <div className="col-span-1 md:col-span-2">
                  <label className="block">
                    <span className="text-text-main text-sm font-medium">
                      Observaciones (Opcional):
                    </span>
                    <textarea
                      name="observaciones"
                      placeholder="El paquete se encuentra en las mejores condiciones"
                      value={formik.values.observaciones}
                      autoComplete="off"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={inputClasses}
                      rows="3"
                    />
                  </label>
                </div>
              </fieldset>
            )}

            {submitError && formik.submitCount > 0 && (
              <div className="bg-red-100 border border-red-400 text-error px-4 py-3 rounded-md relative text-center mt-[30px] mb-[5px]">
                <span className="block sm:inline">{submitError}</span>
              </div>
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
                className="flex items-center px-6 py-2 bg-primary text-white font-bold rounded-md hover:bg-primary-hover transition-colors duration-200"
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
        </FormikProvider>
      </div>
    </div>
  );
}
