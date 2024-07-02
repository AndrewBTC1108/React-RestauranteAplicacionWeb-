import { useContext } from "react"
import QuioscoContext from "../context/QuioscoProvider"
//para poder comunicar con los componentes
const useQuiosco = () => {
    return useContext(QuioscoContext)
}

export default useQuiosco