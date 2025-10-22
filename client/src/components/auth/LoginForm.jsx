/**
 * @file LoginForm.jsx
 * @module LoginForm
 * @description Componente funcional que renderiza el formulario de inicio de sesión.
 * Utiliza hooks personalizados para manejar la lógica de estado (useLoginForm),
 * la navegación (useGoBackHome) y la visibilidad de la contraseña (usePasswordToggle).
 * @component
 * @requires react-router-dom/Link
 * @requires ../../hooks/useLoginForm
 * @requires ../../hooks/useGoBackHome
 * @requires ../../hooks/utils/usePasswordToggle
 */
import { Link, useNavigate } from "react-router-dom";
import { useLoginForm } from "../../hooks/auth/useLoginForm.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { usePasswordToggle } from "../../hooks/utils/usePasswordToggle.js";

/**
 * @function LoginFormSkeleton
 * @description Componente de esqueleto de carga que imita la estructura del LoginForm.
 * @returns {JSX.Element}
 */
export const LoginFormSkeleton = () => (
  <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm border border-gray-200 animate-pulse">
    <div className="h-8 bg-gray-200 rounded w-2/3 mx-auto mb-6"></div>
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    </div>
    <div className="mt-6 h-12 bg-gray-300 rounded"></div>
    <div className="mt-4 h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
  </div>
);

/**
 * @function LoginForm
 * @description Renderiza el formulario de inicio de sesión, permitiendo al usuario ingresar
 * su correo y contraseña.
 *
 * La lógica de manejo de estado, la validación y la llamada a la API
 * se manejan a través del hook `useLoginForm`.
 *
 * @returns {JSX.Element} El elemento JSX que representa el formulario de inicio de sesión.
 */
export default function LoginForm() {
  const navigate = useNavigate();
  const goBack = () => navigate("/");
  const [inputType, Icon, toggleVisibility] = usePasswordToggle();
  const formik = useLoginForm();
  const inputClasses =
    "mt-2 block w-full rounded-md font-semibold border-2 border-neutral-200 p-2 outline-none bg-background focus:border-secondary focus:ring-1 focus:ring-secondary-light transition-all";

  return (
    <div className="flex flex-col justify-center items-center w-full min-h-screen bg-background p-4">
      <button
        type="button"
        onClick={goBack}
        className="absolute top-4 left-4 bg-surface text-text-main font-bold p-3 rounded-full shadow-md w-1/5 md:w-1/12 hover:bg-background transition-colors"
        aria-label="Volver a la página de inicio"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="text-xl" />
      </button>

      <form
        onSubmit={formik.handleSubmit}
        className="bg-surface p-8 rounded-xl shadow-lg w-full max-w-md border border-surface animate-fade-in"
        noValidate
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Iniciar Sesión
        </h2>

        <fieldset className="space-y-4">
          {/* Input de Correo Electrónico */}
          <label className="block">
            <span className="text-gray-700 font-semibold">
              Correo electrónico:
            </span>
            <input
              type="email"
              className={inputClasses}
              autoComplete="off"
              {...formik.getFieldProps("correo")}
            />
            {formik.touched.correo && formik.errors.correo ? (
              <div className="text-error text-sm mt-1">
                {formik.errors.correo}
              </div>
            ) : null}
          </label>

          {/* Input de Contraseña */}
          <div className="relative">
            <label className="block">
              <span className="text-gray-700 font-semibold">Contraseña:</span>
              <input
                type={inputType}
                autoComplete="current-password"
                className={`${inputClasses} pr-10`}
                {...formik.getFieldProps("password")}
              />
              <button
                type="button"
                onClick={toggleVisibility}
                className="absolute right-0 top-[46px] flex items-center pr-3 text-sm text-text-muted"
                aria-label="Mostrar u ocultar contraseña"
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
        </fieldset>

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
          {formik.isSubmitting ? "Entrando..." : "Entrar al Sistema"}
        </button>

        <div className="mt-4 text-center text-sm">
          <span className="text-text-main">¿No tienes una cuenta?</span>{" "}
          <Link to="/auth/register" className="text-secondary hover:underline">
            Regístrate aquí
          </Link>
        </div>
      </form>
    </div>
  );
}
