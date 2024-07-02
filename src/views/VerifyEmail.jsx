import { useAuth } from "../hooks/useAuth"
import { useState } from "react"
import Button from "../components/Button"
export default function VerifyEmail() {

    const { logout, resendEmailVerification } = useAuth({
        middleware: 'auth',
        redirectIfAuthenticated: '/',
    })


    const [status, setStatus] = useState(null)
    return (
        <>
            <h1 className="text-4xl font-black">Verificar Email</h1>
            <div className="bg-white shadow-md rounded-md mt-10 px-5 py-10">
                Gracias por registrarte. Antes de empezar, ¿podría verificar su dirección de correo electrónico haciendo clic 
                en el enlace que acabamos de que te acabamos de enviar? Si no has recibido el correo electrónico,
                estaremos encantados de enviarle otro.
            </div>

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-center my-2 bg-green-600 text-white font-bold p-3 uppercase">
                    Se ha enviado un nuevo enlace de verificación a la dirección de correo electrónico que proporcionó durante el registro.
                </div>
            )}

            <div className="mt-4 flex items-center justify-between">
                <Button onClick={() => resendEmailVerification({ setStatus })}>
                    Reenviar correo de verificación
                </Button>

                <button
                    type="button"
                    className="underline text-sm text-gray-600 hover:text-gray-900"
                    onClick={logout}
                >
                    Logout
                </button>
            </div>
        </>
    )
}
