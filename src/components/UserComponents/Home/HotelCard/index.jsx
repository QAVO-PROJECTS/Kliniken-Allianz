import "./index.scss";
import { IoLocationOutline } from "react-icons/io5";
import {OTEL_CARD_IMAGES} from "../../../../contants.js";

function HotelCard({name,desc,img,item}) {
    const handleClick = () => {
        if (item?.otelLink) {
            window.open(item.otelLink, "_blank");
        }
    };
    return (
        <div className={"col-12"}>
            <div
                id={"hotelCard"}
                onClick={handleClick}
                style={{
                    background: `linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(${OTEL_CARD_IMAGES+item?.cardImage})`,
                    backgroundSize: "auto",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center center",
                    cursor: "pointer",

                }}
                // style={{
                //     background: `linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(${img})`,
                //     backgroundSize: "cover",
                //     backgroundRepeat: "no-repeat",
                //     backgroundPosition: "center",
                //
                // }}
            >

                    <div className={"card-title"}>

                        <h5>{item?.name}</h5>

                        <div className="stars">
                            {[...Array(5)].map((_, i) => (
                                <svg
                                    key={i}
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="12"
                                    height="11"
                                    viewBox="0 0 12 11"
                                    fill="none"
                                >
                                    <path
                                        d="M5.23139 0.547924C5.51606 -0.136743 6.48472 -0.136743 6.77006 0.547924L7.93206 3.34126L10.9481 3.58326C11.6867 3.64259 11.9867 4.56459 11.4234 5.04659L9.12539 7.01526L9.82739 9.95859C9.99939 10.6793 9.21539 11.2493 8.58272 10.8633L6.00072 9.28592L3.41872 10.8633C2.78539 11.2499 2.00139 10.6793 2.17339 9.95859L2.87539 7.01526L0.577391 5.04659C0.0147242 4.56459 0.314058 3.64259 1.05339 3.58326L4.06939 3.34126L5.23139 0.547924Z"
                                        fill={i < Math.round(item?.raiting || 0) ? "#FFE030" : "#666"}
                                    />
                                </svg>
                            ))}
                        </div>

                        <p>
                            <IoLocationOutline style={{ marginRight: 5 }} />
                            {item?.location}
                        </p>

                    </div>

            </div>
        </div>
    );
}

export default HotelCard;