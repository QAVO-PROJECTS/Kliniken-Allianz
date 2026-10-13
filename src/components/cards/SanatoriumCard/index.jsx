import { MapPin } from "lucide-react";
import MediaCard from "../MediaCard/index.jsx";
import CardSlot from "../CardSlot.jsx";
import { SANATORIUM_CARD_IMAGES } from "../../../config/mediaUrls.js";
import { getLocalizedText } from "../../../i18n/getLocalizedText.js";

/**
 * Sanatorium card.
 * Props: item; [bare]; [wrapperClassName]
 */
function SanatoriumCard({ item, bare = false, wrapperClassName = "col-12 col-md-30 col-sm-30 col-xs-30" }) {
    const title = getLocalizedText(item, "name");

    return (
        <CardSlot bare={bare} className={wrapperClassName}>
            <MediaCard
                to={`/sanatoriums/${item?.id}`}
                className="sanatorium-card"
                image={item?.sanatoriumCardImage && SANATORIUM_CARD_IMAGES + item.sanatoriumCardImage}
                imageAlt={title}
                title={title}
                meta={[{ icon: MapPin, text: getLocalizedText(item, "location") }]}
            />
        </CardSlot>
    );
}

export default SanatoriumCard;
