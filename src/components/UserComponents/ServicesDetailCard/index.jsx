import './index.scss'
import {IoLocationOutline} from "react-icons/io5";
import {BsArrowRight} from "react-icons/bs";
import {useNavigate} from "react-router-dom";
import {CLINIC_CARD_IMAGES} from "../../../contants.js";
function ServiceDetailCard({name,desc,img,id}) {
    const navigate = useNavigate();
    return (
       <div className={"col-3 col-md-6 col-sm-6 col-xs-6"} style={{padding:'4px'}} onClick={()=>navigate(`/clinics/${id}`)}>
           <div id={"serviceDetailCard"}>
                <div className={"cardImage"}>
                    <img src={CLINIC_CARD_IMAGES+img} />
                </div>
               <div className={"content"}>
                   <div className={"text"}>
                       <h5>{name}</h5>
                       <p><IoLocationOutline className={"icon"}/> {desc}</p>
                   </div>
                   <BsArrowRight onClick={()=>navigate(`/clinics/${id}`)} className={'arrow'}/>
               </div>
           </div>
       </div>
    );
}

export default ServiceDetailCard;