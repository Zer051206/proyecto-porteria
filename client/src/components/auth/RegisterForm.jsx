/**
 * @file RegisterForm.jsx
 * @module component/auth/RegisterForm.jsx
 * @description Componente funcional que renderiza el formulario de registro de nuevos usuarios.
 * Toda la lógica de manejo de estado, validación y comunicación con la API se delega al hook `useRegisterForm`.
 * @component
 * @requires react-router-dom/Link
 * @requires ../../hooks/useRegisterForm
 * @requires ../../hooks/useGoBackHome
 * @requires ../../hooks/usePasswordToggle
 */
import { Link, useNavigate } from "react-router-dom";
import { useRegisterForm } from "../../hooks/auth/useRegisterForm.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { usePasswordToggle } from "../../hooks/utils/usePasswordToggle.js";

/**
 * @function RegisterFormSkeleton
 * @description Componente de esqueleto de carga que imita la estructura del RegisterForm.
 * @returns {JSX.Element}
 */
export const RegisterFormSkeleton = () => (
  <div className="flex flex-col justify-center items-center w-full min-h-screen bg-gray-100 p-4">
    <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl border border-gray-200 animate-pulse">
      {/* Esqueleto del Título */}
      <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto mb-6"></div>

      {/* Esqueleto del Formulario */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        {/* Nombre */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
        {/* Apellido */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
        {/* Correo (span 2) */}
        <div className="md:col-span-2 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
        {/* Contraseña */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
        {/* Confirmar Contraseña */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* Esqueleto del Botón */}
      <div className="mt-6 h-12 bg-gray-300 rounded"></div>
      {/* Esqueleto del Link */}
      <div className="mt-4 h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
    </div>
  </div>
);

/**
 * @function RegisterForm
 * @description Renderiza el formulario de registro, solicitando el nombre, apellido, correo y contraseña
 * para crear una nueva cuenta de usuario.
 *
 * @returns {JSX.Element} El elemento JSX que representa el formulario de registro.
 */
export default function RegisterForm() {
  const navigate = useNavigate();
  const goBack = () => navigate("/");
  const [inputType, Icon, toggleVisibility] = usePasswordToggle();
  const [inputTypeConfirm, IconConfirm, toggleVisibilityConfirm] =
    usePasswordToggle();
  const formik = useRegisterForm();

  const inputClasses =
    "mt-2 block w-full rounded-md font-semibold border-2 border-neutral-200 p-2 outline-none bg-background focus:border-secondary focus:ring-1 focus:ring-secondary-light transition-all";

  return (
    <div className="flex flex-col justify-center items-center w-full min-h-screen bg-gray-100 p-4">
      <button
        type="button"
        onClick={goBack}
        className="absolute top-4 left-4 bg-surface text-text-main font-bold p-3 rounded-full shadow-md md:w-1/12 w-1/5  hover:bg-background transition-colors"
        aria-label="Volver a la página de inicio"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="text-xl" />
      </button>

      <form
        onSubmit={formik.handleSubmit}
        className="bg-surface p-8 rounded-xl shadow-lg mt-[70px] md:mt-0 mb-10 md:mb-0 w-full max-w-2xl border border-surface animate-fade-in"
        noValidate
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Crear Nueva Cuenta
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {/* Campo Nombre */}
          <label className="block">
            <span className="text-text-main font-semibold">Nombre:</span>
            <input
              className={inputClasses}
              type="text"
              autoComplete="off"
              {...formik.getFieldProps("nombre")}
            />
            {formik.touched.nombre && formik.errors.nombre ? (
              <div className="text-error text-sm mt-1">
                {formik.errors.nombre}
              </div>
            ) : null}
          </label>

          {/* Campo Apellido */}
          <label className="block">
            <span className="text-text-main font-semibold">Apellido:</span>
            <input
              className={inputClasses}
              type="text"
              autoComplete="off"
              {...formik.getFieldProps("apellido")}
            />
            {formik.touched.apellido && formik.errors.apellido ? (
              <div className="text-error text-sm mt-1">
                {formik.errors.apellido}
              </div>
            ) : null}
          </label>

          {/* Campo Correo Electrónico */}
          <div className="md:col-span-2">
            <label className="block">
              <span className="text-text-main font-semibold">
                Correo Electrónico:
              </span>
              <input
                className={inputClasses}
                type="email"
                autoComplete="off"
                {...formik.getFieldProps("correo")}
              />
              {formik.touched.correo && formik.errors.correo ? (
                <div className="text-error text-sm mt-1">
                  {formik.errors.correo}
                </div>
              ) : null}
            </label>
          </div>

          {/* Campo Contraseña */}
          <div className="relative">
            <label className="block">
              <span className="text-text-main font-semibold">Contraseña:</span>
              <input
                type={inputType}
                autoComplete="new-password"
                className={`${inputClasses} pr-10`}
                {...formik.getFieldProps("password")}
              />
              <button
                type="button"
                onClick={toggleVisibility}
                className="absolute right-0 top-[46px] text-sm flex items-center pr-3 text-text-muted"
              >
                <FontAwesomeIcon icon={Icon} />
              </button>
              {formik.touched.password && formik.errors.password ? (
                <div className="text-error text-sm mt-1">
                  {formik.errors.password}
                </div>
              ) : null}
            </label>
          </div>

          {/* Campo Confirmar Contraseña */}
          <div className="relative">
            <label className="block">
              <span className="text-text-main font-semibold">
                Confirmar Contraseña:
              </span>
              <input
                type={inputTypeConfirm}
                autoComplete="new-password"
                className={`${inputClasses} pr-10`}
                {...formik.getFieldProps("confirmPassword")}
              />
              <button
                type="button"
                onClick={toggleVisibilityConfirm}
                className="absolute right-0 top-[47px] text-sm flex items-center pr-3 text-text-muted"
              >
                <FontAwesomeIcon icon={IconConfirm} />
              </button>
              {formik.touched.confirmPassword &&
              formik.errors.confirmPassword ? (
                <div className="text-error text-sm mt-1">
                  {formik.errors.confirmPassword}
                </div>
              ) : null}
            </label>
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

        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="mt-6 w-full bg-primary text-text-main font-bold py-3 px-4 rounded-md hover:bg-primary-hover transition-colors disabled:bg-primary-light"
        >
          {formik.isSubmitting ? "Registrando..." : "Crear Cuenta"}
        </button>

        <div className="mt-4 text-center text-sm">
          <span className="text-text-main">¿Ya tienes una cuenta?</span>{" "}
          <Link to="/auth/login" className="text-secondary hover:underline">
            Inicia sesión
          </Link>
        </div>
      </form>
    </div>
  );
}
