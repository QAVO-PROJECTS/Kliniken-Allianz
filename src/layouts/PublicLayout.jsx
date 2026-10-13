import {Outlet} from "react-router-dom";
import {useTranslation} from "react-i18next";
import Navbar from "../components/layout/Navbar/index.jsx";
import Footer from "../components/layout/Footer/index.jsx";
import ScrollToTop from "../components/layout/ScrollToTop/index.jsx";

function PublicLayout() {
    const {t} = useTranslation();
    return (
        <>
            <a href="#main" className="skip-link">{t("common.skipToContent", "Skip to main content")}</a>
            <ScrollToTop/>
            <Navbar/>
            <main id="main" tabIndex={-1} className="site-main">
                <Outlet/>
            </main>
            <Footer/>
        </>
    );
}

export default PublicLayout;
