import "./index.scss"
import icon from "/src/assets/icon1.png"
import {FaArrowRightLong} from "react-icons/fa6";
import {useNavigate} from "react-router-dom";
function HomeServiceCard() {
    const navigate = useNavigate();
    return (
        <div className={"col-3 col-md-6 col-sm-6 col-xs-6"} style={{padding: "8px"}} onClick={()=>navigate("/category/1")}>
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