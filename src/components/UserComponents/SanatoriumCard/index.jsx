import './index.scss'
import { useNavigate } from "react-router-dom";
import { SANATORIUM_CARD_IMAGES } from "../../../contants.js";
import { useTranslation } from "react-i18next";
import { getLocalizedText } from "../../../utils/getLocalizedText.js";

function SanatoriumCard({ item }) {
    const navigate = useNavigate();
    const { t } = useTranslation();


    return (
        <div className={"col-12 col-md-30 col-sm-30 col-xs-30"} style={{ padding: '4px' }} onClick={() => navigate(`/sanatoriums/${item.id}`)}>
            <div id={"sanatoriumCard"}>
                <div className={"cardImage"}>
                    <img src={SANATORIUM_CARD_IMAGES + item.sanatoriumCardImage} alt={getLocalizedText(item, 'name')} />
                </div>
                <div className={"content"}>
                    <div className={"text"}>
                        <h5>{getLocalizedText(item, 'name')}</h5>
                        <p>{getLocalizedText(item, 'location')}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SanatoriumCard;
