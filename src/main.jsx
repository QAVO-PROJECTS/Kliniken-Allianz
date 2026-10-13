import {createRoot} from "react-dom/client";
import {Provider} from "react-redux";
import "./index.scss";
import "./i18n/index.js";
import {store} from "./app/store.js";
import App from "./app/App.jsx";

createRoot(document.getElementById("root")).render(
    <Provider store={store}>
        <App/>
    </Provider>
);
