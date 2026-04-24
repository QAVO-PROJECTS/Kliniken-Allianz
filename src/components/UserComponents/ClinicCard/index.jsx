import './index.scss'
import {IoLocationOutline} from "react-icons/io5";
import {BsArrowRight} from "react-icons/bs";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {getLocalizedText} from "../../../utils/getLocalizedText.js";
import {CLINIC_CARD_IMAGES} from "../../../contants.js";
function ClinicCard({name,desc,img,id,item}) {
    const {t} = useTranslation();
    const navigate = useNavigate();
    return (
       <div className={"col-30 col-md-30 col-sm-30 col-xs-30"} style={{padding:'4px'}} onClick={()=>navigate(`/clinics/${id}`)}>
           <div id={"clinicCard"}>
                <div className={"cardImage"}>
                    <img src={CLINIC_CARD_IMAGES+item?.clinicCardImage} />
                    {/*<img src={img} />*/}
                </div>
               <div className={"content"}>
                   <div className={"text"}>
                       <h5>{getLocalizedText(item, 'name')}</h5>
                       <p> {getLocalizedText(item, 'location')}</p>
                   </div>

               </div>
           </div>
       </div>
    );
}

export default ClinicCard;