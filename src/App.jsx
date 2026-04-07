import './App.css'
import {createBrowserRouter} from "react-router";
import {RouterProvider} from "react-router-dom";
import ROUTES from "./routes/ROUTES.jsx";
import {ToastContainer} from "react-toastify";
import Cookies from "js-cookie";
import {useEffect} from "react";
import {useTranslation} from "react-i18next";
import 'antd/dist/reset.css';
import {useState} from "react";
import SplashScreen from "./components/UserComponents/SplashScreen/index.jsx";
import AOS from 'aos';
import 'aos/dist/aos.css';

function App() {
    const [loading, setLoading] = useState(true);
    const [isFading, setIsFading] = useState(false);
    const token = Cookies.get("klinikenToken");

    if (!token) {
        Cookies.set("klinikenToken", "null");
    }

    const routes = createBrowserRouter(ROUTES);
    const { i18n } = useTranslation();

    useEffect(() => {
        AOS.init({
            duration: 700,
            once: true,
        });
    }, []);

    useEffect(() => {
        // Minimum loading time + fade sequence
        const fadeTimer = setTimeout(() => {
            setIsFading(true);
        }, 1200); // Wait 1.2s then start fading

        const removeTimer = setTimeout(() => {
            setLoading(false);
        }, 1800); // After fade (0.6s), remove component

        // RTL/LTR ve dil ayarı
        document.documentElement.setAttribute('dir', i18n.language === 'arb' ? 'rtl' : 'ltr');
        document.documentElement.setAttribute('lang', i18n.language === 'arb' ? 'ar' : i18n.language);

        // CSS dosyasını dinamik olarak değiştir (isteğe bağlı)
        const styleLink = document.getElementById('app-style') || document.createElement('link');
        styleLink.id = 'app-style';
        styleLink.rel = 'stylesheet';
        styleLink.href = i18n.language === 'arb' ? '/rtl.css' : '/ltr.css';
        document.head.appendChild(styleLink);

        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(removeTimer);
        };
    }, [i18n.language]);
    return (
        <>
            {loading && <SplashScreen isFading={isFading} />}
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