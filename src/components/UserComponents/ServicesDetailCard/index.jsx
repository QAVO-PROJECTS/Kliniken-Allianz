import './index.scss'
import image from "/src/assets/ServiceDetailCard.png"
import {IoLocationOutline} from "react-icons/io5";
import {BsArrowRight} from "react-icons/bs";
import {useNavigate} from "react-router-dom";
function ServiceDetailCard() {
    const navigate = useNavigate();
    return (
       <div className={"col-3 col-md-6 col-sm-6 col-xs-6"} style={{padding:'8px'}} onClick={()=>navigate("/clinics/1")}>
           <div id={"serviceDetailCard"}>
                <div className={"cardImage"}>
                    <img src={image} />
                </div>
               <div className={"content"}>
                   <div className={"text"}>
                       <h5>Universitätsklinikum</h5>
                       <p><IoLocationOutline className={"icon"}/> Frankfurt, Almaniya</p>
                   </div>
                   <BsArrowRight className={'arrow'}/>
               </div>
           </div>
       </div>
    );
}

export default ServiceDetailCard;