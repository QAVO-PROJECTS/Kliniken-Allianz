import './index.scss'
import image from "/src/assets/ServiceDetailCard.png"
import {IoLocationOutline} from "react-icons/io5";
import {BsArrowRight} from "react-icons/bs";
function ServiceDetailCard() {
    return (
       <div className={"col-3"}>
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