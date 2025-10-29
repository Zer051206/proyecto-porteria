/**
 * @file VehicleForm.jsx
 * @module Components/Parking
 * @description Componente de React que renderiza un formulario modal para la creación de uno o más vehículos.
 * Utiliza un patrón de formulario dinámico con Formik y FieldArray, permitiendo al usuario añadir o quitar
 * formularios para vehículos individuales dentro de una misma transacción.
 * @requires react
 * @requires formik
 * @requires @fortawesome/react-fontawesome
 * @requires ../../hooks/parking/useVehicleForm.js // (Contiene useVehicleForm)
 * @requires ../../utils/inputUtilities.js // Asumido para onKeyDown
 */
import React from "react";
import {
  useVehicleForm,
  initialVehicleValues,
} from "../../hooks/parking/useVehicleForm.js";
import { FieldArray, FormikProvider, getIn, Field } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrash,
  faTimes,
  faCar,
} from "@fortawesome/free-solid-svg-icons";
import {
  handleKeyNumberDown,
  handleKeyTextDown,
} from "../../utils/inputUtilities.js";

/**
 * @function VehicleSubForm
 * @description Subcomponente que renderiza un conjunto de campos para un único Vehículo dentro del FieldArray.
 * @param {object} props - Propiedades del componente.
 * @param {object} props.formik - La instancia de Formik del formulario principal.
 * @param {number} props.index - El índice del vehículo actual en el array `vehicles`.
 * @param {Function} props.onRemove - Función de FieldArray para eliminar este sub-formulario.
 * @returns {JSX.Element}
 */
