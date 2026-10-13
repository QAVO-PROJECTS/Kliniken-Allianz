import { Star } from "lucide-react";

/** Filled star used as the rating icon in doctor cards (MediaCard passes size / strokeWidth / aria-hidden). */
function RatingStar(props) {
    return <Star {...props} className="doctor-card__star" />;
}

export default RatingStar;
