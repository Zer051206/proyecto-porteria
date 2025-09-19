import { useState } from "react"
import axiosClient from "../axiosClient"
import { useNavigate } from "react-router-dom";

export function useRegisterForm () {
  const [ nombre, setNombre ] = useState("");
  const [ apellido, setApellido ] = useState("");
  const [ correo, setCorreo ] = useState("");
  const [ password, setPassword ] = useState("");
  const [ error, setError ] = useState("");
  const [ isLoading, setIsLoading ] = useState("");
  const navigate = useNavigate();

  const handleClickNombre = (e) => setNombre(e.target.value);
  const handleClickApellido = (e) => setApellido(e.target.value);
  const handleClickCorreo = (e) => setCorreo(e.target.value);
  const handleClickPassword = (e) => setPassword(e.target.value);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post('/auth/register', {
        nombre,
        correo,
        apellido,
        password
      })
      alert('Usuario creado exitósamente, será enviado al formulario de inicio de sesión')
      navigate('/auth/login');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Error al registrarse. Por favor, inténtalo de nuevo.');
      } 
    } finally {
      setIsLoading(false);
    }
  }

  return {
    nombre,
    correo,
    password,
    apellido,
    handleRegister,
    handleClickNombre,
    handleClickCorreo,
    handleClickApellido,
    handleClickPassword,
    error,
    isLoading
  }
}