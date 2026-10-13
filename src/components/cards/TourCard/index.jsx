import { useTranslation } from "react-i18next";
import { ArrowRight, BadgeCheck, Hotel, Plane } from "lucide-react";
import MediaCard from "../MediaCard/index.jsx";
import CardSlot from "../CardSlot.jsx";
import "./index.scss";
import { TOUR_CARD_IMG } from "../../../config/mediaUrls.js";
import { getLocalizedText } from "../../../i18n/getLocalizedText.js";

/**
 * Medical tour package card.
 * Props: item; [bare]; [wrapperClassName]
 */
function TourCard({ item, bare = false, wrapperClassName = "col-12 col-md-30 col-sm-30 col-xs-30" }) {
    const { t } = useTranslation();
    const title = getLocalizedText(item, "name");
    const includes = [
        { Icon: Hotel, label: t("tourCard.hotel") },
        { Icon: BadgeCheck, label: t("tourCard.visa") },
        { Icon: Plane, label: t("tourCard.flight") },
    ];

    return (
        <CardSlot bare={bare} className={wrapperClassName}>
            <MediaCard
                to={`/tours/${item?.id}`}
                className="tour-card"
                image={item?.cardImage && TOUR_CARD_IMG + item.cardImage}
                imageAlt={title}
                title={title}
                footer={
                    <span className="tour-card__cta">
                        {t("tourCard.apply")}
                        <ArrowRight size={16} strokeWidth={1.75} aria-hidden="true" />
                    </span>
                }
            >
                <ul className="tour-card__includes">
                    {includes.map(({ Icon, label }) => (
                        <li key={label}>
                            <Icon size={15} strokeWidth={1.75} aria-hidden="true" />
                            {label}
                        </li>
                    ))}
                </ul>
            </MediaCard>
        </CardSlot>
    );
}

export default TourCard;
