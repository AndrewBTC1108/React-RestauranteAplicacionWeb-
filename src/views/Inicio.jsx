import useSWR from 'swr'
import Producto from '../components/Producto'
import useQuiosco from '../hooks/useQuiosco'
import clienteAxios from '../config/axios'

export default function Inicio() {
  const {categoriaActual} = useQuiosco()

  // consulta SWR
  const token = localStorage.getItem('AUTH_TOKEN');

  let data = null;
  let isLoading = true;

  if (token) {
    const fetcher = () => clienteAxios('/api/productos', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(data => data.data);

    // Solo utiliza useSWR si hay un token
    const swrResponse = useSWR('/api/productos', fetcher, {
      refreshInterval: 1000 // después de 1 segundo tiene que refrescar la info
    });

    data = swrResponse.data;
    isLoading = swrResponse.isLoading;
  }

  if(isLoading) return 'Cargando....';

  const productos = data.data.filter(producto => producto.categoria_id === categoriaActual.id)


  return (
    <>
      <h1 className='text-4xl font-black'>{categoriaActual.nombre}</h1>
      <p className='text-2xl my-20'>
        Elige y personaliza tu pedido a continuación.
      </p>
      <div className='grid gap-4 grid-cols-1 md:grid-cols2 xl:grid-cols-3'>
        {productos.map(producto => (
          <Producto 
            key={producto.imagen}
            producto={producto}
            botonAgregar ={true}
          />
        ))}
      </div>
    </>
  )
}
