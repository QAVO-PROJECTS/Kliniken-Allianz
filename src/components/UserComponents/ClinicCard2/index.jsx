import './index.scss'
import {IoLocationOutline} from "react-icons/io5";
import {BsArrowRight} from "react-icons/bs";
import {useNavigate} from "react-router-dom";
import {CLINIC_CARD_IMAGES} from "../../../contants.js";
function ClinicCard2({item}) {
    const navigate = useNavigate();
    return (
       <div className={"col-12 col-md-30 col-sm-30 col-xs-30"} style={{padding:'4px'}} onClick={()=>navigate(`/clinics/${item.id}`)}>
           <div id={"clinicCard2"}>
                <div className={"cardImage"}>
                    <img src={CLINIC_CARD_IMAGES+item.clinicCardImage} />
                    {/*<img src={img} />*/}
                </div>
               <div className={"content"}>
                   <div className={"text"}>
                       <h5>{item.name}</h5>
                       <p> {item.location}</p>
                   </div>

               </div>
           </div>
       </div>
    );
}

export default ClinicCard2;