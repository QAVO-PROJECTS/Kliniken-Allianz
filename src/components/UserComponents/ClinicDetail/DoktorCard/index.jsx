import "./index.scss"
import {FaArrowRightLong} from "react-icons/fa6";
import {useNavigate} from "react-router-dom";
import {DOCTOR_IMG_URL} from "../../../../contants.js";
function DoktorCard({id,name,img,desc}) {
    console.log(img)
    const navigate = useNavigate();
    return (
        <div className={"col-3 col-md-6 col-sm-6 col-xs-6"} onClick={()=>navigate(`/doktor/${id}`)}>
            <div id={"doktorCard"}>
                <div className={"image"}>
                    {/*<img src={DOCTOR_IMG_URL+img}/>*/}
                    <img src={img}/>
                </div>
                <div className={"content"}>
                    <h5>{name}</h5>
                    <p>{desc}</p>
                    <div className={"position"}>
                        Dermetology
                    </div>
                </div>
                <div className={'svg'}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="28" viewBox="0 0 64 28" fill="none">
                        <path d="M0 0H63.2269C63.8897 0 64.2267 0.796747 63.7651 1.27236L51 14.4242L63.6713 26.7116C64.155 27.1806 63.823 28 63.1492 28H0V0Z" fill="#FFEFE4"/>
                    </svg>
                    <div className={'svgText'}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="11" viewBox="0 0 12 11" fill="none">
                            <path d="M4.94623 0.5135C5.2309 -0.171167 6.19957 -0.171167 6.4849 0.5135L7.6469 3.30683L10.6629 3.54883C11.4016 3.60817 11.7016 4.53017 11.1382 5.01217L8.84023 6.98083L9.54223 9.92417C9.71423 10.6448 8.93023 11.2148 8.29757 10.8288L5.71557 9.2515L3.13357 10.8288C2.50023 11.2155 1.71623 10.6448 1.88823 9.92417L2.59023 6.98083L0.292235 5.01217C-0.270432 4.53017 0.0289013 3.60817 0.768235 3.54883L3.78423 3.30683L4.94623 0.5135Z" fill="#FE9754"/>
                        </svg>
                        4.3
                    </div>
                </div>

            </div>
        </div>
    );
}

export default DoktorCard;