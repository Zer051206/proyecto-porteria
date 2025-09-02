import { useInitialLogin } from "../hooks/useInitialLogin"


export function InitialLogin () {

  const { password, name, lastName, email, handleClickEmail, handleClickLastName, handleClickName, handleClickPassword } = useInitialLogin

  return (
    <form>
      <fieldset>
        <legend>Información personal</legend>
        <label>
          Nombre:
          <input type="text" value={name} onChange={handleClickName} />
        </label>
        <label>
          Apellido:
          <input type="text" value={lastName} onChange={handleClickLastName} />
      </label>
      </fieldset>
      <fieldset>
        <legend>Datos de la cuenta</legend>
        <label>
          Correo electronico: 
          <input type="email" value={email} onChange={handleClickEmail} />
        </label>
        <label>
          Contraseña: 
          <input type="password" value={password} onChange={handleClickPassword} />
        </label>
      </fieldset>
    </form>
  )
}