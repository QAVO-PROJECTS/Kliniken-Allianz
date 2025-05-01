import "./notFound.scss"
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import main from "/src/assets/404.png"
function NotFound() {
    const { t } = useTranslation();

    return (
        <div className={"notFound"}>
            <div style={{ width: "397px" }}>
                <img src={main} alt="Not Found" className={"notFoundImage"} />
                <h2>Page Not Found – 404</h2>
                <p>But don’t worry, we’ll help you find your way back!</p>
                <div style={{ textAlign: "center" }}>
                    <button className={"notResultBtn"}>
                        <Link to={"/"} style={{ color: "white" }}>
                            Go Back
                        </Link>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default NotFound;
