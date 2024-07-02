import useQuiosco from "../hooks/useQuiosco"
export default function Categoria({categoria}) {
    const {handleClickCategoria, categoriaActual} = useQuiosco();
    //destructuring
    const {icono, id, nombre} = categoria
    //operador ternario para asiganr clases de resaltado en el sidebar
    const restaltarCategoriaActual = () => categoriaActual.id === id ? 'bg-amber-400' : 'bg-white'
    return (
        <div className={`${restaltarCategoriaActual()} flex items-center gap-4 border w-full p-3 hover:bg-amber-400 cursor-pointer`}>
            <img 
                src={`/img/icono_${icono}.svg`} 
                alt="Imagen Icono" 
                className="w-12"
            />
            <button 
                className="text.lg font-bold cursor-pointer truncate"
                type="button"
                onClick={ () =>handleClickCategoria(id) }
            >
                {nombre}
            </button>
        </div>
    )
}
