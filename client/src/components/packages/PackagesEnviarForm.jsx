// src/pages/EnviarPaqueteForm.jsx

import React from "react";
import { useGoBack } from "../../hooks/useGoBackDashboard.js";
import { useNavigate } from "react-router-dom";
import usePackageEnviarForm from "../../hooks/usePackagesEnviar.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUpload,
  faBroom,
  faCheckCircle,
  faExclamationTriangle,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";

export default function PackagesEnviarForm() {
  const navigate = useNavigate();
  const goBack = useGoBack();
  const {
    formik,
    tiposPaquetes,
    areas,
    isLoading,
    errorCarga,
    handleClickClear,
    handleKeyTextDown,
    handleAddressKeyDown,
  } = usePackageEnviarForm(navigate);

  return (
    <div className="flex flex-col items-center h-screen w-screen p-4 ">
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
      <form
        onSubmit={formik.handleSubmit}
        className="bg-gray-800 p-6 rounded-lg shadow-xl w-full font-semibold max-w-2xl mt-[70px]"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-green-500">
          <FontAwesomeIcon icon={faUpload} className="mr-3" />
          Envío de Paquete
        </h2>

        {isLoading && (
          <div className="text-center text-gray-500 my-4">
            Cargando opciones...
          </div>
        )}
        {errorCarga && (
          <div
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 my-4"
            role="alert"
          >
            <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
            <p className="font-bold">Error de Carga</p>
            <p>{errorCarga}</p>
          </div>
        )}

        {!isLoading && !errorCarga && (
          <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 p-4 rounded-md border border-gray-500 shadow-black shadow-sm">
            <legend className="px-2 font-semibold text-green-400">
              Datos del Paquete
            </legend>

            <label className="block">
              <span className="text-gray-400 text-sm font-medium">
                Tipo de Paquete:
              </span>
              <select
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

            <label className="block">
              <span className="text-gray-400 text-sm font-medium">
                Nombre del remitente:
              </span>
              <input
                type="text"
                autoComplete="off"
                onKeyDown={handleKeyTextDown}
                placeholder="Pepito perez..."
                name="nombre_remitente"
                value={formik.values.nombre_remitente}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="mt-1 block w-full rounded-md border-2 p-2 placeholder:italic  border-gray-400 bg-gray-50 shadow-lg"
              />
              {formik.touched.nombre_remitente &&
                formik.errors.nombre_remitente && (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.nombre_remitente}
                  </div>
                )}
            </label>

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

            <label className="block">
              <span className="text-gray-400 text-sm font-medium">
                Empresa de Transporte (Opcional):
              </span>
              <input
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

            <label className="block">
              <span className="text-gray-400 text-sm font-medium">
                Nombre del Mensajero (Opcional):
              </span>
              <input
                type="text"
                autoComplete="off"
                name="mensajero_nombre"
                placeholder="Juan esteban"
                onKeyDown={handleKeyTextDown}
                value={formik.values.mensajero_nombre}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="mt-1 block w-full rounded-md border-2 p-2 placeholder:italic  border-gray-400 bg-gray-50 shadow-lg"
              />
            </label>

            <label className="block">
              <span className="text-gray-400 text-sm font-medium">
                Destino del paquete:
              </span>
              <input
                type="text"
                autoComplete="off"
                onKeyDown={handleAddressKeyDown}
                placeholder="Calle 123 # 45 - 6"
                name="destino_salida"
                value={formik.values.destino_salida}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="mt-1 block w-full rounded-md border-2 p-2 placeholder:italic  border-gray-400 bg-gray-50 shadow-lg"
              />
              {formik.touched.destino_salida &&
                formik.errors.destino_salida && (
                  <div className="text-red-500 text-sm mt-1">
                    {formik.errors.id_area}
                  </div>
                )}
            </label>

            <div className="col-span-1 md:col-span-2">
              <label className="flex items-center space-x-2">
                <input
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
                  <label className="block">
                    <span className="text-gray-400 text-sm font-medium">
                      Número de Guía:
                    </span>
                    <input
                      type="text"
                      name="guia"
                      placeholder="Ingrese el numero de guia del paquete"
                      autoComplete="off"
                      value={formik.values.guia}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="mt-1 block w-full rounded-md border-2 p-2 placeholder:italic  border-gray-400 bg-gray-50 shadow-lg"
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

            <div className="col-span-1 md:col-span-2">
              <label className="block">
                <span className="text-gray-300 text-sm font-medium">
                  Observaciones (Opcional):
                </span>
                <textarea
                  name="observaciones"
                  placeholder="El paquete se encuentra en las mejores condiciones."
                  autoComplete="off"
                  value={formik.values.observaciones}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="mt-1 block w-full rounded-md border-2 p-2 placeholder:italic  border-gray-400 bg-gray-50 shadow-lg"
                  rows="3"
                />
              </label>
            </div>
          </fieldset>
        )}

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
