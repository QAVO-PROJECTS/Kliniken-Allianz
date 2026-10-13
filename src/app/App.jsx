import {useEffect, useState} from "react";
import {RouterProvider} from "react-router-dom";
import {ToastContainer} from "react-toastify";
import {useTranslation} from "react-i18next";
import {useDispatch} from "react-redux";
import "antd/dist/reset.css";
import "./app-shell.scss";
import router from "./router.jsx";
import {startReveal} from "./reveal.js";
import {setLoading as setGlobalLoading} from "./uiSlice.js";
import SplashScreen from "../components/layout/SplashScreen/index.jsx";

// Matches the SplashScreen fade-out transition.
const SPLASH_FADE_MS = 400;
// Never keep visitors on the splash longer than this, even if translations are slow.
const MAX_SPLASH_WAIT_MS = 4000;

function App() {
    const dispatch = useDispatch();
    // Non-suspending: we render the splash ourselves until the first translation file is in.
    const {ready: i18nReady} = useTranslation(undefined, {useSuspense: false});
    const [waitedTooLong, setWaitedTooLong] = useState(false);
    const [splash, setSplash] = useState("visible"); // visible → fading → hidden
    const ready = i18nReady || waitedTooLong;

    useEffect(() => {
        startReveal();
        const timer = setTimeout(() => setWaitedTooLong(true), MAX_SPLASH_WAIT_MS);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!ready) return undefined;
        // Let the app paint underneath, then fade the splash out.
        const frame = requestAnimationFrame(() => setSplash("fading"));
        const timer = setTimeout(() => {
            setSplash("hidden");
            dispatch(setGlobalLoading(false));
        }, SPLASH_FADE_MS);
        return () => {
            cancelAnimationFrame(frame);
            clearTimeout(timer);
        };
    }, [ready, dispatch]);

    return (
        <>
            {splash !== "hidden" && <SplashScreen isFading={splash === "fading"}/>}
            <ToastContainer/>
            {ready && <RouterProvider router={router}/>}
        </>
    );
}

export default App;
