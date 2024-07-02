import { Link } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import Alerta from '../components/Alerta'
import { useState, createRef } from "react"
import AuthSessionStatus from '../components/AuthSessionStatus'
export default function ForgotPassword() {

    const {forgotPassword} = useAuth({
        middleware: 'guest',
        url: '/'
    })
    const emailRef = createRef()
    const [errores, setErrores] = useState([])
    const [status, setStatus] = useState(null)

    const submitForm = e => {
        e.preventDefault()

        const email = emailRef.current.value

        forgotPassword({email, setErrores, setStatus})
    }
    return (
        <>
            <div className="bg-white shadow-md rounded-md mt-10 px-5 py-10">
                <h1 className="text-4xl font-black">Reestablecer Password</h1>
                <p className="my-4">¿Ha olvidado su password? No hay problema. Indíquenos su dirección de correo electrónico 
                    y le enviaremos un enlace para restablecer la password que le permitirá elegir una nueva.
                </p>
                {/*"We have emailed your password reset link."*/}

                <AuthSessionStatus className="mb-4" status={status} />
                
                <form
                    className="my-4"
                    onSubmit={submitForm}
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
                    <input
                        type="submit"
                        value="Enviar Instrucciones"
                        className="bg-indigo-600 hover:bg-customColorShadow text-white w-full mt-5 p-3
                        uppercase font-bold cursor-pointer"
                    />
                </form>
                <nav className="mt-5 flex justify-between">
                    <Link to="/auth/login">
                        ¿Ya tienes cuenta? Inicia Sesión
                    </Link>
                    <Link to="/auth/registro">
                        ¿No tienes cuenta? Crea una
                    </Link>
                </nav>
            </div>
        </>
    )
}
