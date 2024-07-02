import Axios from "axios";
//Creando un cliente de axios para consultar la API
const clienteAxios = Axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Accept' : 'application/json',
        'X-Requested-With' : 'XMLHttpRequest'
    },
    withCredentials: true
})

export default clienteAxios
