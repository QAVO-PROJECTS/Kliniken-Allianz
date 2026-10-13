import MediaCard from "../MediaCard/index.jsx";
import CardSlot from "../CardSlot.jsx";
import "./index.scss";

/**
 * Clinic teaser shown on service pages (links to the clinic).
 * Props: id, name, desc, img; [bare]; [wrapperClassName]
 */
function ServiceDetailCard({ id, name, desc, img, bare = false, wrapperClassName = "col-12 col-md-30 col-sm-30 col-xs-30" }) {
    return (
        <CardSlot bare={bare} className={wrapperClassName}>
            <MediaCard
                to={`/clinics/${id}`}
                className="service-detail-card"
                image={img}
                imageAlt={name}
                title={name}
            >
                {desc && <p className="service-detail-card__desc">{desc}</p>}
            </MediaCard>
        </CardSlot>
    );
}

export default ServiceDetailCard;
