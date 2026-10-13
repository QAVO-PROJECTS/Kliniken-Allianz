import { useState } from "react";
import { LayoutGrid } from "lucide-react";
import { CATEGORY_IMAGES } from "../../../config/mediaUrls.js";

/** Category artwork with a lucide fallback when the file is missing or fails to load. */
function CategoryIcon({ file, size = 18, iconSize = 16 }) {
    const [failed, setFailed] = useState(false);
    if (!file || failed) return <LayoutGrid size={iconSize} strokeWidth={1.75} aria-hidden="true" />;
    return (
        <img
            src={CATEGORY_IMAGES + file}
            alt=""
            width={size}
            height={size}
            loading="lazy"
            decoding="async"
            onError={() => setFailed(true)}
        />
    );
}

export default CategoryIcon;
