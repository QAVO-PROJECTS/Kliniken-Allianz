import './index.scss'

/**
 * Section heading. `align` is "center" (default) or "start".
 */
function SectionTitle({ title, desc, eyebrow, align = "center", className = "" }) {
    return (
        <div className={`section-title section-title--${align} ${className}`.trim()}>
            {eyebrow && <span className="eyebrow">{eyebrow}</span>}
            <h2>{title}</h2>
            {desc && <p>{desc}</p>}
        </div>
    );
}

export default SectionTitle;
