/**
 * @file PackagesEnviarForm.jsx
 * @module components/packages/PackagesEnviarForm.jsx
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
import usePackageEnviar from "../../hooks/packages/usePackagesEnviar.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUpload,
  faBroom,
  faCheckCircle,
  faExclamationTriangle,
  faTimes,
  faSignature,
} from "@fortawesome/free-solid-svg-icons";
import { FormikProvider, Field } from "formik";
import SignatureCanvas from "react-signature-canvas";

/**
 * @function SignatureField
 * @description Subcomponente reutilizable para un campo de firma.
 * (Copiado de PackagesRecibirForm.jsx para consistencia)
 * @param {object} props
 * @returns {JSX.Element}
 */
const SignatureField = ({ label, sigRef, error, onClear }) => (
  <div className="md:col-span-1 flex flex-col">
    <label className="block text-text-main font-semibold mb-2">
      {label}:
    </label>
    <div className="relative border-2 border-dashed border-black rounded-md h-32">
      <SignatureCanvas
        ref={sigRef}
        penColor="black"
        canvasProps={{
          className: "w-full h-full rounded-md",
        }}
      />
      <button
        type="button"
        onClick={onClear}
        className="absolute top-1 right-1 bg-neutral-200 hover:bg-neutral-300 text-neutral-600 p-1 rounded-full w-6 h-6 flex items-center justify-center"
        title="Limpiar firma"
      >
        <FontAwesomeIcon icon={faSignature} size="xs" />
      </button>
    </div>
    {error && <div className="text-error text-sm mt-1">{error}</div>}
  </div>
);

/**
 * @function FormSkeleton
 * @description Componente de esqueleto de carga que imita la estructura del formulario.
 * @returns {JSX.Element}
 */
export const FormSkeleton = () => (
  <div className="bg-surface p-8 rounded-xl shadow-lg w-full max-w-2xl animate-pulse">
    <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      ))}
      <div className="md:col-span-2 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-20 bg-gray-200 rounded"></div>
      </div>
    </div>
    <div className="flex justify-end gap-4 mt-8">
      <div className="h-10 bg-gray-200 rounded w-24"></div>
      <div className="h-10 bg-gray-300 rounded w-32"></div>
    </div>
  </div>
);

/**
 * @function PackagesEnviarForm
 * @description Renderiza el formulario de envío de paquetes con todos sus campos, estados de carga y manejo de errores.
 *
 * @returns {JSX.Element} El elemento JSX que contiene el formulario de registro.
 */
