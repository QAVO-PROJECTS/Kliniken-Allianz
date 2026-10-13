import { useTranslation } from "react-i18next";
import { Briefcase, Star } from "lucide-react";
import MediaCard from "../MediaCard/index.jsx";
import CardSlot from "../CardSlot.jsx";
import "./index.scss";
import { DOCTOR_IMG_URL } from "../../../config/mediaUrls.js";
import { getLocalizedText } from "../../../i18n/getLocalizedText.js";

/**
 * Doctor card: portrait, name, specialty, experience and rating.
 * Props: item (doctor); [bare]; [wrapperClassName]
 */
function DoctorCard({ item, bare = false, wrapperClassName = "col-20 col-md-30 col-sm-30 col-xs-30" }) {
    const { t } = useTranslation();
    const fullName = [getLocalizedText(item, "name"), getLocalizedText(item, "surName")].filter(Boolean).join(" ");
    const role = getLocalizedText(item, "role");
    const rate = Number(item?.rate);
    const experience = item?.experience;

    return (
        <CardSlot bare={bare} className={wrapperClassName}>
            <MediaCard
                to={`/doktor/${item?.id}`}
                className="doctor-card"
                ratio="4 / 5"
                image={item?.doctorImage && DOCTOR_IMG_URL + item.doctorImage}
                imageAlt={fullName}
                title={fullName}
                badge={rate > 0 ? (
                    <><Star size={13} strokeWidth={2} className="doctor-card__star" aria-hidden="true" />{rate.toFixed(1)}</>
                ) : null}
                meta={[{
                    icon: Briefcase,
                    text: experience ? `${experience} ${t("doctorsPage.filters.experienceSuffix")}` : null,
                }]}
            >
                {role && <span className="badge badge--brand doctor-card__role">{role}</span>}
            </MediaCard>
        </CardSlot>
    );
}

export default DoctorCard;
