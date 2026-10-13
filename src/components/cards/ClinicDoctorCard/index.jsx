import { useTranslation } from "react-i18next";
import { Briefcase } from "lucide-react";
import MediaCard from "../MediaCard/index.jsx";
import CardSlot from "../CardSlot.jsx";
import "../DoctorCard/index.scss";
import "./index.scss";
import RatingStar from "../DoctorCard/RatingStar.jsx";

/**
 * Doctor card for clinic pages (legacy prop API).
 * Props: id, name, img, [desc]; optional [role], [experience], [rate]; [bare]; [wrapperClassName]
 * Only renders the data it is given; nothing is hard-coded.
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
                meta={[
                    { icon: RatingStar, text: rating > 0 ? <span className="tabular">{rating.toFixed(1)}</span> : null },
                    {
                        icon: Briefcase,
                        text: experience ? `${experience} ${t("doctorsPage.filters.experienceSuffix")}` : null,
                    },
                ]}
            >
                {role && <span className="badge badge--brand doctor-card__role">{role}</span>}
                {desc && <p className="clinic-doctor-card__desc">{desc}</p>}
            </MediaCard>
        </CardSlot>
    );
}

export default ClinicDoctorCard;
