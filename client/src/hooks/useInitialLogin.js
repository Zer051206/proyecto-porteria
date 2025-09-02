import { useState } from "react"

export function useInitialLogin () {
  const [ password, setPassword ] = useState();
  const [ email, setEmail ] = useState();
  const [ name, setName ] = useState();
  const [ lastName, setLastName ] = useState();

  const handleClickName = (e) => {
    setName(e.target.value)
  }
  const handleClickLastName = (e) => {
    setLastName(e.target.value)
  }
  const handleClickEmail = (e) => {
    setEmail(e.target.value)
  }
  const handleClickPassword = (e) => {
    setPassword(e.target.value)
  }

  return (
    password,
    email,
    name,
    lastName,
    handleClickEmail,
    handleClickLastName,
    handleClickName,
    handleClickPassword
  )
}