import { ArrowUpRight, MapPin, Star } from "lucide-react";
import MediaCard from "../MediaCard/index.jsx";
import CardSlot from "../CardSlot.jsx";
import "./index.scss";
import { getLocalizedText } from "../../../i18n/getLocalizedText.js";
import { OTEL_CARD_IMAGES } from "../../../config/mediaUrls.js";

/**
 * Partner hotel card. Opens the hotel's website (item.otelLink) in a new tab.
 * Props: item; [bare]; [wrapperClassName]
 */
function HotelCard({ item, bare = false, wrapperClassName = "col-12" }) {
    const title = getLocalizedText(item, "name");
    const rating = Math.max(0, Math.min(5, Math.round(Number(item?.raiting) || 0)));

    return (
        <CardSlot bare={bare} className={wrapperClassName}>
            <MediaCard
                href={item?.otelLink || undefined}
                className="hotel-card"
                image={item?.cardImage && OTEL_CARD_IMAGES + item.cardImage}
                imageAlt={title}
                title={title}
                meta={[{ icon: MapPin, text: getLocalizedText(item, "location") }]}
                footer={item?.otelLink ? (
                    <span className="mcard__arrow" aria-hidden="true">
                        <ArrowUpRight size={18} strokeWidth={1.75} />
                    </span>
                ) : false}
            >
                {rating > 0 && (
                    <div className="hotel-card__stars" role="img" aria-label={`${rating} / 5`}>
                        {Array.from({ length: 5 }, (_, i) => (
                            <Star
                                key={i}
                                size={15}
                                strokeWidth={1.75}
                                className={i < rating ? "is-on" : ""}
                                aria-hidden="true"
                            />
                        ))}
                    </div>
                )}
            </MediaCard>
        </CardSlot>
    );
}

export default HotelCard;
