import { createBrowserRouter } from 'react-router-dom'
import Layout from './layouts/Layout'
import AuthLayout from './layouts/AuthLayout'
import AdminLayout from './layouts/AdminLayout'
import Ordenes from './views/Ordenes'
import Productos from './views/Productos'
import Inicio from './views/Inicio'
import Login from './views/Login'
import Registro from './views/Registro'
import ForgotPassword from './views/ForgotPassword'
import VerifyEmail from './views/VerifyEmail'
import PasswordReset from './views/PasswordReset'
import NotFound from './views/NotFound'

//element es un componente Padre, createBrowserRouter, crea la ruta y cuando entremos a la ruta
//cargara el componente, children son los hijos del componente Padre en la ruta definida
//Index es cuando no se va a especificar una ruta
const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                index: true,
                element: <Inicio />
            }
        ]
    },
    {
        path: '/auth',
        element: <AuthLayout />,
        children: [
            {
                path: '/auth/login',
                element: <Login />
            },
            {
                path: '/auth/registro',
                element: <Registro />
            },
            {
                path: '/auth/forgot-password',
                element: <ForgotPassword />
            },
            {
                path: '/auth/reset-password',
                element: <PasswordReset />
            },
            {
                path: '/auth/verify-email',
                element: <VerifyEmail />
            }
        ]
    },
    {
        path: '/admin',
        element: <AdminLayout />,
        children: [
            {
                index: true,
                element: <Ordenes />
            },
            {
                path: '/admin/productos',
                element: <Productos />
            }
        ]
    },
    {// Ruta para manejar errores 404
        path: '*',
        element: <NotFound />
    }
]);

export default router