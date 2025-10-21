/**
 * @file VisitEntryForm.jsx
 * @module Components/Visits
 * @description Componente de formulario para registrar la entrada de un visitante.
 * @requires react
 * @requires ../../hooks/visits/useVisitEntryForm.js
 */
import React from "react";
import useVisitEntryForm from "../../hooks/visits/useVisitEntryForm.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBroom, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import SignatureCanvas from "react-signature-canvas";

const FormSkeleton = () => (
  <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-4xl animate-pulse">
    <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  </div>
);

/**
 * @function VisitEntryForm
 * @description Renderiza el formulario de registro de visitantes.
 * @returns {JSX.Element}
 */
export default function VisitEntryForm() {
  const {
    formik,
    areas,
    tiposIdentificacion,
    isLoadingCatalogs,
    handleClear,
    sigCanvas,
  } = useVisitEntryForm();

  const inputClasses =
    "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 transition-colors";

  if (isLoadingCatalogs) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen w-full p-4 bg-gray-100">
        <FormSkeleton />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full animate-fade-in">
      <form
        onSubmit={formik.handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-4xl"
        noValidate
      >
        <div className="mb-6 border-b border-gray-200 pb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Registro de Nueva Visita
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {/* Columna Izquierda */}
          <div className="space-y-6">
            <label className="block">
              <span className="text-gray-700 font-semibold">Nombre:</span>
              <input
                type="text"
                className={inputClasses}
                {...formik.getFieldProps("nombre_visitante")}
              />
              {formik.touched.nombre_visitante &&
                formik.errors.nombre_visitante && (
                  <div className="text-red-600 text-sm mt-1">
                    {formik.errors.nombre_visitante}
                  </div>
                )}
            </label>
            <label className="block">
              <span className="text-gray-700 font-semibold">Apellido:</span>
              <input
                type="text"
                className={inputClasses}
                {...formik.getFieldProps("apellido")}
              />
              {formik.touched.apellido && formik.errors.apellido && (
                <div className="text-red-600 text-sm mt-1">
                  {formik.errors.apellido}
                </div>
              )}
            </label>
            <label className="block">
              <span className="text-gray-700 font-semibold">Teléfono:</span>
              <input
                type="tel"
                className={inputClasses}
                {...formik.getFieldProps("telefono")}
              />
              {formik.touched.telefono && formik.errors.telefono && (
                <div className="text-red-600 text-sm mt-1">
                  {formik.errors.telefono}
                </div>
              )}
            </label>
            <label className="block">
              <span className="text-gray-700 font-semibold">
                Empresa (Opcional):
              </span>
              <input
                type="text"
                className={inputClasses}
                {...formik.getFieldProps("empresa")}
              />
            </label>
          </div>

          {/* Columna Derecha */}
          <div className="space-y-6">
            <label className="block">
              <span className="text-gray-700 font-semibold">
                Tipo de Identificación:
              </span>
              <select
                className={inputClasses}
                {...formik.getFieldProps("id_tipo_identificacion")}
              >
                <option value="" hidden>
                  Seleccione un tipo...
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
              {formik.touched.id_tipo_identificacion &&
                formik.errors.id_tipo_identificacion && (
                  <div className="text-red-600 text-sm mt-1">
                    {formik.errors.id_tipo_identificacion}
                  </div>
                )}
            </label>
            <label className="block">
              <span className="text-gray-700 font-semibold">
                Número de Identificación:
              </span>
              <input
                type="text"
                className={inputClasses}
                {...formik.getFieldProps("identificacion")}
              />
              {formik.touched.identificacion &&
                formik.errors.identificacion && (
                  <div className="text-red-600 text-sm mt-1">
                    {formik.errors.identificacion}
                  </div>
                )}
            </label>
            <label className="block">
              <span className="text-gray-700 font-semibold">
                Persona a Visitar:
              </span>
              <input
                type="text"
                className={inputClasses}
                {...formik.getFieldProps("nombre_destinatario")}
              />
              {formik.touched.nombre_destinatario &&
                formik.errors.nombre_destinatario && (
                  <div className="text-red-600 text-sm mt-1">
                    {formik.errors.nombre_destinatario}
                  </div>
                )}
            </label>
            <label className="block">
              <span className="text-gray-700 font-semibold">
                Área de Destino:
              </span>
              <select
                className={inputClasses}
                {...formik.getFieldProps("id_area")}
              >
                <option value="" hidden>
                  Seleccione un área...
                </option>
                {areas.map((area) => (
                  <option key={area.id_area} value={area.id_area}>
                    {area.nombre_area}
                  </option>
                ))}
              </select>
              {formik.touched.id_area && formik.errors.id_area && (
                <div className="text-red-600 text-sm mt-1">
                  {formik.errors.id_area}
                </div>
              )}
            </label>
          </div>

          {/* Campos que ocupan todo el ancho */}
          <div className="md:col-span-2">
            <label className="block">
              <span className="text-gray-700 font-semibold">
                Motivo de la Visita:
              </span>
              <textarea
                className={inputClasses}
                rows="3"
                {...formik.getFieldProps("motivo")}
              ></textarea>
              {formik.touched.motivo && formik.errors.motivo && (
                <div className="text-red-600 text-sm mt-1">
                  {formik.errors.motivo}
                </div>
              )}
            </label>
          </div>
          <div className="md:col-span-2">
            <label className="block">
              <span className="text-gray-700 font-semibold">
                Observaciones (Opcional):
              </span>
              <textarea
                className={inputClasses}
                rows="3"
                {...formik.getFieldProps("observaciones")}
              ></textarea>
            </label>
          </div>
        </div>

        <div className="mt-6">
          <label className="block mb-2 text-gray-700 font-semibold">
            Firma del Visitante (Obligatoria):
          </label>
          <div className="w-full border-2 border-dashed border-gray-300 rounded-md bg-gray-50">
            <SignatureCanvas
              ref={sigCanvas}
              penColor="black"
              canvasProps={{ className: "sigCanvas w-full h-40 rounded-md" }}
            />
          </div>
        </div>

        {formik.errors.apiError && (
          <div
            className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-center"
            role="alert"
          >
            <span>{formik.errors.apiError}</span>
          </div>
        )}

        <footer className="mt-8 flex justify-end items-center gap-4">
          <button
            type="button"
            onClick={handleClear}
            className="flex items-center bg-gray-500 text-white font-bold py-2 px-4 rounded-md hover:bg-gray-600 transition-colors"
          >
            <FontAwesomeIcon icon={faBroom} className="mr-2" /> Limpiar
          </button>
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="flex items-center bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
          >
            {formik.isSubmitting ? (
              "Registrando..."
            ) : (
              <>
                {" "}
                <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />{" "}
                Registrar Visita{" "}
              </>
            )}
          </button>
        </footer>
      </form>
    </div>
  );
}
