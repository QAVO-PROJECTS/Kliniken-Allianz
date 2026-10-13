import {createRoot} from "react-dom/client";
import {Provider} from "react-redux";
import "@fontsource-variable/geist";
import "@fontsource/ibm-plex-sans-arabic/400.css";
import "@fontsource/ibm-plex-sans-arabic/500.css";
import "@fontsource/ibm-plex-sans-arabic/600.css";
import "@fontsource/ibm-plex-sans-arabic/700.css";
import "./index.scss";
import "./i18n/index.js";
import {store} from "./app/store.js";
import App from "./app/App.jsx";

createRoot(document.getElementById("root")).render(
    <Provider store={store}>
        <App/>
    </Provider>
);
