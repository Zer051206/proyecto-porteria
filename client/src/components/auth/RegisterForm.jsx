import { Link } from 'react-router-dom';
import { useRegisterForm } from '../../hooks/useRegisterForm.js';
import { useGoBack } from '../../hooks/useGoBackHome.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

export default function RegisterForm() {
  const goBack = useGoBack();
  const { 
    nombre, 
    correo, 
    password, 
    apellido, 
    handleRegister, 
    handleClickNombre, 
    handleClickCorreo, 
    handleClickApellido, 
    handleClickPassword
  } = useRegisterForm();

  return (
    <div className="flex flex-col justify-center items-center h-full w-full">
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
      <form className="bg-white p-6 rounded-lg mb-5 shadow-lg w-[90%] h-[95%] max-w-sm mt-[80px] sm:w-full sm:mt-[30px] shadow-black" onSubmit={handleRegister}>
        <h2 className="text-2xl font-bold mb-5 text-center text-blue-900">Registro</h2>
        <fieldset className="p-4 rounded-md mb-[20px] border border-gray-400 shadow-sm shadow-black">
          <legend className="px-2 text-md font-semibold bg-white text-blue-900">Información personal</legend>
          <div className="space-y-4">
            <label className="block">
              <span className="text-gray-700 text-sm">Nombre:</span>
              <input 
                name="nombre"
                type="text" 
                value={nombre} 
                onChange={handleClickNombre} 
                className="mt-1 block w-full rounded-md border-2 p-[5px] outline-0 border-gray-400 bg-gray-50 shadow-lg focus:border-blue-700 transition-all duration-200 hover:border-blue-500"
                autoComplete="off"
                required
              />
            </label>
            <label className="block">
              <span className="text-gray-700 text-sm">Apellido:</span>
              <input 
                name="apellido"
                type="text" 
                value={apellido} 
                onChange={handleClickApellido} 
                className="mt-1 block w-full rounded-md border-2 p-[5px] outline-0 border-gray-400 bg-gray-50 shadow-lg focus:border-blue-700 focus:ring-2 focus:ring-blue-300 transition-all duration-200 ease-in-out hover:border-blue-500"
                autoComplete="off"
                required
              />
            </label>
          </div>
        </fieldset>

        <fieldset className="p-4 rounded-md mb-3 border border-gray-400 shadow-sm shadow-black">
          <legend className="px-2 text-md font-semibold bg-white text-blue-900">Datos de la cuenta</legend>
          <div className="space-y-4">
            <label className="block">
              <span className="text-gray-700 text-sm">Correo electrónico:</span>
              <input 
                name="correo"
                type="email" 
                value={correo} 
                onChange={handleClickCorreo} 
                className="mt-1 block w-full rounded-md border-2 p-[5px] outline-0 border-gray-400 bg-gray-50 shadow-lg focus:border-blue-700 focus:ring-2 focus:ring-blue-300 transition-all duration-200 ease-in-out hover:border-blue-500"
                autoComplete="off"
                required
              />
            </label>
            <label className="block">
              <span className="text-gray-700 text-sm">Contraseña:</span>
              <input 
                name="password"
                type="password" 
                value={password} 
                onChange={handleClickPassword} 
                className="mt-1 block w-full rounded-md border-2 p-[5px] outline-0 border-gray-400 bg-gray-50 shadow-lg focus:border-blue-700 focus:ring-2 focus:ring-blue-300 transition-all duration-200 ease-in-out hover:border-blue-500"
                autoComplete="off"
                required
              />
            </label>
          </div>
        </fieldset>

        <button
          type="submit"
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
        >
          Registrarse
        </button>

        <div className="mt-4 text-center text-sm">
          <span className="text-gray-600">¿Ya tienes una cuenta?</span>{' '}
          <Link to="/auth/login" className="text-blue-600 hover:underline">Inicia sesión</Link>
        </div>
      </form>
    </div>
  );
}