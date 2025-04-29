import "./index.scss"
import image from "/src/assets/doktor.jpg";
import {FaArrowRightLong} from "react-icons/fa6";
import {useNavigate} from "react-router-dom";
function DoktorCard() {
    const navigate = useNavigate();
    return (
        <div className={"col-3 col-md-6 col-sm-6 col-xs-6"} onClick={()=>navigate("/doktor/1")}>
            <div id={"doktorCard"}>
                <div className={"image"}>
                    <img src={image}/>
                </div>
                <div className={"content"}>
                    <h5>Dr. Harry Donal</h5>
                    <p>Xərçəng müalicəsi</p>
                </div>
                <div style={{textAlign:"center"}}>
                    <button>
                        <FaArrowRightLong />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DoktorCard;