export default function PackagesEnviarForm({
  onClose,
  onSuccess,
  isModal = false,
}) {
  /**
   * @const {object} formLogic
   * @description Desestructuración de todos los estados y funciones proporcionadas por el hook de lógica.
   */
  const {
    formik,
    tiposPaquetes,
    areas,
    isLoading,
    errorCarga,
    handleClickClear,
    handleKeyTextDown,
    handleAddressKeyDown,
    error: submitError,
    validadorSigPadRef,
    remitenteSigPadRef,
  } = usePackageEnviar(onSuccess);

  const inputClasses =
    "mt-2 block w-full rounded-md font-semibold border-2 border-neutral-200 p-2 outline-none bg-background focus:border-secondary focus:ring-1 focus:ring-secondary-light transition-all";

  if (isLoading && isModal) {
    return <div className="p-8 text-center text-text-main">Cargando...</div>; // Spinner simple para modal
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 overflow-y-auto animate-fade-in">
      {/* Contenedor principal del modal */}
      <div className="rounded-lg shadow-xl w-full max-w-4xl flex flex-col">
        <header className="p-4 flex justify-between items-center border-b border-gray-200 bg-secondary z-10">
          <h2 className="text-xl md:text-2xl font-bold flex items-center text-surface gap-3">
            <FontAwesomeIcon icon={faUpload} />
            Enviar Nuevo Paquete
          </h2>
          <button
            onClick={onClose}
            className="text-text-main hover:text-error transition-colors"
          >
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </header>
        {/* Formulario Principal */}
        <FormikProvider value={formik}>
          <form
            onSubmit={formik.handleSubmit}
            className="bg-surface p-6 shadow-xl w-full font-semibold"
            noValidate
          >
            {/* Mensaje de error de carga inicial */}
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

            {/* Campos del formulario (solo se muestran si no hay carga ni error de carga) */}
            {!isLoading && !errorCarga && (
              <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 p-4 rounded-md border border-neutral-200 shadow-neutral-200 shadow-sm">
                <legend className="px-2 font-semibold text-secondary text-lg">
                  Datos del Paquete
                </legend>

                {/* Campo: Tipo de Paquete */}
                <label className="block" htmlFor="tipo_paquete">
                  <span className="text-text-main font-semibold">
                    Tipo de Paquete:
                  </span>
                  <Field
                    as="select" // Usa Field
                    id="tipo_paquete"
                    name="id_tipo_paquete"
                    className={inputClasses}
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
                  </Field>
                  {formik.touched.id_tipo_paquete &&
                    formik.errors.id_tipo_paquete && (
                      <div className="text-error text-sm mt-1">
                        {formik.errors.id_tipo_paquete}
                      </div>
                    )}
                </label>

                {/* Campo: Nombre del Remitente */}
                <label className="block" htmlFor="nombre_remitente">
                  <span className="text-text-main font-semibold">
                    Nombre De Quien Envía (Empleado):
                  </span>
                  <Field
                    id="nombre_remitente"
                    type="text"
                    autoComplete="off"
                    onKeyDown={handleKeyTextDown}
                    name="nombre_remitente"
                    className={inputClasses}
                  />
                  {formik.touched.nombre_remitente &&
                    formik.errors.nombre_remitente && (
                      <div className="text-error text-sm mt-1">
                        {formik.errors.nombre_remitente}
                      </div>
                    )}
                </label>

                {/* Campo: Área */}
                <label className="block" htmlFor="id_area">
                  <span className="text-text-main font-semibold">
                    Área De Donde Viene El Paquete (Empresa):
                  </span>
                  <Field
                    as="select"
                    id="id_area"
                    name="id_area"
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
                  </Field>
                  {formik.touched.id_area && formik.errors.id_area && (
                    <div className="text-error text-sm mt-1">
                      {formik.errors.id_area}
                    </div>
                  )}
                </label>

                {/* Campo: Empresa de Transporte */}
                <label className="block" htmlFor="empresa_transporte">
                  <span className="text-text-main text-sm font-semibold">
                    Empresa De Transporte Que Lleva El Paquete (Opcional):
                  </span>
                  <Field
                    id="empresa_transporte"
                    type="text"
                    placeholder="EJEMPLO: ServiEntrega."
                    autoComplete="off"
                    name="empresa_transporte"
                    className={inputClasses}
                  />
                  {/* Opcional: mostrar error si existe */}
                  {formik.touched.empresa_transporte &&
                    formik.errors.empresa_transporte && (
                      <div className="text-error text-sm mt-1">
                        {formik.errors.empresa_transporte}
                      </div>
                    )}
                </label>

                {/* Campo: Nombre del Mensajero */}
                <label className="block" htmlFor="mensajero_nombre">
                  <span className="text-text-main font-semibold">
                    Nombre del Mensajero (Opcional):
                  </span>
                  <Field
                    id="mensajero_nombre"
                    type="text"
                    autoComplete="off"
                    name="mensajero_nombre"
                    onKeyDown={handleKeyTextDown}
                    className={inputClasses}
                  />
                  {/* Opcional: mostrar error si existe */}
                  {formik.touched.mensajero_nombre &&
                    formik.errors.mensajero_nombre && (
                      <div className="text-error text-sm mt-1">
                        {formik.errors.mensajero_nombre}
                      </div>
                    )}
                </label>

                {/* Campo: Destino de Salida */}
                <label className="block" htmlFor="destino_salida">
                  <span className="text-text-main font-semibold">
                    Destino del paquete:
                  </span>
                  <Field
                    id="destino_salida"
                    type="text"
                    autoComplete="off"
                    placeholder="EJEMPLO: Septima - cali."
                    onKeyDown={handleAddressKeyDown}
                    name="destino_salida"
                    className={inputClasses}
                  />
                  {formik.touched.destino_salida &&
                    formik.errors.destino_salida && (
                      <div className="text-error text-sm mt-1">
                        {formik.errors.destino_salida}
                      </div>
                    )}
                </label>

                {/* Checkbox y Campo de Guía Condicional */}
                <div className="col-span-1 md:col-span-2">
                  <label
                    className="flex items-center justify-center space-x-2"
                    htmlFor="conGuia"
                  >
                    <Field
                      id="conGuia"
                      type="checkbox"
                      name="conGuia"
                      className="rounded text-primary"
                    />
                    <span className="text-text-main font-semibold">
                      El paquete tiene número de guía?
                    </span>
                  </label>
                  {formik.values.conGuia && (
                    <div className="mt-2">
                      <label className="block" htmlFor="guia">
                        <span className="text-text-main font-semibold">
                          Número de Guía:
                        </span>
                        <Field
                          id="guia"
                          type="text"
                          name="guia"
                          autoComplete="off"
                          className={inputClasses}
                        />
                        {formik.touched.guia && formik.errors.guia && (
                          <div className="text-error text-sm mt-1">
                            {formik.errors.guia}
                          </div>
                        )}
                      </label>
                    </div>
                  )}
                </div>

                <div className="md:col-span-2 mt-4 border-t border-neutral-300 pt-4">
                  <legend className="px-2 font-semibold text-secondary text-lg">
                    Detalles de Mercancía (Producción)
                  </legend>
                </div>

                {/* Campo: Proveedor */}
                <label className="block" htmlFor="proveedor">
                  <span className="text-text-main font-semibold">
                    Proveedor:
                  </span>
                  <Field
                    id="proveedor"
                    type="text"
                    autoComplete="off"
                    onKeyDown={handleKeyTextDown}
                    name="proveedor"
                    className={inputClasses}
                  />
                  {formik.touched.proveedor && formik.errors.proveedor && (
                    <div className="text-error text-sm mt-1">
                      {formik.errors.proveedor}
                    </div>
                  )}
                </label>

                {/* Campo: OP (Orden de Producción) */}
                <label className="block" htmlFor="op">
                  <span className="text-text-main font-semibold">
                    OP (Orden de Producción):
                  </span>
                  <Field
                    id="op"
                    type="number"
                    autoComplete="off"
                    name="op"
                    className={inputClasses}
                  />
                  {formik.touched.op && formik.errors.op && (
                    <div className="text-error text-sm mt-1">
                      {formik.errors.op}
                    </div>
                  )}
                </label>

                {/* Campo: Referencia */}
                <label className="block" htmlFor="referencia">
                  <span className="text-text-main font-semibold">
                    Referencia:
                  </span>
                  <Field
                    id="referencia"
                    type="number"
                    autoComplete="off"
                    name="referencia"
                    className={inputClasses}
                  />
                  {formik.touched.referencia && formik.errors.referencia && (
                    <div className="text-error text-sm mt-1">
                      {formik.errors.referencia}
                    </div>
                  )}
                </label>

                {/* Campo: Cantidad */}
                <label className="block" htmlFor="cantidad">
                  <span className="text-text-main font-semibold">
                    Cantidad:
                  </span>
                  <Field
                    id="cantidad"
                    type="number"
                    autoComplete="off"
                    name="cantidad"
                    className={inputClasses}
                  />
                  {formik.touched.cantidad && formik.errors.cantidad && (
                    <div className="text-error text-sm mt-1">
                      {formik.errors.cantidad}
                    </div>
                  )}
                </label>

                {/* Campo: Observaciones (Colspan 2) */}
                <div className="col-span-1 md:col-span-2">
                  <label className="block" htmlFor="observaciones">
                    <span className="text-text-main font-semibold">
                      Observaciones Del Paquete o Los Paquetes (Opcional):
                    </span>
                    <Field
                      as="textarea"
                      id="observaciones"
                      name="observaciones"
                      placeholder="EJEMPLO: Paquetes En Buenas Condiciones."
                      autoComplete="off"
                      className={inputClasses}
                      rows="3"
                    />
                  </label>
                </div>

                <div className="md:col-span-2 mt-4 border-t border-neutral-300 pt-4">
                  <legend className="px-2 font-semibold text-secondary text-lg">
                    Firmas de Envío
                  </legend>
                </div>

                <SignatureField
                  label="Firma Validador (Portero)"
                  sigRef={validadorSigPadRef}
                  onClear={() => validadorSigPadRef.current?.clear()}
                  error={
                    formik.touched.path_firma_validador_envio &&
                    formik.errors.path_firma_validador_envio
                  }
                />
                <SignatureField
                  label="Firma Remitente (Empleado)"
                  sigRef={remitenteSigPadRef}
                  onClear={() => remitenteSigPadRef.current?.clear()}
                  error={
                    formik.touched.path_firma_remitente &&
                    formik.errors.path_firma_remitente
                  }
                />
              </fieldset>
            )}

            {submitError && formik.submitCount > 0 && (
              <div className="bg-red-100 border border-red-400 text-error px-4 py-3 rounded-md relative text-center mt-[30px] mb-[5px]">
                <span className="block sm:inline">{submitError}</span>
              </div>
            )}

            {/* Botones de acción */}
            <div className="mt-6 flex justify-center space-x-4">
              <button
                type="button"
                onClick={handleClickClear}
                className="flex items-center bg-neutral-400 text-surface font-bold py-2 px-4 sm:px-6 rounded-md hover:bg-tertiary sm: transition-colors"
              >
                <FontAwesomeIcon icon={faBroom} className="mr-2 text-xl" />
                Limpiar
              </button>
              <button
                type="submit"
                className="flex items-center px-6 py-2 bg-secondary text-surface font-bold rounded-md hover:bg-secondary-hover transition-colors duration-200"
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
        </FormikProvider>
      </div>
    </div>
  );
}
