import './App.css'
import {createBrowserRouter} from "react-router";
import {RouterProvider} from "react-router-dom";
import ROUTES from "./routes/ROUTES.jsx";
import {ToastContainer} from "react-toastify";
import Cookies from "js-cookie";

function App() {
    const token = Cookies.get("klinikenToken");

    if (!token) {
        Cookies.set("klinikenToken", "null");
    }


    const routes = createBrowserRouter(ROUTES);

    return (
        <>
            <ToastContainer/>
            <RouterProvider router={routes}/>
            {/*<div className={"container"}>*/}
            {/*    <div className="row">*/}
            {/*        <ServicesCard/>*/}
            {/*        <ServicesCard/>*/}
            {/*    </div>*/}
            {/*</div>*/}
        </>
    )
}

export default App