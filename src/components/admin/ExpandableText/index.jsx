import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useAdminT } from "../shared/adminStrings.js";

/** Two-line clamped text with a toggle to reveal the rest (table cells). */
function ExpandableText({ text, fallback = "—" }) {
    const at = useAdminT();
    const [open, setOpen] = useState(false);
    const value = typeof text === "string" ? text.trim() : text;

    if (!value) return <span className="adm-cell-muted">{fallback}</span>;

    const isLong = typeof value === "string" ? value.length > 90 : true;
    return (
        <div className={`adm-clamp${open ? " is-open" : ""}`}>
            <p>{value}</p>
            {isLong && (
                <button
                    type="button"
                    className="adm-icon-btn"
                    aria-expanded={open}
                    aria-label={open ? at("collapse") : at("expand")}
                    onClick={() => setOpen((v) => !v)}
                >
                    <ChevronDown size={16} aria-hidden="true" />
                </button>
            )}
        </div>
    );
}

export default ExpandableText;
