import "./index.scss"
import back from "/src/assets/ServiceDetailCard.png"
import image from "/src/assets/Subtract.png"
import {IoLocationOutline} from "react-icons/io5";
function HotelCard() {
    return (
        <div className={"col-3"}>
            <div id={"hotelCard"} style={{
                background:`linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), url(${back})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",

            }}>
                <div className={"image"}>
                    <img src={image} />
                    <div className={"card-title"}>
                        <p><IoLocationOutline className={"icon"}/>Almaniya</p>
                        <h5>Universitätsklinikum</h5>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default HotelCard;