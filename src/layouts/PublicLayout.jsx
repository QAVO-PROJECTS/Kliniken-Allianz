import {Outlet} from "react-router-dom";
import Navbar from "../components/layout/Navbar/index.jsx";
import Footer from "../components/layout/Footer/index.jsx";
import ScrollToTop from "../components/layout/ScrollToTop/index.jsx";

function PublicLayout() {
    return (
        <>
            <ScrollToTop/>
            <Navbar/>
            <Outlet/>
            <Footer/>

        </>
    );
}

export default PublicLayout;