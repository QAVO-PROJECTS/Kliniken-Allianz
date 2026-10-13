import { useState } from "react";
import { Star } from "lucide-react";

/**
 * 1–5 star picker (radiogroup). `value` is a number or null.
 * `<RatingPicker value={rating} onChange={setRating} label="Rating" />`
 */
function RatingPicker({ value, onChange, max = 5, label }) {
    const [hover, setHover] = useState(0);
    const shown = hover || value || 0;
    return (
        <div className="adm-rating" role="radiogroup" aria-label={label} onMouseLeave={() => setHover(0)}>
            {Array.from({ length: max }, (_, i) => {
                const n = i + 1;
                return (
                    <button
                        key={n}
                        type="button"
                        role="radio"
                        aria-checked={value === n}
                        aria-label={`${n} / ${max}`}
                        className={`adm-rating__star${n <= shown ? " is-on" : ""}`}
                        onMouseEnter={() => setHover(n)}
                        onFocus={() => setHover(n)}
                        onBlur={() => setHover(0)}
                        onClick={() => onChange(n)}
                    >
                        <Star size={26} strokeWidth={1.5} aria-hidden="true" />
                    </button>
                );
            })}
            <span className="adm-rating__value" aria-hidden="true">{value ? `${value}/${max}` : "—"}</span>
        </div>
    );
}

export default RatingPicker;
