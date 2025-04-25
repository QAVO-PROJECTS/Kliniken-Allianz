import "./index.scss"
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import main from "/src/assets/NoResult.svg"
function NotResult() {
    const { t } = useTranslation();

    return (
        <div className={"notResult"}>
            <div style={{ width: "442px"
            }}>
                <img src={main} alt="Not Found" className={"notResultImage"} />
                <h2>Oops, nothing matched your search.</h2>
                <p>No worries, sometimes a new search brings better results!</p>
                <div style={{ textAlign: "center" }}>
                    <button>
                        <Link to={"/"} style={{ color: "white" }}>
                            Go Back
                        </Link>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default NotResult;
