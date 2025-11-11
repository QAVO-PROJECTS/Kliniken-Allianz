import './index.scss'
import addIcon from "../../../assets/addIcon.svg";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
function AddBtn({nav}) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    return (
        <div id={'add-btn'} onClick={()=>navigate(nav)}>
            <img src={addIcon} alt="addIcon"/>
            {t("adminPanel.addBtn.text")}
        </div>
    );
}

export default AddBtn;