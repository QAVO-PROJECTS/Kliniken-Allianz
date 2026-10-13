import "./index.scss";
import SanatoriumCard from "../SanatoriumCard/index.jsx";

/**
 * Sanatorium card used in "related" sliders; fills its container width.
 * Props: item; [bare]; [wrapperClassName]
 */
function SanatoriumFeatureCard({ item, bare = false, wrapperClassName = "col-12 col-md-30 col-sm-30 col-xs-30 sanatorium-feature-slot" }) {
    return <SanatoriumCard item={item} bare={bare} wrapperClassName={wrapperClassName} />;
}

export default SanatoriumFeatureCard;
