/**
 * @file RecibirPaqueteForm.jsx
 * @module components/packages/RecibirPaqueteForm.jsx
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
import React, { useMemo } from "react";
import usePackagesRecibir from "../../hooks/packages/usePackagesRecibir.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBroom,
  faCheckCircle,
  faExclamationTriangle,
  faTimes,
  faDownload,
  faSignature,
} from "@fortawesome/free-solid-svg-icons";
import { FormikProvider, Field } from "formik";
import SignatureCanvas from "react-signature-canvas";

/**
 * @function SignatureField
 * @description Subcomponente reutilizable para un campo de firma.
 * @param {object} props
 * @param {string} props.label - Etiqueta para el campo.
 * @param {React.RefObject} props.sigRef - Ref para el canvas de la firma.
 * @param {string|null} props.error - Mensaje de error de Formik.
 * @param {Function} props.onClear - Función para limpiar el canvas.
 * @returns {JSX.Element}
 */
const SignatureField = ({ label, sigRef, error, onClear }) => (
  <div className="md:col-span-1 flex flex-col">
    <label className="block text-text-main text-sm font-medium mb-1">
      {label}:
    </label>
    <div className="relative border-2 border-dashed border-neutral-300 rounded-md h-32">
      {" "}
      {/* Altura fija */}
      <SignatureCanvas
        ref={sigRef}
        penColor="black"
        canvasProps={{
          className: "w-full h-full rounded-md", // Ocupa todo el div
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
    recibeSigPadRef,
    validadorSigPadRef,
    entregadorSigPadRef,
    ID_TIPO_DOCUMENTO,
    ID_AREA_CONTABILIDAD,
  } = usePackagesRecibir(onSuccess);

  const isDocumento = formik.values.id_tipo_paquete == ID_TIPO_DOCUMENTO;
  const isRadicado = formik.values.es_radicado;

  const inputClasses =
    "mt-2 block w-full rounded-md font-semibold border-2 border-neutral-200 p-2 outline-none bg-background focus:border-secondary focus:ring-1 focus:ring-secondary-light transition-all";

  const nombreContabilidad = useMemo(() => {
    if (!areas || areas.length === 0) return "Contabilidad"; // Fallback
    // Busca el área por ID
    const area = areas.find((a) => a.id_area === ID_AREA_CONTABILIDAD);
    return area ? area.nombre_area : "Contabilidad"; // Devuelve el nombre o un fallback
  }, [areas, ID_AREA_CONTABILIDAD]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 pt-8 overflow-y-auto animate-fade-in">
      <div className="bg-surface rounded-lg shadow-xl w-full h-full max-w-4xl flex flex-col">
        {/* Encabezado del Modal */}
        <header className="p-4 flex justify-between items-center border-b border-neutral-300 bg-primary z-10">
          <h2 className="text-xl md:text-2xl font-bold text-surface flex items-center gap-3">
            <FontAwesomeIcon icon={faDownload} />
            Recibir Paquete
          </h2>
          <button
            onClick={onClose}
            className="text-text-main hover:text-error transition-colors "
            aria-label="Cerrar modal"
          >
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </header>

        {/* Proveedor de Formik */}
        <FormikProvider value={formik}>
          <form
            onSubmit={formik.handleSubmit}
            noValidate
            className="p-6 overflow-y-auto"
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
              <fieldset className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <legend className="px-2 font-semibold text-primary mb-4 md:col-span-2 text-lg">
                  Datos del Paquete
                </legend>

                {/* Campo Tipo de Paquete */}
                <label className="block">
                  <span className="text-text-main text-sm font-medium">
                    Tipo de Paquete:
                  </span>
                  <Field
                    as="select"
                    name="id_tipo_paquete"
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
                  </Field>
                  {formik.touched.id_tipo_paquete &&
                    formik.errors.id_tipo_paquete && (
                      <div className="text-error text-sm mt-1">
                        {formik.errors.id_tipo_paquete}
                      </div>
                    )}
                </label>

                {/* Campo Nombre del Destinatario */}
                <label className="block">
                  <span className="text-text-main text-sm font-medium">
                    Nombre Destinatario (Interno):
                  </span>
                  <Field
                    type="text"
                    name="nombre_destinatario"
                    placeholder="Pepito Perez..."
                    onKeyDown={handleKeyTextDown}
                    autoComplete="off"
                    className={inputClasses}
                  />
                  {formik.touched.nombre_destinatario &&
                    formik.errors.nombre_destinatario && (
                      <div className="text-error text-sm mt-1">
                        {formik.errors.nombre_destinatario}
                      </div>
                    )}
                </label>

                {/* --- Lógica Condicional para Documentos / Radicados --- */}

                {/* Campo Área */}
                {isDocumento && isRadicado ? (
                  <label className="block animate-fade-in">
                    <span className="text-text-main text-sm font-medium">
                      Área Destino (Automático):
                    </span>
                    <input
                      type="text"
                      name="id_area_display"
                      value={nombreContabilidad}
                      disabled={true}
                      className={`${inputClasses} bg-neutral-100 text-neutral-500 cursor-not-allowed`}
                    />
                    {/* Muestra error de área si existe (ej. si falló la validación) */}
                    {formik.touched.id_area && formik.errors.id_area && (
                      <div className="text-error text-sm mt-1">
                        {formik.errors.id_area}
                      </div>
                    )}
                  </label>
                ) : (
                  <label className="block">
                    <span className="text-text-main text-sm font-medium">
                      Área Destino:
                    </span>
                    <Field
                      as="select"
                      name="id_area"
                      className={inputClasses}
                      disabled={false}
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
                )}
                {/* Empresa de Transporte */}
                <label className="block">
                  <span className="text-text-main text-sm font-medium">
                    Empresa Transporte (Opcional):
                  </span>
                  <Field
                    type="text"
                    placeholder="Servientrega, Inter..."
                    name="empresa_transporte"
                    autoComplete="off"
                    className={inputClasses}
                  />
                </label>

                {/* Nombre del Mensajero */}
                <label className="block">
                  <span className="text-text-main text-sm font-medium">
                    Nombre Mensajero (Opcional):
                  </span>
                  <Field
                    type="text"
                    placeholder="Juan Perez..."
                    name="mensajero_nombre"
                    onKeyDown={handleKeyTextDown}
                    autoComplete="off"
                    className={inputClasses}
                  />
                </label>

                {/* Checkbox Con Guía */}
                <div className="flex items-center justify-center pt-4">
                  <label className="flex items-center space-x-2">
                    <Field
                      type="checkbox"
                      name="conGuia"
                      className="rounded text-primary focus:ring-primary"
                    />
                    <span className="text-text-main text-sm font-medium">
                      El paquete tiene número de guía
                    </span>
                  </label>
                </div>

                {/* Input de Guía (Condicional) */}
                {formik.values.conGuia && (
                  <div className="col-span-1 md:col-span-2">
                    <label className="block">
                      <span className="text-text-main text-sm font-medium">
                        Número de Guía:
                      </span>
                      <Field
                        type="text"
                        placeholder="Ingrese la guia del paquete"
                        name="guia"
                        autoComplete="off"
                        className={`${inputClasses} w-full`}
                      />
                      {formik.touched.guia && formik.errors.guia && (
                        <div className="text-error text-sm mt-1">
                          {formik.errors.guia}
                        </div>
                      )}
                    </label>
                  </div>
                )}

                <div className="md:col-span-2 mt-4 border-t border-neutral-300 pt-4">
                  <legend className="px-2 font-semibold text-primary text-lg">
                    Detalles de Mercancía / Producción
                  </legend>
                </div>

                {/* Campo: Proveedor (Obligatorio) */}
                <label className="block">
                  <span className="text-text-main text-sm font-medium">
                    Proveedor:
                  </span>
                  <Field
                    type="text"
                    name="proveedor"
                    placeholder="Nombre del proveedor"
                    autoComplete="off"
                    className={inputClasses}
                  />
                  {formik.touched.proveedor && formik.errors.proveedor && (
                    <div className="text-error text-sm mt-1">
                      {formik.errors.proveedor}
                    </div>
                  )}
                </label>

                {/* Campo: OP (Orden de Producción) (Obligatorio) */}
                <label className="block">
                  <span className="text-text-main text-sm font-medium">
                    OP:
                  </span>
                  <Field
                    type="number"
                    name="op"
                    placeholder="Número de Orden de Producción"
                    autoComplete="off"
                    className={inputClasses}
                  />
                  {formik.touched.op && formik.errors.op && (
                    <div className="text-error text-sm mt-1">
                      {formik.errors.op}
                    </div>
                  )}
                </label>

                {/* Campo: Referencia (Obligatorio) */}
                <label className="block">
                  <span className="text-text-main text-sm font-medium">
                    Referencia:
                  </span>
                  <Field
                    type="text" // Cambié a text para permitir alfanumérico si es necesario
                    name="referencia"
                    placeholder="Número o clave de referencia"
                    autoComplete="off"
                    className={inputClasses}
                  />
                  {formik.touched.referencia && formik.errors.referencia && (
                    <div className="text-error text-sm mt-1">
                      {formik.errors.referencia}
                    </div>
                  )}
                </label>

                {/* Campo: Cantidad (Obligatorio) */}
                <label className="block">
                  <span className="text-text-main text-sm font-medium">
                    Cantidad:
                  </span>
                  <Field
                    type="number"
                    name="cantidad"
                    placeholder="Cantidad de ítems"
                    autoComplete="off"
                    className={inputClasses}
                  />
                  {formik.touched.cantidad && formik.errors.cantidad && (
                    <div className="text-error text-sm mt-1">
                      {formik.errors.cantidad}
                    </div>
                  )}
                </label>

                {/* Observaciones */}
                <div className="col-span-1 md:col-span-2">
                  <label className="block">
                    <span className="text-text-main text-sm font-medium">
                      Observaciones (Opcional):
                    </span>
                    <Field
                      as="textarea"
                      name="observaciones"
                      placeholder="El paquete se encuentra en buenas condiciones..."
                      autoComplete="off"
                      className={inputClasses}
                      rows="3"
                    />
                  </label>
                </div>

                {/* Campo Nombre Quien Recibe (Documento) */}
                <label className="block md:col-span-2 animate-fade-in">
                  <span className="text-text-main text-sm font-medium">
                    Nombre Quien Recibe (Empleado):
                  </span>
                  <Field
                    type="text"
                    name="nombre_recibe_documento"
                    placeholder="Nombre completo..."
                    onKeyDown={handleKeyTextDown}
                    autoComplete="off"
                    className={inputClasses}
                  />
                  {formik.touched.nombre_recibe_documento &&
                    formik.errors.nombre_recibe_documento && (
                      <div className="text-error text-sm mt-1">
                        {formik.errors.nombre_recibe_documento}
                      </div>
                    )}
                </label>

                <SignatureField
                  label="Firma Receptor (Empleado)"
                  sigRef={recibeSigPadRef}
                  onClear={() => recibeSigPadRef.current?.clear()}
                  error={
                    formik.touched.path_firma_recibe_documento &&
                    formik.errors.path_firma_recibe_documento
                  }
                />

                <SignatureField
                  label="Firma Validador (Portero)"
                  sigRef={validadorSigPadRef}
                  onClear={() => validadorSigPadRef.current?.clear()}
                  error={
                    formik.touched.path_firma_validador &&
                    formik.errors.path_firma_validador
                  }
                />

                {isDocumento && (
                  <>
                    <div className="md:col-span-2 mt-4 border-t border-neutral-300 pt-4">
                      <legend className="px-2 font-semibold text-accent text-base">
                        Datos de Documento / Radicado
                      </legend>
                    </div>

                    {/* Checkbox "Es Radicado?" */}
                    <label className="md:col-span-2 flex items-center justify-center gap-2 py-2">
                      <Field
                        type="checkbox"
                        name="es_radicado"
                        className="rounded text-primary focus:ring-primary"
                      />
                      <span className="text-text-main text-lg font-medium">
                        ¿Es un Radicado?
                      </span>
                    </label>

                    {/* --- Lógica Condicional Solo para Radicados --- */}
                    {isRadicado && (
                      <>
                        {/* Campo Referencia Radicado */}
                        <label className="block md:col-span-2 animate-fade-in">
                          <span className="text-text-main font-medium">
                            N° Referencia Radicado:
                          </span>
                          <Field
                            type="text"
                            name="referencia_radicado"
                            placeholder="Ingrese el número de referencia único"
                            autoComplete="off"
                            className={inputClasses}
                          />
                          {formik.touched.referencia_radicado &&
                            formik.errors.referencia_radicado && (
                              <div className="text-error text-sm mt-1">
                                {formik.errors.referencia_radicado}
                              </div>
                            )}
                        </label>

                        {/* Firma de Radicado */}
                        <div className="block md:col-span-2 animate-fade-in">
                          <SignatureField
                            label="Firma Entregador (Mensajero)"
                            sigRef={entregadorSigPadRef}
                            onClear={() => entregadorSigPadRef.current?.clear()}
                            error={
                              formik.touched.path_firma_entregador &&
                              formik.errors.path_firma_entregador
                            }
                          />
                        </div>
                      </>
                    )}
                  </>
                )}
              </fieldset>
            )}

            {/* Mensaje de error general de la API */}
            {formik.errors.apiError && (
              <div className="bg-red-100 border border-red-400 text-error px-4 py-3 rounded-md relative text-center mt-6">
                <span className="block sm:inline">
                  {formik.errors.apiError}
                </span>
              </div>
            )}

            {/* --- Botones de Acción --- */}
            <footer className="mt-8 flex justify-center w-full space-x-4">
              <button
                type="button"
                onClick={handleClickClear}
                disabled={formik.isSubmitting}
                className="flex items-center bg-gray-500 text-white font-bold py-2 px-4 sm:px-6 rounded-md hover:bg-gray-700 transition-colors"
              >
                <FontAwesomeIcon icon={faBroom} className="mr-2 text-xl" />
                Limpiar
              </button>
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
            </footer>
          </form>
        </FormikProvider>
      </div>
    </div>
  );
}
