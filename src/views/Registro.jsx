import { createRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Alerta from '../components/Alerta'
import { useAuth } from '../hooks/useAuth'

export default function Registro() {
  //para leer lo que ingresamos a los inputs
  const nameRef = createRef()
  const emailRef = createRef()
  const passwordRef = createRef()
  const passwordconfirmationRef = createRef()

  const [errores, setErrores] = useState([]) //para los erroes del formulario, se guardaran los mensajes

  //le asignamos un middleware invitado
  const {registro} = useAuth({
    middleware: 'guest',
    url: '/'
  })


  const handleSubmit = async e => {
    // console.log(nameRef.current.value)
    e.preventDefault(); //prevenir accion por default

    const datos = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      password_confirmation: passwordconfirmationRef.current.value, //asi lo espera laravel
      setErrores
    }
    registro(datos)
    nameRef.current.value = '';
    emailRef.current.value = '';
    passwordRef.current.value = '';
    passwordconfirmationRef.current.value = '';
  }

  return (
    <>
      <h1 className="text-4xl font-black">Crea tu Cuenta</h1>
      <p>Crea tu Cuenta llenando el formulario</p>

      <div className="bg-white shadow-md rounded-md mt-10 px-5 py-10">
        <form
          onSubmit={handleSubmit}
          noValidate
        >
          {errores ? errores.map(error => <Alerta key={error}>{error}</Alerta>) : null}
          <div className="mb-4">
            <label
              className="text-slate-800"
              htmlFor="name"
            >Nombre:</label>
            <input
              type="text"
              id="name"
              className="mt-2 w-full p-3 bg-gray-50"
              name="name"
              placeholder="Tu Nombre"
              ref={nameRef}
            />
          </div>
          <div className="mb-4">
            <label
              className="text-slate-800"
              htmlFor="email"
            >Email:</label>
            <input
              type="email"
              id="email"
              className="mt-2 w-full p-3 bg-gray-50"
              name="email"
              placeholder="Tu Email"
              ref={emailRef}
            />
          </div>
          <div className="mb-4">
            <label
              className="text-slate-800"
              htmlFor="password"
            >Password:</label>
            <input
              type="password"
              id="password"
              className="mt-2 w-full p-3 bg-gray-50"
              name="password"
              placeholder="Tu Password"
              ref={passwordRef}
            />
          </div>
          <div className="mb-4">
            <label
              className="text-slate-800"
              htmlFor="password_confirmation"
            >Repetir Password:</label>
            <input
              type="password"
              id="password_confirmation"
              className="mt-2 w-full p-3 bg-gray-50"
              name="password_confirmation"
              placeholder="Repetir Password"
              ref={passwordconfirmationRef}
            />
          </div>
          <input
            type="submit"
            value="Crear Cuenta"
            className="bg-indigo-600 hover:bg-indigo-800 text-white w-full mt-5 p-3
            uppercase font-bold cursor-pointer"
          />
        </form>
      </div>
      <nav className="mt-5 flex justify-between">
        <Link to="/auth/login">
          ¿Ya tienes cuenta? Inicia Sesión
        </Link>
                <Link to="/auth/forgot-password">
          ¿Olvidaste tu contraseña?
        </Link>
      </nav>
    </>
  )
}
