import { useTranslation } from "react-i18next";
import { Building2, MapPin } from "lucide-react";
import MediaCard from "../MediaCard/index.jsx";
import CardSlot from "../CardSlot.jsx";
import { getLocalizedText } from "../../../i18n/getLocalizedText.js";
import { CLINIC_CARD_IMAGES } from "../../../config/mediaUrls.js";

/**
 * Clinic card (home carousel).
 * Props: item (clinic) — or legacy name/desc/img; id; [bare]; [wrapperClassName]
 */
function ClinicCard({ id, item, name, desc, img, bare = false, wrapperClassName = "col-30 col-md-30 col-sm-30 col-xs-30" }) {
    const { t } = useTranslation();
    const clinicId = id ?? item?.id;
    const title = item ? getLocalizedText(item, "name") : name;
    const location = item ? getLocalizedText(item, "location") : desc;
    const image = item?.clinicCardImage ? CLINIC_CARD_IMAGES + item.clinicCardImage : img;

    return (
        <CardSlot bare={bare} className={wrapperClassName}>
            <MediaCard
                to={`/clinics/${clinicId}`}
                className="clinic-card"
                image={image}
                imageAlt={title}
                title={title}
                badge={<><Building2 size={14} strokeWidth={2} aria-hidden="true" />{t("navbar.clinic")}</>}
                meta={[{ icon: MapPin, text: location }]}
            />
        </CardSlot>
    );
}

export default ClinicCard;
