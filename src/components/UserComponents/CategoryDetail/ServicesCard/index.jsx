import "./index.scss"
import {useNavigate} from "react-router-dom";
import {SERVICE_CARD_IMAGES} from "../../../../contants.js";
function ServicesCardCategory({desc,name,icon,id}) {
    const navigate = useNavigate();
    return (
        <div className={"col-3 col-md-6 col-sm-6 col-xs-6"} style={{padding:"8px"}} onClick={()=>navigate(`/services/${id}`)}>
            <div id={"servCardCategory"} >
                <div>
                    <img src={SERVICE_CARD_IMAGES+icon} />
                </div>
                <h4>{name}</h4>
                <p>{desc}</p>
            </div>
        </div>
    );
}

export default ServicesCardCategory;