import '../../App.css'
import {Routing} from "@/common/routing";
import {Header} from "@/common/components/Header/Header.tsx";
import s from "./App.module.css";
import { ToastContainer } from 'react-toastify'
import {useGlobalLoading} from "@/common/hooks/useGlobalLoading.ts";
import {LinearProgress} from "@/common/components/LinearProgress/LinearProgress.tsx";

function App() {
    const isGlobalLoading = useGlobalLoading()

  return (
    <>
        <Header/>
        {isGlobalLoading && <LinearProgress />}
        <div className={s.layout}>
      <Routing/>
        </div>
        <ToastContainer />
    </>
  )
}

export default App
