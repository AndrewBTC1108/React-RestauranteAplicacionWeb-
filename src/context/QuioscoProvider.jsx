import {createContext, useState, useEffect} from 'react'
import {toast} from 'react-toastify' //contiene el evento y tipo de toast que se quiere usar
import clienteAxios from '../config/axios';

const QuioscoContext = createContext();

const QuioscoProvider = ({children}) => {
    //hooks
    const [categorias, setCategorias] = useState([]);
    const [categoriaActual, setCategoriaActual] = useState({});//va a comenzar como un objeto vacio
    const [modal, setModal] = useState(false);//va a estar como false, es decir no va a estar visible aun
    const [producto, setProducto] = useState({});//empieza como un objeto vacio
    const [pedido, setPedido] = useState([])//empieza con un array vacio
    const [total, setTotal] = useState(0)

    //useEffect
    useEffect(() => {
        const nuevoTotal = pedido.reduce((total, producto) => (producto.precio * producto.cantidad) + total, 0)
        setTotal(nuevoTotal)
    }, [pedido])//cada que pedido cambie se requiere que se ejecute la funcion para ir calculando el total

    // Función para obtener las categorías
    const obtenerCategorias = async () => {
        const token = localStorage.getItem('AUTH_TOKEN');
        if (token) {
        try {
            const { data } = await clienteAxios('/api/categorias', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            // console.log(data.data);
            setCategorias(data.data);
            setCategoriaActual(data.data[0]); // para ir a la primera posición
        } catch (error) {
            console.log(error);
        }
        }
    };
  
    // Efecto para cargar las categorías cuando el componente se monta
    useEffect(() => {
        obtenerCategorias();
    }, []);

    //Arrow function
    const handleClickCategoria = id => {
        const categoria = categorias.filter(categoria => categoria.id === id)[0]//Para que solo nos muestre el objeto sin el array
        setCategoriaActual(categoria)
    }

    //Arrow function para modal
    const handleClickModal = () => {
        setModal(!modal); //negar la condicion modal, si esta en true lo cambia a false, si esta en false a true
    }

    //arrow function para productos
    const handleSetProducto = producto => {
        setProducto(producto)
    }

    //arrow function para pedidos
    //Por motivos de no mutar el objeto original borrando elementos, de esta forma sacamos ciertos elementos del objeto
    //etsamos quitando del arreglo de producto, la categoria id
    const handleAgregarPedido = ({categoria_id, ...producto}) => {
        // console.log(producto);
        //Actualiza pedidos
        //validamso que en el pedido, haya un produccto con el mismo id que con pedido.id
        if(pedido.some(pedidoState => pedidoState.id === producto.id)){
            const pedidoActualizado = pedido.map(pedidoState => pedidoState.id === producto.id ? producto : pedidoState)//.map va a itearar en el arrelgo sin mutarlo
            setPedido(pedidoActualizado)
            toast.success('Actualizado Correctamente')
        } else {
            //crea nuevos Pedidos
            setPedido([...pedido, producto])//toma una copia de lo que haya en pedido y agregale un producto nuevo
            toast.success('Agregado al Pedido');
        }
    }

    //arrow functio para editar el pedido
    const handleEditarCantidad = id => {
        const productoActualizar = pedido.filter(producto => producto.id === id)[0]
        setProducto(productoActualizar)//ponemos el producto para luego poder verlo en el modal
        setModal(!modal)//negar la condicion modal, si esta en true lo cambia a false, si esta en false a true
    }

    const handleEliminarProductoPedido = id => {
        const pedidoActualizado = pedido.filter(producto => producto.id !== id)//va a traer todos los prodcutos que sean diferentes del id
        setPedido(pedidoActualizado)
        toast.success('Eliminado del Pedido')
    }

    const handleSubmitNuevaOrden = async (logout) => {
        const token = localStorage.getItem('AUTH_TOKEN') //Obtenemos el token
        try {
            //destructuring para sacar el message de data
            const {data} = await clienteAxios.post('/api/pedidos',
            //enviamos respuesta
            {
                total, //total del precio de los productos
                productos: pedido.map(producto => { //todos los productos del pedido
                    return {
                        id: producto.id,
                        cantidad: producto.cantidad
                    }
                })
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            toast.success(data.message)
            setTimeout(() => {
                setPedido([])
            }, 1000);

            //cerrar sesión
            setTimeout(() => {
                //removemos token
                localStorage.removeItem('AUTH_TOKEN');
                logout();
            }, 3000);
        } catch (error) {
            console.log(error)
        }
    }

    //actualizar el estado del pedido,
    const handleClickCompletarPedido = async id => {
        //primero requerimos el token
        const token = localStorage.getItem('AUTH_TOKEN')
        try {
            //al ser put, en el controlador se va a llamar en el metodo update, siguiendo los principios de apirest, al ser put se debe pasar un id
            await clienteAxios.put(`/api/pedidos/${id}`, null, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }) 
        } catch (error) {
            console.log(error)
        }
    }

    const handleClickProductoAgotado = async id => {
        //primero requerimos el token
        const token = localStorage.getItem('AUTH_TOKEN')
        try {
            //al ser put, en el controlador se va a llamar en el metodo update, siguiendo los principios de apirest, al ser put se debe pasar un id
            //la parte de null es el payload, lo que se va a enviar al servidor, en este caso no enviaremos nada
            await clienteAxios.put(`/api/productos/${id}`, null, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }) 
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <QuioscoContext.Provider
            value={{
                categorias,
                categoriaActual,
                handleClickCategoria,
                modal,
                handleClickModal,
                producto,
                handleSetProducto,
                pedido,
                handleAgregarPedido,
                handleEditarCantidad,
                handleEliminarProductoPedido,
                total,
                handleSubmitNuevaOrden,
                handleClickCompletarPedido,
                handleClickProductoAgotado
            }}
        >{children}</QuioscoContext.Provider>
    )
}

export {
    QuioscoProvider
}
export default QuioscoContext