import { createRef, useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Alerta from '../components/Alerta'
import { useAuth } from '../hooks/useAuth'
import AuthSessionStatus from '../components/AuthSessionStatus'

export default function Login() {
    //para leer lo que ingresamos a los inputs
    const emailRef = createRef()
    const passwordRef = createRef()

    const location = useLocation();
  
    const [errores, setErrores] = useState([]) //para los erroes del formulario, se guardaran los mensajes
    const [status, setStatus] = useState(null)

    //va a tomar un middleware de invitado, y su url sera al inicio principal de la aplicacion
    const {login} = useAuth({
      middleware: 'guest',
      url: '/'
    })
  
    useEffect(() => {
      const queryParams = new URLSearchParams(location.search);
      const resetParam = queryParams.get('reset');
  
      if (resetParam && resetParam.length > 0 && errores.length === 0) {
          setStatus(atob(resetParam));
      } else {
          setStatus(null);
      }
  }, [location.search, errores]);

    const handleSubmit = async e => {
      // console.log(nameRef.current.value)
      e.preventDefault(); //prevenir accion por default
  
      const datos = {
        email: emailRef.current.value,
        password: passwordRef.current.value,
        setErrores,
        setStatus
      }
      login(datos)
    }
  return (
    <>
      <AuthSessionStatus className="mb-4" status={status} />
      <h1 className="text-4xl font-black">Iniciar Sesión</h1>
      <p>Para Crear un pedido debes iniciar sesión</p>

      <div className="bg-white shadow-md rounded-md mt-10 px-5 py-10">
        <form
          onSubmit={handleSubmit}
          noValidate
        >
          {errores ? errores.map(error => <Alerta key={error}>{error}</Alerta>) : null}
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
          <input 
            type="submit"
            value="Iniciar Sesión"
            className="bg-indigo-600 hover:bg-indigo-800 text-white w-full mt-5 p-3
            uppercase font-bold cursor-pointer"
          />
        </form>
      </div>
      <nav className="mt-5 flex justify-between">
        <Link to="/auth/registro">
          ¿No tienes cuenta? Crea una
        </Link>
        <Link to="/auth/forgot-password">
          ¿Olvidaste tu contraseña?
        </Link>
      </nav>
    </>
  )
}
