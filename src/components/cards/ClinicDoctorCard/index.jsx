import { useTranslation } from "react-i18next";
import { Briefcase, Star } from "lucide-react";
import MediaCard from "../MediaCard/index.jsx";
import CardSlot from "../CardSlot.jsx";
import "../DoctorCard/index.scss";
import "./index.scss";

/**
 * Doctor card for clinic pages (legacy prop API).
 * Props: id, name, img, [desc]; optional [role], [experience], [rate]; [bare]; [wrapperClassName]
 * Only renders the data it is given — nothing is hard-coded.
 */
function ClinicDoctorCard({
    id,
    name,
    img,
    desc,
    role,
    experience,
    rate,
    bare = false,
    wrapperClassName = "col-3 col-md-6 col-sm-6 col-xs-6",
}) {
    const { t } = useTranslation();
    const rating = Number(rate);

    return (
        <CardSlot bare={bare} className={wrapperClassName}>
            <MediaCard
                to={`/doktor/${id}`}
                className="doctor-card"
                ratio="4 / 5"
                image={img}
                imageAlt={name}
                title={name}
                badge={rating > 0 ? (
                    <><Star size={13} strokeWidth={2} className="doctor-card__star" aria-hidden="true" />{rating.toFixed(1)}</>
                ) : null}
                meta={[{
                    icon: Briefcase,
                    text: experience ? `${experience} ${t("doctorsPage.filters.experienceSuffix")}` : null,
                }]}
            >
                {role && <span className="badge badge--brand doctor-card__role">{role}</span>}
                {desc && <p className="clinic-doctor-card__desc">{desc}</p>}
            </MediaCard>
        </CardSlot>
    );
}

export default ClinicDoctorCard;
