import './index.scss'
import { useNavigate } from "react-router-dom";
import { SANATORIUM_CARD_IMAGES } from "../../../contants.js";
import { useTranslation } from "react-i18next";

function SanatoriumCard({ item }) {
    const navigate = useNavigate();
    const { i18n } = useTranslation();

    const getName = () => {
        const lang = i18n.language;
        if (lang === 'en') return item.nameEn || item.name;
        if (lang === 'ru') return item.nameRu || item.name;
        if (lang === 'alm') return item.nameAlm || item.name;
        if (lang === 'arb') return item.nameArab || item.name;
        return item.name;
    };

    const getLocation = () => {
        const lang = i18n.language;
        if (lang === 'en') return item.locationEng || item.location;
        if (lang === 'ru') return item.locationRu || item.location;
        if (lang === 'alm') return item.locationAlm || item.location;
        if (lang === 'arb') return item.locationArab || item.location;
        return item.location;
    };

    return (
        <div className={"col-12 col-md-30 col-sm-30 col-xs-30"} style={{ padding: '4px' }} onClick={() => navigate(`/sanatoriums/${item.id}`)}>
            <div id={"sanatoriumCard"}>
                <div className={"cardImage"}>
                    <img src={SANATORIUM_CARD_IMAGES + item.sanatoriumCardImage} alt={getName()} />
                </div>
                <div className={"content"}>
                    <div className={"text"}>
                        <h5>{getName()}</h5>
                        <p>{getLocation()}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SanatoriumCard;
