import ClinicCard from "../ClinicCard/index.jsx";

/**
 * Clinic card for listing grids (same design as ClinicCard, narrower legacy column).
 * Props: item; [bare]; [wrapperClassName]
 */
function ClinicGridCard({ item, bare = false, wrapperClassName = "col-20 col-md-30 col-sm-30 col-xs-30" }) {
    return <ClinicCard id={item?.id} item={item} bare={bare} wrapperClassName={wrapperClassName} />;
}

export default ClinicGridCard;