const VehicleSubForm = ({ formik, index, onRemove }) => {
  // Obtiene el estado actual de este vehículo específico
  const vehicle = formik.values.vehicles[index];
  // Obtiene el tipo de vehículo seleccionado para lógica condicional
  const tipoVehiculo = vehicle.tipo_vehiculo;

  /**
   * @function getError
   * @description Función auxiliar para obtener el mensaje de error de un campo anidado en Formik.
   * @param {string} fieldName - El nombre del campo (ej. "placa").
   * @returns {string|null} El mensaje de error si el campo ha sido tocado y tiene un error.
   */
  const getError = (fieldName) => {
    const error = getIn(formik.errors, `vehicles[${index}].${fieldName}`);
    const touched = getIn(formik.touched, `vehicles[${index}].${fieldName}`);
    return touched && error ? error : null;
  };

  const inputClasses =
    "mt-1 block w-full rounded-md font-semibold border-2 border-neutral-300 p-2 outline-none bg-background focus:border-secondary focus:ring-1 focus:ring-secondary-light transition-all duration-200";
  const errorTextClasses = "text-error text-sm mt-1";

  return (
    // Contenedor para un sub-formulario, con borde y botón de eliminar
    <div className="bg-background/50 p-4 md:p-6 rounded-lg shadow-inner relative border border-neutral-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-secondary">
          Vehículo #{index + 1}
        </h3>
        {/* Solo muestra el botón de eliminar si hay más de un vehículo */}
        {formik.values.vehicles.length > 1 && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="text-accent hover:text-error transition-colors"
            title="Eliminar este vehículo"
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        )}
      </div>

      {/* --- Campos del Formulario --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
        {/* --- CAMPO: TIPO DE VEHÍCULO (Obligatorio) --- */}
        <label className="block">
          <span className="text-text-main font-semibold">
            Tipo de Vehículo:
          </span>
          <Field
            as="select"
            name={`vehicles[${index}].tipo_vehiculo`}
            className={inputClasses}
          >
            <option value="" disabled hidden>
              Seleccione un tipo...
            </option>
            <option value="Carro">Carro</option>
            <option value="Moto">Moto</option>
            <option value="Bicicleta">Bicicleta</option>
            <option value="Otros">Otros</option>
          </Field>
          {getError("tipo_vehiculo") && (
            <div className={errorTextClasses}>{getError("tipo_vehiculo")}</div>
          )}
        </label>
        {/* --- CAMPO: PLACA (Condicional) --- */}
        {/* Solo se muestra si es Carro o Moto */}
        {(tipoVehiculo === "Carro" || tipoVehiculo === "Moto") && (
          <label className="block animate-fade-in">
            <span className="text-text-main font-semibold">Placa:</span>
            <Field
              type="text"
              name={`vehicles[${index}].placa`}
              placeholder="AAA123"
              autoComplete="off"
              className={`${inputClasses} uppercase`}
              onInput={(e) => (e.target.value = e.target.value.toUpperCase())}
            />
            {getError("placa") && (
              <div className={errorTextClasses}>{getError("placa")}</div>
            )}
          </label>
        )}
        {/* --- CAMPO: CÓDIGO SENSOR (Opcional) --- */}
        <label className="block">
          <span className="text-text-main font-semibold">
            Código Sensor (Opcional):
          </span>
          <Field
            type="text"
            name={`vehicles[${index}].codigo_sensor`}
            placeholder="ID del tag NFC/Barras"
            autoComplete="off"
            className={inputClasses}
          />
          {getError("codigo_sensor") && (
            <div className={errorTextClasses}>{getError("codigo_sensor")}</div>
          )}
        </label>
        {/* --- CAMPO: NOMBRE DUEÑO --- */}
        <label className="block">
          <span className="text-text-main font-semibold">
            Nombre del Dueño:
          </span>
          <Field
            type="text"
            name={`vehicles[${index}].nombre_dueno`}
            placeholder="Nombre Apellido"
            autoComplete="off"
            className={inputClasses}
            onKeyDown={handleKeyTextDown}
          />
          {getError("nombre_dueno") && (
            <div className={errorTextClasses}>{getError("nombre_dueno")}</div>
          )}
        </label>
        {/* --- CAMPO: IDENTIFICACIÓN DUEÑO --- */}
        <label className="block">
          <span className="text-text-main font-semibold">
            Identificación del Dueño:
          </span>
          <Field
            type="number"
            name={`vehicles[${index}].identificacion_dueno`}
            placeholder="Número de documento"
            autoComplete="off"
            className={inputClasses}
            onKeyDown={handleKeyNumberDown}
          />
          {getError("identificacion_dueno") && (
            <div className={errorTextClasses}>
              {getError("identificacion_dueno")}
            </div>
          )}
        </label>
        <label className="block animate-fade-in">
          <span className="text-text-main font-semibold">
            Género del Dueño:
          </span>
          <Field
            as="select"
            name={`vehicles[${index}].genero_dueno`}
            className={inputClasses}
          >
            <option value="N/A" disabled hidden>
              Seleccione género...
            </option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
          </Field>
          {getError("genero_dueno") && (
            <div className={errorTextClasses}>{getError("genero_dueno")}</div>
          )}
        </label>
        {/* --- CAMPO: MODELO/DESCRIPCIÓN (Opcional) --- */}
        <label className="block">
          <span className="text-text-main font-semibold">
            Modelo/Descripción (Opcional):
          </span>
          <Field
            type="text"
            name={`vehicles[${index}].modelo_descripcion`}
            placeholder="Ej: Bici roja, Patineta"
            autoComplete="off"
            className={inputClasses}
          />
          {getError("modelo_descripcion") && (
            <div className={errorTextClasses}>
              {getError("modelo_descripcion")}
            </div>
          )}
        </label>
        {/* --- CAMPO: LUGAR ASIGNADO (Opcional) --- */}
        <label className="block">
          <span className="text-text-main font-semibold">
            Lugar Asignado (Opcional):
          </span>
          <Field
            type="text"
            name={`vehicles[${index}].lugar_asignado_default`}
            placeholder="Ej: Gerencia, E-05"
            autoComplete="off"
            className={inputClasses}
          />
          {getError("lugar_asignado_default") && (
            <div className={errorTextClasses}>
              {getError("lugar_asignado_default")}
            </div>
          )}
        </label>
      </div>
    </div>
  );
};

