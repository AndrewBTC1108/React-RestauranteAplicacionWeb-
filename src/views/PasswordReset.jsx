import { useAuth } from "../hooks/useAuth"
import { useEffect, createRef, useState } from "react"
import Alerta from "../components/Alerta"
import { useLocation } from "react-router-dom"
import AuthSessionStatus from '../components/AuthSessionStatus'
export default function PasswordReset() {
    const location = useLocation()
    const searchParams = new URLSearchParams(location.search);

    const {resetPassword} = useAuth({middleware: 'guest'})

    const emailRef = createRef()
    const passwordRef = createRef()
    const passwordconfirmationRef = createRef()

    const [errores, setErrores] = useState([])
    const [status, setStatus] = useState(null)

    const submitForm = e => {
        e.preventDefault()

        const datos = {
            email: emailRef.current.value,
            password: passwordRef.current.value,
            password_confirmation: passwordconfirmationRef.current.value, //asi lo espera laravel
            setErrores,
            setStatus
        }

        resetPassword(datos)
    }


    useEffect(() => {
        // Obtén el valor del correo electrónico de los parámetros de búsqueda y configúralo en el input
        const emailValue = searchParams.get('email');
        if (emailValue) {
            emailRef.current.value = emailValue;
        }
    }, [searchParams]);
    return (
        <>
            <AuthSessionStatus className="mb-4" status={status} />
            <h1 className="text-4xl font-black">Nueva Password</h1>
            
            <div className="bg-white shadow-md rounded-md mt-10 px-5 py-10">
                <form
                    onSubmit={submitForm}
                    noValidate
                >
                    {errores ? errores.map(error => <Alerta key={error}>{error}</Alerta>) : null}
                    <div className="mb-4">
                        <label
                            htmlFor="email"
                        >Email:</label>
                        <input 
                            type="email" 
                            id="email"
                            className="mt-2 w-full p-3 bg-gray-50"
                            ref={emailRef}
                            name="email"
                            placeholder="Tu Email"
                        />
                    </div>

                    <div className="mb-4">
                        <label
                            htmlFor="password"
                        >Password:</label>
                        <input 
                            type="password" 
                            id="password"
                            className="mt-2 w-full p-3 bg-gray-50"
                            ref={passwordRef}
                            name="password"
                            placeholder="Tu password"
                        />
                    </div>

                    <div className="mt-4">
                        <label 
                            htmlFor="passwordConfirmation"
                        >Confirm Password</label>

                        <input
                            id="passwordConfirmation"
                            type="password"
                            className="mt-2 w-full p-3 bg-gray-50"
                            ref={passwordconfirmationRef}
                            required
                        />
                    </div>
                    <input 
                        type="submit"
                        value="Cambiar Password"
                        className="bg-indigo-600 hover:bg-indigo-800 text-white w-full mt-5 p-3
                        uppercase font-bold cursor-pointer"
                    />
                </form>
            </div>
        </>
    )
}
