//Dependicas o Hooks de React
import ReactModal from 'react-modal'
import {Outlet} from 'react-router-dom'
import useQuiosco from '../hooks/useQuiosco'
import { ToastContainer } from 'react-toastify'
import { useAuth } from '../hooks/useAuth'
//Componentes
import Sidebar from '../components/Sidebar'
import Resumen from '../components/Resumen'
import ModalProducto from '../components/ModalProducto'
//funciones 

//hojas de estilo css
import "react-toastify/dist/ReactToastify.css"

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};
ReactModal.setAppElement('#root')

export default function layout() {

  useAuth({middleware: 'auth'})
  
  const {modal} = useQuiosco()

  // console.log(user)
  // console.log(error)
  return (
    <>
      <div className='md:flex'>
        <Sidebar />

        <main className='flex-1 h-screen overflow-y-scroll bg-gray-100 p-3'>
          <Outlet />
        </main>
        <Resumen />
      </div>

      <ReactModal isOpen={modal} style={customStyles}>
        <ModalProducto />
      </ReactModal>

      <ToastContainer />
    </>
  )
}
