import "./index.scss"
import icon from "/src/assets/icon1.png"
import {FaArrowRightLong} from "react-icons/fa6";
function HomeServiceCard() {
    return (
        <div className={"col-3"}>
            <div id={"homeServCard"}>
                <div className={"icons"}>
                    <img src={icon} />
                </div>
                <h4>Xərçəng müalicəsi</h4>
                <p>Həyat keyfiyyətinizi yüksəltmək üçün ən yeni xərçəng müalicə üsulları.</p>
                <div className={"btn"}>
                    <button>
                        Ətrafll bax <FaArrowRightLong />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default HomeServiceCard;