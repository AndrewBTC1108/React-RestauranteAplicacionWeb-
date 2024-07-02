import { useEffect } from "react";
import useSWR from "swr"; //Hook de SWR (stale-while-revalidate) para realizar solicitudes de datos con caché automática.
import { useNavigate, useLocation } from "react-router-dom"; //Hook de React Router para navegar entre rutas.
import clienteAxios from "../config/axios";

//funcion arrow
//hook que se exporta, toma 2 argumentos como props, middleware y url
export const useAuth = ({ middleware, url }) => {

    let token = localStorage.getItem('AUTH_TOKEN')
    const navigate = useNavigate() //para enviar al usuario a cualquier url
    const location = useLocation()
    const searchParams = new URLSearchParams(location.search)

    const { data: user, error, mutate } = useSWR(
        token ? '/api/user' : null,  // Hacer la solicitud solo si hay un token
        () =>
            clienteAxios('/api/user', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => res.data)
            .catch((error) => {
                if (error.response.status === 401) {
                    // Token no válido o expirado
                    localStorage.removeItem('AUTH_TOKEN');
                    navigate('/auth/login');
                } else {
                    throw Error(error?.response?.data?.errors);
                }
            })
    )

    const csrf = () => clienteAxios.get('/sanctum/csrf-cookie')

    const registro = async ({setErrores, ...props}) => {
        await csrf()
        try {
            const {data} = await clienteAxios.post('/api/registro', props)
            localStorage.setItem('AUTH_TOKEN', data.token);
            setErrores([])//reiniciar el arreglo de errores
            token = localStorage.getItem('AUTH_TOKEN')
        } catch (error) {
            // console.log(error.response.data.errors)
            setErrores(Object.values(error.response.data.errors))
        }
    }

    const login = async ({setErrores, setStatus, ...props}) => {
        await csrf()
        setErrores([])
        setStatus(null)
        try {
            const { data } = await clienteAxios.post('/api/login', props) //para obtener el token
            localStorage.setItem('AUTH_TOKEN', data.token);
            setErrores([])//reiniciar el arreglo de errores
            token = localStorage.getItem('AUTH_TOKEN')
            await mutate()//forzar a que haga la accion de lvalidacion mas rapido
        } catch (error) {
            setErrores(Object.values(error.response.data.errors))
            // setErrores(Object.values(error?.response?.data?.message))
        }
    }

    const forgotPassword = async ({ setErrores, setStatus, email }) => {
        await csrf()

        setErrores([])
        setStatus(null)

        clienteAxios
            .post('/api/forgot-password', { email })
            .then(response => {
                console.log('Server Response:', response.data);
                setStatus(response.data.status)})
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrores(Object.values(error.response.data.errors))
            })
    }

    const resetPassword = async ({ setErrores, setStatus, ...props }) => {
        await csrf()

        setErrores([])
        setStatus(null)

        clienteAxios
            .post('/api/reset-password', { token: searchParams.get('token'), ...props })
            .then(response =>
                navigate('/auth/login?reset=' + btoa(response.data.status)),
            )
            .catch(error => {
                if (error.response.status !== 422) throw error

                setErrores(Object.values(error.response.data.errors))
            })
    }

    const resendEmailVerification = ({ setStatus }) => {
        const token = localStorage.getItem('AUTH_TOKEN');
        clienteAxios.post('/api/email/verification-notification', null, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => setStatus(response.data.status))
    }

    const logout = async () => {
        try {
            await clienteAxios.post('/api/logout', null, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            localStorage.removeItem('AUTH_TOKEN')
            await mutate(undefined)
        } catch (error) {
            throw Error(error?.response?.data?.errors)
        }
    }

    // console.log(user)
    // console.log(error)
    //useEffect va a escuchar por cambios en user y error
    useEffect(() => {
        if (middleware === 'guest' && url && user) {
            navigate(url)
        }
        if (
            window.location.pathname === '/auth/verify-email' &&
            user?.email_verified_at
        )
            navigate(url)
        if (middleware === 'auth') {
            if (!user) {
                navigate('/auth/login');
            } else if (!user?.email_verified_at) {
                // Aquí puedes cambiar la redirección según tus necesidades
                navigate('/auth/verify-email');  // Por ejemplo, redirige a la página de perfil
            }
        }
        if (middleware === 'guest' && user && user.admin) {
            navigate('/admin')
        }
        if(middleware === 'admin' && user && !user.admin) {
            navigate('/')
        }
        if(middleware === 'auth' && user && user.admin) {
            navigate('/admin')
        }
        if (middleware === 'auth' && error) {
            navigate('/auth/login') //redireccionar al inicio de sesion
        }
        if (window.location.pathname === '/auth/reset-password' && !searchParams.get('token'))
            // Si no hay token, redirigir a la página deseada
            navigate('/auth/login');
    }, [user, error])

    //lo que nos retornara
    return {
        login,
        registro,
        forgotPassword,
        resendEmailVerification,
        resetPassword,
        logout,
        user,
        error
    }
}