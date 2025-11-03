import './index.scss'
import addIcon from "../../../assets/addIcon.svg";
import {useNavigate} from "react-router-dom";
function AddBtn({nav}) {
    const navigate = useNavigate();
    return (
        <div id={'add-btn'} onClick={()=>navigate(nav)}>
            <img src={addIcon} alt="addIcon"/>
            Yenisini yarat
        </div>
    );
}

export default AddBtn;