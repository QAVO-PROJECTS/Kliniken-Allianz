import './index.scss'
import addIcon from "../../../assets/addIcon.svg";
function AddBtn() {
    return (
        <div id={'add-btn'}>
            <img src={addIcon} alt="addIcon"/>
            Yenisini yarat
        </div>
    );
}

export default AddBtn;