/**
 * @function VehicleForm
 * @description Componente principal del modal para crear Vehículos.
 * Orquesta el formulario dinámico con Formik y FieldArray.
 * @param {object} props - Propiedades del componente.
 * @param {Function} props.onClose - Callback para cerrar el modal.
 * @param {Function} props.onSuccess - Callback a ejecutar tras una creación exitosa.
 * @returns {JSX.Element}
 */
export default function VehicleForm({ onClose, onSuccess }) {
  // Usa el hook para la lógica de Formik y submit
  const formik = useVehicleForm(onSuccess);

  // No necesitamos cargar catálogos (centros, etc.) como en CreateDevicesForm

  return (
    // Fondo oscuro semi-transparente y contenedor del modal
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 pt-12 overflow-y-auto animate-fade-in">
      {/* Contenedor principal del modal */}
      <div className="bg-background rounded-lg shadow-xl w-full max-w-4xl flex flex-col my-8">
        {" "}
        {/* Encabezado del Modal */}
        <header className="p-4 flex justify-between items-center border-b border-neutral-300 bg-background z-10">
          <h2 className="text-2xl font-bold text-secondary flex items-center gap-3">
            <FontAwesomeIcon icon={faCar} />
            Añadir Nuevo(s) Vehículo(s)
          </h2>
          <button
            onClick={onClose}
            className="text-text-main hover:text-error transition-colors"
            aria-label="Cerrar modal"
          >
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </header>
        {/* Proveedor de Formik que envuelve el formulario */}
        <FormikProvider value={formik}>
          <form onSubmit={formik.handleSubmit} noValidate className="p-6">
            {/* FieldArray para los sub-formularios de vehículos */}
            <FieldArray name="vehicles">
              {({ push, remove }) => (
                <div className="space-y-8">
                  {formik.values.vehicles.map((vehicle, index) => (
                    <VehicleSubForm
                      key={index}
                      formik={formik}
                      index={index}
                      onRemove={remove}
                      // No pasamos catálogos
                    />
                  ))}
                  {/* Botón para añadir otro formulario de vehículo */}
                  <button
                    type="button"
                    onClick={() => push(initialVehicleValues)} // Añade un nuevo objeto vacío
                    className="flex items-center gap-2 py-2 px-4 bg-secondary text-surface font-semibold rounded-lg hover:bg-secondary-hover transition-colors"
                  >
                    <FontAwesomeIcon icon={faPlus} /> Añadir otro vehículo
                  </button>
                </div>
              )}
            </FieldArray>

            {/* Línea divisoria y footer con botones */}
            <hr className="my-8 border-neutral-300" />

            <footer className="flex justify-end items-center gap-4">
              {/* Muestra error general de API si existe */}
              {formik.errors.apiError && (
                <div className="text-error text-sm mr-auto">
                  {formik.errors.apiError}
                </div>
              )}

              {/* Botón Cancelar */}
              <button
                type="button"
                onClick={onClose}
                disabled={formik.isSubmitting}
                className="py-2 px-4 rounded-lg bg-neutral-200 hover:bg-neutral-300 text-text-main font-semibold transition-colors"
              >
                Cancelar
              </button>

              {/* Botón Guardar (Submit) */}
              <button
                type="submit"
                disabled={
                  formik.isSubmitting || !(formik.isValid && formik.dirty)
                }
                className="py-2 px-4 rounded-lg bg-secondary text-surface font-bold hover:bg-secondary-hover disabled:bg-secondary/50 disabled:cursor-not-allowed transition-colors"
              >
                {formik.isSubmitting
                  ? "Guardando..."
                  : `Guardar ${formik.values.vehicles.length} Vehículo(s)`}
              </button>
            </footer>
          </form>
        </FormikProvider>
      </div>
    </div>
  );
}
