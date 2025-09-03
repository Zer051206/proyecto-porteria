import { useState } from "react"
import axiosClient from "../axiosClient"

export function useRegisterForm () {
  const [ password, setPassword ] = useState();
  const [ email, setEmail ] = useState();
  const [ name, setName ] = useState();
  const [ lastName, setLastName ] = useState();

  const handleClickName = (e) => setName(e.target.value);
  const handleClickLastName = (e) => setLastName(e.target.value);
  const handleClickEmail = (e) => setEmail(e.target.value);
  const handleClickPassword = (e) => setPassword(e.target.value);

  const handleRegister = (e) => {
    e.preventDefault();
    try {
      const response = axiosClient.post('/register', {
        name,
        email,
        lastName,
        password
      })
      console.log('Reistro exitoso', response.data)
    } catch {
      console.log('Error en el registro', error.response.data)
    }
  }

  return {
    name,
    email,
    password,
    lastName,
    handleRegister,
    handleClickName,
    handleClickEmail,
    handleClickLastName,
    handleClickPassword,
  }
}